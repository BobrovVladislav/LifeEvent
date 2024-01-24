import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader } from "../components/Loader";

import { ReactComponent as IconWedding } from "../assets/images/icon-wedding.svg";
import { ReactComponent as IconBirthday } from "../assets/images/icon-birthday.svg";
import { ReactComponent as IconCorporat } from "../assets/images/icon-corporat.svg";
import { ReactComponent as IconClose } from "../assets/images/icon-close.svg";
import "../assets/styles/style-pages/events-page.scss";

function EventsPage() {
  const [events, setEvents] = useState(null);

  const { jwt } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/events/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          }
        });
        const data = await response.json();
        setEvents(data.events);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении мероприятий", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []); // Пустой массив зависимостей означает, что useEffect будет вызываться только один раз при монтировании компонента

  const handleDeleteEvent = async (eventID) => {
    try {
      // Отправляем запрос на удаление мероприятия
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Обновляем список мероприятий после удаления
        const updatedEvents = events.filter((event) => event.id !== eventID);
        setEvents(updatedEvents);
        toast.success(data.message);
      } else {
        console.error("Ошибка при удалении мероприятия");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса на удаление мероприятия", error);
      toast.error(error.message || "Произошла ошибка при удалении мероприятия");
    }
  };

  const calculateTotalBudget = (budget) => {
    return budget.reduce((total, item) => total + item.cost, 0);
  };

  const getImageUrl = (eventType) => {
    // возвращать URL изображения в зависимости от типа мероприятия
    switch (eventType) {
      case "День рождения":
        return <IconBirthday className="all-events__item-img" />;
      case "Корпоратив":
        return <IconCorporat className="all-events__item-img" />;
      case "Свадьба":
        return <IconWedding className="all-events__item-img" />;
      default:
        return "/"; // Изображение по умолчанию
    }
  };

  return (
    <div className="container">
      <div className="all-events">
        <h2 className="all-events__title">Мои мероприятия</h2>
        <div className="all-events__list">
          {loading ? (
            <Loader />
          ) : events !== null && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="all-events__item">
                <div className="all-events__item-main">
                  {getImageUrl(event.type)}
                  <div className="all-events__item-name">{event.name}</div>
                  <div className="all-events__item-date">{new Date(event.date).toLocaleDateString("en-GB")}</div>
                  <div className="all-events__item-location">{event.location}</div>

                </div>
                <div className="all-events__item-secondary">
                  <div className="all-events__item-secondary-item">
                    <div className="all-events__item-title">Гости</div>
                    <Link to={`/events/${event.id}/guests`} className={`all-events__item-${event.guests.length > 0 ? 'value' : 'link'}`}>
                      {event.guests.length !== 0 ? (
                        `${event.guests.length} чел`
                      ) : (
                        "Указать..."
                      )}
                    </Link>
                  </div>
                  <div className="all-events__item-divider" />
                  <div className="all-events__item-secondary-item">
                    <div className="all-events__item-title">Программа</div>
                    <Link to={`/events/${event.id}/program`} className={`all-events__item-${event.program.length !== 0 ? 'value' : 'link'}`}>
                      {event.program.length !== 0 ? (
                        `${event.program.length} пунктов`
                      ) : (
                        "Указать..."
                      )}
                    </Link>
                  </div>
                  <div className="all-events__item-divider" />
                  <div className="all-events__item-secondary-item">
                    <div className="all-events__item-title">Бюджет</div>
                    <Link to={`/events/${event.id}/budget`} className={`all-events__item-${event.budget.length !== 0 ? 'value' : 'link'}`}>
                      {event.budget.length !== 0 ? (
                        `${calculateTotalBudget(event.budget)} руб`
                      ) : (
                        "Указать..."
                      )}
                    </Link>
                  </div>
                </div>
                <div className="all-events__item-icons">
                  <IconClose className="all-events__item-icon" onClick={() => handleDeleteEvent(event.id)} />
                </div>

              </div>
            ))
          ) : (
                <p style={{ textAlign: 'center', margin: '50px 0', fontSize: '22px' }}А>Список мероприятий пуст</p>
          )}
        </div>
        <Link to="/events/create" className="main-button">
          Создать мероприятие
        </Link>
      </div>
    </div >
  );
}

export default EventsPage;