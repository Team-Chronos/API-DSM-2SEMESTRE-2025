import db from '../config/db.js';

export async function listarInteracoes(req, res){
  try{
    const query = `SELECT 
hi.*, 
c.Nome_Cliente, 
col.Nome_Col 
FROM Historico_Interacao hi
JOIN Cliente c ON hi.ID_Cliente = c.ID_Cliente
LEFT JOIN Colaboradores col ON hi.ID_Colaborador = col.ID_colaborador
ORDER BY hi.Data_Interacao DESC;
`
    const [interacoes] = await db.promise().query(query);

    res.status(200).json(interacoes); 

  } catch (err) {
    console.error("Erro ao listar interacões:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar interacões." });
  }
}

export async function listarInteracoesPorCliente(req, res){
  const { idCliente } = req.params
  if (!idCliente) {
    return res.status(400).json({ mensagem: "ID do cliente é obrigatório." });
  }
  try{
    const query = `SELECT 
hi.*, 
c.Nome_Cliente, 
col.Nome_Col 
FROM Historico_Interacao hi
JOIN Cliente c ON hi.ID_Cliente = c.ID_Cliente
LEFT JOIN Colaboradores col ON hi.ID_Colaborador = col.ID_colaborador
where hi.ID_Cliente = ?
ORDER BY hi.Data_Interacao DESC;
`
    const [interacoes] = await db.promise().query(query, [idCliente]);

    res.status(200).json(interacoes); 

  } catch (err) {
    console.error("Erro ao listar interacões:", err);
    res.status(500).json({ mensagem: "Erro interno ao listar interacões." });
  }
}

export async function criarInteracao(req, res) {
  const {ID_Cliente, ID_Colaborador, Tipo_Interacao, Descricao, Resultado} = req.body;

  try{
    const query = `INSERT INTO Historico_Interacao (ID_Cliente, ID_Colaborador, Tipo_Interacao, Descricao, Resultado)
VALUES (?, ?, ?, ?, ?);
`
    const [result] = await db.promise().query(query, [ID_Cliente, ID_Colaborador, Tipo_Interacao, Descricao, Resultado]);

    res.status(201).json({ mensagem: "Interação cadastrado com sucesso!" });

  } catch (err) {
    console.error("Erro ao cadastrar interação:", err);
    res.status(500).json({ mensagem: "Erro interno ao cadastrar interação." });
  }
}