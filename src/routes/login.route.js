const { Router } = require('express') // 
const Aluno = require('../models/Aluno')

const { sign } = require('jsonwebtoken')

const loginRoutes = new Router()

loginRoutes.get('/bem_vindo', (req, res) => {
    res.json({ name: 'Bem vindo' })
})

loginRoutes.post('/', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        if (!email) {
            return res.status(400).json({ messagem: 'O email é obrigatório' })
        }

        if (!password) {
            return res.status(400).json({ messagem: 'O password é obrigatório' })
        }

        const aluno = await Aluno.findOne({
            where: {email:email, password:password}
        })

        if(!aluno){
            return res.status(404).json({ messagem: 'Nenhum aluno corresponde a email e senha fornecidos!' })
        }
        console.log(aluno)

        const payload = { sub: aluno.id, email: aluno.email, nome: aluno.nome }

        if (!process.env.SECRET_JWT) {
            console.error('A chave secreta JWT não está definida!')
            return res.status(500).json({ messagem: 'Erro interno no servidor!' })
        }

        const token = sign(payload, process.env.SECRET_JWT)
        console.log(token)

        res.status(200).json({Token: token})

    } catch (error) {
        console.error('Erro ao tentar fazer login: ', error)
        return res.status(500).json({ error: error, messagem: 'Algo deu errado!' })
    }
})

module.exports = loginRoutes

