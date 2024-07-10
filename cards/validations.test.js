import { isValid, isSecurityCodeValid } from 'creditcard.js';
import { createForm } from './src/index.js';

test('Валидация номера карты пропускает корректный номер карты', () => {
  expect(isValid('4000001234567899')).toBe(true);
});

test('Валидация не должна пропускать произвольную строку, содержащую любые нецифровые символы', () => {
  expect(isValid('впаkjgf?!,')).toBe(false);
});

test('Валидация номера карты не пропускает строку с недостаточным количеством цифр', () => {
  expect(isValid('234256')).toBe(false);
});

test('Валидация номера карты не пропускает строку со слишком большим количеством цифр', () => {
  expect(isValid('23425656756767565465456456456756756756567575')).toBe(false);
});

test('Валидация CVV/CVC пропускает строку с тремя цифровыми символами.', () => {
  expect(isSecurityCodeValid('4000001234567899', '123')).toBe(true);
});

test('Валидация CVV/CVC не пропускает строки с 1-2 цифровыми символами.', () => {
  expect(isSecurityCodeValid('4000001234567899', '2')).toBe(false);
});

test('Валидация CVV/CVC не пропускает строки с 4+ цифровыми символами.', () => {
  expect(isSecurityCodeValid('4000001234567899', '1234')).toBe(false);
});

test('Валидация CVV/CVC не пропускает строки с тремя нецифровыми символами', () => {
  expect(isSecurityCodeValid('4000001234567899', 'qwe')).toBe(false);
});

test('Функция createForm должна вернуть DOM элемент с 4 полями для ввода', () => {
  const form = createForm();
  expect(form).toBeInstanceOf(HTMLFormElement);
  expect(form.querySelectorAll('input').length).toBe(4);
  expect(form.querySelectorAll('input')[0].placeholder).toEqual('Номер карты');
  expect(form.querySelectorAll('input')[1].placeholder).toEqual('ММ/ГГ');
  expect(form.querySelectorAll('input')[2].placeholder).toEqual('CVC/CVV');
  expect(form.querySelectorAll('input')[3].placeholder).toEqual('E-mail');
});


