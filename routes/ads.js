var express = require('express');
var router = express.Router();
var adsModel = require('../models/ads.js');
var usersModel = require('../models/users.js');
/*const fs = require('fs');
const multer = require('multer');
const uploadAdsFold = multer();*/

router.post('/create-new-ad/', async (req, res, next) =>
{
    
    let file = req.files.file;
    let fileExt = file.name.split('.').at(-1);
    let playTime = req.body.playTime;
    
    let paramsAd = [playTime];
    const newAd = await adsModel.createNewAd(paramsAd);
    
    const adId = newAd.response.adId;
    const url = process.env.AD_FILE_URL+"/"+adId+"."+fileExt;

    let paramsAdContent = [adId, 1, playTime, url, 1];
    const newAdContent = await adsModel.createAdContent(paramsAdContent);

    const destFile = process.env.AD_FILE_LOCAL_DEST+"/"+adId+"."+fileExt;
    file.mv(destFile);

    res.send(newAdContent);

})

router.get('/see-ads/', async function(req, res, next) 
{

    let host = req.hostname;
    let userId = req.query.userId;
    let params = [userId, host];
    let client = await usersModel.userExist(params);

    if(client) 
    {

        let ads = await adsModel.adsToSee(params);
        res.send(ads);

    } 
    else 
    {

        res.send({
            response: {
                message: "No se encontró ningun cliente con ese ID",
                status: "error",
                statusCode: 0
            }
        });

    }

})

/* Vio publicidad */
router.post('/viewed-ad/', async function(req, res, next) 
{

    let userId = req.query.userId;
    let adId = req.query.adId;
    let params = [userId, adId];
    let response = await adsModel.viewedAd(params);

    res.send(response);

})

module.exports = router;
