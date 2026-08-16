import { Link } from "react-router-dom";
import { ShieldQuestion } from "lucide-react";
import Button from "../components/ui/Button";

const NotFound = () => (
  <div className="vault-grid flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-900 px-4 text-center">
    <ShieldQuestion size={40} className="text-ink-500" />
    <h1 className="font-display text-3xl font-semibold text-ink-100">404</h1>
    <p className="max-w-xs text-sm text-ink-400">
      This page doesn't exist, or it's locked behind a door we couldn't find.
    </p>
    <Link to="/">
      <Button>Back to safety</Button>
    </Link>
  </div>
);

export default NotFound;
