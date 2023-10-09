import { handleHttpErrors, makeOptions } from "../../utility.js";
import { API_URL } from "../../settings.js";
const url = API_URL + "/shows";
let shows=[];

export async function initBooking() {
   shows = await fetch(url).then(handleHttpErrors);
  const filteredMovies = filterUniqueMovies(shows);
  const moviePosters = filteredMovies
    .map(
      (show) => `
        <div class="square" id="${show.movieId}_poster"style="width: 240px;height: 400px;;text-align: center;padding: 10px;margin: 30px;">
            <div class="movie-title">${show.title}</div>
                <a href ="/movie/${show.movieId}"><img src="data:image/png;base64,${show.posterImg}" alt="Movie Poster" class="movie-poster" 
                style="max-height:100%; max-width:100%"></a>
            <div class="first-date">${show.firstShowingDate}</div>
            <div class="last-date">${show.lastShowingDate}</div>
        </div>    
    `
    )
    .join("");
  document.querySelector("#movie-container").innerHTML = moviePosters;
  document.querySelector("#movie-container").addEventListener("click",setupBookingModal)
}

function filterUniqueMovies(shows) {
    const uniqueMovies = {};
    const today = new Date().toISOString().split("T")[0];
  
    shows.forEach((item) => {
      const movieId = item.movie.id;
  
      if (!uniqueMovies[movieId]) {
        uniqueMovies[movieId] = {
          movieId: item.movie.id,  
          title: item.movie.title,
          posterImg: item.movie.posterImg,
          showingDates: {
            showingDate:item.showingDate
          }
         // firstShowingDate: item.showingDate,
         // lastShowingDate: item.showingDate,
        };
      }
      
    });
    return Object.values(uniqueMovies).filter(
      (movie) => movie.lastShowingDate >= today
    );
  }
  async function setupBookingModal(evt) {
    let showselection=[]
    const btn = evt.target
    if (!btn.id.includes("_poster")) { //if not a poster thats pressed
      return //return nothing
    }
  
    const id = btn.id.split("_")[0]
     showselection= shows.filter( show => show.movie.id == id)
     const theater=showselection[0].theater.id
    const headerText = `You have chosen the movie ${show.title} `
    document.getElementById("reservation-modal-label").innerText = headerText
   
    carIdInput.value = id
    carUsernameInput.value = ""
    carReservationDate.value = ""
    setStatusMsg("", false)
    document.getElementById("btn-reservation").onclick = reserveCar
  }


  /**
 * Set's the status message, either styled as an error, or as a normal message
 * @param {String} msg The status message to display
 * @param {boolean} [isError] true, to style in red
 * @param {String} [node] Use this to provide a node to set the error on. If left out, it will assume a node with the id 'status'
 */
function setStatusMsg(msg, isError, node) {
    const color = isError ? "red" : "darkgreen"
    const statusNode = node ? document.getElementById(node) : document.getElementById("status")
    statusNode.style.color = color
    statusNode.innerText = msg
  }
  
