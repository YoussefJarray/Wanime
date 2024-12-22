import React, { useState, useEffect, useRef } from 'react';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';
import { useNavigate } from 'react-router-dom';
import { searchAnime } from '../api/Anime-API';
import Slider from '../components/Slider';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    animes: [],
    mostPopularAnimes: [],
    currentPage: 1,
    hasNextPage: false,
    totalPages: 1,
    genres: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
    ['Space', 'Clear']
  ];

  const handleKeyPress = (key, e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      switch(key) {
        case 'Space':
          setSearchTerm(prev => prev + ' ');
          break;
        case 'Backspace':
          setSearchTerm(prev => prev.slice(0, -1));
          break;
        case 'Clear':
          setSearchTerm('');
          break;
        default:
          setSearchTerm(prev => prev + key);
      }
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults({
          animes: [],
          mostPopularAnimes: [],
          currentPage: 1,
          hasNextPage: false,
          totalPages: 1,
          genres: []
        });
        return;
      }

      setLoading(true);
      try {
        const results = await searchAnime(searchTerm.trim());
        setSearchResults(results);
      } catch (err) {
        setError('Failed to search anime. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="mx-auto p-8 overflow-y-auto h-screen w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Search Anime</h1>
      
      <div className="mb-8">
        <input
          type="text"
          value={searchTerm}
          readOnly
          className="w-full p-4 rounded-lg bg-gray-800 text-white border border-purple-500 focus:outline-none"
          placeholder="Use keyboard below to search..."
        />
      </div>

      <FocusableGroup id="keyboard-group">
        <div className="mb-8 space-y-2">
          {keyboard.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((key) => (
                <FocusableGroup key={key} id={`key-group-${key}`}>
                  <FocusableElement
                    id={`key-${key}`}
                    onKeyDown={(e) => handleKeyPress(key, e)}
                    className={`
                      px-6 py-4 bg-gray-800 text-white rounded-lg
                      hover:bg-purple-600 
                      focus:outline-none focus:ring-2 focus:ring-purple-500
                      cursor-pointer transition-all duration-200
                      ${key === 'Space' || key === 'Clear' || key === 'Backspace' ? 'px-8' : ''}
                    `}
                  >
                    {key}
                  </FocusableElement>
                </FocusableGroup>
              ))}
            </div>
          ))}
        </div>
      </FocusableGroup>

      {loading ? (
        <p className="text-lg text-center text-white">Searching...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : searchResults.animes.length > 0 ? (
        <>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Search Results</h2>
            <Slider 
              animes={searchResults.animes.map(anime => ({
                id: anime.id,
                title: { romaji: anime.name },
                coverImage: { large: anime.img },
                ...anime
              }))} 
              groupId="search-results-group" 
            />
          </div>
          {searchResults.mostPopularAnimes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Most Popular</h2>
              <Slider 
                animes={searchResults.mostPopularAnimes.map(anime => ({
                  id: anime.id,
                  title: { romaji: anime.name },
                  coverImage: { large: anime.img },
                  ...anime
                }))} 
                groupId="popular-results-group" 
              />
            </div>
          )}
        </>
      ) : searchTerm && (
        <p className="text-lg text-center text-white">No results found</p>
      )}
    </div>
  );
}

export default Search;