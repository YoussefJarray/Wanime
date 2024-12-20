import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import pages
import Home from './pages/Home';
import Trending from './pages/Trending';
import Search from './pages/Search';
import Settings from './pages/Settings';
import AnimeDetail from './pages/AnimeDetail';
import { FocusableElement, FocusableGroup } from "@arrow-navigation/react";

function App() {
  return (
    <div className="flex flex-row min-h-screen bg-gray-900" tabIndex={0} onFocus={() => setFocusedElement(null)}> 
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 ml-24 bg-red-500" tabIndex={0} onFocus={() => setFocusedElement(null)}> 
        <div className="container p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;