const { Router } = require('express') // 
const Aluno = require('../models/Aluno')

const { auth } = require('../middleware/auth')
const alunoRoutes = new Router()

/* =====> Rotas Alunos <===== */
alunoRoutes.post('/', async (req, res) => {

try {
const email = req.body.email
const password = req.body.password
const nome = req.body.nome
const data_nascimento = req.body.data_nascimento
const celular = req.body.celular

if (!nome) {
    return res.status(400).json({message: 'O nome é obrigatório'})

}

if (!data_nascimento) {
    return res.status(400).json({message: 'A data de nascimento é obrigatória'})
}

if(!data_nascimento.match(/\d{4}-\d{2}-\d{2}/gm)) {
    return res.status(400).json({ messagem: 'A data de nascimento é não está no formato correto' }) 
}

    const aluno = await Aluno.create({
    email: email,
    password: password,
    nome: nome,
    data_nascimento: data_nascimento,
    celular: celular
})  
res.status(201).json(aluno)
} catch (error) {
console.log(error.message)
res.status(500).json({ error: 'Não foi possível cadastrar o aluno.' })
console.log(error.message)
}

})

/* rota para alterar a senha
alunoRoutes.get('/alunos/alterar_senha', auth, async (req, res) => {
id = req.payload.sub
}) */

// Utiliza o auth nas rotas privadas
alunoRoutes.get('/', auth, async (req, res) => {
const alunos = await Aluno.findAll()
res.json(alunos) //res.json(req.payload) lista apenas o id do token
})

alunoRoutes.get('/:id', auth, async (req, res) => {
try {

    const { id } = req.params

    const aluno = await Aluno.findByPk(id)

    if (!aluno) {
        return res.status(404).json({ message: "Usuário não encontrado!"})
    }

    res.json(aluno)

} catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Não foi possível listar o aluno específico", error: error})
}
})

alunoRoutes.put('/:id', async (req, res) => {
const id = req.params.id

const { email, password, nome, data_nascimento, celular } = req.body
const aluno = await Aluno.findByPk(id)

if (!aluno) {
    return res.status(400).json({message: 'Aluno não encontrado'})
}
aluno.update(req.body)
await aluno.save()

res.json(aluno)
})

alunoRoutes.patch('/:id', async (req, res) => {
const { id } = req.params;
try {
    const aluno = await Aluno.findByPk(id);
    if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' })
    }
    const camposPermitidos = ['nome', 'email', 'password', 'data_nascimento', 'celular']
    const camposParaAtualizar = Object.keys(req.body)
    const camposValidos = camposParaAtualizar.every(campo => camposPermitidos.includes(campo))

    if (!camposValidos) {
        return res.status(400).json({ message: 'Campos inválidos para atualização' })
    }
    const dadosParaAtualizar = {}
    camposParaAtualizar.forEach(campo => {
        if (camposPermitidos.includes(campo)) {
            dadosParaAtualizar[campo] = req.body[campo]
        }
    })

    const resultado = await aluno.update(dadosParaAtualizar)
    res.status(200).json(resultado)
} catch (error) {
    console.log.error('Erro ao atualizar o aluno: ', error)
    return res.status(500).json({ error: 'Erro interno do servidor' });
}
})

alunoRoutes.delete('/:id', async (req, res) => {
const id = req.params.idAlunos.destroy({
    where: {
        id: id
    }
})
res.json({ message: 'Aluno deletado com sucesso!' })
})

module.exports = alunoRoutes
