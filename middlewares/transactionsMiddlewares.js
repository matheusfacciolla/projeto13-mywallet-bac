import db from "../db.js";
import Joi from "joi";

async function validToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await db.collection("sessions").findOne({ token: token });
        if (!session) {
            return res.sendStatus(401);
        }

        const user = await db.collection("users").findOne({ _id: session.userId });
        if (!user) {
            return res.sendStatus(404);
        }
        
        delete user._id;
        delete user.password;

        res.locals.user = user;
    
        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function validNewTransaction(req, res, next) {
    const { value, description } = req.body;
    const transactionSchema = Joi.object({
        value: Joi.string().pattern(/^[1-9][0-9]*\,[0-9]{2}$/).required(),
        description: Joi.string().required().max(18),
        type: Joi.string()
    })
    const validation = transactionSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        console.log(validation.error)
        return res.status(422).send(validation.error.details.map((error) => error.message));
    }

    next();
}

export { validToken, validNewTransaction };