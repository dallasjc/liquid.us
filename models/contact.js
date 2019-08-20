const { NODE_ENV } = process.env
const { preventDefault, combineEffectsInSeries, makePoint } = require('../helpers')
const fetch = require('isomorphic-fetch')
const { signIn } = require('../effects/session')
const { validateNameAndAddressForm, updateNameAndAddress } = require('./vote')


module.exports = (event, state) => {
  switch (event.type) {
    case 'contact:toggledMobileOrganizeForm':
      return [{
        ...state,
        showMobileOrganizeForm: !state.showMobileOrganizeForm
      }, preventDefault(event.event)]
    case 'contact:organizeSignUpForm':
      return [{
        ...state,
        loading: { ...state.loading, signupFromOrganizeForm: true },
      }, combineEffectsInSeries([
        preventDefault(event.event),
        signupAndGetInvolved(event, state.location),
      ])]
    case 'contactForm:toggled':
      return [{
        ...state,
        contactForm: {
          submitted: false,
          open: !state.contactForm.open,
        },
      }, preventDefault(event.event)]
    case 'contactForm:messageSent':
      return [{
        ...state,
        contactForm: { ...state.contactForm, submitted: true },
      }, sendMessage({ ...event, user: state.user })]
    case 'contactForm:submitCandidatePage':
      return [{
        ...state,
        contactForm: { ...state.contactForm, submitted: true },
      }, sendMessage({ ...event, user: state.user })]
    default:
      return [state]
  }
}

const sendMessage = ({ email, message, url, user, event }) => () => {
  if (event) event.preventDefault()

  if (message) {
    if (!user) user = { email }

    if (NODE_ENV === 'production') {
      fetch('https://blog-api.liquid.us/feedback', {
        body: JSON.stringify({
          text: message,
          user,
          url,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    } else {
      console.log('skipping sending of contact email', message, user, url)
    }
  }
}
const signupAndGetInvolved = ({ vote, ...form }, location) => (dispatch) => {
  const { address, email, voter_status } = form
  const error = validateNameAndAddressForm(address, form.name)

  if (error) return dispatch({ type: 'error', error })

  const name_pieces = form.name.split(' ')
  const first_name = name_pieces[0]
  const last_name = name_pieces.slice(1).join(' ')

  return signIn({
    channel: 'endorsement',
    email,
    device_desc: location.userAgent || 'Unknown',
    phone_number: null,
    redirect_to: location.path,
  })(dispatch).then((user) => {
    if (user) {
      return updateNameAndAddress({
        addressData: {
          address,
          locality: window.lastSelectedGooglePlacesAddress.locality,
          administrative_area_level_1: window.lastSelectedGooglePlacesAddress.administrative_area_level_1,
          administrative_area_level_2: window.lastSelectedGooglePlacesAddress.administrative_area_level_2,
          postal_code: window.lastSelectedGooglePlacesAddress.postal_code,
          country: window.lastSelectedGooglePlacesAddress.country,
          geocoords: makePoint(window.lastSelectedGooglePlacesAddress.lon, window.lastSelectedGooglePlacesAddress.lat),
        },
        nameData: { first_name, last_name, voter_status },
        user,
      })(dispatch)
    }
  })
}
