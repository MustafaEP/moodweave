import './Loading.css';

export const Loading = () => {
  return (
    <div className="loading-container">
      <div className="music-loader">
        <div className="music-bar"></div>
        <div className="music-bar"></div>
        <div className="music-bar"></div>
        <div className="music-bar"></div>
        <div className="music-bar"></div>
      </div>
      <div className="loading-text-container">
        <p className="loading-text">Ruh haliniz analiz ediliyor</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <p className="loading-subtitle">✨ Müzik önerileri hazırlanıyor</p>
    </div>
  );
};

