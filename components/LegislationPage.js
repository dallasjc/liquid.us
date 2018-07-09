const Component = require('./Component')
const Comment = require('./Comment')
const LoadingIndicator = require('./LoadingIndicator')

module.exports = class LegislationPage extends Component {
  oninit() {
    const { config } = this.state
    const { params } = this.props

    const url = `/legislation_detail?short_id=eq.${params.short_id}`

    this.setState({ loading_bill: true })

    return this.api(url).then((bills) => {
      const selected_bill = bills[0]

      if (selected_bill) {
        if (this.isBrowser) {
          const page_title = `${selected_bill.title} ★ ${config.APP_NAME}`
          window.document.title = page_title
          window.history.replaceState(window.history.state, page_title, document.location)
        }

        return this.fetchComments(selected_bill).then(({ yea_comments, nay_comments }) => {
          selected_bill.yea_comments = yea_comments
          selected_bill.nay_comments = nay_comments
          return {
            loading_bill: false,
            page_title: selected_bill.title,
            page_description: `Vote directly on legislative bills. We'll notify your representatives and grade them for how well they listen to their constituents.`,
            selected_bill: { ...bills[selected_bill.short_id], ...selected_bill },
            bills: { ...bills, [selected_bill.short_id]: selected_bill },
          }
        })
      }

      this.location.setStatus(404)
      return { loading_bill: false }
    })
    .catch((error) => {
      this.location.setStatus(404)
      return { error, loading_bill: false }
    })
  }
  fetchComments(selected_bill) {
    return this.api(`/public_votes?legislation_id=eq.${selected_bill.id}&comment=not.eq.&comment=not.is.null&number=not.is.null&order=proxy_vote_count.desc.nullslast,created_at.desc`)
    .then(comments => ({
      yea_comments: comments.filter(({ position }) => position === 'yea'),
      nay_comments: comments.filter(({ position }) => position === 'nay'),
    }))
  }
  onpagechange() {
    const { loading_bill, selected_bill } = this.state
    if (!loading_bill && selected_bill) {
      this.oninit().then((newState) => this.setState(newState))
    }
  }
  render() {
    const { loading_bill, selected_bill } = this.state

    return this.html`<div>${
      loading_bill
        ? LoadingIndicator.for(this)
        : selected_bill
          ? BillFoundPage.for(this)
          : BillNotFoundPage.for(this)
    }</div>`
  }
}

class BillNotFoundPage extends Component {
  render() {
    return this.html`
      <section class="hero is-fullheight is-dark">
        <div class="hero-body">
          <div class="container has-text-centered">
            <h1 class="title">Can't find ${[this.location.path]}</h1>
            <h2 class="subtitle">Maybe the URL is mistyped?</h2>
          </div>
        </div>
      </section>
    `
  }
}

class BillFoundPage extends Component {
  render() {
    const { config, legislation_query, selected_bill: l, user } = this.state
    const bill_details_url = l.legislature_name === 'U.S. Congress'
      ? `https://www.congress.gov/bill/${l.congress}th-congress/${l.chamber === 'Lower' ? 'house' : 'senate'}-bill/${l.number}`
      : `https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=${l.congress}0${l.type}${l.number}`
    const bill_details_name = l.legislature_name === 'U.S. Congress' ? 'congress.gov' : 'leginfo.legislature.ca.gov'
    const own_comment = user && l.yea_comments.concat(l.nay_comments).reduce((b, a) => {
      if (a.user_id === user.id) return a
      return b
    }, false)

    return this.html`
      <section class="section">
        <div class="container">
          <nav class="breadcrumb has-succeeds-separator is-left is-small" aria-label="breadcrumbs">
            <ul>
              <li><a class="has-text-grey" href="/">${config.APP_NAME}</a></li>
              <li><a class="has-text-grey" href="${legislation_query || '/legislation'}">Legislation</a></li>
              <li class="is-active"><a class="has-text-grey" href="#" aria-current="page">${l.type} ${l.number}</a></li>
            </ul>
          </nav>
          ${(l.vote_position && !user.cc_verified) ? [`
            <div class="notification is-info">
              <span class="icon"><i class="fa fa-exclamation-triangle"></i></span>
              <strong>Help hold your reps accountable!</strong><br />
              Your vote has been recorded, and we'll send it to your elected reps, but it won't be included in their Representation Grade until you <a href="/get_started">verify your identity</a>.
            </div>
          `] : ''}
          <h4 class="has-text-grey is-paddingless is-margin-less">${l.legislature_name}</h4>
          <h2 class="title has-text-weight-normal is-size-4" style="margin-bottom: .5rem;">${l.type} ${l.number} &mdash; ${l.title}</h2>
          ${l.legislature_name === 'U.S. Congress' ? StatusTracker.for(this) : ''}
          <p class="is-size-7 has-text-grey">
            ${l.sponsor_username
              ? [`Introduced by <a href=${`/${l.sponsor_username}`}>${l.sponsor_first_name} ${l.sponsor_last_name}</a> on ${(new Date(l.introduced_at)).toLocaleDateString()} &bullet; Last action on ${new Date(l.last_action_at).toLocaleDateString()}`]
              : [`Introduced on ${(new Date(l.introduced_at)).toLocaleDateString()} &bullet; last action on ${new Date(l.last_action_at).toLocaleDateString()}`]
            }
            &bullet; <a href=${bill_details_url} target="_blank">Bill details at ${bill_details_name} <span class="icon is-small"><i class="fa fa-external-link"></i></span></a>
          </p>
          <hr />
          <div class="content">
            <div class="columns">
              <div class="column">${BillSummary.for(this)}</div>
              <div class="column">
                <p>${VoteButton.for(this, l, `votebutton-${l.id}`)}</p>
                ${l.vote_position
                ? [`
                  <p><span class="has-text-weight-bold">${l.constituent_yeas} Yea and ${l.constituent_nays} Nay</span> votes from verified constituents in your district</p>
                `]
                : [`
                  ${l.yeas + l.nays
                    ? `<p>${l.yeas + l.nays} people have voted on this bill. Join them.</p>`
                    : ''}
                  <p class="is-size-7">We'll notify <a href="/legislators">your representative</a> and hold them accountable by using your vote to calculate their <a href="https://blog.united.vote/2017/12/08/give-your-rep-an-f-introducing-united-legislator-grades/">representation score</a>.</p>
                `]}
              </div>
            </div>
          </div>
          ${own_comment ? Comment.for(this, own_comment, `own-comment-${own_comment.id}`) : ''}
          <hr />
          ${BillComments.for(this)}
        </div>
      </section>
    `
  }
}

class BillSummary extends Component {
  onclick(event) {
    event.preventDefault()
    this.setProps({ expanded: !this.props.expanded })
    this.render()
  }
  render() {
    const { expanded } = this.props
    const { selected_bill } = this.state
    const { chamber, congress, number, summary } = selected_bill

    return this.html`
      <style>
        .summary {
          max-height: 10rem;
          position: relative;
          overflow: hidden;
        }
        .summary .read-more {
          position: absolute;
          bottom: 1rem;
          left: 0;
          width: 100%;
          margin: 0;
          height: 3rem;

          /* "transparent" only works here because == rgba(0,0,0,0) */
          background-image: linear-gradient(to bottom, transparent, white);
        }
        .summary .read-more-link {
          background: white;
          display: block;
          width: 100%;
          height: 1rem;
          position: absolute;
          bottom: 0;
        }
      </style>
      <div class=${`${expanded || !summary ? '' : 'summary'}`}>
        <div class="content">
          ${[summary ? summary.replace(/\n/g, '<br />') : `<p>A summary is in progress.</p><p><a href="https://www.congress.gov/bill/${congress}th-congress/${chamber === 'Lower' ? 'house' : 'senate'}-bill/${number}/text" target="_blank">Read full text of the bill at congress.gov <span class="icon is-small"><i class="fa fa-external-link"></i></span></a>`]}
        </div>
        <div class="read-more"></div>
        <a class="read-more-link is-size-7" href="#" onclick=${this}>
          ${summary
            ? [`<span class="icon is-small"><i class="${`fa fa-${expanded ? 'minus' : 'plus'}`}"></i></span> ${expanded ? 'Show less' : 'Show more'}`]
            : ''}
        </a>
      </div>
    `
  }
}

class VoteButton extends Component {
  votePositionClass() {
    const { vote_position: position } = this.props
    if (position === 'yea') return 'is-success'
    if (position === 'nay') return 'is-danger'
    return ''
  }
  render() {
    const s = this.props

    let voteBtnTxt = 'Vote on this bill'
    let voteBtnClass = 'button is-primary'
    let voteBtnIcon = 'fa fa-pencil-square-o'

    if (s.vote_position) {
      const position = `${s.vote_position[0].toUpperCase()}${s.vote_position.slice(1)}`
      if (s.vote_position === 'yea') voteBtnIcon = 'fa fa-check'
      if (s.vote_position === 'nay') voteBtnIcon = 'fa fa-times'
      if (s.vote_position === 'abstain') voteBtnIcon = 'fa fa-circle-o'
      if (s.delegate_rank > -1) {
        if (s.delegate_name) {
          voteBtnTxt = `Inherited ${position} vote from ${s.delegate_name}`
        } else {
          voteBtnTxt = `Inherited ${position} vote from proxy`
        }
        voteBtnClass = `button is-outlined ${this.votePositionClass()}`
      }
      if (s.delegate_rank === -1) {
        voteBtnTxt = `You voted ${position}`
        voteBtnClass = `button ${this.votePositionClass()}`
      }
    }
    return this.html`<a style="white-space: inherit; height: auto;" class=${voteBtnClass} href=${`/legislation/${s.short_id}/vote`}>
      <span class="icon"><i class=${voteBtnIcon}></i></span>
      <span class="has-text-weight-semibold">${voteBtnTxt}</span>
    </a>`
  }
}

class BillComments extends Component {
  render() {
    return this.html`
      <div class="columns">
        <div class="column">
          ${CommentsColumn.for(this, { position: 'yea' }, 'comments-yea')}
        </div>
        <div class="column">
          ${CommentsColumn.for(this, { position: 'nay' }, 'comments-nay')}
        </div>
      </div>
    `
  }
}

class CommentsColumn extends Component {
  render() {
    const { position } = this.props
    const { selected_bill } = this.state
    const comments = selected_bill[`${position}_comments`] || []

    return this.html`
      ${comments.length
        ? comments.map(c => Comment.for(this, c, `comment-${c.id}`))
        : [`<p class="has-text-grey-light">No comments ${position === 'yea' ? 'in favor' : 'against'}. Vote on the bill to leave a comment.</p>`]
      }
    `
  }
}

class StatusTracker extends Component {
  render() {
    const { selected_bill: l } = this.state
    const steps = [{ step: 'Introduced', fulfilled: !!l.introduced_at }]

    if (l.chamber === 'Upper') {
      steps.push({ step: 'Passed Senate', fulfilled: !!l.passed_upper_at })
      steps.push({ step: 'Passed House', fulfilled: !!l.passed_lower_at })
    } else {
      steps.push({ step: 'Passed House', fulfilled: !!l.passed_lower_at })
      steps.push({ step: 'Passed Senate', fulfilled: !!l.passed_upper_at })
    }

    steps.push({ step: 'Enacted', fulfilled: !!l.enacted_at })

    return this.html`
      <style>
      .status_tracker {
        list-style: none;
        display: inline-block;
        margin-left: 1rem;
        margin-bottom: .5rem;
      }
      .status_tracker .step {
        float: left;
        padding-top: .5rem;
      }
      .status_tracker .step:first-child {
        margin-left: -1rem;
      }
      .status_tracker .step .step_label {
        display: block;
        background: rgba(0, 0, 0, 0.06);
        text-decoration: none;
        position: relative;
        height: 2rem;
        line-height: 2rem;
        padding: 0 .7rem 0 0;
        text-align: center;
        margin-right: 1.2rem;
      }
      .status_tracker .step.fulfilled .step_label {
        background: rgba(0, 0, 0, 0.09);
      }
      .status_tracker .step:first-child .step_label {
        padding-left: .7rem;
        border-radius: 4px 0 0 4px;
      }
      .status_tracker .step:first-child .step_label:before {
        border: none;
      }
      .status_tracker .step:last-child .step_label {
        padding-right: 1rem;
        border-radius: 0 4px 4px 0;
      }
      .status_tracker .step:last-child .step_label:after {
        border: none;
      }
      .status_tracker .step .step_label:before, .status_tracker .step .step_label:after {
        content: "";
        position: absolute;
        top: 0;
        border: 0 solid rgba(0, 0, 0, 0.06);
        border-width: 1rem .5rem;
        width: 0;
        height: 0;
      }
      .status_tracker .step .step_label:before {
        left: -1rem;
        border-left-color: transparent;
      }
      .status_tracker .step .step_label:after {
        left: 100%;
        border-color: transparent;
        border-left-color: rgba(0, 0, 0, 0.06);
      }
      .status_tracker .step.fulfilled .step_label {
        background-color: rgba(0, 0, 0, 0.09);
      }
      .status_tracker .step.fulfilled .step_label:before {
        border-color: rgba(0, 0, 0, 0.09);
        border-left-color: transparent;
      }
      .status_tracker .step.fulfilled .step_label:after {
        border-left-color: rgba(0, 0, 0, 0.09);
      }
      </style>
      <div class="is-size-7 status_tracker">
        ${steps.map(({ fulfilled, step }) => `
          <div class="${`step ${fulfilled ? 'fulfilled' : 'has-text-grey'}`}"><div class="step_label"><span class="icon"><i class="fa ${fulfilled ? 'fa-check-circle-o' : 'fa-circle-o'}"></i></span>${step}</div></div>
        `)}
      </div>
    `
  }
}
