import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800">
        Form Builder
      </Link>
    </header>
  );
};

export default Header;
