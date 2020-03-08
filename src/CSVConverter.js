import fs from 'fs';
import readline from 'readline';

export default class CSVConverter {
    /**
     * Cria uma nova instância do conversor.
     * @param {string} delimiter 
     * @param {boolean} headers 
     * @param {string[]} props 
     */
    constructor(delimiter = ',', headers = true, props = []) {
        this.delimiter = delimiter;
        this.headers = headers;
        this.props = props;
    }

    /**
     * Realiza a conversão dos arquivos, salvando um arquivo .json no caminho especificado.
     * @param {string[]} files 
     * @param {string} output 
     * @returns {Promise<boolean>}
     */
    async processFiles(files, output = './converted.json') {
        const converted = [];

        // Itera pelos arquivos fornecidos
        for (const file of files) {
            // variável auxiliar para identificar a primeira linha
            let firstLine = true;
            const rl = readline
                .createInterface({
                    input: fs.createReadStream(file),
                    terminal: false,
                    crlfDelay: Infinity
                });
    
            // itera por todas as linhas do arquivo
            for await (const line of rl) {
                // separa a linha em colunas, de acordo com o delimitador especificado
                const columns = line
                    .split(this.delimiter)
                    .map(column => String.prototype.trim.call(column));
    
                // se for a primeira linha
                if (firstLine) {
                    // e não tiver definido as propriedades (headers)
                    if (!this.props.length) {
                        // seta a primeira linha como propriedades
                        this.props = columns;
                    }
    
                    firstLine = false;
                    
                    // se a primeira linha é um header, ignora ela
                    if (this.headers) {
                        continue;
                    }
                }
    
                // se a quantidade de colunas for diferente da quantidade de propriedades definidas
                if (columns.length !== this.props.length) {
                    // printa um aviso na tela, alertando sobre a perda de dados
                    console.warn('A quantidade de colunas informada difere da quantidade de colunas do arquivo.');
                }
    
                const obj = {};
                // cria uma instância de objeto, itera pelas propriedades e atribui os valores correspondentes à cada coluna
                for (let i = 0; i < this.props.length; i++) {
                    obj[this.props[i]] = String.prototype.trim.call(columns[i]);
                }
    
                // salva o objeto no array de "linhas"
                converted.push(obj);
            }
        }
    
        // salva o arquivo json final no caminho especificado
        fs.writeFile(output, JSON.stringify(converted, null, 1), (error) => {
            if (error) throw error;
        });

        return true;
    }
}