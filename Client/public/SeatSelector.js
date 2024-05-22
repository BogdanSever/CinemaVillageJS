document.addEventListener("DOMContentLoaded", () => {
    fetchMovieImage();
    fetchSeatAvailability();
});

async function fetchSeatAvailability() {
    try {
        const selectedMovieDetails = JSON.parse(localStorage.getItem('selectedMovieDetails'));

        if (!selectedMovieDetails || !selectedMovieDetails.id_movie || !selectedMovieDetails.runningTime) {
            throw new Error('No movie ID or running time found in local storage');
        }

        let { runningTime, id_movie, id_theatre, date } = selectedMovieDetails;

        const datetime = `${date} ${runningTime}:00.000`; // Format to 'YYYY-MM-DD HH:mm:ss.SSS'

        // Fetch seat availability
        const availabilityResponse = await fetch(`http://localhost:3000/availability/${id_movie}/${id_theatre}/${datetime}`);
        if (!availabilityResponse.ok) {
            throw new Error(`HTTP error! status: ${availabilityResponse.status}`);
        }
        const availabilityData = await availabilityResponse.json();

        populateSeats(availabilityData);
    } catch (error) {
        console.error('Error fetching seat availability:', error);
    }
}

function populateSeats(availabilityDataStr) {
    let availabilityData;

    try {
        availabilityData = JSON.parse(availabilityDataStr);
    } catch (error) {
        console.error("Invalid JSON string provided:", error);
        return;
    }

    if (!availabilityData || !availabilityData.seats) {
        console.error("Invalid availability data structure.");
        return;
    }

    const seatMatrix = document.getElementById("seatMatrix");
    seatMatrix.innerHTML = ""; // Clear any existing seats
    const selectedSeatsList = [];
    const seats = [];
    let seatIndex = 1;
    let seatNumber = parseInt(localStorage.getItem("amount"), 10) || 0;
    let totalTickets = document.getElementById("totalTickets");

    totalTickets.innerHTML = "Total tickets: " + seatNumber;

    function Seat(id, availability) {
        this.id = id;
        this.available = availability;
    }

    for (let i = 0; i < availabilityData.seats.length; i++) {
        const seatId = seatIndex;
        const seatAvailability = availabilityData.seats[i].state === 0; // Assuming 0 is available and 1 is taken
        const seat = new Seat(seatId, seatAvailability);
        seats.push(seat);
        const seatDiv = document.createElement("div");
        const seatIdP = document.createElement("p");

        if (!seat.available) {
            seatDiv.classList.add("bg-zeus-800");
        }
        seatDiv.classList.add("seat");
        seatDiv.classList.add("w-7");
        seatDiv.classList.add("m-4");
        seatDiv.classList.add("border-2");
        seatDiv.classList.add("px-4");
        seatDiv.classList.add("flex");
        seatDiv.classList.add("justify-center");
        seatDiv.id = seatId;
        seatIdP.textContent = seatId;
        seatDiv.appendChild(seatIdP);

        if (seatIndex % 10 === 1) {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("flex", "flex-row");
            seatMatrix.appendChild(rowDiv);
        }

        seatMatrix.lastChild.appendChild(seatDiv);

        seatIndex++;
        seatDiv.addEventListener("click", function () {
            selectSeat(seat, i);
        });
    }

    function selectSeat(seat, index) {
        if (seat.available && seatNumber > 0) {
            seat.available = false;
            selectedSeatsList.push(seat.id);
            seatNumber--;
            availabilityData.seats[index].state = 1; // Update the availability data
            totalTickets.innerHTML = "Total tickets: " + seatNumber;
            document.getElementById(seat.id).classList.add("bg-mustard-100");
        } else if (!seat.available) {
            seat.available = true;
            seatNumber++;
            availabilityData.seats[index].state = 0; // Update the availability data
            totalTickets.innerHTML = "Total tickets: " + seatNumber;
            const selectedIndex = selectedSeatsList.indexOf(seat.id);
            if (selectedIndex !== -1) {
                selectedSeatsList.splice(selectedIndex, 1);
            }
            document.getElementById(seat.id).classList.remove("bg-mustard-100");
        }
    }

    function saveAvailability() {
        const selectedMovieDetails = JSON.parse(localStorage.getItem('selectedMovieDetails'));
        let { runningTime, id_movie, id_theatre, date } = selectedMovieDetails;
        const datetime = `${date}T${runningTime}:00.000`;

        fetch('http://localhost:3000/updateAvailability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_movie,
                id_theatre,
                date: datetime,
                availabilityData
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error updating availability:', data.error);
                } else {
                    console.log('Availability updated successfully:', data.message);
                    // Fetch user ID and then create booking
                    getUserIdAndMovieXrefTheatreIdAndCreateBooking(selectedSeatsList); // Pass selected seats
                }
            })
            .catch(error => {
                console.error('Error updating availability:', error);
            });
    }

    async function getUserIdAndMovieXrefTheatreIdAndCreateBooking(selectedSeatsList) {
        const userEmail = localStorage.getItem('email'); // Assuming you store the user email in localStorage

        try {
            const userResponse = await fetch(`http://localhost:3000/getUserId/${userEmail}`);

            if (!userResponse.ok) {
                throw new Error(`HTTP error! status: ${userResponse.status}`);
            }

            const userData = await userResponse.json();

            if (userData.error) {
                console.error('Error fetching user ID:', userData.error);
                return;
            }

            const userId = userData.id_user;
            const selectedMovieDetails = JSON.parse(localStorage.getItem('selectedMovieDetails'));
            let { id_movie, id_theatre, runningTime, date } = selectedMovieDetails;
            const datetime = `${date} ${runningTime}:00.000`;
            console.log(datetime);
            const movieXrefTheatreResponse = await fetch(`http://localhost:3000/getMovieXrefTheatreId/${id_movie}/${id_theatre}/${datetime}`);

            if (!movieXrefTheatreResponse.ok) {
                throw new Error(`HTTP error! status: ${movieXrefTheatreResponse.status}`);
            }

            const movieXrefTheatreData = await movieXrefTheatreResponse.json();

            if (movieXrefTheatreData.error) {
                console.error('Error fetching movie x theatre ID:', movieXrefTheatreData.error);
                return;
            }

            const id_movie_xref_theatre = movieXrefTheatreData.id_movie_xref_theatre;
            createBooking(userId, id_movie_xref_theatre, selectedSeatsList); // Pass selected seats
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function createBooking(userId, id_movie_xref_theatre, selectedSeatsList) { // Accept selected seats
        const bookingTime = new Date().toISOString(); // Current timestamp

        try {
            const bookingResponse = await fetch('http://localhost:3000/createBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_user: userId,
                    id_movie_xref_theatre,
                    seats_booked: JSON.stringify(selectedSeatsList), // Save selected seats as JSON
                    booking_time: bookingTime
                })
            });

            if (!bookingResponse.ok) {
                throw new Error(`HTTP error! status: ${bookingResponse.status}`);
            }

            const bookingData = await bookingResponse.json();

            if (bookingData.error) {
                console.error('Error creating booking:', bookingData.error);
            } else {
                console.log('Booking created successfully:', bookingData.message);
                // Redirect after successful booking creation
                window.location.href = 'http://127.0.0.1:5500/Client/public';
            }
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    }

    function checkAllSeatsSelected() {
        // Check if the number of selected seats matches the intended seat number
        return selectedSeatsList.length === parseInt(localStorage.getItem("amount"), 10);
    }

    // Add an event listener to the "Reserve" button
    document.getElementById('seatReservations').addEventListener('click', function () {
        if (checkAllSeatsSelected()) {
            saveAvailability();
        } else {
            alert('Please select all seats before reserving.');
        }
    });
}

function updateMovieDetails(movie, imageSrc) {
    const movieTitleElement = document.getElementById('movieTitle');
    const bannerImageElement = document.getElementById('bannerImage');
    const posterImageElement = document.getElementById('posterImage');

    movieTitleElement.textContent = movie.movieTitle;
    bannerImageElement.src = imageSrc;
    posterImageElement.src = imageSrc;
}

async function fetchMovieImage() {
    try {
        const selectedMovieDetails = JSON.parse(localStorage.getItem('selectedMovieDetails'));

        if (!selectedMovieDetails || !selectedMovieDetails.id_movie) {
            throw new Error('No movie ID found in local storage');
        }

        const movieId = selectedMovieDetails.id_movie;

        // Fetch movie image
        const imageResponse = await fetch(`http://localhost:3000/image/${movieId}`);
        if (!imageResponse.ok) {
            throw new Error(`HTTP error! status: ${imageResponse.status}`);
        }
        const imageBlob = await imageResponse.blob();
        const imageSrc = URL.createObjectURL(imageBlob);

        updateMovieDetails(selectedMovieDetails, imageSrc);
    } catch (error) {
        console.error('Error fetching movie image:', error);
    }
}
