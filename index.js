const fs = require("fs");
//--------------------------------------------------------------------CONSTANTS
const out = {};
const src = "./source/"
//--------------------------------------------------------------------MAIN
fs.readdir(src, (dir_e, files) => {
	if (dir_e) { throw dir_e; }

	for (const fileName of files) {
		const [root, ext] = fileName.split(".");
		ext === "js" && (out[root] = require(src + root));
	}
});
//--------------------------------------------------------------------FINALIZE
module.exports = out;
