import type { Track } from '../types/mood.types';
import './TrackList.css';

interface TrackListProps {
  tracks: Track[];
}

// Spotify URL'den track ID'sini çıkaran yardımcı fonksiyon
const extractTrackId = (spotifyUrl: string): string | null => {
  try {
    const match = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// Spotify embed URL oluşturan fonksiyon
const spotifyEmbedUrl = (trackId: string) =>
  `https://open.spotify.com/embed/track/${trackId}`;

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
              
              {/* Spotify Embed Player */}
              {extractTrackId(track.spotify_url) && (
                <div className="track-card__player">
                  <iframe
                    src={spotifyEmbedUrl(extractTrackId(track.spotify_url)!)}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    title={`${track.title} - ${track.artist} Spotify Player`}
                    className="track-card__iframe"
                  />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

