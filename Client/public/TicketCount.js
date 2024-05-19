let studentIncrementButton = document.getElementById("studentIncrementTicket");
let studentDecrementButton = document.getElementById("studentDecrementTicket");
let incrementSeniorButton = document.getElementById("incrementSeniorTicket");
let decrementSeniorButton = document.getElementById("decrementSeniorTicket");
let incrementAdultButton = document.getElementById("incrementAdultTicket");
let decrementAdultButton = document.getElementById("decrementAdultTicket");
let incrementChildButton = document.getElementById("incrementChildTicket");
let decrementChildButton = document.getElementById("decrementChildTicket");
let nextPage= document.getElementById("seatPage");
let ticketAmount=0;


function setAmountAndLeave(){
    localStorage.setItem("amount",ticketAmount);
    window.open("./SeatSelection.html",'_self');
}

function incrementTicket(type){
    let element =document.getElementById(type);
    if(ticketAmount<10){
    element.innerHTML++
    ticketAmount++;
    }
    console.log(ticketAmount);
}

function decrementTicket(type){
    let element =document.getElementById(type);
    if(element.innerHTML>0){
    element.innerHTML--;
    ticketAmount--;
    console.log(ticketAmount);
    }
}

studentIncrementButton.addEventListener("click", function() {
    incrementTicket("studentTicketAmount");
});

studentDecrementButton.addEventListener("click", function() {
    decrementTicket("studentTicketAmount");
});

incrementAdultButton.addEventListener("click", function() {
    incrementTicket("adultTicketAmount");
});

decrementAdultButton.addEventListener("click", function() {
    decrementTicket("adultTicketAmount");
});

incrementSeniorButton.addEventListener("click", function() {
    incrementTicket("seniorTicketAmount");
});

decrementSeniorButton.addEventListener("click", function() {
    decrementTicket("seniorTicketAmount");
});

incrementChildButton.addEventListener("click", function() {
    incrementTicket("childTicketAmount");
});

decrementChildButton.addEventListener("click", function() {
    decrementTicket("childTicketAmount");
});

nextPage.addEventListener("click", function(){
    setAmountAndLeave();
});