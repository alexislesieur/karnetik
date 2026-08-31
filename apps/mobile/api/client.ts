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

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      body.message ?? 'Une erreur est survenue lors de l’inscription.',
    );
  }

  return body;
}
