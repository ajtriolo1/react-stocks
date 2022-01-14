import yfinance as yf
import certifi
from pymongo import MongoClient
import datetime as dt

client = MongoClient('mongodb+srv://admin:passwordpassword@cluster0.my9iz.mongodb.net/StocksDatabase?retryWrites=true&w=majority', tlsCAFile=certifi.where())

db=client.StocksDatabase

orders = db.orders
portfolios = db.portfolios
transactions = db.transactions

for order in orders.find():
    userId, ticker, limitPrice, quantity = order['userId'], order['ticker'], order['price'], order['quantity']
    currentPrice = yf.Ticker(ticker).info['regularMarketPrice']
    portfolio = list(portfolios.find({'userId':userId, 'ticker':ticker}))
    if order['order_type'] == 'Limit':
        if order['buy_sell'] == 'buy':
            if currentPrice <= limitPrice:
                transactions.insert_one({
                    'userId':userId, 
                    'ticker':ticker, 
                    'quantity':quantity, 
                    'price':currentPrice, 
                    'total':currentPrice*quantity, 
                    'transaction_type':'buy',
                    'owned': quantity,
                    'date': dt.datetime.now().strftime('%B %e %Y, %H:%M:%S %p')
                })
                print('Inserted transaction')
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
