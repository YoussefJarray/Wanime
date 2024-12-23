import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEpisodeSources, getAnimeEpisodes } from "../api/Anime-API";
import { TVPlayer } from 'react-tv-player'; // Changed to react-tv-player
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';

function Episode() {
  const { id, episodeNumber } = useParams();
  const [videoSource, setVideoSource] = useState(null);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [episodeId, setEpisodeId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
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
        console.log("Source Data:", sourceData); // Log the response from getEpisodeSources
        
        if (sourceData.sources.length > 0) {
          setVideoSource(sourceData.sources[0].url); // Store the source URL
          addLog(`Loaded video source`);
          
          if (sourceData.tracks && sourceData.tracks.length > 0) {
            const formattedTracks = sourceData.tracks.map(track => ({
              kind: track.kind || 'subtitles',
              src: track.file,
              srcLang: track.label?.split(' ')[0]?.toLowerCase() || 'en',
              label: track.label,
              default: track.default || false
            }));
            setSubtitleTracks(formattedTracks);
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

  // Find the English track
  const englishTrack = subtitleTracks.find(track => track.label === 'English');

  return (
    <div className="fixed inset-0 bg-black overflow-scroll">
      {videoSource && (
        <FocusableGroup id="video-player-container" orientation="vertical" >
          <div className="w-full h-full relative " onMouseMove={resetControlsTimeout}>
            <TVPlayer
              ref={playerRef}
              url={videoSource} // Use the stored source URL
              autoPlay={true}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "true",
                  },
                  tracks: subtitleTracks.length > 0 ? subtitleTracks : englishTrack ? [englishTrack] : [],
                },
              }}
            />

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
