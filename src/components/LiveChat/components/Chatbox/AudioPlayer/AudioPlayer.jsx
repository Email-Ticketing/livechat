import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
const AudioPlayer=({stream})=> {
    console.log(stream)
    const audioRef=useRef()
    useEffect(()=>{
        (async()=>{
            if(stream){
                audioRef.current.srcObject=stream
                await audioRef.current.play()
            }
        })()
    },[stream])
  return (
    <audio ref={audioRef} />
  )
}

export default AudioPlayer