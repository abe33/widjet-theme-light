import widgets from 'widjet'
import {CompositeDisposable, DisposableEvent} from 'widjet-disposables'
import {parent, getNode, asArray, detachNode} from 'widjet-utils'

import 'widjet-validation'
import 'widjet-select-multiple'
import {getTextPreview} from 'widjet-file-upload'
import {Markdown} from 'widjet-text-editor'

widgets.define('propagate-focus', (options) => (el) =>
  new CompositeDisposable([
    new DisposableEvent(el, 'focus', () =>
      parent(el, '.field').classList.add('has-focus')
    ),
    new DisposableEvent(el, 'blur', () =>
      parent(el, '.field').classList.remove('has-focus')
    )
  ])
)

const checkboxCollectionPredicate = i =>
  i.nodeName === 'INPUT' &&
  i.type === 'checkbox' &&
  i.parentNode.classList.contains('btn-group')

const radioCollectionPredicate = i =>
  i.nodeName === 'INPUT' &&
  i.type === 'radio' &&
  i.parentNode.classList.contains('btn-group')

widgets('select-multiple', 'select[multiple]', {on: 'load'})
widgets('file-upload', 'input[type="file"]', {
  on: 'load',
  previewers: [[o => o.file.type === 'text/plain', getTextPreview]]
})
widgets('text-editor', '.markdown-editor', {
  on: 'load',
  blockquote: Markdown.blockquote,
  codeBlock: Markdown.codeBlock,
  unorderedList: Markdown.unorderedList,
  orderedList: Markdown.orderedList,
  repeatOrderedList: Markdown.repeatOrderedList
})
widgets('form-validation', 'form', {on: 'load'})
widgets('live-validation', '[required]', {
  on: 'load',
  resolvers: [
    [
      checkboxCollectionPredicate,
      input => {
        const container = input.parentNode
        const checked = asArray(container.querySelectorAll('input:checked'))
        return checked.map(i => i.value)
      }
    ], [
      radioCollectionPredicate,
      input => {
        const checked = input.parentNode.querySelector('input:checked')
        return checked ? checked.value : undefined
      }
    ]
  ],
  validators: [
    [
      checkboxCollectionPredicate,
      (i18n, value) => value && value.length > 0 ? null : i18n('blank_value')
    ], [
      radioCollectionPredicate,
      (i18n, value) => value ? null : i18n('blank_value')
    ]
  ],
  onSuccess: (input) => {
    const field = parent(input, '.field')
    field.classList.add('has-success')

    const label = field.querySelector('label')
    label.insertBefore(getNode('<i class="fa fa-check feedback-icon"></i>'), label.firstChild)
  },
  onError: (input, res) => {
    const field = parent(input, '.field')
    field.classList.add('has-error')

    const label = field.querySelector('label')
    label.insertBefore(getNode('<i class="fa fa-times feedback-icon"></i>'), label.firstChild)
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
widgets('propagate-focus', 'input, select, textarea', {on: 'load'})
