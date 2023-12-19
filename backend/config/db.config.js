// Postgresql bağlantı bilgileri

module.exports = {
    HOST: "horton.db.elephantsql.com",
    USER: "npiutkdf",
    PASSWORD: "ZBnoCUpDAt8SzxkDnHfQzD1dloVgXkxO",
    DB: "npiutkdf",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };