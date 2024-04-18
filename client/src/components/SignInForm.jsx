import React, { useState } from "react";
import { toast } from 'react-toastify'
import { useAuth } from "../context/AuthContext.js";

import { ReactComponent as IconArrow } from "../assets/images/IconArrow.svg";

const SignInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // Обработка ответа от сервера
            if (response.ok) {
                toast.success(data.message);
                login(data.jwt); // Обновляем статус авторизации
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            toast.error(error.message || "Произошла ошибка при авторизации");
        }
    };

    return (
        <form className="modal__content" onSubmit={handleSignIn}>
            <div className="modal__block-input">
                <label htmlFor="emailSignIn" className="modal__label">
                    Email
                </label>
                <input
                    type="email"
                    id="emailSignIn"
                    className="modal__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                />
            </div>
            <div className="modal__block-input">
                <label htmlFor="passwordSignIn" className="modal__label">
                    Пароль
                </label>
                <input
                    type="password"
                    id="passwordSignIn"
                    className="modal__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
            </div>
            <button className="modal__button" type="submit">
                Войти
                <IconArrow className="icon-arrow" />
            </button>
        </form>
    );
};

export default SignInForm;
