import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import { FocusableElement, FocusableGroup } from '@arrow-navigation/react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';

const Slider = ({ animes, groupId = "anime-slider" }) => {
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  return (
    <FocusableGroup id={groupId}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, A11y]}
        spaceBetween={10}
        slidesPerView={5}
        navigation={{
          enabled: true,
          hideOnClick: true
        }}
        className="w-full"
      >
        {animes.map((anime) => (
          <SwiperSlide key={anime.id}>
            <FocusableGroup id={`anime-group-${Math.floor(Math.random() * 1000)}-${anime.id}`}>
              <FocusableElement
                id={`anime-${Math.floor(Math.random() * 1000)}-${anime.id}`}
                className="relative aspect-[2/3] rounded-lg overflow-hidden
                  focus:outline-none focus:ring-4 focus:ring-purple-500
                  hover:shadow-lg hover:shadow-purple-500/30
                  cursor-pointer transition-all duration-300"
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    navigate(`/anime/${anime.id}`);
                  }
                }}
                onFocus={(e) => {
                  if (e.target) {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }}
              >
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-white font-semibold truncate">
                    {anime.title.romaji}
                  </h3>
                </div>
              </FocusableElement>
            </FocusableGroup>
          </SwiperSlide>
        ))}
      </Swiper>
    </FocusableGroup>
  );
};

export default Slider;
