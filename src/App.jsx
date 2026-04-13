import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "./Globalstyles";
import Login from "./Components/Login/Login";
import Page from "./Components/Pageacesso/page";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <>
      <GlobalStyles />
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pageacesso" element={<Page />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;