# Test Cases - Website Ve Xe Nhanh

**Nhom 11** | Ngay cap nhat: 15/03/2026

## 1. Dang ky / Dang nhap Customer

| TC_ID | Mo ta | Dieu kien truoc | Buoc thuc hien | Ket qua mong doi | Do uu tien |
|-------|-------|-----------------|----------------|-------------------|------------|
| TC_AUTH_001 | Mo trang dang nhap | Truy cap trang chu | 1. Click "Dang nhap" | Hien thi form dang nhap (email, password, nut submit) | 1 |
| TC_AUTH_002 | Dang nhap thanh cong | Co tai khoan hop le | 1. Nhap email hop le 2. Nhap password hop le 3. Click "Dang nhap" | Chuyen huong ve trang chu, hien thi ten nguoi dung | 1 |
| TC_AUTH_003 | Dang nhap sai mat khau | Co tai khoan hop le | 1. Nhap email hop le 2. Nhap password sai 3. Click "Dang nhap" | Hien thong bao loi | 1 |
| TC_AUTH_004 | Dang nhap de trong | Trang dang nhap | 1. Khong nhap gi 2. Click "Dang nhap" | Hien thong bao yeu cau nhap thong tin | 1 |
| TC_AUTH_005 | Dang nhap tai khoan khong ton tai | Trang dang nhap | 1. Nhap email khong ton tai 2. Nhap password bat ky 3. Click "Dang nhap" | Hien thong bao loi, o lai trang dang nhap | 1 |

## 2. Tim kiem chuyen xe

| TC_ID | Mo ta | Dieu kien truoc | Buoc thuc hien | Ket qua mong doi | Do uu tien |
|-------|-------|-----------------|----------------|-------------------|------------|
| TC_SEARCH_001 | Tim chuyen xe thanh cong | Truy cap /trips | 1. Chon diem di 2. Chon diem den 3. Chon ngay 4. Click "Tim chuyen xe" | Hien danh sach chuyen xe phu hop | 1 |
| TC_SEARCH_002 | Tim chuyen khong co ket qua | Truy cap /trips | 1. Chon tuyen khong co chuyen 2. Click "Tim chuyen xe" | Hien thong bao "Khong tim thay" | 1 |

## 3. Dat ve xe

| TC_ID | Mo ta | Dieu kien truoc | Buoc thuc hien | Ket qua mong doi | Do uu tien |
|-------|-------|-----------------|----------------|-------------------|------------|
| TC_BOOKING_001 | Dat ve hoan chinh (tien mat) | Da dang nhap, co chuyen xe | 1. Tim chuyen xe 2. Chon chuyen 3. Chon ghe 4. Chon diem don/tra 5. Nhap thong tin hanh khach 6. Chon thanh toan tien mat 7. Xac nhan | Dat ve thanh cong, chuyen den trang thanh cong | 1 |
