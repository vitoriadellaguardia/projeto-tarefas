// Função para alternar entre o tema claro e escuro
function mudarTema() {
    document.body.classList.toggle('dark');
}

// Função para abrir a gaveta lateral
function abrirGaveta() {
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");

    sombra.classList.remove("invisible", "opacity-0");
    sombra.classList.add("opacity-50"); // Torna o overlay semi-transparente
    gaveta.classList.remove("invisible", "opacity-0", "translate-x-full");
    gaveta.classList.add("opacity-100", "translate-x-0"); // Desliza a gaveta para dentro
}

// Função para fechar a gaveta lateral
function fecharGaveta() {
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");

    sombra.classList.add("invisible", "opacity-0");
    sombra.classList.remove("opacity-50");
    gaveta.classList.add("invisible", "opacity-0", "translate-x-full");
    gaveta.classList.remove("opacity-100", "translate-x-0");
}

// Função para buscar as tarefas do JSON Server
function buscarTarefas() {
    fetch("http://localhost:3000/tarefas")
        .then(resposta => {
            if (!resposta.ok) {
                // Lidar com erros HTTP, por exemplo, se o JSON Server não estiver rodando
                throw new Error(`Erro HTTP! Status: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then(json => {
            carregarTarefas(json);
        })
        .catch(error => console.error("Erro ao buscar tarefas:", error));
}

// Função para carregar e exibir as tarefas na lista
function carregarTarefas(tarefas) {
    const listaDeTarefas = document.querySelector("#lista-de-tarefas");
    listaDeTarefas.innerHTML = ''; // Limpa as tarefas existentes antes de carregar as novas

    if (tarefas.length === 0) {
        listaDeTarefas.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">Nenhuma tarefa encontrada. Que tal adicionar uma?</p>';
        return;
    }

    tarefas.forEach(tarefa => {
        // Formata a data para o padrão brasileiro
        const formattedDate = new Date(tarefa.data).toLocaleDateString('pt-BR');
        listaDeTarefas.innerHTML += `
            <div class="bg-white dark:bg-gray-700 shadow rounded p-4">
                <h3 class="font-bold text-gray-700 dark:text-gray-300">${tarefa.titulo}</h3>
                <p class="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">${tarefa.descricao}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-[10px] text-gray-700 dark:text-gray-300">${formattedDate}</span>
                    <div class="flex gap-3">
                        <box-icon name='pencil' data-id="${tarefa.id}" onclick="editarTarefa(this)" class="cursor-pointer text-gray-700 dark:text-gray-300"></box-icon>
                        <box-icon name='trash' data-id="${tarefa.id}" onclick="excluirTarefa(this)" class="cursor-pointer text-gray-700 dark:text-gray-300"></box-icon>
                    </div>
                </div>
            </div>
        `;
    });
}

// Função para cadastrar uma nova tarefa
function cadastrarTarefa(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const tituloInput = document.querySelector("#titulo");
    const descricaoInput = document.querySelector("#descricao");

    const titulo = tituloInput.value.trim(); // Remove espaços em branco
    const descricao = descricaoInput.value.trim();

    if (!titulo || !descricao) {
        alert("Por favor, preencha o título e a descrição da tarefa.");
        return;
    }

    // Pega a data atual no formato YYYY-MM-DD
    const data = new Date().toISOString().slice(0, 10);

    fetch("http://localhost:3000/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo,
                descricao,
                data
            })
        })
        .then(response => response.json())
        .then(novaTarefa => {
            console.log("Nova tarefa adicionada:", novaTarefa);
            document.querySelector("#form-tarefa").reset(); // Limpa o formulário
            fecharGaveta(); // Fecha a gaveta lateral
            buscarTarefas(); // Recarrega as tarefas para exibir a nova
        })
        .catch(error => console.error("Erro ao cadastrar tarefa:", error));
}

// Garante que o DOM esteja totalmente carregado antes de anexar event listeners
document.addEventListener("DOMContentLoaded", () => {
    const formTarefa = document.querySelector("#form-tarefa");
    if (formTarefa) {
        formTarefa.addEventListener("submit", cadastrarTarefa);
    }
    buscarTarefas(); // Carrega as tarefas quando a página é carregada
});

// *** Funções de Edição e Exclusão (Lógica a ser implementada/melhorada) ***

// Função placeholder para editar uma tarefa (requer mais lógica)
function editarTarefa(element) {
    const taskId = element.dataset.id;
    alert(`Funcionalidade de edição para a tarefa com ID: ${taskId} será implementada aqui.`);
    console.log("Editar tarefa com ID:", taskId);
    // Para editar, você geralmente buscaria a tarefa pelo ID, preencheria o formulário da gaveta com os dados dela,
    // e então faria uma requisição PUT/PATCH para http://localhost:3000/tarefas/{id}
}

// Função para excluir uma tarefa
function excluirTarefa(element) {
    const taskId = element.dataset.id;
    if (confirm(`Tem certeza que deseja excluir a tarefa com ID: ${taskId}?`)) {
        fetch(`http://localhost:3000/tarefas/${taskId}`, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    console.log("Tarefa excluída com sucesso!");
                    buscarTarefas(); // Recarrega as tarefas após a exclusão
                } else {
                    console.error("Erro ao excluir tarefa.");
                }
            })
            .catch(error => console.error("Erro de rede ao excluir tarefa:", error));
    }
}