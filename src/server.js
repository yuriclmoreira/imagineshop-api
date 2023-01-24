import "dotenv/config";
import express from "express";

import { UserService } from "./services/user-service.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("IMAGINE SHOP");
});

//Criar usuario
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const userService = new UserService();

  await userService.create(user);

  return res.status(201).json(user);
});

//Listar todos os usarios
app.get("/users", async (req, res) => {
  const userService = new UserService();

  const users = await userService.findAll();
  return res.status(200).json(users);
});

//Procurar um usario pelo id
app.get("/users/:id", async (req, res) => {
  const id = req.params;
  const userService = new UserService();

  const user = await userService.findById(id);
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(404).json({ message: "Usuário não encontrado" });
});

//Deletar um usuario
app.delete("/users/:id", async (req, res) => {
  const id = req.params;
  const userService = new UserService();
  const user = await userService.findById(id);
  if (user) {
    await userService.delete(id);
    return res.status(200).json({ message: "Usuário excluido com sucesso" });
  }
  return res.status(404).json({ message: "Usuário não encontrado" });
});

//Update de um usuario
app.put("/users/:id", async (req, res) => {
  const id = req.params;
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const userService = new UserService();
  const findUser = await userService.findById(id);
  if (findUser) {
    await userService.update(id, user);
    return res.status(200).json({ message: "Usuário atualizado com sucesso" });
  }
  return res.status(404).json({ message: "Usuário não encontrado" });
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
