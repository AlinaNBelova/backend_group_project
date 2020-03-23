'use strict'

module.exports = function(_){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/chat', this.chatRoom)
            
                
            },
            indexPage: (req,res) => {
                return res.render('index',{test:'This is a test'});
                
            },

            getSignUp: (req,res) => {
                return res.render('signup');
            },
            
            chatRoom: (req,res) => {
                return res.render('chat');
                
            }
        }
    }