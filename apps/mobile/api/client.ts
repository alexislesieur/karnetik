import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.1.20:8000';

const TOKEN_KEY = 'token';

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

export type ForgotPasswordData = {
  email: string;
};

export type VerifyPasswordResetData = {
  email: string;
  code: string;
};

export type ResetPasswordData = {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
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

export type ForgotPasswordResponse = {
  message: string;
};

export type VerifyPasswordResetResponse = {
  message: string;
};

export type ResetPasswordResponse = {
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

async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
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

  const result =
    await parseResponse<AuthResponse>(response);

  await saveToken(result.token);

  return result;
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

  const result =
    await parseResponse<AuthResponse>(response);

  await saveToken(result.token);

  return result;
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

  return parseResponse<VerifyEmailResponse>(
    response,
  );
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

export async function forgotPassword(
  data: ForgotPasswordData,
): Promise<ForgotPasswordResponse> {
  const response = await fetch(
    `${API_URL}/api/password/forgot`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return parseResponse<ForgotPasswordResponse>(
    response,
  );
}

export async function verifyPasswordReset(
  data: VerifyPasswordResetData,
): Promise<VerifyPasswordResetResponse> {
  const response = await fetch(
    `${API_URL}/api/password/verify`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return parseResponse<VerifyPasswordResetResponse>(
    response,
  );
}

export async function resendPasswordReset(
  data: ForgotPasswordData,
): Promise<ForgotPasswordResponse> {
  return forgotPassword(data);
}

export async function resetPassword(
  data: ResetPasswordData,
): Promise<ResetPasswordResponse> {
  const response = await fetch(
    `${API_URL}/api/password/reset`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return parseResponse<ResetPasswordResponse>(
    response,
  );
}
