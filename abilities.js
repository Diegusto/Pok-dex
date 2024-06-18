// Evento acionado quando o documento HTML é completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicia a configuração do menu hambúrguer
    setupHamburgerMenu();
    // Carrega as habilidades de Pokémon na página
    loadAbilities();
});

// Variáveis de controle para a paginação
let offset = 0;
const limit = 20;

// Função para carregar as habilidades de Pokémon da API
async function loadAbilities() {
    try {
        // Faz uma requisição para obter as habilidades com base no offset e limit
        const response = await fetch(`https://pokeapi.co/api/v2/ability?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        // Exibe os nomes das habilidades na página
        displayAbilityNames(data.results);
    } catch (error) {
        console.error('Falha ao buscar dados das habilidades:', error);
    }
}

// Função para exibir os nomes das habilidades na página
function displayAbilityNames(abilityList) {
    const abilitiesContainer = document.getElementById('abilities-container');
    abilitiesContainer.innerHTML = '';

    // Itera sobre a lista de habilidades e cria um elemento para cada uma
    abilityList.forEach((ability) => {
        const abilityItem = document.createElement('div');
        abilityItem.className = 'ability-item';
        abilityItem.innerHTML = `<p class="ability-name">${ability.name}</p>`;
        abilityItem.addEventListener('click', () => loadAbilityDetails(ability.url));
        abilitiesContainer.appendChild(abilityItem);
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
            loadAbilities();
        }
    };

    nextButton.onclick = () => {
        offset += limit;
        loadAbilities();
    };
}

// Função para carregar os detalhes de uma habilidade específica
async function loadAbilityDetails(url) {
    try {
        // Faz uma requisição para obter os detalhes da habilidade com a URL especificada
        const response = await fetch(url);
        const abilityData = await response.json();
        // Exibe os detalhes da habilidade na página
        displayAbilityDetails(abilityData);
    } catch (error) {
        console.error('Falha ao buscar detalhes da habilidade:', error);
    }
}

// Função para exibir os detalhes de uma habilidade na página
function displayAbilityDetails(abilityData) {
    const abilitiesContainer = document.getElementById('abilities-container');
    abilitiesContainer.innerHTML = '';

    // Encontra a descrição em inglês da habilidade
    const descriptionEntry = abilityData.effect_entries.find(entry => entry.language.name === 'en');
    const description = descriptionEntry ? descriptionEntry.effect : 'Descrição não disponível';

    // Cria um cartão com os detalhes da habilidade
    const abilityCard = document.createElement('div');
    abilityCard.className = 'pokemon-card';
    abilityCard.innerHTML = `
        <div>
            <h2>${abilityData.id}. ${abilityData.name}</h2>
            <p>Descrição: ${description}</p>
            <button id="back">Voltar às habilidades</button>
        </div>
    `;

    abilitiesContainer.appendChild(abilityCard);

    // Evento para o botão de voltar
    const backButton = document.getElementById('back');
    backButton.onclick = loadAbilities;

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
