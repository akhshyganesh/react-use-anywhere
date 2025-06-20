import { 
  createHookService, 
  createSingletonService, 
  getSingletonService, 
  resetAllServices 
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

  describe('_setValue', () => {
    it('should set value and mark as ready', () => {
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
      service._setValue('string value');
      expect(service.get()).toBe('string value');
      
      service._setValue(42);
      expect(service.get()).toBe(42);
      
      service._setValue(true);
      expect(service.get()).toBe(true);
    });
  });

  describe('get', () => {
    it('should return null when not ready', () => {
      expect(service.get()).toBe(null);
    });

    it('should return the set value when ready', () => {
      const testValue = { name: 'test' };
      service._setValue(testValue);
      
      expect(service.get()).toBe(testValue);
    });
  });

  describe('isReady', () => {
    it('should return false initially', () => {
      expect(service.isReady()).toBe(false);
    });

    it('should return true after setValue', () => {
      service._setValue('test');
      expect(service.isReady()).toBe(true);
    });

    it('should return true even for null values after setValue', () => {
      service._setValue(null);
      expect(service.isReady()).toBe(true);
    });
  });

  describe('use', () => {
    it('should return null and warn when not ready', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const callback = jest.fn();
      
      const result = service.use(callback);
      
      expect(result).toBe(null);
      expect(callback).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Hook service not ready. Make sure you\'re using useHookService in a React component.'
      );
    });

    it('should execute callback with hook value when ready', () => {
      const testValue = { method: jest.fn() };
      const callback = jest.fn().mockReturnValue('result');
      
      service._setValue(testValue);
      const result = service.use(callback);
      
      expect(callback).toHaveBeenCalledWith(testValue);
      expect(result).toBe('result');
    });

    it('should handle callback errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const testValue = { test: 'value' };
      const error = new Error('Callback error');
      const callback = jest.fn().mockImplementation(() => {
        throw error;
      });
      
      service._setValue(testValue);
      const result = service.use(callback);
      
      expect(result).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error using hook service:', error);
    });

    it('should handle async callbacks', async () => {
      const testValue = { asyncMethod: jest.fn() };
      const callback = jest.fn().mockResolvedValue('async result');
      
      service._setValue(testValue);
      const result = service.use(callback);
      
      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBe('async result');
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
