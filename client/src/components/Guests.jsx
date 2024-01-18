import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useEvent } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";

import { ReactComponent as IconInvite } from "../assets/images/icon-invite.svg";
import { ReactComponent as UnionIcon } from "../assets/images/icon-union.svg";
import { ReactComponent as IconHuman } from "../assets/images/icon-human.svg";
import { ReactComponent as IconSearch } from "../assets/images/icon-search.svg";
import "../assets/styles/style-components/Guests.scss";

const Guests = () => {
    const { jwt } = useAuth();
    const { event, getEvent, loading } = useEvent();

    const [newGuest, setNewGuest] = useState({
        fullName: '',
        email: '',
        status: ''
    });
    const [updatedGuests, setUpdatedGuests] = useState(event?.guests || []);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredGuests = updatedGuests.filter((guest) =>
        guest.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Обновление updatedProgram при изменении event
    useEffect(() => {
        setUpdatedGuests(event?.guests || []);
    }, [event]);


    const handleAddItem = () => {
        // Проверка на наличие значения
        if (!newGuest.fullName || !newGuest.email) {
            toast.error("Заполните все поля!");
            return;
        }

        // Простая проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newGuest.email)) {
            toast.error("Введите корректный email!");
            return;
        }

        setUpdatedGuests((prevGuests) => [
            ...prevGuests,
            { fullName: newGuest.fullName, email: newGuest.email, status: "Не приглашён" },
        ]);

        setNewGuest({
            fullName: '',
            email: '',
            status: ''
        });
    };

    const handleDeleteItem = (itemToDelete) => {
        const indexToDelete = updatedGuests.findIndex(item => item === itemToDelete);

        if (indexToDelete !== -1) {
            const updatedGuestsCopy = [...updatedGuests];
            updatedGuestsCopy.splice(indexToDelete, 1);
            setUpdatedGuests(updatedGuestsCopy);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event.id}/guests`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ guests: updatedGuests }),
            });

            const data = await response.json();

            if (response.ok) {
                await getEvent(event.id, jwt);
                console.log('Event after update:', event);
                toast.success(data.message);
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error("Ошибка при обновлении программы", error);
            toast.error(error.message || "Произошла ошибка при обновлении программы");
        }
    };

    const handleInviteGuests = async () => {
        try {
            // Проверка, были ли сохранены изменения
            if (updatedGuests !== event.guests) {
                toast.warn("Сохраните изменения!");
                return;
            }

            const invitedGuests = updatedGuests.filter((guest) => guest.status !== "Приглашён");
            if (invitedGuests.length === 0) {
                toast.info("Все гости уже приглашены.");
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event.id}/guests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ guests: updatedGuests }),
            });

            const data = await response.json();

            if (response.ok) {
                await getEvent(event.id, jwt);
                toast.success(data.message);
                // Проверка на наличие неудачных приглашений и вывод сообщения для каждого из них
                if (data.failedInvitations && data.failedInvitations.length > 0) {
                    data.failedInvitations.forEach((failedGuest) => {
                        toast.warn(`Не удалось доставить приглашение для гостя: ${failedGuest.fullName} (${failedGuest.email})`);
                    });
                }
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error("Ошибка при приглашении гостей", error);
            toast.error(error.message || "Произошла ошибка при приглашении гостей");
        }
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="event-detail__bottom-inner">
            <div className="event-detail__bottom-inputs">
                <input type="text"
                    className="modal__input"
                    placeholder="Введите ФИО"
                    name="titleProgram"
                    value={newGuest.fullName}
                    onChange={(e) => setNewGuest((prevItem) => ({ ...prevItem, fullName: e.target.value }))} />
                <input type="email"
                    className="modal__input"
                    placeholder="Введите email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest((prevItem) => ({ ...prevItem, email: e.target.value }))} />
                <button className="main-button" onClick={handleAddItem}>Добавить</button>
            </div>
            <div className="event-detail__bottom-list">
                <div className="guests__list-controls">
                    <div className="guests__list-total">
                        {updatedGuests.length} <UnionIcon />
                    </div>
                    <div className="guests__list-search-group">
                        <input type="search" className="guests__list-search" placeholder="Поиск гостей" value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <IconSearch className="guests__list-search-icon" />
                    </div>
                    <button className="guests__list-invite" onClick={handleInviteGuests}>
                        <IconInvite className="guests__list-invite-btn" />
                    </button>
                </div>

                <div className="event-detail__bottom-list-items">
                    {filteredGuests.length === 0 ? (
                        <div className="not-found">Гости не найдены</div>
                    ) : (
                        filteredGuests.map((item, index) => (
                            <div key={index} className="guests__list-item">
                                <div className="guests__list-item-content">
                                    <IconHuman className="guests__list-item-icon" />
                                    <div className="guests__list-item-credential">
                                        <div className="guests__list-item-fullName">{item.fullName}</div>
                                        <div className="program__list-item-email">
                                            {item.email}
                                        </div>
                                    </div>
                                    <div className={`guests__list-item-status  ${item.status === "Приглашён" ? "invited" : "not-invited"}`}>{item.status}</div>
                                </div>
                                <button className="guests__list-item-button" onClick={() => handleDeleteItem(item)}>X</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="program__button" onClick={handleSaveChanges}>
                <button className="main-button">Сохранить изменения</button>
            </div>
        </div>
    );
};

export default Guests;