import React from 'react'
import { Link } from 'gatsby'
import axios from 'axios'

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  state = {
    loading: false,
  }

  onFormSubmit(e) {
    e.preventDefault()
    this.setState({ loading: true })
    const address = this.refs.address.value + ' MA ' + this.refs.zip.value

    return axios
      .post(process.env.GATSBY_SERVERLESS_ENDPOINT, {
        address,
      })
      .then(function(response) {
        // redirect to senator page
      })
      .catch(function(error) {
        console.error(error)
      })
  }

  componentDidMount() {
    this.refs.address.focus()
  }

  render() {
    return (
      <form
        className="search-form my-5 my-md-0 white-background"
        onSubmit={this.onFormSubmit}
      >
        <div className="form-group">
          <label>
            Address
            <input
              type="text"
              className="form-control"
              ref="address"
              placeholder="123 Main St, Cambridge"
              name="address"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Zip Code
            <input
              type="text"
              className="form-control"
              ref="zip"
              placeholder="02142"
              name="zipCode"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            State
            <input
              type="text"
              className="form-control"
              readOnly
              value="Massachusetts"
            />
          </label>
        </div>

        <div className="mt-4">
          <button
            className="btn btn-primary btn-block heading-font"
            type="submit"
          >
            {this.state.loading ? (
              <span>
                <span aria-hidden="true" className="fa fa-spinner fa-pulse" />
                &nbsp;Loading
              </span>
            ) : (
              'Find My Local Legislators'
            )}
          </button>
        </div>
        <Link to="/all-legislators" className="mt-3 d-block">
          I already know who my reps are ⇨
        </Link>
      </form>
    )
  }
}

export default SearchForm
