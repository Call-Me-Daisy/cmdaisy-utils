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
class RegistryBase {
	static throwHandle(_handle, _handleUse, _reason) {
		throw `Proposed Registry handle, ${_handle}, is invalid for ${_handleUse}; ${_reason}`;
	}
	static validateHandle(_handle, _handleUse) {
		if (!(typeof _handle === 'string' || _handle instanceof String)) { RegistryBase.throwHandle(_handle, _handleUse, "Must be string or String"); }
		if (!isNaN(_handle)) { RegistryBase.throwHandle(_handle, _handleUse, "Cannot be number"); }
		if (!_handle.length) { RegistryBase.throwHandle(_handle, _handleUse, "Cannot be empty string"); }
	}

	constructor(_handle, _handleUse) {
		RegistryBase.validateHandle(_handle, _handleUse);
		this.handle = _handle;
	}

	fetchByID(_id) {
		for (const [key, val] of Object.entries(this)) {
			const out = val && (val.id === _id && val || val.fetchByID && val.fetchByID(_id));
			if (out) {return out;}
		}
		return undefined;
	}
}
class RegistryCategory extends RegistryBase {
	static build() {return new RegistryCategory(...arguments);}
	constructor(_handle, _extension = "") {
		super(_handle, _extension + "Category");
	}

	register(_handle, _element) {
		RegistryBase.validateHandle(_handle, "Element");
		_element.category = this.handle;
		_element.handle = _handle;
		return this[_handle] = _element;
	}
	addAliases(_currentHandle, _newHandles) {
		const element = this[_currentHandle];
		for (const newHandle of (_newHandles instanceof Array) ? _newHandles : _newHandles.split(",")) {this[newHandle] = element;}
		return this;
	}
}
class Registry extends RegistryBase {
	static Base = RegistryBase;
	static Category = RegistryCategory;

	static build() {return new Registry(...arguments);}
	constructor(_handle = "", _makeCategory = RegistryCategory.build, _extension = "") {
		super(_handle, _extension + "Registry");
		this.ID_MAKER = 0;
		this.makeCategory = _makeCategory;
	}

	registerCategory(_categoryName) {
		return this[_categoryName] = this.makeCategory(...arguments);
	}
	ensureCategory(_categoryName) {
		return this[_categoryName] || this.registerCategory(...arguments);
	}

	register(_categoryName, _elementName, _element) {
		const category = this.ensureCategory(_categoryName);
		const oldElement = category[_elementName];

		_element.id = (oldElement) ? oldElement.id : this.ID_MAKER++;
		return category.register(...sliceArgs(arguments, 1));
	}
	addAliases(_categoryName, _currentName, _newNames) {
		const category = this[_categoryName];
		const element = category[_currentName];
		for (const newName of ((_newNames instanceof Array) ? _newNames : _newNames.split(","))) {category[newName] = element;}
		return this;
	}
}
//--------------------------------------------------------------------FINALIZE
module.exports = {
	sliceArgs,
	Registry
};
