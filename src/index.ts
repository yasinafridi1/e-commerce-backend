import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import routes from "./routes/index";
import { envVariables } from "./config/Constants";
import { dbConnection } from "./config/dbConnect";
import dbInit from "./config/dbInit";

const PORT = envVariables.port || 7000;
const app = express();

app.use("/api/v1", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  dbConnection().then(() => {
    dbInit();
  });
});
