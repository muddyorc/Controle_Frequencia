function carregarTurmasSelect() {
    fetch("http://localhost:3000/turmas")
        .then(response => response.json())
        .then(turmas => {
            let selectTurma = document.getElementById("turmaSelect");
            let selectTurmaPresenca = document.getElementById("turmaPresenca");
            let selectTurmaConsulta = document.getElementById("turmaConsulta");
            
            selectTurma.innerHTML = "<option value=''>Selecione uma turma</option>";
            selectTurmaPresenca.innerHTML = "<option value=''>Selecione uma turma</option>";
            selectTurmaConsulta.innerHTML = "<option value=''>Selecione uma turma</option>";

            turmas.forEach(turma => {
                let option = `<option value="${turma.id}">${turma.nome}</option>`;
                selectTurma.innerHTML += option;
                selectTurmaPresenca.innerHTML += option;
                selectTurmaConsulta.innerHTML += option;
            });
        });
}


document.addEventListener("DOMContentLoaded", () => {
    carregarTurmas();
    carregarAlunos();
    carregarTurmasSelect();
    carregarAlunosSelect();
    carregarPresencas();
});

function carregarAlunosSelect() {
    fetch("http://localhost:3000/alunos")
        .then(response => response.json())
        .then(alunos => {
            let selectAlunoPresenca = document.getElementById("alunoPresenca");

            selectAlunoPresenca.innerHTML = "<option value=''>Selecione um aluno</option>";

            alunos.forEach(aluno => {
                let option = `<option value="${aluno.id}">${aluno.nome}</option>`;
                selectAlunoPresenca.innerHTML += option;
            });
        })
        .catch(error => console.error("Erro ao carregar alunos:", error));
}


function trocarAba(event, nomeAba) {
    event.preventDefault();
    document.querySelectorAll(".aba").forEach(aba => aba.style.display = "none");
    document.getElementById(nomeAba).style.display = "block";
}

function cadastrarTurma() {
    const nome = document.getElementById("turmaNome").value;
    const descricao = document.getElementById("turmaDescricao").value;

    if (!nome || !descricao) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch("http://localhost:3000/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, descricao })
    }).then(() => carregarTurmas());
}

function carregarTurmas() {
    fetch("http://localhost:3000/turmas")
        .then(response => response.json())
        .then(turmas => {
            let listaTurmas = document.getElementById("listaTurmas");
            listaTurmas.innerHTML = "";
            turmas.forEach(turma => {
                listaTurmas.innerHTML += `<tr><td>${turma.id}</td><td>${turma.nome}</td><td>${turma.descricao}</td></tr>`;
            });
        });
}

function cadastrarAluno() {
    const nome = document.getElementById("alunoNome").value;
    const turmaId = document.getElementById("turmaSelect").value;

    if (!nome || !turmaId) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch("http://localhost:3000/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, turma_id: turmaId })
    }).then(() => carregarAlunos());
}

function carregarAlunos() {
    fetch("http://localhost:3000/alunos")
        .then(response => response.json())
        .then(alunos => {
            let listaAlunos = document.getElementById("listaAlunos");
            listaAlunos.innerHTML = "";
            alunos.forEach(aluno => {
                listaAlunos.innerHTML += `<tr><td>${aluno.id}</td><td>${aluno.nome}</td><td>${aluno.turma_id}</td></tr>`;
            });
        });
}

function marcarPresenca() {
    const turmaId = document.getElementById("turmaPresenca").value;
    const alunoId = document.getElementById("alunoPresenca").value;
    const data = document.getElementById("dataPresenca").value;

    if (!turmaId || !alunoId || !data) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch("http://localhost:3000/presencas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turma_id: turmaId, aluno_id: alunoId, data: data })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao registrar presença");
        }
        alert("Presença marcada com sucesso!");
    })
    .catch(error => console.error("Erro:", error));
}

function consultarFrequencia() {
    const turmaId = document.getElementById("turmaConsulta").value;
    const data = document.getElementById("dataConsulta").value;

    if (!turmaId || !data) {
        alert("Selecione uma turma e uma data!");
        return;
    }

    fetch(`http://localhost:3000/presencas?turma_id=${turmaId}&data=${data}`)
        .then(response => response.json())
        .then(presencas => {
            let resultadoConsulta = document.getElementById("resultadoConsulta");
            resultadoConsulta.innerHTML = ""; // Limpa os resultados anteriores

            if (presencas.length === 0) {
                resultadoConsulta.innerHTML = "<p>Nenhuma presença encontrada para esta turma e data.</p>";
                return;
            }

            let tabela = "<table border='1'><tr><th>Aluno</th><th>Turma</th><th>Data</th></tr>";
            presencas.forEach(presenca => {
                tabela += `
                    <tr>
                        <td>${presenca.aluno_nome}</td>
                        <td>${presenca.turma_nome}</td>
                        <td>${presenca.data}</td>
                    </tr>
                `;
            });
            tabela += "</table>";

            resultadoConsulta.innerHTML = tabela;
        })
        .catch(error => console.error("Erro ao buscar presenças:", error));
}


function carregarPresencas() {
    fetch("http://localhost:3000/presencas")
        .then(response => response.json())
        .then(presencas => {
            let tabela = document.getElementById("tabelaPresencas");
            tabela.innerHTML = "<tr><th>Aluno</th><th>Turma</th><th>Data</th></tr>";

            presencas.forEach(presenca => {
                tabela.innerHTML += `
                    <tr>
                        <td>${presenca.aluno_nome}</td>
                        <td>${presenca.turma_nome}</td>
                        <td>${presenca.data}</td>
                    </tr>
                `;
            });
        });
}

