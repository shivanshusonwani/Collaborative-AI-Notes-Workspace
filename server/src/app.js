import express from "express";
import sessionConfig from "./config/session.js";

const app = express();

app.use(sessionConfig);

export default app;
