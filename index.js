import yargs from 'yargs';
import CSVConverter from './src/CSVConverter.js';

const args = yargs
    .option('headers', {
        description: 'Determina que a primeira linha do arquivo deve ser considerada como cabeçalho, nomeando as propriedades do objeto resultante.',
        alias: 'h',
        type: 'boolean',
        default: true,
        required: false
    })
    .option('props', {
        description: 'Define os nomes de propriedades do objeto convetido.',
        alias: 'p',
        type: 'array',
        required: false
    })
    .option('output', {
        description: 'Define o caminho onde o arquivo convertido será salvo.',
        type: 'string',
        alias: 'o',
        default: './converted.json',
        required: false
    })
    .option('delimiter', {
        description: 'Define o delimitador das colunas.',
        type: 'string',
        alias: 'd',
        default: ',',
        required: false
    })
    .alias('--help', '-h')
    .argv;

if (!args._.length) {
    console.error('Nenhum arquivo fornecido.');
    process.exit();
}

const converter = new CSVConverter(args.delimiter, args.headers, args.props);

console.info('Iniciando conversão...');

converter.processFiles(args._, args.output)
    .then(
        () => console.log('Conversão realizada com sucesso!'),
        error => console.error(`Erro na conversão: ${error.message}`)
    );