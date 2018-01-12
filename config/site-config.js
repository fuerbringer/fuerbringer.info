/**
 * Small config file to define website-related constants
 */
module.exports = {
  name: 'Personal Site by Severin Fürbringer',
  brand: 'Severin Fürbringer',
  titleSeparator: ' | ',
  allowRobots: true,

  licenseLegal: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
  license: 'https://creativecommons.org/licenses/by-sa/4.0/',
  contentCdnUrl: 'https://cdn.fuerbringer.info/',

	indexBlogPreview: {
		maxCount: 3
	},

  pages: {
    about: {
      title: 'About'
    },
    blog: {
      title: 'Blog'
    },
    contact: {
      title: 'Contact'
    },
    home: {
      title: 'Welcome'
    },
    now: {
      title: 'Now'
    },
  }
}
