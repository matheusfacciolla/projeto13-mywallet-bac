import express, { json } from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import transactionRouter from "./routes/transactionsRouter.js";

dotenv.config();
const porta = process.env.PORTA;

const app = express();
app.use(cors());
app.use(json());
app.use(authRouter);
app.use(transactionRouter);

app.listen(porta, () => {
    console.log(chalk.bold.green(`Server is running at http://localhost:${porta}`))
});