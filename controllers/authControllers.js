import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import db from "../db.js";

async function signUp(req, res) {
    const { name, email, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        await db.collection("users").insertOne({ name: name, email: email, password: passwordHash, confirmedPassword: passwordHash });
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function signIn(req, res) {
    try {
        const token = v4();
        console.log(`Token gerado: ${token}`);

        const { user } = res.locals;
        const session = await db.collection("sessions").insertOne({ token, userId: user._id });
        res.send({ token: token, name: user.name }).status(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

export { signUp, signIn };