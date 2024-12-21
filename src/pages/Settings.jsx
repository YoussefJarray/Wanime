// pages/Settings.jsx
import React, { useState } from 'react';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';

function Settings() {
  const [autoplay, setAutoplay] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [volume, setVolume] = useState(100);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Settings</h1>

      <FocusableGroup id="settings-group">
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Playback Settings</h2>
            
            <div className="space-y-4">
              <FocusableElement
                className="flex items-center justify-between"
                onClick={() => setAutoplay(!autoplay)}
              >
                <span className="text-gray-200">Autoplay Next Episode</span>
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${autoplay ? 'bg-purple-600' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white m-1 transition-transform duration-200 ${autoplay ? 'translate-x-6' : ''}`} />
                </div>
              </FocusableElement>

              <div className="space-y-2">
                <label className="text-gray-200">Volume</label>
                <FocusableElement>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </FocusableElement>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Appearance</h2>
            <FocusableElement
              className="flex items-center justify-between"
              onClick={() => setDarkMode(!darkMode)}
            >
              <span className="text-gray-200">Dark Mode</span>
              <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-purple-600' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white m-1 transition-transform duration-200 ${darkMode ? 'translate-x-6' : ''}`} />
              </div>
            </FocusableElement>
          </div>

          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>Made with ❤️ by Your Name</p>
            <p className="mt-1">Powered by AniList API</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </FocusableGroup>
    </div>
  );
}

export default Settings;