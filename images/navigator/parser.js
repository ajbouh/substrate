let navigatorGrammar = String.raw`
Navigator {
  Msg = description? (Head Params spaces)?
  
  description = "#" (~nl any)* nl?

  Head = msgTarget? msgName

  msgTarget = "@" (~space any)*

  msgName = letter (alnum | "_" | "-" | ":" | "." | "+" | "/")*

  Params = Param*

  Param = key ":" Json

  Json
    = "{" Param ("," Param)* ","? "}"   -- object1
    | "{" "}"                           -- object0
    | "[" Json ("," Json)* ","? "]"     -- array1
    | "["  "]"                          -- array0
    | string                            -- string
    | templateString                    -- templateString
    | number                            -- number
    | boolean                           -- boolean

  ident = letter (alnum | "_")*
  key = ident | string

  boolean = "true" | "false"

  number
    = digit* "." digit+  -- fract
    | digit+             -- whole

  string = "\"" doubleStringCharacter* "\""

  doubleStringCharacter
    = "\\" any           -- escaped
    | ~"\"" any          -- nonEscaped

  templateString = "\u{0060}" templateStringCharacter* "\u{0060}"

  templateStringCharacter
    = "\\" any           -- escaped
    | ~"\u{0060}" any          -- nonEscaped

  comment
    = "//" (~nl any)* nl  -- cppComment
    | "/*" (~"*/" any)* "*/" -- cComment

  empty =
  space += comment
  nl = "\n"
}
`;

let g;
let s;

export function initGrammar() {
    g = ohm.grammar(navigatorGrammar);
    let result;

    s = g.createSemantics();

    s.addOperation(
        "toMsg",
        {
            Msg(d, h, p, _s) {
                const description = d.numChildren ? d.children[0].sourceString.substring(1).trimLeft() : ''
                const command = h.numChildren ? h.children[0].toMsg() : {};
                const params = p.numChildren ? p.children[0].toMsg() : undefined;

                return {...command, description, params};
            },

            Head(msgTarget, msgName) {
                console.log({msgTarget})
                const target = msgTarget.numChildren ? msgTarget.sourceString.substring(1) : undefined
                console.log({target})
                return {
                    viewCommand: target !== undefined && target.length === 0,
                    target: target,
                    command: msgName.sourceString,
                };
            },

            Params(rest) {
                const result = {};
                for (let i = 0; i < rest.children.length; i++) {
                    const pValue = rest.children[i].toMsg();
                    result[pValue.key] = pValue.value;
                }
                return result;
            },

            Param(key, _c, json) {
                // console.log("Param", key.sourceString, json.sourceString);
                return {key: key.toMsg(), value: json.toMsg()}
            },

            Json_object1(_ob, param1, rest, rest2, _cc, _cb) {
                // console.log("Json_object1", param1.sourceString, rest.sourceString, rest2.sourceString);
                const result = {};
                const param1Command = param1.toMsg();
                result[param1Command.key] = param1Command.value;

                for (let i = 0; i < rest2.children.length; i++) {
                    const param1Command = rest2.children[i].toMsg();
                    result[param1Command.key] = param1Command.value;
                }

                return result;
            },
                
            Json_object0(_ob, _cb) {
                //  console.log("Json_object0");
                return {};
            },

            Json_array1(_ob, json1, _rest, rest2, _cc, _cb) {
                // console.log("Json_array1", json1.sourceString, rest, sourceString);
                const result = [];
                const json1Command = json1.toMsg();
                result.push(json1Command);

                for (let i = 0; i < rest2.children.length; i++) {
                    const json1Command = rest2.children[i].children[0].toMsg();
                    result.push(json1Command);
                }

                return result;
            },

            Json_array0(_ob, _cb) {
                // console.log("Json_array0");
                return [];
            },

            Json_string(str) {
                console.log("Json_string", str.sourceString);
                return str.toMsg();
            },

            Json_number(n) {
                // console.log("Json_number", n.sourceString);
                return n.toMsg();
            },

            boolean(b) {
                return b.sourceString === 'true'
            },

            ident(_h, _r) {
                // console.log("ident", this.sourceString);
                return this.sourceString;
            },

            key(k) {
                return k.toMsg();
            },

            number_fract(i, _p, f) {
                return parseFloat(`${i.sourceString}.${f.sourceString}`);
            },

            number_whole(f) {
                return parseFloat(`${f.sourceString}`);
            },

            string(_od, s, _cd) {
                return s.sourceString;
            },

            templateString(_od, s, _cd) {
                return s.sourceString;
            }
        }
    );

    return g;
}

export function translate(str) {
    let match = g.match(str);
    if (!match.succeeded()) {
        console.log(str);
        console.log("did not parse: " + str);
        let error = new Error("parse error");
        error.reason = "parse error";
        error.expected = "Expected: " + match.getExpectedText();
        error.pos = match.getRightmostFailurePosition();
        error.src = str;
        throw error;
    }

    let n = s(match);
    const result = n.toMsg();
    console.log(result)
    return result;
}

export function test(str) {
    return translate(str);
}
