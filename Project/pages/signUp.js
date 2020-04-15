const MAX_CHAR = 8
var serverUID = [];

async function connectToDB(){
  try{
    console.log("Successfully connected to the server");
    var result = await fetch("http://localhost:3000/getUIDs", {method:"GET"})
    serverUID = await result.json();
    console.log(serverUID);
  }catch(e){
    console.log("Couldn't Connect To Server");
    return false
  }

  if(serverUID.length > 1 || serverUID != undefined){
    return true
  }else{
    return false
  }
}

let user_ID = document.getElementById("user_ID");
let first_name = document.getElementById("first_name");
let last_name = document.getElementById("last_name");
let username = document.getElementById("username");
let password = document.getElementById("password");
let address = document.getElementById("address");
let city = document.getElementById("city");
let province = document.getElementById("province");
let postal_code = document.getElementById("postal_code");

async function validateValues(){
  var valid = true

  //Connect to database and retrieve the user_ID
  if(connectToDB() && Array.isArray(serverUID)){
    for(item of serverUID){
      if(user_ID.value === item.user_ID){
        valid = false
        console.log("user_ID already exist");
      }
    }
    if(valid == false){
      alert("User ID is being used by another user.");
      return;
    }

    console.log("Password is " + password);
    console.log("Username is " + user_ID);

    if(password.value.length != MAX_CHAR || username.value.length == 0){
      alert("Password must be 8 characters long or Username cannot be null!");
    }else{
      if(addUser()){
        window.location.href = "/pages/browsebooks.html"
      }else{
        alert("User Could not be added!")
      }
    }
  }else{
    alet("Issues connecting to the server!");
  }
}

//Add user to Postges server
async function addUser(){
  let body = {}
  body.user_ID = user_ID.value;
  body.first_name = first_name.value;
  body.last_name = last_name.value;
  body.username = username.value;
  body.password = password.value;
  body.address = address.value;
  body.city = city.value;
  body.province = province.value;
  body.postal_code = postal_code.value;

  let result;

  try{
    result = await fetch("http://localhost:3000/addUser", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(body)})
    return result.success
  }catch(e){
    return false
  }
}
