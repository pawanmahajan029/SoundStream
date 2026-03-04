import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePlayPause, playNext, playPrevious, setPlaying, setCurrentSong } from '../store/musicSlice';
import { setupMediaSession, updateMediaSessionState, clearMediaSession } from '../utils/mediaSession';
import { backgroundAudioService } from '../services/backgroundAudio';
import { useSocket } from './SocketContext';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, currentIndex, playlist, songs } = useSelector(state => state.music);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { socket, roomId } = useSocket();

  // Socket event listener for sync
  useEffect(() => {
    if (!socket) return;

    const handleSync = (action) => {
      console.log("Received Sync Action:", action);
      if (action.type === 'PLAY') {
        dispatch(setPlaying(true));
        if (action.time !== undefined && audioRef.current) {
          audioRef.current.currentTime = action.time;
        }
      } else if (action.type === 'PAUSE') {
        dispatch(setPlaying(false));
      } else if (action.type === 'SEEK') {
        if (audioRef.current) {
          audioRef.current.currentTime = action.time;
          setCurrentTime(action.time);
        }
      } else if (action.type === 'CHANGE_TRACK') {
        dispatch(setCurrentSong(action.song));
        dispatch(setPlaying(true));
      }
    };

    socket.on('sync-playback', handleSync);
    return () => socket.off('sync-playback', handleSync);
  }, [socket, dispatch]);

  // Initialize background audio service
  useEffect(() => {
    backgroundAudioService.setupAudioContext();
    return () => {
      clearMediaSession();
      backgroundAudioService.destroy();
    };
  }, []);

  // Setup media session when song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      setupMediaSession(
        currentSong,
        audioRef,             // Pass audio ref directly
        isPlaying,            // Current playing state
        (playing) => dispatch(setPlaying(playing)), // Toggle play state
        handleNext,           // onNext
        handlePrevious        // onPrevious
      );

      // Enable background audio
      backgroundAudioService.enableBackgroundAudio(audioRef.current);
    }
  }, [currentSong, isPlaying]); // Add isPlaying to deps

  // Update media session state when play/pause changes
  useEffect(() => {
    updateMediaSessionState(isPlaying);

    // Sync audio element with Redux state
    if (audioRef.current) {
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(console.log);
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Format time in MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle time update
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Handle duration change
  const handleDurationChange = () => {
    setDuration(audioRef.current.duration);
  };

  // Handle seeking
  const handleSeek = (e) => {
    const time = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (socket && roomId) {
        socket.emit('sync-playback', roomId, { type: 'SEEK', time });
      }
    }
  };

  // Handle play/pause from UI
  const handlePlayPause = () => {
    dispatch(togglePlayPause());
    if (socket && roomId) {
      socket.emit('sync-playback', roomId, { type: !isPlaying ? 'PLAY' : 'PAUSE', time: audioRef.current?.currentTime });
    }
  };

  // Handle next song
  const handleNext = () => {
    dispatch(playNext());
  };

  // Handle previous song  
  const handlePrevious = () => {
    dispatch(playPrevious());
  };

  // Handle audio events for background playback
  const handleCanPlay = () => {
    if (isPlaying) {
      audioRef.current.play().catch(console.log);
    }
  };

  const handleSocketTrackChange = (song) => {
    if (socket && roomId) {
      socket.emit('sync-playback', roomId, { type: 'CHANGE_TRACK', song });
    }
  }

  const value = {
    audioRef,
    currentTime,
    duration,
    formatTime,
    handleTimeUpdate,
    handleDurationChange,
    handleSeek,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleSocketTrackChange
  };
  return (
    <AudioContext.Provider value={value}>
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.audio}
          className="hidden"
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onCanPlay={handleCanPlay}
          preload="metadata"
        />
      )}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
