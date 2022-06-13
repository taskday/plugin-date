var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
class JSBI extends Array {
  constructor(i, _) {
    if (super(i), this.sign = _, Object.setPrototypeOf(this, JSBI.prototype), i > JSBI.__kMaxLength)
      throw new RangeError("Maximum BigInt size exceeded");
  }
  static BigInt(i) {
    var _ = Math.floor, t = Number.isFinite;
    if (typeof i == "number") {
      if (i === 0)
        return JSBI.__zero();
      if (JSBI.__isOneDigitInt(i))
        return 0 > i ? JSBI.__oneDigit(-i, true) : JSBI.__oneDigit(i, false);
      if (!t(i) || _(i) !== i)
        throw new RangeError("The number " + i + " cannot be converted to BigInt because it is not an integer");
      return JSBI.__fromDouble(i);
    }
    if (typeof i == "string") {
      const _2 = JSBI.__fromString(i);
      if (_2 === null)
        throw new SyntaxError("Cannot convert " + i + " to a BigInt");
      return _2;
    }
    if (typeof i == "boolean")
      return i === true ? JSBI.__oneDigit(1, false) : JSBI.__zero();
    if (typeof i == "object") {
      if (i.constructor === JSBI)
        return i;
      const _2 = JSBI.__toPrimitive(i);
      return JSBI.BigInt(_2);
    }
    throw new TypeError("Cannot convert " + i + " to a BigInt");
  }
  toDebugString() {
    const i = ["BigInt["];
    for (const _ of this)
      i.push((_ ? (_ >>> 0).toString(16) : _) + ", ");
    return i.push("]"), i.join("");
  }
  toString(i = 10) {
    if (2 > i || 36 < i)
      throw new RangeError("toString() radix argument must be between 2 and 36");
    return this.length === 0 ? "0" : (i & i - 1) == 0 ? JSBI.__toStringBasePowerOfTwo(this, i) : JSBI.__toStringGeneric(this, i, false);
  }
  valueOf() {
    throw new Error("Convert JSBI instances to native numbers using `toNumber`.");
  }
  static toNumber(i) {
    const _ = i.length;
    if (_ === 0)
      return 0;
    if (_ === 1) {
      const _2 = i.__unsignedDigit(0);
      return i.sign ? -_2 : _2;
    }
    const t = i.__digit(_ - 1), e = JSBI.__clz30(t), n = 30 * _ - e;
    if (1024 < n)
      return i.sign ? -Infinity : 1 / 0;
    let g = n - 1, s = t, o = _ - 1;
    const l = e + 3;
    let r = l === 32 ? 0 : s << l;
    r >>>= 12;
    const a = l - 12;
    let u = 12 <= l ? 0 : s << 20 + l, d = 20 + l;
    for (0 < a && 0 < o && (o--, s = i.__digit(o), r |= s >>> 30 - a, u = s << a + 2, d = a + 2); 0 < d && 0 < o; )
      o--, s = i.__digit(o), u |= 30 <= d ? s << d - 30 : s >>> 30 - d, d -= 30;
    const h = JSBI.__decideRounding(i, d, o, s);
    if ((h === 1 || h === 0 && (1 & u) == 1) && (u = u + 1 >>> 0, u === 0 && (r++, r >>> 20 != 0 && (r = 0, g++, 1023 < g))))
      return i.sign ? -Infinity : 1 / 0;
    const m = i.sign ? -2147483648 : 0;
    return g = g + 1023 << 20, JSBI.__kBitConversionInts[1] = m | g | r, JSBI.__kBitConversionInts[0] = u, JSBI.__kBitConversionDouble[0];
  }
  static unaryMinus(i) {
    if (i.length === 0)
      return i;
    const _ = i.__copy();
    return _.sign = !i.sign, _;
  }
  static bitwiseNot(i) {
    return i.sign ? JSBI.__absoluteSubOne(i).__trim() : JSBI.__absoluteAddOne(i, true);
  }
  static exponentiate(i, _) {
    if (_.sign)
      throw new RangeError("Exponent must be positive");
    if (_.length === 0)
      return JSBI.__oneDigit(1, false);
    if (i.length === 0)
      return i;
    if (i.length === 1 && i.__digit(0) === 1)
      return i.sign && (1 & _.__digit(0)) == 0 ? JSBI.unaryMinus(i) : i;
    if (1 < _.length)
      throw new RangeError("BigInt too big");
    let t = _.__unsignedDigit(0);
    if (t === 1)
      return i;
    if (t >= JSBI.__kMaxLengthBits)
      throw new RangeError("BigInt too big");
    if (i.length === 1 && i.__digit(0) === 2) {
      const _2 = 1 + (0 | t / 30), e2 = i.sign && (1 & t) != 0, n2 = new JSBI(_2, e2);
      n2.__initializeDigits();
      const g = 1 << t % 30;
      return n2.__setDigit(_2 - 1, g), n2;
    }
    let e = null, n = i;
    for ((1 & t) != 0 && (e = i), t >>= 1; t !== 0; t >>= 1)
      n = JSBI.multiply(n, n), (1 & t) != 0 && (e === null ? e = n : e = JSBI.multiply(e, n));
    return e;
  }
  static multiply(_, t) {
    if (_.length === 0)
      return _;
    if (t.length === 0)
      return t;
    let i = _.length + t.length;
    30 <= _.__clzmsd() + t.__clzmsd() && i--;
    const e = new JSBI(i, _.sign !== t.sign);
    e.__initializeDigits();
    for (let n = 0; n < _.length; n++)
      JSBI.__multiplyAccumulate(t, _.__digit(n), e, n);
    return e.__trim();
  }
  static divide(i, _) {
    if (_.length === 0)
      throw new RangeError("Division by zero");
    if (0 > JSBI.__absoluteCompare(i, _))
      return JSBI.__zero();
    const t = i.sign !== _.sign, e = _.__unsignedDigit(0);
    let n;
    if (_.length === 1 && 32767 >= e) {
      if (e === 1)
        return t === i.sign ? i : JSBI.unaryMinus(i);
      n = JSBI.__absoluteDivSmall(i, e, null);
    } else
      n = JSBI.__absoluteDivLarge(i, _, true, false);
    return n.sign = t, n.__trim();
  }
  static remainder(i, _) {
    if (_.length === 0)
      throw new RangeError("Division by zero");
    if (0 > JSBI.__absoluteCompare(i, _))
      return i;
    const t = _.__unsignedDigit(0);
    if (_.length === 1 && 32767 >= t) {
      if (t === 1)
        return JSBI.__zero();
      const _2 = JSBI.__absoluteModSmall(i, t);
      return _2 === 0 ? JSBI.__zero() : JSBI.__oneDigit(_2, i.sign);
    }
    const e = JSBI.__absoluteDivLarge(i, _, false, true);
    return e.sign = i.sign, e.__trim();
  }
  static add(i, _) {
    const t = i.sign;
    return t === _.sign ? JSBI.__absoluteAdd(i, _, t) : 0 <= JSBI.__absoluteCompare(i, _) ? JSBI.__absoluteSub(i, _, t) : JSBI.__absoluteSub(_, i, !t);
  }
  static subtract(i, _) {
    const t = i.sign;
    return t === _.sign ? 0 <= JSBI.__absoluteCompare(i, _) ? JSBI.__absoluteSub(i, _, t) : JSBI.__absoluteSub(_, i, !t) : JSBI.__absoluteAdd(i, _, t);
  }
  static leftShift(i, _) {
    return _.length === 0 || i.length === 0 ? i : _.sign ? JSBI.__rightShiftByAbsolute(i, _) : JSBI.__leftShiftByAbsolute(i, _);
  }
  static signedRightShift(i, _) {
    return _.length === 0 || i.length === 0 ? i : _.sign ? JSBI.__leftShiftByAbsolute(i, _) : JSBI.__rightShiftByAbsolute(i, _);
  }
  static unsignedRightShift() {
    throw new TypeError("BigInts have no unsigned right shift; use >> instead");
  }
  static lessThan(i, _) {
    return 0 > JSBI.__compareToBigInt(i, _);
  }
  static lessThanOrEqual(i, _) {
    return 0 >= JSBI.__compareToBigInt(i, _);
  }
  static greaterThan(i, _) {
    return 0 < JSBI.__compareToBigInt(i, _);
  }
  static greaterThanOrEqual(i, _) {
    return 0 <= JSBI.__compareToBigInt(i, _);
  }
  static equal(_, t) {
    if (_.sign !== t.sign)
      return false;
    if (_.length !== t.length)
      return false;
    for (let e = 0; e < _.length; e++)
      if (_.__digit(e) !== t.__digit(e))
        return false;
    return true;
  }
  static notEqual(i, _) {
    return !JSBI.equal(i, _);
  }
  static bitwiseAnd(i, _) {
    var t = Math.max;
    if (!i.sign && !_.sign)
      return JSBI.__absoluteAnd(i, _).__trim();
    if (i.sign && _.sign) {
      const e = t(i.length, _.length) + 1;
      let n = JSBI.__absoluteSubOne(i, e);
      const g = JSBI.__absoluteSubOne(_);
      return n = JSBI.__absoluteOr(n, g, n), JSBI.__absoluteAddOne(n, true, n).__trim();
    }
    return i.sign && ([i, _] = [_, i]), JSBI.__absoluteAndNot(i, JSBI.__absoluteSubOne(_)).__trim();
  }
  static bitwiseXor(i, _) {
    var t = Math.max;
    if (!i.sign && !_.sign)
      return JSBI.__absoluteXor(i, _).__trim();
    if (i.sign && _.sign) {
      const e2 = t(i.length, _.length), n2 = JSBI.__absoluteSubOne(i, e2), g = JSBI.__absoluteSubOne(_);
      return JSBI.__absoluteXor(n2, g, n2).__trim();
    }
    const e = t(i.length, _.length) + 1;
    i.sign && ([i, _] = [_, i]);
    let n = JSBI.__absoluteSubOne(_, e);
    return n = JSBI.__absoluteXor(n, i, n), JSBI.__absoluteAddOne(n, true, n).__trim();
  }
  static bitwiseOr(i, _) {
    var t = Math.max;
    const e = t(i.length, _.length);
    if (!i.sign && !_.sign)
      return JSBI.__absoluteOr(i, _).__trim();
    if (i.sign && _.sign) {
      let t2 = JSBI.__absoluteSubOne(i, e);
      const n2 = JSBI.__absoluteSubOne(_);
      return t2 = JSBI.__absoluteAnd(t2, n2, t2), JSBI.__absoluteAddOne(t2, true, t2).__trim();
    }
    i.sign && ([i, _] = [_, i]);
    let n = JSBI.__absoluteSubOne(_, e);
    return n = JSBI.__absoluteAndNot(n, i, n), JSBI.__absoluteAddOne(n, true, n).__trim();
  }
  static asIntN(_, t) {
    var i = Math.floor;
    if (t.length === 0)
      return t;
    if (_ = i(_), 0 > _)
      throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (_ === 0)
      return JSBI.__zero();
    if (_ >= JSBI.__kMaxLengthBits)
      return t;
    const e = 0 | (_ + 29) / 30;
    if (t.length < e)
      return t;
    const g = t.__unsignedDigit(e - 1), s = 1 << (_ - 1) % 30;
    if (t.length === e && g < s)
      return t;
    if (!((g & s) === s))
      return JSBI.__truncateToNBits(_, t);
    if (!t.sign)
      return JSBI.__truncateAndSubFromPowerOfTwo(_, t, true);
    if ((g & s - 1) == 0) {
      for (let n = e - 2; 0 <= n; n--)
        if (t.__digit(n) !== 0)
          return JSBI.__truncateAndSubFromPowerOfTwo(_, t, false);
      return t.length === e && g === s ? t : JSBI.__truncateToNBits(_, t);
    }
    return JSBI.__truncateAndSubFromPowerOfTwo(_, t, false);
  }
  static asUintN(i, _) {
    var t = Math.floor;
    if (_.length === 0)
      return _;
    if (i = t(i), 0 > i)
      throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (i === 0)
      return JSBI.__zero();
    if (_.sign) {
      if (i > JSBI.__kMaxLengthBits)
        throw new RangeError("BigInt too big");
      return JSBI.__truncateAndSubFromPowerOfTwo(i, _, false);
    }
    if (i >= JSBI.__kMaxLengthBits)
      return _;
    const e = 0 | (i + 29) / 30;
    if (_.length < e)
      return _;
    const g = i % 30;
    if (_.length == e) {
      if (g === 0)
        return _;
      const i2 = _.__digit(e - 1);
      if (i2 >>> g == 0)
        return _;
    }
    return JSBI.__truncateToNBits(i, _);
  }
  static ADD(i, _) {
    if (i = JSBI.__toPrimitive(i), _ = JSBI.__toPrimitive(_), typeof i == "string")
      return typeof _ != "string" && (_ = _.toString()), i + _;
    if (typeof _ == "string")
      return i.toString() + _;
    if (i = JSBI.__toNumeric(i), _ = JSBI.__toNumeric(_), JSBI.__isBigInt(i) && JSBI.__isBigInt(_))
      return JSBI.add(i, _);
    if (typeof i == "number" && typeof _ == "number")
      return i + _;
    throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
  }
  static LT(i, _) {
    return JSBI.__compare(i, _, 0);
  }
  static LE(i, _) {
    return JSBI.__compare(i, _, 1);
  }
  static GT(i, _) {
    return JSBI.__compare(i, _, 2);
  }
  static GE(i, _) {
    return JSBI.__compare(i, _, 3);
  }
  static EQ(i, _) {
    for (; ; ) {
      if (JSBI.__isBigInt(i))
        return JSBI.__isBigInt(_) ? JSBI.equal(i, _) : JSBI.EQ(_, i);
      if (typeof i == "number") {
        if (JSBI.__isBigInt(_))
          return JSBI.__equalToNumber(_, i);
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "string") {
        if (JSBI.__isBigInt(_))
          return i = JSBI.__fromString(i), i !== null && JSBI.equal(i, _);
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "boolean") {
        if (JSBI.__isBigInt(_))
          return JSBI.__equalToNumber(_, +i);
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "symbol") {
        if (JSBI.__isBigInt(_))
          return false;
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "object") {
        if (typeof _ == "object" && _.constructor !== JSBI)
          return i == _;
        i = JSBI.__toPrimitive(i);
      } else
        return i == _;
    }
  }
  static NE(i, _) {
    return !JSBI.EQ(i, _);
  }
  static DataViewGetBigInt64(i, _, t = false) {
    return JSBI.asIntN(64, JSBI.DataViewGetBigUint64(i, _, t));
  }
  static DataViewGetBigUint64(i, _, t = false) {
    const [e, n] = t ? [4, 0] : [0, 4], g = i.getUint32(_ + e, t), s = i.getUint32(_ + n, t), o = new JSBI(3, false);
    return o.__setDigit(0, 1073741823 & s), o.__setDigit(1, (268435455 & g) << 2 | s >>> 30), o.__setDigit(2, g >>> 28), o.__trim();
  }
  static DataViewSetBigInt64(i, _, t, e = false) {
    JSBI.DataViewSetBigUint64(i, _, t, e);
  }
  static DataViewSetBigUint64(i, _, t, e = false) {
    t = JSBI.asUintN(64, t);
    let n = 0, g = 0;
    if (0 < t.length && (g = t.__digit(0), 1 < t.length)) {
      const i2 = t.__digit(1);
      g |= i2 << 30, n = i2 >>> 2, 2 < t.length && (n |= t.__digit(2) << 28);
    }
    const [s, o] = e ? [4, 0] : [0, 4];
    i.setUint32(_ + s, n, e), i.setUint32(_ + o, g, e);
  }
  static __zero() {
    return new JSBI(0, false);
  }
  static __oneDigit(i, _) {
    const t = new JSBI(1, _);
    return t.__setDigit(0, i), t;
  }
  __copy() {
    const _ = new JSBI(this.length, this.sign);
    for (let t = 0; t < this.length; t++)
      _[t] = this[t];
    return _;
  }
  __trim() {
    let i = this.length, _ = this[i - 1];
    for (; _ === 0; )
      i--, _ = this[i - 1], this.pop();
    return i === 0 && (this.sign = false), this;
  }
  __initializeDigits() {
    for (let _ = 0; _ < this.length; _++)
      this[_] = 0;
  }
  static __decideRounding(i, _, t, e) {
    if (0 < _)
      return -1;
    let n;
    if (0 > _)
      n = -_ - 1;
    else {
      if (t === 0)
        return -1;
      t--, e = i.__digit(t), n = 29;
    }
    let g = 1 << n;
    if ((e & g) == 0)
      return -1;
    if (g -= 1, (e & g) != 0)
      return 1;
    for (; 0 < t; )
      if (t--, i.__digit(t) !== 0)
        return 1;
    return 0;
  }
  static __fromDouble(i) {
    JSBI.__kBitConversionDouble[0] = i;
    const _ = 2047 & JSBI.__kBitConversionInts[1] >>> 20, t = _ - 1023, e = (0 | t / 30) + 1, n = new JSBI(e, 0 > i);
    let g = 1048575 & JSBI.__kBitConversionInts[1] | 1048576, s = JSBI.__kBitConversionInts[0];
    const o = 20, l = t % 30;
    let r, a = 0;
    if (l < 20) {
      const i2 = o - l;
      a = i2 + 32, r = g >>> i2, g = g << 32 - i2 | s >>> i2, s <<= 32 - i2;
    } else if (l === 20)
      a = 32, r = g, g = s, s = 0;
    else {
      const i2 = l - o;
      a = 32 - i2, r = g << i2 | s >>> 32 - i2, g = s << i2, s = 0;
    }
    n.__setDigit(e - 1, r);
    for (let _2 = e - 2; 0 <= _2; _2--)
      0 < a ? (a -= 30, r = g >>> 2, g = g << 30 | s >>> 2, s <<= 30) : r = 0, n.__setDigit(_2, r);
    return n.__trim();
  }
  static __isWhitespace(i) {
    return !!(13 >= i && 9 <= i) || (159 >= i ? i == 32 : 131071 >= i ? i == 160 || i == 5760 : 196607 >= i ? (i &= 131071, 10 >= i || i == 40 || i == 41 || i == 47 || i == 95 || i == 4096) : i == 65279);
  }
  static __fromString(i, _ = 0) {
    let t = 0;
    const e = i.length;
    let n = 0;
    if (n === e)
      return JSBI.__zero();
    let g = i.charCodeAt(n);
    for (; JSBI.__isWhitespace(g); ) {
      if (++n === e)
        return JSBI.__zero();
      g = i.charCodeAt(n);
    }
    if (g === 43) {
      if (++n === e)
        return null;
      g = i.charCodeAt(n), t = 1;
    } else if (g === 45) {
      if (++n === e)
        return null;
      g = i.charCodeAt(n), t = -1;
    }
    if (_ === 0) {
      if (_ = 10, g === 48) {
        if (++n === e)
          return JSBI.__zero();
        if (g = i.charCodeAt(n), g === 88 || g === 120) {
          if (_ = 16, ++n === e)
            return null;
          g = i.charCodeAt(n);
        } else if (g === 79 || g === 111) {
          if (_ = 8, ++n === e)
            return null;
          g = i.charCodeAt(n);
        } else if (g === 66 || g === 98) {
          if (_ = 2, ++n === e)
            return null;
          g = i.charCodeAt(n);
        }
      }
    } else if (_ === 16 && g === 48) {
      if (++n === e)
        return JSBI.__zero();
      if (g = i.charCodeAt(n), g === 88 || g === 120) {
        if (++n === e)
          return null;
        g = i.charCodeAt(n);
      }
    }
    if (t != 0 && _ !== 10)
      return null;
    for (; g === 48; ) {
      if (++n === e)
        return JSBI.__zero();
      g = i.charCodeAt(n);
    }
    const s = e - n;
    let o = JSBI.__kMaxBitsPerChar[_], l = JSBI.__kBitsPerCharTableMultiplier - 1;
    if (s > 1073741824 / o)
      return null;
    const r = o * s + l >>> JSBI.__kBitsPerCharTableShift, a = new JSBI(0 | (r + 29) / 30, false), u = 10 > _ ? _ : 10, h = 10 < _ ? _ - 10 : 0;
    if ((_ & _ - 1) == 0) {
      o >>= JSBI.__kBitsPerCharTableShift;
      const _2 = [], t2 = [];
      let s2 = false;
      do {
        let l2 = 0, r2 = 0;
        for (; ; ) {
          let _3;
          if (g - 48 >>> 0 < u)
            _3 = g - 48;
          else if ((32 | g) - 97 >>> 0 < h)
            _3 = (32 | g) - 87;
          else {
            s2 = true;
            break;
          }
          if (r2 += o, l2 = l2 << o | _3, ++n === e) {
            s2 = true;
            break;
          }
          if (g = i.charCodeAt(n), 30 < r2 + o)
            break;
        }
        _2.push(l2), t2.push(r2);
      } while (!s2);
      JSBI.__fillFromParts(a, _2, t2);
    } else {
      a.__initializeDigits();
      let t2 = false, s2 = 0;
      do {
        let r2 = 0, b = 1;
        for (; ; ) {
          let o2;
          if (g - 48 >>> 0 < u)
            o2 = g - 48;
          else if ((32 | g) - 97 >>> 0 < h)
            o2 = (32 | g) - 87;
          else {
            t2 = true;
            break;
          }
          const l2 = b * _;
          if (1073741823 < l2)
            break;
          if (b = l2, r2 = r2 * _ + o2, s2++, ++n === e) {
            t2 = true;
            break;
          }
          g = i.charCodeAt(n);
        }
        l = 30 * JSBI.__kBitsPerCharTableMultiplier - 1;
        const D = 0 | (o * s2 + l >>> JSBI.__kBitsPerCharTableShift) / 30;
        a.__inplaceMultiplyAdd(b, r2, D);
      } while (!t2);
    }
    if (n !== e) {
      if (!JSBI.__isWhitespace(g))
        return null;
      for (n++; n < e; n++)
        if (g = i.charCodeAt(n), !JSBI.__isWhitespace(g))
          return null;
    }
    return a.sign = t == -1, a.__trim();
  }
  static __fillFromParts(_, t, e) {
    let n = 0, g = 0, s = 0;
    for (let o = t.length - 1; 0 <= o; o--) {
      const i = t[o], l = e[o];
      g |= i << s, s += l, s === 30 ? (_.__setDigit(n++, g), s = 0, g = 0) : 30 < s && (_.__setDigit(n++, 1073741823 & g), s -= 30, g = i >>> l - s);
    }
    if (g !== 0) {
      if (n >= _.length)
        throw new Error("implementation bug");
      _.__setDigit(n++, g);
    }
    for (; n < _.length; n++)
      _.__setDigit(n, 0);
  }
  static __toStringBasePowerOfTwo(_, i) {
    const t = _.length;
    let e = i - 1;
    e = (85 & e >>> 1) + (85 & e), e = (51 & e >>> 2) + (51 & e), e = (15 & e >>> 4) + (15 & e);
    const n = e, g = i - 1, s = _.__digit(t - 1), o = JSBI.__clz30(s);
    let l = 0 | (30 * t - o + n - 1) / n;
    if (_.sign && l++, 268435456 < l)
      throw new Error("string too long");
    const r = Array(l);
    let a = l - 1, u = 0, d = 0;
    for (let e2 = 0; e2 < t - 1; e2++) {
      const i2 = _.__digit(e2), t2 = (u | i2 << d) & g;
      r[a--] = JSBI.__kConversionChars[t2];
      const s2 = n - d;
      for (u = i2 >>> s2, d = 30 - s2; d >= n; )
        r[a--] = JSBI.__kConversionChars[u & g], u >>>= n, d -= n;
    }
    const h = (u | s << d) & g;
    for (r[a--] = JSBI.__kConversionChars[h], u = s >>> n - d; u !== 0; )
      r[a--] = JSBI.__kConversionChars[u & g], u >>>= n;
    if (_.sign && (r[a--] = "-"), a != -1)
      throw new Error("implementation bug");
    return r.join("");
  }
  static __toStringGeneric(_, i, t) {
    const e = _.length;
    if (e === 0)
      return "";
    if (e === 1) {
      let e2 = _.__unsignedDigit(0).toString(i);
      return t === false && _.sign && (e2 = "-" + e2), e2;
    }
    const n = 30 * e - JSBI.__clz30(_.__digit(e - 1)), g = JSBI.__kMaxBitsPerChar[i], s = g - 1;
    let o = n * JSBI.__kBitsPerCharTableMultiplier;
    o += s - 1, o = 0 | o / s;
    const l = o + 1 >> 1, r = JSBI.exponentiate(JSBI.__oneDigit(i, false), JSBI.__oneDigit(l, false));
    let a, u;
    const d = r.__unsignedDigit(0);
    if (r.length === 1 && 32767 >= d) {
      a = new JSBI(_.length, false), a.__initializeDigits();
      let t2 = 0;
      for (let e2 = 2 * _.length - 1; 0 <= e2; e2--) {
        const i2 = t2 << 15 | _.__halfDigit(e2);
        a.__setHalfDigit(e2, 0 | i2 / d), t2 = 0 | i2 % d;
      }
      u = t2.toString(i);
    } else {
      const t2 = JSBI.__absoluteDivLarge(_, r, true, true);
      a = t2.quotient;
      const e2 = t2.remainder.__trim();
      u = JSBI.__toStringGeneric(e2, i, true);
    }
    a.__trim();
    let h = JSBI.__toStringGeneric(a, i, true);
    for (; u.length < l; )
      u = "0" + u;
    return t === false && _.sign && (h = "-" + h), h + u;
  }
  static __unequalSign(i) {
    return i ? -1 : 1;
  }
  static __absoluteGreater(i) {
    return i ? -1 : 1;
  }
  static __absoluteLess(i) {
    return i ? 1 : -1;
  }
  static __compareToBigInt(i, _) {
    const t = i.sign;
    if (t !== _.sign)
      return JSBI.__unequalSign(t);
    const e = JSBI.__absoluteCompare(i, _);
    return 0 < e ? JSBI.__absoluteGreater(t) : 0 > e ? JSBI.__absoluteLess(t) : 0;
  }
  static __compareToNumber(i, _) {
    if (JSBI.__isOneDigitInt(_)) {
      const t = i.sign, e = 0 > _;
      if (t !== e)
        return JSBI.__unequalSign(t);
      if (i.length === 0) {
        if (e)
          throw new Error("implementation bug");
        return _ === 0 ? 0 : -1;
      }
      if (1 < i.length)
        return JSBI.__absoluteGreater(t);
      const n = Math.abs(_), g = i.__unsignedDigit(0);
      return g > n ? JSBI.__absoluteGreater(t) : g < n ? JSBI.__absoluteLess(t) : 0;
    }
    return JSBI.__compareToDouble(i, _);
  }
  static __compareToDouble(i, _) {
    if (_ !== _)
      return _;
    if (_ === 1 / 0)
      return -1;
    if (_ === -Infinity)
      return 1;
    const t = i.sign;
    if (t !== 0 > _)
      return JSBI.__unequalSign(t);
    if (_ === 0)
      throw new Error("implementation bug: should be handled elsewhere");
    if (i.length === 0)
      return -1;
    JSBI.__kBitConversionDouble[0] = _;
    const e = 2047 & JSBI.__kBitConversionInts[1] >>> 20;
    if (e == 2047)
      throw new Error("implementation bug: handled elsewhere");
    const n = e - 1023;
    if (0 > n)
      return JSBI.__absoluteGreater(t);
    const g = i.length;
    let s = i.__digit(g - 1);
    const o = JSBI.__clz30(s), l = 30 * g - o, r = n + 1;
    if (l < r)
      return JSBI.__absoluteLess(t);
    if (l > r)
      return JSBI.__absoluteGreater(t);
    let a = 1048576 | 1048575 & JSBI.__kBitConversionInts[1], u = JSBI.__kBitConversionInts[0];
    const d = 20, h = 29 - o;
    if (h !== (0 | (l - 1) % 30))
      throw new Error("implementation bug");
    let m, b = 0;
    if (20 > h) {
      const i2 = d - h;
      b = i2 + 32, m = a >>> i2, a = a << 32 - i2 | u >>> i2, u <<= 32 - i2;
    } else if (h === 20)
      b = 32, m = a, a = u, u = 0;
    else {
      const i2 = h - d;
      b = 32 - i2, m = a << i2 | u >>> 32 - i2, a = u << i2, u = 0;
    }
    if (s >>>= 0, m >>>= 0, s > m)
      return JSBI.__absoluteGreater(t);
    if (s < m)
      return JSBI.__absoluteLess(t);
    for (let e2 = g - 2; 0 <= e2; e2--) {
      0 < b ? (b -= 30, m = a >>> 2, a = a << 30 | u >>> 2, u <<= 30) : m = 0;
      const _2 = i.__unsignedDigit(e2);
      if (_2 > m)
        return JSBI.__absoluteGreater(t);
      if (_2 < m)
        return JSBI.__absoluteLess(t);
    }
    if (a !== 0 || u !== 0) {
      if (b === 0)
        throw new Error("implementation bug");
      return JSBI.__absoluteLess(t);
    }
    return 0;
  }
  static __equalToNumber(i, _) {
    var t = Math.abs;
    return JSBI.__isOneDigitInt(_) ? _ === 0 ? i.length === 0 : i.length === 1 && i.sign === 0 > _ && i.__unsignedDigit(0) === t(_) : JSBI.__compareToDouble(i, _) === 0;
  }
  static __comparisonResultToBool(i, _) {
    return _ === 0 ? 0 > i : _ === 1 ? 0 >= i : _ === 2 ? 0 < i : _ === 3 ? 0 <= i : void 0;
  }
  static __compare(i, _, t) {
    if (i = JSBI.__toPrimitive(i), _ = JSBI.__toPrimitive(_), typeof i == "string" && typeof _ == "string")
      switch (t) {
        case 0:
          return i < _;
        case 1:
          return i <= _;
        case 2:
          return i > _;
        case 3:
          return i >= _;
      }
    if (JSBI.__isBigInt(i) && typeof _ == "string")
      return _ = JSBI.__fromString(_), _ !== null && JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(i, _), t);
    if (typeof i == "string" && JSBI.__isBigInt(_))
      return i = JSBI.__fromString(i), i !== null && JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(i, _), t);
    if (i = JSBI.__toNumeric(i), _ = JSBI.__toNumeric(_), JSBI.__isBigInt(i)) {
      if (JSBI.__isBigInt(_))
        return JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(i, _), t);
      if (typeof _ != "number")
        throw new Error("implementation bug");
      return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(i, _), t);
    }
    if (typeof i != "number")
      throw new Error("implementation bug");
    if (JSBI.__isBigInt(_))
      return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(_, i), 2 ^ t);
    if (typeof _ != "number")
      throw new Error("implementation bug");
    return t === 0 ? i < _ : t === 1 ? i <= _ : t === 2 ? i > _ : t === 3 ? i >= _ : void 0;
  }
  __clzmsd() {
    return JSBI.__clz30(this.__digit(this.length - 1));
  }
  static __absoluteAdd(_, t, e) {
    if (_.length < t.length)
      return JSBI.__absoluteAdd(t, _, e);
    if (_.length === 0)
      return _;
    if (t.length === 0)
      return _.sign === e ? _ : JSBI.unaryMinus(_);
    let n = _.length;
    (_.__clzmsd() === 0 || t.length === _.length && t.__clzmsd() === 0) && n++;
    const g = new JSBI(n, e);
    let s = 0, o = 0;
    for (; o < t.length; o++) {
      const i = _.__digit(o) + t.__digit(o) + s;
      s = i >>> 30, g.__setDigit(o, 1073741823 & i);
    }
    for (; o < _.length; o++) {
      const i = _.__digit(o) + s;
      s = i >>> 30, g.__setDigit(o, 1073741823 & i);
    }
    return o < g.length && g.__setDigit(o, s), g.__trim();
  }
  static __absoluteSub(_, t, e) {
    if (_.length === 0)
      return _;
    if (t.length === 0)
      return _.sign === e ? _ : JSBI.unaryMinus(_);
    const n = new JSBI(_.length, e);
    let g = 0, s = 0;
    for (; s < t.length; s++) {
      const i = _.__digit(s) - t.__digit(s) - g;
      g = 1 & i >>> 30, n.__setDigit(s, 1073741823 & i);
    }
    for (; s < _.length; s++) {
      const i = _.__digit(s) - g;
      g = 1 & i >>> 30, n.__setDigit(s, 1073741823 & i);
    }
    return n.__trim();
  }
  static __absoluteAddOne(_, i, t = null) {
    const e = _.length;
    t === null ? t = new JSBI(e, i) : t.sign = i;
    let n = 1;
    for (let g = 0; g < e; g++) {
      const i2 = _.__digit(g) + n;
      n = i2 >>> 30, t.__setDigit(g, 1073741823 & i2);
    }
    return n != 0 && t.__setDigitGrow(e, 1), t;
  }
  static __absoluteSubOne(_, t) {
    const e = _.length;
    t = t || e;
    const n = new JSBI(t, false);
    let g = 1;
    for (let s = 0; s < e; s++) {
      const i = _.__digit(s) - g;
      g = 1 & i >>> 30, n.__setDigit(s, 1073741823 & i);
    }
    if (g != 0)
      throw new Error("implementation bug");
    for (let g2 = e; g2 < t; g2++)
      n.__setDigit(g2, 0);
    return n;
  }
  static __absoluteAnd(_, t, e = null) {
    let n = _.length, g = t.length, s = g;
    if (n < g) {
      s = n;
      const i = _, e2 = n;
      _ = t, n = g, t = i, g = e2;
    }
    let o = s;
    e === null ? e = new JSBI(o, false) : o = e.length;
    let l = 0;
    for (; l < s; l++)
      e.__setDigit(l, _.__digit(l) & t.__digit(l));
    for (; l < o; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteAndNot(_, t, e = null) {
    const n = _.length, g = t.length;
    let s = g;
    n < g && (s = n);
    let o = n;
    e === null ? e = new JSBI(o, false) : o = e.length;
    let l = 0;
    for (; l < s; l++)
      e.__setDigit(l, _.__digit(l) & ~t.__digit(l));
    for (; l < n; l++)
      e.__setDigit(l, _.__digit(l));
    for (; l < o; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteOr(_, t, e = null) {
    let n = _.length, g = t.length, s = g;
    if (n < g) {
      s = n;
      const i = _, e2 = n;
      _ = t, n = g, t = i, g = e2;
    }
    let o = n;
    e === null ? e = new JSBI(o, false) : o = e.length;
    let l = 0;
    for (; l < s; l++)
      e.__setDigit(l, _.__digit(l) | t.__digit(l));
    for (; l < n; l++)
      e.__setDigit(l, _.__digit(l));
    for (; l < o; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteXor(_, t, e = null) {
    let n = _.length, g = t.length, s = g;
    if (n < g) {
      s = n;
      const i = _, e2 = n;
      _ = t, n = g, t = i, g = e2;
    }
    let o = n;
    e === null ? e = new JSBI(o, false) : o = e.length;
    let l = 0;
    for (; l < s; l++)
      e.__setDigit(l, _.__digit(l) ^ t.__digit(l));
    for (; l < n; l++)
      e.__setDigit(l, _.__digit(l));
    for (; l < o; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteCompare(_, t) {
    const e = _.length - t.length;
    if (e != 0)
      return e;
    let n = _.length - 1;
    for (; 0 <= n && _.__digit(n) === t.__digit(n); )
      n--;
    return 0 > n ? 0 : _.__unsignedDigit(n) > t.__unsignedDigit(n) ? 1 : -1;
  }
  static __multiplyAccumulate(_, t, e, n) {
    if (t === 0)
      return;
    const g = 32767 & t, s = t >>> 15;
    let o = 0, l = 0;
    for (let r, a = 0; a < _.length; a++, n++) {
      r = e.__digit(n);
      const i = _.__digit(a), t2 = 32767 & i, u = i >>> 15, d = JSBI.__imul(t2, g), h = JSBI.__imul(t2, s), m = JSBI.__imul(u, g), b = JSBI.__imul(u, s);
      r += l + d + o, o = r >>> 30, r &= 1073741823, r += ((32767 & h) << 15) + ((32767 & m) << 15), o += r >>> 30, l = b + (h >>> 15) + (m >>> 15), e.__setDigit(n, 1073741823 & r);
    }
    for (; o != 0 || l !== 0; n++) {
      let i = e.__digit(n);
      i += o + l, l = 0, o = i >>> 30, e.__setDigit(n, 1073741823 & i);
    }
  }
  static __internalMultiplyAdd(_, t, e, g, s) {
    let o = e, l = 0;
    for (let n = 0; n < g; n++) {
      const i = _.__digit(n), e2 = JSBI.__imul(32767 & i, t), g2 = JSBI.__imul(i >>> 15, t), a = e2 + ((32767 & g2) << 15) + l + o;
      o = a >>> 30, l = g2 >>> 15, s.__setDigit(n, 1073741823 & a);
    }
    if (s.length > g)
      for (s.__setDigit(g++, o + l); g < s.length; )
        s.__setDigit(g++, 0);
    else if (o + l !== 0)
      throw new Error("implementation bug");
  }
  __inplaceMultiplyAdd(i, _, t) {
    t > this.length && (t = this.length);
    const e = 32767 & i, n = i >>> 15;
    let g = 0, s = _;
    for (let o = 0; o < t; o++) {
      const i2 = this.__digit(o), _2 = 32767 & i2, t2 = i2 >>> 15, l = JSBI.__imul(_2, e), r = JSBI.__imul(_2, n), a = JSBI.__imul(t2, e), u = JSBI.__imul(t2, n);
      let d = s + l + g;
      g = d >>> 30, d &= 1073741823, d += ((32767 & r) << 15) + ((32767 & a) << 15), g += d >>> 30, s = u + (r >>> 15) + (a >>> 15), this.__setDigit(o, 1073741823 & d);
    }
    if (g != 0 || s !== 0)
      throw new Error("implementation bug");
  }
  static __absoluteDivSmall(_, t, e = null) {
    e === null && (e = new JSBI(_.length, false));
    let n = 0;
    for (let g, s = 2 * _.length - 1; 0 <= s; s -= 2) {
      g = (n << 15 | _.__halfDigit(s)) >>> 0;
      const i = 0 | g / t;
      n = 0 | g % t, g = (n << 15 | _.__halfDigit(s - 1)) >>> 0;
      const o = 0 | g / t;
      n = 0 | g % t, e.__setDigit(s >>> 1, i << 15 | o);
    }
    return e;
  }
  static __absoluteModSmall(_, t) {
    let e = 0;
    for (let n = 2 * _.length - 1; 0 <= n; n--) {
      const i = (e << 15 | _.__halfDigit(n)) >>> 0;
      e = 0 | i % t;
    }
    return e;
  }
  static __absoluteDivLarge(i, _, t, e) {
    const g = _.__halfDigitLength(), n = _.length, s = i.__halfDigitLength() - g;
    let o = null;
    t && (o = new JSBI(s + 2 >>> 1, false), o.__initializeDigits());
    const l = new JSBI(g + 2 >>> 1, false);
    l.__initializeDigits();
    const r = JSBI.__clz15(_.__halfDigit(g - 1));
    0 < r && (_ = JSBI.__specialLeftShift(_, r, 0));
    const a = JSBI.__specialLeftShift(i, r, 1), u = _.__halfDigit(g - 1);
    let d = 0;
    for (let r2, h = s; 0 <= h; h--) {
      r2 = 32767;
      const i2 = a.__halfDigit(h + g);
      if (i2 !== u) {
        const t2 = (i2 << 15 | a.__halfDigit(h + g - 1)) >>> 0;
        r2 = 0 | t2 / u;
        let e3 = 0 | t2 % u;
        const n2 = _.__halfDigit(g - 2), s2 = a.__halfDigit(h + g - 2);
        for (; JSBI.__imul(r2, n2) >>> 0 > (e3 << 16 | s2) >>> 0 && (r2--, e3 += u, !(32767 < e3)); )
          ;
      }
      JSBI.__internalMultiplyAdd(_, r2, 0, n, l);
      let e2 = a.__inplaceSub(l, h, g + 1);
      e2 !== 0 && (e2 = a.__inplaceAdd(_, h, g), a.__setHalfDigit(h + g, 32767 & a.__halfDigit(h + g) + e2), r2--), t && (1 & h ? d = r2 << 15 : o.__setDigit(h >>> 1, d | r2));
    }
    if (e)
      return a.__inplaceRightShift(r), t ? { quotient: o, remainder: a } : a;
    if (t)
      return o;
    throw new Error("unreachable");
  }
  static __clz15(i) {
    return JSBI.__clz30(i) - 15;
  }
  __inplaceAdd(_, t, e) {
    let n = 0;
    for (let g = 0; g < e; g++) {
      const i = this.__halfDigit(t + g) + _.__halfDigit(g) + n;
      n = i >>> 15, this.__setHalfDigit(t + g, 32767 & i);
    }
    return n;
  }
  __inplaceSub(_, t, e) {
    let n = 0;
    if (1 & t) {
      t >>= 1;
      let g = this.__digit(t), s = 32767 & g, o = 0;
      for (; o < e - 1 >>> 1; o++) {
        const i2 = _.__digit(o), e2 = (g >>> 15) - (32767 & i2) - n;
        n = 1 & e2 >>> 15, this.__setDigit(t + o, (32767 & e2) << 15 | 32767 & s), g = this.__digit(t + o + 1), s = (32767 & g) - (i2 >>> 15) - n, n = 1 & s >>> 15;
      }
      const i = _.__digit(o), l = (g >>> 15) - (32767 & i) - n;
      n = 1 & l >>> 15, this.__setDigit(t + o, (32767 & l) << 15 | 32767 & s);
      if (t + o + 1 >= this.length)
        throw new RangeError("out of bounds");
      (1 & e) == 0 && (g = this.__digit(t + o + 1), s = (32767 & g) - (i >>> 15) - n, n = 1 & s >>> 15, this.__setDigit(t + _.length, 1073709056 & g | 32767 & s));
    } else {
      t >>= 1;
      let g = 0;
      for (; g < _.length - 1; g++) {
        const i2 = this.__digit(t + g), e2 = _.__digit(g), s2 = (32767 & i2) - (32767 & e2) - n;
        n = 1 & s2 >>> 15;
        const o2 = (i2 >>> 15) - (e2 >>> 15) - n;
        n = 1 & o2 >>> 15, this.__setDigit(t + g, (32767 & o2) << 15 | 32767 & s2);
      }
      const i = this.__digit(t + g), s = _.__digit(g), o = (32767 & i) - (32767 & s) - n;
      n = 1 & o >>> 15;
      let l = 0;
      (1 & e) == 0 && (l = (i >>> 15) - (s >>> 15) - n, n = 1 & l >>> 15), this.__setDigit(t + g, (32767 & l) << 15 | 32767 & o);
    }
    return n;
  }
  __inplaceRightShift(_) {
    if (_ === 0)
      return;
    let t = this.__digit(0) >>> _;
    const e = this.length - 1;
    for (let n = 0; n < e; n++) {
      const i = this.__digit(n + 1);
      this.__setDigit(n, 1073741823 & i << 30 - _ | t), t = i >>> _;
    }
    this.__setDigit(e, t);
  }
  static __specialLeftShift(_, t, e) {
    const g = _.length, n = new JSBI(g + e, false);
    if (t === 0) {
      for (let t2 = 0; t2 < g; t2++)
        n.__setDigit(t2, _.__digit(t2));
      return 0 < e && n.__setDigit(g, 0), n;
    }
    let s = 0;
    for (let o = 0; o < g; o++) {
      const i = _.__digit(o);
      n.__setDigit(o, 1073741823 & i << t | s), s = i >>> 30 - t;
    }
    return 0 < e && n.__setDigit(g, s), n;
  }
  static __leftShiftByAbsolute(_, i) {
    const t = JSBI.__toShiftAmount(i);
    if (0 > t)
      throw new RangeError("BigInt too big");
    const e = 0 | t / 30, n = t % 30, g = _.length, s = n !== 0 && _.__digit(g - 1) >>> 30 - n != 0, o = g + e + (s ? 1 : 0), l = new JSBI(o, _.sign);
    if (n === 0) {
      let t2 = 0;
      for (; t2 < e; t2++)
        l.__setDigit(t2, 0);
      for (; t2 < o; t2++)
        l.__setDigit(t2, _.__digit(t2 - e));
    } else {
      let t2 = 0;
      for (let _2 = 0; _2 < e; _2++)
        l.__setDigit(_2, 0);
      for (let s2 = 0; s2 < g; s2++) {
        const i2 = _.__digit(s2);
        l.__setDigit(s2 + e, 1073741823 & i2 << n | t2), t2 = i2 >>> 30 - n;
      }
      if (s)
        l.__setDigit(g + e, t2);
      else if (t2 !== 0)
        throw new Error("implementation bug");
    }
    return l.__trim();
  }
  static __rightShiftByAbsolute(_, i) {
    const t = _.length, e = _.sign, n = JSBI.__toShiftAmount(i);
    if (0 > n)
      return JSBI.__rightShiftByMaximum(e);
    const g = 0 | n / 30, s = n % 30;
    let o = t - g;
    if (0 >= o)
      return JSBI.__rightShiftByMaximum(e);
    let l = false;
    if (e) {
      if ((_.__digit(g) & (1 << s) - 1) != 0)
        l = true;
      else
        for (let t2 = 0; t2 < g; t2++)
          if (_.__digit(t2) !== 0) {
            l = true;
            break;
          }
    }
    if (l && s === 0) {
      const i2 = _.__digit(t - 1);
      ~i2 == 0 && o++;
    }
    let r = new JSBI(o, e);
    if (s === 0) {
      r.__setDigit(o - 1, 0);
      for (let e2 = g; e2 < t; e2++)
        r.__setDigit(e2 - g, _.__digit(e2));
    } else {
      let e2 = _.__digit(g) >>> s;
      const n2 = t - g - 1;
      for (let t2 = 0; t2 < n2; t2++) {
        const i2 = _.__digit(t2 + g + 1);
        r.__setDigit(t2, 1073741823 & i2 << 30 - s | e2), e2 = i2 >>> s;
      }
      r.__setDigit(n2, e2);
    }
    return l && (r = JSBI.__absoluteAddOne(r, true, r)), r.__trim();
  }
  static __rightShiftByMaximum(i) {
    return i ? JSBI.__oneDigit(1, true) : JSBI.__zero();
  }
  static __toShiftAmount(i) {
    if (1 < i.length)
      return -1;
    const _ = i.__unsignedDigit(0);
    return _ > JSBI.__kMaxLengthBits ? -1 : _;
  }
  static __toPrimitive(i, _ = "default") {
    if (typeof i != "object")
      return i;
    if (i.constructor === JSBI)
      return i;
    if (typeof Symbol != "undefined" && typeof Symbol.toPrimitive == "symbol") {
      const t2 = i[Symbol.toPrimitive];
      if (t2) {
        const i2 = t2(_);
        if (typeof i2 != "object")
          return i2;
        throw new TypeError("Cannot convert object to primitive value");
      }
    }
    const t = i.valueOf;
    if (t) {
      const _2 = t.call(i);
      if (typeof _2 != "object")
        return _2;
    }
    const e = i.toString;
    if (e) {
      const _2 = e.call(i);
      if (typeof _2 != "object")
        return _2;
    }
    throw new TypeError("Cannot convert object to primitive value");
  }
  static __toNumeric(i) {
    return JSBI.__isBigInt(i) ? i : +i;
  }
  static __isBigInt(i) {
    return typeof i == "object" && i !== null && i.constructor === JSBI;
  }
  static __truncateToNBits(i, _) {
    const t = 0 | (i + 29) / 30, e = new JSBI(t, _.sign), n = t - 1;
    for (let t2 = 0; t2 < n; t2++)
      e.__setDigit(t2, _.__digit(t2));
    let g = _.__digit(n);
    if (i % 30 != 0) {
      const _2 = 32 - i % 30;
      g = g << _2 >>> _2;
    }
    return e.__setDigit(n, g), e.__trim();
  }
  static __truncateAndSubFromPowerOfTwo(_, t, e) {
    var n = Math.min;
    const g = 0 | (_ + 29) / 30, s = new JSBI(g, e);
    let o = 0;
    const l = g - 1;
    let a = 0;
    for (const i = n(l, t.length); o < i; o++) {
      const i2 = 0 - t.__digit(o) - a;
      a = 1 & i2 >>> 30, s.__setDigit(o, 1073741823 & i2);
    }
    for (; o < l; o++)
      s.__setDigit(o, 0 | 1073741823 & -a);
    let u = l < t.length ? t.__digit(l) : 0;
    const d = _ % 30;
    let h;
    if (d == 0)
      h = 0 - u - a, h &= 1073741823;
    else {
      const i = 32 - d;
      u = u << i >>> i;
      const _2 = 1 << 32 - i;
      h = _2 - u - a, h &= _2 - 1;
    }
    return s.__setDigit(l, h), s.__trim();
  }
  __digit(_) {
    return this[_];
  }
  __unsignedDigit(_) {
    return this[_] >>> 0;
  }
  __setDigit(_, i) {
    this[_] = 0 | i;
  }
  __setDigitGrow(_, i) {
    this[_] = 0 | i;
  }
  __halfDigitLength() {
    const i = this.length;
    return 32767 >= this.__unsignedDigit(i - 1) ? 2 * i - 1 : 2 * i;
  }
  __halfDigit(_) {
    return 32767 & this[_ >>> 1] >>> 15 * (1 & _);
  }
  __setHalfDigit(_, i) {
    const t = _ >>> 1, e = this.__digit(t), n = 1 & _ ? 32767 & e | i << 15 : 1073709056 & e | 32767 & i;
    this.__setDigit(t, n);
  }
  static __digitPow(i, _) {
    let t = 1;
    for (; 0 < _; )
      1 & _ && (t *= i), _ >>>= 1, i *= i;
    return t;
  }
  static __isOneDigitInt(i) {
    return (1073741823 & i) === i;
  }
}
JSBI.__kMaxLength = 33554432, JSBI.__kMaxLengthBits = JSBI.__kMaxLength << 5, JSBI.__kMaxBitsPerChar = [0, 0, 32, 51, 64, 75, 83, 90, 96, 102, 107, 111, 115, 119, 122, 126, 128, 131, 134, 136, 139, 141, 143, 145, 147, 149, 151, 153, 154, 156, 158, 159, 160, 162, 163, 165, 166], JSBI.__kBitsPerCharTableShift = 5, JSBI.__kBitsPerCharTableMultiplier = 1 << JSBI.__kBitsPerCharTableShift, JSBI.__kConversionChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], JSBI.__kBitConversionBuffer = new ArrayBuffer(8), JSBI.__kBitConversionDouble = new Float64Array(JSBI.__kBitConversionBuffer), JSBI.__kBitConversionInts = new Int32Array(JSBI.__kBitConversionBuffer), JSBI.__clz30 = Math.clz32 ? function(i) {
  return Math.clz32(i) - 2;
} : function(i) {
  return i === 0 ? 30 : 0 | 29 - (0 | Math.log(i >>> 0) / Math.LN2);
}, JSBI.__imul = Math.imul || function(i, _) {
  return 0 | i * _;
};
const INTRINSICS = {};
const customUtilInspectFormatters = {
  ["Temporal.Duration"](depth, options) {
    const descr = options.stylize(`${this[Symbol.toStringTag]} <${this}>`, "special");
    if (depth < 1)
      return descr;
    const entries = [];
    for (const prop of [
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds",
      "microseconds",
      "nanoseconds"
    ]) {
      if (this[prop] !== 0)
        entries.push(`  ${prop}: ${options.stylize(this[prop], "number")}`);
    }
    return descr + " {\n" + entries.join(",\n") + "\n}";
  }
};
function defaultUtilInspectFormatter(depth, options) {
  return options.stylize(`${this[Symbol.toStringTag]} <${this}>`, "special");
}
function MakeIntrinsicClass(Class, name) {
  Object.defineProperty(Class.prototype, Symbol.toStringTag, {
    value: name,
    writable: false,
    enumerable: false,
    configurable: true
  });
  {
    Object.defineProperty(Class.prototype, Symbol.for("nodejs.util.inspect.custom"), {
      value: customUtilInspectFormatters[name] || defaultUtilInspectFormatter,
      writable: false,
      enumerable: false,
      configurable: true
    });
  }
  for (const prop of Object.getOwnPropertyNames(Class)) {
    const desc = Object.getOwnPropertyDescriptor(Class, prop);
    if (!desc.configurable || !desc.enumerable)
      continue;
    desc.enumerable = false;
    Object.defineProperty(Class, prop, desc);
  }
  for (const prop of Object.getOwnPropertyNames(Class.prototype)) {
    const desc = Object.getOwnPropertyDescriptor(Class.prototype, prop);
    if (!desc.configurable || !desc.enumerable)
      continue;
    desc.enumerable = false;
    Object.defineProperty(Class.prototype, prop, desc);
  }
  DefineIntrinsic(name, Class);
  DefineIntrinsic(`${name}.prototype`, Class.prototype);
}
function DefineIntrinsic(name, value) {
  const key = `%${name}%`;
  if (INTRINSICS[key] !== void 0)
    throw new Error(`intrinsic ${name} already exists`);
  INTRINSICS[key] = value;
}
function GetIntrinsic(intrinsic) {
  return INTRINSICS[intrinsic];
}
const EPOCHNANOSECONDS = "slot-epochNanoSeconds";
const TIMEZONE_ID = "slot-timezone-identifier";
const ISO_YEAR = "slot-year";
const ISO_MONTH = "slot-month";
const ISO_DAY = "slot-day";
const ISO_HOUR = "slot-hour";
const ISO_MINUTE = "slot-minute";
const ISO_SECOND = "slot-second";
const ISO_MILLISECOND = "slot-millisecond";
const ISO_MICROSECOND = "slot-microsecond";
const ISO_NANOSECOND = "slot-nanosecond";
const CALENDAR = "slot-calendar";
const DATE_BRAND = "slot-date-brand";
const YEAR_MONTH_BRAND = "slot-year-month-brand";
const MONTH_DAY_BRAND = "slot-month-day-brand";
const INSTANT = "slot-cached-instant";
const TIME_ZONE = "slot-time-zone";
const YEARS = "slot-years";
const MONTHS = "slot-months";
const WEEKS = "slot-weeks";
const DAYS = "slot-days";
const HOURS = "slot-hours";
const MINUTES = "slot-minutes";
const SECONDS = "slot-seconds";
const MILLISECONDS = "slot-milliseconds";
const MICROSECONDS = "slot-microseconds";
const NANOSECONDS = "slot-nanoseconds";
const CALENDAR_ID = "slot-calendar-identifier";
const slots = /* @__PURE__ */ new WeakMap();
function CreateSlots(container) {
  slots.set(container, /* @__PURE__ */ Object.create(null));
}
function GetSlots(container) {
  return slots.get(container);
}
function HasSlot(container, ...ids) {
  if (!container || typeof container !== "object")
    return false;
  const myslots = GetSlots(container);
  return !!myslots && ids.reduce((all, id) => all && id in myslots, true);
}
function GetSlot(container, id) {
  const value = GetSlots(container)[id];
  if (value === void 0)
    throw new TypeError(`Missing internal slot ${id}`);
  return value;
}
function SetSlot(container, id, value) {
  GetSlots(container)[id] = value;
}
const ArrayIncludes = Array.prototype.includes;
const ArrayPrototypePush$2 = Array.prototype.push;
const IntlDateTimeFormat$2 = globalThis.Intl.DateTimeFormat;
const ArraySort = Array.prototype.sort;
const MathAbs$1 = Math.abs;
const MathFloor$1 = Math.floor;
const ObjectEntries = Object.entries;
const ObjectKeys = Object.keys;
const impl = {};
class Calendar {
  constructor(idParam) {
    if (arguments.length < 1) {
      throw new RangeError("missing argument: id is required");
    }
    const id = ToString(idParam);
    if (!IsBuiltinCalendar(id))
      throw new RangeError(`invalid calendar identifier ${id}`);
    CreateSlots(this);
    SetSlot(this, CALENDAR_ID, id);
    {
      Object.defineProperty(this, "_repr_", {
        value: `${this[Symbol.toStringTag]} <${id}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get id() {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    return ToString(this);
  }
  dateFromFields(fields, optionsParam = void 0) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(fields))
      throw new TypeError("invalid fields");
    const options = GetOptionsObject(optionsParam);
    return impl[GetSlot(this, CALENDAR_ID)].dateFromFields(fields, options, this);
  }
  yearMonthFromFields(fields, optionsParam = void 0) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(fields))
      throw new TypeError("invalid fields");
    const options = GetOptionsObject(optionsParam);
    return impl[GetSlot(this, CALENDAR_ID)].yearMonthFromFields(fields, options, this);
  }
  monthDayFromFields(fields, optionsParam = void 0) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(fields))
      throw new TypeError("invalid fields");
    const options = GetOptionsObject(optionsParam);
    return impl[GetSlot(this, CALENDAR_ID)].monthDayFromFields(fields, options, this);
  }
  fields(fields) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    const fieldsArray = [];
    const allowed = /* @__PURE__ */ new Set([
      "year",
      "month",
      "monthCode",
      "day",
      "hour",
      "minute",
      "second",
      "millisecond",
      "microsecond",
      "nanosecond"
    ]);
    for (const name of fields) {
      if (typeof name !== "string")
        throw new TypeError("invalid fields");
      if (!allowed.has(name))
        throw new RangeError(`invalid field name ${name}`);
      allowed.delete(name);
      ArrayPrototypePush$2.call(fieldsArray, name);
    }
    return impl[GetSlot(this, CALENDAR_ID)].fields(fieldsArray);
  }
  mergeFields(fields, additionalFields) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    return impl[GetSlot(this, CALENDAR_ID)].mergeFields(fields, additionalFields);
  }
  dateAdd(dateParam, durationParam, optionsParam = void 0) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    const date = ToTemporalDate(dateParam);
    const duration2 = ToTemporalDuration(durationParam);
    const options = GetOptionsObject(optionsParam);
    const overflow = ToTemporalOverflow(options);
    const { days } = BalanceDuration(GetSlot(duration2, DAYS), GetSlot(duration2, HOURS), GetSlot(duration2, MINUTES), GetSlot(duration2, SECONDS), GetSlot(duration2, MILLISECONDS), GetSlot(duration2, MICROSECONDS), GetSlot(duration2, NANOSECONDS), "day");
    return impl[GetSlot(this, CALENDAR_ID)].dateAdd(date, GetSlot(duration2, YEARS), GetSlot(duration2, MONTHS), GetSlot(duration2, WEEKS), days, overflow, this);
  }
  dateUntil(oneParam, twoParam, optionsParam = void 0) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    const one = ToTemporalDate(oneParam);
    const two = ToTemporalDate(twoParam);
    const options = GetOptionsObject(optionsParam);
    const largestUnit = ToLargestTemporalUnit(options, "auto", ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"], "day");
    const { years, months, weeks, days } = impl[GetSlot(this, CALENDAR_ID)].dateUntil(one, two, largestUnit);
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  year(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].year(date);
  }
  month(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (IsTemporalMonthDay(date))
      throw new TypeError("use monthCode on PlainMonthDay instead");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].month(date);
  }
  monthCode(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date) && !IsTemporalMonthDay(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].monthCode(date);
  }
  day(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalMonthDay(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].day(date);
  }
  era(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].era(date);
  }
  eraYear(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].eraYear(date);
  }
  dayOfWeek(dateParam) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    const date = ToTemporalDate(dateParam);
    return impl[GetSlot(this, CALENDAR_ID)].dayOfWeek(date);
  }
  dayOfYear(dateParam) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    const date = ToTemporalDate(dateParam);
    return impl[GetSlot(this, CALENDAR_ID)].dayOfYear(date);
  }
  weekOfYear(dateParam) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    const date = ToTemporalDate(dateParam);
    return impl[GetSlot(this, CALENDAR_ID)].weekOfYear(date);
  }
  daysInWeek(dateParam) {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    const date = ToTemporalDate(dateParam);
    return impl[GetSlot(this, CALENDAR_ID)].daysInWeek(date);
  }
  daysInMonth(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].daysInMonth(date);
  }
  daysInYear(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].daysInYear(date);
  }
  monthsInYear(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].monthsInYear(date);
  }
  inLeapYear(dateParam) {
    let date = dateParam;
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    if (!IsTemporalYearMonth(date))
      date = ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].inLeapYear(date);
  }
  toString() {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, CALENDAR_ID);
  }
  toJSON() {
    if (!IsTemporalCalendar(this))
      throw new TypeError("invalid receiver");
    return ToString(this);
  }
  static from(item) {
    return ToTemporalCalendar(item);
  }
}
MakeIntrinsicClass(Calendar, "Temporal.Calendar");
DefineIntrinsic("Temporal.Calendar.from", Calendar.from);
impl["iso8601"] = {
  dateFromFields(fieldsParam, options, calendar2) {
    const overflow = ToTemporalOverflow(options);
    let fields = PrepareTemporalFields(fieldsParam, [
      ["day"],
      ["month", void 0],
      ["monthCode", void 0],
      ["year"]
    ]);
    fields = resolveNonLunisolarMonth(fields);
    let { year, month, day } = fields;
    ({ year, month, day } = RegulateISODate(year, month, day, overflow));
    return CreateTemporalDate(year, month, day, calendar2);
  },
  yearMonthFromFields(fieldsParam, options, calendar2) {
    const overflow = ToTemporalOverflow(options);
    let fields = PrepareTemporalFields(fieldsParam, [
      ["month", void 0],
      ["monthCode", void 0],
      ["year"]
    ]);
    fields = resolveNonLunisolarMonth(fields);
    let { year, month } = fields;
    ({ year, month } = RegulateISOYearMonth(year, month, overflow));
    return CreateTemporalYearMonth(year, month, calendar2, 1);
  },
  monthDayFromFields(fieldsParam, options, calendar2) {
    const overflow = ToTemporalOverflow(options);
    let fields = PrepareTemporalFields(fieldsParam, [
      ["day"],
      ["month", void 0],
      ["monthCode", void 0],
      ["year", void 0]
    ]);
    if (fields.month !== void 0 && fields.year === void 0 && fields.monthCode === void 0) {
      throw new TypeError("either year or monthCode required with month");
    }
    const useYear = fields.monthCode === void 0;
    const referenceISOYear = 1972;
    fields = resolveNonLunisolarMonth(fields);
    let { month, day, year } = fields;
    ({ month, day } = RegulateISODate(useYear ? year : referenceISOYear, month, day, overflow));
    return CreateTemporalMonthDay(month, day, calendar2, referenceISOYear);
  },
  fields(fields) {
    return fields;
  },
  mergeFields(fields, additionalFields) {
    const merged = {};
    for (const nextKey of ObjectKeys(fields)) {
      if (nextKey === "month" || nextKey === "monthCode")
        continue;
      merged[nextKey] = fields[nextKey];
    }
    const newKeys = ObjectKeys(additionalFields);
    for (const nextKey of newKeys) {
      merged[nextKey] = additionalFields[nextKey];
    }
    if (!ArrayIncludes.call(newKeys, "month") && !ArrayIncludes.call(newKeys, "monthCode")) {
      const { month, monthCode } = fields;
      if (month !== void 0)
        merged.month = month;
      if (monthCode !== void 0)
        merged.monthCode = monthCode;
    }
    return merged;
  },
  dateAdd(date, years, months, weeks, days, overflow, calendar2) {
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    ({ year, month, day } = AddISODate(year, month, day, years, months, weeks, days, overflow));
    return CreateTemporalDate(year, month, day, calendar2);
  },
  dateUntil(one, two, largestUnit) {
    return DifferenceISODate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY), largestUnit);
  },
  year(date) {
    return GetSlot(date, ISO_YEAR);
  },
  era() {
    return void 0;
  },
  eraYear() {
    return void 0;
  },
  month(date) {
    return GetSlot(date, ISO_MONTH);
  },
  monthCode(date) {
    return buildMonthCode(GetSlot(date, ISO_MONTH));
  },
  day(date) {
    return GetSlot(date, ISO_DAY);
  },
  dayOfWeek(date) {
    return DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  dayOfYear(date) {
    return DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  weekOfYear(date) {
    return WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  daysInWeek() {
    return 7;
  },
  daysInMonth(date) {
    return ISODaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
  },
  daysInYear(dateParam) {
    let date = dateParam;
    if (!HasSlot(date, ISO_YEAR))
      date = ToTemporalDate(date);
    return LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
  },
  monthsInYear() {
    return 12;
  },
  inLeapYear(dateParam) {
    let date = dateParam;
    if (!HasSlot(date, ISO_YEAR))
      date = ToTemporalDate(date);
    return LeapYear(GetSlot(date, ISO_YEAR));
  }
};
function monthCodeNumberPart(monthCode) {
  if (!monthCode.startsWith("M")) {
    throw new RangeError(`Invalid month code: ${monthCode}.  Month codes must start with M.`);
  }
  const month = +monthCode.slice(1);
  if (isNaN(month))
    throw new RangeError(`Invalid month code: ${monthCode}`);
  return month;
}
function buildMonthCode(month, leap = false) {
  return `M${month.toString().padStart(2, "0")}${leap ? "L" : ""}`;
}
function resolveNonLunisolarMonth(calendarDate, overflow = void 0, monthsPerYear = 12) {
  let { month, monthCode } = calendarDate;
  if (monthCode === void 0) {
    if (month === void 0)
      throw new TypeError("Either month or monthCode are required");
    if (overflow === "reject")
      RejectToRange(month, 1, monthsPerYear);
    if (overflow === "constrain")
      month = ConstrainToRange(month, 1, monthsPerYear);
    monthCode = buildMonthCode(month);
  } else {
    const numberPart = monthCodeNumberPart(monthCode);
    if (month !== void 0 && month !== numberPart) {
      throw new RangeError(`monthCode ${monthCode} and month ${month} must match if both are present`);
    }
    if (monthCode !== buildMonthCode(numberPart)) {
      throw new RangeError(`Invalid month code: ${monthCode}`);
    }
    month = numberPart;
    if (month < 1 || month > monthsPerYear)
      throw new RangeError(`Invalid monthCode: ${monthCode}`);
  }
  return __spreadProps(__spreadValues({}, calendarDate), { month, monthCode });
}
class OneObjectCache {
  constructor(cacheToClone) {
    this.map = /* @__PURE__ */ new Map();
    this.calls = 0;
    this.hits = 0;
    this.misses = 0;
    this.now = globalThis.performance ? globalThis.performance.now() : Date.now();
    if (cacheToClone !== void 0) {
      let i = 0;
      for (const entry of cacheToClone.map.entries()) {
        if (++i > OneObjectCache.MAX_CACHE_ENTRIES)
          break;
        this.map.set(...entry);
      }
    }
  }
  get(key) {
    const result = this.map.get(key);
    if (result) {
      this.hits++;
      this.report();
    }
    this.calls++;
    return result;
  }
  set(key, value) {
    this.map.set(key, value);
    this.misses++;
    this.report();
  }
  report() {
  }
  setObject(obj) {
    if (OneObjectCache.objectMap.get(obj))
      throw new RangeError("object already cached");
    OneObjectCache.objectMap.set(obj, this);
    this.report();
  }
  static getCacheForObject(obj) {
    let cache = OneObjectCache.objectMap.get(obj);
    if (!cache) {
      cache = new OneObjectCache();
      OneObjectCache.objectMap.set(obj, cache);
    }
    return cache;
  }
}
OneObjectCache.objectMap = /* @__PURE__ */ new WeakMap();
OneObjectCache.MAX_CACHE_ENTRIES = 1e3;
function toUtcIsoDateString({ isoYear, isoMonth, isoDay }) {
  const yearString = ISOYearString(isoYear);
  const monthString = ISODateTimePartString(isoMonth);
  const dayString = ISODateTimePartString(isoDay);
  return `${yearString}-${monthString}-${dayString}T00:00Z`;
}
function simpleDateDiff(one, two) {
  return {
    years: one.year - two.year,
    months: one.month - two.month,
    days: one.day - two.day
  };
}
class HelperBase {
  constructor() {
    this.eraLength = "short";
    this.hasEra = true;
  }
  getFormatter() {
    if (typeof this.formatter === "undefined") {
      this.formatter = new IntlDateTimeFormat$2(`en-US-u-ca-${this.id}`, {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        era: this.eraLength,
        timeZone: "UTC"
      });
    }
    return this.formatter;
  }
  isoToCalendarDate(isoDate, cache) {
    const { year: isoYear, month: isoMonth, day: isoDay } = isoDate;
    const key = JSON.stringify({ func: "isoToCalendarDate", isoYear, isoMonth, isoDay, id: this.id });
    const cached = cache.get(key);
    if (cached)
      return cached;
    const dateTimeFormat = this.getFormatter();
    let parts, isoString;
    try {
      isoString = toUtcIsoDateString({ isoYear, isoMonth, isoDay });
      parts = dateTimeFormat.formatToParts(new Date(isoString));
    } catch (e) {
      throw new RangeError(`Invalid ISO date: ${JSON.stringify({ isoYear, isoMonth, isoDay })}`);
    }
    const result = {};
    for (let { type, value } of parts) {
      if (type === "year")
        result.eraYear = +value;
      if (type === "relatedYear")
        result.eraYear = +value;
      if (type === "month") {
        const matches = /^([0-9]*)(.*?)$/.exec(value);
        if (!matches || matches.length != 3 || !matches[1] && !matches[2]) {
          throw new RangeError(`Unexpected month: ${value}`);
        }
        result.month = matches[1] ? +matches[1] : 1;
        if (result.month < 1) {
          throw new RangeError(`Invalid month ${value} from ${isoString}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)`);
        }
        if (result.month > 13) {
          throw new RangeError(`Invalid month ${value} from ${isoString}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
        }
        if (matches[2])
          result.monthExtra = matches[2];
      }
      if (type === "day")
        result.day = +value;
      if (this.hasEra && type === "era" && value != null && value !== "") {
        value = value.split(" (")[0];
        result.era = value.normalize("NFD").replace(/[^-0-9 \p{L}]/gu, "").replace(" ", "-").toLowerCase();
      }
    }
    if (result.eraYear === void 0) {
      throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
    }
    if (this.reviseIntlEra) {
      const { era, eraYear } = this.reviseIntlEra(result, isoDate);
      result.era = era;
      result.eraYear = eraYear;
    }
    if (this.checkIcuBugs)
      this.checkIcuBugs(isoDate);
    const calendarDate = this.adjustCalendarDate(result, cache, "constrain", true);
    if (calendarDate.year === void 0)
      throw new RangeError(`Missing year converting ${JSON.stringify(isoDate)}`);
    if (calendarDate.month === void 0)
      throw new RangeError(`Missing month converting ${JSON.stringify(isoDate)}`);
    if (calendarDate.day === void 0)
      throw new RangeError(`Missing day converting ${JSON.stringify(isoDate)}`);
    cache.set(key, calendarDate);
    ["constrain", "reject"].forEach((overflow) => {
      const keyReverse = JSON.stringify({
        func: "calendarToIsoDate",
        year: calendarDate.year,
        month: calendarDate.month,
        day: calendarDate.day,
        overflow,
        id: this.id
      });
      cache.set(keyReverse, isoDate);
    });
    return calendarDate;
  }
  validateCalendarDate(calendarDate) {
    const { era, month, year, day, eraYear, monthCode, monthExtra } = calendarDate;
    if (monthExtra !== void 0)
      throw new RangeError("Unexpected `monthExtra` value");
    if (year === void 0 && eraYear === void 0)
      throw new TypeError("year or eraYear is required");
    if (month === void 0 && monthCode === void 0)
      throw new TypeError("month or monthCode is required");
    if (day === void 0)
      throw new RangeError("Missing day");
    if (monthCode !== void 0) {
      if (typeof monthCode !== "string") {
        throw new RangeError(`monthCode must be a string, not ${typeof monthCode}`);
      }
      if (!/^M([01]?\d)(L?)$/.test(monthCode))
        throw new RangeError(`Invalid monthCode: ${monthCode}`);
    }
    if (this.constantEra) {
      if (era !== void 0 && era !== this.constantEra) {
        throw new RangeError(`era must be ${this.constantEra}, not ${era}`);
      }
      if (eraYear !== void 0 && year !== void 0 && eraYear !== year) {
        throw new RangeError(`eraYear ${eraYear} does not match year ${year}`);
      }
    }
  }
  adjustCalendarDate(calendarDateParam, cache = void 0, overflow = "constrain", fromLegacyDate = false) {
    if (this.calendarType === "lunisolar")
      throw new RangeError("Override required for lunisolar calendars");
    let calendarDate = calendarDateParam;
    this.validateCalendarDate(calendarDate);
    if (this.constantEra) {
      const { year, eraYear } = calendarDate;
      calendarDate = __spreadProps(__spreadValues({}, calendarDate), {
        era: this.constantEra,
        year: year !== void 0 ? year : eraYear,
        eraYear: eraYear !== void 0 ? eraYear : year
      });
    }
    const largestMonth = this.monthsInYear(calendarDate, cache);
    let { month, monthCode } = calendarDate;
    ({ month, monthCode } = resolveNonLunisolarMonth(calendarDate, overflow, largestMonth));
    return __spreadProps(__spreadValues({}, calendarDate), { month, monthCode });
  }
  regulateMonthDayNaive(calendarDate, overflow, cache) {
    const largestMonth = this.monthsInYear(calendarDate, cache);
    let { month, day } = calendarDate;
    if (overflow === "reject") {
      RejectToRange(month, 1, largestMonth);
      RejectToRange(day, 1, this.maximumMonthLength(calendarDate));
    } else {
      month = ConstrainToRange(month, 1, largestMonth);
      day = ConstrainToRange(day, 1, this.maximumMonthLength(__spreadProps(__spreadValues({}, calendarDate), { month })));
    }
    return __spreadProps(__spreadValues({}, calendarDate), { month, day });
  }
  calendarToIsoDate(dateParam, overflow = "constrain", cache) {
    const originalDate = dateParam;
    let date = this.adjustCalendarDate(dateParam, cache, overflow, false);
    date = this.regulateMonthDayNaive(date, overflow, cache);
    const { year, month, day } = date;
    const key = JSON.stringify({ func: "calendarToIsoDate", year, month, day, overflow, id: this.id });
    let cached = cache.get(key);
    if (cached)
      return cached;
    let keyOriginal;
    if (originalDate.year !== void 0 && originalDate.month !== void 0 && originalDate.day !== void 0 && (originalDate.year !== date.year || originalDate.month !== date.month || originalDate.day !== date.day)) {
      keyOriginal = JSON.stringify({
        func: "calendarToIsoDate",
        year: originalDate.year,
        month: originalDate.month,
        day: originalDate.day,
        overflow,
        id: this.id
      });
      cached = cache.get(keyOriginal);
      if (cached)
        return cached;
    }
    let isoEstimate = this.estimateIsoDate({ year, month, day });
    const calculateSameMonthResult = (diffDays) => {
      let testIsoEstimate = this.addDaysIso(isoEstimate, diffDays);
      if (date.day > this.minimumMonthLength(date)) {
        let testCalendarDate = this.isoToCalendarDate(testIsoEstimate, cache);
        while (testCalendarDate.month !== month || testCalendarDate.year !== year) {
          if (overflow === "reject") {
            throw new RangeError(`day ${day} does not exist in month ${month} of year ${year}`);
          }
          testIsoEstimate = this.addDaysIso(testIsoEstimate, -1);
          testCalendarDate = this.isoToCalendarDate(testIsoEstimate, cache);
        }
      }
      return testIsoEstimate;
    };
    let sign = 0;
    let roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
    let diff = simpleDateDiff(date, roundtripEstimate);
    if (diff.years !== 0 || diff.months !== 0 || diff.days !== 0) {
      const diffTotalDaysEstimate = diff.years * 365 + diff.months * 30 + diff.days;
      isoEstimate = this.addDaysIso(isoEstimate, diffTotalDaysEstimate);
      roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
      diff = simpleDateDiff(date, roundtripEstimate);
      if (diff.years === 0 && diff.months === 0) {
        isoEstimate = calculateSameMonthResult(diff.days);
      } else {
        sign = this.compareCalendarDates(date, roundtripEstimate);
      }
    }
    let increment = 8;
    let maybeConstrained = false;
    while (sign) {
      isoEstimate = this.addDaysIso(isoEstimate, sign * increment);
      const oldRoundtripEstimate = roundtripEstimate;
      roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
      const oldSign = sign;
      sign = this.compareCalendarDates(date, roundtripEstimate);
      if (sign) {
        diff = simpleDateDiff(date, roundtripEstimate);
        if (diff.years === 0 && diff.months === 0) {
          isoEstimate = calculateSameMonthResult(diff.days);
          sign = 0;
          maybeConstrained = date.day > this.minimumMonthLength(date);
        } else if (oldSign && sign !== oldSign) {
          if (increment > 1) {
            increment /= 2;
          } else {
            if (overflow === "reject") {
              throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify(__spreadValues({}, originalDate))}`);
            } else {
              const order = this.compareCalendarDates(roundtripEstimate, oldRoundtripEstimate);
              if (order > 0)
                isoEstimate = this.addDaysIso(isoEstimate, -1);
              maybeConstrained = true;
              sign = 0;
            }
          }
        }
      }
    }
    cache.set(key, isoEstimate);
    if (keyOriginal)
      cache.set(keyOriginal, isoEstimate);
    if (date.year === void 0 || date.month === void 0 || date.day === void 0 || date.monthCode === void 0 || this.hasEra && (date.era === void 0 || date.eraYear === void 0)) {
      throw new RangeError("Unexpected missing property");
    }
    if (!maybeConstrained) {
      const keyReverse = JSON.stringify({
        func: "isoToCalendarDate",
        isoYear: isoEstimate.year,
        isoMonth: isoEstimate.month,
        isoDay: isoEstimate.day,
        id: this.id
      });
      cache.set(keyReverse, date);
    }
    return isoEstimate;
  }
  temporalToCalendarDate(date, cache) {
    const isoDate = { year: GetSlot(date, ISO_YEAR), month: GetSlot(date, ISO_MONTH), day: GetSlot(date, ISO_DAY) };
    const result = this.isoToCalendarDate(isoDate, cache);
    return result;
  }
  compareCalendarDates(date1Param, date2Param) {
    const date1 = PrepareTemporalFields(date1Param, [["day"], ["month"], ["year"]]);
    const date2 = PrepareTemporalFields(date2Param, [["day"], ["month"], ["year"]]);
    if (date1.year !== date2.year)
      return ComparisonResult(date1.year - date2.year);
    if (date1.month !== date2.month)
      return ComparisonResult(date1.month - date2.month);
    if (date1.day !== date2.day)
      return ComparisonResult(date1.day - date2.day);
    return 0;
  }
  regulateDate(calendarDate, overflow = "constrain", cache) {
    const isoDate = this.calendarToIsoDate(calendarDate, overflow, cache);
    return this.isoToCalendarDate(isoDate, cache);
  }
  addDaysIso(isoDate, days) {
    const added = AddISODate(isoDate.year, isoDate.month, isoDate.day, 0, 0, 0, days, "constrain");
    return added;
  }
  addDaysCalendar(calendarDate, days, cache) {
    const isoDate = this.calendarToIsoDate(calendarDate, "constrain", cache);
    const addedIso = this.addDaysIso(isoDate, days);
    const addedCalendar = this.isoToCalendarDate(addedIso, cache);
    return addedCalendar;
  }
  addMonthsCalendar(calendarDateParam, months, overflow, cache) {
    let calendarDate = calendarDateParam;
    const { day } = calendarDate;
    for (let i = 0, absMonths = MathAbs$1(months); i < absMonths; i++) {
      const { month } = calendarDate;
      const oldCalendarDate = calendarDate;
      const days = months < 0 ? -Math.max(day, this.daysInPreviousMonth(calendarDate, cache)) : this.daysInMonth(calendarDate, cache);
      const isoDate = this.calendarToIsoDate(calendarDate, "constrain", cache);
      let addedIso = this.addDaysIso(isoDate, days);
      calendarDate = this.isoToCalendarDate(addedIso, cache);
      if (months > 0) {
        const monthsInOldYear = this.monthsInYear(oldCalendarDate, cache);
        while (calendarDate.month - 1 !== month % monthsInOldYear) {
          addedIso = this.addDaysIso(addedIso, -1);
          calendarDate = this.isoToCalendarDate(addedIso, cache);
        }
      }
      if (calendarDate.day !== day) {
        calendarDate = this.regulateDate(__spreadProps(__spreadValues({}, calendarDate), { day }), "constrain", cache);
      }
    }
    if (overflow === "reject" && calendarDate.day !== day) {
      throw new RangeError(`Day ${day} does not exist in resulting calendar month`);
    }
    return calendarDate;
  }
  addCalendar(calendarDate, { years = 0, months = 0, weeks = 0, days = 0 }, overflow, cache) {
    const { year, month, day } = calendarDate;
    const addedMonths = this.addMonthsCalendar({ year: year + years, month, day }, months, overflow, cache);
    const initialDays = days + weeks * 7;
    const addedDays = this.addDaysCalendar(addedMonths, initialDays, cache);
    return addedDays;
  }
  untilCalendar(calendarOne, calendarTwo, largestUnit, cache) {
    let days = 0;
    let weeks = 0;
    let months = 0;
    let years = 0;
    switch (largestUnit) {
      case "day":
        days = this.calendarDaysUntil(calendarOne, calendarTwo, cache);
        break;
      case "week": {
        const totalDays = this.calendarDaysUntil(calendarOne, calendarTwo, cache);
        days = totalDays % 7;
        weeks = (totalDays - days) / 7;
        break;
      }
      case "month":
      case "year": {
        const diffYears = calendarTwo.year - calendarOne.year;
        const diffMonths = calendarTwo.month - calendarOne.month;
        const diffDays = calendarTwo.day - calendarOne.day;
        const sign = this.compareCalendarDates(calendarTwo, calendarOne);
        if (largestUnit === "year" && diffYears) {
          const isOneFurtherInYear = diffMonths * sign < 0 || diffMonths === 0 && diffDays * sign < 0;
          years = isOneFurtherInYear ? diffYears - sign : diffYears;
        }
        const yearsAdded = years ? this.addCalendar(calendarOne, { years }, "constrain", cache) : calendarOne;
        let current;
        let next = yearsAdded;
        do {
          months += sign;
          current = next;
          next = this.addMonthsCalendar(current, sign, "constrain", cache);
          if (next.day !== calendarOne.day) {
            next = this.regulateDate(__spreadProps(__spreadValues({}, next), { day: calendarOne.day }), "constrain", cache);
          }
        } while (this.compareCalendarDates(calendarTwo, next) * sign >= 0);
        months -= sign;
        const remainingDays = this.calendarDaysUntil(current, calendarTwo, cache);
        days = remainingDays;
        break;
      }
    }
    return { years, months, weeks, days };
  }
  daysInMonth(calendarDate, cache) {
    const { day } = calendarDate;
    const max = this.maximumMonthLength(calendarDate);
    const min = this.minimumMonthLength(calendarDate);
    if (min === max)
      return min;
    const increment = day <= max - min ? max : min;
    const isoDate = this.calendarToIsoDate(calendarDate, "constrain", cache);
    const addedIsoDate = this.addDaysIso(isoDate, increment);
    const addedCalendarDate = this.isoToCalendarDate(addedIsoDate, cache);
    const endOfMonthIso = this.addDaysIso(addedIsoDate, -addedCalendarDate.day);
    const endOfMonthCalendar = this.isoToCalendarDate(endOfMonthIso, cache);
    return endOfMonthCalendar.day;
  }
  daysInPreviousMonth(calendarDate, cache) {
    const { day, month, year } = calendarDate;
    const previousMonthYear = month > 1 ? year : year - 1;
    let previousMonthDate = { year: previousMonthYear, month, day: 1 };
    const previousMonth = month > 1 ? month - 1 : this.monthsInYear(previousMonthDate, cache);
    previousMonthDate = __spreadProps(__spreadValues({}, previousMonthDate), { month: previousMonth });
    const min = this.minimumMonthLength(previousMonthDate);
    const max = this.maximumMonthLength(previousMonthDate);
    if (min === max)
      return max;
    const isoDate = this.calendarToIsoDate(calendarDate, "constrain", cache);
    const lastDayOfPreviousMonthIso = this.addDaysIso(isoDate, -day);
    const lastDayOfPreviousMonthCalendar = this.isoToCalendarDate(lastDayOfPreviousMonthIso, cache);
    return lastDayOfPreviousMonthCalendar.day;
  }
  startOfCalendarYear(calendarDate) {
    return { year: calendarDate.year, month: 1, day: 1 };
  }
  startOfCalendarMonth(calendarDate) {
    return { year: calendarDate.year, month: calendarDate.month, day: 1 };
  }
  calendarDaysUntil(calendarOne, calendarTwo, cache) {
    const oneIso = this.calendarToIsoDate(calendarOne, "constrain", cache);
    const twoIso = this.calendarToIsoDate(calendarTwo, "constrain", cache);
    return this.isoDaysUntil(oneIso, twoIso);
  }
  isoDaysUntil(oneIso, twoIso) {
    const duration2 = DifferenceISODate(oneIso.year, oneIso.month, oneIso.day, twoIso.year, twoIso.month, twoIso.day, "day");
    return duration2.days;
  }
  monthDayFromFields(fields, overflow, cache) {
    let { year, month, monthCode, day, era, eraYear } = fields;
    if (monthCode === void 0) {
      if (year === void 0 && (era === void 0 || eraYear === void 0)) {
        throw new TypeError("`monthCode`, `year`, or `era` and `eraYear` is required");
      }
      ({ monthCode, year } = this.adjustCalendarDate({ year, month, monthCode, day, era, eraYear }, cache, overflow));
    }
    let isoYear, isoMonth, isoDay;
    let closestCalendar, closestIso;
    const startDateIso = { year: 1972, month: 1, day: 1 };
    const { year: calendarYear } = this.isoToCalendarDate(startDateIso, cache);
    for (let i = 0; i < 100; i++) {
      const testCalendarDate = this.adjustCalendarDate({ day, monthCode, year: calendarYear - i }, cache);
      const isoDate = this.calendarToIsoDate(testCalendarDate, "constrain", cache);
      const roundTripCalendarDate = this.isoToCalendarDate(isoDate, cache);
      ({ year: isoYear, month: isoMonth, day: isoDay } = isoDate);
      if (roundTripCalendarDate.monthCode === monthCode && roundTripCalendarDate.day === day) {
        return { month: isoMonth, day: isoDay, year: isoYear };
      } else if (overflow === "constrain") {
        if (closestCalendar === void 0 || roundTripCalendarDate.monthCode === closestCalendar.monthCode && roundTripCalendarDate.day > closestCalendar.day) {
          closestCalendar = roundTripCalendarDate;
          closestIso = isoDate;
        }
      }
    }
    if (overflow === "constrain" && closestIso !== void 0)
      return closestIso;
    throw new RangeError(`No recent ${this.id} year with monthCode ${monthCode} and day ${day}`);
  }
}
class HebrewHelper extends HelperBase {
  constructor() {
    super(...arguments);
    this.id = "hebrew";
    this.calendarType = "lunisolar";
    this.months = {
      Tishri: { leap: 1, regular: 1, monthCode: "M01", days: 30 },
      Heshvan: { leap: 2, regular: 2, monthCode: "M02", days: { min: 29, max: 30 } },
      Kislev: { leap: 3, regular: 3, monthCode: "M03", days: { min: 29, max: 30 } },
      Tevet: { leap: 4, regular: 4, monthCode: "M04", days: 29 },
      Shevat: { leap: 5, regular: 5, monthCode: "M05", days: 30 },
      Adar: { leap: void 0, regular: 6, monthCode: "M06", days: 29 },
      "Adar I": { leap: 6, regular: void 0, monthCode: "M05L", days: 30 },
      "Adar II": { leap: 7, regular: void 0, monthCode: "M06", days: 29 },
      Nisan: { leap: 8, regular: 7, monthCode: "M07", days: 30 },
      Iyar: { leap: 9, regular: 8, monthCode: "M08", days: 29 },
      Sivan: { leap: 10, regular: 9, monthCode: "M09", days: 30 },
      Tamuz: { leap: 11, regular: 10, monthCode: "M10", days: 29 },
      Av: { leap: 12, regular: 11, monthCode: "M11", days: 30 },
      Elul: { leap: 13, regular: 12, monthCode: "M12", days: 29 }
    };
    this.hasEra = false;
  }
  inLeapYear(calendarDate) {
    const { year } = calendarDate;
    return (7 * year + 1) % 19 < 7;
  }
  monthsInYear(calendarDate) {
    return this.inLeapYear(calendarDate) ? 13 : 12;
  }
  minimumMonthLength(calendarDate) {
    return this.minMaxMonthLength(calendarDate, "min");
  }
  maximumMonthLength(calendarDate) {
    return this.minMaxMonthLength(calendarDate, "max");
  }
  minMaxMonthLength(calendarDate, minOrMax) {
    const { month, year } = calendarDate;
    const monthCode = this.getMonthCode(year, month);
    const monthInfo = ObjectEntries(this.months).find((m) => m[1].monthCode === monthCode);
    if (monthInfo === void 0)
      throw new RangeError(`unmatched Hebrew month: ${month}`);
    const daysInMonth = monthInfo[1].days;
    return typeof daysInMonth === "number" ? daysInMonth : daysInMonth[minOrMax];
  }
  estimateIsoDate(calendarDate) {
    const { year } = calendarDate;
    return { year: year - 3760, month: 1, day: 1 };
  }
  getMonthCode(year, month) {
    if (this.inLeapYear({ year })) {
      return month === 6 ? buildMonthCode(5, true) : buildMonthCode(month < 6 ? month : month - 1);
    } else {
      return buildMonthCode(month);
    }
  }
  adjustCalendarDate(calendarDate, cache, overflow = "constrain", fromLegacyDate = false) {
    let { year, eraYear, month, monthCode, day, monthExtra } = calendarDate;
    if (year === void 0 && eraYear !== void 0)
      year = eraYear;
    if (eraYear === void 0 && year !== void 0)
      eraYear = year;
    if (fromLegacyDate) {
      if (monthExtra) {
        const monthInfo = this.months[monthExtra];
        if (!monthInfo)
          throw new RangeError(`Unrecognized month from formatToParts: ${monthExtra}`);
        month = this.inLeapYear({ year }) ? monthInfo.leap : monthInfo.regular;
      }
      monthCode = this.getMonthCode(year, month);
      const result = { year, month, day, era: void 0, eraYear, monthCode };
      return result;
    } else {
      this.validateCalendarDate(calendarDate);
      if (month === void 0) {
        if (monthCode.endsWith("L")) {
          if (monthCode !== "M05L") {
            throw new RangeError(`Hebrew leap month must have monthCode M05L, not ${monthCode}`);
          }
          month = 6;
          if (!this.inLeapYear({ year })) {
            if (overflow === "reject") {
              throw new RangeError(`Hebrew monthCode M05L is invalid in year ${year} which is not a leap year`);
            } else {
              month = 5;
              day = 30;
              monthCode = "M05";
            }
          }
        } else {
          month = monthCodeNumberPart(monthCode);
          if (this.inLeapYear({ year }) && month > 6)
            month++;
          const largestMonth = this.monthsInYear({ year });
          if (month < 1 || month > largestMonth)
            throw new RangeError(`Invalid monthCode: ${monthCode}`);
        }
      } else {
        if (overflow === "reject") {
          RejectToRange(month, 1, this.monthsInYear({ year }));
          RejectToRange(day, 1, this.maximumMonthLength({ year, month }));
        } else {
          month = ConstrainToRange(month, 1, this.monthsInYear({ year }));
          day = ConstrainToRange(day, 1, this.maximumMonthLength({ year, month }));
        }
        if (monthCode === void 0) {
          monthCode = this.getMonthCode(year, month);
        } else {
          const calculatedMonthCode = this.getMonthCode(year, month);
          if (calculatedMonthCode !== monthCode) {
            throw new RangeError(`monthCode ${monthCode} doesn't correspond to month ${month} in Hebrew year ${year}`);
          }
        }
      }
      return __spreadProps(__spreadValues({}, calendarDate), { day, month, monthCode, year, eraYear });
    }
  }
}
class IslamicBaseHelper extends HelperBase {
  constructor() {
    super(...arguments);
    this.calendarType = "lunar";
    this.DAYS_PER_ISLAMIC_YEAR = 354 + 11 / 30;
    this.DAYS_PER_ISO_YEAR = 365.2425;
    this.constantEra = "ah";
  }
  inLeapYear(calendarDate, cache) {
    const days = this.daysInMonth({ year: calendarDate.year, month: 12, day: 1 }, cache);
    return days === 30;
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength() {
    return 29;
  }
  maximumMonthLength() {
    return 30;
  }
  estimateIsoDate(calendarDate) {
    const { year } = this.adjustCalendarDate(calendarDate);
    return { year: MathFloor$1(year * this.DAYS_PER_ISLAMIC_YEAR / this.DAYS_PER_ISO_YEAR) + 622, month: 1, day: 1 };
  }
}
class IslamicHelper extends IslamicBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "islamic";
  }
}
class IslamicUmalquraHelper extends IslamicBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "islamic-umalqura";
  }
}
class IslamicTblaHelper extends IslamicBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "islamic-tbla";
  }
}
class IslamicCivilHelper extends IslamicBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "islamic-civil";
  }
}
class IslamicRgsaHelper extends IslamicBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "islamic-rgsa";
  }
}
class IslamicCcHelper extends IslamicBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "islamicc";
  }
}
class PersianHelper extends HelperBase {
  constructor() {
    super(...arguments);
    this.id = "persian";
    this.calendarType = "solar";
    this.constantEra = "ap";
  }
  inLeapYear(calendarDate, cache) {
    return IslamicHelper.prototype.inLeapYear.call(this, calendarDate, cache);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(calendarDate) {
    const { month } = calendarDate;
    if (month === 12)
      return 29;
    return month <= 6 ? 31 : 30;
  }
  maximumMonthLength(calendarDate) {
    const { month } = calendarDate;
    if (month === 12)
      return 30;
    return month <= 6 ? 31 : 30;
  }
  estimateIsoDate(calendarDate) {
    const { year } = this.adjustCalendarDate(calendarDate);
    return { year: year + 621, month: 1, day: 1 };
  }
}
class IndianHelper extends HelperBase {
  constructor() {
    super(...arguments);
    this.id = "indian";
    this.calendarType = "solar";
    this.constantEra = "saka";
    this.months = {
      1: { length: 30, month: 3, day: 22, leap: { length: 31, month: 3, day: 21 } },
      2: { length: 31, month: 4, day: 21 },
      3: { length: 31, month: 5, day: 22 },
      4: { length: 31, month: 6, day: 22 },
      5: { length: 31, month: 7, day: 23 },
      6: { length: 31, month: 8, day: 23 },
      7: { length: 30, month: 9, day: 23 },
      8: { length: 30, month: 10, day: 23 },
      9: { length: 30, month: 11, day: 22 },
      10: { length: 30, month: 12, day: 22 },
      11: { length: 30, month: 1, nextYear: true, day: 21 },
      12: { length: 30, month: 2, nextYear: true, day: 20 }
    };
    this.vulnerableToBceBug = new Date("0000-01-01T00:00Z").toLocaleDateString("en-US-u-ca-indian", { timeZone: "UTC" }) !== "10/11/-79 Saka";
  }
  inLeapYear(calendarDate) {
    return isGregorianLeapYear(calendarDate.year + 78);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(calendarDate) {
    return this.getMonthInfo(calendarDate).length;
  }
  maximumMonthLength(calendarDate) {
    return this.getMonthInfo(calendarDate).length;
  }
  getMonthInfo(calendarDate) {
    const { month } = calendarDate;
    let monthInfo = this.months[month];
    if (monthInfo === void 0)
      throw new RangeError(`Invalid month: ${month}`);
    if (this.inLeapYear(calendarDate) && monthInfo.leap)
      monthInfo = monthInfo.leap;
    return monthInfo;
  }
  estimateIsoDate(calendarDateParam) {
    const calendarDate = this.adjustCalendarDate(calendarDateParam);
    const monthInfo = this.getMonthInfo(calendarDate);
    const isoYear = calendarDate.year + 78 + (monthInfo.nextYear ? 1 : 0);
    const isoMonth = monthInfo.month;
    const isoDay = monthInfo.day;
    const isoDate = AddISODate(isoYear, isoMonth, isoDay, 0, 0, 0, calendarDate.day - 1, "constrain");
    return isoDate;
  }
  checkIcuBugs(isoDate) {
    if (this.vulnerableToBceBug && isoDate.year < 1) {
      throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 0001-01-01 (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
    }
  }
}
function adjustEras(erasParam) {
  let eras = erasParam;
  if (eras.length === 0) {
    throw new RangeError("Invalid era data: eras are required");
  }
  if (eras.length === 1 && eras[0].reverseOf) {
    throw new RangeError("Invalid era data: anchor era cannot count years backwards");
  }
  if (eras.length === 1 && !eras[0].name) {
    throw new RangeError("Invalid era data: at least one named era is required");
  }
  if (eras.filter((e) => e.reverseOf != null).length > 1) {
    throw new RangeError("Invalid era data: only one era can count years backwards");
  }
  let anchorEra;
  eras.forEach((e) => {
    if (e.isAnchor || !e.anchorEpoch && !e.reverseOf) {
      if (anchorEra)
        throw new RangeError("Invalid era data: cannot have multiple anchor eras");
      anchorEra = e;
      e.anchorEpoch = { year: e.hasYearZero ? 0 : 1 };
    } else if (!e.name) {
      throw new RangeError("If era name is blank, it must be the anchor era");
    }
  });
  eras = eras.filter((e) => e.name);
  eras.forEach((e) => {
    const { reverseOf } = e;
    if (reverseOf) {
      const reversedEra = eras.find((era) => era.name === reverseOf);
      if (reversedEra === void 0)
        throw new RangeError(`Invalid era data: unmatched reverseOf era: ${reverseOf}`);
      e.reverseOf = reversedEra;
      e.anchorEpoch = reversedEra.anchorEpoch;
      e.isoEpoch = reversedEra.isoEpoch;
    }
    if (e.anchorEpoch.month === void 0)
      e.anchorEpoch.month = 1;
    if (e.anchorEpoch.day === void 0)
      e.anchorEpoch.day = 1;
  });
  ArraySort.call(eras, (e1, e2) => {
    if (e1.reverseOf)
      return 1;
    if (e2.reverseOf)
      return -1;
    if (!e1.isoEpoch || !e2.isoEpoch)
      throw new RangeError("Invalid era data: missing ISO epoch");
    return e2.isoEpoch.year - e1.isoEpoch.year;
  });
  const lastEraReversed = eras[eras.length - 1].reverseOf;
  if (lastEraReversed) {
    if (lastEraReversed !== eras[eras.length - 2])
      throw new RangeError("Invalid era data: invalid reverse-sign era");
  }
  eras.forEach((e, i) => {
    e.genericName = `era${eras.length - 1 - i}`;
  });
  return { eras, anchorEra: anchorEra || eras[0] };
}
function isGregorianLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
class GregorianBaseHelper extends HelperBase {
  constructor(id, originalEras) {
    super();
    this.calendarType = "solar";
    this.v8IsVulnerableToJulianBug = new Date("+001001-01-01T00:00Z").toLocaleDateString("en-US-u-ca-japanese", { timeZone: "UTC" }).startsWith("12");
    this.calendarIsVulnerableToJulianBug = false;
    this.id = id;
    const { eras, anchorEra } = adjustEras(originalEras);
    this.anchorEra = anchorEra;
    this.eras = eras;
  }
  inLeapYear(calendarDate) {
    const { year } = this.estimateIsoDate({ month: 1, day: 1, year: calendarDate.year });
    return isGregorianLeapYear(year);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(calendarDate) {
    const { month } = calendarDate;
    if (month === 2)
      return this.inLeapYear(calendarDate) ? 29 : 28;
    return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31;
  }
  maximumMonthLength(calendarDate) {
    return this.minimumMonthLength(calendarDate);
  }
  completeEraYear(calendarDate) {
    const checkField = (name, value) => {
      const currentValue = calendarDate[name];
      if (currentValue != null && currentValue != value) {
        throw new RangeError(`Input ${name} ${currentValue} doesn't match calculated value ${value}`);
      }
    };
    const eraFromYear = (year2) => {
      let eraYear2;
      const adjustedCalendarDate = __spreadProps(__spreadValues({}, calendarDate), { year: year2 });
      const matchingEra = this.eras.find((e, i) => {
        if (i === this.eras.length - 1) {
          if (e.reverseOf) {
            if (year2 > 0)
              throw new RangeError(`Signed year ${year2} is invalid for era ${e.name}`);
            eraYear2 = e.anchorEpoch.year - year2;
            return true;
          }
          eraYear2 = year2 - e.anchorEpoch.year + (e.hasYearZero ? 0 : 1);
          return true;
        }
        const comparison = this.compareCalendarDates(adjustedCalendarDate, e.anchorEpoch);
        if (comparison >= 0) {
          eraYear2 = year2 - e.anchorEpoch.year + (e.hasYearZero ? 0 : 1);
          return true;
        }
        return false;
      });
      if (!matchingEra)
        throw new RangeError(`Year ${year2} was not matched by any era`);
      return { eraYear: eraYear2, era: matchingEra.name };
    };
    let { year, eraYear, era } = calendarDate;
    if (year != null) {
      ({ eraYear, era } = eraFromYear(year));
      checkField("era", era);
      checkField("eraYear", eraYear);
    } else if (eraYear != null) {
      const matchingEra = era === void 0 ? void 0 : this.eras.find((e) => e.name === era || e.genericName === era);
      if (!matchingEra)
        throw new RangeError(`Era ${era} (ISO year ${eraYear}) was not matched by any era`);
      if (eraYear < 1 && matchingEra.reverseOf) {
        throw new RangeError(`Years in ${era} era must be positive, not ${year}`);
      }
      if (matchingEra.reverseOf) {
        year = matchingEra.anchorEpoch.year - eraYear;
      } else {
        year = eraYear + matchingEra.anchorEpoch.year - (matchingEra.hasYearZero ? 0 : 1);
      }
      checkField("year", year);
      ({ eraYear, era } = eraFromYear(year));
    } else {
      throw new RangeError("Either `year` or `eraYear` and `era` are required");
    }
    return __spreadProps(__spreadValues({}, calendarDate), { year, eraYear, era });
  }
  adjustCalendarDate(calendarDateParam, cache, overflow = "constrain") {
    let calendarDate = calendarDateParam;
    const { month, monthCode } = calendarDate;
    if (month === void 0)
      calendarDate = __spreadProps(__spreadValues({}, calendarDate), { month: monthCodeNumberPart(monthCode) });
    this.validateCalendarDate(calendarDate);
    calendarDate = this.completeEraYear(calendarDate);
    return super.adjustCalendarDate(calendarDate, cache, overflow);
  }
  estimateIsoDate(calendarDateParam) {
    const calendarDate = this.adjustCalendarDate(calendarDateParam);
    const { year, month, day } = calendarDate;
    const { anchorEra } = this;
    const isoYearEstimate = year + anchorEra.isoEpoch.year - (anchorEra.hasYearZero ? 0 : 1);
    return RegulateISODate(isoYearEstimate, month, day, "constrain");
  }
  checkIcuBugs(isoDate) {
    if (this.calendarIsVulnerableToJulianBug && this.v8IsVulnerableToJulianBug) {
      const beforeJulianSwitch = CompareISODate(isoDate.year, isoDate.month, isoDate.day, 1582, 10, 15) < 0;
      if (beforeJulianSwitch) {
        throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 1582-10-15 (see https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)`);
      }
    }
  }
}
class OrthodoxBaseHelper extends GregorianBaseHelper {
  constructor(id, originalEras) {
    super(id, originalEras);
  }
  inLeapYear(calendarDate) {
    const { year } = calendarDate;
    return (year + 1) % 4 === 0;
  }
  monthsInYear() {
    return 13;
  }
  minimumMonthLength(calendarDate) {
    const { month } = calendarDate;
    if (month === 13)
      return this.inLeapYear(calendarDate) ? 6 : 5;
    return 30;
  }
  maximumMonthLength(calendarDate) {
    return this.minimumMonthLength(calendarDate);
  }
}
class EthioaaHelper extends OrthodoxBaseHelper {
  constructor() {
    super("ethioaa", [{ name: "era0", isoEpoch: { year: -5492, month: 7, day: 17 } }]);
  }
}
class CopticHelper extends OrthodoxBaseHelper {
  constructor() {
    super("coptic", [
      { name: "era1", isoEpoch: { year: 284, month: 8, day: 29 } },
      { name: "era0", reverseOf: "era1" }
    ]);
  }
}
class EthiopicHelper extends OrthodoxBaseHelper {
  constructor() {
    super("ethiopic", [
      { name: "era0", isoEpoch: { year: -5492, month: 7, day: 17 } },
      { name: "era1", isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }
    ]);
  }
}
class RocHelper extends GregorianBaseHelper {
  constructor() {
    super("roc", [
      { name: "minguo", isoEpoch: { year: 1912, month: 1, day: 1 } },
      { name: "before-roc", reverseOf: "minguo" }
    ]);
    this.calendarIsVulnerableToJulianBug = true;
  }
}
class BuddhistHelper extends GregorianBaseHelper {
  constructor() {
    super("buddhist", [{ name: "be", hasYearZero: true, isoEpoch: { year: -543, month: 1, day: 1 } }]);
    this.calendarIsVulnerableToJulianBug = true;
  }
}
class GregoryHelper extends GregorianBaseHelper {
  constructor() {
    super("gregory", [
      { name: "ce", isoEpoch: { year: 1, month: 1, day: 1 } },
      { name: "bce", reverseOf: "ce" }
    ]);
  }
  reviseIntlEra(calendarDate) {
    let { era, eraYear } = calendarDate;
    if (era === "bc" || era === "b")
      era = "bce";
    if (era === "ad" || era === "a")
      era = "ce";
    return { era, eraYear };
  }
}
class JapaneseHelper extends GregorianBaseHelper {
  constructor() {
    super("japanese", [
      { name: "reiwa", isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } },
      { name: "heisei", isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } },
      { name: "showa", isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } },
      { name: "taisho", isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } },
      { name: "meiji", isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } },
      { name: "ce", isoEpoch: { year: 1, month: 1, day: 1 } },
      { name: "bce", reverseOf: "ce" }
    ]);
    this.calendarIsVulnerableToJulianBug = true;
    this.eraLength = "long";
  }
  reviseIntlEra(calendarDate, isoDate) {
    const { era, eraYear } = calendarDate;
    const { year: isoYear } = isoDate;
    if (this.eras.find((e) => e.name === era))
      return { era, eraYear };
    return isoYear < 1 ? { era: "bce", eraYear: 1 - isoYear } : { era: "ce", eraYear: isoYear };
  }
}
class ChineseBaseHelper extends HelperBase {
  constructor() {
    super(...arguments);
    this.calendarType = "lunisolar";
    this.hasEra = false;
  }
  inLeapYear(calendarDate, cache) {
    const months = this.getMonthList(calendarDate.year, cache);
    return ObjectEntries(months).length === 13;
  }
  monthsInYear(calendarDate, cache) {
    return this.inLeapYear(calendarDate, cache) ? 13 : 12;
  }
  minimumMonthLength() {
    return 29;
  }
  maximumMonthLength() {
    return 30;
  }
  getMonthList(calendarYear, cache) {
    if (calendarYear === void 0) {
      throw new TypeError("Missing year");
    }
    const key = JSON.stringify({ func: "getMonthList", calendarYear, id: this.id });
    const cached = cache.get(key);
    if (cached)
      return cached;
    const dateTimeFormat = this.getFormatter();
    const getCalendarDate = (isoYear, daysPastFeb1) => {
      const isoStringFeb1 = toUtcIsoDateString({ isoYear, isoMonth: 2, isoDay: 1 });
      const legacyDate = new Date(isoStringFeb1);
      legacyDate.setUTCDate(daysPastFeb1 + 1);
      const newYearGuess = dateTimeFormat.formatToParts(legacyDate);
      const calendarMonthString2 = newYearGuess.find((tv) => tv.type === "month").value;
      const calendarDay2 = +newYearGuess.find((tv) => tv.type === "day").value;
      let calendarYearToVerify2 = newYearGuess.find((tv) => tv.type === "relatedYear");
      if (calendarYearToVerify2 !== void 0) {
        calendarYearToVerify2 = +calendarYearToVerify2.value;
      } else {
        throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
      }
      return { calendarMonthString: calendarMonthString2, calendarDay: calendarDay2, calendarYearToVerify: calendarYearToVerify2 };
    };
    let isoDaysDelta = 17;
    let { calendarMonthString, calendarDay, calendarYearToVerify } = getCalendarDate(calendarYear, isoDaysDelta);
    if (calendarMonthString !== "1") {
      isoDaysDelta += 29;
      ({ calendarMonthString, calendarDay } = getCalendarDate(calendarYear, isoDaysDelta));
    }
    isoDaysDelta -= calendarDay - 5;
    const result = {};
    let monthIndex = 1;
    let oldCalendarDay;
    let oldMonthString;
    let done = false;
    do {
      ({ calendarMonthString, calendarDay, calendarYearToVerify } = getCalendarDate(calendarYear, isoDaysDelta));
      if (oldCalendarDay) {
        result[oldMonthString].daysInMonth = oldCalendarDay + 30 - calendarDay;
      }
      if (calendarYearToVerify !== calendarYear) {
        done = true;
      } else {
        result[calendarMonthString] = { monthIndex: monthIndex++ };
        isoDaysDelta += 30;
      }
      oldCalendarDay = calendarDay;
      oldMonthString = calendarMonthString;
    } while (!done);
    result[oldMonthString].daysInMonth = oldCalendarDay + 30 - calendarDay;
    cache.set(key, result);
    return result;
  }
  estimateIsoDate(calendarDate) {
    const { year, month } = calendarDate;
    return { year, month: month >= 12 ? 12 : month + 1, day: 1 };
  }
  adjustCalendarDate(calendarDate, cache, overflow = "constrain", fromLegacyDate = false) {
    let { year, month, monthExtra, day, monthCode, eraYear } = calendarDate;
    if (fromLegacyDate) {
      year = eraYear;
      if (monthExtra && monthExtra !== "bis")
        throw new RangeError(`Unexpected leap month suffix: ${monthExtra}`);
      const monthCode2 = buildMonthCode(month, monthExtra !== void 0);
      const monthString = `${month}${monthExtra || ""}`;
      const months = this.getMonthList(year, cache);
      const monthInfo = months[monthString];
      if (monthInfo === void 0)
        throw new RangeError(`Unmatched month ${monthString} in Chinese year ${year}`);
      month = monthInfo.monthIndex;
      return { year, month, day, era: void 0, eraYear, monthCode: monthCode2 };
    } else {
      this.validateCalendarDate(calendarDate);
      if (year === void 0)
        year = eraYear;
      if (eraYear === void 0)
        eraYear = year;
      if (month === void 0) {
        const months = this.getMonthList(year, cache);
        let numberPart = monthCode.replace("L", "bis").slice(1);
        if (numberPart[0] === "0")
          numberPart = numberPart.slice(1);
        let monthInfo = months[numberPart];
        month = monthInfo && monthInfo.monthIndex;
        if (month === void 0 && monthCode.endsWith("L") && !ArrayIncludes.call(["M01L", "M12L", "M13L"], monthCode) && overflow === "constrain") {
          let withoutML = monthCode.slice(1, -1);
          if (withoutML[0] === "0")
            withoutML = withoutML.slice(1);
          monthInfo = months[withoutML];
          if (monthInfo) {
            ({ daysInMonth: day, monthIndex: month } = monthInfo);
            monthCode = buildMonthCode(withoutML);
          }
        }
        if (month === void 0) {
          throw new RangeError(`Unmatched month ${monthCode} in Chinese year ${year}`);
        }
      } else if (monthCode === void 0) {
        const months = this.getMonthList(year, cache);
        const monthEntries = ObjectEntries(months);
        const largestMonth = monthEntries.length;
        if (overflow === "reject") {
          RejectToRange(month, 1, largestMonth);
          RejectToRange(day, 1, this.maximumMonthLength());
        } else {
          month = ConstrainToRange(month, 1, largestMonth);
          day = ConstrainToRange(day, 1, this.maximumMonthLength());
        }
        const matchingMonthEntry = monthEntries.find(([, v]) => v.monthIndex === month);
        if (matchingMonthEntry === void 0) {
          throw new RangeError(`Invalid month ${month} in Chinese year ${year}`);
        }
        monthCode = buildMonthCode(matchingMonthEntry[0].replace("bis", ""), matchingMonthEntry[0].indexOf("bis") !== -1);
      } else {
        const months = this.getMonthList(year, cache);
        let numberPart = monthCode.replace("L", "bis").slice(1);
        if (numberPart[0] === "0")
          numberPart = numberPart.slice(1);
        const monthInfo = months[numberPart];
        if (!monthInfo)
          throw new RangeError(`Unmatched monthCode ${monthCode} in Chinese year ${year}`);
        if (month !== monthInfo.monthIndex) {
          throw new RangeError(`monthCode ${monthCode} doesn't correspond to month ${month} in Chinese year ${year}`);
        }
      }
      return __spreadProps(__spreadValues({}, calendarDate), {
        year,
        eraYear,
        month,
        monthCode,
        day
      });
    }
  }
}
class ChineseHelper extends ChineseBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "chinese";
  }
}
class DangiHelper extends ChineseBaseHelper {
  constructor() {
    super(...arguments);
    this.id = "dangi";
  }
}
const nonIsoImpl = {
  helper: void 0,
  dateFromFields(fieldsParam, options, calendar2) {
    const overflow = ToTemporalOverflow(options);
    const cache = new OneObjectCache();
    const fields = PrepareTemporalFields(fieldsParam, [
      ["day"],
      ["era", void 0],
      ["eraYear", void 0],
      ["month", void 0],
      ["monthCode", void 0],
      ["year", void 0]
    ]);
    const { year, month, day } = this.helper.calendarToIsoDate(fields, overflow, cache);
    const result = CreateTemporalDate(year, month, day, calendar2);
    cache.setObject(result);
    return result;
  },
  yearMonthFromFields(fieldsParam, options, calendar2) {
    const overflow = ToTemporalOverflow(options);
    const cache = new OneObjectCache();
    const fields = PrepareTemporalFields(fieldsParam, [
      ["era", void 0],
      ["eraYear", void 0],
      ["month", void 0],
      ["monthCode", void 0],
      ["year", void 0]
    ]);
    const { year, month, day } = this.helper.calendarToIsoDate(__spreadProps(__spreadValues({}, fields), { day: 1 }), overflow, cache);
    const result = CreateTemporalYearMonth(year, month, calendar2, day);
    cache.setObject(result);
    return result;
  },
  monthDayFromFields(fieldsParam, options, calendar2) {
    const overflow = ToTemporalOverflow(options);
    const cache = new OneObjectCache();
    const fields = PrepareTemporalFields(fieldsParam, [
      ["day"],
      ["era", void 0],
      ["eraYear", void 0],
      ["month", void 0],
      ["monthCode", void 0],
      ["year", void 0]
    ]);
    const { year, month, day } = this.helper.monthDayFromFields(fields, overflow, cache);
    const result = CreateTemporalMonthDay(month, day, calendar2, year);
    cache.setObject(result);
    return result;
  },
  fields(fieldsParam) {
    let fields = fieldsParam;
    if (ArrayIncludes.call(fields, "year"))
      fields = [...fields, "era", "eraYear"];
    return fields;
  },
  mergeFields(fields, additionalFields) {
    const fieldsCopy = __spreadValues({}, fields);
    const additionalFieldsCopy = __spreadValues({}, additionalFields);
    const _a = fieldsCopy, { month, monthCode, year, era, eraYear } = _a, original = __objRest(_a, ["month", "monthCode", "year", "era", "eraYear"]);
    const { month: newMonth, monthCode: newMonthCode, year: newYear, era: newEra, eraYear: newEraYear } = additionalFieldsCopy;
    if (newMonth === void 0 && newMonthCode === void 0) {
      original.month = month;
      original.monthCode = monthCode;
    }
    if (newYear === void 0 && newEra === void 0 && newEraYear === void 0) {
      original.year = year;
    }
    return __spreadValues(__spreadValues({}, original), additionalFieldsCopy);
  },
  dateAdd(date, years, months, weeks, days, overflow, calendar2) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const added = this.helper.addCalendar(calendarDate, { years, months, weeks, days }, overflow, cache);
    const isoAdded = this.helper.calendarToIsoDate(added, "constrain", cache);
    const { year, month, day } = isoAdded;
    const newTemporalObject = CreateTemporalDate(year, month, day, calendar2);
    const newCache = new OneObjectCache(cache);
    newCache.setObject(newTemporalObject);
    return newTemporalObject;
  },
  dateUntil(one, two, largestUnit) {
    const cacheOne = OneObjectCache.getCacheForObject(one);
    const cacheTwo = OneObjectCache.getCacheForObject(two);
    const calendarOne = this.helper.temporalToCalendarDate(one, cacheOne);
    const calendarTwo = this.helper.temporalToCalendarDate(two, cacheTwo);
    const result = this.helper.untilCalendar(calendarOne, calendarTwo, largestUnit, cacheOne);
    return result;
  },
  year(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.year;
  },
  month(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.month;
  },
  day(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.day;
  },
  era(date) {
    if (!this.helper.hasEra)
      return void 0;
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.era;
  },
  eraYear(date) {
    if (!this.helper.hasEra)
      return void 0;
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.eraYear;
  },
  monthCode(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.monthCode;
  },
  dayOfWeek(date) {
    return impl["iso8601"].dayOfWeek(date);
  },
  dayOfYear(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.isoToCalendarDate(date, cache);
    const startOfYear = this.helper.startOfCalendarYear(calendarDate);
    const diffDays = this.helper.calendarDaysUntil(startOfYear, calendarDate, cache);
    return diffDays + 1;
  },
  weekOfYear(date) {
    return impl["iso8601"].weekOfYear(date);
  },
  daysInWeek(date) {
    return impl["iso8601"].daysInWeek(date);
  },
  daysInMonth(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const max = this.helper.maximumMonthLength(calendarDate);
    const min = this.helper.minimumMonthLength(calendarDate);
    if (max === min)
      return max;
    const startOfMonthCalendar = this.helper.startOfCalendarMonth(calendarDate);
    const startOfNextMonthCalendar = this.helper.addMonthsCalendar(startOfMonthCalendar, 1, "constrain", cache);
    const result = this.helper.calendarDaysUntil(startOfMonthCalendar, startOfNextMonthCalendar, cache);
    return result;
  },
  daysInYear(dateParam) {
    let date = dateParam;
    if (!HasSlot(date, ISO_YEAR))
      date = ToTemporalDate(date);
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const startOfYearCalendar = this.helper.startOfCalendarYear(calendarDate);
    const startOfNextYearCalendar = this.helper.addCalendar(startOfYearCalendar, { years: 1 }, "constrain", cache);
    const result = this.helper.calendarDaysUntil(startOfYearCalendar, startOfNextYearCalendar, cache);
    return result;
  },
  monthsInYear(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const result = this.helper.monthsInYear(calendarDate, cache);
    return result;
  },
  inLeapYear(dateParam) {
    let date = dateParam;
    if (!HasSlot(date, ISO_YEAR))
      date = ToTemporalDate(date);
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const result = this.helper.inLeapYear(calendarDate, cache);
    return result;
  }
};
for (const Helper of [
  HebrewHelper,
  PersianHelper,
  EthiopicHelper,
  EthioaaHelper,
  CopticHelper,
  ChineseHelper,
  DangiHelper,
  RocHelper,
  IndianHelper,
  BuddhistHelper,
  GregoryHelper,
  JapaneseHelper,
  IslamicHelper,
  IslamicUmalquraHelper,
  IslamicTblaHelper,
  IslamicCivilHelper,
  IslamicRgsaHelper,
  IslamicCcHelper
]) {
  const helper = new Helper();
  impl[helper.id] = __spreadProps(__spreadValues({}, nonIsoImpl), { helper });
}
const BUILTIN_CALENDAR_IDS = Object.keys(impl);
function IsBuiltinCalendar(id) {
  return ArrayIncludes.call(BUILTIN_CALENDAR_IDS, id);
}
const tzComponent = /\.[-A-Za-z_]|\.\.[-A-Za-z._]{1,12}|\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}/;
const offsetNoCapture = /(?:[+\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\d{1,9})?)?)?)/;
const timeZoneID = new RegExp(`(?:(?:${tzComponent.source})(?:\\/(?:${tzComponent.source}))*|Etc/GMT[-+]\\d{1,2}|${offsetNoCapture.source})`);
const calComponent = /[A-Za-z0-9]{3,8}/;
const calendarID = new RegExp(`(?:${calComponent.source}(?:-${calComponent.source})*)`);
const yearpart = /(?:[+\u2212-]\d{6}|\d{4})/;
const monthpart = /(?:0[1-9]|1[0-2])/;
const daypart = /(?:0[1-9]|[12]\d|3[01])/;
const datesplit = new RegExp(`(${yearpart.source})(?:-(${monthpart.source})-(${daypart.source})|(${monthpart.source})(${daypart.source}))`);
const timesplit = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
const offset = /([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/;
const zonesplit = new RegExp(`(?:([zZ])|(?:${offset.source})?)(?:\\[(${timeZoneID.source})\\])?`);
const calendar = new RegExp(`\\[u-ca=(${calendarID.source})\\]`);
const zoneddatetime = new RegExp(`^${datesplit.source}(?:(?:T|\\s+)${timesplit.source})?${zonesplit.source}(?:${calendar.source})?$`, "i");
const time = new RegExp(`^T?${timesplit.source}(?:${zonesplit.source})?(?:${calendar.source})?$`, "i");
const yearmonth = new RegExp(`^(${yearpart.source})-?(${monthpart.source})$`);
const monthday = new RegExp(`^(?:--)?(${monthpart.source})-?(${daypart.source})$`);
const fraction = /(\d+)(?:[.,](\d{1,9}))?/;
const durationDate = /(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/;
const durationTime = new RegExp(`(?:${fraction.source}H)?(?:${fraction.source}M)?(?:${fraction.source}S)?`);
const duration = new RegExp(`^([+\u2212-])?P${durationDate.source}(?:T(?!$)${durationTime.source})?$`, "i");
const ArrayPrototypePush$1 = Array.prototype.push;
const IntlDateTimeFormat$1 = globalThis.Intl.DateTimeFormat;
const MathMin = Math.min;
const MathMax = Math.max;
const MathAbs = Math.abs;
const MathFloor = Math.floor;
const MathSign = Math.sign;
const MathTrunc = Math.trunc;
const NumberIsNaN = Number.isNaN;
const NumberIsFinite = Number.isFinite;
const NumberCtor = Number;
const StringCtor = String;
const NumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
const ObjectCreate$2 = Object.create;
const ObjectDefineProperty = Object.defineProperty;
const ObjectIs = Object.is;
const ReflectApply$1 = Reflect.apply;
const ZERO = JSBI.BigInt(0);
const ONE = JSBI.BigInt(1);
const SIXTY = JSBI.BigInt(60);
const THOUSAND = JSBI.BigInt(1e3);
const MILLION = JSBI.BigInt(1e6);
const BILLION = JSBI.BigInt(1e9);
const NEGATIVE_ONE = JSBI.BigInt(-1);
const DAY_SECONDS = 86400;
const DAY_NANOS = JSBI.multiply(JSBI.BigInt(DAY_SECONDS), BILLION);
const NS_MIN = JSBI.multiply(JSBI.BigInt(-86400), JSBI.BigInt(1e17));
const NS_MAX = JSBI.multiply(JSBI.BigInt(86400), JSBI.BigInt(1e17));
const YEAR_MIN = -271821;
const YEAR_MAX = 275760;
const BEFORE_FIRST_OFFSET_TRANSITION = JSBI.multiply(JSBI.BigInt(-388152), JSBI.BigInt(1e13));
const ABOUT_TEN_YEARS_NANOS = JSBI.multiply(DAY_NANOS, JSBI.BigInt(366 * 10));
const ABOUT_ONE_YEAR_NANOS = JSBI.multiply(DAY_NANOS, JSBI.BigInt(366 * 1));
const TWO_WEEKS_NANOS = JSBI.multiply(DAY_NANOS, JSBI.BigInt(2 * 7));
function IsInteger(value) {
  if (typeof value !== "number" || !NumberIsFinite(value))
    return false;
  const abs2 = MathAbs(value);
  return MathFloor(abs2) === abs2;
}
function IsObject(value) {
  return typeof value === "object" && value !== null || typeof value === "function";
}
function ToNumber(value) {
  if (typeof value === "bigint")
    throw new TypeError("Cannot convert BigInt to number");
  return NumberCtor(value);
}
function ToInteger(value) {
  const num = ToNumber(value);
  if (NumberIsNaN(num))
    return 0;
  const integer = MathTrunc(num);
  if (num === 0)
    return 0;
  return integer;
}
function ToString(value) {
  if (typeof value === "symbol") {
    throw new TypeError("Cannot convert a Symbol value to a String");
  }
  return StringCtor(value);
}
function ToIntegerThrowOnInfinity(value) {
  const integer = ToInteger(value);
  if (!NumberIsFinite(integer)) {
    throw new RangeError("infinity is out of range");
  }
  return integer;
}
function ToPositiveInteger(valueParam, property) {
  const value = ToInteger(valueParam);
  if (!NumberIsFinite(value)) {
    throw new RangeError("infinity is out of range");
  }
  if (value < 1) {
    if (property !== void 0) {
      throw new RangeError(`property '${property}' cannot be a a number less than one`);
    }
    throw new RangeError("Cannot convert a number less than one to a positive integer");
  }
  return value;
}
function ToIntegerWithoutRounding(valueParam) {
  const value = ToNumber(valueParam);
  if (NumberIsNaN(value))
    return 0;
  if (!NumberIsFinite(value)) {
    throw new RangeError("infinity is out of range");
  }
  if (!IsInteger(value)) {
    throw new RangeError(`unsupported fractional value ${value}`);
  }
  return ToInteger(value);
}
function divmod(x, y) {
  const quotient = JSBI.divide(x, y);
  const remainder = JSBI.remainder(x, y);
  return { quotient, remainder };
}
function abs(x) {
  if (JSBI.lessThan(x, ZERO))
    return JSBI.multiply(x, NEGATIVE_ONE);
  return x;
}
const BUILTIN_CASTS = /* @__PURE__ */ new Map([
  ["year", ToIntegerThrowOnInfinity],
  ["month", ToPositiveInteger],
  ["monthCode", ToString],
  ["day", ToPositiveInteger],
  ["hour", ToIntegerThrowOnInfinity],
  ["minute", ToIntegerThrowOnInfinity],
  ["second", ToIntegerThrowOnInfinity],
  ["millisecond", ToIntegerThrowOnInfinity],
  ["microsecond", ToIntegerThrowOnInfinity],
  ["nanosecond", ToIntegerThrowOnInfinity],
  ["years", ToIntegerWithoutRounding],
  ["months", ToIntegerWithoutRounding],
  ["weeks", ToIntegerWithoutRounding],
  ["days", ToIntegerWithoutRounding],
  ["hours", ToIntegerWithoutRounding],
  ["minutes", ToIntegerWithoutRounding],
  ["seconds", ToIntegerWithoutRounding],
  ["milliseconds", ToIntegerWithoutRounding],
  ["microseconds", ToIntegerWithoutRounding],
  ["nanoseconds", ToIntegerWithoutRounding],
  ["era", ToString],
  ["eraYear", ToInteger],
  ["offset", ToString]
]);
const ALLOWED_UNITS = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond",
  "microsecond",
  "nanosecond"
];
const SINGULAR_PLURAL_UNITS = [
  ["years", "year"],
  ["months", "month"],
  ["weeks", "week"],
  ["days", "day"],
  ["hours", "hour"],
  ["minutes", "minute"],
  ["seconds", "second"],
  ["milliseconds", "millisecond"],
  ["microseconds", "microsecond"],
  ["nanoseconds", "nanosecond"]
];
const IntlDateTimeFormatEnUsCache = /* @__PURE__ */ new Map();
function getIntlDateTimeFormatEnUsForTimeZone(timeZoneIdentifier) {
  let instance = IntlDateTimeFormatEnUsCache.get(timeZoneIdentifier);
  if (instance === void 0) {
    instance = new IntlDateTimeFormat$1("en-us", {
      timeZone: StringCtor(timeZoneIdentifier),
      hour12: false,
      era: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    IntlDateTimeFormatEnUsCache.set(timeZoneIdentifier, instance);
  }
  return instance;
}
function IsTemporalInstant(item) {
  return HasSlot(item, EPOCHNANOSECONDS) && !HasSlot(item, TIME_ZONE, CALENDAR);
}
function IsTemporalTimeZone(item) {
  return HasSlot(item, TIMEZONE_ID);
}
function IsTemporalCalendar(item) {
  return HasSlot(item, CALENDAR_ID);
}
function IsTemporalDuration(item) {
  return HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS);
}
function IsTemporalDate(item) {
  return HasSlot(item, DATE_BRAND);
}
function IsTemporalTime(item) {
  return HasSlot(item, ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND) && !HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY);
}
function IsTemporalDateTime(item) {
  return HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY, ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND);
}
function IsTemporalYearMonth(item) {
  return HasSlot(item, YEAR_MONTH_BRAND);
}
function IsTemporalMonthDay(item) {
  return HasSlot(item, MONTH_DAY_BRAND);
}
function IsTemporalZonedDateTime(item) {
  return HasSlot(item, EPOCHNANOSECONDS, TIME_ZONE, CALENDAR);
}
function RejectObjectWithCalendarOrTimeZone(item) {
  if (HasSlot(item, CALENDAR) || HasSlot(item, TIME_ZONE)) {
    throw new TypeError("with() does not support a calendar or timeZone property");
  }
  if (item.calendar !== void 0) {
    throw new TypeError("with() does not support a calendar property");
  }
  if (item.timeZone !== void 0) {
    throw new TypeError("with() does not support a timeZone property");
  }
}
function ParseTemporalTimeZone(stringIdent) {
  let { ianaName, offset: offset2, z } = ParseTemporalTimeZoneString(stringIdent);
  if (ianaName)
    return ianaName;
  if (z)
    return "UTC";
  return offset2;
}
function FormatCalendarAnnotation(id, showCalendar) {
  if (showCalendar === "never")
    return "";
  if (showCalendar === "auto" && id === "iso8601")
    return "";
  return `[u-ca=${id}]`;
}
function ParseISODateTime(isoString) {
  const match = zoneddatetime.exec(isoString);
  if (!match)
    throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
  let yearString = match[1];
  if (yearString[0] === "\u2212")
    yearString = `-${yearString.slice(1)}`;
  if (yearString === "-000000")
    throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
  const year = ToInteger(yearString);
  const month = ToInteger(match[2] || match[4]);
  const day = ToInteger(match[3] || match[5]);
  const hour = ToInteger(match[6]);
  const hasTime = match[6] !== void 0;
  const minute = ToInteger(match[7] || match[10]);
  let second = ToInteger(match[8] || match[11]);
  if (second === 60)
    second = 59;
  const fraction2 = (match[9] || match[12]) + "000000000";
  const millisecond = ToInteger(fraction2.slice(0, 3));
  const microsecond = ToInteger(fraction2.slice(3, 6));
  const nanosecond = ToInteger(fraction2.slice(6, 9));
  let offset2;
  let z = false;
  if (match[13]) {
    offset2 = void 0;
    z = true;
  } else if (match[14] && match[15]) {
    const offsetSign = match[14] === "-" || match[14] === "\u2212" ? "-" : "+";
    const offsetHours = match[15] || "00";
    const offsetMinutes = match[16] || "00";
    const offsetSeconds = match[17] || "00";
    let offsetFraction = match[18] || "0";
    offset2 = `${offsetSign}${offsetHours}:${offsetMinutes}`;
    if (+offsetFraction) {
      while (offsetFraction.endsWith("0"))
        offsetFraction = offsetFraction.slice(0, -1);
      offset2 += `:${offsetSeconds}.${offsetFraction}`;
    } else if (+offsetSeconds) {
      offset2 += `:${offsetSeconds}`;
    }
    if (offset2 === "-00:00")
      offset2 = "+00:00";
  }
  let ianaName = match[19];
  if (ianaName) {
    try {
      ianaName = GetCanonicalTimeZoneIdentifier(ianaName).toString();
    } catch {
    }
  }
  const calendar2 = match[20];
  return {
    year,
    month,
    day,
    hasTime,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    ianaName,
    offset: offset2,
    z,
    calendar: calendar2
  };
}
function ParseTemporalInstantString(isoString) {
  const result = ParseISODateTime(isoString);
  if (!result.z && !result.offset)
    throw new RangeError("Temporal.Instant requires a time zone offset");
  return result;
}
function ParseTemporalZonedDateTimeString(isoString) {
  const result = ParseISODateTime(isoString);
  if (!result.ianaName)
    throw new RangeError("Temporal.ZonedDateTime requires a time zone ID in brackets");
  return result;
}
function ParseTemporalDateTimeString(isoString) {
  return ParseISODateTime(isoString);
}
function ParseTemporalDateString(isoString) {
  return ParseISODateTime(isoString);
}
function ParseTemporalTimeString(isoString) {
  const match = time.exec(isoString);
  let hour, minute, second, millisecond, microsecond, nanosecond, calendar2;
  if (match) {
    hour = ToInteger(match[1]);
    minute = ToInteger(match[2] || match[5]);
    second = ToInteger(match[3] || match[6]);
    if (second === 60)
      second = 59;
    const fraction2 = (match[4] || match[7]) + "000000000";
    millisecond = ToInteger(fraction2.slice(0, 3));
    microsecond = ToInteger(fraction2.slice(3, 6));
    nanosecond = ToInteger(fraction2.slice(6, 9));
    calendar2 = match[15];
  } else {
    let z, hasTime;
    ({ hasTime, hour, minute, second, millisecond, microsecond, nanosecond, calendar: calendar2, z } = ParseISODateTime(isoString));
    if (!hasTime)
      throw new RangeError(`time is missing in string: ${isoString}`);
    if (z)
      throw new RangeError("Z designator not supported for PlainTime");
  }
  if (/[tT ][0-9][0-9]/.test(isoString)) {
    return { hour, minute, second, millisecond, microsecond, nanosecond, calendar: calendar2 };
  }
  try {
    const { month, day } = ParseTemporalMonthDayString(isoString);
    RejectISODate(1972, month, day);
  } catch {
    try {
      const { year, month } = ParseTemporalYearMonthString(isoString);
      RejectISODate(year, month, 1);
    } catch {
      return { hour, minute, second, millisecond, microsecond, nanosecond, calendar: calendar2 };
    }
  }
  throw new RangeError(`invalid ISO 8601 time-only string ${isoString}; may need a T prefix`);
}
function ParseTemporalYearMonthString(isoString) {
  const match = yearmonth.exec(isoString);
  let year, month, calendar2, referenceISODay;
  if (match) {
    let yearString = match[1];
    if (yearString[0] === "\u2212")
      yearString = `-${yearString.slice(1)}`;
    if (yearString === "-000000")
      throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    year = ToInteger(yearString);
    month = ToInteger(match[2]);
    calendar2 = match[3];
  } else {
    let z;
    ({ year, month, calendar: calendar2, day: referenceISODay, z } = ParseISODateTime(isoString));
    if (z)
      throw new RangeError("Z designator not supported for PlainYearMonth");
  }
  return { year, month, calendar: calendar2, referenceISODay };
}
function ParseTemporalMonthDayString(isoString) {
  const match = monthday.exec(isoString);
  let month, day, calendar2, referenceISOYear;
  if (match) {
    month = ToInteger(match[1]);
    day = ToInteger(match[2]);
  } else {
    let z;
    ({ month, day, calendar: calendar2, year: referenceISOYear, z } = ParseISODateTime(isoString));
    if (z)
      throw new RangeError("Z designator not supported for PlainMonthDay");
  }
  return { month, day, calendar: calendar2, referenceISOYear };
}
function ParseTemporalTimeZoneString(stringIdent) {
  try {
    let canonicalIdent = GetCanonicalTimeZoneIdentifier(stringIdent);
    if (canonicalIdent) {
      canonicalIdent = canonicalIdent.toString();
      if (TestTimeZoneOffsetString(canonicalIdent))
        return { offset: canonicalIdent };
      return { ianaName: canonicalIdent };
    }
  } catch {
  }
  try {
    const result = ParseISODateTime(stringIdent);
    if (result.z || result.offset || result.ianaName) {
      return result;
    }
  } catch {
  }
  throw new RangeError(`Invalid time zone: ${stringIdent}`);
}
function ParseTemporalDurationString(isoString) {
  const match = duration.exec(isoString);
  if (!match)
    throw new RangeError(`invalid duration: ${isoString}`);
  if (match.slice(2).every((element) => element === void 0)) {
    throw new RangeError(`invalid duration: ${isoString}`);
  }
  const sign = match[1] === "-" || match[1] === "\u2212" ? -1 : 1;
  const years = ToInteger(match[2]) * sign;
  const months = ToInteger(match[3]) * sign;
  const weeks = ToInteger(match[4]) * sign;
  const days = ToInteger(match[5]) * sign;
  const hours = ToInteger(match[6]) * sign;
  let fHours = match[7];
  let minutes = ToInteger(match[8]) * sign;
  let fMinutes = match[9];
  let seconds = ToInteger(match[10]) * sign;
  const fSeconds = match[11] + "000000000";
  let milliseconds = ToInteger(fSeconds.slice(0, 3)) * sign;
  let microseconds = ToInteger(fSeconds.slice(3, 6)) * sign;
  let nanoseconds = ToInteger(fSeconds.slice(6, 9)) * sign;
  fHours = fHours ? sign * ToInteger(fHours) / 10 ** fHours.length : 0;
  fMinutes = fMinutes ? sign * ToInteger(fMinutes) / 10 ** fMinutes.length : 0;
  ({ minutes, seconds, milliseconds, microseconds, nanoseconds } = DurationHandleFractions(fHours, minutes, fMinutes, seconds, milliseconds, microseconds, nanoseconds));
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function ParseTemporalInstant(isoString) {
  const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offset: offset2, z } = ParseTemporalInstantString(isoString);
  const epochNs = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (epochNs === null)
    throw new RangeError("DateTime outside of supported range");
  const offsetNs = z ? 0 : ParseTimeZoneOffsetString(offset2);
  return JSBI.subtract(epochNs, JSBI.BigInt(offsetNs));
}
function RegulateISODate(yearParam, monthParam, dayParam, overflow) {
  let year = yearParam;
  let month = monthParam;
  let day = dayParam;
  switch (overflow) {
    case "reject":
      RejectISODate(year, month, day);
      break;
    case "constrain":
      ({ year, month, day } = ConstrainISODate(year, month, day));
      break;
  }
  return { year, month, day };
}
function RegulateTime(hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam, overflow) {
  let hour = hourParam;
  let minute = minuteParam;
  let second = secondParam;
  let millisecond = millisecondParam;
  let microsecond = microsecondParam;
  let nanosecond = nanosecondParam;
  switch (overflow) {
    case "reject":
      RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
      break;
    case "constrain":
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond));
      break;
  }
  return { hour, minute, second, millisecond, microsecond, nanosecond };
}
function RegulateISOYearMonth(yearParam, monthParam, overflow) {
  let year = yearParam;
  let month = monthParam;
  const referenceISODay = 1;
  switch (overflow) {
    case "reject":
      RejectISODate(year, month, referenceISODay);
      break;
    case "constrain":
      ({ year, month } = ConstrainISODate(year, month));
      break;
  }
  return { year, month };
}
function DurationHandleFractions(fHoursParam, minutesParam, fMinutesParam, secondsParam, millisecondsParam, microsecondsParam, nanosecondsParam) {
  let fHours = fHoursParam;
  let minutes = minutesParam;
  let fMinutes = fMinutesParam;
  let seconds = secondsParam;
  let milliseconds = millisecondsParam;
  let microseconds = microsecondsParam;
  let nanoseconds = nanosecondsParam;
  if (fHours !== 0) {
    [minutes, fMinutes, seconds, milliseconds, microseconds, nanoseconds].forEach((val) => {
      if (val !== 0)
        throw new RangeError("only the smallest unit can be fractional");
    });
    const mins = fHours * 60;
    minutes = MathTrunc(mins);
    fMinutes = mins % 1;
  }
  if (fMinutes !== 0) {
    [seconds, milliseconds, microseconds, nanoseconds].forEach((val) => {
      if (val !== 0)
        throw new RangeError("only the smallest unit can be fractional");
    });
    const secs = fMinutes * 60;
    seconds = MathTrunc(secs);
    const fSeconds = secs % 1;
    if (fSeconds !== 0) {
      const mils = fSeconds * 1e3;
      milliseconds = MathTrunc(mils);
      const fMilliseconds = mils % 1;
      if (fMilliseconds !== 0) {
        const mics = fMilliseconds * 1e3;
        microseconds = MathTrunc(mics);
        const fMicroseconds = mics % 1;
        if (fMicroseconds !== 0) {
          const nans = fMicroseconds * 1e3;
          nanoseconds = MathTrunc(nans);
        }
      }
    }
  }
  return { minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function ToTemporalDurationRecord(item) {
  if (IsTemporalDuration(item)) {
    return {
      years: GetSlot(item, YEARS),
      months: GetSlot(item, MONTHS),
      weeks: GetSlot(item, WEEKS),
      days: GetSlot(item, DAYS),
      hours: GetSlot(item, HOURS),
      minutes: GetSlot(item, MINUTES),
      seconds: GetSlot(item, SECONDS),
      milliseconds: GetSlot(item, MILLISECONDS),
      microseconds: GetSlot(item, MICROSECONDS),
      nanoseconds: GetSlot(item, NANOSECONDS)
    };
  }
  const props = ToPartialRecord(item, [
    "days",
    "hours",
    "microseconds",
    "milliseconds",
    "minutes",
    "months",
    "nanoseconds",
    "seconds",
    "weeks",
    "years"
  ]);
  if (!props)
    throw new TypeError("invalid duration-like");
  const { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 } = props;
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function ToLimitedTemporalDuration(item, disallowedProperties = []) {
  let record;
  if (IsObject(item)) {
    record = ToTemporalDurationRecord(item);
  } else {
    const str = ToString(item);
    record = ParseTemporalDurationString(str);
  }
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = record;
  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  for (const property of disallowedProperties) {
    if (record[property] !== 0) {
      throw new RangeError(`Duration field ${property} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`);
    }
  }
  return record;
}
function ToTemporalOverflow(options) {
  return GetOption(options, "overflow", ["constrain", "reject"], "constrain");
}
function ToTemporalDisambiguation(options) {
  return GetOption(options, "disambiguation", ["compatible", "earlier", "later", "reject"], "compatible");
}
function ToTemporalRoundingMode(options, fallback) {
  return GetOption(options, "roundingMode", ["ceil", "floor", "trunc", "halfExpand"], fallback);
}
function NegateTemporalRoundingMode(roundingMode) {
  switch (roundingMode) {
    case "ceil":
      return "floor";
    case "floor":
      return "ceil";
    default:
      return roundingMode;
  }
}
function ToTemporalOffset(options, fallback) {
  return GetOption(options, "offset", ["prefer", "use", "ignore", "reject"], fallback);
}
function ToShowCalendarOption(options) {
  return GetOption(options, "calendarName", ["auto", "always", "never"], "auto");
}
function ToShowTimeZoneNameOption(options) {
  return GetOption(options, "timeZoneName", ["auto", "never"], "auto");
}
function ToShowOffsetOption(options) {
  return GetOption(options, "offset", ["auto", "never"], "auto");
}
function ToTemporalRoundingIncrement(options, dividend, inclusive) {
  let maximum = Infinity;
  if (dividend !== void 0)
    maximum = dividend;
  if (!inclusive && dividend !== void 0)
    maximum = dividend > 1 ? dividend - 1 : 1;
  const increment = GetNumberOption(options, "roundingIncrement", 1, maximum, 1);
  if (dividend !== void 0 && dividend % increment !== 0) {
    throw new RangeError(`Rounding increment must divide evenly into ${dividend}`);
  }
  return increment;
}
function ToTemporalDateTimeRoundingIncrement(options, smallestUnit) {
  const maximumIncrements = {
    year: void 0,
    month: void 0,
    week: void 0,
    day: void 0,
    hour: 24,
    minute: 60,
    second: 60,
    millisecond: 1e3,
    microsecond: 1e3,
    nanosecond: 1e3
  };
  return ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
}
function ToSecondsStringPrecision(options) {
  const smallestUnit = ToSmallestTemporalUnit(options, void 0, ["year", "month", "week", "day", "hour"]);
  switch (smallestUnit) {
    case "minute":
      return { precision: "minute", unit: "minute", increment: 1 };
    case "second":
      return { precision: 0, unit: "second", increment: 1 };
    case "millisecond":
      return { precision: 3, unit: "millisecond", increment: 1 };
    case "microsecond":
      return { precision: 6, unit: "microsecond", increment: 1 };
    case "nanosecond":
      return { precision: 9, unit: "nanosecond", increment: 1 };
  }
  let digits = options.fractionalSecondDigits;
  if (digits === void 0)
    digits = "auto";
  if (typeof digits !== "number") {
    const stringDigits = ToString(digits);
    if (stringDigits === "auto")
      return { precision: "auto", unit: "nanosecond", increment: 1 };
    throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${stringDigits}`);
  }
  if (NumberIsNaN(digits) || digits < 0 || digits > 9) {
    throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digits}`);
  }
  const precision = MathFloor(digits);
  switch (precision) {
    case 0:
      return { precision, unit: "second", increment: 1 };
    case 1:
    case 2:
    case 3:
      return { precision, unit: "millisecond", increment: 10 ** (3 - precision) };
    case 4:
    case 5:
    case 6:
      return { precision, unit: "microsecond", increment: 10 ** (6 - precision) };
    case 7:
    case 8:
    case 9:
      return { precision, unit: "nanosecond", increment: 10 ** (9 - precision) };
    default:
      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digits}`);
  }
}
function ToLargestTemporalUnit(options, fallback, disallowedStrings = [], autoValue) {
  const singular = new Map(SINGULAR_PLURAL_UNITS.filter(([, sing]) => !disallowedStrings.includes(sing)));
  const allowed = new Set(ALLOWED_UNITS);
  for (const s of disallowedStrings) {
    allowed.delete(s);
  }
  const retval = GetOption(options, "largestUnit", ["auto", ...allowed, ...singular.keys()], fallback);
  if (retval === "auto" && autoValue !== void 0)
    return autoValue;
  if (singular.has(retval)) {
    return singular.get(retval);
  }
  return retval;
}
function ToSmallestTemporalUnit(options, fallback, disallowedStrings = []) {
  const singular = new Map(SINGULAR_PLURAL_UNITS.filter(([, sing]) => !disallowedStrings.includes(sing)));
  const allowed = new Set(ALLOWED_UNITS);
  for (const s of disallowedStrings) {
    allowed.delete(s);
  }
  const value = GetOption(options, "smallestUnit", [...allowed, ...singular.keys()], fallback);
  if (singular.has(value)) {
    return singular.get(value);
  }
  return value;
}
function ToTemporalDurationTotalUnit(options) {
  const singular = new Map(SINGULAR_PLURAL_UNITS);
  const value = GetOption(options, "unit", [...singular.values(), ...singular.keys()], void 0);
  if (singular.has(value)) {
    return singular.get(value);
  }
  return value;
}
function ToRelativeTemporalObject(options) {
  const relativeTo = options.relativeTo;
  if (relativeTo === void 0)
    return relativeTo;
  let offsetBehaviour = "option";
  let matchMinutes = false;
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2, timeZone2, offset2;
  if (IsObject(relativeTo)) {
    if (IsTemporalZonedDateTime(relativeTo) || IsTemporalDate(relativeTo))
      return relativeTo;
    if (IsTemporalDateTime(relativeTo))
      return TemporalDateTimeToDate(relativeTo);
    calendar2 = GetTemporalCalendarWithISODefault(relativeTo);
    const fieldNames = CalendarFields(calendar2, [
      "day",
      "hour",
      "microsecond",
      "millisecond",
      "minute",
      "month",
      "monthCode",
      "nanosecond",
      "second",
      "year"
    ]);
    const fields = ToTemporalDateTimeFields(relativeTo, fieldNames);
    const dateOptions = ObjectCreate$2(null);
    dateOptions.overflow = "constrain";
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(calendar2, fields, dateOptions));
    offset2 = relativeTo.offset;
    if (offset2 === void 0)
      offsetBehaviour = "wall";
    timeZone2 = relativeTo.timeZone;
  } else {
    let ianaName, z;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar: calendar2, ianaName, offset: offset2, z } = ParseISODateTime(ToString(relativeTo)));
    if (ianaName)
      timeZone2 = ianaName;
    if (z) {
      offsetBehaviour = "exact";
    } else if (!offset2) {
      offsetBehaviour = "wall";
    }
    if (!calendar2)
      calendar2 = GetISO8601Calendar();
    calendar2 = ToTemporalCalendar(calendar2);
    matchMinutes = true;
  }
  if (timeZone2) {
    timeZone2 = ToTemporalTimeZone(timeZone2);
    let offsetNs = 0;
    if (offsetBehaviour === "option")
      offsetNs = ParseTimeZoneOffsetString(ToString(offset2));
    const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZone2, "compatible", "reject", matchMinutes);
    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone2, calendar2);
  }
  return CreateTemporalDate(year, month, day, calendar2);
}
function ValidateTemporalUnitRange(largestUnit, smallestUnit) {
  if (ALLOWED_UNITS.indexOf(largestUnit) > ALLOWED_UNITS.indexOf(smallestUnit)) {
    throw new RangeError(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`);
  }
}
function DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
  const singular = new Map(SINGULAR_PLURAL_UNITS);
  for (const [prop, v] of [
    ["years", years],
    ["months", months],
    ["weeks", weeks],
    ["days", days],
    ["hours", hours],
    ["minutes", minutes],
    ["seconds", seconds],
    ["milliseconds", milliseconds],
    ["microseconds", microseconds],
    ["nanoseconds", nanoseconds]
  ]) {
    if (v !== 0)
      return singular.get(prop);
  }
  return "nanosecond";
}
function LargerOfTwoTemporalUnits(unit1, unit2) {
  if (ALLOWED_UNITS.indexOf(unit1) > ALLOWED_UNITS.indexOf(unit2))
    return unit2;
  return unit1;
}
function ToPartialRecord(bagParam, fieldsParam) {
  const bag = bagParam;
  const fields = fieldsParam;
  let any = false;
  let result = {};
  for (const property of fields) {
    const value = bag[property];
    if (value !== void 0) {
      any = true;
      if (BUILTIN_CASTS.has(property)) {
        result[property] = BUILTIN_CASTS.get(property)(value);
      } else {
        result[property] = value;
      }
    }
  }
  return any ? result : false;
}
function PrepareTemporalFields(bagParam, fieldsParam) {
  const bag = bagParam;
  const fields = fieldsParam;
  const result = {};
  let any = false;
  for (const fieldRecord of fields) {
    const [property, defaultValue] = fieldRecord;
    let value = bag[property];
    if (value === void 0) {
      if (fieldRecord.length === 1) {
        throw new TypeError(`required property '${property}' missing or undefined`);
      }
      value = defaultValue;
    } else {
      any = true;
      if (BUILTIN_CASTS.has(property)) {
        value = BUILTIN_CASTS.get(property)(value);
      }
    }
    result[property] = value;
  }
  if (!any) {
    throw new TypeError("no supported properties found");
  }
  if (result["era"] === void 0 !== (result["eraYear"] === void 0)) {
    throw new RangeError("properties 'era' and 'eraYear' must be provided together");
  }
  return result;
}
function ToTemporalDateFields(bag, fieldNames) {
  const entries = [
    ["day", void 0],
    ["month", void 0],
    ["monthCode", void 0],
    ["year", void 0]
  ];
  fieldNames.forEach((fieldName) => {
    if (!entries.some(([name]) => name === fieldName)) {
      entries.push([fieldName, void 0]);
    }
  });
  return PrepareTemporalFields(bag, entries);
}
function ToTemporalDateTimeFields(bag, fieldNames) {
  const entries = [
    ["day", void 0],
    ["hour", 0],
    ["microsecond", 0],
    ["millisecond", 0],
    ["minute", 0],
    ["month", void 0],
    ["monthCode", void 0],
    ["nanosecond", 0],
    ["second", 0],
    ["year", void 0]
  ];
  fieldNames.forEach((fieldName) => {
    if (!entries.some(([name]) => name === fieldName)) {
      entries.push([fieldName, void 0]);
    }
  });
  return PrepareTemporalFields(bag, entries);
}
function ToTemporalMonthDayFields(bag, fieldNames) {
  const entries = [
    ["day", void 0],
    ["month", void 0],
    ["monthCode", void 0],
    ["year", void 0]
  ];
  fieldNames.forEach((fieldName) => {
    if (!entries.some(([name]) => name === fieldName)) {
      entries.push([fieldName, void 0]);
    }
  });
  return PrepareTemporalFields(bag, entries);
}
function ToTemporalTimeRecord(bag) {
  return PrepareTemporalFields(bag, [
    ["hour", 0],
    ["microsecond", 0],
    ["millisecond", 0],
    ["minute", 0],
    ["nanosecond", 0],
    ["second", 0]
  ]);
}
function ToTemporalYearMonthFields(bag, fieldNames) {
  const entries = [
    ["month", void 0],
    ["monthCode", void 0],
    ["year", void 0]
  ];
  fieldNames.forEach((fieldName) => {
    if (!entries.some(([name]) => name === fieldName)) {
      entries.push([fieldName, void 0]);
    }
  });
  return PrepareTemporalFields(bag, entries);
}
function ToTemporalZonedDateTimeFields(bag, fieldNames) {
  const entries = [
    ["day", void 0],
    ["hour", 0],
    ["microsecond", 0],
    ["millisecond", 0],
    ["minute", 0],
    ["month", void 0],
    ["monthCode", void 0],
    ["nanosecond", 0],
    ["second", 0],
    ["year", void 0],
    ["offset", void 0],
    ["timeZone"]
  ];
  fieldNames.forEach((fieldName) => {
    if (!entries.some(([name]) => name === fieldName)) {
      entries.push([fieldName, void 0]);
    }
  });
  return PrepareTemporalFields(bag, entries);
}
function ToTemporalDate(itemParam, options = ObjectCreate$2(null)) {
  let item = itemParam;
  if (IsObject(item)) {
    if (IsTemporalDate(item))
      return item;
    if (IsTemporalZonedDateTime(item)) {
      item = BuiltinTimeZoneGetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDateTime(item)) {
      return CreateTemporalDate(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR));
    }
    const calendar3 = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar3, ["day", "month", "monthCode", "year"]);
    const fields = ToTemporalDateFields(item, fieldNames);
    return DateFromFields(calendar3, fields, options);
  }
  ToTemporalOverflow(options);
  const { year, month, day, calendar: calendar2, z } = ParseTemporalDateString(ToString(item));
  if (z)
    throw new RangeError("Z designator not supported for PlainDate");
  const TemporalPlainDate = GetIntrinsic("%Temporal.PlainDate%");
  return new TemporalPlainDate(year, month, day, calendar2);
}
function InterpretTemporalDateTimeFields(calendar2, fields, options) {
  let { hour, minute, second, millisecond, microsecond, nanosecond } = ToTemporalTimeRecord(fields);
  const overflow = ToTemporalOverflow(options);
  const date = DateFromFields(calendar2, fields, options);
  const year = GetSlot(date, ISO_YEAR);
  const month = GetSlot(date, ISO_MONTH);
  const day = GetSlot(date, ISO_DAY);
  ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow));
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}
function ToTemporalDateTime(item, options = ObjectCreate$2(null)) {
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2;
  if (IsObject(item)) {
    if (IsTemporalDateTime(item))
      return item;
    if (IsTemporalZonedDateTime(item)) {
      return BuiltinTimeZoneGetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDate(item)) {
      return CreateTemporalDateTime(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), 0, 0, 0, 0, 0, 0, GetSlot(item, CALENDAR));
    }
    calendar2 = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar2, [
      "day",
      "hour",
      "microsecond",
      "millisecond",
      "minute",
      "month",
      "monthCode",
      "nanosecond",
      "second",
      "year"
    ]);
    const fields = ToTemporalDateTimeFields(item, fieldNames);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(calendar2, fields, options));
  } else {
    ToTemporalOverflow(options);
    let z;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar: calendar2, z } = ParseTemporalDateTimeString(ToString(item)));
    if (z)
      throw new RangeError("Z designator not supported for PlainDateTime");
    RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (calendar2 === void 0)
      calendar2 = GetISO8601Calendar();
    calendar2 = ToTemporalCalendar(calendar2);
  }
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
}
function ToTemporalDuration(item) {
  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
  if (IsObject(item)) {
    if (IsTemporalDuration(item))
      return item;
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToTemporalDurationRecord(item));
  } else {
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ParseTemporalDurationString(ToString(item)));
  }
  const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
  return new TemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
}
function ToTemporalInstant(item) {
  if (IsTemporalInstant(item))
    return item;
  if (IsTemporalZonedDateTime(item)) {
    const TemporalInstant2 = GetIntrinsic("%Temporal.Instant%");
    return new TemporalInstant2(GetSlot(item, EPOCHNANOSECONDS));
  }
  const ns = ParseTemporalInstant(ToString(item));
  const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
  return new TemporalInstant(ns);
}
function ToTemporalMonthDay(item, options = ObjectCreate$2(null)) {
  if (IsObject(item)) {
    if (IsTemporalMonthDay(item))
      return item;
    let calendar3, calendarAbsent;
    if (HasSlot(item, CALENDAR)) {
      calendar3 = GetSlot(item, CALENDAR);
      calendarAbsent = false;
    } else {
      let maybeStringCalendar2 = item.calendar;
      calendarAbsent = maybeStringCalendar2 === void 0;
      if (maybeStringCalendar2 === void 0)
        maybeStringCalendar2 = GetISO8601Calendar();
      calendar3 = ToTemporalCalendar(maybeStringCalendar2);
    }
    const fieldNames = CalendarFields(calendar3, ["day", "month", "monthCode", "year"]);
    const fields = ToTemporalMonthDayFields(item, fieldNames);
    if (calendarAbsent && fields.month !== void 0 && fields.monthCode === void 0 && fields.year === void 0) {
      fields.year = 1972;
    }
    return MonthDayFromFields(calendar3, fields, options);
  }
  ToTemporalOverflow(options);
  let { month, day, referenceISOYear, calendar: maybeStringCalendar } = ParseTemporalMonthDayString(ToString(item));
  let calendar2 = maybeStringCalendar;
  if (calendar2 === void 0)
    calendar2 = GetISO8601Calendar();
  calendar2 = ToTemporalCalendar(calendar2);
  if (referenceISOYear === void 0) {
    RejectISODate(1972, month, day);
    return CreateTemporalMonthDay(month, day, calendar2);
  }
  const result = CreateTemporalMonthDay(month, day, calendar2, referenceISOYear);
  const canonicalOptions = ObjectCreate$2(null);
  return MonthDayFromFields(calendar2, result, canonicalOptions);
}
function ToTemporalTime(itemParam, overflow = "constrain") {
  let item = itemParam;
  let hour, minute, second, millisecond, microsecond, nanosecond, calendar2;
  if (IsObject(item)) {
    if (IsTemporalTime(item))
      return item;
    if (IsTemporalZonedDateTime(item)) {
      item = BuiltinTimeZoneGetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDateTime(item)) {
      const TemporalPlainTime2 = GetIntrinsic("%Temporal.PlainTime%");
      return new TemporalPlainTime2(GetSlot(item, ISO_HOUR), GetSlot(item, ISO_MINUTE), GetSlot(item, ISO_SECOND), GetSlot(item, ISO_MILLISECOND), GetSlot(item, ISO_MICROSECOND), GetSlot(item, ISO_NANOSECOND));
    }
    calendar2 = GetTemporalCalendarWithISODefault(item);
    if (ToString(calendar2) !== "iso8601") {
      throw new RangeError("PlainTime can only have iso8601 calendar");
    }
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ToTemporalTimeRecord(item));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow));
  } else {
    ({ hour, minute, second, millisecond, microsecond, nanosecond, calendar: calendar2 } = ParseTemporalTimeString(ToString(item)));
    RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
    if (calendar2 !== void 0 && calendar2 !== "iso8601") {
      throw new RangeError("PlainTime can only have iso8601 calendar");
    }
  }
  const TemporalPlainTime = GetIntrinsic("%Temporal.PlainTime%");
  return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
}
function ToTemporalYearMonth(item, options = ObjectCreate$2(null)) {
  if (IsObject(item)) {
    if (IsTemporalYearMonth(item))
      return item;
    const calendar3 = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar3, ["month", "monthCode", "year"]);
    const fields = ToTemporalYearMonthFields(item, fieldNames);
    return YearMonthFromFields(calendar3, fields, options);
  }
  ToTemporalOverflow(options);
  let { year, month, referenceISODay, calendar: maybeStringCalendar } = ParseTemporalYearMonthString(ToString(item));
  let calendar2 = maybeStringCalendar;
  if (calendar2 === void 0)
    calendar2 = GetISO8601Calendar();
  calendar2 = ToTemporalCalendar(calendar2);
  if (referenceISODay === void 0) {
    RejectISODate(year, month, 1);
    return CreateTemporalYearMonth(year, month, calendar2);
  }
  const result = CreateTemporalYearMonth(year, month, calendar2, referenceISODay);
  const canonicalOptions = ObjectCreate$2(null);
  return YearMonthFromFields(calendar2, result, canonicalOptions);
}
function InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZone2, disambiguation, offsetOpt, matchMinute) {
  const DateTime = GetIntrinsic("%Temporal.PlainDateTime%");
  const dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (offsetBehaviour === "wall" || offsetOpt === "ignore") {
    const instant3 = BuiltinTimeZoneGetInstantFor(timeZone2, dt, disambiguation);
    return GetSlot(instant3, EPOCHNANOSECONDS);
  }
  if (offsetBehaviour === "exact" || offsetOpt === "use") {
    const epochNs = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (epochNs === null)
      throw new RangeError("ZonedDateTime outside of supported range");
    return JSBI.subtract(epochNs, JSBI.BigInt(offsetNs));
  }
  const possibleInstants = GetPossibleInstantsFor(timeZone2, dt);
  for (const candidate of possibleInstants) {
    const candidateOffset = GetOffsetNanosecondsFor(timeZone2, candidate);
    const roundedCandidateOffset = JSBI.toNumber(RoundNumberToIncrement(JSBI.BigInt(candidateOffset), 6e10, "halfExpand"));
    if (candidateOffset === offsetNs || matchMinute && roundedCandidateOffset === offsetNs) {
      return GetSlot(candidate, EPOCHNANOSECONDS);
    }
  }
  if (offsetOpt === "reject") {
    const offsetStr = FormatTimeZoneOffsetString(offsetNs);
    const timeZoneString = IsTemporalTimeZone(timeZone2) ? GetSlot(timeZone2, TIMEZONE_ID) : "time zone";
    throw new RangeError(`Offset ${offsetStr} is invalid for ${dt.toString()} in ${timeZoneString}`);
  }
  const instant2 = DisambiguatePossibleInstants(possibleInstants, timeZone2, dt, disambiguation);
  return GetSlot(instant2, EPOCHNANOSECONDS);
}
function ToTemporalZonedDateTime(item, options = ObjectCreate$2(null)) {
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, timeZone2, offset2, calendar2;
  let matchMinute = false;
  let offsetBehaviour = "option";
  if (IsObject(item)) {
    if (IsTemporalZonedDateTime(item))
      return item;
    calendar2 = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar2, [
      "day",
      "hour",
      "microsecond",
      "millisecond",
      "minute",
      "month",
      "monthCode",
      "nanosecond",
      "second",
      "year"
    ]);
    const fields = ToTemporalZonedDateTimeFields(item, fieldNames);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(calendar2, fields, options));
    timeZone2 = ToTemporalTimeZone(fields.timeZone);
    offset2 = fields.offset;
    if (offset2 === void 0) {
      offsetBehaviour = "wall";
    } else {
      offset2 = ToString(offset2);
    }
  } else {
    ToTemporalOverflow(options);
    let ianaName, z;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, ianaName, offset: offset2, z, calendar: calendar2 } = ParseTemporalZonedDateTimeString(ToString(item)));
    if (!ianaName)
      throw new RangeError("time zone ID required in brackets");
    if (z) {
      offsetBehaviour = "exact";
    } else if (!offset2) {
      offsetBehaviour = "wall";
    }
    const TemporalTimeZone = GetIntrinsic("%Temporal.TimeZone%");
    timeZone2 = new TemporalTimeZone(ianaName);
    if (!calendar2)
      calendar2 = GetISO8601Calendar();
    calendar2 = ToTemporalCalendar(calendar2);
    matchMinute = true;
  }
  let offsetNs = 0;
  if (offsetBehaviour === "option")
    offsetNs = ParseTimeZoneOffsetString(offset2);
  const disambiguation = ToTemporalDisambiguation(options);
  const offsetOpt = ToTemporalOffset(options, "reject");
  const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZone2, disambiguation, offsetOpt, matchMinute);
  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone2, calendar2);
}
function CreateTemporalDateSlots(result, isoYear, isoMonth, isoDay, calendar2) {
  RejectISODate(isoYear, isoMonth, isoDay);
  RejectDateRange(isoYear, isoMonth, isoDay);
  CreateSlots(result);
  SetSlot(result, ISO_YEAR, isoYear);
  SetSlot(result, ISO_MONTH, isoMonth);
  SetSlot(result, ISO_DAY, isoDay);
  SetSlot(result, CALENDAR, calendar2);
  SetSlot(result, DATE_BRAND, true);
  {
    ObjectDefineProperty(result, "_repr_", {
      value: `${result[Symbol.toStringTag]} <${TemporalDateToString(result)}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}
function CreateTemporalDate(isoYear, isoMonth, isoDay, calendar2 = GetISO8601Calendar()) {
  const TemporalPlainDate = GetIntrinsic("%Temporal.PlainDate%");
  const result = ObjectCreate$2(TemporalPlainDate.prototype);
  CreateTemporalDateSlots(result, isoYear, isoMonth, isoDay, calendar2);
  return result;
}
function CreateTemporalDateTimeSlots(result, isoYear, isoMonth, isoDay, h, min, s, ms, \u00B5s, ns, calendar2) {
  RejectDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, \u00B5s, ns);
  RejectDateTimeRange(isoYear, isoMonth, isoDay, h, min, s, ms, \u00B5s, ns);
  CreateSlots(result);
  SetSlot(result, ISO_YEAR, isoYear);
  SetSlot(result, ISO_MONTH, isoMonth);
  SetSlot(result, ISO_DAY, isoDay);
  SetSlot(result, ISO_HOUR, h);
  SetSlot(result, ISO_MINUTE, min);
  SetSlot(result, ISO_SECOND, s);
  SetSlot(result, ISO_MILLISECOND, ms);
  SetSlot(result, ISO_MICROSECOND, \u00B5s);
  SetSlot(result, ISO_NANOSECOND, ns);
  SetSlot(result, CALENDAR, calendar2);
  {
    Object.defineProperty(result, "_repr_", {
      value: `${result[Symbol.toStringTag]} <${TemporalDateTimeToString(result, "auto")}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}
function CreateTemporalDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, \u00B5s, ns, calendar2 = GetISO8601Calendar()) {
  const TemporalPlainDateTime = GetIntrinsic("%Temporal.PlainDateTime%");
  const result = ObjectCreate$2(TemporalPlainDateTime.prototype);
  CreateTemporalDateTimeSlots(result, isoYear, isoMonth, isoDay, h, min, s, ms, \u00B5s, ns, calendar2);
  return result;
}
function CreateTemporalMonthDaySlots(result, isoMonth, isoDay, calendar2, referenceISOYear) {
  RejectISODate(referenceISOYear, isoMonth, isoDay);
  RejectDateRange(referenceISOYear, isoMonth, isoDay);
  CreateSlots(result);
  SetSlot(result, ISO_MONTH, isoMonth);
  SetSlot(result, ISO_DAY, isoDay);
  SetSlot(result, ISO_YEAR, referenceISOYear);
  SetSlot(result, CALENDAR, calendar2);
  SetSlot(result, MONTH_DAY_BRAND, true);
  {
    Object.defineProperty(result, "_repr_", {
      value: `${result[Symbol.toStringTag]} <${TemporalMonthDayToString(result)}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}
function CreateTemporalMonthDay(isoMonth, isoDay, calendar2 = GetISO8601Calendar(), referenceISOYear = 1972) {
  const TemporalPlainMonthDay = GetIntrinsic("%Temporal.PlainMonthDay%");
  const result = ObjectCreate$2(TemporalPlainMonthDay.prototype);
  CreateTemporalMonthDaySlots(result, isoMonth, isoDay, calendar2, referenceISOYear);
  return result;
}
function CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar2, referenceISODay) {
  RejectISODate(isoYear, isoMonth, referenceISODay);
  RejectYearMonthRange(isoYear, isoMonth);
  CreateSlots(result);
  SetSlot(result, ISO_YEAR, isoYear);
  SetSlot(result, ISO_MONTH, isoMonth);
  SetSlot(result, ISO_DAY, referenceISODay);
  SetSlot(result, CALENDAR, calendar2);
  SetSlot(result, YEAR_MONTH_BRAND, true);
  {
    Object.defineProperty(result, "_repr_", {
      value: `${result[Symbol.toStringTag]} <${TemporalYearMonthToString(result)}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}
function CreateTemporalYearMonth(isoYear, isoMonth, calendar2 = GetISO8601Calendar(), referenceISODay = 1) {
  const TemporalPlainYearMonth = GetIntrinsic("%Temporal.PlainYearMonth%");
  const result = ObjectCreate$2(TemporalPlainYearMonth.prototype);
  CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar2, referenceISODay);
  return result;
}
function CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone2, calendar2) {
  ValidateEpochNanoseconds(epochNanoseconds);
  CreateSlots(result);
  SetSlot(result, EPOCHNANOSECONDS, epochNanoseconds);
  SetSlot(result, TIME_ZONE, timeZone2);
  SetSlot(result, CALENDAR, calendar2);
  const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
  const instant2 = new TemporalInstant(GetSlot(result, EPOCHNANOSECONDS));
  SetSlot(result, INSTANT, instant2);
  {
    Object.defineProperty(result, "_repr_", {
      value: `${result[Symbol.toStringTag]} <${TemporalZonedDateTimeToString(result, "auto")}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}
function CreateTemporalZonedDateTime(epochNanoseconds, timeZone2, calendar2 = GetISO8601Calendar()) {
  const TemporalZonedDateTime = GetIntrinsic("%Temporal.ZonedDateTime%");
  const result = ObjectCreate$2(TemporalZonedDateTime.prototype);
  CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone2, calendar2);
  return result;
}
function GetISO8601Calendar() {
  const TemporalCalendar = GetIntrinsic("%Temporal.Calendar%");
  return new TemporalCalendar("iso8601");
}
function CalendarFields(calendar2, fieldNamesParam) {
  let fieldNames = fieldNamesParam;
  if (calendar2.fields) {
    fieldNames = calendar2.fields(fieldNames);
  }
  const result = [];
  for (const name of fieldNames) {
    if (typeof name !== "string")
      throw new TypeError("bad return from calendar.fields()");
    ArrayPrototypePush$1.call(result, name);
  }
  return result;
}
function CalendarMergeFields(calendar2, fields, additionalFields) {
  const calMergeFields = calendar2.mergeFields;
  if (!calMergeFields) {
    return __spreadValues(__spreadValues({}, fields), additionalFields);
  }
  const result = Reflect.apply(calMergeFields, calendar2, [fields, additionalFields]);
  if (!IsObject(result))
    throw new TypeError("bad return from calendar.mergeFields()");
  return result;
}
function CalendarDateAdd(calendar2, date, duration2, options, dateAddParam) {
  let dateAdd = dateAddParam;
  if (dateAdd === void 0) {
    dateAdd = calendar2.dateAdd;
  }
  const result = ReflectApply$1(dateAdd, calendar2, [date, duration2, options]);
  if (!IsTemporalDate(result))
    throw new TypeError("invalid result");
  return result;
}
function CalendarDateUntil(calendar2, date, otherDate, options, dateUntilParam) {
  let dateUntil = dateUntilParam;
  if (dateUntil === void 0) {
    dateUntil = calendar2.dateUntil;
  }
  const result = ReflectApply$1(dateUntil, calendar2, [date, otherDate, options]);
  if (!IsTemporalDuration(result))
    throw new TypeError("invalid result");
  return result;
}
function CalendarYear(calendar2, dateLike) {
  const result = calendar2.year(dateLike);
  if (result === void 0) {
    throw new RangeError("calendar year result must be an integer");
  }
  return ToIntegerThrowOnInfinity(result);
}
function CalendarMonth(calendar2, dateLike) {
  const result = calendar2.month(dateLike);
  if (result === void 0) {
    throw new RangeError("calendar month result must be a positive integer");
  }
  return ToPositiveInteger(result);
}
function CalendarMonthCode(calendar2, dateLike) {
  const result = calendar2.monthCode(dateLike);
  if (result === void 0) {
    throw new RangeError("calendar monthCode result must be a string");
  }
  return ToString(result);
}
function CalendarDay(calendar2, dateLike) {
  const result = calendar2.day(dateLike);
  if (result === void 0) {
    throw new RangeError("calendar day result must be a positive integer");
  }
  return ToPositiveInteger(result);
}
function CalendarEra(calendar2, dateLike) {
  let result = calendar2.era(dateLike);
  if (result !== void 0) {
    result = ToString(result);
  }
  return result;
}
function CalendarEraYear(calendar2, dateLike) {
  let result = calendar2.eraYear(dateLike);
  if (result !== void 0) {
    result = ToIntegerThrowOnInfinity(result);
  }
  return result;
}
function CalendarDayOfWeek(calendar2, dateLike) {
  return calendar2.dayOfWeek(dateLike);
}
function CalendarDayOfYear(calendar2, dateLike) {
  return calendar2.dayOfYear(dateLike);
}
function CalendarWeekOfYear(calendar2, dateLike) {
  return calendar2.weekOfYear(dateLike);
}
function CalendarDaysInWeek(calendar2, dateLike) {
  return calendar2.daysInWeek(dateLike);
}
function CalendarDaysInMonth(calendar2, dateLike) {
  return calendar2.daysInMonth(dateLike);
}
function CalendarDaysInYear(calendar2, dateLike) {
  return calendar2.daysInYear(dateLike);
}
function CalendarMonthsInYear(calendar2, dateLike) {
  return calendar2.monthsInYear(dateLike);
}
function CalendarInLeapYear(calendar2, dateLike) {
  return calendar2.inLeapYear(dateLike);
}
function ToTemporalCalendar(calendarLikeParam) {
  let calendarLike = calendarLikeParam;
  if (IsObject(calendarLike)) {
    if (HasSlot(calendarLike, CALENDAR))
      return GetSlot(calendarLike, CALENDAR);
    if (!("calendar" in calendarLike))
      return calendarLike;
    calendarLike = calendarLike.calendar;
    if (IsObject(calendarLike) && !("calendar" in calendarLike))
      return calendarLike;
  }
  const identifier = ToString(calendarLike);
  const TemporalCalendar = GetIntrinsic("%Temporal.Calendar%");
  if (IsBuiltinCalendar(identifier))
    return new TemporalCalendar(identifier);
  let calendar2;
  try {
    ({ calendar: calendar2 } = ParseISODateTime(identifier));
  } catch {
    throw new RangeError(`Invalid calendar: ${identifier}`);
  }
  if (!calendar2)
    calendar2 = "iso8601";
  return new TemporalCalendar(calendar2);
}
function GetTemporalCalendarWithISODefault(item) {
  if (HasSlot(item, CALENDAR))
    return GetSlot(item, CALENDAR);
  const { calendar: calendar2 } = item;
  if (calendar2 === void 0)
    return GetISO8601Calendar();
  return ToTemporalCalendar(calendar2);
}
function CalendarEquals(one, two) {
  if (one === two)
    return true;
  const cal1 = ToString(one);
  const cal2 = ToString(two);
  return cal1 === cal2;
}
function ConsolidateCalendars(one, two) {
  if (one === two)
    return two;
  const sOne = ToString(one);
  const sTwo = ToString(two);
  if (sOne === sTwo || sOne === "iso8601") {
    return two;
  } else if (sTwo === "iso8601") {
    return one;
  } else {
    throw new RangeError("irreconcilable calendars");
  }
}
function DateFromFields(calendar2, fields, options) {
  const result = calendar2.dateFromFields(fields, options);
  if (!IsTemporalDate(result))
    throw new TypeError("invalid result");
  return result;
}
function YearMonthFromFields(calendar2, fields, options) {
  const result = calendar2.yearMonthFromFields(fields, options);
  if (!IsTemporalYearMonth(result))
    throw new TypeError("invalid result");
  return result;
}
function MonthDayFromFields(calendar2, fields, options) {
  const result = calendar2.monthDayFromFields(fields, options);
  if (!IsTemporalMonthDay(result))
    throw new TypeError("invalid result");
  return result;
}
function ToTemporalTimeZone(temporalTimeZoneLikeParam) {
  let temporalTimeZoneLike = temporalTimeZoneLikeParam;
  if (IsObject(temporalTimeZoneLike)) {
    if (IsTemporalZonedDateTime(temporalTimeZoneLike))
      return GetSlot(temporalTimeZoneLike, TIME_ZONE);
    if (!("timeZone" in temporalTimeZoneLike))
      return temporalTimeZoneLike;
    temporalTimeZoneLike = temporalTimeZoneLike.timeZone;
    if (IsObject(temporalTimeZoneLike) && !("timeZone" in temporalTimeZoneLike)) {
      return temporalTimeZoneLike;
    }
  }
  const identifier = ToString(temporalTimeZoneLike);
  const timeZone2 = ParseTemporalTimeZone(identifier);
  const TemporalTimeZone = GetIntrinsic("%Temporal.TimeZone%");
  return new TemporalTimeZone(timeZone2);
}
function TimeZoneEquals(one, two) {
  if (one === two)
    return true;
  const tz1 = ToString(one);
  const tz2 = ToString(two);
  return tz1 === tz2;
}
function TemporalDateTimeToDate(dateTime2) {
  return CreateTemporalDate(GetSlot(dateTime2, ISO_YEAR), GetSlot(dateTime2, ISO_MONTH), GetSlot(dateTime2, ISO_DAY), GetSlot(dateTime2, CALENDAR));
}
function TemporalDateTimeToTime(dateTime2) {
  const Time = GetIntrinsic("%Temporal.PlainTime%");
  return new Time(GetSlot(dateTime2, ISO_HOUR), GetSlot(dateTime2, ISO_MINUTE), GetSlot(dateTime2, ISO_SECOND), GetSlot(dateTime2, ISO_MILLISECOND), GetSlot(dateTime2, ISO_MICROSECOND), GetSlot(dateTime2, ISO_NANOSECOND));
}
function GetOffsetNanosecondsFor(timeZone2, instant2) {
  let getOffsetNanosecondsFor = timeZone2.getOffsetNanosecondsFor;
  if (typeof getOffsetNanosecondsFor !== "function") {
    throw new TypeError("getOffsetNanosecondsFor not callable");
  }
  const offsetNs = Reflect.apply(getOffsetNanosecondsFor, timeZone2, [instant2]);
  if (typeof offsetNs !== "number") {
    throw new TypeError("bad return from getOffsetNanosecondsFor");
  }
  if (!IsInteger(offsetNs) || MathAbs(offsetNs) > 864e11) {
    throw new RangeError("out-of-range return from getOffsetNanosecondsFor");
  }
  return offsetNs;
}
function BuiltinTimeZoneGetOffsetStringFor(timeZone2, instant2) {
  const offsetNs = GetOffsetNanosecondsFor(timeZone2, instant2);
  return FormatTimeZoneOffsetString(offsetNs);
}
function BuiltinTimeZoneGetPlainDateTimeFor(timeZone2, instant2, calendar2) {
  const ns = GetSlot(instant2, EPOCHNANOSECONDS);
  const offsetNs = GetOffsetNanosecondsFor(timeZone2, instant2);
  let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = GetISOPartsFromEpoch(ns);
  ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond + offsetNs));
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
}
function BuiltinTimeZoneGetInstantFor(timeZone2, dateTime2, disambiguation) {
  const possibleInstants = GetPossibleInstantsFor(timeZone2, dateTime2);
  return DisambiguatePossibleInstants(possibleInstants, timeZone2, dateTime2, disambiguation);
}
function DisambiguatePossibleInstants(possibleInstants, timeZone2, dateTime2, disambiguation) {
  const Instant2 = GetIntrinsic("%Temporal.Instant%");
  const numInstants = possibleInstants.length;
  if (numInstants === 1)
    return possibleInstants[0];
  if (numInstants) {
    switch (disambiguation) {
      case "compatible":
      case "earlier":
        return possibleInstants[0];
      case "later":
        return possibleInstants[numInstants - 1];
      case "reject": {
        throw new RangeError("multiple instants found");
      }
    }
  }
  const year = GetSlot(dateTime2, ISO_YEAR);
  const month = GetSlot(dateTime2, ISO_MONTH);
  const day = GetSlot(dateTime2, ISO_DAY);
  const hour = GetSlot(dateTime2, ISO_HOUR);
  const minute = GetSlot(dateTime2, ISO_MINUTE);
  const second = GetSlot(dateTime2, ISO_SECOND);
  const millisecond = GetSlot(dateTime2, ISO_MILLISECOND);
  const microsecond = GetSlot(dateTime2, ISO_MICROSECOND);
  const nanosecond = GetSlot(dateTime2, ISO_NANOSECOND);
  const utcns = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (utcns === null)
    throw new RangeError("DateTime outside of supported range");
  const dayBefore = new Instant2(JSBI.subtract(utcns, DAY_NANOS));
  const dayAfter = new Instant2(JSBI.add(utcns, DAY_NANOS));
  const offsetBefore = GetOffsetNanosecondsFor(timeZone2, dayBefore);
  const offsetAfter = GetOffsetNanosecondsFor(timeZone2, dayAfter);
  const nanoseconds = offsetAfter - offsetBefore;
  switch (disambiguation) {
    case "earlier": {
      const calendar2 = GetSlot(dateTime2, CALENDAR);
      const PlainDateTime2 = GetIntrinsic("%Temporal.PlainDateTime%");
      const earlier = AddDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2, 0, 0, 0, 0, 0, 0, 0, 0, 0, -nanoseconds, void 0);
      const earlierPlainDateTime = new PlainDateTime2(earlier.year, earlier.month, earlier.day, earlier.hour, earlier.minute, earlier.second, earlier.millisecond, earlier.microsecond, earlier.nanosecond, calendar2);
      return GetPossibleInstantsFor(timeZone2, earlierPlainDateTime)[0];
    }
    case "compatible":
    case "later": {
      const calendar2 = GetSlot(dateTime2, CALENDAR);
      const PlainDateTime2 = GetIntrinsic("%Temporal.PlainDateTime%");
      const later = AddDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2, 0, 0, 0, 0, 0, 0, 0, 0, 0, nanoseconds, void 0);
      const laterPlainDateTime = new PlainDateTime2(later.year, later.month, later.day, later.hour, later.minute, later.second, later.millisecond, later.microsecond, later.nanosecond, calendar2);
      const possible = GetPossibleInstantsFor(timeZone2, laterPlainDateTime);
      return possible[possible.length - 1];
    }
    case "reject": {
      throw new RangeError("no such instant found");
    }
  }
}
function GetPossibleInstantsFor(timeZone2, dateTime2) {
  const possibleInstants = timeZone2.getPossibleInstantsFor(dateTime2);
  const result = [];
  for (const instant2 of possibleInstants) {
    if (!IsTemporalInstant(instant2)) {
      throw new TypeError("bad return from getPossibleInstantsFor");
    }
    ArrayPrototypePush$1.call(result, instant2);
  }
  return result;
}
function ISOYearString(year) {
  let yearString;
  if (year < 1e3 || year > 9999) {
    const sign = year < 0 ? "-" : "+";
    const yearNumber = MathAbs(year);
    yearString = sign + `000000${yearNumber}`.slice(-6);
  } else {
    yearString = `${year}`;
  }
  return yearString;
}
function ISODateTimePartString(part) {
  return `00${part}`.slice(-2);
}
function FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision) {
  if (precision === "minute")
    return "";
  const secs = `:${ISODateTimePartString(second)}`;
  let fractionNumber = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
  let fraction2;
  if (precision === "auto") {
    if (fractionNumber === 0)
      return secs;
    fraction2 = `${fractionNumber}`.padStart(9, "0");
    while (fraction2[fraction2.length - 1] === "0")
      fraction2 = fraction2.slice(0, -1);
  } else {
    if (precision === 0)
      return secs;
    fraction2 = `${fractionNumber}`.padStart(9, "0").slice(0, precision);
  }
  return `${secs}.${fraction2}`;
}
function TemporalInstantToString(instant2, timeZone2, precision) {
  let outputTimeZone = timeZone2;
  if (outputTimeZone === void 0) {
    const TemporalTimeZone = GetIntrinsic("%Temporal.TimeZone%");
    outputTimeZone = new TemporalTimeZone("UTC");
  }
  const iso = GetISO8601Calendar();
  const dateTime2 = BuiltinTimeZoneGetPlainDateTimeFor(outputTimeZone, instant2, iso);
  const year = ISOYearString(GetSlot(dateTime2, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(dateTime2, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(dateTime2, ISO_DAY));
  const hour = ISODateTimePartString(GetSlot(dateTime2, ISO_HOUR));
  const minute = ISODateTimePartString(GetSlot(dateTime2, ISO_MINUTE));
  const seconds = FormatSecondsStringPart(GetSlot(dateTime2, ISO_SECOND), GetSlot(dateTime2, ISO_MILLISECOND), GetSlot(dateTime2, ISO_MICROSECOND), GetSlot(dateTime2, ISO_NANOSECOND), precision);
  let timeZoneString = "Z";
  if (timeZone2 !== void 0) {
    const offsetNs = GetOffsetNanosecondsFor(outputTimeZone, instant2);
    timeZoneString = FormatISOTimeZoneOffsetString(offsetNs);
  }
  return `${year}-${month}-${day}T${hour}:${minute}${seconds}${timeZoneString}`;
}
function TemporalDurationToString(duration2, precision = "auto", options = void 0) {
  function formatNumber(num) {
    if (num <= NumberMaxSafeInteger)
      return num.toString(10);
    return JSBI.BigInt(num).toString(10);
  }
  const years = GetSlot(duration2, YEARS);
  const months = GetSlot(duration2, MONTHS);
  const weeks = GetSlot(duration2, WEEKS);
  const days = GetSlot(duration2, DAYS);
  const hours = GetSlot(duration2, HOURS);
  const minutes = GetSlot(duration2, MINUTES);
  let seconds = GetSlot(duration2, SECONDS);
  let ms = GetSlot(duration2, MILLISECONDS);
  let \u00B5s = GetSlot(duration2, MICROSECONDS);
  let ns = GetSlot(duration2, NANOSECONDS);
  const sign = DurationSign(years, months, weeks, days, hours, minutes, seconds, ms, \u00B5s, ns);
  if (options) {
    const { unit, increment, roundingMode } = options;
    ({
      seconds,
      milliseconds: ms,
      microseconds: \u00B5s,
      nanoseconds: ns
    } = RoundDuration(0, 0, 0, 0, 0, 0, seconds, ms, \u00B5s, ns, increment, unit, roundingMode));
  }
  const dateParts = [];
  if (years)
    dateParts.push(`${formatNumber(MathAbs(years))}Y`);
  if (months)
    dateParts.push(`${formatNumber(MathAbs(months))}M`);
  if (weeks)
    dateParts.push(`${formatNumber(MathAbs(weeks))}W`);
  if (days)
    dateParts.push(`${formatNumber(MathAbs(days))}D`);
  const timeParts = [];
  if (hours)
    timeParts.push(`${formatNumber(MathAbs(hours))}H`);
  if (minutes)
    timeParts.push(`${formatNumber(MathAbs(minutes))}M`);
  const secondParts = [];
  let total = TotalDurationNanoseconds(0, 0, 0, seconds, ms, \u00B5s, ns, 0);
  let nsBigInt, \u00B5sBigInt, msBigInt, secondsBigInt;
  ({ quotient: total, remainder: nsBigInt } = divmod(total, THOUSAND));
  ({ quotient: total, remainder: \u00B5sBigInt } = divmod(total, THOUSAND));
  ({ quotient: secondsBigInt, remainder: msBigInt } = divmod(total, THOUSAND));
  const fraction2 = MathAbs(JSBI.toNumber(msBigInt)) * 1e6 + MathAbs(JSBI.toNumber(\u00B5sBigInt)) * 1e3 + MathAbs(JSBI.toNumber(nsBigInt));
  let decimalPart;
  if (precision === "auto") {
    if (fraction2 !== 0) {
      decimalPart = `${fraction2}`.padStart(9, "0");
      while (decimalPart[decimalPart.length - 1] === "0") {
        decimalPart = decimalPart.slice(0, -1);
      }
    }
  } else if (precision !== 0) {
    decimalPart = `${fraction2}`.padStart(9, "0").slice(0, precision);
  }
  if (decimalPart)
    secondParts.unshift(".", decimalPart);
  if (!JSBI.equal(secondsBigInt, ZERO) || secondParts.length || precision !== "auto") {
    secondParts.unshift(abs(secondsBigInt).toString());
  }
  if (secondParts.length)
    timeParts.push(`${secondParts.join("")}S`);
  if (timeParts.length)
    timeParts.unshift("T");
  if (!dateParts.length && !timeParts.length)
    return "PT0S";
  return `${sign < 0 ? "-" : ""}P${dateParts.join("")}${timeParts.join("")}`;
}
function TemporalDateToString(date, showCalendar = "auto") {
  const year = ISOYearString(GetSlot(date, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(date, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(date, ISO_DAY));
  const calendarID2 = ToString(GetSlot(date, CALENDAR));
  const calendar2 = FormatCalendarAnnotation(calendarID2, showCalendar);
  return `${year}-${month}-${day}${calendar2}`;
}
function TemporalDateTimeToString(dateTime2, precision, showCalendar = "auto", options = void 0) {
  let year = GetSlot(dateTime2, ISO_YEAR);
  let month = GetSlot(dateTime2, ISO_MONTH);
  let day = GetSlot(dateTime2, ISO_DAY);
  let hour = GetSlot(dateTime2, ISO_HOUR);
  let minute = GetSlot(dateTime2, ISO_MINUTE);
  let second = GetSlot(dateTime2, ISO_SECOND);
  let millisecond = GetSlot(dateTime2, ISO_MILLISECOND);
  let microsecond = GetSlot(dateTime2, ISO_MICROSECOND);
  let nanosecond = GetSlot(dateTime2, ISO_NANOSECOND);
  if (options) {
    const { unit, increment, roundingMode } = options;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode));
  }
  const yearString = ISOYearString(year);
  const monthString = ISODateTimePartString(month);
  const dayString = ISODateTimePartString(day);
  const hourString = ISODateTimePartString(hour);
  const minuteString = ISODateTimePartString(minute);
  const secondsString = FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
  const calendarID2 = ToString(GetSlot(dateTime2, CALENDAR));
  const calendar2 = FormatCalendarAnnotation(calendarID2, showCalendar);
  return `${yearString}-${monthString}-${dayString}T${hourString}:${minuteString}${secondsString}${calendar2}`;
}
function TemporalMonthDayToString(monthDay, showCalendar = "auto") {
  const month = ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
  let resultString = `${month}-${day}`;
  const calendar2 = GetSlot(monthDay, CALENDAR);
  const calendarID2 = ToString(calendar2);
  if (calendarID2 !== "iso8601") {
    const year = ISOYearString(GetSlot(monthDay, ISO_YEAR));
    resultString = `${year}-${resultString}`;
  }
  const calendarString = FormatCalendarAnnotation(calendarID2, showCalendar);
  if (calendarString)
    resultString += calendarString;
  return resultString;
}
function TemporalYearMonthToString(yearMonth, showCalendar = "auto") {
  const year = ISOYearString(GetSlot(yearMonth, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
  let resultString = `${year}-${month}`;
  const calendar2 = GetSlot(yearMonth, CALENDAR);
  const calendarID2 = ToString(calendar2);
  if (calendarID2 !== "iso8601") {
    const day = ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
    resultString += `-${day}`;
  }
  const calendarString = FormatCalendarAnnotation(calendarID2, showCalendar);
  if (calendarString)
    resultString += calendarString;
  return resultString;
}
function TemporalZonedDateTimeToString(zdt, precision, showCalendar = "auto", showTimeZone = "auto", showOffset = "auto", options = void 0) {
  let instant2 = GetSlot(zdt, INSTANT);
  if (options) {
    const { unit, increment, roundingMode } = options;
    const ns = RoundInstant(GetSlot(zdt, EPOCHNANOSECONDS), increment, unit, roundingMode);
    const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
    instant2 = new TemporalInstant(ns);
  }
  const tz = GetSlot(zdt, TIME_ZONE);
  const iso = GetISO8601Calendar();
  const dateTime2 = BuiltinTimeZoneGetPlainDateTimeFor(tz, instant2, iso);
  const year = ISOYearString(GetSlot(dateTime2, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(dateTime2, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(dateTime2, ISO_DAY));
  const hour = ISODateTimePartString(GetSlot(dateTime2, ISO_HOUR));
  const minute = ISODateTimePartString(GetSlot(dateTime2, ISO_MINUTE));
  const seconds = FormatSecondsStringPart(GetSlot(dateTime2, ISO_SECOND), GetSlot(dateTime2, ISO_MILLISECOND), GetSlot(dateTime2, ISO_MICROSECOND), GetSlot(dateTime2, ISO_NANOSECOND), precision);
  let result = `${year}-${month}-${day}T${hour}:${minute}${seconds}`;
  if (showOffset !== "never") {
    const offsetNs = GetOffsetNanosecondsFor(tz, instant2);
    result += FormatISOTimeZoneOffsetString(offsetNs);
  }
  if (showTimeZone !== "never")
    result += `[${tz}]`;
  const calendarID2 = ToString(GetSlot(zdt, CALENDAR));
  result += FormatCalendarAnnotation(calendarID2, showCalendar);
  return result;
}
function TestTimeZoneOffsetString(string) {
  return OFFSET.test(StringCtor(string));
}
function ParseTimeZoneOffsetString(string) {
  const match = OFFSET.exec(StringCtor(string));
  if (!match) {
    throw new RangeError(`invalid time zone offset: ${string}`);
  }
  const sign = match[1] === "-" || match[1] === "\u2212" ? -1 : 1;
  const hours = +match[2];
  const minutes = +(match[3] || 0);
  const seconds = +(match[4] || 0);
  const nanoseconds = +((match[5] || 0) + "000000000").slice(0, 9);
  return sign * (((hours * 60 + minutes) * 60 + seconds) * 1e9 + nanoseconds);
}
function GetCanonicalTimeZoneIdentifier(timeZoneIdentifier) {
  if (TestTimeZoneOffsetString(timeZoneIdentifier)) {
    const offsetNs = ParseTimeZoneOffsetString(timeZoneIdentifier);
    return FormatTimeZoneOffsetString(offsetNs);
  }
  const formatter = getIntlDateTimeFormatEnUsForTimeZone(StringCtor(timeZoneIdentifier));
  return formatter.resolvedOptions().timeZone;
}
function GetIANATimeZoneOffsetNanoseconds(epochNanoseconds, id) {
  const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = GetIANATimeZoneDateTimeParts(epochNanoseconds, id);
  const utc = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (utc === null)
    throw new RangeError("Date outside of supported range");
  return JSBI.toNumber(JSBI.subtract(utc, epochNanoseconds));
}
function FormatTimeZoneOffsetString(offsetNanosecondsParam) {
  const sign = offsetNanosecondsParam < 0 ? "-" : "+";
  const offsetNanoseconds = MathAbs(offsetNanosecondsParam);
  const nanoseconds = offsetNanoseconds % 1e9;
  const seconds = MathFloor(offsetNanoseconds / 1e9) % 60;
  const minutes = MathFloor(offsetNanoseconds / 6e10) % 60;
  const hours = MathFloor(offsetNanoseconds / 36e11);
  const hourString = ISODateTimePartString(hours);
  const minuteString = ISODateTimePartString(minutes);
  const secondString = ISODateTimePartString(seconds);
  let post = "";
  if (nanoseconds) {
    let fraction2 = `${nanoseconds}`.padStart(9, "0");
    while (fraction2[fraction2.length - 1] === "0")
      fraction2 = fraction2.slice(0, -1);
    post = `:${secondString}.${fraction2}`;
  } else if (seconds) {
    post = `:${secondString}`;
  }
  return `${sign}${hourString}:${minuteString}${post}`;
}
function FormatISOTimeZoneOffsetString(offsetNanosecondsParam) {
  let offsetNanoseconds = JSBI.toNumber(RoundNumberToIncrement(JSBI.BigInt(offsetNanosecondsParam), 6e10, "halfExpand"));
  const sign = offsetNanoseconds < 0 ? "-" : "+";
  offsetNanoseconds = MathAbs(offsetNanoseconds);
  const minutes = offsetNanoseconds / 6e10 % 60;
  const hours = MathFloor(offsetNanoseconds / 36e11);
  const hourString = ISODateTimePartString(hours);
  const minuteString = ISODateTimePartString(minutes);
  return `${sign}${hourString}:${minuteString}`;
}
function GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  const legacyDate = new Date();
  legacyDate.setUTCHours(hour, minute, second, millisecond);
  legacyDate.setUTCFullYear(year, month - 1, day);
  const ms = legacyDate.getTime();
  if (NumberIsNaN(ms))
    return null;
  let ns = JSBI.multiply(JSBI.BigInt(ms), MILLION);
  ns = JSBI.add(ns, JSBI.multiply(JSBI.BigInt(microsecond), THOUSAND));
  ns = JSBI.add(ns, JSBI.BigInt(nanosecond));
  if (JSBI.lessThan(ns, NS_MIN) || JSBI.greaterThan(ns, NS_MAX))
    return null;
  return ns;
}
function GetISOPartsFromEpoch(epochNanoseconds) {
  const { quotient, remainder } = divmod(epochNanoseconds, MILLION);
  let epochMilliseconds = JSBI.toNumber(quotient);
  let nanos = JSBI.toNumber(remainder);
  if (nanos < 0) {
    nanos += 1e6;
    epochMilliseconds -= 1;
  }
  const microsecond = MathFloor(nanos / 1e3) % 1e3;
  const nanosecond = nanos % 1e3;
  const item = new Date(epochMilliseconds);
  const year = item.getUTCFullYear();
  const month = item.getUTCMonth() + 1;
  const day = item.getUTCDate();
  const hour = item.getUTCHours();
  const minute = item.getUTCMinutes();
  const second = item.getUTCSeconds();
  const millisecond = item.getUTCMilliseconds();
  return { epochMilliseconds, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}
function GetIANATimeZoneDateTimeParts(epochNanoseconds, id) {
  const { epochMilliseconds, millisecond, microsecond, nanosecond } = GetISOPartsFromEpoch(epochNanoseconds);
  const { year, month, day, hour, minute, second } = GetFormatterParts(id, epochMilliseconds);
  return BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
}
function maxJSBI(one, two) {
  return JSBI.lessThan(one, two) ? two : one;
}
function afterLatestPossibleTzdbRuleChange() {
  return JSBI.add(SystemUTCEpochNanoSeconds(), ABOUT_TEN_YEARS_NANOS);
}
function GetIANATimeZoneNextTransition(epochNanoseconds, id) {
  const oneYearLater = JSBI.add(epochNanoseconds, ABOUT_ONE_YEAR_NANOS);
  const uppercap = maxJSBI(afterLatestPossibleTzdbRuleChange(), oneYearLater);
  let leftNanos = maxJSBI(BEFORE_FIRST_OFFSET_TRANSITION, epochNanoseconds);
  const leftOffsetNs = GetIANATimeZoneOffsetNanoseconds(leftNanos, id);
  let rightNanos = leftNanos;
  let rightOffsetNs = leftOffsetNs;
  while (leftOffsetNs === rightOffsetNs && JSBI.lessThan(JSBI.BigInt(leftNanos), uppercap)) {
    rightNanos = JSBI.add(leftNanos, TWO_WEEKS_NANOS);
    rightOffsetNs = GetIANATimeZoneOffsetNanoseconds(rightNanos, id);
    if (leftOffsetNs === rightOffsetNs) {
      leftNanos = rightNanos;
    }
  }
  if (leftOffsetNs === rightOffsetNs)
    return null;
  const result = bisect((epochNs) => GetIANATimeZoneOffsetNanoseconds(epochNs, id), leftNanos, rightNanos, leftOffsetNs, rightOffsetNs);
  return result;
}
function GetIANATimeZonePreviousTransition(epochNanoseconds, id) {
  const afterLatestRule = afterLatestPossibleTzdbRuleChange();
  const isFarFuture = JSBI.greaterThan(epochNanoseconds, afterLatestRule);
  const lowercap = isFarFuture ? JSBI.subtract(epochNanoseconds, ABOUT_ONE_YEAR_NANOS) : BEFORE_FIRST_OFFSET_TRANSITION;
  let rightNanos = JSBI.subtract(epochNanoseconds, ONE);
  const rightOffsetNs = GetIANATimeZoneOffsetNanoseconds(rightNanos, id);
  let leftNanos = rightNanos;
  let leftOffsetNs = rightOffsetNs;
  while (rightOffsetNs === leftOffsetNs && JSBI.greaterThan(rightNanos, lowercap)) {
    leftNanos = JSBI.subtract(rightNanos, TWO_WEEKS_NANOS);
    leftOffsetNs = GetIANATimeZoneOffsetNanoseconds(leftNanos, id);
    if (rightOffsetNs === leftOffsetNs) {
      rightNanos = leftNanos;
    }
  }
  if (rightOffsetNs === leftOffsetNs) {
    if (isFarFuture) {
      const newTimeToCheck = JSBI.subtract(afterLatestRule, DAY_NANOS);
      return GetIANATimeZonePreviousTransition(newTimeToCheck, id);
    }
    return null;
  }
  const result = bisect((epochNs) => GetIANATimeZoneOffsetNanoseconds(epochNs, id), leftNanos, rightNanos, leftOffsetNs, rightOffsetNs);
  return result;
}
function parseFromEnUsFormat(datetime) {
  const parts = datetime.split(/[^\w]+/);
  if (parts.length !== 7) {
    throw new RangeError(`expected 7 parts in "${datetime}`);
  }
  const month = +parts[0];
  const day = +parts[1];
  let year = +parts[2];
  const era = parts[3].toUpperCase();
  if (era === "B" || era === "BC") {
    year = -year + 1;
  } else if (era !== "A" && era !== "AD") {
    throw new RangeError(`Unknown era ${era} in "${datetime}`);
  }
  let hour = +parts[4];
  if (hour === 24) {
    hour = 0;
  }
  const minute = +parts[5];
  const second = +parts[6];
  if (!NumberIsFinite(year) || !NumberIsFinite(month) || !NumberIsFinite(day) || !NumberIsFinite(hour) || !NumberIsFinite(minute) || !NumberIsFinite(second)) {
    throw new RangeError(`Invalid number in "${datetime}`);
  }
  return { year, month, day, hour, minute, second };
}
function GetFormatterParts(timeZone2, epochMilliseconds) {
  const formatter = getIntlDateTimeFormatEnUsForTimeZone(timeZone2);
  const datetime = formatter.format(new Date(epochMilliseconds));
  return parseFromEnUsFormat(datetime);
}
function GetIANATimeZoneEpochValue(id, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  const ns = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (ns === null)
    throw new RangeError("DateTime outside of supported range");
  let nsEarlier = JSBI.subtract(ns, DAY_NANOS);
  if (JSBI.lessThan(nsEarlier, NS_MIN))
    nsEarlier = ns;
  let nsLater = JSBI.add(ns, DAY_NANOS);
  if (JSBI.greaterThan(nsLater, NS_MAX))
    nsLater = ns;
  const earliest = GetIANATimeZoneOffsetNanoseconds(nsEarlier, id);
  const latest = GetIANATimeZoneOffsetNanoseconds(nsLater, id);
  const found = earliest === latest ? [earliest] : [earliest, latest];
  return found.map((offsetNanoseconds) => {
    const epochNanoseconds = JSBI.subtract(ns, JSBI.BigInt(offsetNanoseconds));
    const parts = GetIANATimeZoneDateTimeParts(epochNanoseconds, id);
    if (year !== parts.year || month !== parts.month || day !== parts.day || hour !== parts.hour || minute !== parts.minute || second !== parts.second || millisecond !== parts.millisecond || microsecond !== parts.microsecond || nanosecond !== parts.nanosecond) {
      return void 0;
    }
    return epochNanoseconds;
  }).filter((x) => x !== void 0);
}
function LeapYear(year) {
  if (year === void 0)
    return false;
  const isDiv4 = year % 4 === 0;
  const isDiv100 = year % 100 === 0;
  const isDiv400 = year % 400 === 0;
  return isDiv4 && (!isDiv100 || isDiv400);
}
function ISODaysInMonth(year, month) {
  const DoM = {
    standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  };
  return DoM[LeapYear(year) ? "leapyear" : "standard"][month - 1];
}
function DayOfWeek(year, month, day) {
  const m = month + (month < 3 ? 10 : -2);
  const Y = year - (month < 3 ? 1 : 0);
  const c = MathFloor(Y / 100);
  const y = Y - c * 100;
  const d = day;
  const pD = d;
  const pM = MathFloor(2.6 * m - 0.2);
  const pY = y + MathFloor(y / 4);
  const pC = MathFloor(c / 4) - 2 * c;
  const dow = (pD + pM + pY + pC) % 7;
  return dow + (dow <= 0 ? 7 : 0);
}
function DayOfYear(year, month, day) {
  let days = day;
  for (let m = month - 1; m > 0; m--) {
    days += ISODaysInMonth(year, m);
  }
  return days;
}
function WeekOfYear(year, month, day) {
  const doy = DayOfYear(year, month, day);
  const dow = DayOfWeek(year, month, day) || 7;
  const doj = DayOfWeek(year, 1, 1);
  const week = MathFloor((doy - dow + 10) / 7);
  if (week < 1) {
    if (doj === 5 || doj === 6 && LeapYear(year - 1)) {
      return 53;
    } else {
      return 52;
    }
  }
  if (week === 53) {
    if ((LeapYear(year) ? 366 : 365) - doy < 4 - dow) {
      return 1;
    }
  }
  return week;
}
function DurationSign(y, mon, w, d, h, min, s, ms, \u00B5s, ns) {
  for (const prop of [y, mon, w, d, h, min, s, ms, \u00B5s, ns]) {
    if (prop !== 0)
      return prop < 0 ? -1 : 1;
  }
  return 0;
}
function BalanceISOYearMonth(yearParam, monthParam) {
  let year = yearParam;
  let month = monthParam;
  if (!NumberIsFinite(year) || !NumberIsFinite(month))
    throw new RangeError("infinity is out of range");
  month -= 1;
  year += MathFloor(month / 12);
  month %= 12;
  if (month < 0)
    month += 12;
  month += 1;
  return { year, month };
}
function BalanceISODate(yearParam, monthParam, dayParam) {
  let year = yearParam;
  let month = monthParam;
  let day = dayParam;
  if (!NumberIsFinite(day))
    throw new RangeError("infinity is out of range");
  ({ year, month } = BalanceISOYearMonth(year, month));
  let daysInYear = 0;
  let testYear = month > 2 ? year : year - 1;
  while (daysInYear = LeapYear(testYear) ? 366 : 365, day < -daysInYear) {
    year -= 1;
    testYear -= 1;
    day += daysInYear;
  }
  testYear += 1;
  while (daysInYear = LeapYear(testYear) ? 366 : 365, day > daysInYear) {
    year += 1;
    testYear += 1;
    day -= daysInYear;
  }
  while (day < 1) {
    ({ year, month } = BalanceISOYearMonth(year, month - 1));
    day += ISODaysInMonth(year, month);
  }
  while (day > ISODaysInMonth(year, month)) {
    day -= ISODaysInMonth(year, month);
    ({ year, month } = BalanceISOYearMonth(year, month + 1));
  }
  return { year, month, day };
}
function BalanceISODateTime(yearParam, monthParam, dayParam, hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam) {
  const { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = BalanceTime(hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam);
  const { year, month, day } = BalanceISODate(yearParam, monthParam, dayParam + deltaDays);
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}
function BalanceTime(hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam) {
  let hour = hourParam;
  let minute = minuteParam;
  let second = secondParam;
  let millisecond = millisecondParam;
  let microsecond = microsecondParam;
  let nanosecond = nanosecondParam;
  if (!NumberIsFinite(hour) || !NumberIsFinite(minute) || !NumberIsFinite(second) || !NumberIsFinite(millisecond) || !NumberIsFinite(microsecond) || !NumberIsFinite(nanosecond)) {
    throw new RangeError("infinity is out of range");
  }
  microsecond += MathFloor(nanosecond / 1e3);
  nanosecond = NonNegativeModulo(nanosecond, 1e3);
  millisecond += MathFloor(microsecond / 1e3);
  microsecond = NonNegativeModulo(microsecond, 1e3);
  second += MathFloor(millisecond / 1e3);
  millisecond = NonNegativeModulo(millisecond, 1e3);
  minute += MathFloor(second / 60);
  second = NonNegativeModulo(second, 60);
  hour += MathFloor(minute / 60);
  minute = NonNegativeModulo(minute, 60);
  const deltaDays = MathFloor(hour / 24);
  hour = NonNegativeModulo(hour, 24);
  return { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond };
}
function TotalDurationNanoseconds(daysParam, hoursParam, minutesParam, secondsParam, millisecondsParam, microsecondsParam, nanosecondsParam, offsetShift) {
  const days = JSBI.BigInt(daysParam);
  let nanoseconds = JSBI.BigInt(nanosecondsParam);
  if (daysParam !== 0)
    nanoseconds = JSBI.subtract(JSBI.BigInt(nanosecondsParam), JSBI.BigInt(offsetShift));
  const hours = JSBI.add(JSBI.BigInt(hoursParam), JSBI.multiply(days, JSBI.BigInt(24)));
  const minutes = JSBI.add(JSBI.BigInt(minutesParam), JSBI.multiply(hours, SIXTY));
  const seconds = JSBI.add(JSBI.BigInt(secondsParam), JSBI.multiply(minutes, SIXTY));
  const milliseconds = JSBI.add(JSBI.BigInt(millisecondsParam), JSBI.multiply(seconds, THOUSAND));
  const microseconds = JSBI.add(JSBI.BigInt(microsecondsParam), JSBI.multiply(milliseconds, THOUSAND));
  return JSBI.add(JSBI.BigInt(nanoseconds), JSBI.multiply(microseconds, THOUSAND));
}
function NanosecondsToDays(nanosecondsParam, relativeTo) {
  const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
  const sign = MathSign(JSBI.toNumber(nanosecondsParam));
  let nanoseconds = JSBI.BigInt(nanosecondsParam);
  let dayLengthNs = 864e11;
  if (sign === 0)
    return { days: 0, nanoseconds: ZERO, dayLengthNs };
  if (!IsTemporalZonedDateTime(relativeTo)) {
    let days2;
    ({ quotient: days2, remainder: nanoseconds } = divmod(nanoseconds, JSBI.BigInt(dayLengthNs)));
    return { days: JSBI.toNumber(days2), nanoseconds, dayLengthNs };
  }
  const startNs = GetSlot(relativeTo, EPOCHNANOSECONDS);
  const start = GetSlot(relativeTo, INSTANT);
  const endNs = JSBI.add(startNs, nanoseconds);
  const end = new TemporalInstant(endNs);
  const timeZone2 = GetSlot(relativeTo, TIME_ZONE);
  const calendar2 = GetSlot(relativeTo, CALENDAR);
  const dtStart = BuiltinTimeZoneGetPlainDateTimeFor(timeZone2, start, calendar2);
  const dtEnd = BuiltinTimeZoneGetPlainDateTimeFor(timeZone2, end, calendar2);
  let { days } = DifferenceISODateTime(GetSlot(dtStart, ISO_YEAR), GetSlot(dtStart, ISO_MONTH), GetSlot(dtStart, ISO_DAY), GetSlot(dtStart, ISO_HOUR), GetSlot(dtStart, ISO_MINUTE), GetSlot(dtStart, ISO_SECOND), GetSlot(dtStart, ISO_MILLISECOND), GetSlot(dtStart, ISO_MICROSECOND), GetSlot(dtStart, ISO_NANOSECOND), GetSlot(dtEnd, ISO_YEAR), GetSlot(dtEnd, ISO_MONTH), GetSlot(dtEnd, ISO_DAY), GetSlot(dtEnd, ISO_HOUR), GetSlot(dtEnd, ISO_MINUTE), GetSlot(dtEnd, ISO_SECOND), GetSlot(dtEnd, ISO_MILLISECOND), GetSlot(dtEnd, ISO_MICROSECOND), GetSlot(dtEnd, ISO_NANOSECOND), calendar2, "day");
  let intermediateNs = AddZonedDateTime(start, timeZone2, calendar2, 0, 0, 0, days, 0, 0, 0, 0, 0, 0);
  if (sign === 1) {
    while (days > 0 && JSBI.greaterThan(intermediateNs, endNs)) {
      --days;
      intermediateNs = AddZonedDateTime(start, timeZone2, calendar2, 0, 0, 0, days, 0, 0, 0, 0, 0, 0);
    }
  }
  nanoseconds = JSBI.subtract(endNs, intermediateNs);
  let isOverflow = false;
  let relativeInstant = new TemporalInstant(intermediateNs);
  do {
    const oneDayFartherNs = AddZonedDateTime(relativeInstant, timeZone2, calendar2, 0, 0, 0, sign, 0, 0, 0, 0, 0, 0);
    const relativeNs = GetSlot(relativeInstant, EPOCHNANOSECONDS);
    dayLengthNs = JSBI.toNumber(JSBI.subtract(oneDayFartherNs, relativeNs));
    isOverflow = JSBI.greaterThan(JSBI.multiply(JSBI.subtract(nanoseconds, JSBI.BigInt(dayLengthNs)), JSBI.BigInt(sign)), ZERO);
    if (isOverflow) {
      nanoseconds = JSBI.subtract(nanoseconds, JSBI.BigInt(dayLengthNs));
      relativeInstant = new TemporalInstant(oneDayFartherNs);
      days += sign;
    }
  } while (isOverflow);
  return { days, nanoseconds, dayLengthNs: MathAbs(dayLengthNs) };
}
function BalanceDuration(daysParam, hoursParam, minutesParam, secondsParam, millisecondsParam, microsecondsParam, nanosecondsParam, largestUnit, relativeTo = void 0) {
  let days = daysParam;
  let nanosecondsBigInt, microsecondsBigInt, millisecondsBigInt, secondsBigInt, minutesBigInt, hoursBigInt;
  if (IsTemporalZonedDateTime(relativeTo)) {
    const endNs = AddZonedDateTime(GetSlot(relativeTo, INSTANT), GetSlot(relativeTo, TIME_ZONE), GetSlot(relativeTo, CALENDAR), 0, 0, 0, days, hoursParam, minutesParam, secondsParam, millisecondsParam, microsecondsParam, nanosecondsParam);
    const startNs = GetSlot(relativeTo, EPOCHNANOSECONDS);
    nanosecondsBigInt = JSBI.subtract(endNs, startNs);
  } else {
    nanosecondsBigInt = TotalDurationNanoseconds(days, hoursParam, minutesParam, secondsParam, millisecondsParam, microsecondsParam, nanosecondsParam, 0);
  }
  if (largestUnit === "year" || largestUnit === "month" || largestUnit === "week" || largestUnit === "day") {
    ({ days, nanoseconds: nanosecondsBigInt } = NanosecondsToDays(nanosecondsBigInt, relativeTo));
  } else {
    days = 0;
  }
  const sign = JSBI.lessThan(nanosecondsBigInt, ZERO) ? -1 : 1;
  nanosecondsBigInt = abs(nanosecondsBigInt);
  microsecondsBigInt = millisecondsBigInt = secondsBigInt = minutesBigInt = hoursBigInt = ZERO;
  switch (largestUnit) {
    case "year":
    case "month":
    case "week":
    case "day":
    case "hour":
      ({ quotient: microsecondsBigInt, remainder: nanosecondsBigInt } = divmod(nanosecondsBigInt, THOUSAND));
      ({ quotient: millisecondsBigInt, remainder: microsecondsBigInt } = divmod(microsecondsBigInt, THOUSAND));
      ({ quotient: secondsBigInt, remainder: millisecondsBigInt } = divmod(millisecondsBigInt, THOUSAND));
      ({ quotient: minutesBigInt, remainder: secondsBigInt } = divmod(secondsBigInt, SIXTY));
      ({ quotient: hoursBigInt, remainder: minutesBigInt } = divmod(minutesBigInt, SIXTY));
      break;
    case "minute":
      ({ quotient: microsecondsBigInt, remainder: nanosecondsBigInt } = divmod(nanosecondsBigInt, THOUSAND));
      ({ quotient: millisecondsBigInt, remainder: microsecondsBigInt } = divmod(microsecondsBigInt, THOUSAND));
      ({ quotient: secondsBigInt, remainder: millisecondsBigInt } = divmod(millisecondsBigInt, THOUSAND));
      ({ quotient: minutesBigInt, remainder: secondsBigInt } = divmod(secondsBigInt, SIXTY));
      break;
    case "second":
      ({ quotient: microsecondsBigInt, remainder: nanosecondsBigInt } = divmod(nanosecondsBigInt, THOUSAND));
      ({ quotient: millisecondsBigInt, remainder: microsecondsBigInt } = divmod(microsecondsBigInt, THOUSAND));
      ({ quotient: secondsBigInt, remainder: millisecondsBigInt } = divmod(millisecondsBigInt, THOUSAND));
      break;
    case "millisecond":
      ({ quotient: microsecondsBigInt, remainder: nanosecondsBigInt } = divmod(nanosecondsBigInt, THOUSAND));
      ({ quotient: millisecondsBigInt, remainder: microsecondsBigInt } = divmod(microsecondsBigInt, THOUSAND));
      break;
    case "microsecond":
      ({ quotient: microsecondsBigInt, remainder: nanosecondsBigInt } = divmod(nanosecondsBigInt, THOUSAND));
      break;
    case "nanosecond":
      break;
    default:
      throw new Error("assert not reached");
  }
  const hours = JSBI.toNumber(hoursBigInt) * sign;
  const minutes = JSBI.toNumber(minutesBigInt) * sign;
  const seconds = JSBI.toNumber(secondsBigInt) * sign;
  const milliseconds = JSBI.toNumber(millisecondsBigInt) * sign;
  const microseconds = JSBI.toNumber(microsecondsBigInt) * sign;
  const nanoseconds = JSBI.toNumber(nanosecondsBigInt) * sign;
  return { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function UnbalanceDurationRelative(yearsParam, monthsParam, weeksParam, daysParam, largestUnit, relativeToParam) {
  let years = yearsParam;
  let months = monthsParam;
  let weeks = weeksParam;
  let days = daysParam;
  const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  let calendar2;
  let relativeTo;
  if (relativeToParam) {
    relativeTo = ToTemporalDate(relativeToParam);
    calendar2 = GetSlot(relativeTo, CALENDAR);
  }
  const oneYear = new TemporalDuration(sign);
  const oneMonth = new TemporalDuration(0, sign);
  const oneWeek = new TemporalDuration(0, 0, sign);
  switch (largestUnit) {
    case "year":
      break;
    case "month":
      {
        if (!calendar2)
          throw new RangeError("a starting point is required for months balancing");
        const dateAdd = calendar2.dateAdd;
        const dateUntil = calendar2.dateUntil;
        let relativeToDateOnly = relativeTo;
        while (MathAbs(years) > 0) {
          const addOptions = ObjectCreate$2(null);
          const newRelativeTo = CalendarDateAdd(calendar2, relativeToDateOnly, oneYear, addOptions, dateAdd);
          const untilOptions = ObjectCreate$2(null);
          untilOptions.largestUnit = "month";
          const untilResult = CalendarDateUntil(calendar2, relativeToDateOnly, newRelativeTo, untilOptions, dateUntil);
          const oneYearMonths = GetSlot(untilResult, MONTHS);
          relativeToDateOnly = newRelativeTo;
          months += oneYearMonths;
          years -= sign;
        }
      }
      break;
    case "week":
      if (!calendar2)
        throw new RangeError("a starting point is required for weeks balancing");
      while (MathAbs(years) > 0) {
        let oneYearDays;
        ({ relativeTo, days: oneYearDays } = MoveRelativeDate(calendar2, relativeTo, oneYear));
        days += oneYearDays;
        years -= sign;
      }
      while (MathAbs(months) > 0) {
        let oneMonthDays;
        ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
        days += oneMonthDays;
        months -= sign;
      }
      break;
    default:
      while (MathAbs(years) > 0) {
        if (!calendar2)
          throw new RangeError("a starting point is required for balancing calendar units");
        let oneYearDays;
        ({ relativeTo, days: oneYearDays } = MoveRelativeDate(calendar2, relativeTo, oneYear));
        days += oneYearDays;
        years -= sign;
      }
      while (MathAbs(months) > 0) {
        if (!calendar2)
          throw new RangeError("a starting point is required for balancing calendar units");
        let oneMonthDays;
        ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
        days += oneMonthDays;
        months -= sign;
      }
      while (MathAbs(weeks) > 0) {
        if (!calendar2)
          throw new RangeError("a starting point is required for balancing calendar units");
        let oneWeekDays;
        ({ relativeTo, days: oneWeekDays } = MoveRelativeDate(calendar2, relativeTo, oneWeek));
        days += oneWeekDays;
        weeks -= sign;
      }
      break;
  }
  return { years, months, weeks, days };
}
function BalanceDurationRelative(yearsParam, monthsParam, weeksParam, daysParam, largestUnit, relativeToParam) {
  let years = yearsParam;
  let months = monthsParam;
  let weeks = weeksParam;
  let days = daysParam;
  const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  if (sign === 0)
    return { years, months, weeks, days };
  let calendar2;
  let relativeTo;
  if (relativeToParam) {
    relativeTo = ToTemporalDate(relativeToParam);
    calendar2 = GetSlot(relativeTo, CALENDAR);
  }
  const oneYear = new TemporalDuration(sign);
  const oneMonth = new TemporalDuration(0, sign);
  const oneWeek = new TemporalDuration(0, 0, sign);
  switch (largestUnit) {
    case "year": {
      if (!calendar2)
        throw new RangeError("a starting point is required for years balancing");
      let newRelativeTo, oneYearDays;
      ({ relativeTo: newRelativeTo, days: oneYearDays } = MoveRelativeDate(calendar2, relativeTo, oneYear));
      while (MathAbs(days) >= MathAbs(oneYearDays)) {
        days -= oneYearDays;
        years += sign;
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneYearDays } = MoveRelativeDate(calendar2, relativeTo, oneYear));
      }
      let oneMonthDays;
      ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
      while (MathAbs(days) >= MathAbs(oneMonthDays)) {
        days -= oneMonthDays;
        months += sign;
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
      }
      const dateAdd = calendar2.dateAdd;
      const addOptions = ObjectCreate$2(null);
      newRelativeTo = CalendarDateAdd(calendar2, relativeTo, oneYear, addOptions, dateAdd);
      const dateUntil = calendar2.dateUntil;
      const untilOptions = ObjectCreate$2(null);
      untilOptions.largestUnit = "month";
      let untilResult = CalendarDateUntil(calendar2, relativeTo, newRelativeTo, untilOptions, dateUntil);
      let oneYearMonths = GetSlot(untilResult, MONTHS);
      while (MathAbs(months) >= MathAbs(oneYearMonths)) {
        months -= oneYearMonths;
        years += sign;
        relativeTo = newRelativeTo;
        const addOptions2 = ObjectCreate$2(null);
        newRelativeTo = CalendarDateAdd(calendar2, relativeTo, oneYear, addOptions2, dateAdd);
        const untilOptions2 = ObjectCreate$2(null);
        untilOptions2.largestUnit = "month";
        untilResult = CalendarDateUntil(calendar2, relativeTo, newRelativeTo, untilOptions2, dateUntil);
        oneYearMonths = GetSlot(untilResult, MONTHS);
      }
      break;
    }
    case "month": {
      if (!calendar2)
        throw new RangeError("a starting point is required for months balancing");
      let newRelativeTo, oneMonthDays;
      ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
      while (MathAbs(days) >= MathAbs(oneMonthDays)) {
        days -= oneMonthDays;
        months += sign;
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
      }
      break;
    }
    case "week": {
      if (!calendar2)
        throw new RangeError("a starting point is required for weeks balancing");
      let newRelativeTo, oneWeekDays;
      ({ relativeTo: newRelativeTo, days: oneWeekDays } = MoveRelativeDate(calendar2, relativeTo, oneWeek));
      while (MathAbs(days) >= MathAbs(oneWeekDays)) {
        days -= oneWeekDays;
        weeks += sign;
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneWeekDays } = MoveRelativeDate(calendar2, relativeTo, oneWeek));
      }
      break;
    }
  }
  return { years, months, weeks, days };
}
function CalculateOffsetShift(relativeTo, y, mon, w, d, h, min, s, ms, \u00B5s, ns) {
  if (IsTemporalZonedDateTime(relativeTo)) {
    const instant2 = GetSlot(relativeTo, INSTANT);
    const timeZone2 = GetSlot(relativeTo, TIME_ZONE);
    const calendar2 = GetSlot(relativeTo, CALENDAR);
    const offsetBefore = GetOffsetNanosecondsFor(timeZone2, instant2);
    const after = AddZonedDateTime(instant2, timeZone2, calendar2, y, mon, w, d, h, min, s, ms, \u00B5s, ns);
    const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
    const instantAfter = new TemporalInstant(after);
    const offsetAfter = GetOffsetNanosecondsFor(timeZone2, instantAfter);
    return offsetAfter - offsetBefore;
  }
  return 0;
}
function CreateNegatedTemporalDuration(duration2) {
  const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
  return new TemporalDuration(-GetSlot(duration2, YEARS), -GetSlot(duration2, MONTHS), -GetSlot(duration2, WEEKS), -GetSlot(duration2, DAYS), -GetSlot(duration2, HOURS), -GetSlot(duration2, MINUTES), -GetSlot(duration2, SECONDS), -GetSlot(duration2, MILLISECONDS), -GetSlot(duration2, MICROSECONDS), -GetSlot(duration2, NANOSECONDS));
}
function ConstrainToRange(value, min, max) {
  return MathMin(max, MathMax(min, value));
}
function ConstrainISODate(year, monthParam, dayParam) {
  const month = ConstrainToRange(monthParam, 1, 12);
  const day = ConstrainToRange(dayParam, 1, ISODaysInMonth(year, month));
  return { year, month, day };
}
function ConstrainTime(hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam) {
  const hour = ConstrainToRange(hourParam, 0, 23);
  const minute = ConstrainToRange(minuteParam, 0, 59);
  const second = ConstrainToRange(secondParam, 0, 59);
  const millisecond = ConstrainToRange(millisecondParam, 0, 999);
  const microsecond = ConstrainToRange(microsecondParam, 0, 999);
  const nanosecond = ConstrainToRange(nanosecondParam, 0, 999);
  return { hour, minute, second, millisecond, microsecond, nanosecond };
}
function RejectToRange(value, min, max) {
  if (value < min || value > max)
    throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`);
}
function RejectISODate(year, month, day) {
  RejectToRange(month, 1, 12);
  RejectToRange(day, 1, ISODaysInMonth(year, month));
}
function RejectDateRange(year, month, day) {
  RejectDateTimeRange(year, month, day, 12, 0, 0, 0, 0, 0);
}
function RejectTime(hour, minute, second, millisecond, microsecond, nanosecond) {
  RejectToRange(hour, 0, 23);
  RejectToRange(minute, 0, 59);
  RejectToRange(second, 0, 59);
  RejectToRange(millisecond, 0, 999);
  RejectToRange(microsecond, 0, 999);
  RejectToRange(nanosecond, 0, 999);
}
function RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  RejectISODate(year, month, day);
  RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
}
function RejectDateTimeRange(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  RejectToRange(year, YEAR_MIN, YEAR_MAX);
  if (year === YEAR_MIN && GetEpochFromISOParts(year, month, day + 1, hour, minute, second, millisecond, microsecond, nanosecond - 1) == null || year === YEAR_MAX && GetEpochFromISOParts(year, month, day - 1, hour, minute, second, millisecond, microsecond, nanosecond + 1) == null) {
    throw new RangeError("DateTime outside of supported range");
  }
}
function ValidateEpochNanoseconds(epochNanoseconds) {
  if (JSBI.lessThan(epochNanoseconds, NS_MIN) || JSBI.greaterThan(epochNanoseconds, NS_MAX)) {
    throw new RangeError("Instant outside of supported range");
  }
}
function RejectYearMonthRange(year, month) {
  RejectToRange(year, YEAR_MIN, YEAR_MAX);
  if (year === YEAR_MIN) {
    RejectToRange(month, 4, 12);
  } else if (year === YEAR_MAX) {
    RejectToRange(month, 1, 9);
  }
}
function RejectDuration(y, mon, w, d, h, min, s, ms, \u00B5s, ns) {
  const sign = DurationSign(y, mon, w, d, h, min, s, ms, \u00B5s, ns);
  for (const prop of [y, mon, w, d, h, min, s, ms, \u00B5s, ns]) {
    if (!NumberIsFinite(prop))
      throw new RangeError("infinite values not allowed as duration fields");
    const propSign = MathSign(prop);
    if (propSign !== 0 && propSign !== sign)
      throw new RangeError("mixed-sign values not allowed as duration fields");
  }
}
function DifferenceISODate(y1, m1, d1, y2, m2, d2, largestUnit) {
  switch (largestUnit) {
    case "year":
    case "month": {
      const sign = -CompareISODate(y1, m1, d1, y2, m2, d2);
      if (sign === 0)
        return { years: 0, months: 0, weeks: 0, days: 0 };
      const start = { year: y1, month: m1, day: d1 };
      const end = { year: y2, month: m2, day: d2 };
      let years = end.year - start.year;
      let mid = AddISODate(y1, m1, d1, years, 0, 0, 0, "constrain");
      let midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
      if (midSign === 0) {
        return largestUnit === "year" ? { years, months: 0, weeks: 0, days: 0 } : { years: 0, months: years * 12, weeks: 0, days: 0 };
      }
      let months = end.month - start.month;
      if (midSign !== sign) {
        years -= sign;
        months += sign * 12;
      }
      mid = AddISODate(y1, m1, d1, years, months, 0, 0, "constrain");
      midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
      if (midSign === 0) {
        return largestUnit === "year" ? { years, months, weeks: 0, days: 0 } : { years: 0, months: months + years * 12, weeks: 0, days: 0 };
      }
      if (midSign !== sign) {
        months -= sign;
        if (months === -sign) {
          years -= sign;
          months = 11 * sign;
        }
        mid = AddISODate(y1, m1, d1, years, months, 0, 0, "constrain");
        midSign = -CompareISODate(y1, m1, d1, mid.year, mid.month, mid.day);
      }
      let days = 0;
      if (mid.month === end.month) {
        days = end.day - mid.day;
      } else if (sign < 0) {
        days = -mid.day - (ISODaysInMonth(end.year, end.month) - end.day);
      } else {
        days = end.day + (ISODaysInMonth(mid.year, mid.month) - mid.day);
      }
      if (largestUnit === "month") {
        months += years * 12;
        years = 0;
      }
      return { years, months, weeks: 0, days };
    }
    case "week":
    case "day": {
      let larger, smaller, sign;
      if (CompareISODate(y1, m1, d1, y2, m2, d2) < 0) {
        smaller = { year: y1, month: m1, day: d1 };
        larger = { year: y2, month: m2, day: d2 };
        sign = 1;
      } else {
        smaller = { year: y2, month: m2, day: d2 };
        larger = { year: y1, month: m1, day: d1 };
        sign = -1;
      }
      let days = DayOfYear(larger.year, larger.month, larger.day) - DayOfYear(smaller.year, smaller.month, smaller.day);
      for (let year = smaller.year; year < larger.year; ++year) {
        days += LeapYear(year) ? 366 : 365;
      }
      let weeks = 0;
      if (largestUnit === "week") {
        weeks = MathFloor(days / 7);
        days %= 7;
      }
      weeks *= sign;
      days *= sign;
      return { years: 0, months: 0, weeks, days };
    }
    default:
      throw new Error("assert not reached");
  }
}
function DifferenceTime(h1, min1, s1, ms1, \u00B5s1, ns1, h2, min2, s2, ms2, \u00B5s2, ns2) {
  let hours = h2 - h1;
  let minutes = min2 - min1;
  let seconds = s2 - s1;
  let milliseconds = ms2 - ms1;
  let microseconds = \u00B5s2 - \u00B5s1;
  let nanoseconds = ns2 - ns1;
  const sign = DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  hours *= sign;
  minutes *= sign;
  seconds *= sign;
  milliseconds *= sign;
  microseconds *= sign;
  nanoseconds *= sign;
  let deltaDays = 0;
  ({
    deltaDays,
    hour: hours,
    minute: minutes,
    second: seconds,
    millisecond: milliseconds,
    microsecond: microseconds,
    nanosecond: nanoseconds
  } = BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
  deltaDays *= sign;
  hours *= sign;
  minutes *= sign;
  seconds *= sign;
  milliseconds *= sign;
  microseconds *= sign;
  nanoseconds *= sign;
  return { deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function DifferenceInstant(ns1, ns2, increment, unit, roundingMode) {
  const diff = JSBI.subtract(ns2, ns1);
  const remainder = JSBI.remainder(diff, JSBI.BigInt(864e11));
  const wholeDays = JSBI.subtract(diff, remainder);
  const roundedRemainder = RoundNumberToIncrement(remainder, nsPerTimeUnit[unit] * increment, roundingMode);
  const roundedDiff = JSBI.add(wholeDays, roundedRemainder);
  const nanoseconds = JSBI.toNumber(JSBI.remainder(roundedDiff, THOUSAND));
  const microseconds = JSBI.toNumber(JSBI.remainder(JSBI.divide(roundedDiff, THOUSAND), THOUSAND));
  const milliseconds = JSBI.toNumber(JSBI.remainder(JSBI.divide(roundedDiff, MILLION), THOUSAND));
  const seconds = JSBI.toNumber(JSBI.divide(roundedDiff, BILLION));
  return { seconds, milliseconds, microseconds, nanoseconds };
}
function DifferenceISODateTime(y1Param, mon1Param, d1Param, h1, min1, s1, ms1, \u00B5s1, ns1, y2, mon2, d2, h2, min2, s2, ms2, \u00B5s2, ns2, calendar2, largestUnit, options = ObjectCreate$2(null)) {
  let y1 = y1Param;
  let mon1 = mon1Param;
  let d1 = d1Param;
  let { deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceTime(h1, min1, s1, ms1, \u00B5s1, ns1, h2, min2, s2, ms2, \u00B5s2, ns2);
  const timeSign = DurationSign(0, 0, 0, deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  ({ year: y1, month: mon1, day: d1 } = BalanceISODate(y1, mon1, d1 + deltaDays));
  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1);
  if (dateSign === -timeSign) {
    ({ year: y1, month: mon1, day: d1 } = BalanceISODate(y1, mon1, d1 - timeSign));
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(-timeSign, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
  }
  const date1 = CreateTemporalDate(y1, mon1, d1, calendar2);
  const date2 = CreateTemporalDate(y2, mon2, d2, calendar2);
  const dateLargestUnit = LargerOfTwoTemporalUnits("day", largestUnit);
  const untilOptions = __spreadProps(__spreadValues({}, options), { largestUnit: dateLargestUnit });
  let { years, months, weeks, days } = CalendarDateUntil(calendar2, date1, date2, untilOptions);
  ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function DifferenceZonedDateTime(ns1, ns2, timeZone2, calendar2, largestUnit, options) {
  const nsDiff = JSBI.subtract(ns2, ns1);
  if (JSBI.equal(nsDiff, ZERO)) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      microseconds: 0,
      nanoseconds: 0
    };
  }
  const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
  const start = new TemporalInstant(ns1);
  const end = new TemporalInstant(ns2);
  const dtStart = BuiltinTimeZoneGetPlainDateTimeFor(timeZone2, start, calendar2);
  const dtEnd = BuiltinTimeZoneGetPlainDateTimeFor(timeZone2, end, calendar2);
  let { years, months, weeks, days } = DifferenceISODateTime(GetSlot(dtStart, ISO_YEAR), GetSlot(dtStart, ISO_MONTH), GetSlot(dtStart, ISO_DAY), GetSlot(dtStart, ISO_HOUR), GetSlot(dtStart, ISO_MINUTE), GetSlot(dtStart, ISO_SECOND), GetSlot(dtStart, ISO_MILLISECOND), GetSlot(dtStart, ISO_MICROSECOND), GetSlot(dtStart, ISO_NANOSECOND), GetSlot(dtEnd, ISO_YEAR), GetSlot(dtEnd, ISO_MONTH), GetSlot(dtEnd, ISO_DAY), GetSlot(dtEnd, ISO_HOUR), GetSlot(dtEnd, ISO_MINUTE), GetSlot(dtEnd, ISO_SECOND), GetSlot(dtEnd, ISO_MILLISECOND), GetSlot(dtEnd, ISO_MICROSECOND), GetSlot(dtEnd, ISO_NANOSECOND), calendar2, largestUnit, options);
  const intermediateNs = AddZonedDateTime(start, timeZone2, calendar2, years, months, weeks, 0, 0, 0, 0, 0, 0, 0);
  let timeRemainderNs = JSBI.subtract(ns2, intermediateNs);
  const intermediate = CreateTemporalZonedDateTime(intermediateNs, timeZone2, calendar2);
  ({ nanoseconds: timeRemainderNs, days } = NanosecondsToDays(timeRemainderNs, intermediate));
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, 0, 0, 0, 0, 0, JSBI.toNumber(timeRemainderNs), "hour");
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function AddISODate(yearParam, monthParam, dayParam, yearsParam, monthsParam, weeksParam, daysParam, overflow) {
  let year = yearParam;
  let month = monthParam;
  let day = dayParam;
  let years = yearsParam;
  let months = monthsParam;
  let weeks = weeksParam;
  let days = daysParam;
  year += years;
  month += months;
  ({ year, month } = BalanceISOYearMonth(year, month));
  ({ year, month, day } = RegulateISODate(year, month, day, overflow));
  days += 7 * weeks;
  day += days;
  ({ year, month, day } = BalanceISODate(year, month, day));
  return { year, month, day };
}
function AddTime(hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
  let hour = hourParam;
  let minute = minuteParam;
  let second = secondParam;
  let millisecond = millisecondParam;
  let microsecond = microsecondParam;
  let nanosecond = nanosecondParam;
  hour += hours;
  minute += minutes;
  second += seconds;
  millisecond += milliseconds;
  microsecond += microseconds;
  nanosecond += nanoseconds;
  let deltaDays = 0;
  ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond));
  return { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond };
}
function AddDuration(y1, mon1, w1, d1, h1, min1, s1, ms1, \u00B5s1, ns1, y2, mon2, w2, d2, h2, min2, s2, ms2, \u00B5s2, ns2, relativeTo) {
  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, \u00B5s1, ns1);
  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, \u00B5s2, ns2);
  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);
  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
  if (!relativeTo) {
    if (largestUnit === "year" || largestUnit === "month" || largestUnit === "week") {
      throw new RangeError("relativeTo is required for years, months, or weeks arithmetic");
    }
    years = months = weeks = 0;
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(d1 + d2, h1 + h2, min1 + min2, s1 + s2, ms1 + ms2, \u00B5s1 + \u00B5s2, ns1 + ns2, largestUnit));
  } else if (IsTemporalDate(relativeTo)) {
    const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
    const calendar2 = GetSlot(relativeTo, CALENDAR);
    const dateDuration1 = new TemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0);
    const dateDuration2 = new TemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0);
    const dateAdd = calendar2.dateAdd;
    const firstAddOptions = ObjectCreate$2(null);
    const intermediate = CalendarDateAdd(calendar2, relativeTo, dateDuration1, firstAddOptions, dateAdd);
    const secondAddOptions = ObjectCreate$2(null);
    const end = CalendarDateAdd(calendar2, intermediate, dateDuration2, secondAddOptions, dateAdd);
    const dateLargestUnit = LargerOfTwoTemporalUnits("day", largestUnit);
    const differenceOptions = ObjectCreate$2(null);
    differenceOptions.largestUnit = dateLargestUnit;
    ({ years, months, weeks, days } = CalendarDateUntil(calendar2, relativeTo, end, differenceOptions));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(days, h1 + h2, min1 + min2, s1 + s2, ms1 + ms2, \u00B5s1 + \u00B5s2, ns1 + ns2, largestUnit));
  } else {
    const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
    const timeZone2 = GetSlot(relativeTo, TIME_ZONE);
    const calendar2 = GetSlot(relativeTo, CALENDAR);
    const intermediateNs = AddZonedDateTime(GetSlot(relativeTo, INSTANT), timeZone2, calendar2, y1, mon1, w1, d1, h1, min1, s1, ms1, \u00B5s1, ns1);
    const endNs = AddZonedDateTime(new TemporalInstant(intermediateNs), timeZone2, calendar2, y2, mon2, w2, d2, h2, min2, s2, ms2, \u00B5s2, ns2);
    if (largestUnit !== "year" && largestUnit !== "month" && largestUnit !== "week" && largestUnit !== "day") {
      years = 0;
      months = 0;
      weeks = 0;
      days = 0;
      ({ seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(GetSlot(relativeTo, EPOCHNANOSECONDS), endNs, 1, "nanosecond", "halfExpand"));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, 0, 0, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    } else {
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceZonedDateTime(GetSlot(relativeTo, EPOCHNANOSECONDS), endNs, timeZone2, calendar2, largestUnit));
    }
  }
  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function AddInstant(epochNanoseconds, h, min, s, ms, \u00B5s, ns) {
  let sum = ZERO;
  sum = JSBI.add(sum, JSBI.BigInt(ns));
  sum = JSBI.add(sum, JSBI.multiply(JSBI.BigInt(\u00B5s), THOUSAND));
  sum = JSBI.add(sum, JSBI.multiply(JSBI.BigInt(ms), MILLION));
  sum = JSBI.add(sum, JSBI.multiply(JSBI.BigInt(s), BILLION));
  sum = JSBI.add(sum, JSBI.multiply(JSBI.BigInt(min), JSBI.BigInt(60 * 1e9)));
  sum = JSBI.add(sum, JSBI.multiply(JSBI.BigInt(h), JSBI.BigInt(60 * 60 * 1e9)));
  const result = JSBI.add(epochNanoseconds, sum);
  ValidateEpochNanoseconds(result);
  return result;
}
function AddDateTime(year, month, day, hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam, calendar2, years, months, weeks, daysParam, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, options) {
  let days = daysParam;
  let { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  days += deltaDays;
  const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
  const datePart = CreateTemporalDate(year, month, day, calendar2);
  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const addedDate = CalendarDateAdd(calendar2, datePart, dateDuration, options);
  return {
    year: GetSlot(addedDate, ISO_YEAR),
    month: GetSlot(addedDate, ISO_MONTH),
    day: GetSlot(addedDate, ISO_DAY),
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  };
}
function AddZonedDateTime(instant2, timeZone2, calendar2, years, months, weeks, days, h, min, s, ms, \u00B5s, ns, options) {
  const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
  if (DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0) === 0) {
    return AddInstant(GetSlot(instant2, EPOCHNANOSECONDS), h, min, s, ms, \u00B5s, ns);
  }
  const dt = BuiltinTimeZoneGetPlainDateTimeFor(timeZone2, instant2, calendar2);
  const datePart = CreateTemporalDate(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), calendar2);
  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const addedDate = CalendarDateAdd(calendar2, datePart, dateDuration, options);
  const dtIntermediate = CreateTemporalDateTime(GetSlot(addedDate, ISO_YEAR), GetSlot(addedDate, ISO_MONTH), GetSlot(addedDate, ISO_DAY), GetSlot(dt, ISO_HOUR), GetSlot(dt, ISO_MINUTE), GetSlot(dt, ISO_SECOND), GetSlot(dt, ISO_MILLISECOND), GetSlot(dt, ISO_MICROSECOND), GetSlot(dt, ISO_NANOSECOND), calendar2);
  const instantIntermediate = BuiltinTimeZoneGetInstantFor(timeZone2, dtIntermediate, "compatible");
  return AddInstant(GetSlot(instantIntermediate, EPOCHNANOSECONDS), h, min, s, ms, \u00B5s, ns);
}
function RoundNumberToIncrement(quantity, increment, mode) {
  if (increment === 1)
    return quantity;
  let { quotient, remainder } = divmod(quantity, JSBI.BigInt(increment));
  if (JSBI.equal(remainder, ZERO))
    return quantity;
  const sign = JSBI.lessThan(remainder, ZERO) ? -1 : 1;
  switch (mode) {
    case "ceil":
      if (sign > 0)
        quotient = JSBI.add(quotient, JSBI.BigInt(sign));
      break;
    case "floor":
      if (sign < 0)
        quotient = JSBI.add(quotient, JSBI.BigInt(sign));
      break;
    case "trunc":
      break;
    case "halfExpand":
      if (JSBI.toNumber(abs(JSBI.multiply(remainder, JSBI.BigInt(2)))) >= increment) {
        quotient = JSBI.add(quotient, JSBI.BigInt(sign));
      }
      break;
  }
  return JSBI.multiply(quotient, JSBI.BigInt(increment));
}
function RoundInstant(epochNs, increment, unit, roundingMode) {
  let remainder = JSBI.remainder(epochNs, JSBI.BigInt(864e11));
  if (JSBI.lessThan(remainder, ZERO))
    remainder = JSBI.add(remainder, JSBI.BigInt(864e11));
  const wholeDays = JSBI.subtract(epochNs, remainder);
  const roundedRemainder = RoundNumberToIncrement(remainder, nsPerTimeUnit[unit] * increment, roundingMode);
  return JSBI.add(wholeDays, roundedRemainder);
}
function RoundISODateTime(yearParam, monthParam, dayParam, hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam, increment, unit, roundingMode, dayLengthNs = 864e11) {
  const { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = RoundTime(hourParam, minuteParam, secondParam, millisecondParam, microsecondParam, nanosecondParam, increment, unit, roundingMode, dayLengthNs);
  const { year, month, day } = BalanceISODate(yearParam, monthParam, dayParam + deltaDays);
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}
function RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode, dayLengthNs = 864e11) {
  let quantity = ZERO;
  switch (unit) {
    case "day":
    case "hour":
      quantity = JSBI.BigInt(hour);
    case "minute":
      quantity = JSBI.add(JSBI.multiply(quantity, SIXTY), JSBI.BigInt(minute));
    case "second":
      quantity = JSBI.add(JSBI.multiply(quantity, SIXTY), JSBI.BigInt(second));
    case "millisecond":
      quantity = JSBI.add(JSBI.multiply(quantity, THOUSAND), JSBI.BigInt(millisecond));
    case "microsecond":
      quantity = JSBI.add(JSBI.multiply(quantity, THOUSAND), JSBI.BigInt(microsecond));
    case "nanosecond":
      quantity = JSBI.add(JSBI.multiply(quantity, THOUSAND), JSBI.BigInt(nanosecond));
  }
  const nsPerUnit = unit === "day" ? dayLengthNs : nsPerTimeUnit[unit];
  const rounded = RoundNumberToIncrement(quantity, nsPerUnit * increment, roundingMode);
  const result = JSBI.toNumber(JSBI.divide(rounded, JSBI.BigInt(nsPerUnit)));
  switch (unit) {
    case "day":
      return { deltaDays: result, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    case "hour":
      return BalanceTime(result, 0, 0, 0, 0, 0);
    case "minute":
      return BalanceTime(hour, result, 0, 0, 0, 0);
    case "second":
      return BalanceTime(hour, minute, result, 0, 0, 0);
    case "millisecond":
      return BalanceTime(hour, minute, second, result, 0, 0);
    case "microsecond":
      return BalanceTime(hour, minute, second, millisecond, result, 0);
    case "nanosecond":
      return BalanceTime(hour, minute, second, millisecond, microsecond, result);
    default:
      throw new Error(`Invalid unit ${unit}`);
  }
}
function DaysUntil(earlier, later) {
  return DifferenceISODate(GetSlot(earlier, ISO_YEAR), GetSlot(earlier, ISO_MONTH), GetSlot(earlier, ISO_DAY), GetSlot(later, ISO_YEAR), GetSlot(later, ISO_MONTH), GetSlot(later, ISO_DAY), "day").days;
}
function MoveRelativeDate(calendar2, relativeToParam, duration2) {
  const options = ObjectCreate$2(null);
  const later = CalendarDateAdd(calendar2, relativeToParam, duration2, options);
  const days = DaysUntil(relativeToParam, later);
  return { relativeTo: later, days };
}
function MoveRelativeZonedDateTime(relativeTo, years, months, weeks, days) {
  const timeZone2 = GetSlot(relativeTo, TIME_ZONE);
  const calendar2 = GetSlot(relativeTo, CALENDAR);
  const intermediateNs = AddZonedDateTime(GetSlot(relativeTo, INSTANT), timeZone2, calendar2, years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  return CreateTemporalZonedDateTime(intermediateNs, timeZone2, calendar2);
}
function AdjustRoundedDurationDays(yearsParam, monthsParam, weeksParam, daysParam, hoursParam, minutesParam, secondsParam, millisecondsParam, microsecondsParam, nanosecondsParam, increment, unit, roundingMode, relativeTo) {
  let years = yearsParam;
  let months = monthsParam;
  let weeks = weeksParam;
  let days = daysParam;
  let hours = hoursParam;
  let minutes = minutesParam;
  let seconds = secondsParam;
  let milliseconds = millisecondsParam;
  let microseconds = microsecondsParam;
  let nanoseconds = nanosecondsParam;
  if (!IsTemporalZonedDateTime(relativeTo) || unit === "year" || unit === "month" || unit === "week" || unit === "day" || unit === "nanosecond" && increment === 1) {
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  }
  let timeRemainderNs = TotalDurationNanoseconds(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 0);
  const direction = MathSign(JSBI.toNumber(timeRemainderNs));
  const timeZone2 = GetSlot(relativeTo, TIME_ZONE);
  const calendar2 = GetSlot(relativeTo, CALENDAR);
  const dayStart = AddZonedDateTime(GetSlot(relativeTo, INSTANT), timeZone2, calendar2, years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
  const dayEnd = AddZonedDateTime(new TemporalInstant(dayStart), timeZone2, calendar2, 0, 0, 0, direction, 0, 0, 0, 0, 0, 0);
  const dayLengthNs = JSBI.subtract(dayEnd, dayStart);
  if (JSBI.greaterThanOrEqual(JSBI.multiply(JSBI.subtract(timeRemainderNs, dayLengthNs), JSBI.BigInt(direction)), ZERO)) {
    ({ years, months, weeks, days } = AddDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, 0, 0, 0, direction, 0, 0, 0, 0, 0, 0, relativeTo));
    timeRemainderNs = RoundInstant(JSBI.subtract(timeRemainderNs, dayLengthNs), increment, unit, roundingMode);
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, 0, 0, 0, 0, 0, JSBI.toNumber(timeRemainderNs), "hour"));
  }
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}
function RoundDuration(yearsParam, monthsParam, weeksParam, daysParam, hoursParam, minutesParam, secondsParam, millisecondsParam, microsecondsParam, nanosecondsParam, increment, unit, roundingMode, relativeToParam = void 0) {
  let years = yearsParam;
  let months = monthsParam;
  let weeks = weeksParam;
  let days = daysParam;
  let hours = hoursParam;
  let minutes = minutesParam;
  let seconds = secondsParam;
  let milliseconds = millisecondsParam;
  let microseconds = microsecondsParam;
  let nanoseconds = JSBI.BigInt(nanosecondsParam);
  const TemporalDuration = GetIntrinsic("%Temporal.Duration%");
  let calendar2, zdtRelative;
  let relativeTo = relativeToParam;
  if (relativeTo) {
    if (IsTemporalZonedDateTime(relativeTo)) {
      zdtRelative = relativeTo;
      relativeTo = ToTemporalDate(relativeTo);
    } else if (!IsTemporalDate(relativeTo)) {
      throw new TypeError("starting point must be PlainDate or ZonedDateTime");
    }
    calendar2 = GetSlot(relativeTo, CALENDAR);
  }
  let dayLengthNs;
  if (unit === "year" || unit === "month" || unit === "week" || unit === "day") {
    nanoseconds = TotalDurationNanoseconds(0, hours, minutes, seconds, milliseconds, microseconds, nanosecondsParam, 0);
    let intermediate;
    if (zdtRelative) {
      intermediate = MoveRelativeZonedDateTime(zdtRelative, years, months, weeks, days);
    }
    let deltaDays;
    let dayLength;
    ({ days: deltaDays, nanoseconds, dayLengthNs: dayLength } = NanosecondsToDays(nanoseconds, intermediate));
    dayLengthNs = JSBI.BigInt(dayLength);
    days += deltaDays;
    hours = minutes = seconds = milliseconds = microseconds = 0;
  }
  let total;
  switch (unit) {
    case "year": {
      if (!calendar2)
        throw new RangeError("A starting point is required for years rounding");
      const yearsDuration = new TemporalDuration(years);
      const dateAdd = calendar2.dateAdd;
      const firstAddOptions = ObjectCreate$2(null);
      const yearsLater = CalendarDateAdd(calendar2, relativeTo, yearsDuration, firstAddOptions, dateAdd);
      const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
      const secondAddOptions = ObjectCreate$2(null);
      const yearsMonthsWeeksLater = CalendarDateAdd(calendar2, relativeTo, yearsMonthsWeeks, secondAddOptions, dateAdd);
      const monthsWeeksInDays = DaysUntil(yearsLater, yearsMonthsWeeksLater);
      relativeTo = yearsLater;
      days += monthsWeeksInDays;
      const thirdAddOptions = ObjectCreate$2(null);
      const daysLater = CalendarDateAdd(calendar2, relativeTo, { days }, thirdAddOptions, dateAdd);
      const untilOptions = ObjectCreate$2(null);
      untilOptions.largestUnit = "year";
      const yearsPassed = CalendarDateUntil(calendar2, relativeTo, daysLater, untilOptions).years;
      years += yearsPassed;
      const oldRelativeTo = relativeTo;
      const fourthAddOptions = ObjectCreate$2(null);
      relativeTo = CalendarDateAdd(calendar2, relativeTo, { years: yearsPassed }, fourthAddOptions, dateAdd);
      const daysPassed = DaysUntil(oldRelativeTo, relativeTo);
      days -= daysPassed;
      const oneYear = new TemporalDuration(days < 0 ? -1 : 1);
      let { days: oneYearDays } = MoveRelativeDate(calendar2, relativeTo, oneYear);
      oneYearDays = MathAbs(oneYearDays);
      const divisor = JSBI.multiply(JSBI.BigInt(oneYearDays), dayLengthNs);
      nanoseconds = JSBI.add(JSBI.add(JSBI.multiply(divisor, JSBI.BigInt(years)), JSBI.multiply(JSBI.BigInt(days), dayLengthNs)), nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, JSBI.toNumber(JSBI.multiply(divisor, JSBI.BigInt(increment))), roundingMode);
      total = JSBI.toNumber(nanoseconds) / JSBI.toNumber(divisor);
      years = JSBI.toNumber(JSBI.divide(rounded, divisor));
      nanoseconds = ZERO;
      months = weeks = days = 0;
      break;
    }
    case "month": {
      if (!calendar2)
        throw new RangeError("A starting point is required for months rounding");
      const yearsMonths = new TemporalDuration(years, months);
      const dateAdd = calendar2.dateAdd;
      const firstAddOptions = ObjectCreate$2(null);
      const yearsMonthsLater = CalendarDateAdd(calendar2, relativeTo, yearsMonths, firstAddOptions, dateAdd);
      const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
      const secondAddOptions = ObjectCreate$2(null);
      const yearsMonthsWeeksLater = CalendarDateAdd(calendar2, relativeTo, yearsMonthsWeeks, secondAddOptions, dateAdd);
      const weeksInDays = DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater);
      relativeTo = yearsMonthsLater;
      days += weeksInDays;
      const sign = MathSign(days);
      const oneMonth = new TemporalDuration(0, days < 0 ? -1 : 1);
      let oneMonthDays;
      ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
      while (MathAbs(days) >= MathAbs(oneMonthDays)) {
        months += sign;
        days -= oneMonthDays;
        ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar2, relativeTo, oneMonth));
      }
      oneMonthDays = MathAbs(oneMonthDays);
      const divisor = JSBI.multiply(JSBI.BigInt(oneMonthDays), dayLengthNs);
      nanoseconds = JSBI.add(JSBI.add(JSBI.multiply(divisor, JSBI.BigInt(months)), JSBI.multiply(JSBI.BigInt(days), dayLengthNs)), nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, JSBI.toNumber(JSBI.multiply(divisor, JSBI.BigInt(increment))), roundingMode);
      total = JSBI.toNumber(nanoseconds) / JSBI.toNumber(divisor);
      months = JSBI.toNumber(JSBI.divide(rounded, divisor));
      nanoseconds = ZERO;
      weeks = days = 0;
      break;
    }
    case "week": {
      if (!calendar2)
        throw new RangeError("A starting point is required for weeks rounding");
      const sign = MathSign(days);
      const oneWeek = new TemporalDuration(0, 0, days < 0 ? -1 : 1);
      let oneWeekDays;
      ({ relativeTo, days: oneWeekDays } = MoveRelativeDate(calendar2, relativeTo, oneWeek));
      while (MathAbs(days) >= MathAbs(oneWeekDays)) {
        weeks += sign;
        days -= oneWeekDays;
        ({ relativeTo, days: oneWeekDays } = MoveRelativeDate(calendar2, relativeTo, oneWeek));
      }
      oneWeekDays = MathAbs(oneWeekDays);
      const divisor = JSBI.multiply(JSBI.BigInt(oneWeekDays), dayLengthNs);
      nanoseconds = JSBI.add(JSBI.add(JSBI.multiply(divisor, JSBI.BigInt(weeks)), JSBI.multiply(JSBI.BigInt(days), dayLengthNs)), nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, JSBI.toNumber(JSBI.multiply(divisor, JSBI.BigInt(increment))), roundingMode);
      total = JSBI.toNumber(nanoseconds) / JSBI.toNumber(divisor);
      weeks = JSBI.toNumber(JSBI.divide(rounded, divisor));
      nanoseconds = ZERO;
      days = 0;
      break;
    }
    case "day": {
      const divisor = dayLengthNs;
      nanoseconds = JSBI.add(JSBI.multiply(divisor, JSBI.BigInt(days)), nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, JSBI.toNumber(JSBI.multiply(divisor, JSBI.BigInt(increment))), roundingMode);
      total = JSBI.toNumber(nanoseconds) / JSBI.toNumber(divisor);
      days = JSBI.toNumber(JSBI.divide(rounded, divisor));
      nanoseconds = ZERO;
      break;
    }
    case "hour": {
      const divisor = 36e11;
      let allNanoseconds = JSBI.multiply(JSBI.BigInt(hours), JSBI.BigInt(36e11));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(minutes), JSBI.BigInt(6e10)));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(seconds), BILLION));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(milliseconds), MILLION));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(microseconds), THOUSAND));
      allNanoseconds = JSBI.add(allNanoseconds, nanoseconds);
      total = JSBI.toNumber(allNanoseconds) / divisor;
      const rounded = RoundNumberToIncrement(allNanoseconds, divisor * increment, roundingMode);
      hours = JSBI.toNumber(JSBI.divide(rounded, JSBI.BigInt(divisor)));
      nanoseconds = ZERO;
      minutes = seconds = milliseconds = microseconds = 0;
      break;
    }
    case "minute": {
      const divisor = 6e10;
      let allNanoseconds = JSBI.multiply(JSBI.BigInt(minutes), JSBI.BigInt(6e10));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(seconds), BILLION));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(milliseconds), MILLION));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(microseconds), THOUSAND));
      allNanoseconds = JSBI.add(allNanoseconds, nanoseconds);
      total = JSBI.toNumber(allNanoseconds) / divisor;
      const rounded = RoundNumberToIncrement(allNanoseconds, divisor * increment, roundingMode);
      minutes = JSBI.toNumber(JSBI.divide(rounded, JSBI.BigInt(divisor)));
      nanoseconds = ZERO;
      seconds = milliseconds = microseconds = 0;
      break;
    }
    case "second": {
      const divisor = 1e9;
      let allNanoseconds = JSBI.multiply(JSBI.BigInt(seconds), BILLION);
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(milliseconds), MILLION));
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(microseconds), THOUSAND));
      allNanoseconds = JSBI.add(allNanoseconds, nanoseconds);
      total = JSBI.toNumber(allNanoseconds) / divisor;
      const rounded = RoundNumberToIncrement(allNanoseconds, divisor * increment, roundingMode);
      seconds = JSBI.toNumber(JSBI.divide(rounded, JSBI.BigInt(divisor)));
      nanoseconds = ZERO;
      milliseconds = microseconds = 0;
      break;
    }
    case "millisecond": {
      const divisor = 1e6;
      let allNanoseconds = JSBI.multiply(JSBI.BigInt(milliseconds), MILLION);
      allNanoseconds = JSBI.add(allNanoseconds, JSBI.multiply(JSBI.BigInt(microseconds), THOUSAND));
      allNanoseconds = JSBI.add(allNanoseconds, nanoseconds);
      total = JSBI.toNumber(allNanoseconds) / divisor;
      const rounded = RoundNumberToIncrement(allNanoseconds, divisor * increment, roundingMode);
      milliseconds = JSBI.toNumber(JSBI.divide(rounded, JSBI.BigInt(divisor)));
      nanoseconds = ZERO;
      microseconds = 0;
      break;
    }
    case "microsecond": {
      const divisor = 1e3;
      let allNanoseconds = JSBI.multiply(JSBI.BigInt(microseconds), THOUSAND);
      allNanoseconds = JSBI.add(allNanoseconds, nanoseconds);
      total = JSBI.toNumber(allNanoseconds) / divisor;
      const rounded = RoundNumberToIncrement(allNanoseconds, divisor * increment, roundingMode);
      microseconds = JSBI.toNumber(JSBI.divide(rounded, JSBI.BigInt(divisor)));
      nanoseconds = ZERO;
      break;
    }
    case "nanosecond": {
      total = JSBI.toNumber(nanoseconds);
      nanoseconds = RoundNumberToIncrement(nanoseconds, increment, roundingMode);
      break;
    }
  }
  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds: JSBI.toNumber(nanoseconds),
    total
  };
}
function CompareISODate(y1, m1, d1, y2, m2, d2) {
  for (const [x, y] of [
    [y1, y2],
    [m1, m2],
    [d1, d2]
  ]) {
    if (x !== y)
      return ComparisonResult(x - y);
  }
  return 0;
}
function NonNegativeModulo(x, y) {
  let result = x % y;
  if (ObjectIs(result, -0))
    return 0;
  if (result < 0)
    result += y;
  return result;
}
function ToBigIntExternal(arg) {
  const jsbiBI = ToBigInt(arg);
  if (typeof globalThis.BigInt !== "undefined")
    return globalThis.BigInt(jsbiBI.toString(10));
  return jsbiBI;
}
function ToBigInt(arg) {
  if (arg instanceof JSBI) {
    return arg;
  }
  let prim = arg;
  if (typeof arg === "object") {
    const toPrimFn = arg[Symbol.toPrimitive];
    if (toPrimFn && typeof toPrimFn === "function") {
      prim = ReflectApply$1(toPrimFn, arg, ["number"]);
    }
  }
  switch (typeof prim) {
    case "undefined":
    case "object":
    case "number":
    case "symbol":
    default:
      throw new TypeError(`cannot convert ${typeof arg} to bigint`);
    case "string":
      if (!prim.match(/^\s*(?:[+-]?\d+\s*)?$/)) {
        throw new SyntaxError("invalid BigInt syntax");
      }
    case "bigint":
      try {
        return JSBI.BigInt(prim.toString());
      } catch (e) {
        if (e instanceof Error && e.message.startsWith("Invalid integer"))
          throw new SyntaxError(e.message);
        throw e;
      }
    case "boolean":
      if (prim) {
        return ONE;
      } else {
        return ZERO;
      }
  }
}
const SystemUTCEpochNanoSeconds = (() => {
  let ns = JSBI.BigInt(Date.now() % 1e6);
  return () => {
    const ms = JSBI.BigInt(Date.now());
    const result = JSBI.add(JSBI.multiply(ms, MILLION), ns);
    ns = JSBI.divide(ms, MILLION);
    if (JSBI.greaterThan(result, NS_MAX))
      return NS_MAX;
    if (JSBI.lessThan(result, NS_MIN))
      return NS_MIN;
    return result;
  };
})();
function SystemTimeZone() {
  const fmt = new IntlDateTimeFormat$1("en-us");
  const TemporalTimeZone = GetIntrinsic("%Temporal.TimeZone%");
  return new TemporalTimeZone(ParseTemporalTimeZone(fmt.resolvedOptions().timeZone));
}
function ComparisonResult(value) {
  return value < 0 ? -1 : value > 0 ? 1 : value;
}
function GetOptionsObject(options) {
  if (options === void 0)
    return ObjectCreate$2(null);
  if (IsObject(options) && options !== null)
    return options;
  throw new TypeError(`Options parameter must be an object, not ${options === null ? "null" : `${typeof options}`}`);
}
function CreateOnePropObject(propName, propValue) {
  const o = ObjectCreate$2(null);
  o[propName] = propValue;
  return o;
}
function GetOption(options, property, allowedValues, fallback) {
  let value = options[property];
  if (value !== void 0) {
    value = ToString(value);
    if (!allowedValues.includes(value)) {
      throw new RangeError(`${property} must be one of ${allowedValues.join(", ")}, not ${value}`);
    }
    return value;
  }
  return fallback;
}
function GetNumberOption(options, property, minimum, maximum, fallback) {
  let valueRaw = options[property];
  if (valueRaw === void 0)
    return fallback;
  const value = ToNumber(valueRaw);
  if (NumberIsNaN(value) || value < minimum || value > maximum) {
    throw new RangeError(`${property} must be between ${minimum} and ${maximum}, not ${value}`);
  }
  return MathFloor(value);
}
const OFFSET = new RegExp(`^${offset.source}$`);
function bisect(getState, leftParam, rightParam, lstateParam = getState(leftParam), rstateParam = getState(rightParam)) {
  let left = JSBI.BigInt(leftParam);
  let right = JSBI.BigInt(rightParam);
  let lstate = lstateParam;
  let rstate = rstateParam;
  while (JSBI.greaterThan(JSBI.subtract(right, left), ONE)) {
    const middle = JSBI.divide(JSBI.add(left, right), JSBI.BigInt(2));
    const mstate = getState(middle);
    if (mstate === lstate) {
      left = middle;
      lstate = mstate;
    } else if (mstate === rstate) {
      right = middle;
      rstate = mstate;
    } else {
      throw new Error(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`);
    }
  }
  return right;
}
const nsPerTimeUnit = {
  hour: 36e11,
  minute: 6e10,
  second: 1e9,
  millisecond: 1e6,
  microsecond: 1e3,
  nanosecond: 1
};
const DATE = Symbol("date");
const YM = Symbol("ym");
const MD = Symbol("md");
const TIME = Symbol("time");
const DATETIME = Symbol("datetime");
const ZONED = Symbol("zoneddatetime");
const INST = Symbol("instant");
const ORIGINAL = Symbol("original");
const TZ_RESOLVED = Symbol("timezone");
const TZ_GIVEN = Symbol("timezone-id-given");
const CAL_ID = Symbol("calendar-id");
const LOCALE = Symbol("locale");
const OPTIONS = Symbol("options");
const descriptor = (value) => {
  return {
    value,
    enumerable: true,
    writable: false,
    configurable: true
  };
};
const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
const ObjectAssign$1 = Object.assign;
const ObjectHasOwnProperty = Object.prototype.hasOwnProperty;
const ReflectApply = Reflect.apply;
function getPropLazy(obj, prop) {
  let val = obj[prop];
  if (typeof val === "function") {
    val = new IntlDateTimeFormat(obj[LOCALE], val(obj[OPTIONS]));
    obj[prop] = val;
  }
  return val;
}
function getResolvedTimeZoneLazy(obj) {
  let val = obj[TZ_RESOLVED];
  if (typeof val === "string") {
    val = ToTemporalTimeZone(val);
    obj[TZ_RESOLVED] = val;
  }
  return val;
}
function DateTimeFormatImpl(locale = void 0, optionsParam = {}) {
  if (!(this instanceof DateTimeFormatImpl)) {
    return new DateTimeFormatImpl(locale, optionsParam);
  }
  const hasOptions = typeof optionsParam !== "undefined";
  const options = hasOptions ? ObjectAssign$1({}, optionsParam) : {};
  const original = new IntlDateTimeFormat(locale, options);
  const ro = original.resolvedOptions();
  if (hasOptions) {
    const clonedResolved = ObjectAssign$1({}, ro);
    for (const prop in clonedResolved) {
      if (!ReflectApply(ObjectHasOwnProperty, options, [prop])) {
        delete clonedResolved[prop];
      }
    }
    this[OPTIONS] = clonedResolved;
  } else {
    this[OPTIONS] = options;
  }
  this[TZ_GIVEN] = options.timeZone ? options.timeZone : null;
  this[LOCALE] = ro.locale;
  this[ORIGINAL] = original;
  this[TZ_RESOLVED] = ro.timeZone;
  this[CAL_ID] = ro.calendar;
  this[DATE] = dateAmend;
  this[YM] = yearMonthAmend;
  this[MD] = monthDayAmend;
  this[TIME] = timeAmend;
  this[DATETIME] = datetimeAmend;
  this[ZONED] = zonedDateTimeAmend;
  this[INST] = instantAmend;
  return void 0;
}
Object.defineProperty(DateTimeFormatImpl, "name", {
  writable: true,
  value: "DateTimeFormat"
});
DateTimeFormatImpl.supportedLocalesOf = function(locales, options) {
  return IntlDateTimeFormat.supportedLocalesOf(locales, options);
};
const properties = {
  resolvedOptions: descriptor(resolvedOptions),
  format: descriptor(format),
  formatRange: descriptor(formatRange)
};
if ("formatToParts" in IntlDateTimeFormat.prototype) {
  properties.formatToParts = descriptor(formatToParts);
}
if ("formatRangeToParts" in IntlDateTimeFormat.prototype) {
  properties.formatRangeToParts = descriptor(formatRangeToParts);
}
DateTimeFormatImpl.prototype = Object.create(IntlDateTimeFormat.prototype, properties);
Object.defineProperty(DateTimeFormatImpl, "prototype", {
  writable: false,
  enumerable: false,
  configurable: false
});
const DateTimeFormat = DateTimeFormatImpl;
function resolvedOptions() {
  return this[ORIGINAL].resolvedOptions();
}
function adjustFormatterTimeZone(formatter, timeZone2) {
  if (!timeZone2)
    return formatter;
  const options = formatter.resolvedOptions();
  if (options.timeZone === timeZone2)
    return formatter;
  if (options["dateStyle"] || options["timeStyle"]) {
    delete options["weekday"];
    delete options["era"];
    delete options["year"];
    delete options["month"];
    delete options["day"];
    delete options["hour"];
    delete options["minute"];
    delete options["second"];
    delete options["timeZoneName"];
    delete options["hourCycle"];
    delete options["hour12"];
    delete options["dayPeriod"];
  }
  return new IntlDateTimeFormat(options.locale, __spreadProps(__spreadValues({}, options), { timeZone: timeZone2 }));
}
function format(datetime, ...rest) {
  let { instant: instant2, formatter, timeZone: timeZone2 } = extractOverrides(datetime, this);
  if (instant2 && formatter) {
    formatter = adjustFormatterTimeZone(formatter, timeZone2);
    return formatter.format(instant2.epochMilliseconds);
  }
  return this[ORIGINAL].format(datetime, ...rest);
}
function formatToParts(datetime, ...rest) {
  let { instant: instant2, formatter, timeZone: timeZone2 } = extractOverrides(datetime, this);
  if (instant2 && formatter) {
    formatter = adjustFormatterTimeZone(formatter, timeZone2);
    return formatter.formatToParts(instant2.epochMilliseconds);
  }
  return this[ORIGINAL].formatToParts(datetime, ...rest);
}
function formatRange(a, b) {
  if (isTemporalObject(a) || isTemporalObject(b)) {
    if (!sameTemporalType(a, b)) {
      throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
    }
    const { instant: aa, formatter: aformatter, timeZone: atz } = extractOverrides(a, this);
    const { instant: bb, formatter: bformatter, timeZone: btz } = extractOverrides(b, this);
    if (atz && btz && atz !== btz) {
      throw new RangeError("cannot format range between different time zones");
    }
    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
      const formatter = adjustFormatterTimeZone(aformatter, atz);
      return formatter.formatRange(aa.epochMilliseconds, bb.epochMilliseconds);
    }
  }
  return this[ORIGINAL].formatRange(a, b);
}
function formatRangeToParts(a, b) {
  if (isTemporalObject(a) || isTemporalObject(b)) {
    if (!sameTemporalType(a, b)) {
      throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
    }
    const { instant: aa, formatter: aformatter, timeZone: atz } = extractOverrides(a, this);
    const { instant: bb, formatter: bformatter, timeZone: btz } = extractOverrides(b, this);
    if (atz && btz && atz !== btz) {
      throw new RangeError("cannot format range between different time zones");
    }
    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
      const formatter = adjustFormatterTimeZone(aformatter, atz);
      return formatter.formatRangeToParts(aa.epochMilliseconds, bb.epochMilliseconds);
    }
  }
  return this[ORIGINAL].formatRangeToParts(a, b);
}
function amend(optionsParam = {}, amended = {}) {
  const options = ObjectAssign$1({}, optionsParam);
  for (const opt of [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "weekday",
    "dayPeriod",
    "timeZoneName",
    "dateStyle",
    "timeStyle"
  ]) {
    options[opt] = opt in amended ? amended[opt] : options[opt];
    if (options[opt] === false || options[opt] === void 0)
      delete options[opt];
  }
  return options;
}
function timeAmend(optionsParam) {
  let options = amend(optionsParam, {
    year: false,
    month: false,
    day: false,
    weekday: false,
    timeZoneName: false,
    dateStyle: false
  });
  if (!hasTimeOptions(options)) {
    options = ObjectAssign$1({}, options, {
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  }
  return options;
}
function yearMonthAmend(optionsParam) {
  let options = amend(optionsParam, {
    day: false,
    hour: false,
    minute: false,
    second: false,
    weekday: false,
    dayPeriod: false,
    timeZoneName: false,
    dateStyle: false,
    timeStyle: false
  });
  if (!("year" in options || "month" in options)) {
    options = ObjectAssign$1(options, { year: "numeric", month: "numeric" });
  }
  return options;
}
function monthDayAmend(optionsParam) {
  let options = amend(optionsParam, {
    year: false,
    hour: false,
    minute: false,
    second: false,
    weekday: false,
    dayPeriod: false,
    timeZoneName: false,
    dateStyle: false,
    timeStyle: false
  });
  if (!("month" in options || "day" in options)) {
    options = ObjectAssign$1({}, options, { month: "numeric", day: "numeric" });
  }
  return options;
}
function dateAmend(optionsParam) {
  let options = amend(optionsParam, {
    hour: false,
    minute: false,
    second: false,
    dayPeriod: false,
    timeZoneName: false,
    timeStyle: false
  });
  if (!hasDateOptions(options)) {
    options = ObjectAssign$1({}, options, {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
  }
  return options;
}
function datetimeAmend(optionsParam) {
  let options = amend(optionsParam, { timeZoneName: false });
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    options = ObjectAssign$1({}, options, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  }
  return options;
}
function zonedDateTimeAmend(optionsParam) {
  let options = optionsParam;
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    options = ObjectAssign$1({}, options, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    if (options.timeZoneName === void 0)
      options.timeZoneName = "short";
  }
  return options;
}
function instantAmend(optionsParam) {
  let options = optionsParam;
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    options = ObjectAssign$1({}, options, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  }
  return options;
}
function hasDateOptions(options) {
  return "year" in options || "month" in options || "day" in options || "weekday" in options || "dateStyle" in options;
}
function hasTimeOptions(options) {
  return "hour" in options || "minute" in options || "second" in options || "timeStyle" in options || "dayPeriod" in options;
}
function isTemporalObject(obj) {
  return IsTemporalDate(obj) || IsTemporalTime(obj) || IsTemporalDateTime(obj) || IsTemporalZonedDateTime(obj) || IsTemporalYearMonth(obj) || IsTemporalMonthDay(obj) || IsTemporalInstant(obj);
}
function sameTemporalType(x, y) {
  if (!isTemporalObject(x) || !isTemporalObject(y))
    return false;
  if (IsTemporalTime(x) && !IsTemporalTime(y))
    return false;
  if (IsTemporalDate(x) && !IsTemporalDate(y))
    return false;
  if (IsTemporalDateTime(x) && !IsTemporalDateTime(y))
    return false;
  if (IsTemporalZonedDateTime(x) && !IsTemporalZonedDateTime(y))
    return false;
  if (IsTemporalYearMonth(x) && !IsTemporalYearMonth(y))
    return false;
  if (IsTemporalMonthDay(x) && !IsTemporalMonthDay(y))
    return false;
  if (IsTemporalInstant(x) && !IsTemporalInstant(y))
    return false;
  return true;
}
function extractOverrides(temporalObj, main) {
  const DateTime = GetIntrinsic("%Temporal.PlainDateTime%");
  if (IsTemporalTime(temporalObj)) {
    const hour = GetSlot(temporalObj, ISO_HOUR);
    const minute = GetSlot(temporalObj, ISO_MINUTE);
    const second = GetSlot(temporalObj, ISO_SECOND);
    const millisecond = GetSlot(temporalObj, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalObj, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalObj, ISO_NANOSECOND);
    const datetime = new DateTime(1970, 1, 1, hour, minute, second, millisecond, microsecond, nanosecond, main[CAL_ID]);
    return {
      instant: BuiltinTimeZoneGetInstantFor(getResolvedTimeZoneLazy(main), datetime, "compatible"),
      formatter: getPropLazy(main, TIME)
    };
  }
  if (IsTemporalYearMonth(temporalObj)) {
    const isoYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const referenceISODay = GetSlot(temporalObj, ISO_DAY);
    const calendar2 = ToString(GetSlot(temporalObj, CALENDAR));
    if (calendar2 !== main[CAL_ID]) {
      throw new RangeError(`cannot format PlainYearMonth with calendar ${calendar2} in locale with calendar ${main[CAL_ID]}`);
    }
    const datetime = new DateTime(isoYear, isoMonth, referenceISODay, 12, 0, 0, 0, 0, 0, calendar2);
    return {
      instant: BuiltinTimeZoneGetInstantFor(getResolvedTimeZoneLazy(main), datetime, "compatible"),
      formatter: getPropLazy(main, YM)
    };
  }
  if (IsTemporalMonthDay(temporalObj)) {
    const referenceISOYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const isoDay = GetSlot(temporalObj, ISO_DAY);
    const calendar2 = ToString(GetSlot(temporalObj, CALENDAR));
    if (calendar2 !== main[CAL_ID]) {
      throw new RangeError(`cannot format PlainMonthDay with calendar ${calendar2} in locale with calendar ${main[CAL_ID]}`);
    }
    const datetime = new DateTime(referenceISOYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, calendar2);
    return {
      instant: BuiltinTimeZoneGetInstantFor(getResolvedTimeZoneLazy(main), datetime, "compatible"),
      formatter: getPropLazy(main, MD)
    };
  }
  if (IsTemporalDate(temporalObj)) {
    const isoYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const isoDay = GetSlot(temporalObj, ISO_DAY);
    const calendar2 = ToString(GetSlot(temporalObj, CALENDAR));
    if (calendar2 !== "iso8601" && calendar2 !== main[CAL_ID]) {
      throw new RangeError(`cannot format PlainDate with calendar ${calendar2} in locale with calendar ${main[CAL_ID]}`);
    }
    const datetime = new DateTime(isoYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, main[CAL_ID]);
    return {
      instant: BuiltinTimeZoneGetInstantFor(getResolvedTimeZoneLazy(main), datetime, "compatible"),
      formatter: getPropLazy(main, DATE)
    };
  }
  if (IsTemporalDateTime(temporalObj)) {
    const isoYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const isoDay = GetSlot(temporalObj, ISO_DAY);
    const hour = GetSlot(temporalObj, ISO_HOUR);
    const minute = GetSlot(temporalObj, ISO_MINUTE);
    const second = GetSlot(temporalObj, ISO_SECOND);
    const millisecond = GetSlot(temporalObj, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalObj, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalObj, ISO_NANOSECOND);
    const calendar2 = ToString(GetSlot(temporalObj, CALENDAR));
    if (calendar2 !== "iso8601" && calendar2 !== main[CAL_ID]) {
      throw new RangeError(`cannot format PlainDateTime with calendar ${calendar2} in locale with calendar ${main[CAL_ID]}`);
    }
    let datetime = temporalObj;
    if (calendar2 === "iso8601") {
      datetime = new DateTime(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, main[CAL_ID]);
    }
    return {
      instant: BuiltinTimeZoneGetInstantFor(getResolvedTimeZoneLazy(main), datetime, "compatible"),
      formatter: getPropLazy(main, DATETIME)
    };
  }
  if (IsTemporalZonedDateTime(temporalObj)) {
    const calendar2 = ToString(GetSlot(temporalObj, CALENDAR));
    if (calendar2 !== "iso8601" && calendar2 !== main[CAL_ID]) {
      throw new RangeError(`cannot format ZonedDateTime with calendar ${calendar2} in locale with calendar ${main[CAL_ID]}`);
    }
    const timeZone2 = GetSlot(temporalObj, TIME_ZONE);
    const objTimeZone = ToString(timeZone2);
    if (main[TZ_GIVEN] && main[TZ_GIVEN] !== objTimeZone) {
      throw new RangeError(`timeZone option ${main[TZ_GIVEN]} doesn't match actual time zone ${objTimeZone}`);
    }
    return {
      instant: GetSlot(temporalObj, INSTANT),
      formatter: getPropLazy(main, ZONED),
      timeZone: objTimeZone
    };
  }
  if (IsTemporalInstant(temporalObj)) {
    return {
      instant: temporalObj,
      formatter: getPropLazy(main, INST)
    };
  }
  return {};
}
var intl = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  DateTimeFormat
});
const DISALLOWED_UNITS$3 = ["year", "month", "week", "day"];
const MAX_DIFFERENCE_INCREMENTS = {
  hour: 24,
  minute: 60,
  second: 60,
  millisecond: 1e3,
  microsecond: 1e3,
  nanosecond: 1e3
};
class Instant {
  constructor(epochNanoseconds) {
    if (arguments.length < 1) {
      throw new TypeError("missing argument: epochNanoseconds is required");
    }
    const ns = ToBigInt(epochNanoseconds);
    ValidateEpochNanoseconds(ns);
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, ns);
    {
      const repr = TemporalInstantToString(this, void 0, "auto");
      Object.defineProperty(this, "_repr_", {
        value: `${this[Symbol.toStringTag]} <${repr}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get epochSeconds() {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return JSBI.toNumber(JSBI.divide(value, BILLION));
  }
  get epochMilliseconds() {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const value = JSBI.BigInt(GetSlot(this, EPOCHNANOSECONDS));
    return JSBI.toNumber(JSBI.divide(value, MILLION));
  }
  get epochMicroseconds() {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const value = JSBI.BigInt(GetSlot(this, EPOCHNANOSECONDS));
    return ToBigIntExternal(JSBI.divide(value, THOUSAND));
  }
  get epochNanoseconds() {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    return ToBigIntExternal(JSBI.BigInt(GetSlot(this, EPOCHNANOSECONDS)));
  }
  add(temporalDurationLike) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToLimitedTemporalDuration(temporalDurationLike, ["years", "months", "weeks", "days"]);
    const ns = AddInstant(GetSlot(this, EPOCHNANOSECONDS), hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    return new Instant(ns);
  }
  subtract(temporalDurationLike) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToLimitedTemporalDuration(temporalDurationLike, ["years", "months", "weeks", "days"]);
    const ns = AddInstant(GetSlot(this, EPOCHNANOSECONDS), -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds);
    return new Instant(ns);
  }
  until(otherParam, optionsParam = void 0) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalInstant(otherParam);
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond", DISALLOWED_UNITS$3);
    const defaultLargestUnit = LargerOfTwoTemporalUnits("second", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS$3, defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, MAX_DIFFERENCE_INCREMENTS[smallestUnit], false);
    const onens = GetSlot(this, EPOCHNANOSECONDS);
    const twons = GetSlot(other, EPOCHNANOSECONDS);
    let { seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(onens, twons, roundingIncrement, smallestUnit, roundingMode);
    let hours, minutes;
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, 0, 0, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(otherParam, optionsParam = void 0) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalInstant(otherParam);
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond", DISALLOWED_UNITS$3);
    const defaultLargestUnit = LargerOfTwoTemporalUnits("second", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS$3, defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, MAX_DIFFERENCE_INCREMENTS[smallestUnit], false);
    const onens = GetSlot(other, EPOCHNANOSECONDS);
    const twons = GetSlot(this, EPOCHNANOSECONDS);
    let { seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(onens, twons, roundingIncrement, smallestUnit, roundingMode);
    let hours, minutes;
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, 0, 0, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  round(optionsParam) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    if (optionsParam === void 0)
      throw new TypeError("options parameter is required");
    const options = typeof optionsParam === "string" ? CreateOnePropObject("smallestUnit", optionsParam) : GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, void 0, DISALLOWED_UNITS$3);
    if (smallestUnit === void 0)
      throw new RangeError("smallestUnit is required");
    const roundingMode = ToTemporalRoundingMode(options, "halfExpand");
    const maximumIncrements = {
      hour: 24,
      minute: 1440,
      second: 86400,
      millisecond: 864e5,
      microsecond: 864e8,
      nanosecond: 864e11
    };
    const roundingIncrement = ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], true);
    const ns = GetSlot(this, EPOCHNANOSECONDS);
    const roundedNs = RoundInstant(ns, roundingIncrement, smallestUnit, roundingMode);
    return new Instant(roundedNs);
  }
  equals(otherParam) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalInstant(otherParam);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    return JSBI.equal(JSBI.BigInt(one), JSBI.BigInt(two));
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    let timeZone2 = options.timeZone;
    if (timeZone2 !== void 0)
      timeZone2 = ToTemporalTimeZone(timeZone2);
    const { precision, unit, increment } = ToSecondsStringPrecision(options);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const ns = GetSlot(this, EPOCHNANOSECONDS);
    const roundedNs = RoundInstant(ns, increment, unit, roundingMode);
    const roundedInstant = new Instant(roundedNs);
    return TemporalInstantToString(roundedInstant, timeZone2, precision);
  }
  toJSON() {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    return TemporalInstantToString(this, void 0, "auto");
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.Instant");
  }
  toZonedDateTime(item) {
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(item)) {
      throw new TypeError("invalid argument in toZonedDateTime");
    }
    const calendarLike = item.calendar;
    if (calendarLike === void 0) {
      throw new TypeError("missing calendar property in toZonedDateTime");
    }
    const calendar2 = ToTemporalCalendar(calendarLike);
    const temporalTimeZoneLike = item.timeZone;
    if (temporalTimeZoneLike === void 0) {
      throw new TypeError("missing timeZone property in toZonedDateTime");
    }
    const timeZone2 = ToTemporalTimeZone(temporalTimeZoneLike);
    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone2, calendar2);
  }
  toZonedDateTimeISO(itemParam) {
    let item = itemParam;
    if (!IsTemporalInstant(this))
      throw new TypeError("invalid receiver");
    if (IsObject(item)) {
      const timeZoneProperty = item.timeZone;
      if (timeZoneProperty !== void 0) {
        item = timeZoneProperty;
      }
    }
    const timeZone2 = ToTemporalTimeZone(item);
    const calendar2 = GetISO8601Calendar();
    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone2, calendar2);
  }
  static fromEpochSeconds(epochSecondsParam) {
    const epochSeconds = ToNumber(epochSecondsParam);
    const epochNanoseconds = JSBI.multiply(JSBI.BigInt(epochSeconds), BILLION);
    ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static fromEpochMilliseconds(epochMillisecondsParam) {
    const epochMilliseconds = ToNumber(epochMillisecondsParam);
    const epochNanoseconds = JSBI.multiply(JSBI.BigInt(epochMilliseconds), MILLION);
    ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static fromEpochMicroseconds(epochMicrosecondsParam) {
    const epochMicroseconds = ToBigInt(epochMicrosecondsParam);
    const epochNanoseconds = JSBI.multiply(epochMicroseconds, THOUSAND);
    ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static fromEpochNanoseconds(epochNanosecondsParam) {
    const epochNanoseconds = ToBigInt(epochNanosecondsParam);
    ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static from(item) {
    if (IsTemporalInstant(item)) {
      return new Instant(GetSlot(item, EPOCHNANOSECONDS));
    }
    return ToTemporalInstant(item);
  }
  static compare(oneParam, twoParam) {
    const one = ToTemporalInstant(oneParam);
    const two = ToTemporalInstant(twoParam);
    const oneNs = GetSlot(one, EPOCHNANOSECONDS);
    const twoNs = GetSlot(two, EPOCHNANOSECONDS);
    if (JSBI.lessThan(oneNs, twoNs))
      return -1;
    if (JSBI.greaterThan(oneNs, twoNs))
      return 1;
    return 0;
  }
}
MakeIntrinsicClass(Instant, "Temporal.Instant");
const DISALLOWED_UNITS$2 = ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"];
class PlainDate {
  constructor(isoYearParam, isoMonthParam, isoDayParam, calendarParam = GetISO8601Calendar()) {
    const isoYear = ToIntegerThrowOnInfinity(isoYearParam);
    const isoMonth = ToIntegerThrowOnInfinity(isoMonthParam);
    const isoDay = ToIntegerThrowOnInfinity(isoDayParam);
    const calendar2 = ToTemporalCalendar(calendarParam);
    if (arguments.length < 3) {
      throw new RangeError("missing argument: isoYear, isoMonth and isoDay are required");
    }
    CreateTemporalDateSlots(this, isoYear, isoMonth, isoDay, calendar2);
  }
  get calendar() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get year() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarDay(GetSlot(this, CALENDAR), this);
  }
  get dayOfWeek() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarDayOfWeek(GetSlot(this, CALENDAR), this);
  }
  get dayOfYear() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarDayOfYear(GetSlot(this, CALENDAR), this);
  }
  get weekOfYear() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarWeekOfYear(GetSlot(this, CALENDAR), this);
  }
  get daysInWeek() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInWeek(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalDateLike, optionsParam = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(temporalDateLike)) {
      throw new TypeError("invalid argument");
    }
    RejectObjectWithCalendarOrTimeZone(temporalDateLike);
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["day", "month", "monthCode", "year"]);
    const props = ToPartialRecord(temporalDateLike, fieldNames);
    if (!props) {
      throw new TypeError("invalid date-like");
    }
    let fields = ToTemporalDateFields(this, fieldNames);
    fields = CalendarMergeFields(calendar2, fields, props);
    fields = ToTemporalDateFields(fields, fieldNames);
    const options = GetOptionsObject(optionsParam);
    return DateFromFields(calendar2, fields, options);
  }
  withCalendar(calendarParam) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const calendar2 = ToTemporalCalendar(calendarParam);
    return new PlainDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar2);
  }
  add(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToTemporalDuration(temporalDurationLike);
    const options = GetOptionsObject(optionsParam);
    return CalendarDateAdd(GetSlot(this, CALENDAR), this, duration2, options);
  }
  subtract(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const duration2 = CreateNegatedTemporalDuration(ToTemporalDuration(temporalDurationLike));
    const options = GetOptionsObject(optionsParam);
    return CalendarDateAdd(GetSlot(this, CALENDAR), this, duration2, options);
  }
  until(otherParam, optionsParam = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalDate(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ToString(calendar2);
    const otherCalendarId = ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "day", DISALLOWED_UNITS$2);
    const defaultLargestUnit = LargerOfTwoTemporalUnits("day", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS$2, defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, void 0, false);
    const untilOptions = __spreadProps(__spreadValues({}, options), { largestUnit });
    const result = CalendarDateUntil(calendar2, this, other, untilOptions);
    if (smallestUnit === "day" && roundingIncrement === 1)
      return result;
    let { years, months, weeks, days } = result;
    ({ years, months, weeks, days } = RoundDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, roundingIncrement, smallestUnit, roundingMode, this));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  since(otherParam, optionsParam = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalDate(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ToString(calendar2);
    const otherCalendarId = ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "day", DISALLOWED_UNITS$2);
    const defaultLargestUnit = LargerOfTwoTemporalUnits("day", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS$2, defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, void 0, false);
    const untilOptions = __spreadProps(__spreadValues({}, options), { largestUnit });
    let { years, months, weeks, days } = CalendarDateUntil(calendar2, this, other, untilOptions);
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    if (smallestUnit === "day" && roundingIncrement === 1) {
      return new Duration2(-years, -months, -weeks, -days, 0, 0, 0, 0, 0, 0);
    }
    ({ years, months, weeks, days } = RoundDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, roundingIncrement, smallestUnit, NegateTemporalRoundingMode(roundingMode), this));
    return new Duration2(-years, -months, -weeks, -days, 0, 0, 0, 0, 0, 0);
  }
  equals(otherParam) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalDate(otherParam);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2)
        return false;
    }
    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    const showCalendar = ToShowCalendarOption(options);
    return TemporalDateToString(this, showCalendar);
  }
  toJSON() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return TemporalDateToString(this);
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainDate");
  }
  toPlainDateTime(temporalTimeParam = void 0) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar2 = GetSlot(this, CALENDAR);
    if (temporalTimeParam === void 0)
      return CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar2);
    const temporalTime = ToTemporalTime(temporalTimeParam);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  toZonedDateTime(item) {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    let timeZone2, temporalTime;
    if (IsObject(item)) {
      const timeZoneLike = item.timeZone;
      if (timeZoneLike === void 0) {
        timeZone2 = ToTemporalTimeZone(item);
      } else {
        timeZone2 = ToTemporalTimeZone(timeZoneLike);
        temporalTime = item.plainTime;
      }
    } else {
      timeZone2 = ToTemporalTimeZone(item);
    }
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar2 = GetSlot(this, CALENDAR);
    let hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0;
    if (temporalTime !== void 0) {
      temporalTime = ToTemporalTime(temporalTime);
      hour = GetSlot(temporalTime, ISO_HOUR);
      minute = GetSlot(temporalTime, ISO_MINUTE);
      second = GetSlot(temporalTime, ISO_SECOND);
      millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
      microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
      nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
    }
    const dt = CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
    const instant2 = BuiltinTimeZoneGetInstantFor(timeZone2, dt, "compatible");
    return CreateTemporalZonedDateTime(GetSlot(instant2, EPOCHNANOSECONDS), timeZone2, calendar2);
  }
  toPlainYearMonth() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const fields = ToTemporalYearMonthFields(this, fieldNames);
    return YearMonthFromFields(calendar2, fields);
  }
  toPlainMonthDay() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["day", "monthCode"]);
    const fields = ToTemporalMonthDayFields(this, fieldNames);
    return MonthDayFromFields(calendar2, fields);
  }
  getISOFields() {
    if (!IsTemporalDate(this))
      throw new TypeError("invalid receiver");
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, optionsParam = void 0) {
    const options = GetOptionsObject(optionsParam);
    if (IsTemporalDate(item)) {
      ToTemporalOverflow(options);
      return CreateTemporalDate(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR));
    }
    return ToTemporalDate(item, options);
  }
  static compare(oneParam, twoParam) {
    const one = ToTemporalDate(oneParam);
    const two = ToTemporalDate(twoParam);
    return CompareISODate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY));
  }
}
MakeIntrinsicClass(PlainDate, "Temporal.PlainDate");
class PlainDateTime {
  constructor(isoYearParam, isoMonthParam, isoDayParam, hourParam = 0, minuteParam = 0, secondParam = 0, millisecondParam = 0, microsecondParam = 0, nanosecondParam = 0, calendarParam = GetISO8601Calendar()) {
    const isoYear = ToIntegerThrowOnInfinity(isoYearParam);
    const isoMonth = ToIntegerThrowOnInfinity(isoMonthParam);
    const isoDay = ToIntegerThrowOnInfinity(isoDayParam);
    const hour = ToIntegerThrowOnInfinity(hourParam);
    const minute = ToIntegerThrowOnInfinity(minuteParam);
    const second = ToIntegerThrowOnInfinity(secondParam);
    const millisecond = ToIntegerThrowOnInfinity(millisecondParam);
    const microsecond = ToIntegerThrowOnInfinity(microsecondParam);
    const nanosecond = ToIntegerThrowOnInfinity(nanosecondParam);
    const calendar2 = ToTemporalCalendar(calendarParam);
    if (arguments.length < 3) {
      throw new RangeError("missing argument: isoYear, isoMonth and isoDay are required");
    }
    CreateTemporalDateTimeSlots(this, isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  get calendar() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, CALENDAR);
  }
  get year() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDay(GetSlot(this, CALENDAR), this);
  }
  get hour() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_HOUR);
  }
  get minute() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_MINUTE);
  }
  get second() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_SECOND);
  }
  get millisecond() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_MILLISECOND);
  }
  get microsecond() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_NANOSECOND);
  }
  get era() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get dayOfWeek() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDayOfWeek(GetSlot(this, CALENDAR), this);
  }
  get dayOfYear() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDayOfYear(GetSlot(this, CALENDAR), this);
  }
  get weekOfYear() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarWeekOfYear(GetSlot(this, CALENDAR), this);
  }
  get daysInWeek() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInWeek(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalDateTimeLike, optionsParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(temporalDateTimeLike)) {
      throw new TypeError("invalid argument");
    }
    RejectObjectWithCalendarOrTimeZone(temporalDateTimeLike);
    const options = GetOptionsObject(optionsParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, [
      "day",
      "hour",
      "microsecond",
      "millisecond",
      "minute",
      "month",
      "monthCode",
      "nanosecond",
      "second",
      "year"
    ]);
    const props = ToPartialRecord(temporalDateTimeLike, fieldNames);
    if (!props) {
      throw new TypeError("invalid date-time-like");
    }
    let fields = ToTemporalDateTimeFields(this, fieldNames);
    fields = CalendarMergeFields(calendar2, fields, props);
    fields = ToTemporalDateTimeFields(fields, fieldNames);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(calendar2, fields, options);
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  withPlainTime(temporalTimeParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar2 = GetSlot(this, CALENDAR);
    if (temporalTimeParam === void 0)
      return CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar2);
    const temporalTime = ToTemporalTime(temporalTimeParam);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  withPlainDate(temporalDateParam) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const temporalDate = ToTemporalDate(temporalDateParam);
    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    let calendar2 = GetSlot(temporalDate, CALENDAR);
    const hour = GetSlot(this, ISO_HOUR);
    const minute = GetSlot(this, ISO_MINUTE);
    const second = GetSlot(this, ISO_SECOND);
    const millisecond = GetSlot(this, ISO_MILLISECOND);
    const microsecond = GetSlot(this, ISO_MICROSECOND);
    const nanosecond = GetSlot(this, ISO_NANOSECOND);
    calendar2 = ConsolidateCalendars(GetSlot(this, CALENDAR), calendar2);
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  withCalendar(calendarParam) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const calendar2 = ToTemporalCalendar(calendarParam);
    return new PlainDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), calendar2);
  }
  add(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    const options = GetOptionsObject(optionsParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = AddDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), calendar2, years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, options);
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  subtract(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    const options = GetOptionsObject(optionsParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = AddDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), calendar2, -years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds, options);
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  until(otherParam, optionsParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalDateTime(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ToString(calendar2);
    const otherCalendarId = ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond");
    const defaultLargestUnit = LargerOfTwoTemporalUnits("day", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", [], defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalDateTimeRoundingIncrement(options, smallestUnit);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceISODateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND), calendar2, largestUnit, options);
    const relativeTo = TemporalDateTimeToDate(this);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, relativeTo));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(otherParam, optionsParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalDateTime(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ToString(calendar2);
    const otherCalendarId = ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond");
    const defaultLargestUnit = LargerOfTwoTemporalUnits("day", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", [], defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalDateTimeRoundingIncrement(options, smallestUnit);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceISODateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND), calendar2, largestUnit, options);
    const relativeTo = TemporalDateTimeToDate(this);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, NegateTemporalRoundingMode(roundingMode), relativeTo));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(-years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds);
  }
  round(optionsParam) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    if (optionsParam === void 0)
      throw new TypeError("options parameter is required");
    const options = typeof optionsParam === "string" ? CreateOnePropObject("smallestUnit", optionsParam) : GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, void 0, ["year", "month", "week"]);
    if (smallestUnit === void 0)
      throw new RangeError("smallestUnit is required");
    const roundingMode = ToTemporalRoundingMode(options, "halfExpand");
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1e3,
      microsecond: 1e3,
      nanosecond: 1e3
    };
    const roundingIncrement = ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
    let year = GetSlot(this, ISO_YEAR);
    let month = GetSlot(this, ISO_MONTH);
    let day = GetSlot(this, ISO_DAY);
    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode));
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, GetSlot(this, CALENDAR));
  }
  equals(otherParam) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalDateTime(otherParam);
    for (const slot of [
      ISO_YEAR,
      ISO_MONTH,
      ISO_DAY,
      ISO_HOUR,
      ISO_MINUTE,
      ISO_SECOND,
      ISO_MILLISECOND,
      ISO_MICROSECOND,
      ISO_NANOSECOND
    ]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2)
        return false;
    }
    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    const { precision, unit, increment } = ToSecondsStringPrecision(options);
    const showCalendar = ToShowCalendarOption(options);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    return TemporalDateTimeToString(this, precision, showCalendar, { unit, increment, roundingMode });
  }
  toJSON() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return TemporalDateTimeToString(this, "auto");
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainDateTime");
  }
  toZonedDateTime(temporalTimeZoneLike, optionsParam = void 0) {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const timeZone2 = ToTemporalTimeZone(temporalTimeZoneLike);
    const options = GetOptionsObject(optionsParam);
    const disambiguation = ToTemporalDisambiguation(options);
    const instant2 = BuiltinTimeZoneGetInstantFor(timeZone2, this, disambiguation);
    return CreateTemporalZonedDateTime(GetSlot(instant2, EPOCHNANOSECONDS), timeZone2, GetSlot(this, CALENDAR));
  }
  toPlainDate() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return TemporalDateTimeToDate(this);
  }
  toPlainYearMonth() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const fields = ToTemporalYearMonthFields(this, fieldNames);
    return YearMonthFromFields(calendar2, fields);
  }
  toPlainMonthDay() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["day", "monthCode"]);
    const fields = ToTemporalMonthDayFields(this, fieldNames);
    return MonthDayFromFields(calendar2, fields);
  }
  toPlainTime() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return TemporalDateTimeToTime(this);
  }
  getISOFields() {
    if (!IsTemporalDateTime(this))
      throw new TypeError("invalid receiver");
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoHour: GetSlot(this, ISO_HOUR),
      isoMicrosecond: GetSlot(this, ISO_MICROSECOND),
      isoMillisecond: GetSlot(this, ISO_MILLISECOND),
      isoMinute: GetSlot(this, ISO_MINUTE),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoNanosecond: GetSlot(this, ISO_NANOSECOND),
      isoSecond: GetSlot(this, ISO_SECOND),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, optionsParam = void 0) {
    const options = GetOptionsObject(optionsParam);
    if (IsTemporalDateTime(item)) {
      ToTemporalOverflow(options);
      return CreateTemporalDateTime(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, ISO_HOUR), GetSlot(item, ISO_MINUTE), GetSlot(item, ISO_SECOND), GetSlot(item, ISO_MILLISECOND), GetSlot(item, ISO_MICROSECOND), GetSlot(item, ISO_NANOSECOND), GetSlot(item, CALENDAR));
    }
    return ToTemporalDateTime(item, options);
  }
  static compare(oneParam, twoParam) {
    const one = ToTemporalDateTime(oneParam);
    const two = ToTemporalDateTime(twoParam);
    for (const slot of [
      ISO_YEAR,
      ISO_MONTH,
      ISO_DAY,
      ISO_HOUR,
      ISO_MINUTE,
      ISO_SECOND,
      ISO_MILLISECOND,
      ISO_MICROSECOND,
      ISO_NANOSECOND
    ]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2)
        return ComparisonResult(val1 - val2);
    }
    return 0;
  }
}
MakeIntrinsicClass(PlainDateTime, "Temporal.PlainDateTime");
class Duration {
  constructor(yearsParam = 0, monthsParam = 0, weeksParam = 0, daysParam = 0, hoursParam = 0, minutesParam = 0, secondsParam = 0, millisecondsParam = 0, microsecondsParam = 0, nanosecondsParam = 0) {
    const years = ToIntegerWithoutRounding(yearsParam);
    const months = ToIntegerWithoutRounding(monthsParam);
    const weeks = ToIntegerWithoutRounding(weeksParam);
    const days = ToIntegerWithoutRounding(daysParam);
    const hours = ToIntegerWithoutRounding(hoursParam);
    const minutes = ToIntegerWithoutRounding(minutesParam);
    const seconds = ToIntegerWithoutRounding(secondsParam);
    const milliseconds = ToIntegerWithoutRounding(millisecondsParam);
    const microseconds = ToIntegerWithoutRounding(microsecondsParam);
    const nanoseconds = ToIntegerWithoutRounding(nanosecondsParam);
    const sign = DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    for (const prop of [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]) {
      if (!Number.isFinite(prop))
        throw new RangeError("infinite values not allowed as duration fields");
      const propSign = Math.sign(prop);
      if (propSign !== 0 && propSign !== sign)
        throw new RangeError("mixed-sign values not allowed as duration fields");
    }
    CreateSlots(this);
    SetSlot(this, YEARS, years);
    SetSlot(this, MONTHS, months);
    SetSlot(this, WEEKS, weeks);
    SetSlot(this, DAYS, days);
    SetSlot(this, HOURS, hours);
    SetSlot(this, MINUTES, minutes);
    SetSlot(this, SECONDS, seconds);
    SetSlot(this, MILLISECONDS, milliseconds);
    SetSlot(this, MICROSECONDS, microseconds);
    SetSlot(this, NANOSECONDS, nanoseconds);
    {
      Object.defineProperty(this, "_repr_", {
        value: `${this[Symbol.toStringTag]} <${TemporalDurationToString(this)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get years() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, YEARS);
  }
  get months() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, MONTHS);
  }
  get weeks() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, WEEKS);
  }
  get days() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, DAYS);
  }
  get hours() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, HOURS);
  }
  get minutes() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, MINUTES);
  }
  get seconds() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, SECONDS);
  }
  get milliseconds() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, MILLISECONDS);
  }
  get microseconds() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, MICROSECONDS);
  }
  get nanoseconds() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, NANOSECONDS);
  }
  get sign() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return DurationSign(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS));
  }
  get blank() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return DurationSign(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS)) === 0;
  }
  with(durationLike) {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    const props = ToPartialRecord(durationLike, [
      "days",
      "hours",
      "microseconds",
      "milliseconds",
      "minutes",
      "months",
      "nanoseconds",
      "seconds",
      "weeks",
      "years"
    ]);
    if (!props) {
      throw new TypeError("invalid duration-like");
    }
    const { years = GetSlot(this, YEARS), months = GetSlot(this, MONTHS), weeks = GetSlot(this, WEEKS), days = GetSlot(this, DAYS), hours = GetSlot(this, HOURS), minutes = GetSlot(this, MINUTES), seconds = GetSlot(this, SECONDS), milliseconds = GetSlot(this, MILLISECONDS), microseconds = GetSlot(this, MICROSECONDS), nanoseconds = GetSlot(this, NANOSECONDS) } = props;
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  negated() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return CreateNegatedTemporalDuration(this);
  }
  abs() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return new Duration(Math.abs(GetSlot(this, YEARS)), Math.abs(GetSlot(this, MONTHS)), Math.abs(GetSlot(this, WEEKS)), Math.abs(GetSlot(this, DAYS)), Math.abs(GetSlot(this, HOURS)), Math.abs(GetSlot(this, MINUTES)), Math.abs(GetSlot(this, SECONDS)), Math.abs(GetSlot(this, MILLISECONDS)), Math.abs(GetSlot(this, MICROSECONDS)), Math.abs(GetSlot(this, NANOSECONDS)));
  }
  add(other, optionsParam = void 0) {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToLimitedTemporalDuration(other);
    const options = GetOptionsObject(optionsParam);
    const relativeTo = ToRelativeTemporalObject(options);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = AddDuration(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS), years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, relativeTo));
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  subtract(other, optionsParam = void 0) {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToLimitedTemporalDuration(other);
    const options = GetOptionsObject(optionsParam);
    const relativeTo = ToRelativeTemporalObject(options);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = AddDuration(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS), -years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds, relativeTo));
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  round(optionsParam) {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    if (optionsParam === void 0)
      throw new TypeError("options parameter is required");
    let years = GetSlot(this, YEARS);
    let months = GetSlot(this, MONTHS);
    let weeks = GetSlot(this, WEEKS);
    let days = GetSlot(this, DAYS);
    let hours = GetSlot(this, HOURS);
    let minutes = GetSlot(this, MINUTES);
    let seconds = GetSlot(this, SECONDS);
    let milliseconds = GetSlot(this, MILLISECONDS);
    let microseconds = GetSlot(this, MICROSECONDS);
    let nanoseconds = GetSlot(this, NANOSECONDS);
    let defaultLargestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    const options = typeof optionsParam === "string" ? CreateOnePropObject("smallestUnit", optionsParam) : GetOptionsObject(optionsParam);
    let smallestUnit = ToSmallestTemporalUnit(options, void 0);
    let smallestUnitPresent = true;
    if (!smallestUnit) {
      smallestUnitPresent = false;
      smallestUnit = "nanosecond";
    }
    defaultLargestUnit = LargerOfTwoTemporalUnits(defaultLargestUnit, smallestUnit);
    let largestUnit = ToLargestTemporalUnit(options, void 0);
    let largestUnitPresent = true;
    if (!largestUnit) {
      largestUnitPresent = false;
      largestUnit = defaultLargestUnit;
    }
    if (largestUnit === "auto")
      largestUnit = defaultLargestUnit;
    if (!smallestUnitPresent && !largestUnitPresent) {
      throw new RangeError("at least one of smallestUnit or largestUnit is required");
    }
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "halfExpand");
    const roundingIncrement = ToTemporalDateTimeRoundingIncrement(options, smallestUnit);
    let relativeTo = ToRelativeTemporalObject(options);
    ({ years, months, weeks, days } = UnbalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo));
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, relativeTo));
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = AdjustRoundedDurationDays(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, relativeTo));
    ({ years, months, weeks, days } = BalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo));
    if (IsTemporalZonedDateTime(relativeTo)) {
      relativeTo = MoveRelativeZonedDateTime(relativeTo, years, months, weeks, 0);
    }
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit, relativeTo));
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  total(optionsParam) {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    let years = GetSlot(this, YEARS);
    let months = GetSlot(this, MONTHS);
    let weeks = GetSlot(this, WEEKS);
    let days = GetSlot(this, DAYS);
    let hours = GetSlot(this, HOURS);
    let minutes = GetSlot(this, MINUTES);
    let seconds = GetSlot(this, SECONDS);
    let milliseconds = GetSlot(this, MILLISECONDS);
    let microseconds = GetSlot(this, MICROSECONDS);
    let nanoseconds = GetSlot(this, NANOSECONDS);
    if (optionsParam === void 0)
      throw new TypeError("options argument is required");
    const options = typeof optionsParam === "string" ? CreateOnePropObject("unit", optionsParam) : GetOptionsObject(optionsParam);
    const unit = ToTemporalDurationTotalUnit(options);
    if (unit === void 0)
      throw new RangeError("unit option is required");
    const relativeTo = ToRelativeTemporalObject(options);
    ({ years, months, weeks, days } = UnbalanceDurationRelative(years, months, weeks, days, unit, relativeTo));
    let intermediate;
    if (IsTemporalZonedDateTime(relativeTo)) {
      intermediate = MoveRelativeZonedDateTime(relativeTo, years, months, weeks, 0);
    }
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, unit, intermediate));
    const { total } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 1, unit, "trunc", relativeTo);
    return total;
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    const { precision, unit, increment } = ToSecondsStringPrecision(options);
    if (precision === "minute")
      throw new RangeError('smallestUnit must not be "minute"');
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    return TemporalDurationToString(this, precision, { unit, increment, roundingMode });
  }
  toJSON() {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    return TemporalDurationToString(this);
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalDuration(this))
      throw new TypeError("invalid receiver");
    if (typeof Intl !== "undefined" && typeof Intl.DurationFormat !== "undefined") {
      return new Intl.DurationFormat(locales, options).format(this);
    }
    console.warn("Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.");
    return TemporalDurationToString(this);
  }
  valueOf() {
    throw new TypeError("use compare() to compare Temporal.Duration");
  }
  static from(item) {
    if (IsTemporalDuration(item)) {
      return new Duration(GetSlot(item, YEARS), GetSlot(item, MONTHS), GetSlot(item, WEEKS), GetSlot(item, DAYS), GetSlot(item, HOURS), GetSlot(item, MINUTES), GetSlot(item, SECONDS), GetSlot(item, MILLISECONDS), GetSlot(item, MICROSECONDS), GetSlot(item, NANOSECONDS));
    }
    return ToTemporalDuration(item);
  }
  static compare(oneParam, twoParam, optionsParam = void 0) {
    const one = ToTemporalDuration(oneParam);
    const two = ToTemporalDuration(twoParam);
    const options = GetOptionsObject(optionsParam);
    const relativeTo = ToRelativeTemporalObject(options);
    const y1 = GetSlot(one, YEARS);
    const mon1 = GetSlot(one, MONTHS);
    const w1 = GetSlot(one, WEEKS);
    let d1 = GetSlot(one, DAYS);
    const h1 = GetSlot(one, HOURS);
    const min1 = GetSlot(one, MINUTES);
    const s1 = GetSlot(one, SECONDS);
    const ms1 = GetSlot(one, MILLISECONDS);
    const \u00B5s1 = GetSlot(one, MICROSECONDS);
    let ns1 = GetSlot(one, NANOSECONDS);
    const y2 = GetSlot(two, YEARS);
    const mon2 = GetSlot(two, MONTHS);
    const w2 = GetSlot(two, WEEKS);
    let d2 = GetSlot(two, DAYS);
    const h2 = GetSlot(two, HOURS);
    const min2 = GetSlot(two, MINUTES);
    const s2 = GetSlot(two, SECONDS);
    const ms2 = GetSlot(two, MILLISECONDS);
    const \u00B5s2 = GetSlot(two, MICROSECONDS);
    let ns2 = GetSlot(two, NANOSECONDS);
    const shift1 = CalculateOffsetShift(relativeTo, y1, mon1, w1, d1, h1, min1, s1, ms1, \u00B5s1, ns1);
    const shift2 = CalculateOffsetShift(relativeTo, y2, mon2, w2, d2, h2, min2, s2, ms2, \u00B5s2, ns2);
    if (y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0) {
      ({ days: d1 } = UnbalanceDurationRelative(y1, mon1, w1, d1, "day", relativeTo));
      ({ days: d2 } = UnbalanceDurationRelative(y2, mon2, w2, d2, "day", relativeTo));
    }
    const totalNs1 = TotalDurationNanoseconds(d1, h1, min1, s1, ms1, \u00B5s1, ns1, shift1);
    const totalNs2 = TotalDurationNanoseconds(d2, h2, min2, s2, ms2, \u00B5s2, ns2, shift2);
    return ComparisonResult(JSBI.toNumber(JSBI.subtract(totalNs1, totalNs2)));
  }
}
MakeIntrinsicClass(Duration, "Temporal.Duration");
const ObjectCreate$1 = Object.create;
class PlainMonthDay {
  constructor(isoMonthParam, isoDayParam, calendarParam = GetISO8601Calendar(), referenceISOYearParam = 1972) {
    const isoMonth = ToIntegerThrowOnInfinity(isoMonthParam);
    const isoDay = ToIntegerThrowOnInfinity(isoDayParam);
    const calendar2 = ToTemporalCalendar(calendarParam);
    const referenceISOYear = ToIntegerThrowOnInfinity(referenceISOYearParam);
    if (arguments.length < 2) {
      throw new RangeError("missing argument: isoMonth and isoDay are required");
    }
    CreateTemporalMonthDaySlots(this, isoMonth, isoDay, calendar2, referenceISOYear);
  }
  get monthCode() {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    return CalendarDay(GetSlot(this, CALENDAR), this);
  }
  get calendar() {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, CALENDAR);
  }
  with(temporalMonthDayLike, optionsParam = void 0) {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(temporalMonthDayLike)) {
      throw new TypeError("invalid argument");
    }
    RejectObjectWithCalendarOrTimeZone(temporalMonthDayLike);
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["day", "month", "monthCode", "year"]);
    const props = ToPartialRecord(temporalMonthDayLike, fieldNames);
    if (!props) {
      throw new TypeError("invalid month-day-like");
    }
    let fields = ToTemporalMonthDayFields(this, fieldNames);
    fields = CalendarMergeFields(calendar2, fields, props);
    fields = ToTemporalMonthDayFields(fields, fieldNames);
    const options = GetOptionsObject(optionsParam);
    return MonthDayFromFields(calendar2, fields, options);
  }
  equals(otherParam) {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalMonthDay(otherParam);
    for (const slot of [ISO_MONTH, ISO_DAY, ISO_YEAR]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2)
        return false;
    }
    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    const showCalendar = ToShowCalendarOption(options);
    return TemporalMonthDayToString(this, showCalendar);
  }
  toJSON() {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    return TemporalMonthDayToString(this);
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError("use equals() to compare Temporal.PlainMonthDay");
  }
  toPlainDate(item) {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(item))
      throw new TypeError("argument should be an object");
    const calendar2 = GetSlot(this, CALENDAR);
    const receiverFieldNames = CalendarFields(calendar2, ["day", "monthCode"]);
    const fields = ToTemporalMonthDayFields(this, receiverFieldNames);
    const inputFieldNames = CalendarFields(calendar2, ["year"]);
    const inputEntries = [["year", void 0]];
    inputFieldNames.forEach((fieldName) => {
      if (!inputEntries.some(([name]) => name === fieldName)) {
        inputEntries.push([fieldName, void 0]);
      }
    });
    const inputFields = PrepareTemporalFields(item, inputEntries);
    let mergedFields = CalendarMergeFields(calendar2, fields, inputFields);
    const mergedFieldNames = [.../* @__PURE__ */ new Set([...receiverFieldNames, ...inputFieldNames])];
    const mergedEntries = [];
    mergedFieldNames.forEach((fieldName) => {
      if (!mergedEntries.some(([name]) => name === fieldName)) {
        mergedEntries.push([fieldName, void 0]);
      }
    });
    mergedFields = PrepareTemporalFields(mergedFields, mergedEntries);
    const options = ObjectCreate$1(null);
    options.overflow = "reject";
    return DateFromFields(calendar2, mergedFields, options);
  }
  getISOFields() {
    if (!IsTemporalMonthDay(this))
      throw new TypeError("invalid receiver");
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, optionsParam = void 0) {
    const options = GetOptionsObject(optionsParam);
    if (IsTemporalMonthDay(item)) {
      ToTemporalOverflow(options);
      return CreateTemporalMonthDay(GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR), GetSlot(item, ISO_YEAR));
    }
    return ToTemporalMonthDay(item, options);
  }
}
MakeIntrinsicClass(PlainMonthDay, "Temporal.PlainMonthDay");
const instant = () => {
  const Instant2 = GetIntrinsic("%Temporal.Instant%");
  return new Instant2(SystemUTCEpochNanoSeconds());
};
const plainDateTime = (calendarLike, temporalTimeZoneLike = timeZone()) => {
  const tZ = ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar2 = ToTemporalCalendar(calendarLike);
  const inst = instant();
  return BuiltinTimeZoneGetPlainDateTimeFor(tZ, inst, calendar2);
};
const plainDateTimeISO = (temporalTimeZoneLike = timeZone()) => {
  const tZ = ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar2 = GetISO8601Calendar();
  const inst = instant();
  return BuiltinTimeZoneGetPlainDateTimeFor(tZ, inst, calendar2);
};
const zonedDateTime = (calendarLike, temporalTimeZoneLike = timeZone()) => {
  const tZ = ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar2 = ToTemporalCalendar(calendarLike);
  return CreateTemporalZonedDateTime(SystemUTCEpochNanoSeconds(), tZ, calendar2);
};
const zonedDateTimeISO = (temporalTimeZoneLike = timeZone()) => {
  return zonedDateTime(GetISO8601Calendar(), temporalTimeZoneLike);
};
const plainDate = (calendarLike, temporalTimeZoneLike = timeZone()) => {
  return TemporalDateTimeToDate(plainDateTime(calendarLike, temporalTimeZoneLike));
};
const plainDateISO = (temporalTimeZoneLike = timeZone()) => {
  return TemporalDateTimeToDate(plainDateTimeISO(temporalTimeZoneLike));
};
const plainTimeISO = (temporalTimeZoneLike = timeZone()) => {
  return TemporalDateTimeToTime(plainDateTimeISO(temporalTimeZoneLike));
};
const timeZone = () => {
  return SystemTimeZone();
};
const Now = {
  instant,
  plainDateTime,
  plainDateTimeISO,
  plainDate,
  plainDateISO,
  plainTimeISO,
  timeZone,
  zonedDateTime,
  zonedDateTimeISO,
  [Symbol.toStringTag]: "Temporal.Now"
};
Object.defineProperty(Now, Symbol.toStringTag, {
  value: "Temporal.Now",
  writable: false,
  enumerable: false,
  configurable: true
});
const ObjectAssign = Object.assign;
const DISALLOWED_UNITS$1 = ["year", "month", "week", "day"];
const MAX_INCREMENTS = {
  hour: 24,
  minute: 60,
  second: 60,
  millisecond: 1e3,
  microsecond: 1e3,
  nanosecond: 1e3
};
function TemporalTimeToString(time2, precision, options = void 0) {
  let hour = GetSlot(time2, ISO_HOUR);
  let minute = GetSlot(time2, ISO_MINUTE);
  let second = GetSlot(time2, ISO_SECOND);
  let millisecond = GetSlot(time2, ISO_MILLISECOND);
  let microsecond = GetSlot(time2, ISO_MICROSECOND);
  let nanosecond = GetSlot(time2, ISO_NANOSECOND);
  if (options) {
    const { unit, increment, roundingMode } = options;
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode));
  }
  const hourString = ISODateTimePartString(hour);
  const minuteString = ISODateTimePartString(minute);
  const seconds = FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
  return `${hourString}:${minuteString}${seconds}`;
}
class PlainTime {
  constructor(isoHourParam = 0, isoMinuteParam = 0, isoSecondParam = 0, isoMillisecondParam = 0, isoMicrosecondParam = 0, isoNanosecondParam = 0) {
    const isoHour = ToIntegerThrowOnInfinity(isoHourParam);
    const isoMinute = ToIntegerThrowOnInfinity(isoMinuteParam);
    const isoSecond = ToIntegerThrowOnInfinity(isoSecondParam);
    const isoMillisecond = ToIntegerThrowOnInfinity(isoMillisecondParam);
    const isoMicrosecond = ToIntegerThrowOnInfinity(isoMicrosecondParam);
    const isoNanosecond = ToIntegerThrowOnInfinity(isoNanosecondParam);
    RejectTime(isoHour, isoMinute, isoSecond, isoMillisecond, isoMicrosecond, isoNanosecond);
    CreateSlots(this);
    SetSlot(this, ISO_HOUR, isoHour);
    SetSlot(this, ISO_MINUTE, isoMinute);
    SetSlot(this, ISO_SECOND, isoSecond);
    SetSlot(this, ISO_MILLISECOND, isoMillisecond);
    SetSlot(this, ISO_MICROSECOND, isoMicrosecond);
    SetSlot(this, ISO_NANOSECOND, isoNanosecond);
    SetSlot(this, CALENDAR, GetISO8601Calendar());
    {
      Object.defineProperty(this, "_repr_", {
        value: `${this[Symbol.toStringTag]} <${TemporalTimeToString(this, "auto")}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get calendar() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, CALENDAR);
  }
  get hour() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_HOUR);
  }
  get minute() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_MINUTE);
  }
  get second() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_SECOND);
  }
  get millisecond() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_MILLISECOND);
  }
  get microsecond() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, ISO_NANOSECOND);
  }
  with(temporalTimeLike, optionsParam = void 0) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(temporalTimeLike)) {
      throw new TypeError("invalid argument");
    }
    RejectObjectWithCalendarOrTimeZone(temporalTimeLike);
    const options = GetOptionsObject(optionsParam);
    const overflow = ToTemporalOverflow(options);
    const props = ToPartialRecord(temporalTimeLike, [
      "hour",
      "microsecond",
      "millisecond",
      "minute",
      "nanosecond",
      "second"
    ]);
    if (!props) {
      throw new TypeError("invalid time-like");
    }
    const fields = ToTemporalTimeRecord(this);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = ObjectAssign(fields, props);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow));
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  add(temporalDurationLike) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, "reject"));
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  subtract(temporalDurationLike) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, "reject"));
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  until(otherParam, optionsParam = void 0) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalTime(otherParam);
    const options = GetOptionsObject(optionsParam);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS$1, "hour");
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond", DISALLOWED_UNITS$1);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false);
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceTime(GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND));
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode));
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(otherParam, optionsParam = void 0) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalTime(otherParam);
    const options = GetOptionsObject(optionsParam);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS$1, "hour");
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond", DISALLOWED_UNITS$1);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false);
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceTime(GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND));
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(0, 0, 0, 0, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds, roundingIncrement, smallestUnit, NegateTemporalRoundingMode(roundingMode)));
    hours = -hours;
    minutes = -minutes;
    seconds = -seconds;
    milliseconds = -milliseconds;
    microseconds = -microseconds;
    nanoseconds = -nanoseconds;
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  round(optionsParam) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    if (optionsParam === void 0)
      throw new TypeError("options parameter is required");
    const options = typeof optionsParam === "string" ? CreateOnePropObject("smallestUnit", optionsParam) : GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, void 0, DISALLOWED_UNITS$1);
    if (smallestUnit === void 0)
      throw new RangeError("smallestUnit is required");
    const roundingMode = ToTemporalRoundingMode(options, "halfExpand");
    const roundingIncrement = ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false);
    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode));
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  equals(otherParam) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalTime(otherParam);
    for (const slot of [ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2)
        return false;
    }
    return true;
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    const { precision, unit, increment } = ToSecondsStringPrecision(options);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    return TemporalTimeToString(this, precision, { unit, increment, roundingMode });
  }
  toJSON() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return TemporalTimeToString(this, "auto");
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainTime");
  }
  toPlainDateTime(temporalDateParam) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    const temporalDate = ToTemporalDate(temporalDateParam);
    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    const calendar2 = GetSlot(temporalDate, CALENDAR);
    const hour = GetSlot(this, ISO_HOUR);
    const minute = GetSlot(this, ISO_MINUTE);
    const second = GetSlot(this, ISO_SECOND);
    const millisecond = GetSlot(this, ISO_MILLISECOND);
    const microsecond = GetSlot(this, ISO_MICROSECOND);
    const nanosecond = GetSlot(this, ISO_NANOSECOND);
    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
  }
  toZonedDateTime(item) {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(item)) {
      throw new TypeError("invalid argument");
    }
    const dateLike = item.plainDate;
    if (dateLike === void 0) {
      throw new TypeError("missing date property");
    }
    const temporalDate = ToTemporalDate(dateLike);
    const timeZoneLike = item.timeZone;
    if (timeZoneLike === void 0) {
      throw new TypeError("missing timeZone property");
    }
    const timeZone2 = ToTemporalTimeZone(timeZoneLike);
    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    const calendar2 = GetSlot(temporalDate, CALENDAR);
    const hour = GetSlot(this, ISO_HOUR);
    const minute = GetSlot(this, ISO_MINUTE);
    const second = GetSlot(this, ISO_SECOND);
    const millisecond = GetSlot(this, ISO_MILLISECOND);
    const microsecond = GetSlot(this, ISO_MICROSECOND);
    const nanosecond = GetSlot(this, ISO_NANOSECOND);
    const PlainDateTime2 = GetIntrinsic("%Temporal.PlainDateTime%");
    const dt = new PlainDateTime2(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
    const instant2 = BuiltinTimeZoneGetInstantFor(timeZone2, dt, "compatible");
    return CreateTemporalZonedDateTime(GetSlot(instant2, EPOCHNANOSECONDS), timeZone2, calendar2);
  }
  getISOFields() {
    if (!IsTemporalTime(this))
      throw new TypeError("invalid receiver");
    return {
      calendar: GetSlot(this, CALENDAR),
      isoHour: GetSlot(this, ISO_HOUR),
      isoMicrosecond: GetSlot(this, ISO_MICROSECOND),
      isoMillisecond: GetSlot(this, ISO_MILLISECOND),
      isoMinute: GetSlot(this, ISO_MINUTE),
      isoNanosecond: GetSlot(this, ISO_NANOSECOND),
      isoSecond: GetSlot(this, ISO_SECOND)
    };
  }
  static from(item, optionsParam = void 0) {
    const options = GetOptionsObject(optionsParam);
    const overflow = ToTemporalOverflow(options);
    if (IsTemporalTime(item)) {
      return new PlainTime(GetSlot(item, ISO_HOUR), GetSlot(item, ISO_MINUTE), GetSlot(item, ISO_SECOND), GetSlot(item, ISO_MILLISECOND), GetSlot(item, ISO_MICROSECOND), GetSlot(item, ISO_NANOSECOND));
    }
    return ToTemporalTime(item, overflow);
  }
  static compare(oneParam, twoParam) {
    const one = ToTemporalTime(oneParam);
    const two = ToTemporalTime(twoParam);
    for (const slot of [ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2)
        return ComparisonResult(val1 - val2);
    }
    return 0;
  }
}
MakeIntrinsicClass(PlainTime, "Temporal.PlainTime");
class TimeZone {
  constructor(timeZoneIdentifierParam) {
    if (arguments.length < 1) {
      throw new RangeError("missing argument: identifier is required");
    }
    const timeZoneIdentifier = GetCanonicalTimeZoneIdentifier(timeZoneIdentifierParam);
    CreateSlots(this);
    SetSlot(this, TIMEZONE_ID, timeZoneIdentifier);
    {
      Object.defineProperty(this, "_repr_", {
        value: `${this[Symbol.toStringTag]} <${timeZoneIdentifier}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get id() {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    return ToString(this);
  }
  getOffsetNanosecondsFor(instantParam) {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    const instant2 = ToTemporalInstant(instantParam);
    const id = GetSlot(this, TIMEZONE_ID);
    if (TestTimeZoneOffsetString(id)) {
      return ParseTimeZoneOffsetString(id);
    }
    return GetIANATimeZoneOffsetNanoseconds(GetSlot(instant2, EPOCHNANOSECONDS), id);
  }
  getOffsetStringFor(instantParam) {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    const instant2 = ToTemporalInstant(instantParam);
    return BuiltinTimeZoneGetOffsetStringFor(this, instant2);
  }
  getPlainDateTimeFor(instantParam, calendarParam = GetISO8601Calendar()) {
    const instant2 = ToTemporalInstant(instantParam);
    const calendar2 = ToTemporalCalendar(calendarParam);
    return BuiltinTimeZoneGetPlainDateTimeFor(this, instant2, calendar2);
  }
  getInstantFor(dateTimeParam, optionsParam = void 0) {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    const dateTime2 = ToTemporalDateTime(dateTimeParam);
    const options = GetOptionsObject(optionsParam);
    const disambiguation = ToTemporalDisambiguation(options);
    return BuiltinTimeZoneGetInstantFor(this, dateTime2, disambiguation);
  }
  getPossibleInstantsFor(dateTimeParam) {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    const dateTime2 = ToTemporalDateTime(dateTimeParam);
    const Instant2 = GetIntrinsic("%Temporal.Instant%");
    const id = GetSlot(this, TIMEZONE_ID);
    if (TestTimeZoneOffsetString(id)) {
      const epochNs = GetEpochFromISOParts(GetSlot(dateTime2, ISO_YEAR), GetSlot(dateTime2, ISO_MONTH), GetSlot(dateTime2, ISO_DAY), GetSlot(dateTime2, ISO_HOUR), GetSlot(dateTime2, ISO_MINUTE), GetSlot(dateTime2, ISO_SECOND), GetSlot(dateTime2, ISO_MILLISECOND), GetSlot(dateTime2, ISO_MICROSECOND), GetSlot(dateTime2, ISO_NANOSECOND));
      if (epochNs === null)
        throw new RangeError("DateTime outside of supported range");
      const offsetNs = ParseTimeZoneOffsetString(id);
      return [new Instant2(JSBI.subtract(epochNs, JSBI.BigInt(offsetNs)))];
    }
    const possibleEpochNs = GetIANATimeZoneEpochValue(id, GetSlot(dateTime2, ISO_YEAR), GetSlot(dateTime2, ISO_MONTH), GetSlot(dateTime2, ISO_DAY), GetSlot(dateTime2, ISO_HOUR), GetSlot(dateTime2, ISO_MINUTE), GetSlot(dateTime2, ISO_SECOND), GetSlot(dateTime2, ISO_MILLISECOND), GetSlot(dateTime2, ISO_MICROSECOND), GetSlot(dateTime2, ISO_NANOSECOND));
    return possibleEpochNs.map((ns) => new Instant2(ns));
  }
  getNextTransition(startingPointParam) {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    const startingPoint = ToTemporalInstant(startingPointParam);
    const id = GetSlot(this, TIMEZONE_ID);
    if (TestTimeZoneOffsetString(id) || id === "UTC") {
      return null;
    }
    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Instant2 = GetIntrinsic("%Temporal.Instant%");
    epochNanoseconds = GetIANATimeZoneNextTransition(epochNanoseconds, id);
    return epochNanoseconds === null ? null : new Instant2(epochNanoseconds);
  }
  getPreviousTransition(startingPointParam) {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    const startingPoint = ToTemporalInstant(startingPointParam);
    const id = GetSlot(this, TIMEZONE_ID);
    if (TestTimeZoneOffsetString(id) || id === "UTC") {
      return null;
    }
    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Instant2 = GetIntrinsic("%Temporal.Instant%");
    epochNanoseconds = GetIANATimeZonePreviousTransition(epochNanoseconds, id);
    return epochNanoseconds === null ? null : new Instant2(epochNanoseconds);
  }
  toString() {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    return ToString(GetSlot(this, TIMEZONE_ID));
  }
  toJSON() {
    if (!IsTemporalTimeZone(this))
      throw new TypeError("invalid receiver");
    return ToString(this);
  }
  static from(item) {
    return ToTemporalTimeZone(item);
  }
}
MakeIntrinsicClass(TimeZone, "Temporal.TimeZone");
const ObjectCreate = Object.create;
const DISALLOWED_UNITS = [
  "week",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond",
  "microsecond",
  "nanosecond"
];
class PlainYearMonth {
  constructor(isoYearParam, isoMonthParam, calendarParam = GetISO8601Calendar(), referenceISODayParam = 1) {
    const isoYear = ToIntegerThrowOnInfinity(isoYearParam);
    const isoMonth = ToIntegerThrowOnInfinity(isoMonthParam);
    const calendar2 = ToTemporalCalendar(calendarParam);
    const referenceISODay = ToIntegerThrowOnInfinity(referenceISODayParam);
    if (arguments.length < 2) {
      throw new RangeError("missing argument: isoYear and isoMonth are required");
    }
    CreateTemporalYearMonthSlots(this, isoYear, isoMonth, calendar2, referenceISODay);
  }
  get year() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get calendar() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalYearMonthLike, optionsParam = void 0) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(temporalYearMonthLike)) {
      throw new TypeError("invalid argument");
    }
    RejectObjectWithCalendarOrTimeZone(temporalYearMonthLike);
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["month", "monthCode", "year"]);
    const props = ToPartialRecord(temporalYearMonthLike, fieldNames);
    if (!props) {
      throw new TypeError("invalid year-month-like");
    }
    let fields = ToTemporalYearMonthFields(this, fieldNames);
    fields = CalendarMergeFields(calendar2, fields, props);
    fields = ToTemporalYearMonthFields(fields, fieldNames);
    const options = GetOptionsObject(optionsParam);
    return YearMonthFromFields(calendar2, fields, options);
  }
  add(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    ({ days } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, "day"));
    const options = GetOptionsObject(optionsParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const fields = ToTemporalYearMonthFields(this, fieldNames);
    const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? ToPositiveInteger(CalendarDaysInMonth(calendar2, this)) : 1;
    const startDate = DateFromFields(calendar2, __spreadProps(__spreadValues({}, fields), { day }));
    const optionsCopy = __spreadValues({}, options);
    const addedDate = CalendarDateAdd(calendar2, startDate, __spreadProps(__spreadValues({}, duration2), { days }), options);
    const addedDateFields = ToTemporalYearMonthFields(addedDate, fieldNames);
    return YearMonthFromFields(calendar2, addedDateFields, optionsCopy);
  }
  subtract(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    let duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    duration2 = {
      years: -duration2.years,
      months: -duration2.months,
      weeks: -duration2.weeks,
      days: -duration2.days,
      hours: -duration2.hours,
      minutes: -duration2.minutes,
      seconds: -duration2.seconds,
      milliseconds: -duration2.milliseconds,
      microseconds: -duration2.microseconds,
      nanoseconds: -duration2.nanoseconds
    };
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    ({ days } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, "day"));
    const options = GetOptionsObject(optionsParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const fields = ToTemporalYearMonthFields(this, fieldNames);
    const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? ToPositiveInteger(CalendarDaysInMonth(calendar2, this)) : 1;
    const startDate = DateFromFields(calendar2, __spreadProps(__spreadValues({}, fields), { day }));
    const optionsCopy = __spreadValues({}, options);
    const addedDate = CalendarDateAdd(calendar2, startDate, __spreadProps(__spreadValues({}, duration2), { days }), options);
    const addedDateFields = ToTemporalYearMonthFields(addedDate, fieldNames);
    return YearMonthFromFields(calendar2, addedDateFields, optionsCopy);
  }
  until(otherParam, optionsParam = void 0) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalYearMonth(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarID2 = ToString(calendar2);
    const otherCalendarID = ToString(otherCalendar);
    if (calendarID2 !== otherCalendarID) {
      throw new RangeError(`cannot compute difference between months of ${calendarID2} and ${otherCalendarID} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "month", DISALLOWED_UNITS);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS, "year");
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, void 0, false);
    const fieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const otherFields = ToTemporalYearMonthFields(other, fieldNames);
    const thisFields = ToTemporalYearMonthFields(this, fieldNames);
    const otherDate = DateFromFields(calendar2, __spreadProps(__spreadValues({}, otherFields), { day: 1 }));
    const thisDate = DateFromFields(calendar2, __spreadProps(__spreadValues({}, thisFields), { day: 1 }));
    const untilOptions = __spreadProps(__spreadValues({}, options), { largestUnit });
    const result = CalendarDateUntil(calendar2, thisDate, otherDate, untilOptions);
    if (smallestUnit === "month" && roundingIncrement === 1)
      return result;
    let { years, months } = result;
    ({ years, months } = RoundDuration(years, months, 0, 0, 0, 0, 0, 0, 0, 0, roundingIncrement, smallestUnit, roundingMode, thisDate));
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(years, months, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  since(otherParam, optionsParam = void 0) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalYearMonth(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarID2 = ToString(calendar2);
    const otherCalendarID = ToString(otherCalendar);
    if (calendarID2 !== otherCalendarID) {
      throw new RangeError(`cannot compute difference between months of ${calendarID2} and ${otherCalendarID} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "month", DISALLOWED_UNITS);
    const largestUnit = ToLargestTemporalUnit(options, "auto", DISALLOWED_UNITS, "year");
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalRoundingIncrement(options, void 0, false);
    const fieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const otherFields = ToTemporalYearMonthFields(other, fieldNames);
    const thisFields = ToTemporalYearMonthFields(this, fieldNames);
    const otherDate = DateFromFields(calendar2, __spreadProps(__spreadValues({}, otherFields), { day: 1 }));
    const thisDate = DateFromFields(calendar2, __spreadProps(__spreadValues({}, thisFields), { day: 1 }));
    const untilOptions = __spreadProps(__spreadValues({}, options), { largestUnit });
    let { years, months } = CalendarDateUntil(calendar2, thisDate, otherDate, untilOptions);
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    if (smallestUnit === "month" && roundingIncrement === 1) {
      return new Duration2(-years, -months, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    ({ years, months } = RoundDuration(years, months, 0, 0, 0, 0, 0, 0, 0, 0, roundingIncrement, smallestUnit, NegateTemporalRoundingMode(roundingMode), thisDate));
    return new Duration2(-years, -months, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  equals(otherParam) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalYearMonth(otherParam);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2)
        return false;
    }
    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    const showCalendar = ToShowCalendarOption(options);
    return TemporalYearMonthToString(this, showCalendar);
  }
  toJSON() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return TemporalYearMonthToString(this);
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainYearMonth");
  }
  toPlainDate(item) {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(item))
      throw new TypeError("argument should be an object");
    const calendar2 = GetSlot(this, CALENDAR);
    const receiverFieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const fields = ToTemporalYearMonthFields(this, receiverFieldNames);
    const inputFieldNames = CalendarFields(calendar2, ["day"]);
    const inputEntries = [["day"]];
    inputFieldNames.forEach((fieldName) => {
      if (!inputEntries.some(([name]) => name === fieldName)) {
        inputEntries.push([
          fieldName,
          void 0
        ]);
      }
    });
    const inputFields = PrepareTemporalFields(item, inputEntries);
    let mergedFields = CalendarMergeFields(calendar2, fields, inputFields);
    const mergedFieldNames = [.../* @__PURE__ */ new Set([...receiverFieldNames, ...inputFieldNames])];
    const mergedEntries = [];
    mergedFieldNames.forEach((fieldName) => {
      if (!mergedEntries.some(([name]) => name === fieldName)) {
        mergedEntries.push([fieldName, void 0]);
      }
    });
    mergedFields = PrepareTemporalFields(mergedFields, mergedEntries);
    const options = ObjectCreate(null);
    options.overflow = "reject";
    return DateFromFields(calendar2, mergedFields, options);
  }
  getISOFields() {
    if (!IsTemporalYearMonth(this))
      throw new TypeError("invalid receiver");
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, optionsParam = void 0) {
    const options = GetOptionsObject(optionsParam);
    if (IsTemporalYearMonth(item)) {
      ToTemporalOverflow(options);
      return CreateTemporalYearMonth(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, CALENDAR), GetSlot(item, ISO_DAY));
    }
    return ToTemporalYearMonth(item, options);
  }
  static compare(oneParam, twoParam) {
    const one = ToTemporalYearMonth(oneParam);
    const two = ToTemporalYearMonth(twoParam);
    return CompareISODate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY));
  }
}
MakeIntrinsicClass(PlainYearMonth, "Temporal.PlainYearMonth");
const ArrayPrototypePush = Array.prototype.push;
class ZonedDateTime {
  constructor(epochNanosecondsParam, timeZoneParam, calendarParam = GetISO8601Calendar()) {
    if (arguments.length < 1) {
      throw new TypeError("missing argument: epochNanoseconds is required");
    }
    const epochNanoseconds = ToBigInt(epochNanosecondsParam);
    const timeZone2 = ToTemporalTimeZone(timeZoneParam);
    const calendar2 = ToTemporalCalendar(calendarParam);
    CreateTemporalZonedDateTimeSlots(this, epochNanoseconds, timeZone2, calendar2);
  }
  get calendar() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, CALENDAR);
  }
  get timeZone() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(this, TIME_ZONE);
  }
  get year() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get month() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarMonth(GetSlot(this, CALENDAR), dateTime(this));
  }
  get monthCode() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthCode(GetSlot(this, CALENDAR), dateTime(this));
  }
  get day() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDay(GetSlot(this, CALENDAR), dateTime(this));
  }
  get hour() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(dateTime(this), ISO_HOUR);
  }
  get minute() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(dateTime(this), ISO_MINUTE);
  }
  get second() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(dateTime(this), ISO_SECOND);
  }
  get millisecond() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(dateTime(this), ISO_MILLISECOND);
  }
  get microsecond() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(dateTime(this), ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetSlot(dateTime(this), ISO_NANOSECOND);
  }
  get era() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarEra(GetSlot(this, CALENDAR), dateTime(this));
  }
  get eraYear() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarEraYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get epochSeconds() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return JSBI.toNumber(JSBI.divide(value, BILLION));
  }
  get epochMilliseconds() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return JSBI.toNumber(JSBI.divide(value, MILLION));
  }
  get epochMicroseconds() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return ToBigIntExternal(JSBI.divide(value, THOUSAND));
  }
  get epochNanoseconds() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return ToBigIntExternal(GetSlot(this, EPOCHNANOSECONDS));
  }
  get dayOfWeek() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDayOfWeek(GetSlot(this, CALENDAR), dateTime(this));
  }
  get dayOfYear() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDayOfYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get weekOfYear() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarWeekOfYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get hoursInDay() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const dt = dateTime(this);
    const DateTime = GetIntrinsic("%Temporal.PlainDateTime%");
    const year = GetSlot(dt, ISO_YEAR);
    const month = GetSlot(dt, ISO_MONTH);
    const day = GetSlot(dt, ISO_DAY);
    const today = new DateTime(year, month, day, 0, 0, 0, 0, 0, 0);
    const tomorrowFields = AddISODate(year, month, day, 0, 0, 0, 1, "reject");
    const tomorrow = new DateTime(tomorrowFields.year, tomorrowFields.month, tomorrowFields.day, 0, 0, 0, 0, 0, 0);
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const todayNs = GetSlot(BuiltinTimeZoneGetInstantFor(timeZone2, today, "compatible"), EPOCHNANOSECONDS);
    const tomorrowNs = GetSlot(BuiltinTimeZoneGetInstantFor(timeZone2, tomorrow, "compatible"), EPOCHNANOSECONDS);
    return JSBI.toNumber(JSBI.subtract(tomorrowNs, todayNs)) / 36e11;
  }
  get daysInWeek() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInWeek(GetSlot(this, CALENDAR), dateTime(this));
  }
  get daysInMonth() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInMonth(GetSlot(this, CALENDAR), dateTime(this));
  }
  get daysInYear() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarDaysInYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get monthsInYear() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarMonthsInYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get inLeapYear() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return CalendarInLeapYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get offset() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return BuiltinTimeZoneGetOffsetStringFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  get offsetNanoseconds() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  with(temporalZonedDateTimeLike, optionsParam = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    if (!IsObject(temporalZonedDateTimeLike)) {
      throw new TypeError("invalid zoned-date-time-like");
    }
    RejectObjectWithCalendarOrTimeZone(temporalZonedDateTimeLike);
    const options = GetOptionsObject(optionsParam);
    const disambiguation = ToTemporalDisambiguation(options);
    const offset2 = ToTemporalOffset(options, "prefer");
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, [
      "day",
      "hour",
      "microsecond",
      "millisecond",
      "minute",
      "month",
      "monthCode",
      "nanosecond",
      "second",
      "year"
    ]);
    ArrayPrototypePush.call(fieldNames, "offset");
    const props = ToPartialRecord(temporalZonedDateTimeLike, fieldNames);
    if (!props) {
      throw new TypeError("invalid zoned-date-time-like");
    }
    const entries = [
      ["day", void 0],
      ["hour", 0],
      ["microsecond", 0],
      ["millisecond", 0],
      ["minute", 0],
      ["month", void 0],
      ["monthCode", void 0],
      ["nanosecond", 0],
      ["second", 0],
      ["year", void 0],
      ["offset"],
      ["timeZone"]
    ];
    fieldNames.forEach((fieldName) => {
      if (!entries.some(([name]) => name === fieldName)) {
        entries.push([fieldName, void 0]);
      }
    });
    let fields = PrepareTemporalFields(this, entries);
    fields = CalendarMergeFields(calendar2, fields, props);
    fields = PrepareTemporalFields(fields, entries);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(calendar2, fields, options);
    const offsetNs = ParseTimeZoneOffsetString(fields.offset);
    const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, "option", offsetNs, timeZone2, disambiguation, offset2, false);
    return CreateTemporalZonedDateTime(epochNanoseconds, GetSlot(this, TIME_ZONE), calendar2);
  }
  withPlainDate(temporalDateParam) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const temporalDate = ToTemporalDate(temporalDateParam);
    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    let calendar2 = GetSlot(temporalDate, CALENDAR);
    const thisDt = dateTime(this);
    const hour = GetSlot(thisDt, ISO_HOUR);
    const minute = GetSlot(thisDt, ISO_MINUTE);
    const second = GetSlot(thisDt, ISO_SECOND);
    const millisecond = GetSlot(thisDt, ISO_MILLISECOND);
    const microsecond = GetSlot(thisDt, ISO_MICROSECOND);
    const nanosecond = GetSlot(thisDt, ISO_NANOSECOND);
    calendar2 = ConsolidateCalendars(GetSlot(this, CALENDAR), calendar2);
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const PlainDateTime2 = GetIntrinsic("%Temporal.PlainDateTime%");
    const dt = new PlainDateTime2(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
    const instant2 = BuiltinTimeZoneGetInstantFor(timeZone2, dt, "compatible");
    return CreateTemporalZonedDateTime(GetSlot(instant2, EPOCHNANOSECONDS), timeZone2, calendar2);
  }
  withPlainTime(temporalTimeParam = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const PlainTime2 = GetIntrinsic("%Temporal.PlainTime%");
    const temporalTime = temporalTimeParam == void 0 ? new PlainTime2() : ToTemporalTime(temporalTimeParam);
    const thisDt = dateTime(this);
    const year = GetSlot(thisDt, ISO_YEAR);
    const month = GetSlot(thisDt, ISO_MONTH);
    const day = GetSlot(thisDt, ISO_DAY);
    const calendar2 = GetSlot(this, CALENDAR);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const PlainDateTime2 = GetIntrinsic("%Temporal.PlainDateTime%");
    const dt = new PlainDateTime2(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar2);
    const instant2 = BuiltinTimeZoneGetInstantFor(timeZone2, dt, "compatible");
    return CreateTemporalZonedDateTime(GetSlot(instant2, EPOCHNANOSECONDS), timeZone2, calendar2);
  }
  withTimeZone(timeZoneParam) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const timeZone2 = ToTemporalTimeZone(timeZoneParam);
    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone2, GetSlot(this, CALENDAR));
  }
  withCalendar(calendarParam) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const calendar2 = ToTemporalCalendar(calendarParam);
    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), calendar2);
  }
  add(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    const options = GetOptionsObject(optionsParam);
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const calendar2 = GetSlot(this, CALENDAR);
    const epochNanoseconds = AddZonedDateTime(GetSlot(this, INSTANT), timeZone2, calendar2, years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, options);
    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone2, calendar2);
  }
  subtract(temporalDurationLike, optionsParam = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const duration2 = ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration2;
    const options = GetOptionsObject(optionsParam);
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const calendar2 = GetSlot(this, CALENDAR);
    const epochNanoseconds = AddZonedDateTime(GetSlot(this, INSTANT), timeZone2, calendar2, -years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds, options);
    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone2, calendar2);
  }
  until(otherParam, optionsParam = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalZonedDateTime(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ToString(calendar2);
    const otherCalendarId = ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond");
    const defaultLargestUnit = LargerOfTwoTemporalUnits("hour", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", [], defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const roundingIncrement = ToTemporalDateTimeRoundingIncrement(options, smallestUnit);
    const ns1 = GetSlot(this, EPOCHNANOSECONDS);
    const ns2 = GetSlot(other, EPOCHNANOSECONDS);
    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (largestUnit !== "year" && largestUnit !== "month" && largestUnit !== "week" && largestUnit !== "day") {
      years = 0;
      months = 0;
      weeks = 0;
      days = 0;
      ({ seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(ns1, ns2, roundingIncrement, smallestUnit, roundingMode));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, 0, 0, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    } else {
      const timeZone2 = GetSlot(this, TIME_ZONE);
      if (!TimeZoneEquals(timeZone2, GetSlot(other, TIME_ZONE))) {
        throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' or smaller because day lengths can vary between time zones due to DST or time zone offset changes.");
      }
      const untilOptions = __spreadProps(__spreadValues({}, options), { largestUnit });
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceZonedDateTime(ns1, ns2, timeZone2, calendar2, largestUnit, untilOptions));
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, this));
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = AdjustRoundedDurationDays(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, this));
    }
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(otherParam, optionsParam = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalZonedDateTime(otherParam);
    const calendar2 = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ToString(calendar2);
    const otherCalendarId = ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    const options = GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, "nanosecond");
    const defaultLargestUnit = LargerOfTwoTemporalUnits("hour", smallestUnit);
    const largestUnit = ToLargestTemporalUnit(options, "auto", [], defaultLargestUnit);
    ValidateTemporalUnitRange(largestUnit, smallestUnit);
    let roundingMode = ToTemporalRoundingMode(options, "trunc");
    roundingMode = NegateTemporalRoundingMode(roundingMode);
    const roundingIncrement = ToTemporalDateTimeRoundingIncrement(options, smallestUnit);
    const ns1 = GetSlot(this, EPOCHNANOSECONDS);
    const ns2 = GetSlot(other, EPOCHNANOSECONDS);
    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (largestUnit !== "year" && largestUnit !== "month" && largestUnit !== "week" && largestUnit !== "day") {
      years = 0;
      months = 0;
      weeks = 0;
      days = 0;
      ({ seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(ns1, ns2, roundingIncrement, smallestUnit, roundingMode));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(0, 0, 0, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
    } else {
      const timeZone2 = GetSlot(this, TIME_ZONE);
      if (!TimeZoneEquals(timeZone2, GetSlot(other, TIME_ZONE))) {
        throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' or smaller because day lengths can vary between time zones due to DST or time zone offset changes.");
      }
      const untilOptions = __spreadProps(__spreadValues({}, options), { largestUnit });
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceZonedDateTime(ns1, ns2, timeZone2, calendar2, largestUnit, untilOptions));
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, this));
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = AdjustRoundedDurationDays(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, this));
    }
    const Duration2 = GetIntrinsic("%Temporal.Duration%");
    return new Duration2(-years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds);
  }
  round(optionsParam) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    if (optionsParam === void 0)
      throw new TypeError("options parameter is required");
    const options = typeof optionsParam === "string" ? CreateOnePropObject("smallestUnit", optionsParam) : GetOptionsObject(optionsParam);
    const smallestUnit = ToSmallestTemporalUnit(options, void 0, ["year", "month", "week"]);
    if (smallestUnit === void 0)
      throw new RangeError("smallestUnit is required");
    const roundingMode = ToTemporalRoundingMode(options, "halfExpand");
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1e3,
      microsecond: 1e3,
      nanosecond: 1e3
    };
    const roundingIncrement = ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
    const dt = dateTime(this);
    let year = GetSlot(dt, ISO_YEAR);
    let month = GetSlot(dt, ISO_MONTH);
    let day = GetSlot(dt, ISO_DAY);
    let hour = GetSlot(dt, ISO_HOUR);
    let minute = GetSlot(dt, ISO_MINUTE);
    let second = GetSlot(dt, ISO_SECOND);
    let millisecond = GetSlot(dt, ISO_MILLISECOND);
    let microsecond = GetSlot(dt, ISO_MICROSECOND);
    let nanosecond = GetSlot(dt, ISO_NANOSECOND);
    const DateTime = GetIntrinsic("%Temporal.PlainDateTime%");
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const calendar2 = GetSlot(this, CALENDAR);
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
    const instantStart = BuiltinTimeZoneGetInstantFor(timeZone2, dtStart, "compatible");
    const endNs = AddZonedDateTime(instantStart, timeZone2, calendar2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
    const dayLengthNs = JSBI.subtract(endNs, JSBI.BigInt(GetSlot(instantStart, EPOCHNANOSECONDS)));
    if (JSBI.equal(dayLengthNs, ZERO)) {
      throw new RangeError("cannot round a ZonedDateTime in a calendar with zero-length days");
    }
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode, JSBI.toNumber(dayLengthNs)));
    const offsetNs = GetOffsetNanosecondsFor(timeZone2, GetSlot(this, INSTANT));
    const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, "option", offsetNs, timeZone2, "compatible", "prefer", false);
    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone2, GetSlot(this, CALENDAR));
  }
  equals(otherParam) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const other = ToTemporalZonedDateTime(otherParam);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    if (!JSBI.equal(JSBI.BigInt(one), JSBI.BigInt(two)))
      return false;
    if (!TimeZoneEquals(GetSlot(this, TIME_ZONE), GetSlot(other, TIME_ZONE)))
      return false;
    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(optionsParam = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const options = GetOptionsObject(optionsParam);
    const { precision, unit, increment } = ToSecondsStringPrecision(options);
    const roundingMode = ToTemporalRoundingMode(options, "trunc");
    const showCalendar = ToShowCalendarOption(options);
    const showTimeZone = ToShowTimeZoneNameOption(options);
    const showOffset = ToShowOffsetOption(options);
    return TemporalZonedDateTimeToString(this, precision, showCalendar, showTimeZone, showOffset, {
      unit,
      increment,
      roundingMode
    });
  }
  toLocaleString(locales = void 0, options = void 0) {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return new DateTimeFormat(locales, options).format(this);
  }
  toJSON() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return TemporalZonedDateTimeToString(this, "auto");
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.ZonedDateTime");
  }
  startOfDay() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const dt = dateTime(this);
    const DateTime = GetIntrinsic("%Temporal.PlainDateTime%");
    const calendar2 = GetSlot(this, CALENDAR);
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0, calendar2);
    const timeZone2 = GetSlot(this, TIME_ZONE);
    const instant2 = BuiltinTimeZoneGetInstantFor(timeZone2, dtStart, "compatible");
    return CreateTemporalZonedDateTime(GetSlot(instant2, EPOCHNANOSECONDS), timeZone2, calendar2);
  }
  toInstant() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const TemporalInstant = GetIntrinsic("%Temporal.Instant%");
    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
  }
  toPlainDate() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return TemporalDateTimeToDate(dateTime(this));
  }
  toPlainTime() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return TemporalDateTimeToTime(dateTime(this));
  }
  toPlainDateTime() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    return dateTime(this);
  }
  toPlainYearMonth() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["monthCode", "year"]);
    const fields = ToTemporalYearMonthFields(this, fieldNames);
    return YearMonthFromFields(calendar2, fields);
  }
  toPlainMonthDay() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const calendar2 = GetSlot(this, CALENDAR);
    const fieldNames = CalendarFields(calendar2, ["day", "monthCode"]);
    const fields = ToTemporalMonthDayFields(this, fieldNames);
    return MonthDayFromFields(calendar2, fields);
  }
  getISOFields() {
    if (!IsTemporalZonedDateTime(this))
      throw new TypeError("invalid receiver");
    const dt = dateTime(this);
    const tz = GetSlot(this, TIME_ZONE);
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(dt, ISO_DAY),
      isoHour: GetSlot(dt, ISO_HOUR),
      isoMicrosecond: GetSlot(dt, ISO_MICROSECOND),
      isoMillisecond: GetSlot(dt, ISO_MILLISECOND),
      isoMinute: GetSlot(dt, ISO_MINUTE),
      isoMonth: GetSlot(dt, ISO_MONTH),
      isoNanosecond: GetSlot(dt, ISO_NANOSECOND),
      isoSecond: GetSlot(dt, ISO_SECOND),
      isoYear: GetSlot(dt, ISO_YEAR),
      offset: BuiltinTimeZoneGetOffsetStringFor(tz, GetSlot(this, INSTANT)),
      timeZone: tz
    };
  }
  static from(item, optionsParam = void 0) {
    const options = GetOptionsObject(optionsParam);
    if (IsTemporalZonedDateTime(item)) {
      ToTemporalOverflow(options);
      ToTemporalDisambiguation(options);
      ToTemporalOffset(options, "reject");
      return CreateTemporalZonedDateTime(GetSlot(item, EPOCHNANOSECONDS), GetSlot(item, TIME_ZONE), GetSlot(item, CALENDAR));
    }
    return ToTemporalZonedDateTime(item, options);
  }
  static compare(oneParam, twoParam) {
    const one = ToTemporalZonedDateTime(oneParam);
    const two = ToTemporalZonedDateTime(twoParam);
    const ns1 = GetSlot(one, EPOCHNANOSECONDS);
    const ns2 = GetSlot(two, EPOCHNANOSECONDS);
    if (JSBI.lessThan(JSBI.BigInt(ns1), JSBI.BigInt(ns2)))
      return -1;
    if (JSBI.greaterThan(JSBI.BigInt(ns1), JSBI.BigInt(ns2)))
      return 1;
    return 0;
  }
}
MakeIntrinsicClass(ZonedDateTime, "Temporal.ZonedDateTime");
function dateTime(zdt) {
  return BuiltinTimeZoneGetPlainDateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, INSTANT), GetSlot(zdt, CALENDAR));
}
var temporal = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Instant,
  Calendar,
  PlainDate,
  PlainDateTime,
  Duration,
  PlainMonthDay,
  Now,
  PlainTime,
  TimeZone,
  PlainYearMonth,
  ZonedDateTime
});
function toTemporalInstant() {
  const epochNanoseconds = JSBI.multiply(JSBI.BigInt(+this), MILLION);
  return new Instant(ToBigInt(epochNanoseconds));
}
const types = [
  Instant,
  Calendar,
  PlainDate,
  PlainDateTime,
  Duration,
  PlainMonthDay,
  PlainTime,
  TimeZone,
  PlainYearMonth,
  ZonedDateTime
];
for (const type of types) {
  const descriptor2 = Object.getOwnPropertyDescriptor(type, "prototype");
  if (descriptor2.configurable || descriptor2.enumerable || descriptor2.writable) {
    descriptor2.configurable = false;
    descriptor2.enumerable = false;
    descriptor2.writable = false;
    Object.defineProperty(type, "prototype", descriptor2);
  }
}
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const defineComponent = window["Vue"].defineComponent;
const onMounted = window["Vue"].onMounted;
const ref = window["Vue"].ref;
const watch = window["Vue"].watch;
const useField = window["Components"].useField;
const VDropdown = window["Components"].VDropdown;
const VDropdownButton = window["Components"].VDropdownButton;
const VDropdownItems = window["Components"].VDropdownItems;
const VDropdownItem = window["Components"].VDropdownItem;
const VTabs = window["Components"].VTabs;
const VTabsList = window["Components"].VTabsList;
const VTabItem = window["Components"].VTabItem;
const VTabsPanels = window["Components"].VTabsPanels;
const VTabsPanel = window["Components"].VTabsPanel;
const VFormInput = window["Components"].VFormInput;
const VFormSelect = window["Components"].VFormSelect;
const _sfc_main = defineComponent({
  components: {
    VDropdown,
    VDropdownButton,
    VDropdownItems,
    VDropdownItem,
    VTabs,
    VTabsList,
    VTabItem,
    VTabsPanels,
    VTabsPanel,
    VFormInput,
    VFormSelect
  },
  setup() {
    const { state, onChange } = useField();
    const data = ref((() => {
      try {
        return JSON.parse(state.value);
      } catch {
        return {
          version: 1,
          start: 0,
          ending: null,
          frequency: null
        };
      }
    })());
    const formatted = ref("");
    const start = ref("");
    const frequency = ref("");
    const nextDate = (start2, frequency2) => {
      if (!start2 || !frequency2) {
        return null;
      }
      let date = new temporal.Instant(BigInt(start2) * BigInt(1e6)).toZonedDateTimeISO(temporal.Now.timeZone()).toPlainDate();
      if (["days", "weeks", "months", "years"].includes(frequency2)) {
        while (temporal.PlainDate.compare(date, temporal.Now.plainDateISO()) < 0) {
          date = date.add(temporal.Duration.from({ [frequency2]: 1 }));
        }
      }
      return date;
    };
    watch(() => frequency.value, () => {
      saveData();
      updateFormat();
    });
    watch(() => start.value, () => {
      saveData();
      updateFormat();
    });
    onMounted(() => {
      frequency.value = data.value.frequency;
      start.value = new temporal.Instant(BigInt(data.value.start) * BigInt(1e6)).toZonedDateTimeISO(temporal.Now.timeZone()).toPlainDate().toString();
    });
    function saveData() {
      if (typeof data.value !== "object") {
        data.value = { version: 1, start: 0, ending: null, frequency: "days" };
      }
      data.value.start = new Date(start.value).getTime();
      if (["days", "weeks", "months", "years"].includes(frequency.value)) {
        data.value.frequency = frequency.value;
      } else {
        data.value.frequency = null;
      }
      state.value = JSON.stringify(data.value);
      onChange();
    }
    function updateFormat() {
      var _a;
      if (!data.value.start || !["days", "weeks", "months", "years"].includes((_a = data.value.frequency) != null ? _a : "")) {
        return "-";
      }
      let formatter = new intl.DateTimeFormat(void 0, {
        day: "numeric",
        weekday: "short",
        month: "short",
        timeZone: temporal.Now.timeZone()
      });
      let date = nextDate(data.value.start, data.value.frequency);
      if (date) {
        formatted.value = formatter.format(date);
      } else {
        formatted.value = "-";
      }
    }
    return { start, frequency, formatted };
  }
});
const _toDisplayString = window["Vue"].toDisplayString;
const _openBlock = window["Vue"].openBlock;
const _createElementBlock = window["Vue"].createElementBlock;
const _resolveComponent = window["Vue"].resolveComponent;
const _withCtx = window["Vue"].withCtx;
const _createVNode = window["Vue"].createVNode;
const _createElementVNode = window["Vue"].createElementVNode;
const _hoisted_1 = /* @__PURE__ */ _createElementVNode("option", { value: "" }, "Not repeated", -1);
const _hoisted_2 = /* @__PURE__ */ _createElementVNode("option", { value: "days" }, "Daily", -1);
const _hoisted_3 = /* @__PURE__ */ _createElementVNode("option", { value: "weeks" }, "Weekly", -1);
const _hoisted_4 = /* @__PURE__ */ _createElementVNode("option", { value: "months" }, "Monthly", -1);
const _hoisted_5 = /* @__PURE__ */ _createElementVNode("option", { value: "years" }, "Monthly", -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VDropdownButton = _resolveComponent("VDropdownButton");
  const _component_VFormInput = _resolveComponent("VFormInput");
  const _component_VFormSelect = _resolveComponent("VFormSelect");
  const _component_VDropdownItems = _resolveComponent("VDropdownItems");
  const _component_VDropdown = _resolveComponent("VDropdown");
  return _openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_VDropdown, null, {
      default: _withCtx(() => [
        _createVNode(_component_VDropdownButton, { class: "text-sm text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded" }, {
          default: _withCtx(() => [
            (_openBlock(), _createElementBlock("span", { key: _ctx.start }, _toDisplayString(_ctx.formatted), 1))
          ]),
          _: 1
        }),
        _createVNode(_component_VDropdownItems, { align: "bottom-start" }, {
          default: _withCtx(() => [
            _createVNode(_component_VFormInput, {
              type: "date",
              modelValue: _ctx.start,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.start = $event)
            }, null, 8, ["modelValue"]),
            _createVNode(_component_VFormSelect, {
              modelValue: _ctx.frequency,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.frequency = $event),
              class: "mt-2"
            }, {
              default: _withCtx(() => [
                _hoisted_1,
                _hoisted_2,
                _hoisted_3,
                _hoisted_4,
                _hoisted_5
              ]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          _: 1
        })
      ]),
      _: 1
    })
  ]);
}
var Component = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
Date.prototype.toTemporalInstant = toTemporalInstant;
window.Temporal = temporal;
document.addEventListener("taskday:init", () => {
  Taskday.register("date", {
    field: Component
  });
});
