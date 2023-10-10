import { API_URL } from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows} from "../../utility.js";
const URL = API_URL + "/reservations/username1" //Hardcore user untill security is added

export async function initReservations(){

    const reservations = await fetch(URL).then(handleHttpErrors)
    const reservationRows = reservations.map(res => `
        <tr>
            <td>${res.movieTitle}</td>
            <td>${res.reservationDate}</td>
            <td>${res.seatId}</td>
            <td>${res.timeslot}</td>
            <td><button id="${res.movieTitle}_${res.reservationDate}_${res.seatId}_${res.timeslot}_${res.id}_res-info" class="btn btn-sm btn-danger cancel-button" data-bs-toggle="modal" 
            data-bs-target="#cancel-modal">Cancel reservation</button></td>
        </tr>
    `).join("")
    document.querySelector('#reservation-rows').innerHTML = sanitizeStringWithTableRows(reservationRows)
    document.querySelector('#reservation-rows').addEventListener('click', setUpCancelModal)
}

async function setUpCancelModal(evt){
    const btn = evt.target
    
    if(!btn.id.includes("_res-info")){
        return
    }
    const movieTitle = btn.id.split("_")[0]
    const reservationDate = btn.id.split("_")[1]
    const seatId = btn.id.split("_")[2]
    const timeslot = btn.id.split("_")[3]
    const id = btn.id.split("_")[4]
    const headerText = `Cancel reservation: <br> Movie - ${movieTitle} <br> ${reservationDate} <br> Seat - ${seatId} <br> Timeslot - ${timeslot}`
    document.querySelector('#cancel-modal-label').innerHTML = headerText

    document.querySelector('#cancel-button').addEventListener('click', async () => {await cancelReservation(id)})
}
async function cancelReservation(id){
    try{
    const DELETE_URL = API_URL + `/reservations/${id}`
    await fetch(DELETE_URL, makeOptions("DELETE")).then(handleHttpErrors)
    }catch(error){
        console.log(error)
    }
    location.reload()
}