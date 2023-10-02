//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink, loadHtml, renderHtml} from "./utility.js"

  //import { initHome } from "./pages/home/home.js"

    window.addEventListener("load", async () => {

  const templateHome = await loadHtml("./pages/home/home.html")
  const templateMembers = await loadHtml("./pages/members/members.html")
  const templateMovie = await loadHtml("./pages/movie/movie.html")
  const templateProfile = await loadHtml("./pages/profile/profile.html")
  const templateReservations = await loadHtml("./pages/reservations/reservations.html")
  const templateSchedule = await loadHtml("./pages/schedule/schedule.html")
  const templateSignup = await loadHtml("./pages/signup/signup.html")
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")

  //If token existed, for example after a refresh, set UI accordingly
  //const token = localStorage.getItem("token")
  //toggleLoginStatus(token) <--- ADD THIS WHEN SECURITY GETS ADDED

 const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => {
        renderHtml(templateHome, "content")
      },
      "/members": (match) => {
        renderHtml(templateMembers, "content")
        //initMembers(match)
      },
      "/movie": (match) => {
        renderHtml(templateMovie, "content")
        //initMovie()
      },
      "/profile": () => {
        renderHtml(templateProfile, "content")
        //initProfile()
      },
      "/reservations": () => {
        renderHtml(templateReservations, "content")
        //initListReservationsAll()
      },
      "/schedule": () => {
        renderHtml(templateSchedule, "content")
      },
      "/signup": () => {
        renderHtml(templateSignup, "content")
        //initSignup()
      },
      "/login": (match) => {
        renderHtml(templateLogin, "content")
        //initLogin()
      }, 
      "/logout": () => {
        renderHtml(templateLogin, "content")
        //logout()
      }
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}