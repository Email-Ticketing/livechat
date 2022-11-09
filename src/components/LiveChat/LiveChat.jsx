import React, { useEffect, useState } from "react";
import { BsFillChatFill } from "react-icons/bs";
import useSocketForLiveChat from "../../data-access/useSocketForLiveChat";
import Chatbox from "./components/Chatbox/Chatbox";
import styles from "./LiveChat.module.scss";
import { v4 as uuid } from "uuid";
import { usePeer } from "../../context/PeerContext";
import { ChatSupport } from "../../libs/icons/icon";
import { useCookies } from "react-cookie";
const LiveChat = ({ teamCdn }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestActivityFromSocket, setLatestActivityFromSocket] = useState();
  const [cookies, setCookies] = useCookies([
    "chat_room_id",
    "chat_session_id",
    "chat_user_id",
    "support_chat_id",
  ]);
  // const [isButtonClicked,setIsButtonClicked]=useState(false)

  const [socket] = useSocketForLiveChat(setLatestActivityFromSocket);
  const [msgList, setMsgList] = useState([]);
  const joinClickHandler = async () => {
    if (!isBoxOpen) {
      console.log("teamCdn:", teamCdn);
      await socket.current.emit(
        "join-chat",
        cookies.chat_user_id ? cookies.chat_user_id : uuid(),
        cookies.chat_room_id,
        "E6p2MJWUVSbKiPtQ7tgyj"
      );
      setIsLoggedIn(true);
    }
  };
  useEffect(() => {

    if (latestActivityFromSocket) {
      if (latestActivityFromSocket?.chatRoom?.chat_session_id) {
        setCookies(
          "chat_session_id",
          latestActivityFromSocket?.chatRoom?.chat_session_id,
          {
            path: "/",
          }
        );
      }
      if (latestActivityFromSocket?.userJoined?.chat_user_id) {
        setCookies(
          "chat_user_id",
          latestActivityFromSocket?.userJoined?.chat_user_id,
          {
            path: "/",
          }
        );
      }
      if (latestActivityFromSocket?.support_chat_id) {
        setCookies(
          "support_chat_id",
          latestActivityFromSocket?.support_chat_id,
          {
            path: "/",
          }
        );
      }

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
          joinClickHandler();
        }}
      >
        <ChatSupport />
      </div>
      {isBoxOpen && isLoggedIn && (
        <Chatbox socket={socket} allMessages={msgList} teamCdn={teamCdn} />
      )}
    </div>
  );
};

export default LiveChat;
