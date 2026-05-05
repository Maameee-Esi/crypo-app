import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetDetail from "./pages/AssetDetail.jsx";
import Explore from "./pages/Explore.jsx";
import Home from "./pages/Home.jsx";
import Learn from "./pages/Learn.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import WarningBanner from "./components/layout/WarningBanner.jsx";

function App() {
  return (
    <BrowserRouter>
      <WarningBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
