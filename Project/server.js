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
    console.log("connectToDB");
    const queryResult = await client.query("select user_ID from users");
    serverUID = queryResult.rows;
    console.log(serverUID);

    res.setHeader("content-type", "application/json");
    res.status(200).send(JSON.stringify(queryResult.rows));

    connected = true
    result.success = true
    console.log("Successfully logged in");
  }catch(e){
    console.error("getUIDs: Couldn't connect");
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
    //userQuery = userQuery.concat("'");
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
    console.log("Query added Successfully!");
    uniqueID = parseInt(req.body.user_ID);
    user = req.body
  }catch(e){
    result.success = false
    console.log("Query  unsuccessful " + e);
  }finally{
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result));
  }
}

// the Boss does all of this
app.post("/addBook" , insertBook);
async function insertBook(req , res){
  let result = {}
  try {
    // we are making the query string so we can add the book from the "boss"
    var insertBookQuery = "insert into books (isbn, title, author, genre, pub_ID, pages, price, quantity) values(";

    console.log(req.body);

    // here I generate a unique ID and i'm using that UUID to create the Publisher Id for the Database pub_id

    //console.log("First 8 characters of " + isbn.substring(0,8));


    // here we are building the SQL query by taking the values from the body of the POST request
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
    console.log("insertBook: Query Execution was a SUCCESS");
  }catch (e){
    console.log("insertBook: Query Execution was NOT a SUCCESS");
    result.success = false
  }finally {
    console.log("insertBook: Connection to server: Sending");
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("insertBook: something was sent");
    console.log(result);
  }
}




app.post("/removeBook" , removeBook);
async function removeBook(req, res){
  let result = {}

  try {
    // this query deletes from the server a book with a specific ISBN
    let deleteQuery = "delete from books where isbn = '"
    deleteQuery = deleteQuery.concat(parseInt(req.body.remove));
    deleteQuery = deleteQuery.concat("'");
    console.log("line 184 req.body" + req.body.remove);
    console.log("line 185 deleteQuery " + deleteQuery);
    // excutes the query
    await client.query(deleteQuery);
    result.success = true
    console.log("removeBook: removing book was a success");
  } catch (e){
    result.success = false
    console.log("removeBook: removing book didn't work");
  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("removeBook: something was sent");
    console.log(result);
  }
}

app.get("/getBooks", getBooks);
async function getBooks(req, res){
  try {
    // connecting to server to execute query
    let getBooksResult = await client.query("select * from books");
    let books = getBooksResult.rows;
    console.log("getBooks GET: We have gotten the books")
    console.log(books);
    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(books));
  } catch (e){
    console.error("getBooks GET: Cound not connect" + e);
  }
}

app.post("/addToOrders", addToOrders);
async function addToOrders(req , res){
  // we got the isbn of the book to add to the Book Store
  console.log("Get price and ISBN from req body!");
  console.log(req.body);
  let isbn = parseInt(req.body.isbn)
  let price = parseInt(req.body.price)
  console.log("uniqueID " + uniqueID);

  //let price = parseInt(req.bdoy.price)
  let quantity = 1;
  console.log("addToOrders: isbn -> " + isbn);

  let result = {}
  // make a query to add to the Book Store using the credentials of the user on the server
  try {
    // gets me the user's ship_info and bill_info based on that u_id
    let currentUserResult =  await client.query("select * from users where user_ID = '" + uniqueID + "'")
    let currentUser = currentUserResult.rows
    console.log("addToBookStoreCart: uniqueID = " + uniqueID + " currentUser ");
    console.log(currentUser);

    // this is where the query is built to be sent to the server to add the order by the user
    var addToOrdersQuery = "insert into orders(user_id, ISBN, track_No, price, quantity) values(";

    //insert into orders(user_ID, ISBN, track_No, price, quantity)

    console.log("addToBookStoreCart: currentUser[0].bill_info " + currentUser[0].user_id);

    // this if statement using determines if the user actually has a file for us to add their bill_info and ship_info to the query
    if (currentUser[0].user_id != undefined){
      // here we are building the SQL query by taking the values from the body of the POST request
      //addToOrdersQuery = addToOrdersQuery.concat("'");
      addToOrdersQuery = addToOrdersQuery.concat(currentUser[0].user_id);
      addToOrdersQuery = addToOrdersQuery.concat(",");

      addToOrdersQuery = addToOrdersQuery.concat("'");
      addToOrdersQuery = addToOrdersQuery.concat(isbn);
      addToOrdersQuery = addToOrdersQuery.concat("',");

      // addToOrdersQuery = addToOrdersQuery.concat("'");
      // addToOrdersQuery = addToOrdersQuery.concat(order_num.substring(0,21));
      // addToOrdersQuery = addToOrdersQuery.concat("',");

      addToOrdersQuery = addToOrdersQuery.concat("'");
      addToOrdersQuery = addToOrdersQuery.concat(unique.v4());
      addToOrdersQuery = addToOrdersQuery.concat("',");

      //addToOrdersQuery = addToOrdersQuery.concat("");
      addToOrdersQuery = addToOrdersQuery.concat(price);
      // addToOrdersQuery = addToOrdersQuery.concat(uniqueID);
      addToOrdersQuery = addToOrdersQuery.concat(",");

      addToOrdersQuery = addToOrdersQuery.concat(quantity);
      addToOrdersQuery = addToOrdersQuery.concat(")");
      // execute add query to the bookstore i.e. the cart
      await client.query(addToOrdersQuery);
    }

    // when the book is added to the cart then the quantity is decreased for that book
    var updateQuantityQuery = "update books set quantity = quantity - 1 where isbn = '" + isbn + "'"
    await client.query(updateQuantityQuery)
    result.success = true
    console.log("addToBookStore POST: Query Execution was a success");
  } catch (e){
    result.success = false
    console.log("addToBookStore POST: Query Execution was NOT a success " + e);
  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("addToBookStore POST: something was sent ");
    console.log(result);
  }
}

app.get("/viewOrders" , viewOrders)
async function viewOrders(req , res){
  let result = {}

  try {

    // this query gets all the books on the server for the user id
    var orderItems = "select * from orders where user_id = '"+uniqueID + "'"

    console.log("uniqueID = " + uniqueID);
    let query = await client.query(orderItems)

    result.success = true
    result.result = query.rows
    console.log("viewOrders POST: Query Execution was a success");


  } catch (e){

    result.success = false
    console.log("viewOrders POST: Query Execution was NOT a success");

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("uniqueID => " + uniqueID);
    console.log(result);
  }

}

app.post("/userID" , oneUserId);
async function oneUserId(req , res){
  let result = {}
  uniqueID = req.body.user_id
  result.success = true
  console.log("User_ID on server-side in post function theUserId is " + uniqueID);
  res.setHeader("content-type" , "application/json");
  res.send(JSON.stringify(result));
  console.log(result);
}


app.listen(3000, () => console.log("Server is listening @localhost port 3000"))
