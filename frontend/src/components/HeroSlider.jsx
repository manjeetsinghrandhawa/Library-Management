import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
];

function HeroSlider() {
  const [current, setCurrent] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(
        (prev) =>
          (prev + 1) %
          images.length
      );
    }, 4000);

    return () =>    
      clearInterval(interval);
  }, []);

  return (
    <div
      className="hero-slider"
      style={{
        backgroundImage: `url(${images[current]})`,
      }}
    />
  );
}

export default HeroSlider;