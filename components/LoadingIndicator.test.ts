import { describe, it, expect, beforeEach } from 'vitest';
import { LoadingIndicator } from './LoadingIndicator.js';
import { ErrorMessage } from './ErrorMessage.js';

describe('LoadingIndicator', () => {
  let loading;

  beforeEach(() => {
    document.body.innerHTML = '<div id=\"app\"><div id=\"loading-indicator\" class=\"hidden\"><p>Loading...</p></div></div>';
    const container = document.getElementById('app');
    loading = new LoadingIndicator(container);
  });

  it('debe mostrar loading', () => {
    expect(loading.isVisible()).toBe(false);
    loading.show();
    expect(loading.isVisible()).toBe(true);
  });

  it('debe ocultar loading', () => {
    loading.show();
    loading.hide();
    expect(loading.isVisible()).toBe(false);
  });
});

describe('ErrorMessage', () => {
  let error;

  beforeEach(() => {
    document.body.innerHTML = '<div id=\"app\"><div id=\"error-message\"></div></div>';
    const container = document.getElementById('app');
    error = new ErrorMessage(container);
  });

  it('debe mostrar mensaje de error', () => {
    error.show('Test error');
    expect(error.isVisible()).toBe(true);
    expect(error.getMessage()).toBe('Test error');
  });

  it('debe limpiar error', () => {
    error.show('Test error');
    error.clear();
    expect(error.isVisible()).toBe(false);
    expect(error.getMessage()).toBe('');
  });

  it('debe reemplazar mensaje anterior', () => {
    error.show('First');
    error.show('Second');
    expect(error.getMessage()).toBe('Second');
  });
});
