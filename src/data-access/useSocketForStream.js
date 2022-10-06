import Peer from 'peerjs';
import { useEffect, useState } from 'react';
import { usePeer } from '../context/PeerContext';
import useSocket from './useSocket';

const useSocketForStream = (setLatestActivityFromStreamSocket,stream) => {
    const [socket]=useSocket('https://rcht-live-chat.herokuapp.com/')
    const {peerState,setPeerState}=usePeer()
    // useEffect(()=>{
    //     const myPeer=new Peer()
    //     setPeerState(state=>({...state,myPeer}))
    // },[])
    // console.log(peerState)
  
    useEffect(() => {
      defineEvents();
    }, [socket]);
  
    const defineEvents = () => {
      socket.current.on('connect', () => {
        console.log(
          '%cJOINED SOCKET FOR Stream',
          'background: #00ddd0; color: #000; font-weight: 600;'
        );
      });

      peerState.myPeer?.on('open',(id)=>{
        console.log(peerState.myPeer)
        console.log('My id:', id)
      })
      
  
      socket.current?.on('connect_failed', () => {
        console.log(
          '%cFAILED TO CONNECT SOCKET FOR ACTIVITY',
          'background: #ff8888; color: #000; font-weight: 600;'
        );
      });
  
      socket.current.on('disconnect', (disconect) => {
        console.log('socket for activity disconnected',disconect);
      });
      socket.current.on('user-connected',(user)=>{
        console.log('new user', user)
        setPeerState(state=>({
            ...state,
            users:[...state?.users,user]
        }))
      })
   
    };
  
    return [socket];
  };
  
  export default useSocketForStream;
  