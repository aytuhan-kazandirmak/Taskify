import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style/reset.css";
import "./style/global.css";
import { Provider } from "react-redux";
import store from "./reducer/store.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
