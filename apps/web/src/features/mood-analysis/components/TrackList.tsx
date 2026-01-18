import type { Track } from '../types/mood.types';
import './TrackList.css';

interface TrackListProps {
  tracks: Track[];
}

export const TrackList = ({ tracks }: TrackListProps) => {
  return (
    <div className="track-list">
      <div className="track-list__header">
        <h3 className="track-list__title">
          <span className="track-list__icon">🎵</span>
          Size Özel Müzik Önerileri
          <span className="track-list__icon">🎵</span>
        </h3>
        <p className="track-list__subtitle">
          Ruh halinize uygun {tracks.length} şarkı bulundu
        </p>
      </div>
      
      <div className="track-list__grid">
        {tracks.map((track, index) => (
          <article key={index} className="track-card">
            <div className="track-card__number">{index + 1}</div>
            {track.image && (
              <div className="track-card__image-wrapper">
                <img
                  src={track.image}
                  alt={track.title}
                  className="track-card__image"
                  loading="lazy"
                />
                <div className="track-card__overlay">
                  <span className="track-card__play-icon">▶</span>
                </div>
              </div>
            )}
            <div className="track-card__content">
              <div className="track-card__info">
                <h4 className="track-card__title">{track.title}</h4>
                <p className="track-card__artist">{track.artist}</p>
              </div>
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="track-card__link"
                aria-label={`${track.title} şarkısını Spotify'da dinle`}
              >
                <svg 
                  className="track-card__spotify-icon"
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span>Spotify'da Dinle</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

