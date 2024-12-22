import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEpisodeSources, getAnimeEpisodes } from "../api/Anime-API";
import ReactPlayer from 'react-player';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';

function Episode() {
  const { id, episodeNumber } = useParams();
  const [videoSource, setVideoSource] = useState(null);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDubbed, setIsDubbed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [episodeId, setEpisodeId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSeek = (seconds) => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + seconds);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSubtitleChange = (track) => {
    setCurrentSubtitle(track);
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleMouseMove = () => {
      resetControlsTimeout();
    };

    const handleKeyDown = (e) => {
      if (e.key.startsWith('Arrow')) {
        resetControlsTimeout();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        setLogs([]);

        addLog("Fetching episode list...");
        const episodes = await getAnimeEpisodes(id);
        
        const episode = episodes.find(ep => ep.number === parseInt(episodeNumber));
        if (!episode) {
          throw new Error(`Episode ${episodeNumber} not found`);
        }
        
        setEpisodeId(episode.id);
        addLog(`Found episode ID: ${episode.id}`);

        addLog("Fetching video sources...");
        const sourceData = await getEpisodeSources(episode.id);
        
        if (sourceData.sources.length > 0) {
          setVideoSource(sourceData.sources[0]);
          addLog(`Loaded video source`);
          
          if (sourceData.tracks && sourceData.tracks.length > 0) {
            const formattedTracks = sourceData.tracks.map(track => ({
              kind: 'subtitles',
              src: track.file,
              srcLang: track.label?.split(' ')[0]?.toLowerCase() || 'en',
              label: track.label,
              default: track.default || false
            }));
            setSubtitleTracks(formattedTracks);
            setCurrentSubtitle(formattedTracks.find(track => track.default) || formattedTracks[0]);
            addLog(`Loaded ${formattedTracks.length} subtitle tracks`);
          }
        } else {
          throw new Error("No video sources found");
        }

      } catch (error) {
        console.error("Error fetching video:", error);
        addLog(`Error: ${error.message}`);
        setErrorMessage(error.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [id, episodeNumber]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">Error: {errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-scroll">
      {videoSource && (
        <FocusableGroup id="video-player-container" orientation="vertical" >
          <div className="w-full h-full relative " onMouseMove={resetControlsTimeout}>
            <ReactPlayer
              ref={playerRef}
              url={videoSource.url}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls={showControls}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "anonymous"
                  },
                  tracks: subtitleTracks,
                  forceVideo: true,
                  forceAudio: true
                }
              }}
            />
            
            {/* Back button - Top Left */}
            <div className={`absolute top-4 left-4 z-50 transition-opacity duration-300 
              ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <FocusableElement
                id={`back-button-${episodeId}`}
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg
                  hover:bg-white/20 focus:ring-2 focus:ring-purple-500
                  transition-all duration-200 shadow-lg"
                onFocus={() => setShowControls(true)}
              >
                Back
              </FocusableElement>
            </div>

          </div>
        </FocusableGroup>
      )}

      {!videoSource && (
        <div className="flex items-center justify-center h-full">
          <div className="text-yellow-500 text-xl">No video source available.</div>
        </div>
      )}
    </div>
  );
}

export default Episode;
