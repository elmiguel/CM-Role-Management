((window) => {
  let $ninja = (selector) => {
      let self = {}

      self.inventory = 0

      try {
        self.element =
          selector.nodeType == 1 ?
            selector :
            typeof selector == 'string' ?
              [].slice.call(document.querySelectorAll(selector)) :
              (function(){
                throw new TypeError('Unknown Select Type')
              }())
      } catch (e){
        // empty selection
        let ninjas = document.querySelectorAll(selector)
        let ninjaId
        if(ninjas.length <= 0) {
          ninjaId = 0
        } else {
          ninjaId = ninjas.length
        }
        self.element = document.createElement('ninja-' + ninjaId)
      }

      if (self.element.length <= 0) {
        throw new Error('No selector(s) found: ' + self.selector)
      } else if (self.element.length == 1) {
        self.inventory = 1
        self.element = self.element[0]
      } else {
        self.inventory = self.element.length
      }

      /*
       * on: listen to an event and trigger callback
       * TODO: create a queue to look at top window listeners and run FCFS
       * FCFS: First come, first serve
       */
       // Update: Seems to be fixed under ES6
      self.on = (type, callback) => {
        let event = 'on' + type
        if (self.inventory > 1){
          for(let el of self.element) {
            el[event] = callback
          }
        } else {
          self.element[event] = callback
        }
      }

      /*
       * attr: get/set and attribute for this element
       */
      self.attr = (attr, value) => {
        let ret
        if (self.inventory > 1){
          ret = []
          for(let el of self.element) {
            ret.push(_attr(el, attr, value))
          }
        } else {
          ret = _attr(self.element, attr, value)
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
      }

      /*
       * hasAttr: simple check to see if the element has an attribute
       */
      self.hasAttr = (attr) => {
        let ret
        if (self.inventory > 1){
          ret = []
          for (let el of self.element) {
            ret.push(el.hasAttribute(attr))
          }
        } else {
          ret = self.element.hasAttribute(attr)
        }
        return ret
      }

      /*
       * html: get / set the html for the element
       */
      self.html = html => {
        let ret
        if (self.inventory > 1) {
          ret = []
          for (let el of self.element) {
            ret.push(_html(el, html))
          }
        } else {
          ret = _html(self.element, html)
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
      }


      /*
       * css(): get / set css styles on the element
       */
       self.css = css => {
         let ret
         if (self.inventory > 1) {
           ret = []
           for(let el of self.element) {
             if(css){
               ret.push(_css(el, css))
             } else {
               ret.push(el.style)
             }
           }
         } else {
           if(css){
             ret = _css(self.element, css)
           } else {
             ret = self.element.style
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
       }


       /*
        * addClass(): function to add a class to an element if not already added
        */
       self.addClass = (cls) => {
         let ret
         if (self.inventory > 1) {
           ret = []
           for(let el of self.element) {
             if (!_hasClass(el, cls)) {
               el.classList.add(cls)
             }
           }
         } else {
           if (!_hasClass(self.element, cls)) {
             self.element.classList.add(cls)
           }
         }
         return ret
       }

       /*
        * removeClass(): function to add a class to an element if not already added
        */
       self.removeClass = (cls) => {
         let ret
         if (self.inventory > 1) {
           ret = []
           for (let el of self.element) {
             if (_hasClass(el, cls)) {
               el.classList.remove(cls)
             }
           }
         } else {
           if (_hasClass(self.element, cls)) {
             self.element.classList.remove(cls)
           }
         }
         return ret
       }

       /*
        * internal helper function to check whether an element has a class
        */
        function _hasClass(el, cls) {
         return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
       }

       /*
        * get: http.get to expects json data returned
        */
       self.get = (url, params, callback) => {
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
       }

       /*
        * post: http.post to expects json data submited/returned
        */
       self.post = (url, data, callback) => {
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
       }

       /*
        * put: http.put to expects json data submited/returned
        */
       self.put = (url, data, callback) => {
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
       }

       /*
        * delete: http.delete to expects json data submited/returned
        */
       self.delete = (url, callback) => {
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
       }

      return self
  }
  window.$ninja = $ninja
})(window)
