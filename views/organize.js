const { WWW_DOMAIN } = process.env
const { html } = require('../helpers')
const video = require('./video')
const sidebar = require('./organize-page-sidebar')

module.exports = (state, dispatch) => {
  const { cookies, showMobileOrganizeForm, user } = state
console.log(state)
  return html`
  <div class="columns">
    <div class="column">
      <section class="hero is-bold">
        <div class="hero-body">
          <div class="container">
            <center><h2 class="title is-2 is-size-2-desktop is-size-3"><strong>Partisanship, lies and corruption have overrun our political system</strong></h2></center>
            <div class="is-size-4">
              <p><b>Liquid democracy offers a path forward.</b>
              Build a network of personal representatives - anyone you want - on an issue-by-issue basis. Represent others by voting on bills directly or allow your reps to vote on your behalf.<br style="line-height:3rem;" />
              Voters can use liquid democracy to have a louder and growing voice in the legislative process.<br style="line-height:3rem;" />
              <b>Have a popular reform that's not getting traction?</b> Use Liquid US to build support district-by-district and pressure your elected officials.<br style="line-height:3rem;" />
              <b>Tired of unaccountable politicians loyal to party and donors over voters?</b> Elect candidates pledged to use a liquid-powered platform to determine how constituents want them to vote on bills.<br style="line-height:3rem;" />
              Get involved to help build a better democracy.</p><br />
            </div>
          </div>
        </div>
      </section>
      <section class="hero is-light is-bold">
        <div class="hero-body">
          <div class="container">
            <br />
            <h2 class="title is-2 is-size-2-desktop is-size-3-mobile reveal"><strong>Liquid Democracy enables choice & accountability</strong></h2>
            <div class="columns is-vcentered">
              <div class="column is-2"></div>
              <div class="column">
                <h3 class="subtitle is-4 is-size-4-desktop reveal"><strong>Participate anywhere</strong> any time from any device. It's silly to wait years to exercise our right to vote. Let's unlock the true power of the devices in our pockets for the public good.</h3>
              </div>
              <div class="column is-1"></div>
              <div class="column has-text-centered">
                <img src="/assets/anywherecolor1.png" width="60%">
              </div>
              <div class="column is-2"></div>
            </div>
            <div class="columns is-vcentered">
              <div class="column is-1"></div>
              <div class="column has-text-left-tablet is-hidden-desktop is-hidden-tablet">
                <h4 class="subtitle is-4 is-size-4-desktop reveal"><strong>Delegate your vote</strong> to people you trust. They can then delegate to whomever they choose. This trust network enables us to make optimal decisions that represent everyone.</h4>
              </div>
              <div class="column has-text-centered">
                <img src="/assets/delegatecolor2.png" width="60%">
              </div>
              <div class="column is-1"></div>
              <div class="column has-text-left-tablet is-hidden-mobile">
                <h4 class="subtitle is-4 is-size-4-desktop reveal"><strong>Delegate your vote</strong> to people you trust. They can then delegate to whomever they choose. This trust network enables us to make optimal decisions that represent everyone.</h4>
              </div>
              <div class="column is-1"></div>
            </div>
            <div class="columns is-vcentered">
              <div class="column is-2"></div>
              <div class="column has-text-left-tablet">
                <h3 class="subtitle is-4 is-size-4-desktop reveal"><strong>Make your vote count</strong> on issues where you have expertise. Unlike today's winner-takes-all-system, you don't have to win an election to represent others..</h3>
              </div>
              <div class="column is-1"></div>
              <div class="column  has-text-centered">
                <img src="/assets/votecount2.png" width="60%">
              </div>
              <div class="column is-2"></div>
            </div>
            <div class="columns is-vcentered">
              <div class="column is-2"></div>
              <div class="column has-text-left-tablet is-hidden-desktop is-hidden-tablet">
                <h4 class="subtitle is-4 is-size-4-desktop reveal"><strong>Hold elected leaders accountable.</strong> Liquid automatically compares what the people want with how elected leaders vote.</h4>
              </div>
              <div class="column has-text-centered">
                <img src="/assets/accountability3.png" width="60%">
              </div>
              <div class="column is-1"></div>
              <div class="column has-text-left-tablet is-hidden-mobile">
                <h4 class="subtitle is-4 is-size-4-desktop reveal"><strong>Hold elected leaders accountable.</strong> Liquid automatically compares what the people want with how elected leaders vote.</h4>
              </div>
              <div class="column is-2">
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="hero is-light is-bold">
        <div class="hero-body">
          <div class="container">
            <h2 class="title is-3 is-size-2-desktop is-size-3-mobile has-text-centered reveal">Upgrade your democracy</h2>
            <div class="columns has-text-centered">
              <div class="column">
                <h2 class="title is-4 has-text-centered">Educate your community about liquid</h2>
                <img src="/assets/educate.png" width="40%">
              </div>
              <div class="column">
                <h2 class="title is-4 has-text-centered">Build participation</h2>
                <img src="/assets/community.png" width="40%">
              </div>
              <div class="column">
                <h2 class="title is-4 has-text-centered">Hold politicians accountable</h2>
                <div class="is-vcentered"><img src="/assets/fundraisecolor1.png" width="40%"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="hero is-link is-bold">
        <div class="hero-body">
          <div class="container">
            <br /><h2 class="title is-2 is-size-2-desktop is-size-3-mobile reveal">Why we're doing this</h2>
            <h4 class="subtitle is-4 is-size-3-desktop reveal">We believe in the transformative promise of Liquid Democracy.
            The idea is so powerful that we're fully funded and have attracted some of the world's foremost political organizing and technology talent.
            We are non-partisan and charge nothing. We just want a healthier Democracy.</h4>
          </div>
        </div>
      </section>
    </div>
    <div class="column hero-body is-one-quarter sticky-panel">
      <div class="panel-wrapper">
        ${sidebar({ ...state }, dispatch)}
      </div>
      <style>
        .small-screens-only {
          display: block;
        }
        @media (max-width: 1050px) {
          .sticky-panel.column {
            display: none;
          }
        }
        @media (min-width: 1050px) {
          .sticky-panel.column {
            display: block;
          }
          .sticky-panel .content {
            max-width: 253px;
          }
          .panel-wrapper {
            position: fixed;
            margin-left: 2rem;
            margin-right: 15px;
            z-index: 15;
          }
        .small-screens-only {
          display: none;
        }
      }
        @media (max-height: 575px) {
          /* Don't position:fixed the sidebar if window isn't tall enough */
          .panel-wrapper {
            position: relative;
            margin-right: 0;
            z-index: 1;
          }
        }
      </style>
    </div>
  </div>
  <div class="small-screens-only">
    ${showMobileOrganizeForm === true ? '' : mobileHoverBar({ cookies, user }, dispatch)}
  </div>
  <section class="hero is-medium">
    <div class="hero-body">
      <div class="container">
        <section class="section">
          <h2 class="title is-2 reveal">Learn More</h2>
        </section>
        <div class="columns">
          <div class="column">
            <section class="section space-out-multiline">
              <h4 class="title is-4 reveal">Introduction</h4>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2016/09/21/what-is-liquid-democracy/`}" target="_blank">What is Liquid Democracy?</a></p>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2017/07/04/running-liquid-democracy-candidates/`}" target="_blank">Liquid Democracy Candidates: How to Upgrade Our Legislature, One Seat at a Time</a></p>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2018/10/02/introducing-liquid-us/`}" target="_blank">Introducing Liquid US and Support for All 50 States and Local Legislatures</a></p>
            </section>
            <section class="section space-out-multiline">
              <h4 class="title is-4 reveal">Further Reading</h4>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2017/03/06/how-to-move-past-two-parties/`}" target="_blank">How to Move Past A Two Party System</a></p>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2017/10/23/democracy-vs-corruption/`}" target="_blank">Liquid Democracy is the Most Promising Way to Fix Money in Politics</a></p>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2017/04/17/liquid-democracy-and-a-free-political-economy/`}" target="_blank">Liquid Democracy and A Free Political Economy</a></p>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2017/05/12/liquid-democracy-can-completely-eliminate-gerrymandering/`}" target="_blank">Liquid Democracy Can Completely Eliminate Gerrymandering</a></p>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2017/10/27/liquid-democracy-is-not-direct-democracy/`}" target="_blank">Liquid Democracy Is Not Direct Democracy, and That's a Good Thing</a></p>
              <p class="reveal"><a href="${`https://blog.${WWW_DOMAIN}/2016/10/13/dont-care-about-politics/`}" target="_blank">Don't Care About Politics? Liquid Democracy Is Easier for You Too</a></p>
              <p class="reveal"><a href="${`http://secure.united.vote`}" target="_blank">Secure Internet Voting</a></p>
            </section>
            <style>
              .space-out-multiline p {
                margin-bottom: 7px;
              }
            </style>
          </div>
          <div class="column">
            ${video({ url: 'https://www.youtube.com/embed/GFh0aZ_u9FQ' })}
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="section has-text-centered">
    <p class="is-size-7 has-text-grey">Icon images by priyanka, KonKapp, Maxim Basinski, Delwar Hossain, Maxim Kulikov, flatart, jugalbandi, Turkkub, zidney, Max Hancock, adrien coquet, lastspark, Adiba Taj from The Noun Project.</p>
  </div>
  `
}

const mobileHoverBar = ({ user }, dispatch) => {
  let action = 'Get involved'; let color = 'is-success'
  if (user) { action = 'Share'; color = 'is-link' }

  return html`
    <div style="
      position: fixed;
      left: 0; bottom: 0;
      width: 100%;
      z-index: 18;
      background: white;
      border-top: 1px solid #ccc;
      padding: 10px 15px;
    ">
      <div class="field">
        <div class="control">
          <button class=${`button ${color} is-fullwidth fix-bulma-centered-text has-text-weight-bold is-size-5`} onclick=${(event) => dispatch({ type: 'contact:toggledMobileOrganizeForm', event })}>${action}</button>
        </div>
      </div>
    </div>
  `
}
