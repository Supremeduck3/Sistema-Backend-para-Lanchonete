
async function buscarEndereco(cep) {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro === 'true') {
        return res.status(400).json({ error: 'Verifique novamente o cep (Bad request)' });
    }

    console.log(dados.logradouro);
}
buscarEndereco(35900260);
