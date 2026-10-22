/**
 * LoadingIndicator Component
 * Shows/hides loading state during data fetching
 */
export class LoadingIndicator {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container.querySelector('#loading-indicator') as HTMLElement;
  }

  /**
   * Show loading indicator
   */
  show(): void {
    this.container.classList.remove('hidden');
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    this.container.classList.add('hidden');
  }

  /**
   * Check if visible
   */
  isVisible(): boolean {
    return !this.container.classList.contains('hidden');
  }

  /**
   * Get the container (for testing)
   */
  getContainer(): HTMLElement {
    return this.container;
  }
}
