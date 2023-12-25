const prisma = require('../db');

class EventController {
    async createEvent(req, res) {
        const { name, type, location, date } = req.body;

        if (!name || !type || !location || !date) {
            return res.status(400).json({ error: 'Некорректные данные' });
        }

        try {
            const organizerID = req.user.id;
            // Создаем мероприятие
            const event = await prisma.event.create({
                data: {
                    name,
                    type,
                    location,
                    date: new Date(date),
                    organizer: {
                        connect: { id: organizerID }
                    }
                }
            });

            return res.json({ message: "Мероприятие создано успешно", event });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async readAllEvents(req, res) {
        try {
            const organizerID = req.user.id;

            // Читаем все мероприятия пользователя
            const events = await prisma.event.findMany({
                where: {
                    organizerID
                }
            });

            return res.json({ events });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async getEvent(req, res) {
        const eventID = parseInt(req.params.eventID, 10);
        const organizerID = req.user.id;

        try {
            const event = await prisma.event.findUnique({
                where: { id: eventID, organizerID },
            });

            if (!event) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }

            return res.json({ event });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async updateEvent(req, res) {
        const eventID = parseInt(req.params.eventID, 10);
        const organizerID = req.user.id; // Идентификатор пользователя из аутентификации
        const { name, type, date, location } = req.body; // Данные для обновления

        try {
            // Проверка наличия мероприятия перед обновлением (опционально)
            const existingEvent = await prisma.event.findUnique({
                where: { id: eventID, organizerID },
            });

            if (!existingEvent) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }

            // Обновление мероприятия
            const updatedEvent = await prisma.event.update({
                where: { id: eventID },
                data: {
                    name,
                    type,
                    date: new Date(date),
                    location,
                },
            });

            return res.json({ message: 'Мероприятие успешно обновлено', updatedEvent });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async deleteEvent(req, res) {
        const eventID = parseInt(req.params.eventID, 10);
        const organizerID = req.user.id; // Идентификатор пользователя из аутентификации
        try {
            // Проверка наличия мероприятия перед удалением (опционально)
            const existingEvent = await prisma.event.findUnique({
                where: { id: eventID, organizerID },
            });

            if (!existingEvent) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }

            // Удаление мероприятия
            await prisma.event.delete({
                where: { id: eventID },
            });

            return res.json({ message: 'Мероприятие успешно удалено' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
}

module.exports = new EventController();