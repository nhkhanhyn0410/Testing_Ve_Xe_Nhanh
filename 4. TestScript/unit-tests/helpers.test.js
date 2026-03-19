const {
  calculateLoyaltyPoints,
} = require('../../1. SourceCode/Ve_Xe_Nhanh_testing/backend/src/utils/helpers');

// UT_HLP_008: calculateLoyaltyPoints - Tính điểm tích lũy
describe('UT_HLP_008: calculateLoyaltyPoints - Tính điểm tích lũy', () => {
  test('100.000 VND → 1000 điểm (1 điểm / 100 VND)', () => {
    expect(calculateLoyaltyPoints(100000)).toBe(1000);
  });

  test('250.000 VND → 2500 điểm', () => {
    expect(calculateLoyaltyPoints(250000)).toBe(2500);
  });

  test('0 VND → 0 điểm', () => {
    expect(calculateLoyaltyPoints(0)).toBe(0);
  });

  test('99 VND → 0 điểm (làm tròn xuống)', () => {
    expect(calculateLoyaltyPoints(99)).toBe(0);
  });

  test('Luôn trả về số nguyên', () => {
    expect(Number.isInteger(calculateLoyaltyPoints(12345))).toBe(true);
  });
});
