const { handleForm, html } = require('../helpers')
const organizeForm = require('./organize-form')

module.exports = (state, dispatch) => {
  const { showMobileOrganizeForm, user } = state

  return html`
    <div style="z-index: 30;" class=${`${showMobileOrganizeForm === true ? 'modal is-active' : 'not-modal'} mobile-only`}>
      <div class="${showMobileOrganizeForm === true ? 'modal-background' : ''}" onclick=${(event) => dispatch({ type: 'contact:toggledMobileOrganizeForm', event })}></div>
      <div class="${showMobileOrganizeForm === true ? 'modal-content' : ''}">
        <nav class="box">
          ${!user // logged out
            ? getInvolvedForm(state, dispatch)
            : organizeForm(state, dispatch)
           }
        </nav>
      </div>
      <button class="${`modal-close is-large ${showMobileOrganizeForm === true ? '' : 'is-hidden'}`}" aria-label="close" onclick=${(event) => dispatch({ type: 'contact:toggledMobileOrganizeForm', event })}></button>
      <style>
        .modal-content, .modal-card {
          max-height: calc(100vh - 100px) !important;
        }
        @media (max-width: 1050px) {
          .not-modal.mobile-only {
            display: none !important;
          }
        }
      </style>
    </div>
  `
}

const getInvolvedForm = (state, dispatch) => {
  const { error } = state
  const loading = state.loading.signupFromOrganizeForm

  return html`
    <form method="POST" style="width: 100%;" method="POST" onsubmit=${handleForm(dispatch, { type: 'contact:organizeSignUpForm' })}>
      <div class="field">
        <label class="label has-text-grey">Your Name *</label>
        <div class="control has-icons-left">
          <input name="name" autocomplete="off" class=${`input ${error && error.field === 'name' && 'is-danger'}`} placeholder="John Doe" required />
          ${error && error.field === 'name'
            ? html`<span class="icon is-small is-left"><i class="fas fa-exclamation-triangle"></i></span>`
            : html`<span class="icon is-small is-left"><i class="fa fa-user"></i></span>`
          }
          ${error && error.field === 'name' ? html`<p class="help is-danger">${error.message}</p>` : ''}
        </div>
      </div>
      <div class="field">
        <label class="label has-text-grey">Your Email *</label>
        <div class="field has-addons join-input-field">
          <div class="${`control is-expanded has-icons-left ${error && error.field === 'email' ? 'has-icons-right' : ''}`}">
            <input name="email" class="${`input ${error && error.field === 'email' ? 'is-danger' : ''}`}" type="text" placeholder="you@example.com" required />
            ${error && error.field === 'email'
              ? html`<span class="icon is-small is-left"><i class="fas fa-exclamation-triangle"></i></span>`
              : html`<span class="icon is-small is-left"><i class="fa fa-user"></i></span>`
            }
            ${error && error.field === 'email' ? html`<p class="help is-danger">This email is invalid.</p>` : ''}
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label has-text-grey">Your Address</label>
        <div class="control has-icons-left">
          <input onconnected=${initGoogleMaps} class=${`input ${error && error.field === 'address' && 'is-danger'}`} autocomplete="off" name="address" id="address_autocomplete_sidebar" placeholder="185 Berry Street, San Francisco, CA 94121" />
          ${error && error.field === 'address'
            ? html`<span class="icon is-small is-left"><i class="fa fas fa-exclamation-triangle"></i></span>`
            : html`<span class="icon is-small is-left"><i class="fa fa-map-marker-alt"></i></span>`
          }
          ${error && error.field === 'address' ? html`<p class="help is-danger">${error.message}</p>` : ''}
        </div>
        <p class="is-size-7" style="margin-top: .3rem;">To connect you to your reps and other liquid supporters.</p>
      </div>
      <div class="field">
        <div class="control">
          <button class=${`button is-primary is-fullwidth has-text-weight-bold fix-bulma-centered-text is-size-5 ${loading ? 'is-loading' : ''}`} type="submit">Get involved</button>
        </div>
      </div>
    </form>
  `
}

const initGoogleMaps = (event) => window.initGoogleAddressAutocomplete(event.currentTarget.getAttribute('id'))
