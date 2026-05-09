-- Seed data for PaisaAds
-- Using MERGE to be idempotent on repeated starts

-- =====================================================
-- USERS
-- =====================================================
-- Password for all users: "password123" (BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)

INSERT IGNORE INTO users (id, name, email, phone_number, password, role, is_active, email_verified, phone_verified, created_at, updated_at)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Super Admin', 'admin@paisaads.com', '9999999999', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SUPER_ADMIN', true, true, true, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000002', 'Test User', 'user@paisaads.com', '8888888888', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', true, true, true, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000003', 'Editor User', 'editor@paisaads.com', '7777777777', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EDITOR', true, true, true, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000004', 'Reviewer User', 'reviewer@paisaads.com', '6666666666', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'REVIEWER', true, true, true, NOW(), NOW());

-- =====================================================
-- ADMINS & CUSTOMERS
-- =====================================================
INSERT IGNORE INTO admins (id, user_id, created_at, updated_at)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', NOW(), NOW()),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', NOW(), NOW());

INSERT IGNORE INTO customers (id, user_id, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', NOW(), NOW());

-- =====================================================
-- MAIN CATEGORIES
-- =====================================================
INSERT IGNORE INTO main_categories (id, name, category_heading_font_color, categories_color, font_color, is_active, created_at, updated_at)
VALUES
('d0000000-0000-0000-0000-000000000001', 'Real Estate', '#2196F3', '#E3F2FD', '#1565C0', true, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000002', 'Vehicles', '#4CAF50', '#E8F5E9', '#2E7D32', true, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000003', 'Electronics', '#FF9800', '#FFF3E0', '#E65100', true, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000004', 'Jobs', '#9C27B0', '#F3E5F5', '#6A1B9A', true, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000005', 'Services', '#F44336', '#FFEBEE', '#B71C1C', true, NOW(), NOW());

-- =====================================================
-- CATEGORY ONE (Sub-categories of Main Categories)
-- =====================================================
-- Real Estate sub-categories
INSERT IGNORE INTO category_ones (id, name, category_heading_font_color, is_active, parent_id, created_at, updated_at)
VALUES
('e1000000-0000-0000-0000-000000000001', 'Apartments', '#1565C0', true, 'd0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000002', 'Houses', '#1565C0', true, 'd0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000003', 'Land', '#1565C0', true, 'd0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000004', 'Commercial', '#1565C0', true, 'd0000000-0000-0000-0000-000000000001', NOW(), NOW()),
-- Vehicles sub-categories
('e1000000-0000-0000-0000-000000000005', 'Cars', '#2E7D32', true, 'd0000000-0000-0000-0000-000000000002', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000006', 'Motorcycles', '#2E7D32', true, 'd0000000-0000-0000-0000-000000000002', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000007', 'Bicycles', '#2E7D32', true, 'd0000000-0000-0000-0000-000000000002', NOW(), NOW()),
-- Electronics sub-categories
('e1000000-0000-0000-0000-000000000008', 'Mobiles', '#E65100', true, 'd0000000-0000-0000-0000-000000000003', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000009', 'Laptops', '#E65100', true, 'd0000000-0000-0000-0000-000000000003', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000010', 'TVs', '#E65100', true, 'd0000000-0000-0000-0000-000000000003', NOW(), NOW()),
-- Jobs sub-categories
('e1000000-0000-0000-0000-000000000011', 'IT Jobs', '#6A1B9A', true, 'd0000000-0000-0000-0000-000000000004', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000012', 'Government Jobs', '#6A1B9A', true, 'd0000000-0000-0000-0000-000000000004', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000013', 'Part Time', '#6A1B9A', true, 'd0000000-0000-0000-0000-000000000004', NOW(), NOW()),
-- Services sub-categories
('e1000000-0000-0000-0000-000000000014', 'Home Repair', '#B71C1C', true, 'd0000000-0000-0000-0000-000000000005', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000015', 'Tutoring', '#B71C1C', true, 'd0000000-0000-0000-0000-000000000005', NOW(), NOW()),
('e1000000-0000-0000-0000-000000000016', 'Cleaning', '#B71C1C', true, 'd0000000-0000-0000-0000-000000000005', NOW(), NOW());

-- =====================================================
-- CATEGORY TWO (Sub-categories of Category One)
-- =====================================================
-- Apartments sub-categories
INSERT IGNORE INTO category_twos (id, name, category_heading_font_color, is_active, parent_id, created_at, updated_at)
VALUES
('f2000000-0000-0000-0000-000000000001', '1 BHK', '#1565C0', true, 'e1000000-0000-0000-0000-000000000001', NOW(), NOW()),
('f2000000-0000-0000-0000-000000000002', '2 BHK', '#1565C0', true, 'e1000000-0000-0000-0000-000000000001', NOW(), NOW()),
('f2000000-0000-0000-0000-000000000003', '3 BHK', '#1565C0', true, 'e1000000-0000-0000-0000-000000000001', NOW(), NOW()),
-- Cars sub-categories
('f2000000-0000-0000-0000-000000000004', 'Hatchback', '#2E7D32', true, 'e1000000-0000-0000-0000-000000000005', NOW(), NOW()),
('f2000000-0000-0000-0000-000000000005', 'Sedan', '#2E7D32', true, 'e1000000-0000-0000-0000-000000000005', NOW(), NOW()),
('f2000000-0000-0000-0000-000000000006', 'SUV', '#2E7D32', true, 'e1000000-0000-0000-0000-000000000005', NOW(), NOW()),
-- Mobiles sub-categories
('f2000000-0000-0000-0000-000000000007', 'Smartphones', '#E65100', true, 'e1000000-0000-0000-0000-000000000008', NOW(), NOW()),
('f2000000-0000-0000-0000-000000000008', 'Feature Phones', '#E65100', true, 'e1000000-0000-0000-0000-000000000008', NOW(), NOW());

-- =====================================================
-- CATEGORY THREE (Sub-categories of Category Two)
-- =====================================================
INSERT IGNORE INTO category_threes (id, name, category_heading_font_color, is_active, parent_id, created_at, updated_at)
VALUES
('f3000000-0000-0000-0000-000000000001', 'Furnished', '#1565C0', true, 'f2000000-0000-0000-0000-000000000001', NOW(), NOW()),
('f3000000-0000-0000-0000-000000000002', 'Unfurnished', '#1565C0', true, 'f2000000-0000-0000-0000-000000000001', NOW(), NOW()),
('f3000000-0000-0000-0000-000000000003', 'Semi-Furnished', '#1565C0', true, 'f2000000-0000-0000-0000-000000000002', NOW(), NOW()),
('f3000000-0000-0000-0000-000000000004', 'Automatic', '#2E7D32', true, 'f2000000-0000-0000-0000-000000000004', NOW(), NOW()),
('f3000000-0000-0000-0000-000000000005', 'Manual', '#2E7D32', true, 'f2000000-0000-0000-0000-000000000004', NOW(), NOW()),
('f3000000-0000-0000-0000-000000000006', 'Android', '#E65100', true, 'f2000000-0000-0000-0000-000000000007', NOW(), NOW()),
('f3000000-0000-0000-0000-000000000007', 'iOS', '#E65100', true, 'f2000000-0000-0000-0000-000000000007', NOW(), NOW());

-- =====================================================
-- PAYMENTS
-- =====================================================
INSERT IGNORE INTO payments (id, amount, payment_method, status, razorpay_order_id, razorpay_payment_id, created_at, updated_at)
VALUES
('g0000000-0000-0000-0000-000000000001', 499.00, 'razorpay', 'completed', 'order_rcpt_1', 'pay_rcpt_1', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000002', 999.00, 'razorpay', 'completed', 'order_rcpt_2', 'pay_rcpt_2', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000003', 1499.00, 'razorpay', 'completed', 'order_rcpt_3', 'pay_rcpt_3', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000004', 299.00, 'razorpay', 'completed', 'order_rcpt_4', 'pay_rcpt_4', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000005', 199.00, 'razorpay', 'completed', 'order_rcpt_5', 'pay_rcpt_5', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000006', 299.00, 'razorpay', 'completed', 'order_rcpt_6', 'pay_rcpt_6', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000007', 4499.00, 'razorpay', 'completed', 'order_rcpt_7', 'pay_rcpt_7', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000008', 1499.00, 'razorpay', 'completed', 'order_rcpt_8', 'pay_rcpt_8', NOW(), NOW()),
('g0000000-0000-0000-0000-000000000009', 4499.00, 'razorpay', 'completed', 'order_rcpt_9', 'pay_rcpt_9', NOW(), NOW());

-- =====================================================
-- IMAGES
-- =====================================================
INSERT IGNORE INTO images (id, file_name, file_path, is_temp, uploaded_on, customer_id, created_at, updated_at)
VALUES
('h0000000-0000-0000-0000-000000000001', 'poster_ad_1.jpg', '/uploads/poster_ad_1.jpg', false, NOW(), 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('h0000000-0000-0000-0000-000000000002', 'poster_ad_2.jpg', '/uploads/poster_ad_2.jpg', false, NOW(), 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('h0000000-0000-0000-0000-000000000003', 'poster_ad_3.jpg', '/uploads/poster_ad_3.jpg', false, NOW(), 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('h0000000-0000-0000-0000-000000000004', 'video_ad_1_thumbnail.jpg', '/uploads/video_ad_1_thumbnail.jpg', false, NOW(), 'c0000000-0000-0000-0000-000000000001', NOW(), NOW());

-- =====================================================
-- LINE ADS (5 PUBLISHED)
-- =====================================================
INSERT IGNORE INTO line_ads (id, sequence_number, order_id, content, state, sid, city, cid, dates, posted_by, contact_one, contact_two, background_color, text_color, status, is_active, page_type, main_category_id, category_one_id, category_two_id, category_three_id, payment_id, customer_id, created_at, updated_at)
VALUES
('i0000000-0000-0000-0000-000000000001', 1, 'ORD-LA-001', 'Spacious 2 BHK apartment for rent in Koramangala, Bangalore. Semi-furnished with modular kitchen, 24/7 water supply, and covered parking. Near Metro station. Rent: Rs 25,000/month. Contact for viewing.', 'Karnataka', 'KA', 'Bangalore', 'BLR', '2024-01-15,2024-01-16,2024-01-17', 'Test User', '9876543210', '9876543211', '#FFFFFF', '#000000', 'PUBLISHED', true, 'HOME', 'd0000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000002', 'f3000000-0000-0000-0000-000000000003', 'g0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('i0000000-0000-0000-0000-000000000002', 2, 'ORD-LA-002', 'Honda City 2019 model for sale. ZX MT variant, Silver color, 45,000 km driven. Single owner, comprehensive insurance till Dec 2024. All service records available. Price: Rs 8,50,000 negotiable.', 'Maharashtra', 'MH', 'Mumbai', 'BOM', '2024-01-15,2024-01-16,2024-01-17', 'Test User', '9876543220', '9876543221', '#FFF3E0', '#E65100', 'PUBLISHED', true, 'HOME', 'd0000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000005', 'f2000000-0000-0000-0000-000000000005', 'f3000000-0000-0000-0000-000000000005', 'g0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('i0000000-0000-0000-0000-000000000003', 3, 'ORD-LA-003', 'Samsung Galaxy S24 Ultra for sale. Titanium Black, 256GB, 12GB RAM. With original box, charger, and earbuds. Under warranty. Price: Rs 1,05,000. Serious buyers only.', 'Delhi', 'DL', 'New Delhi', 'NDL', '2024-01-15,2024-01-16', 'Test User', '9876543230', NULL, '#E8F5E9', '#2E7D32', 'PUBLISHED', true, 'CATEGORY', 'd0000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000008', 'f2000000-0000-0000-0000-000000000007', 'f3000000-0000-0000-0000-000000000006', 'g0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('i0000000-0000-0000-0000-000000000004', 4, 'ORD-LA-004', 'Wanted: Senior Java Developer with 5+ years experience. Work from office in Hyderabad. Skills: Spring Boot, Microservices, AWS. Salary: 15-25 LPA. Apply with resume to hr@techcorp.com', 'Telangana', 'TS', 'Hyderabad', 'HYD', '2024-01-15,2024-01-16,2024-01-17', 'Editor User', '9876543240', NULL, '#F3E5F5', '#6A1B9A', 'PUBLISHED', true, 'HOME', 'd0000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000011', NULL, NULL, 'g0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', NOW(), NOW()),
('i0000000-0000-0000-0000-000000000005', 5, 'ORD-LA-005', 'Professional home cleaning services in Pune. Deep cleaning, sofa cleaning, kitchen cleaning. Trained staff, eco-friendly products. Starting at Rs 1,500. Book now and get 20% off on first service!', 'Maharashtra', 'MH', 'Pune', 'PNE', '2024-01-15,2024-01-16', 'Test User', '9876543250', '9876543251', '#FFEBEE', '#B71C1C', 'PUBLISHED', true, 'SEARCH', 'd0000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000016', NULL, NULL, 'g0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW());

-- =====================================================
-- POSTER ADS (3 PUBLISHED)
-- =====================================================
INSERT IGNORE INTO poster_ads (id, sequence_number, order_id, status, is_active, dates, state, sid, city, cid, posted_by, page_type, main_category_id, category_one_id, category_two_id, category_three_id, image_id, payment_id, customer_id, created_at, updated_at)
VALUES
('j0000000-0000-0000-0000-000000000001', 1, 'ORD-PA-001', 'PUBLISHED', true, '2024-01-15,2024-01-16,2024-01-17', 'Karnataka', 'KA', 'Bangalore', 'BLR', 'Test User', 'HOME', 'd0000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', NULL, NULL, 'h0000000-0000-0000-0000-000000000001', 'g0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('j0000000-0000-0000-0000-000000000002', 2, 'ORD-PA-002', 'PUBLISHED', true, '2024-01-15,2024-01-16', 'Maharashtra', 'MH', 'Mumbai', 'BOM', 'Test User', 'CATEGORY', 'd0000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000005', 'f2000000-0000-0000-0000-000000000006', NULL, 'h0000000-0000-0000-0000-000000000002', 'g0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('j0000000-0000-0000-0000-000000000003', 3, 'ORD-PA-003', 'PUBLISHED', true, '2024-01-15', 'Delhi', 'DL', 'New Delhi', 'NDL', 'Test User', 'SEARCH', 'd0000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000009', NULL, NULL, 'h0000000-0000-0000-0000-000000000003', 'g0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW());

-- =====================================================
-- VIDEO ADS (1 PUBLISHED)
-- =====================================================
INSERT IGNORE INTO video_ads (id, sequence_number, order_id, status, is_active, dates, state, sid, city, cid, posted_by, page_type, main_category_id, category_one_id, category_two_id, category_three_id, image_id, payment_id, customer_id, created_at, updated_at)
VALUES
('k0000000-0000-0000-0000-000000000001', 1, 'ORD-VA-001', 'PUBLISHED', true, '2024-01-15,2024-01-16,2024-01-17', 'Karnataka', 'KA', 'Bangalore', 'BLR', 'Test User', 'HOME', 'd0000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000001', NULL, 'h0000000-0000-0000-0000-000000000004', 'g0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', NOW(), NOW());

-- =====================================================
-- AD POSITIONS
-- =====================================================
INSERT IGNORE INTO ad_positions (id, page_type, side, position, ad_type, ad_id, created_at, updated_at)
VALUES
('l0000000-0000-0000-0000-000000000001', 'HOME', 'LEFT_SIDE', 1, 'LINE_AD', 'i0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('l0000000-0000-0000-0000-000000000002', 'HOME', 'LEFT_SIDE', 2, 'LINE_AD', 'i0000000-0000-0000-0000-000000000002', NOW(), NOW()),
('l0000000-0000-0000-0000-000000000003', 'HOME', 'RIGHT_SIDE', 1, 'POSTER_AD', 'j0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('l0000000-0000-0000-0000-000000000004', 'HOME', 'CENTER_TOP', 1, 'VIDEO_AD', 'k0000000-0000-0000-0000-000000000001', NOW(), NOW()),
('l0000000-0000-0000-0000-000000000005', 'SEARCH', 'LEFT_SIDE', 1, 'LINE_AD', 'i0000000-0000-0000-0000-000000000005', NOW(), NOW()),
('l0000000-0000-0000-0000-000000000006', 'CATEGORY', 'RIGHT_SIDE', 1, 'POSTER_AD', 'j0000000-0000-0000-0000-000000000002', NOW(), NOW());
