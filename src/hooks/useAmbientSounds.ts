// hooks/useAmbientSounds.ts
'use client'

import { useEffect, useState } from 'react'
import * as fcl from '@onflow/fcl'

interface SoundContext {
  isDaytime: boolean
  timeContext: string
  localHour: number
  timezone: number
  soundContext: string
  intensity: string
  hasProfile: boolean
}

// Map sound contexts to your audio files in /public/music/
const SOUND_MAP = {
  dawn: null,                         // Silent for now
  day: null,                          // Silent for now
  dusk: null,                         // Silent for now
  evening: '/music/the-freaks.mp3',   // PM shift - The Freaks house ambience
  night: '/music/the-freaks.mp3',     // Night sounds - The Freaks house
  'deep-night': '/music/the-freaks.mp3', // Deep night - The Freaks house
  'pre-dawn': '/music/the-freaks.mp3',   // Pre-dawn - The Freaks house
}

// Volume levels based on intensity
const VOLUME_MAP = {
  low: 0.3,
  medium: 0.5,
  high: 0.7,
}

export function useAmbientSounds(userAddress: string | null, enabled: boolean = true) {
  const [soundContext, setSoundContext] = useState<SoundContext | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Fetch sound context from blockchain
  useEffect(() => {
    if (!userAddress || !enabled) return

    const fetchSoundContext = async () => {
      try {
        const result = await fcl.query({
          cadence: `
            import ParadiseMotel from 0x807c3d470888cc48
            import SemesterZero from 0x807c3d470888cc48

            access(all) fun main(userAddress: Address): {String: AnyStruct} {
              let account = getAccount(userAddress)
              let profileRef = account.capabilities
                .get<&SemesterZero.UserProfile>(SemesterZero.UserProfilePublicPath)
                .borrow()

              let timestamp = getCurrentBlock().timestamp
              let utcHour = Int((timestamp / 3600.0) % 24.0)

              if profileRef == nil {
                let defaultIsDaytime = utcHour >= 6 && utcHour < 18
                return {
                  "isDaytime": defaultIsDaytime,
                  "timeContext": defaultIsDaytime ? "day" : "night",
                  "localHour": utcHour,
                  "timezone": 0,
                  "hasProfile": false,
                  "soundContext": defaultIsDaytime ? "day" : "night",
                  "intensity": "medium"
                }
              }

              let profile = profileRef!
              let timezone = profile.timezone
              var localHour = utcHour + timezone

              if localHour < 0 {
                localHour = localHour + 24
              } else if localHour >= 24 {
                localHour = localHour - 24
              }

              let isDaytime = ParadiseMotel.isDaytimeForTimezone(timezone: timezone)
              
              var soundContext = "day"
              if isDaytime {
                if localHour >= 6 && localHour < 8 {
                  soundContext = "dawn"
                } else if localHour >= 8 && localHour < 17 {
                  soundContext = "day"
                } else {
                  soundContext = "dusk"
                }
              } else {
                if localHour >= 18 && localHour < 22 {
                  soundContext = "evening"
                } else if localHour >= 22 || localHour < 2 {
                  soundContext = "night"
                } else if localHour >= 2 && localHour < 5 {
                  soundContext = "deep-night"
                } else {
                  soundContext = "pre-dawn"
                }
              }

              var intensity = "medium"
              if isDaytime {
                if localHour >= 6 && localHour < 8 {
                  intensity = "low"
                } else if localHour >= 8 && localHour < 12 {
                  intensity = "medium"
                } else if localHour >= 12 && localHour < 17 {
                  intensity = "high"
                } else {
                  intensity = "medium"
                }
              } else {
                if localHour >= 18 && localHour < 20 {
                  intensity = "medium"
                } else if localHour >= 20 || localHour < 4 {
                  intensity = "high"
                } else {
                  intensity = "low"
                }
              }

              return {
                "isDaytime": isDaytime,
                "timeContext": isDaytime ? "day" : "night",
                "localHour": localHour,
                "timezone": timezone,
                "hasProfile": true,
                "soundContext": soundContext,
                "intensity": intensity
              }
            }
          `,
          args: (arg, t) => [arg(userAddress, t.Address)],
        })

        setSoundContext(result as SoundContext)
      } catch (error) {
        console.error('Failed to fetch sound context:', error)
      }
    }

    fetchSoundContext()
    // Refresh every hour
    const interval = setInterval(fetchSoundContext, 3600000)
    return () => clearInterval(interval)
  }, [userAddress, enabled])

  // Update audio when sound context changes
  useEffect(() => {
    if (!soundContext || !enabled) return

    const soundFile = SOUND_MAP[soundContext.soundContext as keyof typeof SOUND_MAP]
    
    // Skip if no sound file for this time
    if (!soundFile) {
      if (audio) {
        audio.pause()
        setIsPlaying(false)
      }
      return
    }
    
    const volume = VOLUME_MAP[soundContext.intensity as keyof typeof VOLUME_MAP]

    // Create or update audio
    if (!audio) {
      const newAudio = new Audio(soundFile)
      newAudio.loop = true
      newAudio.volume = volume
      setAudio(newAudio)
    } else if (audio.src !== window.location.origin + soundFile) {
      // Change track if different
      audio.pause()
      audio.src = soundFile
      audio.volume = volume
      if (isPlaying) {
        audio.play().catch(console.error)
      }
    } else {
      // Just update volume
      audio.volume = volume
    }
  }, [soundContext, enabled])

  // Play/pause controls
  const play = () => {
    if (audio) {
      audio.play().catch(console.error)
      setIsPlaying(true)
    }
  }

  const pause = () => {
    if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const toggle = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  return {
    soundContext,
    isPlaying,
    play,
    pause,
    toggle,
    currentTrack: soundContext ? SOUND_MAP[soundContext.soundContext as keyof typeof SOUND_MAP] : null,
  }
}
