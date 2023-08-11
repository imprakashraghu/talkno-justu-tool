import { useState, useEffect } from "react";
import supabase from "./supabase";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const supabaseSession = supabase.auth.getSession();

    if (supabaseSession?.user?.id) {
      setUser(supabaseSession.user);
      setToken(supabaseSession.access_token);
    }

    setLoading(false);

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        setUser(session.user);
        setToken(session.access_token);
      }
      setLoading(false);
    });
  }, [supabase]);

  return {
    user,
    isLoading,
    token,
  };
};

export default useUser;