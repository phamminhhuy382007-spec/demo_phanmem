# TODO — Senspices: Quản lý chế biến quế

## Dashboard và dữ liệu mẫu
- [x] Trên cùng một màn hình, hiển thị các thẻ thống kê nhanh: Tổng kg nguyên liệu nhập, Tổng kg thành phẩm thu được và Tỷ lệ hao hụt trung bình (%).
- [x] Lưu và đọc danh sách lô trực tiếp bằng localStorage; tự khởi tạo 3 lô dữ liệu mẫu thực tế từ Yên Bái và Hà Nam khi mở ứng dụng lần đầu.

## Tạo và tính toán lô chế biến
- [x] Form tạo lô mới gồm Mã lô, Nhà máy Yên Bái/Hà Nam, Ngày nhập, khối lượng nguyên liệu đầu vào và độ ẩm ban đầu.
- [x] Cho nhập sản lượng thành phẩm theo ba loại: Quế ống điếu, Quế vụn và Bột quế.
- [x] Tự động tính theo thời gian thực Tổng thành phẩm, Số kg hao hụt và Tỷ lệ hao hụt ngay khi người dùng nhập số liệu.
- [x] Kiểm tra dữ liệu trước khi lưu, gồm trường bắt buộc, giá trị số không âm và cảnh báo khi tổng thành phẩm vượt khối lượng đầu vào.

## Lịch sử và xuất file
- [x] Bảng lịch sử hiển thị đầy đủ dữ liệu các lô đã nhập cùng số liệu thành phẩm, hao hụt và tỷ lệ hao hụt.
- [x] Trạng thái hao hụt được thể hiện trực quan, tô đỏ cảnh báo đối với lô có tỷ lệ hao hụt lớn hơn 15%.
- [x] Có nút xuất toàn bộ lịch sử lô thành file CSV tương thích Excel và tải trực tiếp về máy.

## Giao diện và khả năng sử dụng
- [x] Giao diện responsive bằng tiếng Việt, hiện đại và tối giản, tối ưu cho điện thoại và máy tính; dùng nút lớn dễ thao tác, tông Nâu quế #8B4513 và Xanh lá đậm #2E7D32.
