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
            <img src="/moodweave.png" alt="MoodWeave Logo" className="layout__logo-image" />
            <h1 className="layout__logo-text">MoodWeave</h1>
          </div>
          <p className="layout__subtitle">AI ile Ruh Haline Göre Müzik Keşfet</p>
        </div>
        <div className="layout__header-wave"></div>
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <p>&copy; 2024 MoodWeave. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

