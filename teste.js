const resposta = await fetch(`https://viacep.com.br/ws/${filtros.cidade}/json/`);
const dados = await resposta.json();

if (dados.erro === 'true') {
    return console.log('erro')
}
const buscarPorClima = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${dados.cidade}&count=1&language=pt&countryCode=BR`,
);
