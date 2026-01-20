const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// إعدادات القاعدة السحابية (استبدل الرابط برابط MongoDB الخاص بك)
const mongoURI = "mongodb+srv://user:password@cluster.mongodb.net/elkaram";
mongoose.connect(mongoURI).then(() => console.log("Connected to MongoDB Atlas"));

// تعريف موديل الوجبات
const Meal = mongoose.model('Meal', {
    name: String,
    price: Number,
    image: String,
    category: String
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// الصفحة الرئيسية (Front-end)
app.get('/', async (req, res) => {
    const meals = await Meal.find();
    res.render('index', { meals });
});

// لوحة التحكم (Admin Panel)
app.get('/admin-karam', async (req, res) => {
    const meals = await Meal.find();
    res.render('admin', { meals });
});

// إضافة وجبة جديدة
app.post('/admin/add', async (req, res) => {
    const newMeal = new Meal(req.body);
    await newMeal.save();
    res.redirect('/admin-karam');
});

// حذف وجبة
app.post('/admin/delete/:id', async (req, res) => {
    await Meal.findByIdAndDelete(req.params.id);
    res.redirect('/admin-karam');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
