let isbn;

async function loadBooks(){
  try{
    var result = await fetch("http://localhost:3000/getBooks", {method:"GET"});
    let books   = await result.json();

    let booksDiv       = document.getElementById("booksDiv");
    booksDiv.innerHTML = "" // make sure to clear the innerHTML before adding anything
    for (b of books) {
      var breakLine = document.createElement("br");
      var book      = document.createElement("input");
      var bookLabel = document.createElement("label");


      var innerHTML ="ISBN: " + b.isbn + "  Title: " + b.title + "  Author: " + b.author + "  Genre: " + b.genre + "  Pub_ID: " + b.pub_id + "  pages: " + b.pages + "  Price: " + b.price + "  Quantity: " + b.quantity;
      book.setAttribute("type" , "checkBox");
      book.setAttribute("id" , b.isbn);
      book.setAttribute("name" , b.price);
      book.setAttribute("onchange", "addToOrders(this.checked, this.id, this.name)");
      bookLabel.innerHTML = innerHTML

      isbn = b.isbn;
      booksDiv.appendChild(book);
      booksDiv.appendChild(bookLabel);
      booksDiv.appendChild(breakLine);
    }
  }catch(e){
    return false
  }
}

async function addToOrders(checked, isbn, price){
  if (checked){
    let result = await fetch("http://localhost:3000/addToOrders",
    {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        isbn:isbn,
        price:price
      })
    });
  }
}

async function viewOrders(){
  try {
    var result  = await fetch("http://localhost:3000/viewOrders" , {method:"GET"});
    let booksInCart   = await result.json();

    let viewOrders       = document.getElementById("viewOrders");
    viewOrders.innerHTML = ""

    // Each book the user checks is added to the orders relation
    if (booksInCart.success){
      for (b of booksInCart.result) {
        var breakLine = document.createElement("br");
        var book      = document.createElement("input");
        var bookLabel = document.createElement("label");
        var innerHTML = "User_ID: " + b.user_id + "  ISBN: " + b.isbn + "   track_No: " + b.track_no + "  Price: " + b.price + "   Quantity: " + b.quantity;
        book.setAttribute("type", "checkBox");
        book.setAttribute("id", b.isbn);
        book.setAttribute("name", b.user_id);
        book.setAttribute("onchange", "removeFromCart(this.checked , this.id, this.name)");
        bookLabel.innerHTML = innerHTML

        viewOrders.appendChild(book);
        viewOrders.appendChild(bookLabel);
        viewOrders.appendChild(breakLine)
      }
    }
  } catch(e) {
    console.log("ERROR viewOrders(): " + e);
  }
}

async function removeFromCart(checked , isbn, user_ID){
  if (checked){
    let result = await fetch("http://localhost:3000/removeFromCart",
    {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        isbn:isbn,
        user_id:user_ID
      })
    })
    // makes a request to the server
    updateQuantity(isbn)
  }
}

async function updateQuantity(isbn){

  // get the div where all the input tags are
  let viewOrders = document.getElementById("viewOrders");
  let counter = 0;

  let children = viewOrders.childNodes;
  for (child of children){
    if (child.tagName == "INPUT" && child.id == isbn){
      counter ++;
    }
  }
  // make a POST request to the server to update the values for the quntity on the books on the server
  await fetch("http://localhost:3000/updateQuantity",
  {
    method:"POST",
    headers:{
      "content-type":"application/json"
    },
    body:JSON.stringify({
      count:counter,
      isbn:isbn
    })
  })
}
