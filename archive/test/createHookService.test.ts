import {
  createHookService,
  createSingletonService,
  getSingletonService,
  resetAllServices,
} from '../lib/services/createHookService';

describe('createHookService', () => {
  let service: ReturnType<typeof createHookService>;

  beforeEach(() => {
    service = createHookService();
  });

  describe('initialization', () => {
    it('should create a service with initial state', () => {
      expect(service.get()).toBe(null);
      expect(service.isReady()).toBe(false);
    });

    it('should create new instances each time', () => {
      const service1 = createHookService();
      const service2 = createHookService();

      expect(service1).not.toBe(service2);
    });
  });

  describe('_setValue and get', () => {
    it('should set and get values correctly', () => {
      const testValue = { test: 'value' };

      service._setValue(testValue);

      expect(service.get()).toBe(testValue);
      expect(service.isReady()).toBe(true);
    });

    it('should handle null values', () => {
      service._setValue(null);

      expect(service.get()).toBe(null);
      expect(service.isReady()).toBe(true);
    });
  });

  describe('use method', () => {
    it('should warn when service not ready', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const callback = jest.fn();

      const result = service.use(callback);

      expect(result).toBe(null);
      expect(callback).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Hook service not ready. Make sure you're using useHookService in a React component."
      );

      consoleSpy.mockRestore();
    });

    it('should execute callback when ready', () => {
      const testValue = { method: jest.fn() };
      service._setValue(testValue);

      const result = service.use(
        (value) => (value as { method: Function }).method
      );

      expect(result).toBe(testValue.method);
    });

    it('should handle callback errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const testValue = { test: 'value' };
      const error = new Error('Callback error');

      service._setValue(testValue);
      const result = service.use(() => {
        throw error;
      });

      expect(result).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error using hook service:',
        error
      );

      consoleErrorSpy.mockRestore();
    });
  });
});

describe('createSingletonService', () => {
  beforeEach(() => {
    resetAllServices();
  });

  it('should return same instance for same service ID', () => {
    const service1 = createSingletonService('test');
    const service2 = createSingletonService('test');

    expect(service1).toBe(service2);
  });

  it('should return different instances for different service IDs', () => {
    const service1 = createSingletonService('test1');
    const service2 = createSingletonService('test2');

    expect(service1).not.toBe(service2);
  });

  it('should maintain state across getInstance calls', () => {
    const service1 = createSingletonService('test');
    service1._setValue({ shared: 'state' });

    const service2 = createSingletonService('test');

    expect(service2.get()).toEqual({ shared: 'state' });
    expect(service2.isReady()).toBe(true);
  });
});

describe('getSingletonService', () => {
  beforeEach(() => {
    resetAllServices();
  });

  it('should return null for non-existent service', () => {
    const service = getSingletonService('nonexistent');
    expect(service).toBe(null);
  });

  it('should return existing service', () => {
    const originalService = createSingletonService('test');
    const retrievedService = getSingletonService('test');

    expect(retrievedService).toBe(originalService);
  });
});

describe('resetAllServices', () => {
  it('should clear all singleton services', () => {
    createSingletonService('test1');
    createSingletonService('test2');

    resetAllServices();

    expect(getSingletonService('test1')).toBe(null);
    expect(getSingletonService('test2')).toBe(null);
  });
});

describe('createSingletonService', () => {
  beforeEach(() => {
    resetAllServices();
  });

  afterEach(() => {
    resetAllServices();
  });

  it('should create a singleton service', () => {
    const service = createSingletonService('test');

    expect(service).toBeDefined();
    expect(service.get).toBeDefined();
    expect(service.use).toBeDefined();
    expect(service.isReady).toBeDefined();
  });

  it('should return the same instance for same service ID', () => {
    const service1 = createSingletonService('test');
    const service2 = createSingletonService('test');

    expect(service1).toBe(service2);
  });

  it('should return different instances for different service IDs', () => {
    const service1 = createSingletonService('test1');
    const service2 = createSingletonService('test2');

    expect(service1).not.toBe(service2);
  });

  it('should maintain state across getInstance calls', () => {
    const service1 = createSingletonService('test');
    service1._setValue({ shared: 'state' });

    const service2 = createSingletonService('test');

    expect(service2.get()).toEqual({ shared: 'state' });
    expect(service2.isReady()).toBe(true);
  });

  it('should handle empty service IDs', () => {
    const service1 = createSingletonService('');
    const service2 = createSingletonService('');

    expect(service1).toBe(service2);
  });
});

describe('getSingletonService', () => {
  beforeEach(() => {
    resetAllServices();
  });

  afterEach(() => {
    resetAllServices();
  });

  it('should return null for non-existent service', () => {
    const service = getSingletonService('nonexistent');

    expect(service).toBe(null);
  });

  it('should return existing service', () => {
    const originalService = createSingletonService('test');
    const retrievedService = getSingletonService('test');

    expect(retrievedService).toBe(originalService);
  });

  it('should return null after reset', () => {
    createSingletonService('test');
    resetAllServices();

    const service = getSingletonService('test');

    expect(service).toBe(null);
  });
});

describe('resetAllServices', () => {
  it('should reset all singleton services', () => {
    const service1 = createSingletonService('test1');
    const service2 = createSingletonService('test2');

    service1._setValue({ data: 'test1' });
    service2._setValue({ data: 'test2' });

    expect(service1.isReady()).toBe(true);
    expect(service2.isReady()).toBe(true);

    resetAllServices();

    // Services should be reset but still accessible
    expect(getSingletonService('test1')).toBe(null);
    expect(getSingletonService('test2')).toBe(null);
  });

  it('should allow creating new services after reset', () => {
    createSingletonService('test');
    resetAllServices();

    const newService = createSingletonService('test');

    expect(newService).toBeDefined();
    expect(newService.isReady()).toBe(false);
  });
});
