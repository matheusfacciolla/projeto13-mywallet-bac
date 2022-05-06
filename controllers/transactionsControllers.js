import dayjs from "dayjs";

import db from "../db.js";

async function transactions(req, res) {
    try {
        const transactions = await db.collection("transactions").find({}).toArray();
        res.status(200).send(transactions);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function newTransaction(req, res) {
    const { value, description } = req.body;

    try {
        await db.collection("transactions").insertOne({ value: value, description: description, date: dayjs(Date.now()).format("DD/MM") });
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export { transactions, newTransaction };