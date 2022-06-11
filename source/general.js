//--------------------------------------------------------------------MINOR
function sliceArgs(_args, _start, _stop) {
	if (_start === undefined || _start < 0) {return _args;}
	if (_start >= _args.length) {return [];}
	const stop = (_stop === undefined || _stop > _args.length) ? _args.length : _stop;

	const out = [];
	for (let i=_start; i<stop; i++) {out.push(_args[i]);}
	return out;
}
//--------------------------------------------------------------------CLASSES
//------------------------------------REGISTRY
class Registry {
	constructor(_typeMaker, _kwargs = {}) {
		this.ID_MAKER = 0;
		this.TYPE_MAKER = _typeMaker || function() {return {};};

		for (const [key, val] of Object.entries(_kwargs)) {this[key] = val;}
	}
	registerType(_typeName) {
		if (isNaN(_typeName)) {return (this[_typeName] = this.TYPE_MAKER(...sliceArgs(arguments, 1)));}
		throw `Invalid typeName for Registry ${_typeName}; cannot be number`;
	}
	register(_typeName, _elementName, _element) {
		const type = this[_typeName] || this.registerType(_typeName);
		const id = (this[_typeName][_elementName]) ? this[_typeName][_elementName].id : this.ID_MAKER++;

		_element.type = _typeName;
		_element.handle = _elementName;
		_element.id = id;
		return (this[_typeName][_elementName] = _element);
	}

	fetchElementById(_id) {
		for (const [regKey, regVal] of Object.entries(this)) {
			for (const [typeKey, typeVal] of Object.entries(regVal || {})) {
				if (typeVal.id && typeVal.id === _id) {return [regKey, typeKey, typeVal];}
			}
		}
		return undefined;
	}
	addAliases(_typeName, _currentName, _newNames) {
		const type = this[_typeName];
		const element = type[_currentName];
		for (const name of ((_newNames instanceof Array) ? _newNames : _newNames.split(","))) {type[name] = element;}
	}
}
//--------------------------------------------------------------------FINALIZE
module.exports = {
	Registry,
	sliceArgs
};
