import { API_URL } from "../../settings.js"
import { handleHttpErrors, makeOptions } from "../../utility.js";

const URL = API_URL + "/auth/login"

export function initLogin(){
    document.querySelector("#btn-login").addEventListener("click", login);
}

async function login(){
    event.preventDefault();
    document.querySelector("#login-fail").innerHTML = "";

    const username = document.querySelector("#input-username").value;
    const password = document.querySelector("#input-password").value;

    const loginRequest = {
        username: username,
        password: password
    }

    try {
        const res = await fetch(URL, makeOptions("POST", loginRequest)).then(r => handleHttpErrors(r))
    } catch (err) {
        console.log(err.message)
        document.querySelector("#login-fail").innerHTML = err.message
    }
}