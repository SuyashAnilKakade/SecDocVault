import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111a2e",
              color: "#e4e9f2",
              border: "1px solid #202e49",
              fontSize: "13px",
            },
            success: { iconTheme: { primary: "#2dd4bf", secondary: "#0a0f1d" } },
            error: { iconTheme: { primary: "#f2596b", secondary: "#0a0f1d" } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
