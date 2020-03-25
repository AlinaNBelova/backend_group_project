//represent the block inside of a blockchain

class Block {
    constructor() {
        // value of index 0, 1, 2, 3 depending on the position of the block
        //inside of the blockchain
        this.index = 0;
        this.previousHash = "";
        this.hash = "";
        this.nonce = 0;
        this.msg = "";
        this.transactions = []; //a list of transactions
    }

    //SHA256(transaction + index + previoushash +noce)

    get key() {

        // index 0, 1, 2, 3 dependin on position of the block
        // magic: nonce . Nonce is anumber that will be incremented 
        //and fed into the key to generate a hash form the SHA256 funcitions
        //this.transactions is an array of objects = convert to string
        return JSON.stringify(this.transactions) + this.index + this.previousHash + this.nonce;
    }

    //add transctions to list of transcritons
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

}

module.exports = Block;
