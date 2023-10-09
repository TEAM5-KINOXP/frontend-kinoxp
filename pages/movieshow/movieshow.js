import { handleHttpErrors} from "../../utility.js";
import { API_URL } from "../../settings.js";
const url = API_URL + "/shows/movie/";

 let selectedDate="";
 let selectedTimeslot="";
// let selectedMovieShow="";

let showDate=[];
let timeslot=[];



// export async function initMovieShow(match){
//     const movieId=match.params.id
//     const shows = await fetch(url+movieId).then(r=>handleHttpErrors(r));
//    // console.log(JSON.stringify(shows))
//    showDate=shows.map(show=>show.showingDate)
//    timeslot=shows.map(show=>show.timeslot)
//    //populate movie info fields
//    const poster=`<img  src="data:image/png;base64,${shows[0].movie.posterImg}" alt="Movie Poster" class="movie-poster" 
//    style="max-height:100%; max-width:100%">`
//    document.getElementById("movie-poster").innerHTML=poster
//    document.getElementById("movie-title").innerText=shows[0].movie.title
//    document.getElementById("description").innerText=shows[0].movie.description

//    // populate input selector fields with all possible values
//    const dateOptions= `<option selected></option>`+ showDate.map(date=>`<option selected></option><option>${date}</option>`).join("");
//    const dateselection=document.getElementById("date-selector")
//    dateselection.innerHTML=dateOptions;
//    const timeslotOptions=`<option selected></option>`+ timeslot.map(timeslot=>`<option>${timeslot}</option>`).join("");
//    const timeslotselection=document.getElementById("timeslot-selector")
//    timeslotselection.innerHTML=timeslotOptions;
// //using the eventlistener to populate the "other" selector conditioned on this selection ? should i add an if statement
//    dateselection.addEventListener("change",function(){
//      const selectedDate=dateselection.value
//        const filteredShows=shows.filter(show=>show.showDateSelected==selectedDate)
//        const timeslotOptions= filteredShows.map(timeslot=>`<option>${timeslot.timeslot}</option>`).join("");
//        timeslotselection.innerHTML=timeslotOptions
//    })
//    timeslotselection.addEventListener("change",function(){
//      const selectedTimeslot=timeslotselection.value
//        const filteredShows=shows.filter(show=>show.timeslot==selectedTimeslot)
//        const dateOptions= filteredShows.map(date=>`<option>${date.showDate}</option>`).join("");
//        dateselection.innerHTML=dateOptions
//    })
//   const selectedDate=dateselection.value;
//   const selectedTimeslot=timeslotselection.value;
//  const  selectedMovieShow=shows.filter(show=>show.showingDate===selectedDate&&show.timeslot===selectedTimeslot);
//    console.log(selectedMovieShow)
    
   
// }
let shows=[]
export async function initMovieShow(match) {
    const movieId = match.params.id;
     shows = await fetch(url + movieId).then(r => handleHttpErrors(r));
  
    // Populate movie info fields
    const poster = `<img  src="data:image/png;base64,${shows[0].movie.posterImg}" alt="Movie Poster" class="movie-poster" style="max-height:100%; max-width:100%">`;
    document.getElementById("movie-poster").innerHTML = poster;
    document.getElementById("movie-title").innerText = shows[0].movie.title;
    document.getElementById("description").innerText = shows[0].movie.description;
  
    const dateselection = document.getElementById("date-selector");
    const timeslotselection = document.getElementById("timeslot-selector");
  
    // Populate date selector with unique dates from shows
    const uniqueDates = [...new Set(shows.map(show => show.showingDate))];
    dateselection.innerHTML = '<option selected></option>' + uniqueDates.map(date => `<option>${date}</option>`).join("");
  
    // Function to update timeslot selector based on selected date
    function updateTimeslotSelector(selectedDate) {
      const filteredShows = shows.filter(show => show.showingDate === selectedDate);
      const uniqueTimeslots = [...new Set(filteredShows.map(show => show.timeslot))];
      timeslotselection.innerHTML = '<option selected></option>' + uniqueTimeslots.map(timeslot => `<option>${timeslot}</option>`).join("");
    }
  
    // Initial call to update timeslot selector based on the default selected date
    updateTimeslotSelector(dateselection.value);
  
    // Event listener for date selector
    dateselection.addEventListener("change", function () {
       selectedDate = dateselection.value;
      console.log(dateselection.value)
      updateTimeslotSelector(selectedDate);
    });
  
    // Event listener for timeslot selector
  timeslotselection.addEventListener("change", function () {
    const selectedTimeslot = timeslotselection.value;
    const selectedDate = dateselection.value;

    // Find the show that matches both selected date and timeslot
    const selectedShow = shows.find(show => show.showingDate === selectedDate && show.timeslot === selectedTimeslot);

    if (selectedShow) {
      const movieShowId = selectedShow.id;
      console.log("Selected Movie Show ID:", movieShowId);
      // Here I want to use movieShow.id to get the Theater
      // when I have the Theater I know which modal to load
      //when I have the modal I can get the seat...
      //then I need to pass all the values back from the modal as a reservationrequest....
    } else {
      console.log("No matching show found for the selected date and timeslot.");
    }
  });
  }