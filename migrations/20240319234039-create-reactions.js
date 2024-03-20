// migrations/YYYYMMDDHHMMSS-create-reactions.js

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Reactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.ENUM("like", "cry", "angry", "love", "care"),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    await queryInterface.bulkInsert("Reactions", [
      { name: "like", createdAt: new Date(), updatedAt: new Date() },
      { name: "love", createdAt: new Date(), updatedAt: new Date() },
      { name: "care", createdAt: new Date(), updatedAt: new Date() },
      { name: "cry", createdAt: new Date(), updatedAt: new Date() },
      { name: "angry", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Reactions");
  },
};
