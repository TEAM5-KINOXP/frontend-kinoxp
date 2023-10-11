import { API_URL } from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows} from "../../utility.js";
const URL = API_URL + "/users"

export async function initMembers(){

    const members = await fetch(URL).then(handleHttpErrors)
    const memberRows = members.map(member => `
        <tr>
            <td>${member.username}</td>
            <td>${member.email}</td>
            <td>${member.firstName}</td>
            <td>${member.lastName}</td>
            <td><button id="${member.username}_member-id" class="btn btn-sm btn-danger delete-button" data-bs-toggle="modal" 
            data-bs-target="#delete-modal">Delete Member</button></td>
        </tr>
    `).join("")
    document.querySelector('#member-rows').innerHTML = sanitizeStringWithTableRows(memberRows)
    document.querySelector('#member-rows').addEventListener('click', setUpDeleteModel)
}

async function setUpDeleteModel(evt){
    const btn = evt.target
    
    if(!btn.id.includes("_member-id")){
        return
    }
    const username = btn.id.split("_")[0]
    const headerText = `Delete user: ${username}`
    document.querySelector('#delete-modal-label').innerHTML = headerText

    document.querySelector('#delete-button').addEventListener('click', async () => {await deleteUser(username)})
}
async function deleteUser(username){
    try{
    const DELETE_URL = API_URL + `/users/${username}`
    await fetch(DELETE_URL, makeOptions("DELETE")).then(handleHttpErrors)
    }catch(error){
        console.log(error)
    }
    location.reload()

}