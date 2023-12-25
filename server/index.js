require('dotenv').config()
const express = require('express');
const cors = require('cors')
const prisma = require('./db');
const router = require('./routes/index')

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use(express.json());
app.use('/api', router)

const start = async () => {
  try {
    //проверка подключения к бд
    await prisma.$connect();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (error) {
    console.log('Error starting server:', error)
  }
}

start()
