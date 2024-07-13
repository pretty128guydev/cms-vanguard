// In your custom _app.js or _document.js
// import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/service-worker.js').then(registration => {
  //       console.log('Service Worker registered with scope:', registration.scope);
  //     }).catch(error => {
  //       console.error('Service Worker registration failed:', error);
  //     });
  //   }
  // }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
