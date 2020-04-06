process.env.PORT = process.env.PORT || 3000; 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.TOKEN_CADUCITY = 60 * 60 * 24 * 30;
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'development-seed';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1026312298849-o43erq05v71sikoquc3gnb4bp7bd5nhg.apps.googleusercontent.com'; 

let connection;

if (process.env.NODE_ENV === 'dev') {
  connection = 'mongodb://localhost:27017/coffeeShop'
} else {
  connection = process.env.MONGO_URI;
}

process.env.CONNECTION = connection;