// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

String.prototype.scramble = function(){
	var that = this.split(" ");
	var len = that.length;

	for(var i = 0; i < len; i++) {
		var word = that[i];
		for(var y = 1; y < word.length - 1; y++) {
			var charCode = word.charCodeAt(y);
			var delta = (Math.floor(Math.random() * 4) - 2);
			var charGlitched = String.fromCharCode(charCode + delta);
			word = word.replace(word[y], charGlitched);
		}
		that[i] = word;
	}

	return that.join("");
}

// Add hover glitch effect on links:
function glitchTagsOnHover(tag) {
	$(tag).each(function() {
		var aTextShuffled = $(this).text().scramble();

		$(this).hover(function (e) {
			$(this).attr('data-text', aTextShuffled);
			$(this).addClass('glitch gan');
		}, function() {
			$(this).removeAttr('data-text');
			$(this).removeClass('glitch gan');
		});
	});
}

function glitchTags(tag) {
	$(tag).each(function() {
		var aTextShuffled = $(this).text().scramble();
		$(this).attr('data-text', aTextShuffled);
		$(this).addClass('glitch gan');
	});
}

$(document).ready(function() {
	var headerText = '#navbar-brand-text';
	var bodyLinks = '#body a';
	var footerLinks = '#footer a';

	glitchTags(headerText);
	glitchTagsOnHover(bodyLinks);
	glitchTagsOnHover(footerLinks);
});
// @license-end
