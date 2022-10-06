import React, { useEffect, useState } from "react";
import { BsFillChatFill } from "react-icons/bs";
import useSocketForLiveChat from "../../data-access/useSocketForLiveChat";
import Chatbox from "./components/Chatbox/Chatbox";
import styles from "./LiveChat.module.css";
import { v4 as uuid } from "uuid";
import { usePeer } from "../../context/PeerContext";

const LiveChat = ({ teamCdn }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState();
  const [latestActivityFromSocket, setLatestActivityFromSocket] = useState();
  // const [isButtonClicked,setIsButtonClicked]=useState(false)
  const [socket] = useSocketForLiveChat(setLatestActivityFromSocket);
  const [msgList, setMsgList] = useState([]);
  const { peerState,setPeerState } = usePeer();
  const joinClickHandler = async () => {
    await socket.current.emit("join-chat", username, uuid(), teamCdn);
    setIsBoxOpen(false);
    setIsLoggedIn(true);
  };
  useEffect(() => {
    if (latestActivityFromSocket) {
      setMsgList((list) => [...list, latestActivityFromSocket]);
    }
    setLatestActivityFromSocket(null);
  }, [latestActivityFromSocket]);
  // console.log(myPeer)
  return (
    <div className={styles.liveChatContainer}>
      <div
        className={styles.floatBtn}
        onClick={() => {
          setIsBoxOpen(!isBoxOpen);
          setUsername("");
          setIsLoggedIn(false);
          socket.current.emit("leave-room");
        }}
      >
        <BsFillChatFill />
      </div>
      {isBoxOpen && (
        <div className={styles.detailsBox}>
          <header>
            <h2>Live chat</h2>
          </header>
          <main>
            <div className={styles.inputField}>
              <label htmlFor="">Username:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </main>
          <button className={styles.joinBtn} onClick={joinClickHandler}>
            Join room
          </button>
        </div>
      )}
      {isLoggedIn && (
        <Chatbox
          socket={socket}
          allMessages={msgList}
          username={username}
        />
      )}
    </div>
  );
};

export default LiveChat;
