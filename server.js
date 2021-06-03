var express = require('express');
var cookieParser = require('cookie-parser'); //cookies for login
var app = express();
var bodyParser = require('body-parser'); //something about doing post
var path = require('path');
var mysql = require('mysql');
fs = require('fs');
var nodemailer = require('nodemailer');
const { time } = require('console');
const { title } = require('process');
//const { response } = require('express'); //bug from the IDE. when you see those burn them with fire
//const { response } = require('express'); //bug from the IDE. when you see those burn them with fire
var theJson;
var theUsers; //downloaded data of all the users. useful for usermanadement like login. 
var theItems; //for collecting and displaying the items.
var msg;
var admin = false;
var loginvar = false;

//===================== Page Generation ================================
function pageGenerator(pagename, req, res, pgloging = false, pgadmin = false, pgname="A user"){
    var title = "";
    if(pagename == "index"){
        title = "Bonline";
    } else {
        title = pagename;
    }
    msg1="";
    msg1 = msg1 + "<head>";
    msg1 = msg1 + "<title>Welcome to " + title + "</title>";
    msg1 = msg1 + '<LINK href="style.css" rel="stylesheet" type="text/css">';
    msg1 = msg1 + "</head><body>";
    msg1 = msg1 + '<a href="/index.html"><img border="0" alt="Bonline Logo" src="logo.jpg" height="100"></a><br/>';
    msg1 = msg1 + "<h1>Welcome to the " + title + "</h1>";
    text1 = menuGenerator(pagename, req, res, pgloging, pgadmin, pgname);
    msg1 = msg1 + text1;
    text2 = footerGenerator();
    msg1 = msg1 + text2;
    msg1 = msg1 + '</body></html>';
    return msg1;
}

//===================== Page Generation for an item ================================
function pageGeneratorItem(num = 0, pagename, req, res, pgloging = false, pgadmin = false, pgname="A user"){
    var title = "";
    if(theItems == null){
        title = "A nice item";
    } else {
        title = theItems[num].name;
    }
    msg1="";
    msg1 = msg1 + "<head>";
    msg1 = msg1 + "<title>The Item " + title + "</title>";
    msg1 = msg1 + '<LINK href="style.css" rel="stylesheet" type="text/css">';
    msg1 = msg1 + "</head><body>";
    msg1 = msg1 + '<a href="/index.html"><img border="0" alt="Bonline Logo" src="logo.jpg" height="100"></a><br/>';
    msg1 = msg1 + "<h1>Page of the Item #" + title + "</h1>";
    text1 = itemInfoDisplay(theItems[num]);
    msg1 = msg1 + text1;
    text2 = footerGenerator();
    msg1 = msg1 + text2;
    msg1 = msg1 + '</body></html>';
    return msg1;
}

//Displaying the details of the item
function itemInfoDisplay(item){
    msg1item="";
    msg1item = msg1item + '<p><a href="/index.html"><img border="0" alt="image of the item" src="item.jpg" height="200"></a><br/>';
    msg1item = msg1item + "<b>" + item.name + "</b><br/>";
    msg1item = msg1item + "Price: " + item.price + "<br/>";
    msg1item = msg1item + "Description: " + item.description + "<br/></p>";
    msg1item = msg1item + "<h2>OTHER ITEMS</h2><br/>"
    msg1item = msg1item + itemsDisplayGenerator();
    return msg1item;
}

//===================== Page Generation for a user ================================
function pageGeneratorUser(num = 0, pagename, req, res, pgloging = false, pgadmin = false, pgname="A user"){
    var title = "";
    if(theUsers == null){
        title = "A nice item";
    } else {
        title = theUsers[num].username;
    }
    msg1="";
    msg1 = msg1 + "<head>";
    msg1 = msg1 + "<title>The User " + title + "</title>";
    msg1 = msg1 + '<LINK href="style.css" rel="stylesheet" type="text/css">';
    msg1 = msg1 + "</head><body>";
    msg1 = msg1 + '<a href="/index.html"><img border="0" alt="Bonline Logo" src="logo.jpg" height="100"></a><br/>';
    msg1 = msg1 + "<h1>Page of the user #" + title + "</h1>";
    text1 = menuGenerator(pagename, req, res, pgloging, pgadmin, pgname);
    msg1 = msg1 + text1;
    text2 = footerGenerator();
    msg1 = msg1 + text2;
    msg1 = msg1 + '</body></html>';
    return msg1;
}

//generates the links automatically.
function menuGenerator(pagename, req, res, pgloging, pgadmin, pgname){
    msg2="";
    msg2 = msg2 + "<p>";
    if((req.cookies.loggedin == 'true') || pgloging){
        if(pgname == "A user"){
            if(req.cookies.username != null){
                if(req.cookies.username != 'undefined'){
                    pgname = req.cookies.username;
                }
            }
        }
        msg2 = msg2 + "Welcome " + pgname + "! ";
        msg2 = msg2 + '<br/>';
        if((req.cookies.isadmin == 'true') || pgadmin){
            msg2 = msg2 + "You are Admin! ";
            msg2 = msg2 + '<br/>';
            //do admin stuff
            if(pagename == "adminpanel"){
                msg2 = msg2 + '|<a href="/dashboard.html">dashboard</a>|';
            } else {
                msg2 = msg2 + '|<a href="/adminpanel.html">adminpanel</a>|';
            }
            msg2 = msg2 + '|<a href="/index.html">Homepage</a>||<a href="/logout.html">logout</a>|';
            msg2 = msg2 + '<br/>';
            
            if(pagename == "adminpanel"){
                msg2 = msg2 + '|<a href="/createuser.html">create a user</a>|';
                msg2 = msg2 + '|<a href="/edituser.html">edit a user</a>|';
                msg2 = msg2 + '|<a href="/deleteuser.html">Delete a user</a>|';
                msg2 = msg2 + '<br/>';
                msg2 = msg2 + usersDisplayGenerator();

            } else {
                msg2 = msg2 + '|<a href="/createitem.html">create an item</a>|';
                msg2 = msg2 + '|<a href="/edititem.html">edit an item</a>|';
                msg2 = msg2 + '|<a href="/deleteitem.html">delete an item</a>|';
                msg2 = msg2 + '<br/>';
                msg2 = msg2 + itemsDisplayGenerator();
            }
            
        } else {
            //do dashboard stuff
            msg2 = msg2 + '|<a href="/index.html">Homepage</a>||<a href="/logout.html">logout</a>|';
            msg2 = msg2 + '|<a href="/createitem.html">create an item</a>|';
            msg2 = msg2 + '|<a href="/edititem.html">edit an item</a>|';
            msg2 = msg2 + '|<a href="/deleteitem.html">delete an item</a>|';
            msg2 = msg2 + '<br/>';
            msg2 = msg2 + itemsDisplayGenerator();
        }
    } else {
        msg2 = msg2 + '|<a href="/login.html">Login</a>||<a href="/registration.html">Register</a>||<a href="/aboutus.html">About Us</a>|';
        msg2 = msg2 + '<br/>';
        msg2 = msg2 + itemsDisplayGenerator();
    }
    msg2 = msg2 + "</p>";
    return msg2;
}

//generates a display of the users, dynamically 
function usersDisplayGenerator(){
    msg3 = "<br/>";
    if(theUsers != null){
        msg3 = msg3 + "<b>Here is the display of the users</b><br/>";
        msg3 = msg3 + "<table><tr><th>Ord.No</th><th>Username</th><th>email</th></tr>";
        var count = Object.keys(theUsers).length;
        for(x=0; x<count; x++){
            //console.log("Checking user:" + theUsers[x].username);
            theUserUrl = userUrlGenerator(x);
            msg3 = msg3 + '<tr><td><a href="' + theUserUrl + '">' + x + '</a></td><td><a href="' + theUserUrl + '">' + theUsers[x].username + '</a></td><td><a href="' + theUserUrl + '">' 
            + theUsers[x].email + '</a></td></tr>';
        }
        msg3 = msg3 + "</table>";
    } else {
        msg3 = msg3 + "<h3>Remember!</h3><br/>";
        msg3 = msg3 + "Treating the users fairly is important!<br/>";
        msg3 = msg3 + "Click Refresh to see the users:<br/>";
    }
    
    msg3 = msg3 + '|<a href="/adminpanel.html">Refresh!</a>|<br/>';
    return msg3;
}

//generates the link for the user page
function userUrlGenerator(userNumber){
    msg31 = "/theuser?num=" + userNumber;
    return msg31;
}

//generates a display of the items, dynamically 
function itemsDisplayGenerator(){
    loadItemsDb(dbcon);
    msg4 = "<br/>";
    if(theItems != null){
        var count = Object.keys(theItems).length;
        msg4 = msg4 + "<b>Here is the display of the items</b><br/>";
        msg4 = msg4 + "<table><tr><th>Ord.No</th><th>Title</th><th>Description</th><th>Price</th></tr>";
        for(x=0; x<count; x++){
            //console.log("Checking user:" + theUsers[x].username);
            theItemUrl = itemUrlGenerator(x);
            msg4 = msg4 + '<tr><td><a href="' + theItemUrl + '">' + x + '</a></td><td><a href="' + theItemUrl + '">' + theItems[x].name + '</a></td><td><a href="' + theItemUrl + '">' 
            + theItems[x].description +  '</a></td><td><a href="' + theItemUrl + '">'
            + theItems[x].price + '</a></td></tr>';
        }
        msg4 = msg4 + "</table>";
    } else {
        msg4 = msg4 + '<a href="/index.html"><img alt="enter to the store!" src="store.jpg" height="300"></a><br/>';
        msg4 = msg4 + "Items of tremendous quality!<br/>";
        msg4 = msg4 + "We have the Best prices and the best reviews.<br/>";
        msg4 = msg4 + "Click refresh to see our collection:<br/>";
    }
    msg4 = msg4 + '|<a href="/index.html">Refresh!</a>|<br/>';
    return msg4;
}

//generates the link for item's page
function itemUrlGenerator(itemNumber){
    msg41 = "/theitem?num=" + itemNumber;
    return msg41;
}

//generates a footer, dynamically 
function footerGenerator(){
    msg5 = "<br/><div id='footer'>";
    msg5 = msg5 + "Bonline team 2021 all rights reserved <br/>";
    msg5 = msg5 + "LINKS<br/>";
    msg5 = msg5 + "=================================================<br/>";
    msg5 = msg5 + '|<a href="/aboutus.html">About us</a>||<a href="/contact.html">Contact us</a>||<a href="/qna.html">Q and A</a>|</br>';
    msg5 = msg5 + '<a href="https://github.com/Exarchias/bonline2">The GitHub repository of this project</a></br>';
    msg5 = msg5 + "=================================================<br/>";
    msg5 = msg5 + "</div>";
    return msg5;
}

//activate cookies in the system
app.use(cookieParser());

// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false }) 

// testpage
app.get('/test', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    //console.log("sup!");
    console.log(req.cookies);

    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }

    //using a 10 secons interval. it continuesly in a loop.
    //setInterval(sendResponseDb, 10000, dbcon);

    //what is used for the index page
    //res.sendFile(path.join(__dirname + '/index.html'));

    //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
});


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    //console.log("sup!");
    //console.log(dbcon);
    console.log(theItems);
    //console.log(req.cookies);

    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }

    //using a 10 secons interval. it continuesly in a loop.
    //setInterval(sendResponseDb, 10000, dbcon);

    //res.sendFile(path.join(__dirname + '/index.html'));

    //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
});

app.get('/index.html', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    //console.log("sup!");
    console.log(req.cookies);
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    //using a 10 secons interval. it continuesly in a loop.
    //setInterval(sendResponseDb, 10000, dbcon);

    //res.sendFile(path.join(__dirname + '/index.html'));

    //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
    loginvar = false;
});

app.get('/index', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    //console.log("sup!");
    console.log(req.cookies);
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    //using a 10 secons interval. it continuesly in a loop.
    //setInterval(sendResponseDb, 10000, dbcon);

    //res.sendFile(path.join(__dirname + '/index.html'));

    //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
    loginvar = false;
});

//file already exists. Got deactivated because we will use the static files from publix.
//Style.css in the route can go, but it will remain for future testing and debugging.
/*
app.get('/style.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/style.css'));
});
*/

//===================== ADMIN PANEL ======================================
// ==================== GET ADMIN PANEL ==================================

//GET for adminpanel.html
app.get('/adminpanel.html', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    //console.log('A message through console log');
    console.log(req.cookies);
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    if(req.cookies.loggedin == 'true'){
        if(req.cookies.isadmin == 'true'){
            //res.sendFile(path.join(__dirname + '/adminpanel.html'));
            //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);
        } else {
            //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);
            //res.sendFile(path.join(__dirname + '/dashboard.html'));
        }
    } else {
        //res.sendFile(path.join(__dirname + '/index.html'));
        //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
    }
    loginvar = false; 
}
);


//GET for adminpanel
app.get('/adminpanel', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    console.log('A message through console log');
    console.log(req.cookies);
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    if(req.cookies.loggedin == 'true'){
        if(req.cookies.isadmin == 'true'){
            //res.sendFile(path.join(__dirname + '/adminpanel.html'));
            //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);
        } else {
            //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);
            //res.sendFile(path.join(__dirname + '/dashboard.html'));
        }
    } else {
        //res.sendFile(path.join(__dirname + '/index.html'));
        //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
    }
    loginvar = false;
});


//===================== DASHBOARD ======================================
// ==================== GET DASHBOARD ==================================

//GET for dashboard.html
app.get('/dashboard.html', function(req, res) {
    loadItemsDb(dbcon);
    console.log(req.cookies);
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    if(req.cookies.loggedin == 'true'){
        //res.sendFile(path.join(__dirname + '/dashboard.html'));
        //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);
    } else {
        //res.sendFile(path.join(__dirname + '/index.html'));
        //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
    }

    loginvar = false;
});


//GET for dashboard
app.get('/dashboard', function(req, res) {
    loadItemsDb(dbcon);
    console.log(req.cookies);
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    if(req.cookies.loggedin == 'true'){
        //res.sendFile(path.join(__dirname + '/dashboard.html'));
        //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);
    } else {
        //res.sendFile(path.join(__dirname + '/index.html'));
        //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
    }

    loginvar = false;
});


//===================== ITEM PAGE ======================================
// ==================== GET ITEM PAGE ==================================

//GET for item page
app.get('/theitem', function(req, res) {
    //loadUsersDb(dbcon);
    //loadItemsDb(dbcon);
    //console.log('A message through console log');
    console.log(req.cookies);

    //fetching the number through the get parameters.
    theItemNumber = req.query.num;
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    if(req.cookies.loggedin == 'true'){
        if(req.cookies.isadmin == 'true'){
            //res.sendFile(path.join(__dirname + '/adminpanel.html'));
            //what we are trying to implement.
    msg = pageGeneratorItem(theItemNumber,"dashboard", req, res);
    res.write(msg);
        } else {
            //what we are trying to implement.
    msg = pageGeneratorItem(theItemNumber, "dashboard", req, res);
    res.write(msg);
            //res.sendFile(path.join(__dirname + '/dashboard.html'));
        }
    } else {
        //res.sendFile(path.join(__dirname + '/index.html'));
        //what we are trying to implement.
    msg = pageGeneratorItem(theItemNumber, "index", req, res);
    res.write(msg);
    }
    loginvar = false; 
}
);

//===================== USER PAGE ======================================
// ==================== GET USER PAGE ==================================

//GET for user page
app.get('/theuser', function(req, res) {
    //loadUsersDb(dbcon);
    //loadItemsDb(dbcon);
    //console.log('A message through console log');
    console.log(req.cookies);
    //fetching the number through the get parameters.
    theUserNumber = req.query.num;
    //utilizing the cookies for the loggin system.
    if(req.cookies.loggedin == 'true'){
        loginvar = true;
    }
    if(req.cookies.loggedin == 'true'){
        if(req.cookies.isadmin == 'true'){
            //res.sendFile(path.join(__dirname + '/adminpanel.html'));
            //what we are trying to implement.
    msg = pageGeneratorUser(theUserNumber,"adminpanel", req, res);
    res.write(msg);
        } else {
            //what we are trying to implement.
    msg = pageGeneratorUser(theUserNumber,"adminpanel", req, res);
    res.write(msg);
            //res.sendFile(path.join(__dirname + '/dashboard.html'));
        }
    } else {
        //res.sendFile(path.join(__dirname + '/index.html'));
        //what we are trying to implement.
    msg = pageGeneratorUser(theUserNumber,"index", req, res);
    res.write(msg);
    }
    loginvar = false; 
}
);

//==========================================================================
//===================== USERS' CRUD STARTS HERE ============================
//==========================================================================

//===================== CREATE A USER ======================================
// ==================== GET CREATE A USER  ==================================

//The html page for registration.html for when "/registration" is requested
app.get('/createuser', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/createuser.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


//The html page for registration.html for when "/registration.html" is requested
app.get('/createuser.html', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/createuser.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


// ==================== POST CREATE A USER  ==================================

  //it works. now it is time to use it to get the values.
  app.post('/createuser.html', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        first_name:req.body.firstname,  
        last_name:req.body.lastname,
        password:req.body.password,
        email:req.body.email,
        telephone:req.body.telephone,
        admin:req.body.admin  
    };
    //Creating a new user into the database
    createAUser(dbcon, response.username, response.password, response.first_name, 
        response.last_name, response.email, response.telephone, response.admin);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);
 });

  //it works. now it is time to use it to get the values.
  app.post('/createuser', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        first_name:req.body.firstname,  
        last_name:req.body.lastname,
        password:req.body.password,
        email:req.body.email,
        telephone:req.body.telephone,
        admin:req.body.admin  
    };
    //Creating a new user into the database
    createAUser(dbcon, response.username, response.password, response.first_name, 
        response.last_name, response.email, response.telephone, response.admin);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);

 });


 //===================== EDIT A USER ======================================
// ==================== GET EDIT A USER  ==================================

//The html page for registration.html for when "/registration" is requested
app.get('/edituser', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/edituser.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


//The html page for registration.html for when "/registration.html" is requested
app.get('/edituser.html', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/edituser.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


// ==================== POST EDIT A USER  ==================================

  //it works. now it is time to use it to get the values.
  app.post('/edituser.html', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        first_name:req.body.firstname,  
        last_name:req.body.lastname,
        password:req.body.password,
        email:req.body.email,
        telephone:req.body.telephone,
        admin:req.body.admin  
    };

    //The if statements here will make sure that empty values will not be updated
    console.log(theUsers);
    var passwordtmp = "12345";
    var firstnametmp = "John";
    var lastnametmp = "Doe";
    var emailtmp = "email@test.test";
    var telephonetmp = "12345";
    var admintmp = "false";

    var count = Object.keys(theUsers).length;

    for(x=0; x<count; x++){
        console.log("trying to find the user" + theUsers[x].username);
        if(theUsers[x].username == response.username){
            console.log("Collecting the data of the user");
            console.log(theUsers[x]);

            //run some serious code here
            //checking password
            if((response.password == null) || (response.password == "")){
                passwordtmp = theUsers[x].password;
            } else {
                passwordtmp = response.password;
            }
            //passwordtmp = "12345";
            //checking first name
            if((response.first_name == null) || (response.first_name == "")){
                firstnametmp = theUsers[x].firstname;
            } else {
                firstnametmp = response.first_name;
            }
            //checking last name
            if((response.last_name == null) || (response.last_name == "")){
                lastnametmp = theUsers[x].lastname;
            } else {
                lastnametmp = response.last_name;
            }
            //checking email
            if((response.email == null) || (response.email == "")){
                emailtmp = theUsers[x].email;
            } else {
                emailtmp = response.email;
            }
            //checking telephone
            if((response.telephone == null) || (response.telephone == "")){
                telephonetmp = theUsers[x].telephone;
            } else {
                telephonetmp = response.telephone;
            }
            //checking admin
            if((response.admin == null) || (response.telephone == "")){
                admintmp = theUsers[x].admin;
            } else {
                admin = response.admin;
            }

            break;
        }
    }
    

    //Doing the registration to the database
    editAUser(dbcon, response.username, passwordtmp, firstnametmp, 
        lastnametmp, emailtmp, telephonetmp, admintmp);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);
 });

  //it works. now it is time to use it to get the values.
  app.post('/edituser', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        first_name:req.body.firstname,  
        last_name:req.body.lastname,
        password:req.body.password,
        email:req.body.email,
        telephone:req.body.telephone,
        admin:req.body.admin  
    };

    //The if statements here will make sure that empty values will not be updated
    console.log(theUsers);
    var passwordtmp = "12345";
    var firstnametmp = "John";
    var lastnametmp = "Doe";
    var emailtmp = "email@test.test";
    var telephonetmp = "12345";
    var admintmp = "false";

    var count = Object.keys(theUsers).length;
    
    for(x=0; x<count; x++){
        console.log("trying to find the user" + theUsers[x].username);
        if(theUsers[x].username == response.username){
            console.log("Collecting the data of the user");
            console.log(theUsers[x]);

            //run some serious code here
            //checking password
            if((response.password == null) || (response.password == "")){
                passwordtmp = theUsers[x].password;
            } else {
                passwordtmp = response.password;
            }
            //passwordtmp = "12345";
            //checking first name
            if((response.first_name == null) || (response.first_name == "")){
                firstnametmp = theUsers[x].firstname;
            } else {
                firstnametmp = response.first_name;
            }
            //checking last name
            if((response.last_name == null) || (response.last_name == "")){
                lastnametmp = theUsers[x].lastname;
            } else {
                lastnametmp = response.last_name;
            }
            //checking email
            if((response.email == null) || (response.email == "")){
                emailtmp = theUsers[x].email;
            } else {
                emailtmp = response.email;
            }
            //checking telephone
            if((response.telephone == null) || (response.telephone == "")){
                telephonetmp = theUsers[x].telephone;
            } else {
                telephonetmp = response.telephone;
            }
            //checking admin
            if((response.admin == null) || (response.telephone == "")){
                admintmp = theUsers[x].admin;
            } else {
                admin = response.admin;
            }

            break;
        }
    }
    

    //Doing the registration to the database
    editAUser(dbcon, response.username, passwordtmp, firstnametmp, 
        lastnametmp, emailtmp, telephonetmp, admintmp);
     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);

 });

 //===================== DELETE A USER ======================================
// ==================== GET DELETE A USER  ==================================

//The html page for registration.html for when "/registration" is requested
app.get('/deleteuser', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/deleteuser.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


//The html page for registration.html for when "/registration.html" is requested
app.get('/deleteuser.html', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/deleteuser.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


// ==================== POST DELETE A USER  ==================================

  //it works. now it is time to use it to get the values.
  app.post('/deleteuser.html', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username  
    };
    //Deleting a user from the database
    deleteAUser(dbcon, response.username);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);
 });

  //it works. now it is time to use it to get the values.
  app.post('/deleteuser', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username  
    };
    //Deleting a user from the database
    deleteAUser(dbcon, response.username);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);

 });


 //===================== USERS' CRUD MySQL OPERATIONS ======================

 function createAUser(dbcon, username, password, firstname, lastname, email, telephone, admin){
    var sql = "INSERT INTO usersss (username, password, email, firstname, lastname, telephone, admin) VALUES ('" + username + "','" 
        + password + "','" + email + "','" + firstname + "','" + lastname + "', '" + telephone 
        + "','" + admin + "')";

        dbcon.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });

}

function editAUser(dbcon, username, password, firstname, lastname, email, telephone, admin){
    var sql = "UPDATE usersss SET password='" 
        + password + "', email='" + email + "', firstname='" + firstname + "', lastname='" + lastname 
        + "', telephone='" + telephone 
        + "', admin='" + admin + "' WHERE username='" + username + "'";

        dbcon.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });

}

function deleteAUser(dbcon, username){
    var sql = "DELETE FROM usersss WHERE username='" + username + "' ";

        dbcon.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record deleted");
        });

}


//==========================================================================
//===================== USERS' CRUD ENDS HERE ==============================
//==========================================================================


//==========================================================================
//===================== ITEMS' CRUD STARTS HERE ============================
//==========================================================================

//===================== CREATE A ITEM ======================================
// ==================== GET CREATE A ITEM  ==================================

//The html page for registration.html for when "/registration" is requested
app.get('/createitem', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/createitem.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


//The html page for registration.html for when "/registration.html" is requested
app.get('/createitem.html', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/createitem.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


// ==================== POST CREATE A ITEM  ==================================

  //it works. now it is time to use it to get the values.
  app.post('/createitem.html', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        name:req.body.name,
        description:req.body.description,  
        price:req.body.price  
    };
    //Creating a new item into the database
    createAitem(dbcon, response.name, response.description, response.price);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);
 });

  //it works. now it is time to use it to get the values.
  app.post('/createitem', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        name:req.body.name,
        description:req.body.description,  
        price:req.body.price  
    };
    //Creating a new item into the database
    createAitem(dbcon, response.name, response.description, response.price);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);

 });


 //===================== EDIT A ITEM ======================================
// ==================== GET EDIT A ITEM  ==================================

//The html page for registration.html for when "/registration" is requested
app.get('/edititem', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/edititem.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


//The html page for registration.html for when "/registration.html" is requested
app.get('/edititem.html', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/edititem.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


// ==================== POST EDIT A ITEM  ==================================

  //it works. now it is time to use it to get the values.
  app.post('/edititem.html', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        name:req.body.name,
        description:req.body.description,  
        price:req.body.price  
    };

    //The if statements here will make sure that empty values will not be updated
    console.log(theItems);
    var descriptiontmp = "Just an item";
    var pricetmp = "99";
    

    var count = Object.keys(theItems).length;

    for(x=0; x<count; x++){
        console.log("trying to find the item" + theItems[x].name);
        if(theItems[x].name == response.name){
            console.log("Collecting the data of the item");
            console.log(theItems[x]);

            //run some serious code here
            //checking password
            if((response.description == null) || (response.description == "")){
                descriptiontmp = theItems[x].description;
            } else {
                descriptiontmp = response.description;
            }
            //passwordtmp = "12345";
            //checking first name
            if((response.price == null) || (response.price == "")){
                pricetmp = theItems[x].price;
            } else {
                pricetmp = response.price;
            }

            break;
        }
    }
    

    //Doing the registration to the database
    editAitem(dbcon, response.name, descriptiontmp, pricetmp);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);
 });

  //it works. now it is time to use it to get the values.
  app.post('/edititem', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        name:req.body.name,
        description:req.body.description,  
        price:req.body.price  
    };

    //The if statements here will make sure that empty values will not be updated
    console.log(theItems);
    var descriptiontmp = "Just an item";
    var pricetmp = "99";
    

    var count = Object.keys(theItems).length;

    for(x=0; x<count; x++){
        console.log("trying to find the item" + theItems[x].name);
        if(theItems[x].name == response.name){
            console.log("Collecting the data of the item");
            console.log(theItems[x]);

            //run some serious code here
            //checking password
            if((response.description == null) || (response.description == "")){
                descriptiontmp = theItems[x].description;
            } else {
                descriptiontmp = response.description;
            }
            //passwordtmp = "12345";
            //checking first name
            if((response.price == null) || (response.price == "")){
                pricetmp = theItems[x].price;
            } else {
                pricetmp = response.price;
            }

            break;
        }
    }
    

    //Doing the registration to the database
    editAitem(dbcon, response.name, descriptiontmp, pricetmp);
     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res);
    res.write(msg);

 });

 //===================== DELETE A ITEM ======================================
// ==================== GET DELETE A ITEM  ==================================

//The html page for registration.html for when "/registration" is requested
app.get('/deleteitem', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/deleteitem.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


//The html page for registration.html for when "/registration.html" is requested
app.get('/deleteitem.html', function(req, res) {
    if(req.cookies.loggedin == 'true'){
        res.sendFile(path.join(__dirname + '/deleteitem.html'));
    } else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});


// ==================== POST DELETE A ITEM  ==================================

  //it works. now it is time to use it to get the values.
  app.post('/deleteitem.html', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        name:req.body.name  
    };
    //Deleting an item from the database
    deleteAitem(dbcon, response.name);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);
 });

  //it works. now it is time to use it to get the values.
  app.post('/deleteitem', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        name:req.body.name  
    };
    //Deleting an item from the database
    deleteAitem(dbcon, response.name);

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("dashboard", req, res);
    res.write(msg);

 });


 //===================== ITEMS' CRUD MySQL OPERATIONS ======================

 function createAitem(dbcon, name, description, price){
    var sql = "INSERT INTO itemsss (name, description, price) VALUES ('" + name + "','" 
        + description + "','" + price + "')";

        dbcon.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 item record inserted");
        });

}

function editAitem(dbcon, name, description, price){
    var sql = "UPDATE itemsss SET description='" 
        + description + "', price='" + price + "' WHERE name='" + name + "'";

        dbcon.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });

}

function deleteAitem(dbcon, name){
    var sql = "DELETE FROM itemsss WHERE name='" + name + "' ";

        dbcon.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record deleted");
        });

}


//==========================================================================
//===================== ITEMS' CRUD ENDS HERE ==============================
//==========================================================================




//===================== REGISTRATION ======================================
// ==================== GET REGISTRATION ==================================

//The html page for registration.html for when "/registration" is requested
app.get('/registration', function(req, res) {
    res.sendFile(path.join(__dirname + '/registration.html'));
});


//The html page for registration.html for when "/registration.html" is requested
app.get('/registration.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/registration.html'));
});

app.get('/aboutus.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/aboutus.html'));
});
// ==================== POST REGISTRATION ==================================
/*
app.post('/registration',function(req,res){
    //var user_name = req.body.firstname;
    //var password = req.body.password;
    console.log("Req = "+ req);
    res.sendFile(path.join(__dirname + '/index.html'));
    //res.end("yes");
  });
  */

  //it works. now it is time to use it to get the values.
  app.post('/registration.html', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        first_name:req.body.firstname,  
        last_name:req.body.lastname,
        password:req.body.password,
        email:req.body.email,
        telephone:req.body.telephone  
    };
    //Doing the registration to the database
    register(dbcon, response.username, response.password, response.first_name, 
        response.last_name, response.email, response.telephone, "false");

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);
 });

  //it works. now it is time to use it to get the values.
  app.post('/registration', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        first_name:req.body.firstname,  
        last_name:req.body.lastname,
        password:req.body.password,
        email:req.body.email,
        telephone:req.body.telephone  
    };
    //Doing the registration to the database
    register(dbcon, response.username, response.password, response.first_name, 
        response.last_name, response.email, response.telephone, "false");

     
   //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html')); 

    //what we are trying to implement.
    msg = pageGenerator("index", req, res);
    res.write(msg);

 });

//===================== LOGIN ======================================
// ==================== GET LOGIN ==================================

//The html page for login.html for when "/login" is requested
app.get('/login', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    res.sendFile(path.join(__dirname + '/login.html'));
});


//The html page for registration.html for when "/login.html" is requested
app.get('/login.html', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    res.sendFile(path.join(__dirname + '/login.html'));
});


// ==================== POST LOGIN ==================================


  //it works. now it is time to use it to get the values.
  app.post('/login.html', urlencodedParser, function (req, res) {  
    //loadUsersDb(dbcon);
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        password:req.body.password,  
    };
    //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html'));

    //I don't like the use of variables but for now they are practical
    //we keep them for now for reasons of compatibility
    loginvar = login(res, response.username, response.password);
    admin = isAdmin(res, response.username, response.password);

    //I don't like it this way. but otherwise we would have to have to redirect to a third page and
    //we don't have the time to implement that
    if(loginvar){
        //res.cookie('loggedin', 'true');
        if(admin){
            //res.cookie('isadmin', 'true');
            loginvar = false;
            admin = false;
            //res.sendFile(path.join(__dirname + '/adminpanel.html'));
            //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res, true, true, response.username);
    res.write(msg);
        } else {
            loginvar = false;
            admin = false;
            //res.sendFile(path.join(__dirname + '/dashboard.html'));
            //what we are trying to implement.
            msg = pageGenerator("dashboard", req, res, true, false, response.username);
            res.write(msg);
        }
    } else {
        //res.cookie('loggedin', 'false');
        loginvar = false;
        admin = false;
        res.sendFile(path.join(__dirname + '/login.html'));
    }
    
    //Doing the registration to the database
    /*
    register(dbcon, response.username, response.password, response.first_name, 
        response.last_name, response.email, response.telephone, "false");
    */

 });

  //it works. now it is time to use it to get the values.
  app.post('/login', urlencodedParser, function (req, res) {  
    //loadUsersDb(dbcon);
    // Prepare output in JSON format  
    response = {  
        username:req.body.username,
        password:req.body.password,  
    };

    //response = req.body.firstname;
    console.log(response);  
    //res.end(JSON.stringify(response));
    //res.sendFile(path.join(__dirname + '/index.html'));

    //I don't like the use of variables but for now they are practical
    //we keep them for now for reasons of compatibility
    loginvar = login(res, response.username, response.password);
    admin = isAdmin(res, response.username, response.password);

    //I don't like it this way. but otherwise we would have to have to redirect to a third page and
    //we don't have the time to implement that
    if(loginvar){
        //res.cookie('loggedin', 'true');
        if(admin){
            //res.cookie('isadmin', 'true');
            loginvar = false;
            admin = false;
            //res.sendFile(path.join(__dirname + '/adminpanel.html'));
            //what we are trying to implement.
    msg = pageGenerator("adminpanel", req, res, true, true, response.username);
    res.write(msg);
        } else {
            loginvar = false;
            admin = false;
            //res.sendFile(path.join(__dirname + '/dashboard.html'));
            //what we are trying to implement.
            msg = pageGenerator("dashboard", req, res, true, false, response.username);
            res.write(msg);
        }
    } else {
        //res.cookie('loggedin', 'false');
        loginvar = false;
        admin = false;
        res.sendFile(path.join(__dirname + '/login.html'));
    }

    //Doing the registration to the database
    /*
    register(dbcon, response.username, response.password, response.first_name, 
        response.last_name, response.email, response.telephone, "false");
    */

      
 });


 //============================ LOGIN MECHANISM ==================
 function login(res, username, password){
    console.log("Login(). Given Username: " + username + " and password: " + password);
    if(theUsers != null){
        var count = Object.keys(theUsers).length;
        for(x=0; x<count; x++){
            //console.log("Checking user:" + theUsers[x].username);
            if(theUsers[x].username == username){
                console.log("user found:" + theUsers[x].username);
                if(theUsers[x].password == password){
                    console.log("password accepted:" + theUsers[x].password);
                    res.cookie('loggedin', 'true');
                    res.cookie('username', username);
                    console.log("Username in cookies " + username);
                    return true;
                } else {
                    console.log("password rejected:" + theUsers[x].password);
                    res.cookie('loggedin', 'false');
                    return false;
                }
            }
        }
    }
    res.cookie('loggedin', 'false');
    return false;
 }

 function isAdmin(res, username, password){
    console.log("isAdmin(). Username: " + username + " and password: " + password);
    if(theUsers != null){
        for(x=0; x<5; x++){
            if(theUsers[x].username == username){
                if(theUsers[x].admin == "true"){
                    res.cookie('isadmin', 'true');
                    return true;
                } else {
                    res.cookie('isadmin', 'false');
                    return false;
                }
            }
        }
    }
    res.cookie('isadmin', 'false');
    return false;
}


//===================== LOGOUT MECHANISM ======================================
// ==================== GET LOGOUT ==================================

//When logout the system is reseted and redirects to index
app.get('/logout.html', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    res.cookie('loggedin', 'false');
    res.cookie('isadmin', 'false');
    loginvar = false;
    admin = false;
    res.sendFile(path.join(__dirname + '/index.html'));
});

//When logout the system is reseted and redirects to index
app.get('/logout', function(req, res) {
    loadUsersDb(dbcon);
    loadItemsDb(dbcon);
    res.cookie('loggedin', 'false');
    res.cookie('isadmin', 'false');
    loginvar = false;
    admin = false;
    res.sendFile(path.join(__dirname + '/index.html'));
});


//============================ OTHER SERVER THINGS ==================
//file is created on the fly.
app.get('/data.txt', function(req, res) {
    res.send(msg)
    console.log("sending temperatures");
});

//Public folder with static files
app.use('/', express.static(path.join(__dirname, 'public')))

//app.listen(32764);
app.listen(process.env.PORT || 3000);


//================ MySQL Connection ===============================
//Don't forget the require('mysql'); in the beginning.
const dbcon = mysql.createConnection({
	host: "den1.mysql5.gear.host",
	user: "xtracker",
	password: "yolo123!",
	database: "xtracker"
	});
	
	
function loadUsersDb(dbcon) {
    console.log("loading the users");
	dbcon.query('select * from usersss;', (err, result) => {
		if(err)
			throw err;
		theUsers = result;
	});

    /*
    if(theJson != null){
        msg="<table><tr><th>id</th><th>temperature</th><th>timestamp</th></tr>";
        for(x=0; x<5; x++){
            msg = msg + "<tr><td>" + theJson[x].id + "</td><td>"  + theJson[x].temperature + "</td><td>" 
            + theJson[x].timestamp + "</td></tr>";
        }
        msg = msg + "</table>";
    }
    */
}

function loadItemsDb(dbcon) {
    console.log("loading the items");
    dbcon.query('select * from itemsss;', (err, result) => {
        if(err)
            throw err;
        theItems = result;
    });
}


function register(dbcon, username, password, firstname, lastname, email, telephone, admin){
    if(!dbcon){
        dbcon.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO usersss (username, password, email, firstname, lastname, telephone, admin) VALUES ('" + username + "','" 
            + password + "','" + email + "','" + firstname + "','" + lastname + "', '" + telephone 
            + "','" + admin + "')";
            dbcon.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
            });
          });
    } else {
        console.log("Connected!");
            var sql = "INSERT INTO usersss (username, password, email, firstname, lastname, telephone, admin) VALUES ('" + username + "','" 
            + password + "','" + email + "','" + firstname + "','" + lastname + "', '" + telephone 
            + "','" + admin + "')";
            dbcon.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
            });
    }

}

//===================== CONTACT ======================================
// ==================== GET CONTACT ==================================

app.get('/contact.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/contact.html'));
});


// ==================== GET CONTACT ==================================
app.post('/contact.html',urlencodedParser,function(req,res){
  

    var useremail=req.body.email;
    var usersubject=req.body.subject;
    var usermessage=req.body.message;
   // console.log(responsee);
    writeToFiles(useremail,usersubject,usermessage);
    var messageandemailaddressoftheuser="user email address that send the request: " +useremail +" The message: "+usermessage;
    sendMessagesRecivedFromClientsToAdmin(usersubject,messageandemailaddressoftheuser);
    msg = pageGenerator("index",req,res);
   res.write(msg);
});

app.post('/contact',urlencodedParser,function(req,res){
  

   var useremail=req.body.email;
   var usersubject=req.body.subject;
   var usermessage=req.body.message;

   var messageandemailaddressoftheuser="user email address that send the request: " +useremail +" The message: "+usermessage;
  // console.log(responsee);
  writeToFiles(useremail,usersubject,usermessage);
   //console.log(responsee);
   sendMessagesRecivedFromClientsToAdmin(usersubject,messageandemailaddressoftheuser);
   msg = pageGenerator("index",req,res);
  res.write(msg);
});


function writeToFiles(usersubject,useremail,usermessage){
    pathofuser="questions/"+useremail+".txt";
    content="The subject: "+usersubject+"  "+" Message: "+usermessage;

    fs.writeFile(pathofuser, content, function (err) {
        if (err) return console.log(err);
        console.log('Message came from the user');
      });

}


app.get('/qna.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/qna.html'));
});



function sendMessagesRecivedFromClientsToAdmin(subject,message){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bonlinecloud@gmail.com',
          pass: 'Bonline2021'
        }
      });


      var mailOptions = {
          
        //lavdi-imeri@hotmail.com
        from: 'bonlinecloud@gmail.com',
        to: 'lavdi-imeri@hotmail.com',
        subject: subject,
        text: message
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

//===================== CONTACT ENDS HERE ======================================

