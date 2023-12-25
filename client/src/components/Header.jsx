import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ReactComponent as UnionIcon } from "../assets/images/icon-union.svg";
import "../assets/styles/style-components/Header.scss";

export const Header = () => {
  const { jwt, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      toast.success("Вы вышли из системы.");
      logout(); // Обновляем статус авторизации
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
      toast.error("Произошла ошибка при выходе из системы.");
    }
  };
  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <Link to="/" className="header__logo">
              <span className="header__logo-color">Лайф</span>Ивент
            </Link>
            <nav>
              <ul className="header__nav">
                {jwt && user ? (
                  <li className="header__nav-item">
                    <UnionIcon className="header__nav-icon" /> <span className="header__nav-item-text">{user.username}</span>
                    < div className="dropdown-menu">
                      <ul className="dropdown-menu__inner">
                        <Link to="/events/create" className="dropdown-menu__item">
                          Создать
                        </Link>
                        <Link to="/events/all" className="dropdown-menu__item">
                          Мероприятия
                        </Link>
                        <li
                          className="dropdown-menu__item"
                          onClick={handleLogout}
                        >
                          Выйти
                        </li>
                      </ul>
                    </div>
                  </li>

                ) : (
                  <Link to="/login" className="header__nav-item">
                    <UnionIcon className="header__nav-icon" /> <span className="header__nav-item-text">Войти</span>
                  </Link>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header >
    </div >
  );
};
