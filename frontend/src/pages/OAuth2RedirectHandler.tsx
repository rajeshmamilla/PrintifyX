import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getUrlParameter = (name: string) => {
            name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
            const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            const results = regex.exec(location.search);
            return results === null
                ? ""
                : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        const token = getUrlParameter("token");

        if (token) {
            localStorage.setItem("token", token);
            // You might want to fetch user details here and store them in context/state
            navigate("/", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, [location, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Logging you in...</h2>
                <p className="text-gray-500">Please wait while we complete the authentication.</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
