import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HyeonyongPage from "./pages/HyeonyongPage";
import SungwooPage from "./pages/SungwooPage";
import DaehwanPage from "./pages/DaehwanPage";
import MinjaePage from "./pages/MinjaePage";
import Layout from "./components/Layout";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hyeonyong" element={<HyeonyongPage />} />
          <Route path="/sungwoo" element={<SungwooPage />} />
          <Route path="/daehwan" element={<DaehwanPage />} />
          <Route path="/minjae" element={<MinjaePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
