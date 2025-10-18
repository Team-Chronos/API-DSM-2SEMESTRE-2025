interface QueryParams {
    tipo?: 'vendas' | 'interacoes' | 'clientes';
    periodo?: 'dia' | 'mes' | 'ano';
    data_inicio?: string;
    data_fim?: string;
    cidade?: string;
    segmento_id?: number;
}

interface QueryResult {
    sqlQuery: string;
    sqlParams: (string | number)[];
}

export class RelatorioService {

    private static getDateFormat(periodo: QueryParams['periodo']): string {
        switch (periodo) {
            case 'dia':
                return '%Y-%m-%d';
            case 'ano':
                return '%Y';
            case 'mes':
            default:
                return '%Y-%m';
        }
    }

    public static getRelatorioQuery(params: QueryParams): QueryResult {
        const { tipo, periodo, data_inicio, data_fim, cidade, segmento_id } = params;
        const dateFormat = RelatorioService.getDateFormat(periodo);
        
        let sqlQuery = '';
        const sqlParams: (string | number)[] = [];

        sqlParams.push(dateFormat);

        if (tipo === 'vendas') {
            sqlQuery = `
                SELECT
                    DATE_FORMAT(V.Data_Venda, ?) AS Periodo_Agrupamento, 
                    CL.Cidade,
                    SEG.Nome_Segmento AS Segmento,
                    COUNT(V.ID_Venda) AS Total_Vendas_Feitas,
                    SUM(V.Valor) AS Valor_Total_Vendas
                FROM
                    Vendas V
                JOIN
                    Cliente CL ON V.ID_Cliente = CL.ID_Cliente
                LEFT JOIN
                    Segmento_Cliente SEG ON CL.ID_Segmento = SEG.ID_Segmento
                WHERE 1=1
            `;
            
            if (data_inicio && data_fim) {
                sqlQuery += ' AND V.Data_Venda BETWEEN ? AND ?';
                sqlParams.push(data_inicio, data_fim);
            }
            if (cidade) {
                sqlQuery += ' AND CL.Cidade = ?';
                sqlParams.push(cidade);
            }
            if (segmento_id) {
                sqlQuery += ' AND SEG.ID_Segmento = ?';
                sqlParams.push(segmento_id);
            }
            sqlQuery += `
                GROUP BY
                    Periodo_Agrupamento, CL.Cidade, Segmento
                ORDER BY
                    Periodo_Agrupamento ASC, Valor_Total_Vendas DESC
            `;

        } else if (tipo === 'interacoes') {
            sqlQuery = `
                SELECT
                    DATE_FORMAT(HI.Data_Interacao, ?) AS Periodo_Agrupamento,
                    C.Nome_Col AS Colaborador,
                    HI.Tipo_Interacao AS Tipo,
                    COUNT(HI.ID_Interacao) AS Total_Interacoes,
                    SUM(CASE WHEN HI.Sucesso = TRUE THEN 1 ELSE 0 END) AS Interacoes_Com_Sucesso
                FROM
                    Historico_Interacao HI
                JOIN
                    Colaboradores C ON HI.ID_Colaborador = C.ID_colaborador
                WHERE 1=1
            `;
            
            if (data_inicio && data_fim) {
                sqlQuery += ' AND HI.Data_Interacao BETWEEN ? AND ?';
                sqlParams.push(data_inicio, data_fim);
            }

            sqlQuery += `
                GROUP BY
                    Periodo_Agrupamento, C.Nome_Col, HI.Tipo_Interacao
                ORDER BY
                    Periodo_Agrupamento ASC, Total_Interacoes DESC
            `;

        } else if (tipo === 'clientes') {
            sqlQuery = `
                SELECT
                    DATE_FORMAT(CL.Data_Cadastro, ?) AS Periodo_Agrupamento,
                    CL.Cidade,
                    SEG.Nome_Segmento AS Segmento,
                    COUNT(CL.ID_Cliente) AS Total_Clientes
                FROM
                    Cliente CL
                LEFT JOIN
                    Segmento_Cliente SEG ON CL.ID_Segmento = SEG.ID_Segmento
                WHERE 1=1
            `;
            
            if (data_inicio && data_fim) {
                sqlQuery += ' AND CL.Data_Cadastro BETWEEN ? AND ?';
                sqlParams.push(data_inicio, data_fim);
            }
            if (cidade) {
                sqlQuery += ' AND CL.Cidade = ?';
                sqlParams.push(cidade);
            }
            if (segmento_id) {
                sqlQuery += ' AND SEG.ID_Segmento = ?';
                sqlParams.push(segmento_id);
            }
            sqlQuery += `
                GROUP BY
                    Periodo_Agrupamento, CL.Cidade, Segmento
                ORDER BY
                    Periodo_Agrupamento ASC, Total_Clientes DESC
            `;

        } else {
             return { sqlQuery: '', sqlParams: [] };
        }

        return { sqlQuery, sqlParams };
    }
}