 const models = require('./models');

// models.user.create ({
//     email: 'me@me.com',
//     user: 'German',
//     password: "password"
// })
// .then ((user)=>{
//     console.log('user created:', user.id);
// })
models.user.findAll({
    where:{
        email: "me@me.com"
    }
})
    .then(results => {
        
        console.log(results);

        console.log(results[0].email, results[0].user, results[0].password);
    })