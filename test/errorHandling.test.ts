import { createHookService, createSingletonService, resetAllServices } from '../lib';

describe('Error Handling', () => {
  beforeEach(() => {
    resetAllServices();
    jest.clearAllMocks();
  });

  describe('Service Error Handling', () => {
    it('should handle service not ready errors', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const service = createHookService();

      const result = service.use(() => 'should not run');

      expect(result).toBe(null);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Hook service not ready. Make sure you\'re using useHookService in a React component.'
      );
    });

    it('should handle callback execution errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const service = createHookService();
      const testError = new Error('Test callback error');

      service._setValue({ test: 'value' });

      const result = service.use(() => {
        throw testError;
      });

      expect(result).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error using hook service:', testError);
    });

    it('should handle null/undefined hook values', () => {
      const service = createHookService();

      service._setValue(null);
      expect(service.get()).toBe(null);
      expect(service.isReady()).toBe(true);

      service._setValue(undefined);
      expect(service.get()).toBe(undefined);
      expect(service.isReady()).toBe(true);
    });
  });

  describe('Singleton Service Error Handling', () => {
    it('should handle empty service IDs', () => {
      const service1 = createSingletonService('');
      const service2 = createSingletonService('');

      expect(service1).toBe(service2);
    });

    it('should handle special characters in service IDs', () => {
      const specialId = 'service-with-special@chars#123';
      const service1 = createSingletonService(specialId);
      const service2 = createSingletonService(specialId);

      expect(service1).toBe(service2);
    });

    it('should handle very long service IDs', () => {
      const longId = 'a'.repeat(1000);
      const service1 = createSingletonService(longId);
      const service2 = createSingletonService(longId);

      expect(service1).toBe(service2);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory with many services', () => {
      const services: Array<ReturnType<typeof createSingletonService>> = [];
      
      // Create many services
      for (let i = 0; i < 1000; i++) {
        services.push(createSingletonService(`service-${i}`));
      }

      // All services should be unique
      const uniqueServices = new Set(services);
      expect(uniqueServices.size).toBe(1000);

      // Reset should clear all
      resetAllServices();

      // New services with same IDs should be different instances
      const newService = createSingletonService('service-0');
      expect(newService).not.toBe(services[0]);
    });

    it('should handle reset with active services', () => {
      const service1 = createSingletonService('test1');
      const service2 = createSingletonService('test2');

      service1._setValue({ data: 'test1' });
      service2._setValue({ data: 'test2' });

      expect(service1.isReady()).toBe(true);
      expect(service2.isReady()).toBe(true);

      resetAllServices();

      // Services should still be functional but reset
      const newService1 = createSingletonService('test1');
      expect(newService1.isReady()).toBe(false);
      expect(newService1.get()).toBe(null);
    });
  });

  describe('Type Safety', () => {
    it('should handle generic types properly', () => {
      interface TestType {
        id: number;
        name: string;
        active: boolean;
      }

      const service = createSingletonService<TestType>('typed-service');
      const testValue: TestType = { id: 1, name: 'test', active: true };

      service._setValue(testValue);

      const result = service.use((value) => {
        // TypeScript should infer the correct type
        expect(typeof value.id).toBe('number');
        expect(typeof value.name).toBe('string');
        expect(typeof value.active).toBe('boolean');
        return value;
      });

      expect(result).toEqual(testValue);
    });

    it('should handle union types', () => {
      type UnionType = string | number | boolean;
      const service = createSingletonService<UnionType>('union-service');

      service._setValue('string value');
      expect(service.get()).toBe('string value');

      service._setValue(42);
      expect(service.get()).toBe(42);

      service._setValue(true);
      expect(service.get()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid service creation and destruction', () => {
      for (let i = 0; i < 100; i++) {
        const service = createSingletonService(`rapid-${i}`);
        service._setValue({ iteration: i });
        expect(service.get()).toEqual({ iteration: i });
      }

      resetAllServices();

      // Should be able to create new services after reset
      const newService = createSingletonService('rapid-0');
      expect(newService.isReady()).toBe(false);
    });

    it('should handle concurrent service access', () => {
      const service = createSingletonService('concurrent');
      const results: any[] = [];

      // Simulate concurrent access
      for (let i = 0; i < 10; i++) {
        service._setValue({ value: i });
        results.push(service.get());
      }

      // Should have the last set value
      expect(service.get()).toEqual({ value: 9 });
      expect(results).toHaveLength(10);
    });
  });
});
