import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";

import { ReactComponent as IconBasket } from "../assets/images/icon-basket.svg";
import "../assets/styles/style-pages/admin-page.scss";

function AdminPage() {
    const { jwt } = useAuth();

    const [users, setUsers] = useState(null);
    const [topUser, setTopUser] = useState(null);
    const [maxBudget, setMaxBudget] = useState(null);
    const [totalEvents, setTotalEvents] = useState(null);

    const [sortDirection, setSortDirection] = useState('asc');
    const [sortedColumn, setSortedColumn] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users && users.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil((users && users.length) / itemsPerPage);

    const sortData = (column) => {
        const isAsc = sortedColumn === column && sortDirection === "asc";
        const sortedData = [...users].sort((a, b) => {
            if (column === "events") {
                return isAsc ? a[column] - b[column] : b[column] - a[column];
            } else {
                return isAsc
                    ? a[column].localeCompare(b[column])
                    : b[column].localeCompare(a[column]);
            }
        });

        setUsers(sortedData);
        setSortedColumn(column);
        setSortDirection(isAsc ? "desc" : "asc");
    };

    const handleDeleteItem = async (userID) => {
        try {
            const confirmDelete = window.confirm("Вы уверены, что хотите удалить этого пользователя? Отменить это действие будет невозможно!");

            if (confirmDelete) {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${userID}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userID));
                    toast.success(data.message);
                } else {
                    throw new Error(data.error);
                }
            } else {
                return;
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса на удаление пользователя", error);
            toast.error(error.message || `Ошибка при удалении пользователя`);
        }
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/all`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setUsers(data.users);
                    setTopUser(data.topUser);
                    setMaxBudget(data.maxBudget);
                    setTotalEvents(data.totalEvents);
                } else {
                    toast.error("Ошибка при получении пользователей");
                }
            } catch (error) {
                toast.error("Ошибка при отправке запроса на получение пользователей", error);
            }
        };

        getUsers();
    }, []);

    return (
        <div className="admin">
            <div className="admin__main">
                <div className="container">
                    <div className="admin__main-inner">
                        <h2 className="admin__title">
                            Статистика LifeEvent.ru
                        </h2>
                        <div className="admin__main-content">
                            <div className="admin__main-item">
                                {topUser && (
                                    <>
                                        У пользователя{" "}
                                        <span className="admin__main-item--sub">{topUser.username}</span>{" "}
                                        больше всего мероприятий:
                                        <span className="admin__main-item--sub"> {topUser.totalProjects} шт</span>
                                    </>
                                )}
                            </div>
                            <div className="admin__main-item">
                                {maxBudget && (
                                    <>
                                        Максимальный бюджет мероприятия:{" "}
                                        <span className="admin__main-item--sub">{maxBudget} руб</span>
                                    </>
                                )}
                            </div>
                            <div className="admin__main-item">
                                {totalEvents && (
                                    <>
                                        Всего создано мероприятий:{" "}
                                        <span className="admin__main-item--sub">{totalEvents} шт</span>
                                    </>
                                )}
                            </div>
                            <div className="admin__main-item">
                                {`Всего зарегистрировано пользователей: `}
                                <span className="admin__main-item--sub">
                                    {users ? users.length : 0} чел
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="event-detail__bottom">
                    <div className="event-detail__bottom-inner">
                        <h2 className="admin__title">
                            Список пользователей сайта
                        </h2>
                        <table className="budget__table">
                            <thead>
                                <tr className="budget__table-row--head">
                                    <th className="budget__table-column budget__table-column--head" onClick={() => sortData('username')}>
                                        Имя {sortedColumn === 'username' && <span className="budget__table-arrow--head">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                    </th>
                                    <th className="budget__table-column budget__table-column--head" onClick={() => sortData('email')}>
                                        Email {sortedColumn === 'email' && <span className="budget__table-arrow--head">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                    </th>
                                    <th className="budget__table-column budget__table-column--head" onClick={() => sortData('events')}>
                                        Кол-во мероприятий {sortedColumn === 'events' && <span className="budget__table-arrow--head">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems &&
                                    currentItems.map((item, index) => (
                                        <tr key={index} className="budget__table-row budget__table-item">
                                            <td className="budget__table-column">{item.username}</td>
                                            <td className="budget__table-column">{item.email}</td>
                                            <td className="budget__table-column">{item.events} шт</td>
                                            <td className="budget__table-column">
                                                <IconBasket className="program__list-item-basket" onClick={() => handleDeleteItem(item.id)} />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="admin-pagination">
                            <button
                                className="admin-pagination__arrow"
                                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo;
                            </button>
                            <span>{currentPage}</span>
                            <span>из</span>
                            <span>{totalPages}</span>
                            <button
                                className="admin-pagination__arrow"
                                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default AdminPage;