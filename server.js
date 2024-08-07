const app = require("./src/app");

const PORT = 3055

const server = app.listen(PORT, () => {
    console.log(`WSV ecommerce start with ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('WSV ecommerce closed');
        process.exit(0);
    });
})