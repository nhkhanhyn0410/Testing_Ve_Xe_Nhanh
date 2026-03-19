/**
 * Script tạo QR test images cho E2E test
 *
 * Cách dùng:
 *   cd "4. TestScript/e2e-tests"
 *   npm install qrcode   (nếu chưa có)
 *   node tests/data/qr/generate-qr.js
 *
 * Script sẽ tạo 2 file:
 *   - valid-qr.png   : QR chứa text "TEST-VALID-TICKET" (dùng cho test upload UI)
 *   - invalid-qr.png : QR chứa text "INVALID-DATA" (dùng cho test error handling)
 *
 * LƯU Ý: Để test check-in thực sự (TC_TM_QR_002), cần QR chứa dữ liệu
 * encrypted từ hệ thống. Cách lấy:
 *   1. Đặt vé qua frontend → Xem mã QR → Screenshot/save
 *   2. Hoặc gọi API: GET /api/tickets/:ticketId → lấy qrCodeData → generate QR từ string đó
 */

const QRCode = require('qrcode');
const path = require('path');

async function generate() {
  const dir = __dirname;

  // QR với text đơn giản (test upload UI + error path)
  await QRCode.toFile(path.join(dir, 'valid-qr.png'), 'TEST-VALID-TICKET-QR-DATA', {
    width: 300,
    margin: 4,
    errorCorrectionLevel: 'M',
  });
  console.log('Created: valid-qr.png');

  // QR với data không hợp lệ
  await QRCode.toFile(path.join(dir, 'invalid-qr.png'), 'INVALID-CANCELLED-TICKET', {
    width: 300,
    margin: 4,
    errorCorrectionLevel: 'M',
  });
  console.log('Created: invalid-qr.png');

  console.log('\nĐể test check-in thật, cần QR từ vé đã đặt trong hệ thống.');
  console.log('Đặt file QR vào thư mục này với tên: real-ticket-qr.png');
}

generate().catch(console.error);
