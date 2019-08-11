const { WWW_DOMAIN } = process.env
const { html } = require('../helpers')
const joinFormCandidate = require('./join-form-candidate')
const video = require('./video')

module.exports = (state, dispatch) => {
  return html`
  <section class="is-bold is-fullheight">
    <div>
      <div class="container">
        <br />
        <h2 class="title is-2 is-size-3-desktop is-size-3-mobile reveal"><strong>Join the fight for a healthier democracy</strong></h2>
        <div class="is-size-6"
        <p>Partisanship, lies, and corruption are commonplace in our political system. Worse, the methods we use to select our representatives make it difficult for us to do anything about it.</p><br />
        <p><b><center>Liquid democracy offers a path forward.</center></b></p>
        <p>Add anyone to your network of personal representatives on an issue-by-issue basis. When a bill comes up for a vote, you can vote directly and represent others, or allow the proxies you already picked to vote on your behalf.</p><br />
        <p>Our platform uses liquid democracy to help voters have a louder voice in the legislative process.</p><br />
        <p>Have a popular reform that's not getting traction? Use Liquid US to demonstrate community support and build public pressure on your legislators.</p><br />
        <p>Tired of unaccountable politicians with more loyalty to party than country? Upgrade your democracy by electing candidates who pledge to use Liquid US (or a similar platform) to determine how to vote on every bill, ensuring that the voters always have the final say.</p><br />
        <p>We're ready to fight for a better democracy - are you?</p><br />
      </div>
    </div>
  </section>
  <section class="hero is-light is-bold is-fullheight">
    <div class="hero-body">
      <div class="container">
        <br />
        <h2 class="title is-2 is-size-2-desktop is-size-3-mobile reveal"><strong>Liquid Democracy enables choice & accountability</strong></h2>
        <br />
        <br />
        <br />
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
        <br />
        <br />
        <br />
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
        <br />
        <br />
        <br />
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
        <br />
        <br />
        <br />
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
    <section class="hero is-light is-bold is-fullheight">
      <div class="hero-body">
        <div class="container">
          <h2 class="title is-3 is-size-2-desktop is-size-3-mobile has-text-centered reveal">Upgrade your democracy</h2>
          <br />
          <br />
          <br />
          <div class="columns has-text-centered">
            <div class="column">
              <h2 class="title is-4 has-text-centered">Educate your community about liquid</h2>
              <img src="/assets/educate.png" width="40%">
              <br /><br />
            </div>
            <div class="column">
              <h2 class="title is-4 has-text-centered">Build participation</h2>
              <img src="/assets/community.png" width="40%">
              <br /><br />
            </div>
            <div class="column">
              <h2 class="title is-4 has-text-centered">Hold politicians accountable</h2>
              <div class="is-vcentered"><img src="/assets/fundraisecolor1.png" width="40%"></div>
              <br /><br />
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </section>

    <section class="hero is-link is-bold is-fullheight">
      <div class="hero-body">
        <div class="container">
          <h2 class="title is-2 is-size-2-desktop is-size-3-mobile reveal">Why we're doing this</h2>
          <br /><br />
          <h4 class="subtitle is-4 is-size-3-desktop reveal">We believe in the transformative promise of Liquid Democracy.
          <br /><br />
          The idea is so powerful that we're fully funded and have attracted some of the world's foremost political organizing and technology talent.
          <br /><br />
          We are non-partisan and charge nothing. We just want a healthier Democracy.</h4>
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </section>

    <div class="columns">>
      <div class="column"></div>
        <div class="column is-5">
          <br /><br />
          ${policyIdeaCTA(state, dispatch)}
        </div>
      <div class="column"></div>
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


const policyIdeaCTA = (state, dispatch) => {
  return html`
    <section class="hero">
        ${joinFormCandidate(state, dispatch)}
    </section>
    <br />
    <section class="hero is-medium no-vertical-padding">
      <p class="subtitle is-5 has-text-centered">Or ask a question: <strong>
      <a onclick=${(event) => dispatch({ type: 'contactForm:toggled', event })}>click here</a></strong> to send us a message.</p>
    </section>
    <style>
      .hero.is-medium.no-vertical-padding .hero-body {
        padding-top: 0;
        padding-bottom: 0;
      }
    </style>
  `
}
