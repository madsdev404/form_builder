import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center text-xl font-bold text-gray-800"
      >
        <img src="/logo.png" alt="Form Builder Logo" className="h-8 w-auto" />
        <span>Form Builder</span>
      </Link>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-900"
        title="Logout"
      >
        <FiLogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </header>
  );
};

export default Header;
