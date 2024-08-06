// Function defined to show header of web application

import Nav from "./Nav";

// the header displays icon in top left, along with nav bar
export default function Header() {
  return (
    <header>
      {/* icon */}
      <div id="icon">
        <img src="img/icon.png" alt="Icon" />
      </div>

      <Nav />
    </header>
  );
}
