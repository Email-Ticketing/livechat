import { useEffect, useState } from 'react';
import useSocket from './useSocket';

const useSocketForLiveChat = (setLatestActivityFromSocket) => {
    const [socket] = useSocket('https://rcht-live-chat.herokuapp.com/');
    // const {username,room}=details
  
    useEffect(() => {
      defineEvents();
    }, []);
  
    const defineEvents = () => {
      console.log('socket run');
  
      socket.current.on('connect', () => {
        console.log(
          '%cJOINED SOCKET FOR Chat',
          'background: #00ddd0; color: #000; font-weight: 600;'
        );
      });
  
      socket.current.on('connect_failed', () => {
        console.log(
          '%cFAILED TO CONNECT SOCKET FOR ACTIVITY',
          'background: #ff8888; color: #000; font-weight: 600;'
        );
      });
  
      socket.current.on('msg', (msg) => {
        setLatestActivityFromSocket(msg);
        console.log('Received msg:- ', msg);
      });
  
      socket.current.on('disconnect', (disconect) => {
        console.log('socket for activity disconnected',disconect);
      });
    };
  
    return [socket];
  };
  
  export default useSocketForLiveChat;
  