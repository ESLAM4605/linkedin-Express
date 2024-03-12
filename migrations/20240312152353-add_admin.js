'use strict';
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(
      "password",
      parseInt(process.env.ROUNDS)
    );

    //add admin
    await queryInterface.bulkInsert(
      "users",
      [
        {
          userName: "admin",
          firstName: "admin",
          lastName: "admin",
          email: "admin",
          password: hashedPassword,
          age: 0,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
