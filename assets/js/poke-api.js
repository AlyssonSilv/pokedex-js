const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes do Pokémon: ${response.statusText}`);
            }
            return response.json();
        })
        .then(convertPokeApiDetailToPokemon)
        .catch(error => {
            console.error(error);
            alert('Ocorreu um erro ao carregar os detalhes do Pokémon. Tente novamente mais tarde.');
        });
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar Pokémon: ${response.statusText}`);
            }
            return response.json();
        })
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .catch(error => {
            console.error(error);
            alert('Ocorreu um erro ao carregar a lista de Pokémon. Tente novamente mais tarde.');
        });
}
