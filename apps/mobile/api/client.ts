export const API_URL = 'http://192.168.1.20:8000';

export type RegisterData = {
  prenom?: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type VerifyEmailData = {
  email: string;
  code: string;
};

export type ResendVerificationData = {
  email: string;
};

export type AuthResponse = {
  user: {
    id: number;
    prenom: string | null;
    email: string;
    email_verifie: boolean;
  };
  token: string;
};

export type VerifyEmailResponse = {
  message: string;
  user: {
    id: number;
    prenom: string | null;
    email: string;
    email_verifie: boolean;
  };
};

export type ResendVerificationResponse = {
  message: string;
};

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const body = await response.json();

  if (!response.ok) {
    const validationErrors = body.errors
      ? Object.values(body.errors)
          .flat()
          .join('\n')
      : null;

    throw new Error(
      validationErrors ??
        body.message ??
        'Une erreur est survenue.',
    );
  }

  return body as T;
}

export async function register(
  data: RegisterData,
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/api/register`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return parseResponse<AuthResponse>(response);
}

export async function login(
  data: LoginData,
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/api/login`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return parseResponse<AuthResponse>(response);
}

export async function verifyEmail(
  data: VerifyEmailData,
): Promise<VerifyEmailResponse> {
  const response = await fetch(
    `${API_URL}/api/email/verify`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return parseResponse<VerifyEmailResponse>(response);
}

export async function resendVerification(
  data: ResendVerificationData,
): Promise<ResendVerificationResponse> {
  const response = await fetch(
    `${API_URL}/api/email/resend`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return parseResponse<ResendVerificationResponse>(
    response,
  );
}
