import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { v4 as uuid } from "uuid"

const useSocketForLiveChat = (setMsgList) => {
  const baseUrl = "wss://omnichannel.chatbot.dev137.scw.ringover.net/webchat/websockets/new?app_uuid=e72e2e25-d157-4bb7-951b-db7035356ba6&app_secret=thecakeisalie&user_agent=nicoxflo"
  const [socket, setSocket] = useState(null)
  const [cookies, setCookies] = useCookies(["browser_uuid"])

  useEffect(() => {
    let browser_uuid
    if (!cookies?.browser_uuid) {
      browser_uuid = uuid()
      setCookies("browser_uuid", browser_uuid, {
        path: "/",
      })
    } else browser_uuid = cookies?.browser_uuid

    const api = baseUrl + `&browser_uuid=${browser_uuid}`

    setSocket(new WebSocket(api))
  }, [])

  useEffect(() => {
    if (!socket) return

    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event)
    })

    // Message received
    socket.addEventListener("message", (event) => {
      console.log("Received message:", event.data)
      const message = JSON.parse(event.data)
      if (message?.data) setMsgList((prev) => [...prev, message])
    })

    // Connection closed
    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event)
      if (!event.wasClean) {
        console.error(`Connection closed abruptly. Code: ${event.code}, Reason: ${event.reason || "No specific reason provided"}`)
      }

      // Implement a retry mechanism here if needed
    })

    // Error handling
    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event)
    })
  }, [socket])

  return [socket]
}

export default useSocketForLiveChat
