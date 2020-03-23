const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000 // this needs to be changed to 8080 for heroku
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

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

app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});