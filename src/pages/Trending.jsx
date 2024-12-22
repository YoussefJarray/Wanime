import React, { useState, useEffect } from 'react';
import Slider from '../components/Slider';
import { getAnimeByCategory } from '../api/Anime-API'; // Importing the API function

const genres = ['tv', 'movie', 'most-popular', 'top-airing', 'events']; // Kebab-case genres

const TrendingPage = () => {
  const [genreAnimes, setGenreAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        setLoading(true);
        const fetchedGenres = await Promise.all(
          genres.map(async (genre) => {
            const data = await getAnimeByCategory(genre, 1);
            return { genre, animes: data.animes };
          })
        );
        setGenreAnimes(fetchedGenres);
      } catch (err) {
        setError('Failed to fetch genre animes. Please try again later.');
        console.error('Error fetching genre animes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      {loading ? (
        <p className="text-lg text-center text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-white">Browse by Genres</h1>
          {genreAnimes.map(({ genre, animes }) => (
            <div key={genre} className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white capitalize">{genre}</h2>
              {animes && animes.length > 0 ? (
                <Slider
                  animes={animes.map((anime) => ({
                    id: anime.id,
                    title: { romaji: anime.name },
                    coverImage: { large: anime.img },
                    ...anime,
                  }))}
                  groupId={`slider-${genre}`}
                />
              ) : (
                <p className="text-gray-400">No animes found for this genre.</p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TrendingPage;
