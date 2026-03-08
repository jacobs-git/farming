import ReactDOM from "react-dom/client";
import { AppRoutes } from "./app/routes";
import { AppProviders } from "./app/providers";
import "./index.css";
import "./styles/planner.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <AppRoutes />
  </AppProviders>
);
