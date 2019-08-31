const { handleForm, html } = require('../helpers')

module.exports = (state, dispatch) => {
  const { forms, loading, location, measures = {}, updates = {}, user } = state
  const update = updates[location.params.id] || {}
  const { subject, body } = update
  const measure = location.params.shortId && measures[location.params.shortId]
  const isPetitionAuthor = user && user.id === measure.author_id
  const notPetitionAuthorMessage = isPetitionAuthor ? '' : html`<br /><br /><div class="is-size-3 notification is-danger">You are not the author of this petition.</div>`

  return html`
  ${notPetitionAuthorMessage}

    <form method="POST" class=${isPetitionAuthor ? '' : 'is-hidden'} onsubmit=${handleForm(dispatch, { type: 'vote:updateFormSaved' })} onkeyup=${handleForm(dispatch, { type: 'vote:updateFormChanged' })} onchange=${handleForm(dispatch, { type: 'vote:updateFormChanged' })}>
      <section class="section">
        <div class="container is-widescreen">
          <h2 class="title is-4 has-text-centered">Send update to supporters of '${measure.title}'</h2>
          <div class="columns">
            <div class="column is-size-5">
              <p><b>To:</b> All supporters</p>
              <p><b>From:</b> '${measure.title} via Liquid US</p><br />
              <div class="field">
                <b>Subject</b>
                <div class="control" style="padding-top:0.3rem;">
                  <input name="subject" class="input" type="text" autocomplete="off" placeholder="Add your subject" required value="${subject || ''}" />
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="label">Body text</div>
                </div>
                <div class="column is-narrow-is-right">
                  <div class="dropdown is-active">
                    <div class="dropdown-trigger">
                      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>Select variable to insert</span>
                        <span class="icon is-small">
                          <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <div class="dropdown-item">Recipient First Name</div>
                        <div class="dropdown-item">Rep First Name</div>
                        <div class="dropdown-item is-active">Rep Last Name</div>
                        <div class="dropdown-item">Rep Email</div>
                        <div class="dropdown-item">Rep Phone Number</div>
                        <div class="dropdown-item">Rep District</div>
                        <div class="dropdown-item">Senator First Name</div>
                        <div class="dropdown-item">Senator Last Name</div>
                        <div class="dropdown-item">Senate District</div>
                        <div class="dropdown-item">Senator Phone</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control" style="padding-top:0.3rem;">
                  <textarea name="body" autocomplete="off" class="textarea" rows="10" required value="${body || 'Dear $ {first_name},'}"></textarea>
                  <p class="help">You can continue to edit your update later.</p>
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class=${`button is-primary ${loading.editMeasure === 'saving' ? 'is-loading' : ''}`} disabled="${loading.editMeasure}" type="submit">
                    <span class="icon"><i class="fa fa-edit"></i></span>
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="column is-narrow is-size-5" style="margin-left:2rem;">
              <p><b>Select recipient</b></p>
              <p>Dallas Cole</p>
            </div>
            <div class="column is-size-5">
              <div class="card" style="margin:1rem; padding:1rem;">
                <p><i>Save draft language to populate subject</i></p><br />
                <p><b>From:</b> Hold Charter Schools Accountable via Liquid US</p><br />
                <p>Dear Dallas,</p>
                <p><i>Save draft language to populate body</i></p>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field is-grouped">
                    <div class="control" style="margin-left:1rem">
                      <button class="button is-danger" type="submit">
                        <span class="icon"><i class="fa fa-envelope"></i></span>
                        <span>Send test email</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="column has-text-right">
                  <div class="field">
                    <div class="control">
                      <button class="button is-primary is-right" type="submit">
                        <span class="icon"><i class="fa fa-share"></i></span>
                        <span>Send update now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <section>
    </form>
  `
}
