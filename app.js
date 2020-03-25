
const express = require('express');
const app = express()
const PORT = process.env.PORT || 3001 // this needs to be changed to 8080 for heroku
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const chat = require('http').createServer(app);
const io = require('socket.io')(chat);
usernames = [];

const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const BlockchainNode = require('./BlockchainNode');
const fetch = require('node-fetch');

let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);
let transactions = [];  //list of Transaction objects 
let nodes = []; //list of BlockchainNode objects



app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(cookieParser())


app.use(bodyParser.json());

app.get('/', (req, res) => {

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

app.get('/resolve', (req, res) => {

    //anytime a node has to resolve the block chain, it will call this route
    // before any node mines, call the resove path
    // nodes is a collection with all of the nodes on the network

    //1. loop through out nodes 
    //fetch to node.url/blockchain 
    // compare the length of the current blockchain length with the other nodes 
    // if the length is greater than the current node, then replace the blockchain 
    // node[0].url = "localhost:3001"

    console.log(nodes);
    nodes.forEach(node => {

        fetch(node.url + '/blockchain')
            .then(response => {
                return response.json()
            })
            .then(otherNodeBlockchain => {

                if (blockchain.blocks.length < otherNodeBlockchain.blocks.length) {
                    blockchain = otherNodeBlockchain;
                }

                res.send(blockchain)
            })
    })
    //larger blockchain wins over the smaller blockchain
})

app.get('/nodes', (req, res) => {
    res.json(nodes);
})

app.post('/nodes/register', (req, res) => {

    let nodesList = req.body.msg;

    nodesList.forEach(nodeObj => {
        let node = new BlockchainNode(nodeObj.url);

        nodes.push(node);
    })

    res.json(nodes);
})

app.get('/blockchain', (req, res) => {

    //create genesis block

    res.json(blockchain);
})

app.post('/transactions', (req, res) => {

    //this info comes from an ejs form. and submitted using post method
    let user = req.body.user;
    let msg = req.body.msg;

    //create a Transaction object
    let transaction = new Transaction(user, msg);

    //store in the transactions list 
    transactions.push(transaction);

    res.json(transactions);

})


app.get('/mine', (req, res) => {

    let block = blockchain.getNextBlock(transactions)
    blockchain.addBlock(block);

    transactions = [];

    res.json(block);
})


chat.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
})



