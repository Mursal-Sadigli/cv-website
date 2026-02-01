import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/features/authSlice.js";
import { BarChart3 } from "lucide-react";

const Navbar = () => {
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
    dispatch(logout())
  };

  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Salam, {user?.name}</p>
          <Link 
            to="/app/analytics"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            title="Analitika"
          >
            <BarChart3 className="size-5" />
            <span className="max-sm:hidden">Analitika</span>
          </Link>
          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Çıxış
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
