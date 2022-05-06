import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import db from "../db.js";

async function signUp(req, res) {
    const { name, email, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        await db.collection("users").insertOne({ name: name, email: email, password: passwordHash });
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function signIn(req, res) {
    const { email } = req.body;

    try {
        const token = v4();
        const user = await db.collection("users").findOne({ email: email });
        console.log(`Token gerado: ${token}`);

        await db.collection("sessions").insertOne({ token, userId: user._id });
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export { signUp, signIn };