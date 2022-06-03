//--------------------------------------------------------------------CONSTANTS
const exp = {
	unpack() {
		const out = [];
		for (const subModule of arguments) {out.push(this[subModule]);}
		return out;
	}
};
const src = require("path").join(__dirname, "source");
//--------------------------------------------------------------------MAIN
for (const fileName of require("fs").readdirSync(src)) {
	const [root, ext] = fileName.split(".");
	ext === "js" && (exp[root] = require(src + "/" + root));
}
//--------------------------------------------------------------------FINALIZE
module.exports = exp;
