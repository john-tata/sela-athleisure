import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        navigate("/login", { replace: true });
        return;
      }

      navigate("/account", { replace: true });
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">
        Confirming your email...
      </p>
    </main>
  );
}