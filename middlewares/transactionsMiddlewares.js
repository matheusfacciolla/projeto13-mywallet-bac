import { transactionSchema } from "../schemas.js";

async function validToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();

    if (!token) {
        return res.sendStatus(401);
    }

    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
        return res.sendStatus(401);
    }

    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) {
        return res.sendStatus(404);
    }

    delete user.password;
    delete user._id;

    next();
}

async function validNewTransaction(req, res, next) {
    const { value, description } = req.body;
    const validation = transactionSchema.validate(value, description, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map((error) => error.message));
    }

    next();
}

export { validToken, validNewTransaction };