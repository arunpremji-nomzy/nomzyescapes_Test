import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-1.jpg.asset.json";
import hero2 from "@/assets/hero-2.jpg.asset.json";
import hero3 from "@/assets/hero-3.jpg.asset.json";
import hero4 from "@/assets/hero-4.jpg.asset.json";

const slides = [
  { src: hero1.url, alt: "Sunrise houseboat drifting through Alleppey backwaters" },
  { src: hero2.url, alt: "Remote worker on a Kerala houseboat verandah at dawn" },
  { src: hero3.url, alt: "Bamboo balcony cafe overlooking Varkala's cliffs and sea" },
  { src: hero4.url, alt: "Chinese fishing nets and bougainvillea at Fort Kochi sunset" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
            style={{ opacity: active ? 1 : 0 }}
            aria-hidden={!active}
          >
            <img
              src={s.src}
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              style={{
                animation: active ? `kenburns-${i % 2} 9s ease-out forwards` : "none",
              }}
            />
          </div>
        );
      })}
      <style>{`
        @keyframes kenburns-0 {
          0% { transform: scale(1.08) translate(-1%, -1%); }
          100% { transform: scale(1.18) translate(1.5%, 1%); }
        }
        @keyframes kenburns-1 {
          0% { transform: scale(1.12) translate(1%, 0%); }
          100% { transform: scale(1.04) translate(-1.5%, -1%); }
        }
      `}</style>
    </div>
  );
}
