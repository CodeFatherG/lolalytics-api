import { getChampionData } from '../../../src/api/getChampionData';
import { getTierlist } from '../../../src/api/getTierlist';
import { ValidationError } from '../../../src/domain/shared/errors/ValidationError';
import { NetworkError } from '../../../src/domain/shared/errors/NetworkError';
import { ParsingError } from '../../../src/domain/shared/errors/ParsingError';

describe('Error Context and Structure', () => {
  describe('ValidationError', () => {
    it('should include parameterName field', async () => {
      try {
        await getChampionData('');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const validationError = error as ValidationError;
        expect(validationError).toHaveProperty('parameterName');
        expect(validationError.parameterName).toBe('championName');
      }
    });

    it('should include invalidValue field', async () => {
      try {
        await getChampionData('   ');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const validationError = error as ValidationError;
        expect(validationError).toHaveProperty('invalidValue');
      }
    });

    it('should extend Error class properly', async () => {
      try {
        await getTierlist(1, 'invalidlane');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as Error).message).toBeDefined();
        expect((error as Error).name).toBe('ValidationError');
      }
    });

    it('should have descriptive error messages', async () => {
      try {
        await getChampionData('');
        fail('Should have thrown ValidationError');
      } catch (error) {
        const message = (error as Error).message;
        expect(message).toContain('championName');
        expect(message).toContain('empty');
      }
    });
  });

  describe('NetworkError and ParsingError (Structure Verification)', () => {
    it('NetworkError should have required context fields', () => {
      // Create a NetworkError to verify its structure
      const networkError = NetworkError.forTimeout('https://test.com', 2);

      expect(networkError).toBeInstanceOf(Error);
      expect(networkError).toBeInstanceOf(NetworkError);
      expect(networkError).toHaveProperty('url');
      expect(networkError).toHaveProperty('retryAttempts');
      expect(networkError.url).toBe('https://test.com');
      expect(networkError.retryAttempts).toBe(2);
      expect(networkError.name).toBe('NetworkError');
    });

    it('ParsingError should have required context fields', () => {
      // Create a ParsingError to verify its structure
      const parsingError = ParsingError.forMissingElement(
        'https://test.com',
        '.test-selector',
        'test context'
      );

      expect(parsingError).toBeInstanceOf(Error);
      expect(parsingError).toBeInstanceOf(ParsingError);
      expect(parsingError).toHaveProperty('url');
      expect(parsingError).toHaveProperty('selector');
      expect(parsingError).toHaveProperty('context');
      expect(parsingError.url).toBe('https://test.com');
      expect(parsingError.selector).toBe('.test-selector');
      expect(parsingError.context).toBe('test context');
      expect(parsingError.name).toBe('ParsingError');
    });
  });

  describe('Error Message Quality', () => {
    it('should provide actionable error messages for validation failures', async () => {
      try {
        await getTierlist(1, 'unknownlane');
        fail('Should have thrown ValidationError');
      } catch (error) {
        const message = (error as Error).message;
        // Message should be helpful and guide user to valid options
        expect(message.length).toBeGreaterThan(20);
        expect(message).toMatch(/lane|invalid/i);
      }
    });

    it('should provide context for empty parameter errors', async () => {
      try {
        await getChampionData('');
        fail('Should have thrown ValidationError');
      } catch (error) {
        const validationError = error as ValidationError;
        expect(validationError.message).toContain('championName');
        expect(validationError.message).toContain('empty');
        expect(validationError.parameterName).toBe('championName');
      }
    });
  });

  describe('Error Inheritance', () => {
    it('all custom errors should extend Error', async () => {
      const validationError = ValidationError.forEmptyParameter('test');
      const networkError = NetworkError.forTimeout('https://test.com', 2);
      const parsingError = ParsingError.forMissingElement('https://test.com', '.test', 'test');

      expect(validationError).toBeInstanceOf(Error);
      expect(networkError).toBeInstanceOf(Error);
      expect(parsingError).toBeInstanceOf(Error);
    });

    it('custom errors should have correct name property', () => {
      const validationError = ValidationError.forEmptyParameter('test');
      const networkError = NetworkError.forTimeout('https://test.com', 2);
      const parsingError = ParsingError.forMissingElement('https://test.com', '.test', 'test');

      expect(validationError.name).toBe('ValidationError');
      expect(networkError.name).toBe('NetworkError');
      expect(parsingError.name).toBe('ParsingError');
    });
  });
});
