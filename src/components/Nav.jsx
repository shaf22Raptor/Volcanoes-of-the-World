// This page defines the function used to render navigation bar.
// Used repeatedly throughout application
// CSS styling handeld in App.css

import { useState, useEffect } from 'react';


// navigation links
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // used to store if user is logged in or not
  const token = sessionStorage.getItem("token");  // used to store token given by server if it exists

  // logs user out
  const handleLogout = () => {
    // remove token from session storage and render login / register button
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // if token is avialble, then logged in is true, and hence logout button will be rendered
    if (token !== null) {
      setIsLoggedIn(true);
    }
  }, [token]);

  return (
    <nav>
      <ul>
        <li>
        <a href="/">Home</a>
        </li>
        <li>
        <a href="/volcanoes">Volcanoes</a>
        </li>
        <li>
          {/*Change login button to logout if user is signed in */}
          {isLoggedIn ? (
            <a href="/loginRegister" onClick={handleLogout}>Logout</a>
          ) : (
            <a href="/loginRegister">Login / Register</a>
          )}
        </li>
      </ul>
    </nav>
  );
}
