import { Sequelize } from "sequelize";
import { envVariables } from "./Constants";
const { dbHostName, dbName, dbPassword, dbUserName } = envVariables;

export const sequelize = new Sequelize(dbName, dbUserName, dbPassword, {
  host: dbHostName,
  dialect: "mysql",
  logging: false,
});

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query("SET foreign_key_checks = 0;"); // remove this line after development is complete
    console.log("db connected successfully.");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
};
