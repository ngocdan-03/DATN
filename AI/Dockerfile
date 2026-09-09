FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Cài Torch bản CPU-only trước, tránh pip tự động tải kèm CUDA (~2-3GB không cần thiết vì Render không có GPU)
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch

# Cài các dependency còn lại
RUN pip install --no-cache-dir -r requirements.txt

# Tải sẵn model embedding lúc build, tránh phải tải lại mỗi lần container khởi động
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')"

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]