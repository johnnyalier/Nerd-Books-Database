let password = "Manager!"

function submit(){
  let bossTextBox = document.getElementById("boss_id");
  if (bossTextBox.value == password){
    window.location.href = "/pages/addBooks.html";
  }else{
    alert("Wrong password!");
  }
}
