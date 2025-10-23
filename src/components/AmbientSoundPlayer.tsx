// components/AmbientSoundPlayer.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAmbientSounds } from 'hooks/useAmbientSounds'
import { useAuth } from 'contexts/AuthContext' // Adjust to your auth context

export function AmbientSoundPlayer() {
  const { user } = useAuth() // Your auth context
  const [soundEnabled, setSoundEnabled] = useState(false)
  const { soundContext, isPlaying, toggle, currentTrack } = useAmbientSounds(
    user?.addr || null,
    soundEnabled
  )

  // Auto-start on mount (with user permission)
  useEffect(() => {
    // Check if user previously enabled sounds
    const wasEnabled = localStorage.getItem('ambientSoundsEnabled') === 'true'
    if (wasEnabled && user?.addr) {
      setSoundEnabled(true)
    }
  }, [user?.addr])

  const handleToggle = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    localStorage.setItem('ambientSoundsEnabled', String(newState))
    
    if (newState) {
      toggle()
    }
  }

  if (!user?.addr) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white hover:bg-black/90 transition-all"
        title={soundEnabled && isPlaying ? 'Mute ambient sounds' : 'Enable ambient sounds'}
      >
        {soundEnabled && isPlaying ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.48A6.985 6.985 0 002 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" />
              <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
            </svg>
            <span className="text-sm">
              {soundContext?.soundContext === 'night' || soundContext?.soundContext === 'evening' ? '🌙' : '🌅'}
              {' '}
              {soundContext?.soundContext}
            </span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.48A6.985 6.985 0 002 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0010 16.25V3.75z" />
              <path fillRule="evenodd" d="M12.22 5.22a.75.75 0 011.06 0l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06l1.97-1.97-1.97-1.97a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Enable sounds</span>
          </>
        )}
      </button>

      {/* Debug info (remove in production) */}
      {soundContext && soundEnabled && (
        <div className="mt-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-xs text-white">
          <div>Time: {soundContext.localHour}:00 ({soundContext.timezone >= 0 ? '+' : ''}{soundContext.timezone})</div>
          <div>Context: {soundContext.soundContext}</div>
          <div>Intensity: {soundContext.intensity}</div>
          <div className="truncate">Track: {currentTrack}</div>
        </div>
      )}
    </div>
  )
}
