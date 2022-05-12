//--------------------------------------------------------------------CLASSES
//------------------------------------REGISTRY
class Registry {
	constructor() {
		this.ID_MAKER = 0;
	}
	registerType(_typeName) {
		if (isNaN(_typeName)) {return (this[_typeName] = {});}
		throw `Registry type cannot have name ${_typeName}`;
	}
	register(_typeName, _elementName, _element) {
		const type = (this[_typeName] === undefined) ? this.registerType(_typeName) : this[_typeName];
		const id = (this[_typeName][_elementName]) ? this[_typeName][_elementName].id : ID_MAKER++;

		_element.type = _typeName;
		_element.id = id;
		return (this[_typeName][_elementName] = _element);
	}
	fetchElement(_elementID) {
		for (const [key, element] of Object.entries(this)) {
			if (key !== ID_MAKER && element.id === _elementID) {return [key, element];}
		}
		return undefined;
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
