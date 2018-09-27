var form = document.querySelector('.signup__form');
var $form = $(form);

/////////////////////////////////
// const db = require('../../server/fake-db');

// var dd = db();

function displayErrors(err) {

// err IS A JSON OBJECT THAT CONTAINS, AMONG OTHER THINGS, THE TYPE OF ERROR, BUT BURIED DEEP IN THE OJECT.
  $form.html('<div class="usa-alert usa-alert-error" role="alert"><div class="usa-alert-body"><p class="usa-alert-text">' + err["statusText"] + '</p></div>');
  
  // errors.forEach(function(message) {
  //   $form.html('<div class="usa-alert usa-alert-error" role="alert"><div class="usa-alert-body"><p class="usa-alert-text">' + message + '</p></div>');
  // });
}

function displaySuccessMessage() {
  $form.html('<div class="usa-alert usa-alert-success" role="alert"><div class="usa-alert-body"><h3 class="usa-alert-heading">Account created</h3><p class="usa-alert-text">Welcome!</p></div>');
}

function handleSubmit(evt) {
  evt.preventDefault();
  var formData = $form.serializeArray();
  var errors = validate(formData);

  if (errors.length) {
    displayErrors(errors);
  } else {
    submit(formData);
  }
}

function submit(formData) {
  var submitButton = document.querySelector('.signup__submit');
  submitButton.textContent = 'Creating account...';
  submitButton.classList.add('usa-button-disabled');

  $.ajax({
    url: form.getAttribute('action'),
    method: form.getAttribute('method'),
    data: formData
  }).done(function(res) {
    if (res.success) {
      displaySuccessMessage();
    }
  }).fail(function(err) {displayErrors(err)});  // ADDED CALL TO DISPLAY ERRORS - GPL
}

function validate(formData) {
  var errors = [];

  // Remove previous error messages
  $('.usa-alert').remove();

  formData.forEach(function(field) {
    if (field.value === '') {
      return errors.push(field.name + ' is required');
    }

    if (field.name === 'email') {
      errors = errors.concat(validateEmail(field.value));
    } else if (field.name === 'password') {
      errors = errors.concat(validatePassword(field.value));
    }
  });

  return errors;
}

function validateEmail(value) {
  var errors = [];

  if (value.split('@').length !== 2) {
    errors.push('Invalid email.');
  }

  // GPL
  if (Db.prototype.insert(value) != "OK") {
    errors.push('email already exist');
  }
  
  return errors;
}

function validatePassword(value) {
  var errors = [];

  if (value.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  return errors;
}

$form.on('submit', handleSubmit);
