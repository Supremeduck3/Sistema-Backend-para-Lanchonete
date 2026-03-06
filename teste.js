async function buscarEndereco(cep) {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    console.log(dados);
}

buscarEndereco(66073426);
