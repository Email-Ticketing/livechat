import { useEffect, useState } from "react"
import { usePeer } from "../context/PeerContext"
import useSocket from "./useSocket"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const useSocketForLiveChat = (setLatestActivityFromSocket) => {
  const [socket] = useSocket(BACKEND_URL)
  const { peerState, setPeerState } = usePeer()
  useEffect(() => {
    defineEvents()
  }, [])

  const defineEvents = () => {
    console.log("socket run")

    socket.current.on("connect", () => {
      console.log("%cJOINED SOCKET FOR Chat", "background: #00ddd0; color: #000; font-weight: 600;")
    })

    socket.current.on("connect_failed", () => {
      console.log("%cFAILED TO CONNECT SOCKET FOR ACTIVITY", "background: #ff8888; color: #000; font-weight: 600;")
    })

    socket.current.on("message", (message) => {
      setLatestActivityFromSocket(message)
      console.log("Received message:- ", message)
    })

    socket.current.on("disconnect", (disconect) => {
      console.log("socket for activity disconnected", disconect)
    })
    socket.current.on("user-connected", (user) => {
      console.log("new user", user)
      setPeerState((state) => ({
        ...state,
        user: { ...user },
      }))
    })
    socket.current.on("close-stream", () => {
      console.log("stream ending")
    })
  }

  return [socket]
}

export default useSocketForLiveChat
