/**
 * @fileoverview Definisi tipe data untuk response API.
 * @location src/shared/types/apiResponse.ts
 * @description Menyediakan interface untuk struktur data response API yang 
 *              berisi status, data, dan pesan.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}