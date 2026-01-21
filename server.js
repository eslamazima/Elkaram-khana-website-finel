const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const DATA_PATH = path.join(__dirname, 'menu.json');

// قراءة البيانات
const readData = () => {
    if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
};

// حفظ البيانات
const writeData = (data) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// الصفحة الرئيسية للزبائن
app.get('/', (req, res) => {
    const meals = readData();
    res.render('index', { meals });
});

// لوحة التحكم (محمية برقم سري بسيط في الرابط)
app.get('/admin-elkaram', (req, res) => {
    const meals = readData();
    res.render('admin', { meals });
});

app.post('/add', (req, res) => {
    const meals = readData();
    const newMeal = { id: Date.now(), ...req.body };
    meals.push(newMeal);
    writeData(meals);
    res.redirect('/admin-elkaram');
});

app.post('/delete/:id', (req, res) => {
    let meals = readData();
    meals = meals.filter(m => m.id != req.params.id);
    writeData(meals);
    res.redirect('/admin-elkaram');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
