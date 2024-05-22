document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.querySelector('input[type="date"]');
    const filmList = document.getElementById("FilmList");

    // Set date input to today's date and fetch movies
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    fetchMovies(today, filmList);

    dateInput.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        fetchMovies(selectedDate, filmList);
    });
});

async function fetchMovies(date, filmList) {
    try {
        const response = await fetch(`http://localhost:3000/movies/${date}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movies = await response.json();
        displayMovies(movies, filmList);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies, filmList) {
    // Clear previous movie elements
    filmList.innerHTML = '';

    // Group movies by title
    const moviesGroupedByTitle = movies.reduce((acc, movie) => {
        if (!acc[movie.title]) {
            acc[movie.title] = {
                title: movie.title,
                genre: movie.genre,
                image: movie.image,
                id_movie: movie.id_movie[0],
                id_theatre: movie.id_theatre,
                running_times: [],
                running_datetime: movie.running_datetime
            };
        }
        acc[movie.title].running_times.push(
            formatUTCTime(movie.running_datetime)
        );
        return acc;
    }, {});

    Object.values(moviesGroupedByTitle).forEach(movie => {
        const base64Image = movie.image ? `data:image/jpeg;base64,${movie.image}` : '';
        movieDiv(movie, base64Image, filmList);
    });
}

function OpenCheckOut() {
    if (localStorage.getItem("loggedIn") == "true")
        window.open("./CheckOutPage.html", '_self');
}

function storeSelectedMovie(movieDetails) {
    localStorage.setItem('selectedMovieDetails', JSON.stringify(movieDetails));
}

function movieDiv(movie, imageSRC, filmList) {
    let filmFlex = document.createElement("div");
    let posterImage = document.createElement("img");
    let filmDescriptionList = document.createElement("ul");
    let filmTitleItem = document.createElement("li");
    let filmAttributesItem = document.createElement("li");
    let filmTimeBoxItem = document.createElement("li");
    let filmTimeBox = document.createElement("div");

    filmFlex.classList.add("flex", "items-center");
    posterImage.setAttribute("src", imageSRC);
    posterImage.classList.add("h-auto", "w-36", "m-7", "md:w-56");
    filmTitleItem.classList.add("text-3xl", "font-BarlowSemiCondensed", "font-bold", "mb-4", "text-slate-700");
    filmAttributesItem.classList.add("text-2xl", "mb-4", "font-BarlowSemiCondensed", "text-slate-700");
    filmTimeBox.classList.add("flex", "gap-3");
    filmTitleItem.innerHTML = movie.title;
    filmAttributesItem.innerHTML = movie.genre;

    filmFlex.append(posterImage);
    filmFlex.append(filmDescriptionList);
    filmDescriptionList.append(filmTitleItem);
    filmDescriptionList.append(filmAttributesItem);
    filmDescriptionList.append(filmTimeBoxItem);
    filmTimeBoxItem.append(filmTimeBox);

    for (let i = 0; i < movie.running_times.length; i++) {
        let timeItem = document.createElement("button");
        timeItem.addEventListener('click', () => {
            storeSelectedMovie({
                movieTitle: movie.title,
                runningTime: movie.running_times[i],
                id_movie: movie.id_movie,
                id_theatre: movie.id_theatre,
                date: movie.running_datetime.split('T')[0]
            });
            OpenCheckOut();
        });
        timeItem.classList.add("bg-red-400", "border-2", "border-slate-700", "p-2", "border-opacity-70", "font-BarlowSemiCondensed", "font-bold", "flex-wrap", "hover:scale-110", "hover:ease-in", "duration-200");
        filmTimeBox.appendChild(timeItem);
        timeItem.innerHTML = movie.running_times[i];
    }

    filmList.appendChild(filmFlex);
}

function formatUTCTime(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
