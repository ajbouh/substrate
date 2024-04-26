## Blackboard query UI

See which what blackboard calls match a given request.

TODO show a swagger ui for each match

### Request JSON

```js
const tasks = [null, `{"task": "translate"}`]
const selectedTask = view(Inputs.select(tasks, {label: "Samples"}));
```

```js
const selectedTextValue = new Mutable("");
const setSelectedTextValue = v => (v != null && (selectedTextValue.value = v));
```

```js
setSelectedTextValue(selectedTask);
```

Enter a JSON request and click submit

```js
const text = view(Inputs.textarea({
  rows: 50,
  submit: true,
  value: selectedTextValue,
}));
```

```js
function showMatchAttempt(e, i) {
  return html`
<h3>${e.Path}</h3>
${html`${e.Error
  ? html`<pre>${e.Error}</pre>`
  : html`<pre>${e.Match}</pre>`
}`}
`
}

function showMismatchAttempt(e, i) {
  return html`
<h3>${e.Path}</h3>
<pre style="color: red;">${e.Error || e.Match}</pre>
<pre>${e.Offer}</pre>
`
}

async function query(text) {
  const res = await fetch("/bb/v1/query/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: text,
  });

  return await res.json()
}
```

```js
const {collected} = text ? await query(text) : {collected: []}
```

## Matches

${collected.filter(e => !e.Match.startsWith("_|_")).map((e, i) => showMatchAttempt(e, i))}

## Mismatches

${collected.filter(e => e.Match.startsWith("_|_") || e.MatchError?.length).map((e, i) => showMismatchAttempt(e, i))}
