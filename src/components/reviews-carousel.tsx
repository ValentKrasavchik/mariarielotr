"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type ReviewItem = {
  id: string;
  clientName: string;
  text: string;
  rating: number;
  date: string;
};

type ReviewsCarouselProps = {
  reviews: ReviewItem[];
};

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function updateActiveIndex() {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const cards = Array.from(list.children) as HTMLElement[];
    const nearest = cards.reduce(
      (current, card, index) => {
        const distance = Math.abs(card.offsetLeft - list.scrollLeft);
        return distance < current.distance ? { index, distance } : current;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );

    activeIndexRef.current = nearest.index;
    setActiveIndex(nearest.index);
  }

  function scrollToIndex(index: number) {
    const list = listRef.current;
    const card = list?.children[index] as HTMLElement | undefined;

    if (!list || !card) {
      return;
    }

    list.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
    activeIndexRef.current = index;
    setActiveIndex(index);
  }

  function scroll(direction: "left" | "right") {
    const list = listRef.current;

    if (!list) {
      return;
    }

    scrollToIndex(
      Math.min(
        reviews.length - 1,
        Math.max(0, activeIndex + (direction === "left" ? -1 : 1)),
      ),
    );
  }

  useEffect(() => {
    updateActiveIndex();
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length <= 1 || isPaused) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      const list = listRef.current;
      const nextIndex = (activeIndexRef.current + 1) % reviews.length;
      const card = list?.children[nextIndex] as HTMLElement | undefined;

      if (!list || !card) {
        return;
      }

      list.scrollTo({
        left: card.offsetLeft,
        behavior: "smooth",
      });
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [isPaused, reviews.length]);

  if (!reviews.length) {
    return (
      <div className="mt-12 border border-line bg-card p-8 text-muted">
        Пока опубликованных отзывов нет. Вы можете оставить первый отзыв, а я
        добавлю его после проверки.
      </div>
    );
  }

  return (
    <div
      className="relative mt-12 xl:mt-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mb-5 flex justify-end gap-3 xl:absolute xl:-top-16 xl:right-0 xl:mb-0">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="grid size-11 place-items-center border border-line text-cream hover:border-gold hover:text-gold-light"
          aria-label="Предыдущие отзывы"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="grid size-11 place-items-center border border-line text-cream hover:border-gold hover:text-gold-light"
          aria-label="Следующие отзывы"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div
        ref={listRef}
        onScroll={updateActiveIndex}
        className="flex h-[360px] snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] xl:h-[470px] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, reviewIndex) => (
          <article
            key={review.id}
            className={`flex h-full min-w-[82%] snap-start flex-col border bg-card p-6 transition-[border-color,box-shadow,transform,opacity] duration-500 sm:min-w-[58%] lg:min-w-[31%] xl:min-w-[48%] ${
              reviewIndex === activeIndex
                ? "border-gold/70 opacity-100 shadow-2xl shadow-black/15"
                : "border-line opacity-80 hover:border-gold/45 hover:opacity-100"
            }`}
          >
            <div className="flex gap-1 text-gold-light">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={index} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="mt-5 flex-1 leading-7 text-muted">{review.text}</p>
            <div className="mt-6 border-t border-line pt-5">
              <p className="font-semibold text-cream">{review.clientName}</p>
              <p className="mt-1 text-sm text-muted">{review.date}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {reviews.map((review, index) => (
          <button
            key={review.id}
            type="button"
            onClick={() => scrollToIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-9 bg-gold-light"
                : "w-2.5 bg-line hover:bg-gold/70"
            }`}
            aria-label={`Перейти к отзыву ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
