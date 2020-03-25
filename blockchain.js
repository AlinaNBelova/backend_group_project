
const sha256 = require('js-sha256');
const Block = require('./block');


class Blockchain {
    constructor(genesisBlock) {

        this.msgs = [];

        this.addBlock(genesisBlock);
    }

    addBlock(block) {

        if (this.msgs.length == 0) {
            block.previousHash = "";

            block.hash = this.generateHash(block)
        }

        this.msgs.push(block);
    }

    //get next block 

    getNextBlock(transactions) {
        //transctions is a list transactions [transobj, transobj]

        let block = new Block();

        transactions.forEach((xaction) => {

            block.addTransaction(xaction)
        })

        let previousBlock = this.getPreviousBlock();

        block.index = this.blocks.length;

        block.previousHash = previousBlock.hash;

        block.hash = this.generateHash(block);

        return block

    }


    //get previous block

    getPreviousBlock() {

        return this.msgs[this.msgs.length - 1]
    }


    generateHash(block) {
        ///need js-sha256

        let hash = sha256(block.key);

        while (!hash.startsWith('000')) {
            block.nonce += 1; //increment nonce by 1 

            hash = sha256(block.key);
            // console.log(`hash: ${hash} \n`);
        }

        return hash;
    }
}


module.exports = Blockchain