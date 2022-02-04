import yfinance as yf
import certifi
from pymongo import MongoClient
import datetime as dt
import pytz
import time
from dotenv import load_dotenv

load_dotenv()

import os

client = MongoClient('mongodb+srv://{}:{}@cluster0.my9iz.mongodb.net/StocksDatabase?retryWrites=true&w=majority'.format(os.environ.get('DB_USERNAME'), os.environ.get('DB_PASSWORD')), tlsCAFile=certifi.where())

db=client.StocksDatabase

orders = db.orders
portfolios = db.portfolios
transactions = db.transactions
users = db.users

while(1):
    for order in orders.find():
        userId, ticker, limitPrice, quantity = order['userId'], order['ticker'], order['price'], order['quantity']
        currentPrice = yf.Ticker(ticker).info['regularMarketPrice']
        portfolio = list(portfolios.find({'userId':userId, 'ticker':ticker}))
        user = users.find_one({'_id':userId})
        if order['order_type'] == 'Limit':
            if order['buy_sell'] == 'buy':
                if(user['balance'] < currentPrice*quantity):
                    continue
                if currentPrice <= limitPrice:
                    transactions.insert_one({
                        'userId':userId, 
                        'ticker':ticker, 
                        'quantity':quantity, 
                        'price':currentPrice, 
                        'total':currentPrice*quantity, 
                        'transaction_type':'buy',
                        'owned': quantity,
                        'date': dt.datetime.now(pytz.timezone('US/Eastern')).strftime('%B %e %Y, %I:%M:%S %p').replace(' 0', ' ').replace('  ', ' ')
                    })
                    if portfolio == []:
                        portfolios.insert_one({
                            'userId':userId,
                            'ticker':ticker, 
                            'quantity':quantity,
                            'total':currentPrice*quantity
                        })
                    else:
                        portfolios.update_one({'userId':userId, 'ticker':ticker}, {"$set":{
                            'quantity': portfolio[0]['quantity'] + quantity,
                            'total': portfolio[0]['total'] + currentPrice*quantity
                        }})
                    orders.delete_one(order)
                    print('Executed buy limit order for', ticker)
            else:
                if portfolio == [] or (quantity > portfolio[0]['quantity']):
                    orders.delete_one(order)
                else:
                    if currentPrice >= limitPrice:
                        remaining = quantity
                        newTotal = portfolio[0]['total']
                        for transaction in transactions.find({'userId':userId, 'ticker':ticker, 'transaction_type':'buy', 'owned':{'$gt': 0}}):
                            if remaining == 0:
                                break
                            if transaction['owned'] < remaining:
                                remaining -= transaction['owned']
                                newTotal -= transaction['price']*transaction['owned']
                                transactions.update_one({'userId':userId, 'ticker':ticker}, {"$set":{
                                    'owned':0
                                }})
                            else:
                                newOwned = transaction['owned']-remaining
                                newTotal -= remaining*transaction['price']
                                transactions.update_one({'_id':transaction['_id'], 'userId':userId, 'ticker':ticker}, {"$set":{
                                    'owned':newOwned
                                }})
                                remaining = 0
                        transactions.insert_one({
                            'userId':userId, 
                            'ticker':ticker, 
                            'quantity':quantity, 
                            'price':currentPrice, 
                            'total':currentPrice*quantity, 
                            'transaction_type':'sell',
                            'owned': 0,
                            'date': dt.datetime.now(pytz.timezone('US/Eastern')).strftime('%B %e %Y, %I:%M:%S %p').replace(' 0', ' ').replace('  ', ' ')
                        })
                        newQuantity = portfolio[0]['quantity'] - quantity
                        if newQuantity == 0:
                            portfolios.delete_one({'userId':userId, 'ticker':ticker})
                        else:
                            portfolios.update_one({'userId':userId, 'ticker':ticker}, {"$set":{
                                'quantity': newQuantity,
                                'total': newTotal
                            }})
                        orders.delete_one(order)
                        print('Executed sell limit order for', ticker)
    print('Sleeping...')
    time.sleep(60)



