import React, { useState } from "react"
import styles from "./Chatbox.module.scss"
import { useEffect } from "react"
import axios from "axios"
import { usePeer } from "../../../../context/PeerContext"
// import { BsFillCameraVideoFill } from "react-icons/bs"

import { Attachment, ChatSupport, Delete, Download, ImageFile, ScreenShot, Send } from "../../../../libs/icons/icon"
import moment from "moment/moment"
import { useCookies } from "react-cookie"
import useChat from "../../../../data-access/useChat"
import Spinner from "../../../../libs/utils/Spinner/Spinner"
// import VoiceMemos from "./components/VoiceMemos/VoiceMemos"
import { MdScreenShare } from "react-icons/md"
import html2canvas from "html2canvas"
import { useRef } from "react"
import useAutosizeTextArea from "./components/AutoSizeTextArea/AutoSizeTextArea"
import MessageContent from "./components/MessageContent/MessageContent"
import defaultIcons from "../../../../libs/icons/defaultIcons/defaultIcons"
import AttachmentImage from "./AttachmentImage/AttachmentImage"
import Tooltip from "../../../../libs/utils/Tooltip/Tooltip"

const addToCall = (user, myPeer, myStream) => {
  const call = myPeer.call(user.user_id, myStream)
}
const Chatbox = ({ socket, allMessages, teamCdn, chatbotConfig, setIsBoxOpen }) => {
  const [icon, setIcon] = useState(defaultIcons[chatbotConfig?.default_chatbot_icon - 1]?.IconName)

  const customChatStyles = {
    chatbot_header: {
      height: "54px",
      width: "100%",
      background: chatbotConfig?.color,
      color: "white",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "19px",
      padding: "18px",
      borderTopLeftRadius: "15px",
      borderTopRightRadius: "15px",
    },
  }

  const endRef = useRef()
  const textAreaRef = useRef(null)

  const [cookies, setCookies] = useCookies(["chat_room_id", "chat_session_id", "chat_user_id", "support_chat_id"])

  // const { deleteMultimediaApi } = useDeleteAttachment();
  const { uploadMultimedia, isMultimediaUploading, deleteAttachment, isDeletingAttachment } = useChat()
  const [inputMsg, setInputMsg] = useState("")
  const [chatAttachmentId, setChatAttachmentId] = useState()
  const [myStream, setMyStream] = useState()
  const [files, setFiles] = useState([])
  const [image, setImage] = useState()
  // const [uploadingMultimedia, setUploadingMultimedia] = useState(false)
  // const [file, setFile] = useState()

  const [supportMsgId, setSupportMsgId] = useState()

  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false)
  const { peerState, setPeerState } = usePeer()
  const [loadingStates, setLoadingStates] = useState({})
  const inputRef = useRef(null)

  useAutosizeTextArea(textAreaRef.current, inputMsg)

  useEffect(() => {
    peerState?.myPeer?.on("open", (id) => {
      console.log("My peerstate id for connection is:", id)
    })
  })
  const clickHandler = async () => {
    // console.log("teamChatCdn", teamCdn)
    if (isMultimediaUploading || isDeletingAttachment) return

    const numberOfLineBreaks = (inputMsg.match(/\n/g) || []).length
    const inputMsgLength = inputMsg.length
    if ((inputMsg && inputMsgLength > numberOfLineBreaks) || files?.length > 0) {
      await socket.current.emit("chat-message", inputMsg, "customer", cookies.chat_room_id, cookies.chat_session_id, teamCdn, supportMsgId)
      setInputMsg("")
      setFiles([])
      clearInputValue()
      setSupportMsgId()
      setChatAttachmentId()
    }
  }

  const clearInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = null
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
        // console.log("incomingStream")
        // console.log(mediaStream)
        setPeerState((state) => ({
          ...state,
          remoteAudioStream: mediaStream,
        }))
      })
    }
  }

  useEffect(() => {
    if (files?.length > 0) {
      // setUploadingMultimedia(true)

      const formData = new FormData()

      for (let i = 0; i < files?.length; i++) {
        formData.append(`attachment`, files[i])
      }

      //if support chat id do not exist so it is first message and send support chat id as null
      if (cookies?.support_chat_id) formData.append("support_chat_id", cookies?.support_chat_id)
      formData.append("msg_type", "customer")
      formData.append("chat_user_id", cookies?.chat_user_id)
      formData.append("team_cdn_id", teamCdn)
      formData.append("chat_room_id", cookies?.chat_room_id)
      formData.append("chat_session_id", cookies?.chat_session_id)

      // try {
      uploadMultimedia(formData, {
        onSuccess: (data) => {
          setSupportMsgId(data?.data?.support_message_id)
          setCookies("support_chat_id", data?.data?.support_chat_id)
          setCookies("chat_attachment_id", data?.data?.chat_attachment_id)
          setChatAttachmentId(data?.data?.chat_attachment_id)
          // setUploadingMultimedia(false)
          setIsTakingSnapshot(false)
          // console.log("Datacheck", data)
        },
        onError: (err) => {
          console.log(err)
          // setUploadingMultimedia(false)
          setIsTakingSnapshot(false)
        },
      })
    }
  }, [files])

  // Delete Attachment
  const deleteAttachmentHandler = async () => {
    const { support_chat_id, chat_attachment_id } = cookies
    deleteAttachment(
      { support_message_id: supportMsgId, support_chat_id, chat_attachment_id: chatAttachmentId },
      {
        onSuccess: (data) => {
          setFiles([])
        },
        onError: (err) => {
          console.log(err)
        },
      }
    )
  }

  function formatBytes(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes == 0) return "0 Byte"
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i]
  }

  const handleSnapshot = () => {
    if (isMultimediaUploading || isDeletingAttachment || isTakingSnapshot) return

    setIsTakingSnapshot(true)
    const root = window?.top?.document?.body

    html2canvas(root, {
      cacheBust: true,
      useCORS: true,
      allowTaint: true,
      ignoreElements: function (element) {
        /* Remove element with id="live-chat" */
        if ("live-chat-iframe" === element.id) {
          return true
        }
      },
      onrendered: function (canvas) {},
    })
      .then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png")
        var file
        canvas.toBlob((blob) => {
          file = new File([blob], "screenshot.jpeg", { type: "image/jpeg" })
          setFiles([file])
        }, "image/jpeg")
        setImage(dataUrl)
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

  const downloadAttachment = (index) => {
    setLoadingStates((prevState) => ({ ...prevState, [index]: true }))

    setTimeout(() => {
      setLoadingStates((prevState) => ({ ...prevState, [index]: false }))
    }, 2000) // Simulate a 2 second download
  }

  useEffect(() => {
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
          <p>{chatbotConfig?.chatbot_name}</p>
        </div>
      </header>
      <main className={styles.main}>
        {allMessages.map((msg) => {
          return (
            (msg?.content || msg?.Support_Chat_Attachments?.length > 0) && (
              <div className={styles.msgContainerLeft + " " + (cookies.chat_user_id === msg.user?.chat_user_id && styles.msgContainerRight)}>
                <div className={styles.msg + " " + ("customer" === msg?.user_type && styles.userMsg)} style={"customer" === msg?.user_type ? { background: chatbotConfig?.color } : {}}>
                  <div className={styles.text}>{<MessageContent msg={msg} />}</div>
                  {msg?.Support_Chat_Attachments?.length > 0 && (
                    <div className={styles.images}>
                      {msg?.Support_Chat_Attachments?.map((attachment, index) => {
                        return (
                          <div className={styles.image}>
                            {attachment?.attachment_type === "audio/wav" ? (
                              <audio controls id="audio" src={attachment?.attachment_url} type={attachment?.attachment_type}></audio>
                            ) : attachment.attachment_type.includes("image") ? (
                              <AttachmentImage attachment={attachment} />
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

                                {!loadingStates[attachment?.support_message_id] ? (
                                  <a href={attachment?.attachment_url} target="_blank" className={styles.download_link} onClick={() => downloadAttachment(attachment?.support_message_id)}>
                                    <Download className={styles.download_icon} />
                                  </a>
                                ) : (
                                  <div className={styles.download_link}>
                                    <Spinner className={styles.downloadSpinner} />
                                  </div>
                                )}
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
      <footer className={styles.footer}>
        <div className={styles.sendMessage}>
          <textarea className={styles.inputMsgBox} type="text" placeholder="Write here ..." value={inputMsg} ref={textAreaRef} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} />
          <div className={styles.sendOptions + " " + ((isMultimediaUploading || isDeletingAttachment) && styles.disabled)}>
            <Tooltip text="Screenshot" theme="TOP">
              <div className={styles.snapshot + " " + (isTakingSnapshot && styles.blur)} onClick={handleSnapshot}>
                <ScreenShot size={18} className={styles.icon} />
              </div>
            </Tooltip>

            {/* <VoiceMemos setFiles={setFiles} /> */}
            <Tooltip text="Attachment" theme="TOP">
              <div className={styles.attachments}>
                <label htmlFor="attachment">
                  <Attachment className={styles.icon} />
                </label>
                <input type="file" name="attachment" id="attachment" onChange={(event) => setFiles(event.target.files)} disabled={isMultimediaUploading || isDeletingAttachment} ref={inputRef} />
              </div>
            </Tooltip>
            {chatbotConfig?.Chatbot_Messages?.[2]?.enabled && (
              <div onClick={vidClickHandler}>
                <MdScreenShare size={25} className={styles.icon} />
              </div>
            )}
            <Tooltip text="Send" theme="TOP">
              <Send className={styles.icon} onClick={clickHandler} />
            </Tooltip>
          </div>
        </div>
        <div className={styles.attachment_name}>
          {files?.length > 0 &&
            (isMultimediaUploading || isDeletingAttachment ? (
              <div className={styles.loading}>
                <Spinner />
              </div>
            ) : (
              supportMsgId && (
                <>
                  {
                    <div className={styles.images_name}>
                      <div className={styles.attachment_icon_image}>
                        <ImageFile />
                      </div>
                      <div className={styles.files_name_size}>
                        <p>{files[0].name.length > 23 ? files[0].name.substring(0, 20) + "..." : files[0].name}</p>
                        <p>{Math.round((files[0].size / (1024 * 1024)) * 100) / 100} MB</p>
                      </div>
                      <Delete className={styles.close_icon} onClick={deleteAttachmentHandler} />
                    </div>
                  }
                </>
              )
            ))}
        </div>
      </footer>
    </div>
  )
}

export default Chatbox
