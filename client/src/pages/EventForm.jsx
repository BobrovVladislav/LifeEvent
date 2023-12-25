import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

import { ReactComponent as IconArrow } from "../assets/images/IconArrow.svg";
import "../assets/styles/style-pages/form.scss";

function EventForm() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");

    const { eventID } = useParams();
    const [event, setEvent] = useState(null);
    const { jwt } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = eventID ? `${process.env.REACT_APP_SERVER_URL}/events/${eventID}` : `${process.env.REACT_APP_SERVER_URL}/events/create`;
            // Отправка данных на сервер
            const response = await fetch(url, {
                method: eventID ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    name,
                    type,
                    date,
                    location,
                }),
            });

            const data = await response.json();

            // Обработка ответа от сервера
            if (response.ok) {
                toast.success(data.message);
                navigate(eventID ? `/events/${eventID}/guests` : "/events/all"); // Перенаправление на страницу мероприятий
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error("Ошибка при создании мероприятия", error);
            toast.error(error.message || "Произошла ошибка при создании/обновлении мероприятия");
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/events/${eventID}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setEvent(data.event);
                    setName(data.event.name);
                    setType(data.event.type);
                    setDate(new Date(data.event.date).toISOString().split('T')[0] || "");
                    setLocation(data.event.location);
                } else {
                    console.error("Ошибка при получении мероприятия");
                }
            } catch (error) {
                console.error("Ошибка при отправке запроса на получение мероприятия", error);
            }
        };

        fetchEvent();
    }, [eventID]);

    if (eventID && !event) {
        navigate("/");
    }

    return (
        <div className="modal">
            <div className="modal__inner">
                <div className="modal__name">{eventID ? "Редактирование мероприятия" : "Создание мероприятия"}</div>
                <form className="modal__content" onSubmit={handleSubmit}>
                    <div className="modal__block-input">
                        <label htmlFor="eventName" className="modal__label">
                            Название
                        </label>
                        <input
                            type="text"
                            id="eventName"
                            className="modal__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal__block-input">
                        <label htmlFor="eventType" className="modal__label">
                            Тип мероприятия
                        </label>
                        <select
                            id="eventType"
                            className="modal__input modal__select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="" disabled hidden>
                                Выберите тип мероприятия
                            </option>
                            <option value="День рождения">День рождения</option>
                            <option value="Корпоратив">Корпоратив</option>
                            <option value="Свадьба">Свадьба</option>
                        </select>
                    </div>
                    <div className="modal__block-input">
                        <label htmlFor="eventDate" className="modal__label">
                            Дата
                        </label>
                        <input
                            type="date"
                            id="eventDate"
                            className="modal__input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal__block-input">
                        <label htmlFor="eventPlace" className="modal__label">
                            Место
                        </label>
                        <input
                            type="text"
                            id="eventPlace"
                            className="modal__input"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Введите город"
                            required
                        />
                    </div>
                    <button type="submit" className="modal__button">
                        {eventID ? "Обновить" : "Создать"}
                        <IconArrow className="icon-arrow" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
