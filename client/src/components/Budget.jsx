import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useEvent } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";

import { ReactComponent as IconBasket } from "../assets/images/icon-basket.svg";
import "../assets/styles/style-components/Budget.scss";

const Budget = () => {
    const { jwt } = useAuth();
    const { event, getEvent, loading } = useEvent();

    const [newBudgetItem, setNewBudgetItem] = useState({
        expense: '',
        cost: '',
    });
    const [totalCost, setTotalCost] = useState(() => {
        // Инициализация общей стоимости суммой начальных элементов
        return event?.budget ? event.budget.reduce((acc, item) => acc + parseFloat(item.cost), 0) : 0;
    });
    const [updatedBudget, setUpdatedBudget] = useState(event?.budget || []);

    const [sortDirection, setSortDirection] = useState('asc');
    const [sortedColumn, setSortedColumn] = useState(null);

    // Обновление updatedBudget при изменении event
    useEffect(() => {
        setUpdatedBudget(event?.budget || []);
    }, [event]);

    const sortData = (column) => {
        let sortedData;
        let isAsc;

        if (column === 'expense') {
            isAsc = sortedColumn === column && sortDirection === 'asc';
            sortedData = [...updatedBudget].sort((a, b) => {
                if (isAsc) {
                    return a[column].localeCompare(b[column]);
                } else {
                    return b[column].localeCompare(a[column]);
                }
            });
        } else {
            isAsc = sortedColumn === column && sortDirection === 'asc';
            sortedData = [...updatedBudget].sort((a, b) => {
                if (isAsc) {
                    return parseFloat(a[column]) - parseFloat(b[column]);
                } else {
                    return parseFloat(b[column]) - parseFloat(a[column]);
                }
            });
        }

        setUpdatedBudget(sortedData);
        setSortedColumn(column);
        setSortDirection(isAsc ? 'desc' : 'asc');
    };

    const handleAddItem = () => {
        // Проверка на наличие значения
        if (!newBudgetItem.expense || !newBudgetItem.cost) {
            toast.error("Заполните все поля!");
            return;
        }

        setUpdatedBudget((prevProgram) => [
            ...prevProgram,
            { expense: newBudgetItem.expense, cost: parseFloat(newBudgetItem.cost) },
        ]);

        setNewBudgetItem({
            expense: '',
            cost: '',
        });

        const newCost = parseFloat(newBudgetItem.cost);
        setTotalCost((prevTotal) => prevTotal + newCost);
    };

    const handleDeleteItem = (itemToDelete) => {
        const indexToDelete = updatedBudget.findIndex(item => item === itemToDelete);

        if (indexToDelete !== -1) {
            const updatedBudgetCopy = [...updatedBudget];
            updatedBudgetCopy.splice(indexToDelete, 1);
            setUpdatedBudget(updatedBudgetCopy);
        }

        const deletedCost = itemToDelete.cost;
        setTotalCost((prevTotal) => prevTotal - deletedCost);
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/events/${event.id}/budget`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ budget: updatedBudget }),
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
        <div className="event-detail__bottom-inner">
            <div className="budget__inputs">
                <input type="text"
                    className="modal__input"
                    placeholder="Название расходов"
                    name="titleBudget"
                    value={newBudgetItem.expense}
                    onChange={(e) => setNewBudgetItem((prevItem) => ({ ...prevItem, expense: e.target.value }))} />
                <input type="number"
                    className="modal__input"
                    placeholder="Цена"
                    value={newBudgetItem.cost}
                    onChange={(e) => setNewBudgetItem((prevItem) => ({ ...prevItem, cost: e.target.value }))} />
                <button className="main-button" onClick={handleAddItem}>Добавить</button>
            </div>
            <table className="budget__table">
                <thead>
                    <tr className="budget__table-row--head">
                        <th className="budget__table-column budget__table-column--head" onClick={() => sortData('expense')}>
                            Расходы {sortedColumn === 'expense' && <span className="budget__table-arrow--head">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th className="budget__table-column budget__table-column--head" onClick={() => sortData('cost')}>
                            Цена {sortedColumn === 'cost' && <span className="budget__table-arrow--head">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {updatedBudget.map((item, index) => (
                        <tr key={index} className="budget__table-row budget__table-item">
                            <td className="budget__table-column">{item.expense}</td>
                            <td className="budget__table-column">{item.cost} руб</td>
                            <td className="budget__table-column">
                                <IconBasket className="program__list-item-basket" onClick={() => handleDeleteItem(item)} />
                            </td>
                        </tr>
                    ))}
                    <tr className="budget__table-row budget__table-row--total">
                        <td className="budget__table-column">ИТОГО</td>
                        <td className="budget__table-column">{totalCost} руб</td>
                        <td className="budget__table-column"></td>
                    </tr>
                </tbody>
            </table>
            <div className="program__button" onClick={handleSaveChanges}>
                <button className="main-button">Сохранить изменения</button>
            </div>
        </div>
    );
};

export default Budget;