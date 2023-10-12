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
let selectedShow;
let reciept;



let shows=[]

export async function initMovieShow(match) {
  console.log("initMovieShow")
    const movieId = match.params.id;
     shows = await fetch(url + movieId, makeOptions("GET",null, true)).then(r => handleHttpErrors(r));
  
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
      console.log("updateTimeslotSelector")
        const filteredShows = shows.filter(show => show.showingDate === selectedDate);
        const uniqueTimeslots = [...new Set(filteredShows.map(show => show.timeslot))];
        timeslotselection.innerHTML = '<option selected></option>' + uniqueTimeslots.map(timeslot => `<option>${timeslot}</option>`).join("");
      }
  
    // Initial call to update timeslot selector based on the default selected date
    updateTimeslotSelector(dateselection.value);
  
    // Event listener for date selector
    dateselection.addEventListener("change", function () {
      console.log("dateselection")
       selectedDate = dateselection.value;
      console.log(dateselection.value)
      updateTimeslotSelector(selectedDate);
    });
  
    // Event listener for timeslot selector
  timeslotselection.addEventListener("change", function () {
    console.log("timeslotselection")
     selectedTimeslot = parseInt(timeslotselection.value);
    //console.log(typeof selectedTimeslot)
    const selectedDate = dateselection.value;
        console.log(shows)
    // Find the show that matches both selected date and timeslot
     selectedShow = shows.find(show => show.showingDate === selectedDate && show.timeslot === selectedTimeslot);

    if (selectedShow) {
       movieShowId = parseInt(selectedShow.id);
      console.log("Selected Movie Show ID:", movieShowId);
      // Here I want to use movieShow.id to get the Theater - call function
        const theater=parseInt(selectedShow.theater.id);
        const btnString=`<button id="book-seat" type="button" class="btn btn-primary" style="margin:4">Show Booking
        </button>`;
      
        
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
        document.getElementById("seat-listener").addEventListener("mouseover",colorReservedSeats); 
        document.querySelector("#book-seat").addEventListener("click",setupModal);
       // document.querySelector("#book-seat").
      
    } 
  });
  }
  //functions 
  async function setupModal(){
    console.log("setupModal")
    document.querySelector("#booking-reciept").style.display="block";
    document.querySelector("#timeslot").value=`${selectedShow.timeslot}`;
    document.querySelector("#movie-title").value=`${selectedShow.movie.title}`;
    document.querySelector("#showing-date").value=`${selectedDate}`
    document.querySelector("#seat-number").value=`${seatnumber}`;  
   

    document.querySelector("#complete-booking").addEventListener("click",makeReservation)
    document.querySelector("#cancel-booking").addEventListener("click",clearbooking)
  
function clearbooking(){
    document.querySelector("#booking-reciept").style.display="none";
    document.querySelector("#timeslot").value="";
    document.querySelector("#movie-title").value="";
    document.querySelector("#showing-date").value=""
    document.querySelector("#seat-number").value="";
}

  }

    async function getReservedSeats(){
      console.log("getReservedSeats")
      try{
      const res=  await fetch(url_reservation).then(r=>handleHttpErrors(r))
      return reservedSeats=res.filter(r=>r.movieShowId==movieShowId)
      }catch(err){
          console.log(err)
        }
        
}
async function colorReservedSeats(){
  console.log("colorReservedSeats")
    //color all reserved seat:
    const seats= document.querySelectorAll("rect")
    console.log(seats.length)
    const reservedSeats= await getReservedSeats();
    for (let i=0;i<reservedSeats.length;i++){
     let index=parseInt(reservedSeats[i].seatId)-1;
       document.getElementById(seats[index].id).style.fill="red"
       
      }

}
 async  function seathandler(evt){
    console.log("seathandler") 
   
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
      clearbooking;
        reservationRequest={
            seatNumber:seatnumber,
            movieShowId:movieShowId,          
            userName:localStorage.getItem("user")
        }
        console.log(reservationRequest)
        try{
          const res=  await fetch(url_reservation,makeOptions("POST",reservationRequest)).then(r=>handleHttpErrors(r))
          //alert("you have booked seat: "+res.seatId+" on the "+ res.reservationDate+ " to the movie: "+res.movieTitle)
         
      }catch(err){
        console.log(err)

      }    
    

    }
  
