// pages/Trending.jsx
import React, { useState, useEffect } from 'react';
import { getGenres, getTrendingAnime } from '../api/anilist';
import Slider from '../components/Slider';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';

function Trending() {
  const [genres, setGenres] = useState([]);
  const [genreAnime, setGenreAnime] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        setError('Failed to fetch genres');
        console.error(err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchAnimeForGenres = async () => {
      setLoading(true);
      try {
        const animeByGenre = {};
        for (const genre of genres) {
          const anime = await getTrendingAnime(1, 10, genre);
          if (anime.length > 0) {
            animeByGenre[genre] = anime;
          }
        }
        setGenreAnime(animeByGenre);
      } catch (err) {
        setError('Failed to fetch anime');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (genres.length > 0) {
      fetchAnimeForGenres();
    }
  }, [genres]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Trending Anime</h1>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(genreAnime).map(([genre, animes]) => (
            <div key={genre}>
              <h2 className="text-2xl font-semibold mb-4 text-white">{genre}</h2>
              <Slider animes={animes} groupId={`slider-${genre}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trending;