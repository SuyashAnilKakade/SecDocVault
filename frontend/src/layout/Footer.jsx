const Footer = () => {
  return (
    <footer className="border-t border-ink-700 px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-ink-400 sm:flex-row">
        <p className="mono-meta">
          SecureDoc Vault · AES-256 encrypted at rest
        </p>
        <p>&copy; {new Date().getFullYear()} SecureDoc Vault. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
