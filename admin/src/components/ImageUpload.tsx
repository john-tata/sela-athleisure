import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadApi } from "../lib/api";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "products",
  label = "Upload Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    try {
      setUploading(true);

      const uploaded = await uploadApi.image(file, folder);

      onChange(uploaded.url);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;

    handleFile(e.target.files[0]);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        {label}
      </label>

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt=""
            className="w-full h-56 rounded-lg object-cover border"
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-black transition"
        >
          {uploading ? (
            <>
              <Loader2
                className="mx-auto animate-spin"
                size={30}
              />

              <p className="mt-3 text-sm">
                Uploading...
              </p>
            </>
          ) : (
            <>
              <Upload
                className="mx-auto"
                size={34}
              />

              <p className="mt-3 font-medium">
                Click to upload
              </p>

              <p className="text-sm text-gray-500">
                PNG JPG WEBP
              </p>
            </>
          )}
        </div>
      )}

      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
      />
    </div>
);
}