const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Permite que qualquer frontend se conecte
});

// Opções da API (Coloque sua chave real aqui)
const apiOptions = {
  method: "GET",
  url: "https://api-football-v3.football.api-sports.io",
  params: { live: "all" },
  headers: {
    "X-RapidAPI-Key": "77782840e41839576c02ed88ff49f48b",
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
};

// Função que busca na API e envia pro Frontend
async function buscarEAtualizar() {
  try {
    const response = await axios.request(apiOptions);
    const jogos = response.data.response;

    // O comando "io.emit" envia os dados para TODOS os usuários conectados no site
    io.emit("atualizacao_placares", jogos);
    console.log(
      `[${new Date().toLocaleTimeString()}] Placares atualizados e enviados!`,
    );
  } catch (error) {
    console.error("Erro ao buscar na API-Football");
  }
}

// Quando um usuário abre o seu site e se conecta:
io.on("connection", (socket) => {
  console.log("Um novo usuário se conectou ao site:", socket.id);
});

// Faz a busca imediatamente ao ligar o servidor
buscarEAtualizar();

// Repete a busca a cada 60 segundos (60000 milissegundos)
// AVISO: Ajuste esse tempo conforme o limite do seu plano gratuito!
setInterval(buscarEAtualizar, 60000);

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
