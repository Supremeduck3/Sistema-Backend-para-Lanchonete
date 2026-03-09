import 'dotenv/config.js';

const autenticar = (res, req, next) => {
    if (!chave || chave !== process.env.API_key) {
        return res.status(401).json({erro: 'acesso não autorizado X-API key invalida'})
    }

    next();
}

export default autenticar
