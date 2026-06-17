import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type AdminSessionContextValue = {
  loading: boolean;
  configured: boolean;
  session: Session | null;
  user: User | null;
  userId: string | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    let active = true;

    async function applySession(nextSession: Session | null, force = false) {
      if (!active) return;

      const nextUser = nextSession?.user ?? null;
      const nextUserId = nextUser?.id ?? null;

      if (!nextUserId) {
        lastUserIdRef.current = null;
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (!force && lastUserIdRef.current === nextUserId) {
        setLoading(false);
        return;
      }

      lastUserIdRef.current = nextUserId;
      setSession(nextSession);
      setUser(nextUser);

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", nextUserId)
        .maybeSingle();

      if (!active) return;

      setIsAdmin(Boolean(data && !error));
      setLoading(false);
    }

    void supabase.auth.getSession().then(({ data }) => applySession(data.session, true));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "TOKEN_REFRESHED") return;
      setLoading(true);
      void applySession(nextSession, event === "SIGNED_IN" || event === "SIGNED_OUT");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AdminSessionContextValue>(
    () => ({
      loading,
      configured: isSupabaseConfigured(),
      session,
      user,
      userId: user?.id ?? null,
      isAdmin,
      signIn,
      signOut,
    }),
    [loading, session, user, isAdmin, signIn, signOut],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error("useAdminSession debe usarse dentro de AdminSessionProvider");
  }
  return context;
}
