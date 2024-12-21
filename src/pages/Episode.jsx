import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';
import { searchAnimeById } from '../api/anilist';

const Episode = () => {
  const { id, episode } = useParams();
  const navigate = useNavigate();
  const [animeTitle, setAnimeTitle] = useState('');
  const [torrentUrl, setTorrentUrl] = useState('');
  const [status, setStatus] = useState('Loading player...');
  const [showStatus, setShowStatus] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Get anime details from AniList
  useEffect(() => {
    const getAnimeDetails = async () => {
      try {
        const animeDetails = await searchAnimeById(parseInt(id));
        const title = animeDetails.title.english || animeDetails.title.romaji;
        setAnimeTitle(title);

        setStatus('Searching for episode...');
        // Search Nyaa.si for the torrent
        const searchTerm = `${title} - ${episode}`;
        const nyaaResponse = await axios.get(`/api/nyaa/search`, {
          params: { 
            term: searchTerm,
            filter: 'trusted_only'
          }
        });

        if (nyaaResponse.data.length > 0) {
          setStatus('Found episode, preparing video...');
          setTorrentUrl(nyaaResponse.data[0].magnet);
        } else {
          throw new Error('No torrents found');
        }

      } catch (err) {
        setError(err.message);
        setShowStatus(false);
      }
    };

    getAnimeDetails();
  }, [id, episode]);

  // Handle torrent streaming once we have the magnet URL
  useEffect(() => {
    if (!torrentUrl) return;

    const loadTorrent = async () => {
      try {
        // Dynamically import WebTorrent to avoid SSR issues
        const WebTorrent = (await import('webtorrent')).default;
        const client = new WebTorrent();
        
        client.add(torrentUrl, (torrent) => {
          setStatus('Loading video stream...');
          
          // Find the largest file (likely the video)
          const file = torrent.files.reduce((a, b) => 
            a.length > b.length ? a : b
          );

          file.streamURL = URL.createObjectURL(new Blob([], { type: 'video/mp4' }));
          file.createReadStream().on('data', () => {
            if (!isReady) {
              setIsReady(true);
              setStatus('Ready to play!');
              setTimeout(() => setShowStatus(false), 1500);
            }
          });
        });

        return () => {
          client.destroy();
        };
      } catch (err) {
        setError(err.message);
        setShowStatus(false);
      }
    };

    loadTorrent();
  }, [torrentUrl]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FocusableGroup>
      <div className="episode-player" role="region" aria-label="Episode player">
        <nav>
          <FocusableElement onSelect={() => navigate(-1)}>
            <button 
              className="back-button"
              aria-label="Go back"
              style={{
                padding: '8px 16px',
                margin: '16px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          </FocusableElement>
        </nav>
        <h1>{animeTitle} - Episode {episode}</h1>
        <ReactPlayer
          url={isReady ? torrentUrl : null}
          playing={isReady}
          controls={true}
          width="100%"
          height="auto"
          config={{
            file: {
              attributes: {
                autoPlay: true,
                playsInline: true,
              },
              forceVideo: true,
            }
          }}
        />
        {showStatus && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '5px'
          }}>
            {status}
          </div>
        )}
      </div>
    </FocusableGroup>
  );
};

export default Episode;
