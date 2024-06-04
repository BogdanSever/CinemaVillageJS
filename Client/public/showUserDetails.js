let username = document.getElementById("username")
let email = document.getElementById("email")


function getCredentials() {
    username.innerHTML = localStorage.getItem("fullName")
    email.innerHTML = localStorage.getItem("email")
}

getCredentials()