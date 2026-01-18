import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-content">
          <div className="layout__logo">
            <div className="layout__logo-wrapper">
              <img src="/moodweave.png" alt="MoodWeave Logo" className="layout__logo-image" />
              <div className="layout__logo-glow"></div>
            </div>
            <div className="layout__logo-text-wrapper">
              <h1 className="layout__logo-text">MoodWeave</h1>
              <div className="layout__logo-badge">AI-Powered</div>
            </div>
          </div>
          <p className="layout__subtitle">
            <span className="layout__subtitle-icon">🎵</span>
            Yapay Zeka ile Ruh Halinize Özel Müzik Önerileri
            <span className="layout__subtitle-icon">✨</span>
          </p>
          <div className="layout__features">
            <div className="layout__feature">
              <span className="layout__feature-icon">🧠</span>
              <span>Duygu Analizi</span>
            </div>
            <div className="layout__feature">
              <span className="layout__feature-icon">🎶</span>
              <span>Akıllı Öneri</span>
            </div>
            <div className="layout__feature">
              <span className="layout__feature-icon">🎧</span>
              <span>Spotify Entegrasyonu</span>
            </div>
          </div>
        </div>
        <div className="layout__header-wave"></div>
        <div className="layout__header-particles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <div className="layout__footer-content">
          <div className="layout__footer-section">
            <p className="layout__footer-text">
              &copy; 2026 MoodWeave. Tüm hakları saklıdır.
            </p>
            <p className="layout__footer-subtext">
              Yapay zeka destekli müzik öneri platformu
            </p>
          </div>
          <div className="layout__footer-links">
            <a href="https://github.com/MustafaEP" target="_blank" rel="noopener noreferrer" className="layout__footer-link">
              <span>GitHub</span>
            </a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="layout__footer-link">
              <span>Spotify</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

