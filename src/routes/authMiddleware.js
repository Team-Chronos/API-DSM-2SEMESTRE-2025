import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ mensagem: "Token inválido" });
    }
};