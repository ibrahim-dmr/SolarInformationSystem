// Postgresql bağlantı bilgileri

module.exports = {
    HOST: "mel.db.elephantsql.com",
    USER: "mqwztfoc",
    PASSWORD: "dA0W-i2WVHqeH1VA7doie7Lfnvk1jNDL",
    DB: "mqwztfoc",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };