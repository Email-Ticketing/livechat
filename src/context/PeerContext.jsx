import { Peer } from "peerjs";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import useSocket from "../data-access/useSocket";
import useSocketForStream from "../data-access/useSocketForStream";

// const chatForm = document.getElementById('chat-form');
// const chatMessages = document.querySelector('.chat-messages');
// const roomName = document.getElementById('room-name');
// const techName = document.getElementById('tech-name');
// const techList = document.getElementById('tech-names');
// const userList = document.getElementById('users');

// const myVideo = document.createElement('video');
// myVideo.muted = true;

// navigator.mediaDevices
//   .getUserMedia({
//     video: false,
//     audio: true,
//   })
//   .then((stream) => {
//     addVideoStream(myVideo, stream);

//     myPeer.on('call', (call) => {
//       call.answer(stream);
//       const video = document.createElement('video');
//       call.on('stream', (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     });

//     // Get user connected
//     socket.on('user-connected', (user) => {
//       console.log('User connected', user.user_id);
//       connectToNewUser(user.user_id, stream);
//     });
//   });

// function addVideoStream(video, stream) {
//   video.srcObject = stream;
//   video.addEventListener('loadedmetadata', () => {
//     video.play();
//   });
// }

// function connectToNewUser(userId, stream) {
//   const call = myPeer.call(userId, stream);
//   const video = document.createElement('video');
//   call.on('stream', (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
//   });
//   call.on('close', () => {
//     video.remove();
//   });
// }

// // Get username and room from URL
// const { username, room, tech } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
// console.log(tech);
// const socket = io();

// // Join chatroom
// myPeer.on('open', (id) => {
//   socket.emit('join-room', username, id, room, tech);
// });

// // Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// socket.on('techUsers', ({ tech, users }) => {
//   outputTechName(tech);
//   outputUsers(users);
// });

// // Message from server
// socket.on('msg', (message) => {
//   console.log(message);
//   outputMessage(message);

//   // Scroll down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// // Message submit
// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // Get message text
//   let msg = e.target.elements.msg.value;

//   msg = msg.trim();

//   if (!msg) {
//     return false;
//   }

//   // Emit message to server
//   socket.emit('chat-message', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });

// // Output message to DOM
// function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement('p');
//   para.classList.add('text');
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector('.chat-messages').appendChild(div);
// }

// // Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// // Add room name to DOM
// function outputTechName(tech) {
//   techName.innerText = tech;
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// }

// //Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//   console.log('Inside leavbtn');
//   const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//   if (leaveRoom) {
//     window.location = '../index.html';
//   } else {
//   }
// });

const PeerContext = createContext(null);

const defaultState = { users: [] };

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
  // const[peerSocket]=useSocketForStream()
  const [peerState, setPeerState] = useState(defaultState);
  useEffect(() => {
    const myPeer = new Peer();
    setPeerState((state) => ({ ...state, myPeer:myPeer }));
  }, []);

  useEffect(() => {

    peerState?.myPeer?.on("open", (id) => {
      console.log("My id:", id);
    });

  }, [peerState.myPeer]);
  useEffect(() => {
    // peerState.myPeer?.on()
    peerState?.myPeer?.on("call", (call) => {
      console.log("new call");
      call.answer()
      call.on('stream',(mediaStream)=>{
        setPeerState(state=>({
            ...state,
            remoteMediaStream:mediaStream
        }))
      })
    });
  });
  return (
    <PeerContext.Provider value={{ peerState, setPeerState }}>
      {children}
    </PeerContext.Provider>
  );
};
