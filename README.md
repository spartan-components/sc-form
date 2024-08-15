# &lt;sc-form&gt; element

A thin wrapper for html `<form>` elements to imporove error handling.

`<sc-form>` utilizes native HTML form validation, but optimizes it in a few ways:

- Validates form inputs, when they loose focus
- Validates all form inputs, when the form is submitted
- Adds an error message underneath the input label
- Adds validation pattern for checkbox groups

## Installation
Available on [npm](https://www.npmjs.com/) as [**@spartan-components/sc-form**](https://www.npmjs.com/package/@spartan-components/sc-form).

```
$ npm install --save @spartan-components/sc-form
```

## Usage

### Script

Import as ES modules:

```js
import { SCForm } from '@spartan-components/sc-form';
```

Include with a script tag:

```html
<script type="module" src="./node_modules/@spartan-components/dist/sc-form.js"></script>
```

Or use the minified version:

```html
<script type="module" src="./node_modules/@spartan-components/dist/sc-form.min.js"></script>
```

### &lt;sc-form&gt;

Simply wrap `<sc-form>` around a `<form>` tag:

```html
<sc-form>
  <form></form>
</sc-form>
```

### Format

The component expects the form elements to be written in a specific style.

For regular `<input>`, `<textarea>` and `<select>` elements, a label is required that is referenced using `id` and `for` like this:

```html
<sc-form>
  <form>
    <label for="firstName">First name</label>
    <input type="text" id="firstName" required>
  </form>
</sc-form>
```

When you want to use radio buttons or multiple checkboxes, you need to group them inside a `<fieldset>` and add a `<legend>` to it:

#### Radio group

For radio groups, add the required attribute to all `<input type="radio">` elements, and set `role="radiogroup"` on the `<fieldset>`

```html
<sc-form>
  <form>
    <fieldset role="radiogroup">
      <legend>Choose one color</legend>

      <input type="radio" name="color" id="red" value="red" required>
      <label for="red">Red</label>

      <input type="radio" name="color" id="green" value="green" required>
      <label for="green">Green</label>

      <input type="radio" name="color" id="blue" value="blue" required>
      <label for="blue">Blue</label>
    </fieldset>
  </form>
</sc-form>
```

#### Checkbox group

In HTML there is way, to mark a group of checkboxes as required (meaning, there has to be at least one checkbox ticked).

However, `<sc-form>` enables this functionality. For this, set the `data-required` attribute on the `<fieldset>`. You can optionally specify a custom error message by using the `data-error` attribute.

```html
<sc-form>
  <form>
    <fieldset data-required data-error="Please choose at least one fruit">
      <legend>What fruits do you like?</legend>

      <input type="checkbox" name="fruits" id="banana" value="banana" />
      <label for="banana">Banana</label>

      <input type="checkbox" name="fruits" id="apple" value="apple" />
      <label for="apple">Apple</label>

      <input type="checkbox" name="fruits" id="pear" value="pear" />
      <label for="pear">Pear</label>
    </fieldset>
  </form>
</sc-form>
```
