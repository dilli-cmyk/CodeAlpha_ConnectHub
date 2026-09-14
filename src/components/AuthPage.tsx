import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import type { User } from "../types";

interface Props {
  onLogin: (user: User) => void;
  onRegister: (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => string | null;
  existingUsers: User[];
}

export default function AuthPage({ onLogin, onRegister, existingUsers }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const user = existingUsers.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );
    if (!user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    onLogin(user);
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const user = existingUsers.find((u) => u.id === "u1")!;
    onLogin(user);
    setLoading(false);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (existingUsers.find((u) => u.email === regEmail)) {
      setError("An account with this email already exists.");
      return;
    }
    if (existingUsers.find((u) => u.username === regUsername)) {
      setError("Username is already taken.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const err = onRegister({
      fullName: regFullName,
      username: regUsername,
      email: regEmail,
      password: regPassword,
    });
    if (err) setError(err);
    setLoading(false);
  };

  const inputClass =
    "w-full bg-lift border border-white/10 rounded-xl px-4 py-3 text-ink placeholder-ghost focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all duration-200 text-sm";

  return (
    <div className="min-h-screen flex bg-base">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[540px] flex-shrink-0 relative overflow-hidden p-12">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 140% 100% at 20% 60%, rgba(124,111,247,0.25) 0%, rgba(8,8,16,0) 65%), radial-gradient(ellipse 80% 60% at 80% 10%, rgba(45,212,191,0.12) 0%, transparent 60%)",
            backgroundColor: "#0e0e17",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span
              className="text-xl font-bold text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ConnectHub
            </span>
          </div>

          <h1
            className="text-5xl xl:text-6xl font-bold text-ink leading-[1.08] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where ideas
            <br />
            <span className="text-accent">connect</span> and
            <br />
            grow.
          </h1>
          <p className="text-dim text-lg leading-relaxed max-w-sm">
            Join a community of designers, developers, and creators sharing what they're building.
          </p>
        </div>

        {/* Floating post previews */}
        <div className="relative z-10 space-y-3">
          {[
            {
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
              name: "Sarah Kim",
              text: "Just shipped a redesign of our token architecture…",
              likes: 42,
            },
            {
              avatar:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop",
              name: "Marcus Johnson",
              text: "Open sourced my async state library for React 🌟",
              likes: 87,
            },
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-surface/60 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-4"
            >
              <img
                src={p.avatar}
                alt={p.name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-rim"
              />
              <div>
                <p className="text-ink text-sm font-medium leading-tight">{p.name}</p>
                <p className="text-dim text-xs mt-0.5 leading-relaxed">{p.text}</p>
                <p className="text-ghost text-xs mt-1.5">♥ {p.likes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span
              className="text-lg font-bold text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ConnectHub
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-ink mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-dim text-sm">
              {mode === "login"
                ? "Sign in to your account to continue."
                : "Join the ConnectHub community today."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-surface border border-white/[0.07] rounded-xl p-1 mb-8">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-accent text-white shadow-sm"
                    : "text-dim hover:text-ink"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-dim text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-dim text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ghost hover:text-dim transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-heart text-sm bg-heart/10 border border-heart/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-ghost text-xs">or</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full border border-white/10 hover:border-accent/40 hover:bg-accent/5 text-dim hover:text-ink font-medium py-3 rounded-xl transition-all duration-200 text-sm disabled:opacity-50"
              >
                Continue with demo account
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-dim text-xs font-medium mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-dim text-xs font-medium mb-1.5 uppercase tracking-wide">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="janedoe"
                    value={regUsername}
                    onChange={(e) =>
                      setRegUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-dim text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-dim text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ghost hover:text-dim transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-heart text-sm bg-heart/10 border border-heart/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-ghost text-xs mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
