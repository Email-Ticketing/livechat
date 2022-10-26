import React, { useEffect, useRef, useState } from 'react';
import styles from './AudioPlayer.module.scss';
// import { ReactComponent as Play } from '../../assets/play2.svg';
// import { ReactComponent as Pause } from '../../assets/pause2.svg';

const AudioPlayer = ({ media }) => {
  const [play, setPlay] = useState(false);
  const [currPosition, setCurrPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef();

  useEffect(() => {
    var audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      audio.addEventListener('timeupdate', () => {
        setDuration(audio.duration);
        setCurrPosition(audio.currentTime);
      });
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', () => {
          console.log('removed eventlistener');
        });
      }
    };
  }, [audioRef, play]);

  const handleRecordPlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setPlay(true);
    } else {
      audioRef.current.pause();
      setPlay(false);
    }
  };

  const FormatTime = () => {
    let timeelasped = '';
    timeelasped = `${Math.floor(currPosition / 60)}:${Math.floor(
      currPosition % 60
    )}`;
    if (isNaN(duration) || duration === Infinity) {
      return timeelasped;
    } else {
      let totalTime = `${Math.floor(duration / 60)}:${Math.floor(
        duration % 60
      )}`;
      return timeelasped + '/' + totalTime;
    }
  };
  return (
    <div className={styles.audioParent}>
      {!play && <Play onClick={handleRecordPlay} />}
      {play && <Pause onClick={handleRecordPlay} />}
      {FormatTime()}
      <audio
        ref={audioRef}
        src={media}
        onEnded={() => {
          setPlay(false);
          setCurrPosition(0);
        }}
      />
    </div>
  );
};

export default AudioPlayer;
