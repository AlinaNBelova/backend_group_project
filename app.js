const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const container = require('./container');

container.resolve(function(users) {
  const app = SetupExpress();

  function SetupExpress(){
      const app = express();
      const app2 = http.createServer(app);
      app.listen(3000,() => {
          console.log('Listening on port 3000');
          
      });
      configureExpress(app);
      const router = require('express-promise-router') ();
      users.SetRouting(router);
  
      app.use(router)
      
  }


  function configureExpress(app){
      app.use(express.static('public'));
      app.use(cookieParser());
      app.set('view engine', 'ejs');
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended:true}));

      // app.use(validator());
      // app.use(session({
      //     secret: 'thisisasecretkey',
      //     resave:true,
      //     saveInitialized: true,
      //     store: indexedDB
      // }))

  }
})