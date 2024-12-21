import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeDetails } from '../api/anilist';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';

function AnimeDetail() {
  const { id } = useParams(); // Get anime ID from URL
  const [anime, setAnime] = useState(null); // State to store anime data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const data = await getAnimeDetails(id); // Fetch anime details using the ID
        setAnime(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError('Failed to load anime details');
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  // TV-friendly UI design: Larger fonts, simple layout
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-red-600">{error}</h2>
      </div>
    );
  }

  const handleEpisodeClick = (episodeNumber) => {
    // Implement the action to watch the selected episode
    console.log(`Watch episode ${episodeNumber}`);
    // You could navigate to a new route or trigger a modal to show the episode
    navigate(`/watch/${id}/episode/${episodeNumber}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-grow ml-16 overflow-y-auto text-white p-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-8">
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              className="rounded-lg w-72 h-auto"
            />
          </div>
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{anime.title.romaji}</h1>
            <h2 className="text-xl font-semibold mb-4">
              {anime.title.english || 'No English Title Available'}
            </h2>
            <p className="text-lg mb-4">{anime.description || 'No description available.'}</p>
            <p className="text-md font-semibold">Genres:</p>
            <ul className="mb-4">
              {anime.genres.map((genre, index) => (
                <li key={index} className="text-lg">{genre}</li>
              ))}
            </ul>
            <p className="text-md font-semibold">Episodes: {anime.episodes}</p>
            <p className="text-md font-semibold">Status: {anime.status}</p>

            {/* Episode list */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">Episodes</h3>
              <div className="max-h-[60vh] overflow-y-auto">
                <FocusableGroup id="episode-group" saveLast className="space-y-4">
                  {anime.episodes &&
                    Array.from({ length: anime.episodes }).map((_, index) => {
                      const episodeNumber = index + 1;
                      return (
                        <FocusableElement
                          key={episodeNumber}
                          id={`episode-${episodeNumber}`}
                          as="button"
                          className="text-xl bg-gray-700 p-4 rounded-lg w-full focus:bg-slate-600"
                          onKeyDown={(e) => {
                            if (e.code === 'Enter') {
                              handleEpisodeClick(episodeNumber);
                            }
                          }}
                        >
                          Episode {episodeNumber}
                        </FocusableElement>
                      );
                    })}
                </FocusableGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail;
