// import useChat from "../../../../../../data-access/useChat"
// import React, { useEffect, useState, useRef } from "react"
// import styles from "./VoiceMemos.module.scss"

// const VoiceMemos = ({ setFiles }) => {
//   const [recording, setRecording] = useState(false)
//   const [toggle, setToggle] = useState(false)
//   const recorder = useRef()

//   useEffect(() => {
//     // get audio stream from user's mic
//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//       })
//       .then(function (stream) {
//         recorder.current = new MediaRecorder(stream)
//         console.log("recorder", recorder?.MediaRecorder)

//         recorder.current.addEventListener("dataavailable", onRecordingReady)
//       })
//   }, [])

//   function onRecordingReady(e) {
//     // console.log('yeh hai data', e.data);
//     // console.log(URL.createObjectURL(e.data));
//     setRecording(URL.createObjectURL(e.data))
//   }

//   function startRecording() {
//     console.log("recording", recorder)
//     recorder.current.start()
//   }

//   function stopRecording() {
//     // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
//     console.log("stop", recorder)

//     recorder.current.stop()
//   }

//   const handelRecording = () => {
//     if (toggle) {
//       stopRecording()
//     } else {
//       startRecording()
//     }

//     setToggle(!toggle)
//   }

//   useEffect(() => {
//     if (recording) {
//       console.log(recording)

//       const handelFromData = async () => {
//         // const formData = new FormData();

//         const audioBlob = await fetch(recording).then((r) => r.blob())

//         const audioFile = new File([audioBlob], "voice.wav", {
//           type: "audio/wav",
//         })
//         console.log(audioFile)

//         setFiles((prev) => [...prev, audioFile])
//       }
//       handelFromData()
//     }
//   }, [recording])

//   return <img onClick={handelRecording} className={styles.recorder} src={`${toggle ? "https://cdn-icons-png.flaticon.com/512/458/458574.png" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyyfh6VsxhiMURzKrb5NVMGzX1snkhzhOFEg&usqp=CAU"}`} alt="#" />
// }

// export default VoiceMemos
