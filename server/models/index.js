import fs from 'fs';
import path, {dirname} from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import config from '../config/config.json' assert { type: 'json' };


const basename = path.basename(import.meta.url);
const db = {};

let sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  dialect: 'mysql',
  ...config.development
});

const actualdir = './models'

if (fs.existsSync(actualdir)) {
  await Promise.all(
    fs.readdirSync(actualdir)
      .filter(file => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
        );
      })
      .map(async (file) => {
        // console.log("Here's File",file);
        const module = await import('./' + file);
        const model = module.default(sequelize, DataTypes);
        // console.log("Here's model", model);
        db[model] = model;
        // console.log("Here's in the for each: ",db[model]);
      })
  );
} 
else {
  console.error(`Directory ${actualdir} does not exist.`);
}




Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;