import { NavigationService, createNavigationService, HookInjectionError } from '../lib';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    service = createNavigationService() as NavigationService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create a service instance', () => {
      expect(service).toBeInstanceOf(NavigationService);
    });

    it('should not be ready initially', () => {
      expect(service.isReady()).toBe(false);
    });
  });

  describe('setNavigate', () => {
    it('should set navigation function', () => {
      const mockNavigate = jest.fn();
      service.setNavigate(mockNavigate);
      
      expect(service.isReady()).toBe(true);
    });

    it('should warn for invalid navigation function', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      service.setNavigate('invalid' as any);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid navigation function')
      );
      expect(service.isReady()).toBe(false);
    });
  });

  describe('navigate', () => {
    it('should call navigation function when ready', () => {
      const mockNavigate = jest.fn();
      service.setNavigate(mockNavigate);
      
      service.navigate('/test');
      
      expect(mockNavigate).toHaveBeenCalledWith('/test', undefined);
    });

    it('should warn when navigation not ready', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      service.navigate('/test');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('navigation function has not been injected')
      );
    });
  });

  describe('convenience methods', () => {
    beforeEach(() => {
      const mockNavigate = jest.fn();
      service.setNavigate(mockNavigate);
    });

    it('should navigate to login', () => {
      const spy = jest.spyOn(service, 'navigate');
      
      service.navigateToLogin();
      
      expect(spy).toHaveBeenCalledWith('/login');
    });

    it('should navigate to home', () => {
      const spy = jest.spyOn(service, 'navigate');
      
      service.navigateToHome();
      
      expect(spy).toHaveBeenCalledWith('/');
    });

    it('should navigate to error page', () => {
      const spy = jest.spyOn(service, 'navigate');
      
      service.navigateToError('/error', { error: 'test' });
      
      expect(spy).toHaveBeenCalledWith('/error', { state: { error: 'test' } });
    });
  });

  describe('error handling', () => {
    it('should create error for hook not set', () => {
      const error = HookInjectionError.hookNotSet('test hook');
      
      expect(error).toBeInstanceOf(HookInjectionError);
      expect(error.code).toBe('HOOK_NOT_SET');
      expect(error.message).toContain('test hook');
    });

    it('should create error for invalid hook', () => {
      const error = HookInjectionError.invalidHook('test hook', 'function');
      
      expect(error).toBeInstanceOf(HookInjectionError);
      expect(error.code).toBe('INVALID_HOOK');
      expect(error.message).toContain('test hook');
    });
  });
});
