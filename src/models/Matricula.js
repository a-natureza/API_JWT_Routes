const { DataTypes } = require("sequelize")
const { connection } = require("../database/connection")
const Aluno = require("./Aluno")
const Curso = require("./Curso")

// baseado no aluno.js
const Matricula = connection.define('matricula', {
    nome: {
        type: DataTypes.STRING,
    },
    aluno_id: {
        type: DataTypes.INTEGER,
    }
})


Matricula.belongsToMany(Aluno)
Matricula.belongsToMany(Curso)
Aluno.hasMany(Matricula, { foreignKey: 'id' })
Curso.hasMany(Matricula, { foreignKey: 'id' })

module.exports = Curso