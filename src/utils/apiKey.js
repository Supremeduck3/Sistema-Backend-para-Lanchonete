import 'dotenv/config';

const autenticar = (req, res, next) => {
    if (!chave || chave !== process.env.API_KEY) {
        return res.status(401).json({
            erro:'Acesso não autorizado. x-API-key inválida'
        })
    }
    next();
}

export default autenticar
