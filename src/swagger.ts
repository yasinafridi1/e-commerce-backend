import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for the system",
    },
    servers: [
      {
        url: "/api/v1",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional: specify JWT if using JWT
        },
      },
    },
  },
  apis: ["./src/swagger/*.ts"], // Adjust path as needed
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
