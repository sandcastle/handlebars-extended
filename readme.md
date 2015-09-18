# Handlebars Extended (HBX)

[![Build Status](https://travis-ci.org/sandcastle/handlebars-extended.svg)](https://travis-ci.org/sandcastle/handlebars-extended)

A lightweight wrapper around the popular Handlebars library to add support
for nested layouts.


## Getting started

The package can be installed with the following command:

```sh
npm install handlebars-extended --save
```


## Example

The example below shows how a Handlebars content page can be nested within a layout.

#### Layout file (root.hbs)

```hbs
<html>
<head><title>{{title}}</title>
<body>
{{{content}}}
</body>
</html>
```

#### Content file (welcome.hbs)

```hbs
{{! layout: root}}
<h1>Welcome page</h1>
{{quote}}
```

#### Code

```js
var hbx = require('hbx');

// register the global layout
hbx.registerLayout('root', '<FROM ROOT.HBS>');

// compile the content page template
var template = hbx.compile('<FROM WELCOME.HBS>');

// render the nested content page with data
var result = template({ title: 'Why hello there!', question: 'How is your day going?' });
```

#### Resulting HTML

```html
<html>
<head><title>Why hello there!</title>
<body>
<h1>Welcome page</h1>
How is your day going?
</body>
</html>
```


## Usage

### Layout definition

The layout definition is a Handlebars comment that defines the name of the layout
that should be used. By using comments, the definition will be ignored if by the 
standard Handlebars project. 

```hbs
{{! layout: NAME }}
```

Layouts can also define layout definitions meaning multiple layers of nest are possible.

### 


### Monkey Patching

In order to maintain existing handlebars functionality, HBX monkey patches the
existing `compile` method. Currently the `precompile` method has been disabled.


## API

#### hbx.registerLayout(name, layout)

Registers a global layout that can then be used by all future `compile` calls.

```js
hbx.registerLayout('root', '<div>{{{content}}}</div>');
```

#### hbx.unregisterLayout(name)

Removes a registered global layout, this will result in the layout no longer being available
to any past or future `compile` calls.

```js
hbx.unregisterLayout('root');
```

#### template({ layouts: {} }) 

Local layouts can also be specified when rendering a template, just like partials and helpers
in Handlebars.

```js
var template = hbx.compile('{{! layout: root }}\nhello');
template({ layouts: { root: '<div>{{{content}}}</div>' } });
```
