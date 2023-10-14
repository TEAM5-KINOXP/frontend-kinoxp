import { sanitizeStringWithTableRows, makeOptions, handleHttpErrors} from "../../../utility.js";
import { API_URL } from "../../../settings.js";
const URL = API_URL + "/shows";


export async function initSchedule() {
    document.querySelector("#btn-submit-movieshow").addEventListener("click",addMovieShow);
    fetchAllMovieShows()
    dateLimiter()
    movieToImdb()
}

async function dateLimiter(){
     // JavaScript to restrict the date input to future dates within a 3-month window
     const today = new Date();
     const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
     const formattedMaxDate = maxDate.toISOString().split('T')[0];
     
     // Set the minimum date to today's date
     const formattedMinDate = today.toISOString().split('T')[0];
     
     const dateInput = document.getElementById("showing-date-input");
     dateInput.setAttribute("min", formattedMinDate);
     dateInput.setAttribute("max", formattedMaxDate);
}

async function addMovieShow(event){
    event.preventDefault()

    const showingDate = document.querySelector("#showing-date-input").value
    const imdbId = document.querySelector("#imdb-id-input").value
    const theaterId = document.querySelector("#theater-id-input").value
    const timeslot = document.querySelector("#timeslot-input").value
    const movieShowRequestBody = {
        
            showingDate : showingDate,
            movieId: imdbId,
            theaterId: theaterId,
            timeslot : timeslot  
    }

    const options = makeOptions("POST", movieShowRequestBody, true);
    await fetch(URL, options).then(r => handleHttpErrors(r));
    document.querySelector("#table-rows").innerHTML
    fetchAllMovieShows()
}

async function fetchAllMovieShows(){
    const options = makeOptions("GET", null, true);
    const movieShows = await fetch(URL + "/admin", options).then(r =>handleHttpErrors(r));
console.log(movieShows)
    const tableRows = movieShows.map(movieShow => `
  <tr>
  <td>${movieShow.id}</td>
  <td>${movieShow.showingDate}</td>
  <td>${movieShow.theaterId}</td>
  <td>${movieShow.movieTitle}</td>
  <td>${movieShow.timeslot}</td>
  <td><button id="${movieShow.id}_movieShow-id" class="btn btn-sm btn-danger delete-button" data-bs-toggle="modal" data-bs-target="#delete-modal">Delete</button></td>
  `)
  const tableRowsAsString = tableRows.join("");

  document.querySelector("#table-rows").innerHTML = sanitizeStringWithTableRows(tableRowsAsString);
  document.querySelector("#table-rows").addEventListener('click', setUpDeleteModal)
  document.querySelector("#btn-submit-movieshow").addEventListener("click", addMovieShow);
}


async function setUpDeleteModal(e) {
    const btn = e.target;

    if(!btn.id.includes("_movieShow-id")){
        return;
    }
    const movieShowId = btn.id.split("_")[0];
    const header = `Delete movie with id ${movieShowId}?`

    document.querySelector("#delete-modal-label").textContent = header;

    document.querySelector("#delete-button").addEventListener("click", async () => { await deleteMovieShow(movieShowId) });
    }

async function deleteMovieShow(id){
    try{
    const DELETE_URL = `${URL}/${id}`
    const delete_res = await fetch(DELETE_URL, makeOptions("DELETE", null, true)).then(r => handleHttpErrors(r))
    }catch(error){
        console.log(error)
    }
    document.querySelector("#table-rows").innerHTML
    fetchAllMovieShows()
}

async function movieToImdb() {
    const options = makeOptions("GET", null, true);

 const movies = await fetch(API_URL + "/movies", options).then(r =>handleHttpErrors(r));
  const selectOptions = movies.map(movie => `
  <option id="${movie.imdbID}" value="${movie.imdbID}">${movie.title}</option>
  `)
  const selectInputs = selectOptions.join("");

  document.querySelector("#imdb-id-input").innerHTML = sanitizeStringWithTableRows(selectInputs);

}
