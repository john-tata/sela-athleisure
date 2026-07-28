import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function FloatingShopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      to="/collections"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-body text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-rich-black ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-label="Shop now"
    >
      <ShoppingBag className="h-4 w-4" />
      Shop Now
    </Link>
  );
}
