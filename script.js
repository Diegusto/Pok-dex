// Este evento é acionado quando o DOM do documento é completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicia a configuração do menu hambúrguer
    setupHamburgerMenu();
    // Inicia a configuração da funcionalidade de pesquisa
    setupSearch();
    // Carrega os Pokémon na página inicial
    loadPokemon();
});

// Variáveis de controle para a paginação e limite de resultados
let offset = 0;
const limit = 20;

// Função para carregar Pokémon da API
async function loadPokemon(query = '') {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
        if (query) {
            // Atualiza a URL para buscar um Pokémon específico se houver uma consulta
            url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Pokemon not found');
            }
            const pokemon = await response.json();
            // Exibe o Pokémon encontrado na página
            displayPokemon([pokemon]);
            return;
        } else {
            const response = await fetch(url);
            const data = await response.json();
            // Mapeia as URLs de cada Pokémon para obter os detalhes
            const pokemonPromises = data.results.map(async (result) => {
                const pokemonResponse = await fetch(result.url);
                return pokemonResponse.json();
            });
            // Aguarda todas as requisições de detalhes dos Pokémon serem concluídas
            const pokemonData = await Promise.all(pokemonPromises);
            // Ordena os Pokémon por número na Pokédex (id)
            pokemonData.sort((a, b) => a.id - b.id); // Ordenação por número na Pokédex
            // Exibe os Pokémon na página
            displayPokemon(pokemonData);
        }
    } catch (error) {
        console.error('Failed to fetch Pokémon data:', error);
    }
}

// Função para exibir os Pokémon na página
function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = ''; // Limpa o conteúdo atual do contêiner

    pokemonList.forEach((pokemon) => {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        // Cria o conteúdo do cartão com a imagem e o nome do Pokémon
        pokemonCard.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <div>
                <h2>${pokemon.id}. ${pokemon.name}</h2>
            </div>
        `;
        pokemonCard.addEventListener('click', () => {
            // Redireciona para os detalhes do Pokémon ao clicar no cartão
            window.location.href = `details.html?url=https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
        });

        pokemonContainer.appendChild(pokemonCard); // Adiciona o cartão ao contêiner
    });

    // Configuração dos botões de paginação
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.disabled = offset === 0; // Desabilita o botão anterior se estiver na primeira página
    prevButton.onclick = () => {
        if (offset > 0) {
            offset -= limit; // Atualiza o offset para a página anterior
            loadPokemon(); // Recarrega os Pokémon
        }
    };

    nextButton.onclick = () => {
        offset += limit; // Atualiza o offset para a próxima página
        loadPokemon(); // Recarrega os Pokémon
    };
}

// Função para configurar a funcionalidade de pesquisa
function setupSearch() {
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário
        // Obtém o valor do campo de pesquisa
        const query = document.getElementById('search-input').value;
        // Chama a função para carregar Pokémon com a consulta de pesquisa
        loadPokemon(query);
    });
}

// Função para configurar o menu hambúrguer
function setupHamburgerMenu() {
    const menuButton = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    // Adiciona um evento de clique ao botão do menu hambúrguer
    menuButton.addEventListener('click', () => {
        // Alterna a classe 'hidden' para mostrar ou ocultar o menu de navegação
        navMenu.classList.toggle('hidden');
    });
}
