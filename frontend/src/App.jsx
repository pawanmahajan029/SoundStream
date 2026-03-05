import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AudioProvider } from './context/AudioContext'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'
import AppRoutes from './routes/AppRoutes'
import PWABadge from './components/shared/PWABadge'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <AudioProvider>
            <Router>
              <AppRoutes />
              <PWABadge />
            </Router>
          </AudioProvider>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App