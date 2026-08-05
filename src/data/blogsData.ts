import { BlogArticle } from '../types';

export const INITIAL_BLOGS_CATALOG: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Your Ultimate Guide to Healthy, Radiant Skin',
    author: 'Jenny Alexander',
    date: '22 January 2025',
    category: 'Skincare Tips',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    summary: 'Bí quyết chăm sóc da hàng ngày tại nhà giúp làn da luôn duy trì độ ẩm tự nhiên, ngăn ngừa lão hóa và phục hồi hàng rào bảo vệ da.',
    readTime: '5 phút đọc',
    views: 1240,
    tags: ['Skin Care', 'Routine', 'Glow'],
    content: `Làn da khỏe đẹp rạng rỡ không phải là kết quả của một đêm, mà là sự kiên trì chăm sóc mỗi ngày với những sản phẩm phù hợp. Dưới đây là 4 bước cốt lõi không thể thiếu:

### 1. Làm sạch kép (Double Cleansing)
Bắt đầu buổi tối bằng việc tẩy trang loại bỏ dầu thừa, bụi mịn và kem chống nắng. Sau đó dùng sữa rửa mặt dịu nhẹ có độ pH 5.5 để làm sạch sâu lỗ chân lông mà không làm mất đi độ ẩm tự nhiên.

### 2. Cân bằng & Cấp ẩm đa tầng với HA Serum
Ngay sau khi rửa mặt, hãy vỗ nhẹ nước hoa hồng hoặc Toner không chứa cồn, tiếp nối bằng 3-4 giọt Tinh chất Serum HA Multi-Hydrating. HA (Hyaluronic Acid) giúp hút giữ lượng nước gấp 1000 lần trọng lượng của nó, duy trì bề mặt da căng mọng.

### 3. Phục hồi hàng rào da bằng Kem dưỡng chuyên sâu
Kem dưỡng khóa ẩm chứa Ceramides & Niacinamide sẽ đóng vai trò như lớp khiên bảo vệ, ngăn ngừa sự thất thoát độ ẩm qua da (TEWL) và làm dịu các vùng da mẩn đỏ hay nhạy cảm.

### 4. Không bao giờ quên Kem chống nắng phổ rộng
Vào ban ngày, dù ở trong nhà hay ngoài trời, kem chống nắng SPF 50+ PA++++ luôn là tấm lá chắn quan trọng nhất chống lại tia UVA/UVB - tác nhân số 1 gây thâm nám, nếp nhăn và đốm nâu.`
  },
  {
    id: 'blog-2',
    title: 'The Best Body Care Products for Every Skin Type',
    author: 'Jenny Alexander',
    date: '18 January 2025',
    category: 'Body Care',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    summary: 'Lựa chọn dầu dưỡng body hữu cơ và kem dưỡng phù hợp cho từng mùa trong năm giúp cơ thể luôn ngạt ngào hương thơm dịu nhẹ.',
    readTime: '7 phút đọc',
    views: 890,
    tags: ['Body Care', 'Argan Oil', 'Massage'],
    content: `Chăm sóc da toàn thân cũng quan trọng không kém gì chăm sóc da mặt. Một làn da cơ thể mềm mịn, thơm mát sẽ mang lại sự tự tin và cảm giác thư thái suốt cả ngày dài.

### Dầu Dưỡng Argan Morocco Nguyên Chất
Dầu Argan giàu Vitamin E và Axit béo thiết yếu là bí quyết của các liệu trình Spa cao cấp. Thoa vài giọt dầu ngay sau khi tắm khi da còn ẩm giúp các dưỡng chất thẩm thấu tức thì, không gây bết dính.

### Tẩy Tế Bào Chết Định Kỳ 2 Lần / Tuần
Dùng muối khoáng biển hoặc hạt cà phê hữu cơ massage nhẹ nhàng theo chuyển động tròn tại các vùng da thô ráp như khuỷu tay, đầu gối và gót chân.

### Kết Hợp Massage Thư Giãn Tinh Dầu Oải Hương
Vào cuối tuần, hãy thưởng thức liệu trình massage body bằng tinh dầu Lavender giúp giãn cơ, loại bỏ căng thẳng và ngủ sâu giấc hơn.`
  },
  {
    id: 'blog-3',
    title: 'Why Sun Protection is Essential for Healthy Skin',
    author: 'Jenny Alexander',
    date: '12 January 2025',
    category: 'Beauty Guide',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    summary: 'Tầm quan trọng của việc dùng kem chống nắng phổ rộng mỗi ngày để chống lão hóa sớm, tăng sinh collagen và ngăn ngừa tàn nhang.',
    readTime: '4 phút đọc',
    views: 1520,
    tags: ['Sunscreen', 'Anti-Aging', 'UV Protection'],
    content: `Nhiều người thường bỏ qua kem chống nắng vào những ngày trời râm mát hay khi làm việc văn phòng. Tuy nhiên, tia UVA có khả năng xuyên qua lớp kính cửa sổ và mây mù, gây phá hủy sợi Collagen nằm sâu dưới da.

### Tia UVA vs Tia UVB: Khác Nhau Như Thế Nào?
- **Tia UVB**: Gây cháy nắng, rát da và đỏ da trực tiếp.
- **Tia UVA**: Xuyên sâu vào tầng trung bì, phá hủy Collagen, tạo nếp nhăn và đốm nâu thâm nám.

### Quy Tắc 2 Ngón Tay
Hãy dùng lượng kem chống nắng tương đương chiều dài 2 ngón tay cho toàn bộ khuôn mặt và cổ để đảm bảo chỉ số SPF đạt đúng hiệu quả ghi trên vỏ hộp. Sau mỗi 2-3 giờ hoạt động ngoài trời, hãy thoa lại để duy trì lớp màng bảo vệ hoàn hảo.`
  },
  {
    id: 'blog-4',
    title: 'Bí Quyết Phục Hồi Làn Da Căng Bóng Với Tinh Chất HA Multi-Hydrating',
    author: 'Dr. Elena Vance',
    date: '05 February 2025',
    category: 'Facial Care',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    summary: 'Khám phá liệu trình điện di HA đa tầng tại Lumé Spa kết hợp serum dưỡng da căng bóng chuẩn y khoa.',
    readTime: '6 phút đọc',
    views: 2100,
    tags: ['Liệu Trình Spa', 'HA Serum', 'Trẻ Hóa'],
    content: `Liệu trình điện di tinh chất HA đa tầng tại Lumé Spa là giải pháp cứu tinh cho làn da khô ráp, xỉn màu hoặc mệt mỏi do thức khuya và ô nhiễm môi trường.

### Cơ Chế Hoạt Động Của Điện Di Điện Trường
Công nghệ điện di lạnh giúp mở tạm thời các kênh tế bào, đưa tinh chất Hyaluronic Acid phân tử nhỏ đi sâu vào lớp trung bì mà không cần can thiệp xấm lấn hay tiêm châm.

### Kết Quả Sau 60 Phút Trải Nghiệm
- Làn da ngậm nước căng bóng rạng rỡ ngay lập tức.
- Giảm mẩn đỏ, làm dịu da nhạy cảm.
- Se khít lỗ chân lông và làm mờ các nếp nhăn nông.`
  }
];
