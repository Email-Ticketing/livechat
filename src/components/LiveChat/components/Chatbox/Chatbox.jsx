import React, { useState } from "react"
import styles from "./Chatbox.module.scss"
import { RiSendPlane2Fill } from "react-icons/ri"
import VideoPlayer from "./VideoPlayer/VideoPlayer"
import { useEffect } from "react"
import useSocketForStream from "../../../../data-access/useSocketForStream"
import { v4 as uuid } from "uuid"
import { usePeer } from "../../../../context/PeerContext"
import { BsFillCameraVideoFill } from "react-icons/bs"
import { Attachment, ChatSupport, Send } from "../../../../libs/icons/icon"
import useChat from "../../../../data-access/useChat"
import { useCookies } from "react-cookie"

import moment from "moment/moment"
const addToCall = (user, myPeer, myStream) => {
  const call = myPeer.call(user.user_id, myStream)
}

const Chatbox = ({ socket, allMessages, username, teamCdn }) => {
  const [cookies, setCookies] = useCookies(["chat_room_id", "support_chat_id", "chat_user_id"])

  const { uploadMultimediaApi } = useChat()

  const [inputMsg, setInputMsg] = useState("")
  const [myStream, setMyStream] = useState()
  const [files, setFiles] = useState([])
  const [supportMsgId, setSupportMsgId] = useState()

  const [latestActivityFromStreamSocket, setLatestActivityFromStreamSocket] = useState()
  const [peerSocket] = useSocketForStream(setLatestActivityFromStreamSocket, myStream)
  const { peerState } = usePeer()
  console.log(allMessages)
  useEffect(() => {
    if (peerState?.myPeer?._id) {
      peerSocket.current.emit("join-room", username, peerState.myPeer._id, null, "tech1")
    }
  }, [])
  useEffect(() => {
    peerState?.myPeer.on("open", (id) => {
      console.log("My id:", id)
    })
  })
  const clickHandler = async () => {
    await socket.current.emit("chat-message", inputMsg, "customer", cookies?.chat_room_id, "jX3O79zUfqbwVVwisWHrN", supportMsgId)
    setInputMsg("")
    setSupportMsgId()
    setFiles([])
  }
  const vidClickHandler = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia()
    setMyStream(stream)
    peerState?.users?.map((user) => {
      if (user.username !== username) {
        const call = peerState.myPeer.call(user.user_id, stream)
      }
    })
  }

  useEffect(() => {
    if (files?.length > 0) {
      const formData = new FormData()
      formData.append("support_chat_id", "c82ebee2-4a85-48bd-b85d-6086aef1c6b8")
      formData.append("msg_type", "customer")
      formData.append("chat_user_id", "e81d8750-9217-4c37-a6a9-c36c718b0701")
      console.log(files[0])
      formData.append("Image", files[0])

      uploadMultimediaApi(formData)
    }
  }, [files])

  return (
    <div className={styles.chatBox}>
      <header>
        <div className={styles.chatHeader}>
          {" "}
          <ChatSupport /> Live chat
        </div>
      </header>
      <main>
        {allMessages.map((msg) => {
          return (
            <div className={styles.msgContainerLeft + " " + (username === msg?.user?.username && styles.msgContainerRight)}>
              <div className={styles.msg + " " + ("customer" === msg?.user_type && styles.userMsg)}>{msg.content}</div>
              <p className={styles.msgInfo}>{moment(msg?.created_at).format("Do MMMM YYYY, h:mm a")}</p>
            </div>
          )
        })}
        <div className={styles.videoPlayer}>{peerState?.remoteMediaStream && <VideoPlayer stream={peerState.remoteMediaStream} />}</div>
      </main>
      <footer>
        <div className={styles.sendMessage}>
          <input type="text" placeholder="Write here ..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} />
          <div className={styles.sendOptions}>
            <div className={styles.attachments}>
              <label htmlFor="attachment">
                <Attachment className={styles.icon} />
              </label>
              <input type="file" name="attachment" id="attachment" onChange={(event) => setFiles(event.target.files)} />
            </div>
            <Send className={styles.icon} onClick={clickHandler} />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Chatbox
