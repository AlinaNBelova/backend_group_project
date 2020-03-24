const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000 // this needs to be changed to 8080 for heroku
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const chat = require('http').createServer(app);
const io = require('socket.io')(chat);
usernames = [];

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(cookieParser())
// this is where your session setup would go
// app.use(session({
//  secret: process.env.SESSION_SECRET
//}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req,res) => {
    res.status(200).render("index");
})

app.get("/signup", (req,res) => {
    res.status(200).render("signup");
})

app.get("/chat", (req,res) => {
    res.status(200).render("chat");
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



app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});

chat.listen(3001, () => {
    console.log('chat is running');
});
