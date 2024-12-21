import React, { useRef } from "react";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import AnimeDetail from "./pages/AnimeDetail";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="flex flex-row bg-slate-950 text-white font-mono overflow-x-hidden">
            <Navbar />
            <div className="p-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/anime/:id" element={<AnimeDetail />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
