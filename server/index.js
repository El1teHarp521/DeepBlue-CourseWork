const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

// Разрешаем CORS и JSON
app.use(cors());
app.use(express.json());

// База данных в JSON файлах
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');

const readData = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Инициализация стандартных данных
if (readData(USERS_FILE).length === 0) {
    writeData(USERS_FILE, [{
        id: "admin-1", fullName: "Солоткин Артем Сергеевич", dob: "2006-11-01", passport: "N/A",
        email: "artemsolot.com@gmail.com", password: "El1teHarp", country: "Россия",
        role: "admin", subRole: "admin", balance: 1000000, history: [], services: []
    }]);
}
if (readData(ROOMS_FILE).length === 0) {
    writeData(ROOMS_FILE, [
        { id: 'standard', title: 'Стандарт', price: 15000, features: ['Двуспальная кровать', '2 гостя'] },
        { id: 'business', title: 'Бизнес', price: 34000, features: ['King-size кровать', 'Рабочая зона'] },
        { id: 'lux', title: 'Люкс', price: 67000, features: ['2 спальни', 'Гостиная'] },
        { id: 'penthouse', title: 'Пентхаус', price: 152000, features: ['3 спальни', 'Панорамный вид'] }
    ]);
}
if (readData(SERVICES_FILE).length === 0) {
    writeData(SERVICES_FILE, [
        { id: 'restaurant', title: 'Ресторан', description: 'Изысканная кухня', price: 'Средний чек 2500 ₽', details: 'Вид на море' },
        { id: 'spa', title: 'Спа и бассейн', description: 'Релакс', price: 'от 5000 ₽', details: 'Сауна и массаж' }
    ]);
}

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Deep Blue Hotel REAL-TIME API',
        version: '4.0.0',
        description: 'Полнофункциональный бэкенд для управления отелем. Все кнопки Execute работают.'
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Локальный сервер' }],
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    fullName: { type: 'string' },
                    passport: { type: 'string' },
                    password: { type: 'string' },
                    email: { type: 'string' },
                    dob: { type: 'string' },
                    country: { type: 'string' },
                    role: { type: 'string', enum: ['resident', 'employee', 'admin'] },
                    balance: { type: 'number' }
                }
            }
        }
    },
    paths: {
        '/api/users': {
            get: {
                tags: ['Users'],
                summary: 'Получить всех пользователей',
                responses: { 200: { description: 'Список пользователей', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } }
            },
            post: {
                tags: ['Users'],
                summary: 'Создать / Зарегистрировать пользователя',
                requestBody: {
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
                },
                responses: { 201: { description: 'Пользователь создан' } }
            }
        },
        '/api/users/{id}': {
            get: {
                tags: ['Users'],
                summary: 'Получить данные одного пользователя',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Данные юзера' } }
            },
            patch: {
                tags: ['Users'],
                summary: 'Обновить пользователя (баланс, роль и т.д.)',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: { 'application/json': { schema: { type: 'object', properties: { balance: {type:'number'}, role: {type:'string'}, subRole: {type:'string'} } } } }
                },
                responses: { 200: { description: 'Обновлено' } }
            },
            delete: {
                tags: ['Users'],
                summary: 'Удалить пользователя',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Удалено' } }
            }
        },
        '/api/rooms': {
            get: {
                tags: ['Content'],
                summary: 'Список всех номеров',
                responses: { 200: { description: 'Успешно' } }
            }
        },
        '/api/rooms/{id}': {
            patch: {
                tags: ['Content'],
                summary: 'Изменить цену или описание номера',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
                responses: { 200: { description: 'Обновлено' } }
            }
        },
        '/api/bookings': {
            get: {
                tags: ['Bookings'],
                summary: 'Все бронирования',
                responses: { 200: { description: 'Успешно' } }
            },
            post: {
                tags: ['Bookings'],
                summary: 'Создать новую бронь',
                requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
                responses: { 201: { description: 'Создано' } }
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Юзеры
app.get('/api/users', (req, res) => res.json(readData(USERS_FILE)));

app.get('/api/users/:id', (req, res) => {
    const user = readData(USERS_FILE).find(u => u.id === req.params.id);
    user ? res.json(user) : res.status(404).json({error: "User not found"});
});

app.post('/api/users', (req, res) => {
    const users = readData(USERS_FILE);
    const newUser = { 
        id: Date.now().toString(), 
        balance: 0, 
        history: [], 
        services: [], 
        role: 'resident', 
        ...req.body 
    };
    users.push(newUser);
    writeData(USERS_FILE, users);
    res.status(201).json(newUser);
});

app.patch('/api/users/:id', (req, res) => {
    const users = readData(USERS_FILE);
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({error: "Not found"});
    
    users[idx] = { ...users[idx], ...req.body };
    writeData(USERS_FILE, users);
    res.json(users[idx]);
});

app.delete('/api/users/:id', (req, res) => {
    const users = readData(USERS_FILE).filter(u => u.id !== req.params.id);
    writeData(USERS_FILE, users);
    res.json({success: true});
});

// Комнаты
app.get('/api/rooms', (req, res) => res.json(readData(ROOMS_FILE)));

app.patch('/api/rooms/:id', (req, res) => {
    const rooms = readData(ROOMS_FILE);
    const idx = rooms.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({error: "Room not found"});
    
    rooms[idx] = { ...rooms[idx], ...req.body };
    writeData(ROOMS_FILE, rooms);
    res.json(rooms[idx]);
});

app.get('/api/services', (req, res) => res.json(readData(SERVICES_FILE)));

app.get('/api/bookings', (req, res) => res.json(readData(BOOKINGS_FILE)));

app.post('/api/bookings', (req, res) => {
    const bookings = readData(BOOKINGS_FILE);
    const newBooking = { id: Date.now(), ...req.body };
    bookings.push(newBooking);
    writeData(BOOKINGS_FILE, bookings);
    res.status(201).json(newBooking);
});

app.listen(PORT, () => {
    console.log(`\n\x1b[32m[SERVER RUNNING]\x1b[0m http://localhost:${PORT}`);
    console.log(`\x1b[34m[SWAGGER LIVE]\x1b[0m http://localhost:${PORT}/api-docs\n`);
});