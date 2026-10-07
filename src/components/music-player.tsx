import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from 'react';

type MusicPlayerProps = {
  title: string;
  artist: string;
  src?: string;
  label: string;
  playLabel: string;
  pauseLabel: string;
  seekLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  unavailableLabel: string;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

export function MusicPlayer({
  title,
  artist,
  src,
  label,
  playLabel,
  pauseLabel,
  seekLabel,
  muteLabel,
  unmuteLabel,
  unavailableLabel,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const canPlay = Boolean(src) && !hasError;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
  }, [src]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setHasError(true);
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const changeVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
    if (audio) {
      audio.volume = nextVolume;
      audio.muted = nextVolume === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const rangeStyle = { '--range-progress': `${progress}%` } as CSSProperties;
  const volumeStyle = { '--range-progress': `${isMuted ? 0 : volume * 100}%` } as CSSProperties;

  return (
    <div className={`music-player${canPlay ? '' : ' is-unavailable'}`}>
      <audio
        ref={audioRef}
        src={src || undefined}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => setHasError(true)}
      />

      <div className="music-player__art" aria-hidden="true">
        <span className="music-player__disc"><i>♪</i></span>
        <span className="music-player__number">01</span>
      </div>

      <div className="music-player__body">
        <p className="music-player__eyebrow"><span />{label}</p>
        <div className="music-player__heading">
          <h2>{title}</h2>
          <p>{artist}</p>
        </div>

        <div className="music-player__controls">
          <button
            className="music-player__play"
            type="button"
            onClick={togglePlayback}
            disabled={!canPlay}
            aria-label={isPlaying ? pauseLabel : playLabel}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg>
            )}
          </button>

          <div className="music-player__timeline">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={seek}
              disabled={!canPlay || !duration}
              aria-label={seekLabel}
              style={rangeStyle}
            />
            <div className="music-player__time"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          </div>

          <div className="music-player__volume">
            <button type="button" onClick={toggleMute} disabled={!canPlay} aria-label={isMuted ? unmuteLabel : muteLabel}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm12.5-.8v7.6a5 5 0 0 0 0-7.6z" />
              </svg>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={changeVolume}
              disabled={!canPlay}
              aria-label={isMuted ? unmuteLabel : muteLabel}
              style={volumeStyle}
            />
          </div>
        </div>

        {!canPlay && <p className="music-player__status">{unavailableLabel}</p>}
      </div>
    </div>
  );
}
