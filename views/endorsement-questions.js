const { avatarURL, handleForm, html } = require('../helpers')
const activityIndicator = require('./activity-indicator')
const moment = require('moment')

module.exports = (state, dispatch) => {
  const { loading, location, votes } = state
  const vote = votes[location.params.voteId]

  return html`
    <div
      onconnected=${(event) => dispatch({ type: 'vote:questionsRequested', event, vote })}
      style=${{ marginTop: '-.5em' }}
    >
      ${askQuestionButton(state, dispatch)}
      ${vote.showQuestionForm && state.user ? questionFormRegistered(state, dispatch) : vote.showQuestionForm ? questionFromSignupForm(state, dispatch) : ''}
      ${loading.questions ? activityIndicator({ size: 'small' }) : questions(state, dispatch)}
    </div>
  `
}

const askQuestionButton = (state, dispatch) => {
  const { location, votes } = state
  const vote = votes[location.params.voteId]

  return html`
    <div class="level" style=${{ paddingBottom: '1em' }}>
      <div class="level-item">
        <button
          onclick=${(event) => dispatch({ type: 'vote:questionFormActivated', vote, event })}
          class="button is-primary has-text-weight-semibold is-small"
        >
          <span>Ask a question</span>
        </button>
      </div>
    </div>
  `
}

const questionFormRegistered = (state, dispatch) => {
  const { error, loading, location, user, votes } = state
  const vote = votes[location.params.voteId]

  return html`
    <form
      method="POST"
      style="margin-bottom: 2rem;"
      onconnected=${scrollToForm(location)}
      onsubmit=${handleForm(dispatch, { type: 'vote:questionFormSubmitted', vote })}
    >
      <div class="field">
        <h4 class="title is-size-5">Ask a question</h4>
      </div>
      ${error ? html`<div class="notification is-warning">${error.message}</div>` : ''}
      <input type="hidden" value="${user.id}" name="user_id" />
      <input type="hidden" value="${vote.id}" name="vote_id" />
      <div class="field">
        <label class="${user ? 'field is-hidden' : 'label has-text-grey'}">Your Question</label>
        <div class="control">
          <textarea name="question" autocomplete="off" class="textarea" placeholder="What do you want to know?"></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input name="public" type="checkbox" checked=${user ? user.last_vote_public : true} />
            Share my name publicly
          </label>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field is-grouped">
          <div class="control">
            <button
              class=${`button ${loading.questions ? 'is-loading' : ''}`}
              disable=${loading.questions}
              type="submit"
            >
              <span class="icon"><i class="fa fa-edit"></i></span>
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>
      <hr />
    </form>
  `
}

const questionFromSignupForm = (state, dispatch) => {
  const { error, loading, location, user, votes } = state
  const vote = votes[location.params.voteId]

  return html`
    <form
      method="POST"
      style="margin-bottom: 2rem;"
      onconnected=${scrollToForm(location)}
      onsubmit=${handleForm(dispatch, { type: 'vote:questionFromSignupForm', vote })}
    >
      <div class="field">
        <h4 class="title is-size-5">Ask a question</h4>
      </div>
      ${error ? html`<div class="notification is-warning">${error.message}</div>` : ''}
      <input type="hidden" value="${vote.id}" name="vote_id" />
      <div class="${user ? 'columns is-hidden' : 'columns'}">
        <div class="column">
          <div class="field">
            <label class="label has-text-grey">Your Name *</label>
            <div class="control has-icons-left">
              <input name="name" class="input" type="text" placeholder="John Doe" />
              <span class="icon is-small is-left"><i class="fa fa-user"></i></span>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label has-text-grey">Your Email *</label>
            <div class="field join-input-field">
              <div class="control has-icons-left">
                <input name="email" class="input" type="text" placeholder="you@example.com" />
                <span class="icon is-small is-left"><i class="fa fa-user"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="${user ? 'field is-hidden' : 'field'}">
        <label class="label has-text-grey">Your Address</label>
        <div class="control has-icons-left">
          <input onconnected=${initGoogleMaps} id="address_autocomplete_sidebar" class="input" autocomplete="off" name="address" placeholder="185 Berry Street, San Francisco, CA 94121" />
          <span class="icon is-small is-left"><i class="fa fa-map-marker-alt"></i></span>
        </div>
        <p class="is-size-7" style="margin-top: .3rem;">So we can connect you to your reps and fellow constituents.</p>
      </div>
      <div class="field">
        <label class="${user ? 'field is-hidden' : 'label has-text-grey'}">Your Question</label>
        <div class="control">
          <textarea name="question" autocomplete="off" class="textarea" placeholder="What do you want to know?"></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input name="public" type="checkbox" checked=${user ? user.last_vote_public : true} />
            Share my name publicly
          </label>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field is-grouped">
          <div class="control">
            <button
              class=${`button ${loading.questions ? 'is-loading' : ''}`}
              disable=${loading.questions}
              type="submit"
            >
              <span class="icon"><i class="fa fa-edit"></i></span>
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>
      <hr />
    </form>
  `
}
const questions = (state, dispatch) => {
  const { location, votes } = state
  const vote = votes[location.params.voteId]
  const questions = vote.questions || []
  return html`
    <div>
      ${!questions.length ? html`<p class="has-text-grey has-text-centered">No questions have been asked yet.</p>` : ''}
      ${questions.map((q) => questionView(q, vote, state, dispatch))}
    </div>
  `
}

const questionView = (question, vote, state, dispatch) => {
  const loading = state.loading.questionsVotes
  const name = question.user && `${question.user.first_name} ${question.user.last_name}`
  return html`
    <article class="media">
      <figure class="media-left">
        <p class="image is-32x32">
          <img class="is-rounded" src="${avatarURL(question.user || {})}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${name || 'Anonymous'}</strong>
            ${name ? html`<a href=${`/${question.user.username}`}><small>@${question.user.username}</small></a>` : ''}
            <small class="has-text-grey">${moment.utc(question.created_at).fromNow()}</small>
            ${state.user && question.user_id === state.user.id && !question.public ? html`<span class="tag is-light">Posted Anonymously</span>` : ''}
            <br>
            ${question.question}
          </p>
        </div>
        <a
          class="${`button is-small ${question.current_user_voted ? 'is-active' : ''} ${loading ? 'is-disabled is-loading' : ''}`}"
          onclick=${(event) => dispatch({ type: 'vote:questionVoted', event, question, vote })}
        >
          <span class="icon is-small"><i class="fas fa-arrow-up"></i></span><br />
          <span>${question.votes}</span>
        </a>
      </div>
    </article>
  `
}

const scrollToForm = (location) => {
  if (location.query.action === 'add-argument') {
    window.scrollTo(0, document.getElementById('measure-vote-form').getBoundingClientRect().top)
  }
}
const initGoogleMaps = (event) => window.initGoogleAddressAutocomplete(event.currentTarget.getAttribute('id'))
