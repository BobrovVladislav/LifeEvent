import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useEvent } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";

import { ReactComponent as IconBasket } from "../assets/images/icon-basket.svg";
import "../assets/styles/style-components/Program.scss";

const Program = () => {
    const { jwt } = useAuth();
    const { event, getEvent, loading } = useEvent();

    const [newProgramItem, setNewProgramItem] = useState({
        name: '',
        time: '',
    });
    const [updatedProgram, setUpdatedProgram] = useState(event?.program || []);

    // Обновление updatedProgram при изменении event
    useEffect(() => {
        setUpdatedProgram(event?.program || []);
    }, [event]);


    const handleAddItem = () => {
        // Проверка на наличие значения
        if (!newProgramItem.name || !newProgramItem.time) {
            toast.error("Заполните все поля!");
            return;
        }

        setUpdatedProgram((prevProgram) => [
            ...prevProgram,
            { name: newProgramItem.name, time: newProgramItem.time },
        ]);

        setNewProgramItem({
            name: '',
            time: '',
        });
    };

    const handleDeleteItem = (itemToDelete) => {
        const indexToDelete = updatedProgram.findIndex(item => item === itemToDelete);

        if (indexToDelete !== -1) {
            const updatedProgramCopy = [...updatedProgram];
            updatedProgramCopy.splice(indexToDelete, 1);
            setUpdatedProgram(updatedProgramCopy);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event.id}/program`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ program: updatedProgram }),
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

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="program__inner">
            <div className="program__inputs">
                <input type="text"
                    className="modal__input"
                    placeholder="Введите пункт"
                    name="titleProgram"
                    value={newProgramItem.name}
                    onChange={(e) => setNewProgramItem((prevItem) => ({ ...prevItem, name: e.target.value }))} />
                <input type="time"
                    className="modal__input"
                    placeholder="Введите время"
                    value={newProgramItem.time}
                    onChange={(e) => setNewProgramItem((prevItem) => ({ ...prevItem, time: e.target.value }))} />
                <button className="main-button" onClick={handleAddItem}>Добавить</button>
            </div>
            <div className="program__list">
                <h3 className="program__list-title">ПРОГРАММА</h3>
                <div className="program__list-items">
                    {updatedProgram
                        .slice() // Создает копию массива, чтобы не изменять оригинал
                        .sort((a, b) => a.time.localeCompare(b.time)) // Сортирует массив по полю time
                        .map((item, index) => (
                            <div key={index} className="program__list-item">
                                <div className="program__list-item-order">{index + 1}</div>
                                <div className="program__list-item-content">
                                    <p className="program__list-item-name">{item.name}</p>
                                    <div className="program__list-item-time">
                                        {item.time}
                                    </div>
                                </div>
                                <IconBasket className="program__list-item-basket" onClick={() => handleDeleteItem(item)} />
                            </div>
                        ))}
                </div>
            </div>
            <div className="program__button" onClick={handleSaveChanges}>
                <button className="main-button">Сохранить изменения</button>
            </div>
        </div>
    );
};

export default Program;