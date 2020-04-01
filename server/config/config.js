process.env.PORT = process.env.PORT || 3000; 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let connection;

if (process.env.NODE_ENV === 'dev') {
  connection = 'mongodb://localhost:27017/coffeeShop'
} else {
  connection = process.env.MONGO_URI;
}

process.env.CONNECTION = connection;