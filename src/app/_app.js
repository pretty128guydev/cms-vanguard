// In your custom _app.js or _document.js
// import { useEffect } from 'react';
import Head from 'next/head';

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
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            console.log('register serviceWorker in navigator')
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service worker registration failed:', error);
                });
        });
    }

    return (
        <>
            <Head>
                <link rel="manifest" href="/manifest.json" />
                {/* Other meta tags, title, stylesheets, etc. */}
            </Head>
            <Component {...pageProps} />;
        </>
    )

}

export default MyApp;
