import db from '../config/db.js';

const converterParaPascalCase = (obj) => {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
        let pascalKey = key.split('_')
            .map(word => {
                const siglas = ['adm', 'ok'];
                if (siglas.includes(word.toLowerCase())) {
                    return word.toUpperCase();
                }
                if (word.toLowerCase() === 'fem') return 'Fem';
                if (word.toLowerCase() === 'masc') return 'Masc';
                if (word.toLowerCase() === 'arcond') return 'ArCond';
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join('_');
        converted[pascalKey] = value;
    }
    return converted;
};

const converterBooleanos = (obj) => {
    const booleanFields = [
        'ArCond_ADM', 'ArCond_Diretoria', 'ArCond_Reuniao', 'ArCond_Operacional',
        'Lampadas_ADM', 'Lampadas_Diretoria', 'Lampadas_Reuniao', 'Lampadas_Operacional',
        'Lampadas_Galpao', 'Lampadas_Refeitorio', 'Lampadas_BanheiroFem', 'Lampadas_BanheiroMasc',
        'Macanetas_OK', 'Mesas_Protecao_OK', 'Cameras_OK', 'Cadeiras_Ruim'
    ];

    const converted = { ...obj };
    booleanFields.forEach(field => {
        if (converted[field] !== undefined && converted[field] !== null) {
            converted[field] = Boolean(converted[field]);
        }
    });
    return converted;
};

export const criarChecklist = async (req, res) => {
    try {
        console.log('Dados recebidos no backend:', req.body);

        const dadosConvertidos = converterParaPascalCase(req.body);
        const dadosProcessados = converterBooleanos(dadosConvertidos);

        console.log('Dados processados:', dadosProcessados);

        const {
            Responsavel,
            Data_Verificacao,
            Piso_ADM = '',
            Piso_Operacional = '',
            Piso_Galpao = '',
            Piso_Refeitorio = '',
            Forro_ADM = '',
            Forro_Operacional = '',
            Forro_Galpao = '',
            Forro_Refeitorio = '',
            Instalacoes_Eletricas = '',
            Protecao_Raios = '',
            ArCond_ADM = false,
            ArCond_Diretoria = false,
            ArCond_Reuniao = false,
            ArCond_Operacional = false,
            Lampadas_ADM = false,
            Lampadas_Diretoria = false,
            Lampadas_Reuniao = false,
            Lampadas_Operacional = false,
            Lampadas_Galpao = false,
            Lampadas_Refeitorio = false,
            Lampadas_BanheiroFem = false,
            Lampadas_BanheiroMasc = false,
            Macanetas_OK = false,
            Mesas_Protecao_OK = false,
            Condicoes_Paleteiras = '',
            Organizacao_Local = '',
            Cameras_OK = false,
            Balanca_Condicao = '',
            Data_Afericao_Balanca = null,
            Condicoes_Mictorios = '',
            Data_Limpeza_Bebedouro = null,
            Data_Prox_Dedetizacao = null,
            Data_Ult_Recarga_Extintores = null,
            Data_Prox_Recarga_Extintores = null,
            Data_Limpeza_Caixa = null,
            Data_Prox_Limpeza = null,
            Cadeiras_Ruim = false,
            Cadeiras_Detalhe = '',
            Observacoes = ''
        } = dadosProcessados;

        if (!Responsavel || !Data_Verificacao) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios: Responsavel, Data_Verificacao",
                dadosRecebidos: req.body
            });
        }

        const query = `
            INSERT INTO ChecklistManutencao (
                Responsavel, Data_Verificacao, Piso_ADM, Piso_Operacional, Piso_Galpao, Piso_Refeitorio,
                Forro_ADM, Forro_Operacional, Forro_Galpao, Forro_Refeitorio, Instalacoes_Eletricas, Protecao_Raios,
                ArCond_ADM, ArCond_Diretoria, ArCond_Reuniao, ArCond_Operacional,
                Lampadas_ADM, Lampadas_Diretoria, Lampadas_Reuniao, Lampadas_Operacional,
                Lampadas_Galpao, Lampadas_Refeitorio, Lampadas_BanheiroFem, Lampadas_BanheiroMasc,
                Macanetas_OK, Mesas_Protecao_OK, Condicoes_Paleteiras, Organizacao_Local,
                Cameras_OK, Balanca_Condicao, Data_Afericao_Balanca, Condicoes_Mictorios,
                Data_Limpeza_Bebedouro, Data_Prox_Dedetizacao, Data_Ult_Recarga_Extintores,
                Data_Prox_Recarga_Extintores, Data_Limpeza_Caixa, Data_Prox_Limpeza,
                Cadeiras_Ruim, Cadeiras_Detalhe, Observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            Responsavel, Data_Verificacao, Piso_ADM, Piso_Operacional, Piso_Galpao, Piso_Refeitorio,
            Forro_ADM, Forro_Operacional, Forro_Galpao, Forro_Refeitorio, Instalacoes_Eletricas, Protecao_Raios,
            ArCond_ADM, ArCond_Diretoria, ArCond_Reuniao, ArCond_Operacional,
            Lampadas_ADM, Lampadas_Diretoria, Lampadas_Reuniao, Lampadas_Operacional,
            Lampadas_Galpao, Lampadas_Refeitorio, Lampadas_BanheiroFem, Lampadas_BanheiroMasc,
            Macanetas_OK, Mesas_Protecao_OK, Condicoes_Paleteiras, Organizacao_Local,
            Cameras_OK, Balanca_Condicao, Data_Afericao_Balanca || null, Condicoes_Mictorios,
            Data_Limpeza_Bebedouro || null, Data_Prox_Dedetizacao || null, Data_Ult_Recarga_Extintores || null,
            Data_Prox_Recarga_Extintores || null, Data_Limpeza_Caixa || null, Data_Prox_Limpeza || null,
            Cadeiras_Ruim, Cadeiras_Detalhe, Observacoes
        ];

        console.log('Executando query com valores:', valores);

        const [result] = await db.promise().query(query, valores);

        res.status(201).json({
            mensagem: "Checklist criado com sucesso!",
            idChecklist: result.insertId,
            dados: dadosProcessados
        });

    } catch (error) {
        console.error("Erro detalhado ao criar checklist:", error);
        res.status(500).json({ 
            mensagem: "Erro interno ao criar checklist.",
            erro: error.message 
        });
    }
};

export const listarChecklists = async (req, res) => {
    try {
        const query = `
            SELECT * FROM ChecklistManutencao
            ORDER BY Data_Verificacao DESC
        `;
        const [checklists] = await db.promise().query(query);
        
        const checklistsConvertidos = checklists.map(checklist => {
            const converted = {};
            for (const [key, value] of Object.entries(checklist)) {
                const snakeKey = key.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toLowerCase());
                converted[snakeKey] = value;
            }
            return converted;
        });

        res.status(200).json(checklistsConvertidos);
    } catch (error) {
        console.error("Erro ao listar checklists:", error);
        res.status(500).json({ 
            mensagem: "Erro interno ao listar checklists.",
            erro: error.message 
        });
    }
};

export const obterChecklistPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM ChecklistManutencao WHERE ID_Checklist = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "Checklist não encontrado." });
        }

        const checklist = rows[0];
        const converted = {};
        for (const [key, value] of Object.entries(checklist)) {
            const snakeKey = key.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toLowerCase());
            converted[snakeKey] = value;
        }

        res.status(200).json(converted);
    } catch (error) {
        console.error("Erro ao obter checklist:", error);
        res.status(500).json({ 
            mensagem: "Erro interno ao obter checklist.",
            erro: error.message 
        });
    }
};

export const excluirChecklist = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.promise().query(
            "DELETE FROM ChecklistManutencao WHERE ID_Checklist = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Checklist não encontrado." });
        }

        res.status(200).json({ mensagem: "Checklist excluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir checklist:", error);
        res.status(500).json({ 
            mensagem: "Erro interno ao excluir checklist.",
            erro: error.message 
        });
    }
};