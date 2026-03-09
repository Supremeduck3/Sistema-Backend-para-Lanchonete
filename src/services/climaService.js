export async function buscarClimaPorCep(cep) {
    try {
        const respostaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dadosCep = await respostaCep.json();

        if (dadosCep.erro) {
            return { erro: 'CEP inválido' };
        }

        const cidade = dadosCep.localidade;

        const geoResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&countryCode=BR`,
        );

        const geoData = await geoResp.json();

        if (!geoData.results || geoData.results.length === 0) {
            return null;
        }

        const { latitude, longitude } = geoData.results[0];

        const climaResp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&timezone=America/Sao_Paulo`,
        );

        const climaData = await climaResp.json();

        const temperatura = climaData.current.temperature_2m;
        const weathercode = climaData.current.weathercode;

        const chove = weathercode >= 51 && weathercode <= 67;
        const quente = temperatura >= 28;
        const frio = temperatura <= 18;

        let sugestao = 'Clima agradável! Aproveite para divulgar combos da casa.';

        if (chove) {
            sugestao = ' Dia chuvoso! Ofereça promoções para delivery.';
        } else if (quente) {
            sugestao = ' Dia quente! Destaque combos com bebida gelada.';
        } else if (frio) {
            sugestao = ' Dia frio! Destaque cafés e lanches quentes.';
        }

        return {
            temperatura,
            chove,
            quente,
            sugestao,
        };
    } catch (error) {
        return null;
    }
}


