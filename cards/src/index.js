import 'babel-polyfill';
import { el, setChildren } from 'redom';
import { isValid, isExpirationDateValid, isSecurityCodeValid } from 'creditcard.js';
import './style.scss';

// Логотипы

const logos = el('div', { class: 'cc-types' }, [
  el('img', { class: 'cc-types__img cc-types__img--amex' }),
  el('img', { class: 'cc-types__img cc-types__img--visa' }),
  el('img', { class: 'cc-types__img cc-types__img--mastercard' }),
  el('img', { class: 'cc-types__img cc-types__img--disc' }),
  el('img', { class: 'cc-types__img cc-types__img--genric' }),
])

// Создание формы

export function createForm() {
  const form = el('form', [
  el('input', {
    placeholder: 'Номер карты',
    id: 'number-input',
    oninput(event) {
      document.getElementById('number-input').removeAttribute('style');
    },
    onblur(event) {
      if (event.target.value.trim())
        if (!isValid(event.target.value)) {
          document.getElementById('number-input').style.borderColor = 'red';
        } else {
          document.getElementById('number-input').removeAttribute('style');
        }
    }
  }),
  el('input', {
    placeholder: 'ММ/ГГ',
    id: 'expiry-input',
    oninput() {
      document.getElementById('expiry-input').style.borderColor = '';
    },
    onblur(event) {
      const month = event.target.value.substr(0, 2),
        year = event.target.value.substr(3, 2);
      if (event.target.value.trim())
        if (!isExpirationDateValid(month, year)) {
          document.getElementById('expiry-input').style.borderColor = 'red';
        } else document.getElementById('expiry-input').style.borderColor = '';
    }
  }),
  el('input', {
    placeholder: 'CVC/CVV',
    id: 'cvc-input',
    maxlength: '3',
    oninput(event) {
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      document.getElementById('cvc-input').style.borderColor = '';
    },
    onblur(event) {
      if (event.target.value.trim())
        if (!isSecurityCodeValid(document.getElementById('number-input').value, event.target.value)) {
          document.getElementById('cvc-input').style.borderColor = 'red';
        } else document.getElementById('cvc-input').style.borderColor = '';
    }
  }),
  el('input', {
    placeholder: 'E-mail',
    id: 'email',
    oninput(event) {
      document.getElementById('email').style.borderColor = '';
    },
    onblur(event) {
      if (event.target.value.trim())
        if (!(event.target.value.includes('@') && event.target.value.includes('.'))) {
          document.getElementById('email').style.borderColor = 'red';
        } else document.getElementById('email').style.borderColor = '';
    }
  }),
  el('button', { id: 'button', disabled: 'true' }, 'Оплатить')
]);

form.querySelectorAll('input').forEach(input => {
  input.setAttribute('required', 'true');
  input.addEventListener('input', () => {
    document.getElementById('button').setAttribute('disabled', 'true');
  });
  input.addEventListener('blur', () => {
    let error = false;
    form.querySelectorAll('input').forEach(input => {
      if (input.getAttribute('style') || !input.value) error = true;
    })
    if (!error)
      document.getElementById('button').removeAttribute('disabled');
  })
});
return form;
};

setChildren(window.document.body, logos, createForm());

//Маска для полей

let ccNumberInput = document.getElementById('number-input'),
  ccNumberPattern = /^\d{0,16}$/g,
  ccNumberSeparator = " ",
  ccNumberInputOldValue,
  ccNumberInputOldCursor,

  ccExpiryInput = document.getElementById('expiry-input'),
  ccExpiryPattern = /^\d{0,4}$/g,
  ccExpirySeparator = "/",
  ccExpiryInputOldValue,
  ccExpiryInputOldCursor,

  mask = (value, limit, separator) => {
    var output = [];
    for (let i = 0; i < value.length; i++) {
      if (i !== 0 && i % limit === 0) {
        output.push(separator);
      }

      output.push(value[i]);
    }

    return output.join("");
  },
  unmask = (value) => value.replace(/[^\d]/g, ''),
  checkSeparator = (position, interval) => Math.floor(position / (interval + 1)),
  ccNumberInputKeyDownHandler = (e) => {
    let el = e.target;
    ccNumberInputOldValue = el.value;
    ccNumberInputOldCursor = el.selectionEnd;
  },
  ccNumberInputInputHandler = (e) => {
    let el = e.target,
      newValue = unmask(el.value),
      newCursorPosition;

    if (newValue.match(ccNumberPattern)) {
      newValue = mask(newValue, 4, ccNumberSeparator);

      newCursorPosition =
        ccNumberInputOldCursor - checkSeparator(ccNumberInputOldCursor, 4) +
        checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) +
        (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

      el.value = (newValue !== "") ? newValue : "";
    } else {
      el.value = ccNumberInputOldValue;
      newCursorPosition = ccNumberInputOldCursor;
    }

    el.setSelectionRange(newCursorPosition, newCursorPosition);

    highlightCC(el.value);
  },
  highlightCC = (ccValue) => {
    let ccCardType = '',
      ccCardTypePatterns = {
        amex: /^3/,
        visa: /^4/,
        mastercard: /^5/,
        disc: /^6/,

        genric: /(^1|^2|^7|^8|^9|^0)/,
      };

    for (const cardType in ccCardTypePatterns) {
      if (ccCardTypePatterns[cardType].test(ccValue)) {
        ccCardType = cardType;
        break;
      }
    }

    let activeCC = document.querySelector('.cc-types__img--active'),
      newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

    if (activeCC) activeCC.classList.remove('cc-types__img--active');
    if (newActiveCC) newActiveCC.classList.add('cc-types__img--active');
  },
  ccExpiryInputKeyDownHandler = (e) => {
    let el = e.target;
    ccExpiryInputOldValue = el.value;
    ccExpiryInputOldCursor = el.selectionEnd;
  },
  ccExpiryInputInputHandler = (e) => {
    let el = e.target,
      newValue = el.value;

    newValue = unmask(newValue);
    if (newValue.match(ccExpiryPattern)) {
      newValue = mask(newValue, 2, ccExpirySeparator);
      el.value = newValue;
    } else {
      el.value = ccExpiryInputOldValue;
    }
  };

ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler);
ccNumberInput.addEventListener('input', ccNumberInputInputHandler);

ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler);
ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler);
