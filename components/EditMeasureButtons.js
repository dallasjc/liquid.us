const Component = require('./Component')

module.exports = class EditMeasureButtons extends Component {
  render() {
    return this.html`
      <div class="buttons has-addons is-right">
        ${EditButton.for(this, this.props)}
        ${PublishButton.for(this, this.props)}
      </div>
    `
  }
}

class EditButton extends Component {
  render() {
    const { user } = this.state
    const { short_id } = this.props
    return this.html`
      <a href="${`/${user.username}/legislation/${short_id}/edit`}" class="button is-small">
        <span class="icon is-small"><i class="fa fa-pencil-alt"></i></span><span>Edit</span>
      </a>
    `
  }
}

class PublishButton extends Component {
  publish() {
    const { short_id, id } = this.props

    this.setState({ loading: true })

    return this.api(`/measures?id=eq.${id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ published: true })
    })
    .then(() => {
      const { yourLegislation = [], measures = {} } = this.state
      const measure = measures[short_id]
      this.setState({
        loading: false,
        yourLegislation: yourLegislation.map((old) => (old.id === id ? { ...old, published: true } : old)),
        measures: {
          ...measures,
          [short_id]: {
            ...measure,
            published: true,
          },
        },
      })
    })
    .catch((error) => {
      console.error(error)
      this.setState({ error: 'There was a problem published your legislation. Please contact support.', loading: false })
    })
  }
  onclick(event) {
    event.preventDefault()

    const msg = `
      Are you sure you want to publish?
      Once your legislation is published, you will no longer be able to edit it.
    `
    if (!this.state.loading && window.confirm(msg)) this.publish()
  }
  render() {
    const { loading } = this.state
    return this.html`
      <a href="/legislation/yours" onclick="${this}" class="${`button is-small is-outlined ${loading ? 'is-loading' : ''}`}">
        <span class="icon"><i class="fa fa-check"></i></span>
        <span>Publish</span>
      </a>
    `
  }
}
