import { Router } from "express";
import { transactions, newTransaction } from "../controllers/transactionsControllers.js";
import { validToken, validNewTransaction } from "../middlewares/transactionsMiddlewares.js";

const transactionRouter = Router();
transactionRouter.get("/transaction", validToken, transactions);
transactionRouter.post("/transaction", validToken, validNewTransaction, newTransaction);

export default transactionRouter;