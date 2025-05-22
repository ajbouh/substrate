var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a, _b;
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191];
var nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
var nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(code, set) {
  var pos = 65536;
  for (var i2 = 0; i2 < set.length; i2 += 2) {
    pos += set[i2];
    if (pos > code) {
      return false;
    }
    pos += set[i2 + 1];
    if (pos >= code) {
      return true;
    }
  }
  return false;
}
function isIdentifierStart(code, astral) {
  if (code < 65) {
    return code === 36;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
  if (code < 48) {
    return code === 36;
  }
  if (code < 58) {
    return true;
  }
  if (code < 65) {
    return false;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
var TokenType = function TokenType2(label, conf) {
  if (conf === void 0) conf = {};
  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
var beforeExpr = { beforeExpr: true }, startsExpr = { startsExpr: true };
var keywords = {};
function kw(name, options) {
  if (options === void 0) options = {};
  options.keyword = name;
  return keywords[name] = new TokenType(name, options);
}
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: true }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: true, beforeExpr: true }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: true }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: true }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: true, startsExpr: true }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: true, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
  _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
  _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code) {
  return code === 10 || code === 13 || code === 8232 || code === 8233;
}
function nextLineBreak(code, from, end) {
  if (end === void 0) end = code.length;
  for (var i2 = from; i2 < end; i2++) {
    var next = code.charCodeAt(i2);
    if (isNewLine(next)) {
      return i2 < end - 1 && next === 13 && code.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
    }
  }
  return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;
var hasOwn = Object.hasOwn || function(obj, propName) {
  return hasOwnProperty.call(obj, propName);
};
var isArray = Array.isArray || function(obj) {
  return toString.call(obj) === "[object Array]";
};
var regexpCache = /* @__PURE__ */ Object.create(null);
function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
function codePointToString(code) {
  if (code <= 65535) {
    return String.fromCharCode(code);
  }
  code -= 65536;
  return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var Position = function Position2(line, col) {
  this.line = line;
  this.column = col;
};
Position.prototype.offset = function offset(n2) {
  return new Position(this.line, this.column + n2);
};
var SourceLocation = function SourceLocation2(p2, start, end) {
  this.start = start;
  this.end = end;
  if (p2.sourceFile !== null) {
    this.source = p2.sourceFile;
  }
};
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset2);
    if (nextBreak < 0) {
      return new Position(line, offset2 - cur);
    }
    ++line;
    cur = nextBreak;
  }
}
var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: false,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: false,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: true,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};
var warnedAboutEcmaVersion = false;
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions) {
    options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }
  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }
  if (!opts || opts.allowHashBang == null) {
    options.allowHashBang = options.ecmaVersion >= 14;
  }
  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }
  return options;
}
function pushComment(options, array) {
  return function(block, text2, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text2,
      start,
      end
    };
    if (options.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}
var SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128, SCOPE_CLASS_STATIC_BLOCK = 256, SCOPE_CLASS_FIELD_INIT = 512, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5;
var Parser = function Parser2(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") {
      reserved += " await";
    }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);
  this.containsEsc = false;
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }
  this.type = types$1.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;
  this.context = this.initialContext();
  this.exprAllowed = true;
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = /* @__PURE__ */ Object.create(null);
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);
  this.regexpState = null;
  this.privateNameStack = [];
};
var prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, inClassStaticBlock: { configurable: true } };
Parser.prototype.parse = function parse2() {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node);
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
};
prototypeAccessors.canAwait.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT)) {
      return false;
    }
    if (flags & SCOPE_FUNCTION) {
      return (flags & SCOPE_ASYNC) > 0;
    }
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  return (flags & SCOPE_SUPER) > 0 || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT) || flags & SCOPE_FUNCTION && !(flags & SCOPE_ARROW)) {
      return true;
    }
  }
  return false;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = function extend() {
  var plugins = [], len = arguments.length;
  while (len--) plugins[len] = arguments[len];
  var cls = this;
  for (var i2 = 0; i2 < plugins.length; i2++) {
    cls = plugins[i2](cls);
  }
  return cls;
};
Parser.parse = function parse3(input, options) {
  return new this(options, input).parse();
};
Parser.parseExpressionAt = function parseExpressionAt2(input, pos, options) {
  var parser = new this(options, input, pos);
  parser.nextToken();
  return parser.parseExpression();
};
Parser.tokenizer = function tokenizer2(input, options) {
  return new this(options, input);
};
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype;
var literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) {
    return false;
  }
  for (; ; ) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next = this.input.charAt(end);
      return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
    }
    start += match[0].length;
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";") {
      start++;
    }
  }
};
pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};
pp$9.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc;
};
pp$9.eatContextual = function(name) {
  if (!this.isContextual(name)) {
    return false;
  }
  this.next();
  return true;
};
pp$9.expectContextual = function(name) {
  if (!this.eatContextual(name)) {
    this.unexpected();
  }
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};
pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};
pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};
pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};
pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};
var DestructuringErrors = function DestructuringErrors2() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};
pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(node) {
  var exports = /* @__PURE__ */ Object.create(null);
  if (!node.body) {
    node.body = [];
  }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node.body.push(stmt);
  }
  if (this.inModule) {
    for (var i2 = 0, list2 = Object.keys(this.undefinedExports); i2 < list2.length; i2 += 1) {
      var name = list2[i2];
      this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
    }
  }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program");
};
var loopLabel = { kind: "loop" }, switchLabel = { kind: "switch" };
pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
  if (nextCh === 91 || nextCh === 92) {
    return true;
  }
  if (context) {
    return false;
  }
  if (nextCh === 123 || nextCh > 55295 && nextCh < 56320) {
    return true;
  }
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) {
      ++pos;
    }
    if (nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
      return true;
    }
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) {
      return true;
    }
  }
  return false;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 55295 && after < 56320));
};
pp$8.parseStatement = function(context, topLevel, exports) {
  var starttype = this.type, node = this.startNode(), kind;
  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }
  switch (starttype) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(node);
    case types$1._do:
      return this.parseDoStatement(node);
    case types$1._for:
      return this.parseForStatement(node);
    case types$1._function:
      if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node, false, !context);
    case types$1._class:
      if (context) {
        this.unexpected();
      }
      return this.parseClass(node, true);
    case types$1._if:
      return this.parseIfStatement(node);
    case types$1._return:
      return this.parseReturnStatement(node);
    case types$1._switch:
      return this.parseSwitchStatement(node);
    case types$1._throw:
      return this.parseThrowStatement(node);
    case types$1._try:
      return this.parseTryStatement(node);
    case types$1._const:
    case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node, kind);
    case types$1._while:
      return this.parseWhileStatement(node);
    case types$1._with:
      return this.parseWithStatement(node);
    case types$1.braceL:
      return this.parseBlock(true, node);
    case types$1.semi:
      return this.parseEmptyStatement(node);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40 || nextCh === 46) {
          return this.parseExpressionStatement(node, this.parseExpression());
        }
      }
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports);
    default:
      if (this.isAsyncFunction()) {
        if (context) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node, true, !context);
      }
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};
pp$8.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.label = null;
  } else if (this.type !== types$1.name) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }
  var i2 = 0;
  for (; i2 < this.labels.length; ++i2) {
    var lab = this.labels[i2];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node.label && isBreak) {
        break;
      }
    }
  }
  if (i2 === this.labels.length) {
    this.raise(node.start, "Unsyntactic " + keyword);
  }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};
pp$8.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types$1.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node, "DoWhileStatement");
};
pp$8.parseForStatement = function(node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types$1._in) {
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
        } else {
          node.await = awaitAt > -1;
        }
      }
      return this.parseForIn(node, init$1);
    }
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, init$1);
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var containsEsc = this.containsEsc;
  var refDestructuringErrors = new DestructuringErrors();
  var initPos = this.start;
  var init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (awaitAt > -1) {
      if (this.type === types$1._in) {
        this.unexpected(awaitAt);
      }
      node.await = true;
    } else if (isForOf && this.options.ecmaVersion >= 8) {
      if (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async") {
        this.unexpected();
      } else if (this.options.ecmaVersion >= 9) {
        node.await = false;
      }
    }
    if (startsWithLet && isForOf) {
      this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$8.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement");
};
pp$8.parseReturnStatement = function(node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);
  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR; ) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) {
          this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) {
        this.unexpected();
      }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next();
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};
pp$8.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
  var param = this.parseBindingAtom();
  var simple2 = param.type === "Identifier";
  this.enterScope(simple2 ? SCOPE_SIMPLE_CATCH : 0);
  this.checkLValPattern(param, simple2 ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
  this.expect(types$1.parenR);
  return param;
};
pp$8.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseCatchClauseParam();
    } else {
      if (this.options.ecmaVersion < 10) {
        this.unexpected();
      }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }
  return this.finishNode(node, "TryStatement");
};
pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
  this.next();
  this.parseVar(node, false, kind, allowMissingInitializer);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};
pp$8.parseWithStatement = function(node) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement");
};
pp$8.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list2 = this.labels; i$1 < list2.length; i$1 += 1) {
    var label = list2[i$1];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i2 = this.labels.length - 1; i2 >= 0; i2--) {
    var label$1 = this.labels[i2];
    if (label$1.statementStart === node.start) {
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({ name: maybeName, kind, statementStart: this.start });
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};
pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if (createNewLexicalScope === void 0) createNewLexicalScope = true;
  if (node === void 0) node = this.startNode();
  node.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) {
    this.enterScope(0);
  }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) {
    this.strict = false;
  }
  this.next();
  if (createNewLexicalScope) {
    this.exitScope();
  }
  return this.finishNode(node, "BlockStatement");
};
pp$8.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};
pp$8.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();
  if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
    this.raise(
      init.start,
      (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
    );
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
  node.declarations = [];
  node.kind = kind;
  for (; ; ) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.unexpected();
    } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) {
      break;
    }
  }
  return node;
};
pp$8.parseVarId = function(decl, kind) {
  decl.id = this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) {
      this.unexpected();
    }
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  if (statement & FUNC_STATEMENT) {
    node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
      this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
    }
  }
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));
  if (!(statement & FUNC_STATEMENT)) {
    node.id = this.type === types$1.name ? this.parseIdent() : null;
  }
  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(node, isStatement) {
  this.next();
  var oldStrict = this.strict;
  this.strict = true;
  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) {
          this.raiseRecoverable(element.start, "Duplicate constructor in the same class");
        }
        hadConstructor = true;
      } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
        this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) {
    return null;
  }
  var ecmaVersion2 = this.options.ecmaVersion;
  var node = this.startNode();
  var keyName = "";
  var isGenerator2 = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;
  if (this.eatContextual("static")) {
    if (ecmaVersion2 >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node;
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion2 >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion2 >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator2 = true;
  }
  if (!keyName && !isAsync && !isGenerator2) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }
  if (keyName) {
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else {
    this.parseClassElementName(node);
  }
  if (ecmaVersion2 < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator2 || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    if (isConstructor && kind !== "method") {
      this.raise(node.key.start, "Constructor can't have get/set modifier");
    }
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator2, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node);
  }
  return node;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element);
  }
};
pp$8.parseClassMethod = function(method, isGenerator2, isAsync, allowsDirectSuper) {
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator2) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  var value = method.value = this.parseMethod(isGenerator2, isAsync, allowsDirectSuper);
  if (method.kind === "get" && value.params.length !== 0) {
    this.raiseRecoverable(value.start, "getter should have no params");
  }
  if (method.kind === "set" && value.params.length !== 1) {
    this.raiseRecoverable(value.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && value.params[0].type === "RestElement") {
    this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
  }
  return this.finishNode(method, "MethodDefinition");
};
pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }
  if (this.eat(types$1.eq)) {
    this.enterScope(SCOPE_CLASS_FIELD_INIT | SCOPE_SUPER);
    field.value = this.parseMaybeAssign();
    this.exitScope();
  } else {
    field.value = null;
  }
  this.semicolon();
  return this.finishNode(field, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(node) {
  node.body = [];
  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;
  return this.finishNode(node, "StaticBlock");
};
pp$8.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    if (isStatement) {
      this.checkLValSimple(node.id, BIND_LEXICAL, false);
    }
  } else {
    if (isStatement === true) {
      this.unexpected();
    }
    node.id = null;
  }
};
pp$8.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};
pp$8.enterClassBody = function() {
  var element = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  this.privateNameStack.push(element);
  return element.declared;
};
pp$8.exitClassBody = function() {
  var ref2 = this.privateNameStack.pop();
  var declared = ref2.declared;
  var used = ref2.used;
  if (!this.options.checkPrivateFields) {
    return;
  }
  var len = this.privateNameStack.length;
  var parent = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i2 = 0; i2 < used.length; ++i2) {
    var id = used[i2];
    if (!hasOwn(declared, id.name)) {
      if (parent) {
        parent.used.push(id);
      } else {
        this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class");
      }
    }
  }
};
function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];
  var next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next = (element.static ? "s" : "i") + element.kind;
  }
  if (curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget") {
    privateNameMap[name] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name] = next;
    return false;
  } else {
    return true;
  }
}
function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
pp$8.parseExportAllDeclaration = function(node, exports) {
  if (this.options.ecmaVersion >= 11) {
    if (this.eatContextual("as")) {
      node.exported = this.parseModuleExportName();
      this.checkExport(exports, node.exported, this.lastTokStart);
    } else {
      node.exported = null;
    }
  }
  this.expectContextual("from");
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.source = this.parseExprAtom();
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ExportAllDeclaration");
};
pp$8.parseExport = function(node, exports) {
  this.next();
  if (this.eat(types$1.star)) {
    return this.parseExportAllDeclaration(node, exports);
  }
  if (this.eat(types$1._default)) {
    this.checkExport(exports, "default", this.lastTokStart);
    node.declaration = this.parseExportDefaultDeclaration();
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseExportDeclaration(node);
    if (node.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports, node.declaration.declarations);
    } else {
      this.checkExport(exports, node.declaration.id, node.declaration.id.start);
    }
    node.specifiers = [];
    node.source = null;
    if (this.options.ecmaVersion >= 16) {
      node.attributes = [];
    }
  } else {
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
      if (this.options.ecmaVersion >= 16) {
        node.attributes = this.parseWithClause();
      }
    } else {
      for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
        var spec = list2[i2];
        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);
        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }
      node.source = null;
      if (this.options.ecmaVersion >= 16) {
        node.attributes = [];
      }
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(node) {
  return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
  var isAsync;
  if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
    var fNode = this.startNode();
    this.next();
    if (isAsync) {
      this.next();
    }
    return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
  } else if (this.type === types$1._class) {
    var cNode = this.startNode();
    return this.parseClass(cNode, "nullableID");
  } else {
    var declaration = this.parseMaybeAssign();
    this.semicolon();
    return declaration;
  }
};
pp$8.checkExport = function(exports, name, pos) {
  if (!exports) {
    return;
  }
  if (typeof name !== "string") {
    name = name.type === "Identifier" ? name.name : name.value;
  }
  if (hasOwn(exports, name)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  }
  exports[name] = true;
};
pp$8.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier") {
    this.checkExport(exports, pat, pat.start);
  } else if (type === "ObjectPattern") {
    for (var i2 = 0, list2 = pat.properties; i2 < list2.length; i2 += 1) {
      var prop = list2[i2];
      this.checkPatternExport(exports, prop);
    }
  } else if (type === "ArrayPattern") {
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];
      if (elt) {
        this.checkPatternExport(exports, elt);
      }
    }
  } else if (type === "Property") {
    this.checkPatternExport(exports, pat.value);
  } else if (type === "AssignmentPattern") {
    this.checkPatternExport(exports, pat.left);
  } else if (type === "RestElement") {
    this.checkPatternExport(exports, pat.argument);
  }
};
pp$8.checkVariableExport = function(exports, decls) {
  if (!exports) {
    return;
  }
  for (var i2 = 0, list2 = decls; i2 < list2.length; i2 += 1) {
    var decl = list2[i2];
    this.checkPatternExport(exports, decl.id);
  }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(exports) {
  var node = this.startNode();
  node.local = this.parseModuleExportName();
  node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
  this.checkExport(
    exports,
    node.exported,
    node.exported.start
  );
  return this.finishNode(node, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseExportSpecifier(exports));
  }
  return nodes;
};
pp$8.parseImport = function(node) {
  this.next();
  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
  var node = this.startNode();
  node.imported = this.parseModuleExportName();
  if (this.eatContextual("as")) {
    node.local = this.parseIdent();
  } else {
    this.checkUnreserved(node.imported);
    node.local = node.imported;
  }
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
  var node = this.startNode();
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
  var node = this.startNode();
  this.next();
  this.expectContextual("as");
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    nodes.push(this.parseImportDefaultSpecifier());
    if (!this.eat(types$1.comma)) {
      return nodes;
    }
  }
  if (this.type === types$1.star) {
    nodes.push(this.parseImportNamespaceSpecifier());
    return nodes;
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseImportSpecifier());
  }
  return nodes;
};
pp$8.parseWithClause = function() {
  var nodes = [];
  if (!this.eat(types$1._with)) {
    return nodes;
  }
  this.expect(types$1.braceL);
  var attributeKeys = {};
  var first = true;
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var attr = this.parseImportAttribute();
    var keyName = attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
    if (hasOwn(attributeKeys, keyName)) {
      this.raiseRecoverable(attr.key.start, "Duplicate attribute key '" + keyName + "'");
    }
    attributeKeys[keyName] = true;
    nodes.push(attr);
  }
  return nodes;
};
pp$8.parseImportAttribute = function() {
  var node = this.startNode();
  node.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
  this.expect(types$1.colon);
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.value = this.parseExprAtom();
  return this.finishNode(node, "ImportAttribute");
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral;
  }
  return this.parseIdent(true);
};
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i2 = 0; i2 < statements.length && this.isDirectiveCandidate(statements[i2]); ++i2) {
    statements[i2].directive = statements[i2].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
  (this.input[statement.start] === '"' || this.input[statement.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await") {
          this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
        }
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          this.toAssignable(prop, isBinding);
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;
      case "Property":
        if (node.kind !== "init") {
          this.raise(node.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node.value, isBinding);
        break;
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node.elements, isBinding);
        break;
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern") {
          this.raise(node.argument.start, "Rest elements cannot have a default value");
        }
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break;
      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!isBinding) {
          break;
        }
      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node;
};
pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i2 = 0; i2 < end; i2++) {
    var elt = exprList[i2];
    if (elt) {
      this.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};
pp$7.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
    this.unexpected();
  }
  node.argument = this.parseBindingAtom();
  return this.finishNode(node, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types$1.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};
pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this.expect(types$1.comma);
    }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      this.expect(close);
      break;
    } else {
      elts.push(this.parseAssignableListItem(allowModifiers));
    }
  }
  return elts;
};
pp$7.parseAssignableListItem = function(allowModifiers) {
  var elem = this.parseMaybeDefault(this.start, this.startLoc);
  this.parseBindingListItem(elem);
  return elem;
};
pp$7.parseBindingListItem = function(param) {
  return param;
};
pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
    return left;
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};
pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  var isBind = bindingType !== BIND_NONE;
  switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let") {
          this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
        }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name)) {
            this.raiseRecoverable(expr.start, "Argument name clash");
          }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) {
          this.declareName(expr.name, bindingType, expr.start);
        }
      }
      break;
    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;
    case "ParenthesizedExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding parenthesized expression");
      }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes);
    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "ObjectPattern":
      for (var i2 = 0, list2 = expr.properties; i2 < list2.length; i2 += 1) {
        var prop = list2[i2];
        this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break;
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
        if (elem) {
          this.checkLValInnerPattern(elem, bindingType, checkClashes);
        }
      }
      break;
    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
  }
};
pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "Property":
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break;
    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break;
    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
  }
};
var TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};
var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p2) {
    return p2.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};
var pp$6 = Parser.prototype;
pp$6.initialContext = function() {
  return [types.b_stat];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  if (parent === types.f_expr || parent === types.f_stat) {
    return true;
  }
  if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr)) {
    return !parent.isExpr;
  }
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) {
    return true;
  }
  if (prevType === types$1.braceL) {
    return parent === types.b_stat;
  }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) {
    return false;
  }
  return !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var i2 = this.context.length - 1; i2 >= 1; i2--) {
    var context = this.context[i2];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};
pp$6.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types$1.dot) {
    this.exprAllowed = false;
  } else if (update = type.updateContext) {
    update.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};
pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};
types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};
types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat)) {
    this.context.push(types.f_expr);
  } else {
    this.context.push(types.f_stat);
  }
  this.exprAllowed = false;
};
types$1.colon.updateContext = function() {
  if (this.curContext().token === "function") {
    this.context.pop();
  }
  this.exprAllowed = true;
};
types$1.backQuote.updateContext = function() {
  if (this.curContext() === types.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types.q_tmpl);
  }
  this.exprAllowed = false;
};
types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types.f_expr) {
      this.context[index] = types.f_expr_gen;
    } else {
      this.context[index] = types.f_gen;
    }
  }
  this.exprAllowed = true;
};
types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name;
  switch (key.type) {
    case "Identifier":
      name = key.name;
      break;
    case "Literal":
      name = String(key.value);
      break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return;
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};
pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types$1.comma)) {
      node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
    }
    return this.finishNode(node, "SequenceExpression");
  }
  return expr;
};
pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) {
      return this.parseYield(forInit);
    } else {
      this.exprAllowed = false;
    }
  }
  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }
  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq) {
      left = this.toAssignable(left, false, refDestructuringErrors);
    }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start) {
      refDestructuringErrors.shorthandAssign = -1;
    }
    if (this.type === types$1.eq) {
      this.checkLValPattern(left);
    } else {
      this.checkLValSimple(left);
    }
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) {
      refDestructuringErrors.doubleProto = oldDoubleProto;
    }
    return this.finishNode(node, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};
pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};
pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};
pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        prec = types$1.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
    }
  }
  return left;
};
pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  if (right.type === "PrivateIdentifier") {
    this.raise(right.start, "Private identifier can only be left side of binary expression");
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) {
      this.checkLValSimple(node.argument);
    } else if (this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
    } else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Private fields can not be deleted");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) {
      this.unexpected();
    }
    expr = this.parsePrivateIdent();
    if (this.type !== types$1._in) {
      this.unexpected();
    }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }
  if (!incDec && this.eat(types$1.starstar)) {
    if (sawUnary) {
      this.unexpected(this.lastTokStart);
    } else {
      return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
    }
  } else {
    return expr;
  }
};
function isLocalVariableAccess(node) {
  return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
    if (refDestructuringErrors.trailingComma >= result.start) {
      refDestructuringErrors.trailingComma = -1;
    }
  }
  return result;
};
pp$5.parseSubscripts = function(base2, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base2.type === "Identifier" && base2.name === "async" && this.lastTokEnd === base2.end && !this.canInsertSemicolon() && base2.end - base2.start === 5 && this.potentialArrowAt === base2.start;
  var optionalChained = false;
  while (true) {
    var element = this.parseSubscript(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
    if (element.optional) {
      optionalChained = true;
    }
    if (element === base2 || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element;
    }
    base2 = element;
  }
};
pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
};
pp$5.parseSubscript = function(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) {
    this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  }
  var computed = this.eat(types$1.bracketL);
  if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base2;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base2.type !== "Super") {
      node.property = this.parsePrivateIdent();
    } else {
      node.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node.computed = !!computed;
    if (optionalSupported) {
      node.optional = optional;
    }
    base2 = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0) {
        this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base2;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base2 = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base2;
    node$2.quasi = this.parseTemplate({ isTagged: true });
    base2 = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base2;
};
pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
  if (this.type === types$1.slash) {
    this.readRegexp();
  }
  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      if (!this.allowSuper) {
        this.raise(this.start, "'super' keyword outside a method");
      }
      node = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper) {
        this.raise(node.start, "super() call outside constructor of a subclass");
      }
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, "Super");
    case types$1._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression");
    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit);
        }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit);
        }
      }
      return id;
    case types$1.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = { pattern: value.pattern, flags: value.flags };
      return node;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      node = this.startNode();
      node.value = this.type === types$1._null ? null : this.type === types$1._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal");
    case types$1.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start;
        }
      }
      return expr;
    case types$1.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression");
    case types$1.braceL:
      this.overrideContext(types.b_expr);
      return this.parseObj(false, refDestructuringErrors);
    case types$1._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), false);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport(forNew);
      } else {
        return this.unexpected();
      }
    default:
      return this.parseExprAtomDefault();
  }
};
pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};
pp$5.parseExprImport = function(forNew) {
  var node = this.startNode();
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  }
  this.next();
  if (this.type === types$1.parenL && !forNew) {
    return this.parseDynamicImport(node);
  } else if (this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "import";
    node.meta = this.finishNode(meta, "Identifier");
    return this.parseImportMeta(node);
  } else {
    this.unexpected();
  }
};
pp$5.parseDynamicImport = function(node) {
  this.next();
  node.source = this.parseMaybeAssign();
  if (this.options.ecmaVersion >= 16) {
    if (!this.eat(types$1.parenR)) {
      this.expect(types$1.comma);
      if (!this.afterTrailingComma(types$1.parenR)) {
        node.options = this.parseMaybeAssign();
        if (!this.eat(types$1.parenR)) {
          this.expect(types$1.comma);
          if (!this.afterTrailingComma(types$1.parenR)) {
            this.unexpected();
          }
        }
      } else {
        node.options = null;
      }
    } else {
      node.options = null;
    }
  } else {
    if (!this.eat(types$1.parenR)) {
      var errorPos = this.start;
      if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
      } else {
        this.unexpected(errorPos);
      }
    }
  }
  return this.finishNode(node, "ImportExpression");
};
pp$5.parseImportMeta = function(node) {
  this.next();
  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);
  if (node.property.name !== "meta") {
    this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
  }
  if (containsEsc) {
    this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
  }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
    this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
  }
  return this.finishNode(node, "MetaProperty");
};
pp$5.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
    node.bigint = node.raw.slice(0, -1).replace(/_/g, "");
  }
  this.next();
  return this.finishNode(node, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val;
};
pp$5.shouldParseArrow = function(exprList) {
  return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) {
          this.raiseRecoverable(
            this.start,
            "Comma is not permitted after the rest element"
          );
        }
        break;
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);
    if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
    }
    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }
  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};
pp$5.parseParenItem = function(item) {
  return item;
};
pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};
var empty = [];
pp$5.parseNew = function() {
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  }
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "new";
    node.meta = this.finishNode(meta, "Identifier");
    this.next();
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target") {
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
    }
    if (containsEsc) {
      this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
    }
    if (!this.allowNewDotTarget) {
      this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
    }
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
  if (this.eat(types$1.parenL)) {
    node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node.arguments = empty;
  }
  return this.finishNode(node, "NewExpression");
};
pp$5.parseTemplateElement = function(ref2) {
  var isTagged = ref2.isTagged;
  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value.replace(/\r\n?/g, "\n"),
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement");
};
pp$5.parseTemplate = function(ref2) {
  if (ref2 === void 0) ref2 = {};
  var isTagged = ref2.isTagged;
  if (isTagged === void 0) isTagged = false;
  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({ isTagged });
  node.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types$1.eof) {
      this.raise(this.pos, "Unterminated template literal");
    }
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};
pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator2, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator2 = this.eat(types$1.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator2 && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator2 = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator2, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};
pp$5.parseGetterSetter = function(prop) {
  var kind = prop.key.name;
  this.parsePropertyName(prop);
  prop.value = this.parseMethod(false);
  prop.kind = kind;
  var paramCount = prop.kind === "get" ? 0 : 1;
  if (prop.value.params.length !== paramCount) {
    var start = prop.value.start;
    if (prop.kind === "get") {
      this.raiseRecoverable(start, "getter should have no params");
    } else {
      this.raiseRecoverable(start, "setter should have exactly one param");
    }
  } else {
    if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
      this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
    }
  }
};
pp$5.parsePropertyValue = function(prop, isPattern, isGenerator2, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator2 || isAsync) && this.type === types$1.colon) {
    this.unexpected();
  }
  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.method = true;
    prop.value = this.parseMethod(isGenerator2, isAsync);
    prop.kind = "init";
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
    if (isGenerator2 || isAsync) {
      this.unexpected();
    }
    this.parseGetterSetter(prop);
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator2 || isAsync) {
      this.unexpected();
    }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = startPos;
    }
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.kind = "init";
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};
pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) {
    node.generator = node.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = false;
  }
};
pp$5.parseMethod = function(isGenerator2, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) {
    node.generator = isGenerator2;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression");
};
pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;
  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    if (this.strict && node.id) {
      this.checkLValSimple(node.id, BIND_OUTSIDE);
    }
    node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(params) {
  for (var i2 = 0, list2 = params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};
pp$5.checkParams = function(node, allowDuplicates) {
  var nameHash = /* @__PURE__ */ Object.create(null);
  for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};
pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }
    var elt = void 0;
    if (allowEmpty && this.type === types$1.comma) {
      elt = null;
    } else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};
pp$5.checkUnreserved = function(ref2) {
  var start = ref2.start;
  var end = ref2.end;
  var name = ref2.name;
  if (this.inGenerator && name === "yield") {
    this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name === "await") {
    this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
  }
  if (!(this.currentThisScope().flags & SCOPE_VAR) && name === "arguments") {
    this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
  }
  if (this.inClassStaticBlock && (name === "arguments" || name === "await")) {
    this.raise(start, "Cannot use " + name + " in class static initialization block");
  }
  if (this.keywords.test(name)) {
    this.raise(start, "Unexpected keyword '" + name + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
    return;
  }
  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re.test(name)) {
    if (!this.inAsync && name === "await") {
      this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
  }
};
pp$5.parseIdent = function(liberal) {
  var node = this.parseIdentNode();
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = node.start;
    }
  }
  return node;
};
pp$5.parseIdentNode = function() {
  var node = this.startNode();
  if (this.type === types$1.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;
    if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
    this.type = types$1.name;
  } else {
    this.unexpected();
  }
  return node;
};
pp$5.parsePrivateIdent = function() {
  var node = this.startNode();
  if (this.type === types$1.privateId) {
    node.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "PrivateIdentifier");
  if (this.options.checkPrivateFields) {
    if (this.privateNameStack.length === 0) {
      this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
    } else {
      this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
    }
  }
  return node;
};
pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }
  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression");
};
pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  if (this.sourceFile) {
    message += " in " + this.sourceFile;
  }
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};
var pp$3 = Parser.prototype;
var Scope = function Scope2(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
};
pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(scope) {
  return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
};
pp$3.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    if (this.inModule && scope.flags & SCOPE_TOP) {
      delete this.undefinedExports[name];
    }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar) {
      redeclared = scope$2.lexical.indexOf(name) > -1;
    } else {
      redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
    }
    scope$2.functions.push(name);
  } else {
    for (var i2 = this.scopeStack.length - 1; i2 >= 0; --i2) {
      var scope$3 = this.scopeStack[i2];
      if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name);
      if (this.inModule && scope$3.flags & SCOPE_TOP) {
        delete this.undefinedExports[name];
      }
      if (scope$3.flags & SCOPE_VAR) {
        break;
      }
    }
  }
  if (redeclared) {
    this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
  }
};
pp$3.checkLocalExport = function(id) {
  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) {
    this.undefinedExports[id.name] = id;
  }
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK)) {
      return scope;
    }
  }
};
pp$3.currentThisScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK) && !(scope.flags & SCOPE_ARROW)) {
      return scope;
    }
  }
};
var Node = function Node2(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations) {
    this.loc = new SourceLocation(parser, loc);
  }
  if (parser.options.directSourceFile) {
    this.sourceFile = parser.options.directSourceFile;
  }
  if (parser.options.ranges) {
    this.range = [pos, 0];
  }
};
var pp$2 = Parser.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc);
};
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
pp$2.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};
pp$2.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) {
    newNode[prop] = node[prop];
  }
  return newNode;
};
var scriptValuesAddedInUnicode = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz";
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var ecma14BinaryProperties = ecma13BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
};
var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
var unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode;
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion2) {
  var d2 = data[ecmaVersion2] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion2] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion2]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion2])
    }
  };
  d2.nonBinary.Script_Extensions = d2.nonBinary.Script;
  d2.nonBinary.gc = d2.nonBinary.General_Category;
  d2.nonBinary.sc = d2.nonBinary.Script;
  d2.nonBinary.scx = d2.nonBinary.Script_Extensions;
}
for (var i = 0, list = [9, 10, 11, 12, 13, 14]; i < list.length; i += 1) {
  var ecmaVersion = list[i];
  buildUnicodeData(ecmaVersion);
}
var pp$1 = Parser.prototype;
var BranchID = function BranchID2(parent, base2) {
  this.parent = parent;
  this.base = base2 || this;
};
BranchID.prototype.separatedFrom = function separatedFrom(alt) {
  for (var self = this; self; self = self.parent) {
    for (var other = alt; other; other = other.parent) {
      if (self.base === other.base && self !== other) {
        return true;
      }
    }
  }
  return false;
};
BranchID.prototype.sibling = function sibling() {
  return new BranchID(this.parent, this.base);
};
var RegExpValidationState = function RegExpValidationState2(parser) {
  this.parser = parser;
  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchV = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = /* @__PURE__ */ Object.create(null);
  this.backReferenceNames = [];
  this.branchID = null;
};
RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
  var unicodeSets = flags.indexOf("v") !== -1;
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
    this.switchU = true;
    this.switchV = true;
    this.switchN = true;
  } else {
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchV = false;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  }
};
RegExpValidationState.prototype.raise = function raise(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};
RegExpValidationState.prototype.at = function at(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l2 = s.length;
  if (i2 >= l2) {
    return -1;
  }
  var c2 = s.charCodeAt(i2);
  if (!(forceU || this.switchU) || c2 <= 55295 || c2 >= 57344 || i2 + 1 >= l2) {
    return c2;
  }
  var next = s.charCodeAt(i2 + 1);
  return next >= 56320 && next <= 57343 ? (c2 << 10) + next - 56613888 : c2;
};
RegExpValidationState.prototype.nextIndex = function nextIndex(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l2 = s.length;
  if (i2 >= l2) {
    return l2;
  }
  var c2 = s.charCodeAt(i2), next;
  if (!(forceU || this.switchU) || c2 <= 55295 || c2 >= 57344 || i2 + 1 >= l2 || (next = s.charCodeAt(i2 + 1)) < 56320 || next > 57343) {
    return i2 + 1;
  }
  return i2 + 2;
};
RegExpValidationState.prototype.current = function current(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.pos, forceU);
};
RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.nextIndex(this.pos, forceU), forceU);
};
RegExpValidationState.prototype.advance = function advance(forceU) {
  if (forceU === void 0) forceU = false;
  this.pos = this.nextIndex(this.pos, forceU);
};
RegExpValidationState.prototype.eat = function eat(ch, forceU) {
  if (forceU === void 0) forceU = false;
  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true;
  }
  return false;
};
RegExpValidationState.prototype.eatChars = function eatChars(chs, forceU) {
  if (forceU === void 0) forceU = false;
  var pos = this.pos;
  for (var i2 = 0, list2 = chs; i2 < list2.length; i2 += 1) {
    var ch = list2[i2];
    var current2 = this.at(pos, forceU);
    if (current2 === -1 || current2 !== ch) {
      return false;
    }
    pos = this.nextIndex(pos, forceU);
  }
  this.pos = pos;
  return true;
};
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;
  var u2 = false;
  var v2 = false;
  for (var i2 = 0; i2 < flags.length; i2++) {
    var flag = flags.charAt(i2);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i2 + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
    if (flag === "u") {
      u2 = true;
    }
    if (flag === "v") {
      v2 = true;
    }
  }
  if (this.options.ecmaVersion >= 15 && u2 && v2) {
    this.raise(state.start, "Invalid regular expression flag");
  }
};
function hasProp(obj) {
  for (var _ in obj) {
    return true;
  }
  return false;
}
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);
  if (!state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames)) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames = /* @__PURE__ */ Object.create(null);
  state.backReferenceNames.length = 0;
  state.branchID = null;
  this.regexp_disjunction(state);
  if (state.pos !== state.source.length) {
    if (state.eat(
      41
      /* ) */
    )) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(
      93
      /* ] */
    ) || state.eat(
      125
      /* } */
    )) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i2 = 0, list2 = state.backReferenceNames; i2 < list2.length; i2 += 1) {
    var name = list2[i2];
    if (!state.groupNames[name]) {
      state.raise("Invalid named capture referenced");
    }
  }
};
pp$1.regexp_disjunction = function(state) {
  var trackDisjunction = this.options.ecmaVersion >= 16;
  if (trackDisjunction) {
    state.branchID = new BranchID(state.branchID, null);
  }
  this.regexp_alternative(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (trackDisjunction) {
      state.branchID = state.branchID.sibling();
    }
    this.regexp_alternative(state);
  }
  if (trackDisjunction) {
    state.branchID = state.branchID.parent;
  }
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(
    123
    /* { */
  )) {
    state.raise("Lone quantifier brackets");
  }
};
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
  }
};
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true;
  }
  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }
  return false;
};
pp$1.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;
  if (state.eat(
    94
    /* ^ */
  ) || state.eat(
    36
    /* $ */
  )) {
    return true;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    if (state.eat(
      66
      /* B */
    ) || state.eat(
      98
      /* b */
    )) {
      return true;
    }
    state.pos = start;
  }
  if (state.eat(
    40
    /* ( */
  ) && state.eat(
    63
    /* ? */
  )) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(
        60
        /* < */
      );
    }
    if (state.eat(
      61
      /* = */
    ) || state.eat(
      33
      /* ! */
    )) {
      this.regexp_disjunction(state);
      if (!state.eat(
        41
        /* ) */
      )) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }
  state.pos = start;
  return false;
};
pp$1.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0) noError = false;
  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(
      63
      /* ? */
    );
    return true;
  }
  return false;
};
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(
    42
    /* * */
  ) || state.eat(
    43
    /* + */
  ) || state.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(
    123
    /* { */
  )) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(
        44
        /* , */
      ) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(
        125
        /* } */
      )) {
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true;
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatAtom = function(state) {
  return this.regexp_eatPatternCharacters(state) || state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(
    40
    /* ( */
  )) {
    if (state.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var addModifiers = this.regexp_eatModifiers(state);
        var hasHyphen = state.eat(
          45
          /* - */
        );
        if (addModifiers || hasHyphen) {
          for (var i2 = 0; i2 < addModifiers.length; i2++) {
            var modifier = addModifiers.charAt(i2);
            if (addModifiers.indexOf(modifier, i2 + 1) > -1) {
              state.raise("Duplicate regular expression modifiers");
            }
          }
          if (hasHyphen) {
            var removeModifiers = this.regexp_eatModifiers(state);
            if (!addModifiers && !removeModifiers && state.current() === 58) {
              state.raise("Invalid regular expression modifiers");
            }
            for (var i$1 = 0; i$1 < removeModifiers.length; i$1++) {
              var modifier$1 = removeModifiers.charAt(i$1);
              if (removeModifiers.indexOf(modifier$1, i$1 + 1) > -1 || addModifiers.indexOf(modifier$1) > -1) {
                state.raise("Duplicate regular expression modifiers");
              }
            }
          }
        }
      }
      if (state.eat(
        58
        /* : */
      )) {
        this.regexp_disjunction(state);
        if (state.eat(
          41
          /* ) */
        )) {
          return true;
        }
        state.raise("Unterminated group");
      }
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 63) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(
      41
      /* ) */
    )) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};
pp$1.regexp_eatModifiers = function(state) {
  var modifiers = "";
  var ch = 0;
  while ((ch = state.current()) !== -1 && isRegularExpressionModifier(ch)) {
    modifiers += codePointToString(ch);
    state.advance();
  }
  return modifiers;
};
function isRegularExpressionModifier(ch) {
  return ch === 105 || ch === 109 || ch === 115;
}
pp$1.regexp_eatExtendedAtom = function(state) {
  return state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false;
};
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start;
};
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(
    63
    /* ? */
  )) {
    if (!this.regexp_eatGroupName(state)) {
      state.raise("Invalid group");
    }
    var trackDisjunction = this.options.ecmaVersion >= 16;
    var known = state.groupNames[state.lastStringValue];
    if (known) {
      if (trackDisjunction) {
        for (var i2 = 0, list2 = known; i2 < list2.length; i2 += 1) {
          var altID = list2[i2];
          if (!altID.separatedFrom(state.branchID)) {
            state.raise("Duplicate capture group name");
          }
        }
      } else {
        state.raise("Duplicate capture group name");
      }
    }
    if (trackDisjunction) {
      (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID);
    } else {
      state.groupNames[state.lastStringValue] = true;
    }
  }
};
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
      62
      /* > */
    )) {
      return true;
    }
    state.raise("Invalid capture group name");
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
pp$1.regexp_eatAtomEscape = function(state) {
  if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
    return true;
  }
  if (state.switchU) {
    if (state.current() === 99) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false;
};
pp$1.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n2 = state.lastIntValue;
    if (state.switchU) {
      if (n2 > state.maxBackReference) {
        state.maxBackReference = n2;
      }
      return true;
    }
    if (n2 <= state.numCapturingParens) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};
pp$1.regexp_eatCharacterEscape = function(state) {
  return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 116) {
    state.lastIntValue = 9;
    state.advance();
    return true;
  }
  if (ch === 110) {
    state.lastIntValue = 10;
    state.advance();
    return true;
  }
  if (ch === 118) {
    state.lastIntValue = 11;
    state.advance();
    return true;
  }
  if (ch === 102) {
    state.lastIntValue = 12;
    state.advance();
    return true;
  }
  if (ch === 114) {
    state.lastIntValue = 13;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0) forceU = false;
  var start = state.pos;
  var switchU = forceU || state.switchU;
  if (state.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 55296 && lead <= 56319) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(
          92
          /* \ */
        ) && state.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 56320 && trail <= 57343) {
            state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(state) && state.eat(
      125
      /* } */
    ) && isValidUnicode(state.lastIntValue)) {
      return true;
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }
  return false;
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true;
    }
    if (state.eat(
      47
      /* / */
    )) {
      state.lastIntValue = 47;
      return true;
    }
    return false;
  }
  var ch = state.current();
  if (ch !== 99 && (!state.switchN || ch !== 107)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 49 && ch <= 57) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
      state.advance();
    } while ((ch = state.current()) >= 48 && ch <= 57);
    return true;
  }
  return false;
};
var CharSetNone = 0;
var CharSetOk = 1;
var CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();
  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return CharSetOk;
  }
  var negate = false;
  if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 80) || ch === 112)) {
    state.lastIntValue = -1;
    state.advance();
    var result;
    if (state.eat(
      123
      /* { */
    ) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(
      125
      /* } */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Invalid property name");
      }
      return result;
    }
    state.raise("Invalid property name");
  }
  return CharSetNone;
};
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(
    61
    /* = */
  )) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return CharSetOk;
    }
  }
  state.pos = start;
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
  }
  return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name)) {
    state.raise("Invalid property name");
  }
  if (!state.unicodeProperties.nonBinary[name].test(value)) {
    state.raise("Invalid property value");
  }
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (state.unicodeProperties.binary.test(nameOrValue)) {
    return CharSetOk;
  }
  if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) {
    return CharSetString;
  }
  state.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (!state.eat(
      93
      /* ] */
    )) {
      state.raise("Unterminated character class");
    }
    if (negate && result === CharSetString) {
      state.raise("Negated character class may contain strings");
    }
    return true;
  }
  return false;
};
pp$1.regexp_classContents = function(state) {
  if (state.current() === 93) {
    return CharSetOk;
  }
  if (state.switchV) {
    return this.regexp_classSetExpression(state);
  }
  this.regexp_nonEmptyClassRanges(state);
  return CharSetOk;
};
pp$1.regexp_nonEmptyClassRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};
pp$1.regexp_eatClassAtom = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(state)) {
      return true;
    }
    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 99 || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  var ch = state.current();
  if (ch !== 93) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatClassEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    98
    /* b */
  )) {
    state.lastIntValue = 8;
    return true;
  }
  if (state.switchU && state.eat(
    45
    /* - */
  )) {
    state.lastIntValue = 45;
    return true;
  }
  if (!state.switchU && state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$1.regexp_classSetExpression = function(state) {
  var result = CharSetOk, subResult;
  if (this.regexp_eatClassSetRange(state)) ;
  else if (subResult = this.regexp_eatClassSetOperand(state)) {
    if (subResult === CharSetString) {
      result = CharSetString;
    }
    var start = state.pos;
    while (state.eatChars(
      [38, 38]
      /* && */
    )) {
      if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
        if (subResult !== CharSetString) {
          result = CharSetOk;
        }
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
    while (state.eatChars(
      [45, 45]
      /* -- */
    )) {
      if (this.regexp_eatClassSetOperand(state)) {
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
  } else {
    state.raise("Invalid character in character class");
  }
  for (; ; ) {
    if (this.regexp_eatClassSetRange(state)) {
      continue;
    }
    subResult = this.regexp_eatClassSetOperand(state);
    if (!subResult) {
      return result;
    }
    if (subResult === CharSetString) {
      result = CharSetString;
    }
  }
};
pp$1.regexp_eatClassSetRange = function(state) {
  var start = state.pos;
  if (this.regexp_eatClassSetCharacter(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(state)) {
      var right = state.lastIntValue;
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatClassSetOperand = function(state) {
  if (this.regexp_eatClassSetCharacter(state)) {
    return CharSetOk;
  }
  return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
};
pp$1.regexp_eatNestedClass = function(state) {
  var start = state.pos;
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (state.eat(
      93
      /* ] */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Negated character class may contain strings");
      }
      return result;
    }
    state.pos = start;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    var result$1 = this.regexp_eatCharacterClassEscape(state);
    if (result$1) {
      return result$1;
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_eatClassStringDisjunction = function(state) {
  var start = state.pos;
  if (state.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (state.eat(
      123
      /* { */
    )) {
      var result = this.regexp_classStringDisjunctionContents(state);
      if (state.eat(
        125
        /* } */
      )) {
        return result;
      }
    } else {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_classStringDisjunctionContents = function(state) {
  var result = this.regexp_classString(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (this.regexp_classString(state) === CharSetString) {
      result = CharSetString;
    }
  }
  return result;
};
pp$1.regexp_classString = function(state) {
  var count = 0;
  while (this.regexp_eatClassSetCharacter(state)) {
    count++;
  }
  return count === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) {
      return true;
    }
    if (state.eat(
      98
      /* b */
    )) {
      state.lastIntValue = 8;
      return true;
    }
    state.pos = start;
    return false;
  }
  var ch = state.current();
  if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) {
    return false;
  }
  if (isClassSetSyntaxCharacter(ch)) {
    return false;
  }
  state.advance();
  state.lastIntValue = ch;
  return true;
};
function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return ch === 33 || ch >= 35 && ch <= 38 || ch >= 42 && ch <= 44 || ch === 46 || ch >= 58 && ch <= 64 || ch === 94 || ch === 96 || ch === 126;
}
function isClassSetSyntaxCharacter(ch) {
  return ch === 40 || ch === 41 || ch === 45 || ch === 47 || ch >= 91 && ch <= 93 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
  var ch = state.current();
  if (isClassSetReservedPunctuator(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isClassSetReservedPunctuator(ch) {
  return ch === 33 || ch === 35 || ch === 37 || ch === 38 || ch === 44 || ch === 45 || ch >= 58 && ch <= 62 || ch === 64 || ch === 96 || ch === 126;
}
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 95) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true;
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
    state.advance();
  }
  return state.pos !== start;
};
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
pp$1.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start;
};
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 48;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i2 = 0; i2 < length; ++i2) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true;
};
var Token = function Token2(p2) {
  this.type = p2.type;
  this.value = p2.value;
  this.start = p2.start;
  this.end = p2.end;
  if (p2.options.locations) {
    this.loc = new SourceLocation(p2, p2.startLoc, p2.endLoc);
  }
  if (p2.options.ranges) {
    this.range = [p2.start, p2.end];
  }
};
var pp = Parser.prototype;
pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  }
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }
  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};
pp.getToken = function() {
  this.next();
  return new Token(this);
};
if (typeof Symbol !== "undefined") {
  pp[Symbol.iterator] = function() {
    var this$1$1 = this;
    return {
      next: function() {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        };
      }
    };
  };
}
pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }
  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types$1.eof);
  }
  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};
pp.readToken = function(code) {
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) {
    return this.readWord();
  }
  return this.getTokenFromCode(code);
};
pp.fullCharCodeAtPos = function() {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 55295 || code >= 56320) {
    return code;
  }
  var next = this.input.charCodeAt(this.pos + 1);
  return next <= 56319 || next >= 57344 ? code : (code << 10) + next - 56613888;
};
pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(
      true,
      this.input.slice(start + 2, end),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(
      false,
      this.input.slice(start + startSkip, this.pos),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.pos);
    switch (ch) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10:
      case 8232:
      case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break loop;
        }
        break;
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this.pos;
        } else {
          break loop;
        }
    }
  }
};
pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;
  this.updateContext(prevType);
};
pp.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) {
    return this.readNumber(true);
  }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
    this.pos += 3;
    return this.finishToken(types$1.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot);
  }
};
pp.readToken_slash = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types$1.star : types$1.modulo;
  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
    ++size;
    tokentype = types$1.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};
pp.readToken_pipe_amp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (this.options.ecmaVersion >= 12) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 === 61) {
        return this.finishOp(types$1.assign, 3);
      }
    }
    return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types$1.incDec, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types$1.assign, size + 1);
    }
    return this.finishOp(types$1.bitShift, size);
  }
  if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next === 61) {
    size = 2;
  }
  return this.finishOp(types$1.relational, size);
};
pp.readToken_eq_excl = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types$1.arrow);
  }
  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  if (ecmaVersion2 >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) {
        return this.finishOp(types$1.questionDot, 2);
      }
    }
    if (next === 63) {
      if (ecmaVersion2 >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) {
          return this.finishOp(types$1.assign, 3);
        }
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  var code = 35;
  if (ecmaVersion2 >= 13) {
    ++this.pos;
    code = this.fullCharCodeAtPos();
    if (isIdentifierStart(code, true) || code === 92) {
      return this.finishToken(types$1.privateId, this.readWord1());
    }
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.getTokenFromCode = function(code) {
  switch (code) {
    case 46:
      return this.readToken_dot();
    case 40:
      ++this.pos;
      return this.finishToken(types$1.parenL);
    case 41:
      ++this.pos;
      return this.finishToken(types$1.parenR);
    case 59:
      ++this.pos;
      return this.finishToken(types$1.semi);
    case 44:
      ++this.pos;
      return this.finishToken(types$1.comma);
    case 91:
      ++this.pos;
      return this.finishToken(types$1.bracketL);
    case 93:
      ++this.pos;
      return this.finishToken(types$1.bracketR);
    case 123:
      ++this.pos;
      return this.finishToken(types$1.braceL);
    case 125:
      ++this.pos;
      return this.finishToken(types$1.braceR);
    case 58:
      ++this.pos;
      return this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types$1.backQuote);
    case 48:
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) {
        return this.readRadixNumber(16);
      }
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) {
          return this.readRadixNumber(8);
        }
        if (next === 98 || next === 66) {
          return this.readRadixNumber(2);
        }
      }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    case 34:
    case 39:
      return this.readString(code);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(code);
    case 124:
    case 38:
      return this.readToken_pipe_amp(code);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(code);
    case 60:
    case 62:
      return this.readToken_lt_gt(code);
    case 61:
    case 33:
      return this.readToken_eq_excl(code);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};
pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(start, "Unterminated regular expression");
    }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) {
      this.raise(start, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch === "[") {
        inClass = true;
      } else if (ch === "]" && inClass) {
        inClass = false;
      } else if (ch === "/" && !inClass) {
        break;
      }
      escaped = ch === "\\";
    } else {
      escaped = false;
    }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e) {
  }
  return this.finishToken(types$1.regexp, { pattern, flags, value });
};
pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  var start = this.pos, total = 0, lastCode = 0;
  for (var i2 = 0, e = len == null ? Infinity : len; i2 < e; ++i2, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = void 0;
    if (allowSeparators && code === 95) {
      if (isLegacyOctalNumericLiteral) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      }
      if (lastCode === 95) {
        this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      }
      if (i2 === 0) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      }
      lastCode = code;
      continue;
    }
    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (code >= 48 && code <= 57) {
      val = code - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      break;
    }
    lastCode = code;
    total = total * radix + val;
  }
  if (allowSeparators && lastCode === 95) {
    this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  }
  if (this.pos === start || len != null && this.pos - start !== len) {
    return null;
  }
  return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types$1.num, val);
};
pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, void 0, true) === null) {
    this.raise(start, "Invalid number");
  }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) {
    this.raise(start, "Invalid number");
  }
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) {
      this.raise(this.pos, "Identifier directly after number");
    }
    return this.finishToken(types$1.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
    octal = false;
  }
  if (next === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) {
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) {
      ++this.pos;
    }
    if (this.readInt(10) === null) {
      this.raise(start, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val);
};
pp.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code;
  if (ch === 123) {
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 1114111) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code = this.readHexChar(4);
  }
  return code;
};
pp.readString = function(quote2) {
  var out = "", chunkStart = ++this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated string constant");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote2) {
      break;
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 8232 || ch === 8233) {
      if (this.options.ecmaVersion < 10) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch)) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }
  this.inTemplateElement = false;
};
pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};
pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated template");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL);
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote);
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out);
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch);
          break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break;
        }
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        if (this.input[this.pos + 1] === "\n") {
          ++this.pos;
        }
      case "\n":
      case "\u2028":
      case "\u2029":
        ++this.curLine;
        this.lineStart = this.pos + 1;
        break;
    }
  }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
    case 110:
      return "\n";
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return codePointToString(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      }
    case 10:
      if (this.options.locations) {
        this.lineStart = this.pos;
        ++this.curLine;
      }
      return "";
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(
          this.pos - 1,
          "Invalid escape sequence"
        );
      }
      if (inTemplate) {
        var codePos = this.pos - 1;
        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal);
      }
      if (isNewLine(ch)) {
        if (this.options.locations) {
          this.lineStart = this.pos;
          ++this.curLine;
        }
        return "";
      }
      return String.fromCharCode(ch);
  }
};
pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n2 = this.readInt(16, len);
  if (n2 === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n2;
};
pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 65535 ? 1 : 2;
    } else if (ch === 92) {
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) {
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};
pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word);
};
var version$2 = "8.14.1";
Parser.acorn = {
  Parser,
  version: version$2,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parse(input, options) {
  return Parser.parse(input, options);
}
function parseExpressionAt(input, pos, options) {
  return Parser.parseExpressionAt(input, pos, options);
}
function tokenizer(input, options) {
  return Parser.tokenizer(input, options);
}
const t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Node,
  Parser,
  Position,
  SourceLocation,
  TokContext,
  Token,
  TokenType,
  defaultOptions,
  getLineInfo,
  isIdentifierChar,
  isIdentifierStart,
  isNewLine,
  keywordTypes: keywords,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace,
  parse,
  parseExpressionAt,
  tokContexts: types,
  tokTypes: types$1,
  tokenizer,
  version: version$2
}, Symbol.toStringTag, { value: "Module" }));
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n2) {
  if (n2.__esModule) return n2;
  var f2 = n2.default;
  if (typeof f2 == "function") {
    var a2 = function a3() {
      if (this instanceof a3) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a2.prototype = f2.prototype;
  } else a2 = {};
  Object.defineProperty(a2, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k2) {
    var d2 = Object.getOwnPropertyDescriptor(n2, k2);
    Object.defineProperty(a2, k2, d2.get ? d2 : {
      enumerable: true,
      get: function() {
        return n2[k2];
      }
    });
  });
  return a2;
}
var acornJsx = { exports: {} };
var xhtml = {
  quot: '"',
  amp: "&",
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  iexcl: "¡",
  cent: "¢",
  pound: "£",
  curren: "¤",
  yen: "¥",
  brvbar: "¦",
  sect: "§",
  uml: "¨",
  copy: "©",
  ordf: "ª",
  laquo: "«",
  not: "¬",
  shy: "­",
  reg: "®",
  macr: "¯",
  deg: "°",
  plusmn: "±",
  sup2: "²",
  sup3: "³",
  acute: "´",
  micro: "µ",
  para: "¶",
  middot: "·",
  cedil: "¸",
  sup1: "¹",
  ordm: "º",
  raquo: "»",
  frac14: "¼",
  frac12: "½",
  frac34: "¾",
  iquest: "¿",
  Agrave: "À",
  Aacute: "Á",
  Acirc: "Â",
  Atilde: "Ã",
  Auml: "Ä",
  Aring: "Å",
  AElig: "Æ",
  Ccedil: "Ç",
  Egrave: "È",
  Eacute: "É",
  Ecirc: "Ê",
  Euml: "Ë",
  Igrave: "Ì",
  Iacute: "Í",
  Icirc: "Î",
  Iuml: "Ï",
  ETH: "Ð",
  Ntilde: "Ñ",
  Ograve: "Ò",
  Oacute: "Ó",
  Ocirc: "Ô",
  Otilde: "Õ",
  Ouml: "Ö",
  times: "×",
  Oslash: "Ø",
  Ugrave: "Ù",
  Uacute: "Ú",
  Ucirc: "Û",
  Uuml: "Ü",
  Yacute: "Ý",
  THORN: "Þ",
  szlig: "ß",
  agrave: "à",
  aacute: "á",
  acirc: "â",
  atilde: "ã",
  auml: "ä",
  aring: "å",
  aelig: "æ",
  ccedil: "ç",
  egrave: "è",
  eacute: "é",
  ecirc: "ê",
  euml: "ë",
  igrave: "ì",
  iacute: "í",
  icirc: "î",
  iuml: "ï",
  eth: "ð",
  ntilde: "ñ",
  ograve: "ò",
  oacute: "ó",
  ocirc: "ô",
  otilde: "õ",
  ouml: "ö",
  divide: "÷",
  oslash: "ø",
  ugrave: "ù",
  uacute: "ú",
  ucirc: "û",
  uuml: "ü",
  yacute: "ý",
  thorn: "þ",
  yuml: "ÿ",
  OElig: "Œ",
  oelig: "œ",
  Scaron: "Š",
  scaron: "š",
  Yuml: "Ÿ",
  fnof: "ƒ",
  circ: "ˆ",
  tilde: "˜",
  Alpha: "Α",
  Beta: "Β",
  Gamma: "Γ",
  Delta: "Δ",
  Epsilon: "Ε",
  Zeta: "Ζ",
  Eta: "Η",
  Theta: "Θ",
  Iota: "Ι",
  Kappa: "Κ",
  Lambda: "Λ",
  Mu: "Μ",
  Nu: "Ν",
  Xi: "Ξ",
  Omicron: "Ο",
  Pi: "Π",
  Rho: "Ρ",
  Sigma: "Σ",
  Tau: "Τ",
  Upsilon: "Υ",
  Phi: "Φ",
  Chi: "Χ",
  Psi: "Ψ",
  Omega: "Ω",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  omicron: "ο",
  pi: "π",
  rho: "ρ",
  sigmaf: "ς",
  sigma: "σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  thetasym: "ϑ",
  upsih: "ϒ",
  piv: "ϖ",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  zwnj: "‌",
  zwj: "‍",
  lrm: "‎",
  rlm: "‏",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  dagger: "†",
  Dagger: "‡",
  bull: "•",
  hellip: "…",
  permil: "‰",
  prime: "′",
  Prime: "″",
  lsaquo: "‹",
  rsaquo: "›",
  oline: "‾",
  frasl: "⁄",
  euro: "€",
  image: "ℑ",
  weierp: "℘",
  real: "ℜ",
  trade: "™",
  alefsym: "ℵ",
  larr: "←",
  uarr: "↑",
  rarr: "→",
  darr: "↓",
  harr: "↔",
  crarr: "↵",
  lArr: "⇐",
  uArr: "⇑",
  rArr: "⇒",
  dArr: "⇓",
  hArr: "⇔",
  forall: "∀",
  part: "∂",
  exist: "∃",
  empty: "∅",
  nabla: "∇",
  isin: "∈",
  notin: "∉",
  ni: "∋",
  prod: "∏",
  sum: "∑",
  minus: "−",
  lowast: "∗",
  radic: "√",
  prop: "∝",
  infin: "∞",
  ang: "∠",
  and: "∧",
  or: "∨",
  cap: "∩",
  cup: "∪",
  "int": "∫",
  there4: "∴",
  sim: "∼",
  cong: "≅",
  asymp: "≈",
  ne: "≠",
  equiv: "≡",
  le: "≤",
  ge: "≥",
  sub: "⊂",
  sup: "⊃",
  nsub: "⊄",
  sube: "⊆",
  supe: "⊇",
  oplus: "⊕",
  otimes: "⊗",
  perp: "⊥",
  sdot: "⋅",
  lceil: "⌈",
  rceil: "⌉",
  lfloor: "⌊",
  rfloor: "⌋",
  lang: "〈",
  rang: "〉",
  loz: "◊",
  spades: "♠",
  clubs: "♣",
  hearts: "♥",
  diams: "♦"
};
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(t);
(function(module) {
  const XHTMLEntities = xhtml;
  const hexNumber = /^[\da-fA-F]+$/;
  const decimalNumber = /^\d+$/;
  const acornJsxMap = /* @__PURE__ */ new WeakMap();
  function getJsxTokens(acorn) {
    acorn = acorn.Parser.acorn || acorn;
    let acornJsx2 = acornJsxMap.get(acorn);
    if (!acornJsx2) {
      const tt = acorn.tokTypes;
      const TokContext3 = acorn.TokContext;
      const TokenType3 = acorn.TokenType;
      const tc_oTag = new TokContext3("<tag", false);
      const tc_cTag = new TokContext3("</tag", false);
      const tc_expr = new TokContext3("<tag>...</tag>", true, true);
      const tokContexts = {
        tc_oTag,
        tc_cTag,
        tc_expr
      };
      const tokTypes = {
        jsxName: new TokenType3("jsxName"),
        jsxText: new TokenType3("jsxText", { beforeExpr: true }),
        jsxTagStart: new TokenType3("jsxTagStart", { startsExpr: true }),
        jsxTagEnd: new TokenType3("jsxTagEnd")
      };
      tokTypes.jsxTagStart.updateContext = function() {
        this.context.push(tc_expr);
        this.context.push(tc_oTag);
        this.exprAllowed = false;
      };
      tokTypes.jsxTagEnd.updateContext = function(prevType) {
        let out = this.context.pop();
        if (out === tc_oTag && prevType === tt.slash || out === tc_cTag) {
          this.context.pop();
          this.exprAllowed = this.curContext() === tc_expr;
        } else {
          this.exprAllowed = true;
        }
      };
      acornJsx2 = { tokContexts, tokTypes };
      acornJsxMap.set(acorn, acornJsx2);
    }
    return acornJsx2;
  }
  function getQualifiedJSXName(object) {
    if (!object)
      return object;
    if (object.type === "JSXIdentifier")
      return object.name;
    if (object.type === "JSXNamespacedName")
      return object.namespace.name + ":" + object.name.name;
    if (object.type === "JSXMemberExpression")
      return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
  }
  module.exports = function(options) {
    options = options || {};
    return function(Parser3) {
      return plugin({
        allowNamespaces: options.allowNamespaces !== false,
        allowNamespacedObjects: !!options.allowNamespacedObjects
      }, Parser3);
    };
  };
  Object.defineProperty(module.exports, "tokTypes", {
    get: function get_tokTypes() {
      return getJsxTokens(require$$1).tokTypes;
    },
    configurable: true,
    enumerable: true
  });
  function plugin(options, Parser3) {
    const acorn = Parser3.acorn || require$$1;
    const acornJsx2 = getJsxTokens(acorn);
    const tt = acorn.tokTypes;
    const tok = acornJsx2.tokTypes;
    const tokContexts = acorn.tokContexts;
    const tc_oTag = acornJsx2.tokContexts.tc_oTag;
    const tc_cTag = acornJsx2.tokContexts.tc_cTag;
    const tc_expr = acornJsx2.tokContexts.tc_expr;
    const isNewLine2 = acorn.isNewLine;
    const isIdentifierStart2 = acorn.isIdentifierStart;
    const isIdentifierChar2 = acorn.isIdentifierChar;
    return class extends Parser3 {
      // Expose actual `tokTypes` and `tokContexts` to other plugins.
      static get acornJsx() {
        return acornJsx2;
      }
      // Reads inline JSX contents token.
      jsx_readToken() {
        let out = "", chunkStart = this.pos;
        for (; ; ) {
          if (this.pos >= this.input.length)
            this.raise(this.start, "Unterminated JSX contents");
          let ch = this.input.charCodeAt(this.pos);
          switch (ch) {
            case 60:
            case 123:
              if (this.pos === this.start) {
                if (ch === 60 && this.exprAllowed) {
                  ++this.pos;
                  return this.finishToken(tok.jsxTagStart);
                }
                return this.getTokenFromCode(ch);
              }
              out += this.input.slice(chunkStart, this.pos);
              return this.finishToken(tok.jsxText, out);
            case 38:
              out += this.input.slice(chunkStart, this.pos);
              out += this.jsx_readEntity();
              chunkStart = this.pos;
              break;
            case 62:
            case 125:
              this.raise(
                this.pos,
                "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (ch === 62 ? "&gt;" : "&rbrace;") + '` or `{"' + this.input[this.pos] + '"}`?'
              );
            default:
              if (isNewLine2(ch)) {
                out += this.input.slice(chunkStart, this.pos);
                out += this.jsx_readNewLine(true);
                chunkStart = this.pos;
              } else {
                ++this.pos;
              }
          }
        }
      }
      jsx_readNewLine(normalizeCRLF) {
        let ch = this.input.charCodeAt(this.pos);
        let out;
        ++this.pos;
        if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
          ++this.pos;
          out = normalizeCRLF ? "\n" : "\r\n";
        } else {
          out = String.fromCharCode(ch);
        }
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        return out;
      }
      jsx_readString(quote2) {
        let out = "", chunkStart = ++this.pos;
        for (; ; ) {
          if (this.pos >= this.input.length)
            this.raise(this.start, "Unterminated string constant");
          let ch = this.input.charCodeAt(this.pos);
          if (ch === quote2) break;
          if (ch === 38) {
            out += this.input.slice(chunkStart, this.pos);
            out += this.jsx_readEntity();
            chunkStart = this.pos;
          } else if (isNewLine2(ch)) {
            out += this.input.slice(chunkStart, this.pos);
            out += this.jsx_readNewLine(false);
            chunkStart = this.pos;
          } else {
            ++this.pos;
          }
        }
        out += this.input.slice(chunkStart, this.pos++);
        return this.finishToken(tt.string, out);
      }
      jsx_readEntity() {
        let str = "", count = 0, entity;
        let ch = this.input[this.pos];
        if (ch !== "&")
          this.raise(this.pos, "Entity must start with an ampersand");
        let startPos = ++this.pos;
        while (this.pos < this.input.length && count++ < 10) {
          ch = this.input[this.pos++];
          if (ch === ";") {
            if (str[0] === "#") {
              if (str[1] === "x") {
                str = str.substr(2);
                if (hexNumber.test(str))
                  entity = String.fromCharCode(parseInt(str, 16));
              } else {
                str = str.substr(1);
                if (decimalNumber.test(str))
                  entity = String.fromCharCode(parseInt(str, 10));
              }
            } else {
              entity = XHTMLEntities[str];
            }
            break;
          }
          str += ch;
        }
        if (!entity) {
          this.pos = startPos;
          return "&";
        }
        return entity;
      }
      // Read a JSX identifier (valid tag or attribute name).
      //
      // Optimized version since JSX identifiers can't contain
      // escape characters and so can be read as single slice.
      // Also assumes that first character was already checked
      // by isIdentifierStart in readToken.
      jsx_readWord() {
        let ch, start = this.pos;
        do {
          ch = this.input.charCodeAt(++this.pos);
        } while (isIdentifierChar2(ch) || ch === 45);
        return this.finishToken(tok.jsxName, this.input.slice(start, this.pos));
      }
      // Parse next token as JSX identifier
      jsx_parseIdentifier() {
        let node = this.startNode();
        if (this.type === tok.jsxName)
          node.name = this.value;
        else if (this.type.keyword)
          node.name = this.type.keyword;
        else
          this.unexpected();
        this.next();
        return this.finishNode(node, "JSXIdentifier");
      }
      // Parse namespaced identifier.
      jsx_parseNamespacedName() {
        let startPos = this.start, startLoc = this.startLoc;
        let name = this.jsx_parseIdentifier();
        if (!options.allowNamespaces || !this.eat(tt.colon)) return name;
        var node = this.startNodeAt(startPos, startLoc);
        node.namespace = name;
        node.name = this.jsx_parseIdentifier();
        return this.finishNode(node, "JSXNamespacedName");
      }
      // Parses element name in any form - namespaced, member
      // or single identifier.
      jsx_parseElementName() {
        if (this.type === tok.jsxTagEnd) return "";
        let startPos = this.start, startLoc = this.startLoc;
        let node = this.jsx_parseNamespacedName();
        if (this.type === tt.dot && node.type === "JSXNamespacedName" && !options.allowNamespacedObjects) {
          this.unexpected();
        }
        while (this.eat(tt.dot)) {
          let newNode = this.startNodeAt(startPos, startLoc);
          newNode.object = node;
          newNode.property = this.jsx_parseIdentifier();
          node = this.finishNode(newNode, "JSXMemberExpression");
        }
        return node;
      }
      // Parses any type of JSX attribute value.
      jsx_parseAttributeValue() {
        switch (this.type) {
          case tt.braceL:
            let node = this.jsx_parseExpressionContainer();
            if (node.expression.type === "JSXEmptyExpression")
              this.raise(node.start, "JSX attributes must only be assigned a non-empty expression");
            return node;
          case tok.jsxTagStart:
          case tt.string:
            return this.parseExprAtom();
          default:
            this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
        }
      }
      // JSXEmptyExpression is unique type since it doesn't actually parse anything,
      // and so it should start at the end of last read token (left brace) and finish
      // at the beginning of the next one (right brace).
      jsx_parseEmptyExpression() {
        let node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
        return this.finishNodeAt(node, "JSXEmptyExpression", this.start, this.startLoc);
      }
      // Parses JSX expression enclosed into curly brackets.
      jsx_parseExpressionContainer() {
        let node = this.startNode();
        this.next();
        node.expression = this.type === tt.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression();
        this.expect(tt.braceR);
        return this.finishNode(node, "JSXExpressionContainer");
      }
      // Parses following JSX attribute name-value pair.
      jsx_parseAttribute() {
        let node = this.startNode();
        if (this.eat(tt.braceL)) {
          this.expect(tt.ellipsis);
          node.argument = this.parseMaybeAssign();
          this.expect(tt.braceR);
          return this.finishNode(node, "JSXSpreadAttribute");
        }
        node.name = this.jsx_parseNamespacedName();
        node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null;
        return this.finishNode(node, "JSXAttribute");
      }
      // Parses JSX opening tag starting after '<'.
      jsx_parseOpeningElementAt(startPos, startLoc) {
        let node = this.startNodeAt(startPos, startLoc);
        node.attributes = [];
        let nodeName = this.jsx_parseElementName();
        if (nodeName) node.name = nodeName;
        while (this.type !== tt.slash && this.type !== tok.jsxTagEnd)
          node.attributes.push(this.jsx_parseAttribute());
        node.selfClosing = this.eat(tt.slash);
        this.expect(tok.jsxTagEnd);
        return this.finishNode(node, nodeName ? "JSXOpeningElement" : "JSXOpeningFragment");
      }
      // Parses JSX closing tag starting after '</'.
      jsx_parseClosingElementAt(startPos, startLoc) {
        let node = this.startNodeAt(startPos, startLoc);
        let nodeName = this.jsx_parseElementName();
        if (nodeName) node.name = nodeName;
        this.expect(tok.jsxTagEnd);
        return this.finishNode(node, nodeName ? "JSXClosingElement" : "JSXClosingFragment");
      }
      // Parses entire JSX element, including it's opening tag
      // (starting after '<'), attributes, contents and closing tag.
      jsx_parseElementAt(startPos, startLoc) {
        let node = this.startNodeAt(startPos, startLoc);
        let children = [];
        let openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc);
        let closingElement = null;
        if (!openingElement.selfClosing) {
          contents: for (; ; ) {
            switch (this.type) {
              case tok.jsxTagStart:
                startPos = this.start;
                startLoc = this.startLoc;
                this.next();
                if (this.eat(tt.slash)) {
                  closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
                  break contents;
                }
                children.push(this.jsx_parseElementAt(startPos, startLoc));
                break;
              case tok.jsxText:
                children.push(this.parseExprAtom());
                break;
              case tt.braceL:
                children.push(this.jsx_parseExpressionContainer());
                break;
              default:
                this.unexpected();
            }
          }
          if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
            this.raise(
              closingElement.start,
              "Expected corresponding JSX closing tag for <" + getQualifiedJSXName(openingElement.name) + ">"
            );
          }
        }
        let fragmentOrElement = openingElement.name ? "Element" : "Fragment";
        node["opening" + fragmentOrElement] = openingElement;
        node["closing" + fragmentOrElement] = closingElement;
        node.children = children;
        if (this.type === tt.relational && this.value === "<") {
          this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag");
        }
        return this.finishNode(node, "JSX" + fragmentOrElement);
      }
      // Parse JSX text
      jsx_parseText() {
        let node = this.parseLiteral(this.value);
        node.type = "JSXText";
        return node;
      }
      // Parses entire JSX element from current position.
      jsx_parseElement() {
        let startPos = this.start, startLoc = this.startLoc;
        this.next();
        return this.jsx_parseElementAt(startPos, startLoc);
      }
      parseExprAtom(refShortHandDefaultPos) {
        if (this.type === tok.jsxText)
          return this.jsx_parseText();
        else if (this.type === tok.jsxTagStart)
          return this.jsx_parseElement();
        else
          return super.parseExprAtom(refShortHandDefaultPos);
      }
      readToken(code) {
        let context = this.curContext();
        if (context === tc_expr) return this.jsx_readToken();
        if (context === tc_oTag || context === tc_cTag) {
          if (isIdentifierStart2(code)) return this.jsx_readWord();
          if (code == 62) {
            ++this.pos;
            return this.finishToken(tok.jsxTagEnd);
          }
          if ((code === 34 || code === 39) && context == tc_oTag)
            return this.jsx_readString(code);
        }
        if (code === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) {
          ++this.pos;
          return this.finishToken(tok.jsxTagStart);
        }
        return super.readToken(code);
      }
      updateContext(prevType) {
        if (this.type == tt.braceL) {
          var curContext = this.curContext();
          if (curContext == tc_oTag) this.context.push(tokContexts.b_expr);
          else if (curContext == tc_expr) this.context.push(tokContexts.b_tmpl);
          else super.updateContext(prevType);
          this.exprAllowed = true;
        } else if (this.type === tt.slash && prevType === tok.jsxTagStart) {
          this.context.length -= 2;
          this.context.push(tc_cTag);
          this.exprAllowed = false;
        } else {
          return super.updateContext(prevType);
        }
      }
    };
  }
})(acornJsx);
var acornJsxExports = acornJsx.exports;
const jsx = /* @__PURE__ */ getDefaultExportFromCjs(acornJsxExports);
function simple(node, visitors, baseVisitor, state, override) {
  if (!baseVisitor) {
    baseVisitor = base;
  }
  (function c2(node2, st, override2) {
    var type = override2 || node2.type;
    baseVisitor[type](node2, st, c2);
    if (visitors[type]) {
      visitors[type](node2, st);
    }
  })(node, state, override);
}
function ancestor(node, visitors, baseVisitor, state, override) {
  var ancestors = [];
  if (!baseVisitor) {
    baseVisitor = base;
  }
  (function c2(node2, st, override2) {
    var type = override2 || node2.type;
    var isNew = node2 !== ancestors[ancestors.length - 1];
    if (isNew) {
      ancestors.push(node2);
    }
    baseVisitor[type](node2, st, c2);
    if (visitors[type]) {
      visitors[type](node2, st || ancestors, ancestors);
    }
    if (isNew) {
      ancestors.pop();
    }
  })(node, state, override);
}
function skipThrough(node, st, c2) {
  c2(node, st);
}
function ignore(_node, _st, _c) {
}
var base = {};
base.Program = base.BlockStatement = base.StaticBlock = function(node, st, c2) {
  for (var i2 = 0, list2 = node.body; i2 < list2.length; i2 += 1) {
    var stmt = list2[i2];
    c2(stmt, st, "Statement");
  }
};
base.Statement = skipThrough;
base.EmptyStatement = ignore;
base.ExpressionStatement = base.ParenthesizedExpression = base.ChainExpression = function(node, st, c2) {
  return c2(node.expression, st, "Expression");
};
base.IfStatement = function(node, st, c2) {
  c2(node.test, st, "Expression");
  c2(node.consequent, st, "Statement");
  if (node.alternate) {
    c2(node.alternate, st, "Statement");
  }
};
base.LabeledStatement = function(node, st, c2) {
  return c2(node.body, st, "Statement");
};
base.BreakStatement = base.ContinueStatement = ignore;
base.WithStatement = function(node, st, c2) {
  c2(node.object, st, "Expression");
  c2(node.body, st, "Statement");
};
base.SwitchStatement = function(node, st, c2) {
  c2(node.discriminant, st, "Expression");
  for (var i2 = 0, list2 = node.cases; i2 < list2.length; i2 += 1) {
    var cs = list2[i2];
    c2(cs, st);
  }
};
base.SwitchCase = function(node, st, c2) {
  if (node.test) {
    c2(node.test, st, "Expression");
  }
  for (var i2 = 0, list2 = node.consequent; i2 < list2.length; i2 += 1) {
    var cons = list2[i2];
    c2(cons, st, "Statement");
  }
};
base.ReturnStatement = base.YieldExpression = base.AwaitExpression = function(node, st, c2) {
  if (node.argument) {
    c2(node.argument, st, "Expression");
  }
};
base.ThrowStatement = base.SpreadElement = function(node, st, c2) {
  return c2(node.argument, st, "Expression");
};
base.TryStatement = function(node, st, c2) {
  c2(node.block, st, "Statement");
  if (node.handler) {
    c2(node.handler, st);
  }
  if (node.finalizer) {
    c2(node.finalizer, st, "Statement");
  }
};
base.CatchClause = function(node, st, c2) {
  if (node.param) {
    c2(node.param, st, "Pattern");
  }
  c2(node.body, st, "Statement");
};
base.WhileStatement = base.DoWhileStatement = function(node, st, c2) {
  c2(node.test, st, "Expression");
  c2(node.body, st, "Statement");
};
base.ForStatement = function(node, st, c2) {
  if (node.init) {
    c2(node.init, st, "ForInit");
  }
  if (node.test) {
    c2(node.test, st, "Expression");
  }
  if (node.update) {
    c2(node.update, st, "Expression");
  }
  c2(node.body, st, "Statement");
};
base.ForInStatement = base.ForOfStatement = function(node, st, c2) {
  c2(node.left, st, "ForInit");
  c2(node.right, st, "Expression");
  c2(node.body, st, "Statement");
};
base.ForInit = function(node, st, c2) {
  if (node.type === "VariableDeclaration") {
    c2(node, st);
  } else {
    c2(node, st, "Expression");
  }
};
base.DebuggerStatement = ignore;
base.FunctionDeclaration = function(node, st, c2) {
  return c2(node, st, "Function");
};
base.VariableDeclaration = function(node, st, c2) {
  for (var i2 = 0, list2 = node.declarations; i2 < list2.length; i2 += 1) {
    var decl = list2[i2];
    c2(decl, st);
  }
};
base.VariableDeclarator = function(node, st, c2) {
  c2(node.id, st, "Pattern");
  if (node.init) {
    c2(node.init, st, "Expression");
  }
};
base.Function = function(node, st, c2) {
  if (node.id) {
    c2(node.id, st, "Pattern");
  }
  for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    c2(param, st, "Pattern");
  }
  c2(node.body, st, node.expression ? "Expression" : "Statement");
};
base.Pattern = function(node, st, c2) {
  if (node.type === "Identifier") {
    c2(node, st, "VariablePattern");
  } else if (node.type === "MemberExpression") {
    c2(node, st, "MemberPattern");
  } else {
    c2(node, st);
  }
};
base.VariablePattern = ignore;
base.MemberPattern = skipThrough;
base.RestElement = function(node, st, c2) {
  return c2(node.argument, st, "Pattern");
};
base.ArrayPattern = function(node, st, c2) {
  for (var i2 = 0, list2 = node.elements; i2 < list2.length; i2 += 1) {
    var elt = list2[i2];
    if (elt) {
      c2(elt, st, "Pattern");
    }
  }
};
base.ObjectPattern = function(node, st, c2) {
  for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
    var prop = list2[i2];
    if (prop.type === "Property") {
      if (prop.computed) {
        c2(prop.key, st, "Expression");
      }
      c2(prop.value, st, "Pattern");
    } else if (prop.type === "RestElement") {
      c2(prop.argument, st, "Pattern");
    }
  }
};
base.Expression = skipThrough;
base.ThisExpression = base.Super = base.MetaProperty = ignore;
base.ArrayExpression = function(node, st, c2) {
  for (var i2 = 0, list2 = node.elements; i2 < list2.length; i2 += 1) {
    var elt = list2[i2];
    if (elt) {
      c2(elt, st, "Expression");
    }
  }
};
base.ObjectExpression = function(node, st, c2) {
  for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
    var prop = list2[i2];
    c2(prop, st);
  }
};
base.FunctionExpression = base.ArrowFunctionExpression = base.FunctionDeclaration;
base.SequenceExpression = function(node, st, c2) {
  for (var i2 = 0, list2 = node.expressions; i2 < list2.length; i2 += 1) {
    var expr = list2[i2];
    c2(expr, st, "Expression");
  }
};
base.TemplateLiteral = function(node, st, c2) {
  for (var i2 = 0, list2 = node.quasis; i2 < list2.length; i2 += 1) {
    var quasi = list2[i2];
    c2(quasi, st);
  }
  for (var i$1 = 0, list$1 = node.expressions; i$1 < list$1.length; i$1 += 1) {
    var expr = list$1[i$1];
    c2(expr, st, "Expression");
  }
};
base.TemplateElement = ignore;
base.UnaryExpression = base.UpdateExpression = function(node, st, c2) {
  c2(node.argument, st, "Expression");
};
base.BinaryExpression = base.LogicalExpression = function(node, st, c2) {
  c2(node.left, st, "Expression");
  c2(node.right, st, "Expression");
};
base.AssignmentExpression = base.AssignmentPattern = function(node, st, c2) {
  c2(node.left, st, "Pattern");
  c2(node.right, st, "Expression");
};
base.ConditionalExpression = function(node, st, c2) {
  c2(node.test, st, "Expression");
  c2(node.consequent, st, "Expression");
  c2(node.alternate, st, "Expression");
};
base.NewExpression = base.CallExpression = function(node, st, c2) {
  c2(node.callee, st, "Expression");
  if (node.arguments) {
    for (var i2 = 0, list2 = node.arguments; i2 < list2.length; i2 += 1) {
      var arg = list2[i2];
      c2(arg, st, "Expression");
    }
  }
};
base.MemberExpression = function(node, st, c2) {
  c2(node.object, st, "Expression");
  if (node.computed) {
    c2(node.property, st, "Expression");
  }
};
base.ExportNamedDeclaration = base.ExportDefaultDeclaration = function(node, st, c2) {
  if (node.declaration) {
    c2(node.declaration, st, node.type === "ExportNamedDeclaration" || node.declaration.id ? "Statement" : "Expression");
  }
  if (node.source) {
    c2(node.source, st, "Expression");
  }
};
base.ExportAllDeclaration = function(node, st, c2) {
  if (node.exported) {
    c2(node.exported, st);
  }
  c2(node.source, st, "Expression");
};
base.ImportDeclaration = function(node, st, c2) {
  for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
    var spec = list2[i2];
    c2(spec, st);
  }
  c2(node.source, st, "Expression");
};
base.ImportExpression = function(node, st, c2) {
  c2(node.source, st, "Expression");
};
base.ImportSpecifier = base.ImportDefaultSpecifier = base.ImportNamespaceSpecifier = base.Identifier = base.PrivateIdentifier = base.Literal = ignore;
base.TaggedTemplateExpression = function(node, st, c2) {
  c2(node.tag, st, "Expression");
  c2(node.quasi, st, "Expression");
};
base.ClassDeclaration = base.ClassExpression = function(node, st, c2) {
  return c2(node, st, "Class");
};
base.Class = function(node, st, c2) {
  if (node.id) {
    c2(node.id, st, "Pattern");
  }
  if (node.superClass) {
    c2(node.superClass, st, "Expression");
  }
  c2(node.body, st);
};
base.ClassBody = function(node, st, c2) {
  for (var i2 = 0, list2 = node.body; i2 < list2.length; i2 += 1) {
    var elt = list2[i2];
    c2(elt, st);
  }
};
base.MethodDefinition = base.PropertyDefinition = base.Property = function(node, st, c2) {
  if (node.computed) {
    c2(node.key, st, "Expression");
  }
  if (node.value) {
    c2(node.value, st, "Expression");
  }
};
const defaultGlobals = /* @__PURE__ */ new Set([
  "AbortController",
  "Array",
  "ArrayBuffer",
  "atob",
  "AudioContext",
  "Blob",
  "Boolean",
  "BigInt",
  "btoa",
  "clearInterval",
  "clearTimeout",
  "console",
  "crypto",
  "CustomEvent",
  "DataView",
  "Date",
  "decodeURI",
  "decodeURIComponent",
  "devicePixelRatio",
  "document",
  "encodeURI",
  "encodeURIComponent",
  "Error",
  "escape",
  "eval",
  "fetch",
  "File",
  "FileList",
  "FileReader",
  "Float32Array",
  "Float64Array",
  "Function",
  "Headers",
  "Image",
  "ImageData",
  "Infinity",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "Intl",
  "isFinite",
  "isNaN",
  "JSON",
  "Map",
  "Math",
  "NaN",
  "Number",
  "navigator",
  "Object",
  "parseFloat",
  "parseInt",
  "performance",
  "Path2D",
  "Promise",
  "Proxy",
  "RangeError",
  "ReferenceError",
  "Reflect",
  "RegExp",
  "cancelAnimationFrame",
  "requestAnimationFrame",
  "Set",
  "setInterval",
  "setTimeout",
  "String",
  "Symbol",
  "SyntaxError",
  "TextDecoder",
  "TextEncoder",
  "this",
  "TypeError",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "undefined",
  "unescape",
  "URIError",
  "URL",
  "WeakMap",
  "WeakSet",
  "WebSocket",
  "Worker",
  "window"
]);
const renkonGlobals = /* @__PURE__ */ new Set([
  "Events",
  "Behaviors",
  "Renkon"
]);
const globals = Object.fromEntries([...defaultGlobals.union(renkonGlobals)].map((k2) => [k2, false]));
function syntaxError(message, node, input) {
  const { line, column } = getLineInfo(input, node.start);
  return new SyntaxError(`${message} (${line}:${column})`);
}
function checkAssignments(node, references, input) {
  function checkConst(node2) {
    switch (node2.type) {
      case "Identifier":
        if (references.includes(node2)) throw syntaxError(`Assignment to external variable '${node2.name}'`, node2, input);
        if (globals[node2.name] === false) throw syntaxError(`Assignment to global '${node2.name}'`, node2, input);
        break;
      case "ObjectPattern":
        node2.properties.forEach((node3) => checkConst(node3.type === "Property" ? node3.value : node3));
        break;
      case "ArrayPattern":
        node2.elements.forEach((node3) => node3 && checkConst(node3));
        break;
      case "RestElement":
        checkConst(node2.argument);
        break;
    }
  }
  function checkConstLeft({ left }) {
    checkConst(left);
  }
  function checkConstArgument({ argument }) {
    checkConst(argument);
  }
  simple(node, {
    AssignmentExpression: checkConstLeft,
    AssignmentPattern: checkConstLeft,
    UpdateExpression: checkConstArgument,
    ForOfStatement: checkConstLeft,
    ForInStatement: checkConstLeft
  });
}
function findDeclarations(node, input) {
  var _a2, _b2;
  const declarations = [];
  function declareLocal(node2) {
    if (globals[node2.name] === false || node2.name === "arguments") {
      throw syntaxError(`Global '${node2.name}' cannot be redefined`, node2, input);
    }
    declarations.push(node2);
  }
  function declarePattern(node2) {
    switch (node2.type) {
      case "Identifier":
        declareLocal(node2);
        break;
      case "ObjectPattern":
        node2.properties.forEach((node3) => declarePattern(node3.type === "Property" ? node3.value : node3));
        break;
      case "ArrayPattern":
        node2.elements.forEach((node3) => node3 && declarePattern(node3));
        break;
      case "RestElement":
        declarePattern(node2.argument);
        break;
      case "AssignmentPattern":
        declarePattern(node2.left);
        break;
    }
  }
  for (const child of node.body) {
    switch (child.type) {
      case "VariableDeclaration":
        child.declarations.forEach((node2) => declarePattern(node2.id));
        break;
      case "ClassDeclaration":
      case "FunctionDeclaration":
        declareLocal(child.id);
        break;
      case "ImportDeclaration":
        child.specifiers.forEach((node2) => declareLocal(node2.local));
        break;
      case "ExportNamedDeclaration":
        if (((_a2 = child.declaration) == null ? void 0 : _a2.type) === "VariableDeclaration") {
          child.declaration.declarations.forEach((node2) => declarePattern(node2.id));
        } else if (((_b2 = child.declaration) == null ? void 0 : _b2.type) === "FunctionDeclaration") {
          declareLocal(child.declaration.id);
        }
    }
  }
  return declarations;
}
function findTopLevelDeclarations(node) {
  var _a2, _b2;
  const declarations = [];
  function declareLocal(node2) {
    declarations.push(node2.name);
  }
  function declarePattern(node2) {
    switch (node2.type) {
      case "Identifier":
        declareLocal(node2);
        break;
      case "ObjectPattern":
        node2.properties.forEach((node3) => declarePattern(node3.type === "Property" ? node3.value : node3));
        break;
      case "ArrayPattern":
        node2.elements.forEach((node3) => node3 && declarePattern(node3));
        break;
      case "RestElement":
        declarePattern(node2.argument);
        break;
      case "AssignmentPattern":
        declarePattern(node2.left);
        break;
    }
  }
  switch (node.type) {
    case "VariableDeclaration":
      node.declarations.forEach((child) => declarePattern(child.id));
      break;
    case "ClassDeclaration":
    case "FunctionDeclaration":
      declareLocal(node.id);
      break;
    case "ExportNamedDeclaration":
      if (((_a2 = node.declaration) == null ? void 0 : _a2.type) === "VariableDeclaration") {
        node.declaration.declarations.forEach((child) => declarePattern(child.id));
      } else if (((_b2 = node.declaration) == null ? void 0 : _b2.type) === "FunctionDeclaration") {
        declareLocal(node.declaration.id);
      }
  }
  return declarations;
}
function isScope(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration" || node.type === "ArrowFunctionExpression" || node.type === "Program";
}
function isBlockScope(node) {
  return node.type === "BlockStatement" || node.type === "SwitchStatement" || node.type === "ForInStatement" || node.type === "ForOfStatement" || node.type === "ForStatement" || isScope(node);
}
function isCombinatorOf(node, cls, sels) {
  const callee = node.callee;
  const names = cls === "Any" ? ["Behaviors", "Events"] : [cls];
  if (callee.type === "MemberExpression" && callee.object.type === "Identifier") {
    if (names.includes(callee.object.name)) {
      if (callee.property.type === "Identifier" && (sels === "any" || sels.includes(callee.property.name))) {
        return true;
      }
    }
  }
  return false;
}
function findReferences(node, { filterDeclaration = () => true } = {}) {
  const locals = /* @__PURE__ */ new Map();
  const references = [];
  const sendTarget = [];
  function hasLocal(node2, name) {
    const l2 = locals.get(node2);
    return l2 ? l2.has(name) : false;
  }
  function declareLocal(node2, id) {
    if (!filterDeclaration(id)) return;
    const l2 = locals.get(node2);
    if (l2) l2.add(id.name);
    else locals.set(node2, /* @__PURE__ */ new Set([id.name]));
  }
  function declareClass(node2) {
    if (node2.id) declareLocal(node2, node2.id);
  }
  function declareFunction(node2) {
    node2.params.forEach((param) => declarePattern(param, node2));
    if (node2.id) declareLocal(node2, node2.id);
    if (node2.type !== "ArrowFunctionExpression") declareLocal(node2, { name: "arguments" });
  }
  function declareCatchClause(node2) {
    if (node2.param) declarePattern(node2.param, node2);
  }
  function declarePattern(node2, parent) {
    switch (node2.type) {
      case "Identifier":
        declareLocal(parent, node2);
        break;
      case "ObjectPattern":
        node2.properties.forEach((node3) => declarePattern(node3.type === "Property" ? node3.value : node3, parent));
        break;
      case "ArrayPattern":
        node2.elements.forEach((node3) => node3 && declarePattern(node3, parent));
        break;
      case "RestElement":
        declarePattern(node2.argument, parent);
        break;
      case "AssignmentPattern":
        declarePattern(node2.left, parent);
        break;
    }
  }
  ancestor(node, {
    VariableDeclaration(node2, _state, parents) {
      let parent = null;
      for (let i2 = parents.length - 1; i2 >= 0 && parent === null; --i2) {
        if (node2.kind === "var" ? isScope(parents[i2]) : isBlockScope(parents[i2])) {
          parent = parents[i2];
        }
      }
      node2.declarations.forEach((declaration) => declarePattern(declaration.id, parent));
    },
    FunctionDeclaration(node2, _state, parents) {
      let parent = null;
      for (let i2 = parents.length - 2; i2 >= 0 && parent === null; --i2) {
        if (isScope(parents[i2])) {
          parent = parents[i2];
        }
      }
      if (node2.id) declareLocal(parent, node2.id);
      declareFunction(node2);
    },
    FunctionExpression: declareFunction,
    ArrowFunctionExpression: declareFunction,
    ClassDeclaration(node2, _state, parents) {
      let parent = null;
      for (let i2 = parents.length - 2; i2 >= 0 && parent === null; --i2) {
        if (isScope(parents[i2])) {
          parent = parents[i2];
        }
      }
      if (node2.id) declareLocal(parent, node2.id);
    },
    ClassExpression: declareClass,
    CatchClause: declareCatchClause,
    ImportDeclaration(node2, _state, [root]) {
      node2.specifiers.forEach((specifier) => declareLocal(root, specifier.local));
    },
    CallExpression(node2) {
      if (isCombinatorOf(node2, "Events", ["send"])) {
        const arg = node2.arguments[0];
        if (arg.type === "Identifier") {
          sendTarget.push(arg);
        }
      }
    }
  });
  function identifier(node2, _state, parents) {
    const name = node2.name;
    if (name === "undefined") return;
    for (let i2 = parents.length - 2; i2 >= 0; --i2) {
      if (hasLocal(parents[i2], name)) {
        return;
      }
    }
    if (globals[name] !== false) {
      references.push(node2);
    }
  }
  ancestor(node, {
    Pattern(node2, state, parents) {
      if (node2.type === "Identifier") {
        identifier(node2, state, parents);
      }
    },
    Identifier: identifier
  });
  const forceVars = [];
  const extraType = {};
  simple(node, {
    CallExpression(node2) {
      if (isCombinatorOf(node2, "Events", ["or", "_or_index", "some"])) {
        for (const arg of node2.arguments) {
          if (arg.type === "Identifier") {
            forceVars.push(arg);
          }
        }
      } else if (isCombinatorOf(node2, "Behaviors", ["collect"])) {
        const arg = node2.arguments[1];
        if (arg.type === "Identifier") {
          forceVars.push(arg);
        }
      } else if (isCombinatorOf(node2, "Behaviors", ["_select"])) {
        if (node2.arguments[1].type === "Identifier") {
          const name = node2.arguments[1].name;
          if (/^_[0-9]/.exec(name)) {
            forceVars.push(node2.arguments[1]);
          }
          extraType["isSelect"] = true;
        }
      } else if (isCombinatorOf(node2, "Behaviors", ["gather"])) {
        extraType["gather"] = node2.arguments[0].value;
      } else if (isCombinatorOf(node2, "Behaviors", ["or", "_or_index", "some"])) {
        for (const arg of node2.arguments) {
          if (arg.type === "Identifier") {
            forceVars.push(arg);
          }
        }
      }
    }
  });
  return [references, forceVars, sendTarget, extraType];
}
function checkNested(body, baseId) {
  const rewriteSpecs = [];
  ancestor(body, {
    CallExpression(node, ancestors) {
      const inFunction = hasFunctionDeclaration(node, ancestors);
      const isEmbeddedCombinator = isNonTopCombinator(node, ancestors);
      const isSelectCall = isSelect(node);
      const isOrCall = isOr(node);
      if (isSelectCall) {
        const rewrite = rewriteSelect(node);
        rewriteSpecs.unshift(rewrite);
      }
      if (isOrCall) {
        const rewrites = rewriteOr(node, baseId, rewriteSpecs);
        rewriteSpecs.push(...rewrites);
      }
      if (isEmbeddedCombinator && !inFunction) {
        rewriteSpecs.push({ start: node.start, end: node.end, name: `_${baseId}_${rewriteSpecs.length}`, type: "range" });
      }
    },
    VariableDeclarator(node, ancestors) {
      if (isTopObjectDeclaration(node, ancestors) && node.init) {
        const baseName = `_${baseId}_${rewriteSpecs.length}`;
        rewriteSpecs.push({ start: node.init.start, end: node.init.end, name: baseName, type: "range" });
        const id = node.id;
        const properties = id.properties;
        for (const property of properties) {
          if (property.type === "RestElement") {
            console.log("unsupported style of assignment");
            continue;
          }
          const p2 = property;
          if (p2.value.type === "Identifier" && p2.key.type === "Identifier") {
            rewriteSpecs.push({ definition: `const ${p2.value.name} = ${baseName}.${p2.key.name}`, type: "override" });
          } else {
            console.log("unsupported style of assignment");
          }
        }
      }
      if (isTopArrayDeclaration(node, ancestors) && node.init) {
        const baseName = `_${baseId}_${rewriteSpecs.length}`;
        rewriteSpecs.push({ start: node.init.start, end: node.init.end, name: baseName, type: "range" });
        const id = node.id;
        const elements = id.elements;
        for (let ind = 0; ind < elements.length; ind++) {
          const element = elements[ind];
          if (!element) {
            return;
          }
          if (element.type === "RestElement") {
            console.log("unsupported style of assignment");
            continue;
          }
          const p2 = element;
          if (p2.type === "Identifier") {
            rewriteSpecs.push({ definition: `const ${p2.name} = ${baseName}[${ind}]`, type: "override" });
          } else {
            console.log("unsupported style of assignment");
          }
        }
      }
    }
  });
  return rewriteSpecs;
}
function rewriteSelect(node, _ancestors) {
  const triggers = [];
  const funcs = [];
  for (let i2 = 1; i2 < node.arguments.length; i2 += 2) {
    triggers.push({ start: node.arguments[i2].start, end: node.arguments[i2].end });
  }
  for (let i2 = 2; i2 < node.arguments.length; i2 += 2) {
    funcs.push({ start: node.arguments[i2].start, end: node.arguments[i2].end });
  }
  const init = { start: node.arguments[0].start, end: node.arguments[0].end };
  const classType = node.callee.object.name === "Events" ? "Events" : "Behaviors";
  return { type: "select", classType, init, triggers, funcs };
}
function rewriteOr(node, baseId, rewriteSpecs) {
  const triggers = [];
  for (let i2 = 0; i2 < node.arguments.length; i2++) {
    const child = node.arguments[i2];
    if (child.type === "Identifier") {
      continue;
    }
    const maybeName = `_${baseId}_${triggers.length + rewriteSpecs.length}`;
    triggers.push({
      type: "range",
      name: maybeName,
      start: child.start,
      end: child.end
    });
  }
  return triggers;
}
function isNonTopCombinator(node, ancestors) {
  if (node.type !== "CallExpression") {
    return false;
  }
  return isCombinatorOf(node, "Any", "any") && ancestors.length > 2 && ancestors[ancestors.length - 2].type !== "VariableDeclarator";
}
function isSelect(node, _ancestors) {
  if (node.type !== "CallExpression") {
    return false;
  }
  return isCombinatorOf(node, "Any", ["select"]);
}
function isOr(node, _ancestors) {
  if (node.type !== "CallExpression") {
    return false;
  }
  return isCombinatorOf(node, "Any", ["or", "_or_index", "some"]);
}
function hasFunctionDeclaration(_node, ancestors) {
  return !!ancestors.find((a2) => a2.type === "ArrowFunctionExpression");
}
function isTopObjectDeclaration(node, ancestors) {
  return node.type === "VariableDeclarator" && node.id.type === "ObjectPattern" && ancestors.length === 3;
}
function isTopArrayDeclaration(node, ancestors) {
  return node.type === "VariableDeclarator" && node.id.type === "ArrayPattern" && ancestors.length === 3;
}
function a(t2, e) {
  for (var s = 0; s < e.length; s++) {
    var i2 = e[s];
    i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(t2, "symbol" == typeof (r = function(t3, e2) {
      if ("object" != typeof t3 || null === t3) return t3;
      var s2 = t3[Symbol.toPrimitive];
      if (void 0 !== s2) {
        var i3 = s2.call(t3, "string");
        if ("object" != typeof i3) return i3;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return String(t3);
    }(i2.key)) ? r : String(r), i2);
  }
  var r;
}
function n() {
  return n = Object.assign ? Object.assign.bind() : function(t2) {
    for (var e = 1; e < arguments.length; e++) {
      var s = arguments[e];
      for (var i2 in s) Object.prototype.hasOwnProperty.call(s, i2) && (t2[i2] = s[i2]);
    }
    return t2;
  }, n.apply(this, arguments);
}
function o(t2, e) {
  t2.prototype = Object.create(e.prototype), t2.prototype.constructor = t2, h(t2, e);
}
function h(t2, e) {
  return h = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e2) {
    return t3.__proto__ = e2, t3;
  }, h(t2, e);
}
function p(t2, e) {
  (null == e || e > t2.length) && (e = t2.length);
  for (var s = 0, i2 = new Array(e); s < e; s++) i2[s] = t2[s];
  return i2;
}
function c(t2, e) {
  var s = "undefined" != typeof Symbol && t2[Symbol.iterator] || t2["@@iterator"];
  if (s) return (s = s.call(t2)).next.bind(s);
  if (Array.isArray(t2) || (s = function(t3, e2) {
    if (t3) {
      if ("string" == typeof t3) return p(t3, e2);
      var s2 = Object.prototype.toString.call(t3).slice(8, -1);
      return "Object" === s2 && t3.constructor && (s2 = t3.constructor.name), "Map" === s2 || "Set" === s2 ? Array.from(t3) : "Arguments" === s2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s2) ? p(t3, e2) : void 0;
    }
  }(t2)) || e) {
    s && (t2 = s);
    var i2 = 0;
    return function() {
      return i2 >= t2.length ? { done: true } : { done: false, value: t2[i2++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var l = true;
function u(t2, e) {
  return void 0 === e && (e = {}), new TokenType("name", e);
}
var d = /* @__PURE__ */ new WeakMap();
function m(t2) {
  var a2 = d.get(t2.Parser.acorn || t2);
  if (!a2) {
    var o2 = { assert: u(0, { startsExpr: l }), asserts: u(0, { startsExpr: l }), global: u(0, { startsExpr: l }), keyof: u(0, { startsExpr: l }), readonly: u(0, { startsExpr: l }), unique: u(0, { startsExpr: l }), abstract: u(0, { startsExpr: l }), declare: u(0, { startsExpr: l }), enum: u(0, { startsExpr: l }), module: u(0, { startsExpr: l }), namespace: u(0, { startsExpr: l }), interface: u(0, { startsExpr: l }), type: u(0, { startsExpr: l }) }, h2 = { at: new TokenType("@"), jsxName: new TokenType("jsxName"), jsxText: new TokenType("jsxText", { beforeExpr: true }), jsxTagStart: new TokenType("jsxTagStart", { startsExpr: true }), jsxTagEnd: new TokenType("jsxTagEnd") }, p2 = { tc_oTag: new TokContext("<tag", false, false), tc_cTag: new TokContext("</tag", false, false), tc_expr: new TokContext("<tag>...</tag>", true, true) }, c2 = new RegExp("^(?:" + Object.keys(o2).join("|") + ")$");
    h2.jsxTagStart.updateContext = function() {
      this.context.push(p2.tc_expr), this.context.push(p2.tc_oTag), this.exprAllowed = false;
    }, h2.jsxTagEnd.updateContext = function(t3) {
      var s = this.context.pop();
      s === p2.tc_oTag && t3 === types$1.slash || s === p2.tc_cTag ? (this.context.pop(), this.exprAllowed = this.curContext() === p2.tc_expr) : this.exprAllowed = true;
    }, a2 = { tokTypes: n({}, o2, h2), tokContexts: n({}, p2), keywordsRegExp: c2, tokenIsLiteralPropertyName: function(t3) {
      return [types$1.name, types$1.string, types$1.num].concat(Object.values(keywords), Object.values(o2)).includes(t3);
    }, tokenIsKeywordOrIdentifier: function(t3) {
      return [types$1.name].concat(Object.values(keywords), Object.values(o2)).includes(t3);
    }, tokenIsIdentifier: function(t3) {
      return [].concat(Object.values(o2), [types$1.name]).includes(t3);
    }, tokenIsTSDeclarationStart: function(t3) {
      return [o2.abstract, o2.declare, o2.enum, o2.module, o2.namespace, o2.interface, o2.type].includes(t3);
    }, tokenIsTSTypeOperator: function(t3) {
      return [o2.keyof, o2.readonly, o2.unique].includes(t3);
    }, tokenIsTemplate: function(t3) {
      return t3 === types$1.invalidTemplate;
    } };
  }
  return a2;
}
var f = 1024, y = new RegExp("(?:[^\\S\\n\\r\\u2028\\u2029]|\\/\\/.*|\\/\\*.*?\\*\\/)*", "y"), x = new RegExp("(?=(" + y.source + "))\\1" + /(?=[\n\r\u2028\u2029]|\/\*(?!.*?\*\/)|$)/.source, "y"), T = function() {
  this.shorthandAssign = void 0, this.trailingComma = void 0, this.parenthesizedAssign = void 0, this.parenthesizedBind = void 0, this.doubleProto = void 0, this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
function v(t2, e) {
  var s = e.key.name, i2 = t2[s], r = "true";
  return "MethodDefinition" !== e.type || "get" !== e.kind && "set" !== e.kind || (r = (e.static ? "s" : "i") + e.kind), "iget" === i2 && "iset" === r || "iset" === i2 && "iget" === r || "sget" === i2 && "sset" === r || "sset" === i2 && "sget" === r ? (t2[s] = "true", false) : !!i2 || (t2[s] = r, false);
}
function P(t2, e) {
  var s = t2.key;
  return !t2.computed && ("Identifier" === s.type && s.name === e || "Literal" === s.type && s.value === e);
}
var b = { AbstractMethodHasImplementation: function(t2) {
  return "Method '" + t2.methodName + "' cannot have an implementation because it is marked abstract.";
}, AbstractPropertyHasInitializer: function(t2) {
  return "Property '" + t2.propertyName + "' cannot have an initializer because it is marked abstract.";
}, AccesorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.", AccesorCannotHaveTypeParameters: "An accessor cannot have type parameters.", CannotFindName: function(t2) {
  return "Cannot find name '" + t2.name + "'.";
}, ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.", ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.", ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference: "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.", ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.", DeclareAccessor: function(t2) {
  return "'declare' is not allowed in " + t2.kind + "ters.";
}, DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.", DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.", DuplicateAccessibilityModifier: function() {
  return "Accessibility modifier already seen.";
}, DuplicateModifier: function(t2) {
  return "Duplicate modifier: '" + t2.modifier + "'.";
}, EmptyHeritageClauseType: function(t2) {
  return "'" + t2.token + "' list cannot be empty.";
}, EmptyTypeArguments: "Type argument list cannot be empty.", EmptyTypeParameters: "Type parameter list cannot be empty.", ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.", ImportAliasHasImportType: "An import alias can not use 'import type'.", IncompatibleModifiers: function(t2) {
  var e = t2.modifiers;
  return "'" + e[0] + "' modifier cannot be used with '" + e[1] + "' modifier.";
}, IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.", IndexSignatureHasAccessibility: function(t2) {
  return "Index signatures cannot have an accessibility modifier ('" + t2.modifier + "').";
}, IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.", IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.", IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.", InitializerNotAllowedInAmbientContext: "Initializers are not allowed in ambient contexts.", InvalidModifierOnTypeMember: function(t2) {
  return "'" + t2.modifier + "' modifier cannot appear on a type member.";
}, InvalidModifierOnTypeParameter: function(t2) {
  return "'" + t2.modifier + "' modifier cannot appear on a type parameter.";
}, InvalidModifierOnTypeParameterPositions: function(t2) {
  return "'" + t2.modifier + "' modifier can only appear on a type parameter of a class, interface or type alias.";
}, InvalidModifiersOrder: function(t2) {
  var e = t2.orderedModifiers;
  return "'" + e[0] + "' modifier must precede '" + e[1] + "' modifier.";
}, InvalidPropertyAccessAfterInstantiationExpression: "Invalid property access after an instantiation expression. You can either wrap the instantiation expression in parentheses, or delete the type arguments.", InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.", MissingInterfaceName: "'interface' declarations must be followed by an identifier.", MixedLabeledAndUnlabeledElements: "Tuple members must all have names or all not have names.", NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.", NonClassMethodPropertyHasAbstractModifer: "'abstract' modifier can only appear on a class, method, or property declaration.", OptionalTypeBeforeRequired: "A required element cannot follow an optional element.", OverrideNotInSubClass: "This member cannot have an 'override' modifier because its containing class does not extend another class.", PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.", PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.", PrivateElementHasAccessibility: function(t2) {
  return "Private elements cannot have an accessibility modifier ('" + t2.modifier + "').";
}, PrivateMethodsHasAccessibility: function(t2) {
  return "Private methods cannot have an accessibility modifier ('" + t2.modifier + "').";
}, ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.", ReservedArrowTypeParam: "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.", ReservedTypeAssertion: "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.", SetAccesorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.", SetAccesorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.", SetAccesorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.", SingleTypeParameterWithoutTrailingComma: function(t2) {
  var e = t2.typeParameterName;
  return "Single type parameter " + e + " should have a trailing comma. Example usage: <" + e + ",>.";
}, StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.", TypeAnnotationAfterAssign: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.", TypeImportCannotSpecifyDefaultAndNamed: "A type-only import can specify a default import or named bindings, but not both.", TypeModifierIsUsedInTypeExports: "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.", TypeModifierIsUsedInTypeImports: "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.", UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.", UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.", GenericsEndWithComma: "Trailing comma is not allowed at the end of generics.", UnexpectedTypeAnnotation: "Did not expect a type annotation here.", UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.", UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.", UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.", UnsupportedSignatureParameterKind: function(t2) {
  return "Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got " + t2.type + ".";
}, LetInLexicalBinding: "'let' is not allowed to be used as a name in 'let' or 'const' declarations." }, g = { quot: '"', amp: "&", apos: "'", lt: "<", gt: ">", nbsp: " ", iexcl: "¡", cent: "¢", pound: "£", curren: "¤", yen: "¥", brvbar: "¦", sect: "§", uml: "¨", copy: "©", ordf: "ª", laquo: "«", not: "¬", shy: "­", reg: "®", macr: "¯", deg: "°", plusmn: "±", sup2: "²", sup3: "³", acute: "´", micro: "µ", para: "¶", middot: "·", cedil: "¸", sup1: "¹", ordm: "º", raquo: "»", frac14: "¼", frac12: "½", frac34: "¾", iquest: "¿", Agrave: "À", Aacute: "Á", Acirc: "Â", Atilde: "Ã", Auml: "Ä", Aring: "Å", AElig: "Æ", Ccedil: "Ç", Egrave: "È", Eacute: "É", Ecirc: "Ê", Euml: "Ë", Igrave: "Ì", Iacute: "Í", Icirc: "Î", Iuml: "Ï", ETH: "Ð", Ntilde: "Ñ", Ograve: "Ò", Oacute: "Ó", Ocirc: "Ô", Otilde: "Õ", Ouml: "Ö", times: "×", Oslash: "Ø", Ugrave: "Ù", Uacute: "Ú", Ucirc: "Û", Uuml: "Ü", Yacute: "Ý", THORN: "Þ", szlig: "ß", agrave: "à", aacute: "á", acirc: "â", atilde: "ã", auml: "ä", aring: "å", aelig: "æ", ccedil: "ç", egrave: "è", eacute: "é", ecirc: "ê", euml: "ë", igrave: "ì", iacute: "í", icirc: "î", iuml: "ï", eth: "ð", ntilde: "ñ", ograve: "ò", oacute: "ó", ocirc: "ô", otilde: "õ", ouml: "ö", divide: "÷", oslash: "ø", ugrave: "ù", uacute: "ú", ucirc: "û", uuml: "ü", yacute: "ý", thorn: "þ", yuml: "ÿ", OElig: "Œ", oelig: "œ", Scaron: "Š", scaron: "š", Yuml: "Ÿ", fnof: "ƒ", circ: "ˆ", tilde: "˜", Alpha: "Α", Beta: "Β", Gamma: "Γ", Delta: "Δ", Epsilon: "Ε", Zeta: "Ζ", Eta: "Η", Theta: "Θ", Iota: "Ι", Kappa: "Κ", Lambda: "Λ", Mu: "Μ", Nu: "Ν", Xi: "Ξ", Omicron: "Ο", Pi: "Π", Rho: "Ρ", Sigma: "Σ", Tau: "Τ", Upsilon: "Υ", Phi: "Φ", Chi: "Χ", Psi: "Ψ", Omega: "Ω", alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", omicron: "ο", pi: "π", rho: "ρ", sigmaf: "ς", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", chi: "χ", psi: "ψ", omega: "ω", thetasym: "ϑ", upsih: "ϒ", piv: "ϖ", ensp: " ", emsp: " ", thinsp: " ", zwnj: "‌", zwj: "‍", lrm: "‎", rlm: "‏", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", sbquo: "‚", ldquo: "“", rdquo: "”", bdquo: "„", dagger: "†", Dagger: "‡", bull: "•", hellip: "…", permil: "‰", prime: "′", Prime: "″", lsaquo: "‹", rsaquo: "›", oline: "‾", frasl: "⁄", euro: "€", image: "ℑ", weierp: "℘", real: "ℜ", trade: "™", alefsym: "ℵ", larr: "←", uarr: "↑", rarr: "→", darr: "↓", harr: "↔", crarr: "↵", lArr: "⇐", uArr: "⇑", rArr: "⇒", dArr: "⇓", hArr: "⇔", forall: "∀", part: "∂", exist: "∃", empty: "∅", nabla: "∇", isin: "∈", notin: "∉", ni: "∋", prod: "∏", sum: "∑", minus: "−", lowast: "∗", radic: "√", prop: "∝", infin: "∞", ang: "∠", and: "∧", or: "∨", cap: "∩", cup: "∪", int: "∫", there4: "∴", sim: "∼", cong: "≅", asymp: "≈", ne: "≠", equiv: "≡", le: "≤", ge: "≥", sub: "⊂", sup: "⊃", nsub: "⊄", sube: "⊆", supe: "⊇", oplus: "⊕", otimes: "⊗", perp: "⊥", sdot: "⋅", lceil: "⌈", rceil: "⌉", lfloor: "⌊", rfloor: "⌋", lang: "〈", rang: "〉", loz: "◊", spades: "♠", clubs: "♣", hearts: "♥", diams: "♦" }, A = /^[\da-fA-F]+$/, S = /^\d+$/;
function C(t2) {
  return t2 ? "JSXIdentifier" === t2.type ? t2.name : "JSXNamespacedName" === t2.type ? t2.namespace.name + ":" + t2.name.name : "JSXMemberExpression" === t2.type ? C(t2.object) + "." + C(t2.property) : void 0 : t2;
}
var E = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
function k(t2) {
  if (!t2) throw new Error("Assert fail");
}
function I(t2) {
  return "accessor" === t2;
}
function N(t2) {
  return "in" === t2 || "out" === t2;
}
function w(t2, e) {
  return 2 | (t2 ? 4 : 0) | (e ? 8 : 0);
}
function L(t2) {
  if ("MemberExpression" !== t2.type) return false;
  var e = t2.property;
  return (!t2.computed || !("TemplateLiteral" !== e.type || e.expressions.length > 0)) && M(t2.object);
}
function M(t2) {
  return "Identifier" === t2.type || "MemberExpression" === t2.type && !t2.computed && M(t2.object);
}
function O(t2) {
  return "private" === t2 || "public" === t2 || "protected" === t2;
}
function D(e) {
  var s = {}, i2 = s.dts, r = void 0 !== i2 && i2, n2 = s.allowSatisfies, h2 = void 0 !== n2 && n2;
  return function(s2) {
    var i3 = s2.acorn || t, n3 = m(i3), p2 = i3.tokTypes, l2 = i3.keywordTypes, u2 = i3.isIdentifierStart, d2 = i3.lineBreak, y2 = i3.isNewLine, M2 = i3.tokContexts, D2 = i3.isIdentifierChar, _ = n3.tokTypes, R = n3.tokContexts, j = n3.keywordsRegExp, F = n3.tokenIsLiteralPropertyName, B = n3.tokenIsTemplate, H = n3.tokenIsTSDeclarationStart, q = n3.tokenIsIdentifier, U = n3.tokenIsKeywordOrIdentifier, V = n3.tokenIsTSTypeOperator;
    function K(t2, e2, s3) {
      void 0 === s3 && (s3 = t2.length);
      for (var i4 = e2; i4 < s3; i4++) {
        var r2 = t2.charCodeAt(i4);
        if (y2(r2)) return i4 < s3 - 1 && 13 === r2 && 10 === t2.charCodeAt(i4 + 1) ? i4 + 2 : i4 + 1;
      }
      return -1;
    }
    s2 = function(t2, e2, s3) {
      var i4 = s3.tokTypes, r2 = e2.tokTypes;
      return function(t3) {
        function e3() {
          return t3.apply(this, arguments) || this;
        }
        o(e3, t3);
        var s4 = e3.prototype;
        return s4.takeDecorators = function(t4) {
          var e4 = this.decoratorStack[this.decoratorStack.length - 1];
          e4.length && (t4.decorators = e4, this.resetStartLocationFromNode(t4, e4[0]), this.decoratorStack[this.decoratorStack.length - 1] = []);
        }, s4.parseDecorators = function(t4) {
          for (var e4 = this.decoratorStack[this.decoratorStack.length - 1]; this.match(r2.at); ) {
            var s5 = this.parseDecorator();
            e4.push(s5);
          }
          this.match(i4._export) ? t4 || this.unexpected() : this.canHaveLeadingDecorator() || this.raise(this.start, "Leading decorators must be attached to a class declaration.");
        }, s4.parseDecorator = function() {
          var t4 = this.startNode();
          this.next(), this.decoratorStack.push([]);
          var e4, s5 = this.start, r3 = this.startLoc;
          if (this.match(i4.parenL)) {
            var a2 = this.start, n4 = this.startLoc;
            if (this.next(), e4 = this.parseExpression(), this.expect(i4.parenR), this.options.preserveParens) {
              var o2 = this.startNodeAt(a2, n4);
              o2.expression = e4, e4 = this.finishNode(o2, "ParenthesizedExpression");
            }
          } else for (e4 = this.parseIdent(false); this.eat(i4.dot); ) {
            var h3 = this.startNodeAt(s5, r3);
            h3.object = e4, h3.property = this.parseIdent(true), h3.computed = false, e4 = this.finishNode(h3, "MemberExpression");
          }
          return t4.expression = this.parseMaybeDecoratorArguments(e4), this.decoratorStack.pop(), this.finishNode(t4, "Decorator");
        }, s4.parseMaybeDecoratorArguments = function(t4) {
          if (this.eat(i4.parenL)) {
            var e4 = this.startNodeAtNode(t4);
            return e4.callee = t4, e4.arguments = this.parseExprList(i4.parenR, false), this.finishNode(e4, "CallExpression");
          }
          return t4;
        }, e3;
      }(t2);
    }(s2, n3, i3), s2 = function(t2, e2, s3, i4) {
      var r2 = t2.tokTypes, a2 = e2.tokTypes, n4 = t2.isNewLine, h3 = t2.isIdentifierChar, p3 = Object.assign({ allowNamespaces: true, allowNamespacedObjects: true }, {});
      return function(t3) {
        function e3() {
          return t3.apply(this, arguments) || this;
        }
        o(e3, t3);
        var s4 = e3.prototype;
        return s4.jsx_readToken = function() {
          for (var t4 = "", e4 = this.pos; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated JSX contents");
            var s5 = this.input.charCodeAt(this.pos);
            switch (s5) {
              case 60:
              case 123:
                return this.pos === this.start ? 60 === s5 && this.exprAllowed ? (++this.pos, this.finishToken(a2.jsxTagStart)) : this.getTokenFromCode(s5) : (t4 += this.input.slice(e4, this.pos), this.finishToken(a2.jsxText, t4));
              case 38:
                t4 += this.input.slice(e4, this.pos), t4 += this.jsx_readEntity(), e4 = this.pos;
                break;
              case 62:
              case 125:
                this.raise(this.pos, "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (62 === s5 ? "&gt;" : "&rbrace;") + '` or `{"' + this.input[this.pos] + '"}`?');
              default:
                n4(s5) ? (t4 += this.input.slice(e4, this.pos), t4 += this.jsx_readNewLine(true), e4 = this.pos) : ++this.pos;
            }
          }
        }, s4.jsx_readNewLine = function(t4) {
          var e4, s5 = this.input.charCodeAt(this.pos);
          return ++this.pos, 13 === s5 && 10 === this.input.charCodeAt(this.pos) ? (++this.pos, e4 = t4 ? "\n" : "\r\n") : e4 = String.fromCharCode(s5), this.options.locations && (++this.curLine, this.lineStart = this.pos), e4;
        }, s4.jsx_readString = function(t4) {
          for (var e4 = "", s5 = ++this.pos; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
            var i5 = this.input.charCodeAt(this.pos);
            if (i5 === t4) break;
            38 === i5 ? (e4 += this.input.slice(s5, this.pos), e4 += this.jsx_readEntity(), s5 = this.pos) : n4(i5) ? (e4 += this.input.slice(s5, this.pos), e4 += this.jsx_readNewLine(false), s5 = this.pos) : ++this.pos;
          }
          return e4 += this.input.slice(s5, this.pos++), this.finishToken(r2.string, e4);
        }, s4.jsx_readEntity = function() {
          var t4, e4 = "", s5 = 0, i5 = this.input[this.pos];
          "&" !== i5 && this.raise(this.pos, "Entity must start with an ampersand");
          for (var r3 = ++this.pos; this.pos < this.input.length && s5++ < 10; ) {
            if (";" === (i5 = this.input[this.pos++])) {
              "#" === e4[0] ? "x" === e4[1] ? (e4 = e4.substr(2), A.test(e4) && (t4 = String.fromCharCode(parseInt(e4, 16)))) : (e4 = e4.substr(1), S.test(e4) && (t4 = String.fromCharCode(parseInt(e4, 10)))) : t4 = g[e4];
              break;
            }
            e4 += i5;
          }
          return t4 || (this.pos = r3, "&");
        }, s4.jsx_readWord = function() {
          var t4, e4 = this.pos;
          do {
            t4 = this.input.charCodeAt(++this.pos);
          } while (h3(t4) || 45 === t4);
          return this.finishToken(a2.jsxName, this.input.slice(e4, this.pos));
        }, s4.jsx_parseIdentifier = function() {
          var t4 = this.startNode();
          return this.type === a2.jsxName ? t4.name = this.value : this.type.keyword ? t4.name = this.type.keyword : this.unexpected(), this.next(), this.finishNode(t4, "JSXIdentifier");
        }, s4.jsx_parseNamespacedName = function() {
          var t4 = this.start, e4 = this.startLoc, s5 = this.jsx_parseIdentifier();
          if (!p3.allowNamespaces || !this.eat(r2.colon)) return s5;
          var i5 = this.startNodeAt(t4, e4);
          return i5.namespace = s5, i5.name = this.jsx_parseIdentifier(), this.finishNode(i5, "JSXNamespacedName");
        }, s4.jsx_parseElementName = function() {
          if (this.type === a2.jsxTagEnd) return "";
          var t4 = this.start, e4 = this.startLoc, s5 = this.jsx_parseNamespacedName();
          for (this.type !== r2.dot || "JSXNamespacedName" !== s5.type || p3.allowNamespacedObjects || this.unexpected(); this.eat(r2.dot); ) {
            var i5 = this.startNodeAt(t4, e4);
            i5.object = s5, i5.property = this.jsx_parseIdentifier(), s5 = this.finishNode(i5, "JSXMemberExpression");
          }
          return s5;
        }, s4.jsx_parseAttributeValue = function() {
          switch (this.type) {
            case r2.braceL:
              var t4 = this.jsx_parseExpressionContainer();
              return "JSXEmptyExpression" === t4.expression.type && this.raise(t4.start, "JSX attributes must only be assigned a non-empty expression"), t4;
            case a2.jsxTagStart:
            case r2.string:
              return this.parseExprAtom();
            default:
              this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
          }
        }, s4.jsx_parseEmptyExpression = function() {
          var t4 = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
          return this.finishNodeAt(t4, "JSXEmptyExpression", this.start, this.startLoc);
        }, s4.jsx_parseExpressionContainer = function() {
          var t4 = this.startNode();
          return this.next(), t4.expression = this.type === r2.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression(), this.expect(r2.braceR), this.finishNode(t4, "JSXExpressionContainer");
        }, s4.jsx_parseAttribute = function() {
          var t4 = this.startNode();
          return this.eat(r2.braceL) ? (this.expect(r2.ellipsis), t4.argument = this.parseMaybeAssign(), this.expect(r2.braceR), this.finishNode(t4, "JSXSpreadAttribute")) : (t4.name = this.jsx_parseNamespacedName(), t4.value = this.eat(r2.eq) ? this.jsx_parseAttributeValue() : null, this.finishNode(t4, "JSXAttribute"));
        }, s4.jsx_parseOpeningElementAt = function(t4, e4) {
          var s5 = this.startNodeAt(t4, e4);
          s5.attributes = [];
          var i5 = this.jsx_parseElementName();
          for (i5 && (s5.name = i5); this.type !== r2.slash && this.type !== a2.jsxTagEnd; ) s5.attributes.push(this.jsx_parseAttribute());
          return s5.selfClosing = this.eat(r2.slash), this.expect(a2.jsxTagEnd), this.finishNode(s5, i5 ? "JSXOpeningElement" : "JSXOpeningFragment");
        }, s4.jsx_parseClosingElementAt = function(t4, e4) {
          var s5 = this.startNodeAt(t4, e4), i5 = this.jsx_parseElementName();
          return i5 && (s5.name = i5), this.expect(a2.jsxTagEnd), this.finishNode(s5, i5 ? "JSXClosingElement" : "JSXClosingFragment");
        }, s4.jsx_parseElementAt = function(t4, e4) {
          var s5 = this.startNodeAt(t4, e4), i5 = [], n5 = this.jsx_parseOpeningElementAt(t4, e4), o2 = null;
          if (!n5.selfClosing) {
            t: for (; ; ) switch (this.type) {
              case a2.jsxTagStart:
                if (t4 = this.start, e4 = this.startLoc, this.next(), this.eat(r2.slash)) {
                  o2 = this.jsx_parseClosingElementAt(t4, e4);
                  break t;
                }
                i5.push(this.jsx_parseElementAt(t4, e4));
                break;
              case a2.jsxText:
                i5.push(this.parseExprAtom());
                break;
              case r2.braceL:
                i5.push(this.jsx_parseExpressionContainer());
                break;
              default:
                this.unexpected();
            }
            C(o2.name) !== C(n5.name) && this.raise(o2.start, "Expected corresponding JSX closing tag for <" + C(n5.name) + ">");
          }
          var h4 = n5.name ? "Element" : "Fragment";
          return s5["opening" + h4] = n5, s5["closing" + h4] = o2, s5.children = i5, this.type === r2.relational && "<" === this.value && this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag"), this.finishNode(s5, "JSX" + h4);
        }, s4.jsx_parseText = function() {
          var t4 = this.parseLiteral(this.value);
          return t4.type = "JSXText", t4;
        }, s4.jsx_parseElement = function() {
          var t4 = this.start, e4 = this.startLoc;
          return this.next(), this.jsx_parseElementAt(t4, e4);
        }, e3;
      }(s3);
    }(i3, n3, s2), s2 = function(t2, e2, s3) {
      var i4 = e2.tokTypes, r2 = s3.tokTypes;
      return function(t3) {
        function e3() {
          return t3.apply(this, arguments) || this;
        }
        o(e3, t3);
        var s4 = e3.prototype;
        return s4.parseMaybeImportAttributes = function(t4) {
          if (this.type === r2._with || this.type === i4.assert) {
            this.next();
            var e4 = this.parseImportAttributes();
            e4 && (t4.attributes = e4);
          }
        }, s4.parseImportAttributes = function() {
          this.expect(r2.braceL);
          var t4 = this.parseWithEntries();
          return this.expect(r2.braceR), t4;
        }, s4.parseWithEntries = function() {
          var t4 = [], e4 = /* @__PURE__ */ new Set();
          do {
            if (this.type === r2.braceR) break;
            var s5, i5 = this.startNode();
            s5 = this.type === r2.string ? this.parseLiteral(this.value) : this.parseIdent(true), this.next(), i5.key = s5, e4.has(i5.key.name) && this.raise(this.pos, "Duplicated key in attributes"), e4.add(i5.key.name), this.type !== r2.string && this.raise(this.pos, "Only string is supported as an attribute value"), i5.value = this.parseLiteral(this.value), t4.push(this.finishNode(i5, "ImportAttribute"));
          } while (this.eat(r2.comma));
          return t4;
        }, e3;
      }(t2);
    }(s2, n3, i3);
    var z = /* @__PURE__ */ function(t2) {
      function e2(e3, s4, i4) {
        var r2;
        return (r2 = t2.call(this, e3, s4, i4) || this).preValue = null, r2.preToken = null, r2.isLookahead = false, r2.isAmbientContext = false, r2.inAbstractClass = false, r2.inType = false, r2.inDisallowConditionalTypesContext = false, r2.maybeInArrowParameters = false, r2.shouldParseArrowReturnType = void 0, r2.shouldParseAsyncArrowReturnType = void 0, r2.decoratorStack = [[]], r2.importsStack = [[]], r2.importOrExportOuterKind = void 0, r2.tsParseConstModifier = r2.tsParseModifiers.bind(function(t3) {
          if (void 0 === t3) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return t3;
        }(r2), { allowedModifiers: ["const"], disallowedModifiers: ["in", "out"], errorTemplate: b.InvalidModifierOnTypeParameterPositions }), r2;
      }
      o(e2, t2);
      var s3, m2, g2, A2 = e2.prototype;
      return A2.getTokenFromCodeInType = function(e3) {
        return 62 === e3 || 60 === e3 ? this.finishOp(p2.relational, 1) : t2.prototype.getTokenFromCode.call(this, e3);
      }, A2.readToken = function(e3) {
        if (!this.inType) {
          var s4 = this.curContext();
          if (s4 === R.tc_expr) return this.jsx_readToken();
          if (s4 === R.tc_oTag || s4 === R.tc_cTag) {
            if (u2(e3)) return this.jsx_readWord();
            if (62 == e3) return ++this.pos, this.finishToken(_.jsxTagEnd);
            if ((34 === e3 || 39 === e3) && s4 == R.tc_oTag) return this.jsx_readString(e3);
          }
          if (60 === e3 && this.exprAllowed && 33 !== this.input.charCodeAt(this.pos + 1)) return ++this.pos, this.finishToken(_.jsxTagStart);
        }
        return t2.prototype.readToken.call(this, e3);
      }, A2.getTokenFromCode = function(e3) {
        return this.inType ? this.getTokenFromCodeInType(e3) : 64 === e3 ? (++this.pos, this.finishToken(_.at)) : t2.prototype.getTokenFromCode.call(this, e3);
      }, A2.isAbstractClass = function() {
        return this.ts_isContextual(_.abstract) && this.lookahead().type === p2._class;
      }, A2.finishNode = function(e3, s4) {
        return "" !== e3.type && 0 !== e3.end ? e3 : t2.prototype.finishNode.call(this, e3, s4);
      }, A2.tryParse = function(t3, e3) {
        void 0 === e3 && (e3 = this.cloneCurLookaheadState());
        var s4 = { node: null };
        try {
          return { node: t3(function(t4) {
            throw void 0 === t4 && (t4 = null), s4.node = t4, s4;
          }), error: null, thrown: false, aborted: false, failState: null };
        } catch (t4) {
          var i4 = this.getCurLookaheadState();
          if (this.setLookaheadState(e3), t4 instanceof SyntaxError) return { node: null, error: t4, thrown: true, aborted: false, failState: i4 };
          if (t4 === s4) return { node: s4.node, error: null, thrown: false, aborted: true, failState: i4 };
          throw t4;
        }
      }, A2.setOptionalParametersError = function(t3, e3) {
        var s4;
        t3.optionalParametersLoc = null != (s4 = null == e3 ? void 0 : e3.loc) ? s4 : this.startLoc;
      }, A2.reScan_lt_gt = function() {
        this.type === p2.relational && (this.pos -= 1, this.readToken_lt_gt(this.fullCharCodeAtPos()));
      }, A2.reScan_lt = function() {
        var t3 = this.type;
        return t3 === p2.bitShift ? (this.pos -= 2, this.finishOp(p2.relational, 1), p2.relational) : t3;
      }, A2.resetEndLocation = function(t3, e3) {
        void 0 === e3 && (e3 = this.lastTokEndLoc), t3.end = e3.column, t3.loc.end = e3, this.options.ranges && (t3.range[1] = e3.column);
      }, A2.startNodeAtNode = function(e3) {
        return t2.prototype.startNodeAt.call(this, e3.start, e3.loc.start);
      }, A2.nextTokenStart = function() {
        return this.nextTokenStartSince(this.pos);
      }, A2.tsHasSomeModifiers = function(t3, e3) {
        return e3.some(function(e4) {
          return O(e4) ? t3.accessibility === e4 : !!t3[e4];
        });
      }, A2.tsIsStartOfStaticBlocks = function() {
        return this.isContextual("static") && 123 === this.lookaheadCharCode();
      }, A2.tsCheckForInvalidTypeCasts = function(t3) {
        var e3 = this;
        t3.forEach(function(t4) {
          "TSTypeCastExpression" === (null == t4 ? void 0 : t4.type) && e3.raise(t4.typeAnnotation.start, b.UnexpectedTypeAnnotation);
        });
      }, A2.atPossibleAsyncArrow = function(t3) {
        return "Identifier" === t3.type && "async" === t3.name && this.lastTokEndLoc.column === t3.end && !this.canInsertSemicolon() && t3.end - t3.start == 5 && t3.start === this.potentialArrowAt;
      }, A2.tsIsIdentifier = function() {
        return q(this.type);
      }, A2.tsTryParseTypeOrTypePredicateAnnotation = function() {
        return this.match(p2.colon) ? this.tsParseTypeOrTypePredicateAnnotation(p2.colon) : void 0;
      }, A2.tsTryParseGenericAsyncArrowFunction = function(e3, s4, i4) {
        var r2 = this;
        if (this.tsMatchLeftRelational()) {
          var a2 = this.maybeInArrowParameters;
          this.maybeInArrowParameters = true;
          var n4 = this.tsTryParseAndCatch(function() {
            var i5 = r2.startNodeAt(e3, s4);
            return i5.typeParameters = r2.tsParseTypeParameters(), t2.prototype.parseFunctionParams.call(r2, i5), i5.returnType = r2.tsTryParseTypeOrTypePredicateAnnotation(), r2.expect(p2.arrow), i5;
          });
          if (this.maybeInArrowParameters = a2, n4) return t2.prototype.parseArrowExpression.call(this, n4, null, true, i4);
        }
      }, A2.tsParseTypeArgumentsInExpression = function() {
        if (this.reScan_lt() === p2.relational) return this.tsParseTypeArguments();
      }, A2.tsInNoContext = function(t3) {
        var e3 = this.context;
        this.context = [e3[0]];
        try {
          return t3();
        } finally {
          this.context = e3;
        }
      }, A2.tsTryParseTypeAnnotation = function() {
        return this.match(p2.colon) ? this.tsParseTypeAnnotation() : void 0;
      }, A2.isUnparsedContextual = function(t3, e3) {
        var s4 = t3 + e3.length;
        if (this.input.slice(t3, s4) === e3) {
          var i4 = this.input.charCodeAt(s4);
          return !(D2(i4) || 55296 == (64512 & i4));
        }
        return false;
      }, A2.isAbstractConstructorSignature = function() {
        return this.ts_isContextual(_.abstract) && this.lookahead().type === p2._new;
      }, A2.nextTokenStartSince = function(t3) {
        return E.lastIndex = t3, E.test(this.input) ? E.lastIndex : t3;
      }, A2.lookaheadCharCode = function() {
        return this.input.charCodeAt(this.nextTokenStart());
      }, A2.compareLookaheadState = function(t3, e3) {
        for (var s4 = 0, i4 = Object.keys(t3); s4 < i4.length; s4++) {
          var r2 = i4[s4];
          if (t3[r2] !== e3[r2]) return false;
        }
        return true;
      }, A2.createLookaheadState = function() {
        this.value = null, this.context = [this.curContext()];
      }, A2.getCurLookaheadState = function() {
        return { endLoc: this.endLoc, lastTokEnd: this.lastTokEnd, lastTokStart: this.lastTokStart, lastTokStartLoc: this.lastTokStartLoc, pos: this.pos, value: this.value, type: this.type, start: this.start, end: this.end, context: this.context, startLoc: this.startLoc, lastTokEndLoc: this.lastTokEndLoc, curLine: this.curLine, lineStart: this.lineStart, curPosition: this.curPosition, containsEsc: this.containsEsc };
      }, A2.cloneCurLookaheadState = function() {
        return { pos: this.pos, value: this.value, type: this.type, start: this.start, end: this.end, context: this.context && this.context.slice(), startLoc: this.startLoc, lastTokEndLoc: this.lastTokEndLoc, endLoc: this.endLoc, lastTokEnd: this.lastTokEnd, lastTokStart: this.lastTokStart, lastTokStartLoc: this.lastTokStartLoc, curLine: this.curLine, lineStart: this.lineStart, curPosition: this.curPosition, containsEsc: this.containsEsc };
      }, A2.setLookaheadState = function(t3) {
        this.pos = t3.pos, this.value = t3.value, this.endLoc = t3.endLoc, this.lastTokEnd = t3.lastTokEnd, this.lastTokStart = t3.lastTokStart, this.lastTokStartLoc = t3.lastTokStartLoc, this.type = t3.type, this.start = t3.start, this.end = t3.end, this.context = t3.context, this.startLoc = t3.startLoc, this.lastTokEndLoc = t3.lastTokEndLoc, this.curLine = t3.curLine, this.lineStart = t3.lineStart, this.curPosition = t3.curPosition, this.containsEsc = t3.containsEsc;
      }, A2.tsLookAhead = function(t3) {
        var e3 = this.getCurLookaheadState(), s4 = t3();
        return this.setLookaheadState(e3), s4;
      }, A2.lookahead = function(t3) {
        var e3 = this.getCurLookaheadState();
        if (this.createLookaheadState(), this.isLookahead = true, void 0 !== t3) for (var s4 = 0; s4 < t3; s4++) this.nextToken();
        else this.nextToken();
        this.isLookahead = false;
        var i4 = this.getCurLookaheadState();
        return this.setLookaheadState(e3), i4;
      }, A2.readWord = function() {
        var t3 = this.readWord1(), e3 = p2.name;
        return this.keywords.test(t3) ? e3 = l2[t3] : new RegExp(j).test(t3) && (e3 = _[t3]), this.finishToken(e3, t3);
      }, A2.skipBlockComment = function() {
        var t3;
        this.isLookahead || (t3 = this.options.onComment && this.curPosition());
        var e3 = this.pos, s4 = this.input.indexOf("*/", this.pos += 2);
        if (-1 === s4 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = s4 + 2, this.options.locations) for (var i4, r2 = e3; (i4 = K(this.input, r2, this.pos)) > -1; ) ++this.curLine, r2 = this.lineStart = i4;
        this.isLookahead || this.options.onComment && this.options.onComment(true, this.input.slice(e3 + 2, s4), e3, this.pos, t3, this.curPosition());
      }, A2.skipLineComment = function(t3) {
        var e3, s4 = this.pos;
        this.isLookahead || (e3 = this.options.onComment && this.curPosition());
        for (var i4 = this.input.charCodeAt(this.pos += t3); this.pos < this.input.length && !y2(i4); ) i4 = this.input.charCodeAt(++this.pos);
        this.isLookahead || this.options.onComment && this.options.onComment(false, this.input.slice(s4 + t3, this.pos), s4, this.pos, e3, this.curPosition());
      }, A2.finishToken = function(t3, e3) {
        this.preValue = this.value, this.preToken = this.type, this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
        var s4 = this.type;
        this.type = t3, this.value = e3, this.isLookahead || this.updateContext(s4);
      }, A2.resetStartLocation = function(t3, e3, s4) {
        t3.start = e3, t3.loc.start = s4, this.options.ranges && (t3.range[0] = e3);
      }, A2.isLineTerminator = function() {
        return this.eat(p2.semi) || t2.prototype.canInsertSemicolon.call(this);
      }, A2.hasFollowingLineBreak = function() {
        return x.lastIndex = this.end, x.test(this.input);
      }, A2.addExtra = function(t3, e3, s4, i4) {
        if (void 0 === i4 && (i4 = true), t3) {
          var r2 = t3.extra = t3.extra || {};
          i4 ? r2[e3] = s4 : Object.defineProperty(r2, e3, { enumerable: i4, value: s4 });
        }
      }, A2.isLiteralPropertyName = function() {
        return F(this.type);
      }, A2.hasPrecedingLineBreak = function() {
        return d2.test(this.input.slice(this.lastTokEndLoc.index, this.start));
      }, A2.createIdentifier = function(t3, e3) {
        return t3.name = e3, this.finishNode(t3, "Identifier");
      }, A2.resetStartLocationFromNode = function(t3, e3) {
        this.resetStartLocation(t3, e3.start, e3.loc.start);
      }, A2.isThisParam = function(t3) {
        return "Identifier" === t3.type && "this" === t3.name;
      }, A2.isLookaheadContextual = function(t3) {
        var e3 = this.nextTokenStart();
        return this.isUnparsedContextual(e3, t3);
      }, A2.ts_type_isContextual = function(t3, e3) {
        return t3 === e3 && !this.containsEsc;
      }, A2.ts_isContextual = function(t3) {
        return this.type === t3 && !this.containsEsc;
      }, A2.ts_isContextualWithState = function(t3, e3) {
        return t3.type === e3 && !t3.containsEsc;
      }, A2.isContextualWithState = function(t3, e3) {
        return e3.type === p2.name && e3.value === t3 && !e3.containsEsc;
      }, A2.tsIsStartOfMappedType = function() {
        return this.next(), this.eat(p2.plusMin) ? this.ts_isContextual(_.readonly) : (this.ts_isContextual(_.readonly) && this.next(), !!this.match(p2.bracketL) && (this.next(), !!this.tsIsIdentifier() && (this.next(), this.match(p2._in))));
      }, A2.tsInDisallowConditionalTypesContext = function(t3) {
        var e3 = this.inDisallowConditionalTypesContext;
        this.inDisallowConditionalTypesContext = true;
        try {
          return t3();
        } finally {
          this.inDisallowConditionalTypesContext = e3;
        }
      }, A2.tsTryParseType = function() {
        return this.tsEatThenParseType(p2.colon);
      }, A2.match = function(t3) {
        return this.type === t3;
      }, A2.matchJsx = function(t3) {
        return this.type === n3.tokTypes[t3];
      }, A2.ts_eatWithState = function(t3, e3, s4) {
        if (t3 === s4.type) {
          for (var i4 = 0; i4 < e3; i4++) this.next();
          return true;
        }
        return false;
      }, A2.ts_eatContextualWithState = function(t3, e3, s4) {
        if (j.test(t3)) {
          if (this.ts_isContextualWithState(s4, _[t3])) {
            for (var i4 = 0; i4 < e3; i4++) this.next();
            return true;
          }
          return false;
        }
        if (!this.isContextualWithState(t3, s4)) return false;
        for (var r2 = 0; r2 < e3; r2++) this.next();
        return true;
      }, A2.canHaveLeadingDecorator = function() {
        return this.match(p2._class);
      }, A2.eatContextual = function(e3) {
        return j.test(e3) ? !!this.ts_isContextual(_[e3]) && (this.next(), true) : t2.prototype.eatContextual.call(this, e3);
      }, A2.tsIsExternalModuleReference = function() {
        return this.isContextual("require") && 40 === this.lookaheadCharCode();
      }, A2.tsParseExternalModuleReference = function() {
        var t3 = this.startNode();
        return this.expectContextual("require"), this.expect(p2.parenL), this.match(p2.string) || this.unexpected(), t3.expression = this.parseExprAtom(), this.expect(p2.parenR), this.finishNode(t3, "TSExternalModuleReference");
      }, A2.tsParseEntityName = function(t3) {
        void 0 === t3 && (t3 = true);
        for (var e3 = this.parseIdent(t3); this.eat(p2.dot); ) {
          var s4 = this.startNodeAtNode(e3);
          s4.left = e3, s4.right = this.parseIdent(t3), e3 = this.finishNode(s4, "TSQualifiedName");
        }
        return e3;
      }, A2.tsParseEnumMember = function() {
        var t3 = this.startNode();
        return t3.id = this.match(p2.string) ? this.parseLiteral(this.value) : this.parseIdent(true), this.eat(p2.eq) && (t3.initializer = this.parseMaybeAssign()), this.finishNode(t3, "TSEnumMember");
      }, A2.tsParseEnumDeclaration = function(t3, e3) {
        return void 0 === e3 && (e3 = {}), e3.const && (t3.const = true), e3.declare && (t3.declare = true), this.expectContextual("enum"), t3.id = this.parseIdent(), this.checkLValSimple(t3.id), this.expect(p2.braceL), t3.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this)), this.expect(p2.braceR), this.finishNode(t3, "TSEnumDeclaration");
      }, A2.tsParseModuleBlock = function() {
        var e3 = this.startNode();
        for (t2.prototype.enterScope.call(this, 512), this.expect(p2.braceL), e3.body = []; this.type !== p2.braceR; ) {
          var s4 = this.parseStatement(null, true);
          e3.body.push(s4);
        }
        return this.next(), t2.prototype.exitScope.call(this), this.finishNode(e3, "TSModuleBlock");
      }, A2.tsParseAmbientExternalModuleDeclaration = function(e3) {
        return this.ts_isContextual(_.global) ? (e3.global = true, e3.id = this.parseIdent()) : this.match(p2.string) ? e3.id = this.parseLiteral(this.value) : this.unexpected(), this.match(p2.braceL) ? (t2.prototype.enterScope.call(this, f), e3.body = this.tsParseModuleBlock(), t2.prototype.exitScope.call(this)) : t2.prototype.semicolon.call(this), this.finishNode(e3, "TSModuleDeclaration");
      }, A2.tsTryParseDeclare = function(t3) {
        var e3 = this;
        if (!this.isLineTerminator()) {
          var s4, i4 = this.type;
          return this.isContextual("let") && (i4 = p2._var, s4 = "let"), this.tsInAmbientContext(function() {
            if (i4 === p2._function) return t3.declare = true, e3.parseFunctionStatement(t3, false, true);
            if (i4 === p2._class) return t3.declare = true, e3.parseClass(t3, true);
            if (i4 === _.enum) return e3.tsParseEnumDeclaration(t3, { declare: true });
            if (i4 === _.global) return e3.tsParseAmbientExternalModuleDeclaration(t3);
            if (i4 === p2._const || i4 === p2._var) return e3.match(p2._const) && e3.isLookaheadContextual("enum") ? (e3.expect(p2._const), e3.tsParseEnumDeclaration(t3, { const: true, declare: true })) : (t3.declare = true, e3.parseVarStatement(t3, s4 || e3.value, true));
            if (i4 === _.interface) {
              var r2 = e3.tsParseInterfaceDeclaration(t3, { declare: true });
              if (r2) return r2;
            }
            return q(i4) ? e3.tsParseDeclaration(t3, e3.value, true) : void 0;
          });
        }
      }, A2.tsIsListTerminator = function(t3) {
        switch (t3) {
          case "EnumMembers":
          case "TypeMembers":
            return this.match(p2.braceR);
          case "HeritageClauseElement":
            return this.match(p2.braceL);
          case "TupleElementTypes":
            return this.match(p2.bracketR);
          case "TypeParametersOrArguments":
            return this.tsMatchRightRelational();
        }
      }, A2.tsParseDelimitedListWorker = function(t3, e3, s4, i4) {
        for (var r2 = [], a2 = -1; !this.tsIsListTerminator(t3); ) {
          a2 = -1;
          var n4 = e3();
          if (null == n4) return;
          if (r2.push(n4), !this.eat(p2.comma)) {
            if (this.tsIsListTerminator(t3)) break;
            return void (s4 && this.expect(p2.comma));
          }
          a2 = this.lastTokStart;
        }
        return i4 && (i4.value = a2), r2;
      }, A2.tsParseDelimitedList = function(t3, e3, s4) {
        return function(t4) {
          if (null == t4) throw new Error("Unexpected " + t4 + " value.");
          return t4;
        }(this.tsParseDelimitedListWorker(t3, e3, true, s4));
      }, A2.tsParseBracketedList = function(t3, e3, s4, i4, r2) {
        i4 || this.expect(s4 ? p2.bracketL : p2.relational);
        var a2 = this.tsParseDelimitedList(t3, e3, r2);
        return this.expect(s4 ? p2.bracketR : p2.relational), a2;
      }, A2.tsParseTypeParameterName = function() {
        return this.parseIdent().name;
      }, A2.tsEatThenParseType = function(t3) {
        return this.match(t3) ? this.tsNextThenParseType() : void 0;
      }, A2.tsExpectThenParseType = function(t3) {
        var e3 = this;
        return this.tsDoThenParseType(function() {
          return e3.expect(t3);
        });
      }, A2.tsNextThenParseType = function() {
        var t3 = this;
        return this.tsDoThenParseType(function() {
          return t3.next();
        });
      }, A2.tsDoThenParseType = function(t3) {
        var e3 = this;
        return this.tsInType(function() {
          return t3(), e3.tsParseType();
        });
      }, A2.tsSkipParameterStart = function() {
        if (q(this.type) || this.match(p2._this)) return this.next(), true;
        if (this.match(p2.braceL)) try {
          return this.parseObj(true), true;
        } catch (t3) {
          return false;
        }
        if (this.match(p2.bracketL)) {
          this.next();
          try {
            return this.parseBindingList(p2.bracketR, true, true), true;
          } catch (t3) {
            return false;
          }
        }
        return false;
      }, A2.tsIsUnambiguouslyStartOfFunctionType = function() {
        if (this.next(), this.match(p2.parenR) || this.match(p2.ellipsis)) return true;
        if (this.tsSkipParameterStart()) {
          if (this.match(p2.colon) || this.match(p2.comma) || this.match(p2.question) || this.match(p2.eq)) return true;
          if (this.match(p2.parenR) && (this.next(), this.match(p2.arrow))) return true;
        }
        return false;
      }, A2.tsIsStartOfFunctionType = function() {
        return !!this.tsMatchLeftRelational() || this.match(p2.parenL) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
      }, A2.tsInAllowConditionalTypesContext = function(t3) {
        var e3 = this.inDisallowConditionalTypesContext;
        this.inDisallowConditionalTypesContext = false;
        try {
          return t3();
        } finally {
          this.inDisallowConditionalTypesContext = e3;
        }
      }, A2.tsParseBindingListForSignature = function() {
        var e3 = this;
        return t2.prototype.parseBindingList.call(this, p2.parenR, true, true).map(function(t3) {
          return "Identifier" !== t3.type && "RestElement" !== t3.type && "ObjectPattern" !== t3.type && "ArrayPattern" !== t3.type && e3.raise(t3.start, b.UnsupportedSignatureParameterKind(t3.type)), t3;
        });
      }, A2.tsParseTypePredicateAsserts = function() {
        if (this.type !== _.asserts) return false;
        var t3 = this.containsEsc;
        return this.next(), !(!q(this.type) && !this.match(p2._this) || (t3 && this.raise(this.lastTokStart, "Escape sequence in keyword asserts"), 0));
      }, A2.tsParseThisTypeNode = function() {
        var t3 = this.startNode();
        return this.next(), this.finishNode(t3, "TSThisType");
      }, A2.tsParseTypeAnnotation = function(t3, e3) {
        var s4 = this;
        return void 0 === t3 && (t3 = true), void 0 === e3 && (e3 = this.startNode()), this.tsInType(function() {
          t3 && s4.expect(p2.colon), e3.typeAnnotation = s4.tsParseType();
        }), this.finishNode(e3, "TSTypeAnnotation");
      }, A2.tsParseThisTypePredicate = function(t3) {
        this.next();
        var e3 = this.startNodeAtNode(t3);
        return e3.parameterName = t3, e3.typeAnnotation = this.tsParseTypeAnnotation(false), e3.asserts = false, this.finishNode(e3, "TSTypePredicate");
      }, A2.tsParseThisTypeOrThisTypePredicate = function() {
        var t3 = this.tsParseThisTypeNode();
        return this.isContextual("is") && !this.hasPrecedingLineBreak() ? this.tsParseThisTypePredicate(t3) : t3;
      }, A2.tsParseTypePredicatePrefix = function() {
        var t3 = this.parseIdent();
        if (this.isContextual("is") && !this.hasPrecedingLineBreak()) return this.next(), t3;
      }, A2.tsParseTypeOrTypePredicateAnnotation = function(t3) {
        var e3 = this;
        return this.tsInType(function() {
          var s4 = e3.startNode();
          e3.expect(t3);
          var i4 = e3.startNode(), r2 = !!e3.tsTryParse(e3.tsParseTypePredicateAsserts.bind(e3));
          if (r2 && e3.match(p2._this)) {
            var a2 = e3.tsParseThisTypeOrThisTypePredicate();
            return "TSThisType" === a2.type ? (i4.parameterName = a2, i4.asserts = true, i4.typeAnnotation = null, a2 = e3.finishNode(i4, "TSTypePredicate")) : (e3.resetStartLocationFromNode(a2, i4), a2.asserts = true), s4.typeAnnotation = a2, e3.finishNode(s4, "TSTypeAnnotation");
          }
          var n4 = e3.tsIsIdentifier() && e3.tsTryParse(e3.tsParseTypePredicatePrefix.bind(e3));
          if (!n4) return r2 ? (i4.parameterName = e3.parseIdent(), i4.asserts = r2, i4.typeAnnotation = null, s4.typeAnnotation = e3.finishNode(i4, "TSTypePredicate"), e3.finishNode(s4, "TSTypeAnnotation")) : e3.tsParseTypeAnnotation(false, s4);
          var o2 = e3.tsParseTypeAnnotation(false);
          return i4.parameterName = n4, i4.typeAnnotation = o2, i4.asserts = r2, s4.typeAnnotation = e3.finishNode(i4, "TSTypePredicate"), e3.finishNode(s4, "TSTypeAnnotation");
        });
      }, A2.tsFillSignature = function(t3, e3) {
        var s4 = t3 === p2.arrow;
        e3.typeParameters = this.tsTryParseTypeParameters(), this.expect(p2.parenL), e3.parameters = this.tsParseBindingListForSignature(), (s4 || this.match(t3)) && (e3.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(t3));
      }, A2.tsTryNextParseConstantContext = function() {
        if (this.lookahead().type !== p2._const) return null;
        this.next();
        var t3 = this.tsParseTypeReference();
        return t3.typeParameters && this.raise(t3.typeName.start, b.CannotFindName({ name: "const" })), t3;
      }, A2.tsParseFunctionOrConstructorType = function(t3, e3) {
        var s4 = this, i4 = this.startNode();
        return "TSConstructorType" === t3 && (i4.abstract = !!e3, e3 && this.next(), this.next()), this.tsInAllowConditionalTypesContext(function() {
          return s4.tsFillSignature(p2.arrow, i4);
        }), this.finishNode(i4, t3);
      }, A2.tsParseUnionOrIntersectionType = function(t3, e3, s4) {
        var i4 = this.startNode(), r2 = this.eat(s4), a2 = [];
        do {
          a2.push(e3());
        } while (this.eat(s4));
        return 1 !== a2.length || r2 ? (i4.types = a2, this.finishNode(i4, t3)) : a2[0];
      }, A2.tsCheckTypeAnnotationForReadOnly = function(t3) {
        switch (t3.typeAnnotation.type) {
          case "TSTupleType":
          case "TSArrayType":
            return;
          default:
            this.raise(t3.start, b.UnexpectedReadonly);
        }
      }, A2.tsParseTypeOperator = function() {
        var t3 = this.startNode(), e3 = this.value;
        return this.next(), t3.operator = e3, t3.typeAnnotation = this.tsParseTypeOperatorOrHigher(), "readonly" === e3 && this.tsCheckTypeAnnotationForReadOnly(t3), this.finishNode(t3, "TSTypeOperator");
      }, A2.tsParseConstraintForInferType = function() {
        var t3 = this;
        if (this.eat(p2._extends)) {
          var e3 = this.tsInDisallowConditionalTypesContext(function() {
            return t3.tsParseType();
          });
          if (this.inDisallowConditionalTypesContext || !this.match(p2.question)) return e3;
        }
      }, A2.tsParseInferType = function() {
        var t3 = this, e3 = this.startNode();
        this.expectContextual("infer");
        var s4 = this.startNode();
        return s4.name = this.tsParseTypeParameterName(), s4.constraint = this.tsTryParse(function() {
          return t3.tsParseConstraintForInferType();
        }), e3.typeParameter = this.finishNode(s4, "TSTypeParameter"), this.finishNode(e3, "TSInferType");
      }, A2.tsParseLiteralTypeNode = function() {
        var t3 = this, e3 = this.startNode();
        return e3.literal = function() {
          switch (t3.type) {
            case p2.num:
            case p2.string:
            case p2._true:
            case p2._false:
              return t3.parseExprAtom();
            default:
              t3.unexpected();
          }
        }(), this.finishNode(e3, "TSLiteralType");
      }, A2.tsParseImportType = function() {
        var t3 = this.startNode();
        return this.expect(p2._import), this.expect(p2.parenL), this.match(p2.string) || this.raise(this.start, b.UnsupportedImportTypeArgument), t3.argument = this.parseExprAtom(), this.expect(p2.parenR), this.eat(p2.dot) && (t3.qualifier = this.tsParseEntityName()), this.tsMatchLeftRelational() && (t3.typeParameters = this.tsParseTypeArguments()), this.finishNode(t3, "TSImportType");
      }, A2.tsParseTypeQuery = function() {
        var t3 = this.startNode();
        return this.expect(p2._typeof), t3.exprName = this.match(p2._import) ? this.tsParseImportType() : this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (t3.typeParameters = this.tsParseTypeArguments()), this.finishNode(t3, "TSTypeQuery");
      }, A2.tsParseMappedTypeParameter = function() {
        var t3 = this.startNode();
        return t3.name = this.tsParseTypeParameterName(), t3.constraint = this.tsExpectThenParseType(p2._in), this.finishNode(t3, "TSTypeParameter");
      }, A2.tsParseMappedType = function() {
        var t3 = this.startNode();
        return this.expect(p2.braceL), this.match(p2.plusMin) ? (t3.readonly = this.value, this.next(), this.expectContextual("readonly")) : this.eatContextual("readonly") && (t3.readonly = true), this.expect(p2.bracketL), t3.typeParameter = this.tsParseMappedTypeParameter(), t3.nameType = this.eatContextual("as") ? this.tsParseType() : null, this.expect(p2.bracketR), this.match(p2.plusMin) ? (t3.optional = this.value, this.next(), this.expect(p2.question)) : this.eat(p2.question) && (t3.optional = true), t3.typeAnnotation = this.tsTryParseType(), this.semicolon(), this.expect(p2.braceR), this.finishNode(t3, "TSMappedType");
      }, A2.tsParseTypeLiteral = function() {
        var t3 = this.startNode();
        return t3.members = this.tsParseObjectTypeMembers(), this.finishNode(t3, "TSTypeLiteral");
      }, A2.tsParseTupleElementType = function() {
        var t3 = this.startLoc, e3 = this.start, s4 = this.eat(p2.ellipsis), i4 = this.tsParseType(), r2 = this.eat(p2.question);
        if (this.eat(p2.colon)) {
          var a2 = this.startNodeAtNode(i4);
          a2.optional = r2, "TSTypeReference" !== i4.type || i4.typeParameters || "Identifier" !== i4.typeName.type ? (this.raise(i4.start, b.InvalidTupleMemberLabel), a2.label = i4) : a2.label = i4.typeName, a2.elementType = this.tsParseType(), i4 = this.finishNode(a2, "TSNamedTupleMember");
        } else if (r2) {
          var n4 = this.startNodeAtNode(i4);
          n4.typeAnnotation = i4, i4 = this.finishNode(n4, "TSOptionalType");
        }
        if (s4) {
          var o2 = this.startNodeAt(e3, t3);
          o2.typeAnnotation = i4, i4 = this.finishNode(o2, "TSRestType");
        }
        return i4;
      }, A2.tsParseTupleType = function() {
        var t3 = this, e3 = this.startNode();
        e3.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseTupleElementType.bind(this), true, false);
        var s4 = false, i4 = null;
        return e3.elementTypes.forEach(function(e4) {
          var r2 = e4.type;
          !s4 || "TSRestType" === r2 || "TSOptionalType" === r2 || "TSNamedTupleMember" === r2 && e4.optional || t3.raise(e4.start, b.OptionalTypeBeforeRequired), s4 || (s4 = "TSNamedTupleMember" === r2 && e4.optional || "TSOptionalType" === r2);
          var a2 = r2;
          "TSRestType" === r2 && (a2 = (e4 = e4.typeAnnotation).type);
          var n4 = "TSNamedTupleMember" === a2;
          null != i4 || (i4 = n4), i4 !== n4 && t3.raise(e4.start, b.MixedLabeledAndUnlabeledElements);
        }), this.finishNode(e3, "TSTupleType");
      }, A2.tsParseTemplateLiteralType = function() {
        var t3 = this.startNode();
        return t3.literal = this.parseTemplate({ isTagged: false }), this.finishNode(t3, "TSLiteralType");
      }, A2.tsParseTypeReference = function() {
        var t3 = this.startNode();
        return t3.typeName = this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (t3.typeParameters = this.tsParseTypeArguments()), this.finishNode(t3, "TSTypeReference");
      }, A2.tsMatchLeftRelational = function() {
        return this.match(p2.relational) && "<" === this.value;
      }, A2.tsMatchRightRelational = function() {
        return this.match(p2.relational) && ">" === this.value;
      }, A2.tsParseParenthesizedType = function() {
        var t3 = this.startNode();
        return this.expect(p2.parenL), t3.typeAnnotation = this.tsParseType(), this.expect(p2.parenR), this.finishNode(t3, "TSParenthesizedType");
      }, A2.tsParseNonArrayType = function() {
        switch (this.type) {
          case p2.string:
          case p2.num:
          case p2._true:
          case p2._false:
            return this.tsParseLiteralTypeNode();
          case p2.plusMin:
            if ("-" === this.value) {
              var t3 = this.startNode();
              return this.lookahead().type !== p2.num && this.unexpected(), t3.literal = this.parseMaybeUnary(), this.finishNode(t3, "TSLiteralType");
            }
            break;
          case p2._this:
            return this.tsParseThisTypeOrThisTypePredicate();
          case p2._typeof:
            return this.tsParseTypeQuery();
          case p2._import:
            return this.tsParseImportType();
          case p2.braceL:
            return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();
          case p2.bracketL:
            return this.tsParseTupleType();
          case p2.parenL:
            return this.tsParseParenthesizedType();
          case p2.backQuote:
          case p2.dollarBraceL:
            return this.tsParseTemplateLiteralType();
          default:
            var e3 = this.type;
            if (q(e3) || e3 === p2._void || e3 === p2._null) {
              var s4 = e3 === p2._void ? "TSVoidKeyword" : e3 === p2._null ? "TSNullKeyword" : function(t4) {
                switch (t4) {
                  case "any":
                    return "TSAnyKeyword";
                  case "boolean":
                    return "TSBooleanKeyword";
                  case "bigint":
                    return "TSBigIntKeyword";
                  case "never":
                    return "TSNeverKeyword";
                  case "number":
                    return "TSNumberKeyword";
                  case "object":
                    return "TSObjectKeyword";
                  case "string":
                    return "TSStringKeyword";
                  case "symbol":
                    return "TSSymbolKeyword";
                  case "undefined":
                    return "TSUndefinedKeyword";
                  case "unknown":
                    return "TSUnknownKeyword";
                  default:
                    return;
                }
              }(this.value);
              if (void 0 !== s4 && 46 !== this.lookaheadCharCode()) {
                var i4 = this.startNode();
                return this.next(), this.finishNode(i4, s4);
              }
              return this.tsParseTypeReference();
            }
        }
        this.unexpected();
      }, A2.tsParseArrayTypeOrHigher = function() {
        for (var t3 = this.tsParseNonArrayType(); !this.hasPrecedingLineBreak() && this.eat(p2.bracketL); ) if (this.match(p2.bracketR)) {
          var e3 = this.startNodeAtNode(t3);
          e3.elementType = t3, this.expect(p2.bracketR), t3 = this.finishNode(e3, "TSArrayType");
        } else {
          var s4 = this.startNodeAtNode(t3);
          s4.objectType = t3, s4.indexType = this.tsParseType(), this.expect(p2.bracketR), t3 = this.finishNode(s4, "TSIndexedAccessType");
        }
        return t3;
      }, A2.tsParseTypeOperatorOrHigher = function() {
        var t3 = this;
        return V(this.type) && !this.containsEsc ? this.tsParseTypeOperator() : this.isContextual("infer") ? this.tsParseInferType() : this.tsInAllowConditionalTypesContext(function() {
          return t3.tsParseArrayTypeOrHigher();
        });
      }, A2.tsParseIntersectionTypeOrHigher = function() {
        return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), p2.bitwiseAND);
      }, A2.tsParseUnionTypeOrHigher = function() {
        return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), p2.bitwiseOR);
      }, A2.tsParseNonConditionalType = function() {
        return this.tsIsStartOfFunctionType() ? this.tsParseFunctionOrConstructorType("TSFunctionType") : this.match(p2._new) ? this.tsParseFunctionOrConstructorType("TSConstructorType") : this.isAbstractConstructorSignature() ? this.tsParseFunctionOrConstructorType("TSConstructorType", true) : this.tsParseUnionTypeOrHigher();
      }, A2.tsParseType = function() {
        var t3 = this;
        k(this.inType);
        var e3 = this.tsParseNonConditionalType();
        if (this.inDisallowConditionalTypesContext || this.hasPrecedingLineBreak() || !this.eat(p2._extends)) return e3;
        var s4 = this.startNodeAtNode(e3);
        return s4.checkType = e3, s4.extendsType = this.tsInDisallowConditionalTypesContext(function() {
          return t3.tsParseNonConditionalType();
        }), this.expect(p2.question), s4.trueType = this.tsInAllowConditionalTypesContext(function() {
          return t3.tsParseType();
        }), this.expect(p2.colon), s4.falseType = this.tsInAllowConditionalTypesContext(function() {
          return t3.tsParseType();
        }), this.finishNode(s4, "TSConditionalType");
      }, A2.tsIsUnambiguouslyIndexSignature = function() {
        return this.next(), !!q(this.type) && (this.next(), this.match(p2.colon));
      }, A2.tsInType = function(t3) {
        var e3 = this.inType;
        this.inType = true;
        try {
          return t3();
        } finally {
          this.inType = e3;
        }
      }, A2.tsTryParseIndexSignature = function(t3) {
        if (this.match(p2.bracketL) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))) {
          this.expect(p2.bracketL);
          var e3 = this.parseIdent();
          e3.typeAnnotation = this.tsParseTypeAnnotation(), this.resetEndLocation(e3), this.expect(p2.bracketR), t3.parameters = [e3];
          var s4 = this.tsTryParseTypeAnnotation();
          return s4 && (t3.typeAnnotation = s4), this.tsParseTypeMemberSemicolon(), this.finishNode(t3, "TSIndexSignature");
        }
      }, A2.tsParseNoneModifiers = function(t3) {
        this.tsParseModifiers({ modified: t3, allowedModifiers: [], disallowedModifiers: ["in", "out"], errorTemplate: b.InvalidModifierOnTypeParameterPositions });
      }, A2.tsParseTypeParameter = function(t3) {
        void 0 === t3 && (t3 = this.tsParseNoneModifiers.bind(this));
        var e3 = this.startNode();
        return t3(e3), e3.name = this.tsParseTypeParameterName(), e3.constraint = this.tsEatThenParseType(p2._extends), e3.default = this.tsEatThenParseType(p2.eq), this.finishNode(e3, "TSTypeParameter");
      }, A2.tsParseTypeParameters = function(t3) {
        var e3 = this.startNode();
        this.tsMatchLeftRelational() || this.matchJsx("jsxTagStart") ? this.next() : this.unexpected();
        var s4 = { value: -1 };
        return e3.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this, t3), false, true, s4), 0 === e3.params.length && this.raise(this.start, b.EmptyTypeParameters), -1 !== s4.value && this.addExtra(e3, "trailingComma", s4.value), this.finishNode(e3, "TSTypeParameterDeclaration");
      }, A2.tsTryParseTypeParameters = function(t3) {
        if (this.tsMatchLeftRelational()) return this.tsParseTypeParameters(t3);
      }, A2.tsTryParse = function(t3) {
        var e3 = this.getCurLookaheadState(), s4 = t3();
        return void 0 !== s4 && false !== s4 ? s4 : void this.setLookaheadState(e3);
      }, A2.tsTokenCanFollowModifier = function() {
        return (this.match(p2.bracketL) || this.match(p2.braceL) || this.match(p2.star) || this.match(p2.ellipsis) || this.match(p2.privateId) || this.isLiteralPropertyName()) && !this.hasPrecedingLineBreak();
      }, A2.tsNextTokenCanFollowModifier = function() {
        return this.next(true), this.tsTokenCanFollowModifier();
      }, A2.tsParseModifier = function(t3, e3) {
        if (q(this.type) || this.type === p2._in) {
          var s4 = this.value;
          if (-1 !== t3.indexOf(s4) && !this.containsEsc) {
            if (e3 && this.tsIsStartOfStaticBlocks()) return;
            if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) return s4;
          }
        }
      }, A2.tsParseModifiersByMap = function(t3) {
        for (var e3 = t3.modified, s4 = t3.map, i4 = 0, r2 = Object.keys(s4); i4 < r2.length; i4++) {
          var a2 = r2[i4];
          e3[a2] = s4[a2];
        }
      }, A2.tsParseModifiers = function(t3) {
        for (var e3 = this, s4 = t3.modified, i4 = t3.allowedModifiers, r2 = t3.disallowedModifiers, a2 = t3.stopOnStartOfClassStaticBlock, n4 = t3.errorTemplate, o2 = void 0 === n4 ? b.InvalidModifierOnTypeMember : n4, h3 = {}, p3 = function(t4, i5, r3, a3) {
          i5 === r3 && s4[a3] && e3.raise(t4.column, b.InvalidModifiersOrder({ orderedModifiers: [r3, a3] }));
        }, c2 = function(t4, i5, r3, a3) {
          (s4[r3] && i5 === a3 || s4[a3] && i5 === r3) && e3.raise(t4.column, b.IncompatibleModifiers({ modifiers: [r3, a3] }));
        }; ; ) {
          var l3 = this.startLoc, u3 = this.tsParseModifier(i4.concat(null != r2 ? r2 : []), a2);
          if (!u3) break;
          O(u3) ? s4.accessibility ? this.raise(this.start, b.DuplicateAccessibilityModifier()) : (p3(l3, u3, u3, "override"), p3(l3, u3, u3, "static"), p3(l3, u3, u3, "readonly"), p3(l3, u3, u3, "accessor"), h3.accessibility = u3, s4.accessibility = u3) : N(u3) ? s4[u3] ? this.raise(this.start, b.DuplicateModifier({ modifier: u3 })) : (p3(l3, u3, "in", "out"), h3[u3] = u3, s4[u3] = true) : I(u3) ? s4[u3] ? this.raise(this.start, b.DuplicateModifier({ modifier: u3 })) : (c2(l3, u3, "accessor", "readonly"), c2(l3, u3, "accessor", "static"), c2(l3, u3, "accessor", "override"), h3[u3] = u3, s4[u3] = true) : Object.hasOwnProperty.call(s4, u3) ? this.raise(this.start, b.DuplicateModifier({ modifier: u3 })) : (p3(l3, u3, "static", "readonly"), p3(l3, u3, "static", "override"), p3(l3, u3, "override", "readonly"), p3(l3, u3, "abstract", "override"), c2(l3, u3, "declare", "override"), c2(l3, u3, "static", "abstract"), h3[u3] = u3, s4[u3] = true), null != r2 && r2.includes(u3) && this.raise(this.start, o2);
        }
        return h3;
      }, A2.tsParseInOutModifiers = function(t3) {
        this.tsParseModifiers({ modified: t3, allowedModifiers: ["in", "out"], disallowedModifiers: ["public", "private", "protected", "readonly", "declare", "abstract", "override"], errorTemplate: b.InvalidModifierOnTypeParameter });
      }, A2.tsParseTypeArguments = function() {
        var t3 = this, e3 = this.startNode();
        return e3.params = this.tsInType(function() {
          return t3.tsInNoContext(function() {
            return t3.expect(p2.relational), t3.tsParseDelimitedList("TypeParametersOrArguments", t3.tsParseType.bind(t3));
          });
        }), 0 === e3.params.length && this.raise(this.start, b.EmptyTypeArguments), this.exprAllowed = false, this.expect(p2.relational), this.finishNode(e3, "TSTypeParameterInstantiation");
      }, A2.tsParseHeritageClause = function(t3) {
        var e3 = this, s4 = this.start, i4 = this.tsParseDelimitedList("HeritageClauseElement", function() {
          var t4 = e3.startNode();
          return t4.expression = e3.tsParseEntityName(), e3.tsMatchLeftRelational() && (t4.typeParameters = e3.tsParseTypeArguments()), e3.finishNode(t4, "TSExpressionWithTypeArguments");
        });
        return i4.length || this.raise(s4, b.EmptyHeritageClauseType({ token: t3 })), i4;
      }, A2.tsParseTypeMemberSemicolon = function() {
        this.eat(p2.comma) || this.isLineTerminator() || this.expect(p2.semi);
      }, A2.tsTryParseAndCatch = function(t3) {
        var e3 = this.tryParse(function(e4) {
          return t3() || e4();
        });
        if (!e3.aborted && e3.node) return e3.error && this.setLookaheadState(e3.failState), e3.node;
      }, A2.tsParseSignatureMember = function(t3, e3) {
        return this.tsFillSignature(p2.colon, e3), this.tsParseTypeMemberSemicolon(), this.finishNode(e3, t3);
      }, A2.tsParsePropertyOrMethodSignature = function(t3, e3) {
        this.eat(p2.question) && (t3.optional = true);
        var s4 = t3;
        if (this.match(p2.parenL) || this.tsMatchLeftRelational()) {
          e3 && this.raise(t3.start, b.ReadonlyForMethodSignature);
          var i4 = s4;
          i4.kind && this.tsMatchLeftRelational() && this.raise(this.start, b.AccesorCannotHaveTypeParameters), this.tsFillSignature(p2.colon, i4), this.tsParseTypeMemberSemicolon();
          var r2 = "parameters", a2 = "typeAnnotation";
          if ("get" === i4.kind) i4[r2].length > 0 && (this.raise(this.start, "A 'get' accesor must not have any formal parameters."), this.isThisParam(i4[r2][0]) && this.raise(this.start, b.AccesorCannotDeclareThisParameter));
          else if ("set" === i4.kind) {
            if (1 !== i4[r2].length) this.raise(this.start, "A 'get' accesor must not have any formal parameters.");
            else {
              var n4 = i4[r2][0];
              this.isThisParam(n4) && this.raise(this.start, b.AccesorCannotDeclareThisParameter), "Identifier" === n4.type && n4.optional && this.raise(this.start, b.SetAccesorCannotHaveOptionalParameter), "RestElement" === n4.type && this.raise(this.start, b.SetAccesorCannotHaveRestParameter);
            }
            i4[a2] && this.raise(i4[a2].start, b.SetAccesorCannotHaveReturnType);
          } else i4.kind = "method";
          return this.finishNode(i4, "TSMethodSignature");
        }
        var o2 = s4;
        e3 && (o2.readonly = true);
        var h3 = this.tsTryParseTypeAnnotation();
        return h3 && (o2.typeAnnotation = h3), this.tsParseTypeMemberSemicolon(), this.finishNode(o2, "TSPropertySignature");
      }, A2.tsParseTypeMember = function() {
        var t3 = this.startNode();
        if (this.match(p2.parenL) || this.tsMatchLeftRelational()) return this.tsParseSignatureMember("TSCallSignatureDeclaration", t3);
        if (this.match(p2._new)) {
          var e3 = this.startNode();
          return this.next(), this.match(p2.parenL) || this.tsMatchLeftRelational() ? this.tsParseSignatureMember("TSConstructSignatureDeclaration", t3) : (t3.key = this.createIdentifier(e3, "new"), this.tsParsePropertyOrMethodSignature(t3, false));
        }
        return this.tsParseModifiers({ modified: t3, allowedModifiers: ["readonly"], disallowedModifiers: ["declare", "abstract", "private", "protected", "public", "static", "override"] }), this.tsTryParseIndexSignature(t3) || (this.parsePropertyName(t3), t3.computed || "Identifier" !== t3.key.type || "get" !== t3.key.name && "set" !== t3.key.name || !this.tsTokenCanFollowModifier() || (t3.kind = t3.key.name, this.parsePropertyName(t3)), this.tsParsePropertyOrMethodSignature(t3, !!t3.readonly));
      }, A2.tsParseList = function(t3, e3) {
        for (var s4 = []; !this.tsIsListTerminator(t3); ) s4.push(e3());
        return s4;
      }, A2.tsParseObjectTypeMembers = function() {
        this.expect(p2.braceL);
        var t3 = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
        return this.expect(p2.braceR), t3;
      }, A2.tsParseInterfaceDeclaration = function(t3, e3) {
        if (void 0 === e3 && (e3 = {}), this.hasFollowingLineBreak()) return null;
        this.expectContextual("interface"), e3.declare && (t3.declare = true), q(this.type) ? (t3.id = this.parseIdent(), this.checkLValSimple(t3.id, 7)) : (t3.id = null, this.raise(this.start, b.MissingInterfaceName)), t3.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this)), this.eat(p2._extends) && (t3.extends = this.tsParseHeritageClause("extends"));
        var s4 = this.startNode();
        return s4.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this)), t3.body = this.finishNode(s4, "TSInterfaceBody"), this.finishNode(t3, "TSInterfaceDeclaration");
      }, A2.tsParseAbstractDeclaration = function(t3) {
        if (this.match(p2._class)) return t3.abstract = true, this.parseClass(t3, true);
        if (this.ts_isContextual(_.interface)) {
          if (!this.hasFollowingLineBreak()) return t3.abstract = true, this.tsParseInterfaceDeclaration(t3);
        } else this.unexpected(t3.start);
      }, A2.tsIsDeclarationStart = function() {
        return H(this.type);
      }, A2.tsParseExpressionStatement = function(e3, s4) {
        switch (s4.name) {
          case "declare":
            var i4 = this.tsTryParseDeclare(e3);
            if (i4) return i4.declare = true, i4;
            break;
          case "global":
            if (this.match(p2.braceL)) {
              t2.prototype.enterScope.call(this, f);
              var r2 = e3;
              return r2.global = true, r2.id = s4, r2.body = this.tsParseModuleBlock(), t2.prototype.exitScope.call(this), this.finishNode(r2, "TSModuleDeclaration");
            }
            break;
          default:
            return this.tsParseDeclaration(e3, s4.name, false);
        }
      }, A2.tsParseModuleReference = function() {
        return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(false);
      }, A2.tsIsExportDefaultSpecifier = function() {
        var t3 = this.type, e3 = this.isAsyncFunction(), s4 = this.isLet();
        if (q(t3)) {
          if (e3 && !this.containsEsc || s4) return false;
          if ((t3 === _.type || t3 === _.interface) && !this.containsEsc) {
            var i4 = this.lookahead();
            if (q(i4.type) && !this.isContextualWithState("from", i4) || i4.type === p2.braceL) return false;
          }
        } else if (!this.match(p2._default)) return false;
        var r2 = this.nextTokenStart(), a2 = this.isUnparsedContextual(r2, "from");
        if (44 === this.input.charCodeAt(r2) || q(this.type) && a2) return true;
        if (this.match(p2._default) && a2) {
          var n4 = this.input.charCodeAt(this.nextTokenStartSince(r2 + 4));
          return 34 === n4 || 39 === n4;
        }
        return false;
      }, A2.tsInAmbientContext = function(t3) {
        var e3 = this.isAmbientContext;
        this.isAmbientContext = true;
        try {
          return t3();
        } finally {
          this.isAmbientContext = e3;
        }
      }, A2.tsCheckLineTerminator = function(t3) {
        return t3 ? !this.hasFollowingLineBreak() && (this.next(), true) : !this.isLineTerminator();
      }, A2.tsParseModuleOrNamespaceDeclaration = function(e3, s4) {
        if (void 0 === s4 && (s4 = false), e3.id = this.parseIdent(), s4 || this.checkLValSimple(e3.id, 8), this.eat(p2.dot)) {
          var i4 = this.startNode();
          this.tsParseModuleOrNamespaceDeclaration(i4, true), e3.body = i4;
        } else t2.prototype.enterScope.call(this, f), e3.body = this.tsParseModuleBlock(), t2.prototype.exitScope.call(this);
        return this.finishNode(e3, "TSModuleDeclaration");
      }, A2.checkLValSimple = function(e3, s4, i4) {
        return void 0 === s4 && (s4 = 0), t2.prototype.checkLValSimple.call(this, e3, s4, i4);
      }, A2.tsParseTypeAliasDeclaration = function(t3) {
        var e3 = this;
        return t3.id = this.parseIdent(), this.checkLValSimple(t3.id, 6), t3.typeAnnotation = this.tsInType(function() {
          if (t3.typeParameters = e3.tsTryParseTypeParameters(e3.tsParseInOutModifiers.bind(e3)), e3.expect(p2.eq), e3.ts_isContextual(_.interface) && e3.lookahead().type !== p2.dot) {
            var s4 = e3.startNode();
            return e3.next(), e3.finishNode(s4, "TSIntrinsicKeyword");
          }
          return e3.tsParseType();
        }), this.semicolon(), this.finishNode(t3, "TSTypeAliasDeclaration");
      }, A2.tsParseDeclaration = function(t3, e3, s4) {
        switch (e3) {
          case "abstract":
            if (this.tsCheckLineTerminator(s4) && (this.match(p2._class) || q(this.type))) return this.tsParseAbstractDeclaration(t3);
            break;
          case "module":
            if (this.tsCheckLineTerminator(s4)) {
              if (this.match(p2.string)) return this.tsParseAmbientExternalModuleDeclaration(t3);
              if (q(this.type)) return this.tsParseModuleOrNamespaceDeclaration(t3);
            }
            break;
          case "namespace":
            if (this.tsCheckLineTerminator(s4) && q(this.type)) return this.tsParseModuleOrNamespaceDeclaration(t3);
            break;
          case "type":
            if (this.tsCheckLineTerminator(s4) && q(this.type)) return this.tsParseTypeAliasDeclaration(t3);
        }
      }, A2.tsTryParseExportDeclaration = function() {
        return this.tsParseDeclaration(this.startNode(), this.value, true);
      }, A2.tsParseImportEqualsDeclaration = function(e3, s4) {
        e3.isExport = s4 || false, e3.id = this.parseIdent(), this.checkLValSimple(e3.id, 2), t2.prototype.expect.call(this, p2.eq);
        var i4 = this.tsParseModuleReference();
        return "type" === e3.importKind && "TSExternalModuleReference" !== i4.type && this.raise(i4.start, b.ImportAliasHasImportType), e3.moduleReference = i4, t2.prototype.semicolon.call(this), this.finishNode(e3, "TSImportEqualsDeclaration");
      }, A2.isExportDefaultSpecifier = function() {
        if (this.tsIsDeclarationStart()) return false;
        var t3 = this.type;
        if (q(t3)) {
          if (this.isContextual("async") || this.isContextual("let")) return false;
          if ((t3 === _.type || t3 === _.interface) && !this.containsEsc) {
            var e3 = this.lookahead();
            if (q(e3.type) && !this.isContextualWithState("from", e3) || e3.type === p2.braceL) return false;
          }
        } else if (!this.match(p2._default)) return false;
        var s4 = this.nextTokenStart(), i4 = this.isUnparsedContextual(s4, "from");
        if (44 === this.input.charCodeAt(s4) || q(this.type) && i4) return true;
        if (this.match(p2._default) && i4) {
          var r2 = this.input.charCodeAt(this.nextTokenStartSince(s4 + 4));
          return 34 === r2 || 39 === r2;
        }
        return false;
      }, A2.parseTemplate = function(t3) {
        var e3 = (void 0 === t3 ? {} : t3).isTagged, s4 = void 0 !== e3 && e3, i4 = this.startNode();
        this.next(), i4.expressions = [];
        var r2 = this.parseTemplateElement({ isTagged: s4 });
        for (i4.quasis = [r2]; !r2.tail; ) this.type === p2.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(p2.dollarBraceL), i4.expressions.push(this.inType ? this.tsParseType() : this.parseExpression()), this.expect(p2.braceR), i4.quasis.push(r2 = this.parseTemplateElement({ isTagged: s4 }));
        return this.next(), this.finishNode(i4, "TemplateLiteral");
      }, A2.parseFunction = function(t3, e3, s4, i4, r2) {
        this.initFunction(t3), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !i4) && (this.type === p2.star && 2 & e3 && this.unexpected(), t3.generator = this.eat(p2.star)), this.options.ecmaVersion >= 8 && (t3.async = !!i4), 1 & e3 && (t3.id = 4 & e3 && this.type !== p2.name ? null : this.parseIdent());
        var a2 = this.yieldPos, n4 = this.awaitPos, o2 = this.awaitIdentPos, h3 = this.maybeInArrowParameters;
        this.maybeInArrowParameters = false, this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(w(t3.async, t3.generator)), 1 & e3 || (t3.id = this.type === p2.name ? this.parseIdent() : null), this.parseFunctionParams(t3);
        var c2 = 1 & e3;
        return this.parseFunctionBody(t3, s4, false, r2, { isFunctionDeclaration: c2 }), this.yieldPos = a2, this.awaitPos = n4, this.awaitIdentPos = o2, 1 & e3 && t3.id && !(2 & e3) && this.checkLValSimple(t3.id, t3.body ? this.strict || t3.generator || t3.async ? this.treatFunctionsAsVar ? 1 : 2 : 3 : 0), this.maybeInArrowParameters = h3, this.finishNode(t3, c2 ? "FunctionDeclaration" : "FunctionExpression");
      }, A2.parseFunctionBody = function(e3, s4, i4, r2, a2) {
        void 0 === s4 && (s4 = false), void 0 === i4 && (i4 = false), void 0 === r2 && (r2 = false), this.match(p2.colon) && (e3.returnType = this.tsParseTypeOrTypePredicateAnnotation(p2.colon));
        var n4 = null != a2 && a2.isFunctionDeclaration ? "TSDeclareFunction" : null != a2 && a2.isClassMethod ? "TSDeclareMethod" : void 0;
        return n4 && !this.match(p2.braceL) && this.isLineTerminator() ? this.finishNode(e3, n4) : "TSDeclareFunction" === n4 && this.isAmbientContext && (this.raise(e3.start, b.DeclareFunctionHasImplementation), e3.declare) ? (t2.prototype.parseFunctionBody.call(this, e3, s4, i4, false), this.finishNode(e3, n4)) : (t2.prototype.parseFunctionBody.call(this, e3, s4, i4, r2), e3);
      }, A2.parseNew = function() {
        var t3;
        this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
        var e3 = this.startNode(), s4 = this.parseIdent(true);
        if (this.options.ecmaVersion >= 6 && this.eat(p2.dot)) {
          e3.meta = s4;
          var i4 = this.containsEsc;
          return e3.property = this.parseIdent(true), "target" !== e3.property.name && this.raiseRecoverable(e3.property.start, "The only valid meta property for new is 'new.target'"), i4 && this.raiseRecoverable(e3.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e3.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e3, "MetaProperty");
        }
        var r2 = this.start, a2 = this.startLoc, n4 = this.type === p2._import;
        e3.callee = this.parseSubscripts(this.parseExprAtom(), r2, a2, true, false), n4 && "ImportExpression" === e3.callee.type && this.raise(r2, "Cannot use new with import()");
        var o2 = e3.callee;
        return "TSInstantiationExpression" !== o2.type || null != (t3 = o2.extra) && t3.parenthesized || (e3.typeParameters = o2.typeParameters, e3.callee = o2.expression), e3.arguments = this.eat(p2.parenL) ? this.parseExprList(p2.parenR, this.options.ecmaVersion >= 8, false) : [], this.finishNode(e3, "NewExpression");
      }, A2.parseExprOp = function(e3, s4, i4, r2, a2) {
        var n4;
        if (p2._in.binop > r2 && !this.hasPrecedingLineBreak() && (this.isContextual("as") && (n4 = "TSAsExpression"), h2 && this.isContextual("satisfies") && (n4 = "TSSatisfiesExpression"), n4)) {
          var o2 = this.startNodeAt(s4, i4);
          o2.expression = e3;
          var c2 = this.tsTryNextParseConstantContext();
          return o2.typeAnnotation = c2 || this.tsNextThenParseType(), this.finishNode(o2, n4), this.reScan_lt_gt(), this.parseExprOp(o2, s4, i4, r2, a2);
        }
        return t2.prototype.parseExprOp.call(this, e3, s4, i4, r2, a2);
      }, A2.parseImportSpecifiers = function() {
        var t3 = [], e3 = true;
        if (n3.tokenIsIdentifier(this.type) && (t3.push(this.parseImportDefaultSpecifier()), !this.eat(p2.comma))) return t3;
        if (this.type === p2.star) return t3.push(this.parseImportNamespaceSpecifier()), t3;
        for (this.expect(p2.braceL); !this.eat(p2.braceR); ) {
          if (e3) e3 = false;
          else if (this.expect(p2.comma), this.afterTrailingComma(p2.braceR)) break;
          t3.push(this.parseImportSpecifier());
        }
        return t3;
      }, A2.parseImport = function(t3) {
        var e3 = this.lookahead();
        if (t3.importKind = "value", this.importOrExportOuterKind = "value", q(e3.type) || this.match(p2.star) || this.match(p2.braceL)) {
          var s4 = this.lookahead(2);
          if (s4.type !== p2.comma && !this.isContextualWithState("from", s4) && s4.type !== p2.eq && this.ts_eatContextualWithState("type", 1, e3) && (this.importOrExportOuterKind = "type", t3.importKind = "type", e3 = this.lookahead(), s4 = this.lookahead(2)), q(e3.type) && s4.type === p2.eq) {
            this.next();
            var i4 = this.tsParseImportEqualsDeclaration(t3);
            return this.importOrExportOuterKind = "value", i4;
          }
        }
        return this.next(), this.type === p2.string ? (t3.specifiers = [], t3.source = this.parseExprAtom()) : (t3.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), t3.source = this.type === p2.string ? this.parseExprAtom() : this.unexpected()), this.parseMaybeImportAttributes(t3), this.semicolon(), this.finishNode(t3, "ImportDeclaration"), this.importOrExportOuterKind = "value", "type" === t3.importKind && t3.specifiers.length > 1 && "ImportDefaultSpecifier" === t3.specifiers[0].type && this.raise(t3.start, b.TypeImportCannotSpecifyDefaultAndNamed), t3;
      }, A2.parseExportDefaultDeclaration = function() {
        if (this.isAbstractClass()) {
          var e3 = this.startNode();
          return this.next(), e3.abstract = true, this.parseClass(e3, true);
        }
        if (this.match(_.interface)) {
          var s4 = this.tsParseInterfaceDeclaration(this.startNode());
          if (s4) return s4;
        }
        return t2.prototype.parseExportDefaultDeclaration.call(this);
      }, A2.parseExportAllDeclaration = function(t3, e3) {
        return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (t3.exported = this.parseModuleExportName(), this.checkExport(e3, t3.exported, this.lastTokStart)) : t3.exported = null), this.expectContextual("from"), this.type !== p2.string && this.unexpected(), t3.source = this.parseExprAtom(), this.parseMaybeImportAttributes(t3), this.semicolon(), this.finishNode(t3, "ExportAllDeclaration");
      }, A2.parseDynamicImport = function(t3) {
        if (this.next(), t3.source = this.parseMaybeAssign(), this.eat(p2.comma)) {
          var e3 = this.parseExpression();
          t3.arguments = [e3];
        }
        if (!this.eat(p2.parenR)) {
          var s4 = this.start;
          this.eat(p2.comma) && this.eat(p2.parenR) ? this.raiseRecoverable(s4, "Trailing comma is not allowed in import()") : this.unexpected(s4);
        }
        return this.finishNode(t3, "ImportExpression");
      }, A2.parseExport = function(t3, e3) {
        var s4 = this.lookahead();
        if (this.ts_eatWithState(p2._import, 2, s4)) {
          this.ts_isContextual(_.type) && 61 !== this.lookaheadCharCode() ? (t3.importKind = "type", this.importOrExportOuterKind = "type", this.next()) : (t3.importKind = "value", this.importOrExportOuterKind = "value");
          var i4 = this.tsParseImportEqualsDeclaration(t3, true);
          return this.importOrExportOuterKind = void 0, i4;
        }
        if (this.ts_eatWithState(p2.eq, 2, s4)) {
          var r2 = t3;
          return r2.expression = this.parseExpression(), this.semicolon(), this.importOrExportOuterKind = void 0, this.finishNode(r2, "TSExportAssignment");
        }
        if (this.ts_eatContextualWithState("as", 2, s4)) {
          var a2 = t3;
          return this.expectContextual("namespace"), a2.id = this.parseIdent(), this.semicolon(), this.importOrExportOuterKind = void 0, this.finishNode(a2, "TSNamespaceExportDeclaration");
        }
        if (this.ts_isContextualWithState(s4, _.type) && this.lookahead(2).type === p2.braceL ? (this.next(), this.importOrExportOuterKind = "type", t3.exportKind = "type") : (this.importOrExportOuterKind = "value", t3.exportKind = "value"), this.next(), this.eat(p2.star)) return this.parseExportAllDeclaration(t3, e3);
        if (this.eat(p2._default)) return this.checkExport(e3, "default", this.lastTokStart), t3.declaration = this.parseExportDefaultDeclaration(), this.finishNode(t3, "ExportDefaultDeclaration");
        if (this.shouldParseExportStatement()) t3.declaration = this.parseExportDeclaration(t3), "VariableDeclaration" === t3.declaration.type ? this.checkVariableExport(e3, t3.declaration.declarations) : this.checkExport(e3, t3.declaration.id, t3.declaration.id.start), t3.specifiers = [], t3.source = null;
        else {
          if (t3.declaration = null, t3.specifiers = this.parseExportSpecifiers(e3), this.eatContextual("from")) this.type !== p2.string && this.unexpected(), t3.source = this.parseExprAtom(), this.parseMaybeImportAttributes(t3);
          else {
            for (var n4, o2 = c(t3.specifiers); !(n4 = o2()).done; ) {
              var h3 = n4.value;
              this.checkUnreserved(h3.local), this.checkLocalExport(h3.local), "Literal" === h3.local.type && this.raise(h3.local.start, "A string literal cannot be used as an exported binding without `from`.");
            }
            t3.source = null;
          }
          this.semicolon();
        }
        return this.finishNode(t3, "ExportNamedDeclaration");
      }, A2.checkExport = function(t3, e3, s4) {
        t3 && ("string" != typeof e3 && (e3 = "Identifier" === e3.type ? e3.name : e3.value), t3[e3] = true);
      }, A2.parseMaybeDefault = function(e3, s4, i4) {
        var r2 = t2.prototype.parseMaybeDefault.call(this, e3, s4, i4);
        return "AssignmentPattern" === r2.type && r2.typeAnnotation && r2.right.start < r2.typeAnnotation.start && this.raise(r2.typeAnnotation.start, b.TypeAnnotationAfterAssign), r2;
      }, A2.typeCastToParameter = function(t3) {
        return t3.expression.typeAnnotation = t3.typeAnnotation, this.resetEndLocation(t3.expression, t3.typeAnnotation.end), t3.expression;
      }, A2.toAssignableList = function(e3, s4) {
        for (var i4 = 0; i4 < e3.length; i4++) {
          var r2 = e3[i4];
          "TSTypeCastExpression" === (null == r2 ? void 0 : r2.type) && (e3[i4] = this.typeCastToParameter(r2));
        }
        return t2.prototype.toAssignableList.call(this, e3, s4);
      }, A2.reportReservedArrowTypeParam = function(t3) {
      }, A2.parseExprAtom = function(e3, s4, i4) {
        if (this.type === _.jsxText) return this.jsx_parseText();
        if (this.type === _.jsxTagStart) return this.jsx_parseElement();
        if (this.type === _.at) return this.parseDecorators(), this.parseExprAtom();
        if (q(this.type)) {
          var r2 = this.potentialArrowAt === this.start, a2 = this.start, n4 = this.startLoc, o2 = this.containsEsc, h3 = this.parseIdent(false);
          if (this.options.ecmaVersion >= 8 && !o2 && "async" === h3.name && !this.canInsertSemicolon() && this.eat(p2._function)) return this.overrideContext(M2.f_expr), this.parseFunction(this.startNodeAt(a2, n4), 0, false, true, s4);
          if (r2 && !this.canInsertSemicolon()) {
            if (this.eat(p2.arrow)) return this.parseArrowExpression(this.startNodeAt(a2, n4), [h3], false, s4);
            if (this.options.ecmaVersion >= 8 && "async" === h3.name && this.type === p2.name && !o2 && (!this.potentialArrowInForAwait || "of" !== this.value || this.containsEsc)) return h3 = this.parseIdent(false), !this.canInsertSemicolon() && this.eat(p2.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(a2, n4), [h3], true, s4);
          }
          return h3;
        }
        return t2.prototype.parseExprAtom.call(this, e3, s4, i4);
      }, A2.parseExprAtomDefault = function() {
        if (q(this.type)) {
          var t3 = this.potentialArrowAt === this.start, e3 = this.containsEsc, s4 = this.parseIdent();
          if (!e3 && "async" === s4.name && !this.canInsertSemicolon()) {
            var i4 = this.type;
            if (i4 === p2._function) return this.next(), this.parseFunction(this.startNodeAtNode(s4), void 0, true, true);
            if (q(i4)) {
              if (61 === this.lookaheadCharCode()) {
                var r2 = this.parseIdent(false);
                return !this.canInsertSemicolon() && this.eat(p2.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAtNode(s4), [r2], true);
              }
              return s4;
            }
          }
          return t3 && this.match(p2.arrow) && !this.canInsertSemicolon() ? (this.next(), this.parseArrowExpression(this.startNodeAtNode(s4), [s4], false)) : s4;
        }
        this.unexpected();
      }, A2.parseIdentNode = function() {
        var e3 = this.startNode();
        return U(this.type) ? (e3.name = this.value, e3) : t2.prototype.parseIdentNode.call(this);
      }, A2.parseVarStatement = function(e3, s4, i4) {
        void 0 === i4 && (i4 = false);
        var r2 = this.isAmbientContext;
        this.next(), t2.prototype.parseVar.call(this, e3, false, s4, i4 || r2), this.semicolon();
        var a2 = this.finishNode(e3, "VariableDeclaration");
        if (!r2) return a2;
        for (var n4, o2 = c(a2.declarations); !(n4 = o2()).done; ) {
          var h3 = n4.value, p3 = h3.init;
          p3 && ("const" !== s4 || h3.id.typeAnnotation ? this.raise(p3.start, b.InitializerNotAllowedInAmbientContext) : "StringLiteral" !== p3.type && "BooleanLiteral" !== p3.type && "NumericLiteral" !== p3.type && "BigIntLiteral" !== p3.type && ("TemplateLiteral" !== p3.type || p3.expressions.length > 0) && !L(p3) && this.raise(p3.start, b.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference));
        }
        return a2;
      }, A2.parseStatement = function(e3, s4, i4) {
        if (this.match(_.at) && this.parseDecorators(true), this.match(p2._const) && this.isLookaheadContextual("enum")) {
          var r2 = this.startNode();
          return this.expect(p2._const), this.tsParseEnumDeclaration(r2, { const: true });
        }
        if (this.ts_isContextual(_.enum)) return this.tsParseEnumDeclaration(this.startNode());
        if (this.ts_isContextual(_.interface)) {
          var a2 = this.tsParseInterfaceDeclaration(this.startNode());
          if (a2) return a2;
        }
        return t2.prototype.parseStatement.call(this, e3, s4, i4);
      }, A2.parseAccessModifier = function() {
        return this.tsParseModifier(["public", "protected", "private"]);
      }, A2.parsePostMemberNameModifiers = function(t3) {
        this.eat(p2.question) && (t3.optional = true), t3.readonly && this.match(p2.parenL) && this.raise(t3.start, b.ClassMethodHasReadonly), t3.declare && this.match(p2.parenL) && this.raise(t3.start, b.ClassMethodHasDeclare);
      }, A2.parseExpressionStatement = function(e3, s4) {
        return ("Identifier" === s4.type ? this.tsParseExpressionStatement(e3, s4) : void 0) || t2.prototype.parseExpressionStatement.call(this, e3, s4);
      }, A2.shouldParseExportStatement = function() {
        return !!this.tsIsDeclarationStart() || !!this.match(_.at) || t2.prototype.shouldParseExportStatement.call(this);
      }, A2.parseConditional = function(t3, e3, s4, i4, r2) {
        if (this.eat(p2.question)) {
          var a2 = this.startNodeAt(e3, s4);
          return a2.test = t3, a2.consequent = this.parseMaybeAssign(), this.expect(p2.colon), a2.alternate = this.parseMaybeAssign(i4), this.finishNode(a2, "ConditionalExpression");
        }
        return t3;
      }, A2.parseMaybeConditional = function(t3, e3) {
        var s4 = this, i4 = this.start, r2 = this.startLoc, a2 = this.parseExprOps(t3, e3);
        if (this.checkExpressionErrors(e3)) return a2;
        if (!this.maybeInArrowParameters || !this.match(p2.question)) return this.parseConditional(a2, i4, r2, t3, e3);
        var n4 = this.tryParse(function() {
          return s4.parseConditional(a2, i4, r2, t3, e3);
        });
        return n4.node ? (n4.error && this.setLookaheadState(n4.failState), n4.node) : (n4.error && this.setOptionalParametersError(e3, n4.error), a2);
      }, A2.parseParenItem = function(e3) {
        var s4 = this.start, i4 = this.startLoc;
        if (e3 = t2.prototype.parseParenItem.call(this, e3), this.eat(p2.question) && (e3.optional = true, this.resetEndLocation(e3)), this.match(p2.colon)) {
          var r2 = this.startNodeAt(s4, i4);
          return r2.expression = e3, r2.typeAnnotation = this.tsParseTypeAnnotation(), this.finishNode(r2, "TSTypeCastExpression");
        }
        return e3;
      }, A2.parseExportDeclaration = function(t3) {
        var e3 = this;
        if (!this.isAmbientContext && this.ts_isContextual(_.declare)) return this.tsInAmbientContext(function() {
          return e3.parseExportDeclaration(t3);
        });
        var s4 = this.start, i4 = this.startLoc, r2 = this.eatContextual("declare");
        !r2 || !this.ts_isContextual(_.declare) && this.shouldParseExportStatement() || this.raise(this.start, b.ExpectedAmbientAfterExportDeclare);
        var a2 = q(this.type) && this.tsTryParseExportDeclaration() || this.parseStatement(null);
        return a2 ? (("TSInterfaceDeclaration" === a2.type || "TSTypeAliasDeclaration" === a2.type || r2) && (t3.exportKind = "type"), r2 && (this.resetStartLocation(a2, s4, i4), a2.declare = true), a2) : null;
      }, A2.parseClassId = function(e3, s4) {
        if (s4 || !this.isContextual("implements")) {
          t2.prototype.parseClassId.call(this, e3, s4);
          var i4 = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
          i4 && (e3.typeParameters = i4);
        }
      }, A2.parseClassPropertyAnnotation = function(t3) {
        t3.optional || ("!" === this.value && this.eat(p2.prefix) ? t3.definite = true : this.eat(p2.question) && (t3.optional = true));
        var e3 = this.tsTryParseTypeAnnotation();
        e3 && (t3.typeAnnotation = e3);
      }, A2.parseClassField = function(e3) {
        if ("PrivateIdentifier" === e3.key.type) e3.abstract && this.raise(e3.start, b.PrivateElementHasAbstract), e3.accessibility && this.raise(e3.start, b.PrivateElementHasAccessibility({ modifier: e3.accessibility })), this.parseClassPropertyAnnotation(e3);
        else if (this.parseClassPropertyAnnotation(e3), this.isAmbientContext && (!e3.readonly || e3.typeAnnotation) && this.match(p2.eq) && this.raise(this.start, b.DeclareClassFieldHasInitializer), e3.abstract && this.match(p2.eq)) {
          var s4 = e3.key;
          this.raise(this.start, b.AbstractPropertyHasInitializer({ propertyName: "Identifier" !== s4.type || e3.computed ? "[" + this.input.slice(s4.start, s4.end) + "]" : s4.name }));
        }
        return t2.prototype.parseClassField.call(this, e3);
      }, A2.parseClassMethod = function(t3, e3, s4, i4) {
        var r2 = "constructor" === t3.kind, a2 = "PrivateIdentifier" === t3.key.type, n4 = this.tsTryParseTypeParameters();
        a2 ? (n4 && (t3.typeParameters = n4), t3.accessibility && this.raise(t3.start, b.PrivateMethodsHasAccessibility({ modifier: t3.accessibility }))) : n4 && r2 && this.raise(n4.start, b.ConstructorHasTypeParameters);
        var o2 = t3.declare, h3 = t3.kind;
        !(void 0 !== o2 && o2) || "get" !== h3 && "set" !== h3 || this.raise(t3.start, b.DeclareAccessor({ kind: h3 })), n4 && (t3.typeParameters = n4);
        var p3 = t3.key;
        "constructor" === t3.kind ? (e3 && this.raise(p3.start, "Constructor can't be a generator"), s4 && this.raise(p3.start, "Constructor can't be an async method")) : t3.static && P(t3, "prototype") && this.raise(p3.start, "Classes may not have a static property named prototype");
        var c2 = t3.value = this.parseMethod(e3, s4, i4, true, t3);
        return "get" === t3.kind && 0 !== c2.params.length && this.raiseRecoverable(c2.start, "getter should have no params"), "set" === t3.kind && 1 !== c2.params.length && this.raiseRecoverable(c2.start, "setter should have exactly one param"), "set" === t3.kind && "RestElement" === c2.params[0].type && this.raiseRecoverable(c2.params[0].start, "Setter cannot use rest params"), this.finishNode(t3, "MethodDefinition");
      }, A2.isClassMethod = function() {
        return this.match(p2.relational);
      }, A2.parseClassElement = function(e3) {
        var s4 = this;
        if (this.eat(p2.semi)) return null;
        var i4, r2 = this.options.ecmaVersion, a2 = this.startNode(), n4 = "", o2 = false, h3 = false, c2 = "method", l3 = ["declare", "private", "public", "protected", "accessor", "override", "abstract", "readonly", "static"], u3 = this.tsParseModifiers({ modified: a2, allowedModifiers: l3, disallowedModifiers: ["in", "out"], stopOnStartOfClassStaticBlock: true, errorTemplate: b.InvalidModifierOnTypeParameterPositions });
        i4 = Boolean(u3.static);
        var d3 = function() {
          if (!s4.tsIsStartOfStaticBlocks()) {
            var u4 = s4.tsTryParseIndexSignature(a2);
            if (u4) return a2.abstract && s4.raise(a2.start, b.IndexSignatureHasAbstract), a2.accessibility && s4.raise(a2.start, b.IndexSignatureHasAccessibility({ modifier: a2.accessibility })), a2.declare && s4.raise(a2.start, b.IndexSignatureHasDeclare), a2.override && s4.raise(a2.start, b.IndexSignatureHasOverride), u4;
            if (!s4.inAbstractClass && a2.abstract && s4.raise(a2.start, b.NonAbstractClassHasAbstractMethod), a2.override && e3 && s4.raise(a2.start, b.OverrideNotInSubClass), a2.static = i4, i4 && (s4.isClassElementNameStart() || s4.type === p2.star || (n4 = "static")), !n4 && r2 >= 8 && s4.eatContextual("async") && (!s4.isClassElementNameStart() && s4.type !== p2.star || s4.canInsertSemicolon() ? n4 = "async" : h3 = true), !n4 && (r2 >= 9 || !h3) && s4.eat(p2.star) && (o2 = true), !n4 && !h3 && !o2) {
              var d4 = s4.value;
              (s4.eatContextual("get") || s4.eatContextual("set")) && (s4.isClassElementNameStart() ? c2 = d4 : n4 = d4);
            }
            if (n4 ? (a2.computed = false, a2.key = s4.startNodeAt(s4.lastTokStart, s4.lastTokStartLoc), a2.key.name = n4, s4.finishNode(a2.key, "Identifier")) : s4.parseClassElementName(a2), s4.parsePostMemberNameModifiers(a2), s4.isClassMethod() || r2 < 13 || s4.type === p2.parenL || "method" !== c2 || o2 || h3) {
              var m3 = !a2.static && P(a2, "constructor"), f2 = m3 && e3;
              m3 && "method" !== c2 && s4.raise(a2.key.start, "Constructor can't have get/set modifier"), a2.kind = m3 ? "constructor" : c2, s4.parseClassMethod(a2, o2, h3, f2);
            } else s4.parseClassField(a2);
            return a2;
          }
          if (s4.next(), s4.next(), s4.tsHasSomeModifiers(a2, l3) && s4.raise(s4.start, b.StaticBlockCannotHaveModifier), r2 >= 13) return t2.prototype.parseClassStaticBlock.call(s4, a2), a2;
        };
        return a2.declare ? this.tsInAmbientContext(d3) : d3(), a2;
      }, A2.isClassElementNameStart = function() {
        return !!this.tsIsIdentifier() || t2.prototype.isClassElementNameStart.call(this);
      }, A2.parseClassSuper = function(e3) {
        t2.prototype.parseClassSuper.call(this, e3), e3.superClass && (this.tsMatchLeftRelational() || this.match(p2.bitShift)) && (e3.superTypeParameters = this.tsParseTypeArgumentsInExpression()), this.eatContextual("implements") && (e3.implements = this.tsParseHeritageClause("implements"));
      }, A2.parseFunctionParams = function(e3) {
        var s4 = this.tsTryParseTypeParameters();
        s4 && (e3.typeParameters = s4), t2.prototype.parseFunctionParams.call(this, e3);
      }, A2.parseVarId = function(e3, s4) {
        t2.prototype.parseVarId.call(this, e3, s4), "Identifier" === e3.id.type && !this.hasPrecedingLineBreak() && "!" === this.value && this.eat(p2.prefix) && (e3.definite = true);
        var i4 = this.tsTryParseTypeAnnotation();
        i4 && (e3.id.typeAnnotation = i4, this.resetEndLocation(e3.id));
      }, A2.parseArrowExpression = function(t3, e3, s4, i4) {
        this.match(p2.colon) && (t3.returnType = this.tsParseTypeAnnotation());
        var r2 = this.yieldPos, a2 = this.awaitPos, n4 = this.awaitIdentPos;
        this.enterScope(16 | w(s4, false)), this.initFunction(t3);
        var o2 = this.maybeInArrowParameters;
        return this.options.ecmaVersion >= 8 && (t3.async = !!s4), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.maybeInArrowParameters = true, t3.params = this.toAssignableList(e3, true), this.maybeInArrowParameters = false, this.parseFunctionBody(t3, true, false, i4), this.yieldPos = r2, this.awaitPos = a2, this.awaitIdentPos = n4, this.maybeInArrowParameters = o2, this.finishNode(t3, "ArrowFunctionExpression");
      }, A2.parseMaybeAssignOrigin = function(t3, e3, s4) {
        if (this.isContextual("yield")) {
          if (this.inGenerator) return this.parseYield(t3);
          this.exprAllowed = false;
        }
        var i4 = false, r2 = -1, a2 = -1, n4 = -1;
        e3 ? (r2 = e3.parenthesizedAssign, a2 = e3.trailingComma, n4 = e3.doubleProto, e3.parenthesizedAssign = e3.trailingComma = -1) : (e3 = new T(), i4 = true);
        var o2 = this.start, h3 = this.startLoc;
        (this.type === p2.parenL || q(this.type)) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = "await" === t3);
        var c2 = this.parseMaybeConditional(t3, e3);
        if (s4 && (c2 = s4.call(this, c2, o2, h3)), this.type.isAssign) {
          var l3 = this.startNodeAt(o2, h3);
          return l3.operator = this.value, this.type === p2.eq && (c2 = this.toAssignable(c2, true, e3)), i4 || (e3.parenthesizedAssign = e3.trailingComma = e3.doubleProto = -1), e3.shorthandAssign >= c2.start && (e3.shorthandAssign = -1), this.type === p2.eq ? this.checkLValPattern(c2) : this.checkLValSimple(c2), l3.left = c2, this.next(), l3.right = this.parseMaybeAssign(t3), n4 > -1 && (e3.doubleProto = n4), this.finishNode(l3, "AssignmentExpression");
        }
        return i4 && this.checkExpressionErrors(e3, true), r2 > -1 && (e3.parenthesizedAssign = r2), a2 > -1 && (e3.trailingComma = a2), c2;
      }, A2.parseMaybeAssign = function(t3, e3, s4) {
        var i4, r2, a2, o2, h3, p3, c2, l3, u3, d3, m3, f2 = this;
        if (this.matchJsx("jsxTagStart") || this.tsMatchLeftRelational()) {
          if (l3 = this.cloneCurLookaheadState(), !(u3 = this.tryParse(function() {
            return f2.parseMaybeAssignOrigin(t3, e3, s4);
          }, l3)).error) return u3.node;
          var y3 = this.context, x2 = y3[y3.length - 1];
          x2 === n3.tokContexts.tc_oTag && y3[y3.length - 2] === n3.tokContexts.tc_expr ? (y3.pop(), y3.pop()) : x2 !== n3.tokContexts.tc_oTag && x2 !== n3.tokContexts.tc_expr || y3.pop();
        }
        if (!(null != (i4 = u3) && i4.error || this.tsMatchLeftRelational())) return this.parseMaybeAssignOrigin(t3, e3, s4);
        l3 && !this.compareLookaheadState(l3, this.getCurLookaheadState()) || (l3 = this.cloneCurLookaheadState());
        var T2 = this.tryParse(function(i5) {
          var r3, a3;
          m3 = f2.tsParseTypeParameters();
          var n4 = f2.parseMaybeAssignOrigin(t3, e3, s4);
          return ("ArrowFunctionExpression" !== n4.type || null != (r3 = n4.extra) && r3.parenthesized) && i5(), 0 !== (null == (a3 = m3) ? void 0 : a3.params.length) && f2.resetStartLocationFromNode(n4, m3), n4.typeParameters = m3, n4;
        }, l3);
        if (!T2.error && !T2.aborted) return m3 && this.reportReservedArrowTypeParam(m3), T2.node;
        if (!u3 && (k(true), !(d3 = this.tryParse(function() {
          return f2.parseMaybeAssignOrigin(t3, e3, s4);
        }, l3)).error)) return d3.node;
        if (null != (r2 = u3) && r2.node) return this.setLookaheadState(u3.failState), u3.node;
        if (T2.node) return this.setLookaheadState(T2.failState), m3 && this.reportReservedArrowTypeParam(m3), T2.node;
        if (null != (a2 = d3) && a2.node) return this.setLookaheadState(d3.failState), d3.node;
        if (null != (o2 = u3) && o2.thrown) throw u3.error;
        if (T2.thrown) throw T2.error;
        if (null != (h3 = d3) && h3.thrown) throw d3.error;
        throw (null == (p3 = u3) ? void 0 : p3.error) || T2.error || (null == (c2 = d3) ? void 0 : c2.error);
      }, A2.parseAssignableListItem = function(t3) {
        for (var e3 = []; this.match(_.at); ) e3.push(this.parseDecorator());
        var s4, i4 = this.start, r2 = this.startLoc, a2 = false, n4 = false;
        if (void 0 !== t3) {
          var o2 = {};
          this.tsParseModifiers({ modified: o2, allowedModifiers: ["public", "private", "protected", "override", "readonly"] }), s4 = o2.accessibility, n4 = o2.override, a2 = o2.readonly, false === t3 && (s4 || a2 || n4) && this.raise(r2.start, b.UnexpectedParameterModifier);
        }
        var h3 = this.parseMaybeDefault(i4, r2);
        this.parseBindingListItem(h3);
        var p3 = this.parseMaybeDefault(h3.start, h3.loc, h3);
        if (e3.length && (p3.decorators = e3), s4 || a2 || n4) {
          var c2 = this.startNodeAt(i4, r2);
          return s4 && (c2.accessibility = s4), a2 && (c2.readonly = a2), n4 && (c2.override = n4), "Identifier" !== p3.type && "AssignmentPattern" !== p3.type && this.raise(c2.start, b.UnsupportedParameterPropertyKind), c2.parameter = p3, this.finishNode(c2, "TSParameterProperty");
        }
        return p3;
      }, A2.checkLValInnerPattern = function(e3, s4, i4) {
        void 0 === s4 && (s4 = 0), "TSParameterProperty" === e3.type ? this.checkLValInnerPattern(e3.parameter, s4, i4) : t2.prototype.checkLValInnerPattern.call(this, e3, s4, i4);
      }, A2.parseBindingListItem = function(t3) {
        this.eat(p2.question) && ("Identifier" === t3.type || this.isAmbientContext || this.inType || this.raise(t3.start, b.PatternIsOptional), t3.optional = true);
        var e3 = this.tsTryParseTypeAnnotation();
        return e3 && (t3.typeAnnotation = e3), this.resetEndLocation(t3), t3;
      }, A2.isAssignable = function(t3, e3) {
        var s4 = this;
        switch (t3.type) {
          case "TSTypeCastExpression":
            return this.isAssignable(t3.expression, e3);
          case "TSParameterProperty":
          case "Identifier":
          case "ObjectPattern":
          case "ArrayPattern":
          case "AssignmentPattern":
          case "RestElement":
            return true;
          case "ObjectExpression":
            var i4 = t3.properties.length - 1;
            return t3.properties.every(function(t4, e4) {
              return "ObjectMethod" !== t4.type && (e4 === i4 || "SpreadElement" !== t4.type) && s4.isAssignable(t4);
            });
          case "Property":
          case "ObjectProperty":
            return this.isAssignable(t3.value);
          case "SpreadElement":
            return this.isAssignable(t3.argument);
          case "ArrayExpression":
            return t3.elements.every(function(t4) {
              return null === t4 || s4.isAssignable(t4);
            });
          case "AssignmentExpression":
            return "=" === t3.operator;
          case "ParenthesizedExpression":
            return this.isAssignable(t3.expression);
          case "MemberExpression":
          case "OptionalMemberExpression":
            return !e3;
          default:
            return false;
        }
      }, A2.toAssignable = function(e3, s4, i4) {
        switch (void 0 === s4 && (s4 = false), void 0 === i4 && (i4 = new T()), e3.type) {
          case "ParenthesizedExpression":
            return this.toAssignableParenthesizedExpression(e3, s4, i4);
          case "TSAsExpression":
          case "TSSatisfiesExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
            return s4 || this.raise(e3.start, b.UnexpectedTypeCastInParameter), this.toAssignable(e3.expression, s4, i4);
          case "MemberExpression":
            break;
          case "AssignmentExpression":
            return s4 || "TSTypeCastExpression" !== e3.left.type || (e3.left = this.typeCastToParameter(e3.left)), t2.prototype.toAssignable.call(this, e3, s4, i4);
          case "TSTypeCastExpression":
            return this.typeCastToParameter(e3);
          default:
            return t2.prototype.toAssignable.call(this, e3, s4, i4);
        }
        return e3;
      }, A2.toAssignableParenthesizedExpression = function(e3, s4, i4) {
        switch (e3.expression.type) {
          case "TSAsExpression":
          case "TSSatisfiesExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
          case "ParenthesizedExpression":
            return this.toAssignable(e3.expression, s4, i4);
          default:
            return t2.prototype.toAssignable.call(this, e3, s4, i4);
        }
      }, A2.curPosition = function() {
        if (this.options.locations) {
          var e3 = t2.prototype.curPosition.call(this);
          return Object.defineProperty(e3, "offset", { get: function() {
            return function(t3) {
              var e4 = new i3.Position(this.line, this.column + t3);
              return e4.index = this.index + t3, e4;
            };
          } }), e3.index = this.pos, e3;
        }
      }, A2.parseBindingAtom = function() {
        return this.type === p2._this ? this.parseIdent(true) : t2.prototype.parseBindingAtom.call(this);
      }, A2.shouldParseArrow = function(t3) {
        var e3, s4 = this;
        if (e3 = this.match(p2.colon) ? t3.every(function(t4) {
          return s4.isAssignable(t4, true);
        }) : !this.canInsertSemicolon()) {
          if (this.match(p2.colon)) {
            var i4 = this.tryParse(function(t4) {
              var e4 = s4.tsParseTypeOrTypePredicateAnnotation(p2.colon);
              return !s4.canInsertSemicolon() && s4.match(p2.arrow) || t4(), e4;
            });
            if (i4.aborted) return this.shouldParseArrowReturnType = void 0, false;
            i4.thrown || (i4.error && this.setLookaheadState(i4.failState), this.shouldParseArrowReturnType = i4.node);
          }
          return !!this.match(p2.arrow) || (this.shouldParseArrowReturnType = void 0, false);
        }
        return this.shouldParseArrowReturnType = void 0, e3;
      }, A2.parseParenArrowList = function(t3, e3, s4, i4) {
        var r2 = this.startNodeAt(t3, e3);
        return r2.returnType = this.shouldParseArrowReturnType, this.shouldParseArrowReturnType = void 0, this.parseArrowExpression(r2, s4, false, i4);
      }, A2.parseParenAndDistinguishExpression = function(t3, e3) {
        var s4, i4 = this.start, r2 = this.startLoc, a2 = this.options.ecmaVersion >= 8;
        if (this.options.ecmaVersion >= 6) {
          var n4 = this.maybeInArrowParameters;
          this.maybeInArrowParameters = true, this.next();
          var o2, h3 = this.start, c2 = this.startLoc, l3 = [], u3 = true, d3 = false, m3 = new T(), f2 = this.yieldPos, y3 = this.awaitPos;
          for (this.yieldPos = 0, this.awaitPos = 0; this.type !== p2.parenR; ) {
            if (u3 ? u3 = false : this.expect(p2.comma), a2 && this.afterTrailingComma(p2.parenR, true)) {
              d3 = true;
              break;
            }
            if (this.type === p2.ellipsis) {
              o2 = this.start, l3.push(this.parseParenItem(this.parseRestBinding())), this.type === p2.comma && this.raise(this.start, "Comma is not permitted after the rest element");
              break;
            }
            l3.push(this.parseMaybeAssign(e3, m3, this.parseParenItem));
          }
          var x2 = this.lastTokEnd, v2 = this.lastTokEndLoc;
          if (this.expect(p2.parenR), this.maybeInArrowParameters = n4, t3 && this.shouldParseArrow(l3) && this.eat(p2.arrow)) return this.checkPatternErrors(m3, false), this.checkYieldAwaitInDefaultParams(), this.yieldPos = f2, this.awaitPos = y3, this.parseParenArrowList(i4, r2, l3, e3);
          l3.length && !d3 || this.unexpected(this.lastTokStart), o2 && this.unexpected(o2), this.checkExpressionErrors(m3, true), this.yieldPos = f2 || this.yieldPos, this.awaitPos = y3 || this.awaitPos, l3.length > 1 ? ((s4 = this.startNodeAt(h3, c2)).expressions = l3, this.finishNodeAt(s4, "SequenceExpression", x2, v2)) : s4 = l3[0];
        } else s4 = this.parseParenExpression();
        if (this.options.preserveParens) {
          var P2 = this.startNodeAt(i4, r2);
          return P2.expression = s4, this.finishNode(P2, "ParenthesizedExpression");
        }
        return s4;
      }, A2.parseTaggedTemplateExpression = function(t3, e3, s4, i4) {
        var r2 = this.startNodeAt(e3, s4);
        return r2.tag = t3, r2.quasi = this.parseTemplate({ isTagged: true }), i4 && this.raise(e3, "Tagged Template Literals are not allowed in optionalChain."), this.finishNode(r2, "TaggedTemplateExpression");
      }, A2.shouldParseAsyncArrow = function() {
        var t3 = this;
        if (!this.match(p2.colon)) return !this.canInsertSemicolon() && this.eat(p2.arrow);
        var e3 = this.tryParse(function(e4) {
          var s4 = t3.tsParseTypeOrTypePredicateAnnotation(p2.colon);
          return !t3.canInsertSemicolon() && t3.match(p2.arrow) || e4(), s4;
        });
        return e3.aborted ? (this.shouldParseAsyncArrowReturnType = void 0, false) : e3.thrown ? void 0 : (e3.error && this.setLookaheadState(e3.failState), this.shouldParseAsyncArrowReturnType = e3.node, !this.canInsertSemicolon() && this.eat(p2.arrow));
      }, A2.parseSubscriptAsyncArrow = function(t3, e3, s4, i4) {
        var r2 = this.startNodeAt(t3, e3);
        return r2.returnType = this.shouldParseAsyncArrowReturnType, this.shouldParseAsyncArrowReturnType = void 0, this.parseArrowExpression(r2, s4, true, i4);
      }, A2.parseExprList = function(t3, e3, s4, i4) {
        for (var r2 = [], a2 = true; !this.eat(t3); ) {
          if (a2) a2 = false;
          else if (this.expect(p2.comma), e3 && this.afterTrailingComma(t3)) break;
          var n4 = void 0;
          s4 && this.type === p2.comma ? n4 = null : this.type === p2.ellipsis ? (n4 = this.parseSpread(i4), i4 && this.type === p2.comma && i4.trailingComma < 0 && (i4.trailingComma = this.start)) : n4 = this.parseMaybeAssign(false, i4, this.parseParenItem), r2.push(n4);
        }
        return r2;
      }, A2.parseSubscript = function(t3, e3, s4, i4, r2, a2, n4) {
        var o2 = this, h3 = a2;
        if (!this.hasPrecedingLineBreak() && "!" === this.value && this.match(p2.prefix)) {
          this.exprAllowed = false, this.next();
          var c2 = this.startNodeAt(e3, s4);
          return c2.expression = t3, t3 = this.finishNode(c2, "TSNonNullExpression");
        }
        var l3 = false;
        if (this.match(p2.questionDot) && 60 === this.lookaheadCharCode()) {
          if (i4) return t3;
          t3.optional = true, h3 = l3 = true, this.next();
        }
        if (this.tsMatchLeftRelational() || this.match(p2.bitShift)) {
          var u3, d3 = this.tsTryParseAndCatch(function() {
            if (!i4 && o2.atPossibleAsyncArrow(t3)) {
              var r3 = o2.tsTryParseGenericAsyncArrowFunction(e3, s4, n4);
              if (r3) return t3 = r3;
            }
            var a3 = o2.tsParseTypeArgumentsInExpression();
            if (!a3) return t3;
            if (l3 && !o2.match(p2.parenL)) return u3 = o2.curPosition(), t3;
            if (B(o2.type) || o2.type === p2.backQuote) {
              var c3 = o2.parseTaggedTemplateExpression(t3, e3, s4, h3);
              return c3.typeParameters = a3, c3;
            }
            if (!i4 && o2.eat(p2.parenL)) {
              var d4 = new T(), m4 = o2.startNodeAt(e3, s4);
              return m4.callee = t3, m4.arguments = o2.parseExprList(p2.parenR, o2.options.ecmaVersion >= 8, false, d4), o2.tsCheckForInvalidTypeCasts(m4.arguments), m4.typeParameters = a3, h3 && (m4.optional = l3), o2.checkExpressionErrors(d4, true), t3 = o2.finishNode(m4, "CallExpression");
            }
            var f3 = o2.type;
            if (!(o2.tsMatchRightRelational() || f3 === p2.bitShift || f3 !== p2.parenL && (y4 = f3, Boolean(y4.startsExpr)) && !o2.hasPrecedingLineBreak())) {
              var y4, x3 = o2.startNodeAt(e3, s4);
              return x3.expression = t3, x3.typeParameters = a3, o2.finishNode(x3, "TSInstantiationExpression");
            }
          });
          if (u3 && this.unexpected(u3), d3) return "TSInstantiationExpression" === d3.type && (this.match(p2.dot) || this.match(p2.questionDot) && 40 !== this.lookaheadCharCode()) && this.raise(this.start, b.InvalidPropertyAccessAfterInstantiationExpression), t3 = d3;
        }
        var m3 = this.options.ecmaVersion >= 11, f2 = m3 && this.eat(p2.questionDot);
        i4 && f2 && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
        var y3 = this.eat(p2.bracketL);
        if (y3 || f2 && this.type !== p2.parenL && this.type !== p2.backQuote || this.eat(p2.dot)) {
          var x2 = this.startNodeAt(e3, s4);
          x2.object = t3, y3 ? (x2.property = this.parseExpression(), this.expect(p2.bracketR)) : x2.property = this.type === p2.privateId && "Super" !== t3.type ? this.parsePrivateIdent() : this.parseIdent("never" !== this.options.allowReserved), x2.computed = !!y3, m3 && (x2.optional = f2), t3 = this.finishNode(x2, "MemberExpression");
        } else if (!i4 && this.eat(p2.parenL)) {
          var v2 = this.maybeInArrowParameters;
          this.maybeInArrowParameters = true;
          var P2 = new T(), g3 = this.yieldPos, A3 = this.awaitPos, S2 = this.awaitIdentPos;
          this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
          var C2 = this.parseExprList(p2.parenR, this.options.ecmaVersion >= 8, false, P2);
          if (r2 && !f2 && this.shouldParseAsyncArrow()) this.checkPatternErrors(P2, false), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = g3, this.awaitPos = A3, this.awaitIdentPos = S2, t3 = this.parseSubscriptAsyncArrow(e3, s4, C2, n4);
          else {
            this.checkExpressionErrors(P2, true), this.yieldPos = g3 || this.yieldPos, this.awaitPos = A3 || this.awaitPos, this.awaitIdentPos = S2 || this.awaitIdentPos;
            var E2 = this.startNodeAt(e3, s4);
            E2.callee = t3, E2.arguments = C2, m3 && (E2.optional = f2), t3 = this.finishNode(E2, "CallExpression");
          }
          this.maybeInArrowParameters = v2;
        } else if (this.type === p2.backQuote) {
          (f2 || h3) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
          var k2 = this.startNodeAt(e3, s4);
          k2.tag = t3, k2.quasi = this.parseTemplate({ isTagged: true }), t3 = this.finishNode(k2, "TaggedTemplateExpression");
        }
        return t3;
      }, A2.parseGetterSetter = function(t3) {
        t3.kind = t3.key.name, this.parsePropertyName(t3), t3.value = this.parseMethod(false);
        var e3 = "get" === t3.kind ? 0 : 1, s4 = t3.value.params[0], i4 = s4 && this.isThisParam(s4);
        t3.value.params.length !== (e3 = i4 ? e3 + 1 : e3) ? this.raiseRecoverable(t3.value.start, "get" === t3.kind ? "getter should have no params" : "setter should have exactly one param") : "set" === t3.kind && "RestElement" === t3.value.params[0].type && this.raiseRecoverable(t3.value.params[0].start, "Setter cannot use rest params");
      }, A2.parseProperty = function(e3, s4) {
        if (!e3) {
          var i4 = [];
          if (this.match(_.at)) for (; this.match(_.at); ) i4.push(this.parseDecorator());
          var r2 = t2.prototype.parseProperty.call(this, e3, s4);
          return "SpreadElement" === r2.type && i4.length && this.raise(r2.start, "Decorators can't be used with SpreadElement"), i4.length && (r2.decorators = i4, i4 = []), r2;
        }
        return t2.prototype.parseProperty.call(this, e3, s4);
      }, A2.parseCatchClauseParam = function() {
        var t3 = this.parseBindingAtom(), e3 = "Identifier" === t3.type;
        this.enterScope(e3 ? 32 : 0), this.checkLValPattern(t3, e3 ? 4 : 2);
        var s4 = this.tsTryParseTypeAnnotation();
        return s4 && (t3.typeAnnotation = s4, this.resetEndLocation(t3)), this.expect(p2.parenR), t3;
      }, A2.parseClass = function(t3, e3) {
        var s4 = this.inAbstractClass;
        this.inAbstractClass = !!t3.abstract;
        try {
          this.next(), this.takeDecorators(t3);
          var i4 = this.strict;
          this.strict = true, this.parseClassId(t3, e3), this.parseClassSuper(t3);
          var r2 = this.enterClassBody(), a2 = this.startNode(), n4 = false;
          a2.body = [];
          var o2 = [];
          for (this.expect(p2.braceL); this.type !== p2.braceR; ) if (this.match(_.at)) o2.push(this.parseDecorator());
          else {
            var h3 = this.parseClassElement(null !== t3.superClass);
            o2.length && (h3.decorators = o2, this.resetStartLocationFromNode(h3, o2[0]), o2 = []), h3 && (a2.body.push(h3), "MethodDefinition" === h3.type && "constructor" === h3.kind && "FunctionExpression" === h3.value.type ? (n4 && this.raiseRecoverable(h3.start, "Duplicate constructor in the same class"), n4 = true, h3.decorators && h3.decorators.length > 0 && this.raise(h3.start, "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?")) : h3.key && "PrivateIdentifier" === h3.key.type && v(r2, h3) && this.raiseRecoverable(h3.key.start, "Identifier '#" + h3.key.name + "' has already been declared"));
          }
          return this.strict = i4, this.next(), o2.length && this.raise(this.start, "Decorators must be attached to a class element."), t3.body = this.finishNode(a2, "ClassBody"), this.exitClassBody(), this.finishNode(t3, e3 ? "ClassDeclaration" : "ClassExpression");
        } finally {
          this.inAbstractClass = s4;
        }
      }, A2.parseClassFunctionParams = function() {
        var t3 = this.tsTryParseTypeParameters(this.tsParseConstModifier), e3 = this.parseBindingList(p2.parenR, false, this.options.ecmaVersion >= 8, true);
        return t3 && (e3.typeParameters = t3), e3;
      }, A2.parseMethod = function(t3, e3, s4, i4, r2) {
        var a2 = this.startNode(), n4 = this.yieldPos, o2 = this.awaitPos, h3 = this.awaitIdentPos;
        if (this.initFunction(a2), this.options.ecmaVersion >= 6 && (a2.generator = t3), this.options.ecmaVersion >= 8 && (a2.async = !!e3), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | w(e3, a2.generator) | (s4 ? 128 : 0)), this.expect(p2.parenL), a2.params = this.parseClassFunctionParams(), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(a2, false, true, false, { isClassMethod: i4 }), this.yieldPos = n4, this.awaitPos = o2, this.awaitIdentPos = h3, r2 && r2.abstract && a2.body) {
          var c2 = r2.key;
          this.raise(r2.start, b.AbstractMethodHasImplementation({ methodName: "Identifier" !== c2.type || r2.computed ? "[" + this.input.slice(c2.start, c2.end) + "]" : c2.name }));
        }
        return this.finishNode(a2, "FunctionExpression");
      }, e2.parse = function(t3, e3) {
        if (false === e3.locations) throw new Error("You have to enable options.locations while using acorn-typescript");
        e3.locations = true;
        var s4 = new this(e3, t3);
        return r && (s4.isAmbientContext = true), s4.parse();
      }, e2.parseExpressionAt = function(t3, e3, s4) {
        if (false === s4.locations) throw new Error("You have to enable options.locations while using acorn-typescript");
        s4.locations = true;
        var i4 = new this(s4, t3, e3);
        return r && (i4.isAmbientContext = true), i4.nextToken(), i4.parseExpression();
      }, A2.parseImportSpecifier = function() {
        if (this.ts_isContextual(_.type)) {
          var e3 = this.startNode();
          return e3.imported = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(e3, true, "type" === this.importOrExportOuterKind), this.finishNode(e3, "ImportSpecifier");
        }
        var s4 = t2.prototype.parseImportSpecifier.call(this);
        return s4.importKind = "value", s4;
      }, A2.parseExportSpecifier = function(e3) {
        var s4 = this.ts_isContextual(_.type);
        if (!this.match(p2.string) && s4) {
          var i4 = this.startNode();
          return i4.local = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(i4, false, "type" === this.importOrExportOuterKind), this.finishNode(i4, "ExportSpecifier"), this.checkExport(e3, i4.exported, i4.exported.start), i4;
        }
        var r2 = t2.prototype.parseExportSpecifier.call(this, e3);
        return r2.exportKind = "value", r2;
      }, A2.parseTypeOnlyImportExportSpecifier = function(e3, s4, i4) {
        var r2, a2 = s4 ? "imported" : "local", n4 = s4 ? "local" : "exported", o2 = e3[a2], h3 = false, p3 = true, c2 = o2.start;
        if (this.isContextual("as")) {
          var l3 = this.parseIdent();
          if (this.isContextual("as")) {
            var u3 = this.parseIdent();
            U(this.type) ? (h3 = true, o2 = l3, r2 = s4 ? this.parseIdent() : this.parseModuleExportName(), p3 = false) : (r2 = u3, p3 = false);
          } else U(this.type) ? (p3 = false, r2 = s4 ? this.parseIdent() : this.parseModuleExportName()) : (h3 = true, o2 = l3);
        } else U(this.type) && (h3 = true, s4 ? (o2 = t2.prototype.parseIdent.call(this, true), this.isContextual("as") || this.checkUnreserved(o2)) : o2 = this.parseModuleExportName());
        h3 && i4 && this.raise(c2, s4 ? b.TypeModifierIsUsedInTypeImports : b.TypeModifierIsUsedInTypeExports), e3[a2] = o2, e3[n4] = r2, e3[s4 ? "importKind" : "exportKind"] = h3 ? "type" : "value", p3 && this.eatContextual("as") && (e3[n4] = s4 ? this.parseIdent() : this.parseModuleExportName()), e3[n4] || (e3[n4] = this.copyNode(e3[a2])), s4 && this.checkLValSimple(e3[n4], 2);
      }, A2.raiseCommonCheck = function(e3, s4, i4) {
        return "Comma is not permitted after the rest element" === s4 ? this.isAmbientContext && this.match(p2.comma) && 41 === this.lookaheadCharCode() ? void this.next() : t2.prototype.raise.call(this, e3, s4) : i4 ? t2.prototype.raiseRecoverable.call(this, e3, s4) : t2.prototype.raise.call(this, e3, s4);
      }, A2.raiseRecoverable = function(t3, e3) {
        return this.raiseCommonCheck(t3, e3, true);
      }, A2.raise = function(t3, e3) {
        return this.raiseCommonCheck(t3, e3, true);
      }, A2.updateContext = function(e3) {
        var s4 = this.type;
        if (s4 == p2.braceL) {
          var i4 = this.curContext();
          i4 == R.tc_oTag ? this.context.push(M2.b_expr) : i4 == R.tc_expr ? this.context.push(M2.b_tmpl) : t2.prototype.updateContext.call(this, e3), this.exprAllowed = true;
        } else {
          if (s4 !== p2.slash || e3 !== _.jsxTagStart) return t2.prototype.updateContext.call(this, e3);
          this.context.length -= 2, this.context.push(R.tc_cTag), this.exprAllowed = false;
        }
      }, A2.jsx_parseOpeningElementAt = function(t3, e3) {
        var s4 = this, i4 = this.startNodeAt(t3, e3), r2 = this.jsx_parseElementName();
        if (r2 && (i4.name = r2), this.match(p2.relational) || this.match(p2.bitShift)) {
          var a2 = this.tsTryParseAndCatch(function() {
            return s4.tsParseTypeArgumentsInExpression();
          });
          a2 && (i4.typeParameters = a2);
        }
        for (i4.attributes = []; this.type !== p2.slash && this.type !== _.jsxTagEnd; ) i4.attributes.push(this.jsx_parseAttribute());
        return i4.selfClosing = this.eat(p2.slash), this.expect(_.jsxTagEnd), this.finishNode(i4, r2 ? "JSXOpeningElement" : "JSXOpeningFragment");
      }, A2.enterScope = function(e3) {
        e3 === f && this.importsStack.push([]), t2.prototype.enterScope.call(this, e3);
        var s4 = t2.prototype.currentScope.call(this);
        s4.types = [], s4.enums = [], s4.constEnums = [], s4.classes = [], s4.exportOnlyBindings = [];
      }, A2.exitScope = function() {
        t2.prototype.currentScope.call(this).flags === f && this.importsStack.pop(), t2.prototype.exitScope.call(this);
      }, A2.hasImport = function(t3, e3) {
        var s4 = this.importsStack.length;
        if (this.importsStack[s4 - 1].indexOf(t3) > -1) return true;
        if (!e3 && s4 > 1) {
          for (var i4 = 0; i4 < s4 - 1; i4++) if (this.importsStack[i4].indexOf(t3) > -1) return true;
        }
        return false;
      }, A2.maybeExportDefined = function(t3, e3) {
        this.inModule && 1 & t3.flags && this.undefinedExports.delete(e3);
      }, A2.isRedeclaredInScope = function(e3, s4, i4) {
        return !!(0 & i4) && (2 & i4 ? e3.lexical.indexOf(s4) > -1 || e3.functions.indexOf(s4) > -1 || e3.var.indexOf(s4) > -1 : 3 & i4 ? e3.lexical.indexOf(s4) > -1 || !t2.prototype.treatFunctionsAsVarInScope.call(this, e3) && e3.var.indexOf(s4) > -1 : e3.lexical.indexOf(s4) > -1 && !(32 & e3.flags && e3.lexical[0] === s4) || !this.treatFunctionsAsVarInScope(e3) && e3.functions.indexOf(s4) > -1);
      }, A2.checkRedeclarationInScope = function(t3, e3, s4, i4) {
        this.isRedeclaredInScope(t3, e3, s4) && this.raise(i4, "Identifier '" + e3 + "' has already been declared.");
      }, A2.declareName = function(e3, s4, i4) {
        if (4096 & s4) return this.hasImport(e3, true) && this.raise(i4, "Identifier '" + e3 + "' has already been declared."), void this.importsStack[this.importsStack.length - 1].push(e3);
        var r2 = this.currentScope();
        if (1024 & s4) return this.maybeExportDefined(r2, e3), void r2.exportOnlyBindings.push(e3);
        t2.prototype.declareName.call(this, e3, s4, i4), 0 & s4 && (0 & s4 || (this.checkRedeclarationInScope(r2, e3, s4, i4), this.maybeExportDefined(r2, e3)), r2.types.push(e3)), 256 & s4 && r2.enums.push(e3), 512 & s4 && r2.constEnums.push(e3), 128 & s4 && r2.classes.push(e3);
      }, A2.checkLocalExport = function(e3) {
        var s4 = e3.name;
        if (!this.hasImport(s4)) {
          for (var i4 = this.scopeStack.length - 1; i4 >= 0; i4--) {
            var r2 = this.scopeStack[i4];
            if (r2.types.indexOf(s4) > -1 || r2.exportOnlyBindings.indexOf(s4) > -1) return;
          }
          t2.prototype.checkLocalExport.call(this, e3);
        }
      }, s3 = e2, g2 = [{ key: "acornTypeScript", get: function() {
        return n3;
      } }], (m2 = [{ key: "acornTypeScript", get: function() {
        return n3;
      } }]) && a(s3.prototype, m2), g2 && a(s3, g2), Object.defineProperty(s3, "prototype", { writable: false }), e2;
    }(s2);
    return z;
  };
}
class Sourcemap {
  constructor(input) {
    __publicField(this, "input");
    __publicField(this, "_edits");
    this.input = input;
    this._edits = [];
  }
  _bisectLeft(index) {
    let lo = 0;
    let hi = this._edits.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (this._edits[mid].start < index) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  _bisectRight(index) {
    let lo = 0;
    let hi = this._edits.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (this._edits[mid].start > index) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
  insertLeft(index, value) {
    return this.replaceLeft(index, index, value);
  }
  insertRight(index, value) {
    return this.replaceRight(index, index, value);
  }
  delete(start, end) {
    return this.replaceRight(start, end, "");
  }
  replaceLeft(start, end, value) {
    return this._edits.splice(this._bisectLeft(start), 0, { start, end, value }), this;
  }
  replaceRight(start, end, value) {
    return this._edits.splice(this._bisectRight(start), 0, { start, end, value }), this;
  }
  translate(position) {
    let index = 0;
    let ci = { line: 1, column: 0 };
    let co = { line: 1, column: 0 };
    for (const { start, end, value } of this._edits) {
      if (start > index) {
        const l22 = positionLength(this.input, index, start);
        const ci22 = positionAdd(ci, l22);
        const co22 = positionAdd(co, l22);
        if (positionCompare(co22, position) > 0) break;
        ci = ci22;
        co = co22;
      }
      const il = positionLength(this.input, start, end);
      const ol = positionLength(value);
      const ci2 = positionAdd(ci, il);
      const co2 = positionAdd(co, ol);
      if (positionCompare(co2, position) > 0) return ci;
      ci = ci2;
      co = co2;
      index = end;
    }
    const l2 = positionSubtract(position, co);
    return positionAdd(ci, l2);
  }
  trim() {
    const input = this.input;
    if (input.startsWith("\n")) this.delete(0, 1);
    if (input.endsWith("\n")) this.delete(input.length - 1, input.length);
    return this;
  }
  toString() {
    let output = "";
    let index = 0;
    for (const { start, end, value } of this._edits) {
      if (start > index) output += this.input.slice(index, start);
      output += value;
      index = end;
    }
    output += this.input.slice(index);
    return output;
  }
}
function positionCompare(a2, b2) {
  return a2.line - b2.line || a2.column - b2.column;
}
function positionLength(input, start = 0, end = input.length) {
  let match;
  let line = 0;
  lineBreakG.lastIndex = start;
  while ((match = lineBreakG.exec(input)) && match.index < end) {
    ++line;
    start = match.index + match[0].length;
  }
  return { line, column: end - start };
}
function positionSubtract(b2, a2) {
  return b2.line === a2.line ? { line: 0, column: b2.column - a2.column } : { line: b2.line - a2.line, column: b2.column };
}
function positionAdd(p2, l2) {
  return l2.line === 0 ? { line: p2.line, column: p2.column + l2.column } : { line: p2.line + l2.line, column: l2.column };
}
function detype(input) {
  const ts = D();
  const node = Parser.extend(ts).parse(input, {
    sourceType: "module",
    ecmaVersion: "latest",
    locations: true
  });
  const output = new Sourcemap(input).trim();
  removeTypeNode(output, node);
  return String(output);
}
function removeTypeNode(output, node) {
  if (Array.isArray(node)) {
    node.forEach((a2) => removeTypeNode(output, a2));
    return;
  }
  if (typeof node === "object" && node !== null && typeof node.type === "string") {
    if (node.type.startsWith("TS")) {
      output.delete(node.start, node.end);
      return;
    }
    for (let k2 in node) {
      let v2 = node[k2];
      removeTypeNode(output, v2);
    }
  }
}
const acornOptions = {
  ecmaVersion: 13,
  sourceType: "module"
};
function findDecls(input) {
  const body = parseProgram(input);
  const list2 = body.body;
  return list2.map((decl) => {
    const decls = findTopLevelDeclarations(decl);
    return {
      code: input.slice(decl.start, decl.end),
      start: decl.start,
      end: decl.end,
      decls
    };
  });
}
function isCompilerArtifact(b2) {
  if (b2.type !== "Program") {
    return false;
  }
  if (b2.body[0].type !== "ExpressionStatement") {
    return false;
  }
  if (b2.body[0].expression.type !== "Identifier") {
    return false;
  }
  return /^_[0-9]/.test(b2.body[0].expression.name);
}
function topLevelType(b2) {
  var _a2;
  if (b2.type !== "Program") {
    return "";
  }
  const body = b2.body[0];
  if (body.type !== "VariableDeclaration") {
    return "";
  }
  if (body.declarations[0].type !== "VariableDeclarator") {
    return "";
  }
  if (body.declarations[0].id.type !== "Identifier") {
    return "";
  }
  if (((_a2 = body.declarations[0].init) == null ? void 0 : _a2.type) !== "CallExpression") {
    return "";
  }
  const call = body.declarations[0].init;
  if (call.callee.type !== "MemberExpression") {
    return "";
  }
  if (call.callee.object.type !== "Identifier") {
    return "";
  }
  if (call.callee.object.name === "Events") {
    return "Event";
  }
  if (call.callee.object.name === "Behaviors") {
    return "Behavior";
  }
  return "";
}
function parseJavaScript(input, initialId, flattened = false) {
  var _a2, _b2;
  let decls;
  try {
    input = detype(input);
    decls = findDecls(input).map((d2) => d2.code);
  } catch (error) {
    const e = error;
    const message = e.message + `: error around -> 
"${input.slice(e.pos - 30, e.pos + 30)}`;
    console.log(message);
    throw error;
  }
  const allReferences = [];
  let id = initialId;
  for (const decl of decls) {
    id++;
    const b2 = parseProgram(decl);
    const [references, forceVars, sendTargets, extraType] = findReferences(b2);
    checkAssignments(b2, references, input);
    const declarations = findDeclarations(b2, input);
    const rewriteSpecs = flattened ? [] : checkNested(b2, id);
    if (isCompilerArtifact(b2)) {
      continue;
    }
    if (rewriteSpecs.length === 0) {
      const myId = ((_a2 = declarations[0]) == null ? void 0 : _a2.name) ? (_b2 = declarations[0]) == null ? void 0 : _b2.name : flattened ? `${initialId}` : `${id}`;
      const topType = topLevelType(b2);
      allReferences.push({
        id: myId,
        body: b2,
        declarations,
        references,
        forceVars,
        sendTargets,
        imports: [],
        extraType,
        topType,
        input: decl
      });
    } else {
      let newInput = decl;
      let newPart = "";
      let overridden = false;
      let again = false;
      for (let i2 = 0; i2 < rewriteSpecs.length; i2++) {
        const spec = rewriteSpecs[i2];
        if (spec.type === "range") {
          const sub = newInput.slice(spec.start, spec.end);
          const varName = spec.name;
          newPart += `const ${varName} = ${sub};
`;
          let length = spec.end - spec.start;
          const newNewInput = `${newInput.slice(0, spec.start)}${spec.name.padEnd(length, " ")}${newInput.slice(spec.end)}`;
          if (newNewInput.length !== decl.length) {
            debugger;
          }
          newInput = newNewInput;
        } else if (spec.type === "override") {
          overridden = true;
          newPart += spec.definition + "\n";
        } else if (spec.type === "select") {
          overridden = false;
          const sub = spec.triggers.map((spec2) => newInput.slice(spec2.start, spec2.end));
          const trigger = `Events._or_index(${sub.join(", ")})`;
          const funcs = spec.funcs.map((spec2) => newInput.slice(spec2.start, spec2.end));
          const init = newInput.slice(spec.init.start, spec.init.end);
          const newNewInput = `const ${declarations[0].name} = ${spec.classType}._select(${init}, ${trigger}, [${funcs}]);`;
          newInput = newNewInput;
          again = true;
          id++;
          break;
        }
      }
      const parsed = parseJavaScript(`${newPart}${overridden ? "" : "\n" + newInput}`, again ? id - 1 : id, !again);
      allReferences.push(...parsed);
    }
  }
  return allReferences;
}
function parseProgram(input) {
  return Parser.parse(input, acornOptions);
}
function parseJSX(input) {
  return Parser.extend(jsx()).parse(input, { ecmaVersion: 13 });
}
function transpileJavaScript(node) {
  var _a2;
  const outputs = Array.from(new Set((_a2 = node.declarations) == null ? void 0 : _a2.map((r) => r.name)));
  const only = outputs.length === 0 ? "" : outputs[0];
  const inputs = Array.from(new Set(node.references.map((r) => r.name))).filter((n2) => {
    return globals[n2] !== false && !(node.sendTargets.findIndex((s) => s.name === n2) >= 0);
  });
  const forceVars = Array.from(new Set(node.forceVars.map((r) => r.name))).filter((n2) => globals[n2] !== false);
  const output = new Sourcemap(node.input).trim();
  rewriteExport(output, node.body);
  rewriteRenkonCalls(output, node.body);
  output.insertLeft(0, `, body: (${inputs}) => {
`);
  output.insertLeft(0, `, outputs: ${JSON.stringify(only)}`);
  output.insertLeft(0, `, inputs: ${JSON.stringify(inputs)}`);
  output.insertLeft(0, `, forceVars: ${JSON.stringify(forceVars)}`);
  output.insertLeft(0, `, blockId: "${node.blockId}"`);
  output.insertLeft(0, `, topType: "${node.topType}"`);
  output.insertLeft(0, `{id: "${node.id}"`);
  output.insertRight(node.input.length, `
return ${only};`);
  output.insertRight(node.input.length, "\n}};\n");
  return String(output);
}
function getFunctionBody(input, forMerge) {
  const compiled = parseJavaScript(input, 0, true);
  const node = compiled[0].body.body[0];
  const params = getParams(node);
  const body = node.body.body;
  const last = body[body.length - 1];
  const returnValues = forMerge ? [] : getReturn(last);
  const output = new Sourcemap(input).trim();
  output.delete(0, body[0].start);
  output.delete(last.start, input.length);
  return { params, returnValues, output: String(output) };
}
function getParams(node) {
  if (node.params.length === 0) {
    return [];
  }
  if (node.params[0].type === "Identifier") {
    return node.params.map((p2) => p2.name);
  }
  if (node.params[0].type === "ObjectPattern") {
    const result = [];
    for (const prop of node.params[0].properties) {
      if (!prop) {
        console.error("cannot convert");
        return [];
      }
      if (prop.type !== "Property") {
        console.error("cannot convert");
        return [];
      }
      if (prop.key.type !== "Identifier" || prop.value.type !== "Identifier") {
        console.error("cannot convert");
        return [];
      }
      result.push(prop.key.name);
    }
    return result;
  }
  return [];
}
function getReturn(returnNode) {
  if (returnNode.type !== "ReturnStatement") {
    console.error("cannot convert");
    return null;
  }
  const returnValue = returnNode.argument;
  if (returnValue && returnValue.type === "ArrayExpression") {
    for (const elem of returnValue.elements) {
      if (!elem || elem.type !== "Identifier") {
        console.error("cannot convert");
        return null;
      }
    }
    return returnValue.elements.map((e) => e.name);
  }
  if (returnValue && returnValue.type === "ObjectExpression") {
    const result = {};
    for (const prop of returnValue.properties) {
      if (!prop) {
        console.error("cannot convert");
        return null;
      }
      if (prop.type !== "Property") {
        console.error("cannot convert");
        return null;
      }
      if (prop.key.type !== "Identifier" || prop.value.type !== "Identifier") {
        console.error("cannot convert");
        return null;
      }
      result[prop.key.name] = prop.value.name;
    }
    return result;
  }
  return null;
}
function quote(node, output) {
  output.insertLeft(node.start, '"');
  output.insertRight(node.end, '"');
}
function rewriteExport(output, body) {
  const first = body.body[0];
  if (first.type !== "ExportNamedDeclaration") {
    return;
  }
  const start = first.start;
  const end = start + "export ".length;
  output.replaceLeft(start, end, "");
}
function rewriteRenkonCalls(output, body) {
  simple(body, {
    CallExpression(node) {
      const callee = node.callee;
      if (callee.type === "MemberExpression" && callee.object.type === "Identifier") {
        if (callee.object.name === "Events") {
          output.insertRight(callee.object.end, ".create(Renkon)");
          if (callee.property.type === "Identifier") {
            const selector = callee.property.name;
            if (selector === "delay") {
              quote(node.arguments[0], output);
            } else if (["or", "_or_index", "some"].includes(selector)) {
              for (const arg of node.arguments) {
                quote(arg, output);
              }
            } else if (selector === "send") {
              quote(node.arguments[0], output);
            } else if (["collect", "_select"].includes(selector)) {
              quote(node.arguments[1], output);
            }
          }
        } else if (callee.object.name === "Behaviors") {
          output.insertRight(callee.object.end, ".create(Renkon)");
          if (callee.property.type === "Identifier") {
            const selector = callee.property.name;
            if (["collect", "_select"].includes(selector)) {
              quote(node.arguments[1], output);
            } else if (["or", "_or_index", "some"].includes(selector)) {
              for (const arg of node.arguments) {
                quote(arg, output);
              }
            }
          }
        }
      }
    }
  });
}
const version$1 = "0.7.11";
const packageJson = {
  version: version$1
};
const typeKey = Symbol("typeKey");
const isBehaviorKey = Symbol("isBehavior");
const eventType = "EventType";
const userEventType = "UserEventType";
const delayType = "DelayType";
const timerType = "TimerType";
const collectType = "CollectType";
const selectType = "SelectType";
const promiseType = "PromiseType";
const behaviorType = "BehaviorType";
const onceType = "OnceType";
const orType = "OrType";
const sendType = "SendType";
const receiverType = "ReceiverType";
const changeType = "ChangeType";
const gatherType = "GatherType";
const generatorNextType = "GeneratorNextType";
const resolvePartType = "ResolvePart";
_b = typeKey, _a = isBehaviorKey;
class Stream {
  constructor(type, isBehavior) {
    __publicField(this, _b);
    __publicField(this, _a);
    this[typeKey] = type;
    this[isBehaviorKey] = isBehavior;
  }
  created(_state, _id) {
    return this;
  }
  ready(node, state) {
    var _a2;
    for (const inputName of node.inputs) {
      const varName = state.baseVarName(inputName);
      const resolved = (_a2 = state.resolved.get(varName)) == null ? void 0 : _a2.value;
      if (resolved === void 0 && !node.forceVars.includes(inputName)) {
        return false;
      }
    }
    return true;
  }
  evaluate(_state, _node, _inputArray, _lastInputArray) {
    return;
  }
  conclude(state, varName) {
    var _a2;
    const inputArray = state.inputArray.get(varName);
    const inputs = state.nodes.get(varName).inputs;
    if (inputArray && inputs) {
      for (let i2 = 0; i2 < inputs.length; i2++) {
        const type = state.types.get(inputs[i2]);
        if (type === "Event") {
          inputArray[i2] = void 0;
        }
      }
    }
    if (!this[isBehaviorKey]) {
      if (((_a2 = state.resolved.get(varName)) == null ? void 0 : _a2.value) !== void 0) {
        state.resolved.delete(varName);
        return varName;
      }
    }
    return;
  }
}
class BehaviorStream extends Stream {
  constructor() {
    super(behaviorType, true);
  }
}
class EventStream extends Stream {
  constructor() {
    super(eventType, false);
  }
}
class DelayedEvent extends Stream {
  constructor(delay, varName, isBehavior) {
    super(delayType, isBehavior);
    __publicField(this, "delay");
    __publicField(this, "varName");
    this.delay = delay;
    this.varName = varName;
  }
  ready(node, state) {
    const output = node.outputs;
    const scratch = state.scratch.get(output);
    if ((scratch == null ? void 0 : scratch.queue.length) > 0) {
      return true;
    }
    return state.defaultReady(node);
  }
  created(state, id) {
    if (!state.scratch.get(id)) {
      state.scratch.set(id, { queue: [] });
    }
    return this;
  }
  evaluate(state, node, inputArray, lastInputArray) {
    const value = state.spliceDelayedQueued(state.scratch.get(node.id), state.time);
    if (value !== void 0) {
      state.setResolved(node.id, { value, time: state.time });
    }
    const inputIndex = 0;
    const myInput = inputArray[inputIndex];
    const doIt = this[isBehaviorKey] && myInput !== void 0 && myInput !== (lastInputArray == null ? void 0 : lastInputArray[inputIndex]) || !this[isBehaviorKey] && myInput !== void 0;
    if (doIt) {
      const scratch = state.scratch.get(node.id);
      scratch.queue.push({ time: state.time + this.delay, value: myInput });
    }
  }
}
class TimerEvent extends Stream {
  constructor(interval, isBehavior) {
    super(timerType, isBehavior);
    __publicField(this, "interval");
    this.interval = interval;
  }
  created(_state, _id) {
    return this;
  }
  ready(node, state) {
    const output = node.outputs;
    const last = state.scratch.get(output);
    const interval = this.interval;
    return last === void 0 || last + interval <= state.time;
  }
  evaluate(state, node, _inputArray, _lastInputArray) {
    const interval = this.interval;
    const logicalTrigger = interval * Math.floor(state.time / interval);
    state.setResolved(node.id, { value: logicalTrigger, time: state.time });
    state.scratch.set(node.id, logicalTrigger);
  }
}
class PromiseEvent extends Stream {
  constructor(promise) {
    super(promiseType, true);
    __publicField(this, "promise");
    this.promise = promise;
  }
  created(state, id) {
    var _a2;
    const oldPromise = (_a2 = state.scratch.get(id)) == null ? void 0 : _a2.promise;
    const promise = this.promise;
    if (oldPromise && promise !== oldPromise) {
      state.resolved.delete(id);
    }
    promise.then((value) => {
      var _a3;
      const wasResolved = (_a3 = state.resolved.get(id)) == null ? void 0 : _a3.value;
      if (!wasResolved) {
        state.scratch.set(id, { promise });
        state.setResolved(id, { value, time: state.time });
      }
    });
    return this;
  }
}
class OrStream extends Stream {
  constructor(varNames, useIndex, collection, isBehavior = false) {
    super(orType, isBehavior);
    __publicField(this, "varNames");
    __publicField(this, "useIndex");
    __publicField(this, "collection");
    this.varNames = varNames;
    this.useIndex = useIndex;
    this.collection = collection;
  }
  evaluate(state, node, inputArray, lastInputArray) {
    if (this.collection) {
      const indices = [];
      const values = [];
      for (let i2 = 0; i2 < node.inputs.length; i2++) {
        if (inputArray[i2] !== void 0) {
          indices.push(i2);
        }
        values[i2] = inputArray[i2];
      }
      if (indices.length === 0) {
        return;
      }
      if (this.useIndex) {
        state.setResolved(node.id, { value: indices, time: state.time });
      } else {
        state.setResolved(node.id, { value: values, time: state.time });
      }
      return;
    }
    for (let i2 = 0; i2 < node.inputs.length; i2++) {
      const myInput = inputArray[i2];
      if (myInput !== void 0 && (lastInputArray === void 0 || myInput !== lastInputArray[i2])) {
        if (this.useIndex) {
          state.setResolved(node.id, { value: { index: i2, value: myInput }, time: state.time });
        } else {
          state.setResolved(node.id, { value: myInput, time: state.time });
        }
        return;
      }
    }
  }
}
class UserEvent extends Stream {
  constructor(record, queued) {
    super(userEventType, false);
    __publicField(this, "record");
    __publicField(this, "queued");
    this.record = record;
    this.queued = !!queued;
  }
  created(state, id) {
    let oldRecord = state.scratch.get(id);
    if (oldRecord && oldRecord.cleanup && typeof oldRecord.cleanup === "function") {
      oldRecord.cleanup();
      oldRecord.cleanup = void 0;
    }
    state.scratch.set(id, this.record);
    return this;
  }
  evaluate(state, node, _inputArray, _lastInputArray) {
    let newValue;
    if (this.queued) {
      newValue = state.getEventValues(state.scratch.get(node.id), state.time);
    } else {
      newValue = state.getEventValue(state.scratch.get(node.id), state.time);
    }
    if (newValue !== void 0) {
      if (newValue !== null && newValue.then) {
        newValue.then((value) => {
          state.setResolved(node.id, { value, time: state.time });
        });
      } else {
        state.setResolved(node.id, { value: newValue, time: state.time });
      }
    }
  }
}
class SendEvent extends Stream {
  constructor() {
    super(sendType, false);
  }
}
class ReceiverEvent extends Stream {
  constructor(options) {
    const isBehavior = !!(options == null ? void 0 : options.isBehavior);
    super(receiverType, isBehavior);
    __publicField(this, "queued");
    this.queued = !!(options == null ? void 0 : options.queued);
  }
  created(_state, _id) {
    return this;
  }
  evaluate(state, node, _inputArray, _lastInputArray) {
    const value = state.scratch.get(node.id);
    if (value !== void 0) {
      state.setResolved(node.id, { value, time: state.time });
    }
  }
  conclude(state, varName) {
    var _a2;
    super.conclude(state, varName);
    if (this[isBehaviorKey]) {
      return;
    }
    if (((_a2 = state.resolved.get(varName)) == null ? void 0 : _a2.value) !== void 0) {
      state.resolved.delete(varName);
      state.scratch.delete(varName);
      return varName;
    }
    return;
  }
}
class ChangeEvent extends Stream {
  constructor(value) {
    super(changeType, false);
    __publicField(this, "value");
    this.value = value;
  }
  evaluate(state, node, _inputArray, _lastInputArray) {
    if (this.value === void 0) {
      return;
    }
    if (this.value === state.scratch.get(node.id)) {
      return;
    }
    state.setResolved(node.id, { value: this.value, time: state.time });
    state.scratch.set(node.id, this.value);
  }
}
class OnceEvent extends Stream {
  constructor(value) {
    super(onceType, false);
    __publicField(this, "value");
    this.value = value;
  }
  ready(node, state) {
    return state.scratch.get(node.id) === void 0;
  }
  evaluate(state, node, _inputArray, _lastInputArray) {
    state.setResolved(node.id, { value: this.value, time: state.time });
    state.scratch.set(node.id, this.value);
  }
}
class CollectStream extends Stream {
  constructor(init, varName, updater, isBehavior) {
    super(collectType, isBehavior);
    __publicField(this, "init");
    __publicField(this, "varName");
    __publicField(this, "updater");
    this.init = init;
    this.varName = varName;
    this.updater = updater;
  }
  created(state, id) {
    if (this.init && typeof this.init === "object" && this.init.then) {
      this.init.then((value) => {
        state.streams.set(id, this);
        this.init = value;
        state.setResolved(id, { value, time: state.time });
        state.scratch.set(id, { current: this.init });
      });
      return this;
    }
    if (!state.scratch.get(id)) {
      state.streams.set(id, this);
      state.setResolved(id, { value: this.init, time: state.time });
      state.scratch.set(id, { current: this.init });
    }
    return this;
  }
  evaluate(state, node, inputArray, lastInputArray) {
    const scratch = state.scratch.get(node.id);
    if (!scratch) {
      return;
    }
    const inputIndex = node.inputs.indexOf(this.varName);
    const inputValue = inputArray[inputIndex];
    if (inputValue !== void 0 && (!lastInputArray || inputValue !== lastInputArray[inputIndex])) {
      const newValue = this.updater(scratch.current, inputValue);
      if (newValue !== void 0) {
        if (newValue !== null && newValue.then) {
          newValue.then((value) => {
            state.setResolved(node.id, { value, time: state.time });
            state.scratch.set(node.id, { current: value });
          });
        } else {
          state.setResolved(node.id, { value: newValue, time: state.time });
          state.scratch.set(node.id, { current: newValue });
        }
      }
    }
  }
}
class SelectStream extends Stream {
  constructor(init, varName, updaters, isBehavior) {
    super(selectType, isBehavior);
    __publicField(this, "init");
    __publicField(this, "varName");
    __publicField(this, "updaters");
    this.init = init;
    this.varName = varName;
    this.updaters = updaters;
  }
  created(state, id) {
    if (this.init && typeof this.init === "object" && this.init.then) {
      this.init.then((value) => {
        state.streams.set(id, this);
        this.init = value;
        state.setResolved(id, { value, time: state.time });
        state.scratch.set(id, { current: this.init });
      });
      return this;
    }
    if (!state.scratch.get(id)) {
      state.streams.set(id, this);
      state.setResolved(id, { value: this.init, time: state.time });
      state.scratch.set(id, { current: this.init });
    }
    return this;
  }
  evaluate(state, node, inputArray, _lastInputArray) {
    const scratch = state.scratch.get(node.id);
    if (scratch === void 0) {
      return;
    }
    const inputIndex = node.inputs.indexOf(this.varName);
    const orRecord = inputArray[inputIndex];
    if (orRecord !== void 0) {
      const newValue = this.updaters[orRecord.index](scratch.current, orRecord.value);
      if (newValue !== void 0) {
        if (newValue !== null && newValue.then) {
          newValue.then((value) => {
            state.setResolved(node.id, { value, time: state.time });
            state.scratch.set(node.id, { current: value });
          });
        } else {
          state.setResolved(node.id, { value: newValue, time: state.time });
          state.scratch.set(node.id, { current: newValue });
        }
      }
    }
  }
}
class GatherStream extends Stream {
  constructor(regexp, isBehavior) {
    super(gatherType, isBehavior);
    __publicField(this, "regexp");
    this.regexp = new RegExp(regexp);
  }
  created(_state, _id) {
    return this;
  }
  evaluate(state, node, inputArray, lastInputArray) {
    if (state.equals(inputArray, lastInputArray)) {
      return;
    }
    const inputs = node.inputs;
    const validInputNames = [];
    const validInputs = [];
    let hasPromise = false;
    for (let i2 = 0; i2 < inputs.length; i2++) {
      const v2 = inputArray[i2];
      if (v2 !== void 0) {
        validInputNames.push(inputs[i2]);
        validInputs.push(v2);
        if (v2 !== null && v2.then) {
          hasPromise = true;
        }
      }
    }
    if (hasPromise) {
      Promise.all(validInputs).then((values) => {
        const result = {};
        for (let i2 = 0; i2 < validInputNames.length; i2++) {
          result[validInputNames[i2]] = values[i2];
        }
        state.setResolved(node.id, { value: result, time: state.time });
      });
    } else {
      const result = {};
      for (let i2 = 0; i2 < validInputNames.length; i2++) {
        result[validInputNames[i2]] = validInputs[i2];
      }
      state.setResolved(node.id, { value: result, time: state.time });
    }
  }
}
class ResolvePart extends Stream {
  constructor(object, isBehavior) {
    super(resolvePartType, isBehavior);
    __publicField(this, "promise");
    __publicField(this, "indices");
    __publicField(this, "resolved");
    __publicField(this, "object");
    this.object = object;
    if (Array.isArray(this.object)) {
      const array = this.object;
      const indices = [...Array(array.length).keys()].filter((i2) => {
        const elem = this.object[i2];
        return typeof elem === "object" && elem !== null && elem.then;
      });
      const promises = indices.map((i2) => array[i2]);
      this.promise = Promise.all(promises);
      this.indices = indices;
    } else {
      const keys = Object.keys(this.object).filter((k2) => {
        const elem = this.object[k2];
        return typeof elem === "object" && elem !== null && elem.then;
      });
      const promises = keys.map((k2) => this.object[k2]);
      this.promise = Promise.all(promises);
      this.indices = keys;
    }
    this.resolved = false;
  }
  created(state, id) {
    if (!this.resolved) {
      this.promise.then((values) => {
        var _a2;
        const wasResolved = (_a2 = state.resolved.get(id)) == null ? void 0 : _a2.value;
        if (!wasResolved) {
          this.resolved = true;
          if (Array.isArray(this.object)) {
            const result = [...this.object];
            const indices = this.indices;
            for (let i2 of indices) {
              result[indices[i2]] = values[i2];
            }
            state.setResolved(id, { value: result, time: state.time });
            return result;
          } else {
            const result = { ...this.object };
            const indices = this.indices;
            for (let i2 = 0; i2 < indices.length; i2++) {
              result[indices[i2]] = values[i2];
            }
            state.setResolved(id, { value: result, time: state.time });
            return result;
          }
        }
      });
    }
    return this;
  }
}
class GeneratorNextEvent extends Stream {
  constructor(generator) {
    super(generatorNextType, false);
    __publicField(this, "promise");
    __publicField(this, "generator");
    const promise = generator.next();
    this.promise = promise;
    this.generator = generator;
  }
  created(state, id) {
    if (this.generator.done) {
      return this;
    }
    const promise = this.promise;
    promise.then((value) => {
      var _a2;
      const wasResolved = (_a2 = state.resolved.get(id)) == null ? void 0 : _a2.value;
      if (!wasResolved) {
        state.setResolved(id, { value, time: state.time });
      }
    });
    return this;
  }
  conclude(state, varName) {
    var _a2;
    const value = (_a2 = state.resolved.get(varName)) == null ? void 0 : _a2.value;
    if (value !== void 0) {
      if (!value.done) {
        if (!this.generator.done) {
          const promise = this.generator.next();
          promise.then((value2) => {
            var _a3;
            const wasResolved = (_a3 = state.resolved.get(varName)) == null ? void 0 : _a3.value;
            if (!wasResolved) {
              state.setResolved(varName, { value: value2, time: state.time });
            }
          });
          this.promise = promise;
        }
      } else {
        this.generator.done = true;
      }
      super.conclude(state, varName);
      return varName;
    }
    super.conclude(state, varName);
    return;
  }
}
class TSCompiler {
  constructor() {
    __publicField(this, "sources");
    __publicField(this, "results");
    this.sources = /* @__PURE__ */ new Map();
    this.results = /* @__PURE__ */ new Map();
  }
  compile(tsCode, _path) {
    try {
      const compiled = detype(tsCode);
      return compiled;
    } catch (error) {
      const e = error;
      const message = e.message + `: error around -> 
"${tsCode.slice(e.pos - 30, e.pos + 30)}`;
      console.log(message);
      throw error;
    }
  }
}
function translateTS(text2, path2) {
  return new TSCompiler().compile(text2, path2);
}
const version = packageJson.version;
function isGenerator(value) {
  const prototypicalGeneratorFunction = async function* () {
  }();
  if (value === void 0 || value === null) {
    return false;
  }
  return typeof value === "object" && value.constructor === prototypicalGeneratorFunction.constructor;
}
const defaultHandler = (ev) => ev;
function eventBody(args) {
  let { forObserve, callback, dom, eventName, eventHandler, state, queued, options } = args;
  let record = { queue: [] };
  let myHandler;
  let myOptions;
  if (options) {
    myOptions = { ...options };
  }
  let realDom;
  if (typeof dom === "string") {
    realDom = document.querySelector(dom);
  } else {
    realDom = dom;
  }
  const notifier = (value) => {
    record.queue.push({ value, time: 0 });
  };
  if (realDom && !forObserve && eventName) {
    if (eventHandler) {
      myHandler = (evt) => {
        const value = eventHandler(evt);
        if (value !== void 0) {
          record.queue.push({ value, time: 0 });
          if (state.noTicking) {
            state.noTickingEvaluationRequest();
          }
        }
      };
    } else {
      myHandler = defaultHandler;
    }
    if (myHandler) {
      if (myOptions) {
        realDom.addEventListener(eventName, myHandler, myOptions);
      } else {
        realDom.addEventListener(eventName, myHandler);
      }
    }
    if (eventHandler === null) {
      if (myOptions) {
        realDom.removeEventListener(eventName, myHandler, myOptions);
      } else {
        realDom.removeEventListener(eventName, myHandler);
      }
    }
  }
  if (forObserve && callback) {
    record.cleanup = callback(notifier);
  }
  if (!forObserve && dom) {
    record.cleanup = () => {
      if (realDom && eventName) {
        if (myHandler) {
          realDom.removeEventListener(eventName, myHandler);
        }
      }
    };
  }
  return new UserEvent(record, queued);
}
class Events {
  constructor(state) {
    __publicField(this, "programState");
    this.programState = state;
  }
  static create(state) {
    return new Events(state);
  }
  listener(dom, eventName, handler, options) {
    let myOptions;
    if (options) {
      myOptions = { ...options };
      delete myOptions.queued;
    }
    const queued = !!(options == null ? void 0 : options.queued);
    return eventBody({
      forObserve: false,
      dom,
      eventName,
      eventHandler: handler,
      state: this.programState,
      queued,
      options: myOptions
    });
  }
  delay(varName, delay) {
    return new DelayedEvent(delay, varName, false);
  }
  timer(interval) {
    return new TimerEvent(interval, false);
  }
  change(value) {
    return new ChangeEvent(value);
  }
  once(value) {
    return new OnceEvent(value);
  }
  next(generator) {
    return new GeneratorNextEvent(generator);
  }
  or(...varNames) {
    return new OrStream(varNames, false, false);
  }
  some(...varNames) {
    return new OrStream(varNames, false, true);
  }
  _or_index(...varNames) {
    return new OrStream(varNames, true, false);
  }
  collect(init, varName, updater) {
    return new CollectStream(init, varName, updater, false);
  }
  select(_init, ..._pairs) {
  }
  _select(init, varName, updaters) {
    return new SelectStream(init, varName, updaters, false);
  }
  send(receiver, value) {
    this.programState.registerEvent(receiver, value);
    return new SendEvent();
  }
  receiver(options) {
    return new ReceiverEvent(options);
  }
  observe(callback, options) {
    return eventBody({
      forObserve: true,
      callback,
      state: this.programState,
      queued: options == null ? void 0 : options.queued
    });
  }
  message(event, data2, directWindow) {
    const isInIframe = window.top !== window;
    const obj = { event: `renkon:${event}`, data: data2 };
    if (isInIframe) {
      window.top.postMessage(obj, "*");
      return;
    }
    if (directWindow) {
      directWindow.postMessage(obj, "*");
    }
  }
  resolvePart(object) {
    return new ResolvePart(object, false);
  }
}
class Behaviors {
  constructor(state) {
    __publicField(this, "programState");
    this.programState = state;
  }
  static create(state) {
    return new Behaviors(state);
  }
  keep(value) {
    return value;
  }
  collect(init, varName, updater) {
    return new CollectStream(init, varName, updater, true);
  }
  timer(interval) {
    return new TimerEvent(interval, true);
  }
  delay(varName, delay) {
    return new DelayedEvent(delay, varName, true);
  }
  resolvePart(object) {
    return new ResolvePart(object, true);
  }
  select(_init, ..._pairs) {
  }
  _select(init, varName, updaters) {
    return new SelectStream(init, varName, updaters, true);
  }
  or(...varNames) {
    return new OrStream(varNames, false, true);
  }
  gather(regexp) {
    return new GatherStream(regexp, true);
  }
  receiver(options) {
    let args = { ...options };
    args.isBehavior = true;
    return new ReceiverEvent(args);
  }
}
function topologicalSort(nodes) {
  let order = [];
  let workNodes = nodes.map((node) => ({
    id: node.id,
    inputs: [...node.inputs].filter((n2) => n2[0] !== "$"),
    outputs: node.outputs
  }));
  function hasEdge(src, dst) {
    return dst.inputs.includes(src.outputs);
  }
  function removeEdges(src, dst) {
    let edges = [];
    let index = dst.inputs.indexOf(src.outputs);
    if (index >= 0) {
      edges.push(src.outputs);
    }
    dst.inputs = dst.inputs.filter((input) => !edges.includes(input));
  }
  const leaves = workNodes.filter((node) => node.inputs.length === 0);
  while (leaves[0]) {
    let n2 = leaves[0];
    leaves.shift();
    order.push(n2.id);
    let ms = workNodes.filter((node) => hasEdge(n2, node));
    for (let m2 of ms) {
      removeEdges(n2, m2);
      if (m2.inputs.length === 0) {
        leaves.push(m2);
      }
    }
  }
  return order;
}
function invalidatedInput(node, invalidatedVars) {
  for (const input of node.inputs) {
    if (invalidatedVars.has(input)) {
      return true;
    }
  }
  return false;
}
function difference(oldSet, newSet) {
  const result = /* @__PURE__ */ new Set();
  for (const key of oldSet) {
    if (!newSet.has(key)) {
      result.add(key);
    }
  }
  return result;
}
class ProgramState {
  constructor(startTime, app) {
    __publicField(this, "scripts");
    __publicField(this, "order");
    __publicField(this, "types");
    __publicField(this, "nodes");
    __publicField(this, "streams");
    __publicField(this, "scratch");
    __publicField(this, "resolved");
    __publicField(this, "inputArray");
    __publicField(this, "changeList");
    __publicField(this, "time");
    __publicField(this, "startTime");
    __publicField(this, "evaluatorRunning");
    __publicField(this, "exports");
    __publicField(this, "imports");
    __publicField(this, "updated");
    __publicField(this, "app");
    __publicField(this, "noTicking");
    __publicField(this, "noTickingEvaluationRequested");
    __publicField(this, "log");
    __publicField(this, "programStates");
    __publicField(this, "lastReturned");
    __publicField(this, "futureScripts");
    __publicField(this, "breakpoints");
    this.scripts = [];
    this.order = [];
    this.types = /* @__PURE__ */ new Map();
    this.nodes = /* @__PURE__ */ new Map();
    this.streams = /* @__PURE__ */ new Map();
    this.scratch = /* @__PURE__ */ new Map();
    this.resolved = /* @__PURE__ */ new Map();
    this.inputArray = /* @__PURE__ */ new Map();
    this.time = 0, this.changeList = /* @__PURE__ */ new Map();
    this.startTime = startTime;
    this.evaluatorRunning = 0;
    this.updated = false;
    this.app = app;
    this.log = (...values) => {
      console.log(...values);
    };
    this.noTicking = false;
    this.noTickingEvaluationRequested = 0;
    this.programStates = /* @__PURE__ */ new Map();
    this.breakpoints = /* @__PURE__ */ new Set();
  }
  evaluator() {
    this.evaluatorRunning = window.requestAnimationFrame(() => this.evaluator());
    let success;
    try {
      this.evaluate(Date.now());
      success = true;
    } catch (e) {
      console.error(e);
      this.log("stopping animation");
      window.cancelAnimationFrame(this.evaluatorRunning);
      this.evaluatorRunning = 0;
      success = false;
    }
    return success;
  }
  nodeEvaluator() {
    if (this.evaluatorRunning) {
      clearInterval(this.evaluatorRunning);
    }
    this.evaluatorRunning = setInterval(() => this.nodeEvaluator(), 20);
    let success;
    try {
      this.evaluate(Date.now());
      success = true;
    } catch (e) {
      console.error(e);
      this.log("stop setInterval loop");
      clearInterval(this.evaluatorRunning);
      this.evaluatorRunning = 0;
      success = false;
    }
    return success;
  }
  noTickingEvaluationRequest() {
    console.log("requested", this.time, this.noTickingEvaluationRequested);
    return;
  }
  noTickingEvaluate(time) {
    this.noTicking = true;
    let success;
    try {
      this.noTickingEvaluationRequested = 0;
      this.evaluate(time);
      success = true;
    } catch (e) {
      console.error(e);
      success = false;
    }
    return success;
  }
  setupProgram(scriptsArg, path2 = "") {
    const invalidatedStreamNames = /* @__PURE__ */ new Set();
    const scripts = scriptsArg.map((s) => {
      if (typeof s === "string") {
        return s;
      }
      return s.code;
    });
    const blockIds = scriptsArg.map((s, i2) => {
      if (typeof s === "string") {
        return `${i2}`;
      }
      return s.blockId;
    });
    for (const [varName, stream] of this.streams) {
      if (!stream[isBehaviorKey]) {
        const scratch = this.scratch.get(varName);
        if ((scratch == null ? void 0 : scratch.cleanup) && typeof scratch.cleanup === "function") {
          scratch.cleanup();
          scratch.cleanup = void 0;
        }
        this.resolved.delete(varName);
        this.streams.delete(varName);
        this.inputArray.delete(varName);
        invalidatedStreamNames.add(varName);
      }
    }
    for (const [varName, node] of this.nodes) {
      if (node.inputs.includes("render")) {
        this.inputArray.delete(varName);
      }
    }
    const jsNodes = /* @__PURE__ */ new Map();
    let id = 0;
    for (let scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
      const blockId = blockIds[scriptIndex];
      const script = scripts[scriptIndex];
      if (!script) {
        continue;
      }
      const nodes = parseJavaScript(script, id, false);
      for (const n2 of nodes) {
        if (jsNodes.get(n2.id)) {
          this.log(`node "${n2.id}" is defined multiple times`);
        }
        n2.blockId = blockId;
        jsNodes.set(n2.id, n2);
        id++;
      }
    }
    const translated = [...jsNodes].map(([_id, jsNode]) => ({ id: jsNode.id, code: transpileJavaScript(jsNode) }));
    const evaluated = translated.map((tr) => this.evalCode(tr, path2));
    for (let [id2, node] of jsNodes) {
      if (node.extraType["gather"]) {
        const r = node.extraType["gather"];
        const ev = evaluated.find((evaled) => evaled.id === id2);
        if (ev) {
          const ins = evaluated.filter((evaled) => new RegExp(r).test(evaled.id)).map((e) => e.id);
          ev.inputs = ins;
        }
      }
    }
    const sorted = topologicalSort(evaluated);
    const newNodes = /* @__PURE__ */ new Map();
    for (const newNode of evaluated) {
      newNodes.set(newNode.id, newNode);
    }
    const unsortedVarnames = difference(new Set(evaluated.map((e) => e.id)), new Set(sorted));
    for (const u2 of unsortedVarnames) {
      this.log(`Node ${u2} is not going to be evaluated because it is in a cycle or depends on a undefined variable.`);
    }
    const oldVariableNames = new Set(this.order);
    const newVariableNames = new Set(sorted);
    const removedVariableNames = difference(oldVariableNames, newVariableNames);
    for (const old of this.order) {
      const oldNode = this.nodes.get(old);
      const newNode = newNodes.get(old);
      if (newNode && oldNode && oldNode.code !== newNode.code) {
        invalidatedStreamNames.add(old);
      }
    }
    this.order = sorted;
    this.nodes = newNodes;
    this.scripts = scripts;
    this.types = /* @__PURE__ */ new Map();
    for (const nodeId of this.order) {
      const newNode = newNodes.get(nodeId);
      if (invalidatedInput(newNode, invalidatedStreamNames)) {
        this.inputArray.delete(newNode.id);
      }
      if (invalidatedStreamNames.has(nodeId)) {
        this.resolved.delete(nodeId);
        this.scratch.delete(nodeId);
        this.inputArray.delete(nodeId);
      }
    }
    this.order.forEach((nodeId) => {
      const node = this.nodes.get(nodeId);
      if (!node) {
        return;
      }
      if (node.topType !== "") {
        this.types.set(nodeId, node.topType);
        return;
      }
      this.types.set(nodeId, "Behavior");
      for (const input of node.inputs) {
        if (this.types.get(input) === "Event") {
          this.types.set(nodeId, "Event");
          return;
        }
      }
    });
    for (const removed of removedVariableNames) {
      const stream = this.streams.get(removed);
      if (stream) {
        this.resolved.delete(removed);
        this.streams.delete(removed);
        this.scratch.delete(removed);
      }
    }
    for (const [varName, node] of this.nodes) {
      const nodeNames = [...this.nodes].map(([id2, _body]) => id2);
      for (const input of node.inputs) {
        if (!nodeNames.includes(this.baseVarName(input))) {
          this.log(`Node ${varName} won't be evaluated as it depends on an undefined variable ${input}.`);
        }
      }
    }
  }
  updateProgram(scripts, path2 = "") {
    this.futureScripts = { scripts, path: path2 };
  }
  findDecls(code) {
    return findDecls(code);
  }
  findDecl(name) {
    const decls = this.findDecls(this.scripts.join("\n"));
    const decl = decls.find((d2) => d2.decls.includes(name));
    if (decl) {
      return decl.code;
    }
  }
  evaluate(now, callConclude = true) {
    this.time = now - this.startTime;
    this.updated = false;
    let trace;
    if (this.breakpoints.size > 0) {
      trace = [];
    }
    for (let id of this.order) {
      const node = this.nodes.get(id);
      if (!this.ready(node)) {
        continue;
      }
      if (trace) {
        if (this.breakpoints.has(id)) {
          debugger;
        }
      }
      const change = this.changeList.get(id);
      const inputArray = node.inputs.map((inputName) => {
        var _a2;
        return (_a2 = this.resolved.get(this.baseVarName(inputName))) == null ? void 0 : _a2.value;
      });
      const lastInputArray = this.inputArray.get(id);
      let outputs;
      if (change === void 0 && this.equals(inputArray, lastInputArray)) {
        outputs = this.streams.get(id);
      } else {
        if (change === void 0) {
          outputs = node.body.apply(
            this,
            [...inputArray, this]
          );
        } else {
          this.changeList.delete(id);
          if (change !== void 0) {
            this.setResolved(id, { value: change, time: this.time });
          }
          outputs = this.streams.get(id);
        }
        this.inputArray.set(id, inputArray);
        const maybeValue = outputs;
        if (maybeValue !== void 0 && maybeValue !== null && (maybeValue.then || maybeValue[typeKey])) {
          const ev = maybeValue.then ? new PromiseEvent(maybeValue) : maybeValue;
          const newStream = ev.created(this, id);
          this.streams.set(id, newStream);
          outputs = newStream;
        } else {
          let newStream = this.types.get(id) === "Event" ? new EventStream() : new BehaviorStream();
          this.streams.set(id, newStream);
          if (maybeValue === void 0) {
            continue;
          }
          const resolved = this.resolved.get(id);
          if (!resolved || resolved.value !== maybeValue) {
            if (isGenerator(maybeValue)) {
              maybeValue.done = false;
            }
            this.setResolved(id, { value: maybeValue, time: this.time });
          }
          outputs = newStream;
        }
      }
      if (outputs === void 0) {
        continue;
      }
      if (trace) {
        trace.push({ id, inputArray, inputs: node.inputs, value: outputs });
        if (this.breakpoints.has(id)) {
          this.log(trace);
        }
      }
      const evStream = outputs;
      evStream.evaluate(this, node, inputArray, lastInputArray);
    }
    if (callConclude) {
      this.conclude();
    }
    if (this.futureScripts) {
      const { scripts, path: path2 } = this.futureScripts;
      delete this.futureScripts;
      this.setupProgram(scripts, path2);
    }
    return this.updated;
  }
  conclude() {
    for (let id of this.order) {
      const stream = this.streams.get(id);
      if (!stream) {
        continue;
      }
      stream.conclude(this, id);
    }
  }
  evalCode(arg, path2) {
    const { id, code } = arg;
    const hasWindow = typeof window !== "undefined";
    let body;
    const p2 = path2 === "" || !path2.endsWith("/") ? path2 : path2.slice(0, -1);
    if (hasWindow) {
      const base2 = window.location.origin === "null" ? window.location.pathname : window.location.origin;
      body = `return ${code} //# sourceURL=${base2}/${p2}/node/${id}`;
    } else {
      body = `return ${code} //# sourceURL=/${p2}/node/${id}`;
    }
    let func = new Function("Events", "Behaviors", "Renkon", body);
    let val = func(Events, Behaviors, this);
    val.code = code;
    return val;
  }
  ready(node) {
    const output = node.outputs;
    const stream = this.streams.get(output);
    if (stream) {
      return stream.ready(node, this);
    }
    return this.defaultReady(node);
  }
  defaultReady(node) {
    var _a2;
    for (const inputName of node.inputs) {
      const varName = this.baseVarName(inputName);
      const resolved = (_a2 = this.resolved.get(varName)) == null ? void 0 : _a2.value;
      if (resolved === void 0 && !node.forceVars.includes(inputName)) {
        return false;
      }
    }
    return true;
  }
  equals(aArray, bArray) {
    if (!Array.isArray(aArray) || !Array.isArray(bArray)) {
      return false;
    }
    if (aArray.length !== bArray.length) {
      return false;
    }
    for (let i2 = 0; i2 < aArray.length; i2++) {
      if (aArray[i2] !== bArray[i2]) {
        return false;
      }
    }
    return true;
  }
  spliceDelayedQueued(record, t2) {
    let last = -1;
    for (let i2 = 0; i2 < record.queue.length; i2++) {
      if (record.queue[i2].time >= t2) {
        break;
      }
      last = i2;
    }
    if (last < 0) {
      return void 0;
    }
    const value = record.queue[last].value;
    const newQueue = record.queue.slice(last + 1);
    record.queue = newQueue;
    return value;
  }
  getEventValue(record, _t) {
    if (record.queue.length >= 1) {
      const value = record.queue[record.queue.length - 1].value;
      record.queue = [];
      return value;
    }
    return void 0;
  }
  getEventValues(record, _t) {
    if (record.queue.length >= 1) {
      const value = record.queue.map((pair) => pair.value);
      record.queue = [];
      return value;
    }
    return void 0;
  }
  baseVarName(varName) {
    return varName[0] !== "$" ? varName : varName.slice(1);
  }
  registerEvent(receiver, value) {
    const stream = this.streams.get(receiver);
    if (!stream) {
      return;
    }
    if (stream.queued) {
      let ary = this.changeList.get(receiver);
      if (!ary) {
        ary = [];
        this.changeList.set(receiver, ary);
      }
      ary.push(value);
    } else {
      this.changeList.set(receiver, value);
    }
    if (this.noTicking) {
      this.noTickingEvaluationRequest();
    }
  }
  setResolved(varName, value) {
    this.resolved.set(varName, value);
    this.updated = true;
    if (this.noTicking) {
      this.noTickingEvaluationRequest();
    }
  }
  setResolvedForSubgraph(varName, value) {
    this.setResolved(varName, value);
    this.inputArray.set(varName, []);
    this.streams.set(varName, new BehaviorStream());
  }
  merge(...funcs) {
    let scripts = this.scripts;
    const outputs = [];
    funcs.forEach((func) => {
      const { output } = getFunctionBody(func.toString(), true);
      outputs.push(output);
    });
    this.updateProgram([...scripts, ...outputs]);
  }
  loadTS(path) {
    let i = 0;
    return fetch(path).then((resp) => resp.text()).then((text) => {
      const js = translateTS(text, `${i}.ts`);
      if (!js) {
        return null;
      }
      let dataURL = URL.createObjectURL(new Blob([js], { type: "application/javascript" }));
      return eval(`import("${dataURL}")`).then((mod) => {
        return mod;
      }).finally(() => {
        URL.revokeObjectURL(dataURL);
      });
    });
  }
  component(argFunc) {
    const func = typeof argFunc === "string" ? Function(`return ` + argFunc)() : argFunc;
    const funcString = typeof argFunc === "string" ? argFunc : argFunc.toString();
    return (input, key) => {
      let programState;
      let returnValues = null;
      let newProgramState = false;
      let subProgramState = this.programStates.get(key);
      if (!subProgramState) {
        newProgramState = true;
        programState = new ProgramState(this.time);
        programState.lastReturned = void 0;
      } else {
        programState = subProgramState.programState;
        returnValues = subProgramState.returnArray;
      }
      const maybeOldFunc = subProgramState == null ? void 0 : subProgramState.funcString;
      if (newProgramState || funcString !== maybeOldFunc) {
        const { params, returnValues: r, output } = getFunctionBody(funcString, false);
        returnValues = r;
        const receivers = params.map((r2) => `const ${r2} = Events.receiver();`).join("\n");
        programState.setupProgram([receivers, output], func.name);
        this.programStates.set(key, { programState, funcString, returnArray: r });
      }
      const trigger = (input2) => {
        for (let key2 in input2) {
          programState.setResolvedForSubgraph(
            key2,
            { value: input2[key2], time: this.time }
          );
        }
        programState.evaluate(this.time, false);
        const result = {};
        const resultTest = [];
        if (returnValues) {
          if (Array.isArray(returnValues)) {
            for (const n2 of returnValues) {
              const v2 = programState.resolved.get(n2);
              resultTest.push(v2 ? v2.value : void 0);
              if (v2 && v2.value !== void 0) {
                result[n2] = v2.value;
              }
            }
          } else {
            for (const k2 of Object.keys(returnValues)) {
              const v2 = programState.resolved.get(returnValues[k2]);
              resultTest.push(v2 ? v2.value : void 0);
              if (v2 && v2.value !== void 0) {
                result[k2] = v2.value;
              }
            }
          }
        }
        programState.conclude();
        return result;
      };
      return trigger(input);
    };
  }
  renkonify(func, optSystem) {
    const programState = new ProgramState(0, optSystem);
    const { params, returnValues, output } = getFunctionBody(func.toString(), false);
    const self = this;
    const receivers = params.map((r) => `const ${r} = undefined;`).join("\n");
    programState.setupProgram([receivers, output]);
    function generator(params2) {
      const gen = renkonBody(params2);
      gen.done = false;
      return Events.create(self).next(gen);
    }
    async function* renkonBody(args) {
      let lastYielded = void 0;
      for (let key in args) {
        programState.setResolvedForSubgraph(
          key,
          { value: args[key], time: self.time }
        );
      }
      while (true) {
        programState.evaluate(self.time);
        const result = {};
        const resultTest = [];
        if (returnValues && Array.isArray(returnValues)) {
          for (const n2 of returnValues) {
            const v2 = programState.resolved.get(n2);
            resultTest.push(v2 ? v2.value : void 0);
            if (v2 && v2.value !== void 0) {
              result[n2] = v2.value;
            }
          }
        }
        if (returnValues) {
          for (const k2 of Object.keys(returnValues)) {
            const v2 = programState.resolved.get(returnValues[k2]);
            resultTest.push(v2 ? v2.value : void 0);
            if (v2 && v2.value !== void 0) {
              result[k2] = v2.value;
            }
          }
        }
        yield !self.equals(lastYielded, resultTest) ? result : void 0;
        lastYielded = resultTest;
      }
    }
    return generator;
  }
  evaluateSubProgram(programState, params) {
    for (let key in params) {
      programState.registerEvent(key, params[key]);
    }
    programState.evaluate(this.time);
    if (!programState.updated) {
      return void 0;
    }
    const result = {};
    if (programState.exports) {
      for (const n2 of programState.exports) {
        const v2 = programState.resolved.get(n2);
        if (v2 && v2.value !== void 0) {
          result[n2] = v2.value;
        }
      }
    }
    return result;
  }
  spaceURL(partialURL) {
    if (/^http(s)?:\/\//.test(partialURL)) {
      return partialURL;
    }
    if (partialURL.startsWith("/")) {
      const url = new URL(window.location.toString());
      const maybeHost = url.searchParams.get("host") || url.host;
      return `${url.protocol}//${maybeHost}}${partialURL}`;
    }
    return partialURL;
  }
  addBreakpoint(...ids) {
    ids.forEach((id) => {
      this.breakpoints.add(id);
    });
  }
  removeBreakpoint(...ids) {
    ids.forEach((id) => {
      this.breakpoints.delete(id);
    });
  }
  resetBreakpoint() {
    this.breakpoints = /* @__PURE__ */ new Set();
  }
  setLog(func) {
    this.log = func;
  }
}
function transpileJSX(code) {
  const node = parseJSX(code);
  const result = rewriteJSX(node.body[0], code);
  if (typeof result === "string") {
    return result;
  }
  return result.flat(Infinity).join("");
}
function rewriteJSX(body, code) {
  function translate(body2) {
    if (body2.type === "JSXElement") {
      const result = [];
      const opening = translate(body2.openingElement);
      const children = body2.children.map((c2) => translate(c2));
      result.push(`h(`);
      result.push(...opening);
      if (children.length > 0) {
        const list2 = [children[0]];
        for (let i2 = 1; i2 < children.length; i2++) {
          list2.push(", ");
          list2.push(children[i2]);
        }
        result.push(", ");
        result.push(list2);
      }
      result.push(")");
      return result;
    } else if (body2.type === "JSXExpressionContainer") {
      return translate(body2.expression);
    } else if (body2.type === "JSXSpreadChild") {
      return "";
    } else if (body2.type === "JSXClosingFragment") {
      return body2.name;
    } else if (body2.type === "JSXEmptyExpression") {
      return "";
    } else if (body2.type === "JSXIdentifier") {
      return body2.name;
    } else if (body2.type === "JSXOpeningFragment") {
      return body2.name;
    } else if (body2.type === "JSXText") {
      return `"${body2.value}"`;
    } else if (body2.type === "JSXSpreadAttribute") {
      return "";
    } else if (body2.type === "JSXAttribute") {
      return [translate(body2.name), ": ", translate(body2.value)];
    } else if (body2.type === "JSXMemberExpression") {
      return "";
    } else if (body2.type === "JSXNamespacedName") {
      return "";
    } else if (body2.type === "JSXOpeningElement") {
      const tag = translate(body2.name);
      const attributes = body2.attributes.map((a2) => translate(a2));
      const attrs = [];
      if (attributes.length > 0) {
        for (let i2 = 0; i2 < attributes.length; i2++) {
          if (i2 !== 0) {
            attrs.push(", ");
          }
          attrs.push(attributes[i2]);
        }
      }
      return [`"${tag}"`, ", ", "{", ...attrs, "}"];
    } else if (body2.type === "JSXClosingElement") {
      return "";
    } else if (body2.type === "JSXFragment") {
      return "";
    } else if (body2.type === "ExpressionStatement") {
      return translate(body2.expression);
    } else if (body2.type === "Identifier") {
      return body2.name;
    } else if (body2.type === "Literal") {
      return body2.raw;
    }
    return code.slice(body2.start, body2.end);
  }
  return translate(body);
}
export {
  ProgramState,
  globals,
  parseJSX,
  translateTS,
  transpileJSX,
  version
};
