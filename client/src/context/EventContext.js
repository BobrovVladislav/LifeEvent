import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const getEvent = async (eventID, jwt) => {
        setLoading(true);
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
            } else {
                console.error("Ошибка при получении мероприятия");
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса на получение мероприятия", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <EventContext.Provider value={{ event, getEvent, loading }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    const context = useContext(EventContext);

    if (!context) {
        throw new Error('useEvent должен использоваться внутри EventProvider.');
    }

    return context;
};
