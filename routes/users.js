var express = require('express')
var router = express.Router()
var mail = require('../models/emails.js')
var usersModel = require('../models/users.js')

router.get('/activate-user-account', async function(req, res, next) 
{

    let userId = req.query.userId
    let params = [userId]
    let data = await usersModel.activateUserAccount(params)
    
    res.render('users/activateUserAccount', {message: data.message});

})

router.post('/user-balance', async function(req, res, next) 
{

    let userId = req.query.userId
    let params = [userId]
    let data = await usersModel.userBalance(params)

    res.send(data)

})

router.post('/user-status', async function(req, res, next) 
{

    let userId = req.query.userId
    let params = [userId]
    let data = await usersModel.userStatus(params)

    res.send(data)

})

router.post('/user-device-token', async function(req, res, next) 
{

    let token = req.query.token
    let userId = req.query.userId
    let params = [userId, token]
    let data = await usersModel.userDeviceToken(params)

    res.send(data)

})

router.post('/recover-password', async function(req, res, next) 
{

    let email = req.query.email
    let params = [email]
    let data = await usersModel.recoverPassword(params)

    res.send(data)

})

router.post('/sign-in', async function(req, res, next) 
{

    let email = req.query.email
    let password = req.query.password
    let deviceToken = req.query.token
    let params = [email, password, deviceToken]
    let data = await usersModel.signIn(params)
    console.log(data)
    if(data.statusCode === 3)
    {
        console.log("SAPEEEEEE")
        let url = req.protocol+"://"+req.get('host')+"/users/activate-user-account?userId="+data.userId
        emailParams = {email: email, url: url}
        mail.activateUserAccount(emailParams)

    }

    res.send(data)

})

router.post('/sign-up', async function(req, res, next) 
{

    let birthday = req.query.birthday
    let email = req.query.email
    let genderId = req.query.genderId
    let name = req.query.name
    let password = req.query.password
    let deviceToken = req.query.token
    let params = [name, email, password, genderId, birthday, deviceToken]
    let data = await usersModel.signUp(params)
    
    if(data.statusCode === 1)
    {
    
        let url = req.protocol+"://"+req.get('host')+"/users/activate-user-account?userId="+data.userId
        emailParams = {email: email, url: url}
        mail.activateUserAccount(emailParams)

    }

    res.send(data)

})

module.exports = router;
