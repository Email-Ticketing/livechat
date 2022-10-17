import { useEffect, useState } from "react";
import useSocket from "./useSocket";
import { useCookies } from "react-cookie";

const useSocketForLiveChat = (setLatestActivityFromSocket) => {
  const [socket] = useSocket("https://et-dev-api.ringover-crm.xyz/");
  // const {username,room}=details
  const [cookies, setCookies] = useCookies(["chat_room_id"]);

  useEffect(() => {
    defineEvents();
  }, []);

  const defineEvents = () => {
    console.log("socket run");

    socket.current.on("connect", () => {
      console.log(
        "%cJOINED SOCKET FOR Chat",
        "background: #00ddd0; color: #000; font-weight: 600;"
      );
    });

    socket.current.on("connect_failed", () => {
      console.log(
        "%cFAILED TO CONNECT SOCKET FOR ACTIVITY",
        "background: #ff8888; color: #000; font-weight: 600;"
      );
    });

    socket.current.on("message", (message) => {
      setLatestActivityFromSocket(message);
      if (!cookies.chat_room_id) {
        setCookies("chat_room_id", message?.user?.chat_room_id, {
          path: "/",
        });
      }

      console.log("Received message:- ", message);
    });

    socket.current.on("disconnect", (disconect) => {
      console.log("socket for activity disconnected", disconect);
    });
  };

  return [socket];
};

export default useSocketForLiveChat;
