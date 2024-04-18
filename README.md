# LifeEvent - Веб-приложение по организации мероприятий

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![Nodemailer](https://img.shields.io/badge/Nodemailer-0063BE?style=for-the-badge&logo=nodemailer&logoColor=white) 
[![Render](https://img.shields.io/badge/Render-00979D?style=for-the-badge&logo=render&logoColor=white)](https://render.com/) 


### [https://lifeevent.onrender.com/](https://lifeevent.onrender.com/) 

## Особенности

- Аутентификация и авторизация пользователей.
- Управление мероприятиями (CRUD): создание, просмотр, редактирование, удаление.
- Отправка приглашений на мероприятий по email.
- Панель администратора со статистикой сайта.
- Адаптивная вёрстка.

## Установка

1. Клонируйте репозиторий:

   ```shell
   git clone https://github.com/BobrovVladislav/LifeEvent.git
   cd LifeEvent
   ```

2. Перейдите в ветку dev:

   ```shell
   git checkout dev
   ```

3. Настройка клиента:

   ```shell
   cd .\client\
   npm install
   ```

   Создайте файл `.env` в директории клиента на основе `.env.example`:

   ```plaintext
   REACT_APP_SERVER_URL=
   ```

4. Настройка сервера:

   ```shell
   cd .\server\
   npm install
   ```

   Создайте файл `.env` в директории сервера на основе `.env.example`:

    ```plaintext
    DATABASE_URL=

    PORT=

    SECRET_KEY=

    NODEMAILER_USER=
    NODEMAILER_PASS=
    ```

    Настройка Prisma:

        ```shell
        npx prisma generate

        npx prisma migrate dev
        ```


5. Запустите сервер и клиент:

   ```shell
   # Запуск сервера
   npm run start

   # Запуск клиента
   cd client
   npm start
   ```

6. Перейдите на `http://localhost:3000` для доступа к веб-сайту.

