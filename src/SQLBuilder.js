const placeholderRE = /\$(\d*)/g

class SQLBuilder {
  _placeholder = 1

  text = ''
  values = []

  add (text, values) {
    if (typeof text === 'object') {
      values = text.values
      text = text.text
    }

    if (values == null) values = []

    // Add our values.
    this._addValues(values)

    // For every placeholder in the SQL string…
    this._addText(text.replace(placeholderRE, () => {
      // Use a placeholder relative to our SQL builder.
      const placeholder = `$${this._placeholder}`
      // And increment our placeholder position.
      this._placeholder += 1
      return placeholder
    }))

    return this
  }

  _addText (text) {
    // If there is no text, just add the text straight up.
    if (this.text.length === 0)
      this.text += text
    // If the last text character is a space, add the text so we don’t get
    // double spaces.
    else if (this.text[this.text.length - 1] === ' ')
      this.text += text
    // Otherwise, add text with a space.
    else
      this.text += ` ${text}`
  }

  _addValues (values) {
    this.values = this.values.concat(values)
  }
}

export default SQLBuilder
