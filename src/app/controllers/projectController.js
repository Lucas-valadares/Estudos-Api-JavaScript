const express = require('express');

const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router();

router.use(authMiddleware);

//listagem
router.get('/', async (req, res) => {
    try {
        const project = await Project.find();
        return res.send({ project })
    }catch(err) {
        return res.status(400).send({error: "Não foi possivel mostar projetos"})
    }
});

//buscar
router.get('/:projectId', async (req, res) => {
    res.send({ user: req.userId });
    try {

    }catch(err) {
        return res.status(400).send({error: "Não foi possivel criar o projeto"})
    }
});

//Criação 
router.post('/', async (req, res) => {
    const body = req.body
    try {
        const project = await Project.create(body);
        
        return res.send({ project });        
    } catch(err) {
        return res.status(400).send({ error: "não foi possivel criar um projeto" });
    }
    
});

//atualizar
router.put('/:projectId', (req, res) => {
    res.send({ user: req.userId });
    try {

    }catch(err) {
        return res.status(400).send({error: "Não foi possivel criar o projeto"})
    }
});

//deletar
router.delete('/:projectId', (req, res) => {
    res.send({ user: req.userId });
    try {

    }catch(err) {
        return res.status(400).send({error: "Não foi possivel criar o projeto"})
    }
});



module.exports = app => app.use('/projects', router);
