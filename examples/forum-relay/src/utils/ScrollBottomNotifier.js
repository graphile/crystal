import React, { PropTypes } from 'react'

function topPosition(domEl) {
  if (!domEl) {
    return 0;
  }
  return domEl.offsetTop + topPosition(domEl.offsetParent);
}

class ScrollBottomNotifier extends React.Component {
  static propTypes = {
    buffer: PropTypes.number.isRequired,
    onScrollBottom: PropTypes.func,
  }

  static defaultProps = {
    buffer: 200,
  }

  handleScroll = (event) => {
    const { atBottom } = this.getScrollInfo()
    if (atBottom && this.props.onScrollBottom)
      this.props.onScrollBottom()
  }

  getScrollInfo() {
    const offsetAndHeight = topPosition(this.container) + this.container.clientHeight
    const viewportHeight = window.innerHeight
    const currentScrollPosition = document.body.scrollTop || document.documentElement.scrollTop
    const noBottom = offsetAndHeight <= viewportHeight
    const atBottom = currentScrollPosition + viewportHeight >= offsetAndHeight - this.props.buffer

    return {
      noBottom,
      atBottom,
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    const { noBottom } = this.getScrollInfo()
    if (noBottom && this.props.onScrollBottom)
      this.props.onScrollBottom()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    const style = { ...this.props.style, overflow: 'auto' }
    console.log('render')

    return <div
      ref={(ref) => this.container = ref}
      style={style}
      onScroll={this.handleScroll}
    >
      {this.props.children}
    </div>
  }
}

export default ScrollBottomNotifier
