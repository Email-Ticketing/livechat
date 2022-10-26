import React, { useState } from "react"
import styles from "./Chatbox.module.scss"
// import { RiSendPlane2Fill } from "react-icons/ri"
import VideoPlayer from "./VideoPlayer/VideoPlayer"
import { useEffect } from "react"
import useSocketForStream from "../../../../data-access/useSocketForStream"
import { v4 as uuid } from "uuid"
import { usePeer } from "../../../../context/PeerContext"
// import { BsFillCameraVideoFill } from "react-icons/bs"
import { Attachment, ChatSupport, Send } from "../../../../libs/icons/icon"
import moment from "moment/moment"
import { useCookies } from "react-cookie"
import stripHTML from "../../../../libs/utils/stripHtml"
import useChat from "../../../../data-access/useChat"
import Spinner from "../../../../libs/utils/Spinner/Spinner"

const addToCall = (user, myPeer, myStream) => {
  const call = myPeer.call(user.user_id, myStream)
}
const Chatbox = ({ socket, allMessages, username, teamCdn }) => {
  const [cookies, setCookies] = useCookies(["chat_room_id", "chat_session_id", "chat_user_id","support_chat_id"])

  const { uploadMultimediaApi } = useChat()

  const [inputMsg, setInputMsg] = useState("")
  const [myStream, setMyStream] = useState()
  const [files, setFiles] = useState([])
  const [uploadingMultimedia, setUploadingMultimedia] = useState(false)
  // const [file, setFile] = useState()
  console.log(files)
  const [supportMsgId, setSupportMsgId] = useState()
  console.log(files)
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
    console.log("teamChatCdn", teamCdn)
    if (inputMsg || files?.length > 0) {
      await socket.current.emit("chat-message", inputMsg, "customer", cookies.chat_room_id, cookies.chat_session_id,"zdEPvDcI_IgpO_8zit2RR", supportMsgId)
    }
    setInputMsg("")
    setFiles([])
    setSupportMsgId()
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
      setUploadingMultimedia(true)

      const formData = new FormData()

      for (let i = 0; i < files?.length; i++) {
        formData.append(`attachment`, files[i])
      }

      formData.append("support_chat_id", cookies?.support_chat_id)
      formData.append("msg_type", "customer")
      formData.append("chat_user_id", cookies?.chat_user_id)
      // readFileDataAsBase64(files)

      try {
        uploadMultimediaApi(formData).then((data) => {
          setSupportMsgId(data?.data?.support_message_id)
          setUploadingMultimedia(false)
        })
      } catch (err) {
        console.log(err)
        setUploadingMultimedia(false)
      }
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
            (msg?.content || msg?.Support_Chat_Attachments?.length > 0) && (
              <div className={styles.msgContainerLeft + " " + (username === msg?.user?.username && styles.msgContainerRight)}>
                <div className={styles.msg + " " + ("customer" === msg?.user_type && styles.userMsg)}>
                  {" "}
                  <div className={styles.text}>{stripHTML(msg?.content)}</div>
                  {msg?.Support_Chat_Attachments?.length > 0 && (
                    <div className={styles.images}>
                      {msg?.Support_Chat_Attachments?.map((attachment) => {
                        return (
                          <div className={styles.image}>
                            <img src={attachment?.attachment_url} alt="#" />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                <p className={styles.msgInfo}>{moment(msg?.created_at).format("Do MMMM YYYY, h:mm a")}</p>
              </div>
            )
          )
        })}
        <div className={styles.videoPlayer}>{peerState?.remoteMediaStream && <VideoPlayer stream={peerState.remoteMediaStream} />}</div>
      </main>
      <div className={styles.attachment_name}>
        {files?.length > 0 &&
          (uploadingMultimedia ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            supportMsgId && <div className={styles.images_name}>{files[0].name}</div>
          ))}
      </div>

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
