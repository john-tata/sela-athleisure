import React, { useEffect, useRef, useState } from 'react';
import { contentApi } from '@/lib/api';

interface VideoContent {
  title?: string;
  subtitle?: string;
  video_url?: string;
  cta_text?: string;
  cta_link?: string;
}

const VideoSection: React.FC = () => {
  const [content, setContent] = useState<VideoContent>({
    title: 'Built To Move',
    subtitle: 'Made To Inspire',
    video_url: '',
    cta_text: 'Explore the Collection',
    cta_link: '/shop',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await contentApi.getSection('video_section');
        const data = response?.data || response;

        setContent((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (error) {
        console.error('Failed to load video section:', error);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
      }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [content.video_url]);

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background Video */}
      {content.video_url && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          src={shouldLoadVideo ? content.video_url : undefined}
        />
      )}

      {/* Fallback background */}
      {!content.video_url && (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-8xl">
          {content.title}
        </h2>

        <p className="mb-10 text-lg font-light tracking-wide text-white/80 md:text-2xl">
          {content.subtitle}
        </p>

        <a
          href={content.cta_link || '/shop'}
          className="bg-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-black transition-colors duration-300 hover:bg-neutral-200"
        >
          {content.cta_text || 'Explore the Collection'}
        </a>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default VideoSection;