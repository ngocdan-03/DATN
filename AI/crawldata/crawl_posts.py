import json
import random
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from ward_map import WARD_MAP, get_ward_id

def convert_price(price_str):
    if not price_str: return 0
    try:
        num_part = re.search(r"[\d,.]+", price_str).group().replace(',', '.')
        value = float(num_part)
        if "tỷ" in price_str.lower():
            return int(value * 1_000_000_000)
        elif "triệu" in price_str.lower():
            return int(value * 1_000_000)
    except:
        return 0
    return 0

def crawl_danang_real_estate():
    options = Options()
    # options.add_argument("--headless") 
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    wait = WebDriverWait(driver, 15)

    # Danh sách các link gốc Dan cung cấp
    sale_base_url = "https://batdongsandanang.com.vn/tin-bat-dong-san-da-nang/?parent-term=23&term=empty&keyword=&province=48&district=empty&price=0%7C50000000000&area=0%7C900000&pj=empty&wards=empty&street=empty&room=all&direction=all"
    rent_base_url = "https://batdongsandanang.com.vn/tin-bat-dong-san-da-nang/?parent-term=24&term=empty&keyword=&province=48&district=empty&price=0%7C50000000000&area=0%7C900000&pj=empty&wards=empty&street=empty&room=all&direction=all"

    all_links = [] # Chứa tuple (url, listing_type)

    try:
        # BƯỚC 1: GOM LINK TỪ 10 TRANG (5 SALE, 5 RENT)
        pages_to_crawl = [
            (sale_base_url, "SALE"),
            (rent_base_url, "RENT")
        ]

        for base_url, l_type in pages_to_crawl:
            print(f"📂 Đang thu thập link cho mục: {l_type}")
            for p in range(1, 6): # Duyệt từ trang 1 đến trang 5
                paged_url = f"{base_url}&paged={p}"
                driver.get(paged_url)
                time.sleep(3)
                
                cards = driver.find_elements(By.CSS_SELECTOR, "a.view")
                page_links_count = 0
                for card in cards:
                    href = card.get_attribute("href")
                    if href and href not in [l[0] for l in all_links]:
                        all_links.append((href, l_type))
                        page_links_count += 1
                print(f"   Trang {p}: Lấy được {page_links_count} link mới.")

        print(f"\n🚀 Tổng cộng gom được {len(all_links)} link. Bắt đầu cào chi tiết...")

        # BƯỚC 2: CÀO CHI TIẾT TỪNG BÀI
        final_posts = []
        ward_id_pool = list(WARD_MAP.values())

        for i, (url, l_type) in enumerate(all_links):
            if i >= 100: break # Dừng khi đủ 100 bài
            try:
                driver.get(url)
                time.sleep(2)

                # Title
                title = wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[4]/div[1]/div/div/div/div/div/h2"))).text
                
                # Địa chỉ & Phường
                full_addr = driver.find_element(By.XPATH, "/html/body/div[1]/div[4]/div[1]/div/div/div/div/div/div/p").text
                parts = [p.strip() for p in full_addr.split(',')]
                street_address = parts[0] if len(parts) > 0 else "Đang cập nhật"
                
                candidate_ward = parts[1] if len(parts) > 1 else ""
                ward_id = get_ward_id(f"phường {candidate_ward}") or get_ward_id(candidate_ward)
                if not ward_id:
                    ward_id = random.choice(ward_id_pool)

                # Giá & Diện tích
                price_raw = driver.find_element(By.XPATH, "/html/body/div[1]/div[4]/div[3]/div/div/div[1]/div[2]/ul/li[1]/b").text
                area_raw = driver.find_element(By.XPATH, "/html/body/div[1]/div[4]/div[3]/div/div/div[1]/div[2]/ul/li[2]/b").text
                
                price = convert_price(price_raw)
                area_match = re.search(r"\d+", area_raw)
                area = int(area_match.group()) if area_match else 0

                # Mô tả
                desc_div = driver.find_element(By.XPATH, "/html/body/div[1]/div[4]/div[3]/div/div/div[1]/div[3]/div[1]/div[2]/div")
                description = "\n".join([p.text for p in desc_div.find_elements(By.TAG_NAME, "p") if p.text.strip() != ""])

                # Logic ngẫu nhiên
                pt = random.choice(['LAND', 'HOUSE', 'APARTMENT'])
                beds = baths = 0
                if pt != 'LAND':
                    beds, baths = random.randint(1, 5), random.randint(1, 5)

                post_item = {
                    "user_id": random.randint(2, 9),
                    "ward_id": ward_id,
                    "title": title,
                    "bedrooms": beds,
                    "bathrooms": baths,
                    "street_address": street_address,
                    "thumbnail_url": f"/assets/posts/posts{random.randint(1, 10)}.png",
                    "price": price,
                    "area": area,
                    "property_type": pt,
                    "listing_type": l_type,
                    "legal_status": random.choice(['SO_DO', 'SO_HONG', 'HD_MUA_BAN', 'GIAY_TAY', 'DANG_CHO_SO']),
                    "description": description[:5000],
                    "status": random.choice(['PENDING', 'APPROVED', 'DELETED', 'REJECTED'])
                }

                final_posts.append(post_item)
                print(f"  ✅ [{i+1}/{len(all_links)}] {title[:35]}...")

            except Exception as e:
                print(f"  ❌ Lỗi tại bài {i+1}: {e}")

        # Lưu file JSON
        with open('posts_danang_100.json', 'w', encoding='utf-8') as f:
            json.dump(final_posts, f, ensure_ascii=False, indent=4)
        print(f"\n🎉 Xong! Đã lưu {len(final_posts)} bài vào 'posts_danang_100.json'.")

    finally:
        driver.quit()

if __name__ == "__main__":
    crawl_danang_real_estate()