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

    it('should handle primitive values', () => {
      service._setValue('test' as any);
      expect(service.get()).toBe('test');

      service._setValue(42 as any);
      expect(service.get()).toBe(42);

      service._setValue(true as any);
      expect(service.get()).toBe(true);
    });

    it('should update value on subsequent calls', () => {
      const value1 = { id: 1 };
      const value2 = { id: 2 };

      service._setValue(value1);
      expect(service.get()).toBe(value1);

      service._setValue(value2);
      expect(service.get()).toBe(value2);
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

    it('should pass the correct value to callback', () => {
      const testValue = { name: 'test', count: 42 };
      service._setValue(testValue);

      service.use((value) => {
        expect(value).toBe(testValue);
        expect(value).toEqual({ name: 'test', count: 42 });
      });
    });

    it('should return the callback result', () => {
      service._setValue({ value: 10 } as any);

      const result = service.use((val) => (val as { value: number }).value * 2);
      expect(result).toBe(20);
    });

    it('should handle callback errors gracefully', () => {
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

  describe('isReady', () => {
    it('should return false initially', () => {
      expect(service.isReady()).toBe(false);
    });

    it('should return true after setValue', () => {
      service._setValue({ test: 'value' });
      expect(service.isReady()).toBe(true);
    });

    it('should return true even with null value after setValue', () => {
      service._setValue(null);
      expect(service.isReady()).toBe(true);
    });
  });

  describe('_reset', () => {
    it('should reset service to initial state', () => {
      service._setValue({ test: 'value' });
      expect(service.isReady()).toBe(true);

      service._reset();

      expect(service.get()).toBe(null);
      expect(service.isReady()).toBe(false);
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

  it('should return different instances for different IDs', () => {
    const service1 = createSingletonService('test1');
    const service2 = createSingletonService('test2');

    expect(service1).not.toBe(service2);
  });

  it('should maintain state across retrievals', () => {
    const service1 = createSingletonService('test');
    service1._setValue({ count: 1 });

    const service2 = createSingletonService('test');
    expect(service2.get()).toEqual({ count: 1 });
  });

  it('should share state between multiple references', () => {
    const service1 = createSingletonService<{ count: number }>('counter');
    const service2 = createSingletonService<{ count: number }>('counter');

    service1._setValue({ count: 5 });
    expect(service2.get()).toEqual({ count: 5 });

    service2._setValue({ count: 10 });
    expect(service1.get()).toEqual({ count: 10 });
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
    const created = createSingletonService('test');
    const retrieved = getSingletonService('test');

    expect(retrieved).toBe(created);
  });

  it('should return service with correct state', () => {
    const service = createSingletonService('test');
    service._setValue({ data: 'value' });

    const retrieved = getSingletonService('test');
    expect(retrieved?.get()).toEqual({ data: 'value' });
  });
});

describe('resetAllServices', () => {
  beforeEach(() => {
    resetAllServices();
  });

  it('should reset all singleton services', () => {
    const service1 = createSingletonService('test1');
    const service2 = createSingletonService('test2');

    service1._setValue({ data: 'value1' });
    service2._setValue({ data: 'value2' });

    resetAllServices();

    expect(service1.isReady()).toBe(false);
    expect(service2.isReady()).toBe(false);
    expect(service1.get()).toBe(null);
    expect(service2.get()).toBe(null);
  });

  it('should clear service registry', () => {
    createSingletonService('test');
    resetAllServices();

    const service = getSingletonService('test');
    expect(service).toBe(null);
  });

  it('should allow creating new services after reset', () => {
    const service1 = createSingletonService('test');
    service1._setValue({ data: 'old' });

    resetAllServices();

    const service2 = createSingletonService('test');
    expect(service2.get()).toBe(null);
    expect(service2.isReady()).toBe(false);
  });
});
