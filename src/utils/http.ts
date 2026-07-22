import type { ApiResponse, ApiPaginatedResponse, PaginatedData } from "@/types";

// ─── HTTP STATUS CODES ─────────────────────────────────────────────────────
export const HttpCode = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 25x Business Logic Success
  DATA_SYNCED: 250,
  REPORT_GENERATED: 251,
  EMAIL_SENT: 252,
  BULK_PROCESSED: 253,
  EXPORT_READY: 254,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 4xx Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,

  // 45x Custom Client Errors
  VALIDATION_ERROR: 450,
  DUPLICATE_ENTITY: 451,
  DEPENDENCY_ERROR: 452,
  QUOTA_EXCEEDED: 453,
  INVALID_STATE: 454,
  EXPIRED: 455,

  // 5xx Server Error
  INTERNAL_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  DB_ERROR: 510,
  THIRD_PARTY_ERROR: 511,
} as const;

export type HttpCodeType = (typeof HttpCode)[keyof typeof HttpCode];

// ─── ERROR MESSAGES ────────────────────────────────────────────────────────
export const ErrorMsg: Record<number, string> = {
  [HttpCode.BAD_REQUEST]: "Solicitud inválida",
  [HttpCode.UNAUTHORIZED]: "No autorizado",
  [HttpCode.FORBIDDEN]: "Acceso denegado",
  [HttpCode.NOT_FOUND]: "Recurso no encontrado",
  [HttpCode.CONFLICT]: "Conflicto con el estado actual",
  [HttpCode.UNPROCESSABLE]: "Entidad no procesable",
  [HttpCode.TOO_MANY_REQUESTS]: "Demasiadas solicitudes",
  [HttpCode.VALIDATION_ERROR]: "Error de validación",
  [HttpCode.DUPLICATE_ENTITY]: "Entidad duplicada",
  [HttpCode.DEPENDENCY_ERROR]: "Error de dependencia",
  [HttpCode.QUOTA_EXCEEDED]: "Cuota excedida",
  [HttpCode.INVALID_STATE]: "Estado inválido",
  [HttpCode.EXPIRED]: "Recurso expirado",
  [HttpCode.INTERNAL_ERROR]: "Error interno del servidor",
  [HttpCode.DB_ERROR]: "Error de base de datos",
  [HttpCode.THIRD_PARTY_ERROR]: "Error de servicio externo",
};

// ─── CREATE RESPONSE ──────────────────────────────────────────────────────
export function createResponse<T>(
  data: T | T[],
  code: HttpCodeType = HttpCode.OK,
  msg?: string,
): ApiResponse<T> {
  const dataArray = Array.isArray(data) ? data : [data];
  return {
    code,
    data: dataArray,
    msg: msg || getDefaultMessage(code),
  };
}

export function createPaginatedResponse<T>(
  data: PaginatedData<T>,
  code: HttpCodeType = HttpCode.OK,
  msg?: string,
): ApiPaginatedResponse<T> {
  return {
    code,
    data: data.items,
    msg: msg || getDefaultMessage(code),
    pagination: {
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    },
  };
}

export function createErrorResponse(
  code: HttpCodeType = HttpCode.INTERNAL_ERROR,
  msg?: string,
): ApiResponse<never> {
  return {
    code,
    data: [],
    msg: msg || getDefaultMessage(code),
  };
}

function getDefaultMessage(code: number): string {
  return ErrorMsg[code] || "Error desconocido";
}

// ─── HTTP RESPONSE HELPER (para Astro endpoints) ──────────────────────────
export function jsonResponse<T>(
  body: ApiResponse<T> | ApiPaginatedResponse<T>,
  status: number = body.code,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}
