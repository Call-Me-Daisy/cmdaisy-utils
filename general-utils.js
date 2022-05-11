//--------------------------------------------------------------------CLASSES
//------------------------------------REGISTRY
class Registry {
	constructor() {
		this.ID_MAKER = 0;
	}
	registerType(_typeName) {
		if (isNaN(_typeName)) {this[_typeName] = {};}
		else { throw `Registry type cannot have name ${_typeName}`; }
	}
	register(_typeName, _elementName, _element) {
		if (this[_typeName] === undefined) {this.registerType(_typeName);}

		_element.type = _typeName;
		_element.id = this.ID_MAKER++;
		this[_typeName][_elementName] = _element;
	}
}
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
	Registry,
	sliceArgs
}
