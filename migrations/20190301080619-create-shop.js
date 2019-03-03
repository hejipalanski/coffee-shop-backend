'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Shops', {
			id: {
				allowNull: false,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			name: {
				type: Sequelize.STRING
			},
			location: {
				type: Sequelize.STRING
			},
			franchisee: {
				type: Sequelize.STRING
			},
			status: {
				type: Sequelize.STRING,
				defaultValue: 'close'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Shops');
	}
};