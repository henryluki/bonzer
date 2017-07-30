# bonzer
***

A template engine with experimentation

# syntax
***

- Variable

`{{}}`

- Condition

`{if} {/if}`

- Loop

`{each} {/each}`

# Example
***

Install:

```
yarn add bonzer
```

Usage:

template:
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
javascript:
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
***

### Workflow

Overview:

```
             Tokenizer   Parser            data
template  =>  tokens  =>  AST  =>  compile  => output

```
Precompoile:

```
            Tokenizer       Parser
template  =>  tokens  =>  parse  => parse tree
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

Convet tokens to a parse tree

- Node and Leaf:

A node which has children calls `Node`.
A node which has no children calls `Leaf`.

They may look like:
```
  Node: { name, type, variable, children }

  Leaf: { name, type, (text or variable) }
```

- Parse Tree:

A tree is built by multiple nodes because of hierarchical relationships.

It may like this:
```
                root
                /
             condition
          /             \
       loop         condition
     /     \           /  \   \
condition variable  loop  text variable
                    /
                  text
```

### Compile

The parse tree run `compile` function with data (context). It's a depth-first traversal.
Every `Node` (`Leaf`) run it's `compile` function then parent merge children's compiled results.
