import React, { useEffect, useState } from 'react';
import { contentApi } from '../lib/api';

interface Feature {
  label: string;
  icon: string;
  enabled: boolean;
  sort_order: number;
}

const fallbackFeatures: Feature[] = [
  {
    label: 'BREATHABLE FABRIC',
    icon: 'sun',
    enabled: true,
    sort_order: 1,
  },
  {
    label: '4-WAY STRETCH',
    icon: 'stretch',
    enabled: true,
    sort_order: 2,
  },
  {
    label: 'SQUAT PROOF',
    icon: 'shield',
    enabled: true,
    sort_order: 3,
  },
  {
    label: 'PREMIUM QUALITY',
    icon: 'sparkles',
    enabled: true,
    sort_order: 4,
  },
  {
    label: 'FREE DELIVERY',
    icon: 'truck',
    enabled: true,
    sort_order: 5,
  },
];

const FeatureStrip: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>(fallbackFeatures);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const response = await contentApi.getSection('feature_strip');
        const section =
          response?.data?.section ??
          response?.section ??
          response?.data ??
          response;

        const loadedFeatures = section?.extra?.features ?? [];

        const activeFeatures = loadedFeatures
          .filter((feature: Feature) => feature.enabled)
          .sort(
            (a: Feature, b: Feature) =>
              (a.sort_order || 0) - (b.sort_order || 0)
          );

        if (activeFeatures.length > 0) {
          setFeatures(activeFeatures);
        }
      } catch (error) {
        console.error(
          'Failed to load Feature Strip:',
          error
        );
      }
    };

    loadFeatures();
  }, []);

  /*
   * We render the features twice.
   *
   * When the first set has completely moved off screen,
   * the second set is in exactly the same position.
   *
   * This creates a seamless infinite loop.
   */
  const items = [...features, ...features];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );

      case 'stretch':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        );

      case 'shield':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );

      case 'sparkles':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );

      case 'truck':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17a2 2 0 104 0m-4 0H5V6h11v11m0 0h2a2 2 0 002-2v-4l-3-3h-1V6h-4m0 11a2 2 0 104 0"
            />
          </svg>
        );

      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
    }
  };

  return (
    <section className="w-full bg-black overflow-hidden py-4">
      <div
        className="
          flex w-max whitespace-nowrap
          animate-feature-marquee
          hover:[animation-play-state:paused]
        "
      >
        {items.map((feature, index) => (
          <div
            key={`${feature.label}-${index}`}
            className="
              flex items-center gap-3
              px-8 md:px-12
              text-white
              flex-shrink-0
            "
          >
            <span className="text-amber-400 flex-shrink-0">
              {renderIcon(feature.icon)}
            </span>

            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase">
              {feature.label}
            </span>

            <span className="text-amber-400/50 mx-4">
              ◆
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes feature-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .animate-feature-marquee {
          animation: feature-marquee 25s linear infinite;
          will-change: transform;
        }

        @media (max-width: 768px) {
          .animate-feature-marquee {
            animation-duration: 18s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-feature-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default FeatureStrip;
