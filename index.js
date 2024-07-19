const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://hari_7618:hari_7618@keep.mfy1kah.mongodb.net/?retryWrites=true&w=majority&appName=Keep', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

const noteRoutes = require('./routes/notes');
app.use('/api', noteRoutes);








app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

