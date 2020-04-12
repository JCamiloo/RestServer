process.env.PORT = process.env.PORT || 3000; 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.TOKEN_CADUCITY = '7d';
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'development-seed';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1026312298849-h4gr8qt00eco43rb3oh84l0tr9qmb43r.apps.googleusercontent.com'; 

let connection;

if (process.env.NODE_ENV === 'dev') {
  connection = 'mongodb://localhost:27017/coffeeShop'
} else {
  connection = process.env.MONGO_URI;
}

process.env.CONNECTION = connection;