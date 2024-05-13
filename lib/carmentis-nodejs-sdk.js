/**
  (c)2022-2024 Carmentis SAS
  Built 2024-05-13T11:50:58.531Z
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
function initialize$7(cryptoInterface) {
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
function decode$2(array) {
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
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$6(cryptoInterface) {
  initialize$7(cryptoInterface);
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

const subtle = crypto.subtle;

const getRandomValues  = crypto.getRandomValues.bind(crypto);
const digest           = subtle.digest.bind(subtle);
const generateKey      = subtle.generateKey.bind(subtle);
const deriveBits       = subtle.deriveBits.bind(subtle);
const deriveKey        = subtle.deriveKey.bind(subtle);
const importKey        = subtle.importKey.bind(subtle);
const exportKey        = subtle.exportKey.bind(subtle);
const encrypt          = subtle.encrypt.bind(subtle);
const decrypt          = subtle.decrypt.bind(subtle);
const sign             = subtle.sign.bind(subtle);
const verify           = subtle.verify.bind(subtle);

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
  sign: sign,
  verify: verify
});

/* GENERATED CODE: config */
const NODE_URL = "https://mercurius.carmentis.io";

/* END OF GENERATED CODE */

// master block period in seconds
const MASTER_BLOCK_PERIOD$1 = 10;

// generic
const NONE                     = 0x0000;
const NETWORK_ERROR            = 0x0002;
const MESSAGE_ERROR            = 0x0003;

// blockchain
const NOT_A_MICROBLOCK         = 0x0100;
const INVALID_HEADER_SIZE      = 0x0102;
const INVALID_BODY_SIZE        = 0x0103;

// retrieving data from a node
const GET_CHAIN_STATUS       = 0x00;
const GET_MASTERBLOCK_LIST   = 0x02;
const GET_MASTERBLOCK        = 0x03;
const GET_MICROCHAIN_INFO    = 0x04;
const GET_MICROCHAIN_CONTENT = 0x05;
const GET_MICROBLOCK         = 0x06;
const GET_MICROBLOCKS        = 0x07;
const GET_OBJECT_BY_NAME     = 0x08;
const GET_CONSUMPTION        = 0x09;
const WAIT_FOR_ANCHORING     = 0x0A;

// sending data to a node
const SEND_MICROBLOCK        = 0x10;
const CREATE_GENESIS         = 0x11;

// attachments and temporary storage
const SEND_FILE              = 0x20;
const GET_FILE               = 0x21;

// answers
const ANS_OK                 = 0x80;
const ANS_ID                 = 0x81;
const ANS_STRING             = 0x82;
const ANS_FILE               = 0x83;
const ANS_BIN256             = 0x84;
const ANS_CHAIN_STATUS       = 0x85;
const ANS_MASTERBLOCK_LIST   = 0x86;
const ANS_MASTERBLOCK        = 0x87;
const ANS_MICROCHAIN_INFO    = 0x88;
const ANS_MICROCHAIN_CONTENT = 0x89;
const ANS_MICROBLOCK         = 0x8A;
const ANS_MICROBLOCKS        = 0x8B;
const ANS_ACCEPT_MICROBLOCK  = 0x8C;
const ANS_CONSUMPTION        = 0x8D;
const ANS_ANCHORING          = 0x8E;

const ANS_ERROR              = 0xFF;

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
  [ GET_OBJECT_BY_NAME ] : [
    { name: "type", type: UINT8$1 },
    { name: "name", type: STRING$1 }
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
//  toHexa()                                                                                                                    //
// ============================================================================================================================ //
function toHexa(array) {
  return [...array].map(n => n.toString(16).toUpperCase().padStart(2, '0')).join('');
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
    data: await decode$1(MESSAGE[stream[0]], stream, 1)
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
        let id = node.type << 8 | node.index;

        writeUnsigned(id, 2);
        writeData(await exportKey$1(node.key));

        if(context.keys) {
          context.keys[id] = node.key;
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
async function decode$1(schema, stream, ptr, obj = {}, context = {}) {
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

        item = decode$2(readData(size));
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
        let keyId = readUnsigned(2),
            key = await importGcmKey(readData(32), true);

        item = { type: keyId >> 8, index: keyId & 0xFF, key: key };

        if(context.keys) {
          // console.log("new key", keyId);
          context.keys[keyId] = key;
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
    return def.size == undefined || def.size == value.length;
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
    nodeUrl;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$5(networkInterface) {
  thisInterface$2 = networkInterface;
}

// ============================================================================================================================ //
//  registerNodeEndpoint()                                                                                                      //
// ============================================================================================================================ //
function registerNodeEndpoint(url) {
  nodeUrl = url;
}

// ============================================================================================================================ //
//  nodeQuery()                                                                                                                 //
// ============================================================================================================================ //
async function nodeQuery(msgId, msgData) {
  return await query$1(nodeUrl + "/query/", msgId, msgData);
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
function initialize$4(storageInterface, ...arg) {
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
function initialize$3(list) {
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
async function get$2(store, key) {
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
async function initialize$2(tableList) {
  initialize$3(tableList);
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

  return await get$2(FILE_STORE, key);
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
  initialize: initialize$2,
  readFile: readFile,
  writeFile: writeFile
});

let thisInterface;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$1(keyValueInterface) {
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
async function get$1(table, key) {
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
async function initialize(tableList) {
  initialize$3(tableList.map(table => table + STORE_SUFFIX));
}

// ============================================================================================================================ //
//  get()                                                                                                                       //
// ============================================================================================================================ //
async function get(table, key) {
  return await get$2(table + STORE_SUFFIX, key);
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
  get: get,
  initialize: initialize,
  set: set
});

// "MICROBLK"
const MAGIC = new Uint8Array([ 0x4D, 0x49, 0x43, 0x52, 0x4F, 0x42, 0x4C, 0x4B ]);

const OFFSET_MAGIC_STRING   = 0;    // ( 8 bytes)
const OFFSET_NONCE$1          = 8;    // ( 6 bytes)
const OFFSET_PREV_HASH$1      = 14;   // (32 bytes)
const OFFSET_TIMESTAMP$1      = 46;   // ( 6 bytes)
const OFFSET_N_SECTION      = 52;   // ( 1 bytes)
const OFFSET_SIGNATURE      = 53;   // (64 bytes)

const BLK_HEADER_SIZE = 117;

const OFFSET_SEC_TYPE = 0;    // (1 byte )
const OFFSET_SEC_SIZE = 1;    // (4 byte )

const SECTION_HEADER_SIZE = 5;

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
async function decode(item) {
  let block = {};

  decodeHeaderContent$1(block, item.content);
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
function decodeHeaderContent$1(block, array) {
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
        block = await get$1("cache", key);

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
  blockData = await get$1("cache", key);

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

const PBKDF2_ITERATIONS = 50000;

// ============================================================================================================================ //
//  deriveKeyIdFromSeed()                                                                                                       //
// ============================================================================================================================ //
async function deriveKeyIdFromSeed$1(seed) {
  let salt = new Uint8Array(0),
      bits = await deriveBitsPbkdf2(seed, salt, 512, PBKDF2_ITERATIONS);

  let masterKey   = bits.slice(0, 32),
      chainLinkId = bits.slice(32);

  return [ masterKey, chainLinkId ];
}

// ============================================================================================================================ //
//  deriveKeyFromPassword()                                                                                                     //
// ============================================================================================================================ //
async function deriveKeyFromPassword$1(pwd) {
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
const MASTER_BLOCK_PERIOD = MASTER_BLOCK_PERIOD$1;

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
const getMatchingWords      = userFunction(getMatchingWords$1);
const generateWordList      = userFunction(generateWordList$1);
const getSeedFromWordList   = userFunction(getSeedFromWordList$1);
const getWordListFromSeed   = userFunction(getWordListFromSeed$1);
const deriveKeyIdFromSeed   = userFunction(deriveKeyIdFromSeed$1);
const deriveKeyFromPassword = userFunction(deriveKeyFromPassword$1);

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

initialize$6(browserCrypto);
initialize$5(browserNetwork);
registerNodeEndpoint(NODE_URL);
initialize$4(idbFileSystem);
initialize$1(idbKeyValue);

export { MASTER_BLOCK_PERIOD, deriveKeyFromPassword, deriveKeyIdFromSeed, generateWordList, getChainStatus, getMasterBlock, getMasterBlockList, getMatchingWords, getMicroBlock, getMicroChain, getSeedFromWordList, getWordListFromSeed };
