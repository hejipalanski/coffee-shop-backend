'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Shops', 'id', {
				allowNull: false,
				type: Sequelize.UUID,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4
		});
	},

	down: (queryInterface, Sequelize) => {
	}
};
