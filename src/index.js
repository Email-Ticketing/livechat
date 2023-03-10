import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

let div = document.createElement("div")
div.id = "live-chat"
document.body.appendChild(div)
const root = ReactDOM.createRoot(document.getElementById("live-chat"))
// const teamCdn = "TX3O79zUfqbwVVwisWHrN"
const teamCdn = document.currentScript.getAttribute("cdnId")
//staging
// const teamCdn = "b-j0dIGFE-WjbCM7aWyTw"
//dev
// const teamCdn = "K2rAb9PRdSU8ZR-cUlfqC"

root.render(
  // <React.StrictMode>
  <App teamCdn={teamCdn} />
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
