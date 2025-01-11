var __defProp = Object.defineProperty, __defNormalProp = (s, e, r) => e in s ? __defProp(s, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : s[e] = r, __publicField = (s, e, r) => __defNormalProp(s, typeof e != "symbol" ? e + "" : e, r), _a$1, _b, astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191], nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･", nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
}, ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
}, keywordRelationalOperator = /^in(stanceof)?$/, nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]"), nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(s, e) {
  for (var r = 65536, R = 0; R < e.length; R += 2) {
    if (r += e[R], r > s)
      return !1;
    if (r += e[R + 1], r >= s)
      return !0;
  }
  return !1;
}
function isIdentifierStart(s, e) {
  return s < 65 ? s === 36 : s < 91 ? !0 : s < 97 ? s === 95 : s < 123 ? !0 : s <= 65535 ? s >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(s)) : e === !1 ? !1 : isInAstralSet(s, astralIdentifierStartCodes);
}
function isIdentifierChar(s, e) {
  return s < 48 ? s === 36 : s < 58 ? !0 : s < 65 ? !1 : s < 91 ? !0 : s < 97 ? s === 95 : s < 123 ? !0 : s <= 65535 ? s >= 170 && nonASCIIidentifier.test(String.fromCharCode(s)) : e === !1 ? !1 : isInAstralSet(s, astralIdentifierStartCodes) || isInAstralSet(s, astralIdentifierCodes);
}
var TokenType = function(e, r) {
  r === void 0 && (r = {}), this.label = e, this.keyword = r.keyword, this.beforeExpr = !!r.beforeExpr, this.startsExpr = !!r.startsExpr, this.isLoop = !!r.isLoop, this.isAssign = !!r.isAssign, this.prefix = !!r.prefix, this.postfix = !!r.postfix, this.binop = r.binop || null, this.updateContext = null;
};
function binop(s, e) {
  return new TokenType(s, { beforeExpr: !0, binop: e });
}
var beforeExpr = { beforeExpr: !0 }, startsExpr = { startsExpr: !0 }, keywords = {};
function kw(s, e) {
  return e === void 0 && (e = {}), e.keyword = s, keywords[s] = new TokenType(s, e);
}
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: !0, startsExpr: !0 }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: !0, startsExpr: !0 }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: !0, startsExpr: !0 }),
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
  dollarBraceL: new TokenType("${", { beforeExpr: !0, startsExpr: !0 }),
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
  eq: new TokenType("=", { beforeExpr: !0, isAssign: !0 }),
  assign: new TokenType("_=", { beforeExpr: !0, isAssign: !0 }),
  incDec: new TokenType("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }),
  prefix: new TokenType("!/~", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: !0, binop: 9, prefix: !0, startsExpr: !0 }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: !0 }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: !0, beforeExpr: !0 }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: !0 }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: !0 }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: !0, startsExpr: !0 }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: !0, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: !0, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _void: kw("void", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _delete: kw("delete", { beforeExpr: !0, prefix: !0, startsExpr: !0 })
}, lineBreak = /\r\n?|\n|\u2028|\u2029/, lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(s) {
  return s === 10 || s === 13 || s === 8232 || s === 8233;
}
function nextLineBreak(s, e, r) {
  r === void 0 && (r = s.length);
  for (var R = e; R < r; R++) {
    var B = s.charCodeAt(R);
    if (isNewLine(B))
      return R < r - 1 && B === 13 && s.charCodeAt(R + 1) === 10 ? R + 2 : R + 1;
  }
  return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, ref = Object.prototype, hasOwnProperty$1 = ref.hasOwnProperty, toString$2 = ref.toString, hasOwn = Object.hasOwn || function(s, e) {
  return hasOwnProperty$1.call(s, e);
}, isArray = Array.isArray || function(s) {
  return toString$2.call(s) === "[object Array]";
}, regexpCache = /* @__PURE__ */ Object.create(null);
function wordsRegexp(s) {
  return regexpCache[s] || (regexpCache[s] = new RegExp("^(?:" + s.replace(/ /g, "|") + ")$"));
}
function codePointToString(s) {
  return s <= 65535 ? String.fromCharCode(s) : (s -= 65536, String.fromCharCode((s >> 10) + 55296, (s & 1023) + 56320));
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, Position = function(e, r) {
  this.line = e, this.column = r;
};
Position.prototype.offset = function(e) {
  return new Position(this.line, this.column + e);
};
var SourceLocation = function(e, r, R) {
  this.start = r, this.end = R, e.sourceFile !== null && (this.source = e.sourceFile);
};
function getLineInfo(s, e) {
  for (var r = 1, R = 0; ; ) {
    var B = nextLineBreak(s, R, e);
    if (B < 0)
      return new Position(r, e - R);
    ++r, R = B;
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
  allowReturnOutsideFunction: !1,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: !1,
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
  allowHashBang: !1,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: !0,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: !1,
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
  ranges: !1,
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
  preserveParens: !1
}, warnedAboutEcmaVersion = !1;
function getOptions(s) {
  var e = {};
  for (var r in defaultOptions)
    e[r] = s && hasOwn(s, r) ? s[r] : defaultOptions[r];
  if (e.ecmaVersion === "latest" ? e.ecmaVersion = 1e8 : e.ecmaVersion == null ? (!warnedAboutEcmaVersion && typeof console == "object" && console.warn && (warnedAboutEcmaVersion = !0, console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)), e.ecmaVersion = 11) : e.ecmaVersion >= 2015 && (e.ecmaVersion -= 2009), e.allowReserved == null && (e.allowReserved = e.ecmaVersion < 5), (!s || s.allowHashBang == null) && (e.allowHashBang = e.ecmaVersion >= 14), isArray(e.onToken)) {
    var R = e.onToken;
    e.onToken = function(B) {
      return R.push(B);
    };
  }
  return isArray(e.onComment) && (e.onComment = pushComment(e, e.onComment)), e;
}
function pushComment(s, e) {
  return function(r, R, B, _, $, F) {
    var V = {
      type: r ? "Block" : "Line",
      value: R,
      start: B,
      end: _
    };
    s.locations && (V.loc = new SourceLocation(this, $, F)), s.ranges && (V.range = [B, _]), e.push(V);
  };
}
var SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128, SCOPE_CLASS_STATIC_BLOCK = 256, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(s, e) {
  return SCOPE_FUNCTION | (s ? SCOPE_ASYNC : 0) | (e ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5, Parser$1 = function(e, r, R) {
  this.options = e = getOptions(e), this.sourceFile = e.sourceFile, this.keywords = wordsRegexp(keywords$1[e.ecmaVersion >= 6 ? 6 : e.sourceType === "module" ? "5module" : 5]);
  var B = "";
  e.allowReserved !== !0 && (B = reservedWords[e.ecmaVersion >= 6 ? 6 : e.ecmaVersion === 5 ? 5 : 3], e.sourceType === "module" && (B += " await")), this.reservedWords = wordsRegexp(B);
  var _ = (B ? B + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(_), this.reservedWordsStrictBind = wordsRegexp(_ + " " + reservedWords.strictBind), this.input = String(r), this.containsEsc = !1, R ? (this.pos = R, this.lineStart = this.input.lastIndexOf(`
`, R - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = types$1.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = e.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), this.pos === 0 && e.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(SCOPE_TOP), this.regexpState = null, this.privateNameStack = [];
}, prototypeAccessors = { inFunction: { configurable: !0 }, inGenerator: { configurable: !0 }, inAsync: { configurable: !0 }, canAwait: { configurable: !0 }, allowSuper: { configurable: !0 }, allowDirectSuper: { configurable: !0 }, treatFunctionsAsVar: { configurable: !0 }, allowNewDotTarget: { configurable: !0 }, inClassStaticBlock: { configurable: !0 } };
Parser$1.prototype.parse = function() {
  var e = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(e);
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.canAwait.get = function() {
  for (var s = this.scopeStack.length - 1; s >= 0; s--) {
    var e = this.scopeStack[s];
    if (e.inClassFieldInit || e.flags & SCOPE_CLASS_STATIC_BLOCK)
      return !1;
    if (e.flags & SCOPE_FUNCTION)
      return (e.flags & SCOPE_ASYNC) > 0;
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
  var s = this.currentThisScope(), e = s.flags, r = s.inClassFieldInit;
  return (e & SCOPE_SUPER) > 0 || r || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  var s = this.currentThisScope(), e = s.flags, r = s.inClassFieldInit;
  return (e & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || r;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser$1.extend = function() {
  for (var e = [], r = arguments.length; r--; ) e[r] = arguments[r];
  for (var R = this, B = 0; B < e.length; B++)
    R = e[B](R);
  return R;
};
Parser$1.parse = function(e, r) {
  return new this(r, e).parse();
};
Parser$1.parseExpressionAt = function(e, r, R) {
  var B = new this(R, e, r);
  return B.nextToken(), B.parseExpression();
};
Parser$1.tokenizer = function(e, r) {
  return new this(r, e);
};
Object.defineProperties(Parser$1.prototype, prototypeAccessors);
var pp$9 = Parser$1.prototype, literal$1 = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(s) {
  if (this.options.ecmaVersion < 5)
    return !1;
  for (; ; ) {
    skipWhiteSpace.lastIndex = s, s += skipWhiteSpace.exec(this.input)[0].length;
    var e = literal$1.exec(this.input.slice(s));
    if (!e)
      return !1;
    if ((e[1] || e[2]) === "use strict") {
      skipWhiteSpace.lastIndex = s + e[0].length;
      var r = skipWhiteSpace.exec(this.input), R = r.index + r[0].length, B = this.input.charAt(R);
      return B === ";" || B === "}" || lineBreak.test(r[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(B) || B === "!" && this.input.charAt(R + 1) === "=");
    }
    s += e[0].length, skipWhiteSpace.lastIndex = s, s += skipWhiteSpace.exec(this.input)[0].length, this.input[s] === ";" && s++;
  }
};
pp$9.eat = function(s) {
  return this.type === s ? (this.next(), !0) : !1;
};
pp$9.isContextual = function(s) {
  return this.type === types$1.name && this.value === s && !this.containsEsc;
};
pp$9.eatContextual = function(s) {
  return this.isContextual(s) ? (this.next(), !0) : !1;
};
pp$9.expectContextual = function(s) {
  this.eatContextual(s) || this.unexpected();
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon())
    return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
};
pp$9.semicolon = function() {
  !this.eat(types$1.semi) && !this.insertSemicolon() && this.unexpected();
};
pp$9.afterTrailingComma = function(s, e) {
  if (this.type === s)
    return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), e || this.next(), !0;
};
pp$9.expect = function(s) {
  this.eat(s) || this.unexpected();
};
pp$9.unexpected = function(s) {
  this.raise(s ?? this.start, "Unexpected token");
};
var DestructuringErrors = function() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(s, e) {
  if (s) {
    s.trailingComma > -1 && this.raiseRecoverable(s.trailingComma, "Comma is not permitted after the rest element");
    var r = e ? s.parenthesizedAssign : s.parenthesizedBind;
    r > -1 && this.raiseRecoverable(r, e ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(s, e) {
  if (!s)
    return !1;
  var r = s.shorthandAssign, R = s.doubleProto;
  if (!e)
    return r >= 0 || R >= 0;
  r >= 0 && this.raise(r, "Shorthand property assignments are valid only in destructuring patterns"), R >= 0 && this.raiseRecoverable(R, "Redefinition of __proto__ property");
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
};
pp$9.isSimpleAssignTarget = function(s) {
  return s.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(s.expression) : s.type === "Identifier" || s.type === "MemberExpression";
};
var pp$8 = Parser$1.prototype;
pp$8.parseTopLevel = function(s) {
  var e = /* @__PURE__ */ Object.create(null);
  for (s.body || (s.body = []); this.type !== types$1.eof; ) {
    var r = this.parseStatement(null, !0, e);
    s.body.push(r);
  }
  if (this.inModule)
    for (var R = 0, B = Object.keys(this.undefinedExports); R < B.length; R += 1) {
      var _ = B[R];
      this.raiseRecoverable(this.undefinedExports[_].start, "Export '" + _ + "' is not defined");
    }
  return this.adaptDirectivePrologue(s.body), this.next(), s.sourceType = this.options.sourceType, this.finishNode(s, "Program");
};
var loopLabel = { kind: "loop" }, switchLabel = { kind: "switch" };
pp$8.isLet = function(s) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
    return !1;
  skipWhiteSpace.lastIndex = this.pos;
  var e = skipWhiteSpace.exec(this.input), r = this.pos + e[0].length, R = this.input.charCodeAt(r);
  if (R === 91 || R === 92)
    return !0;
  if (s)
    return !1;
  if (R === 123 || R > 55295 && R < 56320)
    return !0;
  if (isIdentifierStart(R, !0)) {
    for (var B = r + 1; isIdentifierChar(R = this.input.charCodeAt(B), !0); )
      ++B;
    if (R === 92 || R > 55295 && R < 56320)
      return !0;
    var _ = this.input.slice(r, B);
    if (!keywordRelationalOperator.test(_))
      return !0;
  }
  return !1;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
    return !1;
  skipWhiteSpace.lastIndex = this.pos;
  var s = skipWhiteSpace.exec(this.input), e = this.pos + s[0].length, r;
  return !lineBreak.test(this.input.slice(this.pos, e)) && this.input.slice(e, e + 8) === "function" && (e + 8 === this.input.length || !(isIdentifierChar(r = this.input.charCodeAt(e + 8)) || r > 55295 && r < 56320));
};
pp$8.parseStatement = function(s, e, r) {
  var R = this.type, B = this.startNode(), _;
  switch (this.isLet(s) && (R = types$1._var, _ = "let"), R) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(B, R.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(B);
    case types$1._do:
      return this.parseDoStatement(B);
    case types$1._for:
      return this.parseForStatement(B);
    case types$1._function:
      return s && (this.strict || s !== "if" && s !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(B, !1, !s);
    case types$1._class:
      return s && this.unexpected(), this.parseClass(B, !0);
    case types$1._if:
      return this.parseIfStatement(B);
    case types$1._return:
      return this.parseReturnStatement(B);
    case types$1._switch:
      return this.parseSwitchStatement(B);
    case types$1._throw:
      return this.parseThrowStatement(B);
    case types$1._try:
      return this.parseTryStatement(B);
    case types$1._const:
    case types$1._var:
      return _ = _ || this.value, s && _ !== "var" && this.unexpected(), this.parseVarStatement(B, _);
    case types$1._while:
      return this.parseWhileStatement(B);
    case types$1._with:
      return this.parseWithStatement(B);
    case types$1.braceL:
      return this.parseBlock(!0, B);
    case types$1.semi:
      return this.parseEmptyStatement(B);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && R === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var $ = skipWhiteSpace.exec(this.input), F = this.pos + $[0].length, V = this.input.charCodeAt(F);
        if (V === 40 || V === 46)
          return this.parseExpressionStatement(B, this.parseExpression());
      }
      return this.options.allowImportExportEverywhere || (e || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), R === types$1._import ? this.parseImport(B) : this.parseExport(B, r);
    default:
      if (this.isAsyncFunction())
        return s && this.unexpected(), this.next(), this.parseFunctionStatement(B, !0, !s);
      var H = this.value, W = this.parseExpression();
      return R === types$1.name && W.type === "Identifier" && this.eat(types$1.colon) ? this.parseLabeledStatement(B, H, W, s) : this.parseExpressionStatement(B, W);
  }
};
pp$8.parseBreakContinueStatement = function(s, e) {
  var r = e === "break";
  this.next(), this.eat(types$1.semi) || this.insertSemicolon() ? s.label = null : this.type !== types$1.name ? this.unexpected() : (s.label = this.parseIdent(), this.semicolon());
  for (var R = 0; R < this.labels.length; ++R) {
    var B = this.labels[R];
    if ((s.label == null || B.name === s.label.name) && (B.kind != null && (r || B.kind === "loop") || s.label && r))
      break;
  }
  return R === this.labels.length && this.raise(s.start, "Unsyntactic " + e), this.finishNode(s, r ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(s) {
  return this.next(), this.semicolon(), this.finishNode(s, "DebuggerStatement");
};
pp$8.parseDoStatement = function(s) {
  return this.next(), this.labels.push(loopLabel), s.body = this.parseStatement("do"), this.labels.pop(), this.expect(types$1._while), s.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(types$1.semi) : this.semicolon(), this.finishNode(s, "DoWhileStatement");
};
pp$8.parseForStatement = function(s) {
  this.next();
  var e = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  if (this.labels.push(loopLabel), this.enterScope(0), this.expect(types$1.parenL), this.type === types$1.semi)
    return e > -1 && this.unexpected(e), this.parseFor(s, null);
  var r = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || r) {
    var R = this.startNode(), B = r ? "let" : this.value;
    return this.next(), this.parseVar(R, !0, B), this.finishNode(R, "VariableDeclaration"), (this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && R.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === types$1._in ? e > -1 && this.unexpected(e) : s.await = e > -1), this.parseForIn(s, R)) : (e > -1 && this.unexpected(e), this.parseFor(s, R));
  }
  var _ = this.isContextual("let"), $ = !1, F = this.containsEsc, V = new DestructuringErrors(), H = this.start, W = e > -1 ? this.parseExprSubscripts(V, "await") : this.parseExpression(!0, V);
  return this.type === types$1._in || ($ = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (e > -1 ? (this.type === types$1._in && this.unexpected(e), s.await = !0) : $ && this.options.ecmaVersion >= 8 && (W.start === H && !F && W.type === "Identifier" && W.name === "async" ? this.unexpected() : this.options.ecmaVersion >= 9 && (s.await = !1)), _ && $ && this.raise(W.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(W, !1, V), this.checkLValPattern(W), this.parseForIn(s, W)) : (this.checkExpressionErrors(V, !0), e > -1 && this.unexpected(e), this.parseFor(s, W));
};
pp$8.parseFunctionStatement = function(s, e, r) {
  return this.next(), this.parseFunction(s, FUNC_STATEMENT | (r ? 0 : FUNC_HANGING_STATEMENT), !1, e);
};
pp$8.parseIfStatement = function(s) {
  return this.next(), s.test = this.parseParenExpression(), s.consequent = this.parseStatement("if"), s.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null, this.finishNode(s, "IfStatement");
};
pp$8.parseReturnStatement = function(s) {
  return !this.inFunction && !this.options.allowReturnOutsideFunction && this.raise(this.start, "'return' outside of function"), this.next(), this.eat(types$1.semi) || this.insertSemicolon() ? s.argument = null : (s.argument = this.parseExpression(), this.semicolon()), this.finishNode(s, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(s) {
  this.next(), s.discriminant = this.parseParenExpression(), s.cases = [], this.expect(types$1.braceL), this.labels.push(switchLabel), this.enterScope(0);
  for (var e, r = !1; this.type !== types$1.braceR; )
    if (this.type === types$1._case || this.type === types$1._default) {
      var R = this.type === types$1._case;
      e && this.finishNode(e, "SwitchCase"), s.cases.push(e = this.startNode()), e.consequent = [], this.next(), R ? e.test = this.parseExpression() : (r && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), r = !0, e.test = null), this.expect(types$1.colon);
    } else
      e || this.unexpected(), e.consequent.push(this.parseStatement(null));
  return this.exitScope(), e && this.finishNode(e, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(s, "SwitchStatement");
};
pp$8.parseThrowStatement = function(s) {
  return this.next(), lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), s.argument = this.parseExpression(), this.semicolon(), this.finishNode(s, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
  var s = this.parseBindingAtom(), e = s.type === "Identifier";
  return this.enterScope(e ? SCOPE_SIMPLE_CATCH : 0), this.checkLValPattern(s, e ? BIND_SIMPLE_CATCH : BIND_LEXICAL), this.expect(types$1.parenR), s;
};
pp$8.parseTryStatement = function(s) {
  if (this.next(), s.block = this.parseBlock(), s.handler = null, this.type === types$1._catch) {
    var e = this.startNode();
    this.next(), this.eat(types$1.parenL) ? e.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), e.param = null, this.enterScope(0)), e.body = this.parseBlock(!1), this.exitScope(), s.handler = this.finishNode(e, "CatchClause");
  }
  return s.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null, !s.handler && !s.finalizer && this.raise(s.start, "Missing catch or finally clause"), this.finishNode(s, "TryStatement");
};
pp$8.parseVarStatement = function(s, e, r) {
  return this.next(), this.parseVar(s, !1, e, r), this.semicolon(), this.finishNode(s, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(s) {
  return this.next(), s.test = this.parseParenExpression(), this.labels.push(loopLabel), s.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(s, "WhileStatement");
};
pp$8.parseWithStatement = function(s) {
  return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), s.object = this.parseParenExpression(), s.body = this.parseStatement("with"), this.finishNode(s, "WithStatement");
};
pp$8.parseEmptyStatement = function(s) {
  return this.next(), this.finishNode(s, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(s, e, r, R) {
  for (var B = 0, _ = this.labels; B < _.length; B += 1) {
    var $ = _[B];
    $.name === e && this.raise(r.start, "Label '" + e + "' is already declared");
  }
  for (var F = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null, V = this.labels.length - 1; V >= 0; V--) {
    var H = this.labels[V];
    if (H.statementStart === s.start)
      H.statementStart = this.start, H.kind = F;
    else
      break;
  }
  return this.labels.push({ name: e, kind: F, statementStart: this.start }), s.body = this.parseStatement(R ? R.indexOf("label") === -1 ? R + "label" : R : "label"), this.labels.pop(), s.label = r, this.finishNode(s, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(s, e) {
  return s.expression = e, this.semicolon(), this.finishNode(s, "ExpressionStatement");
};
pp$8.parseBlock = function(s, e, r) {
  for (s === void 0 && (s = !0), e === void 0 && (e = this.startNode()), e.body = [], this.expect(types$1.braceL), s && this.enterScope(0); this.type !== types$1.braceR; ) {
    var R = this.parseStatement(null);
    e.body.push(R);
  }
  return r && (this.strict = !1), this.next(), s && this.exitScope(), this.finishNode(e, "BlockStatement");
};
pp$8.parseFor = function(s, e) {
  return s.init = e, this.expect(types$1.semi), s.test = this.type === types$1.semi ? null : this.parseExpression(), this.expect(types$1.semi), s.update = this.type === types$1.parenR ? null : this.parseExpression(), this.expect(types$1.parenR), s.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(s, "ForStatement");
};
pp$8.parseForIn = function(s, e) {
  var r = this.type === types$1._in;
  return this.next(), e.type === "VariableDeclaration" && e.declarations[0].init != null && (!r || this.options.ecmaVersion < 8 || this.strict || e.kind !== "var" || e.declarations[0].id.type !== "Identifier") && this.raise(
    e.start,
    (r ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
  ), s.left = e, s.right = r ? this.parseExpression() : this.parseMaybeAssign(), this.expect(types$1.parenR), s.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(s, r ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(s, e, r, R) {
  for (s.declarations = [], s.kind = r; ; ) {
    var B = this.startNode();
    if (this.parseVarId(B, r), this.eat(types$1.eq) ? B.init = this.parseMaybeAssign(e) : !R && r === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : !R && B.id.type !== "Identifier" && !(e && (this.type === types$1._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : B.init = null, s.declarations.push(this.finishNode(B, "VariableDeclarator")), !this.eat(types$1.comma))
      break;
  }
  return s;
};
pp$8.parseVarId = function(s, e) {
  s.id = this.parseBindingAtom(), this.checkLValPattern(s.id, e === "var" ? BIND_VAR : BIND_LEXICAL, !1);
};
var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(s, e, r, R, B) {
  this.initFunction(s), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !R) && (this.type === types$1.star && e & FUNC_HANGING_STATEMENT && this.unexpected(), s.generator = this.eat(types$1.star)), this.options.ecmaVersion >= 8 && (s.async = !!R), e & FUNC_STATEMENT && (s.id = e & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent(), s.id && !(e & FUNC_HANGING_STATEMENT) && this.checkLValSimple(s.id, this.strict || s.generator || s.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION));
  var _ = this.yieldPos, $ = this.awaitPos, F = this.awaitIdentPos;
  return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(s.async, s.generator)), e & FUNC_STATEMENT || (s.id = this.type === types$1.name ? this.parseIdent() : null), this.parseFunctionParams(s), this.parseFunctionBody(s, r, !1, B), this.yieldPos = _, this.awaitPos = $, this.awaitIdentPos = F, this.finishNode(s, e & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(s) {
  this.expect(types$1.parenL), s.params = this.parseBindingList(types$1.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(s, e) {
  this.next();
  var r = this.strict;
  this.strict = !0, this.parseClassId(s, e), this.parseClassSuper(s);
  var R = this.enterClassBody(), B = this.startNode(), _ = !1;
  for (B.body = [], this.expect(types$1.braceL); this.type !== types$1.braceR; ) {
    var $ = this.parseClassElement(s.superClass !== null);
    $ && (B.body.push($), $.type === "MethodDefinition" && $.kind === "constructor" ? (_ && this.raiseRecoverable($.start, "Duplicate constructor in the same class"), _ = !0) : $.key && $.key.type === "PrivateIdentifier" && isPrivateNameConflicted(R, $) && this.raiseRecoverable($.key.start, "Identifier '#" + $.key.name + "' has already been declared"));
  }
  return this.strict = r, this.next(), s.body = this.finishNode(B, "ClassBody"), this.exitClassBody(), this.finishNode(s, e ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(s) {
  if (this.eat(types$1.semi))
    return null;
  var e = this.options.ecmaVersion, r = this.startNode(), R = "", B = !1, _ = !1, $ = "method", F = !1;
  if (this.eatContextual("static")) {
    if (e >= 13 && this.eat(types$1.braceL))
      return this.parseClassStaticBlock(r), r;
    this.isClassElementNameStart() || this.type === types$1.star ? F = !0 : R = "static";
  }
  if (r.static = F, !R && e >= 8 && this.eatContextual("async") && ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon() ? _ = !0 : R = "async"), !R && (e >= 9 || !_) && this.eat(types$1.star) && (B = !0), !R && !_ && !B) {
    var V = this.value;
    (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? $ = V : R = V);
  }
  if (R ? (r.computed = !1, r.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), r.key.name = R, this.finishNode(r.key, "Identifier")) : this.parseClassElementName(r), e < 13 || this.type === types$1.parenL || $ !== "method" || B || _) {
    var H = !r.static && checkKeyName(r, "constructor"), W = H && s;
    H && $ !== "method" && this.raise(r.key.start, "Constructor can't have get/set modifier"), r.kind = H ? "constructor" : $, this.parseClassMethod(r, B, _, W);
  } else
    this.parseClassField(r);
  return r;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(s) {
  this.type === types$1.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), s.computed = !1, s.key = this.parsePrivateIdent()) : this.parsePropertyName(s);
};
pp$8.parseClassMethod = function(s, e, r, R) {
  var B = s.key;
  s.kind === "constructor" ? (e && this.raise(B.start, "Constructor can't be a generator"), r && this.raise(B.start, "Constructor can't be an async method")) : s.static && checkKeyName(s, "prototype") && this.raise(B.start, "Classes may not have a static property named prototype");
  var _ = s.value = this.parseMethod(e, r, R);
  return s.kind === "get" && _.params.length !== 0 && this.raiseRecoverable(_.start, "getter should have no params"), s.kind === "set" && _.params.length !== 1 && this.raiseRecoverable(_.start, "setter should have exactly one param"), s.kind === "set" && _.params[0].type === "RestElement" && this.raiseRecoverable(_.params[0].start, "Setter cannot use rest params"), this.finishNode(s, "MethodDefinition");
};
pp$8.parseClassField = function(s) {
  if (checkKeyName(s, "constructor") ? this.raise(s.key.start, "Classes can't have a field named 'constructor'") : s.static && checkKeyName(s, "prototype") && this.raise(s.key.start, "Classes can't have a static field named 'prototype'"), this.eat(types$1.eq)) {
    var e = this.currentThisScope(), r = e.inClassFieldInit;
    e.inClassFieldInit = !0, s.value = this.parseMaybeAssign(), e.inClassFieldInit = r;
  } else
    s.value = null;
  return this.semicolon(), this.finishNode(s, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(s) {
  s.body = [];
  var e = this.labels;
  for (this.labels = [], this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER); this.type !== types$1.braceR; ) {
    var r = this.parseStatement(null);
    s.body.push(r);
  }
  return this.next(), this.exitScope(), this.labels = e, this.finishNode(s, "StaticBlock");
};
pp$8.parseClassId = function(s, e) {
  this.type === types$1.name ? (s.id = this.parseIdent(), e && this.checkLValSimple(s.id, BIND_LEXICAL, !1)) : (e === !0 && this.unexpected(), s.id = null);
};
pp$8.parseClassSuper = function(s) {
  s.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, !1) : null;
};
pp$8.enterClassBody = function() {
  var s = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  return this.privateNameStack.push(s), s.declared;
};
pp$8.exitClassBody = function() {
  var s = this.privateNameStack.pop(), e = s.declared, r = s.used;
  if (this.options.checkPrivateFields)
    for (var R = this.privateNameStack.length, B = R === 0 ? null : this.privateNameStack[R - 1], _ = 0; _ < r.length; ++_) {
      var $ = r[_];
      hasOwn(e, $.name) || (B ? B.used.push($) : this.raiseRecoverable($.start, "Private field '#" + $.name + "' must be declared in an enclosing class"));
    }
};
function isPrivateNameConflicted(s, e) {
  var r = e.key.name, R = s[r], B = "true";
  return e.type === "MethodDefinition" && (e.kind === "get" || e.kind === "set") && (B = (e.static ? "s" : "i") + e.kind), R === "iget" && B === "iset" || R === "iset" && B === "iget" || R === "sget" && B === "sset" || R === "sset" && B === "sget" ? (s[r] = "true", !1) : R ? !0 : (s[r] = B, !1);
}
function checkKeyName(s, e) {
  var r = s.computed, R = s.key;
  return !r && (R.type === "Identifier" && R.name === e || R.type === "Literal" && R.value === e);
}
pp$8.parseExportAllDeclaration = function(s, e) {
  return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (s.exported = this.parseModuleExportName(), this.checkExport(e, s.exported, this.lastTokStart)) : s.exported = null), this.expectContextual("from"), this.type !== types$1.string && this.unexpected(), s.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (s.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(s, "ExportAllDeclaration");
};
pp$8.parseExport = function(s, e) {
  if (this.next(), this.eat(types$1.star))
    return this.parseExportAllDeclaration(s, e);
  if (this.eat(types$1._default))
    return this.checkExport(e, "default", this.lastTokStart), s.declaration = this.parseExportDefaultDeclaration(), this.finishNode(s, "ExportDefaultDeclaration");
  if (this.shouldParseExportStatement())
    s.declaration = this.parseExportDeclaration(s), s.declaration.type === "VariableDeclaration" ? this.checkVariableExport(e, s.declaration.declarations) : this.checkExport(e, s.declaration.id, s.declaration.id.start), s.specifiers = [], s.source = null;
  else {
    if (s.declaration = null, s.specifiers = this.parseExportSpecifiers(e), this.eatContextual("from"))
      this.type !== types$1.string && this.unexpected(), s.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (s.attributes = this.parseWithClause());
    else {
      for (var r = 0, R = s.specifiers; r < R.length; r += 1) {
        var B = R[r];
        this.checkUnreserved(B.local), this.checkLocalExport(B.local), B.local.type === "Literal" && this.raise(B.local.start, "A string literal cannot be used as an exported binding without `from`.");
      }
      s.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(s, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(s) {
  return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
  var s;
  if (this.type === types$1._function || (s = this.isAsyncFunction())) {
    var e = this.startNode();
    return this.next(), s && this.next(), this.parseFunction(e, FUNC_STATEMENT | FUNC_NULLABLE_ID, !1, s);
  } else if (this.type === types$1._class) {
    var r = this.startNode();
    return this.parseClass(r, "nullableID");
  } else {
    var R = this.parseMaybeAssign();
    return this.semicolon(), R;
  }
};
pp$8.checkExport = function(s, e, r) {
  s && (typeof e != "string" && (e = e.type === "Identifier" ? e.name : e.value), hasOwn(s, e) && this.raiseRecoverable(r, "Duplicate export '" + e + "'"), s[e] = !0);
};
pp$8.checkPatternExport = function(s, e) {
  var r = e.type;
  if (r === "Identifier")
    this.checkExport(s, e, e.start);
  else if (r === "ObjectPattern")
    for (var R = 0, B = e.properties; R < B.length; R += 1) {
      var _ = B[R];
      this.checkPatternExport(s, _);
    }
  else if (r === "ArrayPattern")
    for (var $ = 0, F = e.elements; $ < F.length; $ += 1) {
      var V = F[$];
      V && this.checkPatternExport(s, V);
    }
  else r === "Property" ? this.checkPatternExport(s, e.value) : r === "AssignmentPattern" ? this.checkPatternExport(s, e.left) : r === "RestElement" && this.checkPatternExport(s, e.argument);
};
pp$8.checkVariableExport = function(s, e) {
  if (s)
    for (var r = 0, R = e; r < R.length; r += 1) {
      var B = R[r];
      this.checkPatternExport(s, B.id);
    }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(s) {
  var e = this.startNode();
  return e.local = this.parseModuleExportName(), e.exported = this.eatContextual("as") ? this.parseModuleExportName() : e.local, this.checkExport(
    s,
    e.exported,
    e.exported.start
  ), this.finishNode(e, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(s) {
  var e = [], r = !0;
  for (this.expect(types$1.braceL); !this.eat(types$1.braceR); ) {
    if (r)
      r = !1;
    else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
      break;
    e.push(this.parseExportSpecifier(s));
  }
  return e;
};
pp$8.parseImport = function(s) {
  return this.next(), this.type === types$1.string ? (s.specifiers = empty$1, s.source = this.parseExprAtom()) : (s.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), s.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (s.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(s, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
  var s = this.startNode();
  return s.imported = this.parseModuleExportName(), this.eatContextual("as") ? s.local = this.parseIdent() : (this.checkUnreserved(s.imported), s.local = s.imported), this.checkLValSimple(s.local, BIND_LEXICAL), this.finishNode(s, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
  var s = this.startNode();
  return s.local = this.parseIdent(), this.checkLValSimple(s.local, BIND_LEXICAL), this.finishNode(s, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
  var s = this.startNode();
  return this.next(), this.expectContextual("as"), s.local = this.parseIdent(), this.checkLValSimple(s.local, BIND_LEXICAL), this.finishNode(s, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
  var s = [], e = !0;
  if (this.type === types$1.name && (s.push(this.parseImportDefaultSpecifier()), !this.eat(types$1.comma)))
    return s;
  if (this.type === types$1.star)
    return s.push(this.parseImportNamespaceSpecifier()), s;
  for (this.expect(types$1.braceL); !this.eat(types$1.braceR); ) {
    if (e)
      e = !1;
    else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
      break;
    s.push(this.parseImportSpecifier());
  }
  return s;
};
pp$8.parseWithClause = function() {
  var s = [];
  if (!this.eat(types$1._with))
    return s;
  this.expect(types$1.braceL);
  for (var e = {}, r = !0; !this.eat(types$1.braceR); ) {
    if (r)
      r = !1;
    else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
      break;
    var R = this.parseImportAttribute(), B = R.key.type === "Identifier" ? R.key.name : R.key.value;
    hasOwn(e, B) && this.raiseRecoverable(R.key.start, "Duplicate attribute key '" + B + "'"), e[B] = !0, s.push(R);
  }
  return s;
};
pp$8.parseImportAttribute = function() {
  var s = this.startNode();
  return s.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"), this.expect(types$1.colon), this.type !== types$1.string && this.unexpected(), s.value = this.parseExprAtom(), this.finishNode(s, "ImportAttribute");
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var s = this.parseLiteral(this.value);
    return loneSurrogate.test(s.value) && this.raise(s.start, "An export name cannot include a lone surrogate."), s;
  }
  return this.parseIdent(!0);
};
pp$8.adaptDirectivePrologue = function(s) {
  for (var e = 0; e < s.length && this.isDirectiveCandidate(s[e]); ++e)
    s[e].directive = s[e].expression.raw.slice(1, -1);
};
pp$8.isDirectiveCandidate = function(s) {
  return this.options.ecmaVersion >= 5 && s.type === "ExpressionStatement" && s.expression.type === "Literal" && typeof s.expression.value == "string" && // Reject parenthesized strings.
  (this.input[s.start] === '"' || this.input[s.start] === "'");
};
var pp$7 = Parser$1.prototype;
pp$7.toAssignable = function(s, e, r) {
  if (this.options.ecmaVersion >= 6 && s)
    switch (s.type) {
      case "Identifier":
        this.inAsync && s.name === "await" && this.raise(s.start, "Cannot use 'await' as identifier inside an async function");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        s.type = "ObjectPattern", r && this.checkPatternErrors(r, !0);
        for (var R = 0, B = s.properties; R < B.length; R += 1) {
          var _ = B[R];
          this.toAssignable(_, e), _.type === "RestElement" && (_.argument.type === "ArrayPattern" || _.argument.type === "ObjectPattern") && this.raise(_.argument.start, "Unexpected token");
        }
        break;
      case "Property":
        s.kind !== "init" && this.raise(s.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(s.value, e);
        break;
      case "ArrayExpression":
        s.type = "ArrayPattern", r && this.checkPatternErrors(r, !0), this.toAssignableList(s.elements, e);
        break;
      case "SpreadElement":
        s.type = "RestElement", this.toAssignable(s.argument, e), s.argument.type === "AssignmentPattern" && this.raise(s.argument.start, "Rest elements cannot have a default value");
        break;
      case "AssignmentExpression":
        s.operator !== "=" && this.raise(s.left.end, "Only '=' operator can be used for specifying default value."), s.type = "AssignmentPattern", delete s.operator, this.toAssignable(s.left, e);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(s.expression, e, r);
        break;
      case "ChainExpression":
        this.raiseRecoverable(s.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!e)
          break;
      default:
        this.raise(s.start, "Assigning to rvalue");
    }
  else r && this.checkPatternErrors(r, !0);
  return s;
};
pp$7.toAssignableList = function(s, e) {
  for (var r = s.length, R = 0; R < r; R++) {
    var B = s[R];
    B && this.toAssignable(B, e);
  }
  if (r) {
    var _ = s[r - 1];
    this.options.ecmaVersion === 6 && e && _ && _.type === "RestElement" && _.argument.type !== "Identifier" && this.unexpected(_.argument.start);
  }
  return s;
};
pp$7.parseSpread = function(s) {
  var e = this.startNode();
  return this.next(), e.argument = this.parseMaybeAssign(!1, s), this.finishNode(e, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var s = this.startNode();
  return this.next(), this.options.ecmaVersion === 6 && this.type !== types$1.name && this.unexpected(), s.argument = this.parseBindingAtom(), this.finishNode(s, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
      case types$1.bracketL:
        var s = this.startNode();
        return this.next(), s.elements = this.parseBindingList(types$1.bracketR, !0, !0), this.finishNode(s, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(!0);
    }
  return this.parseIdent();
};
pp$7.parseBindingList = function(s, e, r, R) {
  for (var B = [], _ = !0; !this.eat(s); )
    if (_ ? _ = !1 : this.expect(types$1.comma), e && this.type === types$1.comma)
      B.push(null);
    else {
      if (r && this.afterTrailingComma(s))
        break;
      if (this.type === types$1.ellipsis) {
        var $ = this.parseRestBinding();
        this.parseBindingListItem($), B.push($), this.type === types$1.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(s);
        break;
      } else
        B.push(this.parseAssignableListItem(R));
    }
  return B;
};
pp$7.parseAssignableListItem = function(s) {
  var e = this.parseMaybeDefault(this.start, this.startLoc);
  return this.parseBindingListItem(e), e;
};
pp$7.parseBindingListItem = function(s) {
  return s;
};
pp$7.parseMaybeDefault = function(s, e, r) {
  if (r = r || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(types$1.eq))
    return r;
  var R = this.startNodeAt(s, e);
  return R.left = r, R.right = this.parseMaybeAssign(), this.finishNode(R, "AssignmentPattern");
};
pp$7.checkLValSimple = function(s, e, r) {
  e === void 0 && (e = BIND_NONE);
  var R = e !== BIND_NONE;
  switch (s.type) {
    case "Identifier":
      this.strict && this.reservedWordsStrictBind.test(s.name) && this.raiseRecoverable(s.start, (R ? "Binding " : "Assigning to ") + s.name + " in strict mode"), R && (e === BIND_LEXICAL && s.name === "let" && this.raiseRecoverable(s.start, "let is disallowed as a lexically bound name"), r && (hasOwn(r, s.name) && this.raiseRecoverable(s.start, "Argument name clash"), r[s.name] = !0), e !== BIND_OUTSIDE && this.declareName(s.name, e, s.start));
      break;
    case "ChainExpression":
      this.raiseRecoverable(s.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      R && this.raiseRecoverable(s.start, "Binding member expression");
      break;
    case "ParenthesizedExpression":
      return R && this.raiseRecoverable(s.start, "Binding parenthesized expression"), this.checkLValSimple(s.expression, e, r);
    default:
      this.raise(s.start, (R ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(s, e, r) {
  switch (e === void 0 && (e = BIND_NONE), s.type) {
    case "ObjectPattern":
      for (var R = 0, B = s.properties; R < B.length; R += 1) {
        var _ = B[R];
        this.checkLValInnerPattern(_, e, r);
      }
      break;
    case "ArrayPattern":
      for (var $ = 0, F = s.elements; $ < F.length; $ += 1) {
        var V = F[$];
        V && this.checkLValInnerPattern(V, e, r);
      }
      break;
    default:
      this.checkLValSimple(s, e, r);
  }
};
pp$7.checkLValInnerPattern = function(s, e, r) {
  switch (e === void 0 && (e = BIND_NONE), s.type) {
    case "Property":
      this.checkLValInnerPattern(s.value, e, r);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(s.left, e, r);
      break;
    case "RestElement":
      this.checkLValPattern(s.argument, e, r);
      break;
    default:
      this.checkLValPattern(s, e, r);
  }
};
var TokContext = function(e, r, R, B, _) {
  this.token = e, this.isExpr = !!r, this.preserveSpace = !!R, this.override = B, this.generator = !!_;
}, types$2 = {
  b_stat: new TokContext("{", !1),
  b_expr: new TokContext("{", !0),
  b_tmpl: new TokContext("${", !1),
  p_stat: new TokContext("(", !1),
  p_expr: new TokContext("(", !0),
  q_tmpl: new TokContext("`", !0, !0, function(s) {
    return s.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", !1),
  f_expr: new TokContext("function", !0),
  f_expr_gen: new TokContext("function", !0, !1, null, !0),
  f_gen: new TokContext("function", !1, !1, null, !0)
}, pp$6 = Parser$1.prototype;
pp$6.initialContext = function() {
  return [types$2.b_stat];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(s) {
  var e = this.curContext();
  return e === types$2.f_expr || e === types$2.f_stat ? !0 : s === types$1.colon && (e === types$2.b_stat || e === types$2.b_expr) ? !e.isExpr : s === types$1._return || s === types$1.name && this.exprAllowed ? lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) : s === types$1._else || s === types$1.semi || s === types$1.eof || s === types$1.parenR || s === types$1.arrow ? !0 : s === types$1.braceL ? e === types$2.b_stat : s === types$1._var || s === types$1._const || s === types$1.name ? !1 : !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var s = this.context.length - 1; s >= 1; s--) {
    var e = this.context[s];
    if (e.token === "function")
      return e.generator;
  }
  return !1;
};
pp$6.updateContext = function(s) {
  var e, r = this.type;
  r.keyword && s === types$1.dot ? this.exprAllowed = !1 : (e = r.updateContext) ? e.call(this, s) : this.exprAllowed = r.beforeExpr;
};
pp$6.overrideContext = function(s) {
  this.curContext() !== s && (this.context[this.context.length - 1] = s);
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = !0;
    return;
  }
  var s = this.context.pop();
  s === types$2.b_stat && this.curContext().token === "function" && (s = this.context.pop()), this.exprAllowed = !s.isExpr;
};
types$1.braceL.updateContext = function(s) {
  this.context.push(this.braceIsBlock(s) ? types$2.b_stat : types$2.b_expr), this.exprAllowed = !0;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types$2.b_tmpl), this.exprAllowed = !0;
};
types$1.parenL.updateContext = function(s) {
  var e = s === types$1._if || s === types$1._for || s === types$1._with || s === types$1._while;
  this.context.push(e ? types$2.p_stat : types$2.p_expr), this.exprAllowed = !0;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(s) {
  s.beforeExpr && s !== types$1._else && !(s === types$1.semi && this.curContext() !== types$2.p_stat) && !(s === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((s === types$1.colon || s === types$1.braceL) && this.curContext() === types$2.b_stat) ? this.context.push(types$2.f_expr) : this.context.push(types$2.f_stat), this.exprAllowed = !1;
};
types$1.colon.updateContext = function() {
  this.curContext().token === "function" && this.context.pop(), this.exprAllowed = !0;
};
types$1.backQuote.updateContext = function() {
  this.curContext() === types$2.q_tmpl ? this.context.pop() : this.context.push(types$2.q_tmpl), this.exprAllowed = !1;
};
types$1.star.updateContext = function(s) {
  if (s === types$1._function) {
    var e = this.context.length - 1;
    this.context[e] === types$2.f_expr ? this.context[e] = types$2.f_expr_gen : this.context[e] = types$2.f_gen;
  }
  this.exprAllowed = !0;
};
types$1.name.updateContext = function(s) {
  var e = !1;
  this.options.ecmaVersion >= 6 && s !== types$1.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (e = !0), this.exprAllowed = e;
};
var pp$5 = Parser$1.prototype;
pp$5.checkPropClash = function(s, e, r) {
  if (!(this.options.ecmaVersion >= 9 && s.type === "SpreadElement") && !(this.options.ecmaVersion >= 6 && (s.computed || s.method || s.shorthand))) {
    var R = s.key, B;
    switch (R.type) {
      case "Identifier":
        B = R.name;
        break;
      case "Literal":
        B = String(R.value);
        break;
      default:
        return;
    }
    var _ = s.kind;
    if (this.options.ecmaVersion >= 6) {
      B === "__proto__" && _ === "init" && (e.proto && (r ? r.doubleProto < 0 && (r.doubleProto = R.start) : this.raiseRecoverable(R.start, "Redefinition of __proto__ property")), e.proto = !0);
      return;
    }
    B = "$" + B;
    var $ = e[B];
    if ($) {
      var F;
      _ === "init" ? F = this.strict && $.init || $.get || $.set : F = $.init || $[_], F && this.raiseRecoverable(R.start, "Redefinition of property");
    } else
      $ = e[B] = {
        init: !1,
        get: !1,
        set: !1
      };
    $[_] = !0;
  }
};
pp$5.parseExpression = function(s, e) {
  var r = this.start, R = this.startLoc, B = this.parseMaybeAssign(s, e);
  if (this.type === types$1.comma) {
    var _ = this.startNodeAt(r, R);
    for (_.expressions = [B]; this.eat(types$1.comma); )
      _.expressions.push(this.parseMaybeAssign(s, e));
    return this.finishNode(_, "SequenceExpression");
  }
  return B;
};
pp$5.parseMaybeAssign = function(s, e, r) {
  if (this.isContextual("yield")) {
    if (this.inGenerator)
      return this.parseYield(s);
    this.exprAllowed = !1;
  }
  var R = !1, B = -1, _ = -1, $ = -1;
  e ? (B = e.parenthesizedAssign, _ = e.trailingComma, $ = e.doubleProto, e.parenthesizedAssign = e.trailingComma = -1) : (e = new DestructuringErrors(), R = !0);
  var F = this.start, V = this.startLoc;
  (this.type === types$1.parenL || this.type === types$1.name) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = s === "await");
  var H = this.parseMaybeConditional(s, e);
  if (r && (H = r.call(this, H, F, V)), this.type.isAssign) {
    var W = this.startNodeAt(F, V);
    return W.operator = this.value, this.type === types$1.eq && (H = this.toAssignable(H, !1, e)), R || (e.parenthesizedAssign = e.trailingComma = e.doubleProto = -1), e.shorthandAssign >= H.start && (e.shorthandAssign = -1), this.type === types$1.eq ? this.checkLValPattern(H) : this.checkLValSimple(H), W.left = H, this.next(), W.right = this.parseMaybeAssign(s), $ > -1 && (e.doubleProto = $), this.finishNode(W, "AssignmentExpression");
  } else
    R && this.checkExpressionErrors(e, !0);
  return B > -1 && (e.parenthesizedAssign = B), _ > -1 && (e.trailingComma = _), H;
};
pp$5.parseMaybeConditional = function(s, e) {
  var r = this.start, R = this.startLoc, B = this.parseExprOps(s, e);
  if (this.checkExpressionErrors(e))
    return B;
  if (this.eat(types$1.question)) {
    var _ = this.startNodeAt(r, R);
    return _.test = B, _.consequent = this.parseMaybeAssign(), this.expect(types$1.colon), _.alternate = this.parseMaybeAssign(s), this.finishNode(_, "ConditionalExpression");
  }
  return B;
};
pp$5.parseExprOps = function(s, e) {
  var r = this.start, R = this.startLoc, B = this.parseMaybeUnary(e, !1, !1, s);
  return this.checkExpressionErrors(e) || B.start === r && B.type === "ArrowFunctionExpression" ? B : this.parseExprOp(B, r, R, -1, s);
};
pp$5.parseExprOp = function(s, e, r, R, B) {
  var _ = this.type.binop;
  if (_ != null && (!B || this.type !== types$1._in) && _ > R) {
    var $ = this.type === types$1.logicalOR || this.type === types$1.logicalAND, F = this.type === types$1.coalesce;
    F && (_ = types$1.logicalAND.binop);
    var V = this.value;
    this.next();
    var H = this.start, W = this.startLoc, U = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, B), H, W, _, B), z = this.buildBinary(e, r, s, U, V, $ || F);
    return ($ && this.type === types$1.coalesce || F && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(z, e, r, R, B);
  }
  return s;
};
pp$5.buildBinary = function(s, e, r, R, B, _) {
  R.type === "PrivateIdentifier" && this.raise(R.start, "Private identifier can only be left side of binary expression");
  var $ = this.startNodeAt(s, e);
  return $.left = r, $.operator = B, $.right = R, this.finishNode($, _ ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(s, e, r, R) {
  var B = this.start, _ = this.startLoc, $;
  if (this.isContextual("await") && this.canAwait)
    $ = this.parseAwait(R), e = !0;
  else if (this.type.prefix) {
    var F = this.startNode(), V = this.type === types$1.incDec;
    F.operator = this.value, F.prefix = !0, this.next(), F.argument = this.parseMaybeUnary(null, !0, V, R), this.checkExpressionErrors(s, !0), V ? this.checkLValSimple(F.argument) : this.strict && F.operator === "delete" && isLocalVariableAccess(F.argument) ? this.raiseRecoverable(F.start, "Deleting local variable in strict mode") : F.operator === "delete" && isPrivateFieldAccess(F.argument) ? this.raiseRecoverable(F.start, "Private fields can not be deleted") : e = !0, $ = this.finishNode(F, V ? "UpdateExpression" : "UnaryExpression");
  } else if (!e && this.type === types$1.privateId)
    (R || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected(), $ = this.parsePrivateIdent(), this.type !== types$1._in && this.unexpected();
  else {
    if ($ = this.parseExprSubscripts(s, R), this.checkExpressionErrors(s))
      return $;
    for (; this.type.postfix && !this.canInsertSemicolon(); ) {
      var H = this.startNodeAt(B, _);
      H.operator = this.value, H.prefix = !1, H.argument = $, this.checkLValSimple($), this.next(), $ = this.finishNode(H, "UpdateExpression");
    }
  }
  if (!r && this.eat(types$1.starstar))
    if (e)
      this.unexpected(this.lastTokStart);
    else
      return this.buildBinary(B, _, $, this.parseMaybeUnary(null, !1, !1, R), "**", !1);
  else
    return $;
};
function isLocalVariableAccess(s) {
  return s.type === "Identifier" || s.type === "ParenthesizedExpression" && isLocalVariableAccess(s.expression);
}
function isPrivateFieldAccess(s) {
  return s.type === "MemberExpression" && s.property.type === "PrivateIdentifier" || s.type === "ChainExpression" && isPrivateFieldAccess(s.expression) || s.type === "ParenthesizedExpression" && isPrivateFieldAccess(s.expression);
}
pp$5.parseExprSubscripts = function(s, e) {
  var r = this.start, R = this.startLoc, B = this.parseExprAtom(s, e);
  if (B.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    return B;
  var _ = this.parseSubscripts(B, r, R, !1, e);
  return s && _.type === "MemberExpression" && (s.parenthesizedAssign >= _.start && (s.parenthesizedAssign = -1), s.parenthesizedBind >= _.start && (s.parenthesizedBind = -1), s.trailingComma >= _.start && (s.trailingComma = -1)), _;
};
pp$5.parseSubscripts = function(s, e, r, R, B) {
  for (var _ = this.options.ecmaVersion >= 8 && s.type === "Identifier" && s.name === "async" && this.lastTokEnd === s.end && !this.canInsertSemicolon() && s.end - s.start === 5 && this.potentialArrowAt === s.start, $ = !1; ; ) {
    var F = this.parseSubscript(s, e, r, R, _, $, B);
    if (F.optional && ($ = !0), F === s || F.type === "ArrowFunctionExpression") {
      if ($) {
        var V = this.startNodeAt(e, r);
        V.expression = F, F = this.finishNode(V, "ChainExpression");
      }
      return F;
    }
    s = F;
  }
};
pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(s, e, r, R) {
  return this.parseArrowExpression(this.startNodeAt(s, e), r, !0, R);
};
pp$5.parseSubscript = function(s, e, r, R, B, _, $) {
  var F = this.options.ecmaVersion >= 11, V = F && this.eat(types$1.questionDot);
  R && V && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  var H = this.eat(types$1.bracketL);
  if (H || V && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var W = this.startNodeAt(e, r);
    W.object = s, H ? (W.property = this.parseExpression(), this.expect(types$1.bracketR)) : this.type === types$1.privateId && s.type !== "Super" ? W.property = this.parsePrivateIdent() : W.property = this.parseIdent(this.options.allowReserved !== "never"), W.computed = !!H, F && (W.optional = V), s = this.finishNode(W, "MemberExpression");
  } else if (!R && this.eat(types$1.parenL)) {
    var U = new DestructuringErrors(), z = this.yieldPos, K = this.awaitPos, X = this.awaitIdentPos;
    this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
    var Z = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, !1, U);
    if (B && !V && this.shouldParseAsyncArrow())
      return this.checkPatternErrors(U, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = z, this.awaitPos = K, this.awaitIdentPos = X, this.parseSubscriptAsyncArrow(e, r, Z, $);
    this.checkExpressionErrors(U, !0), this.yieldPos = z || this.yieldPos, this.awaitPos = K || this.awaitPos, this.awaitIdentPos = X || this.awaitIdentPos;
    var Y = this.startNodeAt(e, r);
    Y.callee = s, Y.arguments = Z, F && (Y.optional = V), s = this.finishNode(Y, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    (V || _) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    var te = this.startNodeAt(e, r);
    te.tag = s, te.quasi = this.parseTemplate({ isTagged: !0 }), s = this.finishNode(te, "TaggedTemplateExpression");
  }
  return s;
};
pp$5.parseExprAtom = function(s, e, r) {
  this.type === types$1.slash && this.readRegexp();
  var R, B = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), R = this.startNode(), this.next(), this.type === types$1.parenL && !this.allowDirectSuper && this.raise(R.start, "super() call outside constructor of a subclass"), this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL && this.unexpected(), this.finishNode(R, "Super");
    case types$1._this:
      return R = this.startNode(), this.next(), this.finishNode(R, "ThisExpression");
    case types$1.name:
      var _ = this.start, $ = this.startLoc, F = this.containsEsc, V = this.parseIdent(!1);
      if (this.options.ecmaVersion >= 8 && !F && V.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function))
        return this.overrideContext(types$2.f_expr), this.parseFunction(this.startNodeAt(_, $), 0, !1, !0, e);
      if (B && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow))
          return this.parseArrowExpression(this.startNodeAt(_, $), [V], !1, e);
        if (this.options.ecmaVersion >= 8 && V.name === "async" && this.type === types$1.name && !F && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc))
          return V = this.parseIdent(!1), (this.canInsertSemicolon() || !this.eat(types$1.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(_, $), [V], !0, e);
      }
      return V;
    case types$1.regexp:
      var H = this.value;
      return R = this.parseLiteral(H.value), R.regex = { pattern: H.pattern, flags: H.flags }, R;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      return R = this.startNode(), R.value = this.type === types$1._null ? null : this.type === types$1._true, R.raw = this.type.keyword, this.next(), this.finishNode(R, "Literal");
    case types$1.parenL:
      var W = this.start, U = this.parseParenAndDistinguishExpression(B, e);
      return s && (s.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(U) && (s.parenthesizedAssign = W), s.parenthesizedBind < 0 && (s.parenthesizedBind = W)), U;
    case types$1.bracketL:
      return R = this.startNode(), this.next(), R.elements = this.parseExprList(types$1.bracketR, !0, !0, s), this.finishNode(R, "ArrayExpression");
    case types$1.braceL:
      return this.overrideContext(types$2.b_expr), this.parseObj(!1, s);
    case types$1._function:
      return R = this.startNode(), this.next(), this.parseFunction(R, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), !1);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      return this.options.ecmaVersion >= 11 ? this.parseExprImport(r) : this.unexpected();
    default:
      return this.parseExprAtomDefault();
  }
};
pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};
pp$5.parseExprImport = function(s) {
  var e = this.startNode();
  if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === types$1.parenL && !s)
    return this.parseDynamicImport(e);
  if (this.type === types$1.dot) {
    var r = this.startNodeAt(e.start, e.loc && e.loc.start);
    return r.name = "import", e.meta = this.finishNode(r, "Identifier"), this.parseImportMeta(e);
  } else
    this.unexpected();
};
pp$5.parseDynamicImport = function(s) {
  if (this.next(), s.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16)
    this.eat(types$1.parenR) ? s.options = null : (this.expect(types$1.comma), this.afterTrailingComma(types$1.parenR) ? s.options = null : (s.options = this.parseMaybeAssign(), this.eat(types$1.parenR) || (this.expect(types$1.comma), this.afterTrailingComma(types$1.parenR) || this.unexpected())));
  else if (!this.eat(types$1.parenR)) {
    var e = this.start;
    this.eat(types$1.comma) && this.eat(types$1.parenR) ? this.raiseRecoverable(e, "Trailing comma is not allowed in import()") : this.unexpected(e);
  }
  return this.finishNode(s, "ImportExpression");
};
pp$5.parseImportMeta = function(s) {
  this.next();
  var e = this.containsEsc;
  return s.property = this.parseIdent(!0), s.property.name !== "meta" && this.raiseRecoverable(s.property.start, "The only valid meta property for import is 'import.meta'"), e && this.raiseRecoverable(s.start, "'import.meta' must not contain escaped characters"), this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere && this.raiseRecoverable(s.start, "Cannot use 'import.meta' outside a module"), this.finishNode(s, "MetaProperty");
};
pp$5.parseLiteral = function(s) {
  var e = this.startNode();
  return e.value = s, e.raw = this.input.slice(this.start, this.end), e.raw.charCodeAt(e.raw.length - 1) === 110 && (e.bigint = e.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(e, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var s = this.parseExpression();
  return this.expect(types$1.parenR), s;
};
pp$5.shouldParseArrow = function(s) {
  return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(s, e) {
  var r = this.start, R = this.startLoc, B, _ = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var $ = this.start, F = this.startLoc, V = [], H = !0, W = !1, U = new DestructuringErrors(), z = this.yieldPos, K = this.awaitPos, X;
    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== types$1.parenR; )
      if (H ? H = !1 : this.expect(types$1.comma), _ && this.afterTrailingComma(types$1.parenR, !0)) {
        W = !0;
        break;
      } else if (this.type === types$1.ellipsis) {
        X = this.start, V.push(this.parseParenItem(this.parseRestBinding())), this.type === types$1.comma && this.raiseRecoverable(
          this.start,
          "Comma is not permitted after the rest element"
        );
        break;
      } else
        V.push(this.parseMaybeAssign(!1, U, this.parseParenItem));
    var Z = this.lastTokEnd, Y = this.lastTokEndLoc;
    if (this.expect(types$1.parenR), s && this.shouldParseArrow(V) && this.eat(types$1.arrow))
      return this.checkPatternErrors(U, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = z, this.awaitPos = K, this.parseParenArrowList(r, R, V, e);
    (!V.length || W) && this.unexpected(this.lastTokStart), X && this.unexpected(X), this.checkExpressionErrors(U, !0), this.yieldPos = z || this.yieldPos, this.awaitPos = K || this.awaitPos, V.length > 1 ? (B = this.startNodeAt($, F), B.expressions = V, this.finishNodeAt(B, "SequenceExpression", Z, Y)) : B = V[0];
  } else
    B = this.parseParenExpression();
  if (this.options.preserveParens) {
    var te = this.startNodeAt(r, R);
    return te.expression = B, this.finishNode(te, "ParenthesizedExpression");
  } else
    return B;
};
pp$5.parseParenItem = function(s) {
  return s;
};
pp$5.parseParenArrowList = function(s, e, r, R) {
  return this.parseArrowExpression(this.startNodeAt(s, e), r, !1, R);
};
var empty$2 = [];
pp$5.parseNew = function() {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var s = this.startNode();
  if (this.next(), this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var e = this.startNodeAt(s.start, s.loc && s.loc.start);
    e.name = "new", s.meta = this.finishNode(e, "Identifier"), this.next();
    var r = this.containsEsc;
    return s.property = this.parseIdent(!0), s.property.name !== "target" && this.raiseRecoverable(s.property.start, "The only valid meta property for new is 'new.target'"), r && this.raiseRecoverable(s.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(s.start, "'new.target' can only be used in functions and class static block"), this.finishNode(s, "MetaProperty");
  }
  var R = this.start, B = this.startLoc;
  return s.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), R, B, !0, !1), this.eat(types$1.parenL) ? s.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, !1) : s.arguments = empty$2, this.finishNode(s, "NewExpression");
};
pp$5.parseTemplateElement = function(s) {
  var e = s.isTagged, r = this.startNode();
  return this.type === types$1.invalidTemplate ? (e || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), r.value = {
    raw: this.value.replace(/\r\n?/g, `
`),
    cooked: null
  }) : r.value = {
    raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, `
`),
    cooked: this.value
  }, this.next(), r.tail = this.type === types$1.backQuote, this.finishNode(r, "TemplateElement");
};
pp$5.parseTemplate = function(s) {
  s === void 0 && (s = {});
  var e = s.isTagged;
  e === void 0 && (e = !1);
  var r = this.startNode();
  this.next(), r.expressions = [];
  var R = this.parseTemplateElement({ isTagged: e });
  for (r.quasis = [R]; !R.tail; )
    this.type === types$1.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(types$1.dollarBraceL), r.expressions.push(this.parseExpression()), this.expect(types$1.braceR), r.quasis.push(R = this.parseTemplateElement({ isTagged: e }));
  return this.next(), this.finishNode(r, "TemplateLiteral");
};
pp$5.isAsyncProp = function(s) {
  return !s.computed && s.key.type === "Identifier" && s.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(s, e) {
  var r = this.startNode(), R = !0, B = {};
  for (r.properties = [], this.next(); !this.eat(types$1.braceR); ) {
    if (R)
      R = !1;
    else if (this.expect(types$1.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR))
      break;
    var _ = this.parseProperty(s, e);
    s || this.checkPropClash(_, B, e), r.properties.push(_);
  }
  return this.finishNode(r, s ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(s, e) {
  var r = this.startNode(), R, B, _, $;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis))
    return s ? (r.argument = this.parseIdent(!1), this.type === types$1.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(r, "RestElement")) : (r.argument = this.parseMaybeAssign(!1, e), this.type === types$1.comma && e && e.trailingComma < 0 && (e.trailingComma = this.start), this.finishNode(r, "SpreadElement"));
  this.options.ecmaVersion >= 6 && (r.method = !1, r.shorthand = !1, (s || e) && (_ = this.start, $ = this.startLoc), s || (R = this.eat(types$1.star)));
  var F = this.containsEsc;
  return this.parsePropertyName(r), !s && !F && this.options.ecmaVersion >= 8 && !R && this.isAsyncProp(r) ? (B = !0, R = this.options.ecmaVersion >= 9 && this.eat(types$1.star), this.parsePropertyName(r)) : B = !1, this.parsePropertyValue(r, s, R, B, _, $, e, F), this.finishNode(r, "Property");
};
pp$5.parseGetterSetter = function(s) {
  s.kind = s.key.name, this.parsePropertyName(s), s.value = this.parseMethod(!1);
  var e = s.kind === "get" ? 0 : 1;
  if (s.value.params.length !== e) {
    var r = s.value.start;
    s.kind === "get" ? this.raiseRecoverable(r, "getter should have no params") : this.raiseRecoverable(r, "setter should have exactly one param");
  } else
    s.kind === "set" && s.value.params[0].type === "RestElement" && this.raiseRecoverable(s.value.params[0].start, "Setter cannot use rest params");
};
pp$5.parsePropertyValue = function(s, e, r, R, B, _, $, F) {
  (r || R) && this.type === types$1.colon && this.unexpected(), this.eat(types$1.colon) ? (s.value = e ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, $), s.kind = "init") : this.options.ecmaVersion >= 6 && this.type === types$1.parenL ? (e && this.unexpected(), s.kind = "init", s.method = !0, s.value = this.parseMethod(r, R)) : !e && !F && this.options.ecmaVersion >= 5 && !s.computed && s.key.type === "Identifier" && (s.key.name === "get" || s.key.name === "set") && this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq ? ((r || R) && this.unexpected(), this.parseGetterSetter(s)) : this.options.ecmaVersion >= 6 && !s.computed && s.key.type === "Identifier" ? ((r || R) && this.unexpected(), this.checkUnreserved(s.key), s.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = B), s.kind = "init", e ? s.value = this.parseMaybeDefault(B, _, this.copyNode(s.key)) : this.type === types$1.eq && $ ? ($.shorthandAssign < 0 && ($.shorthandAssign = this.start), s.value = this.parseMaybeDefault(B, _, this.copyNode(s.key))) : s.value = this.copyNode(s.key), s.shorthand = !0) : this.unexpected();
};
pp$5.parsePropertyName = function(s) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL))
      return s.computed = !0, s.key = this.parseMaybeAssign(), this.expect(types$1.bracketR), s.key;
    s.computed = !1;
  }
  return s.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(s) {
  s.id = null, this.options.ecmaVersion >= 6 && (s.generator = s.expression = !1), this.options.ecmaVersion >= 8 && (s.async = !1);
};
pp$5.parseMethod = function(s, e, r) {
  var R = this.startNode(), B = this.yieldPos, _ = this.awaitPos, $ = this.awaitIdentPos;
  return this.initFunction(R), this.options.ecmaVersion >= 6 && (R.generator = s), this.options.ecmaVersion >= 8 && (R.async = !!e), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(e, R.generator) | SCOPE_SUPER | (r ? SCOPE_DIRECT_SUPER : 0)), this.expect(types$1.parenL), R.params = this.parseBindingList(types$1.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(R, !1, !0, !1), this.yieldPos = B, this.awaitPos = _, this.awaitIdentPos = $, this.finishNode(R, "FunctionExpression");
};
pp$5.parseArrowExpression = function(s, e, r, R) {
  var B = this.yieldPos, _ = this.awaitPos, $ = this.awaitIdentPos;
  return this.enterScope(functionFlags(r, !1) | SCOPE_ARROW), this.initFunction(s), this.options.ecmaVersion >= 8 && (s.async = !!r), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, s.params = this.toAssignableList(e, !0), this.parseFunctionBody(s, !0, !1, R), this.yieldPos = B, this.awaitPos = _, this.awaitIdentPos = $, this.finishNode(s, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(s, e, r, R) {
  var B = e && this.type !== types$1.braceL, _ = this.strict, $ = !1;
  if (B)
    s.body = this.parseMaybeAssign(R), s.expression = !0, this.checkParams(s, !1);
  else {
    var F = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(s.params);
    (!_ || F) && ($ = this.strictDirective(this.end), $ && F && this.raiseRecoverable(s.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
    var V = this.labels;
    this.labels = [], $ && (this.strict = !0), this.checkParams(s, !_ && !$ && !e && !r && this.isSimpleParamList(s.params)), this.strict && s.id && this.checkLValSimple(s.id, BIND_OUTSIDE), s.body = this.parseBlock(!1, void 0, $ && !_), s.expression = !1, this.adaptDirectivePrologue(s.body.body), this.labels = V;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(s) {
  for (var e = 0, r = s; e < r.length; e += 1) {
    var R = r[e];
    if (R.type !== "Identifier")
      return !1;
  }
  return !0;
};
pp$5.checkParams = function(s, e) {
  for (var r = /* @__PURE__ */ Object.create(null), R = 0, B = s.params; R < B.length; R += 1) {
    var _ = B[R];
    this.checkLValInnerPattern(_, BIND_VAR, e ? null : r);
  }
};
pp$5.parseExprList = function(s, e, r, R) {
  for (var B = [], _ = !0; !this.eat(s); ) {
    if (_)
      _ = !1;
    else if (this.expect(types$1.comma), e && this.afterTrailingComma(s))
      break;
    var $ = void 0;
    r && this.type === types$1.comma ? $ = null : this.type === types$1.ellipsis ? ($ = this.parseSpread(R), R && this.type === types$1.comma && R.trailingComma < 0 && (R.trailingComma = this.start)) : $ = this.parseMaybeAssign(!1, R), B.push($);
  }
  return B;
};
pp$5.checkUnreserved = function(s) {
  var e = s.start, r = s.end, R = s.name;
  if (this.inGenerator && R === "yield" && this.raiseRecoverable(e, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && R === "await" && this.raiseRecoverable(e, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().inClassFieldInit && R === "arguments" && this.raiseRecoverable(e, "Cannot use 'arguments' in class field initializer"), this.inClassStaticBlock && (R === "arguments" || R === "await") && this.raise(e, "Cannot use " + R + " in class static initialization block"), this.keywords.test(R) && this.raise(e, "Unexpected keyword '" + R + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(e, r).indexOf("\\") !== -1)) {
    var B = this.strict ? this.reservedWordsStrict : this.reservedWords;
    B.test(R) && (!this.inAsync && R === "await" && this.raiseRecoverable(e, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(e, "The keyword '" + R + "' is reserved"));
  }
};
pp$5.parseIdent = function(s) {
  var e = this.parseIdentNode();
  return this.next(!!s), this.finishNode(e, "Identifier"), s || (this.checkUnreserved(e), e.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = e.start)), e;
};
pp$5.parseIdentNode = function() {
  var s = this.startNode();
  return this.type === types$1.name ? s.name = this.value : this.type.keyword ? (s.name = this.type.keyword, (s.name === "class" || s.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop(), this.type = types$1.name) : this.unexpected(), s;
};
pp$5.parsePrivateIdent = function() {
  var s = this.startNode();
  return this.type === types$1.privateId ? s.name = this.value : this.unexpected(), this.next(), this.finishNode(s, "PrivateIdentifier"), this.options.checkPrivateFields && (this.privateNameStack.length === 0 ? this.raise(s.start, "Private field '#" + s.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(s)), s;
};
pp$5.parseYield = function(s) {
  this.yieldPos || (this.yieldPos = this.start);
  var e = this.startNode();
  return this.next(), this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr ? (e.delegate = !1, e.argument = null) : (e.delegate = this.eat(types$1.star), e.argument = this.parseMaybeAssign(s)), this.finishNode(e, "YieldExpression");
};
pp$5.parseAwait = function(s) {
  this.awaitPos || (this.awaitPos = this.start);
  var e = this.startNode();
  return this.next(), e.argument = this.parseMaybeUnary(null, !0, !1, s), this.finishNode(e, "AwaitExpression");
};
var pp$4 = Parser$1.prototype;
pp$4.raise = function(s, e) {
  var r = getLineInfo(this.input, s);
  e += " (" + r.line + ":" + r.column + ")";
  var R = new SyntaxError(e);
  throw R.pos = s, R.loc = r, R.raisedAt = this.pos, R;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations)
    return new Position(this.curLine, this.pos - this.lineStart);
};
var pp$3 = Parser$1.prototype, Scope = function(e) {
  this.flags = e, this.var = [], this.lexical = [], this.functions = [], this.inClassFieldInit = !1;
};
pp$3.enterScope = function(s) {
  this.scopeStack.push(new Scope(s));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(s) {
  return s.flags & SCOPE_FUNCTION || !this.inModule && s.flags & SCOPE_TOP;
};
pp$3.declareName = function(s, e, r) {
  var R = !1;
  if (e === BIND_LEXICAL) {
    var B = this.currentScope();
    R = B.lexical.indexOf(s) > -1 || B.functions.indexOf(s) > -1 || B.var.indexOf(s) > -1, B.lexical.push(s), this.inModule && B.flags & SCOPE_TOP && delete this.undefinedExports[s];
  } else if (e === BIND_SIMPLE_CATCH) {
    var _ = this.currentScope();
    _.lexical.push(s);
  } else if (e === BIND_FUNCTION) {
    var $ = this.currentScope();
    this.treatFunctionsAsVar ? R = $.lexical.indexOf(s) > -1 : R = $.lexical.indexOf(s) > -1 || $.var.indexOf(s) > -1, $.functions.push(s);
  } else
    for (var F = this.scopeStack.length - 1; F >= 0; --F) {
      var V = this.scopeStack[F];
      if (V.lexical.indexOf(s) > -1 && !(V.flags & SCOPE_SIMPLE_CATCH && V.lexical[0] === s) || !this.treatFunctionsAsVarInScope(V) && V.functions.indexOf(s) > -1) {
        R = !0;
        break;
      }
      if (V.var.push(s), this.inModule && V.flags & SCOPE_TOP && delete this.undefinedExports[s], V.flags & SCOPE_VAR)
        break;
    }
  R && this.raiseRecoverable(r, "Identifier '" + s + "' has already been declared");
};
pp$3.checkLocalExport = function(s) {
  this.scopeStack[0].lexical.indexOf(s.name) === -1 && this.scopeStack[0].var.indexOf(s.name) === -1 && (this.undefinedExports[s.name] = s);
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var s = this.scopeStack.length - 1; ; s--) {
    var e = this.scopeStack[s];
    if (e.flags & SCOPE_VAR)
      return e;
  }
};
pp$3.currentThisScope = function() {
  for (var s = this.scopeStack.length - 1; ; s--) {
    var e = this.scopeStack[s];
    if (e.flags & SCOPE_VAR && !(e.flags & SCOPE_ARROW))
      return e;
  }
};
var Node = function(e, r, R) {
  this.type = "", this.start = r, this.end = 0, e.options.locations && (this.loc = new SourceLocation(e, R)), e.options.directSourceFile && (this.sourceFile = e.options.directSourceFile), e.options.ranges && (this.range = [r, 0]);
}, pp$2 = Parser$1.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(s, e) {
  return new Node(this, s, e);
};
function finishNodeAt(s, e, r, R) {
  return s.type = e, s.end = r, this.options.locations && (s.loc.end = R), this.options.ranges && (s.range[1] = r), s;
}
pp$2.finishNode = function(s, e) {
  return finishNodeAt.call(this, s, e, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(s, e, r, R) {
  return finishNodeAt.call(this, s, e, r, R);
};
pp$2.copyNode = function(s) {
  var e = new Node(this, s.start, this.startLoc);
  for (var r in s)
    e[r] = s[r];
  return e;
};
var scriptValuesAddedInUnicode = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz", ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic", ecma11BinaryProperties = ecma10BinaryProperties, ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict", ecma13BinaryProperties = ecma12BinaryProperties, ecma14BinaryProperties = ecma13BinaryProperties, unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
}, ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji", unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
}, unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode, unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
}, data = {};
function buildUnicodeData(s) {
  var e = data[s] = {
    binary: wordsRegexp(unicodeBinaryProperties[s] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[s]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[s])
    }
  };
  e.nonBinary.Script_Extensions = e.nonBinary.Script, e.nonBinary.gc = e.nonBinary.General_Category, e.nonBinary.sc = e.nonBinary.Script, e.nonBinary.scx = e.nonBinary.Script_Extensions;
}
for (var i$1 = 0, list = [9, 10, 11, 12, 13, 14]; i$1 < list.length; i$1 += 1) {
  var ecmaVersion = list[i$1];
  buildUnicodeData(ecmaVersion);
}
var pp$1 = Parser$1.prototype, BranchID = function(e, r) {
  this.parent = e, this.base = r || this;
};
BranchID.prototype.separatedFrom = function(e) {
  for (var r = this; r; r = r.parent)
    for (var R = e; R; R = R.parent)
      if (r.base === R.base && r !== R)
        return !0;
  return !1;
};
BranchID.prototype.sibling = function() {
  return new BranchID(this.parent, this.base);
};
var RegExpValidationState = function(e) {
  this.parser = e, this.validFlags = "gim" + (e.options.ecmaVersion >= 6 ? "uy" : "") + (e.options.ecmaVersion >= 9 ? "s" : "") + (e.options.ecmaVersion >= 13 ? "d" : "") + (e.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = data[e.options.ecmaVersion >= 14 ? 14 : e.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = /* @__PURE__ */ Object.create(null), this.backReferenceNames = [], this.branchID = null;
};
RegExpValidationState.prototype.reset = function(e, r, R) {
  var B = R.indexOf("v") !== -1, _ = R.indexOf("u") !== -1;
  this.start = e | 0, this.source = r + "", this.flags = R, B && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = _ && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = _ && this.parser.options.ecmaVersion >= 9);
};
RegExpValidationState.prototype.raise = function(e) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e);
};
RegExpValidationState.prototype.at = function(e, r) {
  r === void 0 && (r = !1);
  var R = this.source, B = R.length;
  if (e >= B)
    return -1;
  var _ = R.charCodeAt(e);
  if (!(r || this.switchU) || _ <= 55295 || _ >= 57344 || e + 1 >= B)
    return _;
  var $ = R.charCodeAt(e + 1);
  return $ >= 56320 && $ <= 57343 ? (_ << 10) + $ - 56613888 : _;
};
RegExpValidationState.prototype.nextIndex = function(e, r) {
  r === void 0 && (r = !1);
  var R = this.source, B = R.length;
  if (e >= B)
    return B;
  var _ = R.charCodeAt(e), $;
  return !(r || this.switchU) || _ <= 55295 || _ >= 57344 || e + 1 >= B || ($ = R.charCodeAt(e + 1)) < 56320 || $ > 57343 ? e + 1 : e + 2;
};
RegExpValidationState.prototype.current = function(e) {
  return e === void 0 && (e = !1), this.at(this.pos, e);
};
RegExpValidationState.prototype.lookahead = function(e) {
  return e === void 0 && (e = !1), this.at(this.nextIndex(this.pos, e), e);
};
RegExpValidationState.prototype.advance = function(e) {
  e === void 0 && (e = !1), this.pos = this.nextIndex(this.pos, e);
};
RegExpValidationState.prototype.eat = function(e, r) {
  return r === void 0 && (r = !1), this.current(r) === e ? (this.advance(r), !0) : !1;
};
RegExpValidationState.prototype.eatChars = function(e, r) {
  r === void 0 && (r = !1);
  for (var R = this.pos, B = 0, _ = e; B < _.length; B += 1) {
    var $ = _[B], F = this.at(R, r);
    if (F === -1 || F !== $)
      return !1;
    R = this.nextIndex(R, r);
  }
  return this.pos = R, !0;
};
pp$1.validateRegExpFlags = function(s) {
  for (var e = s.validFlags, r = s.flags, R = !1, B = !1, _ = 0; _ < r.length; _++) {
    var $ = r.charAt(_);
    e.indexOf($) === -1 && this.raise(s.start, "Invalid regular expression flag"), r.indexOf($, _ + 1) > -1 && this.raise(s.start, "Duplicate regular expression flag"), $ === "u" && (R = !0), $ === "v" && (B = !0);
  }
  this.options.ecmaVersion >= 15 && R && B && this.raise(s.start, "Invalid regular expression flag");
};
function hasProp(s) {
  for (var e in s)
    return !0;
  return !1;
}
pp$1.validateRegExpPattern = function(s) {
  this.regexp_pattern(s), !s.switchN && this.options.ecmaVersion >= 9 && hasProp(s.groupNames) && (s.switchN = !0, this.regexp_pattern(s));
};
pp$1.regexp_pattern = function(s) {
  s.pos = 0, s.lastIntValue = 0, s.lastStringValue = "", s.lastAssertionIsQuantifiable = !1, s.numCapturingParens = 0, s.maxBackReference = 0, s.groupNames = /* @__PURE__ */ Object.create(null), s.backReferenceNames.length = 0, s.branchID = null, this.regexp_disjunction(s), s.pos !== s.source.length && (s.eat(
    41
    /* ) */
  ) && s.raise("Unmatched ')'"), (s.eat(
    93
    /* ] */
  ) || s.eat(
    125
    /* } */
  )) && s.raise("Lone quantifier brackets")), s.maxBackReference > s.numCapturingParens && s.raise("Invalid escape");
  for (var e = 0, r = s.backReferenceNames; e < r.length; e += 1) {
    var R = r[e];
    s.groupNames[R] || s.raise("Invalid named capture referenced");
  }
};
pp$1.regexp_disjunction = function(s) {
  var e = this.options.ecmaVersion >= 16;
  for (e && (s.branchID = new BranchID(s.branchID, null)), this.regexp_alternative(s); s.eat(
    124
    /* | */
  ); )
    e && (s.branchID = s.branchID.sibling()), this.regexp_alternative(s);
  e && (s.branchID = s.branchID.parent), this.regexp_eatQuantifier(s, !0) && s.raise("Nothing to repeat"), s.eat(
    123
    /* { */
  ) && s.raise("Lone quantifier brackets");
};
pp$1.regexp_alternative = function(s) {
  for (; s.pos < s.source.length && this.regexp_eatTerm(s); )
    ;
};
pp$1.regexp_eatTerm = function(s) {
  return this.regexp_eatAssertion(s) ? (s.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(s) && s.switchU && s.raise("Invalid quantifier"), !0) : (s.switchU ? this.regexp_eatAtom(s) : this.regexp_eatExtendedAtom(s)) ? (this.regexp_eatQuantifier(s), !0) : !1;
};
pp$1.regexp_eatAssertion = function(s) {
  var e = s.pos;
  if (s.lastAssertionIsQuantifiable = !1, s.eat(
    94
    /* ^ */
  ) || s.eat(
    36
    /* $ */
  ))
    return !0;
  if (s.eat(
    92
    /* \ */
  )) {
    if (s.eat(
      66
      /* B */
    ) || s.eat(
      98
      /* b */
    ))
      return !0;
    s.pos = e;
  }
  if (s.eat(
    40
    /* ( */
  ) && s.eat(
    63
    /* ? */
  )) {
    var r = !1;
    if (this.options.ecmaVersion >= 9 && (r = s.eat(
      60
      /* < */
    )), s.eat(
      61
      /* = */
    ) || s.eat(
      33
      /* ! */
    ))
      return this.regexp_disjunction(s), s.eat(
        41
        /* ) */
      ) || s.raise("Unterminated group"), s.lastAssertionIsQuantifiable = !r, !0;
  }
  return s.pos = e, !1;
};
pp$1.regexp_eatQuantifier = function(s, e) {
  return e === void 0 && (e = !1), this.regexp_eatQuantifierPrefix(s, e) ? (s.eat(
    63
    /* ? */
  ), !0) : !1;
};
pp$1.regexp_eatQuantifierPrefix = function(s, e) {
  return s.eat(
    42
    /* * */
  ) || s.eat(
    43
    /* + */
  ) || s.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(s, e);
};
pp$1.regexp_eatBracedQuantifier = function(s, e) {
  var r = s.pos;
  if (s.eat(
    123
    /* { */
  )) {
    var R = 0, B = -1;
    if (this.regexp_eatDecimalDigits(s) && (R = s.lastIntValue, s.eat(
      44
      /* , */
    ) && this.regexp_eatDecimalDigits(s) && (B = s.lastIntValue), s.eat(
      125
      /* } */
    )))
      return B !== -1 && B < R && !e && s.raise("numbers out of order in {} quantifier"), !0;
    s.switchU && !e && s.raise("Incomplete quantifier"), s.pos = r;
  }
  return !1;
};
pp$1.regexp_eatAtom = function(s) {
  return this.regexp_eatPatternCharacters(s) || s.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(s) || this.regexp_eatCharacterClass(s) || this.regexp_eatUncapturingGroup(s) || this.regexp_eatCapturingGroup(s);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(s) {
  var e = s.pos;
  if (s.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(s))
      return !0;
    s.pos = e;
  }
  return !1;
};
pp$1.regexp_eatUncapturingGroup = function(s) {
  var e = s.pos;
  if (s.eat(
    40
    /* ( */
  )) {
    if (s.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var r = this.regexp_eatModifiers(s), R = s.eat(
          45
          /* - */
        );
        if (r || R) {
          for (var B = 0; B < r.length; B++) {
            var _ = r.charAt(B);
            r.indexOf(_, B + 1) > -1 && s.raise("Duplicate regular expression modifiers");
          }
          if (R) {
            var $ = this.regexp_eatModifiers(s);
            !r && !$ && s.current() === 58 && s.raise("Invalid regular expression modifiers");
            for (var F = 0; F < $.length; F++) {
              var V = $.charAt(F);
              ($.indexOf(V, F + 1) > -1 || r.indexOf(V) > -1) && s.raise("Duplicate regular expression modifiers");
            }
          }
        }
      }
      if (s.eat(
        58
        /* : */
      )) {
        if (this.regexp_disjunction(s), s.eat(
          41
          /* ) */
        ))
          return !0;
        s.raise("Unterminated group");
      }
    }
    s.pos = e;
  }
  return !1;
};
pp$1.regexp_eatCapturingGroup = function(s) {
  if (s.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(s) : s.current() === 63 && s.raise("Invalid group"), this.regexp_disjunction(s), s.eat(
      41
      /* ) */
    ))
      return s.numCapturingParens += 1, !0;
    s.raise("Unterminated group");
  }
  return !1;
};
pp$1.regexp_eatModifiers = function(s) {
  for (var e = "", r = 0; (r = s.current()) !== -1 && isRegularExpressionModifier(r); )
    e += codePointToString(r), s.advance();
  return e;
};
function isRegularExpressionModifier(s) {
  return s === 105 || s === 109 || s === 115;
}
pp$1.regexp_eatExtendedAtom = function(s) {
  return s.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(s) || this.regexp_eatCharacterClass(s) || this.regexp_eatUncapturingGroup(s) || this.regexp_eatCapturingGroup(s) || this.regexp_eatInvalidBracedQuantifier(s) || this.regexp_eatExtendedPatternCharacter(s);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(s) {
  return this.regexp_eatBracedQuantifier(s, !0) && s.raise("Nothing to repeat"), !1;
};
pp$1.regexp_eatSyntaxCharacter = function(s) {
  var e = s.current();
  return isSyntaxCharacter(e) ? (s.lastIntValue = e, s.advance(), !0) : !1;
};
function isSyntaxCharacter(s) {
  return s === 36 || s >= 40 && s <= 43 || s === 46 || s === 63 || s >= 91 && s <= 94 || s >= 123 && s <= 125;
}
pp$1.regexp_eatPatternCharacters = function(s) {
  for (var e = s.pos, r = 0; (r = s.current()) !== -1 && !isSyntaxCharacter(r); )
    s.advance();
  return s.pos !== e;
};
pp$1.regexp_eatExtendedPatternCharacter = function(s) {
  var e = s.current();
  return e !== -1 && e !== 36 && !(e >= 40 && e <= 43) && e !== 46 && e !== 63 && e !== 91 && e !== 94 && e !== 124 ? (s.advance(), !0) : !1;
};
pp$1.regexp_groupSpecifier = function(s) {
  if (s.eat(
    63
    /* ? */
  )) {
    this.regexp_eatGroupName(s) || s.raise("Invalid group");
    var e = this.options.ecmaVersion >= 16, r = s.groupNames[s.lastStringValue];
    if (r)
      if (e)
        for (var R = 0, B = r; R < B.length; R += 1) {
          var _ = B[R];
          _.separatedFrom(s.branchID) || s.raise("Duplicate capture group name");
        }
      else
        s.raise("Duplicate capture group name");
    e ? (r || (s.groupNames[s.lastStringValue] = [])).push(s.branchID) : s.groupNames[s.lastStringValue] = !0;
  }
};
pp$1.regexp_eatGroupName = function(s) {
  if (s.lastStringValue = "", s.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(s) && s.eat(
      62
      /* > */
    ))
      return !0;
    s.raise("Invalid capture group name");
  }
  return !1;
};
pp$1.regexp_eatRegExpIdentifierName = function(s) {
  if (s.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(s)) {
    for (s.lastStringValue += codePointToString(s.lastIntValue); this.regexp_eatRegExpIdentifierPart(s); )
      s.lastStringValue += codePointToString(s.lastIntValue);
    return !0;
  }
  return !1;
};
pp$1.regexp_eatRegExpIdentifierStart = function(s) {
  var e = s.pos, r = this.options.ecmaVersion >= 11, R = s.current(r);
  return s.advance(r), R === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(s, r) && (R = s.lastIntValue), isRegExpIdentifierStart(R) ? (s.lastIntValue = R, !0) : (s.pos = e, !1);
};
function isRegExpIdentifierStart(s) {
  return isIdentifierStart(s, !0) || s === 36 || s === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(s) {
  var e = s.pos, r = this.options.ecmaVersion >= 11, R = s.current(r);
  return s.advance(r), R === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(s, r) && (R = s.lastIntValue), isRegExpIdentifierPart(R) ? (s.lastIntValue = R, !0) : (s.pos = e, !1);
};
function isRegExpIdentifierPart(s) {
  return isIdentifierChar(s, !0) || s === 36 || s === 95 || s === 8204 || s === 8205;
}
pp$1.regexp_eatAtomEscape = function(s) {
  return this.regexp_eatBackReference(s) || this.regexp_eatCharacterClassEscape(s) || this.regexp_eatCharacterEscape(s) || s.switchN && this.regexp_eatKGroupName(s) ? !0 : (s.switchU && (s.current() === 99 && s.raise("Invalid unicode escape"), s.raise("Invalid escape")), !1);
};
pp$1.regexp_eatBackReference = function(s) {
  var e = s.pos;
  if (this.regexp_eatDecimalEscape(s)) {
    var r = s.lastIntValue;
    if (s.switchU)
      return r > s.maxBackReference && (s.maxBackReference = r), !0;
    if (r <= s.numCapturingParens)
      return !0;
    s.pos = e;
  }
  return !1;
};
pp$1.regexp_eatKGroupName = function(s) {
  if (s.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(s))
      return s.backReferenceNames.push(s.lastStringValue), !0;
    s.raise("Invalid named reference");
  }
  return !1;
};
pp$1.regexp_eatCharacterEscape = function(s) {
  return this.regexp_eatControlEscape(s) || this.regexp_eatCControlLetter(s) || this.regexp_eatZero(s) || this.regexp_eatHexEscapeSequence(s) || this.regexp_eatRegExpUnicodeEscapeSequence(s, !1) || !s.switchU && this.regexp_eatLegacyOctalEscapeSequence(s) || this.regexp_eatIdentityEscape(s);
};
pp$1.regexp_eatCControlLetter = function(s) {
  var e = s.pos;
  if (s.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(s))
      return !0;
    s.pos = e;
  }
  return !1;
};
pp$1.regexp_eatZero = function(s) {
  return s.current() === 48 && !isDecimalDigit(s.lookahead()) ? (s.lastIntValue = 0, s.advance(), !0) : !1;
};
pp$1.regexp_eatControlEscape = function(s) {
  var e = s.current();
  return e === 116 ? (s.lastIntValue = 9, s.advance(), !0) : e === 110 ? (s.lastIntValue = 10, s.advance(), !0) : e === 118 ? (s.lastIntValue = 11, s.advance(), !0) : e === 102 ? (s.lastIntValue = 12, s.advance(), !0) : e === 114 ? (s.lastIntValue = 13, s.advance(), !0) : !1;
};
pp$1.regexp_eatControlLetter = function(s) {
  var e = s.current();
  return isControlLetter(e) ? (s.lastIntValue = e % 32, s.advance(), !0) : !1;
};
function isControlLetter(s) {
  return s >= 65 && s <= 90 || s >= 97 && s <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(s, e) {
  e === void 0 && (e = !1);
  var r = s.pos, R = e || s.switchU;
  if (s.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(s, 4)) {
      var B = s.lastIntValue;
      if (R && B >= 55296 && B <= 56319) {
        var _ = s.pos;
        if (s.eat(
          92
          /* \ */
        ) && s.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(s, 4)) {
          var $ = s.lastIntValue;
          if ($ >= 56320 && $ <= 57343)
            return s.lastIntValue = (B - 55296) * 1024 + ($ - 56320) + 65536, !0;
        }
        s.pos = _, s.lastIntValue = B;
      }
      return !0;
    }
    if (R && s.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(s) && s.eat(
      125
      /* } */
    ) && isValidUnicode(s.lastIntValue))
      return !0;
    R && s.raise("Invalid unicode escape"), s.pos = r;
  }
  return !1;
};
function isValidUnicode(s) {
  return s >= 0 && s <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(s) {
  if (s.switchU)
    return this.regexp_eatSyntaxCharacter(s) ? !0 : s.eat(
      47
      /* / */
    ) ? (s.lastIntValue = 47, !0) : !1;
  var e = s.current();
  return e !== 99 && (!s.switchN || e !== 107) ? (s.lastIntValue = e, s.advance(), !0) : !1;
};
pp$1.regexp_eatDecimalEscape = function(s) {
  s.lastIntValue = 0;
  var e = s.current();
  if (e >= 49 && e <= 57) {
    do
      s.lastIntValue = 10 * s.lastIntValue + (e - 48), s.advance();
    while ((e = s.current()) >= 48 && e <= 57);
    return !0;
  }
  return !1;
};
var CharSetNone = 0, CharSetOk = 1, CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(s) {
  var e = s.current();
  if (isCharacterClassEscape(e))
    return s.lastIntValue = -1, s.advance(), CharSetOk;
  var r = !1;
  if (s.switchU && this.options.ecmaVersion >= 9 && ((r = e === 80) || e === 112)) {
    s.lastIntValue = -1, s.advance();
    var R;
    if (s.eat(
      123
      /* { */
    ) && (R = this.regexp_eatUnicodePropertyValueExpression(s)) && s.eat(
      125
      /* } */
    ))
      return r && R === CharSetString && s.raise("Invalid property name"), R;
    s.raise("Invalid property name");
  }
  return CharSetNone;
};
function isCharacterClassEscape(s) {
  return s === 100 || s === 68 || s === 115 || s === 83 || s === 119 || s === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(s) {
  var e = s.pos;
  if (this.regexp_eatUnicodePropertyName(s) && s.eat(
    61
    /* = */
  )) {
    var r = s.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(s)) {
      var R = s.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(s, r, R), CharSetOk;
    }
  }
  if (s.pos = e, this.regexp_eatLoneUnicodePropertyNameOrValue(s)) {
    var B = s.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(s, B);
  }
  return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(s, e, r) {
  hasOwn(s.unicodeProperties.nonBinary, e) || s.raise("Invalid property name"), s.unicodeProperties.nonBinary[e].test(r) || s.raise("Invalid property value");
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(s, e) {
  if (s.unicodeProperties.binary.test(e))
    return CharSetOk;
  if (s.switchV && s.unicodeProperties.binaryOfStrings.test(e))
    return CharSetString;
  s.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(s) {
  var e = 0;
  for (s.lastStringValue = ""; isUnicodePropertyNameCharacter(e = s.current()); )
    s.lastStringValue += codePointToString(e), s.advance();
  return s.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(s) {
  return isControlLetter(s) || s === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(s) {
  var e = 0;
  for (s.lastStringValue = ""; isUnicodePropertyValueCharacter(e = s.current()); )
    s.lastStringValue += codePointToString(e), s.advance();
  return s.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(s) {
  return isUnicodePropertyNameCharacter(s) || isDecimalDigit(s);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(s) {
  return this.regexp_eatUnicodePropertyValue(s);
};
pp$1.regexp_eatCharacterClass = function(s) {
  if (s.eat(
    91
    /* [ */
  )) {
    var e = s.eat(
      94
      /* ^ */
    ), r = this.regexp_classContents(s);
    return s.eat(
      93
      /* ] */
    ) || s.raise("Unterminated character class"), e && r === CharSetString && s.raise("Negated character class may contain strings"), !0;
  }
  return !1;
};
pp$1.regexp_classContents = function(s) {
  return s.current() === 93 ? CharSetOk : s.switchV ? this.regexp_classSetExpression(s) : (this.regexp_nonEmptyClassRanges(s), CharSetOk);
};
pp$1.regexp_nonEmptyClassRanges = function(s) {
  for (; this.regexp_eatClassAtom(s); ) {
    var e = s.lastIntValue;
    if (s.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(s)) {
      var r = s.lastIntValue;
      s.switchU && (e === -1 || r === -1) && s.raise("Invalid character class"), e !== -1 && r !== -1 && e > r && s.raise("Range out of order in character class");
    }
  }
};
pp$1.regexp_eatClassAtom = function(s) {
  var e = s.pos;
  if (s.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(s))
      return !0;
    if (s.switchU) {
      var r = s.current();
      (r === 99 || isOctalDigit(r)) && s.raise("Invalid class escape"), s.raise("Invalid escape");
    }
    s.pos = e;
  }
  var R = s.current();
  return R !== 93 ? (s.lastIntValue = R, s.advance(), !0) : !1;
};
pp$1.regexp_eatClassEscape = function(s) {
  var e = s.pos;
  if (s.eat(
    98
    /* b */
  ))
    return s.lastIntValue = 8, !0;
  if (s.switchU && s.eat(
    45
    /* - */
  ))
    return s.lastIntValue = 45, !0;
  if (!s.switchU && s.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(s))
      return !0;
    s.pos = e;
  }
  return this.regexp_eatCharacterClassEscape(s) || this.regexp_eatCharacterEscape(s);
};
pp$1.regexp_classSetExpression = function(s) {
  var e = CharSetOk, r;
  if (!this.regexp_eatClassSetRange(s)) if (r = this.regexp_eatClassSetOperand(s)) {
    r === CharSetString && (e = CharSetString);
    for (var R = s.pos; s.eatChars(
      [38, 38]
      /* && */
    ); ) {
      if (s.current() !== 38 && (r = this.regexp_eatClassSetOperand(s))) {
        r !== CharSetString && (e = CharSetOk);
        continue;
      }
      s.raise("Invalid character in character class");
    }
    if (R !== s.pos)
      return e;
    for (; s.eatChars(
      [45, 45]
      /* -- */
    ); )
      this.regexp_eatClassSetOperand(s) || s.raise("Invalid character in character class");
    if (R !== s.pos)
      return e;
  } else
    s.raise("Invalid character in character class");
  for (; ; )
    if (!this.regexp_eatClassSetRange(s)) {
      if (r = this.regexp_eatClassSetOperand(s), !r)
        return e;
      r === CharSetString && (e = CharSetString);
    }
};
pp$1.regexp_eatClassSetRange = function(s) {
  var e = s.pos;
  if (this.regexp_eatClassSetCharacter(s)) {
    var r = s.lastIntValue;
    if (s.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(s)) {
      var R = s.lastIntValue;
      return r !== -1 && R !== -1 && r > R && s.raise("Range out of order in character class"), !0;
    }
    s.pos = e;
  }
  return !1;
};
pp$1.regexp_eatClassSetOperand = function(s) {
  return this.regexp_eatClassSetCharacter(s) ? CharSetOk : this.regexp_eatClassStringDisjunction(s) || this.regexp_eatNestedClass(s);
};
pp$1.regexp_eatNestedClass = function(s) {
  var e = s.pos;
  if (s.eat(
    91
    /* [ */
  )) {
    var r = s.eat(
      94
      /* ^ */
    ), R = this.regexp_classContents(s);
    if (s.eat(
      93
      /* ] */
    ))
      return r && R === CharSetString && s.raise("Negated character class may contain strings"), R;
    s.pos = e;
  }
  if (s.eat(
    92
    /* \ */
  )) {
    var B = this.regexp_eatCharacterClassEscape(s);
    if (B)
      return B;
    s.pos = e;
  }
  return null;
};
pp$1.regexp_eatClassStringDisjunction = function(s) {
  var e = s.pos;
  if (s.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (s.eat(
      123
      /* { */
    )) {
      var r = this.regexp_classStringDisjunctionContents(s);
      if (s.eat(
        125
        /* } */
      ))
        return r;
    } else
      s.raise("Invalid escape");
    s.pos = e;
  }
  return null;
};
pp$1.regexp_classStringDisjunctionContents = function(s) {
  for (var e = this.regexp_classString(s); s.eat(
    124
    /* | */
  ); )
    this.regexp_classString(s) === CharSetString && (e = CharSetString);
  return e;
};
pp$1.regexp_classString = function(s) {
  for (var e = 0; this.regexp_eatClassSetCharacter(s); )
    e++;
  return e === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(s) {
  var e = s.pos;
  if (s.eat(
    92
    /* \ */
  ))
    return this.regexp_eatCharacterEscape(s) || this.regexp_eatClassSetReservedPunctuator(s) ? !0 : s.eat(
      98
      /* b */
    ) ? (s.lastIntValue = 8, !0) : (s.pos = e, !1);
  var r = s.current();
  return r < 0 || r === s.lookahead() && isClassSetReservedDoublePunctuatorCharacter(r) || isClassSetSyntaxCharacter(r) ? !1 : (s.advance(), s.lastIntValue = r, !0);
};
function isClassSetReservedDoublePunctuatorCharacter(s) {
  return s === 33 || s >= 35 && s <= 38 || s >= 42 && s <= 44 || s === 46 || s >= 58 && s <= 64 || s === 94 || s === 96 || s === 126;
}
function isClassSetSyntaxCharacter(s) {
  return s === 40 || s === 41 || s === 45 || s === 47 || s >= 91 && s <= 93 || s >= 123 && s <= 125;
}
pp$1.regexp_eatClassSetReservedPunctuator = function(s) {
  var e = s.current();
  return isClassSetReservedPunctuator(e) ? (s.lastIntValue = e, s.advance(), !0) : !1;
};
function isClassSetReservedPunctuator(s) {
  return s === 33 || s === 35 || s === 37 || s === 38 || s === 44 || s === 45 || s >= 58 && s <= 62 || s === 64 || s === 96 || s === 126;
}
pp$1.regexp_eatClassControlLetter = function(s) {
  var e = s.current();
  return isDecimalDigit(e) || e === 95 ? (s.lastIntValue = e % 32, s.advance(), !0) : !1;
};
pp$1.regexp_eatHexEscapeSequence = function(s) {
  var e = s.pos;
  if (s.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(s, 2))
      return !0;
    s.switchU && s.raise("Invalid escape"), s.pos = e;
  }
  return !1;
};
pp$1.regexp_eatDecimalDigits = function(s) {
  var e = s.pos, r = 0;
  for (s.lastIntValue = 0; isDecimalDigit(r = s.current()); )
    s.lastIntValue = 10 * s.lastIntValue + (r - 48), s.advance();
  return s.pos !== e;
};
function isDecimalDigit(s) {
  return s >= 48 && s <= 57;
}
pp$1.regexp_eatHexDigits = function(s) {
  var e = s.pos, r = 0;
  for (s.lastIntValue = 0; isHexDigit(r = s.current()); )
    s.lastIntValue = 16 * s.lastIntValue + hexToInt(r), s.advance();
  return s.pos !== e;
};
function isHexDigit(s) {
  return s >= 48 && s <= 57 || s >= 65 && s <= 70 || s >= 97 && s <= 102;
}
function hexToInt(s) {
  return s >= 65 && s <= 70 ? 10 + (s - 65) : s >= 97 && s <= 102 ? 10 + (s - 97) : s - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(s) {
  if (this.regexp_eatOctalDigit(s)) {
    var e = s.lastIntValue;
    if (this.regexp_eatOctalDigit(s)) {
      var r = s.lastIntValue;
      e <= 3 && this.regexp_eatOctalDigit(s) ? s.lastIntValue = e * 64 + r * 8 + s.lastIntValue : s.lastIntValue = e * 8 + r;
    } else
      s.lastIntValue = e;
    return !0;
  }
  return !1;
};
pp$1.regexp_eatOctalDigit = function(s) {
  var e = s.current();
  return isOctalDigit(e) ? (s.lastIntValue = e - 48, s.advance(), !0) : (s.lastIntValue = 0, !1);
};
function isOctalDigit(s) {
  return s >= 48 && s <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(s, e) {
  var r = s.pos;
  s.lastIntValue = 0;
  for (var R = 0; R < e; ++R) {
    var B = s.current();
    if (!isHexDigit(B))
      return s.pos = r, !1;
    s.lastIntValue = 16 * s.lastIntValue + hexToInt(B), s.advance();
  }
  return !0;
};
var Token = function(e) {
  this.type = e.type, this.value = e.value, this.start = e.start, this.end = e.end, e.options.locations && (this.loc = new SourceLocation(e, e.startLoc, e.endLoc)), e.options.ranges && (this.range = [e.start, e.end]);
}, pp = Parser$1.prototype;
pp.next = function(s) {
  !s && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new Token(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
};
pp.getToken = function() {
  return this.next(), new Token(this);
};
typeof Symbol < "u" && (pp[Symbol.iterator] = function() {
  var s = this;
  return {
    next: function() {
      var e = s.getToken();
      return {
        done: e.type === types$1.eof,
        value: e
      };
    }
  };
});
pp.nextToken = function() {
  var s = this.curContext();
  if ((!s || !s.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length)
    return this.finishToken(types$1.eof);
  if (s.override)
    return s.override(this);
  this.readToken(this.fullCharCodeAtPos());
};
pp.readToken = function(s) {
  return isIdentifierStart(s, this.options.ecmaVersion >= 6) || s === 92 ? this.readWord() : this.getTokenFromCode(s);
};
pp.fullCharCodeAtPos = function() {
  var s = this.input.charCodeAt(this.pos);
  if (s <= 55295 || s >= 56320)
    return s;
  var e = this.input.charCodeAt(this.pos + 1);
  return e <= 56319 || e >= 57344 ? s : (s << 10) + e - 56613888;
};
pp.skipBlockComment = function() {
  var s = this.options.onComment && this.curPosition(), e = this.pos, r = this.input.indexOf("*/", this.pos += 2);
  if (r === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = r + 2, this.options.locations)
    for (var R = void 0, B = e; (R = nextLineBreak(this.input, B, this.pos)) > -1; )
      ++this.curLine, B = this.lineStart = R;
  this.options.onComment && this.options.onComment(
    !0,
    this.input.slice(e + 2, r),
    e,
    this.pos,
    s,
    this.curPosition()
  );
};
pp.skipLineComment = function(s) {
  for (var e = this.pos, r = this.options.onComment && this.curPosition(), R = this.input.charCodeAt(this.pos += s); this.pos < this.input.length && !isNewLine(R); )
    R = this.input.charCodeAt(++this.pos);
  this.options.onComment && this.options.onComment(
    !1,
    this.input.slice(e + s, this.pos),
    e,
    this.pos,
    r,
    this.curPosition()
  );
};
pp.skipSpace = function() {
  e: for (; this.pos < this.input.length; ) {
    var s = this.input.charCodeAt(this.pos);
    switch (s) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
      case 10:
      case 8232:
      case 8233:
        ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
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
            break e;
        }
        break;
      default:
        if (s > 8 && s < 14 || s >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(s)))
          ++this.pos;
        else
          break e;
    }
  }
};
pp.finishToken = function(s, e) {
  this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
  var r = this.type;
  this.type = s, this.value = e, this.updateContext(r);
};
pp.readToken_dot = function() {
  var s = this.input.charCodeAt(this.pos + 1);
  if (s >= 48 && s <= 57)
    return this.readNumber(!0);
  var e = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && s === 46 && e === 46 ? (this.pos += 3, this.finishToken(types$1.ellipsis)) : (++this.pos, this.finishToken(types$1.dot));
};
pp.readToken_slash = function() {
  var s = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed ? (++this.pos, this.readRegexp()) : s === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(s) {
  var e = this.input.charCodeAt(this.pos + 1), r = 1, R = s === 42 ? types$1.star : types$1.modulo;
  return this.options.ecmaVersion >= 7 && s === 42 && e === 42 && (++r, R = types$1.starstar, e = this.input.charCodeAt(this.pos + 2)), e === 61 ? this.finishOp(types$1.assign, r + 1) : this.finishOp(R, r);
};
pp.readToken_pipe_amp = function(s) {
  var e = this.input.charCodeAt(this.pos + 1);
  if (e === s) {
    if (this.options.ecmaVersion >= 12) {
      var r = this.input.charCodeAt(this.pos + 2);
      if (r === 61)
        return this.finishOp(types$1.assign, 3);
    }
    return this.finishOp(s === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  return e === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(s === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var s = this.input.charCodeAt(this.pos + 1);
  return s === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(s) {
  var e = this.input.charCodeAt(this.pos + 1);
  return e === s ? e === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(types$1.incDec, 2) : e === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(s) {
  var e = this.input.charCodeAt(this.pos + 1), r = 1;
  return e === s ? (r = s === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + r) === 61 ? this.finishOp(types$1.assign, r + 1) : this.finishOp(types$1.bitShift, r)) : e === 33 && s === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (e === 61 && (r = 2), this.finishOp(types$1.relational, r));
};
pp.readToken_eq_excl = function(s) {
  var e = this.input.charCodeAt(this.pos + 1);
  return e === 61 ? this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : s === 61 && e === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(types$1.arrow)) : this.finishOp(s === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var s = this.options.ecmaVersion;
  if (s >= 11) {
    var e = this.input.charCodeAt(this.pos + 1);
    if (e === 46) {
      var r = this.input.charCodeAt(this.pos + 2);
      if (r < 48 || r > 57)
        return this.finishOp(types$1.questionDot, 2);
    }
    if (e === 63) {
      if (s >= 12) {
        var R = this.input.charCodeAt(this.pos + 2);
        if (R === 61)
          return this.finishOp(types$1.assign, 3);
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var s = this.options.ecmaVersion, e = 35;
  if (s >= 13 && (++this.pos, e = this.fullCharCodeAtPos(), isIdentifierStart(e, !0) || e === 92))
    return this.finishToken(types$1.privateId, this.readWord1());
  this.raise(this.pos, "Unexpected character '" + codePointToString(e) + "'");
};
pp.getTokenFromCode = function(s) {
  switch (s) {
    case 46:
      return this.readToken_dot();
    case 40:
      return ++this.pos, this.finishToken(types$1.parenL);
    case 41:
      return ++this.pos, this.finishToken(types$1.parenR);
    case 59:
      return ++this.pos, this.finishToken(types$1.semi);
    case 44:
      return ++this.pos, this.finishToken(types$1.comma);
    case 91:
      return ++this.pos, this.finishToken(types$1.bracketL);
    case 93:
      return ++this.pos, this.finishToken(types$1.bracketR);
    case 123:
      return ++this.pos, this.finishToken(types$1.braceL);
    case 125:
      return ++this.pos, this.finishToken(types$1.braceR);
    case 58:
      return ++this.pos, this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6)
        break;
      return ++this.pos, this.finishToken(types$1.backQuote);
    case 48:
      var e = this.input.charCodeAt(this.pos + 1);
      if (e === 120 || e === 88)
        return this.readRadixNumber(16);
      if (this.options.ecmaVersion >= 6) {
        if (e === 111 || e === 79)
          return this.readRadixNumber(8);
        if (e === 98 || e === 66)
          return this.readRadixNumber(2);
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
      return this.readNumber(!1);
    case 34:
    case 39:
      return this.readString(s);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(s);
    case 124:
    case 38:
      return this.readToken_pipe_amp(s);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(s);
    case 60:
    case 62:
      return this.readToken_lt_gt(s);
    case 61:
    case 33:
      return this.readToken_eq_excl(s);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(s) + "'");
};
pp.finishOp = function(s, e) {
  var r = this.input.slice(this.pos, this.pos + e);
  return this.pos += e, this.finishToken(s, r);
};
pp.readRegexp = function() {
  for (var s, e, r = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(r, "Unterminated regular expression");
    var R = this.input.charAt(this.pos);
    if (lineBreak.test(R) && this.raise(r, "Unterminated regular expression"), s)
      s = !1;
    else {
      if (R === "[")
        e = !0;
      else if (R === "]" && e)
        e = !1;
      else if (R === "/" && !e)
        break;
      s = R === "\\";
    }
    ++this.pos;
  }
  var B = this.input.slice(r, this.pos);
  ++this.pos;
  var _ = this.pos, $ = this.readWord1();
  this.containsEsc && this.unexpected(_);
  var F = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  F.reset(r, B, $), this.validateRegExpFlags(F), this.validateRegExpPattern(F);
  var V = null;
  try {
    V = new RegExp(B, $);
  } catch {
  }
  return this.finishToken(types$1.regexp, { pattern: B, flags: $, value: V });
};
pp.readInt = function(s, e, r) {
  for (var R = this.options.ecmaVersion >= 12 && e === void 0, B = r && this.input.charCodeAt(this.pos) === 48, _ = this.pos, $ = 0, F = 0, V = 0, H = e ?? 1 / 0; V < H; ++V, ++this.pos) {
    var W = this.input.charCodeAt(this.pos), U = void 0;
    if (R && W === 95) {
      B && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), F === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), V === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), F = W;
      continue;
    }
    if (W >= 97 ? U = W - 97 + 10 : W >= 65 ? U = W - 65 + 10 : W >= 48 && W <= 57 ? U = W - 48 : U = 1 / 0, U >= s)
      break;
    F = W, $ = $ * s + U;
  }
  return R && F === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === _ || e != null && this.pos - _ !== e ? null : $;
};
function stringToNumber(s, e) {
  return e ? parseInt(s, 8) : parseFloat(s.replace(/_/g, ""));
}
function stringToBigInt(s) {
  return typeof BigInt != "function" ? null : BigInt(s.replace(/_/g, ""));
}
pp.readRadixNumber = function(s) {
  var e = this.pos;
  this.pos += 2;
  var r = this.readInt(s);
  return r == null && this.raise(this.start + 2, "Expected number in radix " + s), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (r = stringToBigInt(this.input.slice(e, this.pos)), ++this.pos) : isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(types$1.num, r);
};
pp.readNumber = function(s) {
  var e = this.pos;
  !s && this.readInt(10, void 0, !0) === null && this.raise(e, "Invalid number");
  var r = this.pos - e >= 2 && this.input.charCodeAt(e) === 48;
  r && this.strict && this.raise(e, "Invalid number");
  var R = this.input.charCodeAt(this.pos);
  if (!r && !s && this.options.ecmaVersion >= 11 && R === 110) {
    var B = stringToBigInt(this.input.slice(e, this.pos));
    return ++this.pos, isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(types$1.num, B);
  }
  r && /[89]/.test(this.input.slice(e, this.pos)) && (r = !1), R === 46 && !r && (++this.pos, this.readInt(10), R = this.input.charCodeAt(this.pos)), (R === 69 || R === 101) && !r && (R = this.input.charCodeAt(++this.pos), (R === 43 || R === 45) && ++this.pos, this.readInt(10) === null && this.raise(e, "Invalid number")), isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var _ = stringToNumber(this.input.slice(e, this.pos), r);
  return this.finishToken(types$1.num, _);
};
pp.readCodePoint = function() {
  var s = this.input.charCodeAt(this.pos), e;
  if (s === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var r = ++this.pos;
    e = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, e > 1114111 && this.invalidStringToken(r, "Code point out of bounds");
  } else
    e = this.readHexChar(4);
  return e;
};
pp.readString = function(s) {
  for (var e = "", r = ++this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var R = this.input.charCodeAt(this.pos);
    if (R === s)
      break;
    R === 92 ? (e += this.input.slice(r, this.pos), e += this.readEscapedChar(!1), r = this.pos) : R === 8232 || R === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (isNewLine(R) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
  }
  return e += this.input.slice(r, this.pos++), this.finishToken(types$1.string, e);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = !0;
  try {
    this.readTmplToken();
  } catch (s) {
    if (s === INVALID_TEMPLATE_ESCAPE_ERROR)
      this.readInvalidTemplateToken();
    else
      throw s;
  }
  this.inTemplateElement = !1;
};
pp.invalidStringToken = function(s, e) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9)
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  this.raise(s, e);
};
pp.readTmplToken = function() {
  for (var s = "", e = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var r = this.input.charCodeAt(this.pos);
    if (r === 96 || r === 36 && this.input.charCodeAt(this.pos + 1) === 123)
      return this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate) ? r === 36 ? (this.pos += 2, this.finishToken(types$1.dollarBraceL)) : (++this.pos, this.finishToken(types$1.backQuote)) : (s += this.input.slice(e, this.pos), this.finishToken(types$1.template, s));
    if (r === 92)
      s += this.input.slice(e, this.pos), s += this.readEscapedChar(!0), e = this.pos;
    else if (isNewLine(r)) {
      switch (s += this.input.slice(e, this.pos), ++this.pos, r) {
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        case 10:
          s += `
`;
          break;
        default:
          s += String.fromCharCode(r);
          break;
      }
      this.options.locations && (++this.curLine, this.lineStart = this.pos), e = this.pos;
    } else
      ++this.pos;
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++)
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{")
          break;
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        this.input[this.pos + 1] === `
` && ++this.pos;
      case `
`:
      case "\u2028":
      case "\u2029":
        ++this.curLine, this.lineStart = this.pos + 1;
        break;
    }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(s) {
  var e = this.input.charCodeAt(++this.pos);
  switch (++this.pos, e) {
    case 110:
      return `
`;
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
      this.input.charCodeAt(this.pos) === 10 && ++this.pos;
    case 10:
      return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
    case 56:
    case 57:
      if (this.strict && this.invalidStringToken(
        this.pos - 1,
        "Invalid escape sequence"
      ), s) {
        var r = this.pos - 1;
        this.invalidStringToken(
          r,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (e >= 48 && e <= 55) {
        var R = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], B = parseInt(R, 8);
        return B > 255 && (R = R.slice(0, -1), B = parseInt(R, 8)), this.pos += R.length - 1, e = this.input.charCodeAt(this.pos), (R !== "0" || e === 56 || e === 57) && (this.strict || s) && this.invalidStringToken(
          this.pos - 1 - R.length,
          s ? "Octal literal in template string" : "Octal literal in strict mode"
        ), String.fromCharCode(B);
      }
      return isNewLine(e) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(e);
  }
};
pp.readHexChar = function(s) {
  var e = this.pos, r = this.readInt(16, s);
  return r === null && this.invalidStringToken(e, "Bad character escape sequence"), r;
};
pp.readWord1 = function() {
  this.containsEsc = !1;
  for (var s = "", e = !0, r = this.pos, R = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
    var B = this.fullCharCodeAtPos();
    if (isIdentifierChar(B, R))
      this.pos += B <= 65535 ? 1 : 2;
    else if (B === 92) {
      this.containsEsc = !0, s += this.input.slice(r, this.pos);
      var _ = this.pos;
      this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
      var $ = this.readCodePoint();
      (e ? isIdentifierStart : isIdentifierChar)($, R) || this.invalidStringToken(_, "Invalid Unicode escape"), s += codePointToString($), r = this.pos;
    } else
      break;
    e = !1;
  }
  return s + this.input.slice(r, this.pos);
};
pp.readWord = function() {
  var s = this.readWord1(), e = types$1.name;
  return this.keywords.test(s) && (e = keywords[s]), this.finishToken(e, s);
};
var version = "8.14.0";
Parser$1.acorn = {
  Parser: Parser$1,
  version,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types$2,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parse(s, e) {
  return Parser$1.parse(s, e);
}
function parseExpressionAt(s, e, r) {
  return Parser$1.parseExpressionAt(s, e, r);
}
function tokenizer(s, e) {
  return Parser$1.tokenizer(s, e);
}
const t$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Node,
  Parser: Parser$1,
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
  tokContexts: types$2,
  tokTypes: types$1,
  tokenizer,
  version
}, Symbol.toStringTag, { value: "Module" }));
function getDefaultExportFromCjs(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function getAugmentedNamespace(s) {
  if (s.__esModule) return s;
  var e = s.default;
  if (typeof e == "function") {
    var r = function R() {
      return this instanceof R ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(s).forEach(function(R) {
    var B = Object.getOwnPropertyDescriptor(s, R);
    Object.defineProperty(r, R, B.get ? B : {
      enumerable: !0,
      get: function() {
        return s[R];
      }
    });
  }), r;
}
var acornJsx = { exports: {} }, xhtml = {
  quot: '"',
  amp: "&",
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
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
  int: "∫",
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
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(t$1);
(function(s) {
  const e = xhtml, r = /^[\da-fA-F]+$/, R = /^\d+$/, B = /* @__PURE__ */ new WeakMap();
  function _(V) {
    V = V.Parser.acorn || V;
    let H = B.get(V);
    if (!H) {
      const W = V.tokTypes, U = V.TokContext, z = V.TokenType, K = new U("<tag", !1), X = new U("</tag", !1), Z = new U("<tag>...</tag>", !0, !0), Y = {
        tc_oTag: K,
        tc_cTag: X,
        tc_expr: Z
      }, te = {
        jsxName: new z("jsxName"),
        jsxText: new z("jsxText", { beforeExpr: !0 }),
        jsxTagStart: new z("jsxTagStart", { startsExpr: !0 }),
        jsxTagEnd: new z("jsxTagEnd")
      };
      te.jsxTagStart.updateContext = function() {
        this.context.push(Z), this.context.push(K), this.exprAllowed = !1;
      }, te.jsxTagEnd.updateContext = function(ue) {
        let fe = this.context.pop();
        fe === K && ue === W.slash || fe === X ? (this.context.pop(), this.exprAllowed = this.curContext() === Z) : this.exprAllowed = !0;
      }, H = { tokContexts: Y, tokTypes: te }, B.set(V, H);
    }
    return H;
  }
  function $(V) {
    if (!V)
      return V;
    if (V.type === "JSXIdentifier")
      return V.name;
    if (V.type === "JSXNamespacedName")
      return V.namespace.name + ":" + V.name.name;
    if (V.type === "JSXMemberExpression")
      return $(V.object) + "." + $(V.property);
  }
  s.exports = function(V) {
    return V = V || {}, function(H) {
      return F({
        allowNamespaces: V.allowNamespaces !== !1,
        allowNamespacedObjects: !!V.allowNamespacedObjects
      }, H);
    };
  }, Object.defineProperty(s.exports, "tokTypes", {
    get: function() {
      return _(require$$1).tokTypes;
    },
    configurable: !0,
    enumerable: !0
  });
  function F(V, H) {
    const W = H.acorn || require$$1, U = _(W), z = W.tokTypes, K = U.tokTypes, X = W.tokContexts, Z = U.tokContexts.tc_oTag, Y = U.tokContexts.tc_cTag, te = U.tokContexts.tc_expr, ue = W.isNewLine, fe = W.isIdentifierStart, de = W.isIdentifierChar;
    return class extends H {
      // Expose actual `tokTypes` and `tokContexts` to other plugins.
      static get acornJsx() {
        return U;
      }
      // Reads inline JSX contents token.
      jsx_readToken() {
        let re = "", ae = this.pos;
        for (; ; ) {
          this.pos >= this.input.length && this.raise(this.start, "Unterminated JSX contents");
          let le = this.input.charCodeAt(this.pos);
          switch (le) {
            case 60:
            case 123:
              return this.pos === this.start ? le === 60 && this.exprAllowed ? (++this.pos, this.finishToken(K.jsxTagStart)) : this.getTokenFromCode(le) : (re += this.input.slice(ae, this.pos), this.finishToken(K.jsxText, re));
            case 38:
              re += this.input.slice(ae, this.pos), re += this.jsx_readEntity(), ae = this.pos;
              break;
            case 62:
            case 125:
              this.raise(
                this.pos,
                "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (le === 62 ? "&gt;" : "&rbrace;") + '` or `{"' + this.input[this.pos] + '"}`?'
              );
            default:
              ue(le) ? (re += this.input.slice(ae, this.pos), re += this.jsx_readNewLine(!0), ae = this.pos) : ++this.pos;
          }
        }
      }
      jsx_readNewLine(re) {
        let ae = this.input.charCodeAt(this.pos), le;
        return ++this.pos, ae === 13 && this.input.charCodeAt(this.pos) === 10 ? (++this.pos, le = re ? `
` : `\r
`) : le = String.fromCharCode(ae), this.options.locations && (++this.curLine, this.lineStart = this.pos), le;
      }
      jsx_readString(re) {
        let ae = "", le = ++this.pos;
        for (; ; ) {
          this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
          let me = this.input.charCodeAt(this.pos);
          if (me === re) break;
          me === 38 ? (ae += this.input.slice(le, this.pos), ae += this.jsx_readEntity(), le = this.pos) : ue(me) ? (ae += this.input.slice(le, this.pos), ae += this.jsx_readNewLine(!1), le = this.pos) : ++this.pos;
        }
        return ae += this.input.slice(le, this.pos++), this.finishToken(z.string, ae);
      }
      jsx_readEntity() {
        let re = "", ae = 0, le, me = this.input[this.pos];
        me !== "&" && this.raise(this.pos, "Entity must start with an ampersand");
        let Se = ++this.pos;
        for (; this.pos < this.input.length && ae++ < 10; ) {
          if (me = this.input[this.pos++], me === ";") {
            re[0] === "#" ? re[1] === "x" ? (re = re.substr(2), r.test(re) && (le = String.fromCharCode(parseInt(re, 16)))) : (re = re.substr(1), R.test(re) && (le = String.fromCharCode(parseInt(re, 10)))) : le = e[re];
            break;
          }
          re += me;
        }
        return le || (this.pos = Se, "&");
      }
      // Read a JSX identifier (valid tag or attribute name).
      //
      // Optimized version since JSX identifiers can't contain
      // escape characters and so can be read as single slice.
      // Also assumes that first character was already checked
      // by isIdentifierStart in readToken.
      jsx_readWord() {
        let re, ae = this.pos;
        do
          re = this.input.charCodeAt(++this.pos);
        while (de(re) || re === 45);
        return this.finishToken(K.jsxName, this.input.slice(ae, this.pos));
      }
      // Parse next token as JSX identifier
      jsx_parseIdentifier() {
        let re = this.startNode();
        return this.type === K.jsxName ? re.name = this.value : this.type.keyword ? re.name = this.type.keyword : this.unexpected(), this.next(), this.finishNode(re, "JSXIdentifier");
      }
      // Parse namespaced identifier.
      jsx_parseNamespacedName() {
        let re = this.start, ae = this.startLoc, le = this.jsx_parseIdentifier();
        if (!V.allowNamespaces || !this.eat(z.colon)) return le;
        var me = this.startNodeAt(re, ae);
        return me.namespace = le, me.name = this.jsx_parseIdentifier(), this.finishNode(me, "JSXNamespacedName");
      }
      // Parses element name in any form - namespaced, member
      // or single identifier.
      jsx_parseElementName() {
        if (this.type === K.jsxTagEnd) return "";
        let re = this.start, ae = this.startLoc, le = this.jsx_parseNamespacedName();
        for (this.type === z.dot && le.type === "JSXNamespacedName" && !V.allowNamespacedObjects && this.unexpected(); this.eat(z.dot); ) {
          let me = this.startNodeAt(re, ae);
          me.object = le, me.property = this.jsx_parseIdentifier(), le = this.finishNode(me, "JSXMemberExpression");
        }
        return le;
      }
      // Parses any type of JSX attribute value.
      jsx_parseAttributeValue() {
        switch (this.type) {
          case z.braceL:
            let re = this.jsx_parseExpressionContainer();
            return re.expression.type === "JSXEmptyExpression" && this.raise(re.start, "JSX attributes must only be assigned a non-empty expression"), re;
          case K.jsxTagStart:
          case z.string:
            return this.parseExprAtom();
          default:
            this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
        }
      }
      // JSXEmptyExpression is unique type since it doesn't actually parse anything,
      // and so it should start at the end of last read token (left brace) and finish
      // at the beginning of the next one (right brace).
      jsx_parseEmptyExpression() {
        let re = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
        return this.finishNodeAt(re, "JSXEmptyExpression", this.start, this.startLoc);
      }
      // Parses JSX expression enclosed into curly brackets.
      jsx_parseExpressionContainer() {
        let re = this.startNode();
        return this.next(), re.expression = this.type === z.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression(), this.expect(z.braceR), this.finishNode(re, "JSXExpressionContainer");
      }
      // Parses following JSX attribute name-value pair.
      jsx_parseAttribute() {
        let re = this.startNode();
        return this.eat(z.braceL) ? (this.expect(z.ellipsis), re.argument = this.parseMaybeAssign(), this.expect(z.braceR), this.finishNode(re, "JSXSpreadAttribute")) : (re.name = this.jsx_parseNamespacedName(), re.value = this.eat(z.eq) ? this.jsx_parseAttributeValue() : null, this.finishNode(re, "JSXAttribute"));
      }
      // Parses JSX opening tag starting after '<'.
      jsx_parseOpeningElementAt(re, ae) {
        let le = this.startNodeAt(re, ae);
        le.attributes = [];
        let me = this.jsx_parseElementName();
        for (me && (le.name = me); this.type !== z.slash && this.type !== K.jsxTagEnd; )
          le.attributes.push(this.jsx_parseAttribute());
        return le.selfClosing = this.eat(z.slash), this.expect(K.jsxTagEnd), this.finishNode(le, me ? "JSXOpeningElement" : "JSXOpeningFragment");
      }
      // Parses JSX closing tag starting after '</'.
      jsx_parseClosingElementAt(re, ae) {
        let le = this.startNodeAt(re, ae), me = this.jsx_parseElementName();
        return me && (le.name = me), this.expect(K.jsxTagEnd), this.finishNode(le, me ? "JSXClosingElement" : "JSXClosingFragment");
      }
      // Parses entire JSX element, including it's opening tag
      // (starting after '<'), attributes, contents and closing tag.
      jsx_parseElementAt(re, ae) {
        let le = this.startNodeAt(re, ae), me = [], Se = this.jsx_parseOpeningElementAt(re, ae), ke = null;
        if (!Se.selfClosing) {
          e: for (; ; )
            switch (this.type) {
              case K.jsxTagStart:
                if (re = this.start, ae = this.startLoc, this.next(), this.eat(z.slash)) {
                  ke = this.jsx_parseClosingElementAt(re, ae);
                  break e;
                }
                me.push(this.jsx_parseElementAt(re, ae));
                break;
              case K.jsxText:
                me.push(this.parseExprAtom());
                break;
              case z.braceL:
                me.push(this.jsx_parseExpressionContainer());
                break;
              default:
                this.unexpected();
            }
          $(ke.name) !== $(Se.name) && this.raise(
            ke.start,
            "Expected corresponding JSX closing tag for <" + $(Se.name) + ">"
          );
        }
        let ce = Se.name ? "Element" : "Fragment";
        return le["opening" + ce] = Se, le["closing" + ce] = ke, le.children = me, this.type === z.relational && this.value === "<" && this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag"), this.finishNode(le, "JSX" + ce);
      }
      // Parse JSX text
      jsx_parseText() {
        let re = this.parseLiteral(this.value);
        return re.type = "JSXText", re;
      }
      // Parses entire JSX element from current position.
      jsx_parseElement() {
        let re = this.start, ae = this.startLoc;
        return this.next(), this.jsx_parseElementAt(re, ae);
      }
      parseExprAtom(re) {
        return this.type === K.jsxText ? this.jsx_parseText() : this.type === K.jsxTagStart ? this.jsx_parseElement() : super.parseExprAtom(re);
      }
      readToken(re) {
        let ae = this.curContext();
        if (ae === te) return this.jsx_readToken();
        if (ae === Z || ae === Y) {
          if (fe(re)) return this.jsx_readWord();
          if (re == 62)
            return ++this.pos, this.finishToken(K.jsxTagEnd);
          if ((re === 34 || re === 39) && ae == Z)
            return this.jsx_readString(re);
        }
        return re === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33 ? (++this.pos, this.finishToken(K.jsxTagStart)) : super.readToken(re);
      }
      updateContext(re) {
        if (this.type == z.braceL) {
          var ae = this.curContext();
          ae == Z ? this.context.push(X.b_expr) : ae == te ? this.context.push(X.b_tmpl) : super.updateContext(re), this.exprAllowed = !0;
        } else if (this.type === z.slash && re === K.jsxTagStart)
          this.context.length -= 2, this.context.push(Y), this.exprAllowed = !1;
        else
          return super.updateContext(re);
      }
    };
  }
})(acornJsx);
var acornJsxExports = acornJsx.exports;
const jsx = /* @__PURE__ */ getDefaultExportFromCjs(acornJsxExports);
function simple(s, e, r, R, B) {
  r || (r = base$1), function _($, F, V) {
    var H = V || $.type;
    r[H]($, F, _), e[H] && e[H]($, F);
  }(s, R, B);
}
function ancestor(s, e, r, R, B) {
  var _ = [];
  r || (r = base$1), function $(F, V, H) {
    var W = H || F.type, U = F !== _[_.length - 1];
    U && _.push(F), r[W](F, V, $), e[W] && e[W](F, V || _, _), U && _.pop();
  }(s, R, B);
}
function skipThrough(s, e, r) {
  r(s, e);
}
function ignore(s, e, r) {
}
var base$1 = {};
base$1.Program = base$1.BlockStatement = base$1.StaticBlock = function(s, e, r) {
  for (var R = 0, B = s.body; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e, "Statement");
  }
};
base$1.Statement = skipThrough;
base$1.EmptyStatement = ignore;
base$1.ExpressionStatement = base$1.ParenthesizedExpression = base$1.ChainExpression = function(s, e, r) {
  return r(s.expression, e, "Expression");
};
base$1.IfStatement = function(s, e, r) {
  r(s.test, e, "Expression"), r(s.consequent, e, "Statement"), s.alternate && r(s.alternate, e, "Statement");
};
base$1.LabeledStatement = function(s, e, r) {
  return r(s.body, e, "Statement");
};
base$1.BreakStatement = base$1.ContinueStatement = ignore;
base$1.WithStatement = function(s, e, r) {
  r(s.object, e, "Expression"), r(s.body, e, "Statement");
};
base$1.SwitchStatement = function(s, e, r) {
  r(s.discriminant, e, "Expression");
  for (var R = 0, B = s.cases; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e);
  }
};
base$1.SwitchCase = function(s, e, r) {
  s.test && r(s.test, e, "Expression");
  for (var R = 0, B = s.consequent; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e, "Statement");
  }
};
base$1.ReturnStatement = base$1.YieldExpression = base$1.AwaitExpression = function(s, e, r) {
  s.argument && r(s.argument, e, "Expression");
};
base$1.ThrowStatement = base$1.SpreadElement = function(s, e, r) {
  return r(s.argument, e, "Expression");
};
base$1.TryStatement = function(s, e, r) {
  r(s.block, e, "Statement"), s.handler && r(s.handler, e), s.finalizer && r(s.finalizer, e, "Statement");
};
base$1.CatchClause = function(s, e, r) {
  s.param && r(s.param, e, "Pattern"), r(s.body, e, "Statement");
};
base$1.WhileStatement = base$1.DoWhileStatement = function(s, e, r) {
  r(s.test, e, "Expression"), r(s.body, e, "Statement");
};
base$1.ForStatement = function(s, e, r) {
  s.init && r(s.init, e, "ForInit"), s.test && r(s.test, e, "Expression"), s.update && r(s.update, e, "Expression"), r(s.body, e, "Statement");
};
base$1.ForInStatement = base$1.ForOfStatement = function(s, e, r) {
  r(s.left, e, "ForInit"), r(s.right, e, "Expression"), r(s.body, e, "Statement");
};
base$1.ForInit = function(s, e, r) {
  s.type === "VariableDeclaration" ? r(s, e) : r(s, e, "Expression");
};
base$1.DebuggerStatement = ignore;
base$1.FunctionDeclaration = function(s, e, r) {
  return r(s, e, "Function");
};
base$1.VariableDeclaration = function(s, e, r) {
  for (var R = 0, B = s.declarations; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e);
  }
};
base$1.VariableDeclarator = function(s, e, r) {
  r(s.id, e, "Pattern"), s.init && r(s.init, e, "Expression");
};
base$1.Function = function(s, e, r) {
  s.id && r(s.id, e, "Pattern");
  for (var R = 0, B = s.params; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e, "Pattern");
  }
  r(s.body, e, s.expression ? "Expression" : "Statement");
};
base$1.Pattern = function(s, e, r) {
  s.type === "Identifier" ? r(s, e, "VariablePattern") : s.type === "MemberExpression" ? r(s, e, "MemberPattern") : r(s, e);
};
base$1.VariablePattern = ignore;
base$1.MemberPattern = skipThrough;
base$1.RestElement = function(s, e, r) {
  return r(s.argument, e, "Pattern");
};
base$1.ArrayPattern = function(s, e, r) {
  for (var R = 0, B = s.elements; R < B.length; R += 1) {
    var _ = B[R];
    _ && r(_, e, "Pattern");
  }
};
base$1.ObjectPattern = function(s, e, r) {
  for (var R = 0, B = s.properties; R < B.length; R += 1) {
    var _ = B[R];
    _.type === "Property" ? (_.computed && r(_.key, e, "Expression"), r(_.value, e, "Pattern")) : _.type === "RestElement" && r(_.argument, e, "Pattern");
  }
};
base$1.Expression = skipThrough;
base$1.ThisExpression = base$1.Super = base$1.MetaProperty = ignore;
base$1.ArrayExpression = function(s, e, r) {
  for (var R = 0, B = s.elements; R < B.length; R += 1) {
    var _ = B[R];
    _ && r(_, e, "Expression");
  }
};
base$1.ObjectExpression = function(s, e, r) {
  for (var R = 0, B = s.properties; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e);
  }
};
base$1.FunctionExpression = base$1.ArrowFunctionExpression = base$1.FunctionDeclaration;
base$1.SequenceExpression = function(s, e, r) {
  for (var R = 0, B = s.expressions; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e, "Expression");
  }
};
base$1.TemplateLiteral = function(s, e, r) {
  for (var R = 0, B = s.quasis; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e);
  }
  for (var $ = 0, F = s.expressions; $ < F.length; $ += 1) {
    var V = F[$];
    r(V, e, "Expression");
  }
};
base$1.TemplateElement = ignore;
base$1.UnaryExpression = base$1.UpdateExpression = function(s, e, r) {
  r(s.argument, e, "Expression");
};
base$1.BinaryExpression = base$1.LogicalExpression = function(s, e, r) {
  r(s.left, e, "Expression"), r(s.right, e, "Expression");
};
base$1.AssignmentExpression = base$1.AssignmentPattern = function(s, e, r) {
  r(s.left, e, "Pattern"), r(s.right, e, "Expression");
};
base$1.ConditionalExpression = function(s, e, r) {
  r(s.test, e, "Expression"), r(s.consequent, e, "Expression"), r(s.alternate, e, "Expression");
};
base$1.NewExpression = base$1.CallExpression = function(s, e, r) {
  if (r(s.callee, e, "Expression"), s.arguments)
    for (var R = 0, B = s.arguments; R < B.length; R += 1) {
      var _ = B[R];
      r(_, e, "Expression");
    }
};
base$1.MemberExpression = function(s, e, r) {
  r(s.object, e, "Expression"), s.computed && r(s.property, e, "Expression");
};
base$1.ExportNamedDeclaration = base$1.ExportDefaultDeclaration = function(s, e, r) {
  s.declaration && r(s.declaration, e, s.type === "ExportNamedDeclaration" || s.declaration.id ? "Statement" : "Expression"), s.source && r(s.source, e, "Expression");
};
base$1.ExportAllDeclaration = function(s, e, r) {
  s.exported && r(s.exported, e), r(s.source, e, "Expression");
};
base$1.ImportDeclaration = function(s, e, r) {
  for (var R = 0, B = s.specifiers; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e);
  }
  r(s.source, e, "Expression");
};
base$1.ImportExpression = function(s, e, r) {
  r(s.source, e, "Expression");
};
base$1.ImportSpecifier = base$1.ImportDefaultSpecifier = base$1.ImportNamespaceSpecifier = base$1.Identifier = base$1.PrivateIdentifier = base$1.Literal = ignore;
base$1.TaggedTemplateExpression = function(s, e, r) {
  r(s.tag, e, "Expression"), r(s.quasi, e, "Expression");
};
base$1.ClassDeclaration = base$1.ClassExpression = function(s, e, r) {
  return r(s, e, "Class");
};
base$1.Class = function(s, e, r) {
  s.id && r(s.id, e, "Pattern"), s.superClass && r(s.superClass, e, "Expression"), r(s.body, e);
};
base$1.ClassBody = function(s, e, r) {
  for (var R = 0, B = s.body; R < B.length; R += 1) {
    var _ = B[R];
    r(_, e);
  }
};
base$1.MethodDefinition = base$1.PropertyDefinition = base$1.Property = function(s, e, r) {
  s.computed && r(s.key, e, "Expression"), s.value && r(s.value, e, "Expression");
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
function syntaxError(s, e, r) {
  const { line: R, column: B } = getLineInfo(r, e.start);
  return new SyntaxError(`${s} (${R}:${B})`);
}
function checkAssignments(s, e, r) {
  function R($) {
    switch ($.type) {
      case "Identifier":
        if (e.includes($)) throw syntaxError(`Assignment to external variable '${$.name}'`, $, r);
        if (defaultGlobals.has($.name)) throw syntaxError(`Assignment to global '${$.name}'`, $, r);
        break;
      case "ObjectPattern":
        $.properties.forEach((F) => R(F.type === "Property" ? F.value : F));
        break;
      case "ArrayPattern":
        $.elements.forEach((F) => F && R(F));
        break;
      case "RestElement":
        R($.argument);
        break;
    }
  }
  function B({ left: $ }) {
    R($);
  }
  function _({ argument: $ }) {
    R($);
  }
  simple(s, {
    AssignmentExpression: B,
    AssignmentPattern: B,
    UpdateExpression: _,
    ForOfStatement: B,
    ForInStatement: B
  });
}
function findDeclarations(s, e) {
  const r = [];
  function R(_) {
    if (defaultGlobals.has(_.name) || _.name === "arguments")
      throw syntaxError(`Global '${_.name}' cannot be redefined`, _, e);
    r.push(_);
  }
  function B(_) {
    switch (_.type) {
      case "Identifier":
        R(_);
        break;
      case "ObjectPattern":
        _.properties.forEach(($) => B($.type === "Property" ? $.value : $));
        break;
      case "ArrayPattern":
        _.elements.forEach(($) => $ && B($));
        break;
      case "RestElement":
        B(_.argument);
        break;
      case "AssignmentPattern":
        B(_.left);
        break;
    }
  }
  for (const _ of s.body)
    switch (_.type) {
      case "VariableDeclaration":
        _.declarations.forEach(($) => B($.id));
        break;
      case "ClassDeclaration":
      case "FunctionDeclaration":
        R(_.id);
        break;
      case "ImportDeclaration":
        _.specifiers.forEach(($) => R($.local));
        break;
    }
  return r;
}
function isScope(s) {
  return s.type === "FunctionExpression" || s.type === "FunctionDeclaration" || s.type === "ArrowFunctionExpression" || s.type === "Program";
}
function isBlockScope(s) {
  return s.type === "BlockStatement" || s.type === "SwitchStatement" || s.type === "ForInStatement" || s.type === "ForOfStatement" || s.type === "ForStatement" || isScope(s);
}
function findReferences(s, {
  globals: e = defaultGlobals,
  filterDeclaration: r = () => !0
} = {}) {
  const R = /* @__PURE__ */ new Map(), B = [];
  function _(K, X) {
    const Z = R.get(K);
    return Z ? Z.has(X) : !1;
  }
  function $(K, X) {
    if (!r(X)) return;
    const Z = R.get(K);
    Z ? Z.add(X.name) : R.set(K, /* @__PURE__ */ new Set([X.name]));
  }
  function F(K) {
    K.id && $(K, K.id);
  }
  function V(K) {
    K.params.forEach((X) => W(X, K)), K.id && $(K, K.id), K.type !== "ArrowFunctionExpression" && $(K, { name: "arguments" });
  }
  function H(K) {
    K.param && W(K.param, K);
  }
  function W(K, X) {
    switch (K.type) {
      case "Identifier":
        $(X, K);
        break;
      case "ObjectPattern":
        K.properties.forEach((Z) => W(Z.type === "Property" ? Z.value : Z, X));
        break;
      case "ArrayPattern":
        K.elements.forEach((Z) => Z && W(Z, X));
        break;
      case "RestElement":
        W(K.argument, X);
        break;
      case "AssignmentPattern":
        W(K.left, X);
        break;
    }
  }
  ancestor(s, {
    VariableDeclaration(K, X, Z) {
      let Y = null;
      for (let te = Z.length - 1; te >= 0 && Y === null; --te)
        (K.kind === "var" ? isScope(Z[te]) : isBlockScope(Z[te])) && (Y = Z[te]);
      K.declarations.forEach((te) => W(te.id, Y));
    },
    FunctionDeclaration(K, X, Z) {
      let Y = null;
      for (let te = Z.length - 2; te >= 0 && Y === null; --te)
        isScope(Z[te]) && (Y = Z[te]);
      K.id && $(Y, K.id), V(K);
    },
    FunctionExpression: V,
    ArrowFunctionExpression: V,
    ClassDeclaration(K, X, Z) {
      let Y = null;
      for (let te = Z.length - 2; te >= 0 && Y === null; --te)
        isScope(Z[te]) && (Y = Z[te]);
      K.id && $(Y, K.id);
    },
    ClassExpression: F,
    CatchClause: H,
    ImportDeclaration(K, X, [Z]) {
      K.specifiers.forEach((Y) => $(Z, Y.local));
    }
  });
  function U(K, X, Z) {
    const Y = K.name;
    if (Y !== "undefined") {
      for (let te = Z.length - 2; te >= 0; --te)
        if (_(Z[te], Y))
          return;
      e.has(Y) || B.push(K);
    }
  }
  ancestor(s, {
    Pattern(K, X, Z) {
      K.type === "Identifier" && U(K, X, Z);
    },
    Identifier: U
  });
  const z = [];
  return simple(s, {
    CallExpression(K) {
      const X = K.callee;
      if (X.type === "MemberExpression" && X.object.type === "Identifier") {
        if (X.object.name === "Events") {
          if (X.property.type === "Identifier" && X.property.name === "or")
            for (const Z of K.arguments)
              Z.type === "Identifier" && z.push(Z);
          else if (X.property.type === "Identifier" && X.property.name === "send") {
            const Z = K.arguments[0];
            Z.type === "Identifier" && z.push(Z);
          }
        } else if (X.object.name === "Behaviors" && X.property.type === "Identifier" && X.property.name === "collect") {
          const Z = K.arguments[1];
          Z.type === "Identifier" && z.push(Z);
        }
      }
    }
  }), [B, z];
}
function checkNested(s, e) {
  return rewriteNestedCalls(s, e);
}
function rewriteNestedCalls(s, e) {
  const r = [];
  return ancestor(s, {
    CallExpression(R, B) {
      const _ = hasFunctionDeclaration(R, B);
      isNonTopEvent(R, B) && !_ && r.push({ start: R.start, end: R.end, name: `_${e}_${r.length}`, type: "range" });
    },
    VariableDeclarator(R, B) {
      if (isTopObjectDeclaration(R, B) && R.init) {
        const _ = `_${e}_${r.length}`;
        r.push({ start: R.init.start, end: R.init.end, name: _, type: "range" });
        const F = R.id.properties;
        for (const V of F) {
          if (V.type === "RestElement") {
            console.log("unsupported style of assignment");
            continue;
          }
          const H = V;
          H.value.type === "Identifier" && H.key.type === "Identifier" ? r.push({ definition: `const ${H.value.name} = ${_}.${H.key.name}`, type: "override" }) : console.log("unsupported style of assignment");
        }
      }
    }
  }), r;
}
function isNonTopEvent(s, e) {
  if (s.type !== "CallExpression")
    return !1;
  const R = (s = s).callee;
  return R.type === "MemberExpression" && R.object.type === "Identifier" && (R.object.name === "Events" || R.object.name === "Behaviors") && R.property.type === "Identifier" && e.length > 2 && e[e.length - 2].type !== "VariableDeclarator";
}
function hasFunctionDeclaration(s, e) {
  return !!e.find((r) => r.type === "ArrowFunctionExpression");
}
function isTopObjectDeclaration(s, e) {
  return s.type === "VariableDeclarator" && s.id.type === "ObjectPattern" && e.length === 3;
}
const acornOptions = {
  ecmaVersion: 13,
  sourceType: "module"
};
function findDecls(s) {
  try {
    return parseProgram(s).body.map((R) => s.slice(R.start, R.end));
  } catch (e) {
    const r = e;
    return console.log(r.message, ": error around -> ", `"${s.slice(r.pos - 30, r.pos + 30)}"`), [];
  }
}
function parseJavaScript(s, e, r = !1) {
  var R;
  const B = findDecls(s), _ = [];
  let $ = e;
  for (const F of B) {
    $++;
    const V = parseProgram(F), [H, W] = findReferences(V);
    checkAssignments(V, H, s);
    const U = findDeclarations(V, s), z = r ? [] : checkNested(V, $);
    if (z.length === 0) {
      const K = ((R = U[0]) == null ? void 0 : R.name) || `${$}`;
      _.push({
        id: K,
        body: V,
        declarations: U,
        references: H,
        forceVars: W,
        imports: [],
        expression: !1,
        input: F
      });
    } else {
      let K = F, X = "", Z = !1;
      for (let Y = 0; Y < z.length; Y++) {
        const te = z[Y];
        if (te.type === "range") {
          const ue = K.slice(te.start, te.end), fe = te.name;
          X += `const ${fe} = ${ue};
`;
          let de = te.end - te.start;
          const re = `${K.slice(0, te.start)}${te.name.padEnd(de, " ")}${K.slice(te.end)}`;
          if (re.length !== F.length)
            debugger;
          K = re;
        } else te.type === "override" && (Z = !0, X += te.definition + `
`);
      }
      _.push(...parseJavaScript(`${X}${Z ? "" : `
` + K}`, e, !0));
    }
  }
  return _;
}
function parseProgram(s) {
  return Parser$1.parse(s, acornOptions);
}
function parseJSX(s) {
  return Parser$1.extend(jsx()).parse(s, { ecmaVersion: 13 });
}
class Sourcemap {
  constructor(e) {
    __publicField(this, "input"), __publicField(this, "_edits"), this.input = e, this._edits = [];
  }
  _bisectLeft(e) {
    let r = 0, R = this._edits.length;
    for (; r < R; ) {
      const B = r + R >>> 1;
      this._edits[B].start < e ? r = B + 1 : R = B;
    }
    return r;
  }
  _bisectRight(e) {
    let r = 0, R = this._edits.length;
    for (; r < R; ) {
      const B = r + R >>> 1;
      this._edits[B].start > e ? R = B : r = B + 1;
    }
    return r;
  }
  insertLeft(e, r) {
    return this.replaceLeft(e, e, r);
  }
  insertRight(e, r) {
    return this.replaceRight(e, e, r);
  }
  delete(e, r) {
    return this.replaceRight(e, r, "");
  }
  replaceLeft(e, r, R) {
    return this._edits.splice(this._bisectLeft(e), 0, { start: e, end: r, value: R }), this;
  }
  replaceRight(e, r, R) {
    return this._edits.splice(this._bisectRight(e), 0, { start: e, end: r, value: R }), this;
  }
  translate(e) {
    let r = 0, R = { line: 1, column: 0 }, B = { line: 1, column: 0 };
    for (const { start: $, end: F, value: V } of this._edits) {
      if ($ > r) {
        const K = positionLength(this.input, r, $), X = positionAdd(R, K), Z = positionAdd(B, K);
        if (positionCompare(Z, e) > 0) break;
        R = X, B = Z;
      }
      const H = positionLength(this.input, $, F), W = positionLength(V), U = positionAdd(R, H), z = positionAdd(B, W);
      if (positionCompare(z, e) > 0) return R;
      R = U, B = z, r = F;
    }
    const _ = positionSubtract(e, B);
    return positionAdd(R, _);
  }
  trim() {
    const e = this.input;
    return e.startsWith(`
`) && this.delete(0, 1), e.endsWith(`
`) && this.delete(e.length - 1, e.length), this;
  }
  toString() {
    let e = "", r = 0;
    for (const { start: R, end: B, value: _ } of this._edits)
      R > r && (e += this.input.slice(r, R)), e += _, r = B;
    return e += this.input.slice(r), e;
  }
}
function positionCompare(s, e) {
  return s.line - e.line || s.column - e.column;
}
function positionLength(s, e = 0, r = s.length) {
  let R, B = 0;
  for (lineBreakG.lastIndex = e; (R = lineBreakG.exec(s)) && R.index < r; )
    ++B, e = R.index + R[0].length;
  return { line: B, column: r - e };
}
function positionSubtract(s, e) {
  return s.line === e.line ? { line: 0, column: s.column - e.column } : { line: s.line - e.line, column: s.column };
}
function positionAdd(s, e) {
  return e.line === 0 ? { line: s.line, column: s.column + e.column } : { line: s.line + e.line, column: e.column };
}
const renkonGlobals = /* @__PURE__ */ new Set([
  "Events",
  "Behaviors",
  "Renkon"
]);
function transpileJavaScript(s) {
  var e;
  const r = Array.from(new Set((e = s.declarations) == null ? void 0 : e.map((F) => F.name))), R = r.length === 0 ? "" : r[0], B = Array.from(new Set(s.references.map((F) => F.name))).filter((F) => !defaultGlobals.has(F) && !renkonGlobals.has(F)), _ = Array.from(new Set(s.forceVars.map((F) => F.name))).filter((F) => !defaultGlobals.has(F) && !renkonGlobals.has(F)), $ = new Sourcemap(s.input).trim();
  return rewriteRenkonCalls($, s.body), $.insertLeft(0, `, body: (${B}) => {
`), $.insertLeft(0, `, outputs: ${JSON.stringify(R)}`), $.insertLeft(0, `, inputs: ${JSON.stringify(B)}`), $.insertLeft(0, `, forceVars: ${JSON.stringify(_)}`), $.insertLeft(0, `{id: "${s.id}"`), $.insertRight(s.input.length, `
return ${R};`), $.insertRight(s.input.length, `
}};
`), String($);
}
function getFunctionBody(s, e) {
  const R = parseJavaScript(s, 0, !0)[0].body.body[0], B = R.params.map((H) => H.name), _ = R.body.body, $ = _[_.length - 1], F = e ? [] : getArray($), V = new Sourcemap(s).trim();
  return V.delete(0, _[0].start), V.delete($.start, s.length), { params: B, returnArray: F, output: String(V) };
}
function getArray(s) {
  if (s.type !== "ReturnStatement")
    return console.error("cannot convert"), null;
  const e = s.argument;
  if (!e || e.type !== "ArrayExpression")
    return console.error("cannot convert"), null;
  for (const r of e.elements)
    if (!r || r.type !== "Identifier")
      return console.error("cannot convert"), null;
  return e.elements.map((r) => r.name);
}
function quote(s, e) {
  e.insertLeft(s.start, '"'), e.insertRight(s.end, '"');
}
function rewriteRenkonCalls(s, e) {
  simple(e, {
    CallExpression(r) {
      const R = r.callee;
      if (R.type === "MemberExpression" && R.object.type === "Identifier")
        if (R.object.name === "Events") {
          if (s.insertRight(R.object.end, ".create(Renkon)"), R.property.type === "Identifier")
            if (R.property.name === "delay")
              quote(r.arguments[0], s);
            else if (R.property.name === "or")
              for (const B of r.arguments)
                quote(B, s);
            else R.property.name === "send" ? quote(r.arguments[0], s) : R.property.name === "collect" && quote(r.arguments[1], s);
        } else R.object.name === "Behaviors" && (s.insertRight(R.object.end, ".create(Renkon)"), R.property.type === "Identifier" && R.property.name === "collect" && quote(r.arguments[1], s));
    }
  });
}
const typeKey = Symbol("typeKey"), isBehaviorKey = Symbol("isBehavior"), eventType = "EventType", delayType = "DelayType", timerType = "TimerType", collectType = "CollectType", promiseType = "PromiseType", behaviorType = "BehaviorType", orType = "OrType", sendType = "SendType", receiverType = "ReceiverType", changeType = "ChangeType", generatorNextType = "GeneratorNextType", resolvePartType = "ResolvePart";
_b = typeKey, _a$1 = isBehaviorKey;
class Stream {
  constructor(e, r) {
    __publicField(this, _b), __publicField(this, _a$1), this[typeKey] = e, this[isBehaviorKey] = r;
  }
  created(e, r) {
    return this;
  }
  ready(e, r) {
    var R;
    for (const B of e.inputs) {
      const _ = r.baseVarName(B);
      if (((R = r.resolved.get(_)) == null ? void 0 : R.value) === void 0 && !e.forceVars.includes(B))
        return !1;
    }
    return !0;
  }
  evaluate(e, r, R, B) {
  }
  conclude(e, r) {
    const R = e.inputArray.get(r), B = e.nodes.get(r).inputs;
    if (!(!R || !B))
      for (let _ = 0; _ < B.length; _++)
        e.resolved.get(B[_]) === void 0 && (R[_] = void 0);
  }
}
class DelayedEvent extends Stream {
  constructor(e, r, R) {
    super(delayType, R), __publicField(this, "delay"), __publicField(this, "varName"), this.delay = e, this.varName = r;
  }
  ready(e, r) {
    const R = e.outputs, B = r.scratch.get(R);
    return (B == null ? void 0 : B.queue.length) > 0 ? !0 : r.defaultReady(e);
  }
  created(e, r) {
    return e.scratch.get(r) || e.scratch.set(r, { queue: [] }), this;
  }
  evaluate(e, r, R, B) {
    const _ = e.spliceDelayedQueued(e.scratch.get(r.id), e.time);
    _ !== void 0 && e.setResolved(r.id, { value: _, time: e.time });
    const $ = 0, F = R[$];
    (this[isBehaviorKey] && F !== void 0 && F !== (B == null ? void 0 : B[$]) || !this[isBehaviorKey] && F !== void 0) && e.scratch.get(r.id).queue.push({ time: e.time + this.delay, value: F });
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), !this[isBehaviorKey] && ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), r;
  }
}
class TimerEvent extends Stream {
  constructor(e, r) {
    super(timerType, r), __publicField(this, "interval"), this.interval = e;
  }
  created(e, r) {
    return this;
  }
  ready(e, r) {
    const R = e.outputs, B = r.scratch.get(R), _ = this.interval;
    return B === void 0 || B + _ <= r.time;
  }
  evaluate(e, r, R, B) {
    const _ = this.interval, $ = _ * Math.floor(e.time / _);
    e.setResolved(r.id, { value: $, time: e.time }), e.scratch.set(r.id, $);
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), !this[isBehaviorKey] && ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), r;
  }
}
class PromiseEvent extends Stream {
  constructor(e) {
    super(promiseType, !0), __publicField(this, "promise"), this.promise = e;
  }
  created(e, r) {
    var R;
    const B = (R = e.scratch.get(r)) == null ? void 0 : R.promise, _ = this.promise;
    return B && _ !== B && e.resolved.delete(r), _.then(($) => {
      var F;
      ((F = e.resolved.get(r)) == null ? void 0 : F.value) || (e.scratch.set(r, { promise: _ }), e.setResolved(r, { value: $, time: e.time }));
    }), this;
  }
}
class OrEvent extends Stream {
  constructor(e) {
    super(orType, !1), __publicField(this, "varNames"), this.varNames = e;
  }
  evaluate(e, r, R, B) {
    for (let _ = 0; _ < r.inputs.length; _++) {
      const $ = R[_];
      if ($ !== void 0) {
        e.setResolved(r.id, { value: $, time: e.time });
        return;
      }
    }
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), r;
  }
}
class UserEvent extends Stream {
  constructor(e, r) {
    super(eventType, !1), __publicField(this, "record"), __publicField(this, "queued"), this.record = e, this.queued = !!r;
  }
  created(e, r) {
    let R = e.scratch.get(r);
    return R && R.cleanup && typeof R.cleanup == "function" && (R.cleanup(), R.cleanup = void 0), e.scratch.set(r, this.record), this;
  }
  evaluate(e, r, R, B) {
    let _;
    this.queued ? _ = e.getEventValues(e.scratch.get(r.id), e.time) : _ = e.getEventValue(e.scratch.get(r.id), e.time), _ !== void 0 && (_ !== null && _.then ? _.then(($) => {
      e.setResolved(r.id, { value: $, time: e.time });
    }) : e.setResolved(r.id, { value: _, time: e.time }));
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), r;
  }
}
class SendEvent extends Stream {
  constructor() {
    super(sendType, !1);
  }
}
class ReceiverEvent extends Stream {
  constructor(e) {
    super(receiverType, !1), __publicField(this, "value"), this.value = e;
  }
  created(e, r) {
    return this.value !== void 0 && e.scratch.set(r, this.value), this;
  }
  evaluate(e, r, R, B) {
    const _ = e.scratch.get(r.id);
    _ !== void 0 && e.setResolved(r.id, { value: _, time: e.time });
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), e.scratch.delete(r), r;
  }
}
class ChangeEvent extends Stream {
  constructor(e) {
    super(changeType, !1), __publicField(this, "value"), this.value = e;
  }
  created(e, r) {
    return e.scratch.set(r, this.value), this;
  }
  ready(e, r) {
    var R;
    const B = (R = r.resolved.get(r.baseVarName(e.inputs[0]))) == null ? void 0 : R.value;
    return B !== void 0 && B === r.scratch.get(e.id) ? !1 : r.defaultReady(e);
  }
  evaluate(e, r, R, B) {
    e.setResolved(r.id, { value: this.value, time: e.time }), e.scratch.set(r.id, R[0]);
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), r;
  }
}
class Behavior extends Stream {
  constructor() {
    super(behaviorType, !0);
  }
}
class CollectStream extends Stream {
  constructor(e, r, R, B) {
    super(collectType, B), __publicField(this, "init"), __publicField(this, "varName"), __publicField(this, "updater"), this.init = e, this.varName = r, this.updater = R;
  }
  created(e, r) {
    return this.init && typeof this.init == "object" && this.init.then ? (this.init.then((R) => {
      e.streams.set(r, this), this.init = R, e.setResolved(r, { value: R, time: e.time }), e.scratch.set(r, { current: this.init });
    }), this) : (e.scratch.get(r) || (e.streams.set(r, this), e.setResolved(r, { value: this.init, time: e.time }), e.scratch.set(r, { current: this.init })), this);
  }
  evaluate(e, r, R, B) {
    const _ = e.scratch.get(r.id);
    if (!_)
      return;
    const $ = r.inputs.indexOf(this.varName), F = R[$];
    if (F !== void 0 && (!B || F !== B[$])) {
      const V = this.updater(_.current, F);
      V !== void 0 && (V !== null && V.then ? V.then((H) => {
        e.setResolved(r.id, { value: H, time: e.time }), e.scratch.set(r.id, { current: H });
      }) : (e.setResolved(r.id, { value: V, time: e.time }), e.scratch.set(r.id, { current: V })));
    }
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), !this[isBehaviorKey] && ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), r;
  }
}
class ResolvePart extends Stream {
  constructor(e, r, R) {
    super(resolvePartType, R), __publicField(this, "promise"), __publicField(this, "resolved"), __publicField(this, "object"), this.promise = e, this.object = r, this.resolved = !(typeof this.promise == "object" && this.promise.then);
  }
  created(e, r) {
    return this.resolved || this.promise.then((R) => {
      var B;
      if (!((B = e.resolved.get(r)) == null ? void 0 : B.value))
        if (this.resolved = !0, Array.isArray(this.object)) {
          const $ = this.object.indexOf(this.promise), F = [...this.object];
          return $ < 0 || (F[$] = R, e.setResolved(r, { value: F, time: e.time })), F;
        } else {
          const $ = { ...this.object }, F = Object.keys(this.object).find((V) => this.object[V] === this.promise);
          return F && ($[F] = R, e.setResolved(r, { value: $, time: e.time })), $;
        }
    }), this;
  }
  conclude(e, r) {
    var R;
    if (super.conclude(e, r), !this[isBehaviorKey] && ((R = e.resolved.get(r)) == null ? void 0 : R.value) !== void 0)
      return e.resolved.delete(r), r;
  }
}
class GeneratorNextEvent extends Stream {
  constructor(e) {
    super(generatorNextType, !1), __publicField(this, "promise"), __publicField(this, "generator");
    const r = e.next();
    this.promise = r, this.generator = e;
  }
  created(e, r) {
    return this.generator.done ? this : (this.promise.then((B) => {
      var _;
      ((_ = e.resolved.get(r)) == null ? void 0 : _.value) || e.setResolved(r, { value: B, time: e.time });
    }), this);
  }
  conclude(e, r) {
    var R;
    super.conclude(e, r);
    const B = (R = e.resolved.get(r)) == null ? void 0 : R.value;
    if (B !== void 0) {
      if (B.done)
        this.generator.done = !0;
      else if (!this.generator.done) {
        const _ = this.generator.next();
        _.then(($) => {
          var F;
          ((F = e.resolved.get(r)) == null ? void 0 : F.value) || e.setResolved(r, { value: $, time: e.time });
        }), this.promise = _;
      }
      return e.resolved.delete(r), r;
    }
  }
}
function a(s, e) {
  for (var r = 0; r < e.length; r++) {
    var R = e[r];
    R.enumerable = R.enumerable || !1, R.configurable = !0, "value" in R && (R.writable = !0), Object.defineProperty(s, typeof (B = function(_, $) {
      if (typeof _ != "object" || _ === null) return _;
      var F = _[Symbol.toPrimitive];
      if (F !== void 0) {
        var V = F.call(_, "string");
        if (typeof V != "object") return V;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return String(_);
    }(R.key)) == "symbol" ? B : String(B), R);
  }
  var B;
}
function n() {
  return n = Object.assign ? Object.assign.bind() : function(s) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var R in r) Object.prototype.hasOwnProperty.call(r, R) && (s[R] = r[R]);
    }
    return s;
  }, n.apply(this, arguments);
}
function o(s, e) {
  s.prototype = Object.create(e.prototype), s.prototype.constructor = s, h(s, e);
}
function h(s, e) {
  return h = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, R) {
    return r.__proto__ = R, r;
  }, h(s, e);
}
function p(s, e) {
  (e == null || e > s.length) && (e = s.length);
  for (var r = 0, R = new Array(e); r < e; r++) R[r] = s[r];
  return R;
}
function c(s, e) {
  var r = typeof Symbol < "u" && s[Symbol.iterator] || s["@@iterator"];
  if (r) return (r = r.call(s)).next.bind(r);
  if (Array.isArray(s) || (r = function(B, _) {
    if (B) {
      if (typeof B == "string") return p(B, _);
      var $ = Object.prototype.toString.call(B).slice(8, -1);
      return $ === "Object" && B.constructor && ($ = B.constructor.name), $ === "Map" || $ === "Set" ? Array.from(B) : $ === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test($) ? p(B, _) : void 0;
    }
  }(s)) || e) {
    r && (s = r);
    var R = 0;
    return function() {
      return R >= s.length ? { done: !0 } : { done: !1, value: s[R++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
var l = !0;
function u(s, e) {
  return e === void 0 && (e = {}), new TokenType("name", e);
}
var d = /* @__PURE__ */ new WeakMap();
function m(s) {
  var e = d.get(s.Parser.acorn || s);
  if (!e) {
    var r = { assert: u(0, { startsExpr: l }), asserts: u(0, { startsExpr: l }), global: u(0, { startsExpr: l }), keyof: u(0, { startsExpr: l }), readonly: u(0, { startsExpr: l }), unique: u(0, { startsExpr: l }), abstract: u(0, { startsExpr: l }), declare: u(0, { startsExpr: l }), enum: u(0, { startsExpr: l }), module: u(0, { startsExpr: l }), namespace: u(0, { startsExpr: l }), interface: u(0, { startsExpr: l }), type: u(0, { startsExpr: l }) }, R = { at: new TokenType("@"), jsxName: new TokenType("jsxName"), jsxText: new TokenType("jsxText", { beforeExpr: !0 }), jsxTagStart: new TokenType("jsxTagStart", { startsExpr: !0 }), jsxTagEnd: new TokenType("jsxTagEnd") }, B = { tc_oTag: new TokContext("<tag", !1, !1), tc_cTag: new TokContext("</tag", !1, !1), tc_expr: new TokContext("<tag>...</tag>", !0, !0) }, _ = new RegExp("^(?:" + Object.keys(r).join("|") + ")$");
    R.jsxTagStart.updateContext = function() {
      this.context.push(B.tc_expr), this.context.push(B.tc_oTag), this.exprAllowed = !1;
    }, R.jsxTagEnd.updateContext = function($) {
      var F = this.context.pop();
      F === B.tc_oTag && $ === types$1.slash || F === B.tc_cTag ? (this.context.pop(), this.exprAllowed = this.curContext() === B.tc_expr) : this.exprAllowed = !0;
    }, e = { tokTypes: n({}, r, R), tokContexts: n({}, B), keywordsRegExp: _, tokenIsLiteralPropertyName: function($) {
      return [types$1.name, types$1.string, types$1.num].concat(Object.values(keywords), Object.values(r)).includes($);
    }, tokenIsKeywordOrIdentifier: function($) {
      return [types$1.name].concat(Object.values(keywords), Object.values(r)).includes($);
    }, tokenIsIdentifier: function($) {
      return [].concat(Object.values(r), [types$1.name]).includes($);
    }, tokenIsTSDeclarationStart: function($) {
      return [r.abstract, r.declare, r.enum, r.module, r.namespace, r.interface, r.type].includes($);
    }, tokenIsTSTypeOperator: function($) {
      return [r.keyof, r.readonly, r.unique].includes($);
    }, tokenIsTemplate: function($) {
      return $ === types$1.invalidTemplate;
    } };
  }
  return e;
}
var f = 1024, y = new RegExp("(?:[^\\S\\n\\r\\u2028\\u2029]|\\/\\/.*|\\/\\*.*?\\*\\/)*", "y"), x = new RegExp("(?=(" + y.source + "))\\1" + /(?=[\n\r\u2028\u2029]|\/\*(?!.*?\*\/)|$)/.source, "y"), T = function() {
  this.shorthandAssign = void 0, this.trailingComma = void 0, this.parenthesizedAssign = void 0, this.parenthesizedBind = void 0, this.doubleProto = void 0, this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
function v(s, e) {
  var r = e.key.name, R = s[r], B = "true";
  return e.type !== "MethodDefinition" || e.kind !== "get" && e.kind !== "set" || (B = (e.static ? "s" : "i") + e.kind), R === "iget" && B === "iset" || R === "iset" && B === "iget" || R === "sget" && B === "sset" || R === "sset" && B === "sget" ? (s[r] = "true", !1) : !!R || (s[r] = B, !1);
}
function P(s, e) {
  var r = s.key;
  return !s.computed && (r.type === "Identifier" && r.name === e || r.type === "Literal" && r.value === e);
}
var b = { AbstractMethodHasImplementation: function(s) {
  return "Method '" + s.methodName + "' cannot have an implementation because it is marked abstract.";
}, AbstractPropertyHasInitializer: function(s) {
  return "Property '" + s.propertyName + "' cannot have an initializer because it is marked abstract.";
}, AccesorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.", AccesorCannotHaveTypeParameters: "An accessor cannot have type parameters.", CannotFindName: function(s) {
  return "Cannot find name '" + s.name + "'.";
}, ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.", ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.", ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference: "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.", ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.", DeclareAccessor: function(s) {
  return "'declare' is not allowed in " + s.kind + "ters.";
}, DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.", DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.", DuplicateAccessibilityModifier: function() {
  return "Accessibility modifier already seen.";
}, DuplicateModifier: function(s) {
  return "Duplicate modifier: '" + s.modifier + "'.";
}, EmptyHeritageClauseType: function(s) {
  return "'" + s.token + "' list cannot be empty.";
}, EmptyTypeArguments: "Type argument list cannot be empty.", EmptyTypeParameters: "Type parameter list cannot be empty.", ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.", ImportAliasHasImportType: "An import alias can not use 'import type'.", IncompatibleModifiers: function(s) {
  var e = s.modifiers;
  return "'" + e[0] + "' modifier cannot be used with '" + e[1] + "' modifier.";
}, IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.", IndexSignatureHasAccessibility: function(s) {
  return "Index signatures cannot have an accessibility modifier ('" + s.modifier + "').";
}, IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.", IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.", IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.", InitializerNotAllowedInAmbientContext: "Initializers are not allowed in ambient contexts.", InvalidModifierOnTypeMember: function(s) {
  return "'" + s.modifier + "' modifier cannot appear on a type member.";
}, InvalidModifierOnTypeParameter: function(s) {
  return "'" + s.modifier + "' modifier cannot appear on a type parameter.";
}, InvalidModifierOnTypeParameterPositions: function(s) {
  return "'" + s.modifier + "' modifier can only appear on a type parameter of a class, interface or type alias.";
}, InvalidModifiersOrder: function(s) {
  var e = s.orderedModifiers;
  return "'" + e[0] + "' modifier must precede '" + e[1] + "' modifier.";
}, InvalidPropertyAccessAfterInstantiationExpression: "Invalid property access after an instantiation expression. You can either wrap the instantiation expression in parentheses, or delete the type arguments.", InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.", MissingInterfaceName: "'interface' declarations must be followed by an identifier.", MixedLabeledAndUnlabeledElements: "Tuple members must all have names or all not have names.", NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.", NonClassMethodPropertyHasAbstractModifer: "'abstract' modifier can only appear on a class, method, or property declaration.", OptionalTypeBeforeRequired: "A required element cannot follow an optional element.", OverrideNotInSubClass: "This member cannot have an 'override' modifier because its containing class does not extend another class.", PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.", PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.", PrivateElementHasAccessibility: function(s) {
  return "Private elements cannot have an accessibility modifier ('" + s.modifier + "').";
}, PrivateMethodsHasAccessibility: function(s) {
  return "Private methods cannot have an accessibility modifier ('" + s.modifier + "').";
}, ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.", ReservedArrowTypeParam: "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.", ReservedTypeAssertion: "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.", SetAccesorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.", SetAccesorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.", SetAccesorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.", SingleTypeParameterWithoutTrailingComma: function(s) {
  var e = s.typeParameterName;
  return "Single type parameter " + e + " should have a trailing comma. Example usage: <" + e + ",>.";
}, StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.", TypeAnnotationAfterAssign: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.", TypeImportCannotSpecifyDefaultAndNamed: "A type-only import can specify a default import or named bindings, but not both.", TypeModifierIsUsedInTypeExports: "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.", TypeModifierIsUsedInTypeImports: "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.", UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.", UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.", GenericsEndWithComma: "Trailing comma is not allowed at the end of generics.", UnexpectedTypeAnnotation: "Did not expect a type annotation here.", UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.", UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.", UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.", UnsupportedSignatureParameterKind: function(s) {
  return "Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got " + s.type + ".";
}, LetInLexicalBinding: "'let' is not allowed to be used as a name in 'let' or 'const' declarations." }, g = { quot: '"', amp: "&", apos: "'", lt: "<", gt: ">", nbsp: " ", iexcl: "¡", cent: "¢", pound: "£", curren: "¤", yen: "¥", brvbar: "¦", sect: "§", uml: "¨", copy: "©", ordf: "ª", laquo: "«", not: "¬", shy: "­", reg: "®", macr: "¯", deg: "°", plusmn: "±", sup2: "²", sup3: "³", acute: "´", micro: "µ", para: "¶", middot: "·", cedil: "¸", sup1: "¹", ordm: "º", raquo: "»", frac14: "¼", frac12: "½", frac34: "¾", iquest: "¿", Agrave: "À", Aacute: "Á", Acirc: "Â", Atilde: "Ã", Auml: "Ä", Aring: "Å", AElig: "Æ", Ccedil: "Ç", Egrave: "È", Eacute: "É", Ecirc: "Ê", Euml: "Ë", Igrave: "Ì", Iacute: "Í", Icirc: "Î", Iuml: "Ï", ETH: "Ð", Ntilde: "Ñ", Ograve: "Ò", Oacute: "Ó", Ocirc: "Ô", Otilde: "Õ", Ouml: "Ö", times: "×", Oslash: "Ø", Ugrave: "Ù", Uacute: "Ú", Ucirc: "Û", Uuml: "Ü", Yacute: "Ý", THORN: "Þ", szlig: "ß", agrave: "à", aacute: "á", acirc: "â", atilde: "ã", auml: "ä", aring: "å", aelig: "æ", ccedil: "ç", egrave: "è", eacute: "é", ecirc: "ê", euml: "ë", igrave: "ì", iacute: "í", icirc: "î", iuml: "ï", eth: "ð", ntilde: "ñ", ograve: "ò", oacute: "ó", ocirc: "ô", otilde: "õ", ouml: "ö", divide: "÷", oslash: "ø", ugrave: "ù", uacute: "ú", ucirc: "û", uuml: "ü", yacute: "ý", thorn: "þ", yuml: "ÿ", OElig: "Œ", oelig: "œ", Scaron: "Š", scaron: "š", Yuml: "Ÿ", fnof: "ƒ", circ: "ˆ", tilde: "˜", Alpha: "Α", Beta: "Β", Gamma: "Γ", Delta: "Δ", Epsilon: "Ε", Zeta: "Ζ", Eta: "Η", Theta: "Θ", Iota: "Ι", Kappa: "Κ", Lambda: "Λ", Mu: "Μ", Nu: "Ν", Xi: "Ξ", Omicron: "Ο", Pi: "Π", Rho: "Ρ", Sigma: "Σ", Tau: "Τ", Upsilon: "Υ", Phi: "Φ", Chi: "Χ", Psi: "Ψ", Omega: "Ω", alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", omicron: "ο", pi: "π", rho: "ρ", sigmaf: "ς", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", chi: "χ", psi: "ψ", omega: "ω", thetasym: "ϑ", upsih: "ϒ", piv: "ϖ", ensp: " ", emsp: " ", thinsp: " ", zwnj: "‌", zwj: "‍", lrm: "‎", rlm: "‏", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", sbquo: "‚", ldquo: "“", rdquo: "”", bdquo: "„", dagger: "†", Dagger: "‡", bull: "•", hellip: "…", permil: "‰", prime: "′", Prime: "″", lsaquo: "‹", rsaquo: "›", oline: "‾", frasl: "⁄", euro: "€", image: "ℑ", weierp: "℘", real: "ℜ", trade: "™", alefsym: "ℵ", larr: "←", uarr: "↑", rarr: "→", darr: "↓", harr: "↔", crarr: "↵", lArr: "⇐", uArr: "⇑", rArr: "⇒", dArr: "⇓", hArr: "⇔", forall: "∀", part: "∂", exist: "∃", empty: "∅", nabla: "∇", isin: "∈", notin: "∉", ni: "∋", prod: "∏", sum: "∑", minus: "−", lowast: "∗", radic: "√", prop: "∝", infin: "∞", ang: "∠", and: "∧", or: "∨", cap: "∩", cup: "∪", int: "∫", there4: "∴", sim: "∼", cong: "≅", asymp: "≈", ne: "≠", equiv: "≡", le: "≤", ge: "≥", sub: "⊂", sup: "⊃", nsub: "⊄", sube: "⊆", supe: "⊇", oplus: "⊕", otimes: "⊗", perp: "⊥", sdot: "⋅", lceil: "⌈", rceil: "⌉", lfloor: "⌊", rfloor: "⌋", lang: "〈", rang: "〉", loz: "◊", spades: "♠", clubs: "♣", hearts: "♥", diams: "♦" }, A = /^[\da-fA-F]+$/, S = /^\d+$/;
function C$1(s) {
  return s && (s.type === "JSXIdentifier" ? s.name : s.type === "JSXNamespacedName" ? s.namespace.name + ":" + s.name.name : s.type === "JSXMemberExpression" ? C$1(s.object) + "." + C$1(s.property) : void 0);
}
var E = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
function k(s) {
  if (!s) throw new Error("Assert fail");
}
function I(s) {
  return s === "accessor";
}
function N(s) {
  return s === "in" || s === "out";
}
function w(s, e) {
  return 2 | (s ? 4 : 0) | (e ? 8 : 0);
}
function L(s) {
  if (s.type !== "MemberExpression") return !1;
  var e = s.property;
  return (!s.computed || !(e.type !== "TemplateLiteral" || e.expressions.length > 0)) && M(s.object);
}
function M(s) {
  return s.type === "Identifier" || s.type === "MemberExpression" && !s.computed && M(s.object);
}
function O(s) {
  return s === "private" || s === "public" || s === "protected";
}
function D(s) {
  var e = {}, r = e.dts, R = r !== void 0 && r, B = e.allowSatisfies, _ = B !== void 0 && B;
  return function($) {
    var F = $.acorn || t$1, V = m(F), H = F.tokTypes, W = F.keywordTypes, U = F.isIdentifierStart, z = F.lineBreak, K = F.isNewLine, X = F.tokContexts, Z = F.isIdentifierChar, Y = V.tokTypes, te = V.tokContexts, ue = V.keywordsRegExp, fe = V.tokenIsLiteralPropertyName, de = V.tokenIsTemplate, re = V.tokenIsTSDeclarationStart, ae = V.tokenIsIdentifier, le = V.tokenIsKeywordOrIdentifier, me = V.tokenIsTSTypeOperator;
    function Se(ce, ge, Ce) {
      Ce === void 0 && (Ce = ce.length);
      for (var be = ge; be < Ce; be++) {
        var xe = ce.charCodeAt(be);
        if (K(xe)) return be < Ce - 1 && xe === 13 && ce.charCodeAt(be + 1) === 10 ? be + 2 : be + 1;
      }
      return -1;
    }
    $ = function(ce, ge, Ce) {
      var be = Ce.tokTypes, xe = ge.tokTypes;
      return function(Q) {
        function q() {
          return Q.apply(this, arguments) || this;
        }
        o(q, Q);
        var j = q.prototype;
        return j.takeDecorators = function(G) {
          var J = this.decoratorStack[this.decoratorStack.length - 1];
          J.length && (G.decorators = J, this.resetStartLocationFromNode(G, J[0]), this.decoratorStack[this.decoratorStack.length - 1] = []);
        }, j.parseDecorators = function(G) {
          for (var J = this.decoratorStack[this.decoratorStack.length - 1]; this.match(xe.at); ) {
            var ee = this.parseDecorator();
            J.push(ee);
          }
          this.match(be._export) ? G || this.unexpected() : this.canHaveLeadingDecorator() || this.raise(this.start, "Leading decorators must be attached to a class declaration.");
        }, j.parseDecorator = function() {
          var G = this.startNode();
          this.next(), this.decoratorStack.push([]);
          var J, ee = this.start, se = this.startLoc;
          if (this.match(be.parenL)) {
            var ne = this.start, oe = this.startLoc;
            if (this.next(), J = this.parseExpression(), this.expect(be.parenR), this.options.preserveParens) {
              var he = this.startNodeAt(ne, oe);
              he.expression = J, J = this.finishNode(he, "ParenthesizedExpression");
            }
          } else for (J = this.parseIdent(!1); this.eat(be.dot); ) {
            var pe = this.startNodeAt(ee, se);
            pe.object = J, pe.property = this.parseIdent(!0), pe.computed = !1, J = this.finishNode(pe, "MemberExpression");
          }
          return G.expression = this.parseMaybeDecoratorArguments(J), this.decoratorStack.pop(), this.finishNode(G, "Decorator");
        }, j.parseMaybeDecoratorArguments = function(G) {
          if (this.eat(be.parenL)) {
            var J = this.startNodeAtNode(G);
            return J.callee = G, J.arguments = this.parseExprList(be.parenR, !1), this.finishNode(J, "CallExpression");
          }
          return G;
        }, q;
      }(ce);
    }($, V, F), $ = function(ce, ge, Ce, be) {
      var xe = ce.tokTypes, Q = ge.tokTypes, q = ce.isNewLine, j = ce.isIdentifierChar, G = Object.assign({ allowNamespaces: !0, allowNamespacedObjects: !0 }, {});
      return function(J) {
        function ee() {
          return J.apply(this, arguments) || this;
        }
        o(ee, J);
        var se = ee.prototype;
        return se.jsx_readToken = function() {
          for (var ne = "", oe = this.pos; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated JSX contents");
            var he = this.input.charCodeAt(this.pos);
            switch (he) {
              case 60:
              case 123:
                return this.pos === this.start ? he === 60 && this.exprAllowed ? (++this.pos, this.finishToken(Q.jsxTagStart)) : this.getTokenFromCode(he) : (ne += this.input.slice(oe, this.pos), this.finishToken(Q.jsxText, ne));
              case 38:
                ne += this.input.slice(oe, this.pos), ne += this.jsx_readEntity(), oe = this.pos;
                break;
              case 62:
              case 125:
                this.raise(this.pos, "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (he === 62 ? "&gt;" : "&rbrace;") + '` or `{"' + this.input[this.pos] + '"}`?');
              default:
                q(he) ? (ne += this.input.slice(oe, this.pos), ne += this.jsx_readNewLine(!0), oe = this.pos) : ++this.pos;
            }
          }
        }, se.jsx_readNewLine = function(ne) {
          var oe, he = this.input.charCodeAt(this.pos);
          return ++this.pos, he === 13 && this.input.charCodeAt(this.pos) === 10 ? (++this.pos, oe = ne ? `
` : `\r
`) : oe = String.fromCharCode(he), this.options.locations && (++this.curLine, this.lineStart = this.pos), oe;
        }, se.jsx_readString = function(ne) {
          for (var oe = "", he = ++this.pos; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
            var pe = this.input.charCodeAt(this.pos);
            if (pe === ne) break;
            pe === 38 ? (oe += this.input.slice(he, this.pos), oe += this.jsx_readEntity(), he = this.pos) : q(pe) ? (oe += this.input.slice(he, this.pos), oe += this.jsx_readNewLine(!1), he = this.pos) : ++this.pos;
          }
          return oe += this.input.slice(he, this.pos++), this.finishToken(xe.string, oe);
        }, se.jsx_readEntity = function() {
          var ne, oe = "", he = 0, pe = this.input[this.pos];
          pe !== "&" && this.raise(this.pos, "Entity must start with an ampersand");
          for (var ve = ++this.pos; this.pos < this.input.length && he++ < 10; ) {
            if ((pe = this.input[this.pos++]) === ";") {
              oe[0] === "#" ? oe[1] === "x" ? (oe = oe.substr(2), A.test(oe) && (ne = String.fromCharCode(parseInt(oe, 16)))) : (oe = oe.substr(1), S.test(oe) && (ne = String.fromCharCode(parseInt(oe, 10)))) : ne = g[oe];
              break;
            }
            oe += pe;
          }
          return ne || (this.pos = ve, "&");
        }, se.jsx_readWord = function() {
          var ne, oe = this.pos;
          do
            ne = this.input.charCodeAt(++this.pos);
          while (j(ne) || ne === 45);
          return this.finishToken(Q.jsxName, this.input.slice(oe, this.pos));
        }, se.jsx_parseIdentifier = function() {
          var ne = this.startNode();
          return this.type === Q.jsxName ? ne.name = this.value : this.type.keyword ? ne.name = this.type.keyword : this.unexpected(), this.next(), this.finishNode(ne, "JSXIdentifier");
        }, se.jsx_parseNamespacedName = function() {
          var ne = this.start, oe = this.startLoc, he = this.jsx_parseIdentifier();
          if (!G.allowNamespaces || !this.eat(xe.colon)) return he;
          var pe = this.startNodeAt(ne, oe);
          return pe.namespace = he, pe.name = this.jsx_parseIdentifier(), this.finishNode(pe, "JSXNamespacedName");
        }, se.jsx_parseElementName = function() {
          if (this.type === Q.jsxTagEnd) return "";
          var ne = this.start, oe = this.startLoc, he = this.jsx_parseNamespacedName();
          for (this.type !== xe.dot || he.type !== "JSXNamespacedName" || G.allowNamespacedObjects || this.unexpected(); this.eat(xe.dot); ) {
            var pe = this.startNodeAt(ne, oe);
            pe.object = he, pe.property = this.jsx_parseIdentifier(), he = this.finishNode(pe, "JSXMemberExpression");
          }
          return he;
        }, se.jsx_parseAttributeValue = function() {
          switch (this.type) {
            case xe.braceL:
              var ne = this.jsx_parseExpressionContainer();
              return ne.expression.type === "JSXEmptyExpression" && this.raise(ne.start, "JSX attributes must only be assigned a non-empty expression"), ne;
            case Q.jsxTagStart:
            case xe.string:
              return this.parseExprAtom();
            default:
              this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
          }
        }, se.jsx_parseEmptyExpression = function() {
          var ne = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
          return this.finishNodeAt(ne, "JSXEmptyExpression", this.start, this.startLoc);
        }, se.jsx_parseExpressionContainer = function() {
          var ne = this.startNode();
          return this.next(), ne.expression = this.type === xe.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression(), this.expect(xe.braceR), this.finishNode(ne, "JSXExpressionContainer");
        }, se.jsx_parseAttribute = function() {
          var ne = this.startNode();
          return this.eat(xe.braceL) ? (this.expect(xe.ellipsis), ne.argument = this.parseMaybeAssign(), this.expect(xe.braceR), this.finishNode(ne, "JSXSpreadAttribute")) : (ne.name = this.jsx_parseNamespacedName(), ne.value = this.eat(xe.eq) ? this.jsx_parseAttributeValue() : null, this.finishNode(ne, "JSXAttribute"));
        }, se.jsx_parseOpeningElementAt = function(ne, oe) {
          var he = this.startNodeAt(ne, oe);
          he.attributes = [];
          var pe = this.jsx_parseElementName();
          for (pe && (he.name = pe); this.type !== xe.slash && this.type !== Q.jsxTagEnd; ) he.attributes.push(this.jsx_parseAttribute());
          return he.selfClosing = this.eat(xe.slash), this.expect(Q.jsxTagEnd), this.finishNode(he, pe ? "JSXOpeningElement" : "JSXOpeningFragment");
        }, se.jsx_parseClosingElementAt = function(ne, oe) {
          var he = this.startNodeAt(ne, oe), pe = this.jsx_parseElementName();
          return pe && (he.name = pe), this.expect(Q.jsxTagEnd), this.finishNode(he, pe ? "JSXClosingElement" : "JSXClosingFragment");
        }, se.jsx_parseElementAt = function(ne, oe) {
          var he = this.startNodeAt(ne, oe), pe = [], ve = this.jsx_parseOpeningElementAt(ne, oe), we = null;
          if (!ve.selfClosing) {
            e: for (; ; ) switch (this.type) {
              case Q.jsxTagStart:
                if (ne = this.start, oe = this.startLoc, this.next(), this.eat(xe.slash)) {
                  we = this.jsx_parseClosingElementAt(ne, oe);
                  break e;
                }
                pe.push(this.jsx_parseElementAt(ne, oe));
                break;
              case Q.jsxText:
                pe.push(this.parseExprAtom());
                break;
              case xe.braceL:
                pe.push(this.jsx_parseExpressionContainer());
                break;
              default:
                this.unexpected();
            }
            C$1(we.name) !== C$1(ve.name) && this.raise(we.start, "Expected corresponding JSX closing tag for <" + C$1(ve.name) + ">");
          }
          var ye = ve.name ? "Element" : "Fragment";
          return he["opening" + ye] = ve, he["closing" + ye] = we, he.children = pe, this.type === xe.relational && this.value === "<" && this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag"), this.finishNode(he, "JSX" + ye);
        }, se.jsx_parseText = function() {
          var ne = this.parseLiteral(this.value);
          return ne.type = "JSXText", ne;
        }, se.jsx_parseElement = function() {
          var ne = this.start, oe = this.startLoc;
          return this.next(), this.jsx_parseElementAt(ne, oe);
        }, ee;
      }(Ce);
    }(F, V, $), $ = function(ce, ge, Ce) {
      var be = ge.tokTypes, xe = Ce.tokTypes;
      return function(Q) {
        function q() {
          return Q.apply(this, arguments) || this;
        }
        o(q, Q);
        var j = q.prototype;
        return j.parseMaybeImportAttributes = function(G) {
          if (this.type === xe._with || this.type === be.assert) {
            this.next();
            var J = this.parseImportAttributes();
            J && (G.attributes = J);
          }
        }, j.parseImportAttributes = function() {
          this.expect(xe.braceL);
          var G = this.parseWithEntries();
          return this.expect(xe.braceR), G;
        }, j.parseWithEntries = function() {
          var G = [], J = /* @__PURE__ */ new Set();
          do {
            if (this.type === xe.braceR) break;
            var ee, se = this.startNode();
            ee = this.type === xe.string ? this.parseLiteral(this.value) : this.parseIdent(!0), this.next(), se.key = ee, J.has(se.key.name) && this.raise(this.pos, "Duplicated key in attributes"), J.add(se.key.name), this.type !== xe.string && this.raise(this.pos, "Only string is supported as an attribute value"), se.value = this.parseLiteral(this.value), G.push(this.finishNode(se, "ImportAttribute"));
          } while (this.eat(xe.comma));
          return G;
        }, q;
      }(ce);
    }($, V, F);
    var ke = /* @__PURE__ */ function(ce) {
      function ge(q, j, G) {
        var J;
        return (J = ce.call(this, q, j, G) || this).preValue = null, J.preToken = null, J.isLookahead = !1, J.isAmbientContext = !1, J.inAbstractClass = !1, J.inType = !1, J.inDisallowConditionalTypesContext = !1, J.maybeInArrowParameters = !1, J.shouldParseArrowReturnType = void 0, J.shouldParseAsyncArrowReturnType = void 0, J.decoratorStack = [[]], J.importsStack = [[]], J.importOrExportOuterKind = void 0, J.tsParseConstModifier = J.tsParseModifiers.bind(function(ee) {
          if (ee === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return ee;
        }(J), { allowedModifiers: ["const"], disallowedModifiers: ["in", "out"], errorTemplate: b.InvalidModifierOnTypeParameterPositions }), J;
      }
      o(ge, ce);
      var Ce, be, xe, Q = ge.prototype;
      return Q.getTokenFromCodeInType = function(q) {
        return q === 62 || q === 60 ? this.finishOp(H.relational, 1) : ce.prototype.getTokenFromCode.call(this, q);
      }, Q.readToken = function(q) {
        if (!this.inType) {
          var j = this.curContext();
          if (j === te.tc_expr) return this.jsx_readToken();
          if (j === te.tc_oTag || j === te.tc_cTag) {
            if (U(q)) return this.jsx_readWord();
            if (q == 62) return ++this.pos, this.finishToken(Y.jsxTagEnd);
            if ((q === 34 || q === 39) && j == te.tc_oTag) return this.jsx_readString(q);
          }
          if (q === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) return ++this.pos, this.finishToken(Y.jsxTagStart);
        }
        return ce.prototype.readToken.call(this, q);
      }, Q.getTokenFromCode = function(q) {
        return this.inType ? this.getTokenFromCodeInType(q) : q === 64 ? (++this.pos, this.finishToken(Y.at)) : ce.prototype.getTokenFromCode.call(this, q);
      }, Q.isAbstractClass = function() {
        return this.ts_isContextual(Y.abstract) && this.lookahead().type === H._class;
      }, Q.finishNode = function(q, j) {
        return q.type !== "" && q.end !== 0 ? q : ce.prototype.finishNode.call(this, q, j);
      }, Q.tryParse = function(q, j) {
        j === void 0 && (j = this.cloneCurLookaheadState());
        var G = { node: null };
        try {
          return { node: q(function(ee) {
            throw ee === void 0 && (ee = null), G.node = ee, G;
          }), error: null, thrown: !1, aborted: !1, failState: null };
        } catch (ee) {
          var J = this.getCurLookaheadState();
          if (this.setLookaheadState(j), ee instanceof SyntaxError) return { node: null, error: ee, thrown: !0, aborted: !1, failState: J };
          if (ee === G) return { node: G.node, error: null, thrown: !1, aborted: !0, failState: J };
          throw ee;
        }
      }, Q.setOptionalParametersError = function(q, j) {
        var G;
        q.optionalParametersLoc = (G = j == null ? void 0 : j.loc) != null ? G : this.startLoc;
      }, Q.reScan_lt_gt = function() {
        this.type === H.relational && (this.pos -= 1, this.readToken_lt_gt(this.fullCharCodeAtPos()));
      }, Q.reScan_lt = function() {
        var q = this.type;
        return q === H.bitShift ? (this.pos -= 2, this.finishOp(H.relational, 1), H.relational) : q;
      }, Q.resetEndLocation = function(q, j) {
        j === void 0 && (j = this.lastTokEndLoc), q.end = j.column, q.loc.end = j, this.options.ranges && (q.range[1] = j.column);
      }, Q.startNodeAtNode = function(q) {
        return ce.prototype.startNodeAt.call(this, q.start, q.loc.start);
      }, Q.nextTokenStart = function() {
        return this.nextTokenStartSince(this.pos);
      }, Q.tsHasSomeModifiers = function(q, j) {
        return j.some(function(G) {
          return O(G) ? q.accessibility === G : !!q[G];
        });
      }, Q.tsIsStartOfStaticBlocks = function() {
        return this.isContextual("static") && this.lookaheadCharCode() === 123;
      }, Q.tsCheckForInvalidTypeCasts = function(q) {
        var j = this;
        q.forEach(function(G) {
          (G == null ? void 0 : G.type) === "TSTypeCastExpression" && j.raise(G.typeAnnotation.start, b.UnexpectedTypeAnnotation);
        });
      }, Q.atPossibleAsyncArrow = function(q) {
        return q.type === "Identifier" && q.name === "async" && this.lastTokEndLoc.column === q.end && !this.canInsertSemicolon() && q.end - q.start == 5 && q.start === this.potentialArrowAt;
      }, Q.tsIsIdentifier = function() {
        return ae(this.type);
      }, Q.tsTryParseTypeOrTypePredicateAnnotation = function() {
        return this.match(H.colon) ? this.tsParseTypeOrTypePredicateAnnotation(H.colon) : void 0;
      }, Q.tsTryParseGenericAsyncArrowFunction = function(q, j, G) {
        var J = this;
        if (this.tsMatchLeftRelational()) {
          var ee = this.maybeInArrowParameters;
          this.maybeInArrowParameters = !0;
          var se = this.tsTryParseAndCatch(function() {
            var ne = J.startNodeAt(q, j);
            return ne.typeParameters = J.tsParseTypeParameters(), ce.prototype.parseFunctionParams.call(J, ne), ne.returnType = J.tsTryParseTypeOrTypePredicateAnnotation(), J.expect(H.arrow), ne;
          });
          if (this.maybeInArrowParameters = ee, se) return ce.prototype.parseArrowExpression.call(this, se, null, !0, G);
        }
      }, Q.tsParseTypeArgumentsInExpression = function() {
        if (this.reScan_lt() === H.relational) return this.tsParseTypeArguments();
      }, Q.tsInNoContext = function(q) {
        var j = this.context;
        this.context = [j[0]];
        try {
          return q();
        } finally {
          this.context = j;
        }
      }, Q.tsTryParseTypeAnnotation = function() {
        return this.match(H.colon) ? this.tsParseTypeAnnotation() : void 0;
      }, Q.isUnparsedContextual = function(q, j) {
        var G = q + j.length;
        if (this.input.slice(q, G) === j) {
          var J = this.input.charCodeAt(G);
          return !(Z(J) || (64512 & J) == 55296);
        }
        return !1;
      }, Q.isAbstractConstructorSignature = function() {
        return this.ts_isContextual(Y.abstract) && this.lookahead().type === H._new;
      }, Q.nextTokenStartSince = function(q) {
        return E.lastIndex = q, E.test(this.input) ? E.lastIndex : q;
      }, Q.lookaheadCharCode = function() {
        return this.input.charCodeAt(this.nextTokenStart());
      }, Q.compareLookaheadState = function(q, j) {
        for (var G = 0, J = Object.keys(q); G < J.length; G++) {
          var ee = J[G];
          if (q[ee] !== j[ee]) return !1;
        }
        return !0;
      }, Q.createLookaheadState = function() {
        this.value = null, this.context = [this.curContext()];
      }, Q.getCurLookaheadState = function() {
        return { endLoc: this.endLoc, lastTokEnd: this.lastTokEnd, lastTokStart: this.lastTokStart, lastTokStartLoc: this.lastTokStartLoc, pos: this.pos, value: this.value, type: this.type, start: this.start, end: this.end, context: this.context, startLoc: this.startLoc, lastTokEndLoc: this.lastTokEndLoc, curLine: this.curLine, lineStart: this.lineStart, curPosition: this.curPosition, containsEsc: this.containsEsc };
      }, Q.cloneCurLookaheadState = function() {
        return { pos: this.pos, value: this.value, type: this.type, start: this.start, end: this.end, context: this.context && this.context.slice(), startLoc: this.startLoc, lastTokEndLoc: this.lastTokEndLoc, endLoc: this.endLoc, lastTokEnd: this.lastTokEnd, lastTokStart: this.lastTokStart, lastTokStartLoc: this.lastTokStartLoc, curLine: this.curLine, lineStart: this.lineStart, curPosition: this.curPosition, containsEsc: this.containsEsc };
      }, Q.setLookaheadState = function(q) {
        this.pos = q.pos, this.value = q.value, this.endLoc = q.endLoc, this.lastTokEnd = q.lastTokEnd, this.lastTokStart = q.lastTokStart, this.lastTokStartLoc = q.lastTokStartLoc, this.type = q.type, this.start = q.start, this.end = q.end, this.context = q.context, this.startLoc = q.startLoc, this.lastTokEndLoc = q.lastTokEndLoc, this.curLine = q.curLine, this.lineStart = q.lineStart, this.curPosition = q.curPosition, this.containsEsc = q.containsEsc;
      }, Q.tsLookAhead = function(q) {
        var j = this.getCurLookaheadState(), G = q();
        return this.setLookaheadState(j), G;
      }, Q.lookahead = function(q) {
        var j = this.getCurLookaheadState();
        if (this.createLookaheadState(), this.isLookahead = !0, q !== void 0) for (var G = 0; G < q; G++) this.nextToken();
        else this.nextToken();
        this.isLookahead = !1;
        var J = this.getCurLookaheadState();
        return this.setLookaheadState(j), J;
      }, Q.readWord = function() {
        var q = this.readWord1(), j = H.name;
        return this.keywords.test(q) ? j = W[q] : new RegExp(ue).test(q) && (j = Y[q]), this.finishToken(j, q);
      }, Q.skipBlockComment = function() {
        var q;
        this.isLookahead || (q = this.options.onComment && this.curPosition());
        var j = this.pos, G = this.input.indexOf("*/", this.pos += 2);
        if (G === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = G + 2, this.options.locations) for (var J, ee = j; (J = Se(this.input, ee, this.pos)) > -1; ) ++this.curLine, ee = this.lineStart = J;
        this.isLookahead || this.options.onComment && this.options.onComment(!0, this.input.slice(j + 2, G), j, this.pos, q, this.curPosition());
      }, Q.skipLineComment = function(q) {
        var j, G = this.pos;
        this.isLookahead || (j = this.options.onComment && this.curPosition());
        for (var J = this.input.charCodeAt(this.pos += q); this.pos < this.input.length && !K(J); ) J = this.input.charCodeAt(++this.pos);
        this.isLookahead || this.options.onComment && this.options.onComment(!1, this.input.slice(G + q, this.pos), G, this.pos, j, this.curPosition());
      }, Q.finishToken = function(q, j) {
        this.preValue = this.value, this.preToken = this.type, this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
        var G = this.type;
        this.type = q, this.value = j, this.isLookahead || this.updateContext(G);
      }, Q.resetStartLocation = function(q, j, G) {
        q.start = j, q.loc.start = G, this.options.ranges && (q.range[0] = j);
      }, Q.isLineTerminator = function() {
        return this.eat(H.semi) || ce.prototype.canInsertSemicolon.call(this);
      }, Q.hasFollowingLineBreak = function() {
        return x.lastIndex = this.end, x.test(this.input);
      }, Q.addExtra = function(q, j, G, J) {
        if (J === void 0 && (J = !0), q) {
          var ee = q.extra = q.extra || {};
          J ? ee[j] = G : Object.defineProperty(ee, j, { enumerable: J, value: G });
        }
      }, Q.isLiteralPropertyName = function() {
        return fe(this.type);
      }, Q.hasPrecedingLineBreak = function() {
        return z.test(this.input.slice(this.lastTokEndLoc.index, this.start));
      }, Q.createIdentifier = function(q, j) {
        return q.name = j, this.finishNode(q, "Identifier");
      }, Q.resetStartLocationFromNode = function(q, j) {
        this.resetStartLocation(q, j.start, j.loc.start);
      }, Q.isThisParam = function(q) {
        return q.type === "Identifier" && q.name === "this";
      }, Q.isLookaheadContextual = function(q) {
        var j = this.nextTokenStart();
        return this.isUnparsedContextual(j, q);
      }, Q.ts_type_isContextual = function(q, j) {
        return q === j && !this.containsEsc;
      }, Q.ts_isContextual = function(q) {
        return this.type === q && !this.containsEsc;
      }, Q.ts_isContextualWithState = function(q, j) {
        return q.type === j && !q.containsEsc;
      }, Q.isContextualWithState = function(q, j) {
        return j.type === H.name && j.value === q && !j.containsEsc;
      }, Q.tsIsStartOfMappedType = function() {
        return this.next(), this.eat(H.plusMin) ? this.ts_isContextual(Y.readonly) : (this.ts_isContextual(Y.readonly) && this.next(), !!this.match(H.bracketL) && (this.next(), !!this.tsIsIdentifier() && (this.next(), this.match(H._in))));
      }, Q.tsInDisallowConditionalTypesContext = function(q) {
        var j = this.inDisallowConditionalTypesContext;
        this.inDisallowConditionalTypesContext = !0;
        try {
          return q();
        } finally {
          this.inDisallowConditionalTypesContext = j;
        }
      }, Q.tsTryParseType = function() {
        return this.tsEatThenParseType(H.colon);
      }, Q.match = function(q) {
        return this.type === q;
      }, Q.matchJsx = function(q) {
        return this.type === V.tokTypes[q];
      }, Q.ts_eatWithState = function(q, j, G) {
        if (q === G.type) {
          for (var J = 0; J < j; J++) this.next();
          return !0;
        }
        return !1;
      }, Q.ts_eatContextualWithState = function(q, j, G) {
        if (ue.test(q)) {
          if (this.ts_isContextualWithState(G, Y[q])) {
            for (var J = 0; J < j; J++) this.next();
            return !0;
          }
          return !1;
        }
        if (!this.isContextualWithState(q, G)) return !1;
        for (var ee = 0; ee < j; ee++) this.next();
        return !0;
      }, Q.canHaveLeadingDecorator = function() {
        return this.match(H._class);
      }, Q.eatContextual = function(q) {
        return ue.test(q) ? !!this.ts_isContextual(Y[q]) && (this.next(), !0) : ce.prototype.eatContextual.call(this, q);
      }, Q.tsIsExternalModuleReference = function() {
        return this.isContextual("require") && this.lookaheadCharCode() === 40;
      }, Q.tsParseExternalModuleReference = function() {
        var q = this.startNode();
        return this.expectContextual("require"), this.expect(H.parenL), this.match(H.string) || this.unexpected(), q.expression = this.parseExprAtom(), this.expect(H.parenR), this.finishNode(q, "TSExternalModuleReference");
      }, Q.tsParseEntityName = function(q) {
        q === void 0 && (q = !0);
        for (var j = this.parseIdent(q); this.eat(H.dot); ) {
          var G = this.startNodeAtNode(j);
          G.left = j, G.right = this.parseIdent(q), j = this.finishNode(G, "TSQualifiedName");
        }
        return j;
      }, Q.tsParseEnumMember = function() {
        var q = this.startNode();
        return q.id = this.match(H.string) ? this.parseLiteral(this.value) : this.parseIdent(!0), this.eat(H.eq) && (q.initializer = this.parseMaybeAssign()), this.finishNode(q, "TSEnumMember");
      }, Q.tsParseEnumDeclaration = function(q, j) {
        return j === void 0 && (j = {}), j.const && (q.const = !0), j.declare && (q.declare = !0), this.expectContextual("enum"), q.id = this.parseIdent(), this.checkLValSimple(q.id), this.expect(H.braceL), q.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this)), this.expect(H.braceR), this.finishNode(q, "TSEnumDeclaration");
      }, Q.tsParseModuleBlock = function() {
        var q = this.startNode();
        for (ce.prototype.enterScope.call(this, 512), this.expect(H.braceL), q.body = []; this.type !== H.braceR; ) {
          var j = this.parseStatement(null, !0);
          q.body.push(j);
        }
        return this.next(), ce.prototype.exitScope.call(this), this.finishNode(q, "TSModuleBlock");
      }, Q.tsParseAmbientExternalModuleDeclaration = function(q) {
        return this.ts_isContextual(Y.global) ? (q.global = !0, q.id = this.parseIdent()) : this.match(H.string) ? q.id = this.parseLiteral(this.value) : this.unexpected(), this.match(H.braceL) ? (ce.prototype.enterScope.call(this, f), q.body = this.tsParseModuleBlock(), ce.prototype.exitScope.call(this)) : ce.prototype.semicolon.call(this), this.finishNode(q, "TSModuleDeclaration");
      }, Q.tsTryParseDeclare = function(q) {
        var j = this;
        if (!this.isLineTerminator()) {
          var G, J = this.type;
          return this.isContextual("let") && (J = H._var, G = "let"), this.tsInAmbientContext(function() {
            if (J === H._function) return q.declare = !0, j.parseFunctionStatement(q, !1, !0);
            if (J === H._class) return q.declare = !0, j.parseClass(q, !0);
            if (J === Y.enum) return j.tsParseEnumDeclaration(q, { declare: !0 });
            if (J === Y.global) return j.tsParseAmbientExternalModuleDeclaration(q);
            if (J === H._const || J === H._var) return j.match(H._const) && j.isLookaheadContextual("enum") ? (j.expect(H._const), j.tsParseEnumDeclaration(q, { const: !0, declare: !0 })) : (q.declare = !0, j.parseVarStatement(q, G || j.value, !0));
            if (J === Y.interface) {
              var ee = j.tsParseInterfaceDeclaration(q, { declare: !0 });
              if (ee) return ee;
            }
            return ae(J) ? j.tsParseDeclaration(q, j.value, !0) : void 0;
          });
        }
      }, Q.tsIsListTerminator = function(q) {
        switch (q) {
          case "EnumMembers":
          case "TypeMembers":
            return this.match(H.braceR);
          case "HeritageClauseElement":
            return this.match(H.braceL);
          case "TupleElementTypes":
            return this.match(H.bracketR);
          case "TypeParametersOrArguments":
            return this.tsMatchRightRelational();
        }
      }, Q.tsParseDelimitedListWorker = function(q, j, G, J) {
        for (var ee = [], se = -1; !this.tsIsListTerminator(q); ) {
          se = -1;
          var ne = j();
          if (ne == null) return;
          if (ee.push(ne), !this.eat(H.comma)) {
            if (this.tsIsListTerminator(q)) break;
            return void (G && this.expect(H.comma));
          }
          se = this.lastTokStart;
        }
        return J && (J.value = se), ee;
      }, Q.tsParseDelimitedList = function(q, j, G) {
        return function(J) {
          if (J == null) throw new Error("Unexpected " + J + " value.");
          return J;
        }(this.tsParseDelimitedListWorker(q, j, !0, G));
      }, Q.tsParseBracketedList = function(q, j, G, J, ee) {
        J || this.expect(G ? H.bracketL : H.relational);
        var se = this.tsParseDelimitedList(q, j, ee);
        return this.expect(G ? H.bracketR : H.relational), se;
      }, Q.tsParseTypeParameterName = function() {
        return this.parseIdent().name;
      }, Q.tsEatThenParseType = function(q) {
        return this.match(q) ? this.tsNextThenParseType() : void 0;
      }, Q.tsExpectThenParseType = function(q) {
        var j = this;
        return this.tsDoThenParseType(function() {
          return j.expect(q);
        });
      }, Q.tsNextThenParseType = function() {
        var q = this;
        return this.tsDoThenParseType(function() {
          return q.next();
        });
      }, Q.tsDoThenParseType = function(q) {
        var j = this;
        return this.tsInType(function() {
          return q(), j.tsParseType();
        });
      }, Q.tsSkipParameterStart = function() {
        if (ae(this.type) || this.match(H._this)) return this.next(), !0;
        if (this.match(H.braceL)) try {
          return this.parseObj(!0), !0;
        } catch {
          return !1;
        }
        if (this.match(H.bracketL)) {
          this.next();
          try {
            return this.parseBindingList(H.bracketR, !0, !0), !0;
          } catch {
            return !1;
          }
        }
        return !1;
      }, Q.tsIsUnambiguouslyStartOfFunctionType = function() {
        return this.next(), !!(this.match(H.parenR) || this.match(H.ellipsis) || this.tsSkipParameterStart() && (this.match(H.colon) || this.match(H.comma) || this.match(H.question) || this.match(H.eq) || this.match(H.parenR) && (this.next(), this.match(H.arrow))));
      }, Q.tsIsStartOfFunctionType = function() {
        return !!this.tsMatchLeftRelational() || this.match(H.parenL) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
      }, Q.tsInAllowConditionalTypesContext = function(q) {
        var j = this.inDisallowConditionalTypesContext;
        this.inDisallowConditionalTypesContext = !1;
        try {
          return q();
        } finally {
          this.inDisallowConditionalTypesContext = j;
        }
      }, Q.tsParseBindingListForSignature = function() {
        var q = this;
        return ce.prototype.parseBindingList.call(this, H.parenR, !0, !0).map(function(j) {
          return j.type !== "Identifier" && j.type !== "RestElement" && j.type !== "ObjectPattern" && j.type !== "ArrayPattern" && q.raise(j.start, b.UnsupportedSignatureParameterKind(j.type)), j;
        });
      }, Q.tsParseTypePredicateAsserts = function() {
        if (this.type !== Y.asserts) return !1;
        var q = this.containsEsc;
        return this.next(), !(!ae(this.type) && !this.match(H._this) || (q && this.raise(this.lastTokStart, "Escape sequence in keyword asserts"), 0));
      }, Q.tsParseThisTypeNode = function() {
        var q = this.startNode();
        return this.next(), this.finishNode(q, "TSThisType");
      }, Q.tsParseTypeAnnotation = function(q, j) {
        var G = this;
        return q === void 0 && (q = !0), j === void 0 && (j = this.startNode()), this.tsInType(function() {
          q && G.expect(H.colon), j.typeAnnotation = G.tsParseType();
        }), this.finishNode(j, "TSTypeAnnotation");
      }, Q.tsParseThisTypePredicate = function(q) {
        this.next();
        var j = this.startNodeAtNode(q);
        return j.parameterName = q, j.typeAnnotation = this.tsParseTypeAnnotation(!1), j.asserts = !1, this.finishNode(j, "TSTypePredicate");
      }, Q.tsParseThisTypeOrThisTypePredicate = function() {
        var q = this.tsParseThisTypeNode();
        return this.isContextual("is") && !this.hasPrecedingLineBreak() ? this.tsParseThisTypePredicate(q) : q;
      }, Q.tsParseTypePredicatePrefix = function() {
        var q = this.parseIdent();
        if (this.isContextual("is") && !this.hasPrecedingLineBreak()) return this.next(), q;
      }, Q.tsParseTypeOrTypePredicateAnnotation = function(q) {
        var j = this;
        return this.tsInType(function() {
          var G = j.startNode();
          j.expect(q);
          var J = j.startNode(), ee = !!j.tsTryParse(j.tsParseTypePredicateAsserts.bind(j));
          if (ee && j.match(H._this)) {
            var se = j.tsParseThisTypeOrThisTypePredicate();
            return se.type === "TSThisType" ? (J.parameterName = se, J.asserts = !0, J.typeAnnotation = null, se = j.finishNode(J, "TSTypePredicate")) : (j.resetStartLocationFromNode(se, J), se.asserts = !0), G.typeAnnotation = se, j.finishNode(G, "TSTypeAnnotation");
          }
          var ne = j.tsIsIdentifier() && j.tsTryParse(j.tsParseTypePredicatePrefix.bind(j));
          if (!ne) return ee ? (J.parameterName = j.parseIdent(), J.asserts = ee, J.typeAnnotation = null, G.typeAnnotation = j.finishNode(J, "TSTypePredicate"), j.finishNode(G, "TSTypeAnnotation")) : j.tsParseTypeAnnotation(!1, G);
          var oe = j.tsParseTypeAnnotation(!1);
          return J.parameterName = ne, J.typeAnnotation = oe, J.asserts = ee, G.typeAnnotation = j.finishNode(J, "TSTypePredicate"), j.finishNode(G, "TSTypeAnnotation");
        });
      }, Q.tsFillSignature = function(q, j) {
        var G = q === H.arrow;
        j.typeParameters = this.tsTryParseTypeParameters(), this.expect(H.parenL), j.parameters = this.tsParseBindingListForSignature(), (G || this.match(q)) && (j.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(q));
      }, Q.tsTryNextParseConstantContext = function() {
        if (this.lookahead().type !== H._const) return null;
        this.next();
        var q = this.tsParseTypeReference();
        return q.typeParameters && this.raise(q.typeName.start, b.CannotFindName({ name: "const" })), q;
      }, Q.tsParseFunctionOrConstructorType = function(q, j) {
        var G = this, J = this.startNode();
        return q === "TSConstructorType" && (J.abstract = !!j, j && this.next(), this.next()), this.tsInAllowConditionalTypesContext(function() {
          return G.tsFillSignature(H.arrow, J);
        }), this.finishNode(J, q);
      }, Q.tsParseUnionOrIntersectionType = function(q, j, G) {
        var J = this.startNode(), ee = this.eat(G), se = [];
        do
          se.push(j());
        while (this.eat(G));
        return se.length !== 1 || ee ? (J.types = se, this.finishNode(J, q)) : se[0];
      }, Q.tsCheckTypeAnnotationForReadOnly = function(q) {
        switch (q.typeAnnotation.type) {
          case "TSTupleType":
          case "TSArrayType":
            return;
          default:
            this.raise(q.start, b.UnexpectedReadonly);
        }
      }, Q.tsParseTypeOperator = function() {
        var q = this.startNode(), j = this.value;
        return this.next(), q.operator = j, q.typeAnnotation = this.tsParseTypeOperatorOrHigher(), j === "readonly" && this.tsCheckTypeAnnotationForReadOnly(q), this.finishNode(q, "TSTypeOperator");
      }, Q.tsParseConstraintForInferType = function() {
        var q = this;
        if (this.eat(H._extends)) {
          var j = this.tsInDisallowConditionalTypesContext(function() {
            return q.tsParseType();
          });
          if (this.inDisallowConditionalTypesContext || !this.match(H.question)) return j;
        }
      }, Q.tsParseInferType = function() {
        var q = this, j = this.startNode();
        this.expectContextual("infer");
        var G = this.startNode();
        return G.name = this.tsParseTypeParameterName(), G.constraint = this.tsTryParse(function() {
          return q.tsParseConstraintForInferType();
        }), j.typeParameter = this.finishNode(G, "TSTypeParameter"), this.finishNode(j, "TSInferType");
      }, Q.tsParseLiteralTypeNode = function() {
        var q = this, j = this.startNode();
        return j.literal = function() {
          switch (q.type) {
            case H.num:
            case H.string:
            case H._true:
            case H._false:
              return q.parseExprAtom();
            default:
              q.unexpected();
          }
        }(), this.finishNode(j, "TSLiteralType");
      }, Q.tsParseImportType = function() {
        var q = this.startNode();
        return this.expect(H._import), this.expect(H.parenL), this.match(H.string) || this.raise(this.start, b.UnsupportedImportTypeArgument), q.argument = this.parseExprAtom(), this.expect(H.parenR), this.eat(H.dot) && (q.qualifier = this.tsParseEntityName()), this.tsMatchLeftRelational() && (q.typeParameters = this.tsParseTypeArguments()), this.finishNode(q, "TSImportType");
      }, Q.tsParseTypeQuery = function() {
        var q = this.startNode();
        return this.expect(H._typeof), q.exprName = this.match(H._import) ? this.tsParseImportType() : this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (q.typeParameters = this.tsParseTypeArguments()), this.finishNode(q, "TSTypeQuery");
      }, Q.tsParseMappedTypeParameter = function() {
        var q = this.startNode();
        return q.name = this.tsParseTypeParameterName(), q.constraint = this.tsExpectThenParseType(H._in), this.finishNode(q, "TSTypeParameter");
      }, Q.tsParseMappedType = function() {
        var q = this.startNode();
        return this.expect(H.braceL), this.match(H.plusMin) ? (q.readonly = this.value, this.next(), this.expectContextual("readonly")) : this.eatContextual("readonly") && (q.readonly = !0), this.expect(H.bracketL), q.typeParameter = this.tsParseMappedTypeParameter(), q.nameType = this.eatContextual("as") ? this.tsParseType() : null, this.expect(H.bracketR), this.match(H.plusMin) ? (q.optional = this.value, this.next(), this.expect(H.question)) : this.eat(H.question) && (q.optional = !0), q.typeAnnotation = this.tsTryParseType(), this.semicolon(), this.expect(H.braceR), this.finishNode(q, "TSMappedType");
      }, Q.tsParseTypeLiteral = function() {
        var q = this.startNode();
        return q.members = this.tsParseObjectTypeMembers(), this.finishNode(q, "TSTypeLiteral");
      }, Q.tsParseTupleElementType = function() {
        var q = this.startLoc, j = this.start, G = this.eat(H.ellipsis), J = this.tsParseType(), ee = this.eat(H.question);
        if (this.eat(H.colon)) {
          var se = this.startNodeAtNode(J);
          se.optional = ee, J.type !== "TSTypeReference" || J.typeParameters || J.typeName.type !== "Identifier" ? (this.raise(J.start, b.InvalidTupleMemberLabel), se.label = J) : se.label = J.typeName, se.elementType = this.tsParseType(), J = this.finishNode(se, "TSNamedTupleMember");
        } else if (ee) {
          var ne = this.startNodeAtNode(J);
          ne.typeAnnotation = J, J = this.finishNode(ne, "TSOptionalType");
        }
        if (G) {
          var oe = this.startNodeAt(j, q);
          oe.typeAnnotation = J, J = this.finishNode(oe, "TSRestType");
        }
        return J;
      }, Q.tsParseTupleType = function() {
        var q = this, j = this.startNode();
        j.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseTupleElementType.bind(this), !0, !1);
        var G = !1, J = null;
        return j.elementTypes.forEach(function(ee) {
          var se = ee.type;
          !G || se === "TSRestType" || se === "TSOptionalType" || se === "TSNamedTupleMember" && ee.optional || q.raise(ee.start, b.OptionalTypeBeforeRequired), G || (G = se === "TSNamedTupleMember" && ee.optional || se === "TSOptionalType");
          var ne = se;
          se === "TSRestType" && (ne = (ee = ee.typeAnnotation).type);
          var oe = ne === "TSNamedTupleMember";
          J != null || (J = oe), J !== oe && q.raise(ee.start, b.MixedLabeledAndUnlabeledElements);
        }), this.finishNode(j, "TSTupleType");
      }, Q.tsParseTemplateLiteralType = function() {
        var q = this.startNode();
        return q.literal = this.parseTemplate({ isTagged: !1 }), this.finishNode(q, "TSLiteralType");
      }, Q.tsParseTypeReference = function() {
        var q = this.startNode();
        return q.typeName = this.tsParseEntityName(), !this.hasPrecedingLineBreak() && this.tsMatchLeftRelational() && (q.typeParameters = this.tsParseTypeArguments()), this.finishNode(q, "TSTypeReference");
      }, Q.tsMatchLeftRelational = function() {
        return this.match(H.relational) && this.value === "<";
      }, Q.tsMatchRightRelational = function() {
        return this.match(H.relational) && this.value === ">";
      }, Q.tsParseParenthesizedType = function() {
        var q = this.startNode();
        return this.expect(H.parenL), q.typeAnnotation = this.tsParseType(), this.expect(H.parenR), this.finishNode(q, "TSParenthesizedType");
      }, Q.tsParseNonArrayType = function() {
        switch (this.type) {
          case H.string:
          case H.num:
          case H._true:
          case H._false:
            return this.tsParseLiteralTypeNode();
          case H.plusMin:
            if (this.value === "-") {
              var q = this.startNode();
              return this.lookahead().type !== H.num && this.unexpected(), q.literal = this.parseMaybeUnary(), this.finishNode(q, "TSLiteralType");
            }
            break;
          case H._this:
            return this.tsParseThisTypeOrThisTypePredicate();
          case H._typeof:
            return this.tsParseTypeQuery();
          case H._import:
            return this.tsParseImportType();
          case H.braceL:
            return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();
          case H.bracketL:
            return this.tsParseTupleType();
          case H.parenL:
            return this.tsParseParenthesizedType();
          case H.backQuote:
          case H.dollarBraceL:
            return this.tsParseTemplateLiteralType();
          default:
            var j = this.type;
            if (ae(j) || j === H._void || j === H._null) {
              var G = j === H._void ? "TSVoidKeyword" : j === H._null ? "TSNullKeyword" : function(ee) {
                switch (ee) {
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
              if (G !== void 0 && this.lookaheadCharCode() !== 46) {
                var J = this.startNode();
                return this.next(), this.finishNode(J, G);
              }
              return this.tsParseTypeReference();
            }
        }
        this.unexpected();
      }, Q.tsParseArrayTypeOrHigher = function() {
        for (var q = this.tsParseNonArrayType(); !this.hasPrecedingLineBreak() && this.eat(H.bracketL); ) if (this.match(H.bracketR)) {
          var j = this.startNodeAtNode(q);
          j.elementType = q, this.expect(H.bracketR), q = this.finishNode(j, "TSArrayType");
        } else {
          var G = this.startNodeAtNode(q);
          G.objectType = q, G.indexType = this.tsParseType(), this.expect(H.bracketR), q = this.finishNode(G, "TSIndexedAccessType");
        }
        return q;
      }, Q.tsParseTypeOperatorOrHigher = function() {
        var q = this;
        return me(this.type) && !this.containsEsc ? this.tsParseTypeOperator() : this.isContextual("infer") ? this.tsParseInferType() : this.tsInAllowConditionalTypesContext(function() {
          return q.tsParseArrayTypeOrHigher();
        });
      }, Q.tsParseIntersectionTypeOrHigher = function() {
        return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), H.bitwiseAND);
      }, Q.tsParseUnionTypeOrHigher = function() {
        return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), H.bitwiseOR);
      }, Q.tsParseNonConditionalType = function() {
        return this.tsIsStartOfFunctionType() ? this.tsParseFunctionOrConstructorType("TSFunctionType") : this.match(H._new) ? this.tsParseFunctionOrConstructorType("TSConstructorType") : this.isAbstractConstructorSignature() ? this.tsParseFunctionOrConstructorType("TSConstructorType", !0) : this.tsParseUnionTypeOrHigher();
      }, Q.tsParseType = function() {
        var q = this;
        k(this.inType);
        var j = this.tsParseNonConditionalType();
        if (this.inDisallowConditionalTypesContext || this.hasPrecedingLineBreak() || !this.eat(H._extends)) return j;
        var G = this.startNodeAtNode(j);
        return G.checkType = j, G.extendsType = this.tsInDisallowConditionalTypesContext(function() {
          return q.tsParseNonConditionalType();
        }), this.expect(H.question), G.trueType = this.tsInAllowConditionalTypesContext(function() {
          return q.tsParseType();
        }), this.expect(H.colon), G.falseType = this.tsInAllowConditionalTypesContext(function() {
          return q.tsParseType();
        }), this.finishNode(G, "TSConditionalType");
      }, Q.tsIsUnambiguouslyIndexSignature = function() {
        return this.next(), !!ae(this.type) && (this.next(), this.match(H.colon));
      }, Q.tsInType = function(q) {
        var j = this.inType;
        this.inType = !0;
        try {
          return q();
        } finally {
          this.inType = j;
        }
      }, Q.tsTryParseIndexSignature = function(q) {
        if (this.match(H.bracketL) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))) {
          this.expect(H.bracketL);
          var j = this.parseIdent();
          j.typeAnnotation = this.tsParseTypeAnnotation(), this.resetEndLocation(j), this.expect(H.bracketR), q.parameters = [j];
          var G = this.tsTryParseTypeAnnotation();
          return G && (q.typeAnnotation = G), this.tsParseTypeMemberSemicolon(), this.finishNode(q, "TSIndexSignature");
        }
      }, Q.tsParseNoneModifiers = function(q) {
        this.tsParseModifiers({ modified: q, allowedModifiers: [], disallowedModifiers: ["in", "out"], errorTemplate: b.InvalidModifierOnTypeParameterPositions });
      }, Q.tsParseTypeParameter = function(q) {
        q === void 0 && (q = this.tsParseNoneModifiers.bind(this));
        var j = this.startNode();
        return q(j), j.name = this.tsParseTypeParameterName(), j.constraint = this.tsEatThenParseType(H._extends), j.default = this.tsEatThenParseType(H.eq), this.finishNode(j, "TSTypeParameter");
      }, Q.tsParseTypeParameters = function(q) {
        var j = this.startNode();
        this.tsMatchLeftRelational() || this.matchJsx("jsxTagStart") ? this.next() : this.unexpected();
        var G = { value: -1 };
        return j.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this, q), !1, !0, G), j.params.length === 0 && this.raise(this.start, b.EmptyTypeParameters), G.value !== -1 && this.addExtra(j, "trailingComma", G.value), this.finishNode(j, "TSTypeParameterDeclaration");
      }, Q.tsTryParseTypeParameters = function(q) {
        if (this.tsMatchLeftRelational()) return this.tsParseTypeParameters(q);
      }, Q.tsTryParse = function(q) {
        var j = this.getCurLookaheadState(), G = q();
        return G !== void 0 && G !== !1 ? G : void this.setLookaheadState(j);
      }, Q.tsTokenCanFollowModifier = function() {
        return (this.match(H.bracketL) || this.match(H.braceL) || this.match(H.star) || this.match(H.ellipsis) || this.match(H.privateId) || this.isLiteralPropertyName()) && !this.hasPrecedingLineBreak();
      }, Q.tsNextTokenCanFollowModifier = function() {
        return this.next(!0), this.tsTokenCanFollowModifier();
      }, Q.tsParseModifier = function(q, j) {
        if (ae(this.type) || this.type === H._in) {
          var G = this.value;
          if (q.indexOf(G) !== -1 && !this.containsEsc) {
            if (j && this.tsIsStartOfStaticBlocks()) return;
            if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) return G;
          }
        }
      }, Q.tsParseModifiersByMap = function(q) {
        for (var j = q.modified, G = q.map, J = 0, ee = Object.keys(G); J < ee.length; J++) {
          var se = ee[J];
          j[se] = G[se];
        }
      }, Q.tsParseModifiers = function(q) {
        for (var j = this, G = q.modified, J = q.allowedModifiers, ee = q.disallowedModifiers, se = q.stopOnStartOfClassStaticBlock, ne = q.errorTemplate, oe = ne === void 0 ? b.InvalidModifierOnTypeMember : ne, he = {}, pe = function(Ae, Te, Ee, Pe) {
          Te === Ee && G[Pe] && j.raise(Ae.column, b.InvalidModifiersOrder({ orderedModifiers: [Ee, Pe] }));
        }, ve = function(Ae, Te, Ee, Pe) {
          (G[Ee] && Te === Pe || G[Pe] && Te === Ee) && j.raise(Ae.column, b.IncompatibleModifiers({ modifiers: [Ee, Pe] }));
        }; ; ) {
          var we = this.startLoc, ye = this.tsParseModifier(J.concat(ee ?? []), se);
          if (!ye) break;
          O(ye) ? G.accessibility ? this.raise(this.start, b.DuplicateAccessibilityModifier()) : (pe(we, ye, ye, "override"), pe(we, ye, ye, "static"), pe(we, ye, ye, "readonly"), pe(we, ye, ye, "accessor"), he.accessibility = ye, G.accessibility = ye) : N(ye) ? G[ye] ? this.raise(this.start, b.DuplicateModifier({ modifier: ye })) : (pe(we, ye, "in", "out"), he[ye] = ye, G[ye] = !0) : I(ye) ? G[ye] ? this.raise(this.start, b.DuplicateModifier({ modifier: ye })) : (ve(we, ye, "accessor", "readonly"), ve(we, ye, "accessor", "static"), ve(we, ye, "accessor", "override"), he[ye] = ye, G[ye] = !0) : Object.hasOwnProperty.call(G, ye) ? this.raise(this.start, b.DuplicateModifier({ modifier: ye })) : (pe(we, ye, "static", "readonly"), pe(we, ye, "static", "override"), pe(we, ye, "override", "readonly"), pe(we, ye, "abstract", "override"), ve(we, ye, "declare", "override"), ve(we, ye, "static", "abstract"), he[ye] = ye, G[ye] = !0), ee != null && ee.includes(ye) && this.raise(this.start, oe);
        }
        return he;
      }, Q.tsParseInOutModifiers = function(q) {
        this.tsParseModifiers({ modified: q, allowedModifiers: ["in", "out"], disallowedModifiers: ["public", "private", "protected", "readonly", "declare", "abstract", "override"], errorTemplate: b.InvalidModifierOnTypeParameter });
      }, Q.tsParseTypeArguments = function() {
        var q = this, j = this.startNode();
        return j.params = this.tsInType(function() {
          return q.tsInNoContext(function() {
            return q.expect(H.relational), q.tsParseDelimitedList("TypeParametersOrArguments", q.tsParseType.bind(q));
          });
        }), j.params.length === 0 && this.raise(this.start, b.EmptyTypeArguments), this.exprAllowed = !1, this.expect(H.relational), this.finishNode(j, "TSTypeParameterInstantiation");
      }, Q.tsParseHeritageClause = function(q) {
        var j = this, G = this.start, J = this.tsParseDelimitedList("HeritageClauseElement", function() {
          var ee = j.startNode();
          return ee.expression = j.tsParseEntityName(), j.tsMatchLeftRelational() && (ee.typeParameters = j.tsParseTypeArguments()), j.finishNode(ee, "TSExpressionWithTypeArguments");
        });
        return J.length || this.raise(G, b.EmptyHeritageClauseType({ token: q })), J;
      }, Q.tsParseTypeMemberSemicolon = function() {
        this.eat(H.comma) || this.isLineTerminator() || this.expect(H.semi);
      }, Q.tsTryParseAndCatch = function(q) {
        var j = this.tryParse(function(G) {
          return q() || G();
        });
        if (!j.aborted && j.node) return j.error && this.setLookaheadState(j.failState), j.node;
      }, Q.tsParseSignatureMember = function(q, j) {
        return this.tsFillSignature(H.colon, j), this.tsParseTypeMemberSemicolon(), this.finishNode(j, q);
      }, Q.tsParsePropertyOrMethodSignature = function(q, j) {
        this.eat(H.question) && (q.optional = !0);
        var G = q;
        if (this.match(H.parenL) || this.tsMatchLeftRelational()) {
          j && this.raise(q.start, b.ReadonlyForMethodSignature);
          var J = G;
          J.kind && this.tsMatchLeftRelational() && this.raise(this.start, b.AccesorCannotHaveTypeParameters), this.tsFillSignature(H.colon, J), this.tsParseTypeMemberSemicolon();
          var ee = "parameters", se = "typeAnnotation";
          if (J.kind === "get") J[ee].length > 0 && (this.raise(this.start, "A 'get' accesor must not have any formal parameters."), this.isThisParam(J[ee][0]) && this.raise(this.start, b.AccesorCannotDeclareThisParameter));
          else if (J.kind === "set") {
            if (J[ee].length !== 1) this.raise(this.start, "A 'get' accesor must not have any formal parameters.");
            else {
              var ne = J[ee][0];
              this.isThisParam(ne) && this.raise(this.start, b.AccesorCannotDeclareThisParameter), ne.type === "Identifier" && ne.optional && this.raise(this.start, b.SetAccesorCannotHaveOptionalParameter), ne.type === "RestElement" && this.raise(this.start, b.SetAccesorCannotHaveRestParameter);
            }
            J[se] && this.raise(J[se].start, b.SetAccesorCannotHaveReturnType);
          } else J.kind = "method";
          return this.finishNode(J, "TSMethodSignature");
        }
        var oe = G;
        j && (oe.readonly = !0);
        var he = this.tsTryParseTypeAnnotation();
        return he && (oe.typeAnnotation = he), this.tsParseTypeMemberSemicolon(), this.finishNode(oe, "TSPropertySignature");
      }, Q.tsParseTypeMember = function() {
        var q = this.startNode();
        if (this.match(H.parenL) || this.tsMatchLeftRelational()) return this.tsParseSignatureMember("TSCallSignatureDeclaration", q);
        if (this.match(H._new)) {
          var j = this.startNode();
          return this.next(), this.match(H.parenL) || this.tsMatchLeftRelational() ? this.tsParseSignatureMember("TSConstructSignatureDeclaration", q) : (q.key = this.createIdentifier(j, "new"), this.tsParsePropertyOrMethodSignature(q, !1));
        }
        return this.tsParseModifiers({ modified: q, allowedModifiers: ["readonly"], disallowedModifiers: ["declare", "abstract", "private", "protected", "public", "static", "override"] }), this.tsTryParseIndexSignature(q) || (this.parsePropertyName(q), q.computed || q.key.type !== "Identifier" || q.key.name !== "get" && q.key.name !== "set" || !this.tsTokenCanFollowModifier() || (q.kind = q.key.name, this.parsePropertyName(q)), this.tsParsePropertyOrMethodSignature(q, !!q.readonly));
      }, Q.tsParseList = function(q, j) {
        for (var G = []; !this.tsIsListTerminator(q); ) G.push(j());
        return G;
      }, Q.tsParseObjectTypeMembers = function() {
        this.expect(H.braceL);
        var q = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
        return this.expect(H.braceR), q;
      }, Q.tsParseInterfaceDeclaration = function(q, j) {
        if (j === void 0 && (j = {}), this.hasFollowingLineBreak()) return null;
        this.expectContextual("interface"), j.declare && (q.declare = !0), ae(this.type) ? (q.id = this.parseIdent(), this.checkLValSimple(q.id, 7)) : (q.id = null, this.raise(this.start, b.MissingInterfaceName)), q.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this)), this.eat(H._extends) && (q.extends = this.tsParseHeritageClause("extends"));
        var G = this.startNode();
        return G.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this)), q.body = this.finishNode(G, "TSInterfaceBody"), this.finishNode(q, "TSInterfaceDeclaration");
      }, Q.tsParseAbstractDeclaration = function(q) {
        if (this.match(H._class)) return q.abstract = !0, this.parseClass(q, !0);
        if (this.ts_isContextual(Y.interface)) {
          if (!this.hasFollowingLineBreak()) return q.abstract = !0, this.tsParseInterfaceDeclaration(q);
        } else this.unexpected(q.start);
      }, Q.tsIsDeclarationStart = function() {
        return re(this.type);
      }, Q.tsParseExpressionStatement = function(q, j) {
        switch (j.name) {
          case "declare":
            var G = this.tsTryParseDeclare(q);
            if (G) return G.declare = !0, G;
            break;
          case "global":
            if (this.match(H.braceL)) {
              ce.prototype.enterScope.call(this, f);
              var J = q;
              return J.global = !0, J.id = j, J.body = this.tsParseModuleBlock(), ce.prototype.exitScope.call(this), this.finishNode(J, "TSModuleDeclaration");
            }
            break;
          default:
            return this.tsParseDeclaration(q, j.name, !1);
        }
      }, Q.tsParseModuleReference = function() {
        return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(!1);
      }, Q.tsIsExportDefaultSpecifier = function() {
        var q = this.type, j = this.isAsyncFunction(), G = this.isLet();
        if (ae(q)) {
          if (j && !this.containsEsc || G) return !1;
          if ((q === Y.type || q === Y.interface) && !this.containsEsc) {
            var J = this.lookahead();
            if (ae(J.type) && !this.isContextualWithState("from", J) || J.type === H.braceL) return !1;
          }
        } else if (!this.match(H._default)) return !1;
        var ee = this.nextTokenStart(), se = this.isUnparsedContextual(ee, "from");
        if (this.input.charCodeAt(ee) === 44 || ae(this.type) && se) return !0;
        if (this.match(H._default) && se) {
          var ne = this.input.charCodeAt(this.nextTokenStartSince(ee + 4));
          return ne === 34 || ne === 39;
        }
        return !1;
      }, Q.tsInAmbientContext = function(q) {
        var j = this.isAmbientContext;
        this.isAmbientContext = !0;
        try {
          return q();
        } finally {
          this.isAmbientContext = j;
        }
      }, Q.tsCheckLineTerminator = function(q) {
        return q ? !this.hasFollowingLineBreak() && (this.next(), !0) : !this.isLineTerminator();
      }, Q.tsParseModuleOrNamespaceDeclaration = function(q, j) {
        if (j === void 0 && (j = !1), q.id = this.parseIdent(), j || this.checkLValSimple(q.id, 8), this.eat(H.dot)) {
          var G = this.startNode();
          this.tsParseModuleOrNamespaceDeclaration(G, !0), q.body = G;
        } else ce.prototype.enterScope.call(this, f), q.body = this.tsParseModuleBlock(), ce.prototype.exitScope.call(this);
        return this.finishNode(q, "TSModuleDeclaration");
      }, Q.checkLValSimple = function(q, j, G) {
        return j === void 0 && (j = 0), ce.prototype.checkLValSimple.call(this, q, j, G);
      }, Q.tsParseTypeAliasDeclaration = function(q) {
        var j = this;
        return q.id = this.parseIdent(), this.checkLValSimple(q.id, 6), q.typeAnnotation = this.tsInType(function() {
          if (q.typeParameters = j.tsTryParseTypeParameters(j.tsParseInOutModifiers.bind(j)), j.expect(H.eq), j.ts_isContextual(Y.interface) && j.lookahead().type !== H.dot) {
            var G = j.startNode();
            return j.next(), j.finishNode(G, "TSIntrinsicKeyword");
          }
          return j.tsParseType();
        }), this.semicolon(), this.finishNode(q, "TSTypeAliasDeclaration");
      }, Q.tsParseDeclaration = function(q, j, G) {
        switch (j) {
          case "abstract":
            if (this.tsCheckLineTerminator(G) && (this.match(H._class) || ae(this.type))) return this.tsParseAbstractDeclaration(q);
            break;
          case "module":
            if (this.tsCheckLineTerminator(G)) {
              if (this.match(H.string)) return this.tsParseAmbientExternalModuleDeclaration(q);
              if (ae(this.type)) return this.tsParseModuleOrNamespaceDeclaration(q);
            }
            break;
          case "namespace":
            if (this.tsCheckLineTerminator(G) && ae(this.type)) return this.tsParseModuleOrNamespaceDeclaration(q);
            break;
          case "type":
            if (this.tsCheckLineTerminator(G) && ae(this.type)) return this.tsParseTypeAliasDeclaration(q);
        }
      }, Q.tsTryParseExportDeclaration = function() {
        return this.tsParseDeclaration(this.startNode(), this.value, !0);
      }, Q.tsParseImportEqualsDeclaration = function(q, j) {
        q.isExport = j || !1, q.id = this.parseIdent(), this.checkLValSimple(q.id, 2), ce.prototype.expect.call(this, H.eq);
        var G = this.tsParseModuleReference();
        return q.importKind === "type" && G.type !== "TSExternalModuleReference" && this.raise(G.start, b.ImportAliasHasImportType), q.moduleReference = G, ce.prototype.semicolon.call(this), this.finishNode(q, "TSImportEqualsDeclaration");
      }, Q.isExportDefaultSpecifier = function() {
        if (this.tsIsDeclarationStart()) return !1;
        var q = this.type;
        if (ae(q)) {
          if (this.isContextual("async") || this.isContextual("let")) return !1;
          if ((q === Y.type || q === Y.interface) && !this.containsEsc) {
            var j = this.lookahead();
            if (ae(j.type) && !this.isContextualWithState("from", j) || j.type === H.braceL) return !1;
          }
        } else if (!this.match(H._default)) return !1;
        var G = this.nextTokenStart(), J = this.isUnparsedContextual(G, "from");
        if (this.input.charCodeAt(G) === 44 || ae(this.type) && J) return !0;
        if (this.match(H._default) && J) {
          var ee = this.input.charCodeAt(this.nextTokenStartSince(G + 4));
          return ee === 34 || ee === 39;
        }
        return !1;
      }, Q.parseTemplate = function(q) {
        var j = (q === void 0 ? {} : q).isTagged, G = j !== void 0 && j, J = this.startNode();
        this.next(), J.expressions = [];
        var ee = this.parseTemplateElement({ isTagged: G });
        for (J.quasis = [ee]; !ee.tail; ) this.type === H.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(H.dollarBraceL), J.expressions.push(this.inType ? this.tsParseType() : this.parseExpression()), this.expect(H.braceR), J.quasis.push(ee = this.parseTemplateElement({ isTagged: G }));
        return this.next(), this.finishNode(J, "TemplateLiteral");
      }, Q.parseFunction = function(q, j, G, J, ee) {
        this.initFunction(q), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !J) && (this.type === H.star && 2 & j && this.unexpected(), q.generator = this.eat(H.star)), this.options.ecmaVersion >= 8 && (q.async = !!J), 1 & j && (q.id = 4 & j && this.type !== H.name ? null : this.parseIdent());
        var se = this.yieldPos, ne = this.awaitPos, oe = this.awaitIdentPos, he = this.maybeInArrowParameters;
        this.maybeInArrowParameters = !1, this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(w(q.async, q.generator)), 1 & j || (q.id = this.type === H.name ? this.parseIdent() : null), this.parseFunctionParams(q);
        var pe = 1 & j;
        return this.parseFunctionBody(q, G, !1, ee, { isFunctionDeclaration: pe }), this.yieldPos = se, this.awaitPos = ne, this.awaitIdentPos = oe, 1 & j && q.id && !(2 & j) && this.checkLValSimple(q.id, q.body ? this.strict || q.generator || q.async ? this.treatFunctionsAsVar ? 1 : 2 : 3 : 0), this.maybeInArrowParameters = he, this.finishNode(q, pe ? "FunctionDeclaration" : "FunctionExpression");
      }, Q.parseFunctionBody = function(q, j, G, J, ee) {
        j === void 0 && (j = !1), G === void 0 && (G = !1), J === void 0 && (J = !1), this.match(H.colon) && (q.returnType = this.tsParseTypeOrTypePredicateAnnotation(H.colon));
        var se = ee != null && ee.isFunctionDeclaration ? "TSDeclareFunction" : ee != null && ee.isClassMethod ? "TSDeclareMethod" : void 0;
        return se && !this.match(H.braceL) && this.isLineTerminator() ? this.finishNode(q, se) : se === "TSDeclareFunction" && this.isAmbientContext && (this.raise(q.start, b.DeclareFunctionHasImplementation), q.declare) ? (ce.prototype.parseFunctionBody.call(this, q, j, G, !1), this.finishNode(q, se)) : (ce.prototype.parseFunctionBody.call(this, q, j, G, J), q);
      }, Q.parseNew = function() {
        var q;
        this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
        var j = this.startNode(), G = this.parseIdent(!0);
        if (this.options.ecmaVersion >= 6 && this.eat(H.dot)) {
          j.meta = G;
          var J = this.containsEsc;
          return j.property = this.parseIdent(!0), j.property.name !== "target" && this.raiseRecoverable(j.property.start, "The only valid meta property for new is 'new.target'"), J && this.raiseRecoverable(j.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(j.start, "'new.target' can only be used in functions and class static block"), this.finishNode(j, "MetaProperty");
        }
        var ee = this.start, se = this.startLoc, ne = this.type === H._import;
        j.callee = this.parseSubscripts(this.parseExprAtom(), ee, se, !0, !1), ne && j.callee.type === "ImportExpression" && this.raise(ee, "Cannot use new with import()");
        var oe = j.callee;
        return oe.type !== "TSInstantiationExpression" || (q = oe.extra) != null && q.parenthesized || (j.typeParameters = oe.typeParameters, j.callee = oe.expression), j.arguments = this.eat(H.parenL) ? this.parseExprList(H.parenR, this.options.ecmaVersion >= 8, !1) : [], this.finishNode(j, "NewExpression");
      }, Q.parseExprOp = function(q, j, G, J, ee) {
        var se;
        if (H._in.binop > J && !this.hasPrecedingLineBreak() && (this.isContextual("as") && (se = "TSAsExpression"), _ && this.isContextual("satisfies") && (se = "TSSatisfiesExpression"), se)) {
          var ne = this.startNodeAt(j, G);
          ne.expression = q;
          var oe = this.tsTryNextParseConstantContext();
          return ne.typeAnnotation = oe || this.tsNextThenParseType(), this.finishNode(ne, se), this.reScan_lt_gt(), this.parseExprOp(ne, j, G, J, ee);
        }
        return ce.prototype.parseExprOp.call(this, q, j, G, J, ee);
      }, Q.parseImportSpecifiers = function() {
        var q = [], j = !0;
        if (V.tokenIsIdentifier(this.type) && (q.push(this.parseImportDefaultSpecifier()), !this.eat(H.comma))) return q;
        if (this.type === H.star) return q.push(this.parseImportNamespaceSpecifier()), q;
        for (this.expect(H.braceL); !this.eat(H.braceR); ) {
          if (j) j = !1;
          else if (this.expect(H.comma), this.afterTrailingComma(H.braceR)) break;
          q.push(this.parseImportSpecifier());
        }
        return q;
      }, Q.parseImport = function(q) {
        var j = this.lookahead();
        if (q.importKind = "value", this.importOrExportOuterKind = "value", ae(j.type) || this.match(H.star) || this.match(H.braceL)) {
          var G = this.lookahead(2);
          if (G.type !== H.comma && !this.isContextualWithState("from", G) && G.type !== H.eq && this.ts_eatContextualWithState("type", 1, j) && (this.importOrExportOuterKind = "type", q.importKind = "type", j = this.lookahead(), G = this.lookahead(2)), ae(j.type) && G.type === H.eq) {
            this.next();
            var J = this.tsParseImportEqualsDeclaration(q);
            return this.importOrExportOuterKind = "value", J;
          }
        }
        return this.next(), this.type === H.string ? (q.specifiers = [], q.source = this.parseExprAtom()) : (q.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), q.source = this.type === H.string ? this.parseExprAtom() : this.unexpected()), this.parseMaybeImportAttributes(q), this.semicolon(), this.finishNode(q, "ImportDeclaration"), this.importOrExportOuterKind = "value", q.importKind === "type" && q.specifiers.length > 1 && q.specifiers[0].type === "ImportDefaultSpecifier" && this.raise(q.start, b.TypeImportCannotSpecifyDefaultAndNamed), q;
      }, Q.parseExportDefaultDeclaration = function() {
        if (this.isAbstractClass()) {
          var q = this.startNode();
          return this.next(), q.abstract = !0, this.parseClass(q, !0);
        }
        if (this.match(Y.interface)) {
          var j = this.tsParseInterfaceDeclaration(this.startNode());
          if (j) return j;
        }
        return ce.prototype.parseExportDefaultDeclaration.call(this);
      }, Q.parseExportAllDeclaration = function(q, j) {
        return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (q.exported = this.parseModuleExportName(), this.checkExport(j, q.exported, this.lastTokStart)) : q.exported = null), this.expectContextual("from"), this.type !== H.string && this.unexpected(), q.source = this.parseExprAtom(), this.parseMaybeImportAttributes(q), this.semicolon(), this.finishNode(q, "ExportAllDeclaration");
      }, Q.parseDynamicImport = function(q) {
        if (this.next(), q.source = this.parseMaybeAssign(), this.eat(H.comma)) {
          var j = this.parseExpression();
          q.arguments = [j];
        }
        if (!this.eat(H.parenR)) {
          var G = this.start;
          this.eat(H.comma) && this.eat(H.parenR) ? this.raiseRecoverable(G, "Trailing comma is not allowed in import()") : this.unexpected(G);
        }
        return this.finishNode(q, "ImportExpression");
      }, Q.parseExport = function(q, j) {
        var G = this.lookahead();
        if (this.ts_eatWithState(H._import, 2, G)) {
          this.ts_isContextual(Y.type) && this.lookaheadCharCode() !== 61 ? (q.importKind = "type", this.importOrExportOuterKind = "type", this.next()) : (q.importKind = "value", this.importOrExportOuterKind = "value");
          var J = this.tsParseImportEqualsDeclaration(q, !0);
          return this.importOrExportOuterKind = void 0, J;
        }
        if (this.ts_eatWithState(H.eq, 2, G)) {
          var ee = q;
          return ee.expression = this.parseExpression(), this.semicolon(), this.importOrExportOuterKind = void 0, this.finishNode(ee, "TSExportAssignment");
        }
        if (this.ts_eatContextualWithState("as", 2, G)) {
          var se = q;
          return this.expectContextual("namespace"), se.id = this.parseIdent(), this.semicolon(), this.importOrExportOuterKind = void 0, this.finishNode(se, "TSNamespaceExportDeclaration");
        }
        if (this.ts_isContextualWithState(G, Y.type) && this.lookahead(2).type === H.braceL ? (this.next(), this.importOrExportOuterKind = "type", q.exportKind = "type") : (this.importOrExportOuterKind = "value", q.exportKind = "value"), this.next(), this.eat(H.star)) return this.parseExportAllDeclaration(q, j);
        if (this.eat(H._default)) return this.checkExport(j, "default", this.lastTokStart), q.declaration = this.parseExportDefaultDeclaration(), this.finishNode(q, "ExportDefaultDeclaration");
        if (this.shouldParseExportStatement()) q.declaration = this.parseExportDeclaration(q), q.declaration.type === "VariableDeclaration" ? this.checkVariableExport(j, q.declaration.declarations) : this.checkExport(j, q.declaration.id, q.declaration.id.start), q.specifiers = [], q.source = null;
        else {
          if (q.declaration = null, q.specifiers = this.parseExportSpecifiers(j), this.eatContextual("from")) this.type !== H.string && this.unexpected(), q.source = this.parseExprAtom(), this.parseMaybeImportAttributes(q);
          else {
            for (var ne, oe = c(q.specifiers); !(ne = oe()).done; ) {
              var he = ne.value;
              this.checkUnreserved(he.local), this.checkLocalExport(he.local), he.local.type === "Literal" && this.raise(he.local.start, "A string literal cannot be used as an exported binding without `from`.");
            }
            q.source = null;
          }
          this.semicolon();
        }
        return this.finishNode(q, "ExportNamedDeclaration");
      }, Q.checkExport = function(q, j, G) {
        q && (typeof j != "string" && (j = j.type === "Identifier" ? j.name : j.value), q[j] = !0);
      }, Q.parseMaybeDefault = function(q, j, G) {
        var J = ce.prototype.parseMaybeDefault.call(this, q, j, G);
        return J.type === "AssignmentPattern" && J.typeAnnotation && J.right.start < J.typeAnnotation.start && this.raise(J.typeAnnotation.start, b.TypeAnnotationAfterAssign), J;
      }, Q.typeCastToParameter = function(q) {
        return q.expression.typeAnnotation = q.typeAnnotation, this.resetEndLocation(q.expression, q.typeAnnotation.end), q.expression;
      }, Q.toAssignableList = function(q, j) {
        for (var G = 0; G < q.length; G++) {
          var J = q[G];
          (J == null ? void 0 : J.type) === "TSTypeCastExpression" && (q[G] = this.typeCastToParameter(J));
        }
        return ce.prototype.toAssignableList.call(this, q, j);
      }, Q.reportReservedArrowTypeParam = function(q) {
      }, Q.parseExprAtom = function(q, j, G) {
        if (this.type === Y.jsxText) return this.jsx_parseText();
        if (this.type === Y.jsxTagStart) return this.jsx_parseElement();
        if (this.type === Y.at) return this.parseDecorators(), this.parseExprAtom();
        if (ae(this.type)) {
          var J = this.potentialArrowAt === this.start, ee = this.start, se = this.startLoc, ne = this.containsEsc, oe = this.parseIdent(!1);
          if (this.options.ecmaVersion >= 8 && !ne && oe.name === "async" && !this.canInsertSemicolon() && this.eat(H._function)) return this.overrideContext(X.f_expr), this.parseFunction(this.startNodeAt(ee, se), 0, !1, !0, j);
          if (J && !this.canInsertSemicolon()) {
            if (this.eat(H.arrow)) return this.parseArrowExpression(this.startNodeAt(ee, se), [oe], !1, j);
            if (this.options.ecmaVersion >= 8 && oe.name === "async" && this.type === H.name && !ne && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) return oe = this.parseIdent(!1), !this.canInsertSemicolon() && this.eat(H.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(ee, se), [oe], !0, j);
          }
          return oe;
        }
        return ce.prototype.parseExprAtom.call(this, q, j, G);
      }, Q.parseExprAtomDefault = function() {
        if (ae(this.type)) {
          var q = this.potentialArrowAt === this.start, j = this.containsEsc, G = this.parseIdent();
          if (!j && G.name === "async" && !this.canInsertSemicolon()) {
            var J = this.type;
            if (J === H._function) return this.next(), this.parseFunction(this.startNodeAtNode(G), void 0, !0, !0);
            if (ae(J)) {
              if (this.lookaheadCharCode() === 61) {
                var ee = this.parseIdent(!1);
                return !this.canInsertSemicolon() && this.eat(H.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAtNode(G), [ee], !0);
              }
              return G;
            }
          }
          return q && this.match(H.arrow) && !this.canInsertSemicolon() ? (this.next(), this.parseArrowExpression(this.startNodeAtNode(G), [G], !1)) : G;
        }
        this.unexpected();
      }, Q.parseIdentNode = function() {
        var q = this.startNode();
        return le(this.type) ? (q.name = this.value, q) : ce.prototype.parseIdentNode.call(this);
      }, Q.parseVarStatement = function(q, j, G) {
        G === void 0 && (G = !1);
        var J = this.isAmbientContext;
        this.next(), ce.prototype.parseVar.call(this, q, !1, j, G || J), this.semicolon();
        var ee = this.finishNode(q, "VariableDeclaration");
        if (!J) return ee;
        for (var se, ne = c(ee.declarations); !(se = ne()).done; ) {
          var oe = se.value, he = oe.init;
          he && (j !== "const" || oe.id.typeAnnotation ? this.raise(he.start, b.InitializerNotAllowedInAmbientContext) : he.type !== "StringLiteral" && he.type !== "BooleanLiteral" && he.type !== "NumericLiteral" && he.type !== "BigIntLiteral" && (he.type !== "TemplateLiteral" || he.expressions.length > 0) && !L(he) && this.raise(he.start, b.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference));
        }
        return ee;
      }, Q.parseStatement = function(q, j, G) {
        if (this.match(Y.at) && this.parseDecorators(!0), this.match(H._const) && this.isLookaheadContextual("enum")) {
          var J = this.startNode();
          return this.expect(H._const), this.tsParseEnumDeclaration(J, { const: !0 });
        }
        if (this.ts_isContextual(Y.enum)) return this.tsParseEnumDeclaration(this.startNode());
        if (this.ts_isContextual(Y.interface)) {
          var ee = this.tsParseInterfaceDeclaration(this.startNode());
          if (ee) return ee;
        }
        return ce.prototype.parseStatement.call(this, q, j, G);
      }, Q.parseAccessModifier = function() {
        return this.tsParseModifier(["public", "protected", "private"]);
      }, Q.parsePostMemberNameModifiers = function(q) {
        this.eat(H.question) && (q.optional = !0), q.readonly && this.match(H.parenL) && this.raise(q.start, b.ClassMethodHasReadonly), q.declare && this.match(H.parenL) && this.raise(q.start, b.ClassMethodHasDeclare);
      }, Q.parseExpressionStatement = function(q, j) {
        return (j.type === "Identifier" ? this.tsParseExpressionStatement(q, j) : void 0) || ce.prototype.parseExpressionStatement.call(this, q, j);
      }, Q.shouldParseExportStatement = function() {
        return !!this.tsIsDeclarationStart() || !!this.match(Y.at) || ce.prototype.shouldParseExportStatement.call(this);
      }, Q.parseConditional = function(q, j, G, J, ee) {
        if (this.eat(H.question)) {
          var se = this.startNodeAt(j, G);
          return se.test = q, se.consequent = this.parseMaybeAssign(), this.expect(H.colon), se.alternate = this.parseMaybeAssign(J), this.finishNode(se, "ConditionalExpression");
        }
        return q;
      }, Q.parseMaybeConditional = function(q, j) {
        var G = this, J = this.start, ee = this.startLoc, se = this.parseExprOps(q, j);
        if (this.checkExpressionErrors(j)) return se;
        if (!this.maybeInArrowParameters || !this.match(H.question)) return this.parseConditional(se, J, ee, q, j);
        var ne = this.tryParse(function() {
          return G.parseConditional(se, J, ee, q, j);
        });
        return ne.node ? (ne.error && this.setLookaheadState(ne.failState), ne.node) : (ne.error && this.setOptionalParametersError(j, ne.error), se);
      }, Q.parseParenItem = function(q) {
        var j = this.start, G = this.startLoc;
        if (q = ce.prototype.parseParenItem.call(this, q), this.eat(H.question) && (q.optional = !0, this.resetEndLocation(q)), this.match(H.colon)) {
          var J = this.startNodeAt(j, G);
          return J.expression = q, J.typeAnnotation = this.tsParseTypeAnnotation(), this.finishNode(J, "TSTypeCastExpression");
        }
        return q;
      }, Q.parseExportDeclaration = function(q) {
        var j = this;
        if (!this.isAmbientContext && this.ts_isContextual(Y.declare)) return this.tsInAmbientContext(function() {
          return j.parseExportDeclaration(q);
        });
        var G = this.start, J = this.startLoc, ee = this.eatContextual("declare");
        !ee || !this.ts_isContextual(Y.declare) && this.shouldParseExportStatement() || this.raise(this.start, b.ExpectedAmbientAfterExportDeclare);
        var se = ae(this.type) && this.tsTryParseExportDeclaration() || this.parseStatement(null);
        return se ? ((se.type === "TSInterfaceDeclaration" || se.type === "TSTypeAliasDeclaration" || ee) && (q.exportKind = "type"), ee && (this.resetStartLocation(se, G, J), se.declare = !0), se) : null;
      }, Q.parseClassId = function(q, j) {
        if (j || !this.isContextual("implements")) {
          ce.prototype.parseClassId.call(this, q, j);
          var G = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
          G && (q.typeParameters = G);
        }
      }, Q.parseClassPropertyAnnotation = function(q) {
        q.optional || (this.value === "!" && this.eat(H.prefix) ? q.definite = !0 : this.eat(H.question) && (q.optional = !0));
        var j = this.tsTryParseTypeAnnotation();
        j && (q.typeAnnotation = j);
      }, Q.parseClassField = function(q) {
        if (q.key.type === "PrivateIdentifier") q.abstract && this.raise(q.start, b.PrivateElementHasAbstract), q.accessibility && this.raise(q.start, b.PrivateElementHasAccessibility({ modifier: q.accessibility })), this.parseClassPropertyAnnotation(q);
        else if (this.parseClassPropertyAnnotation(q), this.isAmbientContext && (!q.readonly || q.typeAnnotation) && this.match(H.eq) && this.raise(this.start, b.DeclareClassFieldHasInitializer), q.abstract && this.match(H.eq)) {
          var j = q.key;
          this.raise(this.start, b.AbstractPropertyHasInitializer({ propertyName: j.type !== "Identifier" || q.computed ? "[" + this.input.slice(j.start, j.end) + "]" : j.name }));
        }
        return ce.prototype.parseClassField.call(this, q);
      }, Q.parseClassMethod = function(q, j, G, J) {
        var ee = q.kind === "constructor", se = q.key.type === "PrivateIdentifier", ne = this.tsTryParseTypeParameters();
        se ? (ne && (q.typeParameters = ne), q.accessibility && this.raise(q.start, b.PrivateMethodsHasAccessibility({ modifier: q.accessibility }))) : ne && ee && this.raise(ne.start, b.ConstructorHasTypeParameters);
        var oe = q.declare, he = q.kind;
        !(oe !== void 0 && oe) || he !== "get" && he !== "set" || this.raise(q.start, b.DeclareAccessor({ kind: he })), ne && (q.typeParameters = ne);
        var pe = q.key;
        q.kind === "constructor" ? (j && this.raise(pe.start, "Constructor can't be a generator"), G && this.raise(pe.start, "Constructor can't be an async method")) : q.static && P(q, "prototype") && this.raise(pe.start, "Classes may not have a static property named prototype");
        var ve = q.value = this.parseMethod(j, G, J, !0, q);
        return q.kind === "get" && ve.params.length !== 0 && this.raiseRecoverable(ve.start, "getter should have no params"), q.kind === "set" && ve.params.length !== 1 && this.raiseRecoverable(ve.start, "setter should have exactly one param"), q.kind === "set" && ve.params[0].type === "RestElement" && this.raiseRecoverable(ve.params[0].start, "Setter cannot use rest params"), this.finishNode(q, "MethodDefinition");
      }, Q.isClassMethod = function() {
        return this.match(H.relational);
      }, Q.parseClassElement = function(q) {
        var j = this;
        if (this.eat(H.semi)) return null;
        var G, J = this.options.ecmaVersion, ee = this.startNode(), se = "", ne = !1, oe = !1, he = "method", pe = ["declare", "private", "public", "protected", "accessor", "override", "abstract", "readonly", "static"], ve = this.tsParseModifiers({ modified: ee, allowedModifiers: pe, disallowedModifiers: ["in", "out"], stopOnStartOfClassStaticBlock: !0, errorTemplate: b.InvalidModifierOnTypeParameterPositions });
        G = !!ve.static;
        var we = function() {
          if (!j.tsIsStartOfStaticBlocks()) {
            var ye = j.tsTryParseIndexSignature(ee);
            if (ye) return ee.abstract && j.raise(ee.start, b.IndexSignatureHasAbstract), ee.accessibility && j.raise(ee.start, b.IndexSignatureHasAccessibility({ modifier: ee.accessibility })), ee.declare && j.raise(ee.start, b.IndexSignatureHasDeclare), ee.override && j.raise(ee.start, b.IndexSignatureHasOverride), ye;
            if (!j.inAbstractClass && ee.abstract && j.raise(ee.start, b.NonAbstractClassHasAbstractMethod), ee.override && q && j.raise(ee.start, b.OverrideNotInSubClass), ee.static = G, G && (j.isClassElementNameStart() || j.type === H.star || (se = "static")), !se && J >= 8 && j.eatContextual("async") && (!j.isClassElementNameStart() && j.type !== H.star || j.canInsertSemicolon() ? se = "async" : oe = !0), !se && (J >= 9 || !oe) && j.eat(H.star) && (ne = !0), !se && !oe && !ne) {
              var Ae = j.value;
              (j.eatContextual("get") || j.eatContextual("set")) && (j.isClassElementNameStart() ? he = Ae : se = Ae);
            }
            if (se ? (ee.computed = !1, ee.key = j.startNodeAt(j.lastTokStart, j.lastTokStartLoc), ee.key.name = se, j.finishNode(ee.key, "Identifier")) : j.parseClassElementName(ee), j.parsePostMemberNameModifiers(ee), j.isClassMethod() || J < 13 || j.type === H.parenL || he !== "method" || ne || oe) {
              var Te = !ee.static && P(ee, "constructor"), Ee = Te && q;
              Te && he !== "method" && j.raise(ee.key.start, "Constructor can't have get/set modifier"), ee.kind = Te ? "constructor" : he, j.parseClassMethod(ee, ne, oe, Ee);
            } else j.parseClassField(ee);
            return ee;
          }
          if (j.next(), j.next(), j.tsHasSomeModifiers(ee, pe) && j.raise(j.start, b.StaticBlockCannotHaveModifier), J >= 13) return ce.prototype.parseClassStaticBlock.call(j, ee), ee;
        };
        return ee.declare ? this.tsInAmbientContext(we) : we(), ee;
      }, Q.isClassElementNameStart = function() {
        return !!this.tsIsIdentifier() || ce.prototype.isClassElementNameStart.call(this);
      }, Q.parseClassSuper = function(q) {
        ce.prototype.parseClassSuper.call(this, q), q.superClass && (this.tsMatchLeftRelational() || this.match(H.bitShift)) && (q.superTypeParameters = this.tsParseTypeArgumentsInExpression()), this.eatContextual("implements") && (q.implements = this.tsParseHeritageClause("implements"));
      }, Q.parseFunctionParams = function(q) {
        var j = this.tsTryParseTypeParameters();
        j && (q.typeParameters = j), ce.prototype.parseFunctionParams.call(this, q);
      }, Q.parseVarId = function(q, j) {
        ce.prototype.parseVarId.call(this, q, j), q.id.type === "Identifier" && !this.hasPrecedingLineBreak() && this.value === "!" && this.eat(H.prefix) && (q.definite = !0);
        var G = this.tsTryParseTypeAnnotation();
        G && (q.id.typeAnnotation = G, this.resetEndLocation(q.id));
      }, Q.parseArrowExpression = function(q, j, G, J) {
        this.match(H.colon) && (q.returnType = this.tsParseTypeAnnotation());
        var ee = this.yieldPos, se = this.awaitPos, ne = this.awaitIdentPos;
        this.enterScope(16 | w(G, !1)), this.initFunction(q);
        var oe = this.maybeInArrowParameters;
        return this.options.ecmaVersion >= 8 && (q.async = !!G), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.maybeInArrowParameters = !0, q.params = this.toAssignableList(j, !0), this.maybeInArrowParameters = !1, this.parseFunctionBody(q, !0, !1, J), this.yieldPos = ee, this.awaitPos = se, this.awaitIdentPos = ne, this.maybeInArrowParameters = oe, this.finishNode(q, "ArrowFunctionExpression");
      }, Q.parseMaybeAssignOrigin = function(q, j, G) {
        if (this.isContextual("yield")) {
          if (this.inGenerator) return this.parseYield(q);
          this.exprAllowed = !1;
        }
        var J = !1, ee = -1, se = -1, ne = -1;
        j ? (ee = j.parenthesizedAssign, se = j.trailingComma, ne = j.doubleProto, j.parenthesizedAssign = j.trailingComma = -1) : (j = new T(), J = !0);
        var oe = this.start, he = this.startLoc;
        (this.type === H.parenL || ae(this.type)) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = q === "await");
        var pe = this.parseMaybeConditional(q, j);
        if (G && (pe = G.call(this, pe, oe, he)), this.type.isAssign) {
          var ve = this.startNodeAt(oe, he);
          return ve.operator = this.value, this.type === H.eq && (pe = this.toAssignable(pe, !0, j)), J || (j.parenthesizedAssign = j.trailingComma = j.doubleProto = -1), j.shorthandAssign >= pe.start && (j.shorthandAssign = -1), this.type === H.eq ? this.checkLValPattern(pe) : this.checkLValSimple(pe), ve.left = pe, this.next(), ve.right = this.parseMaybeAssign(q), ne > -1 && (j.doubleProto = ne), this.finishNode(ve, "AssignmentExpression");
        }
        return J && this.checkExpressionErrors(j, !0), ee > -1 && (j.parenthesizedAssign = ee), se > -1 && (j.trailingComma = se), pe;
      }, Q.parseMaybeAssign = function(q, j, G) {
        var J, ee, se, ne, oe, he, pe, ve, we, ye, Ae, Te = this;
        if (this.matchJsx("jsxTagStart") || this.tsMatchLeftRelational()) {
          if (ve = this.cloneCurLookaheadState(), !(we = this.tryParse(function() {
            return Te.parseMaybeAssignOrigin(q, j, G);
          }, ve)).error) return we.node;
          var Ee = this.context, Pe = Ee[Ee.length - 1];
          Pe === V.tokContexts.tc_oTag && Ee[Ee.length - 2] === V.tokContexts.tc_expr ? (Ee.pop(), Ee.pop()) : Pe !== V.tokContexts.tc_oTag && Pe !== V.tokContexts.tc_expr || Ee.pop();
        }
        if (!((J = we) != null && J.error || this.tsMatchLeftRelational())) return this.parseMaybeAssignOrigin(q, j, G);
        ve && !this.compareLookaheadState(ve, this.getCurLookaheadState()) || (ve = this.cloneCurLookaheadState());
        var Me = this.tryParse(function(Ie) {
          var De, Oe;
          Ae = Te.tsParseTypeParameters();
          var Ne = Te.parseMaybeAssignOrigin(q, j, G);
          return (Ne.type !== "ArrowFunctionExpression" || (De = Ne.extra) != null && De.parenthesized) && Ie(), ((Oe = Ae) == null ? void 0 : Oe.params.length) !== 0 && Te.resetStartLocationFromNode(Ne, Ae), Ne.typeParameters = Ae, Ne;
        }, ve);
        if (!Me.error && !Me.aborted) return Ae && this.reportReservedArrowTypeParam(Ae), Me.node;
        if (!we && (k(!0), !(ye = this.tryParse(function() {
          return Te.parseMaybeAssignOrigin(q, j, G);
        }, ve)).error)) return ye.node;
        if ((ee = we) != null && ee.node) return this.setLookaheadState(we.failState), we.node;
        if (Me.node) return this.setLookaheadState(Me.failState), Ae && this.reportReservedArrowTypeParam(Ae), Me.node;
        if ((se = ye) != null && se.node) return this.setLookaheadState(ye.failState), ye.node;
        throw (ne = we) != null && ne.thrown ? we.error : Me.thrown ? Me.error : (oe = ye) != null && oe.thrown ? ye.error : ((he = we) == null ? void 0 : he.error) || Me.error || ((pe = ye) == null ? void 0 : pe.error);
      }, Q.parseAssignableListItem = function(q) {
        for (var j = []; this.match(Y.at); ) j.push(this.parseDecorator());
        var G, J = this.start, ee = this.startLoc, se = !1, ne = !1;
        if (q !== void 0) {
          var oe = {};
          this.tsParseModifiers({ modified: oe, allowedModifiers: ["public", "private", "protected", "override", "readonly"] }), G = oe.accessibility, ne = oe.override, se = oe.readonly, q === !1 && (G || se || ne) && this.raise(ee.start, b.UnexpectedParameterModifier);
        }
        var he = this.parseMaybeDefault(J, ee);
        this.parseBindingListItem(he);
        var pe = this.parseMaybeDefault(he.start, he.loc, he);
        if (j.length && (pe.decorators = j), G || se || ne) {
          var ve = this.startNodeAt(J, ee);
          return G && (ve.accessibility = G), se && (ve.readonly = se), ne && (ve.override = ne), pe.type !== "Identifier" && pe.type !== "AssignmentPattern" && this.raise(ve.start, b.UnsupportedParameterPropertyKind), ve.parameter = pe, this.finishNode(ve, "TSParameterProperty");
        }
        return pe;
      }, Q.checkLValInnerPattern = function(q, j, G) {
        j === void 0 && (j = 0), q.type === "TSParameterProperty" ? this.checkLValInnerPattern(q.parameter, j, G) : ce.prototype.checkLValInnerPattern.call(this, q, j, G);
      }, Q.parseBindingListItem = function(q) {
        this.eat(H.question) && (q.type === "Identifier" || this.isAmbientContext || this.inType || this.raise(q.start, b.PatternIsOptional), q.optional = !0);
        var j = this.tsTryParseTypeAnnotation();
        return j && (q.typeAnnotation = j), this.resetEndLocation(q), q;
      }, Q.isAssignable = function(q, j) {
        var G = this;
        switch (q.type) {
          case "TSTypeCastExpression":
            return this.isAssignable(q.expression, j);
          case "TSParameterProperty":
          case "Identifier":
          case "ObjectPattern":
          case "ArrayPattern":
          case "AssignmentPattern":
          case "RestElement":
            return !0;
          case "ObjectExpression":
            var J = q.properties.length - 1;
            return q.properties.every(function(ee, se) {
              return ee.type !== "ObjectMethod" && (se === J || ee.type !== "SpreadElement") && G.isAssignable(ee);
            });
          case "Property":
          case "ObjectProperty":
            return this.isAssignable(q.value);
          case "SpreadElement":
            return this.isAssignable(q.argument);
          case "ArrayExpression":
            return q.elements.every(function(ee) {
              return ee === null || G.isAssignable(ee);
            });
          case "AssignmentExpression":
            return q.operator === "=";
          case "ParenthesizedExpression":
            return this.isAssignable(q.expression);
          case "MemberExpression":
          case "OptionalMemberExpression":
            return !j;
          default:
            return !1;
        }
      }, Q.toAssignable = function(q, j, G) {
        switch (j === void 0 && (j = !1), G === void 0 && (G = new T()), q.type) {
          case "ParenthesizedExpression":
            return this.toAssignableParenthesizedExpression(q, j, G);
          case "TSAsExpression":
          case "TSSatisfiesExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
            return j || this.raise(q.start, b.UnexpectedTypeCastInParameter), this.toAssignable(q.expression, j, G);
          case "MemberExpression":
            break;
          case "AssignmentExpression":
            return j || q.left.type !== "TSTypeCastExpression" || (q.left = this.typeCastToParameter(q.left)), ce.prototype.toAssignable.call(this, q, j, G);
          case "TSTypeCastExpression":
            return this.typeCastToParameter(q);
          default:
            return ce.prototype.toAssignable.call(this, q, j, G);
        }
        return q;
      }, Q.toAssignableParenthesizedExpression = function(q, j, G) {
        switch (q.expression.type) {
          case "TSAsExpression":
          case "TSSatisfiesExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
          case "ParenthesizedExpression":
            return this.toAssignable(q.expression, j, G);
          default:
            return ce.prototype.toAssignable.call(this, q, j, G);
        }
      }, Q.curPosition = function() {
        if (this.options.locations) {
          var q = ce.prototype.curPosition.call(this);
          return Object.defineProperty(q, "offset", { get: function() {
            return function(j) {
              var G = new F.Position(this.line, this.column + j);
              return G.index = this.index + j, G;
            };
          } }), q.index = this.pos, q;
        }
      }, Q.parseBindingAtom = function() {
        return this.type === H._this ? this.parseIdent(!0) : ce.prototype.parseBindingAtom.call(this);
      }, Q.shouldParseArrow = function(q) {
        var j, G = this;
        if (j = this.match(H.colon) ? q.every(function(ee) {
          return G.isAssignable(ee, !0);
        }) : !this.canInsertSemicolon()) {
          if (this.match(H.colon)) {
            var J = this.tryParse(function(ee) {
              var se = G.tsParseTypeOrTypePredicateAnnotation(H.colon);
              return !G.canInsertSemicolon() && G.match(H.arrow) || ee(), se;
            });
            if (J.aborted) return this.shouldParseArrowReturnType = void 0, !1;
            J.thrown || (J.error && this.setLookaheadState(J.failState), this.shouldParseArrowReturnType = J.node);
          }
          return !!this.match(H.arrow) || (this.shouldParseArrowReturnType = void 0, !1);
        }
        return this.shouldParseArrowReturnType = void 0, j;
      }, Q.parseParenArrowList = function(q, j, G, J) {
        var ee = this.startNodeAt(q, j);
        return ee.returnType = this.shouldParseArrowReturnType, this.shouldParseArrowReturnType = void 0, this.parseArrowExpression(ee, G, !1, J);
      }, Q.parseParenAndDistinguishExpression = function(q, j) {
        var G, J = this.start, ee = this.startLoc, se = this.options.ecmaVersion >= 8;
        if (this.options.ecmaVersion >= 6) {
          var ne = this.maybeInArrowParameters;
          this.maybeInArrowParameters = !0, this.next();
          var oe, he = this.start, pe = this.startLoc, ve = [], we = !0, ye = !1, Ae = new T(), Te = this.yieldPos, Ee = this.awaitPos;
          for (this.yieldPos = 0, this.awaitPos = 0; this.type !== H.parenR; ) {
            if (we ? we = !1 : this.expect(H.comma), se && this.afterTrailingComma(H.parenR, !0)) {
              ye = !0;
              break;
            }
            if (this.type === H.ellipsis) {
              oe = this.start, ve.push(this.parseParenItem(this.parseRestBinding())), this.type === H.comma && this.raise(this.start, "Comma is not permitted after the rest element");
              break;
            }
            ve.push(this.parseMaybeAssign(j, Ae, this.parseParenItem));
          }
          var Pe = this.lastTokEnd, Me = this.lastTokEndLoc;
          if (this.expect(H.parenR), this.maybeInArrowParameters = ne, q && this.shouldParseArrow(ve) && this.eat(H.arrow)) return this.checkPatternErrors(Ae, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = Te, this.awaitPos = Ee, this.parseParenArrowList(J, ee, ve, j);
          ve.length && !ye || this.unexpected(this.lastTokStart), oe && this.unexpected(oe), this.checkExpressionErrors(Ae, !0), this.yieldPos = Te || this.yieldPos, this.awaitPos = Ee || this.awaitPos, ve.length > 1 ? ((G = this.startNodeAt(he, pe)).expressions = ve, this.finishNodeAt(G, "SequenceExpression", Pe, Me)) : G = ve[0];
        } else G = this.parseParenExpression();
        if (this.options.preserveParens) {
          var Ie = this.startNodeAt(J, ee);
          return Ie.expression = G, this.finishNode(Ie, "ParenthesizedExpression");
        }
        return G;
      }, Q.parseTaggedTemplateExpression = function(q, j, G, J) {
        var ee = this.startNodeAt(j, G);
        return ee.tag = q, ee.quasi = this.parseTemplate({ isTagged: !0 }), J && this.raise(j, "Tagged Template Literals are not allowed in optionalChain."), this.finishNode(ee, "TaggedTemplateExpression");
      }, Q.shouldParseAsyncArrow = function() {
        var q = this;
        if (!this.match(H.colon)) return !this.canInsertSemicolon() && this.eat(H.arrow);
        var j = this.tryParse(function(G) {
          var J = q.tsParseTypeOrTypePredicateAnnotation(H.colon);
          return !q.canInsertSemicolon() && q.match(H.arrow) || G(), J;
        });
        return j.aborted ? (this.shouldParseAsyncArrowReturnType = void 0, !1) : j.thrown ? void 0 : (j.error && this.setLookaheadState(j.failState), this.shouldParseAsyncArrowReturnType = j.node, !this.canInsertSemicolon() && this.eat(H.arrow));
      }, Q.parseSubscriptAsyncArrow = function(q, j, G, J) {
        var ee = this.startNodeAt(q, j);
        return ee.returnType = this.shouldParseAsyncArrowReturnType, this.shouldParseAsyncArrowReturnType = void 0, this.parseArrowExpression(ee, G, !0, J);
      }, Q.parseExprList = function(q, j, G, J) {
        for (var ee = [], se = !0; !this.eat(q); ) {
          if (se) se = !1;
          else if (this.expect(H.comma), j && this.afterTrailingComma(q)) break;
          var ne = void 0;
          G && this.type === H.comma ? ne = null : this.type === H.ellipsis ? (ne = this.parseSpread(J), J && this.type === H.comma && J.trailingComma < 0 && (J.trailingComma = this.start)) : ne = this.parseMaybeAssign(!1, J, this.parseParenItem), ee.push(ne);
        }
        return ee;
      }, Q.parseSubscript = function(q, j, G, J, ee, se, ne) {
        var oe = this, he = se;
        if (!this.hasPrecedingLineBreak() && this.value === "!" && this.match(H.prefix)) {
          this.exprAllowed = !1, this.next();
          var pe = this.startNodeAt(j, G);
          return pe.expression = q, q = this.finishNode(pe, "TSNonNullExpression");
        }
        var ve = !1;
        if (this.match(H.questionDot) && this.lookaheadCharCode() === 60) {
          if (J) return q;
          q.optional = !0, he = ve = !0, this.next();
        }
        if (this.tsMatchLeftRelational() || this.match(H.bitShift)) {
          var we, ye = this.tsTryParseAndCatch(function() {
            if (!J && oe.atPossibleAsyncArrow(q)) {
              var He = oe.tsTryParseGenericAsyncArrowFunction(j, G, ne);
              if (He) return q = He;
            }
            var Be = oe.tsParseTypeArgumentsInExpression();
            if (!Be) return q;
            if (ve && !oe.match(H.parenL)) return we = oe.curPosition(), q;
            if (de(oe.type) || oe.type === H.backQuote) {
              var qe = oe.parseTaggedTemplateExpression(q, j, G, he);
              return qe.typeParameters = Be, qe;
            }
            if (!J && oe.eat(H.parenL)) {
              var We = new T(), Le = oe.startNodeAt(j, G);
              return Le.callee = q, Le.arguments = oe.parseExprList(H.parenR, oe.options.ecmaVersion >= 8, !1, We), oe.tsCheckForInvalidTypeCasts(Le.arguments), Le.typeParameters = Be, he && (Le.optional = ve), oe.checkExpressionErrors(We, !0), q = oe.finishNode(Le, "CallExpression");
            }
            var $e = oe.type;
            if (!(oe.tsMatchRightRelational() || $e === H.bitShift || $e !== H.parenL && (je = $e, !!je.startsExpr) && !oe.hasPrecedingLineBreak())) {
              var je, Fe = oe.startNodeAt(j, G);
              return Fe.expression = q, Fe.typeParameters = Be, oe.finishNode(Fe, "TSInstantiationExpression");
            }
          });
          if (we && this.unexpected(we), ye) return ye.type === "TSInstantiationExpression" && (this.match(H.dot) || this.match(H.questionDot) && this.lookaheadCharCode() !== 40) && this.raise(this.start, b.InvalidPropertyAccessAfterInstantiationExpression), q = ye;
        }
        var Ae = this.options.ecmaVersion >= 11, Te = Ae && this.eat(H.questionDot);
        J && Te && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
        var Ee = this.eat(H.bracketL);
        if (Ee || Te && this.type !== H.parenL && this.type !== H.backQuote || this.eat(H.dot)) {
          var Pe = this.startNodeAt(j, G);
          Pe.object = q, Ee ? (Pe.property = this.parseExpression(), this.expect(H.bracketR)) : Pe.property = this.type === H.privateId && q.type !== "Super" ? this.parsePrivateIdent() : this.parseIdent(this.options.allowReserved !== "never"), Pe.computed = !!Ee, Ae && (Pe.optional = Te), q = this.finishNode(Pe, "MemberExpression");
        } else if (!J && this.eat(H.parenL)) {
          var Me = this.maybeInArrowParameters;
          this.maybeInArrowParameters = !0;
          var Ie = new T(), De = this.yieldPos, Oe = this.awaitPos, Ne = this.awaitIdentPos;
          this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
          var Ve = this.parseExprList(H.parenR, this.options.ecmaVersion >= 8, !1, Ie);
          if (ee && !Te && this.shouldParseAsyncArrow()) this.checkPatternErrors(Ie, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = De, this.awaitPos = Oe, this.awaitIdentPos = Ne, q = this.parseSubscriptAsyncArrow(j, G, Ve, ne);
          else {
            this.checkExpressionErrors(Ie, !0), this.yieldPos = De || this.yieldPos, this.awaitPos = Oe || this.awaitPos, this.awaitIdentPos = Ne || this.awaitIdentPos;
            var Re = this.startNodeAt(j, G);
            Re.callee = q, Re.arguments = Ve, Ae && (Re.optional = Te), q = this.finishNode(Re, "CallExpression");
          }
          this.maybeInArrowParameters = Me;
        } else if (this.type === H.backQuote) {
          (Te || he) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
          var _e = this.startNodeAt(j, G);
          _e.tag = q, _e.quasi = this.parseTemplate({ isTagged: !0 }), q = this.finishNode(_e, "TaggedTemplateExpression");
        }
        return q;
      }, Q.parseGetterSetter = function(q) {
        q.kind = q.key.name, this.parsePropertyName(q), q.value = this.parseMethod(!1);
        var j = q.kind === "get" ? 0 : 1, G = q.value.params[0], J = G && this.isThisParam(G);
        q.value.params.length !== (j = J ? j + 1 : j) ? this.raiseRecoverable(q.value.start, q.kind === "get" ? "getter should have no params" : "setter should have exactly one param") : q.kind === "set" && q.value.params[0].type === "RestElement" && this.raiseRecoverable(q.value.params[0].start, "Setter cannot use rest params");
      }, Q.parseProperty = function(q, j) {
        if (!q) {
          var G = [];
          if (this.match(Y.at)) for (; this.match(Y.at); ) G.push(this.parseDecorator());
          var J = ce.prototype.parseProperty.call(this, q, j);
          return J.type === "SpreadElement" && G.length && this.raise(J.start, "Decorators can't be used with SpreadElement"), G.length && (J.decorators = G, G = []), J;
        }
        return ce.prototype.parseProperty.call(this, q, j);
      }, Q.parseCatchClauseParam = function() {
        var q = this.parseBindingAtom(), j = q.type === "Identifier";
        this.enterScope(j ? 32 : 0), this.checkLValPattern(q, j ? 4 : 2);
        var G = this.tsTryParseTypeAnnotation();
        return G && (q.typeAnnotation = G, this.resetEndLocation(q)), this.expect(H.parenR), q;
      }, Q.parseClass = function(q, j) {
        var G = this.inAbstractClass;
        this.inAbstractClass = !!q.abstract;
        try {
          this.next(), this.takeDecorators(q);
          var J = this.strict;
          this.strict = !0, this.parseClassId(q, j), this.parseClassSuper(q);
          var ee = this.enterClassBody(), se = this.startNode(), ne = !1;
          se.body = [];
          var oe = [];
          for (this.expect(H.braceL); this.type !== H.braceR; ) if (this.match(Y.at)) oe.push(this.parseDecorator());
          else {
            var he = this.parseClassElement(q.superClass !== null);
            oe.length && (he.decorators = oe, this.resetStartLocationFromNode(he, oe[0]), oe = []), he && (se.body.push(he), he.type === "MethodDefinition" && he.kind === "constructor" && he.value.type === "FunctionExpression" ? (ne && this.raiseRecoverable(he.start, "Duplicate constructor in the same class"), ne = !0, he.decorators && he.decorators.length > 0 && this.raise(he.start, "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?")) : he.key && he.key.type === "PrivateIdentifier" && v(ee, he) && this.raiseRecoverable(he.key.start, "Identifier '#" + he.key.name + "' has already been declared"));
          }
          return this.strict = J, this.next(), oe.length && this.raise(this.start, "Decorators must be attached to a class element."), q.body = this.finishNode(se, "ClassBody"), this.exitClassBody(), this.finishNode(q, j ? "ClassDeclaration" : "ClassExpression");
        } finally {
          this.inAbstractClass = G;
        }
      }, Q.parseClassFunctionParams = function() {
        var q = this.tsTryParseTypeParameters(this.tsParseConstModifier), j = this.parseBindingList(H.parenR, !1, this.options.ecmaVersion >= 8, !0);
        return q && (j.typeParameters = q), j;
      }, Q.parseMethod = function(q, j, G, J, ee) {
        var se = this.startNode(), ne = this.yieldPos, oe = this.awaitPos, he = this.awaitIdentPos;
        if (this.initFunction(se), this.options.ecmaVersion >= 6 && (se.generator = q), this.options.ecmaVersion >= 8 && (se.async = !!j), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | w(j, se.generator) | (G ? 128 : 0)), this.expect(H.parenL), se.params = this.parseClassFunctionParams(), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(se, !1, !0, !1, { isClassMethod: J }), this.yieldPos = ne, this.awaitPos = oe, this.awaitIdentPos = he, ee && ee.abstract && se.body) {
          var pe = ee.key;
          this.raise(ee.start, b.AbstractMethodHasImplementation({ methodName: pe.type !== "Identifier" || ee.computed ? "[" + this.input.slice(pe.start, pe.end) + "]" : pe.name }));
        }
        return this.finishNode(se, "FunctionExpression");
      }, ge.parse = function(q, j) {
        if (j.locations === !1) throw new Error("You have to enable options.locations while using acorn-typescript");
        j.locations = !0;
        var G = new this(j, q);
        return R && (G.isAmbientContext = !0), G.parse();
      }, ge.parseExpressionAt = function(q, j, G) {
        if (G.locations === !1) throw new Error("You have to enable options.locations while using acorn-typescript");
        G.locations = !0;
        var J = new this(G, q, j);
        return R && (J.isAmbientContext = !0), J.nextToken(), J.parseExpression();
      }, Q.parseImportSpecifier = function() {
        if (this.ts_isContextual(Y.type)) {
          var q = this.startNode();
          return q.imported = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(q, !0, this.importOrExportOuterKind === "type"), this.finishNode(q, "ImportSpecifier");
        }
        var j = ce.prototype.parseImportSpecifier.call(this);
        return j.importKind = "value", j;
      }, Q.parseExportSpecifier = function(q) {
        var j = this.ts_isContextual(Y.type);
        if (!this.match(H.string) && j) {
          var G = this.startNode();
          return G.local = this.parseModuleExportName(), this.parseTypeOnlyImportExportSpecifier(G, !1, this.importOrExportOuterKind === "type"), this.finishNode(G, "ExportSpecifier"), this.checkExport(q, G.exported, G.exported.start), G;
        }
        var J = ce.prototype.parseExportSpecifier.call(this, q);
        return J.exportKind = "value", J;
      }, Q.parseTypeOnlyImportExportSpecifier = function(q, j, G) {
        var J, ee = j ? "imported" : "local", se = j ? "local" : "exported", ne = q[ee], oe = !1, he = !0, pe = ne.start;
        if (this.isContextual("as")) {
          var ve = this.parseIdent();
          if (this.isContextual("as")) {
            var we = this.parseIdent();
            le(this.type) ? (oe = !0, ne = ve, J = j ? this.parseIdent() : this.parseModuleExportName(), he = !1) : (J = we, he = !1);
          } else le(this.type) ? (he = !1, J = j ? this.parseIdent() : this.parseModuleExportName()) : (oe = !0, ne = ve);
        } else le(this.type) && (oe = !0, j ? (ne = ce.prototype.parseIdent.call(this, !0), this.isContextual("as") || this.checkUnreserved(ne)) : ne = this.parseModuleExportName());
        oe && G && this.raise(pe, j ? b.TypeModifierIsUsedInTypeImports : b.TypeModifierIsUsedInTypeExports), q[ee] = ne, q[se] = J, q[j ? "importKind" : "exportKind"] = oe ? "type" : "value", he && this.eatContextual("as") && (q[se] = j ? this.parseIdent() : this.parseModuleExportName()), q[se] || (q[se] = this.copyNode(q[ee])), j && this.checkLValSimple(q[se], 2);
      }, Q.raiseCommonCheck = function(q, j, G) {
        return j === "Comma is not permitted after the rest element" ? this.isAmbientContext && this.match(H.comma) && this.lookaheadCharCode() === 41 ? void this.next() : ce.prototype.raise.call(this, q, j) : G ? ce.prototype.raiseRecoverable.call(this, q, j) : ce.prototype.raise.call(this, q, j);
      }, Q.raiseRecoverable = function(q, j) {
        return this.raiseCommonCheck(q, j, !0);
      }, Q.raise = function(q, j) {
        return this.raiseCommonCheck(q, j, !0);
      }, Q.updateContext = function(q) {
        var j = this.type;
        if (j == H.braceL) {
          var G = this.curContext();
          G == te.tc_oTag ? this.context.push(X.b_expr) : G == te.tc_expr ? this.context.push(X.b_tmpl) : ce.prototype.updateContext.call(this, q), this.exprAllowed = !0;
        } else {
          if (j !== H.slash || q !== Y.jsxTagStart) return ce.prototype.updateContext.call(this, q);
          this.context.length -= 2, this.context.push(te.tc_cTag), this.exprAllowed = !1;
        }
      }, Q.jsx_parseOpeningElementAt = function(q, j) {
        var G = this, J = this.startNodeAt(q, j), ee = this.jsx_parseElementName();
        if (ee && (J.name = ee), this.match(H.relational) || this.match(H.bitShift)) {
          var se = this.tsTryParseAndCatch(function() {
            return G.tsParseTypeArgumentsInExpression();
          });
          se && (J.typeParameters = se);
        }
        for (J.attributes = []; this.type !== H.slash && this.type !== Y.jsxTagEnd; ) J.attributes.push(this.jsx_parseAttribute());
        return J.selfClosing = this.eat(H.slash), this.expect(Y.jsxTagEnd), this.finishNode(J, ee ? "JSXOpeningElement" : "JSXOpeningFragment");
      }, Q.enterScope = function(q) {
        q === f && this.importsStack.push([]), ce.prototype.enterScope.call(this, q);
        var j = ce.prototype.currentScope.call(this);
        j.types = [], j.enums = [], j.constEnums = [], j.classes = [], j.exportOnlyBindings = [];
      }, Q.exitScope = function() {
        ce.prototype.currentScope.call(this).flags === f && this.importsStack.pop(), ce.prototype.exitScope.call(this);
      }, Q.hasImport = function(q, j) {
        var G = this.importsStack.length;
        if (this.importsStack[G - 1].indexOf(q) > -1) return !0;
        if (!j && G > 1) {
          for (var J = 0; J < G - 1; J++) if (this.importsStack[J].indexOf(q) > -1) return !0;
        }
        return !1;
      }, Q.maybeExportDefined = function(q, j) {
        this.inModule && 1 & q.flags && this.undefinedExports.delete(j);
      }, Q.isRedeclaredInScope = function(q, j, G) {
        return !!(0 & G) && (2 & G ? q.lexical.indexOf(j) > -1 || q.functions.indexOf(j) > -1 || q.var.indexOf(j) > -1 : 3 & G ? q.lexical.indexOf(j) > -1 || !ce.prototype.treatFunctionsAsVarInScope.call(this, q) && q.var.indexOf(j) > -1 : q.lexical.indexOf(j) > -1 && !(32 & q.flags && q.lexical[0] === j) || !this.treatFunctionsAsVarInScope(q) && q.functions.indexOf(j) > -1);
      }, Q.checkRedeclarationInScope = function(q, j, G, J) {
        this.isRedeclaredInScope(q, j, G) && this.raise(J, "Identifier '" + j + "' has already been declared.");
      }, Q.declareName = function(q, j, G) {
        if (4096 & j) return this.hasImport(q, !0) && this.raise(G, "Identifier '" + q + "' has already been declared."), void this.importsStack[this.importsStack.length - 1].push(q);
        var J = this.currentScope();
        if (1024 & j) return this.maybeExportDefined(J, q), void J.exportOnlyBindings.push(q);
        ce.prototype.declareName.call(this, q, j, G), 0 & j && (0 & j || (this.checkRedeclarationInScope(J, q, j, G), this.maybeExportDefined(J, q)), J.types.push(q)), 256 & j && J.enums.push(q), 512 & j && J.constEnums.push(q), 128 & j && J.classes.push(q);
      }, Q.checkLocalExport = function(q) {
        var j = q.name;
        if (!this.hasImport(j)) {
          for (var G = this.scopeStack.length - 1; G >= 0; G--) {
            var J = this.scopeStack[G];
            if (J.types.indexOf(j) > -1 || J.exportOnlyBindings.indexOf(j) > -1) return;
          }
          ce.prototype.checkLocalExport.call(this, q);
        }
      }, Ce = ge, xe = [{ key: "acornTypeScript", get: function() {
        return V;
      } }], (be = [{ key: "acornTypeScript", get: function() {
        return V;
      } }]) && a(Ce.prototype, be), xe && a(Ce, xe), Object.defineProperty(Ce, "prototype", { writable: !1 }), ge;
    }($);
    return ke;
  };
}
function detype(s) {
  const e = D(), r = Parser$1.extend(e).parse(s, {
    sourceType: "module",
    ecmaVersion: "latest",
    locations: !0
  }), R = new Sourcemap(s).trim();
  return removeTypeNode(R, r), String(R);
}
function removeTypeNode(s, e) {
  if (e.type.startsWith("TS")) {
    s.delete(e.start, e.end);
    return;
  }
  for (let r in e) {
    let R = e[r];
    if (Array.isArray(R)) {
      R.forEach((B) => removeTypeNode(s, B));
      continue;
    }
    if (typeof R == "object" && R !== null && R instanceof Node) {
      removeTypeNode(s, R);
      continue;
    }
  }
}
class TSCompiler {
  constructor() {
    __publicField(this, "sources"), __publicField(this, "results"), this.sources = /* @__PURE__ */ new Map(), this.results = /* @__PURE__ */ new Map();
  }
  compile(e, r) {
    return detype(e);
  }
}
function translateTS(s, e) {
  return new TSCompiler().compile(s, e);
}
function isGenerator(s) {
  const e = async function* () {
  }();
  return s == null ? !1 : typeof s == "object" && s.constructor === e.constructor;
}
const defaultHandler = (s) => s;
function eventBody(s) {
  let { forObserve: e, callback: r, dom: R, eventName: B, eventHandler: _, state: $, queued: F } = s, V = { queue: [] }, H, W;
  typeof R == "string" ? W = document.querySelector(R) : W = R;
  const U = (z) => {
    V.queue.push({ value: z, time: 0 });
  };
  return W && !e && B && (_ ? H = (z) => {
    const K = _(z);
    K !== void 0 && (V.queue.push({ value: K, time: 0 }), $.noTicking && $.noTickingEvaluator());
  } : H = defaultHandler, H && W.addEventListener(B, H), _ === null && W.removeEventListener(B, H)), e && r && (V.cleanup = r(U)), !e && R && (V.cleanup = () => {
    W && B && H && W.removeEventListener(B, H);
  }), new UserEvent(V, F);
}
class Events {
  constructor(e) {
    __publicField(this, "programState"), this.programState = e;
  }
  static create(e) {
    return new Events(e);
  }
  listener(e, r, R, B) {
    return eventBody({ type: eventType, forObserve: !1, dom: e, eventName: r, eventHandler: R, state: this.programState, queued: !!(B != null && B.queued) });
  }
  delay(e, r) {
    return new DelayedEvent(r, e, !1);
  }
  timer(e) {
    return new TimerEvent(e, !1);
  }
  change(e) {
    return new ChangeEvent(e);
  }
  next(e) {
    return new GeneratorNextEvent(e);
  }
  or(...e) {
    return new OrEvent(e);
  }
  collect(e, r, R) {
    return new CollectStream(e, r, R, !1);
  }
  /*map<S, T>(varName:VarName, updater: (arg:S) => T) {
      return new CollectStream(undefined, varName, (_a, b) => updater(b), false);
  },*/
  send(e, r) {
    return this.programState.registerEvent(e, r), new SendEvent();
  }
  receiver() {
    return new ReceiverEvent(void 0);
  }
  observe(e, r) {
    return eventBody({ type: eventType, forObserve: !0, callback: e, state: this.programState, queued: r == null ? void 0 : r.queued });
  }
  message(e, r, R) {
    const B = window.top !== window, _ = { event: `renkon:${e}`, data: r };
    if (B) {
      window.top.postMessage(_, "*");
      return;
    }
    R && R.postMessage(_, "*");
  }
  resolvePart(e, r) {
    return new ResolvePart(e, r, !1);
  }
}
class Behaviors {
  constructor(e) {
    __publicField(this, "programState"), this.programState = e;
  }
  static create(e) {
    return new Behaviors(e);
  }
  keep(e) {
    return e;
  }
  collect(e, r, R) {
    return new CollectStream(e, r, R, !0);
  }
  timer(e) {
    return new TimerEvent(e, !0);
  }
  delay(e, r) {
    return new DelayedEvent(r, e, !0);
  }
  resolvePart(e, r) {
    return new ResolvePart(e, r, !0);
  }
  /*
  startsWith(init:any, varName:VarName) {
      return new CollectStream(init, varName, (_old, v) => v, true);
  }*/
}
function topologicalSort(s) {
  let e = [], r = s.map(($) => ({
    id: $.id,
    inputs: [...$.inputs].filter((F) => F[0] !== "$"),
    outputs: $.outputs
  }));
  function R($, F) {
    return F.inputs.includes($.outputs);
  }
  function B($, F) {
    let V = [];
    F.inputs.indexOf($.outputs) >= 0 && V.push($.outputs), F.inputs = F.inputs.filter((W) => !V.includes(W));
  }
  const _ = r.filter(($) => $.inputs.length === 0);
  for (; _[0]; ) {
    let $ = _[0];
    _.shift(), e.push($.id);
    let F = r.filter((V) => R($, V));
    for (let V of F)
      B($, V), V.inputs.length === 0 && _.push(V);
  }
  return e;
}
function invalidatedInput(s, e) {
  for (const r of s.inputs)
    if (e.has(r))
      return !0;
  return !1;
}
function difference(s, e) {
  const r = /* @__PURE__ */ new Set();
  for (const R of s)
    e.has(R) || r.add(R);
  return r;
}
class ProgramState {
  constructor(s, e, r) {
    __publicField(this, "scripts"), __publicField(this, "order"), __publicField(this, "nodes"), __publicField(this, "streams"), __publicField(this, "scratch"), __publicField(this, "resolved"), __publicField(this, "inputArray"), __publicField(this, "changeList"), __publicField(this, "time"), __publicField(this, "startTime"), __publicField(this, "evaluatorRunning"), __publicField(this, "exports"), __publicField(this, "imports"), __publicField(this, "updated"), __publicField(this, "app"), __publicField(this, "noTicking"), this.scripts = [], this.order = [], this.nodes = /* @__PURE__ */ new Map(), this.streams = /* @__PURE__ */ new Map(), this.scratch = /* @__PURE__ */ new Map(), this.resolved = /* @__PURE__ */ new Map(), this.inputArray = /* @__PURE__ */ new Map(), this.time = 0, this.changeList = /* @__PURE__ */ new Map(), this.startTime = s, this.evaluatorRunning = 0, this.updated = !1, this.app = e, this.noTicking = r !== void 0 ? r : !1;
  }
  evaluator() {
    if (this.noTicking)
      return this.noTickingEvaluator();
    this.evaluatorRunning = window.requestAnimationFrame(() => this.evaluator());
    try {
      this.evaluate(Date.now());
    } catch (s) {
      console.error(s), console.log("stopping animation"), window.cancelAnimationFrame(this.evaluatorRunning), this.evaluatorRunning = 0;
    }
  }
  noTickingEvaluator() {
    this.noTicking = !0, this.evaluatorRunning === 0 && (this.evaluatorRunning = setTimeout(() => {
      try {
        this.evaluate(Date.now());
      } finally {
        this.evaluatorRunning = 0;
      }
    }, 0));
  }
  setupProgram(s) {
    const e = /* @__PURE__ */ new Set();
    for (const [z, K] of this.streams)
      if (!K[isBehaviorKey]) {
        const X = this.scratch.get(z);
        X != null && X.cleanup && typeof X.cleanup == "function" && (X.cleanup(), X.cleanup = void 0), this.resolved.delete(z), this.streams.delete(z), this.inputArray.delete(z), e.add(z);
      }
    for (const [z, K] of this.nodes)
      K.inputs.includes("render") && this.inputArray.delete(z);
    const r = [];
    let R = 0;
    for (const z of s) {
      if (!z)
        continue;
      const K = parseJavaScript(z, R, !1);
      for (const X of K)
        r.push(X), R++;
    }
    const _ = r.map((z) => ({ id: z.id, code: transpileJavaScript(z) })).map((z) => this.evalCode(z)), $ = topologicalSort(_), F = /* @__PURE__ */ new Map();
    for (const z of _)
      F.set(z.id, z);
    const V = difference(new Set(_.map((z) => z.id)), new Set($));
    for (const z of V)
      console.log(`Node ${z} is not going to be evaluated because it is in a cycle or depends on a undefined variable.`);
    const H = new Set(this.order), W = new Set($), U = difference(H, W);
    for (const z of this.order) {
      const K = this.nodes.get(z), X = F.get(z);
      X && K && K.code !== X.code && e.add(z);
    }
    this.order = $, this.nodes = F, this.scripts = s;
    for (const z of this.order) {
      const K = F.get(z);
      invalidatedInput(K, e) && this.inputArray.delete(K.id), e.has(z) && (this.resolved.delete(z), this.scratch.delete(z), this.inputArray.delete(z));
    }
    for (const z of U)
      this.streams.get(z) && (this.resolved.delete(z), this.streams.delete(z), this.scratch.delete(z));
    for (const [z, K] of this.nodes) {
      const X = [...this.nodes].map(([Z, Y]) => Z);
      for (const Z of K.inputs)
        X.includes(this.baseVarName(Z)) || console.log(`Node ${z} won't be evaluated as it depends on an undefined variable ${Z}.`);
    }
  }
  evaluate(s) {
    this.time = s - this.startTime, this.updated = !1;
    for (let e of this.order) {
      const r = this.nodes.get(e);
      if (!this.ready(r))
        continue;
      const R = this.changeList.get(e), B = r.inputs.map((V) => {
        var H;
        return (H = this.resolved.get(this.baseVarName(V))) == null ? void 0 : H.value;
      }), _ = this.inputArray.get(e);
      let $;
      if (R === void 0 && this.equals(B, _))
        $ = this.streams.get(e);
      else {
        R === void 0 ? $ = r.body.apply(
          this,
          [...B, this]
        ) : (this.changeList.delete(e), $ = new ReceiverEvent(R)), this.inputArray.set(e, B);
        const V = $;
        if (V !== void 0 && (V.then || V[typeKey])) {
          const W = (V.then ? new PromiseEvent(V) : V).created(this, e);
          this.streams.set(e, W), $ = W;
        } else {
          let H = new Behavior();
          if (this.streams.set(e, H), V === void 0)
            continue;
          const W = this.resolved.get(e);
          (!W || W.value !== V) && (isGenerator(V) && (V.done = !1), this.setResolved(e, { value: V, time: this.time })), $ = H;
        }
      }
      if ($ === void 0)
        continue;
      $.evaluate(this, r, B, _);
    }
    for (let e of this.order) {
      const r = this.streams.get(e);
      r && r.conclude(this, e);
    }
    return this.updated;
  }
  evalCode(s) {
    const { id: e, code: r } = s, R = typeof window < "u";
    let B;
    R ? B = `return ${r} //# sourceURL=${window.location.origin}/node/${e}` : B = `return ${r} //# sourceURL=/node/${e}`;
    let $ = new Function("Events", "Behaviors", "Renkon", B)(Events, Behaviors, this);
    return $.code = r, $;
  }
  ready(s) {
    const e = s.outputs, r = this.streams.get(e);
    return r ? r.ready(s, this) : this.defaultReady(s);
  }
  defaultReady(s) {
    var e;
    for (const r of s.inputs) {
      const R = this.baseVarName(r);
      if (((e = this.resolved.get(R)) == null ? void 0 : e.value) === void 0 && !s.forceVars.includes(r))
        return !1;
    }
    return !0;
  }
  equals(s, e) {
    if (!Array.isArray(s) || !Array.isArray(e) || s.length !== e.length)
      return !1;
    for (let r = 0; r < s.length; r++)
      if (s[r] !== e[r])
        return !1;
    return !0;
  }
  spliceDelayedQueued(s, e) {
    let r = -1;
    for (let _ = 0; _ < s.queue.length && !(s.queue[_].time >= e); _++)
      r = _;
    if (r < 0)
      return;
    const R = s.queue[r].value, B = s.queue.slice(r + 1);
    return s.queue = B, R;
  }
  getEventValue(s, e) {
    if (s.queue.length >= 1) {
      const r = s.queue[s.queue.length - 1].value;
      return s.queue = [], r;
    }
  }
  getEventValues(s, e) {
    if (s.queue.length >= 1) {
      const r = s.queue.map((R) => R.value);
      return s.queue = [], r;
    }
  }
  baseVarName(s) {
    return s[0] !== "$" ? s : s.slice(1);
  }
  registerEvent(s, e) {
    this.changeList.set(s, e), this.noTicking && this.noTickingEvaluator();
  }
  setResolved(s, e) {
    this.resolved.set(s, e), this.updated = !0, this.noTicking && this.noTickingEvaluator();
  }
  setResolvedForSubgraph(s, e) {
    this.setResolved(s, e), this.inputArray.set(s, []), this.streams.set(s, new Behavior());
  }
  merge(...s) {
    let e = this.scripts;
    const r = [];
    s.forEach((R) => {
      const { output: B } = getFunctionBody(R.toString(), !0);
      r.push(B);
    }), this.setupProgram([...e, ...r]);
  }
  loadTS(path) {
    let i = 0;
    return fetch(path).then((s) => s.text()).then((text) => {
      const js = translateTS(text, `${i}.ts`);
      if (!js)
        return null;
      let dataURL = URL.createObjectURL(new Blob([js], { type: "application/javascript" }));
      return eval(`import("${dataURL}")`).then((s) => s).finally(() => {
        URL.revokeObjectURL(dataURL);
      });
    });
  }
  renkonify(s, e) {
    const r = new ProgramState(0, e), { params: R, returnArray: B, output: _ } = getFunctionBody(s.toString(), !1), $ = this, F = R.map((W) => `const ${W} = undefined;`).join(`
`);
    r.setupProgram([F, _]);
    function V(W) {
      const U = H(W);
      return U.done = !1, Events.create($).next(U);
    }
    async function* H(W) {
      let U;
      for (let z in W)
        r.setResolvedForSubgraph(
          z,
          { value: W[z], time: $.time }
        );
      for (; ; ) {
        r.evaluate($.time);
        const z = {}, K = [];
        if (B)
          for (const X of B) {
            const Z = r.resolved.get(X);
            K.push(Z ? Z.value : void 0), Z && Z.value !== void 0 && (z[X] = Z.value);
          }
        yield $.equals(U, K) ? void 0 : z, U = K;
      }
    }
    return V;
  }
  renkonify2(s, e) {
    const r = new ProgramState(0, e), { params: R, returnArray: B, output: _ } = getFunctionBody(s.toString(), !1), $ = R.map((F) => `const ${F} = undefined;`).join(`
`);
    return r.setupProgram([$, _]), r.exports = B || void 0, r.imports = R, r;
  }
  evaluateSubProgram(s, e) {
    for (let R in e)
      s.registerEvent(R, e[R]);
    if (s.evaluate(this.time), !s.updated)
      return;
    const r = {};
    if (s.exports)
      for (const R of s.exports) {
        const B = s.resolved.get(R);
        B && B.value !== void 0 && (r[R] = B.value);
      }
    return r;
  }
  spaceURL(s) {
    if (/^http(s)?:\/\//.test(s))
      return s;
    if (s.startsWith("/")) {
      const e = new UR(window.location), r = e.searchParams.get("host") || e.host;
      return `${e.protocol}//${r}}${s}`;
    }
    return s;
  }
  /*
    inspector(flag:boolean, dom?: HTMLElement) {
      showInspector(this, flag === undefined ? true: flag, dom);
      }
  */
}
function transpileJSX(s) {
  const e = parseJSX(s), r = rewriteJSX(e.body[0], s);
  return typeof r == "string" ? r : r.flat(1 / 0).join("");
}
function rewriteJSX(s, e) {
  function r(R) {
    if (R.type === "JSXElement") {
      const B = [], _ = r(R.openingElement), $ = R.children.map((F) => r(F));
      if (B.push("h("), B.push(..._), $.length > 0) {
        const F = [$[0]];
        for (let V = 1; V < $.length; V++)
          F.push(", "), F.push($[V]);
        B.push(", "), B.push(F);
      }
      return B.push(")"), B;
    } else {
      if (R.type === "JSXExpressionContainer")
        return r(R.expression);
      if (R.type === "JSXSpreadChild")
        return "";
      if (R.type === "JSXClosingFragment")
        return R.name;
      if (R.type === "JSXEmptyExpression")
        return "";
      if (R.type === "JSXIdentifier")
        return R.name;
      if (R.type === "JSXOpeningFragment")
        return R.name;
      if (R.type === "JSXText")
        return `"${R.value}"`;
      if (R.type === "JSXSpreadAttribute")
        return "";
      if (R.type === "JSXAttribute")
        return [r(R.name), ": ", r(R.value)];
      if (R.type === "JSXMemberExpression")
        return "";
      if (R.type === "JSXNamespacedName")
        return "";
      if (R.type === "JSXOpeningElement") {
        const B = r(R.name), _ = R.attributes.map((F) => r(F)), $ = [];
        if (_.length > 0)
          for (let F = 0; F < _.length; F++)
            F !== 0 && $.push(", "), $.push(_[F]);
        return [`"${B}"`, ", ", "{", ...$, "}"];
      } else {
        if (R.type === "JSXClosingElement")
          return "";
        if (R.type === "JSXFragment")
          return "";
        if (R.type === "ExpressionStatement")
          return r(R.expression);
        if (R.type === "Identifier")
          return R.name;
        if (R.type === "Literal")
          return R.raw;
      }
    }
    return e.slice(R.start, R.end);
  }
  return r(s);
}
let rangeFrom = [], rangeTo = [];
(() => {
  let s = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((e) => e ? parseInt(e, 36) : 1);
  for (let e = 0, r = 0; e < s.length; e++)
    (e % 2 ? rangeTo : rangeFrom).push(r = r + s[e]);
})();
function isExtendingChar(s) {
  if (s < 768) return !1;
  for (let e = 0, r = rangeFrom.length; ; ) {
    let R = e + r >> 1;
    if (s < rangeFrom[R]) r = R;
    else if (s >= rangeTo[R]) e = R + 1;
    else return !0;
    if (e == r) return !1;
  }
}
function isRegionalIndicator(s) {
  return s >= 127462 && s <= 127487;
}
const ZWJ = 8205;
function findClusterBreak$1(s, e, r = !0, R = !0) {
  return (r ? nextClusterBreak : prevClusterBreak)(s, e, R);
}
function nextClusterBreak(s, e, r) {
  if (e == s.length) return e;
  e && surrogateLow$1(s.charCodeAt(e)) && surrogateHigh$1(s.charCodeAt(e - 1)) && e--;
  let R = codePointAt$1(s, e);
  for (e += codePointSize$1(R); e < s.length; ) {
    let B = codePointAt$1(s, e);
    if (R == ZWJ || B == ZWJ || r && isExtendingChar(B))
      e += codePointSize$1(B), R = B;
    else if (isRegionalIndicator(B)) {
      let _ = 0, $ = e - 2;
      for (; $ >= 0 && isRegionalIndicator(codePointAt$1(s, $)); )
        _++, $ -= 2;
      if (_ % 2 == 0) break;
      e += 2;
    } else
      break;
  }
  return e;
}
function prevClusterBreak(s, e, r) {
  for (; e > 0; ) {
    let R = nextClusterBreak(s, e - 2, r);
    if (R < e) return R;
    e--;
  }
  return 0;
}
function codePointAt$1(s, e) {
  let r = s.charCodeAt(e);
  if (!surrogateHigh$1(r) || e + 1 == s.length) return r;
  let R = s.charCodeAt(e + 1);
  return surrogateLow$1(R) ? (r - 55296 << 10) + (R - 56320) + 65536 : r;
}
function surrogateLow$1(s) {
  return s >= 56320 && s < 57344;
}
function surrogateHigh$1(s) {
  return s >= 55296 && s < 56320;
}
function codePointSize$1(s) {
  return s < 65536 ? 1 : 2;
}
let Text$1 = class Ue {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, r, R) {
    [e, r] = clip(this, e, r);
    let B = [];
    return this.decompose(
      0,
      e,
      B,
      2
      /* Open.To */
    ), R.length && R.decompose(
      0,
      R.length,
      B,
      3
      /* Open.To */
    ), this.decompose(
      r,
      this.length,
      B,
      1
      /* Open.From */
    ), TextNode.from(B, this.length - (r - e) + R.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, r = this.length) {
    [e, r] = clip(this, e, r);
    let R = [];
    return this.decompose(e, r, R, 0), TextNode.from(R, r - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let r = this.scanIdentical(e, 1), R = this.length - this.scanIdentical(e, -1), B = new RawTextCursor(this), _ = new RawTextCursor(e);
    for (let $ = r, F = r; ; ) {
      if (B.next($), _.next($), $ = 0, B.lineBreak != _.lineBreak || B.done != _.done || B.value != _.value)
        return !1;
      if (F += B.value.length, B.done || F >= R)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new RawTextCursor(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, r = this.length) {
    return new PartialTextCursor(this, e, r);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, r) {
    let R;
    if (e == null)
      R = this.iter();
    else {
      r == null && (r = this.lines + 1);
      let B = this.line(e).from;
      R = this.iterRange(B, Math.max(B, r == this.lines + 1 ? this.length : r <= 1 ? 0 : this.line(r - 1).to));
    }
    return new LineCursor(R);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? Ue.empty : e.length <= 32 ? new TextLeaf(e) : TextNode.from(TextLeaf.split(e, []));
  }
};
class TextLeaf extends Text$1 {
  constructor(e, r = textLength(e)) {
    super(), this.text = e, this.length = r;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, r, R, B) {
    for (let _ = 0; ; _++) {
      let $ = this.text[_], F = B + $.length;
      if ((r ? R : F) >= e)
        return new Line(B, F, R, $);
      B = F + 1, R++;
    }
  }
  decompose(e, r, R, B) {
    let _ = e <= 0 && r >= this.length ? this : new TextLeaf(sliceText(this.text, e, r), Math.min(r, this.length) - Math.max(0, e));
    if (B & 1) {
      let $ = R.pop(), F = appendText(_.text, $.text.slice(), 0, _.length);
      if (F.length <= 32)
        R.push(new TextLeaf(F, $.length + _.length));
      else {
        let V = F.length >> 1;
        R.push(new TextLeaf(F.slice(0, V)), new TextLeaf(F.slice(V)));
      }
    } else
      R.push(_);
  }
  replace(e, r, R) {
    if (!(R instanceof TextLeaf))
      return super.replace(e, r, R);
    [e, r] = clip(this, e, r);
    let B = appendText(this.text, appendText(R.text, sliceText(this.text, 0, e)), r), _ = this.length + R.length - (r - e);
    return B.length <= 32 ? new TextLeaf(B, _) : TextNode.from(TextLeaf.split(B, []), _);
  }
  sliceString(e, r = this.length, R = `
`) {
    [e, r] = clip(this, e, r);
    let B = "";
    for (let _ = 0, $ = 0; _ <= r && $ < this.text.length; $++) {
      let F = this.text[$], V = _ + F.length;
      _ > e && $ && (B += R), e < V && r > _ && (B += F.slice(Math.max(0, e - _), r - _)), _ = V + 1;
    }
    return B;
  }
  flatten(e) {
    for (let r of this.text)
      e.push(r);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, r) {
    let R = [], B = -1;
    for (let _ of e)
      R.push(_), B += _.length + 1, R.length == 32 && (r.push(new TextLeaf(R, B)), R = [], B = -1);
    return B > -1 && r.push(new TextLeaf(R, B)), r;
  }
}
class TextNode extends Text$1 {
  constructor(e, r) {
    super(), this.children = e, this.length = r, this.lines = 0;
    for (let R of e)
      this.lines += R.lines;
  }
  lineInner(e, r, R, B) {
    for (let _ = 0; ; _++) {
      let $ = this.children[_], F = B + $.length, V = R + $.lines - 1;
      if ((r ? V : F) >= e)
        return $.lineInner(e, r, R, B);
      B = F + 1, R = V + 1;
    }
  }
  decompose(e, r, R, B) {
    for (let _ = 0, $ = 0; $ <= r && _ < this.children.length; _++) {
      let F = this.children[_], V = $ + F.length;
      if (e <= V && r >= $) {
        let H = B & (($ <= e ? 1 : 0) | (V >= r ? 2 : 0));
        $ >= e && V <= r && !H ? R.push(F) : F.decompose(e - $, r - $, R, H);
      }
      $ = V + 1;
    }
  }
  replace(e, r, R) {
    if ([e, r] = clip(this, e, r), R.lines < this.lines)
      for (let B = 0, _ = 0; B < this.children.length; B++) {
        let $ = this.children[B], F = _ + $.length;
        if (e >= _ && r <= F) {
          let V = $.replace(e - _, r - _, R), H = this.lines - $.lines + V.lines;
          if (V.lines < H >> 4 && V.lines > H >> 6) {
            let W = this.children.slice();
            return W[B] = V, new TextNode(W, this.length - (r - e) + R.length);
          }
          return super.replace(_, F, V);
        }
        _ = F + 1;
      }
    return super.replace(e, r, R);
  }
  sliceString(e, r = this.length, R = `
`) {
    [e, r] = clip(this, e, r);
    let B = "";
    for (let _ = 0, $ = 0; _ < this.children.length && $ <= r; _++) {
      let F = this.children[_], V = $ + F.length;
      $ > e && _ && (B += R), e < V && r > $ && (B += F.sliceString(e - $, r - $, R)), $ = V + 1;
    }
    return B;
  }
  flatten(e) {
    for (let r of this.children)
      r.flatten(e);
  }
  scanIdentical(e, r) {
    if (!(e instanceof TextNode))
      return 0;
    let R = 0, [B, _, $, F] = r > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; B += r, _ += r) {
      if (B == $ || _ == F)
        return R;
      let V = this.children[B], H = e.children[_];
      if (V != H)
        return R + V.scanIdentical(H, r);
      R += V.length + 1;
    }
  }
  static from(e, r = e.reduce((R, B) => R + B.length + 1, -1)) {
    let R = 0;
    for (let K of e)
      R += K.lines;
    if (R < 32) {
      let K = [];
      for (let X of e)
        X.flatten(K);
      return new TextLeaf(K, r);
    }
    let B = Math.max(
      32,
      R >> 5
      /* Tree.BranchShift */
    ), _ = B << 1, $ = B >> 1, F = [], V = 0, H = -1, W = [];
    function U(K) {
      let X;
      if (K.lines > _ && K instanceof TextNode)
        for (let Z of K.children)
          U(Z);
      else K.lines > $ && (V > $ || !V) ? (z(), F.push(K)) : K instanceof TextLeaf && V && (X = W[W.length - 1]) instanceof TextLeaf && K.lines + X.lines <= 32 ? (V += K.lines, H += K.length + 1, W[W.length - 1] = new TextLeaf(X.text.concat(K.text), X.length + 1 + K.length)) : (V + K.lines > B && z(), V += K.lines, H += K.length + 1, W.push(K));
    }
    function z() {
      V != 0 && (F.push(W.length == 1 ? W[0] : TextNode.from(W, H)), H = -1, V = W.length = 0);
    }
    for (let K of e)
      U(K);
    return z(), F.length == 1 ? F[0] : new TextNode(F, r);
  }
}
Text$1.empty = /* @__PURE__ */ new TextLeaf([""], 0);
function textLength(s) {
  let e = -1;
  for (let r of s)
    e += r.length + 1;
  return e;
}
function appendText(s, e, r = 0, R = 1e9) {
  for (let B = 0, _ = 0, $ = !0; _ < s.length && B <= R; _++) {
    let F = s[_], V = B + F.length;
    V >= r && (V > R && (F = F.slice(0, R - B)), B < r && (F = F.slice(r - B)), $ ? (e[e.length - 1] += F, $ = !1) : e.push(F)), B = V + 1;
  }
  return e;
}
function sliceText(s, e, r) {
  return appendText(s, [""], e, r);
}
class RawTextCursor {
  constructor(e, r = 1) {
    this.dir = r, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [r > 0 ? 1 : (e instanceof TextLeaf ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, r) {
    for (this.done = this.lineBreak = !1; ; ) {
      let R = this.nodes.length - 1, B = this.nodes[R], _ = this.offsets[R], $ = _ >> 1, F = B instanceof TextLeaf ? B.text.length : B.children.length;
      if ($ == (r > 0 ? F : 0)) {
        if (R == 0)
          return this.done = !0, this.value = "", this;
        r > 0 && this.offsets[R - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((_ & 1) == (r > 0 ? 0 : 1)) {
        if (this.offsets[R] += r, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (B instanceof TextLeaf) {
        let V = B.text[$ + (r < 0 ? -1 : 0)];
        if (this.offsets[R] += r, V.length > Math.max(0, e))
          return this.value = e == 0 ? V : r > 0 ? V.slice(e) : V.slice(0, V.length - e), this;
        e -= V.length;
      } else {
        let V = B.children[$ + (r < 0 ? -1 : 0)];
        e > V.length ? (e -= V.length, this.offsets[R] += r) : (r < 0 && this.offsets[R]--, this.nodes.push(V), this.offsets.push(r > 0 ? 1 : (V instanceof TextLeaf ? V.text.length : V.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class PartialTextCursor {
  constructor(e, r, R) {
    this.value = "", this.done = !1, this.cursor = new RawTextCursor(e, r > R ? -1 : 1), this.pos = r > R ? e.length : 0, this.from = Math.min(r, R), this.to = Math.max(r, R);
  }
  nextInner(e, r) {
    if (r < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, r < 0 ? this.pos - this.to : this.from - this.pos);
    let R = r < 0 ? this.pos - this.from : this.to - this.pos;
    e > R && (e = R), R -= e;
    let { value: B } = this.cursor.next(e);
    return this.pos += (B.length + e) * r, this.value = B.length <= R ? B : r < 0 ? B.slice(B.length - R) : B.slice(0, R), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class LineCursor {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: r, lineBreak: R, value: B } = this.inner.next(e);
    return r && this.afterBreak ? (this.value = "", this.afterBreak = !1) : r ? (this.done = !0, this.value = "") : R ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = B, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (Text$1.prototype[Symbol.iterator] = function() {
  return this.iter();
}, RawTextCursor.prototype[Symbol.iterator] = PartialTextCursor.prototype[Symbol.iterator] = LineCursor.prototype[Symbol.iterator] = function() {
  return this;
});
class Line {
  /**
  @internal
  */
  constructor(e, r, R, B) {
    this.from = e, this.to = r, this.number = R, this.text = B;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function clip(s, e, r) {
  return e = Math.max(0, Math.min(s.length, e)), [e, Math.max(e, Math.min(s.length, r))];
}
function findClusterBreak(s, e, r = !0, R = !0) {
  return findClusterBreak$1(s, e, r, R);
}
function surrogateLow(s) {
  return s >= 56320 && s < 57344;
}
function surrogateHigh(s) {
  return s >= 55296 && s < 56320;
}
function codePointAt(s, e) {
  let r = s.charCodeAt(e);
  if (!surrogateHigh(r) || e + 1 == s.length)
    return r;
  let R = s.charCodeAt(e + 1);
  return surrogateLow(R) ? (r - 55296 << 10) + (R - 56320) + 65536 : r;
}
function fromCodePoint(s) {
  return s <= 65535 ? String.fromCharCode(s) : (s -= 65536, String.fromCharCode((s >> 10) + 55296, (s & 1023) + 56320));
}
function codePointSize(s) {
  return s < 65536 ? 1 : 2;
}
const DefaultSplit = /\r\n?|\n/;
var MapMode = /* @__PURE__ */ function(s) {
  return s[s.Simple = 0] = "Simple", s[s.TrackDel = 1] = "TrackDel", s[s.TrackBefore = 2] = "TrackBefore", s[s.TrackAfter = 3] = "TrackAfter", s;
}(MapMode || (MapMode = {}));
class ChangeDesc {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let r = 0; r < this.sections.length; r += 2)
      e += this.sections[r];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let r = 0; r < this.sections.length; r += 2) {
      let R = this.sections[r + 1];
      e += R < 0 ? this.sections[r] : R;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let r = 0, R = 0, B = 0; r < this.sections.length; ) {
      let _ = this.sections[r++], $ = this.sections[r++];
      $ < 0 ? (e(R, B, _), B += _) : B += $, R += _;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, r = !1) {
    iterChanges(this, e, r);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let r = 0; r < this.sections.length; ) {
      let R = this.sections[r++], B = this.sections[r++];
      B < 0 ? e.push(R, B) : e.push(B, R);
    }
    return new ChangeDesc(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : composeSets(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `this` happened before the ones in `other`.
  */
  mapDesc(e, r = !1) {
    return e.empty ? this : mapSet(this, e, r);
  }
  mapPos(e, r = -1, R = MapMode.Simple) {
    let B = 0, _ = 0;
    for (let $ = 0; $ < this.sections.length; ) {
      let F = this.sections[$++], V = this.sections[$++], H = B + F;
      if (V < 0) {
        if (H > e)
          return _ + (e - B);
        _ += F;
      } else {
        if (R != MapMode.Simple && H >= e && (R == MapMode.TrackDel && B < e && H > e || R == MapMode.TrackBefore && B < e || R == MapMode.TrackAfter && H > e))
          return null;
        if (H > e || H == e && r < 0 && !F)
          return e == B || r < 0 ? _ : _ + V;
        _ += V;
      }
      B = H;
    }
    if (e > B)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${B}`);
    return _;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, r = e) {
    for (let R = 0, B = 0; R < this.sections.length && B <= r; ) {
      let _ = this.sections[R++], $ = this.sections[R++], F = B + _;
      if ($ >= 0 && B <= r && F >= e)
        return B < e && F > r ? "cover" : !0;
      B = F;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let r = 0; r < this.sections.length; ) {
      let R = this.sections[r++], B = this.sections[r++];
      e += (e ? " " : "") + R + (B >= 0 ? ":" + B : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((r) => typeof r != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new ChangeDesc(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new ChangeDesc(e);
  }
}
class ChangeSet extends ChangeDesc {
  constructor(e, r) {
    super(e), this.inserted = r;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return iterChanges(this, (r, R, B, _, $) => e = e.replace(B, B + (R - r), $), !1), e;
  }
  mapDesc(e, r = !1) {
    return mapSet(this, e, r, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let r = this.sections.slice(), R = [];
    for (let B = 0, _ = 0; B < r.length; B += 2) {
      let $ = r[B], F = r[B + 1];
      if (F >= 0) {
        r[B] = F, r[B + 1] = $;
        let V = B >> 1;
        for (; R.length < V; )
          R.push(Text$1.empty);
        R.push($ ? e.slice(_, _ + $) : Text$1.empty);
      }
      _ += $;
    }
    return new ChangeSet(r, R);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : composeSets(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, r = !1) {
    return e.empty ? this : mapSet(this, e, r, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, r = !1) {
    iterChanges(this, e, r);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return ChangeDesc.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let r = [], R = [], B = [], _ = new SectionIter(this);
    e: for (let $ = 0, F = 0; ; ) {
      let V = $ == e.length ? 1e9 : e[$++];
      for (; F < V || F == V && _.len == 0; ) {
        if (_.done)
          break e;
        let W = Math.min(_.len, V - F);
        addSection(B, W, -1);
        let U = _.ins == -1 ? -1 : _.off == 0 ? _.ins : 0;
        addSection(r, W, U), U > 0 && addInsert(R, r, _.text), _.forward(W), F += W;
      }
      let H = e[$++];
      for (; F < H; ) {
        if (_.done)
          break e;
        let W = Math.min(_.len, H - F);
        addSection(r, W, -1), addSection(B, W, _.ins == -1 ? -1 : _.off == 0 ? _.ins : 0), _.forward(W), F += W;
      }
    }
    return {
      changes: new ChangeSet(r, R),
      filtered: ChangeDesc.create(B)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let r = 0; r < this.sections.length; r += 2) {
      let R = this.sections[r], B = this.sections[r + 1];
      B < 0 ? e.push(R) : B == 0 ? e.push([R]) : e.push([R].concat(this.inserted[r >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, r, R) {
    let B = [], _ = [], $ = 0, F = null;
    function V(W = !1) {
      if (!W && !B.length)
        return;
      $ < r && addSection(B, r - $, -1);
      let U = new ChangeSet(B, _);
      F = F ? F.compose(U.map(F)) : U, B = [], _ = [], $ = 0;
    }
    function H(W) {
      if (Array.isArray(W))
        for (let U of W)
          H(U);
      else if (W instanceof ChangeSet) {
        if (W.length != r)
          throw new RangeError(`Mismatched change set length (got ${W.length}, expected ${r})`);
        V(), F = F ? F.compose(W.map(F)) : W;
      } else {
        let { from: U, to: z = U, insert: K } = W;
        if (U > z || U < 0 || z > r)
          throw new RangeError(`Invalid change range ${U} to ${z} (in doc of length ${r})`);
        let X = K ? typeof K == "string" ? Text$1.of(K.split(R || DefaultSplit)) : K : Text$1.empty, Z = X.length;
        if (U == z && Z == 0)
          return;
        U < $ && V(), U > $ && addSection(B, U - $, -1), addSection(B, z - U, Z), addInsert(_, B, X), $ = z;
      }
    }
    return H(e), V(!F), F;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new ChangeSet(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let r = [], R = [];
    for (let B = 0; B < e.length; B++) {
      let _ = e[B];
      if (typeof _ == "number")
        r.push(_, -1);
      else {
        if (!Array.isArray(_) || typeof _[0] != "number" || _.some(($, F) => F && typeof $ != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (_.length == 1)
          r.push(_[0], 0);
        else {
          for (; R.length < B; )
            R.push(Text$1.empty);
          R[B] = Text$1.of(_.slice(1)), r.push(_[0], R[B].length);
        }
      }
    }
    return new ChangeSet(r, R);
  }
  /**
  @internal
  */
  static createSet(e, r) {
    return new ChangeSet(e, r);
  }
}
function addSection(s, e, r, R = !1) {
  if (e == 0 && r <= 0)
    return;
  let B = s.length - 2;
  B >= 0 && r <= 0 && r == s[B + 1] ? s[B] += e : B >= 0 && e == 0 && s[B] == 0 ? s[B + 1] += r : R ? (s[B] += e, s[B + 1] += r) : s.push(e, r);
}
function addInsert(s, e, r) {
  if (r.length == 0)
    return;
  let R = e.length - 2 >> 1;
  if (R < s.length)
    s[s.length - 1] = s[s.length - 1].append(r);
  else {
    for (; s.length < R; )
      s.push(Text$1.empty);
    s.push(r);
  }
}
function iterChanges(s, e, r) {
  let R = s.inserted;
  for (let B = 0, _ = 0, $ = 0; $ < s.sections.length; ) {
    let F = s.sections[$++], V = s.sections[$++];
    if (V < 0)
      B += F, _ += F;
    else {
      let H = B, W = _, U = Text$1.empty;
      for (; H += F, W += V, V && R && (U = U.append(R[$ - 2 >> 1])), !(r || $ == s.sections.length || s.sections[$ + 1] < 0); )
        F = s.sections[$++], V = s.sections[$++];
      e(B, H, _, W, U), B = H, _ = W;
    }
  }
}
function mapSet(s, e, r, R = !1) {
  let B = [], _ = R ? [] : null, $ = new SectionIter(s), F = new SectionIter(e);
  for (let V = -1; ; ) {
    if ($.done && F.len || F.done && $.len)
      throw new Error("Mismatched change set lengths");
    if ($.ins == -1 && F.ins == -1) {
      let H = Math.min($.len, F.len);
      addSection(B, H, -1), $.forward(H), F.forward(H);
    } else if (F.ins >= 0 && ($.ins < 0 || V == $.i || $.off == 0 && (F.len < $.len || F.len == $.len && !r))) {
      let H = F.len;
      for (addSection(B, F.ins, -1); H; ) {
        let W = Math.min($.len, H);
        $.ins >= 0 && V < $.i && $.len <= W && (addSection(B, 0, $.ins), _ && addInsert(_, B, $.text), V = $.i), $.forward(W), H -= W;
      }
      F.next();
    } else if ($.ins >= 0) {
      let H = 0, W = $.len;
      for (; W; )
        if (F.ins == -1) {
          let U = Math.min(W, F.len);
          H += U, W -= U, F.forward(U);
        } else if (F.ins == 0 && F.len < W)
          W -= F.len, F.next();
        else
          break;
      addSection(B, H, V < $.i ? $.ins : 0), _ && V < $.i && addInsert(_, B, $.text), V = $.i, $.forward($.len - W);
    } else {
      if ($.done && F.done)
        return _ ? ChangeSet.createSet(B, _) : ChangeDesc.create(B);
      throw new Error("Mismatched change set lengths");
    }
  }
}
function composeSets(s, e, r = !1) {
  let R = [], B = r ? [] : null, _ = new SectionIter(s), $ = new SectionIter(e);
  for (let F = !1; ; ) {
    if (_.done && $.done)
      return B ? ChangeSet.createSet(R, B) : ChangeDesc.create(R);
    if (_.ins == 0)
      addSection(R, _.len, 0, F), _.next();
    else if ($.len == 0 && !$.done)
      addSection(R, 0, $.ins, F), B && addInsert(B, R, $.text), $.next();
    else {
      if (_.done || $.done)
        throw new Error("Mismatched change set lengths");
      {
        let V = Math.min(_.len2, $.len), H = R.length;
        if (_.ins == -1) {
          let W = $.ins == -1 ? -1 : $.off ? 0 : $.ins;
          addSection(R, V, W, F), B && W && addInsert(B, R, $.text);
        } else $.ins == -1 ? (addSection(R, _.off ? 0 : _.len, V, F), B && addInsert(B, R, _.textBit(V))) : (addSection(R, _.off ? 0 : _.len, $.off ? 0 : $.ins, F), B && !$.off && addInsert(B, R, $.text));
        F = (_.ins > V || $.ins >= 0 && $.len > V) && (F || R.length > H), _.forward2(V), $.forward(V);
      }
    }
  }
}
class SectionIter {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, r = this.i - 2 >> 1;
    return r >= e.length ? Text$1.empty : e[r];
  }
  textBit(e) {
    let { inserted: r } = this.set, R = this.i - 2 >> 1;
    return R >= r.length && !e ? Text$1.empty : r[R].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class SelectionRange {
  constructor(e, r, R) {
    this.from = e, this.to = r, this.flags = R;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let e = this.flags >> 6;
    return e == 16777215 ? void 0 : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, r = -1) {
    let R, B;
    return this.empty ? R = B = e.mapPos(this.from, r) : (R = e.mapPos(this.from, 1), B = e.mapPos(this.to, -1)), R == this.from && B == this.to ? this : new SelectionRange(R, B, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, r = e) {
    if (e <= this.anchor && r >= this.anchor)
      return EditorSelection.range(e, r);
    let R = Math.abs(e - this.anchor) > Math.abs(r - this.anchor) ? e : r;
    return EditorSelection.range(this.anchor, R);
  }
  /**
  Compare this range to another range.
  */
  eq(e, r = !1) {
    return this.anchor == e.anchor && this.head == e.head && (!r || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return EditorSelection.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, r, R) {
    return new SelectionRange(e, r, R);
  }
}
class EditorSelection {
  constructor(e, r) {
    this.ranges = e, this.mainIndex = r;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, r = -1) {
    return e.empty ? this : EditorSelection.create(this.ranges.map((R) => R.map(e, r)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, r = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let R = 0; R < this.ranges.length; R++)
      if (!this.ranges[R].eq(e.ranges[R], r))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new EditorSelection([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, r = !0) {
    return EditorSelection.create([e].concat(this.ranges), r ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, r = this.mainIndex) {
    let R = this.ranges.slice();
    return R[r] = e, EditorSelection.create(R, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new EditorSelection(e.ranges.map((r) => SelectionRange.fromJSON(r)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, r = e) {
    return new EditorSelection([EditorSelection.range(e, r)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, r = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let R = 0, B = 0; B < e.length; B++) {
      let _ = e[B];
      if (_.empty ? _.from <= R : _.from < R)
        return EditorSelection.normalized(e.slice(), r);
      R = _.to;
    }
    return new EditorSelection(e, r);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, r = 0, R, B) {
    return SelectionRange.create(e, e, (r == 0 ? 0 : r < 0 ? 8 : 16) | (R == null ? 7 : Math.min(6, R)) | (B ?? 16777215) << 6);
  }
  /**
  Create a selection range.
  */
  static range(e, r, R, B) {
    let _ = (R ?? 16777215) << 6 | (B == null ? 7 : Math.min(6, B));
    return r < e ? SelectionRange.create(r, e, 48 | _) : SelectionRange.create(e, r, (r > e ? 8 : 0) | _);
  }
  /**
  @internal
  */
  static normalized(e, r = 0) {
    let R = e[r];
    e.sort((B, _) => B.from - _.from), r = e.indexOf(R);
    for (let B = 1; B < e.length; B++) {
      let _ = e[B], $ = e[B - 1];
      if (_.empty ? _.from <= $.to : _.from < $.to) {
        let F = $.from, V = Math.max(_.to, $.to);
        B <= r && r--, e.splice(--B, 2, _.anchor > _.head ? EditorSelection.range(V, F) : EditorSelection.range(F, V));
      }
    }
    return new EditorSelection(e, r);
  }
}
function checkSelection(s, e) {
  for (let r of s.ranges)
    if (r.to > e)
      throw new RangeError("Selection points outside of document");
}
let nextID = 0;
class Facet {
  constructor(e, r, R, B, _) {
    this.combine = e, this.compareInput = r, this.compare = R, this.isStatic = B, this.id = nextID++, this.default = e([]), this.extensions = typeof _ == "function" ? _(this) : _;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new Facet(e.combine || ((r) => r), e.compareInput || ((r, R) => r === R), e.compare || (e.combine ? (r, R) => r === R : sameArray$1), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new FacetProvider([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, r) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new FacetProvider(e, this, 1, r);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, r) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new FacetProvider(e, this, 2, r);
  }
  from(e, r) {
    return r || (r = (R) => R), this.compute([e], (R) => r(R.field(e)));
  }
}
function sameArray$1(s, e) {
  return s == e || s.length == e.length && s.every((r, R) => r === e[R]);
}
class FacetProvider {
  constructor(e, r, R, B) {
    this.dependencies = e, this.facet = r, this.type = R, this.value = B, this.id = nextID++;
  }
  dynamicSlot(e) {
    var r;
    let R = this.value, B = this.facet.compareInput, _ = this.id, $ = e[_] >> 1, F = this.type == 2, V = !1, H = !1, W = [];
    for (let U of this.dependencies)
      U == "doc" ? V = !0 : U == "selection" ? H = !0 : ((r = e[U.id]) !== null && r !== void 0 ? r : 1) & 1 || W.push(e[U.id]);
    return {
      create(U) {
        return U.values[$] = R(U), 1;
      },
      update(U, z) {
        if (V && z.docChanged || H && (z.docChanged || z.selection) || ensureAll(U, W)) {
          let K = R(U);
          if (F ? !compareArray(K, U.values[$], B) : !B(K, U.values[$]))
            return U.values[$] = K, 1;
        }
        return 0;
      },
      reconfigure: (U, z) => {
        let K, X = z.config.address[_];
        if (X != null) {
          let Z = getAddr(z, X);
          if (this.dependencies.every((Y) => Y instanceof Facet ? z.facet(Y) === U.facet(Y) : Y instanceof StateField ? z.field(Y, !1) == U.field(Y, !1) : !0) || (F ? compareArray(K = R(U), Z, B) : B(K = R(U), Z)))
            return U.values[$] = Z, 0;
        } else
          K = R(U);
        return U.values[$] = K, 1;
      }
    };
  }
}
function compareArray(s, e, r) {
  if (s.length != e.length)
    return !1;
  for (let R = 0; R < s.length; R++)
    if (!r(s[R], e[R]))
      return !1;
  return !0;
}
function ensureAll(s, e) {
  let r = !1;
  for (let R of e)
    ensureAddr(s, R) & 1 && (r = !0);
  return r;
}
function dynamicFacetSlot(s, e, r) {
  let R = r.map((V) => s[V.id]), B = r.map((V) => V.type), _ = R.filter((V) => !(V & 1)), $ = s[e.id] >> 1;
  function F(V) {
    let H = [];
    for (let W = 0; W < R.length; W++) {
      let U = getAddr(V, R[W]);
      if (B[W] == 2)
        for (let z of U)
          H.push(z);
      else
        H.push(U);
    }
    return e.combine(H);
  }
  return {
    create(V) {
      for (let H of R)
        ensureAddr(V, H);
      return V.values[$] = F(V), 1;
    },
    update(V, H) {
      if (!ensureAll(V, _))
        return 0;
      let W = F(V);
      return e.compare(W, V.values[$]) ? 0 : (V.values[$] = W, 1);
    },
    reconfigure(V, H) {
      let W = ensureAll(V, R), U = H.config.facets[e.id], z = H.facet(e);
      if (U && !W && sameArray$1(r, U))
        return V.values[$] = z, 0;
      let K = F(V);
      return e.compare(K, z) ? (V.values[$] = z, 0) : (V.values[$] = K, 1);
    }
  };
}
const initField = /* @__PURE__ */ Facet.define({ static: !0 });
class StateField {
  constructor(e, r, R, B, _) {
    this.id = e, this.createF = r, this.updateF = R, this.compareF = B, this.spec = _, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let r = new StateField(nextID++, e.create, e.update, e.compare || ((R, B) => R === B), e);
    return e.provide && (r.provides = e.provide(r)), r;
  }
  create(e) {
    let r = e.facet(initField).find((R) => R.field == this);
    return ((r == null ? void 0 : r.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let r = e[this.id] >> 1;
    return {
      create: (R) => (R.values[r] = this.create(R), 1),
      update: (R, B) => {
        let _ = R.values[r], $ = this.updateF(_, B);
        return this.compareF(_, $) ? 0 : (R.values[r] = $, 1);
      },
      reconfigure: (R, B) => B.config.address[this.id] != null ? (R.values[r] = B.field(this), 0) : (R.values[r] = this.create(R), 1)
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, initField.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const Prec_ = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function prec(s) {
  return (e) => new PrecExtension(e, s);
}
const Prec = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ prec(Prec_.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ prec(Prec_.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ prec(Prec_.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ prec(Prec_.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ prec(Prec_.lowest)
};
class PrecExtension {
  constructor(e, r) {
    this.inner = e, this.prec = r;
  }
}
class Compartment {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new CompartmentInstance(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return Compartment.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class CompartmentInstance {
  constructor(e, r) {
    this.compartment = e, this.inner = r;
  }
}
class Configuration {
  constructor(e, r, R, B, _, $) {
    for (this.base = e, this.compartments = r, this.dynamicSlots = R, this.address = B, this.staticValues = _, this.facets = $, this.statusTemplate = []; this.statusTemplate.length < R.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let r = this.address[e.id];
    return r == null ? e.default : this.staticValues[r >> 1];
  }
  static resolve(e, r, R) {
    let B = [], _ = /* @__PURE__ */ Object.create(null), $ = /* @__PURE__ */ new Map();
    for (let z of flatten(e, r, $))
      z instanceof StateField ? B.push(z) : (_[z.facet.id] || (_[z.facet.id] = [])).push(z);
    let F = /* @__PURE__ */ Object.create(null), V = [], H = [];
    for (let z of B)
      F[z.id] = H.length << 1, H.push((K) => z.slot(K));
    let W = R == null ? void 0 : R.config.facets;
    for (let z in _) {
      let K = _[z], X = K[0].facet, Z = W && W[z] || [];
      if (K.every(
        (Y) => Y.type == 0
        /* Provider.Static */
      ))
        if (F[X.id] = V.length << 1 | 1, sameArray$1(Z, K))
          V.push(R.facet(X));
        else {
          let Y = X.combine(K.map((te) => te.value));
          V.push(R && X.compare(Y, R.facet(X)) ? R.facet(X) : Y);
        }
      else {
        for (let Y of K)
          Y.type == 0 ? (F[Y.id] = V.length << 1 | 1, V.push(Y.value)) : (F[Y.id] = H.length << 1, H.push((te) => Y.dynamicSlot(te)));
        F[X.id] = H.length << 1, H.push((Y) => dynamicFacetSlot(Y, X, K));
      }
    }
    let U = H.map((z) => z(F));
    return new Configuration(e, $, U, F, V, _);
  }
}
function flatten(s, e, r) {
  let R = [[], [], [], [], []], B = /* @__PURE__ */ new Map();
  function _($, F) {
    let V = B.get($);
    if (V != null) {
      if (V <= F)
        return;
      let H = R[V].indexOf($);
      H > -1 && R[V].splice(H, 1), $ instanceof CompartmentInstance && r.delete($.compartment);
    }
    if (B.set($, F), Array.isArray($))
      for (let H of $)
        _(H, F);
    else if ($ instanceof CompartmentInstance) {
      if (r.has($.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let H = e.get($.compartment) || $.inner;
      r.set($.compartment, H), _(H, F);
    } else if ($ instanceof PrecExtension)
      _($.inner, $.prec);
    else if ($ instanceof StateField)
      R[F].push($), $.provides && _($.provides, F);
    else if ($ instanceof FacetProvider)
      R[F].push($), $.facet.extensions && _($.facet.extensions, Prec_.default);
    else {
      let H = $.extension;
      if (!H)
        throw new Error(`Unrecognized extension value in extension set (${$}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      _(H, F);
    }
  }
  return _(s, Prec_.default), R.reduce(($, F) => $.concat(F));
}
function ensureAddr(s, e) {
  if (e & 1)
    return 2;
  let r = e >> 1, R = s.status[r];
  if (R == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (R & 2)
    return R;
  s.status[r] = 4;
  let B = s.computeSlot(s, s.config.dynamicSlots[r]);
  return s.status[r] = 2 | B;
}
function getAddr(s, e) {
  return e & 1 ? s.config.staticValues[e >> 1] : s.values[e >> 1];
}
const languageData = /* @__PURE__ */ Facet.define(), allowMultipleSelections = /* @__PURE__ */ Facet.define({
  combine: (s) => s.some((e) => e),
  static: !0
}), lineSeparator = /* @__PURE__ */ Facet.define({
  combine: (s) => s.length ? s[0] : void 0,
  static: !0
}), changeFilter = /* @__PURE__ */ Facet.define(), transactionFilter = /* @__PURE__ */ Facet.define(), transactionExtender = /* @__PURE__ */ Facet.define(), readOnly = /* @__PURE__ */ Facet.define({
  combine: (s) => s.length ? s[0] : !1
});
class Annotation {
  /**
  @internal
  */
  constructor(e, r) {
    this.type = e, this.value = r;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new AnnotationType();
  }
}
class AnnotationType {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new Annotation(this, e);
  }
}
class StateEffectType {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new StateEffect(this, e);
  }
}
class StateEffect {
  /**
  @internal
  */
  constructor(e, r) {
    this.type = e, this.value = r;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let r = this.type.map(this.value, e);
    return r === void 0 ? void 0 : r == this.value ? this : new StateEffect(this.type, r);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new StateEffectType(e.map || ((r) => r));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, r) {
    if (!e.length)
      return e;
    let R = [];
    for (let B of e) {
      let _ = B.map(r);
      _ && R.push(_);
    }
    return R;
  }
}
StateEffect.reconfigure = /* @__PURE__ */ StateEffect.define();
StateEffect.appendConfig = /* @__PURE__ */ StateEffect.define();
class Transaction {
  constructor(e, r, R, B, _, $) {
    this.startState = e, this.changes = r, this.selection = R, this.effects = B, this.annotations = _, this.scrollIntoView = $, this._doc = null, this._state = null, R && checkSelection(R, r.newLength), _.some((F) => F.type == Transaction.time) || (this.annotations = _.concat(Transaction.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, r, R, B, _, $) {
    return new Transaction(e, r, R, B, _, $);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let r of this.annotations)
      if (r.type == e)
        return r.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let r = this.annotation(Transaction.userEvent);
    return !!(r && (r == e || r.length > e.length && r.slice(0, e.length) == e && r[e.length] == "."));
  }
}
Transaction.time = /* @__PURE__ */ Annotation.define();
Transaction.userEvent = /* @__PURE__ */ Annotation.define();
Transaction.addToHistory = /* @__PURE__ */ Annotation.define();
Transaction.remote = /* @__PURE__ */ Annotation.define();
function joinRanges(s, e) {
  let r = [];
  for (let R = 0, B = 0; ; ) {
    let _, $;
    if (R < s.length && (B == e.length || e[B] >= s[R]))
      _ = s[R++], $ = s[R++];
    else if (B < e.length)
      _ = e[B++], $ = e[B++];
    else
      return r;
    !r.length || r[r.length - 1] < _ ? r.push(_, $) : r[r.length - 1] < $ && (r[r.length - 1] = $);
  }
}
function mergeTransaction(s, e, r) {
  var R;
  let B, _, $;
  return r ? (B = e.changes, _ = ChangeSet.empty(e.changes.length), $ = s.changes.compose(e.changes)) : (B = e.changes.map(s.changes), _ = s.changes.mapDesc(e.changes, !0), $ = s.changes.compose(B)), {
    changes: $,
    selection: e.selection ? e.selection.map(_) : (R = s.selection) === null || R === void 0 ? void 0 : R.map(B),
    effects: StateEffect.mapEffects(s.effects, B).concat(StateEffect.mapEffects(e.effects, _)),
    annotations: s.annotations.length ? s.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: s.scrollIntoView || e.scrollIntoView
  };
}
function resolveTransactionInner(s, e, r) {
  let R = e.selection, B = asArray$1(e.annotations);
  return e.userEvent && (B = B.concat(Transaction.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof ChangeSet ? e.changes : ChangeSet.of(e.changes || [], r, s.facet(lineSeparator)),
    selection: R && (R instanceof EditorSelection ? R : EditorSelection.single(R.anchor, R.head)),
    effects: asArray$1(e.effects),
    annotations: B,
    scrollIntoView: !!e.scrollIntoView
  };
}
function resolveTransaction(s, e, r) {
  let R = resolveTransactionInner(s, e.length ? e[0] : {}, s.doc.length);
  e.length && e[0].filter === !1 && (r = !1);
  for (let _ = 1; _ < e.length; _++) {
    e[_].filter === !1 && (r = !1);
    let $ = !!e[_].sequential;
    R = mergeTransaction(R, resolveTransactionInner(s, e[_], $ ? R.changes.newLength : s.doc.length), $);
  }
  let B = Transaction.create(s, R.changes, R.selection, R.effects, R.annotations, R.scrollIntoView);
  return extendTransaction(r ? filterTransaction(B) : B);
}
function filterTransaction(s) {
  let e = s.startState, r = !0;
  for (let B of e.facet(changeFilter)) {
    let _ = B(s);
    if (_ === !1) {
      r = !1;
      break;
    }
    Array.isArray(_) && (r = r === !0 ? _ : joinRanges(r, _));
  }
  if (r !== !0) {
    let B, _;
    if (r === !1)
      _ = s.changes.invertedDesc, B = ChangeSet.empty(e.doc.length);
    else {
      let $ = s.changes.filter(r);
      B = $.changes, _ = $.filtered.mapDesc($.changes).invertedDesc;
    }
    s = Transaction.create(e, B, s.selection && s.selection.map(_), StateEffect.mapEffects(s.effects, _), s.annotations, s.scrollIntoView);
  }
  let R = e.facet(transactionFilter);
  for (let B = R.length - 1; B >= 0; B--) {
    let _ = R[B](s);
    _ instanceof Transaction ? s = _ : Array.isArray(_) && _.length == 1 && _[0] instanceof Transaction ? s = _[0] : s = resolveTransaction(e, asArray$1(_), !1);
  }
  return s;
}
function extendTransaction(s) {
  let e = s.startState, r = e.facet(transactionExtender), R = s;
  for (let B = r.length - 1; B >= 0; B--) {
    let _ = r[B](s);
    _ && Object.keys(_).length && (R = mergeTransaction(R, resolveTransactionInner(e, _, s.changes.newLength), !0));
  }
  return R == s ? s : Transaction.create(e, s.changes, s.selection, R.effects, R.annotations, R.scrollIntoView);
}
const none$2 = [];
function asArray$1(s) {
  return s == null ? none$2 : Array.isArray(s) ? s : [s];
}
var CharCategory = /* @__PURE__ */ function(s) {
  return s[s.Word = 0] = "Word", s[s.Space = 1] = "Space", s[s.Other = 2] = "Other", s;
}(CharCategory || (CharCategory = {}));
const nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let wordChar;
try {
  wordChar = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch (s) {
}
function hasWordChar(s) {
  if (wordChar)
    return wordChar.test(s);
  for (let e = 0; e < s.length; e++) {
    let r = s[e];
    if (/\w/.test(r) || r > "" && (r.toUpperCase() != r.toLowerCase() || nonASCIISingleCaseWordChar.test(r)))
      return !0;
  }
  return !1;
}
function makeCategorizer(s) {
  return (e) => {
    if (!/\S/.test(e))
      return CharCategory.Space;
    if (hasWordChar(e))
      return CharCategory.Word;
    for (let r = 0; r < s.length; r++)
      if (e.indexOf(s[r]) > -1)
        return CharCategory.Word;
    return CharCategory.Other;
  };
}
class EditorState {
  constructor(e, r, R, B, _, $) {
    this.config = e, this.doc = r, this.selection = R, this.values = B, this.status = e.statusTemplate.slice(), this.computeSlot = _, $ && ($._state = this);
    for (let F = 0; F < this.config.dynamicSlots.length; F++)
      ensureAddr(this, F << 1);
    this.computeSlot = null;
  }
  field(e, r = !0) {
    let R = this.config.address[e.id];
    if (R == null) {
      if (r)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return ensureAddr(this, R), getAddr(this, R);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return resolveTransaction(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let r = this.config, { base: R, compartments: B } = r;
    for (let F of e.effects)
      F.is(Compartment.reconfigure) ? (r && (B = /* @__PURE__ */ new Map(), r.compartments.forEach((V, H) => B.set(H, V)), r = null), B.set(F.value.compartment, F.value.extension)) : F.is(StateEffect.reconfigure) ? (r = null, R = F.value) : F.is(StateEffect.appendConfig) && (r = null, R = asArray$1(R).concat(F.value));
    let _;
    r ? _ = e.startState.values.slice() : (r = Configuration.resolve(R, B, this), _ = new EditorState(r, this.doc, this.selection, r.dynamicSlots.map(() => null), (V, H) => H.reconfigure(V, this), null).values);
    let $ = e.startState.facet(allowMultipleSelections) ? e.newSelection : e.newSelection.asSingle();
    new EditorState(r, e.newDoc, $, _, (F, V) => V.update(F, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((r) => ({
      changes: { from: r.from, to: r.to, insert: e },
      range: EditorSelection.cursor(r.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let r = this.selection, R = e(r.ranges[0]), B = this.changes(R.changes), _ = [R.range], $ = asArray$1(R.effects);
    for (let F = 1; F < r.ranges.length; F++) {
      let V = e(r.ranges[F]), H = this.changes(V.changes), W = H.map(B);
      for (let z = 0; z < F; z++)
        _[z] = _[z].map(W);
      let U = B.mapDesc(H, !0);
      _.push(V.range.map(U)), B = B.compose(W), $ = StateEffect.mapEffects($, W).concat(StateEffect.mapEffects(asArray$1(V.effects), U));
    }
    return {
      changes: B,
      selection: EditorSelection.create(_, r.mainIndex),
      effects: $
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof ChangeSet ? e : ChangeSet.of(e, this.doc.length, this.facet(EditorState.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return Text$1.of(e.split(this.facet(EditorState.lineSeparator) || DefaultSplit));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, r = this.doc.length) {
    return this.doc.sliceString(e, r, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let r = this.config.address[e.id];
    return r == null ? e.default : (ensureAddr(this, r), getAddr(this, r));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let r = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let R in e) {
        let B = e[R];
        B instanceof StateField && this.config.address[B.id] != null && (r[R] = B.spec.toJSON(this.field(e[R]), this));
      }
    return r;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, r = {}, R) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let B = [];
    if (R) {
      for (let _ in R)
        if (Object.prototype.hasOwnProperty.call(e, _)) {
          let $ = R[_], F = e[_];
          B.push($.init((V) => $.spec.fromJSON(F, V)));
        }
    }
    return EditorState.create({
      doc: e.doc,
      selection: EditorSelection.fromJSON(e.selection),
      extensions: r.extensions ? B.concat([r.extensions]) : B
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let r = Configuration.resolve(e.extensions || [], /* @__PURE__ */ new Map()), R = e.doc instanceof Text$1 ? e.doc : Text$1.of((e.doc || "").split(r.staticFacet(EditorState.lineSeparator) || DefaultSplit)), B = e.selection ? e.selection instanceof EditorSelection ? e.selection : EditorSelection.single(e.selection.anchor, e.selection.head) : EditorSelection.single(0);
    return checkSelection(B, R.length), r.staticFacet(allowMultipleSelections) || (B = B.asSingle()), new EditorState(r, R, B, r.dynamicSlots.map(() => null), (_, $) => $.create(_), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(EditorState.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(EditorState.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(readOnly);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...r) {
    for (let R of this.facet(EditorState.phrases))
      if (Object.prototype.hasOwnProperty.call(R, e)) {
        e = R[e];
        break;
      }
    return r.length && (e = e.replace(/\$(\$|\d*)/g, (R, B) => {
      if (B == "$")
        return "$";
      let _ = +(B || 1);
      return !_ || _ > r.length ? R : r[_ - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, r, R = -1) {
    let B = [];
    for (let _ of this.facet(languageData))
      for (let $ of _(this, r, R))
        Object.prototype.hasOwnProperty.call($, e) && B.push($[e]);
    return B;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    return makeCategorizer(this.languageDataAt("wordChars", e).join(""));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: r, from: R, length: B } = this.doc.lineAt(e), _ = this.charCategorizer(e), $ = e - R, F = e - R;
    for (; $ > 0; ) {
      let V = findClusterBreak(r, $, !1);
      if (_(r.slice(V, $)) != CharCategory.Word)
        break;
      $ = V;
    }
    for (; F < B; ) {
      let V = findClusterBreak(r, F);
      if (_(r.slice(F, V)) != CharCategory.Word)
        break;
      F = V;
    }
    return $ == F ? null : EditorSelection.range($ + R, F + R);
  }
}
EditorState.allowMultipleSelections = allowMultipleSelections;
EditorState.tabSize = /* @__PURE__ */ Facet.define({
  combine: (s) => s.length ? s[0] : 4
});
EditorState.lineSeparator = lineSeparator;
EditorState.readOnly = readOnly;
EditorState.phrases = /* @__PURE__ */ Facet.define({
  compare(s, e) {
    let r = Object.keys(s), R = Object.keys(e);
    return r.length == R.length && r.every((B) => s[B] == e[B]);
  }
});
EditorState.languageData = languageData;
EditorState.changeFilter = changeFilter;
EditorState.transactionFilter = transactionFilter;
EditorState.transactionExtender = transactionExtender;
Compartment.reconfigure = /* @__PURE__ */ StateEffect.define();
function combineConfig(s, e, r = {}) {
  let R = {};
  for (let B of s)
    for (let _ of Object.keys(B)) {
      let $ = B[_], F = R[_];
      if (F === void 0)
        R[_] = $;
      else if (!(F === $ || $ === void 0)) if (Object.hasOwnProperty.call(r, _))
        R[_] = r[_](F, $);
      else
        throw new Error("Config merge conflict for field " + _);
    }
  for (let B in e)
    R[B] === void 0 && (R[B] = e[B]);
  return R;
}
class RangeValue {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, r = e) {
    return Range$1.create(e, r, this);
  }
}
RangeValue.prototype.startSide = RangeValue.prototype.endSide = 0;
RangeValue.prototype.point = !1;
RangeValue.prototype.mapMode = MapMode.TrackDel;
let Range$1 = class ze {
  constructor(e, r, R) {
    this.from = e, this.to = r, this.value = R;
  }
  /**
  @internal
  */
  static create(e, r, R) {
    return new ze(e, r, R);
  }
};
function cmpRange(s, e) {
  return s.from - e.from || s.value.startSide - e.value.startSide;
}
class Chunk {
  constructor(e, r, R, B) {
    this.from = e, this.to = r, this.value = R, this.maxPoint = B;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, r, R, B = 0) {
    let _ = R ? this.to : this.from;
    for (let $ = B, F = _.length; ; ) {
      if ($ == F)
        return $;
      let V = $ + F >> 1, H = _[V] - e || (R ? this.value[V].endSide : this.value[V].startSide) - r;
      if (V == $)
        return H >= 0 ? $ : F;
      H >= 0 ? F = V : $ = V + 1;
    }
  }
  between(e, r, R, B) {
    for (let _ = this.findIndex(r, -1e9, !0), $ = this.findIndex(R, 1e9, !1, _); _ < $; _++)
      if (B(this.from[_] + e, this.to[_] + e, this.value[_]) === !1)
        return !1;
  }
  map(e, r) {
    let R = [], B = [], _ = [], $ = -1, F = -1;
    for (let V = 0; V < this.value.length; V++) {
      let H = this.value[V], W = this.from[V] + e, U = this.to[V] + e, z, K;
      if (W == U) {
        let X = r.mapPos(W, H.startSide, H.mapMode);
        if (X == null || (z = K = X, H.startSide != H.endSide && (K = r.mapPos(W, H.endSide), K < z)))
          continue;
      } else if (z = r.mapPos(W, H.startSide), K = r.mapPos(U, H.endSide), z > K || z == K && H.startSide > 0 && H.endSide <= 0)
        continue;
      (K - z || H.endSide - H.startSide) < 0 || ($ < 0 && ($ = z), H.point && (F = Math.max(F, K - z)), R.push(H), B.push(z - $), _.push(K - $));
    }
    return { mapped: R.length ? new Chunk(B, _, R, F) : null, pos: $ };
  }
}
class RangeSet {
  constructor(e, r, R, B) {
    this.chunkPos = e, this.chunk = r, this.nextLayer = R, this.maxPoint = B;
  }
  /**
  @internal
  */
  static create(e, r, R, B) {
    return new RangeSet(e, r, R, B);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let r of this.chunk)
      e += r.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: r = [], sort: R = !1, filterFrom: B = 0, filterTo: _ = this.length } = e, $ = e.filter;
    if (r.length == 0 && !$)
      return this;
    if (R && (r = r.slice().sort(cmpRange)), this.isEmpty)
      return r.length ? RangeSet.of(r) : this;
    let F = new LayerCursor(this, null, -1).goto(0), V = 0, H = [], W = new RangeSetBuilder();
    for (; F.value || V < r.length; )
      if (V < r.length && (F.from - r[V].from || F.startSide - r[V].value.startSide) >= 0) {
        let U = r[V++];
        W.addInner(U.from, U.to, U.value) || H.push(U);
      } else F.rangeIndex == 1 && F.chunkIndex < this.chunk.length && (V == r.length || this.chunkEnd(F.chunkIndex) < r[V].from) && (!$ || B > this.chunkEnd(F.chunkIndex) || _ < this.chunkPos[F.chunkIndex]) && W.addChunk(this.chunkPos[F.chunkIndex], this.chunk[F.chunkIndex]) ? F.nextChunk() : ((!$ || B > F.to || _ < F.from || $(F.from, F.to, F.value)) && (W.addInner(F.from, F.to, F.value) || H.push(Range$1.create(F.from, F.to, F.value))), F.next());
    return W.finishInner(this.nextLayer.isEmpty && !H.length ? RangeSet.empty : this.nextLayer.update({ add: H, filter: $, filterFrom: B, filterTo: _ }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let r = [], R = [], B = -1;
    for (let $ = 0; $ < this.chunk.length; $++) {
      let F = this.chunkPos[$], V = this.chunk[$], H = e.touchesRange(F, F + V.length);
      if (H === !1)
        B = Math.max(B, V.maxPoint), r.push(V), R.push(e.mapPos(F));
      else if (H === !0) {
        let { mapped: W, pos: U } = V.map(F, e);
        W && (B = Math.max(B, W.maxPoint), r.push(W), R.push(U));
      }
    }
    let _ = this.nextLayer.map(e);
    return r.length == 0 ? _ : new RangeSet(R, r, _ || RangeSet.empty, B);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, r, R) {
    if (!this.isEmpty) {
      for (let B = 0; B < this.chunk.length; B++) {
        let _ = this.chunkPos[B], $ = this.chunk[B];
        if (r >= _ && e <= _ + $.length && $.between(_, e - _, r - _, R) === !1)
          return;
      }
      this.nextLayer.between(e, r, R);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return HeapCursor.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, r = 0) {
    return HeapCursor.from(e).goto(r);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, r, R, B, _ = -1) {
    let $ = e.filter((U) => U.maxPoint > 0 || !U.isEmpty && U.maxPoint >= _), F = r.filter((U) => U.maxPoint > 0 || !U.isEmpty && U.maxPoint >= _), V = findSharedChunks($, F, R), H = new SpanCursor($, V, _), W = new SpanCursor(F, V, _);
    R.iterGaps((U, z, K) => compare(H, U, W, z, K, B)), R.empty && R.length == 0 && compare(H, 0, W, 0, 0, B);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, r, R = 0, B) {
    B == null && (B = 999999999);
    let _ = e.filter((W) => !W.isEmpty && r.indexOf(W) < 0), $ = r.filter((W) => !W.isEmpty && e.indexOf(W) < 0);
    if (_.length != $.length)
      return !1;
    if (!_.length)
      return !0;
    let F = findSharedChunks(_, $), V = new SpanCursor(_, F, 0).goto(R), H = new SpanCursor($, F, 0).goto(R);
    for (; ; ) {
      if (V.to != H.to || !sameValues(V.active, H.active) || V.point && (!H.point || !V.point.eq(H.point)))
        return !1;
      if (V.to > B)
        return !0;
      V.next(), H.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, r, R, B, _ = -1) {
    let $ = new SpanCursor(e, null, _).goto(r), F = r, V = $.openStart;
    for (; ; ) {
      let H = Math.min($.to, R);
      if ($.point) {
        let W = $.activeForPoint($.to), U = $.pointFrom < r ? W.length + 1 : $.point.startSide < 0 ? W.length : Math.min(W.length, V);
        B.point(F, H, $.point, W, U, $.pointRank), V = Math.min($.openEnd(H), W.length);
      } else H > F && (B.span(F, H, $.active, V), V = $.openEnd(H));
      if ($.to > R)
        return V + ($.point && $.to > R ? 1 : 0);
      F = $.to, $.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, r = !1) {
    let R = new RangeSetBuilder();
    for (let B of e instanceof Range$1 ? [e] : r ? lazySort(e) : e)
      R.add(B.from, B.to, B.value);
    return R.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return RangeSet.empty;
    let r = e[e.length - 1];
    for (let R = e.length - 2; R >= 0; R--)
      for (let B = e[R]; B != RangeSet.empty; B = B.nextLayer)
        r = new RangeSet(B.chunkPos, B.chunk, r, Math.max(B.maxPoint, r.maxPoint));
    return r;
  }
}
RangeSet.empty = /* @__PURE__ */ new RangeSet([], [], null, -1);
function lazySort(s) {
  if (s.length > 1)
    for (let e = s[0], r = 1; r < s.length; r++) {
      let R = s[r];
      if (cmpRange(e, R) > 0)
        return s.slice().sort(cmpRange);
      e = R;
    }
  return s;
}
RangeSet.empty.nextLayer = RangeSet.empty;
class RangeSetBuilder {
  finishChunk(e) {
    this.chunks.push(new Chunk(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, r, R) {
    this.addInner(e, r, R) || (this.nextLayer || (this.nextLayer = new RangeSetBuilder())).add(e, r, R);
  }
  /**
  @internal
  */
  addInner(e, r, R) {
    let B = e - this.lastTo || R.startSide - this.last.endSide;
    if (B <= 0 && (e - this.lastFrom || R.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return B < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(r - this.chunkStart), this.last = R, this.lastFrom = e, this.lastTo = r, this.value.push(R), R.point && (this.maxPoint = Math.max(this.maxPoint, r - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, r) {
    if ((e - this.lastTo || r.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, r.maxPoint), this.chunks.push(r), this.chunkPos.push(e);
    let R = r.value.length - 1;
    return this.last = r.value[R], this.lastFrom = r.from[R] + e, this.lastTo = r.to[R] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(RangeSet.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let r = RangeSet.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, r;
  }
}
function findSharedChunks(s, e, r) {
  let R = /* @__PURE__ */ new Map();
  for (let _ of s)
    for (let $ = 0; $ < _.chunk.length; $++)
      _.chunk[$].maxPoint <= 0 && R.set(_.chunk[$], _.chunkPos[$]);
  let B = /* @__PURE__ */ new Set();
  for (let _ of e)
    for (let $ = 0; $ < _.chunk.length; $++) {
      let F = R.get(_.chunk[$]);
      F != null && (r ? r.mapPos(F) : F) == _.chunkPos[$] && !(r != null && r.touchesRange(F, F + _.chunk[$].length)) && B.add(_.chunk[$]);
    }
  return B;
}
class LayerCursor {
  constructor(e, r, R, B = 0) {
    this.layer = e, this.skip = r, this.minPoint = R, this.rank = B;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, r = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, r, !1), this;
  }
  gotoInner(e, r, R) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let B = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(B) || this.layer.chunkEnd(this.chunkIndex) < e || B.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, R = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let B = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], r, !0);
      (!R || this.rangeIndex < B) && this.setRangeIndex(B);
    }
    this.next();
  }
  forward(e, r) {
    (this.to - e || this.endSide - r) < 0 && this.gotoInner(e, r, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], r = this.layer.chunk[this.chunkIndex], R = e + r.from[this.rangeIndex];
        if (this.from = R, this.to = e + r.to[this.rangeIndex], this.value = r.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class HeapCursor {
  constructor(e) {
    this.heap = e;
  }
  static from(e, r = null, R = -1) {
    let B = [];
    for (let _ = 0; _ < e.length; _++)
      for (let $ = e[_]; !$.isEmpty; $ = $.nextLayer)
        $.maxPoint >= R && B.push(new LayerCursor($, r, R, _));
    return B.length == 1 ? B[0] : new HeapCursor(B);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, r = -1e9) {
    for (let R of this.heap)
      R.goto(e, r);
    for (let R = this.heap.length >> 1; R >= 0; R--)
      heapBubble(this.heap, R);
    return this.next(), this;
  }
  forward(e, r) {
    for (let R of this.heap)
      R.forward(e, r);
    for (let R = this.heap.length >> 1; R >= 0; R--)
      heapBubble(this.heap, R);
    (this.to - e || this.value.endSide - r) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), heapBubble(this.heap, 0);
    }
  }
}
function heapBubble(s, e) {
  for (let r = s[e]; ; ) {
    let R = (e << 1) + 1;
    if (R >= s.length)
      break;
    let B = s[R];
    if (R + 1 < s.length && B.compare(s[R + 1]) >= 0 && (B = s[R + 1], R++), r.compare(B) < 0)
      break;
    s[R] = r, s[e] = B, e = R;
  }
}
class SpanCursor {
  constructor(e, r, R) {
    this.minPoint = R, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = HeapCursor.from(e, r, R);
  }
  goto(e, r = -1e9) {
    return this.cursor.goto(e, r), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = r, this.openStart = -1, this.next(), this;
  }
  forward(e, r) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - r) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, r);
  }
  removeActive(e) {
    remove(this.active, e), remove(this.activeTo, e), remove(this.activeRank, e), this.minActive = findMinIndex(this.active, this.activeTo);
  }
  addActive(e) {
    let r = 0, { value: R, to: B, rank: _ } = this.cursor;
    for (; r < this.activeRank.length && (_ - this.activeRank[r] || B - this.activeTo[r]) > 0; )
      r++;
    insert(this.active, r, R), insert(this.activeTo, r, B), insert(this.activeRank, r, _), e && insert(e, r, this.cursor.from), this.minActive = findMinIndex(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, r = this.point;
    this.point = null;
    let R = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let B = this.minActive;
      if (B > -1 && (this.activeTo[B] - this.cursor.from || this.active[B].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[B] > e) {
          this.to = this.activeTo[B], this.endSide = this.active[B].endSide;
          break;
        }
        this.removeActive(B), R && remove(R, B);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let _ = this.cursor.value;
          if (!_.point)
            this.addActive(R), this.cursor.next();
          else if (r && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = _, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = _.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (R) {
      this.openStart = 0;
      for (let B = R.length - 1; B >= 0 && R[B] < e; B--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let r = [];
    for (let R = this.active.length - 1; R >= 0 && !(this.activeRank[R] < this.pointRank); R--)
      (this.activeTo[R] > e || this.activeTo[R] == e && this.active[R].endSide >= this.point.endSide) && r.push(this.active[R]);
    return r.reverse();
  }
  openEnd(e) {
    let r = 0;
    for (let R = this.activeTo.length - 1; R >= 0 && this.activeTo[R] > e; R--)
      r++;
    return r;
  }
}
function compare(s, e, r, R, B, _) {
  s.goto(e), r.goto(R);
  let $ = R + B, F = R, V = R - e;
  for (; ; ) {
    let H = s.to + V - r.to, W = H || s.endSide - r.endSide, U = W < 0 ? s.to + V : r.to, z = Math.min(U, $);
    if (s.point || r.point ? s.point && r.point && (s.point == r.point || s.point.eq(r.point)) && sameValues(s.activeForPoint(s.to), r.activeForPoint(r.to)) || _.comparePoint(F, z, s.point, r.point) : z > F && !sameValues(s.active, r.active) && _.compareRange(F, z, s.active, r.active), U > $)
      break;
    (H || s.openEnd != r.openEnd) && _.boundChange && _.boundChange(U), F = U, W <= 0 && s.next(), W >= 0 && r.next();
  }
}
function sameValues(s, e) {
  if (s.length != e.length)
    return !1;
  for (let r = 0; r < s.length; r++)
    if (s[r] != e[r] && !s[r].eq(e[r]))
      return !1;
  return !0;
}
function remove(s, e) {
  for (let r = e, R = s.length - 1; r < R; r++)
    s[r] = s[r + 1];
  s.pop();
}
function insert(s, e, r) {
  for (let R = s.length - 1; R >= e; R--)
    s[R + 1] = s[R];
  s[e] = r;
}
function findMinIndex(s, e) {
  let r = -1, R = 1e9;
  for (let B = 0; B < e.length; B++)
    (e[B] - R || s[B].endSide - s[r].endSide) < 0 && (r = B, R = e[B]);
  return r;
}
function countColumn(s, e, r = s.length) {
  let R = 0;
  for (let B = 0; B < r; )
    s.charCodeAt(B) == 9 ? (R += e - R % e, B++) : (R++, B = findClusterBreak(s, B));
  return R;
}
function findColumn(s, e, r, R) {
  for (let B = 0, _ = 0; ; ) {
    if (_ >= e)
      return B;
    if (B == s.length)
      break;
    _ += s.charCodeAt(B) == 9 ? r - _ % r : 1, B = findClusterBreak(s, B);
  }
  return R === !0 ? -1 : s.length;
}
const C = "ͼ", COUNT = typeof Symbol > "u" ? "__" + C : Symbol.for(C), SET = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), top = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class StyleModule {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, r) {
    this.rules = [];
    let { finish: R } = r || {};
    function B($) {
      return /^@/.test($) ? [$] : $.split(/,\s*/);
    }
    function _($, F, V, H) {
      let W = [], U = /^@(\w+)\b/.exec($[0]), z = U && U[1] == "keyframes";
      if (U && F == null) return V.push($[0] + ";");
      for (let K in F) {
        let X = F[K];
        if (/&/.test(K))
          _(
            K.split(/,\s*/).map((Z) => $.map((Y) => Z.replace(/&/, Y))).reduce((Z, Y) => Z.concat(Y)),
            X,
            V
          );
        else if (X && typeof X == "object") {
          if (!U) throw new RangeError("The value of a property (" + K + ") should be a primitive value.");
          _(B(K), X, W, z);
        } else X != null && W.push(K.replace(/_.*/, "").replace(/[A-Z]/g, (Z) => "-" + Z.toLowerCase()) + ": " + X + ";");
      }
      (W.length || z) && V.push((R && !U && !H ? $.map(R) : $).join(", ") + " {" + W.join(" ") + "}");
    }
    for (let $ in e) _(B($), e[$], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = top[COUNT] || 1;
    return top[COUNT] = e + 1, C + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, r, R) {
    let B = e[SET], _ = R && R.nonce;
    B ? _ && B.setNonce(_) : B = new StyleSet(e, _), B.mount(Array.isArray(r) ? r : [r], e);
  }
}
let adoptedSet = /* @__PURE__ */ new Map();
class StyleSet {
  constructor(e, r) {
    let R = e.ownerDocument || e, B = R.defaultView;
    if (!e.head && e.adoptedStyleSheets && B.CSSStyleSheet) {
      let _ = adoptedSet.get(R);
      if (_) return e[SET] = _;
      this.sheet = new B.CSSStyleSheet(), adoptedSet.set(R, this);
    } else
      this.styleTag = R.createElement("style"), r && this.styleTag.setAttribute("nonce", r);
    this.modules = [], e[SET] = this;
  }
  mount(e, r) {
    let R = this.sheet, B = 0, _ = 0;
    for (let $ = 0; $ < e.length; $++) {
      let F = e[$], V = this.modules.indexOf(F);
      if (V < _ && V > -1 && (this.modules.splice(V, 1), _--, V = -1), V == -1) {
        if (this.modules.splice(_++, 0, F), R) for (let H = 0; H < F.rules.length; H++)
          R.insertRule(F.rules[H], B++);
      } else {
        for (; _ < V; ) B += this.modules[_++].rules.length;
        B += F.rules.length, _++;
      }
    }
    if (R)
      r.adoptedStyleSheets.indexOf(this.sheet) < 0 && (r.adoptedStyleSheets = [this.sheet, ...r.adoptedStyleSheets]);
    else {
      let $ = "";
      for (let V = 0; V < this.modules.length; V++)
        $ += this.modules[V].getRules() + `
`;
      this.styleTag.textContent = $;
      let F = r.head || r;
      this.styleTag.parentNode != F && F.insertBefore(this.styleTag, F.firstChild);
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var base = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, shift = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, mac = typeof navigator < "u" && /Mac/.test(navigator.platform), ie$1 = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var i = 0; i < 10; i++) base[48 + i] = base[96 + i] = String(i);
for (var i = 1; i <= 24; i++) base[i + 111] = "F" + i;
for (var i = 65; i <= 90; i++)
  base[i] = String.fromCharCode(i + 32), shift[i] = String.fromCharCode(i);
for (var code in base) shift.hasOwnProperty(code) || (shift[code] = base[code]);
function keyName(s) {
  var e = mac && s.metaKey && s.shiftKey && !s.ctrlKey && !s.altKey || ie$1 && s.shiftKey && s.key && s.key.length == 1 || s.key == "Unidentified", r = !e && s.key || (s.shiftKey ? shift : base)[s.keyCode] || s.key || "Unidentified";
  return r == "Esc" && (r = "Escape"), r == "Del" && (r = "Delete"), r == "Left" && (r = "ArrowLeft"), r == "Up" && (r = "ArrowUp"), r == "Right" && (r = "ArrowRight"), r == "Down" && (r = "ArrowDown"), r;
}
function getSelection(s) {
  let e;
  return s.nodeType == 11 ? e = s.getSelection ? s : s.ownerDocument : e = s, e.getSelection();
}
function contains(s, e) {
  return e ? s == e || s.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function hasSelection$1(s, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return contains(s, e.anchorNode);
  } catch {
    return !1;
  }
}
function clientRectsFor(s) {
  return s.nodeType == 3 ? textRange(s, 0, s.nodeValue.length).getClientRects() : s.nodeType == 1 ? s.getClientRects() : [];
}
function isEquivalentPosition(s, e, r, R) {
  return r ? scanFor(s, e, r, R, -1) || scanFor(s, e, r, R, 1) : !1;
}
function domIndex(s) {
  for (var e = 0; ; e++)
    if (s = s.previousSibling, !s)
      return e;
}
function isBlockElement(s) {
  return s.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(s.nodeName);
}
function scanFor(s, e, r, R, B) {
  for (; ; ) {
    if (s == r && e == R)
      return !0;
    if (e == (B < 0 ? 0 : maxOffset(s))) {
      if (s.nodeName == "DIV")
        return !1;
      let _ = s.parentNode;
      if (!_ || _.nodeType != 1)
        return !1;
      e = domIndex(s) + (B < 0 ? 0 : 1), s = _;
    } else if (s.nodeType == 1) {
      if (s = s.childNodes[e + (B < 0 ? -1 : 0)], s.nodeType == 1 && s.contentEditable == "false")
        return !1;
      e = B < 0 ? maxOffset(s) : 0;
    } else
      return !1;
  }
}
function maxOffset(s) {
  return s.nodeType == 3 ? s.nodeValue.length : s.childNodes.length;
}
function flattenRect(s, e) {
  let r = e ? s.left : s.right;
  return { left: r, right: r, top: s.top, bottom: s.bottom };
}
function windowRect(s) {
  let e = s.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: s.innerWidth,
    top: 0,
    bottom: s.innerHeight
  };
}
function getScale(s, e) {
  let r = e.width / s.offsetWidth, R = e.height / s.offsetHeight;
  return (r > 0.995 && r < 1.005 || !isFinite(r) || Math.abs(e.width - s.offsetWidth) < 1) && (r = 1), (R > 0.995 && R < 1.005 || !isFinite(R) || Math.abs(e.height - s.offsetHeight) < 1) && (R = 1), { scaleX: r, scaleY: R };
}
function scrollRectIntoView(s, e, r, R, B, _, $, F) {
  let V = s.ownerDocument, H = V.defaultView || window;
  for (let W = s, U = !1; W && !U; )
    if (W.nodeType == 1) {
      let z, K = W == V.body, X = 1, Z = 1;
      if (K)
        z = windowRect(H);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(W).position) && (U = !0), W.scrollHeight <= W.clientHeight && W.scrollWidth <= W.clientWidth) {
          W = W.assignedSlot || W.parentNode;
          continue;
        }
        let ue = W.getBoundingClientRect();
        ({ scaleX: X, scaleY: Z } = getScale(W, ue)), z = {
          left: ue.left,
          right: ue.left + W.clientWidth * X,
          top: ue.top,
          bottom: ue.top + W.clientHeight * Z
        };
      }
      let Y = 0, te = 0;
      if (B == "nearest")
        e.top < z.top ? (te = -(z.top - e.top + $), r > 0 && e.bottom > z.bottom + te && (te = e.bottom - z.bottom + te + $)) : e.bottom > z.bottom && (te = e.bottom - z.bottom + $, r < 0 && e.top - te < z.top && (te = -(z.top + te - e.top + $)));
      else {
        let ue = e.bottom - e.top, fe = z.bottom - z.top;
        te = (B == "center" && ue <= fe ? e.top + ue / 2 - fe / 2 : B == "start" || B == "center" && r < 0 ? e.top - $ : e.bottom - fe + $) - z.top;
      }
      if (R == "nearest" ? e.left < z.left ? (Y = -(z.left - e.left + _), r > 0 && e.right > z.right + Y && (Y = e.right - z.right + Y + _)) : e.right > z.right && (Y = e.right - z.right + _, r < 0 && e.left < z.left + Y && (Y = -(z.left + Y - e.left + _))) : Y = (R == "center" ? e.left + (e.right - e.left) / 2 - (z.right - z.left) / 2 : R == "start" == F ? e.left - _ : e.right - (z.right - z.left) + _) - z.left, Y || te)
        if (K)
          H.scrollBy(Y, te);
        else {
          let ue = 0, fe = 0;
          if (te) {
            let de = W.scrollTop;
            W.scrollTop += te / Z, fe = (W.scrollTop - de) * Z;
          }
          if (Y) {
            let de = W.scrollLeft;
            W.scrollLeft += Y / X, ue = (W.scrollLeft - de) * X;
          }
          e = {
            left: e.left - ue,
            top: e.top - fe,
            right: e.right - ue,
            bottom: e.bottom - fe
          }, ue && Math.abs(ue - Y) < 1 && (R = "nearest"), fe && Math.abs(fe - te) < 1 && (B = "nearest");
        }
      if (K)
        break;
      W = W.assignedSlot || W.parentNode;
    } else if (W.nodeType == 11)
      W = W.host;
    else
      break;
}
function scrollableParents(s) {
  let e = s.ownerDocument, r, R;
  for (let B = s.parentNode; B && !(B == e.body || r && R); )
    if (B.nodeType == 1)
      !R && B.scrollHeight > B.clientHeight && (R = B), !r && B.scrollWidth > B.clientWidth && (r = B), B = B.assignedSlot || B.parentNode;
    else if (B.nodeType == 11)
      B = B.host;
    else
      break;
  return { x: r, y: R };
}
class DOMSelectionState {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: r, focusNode: R } = e;
    this.set(r, Math.min(e.anchorOffset, r ? maxOffset(r) : 0), R, Math.min(e.focusOffset, R ? maxOffset(R) : 0));
  }
  set(e, r, R, B) {
    this.anchorNode = e, this.anchorOffset = r, this.focusNode = R, this.focusOffset = B;
  }
}
let preventScrollSupported = null;
function focusPreventScroll(s) {
  if (s.setActive)
    return s.setActive();
  if (preventScrollSupported)
    return s.focus(preventScrollSupported);
  let e = [];
  for (let r = s; r && (e.push(r, r.scrollTop, r.scrollLeft), r != r.ownerDocument); r = r.parentNode)
    ;
  if (s.focus(preventScrollSupported == null ? {
    get preventScroll() {
      return preventScrollSupported = { preventScroll: !0 }, !0;
    }
  } : void 0), !preventScrollSupported) {
    preventScrollSupported = !1;
    for (let r = 0; r < e.length; ) {
      let R = e[r++], B = e[r++], _ = e[r++];
      R.scrollTop != B && (R.scrollTop = B), R.scrollLeft != _ && (R.scrollLeft = _);
    }
  }
}
let scratchRange;
function textRange(s, e, r = e) {
  let R = scratchRange || (scratchRange = document.createRange());
  return R.setEnd(s, r), R.setStart(s, e), R;
}
function dispatchKey(s, e, r, R) {
  let B = { key: e, code: e, keyCode: r, which: r, cancelable: !0 };
  R && ({ altKey: B.altKey, ctrlKey: B.ctrlKey, shiftKey: B.shiftKey, metaKey: B.metaKey } = R);
  let _ = new KeyboardEvent("keydown", B);
  _.synthetic = !0, s.dispatchEvent(_);
  let $ = new KeyboardEvent("keyup", B);
  return $.synthetic = !0, s.dispatchEvent($), _.defaultPrevented || $.defaultPrevented;
}
function getRoot(s) {
  for (; s; ) {
    if (s && (s.nodeType == 9 || s.nodeType == 11 && s.host))
      return s;
    s = s.assignedSlot || s.parentNode;
  }
  return null;
}
function clearAttributes(s) {
  for (; s.attributes.length; )
    s.removeAttributeNode(s.attributes[0]);
}
function atElementStart(s, e) {
  let r = e.focusNode, R = e.focusOffset;
  if (!r || e.anchorNode != r || e.anchorOffset != R)
    return !1;
  for (R = Math.min(R, maxOffset(r)); ; )
    if (R) {
      if (r.nodeType != 1)
        return !1;
      let B = r.childNodes[R - 1];
      B.contentEditable == "false" ? R-- : (r = B, R = maxOffset(r));
    } else {
      if (r == s)
        return !0;
      R = domIndex(r), r = r.parentNode;
    }
}
function isScrolledToBottom(s) {
  return s.scrollTop > Math.max(1, s.scrollHeight - s.clientHeight - 4);
}
function textNodeBefore(s, e) {
  for (let r = s, R = e; ; ) {
    if (r.nodeType == 3 && R > 0)
      return { node: r, offset: R };
    if (r.nodeType == 1 && R > 0) {
      if (r.contentEditable == "false")
        return null;
      r = r.childNodes[R - 1], R = maxOffset(r);
    } else if (r.parentNode && !isBlockElement(r))
      R = domIndex(r), r = r.parentNode;
    else
      return null;
  }
}
function textNodeAfter(s, e) {
  for (let r = s, R = e; ; ) {
    if (r.nodeType == 3 && R < r.nodeValue.length)
      return { node: r, offset: R };
    if (r.nodeType == 1 && R < r.childNodes.length) {
      if (r.contentEditable == "false")
        return null;
      r = r.childNodes[R], R = 0;
    } else if (r.parentNode && !isBlockElement(r))
      R = domIndex(r) + 1, r = r.parentNode;
    else
      return null;
  }
}
class DOMPos {
  constructor(e, r, R = !0) {
    this.node = e, this.offset = r, this.precise = R;
  }
  static before(e, r) {
    return new DOMPos(e.parentNode, domIndex(e), r);
  }
  static after(e, r) {
    return new DOMPos(e.parentNode, domIndex(e) + 1, r);
  }
}
const noChildren = [];
class ContentView {
  constructor() {
    this.parent = null, this.dom = null, this.flags = 2;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e) {
    let r = this.posAtStart;
    for (let R of this.children) {
      if (R == e)
        return r;
      r += R.length + R.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  sync(e, r) {
    if (this.flags & 2) {
      let R = this.dom, B = null, _;
      for (let $ of this.children) {
        if ($.flags & 7) {
          if (!$.dom && (_ = B ? B.nextSibling : R.firstChild)) {
            let F = ContentView.get(_);
            (!F || !F.parent && F.canReuseDOM($)) && $.reuseDOM(_);
          }
          $.sync(e, r), $.flags &= -8;
        }
        if (_ = B ? B.nextSibling : R.firstChild, r && !r.written && r.node == R && _ != $.dom && (r.written = !0), $.dom.parentNode == R)
          for (; _ && _ != $.dom; )
            _ = rm$1(_);
        else
          R.insertBefore($.dom, _);
        B = $.dom;
      }
      for (_ = B ? B.nextSibling : R.firstChild, _ && r && r.node == R && (r.written = !0); _; )
        _ = rm$1(_);
    } else if (this.flags & 1)
      for (let R of this.children)
        R.flags & 7 && (R.sync(e, r), R.flags &= -8);
  }
  reuseDOM(e) {
  }
  localPosFromDOM(e, r) {
    let R;
    if (e == this.dom)
      R = this.dom.childNodes[r];
    else {
      let B = maxOffset(e) == 0 ? 0 : r == 0 ? -1 : 1;
      for (; ; ) {
        let _ = e.parentNode;
        if (_ == this.dom)
          break;
        B == 0 && _.firstChild != _.lastChild && (e == _.firstChild ? B = -1 : B = 1), e = _;
      }
      B < 0 ? R = e : R = e.nextSibling;
    }
    if (R == this.dom.firstChild)
      return 0;
    for (; R && !ContentView.get(R); )
      R = R.nextSibling;
    if (!R)
      return this.length;
    for (let B = 0, _ = 0; ; B++) {
      let $ = this.children[B];
      if ($.dom == R)
        return _;
      _ += $.length + $.breakAfter;
    }
  }
  domBoundsAround(e, r, R = 0) {
    let B = -1, _ = -1, $ = -1, F = -1;
    for (let V = 0, H = R, W = R; V < this.children.length; V++) {
      let U = this.children[V], z = H + U.length;
      if (H < e && z > r)
        return U.domBoundsAround(e, r, H);
      if (z >= e && B == -1 && (B = V, _ = H), H > r && U.dom.parentNode == this.dom) {
        $ = V, F = W;
        break;
      }
      W = z, H = z + U.breakAfter;
    }
    return {
      from: _,
      to: F < 0 ? R + this.length : F,
      startDOM: (B ? this.children[B - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: $ < this.children.length && $ >= 0 ? this.children[$].dom : null
    };
  }
  markDirty(e = !1) {
    this.flags |= 2, this.markParentsDirty(e);
  }
  markParentsDirty(e) {
    for (let r = this.parent; r; r = r.parent) {
      if (e && (r.flags |= 2), r.flags & 1)
        return;
      r.flags |= 1, e = !1;
    }
  }
  setParent(e) {
    this.parent != e && (this.parent = e, this.flags & 7 && this.markParentsDirty(!0));
  }
  setDOM(e) {
    this.dom != e && (this.dom && (this.dom.cmView = null), this.dom = e, e.cmView = this);
  }
  get rootView() {
    for (let e = this; ; ) {
      let r = e.parent;
      if (!r)
        return e;
      e = r;
    }
  }
  replaceChildren(e, r, R = noChildren) {
    this.markDirty();
    for (let B = e; B < r; B++) {
      let _ = this.children[B];
      _.parent == this && R.indexOf(_) < 0 && _.destroy();
    }
    R.length < 250 ? this.children.splice(e, r - e, ...R) : this.children = [].concat(this.children.slice(0, e), R, this.children.slice(r));
    for (let B = 0; B < R.length; B++)
      R[B].setParent(this);
  }
  ignoreMutation(e) {
    return !1;
  }
  ignoreEvent(e) {
    return !1;
  }
  childCursor(e = this.length) {
    return new ChildCursor(this.children, e, this.children.length);
  }
  childPos(e, r = 1) {
    return this.childCursor().findPos(e, r);
  }
  toString() {
    let e = this.constructor.name.replace("View", "");
    return e + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (e == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(e) {
    return e.cmView;
  }
  get isEditable() {
    return !0;
  }
  get isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  merge(e, r, R, B, _, $) {
    return !1;
  }
  become(e) {
    return !1;
  }
  canReuseDOM(e) {
    return e.constructor == this.constructor && !((this.flags | e.flags) & 8);
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    for (let e of this.children)
      e.parent == this && e.destroy();
    this.parent = null;
  }
}
ContentView.prototype.breakAfter = 0;
function rm$1(s) {
  let e = s.nextSibling;
  return s.parentNode.removeChild(s), e;
}
class ChildCursor {
  constructor(e, r, R) {
    this.children = e, this.pos = r, this.i = R, this.off = 0;
  }
  findPos(e, r = 1) {
    for (; ; ) {
      if (e > this.pos || e == this.pos && (r > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        return this.off = e - this.pos, this;
      let R = this.children[--this.i];
      this.pos -= R.length + R.breakAfter;
    }
  }
}
function replaceRange(s, e, r, R, B, _, $, F, V) {
  let { children: H } = s, W = H.length ? H[e] : null, U = _.length ? _[_.length - 1] : null, z = U ? U.breakAfter : $;
  if (!(e == R && W && !$ && !z && _.length < 2 && W.merge(r, B, _.length ? U : null, r == 0, F, V))) {
    if (R < H.length) {
      let K = H[R];
      K && (B < K.length || K.breakAfter && (U != null && U.breakAfter)) ? (e == R && (K = K.split(B), B = 0), !z && U && K.merge(0, B, U, !0, 0, V) ? _[_.length - 1] = K : ((B || K.children.length && !K.children[0].length) && K.merge(0, B, null, !1, 0, V), _.push(K))) : K != null && K.breakAfter && (U ? U.breakAfter = 1 : $ = 1), R++;
    }
    for (W && (W.breakAfter = $, r > 0 && (!$ && _.length && W.merge(r, W.length, _[0], !1, F, 0) ? W.breakAfter = _.shift().breakAfter : (r < W.length || W.children.length && W.children[W.children.length - 1].length == 0) && W.merge(r, W.length, null, !1, F, 0), e++)); e < R && _.length; )
      if (H[R - 1].become(_[_.length - 1]))
        R--, _.pop(), V = _.length ? 0 : F;
      else if (H[e].become(_[0]))
        e++, _.shift(), F = _.length ? 0 : V;
      else
        break;
    !_.length && e && R < H.length && !H[e - 1].breakAfter && H[R].merge(0, 0, H[e - 1], !1, F, V) && e--, (e < R || _.length) && s.replaceChildren(e, R, _);
  }
}
function mergeChildrenInto(s, e, r, R, B, _) {
  let $ = s.childCursor(), { i: F, off: V } = $.findPos(r, 1), { i: H, off: W } = $.findPos(e, -1), U = e - r;
  for (let z of R)
    U += z.length;
  s.length += U, replaceRange(s, H, W, F, V, R, 0, B, _);
}
let nav = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, doc = typeof document < "u" ? document : { documentElement: { style: {} } };
const ie_edge = /* @__PURE__ */ /Edge\/(\d+)/.exec(nav.userAgent), ie_upto10 = /* @__PURE__ */ /MSIE \d/.test(nav.userAgent), ie_11up = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nav.userAgent), ie = !!(ie_upto10 || ie_11up || ie_edge), gecko = !ie && /* @__PURE__ */ /gecko\/(\d+)/i.test(nav.userAgent), chrome = !ie && /* @__PURE__ */ /Chrome\/(\d+)/.exec(nav.userAgent), webkit = "webkitFontSmoothing" in doc.documentElement.style, safari = !ie && /* @__PURE__ */ /Apple Computer/.test(nav.vendor), ios = safari && (/* @__PURE__ */ /Mobile\/\w+/.test(nav.userAgent) || nav.maxTouchPoints > 2);
var browser = {
  mac: ios || /* @__PURE__ */ /Mac/.test(nav.platform),
  windows: /* @__PURE__ */ /Win/.test(nav.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(nav.platform),
  ie,
  ie_version: ie_upto10 ? doc.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0,
  gecko,
  gecko_version: gecko ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(nav.userAgent) || [0, 0])[1] : 0,
  chrome: !!chrome,
  chrome_version: chrome ? +chrome[1] : 0,
  ios,
  android: /* @__PURE__ */ /Android\b/.test(nav.userAgent),
  webkit,
  safari,
  webkit_version: webkit ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(nav.userAgent) || [0, 0])[1] : 0,
  tabSize: doc.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
const MaxJoinLen = 256;
class TextView extends ContentView {
  constructor(e) {
    super(), this.text = e;
  }
  get length() {
    return this.text.length;
  }
  createDOM(e) {
    this.setDOM(e || document.createTextNode(this.text));
  }
  sync(e, r) {
    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (r && r.node == this.dom && (r.written = !0), this.dom.nodeValue = this.text);
  }
  reuseDOM(e) {
    e.nodeType == 3 && this.createDOM(e);
  }
  merge(e, r, R) {
    return this.flags & 8 || R && (!(R instanceof TextView) || this.length - (r - e) + R.length > MaxJoinLen || R.flags & 8) ? !1 : (this.text = this.text.slice(0, e) + (R ? R.text : "") + this.text.slice(r), this.markDirty(), !0);
  }
  split(e) {
    let r = new TextView(this.text.slice(e));
    return this.text = this.text.slice(0, e), this.markDirty(), r.flags |= this.flags & 8, r;
  }
  localPosFromDOM(e, r) {
    return e == this.dom ? r : r ? this.text.length : 0;
  }
  domAtPos(e) {
    return new DOMPos(this.dom, e);
  }
  domBoundsAround(e, r, R) {
    return { from: R, to: R + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(e, r) {
    return textCoords(this.dom, e, r);
  }
}
class MarkView extends ContentView {
  constructor(e, r = [], R = 0) {
    super(), this.mark = e, this.children = r, this.length = R;
    for (let B of r)
      B.setParent(this);
  }
  setAttrs(e) {
    if (clearAttributes(e), this.mark.class && (e.className = this.mark.class), this.mark.attrs)
      for (let r in this.mark.attrs)
        e.setAttribute(r, this.mark.attrs[r]);
    return e;
  }
  canReuseDOM(e) {
    return super.canReuseDOM(e) && !((this.flags | e.flags) & 8);
  }
  reuseDOM(e) {
    e.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, r) {
    this.dom ? this.flags & 4 && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(e, r);
  }
  merge(e, r, R, B, _, $) {
    return R && (!(R instanceof MarkView && R.mark.eq(this.mark)) || e && _ <= 0 || r < this.length && $ <= 0) ? !1 : (mergeChildrenInto(this, e, r, R ? R.children.slice() : [], _ - 1, $ - 1), this.markDirty(), !0);
  }
  split(e) {
    let r = [], R = 0, B = -1, _ = 0;
    for (let F of this.children) {
      let V = R + F.length;
      V > e && r.push(R < e ? F.split(e - R) : F), B < 0 && R >= e && (B = _), R = V, _++;
    }
    let $ = this.length - e;
    return this.length = e, B > -1 && (this.children.length = B, this.markDirty()), new MarkView(this.mark, r, $);
  }
  domAtPos(e) {
    return inlineDOMAtPos(this, e);
  }
  coordsAt(e, r) {
    return coordsInChildren(this, e, r);
  }
}
function textCoords(s, e, r) {
  let R = s.nodeValue.length;
  e > R && (e = R);
  let B = e, _ = e, $ = 0;
  e == 0 && r < 0 || e == R && r >= 0 ? browser.chrome || browser.gecko || (e ? (B--, $ = 1) : _ < R && (_++, $ = -1)) : r < 0 ? B-- : _ < R && _++;
  let F = textRange(s, B, _).getClientRects();
  if (!F.length)
    return null;
  let V = F[($ ? $ < 0 : r >= 0) ? 0 : F.length - 1];
  return browser.safari && !$ && V.width == 0 && (V = Array.prototype.find.call(F, (H) => H.width) || V), $ ? flattenRect(V, $ < 0) : V || null;
}
class WidgetView extends ContentView {
  static create(e, r, R) {
    return new WidgetView(e, r, R);
  }
  constructor(e, r, R) {
    super(), this.widget = e, this.length = r, this.side = R, this.prevWidget = null;
  }
  split(e) {
    let r = WidgetView.create(this.widget, this.length - e, this.side);
    return this.length -= e, r;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  getSide() {
    return this.side;
  }
  merge(e, r, R, B, _, $) {
    return R && (!(R instanceof WidgetView) || !this.widget.compare(R.widget) || e > 0 && _ <= 0 || r < this.length && $ <= 0) ? !1 : (this.length = e + (R ? R.length : 0) + (this.length - r), !0);
  }
  become(e) {
    return e instanceof WidgetView && e.side == this.side && this.widget.constructor == e.widget.constructor ? (this.widget.compare(e.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return Text$1.empty;
    let e = this;
    for (; e.parent; )
      e = e.parent;
    let { view: r } = e, R = r && r.state.doc, B = this.posAtStart;
    return R ? R.slice(B, B + this.length) : Text$1.empty;
  }
  domAtPos(e) {
    return (this.length ? e == 0 : this.side > 0) ? DOMPos.before(this.dom) : DOMPos.after(this.dom, e == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e, r) {
    let R = this.widget.coordsAt(this.dom, e, r);
    if (R)
      return R;
    let B = this.dom.getClientRects(), _ = null;
    if (!B.length)
      return null;
    let $ = this.side ? this.side < 0 : e > 0;
    for (let F = $ ? B.length - 1 : 0; _ = B[F], !(e > 0 ? F == 0 : F == B.length - 1 || _.top < _.bottom); F += $ ? -1 : 1)
      ;
    return flattenRect(_, !$);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class WidgetBufferView extends ContentView {
  constructor(e) {
    super(), this.side = e;
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(e) {
    return e instanceof WidgetBufferView && e.side == this.side;
  }
  split() {
    return new WidgetBufferView(this.side);
  }
  sync() {
    if (!this.dom) {
      let e = document.createElement("img");
      e.className = "cm-widgetBuffer", e.setAttribute("aria-hidden", "true"), this.setDOM(e);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(e) {
    return this.side > 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e) {
    return this.dom.getBoundingClientRect();
  }
  get overrideDOMText() {
    return Text$1.empty;
  }
  get isHidden() {
    return !0;
  }
}
TextView.prototype.children = WidgetView.prototype.children = WidgetBufferView.prototype.children = noChildren;
function inlineDOMAtPos(s, e) {
  let r = s.dom, { children: R } = s, B = 0;
  for (let _ = 0; B < R.length; B++) {
    let $ = R[B], F = _ + $.length;
    if (!(F == _ && $.getSide() <= 0)) {
      if (e > _ && e < F && $.dom.parentNode == r)
        return $.domAtPos(e - _);
      if (e <= _)
        break;
      _ = F;
    }
  }
  for (let _ = B; _ > 0; _--) {
    let $ = R[_ - 1];
    if ($.dom.parentNode == r)
      return $.domAtPos($.length);
  }
  for (let _ = B; _ < R.length; _++) {
    let $ = R[_];
    if ($.dom.parentNode == r)
      return $.domAtPos(0);
  }
  return new DOMPos(r, 0);
}
function joinInlineInto(s, e, r) {
  let R, { children: B } = s;
  r > 0 && e instanceof MarkView && B.length && (R = B[B.length - 1]) instanceof MarkView && R.mark.eq(e.mark) ? joinInlineInto(R, e.children[0], r - 1) : (B.push(e), e.setParent(s)), s.length += e.length;
}
function coordsInChildren(s, e, r) {
  let R = null, B = -1, _ = null, $ = -1;
  function F(H, W) {
    for (let U = 0, z = 0; U < H.children.length && z <= W; U++) {
      let K = H.children[U], X = z + K.length;
      X >= W && (K.children.length ? F(K, W - z) : (!_ || _.isHidden && r > 0) && (X > W || z == X && K.getSide() > 0) ? (_ = K, $ = W - z) : (z < W || z == X && K.getSide() < 0 && !K.isHidden) && (R = K, B = W - z)), z = X;
    }
  }
  F(s, e);
  let V = (r < 0 ? R : _) || R || _;
  return V ? V.coordsAt(Math.max(0, V == R ? B : $), r) : fallbackRect(s);
}
function fallbackRect(s) {
  let e = s.dom.lastChild;
  if (!e)
    return s.dom.getBoundingClientRect();
  let r = clientRectsFor(e);
  return r[r.length - 1] || null;
}
function combineAttrs(s, e) {
  for (let r in s)
    r == "class" && e.class ? e.class += " " + s.class : r == "style" && e.style ? e.style += ";" + s.style : e[r] = s[r];
  return e;
}
const noAttrs$1 = /* @__PURE__ */ Object.create(null);
function attrsEq(s, e, r) {
  if (s == e)
    return !0;
  s || (s = noAttrs$1), e || (e = noAttrs$1);
  let R = Object.keys(s), B = Object.keys(e);
  if (R.length - (r && R.indexOf(r) > -1 ? 1 : 0) != B.length - (r && B.indexOf(r) > -1 ? 1 : 0))
    return !1;
  for (let _ of R)
    if (_ != r && (B.indexOf(_) == -1 || s[_] !== e[_]))
      return !1;
  return !0;
}
function updateAttrs(s, e, r) {
  let R = !1;
  if (e)
    for (let B in e)
      r && B in r || (R = !0, B == "style" ? s.style.cssText = "" : s.removeAttribute(B));
  if (r)
    for (let B in r)
      e && e[B] == r[B] || (R = !0, B == "style" ? s.style.cssText = r[B] : s.setAttribute(B, r[B]));
  return R;
}
function getAttrs(s) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let r = 0; r < s.attributes.length; r++) {
    let R = s.attributes[r];
    e[R.name] = R.value;
  }
  return e;
}
class WidgetType {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, r) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, r, R) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var BlockType = /* @__PURE__ */ function(s) {
  return s[s.Text = 0] = "Text", s[s.WidgetBefore = 1] = "WidgetBefore", s[s.WidgetAfter = 2] = "WidgetAfter", s[s.WidgetRange = 3] = "WidgetRange", s;
}(BlockType || (BlockType = {}));
class Decoration extends RangeValue {
  constructor(e, r, R, B) {
    super(), this.startSide = e, this.endSide = r, this.widget = R, this.spec = B;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new MarkDecoration(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let r = Math.max(-1e4, Math.min(1e4, e.side || 0)), R = !!e.block;
    return r += R && !e.inlineOrder ? r > 0 ? 3e8 : -4e8 : r > 0 ? 1e8 : -1e8, new PointDecoration(e, r, r, R, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let r = !!e.block, R, B;
    if (e.isBlockGap)
      R = -5e8, B = 4e8;
    else {
      let { start: _, end: $ } = getInclusive(e, r);
      R = (_ ? r ? -3e8 : -1 : 5e8) - 1, B = ($ ? r ? 2e8 : 1 : -6e8) + 1;
    }
    return new PointDecoration(e, R, B, r, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new LineDecoration(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, r = !1) {
    return RangeSet.of(e, r);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
Decoration.none = RangeSet.empty;
class MarkDecoration extends Decoration {
  constructor(e) {
    let { start: r, end: R } = getInclusive(e);
    super(r ? -1 : 5e8, R ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.class = e.class || "", this.attrs = e.attributes || null;
  }
  eq(e) {
    var r, R;
    return this == e || e instanceof MarkDecoration && this.tagName == e.tagName && (this.class || ((r = this.attrs) === null || r === void 0 ? void 0 : r.class)) == (e.class || ((R = e.attrs) === null || R === void 0 ? void 0 : R.class)) && attrsEq(this.attrs, e.attrs, "class");
  }
  range(e, r = e) {
    if (e >= r)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, r);
  }
}
MarkDecoration.prototype.point = !1;
class LineDecoration extends Decoration {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof LineDecoration && this.spec.class == e.spec.class && attrsEq(this.spec.attributes, e.spec.attributes);
  }
  range(e, r = e) {
    if (r != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, r);
  }
}
LineDecoration.prototype.mapMode = MapMode.TrackBefore;
LineDecoration.prototype.point = !0;
class PointDecoration extends Decoration {
  constructor(e, r, R, B, _, $) {
    super(r, R, _, e), this.block = B, this.isReplace = $, this.mapMode = B ? r <= 0 ? MapMode.TrackBefore : MapMode.TrackAfter : MapMode.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? BlockType.WidgetRange : this.startSide <= 0 ? BlockType.WidgetBefore : BlockType.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof PointDecoration && widgetsEq(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, r = e) {
    if (this.isReplace && (e > r || e == r && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && r != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, r);
  }
}
PointDecoration.prototype.point = !0;
function getInclusive(s, e = !1) {
  let { inclusiveStart: r, inclusiveEnd: R } = s;
  return r == null && (r = s.inclusive), R == null && (R = s.inclusive), { start: r ?? e, end: R ?? e };
}
function widgetsEq(s, e) {
  return s == e || !!(s && e && s.compare(e));
}
function addRange(s, e, r, R = 0) {
  let B = r.length - 1;
  B >= 0 && r[B] + R >= s ? r[B] = Math.max(r[B], e) : r.push(s, e);
}
class LineView extends ContentView {
  constructor() {
    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
  }
  // Consumes source
  merge(e, r, R, B, _, $) {
    if (R) {
      if (!(R instanceof LineView))
        return !1;
      this.dom || R.transferDOM(this);
    }
    return B && this.setDeco(R ? R.attrs : null), mergeChildrenInto(this, e, r, R ? R.children.slice() : [], _, $), !0;
  }
  split(e) {
    let r = new LineView();
    if (r.breakAfter = this.breakAfter, this.length == 0)
      return r;
    let { i: R, off: B } = this.childPos(e);
    B && (r.append(this.children[R].split(B), 0), this.children[R].merge(B, this.children[R].length, null, !1, 0, 0), R++);
    for (let _ = R; _ < this.children.length; _++)
      r.append(this.children[_], 0);
    for (; R > 0 && this.children[R - 1].length == 0; )
      this.children[--R].destroy();
    return this.children.length = R, this.markDirty(), this.length = e, r;
  }
  transferDOM(e) {
    this.dom && (this.markDirty(), e.setDOM(this.dom), e.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
  }
  setDeco(e) {
    attrsEq(this.attrs, e) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = e);
  }
  append(e, r) {
    joinInlineInto(this, e, r);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(e) {
    let r = e.spec.attributes, R = e.spec.class;
    r && (this.attrs = combineAttrs(r, this.attrs || {})), R && (this.attrs = combineAttrs({ class: R }, this.attrs || {}));
  }
  domAtPos(e) {
    return inlineDOMAtPos(this, e);
  }
  reuseDOM(e) {
    e.nodeName == "DIV" && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, r) {
    var R;
    this.dom ? this.flags & 4 && (clearAttributes(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), this.prevAttrs !== void 0 && (updateAttrs(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(e, r);
    let B = this.dom.lastChild;
    for (; B && ContentView.get(B) instanceof MarkView; )
      B = B.lastChild;
    if (!B || !this.length || B.nodeName != "BR" && ((R = ContentView.get(B)) === null || R === void 0 ? void 0 : R.isEditable) == !1 && (!browser.ios || !this.children.some((_) => _ instanceof TextView))) {
      let _ = document.createElement("BR");
      _.cmIgnore = !0, this.dom.appendChild(_);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let e = 0, r;
    for (let R of this.children) {
      if (!(R instanceof TextView) || /[^ -~]/.test(R.text))
        return null;
      let B = clientRectsFor(R.dom);
      if (B.length != 1)
        return null;
      e += B[0].width, r = B[0].height;
    }
    return e ? {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: e / this.length,
      textHeight: r
    } : null;
  }
  coordsAt(e, r) {
    let R = coordsInChildren(this, e, r);
    if (!this.children.length && R && this.parent) {
      let { heightOracle: B } = this.parent.view.viewState, _ = R.bottom - R.top;
      if (Math.abs(_ - B.lineHeight) < 2 && B.textHeight < _) {
        let $ = (_ - B.textHeight) / 2;
        return { top: R.top + $, bottom: R.bottom - $, left: R.left, right: R.left };
      }
    }
    return R;
  }
  become(e) {
    return e instanceof LineView && this.children.length == 0 && e.children.length == 0 && attrsEq(this.attrs, e.attrs) && this.breakAfter == e.breakAfter;
  }
  covers() {
    return !0;
  }
  static find(e, r) {
    for (let R = 0, B = 0; R < e.children.length; R++) {
      let _ = e.children[R], $ = B + _.length;
      if ($ >= r) {
        if (_ instanceof LineView)
          return _;
        if ($ > r)
          break;
      }
      B = $ + _.breakAfter;
    }
    return null;
  }
}
class BlockWidgetView extends ContentView {
  constructor(e, r, R) {
    super(), this.widget = e, this.length = r, this.deco = R, this.breakAfter = 0, this.prevWidget = null;
  }
  merge(e, r, R, B, _, $) {
    return R && (!(R instanceof BlockWidgetView) || !this.widget.compare(R.widget) || e > 0 && _ <= 0 || r < this.length && $ <= 0) ? !1 : (this.length = e + (R ? R.length : 0) + (this.length - r), !0);
  }
  domAtPos(e) {
    return e == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, e == this.length);
  }
  split(e) {
    let r = this.length - e;
    this.length = e;
    let R = new BlockWidgetView(this.widget, r, this.deco);
    return R.breakAfter = this.breakAfter, R;
  }
  get children() {
    return noChildren;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : Text$1.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(e) {
    return e instanceof BlockWidgetView && e.widget.constructor == this.widget.constructor ? (e.widget.compare(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, this.deco = e.deco, this.breakAfter = e.breakAfter, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  coordsAt(e, r) {
    let R = this.widget.coordsAt(this.dom, e, r);
    return R || (this.widget instanceof BlockGapWidget ? null : flattenRect(this.dom.getBoundingClientRect(), this.length ? e == 0 : r <= 0));
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
  covers(e) {
    let { startSide: r, endSide: R } = this.deco;
    return r == R ? !1 : e < 0 ? r < 0 : R > 0;
  }
}
class BlockGapWidget extends WidgetType {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
class ContentBuilder {
  constructor(e, r, R, B) {
    this.doc = e, this.pos = r, this.end = R, this.disallowBlockEffectsFor = B, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.bufferMarks = [], this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = e.iter(), this.skip = r;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let e = this.content[this.content.length - 1];
    return !(e.breakAfter || e instanceof BlockWidgetView && e.deco.endSide < 0);
  }
  getLine() {
    return this.curLine || (this.content.push(this.curLine = new LineView()), this.atCursorPos = !0), this.curLine;
  }
  flushBuffer(e = this.bufferMarks) {
    this.pendingBuffer && (this.curLine.append(wrapMarks(new WidgetBufferView(-1), e), e.length), this.pendingBuffer = 0);
  }
  addBlockWidget(e) {
    this.flushBuffer(), this.curLine = null, this.content.push(e);
  }
  finish(e) {
    this.pendingBuffer && e <= this.bufferMarks.length ? this.flushBuffer() : this.pendingBuffer = 0, !this.posCovered() && !(e && this.content.length && this.content[this.content.length - 1] instanceof BlockWidgetView) && this.getLine();
  }
  buildText(e, r, R) {
    for (; e > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: _, lineBreak: $, done: F } = this.cursor.next(this.skip);
        if (this.skip = 0, F)
          throw new Error("Ran out of text content when drawing inline views");
        if ($) {
          this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer(), this.curLine = null, this.atCursorPos = !0, e--;
          continue;
        } else
          this.text = _, this.textOff = 0;
      }
      let B = Math.min(
        this.text.length - this.textOff,
        e,
        512
        /* T.Chunk */
      );
      this.flushBuffer(r.slice(r.length - R)), this.getLine().append(wrapMarks(new TextView(this.text.slice(this.textOff, this.textOff + B)), r), R), this.atCursorPos = !0, this.textOff += B, e -= B, R = 0;
    }
  }
  span(e, r, R, B) {
    this.buildText(r - e, R, B), this.pos = r, this.openStart < 0 && (this.openStart = B);
  }
  point(e, r, R, B, _, $) {
    if (this.disallowBlockEffectsFor[$] && R instanceof PointDecoration) {
      if (R.block)
        throw new RangeError("Block decorations may not be specified via plugins");
      if (r > this.doc.lineAt(this.pos).to)
        throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
    }
    let F = r - e;
    if (R instanceof PointDecoration)
      if (R.block)
        R.startSide > 0 && !this.posCovered() && this.getLine(), this.addBlockWidget(new BlockWidgetView(R.widget || NullWidget.block, F, R));
      else {
        let V = WidgetView.create(R.widget || NullWidget.inline, F, F ? 0 : R.startSide), H = this.atCursorPos && !V.isEditable && _ <= B.length && (e < r || R.startSide > 0), W = !V.isEditable && (e < r || _ > B.length || R.startSide <= 0), U = this.getLine();
        this.pendingBuffer == 2 && !H && !V.isEditable && (this.pendingBuffer = 0), this.flushBuffer(B), H && (U.append(wrapMarks(new WidgetBufferView(1), B), _), _ = B.length + Math.max(0, _ - B.length)), U.append(wrapMarks(V, B), _), this.atCursorPos = W, this.pendingBuffer = W ? e < r || _ > B.length ? 1 : 2 : 0, this.pendingBuffer && (this.bufferMarks = B.slice());
      }
    else this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(R);
    F && (this.textOff + F <= this.text.length ? this.textOff += F : (this.skip += F - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = r), this.openStart < 0 && (this.openStart = _);
  }
  static build(e, r, R, B, _) {
    let $ = new ContentBuilder(e, r, R, _);
    return $.openEnd = RangeSet.spans(B, r, R, $), $.openStart < 0 && ($.openStart = $.openEnd), $.finish($.openEnd), $;
  }
}
function wrapMarks(s, e) {
  for (let r of e)
    s = new MarkView(r, [s], s.length);
  return s;
}
class NullWidget extends WidgetType {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
NullWidget.inline = /* @__PURE__ */ new NullWidget("span");
NullWidget.block = /* @__PURE__ */ new NullWidget("div");
var Direction = /* @__PURE__ */ function(s) {
  return s[s.LTR = 0] = "LTR", s[s.RTL = 1] = "RTL", s;
}(Direction || (Direction = {}));
const LTR = Direction.LTR, RTL = Direction.RTL;
function dec(s) {
  let e = [];
  for (let r = 0; r < s.length; r++)
    e.push(1 << +s[r]);
  return e;
}
const LowTypes = /* @__PURE__ */ dec("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), ArabicTypes = /* @__PURE__ */ dec("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), Brackets = /* @__PURE__ */ Object.create(null), BracketStack = [];
for (let s of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ s.charCodeAt(0), r = /* @__PURE__ */ s.charCodeAt(1);
  Brackets[e] = r, Brackets[r] = -e;
}
function charType(s) {
  return s <= 247 ? LowTypes[s] : 1424 <= s && s <= 1524 ? 2 : 1536 <= s && s <= 1785 ? ArabicTypes[s - 1536] : 1774 <= s && s <= 2220 ? 4 : 8192 <= s && s <= 8204 ? 256 : 64336 <= s && s <= 65023 ? 4 : 1;
}
const BidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class BidiSpan {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? RTL : LTR;
  }
  /**
  @internal
  */
  constructor(e, r, R) {
    this.from = e, this.to = r, this.level = R;
  }
  /**
  @internal
  */
  side(e, r) {
    return this.dir == r == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, r) {
    return e == (this.dir == r);
  }
  /**
  @internal
  */
  static find(e, r, R, B) {
    let _ = -1;
    for (let $ = 0; $ < e.length; $++) {
      let F = e[$];
      if (F.from <= r && F.to >= r) {
        if (F.level == R)
          return $;
        (_ < 0 || (B != 0 ? B < 0 ? F.from < r : F.to > r : e[_].level > F.level)) && (_ = $);
      }
    }
    if (_ < 0)
      throw new RangeError("Index out of range");
    return _;
  }
}
function isolatesEq(s, e) {
  if (s.length != e.length)
    return !1;
  for (let r = 0; r < s.length; r++) {
    let R = s[r], B = e[r];
    if (R.from != B.from || R.to != B.to || R.direction != B.direction || !isolatesEq(R.inner, B.inner))
      return !1;
  }
  return !0;
}
const types = [];
function computeCharTypes(s, e, r, R, B) {
  for (let _ = 0; _ <= R.length; _++) {
    let $ = _ ? R[_ - 1].to : e, F = _ < R.length ? R[_].from : r, V = _ ? 256 : B;
    for (let H = $, W = V, U = V; H < F; H++) {
      let z = charType(s.charCodeAt(H));
      z == 512 ? z = W : z == 8 && U == 4 && (z = 16), types[H] = z == 4 ? 2 : z, z & 7 && (U = z), W = z;
    }
    for (let H = $, W = V, U = V; H < F; H++) {
      let z = types[H];
      if (z == 128)
        H < F - 1 && W == types[H + 1] && W & 24 ? z = types[H] = W : types[H] = 256;
      else if (z == 64) {
        let K = H + 1;
        for (; K < F && types[K] == 64; )
          K++;
        let X = H && W == 8 || K < r && types[K] == 8 ? U == 1 ? 1 : 8 : 256;
        for (let Z = H; Z < K; Z++)
          types[Z] = X;
        H = K - 1;
      } else z == 8 && U == 1 && (types[H] = 1);
      W = z, z & 7 && (U = z);
    }
  }
}
function processBracketPairs(s, e, r, R, B) {
  let _ = B == 1 ? 2 : 1;
  for (let $ = 0, F = 0, V = 0; $ <= R.length; $++) {
    let H = $ ? R[$ - 1].to : e, W = $ < R.length ? R[$].from : r;
    for (let U = H, z, K, X; U < W; U++)
      if (K = Brackets[z = s.charCodeAt(U)])
        if (K < 0) {
          for (let Z = F - 3; Z >= 0; Z -= 3)
            if (BracketStack[Z + 1] == -K) {
              let Y = BracketStack[Z + 2], te = Y & 2 ? B : Y & 4 ? Y & 1 ? _ : B : 0;
              te && (types[U] = types[BracketStack[Z]] = te), F = Z;
              break;
            }
        } else {
          if (BracketStack.length == 189)
            break;
          BracketStack[F++] = U, BracketStack[F++] = z, BracketStack[F++] = V;
        }
      else if ((X = types[U]) == 2 || X == 1) {
        let Z = X == B;
        V = Z ? 0 : 1;
        for (let Y = F - 3; Y >= 0; Y -= 3) {
          let te = BracketStack[Y + 2];
          if (te & 2)
            break;
          if (Z)
            BracketStack[Y + 2] |= 2;
          else {
            if (te & 4)
              break;
            BracketStack[Y + 2] |= 4;
          }
        }
      }
  }
}
function processNeutrals(s, e, r, R) {
  for (let B = 0, _ = R; B <= r.length; B++) {
    let $ = B ? r[B - 1].to : s, F = B < r.length ? r[B].from : e;
    for (let V = $; V < F; ) {
      let H = types[V];
      if (H == 256) {
        let W = V + 1;
        for (; ; )
          if (W == F) {
            if (B == r.length)
              break;
            W = r[B++].to, F = B < r.length ? r[B].from : e;
          } else if (types[W] == 256)
            W++;
          else
            break;
        let U = _ == 1, z = (W < e ? types[W] : R) == 1, K = U == z ? U ? 1 : 2 : R;
        for (let X = W, Z = B, Y = Z ? r[Z - 1].to : s; X > V; )
          X == Y && (X = r[--Z].from, Y = Z ? r[Z - 1].to : s), types[--X] = K;
        V = W;
      } else
        _ = H, V++;
    }
  }
}
function emitSpans(s, e, r, R, B, _, $) {
  let F = R % 2 ? 2 : 1;
  if (R % 2 == B % 2)
    for (let V = e, H = 0; V < r; ) {
      let W = !0, U = !1;
      if (H == _.length || V < _[H].from) {
        let Z = types[V];
        Z != F && (W = !1, U = Z == 16);
      }
      let z = !W && F == 1 ? [] : null, K = W ? R : R + 1, X = V;
      e: for (; ; )
        if (H < _.length && X == _[H].from) {
          if (U)
            break e;
          let Z = _[H];
          if (!W)
            for (let Y = Z.to, te = H + 1; ; ) {
              if (Y == r)
                break e;
              if (te < _.length && _[te].from == Y)
                Y = _[te++].to;
              else {
                if (types[Y] == F)
                  break e;
                break;
              }
            }
          if (H++, z)
            z.push(Z);
          else {
            Z.from > V && $.push(new BidiSpan(V, Z.from, K));
            let Y = Z.direction == LTR != !(K % 2);
            computeSectionOrder(s, Y ? R + 1 : R, B, Z.inner, Z.from, Z.to, $), V = Z.to;
          }
          X = Z.to;
        } else {
          if (X == r || (W ? types[X] != F : types[X] == F))
            break;
          X++;
        }
      z ? emitSpans(s, V, X, R + 1, B, z, $) : V < X && $.push(new BidiSpan(V, X, K)), V = X;
    }
  else
    for (let V = r, H = _.length; V > e; ) {
      let W = !0, U = !1;
      if (!H || V > _[H - 1].to) {
        let Z = types[V - 1];
        Z != F && (W = !1, U = Z == 16);
      }
      let z = !W && F == 1 ? [] : null, K = W ? R : R + 1, X = V;
      e: for (; ; )
        if (H && X == _[H - 1].to) {
          if (U)
            break e;
          let Z = _[--H];
          if (!W)
            for (let Y = Z.from, te = H; ; ) {
              if (Y == e)
                break e;
              if (te && _[te - 1].to == Y)
                Y = _[--te].from;
              else {
                if (types[Y - 1] == F)
                  break e;
                break;
              }
            }
          if (z)
            z.push(Z);
          else {
            Z.to < V && $.push(new BidiSpan(Z.to, V, K));
            let Y = Z.direction == LTR != !(K % 2);
            computeSectionOrder(s, Y ? R + 1 : R, B, Z.inner, Z.from, Z.to, $), V = Z.from;
          }
          X = Z.from;
        } else {
          if (X == e || (W ? types[X - 1] != F : types[X - 1] == F))
            break;
          X--;
        }
      z ? emitSpans(s, X, V, R + 1, B, z, $) : X < V && $.push(new BidiSpan(X, V, K)), V = X;
    }
}
function computeSectionOrder(s, e, r, R, B, _, $) {
  let F = e % 2 ? 2 : 1;
  computeCharTypes(s, B, _, R, F), processBracketPairs(s, B, _, R, F), processNeutrals(B, _, R, F), emitSpans(s, B, _, e, r, R, $);
}
function computeOrder(s, e, r) {
  if (!s)
    return [new BidiSpan(0, 0, e == RTL ? 1 : 0)];
  if (e == LTR && !r.length && !BidiRE.test(s))
    return trivialOrder(s.length);
  if (r.length)
    for (; s.length > types.length; )
      types[types.length] = 256;
  let R = [], B = e == LTR ? 0 : 1;
  return computeSectionOrder(s, B, B, r, 0, s.length, R), R;
}
function trivialOrder(s) {
  return [new BidiSpan(0, s, 0)];
}
let movedOver = "";
function moveVisually(s, e, r, R, B) {
  var _;
  let $ = R.head - s.from, F = BidiSpan.find(e, $, (_ = R.bidiLevel) !== null && _ !== void 0 ? _ : -1, R.assoc), V = e[F], H = V.side(B, r);
  if ($ == H) {
    let z = F += B ? 1 : -1;
    if (z < 0 || z >= e.length)
      return null;
    V = e[F = z], $ = V.side(!B, r), H = V.side(B, r);
  }
  let W = findClusterBreak(s.text, $, V.forward(B, r));
  (W < V.from || W > V.to) && (W = H), movedOver = s.text.slice(Math.min($, W), Math.max($, W));
  let U = F == (B ? e.length - 1 : 0) ? null : e[F + (B ? 1 : -1)];
  return U && W == H && U.level + (B ? 0 : 1) < V.level ? EditorSelection.cursor(U.side(!B, r) + s.from, U.forward(B, r) ? 1 : -1, U.level) : EditorSelection.cursor(W + s.from, V.forward(B, r) ? -1 : 1, V.level);
}
function autoDirection(s, e, r) {
  for (let R = e; R < r; R++) {
    let B = charType(s.charCodeAt(R));
    if (B == 1)
      return LTR;
    if (B == 2 || B == 4)
      return RTL;
  }
  return LTR;
}
const clickAddsSelectionRange = /* @__PURE__ */ Facet.define(), dragMovesSelection$1 = /* @__PURE__ */ Facet.define(), mouseSelectionStyle = /* @__PURE__ */ Facet.define(), exceptionSink = /* @__PURE__ */ Facet.define(), updateListener = /* @__PURE__ */ Facet.define(), inputHandler$1 = /* @__PURE__ */ Facet.define(), focusChangeEffect = /* @__PURE__ */ Facet.define(), clipboardInputFilter = /* @__PURE__ */ Facet.define(), clipboardOutputFilter = /* @__PURE__ */ Facet.define(), perLineTextDirection = /* @__PURE__ */ Facet.define({
  combine: (s) => s.some((e) => e)
}), nativeSelectionHidden = /* @__PURE__ */ Facet.define({
  combine: (s) => s.some((e) => e)
}), scrollHandler = /* @__PURE__ */ Facet.define();
class ScrollTarget {
  constructor(e, r = "nearest", R = "nearest", B = 5, _ = 5, $ = !1) {
    this.range = e, this.y = r, this.x = R, this.yMargin = B, this.xMargin = _, this.isSnapshot = $;
  }
  map(e) {
    return e.empty ? this : new ScrollTarget(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new ScrollTarget(EditorSelection.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const scrollIntoView$1 = /* @__PURE__ */ StateEffect.define({ map: (s, e) => s.map(e) }), setEditContextFormatting = /* @__PURE__ */ StateEffect.define();
function logException(s, e, r) {
  let R = s.facet(exceptionSink);
  R.length ? R[0](e) : window.onerror ? window.onerror(String(e), r, void 0, void 0, e) : r ? console.error(r + ":", e) : console.error(e);
}
const editable = /* @__PURE__ */ Facet.define({ combine: (s) => s.length ? s[0] : !0 });
let nextPluginID = 0;
const viewPlugin = /* @__PURE__ */ Facet.define();
class ViewPlugin {
  constructor(e, r, R, B, _) {
    this.id = e, this.create = r, this.domEventHandlers = R, this.domEventObservers = B, this.extension = _(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, r) {
    const { eventHandlers: R, eventObservers: B, provide: _, decorations: $ } = r || {};
    return new ViewPlugin(nextPluginID++, e, R, B, (F) => {
      let V = [viewPlugin.of(F)];
      return $ && V.push(decorations.of((H) => {
        let W = H.plugin(F);
        return W ? $(W) : Decoration.none;
      })), _ && V.push(_(F)), V;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, r) {
    return ViewPlugin.define((R) => new e(R), r);
  }
}
class PluginInstance {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let r = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(r);
          } catch (R) {
            if (logException(r.state, R, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(e);
      } catch (r) {
        logException(e.state, r, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var r;
    if (!((r = this.value) === null || r === void 0) && r.destroy)
      try {
        this.value.destroy();
      } catch (R) {
        logException(e.state, R, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const editorAttributes = /* @__PURE__ */ Facet.define(), contentAttributes = /* @__PURE__ */ Facet.define(), decorations = /* @__PURE__ */ Facet.define(), outerDecorations = /* @__PURE__ */ Facet.define(), atomicRanges = /* @__PURE__ */ Facet.define(), bidiIsolatedRanges = /* @__PURE__ */ Facet.define();
function getIsolatedRanges(s, e) {
  let r = s.state.facet(bidiIsolatedRanges);
  if (!r.length)
    return r;
  let R = r.map((_) => _ instanceof Function ? _(s) : _), B = [];
  return RangeSet.spans(R, e.from, e.to, {
    point() {
    },
    span(_, $, F, V) {
      let H = _ - e.from, W = $ - e.from, U = B;
      for (let z = F.length - 1; z >= 0; z--, V--) {
        let K = F[z].spec.bidiIsolate, X;
        if (K == null && (K = autoDirection(e.text, H, W)), V > 0 && U.length && (X = U[U.length - 1]).to == H && X.direction == K)
          X.to = W, U = X.inner;
        else {
          let Z = { from: H, to: W, direction: K, inner: [] };
          U.push(Z), U = Z.inner;
        }
      }
    }
  }), B;
}
const scrollMargins = /* @__PURE__ */ Facet.define();
function getScrollMargins(s) {
  let e = 0, r = 0, R = 0, B = 0;
  for (let _ of s.state.facet(scrollMargins)) {
    let $ = _(s);
    $ && ($.left != null && (e = Math.max(e, $.left)), $.right != null && (r = Math.max(r, $.right)), $.top != null && (R = Math.max(R, $.top)), $.bottom != null && (B = Math.max(B, $.bottom)));
  }
  return { left: e, right: r, top: R, bottom: B };
}
const styleModule = /* @__PURE__ */ Facet.define();
class ChangedRange {
  constructor(e, r, R, B) {
    this.fromA = e, this.toA = r, this.fromB = R, this.toB = B;
  }
  join(e) {
    return new ChangedRange(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let r = e.length, R = this;
    for (; r > 0; r--) {
      let B = e[r - 1];
      if (!(B.fromA > R.toA)) {
        if (B.toA < R.fromA)
          break;
        R = R.join(B), e.splice(r - 1, 1);
      }
    }
    return e.splice(r, 0, R), e;
  }
  static extendWithRanges(e, r) {
    if (r.length == 0)
      return e;
    let R = [];
    for (let B = 0, _ = 0, $ = 0, F = 0; ; B++) {
      let V = B == e.length ? null : e[B], H = $ - F, W = V ? V.fromB : 1e9;
      for (; _ < r.length && r[_] < W; ) {
        let U = r[_], z = r[_ + 1], K = Math.max(F, U), X = Math.min(W, z);
        if (K <= X && new ChangedRange(K + H, X + H, K, X).addToSet(R), z > W)
          break;
        _ += 2;
      }
      if (!V)
        return R;
      new ChangedRange(V.fromA, V.toA, V.fromB, V.toB).addToSet(R), $ = V.toA, F = V.toB;
    }
  }
}
class ViewUpdate {
  constructor(e, r, R) {
    this.view = e, this.state = r, this.transactions = R, this.flags = 0, this.startState = e.state, this.changes = ChangeSet.empty(this.startState.doc.length);
    for (let _ of R)
      this.changes = this.changes.compose(_.changes);
    let B = [];
    this.changes.iterChangedRanges((_, $, F, V) => B.push(new ChangedRange(_, $, F, V))), this.changedRanges = B;
  }
  /**
  @internal
  */
  static create(e, r, R) {
    return new ViewUpdate(e, r, R);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Returns true when
  [`viewportChanged`](https://codemirror.net/6/docs/ref/#view.ViewUpdate.viewportChanged) is true
  and the viewport change is not just the result of mapping it in
  response to document changes.
  */
  get viewportMoved() {
    return (this.flags & 8) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 18) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
class DocView extends ContentView {
  get length() {
    return this.view.state.doc.length;
  }
  constructor(e) {
    super(), this.view = e, this.decorations = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.markedForComposition = /* @__PURE__ */ new Set(), this.editContextFormatting = Decoration.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(e.contentDOM), this.children = [new LineView()], this.children[0].setParent(this), this.updateDeco(), this.updateInner([new ChangedRange(0, 0, 0, e.state.doc.length)], 0, null);
  }
  // Update the document view to a given state.
  update(e) {
    var r;
    let R = e.changedRanges;
    this.minWidth > 0 && R.length && (R.every(({ fromA: H, toA: W }) => W < this.minWidthFrom || H > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
    let B = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((r = this.domChanged) === null || r === void 0) && r.newSel ? B = this.domChanged.newSel.head : !touchesComposition(e.changes, this.hasComposition) && !e.selectionSet && (B = e.state.selection.main.head));
    let _ = B > -1 ? findCompositionRange(this.view, e.changes, B) : null;
    if (this.domChanged = null, this.hasComposition) {
      this.markedForComposition.clear();
      let { from: H, to: W } = this.hasComposition;
      R = new ChangedRange(H, W, e.changes.mapPos(H, -1), e.changes.mapPos(W, 1)).addToSet(R.slice());
    }
    this.hasComposition = _ ? { from: _.range.fromB, to: _.range.toB } : null, (browser.ie || browser.chrome) && !_ && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let $ = this.decorations, F = this.updateDeco(), V = findChangedDeco($, F, e.changes);
    return R = ChangedRange.extendWithRanges(R, V), !(this.flags & 7) && R.length == 0 ? !1 : (this.updateInner(R, e.startState.doc.length, _), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, r, R) {
    this.view.viewState.mustMeasureContent = !0, this.updateChildren(e, r, R);
    let { observer: B } = this.view;
    B.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let $ = browser.chrome || browser.ios ? { node: B.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(this.view, $), this.flags &= -8, $ && ($.written || B.selectionRange.focusNode != $.node) && (this.forceSelection = !0), this.dom.style.height = "";
    }), this.markedForComposition.forEach(
      ($) => $.flags &= -9
      /* ViewFlag.Composition */
    );
    let _ = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let $ of this.children)
        $ instanceof BlockWidgetView && $.widget instanceof BlockGapWidget && _.push($.dom);
    B.updateGaps(_);
  }
  updateChildren(e, r, R) {
    let B = R ? R.range.addToSet(e.slice()) : e, _ = this.childCursor(r);
    for (let $ = B.length - 1; ; $--) {
      let F = $ >= 0 ? B[$] : null;
      if (!F)
        break;
      let { fromA: V, toA: H, fromB: W, toB: U } = F, z, K, X, Z;
      if (R && R.range.fromB < U && R.range.toB > W) {
        let de = ContentBuilder.build(this.view.state.doc, W, R.range.fromB, this.decorations, this.dynamicDecorationMap), re = ContentBuilder.build(this.view.state.doc, R.range.toB, U, this.decorations, this.dynamicDecorationMap);
        K = de.breakAtStart, X = de.openStart, Z = re.openEnd;
        let ae = this.compositionView(R);
        re.breakAtStart ? ae.breakAfter = 1 : re.content.length && ae.merge(ae.length, ae.length, re.content[0], !1, re.openStart, 0) && (ae.breakAfter = re.content[0].breakAfter, re.content.shift()), de.content.length && ae.merge(0, 0, de.content[de.content.length - 1], !0, 0, de.openEnd) && de.content.pop(), z = de.content.concat(ae).concat(re.content);
      } else
        ({ content: z, breakAtStart: K, openStart: X, openEnd: Z } = ContentBuilder.build(this.view.state.doc, W, U, this.decorations, this.dynamicDecorationMap));
      let { i: Y, off: te } = _.findPos(H, 1), { i: ue, off: fe } = _.findPos(V, -1);
      replaceRange(this, ue, fe, Y, te, z, K, X, Z);
    }
    R && this.fixCompositionDOM(R);
  }
  updateEditContextFormatting(e) {
    this.editContextFormatting = this.editContextFormatting.map(e.changes);
    for (let r of e.transactions)
      for (let R of r.effects)
        R.is(setEditContextFormatting) && (this.editContextFormatting = R.value);
  }
  compositionView(e) {
    let r = new TextView(e.text.nodeValue);
    r.flags |= 8;
    for (let { deco: B } of e.marks)
      r = new MarkView(B, [r], r.length);
    let R = new LineView();
    return R.append(r, 0), R;
  }
  fixCompositionDOM(e) {
    let r = (_, $) => {
      $.flags |= 8 | ($.children.some(
        (V) => V.flags & 7
        /* ViewFlag.Dirty */
      ) ? 1 : 0), this.markedForComposition.add($);
      let F = ContentView.get(_);
      F && F != $ && (F.dom = null), $.setDOM(_);
    }, R = this.childPos(e.range.fromB, 1), B = this.children[R.i];
    r(e.line, B);
    for (let _ = e.marks.length - 1; _ >= -1; _--)
      R = B.childPos(R.off, 1), B = B.children[R.i], r(_ >= 0 ? e.marks[_].node : e.text, B);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, r = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let R = this.view.root.activeElement, B = R == this.dom, _ = !B && !(this.view.state.facet(editable) || this.dom.tabIndex > -1) && hasSelection$1(this.dom, this.view.observer.selectionRange) && !(R && this.dom.contains(R));
    if (!(B || r || _))
      return;
    let $ = this.forceSelection;
    this.forceSelection = !1;
    let F = this.view.state.selection.main, V = this.moveToLine(this.domAtPos(F.anchor)), H = F.empty ? V : this.moveToLine(this.domAtPos(F.head));
    if (browser.gecko && F.empty && !this.hasComposition && betweenUneditable(V)) {
      let U = document.createTextNode("");
      this.view.observer.ignore(() => V.node.insertBefore(U, V.node.childNodes[V.offset] || null)), V = H = new DOMPos(U, 0), $ = !0;
    }
    let W = this.view.observer.selectionRange;
    ($ || !W.focusNode || (!isEquivalentPosition(V.node, V.offset, W.anchorNode, W.anchorOffset) || !isEquivalentPosition(H.node, H.offset, W.focusNode, W.focusOffset)) && !this.suppressWidgetCursorChange(W, F)) && (this.view.observer.ignore(() => {
      browser.android && browser.chrome && this.dom.contains(W.focusNode) && inUneditable(W.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
      let U = getSelection(this.view.root);
      if (U) if (F.empty) {
        if (browser.gecko) {
          let z = nextToUneditable(V.node, V.offset);
          if (z && z != 3) {
            let K = (z == 1 ? textNodeBefore : textNodeAfter)(V.node, V.offset);
            K && (V = new DOMPos(K.node, K.offset));
          }
        }
        U.collapse(V.node, V.offset), F.bidiLevel != null && U.caretBidiLevel !== void 0 && (U.caretBidiLevel = F.bidiLevel);
      } else if (U.extend) {
        U.collapse(V.node, V.offset);
        try {
          U.extend(H.node, H.offset);
        } catch {
        }
      } else {
        let z = document.createRange();
        F.anchor > F.head && ([V, H] = [H, V]), z.setEnd(H.node, H.offset), z.setStart(V.node, V.offset), U.removeAllRanges(), U.addRange(z);
      }
      _ && this.view.root.activeElement == this.dom && (this.dom.blur(), R && R.focus());
    }), this.view.observer.setSelectionRange(V, H)), this.impreciseAnchor = V.precise ? null : new DOMPos(W.anchorNode, W.anchorOffset), this.impreciseHead = H.precise ? null : new DOMPos(W.focusNode, W.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, r) {
    return this.hasComposition && r.empty && isEquivalentPosition(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == r.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, r = e.state.selection.main, R = getSelection(e.root), { anchorNode: B, anchorOffset: _ } = e.observer.selectionRange;
    if (!R || !r.empty || !r.assoc || !R.modify)
      return;
    let $ = LineView.find(this, r.head);
    if (!$)
      return;
    let F = $.posAtStart;
    if (r.head == F || r.head == F + $.length)
      return;
    let V = this.coordsAt(r.head, -1), H = this.coordsAt(r.head, 1);
    if (!V || !H || V.bottom > H.top)
      return;
    let W = this.domAtPos(r.head + r.assoc);
    R.collapse(W.node, W.offset), R.modify("move", r.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let U = e.observer.selectionRange;
    e.docView.posFromDOM(U.anchorNode, U.anchorOffset) != r.from && R.collapse(B, _);
  }
  // If a position is in/near a block widget, move it to a nearby text
  // line, since we don't want the cursor inside a block widget.
  moveToLine(e) {
    let r = this.dom, R;
    if (e.node != r)
      return e;
    for (let B = e.offset; !R && B < r.childNodes.length; B++) {
      let _ = ContentView.get(r.childNodes[B]);
      _ instanceof LineView && (R = _.domAtPos(0));
    }
    for (let B = e.offset - 1; !R && B >= 0; B--) {
      let _ = ContentView.get(r.childNodes[B]);
      _ instanceof LineView && (R = _.domAtPos(_.length));
    }
    return R ? new DOMPos(R.node, R.offset, !0) : e;
  }
  nearest(e) {
    for (let r = e; r; ) {
      let R = ContentView.get(r);
      if (R && R.rootView == this)
        return R;
      r = r.parentNode;
    }
    return null;
  }
  posFromDOM(e, r) {
    let R = this.nearest(e);
    if (!R)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return R.localPosFromDOM(e, r) + R.posAtStart;
  }
  domAtPos(e) {
    let { i: r, off: R } = this.childCursor().findPos(e, -1);
    for (; r < this.children.length - 1; ) {
      let B = this.children[r];
      if (R < B.length || B instanceof LineView)
        break;
      r++, R = 0;
    }
    return this.children[r].domAtPos(R);
  }
  coordsAt(e, r) {
    let R = null, B = 0;
    for (let _ = this.length, $ = this.children.length - 1; $ >= 0; $--) {
      let F = this.children[$], V = _ - F.breakAfter, H = V - F.length;
      if (V < e)
        break;
      if (H <= e && (H < e || F.covers(-1)) && (V > e || F.covers(1)) && (!R || F instanceof LineView && !(R instanceof LineView && r >= 0)))
        R = F, B = H;
      else if (R && H == e && V == e && F instanceof BlockWidgetView && Math.abs(r) < 2) {
        if (F.deco.startSide < 0)
          break;
        $ && (R = null);
      }
      _ = H;
    }
    return R ? R.coordsAt(e - B, r) : null;
  }
  coordsForChar(e) {
    let { i: r, off: R } = this.childPos(e, 1), B = this.children[r];
    if (!(B instanceof LineView))
      return null;
    for (; B.children.length; ) {
      let { i: F, off: V } = B.childPos(R, 1);
      for (; ; F++) {
        if (F == B.children.length)
          return null;
        if ((B = B.children[F]).length)
          break;
      }
      R = V;
    }
    if (!(B instanceof TextView))
      return null;
    let _ = findClusterBreak(B.text, R);
    if (_ == R)
      return null;
    let $ = textRange(B.dom, R, _).getClientRects();
    for (let F = 0; F < $.length; F++) {
      let V = $[F];
      if (F == $.length - 1 || V.top < V.bottom && V.left < V.right)
        return V;
    }
    return null;
  }
  measureVisibleLineHeights(e) {
    let r = [], { from: R, to: B } = e, _ = this.view.contentDOM.clientWidth, $ = _ > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, F = -1, V = this.view.textDirection == Direction.LTR;
    for (let H = 0, W = 0; W < this.children.length; W++) {
      let U = this.children[W], z = H + U.length;
      if (z > B)
        break;
      if (H >= R) {
        let K = U.dom.getBoundingClientRect();
        if (r.push(K.height), $) {
          let X = U.dom.lastChild, Z = X ? clientRectsFor(X) : [];
          if (Z.length) {
            let Y = Z[Z.length - 1], te = V ? Y.right - K.left : K.right - Y.left;
            te > F && (F = te, this.minWidth = _, this.minWidthFrom = H, this.minWidthTo = z);
          }
        }
      }
      H = z + U.breakAfter;
    }
    return r;
  }
  textDirectionAt(e) {
    let { i: r } = this.childPos(e, 1);
    return getComputedStyle(this.children[r].dom).direction == "rtl" ? Direction.RTL : Direction.LTR;
  }
  measureTextSize() {
    for (let _ of this.children)
      if (_ instanceof LineView) {
        let $ = _.measureTextSize();
        if ($)
          return $;
      }
    let e = document.createElement("div"), r, R, B;
    return e.className = "cm-line", e.style.width = "99999px", e.style.position = "absolute", e.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.dom.appendChild(e);
      let _ = clientRectsFor(e.firstChild)[0];
      r = e.getBoundingClientRect().height, R = _ ? _.width / 27 : 7, B = _ ? _.height : r, e.remove();
    }), { lineHeight: r, charWidth: R, textHeight: B };
  }
  childCursor(e = this.length) {
    let r = this.children.length;
    return r && (e -= this.children[--r].length), new ChildCursor(this.children, e, r);
  }
  computeBlockGapDeco() {
    let e = [], r = this.view.viewState;
    for (let R = 0, B = 0; ; B++) {
      let _ = B == r.viewports.length ? null : r.viewports[B], $ = _ ? _.from - 1 : this.length;
      if ($ > R) {
        let F = (r.lineBlockAt($).bottom - r.lineBlockAt(R).top) / this.view.scaleY;
        e.push(Decoration.replace({
          widget: new BlockGapWidget(F),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(R, $));
      }
      if (!_)
        break;
      R = _.to + 1;
    }
    return Decoration.set(e);
  }
  updateDeco() {
    let e = 1, r = this.view.state.facet(decorations).map((_) => (this.dynamicDecorationMap[e++] = typeof _ == "function") ? _(this.view) : _), R = !1, B = this.view.state.facet(outerDecorations).map((_, $) => {
      let F = typeof _ == "function";
      return F && (R = !0), F ? _(this.view) : _;
    });
    for (B.length && (this.dynamicDecorationMap[e++] = R, r.push(RangeSet.join(B))), this.decorations = [
      this.editContextFormatting,
      ...r,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; e < this.decorations.length; )
      this.dynamicDecorationMap[e++] = !1;
    return this.decorations;
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let H = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = H.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    for (let H of this.view.state.facet(scrollHandler))
      try {
        if (H(this.view, e.range, e))
          return !0;
      } catch (W) {
        logException(this.view.state, W, "scroll handler");
      }
    let { range: r } = e, R = this.coordsAt(r.head, r.empty ? r.assoc : r.head > r.anchor ? -1 : 1), B;
    if (!R)
      return;
    !r.empty && (B = this.coordsAt(r.anchor, r.anchor > r.head ? -1 : 1)) && (R = {
      left: Math.min(R.left, B.left),
      top: Math.min(R.top, B.top),
      right: Math.max(R.right, B.right),
      bottom: Math.max(R.bottom, B.bottom)
    });
    let _ = getScrollMargins(this.view), $ = {
      left: R.left - _.left,
      top: R.top - _.top,
      right: R.right + _.right,
      bottom: R.bottom + _.bottom
    }, { offsetWidth: F, offsetHeight: V } = this.view.scrollDOM;
    scrollRectIntoView(this.view.scrollDOM, $, r.head < r.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, F), -F), Math.max(Math.min(e.yMargin, V), -V), this.view.textDirection == Direction.LTR);
  }
}
function betweenUneditable(s) {
  return s.node.nodeType == 1 && s.node.firstChild && (s.offset == 0 || s.node.childNodes[s.offset - 1].contentEditable == "false") && (s.offset == s.node.childNodes.length || s.node.childNodes[s.offset].contentEditable == "false");
}
function findCompositionNode(s, e) {
  let r = s.observer.selectionRange;
  if (!r.focusNode)
    return null;
  let R = textNodeBefore(r.focusNode, r.focusOffset), B = textNodeAfter(r.focusNode, r.focusOffset), _ = R || B;
  if (B && R && B.node != R.node) {
    let F = ContentView.get(B.node);
    if (!F || F instanceof TextView && F.text != B.node.nodeValue)
      _ = B;
    else if (s.docView.lastCompositionAfterCursor) {
      let V = ContentView.get(R.node);
      !V || V instanceof TextView && V.text != R.node.nodeValue || (_ = B);
    }
  }
  if (s.docView.lastCompositionAfterCursor = _ != R, !_)
    return null;
  let $ = e - _.offset;
  return { from: $, to: $ + _.node.nodeValue.length, node: _.node };
}
function findCompositionRange(s, e, r) {
  let R = findCompositionNode(s, r);
  if (!R)
    return null;
  let { node: B, from: _, to: $ } = R, F = B.nodeValue;
  if (/[\n\r]/.test(F) || s.state.doc.sliceString(R.from, R.to) != F)
    return null;
  let V = e.invertedDesc, H = new ChangedRange(V.mapPos(_), V.mapPos($), _, $), W = [];
  for (let U = B.parentNode; ; U = U.parentNode) {
    let z = ContentView.get(U);
    if (z instanceof MarkView)
      W.push({ node: U, deco: z.mark });
    else {
      if (z instanceof LineView || U.nodeName == "DIV" && U.parentNode == s.contentDOM)
        return { range: H, text: B, marks: W, line: U };
      if (U != s.contentDOM)
        W.push({ node: U, deco: new MarkDecoration({
          inclusive: !0,
          attributes: getAttrs(U),
          tagName: U.tagName.toLowerCase()
        }) });
      else
        return null;
    }
  }
}
function nextToUneditable(s, e) {
  return s.nodeType != 1 ? 0 : (e && s.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < s.childNodes.length && s.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let DecorationComparator$1 = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, r) {
    addRange(e, r, this.changes);
  }
  comparePoint(e, r) {
    addRange(e, r, this.changes);
  }
  boundChange(e) {
    addRange(e, e, this.changes);
  }
};
function findChangedDeco(s, e, r) {
  let R = new DecorationComparator$1();
  return RangeSet.compare(s, e, r, R), R.changes;
}
function inUneditable(s, e) {
  for (let r = s; r && r != e; r = r.assignedSlot || r.parentNode)
    if (r.nodeType == 1 && r.contentEditable == "false")
      return !0;
  return !1;
}
function touchesComposition(s, e) {
  let r = !1;
  return e && s.iterChangedRanges((R, B) => {
    R < e.to && B > e.from && (r = !0);
  }), r;
}
function groupAt(s, e, r = 1) {
  let R = s.charCategorizer(e), B = s.doc.lineAt(e), _ = e - B.from;
  if (B.length == 0)
    return EditorSelection.cursor(e);
  _ == 0 ? r = 1 : _ == B.length && (r = -1);
  let $ = _, F = _;
  r < 0 ? $ = findClusterBreak(B.text, _, !1) : F = findClusterBreak(B.text, _);
  let V = R(B.text.slice($, F));
  for (; $ > 0; ) {
    let H = findClusterBreak(B.text, $, !1);
    if (R(B.text.slice(H, $)) != V)
      break;
    $ = H;
  }
  for (; F < B.length; ) {
    let H = findClusterBreak(B.text, F);
    if (R(B.text.slice(F, H)) != V)
      break;
    F = H;
  }
  return EditorSelection.range($ + B.from, F + B.from);
}
function getdx(s, e) {
  return e.left > s ? e.left - s : Math.max(0, s - e.right);
}
function getdy(s, e) {
  return e.top > s ? e.top - s : Math.max(0, s - e.bottom);
}
function yOverlap(s, e) {
  return s.top < e.bottom - 1 && s.bottom > e.top + 1;
}
function upTop(s, e) {
  return e < s.top ? { top: e, left: s.left, right: s.right, bottom: s.bottom } : s;
}
function upBot(s, e) {
  return e > s.bottom ? { top: s.top, left: s.left, right: s.right, bottom: e } : s;
}
function domPosAtCoords(s, e, r) {
  let R, B, _, $, F = !1, V, H, W, U;
  for (let X = s.firstChild; X; X = X.nextSibling) {
    let Z = clientRectsFor(X);
    for (let Y = 0; Y < Z.length; Y++) {
      let te = Z[Y];
      B && yOverlap(B, te) && (te = upTop(upBot(te, B.bottom), B.top));
      let ue = getdx(e, te), fe = getdy(r, te);
      if (ue == 0 && fe == 0)
        return X.nodeType == 3 ? domPosInText(X, e, r) : domPosAtCoords(X, e, r);
      if (!R || $ > fe || $ == fe && _ > ue) {
        R = X, B = te, _ = ue, $ = fe;
        let de = fe ? r < te.top ? -1 : 1 : ue ? e < te.left ? -1 : 1 : 0;
        F = !de || (de > 0 ? Y < Z.length - 1 : Y > 0);
      }
      ue == 0 ? r > te.bottom && (!W || W.bottom < te.bottom) ? (V = X, W = te) : r < te.top && (!U || U.top > te.top) && (H = X, U = te) : W && yOverlap(W, te) ? W = upBot(W, te.bottom) : U && yOverlap(U, te) && (U = upTop(U, te.top));
    }
  }
  if (W && W.bottom >= r ? (R = V, B = W) : U && U.top <= r && (R = H, B = U), !R)
    return { node: s, offset: 0 };
  let z = Math.max(B.left, Math.min(B.right, e));
  if (R.nodeType == 3)
    return domPosInText(R, z, r);
  if (F && R.contentEditable != "false")
    return domPosAtCoords(R, z, r);
  let K = Array.prototype.indexOf.call(s.childNodes, R) + (e >= (B.left + B.right) / 2 ? 1 : 0);
  return { node: s, offset: K };
}
function domPosInText(s, e, r) {
  let R = s.nodeValue.length, B = -1, _ = 1e9, $ = 0;
  for (let F = 0; F < R; F++) {
    let V = textRange(s, F, F + 1).getClientRects();
    for (let H = 0; H < V.length; H++) {
      let W = V[H];
      if (W.top == W.bottom)
        continue;
      $ || ($ = e - W.left);
      let U = (W.top > r ? W.top - r : r - W.bottom) - 1;
      if (W.left - 1 <= e && W.right + 1 >= e && U < _) {
        let z = e >= (W.left + W.right) / 2, K = z;
        if ((browser.chrome || browser.gecko) && textRange(s, F).getBoundingClientRect().left == W.right && (K = !z), U <= 0)
          return { node: s, offset: F + (K ? 1 : 0) };
        B = F + (K ? 1 : 0), _ = U;
      }
    }
  }
  return { node: s, offset: B > -1 ? B : $ > 0 ? s.nodeValue.length : 0 };
}
function posAtCoords(s, e, r, R = -1) {
  var B, _;
  let $ = s.contentDOM.getBoundingClientRect(), F = $.top + s.viewState.paddingTop, V, { docHeight: H } = s.viewState, { x: W, y: U } = e, z = U - F;
  if (z < 0)
    return 0;
  if (z > H)
    return s.state.doc.length;
  for (let de = s.viewState.heightOracle.textHeight / 2, re = !1; V = s.elementAtHeight(z), V.type != BlockType.Text; )
    for (; z = R > 0 ? V.bottom + de : V.top - de, !(z >= 0 && z <= H); ) {
      if (re)
        return r ? null : 0;
      re = !0, R = -R;
    }
  U = F + z;
  let K = V.from;
  if (K < s.viewport.from)
    return s.viewport.from == 0 ? 0 : r ? null : posAtCoordsImprecise(s, $, V, W, U);
  if (K > s.viewport.to)
    return s.viewport.to == s.state.doc.length ? s.state.doc.length : r ? null : posAtCoordsImprecise(s, $, V, W, U);
  let X = s.dom.ownerDocument, Z = s.root.elementFromPoint ? s.root : X, Y = Z.elementFromPoint(W, U);
  Y && !s.contentDOM.contains(Y) && (Y = null), Y || (W = Math.max($.left + 1, Math.min($.right - 1, W)), Y = Z.elementFromPoint(W, U), Y && !s.contentDOM.contains(Y) && (Y = null));
  let te, ue = -1;
  if (Y && ((B = s.docView.nearest(Y)) === null || B === void 0 ? void 0 : B.isEditable) != !1) {
    if (X.caretPositionFromPoint) {
      let de = X.caretPositionFromPoint(W, U);
      de && ({ offsetNode: te, offset: ue } = de);
    } else if (X.caretRangeFromPoint) {
      let de = X.caretRangeFromPoint(W, U);
      de && ({ startContainer: te, startOffset: ue } = de, (!s.contentDOM.contains(te) || browser.safari && isSuspiciousSafariCaretResult(te, ue, W) || browser.chrome && isSuspiciousChromeCaretResult(te, ue, W)) && (te = void 0));
    }
    te && (ue = Math.min(maxOffset(te), ue));
  }
  if (!te || !s.docView.dom.contains(te)) {
    let de = LineView.find(s.docView, K);
    if (!de)
      return z > V.top + V.height / 2 ? V.to : V.from;
    ({ node: te, offset: ue } = domPosAtCoords(de.dom, W, U));
  }
  let fe = s.docView.nearest(te);
  if (!fe)
    return null;
  if (fe.isWidget && ((_ = fe.dom) === null || _ === void 0 ? void 0 : _.nodeType) == 1) {
    let de = fe.dom.getBoundingClientRect();
    return e.y < de.top || e.y <= de.bottom && e.x <= (de.left + de.right) / 2 ? fe.posAtStart : fe.posAtEnd;
  } else
    return fe.localPosFromDOM(te, ue) + fe.posAtStart;
}
function posAtCoordsImprecise(s, e, r, R, B) {
  let _ = Math.round((R - e.left) * s.defaultCharacterWidth);
  if (s.lineWrapping && r.height > s.defaultLineHeight * 1.5) {
    let F = s.viewState.heightOracle.textHeight, V = Math.floor((B - r.top - (s.defaultLineHeight - F) * 0.5) / F);
    _ += V * s.viewState.heightOracle.lineLength;
  }
  let $ = s.state.sliceDoc(r.from, r.to);
  return r.from + findColumn($, _, s.state.tabSize);
}
function isSuspiciousSafariCaretResult(s, e, r) {
  let R;
  if (s.nodeType != 3 || e != (R = s.nodeValue.length))
    return !1;
  for (let B = s.nextSibling; B; B = B.nextSibling)
    if (B.nodeType != 1 || B.nodeName != "BR")
      return !1;
  return textRange(s, R - 1, R).getBoundingClientRect().left > r;
}
function isSuspiciousChromeCaretResult(s, e, r) {
  if (e != 0)
    return !1;
  for (let B = s; ; ) {
    let _ = B.parentNode;
    if (!_ || _.nodeType != 1 || _.firstChild != B)
      return !1;
    if (_.classList.contains("cm-line"))
      break;
    B = _;
  }
  let R = s.nodeType == 1 ? s.getBoundingClientRect() : textRange(s, 0, Math.max(s.nodeValue.length, 1)).getBoundingClientRect();
  return r - R.left > 5;
}
function blockAt(s, e) {
  let r = s.lineBlockAt(e);
  if (Array.isArray(r.type)) {
    for (let R of r.type)
      if (R.to > e || R.to == e && (R.to == r.to || R.type == BlockType.Text))
        return R;
  }
  return r;
}
function moveToLineBoundary(s, e, r, R) {
  let B = blockAt(s, e.head), _ = !R || B.type != BlockType.Text || !(s.lineWrapping || B.widgetLineBreaks) ? null : s.coordsAtPos(e.assoc < 0 && e.head > B.from ? e.head - 1 : e.head);
  if (_) {
    let $ = s.dom.getBoundingClientRect(), F = s.textDirectionAt(B.from), V = s.posAtCoords({
      x: r == (F == Direction.LTR) ? $.right - 1 : $.left + 1,
      y: (_.top + _.bottom) / 2
    });
    if (V != null)
      return EditorSelection.cursor(V, r ? -1 : 1);
  }
  return EditorSelection.cursor(r ? B.to : B.from, r ? -1 : 1);
}
function moveByChar(s, e, r, R) {
  let B = s.state.doc.lineAt(e.head), _ = s.bidiSpans(B), $ = s.textDirectionAt(B.from);
  for (let F = e, V = null; ; ) {
    let H = moveVisually(B, _, $, F, r), W = movedOver;
    if (!H) {
      if (B.number == (r ? s.state.doc.lines : 1))
        return F;
      W = `
`, B = s.state.doc.line(B.number + (r ? 1 : -1)), _ = s.bidiSpans(B), H = s.visualLineSide(B, !r);
    }
    if (V) {
      if (!V(W))
        return F;
    } else {
      if (!R)
        return H;
      V = R(W);
    }
    F = H;
  }
}
function byGroup(s, e, r) {
  let R = s.state.charCategorizer(e), B = R(r);
  return (_) => {
    let $ = R(_);
    return B == CharCategory.Space && (B = $), B == $;
  };
}
function moveVertically(s, e, r, R) {
  let B = e.head, _ = r ? 1 : -1;
  if (B == (r ? s.state.doc.length : 0))
    return EditorSelection.cursor(B, e.assoc);
  let $ = e.goalColumn, F, V = s.contentDOM.getBoundingClientRect(), H = s.coordsAtPos(B, e.assoc || -1), W = s.documentTop;
  if (H)
    $ == null && ($ = H.left - V.left), F = _ < 0 ? H.top : H.bottom;
  else {
    let K = s.viewState.lineBlockAt(B);
    $ == null && ($ = Math.min(V.right - V.left, s.defaultCharacterWidth * (B - K.from))), F = (_ < 0 ? K.top : K.bottom) + W;
  }
  let U = V.left + $, z = R ?? s.viewState.heightOracle.textHeight >> 1;
  for (let K = 0; ; K += 10) {
    let X = F + (z + K) * _, Z = posAtCoords(s, { x: U, y: X }, !1, _);
    if (X < V.top || X > V.bottom || (_ < 0 ? Z < B : Z > B)) {
      let Y = s.docView.coordsForChar(Z), te = !Y || X < Y.top ? -1 : 1;
      return EditorSelection.cursor(Z, te, void 0, $);
    }
  }
}
function skipAtomicRanges(s, e, r) {
  for (; ; ) {
    let R = 0;
    for (let B of s)
      B.between(e - 1, e + 1, (_, $, F) => {
        if (e > _ && e < $) {
          let V = R || r || (e - _ < $ - e ? -1 : 1);
          e = V < 0 ? _ : $, R = V;
        }
      });
    if (!R)
      return e;
  }
}
function skipAtoms(s, e, r) {
  let R = skipAtomicRanges(s.state.facet(atomicRanges).map((B) => B(s)), r.from, e.head > r.from ? -1 : 1);
  return R == r.from ? r : EditorSelection.cursor(R, R < r.from ? 1 : -1);
}
const LineBreakPlaceholder = "￿";
class DOMReader {
  constructor(e, r) {
    this.points = e, this.text = "", this.lineSeparator = r.facet(EditorState.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += LineBreakPlaceholder;
  }
  readRange(e, r) {
    if (!e)
      return this;
    let R = e.parentNode;
    for (let B = e; ; ) {
      this.findPointBefore(R, B);
      let _ = this.text.length;
      this.readNode(B);
      let $ = B.nextSibling;
      if ($ == r)
        break;
      let F = ContentView.get(B), V = ContentView.get($);
      (F && V ? F.breakAfter : (F ? F.breakAfter : isBlockElement(B)) || isBlockElement($) && (B.nodeName != "BR" || B.cmIgnore) && this.text.length > _) && this.lineBreak(), B = $;
    }
    return this.findPointBefore(R, r), this;
  }
  readTextNode(e) {
    let r = e.nodeValue;
    for (let R of this.points)
      R.node == e && (R.pos = this.text.length + Math.min(R.offset, r.length));
    for (let R = 0, B = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let _ = -1, $ = 1, F;
      if (this.lineSeparator ? (_ = r.indexOf(this.lineSeparator, R), $ = this.lineSeparator.length) : (F = B.exec(r)) && (_ = F.index, $ = F[0].length), this.append(r.slice(R, _ < 0 ? r.length : _)), _ < 0)
        break;
      if (this.lineBreak(), $ > 1)
        for (let V of this.points)
          V.node == e && V.pos > this.text.length && (V.pos -= $ - 1);
      R = _ + $;
    }
  }
  readNode(e) {
    if (e.cmIgnore)
      return;
    let r = ContentView.get(e), R = r && r.overrideDOMText;
    if (R != null) {
      this.findPointInside(e, R.length);
      for (let B = R.iter(); !B.next().done; )
        B.lineBreak ? this.lineBreak() : this.append(B.value);
    } else e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, r) {
    for (let R of this.points)
      R.node == e && e.childNodes[R.offset] == r && (R.pos = this.text.length);
  }
  findPointInside(e, r) {
    for (let R of this.points)
      (e.nodeType == 3 ? R.node == e : e.contains(R.node)) && (R.pos = this.text.length + (isAtEnd(e, R.node, R.offset) ? r : 0));
  }
}
function isAtEnd(s, e, r) {
  for (; ; ) {
    if (!e || r < maxOffset(e))
      return !1;
    if (e == s)
      return !0;
    r = domIndex(e) + 1, e = e.parentNode;
  }
}
class DOMPoint {
  constructor(e, r) {
    this.node = e, this.offset = r, this.pos = -1;
  }
}
class DOMChange {
  constructor(e, r, R, B) {
    this.typeOver = B, this.bounds = null, this.text = "", this.domChanged = r > -1;
    let { impreciseHead: _, impreciseAnchor: $ } = e.docView;
    if (e.state.readOnly && r > -1)
      this.newSel = null;
    else if (r > -1 && (this.bounds = e.docView.domBoundsAround(r, R, 0))) {
      let F = _ || $ ? [] : selectionPoints(e), V = new DOMReader(F, e.state);
      V.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = V.text, this.newSel = selectionFromPoints(F, this.bounds.from);
    } else {
      let F = e.observer.selectionRange, V = _ && _.node == F.focusNode && _.offset == F.focusOffset || !contains(e.contentDOM, F.focusNode) ? e.state.selection.main.head : e.docView.posFromDOM(F.focusNode, F.focusOffset), H = $ && $.node == F.anchorNode && $.offset == F.anchorOffset || !contains(e.contentDOM, F.anchorNode) ? e.state.selection.main.anchor : e.docView.posFromDOM(F.anchorNode, F.anchorOffset), W = e.viewport;
      if ((browser.ios || browser.chrome) && e.state.selection.main.empty && V != H && (W.from > 0 || W.to < e.state.doc.length)) {
        let U = Math.min(V, H), z = Math.max(V, H), K = W.from - U, X = W.to - z;
        (K == 0 || K == 1 || U == 0) && (X == 0 || X == -1 || z == e.state.doc.length) && (V = 0, H = e.state.doc.length);
      }
      this.newSel = EditorSelection.single(H, V);
    }
  }
}
function applyDOMChange(s, e) {
  let r, { newSel: R } = e, B = s.state.selection.main, _ = s.inputState.lastKeyTime > Date.now() - 100 ? s.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: $, to: F } = e.bounds, V = B.from, H = null;
    (_ === 8 || browser.android && e.text.length < F - $) && (V = B.to, H = "end");
    let W = findDiff(s.state.doc.sliceString($, F, LineBreakPlaceholder), e.text, V - $, H);
    W && (browser.chrome && _ == 13 && W.toB == W.from + 2 && e.text.slice(W.from, W.toB) == LineBreakPlaceholder + LineBreakPlaceholder && W.toB--, r = {
      from: $ + W.from,
      to: $ + W.toA,
      insert: Text$1.of(e.text.slice(W.from, W.toB).split(LineBreakPlaceholder))
    });
  } else R && (!s.hasFocus && s.state.facet(editable) || R.main.eq(B)) && (R = null);
  if (!r && !R)
    return !1;
  if (!r && e.typeOver && !B.empty && R && R.main.empty ? r = { from: B.from, to: B.to, insert: s.state.doc.slice(B.from, B.to) } : r && r.from >= B.from && r.to <= B.to && (r.from != B.from || r.to != B.to) && B.to - B.from - (r.to - r.from) <= 4 ? r = {
    from: B.from,
    to: B.to,
    insert: s.state.doc.slice(B.from, r.from).append(r.insert).append(s.state.doc.slice(r.to, B.to))
  } : (browser.mac || browser.android) && r && r.from == r.to && r.from == B.head - 1 && /^\. ?$/.test(r.insert.toString()) && s.contentDOM.getAttribute("autocorrect") == "off" ? (R && r.insert.length == 2 && (R = EditorSelection.single(R.main.anchor - 1, R.main.head - 1)), r = { from: B.from, to: B.to, insert: Text$1.of([" "]) }) : browser.chrome && r && r.from == r.to && r.from == B.head && r.insert.toString() == `
 ` && s.lineWrapping && (R && (R = EditorSelection.single(R.main.anchor - 1, R.main.head - 1)), r = { from: B.from, to: B.to, insert: Text$1.of([" "]) }), r)
    return applyDOMChangeInner(s, r, R, _);
  if (R && !R.main.eq(B)) {
    let $ = !1, F = "select";
    return s.inputState.lastSelectionTime > Date.now() - 50 && (s.inputState.lastSelectionOrigin == "select" && ($ = !0), F = s.inputState.lastSelectionOrigin), s.dispatch({ selection: R, scrollIntoView: $, userEvent: F }), !0;
  } else
    return !1;
}
function applyDOMChangeInner(s, e, r, R = -1) {
  if (browser.ios && s.inputState.flushIOSKey(e))
    return !0;
  let B = s.state.selection.main;
  if (browser.android && (e.to == B.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (e.from == B.from || e.from == B.from - 1 && s.state.sliceDoc(e.from, B.from) == " ") && e.insert.length == 1 && e.insert.lines == 2 && dispatchKey(s.contentDOM, "Enter", 13) || (e.from == B.from - 1 && e.to == B.to && e.insert.length == 0 || R == 8 && e.insert.length < e.to - e.from && e.to > B.head) && dispatchKey(s.contentDOM, "Backspace", 8) || e.from == B.from && e.to == B.to + 1 && e.insert.length == 0 && dispatchKey(s.contentDOM, "Delete", 46)))
    return !0;
  let _ = e.insert.toString();
  s.inputState.composing >= 0 && s.inputState.composing++;
  let $, F = () => $ || ($ = applyDefaultInsert(s, e, r));
  return s.state.facet(inputHandler$1).some((V) => V(s, e.from, e.to, _, F)) || s.dispatch(F()), !0;
}
function applyDefaultInsert(s, e, r) {
  let R, B = s.state, _ = B.selection.main;
  if (e.from >= _.from && e.to <= _.to && e.to - e.from >= (_.to - _.from) / 3 && (!r || r.main.empty && r.main.from == e.from + e.insert.length) && s.inputState.composing < 0) {
    let F = _.from < e.from ? B.sliceDoc(_.from, e.from) : "", V = _.to > e.to ? B.sliceDoc(e.to, _.to) : "";
    R = B.replaceSelection(s.state.toText(F + e.insert.sliceString(0, void 0, s.state.lineBreak) + V));
  } else {
    let F = B.changes(e), V = r && r.main.to <= F.newLength ? r.main : void 0;
    if (B.selection.ranges.length > 1 && s.inputState.composing >= 0 && e.to <= _.to && e.to >= _.to - 10) {
      let H = s.state.sliceDoc(e.from, e.to), W, U = r && findCompositionNode(s, r.main.head);
      if (U) {
        let X = e.insert.length - (e.to - e.from);
        W = { from: U.from, to: U.to - X };
      } else
        W = s.state.doc.lineAt(_.head);
      let z = _.to - e.to, K = _.to - _.from;
      R = B.changeByRange((X) => {
        if (X.from == _.from && X.to == _.to)
          return { changes: F, range: V || X.map(F) };
        let Z = X.to - z, Y = Z - H.length;
        if (X.to - X.from != K || s.state.sliceDoc(Y, Z) != H || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        X.to >= W.from && X.from <= W.to)
          return { range: X };
        let te = B.changes({ from: Y, to: Z, insert: e.insert }), ue = X.to - _.to;
        return {
          changes: te,
          range: V ? EditorSelection.range(Math.max(0, V.anchor + ue), Math.max(0, V.head + ue)) : X.map(te)
        };
      });
    } else
      R = {
        changes: F,
        selection: V && B.selection.replaceRange(V)
      };
  }
  let $ = "input.type";
  return (s.composing || s.inputState.compositionPendingChange && s.inputState.compositionEndedAt > Date.now() - 50) && (s.inputState.compositionPendingChange = !1, $ += ".compose", s.inputState.compositionFirstChange && ($ += ".start", s.inputState.compositionFirstChange = !1)), B.update(R, { userEvent: $, scrollIntoView: !0 });
}
function findDiff(s, e, r, R) {
  let B = Math.min(s.length, e.length), _ = 0;
  for (; _ < B && s.charCodeAt(_) == e.charCodeAt(_); )
    _++;
  if (_ == B && s.length == e.length)
    return null;
  let $ = s.length, F = e.length;
  for (; $ > 0 && F > 0 && s.charCodeAt($ - 1) == e.charCodeAt(F - 1); )
    $--, F--;
  if (R == "end") {
    let V = Math.max(0, _ - Math.min($, F));
    r -= $ + V - _;
  }
  if ($ < _ && s.length < e.length) {
    let V = r <= _ && r >= $ ? _ - r : 0;
    _ -= V, F = _ + (F - $), $ = _;
  } else if (F < _) {
    let V = r <= _ && r >= F ? _ - r : 0;
    _ -= V, $ = _ + ($ - F), F = _;
  }
  return { from: _, toA: $, toB: F };
}
function selectionPoints(s) {
  let e = [];
  if (s.root.activeElement != s.contentDOM)
    return e;
  let { anchorNode: r, anchorOffset: R, focusNode: B, focusOffset: _ } = s.observer.selectionRange;
  return r && (e.push(new DOMPoint(r, R)), (B != r || _ != R) && e.push(new DOMPoint(B, _))), e;
}
function selectionFromPoints(s, e) {
  if (s.length == 0)
    return null;
  let r = s[0].pos, R = s.length == 2 ? s[1].pos : r;
  return r > -1 && R > -1 ? EditorSelection.single(r + e, R + e) : null;
}
class InputState {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.pendingIOSKey = void 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, browser.safari && e.contentDOM.addEventListener("input", () => null), browser.gecko && firefoxCopyCutHack(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !eventBelongsToEditor(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || this.runHandlers(e.type, e);
  }
  runHandlers(e, r) {
    let R = this.handlers[e];
    if (R) {
      for (let B of R.observers)
        B(this.view, r);
      for (let B of R.handlers) {
        if (r.defaultPrevented)
          break;
        if (B(this.view, r)) {
          r.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let r = computeHandlers(e), R = this.handlers, B = this.view.contentDOM;
    for (let _ in r)
      if (_ != "scroll") {
        let $ = !r[_].handlers.length, F = R[_];
        F && $ != !F.handlers.length && (B.removeEventListener(_, this.handleEvent), F = null), F || B.addEventListener(_, this.handleEvent, { passive: $ });
      }
    for (let _ in R)
      _ != "scroll" && !r[_] && B.removeEventListener(_, this.handleEvent);
    this.handlers = r;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && e.keyCode != 27 && modifierCodes.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), browser.android && browser.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let r;
    return browser.ios && !e.synthetic && !e.altKey && !e.metaKey && ((r = PendingKeys.find((R) => R.keyCode == e.keyCode)) && !e.ctrlKey || EmacsyPendingKeys.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey) ? (this.pendingIOSKey = r || e, setTimeout(() => this.flushIOSKey(), 250), !0) : (e.keyCode != 229 && this.view.observer.forceFlush(), !1);
  }
  flushIOSKey(e) {
    let r = this.pendingIOSKey;
    return !r || r.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, dispatchKey(this.view.contentDOM, r.key, r.keyCode, r instanceof KeyboardEvent ? r : void 0));
  }
  ignoreDuringComposition(e) {
    return /^key/.test(e.type) ? this.composing > 0 ? !0 : browser.safari && !browser.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1 : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.view.observer.update(e), this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function bindHandler(s, e) {
  return (r, R) => {
    try {
      return e.call(s, R, r);
    } catch (B) {
      logException(r.state, B);
    }
  };
}
function computeHandlers(s) {
  let e = /* @__PURE__ */ Object.create(null);
  function r(R) {
    return e[R] || (e[R] = { observers: [], handlers: [] });
  }
  for (let R of s) {
    let B = R.spec;
    if (B && B.domEventHandlers)
      for (let _ in B.domEventHandlers) {
        let $ = B.domEventHandlers[_];
        $ && r(_).handlers.push(bindHandler(R.value, $));
      }
    if (B && B.domEventObservers)
      for (let _ in B.domEventObservers) {
        let $ = B.domEventObservers[_];
        $ && r(_).observers.push(bindHandler(R.value, $));
      }
  }
  for (let R in handlers)
    r(R).handlers.push(handlers[R]);
  for (let R in observers)
    r(R).observers.push(observers[R]);
  return e;
}
const PendingKeys = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], EmacsyPendingKeys = "dthko", modifierCodes = [16, 17, 18, 20, 91, 92, 224, 225], dragScrollMargin = 6;
function dragScrollSpeed(s) {
  return Math.max(0, s) * 0.7 + 8;
}
function dist(s, e) {
  return Math.max(Math.abs(s.clientX - e.clientX), Math.abs(s.clientY - e.clientY));
}
class MouseSelection {
  constructor(e, r, R, B) {
    this.view = e, this.startEvent = r, this.style = R, this.mustSelect = B, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = r, this.scrollParents = scrollableParents(e.contentDOM), this.atoms = e.state.facet(atomicRanges).map(($) => $(e));
    let _ = e.contentDOM.ownerDocument;
    _.addEventListener("mousemove", this.move = this.move.bind(this)), _.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = r.shiftKey, this.multiple = e.state.facet(EditorState.allowMultipleSelections) && addsSelectionRange(e, r), this.dragging = isInPrimarySelection(e, r) && getClickType(r) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && dist(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let r = 0, R = 0, B = 0, _ = 0, $ = this.view.win.innerWidth, F = this.view.win.innerHeight;
    this.scrollParents.x && ({ left: B, right: $ } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({ top: _, bottom: F } = this.scrollParents.y.getBoundingClientRect());
    let V = getScrollMargins(this.view);
    e.clientX - V.left <= B + dragScrollMargin ? r = -dragScrollSpeed(B - e.clientX) : e.clientX + V.right >= $ - dragScrollMargin && (r = dragScrollSpeed(e.clientX - $)), e.clientY - V.top <= _ + dragScrollMargin ? R = -dragScrollSpeed(_ - e.clientY) : e.clientY + V.bottom >= F - dragScrollMargin && (R = dragScrollSpeed(e.clientY - F)), this.setScrollSpeed(r, R);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, r) {
    this.scrollSpeed = { x: e, y: r }, e || r ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    let { x: e, y: r } = this.scrollSpeed;
    e && this.scrollParents.x && (this.scrollParents.x.scrollLeft += e, e = 0), r && this.scrollParents.y && (this.scrollParents.y.scrollTop += r, r = 0), (e || r) && this.view.win.scrollBy(e, r), this.dragging === !1 && this.select(this.lastEvent);
  }
  skipAtoms(e) {
    let r = null;
    for (let R = 0; R < e.ranges.length; R++) {
      let B = e.ranges[R], _ = null;
      if (B.empty) {
        let $ = skipAtomicRanges(this.atoms, B.from, 0);
        $ != B.from && (_ = EditorSelection.cursor($, -1));
      } else {
        let $ = skipAtomicRanges(this.atoms, B.from, -1), F = skipAtomicRanges(this.atoms, B.to, 1);
        ($ != B.from || F != B.to) && (_ = EditorSelection.range(B.from == B.anchor ? $ : F, B.from == B.head ? $ : F));
      }
      _ && (r || (r = e.ranges.slice()), r[R] = _);
    }
    return r ? EditorSelection.create(r, e.mainIndex) : e;
  }
  select(e) {
    let { view: r } = this, R = this.skipAtoms(this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !R.eq(r.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: R,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    e.transactions.some((r) => r.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function addsSelectionRange(s, e) {
  let r = s.state.facet(clickAddsSelectionRange);
  return r.length ? r[0](e) : browser.mac ? e.metaKey : e.ctrlKey;
}
function dragMovesSelection(s, e) {
  let r = s.state.facet(dragMovesSelection$1);
  return r.length ? r[0](e) : browser.mac ? !e.altKey : !e.ctrlKey;
}
function isInPrimarySelection(s, e) {
  let { main: r } = s.state.selection;
  if (r.empty)
    return !1;
  let R = getSelection(s.root);
  if (!R || R.rangeCount == 0)
    return !0;
  let B = R.getRangeAt(0).getClientRects();
  for (let _ = 0; _ < B.length; _++) {
    let $ = B[_];
    if ($.left <= e.clientX && $.right >= e.clientX && $.top <= e.clientY && $.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function eventBelongsToEditor(s, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let r = e.target, R; r != s.contentDOM; r = r.parentNode)
    if (!r || r.nodeType == 11 || (R = ContentView.get(r)) && R.ignoreEvent(e))
      return !1;
  return !0;
}
const handlers = /* @__PURE__ */ Object.create(null), observers = /* @__PURE__ */ Object.create(null), brokenClipboardAPI = browser.ie && browser.ie_version < 15 || browser.ios && browser.webkit_version < 604;
function capturePaste(s) {
  let e = s.dom.parentNode;
  if (!e)
    return;
  let r = e.appendChild(document.createElement("textarea"));
  r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus(), setTimeout(() => {
    s.focus(), r.remove(), doPaste(s, r.value);
  }, 50);
}
function textFilter(s, e, r) {
  for (let R of s.facet(e))
    r = R(r, s);
  return r;
}
function doPaste(s, e) {
  e = textFilter(s.state, clipboardInputFilter, e);
  let { state: r } = s, R, B = 1, _ = r.toText(e), $ = _.lines == r.selection.ranges.length;
  if (lastLinewiseCopy != null && r.selection.ranges.every((V) => V.empty) && lastLinewiseCopy == _.toString()) {
    let V = -1;
    R = r.changeByRange((H) => {
      let W = r.doc.lineAt(H.from);
      if (W.from == V)
        return { range: H };
      V = W.from;
      let U = r.toText(($ ? _.line(B++).text : e) + r.lineBreak);
      return {
        changes: { from: W.from, insert: U },
        range: EditorSelection.cursor(H.from + U.length)
      };
    });
  } else $ ? R = r.changeByRange((V) => {
    let H = _.line(B++);
    return {
      changes: { from: V.from, to: V.to, insert: H.text },
      range: EditorSelection.cursor(V.from + H.length)
    };
  }) : R = r.replaceSelection(_);
  s.dispatch(R, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
observers.scroll = (s) => {
  s.inputState.lastScrollTop = s.scrollDOM.scrollTop, s.inputState.lastScrollLeft = s.scrollDOM.scrollLeft;
};
handlers.keydown = (s, e) => (s.inputState.setSelectionOrigin("select"), e.keyCode == 27 && s.inputState.tabFocusMode != 0 && (s.inputState.tabFocusMode = Date.now() + 2e3), !1);
observers.touchstart = (s, e) => {
  s.inputState.lastTouchTime = Date.now(), s.inputState.setSelectionOrigin("select.pointer");
};
observers.touchmove = (s) => {
  s.inputState.setSelectionOrigin("select.pointer");
};
handlers.mousedown = (s, e) => {
  if (s.observer.flush(), s.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let r = null;
  for (let R of s.state.facet(mouseSelectionStyle))
    if (r = R(s, e), r)
      break;
  if (!r && e.button == 0 && (r = basicMouseSelection(s, e)), r) {
    let R = !s.hasFocus;
    s.inputState.startMouseSelection(new MouseSelection(s, e, r, R)), R && s.observer.ignore(() => {
      focusPreventScroll(s.contentDOM);
      let _ = s.root.activeElement;
      _ && !_.contains(s.contentDOM) && _.blur();
    });
    let B = s.inputState.mouseSelection;
    if (B)
      return B.start(e), B.dragging === !1;
  }
  return !1;
};
function rangeForClick(s, e, r, R) {
  if (R == 1)
    return EditorSelection.cursor(e, r);
  if (R == 2)
    return groupAt(s.state, e, r);
  {
    let B = LineView.find(s.docView, e), _ = s.state.doc.lineAt(B ? B.posAtEnd : e), $ = B ? B.posAtStart : _.from, F = B ? B.posAtEnd : _.to;
    return F < s.state.doc.length && F == _.to && F++, EditorSelection.range($, F);
  }
}
let inside = (s, e, r) => e >= r.top && e <= r.bottom && s >= r.left && s <= r.right;
function findPositionSide(s, e, r, R) {
  let B = LineView.find(s.docView, e);
  if (!B)
    return 1;
  let _ = e - B.posAtStart;
  if (_ == 0)
    return 1;
  if (_ == B.length)
    return -1;
  let $ = B.coordsAt(_, -1);
  if ($ && inside(r, R, $))
    return -1;
  let F = B.coordsAt(_, 1);
  return F && inside(r, R, F) ? 1 : $ && $.bottom >= R ? -1 : 1;
}
function queryPos(s, e) {
  let r = s.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: r, bias: findPositionSide(s, r, e.clientX, e.clientY) };
}
const BadMouseDetail = browser.ie && browser.ie_version <= 11;
let lastMouseDown = null, lastMouseDownCount = 0, lastMouseDownTime = 0;
function getClickType(s) {
  if (!BadMouseDetail)
    return s.detail;
  let e = lastMouseDown, r = lastMouseDownTime;
  return lastMouseDown = s, lastMouseDownTime = Date.now(), lastMouseDownCount = !e || r > Date.now() - 400 && Math.abs(e.clientX - s.clientX) < 2 && Math.abs(e.clientY - s.clientY) < 2 ? (lastMouseDownCount + 1) % 3 : 1;
}
function basicMouseSelection(s, e) {
  let r = queryPos(s, e), R = getClickType(e), B = s.state.selection;
  return {
    update(_) {
      _.docChanged && (r.pos = _.changes.mapPos(r.pos), B = B.map(_.changes));
    },
    get(_, $, F) {
      let V = queryPos(s, _), H, W = rangeForClick(s, V.pos, V.bias, R);
      if (r.pos != V.pos && !$) {
        let U = rangeForClick(s, r.pos, r.bias, R), z = Math.min(U.from, W.from), K = Math.max(U.to, W.to);
        W = z < W.from ? EditorSelection.range(z, K) : EditorSelection.range(K, z);
      }
      return $ ? B.replaceRange(B.main.extend(W.from, W.to)) : F && R == 1 && B.ranges.length > 1 && (H = removeRangeAround(B, V.pos)) ? H : F ? B.addRange(W) : EditorSelection.create([W]);
    }
  };
}
function removeRangeAround(s, e) {
  for (let r = 0; r < s.ranges.length; r++) {
    let { from: R, to: B } = s.ranges[r];
    if (R <= e && B >= e)
      return EditorSelection.create(s.ranges.slice(0, r).concat(s.ranges.slice(r + 1)), s.mainIndex == r ? 0 : s.mainIndex - (s.mainIndex > r ? 1 : 0));
  }
  return null;
}
handlers.dragstart = (s, e) => {
  let { selection: { main: r } } = s.state;
  if (e.target.draggable) {
    let B = s.docView.nearest(e.target);
    if (B && B.isWidget) {
      let _ = B.posAtStart, $ = _ + B.length;
      (_ >= r.to || $ <= r.from) && (r = EditorSelection.range(_, $));
    }
  }
  let { inputState: R } = s;
  return R.mouseSelection && (R.mouseSelection.dragging = !0), R.draggedContent = r, e.dataTransfer && (e.dataTransfer.setData("Text", textFilter(s.state, clipboardOutputFilter, s.state.sliceDoc(r.from, r.to))), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
handlers.dragend = (s) => (s.inputState.draggedContent = null, !1);
function dropText(s, e, r, R) {
  if (r = textFilter(s.state, clipboardInputFilter, r), !r)
    return;
  let B = s.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: _ } = s.inputState, $ = R && _ && dragMovesSelection(s, e) ? { from: _.from, to: _.to } : null, F = { from: B, insert: r }, V = s.state.changes($ ? [$, F] : F);
  s.focus(), s.dispatch({
    changes: V,
    selection: { anchor: V.mapPos(B, -1), head: V.mapPos(B, 1) },
    userEvent: $ ? "move.drop" : "input.drop"
  }), s.inputState.draggedContent = null;
}
handlers.drop = (s, e) => {
  if (!e.dataTransfer)
    return !1;
  if (s.state.readOnly)
    return !0;
  let r = e.dataTransfer.files;
  if (r && r.length) {
    let R = Array(r.length), B = 0, _ = () => {
      ++B == r.length && dropText(s, e, R.filter(($) => $ != null).join(s.state.lineBreak), !1);
    };
    for (let $ = 0; $ < r.length; $++) {
      let F = new FileReader();
      F.onerror = _, F.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(F.result) || (R[$] = F.result), _();
      }, F.readAsText(r[$]);
    }
    return !0;
  } else {
    let R = e.dataTransfer.getData("Text");
    if (R)
      return dropText(s, e, R, !0), !0;
  }
  return !1;
};
handlers.paste = (s, e) => {
  if (s.state.readOnly)
    return !0;
  s.observer.flush();
  let r = brokenClipboardAPI ? null : e.clipboardData;
  return r ? (doPaste(s, r.getData("text/plain") || r.getData("text/uri-list")), !0) : (capturePaste(s), !1);
};
function captureCopy(s, e) {
  let r = s.dom.parentNode;
  if (!r)
    return;
  let R = r.appendChild(document.createElement("textarea"));
  R.style.cssText = "position: fixed; left: -10000px; top: 10px", R.value = e, R.focus(), R.selectionEnd = e.length, R.selectionStart = 0, setTimeout(() => {
    R.remove(), s.focus();
  }, 50);
}
function copiedRange(s) {
  let e = [], r = [], R = !1;
  for (let B of s.selection.ranges)
    B.empty || (e.push(s.sliceDoc(B.from, B.to)), r.push(B));
  if (!e.length) {
    let B = -1;
    for (let { from: _ } of s.selection.ranges) {
      let $ = s.doc.lineAt(_);
      $.number > B && (e.push($.text), r.push({ from: $.from, to: Math.min(s.doc.length, $.to + 1) })), B = $.number;
    }
    R = !0;
  }
  return { text: textFilter(s, clipboardOutputFilter, e.join(s.lineBreak)), ranges: r, linewise: R };
}
let lastLinewiseCopy = null;
handlers.copy = handlers.cut = (s, e) => {
  let { text: r, ranges: R, linewise: B } = copiedRange(s.state);
  if (!r && !B)
    return !1;
  lastLinewiseCopy = B ? r : null, e.type == "cut" && !s.state.readOnly && s.dispatch({
    changes: R,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let _ = brokenClipboardAPI ? null : e.clipboardData;
  return _ ? (_.clearData(), _.setData("text/plain", r), !0) : (captureCopy(s, r), !1);
};
const isFocusChange = /* @__PURE__ */ Annotation.define();
function focusChangeTransaction(s, e) {
  let r = [];
  for (let R of s.facet(focusChangeEffect)) {
    let B = R(s, e);
    B && r.push(B);
  }
  return r ? s.update({ effects: r, annotations: isFocusChange.of(!0) }) : null;
}
function updateForFocusChange(s) {
  setTimeout(() => {
    let e = s.hasFocus;
    if (e != s.inputState.notifiedFocused) {
      let r = focusChangeTransaction(s.state, e);
      r ? s.dispatch(r) : s.update([]);
    }
  }, 10);
}
observers.focus = (s) => {
  s.inputState.lastFocusTime = Date.now(), !s.scrollDOM.scrollTop && (s.inputState.lastScrollTop || s.inputState.lastScrollLeft) && (s.scrollDOM.scrollTop = s.inputState.lastScrollTop, s.scrollDOM.scrollLeft = s.inputState.lastScrollLeft), updateForFocusChange(s);
};
observers.blur = (s) => {
  s.observer.clearSelectionRange(), updateForFocusChange(s);
};
observers.compositionstart = observers.compositionupdate = (s) => {
  s.observer.editContext || (s.inputState.compositionFirstChange == null && (s.inputState.compositionFirstChange = !0), s.inputState.composing < 0 && (s.inputState.composing = 0));
};
observers.compositionend = (s) => {
  s.observer.editContext || (s.inputState.composing = -1, s.inputState.compositionEndedAt = Date.now(), s.inputState.compositionPendingKey = !0, s.inputState.compositionPendingChange = s.observer.pendingRecords().length > 0, s.inputState.compositionFirstChange = null, browser.chrome && browser.android ? s.observer.flushSoon() : s.inputState.compositionPendingChange ? Promise.resolve().then(() => s.observer.flush()) : setTimeout(() => {
    s.inputState.composing < 0 && s.docView.hasComposition && s.update([]);
  }, 50));
};
observers.contextmenu = (s) => {
  s.inputState.lastContextMenu = Date.now();
};
handlers.beforeinput = (s, e) => {
  var r, R;
  if (e.inputType == "insertReplacementText" && s.observer.editContext) {
    let _ = (r = e.dataTransfer) === null || r === void 0 ? void 0 : r.getData("text/plain"), $ = e.getTargetRanges();
    if (_ && $.length) {
      let F = $[0], V = s.posAtDOM(F.startContainer, F.startOffset), H = s.posAtDOM(F.endContainer, F.endOffset);
      return applyDOMChangeInner(s, { from: V, to: H, insert: s.state.toText(_) }, null), !0;
    }
  }
  let B;
  if (browser.chrome && browser.android && (B = PendingKeys.find((_) => _.inputType == e.inputType)) && (s.observer.delayAndroidKey(B.key, B.keyCode), B.key == "Backspace" || B.key == "Delete")) {
    let _ = ((R = window.visualViewport) === null || R === void 0 ? void 0 : R.height) || 0;
    setTimeout(() => {
      var $;
      ((($ = window.visualViewport) === null || $ === void 0 ? void 0 : $.height) || 0) > _ + 10 && s.hasFocus && (s.contentDOM.blur(), s.focus());
    }, 100);
  }
  return browser.ios && e.inputType == "deleteContentForward" && s.observer.flushSoon(), browser.safari && e.inputType == "insertText" && s.inputState.composing >= 0 && setTimeout(() => observers.compositionend(s, e), 20), !1;
};
const appliedFirefoxHack = /* @__PURE__ */ new Set();
function firefoxCopyCutHack(s) {
  appliedFirefoxHack.has(s) || (appliedFirefoxHack.add(s), s.addEventListener("copy", () => {
  }), s.addEventListener("cut", () => {
  }));
}
const wrappingWhiteSpace = ["pre-wrap", "normal", "pre-line", "break-spaces"];
let heightChangeFlag = !1;
function clearHeightChangeFlag() {
  heightChangeFlag = !1;
}
class HeightOracle {
  constructor(e) {
    this.lineWrapping = e, this.doc = Text$1.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
  }
  heightForGap(e, r) {
    let R = this.doc.lineAt(r).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (R += Math.max(0, Math.ceil((r - e - R * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * R;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return wrappingWhiteSpace.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let r = !1;
    for (let R = 0; R < e.length; R++) {
      let B = e[R];
      B < 0 ? R++ : this.heightSamples[Math.floor(B * 10)] || (r = !0, this.heightSamples[Math.floor(B * 10)] = !0);
    }
    return r;
  }
  refresh(e, r, R, B, _, $) {
    let F = wrappingWhiteSpace.indexOf(e) > -1, V = Math.round(r) != Math.round(this.lineHeight) || this.lineWrapping != F;
    if (this.lineWrapping = F, this.lineHeight = r, this.charWidth = R, this.textHeight = B, this.lineLength = _, V) {
      this.heightSamples = {};
      for (let H = 0; H < $.length; H++) {
        let W = $[H];
        W < 0 ? H++ : this.heightSamples[Math.floor(W * 10)] = !0;
      }
    }
    return V;
  }
}
class MeasuredHeights {
  constructor(e, r) {
    this.from = e, this.heights = r, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class BlockInfo {
  /**
  @internal
  */
  constructor(e, r, R, B, _) {
    this.from = e, this.length = r, this.top = R, this.height = B, this._content = _;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? BlockType.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof PointDecoration ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let r = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new BlockInfo(this.from, this.length + e.length, this.top, this.height + e.height, r);
  }
}
var QueryType$1 = /* @__PURE__ */ function(s) {
  return s[s.ByPos = 0] = "ByPos", s[s.ByHeight = 1] = "ByHeight", s[s.ByPosNoHeight = 2] = "ByPosNoHeight", s;
}(QueryType$1 || (QueryType$1 = {}));
const Epsilon = 1e-3;
class HeightMap {
  constructor(e, r, R = 2) {
    this.length = e, this.height = r, this.flags = R;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e) {
    this.height != e && (Math.abs(this.height - e) > Epsilon && (heightChangeFlag = !0), this.height = e);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, r, R) {
    return HeightMap.of(R);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, r) {
    r.push(this);
  }
  decomposeRight(e, r) {
    r.push(this);
  }
  applyChanges(e, r, R, B) {
    let _ = this, $ = R.doc;
    for (let F = B.length - 1; F >= 0; F--) {
      let { fromA: V, toA: H, fromB: W, toB: U } = B[F], z = _.lineAt(V, QueryType$1.ByPosNoHeight, R.setDoc(r), 0, 0), K = z.to >= H ? z : _.lineAt(H, QueryType$1.ByPosNoHeight, R, 0, 0);
      for (U += K.to - H, H = K.to; F > 0 && z.from <= B[F - 1].toA; )
        V = B[F - 1].fromA, W = B[F - 1].fromB, F--, V < z.from && (z = _.lineAt(V, QueryType$1.ByPosNoHeight, R, 0, 0));
      W += z.from - V, V = z.from;
      let X = NodeBuilder.build(R.setDoc($), e, W, U);
      _ = replace$1(_, _.replace(V, H, X));
    }
    return _.updateHeight(R, 0);
  }
  static empty() {
    return new HeightMapText(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let r = 0, R = e.length, B = 0, _ = 0;
    for (; ; )
      if (r == R)
        if (B > _ * 2) {
          let F = e[r - 1];
          F.break ? e.splice(--r, 1, F.left, null, F.right) : e.splice(--r, 1, F.left, F.right), R += 1 + F.break, B -= F.size;
        } else if (_ > B * 2) {
          let F = e[R];
          F.break ? e.splice(R, 1, F.left, null, F.right) : e.splice(R, 1, F.left, F.right), R += 2 + F.break, _ -= F.size;
        } else
          break;
      else if (B < _) {
        let F = e[r++];
        F && (B += F.size);
      } else {
        let F = e[--R];
        F && (_ += F.size);
      }
    let $ = 0;
    return e[r - 1] == null ? ($ = 1, r--) : e[r] == null && ($ = 1, R++), new HeightMapBranch(HeightMap.of(e.slice(0, r)), $, HeightMap.of(e.slice(R)));
  }
}
function replace$1(s, e) {
  return s == e ? s : (s.constructor != e.constructor && (heightChangeFlag = !0), e);
}
HeightMap.prototype.size = 1;
class HeightMapBlock extends HeightMap {
  constructor(e, r, R) {
    super(e, r), this.deco = R;
  }
  blockAt(e, r, R, B) {
    return new BlockInfo(B, this.length, R, this.height, this.deco || 0);
  }
  lineAt(e, r, R, B, _) {
    return this.blockAt(0, R, B, _);
  }
  forEachLine(e, r, R, B, _, $) {
    e <= _ + this.length && r >= _ && $(this.blockAt(0, R, B, _));
  }
  updateHeight(e, r = 0, R = !1, B) {
    return B && B.from <= r && B.more && this.setHeight(B.heights[B.index++]), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class HeightMapText extends HeightMapBlock {
  constructor(e, r) {
    super(e, r, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0;
  }
  blockAt(e, r, R, B) {
    return new BlockInfo(B, this.length, R, this.height, this.breaks);
  }
  replace(e, r, R) {
    let B = R[0];
    return R.length == 1 && (B instanceof HeightMapText || B instanceof HeightMapGap && B.flags & 4) && Math.abs(this.length - B.length) < 10 ? (B instanceof HeightMapGap ? B = new HeightMapText(B.length, this.height) : B.height = this.height, this.outdated || (B.outdated = !1), B) : HeightMap.of(R);
  }
  updateHeight(e, r = 0, R = !1, B) {
    return B && B.from <= r && B.more ? this.setHeight(B.heights[B.index++]) : (R || this.outdated) && this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class HeightMapGap extends HeightMap {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, r) {
    let R = e.doc.lineAt(r).number, B = e.doc.lineAt(r + this.length).number, _ = B - R + 1, $, F = 0;
    if (e.lineWrapping) {
      let V = Math.min(this.height, e.lineHeight * _);
      $ = V / _, this.length > _ + 1 && (F = (this.height - V) / (this.length - _ - 1));
    } else
      $ = this.height / _;
    return { firstLine: R, lastLine: B, perLine: $, perChar: F };
  }
  blockAt(e, r, R, B) {
    let { firstLine: _, lastLine: $, perLine: F, perChar: V } = this.heightMetrics(r, B);
    if (r.lineWrapping) {
      let H = B + (e < r.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - R) / this.height)) * this.length)), W = r.doc.lineAt(H), U = F + W.length * V, z = Math.max(R, e - U / 2);
      return new BlockInfo(W.from, W.length, z, U, 0);
    } else {
      let H = Math.max(0, Math.min($ - _, Math.floor((e - R) / F))), { from: W, length: U } = r.doc.line(_ + H);
      return new BlockInfo(W, U, R + F * H, F, 0);
    }
  }
  lineAt(e, r, R, B, _) {
    if (r == QueryType$1.ByHeight)
      return this.blockAt(e, R, B, _);
    if (r == QueryType$1.ByPosNoHeight) {
      let { from: K, to: X } = R.doc.lineAt(e);
      return new BlockInfo(K, X - K, 0, 0, 0);
    }
    let { firstLine: $, perLine: F, perChar: V } = this.heightMetrics(R, _), H = R.doc.lineAt(e), W = F + H.length * V, U = H.number - $, z = B + F * U + V * (H.from - _ - U);
    return new BlockInfo(H.from, H.length, Math.max(B, Math.min(z, B + this.height - W)), W, 0);
  }
  forEachLine(e, r, R, B, _, $) {
    e = Math.max(e, _), r = Math.min(r, _ + this.length);
    let { firstLine: F, perLine: V, perChar: H } = this.heightMetrics(R, _);
    for (let W = e, U = B; W <= r; ) {
      let z = R.doc.lineAt(W);
      if (W == e) {
        let X = z.number - F;
        U += V * X + H * (e - _ - X);
      }
      let K = V + H * z.length;
      $(new BlockInfo(z.from, z.length, U, K, 0)), U += K, W = z.to + 1;
    }
  }
  replace(e, r, R) {
    let B = this.length - r;
    if (B > 0) {
      let _ = R[R.length - 1];
      _ instanceof HeightMapGap ? R[R.length - 1] = new HeightMapGap(_.length + B) : R.push(null, new HeightMapGap(B - 1));
    }
    if (e > 0) {
      let _ = R[0];
      _ instanceof HeightMapGap ? R[0] = new HeightMapGap(e + _.length) : R.unshift(new HeightMapGap(e - 1), null);
    }
    return HeightMap.of(R);
  }
  decomposeLeft(e, r) {
    r.push(new HeightMapGap(e - 1), null);
  }
  decomposeRight(e, r) {
    r.push(null, new HeightMapGap(this.length - e - 1));
  }
  updateHeight(e, r = 0, R = !1, B) {
    let _ = r + this.length;
    if (B && B.from <= r + this.length && B.more) {
      let $ = [], F = Math.max(r, B.from), V = -1;
      for (B.from > r && $.push(new HeightMapGap(B.from - r - 1).updateHeight(e, r)); F <= _ && B.more; ) {
        let W = e.doc.lineAt(F).length;
        $.length && $.push(null);
        let U = B.heights[B.index++];
        V == -1 ? V = U : Math.abs(U - V) >= Epsilon && (V = -2);
        let z = new HeightMapText(W, U);
        z.outdated = !1, $.push(z), F += W + 1;
      }
      F <= _ && $.push(null, new HeightMapGap(_ - F).updateHeight(e, F));
      let H = HeightMap.of($);
      return (V < 0 || Math.abs(H.height - this.height) >= Epsilon || Math.abs(V - this.heightMetrics(e, r).perLine) >= Epsilon) && (heightChangeFlag = !0), replace$1(this, H);
    } else (R || this.outdated) && (this.setHeight(e.heightForGap(r, r + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class HeightMapBranch extends HeightMap {
  constructor(e, r, R) {
    super(e.length + r + R.length, e.height + R.height, r | (e.outdated || R.outdated ? 2 : 0)), this.left = e, this.right = R, this.size = e.size + R.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, r, R, B) {
    let _ = R + this.left.height;
    return e < _ ? this.left.blockAt(e, r, R, B) : this.right.blockAt(e, r, _, B + this.left.length + this.break);
  }
  lineAt(e, r, R, B, _) {
    let $ = B + this.left.height, F = _ + this.left.length + this.break, V = r == QueryType$1.ByHeight ? e < $ : e < F, H = V ? this.left.lineAt(e, r, R, B, _) : this.right.lineAt(e, r, R, $, F);
    if (this.break || (V ? H.to < F : H.from > F))
      return H;
    let W = r == QueryType$1.ByPosNoHeight ? QueryType$1.ByPosNoHeight : QueryType$1.ByPos;
    return V ? H.join(this.right.lineAt(F, W, R, $, F)) : this.left.lineAt(F, W, R, B, _).join(H);
  }
  forEachLine(e, r, R, B, _, $) {
    let F = B + this.left.height, V = _ + this.left.length + this.break;
    if (this.break)
      e < V && this.left.forEachLine(e, r, R, B, _, $), r >= V && this.right.forEachLine(e, r, R, F, V, $);
    else {
      let H = this.lineAt(V, QueryType$1.ByPos, R, B, _);
      e < H.from && this.left.forEachLine(e, H.from - 1, R, B, _, $), H.to >= e && H.from <= r && $(H), r > H.to && this.right.forEachLine(H.to + 1, r, R, F, V, $);
    }
  }
  replace(e, r, R) {
    let B = this.left.length + this.break;
    if (r < B)
      return this.balanced(this.left.replace(e, r, R), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - B, r - B, R));
    let _ = [];
    e > 0 && this.decomposeLeft(e, _);
    let $ = _.length;
    for (let F of R)
      _.push(F);
    if (e > 0 && mergeGaps(_, $ - 1), r < this.length) {
      let F = _.length;
      this.decomposeRight(r, _), mergeGaps(_, F);
    }
    return HeightMap.of(_);
  }
  decomposeLeft(e, r) {
    let R = this.left.length;
    if (e <= R)
      return this.left.decomposeLeft(e, r);
    r.push(this.left), this.break && (R++, e >= R && r.push(null)), e > R && this.right.decomposeLeft(e - R, r);
  }
  decomposeRight(e, r) {
    let R = this.left.length, B = R + this.break;
    if (e >= B)
      return this.right.decomposeRight(e - B, r);
    e < R && this.left.decomposeRight(e, r), this.break && e < B && r.push(null), r.push(this.right);
  }
  balanced(e, r) {
    return e.size > 2 * r.size || r.size > 2 * e.size ? HeightMap.of(this.break ? [e, null, r] : [e, r]) : (this.left = replace$1(this.left, e), this.right = replace$1(this.right, r), this.setHeight(e.height + r.height), this.outdated = e.outdated || r.outdated, this.size = e.size + r.size, this.length = e.length + this.break + r.length, this);
  }
  updateHeight(e, r = 0, R = !1, B) {
    let { left: _, right: $ } = this, F = r + _.length + this.break, V = null;
    return B && B.from <= r + _.length && B.more ? V = _ = _.updateHeight(e, r, R, B) : _.updateHeight(e, r, R), B && B.from <= F + $.length && B.more ? V = $ = $.updateHeight(e, F, R, B) : $.updateHeight(e, F, R), V ? this.balanced(_, $) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function mergeGaps(s, e) {
  let r, R;
  s[e] == null && (r = s[e - 1]) instanceof HeightMapGap && (R = s[e + 1]) instanceof HeightMapGap && s.splice(e - 1, 3, new HeightMapGap(r.length + 1 + R.length));
}
const relevantWidgetHeight = 5;
class NodeBuilder {
  constructor(e, r) {
    this.pos = e, this.oracle = r, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, r) {
    if (this.lineStart > -1) {
      let R = Math.min(r, this.lineEnd), B = this.nodes[this.nodes.length - 1];
      B instanceof HeightMapText ? B.length += R - this.pos : (R > this.pos || !this.isCovered) && this.nodes.push(new HeightMapText(R - this.pos, -1)), this.writtenTo = R, r > R && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = r;
  }
  point(e, r, R) {
    if (e < r || R.heightRelevant) {
      let B = R.widget ? R.widget.estimatedHeight : 0, _ = R.widget ? R.widget.lineBreaks : 0;
      B < 0 && (B = this.oracle.lineHeight);
      let $ = r - e;
      R.block ? this.addBlock(new HeightMapBlock($, B, R)) : ($ || _ || B >= relevantWidgetHeight) && this.addLineDeco(B, _, $);
    } else r > e && this.span(e, r);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: r } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = r, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new HeightMapText(this.pos - e, -1)), this.writtenTo = this.pos;
  }
  blankContent(e, r) {
    let R = new HeightMapGap(r - e);
    return this.oracle.doc.lineAt(e).to == r && (R.flags |= 4), R;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof HeightMapText)
      return e;
    let r = new HeightMapText(0, -1);
    return this.nodes.push(r), r;
  }
  addBlock(e) {
    this.enterLine();
    let r = e.deco;
    r && r.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, r && r.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, r, R) {
    let B = this.ensureLine();
    B.length += R, B.collapsed += R, B.widgetHeight = Math.max(B.widgetHeight, e), B.breaks += r, this.writtenTo = this.pos = this.pos + R;
  }
  finish(e) {
    let r = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(r instanceof HeightMapText) && !this.isCovered ? this.nodes.push(new HeightMapText(0, -1)) : (this.writtenTo < this.pos || r == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let R = e;
    for (let B of this.nodes)
      B instanceof HeightMapText && B.updateHeight(this.oracle, R), R += B ? B.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, r, R, B) {
    let _ = new NodeBuilder(R, e);
    return RangeSet.spans(r, R, B, _, 0), _.finish(R);
  }
}
function heightRelevantDecoChanges(s, e, r) {
  let R = new DecorationComparator();
  return RangeSet.compare(s, e, r, R, 0), R.changes;
}
class DecorationComparator {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, r, R, B) {
    (e < r || R && R.heightRelevant || B && B.heightRelevant) && addRange(e, r, this.changes, 5);
  }
}
function visiblePixelRange(s, e) {
  let r = s.getBoundingClientRect(), R = s.ownerDocument, B = R.defaultView || window, _ = Math.max(0, r.left), $ = Math.min(B.innerWidth, r.right), F = Math.max(0, r.top), V = Math.min(B.innerHeight, r.bottom);
  for (let H = s.parentNode; H && H != R.body; )
    if (H.nodeType == 1) {
      let W = H, U = window.getComputedStyle(W);
      if ((W.scrollHeight > W.clientHeight || W.scrollWidth > W.clientWidth) && U.overflow != "visible") {
        let z = W.getBoundingClientRect();
        _ = Math.max(_, z.left), $ = Math.min($, z.right), F = Math.max(F, z.top), V = Math.min(H == s.parentNode ? B.innerHeight : V, z.bottom);
      }
      H = U.position == "absolute" || U.position == "fixed" ? W.offsetParent : W.parentNode;
    } else if (H.nodeType == 11)
      H = H.host;
    else
      break;
  return {
    left: _ - r.left,
    right: Math.max(_, $) - r.left,
    top: F - (r.top + e),
    bottom: Math.max(F, V) - (r.top + e)
  };
}
function fullPixelRange(s, e) {
  let r = s.getBoundingClientRect();
  return {
    left: 0,
    right: r.right - r.left,
    top: e,
    bottom: r.bottom - (r.top + e)
  };
}
class LineGap {
  constructor(e, r, R, B) {
    this.from = e, this.to = r, this.size = R, this.displaySize = B;
  }
  static same(e, r) {
    if (e.length != r.length)
      return !1;
    for (let R = 0; R < e.length; R++) {
      let B = e[R], _ = r[R];
      if (B.from != _.from || B.to != _.to || B.size != _.size)
        return !1;
    }
    return !0;
  }
  draw(e, r) {
    return Decoration.replace({
      widget: new LineGapWidget(this.displaySize * (r ? e.scaleY : e.scaleX), r)
    }).range(this.from, this.to);
  }
}
class LineGapWidget extends WidgetType {
  constructor(e, r) {
    super(), this.size = e, this.vertical = r;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class ViewState {
  constructor(e) {
    this.state = e, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !1, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = IdScaler, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = Direction.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let r = e.facet(contentAttributes).some((R) => typeof R != "function" && R.class == "cm-lineWrapping");
    this.heightOracle = new HeightOracle(r), this.stateDeco = e.facet(decorations).filter((R) => typeof R != "function"), this.heightMap = HeightMap.empty().applyChanges(this.stateDeco, Text$1.empty, this.heightOracle.setDoc(e.doc), [new ChangedRange(0, 0, 0, e.doc.length)]);
    for (let R = 0; R < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); R++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = Decoration.set(this.lineGaps.map((R) => R.draw(this, !1))), this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: r } = this.state.selection;
    for (let R = 0; R <= 1; R++) {
      let B = R ? r.head : r.anchor;
      if (!e.some(({ from: _, to: $ }) => B >= _ && B <= $)) {
        let { from: _, to: $ } = this.lineBlockAt(B);
        e.push(new Viewport(_, $));
      }
    }
    return this.viewports = e.sort((R, B) => R.from - B.from), this.updateScaler();
  }
  updateScaler() {
    let e = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? IdScaler : new BigScaler(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(scaleBlock(e, this.scaler));
    });
  }
  update(e, r = null) {
    this.state = e.state;
    let R = this.stateDeco;
    this.stateDeco = this.state.facet(decorations).filter((W) => typeof W != "function");
    let B = e.changedRanges, _ = ChangedRange.extendWithRanges(B, heightRelevantDecoChanges(R, this.stateDeco, e ? e.changes : ChangeSet.empty(this.state.doc.length))), $ = this.heightMap.height, F = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
    clearHeightChangeFlag(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), _), (this.heightMap.height != $ || heightChangeFlag) && (e.flags |= 2), F ? (this.scrollAnchorPos = e.changes.mapPos(F.from, -1), this.scrollAnchorHeight = F.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = this.heightMap.height);
    let V = _.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (r && (r.range.head < V.from || r.range.head > V.to) || !this.viewportIsAppropriate(V)) && (V = this.getViewport(0, r));
    let H = V.from != this.viewport.from || V.to != this.viewport.to;
    this.viewport = V, e.flags |= this.updateForViewport(), (H || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), r && (this.scrollTarget = r), !this.mustEnforceCursorAssoc && e.selectionSet && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(nativeSelectionHidden) && (this.mustEnforceCursorAssoc = !0);
  }
  measure(e) {
    let r = e.contentDOM, R = window.getComputedStyle(r), B = this.heightOracle, _ = R.whiteSpace;
    this.defaultTextDirection = R.direction == "rtl" ? Direction.RTL : Direction.LTR;
    let $ = this.heightOracle.mustRefreshForWrapping(_), F = r.getBoundingClientRect(), V = $ || this.mustMeasureContent || this.contentDOMHeight != F.height;
    this.contentDOMHeight = F.height, this.mustMeasureContent = !1;
    let H = 0, W = 0;
    if (F.width && F.height) {
      let { scaleX: de, scaleY: re } = getScale(r, F);
      (de > 5e-3 && Math.abs(this.scaleX - de) > 5e-3 || re > 5e-3 && Math.abs(this.scaleY - re) > 5e-3) && (this.scaleX = de, this.scaleY = re, H |= 16, $ = V = !0);
    }
    let U = (parseInt(R.paddingTop) || 0) * this.scaleY, z = (parseInt(R.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != U || this.paddingBottom != z) && (this.paddingTop = U, this.paddingBottom = z, H |= 18), this.editorWidth != e.scrollDOM.clientWidth && (B.lineWrapping && (V = !0), this.editorWidth = e.scrollDOM.clientWidth, H |= 16);
    let K = e.scrollDOM.scrollTop * this.scaleY;
    this.scrollTop != K && (this.scrollAnchorHeight = -1, this.scrollTop = K), this.scrolledToBottom = isScrolledToBottom(e.scrollDOM);
    let X = (this.printing ? fullPixelRange : visiblePixelRange)(r, this.paddingTop), Z = X.top - this.pixelViewport.top, Y = X.bottom - this.pixelViewport.bottom;
    this.pixelViewport = X;
    let te = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (te != this.inView && (this.inView = te, te && (V = !0)), !this.inView && !this.scrollTarget)
      return 0;
    let ue = F.width;
    if ((this.contentDOMWidth != ue || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = F.width, this.editorHeight = e.scrollDOM.clientHeight, H |= 16), V) {
      let de = e.docView.measureVisibleLineHeights(this.viewport);
      if (B.mustRefreshForHeights(de) && ($ = !0), $ || B.lineWrapping && Math.abs(ue - this.contentDOMWidth) > B.charWidth) {
        let { lineHeight: re, charWidth: ae, textHeight: le } = e.docView.measureTextSize();
        $ = re > 0 && B.refresh(_, re, ae, le, ue / ae, de), $ && (e.docView.minWidth = 0, H |= 16);
      }
      Z > 0 && Y > 0 ? W = Math.max(Z, Y) : Z < 0 && Y < 0 && (W = Math.min(Z, Y)), clearHeightChangeFlag();
      for (let re of this.viewports) {
        let ae = re.from == this.viewport.from ? de : e.docView.measureVisibleLineHeights(re);
        this.heightMap = ($ ? HeightMap.empty().applyChanges(this.stateDeco, Text$1.empty, this.heightOracle, [new ChangedRange(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(B, 0, $, new MeasuredHeights(re.from, ae));
      }
      heightChangeFlag && (H |= 2);
    }
    let fe = !this.viewportIsAppropriate(this.viewport, W) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return fe && (H & 2 && (H |= this.updateScaler()), this.viewport = this.getViewport(W, this.scrollTarget), H |= this.updateForViewport()), (H & 2 || fe) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps($ ? [] : this.lineGaps, e)), H |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), H;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, r) {
    let R = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), B = this.heightMap, _ = this.heightOracle, { visibleTop: $, visibleBottom: F } = this, V = new Viewport(B.lineAt($ - R * 1e3, QueryType$1.ByHeight, _, 0, 0).from, B.lineAt(F + (1 - R) * 1e3, QueryType$1.ByHeight, _, 0, 0).to);
    if (r) {
      let { head: H } = r.range;
      if (H < V.from || H > V.to) {
        let W = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), U = B.lineAt(H, QueryType$1.ByPos, _, 0, 0), z;
        r.y == "center" ? z = (U.top + U.bottom) / 2 - W / 2 : r.y == "start" || r.y == "nearest" && H < V.from ? z = U.top : z = U.bottom - W, V = new Viewport(B.lineAt(z - 1e3 / 2, QueryType$1.ByHeight, _, 0, 0).from, B.lineAt(z + W + 1e3 / 2, QueryType$1.ByHeight, _, 0, 0).to);
      }
    }
    return V;
  }
  mapViewport(e, r) {
    let R = r.mapPos(e.from, -1), B = r.mapPos(e.to, 1);
    return new Viewport(this.heightMap.lineAt(R, QueryType$1.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(B, QueryType$1.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: r }, R = 0) {
    if (!this.inView)
      return !0;
    let { top: B } = this.heightMap.lineAt(e, QueryType$1.ByPos, this.heightOracle, 0, 0), { bottom: _ } = this.heightMap.lineAt(r, QueryType$1.ByPos, this.heightOracle, 0, 0), { visibleTop: $, visibleBottom: F } = this;
    return (e == 0 || B <= $ - Math.max(10, Math.min(
      -R,
      250
      /* VP.MaxCoverMargin */
    ))) && (r == this.state.doc.length || _ >= F + Math.max(10, Math.min(
      R,
      250
      /* VP.MaxCoverMargin */
    ))) && B > $ - 2 * 1e3 && _ < F + 2 * 1e3;
  }
  mapLineGaps(e, r) {
    if (!e.length || r.empty)
      return e;
    let R = [];
    for (let B of e)
      r.touchesRange(B.from, B.to) || R.push(new LineGap(r.mapPos(B.from), r.mapPos(B.to), B.size, B.displaySize));
    return R;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, r) {
    let R = this.heightOracle.lineWrapping, B = R ? 1e4 : 2e3, _ = B >> 1, $ = B << 1;
    if (this.defaultTextDirection != Direction.LTR && !R)
      return [];
    let F = [], V = (W, U, z, K) => {
      if (U - W < _)
        return;
      let X = this.state.selection.main, Z = [X.from];
      X.empty || Z.push(X.to);
      for (let te of Z)
        if (te > W && te < U) {
          V(W, te - 10, z, K), V(te + 10, U, z, K);
          return;
        }
      let Y = find(e, (te) => te.from >= z.from && te.to <= z.to && Math.abs(te.from - W) < _ && Math.abs(te.to - U) < _ && !Z.some((ue) => te.from < ue && te.to > ue));
      if (!Y) {
        if (U < z.to && r && R && r.visibleRanges.some((fe) => fe.from <= U && fe.to >= U)) {
          let fe = r.moveToLineBoundary(EditorSelection.cursor(U), !1, !0).head;
          fe > W && (U = fe);
        }
        let te = this.gapSize(z, W, U, K), ue = R || te < 2e6 ? te : 2e6;
        Y = new LineGap(W, U, te, ue);
      }
      F.push(Y);
    }, H = (W) => {
      if (W.length < $ || W.type != BlockType.Text)
        return;
      let U = lineStructure(W.from, W.to, this.stateDeco);
      if (U.total < $)
        return;
      let z = this.scrollTarget ? this.scrollTarget.range.head : null, K, X;
      if (R) {
        let Z = B / this.heightOracle.lineLength * this.heightOracle.lineHeight, Y, te;
        if (z != null) {
          let ue = findFraction(U, z), fe = ((this.visibleBottom - this.visibleTop) / 2 + Z) / W.height;
          Y = ue - fe, te = ue + fe;
        } else
          Y = (this.visibleTop - W.top - Z) / W.height, te = (this.visibleBottom - W.top + Z) / W.height;
        K = findPosition(U, Y), X = findPosition(U, te);
      } else {
        let Z = U.total * this.heightOracle.charWidth, Y = B * this.heightOracle.charWidth, te = 0;
        if (Z > 2e6)
          for (let ae of e)
            ae.from >= W.from && ae.from < W.to && ae.size != ae.displaySize && ae.from * this.heightOracle.charWidth + te < this.pixelViewport.left && (te = ae.size - ae.displaySize);
        let ue = this.pixelViewport.left + te, fe = this.pixelViewport.right + te, de, re;
        if (z != null) {
          let ae = findFraction(U, z), le = ((fe - ue) / 2 + Y) / Z;
          de = ae - le, re = ae + le;
        } else
          de = (ue - Y) / Z, re = (fe + Y) / Z;
        K = findPosition(U, de), X = findPosition(U, re);
      }
      K > W.from && V(W.from, K, W, U), X < W.to && V(X, W.to, W, U);
    };
    for (let W of this.viewportLines)
      Array.isArray(W.type) ? W.type.forEach(H) : H(W);
    return F;
  }
  gapSize(e, r, R, B) {
    let _ = findFraction(B, R) - findFraction(B, r);
    return this.heightOracle.lineWrapping ? e.height * _ : B.total * this.heightOracle.charWidth * _;
  }
  updateLineGaps(e) {
    LineGap.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = Decoration.set(e.map((r) => r.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges(e) {
    let r = this.stateDeco;
    this.lineGaps.length && (r = r.concat(this.lineGapDeco));
    let R = [];
    RangeSet.spans(r, this.viewport.from, this.viewport.to, {
      span(_, $) {
        R.push({ from: _, to: $ });
      },
      point() {
      }
    }, 20);
    let B = 0;
    if (R.length != this.visibleRanges.length)
      B = 12;
    else
      for (let _ = 0; _ < R.length && !(B & 8); _++) {
        let $ = this.visibleRanges[_], F = R[_];
        ($.from != F.from || $.to != F.to) && (B |= 4, e && e.mapPos($.from, -1) == F.from && e.mapPos($.to, 1) == F.to || (B |= 8));
      }
    return this.visibleRanges = R, B;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((r) => r.from <= e && r.to >= e) || scaleBlock(this.heightMap.lineAt(e, QueryType$1.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((r) => r.top <= e && r.bottom >= e) || scaleBlock(this.heightMap.lineAt(this.scaler.fromDOM(e), QueryType$1.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  scrollAnchorAt(e) {
    let r = this.lineBlockAtHeight(e + 8);
    return r.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? r : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return scaleBlock(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class Viewport {
  constructor(e, r) {
    this.from = e, this.to = r;
  }
}
function lineStructure(s, e, r) {
  let R = [], B = s, _ = 0;
  return RangeSet.spans(r, s, e, {
    span() {
    },
    point($, F) {
      $ > B && (R.push({ from: B, to: $ }), _ += $ - B), B = F;
    }
  }, 20), B < e && (R.push({ from: B, to: e }), _ += e - B), { total: _, ranges: R };
}
function findPosition({ total: s, ranges: e }, r) {
  if (r <= 0)
    return e[0].from;
  if (r >= 1)
    return e[e.length - 1].to;
  let R = Math.floor(s * r);
  for (let B = 0; ; B++) {
    let { from: _, to: $ } = e[B], F = $ - _;
    if (R <= F)
      return _ + R;
    R -= F;
  }
}
function findFraction(s, e) {
  let r = 0;
  for (let { from: R, to: B } of s.ranges) {
    if (e <= B) {
      r += e - R;
      break;
    }
    r += B - R;
  }
  return r / s.total;
}
function find(s, e) {
  for (let r of s)
    if (e(r))
      return r;
}
const IdScaler = {
  toDOM(s) {
    return s;
  },
  fromDOM(s) {
    return s;
  },
  scale: 1,
  eq(s) {
    return s == this;
  }
};
class BigScaler {
  constructor(e, r, R) {
    let B = 0, _ = 0, $ = 0;
    this.viewports = R.map(({ from: F, to: V }) => {
      let H = r.lineAt(F, QueryType$1.ByPos, e, 0, 0).top, W = r.lineAt(V, QueryType$1.ByPos, e, 0, 0).bottom;
      return B += W - H, { from: F, to: V, top: H, bottom: W, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - B) / (r.height - B);
    for (let F of this.viewports)
      F.domTop = $ + (F.top - _) * this.scale, $ = F.domBottom = F.domTop + (F.bottom - F.top), _ = F.bottom;
  }
  toDOM(e) {
    for (let r = 0, R = 0, B = 0; ; r++) {
      let _ = r < this.viewports.length ? this.viewports[r] : null;
      if (!_ || e < _.top)
        return B + (e - R) * this.scale;
      if (e <= _.bottom)
        return _.domTop + (e - _.top);
      R = _.bottom, B = _.domBottom;
    }
  }
  fromDOM(e) {
    for (let r = 0, R = 0, B = 0; ; r++) {
      let _ = r < this.viewports.length ? this.viewports[r] : null;
      if (!_ || e < _.domTop)
        return R + (e - B) / this.scale;
      if (e <= _.domBottom)
        return _.top + (e - _.domTop);
      R = _.bottom, B = _.domBottom;
    }
  }
  eq(e) {
    return e instanceof BigScaler ? this.scale == e.scale && this.viewports.length == e.viewports.length && this.viewports.every((r, R) => r.from == e.viewports[R].from && r.to == e.viewports[R].to) : !1;
  }
}
function scaleBlock(s, e) {
  if (e.scale == 1)
    return s;
  let r = e.toDOM(s.top), R = e.toDOM(s.bottom);
  return new BlockInfo(s.from, s.length, r, R - r, Array.isArray(s._content) ? s._content.map((B) => scaleBlock(B, e)) : s._content);
}
const theme = /* @__PURE__ */ Facet.define({ combine: (s) => s.join(" ") }), darkTheme = /* @__PURE__ */ Facet.define({ combine: (s) => s.indexOf(!0) > -1 }), baseThemeID = /* @__PURE__ */ StyleModule.newName(), baseLightID = /* @__PURE__ */ StyleModule.newName(), baseDarkID = /* @__PURE__ */ StyleModule.newName(), lightDarkIDs = { "&light": "." + baseLightID, "&dark": "." + baseDarkID };
function buildTheme(s, e, r) {
  return new StyleModule(e, {
    finish(R) {
      return /&/.test(R) ? R.replace(/&\w*/, (B) => {
        if (B == "&")
          return s;
        if (!r || !r[B])
          throw new RangeError(`Unsupported selector: ${B}`);
        return r[B];
      }) : s + " " + R;
    }
  });
}
const baseTheme$1$3 = /* @__PURE__ */ buildTheme("." + baseThemeID, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0,
    overflowAnchor: "none"
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // https://github.com/codemirror/dev/issues/456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#ddd"
  },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    insetInlineStart: 0,
    zIndex: 200
  },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    borderRight: "1px solid #ddd"
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0,
    zIndex: 300
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top"
  },
  ".cm-highlightSpace": {
    backgroundImage: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",
    backgroundPosition: "center"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, lightDarkIDs), observeOptions = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, useCharData = browser.ie && browser.ie_version <= 11;
class DOMObserver {
  constructor(e) {
    this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new DOMSelectionState(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((r) => {
      for (let R of r)
        this.queue.push(R);
      (browser.ie && browser.ie_version <= 11 || browser.ios && e.composing) && r.some((R) => R.type == "childList" && R.removedNodes.length || R.type == "characterData" && R.oldValue.length > R.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && e.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(browser.chrome && browser.chrome_version < 126) && (this.editContext = new EditContextManager(e), e.state.facet(editable) && (e.contentDOM.editContext = this.editContext.editContext)), useCharData && (this.onCharData = (r) => {
      this.queue.push({
        target: r.target,
        type: "characterData",
        oldValue: r.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var r;
      ((r = this.view.docView) === null || r === void 0 ? void 0 : r.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((r) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), r.length > 0 && r[r.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((r) => {
      r.length > 0 && r[r.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(e) {
    (e.type == "change" || !e.type) && !e.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((r, R) => r != e[R]))) {
      this.gapIntersection.disconnect();
      for (let r of e)
        this.gapIntersection.observe(r);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let r = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: R } = this, B = this.selectionRange;
    if (R.state.facet(editable) ? R.root.activeElement != this.dom : !hasSelection$1(this.dom, B))
      return;
    let _ = B.anchorNode && R.docView.nearest(B.anchorNode);
    if (_ && _.ignoreEvent(e)) {
      r || (this.selectionChanged = !1);
      return;
    }
    (browser.ie && browser.ie_version <= 11 || browser.android && browser.chrome) && !R.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    B.focusNode && isEquivalentPosition(B.focusNode, B.focusOffset, B.anchorNode, B.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, r = getSelection(e.root);
    if (!r)
      return !1;
    let R = browser.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && safariSelectionRangeHack(this.view, r) || r;
    if (!R || this.selectionRange.eq(R))
      return !1;
    let B = hasSelection$1(this.dom, R);
    return B && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && atElementStart(this.dom, R) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(R), B && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, r) {
    this.selectionRange.set(e.node, e.offset, r.node, r.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, r = null;
    for (let R = this.dom; R; )
      if (R.nodeType == 1)
        !r && e < this.scrollTargets.length && this.scrollTargets[e] == R ? e++ : r || (r = this.scrollTargets.slice(0, e)), r && r.push(R), R = R.assignedSlot || R.parentNode;
      else if (R.nodeType == 11)
        R = R.host;
      else
        break;
    if (e < this.scrollTargets.length && !r && (r = this.scrollTargets.slice(0, e)), r) {
      for (let R of this.scrollTargets)
        R.removeEventListener("scroll", this.onScroll);
      for (let R of this.scrollTargets = r)
        R.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, observeOptions), useCharData && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), useCharData && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, r) {
    var R;
    if (!this.delayedAndroidKey) {
      let B = () => {
        let _ = this.delayedAndroidKey;
        _ && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = _.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && _.force && dispatchKey(this.dom, _.key, _.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(B);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: r,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((R = this.delayedAndroidKey) === null || R === void 0) && R.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let r = -1, R = -1, B = !1;
    for (let _ of e) {
      let $ = this.readMutation(_);
      $ && ($.typeOver && (B = !0), r == -1 ? { from: r, to: R } = $ : (r = Math.min($.from, r), R = Math.max($.to, R)));
    }
    return { from: r, to: R, typeOver: B };
  }
  readChange() {
    let { from: e, to: r, typeOver: R } = this.processRecords(), B = this.selectionChanged && hasSelection$1(this.dom, this.selectionRange);
    if (e < 0 && !B)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let _ = new DOMChange(this.view, e, r, R);
    return this.view.docView.domChanged = { newSel: _.newSel ? _.newSel.main : null }, _;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let r = this.readChange();
    if (!r)
      return this.view.requestMeasure(), !1;
    let R = this.view.state, B = applyDOMChange(this.view, r);
    return this.view.state == R && (r.domChanged || r.newSel && !r.newSel.main.eq(this.view.state.selection.main)) && this.view.update([]), B;
  }
  readMutation(e) {
    let r = this.view.docView.nearest(e.target);
    if (!r || r.ignoreMutation(e))
      return null;
    if (r.markDirty(e.type == "attributes"), e.type == "attributes" && (r.flags |= 4), e.type == "childList") {
      let R = findChild(r, e.previousSibling || e.target.previousSibling, -1), B = findChild(r, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: R ? r.posAfter(R) : r.posAtStart,
        to: B ? r.posBefore(B) : r.posAtEnd,
        typeOver: !1
      };
    } else return e.type == "characterData" ? { from: r.posAtStart, to: r.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(e) {
    this.editContext && (this.editContext.update(e), e.startState.facet(editable) != e.state.facet(editable) && (e.view.contentDOM.editContext = e.state.facet(editable) ? this.editContext.editContext : null));
  }
  destroy() {
    var e, r, R;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (r = this.gapIntersection) === null || r === void 0 || r.disconnect(), (R = this.resizeScroll) === null || R === void 0 || R.disconnect();
    for (let B of this.scrollTargets)
      B.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
  }
}
function findChild(s, e, r) {
  for (; e; ) {
    let R = ContentView.get(e);
    if (R && R.parent == s)
      return R;
    let B = e.parentNode;
    e = B != s.dom ? B : r > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function buildSelectionRangeFromRange(s, e) {
  let r = e.startContainer, R = e.startOffset, B = e.endContainer, _ = e.endOffset, $ = s.docView.domAtPos(s.state.selection.main.anchor);
  return isEquivalentPosition($.node, $.offset, B, _) && ([r, R, B, _] = [B, _, r, R]), { anchorNode: r, anchorOffset: R, focusNode: B, focusOffset: _ };
}
function safariSelectionRangeHack(s, e) {
  if (e.getComposedRanges) {
    let B = e.getComposedRanges(s.root)[0];
    if (B)
      return buildSelectionRangeFromRange(s, B);
  }
  let r = null;
  function R(B) {
    B.preventDefault(), B.stopImmediatePropagation(), r = B.getTargetRanges()[0];
  }
  return s.contentDOM.addEventListener("beforeinput", R, !0), s.dom.ownerDocument.execCommand("indent"), s.contentDOM.removeEventListener("beforeinput", R, !0), r ? buildSelectionRangeFromRange(s, r) : null;
}
class EditContextManager {
  constructor(e) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = /* @__PURE__ */ Object.create(null), this.composing = null, this.resetRange(e.state);
    let r = this.editContext = new window.EditContext({
      text: e.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(e.state.selection.main.head)
    });
    this.handlers.textupdate = (R) => {
      let { anchor: B } = e.state.selection.main, _ = this.toEditorPos(R.updateRangeStart), $ = this.toEditorPos(R.updateRangeEnd);
      e.inputState.composing >= 0 && !this.composing && (this.composing = { contextBase: R.updateRangeStart, editorBase: _, drifted: !1 });
      let F = { from: _, to: $, insert: Text$1.of(R.text.split(`
`)) };
      if (F.from == this.from && B < this.from ? F.from = B : F.to == this.to && B > this.to && (F.to = B), !(F.from == F.to && !F.insert.length)) {
        if (this.pendingContextChange = F, !e.state.readOnly) {
          let V = this.to - this.from + (F.to - F.from + F.insert.length);
          applyDOMChangeInner(e, F, EditorSelection.single(this.toEditorPos(R.selectionStart, V), this.toEditorPos(R.selectionEnd, V)));
        }
        this.pendingContextChange && (this.revertPending(e.state), this.setSelection(e.state));
      }
    }, this.handlers.characterboundsupdate = (R) => {
      let B = [], _ = null;
      for (let $ = this.toEditorPos(R.rangeStart), F = this.toEditorPos(R.rangeEnd); $ < F; $++) {
        let V = e.coordsForChar($);
        _ = V && new DOMRect(V.left, V.top, V.right - V.left, V.bottom - V.top) || _ || new DOMRect(), B.push(_);
      }
      r.updateCharacterBounds(R.rangeStart, B);
    }, this.handlers.textformatupdate = (R) => {
      let B = [];
      for (let _ of R.getTextFormats()) {
        let $ = _.underlineStyle, F = _.underlineThickness;
        if ($ != "None" && F != "None") {
          let V = this.toEditorPos(_.rangeStart), H = this.toEditorPos(_.rangeEnd);
          if (V < H) {
            let W = `text-decoration: underline ${$ == "Dashed" ? "dashed " : $ == "Squiggle" ? "wavy " : ""}${F == "Thin" ? 1 : 2}px`;
            B.push(Decoration.mark({ attributes: { style: W } }).range(V, H));
          }
        }
      }
      e.dispatch({ effects: setEditContextFormatting.of(Decoration.set(B)) });
    }, this.handlers.compositionstart = () => {
      e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
    }, this.handlers.compositionend = () => {
      if (e.inputState.composing = -1, e.inputState.compositionFirstChange = null, this.composing) {
        let { drifted: R } = this.composing;
        this.composing = null, R && this.reset(e.state);
      }
    };
    for (let R in this.handlers)
      r.addEventListener(R, this.handlers[R]);
    this.measureReq = { read: (R) => {
      this.editContext.updateControlBounds(R.contentDOM.getBoundingClientRect());
      let B = getSelection(R.root);
      B && B.rangeCount && this.editContext.updateSelectionBounds(B.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(e) {
    let r = 0, R = !1, B = this.pendingContextChange;
    return e.changes.iterChanges((_, $, F, V, H) => {
      if (R)
        return;
      let W = H.length - ($ - _);
      if (B && $ >= B.to)
        if (B.from == _ && B.to == $ && B.insert.eq(H)) {
          B = this.pendingContextChange = null, r += W, this.to += W;
          return;
        } else
          B = null, this.revertPending(e.state);
      if (_ += r, $ += r, $ <= this.from)
        this.from += W, this.to += W;
      else if (_ < this.to) {
        if (_ < this.from || $ > this.to || this.to - this.from + H.length > 3e4) {
          R = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(_), this.toContextPos($), H.toString()), this.to += W;
      }
      r += W;
    }), B && !R && this.revertPending(e.state), !R;
  }
  update(e) {
    let r = this.pendingContextChange;
    this.composing && (this.composing.drifted || e.transactions.some((R) => !R.isUserEvent("input.type") && R.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = e.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.reset(e.state)) : (e.docChanged || e.selectionSet || r) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
  }
  resetRange(e) {
    let { head: r } = e.selection.main;
    this.from = Math.max(
      0,
      r - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      e.doc.length,
      r + 1e4
      /* CxVp.Margin */
    );
  }
  reset(e) {
    this.resetRange(e), this.editContext.updateText(0, this.editContext.text.length, e.doc.sliceString(this.from, this.to)), this.setSelection(e);
  }
  revertPending(e) {
    let r = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(r.from), this.toContextPos(r.from + r.insert.length), e.doc.sliceString(r.from, r.to));
  }
  setSelection(e) {
    let { main: r } = e.selection, R = this.toContextPos(Math.max(this.from, Math.min(this.to, r.anchor))), B = this.toContextPos(r.head);
    (this.editContext.selectionStart != R || this.editContext.selectionEnd != B) && this.editContext.updateSelection(R, B);
  }
  rangeIsValid(e) {
    let { head: r } = e.selection.main;
    return !(this.from > 0 && r - this.from < 500 || this.to < e.doc.length && this.to - r < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(e, r = this.to - this.from) {
    e = Math.min(e, r);
    let R = this.composing;
    return R && R.drifted ? R.editorBase + (e - R.contextBase) : e + this.from;
  }
  toContextPos(e) {
    let r = this.composing;
    return r && r.drifted ? r.contextBase + (e - r.editorBase) : e - this.from;
  }
  destroy() {
    for (let e in this.handlers)
      this.editContext.removeEventListener(e, this.handlers[e]);
  }
}
class EditorView {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    var r;
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: R } = e;
    this.dispatchTransactions = e.dispatchTransactions || R && ((B) => B.forEach((_) => R(_, this))) || ((B) => this.update(B)), this.dispatch = this.dispatch.bind(this), this._root = e.root || getRoot(e.parent) || document, this.viewState = new ViewState(e.state || EditorState.create(e)), e.scrollTo && e.scrollTo.is(scrollIntoView$1) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(viewPlugin).map((B) => new PluginInstance(B));
    for (let B of this.plugins)
      B.update(this);
    this.observer = new DOMObserver(this), this.inputState = new InputState(this), this.inputState.ensureHandlers(this.plugins), this.docView = new DocView(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), !((r = document.fonts) === null || r === void 0) && r.ready && document.fonts.ready.then(() => this.requestMeasure());
  }
  dispatch(...e) {
    let r = e.length == 1 && e[0] instanceof Transaction ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(r, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let r = !1, R = !1, B, _ = this.state;
    for (let z of e) {
      if (z.startState != _)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      _ = z.state;
    }
    if (this.destroyed) {
      this.viewState.state = _;
      return;
    }
    let $ = this.hasFocus, F = 0, V = null;
    e.some((z) => z.annotation(isFocusChange)) ? (this.inputState.notifiedFocused = $, F = 1) : $ != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = $, V = focusChangeTransaction(_, $), V || (F = 1));
    let H = this.observer.delayedAndroidKey, W = null;
    if (H ? (this.observer.clearDelayedAndroidKey(), W = this.observer.readChange(), (W && !this.state.doc.eq(_.doc) || !this.state.selection.eq(_.selection)) && (W = null)) : this.observer.clear(), _.facet(EditorState.phrases) != this.state.facet(EditorState.phrases))
      return this.setState(_);
    B = ViewUpdate.create(this, _, e), B.flags |= F;
    let U = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let z of e) {
        if (U && (U = U.map(z.changes)), z.scrollIntoView) {
          let { main: K } = z.state.selection;
          U = new ScrollTarget(K.empty ? K : EditorSelection.cursor(K.head, K.head > K.anchor ? -1 : 1));
        }
        for (let K of z.effects)
          K.is(scrollIntoView$1) && (U = K.value.clip(this.state));
      }
      this.viewState.update(B, U), this.bidiCache = CachedOrder.update(this.bidiCache, B.changes), B.empty || (this.updatePlugins(B), this.inputState.update(B)), r = this.docView.update(B), this.state.facet(styleModule) != this.styleModules && this.mountStyles(), R = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(r, e.some((z) => z.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (B.startState.facet(theme) != B.state.facet(theme) && (this.viewState.mustMeasureContent = !0), (r || R || U || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), r && this.docViewUpdate(), !B.empty)
      for (let z of this.state.facet(updateListener))
        try {
          z(B);
        } catch (K) {
          logException(this.state, K, "update listener");
        }
    (V || W) && Promise.resolve().then(() => {
      V && this.state == V.startState && this.dispatch(V), W && !applyDOMChange(this, W) && H.force && dispatchKey(this.contentDOM, H.key, H.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let r = this.hasFocus;
    try {
      for (let R of this.plugins)
        R.destroy(this);
      this.viewState = new ViewState(e), this.plugins = e.facet(viewPlugin).map((R) => new PluginInstance(R)), this.pluginMap.clear();
      for (let R of this.plugins)
        R.update(this);
      this.docView.destroy(), this.docView = new DocView(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    r && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let r = e.startState.facet(viewPlugin), R = e.state.facet(viewPlugin);
    if (r != R) {
      let B = [];
      for (let _ of R) {
        let $ = r.indexOf(_);
        if ($ < 0)
          B.push(new PluginInstance(_));
        else {
          let F = this.plugins[$];
          F.mustUpdate = e, B.push(F);
        }
      }
      for (let _ of this.plugins)
        _.mustUpdate != e && _.destroy(this);
      this.plugins = B, this.pluginMap.clear();
    } else
      for (let B of this.plugins)
        B.mustUpdate = e;
    for (let B = 0; B < this.plugins.length; B++)
      this.plugins[B].update(this);
    r != R && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let e of this.plugins) {
      let r = e.value;
      if (r && r.docViewUpdate)
        try {
          r.docViewUpdate(this);
        } catch (R) {
          logException(this.state, R, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let r = null, R = this.scrollDOM, B = R.scrollTop * this.scaleY, { scrollAnchorPos: _, scrollAnchorHeight: $ } = this.viewState;
    Math.abs(B - this.viewState.scrollTop) > 1 && ($ = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let F = 0; ; F++) {
        if ($ < 0)
          if (isScrolledToBottom(R))
            _ = -1, $ = this.viewState.heightMap.height;
          else {
            let K = this.viewState.scrollAnchorAt(B);
            _ = K.from, $ = K.top;
          }
        this.updateState = 1;
        let V = this.viewState.measure(this);
        if (!V && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (F > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let H = [];
        V & 4 || ([this.measureRequests, H] = [H, this.measureRequests]);
        let W = H.map((K) => {
          try {
            return K.read(this);
          } catch (X) {
            return logException(this.state, X), BadMeasure;
          }
        }), U = ViewUpdate.create(this, this.state, []), z = !1;
        U.flags |= V, r ? r.flags |= V : r = U, this.updateState = 2, U.empty || (this.updatePlugins(U), this.inputState.update(U), this.updateAttrs(), z = this.docView.update(U), z && this.docViewUpdate());
        for (let K = 0; K < H.length; K++)
          if (W[K] != BadMeasure)
            try {
              let X = H[K];
              X.write && X.write(W[K], this);
            } catch (X) {
              logException(this.state, X);
            }
        if (z && this.docView.updateSelection(!0), !U.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, $ = -1;
              continue;
            } else {
              let X = (_ < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(_).top) - $;
              if (X > 1 || X < -1) {
                B = B + X, R.scrollTop = B / this.scaleY, $ = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (r && !r.empty)
      for (let F of this.state.facet(updateListener))
        F(r);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return baseThemeID + " " + (this.state.facet(darkTheme) ? baseDarkID : baseLightID) + " " + this.state.facet(theme);
  }
  updateAttrs() {
    let e = attrsFromFacet(this, editorAttributes, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), r = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      writingsuggestions: "false",
      translate: "no",
      contenteditable: this.state.facet(editable) ? "true" : "false",
      class: "cm-content",
      style: `${browser.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (r["aria-readonly"] = "true"), attrsFromFacet(this, contentAttributes, r);
    let R = this.observer.ignore(() => {
      let B = updateAttrs(this.contentDOM, this.contentAttrs, r), _ = updateAttrs(this.dom, this.editorAttrs, e);
      return B || _;
    });
    return this.editorAttrs = e, this.contentAttrs = r, R;
  }
  showAnnouncements(e) {
    let r = !0;
    for (let R of e)
      for (let B of R.effects)
        if (B.is(EditorView.announce)) {
          r && (this.announceDOM.textContent = ""), r = !1;
          let _ = this.announceDOM.appendChild(document.createElement("div"));
          _.textContent = B.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(styleModule);
    let e = this.state.facet(EditorView.cspNonce);
    StyleModule.mount(this.root, this.styleModules.concat(baseTheme$1$3).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let r = 0; r < this.measureRequests.length; r++)
          if (this.measureRequests[r].key === e.key) {
            this.measureRequests[r] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let r = this.pluginMap.get(e);
    return (r === void 0 || r && r.spec != e) && this.pluginMap.set(e, r = this.plugins.find((R) => R.spec == e) || null), r && r.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line break, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, r, R) {
    return skipAtoms(this, e, moveByChar(this, e, r, R));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, r) {
    return skipAtoms(this, e, moveByChar(this, e, r, (R) => byGroup(this, e.head, R)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, r) {
    let R = this.bidiSpans(e), B = this.textDirectionAt(e.from), _ = R[r ? R.length - 1 : 0];
    return EditorSelection.cursor(_.side(r, B) + e.from, _.forward(!r, B) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, r, R = !0) {
    return moveToLineBoundary(this, e, r, R);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, r, R) {
    return skipAtoms(this, e, moveVertically(this, e, r, R));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e) {
    return this.docView.domAtPos(e);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, r = 0) {
    return this.docView.posFromDOM(e, r);
  }
  posAtCoords(e, r = !0) {
    return this.readMeasured(), posAtCoords(this, e, r);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, r = 1) {
    this.readMeasured();
    let R = this.docView.coordsAt(e, r);
    if (!R || R.left == R.right)
      return R;
    let B = this.state.doc.lineAt(e), _ = this.bidiSpans(B), $ = _[BidiSpan.find(_, e - B.from, -1, r)];
    return flattenRect(R, $.dir == Direction.LTR == r > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(perLineTextDirection) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > MaxBidiLine)
      return trivialOrder(e.length);
    let r = this.textDirectionAt(e.from), R;
    for (let _ of this.bidiCache)
      if (_.from == e.from && _.dir == r && (_.fresh || isolatesEq(_.isolates, R = getIsolatedRanges(this, e))))
        return _.order;
    R || (R = getIsolatedRanges(this, e));
    let B = computeOrder(e.text, r, R);
    return this.bidiCache.push(new CachedOrder(e.from, e.to, r, R, !0, B)), B;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || browser.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      focusPreventScroll(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, r = {}) {
    return scrollIntoView$1.of(new ScrollTarget(typeof e == "number" ? EditorSelection.cursor(e) : e, r.y, r.x, r.yMargin, r.xMargin));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: r } = this.scrollDOM, R = this.viewState.scrollAnchorAt(e);
    return scrollIntoView$1.of(new ScrollTarget(EditorSelection.cursor(R.from), "start", "start", R.top - e, r, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(e) {
    e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return ViewPlugin.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return ViewPlugin.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, r) {
    let R = StyleModule.newName(), B = [theme.of(R), styleModule.of(buildTheme(`.${R}`, e))];
    return r && r.dark && B.push(darkTheme.of(!0)), B;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return Prec.lowest(styleModule.of(buildTheme("." + baseThemeID, e, lightDarkIDs)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var r;
    let R = e.querySelector(".cm-content"), B = R && ContentView.get(R) || ContentView.get(e);
    return ((r = B == null ? void 0 : B.rootView) === null || r === void 0 ? void 0 : r.view) || null;
  }
}
EditorView.styleModule = styleModule;
EditorView.inputHandler = inputHandler$1;
EditorView.clipboardInputFilter = clipboardInputFilter;
EditorView.clipboardOutputFilter = clipboardOutputFilter;
EditorView.scrollHandler = scrollHandler;
EditorView.focusChangeEffect = focusChangeEffect;
EditorView.perLineTextDirection = perLineTextDirection;
EditorView.exceptionSink = exceptionSink;
EditorView.updateListener = updateListener;
EditorView.editable = editable;
EditorView.mouseSelectionStyle = mouseSelectionStyle;
EditorView.dragMovesSelection = dragMovesSelection$1;
EditorView.clickAddsSelectionRange = clickAddsSelectionRange;
EditorView.decorations = decorations;
EditorView.outerDecorations = outerDecorations;
EditorView.atomicRanges = atomicRanges;
EditorView.bidiIsolatedRanges = bidiIsolatedRanges;
EditorView.scrollMargins = scrollMargins;
EditorView.darkTheme = darkTheme;
EditorView.cspNonce = /* @__PURE__ */ Facet.define({ combine: (s) => s.length ? s[0] : "" });
EditorView.contentAttributes = contentAttributes;
EditorView.editorAttributes = editorAttributes;
EditorView.lineWrapping = /* @__PURE__ */ EditorView.contentAttributes.of({ class: "cm-lineWrapping" });
EditorView.announce = /* @__PURE__ */ StateEffect.define();
const MaxBidiLine = 4096, BadMeasure = {};
class CachedOrder {
  constructor(e, r, R, B, _, $) {
    this.from = e, this.to = r, this.dir = R, this.isolates = B, this.fresh = _, this.order = $;
  }
  static update(e, r) {
    if (r.empty && !e.some((_) => _.fresh))
      return e;
    let R = [], B = e.length ? e[e.length - 1].dir : Direction.LTR;
    for (let _ = Math.max(0, e.length - 10); _ < e.length; _++) {
      let $ = e[_];
      $.dir == B && !r.touchesRange($.from, $.to) && R.push(new CachedOrder(r.mapPos($.from, 1), r.mapPos($.to, -1), $.dir, $.isolates, !1, $.order));
    }
    return R;
  }
}
function attrsFromFacet(s, e, r) {
  for (let R = s.state.facet(e), B = R.length - 1; B >= 0; B--) {
    let _ = R[B], $ = typeof _ == "function" ? _(s) : _;
    $ && combineAttrs($, r);
  }
  return r;
}
const currentPlatform = browser.mac ? "mac" : browser.windows ? "win" : browser.linux ? "linux" : "key";
function normalizeKeyName(s, e) {
  const r = s.split(/-(?!$)/);
  let R = r[r.length - 1];
  R == "Space" && (R = " ");
  let B, _, $, F;
  for (let V = 0; V < r.length - 1; ++V) {
    const H = r[V];
    if (/^(cmd|meta|m)$/i.test(H))
      F = !0;
    else if (/^a(lt)?$/i.test(H))
      B = !0;
    else if (/^(c|ctrl|control)$/i.test(H))
      _ = !0;
    else if (/^s(hift)?$/i.test(H))
      $ = !0;
    else if (/^mod$/i.test(H))
      e == "mac" ? F = !0 : _ = !0;
    else
      throw new Error("Unrecognized modifier name: " + H);
  }
  return B && (R = "Alt-" + R), _ && (R = "Ctrl-" + R), F && (R = "Meta-" + R), $ && (R = "Shift-" + R), R;
}
function modifiers(s, e, r) {
  return e.altKey && (s = "Alt-" + s), e.ctrlKey && (s = "Ctrl-" + s), e.metaKey && (s = "Meta-" + s), r !== !1 && e.shiftKey && (s = "Shift-" + s), s;
}
const handleKeyEvents = /* @__PURE__ */ Prec.default(/* @__PURE__ */ EditorView.domEventHandlers({
  keydown(s, e) {
    return runHandlers(getKeymap(e.state), s, e, "editor");
  }
})), keymap = /* @__PURE__ */ Facet.define({ enables: handleKeyEvents }), Keymaps = /* @__PURE__ */ new WeakMap();
function getKeymap(s) {
  let e = s.facet(keymap), r = Keymaps.get(e);
  return r || Keymaps.set(e, r = buildKeymap(e.reduce((R, B) => R.concat(B), []))), r;
}
function runScopeHandlers(s, e, r) {
  return runHandlers(getKeymap(s.state), e, s, r);
}
let storedPrefix = null;
const PrefixTimeout = 4e3;
function buildKeymap(s, e = currentPlatform) {
  let r = /* @__PURE__ */ Object.create(null), R = /* @__PURE__ */ Object.create(null), B = ($, F) => {
    let V = R[$];
    if (V == null)
      R[$] = F;
    else if (V != F)
      throw new Error("Key binding " + $ + " is used both as a regular binding and as a multi-stroke prefix");
  }, _ = ($, F, V, H, W) => {
    var U, z;
    let K = r[$] || (r[$] = /* @__PURE__ */ Object.create(null)), X = F.split(/ (?!$)/).map((te) => normalizeKeyName(te, e));
    for (let te = 1; te < X.length; te++) {
      let ue = X.slice(0, te).join(" ");
      B(ue, !0), K[ue] || (K[ue] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(fe) => {
          let de = storedPrefix = { view: fe, prefix: ue, scope: $ };
          return setTimeout(() => {
            storedPrefix == de && (storedPrefix = null);
          }, PrefixTimeout), !0;
        }]
      });
    }
    let Z = X.join(" ");
    B(Z, !1);
    let Y = K[Z] || (K[Z] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((z = (U = K._any) === null || U === void 0 ? void 0 : U.run) === null || z === void 0 ? void 0 : z.slice()) || []
    });
    V && Y.run.push(V), H && (Y.preventDefault = !0), W && (Y.stopPropagation = !0);
  };
  for (let $ of s) {
    let F = $.scope ? $.scope.split(" ") : ["editor"];
    if ($.any)
      for (let H of F) {
        let W = r[H] || (r[H] = /* @__PURE__ */ Object.create(null));
        W._any || (W._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: U } = $;
        for (let z in W)
          W[z].run.push((K) => U(K, currentKeyEvent));
      }
    let V = $[e] || $.key;
    if (V)
      for (let H of F)
        _(H, V, $.run, $.preventDefault, $.stopPropagation), $.shift && _(H, "Shift-" + V, $.shift, $.preventDefault, $.stopPropagation);
  }
  return r;
}
let currentKeyEvent = null;
function runHandlers(s, e, r, R) {
  currentKeyEvent = e;
  let B = keyName(e), _ = codePointAt(B, 0), $ = codePointSize(_) == B.length && B != " ", F = "", V = !1, H = !1, W = !1;
  storedPrefix && storedPrefix.view == r && storedPrefix.scope == R && (F = storedPrefix.prefix + " ", modifierCodes.indexOf(e.keyCode) < 0 && (H = !0, storedPrefix = null));
  let U = /* @__PURE__ */ new Set(), z = (Y) => {
    if (Y) {
      for (let te of Y.run)
        if (!U.has(te) && (U.add(te), te(r)))
          return Y.stopPropagation && (W = !0), !0;
      Y.preventDefault && (Y.stopPropagation && (W = !0), H = !0);
    }
    return !1;
  }, K = s[R], X, Z;
  return K && (z(K[F + modifiers(B, e, !$)]) ? V = !0 : $ && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(browser.windows && e.ctrlKey && e.altKey) && (X = base[e.keyCode]) && X != B ? (z(K[F + modifiers(X, e, !0)]) || e.shiftKey && (Z = shift[e.keyCode]) != B && Z != X && z(K[F + modifiers(Z, e, !1)])) && (V = !0) : $ && e.shiftKey && z(K[F + modifiers(B, e, !0)]) && (V = !0), !V && z(K._any) && (V = !0)), H && (V = !0), V && W && e.stopPropagation(), currentKeyEvent = null, V;
}
class RectangleMarker {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, r, R, B, _) {
    this.className = e, this.left = r, this.top = R, this.width = B, this.height = _;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, r) {
    return r.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, r, R) {
    if (R.empty) {
      let B = e.coordsAtPos(R.head, R.assoc || 1);
      if (!B)
        return [];
      let _ = getBase(e);
      return [new RectangleMarker(r, B.left - _.left, B.top - _.top, null, B.bottom - B.top)];
    } else
      return rectanglesForRange(e, r, R);
  }
}
function getBase(s) {
  let e = s.scrollDOM.getBoundingClientRect();
  return { left: (s.textDirection == Direction.LTR ? e.left : e.right - s.scrollDOM.clientWidth * s.scaleX) - s.scrollDOM.scrollLeft * s.scaleX, top: e.top - s.scrollDOM.scrollTop * s.scaleY };
}
function wrappedLine(s, e, r, R) {
  let B = s.coordsAtPos(e, r * 2);
  if (!B)
    return R;
  let _ = s.dom.getBoundingClientRect(), $ = (B.top + B.bottom) / 2, F = s.posAtCoords({ x: _.left + 1, y: $ }), V = s.posAtCoords({ x: _.right - 1, y: $ });
  return F == null || V == null ? R : { from: Math.max(R.from, Math.min(F, V)), to: Math.min(R.to, Math.max(F, V)) };
}
function rectanglesForRange(s, e, r) {
  if (r.to <= s.viewport.from || r.from >= s.viewport.to)
    return [];
  let R = Math.max(r.from, s.viewport.from), B = Math.min(r.to, s.viewport.to), _ = s.textDirection == Direction.LTR, $ = s.contentDOM, F = $.getBoundingClientRect(), V = getBase(s), H = $.querySelector(".cm-line"), W = H && window.getComputedStyle(H), U = F.left + (W ? parseInt(W.paddingLeft) + Math.min(0, parseInt(W.textIndent)) : 0), z = F.right - (W ? parseInt(W.paddingRight) : 0), K = blockAt(s, R), X = blockAt(s, B), Z = K.type == BlockType.Text ? K : null, Y = X.type == BlockType.Text ? X : null;
  if (Z && (s.lineWrapping || K.widgetLineBreaks) && (Z = wrappedLine(s, R, 1, Z)), Y && (s.lineWrapping || X.widgetLineBreaks) && (Y = wrappedLine(s, B, -1, Y)), Z && Y && Z.from == Y.from && Z.to == Y.to)
    return ue(fe(r.from, r.to, Z));
  {
    let re = Z ? fe(r.from, null, Z) : de(K, !1), ae = Y ? fe(null, r.to, Y) : de(X, !0), le = [];
    return (Z || K).to < (Y || X).from - (Z && Y ? 1 : 0) || K.widgetLineBreaks > 1 && re.bottom + s.defaultLineHeight / 2 < ae.top ? le.push(te(U, re.bottom, z, ae.top)) : re.bottom < ae.top && s.elementAtHeight((re.bottom + ae.top) / 2).type == BlockType.Text && (re.bottom = ae.top = (re.bottom + ae.top) / 2), ue(re).concat(le).concat(ue(ae));
  }
  function te(re, ae, le, me) {
    return new RectangleMarker(e, re - V.left, ae - V.top, le - re, me - ae);
  }
  function ue({ top: re, bottom: ae, horizontal: le }) {
    let me = [];
    for (let Se = 0; Se < le.length; Se += 2)
      me.push(te(le[Se], re, le[Se + 1], ae));
    return me;
  }
  function fe(re, ae, le) {
    let me = 1e9, Se = -1e9, ke = [];
    function ce(be, xe, Q, q, j) {
      let G = s.coordsAtPos(be, be == le.to ? -2 : 2), J = s.coordsAtPos(Q, Q == le.from ? 2 : -2);
      !G || !J || (me = Math.min(G.top, J.top, me), Se = Math.max(G.bottom, J.bottom, Se), j == Direction.LTR ? ke.push(_ && xe ? U : G.left, _ && q ? z : J.right) : ke.push(!_ && q ? U : J.left, !_ && xe ? z : G.right));
    }
    let ge = re ?? le.from, Ce = ae ?? le.to;
    for (let be of s.visibleRanges)
      if (be.to > ge && be.from < Ce)
        for (let xe = Math.max(be.from, ge), Q = Math.min(be.to, Ce); ; ) {
          let q = s.state.doc.lineAt(xe);
          for (let j of s.bidiSpans(q)) {
            let G = j.from + q.from, J = j.to + q.from;
            if (G >= Q)
              break;
            J > xe && ce(Math.max(G, xe), re == null && G <= ge, Math.min(J, Q), ae == null && J >= Ce, j.dir);
          }
          if (xe = q.to + 1, xe >= Q)
            break;
        }
    return ke.length == 0 && ce(ge, re == null, Ce, ae == null, s.textDirection), { top: me, bottom: Se, horizontal: ke };
  }
  function de(re, ae) {
    let le = F.top + (ae ? re.top : re.bottom);
    return { top: le, bottom: le, horizontal: [] };
  }
}
function sameMarker(s, e) {
  return s.constructor == e.constructor && s.eq(e);
}
class LayerView {
  constructor(e, r) {
    this.view = e, this.layer = r, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), r.above && this.dom.classList.add("cm-layer-above"), r.class && this.dom.classList.add(r.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), r.mount && r.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(layerOrder) != e.state.facet(layerOrder) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(e) {
    this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
  }
  setOrder(e) {
    let r = 0, R = e.facet(layerOrder);
    for (; r < R.length && R[r] != this.layer; )
      r++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - r);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: r } = this.view;
    (e != this.scaleX || r != this.scaleY) && (this.scaleX = e, this.scaleY = r, this.dom.style.transform = `scale(${1 / e}, ${1 / r})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((r, R) => !sameMarker(r, this.drawn[R]))) {
      let r = this.dom.firstChild, R = 0;
      for (let B of e)
        B.update && r && B.constructor && this.drawn[R].constructor && B.update(r, this.drawn[R]) ? (r = r.nextSibling, R++) : this.dom.insertBefore(B.draw(), r);
      for (; r; ) {
        let B = r.nextSibling;
        r.remove(), r = B;
      }
      this.drawn = e;
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const layerOrder = /* @__PURE__ */ Facet.define();
function layer(s) {
  return [
    ViewPlugin.define((e) => new LayerView(e, s)),
    layerOrder.of(s)
  ];
}
const CanHidePrimary = !(browser.ios && browser.webkit && browser.webkit_version < 534), selectionConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0
    }, {
      cursorBlinkRate: (e, r) => Math.min(e, r),
      drawRangeCursor: (e, r) => e || r
    });
  }
});
function drawSelection(s = {}) {
  return [
    selectionConfig.of(s),
    cursorLayer,
    selectionLayer,
    hideNativeSelection,
    nativeSelectionHidden.of(!0)
  ];
}
function configChanged(s) {
  return s.startState.facet(selectionConfig) != s.state.facet(selectionConfig);
}
const cursorLayer = /* @__PURE__ */ layer({
  above: !0,
  markers(s) {
    let { state: e } = s, r = e.facet(selectionConfig), R = [];
    for (let B of e.selection.ranges) {
      let _ = B == e.selection.main;
      if (B.empty ? !_ || CanHidePrimary : r.drawRangeCursor) {
        let $ = _ ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", F = B.empty ? B : EditorSelection.cursor(B.head, B.head > B.anchor ? -1 : 1);
        for (let V of RectangleMarker.forRange(s, $, F))
          R.push(V);
      }
    }
    return R;
  },
  update(s, e) {
    s.transactions.some((R) => R.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let r = configChanged(s);
    return r && setBlinkRate(s.state, e), s.docChanged || s.selectionSet || r;
  },
  mount(s, e) {
    setBlinkRate(e.state, s);
  },
  class: "cm-cursorLayer"
});
function setBlinkRate(s, e) {
  e.style.animationDuration = s.facet(selectionConfig).cursorBlinkRate + "ms";
}
const selectionLayer = /* @__PURE__ */ layer({
  above: !1,
  markers(s) {
    return s.state.selection.ranges.map((e) => e.empty ? [] : RectangleMarker.forRange(s, "cm-selectionBackground", e)).reduce((e, r) => e.concat(r));
  },
  update(s, e) {
    return s.docChanged || s.selectionSet || s.viewportChanged || configChanged(s);
  },
  class: "cm-selectionLayer"
}), themeSpec = {
  ".cm-line": {
    "& ::selection, &::selection": { backgroundColor: "transparent !important" }
  },
  ".cm-content": {
    "& :focus": {
      caretColor: "initial !important",
      "&::selection, & ::selection": {
        backgroundColor: "Highlight !important"
      }
    }
  }
};
CanHidePrimary && (themeSpec[".cm-line"].caretColor = themeSpec[".cm-content"].caretColor = "transparent !important");
const hideNativeSelection = /* @__PURE__ */ Prec.highest(/* @__PURE__ */ EditorView.theme(themeSpec)), setDropCursorPos = /* @__PURE__ */ StateEffect.define({
  map(s, e) {
    return s == null ? null : e.mapPos(s);
  }
}), dropCursorPos = /* @__PURE__ */ StateField.define({
  create() {
    return null;
  },
  update(s, e) {
    return s != null && (s = e.changes.mapPos(s)), e.effects.reduce((r, R) => R.is(setDropCursorPos) ? R.value : r, s);
  }
}), drawDropCursor = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.view = s, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(s) {
    var e;
    let r = s.state.field(dropCursorPos);
    r == null ? this.cursor != null && ((e = this.cursor) === null || e === void 0 || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (s.startState.field(dropCursorPos) != r || s.docChanged || s.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: s } = this, e = s.state.field(dropCursorPos), r = e != null && s.coordsAtPos(e);
    if (!r)
      return null;
    let R = s.scrollDOM.getBoundingClientRect();
    return {
      left: r.left - R.left + s.scrollDOM.scrollLeft * s.scaleX,
      top: r.top - R.top + s.scrollDOM.scrollTop * s.scaleY,
      height: r.bottom - r.top
    };
  }
  drawCursor(s) {
    if (this.cursor) {
      let { scaleX: e, scaleY: r } = this.view;
      s ? (this.cursor.style.left = s.left / e + "px", this.cursor.style.top = s.top / r + "px", this.cursor.style.height = s.height / r + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(s) {
    this.view.state.field(dropCursorPos) != s && this.view.dispatch({ effects: setDropCursorPos.of(s) });
  }
}, {
  eventObservers: {
    dragover(s) {
      this.setDropPos(this.view.posAtCoords({ x: s.clientX, y: s.clientY }));
    },
    dragleave(s) {
      (s.target == this.view.contentDOM || !this.view.contentDOM.contains(s.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function dropCursor() {
  return [dropCursorPos, drawDropCursor];
}
function iterMatches(s, e, r, R, B) {
  e.lastIndex = 0;
  for (let _ = s.iterRange(r, R), $ = r, F; !_.next().done; $ += _.value.length)
    if (!_.lineBreak)
      for (; F = e.exec(_.value); )
        B($ + F.index, F);
}
function matchRanges(s, e) {
  let r = s.visibleRanges;
  if (r.length == 1 && r[0].from == s.viewport.from && r[0].to == s.viewport.to)
    return r;
  let R = [];
  for (let { from: B, to: _ } of r)
    B = Math.max(s.state.doc.lineAt(B).from, B - e), _ = Math.min(s.state.doc.lineAt(_).to, _ + e), R.length && R[R.length - 1].to >= B ? R[R.length - 1].to = _ : R.push({ from: B, to: _ });
  return R;
}
class MatchDecorator {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: r, decoration: R, decorate: B, boundary: _, maxLength: $ = 1e3 } = e;
    if (!r.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = r, B)
      this.addMatch = (F, V, H, W) => B(W, H, H + F[0].length, F, V);
    else if (typeof R == "function")
      this.addMatch = (F, V, H, W) => {
        let U = R(F, V, H);
        U && W(H, H + F[0].length, U);
      };
    else if (R)
      this.addMatch = (F, V, H, W) => W(H, H + F[0].length, R);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = _, this.maxLength = $;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let r = new RangeSetBuilder(), R = r.add.bind(r);
    for (let { from: B, to: _ } of matchRanges(e, this.maxLength))
      iterMatches(e.state.doc, this.regexp, B, _, ($, F) => this.addMatch(F, e, $, R));
    return r.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, r) {
    let R = 1e9, B = -1;
    return e.docChanged && e.changes.iterChanges((_, $, F, V) => {
      V >= e.view.viewport.from && F <= e.view.viewport.to && (R = Math.min(F, R), B = Math.max(V, B));
    }), e.viewportMoved || B - R > 1e3 ? this.createDeco(e.view) : B > -1 ? this.updateRange(e.view, r.map(e.changes), R, B) : r;
  }
  updateRange(e, r, R, B) {
    for (let _ of e.visibleRanges) {
      let $ = Math.max(_.from, R), F = Math.min(_.to, B);
      if (F > $) {
        let V = e.state.doc.lineAt($), H = V.to < F ? e.state.doc.lineAt(F) : V, W = Math.max(_.from, V.from), U = Math.min(_.to, H.to);
        if (this.boundary) {
          for (; $ > V.from; $--)
            if (this.boundary.test(V.text[$ - 1 - V.from])) {
              W = $;
              break;
            }
          for (; F < H.to; F++)
            if (this.boundary.test(H.text[F - H.from])) {
              U = F;
              break;
            }
        }
        let z = [], K, X = (Z, Y, te) => z.push(te.range(Z, Y));
        if (V == H)
          for (this.regexp.lastIndex = W - V.from; (K = this.regexp.exec(V.text)) && K.index < U - V.from; )
            this.addMatch(K, e, K.index + V.from, X);
        else
          iterMatches(e.state.doc, this.regexp, W, U, (Z, Y) => this.addMatch(Y, e, Z, X));
        r = r.update({ filterFrom: W, filterTo: U, filter: (Z, Y) => Z < W || Y > U, add: z });
      }
    }
    return r;
  }
}
const UnicodeRegexpSupport = /x/.unicode != null ? "gu" : "g", Specials = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, UnicodeRegexpSupport), Names = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let _supportsTabSize = null;
function supportsTabSize() {
  var s;
  if (_supportsTabSize == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    _supportsTabSize = ((s = e.tabSize) !== null && s !== void 0 ? s : e.MozTabSize) != null;
  }
  return _supportsTabSize || !1;
}
const specialCharConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    let e = combineConfig(s, {
      render: null,
      specialChars: Specials,
      addSpecialChars: null
    });
    return (e.replaceTabs = !supportsTabSize()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, UnicodeRegexpSupport)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, UnicodeRegexpSupport)), e;
  }
});
function highlightSpecialChars(s = {}) {
  return [specialCharConfig.of(s), specialCharPlugin()];
}
let _plugin = null;
function specialCharPlugin() {
  return _plugin || (_plugin = ViewPlugin.fromClass(class {
    constructor(s) {
      this.view = s, this.decorations = Decoration.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(s.state.facet(specialCharConfig)), this.decorations = this.decorator.createDeco(s);
    }
    makeDecorator(s) {
      return new MatchDecorator({
        regexp: s.specialChars,
        decoration: (e, r, R) => {
          let { doc: B } = r.state, _ = codePointAt(e[0], 0);
          if (_ == 9) {
            let $ = B.lineAt(R), F = r.state.tabSize, V = countColumn($.text, F, R - $.from);
            return Decoration.replace({
              widget: new TabWidget((F - V % F) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[_] || (this.decorationCache[_] = Decoration.replace({ widget: new SpecialCharWidget(s, _) }));
        },
        boundary: s.replaceTabs ? void 0 : /[^]/
      });
    }
    update(s) {
      let e = s.state.facet(specialCharConfig);
      s.startState.facet(specialCharConfig) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(s.view)) : this.decorations = this.decorator.updateDeco(s, this.decorations);
    }
  }, {
    decorations: (s) => s.decorations
  }));
}
const DefaultPlaceholder = "•";
function placeholder$1(s) {
  return s >= 32 ? DefaultPlaceholder : s == 10 ? "␤" : String.fromCharCode(9216 + s);
}
class SpecialCharWidget extends WidgetType {
  constructor(e, r) {
    super(), this.options = e, this.code = r;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let r = placeholder$1(this.code), R = e.state.phrase("Control character") + " " + (Names[this.code] || "0x" + this.code.toString(16)), B = this.options.render && this.options.render(this.code, R, r);
    if (B)
      return B;
    let _ = document.createElement("span");
    return _.textContent = r, _.title = R, _.setAttribute("aria-label", R), _.className = "cm-specialChar", _;
  }
  ignoreEvent() {
    return !1;
  }
}
class TabWidget extends WidgetType {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
function highlightActiveLine() {
  return activeLineHighlighter;
}
const lineDeco = /* @__PURE__ */ Decoration.line({ class: "cm-activeLine" }), activeLineHighlighter = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.decorations = this.getDeco(s);
  }
  update(s) {
    (s.docChanged || s.selectionSet) && (this.decorations = this.getDeco(s.view));
  }
  getDeco(s) {
    let e = -1, r = [];
    for (let R of s.state.selection.ranges) {
      let B = s.lineBlockAt(R.head);
      B.from > e && (r.push(lineDeco.range(B.from)), e = B.from);
    }
    return Decoration.set(r);
  }
}, {
  decorations: (s) => s.decorations
}), MaxOff = 2e3;
function rectangleFor(s, e, r) {
  let R = Math.min(e.line, r.line), B = Math.max(e.line, r.line), _ = [];
  if (e.off > MaxOff || r.off > MaxOff || e.col < 0 || r.col < 0) {
    let $ = Math.min(e.off, r.off), F = Math.max(e.off, r.off);
    for (let V = R; V <= B; V++) {
      let H = s.doc.line(V);
      H.length <= F && _.push(EditorSelection.range(H.from + $, H.to + F));
    }
  } else {
    let $ = Math.min(e.col, r.col), F = Math.max(e.col, r.col);
    for (let V = R; V <= B; V++) {
      let H = s.doc.line(V), W = findColumn(H.text, $, s.tabSize, !0);
      if (W < 0)
        _.push(EditorSelection.cursor(H.to));
      else {
        let U = findColumn(H.text, F, s.tabSize);
        _.push(EditorSelection.range(H.from + W, H.from + U));
      }
    }
  }
  return _;
}
function absoluteColumn(s, e) {
  let r = s.coordsAtPos(s.viewport.from);
  return r ? Math.round(Math.abs((r.left - e) / s.defaultCharacterWidth)) : -1;
}
function getPos(s, e) {
  let r = s.posAtCoords({ x: e.clientX, y: e.clientY }, !1), R = s.state.doc.lineAt(r), B = r - R.from, _ = B > MaxOff ? -1 : B == R.length ? absoluteColumn(s, e.clientX) : countColumn(R.text, s.state.tabSize, r - R.from);
  return { line: R.number, col: _, off: B };
}
function rectangleSelectionStyle(s, e) {
  let r = getPos(s, e), R = s.state.selection;
  return r ? {
    update(B) {
      if (B.docChanged) {
        let _ = B.changes.mapPos(B.startState.doc.line(r.line).from), $ = B.state.doc.lineAt(_);
        r = { line: $.number, col: r.col, off: Math.min(r.off, $.length) }, R = R.map(B.changes);
      }
    },
    get(B, _, $) {
      let F = getPos(s, B);
      if (!F)
        return R;
      let V = rectangleFor(s.state, r, F);
      return V.length ? $ ? EditorSelection.create(V.concat(R.ranges)) : EditorSelection.create(V) : R;
    }
  } : null;
}
function rectangularSelection(s) {
  let e = (r) => r.altKey && r.button == 0;
  return EditorView.mouseSelectionStyle.of((r, R) => e(R) ? rectangleSelectionStyle(r, R) : null);
}
const keys = {
  Alt: [18, (s) => !!s.altKey],
  Control: [17, (s) => !!s.ctrlKey],
  Shift: [16, (s) => !!s.shiftKey],
  Meta: [91, (s) => !!s.metaKey]
}, showCrosshair = { style: "cursor: crosshair" };
function crosshairCursor(s = {}) {
  let [e, r] = keys[s.key || "Alt"], R = ViewPlugin.fromClass(class {
    constructor(B) {
      this.view = B, this.isDown = !1;
    }
    set(B) {
      this.isDown != B && (this.isDown = B, this.view.update([]));
    }
  }, {
    eventObservers: {
      keydown(B) {
        this.set(B.keyCode == e || r(B));
      },
      keyup(B) {
        (B.keyCode == e || !r(B)) && this.set(!1);
      },
      mousemove(B) {
        this.set(r(B));
      }
    }
  });
  return [
    R,
    EditorView.contentAttributes.of((B) => {
      var _;
      return !((_ = B.plugin(R)) === null || _ === void 0) && _.isDown ? showCrosshair : null;
    })
  ];
}
const Outside = "-10000px";
class TooltipViewManager {
  constructor(e, r, R, B) {
    this.facet = r, this.createTooltipView = R, this.removeTooltipView = B, this.input = e.state.facet(r), this.tooltips = this.input.filter(($) => $);
    let _ = null;
    this.tooltipViews = this.tooltips.map(($) => _ = R($, _));
  }
  update(e, r) {
    var R;
    let B = e.state.facet(this.facet), _ = B.filter((V) => V);
    if (B === this.input) {
      for (let V of this.tooltipViews)
        V.update && V.update(e);
      return !1;
    }
    let $ = [], F = r ? [] : null;
    for (let V = 0; V < _.length; V++) {
      let H = _[V], W = -1;
      if (H) {
        for (let U = 0; U < this.tooltips.length; U++) {
          let z = this.tooltips[U];
          z && z.create == H.create && (W = U);
        }
        if (W < 0)
          $[V] = this.createTooltipView(H, V ? $[V - 1] : null), F && (F[V] = !!H.above);
        else {
          let U = $[V] = this.tooltipViews[W];
          F && (F[V] = r[W]), U.update && U.update(e);
        }
      }
    }
    for (let V of this.tooltipViews)
      $.indexOf(V) < 0 && (this.removeTooltipView(V), (R = V.destroy) === null || R === void 0 || R.call(V));
    return r && (F.forEach((V, H) => r[H] = V), r.length = F.length), this.input = B, this.tooltips = _, this.tooltipViews = $, !0;
  }
}
function windowSpace(s) {
  let { win: e } = s;
  return { top: 0, left: 0, bottom: e.innerHeight, right: e.innerWidth };
}
const tooltipConfig = /* @__PURE__ */ Facet.define({
  combine: (s) => {
    var e, r, R;
    return {
      position: browser.ios ? "absolute" : ((e = s.find((B) => B.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((r = s.find((B) => B.parent)) === null || r === void 0 ? void 0 : r.parent) || null,
      tooltipSpace: ((R = s.find((B) => B.tooltipSpace)) === null || R === void 0 ? void 0 : R.tooltipSpace) || windowSpace
    };
  }
}), knownHeight = /* @__PURE__ */ new WeakMap(), tooltipPlugin = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.view = s, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = s.state.facet(tooltipConfig);
    this.position = e.position, this.parent = e.parent, this.classes = s.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new TooltipViewManager(s, showTooltip, (r, R) => this.createTooltip(r, R), (r) => {
      this.resizeObserver && this.resizeObserver.unobserve(r.dom), r.dom.remove();
    }), this.above = this.manager.tooltips.map((r) => !!r.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((r) => {
      Date.now() > this.lastTransaction - 50 && r.length > 0 && r[r.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), s.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let s of this.manager.tooltipViews)
        this.intersectionObserver.observe(s.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(s) {
    s.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(s, this.above);
    e && this.observeIntersection();
    let r = e || s.geometryChanged, R = s.state.facet(tooltipConfig);
    if (R.position != this.position && !this.madeAbsolute) {
      this.position = R.position;
      for (let B of this.manager.tooltipViews)
        B.dom.style.position = this.position;
      r = !0;
    }
    if (R.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = R.parent, this.createContainer();
      for (let B of this.manager.tooltipViews)
        this.container.appendChild(B.dom);
      r = !0;
    } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    r && this.maybeMeasure();
  }
  createTooltip(s, e) {
    let r = s.create(this.view), R = e ? e.dom : null;
    if (r.dom.classList.add("cm-tooltip"), s.arrow && !r.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let B = document.createElement("div");
      B.className = "cm-tooltip-arrow", r.dom.appendChild(B);
    }
    return r.dom.style.position = this.position, r.dom.style.top = Outside, r.dom.style.left = "0px", this.container.insertBefore(r.dom, R), r.mount && r.mount(this.view), this.resizeObserver && this.resizeObserver.observe(r.dom), r;
  }
  destroy() {
    var s, e, r;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let R of this.manager.tooltipViews)
      R.dom.remove(), (s = R.destroy) === null || s === void 0 || s.call(R);
    this.parent && this.container.remove(), (e = this.resizeObserver) === null || e === void 0 || e.disconnect(), (r = this.intersectionObserver) === null || r === void 0 || r.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let s = 1, e = 1, r = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: _ } = this.manager.tooltipViews[0];
      if (browser.gecko)
        r = _.offsetParent != this.container.ownerDocument.body;
      else if (_.style.top == Outside && _.style.left == "0px") {
        let $ = _.getBoundingClientRect();
        r = Math.abs($.top + 1e4) > 1 || Math.abs($.left) > 1;
      }
    }
    if (r || this.position == "absolute")
      if (this.parent) {
        let _ = this.parent.getBoundingClientRect();
        _.width && _.height && (s = _.width / this.parent.offsetWidth, e = _.height / this.parent.offsetHeight);
      } else
        ({ scaleX: s, scaleY: e } = this.view.viewState);
    let R = this.view.scrollDOM.getBoundingClientRect(), B = getScrollMargins(this.view);
    return {
      visible: {
        left: R.left + B.left,
        top: R.top + B.top,
        right: R.right - B.right,
        bottom: R.bottom - B.bottom
      },
      parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
      pos: this.manager.tooltips.map((_, $) => {
        let F = this.manager.tooltipViews[$];
        return F.getCoords ? F.getCoords(_.pos) : this.view.coordsAtPos(_.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: _ }) => _.getBoundingClientRect()),
      space: this.view.state.facet(tooltipConfig).tooltipSpace(this.view),
      scaleX: s,
      scaleY: e,
      makeAbsolute: r
    };
  }
  writeMeasure(s) {
    var e;
    if (s.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let F of this.manager.tooltipViews)
        F.dom.style.position = "absolute";
    }
    let { visible: r, space: R, scaleX: B, scaleY: _ } = s, $ = [];
    for (let F = 0; F < this.manager.tooltips.length; F++) {
      let V = this.manager.tooltips[F], H = this.manager.tooltipViews[F], { dom: W } = H, U = s.pos[F], z = s.size[F];
      if (!U || V.clip !== !1 && (U.bottom <= Math.max(r.top, R.top) || U.top >= Math.min(r.bottom, R.bottom) || U.right < Math.max(r.left, R.left) - 0.1 || U.left > Math.min(r.right, R.right) + 0.1)) {
        W.style.top = Outside;
        continue;
      }
      let K = V.arrow ? H.dom.querySelector(".cm-tooltip-arrow") : null, X = K ? 7 : 0, Z = z.right - z.left, Y = (e = knownHeight.get(H)) !== null && e !== void 0 ? e : z.bottom - z.top, te = H.offset || noOffset, ue = this.view.textDirection == Direction.LTR, fe = z.width > R.right - R.left ? ue ? R.left : R.right - z.width : ue ? Math.max(R.left, Math.min(U.left - (K ? 14 : 0) + te.x, R.right - Z)) : Math.min(Math.max(R.left, U.left - Z + (K ? 14 : 0) - te.x), R.right - Z), de = this.above[F];
      !V.strictSide && (de ? U.top - Y - X - te.y < R.top : U.bottom + Y + X + te.y > R.bottom) && de == R.bottom - U.bottom > U.top - R.top && (de = this.above[F] = !de);
      let re = (de ? U.top - R.top : R.bottom - U.bottom) - X;
      if (re < Y && H.resize !== !1) {
        if (re < this.view.defaultLineHeight) {
          W.style.top = Outside;
          continue;
        }
        knownHeight.set(H, Y), W.style.height = (Y = re) / _ + "px";
      } else W.style.height && (W.style.height = "");
      let ae = de ? U.top - Y - X - te.y : U.bottom + X + te.y, le = fe + Z;
      if (H.overlap !== !0)
        for (let me of $)
          me.left < le && me.right > fe && me.top < ae + Y && me.bottom > ae && (ae = de ? me.top - Y - 2 - X : me.bottom + X + 2);
      if (this.position == "absolute" ? (W.style.top = (ae - s.parent.top) / _ + "px", setLeftStyle(W, (fe - s.parent.left) / B)) : (W.style.top = ae / _ + "px", setLeftStyle(W, fe / B)), K) {
        let me = U.left + (ue ? te.x : -te.x) - (fe + 14 - 7);
        K.style.left = me / B + "px";
      }
      H.overlap !== !0 && $.push({ left: fe, top: ae, right: le, bottom: ae + Y }), W.classList.toggle("cm-tooltip-above", de), W.classList.toggle("cm-tooltip-below", !de), H.positioned && H.positioned(s.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let s of this.manager.tooltipViews)
        s.dom.style.top = Outside;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
});
function setLeftStyle(s, e) {
  let r = parseInt(s.style.left, 10);
  (isNaN(r) || Math.abs(e - r) > 1) && (s.style.left = e + "px");
}
const baseTheme$4 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-tooltip": {
    zIndex: 500,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: `${7 * 2}px`,
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), noOffset = { x: 0, y: 0 }, showTooltip = /* @__PURE__ */ Facet.define({
  enables: [tooltipPlugin, baseTheme$4]
}), showHoverTooltip = /* @__PURE__ */ Facet.define({
  combine: (s) => s.reduce((e, r) => e.concat(r), [])
});
class HoverTooltipHost {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new HoverTooltipHost(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new TooltipViewManager(e, showHoverTooltip, (r, R) => this.createHostedView(r, R), (r) => r.dom.remove());
  }
  createHostedView(e, r) {
    let R = e.create(this.view);
    return R.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(R.dom, r ? r.dom.nextSibling : this.dom.firstChild), this.mounted && R.mount && R.mount(this.view), R;
  }
  mount(e) {
    for (let r of this.manager.tooltipViews)
      r.mount && r.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let r of this.manager.tooltipViews)
      r.positioned && r.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let r of this.manager.tooltipViews)
      (e = r.destroy) === null || e === void 0 || e.call(r);
  }
  passProp(e) {
    let r;
    for (let R of this.manager.tooltipViews) {
      let B = R[e];
      if (B !== void 0) {
        if (r === void 0)
          r = B;
        else if (r !== B)
          return;
      }
    }
    return r;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const showHoverTooltipHost = /* @__PURE__ */ showTooltip.compute([showHoverTooltip], (s) => {
  let e = s.facet(showHoverTooltip);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((r) => r.pos)),
    end: Math.max(...e.map((r) => {
      var R;
      return (R = r.end) !== null && R !== void 0 ? R : r.pos;
    })),
    create: HoverTooltipHost.create,
    above: e[0].above,
    arrow: e.some((r) => r.arrow)
  };
});
class HoverPlugin {
  constructor(e, r, R, B, _) {
    this.view = e, this.source = r, this.field = R, this.setHover = B, this.hoverTime = _, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update() {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active.length)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: r } = this, R = e.docView.nearest(r.target);
    if (!R)
      return;
    let B, _ = 1;
    if (R instanceof WidgetView)
      B = R.posAtStart;
    else {
      if (B = e.posAtCoords(r), B == null)
        return;
      let F = e.coordsAtPos(B);
      if (!F || r.y < F.top || r.y > F.bottom || r.x < F.left - e.defaultCharacterWidth || r.x > F.right + e.defaultCharacterWidth)
        return;
      let V = e.bidiSpans(e.state.doc.lineAt(B)).find((W) => W.from <= B && W.to >= B), H = V && V.dir == Direction.RTL ? -1 : 1;
      _ = r.x < F.left ? -H : H;
    }
    let $ = this.source(e, B, _);
    if ($ != null && $.then) {
      let F = this.pending = { pos: B };
      $.then((V) => {
        this.pending == F && (this.pending = null, V && !(Array.isArray(V) && !V.length) && e.dispatch({ effects: this.setHover.of(Array.isArray(V) ? V : [V]) }));
      }, (V) => logException(e.state, V, "hover tooltip"));
    } else $ && !(Array.isArray($) && !$.length) && e.dispatch({ effects: this.setHover.of(Array.isArray($) ? $ : [$]) });
  }
  get tooltip() {
    let e = this.view.plugin(tooltipPlugin), r = e ? e.manager.tooltips.findIndex((R) => R.create == HoverTooltipHost.create) : -1;
    return r > -1 ? e.manager.tooltipViews[r] : null;
  }
  mousemove(e) {
    var r, R;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: B, tooltip: _ } = this;
    if (B.length && _ && !isInTooltip(_.dom, e) || this.pending) {
      let { pos: $ } = B[0] || this.pending, F = (R = (r = B[0]) === null || r === void 0 ? void 0 : r.end) !== null && R !== void 0 ? R : $;
      ($ == F ? this.view.posAtCoords(this.lastMove) != $ : !isOverRange(this.view, $, F, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: r } = this;
    if (r.length) {
      let { tooltip: R } = this;
      R && R.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(R.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
    }
  }
  watchTooltipLeave(e) {
    let r = (R) => {
      e.removeEventListener("mouseleave", r), this.active.length && !this.view.dom.contains(R.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
    };
    e.addEventListener("mouseleave", r);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const tooltipMargin = 4;
function isInTooltip(s, e) {
  let { left: r, right: R, top: B, bottom: _ } = s.getBoundingClientRect(), $;
  if ($ = s.querySelector(".cm-tooltip-arrow")) {
    let F = $.getBoundingClientRect();
    B = Math.min(F.top, B), _ = Math.max(F.bottom, _);
  }
  return e.clientX >= r - tooltipMargin && e.clientX <= R + tooltipMargin && e.clientY >= B - tooltipMargin && e.clientY <= _ + tooltipMargin;
}
function isOverRange(s, e, r, R, B, _) {
  let $ = s.scrollDOM.getBoundingClientRect(), F = s.documentTop + s.documentPadding.top + s.contentHeight;
  if ($.left > R || $.right < R || $.top > B || Math.min($.bottom, F) < B)
    return !1;
  let V = s.posAtCoords({ x: R, y: B }, !1);
  return V >= e && V <= r;
}
function hoverTooltip(s, e = {}) {
  let r = StateEffect.define(), R = StateField.define({
    create() {
      return [];
    },
    update(B, _) {
      if (B.length && (e.hideOnChange && (_.docChanged || _.selection) ? B = [] : e.hideOn && (B = B.filter(($) => !e.hideOn(_, $))), _.docChanged)) {
        let $ = [];
        for (let F of B) {
          let V = _.changes.mapPos(F.pos, -1, MapMode.TrackDel);
          if (V != null) {
            let H = Object.assign(/* @__PURE__ */ Object.create(null), F);
            H.pos = V, H.end != null && (H.end = _.changes.mapPos(H.end)), $.push(H);
          }
        }
        B = $;
      }
      for (let $ of _.effects)
        $.is(r) && (B = $.value), $.is(closeHoverTooltipEffect) && (B = []);
      return B;
    },
    provide: (B) => showHoverTooltip.from(B)
  });
  return {
    active: R,
    extension: [
      R,
      ViewPlugin.define((B) => new HoverPlugin(
        B,
        s,
        R,
        r,
        e.hoverTime || 300
        /* Hover.Time */
      )),
      showHoverTooltipHost
    ]
  };
}
function getTooltip(s, e) {
  let r = s.plugin(tooltipPlugin);
  if (!r)
    return null;
  let R = r.manager.tooltips.indexOf(e);
  return R < 0 ? null : r.manager.tooltipViews[R];
}
const closeHoverTooltipEffect = /* @__PURE__ */ StateEffect.define(), panelConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    let e, r;
    for (let R of s)
      e = e || R.topContainer, r = r || R.bottomContainer;
    return { topContainer: e, bottomContainer: r };
  }
});
function getPanel(s, e) {
  let r = s.plugin(panelPlugin), R = r ? r.specs.indexOf(e) : -1;
  return R > -1 ? r.panels[R] : null;
}
const panelPlugin = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.input = s.state.facet(showPanel), this.specs = this.input.filter((r) => r), this.panels = this.specs.map((r) => r(s));
    let e = s.state.facet(panelConfig);
    this.top = new PanelGroup(s, !0, e.topContainer), this.bottom = new PanelGroup(s, !1, e.bottomContainer), this.top.sync(this.panels.filter((r) => r.top)), this.bottom.sync(this.panels.filter((r) => !r.top));
    for (let r of this.panels)
      r.dom.classList.add("cm-panel"), r.mount && r.mount();
  }
  update(s) {
    let e = s.state.facet(panelConfig);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new PanelGroup(s.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new PanelGroup(s.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let r = s.state.facet(showPanel);
    if (r != this.input) {
      let R = r.filter((V) => V), B = [], _ = [], $ = [], F = [];
      for (let V of R) {
        let H = this.specs.indexOf(V), W;
        H < 0 ? (W = V(s.view), F.push(W)) : (W = this.panels[H], W.update && W.update(s)), B.push(W), (W.top ? _ : $).push(W);
      }
      this.specs = R, this.panels = B, this.top.sync(_), this.bottom.sync($);
      for (let V of F)
        V.dom.classList.add("cm-panel"), V.mount && V.mount();
    } else
      for (let R of this.panels)
        R.update && R.update(s);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (s) => EditorView.scrollMargins.of((e) => {
    let r = e.plugin(s);
    return r && { top: r.top.scrollMargin(), bottom: r.bottom.scrollMargin() };
  })
});
class PanelGroup {
  constructor(e, r, R) {
    this.view = e, this.top = r, this.container = R, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let r of this.panels)
      r.destroy && e.indexOf(r) < 0 && r.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let r = this.container || this.view.dom;
      r.insertBefore(this.dom, this.top ? r.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let r of this.panels)
      if (r.dom.parentNode == this.dom) {
        for (; e != r.dom; )
          e = rm(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(r.dom, e);
    for (; e; )
      e = rm(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function rm(s) {
  let e = s.nextSibling;
  return s.remove(), e;
}
const showPanel = /* @__PURE__ */ Facet.define({
  enables: panelPlugin
});
class GutterMarker extends RangeValue {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
GutterMarker.prototype.elementClass = "";
GutterMarker.prototype.toDOM = void 0;
GutterMarker.prototype.mapMode = MapMode.TrackBefore;
GutterMarker.prototype.startSide = GutterMarker.prototype.endSide = -1;
GutterMarker.prototype.point = !0;
const gutterLineClass = /* @__PURE__ */ Facet.define(), gutterWidgetClass = /* @__PURE__ */ Facet.define(), defaults$1 = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => RangeSet.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {}
}, activeGutters = /* @__PURE__ */ Facet.define();
function gutter(s) {
  return [gutters(), activeGutters.of(Object.assign(Object.assign({}, defaults$1), s))];
}
const unfixGutters = /* @__PURE__ */ Facet.define({
  combine: (s) => s.some((e) => e)
});
function gutters(s) {
  return [
    gutterView
  ];
}
const gutterView = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.view = s, this.prevViewport = s.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = s.state.facet(activeGutters).map((e) => new SingleGutterView(s, e));
    for (let e of this.gutters)
      this.dom.appendChild(e.dom);
    this.fixed = !s.state.facet(unfixGutters), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), s.scrollDOM.insertBefore(this.dom, s.contentDOM);
  }
  update(s) {
    if (this.updateGutters(s)) {
      let e = this.prevViewport, r = s.view.viewport, R = Math.min(e.to, r.to) - Math.max(e.from, r.from);
      this.syncGutters(R < (r.to - r.from) * 0.8);
    }
    s.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px"), this.view.state.facet(unfixGutters) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = s.view.viewport;
  }
  syncGutters(s) {
    let e = this.dom.nextSibling;
    s && this.dom.remove();
    let r = RangeSet.iter(this.view.state.facet(gutterLineClass), this.view.viewport.from), R = [], B = this.gutters.map((_) => new UpdateContext(_, this.view.viewport, -this.view.documentPadding.top));
    for (let _ of this.view.viewportLineBlocks)
      if (R.length && (R = []), Array.isArray(_.type)) {
        let $ = !0;
        for (let F of _.type)
          if (F.type == BlockType.Text && $) {
            advanceCursor(r, R, F.from);
            for (let V of B)
              V.line(this.view, F, R);
            $ = !1;
          } else if (F.widget)
            for (let V of B)
              V.widget(this.view, F);
      } else if (_.type == BlockType.Text) {
        advanceCursor(r, R, _.from);
        for (let $ of B)
          $.line(this.view, _, R);
      } else if (_.widget)
        for (let $ of B)
          $.widget(this.view, _);
    for (let _ of B)
      _.finish();
    s && this.view.scrollDOM.insertBefore(this.dom, e);
  }
  updateGutters(s) {
    let e = s.startState.facet(activeGutters), r = s.state.facet(activeGutters), R = s.docChanged || s.heightChanged || s.viewportChanged || !RangeSet.eq(s.startState.facet(gutterLineClass), s.state.facet(gutterLineClass), s.view.viewport.from, s.view.viewport.to);
    if (e == r)
      for (let B of this.gutters)
        B.update(s) && (R = !0);
    else {
      R = !0;
      let B = [];
      for (let _ of r) {
        let $ = e.indexOf(_);
        $ < 0 ? B.push(new SingleGutterView(this.view, _)) : (this.gutters[$].update(s), B.push(this.gutters[$]));
      }
      for (let _ of this.gutters)
        _.dom.remove(), B.indexOf(_) < 0 && _.destroy();
      for (let _ of B)
        this.dom.appendChild(_.dom);
      this.gutters = B;
    }
    return R;
  }
  destroy() {
    for (let s of this.gutters)
      s.destroy();
    this.dom.remove();
  }
}, {
  provide: (s) => EditorView.scrollMargins.of((e) => {
    let r = e.plugin(s);
    return !r || r.gutters.length == 0 || !r.fixed ? null : e.textDirection == Direction.LTR ? { left: r.dom.offsetWidth * e.scaleX } : { right: r.dom.offsetWidth * e.scaleX };
  })
});
function asArray(s) {
  return Array.isArray(s) ? s : [s];
}
function advanceCursor(s, e, r) {
  for (; s.value && s.from <= r; )
    s.from == r && e.push(s.value), s.next();
}
class UpdateContext {
  constructor(e, r, R) {
    this.gutter = e, this.height = R, this.i = 0, this.cursor = RangeSet.iter(e.markers, r.from);
  }
  addElement(e, r, R) {
    let { gutter: B } = this, _ = (r.top - this.height) / e.scaleY, $ = r.height / e.scaleY;
    if (this.i == B.elements.length) {
      let F = new GutterElement(e, $, _, R);
      B.elements.push(F), B.dom.appendChild(F.dom);
    } else
      B.elements[this.i].update(e, $, _, R);
    this.height = r.bottom, this.i++;
  }
  line(e, r, R) {
    let B = [];
    advanceCursor(this.cursor, B, r.from), R.length && (B = B.concat(R));
    let _ = this.gutter.config.lineMarker(e, r, B);
    _ && B.unshift(_);
    let $ = this.gutter;
    B.length == 0 && !$.config.renderEmptyElements || this.addElement(e, r, B);
  }
  widget(e, r) {
    let R = this.gutter.config.widgetMarker(e, r.widget, r), B = R ? [R] : null;
    for (let _ of e.state.facet(gutterWidgetClass)) {
      let $ = _(e, r.widget, r);
      $ && (B || (B = [])).push($);
    }
    B && this.addElement(e, r, B);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let r = e.elements.pop();
      e.dom.removeChild(r.dom), r.destroy();
    }
  }
}
class SingleGutterView {
  constructor(e, r) {
    this.view = e, this.config = r, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let R in r.domEventHandlers)
      this.dom.addEventListener(R, (B) => {
        let _ = B.target, $;
        if (_ != this.dom && this.dom.contains(_)) {
          for (; _.parentNode != this.dom; )
            _ = _.parentNode;
          let V = _.getBoundingClientRect();
          $ = (V.top + V.bottom) / 2;
        } else
          $ = B.clientY;
        let F = e.lineBlockAtHeight($ - e.documentTop);
        r.domEventHandlers[R](e, F, B) && B.preventDefault();
      });
    this.markers = asArray(r.markers(e)), r.initialSpacer && (this.spacer = new GutterElement(e, 0, 0, [r.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let r = this.markers;
    if (this.markers = asArray(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let B = this.config.updateSpacer(this.spacer.markers[0], e);
      B != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [B]);
    }
    let R = e.view.viewport;
    return !RangeSet.eq(this.markers, r, R.from, R.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class GutterElement {
  constructor(e, r, R, B) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, r, R, B);
  }
  update(e, r, R, B) {
    this.height != r && (this.height = r, this.dom.style.height = r + "px"), this.above != R && (this.dom.style.marginTop = (this.above = R) ? R + "px" : ""), sameMarkers(this.markers, B) || this.setMarkers(e, B);
  }
  setMarkers(e, r) {
    let R = "cm-gutterElement", B = this.dom.firstChild;
    for (let _ = 0, $ = 0; ; ) {
      let F = $, V = _ < r.length ? r[_++] : null, H = !1;
      if (V) {
        let W = V.elementClass;
        W && (R += " " + W);
        for (let U = $; U < this.markers.length; U++)
          if (this.markers[U].compare(V)) {
            F = U, H = !0;
            break;
          }
      } else
        F = this.markers.length;
      for (; $ < F; ) {
        let W = this.markers[$++];
        if (W.toDOM) {
          W.destroy(B);
          let U = B.nextSibling;
          B.remove(), B = U;
        }
      }
      if (!V)
        break;
      V.toDOM && (H ? B = B.nextSibling : this.dom.insertBefore(V.toDOM(e), B)), H && $++;
    }
    this.dom.className = R, this.markers = r;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function sameMarkers(s, e) {
  if (s.length != e.length)
    return !1;
  for (let r = 0; r < s.length; r++)
    if (!s[r].compare(e[r]))
      return !1;
  return !0;
}
const lineNumberMarkers = /* @__PURE__ */ Facet.define(), lineNumberWidgetMarker = /* @__PURE__ */ Facet.define(), lineNumberConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, r) {
        let R = Object.assign({}, e);
        for (let B in r) {
          let _ = R[B], $ = r[B];
          R[B] = _ ? (F, V, H) => _(F, V, H) || $(F, V, H) : $;
        }
        return R;
      }
    });
  }
});
class NumberMarker extends GutterMarker {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function formatNumber(s, e) {
  return s.state.facet(lineNumberConfig).formatNumber(e, s.state);
}
const lineNumberGutter = /* @__PURE__ */ activeGutters.compute([lineNumberConfig], (s) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(lineNumberMarkers);
  },
  lineMarker(e, r, R) {
    return R.some((B) => B.toDOM) ? null : new NumberMarker(formatNumber(e, e.state.doc.lineAt(r.from).number));
  },
  widgetMarker: (e, r, R) => {
    for (let B of e.state.facet(lineNumberWidgetMarker)) {
      let _ = B(e, r, R);
      if (_)
        return _;
    }
    return null;
  },
  lineMarkerChange: (e) => e.startState.facet(lineNumberConfig) != e.state.facet(lineNumberConfig),
  initialSpacer(e) {
    return new NumberMarker(formatNumber(e, maxLineNumber(e.state.doc.lines)));
  },
  updateSpacer(e, r) {
    let R = formatNumber(r.view, maxLineNumber(r.view.state.doc.lines));
    return R == e.number ? e : new NumberMarker(R);
  },
  domEventHandlers: s.facet(lineNumberConfig).domEventHandlers
}));
function lineNumbers(s = {}) {
  return [
    lineNumberConfig.of(s),
    gutters(),
    lineNumberGutter
  ];
}
function maxLineNumber(s) {
  let e = 9;
  for (; e < s; )
    e = e * 10 + 9;
  return e;
}
const activeLineGutterMarker = /* @__PURE__ */ new class extends GutterMarker {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), activeLineGutterHighlighter = /* @__PURE__ */ gutterLineClass.compute(["selection"], (s) => {
  let e = [], r = -1;
  for (let R of s.selection.ranges) {
    let B = s.doc.lineAt(R.head).from;
    B > r && (r = B, e.push(activeLineGutterMarker.range(B)));
  }
  return RangeSet.of(e);
});
function highlightActiveLineGutter() {
  return activeLineGutterHighlighter;
}
const DefaultBufferLength = 1024;
let nextPropID = 0;
class Range {
  constructor(e, r) {
    this.from = e, this.to = r;
  }
}
class NodeProp {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = nextPropID++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = NodeType.match(e)), (r) => {
      let R = e(r);
      return R === void 0 ? null : [this, R];
    };
  }
}
NodeProp.closedBy = new NodeProp({ deserialize: (s) => s.split(" ") });
NodeProp.openedBy = new NodeProp({ deserialize: (s) => s.split(" ") });
NodeProp.group = new NodeProp({ deserialize: (s) => s.split(" ") });
NodeProp.isolate = new NodeProp({ deserialize: (s) => {
  if (s && s != "rtl" && s != "ltr" && s != "auto")
    throw new RangeError("Invalid value for isolate: " + s);
  return s || "auto";
} });
NodeProp.contextHash = new NodeProp({ perNode: !0 });
NodeProp.lookAhead = new NodeProp({ perNode: !0 });
NodeProp.mounted = new NodeProp({ perNode: !0 });
class MountedTree {
  constructor(e, r, R) {
    this.tree = e, this.overlay = r, this.parser = R;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[NodeProp.mounted.id];
  }
}
const noProps = /* @__PURE__ */ Object.create(null);
class NodeType {
  /**
  @internal
  */
  constructor(e, r, R, B = 0) {
    this.name = e, this.props = r, this.id = R, this.flags = B;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let r = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : noProps, R = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), B = new NodeType(e.name || "", r, e.id, R);
    if (e.props) {
      for (let _ of e.props)
        if (Array.isArray(_) || (_ = _(B)), _) {
          if (_[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          r[_[0].id] = _[1];
        }
    }
    return B;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let r = this.prop(NodeProp.group);
      return r ? r.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let r = /* @__PURE__ */ Object.create(null);
    for (let R in e)
      for (let B of R.split(" "))
        r[B] = e[R];
    return (R) => {
      for (let B = R.prop(NodeProp.group), _ = -1; _ < (B ? B.length : 0); _++) {
        let $ = r[_ < 0 ? R.name : B[_]];
        if ($)
          return $;
      }
    };
  }
}
NodeType.none = new NodeType(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
const CachedNode = /* @__PURE__ */ new WeakMap(), CachedInnerNode = /* @__PURE__ */ new WeakMap();
var IterMode;
(function(s) {
  s[s.ExcludeBuffers = 1] = "ExcludeBuffers", s[s.IncludeAnonymous = 2] = "IncludeAnonymous", s[s.IgnoreMounts = 4] = "IgnoreMounts", s[s.IgnoreOverlays = 8] = "IgnoreOverlays";
})(IterMode || (IterMode = {}));
class Tree {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, r, R, B, _) {
    if (this.type = e, this.children = r, this.positions = R, this.length = B, this.props = null, _ && _.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [$, F] of _)
        this.props[typeof $ == "number" ? $ : $.id] = F;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = MountedTree.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let r = "";
    for (let R of this.children) {
      let B = R.toString();
      B && (r && (r += ","), r += B);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (r.length ? "(" + r + ")" : "") : r;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new TreeCursor(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, r = 0, R = 0) {
    let B = CachedNode.get(this) || this.topNode, _ = new TreeCursor(B);
    return _.moveTo(e, r), CachedNode.set(this, _._tree), _;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new TreeNode(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, r = 0) {
    let R = resolveNode(CachedNode.get(this) || this.topNode, e, r, !1);
    return CachedNode.set(this, R), R;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, r = 0) {
    let R = resolveNode(CachedInnerNode.get(this) || this.topNode, e, r, !0);
    return CachedInnerNode.set(this, R), R;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, r = 0) {
    return stackIterator(this, e, r);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: r, leave: R, from: B = 0, to: _ = this.length } = e, $ = e.mode || 0, F = ($ & IterMode.IncludeAnonymous) > 0;
    for (let V = this.cursor($ | IterMode.IncludeAnonymous); ; ) {
      let H = !1;
      if (V.from <= _ && V.to >= B && (!F && V.type.isAnonymous || r(V) !== !1)) {
        if (V.firstChild())
          continue;
        H = !0;
      }
      for (; H && R && (F || !V.type.isAnonymous) && R(V), !V.nextSibling(); ) {
        if (!V.parent())
          return;
        H = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let r in this.props)
        e.push([+r, this.props[r]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : balanceRange(NodeType.none, this.children, this.positions, 0, this.children.length, 0, this.length, (r, R, B) => new Tree(this.type, r, R, B, this.propValues), e.makeTree || ((r, R, B) => new Tree(NodeType.none, r, R, B)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return buildTree(e);
  }
}
Tree.empty = new Tree(NodeType.none, [], [], 0);
class FlatBufferCursor {
  constructor(e, r) {
    this.buffer = e, this.index = r;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new FlatBufferCursor(this.buffer, this.index);
  }
}
class TreeBuffer {
  /**
  Create a tree buffer.
  */
  constructor(e, r, R) {
    this.buffer = e, this.length = r, this.set = R;
  }
  /**
  @internal
  */
  get type() {
    return NodeType.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let r = 0; r < this.buffer.length; )
      e.push(this.childString(r)), r = this.buffer[r + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let r = this.buffer[e], R = this.buffer[e + 3], B = this.set.types[r], _ = B.name;
    if (/\W/.test(_) && !B.isError && (_ = JSON.stringify(_)), e += 4, R == e)
      return _;
    let $ = [];
    for (; e < R; )
      $.push(this.childString(e)), e = this.buffer[e + 3];
    return _ + "(" + $.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, r, R, B, _) {
    let { buffer: $ } = this, F = -1;
    for (let V = e; V != r && !(checkSide(_, B, $[V + 1], $[V + 2]) && (F = V, R > 0)); V = $[V + 3])
      ;
    return F;
  }
  /**
  @internal
  */
  slice(e, r, R) {
    let B = this.buffer, _ = new Uint16Array(r - e), $ = 0;
    for (let F = e, V = 0; F < r; ) {
      _[V++] = B[F++], _[V++] = B[F++] - R;
      let H = _[V++] = B[F++] - R;
      _[V++] = B[F++] - e, $ = Math.max($, H);
    }
    return new TreeBuffer(_, $, this.set);
  }
}
function checkSide(s, e, r, R) {
  switch (s) {
    case -2:
      return r < e;
    case -1:
      return R >= e && r < e;
    case 0:
      return r < e && R > e;
    case 1:
      return r <= e && R > e;
    case 2:
      return R > e;
    case 4:
      return !0;
  }
}
function resolveNode(s, e, r, R) {
  for (var B; s.from == s.to || (r < 1 ? s.from >= e : s.from > e) || (r > -1 ? s.to <= e : s.to < e); ) {
    let $ = !R && s instanceof TreeNode && s.index < 0 ? null : s.parent;
    if (!$)
      return s;
    s = $;
  }
  let _ = R ? 0 : IterMode.IgnoreOverlays;
  if (R)
    for (let $ = s, F = $.parent; F; $ = F, F = $.parent)
      $ instanceof TreeNode && $.index < 0 && ((B = F.enter(e, r, _)) === null || B === void 0 ? void 0 : B.from) != $.from && (s = F);
  for (; ; ) {
    let $ = s.enter(e, r, _);
    if (!$)
      return s;
    s = $;
  }
}
class BaseNode {
  cursor(e = 0) {
    return new TreeCursor(this, e);
  }
  getChild(e, r = null, R = null) {
    let B = getChildren(this, e, r, R);
    return B.length ? B[0] : null;
  }
  getChildren(e, r = null, R = null) {
    return getChildren(this, e, r, R);
  }
  resolve(e, r = 0) {
    return resolveNode(this, e, r, !1);
  }
  resolveInner(e, r = 0) {
    return resolveNode(this, e, r, !0);
  }
  matchContext(e) {
    return matchNodeContext(this.parent, e);
  }
  enterUnfinishedNodesBefore(e) {
    let r = this.childBefore(e), R = this;
    for (; r; ) {
      let B = r.lastChild;
      if (!B || B.to != r.to)
        break;
      B.type.isError && B.from == B.to ? (R = r, r = B.prevSibling) : r = B;
    }
    return R;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class TreeNode extends BaseNode {
  constructor(e, r, R, B) {
    super(), this._tree = e, this.from = r, this.index = R, this._parent = B;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, r, R, B, _ = 0) {
    for (let $ = this; ; ) {
      for (let { children: F, positions: V } = $._tree, H = r > 0 ? F.length : -1; e != H; e += r) {
        let W = F[e], U = V[e] + $.from;
        if (checkSide(B, R, U, U + W.length)) {
          if (W instanceof TreeBuffer) {
            if (_ & IterMode.ExcludeBuffers)
              continue;
            let z = W.findChild(0, W.buffer.length, r, R - U, B);
            if (z > -1)
              return new BufferNode(new BufferContext($, W, e, U), null, z);
          } else if (_ & IterMode.IncludeAnonymous || !W.type.isAnonymous || hasChild(W)) {
            let z;
            if (!(_ & IterMode.IgnoreMounts) && (z = MountedTree.get(W)) && !z.overlay)
              return new TreeNode(z.tree, U, e, $);
            let K = new TreeNode(W, U, e, $);
            return _ & IterMode.IncludeAnonymous || !K.type.isAnonymous ? K : K.nextChild(r < 0 ? W.children.length - 1 : 0, r, R, B);
          }
        }
      }
      if (_ & IterMode.IncludeAnonymous || !$.type.isAnonymous || ($.index >= 0 ? e = $.index + r : e = r < 0 ? -1 : $._parent._tree.children.length, $ = $._parent, !$))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, r, R = 0) {
    let B;
    if (!(R & IterMode.IgnoreOverlays) && (B = MountedTree.get(this._tree)) && B.overlay) {
      let _ = e - this.from;
      for (let { from: $, to: F } of B.overlay)
        if ((r > 0 ? $ <= _ : $ < _) && (r < 0 ? F >= _ : F > _))
          return new TreeNode(B.tree, B.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, r, R);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function getChildren(s, e, r, R) {
  let B = s.cursor(), _ = [];
  if (!B.firstChild())
    return _;
  if (r != null) {
    for (let $ = !1; !$; )
      if ($ = B.type.is(r), !B.nextSibling())
        return _;
  }
  for (; ; ) {
    if (R != null && B.type.is(R))
      return _;
    if (B.type.is(e) && _.push(B.node), !B.nextSibling())
      return R == null ? _ : [];
  }
}
function matchNodeContext(s, e, r = e.length - 1) {
  for (let R = s; r >= 0; R = R.parent) {
    if (!R)
      return !1;
    if (!R.type.isAnonymous) {
      if (e[r] && e[r] != R.name)
        return !1;
      r--;
    }
  }
  return !0;
}
class BufferContext {
  constructor(e, r, R, B) {
    this.parent = e, this.buffer = r, this.index = R, this.start = B;
  }
}
class BufferNode extends BaseNode {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, r, R) {
    super(), this.context = e, this._parent = r, this.index = R, this.type = e.buffer.set.types[e.buffer.buffer[R]];
  }
  child(e, r, R) {
    let { buffer: B } = this.context, _ = B.findChild(this.index + 4, B.buffer[this.index + 3], e, r - this.context.start, R);
    return _ < 0 ? null : new BufferNode(this.context, this, _);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, r, R = 0) {
    if (R & IterMode.ExcludeBuffers)
      return null;
    let { buffer: B } = this.context, _ = B.findChild(this.index + 4, B.buffer[this.index + 3], r > 0 ? 1 : -1, e - this.context.start, r);
    return _ < 0 ? null : new BufferNode(this.context, this, _);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, r = e.buffer[this.index + 3];
    return r < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new BufferNode(this.context, this._parent, r) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, r = this._parent ? this._parent.index + 4 : 0;
    return this.index == r ? this.externalSibling(-1) : new BufferNode(this.context, this._parent, e.findChild(
      r,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], r = [], { buffer: R } = this.context, B = this.index + 4, _ = R.buffer[this.index + 3];
    if (_ > B) {
      let $ = R.buffer[this.index + 1];
      e.push(R.slice(B, _, $)), r.push(0);
    }
    return new Tree(this.type, e, r, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function iterStack(s) {
  if (!s.length)
    return null;
  let e = 0, r = s[0];
  for (let _ = 1; _ < s.length; _++) {
    let $ = s[_];
    ($.from > r.from || $.to < r.to) && (r = $, e = _);
  }
  let R = r instanceof TreeNode && r.index < 0 ? null : r.parent, B = s.slice();
  return R ? B[e] = R : B.splice(e, 1), new StackIterator(B, r);
}
class StackIterator {
  constructor(e, r) {
    this.heads = e, this.node = r;
  }
  get next() {
    return iterStack(this.heads);
  }
}
function stackIterator(s, e, r) {
  let R = s.resolveInner(e, r), B = null;
  for (let _ = R instanceof TreeNode ? R : R.context.parent; _; _ = _.parent)
    if (_.index < 0) {
      let $ = _.parent;
      (B || (B = [R])).push($.resolve(e, r)), _ = $;
    } else {
      let $ = MountedTree.get(_.tree);
      if ($ && $.overlay && $.overlay[0].from <= e && $.overlay[$.overlay.length - 1].to >= e) {
        let F = new TreeNode($.tree, $.overlay[0].from + _.from, -1, _);
        (B || (B = [R])).push(resolveNode(F, e, r, !1));
      }
    }
  return B ? iterStack(B) : R;
}
class TreeCursor {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, r = 0) {
    if (this.mode = r, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, e instanceof TreeNode)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let R = e._parent; R; R = R._parent)
        this.stack.unshift(R.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, r) {
    this.index = e;
    let { start: R, buffer: B } = this.buffer;
    return this.type = r || B.set.types[B.buffer[e]], this.from = R + B.buffer[e + 1], this.to = R + B.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof TreeNode ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, r, R) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, r, R, this.mode));
    let { buffer: B } = this.buffer, _ = B.findChild(this.index + 4, B.buffer[this.index + 3], e, r - this.buffer.start, R);
    return _ < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(_));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, r, R = this.mode) {
    return this.buffer ? R & IterMode.ExcludeBuffers ? !1 : this.enterChild(1, e, r) : this.yield(this._tree.enter(e, r, R));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & IterMode.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & IterMode.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: r } = this.buffer, R = this.stack.length - 1;
    if (e < 0) {
      let B = R < 0 ? 0 : this.stack[R] + 4;
      if (this.index != B)
        return this.yieldBuf(r.findChild(
          B,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let B = r.buffer[this.index + 3];
      if (B < (R < 0 ? r.buffer.length : r.buffer[this.stack[R] + 3]))
        return this.yieldBuf(B);
    }
    return R < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let r, R, { buffer: B } = this;
    if (B) {
      if (e > 0) {
        if (this.index < B.buffer.buffer.length)
          return !1;
      } else
        for (let _ = 0; _ < this.index; _++)
          if (B.buffer.buffer[_ + 3] < this.index)
            return !1;
      ({ index: r, parent: R } = B);
    } else
      ({ index: r, _parent: R } = this._tree);
    for (; R; { index: r, _parent: R } = R)
      if (r > -1)
        for (let _ = r + e, $ = e < 0 ? -1 : R._tree.children.length; _ != $; _ += e) {
          let F = R._tree.children[_];
          if (this.mode & IterMode.IncludeAnonymous || F instanceof TreeBuffer || !F.type.isAnonymous || hasChild(F))
            return !1;
        }
    return !0;
  }
  move(e, r) {
    if (r && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, r = 0) {
    for (; (this.from == this.to || (r < 1 ? this.from >= e : this.from > e) || (r > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, r); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, r = null, R = 0;
    if (e && e.context == this.buffer)
      e: for (let B = this.index, _ = this.stack.length; _ >= 0; ) {
        for (let $ = e; $; $ = $._parent)
          if ($.index == B) {
            if (B == this.index)
              return $;
            r = $, R = _ + 1;
            break e;
          }
        B = this.stack[--_];
      }
    for (let B = R; B < this.stack.length; B++)
      r = new BufferNode(this.buffer, r, this.stack[B]);
    return this.bufferNode = new BufferNode(this.buffer, r, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, r) {
    for (let R = 0; ; ) {
      let B = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          R++;
          continue;
        }
        this.type.isAnonymous || (B = !0);
      }
      for (; ; ) {
        if (B && r && r(this), B = this.type.isAnonymous, !R)
          return;
        if (this.nextSibling())
          break;
        this.parent(), R--, B = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return matchNodeContext(this.node.parent, e);
    let { buffer: r } = this.buffer, { types: R } = r.set;
    for (let B = e.length - 1, _ = this.stack.length - 1; B >= 0; _--) {
      if (_ < 0)
        return matchNodeContext(this._tree, e, B);
      let $ = R[r.buffer[this.stack[_]]];
      if (!$.isAnonymous) {
        if (e[B] && e[B] != $.name)
          return !1;
        B--;
      }
    }
    return !0;
  }
}
function hasChild(s) {
  return s.children.some((e) => e instanceof TreeBuffer || !e.type.isAnonymous || hasChild(e));
}
function buildTree(s) {
  var e;
  let { buffer: r, nodeSet: R, maxBufferLength: B = DefaultBufferLength, reused: _ = [], minRepeatType: $ = R.types.length } = s, F = Array.isArray(r) ? new FlatBufferCursor(r, r.length) : r, V = R.types, H = 0, W = 0;
  function U(re, ae, le, me, Se, ke) {
    let { id: ce, start: ge, end: Ce, size: be } = F, xe = W, Q = H;
    for (; be < 0; )
      if (F.next(), be == -1) {
        let ee = _[ce];
        le.push(ee), me.push(ge - re);
        return;
      } else if (be == -3) {
        H = ce;
        return;
      } else if (be == -4) {
        W = ce;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${be}`);
    let q = V[ce], j, G, J = ge - re;
    if (Ce - ge <= B && (G = Y(F.pos - ae, Se))) {
      let ee = new Uint16Array(G.size - G.skip), se = F.pos - G.size, ne = ee.length;
      for (; F.pos > se; )
        ne = te(G.start, ee, ne);
      j = new TreeBuffer(ee, Ce - G.start, R), J = G.start - re;
    } else {
      let ee = F.pos - be;
      F.next();
      let se = [], ne = [], oe = ce >= $ ? ce : -1, he = 0, pe = Ce;
      for (; F.pos > ee; )
        oe >= 0 && F.id == oe && F.size >= 0 ? (F.end <= pe - B && (X(se, ne, ge, he, F.end, pe, oe, xe, Q), he = se.length, pe = F.end), F.next()) : ke > 2500 ? z(ge, ee, se, ne) : U(ge, ee, se, ne, oe, ke + 1);
      if (oe >= 0 && he > 0 && he < se.length && X(se, ne, ge, he, ge, pe, oe, xe, Q), se.reverse(), ne.reverse(), oe > -1 && he > 0) {
        let ve = K(q, Q);
        j = balanceRange(q, se, ne, 0, se.length, 0, Ce - ge, ve, ve);
      } else
        j = Z(q, se, ne, Ce - ge, xe - Ce, Q);
    }
    le.push(j), me.push(J);
  }
  function z(re, ae, le, me) {
    let Se = [], ke = 0, ce = -1;
    for (; F.pos > ae; ) {
      let { id: ge, start: Ce, end: be, size: xe } = F;
      if (xe > 4)
        F.next();
      else {
        if (ce > -1 && Ce < ce)
          break;
        ce < 0 && (ce = be - B), Se.push(ge, Ce, be), ke++, F.next();
      }
    }
    if (ke) {
      let ge = new Uint16Array(ke * 4), Ce = Se[Se.length - 2];
      for (let be = Se.length - 3, xe = 0; be >= 0; be -= 3)
        ge[xe++] = Se[be], ge[xe++] = Se[be + 1] - Ce, ge[xe++] = Se[be + 2] - Ce, ge[xe++] = xe;
      le.push(new TreeBuffer(ge, Se[2] - Ce, R)), me.push(Ce - re);
    }
  }
  function K(re, ae) {
    return (le, me, Se) => {
      let ke = 0, ce = le.length - 1, ge, Ce;
      if (ce >= 0 && (ge = le[ce]) instanceof Tree) {
        if (!ce && ge.type == re && ge.length == Se)
          return ge;
        (Ce = ge.prop(NodeProp.lookAhead)) && (ke = me[ce] + ge.length + Ce);
      }
      return Z(re, le, me, Se, ke, ae);
    };
  }
  function X(re, ae, le, me, Se, ke, ce, ge, Ce) {
    let be = [], xe = [];
    for (; re.length > me; )
      be.push(re.pop()), xe.push(ae.pop() + le - Se);
    re.push(Z(R.types[ce], be, xe, ke - Se, ge - ke, Ce)), ae.push(Se - le);
  }
  function Z(re, ae, le, me, Se, ke, ce) {
    if (ke) {
      let ge = [NodeProp.contextHash, ke];
      ce = ce ? [ge].concat(ce) : [ge];
    }
    if (Se > 25) {
      let ge = [NodeProp.lookAhead, Se];
      ce = ce ? [ge].concat(ce) : [ge];
    }
    return new Tree(re, ae, le, me, ce);
  }
  function Y(re, ae) {
    let le = F.fork(), me = 0, Se = 0, ke = 0, ce = le.end - B, ge = { size: 0, start: 0, skip: 0 };
    e: for (let Ce = le.pos - re; le.pos > Ce; ) {
      let be = le.size;
      if (le.id == ae && be >= 0) {
        ge.size = me, ge.start = Se, ge.skip = ke, ke += 4, me += 4, le.next();
        continue;
      }
      let xe = le.pos - be;
      if (be < 0 || xe < Ce || le.start < ce)
        break;
      let Q = le.id >= $ ? 4 : 0, q = le.start;
      for (le.next(); le.pos > xe; ) {
        if (le.size < 0)
          if (le.size == -3)
            Q += 4;
          else
            break e;
        else le.id >= $ && (Q += 4);
        le.next();
      }
      Se = q, me += be, ke += Q;
    }
    return (ae < 0 || me == re) && (ge.size = me, ge.start = Se, ge.skip = ke), ge.size > 4 ? ge : void 0;
  }
  function te(re, ae, le) {
    let { id: me, start: Se, end: ke, size: ce } = F;
    if (F.next(), ce >= 0 && me < $) {
      let ge = le;
      if (ce > 4) {
        let Ce = F.pos - (ce - 4);
        for (; F.pos > Ce; )
          le = te(re, ae, le);
      }
      ae[--le] = ge, ae[--le] = ke - re, ae[--le] = Se - re, ae[--le] = me;
    } else ce == -3 ? H = me : ce == -4 && (W = me);
    return le;
  }
  let ue = [], fe = [];
  for (; F.pos > 0; )
    U(s.start || 0, s.bufferStart || 0, ue, fe, -1, 0);
  let de = (e = s.length) !== null && e !== void 0 ? e : ue.length ? fe[0] + ue[0].length : 0;
  return new Tree(V[s.topID], ue.reverse(), fe.reverse(), de);
}
const nodeSizeCache = /* @__PURE__ */ new WeakMap();
function nodeSize(s, e) {
  if (!s.isAnonymous || e instanceof TreeBuffer || e.type != s)
    return 1;
  let r = nodeSizeCache.get(e);
  if (r == null) {
    r = 1;
    for (let R of e.children) {
      if (R.type != s || !(R instanceof Tree)) {
        r = 1;
        break;
      }
      r += nodeSize(s, R);
    }
    nodeSizeCache.set(e, r);
  }
  return r;
}
function balanceRange(s, e, r, R, B, _, $, F, V) {
  let H = 0;
  for (let X = R; X < B; X++)
    H += nodeSize(s, e[X]);
  let W = Math.ceil(
    H * 1.5 / 8
    /* Balance.BranchFactor */
  ), U = [], z = [];
  function K(X, Z, Y, te, ue) {
    for (let fe = Y; fe < te; ) {
      let de = fe, re = Z[fe], ae = nodeSize(s, X[fe]);
      for (fe++; fe < te; fe++) {
        let le = nodeSize(s, X[fe]);
        if (ae + le >= W)
          break;
        ae += le;
      }
      if (fe == de + 1) {
        if (ae > W) {
          let le = X[de];
          K(le.children, le.positions, 0, le.children.length, Z[de] + ue);
          continue;
        }
        U.push(X[de]);
      } else {
        let le = Z[fe - 1] + X[fe - 1].length - re;
        U.push(balanceRange(s, X, Z, de, fe, re, le, null, V));
      }
      z.push(re + ue - _);
    }
  }
  return K(e, r, R, B, 0), (F || V)(U, z, $);
}
class TreeFragment {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, r, R, B, _ = !1, $ = !1) {
    this.from = e, this.to = r, this.tree = R, this.offset = B, this.open = (_ ? 1 : 0) | ($ ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, r = [], R = !1) {
    let B = [new TreeFragment(0, e.length, e, 0, !1, R)];
    for (let _ of r)
      _.to > e.length && B.push(_);
    return B;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, r, R = 128) {
    if (!r.length)
      return e;
    let B = [], _ = 1, $ = e.length ? e[0] : null;
    for (let F = 0, V = 0, H = 0; ; F++) {
      let W = F < r.length ? r[F] : null, U = W ? W.fromA : 1e9;
      if (U - V >= R)
        for (; $ && $.from < U; ) {
          let z = $;
          if (V >= z.from || U <= z.to || H) {
            let K = Math.max(z.from, V) - H, X = Math.min(z.to, U) - H;
            z = K >= X ? null : new TreeFragment(K, X, z.tree, z.offset + H, F > 0, !!W);
          }
          if (z && B.push(z), $.to > U)
            break;
          $ = _ < e.length ? e[_++] : null;
        }
      if (!W)
        break;
      V = W.toA, H = W.toA - W.toB;
    }
    return B;
  }
}
class Parser {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, r, R) {
    return typeof e == "string" && (e = new StringInput(e)), R = R ? R.length ? R.map((B) => new Range(B.from, B.to)) : [new Range(0, 0)] : [new Range(0, e.length)], this.createParse(e, r || [], R);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, r, R) {
    let B = this.startParse(e, r, R);
    for (; ; ) {
      let _ = B.advance();
      if (_)
        return _;
    }
  }
}
class StringInput {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, r) {
    return this.string.slice(e, r);
  }
}
new NodeProp({ perNode: !0 });
let nextTagID = 0;
class Tag {
  /**
  @internal
  */
  constructor(e, r, R, B) {
    this.name = e, this.set = r, this.base = R, this.modified = B, this.id = nextTagID++;
  }
  toString() {
    let { name: e } = this;
    for (let r of this.modified)
      r.name && (e = `${r.name}(${e})`);
    return e;
  }
  static define(e, r) {
    let R = typeof e == "string" ? e : "?";
    if (e instanceof Tag && (r = e), r != null && r.base)
      throw new Error("Can not derive from a modified tag");
    let B = new Tag(R, [], null, []);
    if (B.set.push(B), r)
      for (let _ of r.set)
        B.set.push(_);
    return B;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(e) {
    let r = new Modifier(e);
    return (R) => R.modified.indexOf(r) > -1 ? R : Modifier.get(R.base || R, R.modified.concat(r).sort((B, _) => B.id - _.id));
  }
}
let nextModifierID = 0;
class Modifier {
  constructor(e) {
    this.name = e, this.instances = [], this.id = nextModifierID++;
  }
  static get(e, r) {
    if (!r.length)
      return e;
    let R = r[0].instances.find((F) => F.base == e && sameArray(r, F.modified));
    if (R)
      return R;
    let B = [], _ = new Tag(e.name, B, e, r);
    for (let F of r)
      F.instances.push(_);
    let $ = powerSet(r);
    for (let F of e.set)
      if (!F.modified.length)
        for (let V of $)
          B.push(Modifier.get(F, V));
    return _;
  }
}
function sameArray(s, e) {
  return s.length == e.length && s.every((r, R) => r == e[R]);
}
function powerSet(s) {
  let e = [[]];
  for (let r = 0; r < s.length; r++)
    for (let R = 0, B = e.length; R < B; R++)
      e.push(e[R].concat(s[r]));
  return e.sort((r, R) => R.length - r.length);
}
function styleTags(s) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let r in s) {
    let R = s[r];
    Array.isArray(R) || (R = [R]);
    for (let B of r.split(" "))
      if (B) {
        let _ = [], $ = 2, F = B;
        for (let U = 0; ; ) {
          if (F == "..." && U > 0 && U + 3 == B.length) {
            $ = 1;
            break;
          }
          let z = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(F);
          if (!z)
            throw new RangeError("Invalid path: " + B);
          if (_.push(z[0] == "*" ? "" : z[0][0] == '"' ? JSON.parse(z[0]) : z[0]), U += z[0].length, U == B.length)
            break;
          let K = B[U++];
          if (U == B.length && K == "!") {
            $ = 0;
            break;
          }
          if (K != "/")
            throw new RangeError("Invalid path: " + B);
          F = B.slice(U);
        }
        let V = _.length - 1, H = _[V];
        if (!H)
          throw new RangeError("Invalid path: " + B);
        let W = new Rule(R, $, V > 0 ? _.slice(0, V) : null);
        e[H] = W.sort(e[H]);
      }
  }
  return ruleNodeProp.add(e);
}
const ruleNodeProp = new NodeProp();
class Rule {
  constructor(e, r, R, B) {
    this.tags = e, this.mode = r, this.context = R, this.next = B;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Rule.empty = new Rule([], 2, null);
function tagHighlighter(s, e) {
  let r = /* @__PURE__ */ Object.create(null);
  for (let _ of s)
    if (!Array.isArray(_.tag))
      r[_.tag.id] = _.class;
    else
      for (let $ of _.tag)
        r[$.id] = _.class;
  let { scope: R, all: B = null } = e || {};
  return {
    style: (_) => {
      let $ = B;
      for (let F of _)
        for (let V of F.set) {
          let H = r[V.id];
          if (H) {
            $ = $ ? $ + " " + H : H;
            break;
          }
        }
      return $;
    },
    scope: R
  };
}
function highlightTags(s, e) {
  let r = null;
  for (let R of s) {
    let B = R.style(e);
    B && (r = r ? r + " " + B : B);
  }
  return r;
}
function highlightTree(s, e, r, R = 0, B = s.length) {
  let _ = new HighlightBuilder(R, Array.isArray(e) ? e : [e], r);
  _.highlightRange(s.cursor(), R, B, "", _.highlighters), _.flush(B);
}
class HighlightBuilder {
  constructor(e, r, R) {
    this.at = e, this.highlighters = r, this.span = R, this.class = "";
  }
  startSpan(e, r) {
    r != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = r);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, r, R, B, _) {
    let { type: $, from: F, to: V } = e;
    if (F >= R || V <= r)
      return;
    $.isTop && (_ = this.highlighters.filter((K) => !K.scope || K.scope($)));
    let H = B, W = getStyleTags(e) || Rule.empty, U = highlightTags(_, W.tags);
    if (U && (H && (H += " "), H += U, W.mode == 1 && (B += (B ? " " : "") + U)), this.startSpan(Math.max(r, F), H), W.opaque)
      return;
    let z = e.tree && e.tree.prop(NodeProp.mounted);
    if (z && z.overlay) {
      let K = e.node.enter(z.overlay[0].from + F, 1), X = this.highlighters.filter((Y) => !Y.scope || Y.scope(z.tree.type)), Z = e.firstChild();
      for (let Y = 0, te = F; ; Y++) {
        let ue = Y < z.overlay.length ? z.overlay[Y] : null, fe = ue ? ue.from + F : V, de = Math.max(r, te), re = Math.min(R, fe);
        if (de < re && Z)
          for (; e.from < re && (this.highlightRange(e, de, re, B, _), this.startSpan(Math.min(re, e.to), H), !(e.to >= fe || !e.nextSibling())); )
            ;
        if (!ue || fe > R)
          break;
        te = ue.to + F, te > r && (this.highlightRange(K.cursor(), Math.max(r, ue.from + F), Math.min(R, te), "", X), this.startSpan(Math.min(R, te), H));
      }
      Z && e.parent();
    } else if (e.firstChild()) {
      z && (B = "");
      do
        if (!(e.to <= r)) {
          if (e.from >= R)
            break;
          this.highlightRange(e, r, R, B, _), this.startSpan(Math.min(R, e.to), H);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function getStyleTags(s) {
  let e = s.type.prop(ruleNodeProp);
  for (; e && e.context && !s.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const t = Tag.define, comment = t(), name = t(), typeName = t(name), propertyName = t(name), literal = t(), string = t(literal), number = t(literal), content = t(), heading = t(content), keyword = t(), operator = t(), punctuation = t(), bracket = t(punctuation), meta = t(), tags = {
  /**
  A comment.
  */
  comment,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: t(comment),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: t(comment),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: t(comment),
  /**
  Any kind of identifier.
  */
  name,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: t(name),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: t(typeName),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: t(propertyName),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: t(name),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: t(name),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: t(name),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: t(name),
  /**
  A literal value.
  */
  literal,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: t(string),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: t(string),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: t(string),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: t(number),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: t(number),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: t(literal),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: t(literal),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: t(literal),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: t(literal),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: t(literal),
  /**
  A language keyword.
  */
  keyword,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: t(keyword),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: t(keyword),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: t(keyword),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: t(keyword),
  /**
  An operator.
  */
  operator,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: t(operator),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: t(operator),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: t(operator),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: t(operator),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: t(operator),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: t(operator),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: t(operator),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: t(operator),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: t(operator),
  /**
  Program or markup punctuation.
  */
  punctuation,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: t(punctuation),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: t(bracket),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: t(bracket),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: t(bracket),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: t(bracket),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: t(heading),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: t(heading),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: t(heading),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: t(heading),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: t(heading),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: t(heading),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: t(content),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: t(content),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: t(content),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: t(content),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: t(content),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: t(content),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: t(content),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: t(content),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: t(),
  /**
  Deleted text.
  */
  deleted: t(),
  /**
  Changed text.
  */
  changed: t(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: t(),
  /**
  Metadata or meta-instruction.
  */
  meta,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: t(meta),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: t(meta),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: t(meta),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Tag.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Tag.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Tag.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Tag.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Tag.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Tag.defineModifier("special")
};
for (let s in tags) {
  let e = tags[s];
  e instanceof Tag && (e.name = s);
}
tagHighlighter([
  { tag: tags.link, class: "tok-link" },
  { tag: tags.heading, class: "tok-heading" },
  { tag: tags.emphasis, class: "tok-emphasis" },
  { tag: tags.strong, class: "tok-strong" },
  { tag: tags.keyword, class: "tok-keyword" },
  { tag: tags.atom, class: "tok-atom" },
  { tag: tags.bool, class: "tok-bool" },
  { tag: tags.url, class: "tok-url" },
  { tag: tags.labelName, class: "tok-labelName" },
  { tag: tags.inserted, class: "tok-inserted" },
  { tag: tags.deleted, class: "tok-deleted" },
  { tag: tags.literal, class: "tok-literal" },
  { tag: tags.string, class: "tok-string" },
  { tag: tags.number, class: "tok-number" },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], class: "tok-string2" },
  { tag: tags.variableName, class: "tok-variableName" },
  { tag: tags.local(tags.variableName), class: "tok-variableName tok-local" },
  { tag: tags.definition(tags.variableName), class: "tok-variableName tok-definition" },
  { tag: tags.special(tags.variableName), class: "tok-variableName2" },
  { tag: tags.definition(tags.propertyName), class: "tok-propertyName tok-definition" },
  { tag: tags.typeName, class: "tok-typeName" },
  { tag: tags.namespace, class: "tok-namespace" },
  { tag: tags.className, class: "tok-className" },
  { tag: tags.macroName, class: "tok-macroName" },
  { tag: tags.propertyName, class: "tok-propertyName" },
  { tag: tags.operator, class: "tok-operator" },
  { tag: tags.comment, class: "tok-comment" },
  { tag: tags.meta, class: "tok-meta" },
  { tag: tags.invalid, class: "tok-invalid" },
  { tag: tags.punctuation, class: "tok-punctuation" }
]);
var _a;
const languageDataProp = /* @__PURE__ */ new NodeProp(), sublanguageProp = /* @__PURE__ */ new NodeProp();
class Language {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, r, R = [], B = "") {
    this.data = e, this.name = B, EditorState.prototype.hasOwnProperty("tree") || Object.defineProperty(EditorState.prototype, "tree", { get() {
      return syntaxTree(this);
    } }), this.parser = r, this.extension = [
      language.of(this),
      EditorState.languageData.of((_, $, F) => {
        let V = topNodeAt(_, $, F), H = V.type.prop(languageDataProp);
        if (!H)
          return [];
        let W = _.facet(H), U = V.type.prop(sublanguageProp);
        if (U) {
          let z = V.resolve($ - V.from, F);
          for (let K of U)
            if (K.test(z, _)) {
              let X = _.facet(K.facet);
              return K.type == "replace" ? X : X.concat(W);
            }
        }
        return W;
      })
    ].concat(R);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, r, R = -1) {
    return topNodeAt(e, r, R).type.prop(languageDataProp) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let r = e.facet(language);
    if ((r == null ? void 0 : r.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!r || !r.allowsNesting)
      return [];
    let R = [], B = (_, $) => {
      if (_.prop(languageDataProp) == this.data) {
        R.push({ from: $, to: $ + _.length });
        return;
      }
      let F = _.prop(NodeProp.mounted);
      if (F) {
        if (F.tree.prop(languageDataProp) == this.data) {
          if (F.overlay)
            for (let V of F.overlay)
              R.push({ from: V.from + $, to: V.to + $ });
          else
            R.push({ from: $, to: $ + _.length });
          return;
        } else if (F.overlay) {
          let V = R.length;
          if (B(F.tree, F.overlay[0].from + $), R.length > V)
            return;
        }
      }
      for (let V = 0; V < _.children.length; V++) {
        let H = _.children[V];
        H instanceof Tree && B(H, _.positions[V] + $);
      }
    };
    return B(syntaxTree(e), 0), R;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
Language.setState = /* @__PURE__ */ StateEffect.define();
function topNodeAt(s, e, r) {
  let R = s.facet(language), B = syntaxTree(s).topNode;
  if (!R || R.allowsNesting)
    for (let _ = B; _; _ = _.enter(e, r, IterMode.ExcludeBuffers))
      _.type.isTop && (B = _);
  return B;
}
function syntaxTree(s) {
  let e = s.field(Language.state, !1);
  return e ? e.tree : Tree.empty;
}
class DocInput {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, r) {
    let R = this.cursorPos - this.string.length;
    return e < R || r >= this.cursorPos ? this.doc.sliceString(e, r) : this.string.slice(e - R, r - R);
  }
}
let currentContext = null;
class ParseContext {
  constructor(e, r, R = [], B, _, $, F, V) {
    this.parser = e, this.state = r, this.fragments = R, this.tree = B, this.treeLen = _, this.viewport = $, this.skipped = F, this.scheduleOn = V, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, r, R) {
    return new ParseContext(e, r, [], Tree.empty, 0, R, [], null);
  }
  startParse() {
    return this.parser.startParse(new DocInput(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, r) {
    return r != null && r >= this.state.doc.length && (r = void 0), this.tree != Tree.empty && this.isDone(r ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var R;
      if (typeof e == "number") {
        let B = Date.now() + e;
        e = () => Date.now() > B;
      }
      for (this.parse || (this.parse = this.startParse()), r != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > r) && r < this.state.doc.length && this.parse.stopAt(r); ; ) {
        let B = this.parse.advance();
        if (B)
          if (this.fragments = this.withoutTempSkipped(TreeFragment.addTree(B, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (R = this.parse.stoppedAt) !== null && R !== void 0 ? R : this.state.doc.length, this.tree = B, this.parse = null, this.treeLen < (r ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, r;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(r = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = r, this.fragments = this.withoutTempSkipped(TreeFragment.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let r = currentContext;
    currentContext = this;
    try {
      return e();
    } finally {
      currentContext = r;
    }
  }
  withoutTempSkipped(e) {
    for (let r; r = this.tempSkipped.pop(); )
      e = cutFragments(e, r.from, r.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, r) {
    let { fragments: R, tree: B, treeLen: _, viewport: $, skipped: F } = this;
    if (this.takeTree(), !e.empty) {
      let V = [];
      if (e.iterChangedRanges((H, W, U, z) => V.push({ fromA: H, toA: W, fromB: U, toB: z })), R = TreeFragment.applyChanges(R, V), B = Tree.empty, _ = 0, $ = { from: e.mapPos($.from, -1), to: e.mapPos($.to, 1) }, this.skipped.length) {
        F = [];
        for (let H of this.skipped) {
          let W = e.mapPos(H.from, 1), U = e.mapPos(H.to, -1);
          W < U && F.push({ from: W, to: U });
        }
      }
    }
    return new ParseContext(this.parser, r, R, B, _, $, F, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let r = this.skipped.length;
    for (let R = 0; R < this.skipped.length; R++) {
      let { from: B, to: _ } = this.skipped[R];
      B < e.to && _ > e.from && (this.fragments = cutFragments(this.fragments, B, _), this.skipped.splice(R--, 1));
    }
    return this.skipped.length >= r ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, r) {
    this.skipped.push({ from: e, to: r });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends Parser {
      createParse(r, R, B) {
        let _ = B[0].from, $ = B[B.length - 1].to;
        return {
          parsedPos: _,
          advance() {
            let V = currentContext;
            if (V) {
              for (let H of B)
                V.tempSkipped.push(H);
              e && (V.scheduleOn = V.scheduleOn ? Promise.all([V.scheduleOn, e]) : e);
            }
            return this.parsedPos = $, new Tree(NodeType.none, [], [], $ - _);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let r = this.fragments;
    return this.treeLen >= e && r.length && r[0].from == 0 && r[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return currentContext;
  }
}
function cutFragments(s, e, r) {
  return TreeFragment.applyChanges(s, [{ fromA: e, toA: r, fromB: e, toB: r }]);
}
class LanguageState {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let r = this.context.changes(e.changes, e.state), R = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), r.viewport.to);
    return r.work(20, R) || r.takeTree(), new LanguageState(r);
  }
  static init(e) {
    let r = Math.min(3e3, e.doc.length), R = ParseContext.create(e.facet(language).parser, e, { from: 0, to: r });
    return R.work(20, r) || R.takeTree(), new LanguageState(R);
  }
}
Language.state = /* @__PURE__ */ StateField.define({
  create: LanguageState.init,
  update(s, e) {
    for (let r of e.effects)
      if (r.is(Language.setState))
        return r.value;
    return e.startState.facet(language) != e.state.facet(language) ? LanguageState.init(e.state) : s.apply(e);
  }
});
let requestIdle = (s) => {
  let e = setTimeout(
    () => s(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (requestIdle = (s) => {
  let e = -1, r = setTimeout(
    () => {
      e = requestIdleCallback(s, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(r) : cancelIdleCallback(e);
});
const isInputPending = typeof navigator < "u" && (!((_a = navigator.scheduling) === null || _a === void 0) && _a.isInputPending) ? () => navigator.scheduling.isInputPending() : null, parseWorker = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let r = this.view.state.field(Language.state).context;
    (r.updateViewport(e.view.viewport) || this.view.viewport.to > r.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(r);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, r = e.field(Language.state);
    (r.tree != r.context.tree || !r.context.isDone(e.doc.length)) && (this.working = requestIdle(this.work));
  }
  work(e) {
    this.working = null;
    let r = Date.now();
    if (this.chunkEnd < r && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = r + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: R, viewport: { to: B } } = this.view, _ = R.field(Language.state);
    if (_.tree == _.context.tree && _.context.isDone(
      B + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let $ = Date.now() + Math.min(this.chunkBudget, 100, e && !isInputPending ? Math.max(25, e.timeRemaining() - 5) : 1e9), F = _.context.treeLen < B && R.doc.length > B + 1e3, V = _.context.work(() => isInputPending && isInputPending() || Date.now() > $, B + (F ? 0 : 1e5));
    this.chunkBudget -= Date.now() - r, (V || this.chunkBudget <= 0) && (_.context.takeTree(), this.view.dispatch({ effects: Language.setState.of(new LanguageState(_.context)) })), this.chunkBudget > 0 && !(V && !F) && this.scheduleWork(), this.checkAsyncSchedule(_.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((r) => logException(this.view.state, r)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), language = /* @__PURE__ */ Facet.define({
  combine(s) {
    return s.length ? s[0] : null;
  },
  enables: (s) => [
    Language.state,
    parseWorker,
    EditorView.contentAttributes.compute([s], (e) => {
      let r = e.facet(s);
      return r && r.name ? { "data-language": r.name } : {};
    })
  ]
}), indentService = /* @__PURE__ */ Facet.define(), indentUnit = /* @__PURE__ */ Facet.define({
  combine: (s) => {
    if (!s.length)
      return "  ";
    let e = s[0];
    if (!e || /\S/.test(e) || Array.from(e).some((r) => r != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(s[0]));
    return e;
  }
});
function getIndentUnit(s) {
  let e = s.facet(indentUnit);
  return e.charCodeAt(0) == 9 ? s.tabSize * e.length : e.length;
}
function indentString(s, e) {
  let r = "", R = s.tabSize, B = s.facet(indentUnit)[0];
  if (B == "	") {
    for (; e >= R; )
      r += "	", e -= R;
    B = " ";
  }
  for (let _ = 0; _ < e; _++)
    r += B;
  return r;
}
function getIndentation(s, e) {
  s instanceof EditorState && (s = new IndentContext(s));
  for (let R of s.state.facet(indentService)) {
    let B = R(s, e);
    if (B !== void 0)
      return B;
  }
  let r = syntaxTree(s.state);
  return r.length >= e ? syntaxIndentation(s, r, e) : null;
}
class IndentContext {
  /**
  Create an indent context.
  */
  constructor(e, r = {}) {
    this.state = e, this.options = r, this.unit = getIndentUnit(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, r = 1) {
    let R = this.state.doc.lineAt(e), { simulateBreak: B, simulateDoubleBreak: _ } = this.options;
    return B != null && B >= R.from && B <= R.to ? _ && B == e ? { text: "", from: e } : (r < 0 ? B < e : B <= e) ? { text: R.text.slice(B - R.from), from: B } : { text: R.text.slice(0, B - R.from), from: R.from } : R;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, r = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: R, from: B } = this.lineAt(e, r);
    return R.slice(e - B, Math.min(R.length, e + 100 - B));
  }
  /**
  Find the column for the given position.
  */
  column(e, r = 1) {
    let { text: R, from: B } = this.lineAt(e, r), _ = this.countColumn(R, e - B), $ = this.options.overrideIndentation ? this.options.overrideIndentation(B) : -1;
    return $ > -1 && (_ += $ - this.countColumn(R, R.search(/\S|$/))), _;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, r = e.length) {
    return countColumn(e, this.state.tabSize, r);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, r = 1) {
    let { text: R, from: B } = this.lineAt(e, r), _ = this.options.overrideIndentation;
    if (_) {
      let $ = _(B);
      if ($ > -1)
        return $;
    }
    return this.countColumn(R, R.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const indentNodeProp = /* @__PURE__ */ new NodeProp();
function syntaxIndentation(s, e, r) {
  let R = e.resolveStack(r), B = e.resolveInner(r, -1).resolve(r, 0).enterUnfinishedNodesBefore(r);
  if (B != R.node) {
    let _ = [];
    for (let $ = B; $ && !($.from == R.node.from && $.type == R.node.type); $ = $.parent)
      _.push($);
    for (let $ = _.length - 1; $ >= 0; $--)
      R = { node: _[$], next: R };
  }
  return indentFor(R, s, r);
}
function indentFor(s, e, r) {
  for (let R = s; R; R = R.next) {
    let B = indentStrategy(R.node);
    if (B)
      return B(TreeIndentContext.create(e, r, R));
  }
  return 0;
}
function ignoreClosed(s) {
  return s.pos == s.options.simulateBreak && s.options.simulateDoubleBreak;
}
function indentStrategy(s) {
  let e = s.type.prop(indentNodeProp);
  if (e)
    return e;
  let r = s.firstChild, R;
  if (r && (R = r.type.prop(NodeProp.closedBy))) {
    let B = s.lastChild, _ = B && R.indexOf(B.name) > -1;
    return ($) => delimitedStrategy($, !0, 1, void 0, _ && !ignoreClosed($) ? B.from : void 0);
  }
  return s.parent == null ? topIndent : null;
}
function topIndent() {
  return 0;
}
class TreeIndentContext extends IndentContext {
  constructor(e, r, R) {
    super(e.state, e.options), this.base = e, this.pos = r, this.context = R;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, r, R) {
    return new TreeIndentContext(e, r, R);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let r = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let R = e.resolve(r.from);
      for (; R.parent && R.parent.from == R.from; )
        R = R.parent;
      if (isParent(R, e))
        break;
      r = this.state.doc.lineAt(R.from);
    }
    return this.lineIndent(r.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return indentFor(this.context.next, this.base, this.pos);
  }
}
function isParent(s, e) {
  for (let r = e; r; r = r.parent)
    if (s == r)
      return !0;
  return !1;
}
function bracketedAligned(s) {
  let e = s.node, r = e.childAfter(e.from), R = e.lastChild;
  if (!r)
    return null;
  let B = s.options.simulateBreak, _ = s.state.doc.lineAt(r.from), $ = B == null || B <= _.from ? _.to : Math.min(_.to, B);
  for (let F = r.to; ; ) {
    let V = e.childAfter(F);
    if (!V || V == R)
      return null;
    if (!V.type.isSkipped) {
      if (V.from >= $)
        return null;
      let H = /^ */.exec(_.text.slice(r.to - _.from))[0].length;
      return { from: r.from, to: r.to + H };
    }
    F = V.to;
  }
}
function delimitedStrategy(s, e, r, R, B) {
  let _ = s.textAfter, $ = _.match(/^\s*/)[0].length, F = B == s.pos + $, V = bracketedAligned(s);
  return V ? F ? s.column(V.from) : s.column(V.to) : s.baseIndent + (F ? 0 : s.unit * r);
}
const DontIndentBeyond = 200;
function indentOnInput() {
  return EditorState.transactionFilter.of((s) => {
    if (!s.docChanged || !s.isUserEvent("input.type") && !s.isUserEvent("input.complete"))
      return s;
    let e = s.startState.languageDataAt("indentOnInput", s.startState.selection.main.head);
    if (!e.length)
      return s;
    let r = s.newDoc, { head: R } = s.newSelection.main, B = r.lineAt(R);
    if (R > B.from + DontIndentBeyond)
      return s;
    let _ = r.sliceString(B.from, R);
    if (!e.some((H) => H.test(_)))
      return s;
    let { state: $ } = s, F = -1, V = [];
    for (let { head: H } of $.selection.ranges) {
      let W = $.doc.lineAt(H);
      if (W.from == F)
        continue;
      F = W.from;
      let U = getIndentation($, W.from);
      if (U == null)
        continue;
      let z = /^\s*/.exec(W.text)[0], K = indentString($, U);
      z != K && V.push({ from: W.from, to: W.from + z.length, insert: K });
    }
    return V.length ? [s, { changes: V, sequential: !0 }] : s;
  });
}
const foldService = /* @__PURE__ */ Facet.define(), foldNodeProp = /* @__PURE__ */ new NodeProp();
function syntaxFolding(s, e, r) {
  let R = syntaxTree(s);
  if (R.length < r)
    return null;
  let B = R.resolveStack(r, 1), _ = null;
  for (let $ = B; $; $ = $.next) {
    let F = $.node;
    if (F.to <= r || F.from > r)
      continue;
    if (_ && F.from < e)
      break;
    let V = F.type.prop(foldNodeProp);
    if (V && (F.to < R.length - 50 || R.length == s.doc.length || !isUnfinished(F))) {
      let H = V(F, s);
      H && H.from <= r && H.from >= e && H.to > r && (_ = H);
    }
  }
  return _;
}
function isUnfinished(s) {
  let e = s.lastChild;
  return e && e.to == s.to && e.type.isError;
}
function foldable(s, e, r) {
  for (let R of s.facet(foldService)) {
    let B = R(s, e, r);
    if (B)
      return B;
  }
  return syntaxFolding(s, e, r);
}
function mapRange(s, e) {
  let r = e.mapPos(s.from, 1), R = e.mapPos(s.to, -1);
  return r >= R ? void 0 : { from: r, to: R };
}
const foldEffect = /* @__PURE__ */ StateEffect.define({ map: mapRange }), unfoldEffect = /* @__PURE__ */ StateEffect.define({ map: mapRange });
function selectedLines(s) {
  let e = [];
  for (let { head: r } of s.state.selection.ranges)
    e.some((R) => R.from <= r && R.to >= r) || e.push(s.lineBlockAt(r));
  return e;
}
const foldState = /* @__PURE__ */ StateField.define({
  create() {
    return Decoration.none;
  },
  update(s, e) {
    s = s.map(e.changes);
    for (let r of e.effects)
      if (r.is(foldEffect) && !foldExists(s, r.value.from, r.value.to)) {
        let { preparePlaceholder: R } = e.state.facet(foldConfig), B = R ? Decoration.replace({ widget: new PreparedFoldWidget(R(e.state, r.value)) }) : foldWidget;
        s = s.update({ add: [B.range(r.value.from, r.value.to)] });
      } else r.is(unfoldEffect) && (s = s.update({
        filter: (R, B) => r.value.from != R || r.value.to != B,
        filterFrom: r.value.from,
        filterTo: r.value.to
      }));
    if (e.selection) {
      let r = !1, { head: R } = e.selection.main;
      s.between(R, R, (B, _) => {
        B < R && _ > R && (r = !0);
      }), r && (s = s.update({
        filterFrom: R,
        filterTo: R,
        filter: (B, _) => _ <= R || B >= R
      }));
    }
    return s;
  },
  provide: (s) => EditorView.decorations.from(s),
  toJSON(s, e) {
    let r = [];
    return s.between(0, e.doc.length, (R, B) => {
      r.push(R, B);
    }), r;
  },
  fromJSON(s) {
    if (!Array.isArray(s) || s.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let r = 0; r < s.length; ) {
      let R = s[r++], B = s[r++];
      if (typeof R != "number" || typeof B != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(foldWidget.range(R, B));
    }
    return Decoration.set(e, !0);
  }
});
function findFold(s, e, r) {
  var R;
  let B = null;
  return (R = s.field(foldState, !1)) === null || R === void 0 || R.between(e, r, (_, $) => {
    (!B || B.from > _) && (B = { from: _, to: $ });
  }), B;
}
function foldExists(s, e, r) {
  let R = !1;
  return s.between(e, e, (B, _) => {
    B == e && _ == r && (R = !0);
  }), R;
}
function maybeEnable(s, e) {
  return s.field(foldState, !1) ? e : e.concat(StateEffect.appendConfig.of(codeFolding()));
}
const foldCode = (s) => {
  for (let e of selectedLines(s)) {
    let r = foldable(s.state, e.from, e.to);
    if (r)
      return s.dispatch({ effects: maybeEnable(s.state, [foldEffect.of(r), announceFold(s, r)]) }), !0;
  }
  return !1;
}, unfoldCode = (s) => {
  if (!s.state.field(foldState, !1))
    return !1;
  let e = [];
  for (let r of selectedLines(s)) {
    let R = findFold(s.state, r.from, r.to);
    R && e.push(unfoldEffect.of(R), announceFold(s, R, !1));
  }
  return e.length && s.dispatch({ effects: e }), e.length > 0;
};
function announceFold(s, e, r = !0) {
  let R = s.state.doc.lineAt(e.from).number, B = s.state.doc.lineAt(e.to).number;
  return EditorView.announce.of(`${s.state.phrase(r ? "Folded lines" : "Unfolded lines")} ${R} ${s.state.phrase("to")} ${B}.`);
}
const foldAll = (s) => {
  let { state: e } = s, r = [];
  for (let R = 0; R < e.doc.length; ) {
    let B = s.lineBlockAt(R), _ = foldable(e, B.from, B.to);
    _ && r.push(foldEffect.of(_)), R = (_ ? s.lineBlockAt(_.to) : B).to + 1;
  }
  return r.length && s.dispatch({ effects: maybeEnable(s.state, r) }), !!r.length;
}, unfoldAll = (s) => {
  let e = s.state.field(foldState, !1);
  if (!e || !e.size)
    return !1;
  let r = [];
  return e.between(0, s.state.doc.length, (R, B) => {
    r.push(unfoldEffect.of({ from: R, to: B }));
  }), s.dispatch({ effects: r }), !0;
}, foldKeymap = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: foldCode },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: unfoldCode },
  { key: "Ctrl-Alt-[", run: foldAll },
  { key: "Ctrl-Alt-]", run: unfoldAll }
], defaultConfig = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, foldConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, defaultConfig);
  }
});
function codeFolding(s) {
  return [foldState, baseTheme$1$2];
}
function widgetToDOM(s, e) {
  let { state: r } = s, R = r.facet(foldConfig), B = ($) => {
    let F = s.lineBlockAt(s.posAtDOM($.target)), V = findFold(s.state, F.from, F.to);
    V && s.dispatch({ effects: unfoldEffect.of(V) }), $.preventDefault();
  };
  if (R.placeholderDOM)
    return R.placeholderDOM(s, B, e);
  let _ = document.createElement("span");
  return _.textContent = R.placeholderText, _.setAttribute("aria-label", r.phrase("folded code")), _.title = r.phrase("unfold"), _.className = "cm-foldPlaceholder", _.onclick = B, _;
}
const foldWidget = /* @__PURE__ */ Decoration.replace({ widget: /* @__PURE__ */ new class extends WidgetType {
  toDOM(s) {
    return widgetToDOM(s, null);
  }
}() });
class PreparedFoldWidget extends WidgetType {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return widgetToDOM(e, this.value);
  }
}
const foldGutterDefaults = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class FoldMarker extends GutterMarker {
  constructor(e, r) {
    super(), this.config = e, this.open = r;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let r = document.createElement("span");
    return r.textContent = this.open ? this.config.openText : this.config.closedText, r.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), r;
  }
}
function foldGutter(s = {}) {
  let e = Object.assign(Object.assign({}, foldGutterDefaults), s), r = new FoldMarker(e, !0), R = new FoldMarker(e, !1), B = ViewPlugin.fromClass(class {
    constructor($) {
      this.from = $.viewport.from, this.markers = this.buildMarkers($);
    }
    update($) {
      ($.docChanged || $.viewportChanged || $.startState.facet(language) != $.state.facet(language) || $.startState.field(foldState, !1) != $.state.field(foldState, !1) || syntaxTree($.startState) != syntaxTree($.state) || e.foldingChanged($)) && (this.markers = this.buildMarkers($.view));
    }
    buildMarkers($) {
      let F = new RangeSetBuilder();
      for (let V of $.viewportLineBlocks) {
        let H = findFold($.state, V.from, V.to) ? R : foldable($.state, V.from, V.to) ? r : null;
        H && F.add(V.from, V.from, H);
      }
      return F.finish();
    }
  }), { domEventHandlers: _ } = e;
  return [
    B,
    gutter({
      class: "cm-foldGutter",
      markers($) {
        var F;
        return ((F = $.plugin(B)) === null || F === void 0 ? void 0 : F.markers) || RangeSet.empty;
      },
      initialSpacer() {
        return new FoldMarker(e, !1);
      },
      domEventHandlers: Object.assign(Object.assign({}, _), { click: ($, F, V) => {
        if (_.click && _.click($, F, V))
          return !0;
        let H = findFold($.state, F.from, F.to);
        if (H)
          return $.dispatch({ effects: unfoldEffect.of(H) }), !0;
        let W = foldable($.state, F.from, F.to);
        return W ? ($.dispatch({ effects: foldEffect.of(W) }), !0) : !1;
      } })
    }),
    codeFolding()
  ];
}
const baseTheme$1$2 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class HighlightStyle {
  constructor(e, r) {
    this.specs = e;
    let R;
    function B(F) {
      let V = StyleModule.newName();
      return (R || (R = /* @__PURE__ */ Object.create(null)))["." + V] = F, V;
    }
    const _ = typeof r.all == "string" ? r.all : r.all ? B(r.all) : void 0, $ = r.scope;
    this.scope = $ instanceof Language ? (F) => F.prop(languageDataProp) == $.data : $ ? (F) => F == $ : void 0, this.style = tagHighlighter(e.map((F) => ({
      tag: F.tag,
      class: F.class || B(Object.assign({}, F, { tag: null }))
    })), {
      all: _
    }).style, this.module = R ? new StyleModule(R) : null, this.themeType = r.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, r) {
    return new HighlightStyle(e, r || {});
  }
}
const highlighterFacet = /* @__PURE__ */ Facet.define(), fallbackHighlighter = /* @__PURE__ */ Facet.define({
  combine(s) {
    return s.length ? [s[0]] : null;
  }
});
function getHighlighters(s) {
  let e = s.facet(highlighterFacet);
  return e.length ? e : s.facet(fallbackHighlighter);
}
function syntaxHighlighting(s, e) {
  let r = [treeHighlighter], R;
  return s instanceof HighlightStyle && (s.module && r.push(EditorView.styleModule.of(s.module)), R = s.themeType), e != null && e.fallback ? r.push(fallbackHighlighter.of(s)) : R ? r.push(highlighterFacet.computeN([EditorView.darkTheme], (B) => B.facet(EditorView.darkTheme) == (R == "dark") ? [s] : [])) : r.push(highlighterFacet.of(s)), r;
}
class TreeHighlighter {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = syntaxTree(e.state), this.decorations = this.buildDeco(e, getHighlighters(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let r = syntaxTree(e.state), R = getHighlighters(e.state), B = R != getHighlighters(e.startState), { viewport: _ } = e.view, $ = e.changes.mapPos(this.decoratedTo, 1);
    r.length < _.to && !B && r.type == this.tree.type && $ >= _.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = $) : (r != this.tree || e.viewportChanged || B) && (this.tree = r, this.decorations = this.buildDeco(e.view, R), this.decoratedTo = _.to);
  }
  buildDeco(e, r) {
    if (!r || !this.tree.length)
      return Decoration.none;
    let R = new RangeSetBuilder();
    for (let { from: B, to: _ } of e.visibleRanges)
      highlightTree(this.tree, r, ($, F, V) => {
        R.add($, F, this.markCache[V] || (this.markCache[V] = Decoration.mark({ class: V })));
      }, B, _);
    return R.finish();
  }
}
const treeHighlighter = /* @__PURE__ */ Prec.high(/* @__PURE__ */ ViewPlugin.fromClass(TreeHighlighter, {
  decorations: (s) => s.decorations
})), defaultHighlightStyle = /* @__PURE__ */ HighlightStyle.define([
  {
    tag: tags.meta,
    color: "#404740"
  },
  {
    tag: tags.link,
    textDecoration: "underline"
  },
  {
    tag: tags.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: tags.emphasis,
    fontStyle: "italic"
  },
  {
    tag: tags.strong,
    fontWeight: "bold"
  },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: tags.keyword,
    color: "#708"
  },
  {
    tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
    color: "#219"
  },
  {
    tag: [tags.literal, tags.inserted],
    color: "#164"
  },
  {
    tag: [tags.string, tags.deleted],
    color: "#a11"
  },
  {
    tag: [tags.regexp, tags.escape, /* @__PURE__ */ tags.special(tags.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ tags.definition(tags.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ tags.local(tags.variableName),
    color: "#30a"
  },
  {
    tag: [tags.typeName, tags.namespace],
    color: "#085"
  },
  {
    tag: tags.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ tags.special(tags.variableName), tags.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ tags.definition(tags.propertyName),
    color: "#00c"
  },
  {
    tag: tags.comment,
    color: "#940"
  },
  {
    tag: tags.invalid,
    color: "#f00"
  }
]), baseTheme$3 = /* @__PURE__ */ EditorView.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), DefaultScanDist = 1e4, DefaultBrackets = "()[]{}", bracketMatchingConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, {
      afterCursor: !0,
      brackets: DefaultBrackets,
      maxScanDistance: DefaultScanDist,
      renderMatch: defaultRenderMatch
    });
  }
}), matchingMark = /* @__PURE__ */ Decoration.mark({ class: "cm-matchingBracket" }), nonmatchingMark = /* @__PURE__ */ Decoration.mark({ class: "cm-nonmatchingBracket" });
function defaultRenderMatch(s) {
  let e = [], r = s.matched ? matchingMark : nonmatchingMark;
  return e.push(r.range(s.start.from, s.start.to)), s.end && e.push(r.range(s.end.from, s.end.to)), e;
}
const bracketMatchingState = /* @__PURE__ */ StateField.define({
  create() {
    return Decoration.none;
  },
  update(s, e) {
    if (!e.docChanged && !e.selection)
      return s;
    let r = [], R = e.state.facet(bracketMatchingConfig);
    for (let B of e.state.selection.ranges) {
      if (!B.empty)
        continue;
      let _ = matchBrackets(e.state, B.head, -1, R) || B.head > 0 && matchBrackets(e.state, B.head - 1, 1, R) || R.afterCursor && (matchBrackets(e.state, B.head, 1, R) || B.head < e.state.doc.length && matchBrackets(e.state, B.head + 1, -1, R));
      _ && (r = r.concat(R.renderMatch(_, e.state)));
    }
    return Decoration.set(r, !0);
  },
  provide: (s) => EditorView.decorations.from(s)
}), bracketMatchingUnique = [
  bracketMatchingState,
  baseTheme$3
];
function bracketMatching(s = {}) {
  return [bracketMatchingConfig.of(s), bracketMatchingUnique];
}
const bracketMatchingHandle = /* @__PURE__ */ new NodeProp();
function matchingNodes(s, e, r) {
  let R = s.prop(e < 0 ? NodeProp.openedBy : NodeProp.closedBy);
  if (R)
    return R;
  if (s.name.length == 1) {
    let B = r.indexOf(s.name);
    if (B > -1 && B % 2 == (e < 0 ? 1 : 0))
      return [r[B + e]];
  }
  return null;
}
function findHandle(s) {
  let e = s.type.prop(bracketMatchingHandle);
  return e ? e(s.node) : s;
}
function matchBrackets(s, e, r, R = {}) {
  let B = R.maxScanDistance || DefaultScanDist, _ = R.brackets || DefaultBrackets, $ = syntaxTree(s), F = $.resolveInner(e, r);
  for (let V = F; V; V = V.parent) {
    let H = matchingNodes(V.type, r, _);
    if (H && V.from < V.to) {
      let W = findHandle(V);
      if (W && (r > 0 ? e >= W.from && e < W.to : e > W.from && e <= W.to))
        return matchMarkedBrackets(s, e, r, V, W, H, _);
    }
  }
  return matchPlainBrackets(s, e, r, $, F.type, B, _);
}
function matchMarkedBrackets(s, e, r, R, B, _, $) {
  let F = R.parent, V = { from: B.from, to: B.to }, H = 0, W = F == null ? void 0 : F.cursor();
  if (W && (r < 0 ? W.childBefore(R.from) : W.childAfter(R.to)))
    do
      if (r < 0 ? W.to <= R.from : W.from >= R.to) {
        if (H == 0 && _.indexOf(W.type.name) > -1 && W.from < W.to) {
          let U = findHandle(W);
          return { start: V, end: U ? { from: U.from, to: U.to } : void 0, matched: !0 };
        } else if (matchingNodes(W.type, r, $))
          H++;
        else if (matchingNodes(W.type, -r, $)) {
          if (H == 0) {
            let U = findHandle(W);
            return {
              start: V,
              end: U && U.from < U.to ? { from: U.from, to: U.to } : void 0,
              matched: !1
            };
          }
          H--;
        }
      }
    while (r < 0 ? W.prevSibling() : W.nextSibling());
  return { start: V, matched: !1 };
}
function matchPlainBrackets(s, e, r, R, B, _, $) {
  let F = r < 0 ? s.sliceDoc(e - 1, e) : s.sliceDoc(e, e + 1), V = $.indexOf(F);
  if (V < 0 || V % 2 == 0 != r > 0)
    return null;
  let H = { from: r < 0 ? e - 1 : e, to: r > 0 ? e + 1 : e }, W = s.doc.iterRange(e, r > 0 ? s.doc.length : 0), U = 0;
  for (let z = 0; !W.next().done && z <= _; ) {
    let K = W.value;
    r < 0 && (z += K.length);
    let X = e + z * r;
    for (let Z = r > 0 ? 0 : K.length - 1, Y = r > 0 ? K.length : -1; Z != Y; Z += r) {
      let te = $.indexOf(K[Z]);
      if (!(te < 0 || R.resolveInner(X + Z, 1).type != B))
        if (te % 2 == 0 == r > 0)
          U++;
        else {
          if (U == 1)
            return { start: H, end: { from: X + Z, to: X + Z + 1 }, matched: te >> 1 == V >> 1 };
          U--;
        }
    }
    r > 0 && (z += K.length);
  }
  return W.done ? { start: H, matched: !1 } : null;
}
const noTokens = /* @__PURE__ */ Object.create(null), typeArray = [NodeType.none], warned = [], byTag = /* @__PURE__ */ Object.create(null), defaultTable = /* @__PURE__ */ Object.create(null);
for (let [s, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  defaultTable[s] = /* @__PURE__ */ createTokenType(noTokens, e);
function warnForPart(s, e) {
  warned.indexOf(s) > -1 || (warned.push(s), console.warn(e));
}
function createTokenType(s, e) {
  let r = [];
  for (let F of e.split(" ")) {
    let V = [];
    for (let H of F.split(".")) {
      let W = s[H] || tags[H];
      W ? typeof W == "function" ? V.length ? V = V.map(W) : warnForPart(H, `Modifier ${H} used at start of tag`) : V.length ? warnForPart(H, `Tag ${H} used as modifier`) : V = Array.isArray(W) ? W : [W] : warnForPart(H, `Unknown highlighting tag ${H}`);
    }
    for (let H of V)
      r.push(H);
  }
  if (!r.length)
    return 0;
  let R = e.replace(/ /g, "_"), B = R + " " + r.map((F) => F.id), _ = byTag[B];
  if (_)
    return _.id;
  let $ = byTag[B] = NodeType.define({
    id: typeArray.length,
    name: R,
    props: [styleTags({ [R]: r })]
  });
  return typeArray.push($), $.id;
}
Direction.RTL, Direction.LTR;
const toggleComment = (s) => {
  let { state: e } = s, r = e.doc.lineAt(e.selection.main.from), R = getConfig(s.state, r.from);
  return R.line ? toggleLineComment(s) : R.block ? toggleBlockCommentByLine(s) : !1;
};
function command(s, e) {
  return ({ state: r, dispatch: R }) => {
    if (r.readOnly)
      return !1;
    let B = s(e, r);
    return B ? (R(r.update(B)), !0) : !1;
  };
}
const toggleLineComment = /* @__PURE__ */ command(
  changeLineComment,
  0
  /* CommentOption.Toggle */
), toggleBlockComment = /* @__PURE__ */ command(
  changeBlockComment,
  0
  /* CommentOption.Toggle */
), toggleBlockCommentByLine = /* @__PURE__ */ command(
  (s, e) => changeBlockComment(s, e, selectedLineRanges(e)),
  0
  /* CommentOption.Toggle */
);
function getConfig(s, e) {
  let r = s.languageDataAt("commentTokens", e);
  return r.length ? r[0] : {};
}
const SearchMargin = 50;
function findBlockComment(s, { open: e, close: r }, R, B) {
  let _ = s.sliceDoc(R - SearchMargin, R), $ = s.sliceDoc(B, B + SearchMargin), F = /\s*$/.exec(_)[0].length, V = /^\s*/.exec($)[0].length, H = _.length - F;
  if (_.slice(H - e.length, H) == e && $.slice(V, V + r.length) == r)
    return {
      open: { pos: R - F, margin: F && 1 },
      close: { pos: B + V, margin: V && 1 }
    };
  let W, U;
  B - R <= 2 * SearchMargin ? W = U = s.sliceDoc(R, B) : (W = s.sliceDoc(R, R + SearchMargin), U = s.sliceDoc(B - SearchMargin, B));
  let z = /^\s*/.exec(W)[0].length, K = /\s*$/.exec(U)[0].length, X = U.length - K - r.length;
  return W.slice(z, z + e.length) == e && U.slice(X, X + r.length) == r ? {
    open: {
      pos: R + z + e.length,
      margin: /\s/.test(W.charAt(z + e.length)) ? 1 : 0
    },
    close: {
      pos: B - K - r.length,
      margin: /\s/.test(U.charAt(X - 1)) ? 1 : 0
    }
  } : null;
}
function selectedLineRanges(s) {
  let e = [];
  for (let r of s.selection.ranges) {
    let R = s.doc.lineAt(r.from), B = r.to <= R.to ? R : s.doc.lineAt(r.to);
    B.from > R.from && B.from == r.to && (B = r.to == R.to + 1 ? R : s.doc.lineAt(r.to - 1));
    let _ = e.length - 1;
    _ >= 0 && e[_].to > R.from ? e[_].to = B.to : e.push({ from: R.from + /^\s*/.exec(R.text)[0].length, to: B.to });
  }
  return e;
}
function changeBlockComment(s, e, r = e.selection.ranges) {
  let R = r.map((_) => getConfig(e, _.from).block);
  if (!R.every((_) => _))
    return null;
  let B = r.map((_, $) => findBlockComment(e, R[$], _.from, _.to));
  if (s != 2 && !B.every((_) => _))
    return { changes: e.changes(r.map((_, $) => B[$] ? [] : [{ from: _.from, insert: R[$].open + " " }, { from: _.to, insert: " " + R[$].close }])) };
  if (s != 1 && B.some((_) => _)) {
    let _ = [];
    for (let $ = 0, F; $ < B.length; $++)
      if (F = B[$]) {
        let V = R[$], { open: H, close: W } = F;
        _.push({ from: H.pos - V.open.length, to: H.pos + H.margin }, { from: W.pos - W.margin, to: W.pos + V.close.length });
      }
    return { changes: _ };
  }
  return null;
}
function changeLineComment(s, e, r = e.selection.ranges) {
  let R = [], B = -1;
  for (let { from: _, to: $ } of r) {
    let F = R.length, V = 1e9, H = getConfig(e, _).line;
    if (H) {
      for (let W = _; W <= $; ) {
        let U = e.doc.lineAt(W);
        if (U.from > B && (_ == $ || $ > U.from)) {
          B = U.from;
          let z = /^\s*/.exec(U.text)[0].length, K = z == U.length, X = U.text.slice(z, z + H.length) == H ? z : -1;
          z < U.text.length && z < V && (V = z), R.push({ line: U, comment: X, token: H, indent: z, empty: K, single: !1 });
        }
        W = U.to + 1;
      }
      if (V < 1e9)
        for (let W = F; W < R.length; W++)
          R[W].indent < R[W].line.text.length && (R[W].indent = V);
      R.length == F + 1 && (R[F].single = !0);
    }
  }
  if (s != 2 && R.some((_) => _.comment < 0 && (!_.empty || _.single))) {
    let _ = [];
    for (let { line: F, token: V, indent: H, empty: W, single: U } of R)
      (U || !W) && _.push({ from: F.from + H, insert: V + " " });
    let $ = e.changes(_);
    return { changes: $, selection: e.selection.map($, 1) };
  } else if (s != 1 && R.some((_) => _.comment >= 0)) {
    let _ = [];
    for (let { line: $, comment: F, token: V } of R)
      if (F >= 0) {
        let H = $.from + F, W = H + V.length;
        $.text[W - $.from] == " " && W++, _.push({ from: H, to: W });
      }
    return { changes: _ };
  }
  return null;
}
const fromHistory = /* @__PURE__ */ Annotation.define(), isolateHistory = /* @__PURE__ */ Annotation.define(), invertedEffects = /* @__PURE__ */ Facet.define(), historyConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, r) => r
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, r) => (R, B) => e(R, B) || r(R, B)
    });
  }
}), historyField_ = /* @__PURE__ */ StateField.define({
  create() {
    return HistoryState.empty;
  },
  update(s, e) {
    let r = e.state.facet(historyConfig), R = e.annotation(fromHistory);
    if (R) {
      let V = HistEvent.fromTransaction(e, R.selection), H = R.side, W = H == 0 ? s.undone : s.done;
      return V ? W = updateBranch(W, W.length, r.minDepth, V) : W = addSelection(W, e.startState.selection), new HistoryState(H == 0 ? R.rest : W, H == 0 ? W : R.rest);
    }
    let B = e.annotation(isolateHistory);
    if ((B == "full" || B == "before") && (s = s.isolate()), e.annotation(Transaction.addToHistory) === !1)
      return e.changes.empty ? s : s.addMapping(e.changes.desc);
    let _ = HistEvent.fromTransaction(e), $ = e.annotation(Transaction.time), F = e.annotation(Transaction.userEvent);
    return _ ? s = s.addChanges(_, $, F, r, e) : e.selection && (s = s.addSelection(e.startState.selection, $, F, r.newGroupDelay)), (B == "full" || B == "after") && (s = s.isolate()), s;
  },
  toJSON(s) {
    return { done: s.done.map((e) => e.toJSON()), undone: s.undone.map((e) => e.toJSON()) };
  },
  fromJSON(s) {
    return new HistoryState(s.done.map(HistEvent.fromJSON), s.undone.map(HistEvent.fromJSON));
  }
});
function history(s = {}) {
  return [
    historyField_,
    historyConfig.of(s),
    EditorView.domEventHandlers({
      beforeinput(e, r) {
        let R = e.inputType == "historyUndo" ? undo : e.inputType == "historyRedo" ? redo : null;
        return R ? (e.preventDefault(), R(r)) : !1;
      }
    })
  ];
}
function cmd(s, e) {
  return function({ state: r, dispatch: R }) {
    if (!e && r.readOnly)
      return !1;
    let B = r.field(historyField_, !1);
    if (!B)
      return !1;
    let _ = B.pop(s, r, e);
    return _ ? (R(_), !0) : !1;
  };
}
const undo = /* @__PURE__ */ cmd(0, !1), redo = /* @__PURE__ */ cmd(1, !1), undoSelection = /* @__PURE__ */ cmd(0, !0), redoSelection = /* @__PURE__ */ cmd(1, !0);
class HistEvent {
  constructor(e, r, R, B, _) {
    this.changes = e, this.effects = r, this.mapped = R, this.startSelection = B, this.selectionsAfter = _;
  }
  setSelAfter(e) {
    return new HistEvent(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, r, R;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (r = this.mapped) === null || r === void 0 ? void 0 : r.toJSON(),
      startSelection: (R = this.startSelection) === null || R === void 0 ? void 0 : R.toJSON(),
      selectionsAfter: this.selectionsAfter.map((B) => B.toJSON())
    };
  }
  static fromJSON(e) {
    return new HistEvent(e.changes && ChangeSet.fromJSON(e.changes), [], e.mapped && ChangeDesc.fromJSON(e.mapped), e.startSelection && EditorSelection.fromJSON(e.startSelection), e.selectionsAfter.map(EditorSelection.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, r) {
    let R = none$1;
    for (let B of e.startState.facet(invertedEffects)) {
      let _ = B(e);
      _.length && (R = R.concat(_));
    }
    return !R.length && e.changes.empty ? null : new HistEvent(e.changes.invert(e.startState.doc), R, void 0, r || e.startState.selection, none$1);
  }
  static selection(e) {
    return new HistEvent(void 0, none$1, void 0, void 0, e);
  }
}
function updateBranch(s, e, r, R) {
  let B = e + 1 > r + 20 ? e - r - 1 : 0, _ = s.slice(B, e);
  return _.push(R), _;
}
function isAdjacent(s, e) {
  let r = [], R = !1;
  return s.iterChangedRanges((B, _) => r.push(B, _)), e.iterChangedRanges((B, _, $, F) => {
    for (let V = 0; V < r.length; ) {
      let H = r[V++], W = r[V++];
      F >= H && $ <= W && (R = !0);
    }
  }), R;
}
function eqSelectionShape(s, e) {
  return s.ranges.length == e.ranges.length && s.ranges.filter((r, R) => r.empty != e.ranges[R].empty).length === 0;
}
function conc(s, e) {
  return s.length ? e.length ? s.concat(e) : s : e;
}
const none$1 = [], MaxSelectionsPerEvent = 200;
function addSelection(s, e) {
  if (s.length) {
    let r = s[s.length - 1], R = r.selectionsAfter.slice(Math.max(0, r.selectionsAfter.length - MaxSelectionsPerEvent));
    return R.length && R[R.length - 1].eq(e) ? s : (R.push(e), updateBranch(s, s.length - 1, 1e9, r.setSelAfter(R)));
  } else
    return [HistEvent.selection([e])];
}
function popSelection(s) {
  let e = s[s.length - 1], r = s.slice();
  return r[s.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), r;
}
function addMappingToBranch(s, e) {
  if (!s.length)
    return s;
  let r = s.length, R = none$1;
  for (; r; ) {
    let B = mapEvent(s[r - 1], e, R);
    if (B.changes && !B.changes.empty || B.effects.length) {
      let _ = s.slice(0, r);
      return _[r - 1] = B, _;
    } else
      e = B.mapped, r--, R = B.selectionsAfter;
  }
  return R.length ? [HistEvent.selection(R)] : none$1;
}
function mapEvent(s, e, r) {
  let R = conc(s.selectionsAfter.length ? s.selectionsAfter.map((F) => F.map(e)) : none$1, r);
  if (!s.changes)
    return HistEvent.selection(R);
  let B = s.changes.map(e), _ = e.mapDesc(s.changes, !0), $ = s.mapped ? s.mapped.composeDesc(_) : _;
  return new HistEvent(B, StateEffect.mapEffects(s.effects, e), $, s.startSelection.map(_), R);
}
const joinableUserEvent = /^(input\.type|delete)($|\.)/;
class HistoryState {
  constructor(e, r, R = 0, B = void 0) {
    this.done = e, this.undone = r, this.prevTime = R, this.prevUserEvent = B;
  }
  isolate() {
    return this.prevTime ? new HistoryState(this.done, this.undone) : this;
  }
  addChanges(e, r, R, B, _) {
    let $ = this.done, F = $[$.length - 1];
    return F && F.changes && !F.changes.empty && e.changes && (!R || joinableUserEvent.test(R)) && (!F.selectionsAfter.length && r - this.prevTime < B.newGroupDelay && B.joinToEvent(_, isAdjacent(F.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    R == "input.type.compose") ? $ = updateBranch($, $.length - 1, B.minDepth, new HistEvent(e.changes.compose(F.changes), conc(StateEffect.mapEffects(e.effects, F.changes), F.effects), F.mapped, F.startSelection, none$1)) : $ = updateBranch($, $.length, B.minDepth, e), new HistoryState($, none$1, r, R);
  }
  addSelection(e, r, R, B) {
    let _ = this.done.length ? this.done[this.done.length - 1].selectionsAfter : none$1;
    return _.length > 0 && r - this.prevTime < B && R == this.prevUserEvent && R && /^select($|\.)/.test(R) && eqSelectionShape(_[_.length - 1], e) ? this : new HistoryState(addSelection(this.done, e), this.undone, r, R);
  }
  addMapping(e) {
    return new HistoryState(addMappingToBranch(this.done, e), addMappingToBranch(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, r, R) {
    let B = e == 0 ? this.done : this.undone;
    if (B.length == 0)
      return null;
    let _ = B[B.length - 1], $ = _.selectionsAfter[0] || r.selection;
    if (R && _.selectionsAfter.length)
      return r.update({
        selection: _.selectionsAfter[_.selectionsAfter.length - 1],
        annotations: fromHistory.of({ side: e, rest: popSelection(B), selection: $ }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (_.changes) {
      let F = B.length == 1 ? none$1 : B.slice(0, B.length - 1);
      return _.mapped && (F = addMappingToBranch(F, _.mapped)), r.update({
        changes: _.changes,
        selection: _.startSelection,
        effects: _.effects,
        annotations: fromHistory.of({ side: e, rest: F, selection: $ }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
HistoryState.empty = /* @__PURE__ */ new HistoryState(none$1, none$1);
const historyKeymap = [
  { key: "Mod-z", run: undo, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: redo, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: redo, preventDefault: !0 },
  { key: "Mod-u", run: undoSelection, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: redoSelection, preventDefault: !0 }
];
function updateSel(s, e) {
  return EditorSelection.create(s.ranges.map(e), s.mainIndex);
}
function setSel(s, e) {
  return s.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function moveSel({ state: s, dispatch: e }, r) {
  let R = updateSel(s.selection, r);
  return R.eq(s.selection, !0) ? !1 : (e(setSel(s, R)), !0);
}
function rangeEnd(s, e) {
  return EditorSelection.cursor(e ? s.to : s.from);
}
function cursorByChar(s, e) {
  return moveSel(s, (r) => r.empty ? s.moveByChar(r, e) : rangeEnd(r, e));
}
function ltrAtCursor(s) {
  return s.textDirectionAt(s.state.selection.main.head) == Direction.LTR;
}
const cursorCharLeft = (s) => cursorByChar(s, !ltrAtCursor(s)), cursorCharRight = (s) => cursorByChar(s, ltrAtCursor(s));
function cursorByGroup(s, e) {
  return moveSel(s, (r) => r.empty ? s.moveByGroup(r, e) : rangeEnd(r, e));
}
const cursorGroupLeft = (s) => cursorByGroup(s, !ltrAtCursor(s)), cursorGroupRight = (s) => cursorByGroup(s, ltrAtCursor(s));
function interestingNode(s, e, r) {
  if (e.type.prop(r))
    return !0;
  let R = e.to - e.from;
  return R && (R > 2 || /[^\s,.;:]/.test(s.sliceDoc(e.from, e.to))) || e.firstChild;
}
function moveBySyntax(s, e, r) {
  let R = syntaxTree(s).resolveInner(e.head), B = r ? NodeProp.closedBy : NodeProp.openedBy;
  for (let V = e.head; ; ) {
    let H = r ? R.childAfter(V) : R.childBefore(V);
    if (!H)
      break;
    interestingNode(s, H, B) ? R = H : V = r ? H.to : H.from;
  }
  let _ = R.type.prop(B), $, F;
  return _ && ($ = r ? matchBrackets(s, R.from, 1) : matchBrackets(s, R.to, -1)) && $.matched ? F = r ? $.end.to : $.end.from : F = r ? R.to : R.from, EditorSelection.cursor(F, r ? -1 : 1);
}
const cursorSyntaxLeft = (s) => moveSel(s, (e) => moveBySyntax(s.state, e, !ltrAtCursor(s))), cursorSyntaxRight = (s) => moveSel(s, (e) => moveBySyntax(s.state, e, ltrAtCursor(s)));
function cursorByLine(s, e) {
  return moveSel(s, (r) => {
    if (!r.empty)
      return rangeEnd(r, e);
    let R = s.moveVertically(r, e);
    return R.head != r.head ? R : s.moveToLineBoundary(r, e);
  });
}
const cursorLineUp = (s) => cursorByLine(s, !1), cursorLineDown = (s) => cursorByLine(s, !0);
function pageInfo(s) {
  let e = s.scrollDOM.clientHeight < s.scrollDOM.scrollHeight - 2, r = 0, R = 0, B;
  if (e) {
    for (let _ of s.state.facet(EditorView.scrollMargins)) {
      let $ = _(s);
      $ != null && $.top && (r = Math.max($ == null ? void 0 : $.top, r)), $ != null && $.bottom && (R = Math.max($ == null ? void 0 : $.bottom, R));
    }
    B = s.scrollDOM.clientHeight - r - R;
  } else
    B = (s.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: r,
    marginBottom: R,
    selfScroll: e,
    height: Math.max(s.defaultLineHeight, B - 5)
  };
}
function cursorByPage(s, e) {
  let r = pageInfo(s), { state: R } = s, B = updateSel(R.selection, ($) => $.empty ? s.moveVertically($, e, r.height) : rangeEnd($, e));
  if (B.eq(R.selection))
    return !1;
  let _;
  if (r.selfScroll) {
    let $ = s.coordsAtPos(R.selection.main.head), F = s.scrollDOM.getBoundingClientRect(), V = F.top + r.marginTop, H = F.bottom - r.marginBottom;
    $ && $.top > V && $.bottom < H && (_ = EditorView.scrollIntoView(B.main.head, { y: "start", yMargin: $.top - V }));
  }
  return s.dispatch(setSel(R, B), { effects: _ }), !0;
}
const cursorPageUp = (s) => cursorByPage(s, !1), cursorPageDown = (s) => cursorByPage(s, !0);
function moveByLineBoundary(s, e, r) {
  let R = s.lineBlockAt(e.head), B = s.moveToLineBoundary(e, r);
  if (B.head == e.head && B.head != (r ? R.to : R.from) && (B = s.moveToLineBoundary(e, r, !1)), !r && B.head == R.from && R.length) {
    let _ = /^\s*/.exec(s.state.sliceDoc(R.from, Math.min(R.from + 100, R.to)))[0].length;
    _ && e.head != R.from + _ && (B = EditorSelection.cursor(R.from + _));
  }
  return B;
}
const cursorLineBoundaryForward = (s) => moveSel(s, (e) => moveByLineBoundary(s, e, !0)), cursorLineBoundaryBackward = (s) => moveSel(s, (e) => moveByLineBoundary(s, e, !1)), cursorLineBoundaryLeft = (s) => moveSel(s, (e) => moveByLineBoundary(s, e, !ltrAtCursor(s))), cursorLineBoundaryRight = (s) => moveSel(s, (e) => moveByLineBoundary(s, e, ltrAtCursor(s))), cursorLineStart = (s) => moveSel(s, (e) => EditorSelection.cursor(s.lineBlockAt(e.head).from, 1)), cursorLineEnd = (s) => moveSel(s, (e) => EditorSelection.cursor(s.lineBlockAt(e.head).to, -1));
function toMatchingBracket(s, e, r) {
  let R = !1, B = updateSel(s.selection, (_) => {
    let $ = matchBrackets(s, _.head, -1) || matchBrackets(s, _.head, 1) || _.head > 0 && matchBrackets(s, _.head - 1, 1) || _.head < s.doc.length && matchBrackets(s, _.head + 1, -1);
    if (!$ || !$.end)
      return _;
    R = !0;
    let F = $.start.from == _.head ? $.end.to : $.end.from;
    return EditorSelection.cursor(F);
  });
  return R ? (e(setSel(s, B)), !0) : !1;
}
const cursorMatchingBracket = ({ state: s, dispatch: e }) => toMatchingBracket(s, e);
function extendSel(s, e) {
  let r = updateSel(s.state.selection, (R) => {
    let B = e(R);
    return EditorSelection.range(R.anchor, B.head, B.goalColumn, B.bidiLevel || void 0);
  });
  return r.eq(s.state.selection) ? !1 : (s.dispatch(setSel(s.state, r)), !0);
}
function selectByChar(s, e) {
  return extendSel(s, (r) => s.moveByChar(r, e));
}
const selectCharLeft = (s) => selectByChar(s, !ltrAtCursor(s)), selectCharRight = (s) => selectByChar(s, ltrAtCursor(s));
function selectByGroup(s, e) {
  return extendSel(s, (r) => s.moveByGroup(r, e));
}
const selectGroupLeft = (s) => selectByGroup(s, !ltrAtCursor(s)), selectGroupRight = (s) => selectByGroup(s, ltrAtCursor(s)), selectSyntaxLeft = (s) => extendSel(s, (e) => moveBySyntax(s.state, e, !ltrAtCursor(s))), selectSyntaxRight = (s) => extendSel(s, (e) => moveBySyntax(s.state, e, ltrAtCursor(s)));
function selectByLine(s, e) {
  return extendSel(s, (r) => s.moveVertically(r, e));
}
const selectLineUp = (s) => selectByLine(s, !1), selectLineDown = (s) => selectByLine(s, !0);
function selectByPage(s, e) {
  return extendSel(s, (r) => s.moveVertically(r, e, pageInfo(s).height));
}
const selectPageUp = (s) => selectByPage(s, !1), selectPageDown = (s) => selectByPage(s, !0), selectLineBoundaryForward = (s) => extendSel(s, (e) => moveByLineBoundary(s, e, !0)), selectLineBoundaryBackward = (s) => extendSel(s, (e) => moveByLineBoundary(s, e, !1)), selectLineBoundaryLeft = (s) => extendSel(s, (e) => moveByLineBoundary(s, e, !ltrAtCursor(s))), selectLineBoundaryRight = (s) => extendSel(s, (e) => moveByLineBoundary(s, e, ltrAtCursor(s))), selectLineStart = (s) => extendSel(s, (e) => EditorSelection.cursor(s.lineBlockAt(e.head).from)), selectLineEnd = (s) => extendSel(s, (e) => EditorSelection.cursor(s.lineBlockAt(e.head).to)), cursorDocStart = ({ state: s, dispatch: e }) => (e(setSel(s, { anchor: 0 })), !0), cursorDocEnd = ({ state: s, dispatch: e }) => (e(setSel(s, { anchor: s.doc.length })), !0), selectDocStart = ({ state: s, dispatch: e }) => (e(setSel(s, { anchor: s.selection.main.anchor, head: 0 })), !0), selectDocEnd = ({ state: s, dispatch: e }) => (e(setSel(s, { anchor: s.selection.main.anchor, head: s.doc.length })), !0), selectAll = ({ state: s, dispatch: e }) => (e(s.update({ selection: { anchor: 0, head: s.doc.length }, userEvent: "select" })), !0), selectLine = ({ state: s, dispatch: e }) => {
  let r = selectedLineBlocks(s).map(({ from: R, to: B }) => EditorSelection.range(R, Math.min(B + 1, s.doc.length)));
  return e(s.update({ selection: EditorSelection.create(r), userEvent: "select" })), !0;
}, selectParentSyntax = ({ state: s, dispatch: e }) => {
  let r = updateSel(s.selection, (R) => {
    let B = syntaxTree(s), _ = B.resolveStack(R.from, 1);
    if (R.empty) {
      let $ = B.resolveStack(R.from, -1);
      $.node.from >= _.node.from && $.node.to <= _.node.to && (_ = $);
    }
    for (let $ = _; $; $ = $.next) {
      let { node: F } = $;
      if ((F.from < R.from && F.to >= R.to || F.to > R.to && F.from <= R.from) && $.next)
        return EditorSelection.range(F.to, F.from);
    }
    return R;
  });
  return r.eq(s.selection) ? !1 : (e(setSel(s, r)), !0);
}, simplifySelection = ({ state: s, dispatch: e }) => {
  let r = s.selection, R = null;
  return r.ranges.length > 1 ? R = EditorSelection.create([r.main]) : r.main.empty || (R = EditorSelection.create([EditorSelection.cursor(r.main.head)])), R ? (e(setSel(s, R)), !0) : !1;
};
function deleteBy(s, e) {
  if (s.state.readOnly)
    return !1;
  let r = "delete.selection", { state: R } = s, B = R.changeByRange((_) => {
    let { from: $, to: F } = _;
    if ($ == F) {
      let V = e(_);
      V < $ ? (r = "delete.backward", V = skipAtomic(s, V, !1)) : V > $ && (r = "delete.forward", V = skipAtomic(s, V, !0)), $ = Math.min($, V), F = Math.max(F, V);
    } else
      $ = skipAtomic(s, $, !1), F = skipAtomic(s, F, !0);
    return $ == F ? { range: _ } : { changes: { from: $, to: F }, range: EditorSelection.cursor($, $ < _.head ? -1 : 1) };
  });
  return B.changes.empty ? !1 : (s.dispatch(R.update(B, {
    scrollIntoView: !0,
    userEvent: r,
    effects: r == "delete.selection" ? EditorView.announce.of(R.phrase("Selection deleted")) : void 0
  })), !0);
}
function skipAtomic(s, e, r) {
  if (s instanceof EditorView)
    for (let R of s.state.facet(EditorView.atomicRanges).map((B) => B(s)))
      R.between(e, e, (B, _) => {
        B < e && _ > e && (e = r ? _ : B);
      });
  return e;
}
const deleteByChar = (s, e, r) => deleteBy(s, (R) => {
  let B = R.from, { state: _ } = s, $ = _.doc.lineAt(B), F, V;
  if (r && !e && B > $.from && B < $.from + 200 && !/[^ \t]/.test(F = $.text.slice(0, B - $.from))) {
    if (F[F.length - 1] == "	")
      return B - 1;
    let H = countColumn(F, _.tabSize), W = H % getIndentUnit(_) || getIndentUnit(_);
    for (let U = 0; U < W && F[F.length - 1 - U] == " "; U++)
      B--;
    V = B;
  } else
    V = findClusterBreak($.text, B - $.from, e, e) + $.from, V == B && $.number != (e ? _.doc.lines : 1) ? V += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test($.text.slice(V - $.from, B - $.from)) && (V = findClusterBreak($.text, V - $.from, !1, !1) + $.from);
  return V;
}), deleteCharBackward = (s) => deleteByChar(s, !1, !0), deleteCharForward = (s) => deleteByChar(s, !0, !1), deleteByGroup = (s, e) => deleteBy(s, (r) => {
  let R = r.head, { state: B } = s, _ = B.doc.lineAt(R), $ = B.charCategorizer(R);
  for (let F = null; ; ) {
    if (R == (e ? _.to : _.from)) {
      R == r.head && _.number != (e ? B.doc.lines : 1) && (R += e ? 1 : -1);
      break;
    }
    let V = findClusterBreak(_.text, R - _.from, e) + _.from, H = _.text.slice(Math.min(R, V) - _.from, Math.max(R, V) - _.from), W = $(H);
    if (F != null && W != F)
      break;
    (H != " " || R != r.head) && (F = W), R = V;
  }
  return R;
}), deleteGroupBackward = (s) => deleteByGroup(s, !1), deleteGroupForward = (s) => deleteByGroup(s, !0), deleteToLineEnd = (s) => deleteBy(s, (e) => {
  let r = s.lineBlockAt(e.head).to;
  return e.head < r ? r : Math.min(s.state.doc.length, e.head + 1);
}), deleteLineBoundaryBackward = (s) => deleteBy(s, (e) => {
  let r = s.moveToLineBoundary(e, !1).head;
  return e.head > r ? r : Math.max(0, e.head - 1);
}), deleteLineBoundaryForward = (s) => deleteBy(s, (e) => {
  let r = s.moveToLineBoundary(e, !0).head;
  return e.head < r ? r : Math.min(s.state.doc.length, e.head + 1);
}), splitLine = ({ state: s, dispatch: e }) => {
  if (s.readOnly)
    return !1;
  let r = s.changeByRange((R) => ({
    changes: { from: R.from, to: R.to, insert: Text$1.of(["", ""]) },
    range: EditorSelection.cursor(R.from)
  }));
  return e(s.update(r, { scrollIntoView: !0, userEvent: "input" })), !0;
}, transposeChars = ({ state: s, dispatch: e }) => {
  if (s.readOnly)
    return !1;
  let r = s.changeByRange((R) => {
    if (!R.empty || R.from == 0 || R.from == s.doc.length)
      return { range: R };
    let B = R.from, _ = s.doc.lineAt(B), $ = B == _.from ? B - 1 : findClusterBreak(_.text, B - _.from, !1) + _.from, F = B == _.to ? B + 1 : findClusterBreak(_.text, B - _.from, !0) + _.from;
    return {
      changes: { from: $, to: F, insert: s.doc.slice(B, F).append(s.doc.slice($, B)) },
      range: EditorSelection.cursor(F)
    };
  });
  return r.changes.empty ? !1 : (e(s.update(r, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function selectedLineBlocks(s) {
  let e = [], r = -1;
  for (let R of s.selection.ranges) {
    let B = s.doc.lineAt(R.from), _ = s.doc.lineAt(R.to);
    if (!R.empty && R.to == _.from && (_ = s.doc.lineAt(R.to - 1)), r >= B.number) {
      let $ = e[e.length - 1];
      $.to = _.to, $.ranges.push(R);
    } else
      e.push({ from: B.from, to: _.to, ranges: [R] });
    r = _.number + 1;
  }
  return e;
}
function moveLine(s, e, r) {
  if (s.readOnly)
    return !1;
  let R = [], B = [];
  for (let _ of selectedLineBlocks(s)) {
    if (r ? _.to == s.doc.length : _.from == 0)
      continue;
    let $ = s.doc.lineAt(r ? _.to + 1 : _.from - 1), F = $.length + 1;
    if (r) {
      R.push({ from: _.to, to: $.to }, { from: _.from, insert: $.text + s.lineBreak });
      for (let V of _.ranges)
        B.push(EditorSelection.range(Math.min(s.doc.length, V.anchor + F), Math.min(s.doc.length, V.head + F)));
    } else {
      R.push({ from: $.from, to: _.from }, { from: _.to, insert: s.lineBreak + $.text });
      for (let V of _.ranges)
        B.push(EditorSelection.range(V.anchor - F, V.head - F));
    }
  }
  return R.length ? (e(s.update({
    changes: R,
    scrollIntoView: !0,
    selection: EditorSelection.create(B, s.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const moveLineUp = ({ state: s, dispatch: e }) => moveLine(s, e, !1), moveLineDown = ({ state: s, dispatch: e }) => moveLine(s, e, !0);
function copyLine(s, e, r) {
  if (s.readOnly)
    return !1;
  let R = [];
  for (let B of selectedLineBlocks(s))
    r ? R.push({ from: B.from, insert: s.doc.slice(B.from, B.to) + s.lineBreak }) : R.push({ from: B.to, insert: s.lineBreak + s.doc.slice(B.from, B.to) });
  return e(s.update({ changes: R, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const copyLineUp = ({ state: s, dispatch: e }) => copyLine(s, e, !1), copyLineDown = ({ state: s, dispatch: e }) => copyLine(s, e, !0), deleteLine = (s) => {
  if (s.state.readOnly)
    return !1;
  let { state: e } = s, r = e.changes(selectedLineBlocks(e).map(({ from: B, to: _ }) => (B > 0 ? B-- : _ < e.doc.length && _++, { from: B, to: _ }))), R = updateSel(e.selection, (B) => {
    let _;
    if (s.lineWrapping) {
      let $ = s.lineBlockAt(B.head), F = s.coordsAtPos(B.head, B.assoc || 1);
      F && (_ = $.bottom + s.documentTop - F.bottom + s.defaultLineHeight / 2);
    }
    return s.moveVertically(B, !0, _);
  }).map(r);
  return s.dispatch({ changes: r, selection: R, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function isBetweenBrackets(s, e) {
  if (/\(\)|\[\]|\{\}/.test(s.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let r = syntaxTree(s).resolveInner(e), R = r.childBefore(e), B = r.childAfter(e), _;
  return R && B && R.to <= e && B.from >= e && (_ = R.type.prop(NodeProp.closedBy)) && _.indexOf(B.name) > -1 && s.doc.lineAt(R.to).from == s.doc.lineAt(B.from).from && !/\S/.test(s.sliceDoc(R.to, B.from)) ? { from: R.to, to: B.from } : null;
}
const insertNewlineAndIndent = /* @__PURE__ */ newlineAndIndent(!1), insertBlankLine = /* @__PURE__ */ newlineAndIndent(!0);
function newlineAndIndent(s) {
  return ({ state: e, dispatch: r }) => {
    if (e.readOnly)
      return !1;
    let R = e.changeByRange((B) => {
      let { from: _, to: $ } = B, F = e.doc.lineAt(_), V = !s && _ == $ && isBetweenBrackets(e, _);
      s && (_ = $ = ($ <= F.to ? F : e.doc.lineAt($)).to);
      let H = new IndentContext(e, { simulateBreak: _, simulateDoubleBreak: !!V }), W = getIndentation(H, _);
      for (W == null && (W = countColumn(/^\s*/.exec(e.doc.lineAt(_).text)[0], e.tabSize)); $ < F.to && /\s/.test(F.text[$ - F.from]); )
        $++;
      V ? { from: _, to: $ } = V : _ > F.from && _ < F.from + 100 && !/\S/.test(F.text.slice(0, _)) && (_ = F.from);
      let U = ["", indentString(e, W)];
      return V && U.push(indentString(e, H.lineIndent(F.from, -1))), {
        changes: { from: _, to: $, insert: Text$1.of(U) },
        range: EditorSelection.cursor(_ + 1 + U[1].length)
      };
    });
    return r(e.update(R, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function changeBySelectedLine(s, e) {
  let r = -1;
  return s.changeByRange((R) => {
    let B = [];
    for (let $ = R.from; $ <= R.to; ) {
      let F = s.doc.lineAt($);
      F.number > r && (R.empty || R.to > F.from) && (e(F, B, R), r = F.number), $ = F.to + 1;
    }
    let _ = s.changes(B);
    return {
      changes: B,
      range: EditorSelection.range(_.mapPos(R.anchor, 1), _.mapPos(R.head, 1))
    };
  });
}
const indentSelection = ({ state: s, dispatch: e }) => {
  if (s.readOnly)
    return !1;
  let r = /* @__PURE__ */ Object.create(null), R = new IndentContext(s, { overrideIndentation: (_) => {
    let $ = r[_];
    return $ ?? -1;
  } }), B = changeBySelectedLine(s, (_, $, F) => {
    let V = getIndentation(R, _.from);
    if (V == null)
      return;
    /\S/.test(_.text) || (V = 0);
    let H = /^\s*/.exec(_.text)[0], W = indentString(s, V);
    (H != W || F.from < _.from + H.length) && (r[_.from] = V, $.push({ from: _.from, to: _.from + H.length, insert: W }));
  });
  return B.changes.empty || e(s.update(B, { userEvent: "indent" })), !0;
}, indentMore = ({ state: s, dispatch: e }) => s.readOnly ? !1 : (e(s.update(changeBySelectedLine(s, (r, R) => {
  R.push({ from: r.from, insert: s.facet(indentUnit) });
}), { userEvent: "input.indent" })), !0), indentLess = ({ state: s, dispatch: e }) => s.readOnly ? !1 : (e(s.update(changeBySelectedLine(s, (r, R) => {
  let B = /^\s*/.exec(r.text)[0];
  if (!B)
    return;
  let _ = countColumn(B, s.tabSize), $ = 0, F = indentString(s, Math.max(0, _ - getIndentUnit(s)));
  for (; $ < B.length && $ < F.length && B.charCodeAt($) == F.charCodeAt($); )
    $++;
  R.push({ from: r.from + $, to: r.from + B.length, insert: F.slice($) });
}), { userEvent: "delete.dedent" })), !0), toggleTabFocusMode = (s) => (s.setTabFocusMode(), !0), emacsStyleKeymap = [
  { key: "Ctrl-b", run: cursorCharLeft, shift: selectCharLeft, preventDefault: !0 },
  { key: "Ctrl-f", run: cursorCharRight, shift: selectCharRight },
  { key: "Ctrl-p", run: cursorLineUp, shift: selectLineUp },
  { key: "Ctrl-n", run: cursorLineDown, shift: selectLineDown },
  { key: "Ctrl-a", run: cursorLineStart, shift: selectLineStart },
  { key: "Ctrl-e", run: cursorLineEnd, shift: selectLineEnd },
  { key: "Ctrl-d", run: deleteCharForward },
  { key: "Ctrl-h", run: deleteCharBackward },
  { key: "Ctrl-k", run: deleteToLineEnd },
  { key: "Ctrl-Alt-h", run: deleteGroupBackward },
  { key: "Ctrl-o", run: splitLine },
  { key: "Ctrl-t", run: transposeChars },
  { key: "Ctrl-v", run: cursorPageDown }
], standardKeymap = /* @__PURE__ */ [
  { key: "ArrowLeft", run: cursorCharLeft, shift: selectCharLeft, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: cursorGroupLeft, shift: selectGroupLeft, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: cursorLineBoundaryLeft, shift: selectLineBoundaryLeft, preventDefault: !0 },
  { key: "ArrowRight", run: cursorCharRight, shift: selectCharRight, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: cursorGroupRight, shift: selectGroupRight, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: cursorLineBoundaryRight, shift: selectLineBoundaryRight, preventDefault: !0 },
  { key: "ArrowUp", run: cursorLineUp, shift: selectLineUp, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: cursorDocStart, shift: selectDocStart },
  { mac: "Ctrl-ArrowUp", run: cursorPageUp, shift: selectPageUp },
  { key: "ArrowDown", run: cursorLineDown, shift: selectLineDown, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: cursorDocEnd, shift: selectDocEnd },
  { mac: "Ctrl-ArrowDown", run: cursorPageDown, shift: selectPageDown },
  { key: "PageUp", run: cursorPageUp, shift: selectPageUp },
  { key: "PageDown", run: cursorPageDown, shift: selectPageDown },
  { key: "Home", run: cursorLineBoundaryBackward, shift: selectLineBoundaryBackward, preventDefault: !0 },
  { key: "Mod-Home", run: cursorDocStart, shift: selectDocStart },
  { key: "End", run: cursorLineBoundaryForward, shift: selectLineBoundaryForward, preventDefault: !0 },
  { key: "Mod-End", run: cursorDocEnd, shift: selectDocEnd },
  { key: "Enter", run: insertNewlineAndIndent, shift: insertNewlineAndIndent },
  { key: "Mod-a", run: selectAll },
  { key: "Backspace", run: deleteCharBackward, shift: deleteCharBackward },
  { key: "Delete", run: deleteCharForward },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: deleteGroupBackward },
  { key: "Mod-Delete", mac: "Alt-Delete", run: deleteGroupForward },
  { mac: "Mod-Backspace", run: deleteLineBoundaryBackward },
  { mac: "Mod-Delete", run: deleteLineBoundaryForward }
].concat(/* @__PURE__ */ emacsStyleKeymap.map((s) => ({ mac: s.key, run: s.run, shift: s.shift }))), defaultKeymap = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: cursorSyntaxLeft, shift: selectSyntaxLeft },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: cursorSyntaxRight, shift: selectSyntaxRight },
  { key: "Alt-ArrowUp", run: moveLineUp },
  { key: "Shift-Alt-ArrowUp", run: copyLineUp },
  { key: "Alt-ArrowDown", run: moveLineDown },
  { key: "Shift-Alt-ArrowDown", run: copyLineDown },
  { key: "Escape", run: simplifySelection },
  { key: "Mod-Enter", run: insertBlankLine },
  { key: "Alt-l", mac: "Ctrl-l", run: selectLine },
  { key: "Mod-i", run: selectParentSyntax, preventDefault: !0 },
  { key: "Mod-[", run: indentLess },
  { key: "Mod-]", run: indentMore },
  { key: "Mod-Alt-\\", run: indentSelection },
  { key: "Shift-Mod-k", run: deleteLine },
  { key: "Shift-Mod-\\", run: cursorMatchingBracket },
  { key: "Mod-/", run: toggleComment },
  { key: "Alt-A", run: toggleBlockComment },
  { key: "Ctrl-m", mac: "Shift-Alt-m", run: toggleTabFocusMode }
].concat(standardKeymap);
function crelt() {
  var s = arguments[0];
  typeof s == "string" && (s = document.createElement(s));
  var e = 1, r = arguments[1];
  if (r && typeof r == "object" && r.nodeType == null && !Array.isArray(r)) {
    for (var R in r) if (Object.prototype.hasOwnProperty.call(r, R)) {
      var B = r[R];
      typeof B == "string" ? s.setAttribute(R, B) : B != null && (s[R] = B);
    }
    e++;
  }
  for (; e < arguments.length; e++) add(s, arguments[e]);
  return s;
}
function add(s, e) {
  if (typeof e == "string")
    s.appendChild(document.createTextNode(e));
  else if (e != null) if (e.nodeType != null)
    s.appendChild(e);
  else if (Array.isArray(e))
    for (var r = 0; r < e.length; r++) add(s, e[r]);
  else
    throw new RangeError("Unsupported child node: " + e);
}
const basicNormalize = typeof String.prototype.normalize == "function" ? (s) => s.normalize("NFKD") : (s) => s;
class SearchCursor {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(e, r, R = 0, B = e.length, _, $) {
    this.test = $, this.value = { from: 0, to: 0 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(R, B), this.bufferStart = R, this.normalize = _ ? (F) => _(basicNormalize(F)) : basicNormalize, this.query = this.normalize(r);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return codePointAt(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    for (; this.matches.length; )
      this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (; ; ) {
      let e = this.peek();
      if (e < 0)
        return this.done = !0, this;
      let r = fromCodePoint(e), R = this.bufferStart + this.bufferPos;
      this.bufferPos += codePointSize(e);
      let B = this.normalize(r);
      if (B.length)
        for (let _ = 0, $ = R; ; _++) {
          let F = B.charCodeAt(_), V = this.match(F, $, this.bufferPos + this.bufferStart);
          if (_ == B.length - 1) {
            if (V)
              return this.value = V, this;
            break;
          }
          $ == R && _ < r.length && r.charCodeAt(_) == F && $++;
        }
    }
  }
  match(e, r, R) {
    let B = null;
    for (let _ = 0; _ < this.matches.length; _ += 2) {
      let $ = this.matches[_], F = !1;
      this.query.charCodeAt($) == e && ($ == this.query.length - 1 ? B = { from: this.matches[_ + 1], to: R } : (this.matches[_]++, F = !0)), F || (this.matches.splice(_, 2), _ -= 2);
    }
    return this.query.charCodeAt(0) == e && (this.query.length == 1 ? B = { from: r, to: R } : this.matches.push(1, r)), B && this.test && !this.test(B.from, B.to, this.buffer, this.bufferStart) && (B = null), B;
  }
}
typeof Symbol < "u" && (SearchCursor.prototype[Symbol.iterator] = function() {
  return this;
});
const empty = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") }, baseFlags = "gm" + (/x/.unicode == null ? "" : "u");
class RegExpCursor {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(e, r, R, B = 0, _ = e.length) {
    if (this.text = e, this.to = _, this.curLine = "", this.done = !1, this.value = empty, /\\[sWDnr]|\n|\r|\[\^/.test(r))
      return new MultilineRegExpCursor(e, r, R, B, _);
    this.re = new RegExp(r, baseFlags + (R != null && R.ignoreCase ? "i" : "")), this.test = R == null ? void 0 : R.test, this.iter = e.iter();
    let $ = e.lineAt(B);
    this.curLineStart = $.from, this.matchPos = toCharEnd(e, B), this.getLine(this.curLineStart);
  }
  getLine(e) {
    this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let e = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = e;
      let r = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (r) {
        let R = this.curLineStart + r.index, B = R + r[0].length;
        if (this.matchPos = toCharEnd(this.text, B + (R == B ? 1 : 0)), R == this.curLineStart + this.curLine.length && this.nextLine(), (R < B || R > this.value.to) && (!this.test || this.test(R, B, r)))
          return this.value = { from: R, to: B, match: r }, this;
        e = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), e = 0;
      else
        return this.done = !0, this;
    }
  }
}
const flattened = /* @__PURE__ */ new WeakMap();
class FlattenedDoc {
  constructor(e, r) {
    this.from = e, this.text = r;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(e, r, R) {
    let B = flattened.get(e);
    if (!B || B.from >= R || B.to <= r) {
      let F = new FlattenedDoc(r, e.sliceString(r, R));
      return flattened.set(e, F), F;
    }
    if (B.from == r && B.to == R)
      return B;
    let { text: _, from: $ } = B;
    return $ > r && (_ = e.sliceString(r, $) + _, $ = r), B.to < R && (_ += e.sliceString(B.to, R)), flattened.set(e, new FlattenedDoc($, _)), new FlattenedDoc(r, _.slice(r - $, R - $));
  }
}
class MultilineRegExpCursor {
  constructor(e, r, R, B, _) {
    this.text = e, this.to = _, this.done = !1, this.value = empty, this.matchPos = toCharEnd(e, B), this.re = new RegExp(r, baseFlags + (R != null && R.ignoreCase ? "i" : "")), this.test = R == null ? void 0 : R.test, this.flat = FlattenedDoc.get(e, B, this.chunkEnd(
      B + 5e3
      /* Chunk.Base */
    ));
  }
  chunkEnd(e) {
    return e >= this.to ? this.to : this.text.lineAt(e).to;
  }
  next() {
    for (; ; ) {
      let e = this.re.lastIndex = this.matchPos - this.flat.from, r = this.re.exec(this.flat.text);
      if (r && !r[0] && r.index == e && (this.re.lastIndex = e + 1, r = this.re.exec(this.flat.text)), r) {
        let R = this.flat.from + r.index, B = R + r[0].length;
        if ((this.flat.to >= this.to || r.index + r[0].length <= this.flat.text.length - 10) && (!this.test || this.test(R, B, r)))
          return this.value = { from: R, to: B, match: r }, this.matchPos = toCharEnd(this.text, B + (R == B ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = FlattenedDoc.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (RegExpCursor.prototype[Symbol.iterator] = MultilineRegExpCursor.prototype[Symbol.iterator] = function() {
  return this;
});
function validRegExp(s) {
  try {
    return new RegExp(s, baseFlags), !0;
  } catch {
    return !1;
  }
}
function toCharEnd(s, e) {
  if (e >= s.length)
    return e;
  let r = s.lineAt(e), R;
  for (; e < r.to && (R = r.text.charCodeAt(e - r.from)) >= 56320 && R < 57344; )
    e++;
  return e;
}
function createLineDialog(s) {
  let e = String(s.state.doc.lineAt(s.state.selection.main.head).number), r = crelt("input", { class: "cm-textfield", name: "line", value: e }), R = crelt("form", {
    class: "cm-gotoLine",
    onkeydown: (_) => {
      _.keyCode == 27 ? (_.preventDefault(), s.dispatch({ effects: dialogEffect.of(!1) }), s.focus()) : _.keyCode == 13 && (_.preventDefault(), B());
    },
    onsubmit: (_) => {
      _.preventDefault(), B();
    }
  }, crelt("label", s.state.phrase("Go to line"), ": ", r), " ", crelt("button", { class: "cm-button", type: "submit" }, s.state.phrase("go")));
  function B() {
    let _ = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(r.value);
    if (!_)
      return;
    let { state: $ } = s, F = $.doc.lineAt($.selection.main.head), [, V, H, W, U] = _, z = W ? +W.slice(1) : 0, K = H ? +H : F.number;
    if (H && U) {
      let Y = K / 100;
      V && (Y = Y * (V == "-" ? -1 : 1) + F.number / $.doc.lines), K = Math.round($.doc.lines * Y);
    } else H && V && (K = K * (V == "-" ? -1 : 1) + F.number);
    let X = $.doc.line(Math.max(1, Math.min($.doc.lines, K))), Z = EditorSelection.cursor(X.from + Math.max(0, Math.min(z, X.length)));
    s.dispatch({
      effects: [dialogEffect.of(!1), EditorView.scrollIntoView(Z.from, { y: "center" })],
      selection: Z
    }), s.focus();
  }
  return { dom: R };
}
const dialogEffect = /* @__PURE__ */ StateEffect.define(), dialogField = /* @__PURE__ */ StateField.define({
  create() {
    return !0;
  },
  update(s, e) {
    for (let r of e.effects)
      r.is(dialogEffect) && (s = r.value);
    return s;
  },
  provide: (s) => showPanel.from(s, (e) => e ? createLineDialog : null)
}), gotoLine = (s) => {
  let e = getPanel(s, createLineDialog);
  if (!e) {
    let r = [dialogEffect.of(!0)];
    s.state.field(dialogField, !1) == null && r.push(StateEffect.appendConfig.of([dialogField, baseTheme$1$1])), s.dispatch({ effects: r }), e = getPanel(s, createLineDialog);
  }
  return e && e.dom.querySelector("input").select(), !0;
}, baseTheme$1$1 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    "& label": { fontSize: "80%" }
  }
}), defaultHighlightOptions = {
  highlightWordAroundCursor: !1,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: !1
}, highlightConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, defaultHighlightOptions, {
      highlightWordAroundCursor: (e, r) => e || r,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
function highlightSelectionMatches(s) {
  return [defaultTheme, matchHighlighter];
}
const matchDeco = /* @__PURE__ */ Decoration.mark({ class: "cm-selectionMatch" }), mainMatchDeco = /* @__PURE__ */ Decoration.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function insideWordBoundaries(s, e, r, R) {
  return (r == 0 || s(e.sliceDoc(r - 1, r)) != CharCategory.Word) && (R == e.doc.length || s(e.sliceDoc(R, R + 1)) != CharCategory.Word);
}
function insideWord(s, e, r, R) {
  return s(e.sliceDoc(r, r + 1)) == CharCategory.Word && s(e.sliceDoc(R - 1, R)) == CharCategory.Word;
}
const matchHighlighter = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.decorations = this.getDeco(s);
  }
  update(s) {
    (s.selectionSet || s.docChanged || s.viewportChanged) && (this.decorations = this.getDeco(s.view));
  }
  getDeco(s) {
    let e = s.state.facet(highlightConfig), { state: r } = s, R = r.selection;
    if (R.ranges.length > 1)
      return Decoration.none;
    let B = R.main, _, $ = null;
    if (B.empty) {
      if (!e.highlightWordAroundCursor)
        return Decoration.none;
      let V = r.wordAt(B.head);
      if (!V)
        return Decoration.none;
      $ = r.charCategorizer(B.head), _ = r.sliceDoc(V.from, V.to);
    } else {
      let V = B.to - B.from;
      if (V < e.minSelectionLength || V > 200)
        return Decoration.none;
      if (e.wholeWords) {
        if (_ = r.sliceDoc(B.from, B.to), $ = r.charCategorizer(B.head), !(insideWordBoundaries($, r, B.from, B.to) && insideWord($, r, B.from, B.to)))
          return Decoration.none;
      } else if (_ = r.sliceDoc(B.from, B.to), !_)
        return Decoration.none;
    }
    let F = [];
    for (let V of s.visibleRanges) {
      let H = new SearchCursor(r.doc, _, V.from, V.to);
      for (; !H.next().done; ) {
        let { from: W, to: U } = H.value;
        if ((!$ || insideWordBoundaries($, r, W, U)) && (B.empty && W <= B.from && U >= B.to ? F.push(mainMatchDeco.range(W, U)) : (W >= B.to || U <= B.from) && F.push(matchDeco.range(W, U)), F.length > e.maxMatches))
          return Decoration.none;
      }
    }
    return Decoration.set(F);
  }
}, {
  decorations: (s) => s.decorations
}), defaultTheme = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
  ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
}), selectWord = ({ state: s, dispatch: e }) => {
  let { selection: r } = s, R = EditorSelection.create(r.ranges.map((B) => s.wordAt(B.head) || EditorSelection.cursor(B.head)), r.mainIndex);
  return R.eq(r) ? !1 : (e(s.update({ selection: R })), !0);
};
function findNextOccurrence(s, e) {
  let { main: r, ranges: R } = s.selection, B = s.wordAt(r.head), _ = B && B.from == r.from && B.to == r.to;
  for (let $ = !1, F = new SearchCursor(s.doc, e, R[R.length - 1].to); ; )
    if (F.next(), F.done) {
      if ($)
        return null;
      F = new SearchCursor(s.doc, e, 0, Math.max(0, R[R.length - 1].from - 1)), $ = !0;
    } else {
      if ($ && R.some((V) => V.from == F.value.from))
        continue;
      if (_) {
        let V = s.wordAt(F.value.from);
        if (!V || V.from != F.value.from || V.to != F.value.to)
          continue;
      }
      return F.value;
    }
}
const selectNextOccurrence = ({ state: s, dispatch: e }) => {
  let { ranges: r } = s.selection;
  if (r.some((_) => _.from === _.to))
    return selectWord({ state: s, dispatch: e });
  let R = s.sliceDoc(r[0].from, r[0].to);
  if (s.selection.ranges.some((_) => s.sliceDoc(_.from, _.to) != R))
    return !1;
  let B = findNextOccurrence(s, R);
  return B ? (e(s.update({
    selection: s.selection.addRange(EditorSelection.range(B.from, B.to), !1),
    effects: EditorView.scrollIntoView(B.to)
  })), !0) : !1;
}, searchConfigFacet = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (e) => new SearchPanel(e),
      scrollToMatch: (e) => EditorView.scrollIntoView(e)
    });
  }
});
class SearchQuery {
  /**
  Create a query object.
  */
  constructor(e) {
    this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || validRegExp(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord;
  }
  /**
  @internal
  */
  unquote(e) {
    return this.literal ? e : e.replace(/\\([nrt\\])/g, (r, R) => R == "n" ? `
` : R == "r" ? "\r" : R == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(e) {
    return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new RegExpQuery(this) : new StringQuery(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(e, r = 0, R) {
    let B = e.doc ? e : EditorState.create({ doc: e });
    return R == null && (R = B.doc.length), this.regexp ? regexpCursor(this, B, r, R) : stringCursor(this, B, r, R);
  }
}
class QueryType {
  constructor(e) {
    this.spec = e;
  }
}
function stringCursor(s, e, r, R) {
  return new SearchCursor(e.doc, s.unquoted, r, R, s.caseSensitive ? void 0 : (B) => B.toLowerCase(), s.wholeWord ? stringWordTest(e.doc, e.charCategorizer(e.selection.main.head)) : void 0);
}
function stringWordTest(s, e) {
  return (r, R, B, _) => ((_ > r || _ + B.length < R) && (_ = Math.max(0, r - 2), B = s.sliceString(_, Math.min(s.length, R + 2))), (e(charBefore(B, r - _)) != CharCategory.Word || e(charAfter(B, r - _)) != CharCategory.Word) && (e(charAfter(B, R - _)) != CharCategory.Word || e(charBefore(B, R - _)) != CharCategory.Word));
}
class StringQuery extends QueryType {
  constructor(e) {
    super(e);
  }
  nextMatch(e, r, R) {
    let B = stringCursor(this.spec, e, R, e.doc.length).nextOverlapping();
    if (B.done) {
      let _ = Math.min(e.doc.length, r + this.spec.unquoted.length);
      B = stringCursor(this.spec, e, 0, _).nextOverlapping();
    }
    return B.done || B.value.from == r && B.value.to == R ? null : B.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(e, r, R) {
    for (let B = R; ; ) {
      let _ = Math.max(r, B - 1e4 - this.spec.unquoted.length), $ = stringCursor(this.spec, e, _, B), F = null;
      for (; !$.nextOverlapping().done; )
        F = $.value;
      if (F)
        return F;
      if (_ == r)
        return null;
      B -= 1e4;
    }
  }
  prevMatch(e, r, R) {
    let B = this.prevMatchInRange(e, 0, r);
    return B || (B = this.prevMatchInRange(e, Math.max(0, R - this.spec.unquoted.length), e.doc.length)), B && (B.from != r || B.to != R) ? B : null;
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(e, r) {
    let R = stringCursor(this.spec, e, 0, e.doc.length), B = [];
    for (; !R.next().done; ) {
      if (B.length >= r)
        return null;
      B.push(R.value);
    }
    return B;
  }
  highlight(e, r, R, B) {
    let _ = stringCursor(this.spec, e, Math.max(0, r - this.spec.unquoted.length), Math.min(R + this.spec.unquoted.length, e.doc.length));
    for (; !_.next().done; )
      B(_.value.from, _.value.to);
  }
}
function regexpCursor(s, e, r, R) {
  return new RegExpCursor(e.doc, s.search, {
    ignoreCase: !s.caseSensitive,
    test: s.wholeWord ? regexpWordTest(e.charCategorizer(e.selection.main.head)) : void 0
  }, r, R);
}
function charBefore(s, e) {
  return s.slice(findClusterBreak(s, e, !1), e);
}
function charAfter(s, e) {
  return s.slice(e, findClusterBreak(s, e));
}
function regexpWordTest(s) {
  return (e, r, R) => !R[0].length || (s(charBefore(R.input, R.index)) != CharCategory.Word || s(charAfter(R.input, R.index)) != CharCategory.Word) && (s(charAfter(R.input, R.index + R[0].length)) != CharCategory.Word || s(charBefore(R.input, R.index + R[0].length)) != CharCategory.Word);
}
class RegExpQuery extends QueryType {
  nextMatch(e, r, R) {
    let B = regexpCursor(this.spec, e, R, e.doc.length).next();
    return B.done && (B = regexpCursor(this.spec, e, 0, r).next()), B.done ? null : B.value;
  }
  prevMatchInRange(e, r, R) {
    for (let B = 1; ; B++) {
      let _ = Math.max(
        r,
        R - B * 1e4
        /* FindPrev.ChunkSize */
      ), $ = regexpCursor(this.spec, e, _, R), F = null;
      for (; !$.next().done; )
        F = $.value;
      if (F && (_ == r || F.from > _ + 10))
        return F;
      if (_ == r)
        return null;
    }
  }
  prevMatch(e, r, R) {
    return this.prevMatchInRange(e, 0, r) || this.prevMatchInRange(e, R, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g, (r, R) => R == "$" ? "$" : R == "&" ? e.match[0] : R != "0" && +R < e.match.length ? e.match[R] : r);
  }
  matchAll(e, r) {
    let R = regexpCursor(this.spec, e, 0, e.doc.length), B = [];
    for (; !R.next().done; ) {
      if (B.length >= r)
        return null;
      B.push(R.value);
    }
    return B;
  }
  highlight(e, r, R, B) {
    let _ = regexpCursor(this.spec, e, Math.max(
      0,
      r - 250
      /* RegExp.HighlightMargin */
    ), Math.min(R + 250, e.doc.length));
    for (; !_.next().done; )
      B(_.value.from, _.value.to);
  }
}
const setSearchQuery = /* @__PURE__ */ StateEffect.define(), togglePanel$1 = /* @__PURE__ */ StateEffect.define(), searchState = /* @__PURE__ */ StateField.define({
  create(s) {
    return new SearchState(defaultQuery(s).create(), null);
  },
  update(s, e) {
    for (let r of e.effects)
      r.is(setSearchQuery) ? s = new SearchState(r.value.create(), s.panel) : r.is(togglePanel$1) && (s = new SearchState(s.query, r.value ? createSearchPanel : null));
    return s;
  },
  provide: (s) => showPanel.from(s, (e) => e.panel)
});
class SearchState {
  constructor(e, r) {
    this.query = e, this.panel = r;
  }
}
const matchMark = /* @__PURE__ */ Decoration.mark({ class: "cm-searchMatch" }), selectedMatchMark = /* @__PURE__ */ Decoration.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), searchHighlighter = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.view = s, this.decorations = this.highlight(s.state.field(searchState));
  }
  update(s) {
    let e = s.state.field(searchState);
    (e != s.startState.field(searchState) || s.docChanged || s.selectionSet || s.viewportChanged) && (this.decorations = this.highlight(e));
  }
  highlight({ query: s, panel: e }) {
    if (!e || !s.spec.valid)
      return Decoration.none;
    let { view: r } = this, R = new RangeSetBuilder();
    for (let B = 0, _ = r.visibleRanges, $ = _.length; B < $; B++) {
      let { from: F, to: V } = _[B];
      for (; B < $ - 1 && V > _[B + 1].from - 2 * 250; )
        V = _[++B].to;
      s.highlight(r.state, F, V, (H, W) => {
        let U = r.state.selection.ranges.some((z) => z.from == H && z.to == W);
        R.add(H, W, U ? selectedMatchMark : matchMark);
      });
    }
    return R.finish();
  }
}, {
  decorations: (s) => s.decorations
});
function searchCommand(s) {
  return (e) => {
    let r = e.state.field(searchState, !1);
    return r && r.query.spec.valid ? s(e, r) : openSearchPanel(e);
  };
}
const findNext = /* @__PURE__ */ searchCommand((s, { query: e }) => {
  let { to: r } = s.state.selection.main, R = e.nextMatch(s.state, r, r);
  if (!R)
    return !1;
  let B = EditorSelection.single(R.from, R.to), _ = s.state.facet(searchConfigFacet);
  return s.dispatch({
    selection: B,
    effects: [announceMatch(s, R), _.scrollToMatch(B.main, s)],
    userEvent: "select.search"
  }), selectSearchInput(s), !0;
}), findPrevious = /* @__PURE__ */ searchCommand((s, { query: e }) => {
  let { state: r } = s, { from: R } = r.selection.main, B = e.prevMatch(r, R, R);
  if (!B)
    return !1;
  let _ = EditorSelection.single(B.from, B.to), $ = s.state.facet(searchConfigFacet);
  return s.dispatch({
    selection: _,
    effects: [announceMatch(s, B), $.scrollToMatch(_.main, s)],
    userEvent: "select.search"
  }), selectSearchInput(s), !0;
}), selectMatches = /* @__PURE__ */ searchCommand((s, { query: e }) => {
  let r = e.matchAll(s.state, 1e3);
  return !r || !r.length ? !1 : (s.dispatch({
    selection: EditorSelection.create(r.map((R) => EditorSelection.range(R.from, R.to))),
    userEvent: "select.search.matches"
  }), !0);
}), selectSelectionMatches = ({ state: s, dispatch: e }) => {
  let r = s.selection;
  if (r.ranges.length > 1 || r.main.empty)
    return !1;
  let { from: R, to: B } = r.main, _ = [], $ = 0;
  for (let F = new SearchCursor(s.doc, s.sliceDoc(R, B)); !F.next().done; ) {
    if (_.length > 1e3)
      return !1;
    F.value.from == R && ($ = _.length), _.push(EditorSelection.range(F.value.from, F.value.to));
  }
  return e(s.update({
    selection: EditorSelection.create(_, $),
    userEvent: "select.search.matches"
  })), !0;
}, replaceNext = /* @__PURE__ */ searchCommand((s, { query: e }) => {
  let { state: r } = s, { from: R, to: B } = r.selection.main;
  if (r.readOnly)
    return !1;
  let _ = e.nextMatch(r, R, R);
  if (!_)
    return !1;
  let $ = _, F = [], V, H, W = [];
  if ($.from == R && $.to == B && (H = r.toText(e.getReplacement($)), F.push({ from: $.from, to: $.to, insert: H }), $ = e.nextMatch(r, $.from, $.to), W.push(EditorView.announce.of(r.phrase("replaced match on line $", r.doc.lineAt(R).number) + "."))), $) {
    let U = F.length == 0 || F[0].from >= _.to ? 0 : _.to - _.from - H.length;
    V = EditorSelection.single($.from - U, $.to - U), W.push(announceMatch(s, $)), W.push(r.facet(searchConfigFacet).scrollToMatch(V.main, s));
  }
  return s.dispatch({
    changes: F,
    selection: V,
    effects: W,
    userEvent: "input.replace"
  }), !0;
}), replaceAll = /* @__PURE__ */ searchCommand((s, { query: e }) => {
  if (s.state.readOnly)
    return !1;
  let r = e.matchAll(s.state, 1e9).map((B) => {
    let { from: _, to: $ } = B;
    return { from: _, to: $, insert: e.getReplacement(B) };
  });
  if (!r.length)
    return !1;
  let R = s.state.phrase("replaced $ matches", r.length) + ".";
  return s.dispatch({
    changes: r,
    effects: EditorView.announce.of(R),
    userEvent: "input.replace.all"
  }), !0;
});
function createSearchPanel(s) {
  return s.state.facet(searchConfigFacet).createPanel(s);
}
function defaultQuery(s, e) {
  var r, R, B, _, $;
  let F = s.selection.main, V = F.empty || F.to > F.from + 100 ? "" : s.sliceDoc(F.from, F.to);
  if (e && !V)
    return e;
  let H = s.facet(searchConfigFacet);
  return new SearchQuery({
    search: ((r = e == null ? void 0 : e.literal) !== null && r !== void 0 ? r : H.literal) ? V : V.replace(/\n/g, "\\n"),
    caseSensitive: (R = e == null ? void 0 : e.caseSensitive) !== null && R !== void 0 ? R : H.caseSensitive,
    literal: (B = e == null ? void 0 : e.literal) !== null && B !== void 0 ? B : H.literal,
    regexp: (_ = e == null ? void 0 : e.regexp) !== null && _ !== void 0 ? _ : H.regexp,
    wholeWord: ($ = e == null ? void 0 : e.wholeWord) !== null && $ !== void 0 ? $ : H.wholeWord
  });
}
function getSearchInput(s) {
  let e = getPanel(s, createSearchPanel);
  return e && e.dom.querySelector("[main-field]");
}
function selectSearchInput(s) {
  let e = getSearchInput(s);
  e && e == s.root.activeElement && e.select();
}
const openSearchPanel = (s) => {
  let e = s.state.field(searchState, !1);
  if (e && e.panel) {
    let r = getSearchInput(s);
    if (r && r != s.root.activeElement) {
      let R = defaultQuery(s.state, e.query.spec);
      R.valid && s.dispatch({ effects: setSearchQuery.of(R) }), r.focus(), r.select();
    }
  } else
    s.dispatch({ effects: [
      togglePanel$1.of(!0),
      e ? setSearchQuery.of(defaultQuery(s.state, e.query.spec)) : StateEffect.appendConfig.of(searchExtensions)
    ] });
  return !0;
}, closeSearchPanel = (s) => {
  let e = s.state.field(searchState, !1);
  if (!e || !e.panel)
    return !1;
  let r = getPanel(s, createSearchPanel);
  return r && r.dom.contains(s.root.activeElement) && s.focus(), s.dispatch({ effects: togglePanel$1.of(!1) }), !0;
}, searchKeymap = [
  { key: "Mod-f", run: openSearchPanel, scope: "editor search-panel" },
  { key: "F3", run: findNext, shift: findPrevious, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: findNext, shift: findPrevious, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: closeSearchPanel, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: selectSelectionMatches },
  { key: "Mod-Alt-g", run: gotoLine },
  { key: "Mod-d", run: selectNextOccurrence, preventDefault: !0 }
];
class SearchPanel {
  constructor(e) {
    this.view = e;
    let r = this.query = e.state.field(searchState).query.spec;
    this.commit = this.commit.bind(this), this.searchField = crelt("input", {
      value: r.search,
      placeholder: phrase(e, "Find"),
      "aria-label": phrase(e, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = crelt("input", {
      value: r.replace,
      placeholder: phrase(e, "Replace"),
      "aria-label": phrase(e, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = crelt("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: r.caseSensitive,
      onchange: this.commit
    }), this.reField = crelt("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: r.regexp,
      onchange: this.commit
    }), this.wordField = crelt("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: r.wholeWord,
      onchange: this.commit
    });
    function R(B, _, $) {
      return crelt("button", { class: "cm-button", name: B, onclick: _, type: "button" }, $);
    }
    this.dom = crelt("div", { onkeydown: (B) => this.keydown(B), class: "cm-search" }, [
      this.searchField,
      R("next", () => findNext(e), [phrase(e, "next")]),
      R("prev", () => findPrevious(e), [phrase(e, "previous")]),
      R("select", () => selectMatches(e), [phrase(e, "all")]),
      crelt("label", null, [this.caseField, phrase(e, "match case")]),
      crelt("label", null, [this.reField, phrase(e, "regexp")]),
      crelt("label", null, [this.wordField, phrase(e, "by word")]),
      ...e.state.readOnly ? [] : [
        crelt("br"),
        this.replaceField,
        R("replace", () => replaceNext(e), [phrase(e, "replace")]),
        R("replaceAll", () => replaceAll(e), [phrase(e, "replace all")])
      ],
      crelt("button", {
        name: "close",
        onclick: () => closeSearchPanel(e),
        "aria-label": phrase(e, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let e = new SearchQuery({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: setSearchQuery.of(e) }));
  }
  keydown(e) {
    runScopeHandlers(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? findPrevious : findNext)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), replaceNext(this.view));
  }
  update(e) {
    for (let r of e.transactions)
      for (let R of r.effects)
        R.is(setSearchQuery) && !R.value.eq(this.query) && this.setQuery(R.value);
  }
  setQuery(e) {
    this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(searchConfigFacet).top;
  }
}
function phrase(s, e) {
  return s.state.phrase(e);
}
const AnnounceMargin = 30, Break = /[\s\.,:;?!]/;
function announceMatch(s, { from: e, to: r }) {
  let R = s.state.doc.lineAt(e), B = s.state.doc.lineAt(r).to, _ = Math.max(R.from, e - AnnounceMargin), $ = Math.min(B, r + AnnounceMargin), F = s.state.sliceDoc(_, $);
  if (_ != R.from) {
    for (let V = 0; V < AnnounceMargin; V++)
      if (!Break.test(F[V + 1]) && Break.test(F[V])) {
        F = F.slice(V);
        break;
      }
  }
  if ($ != B) {
    for (let V = F.length - 1; V > F.length - AnnounceMargin; V--)
      if (!Break.test(F[V - 1]) && Break.test(F[V])) {
        F = F.slice(0, V);
        break;
      }
  }
  return EditorView.announce.of(`${s.state.phrase("current match")}. ${F} ${s.state.phrase("on line")} ${R.number}.`);
}
const baseTheme$2 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), searchExtensions = [
  searchState,
  /* @__PURE__ */ Prec.low(searchHighlighter),
  baseTheme$2
];
class CompletionContext {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, r, R, B) {
    this.state = e, this.pos = r, this.explicit = R, this.view = B, this.abortListeners = [], this.abortOnDocChange = !1;
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let r = syntaxTree(this.state).resolveInner(this.pos, -1);
    for (; r && e.indexOf(r.name) < 0; )
      r = r.parent;
    return r ? {
      from: r.from,
      to: this.pos,
      text: this.state.sliceDoc(r.from, this.pos),
      type: r.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let r = this.state.doc.lineAt(this.pos), R = Math.max(r.from, this.pos - 250), B = r.text.slice(R - r.from, this.pos - r.from), _ = B.search(ensureAnchor(e, !1));
    return _ < 0 ? null : { from: R + _, to: this.pos, text: B.slice(_) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  
  By default, running queries will not be aborted for regular
  typing or backspacing, on the assumption that they are likely to
  return a result with a
  [`validFor`](https://codemirror.net/6/docs/ref/#autocomplete.CompletionResult.validFor) field that
  allows the result to be used after all. Passing `onDocChange:
  true` will cause this query to be aborted for any document
  change.
  */
  addEventListener(e, r, R) {
    e == "abort" && this.abortListeners && (this.abortListeners.push(r), R && R.onDocChange && (this.abortOnDocChange = !0));
  }
}
function toSet(s) {
  let e = Object.keys(s).join(""), r = /\w/.test(e);
  return r && (e = e.replace(/\w/g, "")), `[${r ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function prefixMatch(s) {
  let e = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  for (let { label: B } of s) {
    e[B[0]] = !0;
    for (let _ = 1; _ < B.length; _++)
      r[B[_]] = !0;
  }
  let R = toSet(e) + toSet(r) + "*$";
  return [new RegExp("^" + R), new RegExp(R)];
}
function completeFromList(s) {
  let e = s.map((B) => typeof B == "string" ? { label: B } : B), [r, R] = e.every((B) => /^\w+$/.test(B.label)) ? [/\w*$/, /\w+$/] : prefixMatch(e);
  return (B) => {
    let _ = B.matchBefore(R);
    return _ || B.explicit ? { from: _ ? _.from : B.pos, options: e, validFor: r } : null;
  };
}
class Option {
  constructor(e, r, R, B) {
    this.completion = e, this.source = r, this.match = R, this.score = B;
  }
}
function cur(s) {
  return s.selection.main.from;
}
function ensureAnchor(s, e) {
  var r;
  let { source: R } = s, B = e && R[0] != "^", _ = R[R.length - 1] != "$";
  return !B && !_ ? s : new RegExp(`${B ? "^" : ""}(?:${R})${_ ? "$" : ""}`, (r = s.flags) !== null && r !== void 0 ? r : s.ignoreCase ? "i" : "");
}
const pickedCompletion = /* @__PURE__ */ Annotation.define();
function insertCompletionText(s, e, r, R) {
  let { main: B } = s.selection, _ = r - B.from, $ = R - B.from;
  return Object.assign(Object.assign({}, s.changeByRange((F) => {
    if (F != B && r != R && s.sliceDoc(F.from + _, F.from + $) != s.sliceDoc(r, R))
      return { range: F };
    let V = s.toText(e);
    return {
      changes: { from: F.from + _, to: R == B.from ? F.to : F.from + $, insert: V },
      range: EditorSelection.cursor(F.from + _ + V.length)
    };
  })), { scrollIntoView: !0, userEvent: "input.complete" });
}
const SourceCache = /* @__PURE__ */ new WeakMap();
function asSource(s) {
  if (!Array.isArray(s))
    return s;
  let e = SourceCache.get(s);
  return e || SourceCache.set(s, e = completeFromList(s)), e;
}
const startCompletionEffect = /* @__PURE__ */ StateEffect.define(), closeCompletionEffect = /* @__PURE__ */ StateEffect.define();
class FuzzyMatcher {
  constructor(e) {
    this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let r = 0; r < e.length; ) {
      let R = codePointAt(e, r), B = codePointSize(R);
      this.chars.push(R);
      let _ = e.slice(r, r + B), $ = _.toUpperCase();
      this.folded.push(codePointAt($ == _ ? _.toLowerCase() : $, 0)), r += B;
    }
    this.astral = e.length != this.chars.length;
  }
  ret(e, r) {
    return this.score = e, this.matched = r, this;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(e) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (e.length < this.pattern.length)
      return null;
    let { chars: r, folded: R, any: B, precise: _, byWord: $ } = this;
    if (r.length == 1) {
      let ue = codePointAt(e, 0), fe = codePointSize(ue), de = fe == e.length ? 0 : -100;
      if (ue != r[0]) if (ue == R[0])
        de += -200;
      else
        return null;
      return this.ret(de, [0, fe]);
    }
    let F = e.indexOf(this.pattern);
    if (F == 0)
      return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let V = r.length, H = 0;
    if (F < 0) {
      for (let ue = 0, fe = Math.min(e.length, 200); ue < fe && H < V; ) {
        let de = codePointAt(e, ue);
        (de == r[H] || de == R[H]) && (B[H++] = ue), ue += codePointSize(de);
      }
      if (H < V)
        return null;
    }
    let W = 0, U = 0, z = !1, K = 0, X = -1, Z = -1, Y = /[a-z]/.test(e), te = !0;
    for (let ue = 0, fe = Math.min(e.length, 200), de = 0; ue < fe && U < V; ) {
      let re = codePointAt(e, ue);
      F < 0 && (W < V && re == r[W] && (_[W++] = ue), K < V && (re == r[K] || re == R[K] ? (K == 0 && (X = ue), Z = ue + 1, K++) : K = 0));
      let ae, le = re < 255 ? re >= 48 && re <= 57 || re >= 97 && re <= 122 ? 2 : re >= 65 && re <= 90 ? 1 : 0 : (ae = fromCodePoint(re)) != ae.toLowerCase() ? 1 : ae != ae.toUpperCase() ? 2 : 0;
      (!ue || le == 1 && Y || de == 0 && le != 0) && (r[U] == re || R[U] == re && (z = !0) ? $[U++] = ue : $.length && (te = !1)), de = le, ue += codePointSize(re);
    }
    return U == V && $[0] == 0 && te ? this.result(-100 + (z ? -200 : 0), $, e) : K == V && X == 0 ? this.ret(-200 - e.length + (Z == e.length ? 0 : -100), [0, Z]) : F > -1 ? this.ret(-700 - e.length, [F, F + this.pattern.length]) : K == V ? this.ret(-900 - e.length, [X, Z]) : U == V ? this.result(-100 + (z ? -200 : 0) + -700 + (te ? 0 : -1100), $, e) : r.length == 2 ? null : this.result((B[0] ? -700 : 0) + -200 + -1100, B, e);
  }
  result(e, r, R) {
    let B = [], _ = 0;
    for (let $ of r) {
      let F = $ + (this.astral ? codePointSize(codePointAt(R, $)) : 1);
      _ && B[_ - 1] == $ ? B[_ - 1] = F : (B[_++] = $, B[_++] = F);
    }
    return this.ret(e - R.length, B);
  }
}
class StrictMatcher {
  constructor(e) {
    this.pattern = e, this.matched = [], this.score = 0, this.folded = e.toLowerCase();
  }
  match(e) {
    if (e.length < this.pattern.length)
      return null;
    let r = e.slice(0, this.pattern.length), R = r == this.pattern ? 0 : r.toLowerCase() == this.folded ? -200 : null;
    return R == null ? null : (this.matched = [0, r.length], this.score = R + (e.length == this.pattern.length ? 0 : -100), this);
  }
}
const completionConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return combineConfig(s, {
      activateOnTyping: !0,
      activateOnCompletion: () => !1,
      activateOnTypingDelay: 100,
      selectOnOpen: !0,
      override: null,
      closeOnBlur: !0,
      maxRenderedOptions: 100,
      defaultKeymap: !0,
      tooltipClass: () => "",
      optionClass: () => "",
      aboveCursor: !1,
      icons: !0,
      addToOptions: [],
      positionInfo: defaultPositionInfo,
      filterStrict: !1,
      compareCompletions: (e, r) => e.label.localeCompare(r.label),
      interactionDelay: 75,
      updateSyncTime: 100
    }, {
      defaultKeymap: (e, r) => e && r,
      closeOnBlur: (e, r) => e && r,
      icons: (e, r) => e && r,
      tooltipClass: (e, r) => (R) => joinClass(e(R), r(R)),
      optionClass: (e, r) => (R) => joinClass(e(R), r(R)),
      addToOptions: (e, r) => e.concat(r),
      filterStrict: (e, r) => e || r
    });
  }
});
function joinClass(s, e) {
  return s ? e ? s + " " + e : s : e;
}
function defaultPositionInfo(s, e, r, R, B, _) {
  let $ = s.textDirection == Direction.RTL, F = $, V = !1, H = "top", W, U, z = e.left - B.left, K = B.right - e.right, X = R.right - R.left, Z = R.bottom - R.top;
  if (F && z < Math.min(X, K) ? F = !1 : !F && K < Math.min(X, z) && (F = !0), X <= (F ? z : K))
    W = Math.max(B.top, Math.min(r.top, B.bottom - Z)) - e.top, U = Math.min(400, F ? z : K);
  else {
    V = !0, U = Math.min(
      400,
      ($ ? e.right : B.right - e.left) - 30
      /* Info.Margin */
    );
    let ue = B.bottom - e.bottom;
    ue >= Z || ue > e.top ? W = r.bottom - e.top : (H = "bottom", W = e.bottom - r.top);
  }
  let Y = (e.bottom - e.top) / _.offsetHeight, te = (e.right - e.left) / _.offsetWidth;
  return {
    style: `${H}: ${W / Y}px; max-width: ${U / te}px`,
    class: "cm-completionInfo-" + (V ? $ ? "left-narrow" : "right-narrow" : F ? "left" : "right")
  };
}
function optionContent(s) {
  let e = s.addToOptions.slice();
  return s.icons && e.push({
    render(r) {
      let R = document.createElement("div");
      return R.classList.add("cm-completionIcon"), r.type && R.classList.add(...r.type.split(/\s+/g).map((B) => "cm-completionIcon-" + B)), R.setAttribute("aria-hidden", "true"), R;
    },
    position: 20
  }), e.push({
    render(r, R, B, _) {
      let $ = document.createElement("span");
      $.className = "cm-completionLabel";
      let F = r.displayLabel || r.label, V = 0;
      for (let H = 0; H < _.length; ) {
        let W = _[H++], U = _[H++];
        W > V && $.appendChild(document.createTextNode(F.slice(V, W)));
        let z = $.appendChild(document.createElement("span"));
        z.appendChild(document.createTextNode(F.slice(W, U))), z.className = "cm-completionMatchedText", V = U;
      }
      return V < F.length && $.appendChild(document.createTextNode(F.slice(V))), $;
    },
    position: 50
  }, {
    render(r) {
      if (!r.detail)
        return null;
      let R = document.createElement("span");
      return R.className = "cm-completionDetail", R.textContent = r.detail, R;
    },
    position: 80
  }), e.sort((r, R) => r.position - R.position).map((r) => r.render);
}
function rangeAroundSelected(s, e, r) {
  if (s <= r)
    return { from: 0, to: s };
  if (e < 0 && (e = 0), e <= s >> 1) {
    let B = Math.floor(e / r);
    return { from: B * r, to: (B + 1) * r };
  }
  let R = Math.floor((s - e) / r);
  return { from: s - (R + 1) * r, to: s - R * r };
}
class CompletionTooltip {
  constructor(e, r, R) {
    this.view = e, this.stateField = r, this.applyCompletion = R, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (V) => this.placeInfo(V),
      key: this
    }, this.space = null, this.currentClass = "";
    let B = e.state.field(r), { options: _, selected: $ } = B.open, F = e.state.facet(completionConfig);
    this.optionContent = optionContent(F), this.optionClass = F.optionClass, this.tooltipClass = F.tooltipClass, this.range = rangeAroundSelected(_.length, $, F.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (V) => {
      let { options: H } = e.state.field(r).open;
      for (let W = V.target, U; W && W != this.dom; W = W.parentNode)
        if (W.nodeName == "LI" && (U = /-(\d+)$/.exec(W.id)) && +U[1] < H.length) {
          this.applyCompletion(e, H[+U[1]]), V.preventDefault();
          return;
        }
    }), this.dom.addEventListener("focusout", (V) => {
      let H = e.state.field(this.stateField, !1);
      H && H.tooltip && e.state.facet(completionConfig).closeOnBlur && V.relatedTarget != e.contentDOM && e.dispatch({ effects: closeCompletionEffect.of(null) });
    }), this.showOptions(_, B.id);
  }
  mount() {
    this.updateSel();
  }
  showOptions(e, r) {
    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, r, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  update(e) {
    var r;
    let R = e.state.field(this.stateField), B = e.startState.field(this.stateField);
    if (this.updateTooltipClass(e.state), R != B) {
      let { options: _, selected: $, disabled: F } = R.open;
      (!B.open || B.open.options != _) && (this.range = rangeAroundSelected(_.length, $, e.state.facet(completionConfig).maxRenderedOptions), this.showOptions(_, R.id)), this.updateSel(), F != ((r = B.open) === null || r === void 0 ? void 0 : r.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!F);
    }
  }
  updateTooltipClass(e) {
    let r = this.tooltipClass(e);
    if (r != this.currentClass) {
      for (let R of this.currentClass.split(" "))
        R && this.dom.classList.remove(R);
      for (let R of r.split(" "))
        R && this.dom.classList.add(R);
      this.currentClass = r;
    }
  }
  positioned(e) {
    this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let e = this.view.state.field(this.stateField), r = e.open;
    if ((r.selected > -1 && r.selected < this.range.from || r.selected >= this.range.to) && (this.range = rangeAroundSelected(r.options.length, r.selected, this.view.state.facet(completionConfig).maxRenderedOptions), this.showOptions(r.options, e.id)), this.updateSelectedOption(r.selected)) {
      this.destroyInfo();
      let { completion: R } = r.options[r.selected], { info: B } = R;
      if (!B)
        return;
      let _ = typeof B == "string" ? document.createTextNode(B) : B(R);
      if (!_)
        return;
      "then" in _ ? _.then(($) => {
        $ && this.view.state.field(this.stateField, !1) == e && this.addInfoPane($, R);
      }).catch(($) => logException(this.view.state, $, "completion info")) : this.addInfoPane(_, R);
    }
  }
  addInfoPane(e, r) {
    this.destroyInfo();
    let R = this.info = document.createElement("div");
    if (R.className = "cm-tooltip cm-completionInfo", e.nodeType != null)
      R.appendChild(e), this.infoDestroy = null;
    else {
      let { dom: B, destroy: _ } = e;
      R.appendChild(B), this.infoDestroy = _ || null;
    }
    this.dom.appendChild(R), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(e) {
    let r = null;
    for (let R = this.list.firstChild, B = this.range.from; R; R = R.nextSibling, B++)
      R.nodeName != "LI" || !R.id ? B-- : B == e ? R.hasAttribute("aria-selected") || (R.setAttribute("aria-selected", "true"), r = R) : R.hasAttribute("aria-selected") && R.removeAttribute("aria-selected");
    return r && scrollIntoView(this.list, r), r;
  }
  measureInfo() {
    let e = this.dom.querySelector("[aria-selected]");
    if (!e || !this.info)
      return null;
    let r = this.dom.getBoundingClientRect(), R = this.info.getBoundingClientRect(), B = e.getBoundingClientRect(), _ = this.space;
    if (!_) {
      let $ = this.dom.ownerDocument.defaultView || window;
      _ = { left: 0, top: 0, right: $.innerWidth, bottom: $.innerHeight };
    }
    return B.top > Math.min(_.bottom, r.bottom) - 10 || B.bottom < Math.max(_.top, r.top) + 10 ? null : this.view.state.facet(completionConfig).positionInfo(this.view, r, B, R, _, this.dom);
  }
  placeInfo(e) {
    this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(e, r, R) {
    const B = document.createElement("ul");
    B.id = r, B.setAttribute("role", "listbox"), B.setAttribute("aria-expanded", "true"), B.setAttribute("aria-label", this.view.state.phrase("Completions"));
    let _ = null;
    for (let $ = R.from; $ < R.to; $++) {
      let { completion: F, match: V } = e[$], { section: H } = F;
      if (H) {
        let z = typeof H == "string" ? H : H.name;
        if (z != _ && ($ > R.from || R.from == 0))
          if (_ = z, typeof H != "string" && H.header)
            B.appendChild(H.header(H));
          else {
            let K = B.appendChild(document.createElement("completion-section"));
            K.textContent = z;
          }
      }
      const W = B.appendChild(document.createElement("li"));
      W.id = r + "-" + $, W.setAttribute("role", "option");
      let U = this.optionClass(F);
      U && (W.className = U);
      for (let z of this.optionContent) {
        let K = z(F, this.view.state, this.view, V);
        K && W.appendChild(K);
      }
    }
    return R.from && B.classList.add("cm-completionListIncompleteTop"), R.to < e.length && B.classList.add("cm-completionListIncompleteBottom"), B;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function completionTooltip(s, e) {
  return (r) => new CompletionTooltip(r, s, e);
}
function scrollIntoView(s, e) {
  let r = s.getBoundingClientRect(), R = e.getBoundingClientRect(), B = r.height / s.offsetHeight;
  R.top < r.top ? s.scrollTop -= (r.top - R.top) / B : R.bottom > r.bottom && (s.scrollTop += (R.bottom - r.bottom) / B);
}
function score(s) {
  return (s.boost || 0) * 100 + (s.apply ? 10 : 0) + (s.info ? 5 : 0) + (s.type ? 1 : 0);
}
function sortOptions(s, e) {
  let r = [], R = null, B = (H) => {
    r.push(H);
    let { section: W } = H.completion;
    if (W) {
      R || (R = []);
      let U = typeof W == "string" ? W : W.name;
      R.some((z) => z.name == U) || R.push(typeof W == "string" ? { name: U } : W);
    }
  }, _ = e.facet(completionConfig);
  for (let H of s)
    if (H.hasResult()) {
      let W = H.result.getMatch;
      if (H.result.filter === !1)
        for (let U of H.result.options)
          B(new Option(U, H.source, W ? W(U) : [], 1e9 - r.length));
      else {
        let U = e.sliceDoc(H.from, H.to), z, K = _.filterStrict ? new StrictMatcher(U) : new FuzzyMatcher(U);
        for (let X of H.result.options)
          if (z = K.match(X.label)) {
            let Z = X.displayLabel ? W ? W(X, z.matched) : [] : z.matched;
            B(new Option(X, H.source, Z, z.score + (X.boost || 0)));
          }
      }
    }
  if (R) {
    let H = /* @__PURE__ */ Object.create(null), W = 0, U = (z, K) => {
      var X, Z;
      return ((X = z.rank) !== null && X !== void 0 ? X : 1e9) - ((Z = K.rank) !== null && Z !== void 0 ? Z : 1e9) || (z.name < K.name ? -1 : 1);
    };
    for (let z of R.sort(U))
      W -= 1e5, H[z.name] = W;
    for (let z of r) {
      let { section: K } = z.completion;
      K && (z.score += H[typeof K == "string" ? K : K.name]);
    }
  }
  let $ = [], F = null, V = _.compareCompletions;
  for (let H of r.sort((W, U) => U.score - W.score || V(W.completion, U.completion))) {
    let W = H.completion;
    !F || F.label != W.label || F.detail != W.detail || F.type != null && W.type != null && F.type != W.type || F.apply != W.apply || F.boost != W.boost ? $.push(H) : score(H.completion) > score(F) && ($[$.length - 1] = H), F = H.completion;
  }
  return $;
}
class CompletionDialog {
  constructor(e, r, R, B, _, $) {
    this.options = e, this.attrs = r, this.tooltip = R, this.timestamp = B, this.selected = _, this.disabled = $;
  }
  setSelected(e, r) {
    return e == this.selected || e >= this.options.length ? this : new CompletionDialog(this.options, makeAttrs(r, e), this.tooltip, this.timestamp, e, this.disabled);
  }
  static build(e, r, R, B, _, $) {
    if (B && !$ && e.some((H) => H.isPending))
      return B.setDisabled();
    let F = sortOptions(e, r);
    if (!F.length)
      return B && e.some((H) => H.isPending) ? B.setDisabled() : null;
    let V = r.facet(completionConfig).selectOnOpen ? 0 : -1;
    if (B && B.selected != V && B.selected != -1) {
      let H = B.options[B.selected].completion;
      for (let W = 0; W < F.length; W++)
        if (F[W].completion == H) {
          V = W;
          break;
        }
    }
    return new CompletionDialog(F, makeAttrs(R, V), {
      pos: e.reduce((H, W) => W.hasResult() ? Math.min(H, W.from) : H, 1e8),
      create: createTooltip,
      above: _.aboveCursor
    }, B ? B.timestamp : Date.now(), V, !1);
  }
  map(e) {
    return new CompletionDialog(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: e.mapPos(this.tooltip.pos) }), this.timestamp, this.selected, this.disabled);
  }
  setDisabled() {
    return new CompletionDialog(this.options, this.attrs, this.tooltip, this.timestamp, this.selected, !0);
  }
}
class CompletionState {
  constructor(e, r, R) {
    this.active = e, this.id = r, this.open = R;
  }
  static start() {
    return new CompletionState(none, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(e) {
    let { state: r } = e, R = r.facet(completionConfig), _ = (R.override || r.languageDataAt("autocomplete", cur(r)).map(asSource)).map((V) => (this.active.find((W) => W.source == V) || new ActiveSource(
      V,
      this.active.some(
        (W) => W.state != 0
        /* State.Inactive */
      ) ? 1 : 0
      /* State.Inactive */
    )).update(e, R));
    _.length == this.active.length && _.every((V, H) => V == this.active[H]) && (_ = this.active);
    let $ = this.open, F = e.effects.some((V) => V.is(setActiveEffect));
    $ && e.docChanged && ($ = $.map(e.changes)), e.selection || _.some((V) => V.hasResult() && e.changes.touchesRange(V.from, V.to)) || !sameResults(_, this.active) || F ? $ = CompletionDialog.build(_, r, this.id, $, R, F) : $ && $.disabled && !_.some((V) => V.isPending) && ($ = null), !$ && _.every((V) => !V.isPending) && _.some((V) => V.hasResult()) && (_ = _.map((V) => V.hasResult() ? new ActiveSource(
      V.source,
      0
      /* State.Inactive */
    ) : V));
    for (let V of e.effects)
      V.is(setSelectedEffect) && ($ = $ && $.setSelected(V.value, this.id));
    return _ == this.active && $ == this.open ? this : new CompletionState(_, this.id, $);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : this.active.length ? baseAttrs : noAttrs;
  }
}
function sameResults(s, e) {
  if (s == e)
    return !0;
  for (let r = 0, R = 0; ; ) {
    for (; r < s.length && !s[r].hasResult(); )
      r++;
    for (; R < e.length && !e[R].hasResult(); )
      R++;
    let B = r == s.length, _ = R == e.length;
    if (B || _)
      return B == _;
    if (s[r++].result != e[R++].result)
      return !1;
  }
}
const baseAttrs = {
  "aria-autocomplete": "list"
}, noAttrs = {};
function makeAttrs(s, e) {
  let r = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": s
  };
  return e > -1 && (r["aria-activedescendant"] = s + "-" + e), r;
}
const none = [];
function getUpdateType(s, e) {
  if (s.isUserEvent("input.complete")) {
    let R = s.annotation(pickedCompletion);
    if (R && e.activateOnCompletion(R))
      return 12;
  }
  let r = s.isUserEvent("input.type");
  return r && e.activateOnTyping ? 5 : r ? 1 : s.isUserEvent("delete.backward") ? 2 : s.selection ? 8 : s.docChanged ? 16 : 0;
}
class ActiveSource {
  constructor(e, r, R = !1) {
    this.source = e, this.state = r, this.explicit = R;
  }
  hasResult() {
    return !1;
  }
  get isPending() {
    return this.state == 1;
  }
  update(e, r) {
    let R = getUpdateType(e, r), B = this;
    (R & 8 || R & 16 && this.touches(e)) && (B = new ActiveSource(
      B.source,
      0
      /* State.Inactive */
    )), R & 4 && B.state == 0 && (B = new ActiveSource(
      this.source,
      1
      /* State.Pending */
    )), B = B.updateFor(e, R);
    for (let _ of e.effects)
      if (_.is(startCompletionEffect))
        B = new ActiveSource(B.source, 1, _.value);
      else if (_.is(closeCompletionEffect))
        B = new ActiveSource(
          B.source,
          0
          /* State.Inactive */
        );
      else if (_.is(setActiveEffect))
        for (let $ of _.value)
          $.source == B.source && (B = $);
    return B;
  }
  updateFor(e, r) {
    return this.map(e.changes);
  }
  map(e) {
    return this;
  }
  touches(e) {
    return e.changes.touchesRange(cur(e.state));
  }
}
class ActiveResult extends ActiveSource {
  constructor(e, r, R, B, _, $) {
    super(e, 3, r), this.limit = R, this.result = B, this.from = _, this.to = $;
  }
  hasResult() {
    return !0;
  }
  updateFor(e, r) {
    var R;
    if (!(r & 3))
      return this.map(e.changes);
    let B = this.result;
    B.map && !e.changes.empty && (B = B.map(B, e.changes));
    let _ = e.changes.mapPos(this.from), $ = e.changes.mapPos(this.to, 1), F = cur(e.state);
    if (F > $ || !B || r & 2 && (cur(e.startState) == this.from || F < this.limit))
      return new ActiveSource(
        this.source,
        r & 4 ? 1 : 0
        /* State.Inactive */
      );
    let V = e.changes.mapPos(this.limit);
    return checkValid(B.validFor, e.state, _, $) ? new ActiveResult(this.source, this.explicit, V, B, _, $) : B.update && (B = B.update(B, _, $, new CompletionContext(e.state, F, !1))) ? new ActiveResult(this.source, this.explicit, V, B, B.from, (R = B.to) !== null && R !== void 0 ? R : cur(e.state)) : new ActiveSource(this.source, 1, this.explicit);
  }
  map(e) {
    return e.empty ? this : (this.result.map ? this.result.map(this.result, e) : this.result) ? new ActiveResult(this.source, this.explicit, e.mapPos(this.limit), this.result, e.mapPos(this.from), e.mapPos(this.to, 1)) : new ActiveSource(
      this.source,
      0
      /* State.Inactive */
    );
  }
  touches(e) {
    return e.changes.touchesRange(this.from, this.to);
  }
}
function checkValid(s, e, r, R) {
  if (!s)
    return !1;
  let B = e.sliceDoc(r, R);
  return typeof s == "function" ? s(B, r, R, e) : ensureAnchor(s, !0).test(B);
}
const setActiveEffect = /* @__PURE__ */ StateEffect.define({
  map(s, e) {
    return s.map((r) => r.map(e));
  }
}), setSelectedEffect = /* @__PURE__ */ StateEffect.define(), completionState = /* @__PURE__ */ StateField.define({
  create() {
    return CompletionState.start();
  },
  update(s, e) {
    return s.update(e);
  },
  provide: (s) => [
    showTooltip.from(s, (e) => e.tooltip),
    EditorView.contentAttributes.from(s, (e) => e.attrs)
  ]
});
function applyCompletion(s, e) {
  const r = e.completion.apply || e.completion.label;
  let R = s.state.field(completionState).active.find((B) => B.source == e.source);
  return R instanceof ActiveResult ? (typeof r == "string" ? s.dispatch(Object.assign(Object.assign({}, insertCompletionText(s.state, r, R.from, R.to)), { annotations: pickedCompletion.of(e.completion) })) : r(s, e.completion, R.from, R.to), !0) : !1;
}
const createTooltip = /* @__PURE__ */ completionTooltip(completionState, applyCompletion);
function moveCompletionSelection(s, e = "option") {
  return (r) => {
    let R = r.state.field(completionState, !1);
    if (!R || !R.open || R.open.disabled || Date.now() - R.open.timestamp < r.state.facet(completionConfig).interactionDelay)
      return !1;
    let B = 1, _;
    e == "page" && (_ = getTooltip(r, R.open.tooltip)) && (B = Math.max(2, Math.floor(_.dom.offsetHeight / _.dom.querySelector("li").offsetHeight) - 1));
    let { length: $ } = R.open.options, F = R.open.selected > -1 ? R.open.selected + B * (s ? 1 : -1) : s ? 0 : $ - 1;
    return F < 0 ? F = e == "page" ? 0 : $ - 1 : F >= $ && (F = e == "page" ? $ - 1 : 0), r.dispatch({ effects: setSelectedEffect.of(F) }), !0;
  };
}
const acceptCompletion = (s) => {
  let e = s.state.field(completionState, !1);
  return s.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < s.state.facet(completionConfig).interactionDelay ? !1 : applyCompletion(s, e.open.options[e.open.selected]);
}, startCompletion = (s) => s.state.field(completionState, !1) ? (s.dispatch({ effects: startCompletionEffect.of(!0) }), !0) : !1, closeCompletion = (s) => {
  let e = s.state.field(completionState, !1);
  return !e || !e.active.some(
    (r) => r.state != 0
    /* State.Inactive */
  ) ? !1 : (s.dispatch({ effects: closeCompletionEffect.of(null) }), !0);
};
class RunningQuery {
  constructor(e, r) {
    this.active = e, this.context = r, this.time = Date.now(), this.updates = [], this.done = void 0;
  }
}
const MaxUpdateCount = 50, MinAbortTime = 1e3, completionPlugin = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(s) {
    this.view = s, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.pendingStart = !1, this.composing = 0;
    for (let e of s.state.field(completionState).active)
      e.isPending && this.startQuery(e);
  }
  update(s) {
    let e = s.state.field(completionState), r = s.state.facet(completionConfig);
    if (!s.selectionSet && !s.docChanged && s.startState.field(completionState) == e)
      return;
    let R = s.transactions.some((_) => {
      let $ = getUpdateType(_, r);
      return $ & 8 || (_.selection || _.docChanged) && !($ & 3);
    });
    for (let _ = 0; _ < this.running.length; _++) {
      let $ = this.running[_];
      if (R || $.context.abortOnDocChange && s.docChanged || $.updates.length + s.transactions.length > MaxUpdateCount && Date.now() - $.time > MinAbortTime) {
        for (let F of $.context.abortListeners)
          try {
            F();
          } catch (V) {
            logException(this.view.state, V);
          }
        $.context.abortListeners = null, this.running.splice(_--, 1);
      } else
        $.updates.push(...s.transactions);
    }
    this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), s.transactions.some((_) => _.effects.some(($) => $.is(startCompletionEffect))) && (this.pendingStart = !0);
    let B = this.pendingStart ? 50 : r.activateOnTypingDelay;
    if (this.debounceUpdate = e.active.some((_) => _.isPending && !this.running.some(($) => $.active.source == _.source)) ? setTimeout(() => this.startUpdate(), B) : -1, this.composing != 0)
      for (let _ of s.transactions)
        _.isUserEvent("input.type") ? this.composing = 2 : this.composing == 2 && _.selection && (this.composing = 3);
  }
  startUpdate() {
    this.debounceUpdate = -1, this.pendingStart = !1;
    let { state: s } = this.view, e = s.field(completionState);
    for (let r of e.active)
      r.isPending && !this.running.some((R) => R.active.source == r.source) && this.startQuery(r);
    this.running.length && e.open && e.open.disabled && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(completionConfig).updateSyncTime));
  }
  startQuery(s) {
    let { state: e } = this.view, r = cur(e), R = new CompletionContext(e, r, s.explicit, this.view), B = new RunningQuery(s, R);
    this.running.push(B), Promise.resolve(s.source(R)).then((_) => {
      B.context.aborted || (B.done = _ || null, this.scheduleAccept());
    }, (_) => {
      this.view.dispatch({ effects: closeCompletionEffect.of(null) }), logException(this.view.state, _);
    });
  }
  scheduleAccept() {
    this.running.every((s) => s.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(completionConfig).updateSyncTime));
  }
  // For each finished query in this.running, try to create a result
  // or, if appropriate, restart the query.
  accept() {
    var s;
    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
    let e = [], r = this.view.state.facet(completionConfig), R = this.view.state.field(completionState);
    for (let B = 0; B < this.running.length; B++) {
      let _ = this.running[B];
      if (_.done === void 0)
        continue;
      if (this.running.splice(B--, 1), _.done) {
        let F = cur(_.updates.length ? _.updates[0].startState : this.view.state), V = Math.min(F, _.done.from + (_.active.explicit ? 0 : 1)), H = new ActiveResult(_.active.source, _.active.explicit, V, _.done, _.done.from, (s = _.done.to) !== null && s !== void 0 ? s : F);
        for (let W of _.updates)
          H = H.update(W, r);
        if (H.hasResult()) {
          e.push(H);
          continue;
        }
      }
      let $ = R.active.find((F) => F.source == _.active.source);
      if ($ && $.isPending)
        if (_.done == null) {
          let F = new ActiveSource(
            _.active.source,
            0
            /* State.Inactive */
          );
          for (let V of _.updates)
            F = F.update(V, r);
          F.isPending || e.push(F);
        } else
          this.startQuery($);
    }
    (e.length || R.open && R.open.disabled) && this.view.dispatch({ effects: setActiveEffect.of(e) });
  }
}, {
  eventHandlers: {
    blur(s) {
      let e = this.view.state.field(completionState, !1);
      if (e && e.tooltip && this.view.state.facet(completionConfig).closeOnBlur) {
        let r = e.open && getTooltip(this.view, e.open.tooltip);
        (!r || !r.dom.contains(s.relatedTarget)) && setTimeout(() => this.view.dispatch({ effects: closeCompletionEffect.of(null) }), 10);
      }
    },
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: startCompletionEffect.of(!1) }), 20), this.composing = 0;
    }
  }
}), windows = typeof navigator == "object" && /* @__PURE__ */ /Win/.test(navigator.platform), commitCharacters = /* @__PURE__ */ Prec.highest(/* @__PURE__ */ EditorView.domEventHandlers({
  keydown(s, e) {
    let r = e.state.field(completionState, !1);
    if (!r || !r.open || r.open.disabled || r.open.selected < 0 || s.key.length > 1 || s.ctrlKey && !(windows && s.altKey) || s.metaKey)
      return !1;
    let R = r.open.options[r.open.selected], B = r.active.find(($) => $.source == R.source), _ = R.completion.commitCharacters || B.result.commitCharacters;
    return _ && _.indexOf(s.key) > -1 && applyCompletion(e, R), !1;
  }
})), baseTheme$1 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box",
    whiteSpace: "pre-line"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
}), defaults = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, closeBracketEffect = /* @__PURE__ */ StateEffect.define({
  map(s, e) {
    let r = e.mapPos(s, -1, MapMode.TrackAfter);
    return r ?? void 0;
  }
}), closedBracket = /* @__PURE__ */ new class extends RangeValue {
}();
closedBracket.startSide = 1;
closedBracket.endSide = -1;
const bracketState = /* @__PURE__ */ StateField.define({
  create() {
    return RangeSet.empty;
  },
  update(s, e) {
    if (s = s.map(e.changes), e.selection) {
      let r = e.state.doc.lineAt(e.selection.main.head);
      s = s.update({ filter: (R) => R >= r.from && R <= r.to });
    }
    for (let r of e.effects)
      r.is(closeBracketEffect) && (s = s.update({ add: [closedBracket.range(r.value, r.value + 1)] }));
    return s;
  }
});
function closeBrackets() {
  return [inputHandler, bracketState];
}
const definedClosing = "()[]{}<>";
function closing(s) {
  for (let e = 0; e < definedClosing.length; e += 2)
    if (definedClosing.charCodeAt(e) == s)
      return definedClosing.charAt(e + 1);
  return fromCodePoint(s < 128 ? s : s + 1);
}
function config(s, e) {
  return s.languageDataAt("closeBrackets", e)[0] || defaults;
}
const android = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), inputHandler = /* @__PURE__ */ EditorView.inputHandler.of((s, e, r, R) => {
  if ((android ? s.composing : s.compositionStarted) || s.state.readOnly)
    return !1;
  let B = s.state.selection.main;
  if (R.length > 2 || R.length == 2 && codePointSize(codePointAt(R, 0)) == 1 || e != B.from || r != B.to)
    return !1;
  let _ = insertBracket(s.state, R);
  return _ ? (s.dispatch(_), !0) : !1;
}), deleteBracketPair = ({ state: s, dispatch: e }) => {
  if (s.readOnly)
    return !1;
  let R = config(s, s.selection.main.head).brackets || defaults.brackets, B = null, _ = s.changeByRange(($) => {
    if ($.empty) {
      let F = prevChar(s.doc, $.head);
      for (let V of R)
        if (V == F && nextChar(s.doc, $.head) == closing(codePointAt(V, 0)))
          return {
            changes: { from: $.head - V.length, to: $.head + V.length },
            range: EditorSelection.cursor($.head - V.length)
          };
    }
    return { range: B = $ };
  });
  return B || e(s.update(_, { scrollIntoView: !0, userEvent: "delete.backward" })), !B;
}, closeBracketsKeymap = [
  { key: "Backspace", run: deleteBracketPair }
];
function insertBracket(s, e) {
  let r = config(s, s.selection.main.head), R = r.brackets || defaults.brackets;
  for (let B of R) {
    let _ = closing(codePointAt(B, 0));
    if (e == B)
      return _ == B ? handleSame(s, B, R.indexOf(B + B + B) > -1, r) : handleOpen(s, B, _, r.before || defaults.before);
    if (e == _ && closedBracketAt(s, s.selection.main.from))
      return handleClose(s, B, _);
  }
  return null;
}
function closedBracketAt(s, e) {
  let r = !1;
  return s.field(bracketState).between(0, s.doc.length, (R) => {
    R == e && (r = !0);
  }), r;
}
function nextChar(s, e) {
  let r = s.sliceString(e, e + 2);
  return r.slice(0, codePointSize(codePointAt(r, 0)));
}
function prevChar(s, e) {
  let r = s.sliceString(e - 2, e);
  return codePointSize(codePointAt(r, 0)) == r.length ? r : r.slice(1);
}
function handleOpen(s, e, r, R) {
  let B = null, _ = s.changeByRange(($) => {
    if (!$.empty)
      return {
        changes: [{ insert: e, from: $.from }, { insert: r, from: $.to }],
        effects: closeBracketEffect.of($.to + e.length),
        range: EditorSelection.range($.anchor + e.length, $.head + e.length)
      };
    let F = nextChar(s.doc, $.head);
    return !F || /\s/.test(F) || R.indexOf(F) > -1 ? {
      changes: { insert: e + r, from: $.head },
      effects: closeBracketEffect.of($.head + e.length),
      range: EditorSelection.cursor($.head + e.length)
    } : { range: B = $ };
  });
  return B ? null : s.update(_, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function handleClose(s, e, r) {
  let R = null, B = s.changeByRange((_) => _.empty && nextChar(s.doc, _.head) == r ? {
    changes: { from: _.head, to: _.head + r.length, insert: r },
    range: EditorSelection.cursor(_.head + r.length)
  } : R = { range: _ });
  return R ? null : s.update(B, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function handleSame(s, e, r, R) {
  let B = R.stringPrefixes || defaults.stringPrefixes, _ = null, $ = s.changeByRange((F) => {
    if (!F.empty)
      return {
        changes: [{ insert: e, from: F.from }, { insert: e, from: F.to }],
        effects: closeBracketEffect.of(F.to + e.length),
        range: EditorSelection.range(F.anchor + e.length, F.head + e.length)
      };
    let V = F.head, H = nextChar(s.doc, V), W;
    if (H == e) {
      if (nodeStart(s, V))
        return {
          changes: { insert: e + e, from: V },
          effects: closeBracketEffect.of(V + e.length),
          range: EditorSelection.cursor(V + e.length)
        };
      if (closedBracketAt(s, V)) {
        let z = r && s.sliceDoc(V, V + e.length * 3) == e + e + e ? e + e + e : e;
        return {
          changes: { from: V, to: V + z.length, insert: z },
          range: EditorSelection.cursor(V + z.length)
        };
      }
    } else {
      if (r && s.sliceDoc(V - 2 * e.length, V) == e + e && (W = canStartStringAt(s, V - 2 * e.length, B)) > -1 && nodeStart(s, W))
        return {
          changes: { insert: e + e + e + e, from: V },
          effects: closeBracketEffect.of(V + e.length),
          range: EditorSelection.cursor(V + e.length)
        };
      if (s.charCategorizer(V)(H) != CharCategory.Word && canStartStringAt(s, V, B) > -1 && !probablyInString(s, V, e, B))
        return {
          changes: { insert: e + e, from: V },
          effects: closeBracketEffect.of(V + e.length),
          range: EditorSelection.cursor(V + e.length)
        };
    }
    return { range: _ = F };
  });
  return _ ? null : s.update($, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function nodeStart(s, e) {
  let r = syntaxTree(s).resolveInner(e + 1);
  return r.parent && r.from == e;
}
function probablyInString(s, e, r, R) {
  let B = syntaxTree(s).resolveInner(e, -1), _ = R.reduce(($, F) => Math.max($, F.length), 0);
  for (let $ = 0; $ < 5; $++) {
    let F = s.sliceDoc(B.from, Math.min(B.to, B.from + r.length + _)), V = F.indexOf(r);
    if (!V || V > -1 && R.indexOf(F.slice(0, V)) > -1) {
      let W = B.firstChild;
      for (; W && W.from == B.from && W.to - W.from > r.length + V; ) {
        if (s.sliceDoc(W.to - r.length, W.to) == r)
          return !1;
        W = W.firstChild;
      }
      return !0;
    }
    let H = B.to == e && B.parent;
    if (!H)
      break;
    B = H;
  }
  return !1;
}
function canStartStringAt(s, e, r) {
  let R = s.charCategorizer(e);
  if (R(s.sliceDoc(e - 1, e)) != CharCategory.Word)
    return e;
  for (let B of r) {
    let _ = e - B.length;
    if (s.sliceDoc(_, e) == B && R(s.sliceDoc(_ - 1, _)) != CharCategory.Word)
      return _;
  }
  return -1;
}
function autocompletion(s = {}) {
  return [
    commitCharacters,
    completionState,
    completionConfig.of(s),
    completionPlugin,
    completionKeymapExt,
    baseTheme$1
  ];
}
const completionKeymap = [
  { key: "Ctrl-Space", run: startCompletion },
  { mac: "Alt-`", run: startCompletion },
  { key: "Escape", run: closeCompletion },
  { key: "ArrowDown", run: /* @__PURE__ */ moveCompletionSelection(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ moveCompletionSelection(!1) },
  { key: "PageDown", run: /* @__PURE__ */ moveCompletionSelection(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ moveCompletionSelection(!1, "page") },
  { key: "Enter", run: acceptCompletion }
], completionKeymapExt = /* @__PURE__ */ Prec.highest(/* @__PURE__ */ keymap.computeN([completionConfig], (s) => s.facet(completionConfig).defaultKeymap ? [completionKeymap] : []));
class SelectedDiagnostic {
  constructor(e, r, R) {
    this.from = e, this.to = r, this.diagnostic = R;
  }
}
class LintState {
  constructor(e, r, R) {
    this.diagnostics = e, this.panel = r, this.selected = R;
  }
  static init(e, r, R) {
    let B = e, _ = R.facet(lintConfig).markerFilter;
    _ && (B = _(B, R));
    let $ = e.slice().sort((U, z) => U.from - z.from || U.to - z.to), F = new RangeSetBuilder(), V = [], H = 0;
    for (let U = 0; ; ) {
      let z = U == $.length ? null : $[U];
      if (!z && !V.length)
        break;
      let K, X;
      for (V.length ? (K = H, X = V.reduce((Y, te) => Math.min(Y, te.to), z && z.from > K ? z.from : 1e8)) : (K = z.from, X = z.to, V.push(z), U++); U < $.length; ) {
        let Y = $[U];
        if (Y.from == K && (Y.to > Y.from || Y.to == K))
          V.push(Y), U++, X = Math.min(Y.to, X);
        else {
          X = Math.min(Y.from, X);
          break;
        }
      }
      let Z = maxSeverity(V);
      if (V.some((Y) => Y.from == Y.to || Y.from == Y.to - 1 && R.doc.lineAt(Y.from).to == Y.from))
        F.add(K, K, Decoration.widget({
          widget: new DiagnosticWidget(Z),
          diagnostics: V.slice()
        }));
      else {
        let Y = V.reduce((te, ue) => ue.markClass ? te + " " + ue.markClass : te, "");
        F.add(K, X, Decoration.mark({
          class: "cm-lintRange cm-lintRange-" + Z + Y,
          diagnostics: V.slice(),
          inclusiveEnd: V.some((te) => te.to > X)
        }));
      }
      H = X;
      for (let Y = 0; Y < V.length; Y++)
        V[Y].to <= H && V.splice(Y--, 1);
    }
    let W = F.finish();
    return new LintState(W, r, findDiagnostic(W));
  }
}
function findDiagnostic(s, e = null, r = 0) {
  let R = null;
  return s.between(r, 1e9, (B, _, { spec: $ }) => {
    if (!(e && $.diagnostics.indexOf(e) < 0))
      if (!R)
        R = new SelectedDiagnostic(B, _, e || $.diagnostics[0]);
      else {
        if ($.diagnostics.indexOf(R.diagnostic) < 0)
          return !1;
        R = new SelectedDiagnostic(R.from, _, R.diagnostic);
      }
  }), R;
}
function hideTooltip(s, e) {
  let r = e.pos, R = e.end || r, B = s.state.facet(lintConfig).hideOn(s, r, R);
  if (B != null)
    return B;
  let _ = s.startState.doc.lineAt(e.pos);
  return !!(s.effects.some(($) => $.is(setDiagnosticsEffect)) || s.changes.touchesRange(_.from, Math.max(_.to, R)));
}
function maybeEnableLint(s, e) {
  return s.field(lintState, !1) ? e : e.concat(StateEffect.appendConfig.of(lintExtensions));
}
const setDiagnosticsEffect = /* @__PURE__ */ StateEffect.define(), togglePanel = /* @__PURE__ */ StateEffect.define(), movePanelSelection = /* @__PURE__ */ StateEffect.define(), lintState = /* @__PURE__ */ StateField.define({
  create() {
    return new LintState(Decoration.none, null, null);
  },
  update(s, e) {
    if (e.docChanged && s.diagnostics.size) {
      let r = s.diagnostics.map(e.changes), R = null, B = s.panel;
      if (s.selected) {
        let _ = e.changes.mapPos(s.selected.from, 1);
        R = findDiagnostic(r, s.selected.diagnostic, _) || findDiagnostic(r, null, _);
      }
      !r.size && B && e.state.facet(lintConfig).autoPanel && (B = null), s = new LintState(r, B, R);
    }
    for (let r of e.effects)
      if (r.is(setDiagnosticsEffect)) {
        let R = e.state.facet(lintConfig).autoPanel ? r.value.length ? LintPanel.open : null : s.panel;
        s = LintState.init(r.value, R, e.state);
      } else r.is(togglePanel) ? s = new LintState(s.diagnostics, r.value ? LintPanel.open : null, s.selected) : r.is(movePanelSelection) && (s = new LintState(s.diagnostics, s.panel, r.value));
    return s;
  },
  provide: (s) => [
    showPanel.from(s, (e) => e.panel),
    EditorView.decorations.from(s, (e) => e.diagnostics)
  ]
}), activeMark = /* @__PURE__ */ Decoration.mark({ class: "cm-lintRange cm-lintRange-active" });
function lintTooltip(s, e, r) {
  let { diagnostics: R } = s.state.field(lintState), B, _ = -1, $ = -1;
  R.between(e - (r < 0 ? 1 : 0), e + (r > 0 ? 1 : 0), (V, H, { spec: W }) => {
    if (e >= V && e <= H && (V == H || (e > V || r > 0) && (e < H || r < 0)))
      return B = W.diagnostics, _ = V, $ = H, !1;
  });
  let F = s.state.facet(lintConfig).tooltipFilter;
  return B && F && (B = F(B, s.state)), B ? {
    pos: _,
    end: $,
    above: s.state.doc.lineAt(_).to < $,
    create() {
      return { dom: diagnosticsTooltip(s, B) };
    }
  } : null;
}
function diagnosticsTooltip(s, e) {
  return crelt("ul", { class: "cm-tooltip-lint" }, e.map((r) => renderDiagnostic(s, r, !1)));
}
const openLintPanel = (s) => {
  let e = s.state.field(lintState, !1);
  (!e || !e.panel) && s.dispatch({ effects: maybeEnableLint(s.state, [togglePanel.of(!0)]) });
  let r = getPanel(s, LintPanel.open);
  return r && r.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, closeLintPanel = (s) => {
  let e = s.state.field(lintState, !1);
  return !e || !e.panel ? !1 : (s.dispatch({ effects: togglePanel.of(!1) }), !0);
}, nextDiagnostic = (s) => {
  let e = s.state.field(lintState, !1);
  if (!e)
    return !1;
  let r = s.state.selection.main, R = e.diagnostics.iter(r.to + 1);
  return !R.value && (R = e.diagnostics.iter(0), !R.value || R.from == r.from && R.to == r.to) ? !1 : (s.dispatch({ selection: { anchor: R.from, head: R.to }, scrollIntoView: !0 }), !0);
}, lintKeymap = [
  { key: "Mod-Shift-m", run: openLintPanel, preventDefault: !0 },
  { key: "F8", run: nextDiagnostic }
], lintConfig = /* @__PURE__ */ Facet.define({
  combine(s) {
    return Object.assign({ sources: s.map((e) => e.source).filter((e) => e != null) }, combineConfig(s.map((e) => e.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null,
      hideOn: () => null
    }, {
      needsRefresh: (e, r) => e ? r ? (R) => e(R) || r(R) : e : r
    }));
  }
});
function assignKeys(s) {
  let e = [];
  if (s)
    e: for (let { name: r } of s) {
      for (let R = 0; R < r.length; R++) {
        let B = r[R];
        if (/[a-zA-Z]/.test(B) && !e.some((_) => _.toLowerCase() == B.toLowerCase())) {
          e.push(B);
          continue e;
        }
      }
      e.push("");
    }
  return e;
}
function renderDiagnostic(s, e, r) {
  var R;
  let B = r ? assignKeys(e.actions) : [];
  return crelt("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, crelt("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage(s) : e.message), (R = e.actions) === null || R === void 0 ? void 0 : R.map((_, $) => {
    let F = !1, V = (z) => {
      if (z.preventDefault(), F)
        return;
      F = !0;
      let K = findDiagnostic(s.state.field(lintState).diagnostics, e);
      K && _.apply(s, K.from, K.to);
    }, { name: H } = _, W = B[$] ? H.indexOf(B[$]) : -1, U = W < 0 ? H : [
      H.slice(0, W),
      crelt("u", H.slice(W, W + 1)),
      H.slice(W + 1)
    ];
    return crelt("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: V,
      onmousedown: V,
      "aria-label": ` Action: ${H}${W < 0 ? "" : ` (access key "${B[$]})"`}.`
    }, U);
  }), e.source && crelt("div", { class: "cm-diagnosticSource" }, e.source));
}
class DiagnosticWidget extends WidgetType {
  constructor(e) {
    super(), this.sev = e;
  }
  eq(e) {
    return e.sev == this.sev;
  }
  toDOM() {
    return crelt("span", { class: "cm-lintPoint cm-lintPoint-" + this.sev });
  }
}
class PanelItem {
  constructor(e, r) {
    this.diagnostic = r, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = renderDiagnostic(e, r, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class LintPanel {
  constructor(e) {
    this.view = e, this.items = [];
    let r = (B) => {
      if (B.keyCode == 27)
        closeLintPanel(this.view), this.view.focus();
      else if (B.keyCode == 38 || B.keyCode == 33)
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      else if (B.keyCode == 40 || B.keyCode == 34)
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      else if (B.keyCode == 36)
        this.moveSelection(0);
      else if (B.keyCode == 35)
        this.moveSelection(this.items.length - 1);
      else if (B.keyCode == 13)
        this.view.focus();
      else if (B.keyCode >= 65 && B.keyCode <= 90 && this.selectedIndex >= 0) {
        let { diagnostic: _ } = this.items[this.selectedIndex], $ = assignKeys(_.actions);
        for (let F = 0; F < $.length; F++)
          if ($[F].toUpperCase().charCodeAt(0) == B.keyCode) {
            let V = findDiagnostic(this.view.state.field(lintState).diagnostics, _);
            V && _.actions[F].apply(e, V.from, V.to);
          }
      } else
        return;
      B.preventDefault();
    }, R = (B) => {
      for (let _ = 0; _ < this.items.length; _++)
        this.items[_].dom.contains(B.target) && this.moveSelection(_);
    };
    this.list = crelt("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: r,
      onclick: R
    }), this.dom = crelt("div", { class: "cm-panel-lint" }, this.list, crelt("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => closeLintPanel(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(lintState).selected;
    if (!e)
      return -1;
    for (let r = 0; r < this.items.length; r++)
      if (this.items[r].diagnostic == e.diagnostic)
        return r;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: r } = this.view.state.field(lintState), R = 0, B = !1, _ = null, $ = /* @__PURE__ */ new Set();
    for (e.between(0, this.view.state.doc.length, (F, V, { spec: H }) => {
      for (let W of H.diagnostics) {
        if ($.has(W))
          continue;
        $.add(W);
        let U = -1, z;
        for (let K = R; K < this.items.length; K++)
          if (this.items[K].diagnostic == W) {
            U = K;
            break;
          }
        U < 0 ? (z = new PanelItem(this.view, W), this.items.splice(R, 0, z), B = !0) : (z = this.items[U], U > R && (this.items.splice(R, U - R), B = !0)), r && z.diagnostic == r.diagnostic ? z.dom.hasAttribute("aria-selected") || (z.dom.setAttribute("aria-selected", "true"), _ = z) : z.dom.hasAttribute("aria-selected") && z.dom.removeAttribute("aria-selected"), R++;
      }
    }); R < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      B = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new PanelItem(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), B = !0), _ ? (this.list.setAttribute("aria-activedescendant", _.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: _.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: F, panel: V }) => {
        let H = V.height / this.list.offsetHeight;
        F.top < V.top ? this.list.scrollTop -= (V.top - F.top) / H : F.bottom > V.bottom && (this.list.scrollTop += (F.bottom - V.bottom) / H);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), B && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function r() {
      let R = e;
      e = R.nextSibling, R.remove();
    }
    for (let R of this.items)
      if (R.dom.parentNode == this.list) {
        for (; e != R.dom; )
          r();
        e = R.dom.nextSibling;
      } else
        this.list.insertBefore(R.dom, e);
    for (; e; )
      r();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let r = this.view.state.field(lintState), R = findDiagnostic(r.diagnostics, this.items[e].diagnostic);
    R && this.view.dispatch({
      selection: { anchor: R.from, head: R.to },
      scrollIntoView: !0,
      effects: movePanelSelection.of(R)
    });
  }
  static open(e) {
    return new LintPanel(e);
  }
}
function svg(s, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(s)}</svg>')`;
}
function underline(s) {
  return svg(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${s}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const baseTheme = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ underline("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ underline("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ underline("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ underline("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  }
});
function severityWeight(s) {
  return s == "error" ? 4 : s == "warning" ? 3 : s == "info" ? 2 : 1;
}
function maxSeverity(s) {
  let e = "hint", r = 1;
  for (let R of s) {
    let B = severityWeight(R.severity);
    B > r && (r = B, e = R.severity);
  }
  return e;
}
const lintExtensions = [
  lintState,
  /* @__PURE__ */ EditorView.decorations.compute([lintState], (s) => {
    let { selected: e, panel: r } = s.field(lintState);
    return !e || !r || e.from == e.to ? Decoration.none : Decoration.set([
      activeMark.range(e.from, e.to)
    ]);
  }),
  /* @__PURE__ */ hoverTooltip(lintTooltip, { hideOn: hideTooltip }),
  baseTheme
], basicSetup = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(!0),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: !0 }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap
  ])
], baseURL = "http://localhost:8000/";
function loadFile(s) {
  const e = s.startsWith("http") ? s : baseURL + s;
  return fetch(e).then((r) => r.text());
}
function saveFile(s, e) {
  return fetch(baseURL + s, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "text/html"
    },
    body: e
  });
}
function getContentFromHTML(s) {
  const e = document.createElement("div");
  e.innerHTML = s;
  const r = e.querySelector("#renkon");
  return r ? r.innerHTML : "";
}
function makeHTMLFromContent(s) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"> 
    <link id="style" rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
` + s + `
  <script type="module">
  import("./src/main.js").then((mod) => mod.view());
    <\/script>
  </body>
</html>`;
}
let myResizeHandler;
const css = `html, body, #renkon {
    height: 100%;
}
body {
    margin: 0px;
}

.dock {
    position: fixed;
    top: 300px;
    left: 0px;
    display: flex;
    box-shadow: 10px 10px 5px #4d4d4d, -10px -10px 5px #dddddd;
    transition: left 0.5s;
    background-color: white;
}

.dock .editor {
    flex-grow: 1;
    margin: 0px 20px 0px 20px;
    background-color: #ffffff;
    border: 1px solid black;
}

.dock #buttonRow {
    display: flex;
}

.dock #drawerButton {
    align-self: center;
    padding: 40px 8px 40px 8px;
    cursor: pointer;
}

.dock #updateButton {
    margin-left: 40px;
}

.dock #fileName {
    border: 1px black solid;
    min-width: 160px;
    margin: 10px 10px 10px 10px;
}

.dock .button {
    margin: 10px 0px 10px 0px;
}
`;
function resizeHandler() {
  const s = document.querySelector("#dock");
  if (!s)
    return;
  const e = s.classList.contains("opened"), r = s.getBoundingClientRect().width;
  s.classList.toggle("opened", e), e ? s.style.left = `${window.innerWidth - r}px` : s.style.left = `${window.innerWidth - 80}px`;
}
function view(s) {
  const e = s == null ? void 0 : s.app, r = s == null ? void 0 : s.noTicking, R = new URL(window.location.toString());
  let B = R.searchParams.get("doc"), _;
  B && (_ = B.indexOf(";"), _ >= 0 && (B = B.slice(0, _)));
  let $ = R.searchParams.get("hideEditor");
  const F = document.body.querySelector("#renkon"), V = new ProgramState(Date.now(), e, r);
  window.programState = V;
  let { dock: H, editorView: W } = createEditorDock(F, V);
  if ($ && (H.style.display = "none"), document.body.appendChild(H), myResizeHandler && window.removeEventListener("resize", myResizeHandler), myResizeHandler = resizeHandler, window.addEventListener("resize", myResizeHandler), B) {
    document.querySelector("#fileName").textContent = B, load(F, W, V);
    return;
  }
  update(F, W, V);
}
function createEditorDock(s, e) {
  const r = document.createElement("div");
  if (r.innerHTML = `
<div id="dock" class="dock">
   <div id="drawerButton">◀️</div>
   <div id="drawerBody">
     <div id="buttonRow">
       <button id="updateButton" class="updateButton button">Update</button>
       <div contentEditable id="fileName"></div>
       <button id="loadButton" class="loadButton button">Load</button>
       <button id="saveButton" class="saveButton button">Save</button>
     </div>
     <div id="editor" class="editor"></div>
  </div>
</div>
`, !document.head.querySelector("#renkon-css")) {
    const W = document.createElement("style");
    W.textContent = css, W.id = "renkon-css", document.head.appendChild(W);
  }
  const R = r.querySelector("#dock"), B = R.querySelector("#editor");
  B.classList.add("editor");
  const _ = new EditorView({
    doc: s.innerHTML.trim(),
    extensions: [basicSetup, EditorView.lineWrapping],
    parent: B
  });
  _.dom.style.height = "500px", _.dom.style.width = "60vw";
  const $ = R.querySelector("#updateButton");
  $.textContent = "Update", $.onclick = () => update(s, _, e);
  const F = R.querySelector("#loadButton");
  F.textContent = "Load", F.onclick = () => load(s, _, e);
  const V = R.querySelector("#saveButton");
  V.textContent = "Save", V.onclick = () => save(s, _);
  const H = R.querySelector("#drawerButton");
  return H.onclick = () => toggleDock(R), toggleDock(R, !1), { dock: R, editorView: _, updateButton: $ };
}
async function update(s, e, r) {
  s.innerHTML = e.state.doc.toString();
  let B = [...s.querySelectorAll("script[type='reactive'],script[type='reactive-ts']")].map((V, H) => V.getAttribute("type") === "reactive-ts" && V.textContent ? translateTS(V.textContent, V.id || `${H}.ts`) : V.textContent).filter((V) => V), $ = [...s.querySelectorAll("script[type='renkon-jsx']")].map((V) => ({ element: V, code: V.textContent })).filter((V) => V.code);
  const F = [...B];
  if ($.length > 0) {
    const V = $.map((H, W) => {
      const U = transpileJSX(H.code), z = document.createElement("div");
      return z.id = `jsx-${W}`, H.element.style.cssText !== "" && z.setAttribute("style", H.element.style.cssText), s.insertBefore(z, H.element.nextSibling), `render(${U}, document.querySelector("#${z.id}"))`;
    });
    F.push(...V);
  }
  r.setupProgram(F), r.evaluatorRunning === 0 && r.evaluator();
}
function toggleDock(s, e) {
  const r = e !== void 0 ? e : !s.classList.contains("opened"), R = s.getBoundingClientRect().width;
  s.classList.toggle("opened", r), r ? s.style.left = `${window.innerWidth - R}px` : s.style.left = `${window.innerWidth - 80}px`;
}
function save(s, e, r) {
  const R = document.querySelector("#fileName").textContent;
  if (!R)
    return;
  const B = e.state.doc.toString(), _ = makeHTMLFromContent(B);
  saveFile(R, _);
}
async function load(s, e, r) {
  const R = document.querySelector("#fileName").textContent;
  if (!R)
    return;
  const B = await loadFile(R), _ = getContentFromHTML(B);
  e.dispatch({ changes: { from: 0, to: e.state.doc.length, insert: _ } }), update(s, e, r);
}
function dispatch(s, e, r) {
  r = r || {};
  var R = s.ownerDocument, B = R.defaultView.CustomEvent;
  typeof B == "function" ? B = new B(e, { detail: r }) : (B = R.createEvent("Event"), B.initEvent(e, !1, !1), B.detail = r), s.dispatchEvent(B);
}
function isarray(s) {
  return Array.isArray(s) || s instanceof Int8Array || s instanceof Int16Array || s instanceof Int32Array || s instanceof Uint8Array || s instanceof Uint8ClampedArray || s instanceof Uint16Array || s instanceof Uint32Array || s instanceof Float32Array || s instanceof Float64Array;
}
function isindex(s) {
  return s === (s | 0) + "";
}
function inspectName(s) {
  const e = document.createElement("span");
  return e.className = "observablehq--cellname", e.textContent = `${s} = `, e;
}
const symbolToString = Symbol.prototype.toString;
function formatSymbol(s) {
  return symbolToString.call(s);
}
const { getOwnPropertySymbols, prototype: { hasOwnProperty } } = Object, { toStringTag } = Symbol, FORBIDDEN = {}, symbolsof = getOwnPropertySymbols;
function isown(s, e) {
  return hasOwnProperty.call(s, e);
}
function tagof(s) {
  return s[toStringTag] || s.constructor && s.constructor.name || "Object";
}
function valueof(s, e) {
  try {
    const r = s[e];
    return r && r.constructor, r;
  } catch {
    return FORBIDDEN;
  }
}
const SYMBOLS = [
  { symbol: "@@__IMMUTABLE_INDEXED__@@", name: "Indexed", modifier: !0 },
  { symbol: "@@__IMMUTABLE_KEYED__@@", name: "Keyed", modifier: !0 },
  { symbol: "@@__IMMUTABLE_LIST__@@", name: "List", arrayish: !0 },
  { symbol: "@@__IMMUTABLE_MAP__@@", name: "Map" },
  {
    symbol: "@@__IMMUTABLE_ORDERED__@@",
    name: "Ordered",
    modifier: !0,
    prefix: !0
  },
  { symbol: "@@__IMMUTABLE_RECORD__@@", name: "Record" },
  {
    symbol: "@@__IMMUTABLE_SET__@@",
    name: "Set",
    arrayish: !0,
    setish: !0
  },
  { symbol: "@@__IMMUTABLE_STACK__@@", name: "Stack", arrayish: !0 }
];
function immutableName(s) {
  try {
    let e = SYMBOLS.filter(({ symbol: $ }) => s[$] === !0);
    if (!e.length) return;
    const r = e.find(($) => !$.modifier), R = r.name === "Map" && e.find(($) => $.modifier && $.prefix), B = e.some(($) => $.arrayish), _ = e.some(($) => $.setish);
    return {
      name: `${R ? R.name : ""}${r.name}`,
      symbols: e,
      arrayish: B && !_,
      setish: _
    };
  } catch {
    return null;
  }
}
const { getPrototypeOf, getOwnPropertyDescriptors } = Object, objectPrototype = getPrototypeOf({});
function inspectExpanded(s, e, r, R) {
  let B = isarray(s), _, $, F, V;
  s instanceof Map ? s instanceof s.constructor ? (_ = `Map(${s.size})`, $ = iterateMap$1) : (_ = "Map()", $ = iterateObject$1) : s instanceof Set ? s instanceof s.constructor ? (_ = `Set(${s.size})`, $ = iterateSet$1) : (_ = "Set()", $ = iterateObject$1) : B ? (_ = `${s.constructor.name}(${s.length})`, $ = iterateArray$1) : (V = immutableName(s)) ? (_ = `Immutable.${V.name}${V.name === "Record" ? "" : `(${s.size})`}`, B = V.arrayish, $ = V.arrayish ? iterateImArray$1 : V.setish ? iterateImSet$1 : iterateImObject$1) : R ? (_ = tagof(s), $ = iterateProto) : (_ = tagof(s), $ = iterateObject$1);
  const H = document.createElement("span");
  H.className = "observablehq--expanded", r && H.appendChild(inspectName(r));
  const W = H.appendChild(document.createElement("a"));
  W.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M4 7L0 1h8z' fill='currentColor' />
  </svg>`, W.appendChild(document.createTextNode(`${_}${B ? " [" : " {"}`)), W.addEventListener("mouseup", function(U) {
    U.stopPropagation(), replace(H, inspectCollapsed(s, null, r, R));
  }), $ = $(s);
  for (let U = 0; !(F = $.next()).done && U < 20; ++U)
    H.appendChild(F.value);
  if (!F.done) {
    const U = H.appendChild(document.createElement("a"));
    U.className = "observablehq--field", U.style.display = "block", U.appendChild(document.createTextNode("  … more")), U.addEventListener("mouseup", function(z) {
      z.stopPropagation(), H.insertBefore(F.value, H.lastChild.previousSibling);
      for (let K = 0; !(F = $.next()).done && K < 19; ++K)
        H.insertBefore(F.value, H.lastChild.previousSibling);
      F.done && H.removeChild(H.lastChild.previousSibling), dispatch(H, "load");
    });
  }
  return H.appendChild(document.createTextNode(B ? "]" : "}")), H;
}
function* iterateMap$1(s) {
  for (const [e, r] of s)
    yield formatMapField$1(e, r);
  yield* iterateObject$1(s);
}
function* iterateSet$1(s) {
  for (const e of s)
    yield formatSetField(e);
  yield* iterateObject$1(s);
}
function* iterateImSet$1(s) {
  for (const e of s)
    yield formatSetField(e);
}
function* iterateArray$1(s) {
  for (let e = 0, r = s.length; e < r; ++e)
    e in s && (yield formatField$1(e, valueof(s, e), "observablehq--index"));
  for (const e in s)
    !isindex(e) && isown(s, e) && (yield formatField$1(e, valueof(s, e), "observablehq--key"));
  for (const e of symbolsof(s))
    yield formatField$1(
      formatSymbol(e),
      valueof(s, e),
      "observablehq--symbol"
    );
}
function* iterateImArray$1(s) {
  let e = 0;
  for (const r = s.size; e < r; ++e)
    yield formatField$1(e, s.get(e), !0);
}
function* iterateProto(s) {
  for (const r in getOwnPropertyDescriptors(s))
    yield formatField$1(r, valueof(s, r), "observablehq--key");
  for (const r of symbolsof(s))
    yield formatField$1(
      formatSymbol(r),
      valueof(s, r),
      "observablehq--symbol"
    );
  const e = getPrototypeOf(s);
  e && e !== objectPrototype && (yield formatPrototype(e));
}
function* iterateObject$1(s) {
  for (const r in s)
    isown(s, r) && (yield formatField$1(r, valueof(s, r), "observablehq--key"));
  for (const r of symbolsof(s))
    yield formatField$1(
      formatSymbol(r),
      valueof(s, r),
      "observablehq--symbol"
    );
  const e = getPrototypeOf(s);
  e && e !== objectPrototype && (yield formatPrototype(e));
}
function* iterateImObject$1(s) {
  for (const [e, r] of s)
    yield formatField$1(e, r, "observablehq--key");
}
function formatPrototype(s) {
  const e = document.createElement("div"), r = e.appendChild(document.createElement("span"));
  return e.className = "observablehq--field", r.className = "observablehq--prototype-key", r.textContent = "  <prototype>", e.appendChild(document.createTextNode(": ")), e.appendChild(inspect(s, void 0, void 0, void 0, !0)), e;
}
function formatField$1(s, e, r) {
  const R = document.createElement("div"), B = R.appendChild(document.createElement("span"));
  return R.className = "observablehq--field", B.className = r, B.textContent = `  ${s}`, R.appendChild(document.createTextNode(": ")), R.appendChild(inspect(e)), R;
}
function formatMapField$1(s, e) {
  const r = document.createElement("div");
  return r.className = "observablehq--field", r.appendChild(document.createTextNode("  ")), r.appendChild(inspect(s)), r.appendChild(document.createTextNode(" => ")), r.appendChild(inspect(e)), r;
}
function formatSetField(s) {
  const e = document.createElement("div");
  return e.className = "observablehq--field", e.appendChild(document.createTextNode("  ")), e.appendChild(inspect(s)), e;
}
function hasSelection(s) {
  const e = window.getSelection();
  return e.type === "Range" && (e.containsNode(s, !0) || s.contains(e.anchorNode) || s.contains(e.focusNode));
}
function inspectCollapsed(s, e, r, R) {
  let B = isarray(s), _, $, F, V;
  if (s instanceof Map ? s instanceof s.constructor ? (_ = `Map(${s.size})`, $ = iterateMap) : (_ = "Map()", $ = iterateObject) : s instanceof Set ? s instanceof s.constructor ? (_ = `Set(${s.size})`, $ = iterateSet) : (_ = "Set()", $ = iterateObject) : B ? (_ = `${s.constructor.name}(${s.length})`, $ = iterateArray) : (V = immutableName(s)) ? (_ = `Immutable.${V.name}${V.name === "Record" ? "" : `(${s.size})`}`, B = V.arrayish, $ = V.arrayish ? iterateImArray : V.setish ? iterateImSet : iterateImObject) : (_ = tagof(s), $ = iterateObject), e) {
    const U = document.createElement("span");
    return U.className = "observablehq--shallow", r && U.appendChild(inspectName(r)), U.appendChild(document.createTextNode(_)), U.addEventListener("mouseup", function(z) {
      hasSelection(U) || (z.stopPropagation(), replace(U, inspectCollapsed(s)));
    }), U;
  }
  const H = document.createElement("span");
  H.className = "observablehq--collapsed", r && H.appendChild(inspectName(r));
  const W = H.appendChild(document.createElement("a"));
  W.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M7 4L1 8V0z' fill='currentColor' />
  </svg>`, W.appendChild(document.createTextNode(`${_}${B ? " [" : " {"}`)), H.addEventListener("mouseup", function(U) {
    hasSelection(H) || (U.stopPropagation(), replace(H, inspectExpanded(s, null, r, R)));
  }, !0), $ = $(s);
  for (let U = 0; !(F = $.next()).done && U < 20; ++U)
    U > 0 && H.appendChild(document.createTextNode(", ")), H.appendChild(F.value);
  return F.done || H.appendChild(document.createTextNode(", …")), H.appendChild(document.createTextNode(B ? "]" : "}")), H;
}
function* iterateMap(s) {
  for (const [e, r] of s)
    yield formatMapField(e, r);
  yield* iterateObject(s);
}
function* iterateSet(s) {
  for (const e of s)
    yield inspect(e, !0);
  yield* iterateObject(s);
}
function* iterateImSet(s) {
  for (const e of s)
    yield inspect(e, !0);
}
function* iterateImArray(s) {
  let e = -1, r = 0;
  for (const R = s.size; r < R; ++r)
    r > e + 1 && (yield formatEmpty(r - e - 1)), yield inspect(s.get(r), !0), e = r;
  r > e + 1 && (yield formatEmpty(r - e - 1));
}
function* iterateArray(s) {
  let e = -1, r = 0;
  for (const R = s.length; r < R; ++r)
    r in s && (r > e + 1 && (yield formatEmpty(r - e - 1)), yield inspect(valueof(s, r), !0), e = r);
  r > e + 1 && (yield formatEmpty(r - e - 1));
  for (const R in s)
    !isindex(R) && isown(s, R) && (yield formatField(R, valueof(s, R), "observablehq--key"));
  for (const R of symbolsof(s))
    yield formatField(formatSymbol(R), valueof(s, R), "observablehq--symbol");
}
function* iterateObject(s) {
  for (const e in s)
    isown(s, e) && (yield formatField(e, valueof(s, e), "observablehq--key"));
  for (const e of symbolsof(s))
    yield formatField(formatSymbol(e), valueof(s, e), "observablehq--symbol");
}
function* iterateImObject(s) {
  for (const [e, r] of s)
    yield formatField(e, r, "observablehq--key");
}
function formatEmpty(s) {
  const e = document.createElement("span");
  return e.className = "observablehq--empty", e.textContent = s === 1 ? "empty" : `empty × ${s}`, e;
}
function formatField(s, e, r) {
  const R = document.createDocumentFragment(), B = R.appendChild(document.createElement("span"));
  return B.className = r, B.textContent = s, R.appendChild(document.createTextNode(": ")), R.appendChild(inspect(e, !0)), R;
}
function formatMapField(s, e) {
  const r = document.createDocumentFragment();
  return r.appendChild(inspect(s, !0)), r.appendChild(document.createTextNode(" => ")), r.appendChild(inspect(e, !0)), r;
}
function format(s, e) {
  if (s instanceof Date || (s = /* @__PURE__ */ new Date(+s)), isNaN(s)) return typeof e == "function" ? e(s) : e;
  const r = s.getUTCHours(), R = s.getUTCMinutes(), B = s.getUTCSeconds(), _ = s.getUTCMilliseconds();
  return `${formatYear(s.getUTCFullYear())}-${pad(s.getUTCMonth() + 1, 2)}-${pad(s.getUTCDate(), 2)}${r || R || B || _ ? `T${pad(r, 2)}:${pad(R, 2)}${B || _ ? `:${pad(B, 2)}${_ ? `.${pad(_, 3)}` : ""}` : ""}Z` : ""}`;
}
function formatYear(s) {
  return s < 0 ? `-${pad(-s, 6)}` : s > 9999 ? `+${pad(s, 6)}` : pad(s, 4);
}
function pad(s, e) {
  return `${s}`.padStart(e, "0");
}
function formatDate(s) {
  return format(s, "Invalid Date");
}
var errorToString = Error.prototype.toString;
function formatError(s) {
  return s.stack || errorToString.call(s);
}
var regExpToString = RegExp.prototype.toString;
function formatRegExp(s) {
  return regExpToString.call(s);
}
const NEWLINE_LIMIT = 20;
function formatString(s, e, r, R) {
  if (e === !1) {
    if (count(s, /["\n]/g) <= count(s, /`|\${/g)) {
      const H = document.createElement("span");
      R && H.appendChild(inspectName(R));
      const W = H.appendChild(document.createElement("span"));
      return W.className = "observablehq--string", W.textContent = JSON.stringify(s), H;
    }
    const $ = s.split(`
`);
    if ($.length > NEWLINE_LIMIT && !r) {
      const H = document.createElement("div");
      R && H.appendChild(inspectName(R));
      const W = H.appendChild(document.createElement("span"));
      W.className = "observablehq--string", W.textContent = "`" + templatify($.slice(0, NEWLINE_LIMIT).join(`
`));
      const U = H.appendChild(document.createElement("span")), z = $.length - NEWLINE_LIMIT;
      return U.textContent = `Show ${z} truncated line${z > 1 ? "s" : ""}`, U.className = "observablehq--string-expand", U.addEventListener("mouseup", function(K) {
        K.stopPropagation(), replace(H, inspect(s, e, !0, R));
      }), H;
    }
    const F = document.createElement("span");
    R && F.appendChild(inspectName(R));
    const V = F.appendChild(document.createElement("span"));
    return V.className = `observablehq--string${r ? " observablehq--expanded" : ""}`, V.textContent = "`" + templatify(s) + "`", F;
  }
  const B = document.createElement("span");
  R && B.appendChild(inspectName(R));
  const _ = B.appendChild(document.createElement("span"));
  return _.className = "observablehq--string", _.textContent = JSON.stringify(s.length > 100 ? `${s.slice(0, 50)}…${s.slice(-49)}` : s), B;
}
function templatify(s) {
  return s.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, templatifyChar);
}
function templatifyChar(s) {
  var e = s.charCodeAt(0);
  switch (e) {
    case 8:
      return "\\b";
    case 9:
      return "\\t";
    case 11:
      return "\\v";
    case 12:
      return "\\f";
    case 13:
      return "\\r";
  }
  return e < 16 ? "\\x0" + e.toString(16) : e < 32 ? "\\x" + e.toString(16) : "\\" + s;
}
function count(s, e) {
  for (var r = 0; e.exec(s); ) ++r;
  return r;
}
var toString$1 = Function.prototype.toString, TYPE_ASYNC = { prefix: "async ƒ" }, TYPE_ASYNC_GENERATOR = { prefix: "async ƒ*" }, TYPE_CLASS = { prefix: "class" }, TYPE_FUNCTION = { prefix: "ƒ" }, TYPE_GENERATOR = { prefix: "ƒ*" };
function inspectFunction(s, e) {
  var r, R, B = toString$1.call(s);
  switch (s.constructor && s.constructor.name) {
    case "AsyncFunction":
      r = TYPE_ASYNC;
      break;
    case "AsyncGeneratorFunction":
      r = TYPE_ASYNC_GENERATOR;
      break;
    case "GeneratorFunction":
      r = TYPE_GENERATOR;
      break;
    default:
      r = /^class\b/.test(B) ? TYPE_CLASS : TYPE_FUNCTION;
      break;
  }
  return r === TYPE_CLASS ? formatFunction(r, "", e) : (R = /^(?:async\s*)?(\w+)\s*=>/.exec(B)) ? formatFunction(r, "(" + R[1] + ")", e) : (R = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(B)) ? formatFunction(r, R[1] ? "(" + R[1].replace(/\s*,\s*/g, ", ") + ")" : "()", e) : (R = /^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(B)) ? formatFunction(r, R[1] ? "(" + R[1].replace(/\s*,\s*/g, ", ") + ")" : "()", e) : formatFunction(r, "(…)", e);
}
function formatFunction(s, e, r) {
  var R = document.createElement("span");
  R.className = "observablehq--function", r && R.appendChild(inspectName(r));
  var B = R.appendChild(document.createElement("span"));
  return B.className = "observablehq--keyword", B.textContent = s.prefix, R.appendChild(document.createTextNode(e)), R;
}
const { prototype: { toString } } = Object;
function inspect(s, e, r, R, B) {
  let _ = typeof s;
  switch (_) {
    case "boolean":
    case "undefined": {
      s += "";
      break;
    }
    case "number": {
      s = s === 0 && 1 / s < 0 ? "-0" : s + "";
      break;
    }
    case "bigint": {
      s = s + "n";
      break;
    }
    case "symbol": {
      s = formatSymbol(s);
      break;
    }
    case "function":
      return inspectFunction(s, R);
    case "string":
      return formatString(s, e, r, R);
    default: {
      if (s === null) {
        _ = null, s = "null";
        break;
      }
      if (s instanceof Date) {
        _ = "date", s = formatDate(s);
        break;
      }
      if (s === FORBIDDEN) {
        _ = "forbidden", s = "[forbidden]";
        break;
      }
      switch (toString.call(s)) {
        case "[object RegExp]": {
          _ = "regexp", s = formatRegExp(s);
          break;
        }
        case "[object Error]":
        case "[object DOMException]": {
          _ = "error", s = formatError(s);
          break;
        }
        default:
          return (r ? inspectExpanded : inspectCollapsed)(s, e, R, B);
      }
      break;
    }
  }
  const $ = document.createElement("span");
  R && $.appendChild(inspectName(R));
  const F = $.appendChild(document.createElement("span"));
  return F.className = `observablehq--${_}`, F.textContent = s, $;
}
function replace(s, e) {
  s.classList.contains("observablehq--inspect") && e.classList.add("observablehq--inspect"), s.parentNode.replaceChild(e, s), dispatch(e, "load");
}
const LOCATION_MATCH = /\s+\(\d+:\d+\)$/m;
class Inspector {
  constructor(e) {
    if (!e) throw new Error("invalid node");
    this._node = e, e.classList.add("observablehq");
  }
  pending() {
    const { _node: e } = this;
    e.classList.remove("observablehq--error"), e.classList.add("observablehq--running");
  }
  fulfilled(e, r) {
    const { _node: R } = this;
    if ((!isnode(e) || e.parentNode && e.parentNode !== R) && (e = inspect(e, !1, R.firstChild && R.firstChild.classList && R.firstChild.classList.contains("observablehq--expanded"), r), e.classList.add("observablehq--inspect")), R.classList.remove("observablehq--running", "observablehq--error"), R.firstChild !== e)
      if (R.firstChild) {
        for (; R.lastChild !== R.firstChild; ) R.removeChild(R.lastChild);
        R.replaceChild(e, R.firstChild);
      } else
        R.appendChild(e);
    dispatch(R, "update");
  }
  rejected(e, r) {
    const { _node: R } = this;
    for (R.classList.remove("observablehq--running"), R.classList.add("observablehq--error"); R.lastChild; ) R.removeChild(R.lastChild);
    var B = document.createElement("div");
    B.className = "observablehq--inspect", r && B.appendChild(inspectName(r)), B.appendChild(document.createTextNode((e + "").replace(LOCATION_MATCH, ""))), R.appendChild(B), dispatch(R, "error", { error: e });
  }
}
Inspector.into = function(s) {
  if (typeof s == "string" && (s = document.querySelector(s), s == null))
    throw new Error("container not found");
  return function() {
    return new Inspector(s.appendChild(document.createElement("div")));
  };
};
function isnode(s) {
  return (s instanceof Element || s instanceof Text) && s instanceof s.constructor;
}
const inspectorCSS = `
:root{--syntax_normal:#1b1e23;--syntax_comment:#a9b0bc;--syntax_number:#20a5ba;--syntax_keyword:#c30771;--syntax_atom:#10a778;--syntax_string:#008ec4;--syntax_error:#ffbedc;--syntax_unknown_variable:#838383;--syntax_known_variable:#005f87;--syntax_matchbracket:#20bbfc;--syntax_key:#6636b4;--mono_fonts:82%/1.5 Menlo,Consolas,monospace}
.observablehq--collapsed,.observablehq--expanded,.observablehq--function,.observablehq--gray,.observablehq--import,.observablehq--string:after,.observablehq--string:before{color:var(--syntax_normal)}
.observablehq--collapsed,.observablehq--inspect a{cursor:pointer}
.observablehq--field{text-indent:-1em;margin-left:1em}.observablehq--empty{color:var(--syntax_comment)}
.observablehq--blue,.observablehq--keyword{color:#3182bd}.observablehq--forbidden,.observablehq--pink{color:#e377c2}
.observablehq--orange{color:#e6550d}.observablehq--boolean,.observablehq--null,.observablehq--undefined{color:var(--syntax_atom)}
.observablehq--bigint,.observablehq--date,.observablehq--green,.observablehq--number,.observablehq--regexp,.observablehq--symbol{color:var(--syntax_number)}
.observablehq--index,.observablehq--key{color:var(--syntax_key)}.observablehq--prototype-key{color:#aaa}
.observablehq--empty{font-style:oblique}.observablehq--purple,.observablehq--string{color:var(--syntax_string)}
.observablehq--error,.observablehq--red{color:#e7040f}
.observablehq--inspect{font:var(--mono_fonts);overflow-x:auto;display:block;white-space:pre}
.observablehq--error .observablehq--inspect{word-break:break-all;white-space:pre-wrap}`;
function newInspector(s, e) {
  if (!document.head.querySelector("#inspector-css")) {
    const R = document.createElement("link");
    R.rel = "stylesheet", R.type = "text/css", R.textContent = inspectorCSS, R.id = "inspector-css", document.head.appendChild(R);
  }
  const r = new Inspector(e);
  return r.fulfilled(s), r;
}
export {
  ProgramState,
  newInspector,
  parseJSX,
  translateTS,
  transpileJSX,
  view
};
