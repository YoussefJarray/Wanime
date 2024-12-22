import axios from 'axios';

const apiUrl = 'https://aniwatch-api-ch0nker.vercel.app/api/v2/hianime';

export const getEpisodeUrl = async (anilistTitle, episodeNumber, dubbed = false) => {
  console.log(
    `%c Searching for episode ${episodeNumber} of "${anilistTitle}"...`,
    `color: #ffc119`
  );

  try {
    // 1. Encode the search query (replace spaces with '-')
    const encodedTitle = anilistTitle.toLowerCase().replace(/ /g, '-'); 

    // 2. Search for anime 
    const searchResponse = await axios.get(`${apiUrl}/search?q=${encodedTitle}`);

    if (!searchResponse.data?.success || !searchResponse.data?.data?.animes) {
      console.log(`%c Invalid response data for ${anilistTitle}`, `color: #E5A639`);
      return null;
    }

    const animes = searchResponse.data.data.animes;

    // 3. Handle no search results
    if (animes.length === 0) {
      console.log(`%c No results found for ${anilistTitle}`, `color: #E5A639`);
      return null;
    }

    // 4. Extract anime name from the first search result
    const animeName = animes[0].name; 

    // 5. Fetch episode details
    const episodeResponse = await axios.get(`${apiUrl}/anime/episodes/${animes[0].id}`); 

    if (!episodeResponse.data?.success) {
      console.log(`%c Failed to fetch episodes for ${animeName}`, `color: #E5A639`);
      return null;
    }

    const episodes = episodeResponse.data.data.episodes;

    // 6. Find the specific episode by episodeId 
    const targetEpisode = episodes.find(
      (ep) => ep.episodeId === `${animes[0].id}?ep=${episodeNumber}` 
    );

    if (!targetEpisode) {
      console.log(`%c Episode ${episodeNumber} not found for ${animeName}`, `color: #E5A639`);
      return null;
    }

    // 7. Construct the episode source URL 
    const server = dubbed ? 'hd-1' : 'gogo-stream'; // Example server choices
    const category = dubbed ? 'dub' : 'sub';
    const episodeSourceUrl = `${apiUrl}/episode/sources?animeEpisodeId=${targetEpisode.id}&server=${server}&category=${category}`;

    // 8. Fetch episode sources
    const sourceResponse = await axios.get(episodeSourceUrl);

    if (!sourceResponse.data?.success) {
      console.log(`%c Failed to fetch sources for episode ${episodeNumber}`, `color: #E5A639`);
      return null;
    }

    const sources = sourceResponse.data.data.sources;

    // 9. Handle no sources found
    if (!sources.length) {
      console.log(`%c No ${dubbed ? 'dubbed' : 'subbed'} sources found for episode ${episodeNumber}`, `color: #E5A639`);
      return null;
    }

    // 10. Return the first source URL 
    const firstSourceUrl = sources[0].url;
    console.log(`%c Found episode source for ${animeName} - ${episodeNumber}`, 'color: green'); 
    return firstSourceUrl;

  } catch (error) {
    console.error('Error fetching episode:', error);
    return null;
  }
};