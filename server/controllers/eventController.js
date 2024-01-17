const prisma = require('../db');
const nodemailer = require('nodemailer');

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
                },
                include: {
                    guests: true,
                    program: true,
                    budget: true
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
                include: {
                    guests: true, // Включаем гостей события
                    program: true, // Включаем программу события
                    budget: true, // Включаем бюджет события
                },
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

    async updateEventProgram(req, res) {
        const eventID = parseInt(req.params.eventID, 10);
        const organizerID = req.user.id; // Идентификатор пользователя из аутентификации
        const { program } = req.body;

        try {
            // Проверка наличия мероприятия перед обновлением (опционально)
            const existingEvent = await prisma.event.findUnique({
                where: { id: eventID, organizerID },
                include: { program: true },
            });

            if (!existingEvent) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }

            // Находим элементы в старой программе, которых нет в новой программе
            const elementsToDelete = existingEvent.program.filter((oldItem) =>
                !program.some((newItem) => newItem.id === oldItem.id)
            );

            // Удалите найденные элементы
            if (elementsToDelete.length > 0) {
                await prisma.programItem.deleteMany({
                    where: {
                        id: {
                            in: elementsToDelete.map((item) => item.id),
                        },
                    },
                });
            }

            // Создаем и обновляем элементы программы
            const updatedProgram = await Promise.all(
                program.map(async (item) => {
                    if (item.id) {
                        // Проверяем существование элемента с таким id перед обновлением
                        const existingProgramItem = await prisma.programItem.findUnique({
                            where: { id: item.id },
                        });

                        if (existingProgramItem) {
                            // Если есть id и элемент существует, пытаемся обновить
                            const updatedItem = await prisma.programItem.update({
                                where: { id: item.id },
                                data: { name: item.name, time: item.time },
                            });
                            return updatedItem;
                        } else {
                            throw new Error(`Элемент с id ${item.id} не найден. Невозможно обновить.`);
                        }
                    } else {
                        // Если нет id, создаем новую запись
                        const newItem = await prisma.programItem.create({
                            data: { name: item.name, time: item.time, event: { connect: { id: eventID } } },
                        });
                        return newItem;
                    }
                })
            );

            return res.json({ message: 'Программа успешно обновлена!', updatedProgram });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async updateEventBudget(req, res) {
        const eventID = parseInt(req.params.eventID, 10);
        const organizerID = req.user.id; // Идентификатор пользователя из аутентификации
        const { budget } = req.body;

        try {
            // Проверка наличия мероприятия перед обновлением (опционально)
            const existingEvent = await prisma.event.findUnique({
                where: { id: eventID, organizerID },
                include: { budget: true },
            });

            if (!existingEvent) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }

            // Находим элементы в старом бюджете, которых нет в новом бюджете
            const elementsToDelete = existingEvent.budget.filter((oldItem) =>
                !budget.some((newItem) => newItem.id === oldItem.id)
            );

            // // Удалите найденные элементы
            if (elementsToDelete.length > 0) {
                await prisma.budgetItem.deleteMany({
                    where: {
                        id: {
                            in: elementsToDelete.map((item) => item.id),
                        },
                    },
                });
            }

            // Создаем и обновляем элементы бюджета
            const updatedBudget = await Promise.all(
                budget.map(async (item) => {
                    if (item.id) {
                        // Проверяем существование элемента с таким id перед обновлением
                        const existingBudgetItem = await prisma.budgetItem.findUnique({
                            where: { id: item.id },
                        });

                        if (existingBudgetItem) {
                            // Если есть id и элемент существует, пытаемся обновить
                            const updatedItem = await prisma.budgetItem.update({
                                where: { id: item.id },
                                data: { expense: item.expense, cost: item.cost },
                            });
                            return updatedItem;
                        } else {
                            throw new Error(`Элемент с id ${item.id} не найден. Невозможно обновить.`);
                        }
                    } else {
                        // Если нет id, создаем новую запись
                        const newItem = await prisma.budgetItem.create({
                            data: { expense: item.expense, cost: item.cost, event: { connect: { id: eventID } } },
                        });
                        return newItem;
                    }
                })
            );

            return res.json({ message: 'Бюджет успешно обновлен!', updatedBudget });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async updateEventGuests(req, res) {
        const eventID = parseInt(req.params.eventID, 10);
        const organizerID = req.user.id; // Идентификатор пользователя из аутентификации
        const { guests } = req.body;

        try {
            // Проверка наличия мероприятия перед обновлением (опционально)
            const existingEvent = await prisma.event.findUnique({
                where: { id: eventID, organizerID },
                include: { guests: true },
            });

            if (!existingEvent) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }

            // Находим элементы в старом бюджете, которых нет в новом бюджете
            const elementsToDelete = existingEvent.guests.filter((oldItem) =>
                !guests.some((newItem) => newItem.id === oldItem.id)
            );

            // // Удалите найденные элементы
            if (elementsToDelete.length > 0) {
                await prisma.guest.deleteMany({
                    where: {
                        id: {
                            in: elementsToDelete.map((item) => item.id),
                        },
                    },
                });
            }

            // Создаем и обновляем элементы бюджета
            const updatedGuests = await Promise.all(
                guests.map(async (item) => {
                    if (item.id) {
                        // Проверяем существование элемента с таким id перед обновлением
                        const existingGuest = await prisma.guest.findUnique({
                            where: { id: item.id },
                        });

                        if (existingGuest) {
                            // Если есть id и элемент существует, пытаемся обновить
                            const updatedItem = await prisma.guest.update({
                                where: { id: item.id },
                                data: { fullName: item.fullName, email: item.email, status: item.status },
                            });
                            return updatedItem;
                        } else {
                            throw new Error(`Элемент с id ${item.id} не найден. Невозможно обновить.`);
                        }
                    } else {
                        // Если нет id, создаем новую запись
                        const newItem = await prisma.guest.create({
                            data: { fullName: item.fullName, email: item.email, status: item.status, event: { connect: { id: eventID } } },
                        });
                        return newItem;
                    }
                })
            );

            return res.json({ message: 'Гости успешно обновлены!', updatedGuests });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async inviteGuests(req, res) {
        const eventID = parseInt(req.params.eventID, 10);
        const organizerID = req.user.id; // Идентификатор пользователя из аутентификации
        const { guests } = req.body;

        try {
            // Проверка наличия мероприятия перед отправкой приглашений (опционально)
            const existingEvent = await prisma.event.findUnique({
                where: { id: eventID, organizerID },
            });

            if (!existingEvent) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }

            // Проверка существования гостей с указанными id перед отправкой приглашений
            for (const item of guests) {
                if (item.id) {
                    const existingGuest = await prisma.guest.findUnique({
                        where: { id: item.id },
                    });

                    if (!existingGuest) {
                        return res.status(404).json({ error: `Гость с id ${item.id} не найден` });
                    }
                }
            }

            // Фильтрация гостей, которым нужно отправить приглашения
            const guestsToInvite = guests.filter((guest) => guest.status !== "Приглашён");

            if (guestsToInvite.length === 0) {
                return res.json({ message: 'Все гости уже приглашены!' });
            }

            // Массив для гостей, которым не удалось доставить приглашения
            const failedInvitations = [];
            // Отправка приглашений
            await Promise.all(guestsToInvite.map(async (guest) => {
                // Создайте транспорт для отправки писем
                const transporter = nodemailer.createTransport({
                    host: 'smtp.yandex.ru',           // Адрес вашего SMTP-сервера
                    port: 465,                           // Порт вашего SMTP-сервера
                    secure: true,                       // Используется ли SSL/TLS (true для порта 465, false для порта 587)
                    auth: {
                        user: process.env.NODEMAILER_USER,  // Ваш адрес электронной почты
                        pass: process.env.NODEMAILER_PASS,  // Ваш пароль
                    },
                });

                // Опции письма
                const mailOptions = {
                    from: 'LifeEvent.ru <wladyslawmirny@yandex.ru>',
                    to: guest.email,
                    subject: 'Приглашение на мероприятие',
                    text: `Дорогой ${guest.fullName},\n\nВы приглашены на ${existingEvent.type} "${existingEvent.name}".\nДата: ${new Date(existingEvent.date).toLocaleDateString("en-GB")}\nЛокация: ${existingEvent.location} \n\nС наилучшими пожеланиями,\nОрганизатор мероприятия`,
                };

                // Отправка письма
                try {
                    await transporter.sendMail(mailOptions);
                } catch (emailError) {
                    console.error(`Ошибка при отправке письма на адрес ${guest.email}:`, emailError);
                    // Можно обработать ошибку, например, пометив гостя как неуспешно приглашенного
                    failedInvitations.push(guest);
                }
            }));

            // Обновление статуса гостей
            const updatedGuests = await Promise.all(
                guests.map(async (item) => {
                    if (item.id) {
                        // Проверяем, есть ли гость в массиве с ошибками
                        const isFailed = failedInvitations.some(failedGuest => failedGuest.id === item.id);

                        // Проверяем существование гостя с указанным id перед обновлением
                        const existingGuest = await prisma.guest.findUnique({
                            where: { id: item.id },
                        });

                        if (existingGuest && !isFailed) {
                            // Если гость существует и не входит в число с ошибками, обновляем его статус
                            const updatedItem = await prisma.guest.update({
                                where: { id: item.id },
                                data: { status: "Приглашён" },
                            });
                            return updatedItem;
                        } else {
                            // Если гость не существует или входит в число с ошибками, просто пропускаем обновление
                            console.error(`Гость с id ${item.id} не получил приглашение. Гость не обновлен.`);
                            return existingGuest; // или можно вернуть самого гостя, чтобы он был виден в результате
                        }
                    } else {
                        // Если id не указан, возвращаем сообщение об ошибке
                        throw new Error('Не указан id гостя. Гость не обновлен.');
                    }
                })
            );

            return res.json({ message: 'Приглашения успешно отправлены!', updatedGuests, failedInvitations });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

}

module.exports = new EventController();