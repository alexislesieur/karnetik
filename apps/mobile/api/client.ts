import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api';

const TOKEN_KEY = 'karnetik_token';
const USER_KEY = 'karnetik_user';

export type User = {
  id: number;
  prenom: string | null;
  email: string;
  email_verifie: boolean;
  onboarding_completed: boolean;
};

export type VehicleBrand = {
  id: number;
  nom: string;
};

export type VehicleModel = {
  id: number;
  nom: string;
};

export type Vehicle = {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  kilometrage_actuel: number;
  mise_en_circulation: string;
};

type AuthResponse = {
  user: User;
  token: string;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => null)) as
    | T
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    if (errorData?.errors) {
      const firstError = Object.values(errorData.errors)[0]?.[0];

      if (firstError) {
        throw new Error(firstError);
      }
    }

    throw new Error(
      errorData?.message ??
        'Une erreur est survenue. Veuillez réessayer.',
    );
  }

  return data as T;
}

async function saveAuth(
  response: AuthResponse,
): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, response.token],
    [USER_KEY, JSON.stringify(response.user)],
  ]);
}

export async function register(params: {
  prenom?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}): Promise<AuthResponse> {
  const response = await request<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  await saveAuth(response);

  return response;
}

export async function login(params: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await request<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  await saveAuth(response);

  return response;
}

export async function getCurrentUser(): Promise<User> {
  const response = await request<User>('/user', {
    method: 'GET',
  });

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(response),
  );

  return response;
}

export async function getStoredUser(): Promise<User | null> {
  const value = await AsyncStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    await AsyncStorage.removeItem(USER_KEY);
    return null;
  }
}

export async function completeOnboarding(
  prenom: string,
): Promise<{
  message: string;
  user: User;
}> {
  const response = await request<{
    message: string;
    user: User;
  }>('/onboarding/name', {
    method: 'PATCH',
    body: JSON.stringify({
      prenom: prenom.trim(),
    }),
  });

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(response.user),
  );

  return response;
}

export async function getVehicleBrands(): Promise<VehicleBrand[]> {
  const response = await request<{
    brands: VehicleBrand[];
  }>('/vehicle-brands', {
    method: 'GET',
  });

  return response.brands;
}

export async function getVehicleModels(
  brandId: number,
): Promise<VehicleModel[]> {
  const response = await request<{
    brand: VehicleBrand;
    models: VehicleModel[];
  }>(`/vehicle-brands/${brandId}/models`, {
    method: 'GET',
  });

  return response.models;
}

export async function completeVehicle(params: {
  vehicle_brand_id: number;
  vehicle_model_id: number;
  immatriculation: string;
  kilometrage_actuel: number;
  mise_en_circulation: string;
}): Promise<{
  message: string;
  user: User;
  vehicle: Vehicle;
}> {
  const response = await request<{
    message: string;
    user: User;
    vehicle: Vehicle;
  }>('/onboarding/vehicle', {
    method: 'POST',
    body: JSON.stringify({
      vehicle_brand_id: params.vehicle_brand_id,
      vehicle_model_id: params.vehicle_model_id,
      immatriculation: params.immatriculation
        .trim()
        .toUpperCase(),
      kilometrage_actuel: params.kilometrage_actuel,
      mise_en_circulation: params.mise_en_circulation,
    }),
  });

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(response.user),
  );

  return response;
}

export async function forgotPassword(
  emailOrParams: string | { email: string },
): Promise<{ message: string }> {
  const email =
    typeof emailOrParams === 'string'
      ? emailOrParams
      : emailOrParams.email;

  return request<{ message: string }>('/password/forgot', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });
}

export async function verifyPasswordReset(params: {
  email: string;
  code: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>('/password/verify', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email.trim().toLowerCase(),
      code: params.code,
    }),
  });
}

export async function resetPassword(params: {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>('/password/reset', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email.trim().toLowerCase(),
      code: params.code,
      password: params.password,
      password_confirmation: params.password_confirmation,
    }),
  });
}

export async function verifyEmail(params: {
  email: string;
  code: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>('/email/verify', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email.trim().toLowerCase(),
      code: params.code,
    }),
  });
}

export async function resendEmailVerification(
  emailOrParams: string | { email: string },
): Promise<{ message: string }> {
  const email =
    typeof emailOrParams === 'string'
      ? emailOrParams
      : emailOrParams.email;

  return request<{ message: string }>('/email/resend', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });
}

export async function resendVerification(
  emailOrParams: string | { email: string },
): Promise<{ message: string }> {
  return resendEmailVerification(emailOrParams);
}

export async function resendPasswordReset(
  emailOrParams: string | { email: string },
): Promise<{ message: string }> {
  return forgotPassword(emailOrParams);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_KEY,
  ]);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();

  return token !== null;
}

export async function getStoredToken(): Promise<string | null> {
  return getToken();
}
