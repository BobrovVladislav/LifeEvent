const prisma = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateJwt = (id, username, email, role) => {
  return jwt.sign(
    { id, username, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};

class UserController {
  async registration(req, res) {
    const { username, email, password, role } = req.body;
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
          // role: role || "user",
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

      const jwt = generateJwt(user.id, user.username, user.email, user.role);

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
      role: req.user.role
    };
    // Если middleware прошел успешно, токен можно сгенерировать заново, чтобы обновить время жизни
    const jwt = generateJwt(req.user.id, req.user.username, req.user.email, req.user.role);
    return res.json({ jwt, user });
  }

  async getAllUsers(req, res) {
    try {

      let maxProjectsCount = 0;
      let maxBudget = 0;
      let topUser = null;

      const allUsers = await prisma.users.findMany({
        include: {
          events: {
            include: {
              budget: {
                select: {
                  cost: true
                }
              }
            }
          }
        }
      });

      topUser = allUsers.reduce((maxUser, user) => {
        const projectsCount = user.events.length;
        const userMaxBudget = user.events.reduce((userAcc, event) => {
          const totalCost = event.budget.reduce((costAcc, item) => costAcc + (item.cost || 0), 0);
          return Math.max(userAcc, totalCost);
        }, 0);

        if (projectsCount > maxProjectsCount) {
          maxProjectsCount = projectsCount;
          maxUser = {
            ...user,
            totalProjects: projectsCount,
          };
        }

        if (userMaxBudget > maxBudget) {
          maxBudget = userMaxBudget;
        }

        return maxUser;
      }, null);

      const totalEventsCount = allUsers.reduce((acc, user) => acc + user.events.length, 0);

      const usersWithProjectsInfo = allUsers.map((user) => {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          events: user.events.length,
        };
      });

      return res.json({
        users: usersWithProjectsInfo,
        topUser: {
          id: topUser.id,
          username: topUser.username,
          email: topUser.email,
          totalProjects: topUser.totalProjects
        },
        maxBudget: maxBudget,
        totalEvents: totalEventsCount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.id;

    try {
      const userToDelete = await prisma.users.findUnique({
        where: { id: parseInt(userId) }
      });

      if (!userToDelete) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      // Проверяем, что у пользователя не роль "admin"
      if (userToDelete.role === "admin") {
        return res.status(403).json({ error: 'У вас нет разрешения на удаление админа' });
      }

      // Удаляем пользователя и связанные с ним данные (события гости бюджеты программы)
      await prisma.users.delete({
        where: { id: parseInt(userId) },
        include: {
          events: {
            include: {
              guests: true,
              program: true,
              budget: true
            }
          }
        }
      });

      return res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

}

module.exports = new UserController();