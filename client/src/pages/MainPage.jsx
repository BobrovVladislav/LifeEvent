import React from "react";

import "../assets/styles/style-pages/main-page.scss";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

function MainPage() {
  const { jwt } = useAuth();
  return (
    <div>
      <section className="welcome">
        <div className="container">
          <div className="welcome__inner">
            <h1 className="welcome__title">
              Твоё мероприятие <br /> твой выбор
            </h1>
            <div className="welcome__info">
              <h3 className="welcome__info-title">
                Спланируйте мероприятие своей мечты
              </h3>
              <p className="welcome__info-text">
                Свадьбы, корпоративы, дни рождения. Неважно, <span>ЛайфИвент</span>  поможет вам создать мероприятия, которые вы больше нигде не встретите.
              </p>
              <Link to={jwt ? "/events/create" : "/login"} className="main-button">Начать планирование</Link>
            </div>
          </div>
        </div>
      </section>
      <section id="type-events" className="events">
        <div className="container">
          <div className="events__inner">
            <h2>Различные виды мероприятий</h2>
            <div className="events__list">
              <div className="events__item">
                <img src="/images/events/wedding.png" alt="СВАДЬБЫ" className="events__item-img" />
                <div className="events__item-title">СВАДЬБЫ</div>
              </div>
              <div className="events__item">
                <img src="/images/events/corporat.png" alt="КОРПОРАТИВЫ" className="events__item-img" />
                <div className="events__item-title">КОРПОРАТИВЫ</div>
              </div>
              <div className="events__item">
                <img src="/images/events/birthday.png" alt="ДНИ РОЖДЕНИЯ" className="events__item-img" />
                <div className="events__item-title">ДНИ РОЖДЕНИЯ</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="places">
        <div className="container">
          <div className="places__inner">
            <h2>Места по душе для каждого</h2>
            <div className="places__list">
              <div className="places__item">
                <img src="/images/places/abudabi.png" alt="" className="places__item-img" />
                <div className="places__item-title">АБУ-ДАБИ</div>
              </div>
              <div className="places__item">
                <img src="/images/places/india.png" alt="" className="places__item-img" />
                <div className="places__item-title">ИНДИЯ</div>
              </div>
              <div className="places__item">
                <img src="/images/places/maldives.png" alt="" className="places__item-img" />
                <div className="places__item-title">МАЛЬДИВЫ</div>
              </div>
              <div className="places__item">
                <img src="/images/places/dubai.png" alt="" className="places__item-img" />
                <div className="places__item-title">ДУБАЙ</div>
              </div>
              <div className="places__item">
                <img src="/images/places/india.png" alt="" className="places__item-img" />
                <div className="places__item-title">ИНДИЯ</div>
              </div>
              <div className="places__item">
                <img src="/images/places/abudabi.png" alt="" className="places__item-img" />
                <div className="places__item-title">АБУ-ДАБИ</div>
              </div>
              <div className="places__item">
                <img src="/images/places/dubai.png" alt="" className="places__item-img" />
                <div className="places__item-title">ДУБАЙ</div>
              </div>
              <div className="places__item">
                <img src="/images/places/maldives.png" alt="" className="places__item-img" />
                <div className="places__item-title">МАЛЬДИВЫ</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="banner">
        <div className="container">
          <div className="banner__inner">
            <img className="banner__inner-img" src="/images/banner.png" alt="banner" />
            <div className="banner__inner-content">
              <div className="banner__title">Давайте начнем готовить Ваше мероприятие!</div>
              <div className="banner__text">Начнем вашу подготовку мероприятия сегодня, превратив ваши мечты в замечательные моменты.</div>
              <Link to={jwt ? "/events/create" : "/login"} className="main-button banner__button">Создать мероприятие</Link>
            </div>
          </div>
        </div>
      </section>
      <section id="desc-functions" className="advantages">
        <div className="container">
          <div className="advantages__inner">
            <div className="advantages__item">
              <div className="advantages__item-text">
                <div className="advantages__item-title">Выбери место</div>
                <div className="advantages__item-subtitle">Предоставьте уникальное и комфортное место для вашего события, учитывая атмосферу, расположение и стиль.</div>
              </div>
            </div>
            <div className="advantages__item">
              <div className="advantages__item-text">
                <div className="advantages__item-title">Добавь гостей</div>
                <div className="advantages__item-subtitle"> Определите количество и тип гостей, которых вы хотели бы пригласить, учтите их интересы и предпочтения.</div>
              </div>
            </div>
            <div className="advantages__item">
              <div className="advantages__item-text">
                <div className="advantages__item-title">Создай программу</div>
                <div className="advantages__item-subtitle">Разработайте интересный и хорошо структурированный план события, включая различные мероприятия, развлечения и временные рамки.</div>
              </div>
            </div>
            <div className="advantages__item">
              <div className="advantages__item-text">
                <div className="advantages__item-title">
                  Управляй бюджетом
                </div>
                <div className="advantages__item-subtitle">Составьте детальный бюджет, включая все расходы, связанные с организацией события, и следите за его выполнением, чтобы избежать финансовых неожиданностей.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
