const { handleForm, html } = require('../helpers')

module.exports = ({ error, loading }, dispatch) => {

  return html`
    <div class="has-text-centered">
      <form class="box has-text-centered" method="POST" onsubmit="${handleForm(dispatch, { type: 'contactForm:submitSignup', url: 'https://liquid.us/elected' })}">
        <div class="field has-text-left">
          <strong><label for="email">Share your email to get started.</label><strong>
        </div>
        <div class="field has-addons join-input-field">
          <div class="${`control is-expanded has-icons-left ${error ? 'has-icons-right' : ''}`}">
            <input name="email" class="${`input ${error ? 'is-danger' : ''}`}" type="text" required placeholder="you@example.com" />
            <span class="icon is-small is-left">
              <i class="fa fa-user"></i>
            </span>
            ${error ? html`<span class="icon is-small is-right">
              <i class="fa fa-warning"></i>
            </span>` : ''}
            ${error ? html`<p class="help is-danger">${error.message}</p>` : ''}
          </div>
          <div class="control">
            <button class="${`button is-primary ${loading.signIn ? 'is-loading' : ''}`}" disabled=${loading.signIn} type="submit"><strong>Submit</strong></button>
          </div>
        </div>
        <div class="content">
          <div class="has-text-grey is-size-7">We will never share your email with anyone.</div>
        </div>
      </form>
    </div>
  `
}