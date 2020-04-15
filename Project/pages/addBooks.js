async function addBook(){
  // here we add a book
  let body = {}

  let author = document.getElementById("author").value;
  let genre = document.getElementById("genre").value;
  let pub_ID = document.getElementById("pub_ID").value;
  let pages = document.getElementById("pages").value;
  let price = document.getElementById("price").value;
  let isbn = document.getElementById("ISBN").value;
  let title = document.getElementById("title").value;
  let quantity = document.getElementById("quantity").value;

  body.author = author;
  body.genre = genre;
  body.pub_ID = pub_ID;
  body.pages = pages;
  body.price = price;
  body.isbn = isbn;
  body.title = title;
  body.quantity = quantity;

  let success;

  try {
    success = await fetch ("http://localhost:3000/addBook", {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(body)
    })

    
  } catch (e) {
    return success.success
    console.log("ISSUE catch e");
  }
}

async function removeBook(){
  // we take the isbn to remove the book
  let isbn = document.getElementById("isbnRemove").value;
  await fetch ("http://localhost:3000/removeBook",
  {
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({remove:isbn})
  })
}
