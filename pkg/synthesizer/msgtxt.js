const msgGrammar = String.raw`
Msg {
  Msg = description? (Head Params spaces)? (">" Params)?
  
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
    | ident                             -- ident

  ident = (letter | "_" | "/" | ".") (alnum | "_" | "-" | "/" | ".")*
  key = ident | string

  boolean = "true" | "false"

  number
    = ("+" | "-")? digit* "." digit+  -- fract
    | ("+" | "-")? digit+             -- whole

  string = "\"" doubleStringCharacter* "\""

  doubleStringCharacter
    = "\\" any           -- escaped
    | ~"\"" any          -- nonEscaped

  fieldSelector
    = "." ident        -- dot
    | "[" ident "]"    -- bracketIdent
    | "[" number "]"   -- bracketNumber
    | "[" string "]"   -- bracketString

  fieldReferenceIdent = ident
  fieldReference
    = fieldReferenceIdent
      fieldSelector*

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

const identPattern = /^[a-zA-Z_/.][a-zA-Z0-9_\-/\.]*$/

export const formatter = {
    formatParameterValues(value) {
        return Object.entries(value).map(([k, v]) => `${this.formatValue(k)}: ${this.formatValue(v)}`).join(" ")
    },
    formatValue(value) {
        switch (typeof value) {
        case 'object':
            return Array.isArray(value)
                ? `[${value.map(v => formatValue(v)).join(",")}]`
                : `{${this.formatParameterValues(value)}}`
        case 'string':
            return identPattern.test(value)
                ? value
                : JSON.stringify(value)
        }
        return JSON.stringify(value)
    },
}

export function makeParser({ohm}) {
    const g = ohm.grammar(msgGrammar);
    const s = g.createSemantics();

    const withDstPrefix = (prefix, input) => (input || []).map(({dst, src}) => ({dst: [...prefix, ...dst], src}))
    s.addOperation(
        "fieldSelector",
        {
            fieldReferenceIdent: (i) => [i.sourceString],
            // "." ident        -- dot
            fieldSelector_dot: (d, i) => [i.sourceString],
            //| "[" ident "]"    -- bracketIdent
            fieldSelector_bracketIdent: (l, i, r) => [i.sourceString],
            // | "[" number "]"   -- bracketNumber
            fieldSelector_bracketNumber: (l, n, r) => [+n.sourceString],
            // | "[" string "]"   -- bracketString
            fieldSelector_bracketString: (l, s, r) => [s.fieldSelector()],
            string: (_od, s, _cd) => s.sourceString,
            _iter: (...children) => children.flatMap(c => c.fieldSelector()),
        }
    );
    s.addOperation(
        "toMsg",
        {
            Msg(d, h, p, _s, _lt, outP) {
                const description = d.numChildren ? d.children[0].sourceString.substring(1).trimLeft() : ''
                const head = h.numChildren ? h.children[0].toMsg() : {};
                const parameters = p.numChildren ? p.children[0].toMsg() : undefined;

                return {
                    input: [
                        ...withDstPrefix(["parameters"], parameters.input),
                        ...head.input,
                    ],
                    next: outP.numChildren ? outP.toMsg() : undefined,
                    value: {
                        ...head.value,
                        description,
                        parameters: parameters.value,
                    }
                };
            },

            msgTarget_literal(a) { return {value: this.sourceString} },
            msgTarget_interpolation: (i) => i.toMsg(),
            msgTarget_templateString: (s) => s.toMsg(),
            msgName_literal(s, l) { return {value: this.sourceString} },
            msgName_templateString: (s) => s.toMsg(),
            msgName_interpolation: (i) => i.toMsg(),
            Json_interpolation: (i) => i.toMsg(),
            Json_ident: (i) => i.toMsg(),
            templateStringCharacter_escaped(s, a) { return {value: this.sourceString} },
            templateStringCharacter_nonEscaped(a) { return {value: this.sourceString} },
            templateStringCharacter_interpolation: (i) => i.toMsg(),
            interpolation: (d, lb, fr, lr) =>  fr.toMsg(),

            fieldReference: (head, sel) => ({
                input: [{src: [...head.fieldSelector(), ...sel.fieldSelector()], dst: []}],
            }),


            Head(msgTarget, msgName) {
                const target = msgTarget.toMsg()
                const name = msgName.toMsg()

                // console.log({target: t})
                return {
                    input: [
                        ...withDstPrefix(["target"], target.input),
                        ...withDstPrefix(["command"], name.input),
                    ],
                    value: {
                        viewCommand: target.value === "$",
                        target: target.value,
                        command: name.value,
                    },
                };
            },

            Params(rest) {
                const input = []
                const value = {};
                for (let i = 0; i < rest.children.length; i++) {
                    const {input: pInput, value: pValue} = rest.children[i].toMsg();
                    input.push(...pInput)
                    value[pValue.key] = pValue.value;
                }
                return {
                    input,
                    value,
                }
            },

            Param(key, _c, json) {
                const k = key.toMsg()
                const v = json.toMsg()
                return {
                    // console.log("Param", key.sourceString, json.sourceString);
                    input: [
                        ...(k.input || []),
                        ...withDstPrefix([k.value], v.input),
                    ],
                    value: {
                        key: k.value,
                        value: v.value,
                    },
                }
            },

            Json_object1(_ob, param1, rest, rest2, _cc, _cb) {

                // console.log("Json_object1", param1.sourceString, rest.sourceString, rest2.sourceString);
                const input = [];
                const value = {};
                const entry = param1.toMsg();
                input.push(...entry.input)
                value[entry.value.key] = entry.value.value;

                for (let i = 0; i < rest2.children.length; i++) {
                    const entry = rest2.children[i].toMsg();
                    input.push(...entry.input)
                    value[entry.key] = entry.value;
                }

                return {input, value}
            },
                
            Json_object0: (_ob, _cb) => ({value: {} }),

            Json_array1(_ob, json1, _rest, rest2, _cc, _cb) {
                // console.log("Json_array1", json1.sourceString, rest, sourceString);
                const input = []
                const value = [];
                const elt = json1.toMsg();
                let i = 0
                input.push(...withDstPrefix([i], elt.input))
                value.push(elt.value);
                i++;

                for (let j = 0; j < rest2.children.length; j++) {
                    const elt = rest2.children[j].children[0].toMsg()(env);
                    input.push(...withDstPrefix([i], elt.input))
                    value.push(elt.value);
                    i++;
                }

                return value;
            },

            Json_array0: (_ob, _cb) => ({value: []}),
            Json_string: (str) => str.toMsg(),
            Json_number: (n) => n.toMsg(),
            key: (k) => k.toMsg(),
            boolean: (b) => ({value: b.sourceString === 'true'}),
            ident(_h, _r) { return {value: this.sourceString} },
            number_fract(s, i, _p, f) { return {value: parseFloat(this.sourceString)} },
            number_whole(s, f) { return {value: parseFloat(this.sourceString)} },
            string: (_od, s, _cd) => ({value: s.sourceString}),

            _iter(...children) {
                const input = []
                const value = []
                for (const child of children.map(c => c.toMsg())) {
                    input.push(...child.input)
                    value.push(child.value)
                }
                return {input, value}
            },

            templateString(_od, s, _cd) {
                const {input, value} = s.toMsg()
                return {
                    input,
                    value: value.join(""),
                }
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
                console.log({...error})
                throw error;
            }
            return s(match)
        },
    }
}
