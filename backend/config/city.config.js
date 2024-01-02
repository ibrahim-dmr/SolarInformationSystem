// Postgresql bağlantı bilgileri

module.exports = {
    HOST: "flora.db.elephantsql.com",
    USER: "ukougjaw",
    PASSWORD: "sZgTQi36h77OhzS089rPq3qo5PN_gkG5",
    DB: "ukougjaw",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };