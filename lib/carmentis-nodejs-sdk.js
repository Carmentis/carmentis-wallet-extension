/**
  Licensed under the Apache License, Version 2.0
  (c)2022-2024 Carmentis SAS
  Built 2024-05-29T12:44:31.265Z
  --
  Third party libraries:
  noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com)
*/
let getRandomValues$1;
let digest$1;
let deriveBits$1;
let importKey$2;
let exportKey$2;
let encrypt$2;
let decrypt$2;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$8(cryptoInterface) {
  getRandomValues$1 = cryptoInterface.getRandomValues;
  digest$1          = cryptoInterface.digest;
  cryptoInterface.generateKey;
  deriveBits$1      = cryptoInterface.deriveBits;
  cryptoInterface.deriveKey;
  importKey$2       = cryptoInterface.importKey;
  exportKey$2       = cryptoInterface.exportKey;
  encrypt$2         = cryptoInterface.encrypt;
  decrypt$2         = cryptoInterface.decrypt;
  cryptoInterface.sign;
  cryptoInterface.verify;
  cryptoInterface.secp256k1;
}

const POSITIVE = 0;

// ============================================================================================================================ //
//  fromHexaString()                                                                                                            //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Creates a positive BigInt from a hexadecimal string. The input is assumed to match /^[A-F\d]+$/i.                           //
// ============================================================================================================================ //
function fromHexaString(str) {
  let nibble = [ 0 ];

  [...str].forEach((digit, i) => {
    nibble[str.length - i - 1] = parseInt(digit, 16);
  });

  return fromNibbles(nibble);
}

// ============================================================================================================================ //
//  fromNibbles()                                                                                                               //
// ============================================================================================================================ //
function fromNibbles(nibble) {
  let array = new Uint16Array(nibble.length + 3 >> 2);

  for(let i = 0; i < nibble.length; i += 4) {
    array[i >> 2] = nibble[i] | nibble[i + 1] << 4 | nibble[i + 2] << 8 | nibble[i + 3] << 12;
  }

  return {
    value: array,
    sign : POSITIVE
  };
}

let encoder = new TextEncoder();
let decoder = new TextDecoder();

// ============================================================================================================================ //
//  encode()                                                                                                                    //
// ============================================================================================================================ //
function encode$1(str) {
  return encoder.encode(str);
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
function decode$3(array) {
  return decoder.decode(array);
}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const URL    = ALPHA + "-_=";

// ============================================================================================================================ //
//  encodeBinary()                                                                                                              //
// ============================================================================================================================ //
function encodeBinary(bin, alphabet, padding) {
  let r = bin.length % 3,
      acc = 0,
      out = "";

  for(let i = 0; i < bin.length || i % 3;) {
    acc = acc << 8 | bin[i++];

    if(!(i % 3)) {
      for(let j = 4; j--;) {
        out += alphabet[acc >> j * 6 & 0x3F];
      }
      acc = 0;
    }
  }
  return r ? out.slice(0, r - 3) + alphabet[0x40].repeat(padding ? 3 - r : 0) : out;
}

// ============================================================================================================================ //
//  decodeBinary()                                                                                                              //
// ============================================================================================================================ //
function decodeBinary(str, alphabet) {
  let crop = 0,
      acc = 0,
      out = [];

  str += alphabet[0x40].repeat(-str.length & 3);

  for(let i = 0; i < str.length;) {
    let n = alphabet.indexOf(str[i++]);

    crop += n == 0x40;
    acc = acc << 6 | n;

    if(!(i & 3)) {
      out.push(acc >> 16 & 0xFF, acc >> 8 & 0xFF, acc & 0xFF);
    }
  }
  return new Uint8Array(crop ? out.slice(0, -crop) : out);
}

// ============================================================================================================================ //
//  fromKey()                                                                                                                   //
// ============================================================================================================================ //
async function fromKey(key) {
  return await exportKey$2("jwk", key);
}

// ============================================================================================================================ //
//  integerStringToArray()                                                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Converts a JWK-encoded string to an array of bytes.                                                                         //
// ============================================================================================================================ //
function integerStringToArray(str) {
  return new Uint8Array(decodeBinary(str, URL));
}

// ============================================================================================================================ //
//  arrayToIntegerString()                                                                                                         //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Converts an array of bytes to a JWK-encoded string.                                                                         //
// ============================================================================================================================ //
function arrayToIntegerString(arr) {
  return encodeBinary(arr, URL, false);
}

const CTR = {
  NAME        : "AES-CTR",
  ALGORITHM   : "A256CTR",
  KEY_LENGTH  : 256,
  COUNTER_BITS: 64
};

const GCM = {
  NAME      : "AES-GCM",
  ALGORITHM : "A256GCM",
  KEY_LENGTH: 256,
  TAG_LENGTH: 96
};

// ============================================================================================================================ //
//  exportKey()                                                                                                                 //
// ============================================================================================================================ //
async function exportKey$1(key) {
  let jwk = await fromKey(key);

  return integerStringToArray(jwk.k);
}

// ============================================================================================================================ //
//  importGcmKey()                                                                                                              //
// ============================================================================================================================ //
async function importGcmKey(...arg) {
  let key = await importKey$1(GCM, ...arg);

  return key;
}

// ============================================================================================================================ //
//  importKey()                                                                                                                 //
// ============================================================================================================================ //
async function importKey$1(mode, keyArray, extractable = false) {
  let jwk = {
    key_ops: [ "encrypt", "decrypt" ],
    kty    : "oct",
    alg    : mode.ALGORITHM,
    k      : arrayToIntegerString(keyArray)
  };

  let key = await importKey$2(
    "jwk",
    jwk,
    {
      name  : mode.NAME,
      length: mode.KEY_LENGTH
    },
    extractable,
    [ "encrypt", "decrypt" ]
  );

  return key;
}

// ============================================================================================================================ //
//  nonceToIv()                                                                                                                 //
// ============================================================================================================================ //
function nonceToIv(nonce) {
  let iv = new Uint8Array(16);

  if(typeof nonce == "number") {
    iv[7] = nonce;
  }
  else if(nonce instanceof Uint8Array && nonce.length == 8) {
    iv.set(nonce, 0);
  }
  else {
    throw "invalid nonce";
  }

  return iv;
}

// ============================================================================================================================ //
//  encryptGcm()                                                                                                                //
// ============================================================================================================================ //
async function encryptGcm(key, data, iv) {
  return await encrypt$1(
    GCM,
    {
      iv        : iv,
      tagLength : GCM.TAG_LENGTH
    },
    key,
    data
  );
}

// ============================================================================================================================ //
//  encrypt()                                                                                                                   //
// ============================================================================================================================ //
async function encrypt$1(mode, options, key, data) {
  let encrypted = await encrypt$2(
    {
      name: mode.NAME,
      ...options
    },
    key,
    data
  );

  return new Uint8Array(encrypted);
}

// ============================================================================================================================ //
//  decryptGcm()                                                                                                                //
// ============================================================================================================================ //
async function decryptGcm(key, data, iv) {
  return await decrypt$1(
    GCM,
    {
      iv        : iv,
      tagLength : GCM.TAG_LENGTH
    },
    key,
    data
  );
}

// ============================================================================================================================ //
//  decrypt()                                                                                                                   //
// ============================================================================================================================ //
async function decrypt$1(mode, options, key, data) {
  try {
    let decrypted = await decrypt$2(
      {
        name: mode.NAME,
        ...options
      },
      key,
      data
    );
  
    return new Uint8Array(decrypted);
  }
  catch(e) {
    return false;
  }
}

// B parameter of secp256r1
fromHexaString("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B");

// P parameter of secp256r1: 2 ** 256 - 2 ** 224 + 2 ** 192 + 2 ** 96 - 1
fromHexaString("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF");

// ============================================================================================================================ //
//  deriveBitsPbkdf2()                                                                                                          //
// ============================================================================================================================ //
async function deriveBitsPbkdf2(arr, salt, bits, iterations) {
  let keyMaterial = await importKey$2(
    "raw",
    arr,
    "PBKDF2",
    false,
    [ "deriveBits", "deriveKey" ],
  );

  let bytes = await deriveBits$1(
    {
      name      : "PBKDF2",
      salt      : salt,
      iterations: iterations,
      hash      : { name: "SHA-256" }
    },
    keyMaterial,
    bits
  );

  return new Uint8Array(bytes);
}

// ============================================================================================================================ //
//  deriveBitsHkdf()                                                                                                            //
// ============================================================================================================================ //
async function deriveBitsHkdf(arr, salt, info, bits) {
  let keyMaterial = await importKey$2(
    "raw",
    arr,
    "HKDF",
    false,
    [ "deriveBits", "deriveKey" ],
  );

  let bytes = await deriveBits$1(
    {
      name: "HKDF",
      salt: salt,
      info: info,
      hash: { name: "SHA-256" }
    },
    keyMaterial,
    bits
  );

  return new Uint8Array(bytes);
}

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$7(cryptoInterface) {
  initialize$8(cryptoInterface);
}

// ============================================================================================================================ //
//  sha256()                                                                                                                    //
// ============================================================================================================================ //
async function sha256(data) {
  let hash = await digest$1("SHA-256", data);

  return new Uint8Array(hash);
}

// ============================================================================================================================ //
//  getRandomBytes()                                                                                                            //
// ============================================================================================================================ //
function getRandomBytes(size) {
  let arr = new Uint8Array(size);

  return getRandomValues$1(arr);
}

/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const B256 = 2n ** 256n; // secp256k1 is short weierstrass curve
const P = B256 - 0x1000003d1n; // curve's field prime
const N = B256 - 0x14551231950b75fc4402da1732fc9bebfn; // curve (group) order
const Gx = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n; // base point x
const Gy = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n; // base point y
const CURVE = { p: P, n: N, a: 0n, b: 7n, Gx, Gy }; // exported variables incl. a, b
const fLen = 32; // field / group byte length
const crv = (x) => mod(mod(x * x) * x + CURVE.b); // x³ + ax + b weierstrass formula; a=0
const err = (m = '') => { throw new Error(m); }; // error helper, messes-up stack trace
const big = (n) => typeof n === 'bigint'; // is big integer
const str = (s) => typeof s === 'string'; // is string
const fe = (n) => big(n) && 0n < n && n < P; // is field element (invertible)
const ge = (n) => big(n) && 0n < n && n < N; // is group element
const isu8 = (a) => (a instanceof Uint8Array ||
    (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
const au8 = (a, l) => // assert is Uint8Array (of specific length)
 !isu8(a) || (typeof l === 'number' && l > 0 && a.length !== l) ?
    err('Uint8Array expected') : a;
const u8n = (data) => new Uint8Array(data); // creates Uint8Array
const toU8 = (a, len) => au8(str(a) ? h2b(a) : u8n(au8(a)), len); // norm(hex/u8a) to u8a
const mod = (a, b = P) => { let r = a % b; return r >= 0n ? r : b + r; }; // mod division
const isPoint = (p) => (p instanceof Point ? p : err('Point expected')); // is 3d point
class Point {
    constructor(px, py, pz) {
        this.px = px;
        this.py = py;
        this.pz = pz;
    } //3d=less inversions
    static fromAffine(p) {
        return ((p.x === 0n) && (p.y === 0n)) ? Point.ZERO : new Point(p.x, p.y, 1n);
    }
    static fromHex(hex) {
        hex = toU8(hex); // convert hex string to Uint8Array
        let p = undefined;
        const head = hex[0], tail = hex.subarray(1); // first byte is prefix, rest is data
        const x = slcNum(tail, 0, fLen), len = hex.length; // next 32 bytes are x coordinate
        if (len === 33 && [0x02, 0x03].includes(head)) { // compressed points: 33b, start
            if (!fe(x))
                err('Point hex invalid: x not FE'); // with byte 0x02 or 0x03. Check if 0<x<P
            let y = sqrt(crv(x)); // x³ + ax + b is right side of equation
            const isYOdd = (y & 1n) === 1n; // y² is equivalent left-side. Calculate y²:
            const headOdd = (head & 1) === 1; // y = √y²; there are two solutions: y, -y
            if (headOdd !== isYOdd)
                y = mod(-y); // determine proper solution
            p = new Point(x, y, 1n); // create point
        } // Uncompressed points: 65b, start with 0x04
        if (len === 65 && head === 0x04)
            p = new Point(x, slcNum(tail, fLen, 2 * fLen), 1n);
        return p ? p.ok() : err('Point is not on curve'); // Verify the result
    }
    static fromPrivateKey(k) { return G.mul(toPriv(k)); } // Create point from a private key.
    get x() { return this.aff().x; } // .x, .y will call expensive toAffine:
    get y() { return this.aff().y; } // should be used with care.
    equals(other) {
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = isPoint(other); // isPoint() checks class equality
        const X1Z2 = mod(X1 * Z2), X2Z1 = mod(X2 * Z1);
        const Y1Z2 = mod(Y1 * Z2), Y2Z1 = mod(Y2 * Z1);
        return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    negate() { return new Point(this.px, mod(-this.py), this.pz); } // Flip point over y coord
    double() { return this.add(this); } // Point doubling: P+P, complete formula.
    add(other) {
        const { px: X1, py: Y1, pz: Z1 } = this; // free formula from Renes-Costello-Batina
        const { px: X2, py: Y2, pz: Z2 } = isPoint(other); // https://eprint.iacr.org/2015/1060, algo 1
        const { a, b } = CURVE; // Cost: 12M + 0S + 3*a + 3*b3 + 23add
        let X3 = 0n, Y3 = 0n, Z3 = 0n;
        const b3 = mod(b * 3n);
        let t0 = mod(X1 * X2), t1 = mod(Y1 * Y2), t2 = mod(Z1 * Z2), t3 = mod(X1 + Y1); // step 1
        let t4 = mod(X2 + Y2); // step 5
        t3 = mod(t3 * t4);
        t4 = mod(t0 + t1);
        t3 = mod(t3 - t4);
        t4 = mod(X1 + Z1);
        let t5 = mod(X2 + Z2); // step 10
        t4 = mod(t4 * t5);
        t5 = mod(t0 + t2);
        t4 = mod(t4 - t5);
        t5 = mod(Y1 + Z1);
        X3 = mod(Y2 + Z2); // step 15
        t5 = mod(t5 * X3);
        X3 = mod(t1 + t2);
        t5 = mod(t5 - X3);
        Z3 = mod(a * t4);
        X3 = mod(b3 * t2); // step 20
        Z3 = mod(X3 + Z3);
        X3 = mod(t1 - Z3);
        Z3 = mod(t1 + Z3);
        Y3 = mod(X3 * Z3);
        t1 = mod(t0 + t0); // step 25
        t1 = mod(t1 + t0);
        t2 = mod(a * t2);
        t4 = mod(b3 * t4);
        t1 = mod(t1 + t2);
        t2 = mod(t0 - t2); // step 30
        t2 = mod(a * t2);
        t4 = mod(t4 + t2);
        t0 = mod(t1 * t4);
        Y3 = mod(Y3 + t0);
        t0 = mod(t5 * t4); // step 35
        X3 = mod(t3 * X3);
        X3 = mod(X3 - t0);
        t0 = mod(t3 * t1);
        Z3 = mod(t5 * Z3);
        Z3 = mod(Z3 + t0); // step 40
        return new Point(X3, Y3, Z3);
    }
    mul(n, safe = true) {
        if (!safe && n === 0n)
            return I; // in unsafe mode, allow zero
        if (!ge(n))
            err('invalid scalar'); // must be 0 < n < CURVE.n
        if (this.equals(G))
            return wNAF(n).p; // use precomputes for base point
        let p = I, f = G; // init result point & fake point
        for (let d = this; n > 0n; d = d.double(), n >>= 1n) { // double-and-add ladder
            if (n & 1n)
                p = p.add(d); // if bit is present, add to point
            else if (safe)
                f = f.add(d); // if not, add to fake for timing safety
        }
        return p;
    }
    mulAddQUns(R, u1, u2) {
        return this.mul(u1, false).add(R.mul(u2, false)).ok(); // Unsafe: do NOT use for stuff related
    } // to private keys. Doesn't use Shamir trick
    toAffine() {
        const { px: x, py: y, pz: z } = this; // (x, y, z) ∋ (x=x/z, y=y/z)
        if (this.equals(I))
            return { x: 0n, y: 0n }; // fast-path for zero point
        if (z === 1n)
            return { x, y }; // if z is 1, pass affine coordinates as-is
        const iz = inv(z); // z^-1: invert z
        if (mod(z * iz) !== 1n)
            err('invalid inverse'); // (z * z^-1) must be 1, otherwise bad math
        return { x: mod(x * iz), y: mod(y * iz) }; // x = x*z^-1; y = y*z^-1
    }
    assertValidity() {
        const { x, y } = this.aff(); // convert to 2d xy affine point.
        if (!fe(x) || !fe(y))
            err('Point invalid: x or y'); // x and y must be in range 0 < n < P
        return mod(y * y) === crv(x) ? // y² = x³ + ax + b, must be equal
            this : err('Point invalid: not on curve');
    }
    multiply(n) { return this.mul(n); } // Aliases to compress code
    aff() { return this.toAffine(); }
    ok() { return this.assertValidity(); }
    toHex(isCompressed = true) {
        const { x, y } = this.aff(); // convert to 2d xy affine point
        const head = isCompressed ? ((y & 1n) === 0n ? '02' : '03') : '04'; // 0x02, 0x03, 0x04 prefix
        return head + n2h(x) + (isCompressed ? '' : n2h(y)); // prefix||x and ||y
    }
    toRawBytes(isCompressed = true) {
        return h2b(this.toHex(isCompressed)); // re-use toHex(), convert hex to bytes
    }
}
Point.BASE = new Point(Gx, Gy, 1n); // Generator / base point
Point.ZERO = new Point(0n, 1n, 0n); // Identity / zero point
const { BASE: G, ZERO: I } = Point; // Generator, identity points
const padh = (n, pad) => n.toString(16).padStart(pad, '0');
const b2h = (b) => Array.from(b).map(e => padh(e, 2)).join(''); // bytes to hex
const h2b = (hex) => {
    const l = hex.length; // error if not string,
    if (!str(hex) || l % 2)
        err('hex invalid 1'); // or has odd length like 3, 5.
    const arr = u8n(l / 2); // create result array
    for (let i = 0; i < arr.length; i++) {
        const j = i * 2;
        const h = hex.slice(j, j + 2); // hexByte. slice is faster than substr
        const b = Number.parseInt(h, 16); // byte, created from string part
        if (Number.isNaN(b) || b < 0)
            err('hex invalid 2'); // byte must be valid 0 <= byte < 256
        arr[i] = b;
    }
    return arr;
};
const b2n = (b) => BigInt('0x' + (b2h(b) || '0')); // bytes to number
const slcNum = (b, from, to) => b2n(b.slice(from, to)); // slice bytes num
const n2b = (num) => {
    return big(num) && num >= 0n && num < B256 ? h2b(padh(num, 2 * fLen)) : err('bigint expected');
};
const n2h = (num) => b2h(n2b(num)); // number to 32b hex
const concatB = (...arrs) => {
    const r = u8n(arrs.reduce((sum, a) => sum + au8(a).length, 0)); // create u8a of summed length
    let pad = 0; // walk through each array,
    arrs.forEach(a => { r.set(a, pad); pad += a.length; }); // ensure they have proper type
    return r;
};
const inv = (num, md = P) => {
    if (num === 0n || md <= 0n)
        err('no inverse n=' + num + ' mod=' + md); // no neg exponent for now
    let a = mod(num, md), b = md, x = 0n, u = 1n;
    while (a !== 0n) { // uses euclidean gcd algorithm
        const q = b / a, r = b % a; // not constant-time
        const m = x - u * q;
        b = a, a = r, x = u, u = m;
    }
    return b === 1n ? mod(x, md) : err('no inverse'); // b is gcd at this point
};
const sqrt = (n) => {
    let r = 1n; // So, a special, fast case. Paper: "Square Roots from 1;24,51,10 to Dan Shanks".
    for (let num = n, e = (P + 1n) / 4n; e > 0n; e >>= 1n) { // powMod: modular exponentiation.
        if (e & 1n)
            r = (r * num) % P; // Uses exponentiation by squaring.
        num = (num * num) % P; // Not constant-time.
    }
    return mod(r * r) === n ? r : err('sqrt invalid'); // check if result is valid
};
const toPriv = (p) => {
    if (!big(p))
        p = b2n(toU8(p, fLen)); // convert to bigint when bytes
    return ge(p) ? p : err('private key out of range'); // check if bigint is in range
};
const moreThanHalfN = (n) => n > (N >> 1n); // if a number is bigger than CURVE.n/2
const getPublicKey = (privKey, isCompressed = true) => {
    return Point.fromPrivateKey(privKey).toRawBytes(isCompressed); // 33b or 65b output
};
class Signature {
    constructor(r, s, recovery) {
        this.r = r;
        this.s = s;
        this.recovery = recovery;
        this.assertValidity(); // recovery bit is optional when
    } // constructed outside.
    static fromCompact(hex) {
        hex = toU8(hex, 64); // compact repr is (32b r)||(32b s)
        return new Signature(slcNum(hex, 0, fLen), slcNum(hex, fLen, 2 * fLen));
    }
    assertValidity() { return ge(this.r) && ge(this.s) ? this : err(); } // 0 < r or s < CURVE.n
    addRecoveryBit(rec) {
        return new Signature(this.r, this.s, rec);
    }
    hasHighS() { return moreThanHalfN(this.s); }
    normalizeS() {
        return this.hasHighS() ? new Signature(this.r, mod(this.s, N), this.recovery) : this;
    }
    recoverPublicKey(msgh) {
        const { r, s, recovery: rec } = this; // secg.org/sec1-v2.pdf 4.1.6
        if (![0, 1, 2, 3].includes(rec))
            err('recovery id invalid'); // check recovery id
        const h = bits2int_modN(toU8(msgh, fLen)); // Truncate hash
        const radj = rec === 2 || rec === 3 ? r + N : r; // If rec was 2 or 3, q.x is bigger than n
        if (radj >= P)
            err('q.x invalid'); // ensure q.x is still a field element
        const head = (rec & 1) === 0 ? '02' : '03'; // head is 0x02 or 0x03
        const R = Point.fromHex(head + n2h(radj)); // concat head + hex repr of r
        const ir = inv(radj, N); // r^-1
        const u1 = mod(-h * ir, N); // -hr^-1
        const u2 = mod(s * ir, N); // sr^-1
        return G.mulAddQUns(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
    }
    toCompactRawBytes() { return h2b(this.toCompactHex()); } // Uint8Array 64b compact repr
    toCompactHex() { return n2h(this.r) + n2h(this.s); } // hex 64b compact repr
}
const bits2int = (bytes) => {
    const delta = bytes.length * 8 - 256; // RFC suggests optional truncating via bits2octets
    const num = b2n(bytes); // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which
    return delta > 0 ? num >> BigInt(delta) : num; // matches bits2int. bits2int can produce res>N.
};
const bits2int_modN = (bytes) => {
    return mod(bits2int(bytes), N); // with 0: BAD for trunc as per RFC vectors
};
const i2o = (num) => n2b(num); // int to octets
const cr = () => // We support: 1) browsers 2) node.js 19+ 3) deno, other envs with crypto
 typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;
let _hmacSync; // Can be redefined by use in utils; built-ins don't provide it
const optS = { lowS: true }; // opts for sign()
const optV = { lowS: true }; // standard opts for verify()
const prepSig = (msgh, priv, opts = optS) => {
    if (['der', 'recovered', 'canonical'].some(k => k in opts)) // Ban legacy options
        err('sign() legacy options not supported');
    let { lowS } = opts; // generates low-s sigs by default
    if (lowS == null)
        lowS = true; // RFC6979 3.2: we skip step A
    const h1i = bits2int_modN(toU8(msgh)); // msg bigint
    const h1o = i2o(h1i); // msg octets
    const d = toPriv(priv); // validate private key, convert to bigint
    const seed = [i2o(d), h1o]; // Step D of RFC6979 3.2
    let ent = opts.extraEntropy; // RFC6979 3.6: additional k' (optional)
    if (ent) { // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
        if (ent === true)
            ent = etc.randomBytes(fLen); // if true, use CSPRNG to generate data
        const e = toU8(ent); // convert Hex|Bytes to Bytes
        if (e.length !== fLen)
            err(); // Expected 32 bytes of extra data
        seed.push(e);
    }
    const m = h1i; // convert msg to bigint
    const k2sig = (kBytes) => {
        const k = bits2int(kBytes); // RFC6979 method.
        if (!ge(k))
            return; // Check 0 < k < CURVE.n
        const ik = inv(k, N); // k^-1 mod n, NOT mod P
        const q = G.mul(k).aff(); // q = Gk
        const r = mod(q.x, N); // r = q.x mod n
        if (r === 0n)
            return; // r=0 invalid
        const s = mod(ik * mod(m + mod(d * r, N), N), N); // s = k^-1(m + rd) mod n
        if (s === 0n)
            return; // s=0 invalid
        let normS = s; // normalized S
        let rec = (q.x === r ? 0 : 2) | Number(q.y & 1n); // recovery bit
        if (lowS && moreThanHalfN(s)) { // if lowS was passed, ensure s is always
            normS = mod(-s, N); // in the bottom half of CURVE.n
            rec ^= 1;
        }
        return new Signature(r, normS, rec); // use normS, not s
    };
    return { seed: concatB(...seed), k2sig };
};
function hmacDrbg(asynchronous) {
    let v = u8n(fLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
    let k = u8n(fLen); // Steps B, C of RFC6979 3.2: set hashLen, in our case always same
    let i = 0; // Iterations counter, will throw when over 1000
    const reset = () => { v.fill(1); k.fill(0); i = 0; };
    const _e = 'drbg: tried 1000 values';
    if (asynchronous) { // asynchronous=true
        const h = (...b) => etc.hmacSha256Async(k, v, ...b); // hmac(k)(v, ...values)
        const reseed = async (seed = u8n()) => {
            k = await h(u8n([0x00]), seed); // k = hmac(K || V || 0x00 || seed)
            v = await h(); // v = hmac(K || V)
            if (seed.length === 0)
                return;
            k = await h(u8n([0x01]), seed); // k = hmac(K || V || 0x01 || seed)
            v = await h(); // v = hmac(K || V)
        };
        const gen = async () => {
            if (i++ >= 1000)
                err(_e);
            v = await h(); // v = hmac(K || V)
            return v;
        };
        return async (seed, pred) => {
            reset(); // the returned fn, don't, it's: 1. slower (JIT). 2. unsafe (async race conditions)
            await reseed(seed); // Steps D-G
            let res = undefined; // Step H: grind until k is in [1..n-1]
            while (!(res = pred(await gen())))
                await reseed(); // test predicate until it returns ok
            reset();
            return res;
        };
    }
    else {
        const h = (...b) => {
            const f = _hmacSync;
            if (!f)
                err('etc.hmacSha256Sync not set');
            return f(k, v, ...b); // hmac(k)(v, ...values)
        };
        const reseed = (seed = u8n()) => {
            k = h(u8n([0x00]), seed); // k = hmac(k || v || 0x00 || seed)
            v = h(); // v = hmac(k || v)
            if (seed.length === 0)
                return;
            k = h(u8n([0x01]), seed); // k = hmac(k || v || 0x01 || seed)
            v = h(); // v = hmac(k || v)
        };
        const gen = () => {
            if (i++ >= 1000)
                err(_e);
            v = h(); // v = hmac(k || v)
            return v;
        };
        return (seed, pred) => {
            reset();
            reseed(seed); // Steps D-G
            let res = undefined; // Step H: grind until k is in [1..n-1]
            while (!(res = pred(gen())))
                reseed(); // test predicate until it returns ok
            reset();
            return res;
        };
    }
}
// ECDSA signature generation. via secg.org/sec1-v2.pdf 4.1.2 + RFC6979 deterministic k
const signAsync = async (msgh, priv, opts = optS) => {
    const { seed, k2sig } = prepSig(msgh, priv, opts); // Extract arguments for hmac-drbg
    return hmacDrbg(true)(seed, k2sig); // Re-run drbg until k2sig returns ok
};
const sign$1 = (msgh, priv, opts = optS) => {
    const { seed, k2sig } = prepSig(msgh, priv, opts); // Extract arguments for hmac-drbg
    return hmacDrbg(false)(seed, k2sig); // Re-run drbg until k2sig returns ok
};
const verify$1 = (sig, msgh, pub, opts = optV) => {
    let { lowS } = opts; // ECDSA signature verification
    if (lowS == null)
        lowS = true; // Default lowS=true
    if ('strict' in opts)
        err('verify() legacy options not supported'); // legacy param
    let sig_, h, P; // secg.org/sec1-v2.pdf 4.1.4
    const rs = sig && typeof sig === 'object' && 'r' in sig; // Previous ver supported DER sigs. We
    if (!rs && (toU8(sig).length !== 2 * fLen)) // throw error when DER is suspected now.
        err('signature must be 64 bytes');
    try {
        sig_ = rs ? new Signature(sig.r, sig.s).assertValidity() : Signature.fromCompact(sig);
        h = bits2int_modN(toU8(msgh)); // Truncate hash
        P = pub instanceof Point ? pub.ok() : Point.fromHex(pub); // Validate public key
    }
    catch (e) {
        return false;
    } // Check sig for validity in both cases
    if (!sig_)
        return false;
    const { r, s } = sig_;
    if (lowS && moreThanHalfN(s))
        return false; // lowS bans sig.s >= CURVE.n/2
    let R;
    try {
        const is = inv(s, N); // s^-1
        const u1 = mod(h * is, N); // u1 = hs^-1 mod n
        const u2 = mod(r * is, N); // u2 = rs^-1 mod n
        R = G.mulAddQUns(P, u1, u2).aff(); // R = u1⋅G + u2⋅P
    }
    catch (error) {
        return false;
    }
    if (!R)
        return false; // stop if R is identity / zero point
    const v = mod(R.x, N); // R.x must be in N's field, not P's
    return v === r; // mod(R.x, n) == r
};
const getSharedSecret = (privA, pubB, isCompressed = true) => {
    return Point.fromHex(pubB).mul(toPriv(privA)).toRawBytes(isCompressed); // ECDH
};
const hashToPrivateKey = (hash) => {
    hash = toU8(hash); // produces private keys with modulo bias
    const minLen = fLen + 8; // being neglible.
    if (hash.length < minLen || hash.length > 1024)
        err('expected proper params');
    const num = mod(b2n(hash), N - 1n) + 1n; // takes at least n+8 bytes
    return n2b(num);
};
const etc = {
    hexToBytes: h2b, bytesToHex: b2h, // share API with noble-curves.
    concatBytes: concatB, bytesToNumberBE: b2n, numberToBytesBE: n2b,
    mod, invert: inv, // math utilities
    hmacSha256Async: async (key, ...msgs) => {
        const c = cr(); // async HMAC-SHA256, no sync built-in!
        const s = c && c.subtle; // For React Native support, see README.
        if (!s)
            return err('etc.hmacSha256Async not set'); // Uses webcrypto built-in cryptography.
        const k = await s.importKey('raw', key, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign']);
        return u8n(await s.sign('HMAC', k, concatB(...msgs)));
    },
    hmacSha256Sync: _hmacSync, // For TypeScript. Actual logic is below
    hashToPrivateKey,
    randomBytes: (len = 32) => {
        const crypto = cr(); // Must be shimmed in node.js <= 18 to prevent error. See README.
        if (!crypto || !crypto.getRandomValues)
            err('crypto.getRandomValues must be defined');
        return crypto.getRandomValues(u8n(len));
    },
};
const utils = {
    normPrivateKeyToScalar: toPriv,
    isValidPrivateKey: (key) => { try {
        return !!toPriv(key);
    }
    catch (e) {
        return false;
    } },
    randomPrivateKey: () => hashToPrivateKey(etc.randomBytes(fLen + 16)), // FIPS 186 B.4.1.
    precompute(w = 8, p = G) { p.multiply(3n); return p; }, // no-op
};
Object.defineProperties(etc, { hmacSha256Sync: {
        configurable: false, get() { return _hmacSync; }, set(f) { if (!_hmacSync)
            _hmacSync = f; },
    } });
const W = 8; // Precomputes-related code. W = window size
const precompute = () => {
    const points = []; // 10x sign(), 2x verify(). To achieve this,
    const windows = 256 / W + 1; // app needs to spend 40ms+ to calculate
    let p = G, b = p; // a lot of points related to base point G.
    for (let w = 0; w < windows; w++) { // Points are stored in array and used
        b = p; // any time Gx multiplication is done.
        points.push(b); // They consume 16-32 MiB of RAM.
        for (let i = 1; i < 2 ** (W - 1); i++) {
            b = b.add(p);
            points.push(b);
        }
        p = b.double(); // Precomputes don't speed-up getSharedKey,
    } // which multiplies user point by scalar,
    return points; // when precomputes are using base point
};
let Gpows = undefined; // precomputes for base point G
const wNAF = (n) => {
    // Compared to other point mult methods,
    const comp = Gpows || (Gpows = precompute()); // stores 2x less points using subtraction
    const neg = (cnd, p) => { let n = p.negate(); return cnd ? n : p; }; // negate
    let p = I, f = G; // f must be G, or could become I in the end
    const windows = 1 + 256 / W; // W=8 17 windows
    const wsize = 2 ** (W - 1); // W=8 128 window size
    const mask = BigInt(2 ** W - 1); // W=8 will create mask 0b11111111
    const maxNum = 2 ** W; // W=8 256
    const shiftBy = BigInt(W); // W=8 8
    for (let w = 0; w < windows; w++) {
        const off = w * wsize;
        let wbits = Number(n & mask); // extract W bits.
        n >>= shiftBy; // shift number by W bits.
        if (wbits > wsize) {
            wbits -= maxNum;
            n += 1n;
        } // split if bits > max: +224 => 256-32
        const off1 = off, off2 = off + Math.abs(wbits) - 1; // offsets, evaluate both
        const cnd1 = w % 2 !== 0, cnd2 = wbits < 0; // conditions, evaluate both
        if (wbits === 0) {
            f = f.add(neg(cnd1, comp[off1])); // bits are 0: add garbage to fake point
        }
        else { //          ^ can't add off2, off2 = I
            p = p.add(neg(cnd2, comp[off2])); // bits are 1: add to result point
        }
    }
    return { p, f }; // return both real and fake points for JIT
}; // !! you can disable precomputes by commenting-out call of the wNAF() inside Point#mul()

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CURVE: CURVE,
  ProjectivePoint: Point,
  Signature: Signature,
  etc: etc,
  getPublicKey: getPublicKey,
  getSharedSecret: getSharedSecret,
  sign: sign$1,
  signAsync: signAsync,
  utils: utils,
  verify: verify$1
});

const subtle = crypto.subtle;

const getRandomValues = crypto.getRandomValues.bind(crypto);
const digest          = subtle.digest.bind(subtle);
const generateKey     = subtle.generateKey.bind(subtle);
const deriveBits      = subtle.deriveBits.bind(subtle);
const deriveKey       = subtle.deriveKey.bind(subtle);
const importKey       = subtle.importKey.bind(subtle);
const exportKey       = subtle.exportKey.bind(subtle);
const encrypt         = subtle.encrypt.bind(subtle);
const decrypt         = subtle.decrypt.bind(subtle);
const sign            = subtle.sign.bind(subtle);
const verify          = subtle.verify.bind(subtle);

var browserCrypto = /*#__PURE__*/Object.freeze({
  __proto__: null,
  decrypt: decrypt,
  deriveBits: deriveBits,
  deriveKey: deriveKey,
  digest: digest,
  encrypt: encrypt,
  exportKey: exportKey,
  generateKey: generateKey,
  getRandomValues: getRandomValues,
  importKey: importKey,
  secp256k1: index,
  sign: sign,
  verify: verify
});

/* GENERATED CODE: config */
const DATA_URL = "https://themis.carmentiscan.io";
const NODE_URL = "https://mercurius.carmentis.io";

/* END OF GENERATED CODE */

// master block period in seconds
const MASTERBLOCK_PERIOD = 10;

// token name
const TOKEN_NAME = "CMTS";

// ============================================================================================================================ //
//  Field definition                                                                                                            //
// ============================================================================================================================ //
// field flags

const SECTION_NAME = [
  // 0 - account
  [
    "accountKeys",
    "accountIssuing",
    "accountTransfer"
  ],
  // 1 - node
  [
    "nodeKeys",
    "nodeAccount",
    "nodeDescription"
  ],
  // 2 - organization
  [
    "organizationKeys",
    "organizationAccount",
    "organizationDescription",
    "organizationServer"
  ],
  // 3 - user
  [
    "userDeclaration",
    "userKeys"
  ],
  // 4 - application
  [
    "applicationDeclaration",
    "applicationDescription",
    "applicationDefinition"
  ],
  // 5 - flow
  [
    "flowDeclaration",
    "flowUpdate",
    "flowHeader",
    "flowUser",
    "flowChannel",
    "flowSubscription",
    "flowPublicData",
    "flowChannelData",
    "flowApproval"
  ]
];

// generic
const NONE                     = 0x0000;
const NETWORK_ERROR            = 0x0002;
const MESSAGE_ERROR            = 0x0003;

// blockchain
const NOT_A_MICROBLOCK         = 0x0100;
const INVALID_HEADER_SIZE      = 0x0102;
const INVALID_BODY_SIZE        = 0x0103;

// object types
const OBJ_ACCOUNT      = 0;
const OBJ_NODE         = 1;
const OBJ_ORGANIZATION = 2;
const OBJ_USER         = 3;
const OBJ_APPLICATION  = 4;
const OBJ_FLOW         = 5;

// retrieving data from a node
const GET_CHAIN_STATUS        = 0x00;
const GET_MASTERBLOCK_LIST    = 0x02;
const GET_MASTERBLOCK         = 0x03;
const GET_MICROCHAIN_INFO     = 0x04;
const GET_MICROCHAIN_CONTENT  = 0x05;
const GET_MICROBLOCK          = 0x06;
const GET_MICROBLOCKS         = 0x07;
const GET_OBJECT_BY_LOOKUP_ID = 0x08;
const GET_CONSUMPTION         = 0x09;
const WAIT_FOR_ANCHORING      = 0x0A;

// sending data to a node
const SEND_MICROBLOCK         = 0x10;
const CREATE_GENESIS          = 0x11;

// attachments and temporary storage
const SEND_FILE               = 0x20;
const GET_FILE                = 0x21;

// answers
const ANS_OK                  = 0x80;
const ANS_ID                  = 0x81;
const ANS_STRING              = 0x82;
const ANS_FILE                = 0x83;
const ANS_BIN256              = 0x84;
const ANS_CHAIN_STATUS        = 0x85;
const ANS_MASTERBLOCK_LIST    = 0x86;
const ANS_MASTERBLOCK         = 0x87;
const ANS_MICROCHAIN_INFO     = 0x88;
const ANS_MICROCHAIN_CONTENT  = 0x89;
const ANS_MICROBLOCK          = 0x8A;
const ANS_MICROBLOCKS         = 0x8B;
const ANS_ACCEPT_MICROBLOCK   = 0x8C;
const ANS_CONSUMPTION         = 0x8D;
const ANS_ANCHORING           = 0x8E;

const ANS_ERROR               = 0xFF;

const INT64   = 0x00;
const UINT8$1   = 0x01;
const UINT16  = 0x02;
const UINT24  = 0x03;
const UINT32  = 0x04;
const UINT48  = 0x05;
const STRING$1  = 0x06;
const OBJECT$1  = 0x07;
const ARRAY$1   = 0x08;
const BINARY  = 0x09;
const BIN128  = 0x0A;
const BIN256  = 0x0B;
const BIN512  = 0x0C;
const CTR_KEY$1 = 0x0D;
const GCM_KEY$1 = 0x0E;

const HASH        = BIN256;
const SIGNATURE   = BIN512;

const SIGNED_DATA = [
  { name: "data",      type: BINARY },
  { name: "signature", type: SIGNATURE }
];

// ============================================================================================================================ //
//  Authentication                                                                                                              //
// ============================================================================================================================ //
const CONNECTION = [
  { name: "ip",        type: STRING$1 },
  { name: "country",   type: UINT16 },
  { name: "city",      type: STRING$1 },
  { name: "asn",       type: STRING$1 },
  { name: "userAgent", type: STRING$1 }
];

const AUTH_CHALLENGE = [
  { name: "organizationId", type: BIN256 },
  { name: "deviceId",       type: BIN128 },
  { name: "timestamp",      type: UINT48 },
  { name: "seed",           type: BINARY, size: 12 },
  { name: "connection",     type: OBJECT$1, schema: CONNECTION }
];

const NODE_MASTER_BLOCK_CONTENT = [
  {
    name: "microBlock",
    type: ARRAY$1,
    content: {
      type: OBJECT$1,
      schema: [
        { name: "hash",         type: HASH },
        { name: "microChainId", type: HASH },
        { name: "type",         type: UINT8$1 },
        { name: "nonce",        type: UINT48 },
        { name: "size",         type: UINT48 },
        { name: "nSection",     type: UINT48 }
      ]
    }
  }
];

// ============================================================================================================================ //
//  Messages                                                                                                                    //
// ============================================================================================================================ //
const MESSAGE = {
  // -------------------------------------------------------------------------------------------------------------------------- //
  //  retrieving data from a node                                                                                               //
  // -------------------------------------------------------------------------------------------------------------------------- //
  [ GET_CHAIN_STATUS ] : [
    // no argument
  ],
  [ GET_MASTERBLOCK_LIST ] : [
    { name: "firstBlockId", type: UINT48 },
    { name: "count",        type: UINT8$1 }
  ],
  [ GET_MASTERBLOCK ] : [
    { name: "id", type: UINT48 }
  ],
  [ GET_MICROCHAIN_INFO ] : [
    { name: "id", type: HASH }
  ],
  [ GET_MICROCHAIN_CONTENT ] : [
    { name: "id", type: HASH }
  ],
  [ GET_MICROBLOCK ] : [
    { name: "id", type: HASH }
  ],
  [ GET_MICROBLOCKS ] : [
    { name: "list", type: ARRAY$1, content: { type: HASH } }
  ],
  [ GET_OBJECT_BY_LOOKUP_ID ] : [
    { name: "lookupId", type: BIN256 }
  ],
  [ GET_CONSUMPTION ] : [
    { name: "id", type: HASH }
  ],
  [ WAIT_FOR_ANCHORING ] : [
    { name: "id", type: HASH }
  ],

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  sending data to a node                                                                                                    //
  // -------------------------------------------------------------------------------------------------------------------------- //
  [ SEND_MICROBLOCK ] : [
    { name: "data", type: BINARY }
  ],
  [ CREATE_GENESIS ] : [
    { name: "list", type: ARRAY$1, content: { type: BINARY } }
  ],

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  attachments and temporary storage                                                                                         //
  // -------------------------------------------------------------------------------------------------------------------------- //
  [ SEND_FILE ] : [
    { name: "data", type: BINARY }
  ],
  [ GET_FILE ] : [
    { name: "hash", type: HASH }
  ],

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  answers                                                                                                                   //
  // -------------------------------------------------------------------------------------------------------------------------- //
  [ ANS_OK ] : [
  ],
  [ ANS_ID ] : [
    { name: "id", type: HASH }
  ],
  [ ANS_STRING ] : [
    { name: "string", type: STRING$1 }
  ],
  [ ANS_FILE ] : [
    { name: "data", type: BINARY }
  ],
  [ ANS_BIN256 ] : [
    { name: "data", type: BIN256 }
  ],
  [ ANS_CHAIN_STATUS ] : [
    { name: "lastBlockId",     type: UINT48 },
    { name: "timeToNextBlock", type: UINT16 },
    { name: "nSection",        type: UINT48 },
    { name: "nMicroblock",     type: UINT48 },
    { name: "nOrganization",   type: UINT48 },
    { name: "nNode",           type: UINT48 },
    { name: "nUser",           type: UINT48 },
    { name: "nApplication",    type: UINT48 },
    { name: "nFlow",           type: UINT48 }
  ],
  [ ANS_MASTERBLOCK_LIST ] : [
    {
      name: "list",
      type: ARRAY$1,
      content: {
        type: OBJECT$1,
        schema: [
          { name: "id",          type: UINT48 },
          { name: "status",      type: UINT8$1 },
          { name: "timestamp",   type: UINT48 },
          { name: "hash",        type: HASH },
          { name: "node",        type: HASH },
          { name: "size",        type: UINT48 },
          { name: "nMicroblock", type: UINT48 }
        ]
      }
    }
  ],
  [ ANS_MASTERBLOCK ] : [
    { name: "header", type: BINARY },
    NODE_MASTER_BLOCK_CONTENT[0]
  ],
  [ ANS_MICROCHAIN_INFO ] : [
    { name: "nonce",          type: UINT48 },
    { name: "lastMicroblock", type: HASH }
  ],
  [ ANS_MICROCHAIN_CONTENT ] : [
    { name: "list", type: ARRAY$1, content: { type: HASH } }
  ],
  [ ANS_MICROBLOCK ] : [
    { name: "microChainId", type: HASH },
    { name: "type",         type: UINT8$1 },
    { name: "masterBlock",  type: UINT48 },
    { name: "index",        type: UINT32 },
    { name: "offset",       type: UINT32 },
    { name: "content",      type: BINARY }
  ],
  [ ANS_ACCEPT_MICROBLOCK ] : [
    { name: "microChainId", type: HASH },
    { name: "microBlockId", type: HASH },
    { name: "nonce",        type: UINT48 }
  ],
  [ ANS_CONSUMPTION ] : [
    { name: "flows",   type: UINT48 },
    { name: "records", type: UINT48 },
    { name: "bytes",   type: UINT48 }
  ],
  [ ANS_ANCHORING ] : [
    { name: "masterBlock", type: UINT48 },
    { name: "index",       type: UINT32 },
    { name: "offset",      type: UINT32 }
  ],
  [ ANS_ERROR ] : [
    { name: "id", type: UINT16 }
  ]
};

MESSAGE[ANS_MICROBLOCKS] = [
  { name: "list", type: ARRAY$1, content: { type: OBJECT$1, schema: MESSAGE[ANS_MICROBLOCK] } }
];

const TABLE_ACCOUNT = 'account';
const TABLE_SESSION = 'session';
const TABLE_CACHE   = 'cache';

const OTHER   = 0;
const NUMBER  = 1;
const BOOLEAN = 2;
const STRING  = 3;
const ARRAY   = 4;
const OBJECT  = 5;
const NULL    = 6;
const UINT8   = 7;
const CTR_KEY = 8;
const GCM_KEY = 9;

// ============================================================================================================================ //
//  getType()                                                                                                                   //
// ============================================================================================================================ //
function getType(v) {
  switch(typeof v) {
    case "number": {
      return NUMBER;
    }
    case "boolean": {
      return BOOLEAN;
    }
    case "string": {
      return STRING;
    }
    case "object": {
      if(v === null) {
        return NULL;
      }
      if(Array.isArray(v)) {
        return ARRAY;
      }
      if(v instanceof Uint8Array) {
        return UINT8;
      }
      if(v instanceof CryptoKey) {
        if(v.algorithm.name == CTR.NAME) {
          return CTR_KEY;
        }
        if(v.algorithm.name == GCM.NAME) {
          return GCM_KEY;
        }
      }
      return OBJECT;
    }
    default: {
      return OTHER;
    }
  }
}

// ============================================================================================================================ //
//  intToByteArray()                                                                                                            //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Converts a positive integer to a list of bytes in big-endian order, forcing at least 'size' bytes it specified.             //
//  The integer size should not exceed 48 bits.                                                                                 //
// ============================================================================================================================ //
function intToByteArray(n, size = 1) {
  let arr = [];

  while(n || size) {
    arr.push(n % 0x100);
    n = Math.floor(n / 0x100);
    size -= !!size;
  }
  return arr.reverse();
}

// ============================================================================================================================ //
//  toHexa()                                                                                                                    //
// ============================================================================================================================ //
function toHexa(array) {
  return [...array].map(n => n.toString(16).toUpperCase().padStart(2, '0')).join('');
}

// ============================================================================================================================ //
//  fromHexa()                                                                                                                  //
// ============================================================================================================================ //
function fromHexa(str) {
  if(typeof str != "string") {
    console.log("fromHexa", str);
  }
  return new Uint8Array(str.match(/../g).map(s => parseInt(s, 16)));
}

// ============================================================================================================================ //
//  readX()                                                                                                                     //
// ============================================================================================================================ //
function read8(array, pos) {
  return array[pos];
}

function read24(array, pos) {
  return array[pos] << 16 | array[pos + 1] << 8 | array[pos + 2];
}

function read32(array, pos) {
  return array[pos] << 24 | array[pos + 1] << 16 | array[pos + 2] << 8 | array[pos + 3];
}

function read48(array, pos) {
  return read24(array, pos) * 0x1000000 + read24(array, pos + 3);
}

// ============================================================================================================================ //
//  from()                                                                                                                      //
// ============================================================================================================================ //
function from(...arg) {
  let list = Array(arg.length),
      ndx = 0;

  arg.forEach((data, i) => {
    switch(getType(data)) {
      case NUMBER: {
        arg[i] = intToByteArray(data);
        break;
      }
      case STRING: {
        arg[i] = encode$1(data);
        break;
      }
    }
    list[i] = ndx;
    ndx += arg[i].length;
  });

  let arr = new Uint8Array(ndx);

  list.forEach((ndx, i) => {
    arr.set(arg[i], ndx);
  });

  return arr;
}

// ============================================================================================================================ //
//  isEqual()                                                                                                                   //
// ============================================================================================================================ //
function isEqual(a, b) {
  if(!a instanceof Uint8Array || !b instanceof Uint8Array || a.length != b.length) {
    return false;
  }

  for(let i = 0; i < a.length; i++) {
    if(a[i] != b[i]) {
      return false;
    }
  }
  return true;
}

// ============================================================================================================================ //
//  unserialize()                                                                                                               //
// ============================================================================================================================ //
async function unserialize(schema, stream) {
  return await decode$2(schema, stream, 0);
}

// ============================================================================================================================ //
//  encodeMessage()                                                                                                             //
// ============================================================================================================================ //
async function encodeMessage(type, obj) {
  return await encode(MESSAGE[type], obj, type);
}

// ============================================================================================================================ //
//  decodeMessage()                                                                                                             //
// ============================================================================================================================ //
async function decodeMessage(stream) {
  return {
    id  : stream[0],
    data: await decode$2(MESSAGE[stream[0]], stream, 1)
  };
}

// ============================================================================================================================ //
//  encode()                                                                                                                    //
// ============================================================================================================================ //
async function encode(schema, obj, header = null, context = {}) {
  let stream = header === null ? [] : [ header ];

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  writeInt64()                                                                                                              //
  // -------------------------------------------------------------------------------------------------------------------------- //
  function writeInt64(v) {
    writeUnsigned(v[0], 4);
    writeUnsigned(v[1], 4);
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  writeData()                                                                                                               //
  // -------------------------------------------------------------------------------------------------------------------------- //
  function writeData(arr) {
    stream = [ ...stream, ...arr ];
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  writeUnsigned()                                                                                                           //
  // -------------------------------------------------------------------------------------------------------------------------- //
  function writeUnsigned(value, nByte) {
    while(nByte--) {
      stream.push(value >> nByte * 8 & 0xFF);
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  encodeNode()                                                                                                              //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function encodeNode(def, node, path) {
    if(node === undefined) {
      console.error(obj);
      throw `property '${path.join('.')}' is undefined`;
    }
    if(!isCompatibleType(node, def)) {
      console.error(obj);
      throw `property '${path.join('.')}' has an invalid type`;
    }

    switch(def.type) {
      case INT64: {
        writeInt64(node);
        break;
      }
      case UINT8$1: {
        writeUnsigned(node, 1);
        break;
      }
      case UINT16: {
        writeUnsigned(node, 2);
        break;
      }
      case UINT24: {
        writeUnsigned(node, 3);
        break;
      }
      case UINT32: {
        writeUnsigned(node, 4);
        break;
      }
      case UINT48: {
        writeUnsigned(node / 0x100000000, 2);
        writeUnsigned(node, 4);
        break;
      }
      case STRING$1: {
        let data = encode$1(node);

        if(def.size == undefined) {
          writeUnsigned(data.length, 3);
        }
        writeData(data);
        break;
      }
      case BINARY: {
        if(def.size == undefined) {
          writeUnsigned(node.length, 3);
        }
        writeData(node);
        break;
      }
      case BIN128:
      case BIN256:
      case BIN512: {
        writeData(node);
        break;
      }
      case GCM_KEY$1: {
        writeUnsigned(node.type, 1);
        writeUnsigned(node.index, 1);
        writeData(await exportKey$1(node.key));

        if(context.keyring) {
          context.keyring.setKey(node.key, node.type, node.index);
        }
        break;
      }
      case OBJECT$1: {
        await encodeSchema(def.schema, node, path);
        break;
      }
      case ARRAY$1: {
        if(def.size == undefined) {
          writeUnsigned(node.length, 3);
        }
        for(let i in node) {
          await encodeNode(def.content, node[i], [ ...path, i ]);
        }
        break;
      }
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  encodeSchema()                                                                                                            //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function encodeSchema(schema, node, path = []) {
    for(let def of schema) {
      await encodeNode(def, node[def.name], [ ...path, def.name ]);
    }
  }

  await encodeSchema(schema, obj);

  return new Uint8Array(stream);
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
async function decode$2(schema, stream, ptr, obj = {}, context = {}) {
  // -------------------------------------------------------------------------------------------------------------------------- //
  //  readInt64()                                                                                                               //
  // -------------------------------------------------------------------------------------------------------------------------- //
  function readInt64() {
    let lo = readUnsigned(4),
        hi = readUnsigned(4);

    return [ lo, hi ];
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  readUnsigned()                                                                                                            //
  // -------------------------------------------------------------------------------------------------------------------------- //
  function readUnsigned(nByte) {
    let value = 0;

    while(nByte--) {
      value = value << 8 | stream[ptr++];
    }
    return value >>> 0;
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  readData()                                                                                                                //
  // -------------------------------------------------------------------------------------------------------------------------- //
  function readData(n) {
    return stream.slice(ptr, ptr += n);
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  decodeNode()                                                                                                              //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function decodeNode(def, path) {
    let item;

    switch(def.type) {
      case INT64: {
        item = readInt64();
        break;
      }
      case UINT8$1: {
        item = readUnsigned(1);
        break;
      }
      case UINT16: {
        item = readUnsigned(2);
        break;
      }
      case UINT24: {
        item = readUnsigned(3);
        break;
      }
      case UINT32: {
        item = readUnsigned(4);
        break;
      }
      case UINT48: {
        item = readUnsigned(2) * 0x100000000 + readUnsigned(4);
        break;
      }
      case STRING$1: {
        let size = def.size == undefined ? readUnsigned(3) : def.size;

        item = decode$3(readData(size));
        break;
      }
      case BINARY: {
        let size = def.size == undefined ? readUnsigned(3) : def.size;

        item = readData(size);
        break;
      }
      case BIN128: {
        item = readData(16);
        break;
      }
      case BIN256: {
        item = readData(32);
        break;
      }
      case BIN512: {
        item = readData(64);
        break;
      }
      case GCM_KEY$1: {
        let keyType = readUnsigned(1),
            keyIndex = readUnsigned(1),
            key = await importGcmKey(readData(32), true);

        item = { type: keyType, index: keyIndex, key: key };

        if(context.keyring) {
          context.keyring.setKey(key, keyType, keyIndex);
        }
        break;
      }
      case OBJECT$1: {
        item = {};
        await decodeSchema(def.schema, item, path);
        break;
      }
      case ARRAY$1: {
        let size = def.size == undefined ? readUnsigned(3) : def.size;

        item = [];

        for(let i = 0; i < size; i++) {
          item[i] = await decodeNode(def.content, [ ...path, i ]);
        }
        break;
      }
    }

    return item;
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  decodeSchema()                                                                                                            //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function decodeSchema(schema, node, path = []) {
    for(let def of schema) {
      node[def.name] = await decodeNode(def, [ ...path, def.name ]);
    }
  }

  await decodeSchema(schema, obj);

  if(ptr != stream.length) {
    console.error("SCHEMA", schema);
    console.error("STREAM", stream);
    console.error("OBJECT", obj);
    console.trace();
    throw `invalid stream: inconsistent length (pointer = ${ptr} / length = ${stream.length})`;
  }

  return obj;
}

// ============================================================================================================================ //
//  isCompatibleType()                                                                                                          //
// ============================================================================================================================ //
function isCompatibleType(value, def) {
  let valueType = getType(value);

  function isUint(value, w) {
    return getType(value) == NUMBER && value % 1 == 0 && value >= 0 && value < 2 ** w;
  }

  function checkSize() {
    return (
      (def.size    == undefined || value.length == def.size   ) &&
      (def.maxSize == undefined || value.length <= def.maxSize) &&
      (def.minSize == undefined || value.length >= def.minSize)
    );
  }

  switch(def.type) {
    case INT64  : { return valueType == ARRAY && value.length == 2 && isUint(value[0], 32) && isUint(value[1], 32); }
    case UINT8$1  : { return isUint(value,  8); }
    case UINT16 : { return isUint(value, 16); }
    case UINT24 : { return isUint(value, 24); }
    case UINT32 : { return isUint(value, 32); }
    case UINT48 : { return isUint(value, 48); }
    case STRING$1 : { return valueType == STRING && checkSize(); }
    case OBJECT$1 : { return valueType == OBJECT; }
    case ARRAY$1  : { return valueType == ARRAY && checkSize(); }
    case BINARY : { return valueType == UINT8 && checkSize(); }
    case BIN128 : { return valueType == UINT8 && value.length == 16; }
    case BIN256 : { return valueType == UINT8 && value.length == 32; }
    case BIN512 : { return valueType == UINT8 && value.length == 64; }
    case CTR_KEY$1: { return valueType == OBJECT && isUint(value.type, 8) && isUint(value.index, 8) && getType(value.key) == CTR_KEY; }
    case GCM_KEY$1: { return valueType == OBJECT && isUint(value.type, 8) && isUint(value.index, 8) && getType(value.key) == GCM_KEY; }
  }

  return false;
}

let thisInterface$2,
    nodeUrl,
    dataUrl;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$6(networkInterface) {
  thisInterface$2 = networkInterface;
}

// ============================================================================================================================ //
//  registerNodeEndpoint()                                                                                                      //
// ============================================================================================================================ //
function registerNodeEndpoint(url) {
  nodeUrl = url;
}

// ============================================================================================================================ //
//  registerDataEndpoint()                                                                                                      //
// ============================================================================================================================ //
function registerDataEndpoint(url) {
  dataUrl = url;
}

// ============================================================================================================================ //
//  nodeQuery()                                                                                                                 //
// ============================================================================================================================ //
async function nodeQuery(msgId, msgData) {
  return await query$1(nodeUrl + "/query/", msgId, msgData);
}

// ============================================================================================================================ //
//  dataServerQuery()                                                                                                           //
// ============================================================================================================================ //
async function dataServerQuery(path, obj = {}) {
  let data = await thisInterface$2.query(dataUrl + "/" + path, JSON.stringify(obj));

  return JSON.parse(data);
}

// ============================================================================================================================ //
//  query()                                                                                                                     //
// ============================================================================================================================ //
async function query$1(url, msgId, msgData) {
  console.log("query", url, msgId, msgData);

  let data = await encodeMessage(msgId, msgData),
      answer,
      answerData;

  try {
    answer = new Uint8Array(await thisInterface$2.query(url, data, "arraybuffer"));
    console.log("answer", answer);
  }
  catch(e) {
    console.log("error", e);

    return {
      id  : ANS_ERROR,
      data: { id: NETWORK_ERROR }
    };
  }

  try {
    answerData = await decodeMessage(answer);
    console.log("answerData", answerData);
    return answerData;
  }
  catch(e) {
    console.log("error", e);
    return {
      id  : ANS_ERROR,
      data: { id: MESSAGE_ERROR }
    };
  }
}

// ============================================================================================================================ //
//  query()                                                                                                                     //
// ============================================================================================================================ //
async function query(url, data, responseType, withCredentials) {
  let netXhr = new XMLHttpRequest();

  return new Promise(function(resolve, reject) {
    netXhr.open('POST', url, true);

    netXhr.setRequestHeader('Accept', 'application/json');
    netXhr.setRequestHeader('Content-Type', 'application/json');

    if(responseType) {
      netXhr.responseType = responseType;
    }

    if(withCredentials) {
      netXhr.withCredentials = true;
    }
console.log(netXhr);
    netXhr.addEventListener('load', _ => {
      resolve(netXhr.response);
    });

    netXhr.addEventListener('error', e => {
      reject();
    });

    netXhr.send(data);
  });
}

var browserNetwork = /*#__PURE__*/Object.freeze({
  __proto__: null,
  query: query
});

let thisInterface$1 = null;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$5(storageInterface, ...arg) {
  thisInterface$1 = storageInterface;
  thisInterface$1.initialize(...arg);
}

const IDB_DATABASE = 'carmentis-db';
const IDB_VERSION  = 2;

const IDB = window['indexedDB'] ||
            window['webkitIndexedDB'] ||
            window['mozIndexedDB'] ||
            window['OIndexedDB'] ||
            window['msIndexedDB'];

let idbDb,
    tableList;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$4(list) {
  tableList = list;
}

// ============================================================================================================================ //
//  open()                                                                                                                      //
// ============================================================================================================================ //
function open() {
  if(idbDb) {
    return true;
  }

  return new Promise((resolve, reject) => {
    let req = IDB.open(IDB_DATABASE, IDB_VERSION);

    req.onerror = function(e) {
      reject(e);
    };

    req.onsuccess = function(e) {
      idbDb = req.result;
      resolve();
    };

    req.onupgradeneeded = function(e) {
      let db = e.target.result;

      db.onerror = function(e) {
        reject();
      };

      if(e.oldVersion < 1) {
        tableList.forEach(name => {
          db.createObjectStore(name);
        });
      }
    };
  });
}

// ============================================================================================================================ //
//  count()                                                                                                                     //
// ============================================================================================================================ //
async function count(store, key) {
  await open();

  return new Promise((resolve, reject) => {
    let transaction = idbDb.transaction(store, 'readonly'),
        request = transaction.objectStore(store).count(key);

    request.addEventListener(
      'success',
      function(e) {
        resolve(e.target.result);
      }
    );
    request.addEventListener(
      'error',
      function(e) {
        reject(null);
      }
    );
  });
}

// ============================================================================================================================ //
//  get()                                                                                                                       //
// ============================================================================================================================ //
async function get$3(store, key) {
  await open();

  return new Promise((resolve, reject) => {
    let transaction = idbDb.transaction(store, 'readonly'),
        request = transaction.objectStore(store).get(key);

    request.addEventListener(
      'success',
      function(e) {
        resolve(e.target.result);
      }
    );
    request.addEventListener(
      'error',
      function(e) {
        reject(null);
      }
    );
  });
}

// ============================================================================================================================ //
//  put()                                                                                                                       //
// ============================================================================================================================ //
async function put(store, key, value) {
  await open();

  return new Promise((resolve, reject) => {
    let transaction = idbDb.transaction(store, 'readwrite'),
        request = transaction.objectStore(store).put(value, key);

    request.addEventListener(
      'success',
      function(e) {
        resolve(e.target.result);
      }
    );
    request.addEventListener(
      'error',
      function(e) {
        reject(e);
      }
    );
  });
}

// ============================================================================================================================ //
//  del()                                                                                                                       //
// ============================================================================================================================ //
async function del$1(store, key) {
  await open();

  return new Promise((resolve, reject) => {
    let transaction = idbDb.transaction(store, 'readwrite'),
        request = transaction.objectStore(store).delete(key);

    request.addEventListener(
      'success',
      function(e) {
        resolve(e.target.result);
      }
    );
    request.addEventListener(
      'error',
      function(e) {
        reject(e);
      }
    );
  });
}

const FILE_STORE = TABLE_CACHE + "-store";

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
async function initialize$3(tableList) {
  initialize$4(tableList);
}

// ============================================================================================================================ //
//  fileExists()                                                                                                                //
// ============================================================================================================================ //
async function fileExists(subdir, name) {
  let key = subdir + "-" + name;

  return await count(FILE_STORE, key);
}

// ============================================================================================================================ //
//  readFile()                                                                                                                  //
// ============================================================================================================================ //
async function readFile(subdir, name, position, length) {
  let key = subdir + "-" + name;

  return await get$3(FILE_STORE, key);
}

// ============================================================================================================================ //
//  writeFile()                                                                                                                 //
// ============================================================================================================================ //
async function writeFile(subdir, name, data) {
  let key = subdir + "-" + name;

  return await put(FILE_STORE, key, data);
}

var idbFileSystem = /*#__PURE__*/Object.freeze({
  __proto__: null,
  fileExists: fileExists,
  initialize: initialize$3,
  readFile: readFile,
  writeFile: writeFile
});

let thisInterface;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$2(keyValueInterface) {
  thisInterface = keyValueInterface;

  thisInterface.initialize([
    TABLE_ACCOUNT,
    TABLE_SESSION,
    TABLE_CACHE
  ]);
}

// ============================================================================================================================ //
//  get()                                                                                                                       //
// ============================================================================================================================ //
async function get$2(table, key) {
  return thisInterface && thisInterface.get ? await thisInterface.get(table, key) : null;
}

// ============================================================================================================================ //
//  set()                                                                                                                       //
// ============================================================================================================================ //
async function set$1(table, key, value) {
  return thisInterface && thisInterface.get ? await thisInterface.set(table, key, value) : null;
}

const STORE_SUFFIX = "-store";

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
async function initialize$1(tableList) {
  initialize$4(tableList.map(table => table + STORE_SUFFIX));
}

// ============================================================================================================================ //
//  get()                                                                                                                       //
// ============================================================================================================================ //
async function get$1(table, key) {
  return await get$3(table + STORE_SUFFIX, key);
}

// ============================================================================================================================ //
//  set()                                                                                                                       //
// ============================================================================================================================ //
async function set(table, key, value) {
  return await put(table + STORE_SUFFIX, key, value);
}

// ============================================================================================================================ //
//  del()                                                                                                                       //
// ============================================================================================================================ //
async function del(table, key) {
  return await del$1(table + STORE_SUFFIX, key);
}

var idbKeyValue = /*#__PURE__*/Object.freeze({
  __proto__: null,
  del: del,
  get: get$1,
  initialize: initialize$1,
  set: set
});

// ============================================================================================================================ //
//  ready()                                                                                                                     //
// ============================================================================================================================ //

// ============================================================================================================================ //
//  getCookies()                                                                                                                //
// ============================================================================================================================ //
function getCookies() {
  let cookies = {};

  document.cookie.split("; ").forEach(cookie => {
    if(cookie) {
      let [ name, value ] = cookie.split("=");
      cookies[name] = value;
    }
  });

  return cookies;
}

// ============================================================================================================================ //
//  setCookie()                                                                                                                 //
// ============================================================================================================================ //
function setCookie(name, value, maxAge) {
  document.cookie = [
    name + "=" + value,
    ...maxAge ? [ "max-age=" + maxAge ] : [],
    "SameSite=Lax",
    "Secure"
  ].join("; ");
}

// ============================================================================================================================ //
//  get()                                                                                                                       //
// ============================================================================================================================ //
function get(q) {
  let el = document.querySelector(q);

  if(el == undefined) {
    throw `can't find element '${q}'`;
  }

  return elementToObject(el);
}

// ============================================================================================================================ //
//  elementToObject()                                                                                                           //
// ============================================================================================================================ //
function elementToObject(el) {
  function setListener(name, callback) {
    unsetListener(name);
    obj.listener[name] = callback;
    el.addEventListener(name, callback);
  }

  function unsetListener(name) {
    if(obj.listener[name]) {
      el.removeEventListener(name, obj.listener[name]);
      delete obj.listener[name];
    }
  }

  let obj = {
    el: el,
    listener: {},

    custom: function(func) {
      func(el);
      return obj;
    },

    set: function(key, value) {
      el[key] = value;
      return obj;
    },

    getAttribute: function(key) {
      return el.getAttribute(key);
    },

    setAttribute: function(key, value = "1") {
      el.setAttribute(key, value);
      return obj;
    },

    removeAttribute: function(key) {
      el.removeAttribute(key);
      return obj;
    },

    className: function(arg) {
      if(arg) {
        el.className = Array.isArray(arg) ? arg.join(" ") : arg;
      }
      return obj;
    },

    toggleClass: function(arg, flag) {
      (Array.isArray(arg) ? arg : [ arg ]).forEach(name => {
        el.classList.toggle(name, flag);
      });
      return obj;
    },

    hasClass: function(arg) {
      return el.classList.contains(arg);
    },

    style: function(arg) {
      if(arg) {
        Object.keys(arg).forEach(key => el.style[key] = arg[key]);
      }
      return obj;
    },

    show: function(flag = true) {
      el.style.display = flag ? "block" : "none";
      return obj;
    },

    hide: function() {
      el.style.display = "none";
      return obj;
    },

    visible: function(flag = true) {
      el.style.visibility = flag ? "visible" : "hidden";
      return obj;
    },

    text: function(str) {
      let textNode = [...el.childNodes].find(o => o.nodeType == Node.TEXT_NODE);

      if(textNode) {
        textNode.nodeValue = str;
      }
      else {
        el.appendChild(document.createTextNode(str));
      }
      return obj;
    },

    html: function(html) {
      el.innerHTML = html;
      return obj;
    },

    checked: function(flag) {
      el.checked = !!flag;
      return obj;
    },

    selected: function(flag) {
      el.selected = !!flag;
      return obj;
    },

    focus: function() {
      el.focus();
      return obj;
    },

    event: function(name, callback) {
      setListener(name, callback);
      return obj;
    },

    click: function(callback) {
      setListener("click", callback);
      return obj;
    },

    submit: function(callback) {
      setListener("submit", e => {
        e.preventDefault();

        let list = e.target.querySelectorAll(`input, textarea, select`),
            data = {};

        for(let field of list) {
          switch(field.type) {
            case "checkbox": {
              data[field.id] = +field.checked;
              break;
            }
            default: {
              data[field.id] = field.value;
              break;
            }
          }
        }

        callback(data);

        return false;
      });
      return obj;
    },

    disableEvent: function(name) {
      unsetListener(name);
      return obj;
    },

    clear: function() {
      while(el.firstChild){
        el.removeChild(el.firstChild);
      }
      return obj;
    },

    remove: function() {
      el.remove();
    },

    getPosition: function() {
      let rect = el.getBoundingClientRect();

      return [
        rect.left,
        rect.top,
        rect.right,
        rect.bottom
      ];
    },

    setContent: function(...list) {
      obj.clear();
      list.forEach(content => obj.append(content));
      return obj;
    },

    append: function(...list) {
      list.forEach(content => content.appendTo(el));
      return obj;
    },

    insertBefore: function(arg) {
      let refNode = typeof arg == "string" ? document.querySelector(arg) : arg;
      refNode.parentElement.insertBefore(el, refNode);
      return obj;
    },

    appendTo: function(arg) {
      let refNode = typeof arg == "string" ? document.querySelector(arg) : arg;
      refNode.appendChild(el);
      return obj;
    },

    find: function(q) {
      return elementToObject(el.querySelector(q));
    },

    closest: function(q) {
      return elementToObject(el.closest(q));
    },

    getFileContent: async function() {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = async function() {
          resolve(reader.result);
        };
        reader.readAsText(el.files[0]);
      });
    }
  };

  return obj;
}

//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

//export function qrcode() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      }
      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  }
  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) ; else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

//  return qrcode;
//}

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

const DEVICE_COOKIE_TTL = 30 * 24 * 60 * 60;

let authenticationHash;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
async function initialize(obj) {
  let cookies = getCookies();

  obj.deviceId = cookies["cmts-device-id"];

  if(!obj.deviceId) {
    obj.deviceId = toHexa(getRandomBytes(16));
    setCookie("cmts-device-id", obj.deviceId, DEVICE_COOKIE_TTL);
  }

  await refreshAuthenticationChallenge(obj);

  setInterval(
    async _ => {
      let answer = await dataServerQuery("wallet-authentication/get-status", { hash: authenticationHash });

      if(answer.data.refresh) {
        await refreshAuthenticationChallenge(obj);
      }
    },
    1000
  );

  return authenticationHash;
}

// ============================================================================================================================ //
//  refreshAuthenticationChallenge()                                                                                            //
// ============================================================================================================================ //
async function refreshAuthenticationChallenge(obj) {
  let answer = await dataServerQuery(
    "wallet-authentication/initialize",
    {
      organizationId: obj.organizationId,
      deviceId      : obj.deviceId
    }
  );

  authenticationHash = answer.data;

  let qr = qrcode(0, "L");

  qr.addData("carmentis:auth/" + authenticationHash, "Byte");
  qr.make();

  let qrImgTag = qr.createImgTag(4, 0);

  get("#" + obj.qrCodeElementId).html(qrImgTag);
}

// ============================================================================================================================ //
//  getFromRequest()                                                                                                            //
// ============================================================================================================================ //

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
function decode$1(obj) {
  return {
    ip       : decodeIp(obj.ip),
    country  : decodeCountry(obj.country),
    city     : obj.city,
    asn      : obj.asn,
    userAgent: obj.userAgent
  };
}

// ============================================================================================================================ //
//  decodeCountry()                                                                                                             //
// ============================================================================================================================ //
function decodeCountry(n) {
  return String.fromCharCode(n >> 8, n & 0xFF);
}

// ============================================================================================================================ //
//  decodeIp()                                                                                                                  //
// ============================================================================================================================ //
function decodeIp(str) {
  return str;
}

// ============================================================================================================================ //
//  getChallenge()                                                                                                              //
// ============================================================================================================================ //
async function getChallenge(hash) {
  let answer = await dataServerQuery("wallet-authentication/get-challenge", { hash: hash });

  let signedSerialized = fromHexa(answer.data),
      signedChallenge = await unserialize(SIGNED_DATA, signedSerialized);
      await sha256(signedChallenge.data);

  // TODO: verify signature

  let challenge = await unserialize(AUTH_CHALLENGE, signedChallenge.data);

  challenge.connection = decode$1(challenge.connection);
  challenge.organizationId = toHexa(challenge.organizationId);
  challenge.deviceId = toHexa(challenge.deviceId);

  return challenge;
}

// "MICROBLK"
const MAGIC = new Uint8Array([ 0x4D, 0x49, 0x43, 0x52, 0x4F, 0x42, 0x4C, 0x4B ]);

const OFFSET_MAGIC_STRING   = 0;   // ( 8 bytes)
const OFFSET_NONCE$1          = 8;   // ( 6 bytes)
const OFFSET_PREV_HASH$1      = 14;  // (32 bytes)
const OFFSET_SEED           = 30;  // (16 bytes)
const OFFSET_TIMESTAMP$1      = 46;  // ( 6 bytes)
const OFFSET_N_SECTION      = 52;  // ( 1 byte )
const OFFSET_SIGNATURE      = 53;  // (64 bytes)

const BLK_HEADER_SIZE = 117;

const OFFSET_SEC_TYPE = 0;  // (1 byte )
const OFFSET_SEC_SIZE = 1;  // (4 byte )

const SECTION_HEADER_SIZE = 5;

// ============================================================================================================================ //
//  computeGenesisId()                                                                                                          //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  The genesis ID is the hash of the 48-bit timestamp and 128-bit seed.                                                        //
// ============================================================================================================================ //
async function computeGenesisId(block) {
  block.genesisId = await sha256(from(intToByteArray(block.ts, 6), block.seed));
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
async function decode(item) {
  let block = {};

  await decodeHeaderContent$1(block, item.content);
  await decodeBodyContent(block, item.content);

  block.hash         = item.hash;
  block.microChainId = item.microChainId;
  block.size         = item.content.length;
  block.masterBlock  = item.masterBlock;
  block.type         = item.type;
  block.index        = item.index;
  block.offset       = item.offset;

  return block;
}

// ============================================================================================================================ //
//  decodeHeaderContent()                                                                                                       //
// ============================================================================================================================ //
async function decodeHeaderContent$1(block, array) {
  if(array.length < BLK_HEADER_SIZE) {
    return INVALID_HEADER_SIZE;
  }

  if(!isEqual(array.slice(OFFSET_MAGIC_STRING, 8), MAGIC)) {
    return NOT_A_MICROBLOCK;
  }

  block.nonce     = read48(array, OFFSET_NONCE$1);
  block.prevHash  = array.slice(OFFSET_PREV_HASH$1, OFFSET_PREV_HASH$1 + 32);
  block.ts        = read48(array, OFFSET_TIMESTAMP$1);
  block.nSection  = read8(array, OFFSET_N_SECTION);
  block.signature = array.slice(OFFSET_SIGNATURE, OFFSET_SIGNATURE + 64);

  if(block.nonce == 1) {
    block.seed = array.slice(OFFSET_SEED, OFFSET_SEED + 16);
    await computeGenesisId(block);
  }

  return NONE;
}

// ============================================================================================================================ //
//  decodeBodyContent()                                                                                                         //
// ============================================================================================================================ //
async function decodeBodyContent(block, array) {
  let ptr = BLK_HEADER_SIZE;

  block.sections = [];

  for(let n = 0; n < block.nSection; n++) {
    let type = read8(array, ptr + OFFSET_SEC_TYPE),
        size = read32(array, ptr + OFFSET_SEC_SIZE),
        data = array.slice(ptr + SECTION_HEADER_SIZE, ptr + SECTION_HEADER_SIZE + size);

    block.sections.push({
      type: type,
      size: size,
      data: data
    });

    ptr += SECTION_HEADER_SIZE + size;
  }

  if(ptr != array.length) {
    return INVALID_BODY_SIZE;
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  body hash                                                                                                                 //
  // -------------------------------------------------------------------------------------------------------------------------- //
  block.bodyHash = await sha256(array.slice(BLK_HEADER_SIZE, ptr));

  return NONE;
}

// ============================================================================================================================ //
//  load()                                                                                                                      //
// ============================================================================================================================ //
async function load(id, microBlockList) {
  let chain = createChainInstance(microBlockList.length + 1);

  chain.hash = id;
  chain.type = microBlockList[0].type;

  for(let blockId in microBlockList) {
    let block = await decode(microBlockList[blockId]);

    chain.microBlock.push(block);
  }

  return chain;
}

// ============================================================================================================================ //
//  createChainInstance()                                                                                                       //
// ============================================================================================================================ //
function createChainInstance(nonce) {
  let chain = {
    status      : 0,
    microBlock  : [],
    currentBlock: null,
    currentNonce: nonce
  };

  return chain;
}

const OFFSET_NONCE            = 8;    // ( 6 bytes)
const OFFSET_PREV_HASH        = 14;   // (32 bytes)
const OFFSET_PREV_TX_ID       = 46;   // (32 bytes)
const OFFSET_TIMESTAMP        = 78;   // ( 6 bytes)
const OFFSET_MERKLE_ROOT_HASH = 84;   // (32 bytes)
const OFFSET_RADIX_ROOT_HASH  = 116;  // (32 bytes)
const OFFSET_NODE_ID          = 148;  // (32 bytes)
const OFFSET_NODE_SIGNATURE   = 180;  // (64 bytes)
const CONTENT_HEADER_SIZE = 3;

// ============================================================================================================================ //
//  decodeHeaderContent()                                                                                                       //
// ============================================================================================================================ //
function decodeHeaderContent(block, array) {
  block.nonce          = read48(array, OFFSET_NONCE);
  block.previousHash   = array.slice(OFFSET_PREV_HASH, OFFSET_PREV_HASH + 32);
  block.previousTxId   = array.slice(OFFSET_PREV_TX_ID, OFFSET_PREV_TX_ID + 32);
  block.ts             = read48(array, OFFSET_TIMESTAMP);
  block.merkleRootHash = array.slice(OFFSET_MERKLE_ROOT_HASH, OFFSET_MERKLE_ROOT_HASH + 32);
  block.radixRootHash  = array.slice(OFFSET_RADIX_ROOT_HASH, OFFSET_RADIX_ROOT_HASH + 32);
  block.nodeId         = array.slice(OFFSET_NODE_ID, OFFSET_NODE_ID + 32);
  block.nodeSignature  = array.slice(OFFSET_NODE_SIGNATURE, OFFSET_NODE_SIGNATURE + 64);

  return NONE;
}

// ============================================================================================================================ //
//  getStatus()                                                                                                                 //
// ============================================================================================================================ //
async function getStatus() {
  let obj = await nodeQuery(
    GET_CHAIN_STATUS,
    {}
  );

  if(obj.id != ANS_CHAIN_STATUS) {
    return null;
  }

  return obj;
}

// ============================================================================================================================ //
//  getMasterBlockList()                                                                                                        //
// ============================================================================================================================ //
async function getMasterBlockList$1(firstBlockId, count) {
  let obj = await nodeQuery(
    GET_MASTERBLOCK_LIST,
    {
      firstBlockId: firstBlockId,
      count       : count
    }
  );

  if(obj.id != ANS_MASTERBLOCK_LIST) {
    return null;
  }

  return obj;
}

// ============================================================================================================================ //
//  getMasterBlock()                                                                                                            //
// ============================================================================================================================ //
async function getMasterBlock$1(id) {
  let obj = await nodeQuery(
    GET_MASTERBLOCK,
    {
      id: id
    }
  );

  if(obj.id != ANS_MASTERBLOCK) {
    return null;
  }

  let block = {};

  decodeHeaderContent(block, obj.data.header);

  block.hash = await sha256(obj.data.header);
  block.microBlock = obj.data.microBlock;

  return block;
}

// ============================================================================================================================ //
//  getMicroChain()                                                                                                             //
// ============================================================================================================================ //
async function getMicroChain$1(id) {
  // -------------------------------------------------------------------------------------------------------------------------- //
  //  get the micro-chain content                                                                                               //
  // -------------------------------------------------------------------------------------------------------------------------- //
  let objMicrochain = await nodeQuery(
    GET_MICROCHAIN_CONTENT,
    {
      id: id
    }
  );

  if(!objMicrochain.data.list) {
    return null;
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  attempt to get as many micro-blocks as possible from the cache                                                            //
  // -------------------------------------------------------------------------------------------------------------------------- //
  let list = [],
      reqList = [],
      reqIndex = [];

  for(let n in objMicrochain.data.list) {
    let id = objMicrochain.data.list[n],
        key = "MICROBLK-" + toHexa(id),
        block = await get$2("cache", key);

    if(block) {
      list[n] = block;
    }
    else {
      reqList.push(id);
      reqIndex.push(n);
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  request missing micro-blocks and save them in the cache                                                                   //
  // -------------------------------------------------------------------------------------------------------------------------- //
  if(reqList.length) {
    let objMicroblocks = await nodeQuery(
      GET_MICROBLOCKS,
      {
        list: reqList
      }
    );

    for(let i in reqList) {
      let block = objMicroblocks.data.list[i];

      block.hash = reqList[i];
      list[reqIndex[i]] = block;
      await set$1("cache", "MICROBLK-" + toHexa(block.hash), block);
    }
  }

  return await load(id, list);
}

// ============================================================================================================================ //
//  getMicroBlock()                                                                                                             //
// ============================================================================================================================ //
async function getMicroBlock$1(id) {
  let key = "MICROBLK-" + toHexa(id),
      blockData;

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  attempt to get the micro-block from the cache                                                                             //
  // -------------------------------------------------------------------------------------------------------------------------- //
  blockData = await get$2("cache", key);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  or request it from the node and save it in the cache                                                                      //
  // -------------------------------------------------------------------------------------------------------------------------- //
  if(!blockData) {
    let obj = await nodeQuery(
      GET_MICROBLOCK,
      {
        id: id
      }
    );

    if(obj.id != ANS_MICROBLOCK) {
      return null;
    }

    obj.data.hash = id;
    await set$1("cache", key, obj.data);
    blockData = obj.data;
  }

  let block = await decode(blockData);

  return block;
}

const DICTIONARY = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
  "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid",
  "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
  "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance",
  "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album",
  "alcohol", "alert", "alien", "all", "alley", "allow", "almost", "alone",
  "alpha", "already", "also", "alter", "always", "amateur", "amazing", "among",
  "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle", "angry",
  "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april",
  "arch", "arctic", "area", "arena", "argue", "arm", "armed", "armor",
  "army", "around", "arrange", "arrest", "arrive", "arrow", "art", "artefact",
  "artist", "artwork", "ask", "aspect", "assault", "asset", "assist", "assume",
  "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado",
  "avoid", "awake", "aware", "away", "awesome", "awful", "awkward", "axis",
  "baby", "bachelor", "bacon", "badge", "bag", "balance", "balcony", "ball",
  "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel", "base",
  "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become",
  "beef", "before", "begin", "behave", "behind", "believe", "below", "belt",
  "bench", "benefit", "best", "betray", "better", "between", "beyond", "bicycle",
  "bid", "bike", "bind", "biology", "bird", "birth", "bitter", "black",
  "blade", "blame", "blanket", "blast", "bleak", "bless", "blind", "blood",
  "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body",
  "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring",
  "borrow", "boss", "bottom", "bounce", "box", "boy", "bracket", "brain",
  "brand", "brass", "brave", "bread", "breeze", "brick", "bridge", "brief",
  "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom", "brother",
  "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb",
  "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus",
  "business", "busy", "butter", "buyer", "buzz", "cabbage", "cabin", "cable",
  "cactus", "cage", "cake", "call", "calm", "camera", "camp", "can",
  "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon", "capable",
  "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry",
  "cart", "case", "cash", "casino", "castle", "casual", "cat", "catalog",
  "catch", "category", "cattle", "caught", "cause", "caution", "cave", "ceiling",
  "celery", "cement", "census", "century", "cereal", "certain", "chair", "chalk",
  "champion", "change", "chaos", "chapter", "charge", "chase", "chat", "cheap",
  "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child",
  "chimney", "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar",
  "cinnamon", "circle", "citizen", "city", "civil", "claim", "clap", "clarify",
  "claw", "clay", "clean", "clerk", "clever", "click", "client", "cliff",
  "climb", "clinic", "clip", "clock", "clog", "close", "cloth", "cloud",
  "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut",
  "code", "coffee", "coil", "coin", "collect", "color", "column", "combine",
  "come", "comfort", "comic", "common", "company", "concert", "conduct", "confirm",
  "congress", "connect", "consider", "control", "convince", "cook", "cool", "copper",
  "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch",
  "country", "couple", "course", "cousin", "cover", "coyote", "crack", "cradle",
  "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream",
  "credit", "creek", "crew", "cricket", "crime", "crisp", "critic", "crop",
  "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble", "crunch",
  "crush", "cry", "crystal", "cube", "culture", "cup", "cupboard", "curious",
  "current", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad",
  "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn",
  "day", "deal", "debate", "debris", "decade", "december", "decide", "decline",
  "decorate", "decrease", "deer", "defense", "define", "defy", "degree", "delay",
  "deliver", "demand", "demise", "denial", "dentist", "deny", "depart", "depend",
  "deposit", "depth", "deputy", "derive", "describe", "desert", "design", "desk",
  "despair", "destroy", "detail", "detect", "develop", "device", "devote", "diagram",
  "dial", "diamond", "diary", "dice", "diesel", "diet", "differ", "digital",
  "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree", "discover",
  "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide",
  "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain",
  "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft",
  "dragon", "drama", "drastic", "draw", "dream", "dress", "drift", "drill",
  "drink", "drip", "drive", "drop", "drum", "dry", "duck", "dumb",
  "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager",
  "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo",
  "ecology", "economy", "edge", "edit", "educate", "effort", "egg", "eight",
  "either", "elbow", "elder", "electric", "elegant", "element", "elephant", "elevator",
  "elite", "else", "embark", "embody", "embrace", "emerge", "emotion", "employ",
  "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy",
  "energy", "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough",
  "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode",
  "equal", "equip", "era", "erase", "erode", "erosion", "error", "erupt",
  "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence", "evil",
  "evoke", "evolve", "exact", "example", "excess", "exchange", "excite", "exclude",
  "excuse", "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit",
  "exotic", "expand", "expect", "expire", "explain", "expose", "express", "extend",
  "extra", "eye", "eyebrow", "fabric", "face", "faculty", "fade", "faint",
  "faith", "fall", "false", "fame", "family", "famous", "fan", "fancy",
  "fantasy", "farm", "fashion", "fat", "fatal", "father", "fatigue", "fault",
  "favorite", "feature", "february", "federal", "fee", "feed", "feel", "female",
  "fence", "festival", "fetch", "fever", "few", "fiber", "fiction", "field",
  "figure", "file", "film", "filter", "final", "find", "fine", "finger",
  "finish", "fire", "firm", "first", "fiscal", "fish", "fit", "fitness",
  "fix", "flag", "flame", "flash", "flat", "flavor", "flee", "flight",
  "flip", "float", "flock", "floor", "flower", "fluid", "flush", "fly",
  "foam", "focus", "fog", "foil", "fold", "follow", "food", "foot",
  "force", "forest", "forget", "fork", "fortune", "forum", "forward", "fossil",
  "foster", "found", "fox", "fragile", "frame", "frequent", "fresh", "friend",
  "fringe", "frog", "front", "frost", "frown", "frozen", "fruit", "fuel",
  "fun", "funny", "furnace", "fury", "future", "gadget", "gain", "galaxy",
  "gallery", "game", "gap", "garage", "garbage", "garden", "garlic", "garment",
  "gas", "gasp", "gate", "gather", "gauge", "gaze", "general", "genius",
  "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift", "giggle",
  "ginger", "giraffe", "girl", "give", "glad", "glance", "glare", "glass",
  "glide", "glimpse", "globe", "gloom", "glory", "glove", "glow", "glue",
  "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip",
  "govern", "gown", "grab", "grace", "grain", "grant", "grape", "grass",
  "gravity", "great", "green", "grid", "grief", "grit", "grocery", "group",
  "grow", "grunt", "guard", "guess", "guide", "guilt", "guitar", "gun",
  "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy",
  "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard",
  "head", "health", "heart", "heavy", "hedgehog", "height", "hello", "helmet",
  "help", "hen", "hero", "hidden", "high", "hill", "hint", "hip",
  "hire", "history", "hobby", "hockey", "hold", "hole", "holiday", "hollow",
  "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital",
  "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble",
  "humor", "hundred", "hungry", "hunt", "hurdle", "hurry", "hurt", "husband",
  "hybrid", "ice", "icon", "idea", "identify", "idle", "ignore", "ill",
  "illegal", "illness", "image", "imitate", "immense", "immune", "impact", "impose",
  "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate",
  "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial",
  "inject", "injury", "inmate", "inner", "innocent", "input", "inquiry", "insane",
  "insect", "inside", "inspire", "install", "intact", "interest", "into", "invest",
  "invite", "involve", "iron", "island", "isolate", "issue", "item", "ivory",
  "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel",
  "job", "join", "joke", "journey", "joy", "judge", "juice", "jump",
  "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup",
  "key", "kick", "kid", "kidney", "kind", "kingdom", "kiss", "kit",
  "kitchen", "kite", "kitten", "kiwi", "knee", "knife", "knock", "know",
  "lab", "label", "labor", "ladder", "lady", "lake", "lamp", "language",
  "laptop", "large", "later", "latin", "laugh", "laundry", "lava", "law",
  "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave",
  "lecture", "left", "leg", "legal", "legend", "leisure", "lemon", "lend",
  "length", "lens", "leopard", "lesson", "letter", "level", "liar", "liberty",
  "library", "license", "life", "lift", "light", "like", "limb", "limit",
  "link", "lion", "liquid", "list", "little", "live", "lizard", "load",
  "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop",
  "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber",
  "lunar", "lunch", "luxury", "lyrics", "machine", "mad", "magic", "magnet",
  "maid", "mail", "main", "major", "make", "mammal", "man", "manage",
  "mandate", "mango", "mansion", "manual", "maple", "marble", "march", "margin",
  "marine", "market", "marriage", "mask", "mass", "master", "match", "material",
  "math", "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure",
  "meat", "mechanic", "medal", "media", "melody", "melt", "member", "memory",
  "mention", "menu", "mercy", "merge", "merit", "merry", "mesh", "message",
  "metal", "method", "middle", "midnight", "milk", "million", "mimic", "mind",
  "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake",
  "mix", "mixed", "mixture", "mobile", "model", "modify", "mom", "moment",
  "monitor", "monkey", "monster", "month", "moon", "moral", "more", "morning",
  "mosquito", "mother", "motion", "motor", "mountain", "mouse", "move", "movie",
  "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom", "music",
  "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin",
  "narrow", "nasty", "nation", "nature", "near", "neck", "need", "negative",
  "neglect", "neither", "nephew", "nerve", "nest", "net", "network", "neutral",
  "never", "news", "next", "nice", "night", "noble", "noise", "nominee",
  "noodle", "normal", "north", "nose", "notable", "note", "nothing", "notice",
  "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey",
  "object", "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean",
  "october", "odor", "off", "offer", "office", "often", "oil", "okay",
  "old", "olive", "olympic", "omit", "once", "one", "onion", "online",
  "only", "open", "opera", "opinion", "oppose", "option", "orange", "orbit",
  "orchard", "order", "ordinary", "organ", "orient", "original", "orphan", "ostrich",
  "other", "outdoor", "outer", "output", "outside", "oval", "oven", "over",
  "own", "owner", "oxygen", "oyster", "ozone", "pact", "paddle", "page",
  "pair", "palace", "palm", "panda", "panel", "panic", "panther", "paper",
  "parade", "parent", "park", "parrot", "party", "pass", "patch", "path",
  "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut",
  "pear", "peasant", "pelican", "pen", "penalty", "pencil", "people", "pepper",
  "perfect", "permit", "person", "pet", "phone", "photo", "phrase", "physical",
  "piano", "picnic", "picture", "piece", "pig", "pigeon", "pill", "pilot",
  "pink", "pioneer", "pipe", "pistol", "pitch", "pizza", "place", "planet",
  "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge",
  "poem", "poet", "point", "polar", "pole", "police", "pond", "pony",
  "pool", "popular", "portion", "position", "possible", "post", "potato", "pottery",
  "poverty", "powder", "power", "practice", "praise", "predict", "prefer", "prepare",
  "present", "pretty", "prevent", "price", "pride", "primary", "print", "priority",
  "prison", "private", "prize", "problem", "process", "produce", "profit", "program",
  "project", "promote", "proof", "property", "prosper", "protect", "proud", "provide",
  "public", "pudding", "pull", "pulp", "pulse", "pumpkin", "punch", "pupil",
  "puppy", "purchase", "purity", "purpose", "purse", "push", "put", "puzzle",
  "pyramid", "quality", "quantum", "quarter", "question", "quick", "quit", "quiz",
  "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail",
  "rain", "raise", "rally", "ramp", "ranch", "random", "range", "rapid",
  "rare", "rate", "rather", "raven", "raw", "razor", "ready", "real",
  "reason", "rebel", "rebuild", "recall", "receive", "recipe", "record", "recycle",
  "reduce", "reflect", "reform", "refuse", "region", "regret", "regular", "reject",
  "relax", "release", "relief", "rely", "remain", "remember", "remind", "remove",
  "render", "renew", "rent", "reopen", "repair", "repeat", "replace", "report",
  "require", "rescue", "resemble", "resist", "resource", "response", "result", "retire",
  "retreat", "return", "reunion", "reveal", "review", "reward", "rhythm", "rib",
  "ribbon", "rice", "rich", "ride", "ridge", "rifle", "right", "rigid",
  "ring", "riot", "ripple", "risk", "ritual", "rival", "river", "road",
  "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room",
  "rose", "rotate", "rough", "round", "route", "royal", "rubber", "rude",
  "rug", "rule", "run", "runway", "rural", "sad", "saddle", "sadness",
  "safe", "sail", "salad", "salmon", "salon", "salt", "salute", "same",
  "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save", "say",
  "scale", "scan", "scare", "scatter", "scene", "scheme", "school", "science",
  "scissors", "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea",
  "search", "season", "seat", "second", "secret", "section", "security", "seed",
  "seek", "segment", "select", "sell", "seminar", "senior", "sense", "sentence",
  "series", "service", "session", "settle", "setup", "seven", "shadow", "shaft",
  "shallow", "share", "shed", "shell", "sheriff", "shield", "shift", "shine",
  "ship", "shiver", "shock", "shoe", "shoot", "shop", "short", "shoulder",
  "shove", "shrimp", "shrug", "shuffle", "shy", "sibling", "sick", "side",
  "siege", "sight", "sign", "silent", "silk", "silly", "silver", "similar",
  "simple", "since", "sing", "siren", "sister", "situate", "six", "size",
  "skate", "sketch", "ski", "skill", "skin", "skirt", "skull", "slab",
  "slam", "sleep", "slender", "slice", "slide", "slight", "slim", "slogan",
  "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth",
  "snack", "snake", "snap", "sniff", "snow", "soap", "soccer", "social",
  "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve",
  "someone", "song", "soon", "sorry", "sort", "soul", "sound", "soup",
  "source", "south", "space", "spare", "spatial", "spawn", "speak", "special",
  "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin",
  "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray",
  "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", "stadium",
  "staff", "stage", "stairs", "stamp", "stand", "start", "state", "stay",
  "steak", "steel", "stem", "step", "stereo", "stick", "still", "sting",
  "stock", "stomach", "stone", "stool", "story", "stove", "strategy", "street",
  "strike", "strong", "struggle", "student", "stuff", "stumble", "style", "subject",
  "submit", "subway", "success", "such", "sudden", "suffer", "sugar", "suggest",
  "suit", "summer", "sun", "sunny", "sunset", "super", "supply", "supreme",
  "sure", "surface", "surge", "surprise", "surround", "survey", "suspect", "sustain",
  "swallow", "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim",
  "swing", "switch", "sword", "symbol", "symptom", "syrup", "system", "table",
  "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target",
  "task", "taste", "tattoo", "taxi", "teach", "team", "tell", "ten",
  "tenant", "tennis", "tent", "term", "test", "text", "thank", "that",
  "theme", "then", "theory", "there", "they", "thing", "this", "thought",
  "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide", "tiger",
  "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title",
  "toast", "tobacco", "today", "toddler", "toe", "together", "toilet", "token",
  "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "top",
  "topic", "topple", "torch", "tornado", "tortoise", "toss", "total", "tourist",
  "toward", "tower", "town", "toy", "track", "trade", "traffic", "tragic",
  "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree",
  "trend", "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy",
  "trouble", "truck", "true", "truly", "trumpet", "trust", "truth", "try",
  "tube", "tuition", "tumble", "tuna", "tunnel", "turkey", "turn", "turtle",
  "twelve", "twenty", "twice", "twin", "twist", "two", "type", "typical",
  "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo",
  "unfair", "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown",
  "unlock", "until", "unusual", "unveil", "update", "upgrade", "uphold", "upon",
  "upper", "upset", "urban", "urge", "usage", "use", "used", "useful",
  "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid", "valley",
  "valve", "van", "vanish", "vapor", "various", "vast", "vault", "vehicle",
  "velvet", "vendor", "venture", "venue", "verb", "verify", "version", "very",
  "vessel", "veteran", "viable", "vibrant", "vicious", "victory", "video", "view",
  "village", "vintage", "violin", "virtual", "virus", "visa", "visit", "visual",
  "vital", "vivid", "vocal", "voice", "void", "volcano", "volume", "vote",
  "voyage", "wage", "wagon", "wait", "walk", "wall", "walnut", "want",
  "warfare", "warm", "warrior", "wash", "wasp", "waste", "water", "wave",
  "way", "wealth", "weapon", "wear", "weasel", "weather", "web", "wedding",
  "weekend", "weird", "welcome", "west", "wet", "whale", "what", "wheat",
  "wheel", "when", "where", "whip", "whisper", "wide", "width", "wife",
  "wild", "will", "win", "window", "wine", "wing", "wink", "winner",
  "winter", "wire", "wisdom", "wise", "wish", "witness", "wolf", "woman",
  "wonder", "wood", "wool", "word", "work", "world", "worry", "worth",
  "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year",
  "yellow", "you", "young", "youth", "zebra", "zero", "zone", "zoo"
];

const INFO_KEY    = 0;
const INFO_LOOKUP = 1;

const PBKDF2_ITERATIONS = 50000;

// ============================================================================================================================ //
//  derivePepperFromSeed()                                                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives the wallet pepper from the seed and an optionnal nonce.                                                             //
// ============================================================================================================================ //
async function derivePepperFromSeed$1(seed, nonce = 1) {
  let salt = nonceToIv(nonce),
      pepper = await deriveBitsPbkdf2(seed, salt, 512, PBKDF2_ITERATIONS);

  return pepper;
}

// ============================================================================================================================ //
//  deriveAccountPrivateKey()                                                                                                   //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives an account private signature key from the pepper.                                                                   //
// ============================================================================================================================ //
async function deriveAccountPrivateKey$1(pepper) {
  return await derivePrivateKey(OBJ_ACCOUNT, pepper);
}

// ============================================================================================================================ //
//  deriveAccountLookupId()                                                                                                     //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives an account lookup ID from the pepper.                                                                               //
// ============================================================================================================================ //
async function deriveAccountLookupId$1(pepper) {
  return await deriveLookupId(OBJ_ACCOUNT, pepper);
}

// ============================================================================================================================ //
//  deriveNodePrivateKey()                                                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives a node private signature key from the pepper the node genesis ID.                                                   //
// ============================================================================================================================ //
async function deriveNodePrivateKey$1(pepper, nodeGenesisId) {
  return await derivePrivateKey(OBJ_NODE, pepper, nodeGenesisId);
}

// ============================================================================================================================ //
//  deriveOrganizationPrivateKey()                                                                                              //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives an organization private signature key from the pepper and the organization genesis ID.                              //
// ============================================================================================================================ //
async function deriveOrganizationPrivateKey$1(pepper, orgGenesisId) {
  return await derivePrivateKey(OBJ_ORGANIZATION, pepper, orgGenesisId);
}

// ============================================================================================================================ //
//  deriveUserPrivateKey()                                                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives a user private signature key from the pepper and the organization ID.                                               //
// ============================================================================================================================ //
async function deriveUserPrivateKey$1(pepper, orgId) {
  return await derivePrivateKey(OBJ_USER, pepper, orgId);
}

// ============================================================================================================================ //
//  deriveUserLookupId()                                                                                                        //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives a user lookup ID from the pepper and the organization ID.                                                           //
// ============================================================================================================================ //
async function deriveUserLookupId$1(pepper, orgId) {
  return await deriveLookupId(OBJ_USER, pepper, orgId);
}

// ============================================================================================================================ //
//  deriveActorPrivateKey()                                                                                                     //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives an actor private signature key from the pepper and the flow genesis ID.                                             //
// ============================================================================================================================ //
async function deriveActorPrivateKey$1(pepper, flowGenesisId) {
  return await derivePrivateKey(OBJ_FLOW, pepper, flowGenesisId);
}

// ============================================================================================================================ //
//  deriveAuthenticationPrivateKey()                                                                                            //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives an authentication private signature key from the pepper.                                                            //
// ============================================================================================================================ //
async function deriveAuthenticationPrivateKey$1(pepper) {
  return await derivePrivateKey(0xFF, pepper);
}

// ============================================================================================================================ //
//  derivePrivateKey()                                                                                                          //
// ============================================================================================================================ //
async function derivePrivateKey(type, pepper, data = []) {
  let salt = new Uint8Array(0),
      info = from(INFO_KEY, type, data),
      privKey = await deriveBitsHkdf(pepper, salt, info, 256);

  return privKey;
}

// ============================================================================================================================ //
//  deriveLookupId()                                                                                                            //
// ============================================================================================================================ //
async function deriveLookupId(type, pepper, data = []) {
  let salt = new Uint8Array(0),
      info = from(INFO_LOOKUP, type, data),
      lookupId = await deriveBitsHkdf(pepper, salt, info, 256);

  return lookupId;
}

// ============================================================================================================================ //
//  deriveAesKeyFromPassword()                                                                                                  //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives an AES key from a password and returns an object with encrypt() / decrypt() methods working with this key.          //
// ============================================================================================================================ //
async function deriveAesKeyFromPassword$1(pwd) {
  let seed = encode$1(pwd),
      salt = new Uint8Array(0),
      bits = await deriveBitsPbkdf2(seed, salt, 256, PBKDF2_ITERATIONS),
      key  = await importGcmKey(bits);

  return {
    encrypt: async (data, iv = nonceToIv(0)) => await encryptGcm(key, data, iv),
    decrypt: async (data, iv = nonceToIv(0)) => await decryptGcm(key, data, iv)
  }
}

const MIN_WORDS     = 12;
const MAX_WORDS     = 24;
const BITS_PER_WORD = 11;

// ============================================================================================================================ //
//  getMatchingWords()                                                                                                          //
// ============================================================================================================================ //
function getMatchingWords$1(prefix) {
  let regex = new RegExp("^" + prefix, "i");

  return DICTIONARY.filter(word => regex.test(word));
}

// ============================================================================================================================ //
//  generateWordList()                                                                                                          //
// ============================================================================================================================ //
async function generateWordList$1(nWords = MIN_WORDS) {
  if(nWords < MIN_WORDS || nWords > MAX_WORDS) {
    throw `A word list must contain between ${MIN_WORDS} and ${MAX_WORDS} words.`;
  }

  let [ nBytes, seedSize ] = getFormatFromWordCount(nWords);

  let seed = getRandomBytes(seedSize),
      hash = await sha256(seed),
      data = [ ...seed, ...hash.slice(0, nBytes - seedSize) ];

  return dataToWordList(nWords, data);
}

// ============================================================================================================================ //
//  getSeedFromWordList()                                                                                                       //
// ============================================================================================================================ //
async function getSeedFromWordList$1(words) {
  let list = words.map(w => DICTIONARY.indexOf(w.toLowerCase()));

  list.forEach((v, i) => {
    if(v == -1) {
      throw `Unrecognized word '${words[i]}'.`;
    }
  });

  let [ nBytes, seedSize, hashMask ] = getFormatFromWordCount(words.length),
      data = new Uint8Array(nBytes);

  for(let n = 0; n < nBytes; n++) {
    let v = 0;

    for(let p = n * 8; p < n * 8 + 8; p++) {
      v = v << 1 | list[p / BITS_PER_WORD | 0] >> (BITS_PER_WORD - 1) - p % BITS_PER_WORD & 1;
    }
    data[n] = v;
  }

  let seed = data.slice(0, seedSize),
      hash = (await sha256(seed)).slice(0, nBytes - seedSize);

  hash[hash.length - 1] &= hashMask;

  if(!isEqual(data.slice(seedSize), hash)) {
    throw `This list of words has an invalid checksum.`;
  }

  return seed;
}

// ============================================================================================================================ //
//  getWordListFromSeed()                                                                                                       //
// ============================================================================================================================ //
async function getWordListFromSeed$1(seed) {
  let seedSize = seed.length,
      [ nBytes, nWords ] = getFormatFromSeedSize(seedSize);

  let hash = (await sha256(seed)).slice(0, nBytes - seedSize),
      data = [ ...seed, ...hash.slice(0, nBytes - seedSize) ];

  return dataToWordList(nWords, data);
}

// ============================================================================================================================ //
//  dataToWordList()                                                                                                            //
// ============================================================================================================================ //
function dataToWordList(nWords, data) {
  let words = [];

  for(let n = 0; n < nWords; n++) {
    let v = 0;

    for(let p = n * BITS_PER_WORD; p < (n + 1) * BITS_PER_WORD; p++) {
      v = v << 1 | data[p >> 3] >> 7 - (p & 7) & 1;
    }
    words.push(DICTIONARY[v]);
  }

  return words;
}

// ============================================================================================================================ //
//  getFormatFromSeedSize()                                                                                                     //
// ============================================================================================================================ //
function getFormatFromSeedSize(seedSize) {
  for(let nWords = MIN_WORDS; nWords <= MAX_WORDS; nWords++) {
    let [ nBytes, size ] = getFormatFromWordCount(nWords);

    if(size == seedSize) {
      return [ nBytes, nWords ];
    }
  }

  throw `Invalid seed size.`;
}

// ============================================================================================================================ //
//  getFormatFromWordCount()                                                                                                    //
// ============================================================================================================================ //
function getFormatFromWordCount(nWords) {
  let nBits    = nWords * BITS_PER_WORD,
      nBytes   = nBits + 7 >> 3,
      seedSize = nBits >> 3,
      csSize   = nBits - seedSize * 8;

  if(csSize < 4) {
    seedSize--;
  }

  return [ nBytes, seedSize, 0xFF << (-csSize & 7) ];
}

// ============================================================================================================================ //
//  constants                                                                                                                   //
// ============================================================================================================================ //
const constants = {
  // CST.ID
  OBJ_ACCOUNT     : OBJ_ACCOUNT,
  OBJ_NODE        : OBJ_NODE,
  OBJ_ORGANIZATION: OBJ_ORGANIZATION,
  OBJ_USER        : OBJ_USER,
  OBJ_APPLICATION : OBJ_APPLICATION,
  OBJ_FLOW        : OBJ_FLOW,

  // CST.DATA
  SECTION_NAME: SECTION_NAME,

  // CST.CONFIG
  TOKEN_NAME        : TOKEN_NAME,
  MASTERBLOCK_PERIOD: MASTERBLOCK_PERIOD,

  // microblock
  MICROBLOCK_SECTION_HEADER_SIZE: SECTION_HEADER_SIZE,

  // masterblock
  MASTERBLOCK_CONTENT_HEADER_SIZE: CONTENT_HEADER_SIZE
};

// ============================================================================================================================ //
//  blockchain methods                                                                                                          //
// ============================================================================================================================ //
const getChainStatus     = userFunction(getStatus);
const getMasterBlockList = userFunction(getMasterBlockList$1);
const getMasterBlock     = userFunction(getMasterBlock$1);
const getMicroChain      = userFunction(getMicroChain$1);
const getMicroBlock      = userFunction(getMicroBlock$1);

// ============================================================================================================================ //
//  key management methods                                                                                                      //
// ============================================================================================================================ //
const getMatchingWords               = userFunction(getMatchingWords$1);
const generateWordList               = userFunction(generateWordList$1);
const getSeedFromWordList            = userFunction(getSeedFromWordList$1);
const getWordListFromSeed            = userFunction(getWordListFromSeed$1);
const derivePepperFromSeed           = userFunction(derivePepperFromSeed$1);
const deriveAesKeyFromPassword       = userFunction(deriveAesKeyFromPassword$1);
const deriveAccountPrivateKey        = userFunction(deriveAccountPrivateKey$1);
const deriveAccountLookupId          = userFunction(deriveAccountLookupId$1);
const deriveNodePrivateKey           = userFunction(deriveNodePrivateKey$1);
const deriveOrganizationPrivateKey   = userFunction(deriveOrganizationPrivateKey$1);
const deriveUserPrivateKey           = userFunction(deriveUserPrivateKey$1);
const deriveUserLookupId             = userFunction(deriveUserLookupId$1);
const deriveActorPrivateKey          = userFunction(deriveActorPrivateKey$1);
const deriveAuthenticationPrivateKey = userFunction(deriveAuthenticationPrivateKey$1);

// ============================================================================================================================ //
//  userFunction()                                                                                                              //
// ============================================================================================================================ //
function userFunction(func) {
  return function(...arg) {
    try {
      return func(...arg);
    }
    catch(e) {
      console.error(e);
      return null;
    }
  }
}

initialize$7(browserCrypto);
initialize$6(browserNetwork);
registerNodeEndpoint(NODE_URL);
registerDataEndpoint(DATA_URL);
initialize$5(idbFileSystem);
initialize$2(idbKeyValue);

async function connectWithCarmentis(...arg) {
  return await initialize(...arg);
}

async function getAuthenticationChallenge(...arg) {
  return await getChallenge(...arg);
}

export { connectWithCarmentis, constants, deriveAccountLookupId, deriveAccountPrivateKey, deriveActorPrivateKey, deriveAesKeyFromPassword, deriveAuthenticationPrivateKey, deriveNodePrivateKey, deriveOrganizationPrivateKey, derivePepperFromSeed, deriveUserLookupId, deriveUserPrivateKey, generateWordList, getAuthenticationChallenge, getChainStatus, getMasterBlock, getMasterBlockList, getMatchingWords, getMicroBlock, getMicroChain, getSeedFromWordList, getWordListFromSeed };
