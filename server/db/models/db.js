const Sequelize = require("sequelize");

const connection = new Sequelize(process.env.DATABASE_URL, { logging: false });

connection
    .authenticate()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Unable to connect to database", err);
    });

module.exports = connection;