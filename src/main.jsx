import { createRoot } from 'react-dom/client'
import App from "./App"
import AuthProvider from "./AuthProvider"
import { BrowserRouter } from 'react-router-dom';
import "./index.css";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <div className="top-bar" ></div>
            <div className="top-screen">
                <App />
            </div>
        </AuthProvider>
    </BrowserRouter>
);
