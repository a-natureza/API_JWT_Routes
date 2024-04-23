const { Router } = require('express') // 
const Curso = require('../models/Curso')

const { auth } = require('../middleware/auth')
const cursoRoutes = new Router()

/* =====> Rotas Cursos <===== */
cursoRoutes.post('/', auth, async (req, res) => {
try {
const nome = req.body.nome
const duracao_horas = req.body.duracao_horas

if (!nome) {
    return res.status(400).json({
        message: 'O nome é obrigatório'
    })
} 

if (!(duracao_horas >= 40 && duracao_horas <= 2000)) {
    return res.status(400).json({
        message: 'A duração do curso deve ser entre 40 e 2000 horas'
    })
}
const cursos = await Curso.create({
    nome: nome,
    duracao_horas: duracao_horas
})
res.status(201).json(cursos)
} catch (error) {
console.log(error.message)
res.status(500).json({ error: 'Não foi possível cadastrar o curso.' })

}
})

cursoRoutes.get('/', auth, async (req, res) => {
const nome = req.query.nome || ''
if (nome) {
const cursos = await Curso.findAll({
    where: {
        nome: nome
    }
})
return res.json(cursos)
}
const cursos = await Curso.findAll()
res.json(cursos)
}) 

cursoRoutes.delete('/:id', auth, (req, res) => {
const id = req.params.id
Curso.destroy({
where: {
    id: id
}
})


res.json({ message: 'Curso deletado com sucesso' })
})

cursoRoutes.put('/:id', auth, async (req, res) => {
const id = req.params.id

const curso = await Curso.findByPk(id)

if(!curso) {
return res.status(404).json({mensagem: 'Curso não encontraddo'})
}
curso.update(req.body)

await curso.save()

res.json(curso)
})

module.exports = cursoRoutes