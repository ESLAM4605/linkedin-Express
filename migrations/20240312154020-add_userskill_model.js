"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User-skills", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Make sure to match the actual table name for the User model
          key: "id",
        },
      },
      experienceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Experiences",
          key: "id",
        },
      },
      skillId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Skills",
          key: "id",
        },
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
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User-skills");
  },
};
