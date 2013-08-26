var Color = require('color');

var typeClasses = {
	'component' : 'stackgram-component',
	'group' : 'stackgram-component-group'
};

function stackgram (el, options) {
	el.classList.add('stackgram-container');

	if (typeof options.getObject === 'function') {
		options = options.getObject();
	}
	createHTML(el, options);
}

function createItemList () {
	var list = document.createElement('div');
	list.classList.add('stackgram-component-list');

	return list;
}

function createInfo (label, description) {
	var info = document.createElement('div');
	info.classList.add('stackgram-component-info');
	
	var title = document.createElement('div');
	title.classList.add('stackgram-component-info-title');
	title.innerHTML = label;
	info.appendChild(title);

	if (description) {
		var desc = document.createElement('div');
		desc.classList.add('stackgram-component-info-description');
		desc.innerHTML = description;
		info.appendChild(desc);
	}

	return info;
}

function createGroupLabel (label) {
	var title = document.createElement('div');
	title.classList.add('stackgram-component-group-title');
	title.innerHTML = '<div><span><strong>' + label + '</strong></span></div>';

	return title;
}

function createHTML (parentList, options) {
	var el, list, info;
	if (options.type) {
		el = document.createElement('div');
		el.classList.add(typeClasses[options.type]);

		list = createItemList();
		el.appendChild(list);

		if (options.type === 'group') {
			var lbl = createGroupLabel(options.label);
			el.appendChild(lbl);

			var c = Color().rgb(options.color);
			lbl.style.backgroundColor = c.rgbString();
			var c2 = Color().rgb(options.color).lighten(0.5);
			el.style.backgroundColor = c2.rgbString();

		} else {
			var nfo = createInfo(options.label, options.description);
			nfo.classList.add('stackgram-size-' + options.size);
			nfo.style.backgroundColor = 'rgb(' + options.color.join(',') + ')';
			el.appendChild(nfo);
		}

	} else {
		list = parentList;
	}

	if (options.children) {
		options.children.forEach(function (child) {
			createHTML(list, child);
		});
	}

	if (el) {
		parentList.appendChild(el);
	}
}

function Item (type, label, color, size) {
	this._label = label;
	this._description = '';
	this._type = type;
	this._color = color || [ 255, 0, 0 ];
	this._size = size || 2;
	this._children = [];
}

Item.prototype.add = function (item) {
	this._children.push(item);
	return this;
};
Item.prototype.type = function (type) {
	this._type = type;
	return this;
};

Item.prototype.label = function (label) {
	this._label = label;
	return this;
};

Item.prototype.description = function (description) {
	this._description = description;
	return this;
};

Item.prototype.color = function (r, g, b) {
	this._color = [ r, g, b ];
	return this;
};

Item.prototype.size = function (size) {
	this._size = size;
	return this;
};

Item.prototype.getObject = function () {
	var obj = {
		label : this._label,
		description : this._description,
		type : this._type,
		size : this._size,
		color : this._color,
		children : []
	};

	this._children.forEach(function (child) {
		obj.children.push(child.getObject());
	});

	return obj;
};

function createOptions () {
	return new Item();
}

function createComponent (label) {
	return new Item('component', label);
}

function createGroup (label) {
	return new Item('group', label);
}

module.exports = {
	create : stackgram,
	createOptions : createOptions,
	component : createComponent,
	group : createGroup
};
