import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import DonationPage from "./pages/DonationPage";
import ApplyDonationPJPage from "./pages/ApplyDonationPJPage";
import SignUpPage from "./pages/SignUpPage";
import MyPage from "./pages/MyPage";
import OrganizationMyPage from "./pages/OrganizationMypage";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/applyDonatePJ" element={<ApplyDonationPJPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/organization" element={<OrganizationMyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
