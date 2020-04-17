/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "eng_phrases",
    {
      Id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      translated_status: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      sent_status: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      phrase: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "eng_phrases",
    }
  );
};
