import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(() => {
    // Попытка получить токен из localStorage при загрузке компонента
    return localStorage.getItem("jwt") || null;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получение данных пользователя
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!response.ok) {
          setJwt(null)
          setUser(null)
          throw new Error('Ошибка при получении данных пользователя');
        }

        const data = await response.json();
        await setJwt(data.jwt);
        await setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role
        });
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    // Обновление localStorage при изменении токена
    if (jwt !== null) {
      localStorage.setItem("jwt", jwt);
      getUser();
    } else {
      localStorage.removeItem("jwt");
      setUser(null);
    }
  }, [jwt]);

  const login = async (token) => {
    setJwt(token);
  };

  const logout = () => {;
    setJwt(null);
  };

  return (
    <AuthContext.Provider value={{ jwt, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};