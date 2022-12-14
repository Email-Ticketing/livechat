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
// import VoiceMemos from "./components/VoiceMemos/VoiceMemos"
import { MdScreenShare } from "react-icons/md"
import html2canvas from "html2canvas"
import { useRef } from "react"
import useAutosizeTextArea from "./components/AutoSizeTextArea/AutoSizeTextArea"
import MessageContent from "./components/MessageContent/MessageContent"
import defaultIcons from "../../../../libs/icons/defaultIcons/defaultIcons"

const addToCall = (user, myPeer, myStream) => {
  const call = myPeer.call(user.user_id, myStream)
}
const Chatbox = ({ socket, allMessages, teamCdn, chatbotConfig, setIsBoxOpen }) => {

  const [chatbot,setChatbot] = useState(chatbotConfig);
  const [icon,setIcon] = useState(defaultIcons[chatbot?.default_chatbot_icon-1].IconName)

  const customChatStyles = {
    chatbot_header: {
      height: "54px",
      width: "100%",
      background: chatbot?.color,
      color: "white",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "19px",
      padding: "18px",
      borderTopLeftRadius: "15px",
      borderTopRightRadius: "15px"
    }
  }



  const endRef = useRef()
  const textAreaRef = useRef(null)

  const [cookies, setCookies] = useCookies(["chat_room_id", "chat_session_id", "chat_user_id", "support_chat_id"])

  const { uploadMultimediaApi } = useChat()

  const [inputMsg, setInputMsg] = useState("")
  const [myStream, setMyStream] = useState()
  const [files, setFiles] = useState([])
  const [uploadingMultimedia, setUploadingMultimedia] = useState(false)
  // const [file, setFile] = useState()

  const [supportMsgId, setSupportMsgId] = useState()
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false)
  const [latestActivityFromStreamSocket, setLatestActivityFromStreamSocket] = useState()
  const { peerState, setPeerState } = usePeer()

  useAutosizeTextArea(textAreaRef.current, inputMsg)

  useEffect(() => {
    peerState?.myPeer.on("open", (id) => {
      console.log("My id:", id)
    })
    console.log("MESSAGE LIST",allMessages)
  })
  const clickHandler = async () => {
    // console.log("teamChatCdn", teamCdn)

    const numberOfLineBreaks = (inputMsg.match(/\n/g) || []).length
    const inputMsgLength = inputMsg.length
    if ((inputMsg && inputMsgLength > numberOfLineBreaks) || files?.length > 0) {
      await socket.current.emit("chat-message", inputMsg, "customer", cookies.chat_room_id, cookies.chat_session_id, teamCdn, supportMsgId)
      setInputMsg("")
      setFiles([])
      setSupportMsgId()
    }
  }

  const vidClickHandler = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia()
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    const audioTrack = await audioStream.getAudioTracks()[0]
    await stream.addTrack(audioTrack)
    setMyStream(stream)
    if (peerState?.user) {
      const call = peerState.myPeer.call(peerState.user.user_id, stream)
      call.on("stream", (mediaStream) => {
        console.log("incomingStream")
        console.log(mediaStream)
        setPeerState((state) => ({
          ...state,
          remoteAudioStream: mediaStream,
        }))
      })
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

      try {
        uploadMultimediaApi(formData).then((data) => {
          setSupportMsgId(data?.data?.support_message_id)
          setUploadingMultimedia(false)
          setIsTakingSnapshot(false)
        })
      } catch (err) {
        console.log(err)
        setUploadingMultimedia(false)
        setIsTakingSnapshot(false)
      }
    }
  }, [files])

  function formatBytes(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes == 0) return "0 Byte"
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i]
  }

  const handleSnapshot = () => {
    if (isTakingSnapshot) return

    setIsTakingSnapshot(true)
    const root = document.body

    html2canvas(root, {
      cacheBust: true,
      useCORS: true,
      allowTaint: true,
      ignoreElements: function (element) {
        /* Remove element with id="live-chat" */
        if ("live-chat" === element.id) {
          return true
        }
      },
    })
      .then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png")
        var file
        canvas.toBlob((blob) => {
          file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
          setFiles((prev) => [...prev, file])
        }, "image/jpeg")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      clickHandler()
      e.preventDefault()
    }
  }

  useEffect(() => {
    console.log("CHATBOT WELCOME MESSAGE",chatbotConfig)
    endRef.current?.scrollIntoView({ behaviour: "smooth", block: "end" })

    const timer = setTimeout(() => {
      endRef.current?.scrollIntoView({ behaviour: "smooth", block: "end" })
    }, 500)
    return () => clearTimeout(timer)
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behaviour: "smooth", block: "end" })

    const timer = setTimeout(() => {
      endRef.current?.scrollIntoView({ behaviour: "smooth", block: "end" })
    }, 500)
    return () => clearTimeout(timer)
  })

  return (
    <div className={styles.chatBox}>
      <header
        style={customChatStyles.chatbot_header}
        onClick={() => {
          setIsBoxOpen(false)
        }}
      >
        <div className={styles.chatHeader}>
          {" "}
          {icon} 
          <p>{chatbot?.chatbot_name}</p>
        </div>
      </header>
      <main>
        {allMessages.map((msg) => {
          return (
            (msg?.content || msg?.Support_Chat_Attachments?.length > 0) && (
              <div className={styles.msgContainerLeft + " " + (cookies.chat_user_id === msg.user?.chat_user_id && styles.msgContainerRight)}>
                <div className={styles.msg + " " + ("customer" === msg?.user_type && styles.userMsg)}>
                  <div className={styles.text}>{<MessageContent msg={msg} />}</div>
                  {msg?.Support_Chat_Attachments?.length > 0 && (
                    <div className={styles.images}>
                      {msg?.Support_Chat_Attachments?.map((attachment) => {
                        return (
                          <div className={styles.image}>
                            {attachment?.attachment_type === "audio/wav" ? (
                              <audio controls id="audio" src={attachment?.attachment_url} type={attachment?.attachment_type}></audio>
                            ) : attachment.attachment_type.includes("image") ? (
                              <a href={attachment?.attachment_url} className={styles.download_link} download>
                                <img src={attachment?.attachment_url} alt="#" />
                              </a>
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
        <div ref={endRef} className={styles.emptyDiv}></div>

        {/* <div className={styles.videoPlayer}>
          {peerState?.remoteMediaStream && (
            <VideoPlayer stream={peerState.remoteMediaStream} />
            //
          )}
          //
        </div> */}
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
          <textarea className={styles.inputMsgBox} type="text" placeholder="Write here ..." value={inputMsg} ref={textAreaRef} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} />
          <div className={styles.sendOptions}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIcZBZPttoh360vK7HP3n9PLQpL_q_YHKUhQ&usqp=CAU" alt="#" className={styles.snapshot + " " + (isTakingSnapshot && styles.blur)} onClick={handleSnapshot} />

            {/* <VoiceMemos setFiles={setFiles} /> */}
            <div className={styles.attachments}>
              <label htmlFor="attachment">
                <Attachment className={styles.icon} />
              </label>
              <input type="file" name="attachment" id="attachment" onChange={(event) => setFiles(event.target.files)} />
            </div>
            {chatbot?.Chatbot_Messages?.[2]?.enabled&&<div onClick={vidClickHandler}>
             <MdScreenShare size={25} className={styles.icon} />
            </div>}
            <Send className={styles.icon} onClick={clickHandler} />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Chatbox
