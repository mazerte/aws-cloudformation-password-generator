var generatePassword = require("password-generator");

var UPPERCASE_RE = /([A-Z])/g;
var LOWERCASE_RE = /([a-z])/g;
var NUMBER_RE = /([\d])/g;
var SPECIAL_CHAR_RE = /([\?\-])/g;
var NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password, options) {
  var uc = password.match(UPPERCASE_RE);
  var lc = password.match(LOWERCASE_RE);
  var n = password.match(NUMBER_RE);
  var sc = password.match(SPECIAL_CHAR_RE);
  var nr = password.match(NON_REPEATING_CHAR_RE);
  return !nr &&
    uc && uc.length >= options.uppercaseMinCount &&
    lc && lc.length >= options.lowercaseMinCount &&
    n && n.length >= options.numberMinCount &&
    sc && sc.length >= options.specialMinCount;
}

var defaultOptions = {
  memorable: false,
  length: 12,
  uppercaseMinCount: 1,
  lowercaseMinCount: 1,
  numberMinCount: 1,
  specialMinCount: 0
};
var strongOptions = {
  memorable: false,
  length: 32,
  uppercaseMinCount: 3,
  lowercaseMinCount: 3,
  numberMinCount: 2,
  specialMinCount: 2
}

var Create = function(params, reply) {
  var options = params.Strong == 'true' ? strongOptions : defaultOptions;
  if (params.Memorable) options.memorable = params.Memorable == 'true';
  if (params.Length) options.length = params.Length;
  if (params.UppercaseMinCount) options.uppercaseMinCount = params.UppercaseMinCount;
  if (params.LowercaseMinCount) options.lowercaseMinCount = params.LowercaseMinCount;
  if (params.NumberMinCount) options.numberMinCount = params.NumberMinCount;
  if (params.SpecialMinCount) options.specialMinCount = params.SpecialMinCount;

  var password = "";
  while (!(password != "" && (isStrongEnough(password, options) || options.memorable))) {
    password = generatePassword(options.length, options.memorable, /[\w\d\?\-]/);
  }
  return reply(null, password)
};

var Update = function(physicalId, params, oldParams, reply) {
  Create(params, reply);
};

var Delete = function(physicalId, params, reply) {
  reply(null, physicalId);
};

exports.Create = Create;
exports.Update = Update;
exports.Delete = Delete;
