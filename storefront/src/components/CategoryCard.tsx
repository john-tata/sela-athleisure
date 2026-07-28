import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    description?: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/collections/${category.slug}`}
      className="group relative block overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-light-gray">
            <span className="font-body text-sm text-cool-gray">
              {category.name}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category Name */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1 font-body text-sm text-white/70">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
