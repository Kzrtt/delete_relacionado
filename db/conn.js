const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodesequelize', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql'
})

/*
try {
    sequelize.authenticate()
    console.log('Conectado ao Sequelize')
} catch (err) {
    console.log(`Não foi possivel conectar: ${err}`)
}
*/

module.exports = sequelize