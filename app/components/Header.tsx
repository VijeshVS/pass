import React from 'react';
import { Ticket } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Ticket size={28} className="text-white" />
          <h1 className="text-2xl font-bold">PassPortal</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="/" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-blue-200 transition-colors duration-200 font-medium"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;