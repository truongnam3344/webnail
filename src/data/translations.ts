export type Language = 'vi' | 'en' | 'th' | 'ja' | 'zh' | 'ko';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.about': 'Về chúng tôi',
    'nav.products': 'Sản phẩm',
    'nav.services': 'Dịch vụ Spa',
    'nav.deals': 'Ưu đãi',
    'nav.reviews': 'Đánh giá',
    'nav.faq': 'Hỏi đáp',
    'nav.contact': 'Liên hệ',
    'nav.lookup': 'Tra cứu',
    'nav.booking': 'Đặt lịch ngay',
    'nav.login': 'Đăng nhập / Đăng ký',
    'nav.portal': 'Tài khoản của tôi',

    // Categories
    'cat.skincare': 'Chăm Sóc Da',
    'cat.makeup': 'Trang Điểm',
    'cat.haircare': 'Chăm Sóc Tóc',
    'cat.fragrances': 'Nước Hoa',
    'cat.nailcare': 'Chăm Sóc Móng',
    'cat.bodycare': 'Chăm Sóc Body',
    'cat.accessories': 'Phụ Kiện & Dụng Cụ',

    // Banners
    'banner.hair.tag': 'Giảm Trực Tiếp 15%',
    'banner.hair.title': 'Ưu Đãi Chăm Sóc Tóc Đặc Biệt',
    'banner.hair.desc': 'Phục hồi tóc hư tổn, nhuộm phủ bóng organic & gội đầu dưỡng sinh thảo dược.',
    'banner.skin.tag': 'Giảm Trực Tiếp 25%',
    'banner.skin.title': 'Tiết Kiệm Lớn Cho Chăm Sóc Da',
    'banner.skin.desc': 'Cấy tinh chất Vàng 24K, cấp ẩm tầng sâu & điều trị da mụn chuyên sâu.',
    'banner.shopnow': 'Mua Ngay',

    // About Us
    'about.tag': 'Về Lumé Spa',
    'about.title1': 'Hành Trình Đến Với',
    'about.title2': 'Vẻ Đẹp Sang Trọng Tự Nhiên',
    'about.desc': 'Lumé Spa & Beauty mang đến không gian tĩnh lặng cùng các liệu pháp chăm sóc da, body, nail và tóc đẳng cấp. Chúng tôi cam kết sử dụng 100% dòng mỹ phẩm hữu cơ tự nhiên, đem lại trải nghiệm hoàn hảo cho bạn.',
    'about.stat1': 'Khách Hàng',
    'about.stat2': 'Sản Phẩm Đã Bán',
    'about.stat3': 'Đánh Giá Hài Lòng',

    // Best Sellers
    'bestsellers.sub': 'Sản Phẩm Của Chúng Tôi',
    'bestsellers.title': 'Sản Phẩm Bán Chạy Nhất',
    'bestsellers.all': 'Tất Cả',
    'bestsellers.view': 'Xem Chi Tiết',

    // Countdown
    'countdown.tag': 'Ưu Đãi Đặc Biệt',
    'countdown.title': 'Ưu Đãi Rạng Rỡ Mùa Hè',
    'countdown.sub': 'Giảm Đến 50% • Thời Gian Có Hạn',
    'countdown.days': 'Ngày',
    'countdown.hours': 'Giờ',
    'countdown.minutes': 'Phút',
    'countdown.seconds': 'Giây',

    // Deals of Day
    'deals.sub': 'Ưu Đãi Hôm Nay',
    'deals.title': 'Gói Khuyến Mãi Trong Ngày',
    'deals.weekly.tag': 'Ưu Đãi Hàng Tuần',
    'deals.weekly.title': 'Tiết Kiệm Tuyệt Vời: Bộ Sản Phẩm Phải Có',
    'deals.weekly.desc': 'Khám phá bộ sưu tập dịch vụ & combo chăm sóc toàn diện với giá cực kỳ ưu đãi. Đặt lịch trước ngay hôm nay để nhận thêm voucher 50k.',

    // New Arrivals
    'new.sub': 'Bộ Sưu Tập Mới',
    'new.title': 'Sản Phẩm Mới Ra Mắt',
    'newarrivals.sub': 'Bộ Sưu Tập Mới',
    'newarrivals.title': 'Sản Phẩm Mới Ra Mắt',
    'new.poster.tag': 'Giảm 50%',
    'new.poster.title': 'Sản Phẩm Làm Đẹp Mùa Mới',

    // Testimonials
    'testi.sub': 'Cảm Nhận',
    'testi.title': 'Đánh Giá Từ Khách Hàng Thân Thiết',
    'testimonials.sub': 'Ý Kiến & Cảm Nhận Thực Tế',
    'testimonials.title': 'Khách Hàng Nói Gì Về Lumé Spa',

    // News & Blogs
    'blog.sub': 'Tin Tức & Mẹo Làm Đẹp',
    'blog.title': 'Bài Viết & Tin Tức Mới Nhất',
    'blog.viewall': 'Xem Tất Cả Bài Viết',
    'blog.readmore': 'Đọc Thêm',

    // Instagram
    'insta.sub': 'Theo Dõi Chúng Tôi',
    'insta.title': 'Theo Dõi Trên Instagram',

    // FAQ
    'faq.sub': 'Hỏi Đáp',
    'faq.title': 'Giải Đáp Thắc Mắc Của Bạn',
    'faq.more': 'Bạn Còn Thắc Mắc Khác?',
    'faq.more.desc': 'Đội ngũ CSKH của Lumé Spa luôn sẵn sàng lắng nghe và tư vấn chi tiết cho bạn.',
    'faq.contactbtn': 'Liên Hệ Ngay',

    // Features & Newsletter
    'feat.freeship': 'Miễn Phí Vận Chuyển',
    'feat.freeship.desc': 'Cho đơn hàng từ 500k',
    'feat.payment': 'Thanh Toán Linh Hoạt',
    'feat.payment.desc': 'Đa dạng thẻ & Chuyển khoản',
    'feat.support': 'Hỗ Trợ 24/7',
    'feat.support.desc': 'Tư vấn nhiệt tình tận tâm',
    'feat.quality': 'Chất Lượng Đảm Bảo',
    'feat.quality.desc': '100% Mỹ phẩm hữu cơ chính hãng',
    'features.shipping': 'Miễn Phí Vận Chuyển',
    'features.shipping.sub': 'Cho đơn hàng từ 500k',
    'features.payment': 'Thanh Toán Linh Hoạt',
    'features.payment.sub': 'Đa dạng thẻ & Chuyển khoản',
    'features.support': 'Hỗ Trợ 24/7',
    'features.support.sub': 'Tư vấn nhiệt tình tận tâm',
    'features.quality': 'Chất Lượng Đảm Bảo',
    'features.quality.sub': '100% Mỹ phẩm hữu cơ chính hãng',
    'news.tag': 'Bản Tin Ưu Đãi',
    'news.title': 'Đăng Ký Nhận Ưu Đãi Mới Nhất',
    'news.placeholder': 'Nhập email của bạn...',
    'news.btn': 'Đăng Ký',
    'news.thanks': 'Cảm ơn bạn đã đăng ký nhận bản tin khuyến mãi!',
    'newsletter.tag': 'Bản Tin Ưu Đãi',
    'newsletter.title': 'Đăng Ký Nhận Ưu Đãi Mới Nhất',
    'newsletter.placeholder': 'Nhập email của bạn...',
    'newsletter.subscribe': 'Đăng Ký',
    'newsletter.subscribed': 'Cảm ơn bạn đã đăng ký nhận bản tin khuyến mãi!',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.products': 'Products',
    'nav.services': 'Spa Services',
    'nav.deals': 'Deals',
    'nav.reviews': 'Reviews',
    'nav.faq': 'FAQs',
    'nav.contact': 'Contact',
    'nav.lookup': 'Lookup',
    'nav.booking': 'Book Now',
    'nav.login': 'Login / Register',
    'nav.portal': 'My Account',

    // Categories
    'cat.skincare': 'Skin Care',
    'cat.makeup': 'Makeup',
    'cat.haircare': 'Hair Care',
    'cat.fragrances': 'Fragrances',
    'cat.nailcare': 'Nail Care',
    'cat.bodycare': 'Body Care',
    'cat.accessories': 'Tools & Accessories',

    // Banners
    'banner.hair.tag': 'Flat 15% Discount',
    'banner.hair.title': 'Special Hair Care Deals',
    'banner.hair.desc': 'Hair restoration, organic gloss coloring & herbal nourish shampoo.',
    'banner.skin.tag': 'Flat 25% Discount',
    'banner.skin.title': 'Save Big on Skincare',
    'banner.skin.desc': '24K Gold Collagen infusion, deep hydrating & acne treatment.',
    'banner.shopnow': 'Shop Now',

    // About Us
    'about.tag': 'About Lumé Spa',
    'about.title1': 'Your Journey to',
    'about.title2': 'Effortless Elegance',
    'about.desc': 'Lumé Spa & Beauty offers a serene sanctuary with premium skincare, body, nail, and hair therapies. We commit to 100% natural organic cosmetics for your ultimate experience.',
    'about.stat1': 'Happy Clients',
    'about.stat2': 'Products Sold',
    'about.stat3': 'Satisfaction Rate',

    // Best Sellers
    'bestsellers.sub': 'Our Products',
    'bestsellers.title': 'Our Best Sellers Products',
    'bestsellers.all': 'All',
    'bestsellers.view': 'View Details',

    // Countdown
    'countdown.tag': 'Special Savings',
    'countdown.title': 'Summer Glow Deals',
    'countdown.sub': 'Get 50% Off • Limited Time Offer',
    'countdown.days': 'Days',
    'countdown.hours': 'Hours',
    'countdown.minutes': 'Minutes',
    'countdown.seconds': 'Secs',

    // Deals of Day
    'deals.sub': "Today's Offers",
    'deals.title': 'Deals of the Day',
    'deals.weekly.tag': 'Weekly Deals',
    'deals.weekly.title': 'Amazing Savings: Weekly Beauty Must-Haves',
    'deals.weekly.desc': 'Discover our collection of curated beauty combos at exclusive prices. Book ahead today to receive a 50k bonus voucher.',

    // New Arrivals
    'new.sub': 'New Collection',
    'new.title': 'New Arrival Products',
    'new.poster.tag': '50% OFF',
    'new.poster.title': 'New Season Beauty Deals',

    // Testimonials
    'testi.sub': 'Testimonials',
    'testi.title': 'Testimonials from Our Loyal Customers',

    // News & Blogs
    'blog.sub': 'News & Blogs',
    'blog.title': 'Our Latest News & Blogs',
    'blog.viewall': 'View All Blogs',
    'blog.readmore': 'Read More',

    // Instagram
    'insta.sub': 'Follow Us',
    'insta.title': 'Follow Us On Instagram',

    // FAQ
    'faq.sub': 'FAQS',
    'faq.title': 'Question? Look here.',
    'faq.more': 'Have more questions?',
    'faq.more.desc': 'Our support team at Lumé Spa is always ready to assist and consult with you.',
    'faq.contactbtn': 'Contact Us',

    // Features & Newsletter
    'feat.freeship': 'Free Shipping',
    'feat.freeship.desc': 'For orders over 500k',
    'feat.payment': 'Flexible Payment',
    'feat.payment.desc': 'Multiple cards & transfers',
    'feat.support': '24/7 Support',
    'feat.support.desc': 'Dedicated care team',
    'feat.quality': 'Guaranteed Quality',
    'feat.quality.desc': '100% Genuine organic products',
    'news.tag': 'Our Newsletter',
    'news.title': 'Subscribe To Our Newsletter For Latest Offers',
    'news.placeholder': 'Enter your email address...',
    'news.btn': 'Subscribe',
    'news.thanks': 'Thank you for subscribing to our newsletter!',
  },
  th: {
    // Header
    'nav.home': 'หน้าแรก',
    'nav.about': 'เกี่ยวกับเรา',
    'nav.products': 'สินค้า',
    'nav.services': 'บริการสปา',
    'nav.deals': 'โปรโมชั่น',
    'nav.reviews': 'รีวิว',
    'nav.faq': 'คำถามที่พบบ่อย',
    'nav.contact': 'ติดต่อเรา',
    'nav.lookup': 'ค้นหาการจอง',
    'nav.booking': 'จองคิวทันที',
    'nav.login': 'เข้าสู่ระบบ / สมัครสมาชิก',
    'nav.portal': 'บัญชี củaฉัน',

    // Categories
    'cat.skincare': 'ดูแลผิวหน้า',
    'cat.makeup': 'แต่งหน้า',
    'cat.haircare': 'ดูแลเส้นผม',
    'cat.fragrances': 'น้ำหอม',
    'cat.nailcare': 'ทำเล็บ',
    'cat.bodycare': 'ดูแลผิวกาย',
    'cat.accessories': 'อุปกรณ์เสริม',

    // Banners
    'banner.hair.tag': 'ส่วนลดพิเศษ 15%',
    'banner.hair.title': 'ดีลพิเศษสระผมและดูแลผม',
    'banner.hair.desc': 'ฟื้นฟูผมเสีย ทำสีออร์แกนิค สระผมสมุนไพรผ่อนคลาย',
    'banner.skin.tag': 'ส่วนลดพิเศษ 25%',
    'banner.skin.title': 'ประหยัดคุ้มค่ากับสกินแคร์',
    'banner.skin.desc': 'ทรีทเมนท์ทองคำ 24K เติมความชุ่มชื้นล้ำลึก และรักษาสิว',
    'banner.shopnow': 'ช้อปเลย',

    // About Us
    'about.tag': 'เกี่ยวกับ ลูเม่ สปา',
    'about.title1': 'เส้นทางสู่',
    'about.title2': 'ความงามอย่างมีระดับและเป็นธรรมชาติ',
    'about.desc': 'Lumé Spa & Beauty มอบพื้นที่เงียบสงบพร้อมการดูแลผิว ร่างกาย เล็บ และผมระดับพรีเมียม เราใช้เครื่องสำอางออร์แกนิคธรรมชาติ 100%',
    'about.stat1': 'ลูกค้าที่พึงพอใจ',
    'about.stat2': 'สินค้าที่จำหน่าย',
    'about.stat3': 'อัตราความพึงพอใจ',

    // Best Sellers
    'bestsellers.sub': 'สินค้าของเรา',
    'bestsellers.title': 'สินค้ายอดนิยมขายดี',
    'bestsellers.all': 'ทั้งหมด',
    'bestsellers.view': 'ดูรายละเอียด',

    // Countdown
    'countdown.tag': 'ข้อเสนอพิเศษ',
    'countdown.title': 'ซัมเมอร์ โกลว์ ดีล',
    'countdown.sub': 'ลดสูงสุด 50% • ข้อเสนอมีเวลาจำกัด',
    'countdown.days': 'วัน',
    'countdown.hours': 'ชั่วโมง',
    'countdown.minutes': 'นาที',
    'countdown.seconds': 'วินาที',

    // Deals of Day
    'deals.sub': 'ข้อเสนอวันนี้',
    'deals.title': 'ดีลเด็ดประจำวัน',
    'deals.weekly.tag': 'ดีลประจำสัปดาห์',
    'deals.weekly.title': 'ข้อเสนอสุดคุ้มประจำสัปดาห์',
    'deals.weekly.desc': 'ค้นพบคอลเลกชันบริการความงามราคาพิเศษ จองล่วงหน้าวันนี้รับวอเชอร์พิเศษ',

    // New Arrivals
    'new.sub': 'คอลเลกชันใหม่',
    'new.title': 'สินค้ามาใหม่ล่าสุด',
    'new.poster.tag': 'ลด 50%',
    'new.poster.title': 'ดีลความงามต้อนรับฤดูกาลใหม่',

    // Testimonials
    'testi.sub': 'เสียงตอบรับ',
    'testi.title': 'รีวิวจากลูกค้าคนสำคัญ',

    // News & Blogs
    'blog.sub': 'ข่าวสาร & เคล็ดลับ',
    'blog.title': 'บทความและข่าวสารล่าสุด',
    'blog.viewall': 'ดูบทความทั้งหมด',
    'blog.readmore': 'อ่านเพิ่มเติม',

    // Instagram
    'insta.sub': 'ติดตามเรา',
    'insta.title': 'ติดตามเราบน Instagram',

    // FAQ
    'faq.sub': 'คำถามที่พบบ่อย',
    'faq.title': 'มีคำถาม? ดูที่นี่ได้เลย',
    'faq.more': 'มีคำถามเพิ่มเติมหรือไม่?',
    'faq.more.desc': 'ทีมงาน Lumé Spa พร้อมให้คำปรึกษาและดูแลคุณเสมอ',
    'faq.contactbtn': 'ติดต่อเรา',

    // Features & Newsletter
    'feat.freeship': 'จัดส่งฟรี',
    'feat.freeship.desc': 'เมื่อสั่งซื้อขั้นต่ำ 500k',
    'feat.payment': 'ชำระเงินสะดวก',
    'feat.payment.desc': 'รองรับหลายช่องทาง',
    'feat.support': 'บริการ 24/7',
    'feat.support.desc': 'ดูแลเอาใจใส่ตลอดเวลา',
    'feat.quality': 'คุณภาพการันตี',
    'feat.quality.desc': 'สินค้าออร์แกนิคแท้ 100%',
    'news.tag': 'รับข่าวสาร',
    'news.title': 'สมัครรับโปรโมชั่นและข้อเสนอพิเศษ',
    'news.placeholder': 'ใส่อีเมลของคุณ...',
    'news.btn': 'สมัครสมาชิก',
    'news.thanks': 'ขอบคุณที่สมัครรับข่าวสารโปรโมชั่นจากเรา!',
  },
  ja: {
    // Header
    'nav.home': 'ホーム',
    'nav.about': '私たちについて',
    'nav.products': '製品一覧',
    'nav.services': 'スパメニュー',
    'nav.deals': 'お得なプラン',
    'nav.reviews': 'お客様の声',
    'nav.faq': 'よくある質問',
    'nav.contact': 'お問い合わせ',
    'nav.lookup': '予約確認',
    'nav.booking': '今すぐ予約',
    'nav.login': 'ログイン / 会員登録',
    'nav.portal': 'マイページ',

    // Categories
    'cat.skincare': 'スキンケア',
    'cat.makeup': 'メイクアップ',
    'cat.haircare': 'ヘアケア',
    'cat.fragrances': 'フレグランス',
    'cat.nailcare': 'ネイルケア',
    'cat.bodycare': 'ボディケア',
    'cat.accessories': '美容ツール＆小物',

    // Banners
    'banner.hair.tag': '15%OFF 特別割引',
    'banner.hair.title': 'スペシャル ヘアケアプラン',
    'banner.hair.desc': '髪のダメージ補修、オーガニックカラー＆薬草ヘッドスパ。',
    'banner.skin.tag': '25%OFF 特別割引',
    'banner.skin.title': 'スキンケア大感謝セール',
    'banner.skin.desc': '24K金箔美容液導入、深層保湿＆ニキビケアケア。',
    'banner.shopnow': '今すぐ購入',

    // About Us
    'about.tag': 'Lumé Spaについて',
    'about.title1': 'エレガントで美しい',
    'about.title2': '自然な美しさを叶える場所',
    'about.desc': 'Lumé Spa & Beautyは、心身ともに癒やされる洗練されたサロン空間で、100%オーガニック化粧品を使用した上質なトリートメントをご提供します。',
    'about.stat1': 'ご来店お客様数',
    'about.stat2': '販売実績',
    'about.stat3': '満足度',

    // Best Sellers
    'bestsellers.sub': 'おすすめ商品',
    'bestsellers.title': 'ベストセラー商品',
    'bestsellers.all': 'すべて',
    'bestsellers.view': '詳細を見る',

    // Countdown
    'countdown.tag': '期間限定特別割引',
    'countdown.title': 'サマーグロウセール',
    'countdown.sub': '最大50%OFF • 期間限定オファー',
    'countdown.days': '日',
    'countdown.hours': '時間',
    'countdown.minutes': '分',
    'countdown.seconds': '秒',

    // Deals of Day
    'deals.sub': '本日のスペシャル',
    'deals.title': '本日の限定ディール',
    'deals.weekly.tag': 'ウィークリーディール',
    'deals.weekly.title': 'お得な今週のマストバイ美容セット',
    'deals.weekly.desc': '厳選されたビューティーコースをお手頃価格で。事前予約で50k割引クーポンプレゼント。',

    // New Arrivals
    'new.sub': '新作コレクション',
    'new.title': '新着おすすめアイテム',
    'new.poster.tag': '50% OFF',
    'new.poster.title': 'ニューシーズン ビューティーディール',

    // Testimonials
    'testi.sub': 'お客様のお声',
    'testi.title': 'お客様からの口コミ・評価',

    // News & Blogs
    'blog.sub': 'ニュース＆コラム',
    'blog.title': '最新情報＆美容ブログ',
    'blog.viewall': '記事一覧を見る',
    'blog.readmore': '詳しく読む',

    // Instagram
    'insta.sub': '公式インスタグラム',
    'insta.title': 'Instagramをフォロー',

    // FAQ
    'faq.sub': 'FAQ',
    'faq.title': 'よくあるご質問',
    'faq.more': 'ご不明な点はございますか？',
    'faq.more.desc': 'Lumé Spaの専門スタッフがいつでもご相談を承ります。',
    'faq.contactbtn': 'お問い合わせ',

    // Features & Newsletter
    'feat.freeship': '送料無料',
    'feat.freeship.desc': '500k以上のお買い上げで',
    'feat.payment': '多様な決済対応',
    'feat.payment.desc': 'カード＆銀行振込',
    'feat.support': '24時間サポート',
    'feat.support.desc': '安心のカスタマーケア',
    'feat.quality': '品質保証',
    'feat.quality.desc': '100%正規品オーガニック',
    'news.tag': 'メルマガ登録',
    'news.title': 'メールマガジンにご登録いただくと最新クーポンをお届けします',
    'news.placeholder': 'メールアドレスを入力...',
    'news.btn': '登録する',
    'news.thanks': 'ご登録ありがとうございます！最新情報をお届けします。',
  },
  zh: {
    // Header
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.products': '产品',
    'nav.services': '水疗服务',
    'nav.deals': '特惠活动',
    'nav.reviews': '客户评价',
    'nav.faq': '常见问题',
    'nav.contact': '联系我们',
    'nav.lookup': '查询预约',
    'nav.booking': '立即预约',
    'nav.login': '登录 / 注册',
    'nav.portal': '我的账户',

    // Categories
    'cat.skincare': '面部護膚',
    'cat.makeup': '精致美妆',
    'cat.haircare': '秀发护理',
    'cat.fragrances': '香氛香水',
    'cat.nailcare': '美甲美足',
    'cat.bodycare': '身体护理',
    'cat.accessories': '美容工具与配件',

    // Banners
    'banner.hair.tag': '立减 15% 优惠',
    'banner.hair.title': '美发与草本洗头特惠',
    'banner.hair.desc': '受损发质修复、有机植物染发及草本养生洗头。',
    'banner.skin.tag': '立减 25% 优惠',
    'banner.skin.title': '护肤盛典大促销',
    'banner.skin.desc': '24K金箔胶原蛋白导入、深层补水及祛痘护理。',
    'banner.shopnow': '立即抢购',

    // About Us
    'about.tag': '关于 Lumé Spa',
    'about.title1': '开启您的',
    'about.title2': '自然与优雅奢华之旅',
    'about.desc': 'Lumé Spa & Beauty 为您提供静谧舒适的顶级水疗环境，涵盖面部、身体、美甲和美发护理。我们承诺100%使用天然有机护肤品。',
    'about.stat1': '满意客户',
    'about.stat2': '已售产品',
    'about.stat3': '满意度评价',

    // Best Sellers
    'bestsellers.sub': '我们的产品',
    'bestsellers.title': '热销明星产品',
    'bestsellers.all': '全部',
    'bestsellers.view': '查看详情',

    // Countdown
    'countdown.tag': '限时特惠',
    'countdown.title': '夏日焕彩狂欢优惠',
    'countdown.sub': '低至50%折扣 • 限时优惠',
    'countdown.days': '天',
    'countdown.hours': '小时',
    'countdown.minutes': '分钟',
    'countdown.seconds': '秒',

    // Deals of Day
    'deals.sub': '今日推荐',
    'deals.title': '今日超值特惠',
    'deals.weekly.tag': '每周优惠',
    'deals.weekly.title': '每周美妆必备精选组合',
    'deals.weekly.desc': '探索精选水疗套餐与护肤组合，提前预约即可额外获赠50k代金券。',

    // New Arrivals
    'new.sub': '新品系列',
    'new.title': '最新上架产品',
    'new.poster.tag': '50% 折扣',
    'new.poster.title': '新季美肤特惠',

    // Testimonials
    'testi.sub': '客户声誉',
    'testi.title': '忠实客户真实评价',

    // News & Blogs
    'blog.sub': '美妆资讯',
    'blog.title': '最新新闻与美容心得',
    'blog.viewall': '查看全部文章',
    'blog.readmore': '阅读全文',

    // Instagram
    'insta.sub': '关注我们',
    'insta.title': '在 Instagram 上关注我们',

    // FAQ
    'faq.sub': '常见问题',
    'faq.title': '有疑问？看这里',
    'faq.more': '还有其他疑问？',
    'faq.more.desc': 'Lumé Spa 客服团队随时为您解答并提供专业咨询。',
    'faq.contactbtn': '联系我们',

    // Features & Newsletter
    'feat.freeship': '包邮服务',
    'feat.freeship.desc': '满 500k 免费送货',
    'feat.payment': '灵活支付',
    'feat.payment.desc': '支持多种银行卡与转账',
    'feat.support': '24/7 全天候支持',
    'feat.support.desc': '贴心专业的客服团队',
    'feat.quality': '品质保障',
    'feat.quality.desc': '100% 正品有机护肤品',
    'news.tag': '优惠资讯',
    'news.title': '订阅我们的电子报获取最新优惠',
    'news.placeholder': '请输入您的电子邮箱...',
    'news.btn': '立即订阅',
    'news.thanks': '感谢您的订阅！我们会第一时间发送最新优惠。',
  },
  ko: {
    // Header
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.products': '제품 목록',
    'nav.services': '스파 서비스',
    'nav.deals': '특별 혜택',
    'nav.reviews': '고객 후기',
    'nav.faq': '자주 묻는 질문',
    'nav.contact': '문의하기',
    'nav.lookup': '예약 조회',
    'nav.booking': '지금 예약하기',
    'nav.login': '로그인 / 회원가입',
    'nav.portal': '마이페이지',

    // Categories
    'cat.skincare': '스킨케어',
    'cat.makeup': '메이크업',
    'cat.haircare': '헤어케어',
    'cat.fragrances': '향수',
    'cat.nailcare': '네일케어',
    'cat.bodycare': '바디케어',
    'cat.accessories': '뷰티 툴 & 액세서리',

    // Banners
    'banner.hair.tag': '15% 즉시 할인',
    'banner.hair.title': '특별 헤어케어 혜택',
    'banner.hair.desc': '손상모 복구, 오가닉 앰플 염색 & 한방 두피 스파.',
    'banner.skin.tag': '25% 즉시 할인',
    'banner.skin.title': '스킨케어 대격차 할인',
    'banner.skin.desc': '24K 골드 콜라겐 케어, 수분 보습 & 여드름 케어.',
    'banner.shopnow': '지금 쇼핑하기',

    // About Us
    'about.tag': 'Lumé Spa 소개',
    'about.title1': '우아함과 아름다움으로',
    'about.title2': '향하는 자연스러운 여정',
    'about.desc': 'Lumé Spa & Beauty는 도심 속 프라이빗 리조트 같은 공간에서 100% 유기농 천연 화장품을 활용한 프리미엄 스킨, 바디, 네일, 헤어 서비스를 제공합니다.',
    'about.stat1': '만족 고객 수',
    'about.stat2': '누적 판매량',
    'about.stat3': '고객 만족도',

    // Best Sellers
    'bestsellers.sub': '추천 상품',
    'bestsellers.title': '베스트셀러 인기 상품',
    'bestsellers.all': '전체',
    'bestsellers.view': '상세보기',

    // Countdown
    'countdown.tag': '시즌 한정 혜택',
    'countdown.title': '썸머 글로우 딜',
    'countdown.sub': '최대 50% 할인 • 한정 기간 오퍼',
    'countdown.days': '일',
    'countdown.hours': '시간',
    'countdown.minutes': '분',
    'countdown.seconds': '초',

    // Deals of Day
    'deals.sub': '오늘의 특가',
    'deals.title': '오늘의 데일리 딜',
    'deals.weekly.tag': '위클리 딜',
    'deals.weekly.title': '금주의 필수 뷰티 콤보 아이템',
    'deals.weekly.desc': '엄선된 프리미엄 스파 콤보 세트를 특별한 가격에 만나보세요. 사전 예약 시 50k 추가 할인 쿠폰 증정.',

    // New Arrivals
    'new.sub': '신상품 컬렉션',
    'new.title': '신규 입고 상품',
    'new.poster.tag': '50% 할인',
    'new.poster.title': '새 시즌 뷰티 특가',

    // Testimonials
    'testi.sub': '고객 리뷰',
    'testi.title': '단골 고객들의 생생한 후기',

    // News & Blogs
    'blog.sub': '뉴스 & 뷰티 팁',
    'blog.title': '최신 뉴스 및 트렌드 블로그',
    'blog.viewall': '전체 글 보기',
    'blog.readmore': '더 보기',

    // Instagram
    'insta.sub': '팔로우',
    'insta.title': 'Instagram 팔로우하기',

    // FAQ
    'faq.sub': '자주 묻는 질문',
    'faq.title': '궁금한 점이 있으신가요?',
    'faq.more': '추가로 궁금한 사항이 있으신가요?',
    'faq.more.desc': 'Lumé Spa 전문 상담팀이 친절하게 안내해 드립니다.',
    'faq.contactbtn': '문의하기',

    // Features & Newsletter
    'feat.freeship': '무료 배송',
    'feat.freeship.desc': '500k 이상 구매 시',
    'feat.payment': '간편 결제',
    'feat.payment.desc': '다양한 카드 및 이체 지원',
    'feat.support': '24/7 고객 지원',
    'feat.support.desc': '언제나 친절한 상담',
    'feat.quality': '품질 보증',
    'feat.quality.desc': '100% 정품 유기농 제품',
    'news.tag': '뉴스레터 구독',
    'news.title': '뉴스레터를 구독하고 최신 할인 쿠폰을 받아보세요',
    'news.placeholder': '이메일 주소를 입력하세요...',
    'news.btn': '구독하기',
    'news.thanks': '구독해 주셔서 감사합니다! 최신 혜택을 전해드립니다.',
  },
};
