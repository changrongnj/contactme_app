var faker = require('faker');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


var con = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:"password",
    database:'contact_me'
});

// var data = [];
// for (var i = 0; i < 300; i++) {
//     data.push([
//         faker.internet.email(),
//         faker.company.companyName(),
//         faker.lorem.sentence(),
//         faker.date.past()
//     ])
// }
// var q = 'INSERT INTO users (email, affiliation, purpose, created_at) VALUES ?';
// con.query(q, [data], function(err, res) {
//     console.log(err),
//     console.log(res)
// });


app.get("/", function(req, res) {
    // find count of users in db
    var q = "SELECT COUNT(*) AS count FROM users";
    con.query(q, function(err, q_res){
        if (err) throw err;
        var count = q_res[0].count;
        //respond with that count
        res.render("home", {stats: count});
        //res.send("We have " + count + " users in our db");
    })
})

app.post("/submitted", function(req, res) {
    var person = {
        email: req.body.email,
        affiliation: req.body.affiliation,
        purpose: req.body.message
        };
    con.query("INSERT INTO users SET ?", person, function(err, post_res) {
        if (err) throw err;
        console.log(post_res);
        res.send("Thank you for connecting with me. I will get you back soon!")
    })
})


// start the server
app.listen(3000, function() { 
    console.log("App listening on port 3000!");
})

// con.end();
