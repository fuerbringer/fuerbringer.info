var keystone = require('keystone');
const siteConfig = require('../../config/site-config');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'now';
	locals.title = siteConfig.pages.now.title + siteConfig.titleSeparator +
		siteConfig.name;

	// Render the view
	view.render('now');
};
