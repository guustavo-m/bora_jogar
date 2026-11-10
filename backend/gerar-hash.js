// Importação do bcrypt via padrão ES6 Modules
import bcrypt from 'bcrypt';

// Lista de usuários e senhas
const usuarios = [
    { nome: 'Gustavo', senha: 'gustavo' },
    { nome: 'Ayla', senha: 'ayla' },
    { nome: 'Manuella', senha: 'manuella' },
    { nome: 'Gabriella', senha: 'gabriella' },
    { nome: 'Maria Vitória', senha: 'maria' }
];

const saltRounds = 10; // Custo de processamento para geração do Salt

async function gerarHashes() {
    try {
        console.log('====================================================');
        
        // Loop para percorrer cada usuário e gerar o hash de forma assíncrona
        for (const usuario of usuarios) {
            const hash = await bcrypt.hash(usuario.senha, saltRounds);
            console.log(`Usuário: ${usuario.nome}`);
            console.log(`Senha Original: ${usuario.senha}`);
            console.log(`Hash Seguro: ${hash}`);
            console.log('----------------------------------------------------');
        }
        
        console.log('====================================================');
    } catch (erro) {
        console.error('Erro ao gerar hashes:', erro);
    }
}

// Executa a função demonstrativa
gerarHashes();