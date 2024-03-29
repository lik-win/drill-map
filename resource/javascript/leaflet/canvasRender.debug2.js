var version = "v1.0.1";
"undefined" != typeof exports && (module.exports = version), createjs = this.createjs = this.createjs || {}, createjs.extend = function (t, e) {
	"use strict";
	function i() {
		this.constructor = t
	}
	return i.prototype = e.prototype,
	t.prototype = new i
}, this.createjs = this.createjs || {}, createjs.promote = function (t, e) {
	"use strict";
	var i = t.prototype,
	n = Object.getPrototypeOf && Object.getPrototypeOf(i) || i.__proto__;
	if (n)
		for (var s in i[(e += "_") + "constructor"] = n.constructor, n)
			i.hasOwnProperty(s) && "function" == typeof n[s] && (i[e + s] = n[s]);
	return t
}, this.createjs = this.createjs || {}, createjs.indexOf = function (t, e) {
	"use strict";
	for (var i = 0, n = t.length; n > i; i++)
		if (e === t[i])
			return i;
	return -1
}, this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i) {
		this.type = t,
		this.target = null,
		this.currentTarget = null,
		this.eventPhase = 0,
		this.bubbles = !!e,
		this.cancelable = !!i,
		this.timeStamp = (new Date).getTime(),
		this.defaultPrevented = !1,
		this.propagationStopped = !1,
		this.immediatePropagationStopped = !1,
		this.removed = !1
	}
	var e = t.prototype;
	e.preventDefault = function () {
		this.defaultPrevented = this.cancelable && !0
	},
	e.stopPropagation = function () {
		this.propagationStopped = !0
	},
	e.stopImmediatePropagation = function () {
		this.immediatePropagationStopped = this.propagationStopped = !0
	},
	e.remove = function () {
		this.removed = !0
	},
	e.clone = function () {
		return new t(this.type, this.bubbles, this.cancelable)
	},
	e.set = function (t) {
		for (var e in t)
			this[e] = t[e];
		return this
	},
	e.toString = function () {
		return "[Event (type=" + this.type + ")]"
	},
	createjs.Event = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		this._listeners = null,
		this._captureListeners = null
	}
	var e = t.prototype;
	t.initialize = function (t) {
		t.addEventListener = e.addEventListener,
		t.on = e.on,
		t.removeEventListener = t.off = e.removeEventListener,
		t.removeAllEventListeners = e.removeAllEventListeners,
		t.hasEventListener = e.hasEventListener,
		t.dispatchEvent = e.dispatchEvent,
		t._dispatchEvent = e._dispatchEvent,
		t.willTrigger = e.willTrigger
	},
	e.addEventListener = function (t, e, i) {
		var n,
		s = (n = i ? this._captureListeners = this._captureListeners || {}
			 : this._listeners = this._listeners || {})[t];
		return s && this.removeEventListener(t, e, i),
		(s = n[t]) ? s.push(e) : n[t] = [e],
		e
	},
	e.on = function (t, e, i, n, s, r) {
		return e.handleEvent && (i = i || e, e = e.handleEvent),
		i = i || this,
		this.addEventListener(t, function (t) {
			e.call(i, t, s),
			n && t.remove()
		}, r)
	},
	e.removeEventListener = function (t, e, i) {
		var n = i ? this._captureListeners : this._listeners;
		if (n) {
			var s = n[t];
			if (s)
				for (var r = 0, a = s.length; a > r; r++)
					if (s[r] == e) {
						1 == a ? delete n[t] : s.splice(r, 1);
						break
					}
		}
	},
	e.off = e.removeEventListener,
	e.removeAllEventListeners = function (t) {
		t ? (this._listeners && delete this._listeners[t], this._captureListeners && delete this._captureListeners[t]) : this._listeners = this._captureListeners = null
	},
	e.dispatchEvent = function (t) {
		if ("string" == typeof t) {
			var e = this._listeners;
			if (!e || !e[t])
				return !1;
			t = new createjs.Event(t)
		} else
			t.target && t.clone && (t = t.clone());
		try {
			t.target = this
		} catch (t) {}
		if (t.bubbles && this.parent) {
			for (var i = this, n = [i]; i.parent; )
				n.push(i = i.parent);
			var s,
			r = n.length;
			for (s = r - 1; s >= 0 && !t.propagationStopped; s--)
				n[s]._dispatchEvent(t, 1 + (0 == s));
			for (s = 1; r > s && !t.propagationStopped; s++)
				n[s]._dispatchEvent(t, 3)
		} else
			this._dispatchEvent(t, 2);
		return t.defaultPrevented
	},
	e.hasEventListener = function (t) {
		var e = this._listeners,
		i = this._captureListeners;
		return !!(e && e[t] || i && i[t])
	},
	e.willTrigger = function (t) {
		for (var e = this; e; ) {
			if (e.hasEventListener(t))
				return !0;
			e = e.parent
		}
		return !1
	},
	e.toString = function () {
		return "[EventDispatcher]"
	},
	e._dispatchEvent = function (t, e) {
		var i,
		n = 1 == e ? this._captureListeners : this._listeners;
		if (t && n) {
			var s = n[t.type];
			if (!s || !(i = s.length))
				return;
			try {
				t.currentTarget = this
			} catch (t) {}
			try {
				t.eventPhase = e
			} catch (t) {}
			t.removed = !1,
			s = s.slice();
			for (var r = 0; i > r && !t.immediatePropagationStopped; r++) {
				var a = s[r];
				a.handleEvent ? a.handleEvent(t) : a(t),
				t.removed && (this.off(t.type, a, 1 == e), t.removed = !1)
			}
		}
	},
	createjs.EventDispatcher = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		throw "Ticker cannot be instantiated."
	}
	t.RAF_SYNCHED = "synched",
	t.RAF = "raf",
	t.TIMEOUT = "timeout",
	t.useRAF = !1,
	t.timingMode = null,
	t.maxDelta = 0,
	t.paused = !1,
	t.removeEventListener = null,
	t.removeAllEventListeners = null,
	t.dispatchEvent = null,
	t.hasEventListener = null,
	t._listeners = null,
	createjs.EventDispatcher.initialize(t),
	t._addEventListener = t.addEventListener,
	t.addEventListener = function () {
		return !t._inited && t.init(),
		t._addEventListener.apply(t, arguments)
	},
	t._inited = !1,
	t._startTime = 0,
	t._pausedTime = 0,
	t._ticks = 0,
	t._pausedTicks = 0,
	t._interval = 50,
	t._lastTime = 0,
	t._times = null,
	t._tickTimes = null,
	t._timerId = null,
	t._raf = !0,
	t.setInterval = function (e) {
		t._interval = e,
		t._inited && t._setupTick()
	},
	t.getInterval = function () {
		return t._interval
	},
	t.setFPS = function (e) {
		t.setInterval(1e3 / e)
	},
	t.getFPS = function () {
		return 1e3 / t._interval
	};
	try {
		Object.defineProperties(t, {
			interval: {
				get: t.getInterval,
				set: t.setInterval
			},
			framerate: {
				get: t.getFPS,
				set: t.setFPS
			}
		})
	} catch (t) {
		console.log(t)
	}
	t.init = function () {
		t._inited || (t._inited = !0, t._times = [], t._tickTimes = [], t._startTime = t._getTime(), t._times.push(t._lastTime = 0), t.interval = t._interval)
	},
	t.reset = function () {
		if (t._raf) {
			var e = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
			e && e(t._timerId)
		} else
			clearTimeout(t._timerId);
		t.removeAllEventListeners("tick"),
		t._timerId = t._times = t._tickTimes = null,
		t._startTime = t._lastTime = t._ticks = 0,
		t._inited = !1
	},
	t.getMeasuredTickTime = function (e) {
		var i = 0,
		n = t._tickTimes;
		if (!n || n.length < 1)
			return -1;
		e = Math.min(n.length, e || 0 | t.getFPS());
		for (var s = 0; e > s; s++)
			i += n[s];
		return i / e
	},
	t.getMeasuredFPS = function (e) {
		var i = t._times;
		return !i || i.length < 2 ? -1 : (e = Math.min(i.length - 1, e || 0 | t.getFPS()), 1e3 / ((i[0] - i[e]) / e))
	},
	t.setPaused = function (e) {
		t.paused = e
	},
	t.getPaused = function () {
		return t.paused
	},
	t.getTime = function (e) {
		return t._startTime ? t._getTime() - (e ? t._pausedTime : 0) : -1
	},
	t.getEventTime = function (e) {
		return t._startTime ? (t._lastTime || t._startTime) - (e ? t._pausedTime : 0) : -1
	},
	t.getTicks = function (e) {
		return t._ticks - (e ? t._pausedTicks : 0)
	},
	t._handleSynch = function () {
		t._timerId = null,
		t._setupTick(),
		t._getTime() - t._lastTime >= .97 * (t._interval - 1) && t._tick()
	},
	t._handleRAF = function () {
		t._timerId = null,
		t._setupTick(),
		t._tick()
	},
	t._handleTimeout = function () {
		t._timerId = null,
		t._setupTick(),
		t._tick()
	},
	t._setupTick = function () {
		if (null == t._timerId) {
			var e = t.timingMode || t.useRAF && t.RAF_SYNCHED;
			if (e == t.RAF_SYNCHED || e == t.RAF) {
				var i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
				if (i)
					return t._timerId = i(e == t.RAF ? t._handleRAF : t._handleSynch), void(t._raf = !0)
			}
			t._raf = !1,
			t._timerId = setTimeout(t._handleTimeout, t._interval)
		}
	},
	t._tick = function () {
		var e = t.paused,
		i = t._getTime(),
		n = i - t._lastTime;
		if (t._lastTime = i, t._ticks++, e && (t._pausedTicks++, t._pausedTime += n), t.hasEventListener("tick")) {
			var s = new createjs.Event("tick"),
			r = t.maxDelta;
			s.delta = r && n > r ? r : n,
			s.paused = e,
			s.time = i,
			s.runTime = i - t._pausedTime,
			t.dispatchEvent(s)
		}
		for (t._tickTimes.unshift(t._getTime() - i); t._tickTimes.length > 100; )
			t._tickTimes.pop();
		for (t._times.unshift(i); t._times.length > 100; )
			t._times.pop()
	};
	var e = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
	t._getTime = function () {
		return (e && e.call(performance) || (new Date).getTime()) - t._startTime
	},
	createjs.Ticker = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		throw "UID cannot be instantiated"
	}
	t._nextID = 0,
	t.get = function () {
		return t._nextID++
	},
	createjs.UID = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n, s, r, a, h, o, c) {
		this.Event_constructor(t, e, i),
		this.stageX = n,
		this.stageY = s,
		this.rawX = null == o ? n : o,
		this.rawY = null == c ? s : c,
		this.nativeEvent = r,
		this.pointerID = a,
		this.primary = !!h
	}
	var e = createjs.extend(t, createjs.Event);
	e._get_localX = function () {
		return this.currentTarget.globalToLocal(this.rawX, this.rawY).x
	},
	e._get_localY = function () {
		return this.currentTarget.globalToLocal(this.rawX, this.rawY).y
	},
	e._get_isTouch = function () {
		return -1 !== this.pointerID
	};
	try {
		Object.defineProperties(e, {
			localX: {
				get: e._get_localX
			},
			localY: {
				get: e._get_localY
			},
			isTouch: {
				get: e._get_isTouch
			}
		})
	} catch (t) {}
	e.clone = function () {
		return new t(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY)
	},
	e.toString = function () {
		return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
	},
	createjs.MouseEvent = createjs.promote(t, "Event")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n, s, r) {
		this.setValues(t, e, i, n, s, r)
	}
	var e = t.prototype;
	t.DEG_TO_RAD = Math.PI / 180,
	t.identity = null,
	e.setValues = function (t, e, i, n, s, r) {
		return this.a = null == t ? 1 : t,
		this.b = e || 0,
		this.c = i || 0,
		this.d = null == n ? 1 : n,
		this.tx = s || 0,
		this.ty = r || 0,
		this
	},
	e.append = function (t, e, i, n, s, r) {
		var a = this.a,
		h = this.b,
		o = this.c,
		c = this.d;
		return (1 != t || 0 != e || 0 != i || 1 != n) && (this.a = a * t + o * e, this.b = h * t + c * e, this.c = a * i + o * n, this.d = h * i + c * n),
		this.tx = a * s + o * r + this.tx,
		this.ty = h * s + c * r + this.ty,
		this
	},
	e.prepend = function (t, e, i, n, s, r) {
		var a = this.a,
		h = this.c,
		o = this.tx;
		return this.a = t * a + i * this.b,
		this.b = e * a + n * this.b,
		this.c = t * h + i * this.d,
		this.d = e * h + n * this.d,
		this.tx = t * o + i * this.ty + s,
		this.ty = e * o + n * this.ty + r,
		this
	},
	e.appendMatrix = function (t) {
		return this.append(t.a, t.b, t.c, t.d, t.tx, t.ty)
	},
	e.prependMatrix = function (t) {
		return this.prepend(t.a, t.b, t.c, t.d, t.tx, t.ty)
	},
	e.appendTransform = function (e, i, n, s, r, a, h, o, c) {
		if (r % 360)
			var l = r * t.DEG_TO_RAD, u = Math.cos(l), d = Math.sin(l);
		else
			u = 1, d = 0;
		return a || h ? (a *= t.DEG_TO_RAD, h *= t.DEG_TO_RAD, this.append(Math.cos(h), Math.sin(h), -Math.sin(a), Math.cos(a), e, i), this.append(u * n, d * n, -d * s, u * s, 0, 0)) : this.append(u * n, d * n, -d * s, u * s, e, i),
		(o || c) && (this.tx -= o * this.a + c * this.c, this.ty -= o * this.b + c * this.d),
		this
	},
	e.prependTransform = function (e, i, n, s, r, a, h, o, c) {
		if (r % 360)
			var l = r * t.DEG_TO_RAD, u = Math.cos(l), d = Math.sin(l);
		else
			u = 1, d = 0;
		return (o || c) && (this.tx -= o, this.ty -= c),
		a || h ? (a *= t.DEG_TO_RAD, h *= t.DEG_TO_RAD, this.prepend(u * n, d * n, -d * s, u * s, 0, 0), this.prepend(Math.cos(h), Math.sin(h), -Math.sin(a), Math.cos(a), e, i)) : this.prepend(u * n, d * n, -d * s, u * s, e, i),
		this
	},
	e.rotate = function (e) {
		e *= t.DEG_TO_RAD;
		var i = Math.cos(e),
		n = Math.sin(e),
		s = this.a,
		r = this.b;
		return this.a = s * i + this.c * n,
		this.b = r * i + this.d * n,
		this.c = -s * n + this.c * i,
		this.d = -r * n + this.d * i,
		this
	},
	e.skew = function (e, i) {
		return e *= t.DEG_TO_RAD,
		i *= t.DEG_TO_RAD,
		this.append(Math.cos(i), Math.sin(i), -Math.sin(e), Math.cos(e), 0, 0),
		this
	},
	e.scale = function (t, e) {
		return this.a *= t,
		this.b *= t,
		this.c *= e,
		this.d *= e,
		this
	},
	e.translate = function (t, e) {
		return this.tx += this.a * t + this.c * e,
		this.ty += this.b * t + this.d * e,
		this
	},
	e.identity = function () {
		return this.a = this.d = 1,
		this.b = this.c = this.tx = this.ty = 0,
		this
	},
	e.invert = function () {
		var t = this.a,
		e = this.b,
		i = this.c,
		n = this.d,
		s = this.tx,
		r = t * n - e * i;
		return this.a = n / r,
		this.b = -e / r,
		this.c = -i / r,
		this.d = t / r,
		this.tx = (i * this.ty - n * s) / r,
		this.ty =  - (t * this.ty - e * s) / r,
		this
	},
	e.isIdentity = function () {
		return 0 === this.tx && 0 === this.ty && 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d
	},
	e.equals = function (t) {
		return this.tx === t.tx && this.ty === t.ty && this.a === t.a && this.b === t.b && this.c === t.c && this.d === t.d
	},
	e.transformPoint = function (t, e, i) {
		return (i = i || {}).x = t * this.a + e * this.c + this.tx,
		i.y = t * this.b + e * this.d + this.ty,
		i
	},
	e.decompose = function (e) {
		null == e && (e = {}),
		e.x = this.tx,
		e.y = this.ty,
		e.scaleX = Math.sqrt(this.a * this.a + this.b * this.b),
		e.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
		var i = Math.atan2(-this.c, this.d),
		n = Math.atan2(this.b, this.a);
		return 1e-5 > Math.abs(1 - i / n) ? (e.rotation = n / t.DEG_TO_RAD, this.a < 0 && this.d >= 0 && (e.rotation += e.rotation <= 0 ? 180 : -180), e.skewX = e.skewY = 0) : (e.skewX = i / t.DEG_TO_RAD, e.skewY = n / t.DEG_TO_RAD),
		e
	},
	e.copy = function (t) {
		return this.setValues(t.a, t.b, t.c, t.d, t.tx, t.ty)
	},
	e.clone = function () {
		return new t(this.a, this.b, this.c, this.d, this.tx, this.ty)
	},
	e.toString = function () {
		return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
	},
	t.identity = new t,
	createjs.Matrix2D = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n, s) {
		this.setValues(t, e, i, n, s)
	}
	var e = t.prototype;
	e.setValues = function (t, e, i, n, s) {
		return this.visible = null == t || !!t,
		this.alpha = null == e ? 1 : e,
		this.shadow = i,
		this.compositeOperation = i,
		this.matrix = s || this.matrix && this.matrix.identity() || new createjs.Matrix2D,
		this
	},
	e.append = function (t, e, i, n, s) {
		return this.alpha *= e,
		this.shadow = i || this.shadow,
		this.compositeOperation = n || this.compositeOperation,
		this.visible = this.visible && t,
		s && this.matrix.appendMatrix(s),
		this
	},
	e.prepend = function (t, e, i, n, s) {
		return this.alpha *= e,
		this.shadow = this.shadow || i,
		this.compositeOperation = this.compositeOperation || n,
		this.visible = this.visible && t,
		s && this.matrix.prependMatrix(s),
		this
	},
	e.identity = function () {
		return this.visible = !0,
		this.alpha = 1,
		this.shadow = this.compositeOperation = null,
		this.matrix.identity(),
		this
	},
	e.clone = function () {
		return new t(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone())
	},
	createjs.DisplayProps = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e) {
		this.setValues(t, e)
	}
	var e = t.prototype;
	e.setValues = function (t, e) {
		return this.x = t || 0,
		this.y = e || 0,
		this
	},
	e.copy = function (t) {
		return this.x = t.x,
		this.y = t.y,
		this
	},
	e.clone = function () {
		return new t(this.x, this.y)
	},
	e.toString = function () {
		return "[Point (x=" + this.x + " y=" + this.y + ")]"
	},
	createjs.Point = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n) {
		this.setValues(t, e, i, n)
	}
	var e = t.prototype;
	e.setValues = function (t, e, i, n) {
		return this.x = t || 0,
		this.y = e || 0,
		this.width = i || 0,
		this.height = n || 0,
		this
	},
	e.extend = function (t, e, i, n) {
		return i = i || 0,
		n = n || 0,
		t + i > this.x + this.width && (this.width = t + i - this.x),
		e + n > this.y + this.height && (this.height = e + n - this.y),
		t < this.x && (this.width += this.x - t, this.x = t),
		e < this.y && (this.height += this.y - e, this.y = e),
		this
	},
	e.pad = function (t, e, i, n) {
		return this.x -= t,
		this.y -= e,
		this.width += t + i,
		this.height += e + n,
		this
	},
	e.copy = function (t) {
		return this.setValues(t.x, t.y, t.width, t.height)
	},
	e.contains = function (t, e, i, n) {
		return i = i || 0,
		n = n || 0,
		t >= this.x && t + i <= this.x + this.width && e >= this.y && e + n <= this.y + this.height
	},
	e.union = function (t) {
		return this.clone().extend(t.x, t.y, t.width, t.height)
	},
	e.intersection = function (e) {
		var i = e.x,
		n = e.y,
		s = i + e.width,
		r = n + e.height;
		return this.x > i && (i = this.x),
		this.y > n && (n = this.y),
		this.x + this.width < s && (s = this.x + this.width),
		this.y + this.height < r && (r = this.y + this.height),
		i >= s || n >= r ? null : new t(i, n, s - i, r - n)
	},
	e.intersects = function (t) {
		return t.x <= this.x + this.width && this.x <= t.x + t.width && t.y <= this.y + this.height && this.y <= t.y + t.height
	},
	e.isEmpty = function () {
		return this.width <= 0 || this.height <= 0
	},
	e.clone = function () {
		return new t(this.x, this.y, this.width, this.height)
	},
	e.toString = function () {
		return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
	},
	createjs.Rectangle = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n, s, r, a) {
		t.addEventListener && (this.target = t, this.overLabel = null == i ? "over" : i, this.outLabel = null == e ? "out" : e, this.downLabel = null == n ? "down" : n, this.play = s, this._isPressed = !1, this._isOver = !1, this._enabled = !1, t.mouseChildren = !1, this.enabled = !0, this.handleEvent({}), r && (a && (r.actionsEnabled = !1, r.gotoAndStop && r.gotoAndStop(a)), t.hitArea = r))
	}
	var e = t.prototype;
	e.setEnabled = function (t) {
		if (t != this._enabled) {
			var e = this.target;
			this._enabled = t,
			t ? (e.cursor = "pointer", e.addEventListener("rollover", this), e.addEventListener("rollout", this), e.addEventListener("mousedown", this), e.addEventListener("pressup", this)) : (e.cursor = null, e.removeEventListener("rollover", this), e.removeEventListener("rollout", this), e.removeEventListener("mousedown", this), e.removeEventListener("pressup", this))
		}
	},
	e.getEnabled = function () {
		return this._enabled
	};
	try {
		Object.defineProperties(e, {
			enabled: {
				get: e.getEnabled,
				set: e.setEnabled
			}
		})
	} catch (t) {}
	e.toString = function () {
		return "[ButtonHelper]"
	},
	e.handleEvent = function (t) {
		var e,
		i = this.target,
		n = t.type;
		"mousedown" == n ? (this._isPressed = !0, e = this.downLabel) : "pressup" == n ? (this._isPressed = !1, e = this._isOver ? this.overLabel : this.outLabel) : "rollover" == n ? (this._isOver = !0, e = this._isPressed ? this.downLabel : this.overLabel) : (this._isOver = !1, e = this._isPressed ? this.overLabel : this.outLabel),
		this.play ? i.gotoAndPlay && i.gotoAndPlay(e) : i.gotoAndStop && i.gotoAndStop(e)
	},
	createjs.ButtonHelper = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n) {
		this.color = t || "black",
		this.offsetX = e || 0,
		this.offsetY = i || 0,
		this.blur = n || 0
	}
	var e = t.prototype;
	t.identity = new t("transparent", 0, 0, 0),
	e.toString = function () {
		return "[Shadow]"
	},
	e.clone = function () {
		return new t(this.color, this.offsetX, this.offsetY, this.blur)
	},
	createjs.Shadow = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t) {
		this.EventDispatcher_constructor(),
		this.complete = !0,
		this.framerate = 0,
		this._animations = null,
		this._frames = null,
		this._images = null,
		this._data = null,
		this._loadCount = 0,
		this._frameHeight = 0,
		this._frameWidth = 0,
		this._numFrames = 0,
		this._regX = 0,
		this._regY = 0,
		this._spacing = 0,
		this._margin = 0,
		this._parseData(t)
	}
	var e = createjs.extend(t, createjs.EventDispatcher);
	e.getAnimations = function () {
		return this._animations.slice()
	};
	try {
		Object.defineProperties(e, {
			animations: {
				get: e.getAnimations
			}
		})
	} catch (t) {}
	e.getNumFrames = function (t) {
		if (null == t)
			return this._frames ? this._frames.length : this._numFrames || 0;
		var e = this._data[t];
		return null == e ? 0 : e.frames.length
	},
	e.getAnimation = function (t) {
		return this._data[t]
	},
	e.getFrame = function (t) {
		var e;
		return this._frames && (e = this._frames[t]) ? e : null
	},
	e.getFrameBounds = function (t, e) {
		var i = this.getFrame(t);
		return i ? (e || new createjs.Rectangle).setValues(-i.regX, -i.regY, i.rect.width, i.rect.height) : null
	},
	e.toString = function () {
		return "[SpriteSheet]"
	},
	e.clone = function () {
		throw "SpriteSheet cannot be cloned."
	},
	e._parseData = function (t) {
		var e,
		i,
		n,
		s;
		if (null != t) {
			if (this.framerate = t.framerate || 0, t.images && (i = t.images.length) > 0)
				for (s = this._images = [], e = 0; i > e; e++) {
					var r = t.images[e];
					if ("string" == typeof r) {
						var a = r;
						(r = document.createElement("img")).src = a
					}
					s.push(r),
					r.getContext || r.complete || (this._loadCount++, this.complete = !1, function (t) {
						r.onload = function () {
							t._handleImageLoad()
						}
					}
						(this))
				}
			if (null == t.frames);
			else if (t.frames instanceof Array)
				for (this._frames = [], e = 0, i = (s = t.frames).length; i > e; e++) {
					var h = s[e];
					this._frames.push({
						image: this._images[h[4] ? h[4] : 0],
						rect: new createjs.Rectangle(h[0], h[1], h[2], h[3]),
						regX: h[5] || 0,
						regY: h[6] || 0
					})
				}
			else
				n = t.frames, this._frameWidth = n.width, this._frameHeight = n.height, this._regX = n.regX || 0, this._regY = n.regY || 0, this._spacing = n.spacing || 0, this._margin = n.margin || 0, this._numFrames = n.count, 0 == this._loadCount && this._calculateFrames();
			var o;
			if (this._animations = [], null != (n = t.animations))
				for (o in this._data = {}, n) {
					var c = {
						name: o
					},
					l = n[o];
					if ("number" == typeof l)
						s = c.frames = [l];
					else if (l instanceof Array)
						if (1 == l.length)
							c.frames = [l[0]];
						else
							for (c.speed = l[3], c.next = l[2], s = c.frames = [], e = l[0]; e <= l[1]; e++)
								s.push(e);
					else {
						c.speed = l.speed,
						c.next = l.next;
						var u = l.frames;
						s = c.frames = "number" == typeof u ? [u] : u.slice(0)
					}
					(!0 === c.next || void 0 === c.next) && (c.next = o),
					(!1 === c.next || s.length < 2 && c.next == o) && (c.next = null),
					c.speed || (c.speed = 1),
					this._animations.push(o),
					this._data[o] = c
				}
		}
	},
	e._handleImageLoad = function () {
		0 == --this._loadCount && (this._calculateFrames(), this.complete = !0, this.dispatchEvent("complete"))
	},
	e._calculateFrames = function () {
		if (!this._frames && 0 != this._frameWidth) {
			this._frames = [];
			var t = this._numFrames || 1e5,
			e = 0,
			i = this._frameWidth,
			n = this._frameHeight,
			s = this._spacing,
			r = this._margin;
			t: for (var a = 0, h = this._images; a < h.length; a++)
				for (var o = h[a], c = o.width, l = o.height, u = r; l - r - n >= u; ) {
					for (var d = r; c - r - i >= d; ) {
						if (e >= t)
							break t;
						e++,
						this._frames.push({
							image: o,
							rect: new createjs.Rectangle(d, u, i, n),
							regX: this._regX,
							regY: this._regY
						}),
						d += i + s
					}
					u += n + s
				}
			this._numFrames = e
		}
	},
	createjs.SpriteSheet = createjs.promote(t, "EventDispatcher")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		this.command = null,
		this._stroke = null,
		this._strokeStyle = null,
		this._strokeIgnoreScale = !1,
		this._fill = null,
		this._instructions = [],
		this._commitIndex = 0,
		this._activeInstructions = [],
		this._dirty = !1,
		this._storeIndex = 0,
		this.clear()
	}
	var e = t.prototype,
	i = t;
	t.getRGB = function (t, e, i, n) {
		return null != t && null == i && (n = e, i = 255 & t, e = t >> 8 & 255, t = t >> 16 & 255),
		null == n ? "rgb(" + t + "," + e + "," + i + ")" : "rgba(" + t + "," + e + "," + i + "," + n + ")"
	},
	t.getHSL = function (t, e, i, n) {
		return null == n ? "hsl(" + t % 360 + "," + e + "%," + i + "%)" : "hsla(" + t % 360 + "," + e + "%," + i + "%," + n + ")"
	},
	t.BASE_64 = {
		A: 0,
		B: 1,
		C: 2,
		D: 3,
		E: 4,
		F: 5,
		G: 6,
		H: 7,
		I: 8,
		J: 9,
		K: 10,
		L: 11,
		M: 12,
		N: 13,
		O: 14,
		P: 15,
		Q: 16,
		R: 17,
		S: 18,
		T: 19,
		U: 20,
		V: 21,
		W: 22,
		X: 23,
		Y: 24,
		Z: 25,
		a: 26,
		b: 27,
		c: 28,
		d: 29,
		e: 30,
		f: 31,
		g: 32,
		h: 33,
		i: 34,
		j: 35,
		k: 36,
		l: 37,
		m: 38,
		n: 39,
		o: 40,
		p: 41,
		q: 42,
		r: 43,
		s: 44,
		t: 45,
		u: 46,
		v: 47,
		w: 48,
		x: 49,
		y: 50,
		z: 51,
		0: 52,
		1: 53,
		2: 54,
		3: 55,
		4: 56,
		5: 57,
		6: 58,
		7: 59,
		8: 60,
		9: 61,
		"+": 62,
		"/": 63
	},
	t.STROKE_CAPS_MAP = ["butt", "round", "square"],
	t.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
	var n = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
	n.getContext && (t._ctx = n.getContext("2d"), n.width = n.height = 1),
	e.getInstructions = function () {
		return this._updateInstructions(),
		this._instructions
	};
	try {
		Object.defineProperties(e, {
			instructions: {
				get: e.getInstructions
			}
		})
	} catch (t) {}
	e.isEmpty = function () {
		return !(this._instructions.length || this._activeInstructions.length)
	},
	e.draw = function (t, e) {
		this._updateInstructions();
		for (var i = this._instructions, n = this._storeIndex, s = i.length; s > n; n++)
			i[n].exec(t, e)
	},
	e.drawAsPath = function (t) {
		this._updateInstructions();
		for (var e, i = this._instructions, n = this._storeIndex, s = i.length; s > n; n++)
			!1 !== (e = i[n]).path && e.exec(t)
	},
	e.moveTo = function (t, e) {
		return this.append(new i.MoveTo(t, e), !0)
	},
	e.lineTo = function (t, e) {
		return this.append(new i.LineTo(t, e))
	},
	e.arcTo = function (t, e, n, s, r) {
		return this.append(new i.ArcTo(t, e, n, s, r))
	},
	e.arc = function (t, e, n, s, r, a) {
		return this.append(new i.Arc(t, e, n, s, r, a))
	},
	e.quadraticCurveTo = function (t, e, n, s) {
		return this.append(new i.QuadraticCurveTo(t, e, n, s))
	},
	e.bezierCurveTo = function (t, e, n, s, r, a) {
		return this.append(new i.BezierCurveTo(t, e, n, s, r, a))
	},
	e.rect = function (t, e, n, s) {
		return this.append(new i.Rect(t, e, n, s))
	},
	e.closePath = function () {
		return this._activeInstructions.length ? this.append(new i.ClosePath) : this
	},
	e.clear = function () {
		return this._instructions.length = this._activeInstructions.length = this._commitIndex = 0,
		this._strokeStyle = this._stroke = this._fill = null,
		this._dirty = this._strokeIgnoreScale = !1,
		this
	},
	e.beginFill = function (t) {
		return this._setFill(t ? new i.Fill(t) : null)
	},
	e.beginLinearGradientFill = function (t, e, n, s, r, a) {
		return this._setFill((new i.Fill).linearGradient(t, e, n, s, r, a))
	},
	e.beginRadialGradientFill = function (t, e, n, s, r, a, h, o) {
		return this._setFill((new i.Fill).radialGradient(t, e, n, s, r, a, h, o))
	},
	e.beginBitmapFill = function (t, e, n) {
		return this._setFill(new i.Fill(null, n).bitmap(t, e))
	},
	e.endFill = function () {
		return this.beginFill()
	},
	e.setStrokeStyle = function (t, e, n, s, r) {
		return this._updateInstructions(!0),
		this._strokeStyle = this.command = new i.StrokeStyle(t, e, n, s, r),
		this._stroke && (this._stroke.ignoreScale = r),
		this._strokeIgnoreScale = r,
		this
	},
	e.beginStroke = function (t) {
		return this._setStroke(t ? new i.Stroke(t) : null)
	},
	e.beginLinearGradientStroke = function (t, e, n, s, r, a) {
		return this._setStroke((new i.Stroke).linearGradient(t, e, n, s, r, a))
	},
	e.beginRadialGradientStroke = function (t, e, n, s, r, a, h, o) {
		return this._setStroke((new i.Stroke).radialGradient(t, e, n, s, r, a, h, o))
	},
	e.beginBitmapStroke = function (t, e) {
		return this._setStroke((new i.Stroke).bitmap(t, e))
	},
	e.endStroke = function () {
		return this.beginStroke()
	},
	e.curveTo = e.quadraticCurveTo,
	e.drawRect = e.rect,
	e.drawRoundRect = function (t, e, i, n, s) {
		return this.drawRoundRectComplex(t, e, i, n, s, s, s, s)
	},
	e.drawRoundRectComplex = function (t, e, n, s, r, a, h, o) {
		return this.append(new i.RoundRect(t, e, n, s, r, a, h, o))
	},
	e.drawCircle = function (t, e, n) {
		return this.append(new i.Circle(t, e, n))
	},
	e.drawEllipse = function (t, e, n, s) {
		return this.append(new i.Ellipse(t, e, n, s))
	},
	e.drawPolyStar = function (t, e, n, s, r, a) {
		return this.append(new i.PolyStar(t, e, n, s, r, a))
	},
	e.append = function (t, e) {
		return this._activeInstructions.push(t),
		this.command = t,
		e || (this._dirty = !0),
		this
	},
	e.decodePath = function (e) {
		for (var i = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath], n = [2, 2, 4, 6, 0], s = 0, r = e.length, a = [], h = 0, o = 0, c = t.BASE_64; r > s; ) {
			var l = e.charAt(s),
			u = c[l],
			d = u >> 3,
			p = i[d];
			if (!p || 3 & u)
				throw "bad path data (@" + s + "): " + l;
			var f = n[d];
			d || (h = o = 0),
			a.length = 0,
			s++;
			for (var g = 2 + (u >> 2 & 1), _ = 0; f > _; _++) {
				var m = c[e.charAt(s)],
				v = m >> 5 ? -1 : 1;
				m = (31 & m) << 6 | c[e.charAt(s + 1)],
				3 == g && (m = m << 6 | c[e.charAt(s + 2)]),
				m = v * m / 10,
				_ % 2 ? h = m += h : o = m += o,
				a[_] = m,
				s += g
			}
			p.apply(this, a)
		}
		return this
	},
	e.store = function () {
		return this._updateInstructions(!0),
		this._storeIndex = this._instructions.length,
		this
	},
	e.unstore = function () {
		return this._storeIndex = 0,
		this
	},
	e.clone = function () {
		var e = new t;
		return e.command = this.command,
		e._stroke = this._stroke,
		e._strokeStyle = this._strokeStyle,
		e._strokeIgnoreScale = this._strokeIgnoreScale,
		e._fill = this._fill,
		e._instructions = this._instructions.slice(),
		e._commitIndex = this._commitIndex,
		e._activeInstructions = this._activeInstructions.slice(),
		e._dirty = this._dirty,
		e._storeIndex = this._storeIndex,
		e
	},
	e.toString = function () {
		return "[Graphics]"
	},
	e.mt = e.moveTo,
	e.lt = e.lineTo,
	e.at = e.arcTo,
	e.bt = e.bezierCurveTo,
	e.qt = e.quadraticCurveTo,
	e.a = e.arc,
	e.r = e.rect,
	e.cp = e.closePath,
	e.c = e.clear,
	e.f = e.beginFill,
	e.lf = e.beginLinearGradientFill,
	e.rf = e.beginRadialGradientFill,
	e.bf = e.beginBitmapFill,
	e.ef = e.endFill,
	e.ss = e.setStrokeStyle,
	e.s = e.beginStroke,
	e.ls = e.beginLinearGradientStroke,
	e.rs = e.beginRadialGradientStroke,
	e.bs = e.beginBitmapStroke,
	e.es = e.endStroke,
	e.dr = e.drawRect,
	e.rr = e.drawRoundRect,
	e.rc = e.drawRoundRectComplex,
	e.dc = e.drawCircle,
	e.de = e.drawEllipse,
	e.dp = e.drawPolyStar,
	e.p = e.decodePath,
	e._updateInstructions = function (e) {
		var i = this._instructions,
		n = this._activeInstructions,
		s = this._commitIndex;
		if (this._dirty && n.length) {
			i.length = s,
			i.push(t.beginCmd);
			var r = n.length,
			a = i.length;
			i.length = a + r;
			for (var h = 0; r > h; h++)
				i[h + a] = n[h];
			this._fill && i.push(this._fill),
			this._stroke && this._strokeStyle && i.push(this._strokeStyle),
			this._stroke && i.push(this._stroke),
			this._dirty = !1
		}
		e && (n.length = 0, this._commitIndex = i.length)
	},
	e._setFill = function (t) {
		return this._updateInstructions(!0),
		(this._fill = t) && (this.command = t),
		this
	},
	e._setStroke = function (t) {
		return this._updateInstructions(!0),
		(this._stroke = t) && (this.command = t, t.ignoreScale = this._strokeIgnoreScale),
		this
	},
	(i.LineTo = function (t, e) {
		this.x = t,
		this.y = e
	}).prototype.exec = function (t) {
		t.lineTo(this.x, this.y)
	},
	(i.MoveTo = function (t, e) {
		this.x = t,
		this.y = e
	}).prototype.exec = function (t) {
		t.moveTo(this.x, this.y)
	},
	(i.ArcTo = function (t, e, i, n, s) {
		this.x1 = t,
		this.y1 = e,
		this.x2 = i,
		this.y2 = n,
		this.radius = s
	}).prototype.exec = function (t) {
		t.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius)
	},
	(i.Arc = function (t, e, i, n, s, r) {
		this.x = t,
		this.y = e,
		this.radius = i,
		this.startAngle = n,
		this.endAngle = s,
		this.anticlockwise = !!r
	}).prototype.exec = function (t) {
		t.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
	},
	(i.QuadraticCurveTo = function (t, e, i, n) {
		this.cpx = t,
		this.cpy = e,
		this.x = i,
		this.y = n
	}).prototype.exec = function (t) {
		t.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y)
	},
	(i.BezierCurveTo = function (t, e, i, n, s, r) {
		this.cp1x = t,
		this.cp1y = e,
		this.cp2x = i,
		this.cp2y = n,
		this.x = s,
		this.y = r
	}).prototype.exec = function (t) {
		t.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y)
	},
	(i.Rect = function (t, e, i, n) {
		this.x = t,
		this.y = e,
		this.w = i,
		this.h = n
	}).prototype.exec = function (t) {
		t.rect(this.x, this.y, this.w, this.h)
	},
	(i.ClosePath = function () {}).prototype.exec = function (t) {
		t.closePath()
	},
	(i.BeginPath = function () {}).prototype.exec = function (t) {
		t.beginPath()
	},
	(e = (i.Fill = function (t, e) {
			this.style = t,
			this.matrix = e
		}).prototype).exec = function (t) {
		if (this.style) {
			t.fillStyle = this.style;
			var e = this.matrix;
			e && (t.save(), t.transform(e.a, e.b, e.c, e.d, e.tx, e.ty)),
			t.fill(),
			e && t.restore()
		}
	},
	e.linearGradient = function (e, i, n, s, r, a) {
		for (var h = this.style = t._ctx.createLinearGradient(n, s, r, a), o = 0, c = e.length; c > o; o++)
			h.addColorStop(i[o], e[o]);
		return h.props = {
			colors: e,
			ratios: i,
			x0: n,
			y0: s,
			x1: r,
			y1: a,
			type: "linear"
		},
		this
	},
	e.radialGradient = function (e, i, n, s, r, a, h, o) {
		for (var c = this.style = t._ctx.createRadialGradient(n, s, r, a, h, o), l = 0, u = e.length; u > l; l++)
			c.addColorStop(i[l], e[l]);
		return c.props = {
			colors: e,
			ratios: i,
			x0: n,
			y0: s,
			r0: r,
			x1: a,
			y1: h,
			r1: o,
			type: "radial"
		},
		this
	},
	e.bitmap = function (e, i) {
		return (this.style = t._ctx.createPattern(e, i || "")).props = {
			image: e,
			repetition: i,
			type: "bitmap"
		},
		this
	},
	e.path = !1,
	(e = (i.Stroke = function (t, e) {
			this.style = t,
			this.ignoreScale = e
		}).prototype).exec = function (t) {
		this.style && (t.strokeStyle = this.style, this.ignoreScale && (t.save(), t.setTransform(1, 0, 0, 1, 0, 0)), t.stroke(), this.ignoreScale && t.restore())
	},
	e.linearGradient = i.Fill.prototype.linearGradient,
	e.radialGradient = i.Fill.prototype.radialGradient,
	e.bitmap = i.Fill.prototype.bitmap,
	e.path = !1,
	(e = (i.StrokeStyle = function (t, e, i, n) {
			this.width = t,
			this.caps = e,
			this.joints = i,
			this.miterLimit = n
		}).prototype).exec = function (e) {
		e.lineWidth = null == this.width ? "1" : this.width,
		e.lineCap = null == this.caps ? "butt" : isNaN(this.caps) ? this.caps : t.STROKE_CAPS_MAP[this.caps],
		e.lineJoin = null == this.joints ? "miter" : isNaN(this.joints) ? this.joints : t.STROKE_JOINTS_MAP[this.joints],
		e.miterLimit = null == this.miterLimit ? "10" : this.miterLimit
	},
	e.path = !1,
	(i.RoundRect = function (t, e, i, n, s, r, a, h) {
		this.x = t,
		this.y = e,
		this.w = i,
		this.h = n,
		this.radiusTL = s,
		this.radiusTR = r,
		this.radiusBR = a,
		this.radiusBL = h
	}).prototype.exec = function (t) {
		var e = (c > o ? o : c) / 2,
		i = 0,
		n = 0,
		s = 0,
		r = 0,
		a = this.x,
		h = this.y,
		o = this.w,
		c = this.h,
		l = this.radiusTL,
		u = this.radiusTR,
		d = this.radiusBR,
		p = this.radiusBL;
		0 > l && (l *= i = -1),
		l > e && (l = e),
		0 > u && (u *= n = -1),
		u > e && (u = e),
		0 > d && (d *= s = -1),
		d > e && (d = e),
		0 > p && (p *= r = -1),
		p > e && (p = e),
		t.moveTo(a + o - u, h),
		t.arcTo(a + o + u * n, h - u * n, a + o, h + u, u),
		t.lineTo(a + o, h + c - d),
		t.arcTo(a + o + d * s, h + c + d * s, a + o - d, h + c, d),
		t.lineTo(a + p, h + c),
		t.arcTo(a - p * r, h + c + p * r, a, h + c - p, p),
		t.lineTo(a, h + l),
		t.arcTo(a - l * i, h - l * i, a + l, h, l),
		t.closePath()
	},
	(i.Circle = function (t, e, i) {
		this.x = t,
		this.y = e,
		this.radius = i
	}).prototype.exec = function (t) {
		t.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
	},
	(i.Ellipse = function (t, e, i, n) {
		this.x = t,
		this.y = e,
		this.w = i,
		this.h = n
	}).prototype.exec = function (t) {
		var e = this.x,
		i = this.y,
		n = this.w,
		s = this.h,
		r = n / 2 * .5522848,
		a = s / 2 * .5522848,
		h = e + n,
		o = i + s,
		c = e + n / 2,
		l = i + s / 2;
		t.moveTo(e, l),
		t.bezierCurveTo(e, l - a, c - r, i, c, i),
		t.bezierCurveTo(c + r, i, h, l - a, h, l),
		t.bezierCurveTo(h, l + a, c + r, o, c, o),
		t.bezierCurveTo(c - r, o, e, l + a, e, l)
	},
	(i.PolyStar = function (t, e, i, n, s, r) {
		this.x = t,
		this.y = e,
		this.radius = i,
		this.sides = n,
		this.pointSize = s,
		this.angle = r
	}).prototype.exec = function (t) {
		var e = this.x,
		i = this.y,
		n = this.radius,
		s = (this.angle || 0) / 180 * Math.PI,
		r = this.sides,
		a = 1 - (this.pointSize || 0),
		h = Math.PI / r;
		t.moveTo(e + Math.cos(s) * n, i + Math.sin(s) * n);
		for (var o = 0; r > o; o++)
			s += h, 1 != a && t.lineTo(e + Math.cos(s) * n * a, i + Math.sin(s) * n * a), s += h, t.lineTo(e + Math.cos(s) * n, i + Math.sin(s) * n);
		t.closePath()
	},
	t.beginCmd = new i.BeginPath,
	createjs.Graphics = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		this.EventDispatcher_constructor(),
		this.alpha = 1,
		this.cacheCanvas = null,
		this.cacheID = 0,
		this.id = createjs.UID.get(),
		this.mouseEnabled = !0,
		this.tickEnabled = !0,
		this.name = null,
		this.parent = null,
		this.regX = 0,
		this.regY = 0,
		this.rotation = 0,
		this.scaleX = 1,
		this.scaleY = 1,
		this.skewX = 0,
		this.skewY = 0,
		this.shadow = null,
		this.visible = !0,
		this.x = 0,
		this.y = 0,
		this.transformMatrix = null,
		this.compositeOperation = null,
		this.snapToPixel = !0,
		this.filters = null,
		this.mask = null,
		this.hitArea = null,
		this.cursor = null,
		this._cacheOffsetX = 0,
		this._cacheOffsetY = 0,
		this._filterOffsetX = 0,
		this._filterOffsetY = 0,
		this._cacheScale = 1,
		this._cacheDataURLID = 0,
		this._cacheDataURL = null,
		this._props = new createjs.DisplayProps,
		this._rectangle = new createjs.Rectangle,
		this._bounds = null
	}
	var e = createjs.extend(t, createjs.EventDispatcher);
	t._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"],
	t.suppressCrossDomainErrors = !1,
	t._snapToPixelEnabled = !1;
	var i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
	i.getContext && (t._hitTestCanvas = i, t._hitTestContext = i.getContext("2d"), i.width = i.height = 1),
	t._nextCacheID = 1,
	e.getStage = function () {
		for (var t = this, e = createjs.Stage; t.parent; )
			t = t.parent;
		return t instanceof e ? t : null
	};
	try {
		Object.defineProperties(e, {
			stage: {
				get: e.getStage
			}
		})
	} catch (t) {}
	e.isVisible = function () {
		return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY)
	},
	e.draw = function (t, e) {
		var i = this.cacheCanvas;
		if (e || !i)
			return !1;
		var n = this._cacheScale;
		return t.drawImage(i, this._cacheOffsetX + this._filterOffsetX, this._cacheOffsetY + this._filterOffsetY, i.width / n, i.height / n),
		!0
	},
	e.updateContext = function (e) {
		var i = this,
		n = i.mask,
		s = i._props.matrix;
		n && n.graphics && !n.graphics.isEmpty() && (n.getMatrix(s), e.transform(s.a, s.b, s.c, s.d, s.tx, s.ty), n.graphics.drawAsPath(e), e.clip(), s.invert(), e.transform(s.a, s.b, s.c, s.d, s.tx, s.ty)),
		this.getMatrix(s);
		var r = s.tx,
		a = s.ty;
		t._snapToPixelEnabled && i.snapToPixel && (r = r + (0 > r ?  - .5 : .5) | 0, a = a + (0 > a ?  - .5 : .5) | 0),
		e.transform(s.a, s.b, s.c, s.d, r, a),
		e.globalAlpha *= i.alpha,
		i.compositeOperation && (e.globalCompositeOperation = i.compositeOperation),
		i.shadow && this._applyShadow(e, i.shadow)
	},
	e.cache = function (t, e, i, n, s) {
		s = s || 1,
		this.cacheCanvas || (this.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")),
		this._cacheWidth = i,
		this._cacheHeight = n,
		this._cacheOffsetX = t,
		this._cacheOffsetY = e,
		this._cacheScale = s,
		this.updateCache()
	},
	e.updateCache = function (e) {
		var i = this.cacheCanvas;
		if (!i)
			throw "cache() must be called before updateCache()";
		var n = this._cacheScale,
		s = this._cacheOffsetX * n,
		r = this._cacheOffsetY * n,
		a = this._cacheWidth,
		h = this._cacheHeight,
		o = i.getContext("2d"),
		c = this._getFilterBounds();
		s += this._filterOffsetX = c.x,
		r += this._filterOffsetY = c.y,
		a = Math.ceil(a * n) + c.width,
		h = Math.ceil(h * n) + c.height,
		a != i.width || h != i.height ? (i.width = a, i.height = h) : e || o.clearRect(0, 0, a + 1, h + 1),
		o.save(),
		o.globalCompositeOperation = e,
		o.setTransform(n, 0, 0, n, -s, -r),
		this.draw(o, !0),
		this._applyFilters(),
		o.restore(),
		this.cacheID = t._nextCacheID++
	},
	e.uncache = function () {
		this._cacheDataURL = this.cacheCanvas = null,
		this.cacheID = this._cacheOffsetX = this._cacheOffsetY = this._filterOffsetX = this._filterOffsetY = 0,
		this._cacheScale = 1
	},
	e.getCacheDataURL = function () {
		return this.cacheCanvas ? (this.cacheID != this._cacheDataURLID && (this._cacheDataURL = this.cacheCanvas.toDataURL()), this._cacheDataURL) : null
	},
	e.localToGlobal = function (t, e, i) {
		return this.getConcatenatedMatrix(this._props.matrix).transformPoint(t, e, i || new createjs.Point)
	},
	e.globalToLocal = function (t, e, i) {
		return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(t, e, i || new createjs.Point)
	},
	e.localToLocal = function (t, e, i, n) {
		return n = this.localToGlobal(t, e, n),
		i.globalToLocal(n.x, n.y, n)
	},
	e.setTransform = function (t, e, i, n, s, r, a, h, o) {
		return this.x = t || 0,
		this.y = e || 0,
		this.scaleX = null == i ? 1 : i,
		this.scaleY = null == n ? 1 : n,
		this.rotation = s || 0,
		this.skewX = r || 0,
		this.skewY = a || 0,
		this.regX = h || 0,
		this.regY = o || 0,
		this
	},
	e.getMatrix = function (t) {
		var e = this,
		i = t && t.identity() || new createjs.Matrix2D;
		return e.transformMatrix ? i.copy(e.transformMatrix) : i.appendTransform(e.x, e.y, e.scaleX, e.scaleY, e.rotation, e.skewX, e.skewY, e.regX, e.regY)
	},
	e.getConcatenatedMatrix = function (t) {
		for (var e = this, i = this.getMatrix(t); e = e.parent; )
			i.prependMatrix(e.getMatrix(e._props.matrix));
		return i
	},
	e.getConcatenatedDisplayProps = function (t) {
		t = t ? t.identity() : new createjs.DisplayProps;
		var e = this,
		i = e.getMatrix(t.matrix);
		do {
			t.prepend(e.visible, e.alpha, e.shadow, e.compositeOperation),
			e != this && i.prependMatrix(e.getMatrix(e._props.matrix))
		} while (e = e.parent);
		return t
	},
	e.hitTest = function (e, i) {
		var n = t._hitTestContext;
		n.setTransform(1, 0, 0, 1, -e, -i),
		this.draw(n);
		var s = this._testHit(n);
		return n.setTransform(1, 0, 0, 1, 0, 0),
		n.clearRect(0, 0, 2, 2),
		s
	},
	e.set = function (t) {
		for (var e in t)
			this[e] = t[e];
		return this
	},
	e.getBounds = function () {
		if (this._bounds)
			return this._rectangle.copy(this._bounds);
		var t = this.cacheCanvas;
		if (t) {
			var e = this._cacheScale;
			return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, t.width / e, t.height / e)
		}
		return null
	},
	e.getTransformedBounds = function () {
		return this._getBounds()
	},
	e.setBounds = function (t, e, i, n) {
		null == t && (this._bounds = t),
		this._bounds = (this._bounds || new createjs.Rectangle).setValues(t, e, i, n)
	},
	e.clone = function () {
		return this._cloneProps(new t)
	},
	e.toString = function () {
		return "[DisplayObject (name=" + this.name + ")]"
	},
	e._cloneProps = function (t) {
		return t.alpha = this.alpha,
		t.mouseEnabled = this.mouseEnabled,
		t.tickEnabled = this.tickEnabled,
		t.name = this.name,
		t.regX = this.regX,
		t.regY = this.regY,
		t.rotation = this.rotation,
		t.scaleX = this.scaleX,
		t.scaleY = this.scaleY,
		t.shadow = this.shadow,
		t.skewX = this.skewX,
		t.skewY = this.skewY,
		t.visible = this.visible,
		t.x = this.x,
		t.y = this.y,
		t.compositeOperation = this.compositeOperation,
		t.snapToPixel = this.snapToPixel,
		t.filters = null == this.filters ? null : this.filters.slice(0),
		t.mask = this.mask,
		t.hitArea = this.hitArea,
		t.cursor = this.cursor,
		t._bounds = this._bounds,
		t
	},
	e._applyShadow = function (t, e) {
		e = e || Shadow.identity,
		t.shadowColor = e.color,
		t.shadowOffsetX = e.offsetX,
		t.shadowOffsetY = e.offsetY,
		t.shadowBlur = e.blur
	},
	e._tick = function (t) {
		var e = this._listeners;
		e && e.tick && (t.target = null, t.propagationStopped = t.immediatePropagationStopped = !1, this.dispatchEvent(t))
	},
	e._testHit = function (e) {
		try {
			var i = e.getImageData(0, 0, 1, 1).data[3] > 1
		} catch (e) {
			if (!t.suppressCrossDomainErrors)
				throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."
		}
		return i
	},
	e._applyFilters = function () {
		if (this.filters && 0 != this.filters.length && this.cacheCanvas)
			for (var t = this.filters.length, e = this.cacheCanvas.getContext("2d"), i = this.cacheCanvas.width, n = this.cacheCanvas.height, s = 0; t > s; s++)
				this.filters[s].applyFilter(e, 0, 0, i, n)
	},
	e._getFilterBounds = function () {
		var t,
		e = this.filters,
		i = this._rectangle.setValues(0, 0, 0, 0);
		if (!e || !(t = e.length))
			return i;
		for (var n = 0; t > n; n++) {
			var s = this.filters[n];
			s.getBounds && s.getBounds(i)
		}
		return i
	},
	e._getBounds = function (t, e) {
		return this._transformBounds(this.getBounds(), t, e)
	},
	e._transformBounds = function (t, e, i) {
		if (!t)
			return t;
		var n = t.x,
		s = t.y,
		r = t.width,
		a = t.height,
		h = this._props.matrix;
		h = i ? h.identity() : this.getMatrix(h),
		(n || s) && h.appendTransform(0, 0, 1, 1, 0, 0, 0, -n, -s),
		e && h.prependMatrix(e);
		var o = r * h.a,
		c = r * h.b,
		l = a * h.c,
		u = a * h.d,
		d = h.tx,
		p = h.ty,
		f = d,
		g = d,
		_ = p,
		m = p;
		return (n = o + d) < f ? f = n : n > g && (g = n),
		(n = o + l + d) < f ? f = n : n > g && (g = n),
		(n = l + d) < f ? f = n : n > g && (g = n),
		(s = c + p) < _ ? _ = s : s > m && (m = s),
		(s = c + u + p) < _ ? _ = s : s > m && (m = s),
		(s = u + p) < _ ? _ = s : s > m && (m = s),
		t.setValues(f, _, g - f, m - _)
	},
	e._hasMouseEventListener = function () {
		for (var e = t._MOUSE_EVENTS, i = 0, n = e.length; n > i; i++)
			if (this.hasEventListener(e[i]))
				return !0;
		return !!this.cursor
	},
	createjs.DisplayObject = createjs.promote(t, "EventDispatcher")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		this.DisplayObject_constructor(),
		this.children = [],
		this.mouseChildren = !0,
		this.tickChildren = !0
	}
	var e = createjs.extend(t, createjs.DisplayObject);
	e.getNumChildren = function () {
		return this.children.length
	};
	try {
		Object.defineProperties(e, {
			numChildren: {
				get: e.getNumChildren
			}
		})
	} catch (t) {}
	e.initialize = t,
	e.isVisible = function () {
		var t = this.cacheCanvas || this.children.length;
		return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
	},
	e.draw = function (t, e) {
		if (this.DisplayObject_draw(t, e))
			return !0;
		for (var i = this.children.slice(), n = 0, s = i.length; s > n; n++) {
			var r = i[n];
			r.isVisible() && (t.save(), r.updateContext(t), r.draw(t), t.restore())
		}
		return !0
	},
	e.addChild = function (t) {
		if (null == t)
			return t;
		var e = arguments.length;
		if (e > 1) {
			for (var i = 0; e > i; i++)
				this.addChild(arguments[i]);
			return arguments[e - 1]
		}
		return t.parent && t.parent.removeChild(t),
		t.parent = this,
		this.children.push(t),
		t.dispatchEvent("added"),
		t
	},
	e.addChildAt = function (t, e) {
		var i = arguments.length,
		n = arguments[i - 1];
		if (0 > n || n > this.children.length)
			return arguments[i - 2];
		if (i > 2) {
			for (var s = 0; i - 1 > s; s++)
				this.addChildAt(arguments[s], n + s);
			return arguments[i - 2]
		}
		return t.parent && t.parent.removeChild(t),
		t.parent = this,
		this.children.splice(e, 0, t),
		t.dispatchEvent("added"),
		t
	},
	e.removeChild = function (t) {
		var e = arguments.length;
		if (e > 1) {
			for (var i = !0, n = 0; e > n; n++)
				i = i && this.removeChild(arguments[n]);
			return i
		}
		return this.removeChildAt(createjs.indexOf(this.children, t))
	},
	e.removeChildAt = function (t) {
		var e = arguments.length;
		if (e > 1) {
			for (var i = [], n = 0; e > n; n++)
				i[n] = arguments[n];
			i.sort(function (t, e) {
				return e - t
			});
			var s = !0;
			for (n = 0; e > n; n++)
				s = s && this.removeChildAt(i[n]);
			return s
		}
		if (0 > t || t > this.children.length - 1)
			return !1;
		var r = this.children[t];
		return r && (r.parent = null),
		this.children.splice(t, 1),
		r.dispatchEvent("removed"),
		!0
	},
	e.removeAllChildren = function () {
		for (var t = this.children; t.length; )
			this.removeChildAt(0)
	},
	e.getChildAt = function (t) {
		return this.children[t]
	},
	e.getChildByName = function (t) {
		for (var e = this.children, i = 0, n = e.length; n > i; i++)
			if (e[i].name == t)
				return e[i];
		return null
	},
	e.sortChildren = function (t) {
		this.children.sort(t)
	},
	e.getChildIndex = function (t) {
		return createjs.indexOf(this.children, t)
	},
	e.swapChildrenAt = function (t, e) {
		var i = this.children,
		n = i[t],
		s = i[e];
		n && s && (i[t] = s, i[e] = n)
	},
	e.swapChildren = function (t, e) {
		for (var i, n, s = this.children, r = 0, a = s.length; a > r && (s[r] == t && (i = r), s[r] == e && (n = r), null == i || null == n); r++);
		r != a && (s[i] = e, s[n] = t)
	},
	e.setChildIndex = function (t, e) {
		var i = this.children,
		n = i.length;
		if (!(t.parent != this || 0 > e || e >= n)) {
			for (var s = 0; n > s && i[s] != t; s++);
			s != n && s != e && (i.splice(s, 1), i.splice(e, 0, t))
		}
	},
	e.contains = function (t) {
		for (; t; ) {
			if (t == this)
				return !0;
			t = t.parent
		}
		return !1
	},
	e.hitTest = function (t, e) {
		return null != this.getObjectUnderPoint(t, e)
	},
	e.getObjectsUnderPoint = function (t, e, i) {
		var n = [],
		s = this.localToGlobal(t, e);
		return this._getObjectsUnderPoint(s.x, s.y, n, i > 0, 1 == i),
		n
	},
	e.getObjectUnderPoint = function (t, e, i) {
		var n = this.localToGlobal(t, e);
		return this._getObjectsUnderPoint(n.x, n.y, null, i > 0, 1 == i)
	},
	e.getBounds = function () {
		return this._getBounds(null, !0)
	},
	e.getTransformedBounds = function () {
		return this._getBounds()
	},
	e.clone = function (e) {
		var i = this._cloneProps(new t);
		return e && this._cloneChildren(i),
		i
	},
	e.toString = function () {
		return "[Container (name=" + this.name + ")]"
	},
	e._tick = function (t) {
		if (this.tickChildren)
			for (var e = this.children.length - 1; e >= 0; e--) {
				var i = this.children[e];
				i.tickEnabled && i._tick && i._tick(t)
			}
		this.DisplayObject__tick(t)
	},
	e._cloneChildren = function (t) {
		t.children.length && t.removeAllChildren();
		for (var e = t.children, i = 0, n = this.children.length; n > i; i++) {
			var s = this.children[i].clone(!0);
			s.parent = t,
			e.push(s)
		}
	},
	e._getObjectsUnderPoint = function (e, i, n, s, r, a) {
		if (!(a = a || 0) && !this._testMask(this, e, i))
			return null;
		var h,
		o = createjs.DisplayObject._hitTestContext;
		r = r || s && this._hasMouseEventListener();
		for (var c = this.children, l = c.length - 1; l >= 0; l--) {
			var u = c[l],
			d = u.hitArea;
			if (u.visible && (d || u.isVisible()) && (!s || u.mouseEnabled) && (d || this._testMask(u, e, i)))
				if (!d && u instanceof t) {
					var p = u._getObjectsUnderPoint(e, i, n, s, r, a + 1);
					if (!n && p)
						return s && !this.mouseChildren ? this : p
				} else {
					if (s && !r && !u._hasMouseEventListener())
						continue;
					var f = u.getConcatenatedDisplayProps(u._props);
					if (h = f.matrix, d && (h.appendMatrix(d.getMatrix(d._props.matrix)), f.alpha = d.alpha), o.globalAlpha = f.alpha, o.setTransform(h.a, h.b, h.c, h.d, h.tx - e, h.ty - i), (d || u).draw(o), !this._testHit(o))
						continue;
					if (o.setTransform(1, 0, 0, 1, 0, 0), o.clearRect(0, 0, 2, 2), !n)
						return s && !this.mouseChildren ? this : u;
					n.push(u)
				}
		}
		return null
	},
	e._testMask = function (t, e, i) {
		var n = t.mask;
		if (!n || !n.graphics || n.graphics.isEmpty())
			return !0;
		var s = this._props.matrix,
		r = t.parent;
		s = r ? r.getConcatenatedMatrix(s) : s.identity(),
		s = n.getMatrix(n._props.matrix).prependMatrix(s);
		var a = createjs.DisplayObject._hitTestContext;
		return a.setTransform(s.a, s.b, s.c, s.d, s.tx - e, s.ty - i),
		n.graphics.drawAsPath(a),
		a.fillStyle = "#000",
		a.fill(),
		!!this._testHit(a) && (a.setTransform(1, 0, 0, 1, 0, 0), a.clearRect(0, 0, 2, 2), !0)
	},
	e._getBounds = function (t, e) {
		var i = this.DisplayObject_getBounds();
		if (i)
			return this._transformBounds(i, t, e);
		var n = this._props.matrix;
		n = e ? n.identity() : this.getMatrix(n),
		t && n.prependMatrix(t);
		for (var s = this.children.length, r = null, a = 0; s > a; a++) {
			var h = this.children[a];
			h.visible && (i = h._getBounds(n)) && (r ? r.extend(i.x, i.y, i.width, i.height) : r = i.clone())
		}
		return r
	},
	createjs.Container = createjs.promote(t, "DisplayObject")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t) {
		this.Container_constructor(),
		this.autoClear = !0,
		this.canvas = "string" == typeof t ? document.getElementById(t) : t,
		this.mouseX = 0,
		this.mouseY = 0,
		this.drawRect = null,
		this.snapToPixelEnabled = !1,
		this.mouseInBounds = !1,
		this.tickOnUpdate = !0,
		this.mouseMoveOutside = !1,
		this.preventSelection = !0,
		this._pointerData = {},
		this._pointerCount = 0,
		this._primaryPointerID = null,
		this._mouseOverIntervalID = null,
		this._nextStage = null,
		this._prevStage = null,
		this.enableDOMEvents(!0)
	}
	var e = createjs.extend(t, createjs.Container);
	e._get_nextStage = function () {
		return this._nextStage
	},
	e._set_nextStage = function (t) {
		this._nextStage && (this._nextStage._prevStage = null),
		t && (t._prevStage = this),
		this._nextStage = t
	};
	try {
		Object.defineProperties(e, {
			nextStage: {
				get: e._get_nextStage,
				set: e._set_nextStage
			}
		})
	} catch (t) {}
	e.update = function (t) {
		if (this.canvas && (this.tickOnUpdate && this.tick(t), !this.dispatchEvent("drawstart"))) {
			createjs.DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
			var e = this.drawRect,
			i = this.canvas.getContext("2d");
			i.setTransform(1, 0, 0, 1, 0, 0),
			this.autoClear && (e ? i.clearRect(e.x, e.y, e.width, e.height) : i.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)),
			i.save(),
			this.drawRect && (i.beginPath(), i.rect(e.x, e.y, e.width, e.height), i.clip()),
			this.updateContext(i),
			this.draw(i, !1),
			i.restore(),
			this.dispatchEvent("drawend")
		}
	},
	e.tick = function (t) {
		if (this.tickEnabled && !this.dispatchEvent("tickstart")) {
			var e = new createjs.Event("tick");
			if (t)
				for (var i in t)
					t.hasOwnProperty(i) && (e[i] = t[i]);
			this._tick(e),
			this.dispatchEvent("tickend")
		}
	},
	e.handleEvent = function (t) {
		"tick" == t.type && this.update(t)
	},
	e.clear = function () {
		if (this.canvas) {
			var t = this.canvas.getContext("2d");
			t.setTransform(1, 0, 0, 1, 0, 0),
			t.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
		}
	},
	e.toDataURL = function (t, e) {
		var i,
		n = this.canvas.getContext("2d"),
		s = this.canvas.width,
		r = this.canvas.height;
		if (t) {
			i = n.getImageData(0, 0, s, r);
			var a = n.globalCompositeOperation;
			n.globalCompositeOperation = "destination-over",
			n.fillStyle = t,
			n.fillRect(0, 0, s, r)
		}
		var h = this.canvas.toDataURL(e || "image/png");
		return t && (n.putImageData(i, 0, 0), n.globalCompositeOperation = a),
		h
	},
	e.enableMouseOver = function (t) {
		if (this._mouseOverIntervalID && (clearInterval(this._mouseOverIntervalID), this._mouseOverIntervalID = null, 0 == t && this._testMouseOver(!0)), null == t)
			t = 20;
		else if (0 >= t)
			return;
		var e = this;
		this._mouseOverIntervalID = setInterval(function () {
				e._testMouseOver()
			}, 1e3 / Math.min(50, t))
	},
	e.enableDOMEvents = function (t) {
		null == t && (t = !0);
		var e,
		i,
		n = this._eventListeners;
		if (!t && n) {
			for (e in n)
				(i = n[e]).t.removeEventListener(e, i.f, !1);
			this._eventListeners = null
		} else if (t && !n && this.canvas) {
			var s = window.addEventListener ? window : document,
			r = this;
			for (e in(n = this._eventListeners = {}).mouseup = {
					t: s,
					f: function (t) {
						r._handleMouseUp(t)
					}
				}, n.mousemove = {
					t: s,
					f: function (t) {
						r._handleMouseMove(t)
					}
				}, n.dblclick = {
					t: this.canvas,
					f: function (t) {
						r._handleDoubleClick(t)
					}
				}, n.mousedown = {
					t: this.canvas,
					f: function (t) {
						r._handleMouseDown(t)
					}
				}, n)
				(i = n[e]).t.addEventListener(e, i.f, !1)
		}
	},
	e.clone = function () {
		throw "Stage cannot be cloned."
	},
	e.toString = function () {
		return "[Stage (name=" + this.name + ")]"
	},
	e._getElementRect = function (t) {
		var e;
		try {
			e = t.getBoundingClientRect()
		} catch (i) {
			e = {
				top: t.offsetTop,
				left: t.offsetLeft,
				width: t.offsetWidth,
				height: t.offsetHeight
			}
		}
		var i = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0),
		n = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0),
		s = window.getComputedStyle ? getComputedStyle(t, null) : t.currentStyle,
		r = parseInt(s.paddingLeft) + parseInt(s.borderLeftWidth),
		a = parseInt(s.paddingTop) + parseInt(s.borderTopWidth),
		h = parseInt(s.paddingRight) + parseInt(s.borderRightWidth),
		o = parseInt(s.paddingBottom) + parseInt(s.borderBottomWidth);
		return {
			left: e.left + i + r,
			right: e.right + i - h,
			top: e.top + n + a,
			bottom: e.bottom + n - o
		}
	},
	e._getPointerData = function (t) {
		var e = this._pointerData[t];
		return e || (e = this._pointerData[t] = {
				x: 0,
				y: 0
			}),
		e
	},
	e._handleMouseMove = function (t) {
		t || (t = window.event),
		this._handlePointerMove(-1, t, t.pageX, t.pageY)
	},
	e._handlePointerMove = function (t, e, i, n, s) {
		if ((!this._prevStage || void 0 !== s) && this.canvas) {
			var r = this._nextStage,
			a = this._getPointerData(t),
			h = a.inBounds;
			this._updatePointerPosition(t, e, i, n),
			(h || a.inBounds || this.mouseMoveOutside) && (-1 === t && a.inBounds == !h && this._dispatchMouseEvent(this, h ? "mouseleave" : "mouseenter", !1, t, a, e), this._dispatchMouseEvent(this, "stagemousemove", !1, t, a, e), this._dispatchMouseEvent(a.target, "pressmove", !0, t, a, e)),
			r && r._handlePointerMove(t, e, i, n, null)
		}
	},
	e._updatePointerPosition = function (t, e, i, n) {
		var s = this._getElementRect(this.canvas);
		i -= s.left,
		n -= s.top;
		var r = this.canvas.width,
		a = this.canvas.height;
		i /= (s.right - s.left) / r,
		n /= (s.bottom - s.top) / a;
		var h = this._getPointerData(t);
		(h.inBounds = i >= 0 && n >= 0 && r - 1 >= i && a - 1 >= n) ? (h.x = i, h.y = n) : this.mouseMoveOutside && (h.x = 0 > i ? 0 : i > r - 1 ? r - 1 : i, h.y = 0 > n ? 0 : n > a - 1 ? a - 1 : n),
		h.posEvtObj = e,
		h.rawX = i,
		h.rawY = n,
		(t === this._primaryPointerID || -1 === t) && (this.mouseX = h.x, this.mouseY = h.y, this.mouseInBounds = h.inBounds)
	},
	e._handleMouseUp = function (t) {
		this._handlePointerUp(-1, t, !1)
	},
	e._handlePointerUp = function (t, e, i, n) {
		var s = this._nextStage,
		r = this._getPointerData(t);
		if (!this._prevStage || void 0 !== n) {
			r.down && this._dispatchMouseEvent(this, "stagemouseup", !1, t, r, e),
			r.down = !1;
			var a = null,
			h = r.target;
			n || !h && !s || (a = this._getObjectsUnderPoint(r.x, r.y, null, !0)),
			a == h && this._dispatchMouseEvent(h, "click", !0, t, r, e),
			this._dispatchMouseEvent(h, "pressup", !0, t, r, e),
			i ? (t == this._primaryPointerID && (this._primaryPointerID = null), delete this._pointerData[t]) : r.target = null,
			s && s._handlePointerUp(t, e, i, n || a && this)
		}
	},
	e._handleMouseDown = function (t) {
		this._handlePointerDown(-1, t, t.pageX, t.pageY)
	},
	e._handlePointerDown = function (t, e, i, n, s) {
		this.preventSelection && e.preventDefault(),
		(null == this._primaryPointerID || -1 === t) && (this._primaryPointerID = t),
		null != n && this._updatePointerPosition(t, e, i, n);
		var r = null,
		a = this._nextStage,
		h = this._getPointerData(t);
		h.inBounds && (this._dispatchMouseEvent(this, "stagemousedown", !1, t, h, e), h.down = !0),
		s || (r = h.target = this._getObjectsUnderPoint(h.x, h.y, null, !0), this._dispatchMouseEvent(h.target, "mousedown", !0, t, h, e)),
		a && a._handlePointerDown(t, e, i, n, s || r && this)
	},
	e._testMouseOver = function (t, e, i) {
		if (!this._prevStage || void 0 !== e) {
			var n = this._nextStage;
			if (!this._mouseOverIntervalID)
				return void(n && n._testMouseOver(t, e, i));
			var s = this._getPointerData(-1);
			if (s && (t || this.mouseX != this._mouseOverX || this.mouseY != this._mouseOverY || !this.mouseInBounds)) {
				var r,
				a,
				h,
				o = s.posEvtObj,
				c = i || o && o.target == this.canvas,
				l = null,
				u = -1,
				d = "";
				!e && (t || this.mouseInBounds && c) && (l = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, !0), this._mouseOverX = this.mouseX, this._mouseOverY = this.mouseY);
				var p = this._mouseOverTarget || [],
				f = p[p.length - 1],
				g = this._mouseOverTarget = [];
				for (r = l; r; )
					g.unshift(r), null != r.cursor && (d = r.cursor), r = r.parent;
				for (this.canvas.style.cursor = d, !e && i && (i.canvas.style.cursor = d), a = 0, h = g.length; h > a && g[a] == p[a]; a++)
					u = a;
				for (f != l && this._dispatchMouseEvent(f, "mouseout", !0, -1, s, o), a = p.length - 1; a > u; a--)
					this._dispatchMouseEvent(p[a], "rollout", !1, -1, s, o);
				for (a = g.length - 1; a > u; a--)
					this._dispatchMouseEvent(g[a], "rollover", !1, -1, s, o);
				f != l && this._dispatchMouseEvent(l, "mouseover", !0, -1, s, o),
				n && n._testMouseOver(t, e || l && this, i || c && this)
			}
		}
	},
	e._handleDoubleClick = function (t, e) {
		var i = null,
		n = this._nextStage,
		s = this._getPointerData(-1);
		e || (i = this._getObjectsUnderPoint(s.x, s.y, null, !0), this._dispatchMouseEvent(i, "dblclick", !0, -1, s, t)),
		n && n._handleDoubleClick(t, e || i && this)
	},
	e._dispatchMouseEvent = function (t, e, i, n, s, r) {
		if (t && (i || t.hasEventListener(e))) {
			var a = new createjs.MouseEvent(e, i, !1, s.x, s.y, r, n, n === this._primaryPointerID || -1 === n, s.rawX, s.rawY);
			t.dispatchEvent(a)
		}
	},
	createjs.Stage = createjs.promote(t, "Container")
}
(), this.createjs = this.createjs || {}, function () {
	function t(t) {
		this.DisplayObject_constructor(),
		"string" == typeof t ? (this.image = document.createElement("img"), this.image.src = t) : this.image = t,
		this.sourceRect = null
	}
	var e = createjs.extend(t, createjs.DisplayObject);
	e.initialize = t,
	e.isVisible = function () {
		var t = this.cacheCanvas || this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2);
		return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
	},
	e.draw = function (t, e) {
		if (this.DisplayObject_draw(t, e) || !this.image)
			return !0;
		var i = this.image,
		n = this.sourceRect;
		if (n) {
			var s = n.x,
			r = n.y,
			a = s + n.width,
			h = r + n.height,
			o = 0,
			c = 0,
			l = i.width,
			u = i.height;
			0 > s && (o -= s, s = 0),
			a > l && (a = l),
			0 > r && (c -= r, r = 0),
			h > u && (h = u),
			t.drawImage(i, s, r, a - s, h - r, o, c, a - s, h - r)
		} else
			t.drawImage(i, 0, 0);
		return !0
	},
	e.getBounds = function () {
		var t = this.DisplayObject_getBounds();
		if (t)
			return t;
		var e = this.sourceRect || this.image;
		return this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2) ? this._rectangle.setValues(0, 0, e.width, e.height) : null
	},
	e.clone = function () {
		var e = new t(this.image);
		return this.sourceRect && (e.sourceRect = this.sourceRect.clone()),
		this._cloneProps(e),
		e
	},
	e.toString = function () {
		return "[Bitmap (name=" + this.name + ")]"
	},
	createjs.Bitmap = createjs.promote(t, "DisplayObject")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e) {
		this.DisplayObject_constructor(),
		this.currentFrame = 0,
		this.currentAnimation = null,
		this.paused = !0,
		this.spriteSheet = t,
		this.currentAnimationFrame = 0,
		this.framerate = 0,
		this._animation = null,
		this._currentFrame = null,
		this._skipAdvance = !1,
		e && this.gotoAndPlay(e)
	}
	var e = createjs.extend(t, createjs.DisplayObject);
	e.isVisible = function () {
		var t = this.cacheCanvas || this.spriteSheet.complete;
		return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
	},
	e.draw = function (t, e) {
		if (this.DisplayObject_draw(t, e))
			return !0;
		this._normalizeFrame();
		var i = this.spriteSheet.getFrame(0 | this._currentFrame);
		if (!i)
			return !1;
		var n = i.rect;
		return n.width && n.height && t.drawImage(i.image, n.x, n.y, n.width, n.height, -i.regX, -i.regY, n.width, n.height),
		!0
	},
	e.play = function () {
		this.paused = !1
	},
	e.stop = function () {
		this.paused = !0
	},
	e.gotoAndPlay = function (t) {
		this.paused = !1,
		this._skipAdvance = !0,
		this._goto(t)
	},
	e.gotoAndStop = function (t) {
		this.paused = !0,
		this._goto(t)
	},
	e.advance = function (t) {
		var e = this.framerate || this.spriteSheet.framerate,
		i = e && null != t ? t / (1e3 / e) : 1;
		this._normalizeFrame(i)
	},
	e.getBounds = function () {
		return this.DisplayObject_getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle)
	},
	e.clone = function () {
		return this._cloneProps(new t(this.spriteSheet))
	},
	e.toString = function () {
		return "[Sprite (name=" + this.name + ")]"
	},
	e._cloneProps = function (t) {
		return this.DisplayObject__cloneProps(t),
		t.currentFrame = this.currentFrame,
		t.currentAnimation = this.currentAnimation,
		t.paused = this.paused,
		t.currentAnimationFrame = this.currentAnimationFrame,
		t.framerate = this.framerate,
		t._animation = this._animation,
		t._currentFrame = this._currentFrame,
		t._skipAdvance = this._skipAdvance,
		t
	},
	e._tick = function (t) {
		this.paused || (this._skipAdvance || this.advance(t && t.delta), this._skipAdvance = !1),
		this.DisplayObject__tick(t)
	},
	e._normalizeFrame = function (t) {
		t = t || 0;
		var e,
		i = this._animation,
		n = this.paused,
		s = this._currentFrame;
		if (i) {
			var r = i.speed || 1,
			a = this.currentAnimationFrame;
			if (a + t * r >= (e = i.frames.length)) {
				var h = i.next;
				if (this._dispatchAnimationEnd(i, s, n, h, e - 1))
					return;
				if (h)
					return this._goto(h, t - (e - a) / r);
				this.paused = !0,
				a = i.frames.length - 1
			} else
				a += t * r;
			this.currentAnimationFrame = a,
			this._currentFrame = i.frames[0 | a]
		} else if ((s = this._currentFrame += t) >= (e = this.spriteSheet.getNumFrames()) && e > 0 && !this._dispatchAnimationEnd(i, s, n, e - 1) && (this._currentFrame -= e) >= e)
			return this._normalizeFrame();
		s = 0 | this._currentFrame,
		this.currentFrame != s && (this.currentFrame = s, this.dispatchEvent("change"))
	},
	e._dispatchAnimationEnd = function (t, e, i, n, s) {
		var r = t ? t.name : null;
		if (this.hasEventListener("animationend")) {
			var a = new createjs.Event("animationend");
			a.name = r,
			a.next = n,
			this.dispatchEvent(a)
		}
		var h = this._animation != t || this._currentFrame != e;
		return h || i || !this.paused || (this.currentAnimationFrame = s, h = !0),
		h
	},
	e._goto = function (t, e) {
		if (this.currentAnimationFrame = 0, isNaN(t)) {
			var i = this.spriteSheet.getAnimation(t);
			i && (this._animation = i, this.currentAnimation = t, this._normalizeFrame(e))
		} else
			this.currentAnimation = this._animation = null, this._currentFrame = t, this._normalizeFrame()
	},
	createjs.Sprite = createjs.promote(t, "DisplayObject")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t) {
		this.DisplayObject_constructor(),
		this.graphics = t || new createjs.Graphics
	}
	var e = createjs.extend(t, createjs.DisplayObject);
	e.isVisible = function () {
		var t = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
		return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
	},
	e.draw = function (t, e) {
		return !!this.DisplayObject_draw(t, e) || (this.graphics.draw(t, this), !0)
	},
	e.clone = function (e) {
		var i = e && this.graphics ? this.graphics.clone() : this.graphics;
		return this._cloneProps(new t(i))
	},
	e.toString = function () {
		return "[Shape (name=" + this.name + ")]"
	},
	createjs.Shape = createjs.promote(t, "DisplayObject")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i) {
		this.DisplayObject_constructor(),
		this.text = t,
		this.font = e,
		this.color = i,
		this.textAlign = "left",
		this.textBaseline = "top",
		this.maxWidth = null,
		this.outline = 0,
		this.lineHeight = 0,
		this.lineWidth = null
	}
	var e = createjs.extend(t, createjs.DisplayObject),
	i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
	i.getContext && (t._workingContext = i.getContext("2d"), i.width = i.height = 1),
	t.H_OFFSETS = {
		start: 0,
		left: 0,
		center:  - .5,
		end: -1,
		right: -1
	},
	t.V_OFFSETS = {
		top: 0,
		hanging:  - .01,
		middle:  - .4,
		alphabetic:  - .8,
		ideographic:  - .85,
		bottom: -1
	},
	e.isVisible = function () {
		var t = this.cacheCanvas || null != this.text && "" !== this.text;
		return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
	},
	e.draw = function (t, e) {
		if (this.DisplayObject_draw(t, e))
			return !0;
		var i = this.color || "#000";
		return this.outline ? (t.strokeStyle = i, t.lineWidth = 1 * this.outline) : t.fillStyle = i,
		this._drawText(this._prepContext(t)),
		!0
	},
	e.getMeasuredWidth = function () {
		return this._getMeasuredWidth(this.text)
	},
	e.getMeasuredLineHeight = function () {
		return 1.2 * this._getMeasuredWidth("M")
	},
	e.getMeasuredHeight = function () {
		return this._drawText(null, {}).height
	},
	e.getBounds = function () {
		var e = this.DisplayObject_getBounds();
		if (e)
			return e;
		if (null == this.text || "" == this.text)
			return null;
		var i = this._drawText(null, {}),
		n = this.maxWidth && this.maxWidth < i.width ? this.maxWidth : i.width,
		s = n * t.H_OFFSETS[this.textAlign || "left"],
		r = (this.lineHeight || this.getMeasuredLineHeight()) * t.V_OFFSETS[this.textBaseline || "top"];
		return this._rectangle.setValues(s, r, n, i.height)
	},
	e.getMetrics = function () {
		var e = {
			lines: []
		};
		return e.lineHeight = this.lineHeight || this.getMeasuredLineHeight(),
		e.vOffset = e.lineHeight * t.V_OFFSETS[this.textBaseline || "top"],
		this._drawText(null, e, e.lines)
	},
	e.clone = function () {
		return this._cloneProps(new t(this.text, this.font, this.color))
	},
	e.toString = function () {
		return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
	},
	e._cloneProps = function (t) {
		return this.DisplayObject__cloneProps(t),
		t.textAlign = this.textAlign,
		t.textBaseline = this.textBaseline,
		t.maxWidth = this.maxWidth,
		t.outline = this.outline,
		t.lineHeight = this.lineHeight,
		t.lineWidth = this.lineWidth,
		t
	},
	e._prepContext = function (t) {
		return t.font = this.font || "10px sans-serif",
		t.textAlign = this.textAlign || "left",
		t.textBaseline = this.textBaseline || "top",
		t
	},
	e._drawText = function (e, i, n) {
		var s = !!e;
		s || ((e = t._workingContext).save(), this._prepContext(e));
		for (var r = this.lineHeight || this.getMeasuredLineHeight(), a = 0, h = 0, o = String(this.text).split(/(?:\r\n|\r|\n)/), c = 0, l = o.length; l > c; c++) {
			var u = o[c],
			d = null;
			if (null != this.lineWidth && (d = e.measureText(u).width) > this.lineWidth) {
				var p = u.split(/(\s)/);
				u = p[0],
				d = e.measureText(u).width;
				for (var f = 1, g = p.length; g > f; f += 2) {
					var _ = e.measureText(p[f] + p[f + 1]).width;
					d + _ > this.lineWidth ? (s && this._drawTextLine(e, u, h * r), n && n.push(u), d > a && (a = d), u = p[f + 1], d = e.measureText(u).width, h++) : (u += p[f] + p[f + 1], d += _)
				}
			}
			s && this._drawTextLine(e, u, h * r),
			n && n.push(u),
			i && null == d && (d = e.measureText(u).width),
			d > a && (a = d),
			h++
		}
		return i && (i.width = a, i.height = h * r),
		s || e.restore(),
		i
	},
	e._drawTextLine = function (t, e, i) {
		this.outline ? t.strokeText(e, 0, i, this.maxWidth || 65535) : t.fillText(e, 0, i, this.maxWidth || 65535)
	},
	e._getMeasuredWidth = function (e) {
		var i = t._workingContext;
		i.save();
		var n = this._prepContext(i).measureText(e).width;
		return i.restore(),
		n
	},
	createjs.Text = createjs.promote(t, "DisplayObject")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e) {
		this.Container_constructor(),
		this.text = t || "",
		this.spriteSheet = e,
		this.lineHeight = 0,
		this.letterSpacing = 0,
		this.spaceWidth = 0,
		this._oldProps = {
			text: 0,
			spriteSheet: 0,
			lineHeight: 0,
			letterSpacing: 0,
			spaceWidth: 0
		}
	}
	var e = createjs.extend(t, createjs.Container);
	t.maxPoolSize = 100,
	t._spritePool = [],
	e.draw = function (t, e) {
		this.DisplayObject_draw(t, e) || (this._updateText(), this.Container_draw(t, e))
	},
	e.getBounds = function () {
		return this._updateText(),
		this.Container_getBounds()
	},
	e.isVisible = function () {
		var t = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
		return !!(this.visible && this.alpha > 0 && 0 !== this.scaleX && 0 !== this.scaleY && t)
	},
	e.clone = function () {
		return this._cloneProps(new t(this.text, this.spriteSheet))
	},
	e.addChild = e.addChildAt = e.removeChild = e.removeChildAt = e.removeAllChildren = function () {},
	e._cloneProps = function (t) {
		return this.DisplayObject__cloneProps(t),
		t.lineHeight = this.lineHeight,
		t.letterSpacing = this.letterSpacing,
		t.spaceWidth = this.spaceWidth,
		t
	},
	e._getFrameIndex = function (t, e) {
		var i,
		n = e.getAnimation(t);
		return n || (t != (i = t.toUpperCase()) || t != (i = t.toLowerCase()) || (i = null), i && (n = e.getAnimation(i))),
		n && n.frames[0]
	},
	e._getFrame = function (t, e) {
		var i = this._getFrameIndex(t, e);
		return null == i ? i : e.getFrame(i)
	},
	e._getLineHeight = function (t) {
		var e = this._getFrame("1", t) || this._getFrame("T", t) || this._getFrame("L", t) || t.getFrame(0);
		return e ? e.rect.height : 1
	},
	e._getSpaceWidth = function (t) {
		var e = this._getFrame("1", t) || this._getFrame("l", t) || this._getFrame("e", t) || this._getFrame("a", t) || t.getFrame(0);
		return e ? e.rect.width : 1
	},
	e._updateText = function () {
		var e,
		i = 0,
		n = 0,
		s = this._oldProps,
		r = !1,
		a = this.spaceWidth,
		h = this.lineHeight,
		o = this.spriteSheet,
		c = t._spritePool,
		l = this.children,
		u = 0,
		d = l.length;
		for (var p in s)
			s[p] != this[p] && (s[p] = this[p], r = !0);
		if (r) {
			var f = !!this._getFrame(" ", o);
			f || a || (a = this._getSpaceWidth(o)),
			h || (h = this._getLineHeight(o));
			for (var g = 0, _ = this.text.length; _ > g; g++) {
				var m = this.text.charAt(g);
				if (" " != m || f)
					if ("\n" != m && "\r" != m) {
						var v = this._getFrameIndex(m, o);
						null != v && (d > u ? e = l[u] : (l.push(e = c.length ? c.pop() : new createjs.Sprite), e.parent = this, d++), e.spriteSheet = o, e.gotoAndStop(v), e.x = i, e.y = n, u++, i += e.getBounds().width + this.letterSpacing)
					} else
						"\r" == m && "\n" == this.text.charAt(g + 1) && g++, i = 0, n += h;
				else
					i += a
			}
			for (; d > u; )
				c.push(e = l.pop()), e.parent = null, d--;
			c.length > t.maxPoolSize && (c.length = t.maxPoolSize)
		}
	},
	createjs.BitmapText = createjs.promote(t, "Container")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		throw "SpriteSheetUtils cannot be instantiated"
	}
	var e = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
	e.getContext && (t._workingCanvas = e, t._workingContext = e.getContext("2d"), e.width = e.height = 1),
	t.addFlippedFrames = function (e, i, n, s) {
		if (i || n || s) {
			var r = 0;
			i && t._flip(e, ++r, !0, !1),
			n && t._flip(e, ++r, !1, !0),
			s && t._flip(e, ++r, !0, !0)
		}
	},
	t.extractFrame = function (e, i) {
		isNaN(i) && (i = e.getAnimation(i).frames[0]);
		var n = e.getFrame(i);
		if (!n)
			return null;
		var s = n.rect,
		r = t._workingCanvas;
		r.width = s.width,
		r.height = s.height,
		t._workingContext.drawImage(n.image, s.x, s.y, s.width, s.height, 0, 0, s.width, s.height);
		var a = document.createElement("img");
		return a.src = r.toDataURL("image/png"),
		a
	},
	t.mergeAlpha = function (t, e, i) {
		i || (i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")),
		i.width = Math.max(e.width, t.width),
		i.height = Math.max(e.height, t.height);
		var n = i.getContext("2d");
		return n.save(),
		n.drawImage(t, 0, 0),
		n.globalCompositeOperation = "destination-in",
		n.drawImage(e, 0, 0),
		n.restore(),
		i
	},
	t._flip = function (e, i, n, s) {
		for (var r = e._images, a = t._workingCanvas, h = t._workingContext, o = r.length / i, c = 0; o > c; c++) {
			var l = r[c];
			l.__tmp = c,
			h.setTransform(1, 0, 0, 1, 0, 0),
			h.clearRect(0, 0, a.width + 1, a.height + 1),
			a.width = l.width,
			a.height = l.height,
			h.setTransform(n ? -1 : 1, 0, 0, s ? -1 : 1, n ? l.width : 0, s ? l.height : 0),
			h.drawImage(l, 0, 0);
			var u = document.createElement("img");
			u.src = a.toDataURL("image/png"),
			u.width = l.width,
			u.height = l.height,
			r.push(u)
		}
		var d = e._frames,
		p = d.length / i;
		for (c = 0; p > c; c++) {
			var f = (l = d[c]).rect.clone(),
			g = {
				image: u = r[l.image.__tmp + o * i],
				rect: f,
				regX: l.regX,
				regY: l.regY
			};
			n && (f.x = u.width - f.x - f.width, g.regX = f.width - l.regX),
			s && (f.y = u.height - f.y - f.height, g.regY = f.height - l.regY),
			d.push(g)
		}
		var _ = "_" + (n ? "h" : "") + (s ? "v" : ""),
		m = e._animations,
		v = e._data,
		x = m.length / i;
		for (c = 0; x > c; c++) {
			var y = m[c],
			w = {
				name: y + _,
				speed: (l = v[y]).speed,
				next: l.next,
				frames: []
			};
			l.next && (w.next += _);
			for (var b = 0, M = (d = l.frames).length; M > b; b++)
				w.frames.push(d[b] + p * i);
			v[w.name] = w,
			m.push(w.name)
		}
	},
	createjs.SpriteSheetUtils = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		this.EventDispatcher_constructor(),
		this.maxWidth = 2048,
		this.maxHeight = 2048,
		this.spriteSheet = null,
		this.scale = 1,
		this.padding = 1,
		this.timeSlice = .3,
		this.progress = -1,
		this._frames = [],
		this._animations = {},
		this._data = null,
		this._nextFrameIndex = 0,
		this._index = 0,
		this._timerID = null,
		this._scale = 1
	}
	var e = createjs.extend(t, createjs.EventDispatcher);
	t.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions",
	t.ERR_RUNNING = "a build is already running",
	e.addFrame = function (e, i, n, s, r) {
		if (this._data)
			throw t.ERR_RUNNING;
		var a = i || e.bounds || e.nominalBounds;
		return !a && e.getBounds && (a = e.getBounds()),
		a ? (n = n || 1, this._frames.push({
				source: e,
				sourceRect: a,
				scale: n,
				funct: s,
				data: r,
				index: this._frames.length,
				height: a.height * n
			}) - 1) : null
	},
	e.addAnimation = function (e, i, n, s) {
		if (this._data)
			throw t.ERR_RUNNING;
		this._animations[e] = {
			frames: i,
			next: n,
			frequency: s
		}
	},
	e.addMovieClip = function (e, i, n, s, r, a) {
		if (this._data)
			throw t.ERR_RUNNING;
		var h = e.frameBounds,
		o = i || e.bounds || e.nominalBounds;
		if (!o && e.getBounds && (o = e.getBounds()), o || h) {
			var c,
			l,
			u = this._frames.length,
			d = e.timeline.duration;
			for (c = 0; d > c; c++) {
				var p = h && h[c] ? h[c] : o;
				this.addFrame(e, p, n, this._setupMovieClipFrame, {
					i: c,
					f: s,
					d: r
				})
			}
			var f = e.timeline._labels,
			g = [];
			for (var _ in f)
				g.push({
					index: f[_],
					label: _
				});
			if (g.length)
				for (g.sort(function (t, e) {
						return t.index - e.index
					}), c = 0, l = g.length; l > c; c++) {
					for (var m = g[c].label, v = u + g[c].index, x = u + (c == l - 1 ? d : g[c + 1].index), y = [], w = v; x > w; w++)
						y.push(w);
					(!a || (m = a(m, e, v, x))) && this.addAnimation(m, y, !0)
				}
		}
	},
	e.build = function () {
		if (this._data)
			throw t.ERR_RUNNING;
		for (this._startBuild(); this._drawNext(); );
		return this._endBuild(),
		this.spriteSheet
	},
	e.buildAsync = function (e) {
		if (this._data)
			throw t.ERR_RUNNING;
		this.timeSlice = e,
		this._startBuild();
		var i = this;
		this._timerID = setTimeout(function () {
				i._run()
			}, 50 - 50 * Math.max(.01, Math.min(.99, this.timeSlice || .3)))
	},
	e.stopAsync = function () {
		clearTimeout(this._timerID),
		this._data = null
	},
	e.clone = function () {
		throw "SpriteSheetBuilder cannot be cloned."
	},
	e.toString = function () {
		return "[SpriteSheetBuilder]"
	},
	e._startBuild = function () {
		var e = this.padding || 0;
		this.progress = 0,
		this.spriteSheet = null,
		this._index = 0,
		this._scale = this.scale;
		var i = [];
		this._data = {
			images: [],
			frames: i,
			animations: this._animations
		};
		var n = this._frames.slice();
		if (n.sort(function (t, e) {
				return t.height <= e.height ? -1 : 1
			}), n[n.length - 1].height + 2 * e > this.maxHeight)
			throw t.ERR_DIMENSIONS;
		for (var s = 0, r = 0, a = 0; n.length; ) {
			var h = this._fillRow(n, s, a, i, e);
			if (h.w > r && (r = h.w), s += h.h, !h.h || !n.length) {
				var o = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
				o.width = this._getSize(r, this.maxWidth),
				o.height = this._getSize(s, this.maxHeight),
				this._data.images[a] = o,
				h.h || (r = s = 0, a++)
			}
		}
	},
	e._setupMovieClipFrame = function (t, e) {
		var i = t.actionsEnabled;
		t.actionsEnabled = !1,
		t.gotoAndStop(e.i),
		t.actionsEnabled = i,
		e.f && e.f(t, e.d, e.i)
	},
	e._getSize = function (t, e) {
		for (var i = 4; Math.pow(2, ++i) < t; );
		return Math.min(e, Math.pow(2, i))
	},
	e._fillRow = function (e, i, n, s, r) {
		for (var a = this.maxWidth, h = this.maxHeight - (i += r), o = r, c = 0, l = e.length - 1; l >= 0; l--) {
			var u = e[l],
			d = this._scale * u.scale,
			p = u.sourceRect,
			f = u.source,
			g = Math.floor(d * p.x - r),
			_ = Math.floor(d * p.y - r),
			m = Math.ceil(d * p.height + 2 * r),
			v = Math.ceil(d * p.width + 2 * r);
			if (v > a)
				throw t.ERR_DIMENSIONS;
			m > h || o + v > a || (u.img = n, u.rect = new createjs.Rectangle(o, i, v, m), c = c || m, e.splice(l, 1), s[u.index] = [o, i, v, m, n, Math.round(-g + d * f.regX - r), Math.round(-_ + d * f.regY - r)], o += v)
		}
		return {
			w: o,
			h: c
		}
	},
	e._endBuild = function () {
		this.spriteSheet = new createjs.SpriteSheet(this._data),
		this._data = null,
		this.progress = 1,
		this.dispatchEvent("complete")
	},
	e._run = function () {
		for (var t = 50 * Math.max(.01, Math.min(.99, this.timeSlice || .3)), e = (new Date).getTime() + t, i = !1; e > (new Date).getTime(); )
			if (!this._drawNext()) {
				i = !0;
				break
			}
		if (i)
			this._endBuild();
		else {
			var n = this;
			this._timerID = setTimeout(function () {
					n._run()
				}, 50 - t)
		}
		var s = this.progress = this._index / this._frames.length;
		if (this.hasEventListener("progress")) {
			var r = new createjs.Event("progress");
			r.progress = s,
			this.dispatchEvent(r)
		}
	},
	e._drawNext = function () {
		var t = this._frames[this._index],
		e = t.scale * this._scale,
		i = t.rect,
		n = t.sourceRect,
		s = this._data.images[t.img].getContext("2d");
		return t.funct && t.funct(t.source, t.data),
		s.save(),
		s.beginPath(),
		s.rect(i.x, i.y, i.width, i.height),
		s.clip(),
		s.translate(Math.ceil(i.x - n.x * e), Math.ceil(i.y - n.y * e)),
		s.scale(e, e),
		t.source.draw(s),
		s.restore(),
		++this._index < this._frames.length
	},
	createjs.SpriteSheetBuilder = createjs.promote(t, "EventDispatcher")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t) {
		this.DisplayObject_constructor(),
		"string" == typeof t && (t = document.getElementById(t)),
		this.mouseEnabled = !1;
		var e = t.style;
		e.position = "absolute",
		e.transformOrigin = e.WebkitTransformOrigin = e.msTransformOrigin = e.MozTransformOrigin = e.OTransformOrigin = "0% 0%",
		this.htmlElement = t,
		this._oldProps = null
	}
	var e = createjs.extend(t, createjs.DisplayObject);
	e.isVisible = function () {
		return null != this.htmlElement
	},
	e.draw = function () {
		return !0
	},
	e.cache = function () {},
	e.uncache = function () {},
	e.updateCache = function () {},
	e.hitTest = function () {},
	e.localToGlobal = function () {},
	e.globalToLocal = function () {},
	e.localToLocal = function () {},
	e.clone = function () {
		throw "DOMElement cannot be cloned."
	},
	e.toString = function () {
		return "[DOMElement (name=" + this.name + ")]"
	},
	e._tick = function (t) {
		var e = this.getStage();
		e && e.on("drawend", this._handleDrawEnd, this, !0),
		this.DisplayObject__tick(t)
	},
	e._handleDrawEnd = function () {
		var t = this.htmlElement;
		if (t) {
			var e = t.style,
			i = this.getConcatenatedDisplayProps(this._props),
			n = i.matrix,
			s = i.visible ? "visible" : "hidden";
			if (s != e.visibility && (e.visibility = s), i.visible) {
				var r = this._oldProps,
				a = r && r.matrix,
				h = 1e4;
				if (!a || !a.equals(n)) {
					var o = "matrix(" + (n.a * h | 0) / h + "," + (n.b * h | 0) / h + "," + (n.c * h | 0) / h + "," + (n.d * h | 0) / h + "," + (n.tx + .5 | 0);
					e.transform = e.WebkitTransform = e.OTransform = e.msTransform = o + "," + (n.ty + .5 | 0) + ")",
					e.MozTransform = o + "px," + (n.ty + .5 | 0) + "px)",
					r || (r = this._oldProps = new createjs.DisplayProps(!0, NaN)),
					r.matrix.copy(n)
				}
				r.alpha != i.alpha && (e.opacity = "" + (i.alpha * h | 0) / h, r.alpha = i.alpha)
			}
		}
	},
	createjs.DOMElement = createjs.promote(t, "DisplayObject")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {}
	var e = t.prototype;
	e.getBounds = function (t) {
		return t
	},
	e.applyFilter = function (t, e, i, n, s, r, a, h) {
		r = r || t,
		null == a && (a = e),
		null == h && (h = i);
		try {
			var o = t.getImageData(e, i, n, s)
		} catch (t) {
			return !1
		}
		return !!this._applyFilter(o) && (r.putImageData(o, a, h), !0)
	},
	e.toString = function () {
		return "[Filter]"
	},
	e.clone = function () {
		return new t
	},
	e._applyFilter = function () {
		return !0
	},
	createjs.Filter = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i) {
		(isNaN(t) || 0 > t) && (t = 0),
		(isNaN(e) || 0 > e) && (e = 0),
		(isNaN(i) || 1 > i) && (i = 1),
		this.blurX = 0 | t,
		this.blurY = 0 | e,
		this.quality = 0 | i
	}
	var e = createjs.extend(t, createjs.Filter);
	t.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1],
	t.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9],
	e.getBounds = function (t) {
		var e = 0 | this.blurX,
		i = 0 | this.blurY;
		if (0 >= e && 0 >= i)
			return t;
		var n = Math.pow(this.quality, .2);
		return (t || new createjs.Rectangle).pad(e * n + 1, i * n + 1, e * n + 1, i * n + 1)
	},
	e.clone = function () {
		return new t(this.blurX, this.blurY, this.quality)
	},
	e.toString = function () {
		return "[BlurFilter]"
	},
	e._applyFilter = function (e) {
		var i = this.blurX >> 1;
		if (isNaN(i) || 0 > i)
			return !1;
		var n = this.blurY >> 1;
		if (isNaN(n) || 0 > n)
			return !1;
		if (0 == i && 0 == n)
			return !1;
		var s = this.quality;
		(isNaN(s) || 1 > s) && (s = 1),
		(s |= 0) > 3 && (s = 3),
		1 > s && (s = 1);
		var r = e.data,
		a = 0,
		h = 0,
		o = 0,
		c = 0,
		l = 0,
		u = 0,
		d = 0,
		p = 0,
		f = 0,
		g = 0,
		_ = 0,
		m = 0,
		v = 0,
		x = 0,
		y = 0,
		w = i + i + 1 | 0,
		b = n + n + 1 | 0,
		M = 0 | e.width,
		T = 0 | e.height,
		E = M - 1 | 0,
		S = T - 1 | 0,
		j = i + 1 | 0,
		C = n + 1 | 0,
		D = {
			r: 0,
			b: 0,
			g: 0,
			a: 0
		},
		L = D;
		for (o = 1; w > o; o++)
			L = L.n = {
				r: 0,
				b: 0,
				g: 0,
				a: 0
			};
		L.n = D;
		var O = {
			r: 0,
			b: 0,
			g: 0,
			a: 0
		},
		P = O;
		for (o = 1; b > o; o++)
			P = P.n = {
				r: 0,
				b: 0,
				g: 0,
				a: 0
			};
		P.n = O;
		for (var I = null, k = 0 | t.MUL_TABLE[i], A = 0 | t.SHG_TABLE[i], F = 0 | t.MUL_TABLE[n], R = 0 | t.SHG_TABLE[n]; s-- > 0; ) {
			d = u = 0;
			var B = k,
			H = A;
			for (h = T; --h > -1; ) {
				for (p = j * (m = r[0 | u]), f = j * (v = r[u + 1 | 0]), g = j * (x = r[u + 2 | 0]), _ = j * (y = r[u + 3 | 0]), L = D, o = j; --o > -1; )
					L.r = m, L.g = v, L.b = x, L.a = y, L = L.n;
				for (o = 1; j > o; o++)
					c = u + ((o > E ? E : o) << 2) | 0, p += L.r = r[c], f += L.g = r[c + 1], g += L.b = r[c + 2], _ += L.a = r[c + 3], L = L.n;
				for (I = D, a = 0; M > a; a++)
					r[u++] = p * B >>> H, r[u++] = f * B >>> H, r[u++] = g * B >>> H, r[u++] = _ * B >>> H, c = d + ((c = a + i + 1) < E ? c : E) << 2, p -= I.r - (I.r = r[c]), f -= I.g - (I.g = r[c + 1]), g -= I.b - (I.b = r[c + 2]), _ -= I.a - (I.a = r[c + 3]), I = I.n;
				d += M
			}
			for (B = F, H = R, a = 0; M > a; a++) {
				for (p = C * (m = r[u = a << 2 | 0]) | 0, f = C * (v = r[u + 1 | 0]) | 0, g = C * (x = r[u + 2 | 0]) | 0, _ = C * (y = r[u + 3 | 0]) | 0, P = O, o = 0; C > o; o++)
					P.r = m, P.g = v, P.b = x, P.a = y, P = P.n;
				for (l = M, o = 1; n >= o; o++)
					u = l + a << 2, p += P.r = r[u], f += P.g = r[u + 1], g += P.b = r[u + 2], _ += P.a = r[u + 3], P = P.n, S > o && (l += M);
				if (u = a, I = O, s > 0)
					for (h = 0; T > h; h++)
						r[(c = u << 2) + 3] = y = _ * B >>> H, y > 0 ? (r[c] = p * B >>> H, r[c + 1] = f * B >>> H, r[c + 2] = g * B >>> H) : r[c] = r[c + 1] = r[c + 2] = 0, c = a + ((c = h + C) < S ? c : S) * M << 2, p -= I.r - (I.r = r[c]), f -= I.g - (I.g = r[c + 1]), g -= I.b - (I.b = r[c + 2]), _ -= I.a - (I.a = r[c + 3]), I = I.n, u += M;
				else
					for (h = 0; T > h; h++)
						r[(c = u << 2) + 3] = y = _ * B >>> H, y > 0 ? (y = 255 / y, r[c] = (p * B >>> H) * y, r[c + 1] = (f * B >>> H) * y, r[c + 2] = (g * B >>> H) * y) : r[c] = r[c + 1] = r[c + 2] = 0, c = a + ((c = h + C) < S ? c : S) * M << 2, p -= I.r - (I.r = r[c]), f -= I.g - (I.g = r[c + 1]), g -= I.b - (I.b = r[c + 2]), _ -= I.a - (I.a = r[c + 3]), I = I.n, u += M
			}
		}
		return !0
	},
	createjs.BlurFilter = createjs.promote(t, "Filter")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t) {
		this.alphaMap = t,
		this._alphaMap = null,
		this._mapData = null
	}
	var e = createjs.extend(t, createjs.Filter);
	e.clone = function () {
		var e = new t(this.alphaMap);
		return e._alphaMap = this._alphaMap,
		e._mapData = this._mapData,
		e
	},
	e.toString = function () {
		return "[AlphaMapFilter]"
	},
	e._applyFilter = function (t) {
		if (!this.alphaMap)
			return !0;
		if (!this._prepAlphaMap())
			return !1;
		for (var e = t.data, i = this._mapData, n = 0, s = e.length; s > n; n += 4)
			e[n + 3] = i[n] || 0;
		return !0
	},
	e._prepAlphaMap = function () {
		if (!this.alphaMap)
			return !1;
		if (this.alphaMap == this._alphaMap && this._mapData)
			return !0;
		this._mapData = null;
		var t,
		e = this._alphaMap = this.alphaMap,
		i = e;
		e instanceof HTMLCanvasElement ? t = i.getContext("2d") : ((i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")).width = e.width, i.height = e.height, (t = i.getContext("2d")).drawImage(e, 0, 0));
		try {
			var n = t.getImageData(0, 0, e.width, e.height)
		} catch (t) {
			return !1
		}
		return this._mapData = n.data,
		!0
	},
	createjs.AlphaMapFilter = createjs.promote(t, "Filter")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t) {
		this.mask = t
	}
	var e = createjs.extend(t, createjs.Filter);
	e.applyFilter = function (t, e, i, n, s, r, a, h) {
		return !this.mask || (r = r || t, null == a && (a = e), null == h && (h = i), r.save(), t == r && (r.globalCompositeOperation = "destination-in", r.drawImage(this.mask, a, h), r.restore(), !0))
	},
	e.clone = function () {
		return new t(this.mask)
	},
	e.toString = function () {
		return "[AlphaMaskFilter]"
	},
	createjs.AlphaMaskFilter = createjs.promote(t, "Filter")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n, s, r, a, h) {
		this.redMultiplier = null != t ? t : 1,
		this.greenMultiplier = null != e ? e : 1,
		this.blueMultiplier = null != i ? i : 1,
		this.alphaMultiplier = null != n ? n : 1,
		this.redOffset = s || 0,
		this.greenOffset = r || 0,
		this.blueOffset = a || 0,
		this.alphaOffset = h || 0
	}
	var e = createjs.extend(t, createjs.Filter);
	e.toString = function () {
		return "[ColorFilter]"
	},
	e.clone = function () {
		return new t(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset)
	},
	e._applyFilter = function (t) {
		for (var e = t.data, i = e.length, n = 0; i > n; n += 4)
			e[n] = e[n] * this.redMultiplier + this.redOffset, e[n + 1] = e[n + 1] * this.greenMultiplier + this.greenOffset, e[n + 2] = e[n + 2] * this.blueMultiplier + this.blueOffset, e[n + 3] = e[n + 3] * this.alphaMultiplier + this.alphaOffset;
		return !0
	},
	createjs.ColorFilter = createjs.promote(t, "Filter")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t, e, i, n) {
		this.setColor(t, e, i, n)
	}
	var e = t.prototype;
	t.DELTA_INDEX = [0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10],
	t.IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	t.LENGTH = t.IDENTITY_MATRIX.length,
	e.setColor = function (t, e, i, n) {
		return this.reset().adjustColor(t, e, i, n)
	},
	e.reset = function () {
		return this.copy(t.IDENTITY_MATRIX)
	},
	e.adjustColor = function (t, e, i, n) {
		return this.adjustHue(n),
		this.adjustContrast(e),
		this.adjustBrightness(t),
		this.adjustSaturation(i)
	},
	e.adjustBrightness = function (t) {
		return 0 == t || isNaN(t) ? this : (t = this._cleanValue(t, 255), this._multiplyMatrix([1, 0, 0, 0, t, 0, 1, 0, 0, t, 0, 0, 1, 0, t, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this)
	},
	e.adjustContrast = function (e) {
		return 0 == e || isNaN(e) ? this : (0 > (e = this._cleanValue(e, 100)) ? i = 127 + e / 100 * 127 : i = 127 * (i = 0 == (i = e % 1) ? t.DELTA_INDEX[e] : t.DELTA_INDEX[e << 0] * (1 - i) + t.DELTA_INDEX[1 + (e << 0)] * i) + 127, this._multiplyMatrix([i / 127, 0, 0, 0, .5 * (127 - i), 0, i / 127, 0, 0, .5 * (127 - i), 0, 0, i / 127, 0, .5 * (127 - i), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this);
		var i
	},
	e.adjustSaturation = function (t) {
		if (0 == t || isNaN(t))
			return this;
		var e = 1 + ((t = this._cleanValue(t, 100)) > 0 ? 3 * t / 100 : t / 100);
		return this._multiplyMatrix([.3086 * (1 - e) + e, .6094 * (1 - e), .082 * (1 - e), 0, 0, .3086 * (1 - e), .6094 * (1 - e) + e, .082 * (1 - e), 0, 0, .3086 * (1 - e), .6094 * (1 - e), .082 * (1 - e) + e, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
		this
	},
	e.adjustHue = function (t) {
		if (0 == t || isNaN(t))
			return this;
		t = this._cleanValue(t, 180) / 180 * Math.PI;
		var e = Math.cos(t),
		i = Math.sin(t),
		n = .213,
		s = .715,
		r = .072;
		return this._multiplyMatrix([n + .787 * e + i * -n, s + e * -s + i * -s, r + e * -r + .928 * i, 0, 0, n + e * -n + .143 * i, s + e * (1 - s) + .14 * i, r + e * -r +  - .283 * i, 0, 0, n + e * -n +  - .787 * i, s + e * -s + i * s, r + .928 * e + i * r, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
		this
	},
	e.concat = function (e) {
		return (e = this._fixMatrix(e)).length != t.LENGTH ? this : (this._multiplyMatrix(e), this)
	},
	e.clone = function () {
		return (new t).copy(this)
	},
	e.toArray = function () {
		for (var e = [], i = 0, n = t.LENGTH; n > i; i++)
			e[i] = this[i];
		return e
	},
	e.copy = function (e) {
		for (var i = t.LENGTH, n = 0; i > n; n++)
			this[n] = e[n];
		return this
	},
	e.toString = function () {
		return "[ColorMatrix]"
	},
	e._multiplyMatrix = function (t) {
		var e,
		i,
		n,
		s = [];
		for (e = 0; 5 > e; e++) {
			for (i = 0; 5 > i; i++)
				s[i] = this[i + 5 * e];
			for (i = 0; 5 > i; i++) {
				var r = 0;
				for (n = 0; 5 > n; n++)
					r += t[i + 5 * n] * s[n];
				this[i + 5 * e] = r
			}
		}
	},
	e._cleanValue = function (t, e) {
		return Math.min(e, Math.max(-e, t))
	},
	e._fixMatrix = function (e) {
		return e instanceof t && (e = e.toArray()),
		e.length < t.LENGTH ? e = e.slice(0, e.length).concat(t.IDENTITY_MATRIX.slice(e.length, t.LENGTH)) : e.length > t.LENGTH && (e = e.slice(0, t.LENGTH)),
		e
	},
	createjs.ColorMatrix = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t(t) {
		this.matrix = t
	}
	var e = createjs.extend(t, createjs.Filter);
	e.toString = function () {
		return "[ColorMatrixFilter]"
	},
	e.clone = function () {
		return new t(this.matrix)
	},
	e._applyFilter = function (t) {
		for (var e, i, n, s, r = t.data, a = r.length, h = this.matrix, o = h[0], c = h[1], l = h[2], u = h[3], d = h[4], p = h[5], f = h[6], g = h[7], _ = h[8], m = h[9], v = h[10], x = h[11], y = h[12], w = h[13], b = h[14], M = h[15], T = h[16], E = h[17], S = h[18], j = h[19], C = 0; a > C; C += 4)
			e = r[C], i = r[C + 1], n = r[C + 2], s = r[C + 3], r[C] = e * o + i * c + n * l + s * u + d, r[C + 1] = e * p + i * f + n * g + s * _ + m, r[C + 2] = e * v + i * x + n * y + s * w + b, r[C + 3] = e * M + i * T + n * E + s * S + j;
		return !0
	},
	createjs.ColorMatrixFilter = createjs.promote(t, "Filter")
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	function t() {
		throw "Touch cannot be instantiated"
	}
	t.isSupported = function () {
		return !!("ontouchstart" in window || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0)
	},
	t.enable = function (e, i, n) {
		return !!(e && e.canvas && t.isSupported()) && (!!e.__touch || (e.__touch = {
					pointers: {},
					multitouch: !i,
					preventDefault: !n,
					count: 0
				}, "ontouchstart" in window ? t._IOS_enable(e) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && t._IE_enable(e), !0))
	},
	t.disable = function (e) {
		e && ("ontouchstart" in window ? t._IOS_disable(e) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && t._IE_disable(e), delete e.__touch)
	},
	t._IOS_enable = function (e) {
		var i = e.canvas,
		n = e.__touch.f = function (i) {
			t._IOS_handleEvent(e, i)
		};
		i.addEventListener("touchstart", n, !1),
		i.addEventListener("touchmove", n, !1),
		i.addEventListener("touchend", n, !1),
		i.addEventListener("touchcancel", n, !1)
	},
	t._IOS_disable = function (t) {
		var e = t.canvas;
		if (e) {
			var i = t.__touch.f;
			e.removeEventListener("touchstart", i, !1),
			e.removeEventListener("touchmove", i, !1),
			e.removeEventListener("touchend", i, !1),
			e.removeEventListener("touchcancel", i, !1)
		}
	},
	t._IOS_handleEvent = function (t, e) {
		if (t) {
			t.__touch.preventDefault && e.preventDefault && e.preventDefault();
			for (var i = e.changedTouches, n = e.type, s = 0, r = i.length; r > s; s++) {
				var a = i[s],
				h = a.identifier;
				a.target == t.canvas && ("touchstart" == n ? this._handleStart(t, h, e, a.pageX, a.pageY) : "touchmove" == n ? this._handleMove(t, h, e, a.pageX, a.pageY) : ("touchend" == n || "touchcancel" == n) && this._handleEnd(t, h, e))
			}
		}
	},
	t._IE_enable = function (e) {
		var i = e.canvas,
		n = e.__touch.f = function (i) {
			t._IE_handleEvent(e, i)
		};
		void 0 === window.navigator.pointerEnabled ? (i.addEventListener("MSPointerDown", n, !1), window.addEventListener("MSPointerMove", n, !1), window.addEventListener("MSPointerUp", n, !1), window.addEventListener("MSPointerCancel", n, !1), e.__touch.preventDefault && (i.style.msTouchAction = "none")) : (i.addEventListener("pointerdown", n, !1), window.addEventListener("pointermove", n, !1), window.addEventListener("pointerup", n, !1), window.addEventListener("pointercancel", n, !1), e.__touch.preventDefault && (i.style.touchAction = "none")),
		e.__touch.activeIDs = {}
	},
	t._IE_disable = function (t) {
		var e = t.__touch.f;
		void 0 === window.navigator.pointerEnabled ? (window.removeEventListener("MSPointerMove", e, !1), window.removeEventListener("MSPointerUp", e, !1), window.removeEventListener("MSPointerCancel", e, !1), t.canvas && t.canvas.removeEventListener("MSPointerDown", e, !1)) : (window.removeEventListener("pointermove", e, !1), window.removeEventListener("pointerup", e, !1), window.removeEventListener("pointercancel", e, !1), t.canvas && t.canvas.removeEventListener("pointerdown", e, !1))
	},
	t._IE_handleEvent = function (t, e) {
		if (t) {
			t.__touch.preventDefault && e.preventDefault && e.preventDefault();
			var i = e.type,
			n = e.pointerId,
			s = t.__touch.activeIDs;
			if ("MSPointerDown" == i || "pointerdown" == i) {
				if (e.srcElement != t.canvas)
					return;
				s[n] = !0,
				this._handleStart(t, n, e, e.pageX, e.pageY)
			} else
				s[n] && ("MSPointerMove" == i || "pointermove" == i ? this._handleMove(t, n, e, e.pageX, e.pageY) : ("MSPointerUp" == i || "MSPointerCancel" == i || "pointerup" == i || "pointercancel" == i) && (delete s[n], this._handleEnd(t, n, e)))
		}
	},
	t._handleStart = function (t, e, i, n, s) {
		var r = t.__touch;
		if (r.multitouch || !r.count) {
			var a = r.pointers;
			a[e] || (a[e] = !0, r.count++, t._handlePointerDown(e, i, n, s))
		}
	},
	t._handleMove = function (t, e, i, n, s) {
		t.__touch.pointers[e] && t._handlePointerMove(e, i, n, s)
	},
	t._handleEnd = function (t, e, i) {
		var n = t.__touch,
		s = n.pointers;
		s[e] && (n.count--, t._handlePointerUp(e, i, !0), delete s[e])
	},
	createjs.Touch = t
}
(), this.createjs = this.createjs || {}, function () {
	"use strict";
	var t = createjs.EaselJS = createjs.EaselJS || {};
	t.version = "0.8.0",
	t.buildDate = "Thu, 11 Dec 2014 23:32:09 GMT"
}
(), function () {
	L.R = L.R || {};
	var t = L.R.canvas = {};
	t.boxLabel = function (t, e, i, n) {
		if (i.label && i.label.text) {
			var s = L.extend({
					fillColor: "white",
					fillOpacity: 1,
					color: "blue",
					opacity: 1,
					width: 2,
					textColor: "black",
					textFont: "bold 14px Microsoft YaHei",
					boxHeight: 24,
					hideBox: !1,
					padding: 10,
					textAlign: "center",
					offset: [0, 0]
				}, i.label.style, n.labelStyle);
			if (!s.hideBox) {
				t.font = s.textFont,
				t.textAlign = s.textAlign,
				t.textBaseline = "middle",
				t.strokeStyle = s.color,
				t.fillStyle = s.fillColor,
				t.lineJoin = "round",
				t.lineWidth = s.width;
				var r = t.measureText(i.label.text).width + s.padding;
				t.globalAlpha = s.opacity;
				var a = {};
				"center" == s.textAlign ? (a.x = e.x - r / 2, a.y = e.y - s.boxHeight / 2) : "left" == s.textAlign ? (a.x = e.x - s.padding / 2, a.y = e.y - s.boxHeight / 2) : "right" == s.textAlign && (a.x = e.x - r + s.padding / 2, a.y = e.y - s.boxHeight / 2),
				a.x += s.offset[0],
				a.y += s.offset[1],
				t.strokeRect(a.x, a.y, r, s.boxHeight),
				t.globalAlpha = s.fillOpacity,
				t.fillRect(a.x, a.y, r, s.boxHeight),
				t.fillStyle = s.textColor
			}
			t.globalAlpha = 1,
			t.fillText(i.label.text, e.x + s.offset[0], e.y + s.offset[1]),
			t.restore()
		}
	},
	t.popupLabel = function (t, e, i, n) {
		var s = L.extend({
				fillColor: "white",
				fillOpacity: 1,
				color: "blue",
				opacity: 1,
				width: 2,
				textColor: "black",
				textFont: "bold 14px Microsoft YaHei",
				boxHeight: 24,
				padding: 10,
				triangleHeight: 8
			}, i.label.style, n.labelStyle);
		t.font = s.textFont,
		t.textAlign = "center",
		t.textBaseline = "middle",
		t.strokeStyle = s.color,
		t.fillStyle = s.fillColor,
		t.lineJoin = "round",
		t.lineWidth = s.width;
		var r = t.measureText(i.label.text).width + s.padding,
		a = {
			x: e.x - r / 2,
			y: e.y - s.boxHeight - s.triangleHeight
		};
		t.beginPath(),
		t.moveTo(a.x, a.y),
		t.lineTo(a.x + r, a.y),
		t.lineTo(a.x + r, a.y + s.boxHeight),
		t.lineTo(a.x + r / 2 + s.triangleHeight / 2, a.y + s.boxHeight),
		t.lineTo(a.x + r / 2, a.y + s.boxHeight + s.triangleHeight),
		t.lineTo(a.x + r / 2 - s.triangleHeight / 2, a.y + s.boxHeight),
		t.lineTo(a.x, a.y + s.boxHeight),
		t.lineTo(a.x, a.y),
		t.closePath(),
		t.globalAlpha = s.opacity,
		t.stroke(),
		t.globalAlpha = s.fillOpacity,
		t.fill(),
		t.moveTo(e.x, e.y),
		t.globalAlpha = 1,
		t.fillStyle = s.textColor,
		t.fillText(i.label.text, e.x, e.y - s.boxHeight / 2 - s.triangleHeight),
		t.restore()
	}
}
(), L.R = L.R || {}, L.extend(L.LatLng, {
	DEG_TO_RAD: Math.PI / 180,
	RAD_TO_DEG: 180 / Math.PI,
	MAX_MARGIN: 1e-9
}), L.R.Canvas = L.Class.extend({
		includes: L.Mixin.Events,
		statics: {
			R: 6378.137,
			M_PER_KM: 1e3,
			CSS_TRANSFORM: function () {
				for (var t = document.createElement("div"), e = ["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"], i = 0; i < e.length; i++) {
					var n = e[i];
					if (void 0 !== t.style[n])
						return n
				}
				return e[0]
			}
			()
		},
		_clickCallback: function (t) {
			if (t.containerPoint) {
				var e = this.getNearestPoint(t.containerPoint);
				if (e[1]) {
					var i = this._options[e[0]].event.click,
					n = this._options[e[0]].event.contextmenu;
					"click" == t.type && i && window.setTimeout(function () {
						i(e[1], t, e[0])
					}, 30),
					"contextmenu" == t.type && n && n(e[1], t, e[0])
				}
			}
		},
		_mousemoveCallback: function (t) {
			this.currentMouseXY = t.containerPoint
		},
		_checkMouse: function (t) {
			if (t.currentMouseXY && t.lastMouseXY !== t.currentMouseXY) {
				var e = t.getNearestPoint(t.currentMouseXY);
				if (e[1]) {
					if (t._map.getPanes().mapPane.parentNode.style.cursor = "pointer", !t._checkMouseIn) {
						var i = t._options[e[0]].event.mouseover;
						t._checkMouseInGroup = e[0],
						i && i(e[1], {}, e[0])
					}
					t._checkMouseIn = !0
				} else {
					if (t._map.getPanes().mapPane.parentNode.style.cursor = "", t._checkMouseIn)
						(i = t._options[t._checkMouseInGroup].event.mouseout) && i();
					t._checkMouseIn = !1
				}
				t.lastMouseXY = t.currentMouseXY
			}
		},
		initialize: function (t, e) {
			this._map = t,
			this.options = e || {};
			var i = t.getSize(),
			n = L.DomUtil.create("canvas", "leaflet-canvas-icon-layer leaflet-layer leaflet-zoom-hide");
			n.width = i.x,
			n.height = i.y;
			var s = window.devicePixelRatio;
			n.width = s * i.x,
			n.height = s * i.y;
			var r = L.DomUtil.testProp(["transformOrigin", "WebkitTransformOrigin", "msTransformOrigin"]);
			n.style[r] = "50% 50%",
			n.style.cssText += "width:" + i.x + "px",
			n.style.cssText += "height:" + i.y + "px",
			n.style.cssText += "pointer-events: none",
			e && "number" == typeof e.zIndex && (n.style.zIndex = e.zIndex),
			t.getPanes().overlayPane.appendChild(n),
			this.canvas = n,
			this.ctx = n.getContext("2d"),
			this.origin = t.layerPointToLatLng(new L.Point(0, 0)),
			this.stage = new createjs.Stage(this.canvas),
			this.stage.tickOnUpdate = !1,
			this.stage.tickEnabled = !1,
			this._addEvent(),
			this.stage.scaleX = this.stage.scaleY = s,
			this.stage.enableDOMEvents(!1),
			this.stage.stageId ? ++this.stage.stageId : this.stage.stageId = 0;
			this._dataMap = {},
			this._leafletGroupMap = {},
			this._leafletDataMap = {},
			this.imageCount = 0,
			this.iconUrlMap = {},
			this.count = 0,
			this.imageIsReady = !0
		},
		_addEvent: function () {
			this._map.on("viewreset", this._viewreset, this),
			this._map.on("zoomend", this._viewreset, this),
			this._map.on("resize", this._resize, this),
			this._map.on("zoomstart", this._zoomStart, this),
			this._map.on("moveend", this._moveEnd, this),
			this._map.on("moveend", this._updateEl, this),
			this._map.on("dragstart", this._dragStart, this),
			this._map.on("dragend", this._dragEnd, this),
			this._map.on("resize", this._updateEl, this),
			this._map.on("click", this._clickCallback, this),
			this._map.on("contextmenu", this._clickCallback, this),
			this._map.on("mousemove", this._mousemoveCallback, this)
		},
		_removeEvent: function () {
			this._map.off("viewreset", this._viewreset, this),
			this._map.off("zoomend", this._viewreset, this),
			this._map.off("resize", this._resize, this),
			this._map.off("moveend", this._updateEl, this),
			this._map.off("dragstart", this._dragStart, this),
			this._map.off("dragend", this._dragEnd, this),
			this._map.off("resize", this._updateEl, this),
			this._map.off("click", this._clickCallback, this),
			this._map.off("contextmenu", this._clickCallback, this),
			this._map.off("mousemove", this._mousemoveCallback, this)
		},
		_zoomStart: function () {
			this.setVisible(!1)
		},
		_moveStart: function () {},
		_moveEnd: function () {
			this.setVisible(!0)
		},
		_resize: function () {
			var t = {};
			t.shadowBlur = this.ctx.shadowBlur,
			t.shadowColor = this.ctx.shadowColor,
			t.globalCompositeOperation = this.ctx.globalCompositeOperation;
			var e = this._map.getSize();
			this.canvas.width = e.x,
			this.canvas.height = e.y;
			var i = this.canvas,
			n = window.devicePixelRatio;
			i.width = n * e.x,
			i.height = n * e.y,
			i.style.cssText += "width:" + e.x + "px",
			i.style.cssText += "height:" + e.y + "px",
			this.stage.scaleX = this.stage.scaleY = n,
			L.Util.extend(this.ctx, t)
		},
		_viewreset: function () {
			this.canvas.style.cursor = "",
			this.origin = this._map.layerPointToLatLng(new L.Point(0, 0))
		},
		setOptions: function (t, e) {
			(t = t || {}).event = t.event || {},
			this._options = this._options || {},
			this._options[e] = t,
			t.enableMouseOver && t.enableMouseOver > 0 && window.setInterval(this._checkMouse, 1e2 * t.enableMouseOver, this),
			t.icon && t.icon.iconUrl && this._addImage(t.icon.iconUrl)
		},
		getOptions: function (t) {
			return void 0 === t ? this._options : this._options[t]
		},
		_dragStart: function () {
			this.setVisible(!0),
			this.isDragging = !0
		},
		_dragEnd: function () {
			this.isDragging = !1
		},
		draw: function () {
			if (!this.isDragging && !this.isDrawing) {
				this.isDrawing = !0,
				L.Path.include({
					_requestUpdate: function () {}
				}),
				this._update(),
				L.Path.include({
					_requestUpdate: function () {
						this._map && !L.Path._updateRequest && (L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd, this._map))
					}
				}),
				this.isDrawing = !1
			}
		},
		_update: function () {
			var t = this;
			if (this.imageIsReady) {
				this.stage.children = [],
				t.gridCell = {
					width: 12,
					height: 12,
					data: {}
				};
				var e = [];
				for (var i in t._dataMap)
					e.push({
						groupId: i,
						zIndex: this._options[i].zIndex || 0
					});
				e = e.sort(function (t, e) {
						return t.zIndex - e.zIndex
					});
				for (var n = 0; n < e.length; n++) {
					i = e[n].groupId;
					var s = t._dataMap[i];
					"Canvas" != (r = this._options[i]).type && this[r.type](s, r)
				}
				this.stage.update(),
				t.gridCell.data = {};
				for (n = 0; n < e.length; n++) {
					i = e[n].groupId;
					var r;
					s = t._dataMap[i];
					"Canvas" == (r = this._options[i]).type && this._drawCanvas(s, r)
				}
			} else
				window.setTimeout(function () {
					t.draw()
				}, 100)
		},
		_drawCanvas: function (t, e) {
			var n = this._map.getBounds(),
			s = this;
			for (var r in t) {
				var a = t[r];
				e.parser && (a = e.parser(a));
				var h = new L.LatLng(a.y, a.x);
				if (n.contains(h) || e.noClip) {
					if (!s.options.showAll) {
						var o = s._map.latLngToLayerPoint(h);
						if (i = parseInt(o.x / s.gridCell.width), j = parseInt(o.y / s.gridCell.height), s.gridCell.data[i + "," + j])
							continue;
						s.gridCell.data[i + "," + j] = !0
					}
					var c = s._map.latLngToContainerPoint(h);
					this.ctx.save(),
					this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio),
					e.drawCanvas(this.ctx, c, t[r], e),
					this.ctx.restore()
				}
			}
		},
		_updateEl: function () {
			if (!this.isDragging) {
				var t = this._map.containerPointToLayerPoint([0, 0]);
				L.DomUtil.setPosition(this.canvas, t);
				this._map.latLngToContainerPoint(this.origin);
				this.draw()
			}
		},
		_meter2pixel: function (t) {
			var e = L.latLng(31.211493, 121.430664),
			i = this._map.latLngToLayerPoint(e);
			return this._map.latLngToLayerPoint(this._getPoint(e, t, 90)).x - i.x
		},
		_getPoint: function (t, e, i) {
			var n = function (t) {
				return t * L.LatLng.DEG_TO_RAD
			},
			s = function (t) {
				return t * L.LatLng.RAD_TO_DEG
			},
			r = n(i),
			a = e / L.R.Canvas.M_PER_KM / L.R.Canvas.R,
			h = n(t.lat),
			o = n(t.lng),
			c = Math.asin(Math.sin(h) * Math.cos(a) + Math.cos(h) * Math.sin(a) * Math.cos(r)),
			l = o + Math.atan2(Math.sin(r) * Math.sin(a) * Math.cos(h), Math.cos(a) - Math.sin(h) * Math.sin(c));
			return c = s(c),
			l = s(l),
			new L.LatLng(c, l)
		},
		_parseData: function (t, e) {
			for (var i = t.length, n = {}, s = this._options[e]; i--; ) {
				var r,
				a,
				h,
				o,
				c = t[i];
				if (s.parser) {
					var l = s.parser(c);
					r = l.id,
					o = l.icon,
					a = l.x,
					h = l.y
				} else
					r = c.id, o = c.icon, a = c.x, h = c.y;
				a && h && (void 0 === r && (r = --this.count), n[r = e + "#" + r] = c, o && o.iconUrl && this._addImage(o.iconUrl))
			}
			return n
		},
		_addImage: function (t) {
			if (!this.iconUrlMap[t]) {
				this.iconUrlMap[t] = 1,
				++this.imageCount,
				this.imageIsReady = !1;
				var e = new Image,
				i = this;
				e.crossOrigin = "anonymous",
				e.onload = function () {
					0 == --i.imageCount && (i.imageIsReady = !0),
					i.iconUrlMap[t] = e
				},
				e.src = t
			}
		},
		setData: function (t, e) {
			this._dataMap[e] = this._parseData(t, e),
			this.draw()
		},
		setLeafletOverlay: function (t, e) {
			this._leafletDataMap[e] = t,
			this._leafletGroupMap[e] || (this._leafletGroupMap[e] = L.featureGroup()),
			this._leafletGroupMap[e].clearLayers();
			for (var i = 0; i < t.length; i++)
				this._leafletGroupMap[e].addLayer(t[i]);
			this._leafletGroupMap[e].addTo(this._map)
		},
		updateData: function (t, e) {
			this._dataMap[e] = L.extend(this._dataMap[e], this._parseData(t, e)),
			this.draw()
		},
		removeData: function (t, e) {
			var i = this;
			t.forEach(function (t) {
				delete i._dataMap[e][e + "#" + t]
			}),
			this.draw()
		},
		getDataById: function (t, e) {
			return this._dataMap[e] && this._dataMap[e][e + "#" + t]
		},
		hideData: function (t, e) {
			var i = this;
			i._hideData || (i._hideData = {}),
			t.forEach(function (t) {
				i._hideData[e + "#" + t] = i._dataMap[e][e + "#" + t]
			}),
			i.removeData(t, e)
		},
		showData: function (t, e) {
			var i = this;
			i._hideData && (t.forEach(function (t) {
					var n = i._hideData[e + "#" + t];
					n && (i._dataMap[e][e + "#" + t] = n, delete i._hideData[e + "#" + t])
				}), i.draw())
		},
		hideGroup: function (t) {
			var e = this;
			e._hideGroup || (e._hideGroup = {}),
			e._hideGroup[t] = e._dataMap[t],
			e.clearData(t)
		},
		showGroup: function (t) {
			var e = this;
			e._hideGroup && e._hideGroup[t] && (e._dataMap[t] = e._hideGroup[t], e.draw(), delete e._hideGroup[t])
		},
		clearData: function (t) {
			delete this._dataMap[t],
			this.draw(),
			this._leafletGroupMap[t] && this._leafletGroupMap[t].clearLayers(),
			delete this._leafletDataMap[t]
		},
		clearAllData: function () {
			for (var t in this.stage.children = [], this._dataMap = {}, this.stage.update(), this._leafletGroupMap)
				this._leafletGroupMap[t].clearLayers();
			this._leafletGroupMap = {},
			this._leafletDataMap = {}
		},
		setVisible: function (t) {
			if (t !== this._isVisible)
				if (this._isVisible = t, t)
					for (var e in this.canvas.style.display = "block", this._leafletDataMap)
						for (var i = this._leafletDataMap[e], n = 0; n < i.length; n++)
							this._leafletGroupMap[e].addLayer(i[n]);
				else
					for (var e in this.canvas.style.display = "none", this._leafletGroupMap)
						this._leafletGroupMap[e].clearLayers()
		},
		destroy: function () {
			this.clearAllData(),
			this.isDestroyed || (this.canvas.parentNode.removeChild(this.canvas), this.canvas = null, this.ctx = null, this.stage = null, this._removeEvent(), this.isDestroyed = !0),
			this.canvas = null
		},
		getNearestPoint: function (t) {
			if (!this.ctx.getImageData(t.x, t.y, 1, 1).data[3] > 1)
				return [];
			var e = this.stage.getObjectUnderPoint(t.x, t.y, 1);
			return e ? [e.dataGroupId, e.data] : []
		},
		geodesicArea: function (t) {
			var e,
			i,
			n = t.length,
			s = 0,
			r = L.LatLng.DEG_TO_RAD;
			if (n > 2) {
				for (var a = 0; a < n; a++)
					e = t[a], s += ((i = t[(a + 1) % n]).lng - e.lng) * r * (2 + Math.sin(e.lat * r) + Math.sin(i.lat * r));
				s = 6378137 * s * 6378137 / 2
			}
			return Math.abs(s)
		},
		readableArea: function (t, e) {
			return e ? t > 1e6 ? (t / 1e6).toFixed(4) + " 平方公里" : t.toFixed(2) + " 平方米" : (t /= .836127) >= 3097600 ? (t / 3097600).toFixed(2) + " mi&sup2;" : t >= 4840 ? (t / 4840).toFixed(2) + " acres" : Math.ceil(t) + " yd&sup2;"
		}
	}), L.R.Marker = L.R.Canvas.include({
		Marker: function (t, e) {
			var i,
			n,
			s = this._map.getBounds(),
			r = this;
			for (var a in t) {
				var h = t[a];
				e.parser && (h = e.parser(h));
				var o = new L.LatLng(h.y, h.x),
				c = r._map.latLngToContainerPoint(o);
				if (s.contains(o)) {
					if (!r.options.showAll) {
						var l = r._map.latLngToLayerPoint(o);
						if (i = parseInt(l.x / r.gridCell.width), n = parseInt(l.y / r.gridCell.height), r.gridCell.data[i + "," + n])
							continue;
						r.gridCell.data[i + "," + n] = !0
					}
					if (h.label && h.label.hideMarker);
					else {
						var u,
						d = h.icon && h.icon.iconUrl || e.icon && e.icon.iconUrl,
						p = h.icon && h.icon.draw || e.icon && e.icon.draw,
						f = h.icon && h.icon.iconSize || e.icon && e.icon.iconSize;
						if (d)
							u = new createjs.Bitmap(r.iconUrlMap[d]);
						else if (p) {
							(u = p(f, h.icon && h.icon.drawParams || e.icon && e.icon.drawParams, t[a])).setBounds(-f[0] / 2, -f[1] / 2, f[0], f[1]),
							u.tickEnabled = !1
						}
						var g = h.icon && h.icon.iconAnchor || e.icon && e.icon.iconAnchor,
						_ = u.getBounds();
						f || (f = [_.width, _.height]),
						u.scaleX = f[0] / _.width,
						u.scaleY = f[1] / _.height,
						d ? (u.x = c.x - _.width * u.scaleX / 2, u.y = c.y - _.height * u.scaleY / 2) : (u.x = c.x, u.y = c.y),
						g && (u.x += g[0], u.y += g[1]),
						u.cursor = "pointer",
						u.data = t[a],
						u.dataGroupId = a.split("#")[0],
						this.stage.addChild(u)
					}
					if (h.label && h.label.text && "tooltip" == h.label.type){
						var style = L.extend({
							fillColor: 'white', //填充色
							fillOpacity: 0.9, //填充透明度
							// stroke: false,
							color: '#999', //边框颜色
							opacity: 1, //边框透明度
							width: 1, //边框宽度
							textColor: '#56606E', //文本颜色
							textFont: 'normal 12px Microsoft YaHei', //文本字体
							boxHeight: 24, //box高度（宽度自适应）
							hideBox: false, //是否隐藏背景box
							padding: 10, //文本左右离box的距离，单位：像素
							textAlign: 'left', //对齐方式：center文本中心点 left文本左侧，right文本右侧  参考canvas api中的textAlign
							offset: [0, 0]//偏移量，单位：像素
						}, e.labelStyle, h.label.style);
						var txt = new createjs.Text();
						txt.text = h.label.text;
						txt.color = style.textColor;
						txt.font = style.textFont;
						txt.textAlign = style.textAlign;
						txt.textBaseline = 'middle';
						var bound = txt.getBounds();
							//console.info(bound);
						var container = new createjs.Container();
						var width = bound.width + style.padding;
						var border;
						var box;
						if (!style.hideBox){
							var topLeft = {};
							if (style.textAlign == 'center'){
								topLeft.x = c.x - width / 2;
								topLeft.y = c.y - style.boxHeight / 2;
							} else if (style.textAlign == 'left'){
								topLeft.x = c.x - style.padding / 2;
								topLeft.y = c.y - style.boxHeight / 2;
							} else if (style.textAlign == 'right'){
								topLeft.x = c.x - width + style.padding / 2;
								topLeft.y = c.y - style.boxHeight / 2;
							}
							topLeft.x += style.offset[0];
							topLeft.y += style.offset[1];

							border = new createjs.Shape();
							border.alpha = style.opacity;
							border.graphics.setStrokeStyle(style.width).beginStroke(style.color).drawRoundRect(topLeft.x, topLeft.y, width, style.boxHeight, style.boxHeight / 4);
							container.addChild(border);
							// r.stage.addChild(border);
							box = new createjs.Shape();
							box.alpha = style.fillOpacity;
							box.graphics.beginFill(style.fillColor).drawRoundRect(topLeft.x, topLeft.y, width, style.boxHeight, style.boxHeight / 4);
							container.addChild(box);
								//this.stage.addChild(container);
							box.cursor = 'pointer';
							box.data = t[a];
							box.dataGroupId = a.split('#')[0];
							// r.stage.addChild(box);
						}
						txt.x = c.x + style.offset[0];
						txt.y = c.y + style.offset[1];
						container.addChild(txt);
						txt.data = t[a];
						txt.dataGroupId = a.split('#')[0];
						r.stage.addChild(container);
					}
					if (h.label && h.label.text && "box" == h.label.type) {
						var m = L.extend({
								fillColor: "white",
								fillOpacity: 1,
								color: "blue",
								opacity: 1,
								width: 2,
								textColor: "black",
								textFont: "bold 14px Microsoft YaHei",
								boxHeight: 24,
								hideBox: !1,
								padding: 10,
								textAlign: "center",
								offset: [0, 0]
							}, e.labelStyle, h.label.style);
						(w = new createjs.Text).text = h.label.text,
						w.color = m.textColor,
						w.font = m.textFont,
						w.textAlign = m.textAlign,
						w.textBaseline = "middle";
						var v = w.getBounds();
						new createjs.Container;
						if (!m.hideBox) {
							var x = v.width + m.padding,
							y = {};
							"center" == m.textAlign ? (y.x = c.x - x / 2, y.y = c.y - m.boxHeight / 2) : "left" == m.textAlign ? (y.x = c.x - m.padding / 2, y.y = c.y - m.boxHeight / 2) : "right" == m.textAlign && (y.x = c.x - x + m.padding / 2, y.y = c.y - m.boxHeight / 2),
							y.x += m.offset[0],
							y.y += m.offset[1],
							(b = new createjs.Shape).alpha = m.opacity,
							b.graphics.setStrokeStyle(m.width).beginStroke(m.color).drawRoundRect(y.x, y.y, x, m.boxHeight, m.boxHeight / 4),
							this.stage.addChild(b),
							(M = new createjs.Shape).alpha = m.fillOpacity,
							M.graphics.beginFill(m.fillColor).drawRoundRect(y.x, y.y, x, m.boxHeight, m.boxHeight / 4),
							M.cursor = "pointer",
							M.data = t[a],
							M.dataGroupId = a.split("#")[0],
							this.stage.addChild(M)
						}
						w.x = c.x + m.offset[0],
						w.y = c.y + m.offset[1],
						w.data = t[a],
						w.dataGroupId = a.split("#")[0],
						this.stage.addChild(w)
					}
					if (h.label && h.label.text && "popup" == h.label.type) {
						var w;
						m = L.extend({
								fillColor: "white",
								fillOpacity: 1,
								color: "blue",
								opacity: 1,
								width: 2,
								textColor: "black",
								textFont: "bold 14px Microsoft YaHei",
								boxHeight: 24,
								padding: 10,
								triangleHeight: 8,
								offset: [0, 0]
							}, e.labelStyle, h.label.style);
						(w = new createjs.Text).text = h.label.text,
						w.color = m.textColor,
						w.font = m.textFont,
						w.textAlign = "center",
						w.textBaseline = "middle";
						var b,
						M;
						x = (v = w.getBounds()).width + m.padding;
						(y = {
								x: c.x - x / 2,
								y: c.y - m.boxHeight - m.triangleHeight
							}).x += m.offset[0],
						y.y += m.offset[1],
						(b = new createjs.Shape).alpha = m.opacity,
						b.graphics.setStrokeStyle(m.width).beginStroke(m.color).moveTo(y.x, y.y).lineTo(y.x + x, y.y).lineTo(y.x + x, y.y + m.boxHeight).lineTo(y.x + x / 2 + m.triangleHeight / 2, y.y + m.boxHeight).lineTo(y.x + x / 2, y.y + m.boxHeight + m.triangleHeight).lineTo(y.x + x / 2 - m.triangleHeight / 2, y.y + m.boxHeight).lineTo(y.x, y.y + m.boxHeight).lineTo(y.x, y.y).closePath().endStroke(),
						this.stage.addChild(b),
						(M = new createjs.Shape).alpha = m.fillOpacity,
						M.graphics.beginFill(m.fillColor).moveTo(y.x, y.y).lineTo(y.x + x, y.y).lineTo(y.x + x, y.y + m.boxHeight).lineTo(y.x + x / 2 + m.triangleHeight / 2, y.y + m.boxHeight).lineTo(y.x + x / 2, y.y + m.boxHeight + m.triangleHeight).lineTo(y.x + x / 2 - m.triangleHeight / 2, y.y + m.boxHeight).lineTo(y.x, y.y + m.boxHeight).lineTo(y.x, y.y).closePath().endFill(),
						M.cursor = "pointer",
						M.data = t[a],
						M.dataGroupId = a.split("#")[0],
						this.stage.addChild(M),
						w.x = c.x + m.offset[0],
						w.y = c.y - m.boxHeight / 2 - m.triangleHeight + m.offset[1],
						this.stage.addChild(w)
					}
				}
			}
		}
	});