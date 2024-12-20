import axios from 'axios';

const ANILIST_API = 'https://graphql.anilist.co';

export async function getAnimeDetails(id) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
        }
        averageScore
        genres
        episodes
        status
      }
    }
  `;

  const variables = { id };

  try {
    const response = await axios.post(ANILIST_API, {
      query,
      variables,
    });
    return response.data.data.Media;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}

export async function searchAnime(query) {
  const searchQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  const variables = { search: query };

  try {
    const response = await axios.post(ANILIST_API, {
      query: searchQuery,
      variables,
    });
    return response.data.data.Page.media;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}
