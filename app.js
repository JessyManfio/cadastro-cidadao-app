const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco
const config = {
    user: 'jessicams',
    password: 'J@123456789',
    server: 'cidadaoappserver.database.windows.net',
    database: 'CidadãoAppDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

let pool;
sql.connect(config).then(p => {
    pool = p;
    console.log("Conectado ao banco de dados!");
}).catch(err => {
    console.error("Erro na conexão com o banco:", err);
});

// ROTA POST (cadastro de beneficiários)
app.post("/beneficiarios", async (req, res) => {
    try {
        const { nome, cpf, data_nasc, endereco, telefone, observacoes } = req.body;

        await pool.request()
            .input("nome", sql.NVarChar, nome)
            .input("cpf", sql.Char, cpf)
            .input("data_nascimento", sql.Date, data_nasc)
            .input("endereco", sql.NVarChar, endereco)
            .input("telefone", sql.NVarChar, telefone)
            .input("observacoes", sql.NVarChar, observacoes)
            .query(`INSERT INTO beneficiarios (nome, cpf, data_nascimento, endereco, telefone, observacoes)
                    VALUES (@nome, @cpf, @data_nascimento, @endereco, @telefone, @observacoes)`);

        res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao inserir:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar beneficiário" });
    }
});

// ✅ ROTA GET (listar beneficiários)
app.get("/beneficiarios", async (req, res) => {
    try {
        const result = await pool.request().query("SELECT * FROM beneficiarios");
        res.json(result.recordset);  // Envia os dados como JSON
    } catch (err) {
        console.error("Erro ao buscar beneficiários:", err);
        res.status(500).json({ erro: "Erro ao buscar beneficiários" });
    }
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
