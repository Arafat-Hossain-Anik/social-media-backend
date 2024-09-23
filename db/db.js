const mongoose = require('mongoose')
const connection = () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("DB Connected Successfully");
        })
        .catch((err) => {
            console.log("Error in DB Connection", err);
        })
}
module.exports = connection