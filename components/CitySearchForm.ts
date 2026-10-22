/**
 * CitySearchForm Component
 * Renders an input field and submit button for city name entry
 * Validates input and emits search events
 */
export class CitySearchForm {
  private container: HTMLElement;
  private form: HTMLFormElement;
  private input: HTMLInputElement;
  private validationError: HTMLDivElement;
  private onSearchCallback: ((cityName: string) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.form = container.querySelector('#city-search-form') as HTMLFormElement;
    this.input = container.querySelector('#city-input') as HTMLInputElement;
    this.validationError = container.querySelector('#validation-error') as HTMLDivElement;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    this.submitSearch();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitSearch();
    }
  }

  private submitSearch(): void {
    const cityName = this.input.value.trim();

    // Validate: no empty strings or whitespace-only (Property 1)
    if (!cityName) {
      this.validationError.textContent = 'Please enter a city name';
      return;
    }

    // Clear validation error
    this.validationError.textContent = '';

    // Emit with trimmed value (Property 2)
    if (this.onSearchCallback) {
      this.onSearchCallback(cityName);
    }
  }

  /**
   * Register callback for search events
   * @param callback Function to call when search is submitted
   */
  onSearch(callback: (cityName: string) => void): void {
    this.onSearchCallback = callback;
  }

  /**
   * Get the current value in the input field
   */
  getValue(): string {
    return this.input.value;
  }

  /**
   * Set the value in the input field
   */
  setValue(value: string): void {
    this.input.value = value;
  }

  /**
   * Set the input to disabled/enabled state
   */
  setDisabled(disabled: boolean): void {
    this.input.disabled = disabled;
    const button = this.form.querySelector('button') as HTMLButtonElement;
    if (button) {
      button.disabled = disabled;
    }
  }

  /**
   * Clear the validation error message
   */
  clearError(): void {
    this.validationError.textContent = '';
  }

  /**
   * Get the input element (for testing)
   */
  getInput(): HTMLInputElement {
    return this.input;
  }

  /**
   * Get the form element (for testing)
   */
  getForm(): HTMLFormElement {
    return this.form;
  }
}
