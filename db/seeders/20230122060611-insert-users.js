'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        fullname: 'Soekarno',
        address: 'Blitar',
        phone: '081234567890',
        email: 'soekarno@indonesia.com',
        password: '$2y$10$tP0FTd9ylMFV6Y6u7Iy1Uu6THpftImJfkM4MCLL7TwnhDTqdyewIu',
        role: "admin"
      },
      {
        fullname: 'Soeharto',
        address: 'Yogyakarta',
        phone: '081234567890',
        email: 'soeharto@indonesia.com',
        password: '$2y$10$2w/rscRkCbGK64l7gS/LpuEcbn.EtnwAcpGjxz85qbozxCHOB4UFi',
        role: "admin"
      },
      {
        fullname: 'Bacharuddin Jusuf Habibie',
        address: 'Parepare',
        phone: '081234567890',
        email: 'habibie@indonesia.com',
        password: '$2y$10$keIaLyPMWzNdk/0458fBVOXvbtvm8GhkPX7qSjnD7rYntZAJxxd4u',
        role: "user"
      },
      {
        fullname: 'Abdurrahman Wahid',
        address: 'Jombang',
        phone: '081234567890',
        email: 'gusdur@indonesia.com',
        password: '$2y$10$x.ctT3J8TkK.IGwlAB6qHOBOBoBPaAndcgTsiFMJ1TH8aLeLzxXA6',
        role: "user"
      },
      {
        fullname: 'Megawati Soekarnoputri',
        address: 'Yogyakarta',
        phone: '081234567890',
        email: 'megawati@indonesia.com',
        password: '$2y$10$R0XlzAJ/77QVXSeeVe.ANeHi6mEWlEO/HX5J.qi07BDe9gkzbe9Qe',
        role: "user"
      },
      {
        fullname: 'Susilo Bambang Yudhoyono',
        address: 'Pacitan',
        phone: '081234567890',
        email: 'sby@indonesia.com',
        password: '$2y$10$H2dzfi0M9Tj1xYn9rKNSTeizn7bp7QKmVZd2oLuijp0RHfo3gxwrC',
        role: "user"
      },
      {
        fullname: 'Joko Widodo',
        address: 'Solo',
        phone: '081234567890',
        email: 'jokowi@indonesia.com',
        password: '$2y$10$R0XlzAJ/77QVXSeeVe.ANeHi6mEWlEO/HX5J.qi07BDe9gkzbe9Qe',
        role: "user"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
