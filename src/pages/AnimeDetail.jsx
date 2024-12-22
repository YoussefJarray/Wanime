import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeById } from '../api/Anime-API';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const data = await getAnimeById(id);
        setAnime({
          title: {
            romaji: data.info.name,
            english: data.info.name
          },
          description: data.info.description || 'No description available.',
          coverImage: {
            large: data.info.img
          },
          genres: data.moreInfo?.genres || [],
          episodes: data.info.episodes?.eps || 0, // Access eps property
          status: data.info.status || 'Unknown',
          category: data.info.category
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load anime details');
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

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
    navigate(`/watch/${id}/episode/${episodeNumber}`);
  };

  const toggleSynopsis = () => {
    setExpanded((prevState) => !prevState);
  };

  const handleKeyPress = (e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      toggleSynopsis();
    }
  };

  return (
    <div className="relative h-screen overflow-hidden p-8 px-10">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={anime.coverImage.large}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{anime.title.romaji}</h1>
          <h2 className="text-2xl font-semibold mb-6 text-gray-300">
            {anime.title.english || 'No English Title Available'}
          </h2>

          {/* Synopsis */}
          <div className="max-w-3xl mb-8">
            <p className={`text-lg leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
              {anime.description || 'No description available.'}
            </p>

            <FocusableGroup id={`synopsis-group-${id}`}>
              <FocusableElement
                id={`synopsis-toggle-${id}`}
                as="button"
                className="mt-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg
                  hover:bg-purple-600/30 focus:bg-purple-600/40 focus:ring-2 
                  focus:ring-purple-500 focus:outline-none transition-all duration-200"
                onKeyDown={handleKeyPress}
                onClick={toggleSynopsis}
                role="button"
                tabIndex={0}
              >
                {expanded ? 'Show Less' : 'Read More'}
              </FocusableElement>
            </FocusableGroup>
          </div>

          <div className="mb-8">
            <div className="flex gap-4 flex-wrap mb-4">
              {anime.genres.map((genre, index) => (
                <FocusableGroup id={`genre-group-${index}-${id}`} key={index}>
                  <FocusableElement
                    id={`genre-${index}-${id}`}
                    className="px-3 py-1 bg-purple-600/20 rounded-full text-sm"
                  >
                    {genre}
                  </FocusableElement>
                </FocusableGroup>
              ))}
            </div>
            <p className="text-lg">Episodes: {anime.episodes} • Status: {anime.status} • Category: {anime.category}</p>
          </div>

          {/* Episodes Swiper */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Episodes</h3>
            <div className="relative">
              <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={16}
                slidesPerView={4}
                navigation
                className="w-full"
              >
                {anime.episodes > 0 &&
                  Array.from({ length: anime.episodes }).map((_, index) => {
                    const episodeNumber = index + 1;
                    return (
                      <SwiperSlide key={episodeNumber}>
                        <FocusableGroup id={`episode-group-${episodeNumber}-${id}`}>
                          <FocusableElement
                            id={`episode-${episodeNumber}-${id}`}
                            as="button"
                            className="w-full h-24 bg-gray-800/60 rounded-lg
                              hover:bg-gray-700/60 focus:bg-purple-600/40 focus:ring-2
                              focus:ring-purple-500 focus:outline-none transition-all duration-200
                              flex items-center justify-center text-lg font-medium"
                            onKeyDown={(e) => {
                              if (e.code === 'Enter') {
                                handleEpisodeClick(episodeNumber);
                              }
                            }}
                            onClick={() => handleEpisodeClick(episodeNumber)}
                          >
                            Episode {episodeNumber}
                          </FocusableElement>
                        </FocusableGroup>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail;
