# Test API Authentication

## 1. Login (untuk mendapatkan token)

POST http://localhost:9090/api/login
Content-Type: application/json

{
"email": "iqsanfm@gmail.com",
"password": "password_user_ini"
}

### Response akan berisi:

```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": "87d65205-0bd1-4628-b613-76b62eee3bb0",
      "full_name": "Iqsan Faisal",
      "email": "iqsanfm@gmail.com",
      "role": "ADMIN"
    }
  }
}
```

---

## 2. Register User Baru

POST http://localhost:9090/api/register
Content-Type: application/json

{
"full_name": "Bidan Test",
"email": "bidan@test.com",
"password": "password123",
"phone_number": "081234567890",
"address": "Jl. Test No. 123",
"position_user": "bidan_praktik",
"village_id": "uuid-village-id",
"role": "USER"
}

---

## 3. Get Profile (perlu token)

GET http://localhost:9090/api/profile
Authorization: Bearer <TOKEN_DARI_LOGIN>

---

## 4. Update Profile (perlu token)

PUT http://localhost:9090/api/profile
Authorization: Bearer <TOKEN_DARI_LOGIN>
Content-Type: application/json

{
"full_name": "Nama Baru",
"phone_number": "081234567890",
"address": "Alamat Baru",
"password": "password_baru_optional"
}

---

## 5. Get Health Data (perlu token)

GET http://localhost:9090/api/health-data
Authorization: Bearer <TOKEN_DARI_LOGIN>

### Dengan filter:

GET http://localhost:9090/api/health-data?status_verifikasi=PENDING&jenis_data=Ibu%20Hamil
Authorization: Bearer <TOKEN_DARI_LOGIN>

---

## 6. Create Health Data (perlu token)

POST http://localhost:9090/api/health-data
Authorization: Bearer <TOKEN_DARI_LOGIN>
Content-Type: application/json

{
"practice_id": "uuid-practice-id",
"nama_pasien": "Pasien Test",
"umur_pasien": 25,
"jenis_data": "Ibu Hamil",
"catatan": "Catatan pemeriksaan",
"tanggal_periksa": "2026-02-07T14:00:00Z"
}

---

## Cara Testing dengan REST Client (VS Code Extension):

1. Install extension "REST Client" di VS Code
2. Buka file ini
3. Klik "Send Request" di atas setiap request
4. Copy token dari response login
5. Paste token ke header Authorization di request lainnya

---

## Cara Testing dengan Postman/Thunder Client:

1. **Login:**
   - Method: POST
   - URL: http://localhost:9090/api/login
   - Body (JSON):
     ```json
     {
       "email": "iqsanfm@gmail.com",
       "password": "password_anda"
     }
     ```
   - Copy token dari response

2. **Get Health Data:**
   - Method: GET
   - URL: http://localhost:9090/api/health-data
   - Headers:
     - Key: Authorization
     - Value: Bearer <PASTE_TOKEN_DI_SINI>

---

## Error Responses:

### 401 Unauthorized (token tidak ada/tidak valid):

```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu."
}
```

### 403 Forbidden (token expired):

```json
{
  "success": false,
  "message": "Token sudah kadaluarsa. Silakan login kembali."
}
```

### 403 Forbidden (user inactive):

```json
{
  "success": false,
  "message": "Akun Anda tidak aktif. Hubungi administrator."
}
```
