// Sound utilities for UI interactions

let buttonClickAudio: HTMLAudioElement | null = null

// Initialize audio files
if (typeof window !== 'undefined') {
  buttonClickAudio = new Audio('/info-notification.mp3')
  buttonClickAudio.volume = 0.4
  buttonClickAudio.preload = 'auto'
}

function createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio context not available')
  }
}

export function playHoverSound(): void {
  try {
    // Create a new audio instance each time to allow multiple sounds to play simultaneously
    const audio = new Audio('/glass-tick.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {
      // Silently fail if audio cannot play (e.g., autoplay restrictions)
    })
  } catch (error) {
    // Fallback to tone if audio file fails
    createTone(400, 0.05, 'sine')
  }
}

export function playClickSound(): void {
  createTone(600, 0.08, 'sine')
}

export function playButtonClickSound(): void {
  try {
    if (buttonClickAudio) {
      buttonClickAudio.currentTime = 0
      buttonClickAudio.play().catch(() => {
        // Silently fail if audio cannot play (e.g., autoplay restrictions)
      })
    }
  } catch (error) {
    // Fallback to tone if audio file fails
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(500, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }
}

