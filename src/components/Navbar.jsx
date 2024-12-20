import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Settings, Film } from 'lucide-react';
import { FocusableElement, FocusableGroup } from "@arrow-navigation/react";

const Navbar = () => {
   return (
    <nav
      className="fixed left-0 top-0 h-full w-24 bg-gray-800 flex flex-col items-center py-8 focus:outline-none"
    >
      <FocusableGroup id="group-0">
        <FocusableElement id="item-0-0" as="button" className="w-16 h-16 bg-red-500 focus:bg-red-600" />
        <FocusableElement id="item-0-1" as="button" className="w-16 h-16 bg-blue-500 focus:bg-blue-600" />
        <FocusableElement id="item-0-2" as="button" className="w-16 h-16 bg-teal-500 focus:bg-teal-600" />
      </FocusableGroup>
    </nav>
  );
};

export default Navbar;