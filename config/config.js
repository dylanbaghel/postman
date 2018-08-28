const env = process.env.NODE_ENV || 'development';
console.log('evn ******', env);

if (env === 'development') {
    process.env.PORT = 7700;
    process.env.MONGO = 'mongodb://localhost:27017/PostmanApp';
} else if (env === 'production') {
    process.env.MONGO = 'mongodb://dylan:dylananya2692@ds135852.mlab.com:35852/postman-app';
}
