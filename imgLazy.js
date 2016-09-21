let source, options, viewport, images, count, isRetina, destroyed

let validateT, saveViewportOffsetT

class Blazy {
  constructor(settings) {
    // IE7-兼容
    if (!document.querySelectorAll) {
      const s = document.createStyleSheet()
      document.querySelectorAll = (r, c, i, j, a) => {
        a = document.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(',')
        for (i = r.length; i--;) {
          s.addRule(r[i], 'k:v')
          for (j = a.length; j--;) {
            a[j].currentStyle.k && c.push(a[j])
          }
          s.removeRule(0)
        }
        return c
      }
    }

    destroyed = true
    images = []
    viewport = {}

    options = settings || {}
    options.error = options.error || false
    options.offset = options.offset || 100
    options.success = options.success || false
    options.selector = options.selector || '.imglazy'
    options.separator = options.separator || '|'
    options.container = options.container ? document.querySelectorAll(options.container) : false
    options.errorClass = options.errorClass || 'b-error'
    options.breakpoints = options.breakpoints || false
    options.successClass = options.successClass || 'b-loaded'
    options.src = source = options.src || 'data-src'
    isRetina = window.devicePixelRatio > 1
    viewport.top = 0 - options.offset
    viewport.left = 0 - options.offset

    validateT = throttle(validate, 25)
    saveViewportOffsetT = throttle(saveViewportOffset, 50)

    saveViewportOffset()

    each(options.breakpoints, object => {
      if (object.width >= window.screen.width) {
        source = object.src
        return false
      }
    })

    initialize()
  }

  revalidate() {
    initialize()
  }

  load(element, force) {
    if (!isElementLoaded(element)) loadImage(element, force)
  }

  destroy() {
    if (options.container) {
      each(options.container, object => {
        unbindEvent(object, 'scroll', validateT)
      })
    }
    unbindEvent(window, 'scroll', validateT)
    unbindEvent(window, 'resize', validateT)
    unbindEvent(window, 'resize', saveViewportOffsetT)
    count = 0
    images.length = 0
    destroyed = true
  }
}

function initialize() {
  // First we create an array of images to lazy load
  createImageArray(options.selector)
  // Then we bind resize and scroll events if not already binded
  if (destroyed) {
    destroyed = false
    if (options.container) {
      each(options.container, object => {
        bindEvent(object, 'scroll', validateT)
      })
    }
    bindEvent(window, 'resize', saveViewportOffsetT)
    bindEvent(window, 'resize', validateT)
    bindEvent(window, 'scroll', validateT)
  }
  // And finally, we start to lazy load. Should bLazy ensure domready?
  validate()
}

function validate() {
  for (let i = 0; i < count; i++) {
    const image = images[i]
    if (elementInView(image) || isElementLoaded(image)) {
      Blazy.prototype.load(image)
      images.splice(i, 1)
      count--
      i--
    }
  }
  if (count === 0) {
    Blazy.prototype.destroy()
  }
}

function loadImage(ele, force) {
  // if element is visible
  if (force || (ele.offsetWidth > 0 && ele.offsetHeight > 0)) {
    const dataSrc = ele.getAttribute(source) || ele.getAttribute(options.src)
    if (dataSrc) {
      const dataSrcSplitted = dataSrc.split(options.separator)
      const src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0]
      const img = new Image()
      // cleanup markup, remove data source attributes
      each(options.breakpoints, object => {
        ele.removeAttribute(object.src)
      })
      ele.removeAttribute(options.src)
      img.onerror = () => {
        if (options.error) options.error(ele, 'invalid')
        ele.className = `${ele.className} ${options.errorClass}`
      }
      img.onload = () => {

        (ele.nodeName.toLowerCase() === 'img' ? ele.src = src : ele.style.backgroundImage = `url("${src}")`)
        ele.className = `${ele.className} ${options.successClass}`
        if (options.success) options.success(ele)
      }

      img.src = src // preload image
    } else {
      if (options.error) options.error(ele, 'missing')
      ele.className = `${ele.className} ${options.errorClass}`
    }
  }
}

function elementInView(ele) {
  const rect = ele.getBoundingClientRect()

  return (
    // Intersection
    rect.right >= viewport.left && rect.bottom >= viewport.top && rect.left <= viewport.right && rect.top <= viewport.bottom
  )
}

function isElementLoaded(ele) {
  return (` ${ele.className} `).indexOf(` ${options.successClass} `) !== -1
}

function createImageArray(selector) {
  const nodelist = document.querySelectorAll(selector)
  count = nodelist.length
  // converting nodelist to array
  for (let i = count; i--; images.unshift(nodelist[i])) { }
}

function saveViewportOffset() {
  viewport.bottom = (window.innerHeight || document.documentElement.clientHeight) + options.offset
  viewport.right = (window.innerWidth || document.documentElement.clientWidth) + options.offset
}

function bindEvent(ele, type, fn) {
  if (ele.attachEvent) {
    ele.attachEvent && ele.attachEvent(`on${type}`, fn)
  } else {
    ele.addEventListener(type, fn, false)
  }
}

function unbindEvent(ele, type, fn) {
  if (ele.detachEvent) {
    ele.detachEvent && ele.detachEvent(`on${type}`, fn)
  } else {
    ele.removeEventListener(type, fn, false)
  }
}

function each(object, fn) {
  if (object && fn) {
    const l = object.length
    for (let i = 0; i < l && fn(object[i], i) !== false; i++) { }
  }
}

function throttle(fn, minDelay) {
  let lastCall = 0
  return function () {
    const now = +new Date()
    if (now - lastCall < minDelay) {
      return
    }
    lastCall = now
    fn.apply(images, arguments)
  }
}
