import React, { useState } from "react";
import styles from "./Chatbox.module.css";
import { RiSendPlane2Fill } from "react-icons/ri";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import { useEffect } from "react";
import useSocketForStream from "../../../../data-access/useSocketForStream";
import { v4 as uuid } from "uuid";
import { usePeer } from "../../../../context/PeerContext";
import {BsFillCameraVideoFill} from 'react-icons/bs'
const addToCall = (user, myPeer, myStream) => {
  const call = myPeer.call(user.user_id, myStream);
};
const Chatbox = ({ socket, allMessages, username }) => {
  const [inputMsg, setInputMsg] = useState("");
  const [myStream, setMyStream] = useState();
  const [latestActivityFromStreamSocket, setLatestActivityFromStreamSocket] =
    useState();
  const [peerSocket] = useSocketForStream(
    setLatestActivityFromStreamSocket,
    myStream
  );
  const { peerState } = usePeer();
  useEffect(() => {
    if (peerState?.myPeer?._id) {
      peerSocket.current.emit(
        "join-room",
        username,
        peerState.myPeer._id,
        null,
        "tech1"
      );
    }
  }, []);
  useEffect(() => {
    peerState?.myPeer.on("open", (id) => {
      console.log("My id:", id);
    });
  });
  const clickHandler = async () => {
    await socket.current.emit("chat-message", inputMsg);
    setInputMsg("");
  };
  const vidClickHandler = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    setMyStream(stream);
    peerState?.users?.map((user) => {
      if (user.username !== username) {
        const call = peerState.myPeer.call(user.user_id, stream);
      }
    });
  };

  return (
    <div className={styles.chatBox}>
      <header>
        <h2>Live chat</h2>
        <div onClick={vidClickHandler} className={styles.vidBtn}><BsFillCameraVideoFill color='white' size={25}/></div>
      </header>
      <main>
        {allMessages.map((msg) => {
          return (
            <div
              className={
                styles.msg + " " + (username === msg.username && styles.userMsg)
              }
            >
              {msg.message}
            </div>
          );
        })}
        <div className={styles.videoPlayer}>
          {peerState?.remoteMediaStream && (
            <VideoPlayer stream={peerState.remoteMediaStream} />
          )}
        </div>
      </main>
      <footer>
        <div className={styles.sendMessage}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <div onClick={clickHandler}>
            <RiSendPlane2Fill size={20} className={styles.icon} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Chatbox;
