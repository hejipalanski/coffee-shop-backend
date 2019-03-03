'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('Shops', 'status')
		.then(() => {
				queryInterface.addColumn('Shops', 'status', {
				type: Sequelize.STRING(10),
				allowNull: false,
				defaultValue: 'close'
			});
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Shops', 'status', {
				type: Sequelize.STRING(10)
			});
	}
};
