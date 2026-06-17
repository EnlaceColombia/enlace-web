import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useAdminSession } from "@/lib/admin/admin-session-context";

export function useRequireAdmin() {
  const navigate = useNavigate();
  const session = useAdminSession();

  useEffect(() => {
    if (!session.loading && (!session.userId || !session.isAdmin)) {
      navigate({ to: "/admin" });
    }
  }, [session.loading, session.userId, session.isAdmin, navigate]);

  return session;
}
