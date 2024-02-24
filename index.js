const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')

//? Models
const User = require('./models/User')
const Address = require('./models/Address')

const app = express()
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.get('/users/createForm', (req, res) => {
    console.log('teste')
    res.render('addUser')
})

app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id

    const user = await User.findOne({
        include: Address,
        where: {id: id}
    })

    res.render('userEdit', { user: user.get({ plain: true }),  })
})

app.post('/address/delete', async (req, res) => {
    const id = req.body.id
    const UserId = req.body.UserId

    await Address.destroy({
        where: {id: id}
    })

    console.log(UserId)

    res.redirect(`/users/edit/${UserId}`)
})

app.post('/address/create', async (req, res) => {
    const body = req.body
    const UserId = body.UserId
    const street = body.street
    const number = body.number
    const city = body.city

    const address = {
        UserId,
        street,
        number,
        city,
    }

    await Address.create(address)


    res.redirect(`/users/edit/${UserId}`)
})

app.post('/users/edit', async (req, res) => {
    const body = req.body
    const id = body.id
    const name = body.name
    const occupation = body.occupation
    let newsLetter = body.newsLetter

    if(newsLetter === 'on') {
        newsLetter = true
    } else {
        newsLetter = false
    }

    const userData = {
        id,
        name,
        occupation,
        newsLetter
    }

    await User.update(userData, {
        where: {id: id}
    })
    res.redirect('/')
})

app.post('/users/delete/:id', async (req, res) => {
    const id = req.params.id

    await User.destroy({
        where: {id: id}
    })

    res.redirect('/')
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id

    const user = await User.findOne({
        include: Address,
        where: {id: id}
    })

    res.render('userView', { user: user.get({ plain: true }),  })
})

app.post('/users/create', async (req, res) => {
    const body = req.body
    const name = body.name
    const occupation = body.occupation
    let newsLetter = body.newsLetter

    if(newsLetter === 'on') {
        newsLetter = true
    } else {
        newsLetter = false
    }

    await User.create({name, occupation, newsLetter})
    res.redirect('/')
})

app.get('/', async (req, res) => {
    const users = await User.findAll({raw: true})
    
    res.render('home', { users })
})

/*
conn.sync({force: true}).then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000')
    })
}).catch((err) => console.log(err))
*/

conn.sync().then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000')
    })
}).catch((err) => console.log(err))