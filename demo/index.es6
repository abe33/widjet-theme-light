import widgets from 'widjet'
import {parent, getNode, asArray, detachNode} from 'widjet-utils'

import 'widjet-validation'
import 'widjet-select-multiple'
import {Markdown} from 'widjet-text-editor'

widgets('select-multiple', 'select[multiple]', {on: 'load'})
widgets('text-editor', '.markdown-editor', {
  on: 'load',
  unorderedList: Markdown.unorderedList,
  orderedList: Markdown.orderedList,
  repeatOrderedList: Markdown.repeatOrderedList
})
widgets('live-validation', '[required]', {
  on: 'load',
  onSuccess: (input) => {
    const field = parent(input, '.field')
    field.classList.add('has-success')

    const label = field.querySelector('label')
    label.insertBefore(getNode('<i class="icon-tick feedback-icon"></i>'), label.firstChild)
  },
  onError: (input, res) => {
    const field = parent(input, '.field')
    field.classList.add('has-error')

    const label = field.querySelector('label')
    label.insertBefore(getNode('<i class="icon-cross feedback-icon"></i>'), label.firstChild)
    label.appendChild(getNode(`<div class='text-red'>${res}</div>`))
  },
  clean: (input) => {
    const field = parent(input, '.field')
    field.classList.remove('has-success')
    field.classList.remove('has-error')

    const feedbackNodes = field.querySelectorAll('.feedback-icon, .text-red')

    asArray(feedbackNodes).forEach((node) => detachNode(node))
  }
})
