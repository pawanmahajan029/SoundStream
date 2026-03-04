import { useSelector, useDispatch } from 'react-redux'
import { setCurrentSong, togglePlayPause, fetchSongs, deleteSong } from '../store/musicSlice'

// Animation is now defined in index.css - no need for inline styles

const Home = () => {
  const dispatch = useDispatch()
  const { songs, currentSong, isPlaying, loading, error } = useSelector(state => state.music)
  const userRole = localStorage.getItem('userRole') || 'listener';

  const handleSongClick = (song) => {
    dispatch(setCurrentSong(song));
    if (!isPlaying) dispatch(togglePlayPause());
  }

  const handleDelete = (e, songId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this song?")) {
      dispatch(deleteSong(songId));
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Title Header matching vanilla layout */}
      <header className="glass-panel w-full theme-bg-secondary border shadow-sm rounded-xl py-5 px-8 mb-8 flex items-center h-20">
        <h1 className="text-2xl font-bold theme-text-primary tracking-tight">Discover New Beats</h1>
      </header>

      {/* All songs */}
      <section className="flex-1">
        <div className="max-w-screen-xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-0"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              {error}
            </div>
          ) : (
            <div className="grid gap-4">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between truncate ${currentSong?._id === song._id ? 'theme-bg-selected' : 'theme-bg-secondary'} rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-all group`}
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

                  <div className="flex items-center space-x-4 ml-4">
                    {currentSong?._id === song._id && isPlaying && (
                      <div className="flex items-end h-6 space-x-0.5">
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
                    {userRole === 'artist' && (
                      <button
                        onClick={(e) => handleDelete(e, song._id)}
                        className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors ml-2"
                        title="Delete song"
                      >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home