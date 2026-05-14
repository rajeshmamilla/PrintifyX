import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('cart');

        toast.success("Successfully logged out");
        navigate('/login');
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <p className="text-gray-500 font-semibold uppercase tracking-wider text-sm">Signing out safely...</p>
        </div>
    );
};

export default Logout;
