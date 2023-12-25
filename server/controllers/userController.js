const prisma = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateJwt = (id, username, email) => {
  return jwt.sign(
    { id, username, email },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};

class UserController {
  async registration(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }

    try {
      const existingUser = await prisma.users.findFirst({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      }

      const hashPassword = await bcrypt.hash(password, 5);

      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password: hashPassword,
        },
      });

      return res.json({ message: "Регистрация прошла успешно", newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ error: 'Указан неверный пароль' });
      }

      const jwt = generateJwt(user.id,  user.username, user.email);

      return res.json({ message: "Авторизация прошла успешно", jwt, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  async check(req, res) {
    // Добавляем данные пользователя
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    };
    // Если middleware прошел успешно, токен можно сгенерировать заново, чтобы обновить время жизни
    const jwt = generateJwt(req.user.id, req.user.username, req.user.email);
    return res.json({ jwt, user });
  }
}

module.exports = new UserController();