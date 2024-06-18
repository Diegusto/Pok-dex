// Evento acionado quando o documento HTML é completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicia a configuração do menu hambúrguer
    setupHamburgerMenu();
    // Carrega os movimentos de Pokémon na página
    loadMoves();
});

// Variáveis de controle para a paginação
let offset = 0;
const limit = 20;

// Função para carregar os movimentos de Pokémon da API
async function loadMoves() {
    try {
        // Faz uma requisição para obter os movimentos com base no offset e limit
        const response = await fetch(`https://pokeapi.co/api/v2/move?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        // Exibe os nomes dos movimentos na página
        displayMoveNames(data.results);
    } catch (error) {
        console.error('Falha ao buscar dados dos movimentos:', error);
    }
}

// Função para exibir os nomes dos movimentos na página
function displayMoveNames(moveList) {
    const movesContainer = document.getElementById('moves-container');
    movesContainer.innerHTML = '';

    // Itera sobre a lista de movimentos e cria um elemento para cada um
    moveList.forEach((move) => {
        const moveItem = document.createElement('div');
        moveItem.className = 'move-item';
        moveItem.innerHTML = `<p class="move-name">${move.name}</p>`;
        moveItem.addEventListener('click', () => loadMoveDetails(move.url));
        movesContainer.appendChild(moveItem);
    });

    // Exibe os botões de paginação
    const pagination = document.getElementById('pagination');
    pagination.style.display = 'flex';

    // Configuração dos botões de paginação
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.disabled = offset === 0;
    prevButton.onclick = () => {
        if (offset > 0) {
            offset -= limit;
            loadMoves();
        }
    };

    nextButton.onclick = () => {
        offset += limit;
        loadMoves();
    };
}

// Função para carregar os detalhes de um movimento específico
async function loadMoveDetails(url) {
    try {
        // Faz uma requisição para obter os detalhes do movimento com a URL especificada
        const response = await fetch(url);
        const moveData = await response.json();
        // Exibe os detalhes do movimento na página
        displayMoveDetails(moveData);
    } catch (error) {
        console.error('Falha ao buscar detalhes do movimento:', error);
    }
}

// Função para exibir os detalhes de um movimento na página
function displayMoveDetails(moveData) {
    const movesContainer = document.getElementById('moves-container');
    movesContainer.innerHTML = '';

    // Determina a categoria do movimento (Físico, Especial, Status)
    let category;
    switch (moveData.damage_class.name) {
        case 'physical':
            category = 'Físico';
            break;
        case 'special':
            category = 'Especial';
            break;
        case 'status':
            category = 'Status';
            break;
        default:
            category = 'Desconhecido';
    }

    // Encontra a descrição em inglês do movimento
    const descriptionEntry = moveData.effect_entries.find(entry => entry.language.name === 'en');
    const description = descriptionEntry ? descriptionEntry.effect : 'Descrição não disponível';

    // Cria um cartão com os detalhes do movimento
    const moveCard = document.createElement('div');
    moveCard.className = 'pokemon-card';
    moveCard.innerHTML = `
        <div>
            <h2>${moveData.id}. ${moveData.name}</h2>
            <p>Tipo: ${moveData.type.name}</p>
            <p>Poder: ${moveData.power}</p>
            <p>PP: ${moveData.pp}</p>
            <p>Precisão: ${moveData.accuracy}</p>
            <p>Categoria: ${category}</p>
            <p>Descrição: ${description}</p>
            <button id="back">Voltar aos movimentos</button>
        </div>
    `;

    movesContainer.appendChild(moveCard);

    // Evento para o botão de voltar
    const backButton = document.getElementById('back');
    backButton.onclick = loadMoves;

    // Esconde os botões de paginação enquanto os detalhes são exibidos
    const pagination = document.getElementById('pagination');
    pagination.style.display = 'none';
}

// Função para configurar o menu hambúrguer
function setupHamburgerMenu() {
    const menuButton = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    menuButton.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });
}
