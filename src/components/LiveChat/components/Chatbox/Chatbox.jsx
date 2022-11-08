import React, { useState } from "react"
import styles from "./Chatbox.module.scss"
// import { RiSendPlane2Fill } from "react-icons/ri"
import VideoPlayer from "./VideoPlayer/VideoPlayer"
import { useEffect } from "react"
import useSocketForStream from "../../../../data-access/useSocketForStream"
import { v4 as uuid } from "uuid"
import { usePeer } from "../../../../context/PeerContext"
// import { BsFillCameraVideoFill } from "react-icons/bs"
import { Attachment, ChatSupport, Download, ImageFile, Send } from "../../../../libs/icons/icon"
import moment from "moment/moment"
import { useCookies } from "react-cookie"
import stripHTML from "../../../../libs/utils/stripHtml"
import useChat from "../../../../data-access/useChat"
import Spinner from "../../../../libs/utils/Spinner/Spinner"
import VoiceMemos from "./components/VoiceMemos/VoiceMemos"
import { MdScreenShare } from "react-icons/md"

const addToCall = (user, myPeer, myStream) => {
  const call = myPeer.call(user.user_id, myStream)
}
const Chatbox = ({ socket, allMessages, teamCdn }) => {
  const [cookies, setCookies] = useCookies(["chat_room_id", "chat_session_id", "chat_user_id", "support_chat_id"])

  const { uploadMultimediaApi } = useChat()

  const [inputMsg, setInputMsg] = useState("")
  const [myStream, setMyStream] = useState()
  const [files, setFiles] = useState([])
  const [uploadingMultimedia, setUploadingMultimedia] = useState(false)
  // const [file, setFile] = useState()
  const [supportMsgId, setSupportMsgId] = useState()
  const [latestActivityFromStreamSocket, setLatestActivityFromStreamSocket] = useState()
  const { peerState } = usePeer()
  useEffect(() => {
    peerState?.myPeer.on("open", (id) => {
      console.log("My id:", id)
    })
  })
  const clickHandler = async () => {
    console.log("teamChatCdn", teamCdn)
    if (inputMsg || files?.length > 0) {
      await socket.current.emit("chat-message", inputMsg, "customer", cookies.chat_room_id, cookies.chat_session_id, "E6p2MJWUVSbKiPtQ7tgyj", supportMsgId)
    }
    setInputMsg("")
    setFiles([])
    setSupportMsgId()
  }
  const vidClickHandler = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia()
    setMyStream(stream)
    if (peerState?.user) {
      console.log(stream)
      const call = peerState.myPeer.call(peerState.user.user_id, stream)
    }
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

  function formatBytes(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes == 0) return "0 Byte"
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i]
  }

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
              <div className={styles.msgContainerLeft + " " + (cookies.chat_user_id === msg.user?.chat_user_id && styles.msgContainerRight)}>
                <div className={styles.msg + " " + ("customer" === msg?.user_type && styles.userMsg)}>
                  {" "}
                  <div className={styles.text}>{stripHTML(msg?.content)}</div>
                  {msg?.Support_Chat_Attachments?.length > 0 && (
                    <div className={styles.images}>
                      {msg?.Support_Chat_Attachments?.map((attachment) => {
                        return (
                          <div className={styles.image}>
                            {attachment?.attachment_type === "audio/wav" ? (
                              <audio controls id="audio" src={attachment?.attachment_url} type={attachment?.attachment_type}></audio>
                            ) : attachment.attachment_type.includes("image") ? (
                              <img src={attachment?.attachment_url} alt="#" />
                            ) : (
                              <div
                                // key={`attachementkey-${index}`}
                                className={styles.attachemnt}
                              >
                                <div className={styles.attachemntImage}>
                                  <ImageFile className={styles.image} />
                                </div>
                                <div className={styles.attachemntText}>
                                  <h5>{attachment.attachment_title}</h5>
                                  <p>{formatBytes(attachment.attachment_size)}</p>
                                </div>
                                {/* {fetchingFile ===
                    attachment.parsed_attachment_id ? (
                      <Spinner className={styles.spinner} />
                    ) : ( */}

                                <a href={attachment?.attachment_url} className={styles.download_link}>
                                  <Download className={styles.download_icon} />
                                </a>
                              </div>
                            )}
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
            <VoiceMemos setFiles={setFiles} />
            <div className={styles.attachments}>
              <label htmlFor="attachment">
                <Attachment className={styles.icon} />
              </label>
              <input type="file" name="attachment" id="attachment" onChange={(event) => setFiles(event.target.files)} />
            </div>
            <div onClick={vidClickHandler}>
              <MdScreenShare size={25} className={styles.icon} />
            </div>
            <Send className={styles.icon} onClick={clickHandler} />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Chatbox
