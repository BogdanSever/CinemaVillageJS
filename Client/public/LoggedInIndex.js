let joinButton=document.getElementById("join");
let profileButton=document.getElementById("userProfile")

console.log(localStorage.getItem("loggedIn"))


window.onload= function loggedNavBar(){
    if(localStorage.getItem("loggedIn")=="true"){

    joinButton.classList.add("hidden");
    profileButton.classList.remove("hidden");
}else{
    console.log(2)
}
}
