const config = require("../config/db.config.js");
const veriConf = require("../config/city.config.js"); 
const veri2Conf = require("../config/ilce.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const sehirSequelize = new Sequelize(
  veriConf.DB,
  veriConf.USER,
  veriConf.PASSWORD,
  {
    host: veriConf.HOST,
    dialect: veriConf.dialect,
    pool: {
      max: veriConf.pool.max,
      min: veriConf.pool.min,
      acquire: veriConf.pool.acquire,
      idle: veriConf.pool.idle
    }
  }
)

const ilceSequelize = new Sequelize(
  veri2Conf.DB,
  veri2Conf.USER,
  veri2Conf.PASSWORD,
  {
    host: veri2Conf.HOST,
    dialect: veri2Conf.dialect,
    pool: {
      max: veri2Conf.pool.max,
      min: veri2Conf.pool.min,
      acquire: veri2Conf.pool.acquire,
      idle: veri2Conf.pool.idle
    }
  }
)

const db = {};

db.Sequelize = Sequelize;
db.sehirSequelize = sehirSequelize;
db.ilceSequelize = ilceSequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.city = require("../models/city.model.js")(sehirSequelize, Sequelize);
db.district = require("../models/district.model.js")(ilceSequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin"];

module.exports = db;