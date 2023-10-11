import { sanitizeStringWithTableRows, makeOptions, handleHttpErrors} from "../../../utility.js";
import { API_URL } from "../../../settings.js";
const url = API_URL + "/shows";


export async function initSchedule() {
    console.log("initSchedule()")
    document.querySelector("#btn-submit-movieshow").addEventListener("click",addMovieShow);
}

async function addMovieShow(event){
    event.preventDefault()
    console.log("addMovieShow()")

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

    const options = makeOptions("POST", movieShowRequestBody);
    const movie = await fetch(url, options).then(r => handleHttpErrors(r));
    location.reload();
}




// async function setUpDeleteModal(e) {
//     const btn = e.target;

//     if(!btn.id.includes("_movie-id")){
//         return;
//     }
//     const movieId = btn.id.split("_")[0];
//     const header = `Delete movie with id ${movieId}?`

//     document.querySelector("#delete-modal-label").textContent = header;

//     document.querySelector("#delete-modal").addEventListener("click", async () => { await deleteMovie(movieId) });
//     }

// async function deleteMovie(id){
//     try{
//     const DELETE_URL = `${url}/${id}`
//     const delete_res = await fetch(DELETE_URL, makeOptions("DELETE")).then(r => handleHttpErrors(r))
//     }catch(error){
//         console.log(error)
//     }
//     location.reload()
// }