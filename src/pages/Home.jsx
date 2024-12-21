import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAiringAnime, getTrendingAnime } from '../api/anilist';
import Slider from '../components/Slider';

const AiringInfo = ({ anime }) => {
  const formatTimeUntilAiring = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    
    return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  };

  return anime.nextAiringEpisode ? (
    <div className="space-y-1">
      <p className="text-sm text-gray-300">
        Episode {anime.nextAiringEpisode.episode}
      </p>
      <p className="text-sm text-purple-300">
        Airs in: {formatTimeUntilAiring(anime.nextAiringEpisode.timeUntilAiring)}
      </p>
    </div>
  ) : (
    <p className="text-sm text-gray-400">No upcoming episodes</p>
  );
};

const TrendingInfo = ({ anime }) => (
  <div className="space-y-1">
    <p className="text-sm text-purple-300">
      Score: {anime.averageScore}%
    </p>
    <p className="text-sm text-gray-300 truncate">
      {anime.genres.slice(0, 2).join(', ')}
    </p>
  </div>
);

function Home() {
  const [airingAnime, setAiringAnime] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airingData, trendingData] = await Promise.all([
          getAiringAnime(),
          getTrendingAnime()
        ]);
        setAiringAnime(airingData);
        setTrendingAnime(trendingData);
      } catch (err) {
        setError('Failed to fetch anime data. Please try again later.');
        console.error('Error fetching anime:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 pb-12">
      {loading ? (
        <p className="text-lg text-center text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          {airingAnime.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Currently Airing</h2>
              <div className="w-full">
                <Slider animes={airingAnime} groupId="airing-anime" />
              </div>
            </div>
          )}

          {trendingAnime.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Trending Now</h2>
              <div className="w-full">
                <Slider animes={trendingAnime} groupId="trending-anime" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
