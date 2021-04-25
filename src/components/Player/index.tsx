import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'


export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [volumeIcon, setVolumeIcon] = useState('/volume-medium.svg')
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayerState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
  } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) return;
    handleVolume(volume)
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (volume > 0.66) return setVolumeIcon('/volume-high.svg')
    if (volume > 0.33) return setVolumeIcon('/volume-medium.svg')
    if (volume > 0) return setVolumeIcon('/volume-low.svg')
    setVolumeIcon('/volume-mute.svg')
  }, [volume])

  function setupProgressListener() {
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  function handleVolume(amount: number) {
    audioRef.current.volume = amount
    setVolume(amount)
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {
        episode ? (<div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit='cover' />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>) : (<div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>)
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                value={progress}
                onChange={handleSeek}
                max={episode.duration}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type='button'
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type='button'
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type='button'
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? <img src="/pause.svg" alt="Tocar" /> : <img src="/play.svg" alt="Tocar" />}
          </button>
          <button
            type='button'
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar proximo" />
          </button>
          <button
            type='button'
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>

          <button
            type='button'
            disabled={!episode}
            className={styles.volumeButton}
            onMouseEnter={() => setShowVolumeSlider(true)}
          >
            {
              showVolumeSlider && episode ?
                <div
                  className={styles.volumeSlider}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >

                  <Slider
                    value={volume}
                    max={1}
                    vertical={true}
                    step={0.01}
                    onChange={handleVolume}
                    trackStyle={{ backgroundColor: '#04d361' }}
                    railStyle={{ backgroundColor: '#9f75ff' }}
                    handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                  />
                </div>
                :

                <img
                  src={volumeIcon}
                  alt="Volume"
                />
            }
          </button>

        </div>
      </footer>
    </div >
  )
}