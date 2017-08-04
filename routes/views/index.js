var keystone = require('keystone'),
	Post = keystone.list('Post');
const siteConfig = require('../../config/site-config');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.title = siteConfig.pages.home.title + siteConfig.titleSeparator +
		siteConfig.name;
	locals.data = {
		posts: []
	};


	Post.model.find()
		.where('state', 'published')
		.sort('-publishedDate')
		.limit(siteConfig.indexBlogPreview.maxCount)
		.exec(function(err, posts) {
			locals.data.posts = posts;
			
			// Render the view
			view.render('index');
	});

};
