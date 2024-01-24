const jwt = require('jsonwebtoken')

function authMiddleware(role) {
    return function (req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(401).json({ message: "Не авторизован" })
            }
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

            // Проверка роли пользователя
            if (!role || decodedToken.role === role) {
                req.user = decodedToken;
                next();
            } else {
                res.status(403).json({ message: 'Отказано в доступе' });
            }
        } catch (e) {
            res.status(401).json({ message: "Ошибка при проверке авторизации" })
        }
    };
}

module.exports = authMiddleware; 