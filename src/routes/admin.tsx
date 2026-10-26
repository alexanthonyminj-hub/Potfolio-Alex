import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Shield,
  Lock,
  Mail,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  ArrowLeft,
  Database,
  Inbox,
  AlertCircle,
  Eye,
  LogOut,
} from "lucide-react";
import {
  adminLoginRequest,
  getAdminDashboardData,
  toggleSubmissionReadRequest,
  deleteSubmissionRequest,
} from "@/lib/admin.functions";
import type { ContactSubmission } from "@/lib/db.server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Messages Dashboard | Alex Anthony Minj" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    totalCount: number;
    unreadCount: number;
    todayCount: number;
    isDbConnected: boolean;
    submissions: ContactSubmission[];
  } | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  const loginFn = useServerFn(adminLoginRequest);
  const fetchDashboardFn = useServerFn(getAdminDashboardData);
  const toggleReadFn = useServerFn(toggleSubmissionReadRequest);
  const deleteFn = useServerFn(deleteSubmissionRequest);

  // Restore saved token from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("portfolio_admin_token");
    if (saved) {
      setToken(saved);
    }
  }, []);

  // Fetch data whenever token is available
  const loadData = async (activeToken: string) => {
    setLoading(true);
    try {
      const res = await fetchDashboardFn({ data: { token: activeToken } });
      setData(res);
    } catch {
      // Token expired or invalid
      sessionStorage.removeItem("portfolio_admin_token");
      setToken(null);
      setLoginError("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await loginFn({ data: { password } });
      if (res.token) {
        sessionStorage.setItem("portfolio_admin_token", res.token);
        setToken(res.token);
        setPassword("");
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Invalid password");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("portfolio_admin_token");
    setToken(null);
    setData(null);
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    if (!token) return;
    const nextRead = !currentRead;

    // Optimistic update
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        unreadCount: nextRead ? prev.unreadCount - 1 : prev.unreadCount + 1,
        submissions: prev.submissions.map((s) =>
          s.id === id ? { ...s, is_read: nextRead } : s,
        ),
      };
    });

    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, is_read: nextRead } : null));
    }

    try {
      await toggleReadFn({ data: { token, id, is_read: nextRead } });
    } catch {
      // Revert if error
      loadData(token);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to permanently delete this message?")) return;

    // Optimistic update
    setData((prev) => {
      if (!prev) return null;
      const target = prev.submissions.find((s) => s.id === id);
      const wasUnread = target && !target.is_read;
      return {
        ...prev,
        totalCount: prev.totalCount - 1,
        unreadCount: wasUnread ? prev.unreadCount - 1 : prev.unreadCount,
        submissions: prev.submissions.filter((s) => s.id !== id),
      };
    });

    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }

    try {
      await deleteFn({ data: { token, id } });
    } catch {
      loadData(token);
    }
  };

  const filteredSubmissions = (data?.submissions || []).filter((s) => {
    if (filter === "unread" && s.is_read) return false;
    if (filter === "read" && !s.is_read) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.subject.toLowerCase().includes(q) ||
      s.message.toLowerCase().includes(q)
    );
  });

  // 1. Login View
  if (!token) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.65_0.22_265/0.18),transparent_60%)]" />

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="size-3.5" /> Back to Portfolio
            </Link>
            <div className="size-14 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center mx-auto mb-4 glow-primary">
              <Shield className="size-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to view client inquiries and contact messages.
            </p>
          </div>

          <div className="glass rounded-3xl p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                  Admin Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    required
                    className="w-full rounded-2xl bg-background/50 border border-border/60 pl-11 pr-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full rounded-full bg-[image:var(--gradient-primary)] py-3 text-sm font-medium text-primary-foreground glow-primary hover-scale"
              >
                {isLoggingIn ? "Verifying..." : "Unlock Dashboard"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                Default password: <code className="text-primary font-mono">alexadmin2026</code>
                <br />
                (Configurable via <code className="text-foreground">ADMIN_PASSWORD</code> in <code className="text-foreground">.env</code>)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Dashboard View
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/60 glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="size-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-bold font-display"
            >
              A
            </Link>
            <div>
              <div className="font-display font-bold text-sm">Alex Anthony Minj</div>
              <div className="text-[10px] uppercase tracking-widest text-primary">Inquiry Manager</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border/60"
            >
              <ExternalLink className="size-3.5" /> View Portfolio
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full text-xs gap-1.5 border-border/60"
            >
              <LogOut className="size-3.5" /> Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Client Inquiries</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Incoming contact messages submitted through your portfolio website.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                data?.isDbConnected
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              <Database className="size-3.5" />
              {data?.isDbConnected ? "Render PostgreSQL: Connected" : "Local Memory Store"}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => token && loadData(token)}
              className="rounded-full size-9 p-0"
              title="Refresh messages"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground">
              <Inbox className="size-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Total Messages</div>
              <div className="text-2xl font-display font-bold mt-0.5">{data?.totalCount ?? 0}</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-secondary/15 text-secondary grid place-items-center">
              <Mail className="size-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Unread Inquiries</div>
              <div className="text-2xl font-display font-bold mt-0.5 text-secondary">
                {data?.unreadCount ?? 0}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/15 text-primary grid place-items-center">
              <Clock className="size-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Received Today</div>
              <div className="text-2xl font-display font-bold mt-0.5">{data?.todayCount ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or topic..."
              className="w-full bg-background/50 border border-border/60 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {(["all", "unread", "read"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-colors ${
                  filter === mode
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "all" ? "All" : mode === "unread" ? "Unread" : "Read"}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List Table */}
        <div className="glass rounded-3xl overflow-hidden border border-border/60">
          {filteredSubmissions.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Inbox className="size-10 mx-auto mb-3 opacity-40" />
              <p className="text-base font-medium text-foreground">No messages found</p>
              <p className="text-sm mt-1">
                {search ? "Try adjusting your search query." : "New client inquiries will appear here."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {filteredSubmissions.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    !msg.is_read ? "bg-primary/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="mt-1 shrink-0">
                      {!msg.is_read ? (
                        <span className="size-2.5 rounded-full bg-primary block glow-primary" />
                      ) : (
                        <span className="size-2.5 rounded-full bg-transparent border border-muted-foreground/30 block" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${!msg.is_read ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground">· {msg.email}</span>
                      </div>
                      <h4 className="text-base font-display font-medium text-foreground mt-0.5 truncate">
                        {msg.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full size-8 p-0 text-muted-foreground hover:text-foreground"
                        title={msg.is_read ? "Mark as unread" : "Mark as read"}
                        onClick={() => handleToggleRead(msg.id, msg.is_read)}
                      >
                        <CheckCircle2 className={`size-4 ${msg.is_read ? "text-emerald-400" : ""}`} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full size-8 p-0 text-muted-foreground hover:text-destructive"
                        title="Delete message"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Message Detail Dialog */}
      <Dialog
        open={Boolean(selectedMessage)}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl glass rounded-3xl p-6 md:p-8 bg-background/95 border-border/80">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-widest text-primary font-medium">
                    Inquiry Details
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-display font-bold mt-2">
                  {selectedMessage.subject}
                </DialogTitle>
                <DialogDescription className="text-sm text-foreground/80 mt-1">
                  From <strong className="text-foreground">{selectedMessage.name}</strong> (
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                  )
                </DialogDescription>
              </DialogHeader>

              <div className="my-6 p-5 rounded-2xl bg-card border border-border/60 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {selectedMessage.message}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs gap-1.5"
                    onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.is_read)}
                  >
                    <CheckCircle2 className={`size-3.5 ${selectedMessage.is_read ? "text-emerald-400" : ""}`} />
                    {selectedMessage.is_read ? "Mark as Unread" : "Mark as Read"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs text-destructive hover:bg-destructive/10 gap-1.5"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-5 py-2 text-xs font-medium text-primary-foreground glow-primary hover-scale"
                >
                  <Mail className="size-3.5" /> Reply via Email
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
