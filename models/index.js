var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack'
	// , { logging: false }
	)

var Page = db.define('Page',{
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	}
},  {
	getterMethods: {
		route: function(){
			return "/wiki/" + this.urlTitle;
		}
	}
	// invoke via page.route
});

var User = db.define('User', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		isEmail: true,
		allowNull: false
	}
});

module.exports = {
	Page: Page,
	User: User
}