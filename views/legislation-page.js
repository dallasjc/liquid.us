const { html } = require('../helpers')
const activityIndicator = require('./activity-indicator')

module.exports = (state, dispatch) => {
  const { cookies, geoip, legislatures, loading, measures, measuresByUrl, location, user } = state
  const { query, url } = location
  const showFilters = location.query.show_filters || cookies.show_filters

  return html`
      <div class="section whole-page">
        <div>
          <div class="column main-column">
            <div class="container bill-details">
              <div class="has-text-centered">
                ${filterButton(state)}&nbsp${proposeButton()}
              </div><br />
              <div class="${showFilters === 'on' ? 'has-text-centered' : 'is-hidden'}">
                ${filterForm(geoip, legislatures, cookies, location, user, dispatch)}
              </div><br />
              ${(!user || !user.address) && geoip ? [addAddressNotification(geoip, user)] : []} <br />
              ${loading.measures || !measuresByUrl[url] ? activityIndicator() :
              (!measuresByUrl[url].length ? noBillsMsg(query.order, query) : measuresByUrl[url].map((shortId) => measureListRow(measures[shortId])))}
            </div>
          </div>
          <style>
            .bill-details {
              max-width: 1500px;
            }
            .filter-tabs {
              padding-top: 1rem;
              padding-bottom: 1rem;
              background-color: #FFF;
            }
            .highlight-hover {
              background-color: #FFF;
            }
            .highlight-hover:hover {
              background: #f6f8fa;
            }
            .filter_checkboxes {
              max-width: 1500px;
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
              text-align: left;
              white-space: normal;
              width: 400px;
              z-index: 99999;
              top: auto;
              bottom: 50%;
              left: auto;
              right: 100%;
              transform: translate(-0.5rem, 50%);
            }
            .summary-tooltip:hover .summary-tooltip-arrow {
              border-color: transparent transparent transparent hsl(0, 0%, 100%) !important;
              z-index: 99999;
              position: absolute;
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
            .whole-page {
              background-color: #f6f8fa;
            }
            .already-voted {
              font-size: 20px;
            }
            .bill-title {
              margin-bottom: 0.5rem;
            }
            .vote-now {
              font-size: 20px;
            }
            @media (max-width: 1086px) {
              .whole-page {
                padding: 0;
              }
              .bill-details {
                padding-top: 2rem;
              }
              .filter-tabs {
                padding-left: 1rem;
              }
              .main-column {
                padding: 0rem;
              }
            }
          </style>
          </div>
        </div>
      `
    }

const toggleFilter = (cookies, dispatch, filterName, value) => (event) => {
  const btn = document.querySelector('.filter-submit')
  if (btn.disabled) {
    event.preventDefault()
  } else {
    if (event.currentTarget && event.currentTarget.checked) {
      dispatch({ type: 'cookieSet', key: `${filterName}`, value: `${value}` })
    } else {
      dispatch({ type: 'cookieUnset', key: `${filterName}` })
    }
    btn.click()
  }
}


const updateFilter = (event, location, dispatch, userState, state, userCity, city) => {
  event.preventDefault()
  const formData = require('parse-form').parse(event.target).body
  const formUrl = `${location.path}?${Object.keys(formData).map((key) => {
    if (key === 'state_upper') { return `state=${formData[key] === 'on' ? userState : state}&state_upper=${formData[key] === 'on'}` }
    if (key === 'state_lower') { return `state=${formData[key] === 'on' ? userState : state}&state_lower=${formData[key] === 'on'}` }
    if (key === 'liquid_state') { return `state=${formData[key] === 'on' ? userState : state}&liquid_state=${formData[key] === 'on'}` }
    if (key === 'liquid_city') { return `city=${formData[key] === 'on' ? `${userCity}, ${userState}` : city}&liquid_city=${formData[key] === 'on'}` }

    return `${key}=${formData[key]}`
  }).join('&')}`
  dispatch({ type: 'redirected', url: formUrl })
}

const filterForm = (geoip, legislatures, cookies, location, user, dispatch) => {
  const showFilters = location.query.show_filters || cookies.show_filters
  const hide_direct_votes = location.query.hide_direct_votes || cookies.hide_direct_votes
  const bills = location.query.bills || cookies.bills
  const nominations = location.query.nominations || cookies.nominations
  const resolutions = location.query.resolutions || cookies.resolutions
  const recently_introduced = location.query.recently_introduced || cookies.recently_introduced
  const committee_action = location.query.committee_action || cookies.committee_action
  const committee_discharged = location.query.committee_discharged || cookies.committee_discharged
  const passed_one = location.query.passed_one || cookies.passed_one
  const passed_both = location.query.passed_both || cookies.passed_both
  const resolving = location.query.resolving || cookies.resolving
  const failed_one = location.query.failed_one || cookies.failed_one
  const to_exec = location.query.to_exec || cookies.to_exec
  const enacted = location.query.enacted || cookies.enacted
  const veto = location.query.veto || cookies.veto
  const us_house = location.query.us_house || cookies.us_house
  const us_senate = location.query.us_senate || cookies.us_senate
  const liquid_us = location.query.liquid_us || cookies.liquid_us
  const userState = user && user.address ? user.address.state : geoip ? geoip.region : ''
  const userCity = user && user.address ? user.address.city : geoip ? geoip.city : ''
  const state_upper = location.query.state_upper || cookies.state_upper
  const state_lower = location.query.state_lower || cookies.state_lower
  const liquid_state = location.query.liquid_state || cookies.liquid_state
  const city_council = location.query.city_council || cookies.city_council
  const liquid_city = location.query.liquid_city || cookies.liquid_city
  const summary_available = location.summary_available || cookies.summary_available
  const state = location.query.state || cookies.state
  const city = location.query.city || cookies.city

  return html`
    <form name="legislation_filters" class="is-inline-block" method="GET" action="/legislation" onsubmit="${(e) => updateFilter(e, location, dispatch, userState, state, userCity, city)}">
      <div class="field is-grouped is-grouped-center">
        <div class="control">
          <input type="checkbox" onclick=${toggleFilter(cookies, dispatch, 'show_filters', 'on')} name="show_filters" checked=${!!showFilters} class="is-hidden" />
          <div id="filter_checkboxes">
            <div class="columns has-text-left">
              <div class="column" style="width: 270px">
                <h3>Chamber</h3>
                <div>
                  <label class="checkbox has-text-grey">
                    <input onclick=${toggleFilter(cookies, dispatch, 'liquid_us', 'on')} type="checkbox" name="liquid_us" checked=${!!liquid_us} />
                    Liquid Congress
                  </label>
                </div>
                <div>
                  <label class="checkbox has-text-grey">
                    <input onclick=${toggleFilter(cookies, dispatch, 'us_house', 'on')} type="checkbox" name="us_house" checked=${!!us_house} />
                    U.S. House
                  </label>
                </div>
                <div>
                  <label class="checkbox has-text-grey">
                    <input onclick=${toggleFilter(cookies, dispatch, 'us_senate', 'on')} type="checkbox" name="us_senate" checked=${!!us_senate} />
                    U.S. Senate
                  </label>
                </div>
                <div>
                  <label class="checkbox has-text-grey">
                    <input onclick=${toggleFilter(cookies, dispatch, 'liquid_state', `${userState}`)} type="checkbox" name="liquid_state" checked=${!!liquid_state} />
                    ${liquid_state ? `Liquid ${state}` : `Liquid ${userState}`}
                  </label>
                </div>
                <div>
                  <label class="checkbox has-text-grey">
                    <input onclick=${toggleFilter(cookies, dispatch, 'state_lower', `${userState}`)} type="checkbox" name="state_lower" checked=${!!state_lower} />
                    ${state_lower ? `${state} Lower` : `${userState} Lower`}
                  </label>
                </div>
                <div>
                  <label class="checkbox has-text-grey">
                    <input onclick=${toggleFilter(cookies, dispatch, 'state_upper', `${userState}`)} type="checkbox" name="state_upper" checked=${!!state_upper} />
                    ${state_upper ? `${state} Upper` : `${userState} Upper`}
                  </label>
                </div>
                <div>
                  <label class="checkbox has-text-grey is-hidden">
                    <input onclick=${toggleFilter(cookies, dispatch, 'city_council', `${userCity}, ${userState}`)} type="checkbox" name="city_council" checked=${!!city_council} />
                    ${city_council && city ? `${city.slice(0, ',')} Council` : `${userCity} Council`}
                  </label>
                </div>
                <div>
                  <label class="checkbox has-text-grey">
                    <input onclick=${toggleFilter(cookies, dispatch, 'liquid_city', `${userCity}, ${userState}`)} type="checkbox" name="liquid_city" checked=${!!liquid_city} />
                    ${liquid_city === true ? `Liquid ${city.slice(0, ',')}` : `Liquid ${userCity}`}
                  </label>
                </div>
              </div>
              <div class="column type">
                <h3>Type</h3>
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'bills', 'on')} type="checkbox" name="bills" checked=${!!bills} />
                  Bills
                </label><br>
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'nominations', 'on')} type="checkbox" name="nominations" checked=${!!nominations} />
                  Nominations
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'summary_available', 'on')} type="checkbox" name="summary_available" checked=${!!summary_available} />
                  Summary available
                </label><br />
                <label class="checkbox has-text-grey is-hidden">
                  <input onclick=${toggleFilter(cookies, dispatch, 'resolutions', 'on')} type="checkbox" name="resolutions" checked=${!!resolutions} />
                  Resolutions
                </label>
                <label class="${`checkbox has-text-grey control ${user ? '' : 'is-hidden'}`}">
                  <input onclick=${toggleFilter(cookies, dispatch, 'hide_direct_votes', 'on')} type="checkbox" name="hide_direct_votes" checked=${!!hide_direct_votes}>
                  Hide My Votes
                </label>
              </div>

              <div class="column" style="width: 230px">
                <h3>Legislative Action</h3>
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'recently_introduced', 'on')} type="checkbox" name="recently_introduced" checked=${!!recently_introduced} />
                  Introduced
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'committee_action', 'on')} type="checkbox" name="committee_action" checked=${!!committee_action} />
                  Committee Action
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'committee_discharged', 'on')} type="checkbox" name="committee_discharged" checked=${!!committee_discharged} />
                  Committee Discharged
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'passed_one', 'on')} type="checkbox" name="passed_one" checked=${!!passed_one} />
                  Passed One Chamber
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'failed_one', 'on')} type="checkbox" name="failed_one" checked=${!!failed_one} />
                  Failed or Withdrawn
                </label>
                <br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'passed_both', 'on')} type="checkbox" name="passed_both" checked=${!!passed_both} />
                  Passed Both Chambers
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'resolving', 'on')} type="checkbox" name="resolving" checked=${!!resolving} />
                  Resolving Differences
                </label>
              </div>

              <div class="column exec-action">
                <h3>Executive Action</h3>
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'to_exec', 'on')} type="checkbox" name="to_exec" checked=${!!to_exec} />
                  To Executive
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'enacted', 'on')} type="checkbox" name="enacted" checked=${!!enacted} />
                  Enacted
                </label><br />
                <label class="checkbox has-text-grey">
                  <input onclick=${toggleFilter(cookies, dispatch, 'veto', 'on')} type="checkbox" name="veto" checked=${!!veto} />
                  Vetoed
                </label>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="filter-submit is-hidden">Update</button>
      </div>
    </form>
  `
}

const addAddressNotification = (geoip = {}, user) => {
  return html`
    <p class="help">
      We guessed your location is <strong>${geoip.city}, ${geoip.regionName}.</strong><br />
      But this is only an approximation. <strong><a href="${user ? '/get_started/basics' : '/join'}">${user ? 'Go here' : 'Join'} to set your address</a></strong>.
    </p>
  `
}

const measureListRow = (s) => {
  const next_action_at = s.next_agenda_action_at || s.next_agenda_begins_at
  const measureUrl = s.author_username ? `/${s.author_username}/legislation/${s.short_id}` : `/legislation/${s.short_id}`

  return html`
    <div class="card highlight-hover">
      <div class="card-content">
        <div class="columns">
          <div class="column">
            <h3><a href="${measureUrl}">${s.title}</a></h3>
            ${s.introduced_at ? html`
            <div class="is-size-7 has-text-grey">
              <span class="has-text-weight-bold">${s.short_id.replace(/^[^-]+-(\D+)(\d+)/, '$1 $2').toUpperCase()}</span> &mdash;
              ${s.sponsor_first_name
                ? html`Introduced by&nbsp;<a href=${`/${s.sponsor_username}`}>${s.sponsor_first_name} ${s.sponsor_last_name}</a>&nbsp;on ${(new Date(s.introduced_at)).toLocaleDateString()} - ${s.legislature_name}`
                : html`Introduced on ${(new Date(s.introduced_at)).toLocaleDateString()} - ${s.legislature_name}`
              }
              ${s.summary ? html`
                <p class="is-hidden-tablet"><strong class="has-text-grey">Has summary</strong></p>
              ` : ''}
              <p><strong class="has-text-grey">Status:</strong>
              ${next_action_at ? html`
                Scheduled for House floor action ${!s.next_agenda_action_at ? 'during the week of' : 'on'} ${new Date(next_action_at).toLocaleDateString()}
              ` : s.status === 'Awaiting floor or committee vote' ? 'Discharged from committee' : s.status}</p>
              <p><strong class="has-text-grey">Last action:</strong> ${new Date(s.last_action_at).toLocaleDateString()}</p>
            </div>
            ` : html`
              <div class="is-size-7 has-text-grey">
                ${s.author_username
                  ? html`Authored by <a href="${`/${s.author_username}`}">${s.author_first_name} ${s.author_last_name}</a>`
                  : html`Authored by Anonymous `}
                on ${(new Date(s.created_at)).toLocaleDateString()} - ${s.legislature_name}
              </div>
            `}
          </div>
          <div class="column is-one-quarter has-text-right-tablet has-text-left-mobile">
            ${voteButton(s)}
            ${s.summary ? summaryTooltipButton(s.id, s.short_id, s.summary) : ''}
          </div>
        </div>
      </div>
    </div>
  `
}

const votePositionClass = (position) => {
  if (position === 'yea') return 'is-success'
  if (position === 'nay') return 'is-danger'
  return ''
}

const voteButton = (s) => {
  let voteBtnTxt = 'Vote'
  let voteBtnClass = 'button is-small is-outlined is-primary'
  let voteBtnIcon = 'fas fa-edit'
  if (s.vote_position) {
    const position = `${s.vote_position[0].toUpperCase()}${s.vote_position.slice(1)}`
    if (s.vote_position === 'yea') voteBtnIcon = 'fa fa-check'
    if (s.vote_position === 'nay') voteBtnIcon = 'fa fa-times'
    if (s.vote_position === 'abstain') voteBtnIcon = 'far fa-circle'
    if (s.delegate_rank > -1) {
      if (s.delegate_name) {
        voteBtnTxt = `Inherited ${position} vote from ${s.delegate_name}`
      } else {
        voteBtnTxt = `Inherited ${position} vote from proxy`
      }
      voteBtnClass = `button is-small is-outlined ${votePositionClass(s.vote_position)}`
    }
    if (s.delegate_rank === -1) {
      voteBtnTxt = `You voted ${position}`
      voteBtnClass = `button is-small ${votePositionClass(s.vote_position)}`
    }
  }
  return html`<a style="white-space: inherit; height: auto;" class="${voteBtnClass}" href="${`/legislation/${s.short_id}`}">
    <span class="icon" style="align-self: flex-start;"><i class="${voteBtnIcon}"></i></span>
    <span class="has-text-weight-semibold">${voteBtnTxt}</span>
  </a>`
}

const proposeButton = () => html`
  <a class="button is-primary" href="/legislation/propose">
    <span class="icon"><i class="fa fa-file"></i></span>
    <span class="has-text-weight-semibold">Propose Legislation</span>
  </a>
`
// determine whether to show filters

const filterButton = ({ location, cookies }) => {
  const showFilters = location.query.show_filters === 'on' || cookies.show_filters === 'on'
  return html`
    <button onclick="${toggleShowFilters}" class="button is-link is-outlined">
    <span class="icon"><i class="fa fa-filter"></i></span>
    <span class="has-text-weight-semibold">${showFilters ? 'Hide Filters' : 'Show Filters'}</span>
  </button>
`
}
const toggleShowFilters = () => {
  document.querySelector('[name="show_filters"]').click()
}
const summaryTooltipButton = (id, short_id, summary) => html`
  <a href="${`/legislation/${short_id}`}" class="is-hidden-mobile">
    <br />
    <br />
    <span class="icon summary-tooltip">
      <i class="fa fa-lg fa-info-circle has-text-grey-lighter"></i>
      <div class="summary-tooltip-content">${{ html: summary }}</div>
      <div class="summary-tooltip-arrow"></div>
    </span>
  </a>
`

const noBillsMsg = (state_upper, state_lower) => html`
  <div>
    ${state_upper === 'on' || state_lower === 'on' ? [`
      <p class="is-size-5">Liquid doesn't have this legislature's bill list yet. Please email <a href="mailto:support@liquid.us" target="_blank">support@liquid.us</a> to request this location, or change your selected criteria.</p>
    `] : [`
      No policies match the current criteria. Propose a bill or change your selected filters.
    `]}
  </div>
`