import React from 'react'
import cn from 'classnames'
import styles from './TokenSetter.css'

class TokenSetter extends React.Component {
  state = {
    tokenInput: '',
    showInput: false,
  }

  render() {
    return (
      <div className={styles.root}>
        <span className={styles.label}>JWT: </span>
        {this.state.showInput
          ? this.renderInput()
          : this.renderToken()
        }
      </div>
    )
  }

  renderToken() {
    const { token } = this.props
    return (
      <div className={styles.root}>
        <span onClick={this.toggleInput} className={styles.token}>{token ? token : 'Click to set token.'}</span>
        {token ? (
          <div>
            <button className={styles.button} onClick={this.clearToken}>Clear</button>
          </div>
        ) : (
          <div>
            <button className={styles.button} onClick={this.toggleInput}>Set</button>
          </div>
        )}
      </div>
    )
  }

  renderInput() {
    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <input
          autoFocus
          placeholder="Press enter to submit"
          className={cn(styles.input, 'animated', 'fadeIn')}
          value={this.state.tokenInput}
          onChange={this.onInputChange}
          onBlur={this.toggleInput}
        />
      </form>
    )
  }

  toggleInput = () => {
    const show = !this.state.showInput
    this.setState({ showInput: show })
  }

  clearToken = () => {
    this.setState({ tokenInput: '' })
    this.props.setToken(null)
  }

  onInputChange = event => {
    this.setState({ tokenInput: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.setToken(this.state.tokenInput)
    this.setState({ showInput: false })
  }
}

export default TokenSetter
