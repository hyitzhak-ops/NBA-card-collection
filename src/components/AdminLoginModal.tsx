"use client";

import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";

type AdminLoginModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<boolean>;
};

export function AdminLoginModal({
  open,
  onClose,
  onLogin,
}: AdminLoginModalProps) {
  const { t, dir } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setPending(true);
    try {
      const ok = await onLogin(username, password);
      if (ok) {
        setUsername("");
        setPassword("");
        onClose();
      } else {
        setError(true);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        dir={dir}
        role="dialog"
        aria-modal
        aria-labelledby="admin-login-title"
        className="w-full max-w-md rounded-2xl border border-amber-500/25 bg-zinc-950/95 p-6 shadow-2xl shadow-black/60"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
            <Shield className="h-5 w-5 text-amber-400" aria-hidden />
          </div>
          <div>
            <h2
              id="admin-login-title"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-amber-50"
            >
              {t("adminLoginTitle")}
            </h2>
            <p className="text-xs text-zinc-500">{t("adminLoginSubtitle")}</p>
          </div>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label
              htmlFor="admin-user"
              className="mb-1.5 block text-xs font-medium text-zinc-400"
            >
              {t("adminUsername")}
            </label>
            <input
              id="admin-user"
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/50 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-amber-500/0 transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/25"
              disabled={pending}
            />
          </div>
          <div>
            <label
              htmlFor="admin-pass"
              className="mb-1.5 block text-xs font-medium text-zinc-400"
            >
              {t("adminPassword")}
            </label>
            <input
              id="admin-pass"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/50 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-amber-500/0 transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/25"
              disabled={pending}
            />
          </div>

          {error ? (
            <p className="flex items-center gap-2 text-xs text-red-400">
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {t("adminLoginError")}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={pending || !username.trim() || !password}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:from-amber-500/30 hover:to-amber-600/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "…" : t("adminSignIn")}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
            >
              {t("close")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
