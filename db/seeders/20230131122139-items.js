'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        name_item: "pepsoden whitening",
        user_id: 2,
        category_id: 3,
        price: 6000,
        quantity: 20
      },
      {
        name_item: "garam 400gr",
        user_id: 2,
        category_id: 2,
        price: 4000,
        quantity: 25
      },
      {
        name_item: "indomie goreng original",
        user_id: 2,
        category_id: 1,
        price: 3500,
        quantity: 40
      },
      {
        name_item: "tisu paseo 400 layer",
        user_id: 2,
        category_id: 3,
        price: 27000,
        quantity: 50
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
