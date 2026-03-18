**Website Vé xe nhanh**

**Test Plan**

**Ngày cập nhật: 23/01/2026**

**Submitted By: Nhóm 11**


[**1. Giới thiệu [4](#giới-thiệu)**](#giới-thiệu)

[**1.1. Mục đích [4](#mục-đích)**](#mục-đích)

[**1.2. Tổng quan [4](#tổng-quan)**](#tổng-quan)

[**1.3. Phạm vi nghiên cứu [5](#phạm-vi-nghiên-cứu)**](#phạm-vi-nghiên-cứu)

[**1.4. Tài liệu liên quan [5](#tài-liệu-liên-quan)**](#tài-liệu-liên-quan)

[**1.5. Liệt kê các rủi ro [5](#liệt-kê-các-rủi-ro)**](#liệt-kê-các-rủi-ro)

[**2. Tài nguyên [7](#tài-nguyên)**](#tài-nguyên)

[**2.1. Nhân lực [7](#nhân-lực)**](#nhân-lực)

[**2.2. Phần cứng [7](#phần-cứng)**](#phần-cứng)

[**2.3. Phần mềm [7](#phần-mềm)**](#phần-mềm)

[**2.4. Công cụ kiểm thử [8](#công-cụ-kiểm-thử)**](#công-cụ-kiểm-thử)

[**3. Phạm vi kiểm thử [9](#phạm-vi-kiểm-thử)**](#phạm-vi-kiểm-thử)

[**4. Lịch trình thực hiện [10](#lịch-trình-thực-hiện)**](#lịch-trình-thực-hiện)

[**5. Các sản phẩm [14](#các-sản-phẩm)**](#các-sản-phẩm)

# 1. Giới thiệu {#giới-thiệu}

## 1.1. Mục đích {#mục-đích}

> Mục đích của tài liệu Test Plan này là chuẩn hóa kế hoạch kiểm thử tự động End-to-End (E2E) cho hệ thống Vé Xe Nhanh bằng cách sử dụng framework CodeceptJS, nhằm đảm bảo các chức năng chính của website hoạt động đúng yêu cầu, ổn định và đáng tin cậy trước khi chính thức đưa vào sử dụng. Cụ thể, kế hoạch hướng đến việc xây dựng bộ kiểm thử tự động E2E cho các luồng nghiệp vụ cốt lõi, tự động hóa kiểm thử các chức năng quan trọng như tìm kiếm chuyến xe, đặt vé, thanh toán và quản lý vé, qua đó giúp phát hiện lỗi sớm trong quá trình phát triển cũng như tạo ra các báo cáo chi tiết phản ánh kết quả kiểm thử.

## 1.2. Tổng quan {#tổng-quan}

Vé Xe Nhanh là hệ thống đặt vé xe khách trực tuyến toàn diện, được xây dựng theo kiến trúc với.  
Công nghệ:

- Frontend: React 18.2.0 + Vite 5.0.0, Ant Design 5.11.0, Tailwind CSS

- Backend: Node.js + Express 4.18.2

- Database: MongoDB + Redis

- Testing Framework: CodeceptJS + Playwright

Hệ thống hỗ trợ 4 vai trò chính:

- Customer/Guest:

<!-- -->

- Tìm kiếm, đặt vé, thanh toán

- Quản lý/tra cứu vé

- Đánh giá chuyến đi

- Tích điểm thưởng

<!-- -->

- Bus Operator (Nhà xe):

  - Quản lý tuyến đường, xe, nhân viên

  - Tạo lịch trình chuyến xe

  - Thiết lập giá vé và voucher

  - Xem báo cáo doanh thu

<!-- -->

- Trip Manager (Quản lý chuyến):

  - Quét mã QR xác thực vé

  - Check-in hành khách

  - Quản lý danh sách hành khách

  - Cập nhật trạng thái chuyến

<!-- -->

- Admin (Quản trị hệ thống):

  - Quản lý tổng hệ thống

  - Duyệt đăng ký nhà xe

  - Xử lý khiếu nại

## 1.3. Phạm vi nghiên cứu {#phạm-vi-nghiên-cứu}

- End-to-End (E2E) Testing: Kiểm thử toàn bộ luồng nghiệp vụ từ đầu đến cuối

- Functional Testing: Kiểm thử chức năng của ứng dụng

- Automated Testing: Tự động hóa với CodeceptJS

## 1.4. Tài liệu liên quan {#tài-liệu-liên-quan}

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 33%" />
<col style="width: 30%" />
<col style="width: 27%" />
</colgroup>
<tbody>
<tr class="odd">
<td><blockquote>
<p><strong>STT</strong></p>
</blockquote></td>
<td><blockquote>
<p><strong>Tên tài liệu</strong></p>
</blockquote></td>
<td><blockquote>
<p><strong>Nguồn</strong></p>
</blockquote></td>
<td><blockquote>
<p><strong>Ghi chú</strong></p>
</blockquote></td>
</tr>
<tr class="even">
<td><blockquote>
<p>1</p>
</blockquote></td>
<td><blockquote>
<p>Tài liệu phân tích &amp; thiết kế (Nhóm 10)</p>
</blockquote></td>
<td><blockquote>
<p><a href="https://docs.google.com/document/d/1u8WdXKEot9Oe8Z_62209vl4jEsClGqy2/edit?usp=sharing&amp;ouid=112698480963072280808&amp;rtpof=true&amp;sd=true"><u>https://docs.google.com/document/d/1u8WdXKEot9Oe8Z_62209vl4jEsClGqy2/edit?usp=sharing&amp;ouid=112698480963072280808&amp;rtpof=true&amp;sd=true</u></a></p>
</blockquote></td>
<td>Yêu cầu chức năng</td>
</tr>
<tr class="odd">
<td><blockquote>
<p>2</p>
</blockquote></td>
<td>CodeceptJS Documentation</td>
<td><blockquote>
<p><a href="https://codecept.io/basics/">https://codecept.io/basics/</a></p>
</blockquote></td>
<td>Hướng dẫn sử dụng</td>
</tr>
<tr class="even">
<td><blockquote>
<p>3</p>
</blockquote></td>
<td>Playwright Helper<br />
Documentation</td>
<td><blockquote>
<p><a href="https://codecept.io/playwright/">https://codecept.io/playwright/</a></p>
</blockquote></td>
<td><blockquote>
<p>Hướng dẫn sử dụng</p>
</blockquote></td>
</tr>
</tbody>
</table>

## 1.5. Liệt kê các rủi ro {#liệt-kê-các-rủi-ro}

**Mức độ ảnh hưởng:**

<table>
<colgroup>
<col style="width: 38%" />
<col style="width: 34%" />
<col style="width: 27%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>Rủi ro<br />
(Risk)</strong></td>
<td><strong>Khả năng có thể xảy ra (Probability)</strong></td>
<td><strong>Mức độ ảnh hưởng (Impact)</strong></td>
</tr>
<tr class="even">
<td>Không đủ thời gian thực hiện</td>
<td>Trung bình</td>
<td>Cao</td>
</tr>
<tr class="odd">
<td>Người thực hiện chưa nắm rõ yêu cầu / nghiệp vụ hệ thống)</td>
<td>Trung bình</td>
<td>Trung bình</td>
</tr>
<tr class="even">
<td>Thời gian bắt đầu kiểm thử bị trễ so với kế hoạch</td>
<td>Cao</td>
<td>Cao</td>
</tr>
<tr class="odd">
<td>Không đủ thời gian để thực hiện đầy đủ các hạng mục test</td>
<td>Trung bình</td>
<td>Cao</td>
</tr>
<tr class="even">
<td>Thiếu dữ liệu test (chuyến xe, ghế, voucher, thanh toán sandbox)</td>
<td>Cao</td>
<td>Trung bình</td>
</tr>
<tr class="odd">
<td>Lỗi đồng bộ ghế real-time khi nhiều người đặt cùng lúc</td>
<td>Trung bình</td>
<td>Cao</td>
</tr>
<tr class="even">
<td>Môi trường test không ổn định</td>
<td>Cao</td>
<td>Cao</td>
</tr>
</tbody>
</table>

> **Chiến lược xử lý:**

<table>
<colgroup>
<col style="width: 27%" />
<col style="width: 38%" />
<col style="width: 34%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>Rủi ro<br />
(Risk)</strong></td>
<td><strong>Chiến lược giảm thiểu (Mitigation Strategy)</strong></td>
<td><strong>Dự phòng (Contingency)</strong></td>
</tr>
<tr class="even">
<td>Không đủ thời gian thực hiện</td>
<td>Chuẩn bị thiết bị/môi trường từ sớm, phân công rõ người phụ trách từng module</td>
<td>Dùng thiết bị cá nhân, gộp lịch test, ưu tiên test chức năng chính</td>
</tr>
<tr class="odd">
<td>Người thực hiện chưa nắm rõ yêu cầu / nghiệp vụ)</td>
<td>Review tài liệu yêu cầu, họp thống nhất flow nghiệp vụ trước khi viết test case</td>
<td>Nhờ hỗ trợ từ nhóm leader, bổ sung checklist nhanh</td>
</tr>
<tr class="even">
<td>Thời gian bắt đầu kiểm thử bị trễ so với kế hoạch</td>
<td>Bám sát tiến độ lập trình, áp dụng kiểm thử sớm theo từng chức năng hoàn thành</td>
<td>Tập trung Smoke test + Core flow, giảm bớt phần ít quan trọng</td>
</tr>
<tr class="odd">
<td>Không đủ thời gian thực hiện đầy đủ các hạng mục test</td>
<td>Ưu tiên luồng quan trọng (luồng đặt vé – thanh toán – xuất vé),</td>
<td>Làm thêm giờ, rút gọn test 3</td>
</tr>
<tr class="even">
<td>Thiếu dữ liệu test (chuyến xe, ghế, voucher, sandbox)</td>
<td>Chuẩn bị seed data &amp; tài khoản test trước, tạo bộ dữ liệu mẫu</td>
<td>Dùng dữ liệu giả lập / tạo tay theo kịch bản</td>
</tr>
<tr class="odd">
<td>Lỗi đồng bộ ghế real-time khi nhiều user đặt</td>
<td>Test concurrency với 2–5 user, kiểm tra lock ghế và timeout giữ chỗ</td>
<td>Giới hạn user test đồng thời, test theo từng bước thủ công</td>
</tr>
</tbody>
</table>

# 2. Tài nguyên  {#tài-nguyên}

## 2.1. Nhân lực {#nhân-lực}

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>Vai trò</strong></td>
<td><strong>Thành viên</strong></td>
<td><strong>Nhiệm vụ</strong></td>
</tr>
<tr class="even">
<td>Test Manager</td>
<td><blockquote>
<p>Nguyễn Hồng Khanh (Leader)</p>
</blockquote></td>
<td><p>- Lập kế hoạch kiểm thử</p>
<p>- Quản lý tiến độ</p>
<p>- Review test cases</p>
<p>- Tạo báo cáo tổng hợp</p></td>
</tr>
<tr class="odd">
<td>Tester</td>
<td>Nguyễn Xuân Trường</td>
<td>Thiết kế các testcase và thực thi các testcase (có chắc là thiết kế được không)</td>
</tr>
<tr class="even">
<td>Tester</td>
<td>Hồ Nguyễn Phúc Thông</td>
<td>Thiết kế các testcase và thực thi các testcase</td>
</tr>
</tbody>
</table>

## 2.2. Phần cứng {#phần-cứng}

|              |                                                                            |                  |
|--------------|----------------------------------------------------------------------------|------------------|
| **Thiết bị** | **Cấu hình**                                                               | **Hệ điều hành** |
| Laptop       | CPU i5/Ryzen 5 trở lên, RAM ≥ 8GB, SSD ≥ 256GB, có Wi-Fi ổn định ≥ 20 Mbps | Window 11        |
| Điện thoại   | Android 10+ , RAM ≥ 3GB, có 4G/5G hoặc Wi-Fi ổn định                       | Android          |

## 2.3. Phần mềm {#phần-mềm}

|                        |               |                    |                         |
|------------------------|---------------|--------------------|-------------------------|
| **Tên phần mềm**       | **Phiên bản** | **Loại**           | **Mục đích**            |
| Node.js                | 18.0.0        | Runtime            | Chạy CodeceptJS         |
| npm                    | 9.0.0         | Package Manager    | Quản lý dependencies    |
| CodeceptJS             | Latest 3.5.0) | Test Framework     | Framework kiểm thử E2E  |
| Playwright             | Latest        | Browser Automation | Driver cho CodeceptJS   |
| Google Chrome          | Latest v120)  | Trình duyệt web    | Browser test chính      |
| Firefox                | Latest        | Trình duyệt web    | Cross-browser test      |
| Visual Studio Code     | Latest        | IDE / Code Editor  | Viết test code          |
| Git                    | Latest 2.30)  | Version Control    | Quản lý source code     |
| Microsoft Office Word  | 2019/2021/365 | Soạn thảo tài liệu | Viết tài liệu test plan |
| Microsoft Office Excel | 2019/2021/365 | Bảng tính          | Quản lý test case       |
| Postman                | Latest        | API Testing        | Test API (hỗ trợ)       |

## 2.4. Công cụ kiểm thử {#công-cụ-kiểm-thử}

|                      |                           |                      |               |                       |
|----------------------|---------------------------|----------------------|---------------|-----------------------|
| **Hoạt động**        | **Công cụ**               | **Nhà cung cấp**     | **Phiên bản** | **Ghi chú**           |
| E2E Test Framework   | CodeceptJS                | CodeceptJS           | Latest        | Framework chính       |
| Browser Automation   | Playwright                | Microsoft            | Latest        | Helper cho CodeceptJS |
| Quản lý nhiệm vụ     | Google Sheet / Jira       | Google / Atlassian   | Latest        | Track công việc       |
| Quản lý test case    | Excel / Google Sheet      | Microsoft / Google   | Latest        | Lưu trữ test cases    |
| Quản lý lỗi (Defect) | Excel                     | Microsoft / GitHub   | Latest        | Báo cáo bugs          |
| Viết tài liệu        | Microsoft Word / Markdown | Microsoft            | 2019/2021     | Test Plan, Reports    |
| Test Reporting       | Allure Report             | Allure               | Latest        | Báo cáo chi tiết      |
| Screenshot/Video     | Playwright built-in       | Microsoft            | Latest        | Capture khi test fail |
| CI/CD                | GitHub Actions            | GitHub               | Latest        | Tự động chạy test     |
| API Testing (hỗ trợ) | Postman / REST Helper     | Postman / CodeceptJS | Latest        | Test API endpoints    |
| Database GUI         | MongoDB Compass           | MongoDB              | Latest        | Xem test data         |
| Code Editor          | VS Code + Extensions      | Microsoft            | Latest        | Viết test code        |

# 3. Phạm vi kiểm thử {#phạm-vi-kiểm-thử}

|         |                |                                                                          |                      |
|---------|----------------|--------------------------------------------------------------------------|----------------------|
| **STT** | **Độ ưu tiên** | **Nội dung**                                                             | **Loại test**        |
| 1       | 1              | Đăng ký/Đăng nhập Customer (email)                                      | Functional, E2E      |
| 2       | 1              | Tìm kiếm chuyến xe + lọc/sắp xếp                                        | Functional, GUI      |
| 3       | 1              | Xem chi tiết chuyến + sơ đồ ghế real-time                               | Functional, GUI      |
| 4       | 1              | Đặt vé (chọn ghế, nhập thông tin hành khách, áp dụng voucher)           | Functional, E2E      |
| 5       | 1              | Thanh toán (VNPay/Tiền mặt)                                             | Functional, E2E      |
| 6       | 1              | Xem vé điện tử & mã QR                                                  | Functional, GUI      |
| 7       | 1              | Tra cứu vé & xác thực OTP (Guest, sử dụng demo OTP: 123456)            | Functional, E2E      |
| 8       | 2              | Hủy vé                                                                   | Functional, E2E      |
| 9       | 2              | Khiếu nại (tạo, theo dõi, đánh giá mức độ hài lòng)                     | Functional           |
| 10      | 2              | Quản lý hồ sơ cá nhân (cập nhật thông tin, đổi mật khẩu, avatar)        | Functional           |
| 11      | 2              | Tích điểm thưởng (xem điểm, lịch sử, đổi điểm)                         | Functional           |
| 12      | 2              | Operator: Đăng ký/Đăng nhập nhà xe                                      | Functional, E2E      |
| 13      | 2              | Operator: Quản lý tuyến đường (CRUD, điểm đón/trả)                      | Functional           |
| 14      | 2              | Operator: Quản lý xe (CRUD, trạng thái)                                 | Functional           |
| 15      | 2              | Operator: Quản lý nhân viên (CRUD, phân quyền)                          | Functional           |
| 16      | 2              | Operator: Quản lý lịch trình chuyến xe (tạo, chuyến lặp lại, giá động) | Functional           |
| 17      | 2              | Operator: Quản lý voucher (CRUD, kích hoạt/vô hiệu)                    | Functional           |
| 18      | 2              | Operator: Xem báo cáo doanh thu và thống kê                             | Functional, GUI      |
| 19      | 3              | Trip Manager: Đăng nhập                                                  | Functional           |
| 20      | 3              | Trip Manager: Quét QR xác thực vé + check-in hành khách                 | Functional, E2E      |
| 21      | 3              | Trip Manager: Cập nhật trạng thái chuyến (bắt đầu/hoàn thành)           | Functional           |
| 22      | 3              | Admin: Đăng nhập                                                         | Functional           |
| 23      | 3              | Admin: Quản lý nhà xe (duyệt/từ chối/tạm ngưng)                        | Functional           |
| 24      | 3              | Admin: Quản lý người dùng (xem, khóa/mở khóa)                          | Functional           |
| 25      | 3              | Admin: Quản lý khiếu nại (phân công, xử lý, đóng)                      | Functional           |
| 26      | 3              | Admin: Quản lý nội dung (Banner, Blog, FAQ)                             | Functional           |

# 4. Lịch trình thực hiện {#lịch-trình-thực-hiện}

|                                                                                       |                         |               |             |              |
|---------------------------------------------------------------------------------------|-------------------------|---------------|-------------|--------------|
| **Công việc**                                                                         | **Người thực hiện**     | **Thời gian** | **Bắt đầu** | **Kết thúc** |
| Lập kế hoạch kiểm thử + chuẩn bị mẫu viết ca kiểm thử và mẫu báo lỗi                  | Khanh (Leader)          | 1 ngày        | 24/01/2026  | 24/01/2026   |
| Chuẩn bị dữ liệu kiểm thử (tài khoản, tuyến xe, voucher, phương thức thanh toán test) | Khanh + Thông + Trường  | 0.5 ngày      | 25/01/2026  | 25/01/2026   |
| Viết Testcase chức năng Đăng ký/Đăng nhập (1)                                         | Thông                   | 0.5 ngày      | 25/01/2026  | 25/01/2026   |
| Viết Testcase chức năng Tìm kiếm chuyến xe (2)                                        | Thông                   | 0.5 ngày      | 25/01/2026  | 25/01/2026   |
| Viết Testcase chức năng Xem chi tiết chuyến + sơ đồ ghế theo thời gian thực (3)       | Trường                  | 1 ngày        | 25/01/2026  | 25/01/2026   |
| Viết Testcase chức năng Đặt vé (4)                                                    | Thông                   | 1 ngày        | 26/01/2026  | 26/01/2026   |
| Viết Testcase chức năng Thanh toán (5)                                                | Trường                  | 0.5 ngày      | 26/01/2026  | 26/01/2026   |
| Viết Testcase chức năng Nhận vé điện tử QR + gửi Email (6)                            | Trường                  | 0.5 ngày      | 26/01/2026  | 26/01/2026   |
| Viết Testcase chức năng Tra cứu vé & OTP (7)                                          | Thông                   | 0.5 ngày      | 27/01/2026  | 27/01/2026   |
| Viết Testcase chức năng Hủy vé(8)                                                     | Thông                   | 0.5 ngày      | 27/01/2026  | 27/01/2026   |
| Viết Testcase chức năng Quản trị viên: quản lý tuyến/xe/nhân viên/lịch trình (9)      | Trường                  | 0.5 ngày      | 27/01/2026  | 27/01/2026   |
| Viết Testcase chức năng Nhân viên điều phối: quét QR, xác nhận lên xe (10)            | Trường                  | 0.5 ngày      | 27/01/2026  | 27/01/2026   |
| Kiểm tra lại Testcase + chốt phạm vi + lập danh sách kiểm tra nhanh                   | Khanh (Leader)          | 0.5 ngày      | 27/01/2026  | 27/01/2026   |
| Kiểm thử nhanh toàn hệ thống (kiểm tra hoạt động cơ bản)                              | Cả nhóm                 | 1 ngày        | 28/01/2026  | 28/01/2026   |
| Kiểm thử chức năng mức ưu tiên cao: Đăng nhập + Tìm kiếm + Đặt vé (1,2,4)             | Thông                   | 1 ngày        | 29/01/2026  | 29/01/2026   |
| Kiểm thử chức năng mức ưu tiên cao: Sơ đồ ghế + Thanh toán + Vé điện tử (3,5,6)       | Trường                  | 1 ngày        | 29/01/2026  | 29/01/2026   |
| Ghi nhận lỗi + cập nhật kết quả kiểm thử + kiểm tra lại sau khi sửa lỗi               | Khanh + Thông + Trường  | 1 ngày        | 30/01/2026  | 30/01/2026   |
| Kiểm thử chức năng: Tra cứu vé & OTP (7)                                              | Thông                   | 0.5 ngày      | 31/01/2026  | 31/01/2026   |
| Kiểm thử chức năng: Hủy/Đổi vé + hoàn tiền (8)                                        | Thông                   | 0.5 ngày      | 31/01/2026  | 31/01/2026   |
| Kiểm thử chức năng: Trang quản trị (9)                                                | Trường                  | 0.5 ngày      | 31/01/2026  | 31/01/2026   |
| Kiểm thử chức năng: Quét QR check-in (10)                                             | Trường                  | 0.5 ngày      | 31/01/2026  | 31/01/2026   |
| Tổng hợp danh sách lỗi theo mức độ nghiêm trọng + theo dõi xử lý lỗi                  | Khanh (Leader)          | 1 ngày        | 01/02/2026  | 01/02/2026   |
| Kiểm thử lại toàn bộ hệ thống sau khi sửa lỗi (kiểm thử hồi quy)                      | Cả nhóm (Khanh quản lý) | 1 ngày        | 02/02/2026  | 02/02/2026   |
| Tổng hợp kết quả kiểm thử + lập báo cáo cuối + bàn giao                               | Khanh (Leader)          | 1 ngày        | 03/02/2026  | 03/02/2026   |

# 5. Các sản phẩm {#các-sản-phẩm}

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 25%" />
<col style="width: 17%" />
<col style="width: 25%" />
<col style="width: 21%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>STT</strong></th>
<th><strong>Sản phẩm</strong></th>
<th><strong>Ngày bàn giao</strong></th>
<th><strong>Người bàn giao</strong></th>
<th><strong>Người nhận</strong></th>
</tr>
<tr class="odd">
<th><blockquote>
<p>1</p>
</blockquote></th>
<th><blockquote>
<p>&lt;Test Plan&gt;</p>
</blockquote></th>
<th><blockquote>
<p>26/01/2026</p>
</blockquote></th>
<th><p>Thông, Trường,</p>
<p>Khanh</p></th>
<th><blockquote>
<p>Nguyễn Hồng Khanh</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><blockquote>
<p>2</p>
</blockquote></td>
<td><blockquote>
<p>&lt;Test cases&gt;</p>
</blockquote></td>
<td>10/02/2026</td>
<td><p>Thông, Trường,</p>
<p>Khanh</p></td>
<td><blockquote>
<p>Nguyễn Hồng Khanh</p>
</blockquote></td>
</tr>
<tr class="even">
<td><blockquote>
<p>3</p>
</blockquote></td>
<td><blockquote>
<p>&lt;Defect reports&gt;</p>
</blockquote></td>
<td>28/02/2026</td>
<td>Khanh</td>
<td><blockquote>
<p>Nguyễn Hồng Khanh</p>
</blockquote></td>
</tr>
</tbody>
</table>
