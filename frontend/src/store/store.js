import { configureStore } from '@reduxjs/toolkit'
import musicReducer from './musicSlice'
import authReducer from './authSlice'
import collabReducer from './collabSlice'
import leaderboardReducer from './leaderboardSlice'

export const store = configureStore({
  reducer: {
    music: musicReducer,
    auth: authReducer,
    collab: collabReducer,
    leaderboard: leaderboardReducer,
  }
})

// Make store available globally for API interceptor
window.store = store