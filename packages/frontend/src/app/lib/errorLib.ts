/**
 * Logs an error to an external service.
 * @param locationString - The location of the error.
 * @param error - The error to log.
 */
export function onError(locationString: string, error: unknown): string {
  let errorMessage = '';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = String(error);
  }
  console.error(`${locationString} Error=`, errorMessage);
  return errorMessage;
}
