import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        // Clear cart if needed (this logic is handled by cart.service in some projects but here we stick to simple)
        localStorage.removeItem('cart');

        // Redirect to login after a tiny delay for visual feedback if needed, 
        // but immediate is cleaner for logout.
        navigate('/login');
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Signing out safely...</p>
        </div>
    );
};

export default Logout;
