import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentSong, togglePlayPause } from '../store/musicSlice'

const Search = () => {
  const dispatch = useDispatch()
  const { songs, currentSong, isPlaying } = useSelector(state => state.music)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const filteredSongs = songs.filter(song =>
    song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSongClick = (song) => {
    dispatch(setCurrentSong(song));
    if (!isPlaying) dispatch(togglePlayPause());
  }

  return (
    <div className="flex flex-col h-full w-full">
      <header className="w-full theme-bg-secondary border theme-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl py-5 px-8 mb-8 flex items-center h-20 bg-opacity-60 backdrop-blur-md">
        <h1 className="text-2xl font-clash font-bold theme-text-primary tracking-tight">Search Library</h1>
      </header>

      <main className="flex-1">
        <div className="mb-4 md:mb-4">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Find in music"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border theme-border theme-bg-secondary theme-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 theme-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="grid gap-4 -mt-1">
          {filteredSongs.map((song, index) => (
            <div
              key={index}
              className={`flex items-center justify-between truncate ${currentSong?._id === song._id ? 'theme-bg-selected border-indigo-500/50' : 'theme-bg-secondary border-transparent'} border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-white/5 transition-all group`}
              onClick={() => handleSongClick(song)}
            >
              <div className="flex items-center flex-1">
                <img
                  src={song.poster}
                  alt={song.title}
                  className="w-12 h-12 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className={`font-medium ${currentSong?._id === song._id ? 'theme-text-tertiary' : 'theme-text-primary'}`}>{song.title}</h3>
                  <p className="text-sm theme-text-tertiary">{song.artist}</p>
                </div>
              </div>

              {currentSong?._id === song._id && isPlaying && (
                <div className="flex items-end h-6 space-x-0.5 ml-4">
                  <div
                    className="w-0.5 h-2 music-bar rounded-full"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-0.5 h-3 music-bar rounded-full"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-0.5 h-1.5 music-bar rounded-full"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default Search