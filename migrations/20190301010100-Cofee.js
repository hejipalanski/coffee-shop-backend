'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.renameColumn('Coffees', 'id', 'uuid')
			.then(() => {
				return queryInterface.changeColumn('Coffees', 'uuid', {
						type: Sequelize.UUID,
						allowNull: false,
						autoIncrement: false
				});
			});
	},

	down: (queryInterface, Sequelize) => {
	}
};
