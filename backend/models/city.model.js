module.exports = (sequelize, Sequelize) => {
    const City = sequelize.define("cities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      explanation:{
        type: Sequelize.TEXT
      },
      picture:{
        type: Sequelize.STRING
      },
      latitude:{
        type: Sequelize.FLOAT
      },
      longitude:{
        type: Sequelize.FLOAT
      },
      ilce1:{
        type: Sequelize.STRING
      },
      ilce2:{
        type: Sequelize.STRING
      },
      ilce3:{
        type: Sequelize.STRING
      },
      ilce4:{
        type: Sequelize.STRING
      },
      ilce5:{
        type: Sequelize.STRING
      },
      pvout:{
        type: Sequelize.FLOAT
      },
      dni:{
        type: Sequelize.FLOAT
      },
      ghi:{
        type: Sequelize.FLOAT
      },
      dif:{
        type: Sequelize.FLOAT
      },
      gti:{
        type: Sequelize.FLOAT
      },
      opta: {
        type: Sequelize.FLOAT
      },
      temp: {
        type: Sequelize.FLOAT
      }
    });
    return City;
  };