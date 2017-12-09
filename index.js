var LightBox = require('hyperlightbox')
var h = require('hyperscript')
var fs = require('fs')
var path = require('path')
exports.gives = {
  confirm: { show: true, action: true }
}

exports.needs = {
  identity: { publish: 'first' },
  confirm: { action: 'map' },
  message: { render: 'first' }
}

exports.create = function (api) {
  var lb = LightBox()
  document.head.appendChild(
    h('style', {textContent: fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')})
  )
  return {
    confirm: {
      //empty action so don't get needs error
      action: function () {},
      show: function (content, context, cb) {
        lb.show(h('div.patchconfirm-lightbox.patchconfirm',
          h('div.patchconfirm__actions', api.confirm.action(content, context)),
          h('div.confirm__message', api.message.render({content: content}, context)),
          h('div.patchconfirm__buttons',
            h('button', 'cancel', {onclick: function () {
              lb.close()
              cb(new Error('cancelled'))
            }}),
            h('button', 'okay', {onclick: function () {
              lb.close()
              console.log("CLOSE", content)
              api.identity.publish(content, context && context.id, cb)
            }})
          )
        ))
        lb.style.display = 'flex'
        document.body.appendChild(lb)

      }
    }
  }
}







