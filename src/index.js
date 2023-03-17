import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { IFrame } from "./libs/IFrame/IFrame"
import Frame, { FrameContext } from "react-frame-component"

let div = document.createElement("div")
div.id = "live-chat"
document.body.appendChild(div)
const root = ReactDOM.createRoot(document.getElementById("live-chat"))
// const teamCdn = "TX3O79zUfqbwVVwisWHrN"
// const teamCdn = document.currentScript.getAttribute("cdnId")
//staging
const teamCdn = "S4DZso2j_YkuhCjMu_Fde"
//dev
// const teamCdn = "K2rAb9PRdSU8ZR-cUlfqC"

root
  .render
  // <React.StrictMode>
  // <IFrame>
  // <iframe height={500} width={500} src="./App.html" title="abc" />
  // <App teamCdn={teamCdn} />
  // {/* </IFrame> */}
  // </React.StrictMode>
  ()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
