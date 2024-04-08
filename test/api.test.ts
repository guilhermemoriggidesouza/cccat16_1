import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	console.log(output.status, output.data);
});

test("Deve criar uma conta para motorista", async () => {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: 'abc1234'
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	console.log(output.status, output.data);
})

test("Deve retornar erro quando a placa estiver errada", async () => {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: 'ac1234'
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	console.log(output.status, output.data);
})

test("Deve retornar erro quando o cpf estiver errado", async () => {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "877448800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	console.log(output.status, output.data);
})

test("Deve retornar erro quando o nome estiver errado", async () => {
	const input = {
		name: "John Do21e",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	console.log(output.status, output.data);
})

test("Deve retornar erro quando o email estiver errado", async () => {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	console.log(output.status, output.data);
})

test("Deve retornar erro se já exstir user", async () => {
	const input = {
		name: "John Doe",
		email: `john.doe@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	console.log(output.status, output.data);
})

