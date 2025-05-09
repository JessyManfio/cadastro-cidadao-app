const sql = require('mssql');

const config = {
    user: 'jessicams',
    password: 'J@123456789',
    server: 'cidadaoappserver.database.windows.net',
    database: 'CidadãoAppDB',
    options: {
        encrypt: true, // Usado para conexão segura
        trustServerCertificate: true // Para ambientes de desenvolvimento
    }
};

async function criarTabelas() {
    try {
        await sql.connect(config);

        await sql.query(`
            CREATE TABLE usuarios (
                id_usuario INT PRIMARY KEY IDENTITY(1,1),
                nome NVARCHAR(100) NOT NULL,
                email NVARCHAR(100) NOT NULL UNIQUE,
                senha NVARCHAR(255) NOT NULL,
                tipo_usuario NVARCHAR(20) CHECK (tipo_usuario IN ('admin', 'comum')) NOT NULL
            );
        `);

        await sql.query(`
            CREATE TABLE beneficiarios (
                id_beneficiario INT PRIMARY KEY IDENTITY(1,1),
                nome NVARCHAR(100) NOT NULL,
                cpf CHAR(11) NOT NULL UNIQUE,
                data_nascimento DATE NOT NULL,
                endereco NVARCHAR(255),
                telefone NVARCHAR(20),
                data_cadastro DATETIME DEFAULT GETDATE(),
                observacoes NVARCHAR(MAX)
            );
        `);

        console.log("Tabelas criadas com sucesso!");
    } catch (err) {
        console.error("Erro ao criar tabelas:", err);
    } finally {
        sql.close();
    }
}

criarTabelas();