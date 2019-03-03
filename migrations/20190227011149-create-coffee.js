'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Coffees', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			type: {
				type: Sequelize.STRING(30),
				allowNull: true
			},
			description: {
				type: Sequelize.STRING,
				allowNull: true
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			shopId: {
				type: Sequelize.INTEGER
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Coffees');
	}
};
