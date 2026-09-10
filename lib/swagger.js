import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // Aapke Next.js App Router API routes ka path
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Employee Portal API Documentation",
        version: "1.0.0",
        description: "API documentation for Employee Management System",
      },
      security: [],
    },
  });
  return spec;
};