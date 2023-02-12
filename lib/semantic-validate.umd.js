(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('dompurify')) :
    typeof define === 'function' && define.amd ? define(['dompurify'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SemanticValidate = factory(global.DOMPurify));
})(this, (function (DOMPurify) { 'use strict';

    class Core {
      form;
      lang;
      options;
      rules;
      /**
       * 
       * @param form 
       * @param options 
       */
      constructor(form, options = {}) {
        this.form = new WeakRef(document.querySelector(form));
        this.options = options;
        this.rules = /* @__PURE__ */ new Map();
      }
      /**
       * 
       */
      validate() {
      }
      /**
       * 
       * @param lang 
       * @returns 
       */
      setLang(lang) {
        this.lang = lang;
        return this;
      }
      /**
       * 
       * @param rules 
       * @returns 
       */
      setRules(rules) {
        for (const rule of rules) {
          if (!this.rules.has(rule.name)) {
            this.throwError(new Error(`The ${rule.name} rule already exists!`));
          }
          this.rules.set(rule.name, rule);
        }
        return this;
      }
      /**
       * 
       * @param schema 
       * @returns 
       */
      setSchema(schema) {
        const strategy = {
          lang: (value) => this.lang = value,
          rules: (value) => this.setRules(value)
        };
        for (const [key, value] of Object.entries(schema)) {
          strategy[key](value);
        }
        return this;
      }
      /**
       * 
       */
      disableNativeValidation(flag = true) {
        this.form.deref().setAttribute("novalidate", String(flag));
      }
      setElementRules(element, rules) {
        for (const [attr, value] of Object.entries(rules)) {
          if (attr === "name")
            continue;
          element.setAttribute(attr, value);
        }
      }
      bindElementsWithRules() {
        const onInput = (event) => {
        };
        for (const element of this.form.deref().elements) {
          const name = element.getAttribute("name");
          if (!name)
            continue;
          const rules = this.rules.get(name);
          if (!rules)
            continue;
          this.setElementRules(element, rules);
          element.removeEventListener("input", onInput);
          element.addEventListener("input", onInput);
        }
      }
      sanitize(value) {
        return DOMPurify.sanitize(value);
      }
      getData() {
        const handleSelectMultiple = ([name, value]) => {
          const rules = this.rules.get(name);
          if (rules.type === "select" && rules.multiple) {
            const select = this.form.deref().elements[name];
            const selectedValues = [...select.selectedOptions].filter((option) => option.selected).map((option) => option.value);
            return [name, selectedValues];
          }
          return [name, value];
        };
        const formData = Array.from(new FormData(this.form.deref()).entries()).map(handleSelectMultiple).map(([name, value]) => {
          return [
            name,
            this.options.sanitize ? this.sanitize(value) : value
          ];
        });
        return Object.fromEntries(formData);
      }
      getDataSerialized() {
        const formDataSerialized = new URLSearchParams();
        Array.from(Object.entries(this.getData())).forEach(([name, value]) => formDataSerialized.set(name, String(value)));
        console.log(new URLSearchParams(formDataSerialized.toString()).get("select2"));
        return formDataSerialized.toString();
      }
      throwError(error) {
      }
    }

    class SemanticValidate extends Core {
      /**
       * 
       * @param form 
       * @param options 
       */
      constructor(form, options) {
        super(form, options);
      }
      /**
       * Add a lang to setup right messages
       * @param lang 
       * @returns SemanticValidate instance
       */
      addLang(lang) {
        return super.setLang(lang);
      }
      /**
       * Add rules for de fields
       * @param rules 
       * @returns SemanticValidate instance
       */
      addRules(rules) {
        return super.setRules(rules);
      }
      /**
       * Add a schema
       * @param schema 
       * @returns SemanticValidate instance
       */
      addSchema(schema) {
        return this.setSchema(schema);
      }
      /**
       * Render form based on rules
       * @returns SemanticValidate instance
       */
      render() {
        super.disableNativeValidation();
        super.bindElementsWithRules();
        return this;
      }
      /**
       * Trigger the fn callback when form is sumitted
       * @param fn 
       */
      whenSubmit(fn) {
        const handler = (event) => {
          event.preventDefault();
          fn(event, {
            valid: this.form.deref().checkValidity(),
            values: super.getData(),
            ...this.options.serialized && {
              serialized: super.getDataSerialized()
            }
          });
        };
        this.form.deref().removeEventListener("submit", handler);
        this.form.deref().addEventListener("submit", handler);
      }
    }

    return SemanticValidate;

}));
//# sourceMappingURL=semantic-validate.umd.js.map
