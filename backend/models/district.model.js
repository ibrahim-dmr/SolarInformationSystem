module.exports = (sequelize, Sequelize) => {
    const District = sequelize.define("districts", {
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
    return District;
};
