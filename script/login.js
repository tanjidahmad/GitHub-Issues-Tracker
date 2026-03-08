function login(){

const username = document.getElementById("username").value.trim()
const password = document.getElementById("password").value.trim()

if(username === "admin" && password === "admin123"){

localStorage.setItem("login","true")

window.location.href = "main.html"

}else{

alert("Invalid Username or Password")

}

}