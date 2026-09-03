"use client";

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Globe, Shield, Link2, Trash2 } from 'lucide-react';

interface ShareModalProps {
  workspaceId: string;
  workspaceName: string;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc?: string) => void;
}

function isRealIdeaId(id: string): boolean {
  return !!id && !id.startsWith("simulation") && !id.startsWith("empty") && id.length >= 16;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  workspaceId,
  workspaceName,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [includesResponses, setIncludesResponses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!isOpen || !isRealIdeaId(workspaceId)) return;
    setLoading(true);
    fetch(`/api/ideas/${workspaceId}/share`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.token) setToken(data.token);
        if (typeof data?.includesResponses === "boolean") setIncludesResponses(data.includesResponses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  const isReal = isRealIdeaId(workspaceId);
  const shareUrl = token && origin ? `${origin}/s/${token}` : "";

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onShowToast('Share link copied to clipboard!', shareUrl);
    setTimeout(() => setCopied(false), 2500);
  };

  const create = async () => {
    setBusy("create");
    try {
      const res = await fetch(`/api/ideas/${workspaceId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setToken(data.token);
      onShowToast('Share link created', 'Anyone with the link can view this workspace read-only (no sign-in, never indexed).');
    } catch (e: any) {
      onShowToast('Could not create link', e.message || 'Try again');
    } finally {
      setBusy(null);
    }
  };

  const revoke = async () => {
    setBusy("revoke");
    try {
      const res = await fetch(`/api/ideas/${workspaceId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke" }),
      });
      if (!res.ok) throw new Error("Failed");
      setToken(null);
      onShowToast('Link revoked', 'Anyone holding the old link now sees nothing.');
    } catch {
      onShowToast('Could not revoke', 'Try again');
    } finally {
      setBusy(null);
    }
  };

  const toggleResponses = async (next: boolean) => {
    setIncludesResponses(next);
    setBusy("responses");
    try {
      const res = await fetch(`/api/ideas/${workspaceId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_responses", include: next }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setIncludesResponses(!next);
      onShowToast('Could not update', 'Try again');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Share Workspace</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Same link as the classic dashboard — read-only, no account, never indexed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isReal ? (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
              This is a demo workspace. Create a real idea first — then you can generate a public link that shows exactly this dashboard view.
            </div>
          ) : loading ? (
            <p className="text-xs text-slate-500">Loading sharing settings…</p>
          ) : token ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Public link — exactly this dashboard
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all overflow-hidden">
                    <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{shareUrl}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">Opens the same tabs you see here — Summary, Idea, Research, Validation, Verdict, History — read-only.</p>
                <button
                  onClick={revoke}
                  disabled={busy === "revoke"}
                  className="mt-2 text-xs text-slate-500 hover:text-red-600 inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Revoke link
                </button>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200/80 bg-slate-50">
                <input
                  type="checkbox"
                  checked={includesResponses}
                  onChange={(e) => toggleResponses(e.target.checked)}
                  disabled={busy === "responses"}
                  className="rounded"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700">Include what respondents wrote</p>
                  <p className="text-[11px] text-slate-500">Off by default. Shared page never shows who said it.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Create a public link for <span className="font-semibold">{workspaceName || "this workspace"}</span>. It will show exactly this dashboard view — same title (<span className="font-semibold">SparkSchool</span>), same tabs, same evidence — read-only and never indexed.
              </p>
              <button
                onClick={create}
                disabled={busy === "create"}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" /> Create share link
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            No account needed to open
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
