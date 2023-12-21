const db = require("../models");
const City = db.city;

exports.getCityInformation = (req, res, next) => {
    let apiCity = req.body.city
    if(!apiCity){
        res.status(403).send({
            response: false,
            message: "Şehir verisi eksik!"
        });
        return;
    }
    City.findOne({
        where:{
            name: apiCity
        },
    }).then(city => {
        if(city){
            // res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                response: true,
                message: JSON.stringify(city.toJSON())
            });
            return;
        } else {
            res.status(404).send({
                response: false,
                message: "Şehir bulunamadı!"
            });
            return;
        }
    }).catch(err => {
        res.status(500).send({
            response:false,
            message: "Bir hata oluştu: " + err.message
        })
    });
}