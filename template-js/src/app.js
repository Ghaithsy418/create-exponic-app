import express from "express"
import morgan from "morgan"

exoprt const app = express();

if(process.env.NODE_ENV === "development") app.use(morgan("dev"))

app.use(express.json());
app.use(express.static("/public"));