# &lt;sc-form&gt; element

A thin wrapper for html `<form>` elements to imporove error handling.

`<sc-form>` optimizes native html form validation:

- Validates form inputs when they loose focus
- Validates all form inputs when the form is submitted
- Adds an error message underneath the input label (instead of adding a popup)
- Adds a validation pattern for [checkbox groups](#checkbox-group)

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

For regular `<input>`, `<textarea>` and `<select>` elements, a label is required that is referenced using `id` and `for`:

```html
<sc-form>
  <form>
    <label for="firstName">First name</label>
    <input type="text" id="firstName" required>
  </form>
</sc-form>
```

When you want to use radio buttons or multiple checkboxes, you need to group them inside a `<fieldset>` and add a `<legend>` to it.

#### Radio group

For radio groups, add the required attribute to all `<input type="radio">` elements, and set `role="radiogroup"` on the `<fieldset>`:

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

There is no native form validation pattern to check if at least one checkbox of a checkbox group is ticked. `<sc-form>` enables this functionality.

For this, set the `data-required` attribute on the `<fieldset>`. You can optionally specify a custom error message by using the `data-error` attribute.

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

### Form submission with JS

To submit the form using JS check if the form is valid by calling the  `checkValidity()` method of the form:

```js
// get reference to form element
const form = document.querySelector('form');

// listen for submit
form.addEventListener('submit', function() {
  // check if form is valid
  if(form.checkValidity()) {
    // submit the form
    form.submit();
  }
});
```
