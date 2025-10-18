import type { Request, Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import db from '../config/db.js'; 
import { RelatorioService } from '../controllers/relatorioController.js'; 

interface QueryParams {
    tipo: 'vendas' | 'interacoes' | 'clientes';
    periodo: 'dia' | 'mes' | 'ano';
    data_inicio: string;
    data_fim: string;
    cidade: string;
    segmento_id: number;
}

interface RelatorioData extends RowDataPacket {
    periodo: string;
    total: number;
}

export default async function graficoDados(req: Request, res: Response): Promise<any> { 
    
    const queryParams: QueryParams = req.query as unknown as QueryParams;
    const { tipo = 'vendas', periodo = 'mes' } = queryParams;

    try {
        const { sqlQuery, sqlParams } = RelatorioService.getRelatorioQuery(queryParams);

        if (!sqlQuery) {
            return res.status(400).json({ message: 'Tipo de relatório inválido. Use: vendas, interacoes, ou clientes.' });
        }
        
        const [rows] = await db.promise().query<RelatorioData[]>(sqlQuery, sqlParams);
        
        if (!Array.isArray(rows)) {
            console.error('Resultado inesperado do banco de dados:', rows);
            return res.status(500).json({ 
                message: 'Formato de dados inesperado do banco de dados.' 
            });
        }
        
        return res.json({
            message: `Relatório de ${tipo} gerado com sucesso.`,
            periodo_agrupamento: periodo,
            data: rows
        });

    } catch (error) {
        console.error('Erro ao gerar dados do gráfico:', error);
        return res.status(500).json({ 
            message: 'Erro interno do servidor ao consultar o banco de dados.', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}