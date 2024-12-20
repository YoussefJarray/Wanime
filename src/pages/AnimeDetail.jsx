import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeDetails } from '../api/anilist';

function AnimeDetail() {
  /*
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getAnimeDetails(Number(id));
      setAnime(data);
    };

    fetchDetails();
  }, [id]);

  if (!anime) return <div>Loading...</div>;
  */

  return (
    <div className="p-4">
      Anime Details page
    </div>
  );
}

export default AnimeDetail;
