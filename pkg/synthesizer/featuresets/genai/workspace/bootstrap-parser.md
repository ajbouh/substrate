## Notation

- Putting ... as the only line below a heading means the value exists is, but it is hidden
- A heading with just a reference in it means "show the value now"

## Bootstrap examples

### Task: simple sum
#### Source
```javascript
return task.sections.Inputs.a + task.section.Inputs.b
```
#### Inputs
```json
{"a": 1, "b": 41}
```
#### Outputs
```json
42
```

### A new h3 to show tasks at different levels

#### An empty section

#### Task: simple max
##### Source
```javascript
return Math.max(...task.sections.Inputs)
```
##### Inputs
```json
[1, 2, 3, 4]
```
##### Outputs
```json
4
```

### Sample Library
#### doubler
```javascript
return 2 * task.sections.Inputs.n
```

### Task: try doubler
#### Source
`### Sample Library > #### doubler`
#### Inputs
```json
{"n": 1}
```
#### Outputs
```json
2
```

### Task: backsolve simple
#### Inputs
`### Task: simple sum > #### Inputs`
#### Outputs
`### Task: try doubler > #### Outputs`
#### Source
...
### `### Task: backsolve simple > #### Source`
```javascript
return 2 * task.sections.Inputs.a;
```

## Bootstrap implementation

### Library

#### Parser
##### Source
...

#### Query
##### Source
...

#### Sections
##### Source
...

Note: code in the section prioritizes minimalism and elegance

### Task: simple parser
#### Source
`### Library > #### Parser > ##### Source`
#### Inputs
`## Bootstrap examples`
#### Outputs
```json
[
  [["### Task: simple sum", "#### Source"], "```javascript\nreturn task.sections.Inputs.a + task.section.Inputs.b\n```"],
  [["### Task: simple sum", "#### Inputs"], "```json\n{\"a\": 1, \"b\": 41}\n```"],
  [["### Task: simple sum", "#### Outputs"], "```json\n42\n```"],
  [["### Another heading level", "#### An empty section"], ""],
  [["### Another heading level", "#### Task: simple max", "##### Source"], "```javascript\nreturn Math.max(...task.sections.Inputs)\n```"],
  [["### Another heading level", "#### Task: simple max", "##### Inputs"], "```json\n[1, 2, 3, 4]\n```"],
  [["### Another heading level", "#### Task: simple max", "##### Outputs"], "```json\n4\n```"],
  [["### Task: try doubler", "#### Source"], "`### Sample Library > #### doubler`"],
  [["### Task: try doubler", "#### Inputs"], "```json\n{\"n\": 1}\n```"],
  [["### Task: try doubler", "#### Outputs"], "```json\n2\n```"],
  [["### Task: backsolve simple", "#### Inputs"], "`### Task: simple sum > #### Inputs`"],
  [["### Task: backsolve simple", "#### Outputs"], "`### Task: try doubler > #### Outputs`"],
  [["### Task: backsolve simple", "#### Source"], "```javascript\nreturn 2 * task.sections.Inputs.a;\n```"]
]
```

### Task: query selector 1
#### Document
`## Bootstrap examples`
#### Inputs
```json
{"selector": "#### Outputs"}
```
#### Outputs
```json
[
  [["### Task: simple sum", "#### Outputs"], "```json\n42\n```"],
  [["### Task: try doubler", "#### Outputs"], "```json\n2\n```"],
  [["### Task: backsolve simple", "#### Outputs"], "`### Task: try doubler > #### Outputs`"],
]
```
#### Source
`### Library > #### Query > ##### Source`

### Task: query selector 2
#### Document
`## Bootstrap examples`
#### Inputs
```json
{"selector": "### Another heading level"}
```
#### Outputs
```json
[
  [["### Another heading level", "##### Source"], "```javascript\nreturn Math.max(...task.sections.Inputs)\n```"],
  [["### Another heading level", "#### Task: simple max", "##### Inputs"], "```json\n[1, 2, 3, 4]\n```"],
  [["### Another heading level", "#### Task: simple max", "##### Outputs"], "```json\n4\n```"],
]
```
#### Source
`### Library > #### Query > ##### Source`

### Task: sections list
#### Inputs
```json
{
  "text": "##### Odds\n```json\n[1, 3, 5]\n```\n##### Text\nHello\n\n```json\n\"With an unparsed json block\"\n```"
}
```
#### Outputs
```json
{
  "Odds": [1, 3, 5],
  "Outputs": "Hello\n```json\n\"With an unparsed json block\"\n```"
}
```
#### Source
`### Library > #### Sections > ##### Source`

## `### Library > #### Sections > ##### Source`

```markdown table-of-contents
## `### Library > #### Sections > ##### Source`
## `### Library > #### Parser > ##### Source`
## `### Library > #### Query > ##### Source`

```
<!-- Complete the rest of this section by adding the missing child headings and subsequent content. A `...` in the block above means zero or more headings at the given level or higher can improvised based on the context. Write each missing section in full, including its corresponding `markdown table-of-contents` block. Do not use placeholders in document text unless explicitly instructed to do so. -->

## `### Library > #### Sections > ##### Source`
```javascript
function sections(task) {
    const depth = task.depth
    const splitPattern = new RegExp(`(?=^#${depth}s)`, "m")
    const stripPattern = new RegExp(`#${depth}\s*`)
    return task.sections.Inputs
        .trim()
        .split(splitPattern)
        .reduce((acc, section) => {
            if (!section.trim()) return acc;
            const lines = section.trim().split('\n');
            const key = lines.shift().replace(stripPattern, '').trim();
            const content = lines.join('\n').trim();
            const jsonMatch = content.match(/^```json\n([\s\S]+)\n```$/);
            try {
                acc[key] = jsonMatch ? JSON.parse(jsonMatch[1]) : content;
            } catch (e) {
                acc[key] = content;
            }
            return acc;
        }, {});
}
```

## `### Library > #### Parser > ##### Source`
```javascript
function parse(task) {
    const result = [];
    const lines = task.sections.Inputs.trim().split('\n');
    let path = []; // A stack of {level, title} objects to track the current path

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(#+)\s*(.*)/);

        if (match) {
            const level = match[1].length;
            const title = line.trim();

            // Adjust the path stack by removing deeper or same-level headings
            while (path.length > 0 && path[path.length - 1].level >= level) {
                path.pop();
            }
            path.push({ level, title });

            // Find the content for the current heading, which ends at the next heading
            let contentEnd = i + 1;
            while (contentEnd < lines.length && !lines[contentEnd].startsWith('#')) {
                contentEnd++;
            }
            
            // Check if the next heading is a child (deeper level)
            const nextHeadingLevel = contentEnd < lines.length ? lines[contentEnd].match(/^(#+)/)?.[1].length : 0;
            const isParent = nextHeadingLevel > level;

            // A section is a "leaf" if it's not a parent to other headings
            if (!isParent) {
                const content = lines.slice(i + 1, contentEnd).join('\n').trim();
                result.push([path.map(p => p.title), content]);
            }
        }
    }
    return result;
}
```
