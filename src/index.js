// Define the base URL for API requests
const baseURL = 'http://localhost:3000';

// Elements for ticket purchasing
const buyTicketButton = document.getElementById('buy-ticket');
const remainingTicketsElement = document.getElementById('ticket-num');

// Event listener for ticket purchase
buyTicketButton.addEventListener('click', handleTicketPurchase);

// Fetch and display the first movie's data
fetchMovieData(`${baseURL}/films/1`)
    .then(displayMovieDetails)
    .catch(logError);

// Fetch and populate the film menu
fetchMovies(`${baseURL}/films`)
    .then(populateFilmMenu)
    .catch(logError);

// Function to fetch movie data by ID
function fetchMovieData(url) {
    return fetch(url).then(response => response.json());
}

// Function to display movie details on the page
function displayMovieDetails(data) {
    const remainingTickets = data.capacity - data.tickets_sold;
    document.getElementById('poster').src = data.poster;
    document.getElementById('title').innerText = data.title;
    document.getElementById('runtime').innerText = `${data.runtime} minutes`;
    document.getElementById('showtime').innerText = data.showtime;
    remainingTicketsElement.innerText = remainingTickets;

  // Mark the movie as "Sold Out" if there are no remaining tickets
    if (remainingTickets === 0) {
    markMovieAsSoldOut();
    }
}

// Function to mark a movie as "Sold Out" and disable the Buy Ticket button
function markMovieAsSoldOut() {
    buyTicketButton.innerText = 'Sold Out';
    buyTicketButton.disabled = true;
}

// Function to fetch all movies
function fetchMovies(url) {
    return fetch(url).then(response => response.json());
}

// Function to populate the film menu
function populateFilmMenu(data) {
    const filmsList = document.getElementById('films');
    data.forEach(movie => {
    const li = createMovieElement(movie);
    filmsList.appendChild(li);
    });
    removeDefaultPlaceholder();
}

// Function to create a movie element
function createMovieElement(movie) {
    const li = document.createElement('li');
    li.classList.add('film', 'item');
    li.textContent = movie.title;
    const deleteButton = createDeleteButton(movie, li);
    li.appendChild(deleteButton);
    li.addEventListener('click', () => fetchMovieDataAndDisplay(`${baseURL}/films/${movie.id}`));
    return li;
}

// Function to create a delete button for each film
function createDeleteButton(movie, li) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => removeMovie(`${baseURL}/films/${movie.id}`, li));
    return deleteButton;
}

// Function to fetch movie data and display details
function fetchMovieDataAndDisplay(url) {
    return fetch(url)
    .then(response => response.json())
    .then(displayMovieDetails)
    .catch(logError);
}

// Function to remove a movie from the list and the server
function removeMovie(url, li) {
    return fetch(url, {
    method: 'DELETE'
    })
    .then(() => {
        li.remove();
    })
    .catch(logError);
}

// Function to remove the default placeholder li element
function removeDefaultPlaceholder() {
    const placeholderElement = document.querySelector('#films .film');
    if (placeholderElement) {
        placeholderElement.remove();
    }
}

// Function to handle the ticket purchase
function handleTicketPurchase() {
    let remainingTickets = parseInt(remainingTicketsElement.innerText);
    if (remainingTickets > 0) {
        remainingTickets--;
        remainingTicketsElement.innerText = remainingTickets;
    if (remainingTickets === 0) {
        markMovieAsSoldOut();
    }
    updateTicketSales(1, remainingTickets); // Adjust movie ID as needed
  } else {
    markMovieAsSoldOut();
  }
}

// Function to update ticket sales on the server
function updateTicketSales(movieId, remainingTickets) {
  const url = `${baseURL}/films/${movieId}`;
  const data = {
    tickets_sold: film.capacity - remainingTickets,
  };

  return fetch(url, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), 
    })
        .then(response => response.json())
        .then(data => {
        console.log('Ticket purchase successful:', data);
    })
    .catch(logError);
}

// Function to handle errors
function logError(error) {
console.error('Error:', error);
}
