const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');

const readData = (file) => {
    if (!fs.existsSync(file)) return [];
    try {
        const content = fs.readFileSync(file, 'utf8');
        return content ? JSON.parse(content) : [];
    } catch (e) { return []; }
};
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- ИНИЦИАЛИЗАЦИЯ ДАННЫХ ---
const init = () => {
    if (readData(USERS_FILE).length === 0) {
        writeData(USERS_FILE, [{
            id: "admin-1", fullName: "СОЛОТКИН АРТЕМ СЕРГЕЕВИЧ", dob: "2006-11-01", passport: "N/A",
            email: "artemsolot.com@gmail.com", password: "El1teHarp", country: "РОССИЯ",
            role: "admin", subRole: "АДМИНИСТРАТОР", balance: 1000000, history: [], services: [], 
            pcHours: 0, parkingSpots: [], massageSessions: [], diningAccess: []
        }]);
    }
    if (readData(ROOMS_FILE).length === 0) {
        writeData(ROOMS_FILE, [
            { id: 'standard', title: 'СТАНДАРТ', price: 15000, features: ['2 ГОСТЯ', 'WI-FI'], includedServices: ['БАССЕЙН', '2 ЧАСА ПК КЛУБА'] },
            { id: 'business', title: 'БИЗНЕС', price: 34000, features: ['KING-SIZE', 'РАБОЧАЯ ЗОНА'], includedServices: ['БАССЕЙН', 'ЗАВТРАК', '8 ЧАСОВ ПК КЛУБА'] },
            { id: 'lux', title: 'ЛЮКС', price: 67000, features: ['ГОСТИНАЯ', '2 СПАЛЬНИ'], includedServices: ['БАССЕЙН + БАНИ', 'ПОЛНЫЙ ПАНСИОН', '12 ЧАСОВ ПК КЛУБА'] },
            { id: 'penthouse', title: 'ПЕНТХАУС', price: 152000, features: ['ПАНОРАМА', 'ТЕРРАСА'], includedServices: ['ВСЕ ВКЛЮЧЕНО', '42 ЧАСА ПК КЛУБА', 'ПАРКОВКА'] }
        ]);
    }
    if (readData(SERVICES_FILE).length === 0) {
        writeData(SERVICES_FILE, [
            { id: 'restaurant', title: 'РЕСТОРАН', description: 'ИЗЫСКАННАЯ КУХНЯ', items: [{name:'ЗАВТРАК', price:3100, time:'06:30-09:00'}, {name:'ОБЕД', price:7200, time:'13:00-16:00'}, {name:'УЖИН', price:4600, time:'21:00-01:00'}] },
            { id: 'spa', title: 'СПА И БАССЕЙН', description: 'РЕЛАКСАЦИЯ', items: [{name:'БАССЕЙН', price:0, time:'24/7'}, {name:'БАНИ', price:7800, time:'11:00-22:00'}, {name:'МАССАЖ', price:1200, time:'14:30-18:00'}] },
            { id: 'parking', title: 'ПАРКОВКА', description: 'ОХРАНЯЕМАЯ ЗОНА', pricePerItem: 3700, time: '24/7' },
            { id: 'gaming', title: 'ПК КЛУБ', description: 'RTX 4090 ТЕРРИТОРИЯ', pricePerItem: 210, time: '24/7' }
        ]);
    }
};
init();

// --- SWAGGER С ОПИСАНИЕМ ВСЕХ ПОЛЕЙ ---
const swaggerSpec = {
    openapi: '3.0.0',
    info: { title: 'Deep Blue Hotel API', version: '12.0.0', description: 'Полный API управления отелем' },
    servers: [{ url: 'http://127.0.0.1:3000' }],
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    fullName: { type: 'string' }, passport: { type: 'string' }, password: { type: 'string' }, 
                    email: { type: 'string' }, dob: { type: 'string' }, country: { type: 'string' },
                    role: { type: 'string', enum: ['guest', 'resident', 'employee', 'admin'] },
                    subRole: { type: 'string' }, balance: { type: 'number' },
                    pcHours: { type: 'number' }, parkingSpots: { type: 'array', items: { type: 'string' } },
                    diningAccess: { type: 'array', items: { type: 'string' } }
                }
            },
            Booking: {
                type: 'object',
                properties: {
                    guestName: { type: 'string' }, roomNumber: { type: 'string' }, roomType: { type: 'string' },
                    checkIn: { type: 'string' }, checkOut: { type: 'string' }, status: { type: 'string' }
                }
            }
        }
    },
    paths: {
        '/api/users': {
            get: { tags: ['Core'], summary: 'Список всех пользователей', responses: { 200: { description: 'OK' } } },
            post: { tags: ['Core'], summary: 'Создать пользователя', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, responses: { 201: { description: 'Created' } } }
        },
        '/api/users/{id}': {
            get: { tags: ['Core'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
            patch: { 
                tags: ['Core'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], 
                requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
                responses: { 200: { description: 'Updated' } } 
            },
            delete: { tags: ['Core'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } }
        },
        '/api/rooms': { get: { tags: ['Content'], summary: 'Все номера' } },
        '/api/services': { get: { tags: ['Content'], summary: 'Все услуги' } },
        '/api/bookings': { 
            get: { tags: ['Bookings'], summary: 'Все бронирования' },
            post: { tags: ['Bookings'], summary: 'Создать бронь', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } } }, responses: { 201: { description: 'Created' } } }
        },
        '/api/bookings/{id}': { delete: { tags: ['Bookings'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }] } }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API ОБРАБОТЧИКИ ---
app.get('/api/users', (req, res) => res.json(readData(USERS_FILE)));
app.get('/api/users/:id', (req, res) => res.json(readData(USERS_FILE).find(u => u.id === req.params.id)));

app.post('/api/users', (req, res) => {
    const users = readData(USERS_FILE);
    const newUser = { 
        id: Date.now().toString(), fullName: "", dob: "", passport: "", email: "", password: "", country: "РОССИЯ",
        role: "resident", subRole: "", balance: 0, history: [], services: [], 
        pcHours: 0, parkingSpots: [], massageSessions: [], diningAccess: [],
        ...req.body 
    };
    users.push(newUser);
    writeData(USERS_FILE, users);
    res.status(201).json(newUser);
});

app.patch('/api/users/:id', (req, res) => {
    const users = readData(USERS_FILE);
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...req.body };
        writeData(USERS_FILE, users);
        return res.json(users[idx]);
    }
    res.status(404).send();
});

app.delete('/api/users/:id', (req, res) => {
    const users = readData(USERS_FILE).filter(u => u.id !== req.params.id);
    writeData(USERS_FILE, users);
    res.send({ success: true });
});

app.get('/api/rooms', (req, res) => res.json(readData(ROOMS_FILE)));
app.get('/api/services', (req, res) => res.json(readData(SERVICES_FILE)));

app.get('/api/bookings', (req, res) => res.json(readData(BOOKINGS_FILE)));
app.post('/api/bookings', (req, res) => {
    const bks = readData(BOOKINGS_FILE);
    const newB = { id: Date.now(), ...req.body };
    bks.push(newB);
    writeData(BOOKINGS_FILE, bks);
    res.status(201).json(newB);
});
app.delete('/api/bookings/:id', (req, res) => {
    const bks = readData(BOOKINGS_FILE).filter(b => b.id != req.params.id);
    writeData(BOOKINGS_FILE, bks);
    res.send({ success: true });
});

app.listen(PORT, () => {
    console.log(`\x1b[32m[SERVER]\x1b[0m http://127.0.0.1:${PORT}`);
    console.log(`\x1b[34m[SWAGGER]\x1b[0m http://127.0.0.1:${PORT}/api-docs`);
});