import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}`);
      const redirectTo = location.state?.from || (user.role === "admin" ? "/admin" : "/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vault-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-4">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-signal-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-signal-amber/10 blur-3xl" />

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-signal-teal/10 text-signal-teal">
            <ShieldCheck size={24} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-100">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-400">Sign in to your encrypted vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink-700 bg-ink-800/60 p-6 backdrop-blur-sm">
          <Input
            label="Email address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
          <div>
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
            <div className="mt-1.5 text-right">
              <Link to="/forgot-password" className="text-xs text-ink-400 hover:text-signal-teal">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" loading={loading} icon={ArrowRight} iconPosition="right" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-signal-teal hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
