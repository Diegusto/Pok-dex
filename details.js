// Evento que é acionado quando o DOM do documento é completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicia a configuração do menu hambúrguer
    setupHamburgerMenu();

    // Obtém os parâmetros da URL (no caso, o parâmetro 'url' passado na URL)
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');

    // Verifica se há um parâmetro 'url' na URL atual
    if (url) {
        // Se houver, carrega os detalhes do Pokémon com a URL especificada
        loadPokemonDetails(url);
    } else {
        // Se não houver, exibe uma mensagem informando que não há detalhes de Pokémon para mostrar
        document.getElementById('pokemon-details').innerHTML = '<p>Não há detalhes de Pokémon para mostrar.</p>';
    }
});

// Função para configurar o menu de hambúrguer
function setupHamburgerMenu() {
    // Obtém o botão do menu hambúrguer e o menu de navegação
    const menuButton = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    // Adiciona um evento de clique ao botão do menu hambúrguer para mostrar/ocultar o menu de navegação
    menuButton.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });
}

// Função para carregar os detalhes do Pokémon a partir de uma URL específica
async function loadPokemonDetails(url) {
    try {
        // Faz uma requisição para obter os detalhes do Pokémon com a URL especificada
        const response = await fetch(url);
        const pokemon = await response.json();

        // Faz uma segunda requisição para obter detalhes adicionais do Pokémon (como espécies)
        const speciesResponse = await fetch(pokemon.species.url);
        const species = await speciesResponse.json();

        // Verifica se há mais de uma variedade de Pokémon (formas diferentes)
        if (species.varieties.length > 1) {
            // Se houver mais de uma variedade, carrega os detalhes de cada variedade
            const varieties = await Promise.all(species.varieties.map(async (variety) => {
                const varietyResponse = await fetch(variety.pokemon.url);
                return await varietyResponse.json();
            }));

            // Exibe os detalhes das variedades do Pokémon
            displayPokemonDetails(pokemon, varieties);
        } else {
            // Se houver apenas uma variedade, exibe os detalhes dela
            displayPokemonDetails(pokemon, [pokemon]);
        }
    } catch (error) {
        console.error('Falha ao buscar detalhes do Pokémon:', error);
    }
}

// Função para exibir os detalhes do Pokémon na página
function displayPokemonDetails(pokemon, varieties) {
    const pokemonDetails = document.getElementById('pokemon-details');
    let formsHTML = '';

    // Para cada variedade de Pokémon, cria um bloco de HTML com os detalhes
    varieties.forEach(variety => {
        formsHTML += `
            <div class="pokemon-form">
                <h2>${variety.name}</h2>
                <img src="${variety.sprites.front_default}" alt="${variety.name}">
                <p>Altura: ${variety.height}</p>
                <p>Peso: ${variety.weight}</p>
                <p>Tipo: ${variety.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                <p>Habilidades: ${variety.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
                <h3>Estatísticas</h3>
                ${variety.stats.map(stat => `
                    <div class="stat">
                        <span class="stat-name">${stat.stat.name}</span>: ${stat.base_stat}
                        <div class="stat-bar stat-${stat.stat.name.toLowerCase()}">
                            <div class="stat-bar-fill" style="width: ${(stat.base_stat / 255) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });

    // Define o HTML gerado no contêiner de detalhes do Pokémon na página
    pokemonDetails.innerHTML = formsHTML;

    // Adiciona um botão "Voltar" que chama a função goBack() para voltar à página anterior
    pokemonDetails.innerHTML += `<button onclick="goBack()">Voltar</button>`;
}

// Função para voltar à página anterior
function goBack() {
    window.history.back();
}
