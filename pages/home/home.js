import { handleHttpErrors} from "../../utility.js";
import { API_URL } from "../../settings.js";
const url = API_URL + "/shows";

export async function initHome() {
  const shows = await fetch(url).then(r => handleHttpErrors(r));
  const filteredMovies = filterUniqueMovies(shows);
  const moviePosters = filteredMovies
    .map(
      (show) => `
        <div id="${show.movieId}_movie" class="square"  style="width: 240px;height: 400px;;text-align: center;padding: 10px;margin: 30px;">
            <div class="movie-title">${show.title}</div>
                <img  src="data:image/png;base64,${show.posterImg}" alt="Movie Poster" class="movie-poster" 
                style="max-height:100%; max-width:100%">
            <div class="first-date">${show.firstShowingDate}</div>
            <div class="last-date">${show.lastShowingDate}</div>
        </div>    
    `
    )
    .join("");
  document.querySelector("#square-container").innerHTML = moviePosters;
  
  document.querySelector("#square-container").addEventListener("click",function (event) {
    let target = event.target;
  
    // Find the closest ancestor with an ID by traversing up the DOM tree
    while (target && !target.id) {
      target = target.parentElement;
    }
  
    if (target) {
      const id = target.id.split("_")[0];
        if(localStorage.getItem("roles") == "USER"){
          router.navigate(`/movieshow/?id=${id}`);
        } else {
          router.navigate(`/login`);
        }      
      }
  });
  
  

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
          firstShowingDate: item.showingDate,
          lastShowingDate: item.showingDate,
        };
      } else {
        if (item.showingDate > uniqueMovies[movieId].lastShowingDate) {
          uniqueMovies[movieId].lastShowingDate = item.showingDate;
        }
      }
    });
    return Object.values(uniqueMovies).filter(
      (movie) => movie.lastShowingDate >= today
    );
  }
  
