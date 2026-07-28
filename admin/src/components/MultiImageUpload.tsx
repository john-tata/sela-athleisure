import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadApi } from "../lib/api";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}

export default function MultiImageUpload({
  value,
  onChange,
  folder = "products",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files: FileList) => {
    try {
      setUploading(true);

      const uploaded = await uploadApi.images(
        Array.from(files),
        folder
      );

      const urls = uploaded.images.map(
        (img: any) => img.url
      );

      onChange([...value, ...urls]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">

      <label className="block text-sm font-medium">
        Product Images
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-black transition"
      >
        {uploading ? (
          <>
            <Loader2
              className="mx-auto animate-spin"
              size={32}
            />
            <p className="mt-3">Uploading...</p>
          </>
        ) : (
          <>
            <Upload
              className="mx-auto"
              size={36}
            />

            <p className="mt-3 font-medium">
              Click to upload product images
            </p>

            <p className="text-sm text-gray-500">
              Upload multiple images
            </p>
          </>
        )}
      </div>

      <input
        hidden
        multiple
        accept="image/*"
        ref={inputRef}
        type="file"
        onChange={(e) => {
          if (e.target.files)
            uploadFiles(e.target.files);
        }}
      />

      <div className="grid grid-cols-4 gap-3">

        {value.map((url, index) => (

          <div
            key={index}
            className="relative"
          >
            <img
              src={url}
              className="w-full h-28 object-cover rounded-lg border"
            />

            <button
              type="button"
              onClick={() =>
                onChange(
                  value.filter((_, i) => i !== index)
                )
              }
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
            >
              <X size={14} />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}