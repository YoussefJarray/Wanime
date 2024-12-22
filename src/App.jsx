import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import AnimeDetail from "./pages/AnimeDetail";
import Episode from "./pages/Episode";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setLoading(false);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
                <div className="w-96 h-2 bg-purple-500/30 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-purple-500 rounded-full transition-all duration-200 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/watch/:id/episode/:episodeNumber"
                element={
                    <div className="h-screen w-screen bg-slate-950">
                        <Episode />
                    </div>
                }
            />
            <Route
                path="*"
                element={
                    <div className="flex h-screen bg-slate-950">
                        <div className="fixed h-full">
                            <Navbar />
                        </div>
                        <div className="flex-1 ml-24 overflow-x-hidden text-white">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/trending" element={<Trending />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/anime/:id" element={<AnimeDetail />} />
                            </Routes>
                        </div>
                    </div>
                }
            />
        </Routes>
    );
}

export default App;
