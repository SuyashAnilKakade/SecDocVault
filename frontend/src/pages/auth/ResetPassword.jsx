import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import authService from "../../services/authService";
import { getErrorMessage } from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setError("");
    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      toast.success("Password reset — sign in with your new password");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vault-grid flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-signal-teal/10 text-signal-teal">
            <ShieldCheck size={24} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-100">Set a new password</h1>
          <p className="mt-1 text-sm text-ink-400">Make it something you haven't used before</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink-700 bg-ink-800/60 p-6 backdrop-blur-sm">
          <Input
            label="New password"
            type="password"
            icon={Lock}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm new password"
            type="password"
            icon={Lock}
            placeholder="Repeat password"
            value={confirm}
            error={error}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button type="submit" loading={loading} icon={ArrowRight} iconPosition="right" className="w-full">
            Reset password
          </Button>
        </form>

        <Link to="/login" className="mt-6 block text-center text-sm text-ink-400 hover:text-signal-teal">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
