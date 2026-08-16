import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import authService from "../../services/authService";
import { getErrorMessage } from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
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
          <h1 className="font-display text-2xl font-semibold text-ink-100">Reset your password</h1>
          <p className="mt-1 text-sm text-ink-400">We'll email you a secure reset link</p>
        </div>

        <div className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6 backdrop-blur-sm">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="text-signal-teal" size={32} />
              <p className="text-sm text-ink-200">
                If an account exists for <span className="text-ink-100">{email}</span>, a reset
                link is on its way. It expires in 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} className="w-full">
                Send reset link
              </Button>
            </form>
          )}
        </div>

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-400 hover:text-signal-teal"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
