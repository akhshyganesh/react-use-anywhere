class NavigationService {
  private navigateFn: ((path: string) => void) | null = null;

  setNavigate(fn: (path: string) => void) {
    this.navigateFn = fn;
  }

  navigate(path: string) {
    if (this.navigateFn) {
      this.navigateFn(path);
    } else {
      console.warn('Navigation function not set yet!');
    }
  }

  navigateToLogin() {
    this.navigate('/login');
  }
}

// Singleton instance
export const navigationService = new NavigationService();