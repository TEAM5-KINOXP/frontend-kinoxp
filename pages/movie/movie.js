import { sanitizeStringWithTableRows, makeOptions, handleHttpErrors} from "../../utility.js";
import { API_URL } from "../../settings.js";
const url = API_URL + "/movies";


export async function initMovie() {
  const options = makeOptions("GET",null, true);
  const movies = await fetch(url, options).then(handleHttpErrors);

  const tableRows = movies.map(movie => `
  <tr>
  <td id="movie-ID">${movie.id}</td>
  <td>${movie.title}</td>
  <td>${movie.genre}</td>
  <td>
  <td><button id="${movie.id}_movie-id" class="btn btn-sm btn-danger delete-button" data-bs-toggle="modal" data-bs-target="#delete-modal">Delete</button></td>
  `)
  const tableRowsAsString = tableRows.join("");

  document.querySelector("#table-rows").innerHTML = sanitizeStringWithTableRows(tableRowsAsString);
  document.querySelector('#table-rows').addEventListener('click', setUpDeleteModal)
  document.querySelector("#btn-submit-movie").addEventListener("click", addMovie);

}


export async function addMovie(){
    const imdbId = document.querySelector("#movie-imdb-id").value;

    const addURL = url + "/" + imdbId;

    const options = makeOptions("POST",null, true);

    const movie = await fetch(addURL, options).then(handleHttpErrors)
}
// export async function initDeleteMovie() {
//     document.querySelector(".delete-button").addEventListener("click", deleteMovie);
//     }
// export async function initDeleteMovie() {
//     const deleteButtons = document.querySelectorAll(".delete-button");
//     deleteButtons.forEach((button) => {
//         button.addEventListener("click", () => {
//             const movieId = button.closest("tr").querySelector("#movie-ID").textContent;
//             deleteMovie(movieId);
//         });
//     });
// }
export async function setUpDeleteModal(e) {
    const btn = e.target;

    if(!btn.id.includes("_movie-id")){
        return;
    }
    const movieId = btn.id.split("_")[0];
    const header = `Delete movie with id ${movieId}?`

    document.querySelector("#delete-modal-label").textContent = header;

    document.querySelector("#delete-modal").addEventListener("click", async () => { await deleteMovie(movieId) });
    }

export async function deleteMovie(id){
    const DELETE_URL = `${url}/${id}`
    const delete_res = await fetch(DELETE_URL, makeOptions("DELETE"))
}
export async function closeModal(){
    document.querySelector("#delete-button").removeEventListener("click", closeModal);
}







