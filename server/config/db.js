import mongoose from 'mongoose';
import mysql from 'mysql2/promise';
import colors from 'colors'
const connectDB_Mongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDB Database ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
}


const connectDB_MySQL = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
        console.log(`Connected to MySQL Database`.bgGreen.white);
        return connection;
    } catch (error) {
        console.log(`Error in MySQL ${error}`.bgRed.white);
        throw error;
    }
}

export {connectDB_Mongo, connectDB_MySQL } ;