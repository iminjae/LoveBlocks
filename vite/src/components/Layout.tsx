import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
// import Footer from "./Footer";

const Layout: FC = () => {

  return (
    <div>
      <Header />
      <div>
        <Outlet context={{  }} />
      </div>
      {/* <Footer />  */}
    </div>
  );
};

export default Layout;