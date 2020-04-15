var userArray = [];

async function connectToDB(){

  try {
    console.log("Connected and we got the values in the array");
    var result  = await fetch("http://localhost:3000/getUIDs" , {method:"GET"})
    userArray = await result.json();
    console.log("userArray: "+ userArray[0].user_id);
  } catch (e){
    console.error("Cound not connect");
    return false
  }

  if (userArray.length > 1 || userArray != undefined){
    // we good here as it checks out
    console.log("userArray has items!");
    return true
  } else {
    return false
  }

}


async function signUserIn(){

  var userIdExist = false
  console.log("signUserIn function call begin");
  if (connectToDB()){
    console.log("connectToDB function returned TRUE");
    let user = document.getElementById("user_ID");
    console.log(" line 33 user.value: " + user.value);
    console.log("line 34: userArray[0]: " + userArray);
    for (let i = 0; i <  userArray.length; i++){

      console.log("object.user_id: " + userArray[i].user_id);
      if (user.value === userArray[i].user_id){
        userIdExist = true
        console.log("In for loop user.value " + user.value + " && user_id " + userArray[i].user_id);
        break
      }
    }

    if (userIdExist == false){
      alert(" Accoriding to our servers this u_id does not exist!\n\n You are welcome to try again");
      return;
    }

    console.log("signUserIn after the if statement for the POST");
    await fetch("http://localhost:3000/userID",
    {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        user_id:user.value
      })
    })

    window.location.href = "/pages/browsebooks.html"
  } else {
    alert("Couldn't connect to server actually");
  }
}
