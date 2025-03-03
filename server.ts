import "dotenv/config";
import express from "express";

const app = express();

app.get("/", async (request, response) => {
    response.send("Ola mundo!");
});

app.listen(8000, () => console.log("Rodando na porta 8000"));
