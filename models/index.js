var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack'
	, { logging: false }
	);

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
		type: Sequelize.ARRAY(Sequelize.TEXT),
		defaultValue: [],
		set: function(value){
			var tagsAsAnArray = value.split(", ");
			this.setDataValue('tags', tagsAsAnArray);
			// setDataValue circumvents all the hooks & setters to set the value & avoid a loop
		}
	}

},  {
	getterMethods: {
		route: function(){
			return "/wiki/" + this.urlTitle;
		}
	// invoke via page.route
	},
	classMethods: {
		// resolves to all the pages in an arr that have the specific tag
        findByTag: function (tag) {
            return this.findAll({
                where: {
                    tags: {
                        $contains: [tag]
                    }
                }
            });
        }
	},
    instanceMethods: {
        findSimilar: function () {
            return Page.findAll({
                where: {
                    id: {
                    	// this is the instance you're calling it on
                        $ne: this.id
                    },
                    tags: {
                        $overlap: this.tags
                    }
                }
            });
        }
    }
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
});

var User = db.define('User', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
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
};