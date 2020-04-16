var userArray = [];

async function connectToDB(){

  try {
    var result  = await fetch("http://localhost:3000/getUIDs" , {method:"GET"})
    userArray = await result.json();
  } catch (e){
    return false
  }

  if (userArray.length > 1 || userArray != undefined){
    return true
  } else {
    return false
  }
}


async function signUserIn(){

  var userIdExist = false
  if (connectToDB()){
    let user = document.getElementById("user_ID");
    for (let i = 0; i <  userArray.length; i++){
      if (user.value === userArray[i].user_id){
        userIdExist = true
        break
      }
    }

    if (userIdExist == false){
      alert(" Accoriding to our servers this u_id does not exist!\n\n You are welcome to try again");
      return;
    }
    
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
