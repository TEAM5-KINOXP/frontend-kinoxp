import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "../../utility.js";
import { API_URL } from "../../settings.js";
const URL = API_URL + "/users"

export async function initProfile(){
    document.querySelector('#email').value = ""
    document.querySelector('#first-name').value = ""
    document.querySelector('#last-name').value = ""

    const profileInfo = await fetch(URL + "/users-for-authenticated", makeOptions("GET", null, true)).then(handleHttpErrors)
    if(profileInfo){
        document.querySelector('#title').innerHTML = "Type new information for profile user: "+profileInfo.username
        document.querySelector('#email').value = profileInfo.email
        document.querySelector('#first-name').value = profileInfo.firstName
        document.querySelector('#last-name').value = profileInfo.lastName
    }
    const reservations = await fetch(API_URL+"/reservations/reservations-for-authenticated", makeOptions("GET", null, true)).then(handleHttpErrors)
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
    const newPassword = document.querySelector('#password-input').value
    const newEmail = document.querySelector('#email-input').value
    const newFirstName = document.querySelector('#first-name-input').value
    const newLastName =document.querySelector('#last-name-input').value
    const updatedUser = {
        username : localStorage.getItem("user"),
        password : newPassword,
        email : newEmail,
        firstName : newFirstName,
        lastName : newLastName
    }
    await fetch(URL + "/users-for-authenticated", makeOptions("PUT", updatedUser,true)).then(handleHttpErrors)
    location.reload()
}