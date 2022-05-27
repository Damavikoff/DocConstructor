export default {
  data() {
    return {
      //apiHost: 'http://172.20.40.96:8081/',
      apiHost: '/',
      //hostPrefix: 'gusn/'
      hostPrefix: ''
    }
  },
  methods: {
    setCssVar(variable, value) {
      const root = document.querySelector(':root')
      root.style.setProperty(variable, value);
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getCurrentDate() {
      const date = new Date()
      return {
        date,
        year: date.getFullYear(),
        quarter: Math.ceil((date.getMonth() + 1) / 3),
        month: date.getMonth() + 1
      }
    },
    getMonthByIndex(index) {
      const months = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октбярь','ноябрь','декабрь'];
      return months[Math.max(index - 1, 0)]
    },
    goToLink(link) {
      window.location.href = link;
    },
    getTimeOut(func) {
      return setTimeout(() => {
          func();
      }, 300);
    },
    processPost(url, params, {before, after, success, failure, type}) {
      before && before();
      const isFormData = params instanceof FormData

      const settings = {
        url,
        data: params,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        processData: true,
        method: 'POST'
      }

      if (type === 'json') {
        settings.data = JSON.stringify(params)
        settings.contentType = 'application/json; charset=UTF-8'
      }

      if (type === 'blob') {
        settings.xhrFields = {
          responseType: "blob"
        }
      }

      if (isFormData) {
        settings.processData = false
        settings.contentType = false
      }

      $.ajax(settings).then(data => {
        if (type === 'blob') {
          success(data);
        } else if (data.ok) {
          success(data.result);
        } else {
          this.toastus(data.result, 'error');
        }
        after && after();
      }).catch(error => {
        if (error.status === 401 && window) {
          window.location.href = `${this.apiHost}${this.hostPrefix}`
          return
        }
        let message = null;
        if (error.responseText) {
            message = error.responseText;
        } else if (error.statusText) {
            message = error.statusText;
        } else {
            message = error;
        }
        failure && failure();
        after && after();
        this.toastus(message, 'error');
      });
    },
    downloadBlob(url, params, title, {success, after}) {
      this.processPost(url, params, {
        success: (data) => {
          const bUrl = window.URL.createObjectURL(data)
          const link = document.createElement('a')
          link.href = bUrl
          link.download = title
          link.click()
          window.URL.revokeObjectURL(url)
          link.remove()
          success && success()
        },
        after: () => {
          after && after()
        },
        type: 'blob'
      })
    },
    isEmpty(val) {
      return val === null || val === undefined || !val.toString().trim().length;
    },
    getSize() {
      const avl = window.screen.availHeight;
      const inn = window.innerHeight;
      const out = window.outerHeight;
      return avl <= out ? inn: avl - out + inn + 21;
    },
    lettertoNum(str) {
      let out = -1;
      const len = str.length;
      for (let pos = 0; pos < len; pos++) {
        out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1);
      }
      return out;
    },
    numToLetter(num) {
      const count = Math.floor(num / 26) + 1;
      return Array(count).join('A') + String.fromCharCode(65 + num % 26);
    },
    toastus(message, type) {
      $('body').toast({
        class: type ? type : 'success',
        displayTime: 4000,
        message: message
      });
    },
    cloneObject(obj) {
      if (Object.prototype.toString.call(obj) == '[object Array]') {
        const result = [];
        obj.forEach(el => {
          result.push(this.cloneObject(el));
        });
        return result;
      } else if (Object.prototype.toString.call(obj) == '[object Object]') {
        const result = {};
        Object.keys(obj).forEach(el => {
          result[el] = this.cloneObject(obj[el]);
        });
        return result;
      } else {
        return obj;
      }
    },          
    clearObject(obj, exclude) {
      if (!exclude) {
        exclude = [];
      }
      Object.keys(obj).forEach(function(el) {
        if (obj[el] == null || ~exclude.indexOf(el)) {
          return;
        }
        if (Object.prototype.toString.call(obj[el]) == '[object Array]') {
            obj[el] = [];
        } else if (Object.prototype.toString.call(obj[el]) == '[object Boolean]') {
          obj[el] = false;
        } else if (Object.prototype.toString.call(obj[el]) == '[object Object]') {
          $.clearObject(obj[el]);
        } else {
          obj[el] = null;
        }
      });
    }
  }
}