const BASE_URL = "/api/aniwatch"; // Use the Vite proxy for clean API routing

const fetchWithCORS = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for cross-origin requests
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

// Utility function for mapping anime data
const mapAnimeData = (anime) => ({
  id: anime.id,
  name: anime.name,
  img: anime.img,
  episodes: {
    eps: anime.episodes?.eps,
    sub: anime.episodes?.sub,
    dub: anime.episodes?.dub,
  },
  duration: anime.duration,
  rated: anime.rated,
});

const getAllAnimeData = async () => {
  return await fetchWithCORS(BASE_URL);
};

const searchAnime = async (keyword, page = 1) => {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const data = await fetchWithCORS(`${BASE_URL}/search?keyword=${encodedKeyword}&page=${page}`);
    return {
      animes: data.animes.map(mapAnimeData),
      mostPopularAnimes: data.mostPopularAnimes.map(mapAnimeData),
      currentPage: data.currentPage,
      hasNextPage: data.hasNextPage,
      totalPages: data.totalPages,
      genres: data.genres,
    };
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
};

const getAnimeById = async (id) => {
  try {
    const data = await fetchWithCORS(`${BASE_URL}/anime/${id}`);
    return {
      info: {
        id: data.info.id,
        anime_id: data.info.anime_id,
        mal_id: data.info.mal_id,
        al_id: data.info.al_id,
        name: data.info.name,
        img: data.info.img,
        rating: data.info.rating,
        episodes: data.info.episodes,
        category: data.info.category,
        quality: data.info.quality,
        duration: data.info.duration,
        description: data.info.description
      },
      moreInfo: data.moreInfo,
      seasons: data.seasons,
      relatedAnimes: data.relatedAnimes,
      recommendedAnimes: data.recommendedAnimes,
      mostPopularAnimes: data.mostPopularAnimes
    };
  } catch (error) {
    console.error(`Error fetching anime with id "${id}":`, error);
    throw error;
  }
};

const getAnimeByCategory = async (category, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${category}?page=${page}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    return {
      animes: data.animes || [],
      top10Animes: {
        day: data.top10Animes?.day || [],
        week: data.top10Animes?.week || [],
        month: data.top10Animes?.month || [],
      },
      category: data.category,
      genres: data.genres || [],
      currentPage: data.currentPage,
      hasNextPage: data.hasNextPage,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error(`Error fetching anime by category "${category}":`, error);
    throw error;
  }
};



const fetchGeneric = async (key) => {
  try {
    const data = await getAllAnimeData();
    return data[key];
  } catch (error) {
    console.error(`Error fetching "${key}" data:`, error);
    throw error;
  }
};

// Generic functions for reusable logic
const getLatestEpisodes = () => fetchGeneric("latestEpisodes");
const getTrendingAnimes = () => fetchGeneric("trendingAnimes");
const getSpotlightAnimes = () => fetchGeneric("spotlightAnimes");
const getGenres = () => fetchGeneric("genres");
const getMostPopularAnimes = () => fetchGeneric("featuredAnimes.mostPopularAnimes");

const getAnimeEpisodes = async (animeId) => {
  try {
    const data = await fetchWithCORS(`${BASE_URL}/episodes/${animeId}`);
    return data.episodes.map(episode => ({
      id: episode.episodeId,
      number: episode.episodeNo,
      title: episode.name,
      isFiller: episode.filler
    }));
  } catch (error) {
    console.error(`Error fetching episodes for anime ${animeId}:`, error);
    throw error;
  }
};

const getEpisodeSources = async (episodeId) => {
  try {
    const data = await fetchWithCORS(`${BASE_URL}/episode-srcs?id=${episodeId}`);
    return {
      headers: data.headers,
      sources: data.sources.map((source) => ({
        url: source.url,
        isM3U8: source.isM3U8,
        quality: source.quality,
      })),
      tracks: data.tracks?.map((track) => ({
        file: track.file,
        label: track.label,
        kind: track.kind,
        default: track.default || false
      })) || [],
      intro: data.intro,
      outro: data.outro,
      anilistID: data.anilistID,
      malID: data.malID,
    };
  } catch (error) {
    console.error(`Error fetching episode sources for episode ${episodeId}:`, error);
    throw error;
  }
};

export {
  getAllAnimeData,
  searchAnime,
  getAnimeById,
  getAnimeByCategory,
  getLatestEpisodes,
  getTrendingAnimes,
  getSpotlightAnimes,
  getGenres,
  getMostPopularAnimes,
  getAnimeEpisodes,
  //getServers,
  getEpisodeSources,
};
