const seatMatrix = document.getElementById("seatMatrix");
const selectedSeatsList = [];
const seats = [];
let seatIndex = 1;
let seatNumber=localStorage.getItem("amount");
let totalTickets=document.getElementById("totalTickets");


totalTickets.innerHTML="Total tickets: "+ seatNumber; 

function Seat(id, avalability) {
    this.id = id;
    this.available = avalability; // Corrected the syntax here
}

for (let i = 0; i < 40; i++) {

        const seatId = seatIndex;
        const seat = new Seat(seatId,true); 
        seats.push(seat);
        const seatDiv = document.createElement("div");
        const seatIdP=document.createElement("p");
        
        if(seat.available==false)
        seatDiv.classList.add("bg-zeus-800");
        seatDiv.classList.add("seat");
        seatDiv.classList.add("w-7");
        seatDiv.classList.add("m-4");
        seatDiv.classList.add("border-2");
        seatDiv.classList.add("px-4");
        seatDiv.classList.add("flex");
        seatDiv.classList.add("justify-center")
        seatDiv.id = seatId;
        seatIdP.textContent = seatId;
        seatMatrix.appendChild(seatDiv);
        seatDiv.appendChild(seatIdP);
        
        seatIndex++;
        seatDiv.addEventListener("click", function() { 
            selectSeat(seat); 
        });
    
}

function selectSeat(seat) {
    console.log(seatNumber)
    if (seat.available && seatNumber>0) {
        seat.available = false;
        selectedSeatsList.push(seat.id);
        seatNumber--; 
        totalTickets.innerHTML="Total tickets: "+ seatNumber; 
        document.getElementById(seat.id).classList.add("bg-mustard-100");
    } else if(seat.available==false){
        seat.available = true;
        seatNumber++;
        totalTickets.innerHTML="Total tickets: "+ seatNumber;
        const index = selectedSeatsList.indexOf(seat.id);
        if (index !== -1) {
            selectedSeatsList.splice(index, 1);
        }
        console.log(selectedSeatsList);
        
        document.getElementById(seat.id).classList.remove("bg-mustard-100");
    }
}
