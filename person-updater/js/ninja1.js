((window) => {
  // Speed up calls to hasOwnProperty
  let hasOwnProperty = Object.prototype.hasOwnProperty;

  function isEmpty(obj) {

      // null and undefined are "empty"
      if (obj == null) return true;

      // Assume if it has a length property with a non-zero value
      // that that property is correct.
      if (obj.length > 0)    return false;
      if (obj.length === 0)  return true;

      // If it isn't an object at this point
      // it is empty, but it can't be anything *but* empty
      // Is it empty?  Depends on your application.
      if (typeof obj !== "object") return true;

      // Otherwise, does it have any properties of its own?
      // Note that this doesn't handle
      // toString and valueOf enumeration bugs in IE < 9
      for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) return false;
      }

      return true;
  }

  let Ninja = {
    init: selector => {
      this.selector = selector
      this.inventory = 0
      try {
        this.element =
          this.selector.nodeType == 1 ?
            this.selector :
            typeof this.selector == 'string' ?
              [].slice.call(document.querySelectorAll(this.selector)) :
              (function(){
                throw new TypeError('Unknown Select Type')
              }())
      } catch (e){
        // empty selection,
        // if the selector is an empty object and it is a dummy object
        // then just append this to the dom
        if (isEmpty(this.selector) && this.element.tagName == 'ninja') {
          console.log('EMPTY OBJECT', this.selector)
          console.log('Who am I?', this.element)
          let ninjas = document.querySelectorAll('ninja[_ninja]')
          let ninjaId
          if(ninjas.length <= 0) {
            ninjaId = 0
          } else {
            ninjaId = ninjas.length
          }

          this.element = document.createElement('ninja')
          this.element.setAttribute('_ninja', ninjaId)
        }

      }

      if (this.element.length <= 0) {
        throw new Error('No selector(s) found: ' + this.selector)
      } else if (this.element.length == 1) {
        this.inventory = 1
        this.element = this.element[0]
      } else {
        this.inventory = this.element.length
      }
    },
    on: (type, callback) => {
      let event = 'on' + type
      if (this.inventory > 1){
        for(let el of this.element) {
          el[event] = callback
        }
      } else {
        this.element[event] = callback
      }
    },
    /*
     * after: adds html after the selected element(s)
     */
    after: html => {
      if (this.inventory > 1){
        for(let el of this.element) {
          _insert(html, el)
        }
      } else {
        _insert(html, this.element)
      }

      /*
       * internal helper function the inserts html after
       * the selected element(s)
       */
      function _insert(html, node) {
        let range = document.createRange()
        let parentNode, nextNode, context
        parentNode = node.parentNode
        range.selectNode(parentNode)
        nextNode = node.nextSibling
        parentNode.insertBefore(
          range.createContextualFragment(html),
          nextNode
        )
      }
    },
    /*
     * after: adds html after the selected element(s)
     */
    before: html => {
      if (this.inventory > 1){
        for(let el of this.element) {
          _insert(html, el)
        }
      } else {
        _insert(html, this.element)
      }

      /*
       * internal helper function the inserts html after
       * the selected element(s)
       */
      function _insert(html, node) {
        let range = document.createRange()
        let parentNode, context
        parentNode = node.parentNode
        range.selectNode(parentNode)
        parentNode.insertBefore(
          range.createContextualFragment(html),
          node
        )
      }
    },

    /*
     * attr: get/set and attribute for this element
     */
    attr: (attr, value) => {
      let ret
      if (this.inventory > 1){
        ret = []
        for(let el of this.element) {
          ret.push(_attr(el, attr, value))
        }
      } else {
        ret = _attr(this.element, attr, value)
      }

      /*
       * internal helper function to get / set an attribute
       */
      function _attr(el, attr, value) {
        if (value && typeof value == 'string') {
          el.setAttribute(attr, value)
        }
        return el.getAttribute(attr)
      }

      return ret
    },

    /*
     * hasAttr: simple check to see if the element has an attribute
     */
    hasAttr: (attr) => {
      let ret
      if (this.inventory > 1){
        ret = []
        for (let el of this.element) {
          ret.push(el.hasAttribute(attr))
        }
      } else {
        ret = this.element.hasAttribute(attr)
      }
      return ret
    },

    /*
     * html: get / set the html for the element
     */
    html: html => {
      let ret
      if (this.inventory > 1) {
        ret = []
        for (let el of this.element) {
          ret.push(_html(el, html))
        }
      } else {
        ret = _html(this.element, html)
      }

      /*
       * internal helper function to return or set the element html
       */
      function _html(el, html) {
        // console.log('_html()')
        if (html && typeof string) {
          el.innerHTML = html
        }
        return el.innerHTML
      }

      return ret
    },

    /*
     * css(): get / set css styles on the element
     */
    css: css => {
       let ret
       if (this.inventory > 1) {
         ret = []
         for(let el of this.element) {
           if(css){
             ret.push(_css(el, css))
           } else {
             ret.push(el.style)
           }
         }
       } else {
         if(css){
           ret = _css(this.element, css)
         } else {
           ret = this.element.style
         }
       }

       /*
        * internal helper function to get/set css styling on an element
        */
        function _css(el, css) {
         let _style = ''
         if (typeof css == 'string') {
           _style = css
           el.style.cssText = _style
         } else if (typeof css == 'object') {
           for(let prop in css){
              el.style[prop] = css[prop]
           }
         } else {
           throw new Error('Invalid CSS value(s), must be a string or object.')
         }

         return el.style
       }

       return ret
     },


     /*
      * addClass(): function to add a class to an element if not already added
      */
     addClass: cls => {
       let ret
       if (this.inventory > 1) {
         ret = []
         for(let el of this.element) {
           if (!_hasClass(el, cls)) {
             el.classList.add(cls)
           }
         }
       } else {
         if (!_hasClass(this.element, cls)) {
           this.element.classList.add(cls)
         }
       }
       return ret
     },

     /*
      * removeClass(): function to add a class to an element if not already added
      */
     removeClass: cls => {
       let ret
       if (this.inventory > 1) {
         ret = []
         for (let el of this.element) {
           if (_hasClass(el, cls)) {
             el.classList.remove(cls)
           }
         }
       } else {
         if (_hasClass(this.element, cls)) {
           this.element.classList.remove(cls)
         }
       }
       return ret
     },

     /*
      * get: http.get to expects json data returned
      */
     get: (url, params, callback) => {
       let xhr = new XMLHttpRequest()
       xhr.onreadystatechange = returnXHR
       xhr.open('GET', url)
       xhr.send(params)

       function returnXHR () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            callback(JSON.parse(xhr.responseText))
          } else {
            throw new Error('There was a problem with the request!')
          }
        }
       }
     },

     /*
      * post: http.post to expects json data submited/returned
      */
     post: (url, data, callback) => {
       let xhr = new XMLHttpRequest()
       xhr.onreadystatechange = returnXHR
       xhr.open('POST', url)
       xhr.setRequestHeader('Content-Type', 'application/json')
       xhr.send(JSON.stringify(data))

       function returnXHR () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 201) {
             callback(JSON.parse(xhr.responseText))
          } else {
            console.log(xhr)
            throw new Error('There was a problem with the request!')
          }
        }

       }
     },

     /*
      * put: http.put to expects json data submited/returned
      */
     put: (url, data, callback) => {
       let xhr = new XMLHttpRequest()
       xhr.onreadystatechange = returnXHR
       xhr.open('PUT', url)
       xhr.setRequestHeader('Content-Type', 'application/json')
       xhr.send(JSON.stringify(data))

       function returnXHR () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
             callback(JSON.parse(xhr.responseText))
          } else {
            console.log(xhr)
            throw new Error('There was a problem with the request!')
          }
        }

       }
     },

     /*
      * delete: http.delete to expects json data submited/returned
      */
     delete: (url, callback) => {
       let xhr = new XMLHttpRequest()
       xhr.onreadystatechange = returnXHR
       xhr.open('DELETE', url)
       xhr.send()

       function returnXHR () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
             callback(JSON.parse(xhr.responseText))
          } else {
            console.log(xhr)
            throw new Error('There was a problem with the request!')
          }
        }

       }
     },
  }

  /*
   * internal helper function to check whether an element has a class
   */
   function _hasClass(el, cls) {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }

  window.$ninja = selector => {
    let _selector = selector || {}
    let ninja = Object.create(Ninja)
    ninja.init(_selector)
    // console.log('Object.assign()', Object.assign(Ninja, ninja))
    // return ninja
    // return Object.assign(Ninja, ninja)
    return Object.create(ninja)
  }
})(window)
