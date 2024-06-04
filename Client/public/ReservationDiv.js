const reservationList = document.getElementById("OutgoingReservation");

function dynamicDiv(title, date, time, seats) {
    const redCircle = document.createElement("span");
    redCircle.classList.add("rounded-full", "w-2", "h-2", "bg-[#D2042D]", "block");

    let li = document.createElement("li");
    li.classList.add("flex", "gap-4", "text-xl", "items-center");
    reservationList.appendChild(li);

    let titleDiv = document.createElement("p");
    titleDiv.textContent = title;
    li.appendChild(titleDiv);

    let dateDiv = document.createElement("p");
    dateDiv.textContent = date;
    li.appendChild(dateDiv);

    let timeDiv = document.createElement("p");
    timeDiv.textContent = time;
    li.appendChild(timeDiv);

    // Remove the leading and trailing square brackets if they exist
    if (seats.startsWith('"[') && seats.endsWith(']"')) {
        seats = seats.slice(2, -2);
    }

    // Split the seats string into an array and join with commas
    let seatsArray = seats.split(',').map(s => s.trim());
    let seatsDiv = document.createElement("p");
    seatsDiv.textContent = `Seats: ${seatsArray.join(', ')}`;
    li.appendChild(seatsDiv);

    li.appendChild(redCircle);
}

async function fetchReservations() {
    const email = localStorage.getItem('email');
    if (!email) {
        console.error('No email found in localStorage');
        return;
    }

    try {
        // Fetch the user_id using the email
        const userIdResponse = await fetch(`http://localhost:3000/getUserId/${encodeURIComponent(email)}`);
        const userIdResult = await userIdResponse.json();

        if (!userIdResponse.ok || !userIdResult.id_user) {
            console.error('Failed to fetch user ID');
            return;
        }

        const userId = userIdResult.id_user;

        // Fetch reservations using the user_id
        const reservationsResponse = await fetch(`http://localhost:3000/reservations/${userId}`);
        const reservations = await reservationsResponse.json();

        if (!reservationsResponse.ok) {
            console.error('Failed to fetch reservations:', reservations.error);
            return;
        }

        reservations.forEach(reservation => {
            const { title, running_datetime, seats_booked } = reservation;
            const date = new Date(running_datetime).toLocaleDateString();
            const time = new Date(running_datetime).toLocaleTimeString();
            dynamicDiv(title, date, time, seats_booked);
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
}

fetchReservations();