import express from 'express';
import {
    criarNotificacaoPersonalizada,
    listarNotificacoes,
    notificacaoRapida,
    notificarTodos,
    obterNotificacaoPorId,
    obterDestinatariosDisponiveis,
    obterEstatisticas,
    cancelarNotificacao,
    reenviarNotificacao,
    dashboardNotificacoes
} from '../controllers/notificacaoController.js';

const router = express.Router();

const autenticar = (req, res, next) => {
    req.user = { id: 1 };
    next();
};

router.use(autenticar); 

router.post('/personalizada', criarNotificacaoPersonalizada);
router.post('/rapida', notificacaoRapida);
router.post('/todos', notificarTodos);
router.get('/', listarNotificacoes);
router.get('/destinatarios', obterDestinatariosDisponiveis);
router.get('/estatisticas', obterEstatisticas);
router.get('/dashboard', dashboardNotificacoes);
router.get('/:id', obterNotificacaoPorId);
router.put('/:id/cancelar', cancelarNotificacao);
router.put('/:id/reenviar', reenviarNotificacao);

export default router;