# Senspices — Quản lý chế biến quế

Ứng dụng web một trang bằng HTML, CSS và JavaScript thuần để quản lý lô chế biến quế, theo dõi sản lượng và tính hao hụt. Dữ liệu được lưu trên trình duyệt bằng `localStorage`.

## Chạy ứng dụng

Ứng dụng tải Tailwind CSS từ CDN nên cần kết nối Internet để hiển thị đầy đủ kiểu dáng. Tại thư mục đã giải nén, chạy máy chủ tĩnh:

```bash
python3 -m http.server 8000
```

Mở `http://localhost:8000` trong trình duyệt. Cũng có thể mở `index.html` trực tiếp, nhưng dùng máy chủ tĩnh sẽ ổn định hơn cho `localStorage`.

## Đưa lên GitHub

1. Giải nén ZIP và tải **toàn bộ các tệp trong thư mục gốc của gói** lên repository.
2. Commit các tệp vào nhánh `main`.
3. Nếu muốn chạy trang web qua GitHub Pages, vào **Settings → Pages**, chọn **Deploy from a branch**, chọn nhánh `main` và thư mục `/ (root)`, rồi lưu. Đường dẫn CSS và JavaScript trong `index.html` đã dùng đường dẫn tương đối để tương thích với Pages chạy dưới đường dẫn repository.

## Tính năng

- Thống kê tổng nguyên liệu nhập, tổng thành phẩm và tỷ lệ hao hụt bình quân theo khối lượng.
- Ba lô mẫu Yên Bái / Hà Nam được tự khởi tạo trong lần mở đầu tiên.
- Nhập sản lượng Quế ống điếu, Quế vụn và Bột quế; tự tính tổng thành phẩm, hao hụt và tỷ lệ hao hụt.
- Báo lỗi dữ liệu không hợp lệ, mã lô trùng và thành phẩm vượt nguyên liệu đầu vào.
- Hiển thị cảnh báo đỏ cho lô có tỷ lệ hao hụt trên 15%; xuất lịch sử CSV có BOM để mở bằng Excel.
- Giao diện tiếng Việt responsive cho điện thoại và máy tính.

## Dữ liệu

Các lô được lưu trong `localStorage` của trình duyệt hiện tại; không có máy chủ hoặc đồng bộ giữa các thiết bị. Xóa dữ liệu trang web trong trình duyệt cũng sẽ xóa các lô đã lưu tại thiết bị đó.

## Tệp đi kèm

- `index.html`, `styles.css`, `app.js`: giao diện và chức năng ứng dụng.
- `manus-routes.json`, `app.config.ts`: metadata cho môi trường Manus; GitHub Pages không cần các tệp này để chạy trang tĩnh.
- `senspices-mark.svg`: dấu hiệu nhận diện dạng vector.
- `TODO.md`: checklist phạm vi chức năng đã hoàn tất.
