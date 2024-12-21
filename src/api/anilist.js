import axios from 'axios';

const ANILIST_API = 'https://graphql.anilist.co';

export const getAiringAnime = async (page = 1, perPage = 10) => {
  const query = `
    query LatestEpisodes($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: UPDATED_AT_DESC, type: ANIME) {
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
          }
          updatedAt
          coverImage {
            large
          }
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const response = await axios.post(ANILIST_API, {
      query,
      variables,
    });
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error fetching airing anime:', error.response?.data || error.message);
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

  const response = await axios.post('https://graphql.anilist.co', {
    query,
    variables,
  });

  return response.data.data.Media;
};

export const searchAnime = async (search) => {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  const variables = { search };

  try {
    const response = await axios.post(ANILIST_API, {
      query,
      variables,
    });
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error searching anime:', error.response?.data || error.message);
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
    const response = await axios.post(ANILIST_API, {
      query,
      variables,
    });
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error fetching trending anime:', error.response?.data || error.message);
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
    const response = await axios.post(ANILIST_API, {
      query,
      variables,
    });
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error fetching latest anime:', error.response?.data || error.message);
    throw error;
  }
};
