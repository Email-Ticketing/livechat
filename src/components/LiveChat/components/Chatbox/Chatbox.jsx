import React, { useState } from "react"
import styles from "./Chatbox.module.scss"
import { useEffect } from "react"

import { Send } from "../../../../libs/icons/icon"
import moment from "moment/moment"
import { useCookies } from "react-cookie"

import { useRef } from "react"
import useAutosizeTextArea from "./components/AutoSizeTextArea/AutoSizeTextArea"
import defaultIcons from "../../../../libs/icons/defaultIcons/defaultIcons"
import Tooltip from "../../../../libs/utils/Tooltip/Tooltip"

const Chatbox = ({ socket, allMessages, setAllMessages, teamCdn, chatbotConfig, setIsBoxOpen }) => {
  const [icon, setIcon] = useState(defaultIcons[3]?.IconName)

  const customChatStyles = {
    chatbot_header: {
      height: "54px",
      width: "100%",
      background: "blue",
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
  const [inputMsg, setInputMsg] = useState("")

  useAutosizeTextArea(textAreaRef.current, inputMsg)

  const clickHandler = async () => {
    const inputMsgLength = inputMsg.length
    if (inputMsgLength) {
      socket.send(JSON.stringify({ data: inputMsg }))
      // {"uuid":"ba71ab02-0dfc-4184-8d55-9889bd468c74","data":"Hello! How can I assist you today?","creation_date":"2024-01-11T10:06:03.324190999Z","update_date":"2024-01-11T10:06:03.324191345Z"}
      setAllMessages((prev) => [...prev, { data: inputMsg, creation_date: Date.now() }])
      setInputMsg("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      clickHandler()
      e.preventDefault()
    }
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
          {icon}
          <p>ChatBot</p>
        </div>
      </header>
      <main className={styles.main}>
        {allMessages?.map((msg, i) => {
          return (
            msg?.data && (
              <div key={`message_${i}`} className={styles.msgContainerLeft + " " + (msg?.uuid?.length && styles.msgContainerRight)}>
                <div className={styles.msg + " " + (msg?.uuid && styles.userMsg)}>
                  <div className={styles.text}>{msg.data}</div>
                </div>
                <p className={styles.msgInfo}>{moment(msg?.created_at).format("Do MMMM YYYY, h:mm a")}</p>
              </div>
            )
          )
        })}
        <div ref={endRef} className={styles.emptyDiv}></div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.sendMessage}>
          <textarea className={styles.inputMsgBox} type="text" placeholder="Write here ..." value={inputMsg} ref={textAreaRef} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} />
          <div className={styles.sendOptions}>
            <Tooltip text="Send" theme="TOP">
              <Send className={styles.icon} onClick={clickHandler} />
            </Tooltip>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Chatbox
