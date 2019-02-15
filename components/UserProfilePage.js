const { APP_NAME, WWW_DOMAIN, WWW_URL } = process.env
const Component = require('./Component')
const Comment = require('./Comment')

module.exports = class UserProfilePage extends Component {
  oninit() {
    if (!this.state.user) return this.location.redirect('/sign_in')
    return this.fetchProfileProposedLegislation()
  }
  fetchProfileProposedLegislation() {
    this.setState({ loading: true })
    return this.api(`/measures_detailed?author_id=eq.${this.state.selected_profile.user_id}`)
      .then(userLegislation => this.setState({ loading: false, userLegislation }))
  }
  render() {
    const { proxied_name, selected_profile: p, user, userLegislation = [] } = this.state
console.log(p)
    return this.html`
      <section class="section">
        <div class="container is-widescreen">
          ${user && !user.verified ?
            UnverifiedNotification.for(this) : []
          }
          ${user && p.username && user.username === p.username ?
            YourProfileNotification.for(this) : []
          }
          ${proxied_name ? [`
            <div class="notification is-info">
              Your proxy to ${proxied_name} has been saved.
            </div>
          `] : []}
          <div class="columns is-variable is-9">
            <div class="column is-one-third">
              <div class="columns is-mobile">
                <div class="column is-one-third is-one-quarter-mobile">
                  <div class="image is-square">
                    ${user && p.username && user.username === p.username
                      ? [`<a href="https://gravatar.com" target="_blank"><img src=${this.avatarURL(p)} alt="avatar" class="round-avatar-img"></a>`]
                      : [`<img src=${this.avatarURL(p)} alt="avatar" class="round-avatar-img">`]
                    }
                  </div>
                </div>
                <div class="column">
                  <h1 class="title is-3">${p.name}</h1>
                  ${p.username ? [`<h2 class="subtitle is-5 has-text-grey-light">@${p.username}</h2>`] : ''}

                </div>

              </div>
              <div class="columns is-size-5">
                <div class="column">
                  <span>&nbsp&nbsp&nbsp&nbsp${p.public_votes[0] === null ? '0' : p.public_votes.length + 1}</span>
                  <br />
                  &nbsp&nbsp${summaryTooltipButton('bullhorn', `Votes`)}
                  <br />
                </div>

                <div class="column">
                  <span>${commentCount(p)}</span>
                  <br />
                  ${summaryTooltipButton('comment', 'Comments')}
                  <br />
                </div>
                <div class="column">
              <span>${proposalCount(userLegislation)}</span>
                  <br />
                  ${summaryTooltipButton('file', 'Proposals')}
                  <br />
                </div>
                <div class="column">
                  ${[p.direct_proxy_count
                    ? `&nbsp<span> ${p.direct_proxy_count} </span>`
                    : `1`
                  ]}
                  <br />
                  ${summaryTooltipButton('handshake', 'Directly representing')}
                </div>
                <div class="column">
                  ${[p.max_vote_power
                    ? `&nbsp<span> ${p.max_vote_power} </span>`
                    : `1`
                  ]}
                  <br />
                  ${summaryTooltipButton('users', 'Indirectly representing')}
                </div>
              </div>

              ${user && p.username && user.username === p.username
                ? [`
                  <link rel="stylesheet" href="/assets/bulma-tooltip.min.css">
                  <button disabled class="button is-link is-outlined is-fullwidth is-medium tooltip is-tooltip-info fix-bulma-centered-text" data-tooltip="You can't proxy to yourself">
                    <span class="icon is-small"><i class="far fa-handshake"></i></span>
                    <span>Proxy</span>
                  </button>
                  `]
                : ProxyButton.for(this)
              }
              ${p.public_votes && p.public_votes.length && !user ? [`
                <div class="content is-size-7 has-text-left">
                  <br />
                  <p><strong>${APP_NAME}</strong> lets you vote on any legislative bill, but most of us won't have time to do that.</p>
                  <p>Proxy to ${p.first_name} to vote for you whenever you don't vote directly yourself.</p>
               </div>
             `] : []}
             <br />
             <br />
             ${p.about ? AboutUser.for(this) : ''}

            </div>
            <div class="column">
              ${(!p.about && !p.public_votes.length)
                ? EmptyProfileExplainer.for(this) : ''}

              ${p.public_votes.length
                ? PublicVotes.for(this) : ''}
              ${!p.username
                ? GhostProfileMessage.for(this) : ''}
            </div>
            <style>
              .highlight-hover:hover {
                background: #f6f8fa;
              }
              .summary-tooltip {
                position: relative;
              }
              .summary-tooltip .summary-tooltip-content {
                display: none;
                position: absolute;
                max-height: 222px;
              }
              .summary-tooltip .summary-tooltip-arrow {
                display: none;
                position: absolute;
              }
              .summary-tooltip:hover .summary-tooltip-content {
                display: block;
                background: hsl(0, 0%, 100%) !important;
                box-shadow: 0px 4px 15px hsla(0, 0%, 0%, 0.15);
                border: 1px solid hsl(0, 0%, 87%);
                color: #333;
                font-size: 14px;
                overflow: hidden;
                padding: .4rem .8rem;
                text-align: center;
                white-space: normal;
                width: 100px;
                z-index: 99999;
                top: auto;
                bottom: 0%;
                left: 0%;
                right: 100%;
                transform: translate(-0.5rem, 50%);
              }
              .summary-tooltip:hover .summary-tooltip-arrow {
                border-color: transparent transparent transparent hsl(0, 0%, 100%) !important;
                z-index: 99999;
                position: right;
                display: inline-block;
                pointer-events: none;
                border-style: solid;
                border-width: .5rem;
                margin-left: -.5rem;
                margin-top: -.5rem;
                top: 50%;
                left: -1px;
              }
              .summary-tooltip:hover .has-text-grey-lighter {
                color: hsl(0, 0%, 75%) !important;
              }
            </style>
          </div>
        </div>
      </section>
    `
  }
}

class GhostProfileMessage extends Component {
  render() {
    const { selected_profile } = this.state
    return this.html`
      <div class="content">
        <p>
          Are you ${selected_profile.name}? <a target="_blank" href="${`mailto:support@${WWW_DOMAIN}?subject=Claiming+twitter/${selected_profile.twitter_username}&body=I will send twitter.com/VoteLiquid a DM from @${selected_profile.twitter_username}`}"><strong>Claim this profile</strong></a>.
        </p>
      </div>
    `
  }
}

class EmptyProfileExplainer extends Component {
  render() {
    const { selected_profile } = this.state
    return this.html`
      <div class="content">
        <h3><strong>${APP_NAME}</strong> lets you pick anyone to represent you.</h3>
        <p>You can vote on any legislative bill, but most of us won't have time to do that.</p>
        <p>Proxy to ${selected_profile.first_name} to vote for you whenever you don't vote directly yourself.</p>
        ${[!selected_profile.username ? `
          <p>They haven't joined ${APP_NAME} yet, and will be sent <a href="https://twitter.com/liquid_notifs" target="_blank"><strong>a tweet</strong></a> for each new request.<br />
            When ${selected_profile.first_name} signs up, they will immediately represent their proxiers.</p>
        ` : '']}
        <p><a target="_blank" href="${`https://blog.${WWW_DOMAIN}/2017/11/06/announcing-united-vote/`}"><strong>Learn more about how we're building a democracy we can trust</strong>.</a></p>
      </div>
    `
  }
}

class AboutUser extends Component {
  videoIframeSrc() {
    const { intro_video_url } = this.state.selected_profile
    const video_match = (intro_video_url || '').match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/)
    let src = ''
    if (video_match) {
      if (video_match[3].slice(0, 5) === 'youtu') {
        src = `https://www.youtube.com/embed/${video_match[6]}`
      } else {
        src = `https://player.vimeo.com/video/${video_match[6]}`
      }
    }
    return src
  }
  render() {
    const about_text = this.linkifyUrls(this.state.selected_profile.about || '')
    const video_src = this.videoIframeSrc()

    return this.html`
      <div>
      ${[video_src
        ? `<div class="responsive-video-wrapper">
            <iframe width="560" height="315" src="${video_src}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          </div>
          <br />
          <style>
            .responsive-video-wrapper {
              position: relative;
              padding-bottom: 56.25%; /* 16:9 */
              height: 0;
            }
            .responsive-video-wrapper iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          </style>`
        : '']}
      ${[about_text ? `<div class="content"><p class="is-size-5">${about_text}</p></div>` : '']}
      <br />
      </div>
    `
  }
}

class PublicVotes extends Component {
  render() {
    const { selected_profile } = this.state
    const { public_votes } = selected_profile

    return this.html`
      <div>
        <style>
          .comment {
            border-bottom: 1px solid #eee;
            margin-bottom: 1rem !important;
            padding-bottom: 1rem;
          }
        </style>
        ${public_votes.map(public_vote => Comment.for(this, { show_bill: true, ...public_vote, endorsements: false }, `vote-card-${public_vote.id}`))}
      </div>
    `
  }
}

class ProxyButton extends Component {
  onsubmit(event) {
    event.preventDefault()

    const { selected_profile, user } = this.state

    // Redirect to /join if they're not logged in
    if (!user) {
      this.storage.set('proxying_user_id', selected_profile.user_id)
      return this.location.redirect('/join')
    }

    // Don't let them proxy to themselves
    if (!selected_profile.twitter_username && user && user.username === selected_profile.username) {
      return
    }

    if (!selected_profile.proxied) {
      return this.api('/delegations', {
        method: 'POST',
        headers: { Prefer: 'return=representation' }, // returns created delegation in response
        body: JSON.stringify({
          from_id: user.id,
          to_id: selected_profile.user_id,
          delegate_rank: 0,
        }),
      })
      .then(() => {
        selected_profile.direct_proxy_count += 1
        selected_profile.proxied = true
        return { selected_profile }
      })
      .catch((error) => {
        if (error.code === 'P0001') {
          this.storage.set('proxying_user_id', selected_profile.user_id)
          return this.location.redirect('/get_started/basics?notification=proxy_wo_name')
        }
      })
    }
    return this.api(`/delegations?id=eq.${selected_profile.proxied}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' }, // returns created delegation in response
    })
    .then(() => {
      selected_profile.direct_proxy_count -= 1
      selected_profile.proxied = false
      return { selected_profile }
    })
  }
  render() {
    const { selected_profile } = this.state
    const proxied = selected_profile.proxied
    return this.html`
      <form onsubmit=${this} action=${this} method="POST">
        <button disabled=${proxied} type="submit" class="${`button is-link is-medium is-fullwidth fix-bulma-centered-text ${proxied ? '' : 'is-outlined'}`}">&nbsp;<span class="icon is-small"><i class="far fa-handshake"></i></span> <span>${proxied ? 'Proxied' : `Proxy to ${selected_profile.first_name}`}</span></button>
        ${proxied
          ? [`
              <div class="content is-size-7">
                <br />
                <p>You've proxied to ${selected_profile.name}. To unproxy or manage your proxies visit your <a href="/proxies">Proxies</a> page.</p>
              </div>
            `]
          : []
          }
      </form>
    `
  }
}

class UnverifiedNotification extends Component {
  render() {
    return this.html`
      <div class="notification">
        <span class="icon"><i class="fa fa-user"></i></span> Want a profile page of your own? <a href="/get_started"><strong>Finish verification</strong></a> to start to build your voting power.
      </div>
    `
  }
}

class YourProfileNotification extends Component {
  render() {
    const { selected_profile } = this.state

    return this.html`
      <div class="notification">
        <h4 class="title is-5">This is your profile page.</h4>
        <div class="columns is-multiline">
          <div class="column is-half">
            <span class="icon"><i class="fa fa-users"></i></span> Share the URL <strong><a href="${`${WWW_URL}/${selected_profile.username}`}">${WWW_DOMAIN}/${selected_profile.username}</a></strong> with others to easily proxy to you.
          </div>
          <div class="column is-half">
            <span class="icon"><i class="fa fa-camera"></i></span> Change your photo by signing in to <a href="https://www.gravatar.com"><strong>Gravatar</strong></a> with your same email.
          </div>
          <div class="column is-half">
            <span class="icon"><i class="fa fa-edit"></i></span> Check <em>Public</em> when you <a href="/legislation"><strong>vote</strong></a> to build your public voting record.
          </div>
          <div class="column is-half">
            <span class="icon"><i class="fas fa-user-circle"></i></span> <a href="/edit_profile"><strong>Edit Profile</strong></a> to add an intro video or bio to your page.
          </div>
        </div>
      </div>
    `
  }
}
function commentCount(p) {
  let commentTracker = 0
  let i
  for (i = 0; i < p.public_votes.length + 1; i++) {
    if (p.public_votes[i] && p.public_votes[i].comment !== null) {
      commentTracker += 1
    }
} return commentTracker
}
function proposalCount(userLegislation) {
  let proposalTracker = 0
  let i
  for (i = 0; i < userLegislation.length + 1; i++) {
    if (userLegislation[i] && userLegislation[i].published === true) {
      proposalTracker++
    }
} return proposalTracker
}
const summaryTooltipButton = (icon, text) => [`
    <span class="icon summary-tooltip">
      <i class="fa fa-lg fa-${icon} has-text-gray"></i>
      <div class="summary-tooltip-content">${text}</div>
      <div class="summary-tooltip-arrow"></div>
    </span>
    `]
