import db from "../config/db.js";

const formatForMySQL = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const criarTarefa = async (req, res) => {
  const {
    ID_Colaborador,
    Titulo,
    Descricao,
    Data_Hora_Inicio,
    Data_Hora_Fim,
    Local_Evento,
    ID_Cliente,
    Prioridade,
  } = req.body;

  if (!ID_Colaborador || !Titulo || !Data_Hora_Inicio) {
    return res.status(400).json({
      mensagem: "Campos obrigatórios: ID_Colaborador, Titulo, Data_Hora_Inicio",
    });
  }

  try {
    const query = `
        INSERT INTO Agenda (
            ID_Colaborador,
            Titulo,
            Descricao,
            Data_Hora_Inicio,
            Data_Hora_Fim,
            Local_Evento,
            Status,
            Prioridade,
            ID_Cliente,
            Tipo_Contato
        ) VALUES (?, ?, ?, ?, ?, ?, 'Pendente', ?, ?, ?)
    `;

    const [result] = await db
      .promise()
      .query(query, [
        ID_Colaborador,
        Titulo,
        Descricao || null,
        Data_Hora_Inicio,
        Data_Hora_Fim || null,
        Local_Evento || null,
        Prioridade || "Média",
        ID_Cliente || null,
        null,
      ]);

    res.status(201).json({
      mensagem: "Lembrete agendado com sucesso!",
      idTarefa: result.insertId,
    });
  } catch (error) {
    console.error("Erro ao agendar tarefa:", error);
    res.status(500).json({ mensagem: "Erro interno ao agendar tarefa." });
  }
};

export const listarTarefasVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
        SELECT 
            a.*,
            c.Nome_Cliente
        FROM Agenda a
        LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
        WHERE a.ID_Colaborador = ?
        ORDER BY a.Data_Hora_Inicio ASC
    `;

    const [tarefas] = await db.promise().query(query, [id]);

    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ mensagem: "Erro interno ao listar tarefas." });
  }
};

export const listarTarefasProximas = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
        SELECT 
            a.*,
            c.Nome_Cliente,
            col.Nome_Col
        FROM Agenda a
        LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
        LEFT JOIN Colaboradores col ON a.ID_Colaborador = col.ID_colaborador
        WHERE a.ID_Colaborador = ? 
        AND a.Status = 'Pendente'
        AND a.Data_Hora_Inicio BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR)
        ORDER BY a.Data_Hora_Inicio ASC
    `;

    const [tarefas] = await db.promise().query(query, [id]);

    res.status(200).json({
      totalProximas: tarefas.length,
      tarefas: tarefas,
    });
  } catch (error) {
    console.error("Erro ao listar tarefas próximas:", error);
    res.status(500).json({ mensagem: "Erro interno ao listar tarefas." });
  }
};

export const atualizarStatusTarefa = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  if (
    !Status ||
    !["Pendente", "Em andamento", "Concluído", "Cancelado"].includes(Status)
  ) {
    return res.status(400).json({
      mensagem:
        "Status inválido. Use: Pendente, Em andamento, Concluído ou Cancelado",
    });
  }

  try {
    const query = "UPDATE Agenda SET Status = ? WHERE ID_Agenda = ?";
    const [result] = await db.promise().query(query, [Status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    }

    res.status(200).json({ mensagem: `Tarefa marcada como ${Status}!` });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ mensagem: "Erro interno ao atualizar tarefa." });
  }
};

export const obterTarefaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
        SELECT 
            a.*,
            c.Nome_Cliente,
            c.Telefone_Cliente,
            c.Email_Cliente,
            col.Nome_Col
        FROM Agenda a
        LEFT JOIN Cliente c ON a.ID_Cliente = c.ID_Cliente
        LEFT JOIN Colaboradores col ON a.ID_Colaborador = col.ID_colaborador
        WHERE a.ID_Agenda = ?
    `;

    const [tarefas] = await db.promise().query(query, [id]);

    if (tarefas.length === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    }

    res.status(200).json(tarefas[0]);
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).json({ mensagem: "Erro interno ao buscar tarefa." });
  }
};

export const atualizarTarefa = async (req, res) => {
  const { id } = req.params;
  const {
    Titulo,
    Descricao,
    Data_Hora_Inicio,
    Data_Hora_Fim,
    Local_Evento,
    Prioridade,
    ID_Cliente,
    Tipo_Contato,
  } = req.body;

  try {
    const dataInicioFormatada = formatForMySQL(new Date(Data_Hora_Inicio));
    const dataFimFormatada = Data_Hora_Fim
      ? formatForMySQL(new Date(Data_Hora_Fim))
      : null;

    const query = `
        UPDATE Agenda 
        SET Titulo = ?, Descricao = ?, Data_Hora_Inicio = ?, 
            Data_Hora_Fim = ?, Local_Evento = ?, Prioridade = ?,
            ID_Cliente = ?, Tipo_Contato = ?
        WHERE ID_Agenda = ?
    `;

    const [result] = await db
      .promise()
      .query(query, [
        Titulo,
        Descricao || null,
        dataInicioFormatada,
        dataFimFormatada,
        Local_Evento || null,
        Prioridade || "Média",
        ID_Cliente || null,
        Tipo_Contato || null,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    }

    res.status(200).json({ mensagem: "Tarefa atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ mensagem: "Erro interno ao atualizar tarefa." });
  }
};

export const excluirTarefa = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM Agenda WHERE ID_Agenda = ?";
    const [result] = await db.promise().query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    }

    res.status(200).json({ mensagem: "Tarefa excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ mensagem: "Erro interno ao excluir tarefa." });
  }
};
