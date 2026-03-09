import 'dotenv/config.js';

const autenticar = (req, res, next) => {
    const chave = req.headers['x-api-key'];

    if (!chave || chave !== process.env.API_KEY) {
        return res.status(401).json({erro: 'acesso não autorizado X-API key invalida'})
    }

    next();
}

export default autenticar
