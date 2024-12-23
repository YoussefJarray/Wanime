import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestEpisodes, getMostPopularAnimes, getTrendingAnimes, getSpotlightAnimes } from '../api/Anime-API'; // Updated to include trending and spotlight
import Slider from '../components/Slider';

const AiringInfo = ({ anime }) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-300">
        Episodes: {anime.episodes.eps}
      </p>
      <p className="text-sm text-purple-300">
        {anime.episodes.sub ? 'Sub' : ''} {anime.episodes.dub ? 'Dub' : ''}
      </p>
    </div>
  );
};

const TrendingInfo = ({ anime }) => (
  <div className="space-y-1">
    <p className="text-sm text-purple-300">
      {anime.rated}
    </p>
    <p className="text-sm text-gray-300 truncate">
      {anime.duration}
    </p>
  </div>
);

function Home() {
  const [latestEpisodes, setLatestEpisodes] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [trendingData, setTrendingData] = useState([]); // Added state for trending data
  const [spotlightData, setSpotlightData] = useState([]); // Added state for spotlight data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestData, popularData, trendingData, spotlightData] = await Promise.all([
          getLatestEpisodes(),
          getMostPopularAnimes(),
          getTrendingAnimes(), // Fetch trending animes
          getSpotlightAnimes() // Fetch spotlight animes
        ]);
        setLatestEpisodes(latestData);
        setPopularData(popularData);
        setTrendingData(trendingData); // Set trending data
        setSpotlightData(spotlightData); // Set spotlight data
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
    <div className="container mx-auto p-8">
      {loading ? (
        <p className="text-lg text-center text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          {latestEpisodes && latestEpisodes.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Latest Episodes</h2>
              <div className="w-full">
                <Slider animes={latestEpisodes.map(anime => ({
                  id: anime.id,
                  title: { romaji: anime.name },
                  coverImage: { large: anime.img },
                  ...anime
                }))} groupId="latest-episodes" />
              </div>
            </div>
          )}

          {popularData && popularData.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Popular Now</h2>
              <div className="w-full">
                <Slider animes={popularData.map(anime => ({
                  id: anime.id,
                  title: { romaji: anime.name },
                  coverImage: { large: anime.img },
                  ...anime
                }))} groupId="popular-anime" />
              </div>
            </div>
          )}

          {trendingData && trendingData.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Trending Now</h2>
              <div className="w-full">
                <Slider animes={trendingData.map(anime => ({
                  id: anime.id,
                  title: { romaji: anime.name },
                  coverImage: { large: anime.img },
                  ...anime
                }))} groupId="trending-anime" />
              </div>
            </div>
          )}

          {spotlightData && spotlightData.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white">Spotlight Animes</h2>
              <div className="w-full">
                <Slider animes={spotlightData.map(anime => ({
                  id: anime.id,
                  title: { romaji: anime.name },
                  coverImage: { large: anime.img },
                  ...anime
                }))} groupId="spotlight-anime" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
