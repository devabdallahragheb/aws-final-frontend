import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import UploadImage from './components/UploadImage';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Header />
                <main className="p-4">
                    <Routes>
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/upload" element={<UploadImage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
