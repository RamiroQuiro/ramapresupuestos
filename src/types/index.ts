// ─── HTTP RESPONSE ─────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  code: number;
  data: T[];
  msg: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T> {
  pagination: Omit<PaginatedData<T>, "items">;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  clubId: string;
  roleId: string | null;
  status: string;
}

export interface SessionInfo {
  user: AuthUser;
  club: Pick<Club, "id" | "name" | "slug" | "currency"> | null;
}
