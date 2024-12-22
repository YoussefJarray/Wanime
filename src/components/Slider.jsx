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

  const handleFocus = (e) => {
    if (e.target) {
      const slideElement = e.target.closest('.swiper-slide');
      if (slideElement) {
        const rect = slideElement.getBoundingClientRect();
        const sliderMiddle = rect.top + rect.height / 2; // Middle of the slider in the viewport
        const viewportMiddle = window.innerHeight / 2; // Middle of the screen

        // Calculate the scroll offset to center the slider
        const scrollOffset = window.scrollY + (sliderMiddle - viewportMiddle);

        // Force the page to scroll to the correct position
        window.scrollTo({
          top: scrollOffset,
          behavior: 'smooth', // Smooth scrolling
        });
      }
    }
  };

  return (
    <FocusableGroup id={groupId}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, A11y]}
        spaceBetween={10}
        slidesPerView={6}
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
                className="block relative w-[200px] h-[300px] rounded-lg overflow-hidden
                  focus:outline-none focus:ring-4 focus:ring-purple-500
                  hover:shadow-lg hover:shadow-purple-500/30
                  cursor-pointer transition-all duration-300"
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    navigate(`/anime/${anime.id}`);
                  }
                }}
                onFocus={handleFocus} // Ensure this handler is invoked on focus
                style={{
                  aspectRatio: '2/3',
                  minWidth: '200px',
                  minHeight: '300px'
                }}
              >
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  className="w-full h-full object-cover"
                  loading="lazy"
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
