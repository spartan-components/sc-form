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
    this.inputs.forEach(input => input.addEventListener('blur', this));

    // listen for submit event on form
    this.form.addEventListener('submit', this);
  }

  // remove event listeners
  disconnectedCallback() {
    this.inputs.forEach(input => input.removeEventListener('blur', this));
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
    // get parent fieldset
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
   * Find out, if a given HTML form field let's the user choose from multiple options
   * @param {HTMLElement} element The element to check
   * @returns {boolean}
   */
  isMultiElement(element) {
    // if there are multiple elements with the same name attribute, we know
    // that the element has to be treated differently
    return element.name && this.querySelectorAll(`[name=${element.name}]`).length > 1;
  }

  /**
   * @typedef {Object} ErrorData
   * @property {HTMLElement} appendToElement The element underneath which the error will be rendered
   * @property {HTMLElement} errorElement The element, that will be marked as invalid
   * @property {string} errorId The ID for linking the invalid field and the corresponding error message
   * @property {string} errorSpan A string containing a span element with the error message and the corresponding error ID
   */

  /**
   * Get shared data for rendering and removing error messages
   * @param {HTMLElement} element The element to get the error references for
   * @returns {ErrorData}
   */
  getErrorData(element) {
    // for multi elements, we have to reference different nodes
    const isMultiElement = this.isMultiElement(element);

    // define the data
    const appendToElement = isMultiElement
      ? element.closest('fieldset').querySelector('legend')
      : this.querySelector(`label[for=${element.id}]`);

    const errorElement = isMultiElement ? element.closest('fieldset') : element;
    const errorId = `${isMultiElement ? element.name : element.id}-error`;
    const errorSpan = `<span id=${errorId}>${element.validationMessage}</span>`;

    return {
      appendToElement,
      errorElement,
      errorId,
      errorSpan,
    }
  }

  /**
   * Function to add an error message to an invalid form element
   * @param {HTMLElement} element The element to add an error message to
   */
  addErrorMessage(element) {
    // remove any pre-existing error messages
    this.removeErrorMessage(element);

    // get data needed for rendering the error
    const {
      appendToElement,
      errorElement,
      errorId,
      errorSpan,
    } = this.getErrorData(element);

    // set error attributes
    errorElement.setAttribute('aria-invalid', "true");
    errorElement.setAttribute('aria-describedby', errorId);

    // set error message
    appendToElement.insertAdjacentHTML('afterend', errorSpan);
  }

  removeErrorMessage(element) {
    // get data needed for removing the error
    const {
      errorElement,
      errorId
    } = this.getErrorData(element);

    // remove error attributes
    errorElement.removeAttribute('aria-invalid');
    errorElement.removeAttribute('aria-describedby');

    // remove error message
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
