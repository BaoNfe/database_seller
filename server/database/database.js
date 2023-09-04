import mysql from 'mysql2';
import colors from 'colors';

const connectDB = async () => {
  const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  };

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error(`Error connecting to MySQL: ${err.message}`.bgRed.white);
      return;
    }
    console.log(
      `Connected to MySQL Database at ${dbConfig.host}`.bgMagenta.white
    );
  });

  connection.on('error', (err) => {
    console.error(`MySQL connection error: ${err.message}`.bgRed.white);
  });
};

export default connectDB;
