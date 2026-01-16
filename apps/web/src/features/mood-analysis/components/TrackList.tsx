import type { Track } from '../types/mood.types';
import './TrackList.css';

interface TrackListProps {
  tracks: Track[];
}

export const TrackList = ({ tracks }: TrackListProps) => {
  return (
    <div className="track-list">
      <h3 className="track-list__title">Önerilen Şarkılar 🎶</h3>
      <div className="track-list__grid">
        {tracks.map((track, index) => (
          <div key={index} className="track-card">
            {track.image && (
              <img
                src={track.image}
                alt={track.title}
                className="track-card__image"
              />
            )}
            <div className="track-card__content">
              <h4 className="track-card__title">{track.title}</h4>
              <p className="track-card__artist">{track.artist}</p>
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="track-card__link"
              >
                Spotify'da Aç →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

