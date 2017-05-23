'use strict';

var fs = require('fs');

var folders = ['beer', 'tnc', 'wine'];

function lintFile(file) {
	var content = fs.readFileSync(file);

	try {
		JSON.parse(content);
	}
	catch(e) {
		if (e instanceof SyntaxError) {
			console.error(file, e.message);
			process.exit(1);
		}
	}
}

folders.forEach((folder) => {
	var files = fs.readdirSync('./' + folder + '/');
	files.forEach((file) => {
		lintFile('./' + folder + '/' + file);
	});
});

process.exit(0);
