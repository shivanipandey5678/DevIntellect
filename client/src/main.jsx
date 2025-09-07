import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContextProvider.jsx";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")).render(
  <ThemeProvider
    attribute="class" // Ensures the theme is applied as a class on the HTML element
    defaultTheme="light" // Default theme if no preference is set
    enableSystem // Enables system theme detection
  >
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </ThemeProvider>
);
     
