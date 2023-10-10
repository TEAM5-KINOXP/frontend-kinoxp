import { handleHttpErrors, makeOptions} from "../../utility.js";
import { API_URL } from "../../settings.js";
const url = API_URL + "/shows/movie/";
const url_reservation=API_URL+"/reservations"

 let selectedDate="";
 let selectedTimeslot="";
 
let movieShowId;
let seatnumber;
let reservationRequest={};
let showDate=[];
let timeslot=[];
let reservedSeats=[];

const HARDCODEDUSER="username1"

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
     selectedTimeslot = parseInt(timeslotselection.value);
    //console.log(typeof selectedTimeslot)
    const selectedDate = dateselection.value;
        console.log(shows)
    // Find the show that matches both selected date and timeslot
    const selectedShow = shows.find(show => show.showingDate === selectedDate && show.timeslot === selectedTimeslot);

    if (selectedShow) {
       movieShowId = parseInt(selectedShow.id);
      console.log("Selected Movie Show ID:", movieShowId);
      // Here I want to use movieShow.id to get the Theater - call function
        const theater=parseInt(selectedShow.theater.id);
        const btnString=`<button id="bookseat" class="btn btn-sm btn-primary" >Book Seat
        </button>`;
      
        //document.querySelector("btn-mod").innerHTML= btnString;
        if(theater===1){
            document.querySelector("#theater-2").style.display="none"
           document.querySelector("#theater-1").style.display="block"
           
        }
        if(theater===2){
            document.querySelector("#theater-1").style.display="none"
            document.querySelector("#theater-2").style.display="block"
            
         }
       // reset color of seats
          const seats= document.querySelectorAll("rect")
          
          for (let i=0;i<seats.length;i++){
            document.getElementById(seats[i].id).style.fill="gray"
          }
        document.querySelector("#btn-mod").innerHTML= btnString;
        document.getElementById("seat-listener").addEventListener("click",seathandler); 
        document.querySelector("#btn-mod").addEventListener("click",makeReservation);
      
    } 
  });
  }
  //functions 
    async function getReservedSeats(){
      try{
      const res=  await fetch(url_reservation).then(r=>handleHttpErrors(r))
      return reservedSeats=res.filter(r=>r.movieShowId==movieShowId)
      }catch(err){
          console.log(err)
        }
}
 async  function seathandler(evt){
    //color all reserved seat:
  const seats= document.querySelectorAll("rect")
   const reservedSeats= await getReservedSeats();
   for (let i=0;i<reservedSeats.length;i++){
    let index=parseInt(reservedSeats[i].seatId)
      document.getElementById(seats[index].id).style.fill="red"
   }
   const seatId=reservedSeats.seatId
    const pressed=evt.target;
    const id=pressed.id;
    if(!id.includes("t1-")&&!id.includes("t2-")){
        return
    }
    seatnumber=parseInt(id.split("-")[1]); //seatnumber
   document.getElementById(id).style.fill="green"
   console.log("seatnumber: "+seatnumber+", movieShowId: "+movieShowId+", username: "+HARDCODEDUSER)

    
    }
    async function makeReservation(){
        reservationRequest={
            seatNumber:seatnumber,
            movieShowId:movieShowId,          
            userName:HARDCODEDUSER
        }
        console.log(reservationRequest)
        try{
          const res=  await fetch(url_reservation,makeOptions("POST",reservationRequest)).then(r=>handleHttpErrors(r))
          alert("you have booked seat: "+res.seatId+" on the "+ res.reservationDate+ " to the movie: "+res.movieTitle)
      }catch(err){
        console.log(err)

      }
        

    

    }
  
