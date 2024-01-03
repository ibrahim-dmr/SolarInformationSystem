const db = require("../models");
const District = db.district;

exports.getDistrictInformation = async (req, res, next) => {
    try {
        // Veritabanı bağlantısını kontrol et
        await db.sequelize.authenticate();
        console.log('Veritabanı bağlantısı başarıyla kuruldu.');

        // İsteğin ilçe verisini al
        let apiDistrict = req.body.district;
        if (!apiDistrict) {
            return res.status(403).send({
                response: false,
                message: "İlçe verisi eksik!"
            });
        }

        // İlçe bilgisini veritabanından çek
        const district = await District.findOne({
            where: {
                name: apiDistrict
            }
        });

        if (district) {
            return res.status(200).send({
                response: true,
                message: district.toJSON()
            });
        } else {
            return res.status(404).send({
                response: false,
                message: "İlçe bulunamadı!"
            });
        }
    } catch (err) {
        console.error("Bir hata oluştu:", err);
        return res.status(500).send({
            response: false,
            message: "Bir hata oluştu: " + err.message
        });
    }
};
