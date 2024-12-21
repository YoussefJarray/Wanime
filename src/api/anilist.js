import axios from 'axios';

const ANILIST_API = 'https://graphql.anilist.co';

// Configure axios with CORS headers and retry logic
const client = axios.create({
  baseURL: ANILIST_API,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor for rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

client.interceptors.request.use(async (config) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    console.log(`Rate limiting in effect - waiting ${MIN_REQUEST_INTERVAL - timeSinceLastRequest}ms`);
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return config;
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for retries
client.interceptors.response.use(null, async (error) => {
  const { config, response } = error;
  
  if (!response) {
    console.error('Network error - no response received');
    return Promise.reject(error);
  }

  console.error(`Request failed with status ${response.status}:`, response.data);
  
  // Only retry on specific error codes
  if (response.status === 429 || response.status === 500) {
    config.retryCount = config.retryCount || 0;
    
    if (config.retryCount < 3) {
      config.retryCount += 1;
      
      // Exponential backoff
      const backoff = Math.pow(2, config.retryCount) * 1000;
      console.log(`Retry attempt ${config.retryCount} - waiting ${backoff}ms`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      return client(config);
    } else {
      console.error('Max retries reached - giving up');
    }
  }
  
  return Promise.reject(error);
});

export const getAiringAnime = async (page = 1, perPage = 10) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(status: RELEASING, sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
            native
          }
          episodes
          nextAiringEpisode {
            airingAt
            episode
            timeUntilAiring
          }
          coverImage {
            large
            medium
          }
          status
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    console.log('Fetching airing anime...');
    const response = await client.post('', {
      query,
      variables,
    });
    console.log('Successfully fetched airing anime');
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error fetching airing anime:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error; 
  }
};

export const getAnimeDetails = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        title {
          romaji
          english
        }
        description
        coverImage {
          large
        }
        episodes
        status
        genres
      }
    }
  `;

  const variables = { id };

  try {
    console.log(`Fetching details for anime ID ${id}...`);
    const response = await client.post('', {
      query,
      variables,
    });
    console.log(`Successfully fetched details for anime ID ${id}`);
    return response.data.data.Media;
  } catch (error) {
    console.error(`Error fetching anime details for ID ${id}:`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const searchAnimeByName = async (name, page = 1, perPage = 20) => {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(
          search: $search, 
          type: ANIME, 
          isAdult: false
        ) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          description
          episodes
          status
          genres
          averageScore
          popularity
          startDate {
            year
            month
            day
          }
          season
          seasonYear
        }
      }
    }
  `;

  const variables = { 
    search: name,
    page,
    perPage
  };

  try {
    console.log('Searching anime by name:', { name, page, perPage });
    const response = await client.post('', {
      query,
      variables,
    });
    console.log('Search completed successfully');
    return {
      media: response.data.data.Page.media,
      pageInfo: response.data.data.Page.pageInfo
    };
  } catch (error) {
    console.error('Error searching anime by name:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      searchParams: { name, page, perPage }
    });
    throw error;
  }
};

export const searchAnimeById = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        description
        episodes
        status
        genres
        averageScore
        popularity
        startDate {
          year
          month
          day
        }
        season
        seasonYear
      }
    }
  `;

  const variables = { id };

  try {
    console.log('Searching anime by ID:', id);
    const response = await client.post('', {
      query,
      variables,
    });
    console.log('Search completed successfully');
    return response.data.data.Media;
  } catch (error) {
    console.error('Error searching anime by ID:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      searchParams: { id }
    });
    throw error;
  }
};

export const getTrendingAnime = async (page = 1, perPage = 10) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          averageScore
          genres
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    console.log('Fetching trending anime...');
    const response = await client.post('', {
      query,
      variables,
    });
    console.log('Successfully fetched trending anime');
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error fetching trending anime:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getLatestAnime = async (page = 1, perPage = 10) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: START_DATE_DESC, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          startDate {
            year
            month
            day
          }
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    console.log('Fetching latest anime...');
    const response = await client.post('', {
      query,
      variables,
    });
    console.log('Successfully fetched latest anime');
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error fetching latest anime:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getGenres = async () => {
  const query = `
    query {
      GenreCollection
    }
  `;

  try {
    console.log('Fetching genres...');
    const response = await client.post('', {
      query,
    });
    console.log('Successfully fetched genres');
    return response.data.data.GenreCollection;
  } catch (error) {
    console.error('Error fetching genres:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};
