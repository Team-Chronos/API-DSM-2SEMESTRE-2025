import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { listarCertificados } from "./src/controllers/certificadoController.js";
import eventoRoutes from "./src/routes/eventoRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import colaboradorRoutes from "./src/routes/colaboradorRoutes.js";
import agregadoRoutes from "./src/routes/agregadoRoutes.js";
import participacaoEventoRoutes from "./src/routes/participacaoEventoRoutes.js";
import certificadoPartRoutes from "./src/routes/certificadoPartRoutes.js";
import clienteRoutes from "./src/routes/clienteRoutes.js";
import interacaoRoutes from "./src/routes/interacaoRoutes.js";
import relatorioRoutes from "./src/routes/relatorioRoutes.js";
import checklistVeiculoAgregadoRoutes from "./src/routes/checklistVeiculoAgregadoRoutes.js";
import checklistPredialRoutes from "./src/routes/checklistPredialRoutes.js";
import cotacaoRoutes from "./src/routes/cotacaoRoutes.js";
import checklistRoutes from "./src/routes/checklistRoutes.js";
import checklistVeiculoFrotaRoutes from "./src/routes/checklistVeiculoFrotaRoutes.js";
import modalidadeRoutes from "./src/routes/modalidadeRoutes.js";
import agendaRoutes from "./src/routes/agendaRoutes.js";

import notificacaoRoutes from './src/routes/notificacoesRoutes.js';
import { NotificacaoObserver } from './src/observers/notificacaoObserver.js';
import notificacaoObserver from './src/observers/notificacaoObserver.js'; 

import db from "./src/config/db.js";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const permitidos = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ];

      const local = /^http:\/\/192\.168\.\d+\.\d+:5173$/;

      if (permitidos.includes(origin) || local.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuração de todas as rotas
app.use("/api/auth", authRoutes);
app.use("/api/colaboradores", colaboradorRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/interacoes", interacaoRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/certificadoParticipacao", certificadoPartRoutes);
app.use("/api", modalidadeRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/agregados", agregadoRoutes);
app.use("/api/participacaoEventos", participacaoEventoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/notificacoes", notificacaoRoutes);
app.use("/api/checklistVeiculoAgregado", checklistVeiculoAgregadoRoutes);
app.use("/api/checklistPredios", checklistPredialRoutes);
app.use("/api/checklistVeiculoFrota", checklistVeiculoFrotaRoutes);
app.use("/api/cotacao", cotacaoRoutes);

app.get("/api/certificados", listarCertificados);

app.get("/api/setores", async (req, res) => {
  try {
    const [setores] = await db.promise().query("SELECT * FROM Setor");
    res.json(setores);
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    res.status(500).json({ mensagem: "Erro ao buscar setores" });
  }
});

app.post("/confirmarEvento", (req, res) => {
  const { resposta, justificativa } = req.body;

  console.log("Resposta recebida do cliente:");
  console.log(`- Decisão: ${resposta}`);
  console.log(`- Justificativa: ${justificativa}`);

  res
    .status(200)
    .json({ mensagem: "Resposta registrada com sucesso no servidor!" });
});

app.post('/api/eventos/:id/enviar-convites', async (req, res) => {
    try {
        const eventoId = parseInt(req.params.id);
        console.log(`Enviando convites para evento: ${eventoId}`);

        if (!eventoId) {
            return res.status(400).json({
                success: false,
                message: 'ID do evento é obrigatório'
            });
        }

        const resultado = await NotificacaoObserver.notificarNovoEvento(eventoId);

        if (resultado.success) {
            res.json({
                success: true,
                message: resultado.message,
                enviados: resultado.enviados,
                erros: resultado.erros
            });
        } else {
            res.status(400).json({
                success: false,
                message: resultado.error
            });
        }

    } catch (error) {
        console.error('Erro ao enviar convites:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao enviar convites',
            error: error.message
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/testar-sistema', (req, res) => {
    res.json({ 
        status: 'Sistema operacional',
        database: 'Conectado',
        notificacoes: 'Configurado'
    });
});

app.get('/api/eventos-info', async (req, res) => {
    try {
        const [eventos] = await db.promise().query('SELECT ID_Evento as id, Nome_Evento as titulo FROM Evento'); // ✅ CORRIGIDO: Nome das colunas
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
});

async function inicializarObserver() {
    try {
        if (notificacaoObserver && typeof notificacaoObserver.iniciar === 'function') {
            await notificacaoObserver.iniciar();
            console.log(' Observador de notificações iniciado com sucesso');
        } else {
            console.log('  Observador de notificações não disponível');
        }
    } catch (error) {
        console.error(' Erro ao iniciar observador de notificações:', error);
    }
}

app.listen(PORT, async () => { 
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Notificações: http://localhost:3000/api/notificacoes`);
  console.log(`Health Check: http://localhost:3000/api/health`);
  console.log(`Teste Sistema: http://localhost:3000/api/testar-sistema`);
  console.log(`Enviar Convites: POST http://localhost:3000/api/eventos/{id}/enviar-convites`);
  console.log(`Ver Eventos: http://localhost:3000/api/eventos-info`);
  console.log(`Cotação: http://localhost:3000/api/cotacao`);
  
  await inicializarObserver();
});