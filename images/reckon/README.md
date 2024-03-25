# Reckon

Reckon is an experimental AI-powered augmented writing environment.

Author's note: Perhaps "awe" would be a better name.

## Concepts

Reckon brings together a few concepts to provide a flexible, extensible writing environment. The two most important are "regions" and "operations".

- A region is a span of contiguous text. It can be a single letter or multiple lines. In a sense, a region is a bit analogous to a "cell" in a spreadsheet. It is also similar in concept to the "current selection" in other writing environments.
- An operation is a procedure whose primary output is recorded in a region. Most operations take input from one region and generate output in another. For example an operation might summarize the input region or generate a table of contents.

### Regions

The simplest region is the current selection. If there's nothing selected, the system will create a region on the fly that begins at the beginning of the document up to the cursor.

### Operations

Operations are most frequently implemented via completion prompts to an AI model. They can also be implemented as javascript code blocks in the document.

Pressing Cmd+Enter will run the default operation against the current region. The default operation is the operation chain: `complete | insert`.

#### Chaining operations

Operations are focused transforms whose inputs and outputs are often tied to regions in a document. This need not always be the case. Operations can take input from or pass output to other operations. A sequence of operations is called a "chain". This is similar to the idea of pipelines and filters in the Unix shell.


A good choice for the `complete` operation will send the current region to a language model.

The `insert` operation will place *its* input wherever the cursor is initially placed, streaming if necessary.

So the chain `complete | insert` will first generate a completion and then stream it to wherever the cursor is.

Operations defined within the document are defined after `# ` and surrounded with `[[` and `]]`. They have two parts: the operation's source and the operation's internal chain. An operation can omit either the source or its internal chain.

If none is specified, the default internal chain is `template | complete | insert`. The `template` operation will replace any occurrence of `{}` in the operation's source with the input returned by the preceding operation in the full operation chain. If no `{}` is present, a newline is appended to the source, followed by the given input.

To override the default internal chain, a line starting with `> ` should follow the `# ` definition.

#### JavaScript operations

This is an example operation implemented in JavaScript. It defines a simple `fetch` operation to fetch a given url. Note the use of `eval` in its internal pipeline.

~~~
# [[fetch]]
> eval | insert

```js
function ({view, args}) {
  const url = args[0]
  return async ({input, args}) => {
    const r = await fetch(url)
    return {
      input: await r.text(),
    }
  }
}
```
~~~

#### Undefined operations

When an operation is executed, the editor will search the current document for a definition. If no definition is found, it will suspend the current operation and first synthesize a plausible definition for undefined operation.

The definition is synthesizes using the "missing" operation. This is an operation that should be defined in your document. Future implementations might automatically add this operation.


#### Operation definitions

Operation definitions are separated from the rest of the content and from each other by `---` on lines by themselves.

In the current implementation, only the current document is searched for definitions. Future implementations might search other open documents, other files in the same directory, parent directories, or some user-specified collection of files, directories and/or URLs.
