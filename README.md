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

Whole:

```
             Tokenizer   Parser            data
template  =>  tokens  =>  AST  =>  compile  => output

```
Precompoile:

```
            Tokenizer       Parser
template  =>  tokens  =>  parse  => AST
```

### Tokenizer

Convert string to tokens

- Token types:

```
"CONDITION_START"
"CONDITION_END"
"LOOP_START"
"LOOP_END"
"VARIABLE"
"TEXT"
```

### Parser

Convet tokens to AST tree

- Node and Leaf:

```
   node: { name, type, variable, children }

   leaf: { name, type, (text or variable) }
```

- Abstract syntax tree:

```
               root
               /
            condition
          /          \
       loop        condition
     /     \           /  \
condition variable  loop  text
                    /
                  text
```

