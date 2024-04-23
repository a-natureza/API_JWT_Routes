const { Router } = require("express");
const alunoRoutes = require("./alunos.routes");
const cursoRoutes = require("./cursos.routes");
const loginRoutes = require("./login.route");
const professorRoutes = require("./professor.routes");

const routes = Router()

routes.use('/alunos', alunoRoutes)
routes.use('/login', loginRoutes)
routes.use('/cursos', cursoRoutes)
routes.use('/professor', professorRoutes)

module.exports = routes 