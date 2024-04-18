import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate  } from 'react-router-dom';

import { ReactComponent as IconArrow } from "../assets/images/IconArrow.svg";

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Проверка на совпадение паролей
            if (password !== confirmPassword) {
                throw new Error("Пароли не совпадают")
            }
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            // Обработка ответа от сервера
            if (response.ok) {
                toast.success(data.message);
                navigate("/login"); // Перенаправление на страницу входа
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            toast.error(error.message || "Произошла ошибка при регистрации");
        }
    };

    return (
        <form className="modal__content" onSubmit={handleSignUp}>
            <div className="modal__block-input">
                <label htmlFor="nameSignUp" className="modal__label">
                    Имя
                </label>
                <input
                    type="text"
                    id="nameSignUp"
                    className="modal__input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="modal__block-input">
                <label htmlFor="emailSignUp" className="modal__label">
                    Email
                </label>
                <input
                    type="email"
                    id="emailSignUp"
                    className="modal__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                />
            </div>
            <div className="modal__block-input">
                <label htmlFor="passwordSignUp" className="modal__label">
                    Пароль
                </label>
                <input
                    type="password"
                    id="passwordSignUp"
                    placeholder="8+ знаков"
                    className="modal__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
            </div>
            <div className="modal__block-input">
                <label htmlFor="confirmPasswordSignUp" className="modal__label">
                    Подтвердите пароль
                </label>
                <input
                    type="password"
                    id="confirmPasswordSignUp"
                    className="modal__input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="modal__button">
                Зарегистрироваться
                <IconArrow className="icon-arrow" />
            </button>
            <p className="modal__description">
                Нажимая кнопку «Зарегистрироваться», я даю свое согласие на сбор и обработку моих персональных данных
            </p>
        </form>
    );
};

export default SignUpForm;