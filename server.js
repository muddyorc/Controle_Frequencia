const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("./database/database.db");

app.use(express.json());
app.use(cors());

// Criação das tabelas caso não existam
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS turmas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS alunos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        turma_id INTEGER NOT NULL,
        FOREIGN KEY (turma_id) REFERENCES turmas(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS presencas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aluno_id INTEGER NOT NULL,
        turma_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        FOREIGN KEY (aluno_id) REFERENCES alunos(id),
        FOREIGN KEY (turma_id) REFERENCES turmas(id)
    )`);
});

// Rotas para manipular os dados
app.post("/turmas", (req, res) => {
    const { nome, descricao } = req.body;
    db.run("INSERT INTO turmas (nome, descricao) VALUES (?, ?)", [nome, descricao], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nome, descricao });
    });
});

app.get("/turmas", (req, res) => {
    db.all("SELECT * FROM turmas", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/alunos", (req, res) => {
    const { nome, turma_id } = req.body;
    db.run("INSERT INTO alunos (nome, turma_id) VALUES (?, ?)", [nome, turma_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nome, turma_id });
    });
});

app.get("/alunos", (req, res) => {
    db.all("SELECT * FROM alunos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/presencas", (req, res) => {
    const { aluno_id, turma_id, data } = req.body;
    db.run("INSERT INTO presencas (aluno_id, turma_id, data) VALUES (?, ?, ?)", [aluno_id, turma_id, data], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, aluno_id, turma_id, data });
    });
});

app.get("/presencas", (req, res) => {
    const { turma_id, data } = req.query;

    let query = `
        SELECT presencas.id, alunos.nome AS aluno_nome, turmas.nome AS turma_nome, presencas.data
        FROM presencas
        JOIN alunos ON presencas.aluno_id = alunos.id
        JOIN turmas ON presencas.turma_id = turmas.id
        WHERE 1=1
    `;

    let params = [];

    if (turma_id) {
        query += " AND presencas.turma_id = ?";
        params.push(turma_id);
    }

    if (data) {
        query += " AND presencas.data = ?";
        params.push(data);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});



app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 🚀");
});
