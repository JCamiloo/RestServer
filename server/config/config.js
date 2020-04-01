process.env.PORT = process.env.PORT || 3000; 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let connection;

if (process.env.NODE_ENV === 'dev') {
  connection = 'mongodb://localhost:27017/coffeeShop'
} else {
  connection = 'mongodb+srv://juan:juan1234@cluster0-6u7vf.mongodb.net/coffeeShop'
}

process.env.CONNECTION = connection;