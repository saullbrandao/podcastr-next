import { RefObject, useEffect, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'

type VolumeControlProps = {
  audioRef: RefObject<HTMLAudioElement>;
  disabled: boolean;
}

export function VolumeControl({ audioRef, disabled }: VolumeControlProps) {

  const [volumeIcon, setVolumeIcon] = useState('/volume-medium.svg')
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [volume, setVolume] = useState(0.5)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [])

  useEffect(() => {
    if (volume > 0.66) return setVolumeIcon('/volume-high.svg')
    if (volume > 0.33) return setVolumeIcon('/volume-medium.svg')
    if (volume > 0) return setVolumeIcon('/volume-low.svg')
    setVolumeIcon('/volume-mute.svg')
  }, [volume])

  function handleVolume(amount: number) {
    audioRef.current.volume = amount
    setVolume(amount)
  }

  return (
    <button
      type='button'
      disabled={disabled}
      className={styles.volumeButton}
      onMouseEnter={() => setShowVolumeSlider(true)}
    >      <img
        src={volumeIcon}
        alt="Volume"
      />
      {showVolumeSlider &&
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
      }
    </button>
  )
}