import db from "../db.js";
import Joi from "joi";
import bcrypt from "bcrypt";

async function validSignUp(req, res, next) {
    const { name, email, password, confirmedPassword } = req.body;
    const signUpSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmedPassword: Joi.string().required()
    });
    const validation = signUpSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        res.status(422).send(validation.error.details.map((error) => error.message));
        return;
    }

    if (password != confirmedPassword) {
        res.status(422).send(validation.error.details.map((error) => error.message));
        return;
    }

    try {
        const isEmailExist = await db.collection("users").findOne({ email: email });
        if (isEmailExist) {
            res.sendStatus(409);
            return;
        }

        next();

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

async function validSignIn(req, res, next) {
    const { email, password } = req.body
    const signInSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    const validation = signInSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        res.status(422).send(validation.error.details.map((error) => error.message));
        return;
    }

    try {
        const user = await db.collection("users").findOne({ email: email });
        const isCorrectPassword = bcrypt.compareSync(password, user.password);

        if (!user) {
            res.sendStatus(404);
            return;
        }

        if (!isCorrectPassword) {
            res.sendStatus(401);
            return;
        }

        res.locals.user = user;

        next();

    } catch (error) {
        res.sendStatus(500);
        return;
    }
}

export { validSignUp, validSignIn };