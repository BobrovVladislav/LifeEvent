import React from "react";
import { Link } from 'react-router-dom'

import "../assets/styles/style-components/Footer.scss";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__inner-top">
            <div className="footer__main">
              <Link to="/" className="footer__main-logo">
                <span className="footer__main-logo-color">Лайф</span>Ивент
              </Link>
              <div>
                <p className="footer__main-subtitle">Служба поддержки:</p>
                <p className="footer__main-number">(800) 555-35-35</p>
              </div>
              <p className="footer__main-address">
                г. Воронеж, Железнодорожный район, Ленинский проспект, 14
              </p>
              <div className="footer__main-email">
                bobroff.vladisl@yandex.ru
              </div>
            </div>
            <div className="footer__categories">
              <div className="footer__title">ССЫЛКИ</div>
              <Link to="/#type-events" className="footer__link">ВИДЫ МЕРОПРИЯТИЙ</Link>
              <Link to="/#desc-functions" className="footer__link">ОПИСАНИЕ ФУНКЦИЙ</Link>
              <Link to="/events/all" className="footer__link">ВАШИ МЕРОПРИЯТИЯ</Link>
              <Link to="/events/create" className="footer__link">СОЗДАТЬ МЕРОПРИЯТИЕ</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__inner-bottom">
            <p>ЛайфИвент © 2023. Все права защищены</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
