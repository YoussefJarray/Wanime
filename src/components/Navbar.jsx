import { FocusableElement, FocusableGroup } from "@arrow-navigation/react";
import { useNavigate } from "react-router-dom";
import { Home, TrendingUp, Search, Settings } from 'lucide-react'; 

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <FocusableGroup id="group-0" saveLast className="flex fixed flex-col gap-4 bg-gradient-to-r from-purple-950 p-4 items-center justify-center h-screen">
      <FocusableElement
        id="item-0-0"
        as="button"
        className="w-16 h-16 focus:bg-slate-950 flex items-center justify-center rounded-full" 
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            navigate(``);
          }
        }}
      >
        <Home size={24} color="white" /> 
      </FocusableElement>
      <FocusableElement
        id="item-0-1"
        as="button"
        className="w-16 h-16 focus:bg-slate-950 flex items-center justify-center rounded-full" 
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            navigate(`/trending`);
          }
        }}
      >
        <TrendingUp size={24} color="white" /> 
      </FocusableElement>
      <FocusableElement
        id="item-0-2"
        as="button"
        className="w-16 h-16 focus:bg-slate-950 flex items-center justify-center rounded-full" 
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            navigate(`/search`);
          }
        }}
      >
        <Search size={24} color="white" /> 
      </FocusableElement>
      <FocusableElement
        id="item-0-3"
        as="button"
        className="w-16 h-16 focus:bg-slate-950 flex items-center justify-center rounded-full" 
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            navigate(`/settings`);
          }
        }}
      >
        <Settings size={24} color="white" /> 
      </FocusableElement>
    </FocusableGroup>
  );
}