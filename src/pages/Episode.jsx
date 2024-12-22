import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Episode() {
  const { id, episodeNumber } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [magnetLink, setMagnetLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchMagnetLink = async () => {
      try {
        console.log("--- Debugging Params ---");
        console.log("Anime ID:", id);
        console.log("Episode Number:", episodeNumber);

        // Fake anime details for demonstration
        const animeTitle = "Blue Lock"; // Replace with your anime title logic
        setAnimeDetails({ title: { romaji: animeTitle } });

        console.log("--- Searching Nyaa.si ---");
        const query = encodeURIComponent(`${animeTitle} Episode ${episodeNumber}`);
        const searchUrl = `https://nyaa.si/?f=0&c=0_0&q=${query}`;
        console.log("Search URL:", searchUrl);

        // Web scraping
        const response = await fetch(searchUrl);
        const html = await response.text();

        // Extract the first magnet link from the HTML
        const magnetMatch = html.match(/magnet:\?xt=urn:btih:[^"]+/);
        if (magnetMatch) {
          setMagnetLink(magnetMatch[0]);
          console.log("--- Magnet Link Found ---", magnetMatch[0]);
        } else {
          throw new Error("No magnet link found.");
        }
      } catch (error) {
        console.error("--- Error ---", error);
        setErrorMessage("Failed to fetch magnet link.");
      }
    };

    fetchMagnetLink();
  }, [id, episodeNumber]);

  return (
    <div>
      {errorMessage ? (
        <div>Error: {errorMessage}</div>
      ) : animeDetails ? (
        <div>
          <h2>
            {animeDetails.title.romaji} - Episode {episodeNumber}
          </h2>
          {magnetLink ? (
            <a href={magnetLink} target="_blank" rel="noopener noreferrer">
              <button>Download Episode</button>
            </a>
          ) : (
            <div>Fetching magnet link...</div>
          )}
        </div>
      ) : (
        <div>Loading anime details...</div>
      )}
    </div>
  );
}

export default Episode;
