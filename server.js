const express = require("express");
const mssql = require("mssql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Configuração do middleware
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const sqlConfig = {
    user: 'jessicams',
    password: 'J@123456789',
    server: 'cidadaoappserver.database.windows.net',
    database: 'CidadãoAppDB',
  options: {
    encrypt: true, // habilitar criptografia
    trustServerCertificate: true, // desabilitar verificação de certificado para desenvolvimento
  },
};

// Rota para receber os dados do beneficiário
app.post("/beneficiarios", async (req, res) => {
  const { nome, cpf, data_nasc, endereco, telefone, observacoes } = req.body;

  try {
    // Conectar ao banco de dados
    const pool = await mssql.connect(sqlConfig);

    // Inserir os dados na tabela 'beneficiarios'
    await pool.request().query(`
      INSERT INTO beneficiarios (nome, cpf, data_nascimento, endereco, telefone, observacoes)
      VALUES ('${nome}', '${cpf}', '${data_nasc}', '${endereco}', '${telefone}', '${observacoes}');
    `);

    res.status(200).json({ message: "Beneficiário cadastrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar o beneficiário." });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
