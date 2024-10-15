import React, { useEffect, useState } from 'react';

const PersonailsedChatbot = () => {
  const [landbotLoaded, setLandbotLoaded] = useState(false);

  useEffect(() => {
    const initLandbot = () => {
      if (!landbotLoaded) {
        const script = document.createElement('script');
        script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';
        script.async = true;
        script.onload = () => {
          // @ts-ignore
          new window.Landbot.Popup({
            configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2629189-9TML8T54RK4D6G2M/index.json',
          });
          setLandbotLoaded(true);
        };
        document.body.appendChild(script);
      }
    };

    window.addEventListener('mouseover', initLandbot, { once: true });
    window.addEventListener('touchstart', initLandbot, { once: true });

    return () => {
      window.removeEventListener('mouseover', initLandbot);
      window.removeEventListener('touchstart', initLandbot);
    };
  }, [landbotLoaded]);

  return null; // This component doesn't render anything visible
};

export default PersonailsedChatbot;