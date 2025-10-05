import db from '../config/db.js';

class Agregado {
    static sanitize(dados) {
        const result = {};
        for (const key in dados) {
            if (dados[key] === '') {
                result[key] = null;
            } else {
                result[key] = dados[key];
            }
        }
        return result;
    }

    static create(dadosAgregado) {
        const dados = Agregado.sanitize(dadosAgregado);

        const query = `
            INSERT INTO Agregados (
                genero, nome, cnpj, cpf, nascimento, cidadeNascimento, telefone, email, rg, 
                emissaoRG, orgaoExp, pai, mae, pis, cep, endereco, nomeProprietario, placa, 
                marca, modelo, cor, anoFabricacao, cilindrada, bauSuporte, seguro, 
                valorMinSaida, valorKmRodado, cursoMotoFrete
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
            dados.genero, dados.nome, dados.cnpj, dados.cpf, 
            dados.nascimento, dados.cidadeNascimento, dados.telefone, 
            dados.email, dados.rg, dados.emissaoRG, dados.orgaoExp, 
            dados.pai, dados.mae, dados.pis, dados.cep, 
            dados.endereco, dados.nomeProprietario, dados.placa, 
            dados.marca, dados.modelo, dados.cor, dados.anoFabricacao, 
            dados.cilindrada, dados.bauSuporte === 'Sim', dados.seguro === 'Sim', 
            dados.valorMinSaida, dados.valorKmRodado, dados.cursoMotoFrete === 'Sim'
        ];
        
        return db.promise().query(query, values);
    }
}

export default Agregado;
