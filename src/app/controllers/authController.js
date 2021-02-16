const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mailer = require('../../modules/mailer')
const authConfig = require('../../config/auth');
const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign( params, authConfig.secret, { expiresIn: 86400, });
};

//Registrar conta
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if(await User.findOne({ email }))
            return res.status(400).send({error: 'Usuario ja existe'});
            
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id : user.id }),
         });
    } catch (err) {

        return res.status(400).send({ error: 'Flaha no Registro' });
    
    }
});

//Autenticar conta 
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select( '+password' );

    if (!user)
        return res.status(400).send({ error: 'Usuario não encontrado' });

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'password invalido' });

    user.password = undefined;
    
    res.send({ 
        user, 
        token : generateToken({ id: user.id }),
     });
})

//Esqueceu a senha, manda um token para recuperar senha 
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });
        
        if(!user)
            return res.status(400).send({ error: 'usuario não encontrado ' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({ 
            to: email,
            from: 'lucasvvpaiva@hotmail.com',
            template: 'auth/forgot_password',
            context: {token},
        }, (err)=>{
            if(err)
                return res.status(400).send({ error: 'Erro ao enviar email'});
            
            return res.send();
        });

    }catch(err){
        res.status(400).send({ error:'Erro no esqueceu a senha, tente de novo' })
    }
});
 
//Mudar a senha 
router.post('/reset_password', async (req, res) => {
    const{ email, token, password } = req.body;

    try{
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');
        
        if(!user)
            return res.status(400).send({ error: 'Usuario não encontrado'});
        
        if(token !== user.passwordResetToken)
            return res.status(400).send({ error: "Token invalido"});

        const now = new Date();

        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expirou, gere um novo'});

        user.password = password;

        await user.save();

        res.send();

    }catch(err){
        res.status(400).send({error: "Não conseguimos mudar sua senha, tente de novo"});
    };

})

module.exports = app => app.use('/auth', router);