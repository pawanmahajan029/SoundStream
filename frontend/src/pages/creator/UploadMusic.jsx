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
  const [uploadProgress, setUploadProgress] = useState(0)   // 0–100
  const [uploadStatus, setUploadStatus] = useState('idle')  // 'idle' | 'uploading' | 'success' | 'error'

  const isUploading = uploadStatus === 'uploading';

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploadStatus('uploading')
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('title', songTitle)
    formData.append('artist', artistName)
    formData.append('audio', audioFile)
    formData.append('poster', imageFile)

    try {
      await api.post('/song/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      })

      setUploadProgress(100)
      setUploadStatus('success')
      dispatch(fetchSongs())

      // Navigate home after 2s so user can see the success state
      setTimeout(() => {
        setSongTitle('')
        setArtistName('')
        setAudioFile(null)
        setImageFile(null)
        setUploadStatus('idle')
        setUploadProgress(0)
        navigate('/')
      }, 2000)

    } catch (err) {
      setUploadStatus('error')
      const serverMessage = err.response?.data?.message;
      alert(`Upload Failed: ${serverMessage || err.message}`);
      setUploadStatus('idle')
      setUploadProgress(0)
    }
  }

  return (
    <div className="flex flex-col min-h-screen theme-bg-primary">
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-4">

        {/* Back Button and Title */}
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
              <FileDropzone accept="audio/*" label="Audio File" formatText="MP3, WAV, AAC, M4A" onFileSelected={setAudioFile} />
              <FileDropzone accept="image/*" label="Cover Art" formatText="JPG, PNG, WEBP" onFileSelected={setImageFile} />
            </div>

            {/* Selected File Names */}
            {(audioFile || imageFile) && (
              <div className="theme-bg-tertiary p-4 rounded-xl border theme-border flex flex-col gap-2 shadow-sm">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm theme-text-secondary truncate">{imageFile.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* ─── Progress Bar ─────────────────────────────────── */}
            {(uploadStatus === 'uploading' || uploadStatus === 'success') && (
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  {uploadStatus === 'success' ? (
                    <span className="text-green-400 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Upload Complete ✅
                    </span>
                  ) : (
                    <span className="theme-text-secondary">Uploading...</span>
                  )}
                  <span className={`font-mono ${uploadStatus === 'success' ? 'text-green-400' : 'text-indigo-400'}`}>
                    {uploadProgress}%
                  </span>
                </div>

                {/* The bar */}
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${uploadStatus === 'success' ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                {/* Block character style display */}
                <p className="text-xs font-mono text-center theme-text-tertiary tracking-widest">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i} className={i < Math.round(uploadProgress / 10) ? (uploadStatus === 'success' ? 'text-green-400' : 'text-indigo-400') : 'text-gray-600'}>
                      █
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full p-3 text-white rounded-full font-medium transition-all ${isUploading
                ? 'bg-indigo-400 opacity-75 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-700 cursor-pointer'}`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading... {uploadProgress}%</span>
                </div>
              ) : 'Upload Music'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadMusic