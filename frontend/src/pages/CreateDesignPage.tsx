import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CreateDesignPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-100 shadow-sm max-w-md mx-auto my-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Your Design</h1>
                    <p className="text-gray-500 font-medium">This page is under development</p>
                    <div className="mt-8">
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all font-sans"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateDesignPage;
