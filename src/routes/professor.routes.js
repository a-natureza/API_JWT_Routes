const { Router } = require('express') 
const professorRoutes = new Router()

/* =====> Rotas Professores <===== */

professorRoutes.post('/', async (req, res) => {
    try {
        const nome = req.body.nome
        const data_admissao = req.body.data_admissao
        const carga_horaria = req.body.carga_horaria

        if (!nome) {
            return res.status(401).json({ message: 'O nome é obrigatório' })
        }
        if (!data_admissao || !/\d{4}-\d{2}-\d{2}/.test(data_admissao)) {
            return res.status(400).json({
                message: 'A data de admissão não está no formato correto'
            })
        }
        if (!carga_horaria) {
            return res.status(400).json({ message: 'A carga horária é obrigatória' })
        }
        const professor = await Professor.create({
            nome: nome,
            data_admissao: data_admissao,
            carga_horaria: carga_horaria
        })

        res.status(201).json(professor)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Não foi possível cadastrar o professor' })

    }    
})

professorRoutes.get('/', async (req, res) => {
    const professores = await Professor.findAll()
    res.json(professores)
})

professorRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const professor = await Professor.findByPk(id)

        if (!professor) {
            return res.status(404).json({ message: "Professor não encontrado!" })
        }

        res.json(professor)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Não foi possível listar o professor específico", error: error })
    }
})

professorRoutes.put('/:id', async (req, res) => {
    const id = req.params.id
    const { nome, data_admissao, carga_horaria } = req.body
    const professor = await Professor.findByPk(id)

    if (!professor) {
        return res.status(404).json({message: 'Professor não encontrado'})
    }
    professor.update(req.body)
    await professor.save()

    res.json(professor)
})
    
professorRoutes.delete('/:id', (req, res) => {
    const id = req.params.id
    Professor.destroy({
        where: {
            id: id
        }
    })

    res.json({ message: 'Professor deletado com sucesso!'})
})

module.exports = professorRoutes