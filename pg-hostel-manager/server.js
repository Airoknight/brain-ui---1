const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Telegram Bot Setup
const token = '8382017792:AAFw2QwHBR0I5YmBEkbEz9xHShPHHXy0K2E';
const bot = new TelegramBot(token, { polling: true });

// In-memory data store (replace with DB for production)
let students = []; // { id, name, room, feeStatus, feeAmount, chatId }
let foodCancellations = [];

// API Routes

// Get all students
app.get('/api/students', (req, res) => {
    res.json(students);
});

// Add a student
app.post('/api/students', (req, res) => {
    const student = req.body;
    student.id = Date.now().toString();
    students.push(student);
    console.log('Student added:', student);
    res.status(201).json(student);
});

// Send fee alert to specific student or all
app.post('/api/send-alert', async (req, res) => {
    const { studentId, message } = req.body;

    if (studentId === 'all') {
        const promises = students.map(s => {
            if (s.chatId) {
                return bot.sendMessage(s.chatId, `📢 FEE ALERT: Hello ${s.name}, ${message}. Pending Amount: ₹${s.feeAmount}`);
            }
        });
        await Promise.all(promises);
        res.json({ success: true, message: 'Alerts sent to all students' });
    } else {
        const student = students.find(s => s.id === studentId);
        if (student && student.chatId) {
            try {
                await bot.sendMessage(student.chatId, `📢 FEE ALERT: Hello ${student.name}, ${message}. Pending Amount: ₹${student.feeAmount}`);
                res.json({ success: true, message: 'Alert sent' });
            } catch (error) {
                console.error('Error sending telegram message:', error);
                res.status(500).json({ error: 'Failed to send message' });
            }
        } else {
            res.status(404).json({ error: 'Student not found or no Chat ID' });
        }
    }
});

// Get food cancellations
app.get('/api/cancellations', (req, res) => {
    res.json(foodCancellations);
});

// Bot Commands

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Welcome to the PG Hostel Bot! Your Chat ID is: \`${chatId}\`. Please share this with the Admin to register.`, { parse_mode: 'Markdown' });
});

// .help command
bot.onText(/\.help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
🤖 *Available Commands:*

/feedetails - Check your current fee status and pending amount.
/pay - Get payment QR code and instructions.
/cancelfood - Notify that you will skip the next meal.
.help - Show this help message.
    `;
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// /feedetails
bot.onText(/\/feedetails/, (msg) => {
    const chatId = msg.chat.id.toString();
    const student = students.find(s => s.chatId === chatId);

    if (student) {
        bot.sendMessage(chatId, `💰 *Fee Details For ${student.name}*:\n\nStatus: ${student.feeStatus}\nPending Amount: ₹${student.feeAmount}\nRoom: ${student.room}`, { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, "⚠️ You are not registered in the system. Please contact the Admin with your Chat ID.");
    }
});

// /pay
bot.onText(/\/pay/, (msg) => {
    const chatId = msg.chat.id;
    // Mock QR Code URL (using a placeholder image service)
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=mockmerchant@upi&pn=HostelAdmin";

    bot.sendMessage(chatId, "💳 *Scan to Pay Fee*");
    bot.sendPhoto(chatId, qrUrl, { caption: "Please scan this QR code to pay your hostel fee. Send a screenshot to the admin after payment." });
});

// /cancelfood
bot.onText(/\/cancelfood/, (msg) => {
    const chatId = msg.chat.id.toString();
    const student = students.find(s => s.chatId === chatId);
    const name = student ? student.name : "Unknown Student";

    const timestamp = new Date().toLocaleString();
    foodCancellations.push({ name, chatId, time: timestamp });

    bot.sendMessage(chatId, "🍽️ *Food Cancellation Received*\n\nThank you for informing us. We have noted that you will not be eating the upcoming meal to minimize wastage.", { parse_mode: 'Markdown' });
    console.log(`Food cancellation: ${name} (${chatId}) at ${timestamp}`);
});

// Poll handling (console debug)
bot.on('polling_error', (error) => {
    console.log(error.code);  // => 'EFATAL'
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
