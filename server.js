require('./config/config');
//THIRD PARTY MODULES
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');
const passport = require('passport');
const cookieParser = require('cookie-parser');

//CUSTOM MODULE FILES
require('./config/passport').passportGoogle(passport);
const { mongoose } = require('./db/mongoose');
const { Post } = require('./models/Post');
const posts = require('./routes/posts');
const auth = require('./routes/auth');
const { truncate, stripTags, formatDate, select, editIcon, removeIcon } = require('./helpers/hbs');
const { authenticate } = require('./middleware/authenticate');
const { logs } = require('./config/log');
//MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ 
    defaultLayout: 'main',
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon,
        removeIcon: removeIcon
    }
 }));
app.use(methodOverride('_method'));
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    logs(req, res, next);
});

//GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;
    next();
})
//ROUTES

//GET - / - SHOW LANDING PAGE
app.get('/', (req, res) => {
    res.render('index');
});

//GET - /dashboard - SHOW DASHBOARD PAGE - AUTHENTICATED
app.get('/dashboard', authenticate, (req, res) => {
    Post.find({
        _creator: req.user._id
    }).sort({ date: 'DESC' }).then((posts) => {
        res.render('dashboard', { posts });
    })
});

app.use('/auth', auth);
app.use('/posts', posts);
//LISTEN
app.listen(process.env.PORT, () => console.log('Server Up at', process.env.PORT));