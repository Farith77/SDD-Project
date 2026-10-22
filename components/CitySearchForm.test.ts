import { describe, it, expect, beforeEach } from 'vitest';
import { CitySearchForm } from './CitySearchForm.js';

describe('CitySearchForm - Property 1 & 2', () => {
  let form;
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id=\"app\"><form id=\"city-search-form\"><input id=\"city-input\" type=\"text\" maxlength=\"100\" /><button>Search</button></form><div id=\"validation-error\"></div></div>';
    container = document.getElementById('app');
    form = new CitySearchForm(container);
  });

  it('Property 1: rechaza strings vacios', () => {
    let callbackInvoked = false;
    form.onSearch(() => { callbackInvoked = true; });
    form.setValue('');
    form.getForm().dispatchEvent(new Event('submit', { bubbles: true }));
    expect(callbackInvoked).toBe(false);
  });

  it('Property 1: muestra error cuando vacio', () => {
    form.setValue('');
    form.getForm().dispatchEvent(new Event('submit', { bubbles: true }));
    const error = document.querySelector('#validation-error');
    expect(error.textContent).toBe('Please enter a city name');
  });

  it('Property 2: trimea espacios', () => {
    let captured = '';
    form.onSearch((name) => { captured = name; });
    form.setValue('  Berlin  ');
    form.getForm().dispatchEvent(new Event('submit', { bubbles: true }));
    expect(captured).toBe('Berlin');
  });

  it('debe permitir Enter para submit', () => {
    let invoked = false;
    form.onSearch(() => { invoked = true; });
    form.setValue('Berlin');
    form.getInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(invoked).toBe(true);
  });
});
