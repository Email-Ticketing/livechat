import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import styles from './VideoPlayer.module.css'
const VideoPlayer=({stream})=> {
    const videoRef=useRef()
    useEffect(()=>{
        (async()=>{
            if(stream){
                videoRef.current.srcObject=stream
                await videoRef.current.play()
            }
        })()
    },[stream])
  return (
    <video ref={videoRef} className={styles.videoPlayer} />
  )
}

export default VideoPlayer