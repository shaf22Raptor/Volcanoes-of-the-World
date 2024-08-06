import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// all pages in web application imported so routes can be set using react-router
import Home from './pages/Home';
import Volcanoes from './pages/Volcanoes';
import LoginRegister from './pages/LoginRegister';
import Header from './components/Header';
import Volcano from './pages/Volcano';



function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Header />
      {/* the content */}
      {/*Routes for web page defined here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/volcanoes" element={<Volcanoes />} />
        <Route path="/volcano" element={<Volcano />} />
        <Route path="/loginRegister" element={<LoginRegister />} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
