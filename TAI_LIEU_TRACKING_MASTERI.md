# TÀI LIỆU HỆ THỐNG TRACKING & ĐO LƯỜNG
**Dự án:** Masteri Grand Coast
**Cập nhật lần cuối:** Tháng 05/2026

Tài liệu này lưu trữ toàn bộ cấu trúc kỹ thuật về hệ thống đo lường quảng cáo (Tracking) và tự động hóa (Automation) đã được thiết lập cho dự án. File này được lưu chung với mã nguồn để có thể sử dụng lại hoặc bàn giao cho người khác (hoặc AI khác) đọc và hiểu ngay hệ thống.

---

## 1. Cấu hình định danh (IDs)
Các mã theo dõi chính đang được nhúng trực tiếp vào thẻ `<head>` của `index.html`:
- **Google Tag Manager (GTM) ID:** `GTM-5982629K`
- **Google Ads Conversion ID:** `AW-18146689821`
- **Google Ads Conversion Label:** `g0UqCJydmqkcEJ2Ggs1D`
- **Meta Pixel ID:** `YOUR_PIXEL_ID` *(Lưu ý: Cần thay mã thật vào file index.html)*

---

## 2. Cấu trúc Sự kiện (Event Tracking)

Hệ thống được thiết kế để bắt sự kiện bằng Code chủ động (Hard-coded) trong `script.js`, **tuyệt đối không dùng cơ chế bắt click tự động** để tránh tính nhầm tiền quảng cáo.

### 2.1. Sự kiện Chuyển đổi chính (Core Conversion): Điền Form Thành Công
Chỉ kích hoạt khi khách hàng nhấn nút gửi và form hợp lệ (không dính Honeypot spam).

**Cơ chế truyền dữ liệu (DataLayer):**
```javascript
dataLayer.push({
    'event': 'generate_lead',
    'customer_name': name,     // Phục vụ Enhanced Conversions
    'customer_phone': phone    // Phục vụ Enhanced Conversions
});
```

**Kích hoạt Facebook Pixel:**
```javascript
fbq('track', 'Lead');
```

### 2.2. Sự kiện Chuyển đổi vi mô (Micro-conversions)
Theo dõi hành vi người dùng nhấp vào nút Zalo hoặc Hotline để phục vụ tệp Retargeting.

- **Nút Zalo:**
  - `fbq('trackCustom', 'Click_Zalo')`
  - `dataLayer.push({'event': 'Click_Zalo'})`
- **Nút Hotline:**
  - `fbq('trackCustom', 'Click_Hotline')`
  - `dataLayer.push({'event': 'Click_Hotline'})`

---

## 3. Cấu hình Google Tag Manager (GTM)

Trên nền tảng [tagmanager.google.com](https://tagmanager.google.com/), đã thiết lập 3 thành phần cốt lõi:

1. **Trigger (Cò súng) - `Trigger Form`:**
   - Loại: Sự kiện tùy chỉnh (Custom Event)
   - Tên sự kiện: `generate_lead`

2. **Tag (Thẻ) - `Linker`:**
   - Loại: Trình liên kết chuyển đổi (Conversion Linker)
   - Kích hoạt: All Pages

3. **Tag (Thẻ) - `Tag Chuyen Doi`:**
   - Loại: Theo dõi chuyển đổi trên Google Ads
   - ID: `AW-18146689821`
   - Nhãn: `g0UqCJydmqkcEJ2Ggs1D`
   - Kích hoạt: Chọn `Trigger Form`

---

## 4. Tự động hóa & Thông báo (Automation)

Khi có khách điền form, dữ liệu không chỉ gửi cho hệ thống quảng cáo mà còn chạy ngầm về cơ sở dữ liệu và điện thoại qua luồng sau:
1. Form được submit qua hàm `fetch()` tới Google Apps Script (GAS).
2. Mã GAS lưu thông tin khách hàng (Tên, SĐT, Nhu cầu) vào Google Sheets.
3. Mã GAS đồng thời bắn tín hiệu API qua Telegram Bot.
   - **Telegram Token:** Đã cấu hình ẩn trong GAS.
   - **Chat ID nhận tin:** `1707824385`

---

## Hướng dẫn tái sử dụng cho hệ thống/AI khác
Nếu anh chuyển sang một tài khoản AI khác hoặc một máy tính khác, anh chỉ cần tải file này (`TAI_LIEU_TRACKING_MASTERI.md`) lên và nói với AI: 
*"Đây là cấu trúc Tracking hiện tại của dự án. Hãy đọc hiểu và tiếp tục phát triển/tối ưu dựa trên nền tảng này."* 
AI sẽ ngay lập tức nắm được 100% ngữ cảnh kỹ thuật mà không cần phải phân tích lại từ đầu.
