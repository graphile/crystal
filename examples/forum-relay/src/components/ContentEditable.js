import React from 'react'
import escapeHtml from 'escape-html'

class ContentEditable extends React.Component {
  static propTypes = {
    tagName: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    text: React.PropTypes.string,
    editable: React.PropTypes.bool,
  }

  static defaultProps = {
    editable: false,
    tagName: 'div',
  }

  constructor(props) {
    super(props)
    this.state = {
      initialText: props.text,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editable && !this.props.editable) {
      this.setState({
        initialText: nextProps.text
      })
    }
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.editable && this.props.editable) {
      this.getDOMNode().innerHTML = escapeTextForBrowser(this.state.initialText)
    }
  }

  render() {
    const {
      onChange,
      editable,
      tagName,
      text,
      ...rest,
    } = this.props

    const html = escapeHtml(this.props.editable ? this.state.initialText : text)

    return React.createElement(tagName, {
      ...rest,
      onBlur: this.handleChange,
      contentEditable: editable,
      dangerouslySetInnerHTML: {__html: html},
    })
  }

  handleChange = (event) => {
    if (!event.target.textContent.trim().length) {
      event.target.innerHTML = ''
    }
    this.props.onChange(event)
  }
}

export default ContentEditable
