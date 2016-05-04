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
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.TEXT)
	}

},  {
	getterMethods: {
		route: function(){
			return "/wiki/" + this.urlTitle;
		}
	}
	// invoke via page.route
});

Page.hook('beforeValidate', function(page, options){
	if (page.title) {
	    // Removes all non-alphanumeric characters from title
	    // And make whitespace underscore
	    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
  	} else {
    	// Generates random 5 letter string
    	page.urlTitle = Math.random().toString(36).substring(2, 7);
  	}
})

Page.find({
    // $overlap matches a set of possibilities
    where : {
        tags: {
            $overlap: ['someTag', 'someOtherTag']
        }
    }    
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
}, {
	getterMethods: {
		userroute: function(){
			return "/users/" + this.id;
		}
	}
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
	Page: Page,
	User: User
}