interface ZodFieldError {
  path: string[];
  message: string;
}

interface ZodFailResponse {
  error: { name: 'ZodError'; message: string; errors?: ZodFieldError[] };
}

export function parseZodError(body: ZodFailResponse): Record<string, string> {
  const errors: Record<string, string> = {};
  if (body.error?.errors && body.error.errors.length > 0) {
    for (const e of body.error.errors) {
      errors[e.path.join('.')] = e.message;
    }
  } else if (body.error?.message) {
    errors['_root'] = body.error.message;
  }
  return errors;
}
