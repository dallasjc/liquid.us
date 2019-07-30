const { WWW_URL } = process.env
const { handleForm, html } = require('../helpers')

module.exports = (state, dispatch) => {
  const { forms, loading, location, updates = {} } = state
  const update = updates[location.params.id] || {}
  const { measure, recipients, subject, body } = update
  const form = forms.editUpdate || {}


  return html`
    <form method="POST" onsubmit=${handleForm(dispatch, { type: 'vote:updateFormSaved' })} onkeyup=${handleForm(dispatch, { type: 'measure:updateFormChanged' })} onchange=${handleForm(dispatch, { type: 'measure:updateFormChanged' })}>
      <section class="section">
        <div class="container is-widescreen">
          <h2 class="title is-4 has-text-centered">Send update to supporters of Hold Charter Schools Accountable</h2>
          <div class="columns">
            <div class="column is-size-5">
              <p><b>To:</b> All supporters</p>
              <p><b>From:</b> Hold Charter Schools Accountable via Liquid US</p><br />
              <div class="field">
                <b>Subject</b>
                <div class="control" style="padding-top:0.3rem;">
                  <input name="subject" class="input" type="text" autocomplete="off" placeholder="Add your subject" required value="${subject || ''}" />
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <b>Body text</b>
                    <div class="control" style="padding-top:0.3rem;">
                      <textarea name="body" autocomplete="off" class="textarea" rows="10" required value="${body || 'Dear $ {first_name},'}"></textarea>
                      <p class="help">You can continue to edit your update later.</p>
                    </div>
                  </div>
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
            </div>
          </div>
        </div>
      <section>
    </form>
  `
}
