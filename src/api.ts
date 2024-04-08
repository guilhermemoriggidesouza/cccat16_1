import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";

const app = express();
app.use(express.json());
app.listen(3000);

app.post("/signup", async function (req, res) {
	const payload = req.body
	const connectionDB = connectInDb();
	try {
		const accountByEmail = await getAccountByEmail(connectionDB, req.body.email)
		if (accountByEmail) {
			throw new Error("Account already exists");
		}
		await validatePayload(req.body)
		const createdAccount = await createAccount(connectionDB, payload)
		res.json(createdAccount);
	} catch (error: any) {
		return res.status(422).send(error.message);
	} finally {
		await closeConnectionDB(connectionDB)
	}
});

const connectInDb = () => pgp()("postgres://postgres:123456@localhost:5432/app")

const getAccountByEmail = async (connectionDB: any, email: string) => {
	return await connectionDB.query("select * from cccat15.account where email = $1", [email]);
}

const createAccount = async (connectionDB: any, payload: Payload) => {
	const id = crypto.randomUUID();
	await connectionDB.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, payload.name, payload.email, payload.cpf, payload.carPlate, !!payload.isPassenger, !!payload.isDriver]);
	const createdAccount = {
		accountId: id
	};
	return createdAccount
}

const validatePayload = async (payload: Payload) => {
	const validateName = (name: string) => name.match(/[a-zA-Z] [a-zA-Z]+/)
	const validateEmail = (email: string) => email.match(/^(.+)@(.+)$/)
	const validateCarPlate = (carPlate: string) => carPlate.match(/[A-Z]{3}[0-9]{4}/)

	if (!validateName(payload.name)) {
		throw new Error("Wrong name");
	}
	if (!validateEmail(payload.email)) {
		throw new Error("Wrong email");
	}
	if (validate(payload.cpf)) {
		throw new Error("Wrong cpf");
	}
	if (payload.isDriver && payload.carPlate && !validateCarPlate(payload.carPlate)) {
		throw new Error("Wrong carPlate");
	}
}

const closeConnectionDB = async (connectionDB: any) => {
	await connectionDB.$pool.end();
}

type Payload = { name: string; email: string; cpf: string; isDriver?: any; carPlate?: string; isPassenger?: boolean }
