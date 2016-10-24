import React from 'react'
import cn from 'classnames'
import styles from './TokenSetter.css'

class TokenSetter extends React.Component {
  static propTypes = {
    token: React.PropTypes.string,
    setToken: React.PropTypes.func.isRequired,
  }

  state = {
    showInput: false,
    tokenInputValue: '',
  }

  render() {
    return (
      <div className={styles.root}>
        <span className={styles.label}>JWT: </span>
        {this.state.showInput
          ? <Input
              tokenInputValue={this.state.tokenInputValue}
              onInputChange={this.onInputChange}
              handleSubmit={this.handleSubmit}
              toggleInput={this.toggleInput}
            />
          : <Token
              token={this.props.token}
              clearToken={this.clearToken}
              toggleInput={this.toggleInput}
            />
        }
      </div>
    )
  }

  toggleInput = () => {
    const show = !this.state.showInput
    this.setState({ showInput: show })
  }

  clearToken = () => {
    this.setState({ tokenInputValue: '' })
    this.props.setToken(null)
  }

  onInputChange = event => {
    this.setState({ tokenInputValue: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.setToken(this.state.tokenInputValue)
    this.setState({ showInput: false })
  }
}

const Token = ({
  token,
  toggleInput,
  clearToken,
}) => (
  <div className={styles.root}>
    <span
      id="token"
      onClick={toggleInput}
      className={styles.token}>
      {token ? token : 'Click to set token.'}
    </span>
    <button
      className={styles.button}
      onClick={token ? clearToken : toggleInput}>
      {token ? 'Clear' : 'Set'}
    </button>
  </div>
)

const Input = ({
  handleSubmit,
  onInputChange,
  toggleInput,
  tokenInputValue,
}) => (
  <form
    className={styles.form}
    onSubmit={handleSubmit}>
    <input
      autoFocus
      placeholder="Press enter to submit"
      className={cn(styles.input, 'animated', 'fadeIn')}
      value={tokenInputValue}
      onChange={onInputChange}
      onBlur={toggleInput}
    />
  </form>
)

export default TokenSetter
