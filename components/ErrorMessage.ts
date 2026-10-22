/**
 * ErrorMessage Component
 * Displays error messages to the user
 */
export class ErrorMessage {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container.querySelector('#error-message') as HTMLElement;
  }

  /**
   * Display an error message
   */
  show(message: string): void {
    this.container.textContent = message;
    this.container.classList.remove('hidden');
  }

  /**
   * Clear and hide the error message
   */
  clear(): void {
    this.container.textContent = '';
    this.container.classList.add('hidden');
  }

  /**
   * Check if error is visible
   */
  isVisible(): boolean {
    return !this.container.classList.contains('hidden');
  }

  /**
   * Get the message text (for testing)
   */
  getMessage(): string {
    return this.container.textContent || '';
  }

  /**
   * Get the container (for testing)
   */
  getContainer(): HTMLElement {
    return this.container;
  }
}
