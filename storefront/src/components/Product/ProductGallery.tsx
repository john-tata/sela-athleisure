import { useEffect, useState } from "react";

interface ProductImage {
  id?: string;
  url: string;
  alt_text?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (images.length) {
      setSelectedImage(images[0].url);
    }
  }, [images]);

  const currentImage =
    selectedImage || images[0]?.url || "";

  return (
    <div className="space-y-4">

      {/* Main Image */}
      <div className="group aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        {currentImage ? (
          <img
            src={currentImage}
            alt={productName}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-110
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image) => (
            <button
              key={image.url}
              onClick={() => setSelectedImage(image.url)}
              className={`h-24 w-24 overflow-hidden rounded-xl border-2 transition
                ${
                  currentImage === image.url
                    ? "border-black"
                    : "border-transparent hover:border-neutral-300"
                }`}
            >
              <img
                src={image.url}
                alt={image.alt_text || productName}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-neutral-500">
          {images.findIndex((i) => i.url === currentImage) + 1}
          {" / "}
          {images.length}
        </div>
      )}
    </div>
  );
}