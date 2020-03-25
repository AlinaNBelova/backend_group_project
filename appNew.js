const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3001 // this needs to be changed to 8080 for heroku
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const chat = require('http').createServer(app);
const io = require('socket.io')(chat);
const models = require('./models');
const SALT_ROUNDS = 10;
usernames = [];

app.set("view engine", "ejs");
app.use(express.json());

app.use(express.static("public"));

app.use(cookieParser())
// this is where your session setup would go
app.use(session({
    secret: 'process.env.SESSION_SECRET',
    cookie: { secure: false, maxAge: 14 * 24 * 60 * 60 * 1000 }
}))

app.use(require('./routes'));
app.use(require('./routes/signup.js'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// let auth = (req,res,next)=>{
//     if (req.session.email){
//         next();
//     }
//     else{
//         res.redirect('/signup');
//     }
    
// }

app.get("/", (req,res) => {
    res.status(200).render("index");
})

app.get("/signup", (req,res) => {
    res.status(200).render("signup");
})
app.post("/signup",(req,res)=>{
    console.log("Step 1 of user creation...")
    let email = req.body.email
    let user = req.body.user
    let password =req.body.password

    models.user.findOne({
        where:{email: email} })
    .then (results=>{
            console.log(results);
            if(results==null){
                    let newUser = models.user.build({
                        email: email,
                        user: user,
                        password: password
                    })
                    console.log(email, user,password)
                    newUser.save()
                    .then(savedEmail=>{
                        if(savedEmail!=null){
                            res.render('signup')
                        }
                        else{
                            res.render('signup', {message:"User already exists"})
                            console.log("User already exists1");
                        }
                    })
            }else{
                res.render('signup', {message:"User already exists"})
                console.log("User already exists2")
        
            }

                    
                    
        })
    
    // 
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


chat.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});

