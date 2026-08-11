import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { api } from '@/lib/api';
import { TestimonialCard } from '@/components/TestimonialCard';

import 'swiper/css';
import 'swiper/css/pagination';

interface Testimonial {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number;
  quote: string;
  role?: string | null;
  is_verified?: boolean;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContent('testimonials')
      .then((res: any) => {
        if (res.status === "success") {
          setTestimonials(res.data.testimonials || []);
        } else {
          setTestimonials([]);
        }
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4 block">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-12">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-sm p-8 aspect-[4/3]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4 block">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            What Our Community Says
          </h2>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            Reviews coming soon.
          </div>
        ) : (
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.testimonials-pagination',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {/* Custom pagination */}
        <div className="testimonials-pagination flex justify-center gap-2 mt-8" />
      </div>
    </section>
  );
}
