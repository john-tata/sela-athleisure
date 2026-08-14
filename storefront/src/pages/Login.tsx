import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

import nebulaViolet from "@/assets/nebula-violet.jpg";
import galaxyCore from "@/assets/galaxy-core.jpg";
import nebulaAurora from "@/assets/nebula-aurora.jpg";

const BACKGROUNDS = [
  { id: "violet", src: nebulaViolet, label: "Violet Nebula" },
  { id: "core", src: galaxyCore, label: "Galactic Core" },
  { id: "aurora", src: nebulaAurora, label: "Aurora Nebula" },
];

// ---- Icons ----------------------------------------------------------------

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 6.5l8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="4.5" y="10.5" width="15" height="10" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a13.5 13.5 0 0 1-3.1 3.9M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pick a random backdrop once per page load. Reloading the page (not just
  // navigating client-side) re-runs this and gives a new scene.
  const [activeBg, setActiveBg] = useState(
    () => BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)].id
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect already-authenticated users as a side effect, not during render.
  useEffect(() => {
    if (user) {
      navigate("/account", { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/account");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <style>{`
        @keyframes selaKenBurns {
          0%   { transform: scale(1.06) translate(0, 0); }
          100% { transform: scale(1.16) translate(-1.5%, -1%); }
        }
        .sela-bg-layer {
          animation: selaKenBurns 24s ease-out forwards;
        }
      `}</style>

      {/* Background layers — crossfade between scenes */}
      <div className="absolute inset-0">
        {BACKGROUNDS.map((bg) => (
          <img
            key={bg.id}
            src={bg.src}
            alt=""
            className={`sela-bg-layer absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
              activeBg === bg.id ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div
          className={`w-full max-w-md transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          

          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl px-7 py-9 sm:px-10 sm:py-10">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
                Welcome Back
              </h1>
              <p className="text-sm text-white/60 mt-3">
                Sign in to your SELA account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3 border-b border-white/25 pb-2.5 focus-within:border-white/80 transition-colors duration-300">
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/30 outline-none"
                    placeholder="you@example.com"
                  />
                  <span className="text-white/40">
                    <MailIcon />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                  Password
                </label>
                <div className="flex items-center gap-3 border-b border-white/25 pb-2.5 focus-within:border-white/80 transition-colors duration-300">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/30 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-white/40 hover:text-white/80 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                  <span className="text-white/40">
                    <LockIcon />
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-white text-rich-black py-3 uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:bg-white/90 disabled:opacity-50"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M2 8h12M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </button>
            </form>

            <p className="text-center text-sm text-white/60 mt-8">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white underline underline-offset-4">
                Create one
              </Link>
            </p>
          </div>

          {/* Scene picker */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => setActiveBg(bg.id)}
                aria-label={`Switch to ${bg.label} background`}
                aria-pressed={activeBg === bg.id}
                className={`h-9 w-9 overflow-hidden rounded-full border-2 transition-all duration-300 ${
                  activeBg === bg.id
                    ? "border-white scale-110"
                    : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={bg.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
