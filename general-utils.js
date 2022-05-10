//--------------------------------------------------------------------CLASSES
//------------------------------------OTHER
//--------------------------------------------------------------------FUCTIONS
//------------------------------------OTHER
function sliceArgs(_args, _start, _stop) {
	if (_start === undefined || _start < 0) {return _args;}
	if (_start >= _args.length) {return [];}
	const stop = (_stop === undefined || _stop > _args.length) ? _args.length : _stop;

	let out = [];
	for (let i=_start; i<stop; i++) {out.push(_args[i]);}
	return out;
}
//--------------------------------------------------------------------FINALIZE
module.exports = {
	sliceArgs
}
