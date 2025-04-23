const msgGrammar = String.raw`
Navigator {
  Msg = description? (Head Params spaces)?
  
  description = "#" (~nl any)* nl?

  Head = msgTarget msgName

  msgTarget
    = interpolation   -- interpolation
    | templateString  -- templateString
    | (~space any)*   -- literal

  msgName
    = letter (alnum | "_" | "-" | ":" | "." | "+" | "/")*  -- literal
    | templateString                                       -- templateString
    | interpolation                                        -- interpolation

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
    | interpolation                     -- interpolation

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

  fieldSelector
    = "." ident        -- dot
    | "[" ident "]"    -- bracketIdent
    | "[" number "]"   -- bracketNumber
    | "[" string "]"   -- bracketString

  fieldReference = ident fieldSelector*

  interpolation = "$" "{" fieldReference "}"

  templateString = "\u{0060}" templateStringCharacter* "\u{0060}"

  templateStringCharacter
    = "\\" any           -- escaped
    | interpolation      -- interpolation
    | ~"\u{0060}" any    -- nonEscaped

  comment
    = "//" (~nl any)* nl  -- cppComment
    | "/*" (~"*/" any)* "*/" -- cComment

  empty =
  space += comment
  nl = "\n"
}
`;

export function makeParser({ohm}) {
    const g = ohm.grammar(msgGrammar);
    const s = g.createSemantics();
    s.addOperation(
        "toMsg",
        {
            Msg(d, h, p, _s) {
                return env => {
                    const description = d.numChildren ? d.children[0].sourceString.substring(1).trimLeft() : ''
                    const command = h.numChildren ? h.children[0].toMsg()(env) : {};
                    const parameters = p.numChildren ? p.children[0].toMsg()(env) : undefined;

                    return {...command, description, parameters};
                }
            },

            msgTarget_literal(a) {
                return env => this.sourceString
            },
            msgTarget_interpolation(i) {
                return i.toMsg()
            },
            msgTarget_templateString(s) {
                return s.toMsg()
            },
            msgName_literal(s, l) {
                return env => this.sourceString
            },
            msgName_templateString(s) {
                return s.toMsg()
            },
            msgName_interpolation(i) {
                return i.toMsg()
            },
            Json_interpolation(i) {
                return i.toMsg()
            },
            templateStringCharacter_escaped(s, a) {
                return env => this.sourceString
            },
            templateStringCharacter_nonEscaped(a) {
                return env => this.sourceString
            },
            templateStringCharacter_interpolation(i) {
                return i.toMsg()
            },
            interpolation(d, lb, fr, lr) {
                return fr.toMsg()
            },
            fieldReference(head, sel) {
                // TODO
                const initial = head.toMsg()
                const children = sel.toMsg()
                return env => children(env).reduce((acc, child) => acc[child], env.lookup(initial(env)))
            },

            // "." ident        -- dot
            fieldSelector_dot(d, i) {
                return env => i.sourceString
            },
            //| "[" ident "]"    -- bracketIdent
            fieldSelector_bracketIdent(l, i, r) {
                return env => i.sourceString
            },
            // | "[" number "]"   -- bracketNumber
            fieldSelector_bracketNumber(l, n, r) {
                return env => +i.sourceString
            },
            // | "[" string "]"   -- bracketString
            fieldSelector_bracketString(l, s, r) {
                return s.toMsg()
            },
        

            Head(msgTarget, msgName) {
                const target = msgTarget.toMsg()
                const name = msgName.toMsg()
                return env => {
                    const t = target(env)
                    const n = name(env)
                    // console.log({target: t})
                    return {
                        viewCommand: t === "$",
                        target: t,
                        command: n,
                    };
                }
            },

            Params(rest) {
                return env => {
                    const result = {};
                    for (let i = 0; i < rest.children.length; i++) {
                        const pValue = rest.children[i].toMsg()(env);
                        result[pValue.key] = pValue.value;
                    }
                    return result;
                }
            },

            Param(key, _c, json) {
                return env => {
                    // console.log("Param", key.sourceString, json.sourceString);
                    return {key: key.toMsg()(env), value: json.toMsg()(env)}
                }
            },

            Json_object1(_ob, param1, rest, rest2, _cc, _cb) {
                return env => {
                    // console.log("Json_object1", param1.sourceString, rest.sourceString, rest2.sourceString);
                    const result = {};
                    const param1Command = param1.toMsg()(env);
                    result[param1Command.key] = param1Command.value;

                    for (let i = 0; i < rest2.children.length; i++) {
                        const param1Command = rest2.children[i].toMsg()(env);
                        result[param1Command.key] = param1Command.value;
                    }

                    return result;
                }
            },
                
            Json_object0(_ob, _cb) {
                //  console.log("Json_object0");
                return env => ({});
            },

            Json_array1(_ob, json1, _rest, rest2, _cc, _cb) {
                // console.log("Json_array1", json1.sourceString, rest, sourceString);
                return env => {
                    const result = [];
                    const json1Command = json1.toMsg()(env);
                    result.push(json1Command);

                    for (let i = 0; i < rest2.children.length; i++) {
                        const json1Command = rest2.children[i].children[0].toMsg()(env);
                        result.push(json1Command);
                    }

                    return result;
                }
            },

            Json_array0(_ob, _cb) {
                // console.log("Json_array0");
                return env => [];
            },

            Json_string(str) {
                // console.log("Json_string", str.sourceString);
                return env => str.toMsg()(env);
            },

            Json_number(n) {
                // console.log("Json_number", n.sourceString);
                return env => n.toMsg()(env);
            },

            boolean(b) {
                return env => b.sourceString === 'true';
            },

            ident(_h, _r) {
                // console.log("ident", this.sourceString);
                return env => this.sourceString;
            },

            key(k) {
                return env => k.toMsg()(env);
            },

            number_fract(i, _p, f) {
                return env => parseFloat(`${i.sourceString}.${f.sourceString}`);
            },

            number_whole(f) {
                return env => parseFloat(`${f.sourceString}`);
            },

            string(_od, s, _cd) {
                return env => s.sourceString;
            },

            _iter(...children) {
                const c = children.map(c => c.toMsg());
                return env => c.map(f => f(env))
            },

            templateString(_od, s, _cd) {
                const children = s.toMsg()
                return env => children(env).join("");
            },
        }
    );

    return {
        grammar: g,
        semantics: s,
        parse: str => {
            const match = g.match(str);
            if (!match.succeeded()) {
                const error = new Error("parse error");
                error.reason = "parse error";
                error.expected = "Expected: " + match.getExpectedText();
                error.pos = match.getRightmostFailurePosition();
                error.src = str;
                throw error;
            }
        
            return s(match).toMsg();
        },
    }
}

export function parse(str) {
    const {parse} = makeParser({ohm})
    return parse(str)
}
