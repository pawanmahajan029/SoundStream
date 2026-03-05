import React, { useState } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import api from '../../config/api'
import { useDispatch } from 'react-redux'
import { fetchSongs } from '../../store/musicSlice'
import FileDropzone from '../../components/creator/FileDropzone';

const UploadMusic = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [songTitle, setSongTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', songTitle)
    formData.append('artist', artistName)
    formData.append('audio', audioFile)
    formData.append('poster', imageFile)
    setIsUploading(true)
    try {
      await api.post('/song/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload Progress:', percentCompleted + '%');
        }
      })

      // Refresh songs list
      dispatch(fetchSongs())

      // Reset form
      setSongTitle('')
      setArtistName('')
      setAudioFile(null)
      setImageFile(null)

      // Navigate back to home
      navigate('/')
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const rawError = err.message;
      alert(`Upload Failed:\nServer: ${serverMessage || 'N/A'}\nNetwork: ${rawError}\nData: ${JSON.stringify(err.response?.data || {})}`);
      console.error(err);
      setIsUploading(false)
    }
  }

  const handleAudioSelected = (file) => {
    setAudioFile(file)
  }

  const handleImageSelected = (file) => {
    setImageFile(file)
  }

  return (
    <div className="flex flex-col min-h-screen theme-bg-primary">

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-4">

        {/* Back Button and Upload Music text */}

        <div className="w-full max-w-md mb-36 flex">
          <button onClick={() => navigate(-1)} className="text-2xl cursor-pointer text-indigo-300"><IoArrowBackOutline /></button>
          <h1 className="text-2xl font-clash font-semibold mx-auto bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">Upload Music</h1>
        </div>

        {/* Upload Form */}
        <div className="w-full max-w-md mt-14 md:mt-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Song Title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="w-full p-3 theme-input-bg theme-text-primary placeholder-gray-500 rounded-md outline-none"
              required
            />

            <input
              type="text"
              placeholder="Artist Name"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full p-3 theme-input-bg theme-text-primary placeholder-gray-500 rounded-md outline-none"
              required
            />

            <div className="flex flex-col md:flex-row gap-4">

              <FileDropzone
                accept="audio/*"
                label="Audio File"
                formatText="MP3, WAV, AAC, M4A"
                onFileSelected={handleAudioSelected}
              />

              <FileDropzone
                accept="image/*"
                label="Cover Art"
                formatText="JPG, PNG, WEBP"
                onFileSelected={handleImageSelected}
              />

            </div>

            {/* Display selected file names */}
            {(audioFile || imageFile) && (
              <div className="bg-gray-50 dark:bg-[#1A1D2D] p-4 rounded-xl border theme-border flex flex-col gap-2 shadow-sm">
                <h3 className="text-sm font-semibold theme-text-primary mb-1">Selected Files:</h3>
                {audioFile && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span className="text-sm theme-text-secondary truncate">{audioFile.name}</span>
                  </div>
                )}
                {imageFile && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm theme-text-secondary truncate">{imageFile.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full p-3 text-white bg-indigo-500 rounded-full ${isUploading
                ? 'opacity-75 cursor-not-allowed'
                : 'hover:bg-indigo-800 cursor-pointer'
                }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload Music'
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default UploadMusic