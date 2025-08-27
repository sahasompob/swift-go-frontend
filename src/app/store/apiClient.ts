type TokenGetter = () => string | null | undefined;
let _getAuthToken: TokenGetter | null = null;

export function setAuthTokenAccessor(fn: TokenGetter) {
  _getAuthToken = fn; // เก็บ "ฟังก์ชัน", ไม่ใช่ค่า snapshot
}

const isServer = typeof window === 'undefined';

type ApiOptions = RequestInit & {
  auth?: boolean;          // เปิด/ปิดการใส่ Authorization อัตโนมัติ
  authToken?: string;      // ให้สิทธิ์ override ใส่ token มาเอง (ใช้บน server/route handler)
};

function buildUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${base}${path}`;
}

async function parseResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // ถ้ามี Authorization มาแล้วจาก caller ไม่ต้องยุ่ง (ให้สิทธิ์สูงสุด)
  const hasAuthHeaderAlready = !!headers.get("Authorization");

  if (options.auth !== false && !hasAuthHeaderAlready) {
    // 1) ถ้า caller ใส่ authToken มา → ใช้อันนี้ (เหมาะกับฝั่ง server)
    let token = options.authToken;

    // 2) ไม่มีก็ลองดึงจาก accessor (ฝั่ง client ที่มี Redux)
    if (!token && _getAuthToken) {
      token = _getAuthToken() ?? undefined;
    }

    // 3) (ทางเลือก) ถ้าอยู่ฝั่ง server และคุณเก็บ token ไว้ใน cookie
    //    ให้เติมโค้ดอ่าน cookie ที่ชั้น call site แล้วส่งผ่าน options.authToken
    //    เพื่อให้ apiClient เป็นกลาง ไม่ผูกกับ next/headers โดยตรง

    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildUrl(path), {
    ...options,
    headers,
    // ถ้า backend คนละ origin และต้องการ cookie ให้เปลี่ยนเป็น 'include'
    credentials: options.credentials ?? "same-origin",
  });

  const data = await parseResponse(res);
  if (!res.ok) {
    const msg = typeof data === "string" ? data : (data?.message ?? `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get:  <T = any>(url: string, init?: ApiOptions) =>
    apiFetch(url, { ...init, method: "GET" }) as Promise<T>,

  post: <T = any>(url: string, body?: any, init?: ApiOptions) =>
    apiFetch(url, {
      ...init,
      method: "POST",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }) as Promise<T>,

  put:  <T = any>(url: string, body?: any, init?: ApiOptions) =>
    apiFetch(url, {
      ...init,
      method: "PUT",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }) as Promise<T>,

  patch:<T = any>(url: string, body?: any, init?: ApiOptions) =>
    apiFetch(url, {
      ...init,
      method: "PATCH",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }) as Promise<T>,

  del:  <T = any>(url: string, init?: ApiOptions) =>
    apiFetch(url, { ...init, method: "DELETE" }) as Promise<T>,
};
