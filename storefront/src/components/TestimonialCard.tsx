import { Star, BadgeCheck } from "lucide-react";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    customer_name: string;
    customer_photo: string | null;
    rating: number;
    review_text: string;
    is_verified?: boolean;
  };
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="rounded-lg border border-border-gray bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? "fill-gold text-gold"
                : "fill-border-gray text-border-gray"
            }`}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="mt-4 font-body text-sm leading-relaxed text-rich-black">
        &ldquo;{testimonial.review_text}&rdquo;
      </p>

      {/* Customer Info */}
      <div className="mt-5 flex items-center gap-3">
        {testimonial.customer_photo ? (
          <img
            src={testimonial.customer_photo}
            alt={testimonial.customer_name}
            className="h-11 w-11 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-light-gray">
            <span className="font-body text-sm font-medium uppercase text-cool-gray">
              {testimonial.customer_name.charAt(0)}
            </span>
          </div>
        )}

        <div>
          <p className="font-body text-sm font-semibold text-rich-black">
            {testimonial.customer_name}
          </p>
          {testimonial.is_verified && (
            <div className="mt-0.5 flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5 text-gold" />
              <span className="font-body text-xs font-medium text-gold">
                Verified Buyer
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
