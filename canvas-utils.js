//--------------------------------------------------------------------CLASSES
//------------------------------------RECT-LIKE
//Simple object to represent 2D position (x,y) and span (w,h)
class Rect {
	constructor(_x, _y, _w, _h) {
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.setAbs(_x, _y, _w, _h);
	}

	//should never be overridden
	setAbs(_x, _y, _w, _h) {
		if (_x || _x === 0) {this.x = _x;}
		if (_y || _y === 0) {this.y = _y;}
		if (_w && _w >= 0) {this.w = _w;}
		if (_h && _h >= 0) {this.h = _h;}
		return this;
	}
	alterAbs(_dx, _dy, _dw, _dh) {
		if (_dx) {this.x += _dx;}
		if (_dy) {this.y += _dy;}
		if (_dw && _dw > -this.w) {this.w += _dw;}
		if (_dh && _dh > -this.h) {this.h += _dh;}
		return this;
	}

	//set and alter call these functions by default, so they are ideal for overriding
	setPos(_x, _y) {
		return this.setAbs(_x, _y, false, false);
	}
	setDim(_w, _h) {
		return this.setAbs(false, false, _w, _h);
	}
	alterPos(_dx, _dy) {
		return this.alterAbs(_dx, _dy, false, false);
	}
	alterDim(_dw, _dh) {
		return this.alterAbs(false, false, _dw, _dh);
	}

	set(_x, _y, _w, _h) {
		return this.setPos(_x, _y).setDim(_w, _h);
	}
	alter(_dx, _dy, _dw, _dh) {
		return this.alterPos(_dx, _dy).alterDim(_dw, _dh);
	}

	setFrom(_that) {
		return this.set(_that.x, _that.y, _that.w, _that.h);
	}
	alterBy(_that) {
		return this.alter(_that.x, _that.y, _that.w, _that.h);
	}

	centerStretch(_w, _h) {
		return this.setAbs(this.x + (this.w - _w)/2, this.y + (this.h - _h)/2, _w, _h);
	}
}

//Simple object to represent 3D position (x,y,z) and span (w,h,d)
class Cube {
	constructor(_x, _y, _z, _w, _h, _d) {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.w = 0;
		this.h = 0;
		this.d = 0;
		this.setAbs(_x, _y, _z, _w, _h, _d);
	}

	//should never be overridden
	setAbs(_x, _y, _z, _w, _h, _d) {
		if (_x || _x === 0) {this.x = _x;}
		if (_y || _y === 0) {this.y = _y;}
		if (_z || _z === 0) {this.z = _z;}
		if (_w && _w >= 0) {this.w = _w;}
		if (_h && _h >= 0) {this.h = _h;}
		if (_d && _d >= 0) {this.d = _d;}
		return this;
	}
	alterAbs(_dx, _dy, _dz, _dw, _dh, _dd) {
		if (_dx) {this.x += _dx;}
		if (_dy) {this.y += _dy;}
		if (_dz) {this.z += _dz;}
		if (_dw && _dw > -this.w) {this.w += _dw;}
		if (_dh && _dh > -this.h) {this.h += _dh;}
		if (_dd && _dd > -this.d) {this.w += _dd;}
		return this;
	}

	//set and alter call these functions by default, so they are ideal for overriding
	setPos(_x, _y, _z) {
		return this.setAbs(_x, _y, _z, false, false, false);
	}
	setDim(_w, _h, _d) {
		return this.setAbs(false, false, false, _w, _h, _d);
	}
	alterPos(_dx, _dy, _dz) {
		return this.alterAbs(_dx, _dy, _dz, false, false, false);
	}
	alterDim(_dw, _dh, _dd) {
		return this.alterAbs(false, false, false, _dw, _dh, _dd);
	}

	set(_x, _y, _z, _w, _h, _d) {
		return this.setPos(_x, _y, _z).setDim(_w, _h, _d);
	}
	alter(_dx, _dy, _dz, _dw, _dh, _dd) {
		return this.alterPos(_dx, _dy, _dz).alterDim(_dw, _dh, _dd);
	}

	setFrom(_that) {
		return this.set(_that.x, _that.y, _that.z, _that.w, _that.h, _that.d);
	}
	alterBy(_that) {
		return this.alter(_that.x, _that.y, _that.z, _that.w, _that.h, _that.d);
	}
	centerStretch(_w, _h, _d) {
		return this.setAbs(this.x + (this.w - _w)/2, this.h + (this.h - _h)/2, this.d + (this.d - _d)/2, _w, _h, _d);
	}
}
//------------------------------------OTHER
//Rect representing a 2D span on a canvas context; contains simple draw functions that apply to that span
class Brush extends Rect {
	constructor(_ctx, _x, _y, _w, _h) {
		super(_x, _y, _w, _h);
		this.ctx = _ctx;

		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
	}

	adjustForLinewidth() {
		const lw = this.ctx.linewidth;
		return this.alterAbs(lw/2, lw/2, -lw, -lw);
	}

	fillRect() {
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
	strokeRect() {
		this.ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
	clearRect() {
		this.ctx.clearRect(this.x, this.y, this.w, this.h)
	}

	ellipsePath() {
		this.ctx.beginPath();
		this.ctx.ellipse(this.x + this.w/2, this.y + this.h/2, this.w/2, this.h/2, 0, 0, Math.PI*2);
	}
	fillEllipse() {
		this.ellipsePath();
		this.ctx.fill();
	}
	strokeEllipse() {
		this.ellipsePath();
		this.ctx.stroke();
	}
	clearEllipse() {
		const gco = this.ctx.globalCompositeOperation;
		this.ctx.globalCompositeOperation = "destination-out";
		this.fillEllipse();
		this.ctx.globalCompositeOperation = gco;
	}

	write(_txt) {
		this.ctx.fillText(_txt, this.x + this.w/2, this.y + this.h/2);
	}
	draw(_img) {
		this.ctx.drawImage(_img, this.x, this.y, this.w, this.h);
	}
}
//--------------------------------------------------------------------FUCTIONS
//------------------------------------OTHER
//--------------------------------------------------------------------FINALIZE
module.exports = {
	Rect,
	Cube,
	Brush
}
