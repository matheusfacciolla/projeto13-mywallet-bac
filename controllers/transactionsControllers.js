import dayjs from "dayjs";
import { ObjectId } from "mongodb";

import db from "../db.js";

async function transactions(req, res) {
    const { user } = res.locals;

    try {
        const transactions = await db.collection("transactions").find({ user: user.email }).toArray();
        res.status(200).send(transactions);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function newTransaction(req, res) {
    const { value, description, type } = req.body;
    const { user } = res.locals;

    try {
        const transactions = await db.collection("transactions").insertOne({ value: value, description: description, date: dayjs(Date.now()).format("DD/MM"), type, user: user.email });
        res.send(transactions).status(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export { transactions, newTransaction };