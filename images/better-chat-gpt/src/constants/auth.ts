export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT ?? '/phi-2/v1/chat/completions';

export const availableEndpoints = [defaultAPIEndpoint];

export function doesAPIEndpointRequireAPIKey(url: string): boolean {
  return false
}
