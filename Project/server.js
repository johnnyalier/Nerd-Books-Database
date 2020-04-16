const {Client} = require("pg") //postgres nodeJs creation
const express = require("express")
const app = express() //this handle client - server requests
const util = require("util") //for printing
const unique = require("uuid") //generate unique characters

app.use(express.json())
app.use(express.static("."))

const client = new Client({
  "user":     "postgres",
  "password": "Whysky91",
  "host":     "localhost",
  "port":     "5432",
  "database": "postgres"
})

let serverUID;
let user;
let connected;
let uniqueID;
var track_No;

//To connect to the postgresql server
connectAndStart();
async function connectAndStart(){await client.connect();}

//to get the user id from the user table
app.get("/getUIDs", connectToDB);
async function connectToDB(req, res){
  let result = {}
  try{
    const queryResult = await client.query("select user_ID from users");
    serverUID = queryResult.rows;

    res.setHeader("content-type", "application/json");
    res.status(200).send(JSON.stringify(queryResult.rows));

    connected = true
    result.success = true
  }catch(e){
    connected = false
    result.success = false
  }
}

app.post("/addUser", addUser);
async function addUser(req, res){
  let result = {}
  console.log("req body ");
  console.log(req.body);
  try{
    var userQuery = "insert into users(user_ID, first_name, last_name, username, password, address, city, province, postal_code) values(";
    userQuery = userQuery.concat(parseInt(req.body.user_ID));
    userQuery = userQuery.concat(",");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.first_name);
    userQuery = userQuery.concat("',");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.last_name);
    userQuery = userQuery.concat("',");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.username);
    userQuery = userQuery.concat("',");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.password);
    userQuery = userQuery.concat("',");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.address);
    userQuery = userQuery.concat("',");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.city);
    userQuery = userQuery.concat("',");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.province);
    userQuery = userQuery.concat("',");

    userQuery = userQuery.concat("'");
    userQuery = userQuery.concat(req.body.postal_code);
    userQuery = userQuery.concat("'");

    userQuery = userQuery.concat(")");

    await client.query(userQuery);
    result.success = true
    uniqueID = parseInt(req.body.user_ID);
    user = req.body
  }catch(e){
    result.success = false
  }finally{
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result));
  }
}

// the Manager adds a book to the database
app.post("/addBook" , insertBook);
async function insertBook(req , res){
  let result = {}
  try {
    var insertBookQuery = "insert into books (isbn, title, author, genre, pub_ID, pages, price, quantity) values(";
    
    // Build query to be sent to the database server
    insertBookQuery = insertBookQuery.concat(parseInt(req.body.isbn));
    insertBookQuery = insertBookQuery.concat(",");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.title);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.author);

    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.genre);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat(parseInt(req.body.pub_ID));
    insertBookQuery = insertBookQuery.concat(",");

    insertBookQuery = insertBookQuery.concat(parseInt(req.body.pages));
    insertBookQuery = insertBookQuery.concat(",");

    insertBookQuery = insertBookQuery.concat(parseInt(req.body.price));
    insertBookQuery = insertBookQuery.concat(",");

    insertBookQuery = insertBookQuery.concat(parseInt(req.body.quantity));

    insertBookQuery = insertBookQuery.concat(")");

    // execute the query that we typed in variable
    await client.query(insertBookQuery);
    result.success = true
  }catch (e){
    result.success = false
  }finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }
}

//The manager can also remove a book from the database
app.post("/removeBook" , removeBook);
async function removeBook(req, res){
  let result = {}
  try {
    // this query deletes from the server a book with a specific ISBN
    let deleteQuery = "delete from books where isbn = '"
    deleteQuery = deleteQuery.concat(parseInt(req.body.remove));
    deleteQuery = deleteQuery.concat("'");
    
    // excutes the query
    await client.query(deleteQuery);
    result.success = true
  } catch (e){
    result.success = false
  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }
}

//Get the books from the database
app.get("/getBooks", getBooks);
async function getBooks(req, res){
  try {
    // connecting to server to execute query
    let getBooksResult = await client.query("select * from books");
    let books = getBooksResult.rows;
    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(books));
  } catch (e){
    console.error("getBooks GET: Cound not connect" + e);
  }
}

app.post("/addToOrders", addToOrders);
async function addToOrders(req , res){
  // we got the isbn of the book to add to the Book Store
  let isbn = parseInt(req.body.isbn)
  let price = parseInt(req.body.price)
  let quantity = 1;
  let result = {}
  
  // make a query to add to the Book Store using the credentials of the user on the server
  try {
    let currentUserResult =  await client.query("select * from users where user_ID = '" + uniqueID + "'")
    let currentUser = currentUserResult.rows

    // Start building the query from here
    var addToOrdersQuery = "insert into orders(user_id, ISBN, track_No, price, quantity) values(";

    // this if statement using determines if the user actually has a file for us to add their bill_info and ship_info to the query
    if (currentUser[0].user_id != undefined){
      addToOrdersQuery = addToOrdersQuery.concat(currentUser[0].user_id);
      addToOrdersQuery = addToOrdersQuery.concat(",");

      addToOrdersQuery = addToOrdersQuery.concat("'");
      addToOrdersQuery = addToOrdersQuery.concat(isbn);
      addToOrdersQuery = addToOrdersQuery.concat("',");

      addToOrdersQuery = addToOrdersQuery.concat("'");
      addToOrdersQuery = addToOrdersQuery.concat(unique.v4());
      addToOrdersQuery = addToOrdersQuery.concat("',");

      addToOrdersQuery = addToOrdersQuery.concat(price);
      addToOrdersQuery = addToOrdersQuery.concat(",");

      addToOrdersQuery = addToOrdersQuery.concat(quantity);
      addToOrdersQuery = addToOrdersQuery.concat(")");
      await client.query(addToOrdersQuery);
    }

    // when the book is added to the cart then the quantity is decreased for that book
    var updateQuantityQuery = "update books set quantity = quantity - 1 where isbn = '" + isbn + "'"
    await client.query(updateQuantityQuery)
    result.success = true
  } catch (e){
    result.success = false
  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }
}

app.get("/viewOrders" , viewOrders)
async function viewOrders(req , res){
  let result = {}

  try {
    var orderItems = "select * from orders where user_id = '"+uniqueID + "'"
    let query = await client.query(orderItems)

    result.success = true
    result.result = query.rows
  } catch (e){
    result.success = false

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }
}

app.post("/userID" , oneUserId);
async function oneUserId(req , res){
  let result = {}
  uniqueID = req.body.user_id
  result.success = true
  res.setHeader("content-type" , "application/json");
  res.send(JSON.stringify(result));
}


app.listen(3000, () => console.log("Server is listening @localhost port 3000"))
