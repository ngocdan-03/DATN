import json
import random
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def crawl_100_news_danang():
    # 1. Cấu hình trình duyệt (Chạy ẩn - Headless để tăng tốc)
    options = Options()
    # options.add_argument("--headless") 
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    wait = WebDriverWait(driver, 15)

    try:
        target_count = 100
        article_links = []
        current_page = 1

        print(f"🔍 Đang thu thập {target_count} đường dẫn bài viết...")

        # Bước 1: Thu thập đủ 100 URL bài viết
        while len(article_links) < target_count:
            # Truy cập trang danh sách tin tức theo phân trang
            url_list = f"https://batdongsandanang.com.vn/tin-tuc/page/{current_page}/"
            driver.get(url_list)
            
            # Tìm các thẻ a.view trong danh sách (liên quan đến XPath /div[11]/ul mà Dan cung cấp)
            links_elements = driver.find_elements(By.CSS_SELECTOR, "a.view")
            
            if not links_elements:
                print("⚠️ Đã hết bài viết để cào.")
                break

            for el in links_elements:
                link = el.get_attribute("href")
                title = el.get_attribute("title")
                
                # Tránh trùng lặp đường dẫn
                if not any(a['url'] == link for a in article_links):
                    article_links.append({"title": title, "url": link})
                
                if len(article_links) >= target_count:
                    break
            
            print(f"   📂 Trang {current_page}: Đã lấy được tổng {len(article_links)} link.")
            current_page += 1
            time.sleep(1) # Nghỉ ngắn để không gây áp lực lên server

        # Bước 2: Truy cập từng bài để bóc tách nội dung chi tiết
        print(f"\n🚀 Bắt đầu cào nội dung chi tiết cho {len(article_links)} bài...")
        final_data = []
        categories = ['MARKET', 'GUIDE', 'LAW', 'PROJECT']
        statuses = ['PUBLISHED', 'HIDDEN']

        for i, article in enumerate(article_links):
            try:
                driver.get(article['url'])
                
                # Sử dụng XPath nội dung Dan cung cấp: /html/body/div[1]/div[4]/div/div/div[2]/div/div[2]
                content_xpath = "/html/body/div[1]/div[4]/div/div/div[2]/div/div[2]"
                content_container = wait.until(EC.presence_of_element_located((By.XPATH, content_xpath)))
                
                # Lấy tất cả nội dung trong các thẻ p
                p_tags = content_container.find_elements(By.TAG_NAME, "p")
                raw_text = "\n".join([p.text for p in p_tags if p.text.strip() != ""])
                
                # Giới hạn nội dung 5000 ký tự để an toàn cho kiểu dữ liệu TEXT trong MySQL
                summary_text = raw_text[:5000]
                if len(raw_text) > 5000:
                    summary_text = summary_text.rsplit(' ', 1)[0] + "..."

                # Đóng gói dữ liệu khớp với Database
                news_item = {
                    "author_id": 1,
                    "title": article['title'],
                    "summary": summary_text,
                    "thumbnail_url": f"/assets/news/news{random.randint(1, 10)}.png",
                    "original_url": article['url'],
                    "source_name": "batdongsandanang.com.vn",
                    "category": random.choice(categories),
                    "status": random.choice(statuses)
                }
                
                final_data.append(news_item)
                print(f"   ✅ [{i+1}/{len(article_links)}] Xong: {article['title'][:45]}...")

                # Cứ cào được 10 bài thì nghỉ 3 giây để tránh bị block IP
                if (i + 1) % 10 == 0:
                    time.sleep(3)

            except Exception as e:
                print(f"   ❌ Lỗi tại bài {i+1}: {e}")

        # Bước 3: Xuất file JSON
        output_file = 'batdongsan_danang_100.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=4)
        
        print(f"\n🎉 Hoàn thành! Đã lưu {len(final_data)} bài vào '{output_file}'.")

    finally:
        driver.quit()

if __name__ == "__main__":
    crawl_100_news_danang()