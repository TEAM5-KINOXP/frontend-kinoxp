import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "../../utility.js";
import { API_URL } from "../../settings.js";
const HARDCODEDUSER = API_URL + "/users/username1"

export async function initProfile(){
    document.querySelector('#email').value = ""
    document.querySelector('#first-name').value = ""
    document.querySelector('#last-name').value = ""

    
    
    const profileInfo = await fetch(HARDCODEDUSER).then(handleHttpErrors)
    if(profileInfo){
        document.querySelector('#title').innerHTML = "Type new information for profile user: "+profileInfo.username
        document.querySelector('#email').value = profileInfo.email
        document.querySelector('#first-name').value = profileInfo.firstName
        document.querySelector('#last-name').value = profileInfo.lastName
    }
    const reservations = await fetch(API_URL+"/reservations/username1").then(handleHttpErrors)
    const reservationRows = reservations.map(res =>`
        <tr>
            <td>${res.movieTitle}</td>
            <td>${res.reservationDate}</td>
            <td>${res.seatId}</td>
            <td>${res.timeslot}</td>
        </tr>
    `).join("")
    document.querySelector('#reservation-rows').innerHTML = sanitizeStringWithTableRows(reservationRows)
    document.querySelector('#modal-start').addEventListener('click', setUpEditModal(profileInfo.email, profileInfo.firstName, profileInfo.lastName)) 
    document.querySelector('#edit-button').addEventListener('click', editUser)
}

async function setUpEditModal(email, firstName, lastName){
    document.querySelector('#email-input').value = email
    document.querySelector('#first-name-input').value = firstName
    document.querySelector('#last-name-input').value = lastName
}
async function editUser(){
    const savedUsername = "username1"
    const newPassword = document.querySelector('#password-input').value
    const newEmail = document.querySelector('#email-input').value
    const newFirstName = document.querySelector('#first-name-input').value
    const newLastName =document.querySelector('#last-name-input').value
    const updatedUser = {
        username : savedUsername,
        password : newPassword,
        email : newEmail,
        firstName : newFirstName,
        lastName : newLastName
    }
    await fetch(HARDCODEDUSER, makeOptions("PUT", updatedUser)).then(handleHttpErrors)
    location.reload()
}