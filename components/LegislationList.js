const { api, html, preventDefault, redirect } = require('../helpers')
const activityIndicator = require('./ActivityIndicator')
const stateNames = require('datasets-us-states-abbr-names')

module.exports = {
  init: ({ legislatures, location = {}, measures = {}, measuresList = [], measuresQuery, storage, user, showFilters }) => [{
    location,
    legislatures,
    loading: true,
    measures,
    measuresList,
    measuresQuery,
    showFilters,
  }, initialize(measuresQuery, location, storage, user)],
  update: (event, state) => {
    console.log('update()', event, state)
    switch (event.type) {
      case 'error':
        return [{ ...state, loading: false }]
      case 'filterFormSubmitted':
        return [{ ...state, loading: true }, preventDefault(event.event)]
      case 'receivedMeasures':
        return [{
          ...state,
          loading: false,
          measures: { ...state.measures, ...event.measures },
          measuresList: event.measuresList,
          measuresQuery: state.location.url,
        }]
      case 'redirected':
        return [state, redirect(event.url, event.status)]
      case 'loaded':
      default:
        return [{ ...state, loading: false }]
    }
  },
  view: (state, dispatch) => {
    const { loading, measuresList, location, measures } = state
    const { query } = location

    return html()`
      <div class="section">
        <div class="container is-widescreen">
          <div>
            ${filterButton(state, dispatch)}
            <span class="is-right has-text-left-mobile">
              ${proposeButton()}
            </span>
          </div>
          <br>
          ${filterTabs(state, dispatch)}
          ${loading ? activityIndicator() :
            (!measuresList.length ? noBillsMsg(query.order, query) : measuresList.map((short_id) => measureListRow(measures[short_id])))}
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
          </style>
        </div>
      </div>
    `
  },
}


const toggleFilter = (storage, filterName) => (event) => {
  const btn = document.querySelector('.filter-submit')
  if (btn.disabled) {
    event.preventDefault()
  } else {
    if (event.currentTarget && event.currentTarget.checked) {
      storage.set(filterName, 'on')
    } else {
      storage.unset(filterName)
    }
    btn.click()
  }
}

const updateFilter = (event, location, dispatch) => {
  event.preventDefault()
  const formData = require('parse-form').parse(event.target).body
  const formUrl = `${location.path}?${Object.keys(formData).map((key) => {
    return `${key}=${formData[key]}`
  }).join('&')}`
  dispatch({ type: 'redirected', url: formUrl })
}

const filterForm = (geoip, legislatures, storage, location, user, dispatch) => {
  const showFilters = location.query.show_filters || storage.get('show_filters')
  const from_liquid = location.query.from_liquid || storage.get('from_liquid')
  const from_leg_body = location.query.from_leg_body || storage.get('from_leg_body')
  const bills = location.query.floor_consideration || storage.get('bills')
  const nominations = location.query.nominations || storage.get('nominations')
  const resolutions = location.query.resolutions || storage.get('resolutions')
  const congress = location.query.congress || storage.get('congress')
  const state = location.query.state || storage.get('state')
  const city = location.query.city || storage.get('city')
  const userCity = user && user.address ? user.address.city : geoip ? geoip.city : ''
  const userState = user && user.address ? user.address.state : geoip ? geoip.regionName : ''

  const recently_introduced = location.query.recently_introduced || storage.get('recently_introduced')
  const recent_update = location.query.recent_update || storage.get('recent_update')
  const floor_consideration = location.query.floor_consideration || storage.get('floor_consideration')
  const committee_discharged = location.query.committee_discharged || storage.get('committee_discharged')
  const committee_action = location.query.committee_action || storage.get('committee_action')
  const passed_one = location.query.passed_one || storage.get('passed_one')
  const failed_one = location.query.failed_one || storage.get('failed_one')
  const passed_both = location.query.passed_both || storage.get('passed_both')
  const resolving = location.query.resolving || storage.get('resolving')
  const to_exec = location.query.to_exec || storage.get('to_exec')
  const enacted = location.query.enacted || storage.get('enacted')
  const veto = location.query.veto || storage.get('veto')

  // Add legislature from URL to legislature selection
  if (location.query.legislature && !legislatures.some(({ abbr }) => abbr === location.query.legislature)) {
    legislatures.push({
      abbr: location.query.legislature,
      name: stateNames[location.query.legislature] || location.query.legislature,
    })
  }

  return html()`
    <form name="legislation_filters" class="is-inline-block is-centered" method="GET" action="/legislation" onsubmit="${(e) => updateFilter(e, location, dispatch)}">
      <button type="submit" class="filter-submit is-hidden">Update</button>
      <input type="checkbox" onclick=${toggleFilter(storage, 'show_filters')} name="show_filters" checked=${!!showFilters} class="is-hidden" />
      <div id="filter_checkboxes" style="display:block;">
        <div class="columns is-centered">
          <div class="column">
            <h3>Jurisdiction</h3>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'congress')} type="checkbox" name="congress" checked=${!!congress} />
              Congress
            </label>
              <br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'state')} type="checkbox" name="state" checked=${!!state} />
                ${userState}
            </label>
            <br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'city')} type="checkbox" name="city" checked=${!!city} />
              ${userCity}
            </label>
          </div>

          <div class="column">
            <h3>Type</h3>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'from_leg_body')} type="checkbox" name="from_leg_body" checked=${!!from_leg_body} />
              Imported
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'Bills')} type="checkbox" name="bills" checked=${!!bills} />
              Bills
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'nominations')} type="checkbox" name="nominations" checked=${!!nominations} />
              Nominations
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'from_liquid')} type="checkbox" name="from_liquid" checked=${!!from_liquid} />
              Liquid Proposals
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'recent_updates')} type="checkbox" name="recent_update" checked=${!!recent_update} />
              Updated
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'resolutions')} type="checkbox" name="resolutions" checked=${!!resolutions} />
              Resolutions
            </label>
          </div>

          <div class="column">
            <h3>Legislative Action</h3>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'recently_introduced')} type="checkbox" name="recently_introduced" checked=${!!recently_introduced} />
              Introduced
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'committee_action')} type="checkbox" name="committee_action" checked=${!!committee_action} />
              Committee Action
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'committee_discharged')} type="checkbox" name="committee_discharged" checked=${!!committee_discharged} />
              Committee Discharged
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'floor_consideration')} type="checkbox" name="floor_consideration" checked=${!!floor_consideration} />
              Floor Consideration
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'passed_one')} type="checkbox" name="passed_one" checked=${!!passed_one} />
              Passed One Chamber
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'failed_one')} type="checkbox" name="failed_one" checked=${!!failed_one} />
              Failed or Withdrawn
            </label>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'passed_both')} type="checkbox" name="passed_both" checked=${!!passed_both} />
              Passed Both Chambers
            </label>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'resolving')} type="checkbox" name="resolving" checked=${!!resolving} />
              Resolving Differences
            </label>
          </div>

          <div class="column">
            <h3>Executive Action</h3>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'to_exec')} type="checkbox" name="to_exec" checked=${!!to_exec} />
              To Executive
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'enacted')} type="checkbox" name="enacted" checked=${!!enacted} />
              Enacted
            </label><br>
            <label class="checkbox has-text-grey">
              <input onclick=${toggleFilter(storage, 'veto')} type="checkbox" name="veto" checked=${!!veto} />
              Vetoed
            </label>
          </div>
        </div>
      </div>
      ${(!user || !user.address) && geoip ? [addAddressNotification(geoip, user)] : []}
    </form>
  `
}

const addAddressNotification = (geoip = {}, user) => {
  return `
    <p class="help">
      We guessed your location is <strong>${geoip.city}, ${geoip.regionName}.</strong><br />
      But this is only an approximation. <strong><a href="${user ? '/get_started/basics' : '/join'}">${user ? 'Go here' : 'Join'} to set your address</a></strong>.
    </p>
  `
}

const filterTabs = ({ geoip, legislatures, location, storage, user }, dispatch) => {
  const showFilters = location.query.show_filters || storage.get('show_filters')
  return html()`
    <div class=${showFilters ? 'is-centered' : 'is-hidden'}>
      ${filterForm(geoip, legislatures, storage, location, user, dispatch)}
    </div><br>
  `
}

const measureListRow = (s) => {
  const next_action_at = s.next_agenda_action_at || s.next_agenda_begins_at
  const measureUrl = s.author_username ? `/${s.author_username}/legislation/${s.short_id}` : `/legislation/${s.short_id}`

  return `
    <div class="card highlight-hover">
      <div class="card-content">
       <div class="columns">
        <div class="column">
            <h3><a href="${measureUrl}">${s.title}</a></h3>
            ${s.introduced_at ? [`
            <div class="is-size-7 has-text-grey">
              ${s.sponsor_first_name && s.legislature_name
                ? [`Introduced by&nbsp;<a href=${`/${s.sponsor_username}`}>${s.sponsor_first_name} ${s.sponsor_last_name}</a>&nbsp;on ${(new Date(s.introduced_at)).toLocaleDateString()}`]
                : s.legislature_name
                ? [`Introduced in the ${s.legislature_name} legislature on ${(new Date(s.introduced_at)).toLocaleDateString()}`]
                : [`Introduced on ${(new Date(s.introduced_at)).toLocaleDateString()}`]
              }

              ${s.summary ? [`
                <p class="is-hidden-tablet"><strong class="has-text-grey">Has summary</strong></p>
              `] : []}
              <p><strong class="has-text-grey">Status:</strong>
              ${next_action_at ? [`
                Scheduled for House floor action ${!s.next_agenda_action_at ? 'during the week of' : 'on'} ${new Date(next_action_at).toLocaleDateString()}
                <br />
              `] : `${s.status}</p>`}
              <strong class="has-text-grey">Last action:</strong> ${new Date(s.last_action_at).toLocaleDateString()}
            </div>
          `] : [`
            <div class="is-size-7 has-text-grey">
              ${s.author_username & s.legislature_name
                ? `Authored for ${s.legislature_name} by <a href="${`/${s.author_username}`}">${s.author_first_name} ${s.author_last_name}</a>`
                : `Authored for ${s.legislature_name} by Anonymous`}
              on ${(new Date(s.created_at)).toLocaleDateString()}
            </div>
            `]}
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

const initialize = (prevQuery, location, storage, user) => (dispatch) => {
  const { query, url } = location

  if (prevQuery === url) return dispatch({ type: 'loaded' })
  const terms = query.terms && query.terms.replace(/[^\w\d ]/g, '').replace(/(hr|s) (\d+)/i, '$1$2').replace(/(\S)\s+(\S)/g, '$1 & $2')
  const fts = terms ? `&tsv=fts(simple).${encodeURIComponent(terms)}` : ''

  const userCitySt = user && user.address ? `"${user.address.city}, ${user.address.state}"` : ''
  const userState = user && user.address ? user.address.state : ''
  const congress = query.congress || storage.get('congress')
  const state = query.state || storage.get('state')
  const city = query.city || storage.get('city')
  const congressName = 'U.S. Congress'
  const leg_query = congress === 'on' && state === 'on' && city === 'on' ? `${congressName},${userState},${userCitySt}` : congress === 'on' && state === 'on' ? `${congressName},${userState}` : congress === 'on' && city === 'on' ? `${congressName},${userCitySt}` : congress === 'on' ? `${congressName}` : state === 'on' && city === 'on' ? `${userState},${userCitySt}` : state === 'on' ? `${userState}` : city === 'on' ? `${userCitySt}` : `${congressName},${userState},${userCitySt}`
  const legCheck = `&legislature_name=in.(${leg_query})`


  const recently_introduced = query.recently_introduced || storage.get('recently_introduced')
  const committee_discharged = query.committee_discharged || storage.get('committee_discharged')
  const floor_consideration = query.floor_consideration || storage.get('floor_consideration')
  const committee_action = query.committee_action || storage.get('committee_action')
  const passed_one = query.passed_one || storage.get('passed_one')
  const failed_one = query.failed_one || storage.get('failed_one')
  const passed_both = query.passed_both || storage.get('passed_both')
  const resolving = query.resolving || storage.get('resolving')
  const to_exec = query.to_exec || storage.get('to_exec')
  const pending_exec_cal = query.pending_exec_cal || storage.get('pending_exec_cal')
  const enacted_check = query.enacted || storage.get('enacted')
  const veto_check = query.veto || storage.get('veto')
  const withdrawn_check = query.withdrawn || storage.get('withdrawn')
  const failed_check = query.failed || storage.get('failed')

  const cd = committee_discharged === 'on'
  const flc = floor_consideration === 'on'
  const ca = committee_action === 'on'
  const poc = passed_one === 'on'
  const fw = failed_one === 'on' || withdrawn_check === 'on' || failed_check === 'on'
  const pbc = passed_both === 'on'
  const rc = resolving === 'on'
  const tec = to_exec === 'on'
  const ecc = pending_exec_cal === 'on'
  const vc = veto_check === 'on'
  const ec = enacted_check === 'on'
  const recent_update = query.recent_update || storage.get('recent_update')
  const lastAction = flc || cd || ca || poc || fw || pbc || rc || tec || ecc || vc || ec || recent_update === 'on' ? 'last_action_at' : 'created_at'

  const ri = recently_introduced === 'on'
  const introducedCheck = ri && (flc || cd || ca || poc || fw || pbc || rc || tec || ecc || vc || ec) ? `Introduced,Pending Committee,` : ri ? `Introduced,Pending Committee` : ''
  const floorCheck = flc && (cd || ca || poc || fw || pbc || rc || tec || ecc || vc || ec) ? 'Floor Consideration,Pending Executive Calendar,' : flc ? 'Floor Consideration,Pending Executive Calendar' : ''
  const dischargedCheck = cd && (ca || poc || fw || pbc || rc || tec || ecc || vc || ec) ? ',' : cd ? '' : ''
  const committeeActionCheck = ca && (poc || fw || pbc || rc || tec || ecc || vc || ec) ? 'Committee Consideration,' : fw ? 'Committee Consideration' : ''
  const passedOneCheck = poc && (fw || pbc || rc || tec || ecc || vc || ec) ? 'Passed One Chamber,' : poc ? 'Passed One Chamber' : ''
  const failedOne = fw && (pbc || rc || tec || ecc || vc || ec) ? 'Failed One Chamber,Withdrawn,Failed or Returned to Executive,' : fw ? 'Failed One Chamber,Withdrawn,Failed or Returned to Executive' : ''
  const passedBoth = pbc && (rc || tec || ecc || vc || ec) ? 'Passed Both Chambers,' : pbc ? 'Passed Both Chambers' : ''
  const resolvingCheck = rc && (tec || ecc || vc || ec) ? 'Resolving Differences,' : rc ? 'Resolving Differences' : ''
  const execCheck = tec && (ecc || vc || ec) ? 'To Executive,' : tec ? 'To Executive' : ''
  const enactedCheck = ec && vc ? 'Enacted,' : ec ? 'Enacted' : ''
  const vetoedCheck = vc ? 'Veto Actions' : ''

  const updated_query = recently_introduced === 'on' || flc || cd || ca || poc || fw || pbc || rc || tec || ecc || vc || ec ? '' : recent_update === 'on' ? '&status=neq.Introduced' : ''
  const introduced_query = updated_query === 'on' || flc || cd || ca || poc || fw || pbc || rc || tec || ecc || vc || ec ? '' : recently_introduced === 'on' ? '&status=eq.Introduced' : ''
  const allStatus = ri || flc || cd || ca || poc || fw || pbc || rc || tec || ecc || vc || ec ? '' : `Introduced,Floor Consideration,Committee Consideration,Passed One Chamber,Failed One Chamber,Passed Both Chambers,Resolving Differences,To Executive,Pending Executive Calendar,Enacted,Withdrawn,Veto Actions,Failed or Returned to Executive`

  const status_query = `&status=in.(${introducedCheck}${floorCheck}${dischargedCheck}${committeeActionCheck}${passedOneCheck}${failedOne}${passedBoth}${resolvingCheck}${execCheck}${enactedCheck}${vetoedCheck}${allStatus})`

  const from_liquid = query.from_liquid || storage.get('from_liquid')
  const from_leg_body = query.from_leg_body || storage.get('from_leg_body')
  const from_liquid_query = from_liquid === 'on' && from_leg_body !== 'on' ? '&introduced_at=is.null' : ''
  const from_leg_body_query = from_leg_body === 'on' && from_liquid !== 'on' ? '&introduced_at=not.is.null' : ''
  const nominations = query.nominations || storage.get('nominations')
  const resolutions = query.resolutions || storage.get('resolutions')
  const bills = query.bills || storage.get('bills')
  const bo = bills === 'on'
  const no = nominations === 'on'
  const ro = resolutions === 'on'
  const nominations_query = no && (bo || ro) ? 'nomination,' : no ? 'nomination' : ''
  const resolutions_query = ro && bo ? 'resolution,joint-resolution,' : ro ? 'resolution,joint-resolution' : ''
  const bills_query = bo ? 'bill' : ''
  const allType = no || ro || bo ? '' : 'bill,nomination,resolution,constitutional amendment'
  const type_query = `&type=in.(${nominations_query}${resolutions_query}${bills_query}${allType})`
  const fields = [
    'title', 'number', 'type', 'short_id', 'id', 'status',
    'sponsor_username', 'sponsor_first_name', 'sponsor_last_name',
    'introduced_at', 'last_action_at', 'next_agenda_begins_at', 'next_agenda_action_at',
    'summary', 'legislature_name', 'published', 'created_at', 'author_first_name', 'author_last_name', 'author_username', 'chamber',
  ]

  if (user) fields.push('vote_position', 'delegate_rank', 'delegate_name')
  const api_url = `/measures_detailed?select=${fields.join(',')}${from_liquid_query}${from_leg_body_query}${status_query}${type_query}${updated_query}${introduced_query}${legCheck}${fts}&published=is.true&order=${lastAction}.desc.nullslast&limit=40`
  console.log(api_url)


  return api(api_url, { storage }).then((measures) => dispatch({
    type: 'receivedMeasures',
    measures: measures.reduce((b, a) => Object.assign(b, { [a.short_id]: a }), {}),
    measuresList: measures.map(({ short_id }) => short_id),
  }))
  .catch(error => {
    console.log(error)
    dispatch({ type: 'error', error })
  })
  .then(() => dispatch({ type: 'loaded' }))
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
  return [`<a style="white-space: inherit; height: auto;" class="${voteBtnClass}" href="${`/legislation/${s.short_id}`}">
    <span class="icon" style="align-self: flex-start;"><i class="${voteBtnIcon}"></i></span>
    <span class="has-text-weight-semibold">${voteBtnTxt}</span>
  </a>`]
}

const proposeButton = () =>
  [`
    <a class="button is-primary" href="/legislation/propose">
      <span class="icon"><i class="fa fa-file"></i></span>
      <span class="has-text-weight-semibold">Propose Legislation</span>
    </a>
  `]

const toggleShowFilters = () => {
  document.querySelector('[name="show_filters"]').click()
}

const filterButton = ({ location, storage }) => {
  const showFilters = location.query.show_filters || storage.get('show_filters')

  return html()`
    <button onclick="${toggleShowFilters}" class="button is-link is-outlined">
      <span class="has-text-weight-semibold">${showFilters ? 'Hide Filters' : 'Show Filters'}</span>
    </button>
  `
}

const summaryTooltipButton = (id, short_id, summary) => [`
  <a href="${`/legislation/${short_id}`}" class="is-hidden-mobile">
    <br />
    <br />
    <span class="icon summary-tooltip">
      <i class="fa fa-lg fa-info-circle has-text-grey-lighter"></i>
      <div class="summary-tooltip-content">${summary}</div>
      <div class="summary-tooltip-arrow"></div>
    </span>
  </a>
`]

const noBillsMsg = (from_leg_body) => html()`
<div>
${from_leg_body === 'on' ? [`
  <p class="is-size-5">Liquid doesn't have this location's imported bill list yet, please change your selected criteria to view legislative items.

  </p>
`] : [`
  <a href="/legislation/propose" class="button is-primary has-text-weight-semibold">
    <span class="icon"><i class="fa fa-file"></i></span>
    <span>Add the first policy proposal</span>
  </a>
`]}
</div>
`
