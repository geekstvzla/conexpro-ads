let db = require('../config/database.js');

const adsToSee = (params) => {

    return new Promise(function(resolve, reject) { 

        let queryString = `
            SELECT a.ad_id,
                   a.sponsor_id,
                   a.sponsor_name
            FROM conexpro.vw_ads a
            WHERE a.ad_id NOT IN(
                SELECT ac.ad_id
                FROM conexpro.ads_client ac
                WHERE ac.client_id = ?
                AND ac.status_id = 2
            )
            AND a.ads_status_id = 1
            AND a.ads_due_date > NOW()
            ORDER BY a.ad_id ASC
            LIMIT 1;`
        db.query(queryString, params, function(err, adsData) {

            if(err) {
    
                reject({
                    response: {
                        message: "Error al tratar de ejecutar la consulta",
                        status: "error",
                        statusCode: 0
                    }
                })
    
            } else {

                if(adsData.length > 0) {

                    let adsId = adsData[0].ads_id
                    let queryString = `
                        SELECT a.ads_type_id,
                            a.ads_type_desc,
                            a.ads_url,
                            a.ads_orientation_id,
                            a.ads_orientation_desc
                        FROM conexpro.vw_ads a
                        WHERE a.ad_id = ?
                        AND a.ads_content_status_id = 1
                        ORDER BY a.ads_content_order ASC;`
                    db.query(queryString, [adsId], function(err, adsContent) {

                        if(err) {

                            reject({
                                response: {
                                    message: "Error al tratar de ejecutar la consulta",
                                    status: "error",
                                    statusCode: 0
                                }
                            })

                        } else {

                            resolve({
                                response: {
                                    data: {
                                        ad_content: adsContent,
                                        ad_id: adsData[0].ads_id,
                                        sponsor_id: adsData[0].sponsor_id,
                                        sponsor_name: adsData[0].sponsor_name
                                    },
                                    message: "Se encontraron ADS",
                                    status: "success",
                                    statusCode: 1
                                }
                            })

                        }

                    })

                } else {

                    resolve({
                        response: {
                            message: "No se encontraron ADS disponibles para mostrar",
                            status: "success",
                            statusCode: 3
                        }
                    })

                }
    
            }
    
        })

    })

}

const viewedAd = (params) => {

    return new Promise(function(resolve, reject) { 

        let queryString = `CALL sp_viewed_ad(?,?,@response);`
        db.query(queryString, params, function(err, result) {

            if(err) {
    
                reject({
                    error: err,
                    response: "error"
                })
    
            } else {

                db.query('SELECT @response as response', (err2, result2) => {

                    if(err2) {
    
                        reject({
                            error: err,
                            response: "Error fetching data from the database"
                        })
            
                    } else {
                    
                        let outputParam = JSON.parse(result2[0].response);
                        resolve(outputParam)
                        
                    }   

                })
    
            }
    
        })

    })

}

module.exports = {
    adsToSee,
    viewedAd
}