const express = require('express');
const connectDB = require('./config/db');
const path = require('path');


const usersRoute = require('./routes/api/users');
const postsRoute = require('./routes/api/posts');
const profileRoute = require('./routes/api/profile');
const authRoute = require('./routes/api/auth');

const app = express();

app.use(express.json({extends : false}));


connectDB();

app.use('/api/users',usersRoute);
app.use('/api/posts',postsRoute);
app.use('/api/profile',profileRoute);
app.use('/api/auth',authRoute);


if (process.env.NODE_ENV === 'production') {
    
    app.use(express.static('client/build'));

    app.get('*', (req,res) =>{
        res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on potr ${PORT}`));