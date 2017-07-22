# bonzer
A template engine with experimentation

# syntax

- Variable

`{{}}`

- Condition

`{if} {/if}`

- Loop

`{each} {/each}`

# Example

Install:

```
yarn add bonzer
```

Usage:

```html
{if data.sold}
<div>
<p>i am {{ data.name }}</p>
<div>
{each data.items}
<p>fruit name: {{item.name}}, fruit price: {{ item.price }} </p>
{/each}
</div>
</div>
{/if}
```

```javascript

var data = {
  name: "Sam",
  sold: true,
  items: [{
    price: 10,
    name: "apple"
  }]
}

var template = bonzer(tpl)
template.render(data)

```

output:

```html
<div><p>i am Sam</p><div>
<p>fruit name: apple, fruit price: 10 </p>
</div></div>
```

# Structure

### Workflow

```
             Tokenizer   Parser
template  =>  tokens  =>  AST  =>  compile  => html
```

### Tokenizer

Convert string to tokens

### Parser

Convet tokens to AST tree

- Tree node and leaf:

```
   node: { name, type, variable, children }

   leaf: { name, type, (text or variable) }
```

- Abstract syntax tree:

```
         ROOT
          /
      CONDITION
        /  \
      LOOP  CONDITION
    /           /
CONDITION     LOOP
```

