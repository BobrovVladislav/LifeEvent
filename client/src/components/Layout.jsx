import React from "react";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";

export const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className="wrapper">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </React.Fragment>
  );
};
