import fs from 'fs';
import path from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import config from '../config/config.json' assert { type: 'json' };

const basename = path.basename(import.meta.url);
const db = {};

let sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  dialect: 'mysql',
  ...config.development
});

const actualdir = './models';

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
        try {
          const module = await import(path.join(actualdir, file)); // Use path.join for correct file path
          if (module.default) {
            const model = module.default(sequelize, DataTypes);
            db[modelName] = model;
          }
        } catch (error) {
          console.error(`Error importing ${file}:`, error);
        }
      })
  );
} else {
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
