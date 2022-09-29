import React, { useState } from "react";
import styles from "./Chatbox.module.css";
import { RiSendPlane2Fill } from "react-icons/ri";
const Chatbox = ({socket,allMessages,username}) => {
    const [inputMsg,setInputMsg]=useState('')
    const clickHandler=async()=>{
        await socket.current.emit('chat-message',inputMsg)
        setInputMsg('')
    }
  return (
    <div className={styles.chatBox}>
      <header>
        <h2>Live chat</h2>
      </header>
      <main>
        {
            allMessages.map((msg)=>{
                return <div className={styles.msg + ' ' + (username===msg.username && styles.userMsg)}>
                    {msg.message}
                </div>
            })
        }
      </main>
      <footer>
        <div className={styles.sendMessage}>
          <input type="text" value={inputMsg} onChange={(e)=>setInputMsg(e.target.value)} />
          <div onClick={clickHandler}>
            <RiSendPlane2Fill size={20} className={styles.icon}/>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Chatbox;
