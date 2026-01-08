/**
 * ValidationError - Thrown when user input fails validation at library boundaries
 * Per Constitution Principle III: Fail fast with clear error messages
 */
export class ValidationError extends Error {
  public readonly parameterName: string;
  public readonly invalidValue: unknown;

  constructor(message: string, parameterName: string, invalidValue: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.parameterName = parameterName;
    this.invalidValue = invalidValue;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  /**
   * Create a ValidationError for an empty required parameter
   */
  public static forEmptyParameter(parameterName: string): ValidationError {
    return new ValidationError(
      `Parameter "${parameterName}" cannot be empty`,
      parameterName,
      ''
    );
  }

  /**
   * Create a ValidationError for an invalid parameter value
   */
  public static forInvalidValue(
    parameterName: string,
    invalidValue: unknown,
    reason: string
  ): ValidationError {
    return new ValidationError(
      `Invalid ${parameterName}: ${reason}`,
      parameterName,
      invalidValue
    );
  }
}
