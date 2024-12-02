const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    if (!pokemon || !pokemon.types || !pokemon.name || !pokemon.photo) {
        return '<li class="pokemon">Erro nos dados do Pokémon</li>';
    }
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    loadMoreButton.disabled = true; // Desabilita o botão durante o carregamento
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Carregando...';
    pokemonList.appendChild(loadingMessage);

    pokeApi.getPokemons(offset, limit)
        .then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML += newHtml;
        })
        .catch(error => {
            console.error('Erro ao carregar os Pokémon:', error);
            alert('Ocorreu um erro ao carregar os Pokémon. Tente novamente mais tarde.');
        })
        .finally(() => {
            loadingMessage.remove(); // Remove a mensagem de carregamento
            loadMoreButton.disabled = false; // Reabilita o botão após o carregamento
        });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);

        const endMessage = document.createElement('p');
        endMessage.textContent = 'Todos os Pokémon foram carregados!';
        pokemonList.appendChild(endMessage);
    } else {
        loadPokemonItens(offset, limit);
    }
});
