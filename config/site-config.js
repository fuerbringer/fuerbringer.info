/**
 * Small config file to define website-related constants
 */
module.exports = {
  author: 'Severin Fürbringer',
  name: `Personal Site by Severin Fürbringer`,
  brand: 'SF',
  titleSeparator: ' ⇐ ',
  allowRobots: true,

  licenseLegal: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
  license: 'https://creativecommons.org/licenses/by-sa/4.0/',
  licenseImage: 'images/cc_by_sa.png',

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
