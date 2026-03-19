const {
  isValidEmail,
  isValidPhone,
  isValidIdCard,
  isValidAmount,
} = require('../../1. SourceCode/Ve_Xe_Nhanh_testing/backend/src/utils/validators');

// UT_VAL_001: isValidEmail - Xác thực định dạng email
describe('UT_VAL_001: isValidEmail - Xác thực email', () => {
  test('Email hợp lệ chuẩn', () => {
    expect(isValidEmail('user@gmail.com')).toBe(true);
  });

  test('Email hợp lệ với subdomain', () => {
    expect(isValidEmail('admin@mail.vn')).toBe(true);
  });

  test('Email hợp lệ với dấu chấm trong tên', () => {
    expect(isValidEmail('nguyen.van.a@yahoo.com')).toBe(true);
  });

  test('Email thiếu @', () => {
    expect(isValidEmail('usergmail.com')).toBe(false);
  });

  test('Email thiếu domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  test('Email thiếu tên', () => {
    expect(isValidEmail('@gmail.com')).toBe(false);
  });

  test('Email có khoảng trắng', () => {
    expect(isValidEmail('user @gmail.com')).toBe(false);
  });

  test('Chuỗi rỗng', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

// UT_VAL_002: isValidPhone - Xác thực SĐT Việt Nam
describe('UT_VAL_002: isValidPhone - Xác thực SĐT Việt Nam', () => {
  test('SĐT bắt đầu bằng 0, đủ 10 số', () => {
    expect(isValidPhone('0901234567')).toBe(true);
  });

  test('SĐT bắt đầu bằng +84', () => {
    expect(isValidPhone('+84901234567')).toBe(true);
  });

  test('SĐT thiếu số (8 chữ số sau 0)', () => {
    expect(isValidPhone('090123456')).toBe(false);
  });

  test('SĐT dư số (11 chữ số sau 0)', () => {
    expect(isValidPhone('09012345678')).toBe(false);
  });

  test('SĐT chứa chữ cái', () => {
    expect(isValidPhone('090abc4567')).toBe(false);
  });

  test('Chuỗi rỗng', () => {
    expect(isValidPhone('')).toBe(false);
  });
});

// UT_VAL_003: isValidIdCard - Xác thực CMND/CCCD
describe('UT_VAL_004: isValidIdCard - Xác thực CMND/CCCD', () => {
  test('CMND 9 số hợp lệ', () => {
    expect(isValidIdCard('123456789')).toBe(true);
  });

  test('CCCD 12 số hợp lệ', () => {
    expect(isValidIdCard('012345678901')).toBe(true);
  });

  test('Số quá ngắn (8 số)', () => {
    expect(isValidIdCard('12345678')).toBe(false);
  });

  test('Số quá dài (13 số)', () => {
    expect(isValidIdCard('1234567890123')).toBe(false);
  });

  test('Chứa chữ cái', () => {
    expect(isValidIdCard('12345678A')).toBe(false);
  });
});

// UT_VAL_04: isValidAmount - Xác thực số tiền
describe('UT_VAL_04: isValidAmount - Xác thực số tiền', () => {
  test('Số dương → hợp lệ', () => {
    expect(isValidAmount(100000)).toBe(true);
  });

  test('Số 0 → không hợp lệ', () => {
    expect(isValidAmount(0)).toBe(false);
  });

  test('Số âm → không hợp lệ', () => {
    expect(isValidAmount(-50000)).toBe(false);
  });

  test('NaN → không hợp lệ', () => {
    expect(isValidAmount(NaN)).toBe(false);
  });

  test('String → không hợp lệ', () => {
    expect(isValidAmount('100000')).toBe(false);
  });
});
