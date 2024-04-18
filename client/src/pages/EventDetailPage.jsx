import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useEvent } from '../context/EventContext';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { Loader } from "../components/Loader";

import { ReactComponent as IconWedding } from "../assets/images/icon-wedding.svg";
import { ReactComponent as IconBirthday } from "../assets/images/icon-birthday.svg";
import { ReactComponent as IconCorporat } from "../assets/images/icon-corporat.svg";
import { ReactComponent as IconGuests } from "../assets/images/icon-guests.svg";
import { ReactComponent as IconProgram } from "../assets/images/icon-program.svg";
import { ReactComponent as IconBudget } from "../assets/images/icon-butget.svg";
import { ReactComponent as IconEdit } from "../assets/images/icon-edit.svg";
import "../assets/styles/style-pages/event-detail-page.scss";

function EventDetailPage() {
    const { getEvent, event, loading } = useEvent();
    const { jwt } = useAuth();
    const { eventID } = useParams();

    const location = useLocation();

    useEffect(() => {
        getEvent(eventID, jwt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventID]);

    const getImageUrl = (eventType) => {
        // возвращать URL изображения в зависимости от типа мероприятия
        switch (eventType) {
            case "День рождения":
                return <IconBirthday className="event-detail__main-img" />;
            case "Корпоратив":
                return <IconCorporat className="event-detail__main-img" />;
            case "Свадьба":
                return <IconWedding className="event-detail__main-img" />;
            default:
                return "/"; // Изображение по умолчанию
        }
    };

    if (loading) {
        return <Loader />
    }

    if (!event && !loading) {
        return <p>Ничего не найдено</p>;
    }

    return (
        <div className="event-detail">
            <div className="event-detail__main">
                <div className="container">
                    <div className="event-detail__main-inner">
                        <div className="event-detail__main-content">
                            {getImageUrl(event.type)}
                            <div className="event-detail__main-text">
                                <div className="event-detail__main-title">{event.name}</div>
                                <div className="event-detail__main-subtitle">{new Date(event.date).toLocaleDateString("en-GB")} |  {event.location} </div>
                            </div>
                        </div>
                        <div className="event-detail__main-tabs">
                            <div className={`event-detail__main-tab ${location.pathname === `/events/${event.id}/guests` ? 'event-detail__main-tab--active' : ''}`}>
                                <IconGuests className="event-detail__main-tab-icon" />
                                <Link to={`/events/${event.id}/guests`} className="event-detail__main-tab-text">ГОСТИ</Link>
                            </div>
                            <div className={`event-detail__main-tab ${location.pathname === `/events/${event.id}/program` ? 'event-detail__main-tab--active' : ''}`}>
                                <IconProgram className="event-detail__main-tab-icon" />
                                <Link to={`/events/${event.id}/program`} className="event-detail__main-tab-text">ПРОГРАММА</Link>
                            </div>
                            <div className={`event-detail__main-tab ${location.pathname === `/events/${event.id}/budget` ? 'event-detail__main-tab--active' : ''}`}>
                                <IconBudget className="event-detail__main-tab-icon" />
                                <Link to={`/events/${event.id}/budget`} className="event-detail__main-tab-text">БЮДЖЕТ</Link>
                            </div>
                        </div>
                        <Link to={`/events/${event.id}/update`} className="event-detail__main-icon">
                            <IconEdit className="event-detail__main-icon-edit" /> <span className="event-detail__main-icon-text">Редактировать</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="event-detail__bottom">
                    <Outlet />
                </div>
            </div>
        </div >
    );
}

export default EventDetailPage;