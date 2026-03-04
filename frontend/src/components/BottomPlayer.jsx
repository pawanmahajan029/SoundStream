import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAudio } from '../context/AudioContext';
import { setCurrentSong, togglePlayPause } from '../store/musicSlice';

const BottomPlayer = () => {
    const dispatch = useDispatch();
    const { songs, currentSong, isPlaying } = useSelector(state => state.music);
    const {
        audioRef,
        currentTime,
        duration,
        formatTime,
        handleSeek,
        handlePlayPause,
        handleSocketTrackChange
    } = useAudio();

    if (!currentSong) return null;

    // Handle track navigation
    const handleTrackChange = (direction) => {
        const currentIndex = songs.findIndex(song => song._id === currentSong._id);
        let nextIndex;

        if (direction === 'next') {
            nextIndex = currentIndex + 1 >= songs.length ? 0 : currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1 < 0 ? songs.length - 1 : currentIndex - 1;
        }

        const nextSong = songs[nextIndex];

        dispatch(setCurrentSong(nextSong));
        handleSocketTrackChange(nextSong);

        if (!isPlaying) {
            dispatch(togglePlayPause());
        }

        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(error => {
                    console.error('Error playing track:', error);
                });
            }
        }, 0);
    }

    return (
        <div className="w-full h-full z-50 bg-indigo-100 theme-bg-player theme-border border-t py-2 px-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto">

                {/* Left: Song Info */}
                <div className="flex items-center w-1/4 min-w-[200px]">
                    <img src={currentSong.poster} alt="now-playing" className="w-14 h-14 object-cover rounded-lg shadow-md mr-4" />
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-semibold text-[15px] theme-text-secondary truncate">{currentSong.title}</h3>
                        <p className="text-xs text-gray-500 theme-text-tertiary truncate">{currentSong.artist}</p>
                    </div>
                </div>

                {/* Center: Player Controls & Progress */}
                <div className="flex flex-col items-center flex-1 max-w-[600px] px-8">
                    <div className="flex items-center gap-6 mb-2">
                        <button
                            onClick={() => handleTrackChange('prev')}
                            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07c-.57.4-.57 1.24 0 1.64z" />
                            </svg>
                        </button>

                        <button
                            onClick={handlePlayPause}
                            className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => handleTrackChange('next')}
                            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zM5.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L5.58 7.11C4.91 6.65 4 7.12 4 7.93v8.14c0 .81.91 1.28 1.58.82z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center w-full gap-3 text-xs theme-text-tertiary">
                        <span className="w-10 text-right">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            style={{
                                background: `linear-gradient(to right, #3b82f6 ${(currentTime / duration) * 100}%, #e5e7eb 0%)`
                            }}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-moz-range-thumb]:hidden"
                        />
                        <span className="w-10">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Empty for alignment or extra controls later */}
                <div className="w-1/4 min-w-[200px] flex justify-end">
                    {/* Optionally add volume controls here later */}
                </div>

            </div>
        </div>
    );
};

export default BottomPlayer;
