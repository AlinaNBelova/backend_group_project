const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const container = require('./container');
const chat = require('http').createServer(app);


container.resolve(function(users) {
  const app = SetupExpress();

  function SetupExpress(){
      const app = express();
      const app2 = http.createServer(app);
      configureExpress(app);
      app.get("/", (req,res) => {
      res.render("index")
    })
      const router = require('express-promise-router') ();
      users.SetRouting(router);
      app.use(router)
      
      app.listen(3000,() => {
          console.log('Listening on port 3000');
          
      });
     
      
  }


  function configureExpress(app){
    app.use(express.static("public"));
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


app.get('/', function(req, res){
    res.sendFile(__dirname + './routes/chat.js');
});

io.sockets.on('connection',(socket)=>{
	console.log('Socket Connected...');

	socket.on('new user',(data, callback)=>{
		if(usernames.indexOf(data) != -1){
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}
	});

	function updateUsernames(){
		io.sockets.emit('usernames', usernames);
	}

	socket.on('send message', (data)=>{
		io.sockets.emit('new message', {msg: data, user:socket.username});
	});

	socket.on('disconnect',(data)=>{
		if(!socket.username){
			return "";
		}

		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	});
});

io = require('socket.io').listen(chat);
usernames = [];