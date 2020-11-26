# BASIC node.js
Node is a technique allows javascript to be implemented for server, which connects UI (javascript was written for initially) and database.

* Packages
    * It contains various packages/libraries such as express.js, faker.js etc. Call `npm install express` to install the express.js or `npm install faker` to install the faker package.
    * Similar as R, before using the package, it requires to load the package that needed, such as `var faker = require('faker');`
    > More script example for this project using faker:
    ```
    var faker = require('faker');
    function generateAddress() {
        console.log(faker.internet.email());
        console.log(faker.date.past());
        console.log(faker.address.city());
    }
    for (var i = 0; i < 10; i ++) {
        generateAddress();
    }
    ```
    
# CONNECT node.js to SQL[^1]
[^1]SQL guide: https://github.com/mysql/mysql-docker

## Set up local mysql server
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install mysql
```
* Connect to local SQL server `mysql.server start`, `mysql -u root`, `mysql.server stop`.

* error may occur: Client does not support authentication protocol requested by server; consider upgrading MySQL client'. In MySql Server - terminal, run these two queries. If that doesn't work, try it without `@'localhost'` part.
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;
```

* Script example for this project using MySQL: Call `npm install mysql` first.
```
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:"password",
    database:'contact_me'
});
```
## CONNECT
> Test connection:
```
con.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
})
```

## SQL QUERIES

### QUERY DATA
1. Example 1
    > res is stored as an array with one element
    ```
    con.query("SELECT 1 + 5", function(err, res, fields) {
        if (err) throw err;
        console.log("The answer is", res); 
    })
    ```
    > res[0]: get the first element in the res array
    > res.ans: get the value from the defined key
    ```
    con.query("SELECT 1 + 5 AS ans", function(err, res, fields) {
        if (err) throw err;
        console.log("The answer is", res[0].ans);
    })
    ```
2. Example 2
    ```
    var q = "SELECT CURDATE()";
    con.query(q, function(err, res, fields) {
        if (err) throw err;
        console.log("The answer is", res);
    })
    ```
    ```
    var q = "SELECT CURTIME() AS time, 
            CURDATE() AS date, 
            NOW() AS now";
    con.query(q, function(err, res, fields) {
        if (err) throw err;
        console.log("The answer is ", res);
    })
    con.query(q, function(err, res, fields) {
        if (err) throw err;
        console.log("Current time is", res[0].time, 
                    "current date is", res[0].date,
                    "now is", res[0].now);
    })
    ```
3. Example 3: query data from table
    >only the second user's email information
    ```
    var q = 'SELECT * FROM users'
    con.query(q, function(err, res, fields) {
        if (err) throw err;
        console.log(res[0].email);
    })
    ```
    ```
    var q = "SELECT * FROM users"
    con.query(q, function(err, res, fields) {
        if (err) throw err;
        console.log(res.length);
    })
    ```
    ```
    var q = "SELECT COUNT(*) AS total FROM users"
    con.query(q, function(err, res, fields) {
        if (err) throw err;
        console.log(res[0].total);
    })
    ```

### INSERT DATA
* Single data insertion
    1. Example 1: insert data similar as select query
        ```
        var q = 'INSERT INTO users (email) VALUES ("fwfewafe@gmail.com")';
        con.query(q, function(err, res) {
            if (err) throw err;
            console.log("Success in insertion!");
            console.log(res);
        })
        ```
    2. Example 2: `data = {att: xxx, att: xxxx}` and `INSERT INTO X SET ?`
        > `{}` means to refer each field seperately, same as 'INSERT INTO users (email, bithday) VALUES ("1111111@gmail.com", 2010-01-01)'
        ```
        var ppl = {email: '1111111@gmail.com', birthday: "2010-01-01"};
        var q = "INSERT INTO users SET ?";
        con.query(q, ppl, function(err, res) {
            if (err) throw err;
            console.log("success in the insertion!");
            console.log(res);
        })
        ```
    3. Example 3: `SET ?` with `FAKER` to generate dynamic data insertion
        ```
        var ppl = {email: faker.internet.email()};
        var q = "INSERT INTO users SET ?";
        con.query(q, ppl, function(err, res) {
            if (err) throw err;
            console.log("success in the insertion!");
            console.log(res);
        })
        ```
    4. Example 4: Javascript datetime automatically convert to sql datetime format with `mysql` package.
        >this is javascript datetime format
        ```
        var ppl = {email: faker.internet.email(), 
                created_at: faker.date.past()};
        console.log(ppl); 
        ```
        > this convert with `set ?`
        ```
        var q = "INSERT INTO users SET ?";
        var end_res = con.query(q, ppl, function(err, res) {
                                if (err) throw err;
                                console.log("success in the insertion!");
                                console.log(res);
                                })
        console.log(end_res.sql)
        ```

* Multiple data insertion
    1. Example 1: `data = {[], []...}` and `q = INSERT INTO X (xx, xx) VALUES ?`
        ```
        <!-- an array of data -->
        var data = {
            ["11111@gmail.com", "2020-01-10"],
            ["22222@gmail.com", "2011-01-10"],
            ["33333@gmail.com", "2010-01-10"]
        }
        
        var q = "INSERT INTO users (email, created_at) VALUES ?"
        
        con.query(q, [data], function(err, res) {
            console.log(err);
            console.log(res);
        })
        ```

    2. Example 2
        ```
        var data = [];
        for (var i = 0; i < 500; i++) {
            data.push([
                faker.internet.email(),
                faker.date.past()
            ])
        }

        var q = 'INSERT INTO users (email, created_at) VALUES ?';
        con.query(q, [data], function(err, res) {
            console.log(err);
            console.log(res);
        })
        ```

# BAISC WEB APP - EXPRESS.JS + EJS
## Installation
1. `npm init` it is a fast way of starting a new app
2. `npm install express ejs --save` it will save a record of the install (`npm install express ejs faker mysql --save`)
3. `npm install --save body-parser`

## basic idea
1. express: 
    ```
    var express = require('express');
    var app = express();

    app.get("address", function(req, res) {
        res.send();
    })

    app.listen(3000, function() { 
        console.log("App listening on port 3000!");
    })
    ```
2. ejs - render pages locate in views folder
    ```
    app.set('view engine', 'ejs');
    res.render();
    ```
3. body-parser
    ```
    var bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({extended:true}));
    ```