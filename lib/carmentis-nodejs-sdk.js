/**
  Licensed under the Apache License, Version 2.0
  (c)2022-2024 Carmentis SAS
  Built 2024-10-11T15:03:08.097Z
  --
  Third party libraries:
  noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com)
  noble-ciphers - MIT License (c) 2022 Paul Miller (paulmillr.com), (c) 2016 Thomas Pornin <pornin@bolet.org>
  noble-hashes - MIT License (c) 2022 Paul Miller (https://paulmillr.com)
*/
/* GENERATED CODE: config */
const ROOT_ACCOUNT_PUB_KEY$1 = "02E3F7421765974BDB78E94D5345D9E7288051A98D1BCDFFA280F75BFC7E2B1DB0";

/* END OF GENERATED CODE */

// public signature key for the root account
const ROOT_ACCOUNT_PUB_KEY = ROOT_ACCOUNT_PUB_KEY$1;

// master block period in seconds
const MASTERBLOCK_PERIOD = 5;

// protocol version
const PROTOCOL_VERSION = 0x0001;

// gas
const GAS_FIXED    = 1000;
const GAS_PER_BYTE = 1;

// token name
const TOKEN_NAME = "CMTS";

// token units
const TOKEN      = 100000;
const CENTITOKEN = 1000;
const MILLITOKEN = 100;

// free sandbox credit, in tokens
const SANDBOX_CREDIT = 100;

// token price
const EUR_PRICE = TOKEN * 20;

// token costs
const COST_PER_MICROBLOCK = TOKEN;
const COST_PER_BYTE       = MILLITOKEN;
const MIN_STAKING         = TOKEN * 1e6;
const MAX_STAKING         = TOKEN * 1e7;
const MIN_PURCHASE        = TOKEN * 200;
const MAX_PURCHASE        = TOKEN * 200000;

var config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CENTITOKEN: CENTITOKEN,
  COST_PER_BYTE: COST_PER_BYTE,
  COST_PER_MICROBLOCK: COST_PER_MICROBLOCK,
  EUR_PRICE: EUR_PRICE,
  GAS_FIXED: GAS_FIXED,
  GAS_PER_BYTE: GAS_PER_BYTE,
  MASTERBLOCK_PERIOD: MASTERBLOCK_PERIOD,
  MAX_PURCHASE: MAX_PURCHASE,
  MAX_STAKING: MAX_STAKING,
  MILLITOKEN: MILLITOKEN,
  MIN_PURCHASE: MIN_PURCHASE,
  MIN_STAKING: MIN_STAKING,
  PROTOCOL_VERSION: PROTOCOL_VERSION,
  ROOT_ACCOUNT_PUB_KEY: ROOT_ACCOUNT_PUB_KEY,
  SANDBOX_CREDIT: SANDBOX_CREDIT,
  TOKEN: TOKEN,
  TOKEN_NAME: TOKEN_NAME
});

const country = {
  "AD": "Andorra",
  "AE": "United Arab Emirates (the)",
  "AF": "Afghanistan",
  "AG": "Antigua and Barbuda",
  "AI": "Anguilla",
  "AL": "Albania",
  "AM": "Armenia",
  "AO": "Angola",
  "AQ": "Antarctica",
  "AR": "Argentina",
  "AS": "American Samoa",
  "AT": "Austria",
  "AU": "Australia",
  "AW": "Aruba",
  "AX": "Åland Islands",
  "AZ": "Azerbaijan",
  "BA": "Bosnia and Herzegovina",
  "BB": "Barbados",
  "BD": "Bangladesh",
  "BE": "Belgium",
  "BF": "Burkina Faso",
  "BG": "Bulgaria",
  "BH": "Bahrain",
  "BI": "Burundi",
  "BJ": "Benin",
  "BL": "Saint Barthélemy",
  "BM": "Bermuda",
  "BN": "Brunei Darussalam",
  "BO": "Bolivia (Plurinational State of)",
  "BQ": "Bonaire, Sint Eustatius and Saba",
  "BR": "Brazil",
  "BS": "Bahamas (the)",
  "BT": "Bhutan",
  "BV": "Bouvet Island",
  "BW": "Botswana",
  "BY": "Belarus",
  "BZ": "Belize",
  "CA": "Canada",
  "CC": "Cocos (Keeling) Islands (the)",
  "CD": "Congo (the Democratic Republic of the)",
  "CF": "Central African Republic (the)",
  "CG": "Congo (the)",
  "CH": "Switzerland",
  "CI": "Côte d'Ivoire",
  "CK": "Cook Islands (the)",
  "CL": "Chile",
  "CM": "Cameroon",
  "CN": "China",
  "CO": "Colombia",
  "CR": "Costa Rica",
  "CU": "Cuba",
  "CV": "Cabo Verde",
  "CW": "Curaçao",
  "CX": "Christmas Island",
  "CY": "Cyprus",
  "CZ": "Czechia",
  "DE": "Germany",
  "DJ": "Djibouti",
  "DK": "Denmark",
  "DM": "Dominica",
  "DO": "Dominican Republic (the)",
  "DZ": "Algeria",
  "EC": "Ecuador",
  "EE": "Estonia",
  "EG": "Egypt",
  "EH": "Western Sahara",
  "ER": "Eritrea",
  "ES": "Spain",
  "ET": "Ethiopia",
  "FI": "Finland",
  "FJ": "Fiji",
  "FK": "Falkland Islands (the) [Malvinas]",
  "FM": "Micronesia (Federated States of)",
  "FO": "Faroe Islands (the)",
  "FR": "France",
  "GA": "Gabon",
  "GB": "United Kingdom of Great Britain and Northern Ireland (the)",
  "GD": "Grenada",
  "GE": "Georgia",
  "GF": "French Guiana",
  "GG": "Guernsey",
  "GH": "Ghana",
  "GI": "Gibraltar",
  "GL": "Greenland",
  "GM": "Gambia (the)",
  "GN": "Guinea",
  "GP": "Guadeloupe",
  "GQ": "Equatorial Guinea",
  "GR": "Greece",
  "GS": "South Georgia and the South Sandwich Islands",
  "GT": "Guatemala",
  "GU": "Guam",
  "GW": "Guinea-Bissau",
  "GY": "Guyana",
  "HK": "Hong Kong",
  "HM": "Heard Island and McDonald Islands",
  "HN": "Honduras",
  "HR": "Croatia",
  "HT": "Haiti",
  "HU": "Hungary",
  "ID": "Indonesia",
  "IE": "Ireland",
  "IL": "Israel",
  "IM": "Isle of Man",
  "IN": "India",
  "IO": "British Indian Ocean Territory (the)",
  "IQ": "Iraq",
  "IR": "Iran (Islamic Republic of)",
  "IS": "Iceland",
  "IT": "Italy",
  "JE": "Jersey",
  "JM": "Jamaica",
  "JO": "Jordan",
  "JP": "Japan",
  "KE": "Kenya",
  "KG": "Kyrgyzstan",
  "KH": "Cambodia",
  "KI": "Kiribati",
  "KM": "Comoros (the)",
  "KN": "Saint Kitts and Nevis",
  "KP": "Korea (the Democratic People's Republic of)",
  "KR": "Korea (the Republic of)",
  "KW": "Kuwait",
  "KY": "Cayman Islands (the)",
  "KZ": "Kazakhstan",
  "LA": "Lao People's Democratic Republic (the)",
  "LB": "Lebanon",
  "LC": "Saint Lucia",
  "LI": "Liechtenstein",
  "LK": "Sri Lanka",
  "LR": "Liberia",
  "LS": "Lesotho",
  "LT": "Lithuania",
  "LU": "Luxembourg",
  "LV": "Latvia",
  "LY": "Libya",
  "MA": "Morocco",
  "MC": "Monaco",
  "MD": "Moldova (the Republic of)",
  "ME": "Montenegro",
  "MF": "Saint Martin (French part)",
  "MG": "Madagascar",
  "MH": "Marshall Islands (the)",
  "MK": "Republic of North Macedonia",
  "ML": "Mali",
  "MM": "Myanmar",
  "MN": "Mongolia",
  "MO": "Macao",
  "MP": "Northern Mariana Islands (the)",
  "MQ": "Martinique",
  "MR": "Mauritania",
  "MS": "Montserrat",
  "MT": "Malta",
  "MU": "Mauritius",
  "MV": "Maldives",
  "MW": "Malawi",
  "MX": "Mexico",
  "MY": "Malaysia",
  "MZ": "Mozambique",
  "NA": "Namibia",
  "NC": "New Caledonia",
  "NE": "Niger (the)",
  "NF": "Norfolk Island",
  "NG": "Nigeria",
  "NI": "Nicaragua",
  "NL": "Netherlands (the)",
  "NO": "Norway",
  "NP": "Nepal",
  "NR": "Nauru",
  "NU": "Niue",
  "NZ": "New Zealand",
  "OM": "Oman",
  "PA": "Panama",
  "PE": "Peru",
  "PF": "French Polynesia",
  "PG": "Papua New Guinea",
  "PH": "Philippines (the)",
  "PK": "Pakistan",
  "PL": "Poland",
  "PM": "Saint Pierre and Miquelon",
  "PN": "Pitcairn",
  "PR": "Puerto Rico",
  "PS": "Palestine, State of",
  "PT": "Portugal",
  "PW": "Palau",
  "PY": "Paraguay",
  "QA": "Qatar",
  "RE": "Réunion",
  "RO": "Romania",
  "RS": "Serbia",
  "RU": "Russian Federation (the)",
  "RW": "Rwanda",
  "SA": "Saudi Arabia",
  "SB": "Solomon Islands",
  "SC": "Seychelles",
  "SD": "Sudan (the)",
  "SE": "Sweden",
  "SG": "Singapore",
  "SH": "Saint Helena, Ascension and Tristan da Cunha",
  "SI": "Slovenia",
  "SJ": "Svalbard and Jan Mayen",
  "SK": "Slovakia",
  "SL": "Sierra Leone",
  "SM": "San Marino",
  "SN": "Senegal",
  "SO": "Somalia",
  "SR": "Suriname",
  "SS": "South Sudan",
  "ST": "Sao Tome and Principe",
  "SV": "El Salvador",
  "SX": "Sint Maarten (Dutch part)",
  "SY": "Syrian Arab Republic",
  "SZ": "Eswatini",
  "TC": "Turks and Caicos Islands (the)",
  "TD": "Chad",
  "TF": "French Southern Territories (the)",
  "TG": "Togo",
  "TH": "Thailand",
  "TJ": "Tajikistan",
  "TK": "Tokelau",
  "TL": "Timor-Leste",
  "TM": "Turkmenistan",
  "TN": "Tunisia",
  "TO": "Tonga",
  "TR": "Turkey",
  "TT": "Trinidad and Tobago",
  "TV": "Tuvalu",
  "TW": "Taiwan (Province of China)",
  "TZ": "Tanzania, United Republic of",
  "UA": "Ukraine",
  "UG": "Uganda",
  "UM": "United States Minor Outlying Islands (the)",
  "US": "United States of America (the)",
  "UY": "Uruguay",
  "UZ": "Uzbekistan",
  "VA": "Holy See (the)",
  "VC": "Saint Vincent and the Grenadines",
  "VE": "Venezuela (Bolivarian Republic of)",
  "VG": "Virgin Islands (British)",
  "VI": "Virgin Islands (U.S.)",
  "VN": "Viet Nam",
  "VU": "Vanuatu",
  "WF": "Wallis and Futuna",
  "WS": "Samoa",
  "YE": "Yemen",
  "YT": "Mayotte",
  "ZA": "South Africa",
  "ZM": "Zambia",
  "ZW": "Zimbabwe"
};

var country$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  country: country
});

const CUSTOM = {
  "BTC": [ 0x0000, "Bitcoin" ],
  "ETH": [ 0x0001, "Ethereum" ]
};

const ISO4217 = {
  "AED": "UAE Dirham",
  "AFN": "Afghani",
  "ALL": "Lek",
  "AMD": "Armenian Dram",
  "ANG": "Netherlands Antillean Guilder",
  "AOA": "Kwanza",
  "ARS": "Argentine Peso",
  "AUD": "Australian Dollar",
  "AWG": "Aruban Florin",
  "AZN": "Azerbaijan Manat",
  "BAM": "Convertible Mark",
  "BBD": "Barbados Dollar",
  "BDT": "Taka",
  "BGN": "Bulgarian Lev",
  "BHD": "Bahraini Dinar",
  "BIF": "Burundi Franc",
  "BMD": "Bermudian Dollar",
  "BND": "Brunei Dollar",
  "BOB": "Boliviano",
  "BOV": "Mvdol",
  "BRL": "Brazilian Real",
  "BSD": "Bahamian Dollar",
  "BTN": "Ngultrum",
  "BWP": "Pula",
  "BYR": "Belarusian Ruble",
  "BZD": "Belize Dollar",
  "CAD": "Canadian Dollar",
  "CDF": "Congolese Franc",
  "CHE": "WIR Euro",
  "CHF": "Swiss Franc",
  "CHW": "WIR Franc",
  "CLF": "Unidad de Fomento",
  "CLP": "Chilean Peso",
  "CNY": "Yuan Renminbi",
  "COP": "Colombian Peso",
  "COU": "Unidad de Valor Real",
  "CRC": "Costa Rican Colon",
  "CUC": "Peso Convertible",
  "CUP": "Cuban Peso",
  "CVE": "Cabo Verde Escudo",
  "CZK": "Czech Koruna",
  "DJF": "Djibouti Franc",
  "DKK": "Danish Krone",
  "DOP": "Dominican Peso",
  "DZD": "Algerian Dinar",
  "EGP": "Egyptian Pound",
  "ERN": "Nakfa",
  "ETB": "Ethiopian Birr",
  "EUR": "Euro",
  "FJD": "Fiji Dollar",
  "FKP": "Falkland Islands Pound",
  "GBP": "Pound Sterling",
  "GEL": "Lari",
  "GHS": "Ghana Cedi",
  "GIP": "Gibraltar Pound",
  "GMD": "Dalasi",
  "GNF": "Guinean Franc",
  "GTQ": "Quetzal",
  "GYD": "Guyana Dollar",
  "HKD": "Hong Kong Dollar",
  "HNL": "Lempira",
  "HRK": "Kuna",
  "HTG": "Gourde",
  "HUF": "Forint",
  "IDR": "Rupiah",
  "ILS": "New Israeli Sheqel",
  "INR": "Indian Rupee",
  "IQD": "Iraqi Dinar",
  "IRR": "Iranian Rial",
  "ISK": "Iceland Krona",
  "JMD": "Jamaican Dollar",
  "JOD": "Jordanian Dinar",
  "JPY": "Yen",
  "KES": "Kenyan Shilling",
  "KGS": "Som",
  "KHR": "Riel",
  "KMF": "Comorian Franc ",
  "KPW": "North Korean Won",
  "KRW": "Won",
  "KWD": "Kuwaiti Dinar",
  "KYD": "Cayman Islands Dollar",
  "KZT": "Tenge",
  "LAK": "Lao Kip",
  "LBP": "Lebanese Pound",
  "LKR": "Sri Lanka Rupee",
  "LRD": "Liberian Dollar",
  "LSL": "Loti",
  "LYD": "Libyan Dinar",
  "MAD": "Moroccan Dirham",
  "MDL": "Moldovan Leu",
  "MGA": "Malagasy Ariary",
  "MKD": "Denar",
  "MMK": "Kyat",
  "MNT": "Tugrik",
  "MOP": "Pataca",
  "MRO": "Ouguiya",
  "MUR": "Mauritius Rupee",
  "MVR": "Rufiyaa",
  "MWK": "Malawi Kwacha",
  "MXN": "Mexican Peso",
  "MXV": "Mexican Unidad de Inversion (UDI)",
  "MYR": "Malaysian Ringgit",
  "MZN": "Mozambique Metical",
  "NAD": "Namibia Dollar",
  "NGN": "Naira",
  "NIO": "Cordoba Oro",
  "NOK": "Norwegian Krone",
  "NPR": "Nepalese Rupee",
  "NZD": "New Zealand Dollar",
  "OMR": "Rial Omani",
  "PAB": "Balboa",
  "PEN": "Sol",
  "PGK": "Kina",
  "PHP": "Philippine Peso",
  "PKR": "Pakistan Rupee",
  "PLN": "Zloty",
  "PYG": "Guarani",
  "QAR": "Qatari Rial",
  "RON": "Romanian Leu",
  "RSD": "Serbian Dinar",
  "RUB": "Russian Ruble",
  "RWF": "Rwanda Franc",
  "SAR": "Saudi Riyal",
  "SBD": "Solomon Islands Dollar",
  "SCR": "Seychelles Rupee",
  "SDG": "Sudanese Pound",
  "SEK": "Swedish Krona",
  "SGD": "Singapore Dollar",
  "SHP": "Saint Helena Pound",
  "SLL": "Leone",
  "SOS": "Somali Shilling",
  "SRD": "Surinam Dollar",
  "SSP": "South Sudanese Pound",
  "STD": "Dobra",
  "SVC": "El Salvador Colon",
  "SYP": "Syrian Pound",
  "SZL": "Lilangeni",
  "THB": "Baht",
  "TJS": "Somoni",
  "TMT": "Turkmenistan New Manat",
  "TND": "Tunisian Dinar",
  "TOP": "Pa'anga" ,
  "TRY": "Turkish Lira",
  "TTD": "Trinidad and Tobago Dollar",
  "TWD": "New Taiwan Dollar",
  "TZS": "Tanzanian Shilling",
  "UAH": "Hryvnia",
  "UGX": "Uganda Shilling",
  "USD": "US Dollar",
  "USN": "US Dollar (Next day)",
  "UYI": "Uruguay Peso en Unidades Indexadas (UI)",
  "UYU": "Peso Uruguayo",
  "UZS": "Uzbekistan Sum",
  "VEF": "Bolivar Fuerte",
  "VND": "Dong",
  "VUV": "Vatu",
  "WST": "Tala",
  "XAF": "CFA Franc BEAC",
  "XCD": "East Caribbean Dollar",
  "XDR": "SDR (Special Drawing Right)",
  "XOF": "CFA Franc BCEAO",
  "XPF": "CFP Franc",
  "XSU": "Sucre",
  "XUA": "ADB Unit of Account",
  "YER": "Yemeni Rial",
  "ZAR": "Rand",
  "ZMW": "Zambian Kwacha",
  "ZWL": "Zimbabwe Dollar"
};

var currency = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CUSTOM: CUSTOM,
  ISO4217: ISO4217
});

// ============================================================================================================================ //
//  Field definition                                                                                                            //
// ============================================================================================================================ //
// field flags
const STRUCT   = 0x01;
const ARRAY$2    = 0x02;
const REQUIRED = 0x04;
const PUBLIC   = 0x08;
const HASHABLE = 0x10;
const MASKABLE = 0x20;
const ENUM     = 0x40;

// primitive data types
const T_STRING  = 0x00;
const T_INTEGER = 0x01;
const T_AMOUNT  = 0x02;
const T_FILE    = 0x03;
const T_BINARY  = 0x04;
const T_HASH    = 0x05;
const T_DATE    = 0x06;
const T_DECIMAL = 0x07;

const T_MAX_ID  = 0x07;

const TYPE_NAME = [
  "string",
  "integer",
  "amount",
  "file",
  "binary",
  "hash",
  "date",
  "decimal"
];

// ID flags
const PLAIN    = 0x0;
const HASHED   = 0x1;
const MASKED   = 0x2;
const REDACTED = 0x4;

// field references
const REF_THIS     = 0x0;
const REF_LAST     = 0x1;
const REF_PREVIOUS = 0x2;

const REF_NAME = [
  "this",
  "last",
  "previous"
];

// ============================================================================================================================ //
//  Micro-block sections                                                                                                        //
// ============================================================================================================================ //
// account
const S_ACCT_DECLARATION  = 0x00;
const S_ACCT_ISSUING      = 0x01;
const S_ACCT_TRANSFER     = 0x02;

// node
const S_NODE_DECLARATION  = 0x00;
const S_NODE_KEYS         = 0x01;
const S_NODE_DESCRIPTION  = 0x02;

// organization
const S_ORG_PUBLIC_KEY    = 0x00;
const S_ORG_ACCOUNT       = 0x01;
const S_ORG_DESCRIPTION   = 0x02;
const S_ORG_SERVER        = 0x03;

// user
const S_USER_DECLARATION  = 0x00;
const S_USER_PROOF        = 0x01;

// application
const S_APP_DECLARATION   = 0x00;
const S_APP_DESCRIPTION   = 0x01;
const S_APP_DEFINITION    = 0x02;

// flow
const S_FLOW_DECLARATION  = 0x00;
const S_FLOW_UPDATE       = 0x01;
const S_FLOW_HEADER       = 0x02;
const S_FLOW_ACTOR        = 0x03;
const S_FLOW_CHANNEL      = 0x04;
const S_FLOW_SUBSCRIPTION = 0x05;
const S_FLOW_PUBLIC_DATA  = 0x06;
const S_FLOW_CHANNEL_DATA = 0x07;
const S_FLOW_APPROVAL     = 0x08;

const SECTION_NAME = [
  // 0 - account
  [
    "accountDeclaration",
    "accountIssuing",
    "accountTransfer"
  ],
  // 1 - node
  [
    "nodeDeclaration",
    "nodeAccount",
    "nodeDescription"
  ],
  // 2 - organization
  [
    "organizationPublicKey",
    "organizationAccount",
    "organizationDescription",
    "organizationServer"
  ],
  // 3 - user
  [
    "userDeclaration",
    "userProof"
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
    "flowActor",
    "flowChannel",
    "flowSubscription",
    "flowPublicData",
    "flowChannelData",
    "flowApproval"
  ]
];

var data = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ARRAY: ARRAY$2,
  ENUM: ENUM,
  HASHABLE: HASHABLE,
  HASHED: HASHED,
  MASKABLE: MASKABLE,
  MASKED: MASKED,
  PLAIN: PLAIN,
  PUBLIC: PUBLIC,
  REDACTED: REDACTED,
  REF_LAST: REF_LAST,
  REF_NAME: REF_NAME,
  REF_PREVIOUS: REF_PREVIOUS,
  REF_THIS: REF_THIS,
  REQUIRED: REQUIRED,
  SECTION_NAME: SECTION_NAME,
  STRUCT: STRUCT,
  S_ACCT_DECLARATION: S_ACCT_DECLARATION,
  S_ACCT_ISSUING: S_ACCT_ISSUING,
  S_ACCT_TRANSFER: S_ACCT_TRANSFER,
  S_APP_DECLARATION: S_APP_DECLARATION,
  S_APP_DEFINITION: S_APP_DEFINITION,
  S_APP_DESCRIPTION: S_APP_DESCRIPTION,
  S_FLOW_ACTOR: S_FLOW_ACTOR,
  S_FLOW_APPROVAL: S_FLOW_APPROVAL,
  S_FLOW_CHANNEL: S_FLOW_CHANNEL,
  S_FLOW_CHANNEL_DATA: S_FLOW_CHANNEL_DATA,
  S_FLOW_DECLARATION: S_FLOW_DECLARATION,
  S_FLOW_HEADER: S_FLOW_HEADER,
  S_FLOW_PUBLIC_DATA: S_FLOW_PUBLIC_DATA,
  S_FLOW_SUBSCRIPTION: S_FLOW_SUBSCRIPTION,
  S_FLOW_UPDATE: S_FLOW_UPDATE,
  S_NODE_DECLARATION: S_NODE_DECLARATION,
  S_NODE_DESCRIPTION: S_NODE_DESCRIPTION,
  S_NODE_KEYS: S_NODE_KEYS,
  S_ORG_ACCOUNT: S_ORG_ACCOUNT,
  S_ORG_DESCRIPTION: S_ORG_DESCRIPTION,
  S_ORG_PUBLIC_KEY: S_ORG_PUBLIC_KEY,
  S_ORG_SERVER: S_ORG_SERVER,
  S_USER_DECLARATION: S_USER_DECLARATION,
  S_USER_PROOF: S_USER_PROOF,
  TYPE_NAME: TYPE_NAME,
  T_AMOUNT: T_AMOUNT,
  T_BINARY: T_BINARY,
  T_DATE: T_DATE,
  T_DECIMAL: T_DECIMAL,
  T_FILE: T_FILE,
  T_HASH: T_HASH,
  T_INTEGER: T_INTEGER,
  T_MAX_ID: T_MAX_ID,
  T_STRING: T_STRING
});

// node tables
const NODE_N_TABLE = 9;

const NODE_STAT                 = 0;

/** @deprecated */
const NODE_MASTER_BLOCK$1         = 1;


const NODE_MASTER_BLOCK_CONTENT$1 = 2;
const NODE_MICRO_BLOCK$1          = 3;
const NODE_MICRO_CHAIN$1          = 4;
const NODE_RADIX                = 5;
const NODE_OBJECT_BY_PUBLIC_KEY$1 = 6;
const NODE_ACCOUNT              = 7;
const NODE_CONSUMPTION$1          = 8;

const NODE_CHAIN_STATUS_KEY = "CHAIN_STATUS";

var db = /*#__PURE__*/Object.freeze({
  __proto__: null,
  NODE_ACCOUNT: NODE_ACCOUNT,
  NODE_CHAIN_STATUS_KEY: NODE_CHAIN_STATUS_KEY,
  NODE_CONSUMPTION: NODE_CONSUMPTION$1,
  NODE_MASTER_BLOCK: NODE_MASTER_BLOCK$1,
  NODE_MASTER_BLOCK_CONTENT: NODE_MASTER_BLOCK_CONTENT$1,
  NODE_MICRO_BLOCK: NODE_MICRO_BLOCK$1,
  NODE_MICRO_CHAIN: NODE_MICRO_CHAIN$1,
  NODE_N_TABLE: NODE_N_TABLE,
  NODE_OBJECT_BY_PUBLIC_KEY: NODE_OBJECT_BY_PUBLIC_KEY$1,
  NODE_RADIX: NODE_RADIX,
  NODE_STAT: NODE_STAT
});

// generic
const NONE                     = 0x0000;
const UNKNOWN_ERROR            = 0x0001;
const NETWORK_ERROR            = 0x0002;
const MESSAGE_ERROR            = 0x0003;
const SERVER_ERROR             = 0x0004;
const INVALID_ARGUMENT_ERROR             = 4001;

// account
const INVALID_EMAIL            = 0x0100;
const PASSWORD_TOO_WEAK        = 0x0101;
const UNKNOWN_IDENTIFIER_TYPE  = 0x0102;
const DUPLICATE_EMAIL          = 0x0103;
const DUPLICATE_PHONE_NUMBER   = 0x0104;
const UNKNOWN_USER             = 0x0105;
const INVALID_PASSWORD         = 0x0106;
const MAIL_ALREADY_VERIFIED    = 0x0107;
const MAIL_NOT_VERIFIED        = 0x0108;
const OTP_ALREADY_PENDING      = 0x0109;
const OTP_EXPIRED              = 0x010A;
const INVALID_OTP              = 0x010B;
const INVALID_KEY              = 0x010C;

// blockchain
const NOT_A_MICROBLOCK         = 0x0100;
const INVALID_VERSION          = 0x0101;
const INVALID_HEADER_SIZE      = 0x0102;
const INVALID_BODY_SIZE        = 0x0103;
const TS_TOO_OLD               = 0x0104;
const TS_TOO_FAR_AHEAD         = 0x0105;
const INVALID_SIGNATURE        = 0x0106;

var errors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DUPLICATE_EMAIL: DUPLICATE_EMAIL,
  DUPLICATE_PHONE_NUMBER: DUPLICATE_PHONE_NUMBER,
  INVALID_ARGUMENT_ERROR: INVALID_ARGUMENT_ERROR,
  INVALID_BODY_SIZE: INVALID_BODY_SIZE,
  INVALID_EMAIL: INVALID_EMAIL,
  INVALID_HEADER_SIZE: INVALID_HEADER_SIZE,
  INVALID_KEY: INVALID_KEY,
  INVALID_OTP: INVALID_OTP,
  INVALID_PASSWORD: INVALID_PASSWORD,
  INVALID_SIGNATURE: INVALID_SIGNATURE,
  INVALID_VERSION: INVALID_VERSION,
  MAIL_ALREADY_VERIFIED: MAIL_ALREADY_VERIFIED,
  MAIL_NOT_VERIFIED: MAIL_NOT_VERIFIED,
  MESSAGE_ERROR: MESSAGE_ERROR,
  NETWORK_ERROR: NETWORK_ERROR,
  NONE: NONE,
  NOT_A_MICROBLOCK: NOT_A_MICROBLOCK,
  OTP_ALREADY_PENDING: OTP_ALREADY_PENDING,
  OTP_EXPIRED: OTP_EXPIRED,
  PASSWORD_TOO_WEAK: PASSWORD_TOO_WEAK,
  SERVER_ERROR: SERVER_ERROR,
  TS_TOO_FAR_AHEAD: TS_TOO_FAR_AHEAD,
  TS_TOO_OLD: TS_TOO_OLD,
  UNKNOWN_ERROR: UNKNOWN_ERROR,
  UNKNOWN_IDENTIFIER_TYPE: UNKNOWN_IDENTIFIER_TYPE,
  UNKNOWN_USER: UNKNOWN_USER
});

const CREATE_IDENTITY       = 0x00;
const SET_SIGNATORY         = 0x01;
const CREATE_SCHEMA         = 0x02;
const CREATE_CHANNEL        = 0x03;
const SHARED_KEY_MEMBER     = 0x04;
const SHARED_KEY_REG_USER   = 0x05;
const SHARED_KEY_UNREG_USER = 0x06;
const INVITE                = 0x07;
const PUBLIC_DATA           = 0x08;
const PRIVATE_DATA          = 0x09;
const MERKLIZED_DATA        = 0x0A;
const PUBLIC_FILE           = 0x0B;
const PRIVATE_FILE          = 0x0C;
const MERKLIZED_FILE        = 0x0D;
const ACCOUNT_OPERATION     = 0x0E;

const NAME$1 = [
  'CREATE_IDENTITY',
  'SET_SIGNATORY',
  'CREATE_SCHEMA',
  'CREATE_CHANNEL',
  'SHARED_KEY_MEMBER',
  'SHARED_KEY_REG_USER',
  'SHARED_KEY_UNREG_USER',
  'INVITE',
  'PUBLIC_DATA',
  'PRIVATE_DATA',
  'MERKLIZED_DATA',
  'PUBLIC_FILE',
  'PRIVATE_FILE',
  'MERKLIZED_FILE',
  'ACCOUNT_OPERATION'
];

var events = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ACCOUNT_OPERATION: ACCOUNT_OPERATION,
  CREATE_CHANNEL: CREATE_CHANNEL,
  CREATE_IDENTITY: CREATE_IDENTITY,
  CREATE_SCHEMA: CREATE_SCHEMA,
  INVITE: INVITE,
  MERKLIZED_DATA: MERKLIZED_DATA,
  MERKLIZED_FILE: MERKLIZED_FILE,
  NAME: NAME$1,
  PRIVATE_DATA: PRIVATE_DATA,
  PRIVATE_FILE: PRIVATE_FILE,
  PUBLIC_DATA: PUBLIC_DATA,
  PUBLIC_FILE: PUBLIC_FILE,
  SET_SIGNATORY: SET_SIGNATORY,
  SHARED_KEY_MEMBER: SHARED_KEY_MEMBER,
  SHARED_KEY_REG_USER: SHARED_KEY_REG_USER,
  SHARED_KEY_UNREG_USER: SHARED_KEY_UNREG_USER
});

// object types
const OBJ_ACCOUNT      = 0;
const OBJ_NODE         = 1;
const OBJ_ORGANIZATION = 2;
const OBJ_USER         = 3;
const OBJ_APPLICATION  = 4;
const OBJ_FLOW         = 5;
const OBJ_ORACLE       = 6;

const N_OBJECTS = 7;

const OBJECT_NAME = [
  "account",
  "node",
  "organization",
  "user",
  "application",
  "flow",
  "oracle"
];

// block states
const BLOCK_PENDING  = 0;
const BLOCK_CLOSED   = 1;
const BLOCK_ANCHORED = 2;

// identifiers
const IDENTIFIER_EMAIL        = 0;
const IDENTIFIER_PHONE_NUMBER = 1;

var id = /*#__PURE__*/Object.freeze({
  __proto__: null,
  BLOCK_ANCHORED: BLOCK_ANCHORED,
  BLOCK_CLOSED: BLOCK_CLOSED,
  BLOCK_PENDING: BLOCK_PENDING,
  IDENTIFIER_EMAIL: IDENTIFIER_EMAIL,
  IDENTIFIER_PHONE_NUMBER: IDENTIFIER_PHONE_NUMBER,
  N_OBJECTS: N_OBJECTS,
  OBJECT_NAME: OBJECT_NAME,
  OBJ_ACCOUNT: OBJ_ACCOUNT,
  OBJ_APPLICATION: OBJ_APPLICATION,
  OBJ_FLOW: OBJ_FLOW,
  OBJ_NODE: OBJ_NODE,
  OBJ_ORACLE: OBJ_ORACLE,
  OBJ_ORGANIZATION: OBJ_ORGANIZATION,
  OBJ_USER: OBJ_USER
});

// retrieving data from a node
const GET_CHAIN_STATUS         = 0x00;
const GET_SEARCH_RESULTS       = 0x01;
const GET_MASTERBLOCK_LIST     = 0x02;
const GET_MASTERBLOCK          = 0x03;
const GET_MICROCHAIN_INFO      = 0x04;
const GET_MICROCHAIN_CONTENT   = 0x05;
const GET_MICROBLOCK           = 0x06;
const GET_MICROBLOCKS          = 0x07;
const GET_OBJECT_BY_PUBLIC_KEY = 0x08;
const GET_CONSUMPTION          = 0x09;
const WAIT_FOR_ANCHORING       = 0x0A;

// sending data to a node
const SEND_MICROBLOCK          = 0x10;
const CREATE_GENESIS           = 0x11;

// attachments and temporary storage
const SEND_FILE                = 0x20;
const GET_FILE                 = 0x21;

// messages to account and key servers
const CREATE_ACCOUNT           = 0x30;
const SYNC_ACCOUNT             = 0x31;
const GET_SALT                 = 0x32;
const SIGN_IN                  = 0x33;
const SIGN_OUT                 = 0x34;
const GET_KEY_ENCRYPTION_KEY   = 0x35;
const INIT_MAIL_CONF           = 0x36;
const MAIL_CONF                = 0x37;
const PUT_DATA                 = 0x38;
const GET_DATA                 = 0x39;
const PUT_MICROCHAIN_LINK      = 0x3A;
const GET_MICROCHAIN_LINKS     = 0x3B;

// answers
const ANS_OK                   = 0x80;
const ANS_ID                   = 0x81;
const ANS_STRING               = 0x82;
const ANS_FILE                 = 0x83;
const ANS_BIN256               = 0x84;
const ANS_CHAIN_STATUS         = 0x85;
const ANS_MASTERBLOCK_LIST     = 0x86;
const ANS_MASTERBLOCK          = 0x87;
const ANS_MICROCHAIN_INFO      = 0x88;
const ANS_MICROCHAIN_CONTENT   = 0x89;
const ANS_MICROBLOCK           = 0x8A;
const ANS_MICROBLOCKS          = 0x8B;
const ANS_ACCEPT_MICROBLOCK    = 0x8C;
const ANS_CONSUMPTION          = 0x8D;
const ANS_ANCHORING            = 0x8E;

const ANS_ERROR                = 0xFF;

var messages = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ANS_ACCEPT_MICROBLOCK: ANS_ACCEPT_MICROBLOCK,
  ANS_ANCHORING: ANS_ANCHORING,
  ANS_BIN256: ANS_BIN256,
  ANS_CHAIN_STATUS: ANS_CHAIN_STATUS,
  ANS_CONSUMPTION: ANS_CONSUMPTION,
  ANS_ERROR: ANS_ERROR,
  ANS_FILE: ANS_FILE,
  ANS_ID: ANS_ID,
  ANS_MASTERBLOCK: ANS_MASTERBLOCK,
  ANS_MASTERBLOCK_LIST: ANS_MASTERBLOCK_LIST,
  ANS_MICROBLOCK: ANS_MICROBLOCK,
  ANS_MICROBLOCKS: ANS_MICROBLOCKS,
  ANS_MICROCHAIN_CONTENT: ANS_MICROCHAIN_CONTENT,
  ANS_MICROCHAIN_INFO: ANS_MICROCHAIN_INFO,
  ANS_OK: ANS_OK,
  ANS_STRING: ANS_STRING,
  CREATE_ACCOUNT: CREATE_ACCOUNT,
  CREATE_GENESIS: CREATE_GENESIS,
  GET_CHAIN_STATUS: GET_CHAIN_STATUS,
  GET_CONSUMPTION: GET_CONSUMPTION,
  GET_DATA: GET_DATA,
  GET_FILE: GET_FILE,
  GET_KEY_ENCRYPTION_KEY: GET_KEY_ENCRYPTION_KEY,
  GET_MASTERBLOCK: GET_MASTERBLOCK,
  GET_MASTERBLOCK_LIST: GET_MASTERBLOCK_LIST,
  GET_MICROBLOCK: GET_MICROBLOCK,
  GET_MICROBLOCKS: GET_MICROBLOCKS,
  GET_MICROCHAIN_CONTENT: GET_MICROCHAIN_CONTENT,
  GET_MICROCHAIN_INFO: GET_MICROCHAIN_INFO,
  GET_MICROCHAIN_LINKS: GET_MICROCHAIN_LINKS,
  GET_OBJECT_BY_PUBLIC_KEY: GET_OBJECT_BY_PUBLIC_KEY,
  GET_SALT: GET_SALT,
  GET_SEARCH_RESULTS: GET_SEARCH_RESULTS,
  INIT_MAIL_CONF: INIT_MAIL_CONF,
  MAIL_CONF: MAIL_CONF,
  PUT_DATA: PUT_DATA,
  PUT_MICROCHAIN_LINK: PUT_MICROCHAIN_LINK,
  SEND_FILE: SEND_FILE,
  SEND_MICROBLOCK: SEND_MICROBLOCK,
  SIGN_IN: SIGN_IN,
  SIGN_OUT: SIGN_OUT,
  SYNC_ACCOUNT: SYNC_ACCOUNT,
  WAIT_FOR_ANCHORING: WAIT_FOR_ANCHORING
});

const INT64   = 0x00;
const UINT8$1   = 0x01;
const UINT16  = 0x02;
const UINT24  = 0x03;
const UINT32  = 0x04;
const UINT48  = 0x05;
const STRING$1  = 0x06;
const OBJECT$1  = 0x07;
const ARRAY$1   = 0x08;
const BINARY$1  = 0x09;
const BIN128  = 0x0A;
const BIN256  = 0x0B;
const BIN264  = 0x0C;
const BIN512  = 0x0D;
const CTR_KEY = 0x0E;
const GCM_KEY = 0x0F;

const HASH        = BIN256;
const AES_KEY     = BIN256;
const EC_PUB_KEY  = BIN264;
const EC_PRV_KEY  = BIN256;
const RSA_PUB_KEY = BINARY$1;
const RSA_PRV_KEY = BINARY$1;
const SIGNATURE   = BIN512;

const NAME = [
  "INT64",
  "UINT8",
  "UINT16",
  "UINT24",
  "UINT32",
  "UINT48",
  "STRING",
  "OBJECT",
  "ARRAY",
  "BINARY",
  "BIN128",
  "BIN256",
  "BIN264",
  "BIN512",
  "CTR_KEY",
  "GCM_KEY"
];

var types = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AES_KEY: AES_KEY,
  ARRAY: ARRAY$1,
  BIN128: BIN128,
  BIN256: BIN256,
  BIN264: BIN264,
  BIN512: BIN512,
  BINARY: BINARY$1,
  CTR_KEY: CTR_KEY,
  EC_PRV_KEY: EC_PRV_KEY,
  EC_PUB_KEY: EC_PUB_KEY,
  GCM_KEY: GCM_KEY,
  HASH: HASH,
  INT64: INT64,
  NAME: NAME,
  OBJECT: OBJECT$1,
  RSA_PRV_KEY: RSA_PRV_KEY,
  RSA_PUB_KEY: RSA_PUB_KEY,
  SIGNATURE: SIGNATURE,
  STRING: STRING$1,
  UINT16: UINT16,
  UINT24: UINT24,
  UINT32: UINT32,
  UINT48: UINT48,
  UINT8: UINT8$1
});

// ============================================================================================================================ //
//  Miscellaneous                                                                                                               //
// ============================================================================================================================ //
const ERROR = [
  { name: "id", type: UINT16 }
];

const BINARY = [
  { name: "data", type: BINARY$1 }
];

const SIGNED_DATA = [
  { name: "data",      type: BINARY$1 },
  { name: "signature", type: SIGNATURE }
];

// ============================================================================================================================ //
//  Wallet interface                                                                                                            //
// ============================================================================================================================ //
const WI_REQUEST = [
  { name: "deviceId",   type: BIN128 },
  { name: "ip",         type: STRING$1 },
  { name: "userAgent",  type: STRING$1 },
  { name: "timestamp",  type: UINT48 },
  { name: "seed",       type: BINARY$1, size: 12 }
];

const WI_ANSWER = [
  { name: "requestId", type: BIN256 },
  { name: "publicKey", type: BIN264 }
];

// ============================================================================================================================ //
//  Node database                                                                                                               //
// ============================================================================================================================ //
const NODE_CHAIN_STATUS = [
  { name: "lastMasterBlockId",   type: UINT48 },
  { name: "lastMasterBlockHash", type: HASH },
  { name: "microBlockCounter",   type: UINT48 },
  { name: "sectionCounter",      type: UINT48 },
  { name: "objectCounter",       type: ARRAY$1, size: N_OBJECTS, content: { type: UINT48 } }
];

const NODE_MASTER_BLOCK = [
  { name: "timestamp",   type: UINT48 },
  { name: "hash",        type: HASH },
  { name: "node",        type: HASH },
  { name: "size",        type: UINT48 },
  { name: "nMicroblock", type: UINT48 }
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

const NODE_MICRO_BLOCK = [
  { name: "microChainId", type: HASH },
  { name: "previousHash", type: HASH },
  { name: "type",         type: UINT8$1 },
  { name: "masterBlock",  type: UINT48 },
  { name: "index",        type: UINT32 },
  { name: "offset",       type: UINT32 }
];

const NODE_MICRO_CHAIN = [
  { name: "nonce",         type: UINT48 },
  { name: "type",          type: UINT8$1 },
  { name: "lastBlockHash", type: HASH }
];

const NODE_OBJECT_BY_PUBLIC_KEY = [
  { name: "microChainId", type: HASH }
];

const NODE_CONSUMPTION = [
  { name: "flows",   type: UINT48 },
  { name: "records", type: UINT48 },
  { name: "bytes",   type: UINT48 }
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
  [ GET_OBJECT_BY_PUBLIC_KEY ] : [
    { name: "publicKey", type: BIN264 }
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
    { name: "data", type: BINARY$1 }
  ],
  [ CREATE_GENESIS ] : [
    { name: "list", type: ARRAY$1, content: { type: BINARY$1 } }
  ],

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  attachments and temporary storage                                                                                         //
  // -------------------------------------------------------------------------------------------------------------------------- //
  [ SEND_FILE ] : [
    { name: "data", type: BINARY$1 }
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
    { name: "data", type: BINARY$1 }
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
    { name: "header", type: OBJECT$1, schema: [
        { name: "ts", type: UINT48 },
        { name: "nodeId", type: BINARY$1, size: 20 },
        { name: "previousHash", type: HASH },
        { name: "nonce", type: UINT48 },
        { name: "merkleRootHash", type: HASH },
        { name: "radixRootHash", type: HASH },
        { name: "chainId", type: STRING$1 }
      ]
    },
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
    { name: "content",      type: BINARY$1 }
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

// ============================================================================================================================ //
//  Micro-block sections                                                                                                        //
// ============================================================================================================================ //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Account                                                                                                                     //
// ---------------------------------------------------------------------------------------------------------------------------- //
const SECTION_ACCOUNT = {
  [ S_ACCT_DECLARATION ] : {
    public: [
      { name: "publicKey", type: BIN264 },
      { name: "creatorId", type: HASH }
    ]
  },
  [ S_ACCT_ISSUING ] : {
    public: [
      { name: "amount", type: UINT48 }
    ]
  },
  [ S_ACCT_TRANSFER ] : {
    public: [
      { name: "amount",    type: UINT48 },
      { name: "accountId", type: HASH },
      { name: "comment",   type: STRING$1, maxSize: 120 } // TODO: encrypted with a shared key?
    ]
  }
};

// ---------------------------------------------------------------------------------------------------------------------------- //
//  Node                                                                                                                        //
// ---------------------------------------------------------------------------------------------------------------------------- //
const SECTION_NODE = {
  [ S_NODE_DECLARATION ] : {
    public: [
      { name: "publicKey",        type: BIN264 },
      { name: "cometPublicKey",   type: BINARY$1, size: 20 },
      { name: "cometVotingPower", type: UINT48 },
      { name: "accountId",        type: HASH },
      { name: "accountSignature", type: BINARY$1 }
    ],
    private: [
      { name: "name",     type: STRING$1 },
      { name: "endpoint", type: STRING$1 }
    ]
  }
};

// ---------------------------------------------------------------------------------------------------------------------------- //
//  Organization                                                                                                                //
// ---------------------------------------------------------------------------------------------------------------------------- //
const SECTION_ORGANIZATION = {
  [ S_ORG_PUBLIC_KEY ] : {
    public: [
      { name: "publicKey", type: BIN264 }
    ]
  },
  [ S_ORG_ACCOUNT ] : {
    public: [
      { name: "id",        type: HASH },
      { name: "signature", type: BINARY$1 }
    ]
  },
  [ S_ORG_DESCRIPTION ] : {
    public: [
      { name: "name",        type: STRING$1 },
      { name: "city",        type: STRING$1 },
      { name: "countryCode", type: STRING$1, size: 2 },
      { name: "website",     type: STRING$1 }
    ]
  },
  [ S_ORG_SERVER ] : {
    public: [
      { name: "endpoint", type: STRING$1 }
    ]
  }
};

// ---------------------------------------------------------------------------------------------------------------------------- //
//  User                                                                                                                        //
// ---------------------------------------------------------------------------------------------------------------------------- //
const SECTION_USER = {
  [ S_USER_DECLARATION ] : {
    public: [
      { name: "publicApplicationKey", type: BIN264 }
    ],
    private: [
      { name: "publicAccountKey", type: BIN264 }
    ]
  },
  [ S_USER_PROOF ] : {
    public: [
      { name: "oracleId",   type: BIN256 },
      { name: "serviceId",  type: UINT8$1 },
      { name: "merkleHash", type: HASH },
      { name: "signature",  type: BINARY$1 }
    ],
    private: [
      { name: "padding",      type: BINARY$1 },
      { name: "merklePepper", type: BIN128 },
      { name: "fieldData",    type: BINARY$1 }
    ]
  },
};

// ---------------------------------------------------------------------------------------------------------------------------- //
//  Application                                                                                                                 //
// ---------------------------------------------------------------------------------------------------------------------------- //
const SECTION_APPLICATION = {
  [ S_APP_DECLARATION ] : {
    public: [
      { name: "organizationId", type: BIN256 }
    ]
  },
  [ S_APP_DESCRIPTION ] : {
    public: [
      { name: "name",        type: STRING$1 },
      { name: "logoUrl",     type: STRING$1 },
      { name: "homepageUrl", type: STRING$1 },
      { name: "rootDomain",  type: STRING$1 }
    ]
  },
  [ S_APP_DEFINITION ] : {
    public: [
      { name: "version",    type: UINT16 },
      { name: "definition", type: BINARY$1 }
    ]
  }
};

// ---------------------------------------------------------------------------------------------------------------------------- //
//  Flow                                                                                                                        //
// ---------------------------------------------------------------------------------------------------------------------------- //
const SECTION_FLOW = {
  [ S_FLOW_DECLARATION ] : {
    public: [
      { name: "applicationId", type: BIN256 },
      { name: "version",       type: UINT16 }
    ]
  },
  [ S_FLOW_UPDATE ] : {
    public: [
      { name: "version", type: UINT16 }
    ]
  },
  [ S_FLOW_HEADER ] : {
    public: [
      { name: "nonce",     type: UINT48 },
      { name: "messageId", type: UINT16 },
      { name: "approver",  type: UINT8$1 }
    ]
  },
  [ S_FLOW_ACTOR ] : {
    public: [
      { name: "id",   type: UINT8$1 },
      { name: "name", type: STRING$1 }
    ],
    private: [
      { name: "userId",    type: BIN256 },
      { name: "signature", type: BINARY$1 }
    ]
  },
  [ S_FLOW_CHANNEL ] : {
    public: [
      { name: "id",   type: UINT8$1 },
      { name: "name", type: STRING$1 }
    ]
  },
  [ S_FLOW_SUBSCRIPTION ] : {
    public: [
      { name: "channelId", type: UINT8$1 },
      { name: "actorId",   type: UINT8$1 }
    ],
    private: [
      { name: "channelKey", type: BIN256 }
    ]
  },
  [ S_FLOW_PUBLIC_DATA ] : {
    public: [
      { name: "fieldList",   type: BINARY$1 },
      { name: "accessRules", type: BINARY$1 },
      { name: "fieldData",   type: BINARY$1 }
    ]
  },
  [ S_FLOW_CHANNEL_DATA ] : {
    public: [
      { name: "channelId",  type: UINT8$1 },
      { name: "merkleHash", type: HASH }
    ],
    private: [
      { name: "padding",      type: BINARY$1 },
      { name: "merklePepper", type: BIN128 },
      { name: "fieldData",    type: BINARY$1 }
    ]
  },
  [ S_FLOW_APPROVAL ] : {
    public: [
      { name: "signature", type: BINARY$1 }
    ]
  }
};

// ---------------------------------------------------------------------------------------------------------------------------- //
//  Final array                                                                                                                 //
// ---------------------------------------------------------------------------------------------------------------------------- //
const SECTION = [
  SECTION_ACCOUNT,
  SECTION_NODE,
  SECTION_ORGANIZATION,
  SECTION_USER,
  SECTION_APPLICATION,
  SECTION_FLOW
];

var schemas = /*#__PURE__*/Object.freeze({
  __proto__: null,
  BINARY: BINARY,
  ERROR: ERROR,
  MESSAGE: MESSAGE,
  NODE_CHAIN_STATUS: NODE_CHAIN_STATUS,
  NODE_CONSUMPTION: NODE_CONSUMPTION,
  NODE_MASTER_BLOCK: NODE_MASTER_BLOCK,
  NODE_MASTER_BLOCK_CONTENT: NODE_MASTER_BLOCK_CONTENT,
  NODE_MICRO_BLOCK: NODE_MICRO_BLOCK,
  NODE_MICRO_CHAIN: NODE_MICRO_CHAIN,
  NODE_OBJECT_BY_PUBLIC_KEY: NODE_OBJECT_BY_PUBLIC_KEY,
  SECTION: SECTION,
  SIGNED_DATA: SIGNED_DATA,
  WI_ANSWER: WI_ANSWER,
  WI_REQUEST: WI_REQUEST
});

const TABLE_ACCOUNT = 'account';
const TABLE_SESSION = 'session';
const TABLE_CACHE   = 'cache';

var storage = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TABLE_ACCOUNT: TABLE_ACCOUNT,
  TABLE_CACHE: TABLE_CACHE,
  TABLE_SESSION: TABLE_SESSION
});

// ============================================================================================================================ //
//  Authentication methods                                                                                                      //
// ============================================================================================================================ //
const AUTH_NONE  = 0x00;
const AUTH_EMAIL = 0x01;

const AUTH_NAME = [
  "by the operator",
  "by email"
];

// ============================================================================================================================ //
//  Session statuses                                                                                                            //
// ============================================================================================================================ //
const SESSION_CURRENT    = 0;
const SESSION_ACTIVE     = 1;
const SESSION_SIGNED_OUT = 2;

const SESSION_STATUS_NAME = [
  "current session",
  "active",
  "signed out"
];

// ============================================================================================================================ //
//  User statuses                                                                                                               //
// ============================================================================================================================ //
const ST_SUSPENDED = 0;
const ST_ACTIVE    = 1;
const ST_INVITED   = 2;

const USER_STATUS_NAME = [
  "suspended",
  "active",
  "invited"
];

var user = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AUTH_EMAIL: AUTH_EMAIL,
  AUTH_NAME: AUTH_NAME,
  AUTH_NONE: AUTH_NONE,
  SESSION_ACTIVE: SESSION_ACTIVE,
  SESSION_CURRENT: SESSION_CURRENT,
  SESSION_SIGNED_OUT: SESSION_SIGNED_OUT,
  SESSION_STATUS_NAME: SESSION_STATUS_NAME,
  ST_ACTIVE: ST_ACTIVE,
  ST_INVITED: ST_INVITED,
  ST_SUSPENDED: ST_SUSPENDED,
  USER_STATUS_NAME: USER_STATUS_NAME
});

const CLIENT_STORAGE_KEY = "CWI-client";
const WALLET_STORAGE_KEY = "CWI-wallet";

const REQ_SIGN_IN        = 0;
const REQ_AUTHENTICATION = 1;
const REQ_EVENT_APPROVAL = 2;

const REQ_RECIPIENT_IS_SERVER = [
  false,
  false,
  true
];

const REQ_NAME = [
  "signIn",
  "authentication",
  "eventApproval"
];

// TTL of device cookie, in seconds
const DEVICE_COOKIE_TTL = 180 * 24 * 60 * 60;

// timeout for reconnection of client or wallet, in milliseconds
// (how long does one wait for the other's socket to be reconnected)
const RECONNECTION_TIMEOUT = 500;

const MSG_MSK = 0x7F;
const MSG_ACK = 0x80;

const MSG_SDK_CONNECTION         = 0x00 | MSG_ACK;
const MSG_SDK_RECONNECTION       = 0x01 | MSG_ACK;
const MSG_UPDATE_QR_ID           = 0x02;
const MSG_GET_CONNECTION_INFO    = 0x03 | MSG_ACK;
const MSG_ACCEPT_CONNECTION      = 0x04;
const MSG_REJECT_CONNECTION      = 0x05;
const MSG_WALLET_CONNECTED       = 0x06 | MSG_ACK;
const MSG_EXPIRED                = 0x07;
const MSG_REQUEST_DATA           = 0x08;
const MSG_FORWARDED_REQUEST_DATA = 0x09;
const MSG_ANSWER_CLIENT          = 0x0A;
const MSG_FORWARDED_ANSWER       = 0x0B;
const MSG_ANSWER_SERVER          = 0x0C;
const MSG_SERVER_TO_WALLET       = 0x0D;
const MSG_WALLET_RECONNECTION    = 0x0E | MSG_ACK;

// delays expressed in seconds
const QR_REFRESH_PERIOD  = 20;
const QR_FLASH_PERIOD    = 25;
const REQUEST_ACK_PERIOD = 120;
const REQUEST_TTL        = 600; // 180;

const ST_UNKNOWN   = 0;
const ST_PENDING   = 1;
const ST_LOCKED    = 2;
const ST_CONNECTED = 3;
const ST_REJECTED  = 4;
const ST_ACCEPTED  = 5;

var walletInterface = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CLIENT_STORAGE_KEY: CLIENT_STORAGE_KEY,
  DEVICE_COOKIE_TTL: DEVICE_COOKIE_TTL,
  MSG_ACCEPT_CONNECTION: MSG_ACCEPT_CONNECTION,
  MSG_ACK: MSG_ACK,
  MSG_ANSWER_CLIENT: MSG_ANSWER_CLIENT,
  MSG_ANSWER_SERVER: MSG_ANSWER_SERVER,
  MSG_EXPIRED: MSG_EXPIRED,
  MSG_FORWARDED_ANSWER: MSG_FORWARDED_ANSWER,
  MSG_FORWARDED_REQUEST_DATA: MSG_FORWARDED_REQUEST_DATA,
  MSG_GET_CONNECTION_INFO: MSG_GET_CONNECTION_INFO,
  MSG_MSK: MSG_MSK,
  MSG_REJECT_CONNECTION: MSG_REJECT_CONNECTION,
  MSG_REQUEST_DATA: MSG_REQUEST_DATA,
  MSG_SDK_CONNECTION: MSG_SDK_CONNECTION,
  MSG_SDK_RECONNECTION: MSG_SDK_RECONNECTION,
  MSG_SERVER_TO_WALLET: MSG_SERVER_TO_WALLET,
  MSG_UPDATE_QR_ID: MSG_UPDATE_QR_ID,
  MSG_WALLET_CONNECTED: MSG_WALLET_CONNECTED,
  MSG_WALLET_RECONNECTION: MSG_WALLET_RECONNECTION,
  QR_FLASH_PERIOD: QR_FLASH_PERIOD,
  QR_REFRESH_PERIOD: QR_REFRESH_PERIOD,
  RECONNECTION_TIMEOUT: RECONNECTION_TIMEOUT,
  REQUEST_ACK_PERIOD: REQUEST_ACK_PERIOD,
  REQUEST_TTL: REQUEST_TTL,
  REQ_AUTHENTICATION: REQ_AUTHENTICATION,
  REQ_EVENT_APPROVAL: REQ_EVENT_APPROVAL,
  REQ_NAME: REQ_NAME,
  REQ_RECIPIENT_IS_SERVER: REQ_RECIPIENT_IS_SERVER,
  REQ_SIGN_IN: REQ_SIGN_IN,
  ST_ACCEPTED: ST_ACCEPTED,
  ST_CONNECTED: ST_CONNECTED,
  ST_LOCKED: ST_LOCKED,
  ST_PENDING: ST_PENDING,
  ST_REJECTED: ST_REJECTED,
  ST_UNKNOWN: ST_UNKNOWN,
  WALLET_STORAGE_KEY: WALLET_STORAGE_KEY
});

var CST = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CONFIG: config,
  COUNTRY: country$1,
  CURRENCY: currency,
  DATA: data,
  DB: db,
  ERROR: errors,
  EVT: events,
  ID: id,
  MSG: messages,
  SCHEMA: schemas,
  STOR: storage,
  TYPE: types,
  USER: user,
  WI: walletInterface
});

function isBytes$1(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes$1(b, ...lengths) {
  if (!isBytes$1(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function exists$1(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output$1(out, instance) {
  bytes$1(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}

// ../esm/utils.js
var u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
var createView$1 = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE)
  throw new Error("Non little-endian hardware is not supported");
function utf8ToBytes$1(str) {
  if (typeof str !== "string")
    throw new Error(`string expected, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes$1(data) {
  if (typeof data === "string")
    data = utf8ToBytes$1(data);
  else if (isBytes$1(data))
    data = copyBytes(data);
  else
    throw new Error(`Uint8Array expected, got ${typeof data}`);
  return data;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
var wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, c) => {
  Object.assign(c, params);
  return c;
};
function setBigUint64$1(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function isAligned32(bytes2) {
  return bytes2.byteOffset % 4 === 0;
}
function copyBytes(bytes2) {
  return Uint8Array.from(bytes2);
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}

// ../esm/_arx.js
var _utf8ToBytes = (str) => Uint8Array.from(str.split("").map((c) => c.charCodeAt(0)));
var sigma16 = _utf8ToBytes("expand 16-byte k");
var sigma32 = _utf8ToBytes("expand 32-byte k");
u32(sigma16);
var sigma32_32 = u32(sigma32);
sigma32_32.slice();
BigInt(2) ** BigInt(130) - BigInt(5);
BigInt(2) ** BigInt(16 * 8) - BigInt(1);
BigInt("0x0ffffffc0ffffffc0ffffffc0fffffff");
BigInt(0);
BigInt(1);

// ../esm/_polyval.js
var BLOCK_SIZE = 16;
var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
var ZEROS32 = u32(ZEROS16);
var POLY = 225;
var mul2 = (s0, s1, s2, s3) => {
  const hiBit = s3 & 1;
  return {
    s3: s2 << 31 | s3 >>> 1,
    s2: s1 << 31 | s2 >>> 1,
    s1: s0 << 31 | s1 >>> 1,
    s0: s0 >>> 1 ^ POLY << 24 & -(hiBit & 1)
    // reduce % poly
  };
};
var swapLE = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0;
function _toGHASHKey(k) {
  k.reverse();
  const hiBit = k[15] & 1;
  let carry = 0;
  for (let i = 0; i < k.length; i++) {
    const t = k[i];
    k[i] = t >>> 1 | carry;
    carry = (t & 1) << 7;
  }
  k[0] ^= -hiBit & 225;
  return k;
}
var estimateWindow = (bytes2) => {
  if (bytes2 > 64 * 1024)
    return 8;
  if (bytes2 > 1024)
    return 4;
  return 2;
};
var GHASH = class {
  // We select bits per window adaptively based on expectedLength
  constructor(key, expectedLength) {
    this.blockLen = BLOCK_SIZE;
    this.outputLen = BLOCK_SIZE;
    this.s0 = 0;
    this.s1 = 0;
    this.s2 = 0;
    this.s3 = 0;
    this.finished = false;
    key = toBytes$1(key);
    bytes$1(key, 16);
    const kView = createView$1(key);
    let k0 = kView.getUint32(0, false);
    let k1 = kView.getUint32(4, false);
    let k2 = kView.getUint32(8, false);
    let k3 = kView.getUint32(12, false);
    const doubles = [];
    for (let i = 0; i < 128; i++) {
      doubles.push({ s0: swapLE(k0), s1: swapLE(k1), s2: swapLE(k2), s3: swapLE(k3) });
      ({ s0: k0, s1: k1, s2: k2, s3: k3 } = mul2(k0, k1, k2, k3));
    }
    const W = estimateWindow(expectedLength || 1024);
    if (![1, 2, 4, 8].includes(W))
      throw new Error(`ghash: wrong window size=${W}, should be 2, 4 or 8`);
    this.W = W;
    const bits = 128;
    const windows = bits / W;
    const windowSize = this.windowSize = 2 ** W;
    const items = [];
    for (let w = 0; w < windows; w++) {
      for (let byte = 0; byte < windowSize; byte++) {
        let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
        for (let j = 0; j < W; j++) {
          const bit = byte >>> W - j - 1 & 1;
          if (!bit)
            continue;
          const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
          s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
        }
        items.push({ s0, s1, s2, s3 });
      }
    }
    this.t = items;
  }
  _updateBlock(s0, s1, s2, s3) {
    s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
    const { W, t, windowSize } = this;
    let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
    const mask = (1 << W) - 1;
    let w = 0;
    for (const num of [s0, s1, s2, s3]) {
      for (let bytePos = 0; bytePos < 4; bytePos++) {
        const byte = num >>> 8 * bytePos & 255;
        for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
          const bit = byte >>> W * bitPos & mask;
          const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
          o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
          w += 1;
        }
      }
    }
    this.s0 = o0;
    this.s1 = o1;
    this.s2 = o2;
    this.s3 = o3;
  }
  update(data) {
    data = toBytes$1(data);
    exists$1(this);
    const b32 = u32(data);
    const blocks = Math.floor(data.length / BLOCK_SIZE);
    const left = data.length % BLOCK_SIZE;
    for (let i = 0; i < blocks; i++) {
      this._updateBlock(b32[i * 4 + 0], b32[i * 4 + 1], b32[i * 4 + 2], b32[i * 4 + 3]);
    }
    if (left) {
      ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
      this._updateBlock(ZEROS32[0], ZEROS32[1], ZEROS32[2], ZEROS32[3]);
      clean(ZEROS32);
    }
    return this;
  }
  destroy() {
    const { t } = this;
    for (const elm of t) {
      elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
    }
  }
  digestInto(out) {
    exists$1(this);
    output$1(out, this);
    this.finished = true;
    const { s0, s1, s2, s3 } = this;
    const o32 = u32(out);
    o32[0] = s0;
    o32[1] = s1;
    o32[2] = s2;
    o32[3] = s3;
    return out;
  }
  digest() {
    const res = new Uint8Array(BLOCK_SIZE);
    this.digestInto(res);
    this.destroy();
    return res;
  }
};
var Polyval = class extends GHASH {
  constructor(key, expectedLength) {
    key = toBytes$1(key);
    const ghKey = _toGHASHKey(copyBytes(key));
    super(ghKey, expectedLength);
    clean(ghKey);
  }
  update(data) {
    data = toBytes$1(data);
    exists$1(this);
    const b32 = u32(data);
    const left = data.length % BLOCK_SIZE;
    const blocks = Math.floor(data.length / BLOCK_SIZE);
    for (let i = 0; i < blocks; i++) {
      this._updateBlock(swapLE(b32[i * 4 + 3]), swapLE(b32[i * 4 + 2]), swapLE(b32[i * 4 + 1]), swapLE(b32[i * 4 + 0]));
    }
    if (left) {
      ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
      this._updateBlock(swapLE(ZEROS32[3]), swapLE(ZEROS32[2]), swapLE(ZEROS32[1]), swapLE(ZEROS32[0]));
      clean(ZEROS32);
    }
    return this;
  }
  digestInto(out) {
    exists$1(this);
    output$1(out, this);
    this.finished = true;
    const { s0, s1, s2, s3 } = this;
    const o32 = u32(out);
    o32[0] = s0;
    o32[1] = s1;
    o32[2] = s2;
    o32[3] = s3;
    return out.reverse();
  }
};
function wrapConstructorWithKey(hashCons) {
  const hashC = (msg, key) => hashCons(key, msg.length).update(toBytes$1(msg)).digest();
  const tmp = hashCons(new Uint8Array(16), 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (key, expectedLength) => hashCons(key, expectedLength);
  return hashC;
}
var ghash = wrapConstructorWithKey((key, expectedLength) => new GHASH(key, expectedLength));
wrapConstructorWithKey((key, expectedLength) => new Polyval(key, expectedLength));

// ../esm/aes.js
var BLOCK_SIZE2 = 16;
var BLOCK_SIZE32 = 4;
var EMPTY_BLOCK = new Uint8Array(BLOCK_SIZE2);
var POLY2 = 283;
function mul22(n) {
  return n << 1 ^ POLY2 & -(n >> 7);
}
function mul(a, b) {
  let res = 0;
  for (; b > 0; b >>= 1) {
    res ^= a & -(b & 1);
    a = mul22(a);
  }
  return res;
}
var sbox = /* @__PURE__ */ (() => {
  const t = new Uint8Array(256);
  for (let i = 0, x = 1; i < 256; i++, x ^= mul22(x))
    t[i] = x;
  const box = new Uint8Array(256);
  box[0] = 99;
  for (let i = 0; i < 255; i++) {
    let x = t[255 - i];
    x |= x << 8;
    box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
  }
  clean(t);
  return box;
})();
var rotr32_8 = (n) => n << 24 | n >>> 8;
var rotl32_8 = (n) => n << 8 | n >>> 24;
function genTtable(sbox2, fn) {
  if (sbox2.length !== 256)
    throw new Error("Wrong sbox length");
  const T0 = new Uint32Array(256).map((_, j) => fn(sbox2[j]));
  const T1 = T0.map(rotl32_8);
  const T2 = T1.map(rotl32_8);
  const T3 = T2.map(rotl32_8);
  const T01 = new Uint32Array(256 * 256);
  const T23 = new Uint32Array(256 * 256);
  const sbox22 = new Uint16Array(256 * 256);
  for (let i = 0; i < 256; i++) {
    for (let j = 0; j < 256; j++) {
      const idx = i * 256 + j;
      T01[idx] = T0[i] ^ T1[j];
      T23[idx] = T2[i] ^ T3[j];
      sbox22[idx] = sbox2[i] << 8 | sbox2[j];
    }
  }
  return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
}
var tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
var xPowers = /* @__PURE__ */ (() => {
  const p = new Uint8Array(16);
  for (let i = 0, x = 1; i < 16; i++, x = mul22(x))
    p[i] = x;
  return p;
})();
function expandKeyLE(key) {
  bytes$1(key);
  const len = key.length;
  if (![16, 24, 32].includes(len))
    throw new Error(`aes: wrong key size: should be 16, 24 or 32, got: ${len}`);
  const { sbox2 } = tableEncoding;
  const toClean = [];
  if (!isAligned32(key))
    toClean.push(key = copyBytes(key));
  const k32 = u32(key);
  const Nk = k32.length;
  const subByte = (n) => applySbox(sbox2, n, n, n, n);
  const xk = new Uint32Array(len + 28);
  xk.set(k32);
  for (let i = Nk; i < xk.length; i++) {
    let t = xk[i - 1];
    if (i % Nk === 0)
      t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
    else if (Nk > 6 && i % Nk === 4)
      t = subByte(t);
    xk[i] = xk[i - Nk] ^ t;
  }
  clean(...toClean);
  return xk;
}
function apply0123(T01, T23, s0, s1, s2, s3) {
  return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
}
function applySbox(sbox2, s0, s1, s2, s3) {
  return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
}
function encrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableEncoding;
  let k = 0;
  s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
  const rounds = xk.length / 4 - 2;
  for (let i = 0; i < rounds; i++) {
    const t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
    const t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
    const t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
    const t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
    s0 = t02, s1 = t12, s2 = t22, s3 = t32;
  }
  const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
  const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
  const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
  const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
  return { s0: t0, s1: t1, s2: t2, s3: t3 };
}
function getDst(len, dst) {
  if (dst === void 0)
    return new Uint8Array(len);
  bytes$1(dst);
  if (dst.length < len)
    throw new Error(`aes: wrong destination length, expected at least ${len}, got: ${dst.length}`);
  if (!isAligned32(dst))
    throw new Error("unaligned dst");
  return dst;
}
function ctr32(xk, isLE2, nonce, src, dst) {
  bytes$1(nonce, BLOCK_SIZE2);
  bytes$1(src);
  dst = getDst(src.length, dst);
  const ctr4 = nonce;
  const c32 = u32(ctr4);
  const view = createView$1(ctr4);
  const src32 = u32(src);
  const dst32 = u32(dst);
  const ctrPos = isLE2 ? 0 : 12;
  const srcLen = src.length;
  let ctrNum = view.getUint32(ctrPos, isLE2);
  let { s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]);
  for (let i = 0; i + 4 <= src32.length; i += 4) {
    dst32[i + 0] = src32[i + 0] ^ s0;
    dst32[i + 1] = src32[i + 1] ^ s1;
    dst32[i + 2] = src32[i + 2] ^ s2;
    dst32[i + 3] = src32[i + 3] ^ s3;
    ctrNum = ctrNum + 1 >>> 0;
    view.setUint32(ctrPos, ctrNum, isLE2);
    ({ s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]));
  }
  const start = BLOCK_SIZE2 * Math.floor(src32.length / BLOCK_SIZE32);
  if (start < srcLen) {
    const b32 = new Uint32Array([s0, s1, s2, s3]);
    const buf = u8(b32);
    for (let i = start, pos = 0; i < srcLen; i++, pos++)
      dst[i] = src[i] ^ buf[pos];
    clean(b32);
  }
  return dst;
}
function computeTag2(fn, isLE2, key, data, AAD) {
  const aadLength = AAD == null ? 0 : AAD.length;
  const h = fn.create(key, data.length + aadLength);
  if (AAD)
    h.update(AAD);
  h.update(data);
  const num = new Uint8Array(16);
  const view = createView$1(num);
  if (AAD)
    setBigUint64$1(view, 0, BigInt(aadLength * 8), isLE2);
  setBigUint64$1(view, 8, BigInt(data.length * 8), isLE2);
  h.update(num);
  const res = h.digest();
  clean(num);
  return res;
}
var gcm = wrapCipher({ blockSize: 16, nonceLength: 12, tagLength: 16 }, function gcm2(key, nonce, AAD) {
  bytes$1(key);
  bytes$1(nonce);
  if (AAD !== void 0)
    bytes$1(AAD);
  if (nonce.length < 8)
    throw new Error("aes/gcm: invalid nonce length");
  const tagLength = 16;
  function _computeTag(authKey, tagMask, data) {
    const tag = computeTag2(ghash, false, authKey, data, AAD);
    for (let i = 0; i < tagMask.length; i++)
      tag[i] ^= tagMask[i];
    return tag;
  }
  function deriveKeys() {
    const xk = expandKeyLE(key);
    const authKey = EMPTY_BLOCK.slice();
    const counter = EMPTY_BLOCK.slice();
    ctr32(xk, false, counter, counter, authKey);
    if (nonce.length === 12) {
      counter.set(nonce);
    } else {
      const nonceLen = EMPTY_BLOCK.slice();
      const view = createView$1(nonceLen);
      setBigUint64$1(view, 8, BigInt(nonce.length * 8), false);
      const g = ghash.create(authKey).update(nonce).update(nonceLen);
      g.digestInto(counter);
      g.destroy();
    }
    const tagMask = ctr32(xk, false, counter, EMPTY_BLOCK);
    return { xk, authKey, counter, tagMask };
  }
  return {
    encrypt(plaintext) {
      bytes$1(plaintext);
      const { xk, authKey, counter, tagMask } = deriveKeys();
      const out = new Uint8Array(plaintext.length + tagLength);
      const toClean = [xk, authKey, counter, tagMask];
      if (!isAligned32(plaintext))
        toClean.push(plaintext = copyBytes(plaintext));
      ctr32(xk, false, counter, plaintext, out);
      const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
      toClean.push(tag);
      out.set(tag, plaintext.length);
      clean(...toClean);
      return out;
    },
    decrypt(ciphertext) {
      bytes$1(ciphertext);
      if (ciphertext.length < tagLength)
        throw new Error(`aes/gcm: ciphertext less than tagLen (${tagLength})`);
      const { xk, authKey, counter, tagMask } = deriveKeys();
      const toClean = [xk, authKey, tagMask, counter];
      if (!isAligned32(ciphertext))
        toClean.push(ciphertext = copyBytes(ciphertext));
      const data = ciphertext.subarray(0, -tagLength);
      const passedTag = ciphertext.subarray(-tagLength);
      const tag = _computeTag(authKey, tagMask, data);
      toClean.push(tag);
      if (!equalBytes(tag, passedTag))
        throw new Error("aes/gcm: invalid ghash tag");
      const out = ctr32(xk, false, counter, data);
      clean(...toClean);
      return out;
    }
  };
});
new Uint8Array(8).fill(166);

// ../src/crypto.ts
var crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// ../esm/webcrypto.js
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto && typeof crypto.randomBytes === "function") {
    return crypto.randomBytes(bytesLength);
  }
  throw new Error("crypto.getRandomValues must be defined");
}
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */

// ../esm/_assert.js
function number(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`positive integer expected, not ${n}`);
}
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function hash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(h.outputLen);
  number(h.blockLen);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
var nextTick = async () => {
};
async function asyncLoop(iters, tick, cb) {
  let ts = Date.now();
  for (let i = 0; i < iters; i++) {
    cb(i);
    const diff = Date.now() - ts;
    if (diff >= 0 && diff < tick)
      continue;
    await nextTick();
    ts += diff;
  }
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  bytes(data);
  return data;
}
var Hash = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
var toStr = {}.toString;
function checkOpts(defaults, opts) {
  if (opts !== void 0 && toStr.call(opts) !== "[object Object]")
    throw new Error("Options should be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}

// ../esm/hmac.js
var HMAC = class extends Hash {
  constructor(hash2, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash2);
    const key = toBytes(_key);
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
hmac.create = (hash2, key) => new HMAC(hash2, key);

// ../esm/hkdf.js
function extract(hash2, ikm, salt) {
  hash(hash2);
  if (salt === void 0)
    salt = new Uint8Array(hash2.outputLen);
  return hmac(hash2, toBytes(salt), toBytes(ikm));
}
var HKDF_COUNTER = /* @__PURE__ */ new Uint8Array([0]);
var EMPTY_BUFFER = /* @__PURE__ */ new Uint8Array();
function expand(hash2, prk, info, length = 32) {
  hash(hash2);
  number(length);
  if (length > 255 * hash2.outputLen)
    throw new Error("Length should be <= 255*HashLen");
  const blocks = Math.ceil(length / hash2.outputLen);
  if (info === void 0)
    info = EMPTY_BUFFER;
  const okm = new Uint8Array(blocks * hash2.outputLen);
  const HMAC2 = hmac.create(hash2, prk);
  const HMACTmp = HMAC2._cloneInto();
  const T = new Uint8Array(HMAC2.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
    okm.set(T, hash2.outputLen * counter);
    HMAC2._cloneInto(HMACTmp);
  }
  HMAC2.destroy();
  HMACTmp.destroy();
  T.fill(0);
  HKDF_COUNTER.fill(0);
  return okm.slice(0, length);
}
var hkdf = (hash2, ikm, salt, info, length) => expand(hash2, extract(hash2, ikm, salt), info, length);

// ../esm/pbkdf2.js
function pbkdf2Init(hash2, _password, _salt, _opts) {
  hash(hash2);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  number(c);
  number(dkLen);
  number(asyncTick);
  if (c < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const password = toBytes(_password);
  const salt = toBytes(_salt);
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash2, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  u.fill(0);
  return DK;
}
async function pbkdf2Async(hash2, password, salt, opts) {
  const { c, dkLen, asyncTick, DK, PRF, PRFSalt } = pbkdf2Init(hash2, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    await asyncLoop(c - 1, asyncTick, () => {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++)
        Ti[i] ^= u[i];
    });
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}

// ../esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
var Chi = (a, b, c) => a & b ^ ~a & c;
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
var HashMD = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists(this);
    output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// ../esm/ripemd160.js
var Rho = /* @__PURE__ */ new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
var Id = /* @__PURE__ */ new Uint8Array(new Array(16).fill(0).map((_, i) => i));
var Pi = /* @__PURE__ */ Id.map((i) => (9 * i + 5) % 16);
var idxL = [Id];
var idxR = [Pi];
for (let i = 0; i < 4; i++)
  for (let j of [idxL, idxR])
    j.push(j[i].map((k) => Rho[k]));

// ../esm/sha256.js
var SHA256_K = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_IV = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G: G2, H } = this;
    return [A, B, C, D, E, F, G2, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G2, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G2 | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G: G2, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G2) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G2;
      G2 = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G2 = G2 + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G2, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var sha256$1 = /* @__PURE__ */ wrapConstructor(() => new SHA256());
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */

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
  const stream = gcm(key, iv);
  const encrypted = stream.encrypt(data);

  return encrypted;
}

// ============================================================================================================================ //
//  decryptGcm()                                                                                                                //
// ============================================================================================================================ //
async function decryptGcm(key, data, iv) {
  try {
    const stream = gcm(key, iv);
    const decrypted = stream.decrypt(data);

    return decrypted;
  }
  catch(e) {
    console.error(e);
  }
  return false;
}

// ============================================================================================================================ //
//  deriveBitsPbkdf2()                                                                                                          //
// ============================================================================================================================ //
async function deriveBitsPbkdf2(arr, salt, bits, iterations) {
  return await pbkdf2Async(
    sha256$1,
    arr,
    salt,
    {
      c: iterations,
      dkLen: bits / 8
    }
  );
}

// ============================================================================================================================ //
//  deriveBitsHkdf()                                                                                                            //
// ============================================================================================================================ //
function deriveBitsHkdf(arr, salt, info, bits) {
  return hkdf(
    sha256$1,
    arr,
    salt,
    info,
    bits / 8
  );
}

/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const B256 = 2n ** 256n; // secp256k1 is short weierstrass curve
const P$1 = B256 - 0x1000003d1n; // curve's field prime
const N$1 = B256 - 0x14551231950b75fc4402da1732fc9bebfn; // curve (group) order
const Gx = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n; // base point x
const Gy = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n; // base point y
const CURVE = { p: P$1, n: N$1, a: 0n, b: 7n, Gx, Gy }; // exported variables incl. a, b
const fLen = 32; // field / group byte length
const crv = (x) => mod(mod(x * x) * x + CURVE.b); // x³ + ax + b weierstrass formula; a=0
const err = (m = '') => { throw new Error(m); }; // error helper, messes-up stack trace
const big = (n) => typeof n === 'bigint'; // is big integer
const str = (s) => typeof s === 'string'; // is string
const fe = (n) => big(n) && 0n < n && n < P$1; // is field element (invertible)
const ge = (n) => big(n) && 0n < n && n < N$1; // is group element
const isu8 = (a) => (a instanceof Uint8Array ||
    (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
const au8 = (a, l) => // assert is Uint8Array (of specific length)
 !isu8(a) || (typeof l === 'number' && l > 0 && a.length !== l) ?
    err('Uint8Array expected') : a;
const u8n = (data) => new Uint8Array(data); // creates Uint8Array
const toU8 = (a, len) => au8(str(a) ? h2b(a) : u8n(au8(a)), len); // norm(hex/u8a) to u8a
const mod = (a, b = P$1) => { let r = a % b; return r >= 0n ? r : b + r; }; // mod division
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
    static fromPrivateKey(k) { return G$1.mul(toPriv(k)); } // Create point from a private key.
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
            return I$1; // in unsafe mode, allow zero
        if (!ge(n))
            err('invalid scalar'); // must be 0 < n < CURVE.n
        if (this.equals(G$1))
            return wNAF(n).p; // use precomputes for base point
        let p = I$1, f = G$1; // init result point & fake point
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
        if (this.equals(I$1))
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
const { BASE: G$1, ZERO: I$1 } = Point; // Generator, identity points
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
const inv = (num, md = P$1) => {
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
    for (let num = n, e = (P$1 + 1n) / 4n; e > 0n; e >>= 1n) { // powMod: modular exponentiation.
        if (e & 1n)
            r = (r * num) % P$1; // Uses exponentiation by squaring.
        num = (num * num) % P$1; // Not constant-time.
    }
    return mod(r * r) === n ? r : err('sqrt invalid'); // check if result is valid
};
const toPriv = (p) => {
    if (!big(p))
        p = b2n(toU8(p, fLen)); // convert to bigint when bytes
    return ge(p) ? p : err('private key out of range'); // check if bigint is in range
};
const moreThanHalfN = (n) => n > (N$1 >> 1n); // if a number is bigger than CURVE.n/2
const getPublicKey$3 = (privKey, isCompressed = true) => {
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
        return this.hasHighS() ? new Signature(this.r, mod(this.s, N$1), this.recovery) : this;
    }
    recoverPublicKey(msgh) {
        const { r, s, recovery: rec } = this; // secg.org/sec1-v2.pdf 4.1.6
        if (![0, 1, 2, 3].includes(rec))
            err('recovery id invalid'); // check recovery id
        const h = bits2int_modN(toU8(msgh, fLen)); // Truncate hash
        const radj = rec === 2 || rec === 3 ? r + N$1 : r; // If rec was 2 or 3, q.x is bigger than n
        if (radj >= P$1)
            err('q.x invalid'); // ensure q.x is still a field element
        const head = (rec & 1) === 0 ? '02' : '03'; // head is 0x02 or 0x03
        const R = Point.fromHex(head + n2h(radj)); // concat head + hex repr of r
        const ir = inv(radj, N$1); // r^-1
        const u1 = mod(-h * ir, N$1); // -hr^-1
        const u2 = mod(s * ir, N$1); // sr^-1
        return G$1.mulAddQUns(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
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
    return mod(bits2int(bytes), N$1); // with 0: BAD for trunc as per RFC vectors
};
const i2o = (num) => n2b(num); // int to octets
const cr = () => // We support: 1) browsers 2) node.js 19+ 3) deno, other envs with crypto
 typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;
let _hmacSync; // Can be redefined by use in utils; built-ins don't provide it
const optS = { lowS: true }; // opts for sign()
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
        const ik = inv(k, N$1); // k^-1 mod n, NOT mod P
        const q = G$1.mul(k).aff(); // q = Gk
        const r = mod(q.x, N$1); // r = q.x mod n
        if (r === 0n)
            return; // r=0 invalid
        const s = mod(ik * mod(m + mod(d * r, N$1), N$1), N$1); // s = k^-1(m + rd) mod n
        if (s === 0n)
            return; // s=0 invalid
        let normS = s; // normalized S
        let rec = (q.x === r ? 0 : 2) | Number(q.y & 1n); // recovery bit
        if (lowS && moreThanHalfN(s)) { // if lowS was passed, ensure s is always
            normS = mod(-s, N$1); // in the bottom half of CURVE.n
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
const sign$2 = (msgh, priv, opts = optS) => {
    const { seed, k2sig } = prepSig(msgh, priv, opts); // Extract arguments for hmac-drbg
    return hmacDrbg(false)(seed, k2sig); // Re-run drbg until k2sig returns ok
};
const getSharedSecret = (privA, pubB, isCompressed = true) => {
    return Point.fromHex(pubB).mul(toPriv(privA)).toRawBytes(isCompressed); // ECDH
};
const hashToPrivateKey = (hash) => {
    hash = toU8(hash); // produces private keys with modulo bias
    const minLen = fLen + 8; // being neglible.
    if (hash.length < minLen || hash.length > 1024)
        err('expected proper params');
    const num = mod(b2n(hash), N$1 - 1n) + 1n; // takes at least n+8 bytes
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
Object.defineProperties(etc, { hmacSha256Sync: {
        configurable: false, get() { return _hmacSync; }, set(f) { if (!_hmacSync)
            _hmacSync = f; },
    } });
const W$1 = 8; // Precomputes-related code. W = window size
const precompute = () => {
    const points = []; // 10x sign(), 2x verify(). To achieve this,
    const windows = 256 / W$1 + 1; // app needs to spend 40ms+ to calculate
    let p = G$1, b = p; // a lot of points related to base point G.
    for (let w = 0; w < windows; w++) { // Points are stored in array and used
        b = p; // any time Gx multiplication is done.
        points.push(b); // They consume 16-32 MiB of RAM.
        for (let i = 1; i < 2 ** (W$1 - 1); i++) {
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
    let p = I$1, f = G$1; // f must be G, or could become I in the end
    const windows = 1 + 256 / W$1; // W=8 17 windows
    const wsize = 2 ** (W$1 - 1); // W=8 128 window size
    const mask = BigInt(2 ** W$1 - 1); // W=8 will create mask 0b11111111
    const maxNum = 2 ** W$1; // W=8 256
    const shiftBy = BigInt(W$1); // W=8 8
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

etc.hmacSha256Sync = (k, ...m) => hmac(sha256$1, k, etc.concatBytes(...m));

// ============================================================================================================================ //
//  publicKeyFromPrivateKey()                                                                                                   //
// ============================================================================================================================ //
function publicKeyFromPrivateKey(privateKey) {
  return getPublicKey$3(privateKey);
}

// ============================================================================================================================ //
//  sign()                                                                                                                      //
// ============================================================================================================================ //
async function sign$1(privateKey, data) {
  console.log("secp256k1.sign key/data", privateKey, data);

  let hash = sha256$1(data),
      signature = sign$2(hash, privateKey);

  return signature.toCompactRawBytes();
}

// ============================================================================================================================ //
//  getSharedKey()                                                                                                              //
// ============================================================================================================================ //
async function getSharedKey(myPrivateKey, theirPublicKey) {
  let keyMaterial = getSharedSecret(myPrivateKey, theirPublicKey),
      key = sha256$1(keyMaterial);

  return key;
}

// ============================================================================================================================ //
//  sha256()                                                                                                                    //
// ============================================================================================================================ //
function sha256(arr) {
  if(!arr instanceof Uint8Array) {
    console.trace();
    console.error("Warning: argument passed to sha256() is not an instance of Uin8Array");
  }
  return sha256$1(arr);
}

// ============================================================================================================================ //
//  getRandomBytes()                                                                                                            //
// ============================================================================================================================ //
function getRandomBytes(size) {
  return randomBytes(size);
}

let encoder = new TextEncoder();
let decoder = new TextDecoder();

// ============================================================================================================================ //
//  encode()                                                                                                                    //
// ============================================================================================================================ //
function encode$4(str) {
  return encoder.encode(str);
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
function decode$7(array) {
  return decoder.decode(array);
}

var textEncoder = /*#__PURE__*/Object.freeze({
  __proto__: null,
  decode: decode$7,
  encode: encode$4
});

const OTHER   = 0;
const NUMBER  = 1;
const BOOLEAN = 2;
const STRING  = 3;
const ARRAY   = 4;
const OBJECT  = 5;
const NULL    = 6;
const UINT8   = 7;

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
      return OBJECT;
    }
    default: {
      return OTHER;
    }
  }
}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const BASE64 = ALPHA + "+/=";
const URL$1    = ALPHA + "-_=";

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
//  hexa()                                                                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Converts an integer to hexadecimal format, padding to the left with zeros to reach 'size' if specified.                     //
// ============================================================================================================================ //
function hexa(n, size) {
  return n.toString(16).toUpperCase().padStart(size || 1, "0");
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
//  formatNumber()                                                                                                              //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Options:                                                                                                                    //
//    dec: number of decimal places (default: all of them)                                                                      //
//    sep: thousands separator (default: space)                                                                                 //
// ============================================================================================================================ //
function formatNumber(n, options = {}) {
  let s = (options.dec == undefined ? n.toString() : n.toFixed(options.dec)).split(".");
  return s[0].replace(/\d(?=(\d{3})+$)/g, "$&" + (options.sep || " ")) + (s[1] ? "." + s[1] : "");
}

// ============================================================================================================================ //
//  formatSize()                                                                                                                //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Converts a number to a size in bytes with one decimal place, using the most appropriate unit from "bytes" to "TB".          //
//  If 'shortFormat' is set, "bytes" is abbreviated to "B".                                                                     //
// ============================================================================================================================ //
function formatSize(n, shortFormat = false) {
  const unit = [ shortFormat ? "B" : "bytes", "KB", "MB", "GB", "TB" ];

  let ndx = unit.findIndex((_, i) => n < 1024 ** (i + 1) / 2);
  return (ndx ? (n / 1024 ** ndx).toFixed(1) : n) + " " + unit[ndx];
}

// ============================================================================================================================ //
//  masterBlockNumber()                                                                                                         //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Formats a master block number.                                                                                              //
// ============================================================================================================================ //
function masterBlockNumber(n) {
  return n.toString().padStart(9, "0");
}

// ============================================================================================================================ //
//  formatTime()                                                                                                                //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  YYYY: full year                                                                                                             //
//  YY  : last two digits of the year                                                                                           //
//  MM  : month                                                                                                                 //
//  DD  : day                                                                                                                   //
//  hh  : hours                                                                                                                 //
//  mm  : minutes                                                                                                               //
//  ss  : seconds                                                                                                               //
//  S..S: milliseconds                                                                                                          //
// ============================================================================================================================ //
function formatTime(format, date = new Date()) {
  return (
    format
    .replace(/YYYY/, date.getFullYear())
    .replace(/YY/, (date.getFullYear() % 100).toString().padStart(2, "0"))
    .replace(/MM/, (date.getMonth() + 1).toString().padStart(2, "0"))
    .replace(/DD/, date.getDate().toString().padStart(2, "0"))
    .replace(/hh/, date.getHours().toString().padStart(2, "0"))
    .replace(/mm/, date.getMinutes().toString().padStart(2, "0"))
    .replace(/ss/, date.getSeconds().toString().padStart(2, "0"))
    .replace(/S+/, s => Math.round(date.getMilliseconds() / 10 ** (3 - s.length)).toString().padStart(s.length, "0"))
  );
}

// ============================================================================================================================ //
//  elapsedTime()                                                                                                               //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Formats the time elapsed since a given timestamp in milliseconds:                                                           //
//  - If the timestamp is more than 1 year old, returns the date as "DD/MM/YYYY".                                               //
//  - If the timestamp is more than 15 days old, returns the date as "DD/MM".                                                   //
//  - Otherwise, returns "X unit ago" using the most appropriate unit among "sec(s)", "min(s)", "hr(s)" and "day(s)".           //
// ============================================================================================================================ //
function elapsedTime(ts) {
  const value = [ 60, 60 * 60, 60 * 60 * 24, 60 * 60 * 24 * 15, 60 * 60 * 24 * 365, Infinity ];
  const unit  = [ "sec", "min", "hr", "day" ];

  let sec = Math.max(Math.floor((Date.now() - ts) / 1000), 1);

  let i = value.findIndex(m => sec < m),
      n = i ? Math.floor(sec / value[i - 1]) : sec;

  return (
    i > 3 ?
      formatTime(i == 4 ? "DD/MM" : "DD/MM/YYYY", new Date(ts))
    :
      n + " " + plural(n, unit[i]) + " ago"
  );
}
// ============================================================================================================================ //
//  titleCase()                                                                                                                 //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Returns the input string with the first character in upper case and all other characters in lower case.                     //
// ============================================================================================================================ //
function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================================================================================================ //
//  plural()                                                                                                                    //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Takes a number n, a 'unit' string and an optional 'plural' form. Returns 'plural' or 'unit' + 's' if n > 1, or 'unit'       //
//  otherwise.                                                                                                                  //
// ============================================================================================================================ //
function plural(n, unit, plural) {
  return n > 1 ? plural || unit + "s" : unit;
}

// ============================================================================================================================ //
//  passwordStrength()                                                                                                          //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Rough estimation of the strength of a password:                                                                             //
//    0 : too weak                                                                                                              //
//    1 : weak                                                                                                                  //
//    2 : medium                                                                                                                //
//    3 : strong                                                                                                                //
// ============================================================================================================================ //
function passwordStrength(str) {
  const typeRegex = [ /[a-z]/, /[A-Z]/, /\d/, /./ ];
  const typeSet = typeRegex.map(_ => new Set);

  // length, number of distinct characters, type diversity, number of distinct symbols
  const level = [
    [ 10, 7, 4, 2 ], // strong
    [ 8,  6, 3, 0 ], // medium
    [ 6,  4, 2, 0 ], // weak
    [ 0,  0, 0, 0 ]  // too weak
  ];

  [...str].forEach(c => typeSet[typeRegex.findIndex(e => e.test(c))].add(c));

  let prop = [
    str.length,
    new Set(str).size,
    typeSet.reduce((p, c) => p + (c.size > 0), 0),
    typeSet[3].size
  ];

  let strength = 3 - level.findIndex(a => a.every((min, i) => prop[i] >= min));

  return strength;
}

// ============================================================================================================================ //
//  isValidEmail()                                                                                                              //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Minimal email validation.                                                                                                   //
// ============================================================================================================================ //
function isValidEmail(str) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(str);
}

// ============================================================================================================================ //
//  jsonEncodeUint8Safe()                                                                                                       //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Performs JSON encoding with each Uint8Array converted to an array of numbers prefixed with 1 and other arrays prefixed      //
//  with 0.                                                                                                                     //
// ============================================================================================================================ //
function jsonEncodeUint8Safe(obj, space) {
  return JSON.stringify(
    obj,
    function (key, value) {
      if(value instanceof Uint8Array) {
        return [1, ...value];
      }
      else if(Array.isArray(value)) {
        return [0, ...value];
      }
      return value;
    },
    space
  );
}

// ============================================================================================================================ //
//  jsonDecodeUint8Safe()                                                                                                       //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Decodes a string encoded with jsonEncodeUint8Safe().                                                                        //
// ============================================================================================================================ //
function jsonDecodeUint8Safe(str) {
  return JSON.parse(
    str,
    function (key, value) {
      if(Array.isArray(value)) {
        return value[0] ? new Uint8Array(value.slice(1)) : value.slice(1);
      }
      return value;
    }
  );
}

// ============================================================================================================================ //
//  jsonEncodeBase64()                                                                                                          //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Performs JSON encoding with each Uint8Array converted to a base64-encoded string prefixed with "b_" and other strings       //
//  prefixed with "s_".                                                                                                         //
// ============================================================================================================================ //
function jsonEncodeBase64(obj, space) {
  return JSON.stringify(
    obj,
    function (key, value) {
      if(typeof value == "string") {
        return "s_" + value;
      }
      else if(value instanceof Uint8Array) {
        return "b_" + encodeBinary(value, BASE64);
      }
      return value;
    },
    space
  );
}

// ============================================================================================================================ //
//  jsonDecodeBase64()                                                                                                          //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Decodes a string encoded with jsonEncodeBase64().                                                                           //
// ============================================================================================================================ //
function jsonDecodeBase64(str) {
  return JSON.parse(
    str,
    function (key, value) {
      if(typeof value == "string") {
        return value[0] == "b" ? decodeBinary(value.slice(2), BASE64) : value.slice(2);
      }
      return value;
    }
  );
}

var util = /*#__PURE__*/Object.freeze({
  __proto__: null,
  elapsedTime: elapsedTime,
  formatNumber: formatNumber,
  formatSize: formatSize,
  formatTime: formatTime,
  hexa: hexa,
  intToByteArray: intToByteArray,
  isValidEmail: isValidEmail,
  jsonDecodeBase64: jsonDecodeBase64,
  jsonDecodeUint8Safe: jsonDecodeUint8Safe,
  jsonEncodeBase64: jsonEncodeBase64,
  jsonEncodeUint8Safe: jsonEncodeUint8Safe,
  masterBlockNumber: masterBlockNumber,
  passwordStrength: passwordStrength,
  plural: plural,
  titleCase: titleCase
});

// ============================================================================================================================ //
//  toHexa()                                                                                                                    //
// ============================================================================================================================ //
function toHexa(array) {
  if(!array instanceof Uint8Array && !Array.isArray(array)) {
    return "";
  }

  return [...array].map(n => n.toString(16).toUpperCase().padStart(2, "0")).join("");
}

// ============================================================================================================================ //
//  fromHexa()                                                                                                                  //
// ============================================================================================================================ //
function fromHexa(str) {
  return new Uint8Array(typeof str == "string" && str.match(/^([\da-f]{2})*$/gi) ? str.match(/../g).map(s => parseInt(s, 16)) : []);
}

// ============================================================================================================================ //
//  formatHash()                                                                                                                //
// ============================================================================================================================ //
function formatHash(array, shortened) {
  let str = toHexa(array);

  return "0x" + (shortened ? str.slice(0, shortened) + " \u22EF " + str.slice(-2) : str);
}

// ============================================================================================================================ //
//  writeX()                                                                                                                    //
// ============================================================================================================================ //
function write8(array, data, pos) {
  array.set([ data & 0xFF ], pos);
}

function write16(array, data, pos) {
  array.set([ data >> 8 & 0xFF, data & 0xFF ], pos);
}

function write24(array, data, pos) {
  array.set([ data >> 16 & 0xFF, data >> 8 & 0xFF, data & 0xFF ], pos);
}

function write32(array, data, pos) {
  array.set([ data >> 24 & 0xFF, data >> 16 & 0xFF, data >> 8 & 0xFF, data & 0xFF ], pos);
}

function write48(array, data, pos) {
  write24(array, data / 0x1000000, pos);
  write24(array, data, pos + 3);
}

// ============================================================================================================================ //
//  readX()                                                                                                                     //
// ============================================================================================================================ //
function read8(array, pos) {
  return array[pos];
}

function read16(array, pos) {
  return array[pos] << 8 | array[pos + 1];
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
        arg[i] = encode$4(data);
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
//  fromBuffer()                                                                                                                //
// ============================================================================================================================ //
function fromBuffer(buffer, offset = 0) {
  return new Uint8Array(buffer.buffer, buffer.byteOffset + offset, buffer.byteLength - offset);
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

var uint8 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  formatHash: formatHash,
  from: from,
  fromBuffer: fromBuffer,
  fromHexa: fromHexa,
  isEqual: isEqual,
  read16: read16,
  read24: read24,
  read32: read32,
  read48: read48,
  read8: read8,
  toHexa: toHexa,
  write16: write16,
  write24: write24,
  write32: write32,
  write48: write48,
  write8: write8
});

// ============================================================================================================================ //
//  serialize()                                                                                                                 //
// ============================================================================================================================ //
async function serialize(schema, obj) {
  return await encode$3(schema, obj);
}

// ============================================================================================================================ //
//  unserialize()                                                                                                               //
// ============================================================================================================================ //
async function unserialize(schema, stream, obj = {}) {
  return await decode$6(schema, stream, 0, obj);
}

// ============================================================================================================================ //
//  encodeMessage()                                                                                                             //
// ============================================================================================================================ //
async function encodeMessage(type, obj) {
  return await encode$3(MESSAGE[type], obj, type);
}

// ============================================================================================================================ //
//  decodeMessage()                                                                                                             //
// ============================================================================================================================ //
async function decodeMessage(stream) {
  return {
    id  : stream[0],
    data: await decode$6(MESSAGE[stream[0]], stream, 1)
  };
}

// ============================================================================================================================ //
//  encode()                                                                                                                    //
// ============================================================================================================================ //
async function encode$3(schema, obj, header = null) {
  if(!obj || typeof obj != "object") {
    console.trace();
    throw "unable to encode: 'obj' is not an object";
  }

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
      console.trace();
      throw `property '${path.join('.')}' is undefined`;
    }

    if(!isCompatibleType(node, def)) {
      console.error(obj);
      console.trace();
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
        let data = encode$4(node);

        if(def.size == undefined) {
          writeUnsigned(data.length, 3);
        }
        writeData(data);
        break;
      }
      case BINARY$1: {
        if(def.size == undefined) {
          writeUnsigned(node.length, 3);
        }
        writeData(node);
        break;
      }
      case BIN128:
      case BIN256:
      case BIN264:
      case BIN512: {
        writeData(node);
        break;
      }
/*
      case CST.TYPE.GCM_KEY: {
        writeUnsigned(node.type, 1);
        writeUnsigned(node.index, 1);
        writeData(await crypto.aes.exportKey(node.key));
        break;
      }
*/
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
async function decode$6(schema, stream, ptr, obj = {}) {
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

        item = decode$7(readData(size));
        break;
      }
      case BINARY$1: {
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
      case BIN264: {
        item = readData(33);
        break;
      }
      case BIN512: {
        item = readData(64);
        break;
      }
/*
      case CST.TYPE.GCM_KEY: {
        let keyType = readUnsigned(1),
            keyIndex = readUnsigned(1),
            key = await crypto.aes.importGcmKey(readData(32), true);

        item = { type: keyType, index: keyIndex, key: key };
        break;
      }
*/
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
    case BINARY$1 : { return valueType == UINT8 && checkSize(); }
    case BIN128 : { return valueType == UINT8 && value.length == 16; }
    case BIN256 : { return valueType == UINT8 && value.length == 32; }
    case BIN264 : { return valueType == UINT8 && value.length == 33; }
    case BIN512 : { return valueType == UINT8 && value.length == 64; }
    case CTR_KEY: { throw "type CTR_KEY is not supported anymore"; }
    case GCM_KEY: { throw "type GCM_KEY is not supported anymore"; }
/*
    case CST.TYPE.CTR_KEY: { return valueType == type.OBJECT && isUint(value.type, 8) && isUint(value.index, 8) && type.getType(value.key) == type.CTR_KEY; }
    case CST.TYPE.GCM_KEY: { return valueType == type.OBJECT && isUint(value.type, 8) && isUint(value.index, 8) && type.getType(value.key) == type.GCM_KEY; }
*/
  }

  return false;
}

let thisInterface$2,
    nodeUrl,
    dataUrl,
    operatorUrl;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$5(networkInterface) {
  thisInterface$2 = networkInterface;
}

// ============================================================================================================================ //
//  registerNodeEndpoint()                                                                                                      //
// ============================================================================================================================ //
function registerNodeEndpoint$1(url) {
  console.log("registerNodeEndpoint", url);
  nodeUrl = url;
}

// ============================================================================================================================ //
//  registerDataEndpoint()                                                                                                      //
// ============================================================================================================================ //
function registerDataEndpoint$1(url) {
  console.log("registerDataEndpoint", url);
  dataUrl = url;
}

// ============================================================================================================================ //
//  registerOperatorEndpoint()                                                                                                  //
// ============================================================================================================================ //
function registerOperatorEndpoint$1(url) {
  console.log("registerOperatorEndpoint", url);
  operatorUrl = url;
}

// ============================================================================================================================ //
//  nodeQuery()                                                                                                                 //
// ============================================================================================================================ //
async function nodeQuery(msgId, msgData) {
  console.log("nodeQuery", msgId, nodeUrl);
  return await queryCarmentisNode$1(nodeUrl, msgId, msgData);
}

// ============================================================================================================================ //
//  dataServerQuery()                                                                                                           //
// ============================================================================================================================ //
async function dataServerQuery$1(path, obj = {}) {
  let data = await thisInterface$2.query(dataUrl + "/" + path, JSON.stringify(obj));

  return JSON.parse(data);
}

// ============================================================================================================================ //
//  operatorServerQuery()                                                                                                       //
// ============================================================================================================================ //
async function operatorServerQuery$1(path, obj = {}) {
  let data = await thisInterface$2.query(operatorUrl + "/" + path, JSON.stringify(obj));

  return jsonDecodeUint8Safe(data);
}

// ============================================================================================================================ //
//  broadcastMicroblock()                                                                                                       //
// ============================================================================================================================ //
async function broadcastMicroblock$1(msgData, gas=0) {
  //let data = await serializer.encodeMessage(CST.MSG.SEND_MICROBLOCK, msgData);
  let answer,
      answerData;

  try {
    const broadcastResponse = await thisInterface$2.broadcastMicroblock(nodeUrl, msgData.data);
    answer = fromHexa((JSON.parse(broadcastResponse)).result.data);
  } catch (e) {
    console.error("error", e);

    return {
      id: ANS_ERROR,
      data: {id: NETWORK_ERROR}
    };
  }

  try {
    answerData = await decodeMessage(answer);
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

async function queryCarmentisNode$1(nodeUrl, msgId, msgData) {
  console.log("network/queryCarmentisNode", nodeUrl, msgId, msgData);

  let data = await encodeMessage(msgId, msgData);
  let answer,
      answerData;

  let nodePath = '/abci_query';

  try {
    const encodedResponse = await thisInterface$2.queryCarmentisNode(nodeUrl + nodePath, data);
    console.log("queryCarmentisNode", encodedResponse);
    answer = decodeBinary((JSON.parse(encodedResponse)).result.response.value, BASE64);
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
    console.log("answer from node", answerData);
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
    netXhr.open("POST", url, true);

    netXhr.setRequestHeader("Accept", "application/json");
    netXhr.setRequestHeader("Content-Type", "application/json");

    if(responseType) {
      netXhr.responseType = responseType;
    }

    if(withCredentials) {
      netXhr.withCredentials = true;
    }

    netXhr.addEventListener("load", _ => {
      resolve(netXhr.response);
    });

    netXhr.addEventListener("error", e => {
      reject();
    });

console.log("netXhr.send", data);

    netXhr.send(data);
  });
}

// ============================================================================================================================ //
//  queryCarmentisNode()                                                                                                        //
// ============================================================================================================================ //
async function queryCarmentisNode(url, data) {
  let netXhr = new XMLHttpRequest();

  return new Promise(function(resolve, reject) {
  //  url += "?path=" + '"/carmentis"';
    url += "?path=" + '"/carmentis"' + "&data=0x" + toHexa(data);
    netXhr.open("POST", url, true);

    netXhr.setRequestHeader("Accept", "application/json");
    netXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    netXhr.addEventListener("load", _ => {
      resolve(netXhr.response);
    });

    netXhr.addEventListener("error", e => {
      reject();
    });

    //netXhr.send(JSON.stringify({data: "0x" + uint8.toHexa(data)}));
    netXhr.send();
  });
}

// ============================================================================================================================ //
//  broadcastMicroblock()                                                                                                       //
// ============================================================================================================================ //
async function broadcastMicroblock(nodeUrl, data) {
  let urlObj = new URL(nodeUrl);
  let netXhr = new XMLHttpRequest();

  urlObj.searchParams.append('tx', '0x' + toHexa(data));
  console.log(nodeUrl + "/broadcast_tx_sync" + urlObj.search);

  return new Promise(function(resolve, reject) {
    netXhr.open("POST", nodeUrl + "/broadcast_tx_sync" + urlObj.search, false);

    netXhr.setRequestHeader("Accept", "application/json");
    netXhr.setRequestHeader("Content-Type", "application/json");

    netXhr.addEventListener("load", _ => {
      resolve(netXhr.response);
    });

    netXhr.addEventListener("error", e => {
      reject();
    });

    console.log("netXhr.send", data);

    netXhr.send();
  });
}

var browserNetwork = /*#__PURE__*/Object.freeze({
  __proto__: null,
  broadcastMicroblock: broadcastMicroblock,
  query: query,
  queryCarmentisNode: queryCarmentisNode
});

const PFX_BLOCK_HEADER = "HEAD";
const PFX_BLOCK_BODY   = "BODY";
const PFX_BLOCK_MERKLE = "MRKL";

let thisInterface$1 = null;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$4(storageInterface, ...arg) {
  thisInterface$1 = storageInterface;
  thisInterface$1.initialize(...arg);
}

// ============================================================================================================================ //
//  directory()                                                                                                                 //
// ============================================================================================================================ //
function directory(subdir) {
  return {
    byUid: function(prefix, uid) {
      return fileObject({ byUid: true, prefix: prefix, uid: uid, subdir: subdir });
    },
    byContentHash: function(hash) {
      return fileObject({ byUid: false, hash: hash, subdir: subdir });
    }
  };
}

// ============================================================================================================================ //
//  fileObject()                                                                                                                //
// ============================================================================================================================ //
function fileObject(param) {
  function uidToHash() {
    return sha256(encode$4(param.prefix + param.uid));
  }

  return {
    exists: async function() {
      let hash = param.byUid ? uidToHash() : param.hash,
          name = toHexa(hash);

      return await thisInterface$1.fileExists(param.subdir, name);
    },
    read: async function(position, length) {
      let hash = param.byUid ? uidToHash() : param.hash,
          name = toHexa(hash);

      return await thisInterface$1.readFile(param.subdir, name, position, length);
    },
    write: async function(data) {
      let hash = param.byUid ? uidToHash() : param.hash || sha256(data),
          name = toHexa(hash);

      await thisInterface$1.writeFile(param.subdir, name, data);

      return hash;
    },
    del: async function() {
      let hash = param.byUid ? uidToHash() : param.hash,
          name = toHexa(hash);

      return await thisInterface$1.deleteFile(param.subdir, name);
    }
  };
}

var fileSystem = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PFX_BLOCK_BODY: PFX_BLOCK_BODY,
  PFX_BLOCK_HEADER: PFX_BLOCK_HEADER,
  PFX_BLOCK_MERKLE: PFX_BLOCK_MERKLE,
  directory: directory,
  initialize: initialize$4
});

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

  return await get$3(FILE_STORE, key);
}

// ============================================================================================================================ //
//  writeFile()                                                                                                                 //
// ============================================================================================================================ //
async function writeFile(subdir, name, data) {
  let key = subdir + "-" + name;

  return await put(FILE_STORE, key, data);
}

// ============================================================================================================================ //
//  deleteFile()                                                                                                                //
// ============================================================================================================================ //
async function deleteFile(subdir, name) {
  let key = subdir + "-" + name;

  return await del$1(FILE_STORE, key);
}

var idbFileSystem = /*#__PURE__*/Object.freeze({
  __proto__: null,
  deleteFile: deleteFile,
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
async function initialize(tableList) {
  initialize$3(tableList.map(table => table + STORE_SUFFIX));
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
  initialize: initialize,
  set: set
});

// ============================================================================================================================ //
//  ready()                                                                                                                     //
// ============================================================================================================================ //
function ready(callback) {
  let state = document.readyState;

  if(document.attachEvent ? state == "complete" : state != "loading") {
    callback();
  }
  else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

// ============================================================================================================================ //
//  getUrlParameter()                                                                                                           //
// ============================================================================================================================ //
function getUrlParameter(name) {
  let url = new URL(window.location);

  return url.searchParams.get(name);
}

// ============================================================================================================================ //
//  getUrlPath()                                                                                                                //
// ============================================================================================================================ //
function getUrlPath() {
  let url = new URL(window.location);

  return url.pathname.split("/").slice(1);
}

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
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Sets or overwrites a cookie                                                                                                 //
// ============================================================================================================================ //
function setCookie(name, value, maxAge) {
  document.cookie = [
    name + "=" + value,
    ...maxAge ? [ "max-age=" + maxAge ] : [],
    "SameSite=Lax",
    [ ...document.location.protocol == "https:" ? [ "Secure" ] : [] ]
  ]
  .join("; ");
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
//  getAll()                                                                                                                    //
// ============================================================================================================================ //
function getAll(q) {
  return [...document.querySelectorAll(q)].map(elementToObject);
}

// ============================================================================================================================ //
//  getNth()                                                                                                                    //
// ============================================================================================================================ //
function getNth(q, n) {
  return elementToObject(document.querySelectorAll(q)[n]);
}

// ============================================================================================================================ //
//  create()                                                                                                                    //
// ============================================================================================================================ //
function create$7(type, id) {
  let el = elementToObject(document.createElement(type));

  if(id) {
    el.setAttribute("id", id);
  }

  return el;
}

// ============================================================================================================================ //
//  textNode()                                                                                                                  //
// ============================================================================================================================ //
function textNode(text) {
  return elementToObject(document.createTextNode(text));
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

    value: function(value) {
      el.value = value;
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

    disabled: function(flag) {
      el.disabled = !!flag;
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

var dom = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$7,
  elementToObject: elementToObject,
  get: get,
  getAll: getAll,
  getCookies: getCookies,
  getNth: getNth,
  getUrlParameter: getUrlParameter,
  getUrlPath: getUrlPath,
  ready: ready,
  setCookie: setCookie,
  textNode: textNode
});

/*!
 * Socket.IO v4.7.5
 * (c) 2014-2024 Guillermo Rauch
 * Released under the MIT License.
 */
const t=Object.create(null);t.open="0",t.close="1",t.ping="2",t.pong="3",t.message="4",t.upgrade="5",t.noop="6";const e=Object.create(null);Object.keys(t).forEach((s=>{e[t[s]]=s;}));const s={type:"error",data:"parser error"},n="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===Object.prototype.toString.call(Blob),i="function"==typeof ArrayBuffer,r=t=>"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,o=({type:e,data:s},o,h)=>n&&s instanceof Blob?o?h(s):a(s,h):i&&(s instanceof ArrayBuffer||r(s))?o?h(s):a(new Blob([s]),h):h(t[e]+(s||"")),a=(t,e)=>{const s=new FileReader;return s.onload=function(){const t=s.result.split(",")[1];e("b"+(t||""));},s.readAsDataURL(t)};function h(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let c;const u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",p="undefined"==typeof Uint8Array?[]:new Uint8Array(256);for(let t=0;t<64;t++)p[u.charCodeAt(t)]=t;const l="function"==typeof ArrayBuffer,d=(t,n)=>{if("string"!=typeof t)return {type:"message",data:y(t,n)};const i=t.charAt(0);if("b"===i)return {type:"message",data:f(t.substring(1),n)};return e[i]?t.length>1?{type:e[i],data:t.substring(1)}:{type:e[i]}:s},f=(t,e)=>{if(l){const s=(t=>{let e,s,n,i,r,o=.75*t.length,a=t.length,h=0;"="===t[t.length-1]&&(o--,"="===t[t.length-2]&&o--);const c=new ArrayBuffer(o),u=new Uint8Array(c);for(e=0;e<a;e+=4)s=p[t.charCodeAt(e)],n=p[t.charCodeAt(e+1)],i=p[t.charCodeAt(e+2)],r=p[t.charCodeAt(e+3)],u[h++]=s<<2|n>>4,u[h++]=(15&n)<<4|i>>2,u[h++]=(3&i)<<6|63&r;return c})(t);return y(s,e)}return {base64:!0,data:t}},y=(t,e)=>"blob"===e?t instanceof Blob?t:new Blob([t]):t instanceof ArrayBuffer?t:t.buffer,g=String.fromCharCode(30);function m(){return new TransformStream({transform(t,e){!function(t,e){n&&t.data instanceof Blob?t.data.arrayBuffer().then(h).then(e):i&&(t.data instanceof ArrayBuffer||r(t.data))?e(h(t.data)):o(t,!1,(t=>{c||(c=new TextEncoder),e(c.encode(t));}));}(t,(s=>{const n=s.length;let i;if(n<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,n);else if(n<65536){i=new Uint8Array(3);const t=new DataView(i.buffer);t.setUint8(0,126),t.setUint16(1,n);}else {i=new Uint8Array(9);const t=new DataView(i.buffer);t.setUint8(0,127),t.setBigUint64(1,BigInt(n));}t.data&&"string"!=typeof t.data&&(i[0]|=128),e.enqueue(i),e.enqueue(s);}));}})}let b;function w(t){return t.reduce(((t,e)=>t+e.length),0)}function v(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let n=0;for(let i=0;i<e;i++)s[i]=t[0][n++],n===t[0].length&&(t.shift(),n=0);return t.length&&n<t[0].length&&(t[0]=t[0].slice(n)),s}function k(t){if(t)return function(t){for(var e in k.prototype)t[e]=k.prototype[e];return t}(t)}k.prototype.on=k.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},k.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments);}return s.fn=e,this.on(t,s),this},k.prototype.off=k.prototype.removeListener=k.prototype.removeAllListeners=k.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var s,n=this._callbacks["$"+t];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var i=0;i<n.length;i++)if((s=n[i])===e||s.fn===e){n.splice(i,1);break}return 0===n.length&&delete this._callbacks["$"+t],this},k.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(s){n=0;for(var i=(s=s.slice(0)).length;n<i;++n)s[n].apply(this,e);}return this},k.prototype.emitReserved=k.prototype.emit,k.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},k.prototype.hasListeners=function(t){return !!this.listeners(t).length};const _="undefined"!=typeof self?self:"undefined"!=typeof window?window:Function("return this")();function E(t,...e){return e.reduce(((e,s)=>(t.hasOwnProperty(s)&&(e[s]=t[s]),e)),{})}const A=_.setTimeout,O=_.clearTimeout;function T(t,e){e.useNativeTimers?(t.setTimeoutFn=A.bind(_),t.clearTimeoutFn=O.bind(_)):(t.setTimeoutFn=_.setTimeout.bind(_),t.clearTimeoutFn=_.clearTimeout.bind(_));}class R extends Error{constructor(t,e,s){super(t),this.description=e,this.context=s,this.type="TransportError";}}class C extends k{constructor(t){super(),this.writable=!1,T(this,t),this.opts=t,this.query=t.query,this.socket=t.socket;}onError(t,e,s){return super.emitReserved("error",new R(t,e,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return "opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this}send(t){"open"===this.readyState&&this.write(t);}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open");}onData(t){const e=d(t,this.socket.binaryType);this.onPacket(e);}onPacket(t){super.emitReserved("packet",t);}onClose(t){this.readyState="closed",super.emitReserved("close",t);}pause(t){}createUri(t,e={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){const t=this.opts.hostname;return -1===t.indexOf(":")?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(443!==this.opts.port)||!this.opts.secure&&80!==Number(this.opts.port))?":"+this.opts.port:""}_query(t){const e=function(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}(t);return e.length?"?"+e:""}}const B="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),S=64,N={};let x,L=0,q=0;function P(t){let e="";do{e=B[t%S]+e,t=Math.floor(t/S);}while(t>0);return e}function j(){const t=P(+new Date);return t!==x?(L=0,x=t):t+"."+P(L++)}for(;q<S;q++)N[B[q]]=q;let U=!1;try{U="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest;}catch(t){}const D=U;function I(t){const e=t.xdomain;try{if("undefined"!=typeof XMLHttpRequest&&(!e||D))return new XMLHttpRequest}catch(t){}if(!e)try{return new(_[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(t){}}function F(){}const M=null!=new I({xdomain:!1}).responseType;class V extends k{constructor(t,e){super(),T(this,e),this.opts=e,this.method=e.method||"GET",this.uri=t,this.data=void 0!==e.data?e.data:null,this.create();}create(){var t;const e=E(this.opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this.opts.xd;const s=this.xhr=new I(e);try{s.open(this.method,this.uri,!0);try{if(this.opts.extraHeaders){s.setDisableHeaderCheck&&s.setDisableHeaderCheck(!0);for(let t in this.opts.extraHeaders)this.opts.extraHeaders.hasOwnProperty(t)&&s.setRequestHeader(t,this.opts.extraHeaders[t]);}}catch(t){}if("POST"===this.method)try{s.setRequestHeader("Content-type","text/plain;charset=UTF-8");}catch(t){}try{s.setRequestHeader("Accept","*/*");}catch(t){}null===(t=this.opts.cookieJar)||void 0===t||t.addCookies(s),"withCredentials"in s&&(s.withCredentials=this.opts.withCredentials),this.opts.requestTimeout&&(s.timeout=this.opts.requestTimeout),s.onreadystatechange=()=>{var t;3===s.readyState&&(null===(t=this.opts.cookieJar)||void 0===t||t.parseCookies(s)),4===s.readyState&&(200===s.status||1223===s.status?this.onLoad():this.setTimeoutFn((()=>{this.onError("number"==typeof s.status?s.status:0);}),0));},s.send(this.data);}catch(t){return void this.setTimeoutFn((()=>{this.onError(t);}),0)}"undefined"!=typeof document&&(this.index=V.requestsCount++,V.requests[this.index]=this);}onError(t){this.emitReserved("error",t,this.xhr),this.cleanup(!0);}cleanup(t){if(void 0!==this.xhr&&null!==this.xhr){if(this.xhr.onreadystatechange=F,t)try{this.xhr.abort();}catch(t){}"undefined"!=typeof document&&delete V.requests[this.index],this.xhr=null;}}onLoad(){const t=this.xhr.responseText;null!==t&&(this.emitReserved("data",t),this.emitReserved("success"),this.cleanup());}abort(){this.cleanup();}}if(V.requestsCount=0,V.requests={},"undefined"!=typeof document)if("function"==typeof attachEvent)attachEvent("onunload",H);else if("function"==typeof addEventListener){addEventListener("onpagehide"in _?"pagehide":"unload",H,!1);}function H(){for(let t in V.requests)V.requests.hasOwnProperty(t)&&V.requests[t].abort();}const K="function"==typeof Promise&&"function"==typeof Promise.resolve?t=>Promise.resolve().then(t):(t,e)=>e(t,0),Y=_.WebSocket||_.MozWebSocket,W="undefined"!=typeof navigator&&"string"==typeof navigator.product&&"reactnative"===navigator.product.toLowerCase();const z={websocket:class extends C{constructor(t){super(t),this.supportsBinary=!t.forceBase64;}get name(){return "websocket"}doOpen(){if(!this.check())return;const t=this.uri(),e=this.opts.protocols,s=W?{}:E(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=W?new Y(t,e,s):e?new Y(t,e):new Y(t);}catch(t){return this.emitReserved("error",t)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners();}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen();},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t);}write(t){this.writable=!1;for(let e=0;e<t.length;e++){const s=t[e],n=e===t.length-1;o(s,this.supportsBinary,(t=>{try{this.ws.send(t);}catch(t){}n&&K((()=>{this.writable=!0,this.emitReserved("drain");}),this.setTimeoutFn);}));}}doClose(){void 0!==this.ws&&(this.ws.close(),this.ws=null);}uri(){const t=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=j()),this.supportsBinary||(e.b64=1),this.createUri(t,e)}check(){return !!Y}},webtransport:class extends C{get name(){return "webtransport"}doOpen(){"function"==typeof WebTransport&&(this.transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name]),this.transport.closed.then((()=>{this.onClose();})).catch((t=>{this.onError("webtransport error",t);})),this.transport.ready.then((()=>{this.transport.createBidirectionalStream().then((t=>{const e=function(t,e){b||(b=new TextDecoder);const n=[];let i=0,r=-1,o=!1;return new TransformStream({transform(a,h){for(n.push(a);;){if(0===i){if(w(n)<1)break;const t=v(n,1);o=128==(128&t[0]),r=127&t[0],i=r<126?3:126===r?1:2;}else if(1===i){if(w(n)<2)break;const t=v(n,2);r=new DataView(t.buffer,t.byteOffset,t.length).getUint16(0),i=3;}else if(2===i){if(w(n)<8)break;const t=v(n,8),e=new DataView(t.buffer,t.byteOffset,t.length),o=e.getUint32(0);if(o>Math.pow(2,21)-1){h.enqueue(s);break}r=o*Math.pow(2,32)+e.getUint32(4),i=3;}else {if(w(n)<r)break;const t=v(n,r);h.enqueue(d(o?t:b.decode(t),e)),i=0;}if(0===r||r>t){h.enqueue(s);break}}}})}(Number.MAX_SAFE_INTEGER,this.socket.binaryType),n=t.readable.pipeThrough(e).getReader(),i=m();i.readable.pipeTo(t.writable),this.writer=i.writable.getWriter();const r=()=>{n.read().then((({done:t,value:e})=>{t||(this.onPacket(e),r());})).catch((t=>{}));};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this.writer.write(o).then((()=>this.onOpen()));}));})));}write(t){this.writable=!1;for(let e=0;e<t.length;e++){const s=t[e],n=e===t.length-1;this.writer.write(s).then((()=>{n&&K((()=>{this.writable=!0,this.emitReserved("drain");}),this.setTimeoutFn);}));}}doClose(){var t;null===(t=this.transport)||void 0===t||t.close();}},polling:class extends C{constructor(t){if(super(t),this.polling=!1,"undefined"!=typeof location){const e="https:"===location.protocol;let s=location.port;s||(s=e?"443":"80"),this.xd="undefined"!=typeof location&&t.hostname!==location.hostname||s!==t.port;}const e=t&&t.forceBase64;this.supportsBinary=M&&!e,this.opts.withCredentials&&(this.cookieJar=void 0);}get name(){return "polling"}doOpen(){this.poll();}pause(t){this.readyState="pausing";const e=()=>{this.readyState="paused",t();};if(this.polling||!this.writable){let t=0;this.polling&&(t++,this.once("pollComplete",(function(){--t||e();}))),this.writable||(t++,this.once("drain",(function(){--t||e();})));}else e();}poll(){this.polling=!0,this.doPoll(),this.emitReserved("poll");}onData(t){((t,e)=>{const s=t.split(g),n=[];for(let t=0;t<s.length;t++){const i=d(s[t],e);if(n.push(i),"error"===i.type)break}return n})(t,this.socket.binaryType).forEach((t=>{if("opening"===this.readyState&&"open"===t.type&&this.onOpen(),"close"===t.type)return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(t);})),"closed"!==this.readyState&&(this.polling=!1,this.emitReserved("pollComplete"),"open"===this.readyState&&this.poll());}doClose(){const t=()=>{this.write([{type:"close"}]);};"open"===this.readyState?t():this.once("open",t);}write(t){this.writable=!1,((t,e)=>{const s=t.length,n=new Array(s);let i=0;t.forEach(((t,r)=>{o(t,!1,(t=>{n[r]=t,++i===s&&e(n.join(g));}));}));})(t,(t=>{this.doWrite(t,(()=>{this.writable=!0,this.emitReserved("drain");}));}));}uri(){const t=this.opts.secure?"https":"http",e=this.query||{};return !1!==this.opts.timestampRequests&&(e[this.opts.timestampParam]=j()),this.supportsBinary||e.sid||(e.b64=1),this.createUri(t,e)}request(t={}){return Object.assign(t,{xd:this.xd,cookieJar:this.cookieJar},this.opts),new V(this.uri(),t)}doWrite(t,e){const s=this.request({method:"POST",data:t});s.on("success",e),s.on("error",((t,e)=>{this.onError("xhr post error",t,e);}));}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",((t,e)=>{this.onError("xhr poll error",t,e);})),this.pollXhr=t;}}},J=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,$=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Q(t){const e=t,s=t.indexOf("["),n=t.indexOf("]");-1!=s&&-1!=n&&(t=t.substring(0,s)+t.substring(s,n).replace(/:/g,";")+t.substring(n,t.length));let i=J.exec(t||""),r={},o=14;for(;o--;)r[$[o]]=i[o]||"";return -1!=s&&-1!=n&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=function(t,e){const s=/\/{2,9}/g,n=e.replace(s,"/").split("/");"/"!=e.slice(0,1)&&0!==e.length||n.splice(0,1);"/"==e.slice(-1)&&n.splice(n.length-1,1);return n}(0,r.path),r.queryKey=function(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,(function(t,e,n){e&&(s[e]=n);})),s}(0,r.query),r}class X extends k{constructor(t,e={}){super(),this.binaryType="arraybuffer",this.writeBuffer=[],t&&"object"==typeof t&&(e=t,t=null),t?(t=Q(t),e.hostname=t.host,e.secure="https"===t.protocol||"wss"===t.protocol,e.port=t.port,t.query&&(e.query=t.query)):e.host&&(e.hostname=Q(e.host).host),T(this,e),this.secure=null!=e.secure?e.secure:"undefined"!=typeof location&&"https:"===location.protocol,e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||("undefined"!=typeof location?location.hostname:"localhost"),this.port=e.port||("undefined"!=typeof location&&location.port?location.port:this.secure?"443":"80"),this.transports=e.transports||["polling","websocket","webtransport"],this.writeBuffer=[],this.prevBufferLen=0,this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),"string"==typeof this.opts.query&&(this.opts.query=function(t){let e={},s=t.split("&");for(let t=0,n=s.length;t<n;t++){let n=s[t].split("=");e[decodeURIComponent(n[0])]=decodeURIComponent(n[1]);}return e}(this.opts.query)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingTimeoutTimer=null,"function"==typeof addEventListener&&(this.opts.closeOnBeforeunload&&(this.beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close());},addEventListener("beforeunload",this.beforeunloadEventListener,!1)),"localhost"!==this.hostname&&(this.offlineEventListener=()=>{this.onClose("transport close",{description:"network connection lost"});},addEventListener("offline",this.offlineEventListener,!1))),this.open();}createTransport(t){const e=Object.assign({},this.opts.query);e.EIO=4,e.transport=t,this.id&&(e.sid=this.id);const s=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new z[t](s)}open(){let t;if(this.opts.rememberUpgrade&&X.priorWebsocketSuccess&&-1!==this.transports.indexOf("websocket"))t="websocket";else {if(0===this.transports.length)return void this.setTimeoutFn((()=>{this.emitReserved("error","No transports available");}),0);t=this.transports[0];}this.readyState="opening";try{t=this.createTransport(t);}catch(t){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t);}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this.onDrain.bind(this)).on("packet",this.onPacket.bind(this)).on("error",this.onError.bind(this)).on("close",(t=>this.onClose("transport close",t)));}probe(t){let e=this.createTransport(t),s=!1;X.priorWebsocketSuccess=!1;const n=()=>{s||(e.send([{type:"ping",data:"probe"}]),e.once("packet",(t=>{if(!s)if("pong"===t.type&&"probe"===t.data){if(this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;X.priorWebsocketSuccess="websocket"===e.name,this.transport.pause((()=>{s||"closed"!==this.readyState&&(c(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush());}));}else {const t=new Error("probe error");t.transport=e.name,this.emitReserved("upgradeError",t);}})));};function i(){s||(s=!0,c(),e.close(),e=null);}const r=t=>{const s=new Error("probe error: "+t);s.transport=e.name,i(),this.emitReserved("upgradeError",s);};function o(){r("transport closed");}function a(){r("socket closed");}function h(t){e&&t.name!==e.name&&i();}const c=()=>{e.removeListener("open",n),e.removeListener("error",r),e.removeListener("close",o),this.off("close",a),this.off("upgrading",h);};e.once("open",n),e.once("error",r),e.once("close",o),this.once("close",a),this.once("upgrading",h),-1!==this.upgrades.indexOf("webtransport")&&"webtransport"!==t?this.setTimeoutFn((()=>{s||e.open();}),200):e.open();}onOpen(){if(this.readyState="open",X.priorWebsocketSuccess="websocket"===this.transport.name,this.emitReserved("open"),this.flush(),"open"===this.readyState&&this.opts.upgrade){let t=0;const e=this.upgrades.length;for(;t<e;t++)this.probe(this.upgrades[t]);}}onPacket(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),this.resetPingTimeout(),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this.sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong");break;case"error":const e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.maxPayload=t.maxPayload,this.onOpen(),"closed"!==this.readyState&&this.resetPingTimeout();}resetPingTimeout(){this.clearTimeoutFn(this.pingTimeoutTimer),this.pingTimeoutTimer=this.setTimeoutFn((()=>{this.onClose("ping timeout");}),this.pingInterval+this.pingTimeout),this.opts.autoUnref&&this.pingTimeoutTimer.unref();}onDrain(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emitReserved("drain"):this.flush();}flush(){if("closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this.getWritablePackets();this.transport.send(t),this.prevBufferLen=t.length,this.emitReserved("flush");}}getWritablePackets(){if(!(this.maxPayload&&"polling"===this.transport.name&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let s=0;s<this.writeBuffer.length;s++){const n=this.writeBuffer[s].data;if(n&&(t+="string"==typeof(e=n)?function(t){let e=0,s=0;for(let n=0,i=t.length;n<i;n++)e=t.charCodeAt(n),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(n++,s+=4);return s}(e):Math.ceil(1.33*(e.byteLength||e.size))),s>0&&t>this.maxPayload)return this.writeBuffer.slice(0,s);t+=2;}var e;return this.writeBuffer}write(t,e,s){return this.sendPacket("message",t,e,s),this}send(t,e,s){return this.sendPacket("message",t,e,s),this}sendPacket(t,e,s,n){if("function"==typeof e&&(n=e,e=void 0),"function"==typeof s&&(n=s,s=null),"closing"===this.readyState||"closed"===this.readyState)return;(s=s||{}).compress=!1!==s.compress;const i={type:t,data:e,options:s};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),n&&this.once("flush",n),this.flush();}close(){const t=()=>{this.onClose("forced close"),this.transport.close();},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),t();},s=()=>{this.once("upgrade",e),this.once("upgradeError",e);};return "opening"!==this.readyState&&"open"!==this.readyState||(this.readyState="closing",this.writeBuffer.length?this.once("drain",(()=>{this.upgrading?s():t();})):this.upgrading?s():t()),this}onError(t){X.priorWebsocketSuccess=!1,this.emitReserved("error",t),this.onClose("transport error",t);}onClose(t,e){"opening"!==this.readyState&&"open"!==this.readyState&&"closing"!==this.readyState||(this.clearTimeoutFn(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),"function"==typeof removeEventListener&&(removeEventListener("beforeunload",this.beforeunloadEventListener,!1),removeEventListener("offline",this.offlineEventListener,!1)),this.readyState="closed",this.id=null,this.emitReserved("close",t,e),this.writeBuffer=[],this.prevBufferLen=0);}filterUpgrades(t){const e=[];let s=0;const n=t.length;for(;s<n;s++)~this.transports.indexOf(t[s])&&e.push(t[s]);return e}}X.protocol=4;const G="function"==typeof ArrayBuffer,Z=t=>"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,tt=Object.prototype.toString,et="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===tt.call(Blob),st="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===tt.call(File);function nt(t){return G&&(t instanceof ArrayBuffer||Z(t))||et&&t instanceof Blob||st&&t instanceof File}function it(t,e){if(!t||"object"!=typeof t)return !1;if(Array.isArray(t)){for(let e=0,s=t.length;e<s;e++)if(it(t[e]))return !0;return !1}if(nt(t))return !0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return it(t.toJSON(),!0);for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e)&&it(t[e]))return !0;return !1}function rt(t){const e=[],s=t.data,n=t;return n.data=ot(s,e),n.attachments=e.length,{packet:n,buffers:e}}function ot(t,e){if(!t)return t;if(nt(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}if(Array.isArray(t)){const s=new Array(t.length);for(let n=0;n<t.length;n++)s[n]=ot(t[n],e);return s}if("object"==typeof t&&!(t instanceof Date)){const s={};for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&(s[n]=ot(t[n],e));return s}return t}function at(t,e){return t.data=ht(t.data,e),delete t.attachments,t}function ht(t,e){if(!t)return t;if(t&&!0===t._placeholder){if("number"==typeof t.num&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=ht(t[s],e);else if("object"==typeof t)for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=ht(t[s],e));return t}const ct=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var pt;!function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK";}(pt||(pt={}));function lt(t){return "[object Object]"===Object.prototype.toString.call(t)}class dt extends k{constructor(t){super(),this.reviver=t;}add(t){let e;if("string"==typeof t){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");e=this.decodeString(t);const s=e.type===pt.BINARY_EVENT;s||e.type===pt.BINARY_ACK?(e.type=s?pt.EVENT:pt.ACK,this.reconstructor=new ft(e),0===e.attachments&&super.emitReserved("decoded",e)):super.emitReserved("decoded",e);}else {if(!nt(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");e=this.reconstructor.takeBinaryData(t),e&&(this.reconstructor=null,super.emitReserved("decoded",e));}}decodeString(t){let e=0;const s={type:Number(t.charAt(0))};if(void 0===pt[s.type])throw new Error("unknown packet type "+s.type);if(s.type===pt.BINARY_EVENT||s.type===pt.BINARY_ACK){const n=e+1;for(;"-"!==t.charAt(++e)&&e!=t.length;);const i=t.substring(n,e);if(i!=Number(i)||"-"!==t.charAt(e))throw new Error("Illegal attachments");s.attachments=Number(i);}if("/"===t.charAt(e+1)){const n=e+1;for(;++e;){if(","===t.charAt(e))break;if(e===t.length)break}s.nsp=t.substring(n,e);}else s.nsp="/";const n=t.charAt(e+1);if(""!==n&&Number(n)==n){const n=e+1;for(;++e;){const s=t.charAt(e);if(null==s||Number(s)!=s){--e;break}if(e===t.length)break}s.id=Number(t.substring(n,e+1));}if(t.charAt(++e)){const n=this.tryParse(t.substr(e));if(!dt.isPayloadValid(s.type,n))throw new Error("invalid payload");s.data=n;}return s}tryParse(t){try{return JSON.parse(t,this.reviver)}catch(t){return !1}}static isPayloadValid(t,e){switch(t){case pt.CONNECT:return lt(e);case pt.DISCONNECT:return void 0===e;case pt.CONNECT_ERROR:return "string"==typeof e||lt(e);case pt.EVENT:case pt.BINARY_EVENT:return Array.isArray(e)&&("number"==typeof e[0]||"string"==typeof e[0]&&-1===ct.indexOf(e[0]));case pt.ACK:case pt.BINARY_ACK:return Array.isArray(e)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null);}}class ft{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t;}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const t=at(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[];}}var yt=Object.freeze({__proto__:null,protocol:5,get PacketType(){return pt},Encoder:class{constructor(t){this.replacer=t;}encode(t){return t.type!==pt.EVENT&&t.type!==pt.ACK||!it(t)?[this.encodeAsString(t)]:this.encodeAsBinary({type:t.type===pt.EVENT?pt.BINARY_EVENT:pt.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id})}encodeAsString(t){let e=""+t.type;return t.type!==pt.BINARY_EVENT&&t.type!==pt.BINARY_ACK||(e+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(e+=t.nsp+","),null!=t.id&&(e+=t.id),null!=t.data&&(e+=JSON.stringify(t.data,this.replacer)),e}encodeAsBinary(t){const e=rt(t),s=this.encodeAsString(e.packet),n=e.buffers;return n.unshift(s),n}},Decoder:dt});function gt(t,e,s){return t.on(e,s),function(){t.off(e,s);}}const mt=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class bt extends k{constructor(t,e,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=e,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open();}get disconnected(){return !this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[gt(t,"open",this.onopen.bind(this)),gt(t,"packet",this.onpacket.bind(this)),gt(t,"error",this.onerror.bind(this)),gt(t,"close",this.onclose.bind(this))];}get active(){return !!this.subs}connect(){return this.connected||(this.subEvents(),this.io._reconnecting||this.io.open(),"open"===this.io._readyState&&this.onopen()),this}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...e){if(mt.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(e.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(e),this;const s={type:pt.EVENT,data:e,options:{}};if(s.options.compress=!1!==this.flags.compress,"function"==typeof e[e.length-1]){const t=this.ids++,n=e.pop();this._registerAckCallback(t,n),s.id=t;}const n=this.io.engine&&this.io.engine.transport&&this.io.engine.transport.writable;return this.flags.volatile&&(!n||!this.connected)||(this.connected?(this.notifyOutgoingListeners(s),this.packet(s)):this.sendBuffer.push(s)),this.flags={},this}_registerAckCallback(t,e){var s;const n=null!==(s=this.flags.timeout)&&void 0!==s?s:this._opts.ackTimeout;if(void 0===n)return void(this.acks[t]=e);const i=this.io.setTimeoutFn((()=>{delete this.acks[t];for(let e=0;e<this.sendBuffer.length;e++)this.sendBuffer[e].id===t&&this.sendBuffer.splice(e,1);e.call(this,new Error("operation has timed out"));}),n),r=(...t)=>{this.io.clearTimeoutFn(i),e.apply(this,t);};r.withError=!0,this.acks[t]=r;}emitWithAck(t,...e){return new Promise(((s,n)=>{const i=(t,e)=>t?n(t):s(e);i.withError=!0,e.push(i),this.emit(t,...e);}))}_addToQueue(t){let e;"function"==typeof t[t.length-1]&&(e=t.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push(((t,...n)=>{if(s!==this._queue[0])return;return null!==t?s.tryCount>this._opts.retries&&(this._queue.shift(),e&&e(t)):(this._queue.shift(),e&&e(null,...n)),s.pending=!1,this._drainQueue()})),this._queue.push(s),this._drainQueue();}_drainQueue(t=!1){if(!this.connected||0===this._queue.length)return;const e=this._queue[0];e.pending&&!t||(e.pending=!0,e.tryCount++,this.flags=e.flags,this.emit.apply(this,e.args));}packet(t){t.nsp=this.nsp,this.io._packet(t);}onopen(){"function"==typeof this.auth?this.auth((t=>{this._sendConnectPacket(t);})):this._sendConnectPacket(this.auth);}_sendConnectPacket(t){this.packet({type:pt.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t});}onerror(t){this.connected||this.emitReserved("connect_error",t);}onclose(t,e){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,e),this._clearAcks();}_clearAcks(){Object.keys(this.acks).forEach((t=>{if(!this.sendBuffer.some((e=>String(e.id)===t))){const e=this.acks[t];delete this.acks[t],e.withError&&e.call(this,new Error("socket has been disconnected"));}}));}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case pt.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case pt.EVENT:case pt.BINARY_EVENT:this.onevent(t);break;case pt.ACK:case pt.BINARY_ACK:this.onack(t);break;case pt.DISCONNECT:this.ondisconnect();break;case pt.CONNECT_ERROR:this.destroy();const e=new Error(t.data.message);e.data=t.data.data,this.emitReserved("connect_error",e);}}onevent(t){const e=t.data||[];null!=t.id&&e.push(this.ack(t.id)),this.connected?this.emitEvent(e):this.receiveBuffer.push(Object.freeze(e));}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const e=this._anyListeners.slice();for(const s of e)s.apply(this,t);}super.emit.apply(this,t),this._pid&&t.length&&"string"==typeof t[t.length-1]&&(this._lastOffset=t[t.length-1]);}ack(t){const e=this;let s=!1;return function(...n){s||(s=!0,e.packet({type:pt.ACK,id:t,data:n}));}}onack(t){const e=this.acks[t.id];"function"==typeof e&&(delete this.acks[t.id],e.withError&&t.data.unshift(null),e.apply(this,t.data));}onconnect(t,e){this.id=t,this.recovered=e&&this._pid===e,this._pid=e,this.connected=!0,this.emitBuffered(),this.emitReserved("connect"),this._drainQueue(!0);}emitBuffered(){this.receiveBuffer.forEach((t=>this.emitEvent(t))),this.receiveBuffer=[],this.sendBuffer.forEach((t=>{this.notifyOutgoingListeners(t),this.packet(t);})),this.sendBuffer=[];}ondisconnect(){this.destroy(),this.onclose("io server disconnect");}destroy(){this.subs&&(this.subs.forEach((t=>t())),this.subs=void 0),this.io._destroy(this);}disconnect(){return this.connected&&this.packet({type:pt.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const e=this._anyListeners;for(let s=0;s<e.length;s++)if(t===e[s])return e.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const e=this._anyOutgoingListeners;for(let s=0;s<e.length;s++)if(t===e[s])return e.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const e=this._anyOutgoingListeners.slice();for(const s of e)s.apply(this,t.data);}}}function wt(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0;}wt.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-s:t+s;}return 0|Math.min(t,this.max)},wt.prototype.reset=function(){this.attempts=0;},wt.prototype.setMin=function(t){this.ms=t;},wt.prototype.setMax=function(t){this.max=t;},wt.prototype.setJitter=function(t){this.jitter=t;};class vt extends k{constructor(t,e){var s;super(),this.nsps={},this.subs=[],t&&"object"==typeof t&&(e=t,t=void 0),(e=e||{}).path=e.path||"/socket.io",this.opts=e,T(this,e),this.reconnection(!1!==e.reconnection),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(null!==(s=e.randomizationFactor)&&void 0!==s?s:.5),this.backoff=new wt({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this._readyState="closed",this.uri=t;const n=e.parser||yt;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=!1!==e.autoConnect,this._autoConnect&&this.open();}reconnection(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection}reconnectionAttempts(t){return void 0===t?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var e;return void 0===t?this._reconnectionDelay:(this._reconnectionDelay=t,null===(e=this.backoff)||void 0===e||e.setMin(t),this)}randomizationFactor(t){var e;return void 0===t?this._randomizationFactor:(this._randomizationFactor=t,null===(e=this.backoff)||void 0===e||e.setJitter(t),this)}reconnectionDelayMax(t){var e;return void 0===t?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,null===(e=this.backoff)||void 0===e||e.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect();}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new X(this.uri,this.opts);const e=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const n=gt(e,"open",(function(){s.onopen(),t&&t();})),i=e=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",e),t?t(e):this.maybeReconnectOnOpen();},r=gt(e,"error",i);if(!1!==this._timeout){const t=this._timeout,s=this.setTimeoutFn((()=>{n(),i(new Error("timeout")),e.close();}),t);this.opts.autoUnref&&s.unref(),this.subs.push((()=>{this.clearTimeoutFn(s);}));}return this.subs.push(n),this.subs.push(r),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(gt(t,"ping",this.onping.bind(this)),gt(t,"data",this.ondata.bind(this)),gt(t,"error",this.onerror.bind(this)),gt(t,"close",this.onclose.bind(this)),gt(this.decoder,"decoded",this.ondecoded.bind(this)));}onping(){this.emitReserved("ping");}ondata(t){try{this.decoder.add(t);}catch(t){this.onclose("parse error",t);}}ondecoded(t){K((()=>{this.emitReserved("packet",t);}),this.setTimeoutFn);}onerror(t){this.emitReserved("error",t);}socket(t,e){let s=this.nsps[t];return s?this._autoConnect&&!s.active&&s.connect():(s=new bt(this,t,e),this.nsps[t]=s),s}_destroy(t){const e=Object.keys(this.nsps);for(const t of e){if(this.nsps[t].active)return}this._close();}_packet(t){const e=this.encoder.encode(t);for(let s=0;s<e.length;s++)this.engine.write(e[s],t.options);}cleanup(){this.subs.forEach((t=>t())),this.subs.length=0,this.decoder.destroy();}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close"),this.engine&&this.engine.close();}disconnect(){return this._close()}onclose(t,e){this.cleanup(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,e),this._reconnection&&!this.skipReconnect&&this.reconnect();}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else {const e=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn((()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),t.skipReconnect||t.open((e=>{e?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",e)):t.onreconnect();})));}),e);this.opts.autoUnref&&s.unref(),this.subs.push((()=>{this.clearTimeoutFn(s);}));}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t);}}const kt={};function _t(t,e){"object"==typeof t&&(e=t,t=void 0);const s=function(t,e="",s){let n=t;s=s||"undefined"!=typeof location&&location,null==t&&(t=s.protocol+"//"+s.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?s.protocol+t:s.host+t),/^(https?|wss?):\/\//.test(t)||(t=void 0!==s?s.protocol+"//"+t:"https://"+t),n=Q(t)),n.port||(/^(http|ws)$/.test(n.protocol)?n.port="80":/^(http|ws)s$/.test(n.protocol)&&(n.port="443")),n.path=n.path||"/";const i=-1!==n.host.indexOf(":")?"["+n.host+"]":n.host;return n.id=n.protocol+"://"+i+":"+n.port+e,n.href=n.protocol+"://"+i+(s&&s.port===n.port?"":":"+n.port),n}(t,(e=e||{}).path||"/socket.io"),n=s.source,i=s.id,r=s.path,o=kt[i]&&r in kt[i].nsps;let a;return e.forceNew||e["force new connection"]||!1===e.multiplex||o?a=new vt(n,e):(kt[i]||(kt[i]=new vt(n,e)),a=kt[i]),s.query&&!e.query&&(e.query=s.queryKey),a.socket(s.path,e)}Object.assign(_t,{Manager:vt,Socket:bt,io:_t,connect:_t});

// ============================================================================================================================ //
//  getSocket()                                                                                                                 //
// ============================================================================================================================ //
function getSocket(endpoint, connectCallback, dataCallback) {
  let socket = _t(endpoint);

  socket.on("connect", () => {
    if(!socket.connectionInitiated) {
      socket.connectionInitiated = true;
      connectCallback(socket);
    }
  });

  socket.on("data", dataCallback);

  socket.sendMessage = async function(msgId, obj = {}) {
    let arg = { id: msgId, data: obj };

    if(msgId & MSG_ACK) {
      return await new Promise(function(resolve) {
        socket.emit("data", arg, answer => resolve(answer));
      });
    }

    socket.emit("data", arg);
  };

  return socket;
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

// ============================================================================================================================ //
//  create()                                                                                                                    //
// ============================================================================================================================ //
function create$6(applicationId, qrId, publicKey) {
  console.log("qrCode.create", applicationId, qrId, publicKey);

  let data = from(applicationId, qrId, publicKey);

  let qr     = qrcode(0, "L"),
      b64    = encodeBinary(data, URL$1),
      qrData = `carmentis:${b64}`;

  qr.addData(qrData, "Byte");
  qr.make();

  let qrImgTag = qr.createImgTag(4, 0);

  return [ qrImgTag, qrData ];
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
function decode$5(qrData) {
  let match = qrData.match(/^carmentis:([\w-]*)$/);

  if(!match) {
    return false;
  }

  let data = decodeBinary(match[1], URL$1),
      applicationId = data.slice(0, 32),
      qrId = data.slice(32, 48),
      publicKey = data.slice(48);

  return [ applicationId, qrId, publicKey ];
}

// "CMTS"
const MAGIC = new Uint8Array([ 0x43, 0x4D, 0x54, 0x53 ]);

const OFFSET_MAGIC_STRING   = 0;   // ( 4 bytes)
const OFFSET_VERSION        = 4;   // ( 2 bytes)
const OFFSET_NONCE          = 6;   // ( 6 bytes)
const OFFSET_PREV_HASH      = 12;  // (32 bytes)
const OFFSET_TYPE           = 12;  // ( 1 byte )
const OFFSET_SEED           = 28;  // (16 bytes)
const OFFSET_TIMESTAMP      = 44;  // ( 6 bytes)
const OFFSET_N_SECTION      = 50;  // ( 1 byte )
const OFFSET_GAS            = 51;  // ( 3 bytes)
const OFFSET_GAS_PRICE      = 54;  // ( 4 bytes)
const OFFSET_SIGNATURE      = 58;  // (64 bytes)

const BLK_HEADER_SIZE = 122;

const OFFSET_SEC_TYPE = 0;  // (1 byte )
const OFFSET_SEC_SIZE = 1;  // (3 bytes)

const SECTION_HEADER_SIZE = 4;

// ============================================================================================================================ //
//  createGenesis()                                                                                                             //
// ============================================================================================================================ //
async function createGenesis(objectType) {
  return await create$5(true, objectType);
}

// ============================================================================================================================ //
//  createNext()                                                                                                                //
// ============================================================================================================================ //
async function createNext(objectType) {
  return await create$5(false, objectType);
}

// ============================================================================================================================ //
//  create()                                                                                                                    //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  In addition to the initialization of the basic structures of the block, the timestamp is set at this very moment.           //
//  For a genesis block, the genesis seed and genesis ID are also set.                                                          //
// ============================================================================================================================ //
async function create$5(isGenesis, objectType) {
  let block = {
    isGenesis: isGenesis,
    sections : [],
    dataSize : 0,
    type     : objectType,
    ts       : Math.round(Date.now() / 1000)
  };

  if(isGenesis) {
    block.seed = getRandomBytes(16);
    computeGenesisId(block);
  }

  return block;
}

// ============================================================================================================================ //
//  computeGenesisId()                                                                                                          //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  The genesis ID is the hash of the 48-bit timestamp and 128-bit seed.                                                        //
// ============================================================================================================================ //
function computeGenesisId(block) {
  block.genesisId = sha256(from(intToByteArray(block.ts, 6), block.seed));
}

// ============================================================================================================================ //
//  writeSection()                                                                                                              //
// ============================================================================================================================ //
async function writeSection$2(block, type, obj, key) {
  let stream = await encodeSection(block.type, type, obj);

  let section = {
    type: type,
    data: stream,
    size: stream.length
  };

  block.sections.push(section);
  block.dataSize += stream.length;
}

// ============================================================================================================================ //
//  prepareBlockArray()                                                                                                         //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Prepares the Uint8 array for the block. The body is final but several header fields are left empty at this stage.           //
// ============================================================================================================================ //
async function prepareBlockArray(block) {
  let nSection = block.sections.length,
      size = BLK_HEADER_SIZE + nSection * SECTION_HEADER_SIZE + block.dataSize,
      gas = getGas(size);

  block.array = new Uint8Array(size);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  header                                                                                                                    //
  // -------------------------------------------------------------------------------------------------------------------------- //
  block.array.set(MAGIC, OFFSET_MAGIC_STRING);
  write16(block.array, PROTOCOL_VERSION, OFFSET_VERSION);

  if(block.isGenesis) {
    write48(block.array, 1, OFFSET_NONCE);
    block.nonce = 1;
    write8(block.array, block.type, OFFSET_TYPE);
    block.array.set(block.seed, OFFSET_SEED);
  }

  write48(block.array, block.ts, OFFSET_TIMESTAMP);
  write8(block.array, nSection, OFFSET_N_SECTION);
  write24(block.array, gas, OFFSET_GAS);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  body                                                                                                                      //
  // -------------------------------------------------------------------------------------------------------------------------- //
  let ptr = BLK_HEADER_SIZE;

  for(let section of block.sections) {
    write8(block.array, section.type, ptr + OFFSET_SEC_TYPE);
    write24(block.array, section.size, ptr + OFFSET_SEC_SIZE);
    block.array.set(section.data, ptr + SECTION_HEADER_SIZE);

    ptr += SECTION_HEADER_SIZE + section.size;
  }
}

// ============================================================================================================================ //
//  finalizeHeader()                                                                                                            //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Finalization of the block header.                                                                                           //
// ============================================================================================================================ //
async function finalizeHeader(block, sigPrivKey, prevNonce, prevHash, gasPrice = TOKEN) {
  // -------------------------------------------------------------------------------------------------------------------------- //
  //  if this is not a genesis block, set the current nonce and previous block hash                                             //
  // -------------------------------------------------------------------------------------------------------------------------- //
  if(!block.isGenesis) {
    write48(block.array, prevNonce + 1, OFFSET_NONCE);
    block.array.set(prevHash, OFFSET_PREV_HASH);
    block.nonce = prevNonce + 1;
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  set the gas price                                                                                                         //
  // -------------------------------------------------------------------------------------------------------------------------- //
  write32(block.array, gasPrice, OFFSET_GAS_PRICE);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  add the signature                                                                                                         //
  // -------------------------------------------------------------------------------------------------------------------------- //
  let dataToSign = getDataToSign(block),
      signature;

  if(sigPrivKey) {
    signature = await sign$1(sigPrivKey, dataToSign);
  }
  else {
    console.error("No signature key provided: microblock signed with all 0's");
    signature = new Uint8Array(64);
  }

  block.array.set(signature, OFFSET_SIGNATURE);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  compute the final block hash                                                                                              //
  // -------------------------------------------------------------------------------------------------------------------------- //
  block.hash = sha256(block.array);
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
async function decode$4(item) {
  let block = {};

  await decodeHeaderContent(block, item.content);
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
//  findSection()                                                                                                               //
// ============================================================================================================================ //
async function findSection(block, id, callback, key) {
  for(let section of block.sections) {
console.log("findSection, trying ...", section);
    if(section.type == id) {
      if(callback) {
        let [ data ] = await decodeSection(block.type, id, section.data);

console.log("findSection, data", data);

        if(!callback(data)) {
          continue;
        }
      }
      return section;
    }
  }

  return null;
}

// ============================================================================================================================ //
//  getSection()                                                                                                                //
// ============================================================================================================================ //
async function getSection(block, id, key) {
  let sectionData = block.sections.find(o => o.type == id);

  if(sectionData == undefined) {
    return {};
  }

  return await decodeSection(block.type, id, sectionData.data);
}

// ============================================================================================================================ //
//  decodeSections()                                                                                                            //
// ============================================================================================================================ //
async function decodeSections$1(block, key, callback) {
  for(let section of block.sections) {
    let [ data ] = await decodeSection(block.type, section.type, section.data);

    section.object = data;

    if(callback) {
      await callback(block.nonce, section.type, data);
    }
  }
}

// ============================================================================================================================ //
//  encodeSection()                                                                                                             //
// ============================================================================================================================ //
async function encodeSection(objType, type, obj, key) {
  let schema = SECTION[objType][type],
      publicData,
      privateData;

  publicData = await serialize(schema.public, obj);

  if(schema.private) {
//  if(!key) {
//    throw "no key provided for private sub-section";
//  }
    privateData = await serialize(schema.private, obj);
//  privateData = await crypto.aes.encryptGcm(key, privateData, crypto.aes.nonceToIv(1));
  }

  let stream = new Uint8Array(publicData.length + 3 + (privateData ? privateData.length + 3 : 0));

  stream.set([ publicData.length >> 16, publicData.length >> 8 & 0xFF, publicData.length & 0xFF ], 0);
  stream.set(publicData, 3);

  if(privateData) {
    stream.set([ privateData.length >> 16, privateData.length >> 8 & 0xFF, privateData.length & 0xFF ], publicData.length + 3);
    stream.set(privateData, publicData.length + 6);
  }

  return stream;
}

// ============================================================================================================================ //
//  decodeSection()                                                                                                             //
// ============================================================================================================================ //
async function decodeSection(objType, type, stream, key) {
  let schema = SECTION[objType][type],
      partialDecoding = false,
      obj = {},
      ptr = 0,
      size,
      serialized;

  size = stream[ptr++] << 16 | stream[ptr++] << 8 | stream[ptr++],
  serialized = stream.slice(ptr, ptr += size);

  await unserialize(schema.public, serialized, obj);

  if(schema.private) {
//  if(key) {
      size = stream[ptr++] << 16 | stream[ptr++] << 8 | stream[ptr++],
      serialized = stream.slice(ptr, ptr += size);
//    serialized = await crypto.aes.decryptGcm(key, serialized, crypto.aes.nonceToIv(1));

      await unserialize(schema.private, serialized, obj);
//  }
//  else {
//    partialDecoding = true;
//  }
  }

  return [ obj, partialDecoding ];
}

// ============================================================================================================================ //
//  decodeHeaderContent()                                                                                                       //
// ============================================================================================================================ //
async function decodeHeaderContent(block, array) {
  if(array.length < BLK_HEADER_SIZE) {
    return INVALID_HEADER_SIZE;
  }

  if(!isEqual(array.slice(OFFSET_MAGIC_STRING, MAGIC.length), MAGIC)) {
    return NOT_A_MICROBLOCK;
  }

  block.version = read16(array, OFFSET_VERSION);

  if(block.version != PROTOCOL_VERSION) {
    return INVALID_VERSION;
  }

  block.nonce     = read48(array, OFFSET_NONCE);
  block.prevHash  = array.slice(OFFSET_PREV_HASH, OFFSET_PREV_HASH + 32);
  block.ts        = read48(array, OFFSET_TIMESTAMP);
  block.nSection  = read8(array, OFFSET_N_SECTION);
  block.gas       = read24(array, OFFSET_GAS);
  block.gasPrice  = read32(array, OFFSET_GAS_PRICE);
  block.signature = array.slice(OFFSET_SIGNATURE, OFFSET_SIGNATURE + 64);

  if(block.nonce == 1) {
    block.seed = array.slice(OFFSET_SEED, OFFSET_SEED + 16);
    computeGenesisId(block);
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
        size = read24(array, ptr + OFFSET_SEC_SIZE),
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
  block.bodyHash = sha256(array.slice(BLK_HEADER_SIZE, ptr));

  return NONE;
}

// ============================================================================================================================ //
//  getDataToSign()                                                                                                             //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Extracts the block data to be signed, i.e. everything except the signature field itself.                                    //
// ============================================================================================================================ //
function getDataToSign(block) {
  return from(
    block.array.slice(0, OFFSET_SIGNATURE),
    block.array.slice(BLK_HEADER_SIZE)
  );
}

// ============================================================================================================================ //
//  getGas()                                                                                                                    //
// ============================================================================================================================ //
function getGas(size) {
  return GAS_FIXED + size * GAS_PER_BYTE;
}

// ============================================================================================================================ //
//  create()                                                                                                                    //
// ============================================================================================================================ //
function create$4(type) {
  let chain = createChainInstance(1);

  chain.type = type;

  return chain;
}

// ============================================================================================================================ //
//  load()                                                                                                                      //
// ============================================================================================================================ //
async function load$4(id, microBlockList) {
  let chain = createChainInstance(microBlockList.length + 1);

  chain.hash = id;
  chain.type = microBlockList[0].type;

  for(let blockId in microBlockList) {
    let block = await decode$4(microBlockList[blockId]);

    chain.microBlock.push(block);
  }

  return chain;
}

// ============================================================================================================================ //
//  addBlock()                                                                                                                  //
// ============================================================================================================================ //
async function addBlock(chain, privSigKey) {
  let prevNonce, prevHash,
      nBlock = chain.microBlock.length;

  if(nBlock) {
    let lastBlock = chain.microBlock[0];
    prevNonce = lastBlock.nonce;
    prevHash = lastBlock.hash;
  }

  await prepareBlockArray(chain.currentBlock);
  await finalizeHeader(chain.currentBlock, privSigKey, prevNonce, prevHash);

  let microBlock = chain.currentBlock;

  chain.microBlock.unshift(microBlock);
  chain.currentNonce++;
  chain.currentBlock = null;

  return microBlock;
}

// ============================================================================================================================ //
//  findBlock()                                                                                                                 //
// ============================================================================================================================ //
async function findBlock(chain, callback) {
  for(let block of chain.microBlock) {
    if(await callback(block)) {
      return block;
    }
  }

  return null;
}

// ============================================================================================================================ //
//  decodeSections()                                                                                                            //
// ============================================================================================================================ //
async function decodeSections(chain, keyring, callback) {
  let microBlockList = [...chain.microBlock].sort((a, b) => a.nonce - b.nonce);

  for(let microBlock of microBlockList) {
    await decodeSections$1(microBlock, keyring, callback);
  }
}

// ============================================================================================================================ //
//  writeSection()                                                                                                              //
// ============================================================================================================================ //
async function writeSection$1(chain, type, obj, key) {
  if(chain.currentBlock == null) {
    if(chain.microBlock.length) {
      chain.currentBlock = await createNext(chain.type);
    }
    else {
      chain.currentBlock = await createGenesis(chain.type);
    }
  }

  await writeSection$2(
    chain.currentBlock,
    type,
    obj);
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

  block.header = obj.data.header;
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

  return await load$4(id, list);
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

  let block = await decode$4(blockData);

  return block;
}

// ============================================================================================================================ //
//  create()                                                                                                                    //
// ============================================================================================================================ //
function create$3(type, objectCallback, keyring, sectionCallback) {
  let chain = create$4(type);

  return objectCallback({
    chain          : chain,
    keyring        : keyring,
    sectionCallback: sectionCallback
  });
}

// ============================================================================================================================ //
//  load()                                                                                                                      //
// ============================================================================================================================ //
async function load$3(type, chainId, objectCallback, keyring, sectionCallback) {
  let chain = await getMicroChain$1(chainId);

  if(chain.type != type) {
    throw `Inconsistent micro-chain type '${OBJECT_NAME[chain.type]}' ('${OBJECT_NAME[type]}' expected)`;
  }

  let obj = objectCallback({
    chain          : chain,
    keyring        : keyring,
    sectionCallback: sectionCallback
  });

  await decodeSections(chain, keyring, sectionCallback && (async (...arg) => await sectionCallback(obj, ...arg)));

  return obj;
}

// ============================================================================================================================ //
//  disableWriting()                                                                                                            //
// ============================================================================================================================ //
function disableWriting(obj) {
  obj.writingDisabled = true;
}

// ============================================================================================================================ //
//  getLastSection()                                                                                                            //
// ============================================================================================================================ //
async function getLastSection(type, microchainId, sectionId) {
  const objectName = OBJECT_NAME[type];

  if(!objectName) {
    throw `Unknown object type ${type}`;
  }

  const sectionName = SECTION_NAME[type][sectionId];

  if(!sectionName) {
    throw `Unknown section ID ${sectionId} in object of type '${objectName}'`;
  }

  let microChain = await getMicroChain$1(microchainId);

  if(microChain == null) {
    throw `Unable to load ${objectName}: unknown ID '${toHexa(microchainId)}'`;
  }

  let microBlock = await findBlock(microChain, async block => await findSection(block, sectionId));

  if(microBlock == null) {
    throw `Unable to locate the section '${sectionName}' in the ${objectName} microchain with ID '${toHexa(microchainId)}'`;
  }

  let [ data ] = await getSection(microBlock, sectionId);

  return data;
}

// ============================================================================================================================ //
//  writeSection()                                                                                                              //
// ============================================================================================================================ //
async function writeSection(obj, schemaId, dataObject, key) {
  if(!obj.writingDisabled) {
    await writeSection$1(obj.chain, schemaId, dataObject);
  }

  if(obj.sectionCallback) {
    await obj.sectionCallback(obj, obj.chain.currentNonce, schemaId, dataObject);
  }
}

// ============================================================================================================================ //
//  setSignatureKey()                                                                                                           //
// ============================================================================================================================ //
async function setSignatureKey(obj, signatureKey) {
  obj.signatureKey = signatureKey;
}

// ============================================================================================================================ //
//  submit()                                                                                                                    //
// ============================================================================================================================ //
async function submit(obj, sendToNetwork = true) {
  let microBlock = await addBlock(obj.chain, obj.signatureKey);

  if(!sendToNetwork) {
    return microBlock;
  }

  return await broadcastMicroblock$1(
    { data: microBlock.array }
  );
}

// ============================================================================================================================ //
//  loadBlock()                                                                                                                 //
// ============================================================================================================================ //
async function loadBlock(obj, callback, blockData) {
  let block = {
    type: obj.chain.type // why was it previously not necessary?
  };

  await decodeHeaderContent(block, blockData);
  await decodeBodyContent(block, blockData);
  await decodeSections$1(block, obj.keyring, async (...arg) => await callback(obj, ...arg));

  block.pending = true;

  obj.chain.microBlock.push(block);
}

const POSITIVE = 0;

const MSK16  = 0x0000FFFF;
const HI32   = 0xFFFF0000;

// ============================================================================================================================ //
//  fromWord16()                                                                                                                //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Creates a positive BigInt from an unsigned 16-bit integer.                                                                  //
// ============================================================================================================================ //
function fromWord16(v) {
  return {
    value: new Uint16Array([ v ]),
    sign : POSITIVE
  };
}

// ============================================================================================================================ //
//  toDecimalString()                                                                                                           //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Converts a BigInt to a decimal string.                                                                                      //
// ============================================================================================================================ //
function toDecimalString(a) {
  let d = fromWord16(10000),
      sign = a.sign,
      dec = "";

  while(!isZero(a)) {
    let [ q, r ] = divMod(a, d),
        part = r.value[0].toString();

    dec = (isZero(q) ? part : part.padStart(4, "0")) + dec;
    a = q;
  }
  return (sign ? "-" : "") + dec;
}

// ============================================================================================================================ //
//  isZero()                                                                                                                    //
// ============================================================================================================================ //
function isZero(a) {
  return zeroArray(a.value);
}

// ============================================================================================================================ //
//  zeroArray()                                                                                                                 //
// ============================================================================================================================ //
function zeroArray(a) {
  return a.every(n => !n);
}

// ============================================================================================================================ //
//  divMod()                                                                                                                    //
// ============================================================================================================================ //
function divMod(u, v) {
  if(isZero(v)) {
    throw "division by zero";
  }

  let cmp = compareAbs(u, v);

  if(cmp < 0) {
    return [
      {
        value: new Uint16Array([ 0 ]),
        sign : POSITIVE
      },
      {
        value: u.value.slice(),
        sign : isZero(u) ? POSITIVE : u.sign
      }
    ];
  }

  if(!cmp) {
    return [
      {
        value: new Uint16Array([ 1 ]),
        sign : u.sign ^ v.sign
      },
      {
        value: new Uint16Array([ 0 ]),
        sign : POSITIVE
      }
    ];
  }

  let [ q, r ] = divModUnsigned(u.value, v.value);

  return [
    {
      value: q,
      sign : u.sign ^ v.sign
    },
    {
      value: r,
      sign : zeroArray(r) ? POSITIVE : u.sign
    }
  ];
}

// ============================================================================================================================ //
//  divModUnsigned()                                                                                                            //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  This is a port of Algorithm D by Donald Knuth                                                                               //
// ============================================================================================================================ //
function divModUnsigned(u, v) {
  let m = length(u),
      n = length(v);

  let q = new Uint16Array(m - n + 1),
      r = new Uint16Array(n);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  single-digit divisor?                                                                                                     //
  // -------------------------------------------------------------------------------------------------------------------------- //
  if(n == 1) {
    let k = 0;

    for(let j = m - 1; j >= 0; j--) {
      let x = (k << 16 | u[j]) >>> 0;

      q[j] = Math.floor(x / v[0]);
      k = x - q[j] * v[0];
    }
    r[0] = k;

    return [ q, r ];
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  normalize                                                                                                                 //
  // -------------------------------------------------------------------------------------------------------------------------- //
  let un = new Uint16Array(2 * (m + 1)),
      vn = new Uint16Array(2 * n);

  let s = nlz16(v[n - 1]);

  for(let i = n - 1; i > 0; i--) {
    vn[i] = (v[i] << s) | (v[i - 1] >>> 16 - s);
  }
  vn[0] = v[0] << s;

  un[m] = u[m - 1] >>> 16 - s;

  for(let i = m - 1; i > 0; i--) {
    un[i] = (u[i] << s) | (u[i - 1] >>> 16 - s);
  }
  un[0] = u[0] << s;

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  main loop                                                                                                                 //
  // -------------------------------------------------------------------------------------------------------------------------- //
  for(let j = m - n; j >= 0; j--) {
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  compute estimate qhat of q[j]                                                                                           //
    // ------------------------------------------------------------------------------------------------------------------------ //
    let x = ((un[j + n] << 16 | un[j + n - 1]) >>> 0),
        qhat = Math.floor(x / vn[n - 1]),
        rhat = x - qhat * vn[n - 1];

    while(
      (
        qhat & HI32 ||
        qhat * vn[n - 2] > (rhat << 16 | un[j + n - 2]) >>> 0
      ) &&
      !((qhat--, rhat += vn[n - 1]) & HI32)
    ) {}

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  multiply and subtract                                                                                                   //
    // ------------------------------------------------------------------------------------------------------------------------ //
    let k = 0;

    for(let i = 0; i < n; i++) {
      let p = qhat * vn[i],
          t = un[i + j] - k - (p & MSK16);

      un[i + j] = t;
      k = (p >>> 16) - (t >> 16);
    }

    let t = un[j + n] - k;

    un[j + n] = t;
    q[j] = qhat;

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  if we subtracted too much, add back                                                                                     //
    // ------------------------------------------------------------------------------------------------------------------------ //
    if(t < 0) {
      q[j] = q[j] - 1;
      k = 0;

      for(let i = 0; i < n; i++) {
        t = un[i + j] + vn[i] + k;
        un[i + j] = t;
        k = t >> 16;
      }
      un[j + n] += k;
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  remainder                                                                                                                 //
  // -------------------------------------------------------------------------------------------------------------------------- //
  for(let i = 0; i < n; i++) {
    r[i] = (un[i] >>> s) | (un[i + 1] << 16 - s);
  }

  return [ q, r ];
}

// ============================================================================================================================ //
//  compareAbs()                                                                                                                //
// ============================================================================================================================ //
function compareAbs(a, b) {
  let max = Math.max(a.value.length, b.value.length);

  for(let i = max; i--;) {
    if(a.value[i] ^ b.value[i]) {
      return ~~a.value[i] > ~~b.value[i] ? 1 : -1;
    }
  }
  return 0;
}

// ============================================================================================================================ //
//  length()                                                                                                                    //
// ============================================================================================================================ //
function length(a) {
  let n = a.length;

  while(n > 1 && !a[n - 1]) {
    n--;
  }
  return n;
}

// ============================================================================================================================ //
//  nlz16()                                                                                                                     //
// ============================================================================================================================ //
function nlz16(n) {
  let z = 0;

  if(n <= 0x00FF) { n <<= 8; z += 8; }
  if(n <= 0x0FFF) { n <<= 4; z += 4; }
  if(n <= 0x3FFF) { n <<= 2; z += 2; }
  if(n <= 0x7FFF) { z++; }

  return z;
}

// ============================================================================================================================ //
//  Currency format: CNNNNNNN NNNNNNNN                                                                                          //
//                                                                                                                              //
//    C: custom currency flag                                                                                                   //
//    N: if C = 0, ISO 4217 currency code with 5 bits per character (interpreted as uppercase letters)                          //
//       if C = 1, index in the custom currency lookup table                                                                    //
// ============================================================================================================================ //

// ============================================================================================================================ //
//  encode()                                                                                                                    //
// ============================================================================================================================ //
function encode$2(str) {
  let custom = CUSTOM[str];

  return (
    custom == undefined ?
      [...str].reduce((p, c) => p << 5 | c.charCodeAt(0) - 65, 0)
    :
      0x8000 | custom[0]
  );
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
function decode$3(v) {
  return (
    v & 0x8000 ?
      Object.keys(CUSTOM).find(key => CUSTOM[0] == (v & 0x7FFF))
    :
      String.fromCharCode((v >> 10 & 0x1F) + 65, (v >> 5 & 0x1F) + 65, (v & 0x1F) + 65)
  );
}

// ============================================================================================================================ //
//  getWriteStream()                                                                                                            //
// ============================================================================================================================ //
function getWriteStream() {
  let data = [];

  let obj = {
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  getData()                                                                                                               //
    // ------------------------------------------------------------------------------------------------------------------------ //
    getData: _ => {
      return new Uint8Array(data);
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeUint8()                                                                                                            //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeUint8: n => {
      if(n & ~0xFF) {
        throw "not a byte";
      }
      data.push(n);
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeUint16()                                                                                                           //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeUint16: n => {
      if(n & ~0xFFFF) {
        throw "not a 16-bit value";
      }
      data.push(n >> 8, n & 0xFF);
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeVarint32()                                                                                                         //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeVarint32: n => {
      if(n) {
        while(n) {
          data.push(n & 0x7F | !(n >>= 7) << 7);
        }
      }
      else {
        data.push(0x80);
      }
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeTimestamp()                                                                                                        //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeTimestamp: ts => {
      obj.writeUint16(ts / 0x100000000 & 0xFFFF);
      obj.writeUint16(ts / 0x10000 & 0xFFFF);
      obj.writeUint16(ts & 0xFFFF);
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeCurrency()                                                                                                         //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeCurrency: str => {
      obj.writeUint16(encode$2(str));
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeBigint()                                                                                                           //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeBigint: a => {
      let arr = [...a.value],
          ptr = arr.length - 1,
          ndx = 6 - ptr * 16 % 7;

      while(arr[ptr] >> ndx) {
        ndx += 7;
      }

      if(ndx > 15) {
        arr.push(0);
        ndx -= 16;
        ptr++;
      }

      arr[ptr] |= a.sign << ndx;

      while(~ptr) {
        data.push(
          (
            ndx < 7 ?
              arr[ptr] << 6 - ndx | arr[--ptr] >> ndx + 10 & (1 << 6 - ndx) - 1
            :
              arr[ptr] >> ndx - 6
          )
          & 0x7F
          | !~ptr << 7
        );
        ndx = (ndx - 7) & 0xF;
      }
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeShortString()                                                                                                      //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeShortString: s => {
      let bin = encode$4(s),
          len = bin.length;

      if(len > 0xFF) {
        throw "string too long";
      }
      data = [...data, len, ...bin];
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeLongString()                                                                                                       //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeLongString: s => {
      let bin = encode$4(s),
          len = bin.length;

      if(len > 0xFFFF) {
        throw "string too long";
      }
      data = [...data, len >> 8, len & 0xFF, ...bin];
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  writeFile()                                                                                                             //
    // ------------------------------------------------------------------------------------------------------------------------ //
    writeFile: (name, size, crc32, sha256)  => {
      let bin = encode$4(name),
          len = bin.length;

      if(len > 0xFF) {
        throw "filename too long";
      }
      data = [...data, len, ...bin];
      obj.writeUint16(size / 2 ** 32 & 0xFFFF);
      obj.writeUint16(size >> 16 & 0xFFFF);
      obj.writeUint16(size & 0xFFFF);
      data = [...data, ...crc32, ...sha256];
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  append()                                                                                                                //
    // ------------------------------------------------------------------------------------------------------------------------ //
    append: bin => {
      data = [...data, ...bin];
    },
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  encodeItemList()                                                                                                        //
    // ------------------------------------------------------------------------------------------------------------------------ //
    encodeItemList: (fieldDef, itemList) => {
      let mask = [],
          maskPtr = 0,
          itemPtr = 0;

      for(let defId in fieldDef) {
        if(!itemList[itemPtr]) {
          break;
        }

        let def = fieldDef[defId],
            match = itemList[itemPtr].id == defId;

        if(!(def.flag & REQUIRED)) {
          mask[maskPtr >> 3] |= match << (maskPtr++ & 7);
        }

        itemPtr += match;
      }

      data = [...data, ...mask];
    }
  };

  return obj;
}

// ============================================================================================================================ //
//  getReadStream()                                                                                                             //
// ============================================================================================================================ //
function getReadStream(stream) {
  let ptr = 0;

  function read(pos) {
    if(pos >= stream.length) {
      throw `reached end of stream while attempting to read at position ${pos}`;
    }
    return stream[pos];
  }

  function slice(start, end) {
    if(end > stream.length) {
      throw `reached end of stream while attempting to read from ${start} to ${end}`;
    }
    return stream.slice(start, end);
  }

  function readUint8Raw()       { return slice(ptr, ++ptr); }
  function readUint16Raw()      { return slice(ptr, ptr += 2); }
  function readVarintArray()    { let endPtr = ptr; while(!(read(endPtr++) & 0x80)) {} return slice(ptr, ptr = endPtr); }
  function readDecimalRaw()     { return [ read(ptr++), ...readVarintArray() ]; }
  function readAmountRaw()      { return [ ...slice(ptr, ptr += 2), ...readDecimalRaw() ]; }
  function readDateRaw()        { return slice(ptr, ptr += 6); }
  function readShortStringRaw() { let len = read(ptr); return slice(ptr, ptr += len + 1); }
  function readLongStringRaw()  { let len = read(ptr) << 8 | read(ptr + 1); return slice(ptr, ptr += len + 2); }
  function readFileRaw()        { let len = read(ptr); return slice(ptr, ptr += len + 43); }

  return {
    // ------------------------------------------------------------------------------------------------------------------------ //
    //  eot()                                                                                                                   //
    // ------------------------------------------------------------------------------------------------------------------------ //
    eot: _ => ptr >= stream.length,

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  getPointer() / setPointer()                                                                                             //
    // ------------------------------------------------------------------------------------------------------------------------ //
    getPointer: _ => ptr,
    setPointer: n => { ptr = n; },

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  slice()                                                                                                                 //
    // ------------------------------------------------------------------------------------------------------------------------ //
    slice: (start, end) => slice(start, end),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readUint8Raw() / readUint8()                                                                                            //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readUint8Raw: readUint8Raw,
    readUint8: _ => read(ptr++),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readUint16Raw() / readUint16()                                                                                          //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readUint16Raw: readUint16Raw,
    readUint16: _ => read(ptr++) << 8 | read(ptr++),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readVarint32Raw() / readVarint32()                                                                                      //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readVarint32Raw: readVarintArray,
    readVarint32: _ => decodeVarint32(readVarintArray()),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readBigintRaw() / readBigint()                                                                                          //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readBigintRaw: readVarintArray,
    readBigint: _ => decodeBigint(readVarintArray()),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readDecimalRaw() / readDecimal()                                                                                        //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readDecimalRaw: readDecimalRaw,
    readDecimal: _ => decodeDecimal(readDecimalRaw()),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readAmountRaw() / readAmount()                                                                                          //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readAmountRaw: readAmountRaw,
    readAmount: _ => decodeAmount(readAmountRaw()),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readDateRaw() / readDate()                                                                                              //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readDateRaw: readDateRaw,
    readDate: _ => decodeDate(readDateRaw()),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readShortStringRaw() / readShortString()                                                                                //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readShortStringRaw: readShortStringRaw,
    readShortString: _ => decodeString(readShortStringRaw().slice(1)),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readLongStringRaw() / readLongString()                                                                                  //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readLongStringRaw: readLongStringRaw,
    readLongString: _ => decodeString(readLongStringRaw().slice(2)),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  readFileRaw() / readFile()                                                                                              //
    // ------------------------------------------------------------------------------------------------------------------------ //
    readFileRaw: readFileRaw,
    readFile: _ => decodeFile(readFileRaw()),

    // ------------------------------------------------------------------------------------------------------------------------ //
    //  decodeItemList()                                                                                                        //
    // ------------------------------------------------------------------------------------------------------------------------ //
    decodeItemList: fieldDef => {
      let mask,
          maskPtr = 0,
          itemList = [];

      for(let defId in fieldDef) {
        let def = fieldDef[defId];

        if(
          def.flag & REQUIRED ||
          (mask = maskPtr & 7 ? mask : stream[ptr++]) & 1 << (maskPtr++ & 7)
        ) {
          itemList.push(+defId);
        }
      }

      return itemList;
    }
  };
}

// ============================================================================================================================ //
//  decodeUint16()                                                                                                              //
// ============================================================================================================================ //
function decodeUint16(data) {
  return data[0] << 8 | data[1];
}

// ============================================================================================================================ //
//  decodeVarint32()                                                                                                            //
// ============================================================================================================================ //
function decodeVarint32(data) {
  return data.reduce((p, v, i) => p | (v & 0x7F) << i * 7, 0);
}

// ============================================================================================================================ //
//  decodeBigint()                                                                                                              //
// ============================================================================================================================ //
function decodeBigint(data) {
  let sign = data[0] >> 6 & 1,
      value = [],
      i = 0;

  for(let ndx = 0, p = data.length; p--;) {
    value[i] |= (data[p] & (0x7F >> !p)) << ndx;

    if(ndx > 8) {
      value[++i] = value[i - 1] >> 16;
    }
    ndx = (ndx + 7) & 0xF;
  }

  return toDecimalString({
    value: new Uint16Array(value[i] || value.length == 1 ? value : value.slice(0, -1)),
    sign : sign
  });
}

// ============================================================================================================================ //
//  decodeDecimal()                                                                                                             //
// ============================================================================================================================ //
function decodeDecimal(data) {
  let exp = (data[0] ^ 0x80) - 0x80,
      str = decodeBigint(data.slice(1));

  if(exp < 0) {
    let sign = str[0] == "-";

    str = str.slice(+sign).padStart(1 - exp, "0");
    return (sign ? "-" : "") + str.slice(0, str.length + exp) + "." + str.slice(exp);
  }
  return str + "0".repeat(exp);
}

// ============================================================================================================================ //
//  decodeAmount()                                                                                                              //
// ============================================================================================================================ //
function decodeAmount(data) {
  return {
    amount  : decodeBigint(data.slice(2)),
    currency: decode$3(decodeUint16(data.slice(0, 2)))
  };
}

// ============================================================================================================================ //
//  decodeDate()                                                                                                                //
// ============================================================================================================================ //
function decodeDate(data) {
  let ts =
    decodeUint16(data.slice(0, 2)) * 0x100000000 +
    decodeUint16(data.slice(2, 4)) * 0x10000 +
    decodeUint16(data.slice(4, 6));

  return (new Date(ts * 1000)).toJSON();
}

// ============================================================================================================================ //
//  decodeString()                                                                                                              //
// ============================================================================================================================ //
function decodeString(data) {
  return decode$7(data);
}

// ============================================================================================================================ //
//  decodeFile()                                                                                                                //
// ============================================================================================================================ //
function decodeFile(data) {
  let len = data[0],
      ptr = len + 1;

  let size = (data[ptr++] << 8 | data[ptr++]) * 2 ** 32 +
             (data[ptr++] << 8 | data[ptr++]) * 2 ** 16 +
             (data[ptr++] << 8 | data[ptr++]);

  let crc32 = toHexa(new Uint8Array(data.slice(ptr, ptr += 4))),
      sha256 = toHexa(new Uint8Array(data.slice(ptr, ptr + 32)));

  return {
    name  : decodeString(data.slice(1, len + 1)),
    size  : size,
    crc32 : crc32,
    sha256: sha256
  };
}

// ============================================================================================================================ //
//  parseFieldReference()                                                                                                       //
// ============================================================================================================================ //
function parseFieldReference(appDef, fieldRef) {
  let errorHeader = `In {{${fieldRef}}}: `;

  let m = fieldRef.match(/^(this|last|previous)\.((\w+)(\.\w+)*)$/);

  if(!m) {
    throw errorHeader + `invalid format`;
  }

  let collection = appDef.field,
      type = REF_NAME.indexOf(m[1]),
      arr = m[2].split("."),
      path = [];

  arr.forEach((name, i) => {
    let endOfList = i == arr.length - 1,
        ndx = collection.findIndex(o => o.name == name);

    if(!~ndx) {
      throw errorHeader + `unknown field '${name}'`;
    }

    path.push(ndx);

    let item = collection[ndx];

    if(item.flag & STRUCT) {
      if(endOfList) {
        throw errorHeader + `no property specified for structure '${name}'`;
      }
      collection = appDef.structure[item.id].property;
    }
    else {
      if(!endOfList) {
        throw errorHeader + `'${name}' is a primitive type, which cannot be followed by other fields`;
      }
    }
  });

  return [ type, path ];
}

// ============================================================================================================================ //
//  buildFieldReference()                                                                                                       //
// ============================================================================================================================ //
function buildFieldReference(appDef, type, path) {
  let arr = [ REF_NAME[type] ],
      collection = appDef.field;

  path.forEach((ndx, i) => {
    let item = collection[ndx];

    arr.push(item.name);

    if(i < path.length - 1) {
      collection = appDef.structure[item.id].property;
    }
  });

  return arr.join(".");
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
async function decode$2(appDef, encodedRecord) {
console.log("decodeRecord", encodedRecord);
  let structStream  = getReadStream(encodedRecord.structData),
      publicStream  = getReadStream(encodedRecord.publicData),
      privateStream = encodedRecord.channelData && encodedRecord.channelData[0] && getReadStream(encodedRecord.channelData[0]),
      record = {};

  await processDecoding(structStream, appDef, record, decodePrimitive);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  decodePrimitive()                                                                                                         //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function decodePrimitive(itemDef) {
    let itemStream = itemDef.flag & PUBLIC ? publicStream : privateStream,
        field = itemStream ? readField(itemStream, appDef, itemDef) : null;

    return field;
  }

  return record;
}

// ============================================================================================================================ //
//  readField()                                                                                                                 //
// ============================================================================================================================ //
function readField(itemStream, appDef, itemDef) {
  if(itemDef.flag & ENUM) {
    return appDef.enumeration[itemDef.id].value[itemStream.readUint8()];
  }

  switch(itemDef.id) {
    case T_STRING : { return itemStream.readLongString(); }
    case T_INTEGER: { return itemStream.readBigint(); }
    case T_DECIMAL: { return itemStream.readDecimal(); }
    case T_AMOUNT : { return itemStream.readAmount(); }
    case T_DATE   : { return itemStream.readDate(); }
    case T_FILE   : { return itemStream.readFile(); }
    case T_BINARY : { return null; }
    case T_HASH   : { return null; }
  }
}

// ============================================================================================================================ //
//  processDecoding()                                                                                                           //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Parses an encoded record and saves the decoded values into the 'node' object.                                               //
// ============================================================================================================================ //
async function processDecoding(structStream, appDef, node, primitiveCallback) {
  await decodeObject(appDef.field, node);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  decodeObject()                                                                                                            //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function decodeObject(fieldDef, node) {
    let fieldList = structStream.decodeItemList(fieldDef);

    for(let id of fieldList) {
      let itemDef = fieldDef[id];

      if(itemDef.flag & ARRAY$2) {
        let size = structStream.readUint16();

        node[itemDef.name] = node[itemDef.name] || [];

        for(let i = 0; i < size; i++) {
          await decodeItem(itemDef, node, i);
        }
      }
      else {
        await decodeItem(itemDef, node);
      }
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  decodeItem()                                                                                                              //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function decodeItem(itemDef, node, index) {
    let isArray = index !== undefined,
        target = isArray ? node[itemDef.name][index] : node[itemDef.name];

    if(itemDef.flag & STRUCT) {
      let struct =
        isArray ?
          node[itemDef.name][index] = target || {}
        :
          node[itemDef.name] = target || {};

      await decodeObject(appDef.structure[itemDef.id].property, struct);
    }
    else {
      let value = await primitiveCallback(itemDef);

      if(value !== null || target === undefined) {
        if(isArray) {
          node[itemDef.name][index] = value;
        }
        else {
          node[itemDef.name] = value;
        }
      }
    }
  }
}

// ============================================================================================================================ //
//  processParsing()                                                                                                            //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Parses an encoded record, keeping track of the field paths, but without saving the decoded values.                          //
// ============================================================================================================================ //
async function processParsing(structStream, appDef, primitiveCallback) {
  await parseObject(appDef.field, []);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  parseObject()                                                                                                             //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function parseObject(fieldDef, path) {
    let fieldList = structStream.decodeItemList(fieldDef);

    for(let id of fieldList) {
      let itemDef = fieldDef[id],
          newPath = [ ...path, id ];

      if(itemDef.flag & ARRAY$2) {
        let size = structStream.readUint16();

        for(let i = 0; i < size; i++) {
          await parseItem(itemDef, newPath);
        }
      }
      else {
        await parseItem(itemDef, newPath);
      }
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  parseItem()                                                                                                               //
  // -------------------------------------------------------------------------------------------------------------------------- //
  async function parseItem(itemDef, path) {
    if(itemDef.flag & STRUCT) {
      await parseObject(appDef.structure[itemDef.id].property, path);
    }
    else {
      await primitiveCallback(itemDef, path);
    }
  }
}

// ============================================================================================================================ //
//  parse()                                                                                                                     //
// ============================================================================================================================ //
function parse(appDef, msg) {
  return msg.split(/(\{\{.+?\}\})/).map((part, ndx) =>
    ndx & 1 ?
      parseFieldReference(appDef, part.slice(2, -2).trim())
    :
      part
  );
}

// ============================================================================================================================ //
//  encode()                                                                                                                    //
// ============================================================================================================================ //
function encode$1(msgStream, appDef, obj) {
  msgStream.writeShortString(obj.name);

  let arr = parse(appDef, obj.content);

  msgStream.writeVarint32(arr.length);

  arr.forEach((part, ndx) => {
    if(ndx & 1) {
      let [ type, path ] = part;

      msgStream.writeUint8(type);
      msgStream.writeVarint32(path.length);
      path.forEach(v => msgStream.writeVarint32(v));
    }
    else {
      msgStream.writeLongString(part);
    }
  });
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
function decode$1(msgStream, appDef) {
  let name = msgStream.readShortString();

  let n = msgStream.readVarint32(),
      arr = [];

  for(let ndx = 0; ndx < n; ndx++) {
    if(ndx & 1) {
      let type = msgStream.readUint8(),
          len = msgStream.readVarint32(),
          path = [];

      while(len--) {
        path.push(msgStream.readVarint32());
      }
      arr.push([ type, path ]);
    }
    else {
      arr.push(msgStream.readLongString());
    }
  }

  return {
    name   : name,
    content: build(appDef, arr)
  };
}

// ============================================================================================================================ //
//  findFields()                                                                                                                //
// ============================================================================================================================ //
async function findFields(appDef, microBlocks, messageId, currentNonce) {
  let arr = parse(appDef, appDef.message[messageId].content),
      msgFields = [];

  for(let ndx in arr) {
    if(!(ndx & 1)) {
      continue;
    }

    let [ type, targetPath ] = arr[ndx],
        minBlock = [ 0, 0, 1 ][type],
        maxBlock = [ 0, Infinity, Infinity ][type],
        found = false;

    for(let blockId = minBlock; blockId <= maxBlock && !found; blockId++) {
      let microBlock = microBlocks.find(o => o.nonce == currentNonce - blockId),
          [ publicSection ] = await getSection(microBlock, S_FLOW_PUBLIC_DATA);

      let structData = publicSection.fieldList;

      let structStream = getReadStream(structData);

      await processParsing(
        structStream,
        appDef,
        async function(itemDef, path) {
          if(targetPath.length == path.length && targetPath.every((v, i) => v == path[i])) {
            msgFields.push({
              nonce: currentNonce - blockId,
              path : path
            });

            found = true;
          }
        }
      );
    }

    if(!found) {
      console.error("field not found", targetPath);
      return false;
    }
  }

  return msgFields;
}

// ============================================================================================================================ //
//  build()                                                                                                                     //
// ============================================================================================================================ //
function build(appDef, arr) {
  return arr.map((part, ndx) =>
    ndx & 1 ?
      "{{" + buildFieldReference(appDef, part[0], part[1]) + "}}"
    :
      part
  ).join("");
}

// ============================================================================================================================ //
//  encode()                                                                                                                    //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  uint16 - number of fields                                                                                                   //
//  uint16 - number of structures                                                                                               //
//  uint16 - number of enumerations                                                                                             //
//  uint16 - number of masks                                                                                                    //
//  uint16 - number of messages                                                                                                 //
//                                                                                                                              //
//  for each field:                                                                                                             //
//    field definition                                                                                                          //
//                                                                                                                              //
//  for each structure:                                                                                                         //
//    shortStr - name                                                                                                           //
//    uint16   - number of properties                                                                                           //
//    for each property:                                                                                                        //
//      field definition                                                                                                        //
//                                                                                                                              //
//  for each enumeration:                                                                                                       //
//    shortStr - name                                                                                                           //
//    uint16   - number of values                                                                                               //
//    for each value:                                                                                                           //
//      name                                                                                                                    //
//                                                                                                                              //
//  for each mask:                                                                                                              //
//    shortStr - name                                                                                                           //
//    shortStr - regular expression                                                                                             //
//    shortStr - substitution string                                                                                            //
//                                                                                                                              //
//  for each message:                                                                                                           //
//    shortStr - name                                                                                                           //
//    longStr  - content                                                                                                        //
//                                                                                                                              //
//  field definition:                                                                                                           //
//    shortStr - name                                                                                                           //
//    uint8    - flags                                                                                                          //
//    if STRUCT:                                                                                                                //
//      uint16 - structure ID                                                                                                   //
//    else:                                                                                                                     //
//      uint8  - primitive type ID                                                                                              //
//    if MASKABLE:                                                                                                              //
//      uint16 - mask ID                                                                                                        //
// ============================================================================================================================ //
function encode(appDef) {
  let defStream = getWriteStream();

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  header                                                                                                                    //
  // -------------------------------------------------------------------------------------------------------------------------- //
  defStream.writeUint16(appDef.field.length);
  defStream.writeUint16(appDef.structure.length);
  defStream.writeUint16(appDef.enumeration.length);
  defStream.writeUint16(appDef.mask.length);
  defStream.writeUint16(appDef.message.length);

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  fields                                                                                                                    //
  // -------------------------------------------------------------------------------------------------------------------------- //
  appDef.field.forEach(obj => {
    writeField(obj);
  });

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  structures                                                                                                                //
  // -------------------------------------------------------------------------------------------------------------------------- //
  appDef.structure.forEach(obj => {
    defStream.writeShortString(obj.name);
    defStream.writeUint16(obj.property.length);

    obj.property.forEach(obj => {
      writeField(obj);
    });
  });

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  enumerations                                                                                                              //
  // -------------------------------------------------------------------------------------------------------------------------- //
  appDef.enumeration.forEach(obj => {
    defStream.writeShortString(obj.name);
    defStream.writeUint16(obj.value.length);

    obj.value.forEach(value => {
      defStream.writeShortString(value);
    });
  });

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  masks                                                                                                                     //
  // -------------------------------------------------------------------------------------------------------------------------- //
  appDef.mask.forEach(obj => {
    defStream.writeShortString(obj.name);
    defStream.writeShortString(obj.regex);
    defStream.writeShortString(obj.substitution);
  });

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  messages                                                                                                                  //
  // -------------------------------------------------------------------------------------------------------------------------- //
  appDef.message.forEach(obj => {
    encode$1(defStream, appDef, obj);
  });

  function writeField(obj) {
    defStream.writeShortString(obj.name);
    defStream.writeUint8(obj.flag);

    if(obj.flag & STRUCT) {
      defStream.writeUint16(obj.id);
    }
    else {
      defStream.writeUint8(obj.id);
    }
    if(obj.flag & MASKABLE) {
      defStream.writeUint16(obj.maskId);
    }
  }

  return defStream.getData();
}

// ============================================================================================================================ //
//  decode()                                                                                                                    //
// ============================================================================================================================ //
function decode(data) {
  let defStream = getReadStream(data);

  let appDef = {
    field      : [],
    structure  : [],
    enumeration: [],
    mask       : [],
    message    : []
  };

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  header                                                                                                                    //
  // -------------------------------------------------------------------------------------------------------------------------- //
  let nField  = defStream.readUint16(),
      nStruct = defStream.readUint16(),
      nEnum   = defStream.readUint16(),
      nMask   = defStream.readUint16(),
      nMsg    = defStream.readUint16();

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  fields                                                                                                                    //
  // -------------------------------------------------------------------------------------------------------------------------- //
  for(let n = 0; n < nField; n++) {
    appDef.field.push(readField());
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  structures                                                                                                                //
  // -------------------------------------------------------------------------------------------------------------------------- //
  for(let n = 0; n < nStruct; n++) {
    let struct = {};

    struct.name = defStream.readShortString();
    struct.property = [];

    let nProp = defStream.readUint16();

    for(let p = 0; p < nProp; p++) {
      struct.property.push(readField());
    }
    appDef.structure.push(struct);
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  enumerations                                                                                                              //
  // -------------------------------------------------------------------------------------------------------------------------- //
  for(let n = 0; n < nEnum; n++) {
    let enumeration = {};

    enumeration.name = defStream.readShortString();
    enumeration.value = [];

    let nValue = defStream.readUint16();

    for(let i = 0; i < nValue; i++) {
      enumeration.value.push(defStream.readShortString());
    }
    appDef.enumeration.push(enumeration);
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  masks                                                                                                                     //
  // -------------------------------------------------------------------------------------------------------------------------- //
  for(let n = 0; n < nMask; n++) {
    let mask = {};

    mask.name = defStream.readShortString();
    mask.regex = defStream.readShortString();
    mask.substitution = defStream.readShortString();

    appDef.mask.push(mask);
  }

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  messages                                                                                                                  //
  // -------------------------------------------------------------------------------------------------------------------------- //
  for(let n = 0; n < nMsg; n++) {
    appDef.message.push(decode$1(defStream, appDef));
  }

  function readField() {
    let obj = {};

    obj.name = defStream.readShortString();
    obj.flag = defStream.readUint8();
    obj.id = obj.flag & STRUCT ? defStream.readUint16() : defStream.readUint8();
    obj.maskId = obj.flag & MASKABLE ? defStream.readUint16() : -1;

    return obj;
  }

  return appDef;
}

// ============================================================================================================================ //
//  create()                                                                                                                    //
// ============================================================================================================================ //
function create$2() {
  return create$3(OBJ_APPLICATION, populateProperties$2);
}

// ============================================================================================================================ //
//  load()                                                                                                                      //
// ============================================================================================================================ //
async function load$2(id) {
  return await load$3(OBJ_APPLICATION, id, populateProperties$2);
}

// ============================================================================================================================ //
//  populateProperties()                                                                                                        //
// ============================================================================================================================ //
function populateProperties$2(obj) {
  return {
    ...obj,

    setDeclaration : async (...arg) => await setDeclaration$1(obj, ...arg),
    setDescription : async (...arg) => await setDescription$1(obj, ...arg),
    setDefinition  : async (...arg) => await setDefinition(obj, ...arg),
    setSignatureKey: async (...arg) => await setSignatureKey(obj, ...arg),
    submit         : async (...arg) => await submit(obj, ...arg)
  };
}

// ============================================================================================================================ //
//  setDeclaration()                                                                                                            //
// ============================================================================================================================ //
async function setDeclaration$1(obj, dataObject) {
  await writeSection(obj, S_APP_DECLARATION, dataObject);
}

// ============================================================================================================================ //
//  setDescription()                                                                                                            //
// ============================================================================================================================ //
async function setDescription$1(obj, dataObject) {
  await writeSection(obj, S_APP_DESCRIPTION, dataObject);
}

// ============================================================================================================================ //
//  setDefinition()                                                                                                             //
// ============================================================================================================================ //
async function setDefinition(obj, dataObject) {
  await writeSection(obj, S_APP_DEFINITION, dataObject);
}

// ============================================================================================================================ //
//  getDeclaration()                                                                                                            //
// ============================================================================================================================ //
async function getDeclaration(applicationId) {
  return await getLastSection(OBJ_APPLICATION, applicationId, S_APP_DECLARATION);
}

// ============================================================================================================================ //
//  getDescription()                                                                                                            //
// ============================================================================================================================ //
async function getDescription$1(applicationId) {
  return await getLastSection(OBJ_APPLICATION, applicationId, S_APP_DESCRIPTION);
}

// ============================================================================================================================ //
//  getDefinition()                                                                                                             //
// ============================================================================================================================ //
async function getDefinition(applicationId, version) {
  console.log("getDefinition", applicationId, version);

  const rawDefinition = await getLastSection(OBJ_APPLICATION, applicationId, S_APP_DEFINITION);

  console.log("rawDefinition", rawDefinition);

  const appDef = decode(rawDefinition.definition);

  return {
    rawDefinition: rawDefinition.definition,
    definition   : appDef
  };
}

// ============================================================================================================================ //
//  isChanged()                                                                                                                 //
// ============================================================================================================================ //
async function isChanged$1(app) {
  let [ descChange, defChange ] = await getChanges$1(app);

  return descChange || defChange;
}

// ============================================================================================================================ //
//  publish()                                                                                                                   //
// ============================================================================================================================ //
async function publish$1(app, getGas$1, privateKey) {
  let [ descChange, defChange, encodedDefinition ] = await getChanges$1(app),
      currentVersion = app.meta.version,
      obj;

  console.log("application.publish", app.meta);

  if(app.meta.carmentisId) {
    obj = await load$2(fromHexa(app.meta.carmentisId));
  }
  else {
    obj = create$2();

    await obj.setDeclaration({
      organizationId: fromHexa(app.meta.organizationId)
    });
  }

  if(descChange) {
    await obj.setDescription(app.description);
  }

  if(defChange) {
    app.meta.version++;

    await obj.setDefinition({
      definition: encodedDefinition,
      version   : app.meta.version
    });
  }

  if(getGas$1) {
    let microBlock = await obj.submit(false),
        gas = getGas(microBlock.array.length);

    app.meta.version = currentVersion;

    return gas;
  }

  if(!privateKey) {
    return false;
  }

  obj.setSignatureKey(privateKey);

  let res = await obj.submit();

  app.meta.carmentisId = toHexa(res.data.microChainId);
  return true;
}

// ============================================================================================================================ //
//  getChanges()                                                                                                                //
// ============================================================================================================================ //
async function getChanges$1(app) {
  let encodedDefinition = encode(app.definition),
      descChange = true,
      defChange = true;

  if(app.meta.carmentisId) {
    let previousDesc = await getDescription$1(fromHexa(app.meta.carmentisId)),
        previousDef = await getDefinition(fromHexa(app.meta.carmentisId), app.meta.version);

    descChange =
      app.description.name        != previousDesc.name ||
      app.description.logoUrl     != previousDesc.logoUrl ||
      app.description.homepageUrl != previousDesc.homepageUrl ||
      app.description.rootDomain  != previousDesc.rootDomain;

    defChange = !isEqual(encodedDefinition, previousDef.rawDefinition);
  }

  return [ descChange, defChange, encodedDefinition ];
}

// ============================================================================================================================ //
//  create()                                                                                                                    //
// ============================================================================================================================ //
function create$1() {
  return create$3(OBJ_ORGANIZATION, populateProperties$1);
}

// ============================================================================================================================ //
//  load()                                                                                                                      //
// ============================================================================================================================ //
async function load$1(id) {
  return await load$3(OBJ_ORGANIZATION, id, populateProperties$1);
}

// ============================================================================================================================ //
//  populateProperties()                                                                                                        //
// ============================================================================================================================ //
function populateProperties$1(obj) {
  return {
    ...obj,

    setPublicKey   : async (...arg) => await setPublicKey(obj, ...arg),
    setDescription : async (...arg) => await setDescription(obj, ...arg),
    setServer      : async (...arg) => await setServer(obj, ...arg),
    setSignatureKey: async (...arg) => await setSignatureKey(obj, ...arg),
    submit         : async (...arg) => await submit(obj, ...arg)
  };
}

// ============================================================================================================================ //
//  setPublicKey()                                                                                                              //
// ============================================================================================================================ //
async function setPublicKey(obj, dataObject) {
  await writeSection(obj, S_ORG_PUBLIC_KEY, dataObject);
}

// ============================================================================================================================ //
//  setDescription()                                                                                                            //
// ============================================================================================================================ //
async function setDescription(obj, dataObject) {
  await writeSection(obj, S_ORG_DESCRIPTION, dataObject);
}

// ============================================================================================================================ //
//  setServer()                                                                                                                 //
// ============================================================================================================================ //
async function setServer(obj, dataObject) {
  await writeSection(obj, S_ORG_SERVER, dataObject);
}

// ============================================================================================================================ //
//  getPublicKey()                                                                                                              //
// ============================================================================================================================ //
async function getPublicKey$2(organizationId) {
  return await getLastSection(OBJ_ORGANIZATION, organizationId, S_ORG_PUBLIC_KEY);
}

// ============================================================================================================================ //
//  getDescription()                                                                                                            //
// ============================================================================================================================ //
async function getDescription(organizationId) {
  return await getLastSection(OBJ_ORGANIZATION, organizationId, S_ORG_DESCRIPTION);
}

// ============================================================================================================================ //
//  getServer()                                                                                                                 //
// ============================================================================================================================ //
async function getServer(organizationId) {
  return await getLastSection(OBJ_ORGANIZATION, organizationId, S_ORG_SERVER);
}

// ============================================================================================================================ //
//  isChanged()                                                                                                                 //
// ============================================================================================================================ //
async function isChanged(org) {
  let [ keyChange, descChange, serverChange ] = await getChanges(org);

  return keyChange || descChange || serverChange;
}

// ============================================================================================================================ //
//  publish()                                                                                                                   //
// ============================================================================================================================ //
async function publish(org, getGas$1, privateKey) {
  console.log("publish", org);

  let [ keyChange, descChange, serverChange ] = await getChanges(org),
      obj;

  console.log("changes", keyChange, descChange, serverChange);

  if(org.meta.carmentisId) {
    console.log("load");
    obj = await load$1(fromHexa(org.meta.carmentisId));
  }
  else {
    console.log("create");
    obj = create$1();
  }

  if(keyChange) {
    let publicKey = fromHexa(org.publicKey.publicKey || "0".repeat(66));

    console.log("publicKey", publicKey);

    await obj.setPublicKey({ publicKey: publicKey });
  }

  if(descChange) {
    await obj.setDescription(org.description);
  }

  if(serverChange) {
    await obj.setServer(org.server);
  }

  if(getGas$1) {
    let microBlock = await obj.submit(false),
        gas = getGas(microBlock.array.length);

    return gas;
  }

  if(!privateKey) {
    return false;
  }

  obj.setSignatureKey(privateKey);

  let res = await obj.submit();

  org.meta.carmentisId = toHexa(res.data.microChainId);
  return true;
}

// ============================================================================================================================ //
//  getChanges()                                                                                                                //
// ============================================================================================================================ //
async function getChanges(org) {
  let keyChange = true,
      descChange = true,
      serverChange = true;

  if(org.meta.carmentisId) {
    let previousKey = await getPublicKey$2(fromHexa(org.meta.carmentisId)),
        previousDesc = await getDescription(fromHexa(org.meta.carmentisId)),
        previousServer = await getServer(fromHexa(org.meta.carmentisId));

    keyChange = org.publicKey.publicKey != toHexa(previousKey.publicKey);

    descChange =
      org.description.name        != previousDesc.name ||
      org.description.city        != previousDesc.city ||
      org.description.countryCode != previousDesc.countryCode ||
      org.description.website     != previousDesc.website;

    serverChange = org.server.endpoint != previousServer.endpoint;
  }

  return [ keyChange, descChange, serverChange ];
}

// ============================================================================================================================ //
//  request()                                                                                                                   //
// ============================================================================================================================ //
async function request(arg) {
  let typeId = REQ_NAME.indexOf(arg.type);

  if(!arg.allowReconnection) {
    deleteConnectionState();
  }

  get("#" + arg.qrElementId).style({ width: "164px" });
  qrStatusWaiting(arg.qrElementId);

  if(typeId == -1) {
    throw `Unrecognized request type '${arg.type}'.`
  }

  if(!arg.applicationId) {
    throw "'applicationId' must be specified in the request";
  }

  let applicationDeclaration = await getDeclaration(fromHexa(arg.applicationId));

  let organizationServer = await getServer(applicationDeclaration.organizationId);

  let operatorEndpoint = organizationServer.endpoint;

  return await new Promise(function(resolve, reject) {
    let socket = getSocket(operatorEndpoint, connect, async (...arg) => dataCallback$1(socket, ...arg));

    socket.resolve = resolve;
    socket.reject = reject;

    socket.requestObject = {
      qrElementId  : arg.qrElementId,
      type         : typeId,
      applicationId: fromHexa(arg.applicationId),
      data         : arg.data || {}
    };

    let cookies = getCookies();

    socket.requestObject.deviceId =
      cookies["cmts-device-id"] ||
      toHexa(getRandomBytes(16));

    setCookie(
      "cmts-device-id",
      socket.requestObject.deviceId,
      DEVICE_COOKIE_TTL
    );
  });
}

// ============================================================================================================================ //
//  dataCallback()                                                                                                              //
// ============================================================================================================================ //
async function dataCallback$1(socket, msg, callback) {
  let answer;

  switch(msg.id) {
    case MSG_UPDATE_QR_ID: {
      updateQrId(socket, msg.data);
      break;
    }
    case MSG_EXPIRED: {
      expired(socket, msg.data);
      break;
    }
    case MSG_WALLET_CONNECTED: {
      answer = await walletConnected(socket, msg.data);
      break;
    }
    case MSG_FORWARDED_ANSWER: {
      answer = await forwardedAnswer(socket, msg.data);
      break;
    }
    default: {
      console.error("unexpected message id", msg.id);
      break;
    }
  }

  if(msg.id & MSG_ACK) {
    console.log("client ACK answer", answer);
    callback(answer);
  }
}

// ============================================================================================================================ //
//  updateQrId()                                                                                                                //
// ============================================================================================================================ //
function updateQrId(socket, data) {
  setQRCode(
    socket.requestObject.qrElementId,
    socket.requestObject.applicationId,
    fromHexa(data.qrId),
    socket.publicKey
  );
}

// ============================================================================================================================ //
//  expired()                                                                                                                   //
// ============================================================================================================================ //
function expired(socket, data) {
  qrStatusExpired(socket.requestObject.qrElementId);
}

// ============================================================================================================================ //
//  walletConnected()                                                                                                           //
// ============================================================================================================================ //
async function walletConnected(socket, data) {
  qrStatusConnected(socket.requestObject.qrElementId);

  let clientPublicKey = fromHexa(data.publicKey),
      sharedKey = await getSharedKey(socket.privateKey, clientPublicKey);

  console.log("walletConnected/shared key", sharedKey);

  saveConnectionState$1({
    requestId: data.requestId,
    sharedKey: toHexa(sharedKey)
  });

  socket.sharedKey = sharedKey;

  await sendRequest(socket);
}

// ============================================================================================================================ //
//  sendRequest()                                                                                                               //
// ============================================================================================================================ //
async function sendRequest(socket) {
  let iv = getRandomBytes(16),
      requestStr = encode$4(JSON.stringify(socket.requestObject.data)),
      encrypted = await encryptGcm(socket.sharedKey, requestStr, iv);

  console.log("sendRequest/requestStr", requestStr);

  await socket.sendMessage(
    MSG_REQUEST_DATA,
    {
      type: socket.requestObject.type,
      iv  : toHexa(iv),       // iv.buffer
      data: toHexa(encrypted) // encrypted.buffer
    }
  );
}

// ============================================================================================================================ //
//  forwardedAnswer()                                                                                                           //
// ============================================================================================================================ //
async function forwardedAnswer(socket, data) {
  socket.resolve(data);
}

// ============================================================================================================================ //
//  connect()                                                                                                                   //
// ============================================================================================================================ //
async function connect(socket) {
  let connectionState = loadConnectionState$1();

  if(await sdkReconnection(socket, connectionState)) {
    await sendRequest(socket);
  }
  else {
    await sdkConnection(socket);
  }
}

// ============================================================================================================================ //
//  sdkConnection()                                                                                                             //
// ============================================================================================================================ //
async function sdkConnection(socket) {
  let answer = await socket.sendMessage(
    MSG_SDK_CONNECTION,
    {
      deviceId: socket.requestObject.deviceId
    }
  );

  if(answer.success) {
    socket.privateKey = getRandomBytes(32);
    socket.publicKey = publicKeyFromPrivateKey(socket.privateKey);

    setQRCode(
      socket.requestObject.qrElementId,
      socket.requestObject.applicationId,
      fromHexa(answer.data.qrId),
      socket.publicKey
    );
  }
}

// ============================================================================================================================ //
//  sdkReconnection()                                                                                                           //
// ============================================================================================================================ //
async function sdkReconnection(socket, connectionState) {
  if(!connectionState) {
    return false;
  }

  let answer = await socket.sendMessage(
    MSG_SDK_RECONNECTION,
    {
      deviceId : socket.requestObject.deviceId,
      requestId: connectionState.requestId
    }
  );

  if(answer.success) {
    qrStatusConnected(socket.requestObject.qrElementId);
    socket.sharedKey = fromHexa(connectionState.sharedKey);
    return true;
  }

  return false;
}

// ============================================================================================================================ //
//  loadConnectionState()                                                                                                       //
// ============================================================================================================================ //
function loadConnectionState$1() {
  let data = sessionStorage.getItem(CLIENT_STORAGE_KEY);

  if(!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  }
  catch(e) {
    return null;
  }
}

// ============================================================================================================================ //
//  saveConnectionState()                                                                                                       //
// ============================================================================================================================ //
function saveConnectionState$1(connectionState) {
  console.log("saveConnectionState", connectionState);
  sessionStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(connectionState));
}

// ============================================================================================================================ //
//  deleteConnectionState()                                                                                                     //
// ============================================================================================================================ //
function deleteConnectionState() {
  console.log("deleteConnectionState");
  sessionStorage.removeItem(CLIENT_STORAGE_KEY);
}

// ============================================================================================================================ //
//  qrSetContent()                                                                                                              //
// ============================================================================================================================ //
function qrSetContent(elementId, arr, callback) {
  get("#" + elementId).setContent(
    create$7("div").style({
      display        : "table-cell",
      width          : "164px",
      height         : "164px",
      textAlign      : "center",
      verticalAlign  : "middle",
      color          : "#777",
      backgroundColor: "#eee",
      cursor         : callback ? "pointer" : "default"
    })
    .setContent(...arr)
    .click(callback || (_ => _))
  );
}

// ============================================================================================================================ //
//  qrStatusWaiting()                                                                                                           //
// ============================================================================================================================ //
function qrStatusWaiting(elementId) {
  qrSetContent(
    elementId,
    [
      create$7("p").text("Please wait")
    ]
  );
}

// ============================================================================================================================ //
//  qrStatusConnected()                                                                                                         //
// ============================================================================================================================ //
function qrStatusConnected(elementId) {
  qrSetContent(
    elementId,
    [
      // TODO: use a self-contained icon
      create$7("p").style({ fontSize: "48px", margin: 0 }).html(`<i class="bi bi-check-circle-fill"></i>`),
      create$7("p").text("Connected"),
      create$7("p").style({ fontSize: "13px" }).text("Please follow the instructions on your wallet.")
    ]
  );
}

// ============================================================================================================================ //
//  qrStatusExpired()                                                                                                           //
// ============================================================================================================================ //
function qrStatusExpired(elementId) {
  qrSetContent(
    elementId,
    [
      // TODO: use a self-contained icon
      create$7("p").style({ fontSize: "48px", margin: 0 }).html(`<i class="bi bi-arrow-clockwise"></i>`),
      create$7("p").text("Expired"),
      create$7("p").text("(Click to refresh)")
    ],
    refresh
  );

  function refresh() {
    alert("refresh");
  }
}

// ============================================================================================================================ //
//  setQRCode()                                                                                                                 //
// ============================================================================================================================ //
function setQRCode(elementId, applicationId, qrId, publicKey) {
  let [ qrImgTag, qrData ] = create$6(applicationId, qrId, publicKey);

  get("#" + elementId).setAttribute("data-code", qrData).find("div").html(qrImgTag);
}

// ============================================================================================================================ //
//  encodeConnection()                                                                                                          //
// ============================================================================================================================ //

// ============================================================================================================================ //
//  decodeConnection()                                                                                                          //
// ============================================================================================================================ //
function decodeConnection(obj) {
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

const INFO_KEY    = 0;

const PBKDF2_ITERATIONS = 50000;

// ============================================================================================================================ //
//  derivePepperFromSeed()                                                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives the wallet pepper from the seed and an optional nonce.                                                              //
// ============================================================================================================================ //
async function derivePepperFromSeed$1(seed, nonce = 1) {
  let salt = nonceToIv(nonce),
      pepper = await deriveBitsPbkdf2(seed, salt, 512, PBKDF2_ITERATIONS);
  console.log(nonce, salt)

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
//  Derives a user private signature key from the pepper and the application ID.                                                //
// ============================================================================================================================ //
async function deriveUserPrivateKey$1(pepper, appId) {
  return await derivePrivateKey(OBJ_USER, pepper, appId);
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
//  getPublicKey()                                                                                                              //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Computes a public from a private key.                                                                                       //
// ============================================================================================================================ //
async function getPublicKey$1(privateKey) {
  return await publicKeyFromPrivateKey(privateKey);
}

// ============================================================================================================================ //
//  derivePrivateKey()                                                                                                          //
// ============================================================================================================================ //
async function derivePrivateKey(type, pepper, data = []) {
  let salt = new Uint8Array(0),
      info = from(INFO_KEY, type, data),
      privKey = deriveBitsHkdf(pepper, salt, info, 256);

  return privKey;
}

// ============================================================================================================================ //
//  deriveAesKeyFromPassword()                                                                                                  //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Derives an AES key from a password and returns an object with encrypt() / decrypt() / getBits() methods working with this   //
//  key.                                                                                                                        //
// ============================================================================================================================ //
async function deriveAesKeyFromPassword$1(pwd) {
  let seed = encode$4(pwd),
      salt = new Uint8Array(0),
      bits = await deriveBitsPbkdf2(seed, salt, 256, PBKDF2_ITERATIONS);

  return await deriveAesKeyFromBits$1(bits);
}

// ============================================================================================================================ //
//  deriveAesKeyFromBits()                                                                                                      //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Takes an AES key and returns an object with encrypt() / decrypt() / getBits() methods working with this key.                //
// ============================================================================================================================ //
async function deriveAesKeyFromBits$1(bits) {
  let key = bits;

  return {
    encrypt: async (data, iv = nonceToIv(0)) => await encryptGcm(key, data, iv),
    decrypt: async (data, iv = nonceToIv(0)) => await decryptGcm(key, data, iv),
    getBits: () => bits
  }
}

let clientRequestCallback,
    serverRequestCallback;

// ============================================================================================================================ //
//  setRequestCallback()                                                                                                        //
// ============================================================================================================================ //
function setRequestCallback(clientCallback, serverCallback) {
  clientRequestCallback = clientCallback;
  serverRequestCallback = serverCallback;
}

// ============================================================================================================================ //
//  attemptToReconnect()                                                                                                        //
// ============================================================================================================================ //
function attemptToReconnect() {
  let connectionState = loadConnectionState();

  if(!connectionState) {
    return;
  }

  let socket = getSocket(connectionState.operatorEndpoint, connect, async (...arg) => dataCallback(socket, ...arg));

  async function connect(socket) {
    let answer;

    socket.sharedKey = fromHexa(connectionState.sharedKey);

    answer = await socket.sendMessage(
      MSG_WALLET_RECONNECTION,
      {
        requestId: connectionState.requestId
      }
    );

    if(!answer.success) {
      console.log("reconnection failed");
      socket.disconnect();
    }
  }
}

// ============================================================================================================================ //
//  getRequestById()                                                                                                            //
// ============================================================================================================================ //
async function getRequestById(requestId) {
  let answer = await dataServerQuery$1(
    "wallet-authentication/get-request-by-id",
    {
      id: requestId
    }
  );

  return await checkAnswer(answer);
}

// ============================================================================================================================ //
//  getRequestByQRCode()                                                                                                        //
// ============================================================================================================================ //
async function getRequestByQRCode(qrData) {
  console.log("getRequestByQRCode/qrData", qrData);

  return await new Promise(async function(resolve, reject) {
    let decodedData = decode$5(qrData);

    console.log("getRequestByQRCode/decodedData", decodedData);

    if(!decodedData) {
      resolve(null);
      return;
    }

    let [ applicationId, qrId, clientPublicKey ] = decodedData;

    let applicationDeclaration = await getDeclaration(applicationId),
        applicationDescription = await getDescription$1(applicationId);

    let organizationServer = await getServer(applicationDeclaration.organizationId);

    let operatorEndpoint = organizationServer.endpoint;

    let socket = getSocket(operatorEndpoint, connect, async (...arg) => dataCallback(socket, ...arg));

    async function connect(socket) {
      let answer;

      answer = await socket.sendMessage(
        MSG_GET_CONNECTION_INFO,
        {
          qrId: toHexa(qrId)
        }
      );

      if(!answer.success) {
        resolve(null);
        return;
      }

      console.log("getRequestByQRCode/answer.data.request", answer.data.request);

      let serializedData = fromHexa(answer.data.request),
          request = await unserialize(WI_REQUEST, serializedData);

      request = {
        ...request,
        id              : toHexa(sha256(serializedData)),
        organizationId  : toHexa(applicationDeclaration.organizationId),
        socket          : socket,
        operatorEndpoint: operatorEndpoint,
        expectedDomain  : applicationDescription.rootDomain,
        clientPublicKey : clientPublicKey
      };

      request.accept = async (...arg) => acceptConnection(request, ...arg);
      request.reject = async (...arg) => rejectConnection(request, ...arg);

      resolve(request);
    }
  });
}

// ============================================================================================================================ //
//  dataCallback()                                                                                                              //
// ============================================================================================================================ //
async function dataCallback(socket, msg) {
  switch(msg.id) {
    case MSG_FORWARDED_REQUEST_DATA: {
      await processClientData(socket, msg);
      break;
    }
    case MSG_SERVER_TO_WALLET: {
      await processServerData(socket, msg);
      break;
    }
  }
}

// ============================================================================================================================ //
//  processClientData()                                                                                                         //
// ============================================================================================================================ //
async function processClientData(socket, msg) {
  let data = msg.data;

  console.log("processClientData", data);

  let decrypted = await decryptGcm(
    socket.sharedKey,
    fromHexa(data.data), // new Uint8Array(data.data),
    fromHexa(data.iv)    // new Uint8Array(data.iv)
  );

  if(!decrypted) {
    console.log("decryption failed");
    return;
  }

  let requestData = JSON.parse(decode$7(decrypted));

  clientRequestCallback({
    answer: answerCallback,
    type  : REQ_NAME[data.type],
    data  : requestData
  });

  function answerCallback(answer) {
    socket.sendMessage(
      REQ_RECIPIENT_IS_SERVER[data.type] ? MSG_ANSWER_SERVER : MSG_ANSWER_CLIENT,
      answer
    );
  }
}

// ============================================================================================================================ //
//  processServerData()                                                                                                         //
// ============================================================================================================================ //
async function processServerData(socket, msg) {
  serverRequestCallback({
    answer      : answerCallback,
    clientAnswer: clientAnswerCallback,
    type        : msg.data.type,
    data        : msg.data.data
  });

  function answerCallback(answer) {
    socket.sendMessage(
      MSG_ANSWER_SERVER,
      answer
    );
  }

  function clientAnswerCallback(answer) {
    socket.sendMessage(
      MSG_ANSWER_CLIENT,
      answer
    );
  }
}

// ============================================================================================================================ //
//  acceptConnection()                                                                                                          //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  1) creates a pair of keys                                                                                                   //
//  2) uses the client's public key to derive the shared key with Diffie-Hellman and saves it                                   //
//  3) sends over the public key along with the request ID                                                                      //
// ============================================================================================================================ //
async function acceptConnection(request) {
  let privateKey = getRandomBytes(32),
      publicKey  = publicKeyFromPrivateKey(privateKey),
      sharedKey = await getSharedKey(privateKey, request.clientPublicKey);

  saveConnectionState({
    operatorEndpoint: request.operatorEndpoint,
    requestId       : request.id,
    sharedKey       : toHexa(sharedKey)
  });

  request.socket.sharedKey = sharedKey;

  await request.socket.sendMessage(
    MSG_ACCEPT_CONNECTION,
    {
      id       : request.id,
      publicKey: toHexa(publicKey)
    }
  );
}

// ============================================================================================================================ //
//  rejectConnection()                                                                                                          //
// ============================================================================================================================ //
async function rejectConnection(request) {
  await request.socket.sendMessage(
    MSG_REJECT_CONNECTION,
    {
      id: request.id
    }
  );
}

// ============================================================================================================================ //
//  checkAnswer()                                                                                                               //
// ============================================================================================================================ //
async function checkAnswer(answer) {
  if(!answer.data) {
    return false;
  }

  let serialized = fromHexa(answer.data),
      request = await unserialize(WI_REQUEST, serialized.data);

  request.connection = decodeConnection(request.connection);
  request.organizationId = toHexa(request.organizationId);
  request.deviceId = toHexa(request.deviceId);

  return request;
}

// ============================================================================================================================ //
//  sendAnswer()                                                                                                                //
// ============================================================================================================================ //
async function sendAnswer(requestId, status, privateKey) {
  let publicKey = await getPublicKey$1(privateKey);

  let obj = {
    requestId: requestId,
    publicKey: publicKey
  };

  let serialized = await serialize(WI_ANSWER, obj),
      signature = await sign$1(privateKey, serialized);

  await dataServerQuery$1(
    "wallet-authentication/wallet-answer",
    {
      ...obj,
      signature: signature
    }
  );
}

// ============================================================================================================================ //
//  loadConnectionState()                                                                                                       //
// ============================================================================================================================ //
function loadConnectionState() {
  let data = sessionStorage.getItem(WALLET_STORAGE_KEY);

  if(!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  }
  catch(e) {
    return null;
  }
}

// ============================================================================================================================ //
//  saveConnectionState()                                                                                                       //
// ============================================================================================================================ //
function saveConnectionState(connectionState) {
  console.log("saveConnectionState", connectionState);
  sessionStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(connectionState));
}

class CarmentisError extends Error {
    constructor(errorCode, message) {
        super(`[CarmentisError ${errorCode}] ${message}`);

    }
}

class InvalidArgumentError extends CarmentisError {
    constructor( argumentName, argumentValue ) {
        super(INVALID_ARGUMENT_ERROR, `Invalid argument for '${argumentName}': got ${argumentValue}`);
    }
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
function generateWordList$1(nWords = MIN_WORDS) {
  if(nWords < MIN_WORDS || nWords > MAX_WORDS) {
    throw `A word list must contain between ${MIN_WORDS} and ${MAX_WORDS} words.`;
  }

  let [ nBytes, seedSize ] = getFormatFromWordCount(nWords);

  let seed = getRandomBytes(seedSize),
      hash = sha256(seed),
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
      hash = (sha256(seed)).slice(0, nBytes - seedSize);

  hash[hash.length - 1] &= hashMask;

  if(!isEqual(data.slice(seedSize), hash)) {
    throw `This list of words has an invalid checksum.`;
  }

  return seed;
}

// ============================================================================================================================ //
//  getWordListFromSeed()                                                                                                       //
// ============================================================================================================================ //
function getWordListFromSeed$1(seed) {
  let seedSize = seed.length,
      [ nBytes, nWords ] = getFormatFromSeedSize(seedSize);

  let hash = (sha256(seed)).slice(0, nBytes - seedSize),
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
//  create()                                                                                                                    //
// ============================================================================================================================ //
function create(keys) {
  return create$3(OBJ_FLOW, populateProperties, keys, processSection);
}

// ============================================================================================================================ //
//  load()                                                                                                                      //
// ============================================================================================================================ //
async function load(id, keys) {
  return await load$3(OBJ_FLOW, id, populateProperties, keys, processSection);
}

// ============================================================================================================================ //
//  populateProperties()                                                                                                        //
// ============================================================================================================================ //
function populateProperties(obj) {
  obj.version      = [];
  obj.actor        = [];
  obj.channel      = [];
  obj.subscription = [];

  return {
    ...obj,

    setDeclaration : async (...arg) => await setDeclaration(obj, ...arg),
    setUpdate      : async (...arg) => await setUpdate(obj, ...arg),
    setHeader      : async (...arg) => await setHeader(obj, ...arg),
    setActor       : async (...arg) => await setActor(obj, ...arg),
    setChannel     : async (...arg) => await setChannel(obj, ...arg),
    setSubscription: async (...arg) => await setSubscription(obj, ...arg),
    setPublicData  : async (...arg) => await setPublicData(obj, ...arg),
    setChannelData : async (...arg) => await setChannelData(obj, ...arg),
    setApproval    : async (...arg) => await setApproval(obj, ...arg),
    processSection : async (...arg) => await processSection(obj, ...arg),

    disableWriting :       (...arg) =>       disableWriting(obj, ...arg),
    submit         : async (...arg) => await submit(obj, ...arg),
    loadBlock      : async (...arg) => await loadBlock(obj, processSection, ...arg),

    actorByName    : (...arg) => actorByName(obj, ...arg),
    channelByName  : (...arg) => channelByName(obj, ...arg),
    appVersion     : (...arg) => appVersion(obj, ...arg)
  };
}

// ============================================================================================================================ //
//  setDeclaration()                                                                                                            //
// ============================================================================================================================ //
async function setDeclaration(obj, dataObject) {
  await writeSection(obj, S_FLOW_DECLARATION, dataObject);
}

// ============================================================================================================================ //
//  setUpdate()                                                                                                                 //
// ============================================================================================================================ //
async function setUpdate(obj, dataObject) {
  await writeSection(obj, S_FLOW_UPDATE, dataObject);
}

// ============================================================================================================================ //
//  setHeader()                                                                                                                 //
// ============================================================================================================================ //
async function setHeader(obj, dataObject) {
  await writeSection(obj, S_FLOW_HEADER, dataObject);
}

// ============================================================================================================================ //
//  setActor()                                                                                                                  //
// ============================================================================================================================ //
async function setActor(obj, dataObject, key) {
  await writeSection(obj, S_FLOW_ACTOR, dataObject);
}

// ============================================================================================================================ //
//  setChannel()                                                                                                                //
// ============================================================================================================================ //
async function setChannel(obj, dataObject) {
  await writeSection(obj, S_FLOW_CHANNEL, dataObject);
}

// ============================================================================================================================ //
//  setSubscription()                                                                                                           //
// ============================================================================================================================ //
async function setSubscription(obj, dataObject, key) {
  await writeSection(obj, S_FLOW_SUBSCRIPTION, dataObject);
}

// ============================================================================================================================ //
//  setPublicData()                                                                                                             //
// ============================================================================================================================ //
async function setPublicData(obj, dataObject) {
  await writeSection(obj, S_FLOW_PUBLIC_DATA, dataObject);
}

// ============================================================================================================================ //
//  setChannelData()                                                                                                            //
// ============================================================================================================================ //
async function setChannelData(obj, dataObject, key) {
  await writeSection(obj, S_FLOW_CHANNEL_DATA, dataObject);
}

// ============================================================================================================================ //
//  setApproval()                                                                                                               //
// ============================================================================================================================ //
async function setApproval(obj, dataObject) {
  await writeSection(obj, S_FLOW_APPROVAL, dataObject);
}

// ============================================================================================================================ //
//  processSection()                                                                                                            //
// ============================================================================================================================ //
async function processSection(obj, nonce, type, dataObject) {
  switch(type) {
    case S_FLOW_DECLARATION:
    case S_FLOW_UPDATE: {
      obj.version.push([ nonce, dataObject.version ]);
      break;
    }
    case S_FLOW_ACTOR: {
      obj.actor.push(dataObject);
      break;
    }
    case S_FLOW_CHANNEL: {
      obj.channel.push(dataObject);
      break;
    }
    case S_FLOW_SUBSCRIPTION: {
      obj.subscription.push(dataObject);
      break;
    }
  }
}

// ============================================================================================================================ //
//  actorByName()                                                                                                               //
// ============================================================================================================================ //
function actorByName(obj, name) {
  return obj.actor.find(o => o.name == name);
}

// ============================================================================================================================ //
//  channelByName()                                                                                                             //
// ============================================================================================================================ //
function channelByName(obj, name) {
  return obj.channel.find(o => o.name == name);
}

// ============================================================================================================================ //
//  appVersion()                                                                                                                //
// ============================================================================================================================ //
function appVersion(obj, nonce) {
  console.log("appVersion", obj, nonce);
  return obj.version.filter(([ n ]) => n <= nonce).pop()[1];
}

// ============================================================================================================================ //
//  prepareApproval()                                                                                                           //
// ============================================================================================================================ //
async function prepareApproval$1(applicationId, flowId, blockData) {
  console.log("prepareApproval", applicationId, flowId, blockData);
  let obj = {
  };

  flowId = flowId && fromHexa(flowId);

  await setApplication(obj, applicationId);
  console.log("setApplication OK");

  await setFlow(obj, flowId);
  console.log("setFlow OK");

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  load the new micro-block into this flow                                                                                   //
  // -------------------------------------------------------------------------------------------------------------------------- //
  await obj.flowObject.loadBlock(blockData);
  console.log("loadBlock OK");

  return obj;
}

// ============================================================================================================================ //
//  loadFromMicrochain()                                                                                                        //
// ============================================================================================================================ //
async function loadFromMicrochain$1(microChainId, actorId, actorKey) {
  return await loadFromChain(fromHexa(microChainId));
}

// ============================================================================================================================ //
//  loadFromMicroblock()                                                                                                        //
// ============================================================================================================================ //
async function loadFromMicroblock$1(microBlockId) {
  let microBlock = await getMicroBlock$1(fromHexa(microBlockId));

  let flow = await loadFromChain(microBlock.microChainId);

  flow.selectedNonce = microBlock.nonce;

  return flow;
}

// ============================================================================================================================ //
//  getFlatRecord()                                                                                                             //
// ============================================================================================================================ //
function getFlatRecord$1(appDef, fieldDef, record) {
  let arr = [];

  function parse(fieldDef, node, path = []) {
    Object.keys(node).forEach(key => {
      let value = node[key],
          newPath = [...path, key],
          def = fieldDef.find(o => o.name == key);

      if(def.flag & ARRAY$2) {
        arr.push({ name: newPath.join("."), def: def, value: value});
      }
      else if(def.flag & STRUCT) {
        parse(appDef.structure[def.id].property, value, newPath);
      }
      else {
        arr.push({ name: newPath.join("."), def: def, value: value });
      }
    });
  }

  parse(fieldDef, record);

  return arr;
}

// ============================================================================================================================ //
//  processRecord()                                                                                                             //
// ============================================================================================================================ //
async function processRecord$1(obj, nonce) {
  let version = obj.flowObject.appVersion(nonce),
      appDef  = (await getDefinition(fromHexa(obj.applicationId), version)).definition,
      data    = getMicroBlockRecord(obj, nonce),
      record  = await decode$2(appDef, data.record),
      valid   = true;

  // -------------------------------------------------------------------------------------------------------------------------- //
  //  process the message                                                                                                       //
  // -------------------------------------------------------------------------------------------------------------------------- //
  let msg = appDef.message[data.meta.messageId].content;

  let msgFields = await findFields(appDef, obj.flowObject.chain.microBlock, data.meta.messageId, nonce),
      msgList = msg.split(/\{\{(.*?)\}\}/),
      msgParts = [];

  for(let ndx in msgList) {
    let str = msgList[ndx];

    if(str) {
      if(ndx & 1) {
        // this is a field name
        let recordName = str.replace(/.+?\./, ""),
            msgObj     = msgFields[ndx >> 1],
            data       = getMicroBlockRecord(obj, msgObj.nonce),
            record     = await decode$2(appDef, data.record),
            flatRecord = getFlatRecord$1(appDef, appDef.field, record),
            item       = flatRecord.find(o => o.name == recordName);

        msgParts.push({
          isField: true,
          field  : str,
          def    : item.def,
          value  : item.value
        });
      }
      else {
        // this is a textual part
        msgParts.push({
          isField: false,
          value  : str
        });
      }
    }
  }

  return {
    valid   : valid,
    msg     : msg,
    appDef  : appDef,
    data    : data.meta,
    record  : record,
    msgParts: msgParts
  };
}

// ============================================================================================================================ //
//  loadFromChain()                                                                                                             //
// ============================================================================================================================ //
async function loadFromChain(flowId, actorId, actorKey) {
  let microChain      = await getMicroChain$1(flowId);
  let genesisBlock    = microChain.microBlock.find(o => o.nonce == 1);
  let [ declaration ] = await getSection(genesisBlock, S_FLOW_DECLARATION);

  let obj = {
    applicationId: toHexa(declaration.applicationId)
  };

  await setApplication(obj, obj.applicationId);
  await setFlow(obj, flowId);

  return obj;
}

// ============================================================================================================================ //
//  setApplication()                                                                                                            //
// ============================================================================================================================ //
async function setApplication(obj, applicationId) {
  let appDescription = await getDescription$1(fromHexa(applicationId));

  obj.applicationId = applicationId;
  obj.appDescription = appDescription;
}

// ============================================================================================================================ //
//  setFlow()                                                                                                                   //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Import the actor key (if any) and load or create the flow.                                                                  //
// ============================================================================================================================ //
async function setFlow(obj, flowId, actorId, actorKey) {
  let keys = {};
/*
  if(actorKey) {
    let key = await crypto.aes.importGcmKey(actorKey);

    keys[CST.DATA.KEY_USER_OPERATOR_SHARED << 8 | actorId] = key;
  }
*/
  obj.flowObject = flowId ? await load(flowId, keys) : await create(keys);
}

// ============================================================================================================================ //
//  getMicroBlockRecord()                                                                                                       //
// ============================================================================================================================ //
function getMicroBlockRecord(obj, nonce) {
  let microBlock = obj.flowObject.chain.microBlock.find(o => o.nonce == nonce),
      headerSection = microBlock.sections.find(o => o.type == S_FLOW_HEADER).object,
      publicSection = microBlock.sections.find(o => o.type == S_FLOW_PUBLIC_DATA).object,
      channelSection = microBlock.sections.filter(o => o.type == S_FLOW_CHANNEL_DATA).map(o => o.object);

  let recordData = {
    meta: {
      microBlock: microBlock,
      messageId : headerSection.messageId,
      approver  : obj.flowObject.actor[headerSection.approver]
    },
    record: {
      structData : publicSection.fieldList,
      publicData : publicSection.fieldData,
      channelData: channelSection.map(o => o.fieldData)
    }
  };

  return recordData;
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
  OBJECT_NAME     : OBJECT_NAME,

  // CST.DATA
  SECTION_NAME: SECTION_NAME,

  // CST.CONFIG
  TOKEN_NAME        : TOKEN_NAME,
  MASTERBLOCK_PERIOD: MASTERBLOCK_PERIOD,

  // microblock
  MICROBLOCK_SECTION_HEADER_SIZE: SECTION_HEADER_SIZE,

  // masterblock
  MASTERBLOCK_CONTENT_HEADER_SIZE: 0
};

// ============================================================================================================================ //
//  core methods                                                                                                                //
// ============================================================================================================================ //
const core = {
  constants: CST,
  storage: {
    fileSystem: fileSystem
  },
  util: {
    helpers    : util,
    textEncoder: textEncoder,
    uint8      : uint8
  },
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
const deriveAesKeyFromBits           = userFunction(deriveAesKeyFromBits$1);
const deriveAccountPrivateKey        = userFunction(deriveAccountPrivateKey$1);
const deriveNodePrivateKey           = userFunction(deriveNodePrivateKey$1);
const deriveOrganizationPrivateKey   = userFunction(deriveOrganizationPrivateKey$1);
const deriveUserPrivateKey           = userFunction(deriveUserPrivateKey$1);
const deriveActorPrivateKey          = userFunction(deriveActorPrivateKey$1);
const deriveAuthenticationPrivateKey = userFunction(deriveAuthenticationPrivateKey$1);
const getPublicKey                   = userFunction(getPublicKey$1);
const sign                           = userFunction(sign$1);

// ============================================================================================================================ //
//  flow methods                                                                                                                //
// ============================================================================================================================ //
const loadFromMicroblock = userFunction(loadFromMicroblock$1);
const loadFromMicrochain = userFunction(loadFromMicrochain$1);
const prepareApproval    = userFunction(prepareApproval$1);
const processRecord      = userFunction(processRecord$1);
const getFlatRecord      = userFunction(getFlatRecord$1);

// ============================================================================================================================ //
//  application methods                                                                                                         //
// ============================================================================================================================ //
const applicationChanged = userFunction(isChanged$1);
const publishApplication = userFunction(publish$1);

// ============================================================================================================================ //
//  organization methods                                                                                                        //
// ============================================================================================================================ //
const organizationChanged = userFunction(isChanged);
const publishOrganization = userFunction(publish);

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

initialize$5(browserNetwork);

initialize$4(idbFileSystem);
initialize$1(idbKeyValue);

function registerNodeEndpoint(url) {
    registerNodeEndpoint$1(url);
}

function registerDataEndpoint(url) {
    registerDataEndpoint$1(url);
}

function registerOperatorEndpoint(url) {
    registerOperatorEndpoint$1(url);
}

async function dataServerQuery(...arg) {
    return await dataServerQuery$1(...arg);
}

async function operatorServerQuery(...arg) {
    return await operatorServerQuery$1(...arg);
}


const POPUP_ID = "carmentis-popup-approval";
async function openApprovalPopup(args) {
    console.log("Opening of the approval popup");


    const id = args.id;
    const operatorURL = args.operatorURL;
    const onSuccessCallback = args.onSuccessCallback;

    if (!id || !id.includes("-")) {
        throw new InvalidArgumentError( "id", id )
    }




    // check if the popup is already inserted in the body (may occur when multiple calls to the openPopup function)
    let popupElement = document.getElementById(POPUP_ID);

    if (!popupElement) {
        let popupContent = document.createElement('div');
        popupContent.id = `${POPUP_ID}-container`;
        popupContent.innerHTML = `
        <script>
            
        </script>
        
        <div id="${POPUP_ID}">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic%7CGabarito:regular,600%7CInter:regular,500"/>
            <div id="${POPUP_ID}-header">
                <img src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg" alt="">
                <div id="${POPUP_ID}-header-close" onclick="Carmentis.web.closeApprovalPopup()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
            </div>  
            <div id="${POPUP_ID}-body">
                 <div id="qr"></div>
            </div>
            <div id="${POPUP_ID}-footer" onclick="(
                window.carmentisWallet !== undefined ? 
                    window.carmentisWallet.openPopup(document.querySelector('[data-code]')?.getAttribute('data-code')) : {}
            ); return false">
                <span>Launch the extension</span>
            </div>
        </div>
        
       
        
        <style>
            #${POPUP_ID}-container {
                position: absolute;
                width: 100vw;
                height: 100vh;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                display: flex;
                justify-content: center;
                align-items: center;
                
                /* From https://css.glass */
                background: rgba(200, 200, 200, 0.29);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }
            
            #${POPUP_ID} {
                width: 400px;
                background: white;
                box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
            }
            
            #${POPUP_ID}-header {
                display: flex;
                padding: 10px;
                border-bottom: 1px solid #d8d8d8;
                justify-content: space-between;
                align-content: center;
            }
            
            
            #${POPUP_ID}-header-close svg {
                height: 100%;
                cursor: pointer;
            }
            
            #${POPUP_ID}-body {
                display: flex;
                padding: 10px;
                height: 300px;
                justify-content: center;
                align-content: center;
                flex-wrap: wrap;
            }
            
            #${POPUP_ID}-footer {
                display: flex;
                justify-content: center;
                align-content: center;
                background: #06b57b;
                color: white;
                height: 50px;
                font-family: Montserrat,serif ;
                text-transform: capitalize;
                font-weight: bold;
                cursor: pointer;
                flex-wrap: wrap;
            }
            
            #${POPUP_ID}-footer span {
                padding: 0;
                margin: 0;
            }
            
            
        </style>
        `;



        // append the popup to the end of the document
        document.body.appendChild(popupContent);


        // start the QR Code

        console.log("[DBG] OpenApprovalPopup: obtained id: ", id);
        const ORGANIZATION_ID = "0000000000000000000000000000000000000000000000000000000000000000";
        let answer = await Carmentis.wallet.request({
            qrElementId   : "qr", // QRCode identifier
            type          : "eventApproval",
            organizationId: ORGANIZATION_ID,
            data: {
                id: id,
            },
            allowReconnection: false,
            operatorURL: operatorURL
        });

        console.log("openApprovalPopup response: ", answer);


        if (onSuccessCallback) {
            onSuccessCallback();
        }

        return answer.success
    }
}

function closeApprovalPopup() {
    let popupElement = document.getElementById( `${POPUP_ID}-container`);
    if (popupElement) {
        popupElement.remove();
    }
}



const web = {
    dom: dom,
    "openApprovalPopup": async (args) => await openApprovalPopup(args),
    "closeApprovalPopup": () => closeApprovalPopup()
};


const wallet = {
    request           : async (...arg) => await request(...arg),
    setRequestCallback: async (...arg) => await setRequestCallback(...arg),
    attemptToReconnect: async (...arg) => await attemptToReconnect(...arg),
    getRequestById    : async (...arg) => await getRequestById(...arg),
    getRequestByQRCode: async (...arg) => await getRequestByQRCode(...arg),
    sendAnswer        : async (...arg) => await sendAnswer(...arg)
};

export { POPUP_ID, applicationChanged, closeApprovalPopup, constants, core, dataServerQuery, deriveAccountPrivateKey, deriveActorPrivateKey, deriveAesKeyFromBits, deriveAesKeyFromPassword, deriveAuthenticationPrivateKey, deriveNodePrivateKey, deriveOrganizationPrivateKey, derivePepperFromSeed, deriveUserPrivateKey, generateWordList, getChainStatus, getFlatRecord, getMasterBlock, getMasterBlockList, getMatchingWords, getMicroBlock, getMicroChain, getPublicKey, getSeedFromWordList, getWordListFromSeed, loadFromMicroblock, loadFromMicrochain, openApprovalPopup, operatorServerQuery, organizationChanged, prepareApproval, processRecord, publishApplication, publishOrganization, registerDataEndpoint, registerNodeEndpoint, registerOperatorEndpoint, sign, wallet, web };
