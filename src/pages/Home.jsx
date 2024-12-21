import React, { useState, useEffect, useRef } from 'react';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';
import { useNavigate } from 'react-router-dom';
import { getAiringAnime } from '../api/anilist';

function Home() {
  const navigate = useNavigate();
  const [airingAnime, setAiringAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAiringAnime();
        setAiringAnime(data);
      } catch (err) {
        setError('Failed to fetch airing anime. Please try again later.');
        console.error('Error fetching airing anime:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  function formatTimeUntilAiring(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
  
    return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  }
  

  return (
    <div className="mx-auto px-4 overflow">
      <h1 className="text-3xl font-bold mb-6">Airing Anime</h1>

      {loading ? (
        <p className="text-lg text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : airingAnime.length > 0 ? (
        <FocusableGroup
        id="group-1"
        className="w-[65%] flex gap-4 overflow-auto snap-x rounded-md"
        onFocus={(event) => {
          // Accessing the element itself and scrolling to the left
          event.target.scrollLeft = 0;  // Scroll to the leftmost position
        }}
      >
        {airingAnime.map((anime, index) => (
          <FocusableElement
            key={anime.id}
            id={`anime-${index}`}
            className="flex-shrink-0 p-4  bg-slate-800 focus:bg-purple-900 rounded-md flex flex-col justify-between items-center w-48 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              scrollSnapAlign: 'start',
            }}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                navigate(`/anime/${anime.id}`);
              }
            }}
          >
            <img
              src={anime.coverImage.medium}
              alt={anime.title.romaji}
              className="w-32 h-40 rounded-md"
            />
            <div className="text-center mt-2">
              <h3 className="text-lg font-semibold">{anime.title.romaji}</h3>
              {anime.nextAiringEpisode ? (
                <>
                  <p className="text-sm">
                    Episode {anime.nextAiringEpisode.episode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Airs in: {formatTimeUntilAiring(anime.nextAiringEpisode.timeUntilAiring)} 
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">No upcoming episodes</p>
              )}
            </div>
          </FocusableElement>
        ))}
      </FocusableGroup>
      ) : (
        <p className="text-lg text-center">No airing anime available.</p>
      )}
    </div>
  );
}

export default Home;
