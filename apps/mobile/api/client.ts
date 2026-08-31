export const API_URL = 'http://192.168.1.20:8000';

export type RegisterData = {
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponse = {
  user: {
    id: number;
    prenom: string | null;
    email: string;
    email_verifie: boolean;
  };
  token: string;
};

export type VerifyEmailData = {
  email: string;
  code: string;
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

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = await response.json();

    if (body.message) {
      return body.message;
    }

    if (body.errors) {
      const firstError = Object.values(body.errors)[0];

      if (
        Array.isArray(firstError) &&
        typeof firstError[0] === 'string'
      ) {
        return firstError[0];
      }
    }
  } catch {
    // La réponse n'est pas du JSON.
  }

  return fallback;
}

export async function register(
  data: RegisterData,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Une erreur est survenue lors de l’inscription.',
      ),
    );
  }

  return response.json();
}

export async function verifyEmail(
  data: VerifyEmailData,
): Promise<VerifyEmailResponse> {
  const response = await fetch(`${API_URL}/api/email/verify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Le code de vérification est incorrect.',
      ),
    );
  }

  return response.json();
}

export async function resendVerificationCode(
  email: string,
): Promise<ResendVerificationResponse> {
  const response = await fetch(`${API_URL}/api/email/resend`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Impossible de renvoyer le code.',
      ),
    );
  }

  return response.json();
}
