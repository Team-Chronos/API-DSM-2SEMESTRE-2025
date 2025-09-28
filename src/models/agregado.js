import db from '../config/db.js';

class Agregado {
    static create(dadosAgregado) {
        const query = `
            INSERT INTO Agregados (
                genero, nome, cnpj, cpf, nascimento, cidadeNascimento, telefone, email, rg, 
                emissaoRG, orgaoExp, pai, mae, pis, cep, endereco, nomeProprietario, placa, 
                marca, modelo, cor, anoFabricacao, cilindrada, bauSuporte, seguro, 
                valorMinSaida, valorKmRodado, cursoMotoFrete
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
            dadosAgregado.genero, dadosAgregado.nome, dadosAgregado.cnpj, dadosAgregado.cpf, 
            dadosAgregado.nascimento, dadosAgregado.cidadeNascimento, dadosAgregado.telefone, 
            dadosAgregado.email, dadosAgregado.rg, dadosAgregado.emissaoRG, dadosAgregado.orgaoExp, 
            dadosAgregado.pai, dadosAgregado.mae, dadosAgregado.pis, dadosAgregado.cep, 
            dadosAgregado.endereco, dadosAgregado.nomeProprietario, dadosAgregado.placa, 
            dadosAgregado.marca, dadosAgregado.modelo, dadosAgregado.cor, dadosAgregado.anoFabricacao, 
            dadosAgregado.cilindrada, dadosAgregado.bauSuporte === 'Sim', dadosAgregado.seguro === 'Sim', 
            dadosAgregado.valorMinSaida, dadosAgregado.valorKmRodado, dadosAgregado.cursoMotoFrete === 'Sim'
        ];
        return db.promise().query(query, values);
    }
}

export default Agregado;