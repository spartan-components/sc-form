class SCForm extends HTMLElement {
  constructor() {
    super();

    // setup references
    this.form = this.querySelector('form');
    this.buttonSubmit = this.form.querySelector('button[type=submit]');
    this.inputs = this.form.querySelectorAll('input, textarea, select');

    // disable native form validation
    this.form.setAttribute('novalidate', 'true');

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // listen for change events on inputs
    this.inputs.forEach(input => {
      input.addEventListener('blur', this);
    });

    // listen for submit event on form
    this.form.addEventListener('submit', this);
  }

  // remove event listeners
  disconnectedCallback() {
    this.inputs.forEach(input => {
      input.removeEventListener('blur', this);
    });

    this.form.removeEventListener('submit', this);
  }

  handleEvent(event) {
    if(event.type === 'blur') {
      this.checkInput(event);
    }

    if(event.type === 'submit') {
      this.checkForm(event);
    }
  }

  checkInput(event) {
    // shorthand for input element
    const element = event.target;

    // for checkboxes, do not check validity,
    // if next element is also a checkbox
    const isCheckbox = element.type === 'checkbox';
    const nextIsCheckbox = event?.relatedTarget?.type === 'checkbox' && event.relatedTarget.name === element.name;

    if(isCheckbox && nextIsCheckbox) return;

    let valid = isCheckbox
      ? this.validateCheckbox(element)
      : element.validity.valid;

    // add or remove error message depending on state
    if (valid) this.removeErrorMessage(event.target);
    if (!valid) this.addErrorMessage(event.target);
  }

  /**
   * Function to check if at least one checkbox of a required checkbox group is checked
   * @param {HTMLElement} element The checkbox that triggers the validation
   * @returns {boolean} True or false, if the element is valid or not
   */
  validateCheckbox(element) {
    const parent = element.closest('fieldset');
    // is it required?
    const required = parent?.hasAttribute('data-required');

    // early return if not required
    if (!required) return true;

    // get all values
    const formData = new FormData(this.form);
    const values = formData.getAll(element.name);

    // check if at least 1 option specified
    const isValid = values.length > 0;

    if (!isValid) {
      // todo: Add ways to customize error message 
      element.setCustomValidity('Choose at least one option');
    } else {
      element.setCustomValidity('');
    }

    return isValid;
  }

  /**
   * Function to add an error message to an invalid form element
   * @param {HTMLElement} element The element to add an error message to
   */
  addErrorMessage(element) {
    // remove any pre-existing error messages
    this.removeErrorMessage(element);

    // elements with multiple options have to be treated differently
    const isMultiElement = this.isMultiElement(element);

    // get reference element for error
    const errorRef = this.getErrorReference(element);

    // get element to set aria error states
    const errorElement = isMultiElement ? element.closest('fieldset') : element;
    const identifier = isMultiElement ? element.name : element.id;

    // prepare error id
    const errorId = `${identifier}-error`;

    // set aria error states
    errorElement.setAttribute('aria-invalid', true);
    errorElement.setAttribute('aria-describedby', errorId);

    // add error message
    const errorSpan = `<span id=${errorId}>${element.validationMessage}</span>`;
    errorRef.insertAdjacentHTML('afterend', errorSpan);
  }

  // todo: add JS doc
  isMultiElement(element) {
    // if there are multiple elements with the same name attribute, we know
    // that the element has to be treated differently
    return element.name && this.querySelectorAll(`[name=${element.name}]`).length > 1;
  }

  // todo: add JS doc
  getErrorReference(element) {
    const isMultiElement = this.isMultiElement(element);

    if(isMultiElement) {
      return element.closest('fieldset').querySelector('legend');
    } else {
      return this.querySelector(`label[for=${element.id}]`);
    }
  }

  removeErrorMessage(element) {
    const isMultiElement = this.isMultiElement(element);

    const errorElement = isMultiElement ? element.closest('fieldset') : element;
    const identifier = isMultiElement ? element.getAttribute('name') : element.id;

    const errorId = `${identifier}-error`;
    errorElement.removeAttribute('aria-invalid');
    errorElement.removeAttribute('aria-describedby');

    this.form.querySelector(`#${errorId}`)?.remove();
  }

  checkForm(event) {
    // prevent form submission
    event.preventDefault();

    if(!this.form.checkValidity()) {
      this.inputs.forEach(element => {
        const isCheckbox = element.type === 'checkbox';

        let valid = isCheckbox
          ? this.validateCheckbox(element)
          : element.validity.valid;
  
        // add or remove error message depending on state
        if (valid) this.removeErrorMessage(element);
        if (!valid) this.addErrorMessage(element);
      })
    }
  }
}

export default SCForm;
