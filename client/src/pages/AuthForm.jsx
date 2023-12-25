import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from 'react-router-dom'

import "../assets/styles/style-pages/form.scss";

function AuthForm() {
  const [isSignIn, setIsSignIn] = useState();
  const location = useLocation();

  const switchToSignIn = () => {
    if (!isSignIn) {
      setIsSignIn(true);
    }
  };
  const switchToSignUp = () => {
    if (isSignIn) {
      setIsSignIn(false);
    }
  };

  // Этот useEffect будет вызываться при изменении URL
  useEffect(() => {
    // Проверяем, находится ли текущий URL на странице входа
    setIsSignIn(location.pathname === "/login");
  }, [location.pathname]);

  return (
    <div className="modal">
      <div className="modal__inner">
        <div className="modal__nav">
          <Link to="/login" className={`modal__title ${isSignIn ? "active" : ""}`} onClick={switchToSignIn}>
            Вход
          </Link>
          <Link to="/registration" className={`modal__title ${isSignIn ? "" : "active"}`} onClick={switchToSignUp}>
            Регистрация
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthForm;
