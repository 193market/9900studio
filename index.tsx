import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { LanguageProvider } from './contexts/LanguageContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  // App이 정상 작동하기 위해 필요한 Context Provider들은 유지합니다.
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found in index.html");
}