import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ReactComponent as UnionIcon } from "../assets/images/icon-union.svg";
import "../assets/styles/style-components/Header.scss";

export const Header = () => {
  const { jwt, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Применение стилей к body при изменении isMenuOpen
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    // Очистка эффекта
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isMenuOpen]);

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
                  <div className="dropdown-menu">
                    <ul className="dropdown-menu__inner">
                      {user.role === "admin" && (
                        <Link to="/admin" className="dropdown-menu__item">
                          Панель администратора
                        </Link>
                      )}
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
            <div className="header__mobile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                // Крестик для закрытого состояния
                <div className="header__mobile-close">
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              ) : (
                // Три полоски для открытого состояния
                <div className="header__mobile-burger">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              )}
              {isMenuOpen && (
                <ul className="header__mobile-menu">
                  {jwt && user ? (
                    <div className="header__mobile-inner">
                      <li className="header__mobile-item header__mobile-item--name">
                        {user.username}
                      </li>
                      <hr className="header__mobile-divider" />
                      {user.role === "admin" && (
                        <li className="header__mobile-item">
                          <Link to="/admin">Панель администратора</Link>
                        </li>
                      )}
                      <li className="header__mobile-item">
                        <Link to="/events/create">Создать</Link>
                      </li>
                      <li className="header__mobile-item">
                        <Link to="/events/all">Мероприятия</Link>
                      </li>
                      <li className="header__mobile-item" onClick={handleLogout}>
                        Выйти
                      </li>
                    </div>
                  ) : (
                    <li className="header__mobile-item">
                      <Link to="/login">Войти</Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header >
  );
};
