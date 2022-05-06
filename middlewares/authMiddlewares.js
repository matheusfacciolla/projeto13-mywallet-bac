import signUpSchema from "../schemas.js";
import signInSchema from "../schemas.js";

async function validSignUp(req, res, next) {
    const { name, email, password } = req.body;
    const validation = signUpSchema.validate(name, email, password, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map((error) => error.message));
    }

    try {
        const isEmailExist = await db.collection("users").findOne({ email: email });
        if (isEmailExist) {
            res.sendStatus(409);
            return;
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

    next();
}

async function validSignIn(req, res, next) {
    const { email, password } = req.body
    const validation = signInSchema.validate(email, password, { abortEarly: false })

    if (validation.error) {
        res.status(422).send(validation.error.details.map((error) => error.message));
        return;
    }

    try {
        const isUserExist = await db.collection("users").findOne({ email: email });
        const isCorrectPassword = bcrypt.compareSync(password, isUserExist.password);

        if (!isUserExist) {
            res.sendStatus(404);
            return;
        }

        if (!isCorrectPassword) {
            res.sendStatus(401);
            return;
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

    next();
}

export { validSignUp, validSignIn };