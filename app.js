
const express =  require('express');
const path =  require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const csrf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);
const outRoutes = require('./routes/out');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');  

const csrfProtection = csrf();

  





app.set('view engine','ejs');
app.set('views','views');


const MONGODB_URI =
  'mongodb+srv://hell:tcvQfcclS2WJv3zM@livecandle-4mrbf.mongodb.net/shop';
// mongodb+srv://hell:<password>@livecandle-4mrbf.mongodb.net/test
// tcvQfcclS2WJv3zM


const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname,"public")));
  

  app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
  app.use(csrfProtection);


  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });
 
  
  app.use('/admin',adminRoutes);
  app.use(outRoutes);
  app.use(shopRoutes);


  
mongoose
  .connect(MONGODB_URI)
  .then(result => {
      console.log('listening on 3000')
    app.listen(3001);
  })
  .catch(err => {
    console.log(err);
  });