import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import routes from "./routes/index";
import { envVariables } from "./config/Constants";
import { dbConnection } from "./config/dbConnect";
import dbInit from "./config/dbInit";
import ErrorMiddleware from "./middlewares/Error";
import { makeRequiredDirectories } from "./utils/fileDirectory";
import path from "path";
import cors, { CorsOptions } from "cors";
const PORT = envVariables.port || 7000;
const app = express();

const allowedUrls = ["http://localhost:5173", "http://localhost:4242"];
const corsOptions: CorsOptions = {
  origin: allowedUrls,
  credentials: true,
};

makeRequiredDirectories();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/v1", routes);
app.use("/uploads", express.static(path.resolve(__dirname, "./uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  dbConnection().then(() => {
    dbInit();
  });
});
