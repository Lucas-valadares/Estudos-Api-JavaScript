const express = require('express');
const User = require('../models/user');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.delete(authMiddleware);

// Lista de Usuarios
router.get('/', async (req, res) => {
    try{
        if(!user)
            return res.status(404).send({ error: "Nenhum usuario encontrado"});

        const user = await User.find();

        return res.send(user);

    }catch(err){
        return res.status(400).send({ error: "Erro na Listagem de usuarios"});
    }
});

// Lista de usuarios, apenas com o nickname
/* router.get('/', async (req, res) => {
    try{
        if(!user)
        return res.status(404).send({ error: "Nenhum usuario encontrado"});

        const user = await User.find(this.name);

        return res.send(user);
    }catch(err) {
        return res.status(400).send({ error: "erro ao buscar Usuarios" });
    }
}); */

// Usuario especifico
router.get('/:userId', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);

        return res.send(user);
    } catch(err) {
        return res.status(400).send({ error: "Usuario não encontrado"});
    }
});

// Motificar nome do Usuario
router.put('/:userId', async (req, res) => {
    try{
        const { name, email} = req.body;

        if(await User.findOne({email})) 
            return res.send({ error: "Email ja cadastrado"});
        
        const user = await User.findByIdAndUpdate(req.params.userId, {
            name,
            email
        }, {new: true});

        return res.send(user);
    } catch(err){
        return res.status(400).send({ error: "Não foi possivel atualizar dado"});
    }
});

// Deletar usuario 
router.delete('/:userId', async (req, res) => {
    try{
        const user = await User.findByIdAndRemove(req.params.userId);

        return res.send ({ sucesso: "Usuario excluido com sucesso" });
    }catch(err) {
        return res.status(400).send({ error: "Não foi possivel excluir o usuario"});
    }
})

module.exports = app => app.use('/register', router);
