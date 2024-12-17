# Recording Magic

Modern ve kullanıcı dostu bir ekran kayıt uygulaması.

## Özellikler

- 🎥 Ekran kaydı
- 🎦 Kamera + ekran kaydı
- 🎤 Ses kaydı desteği
- 💾 Yerel depolama
- 📊 PostgreSQL veritabanı entegrasyonu
- 🎨 Modern ve kullanıcı dostu arayüz
- 🔄 Otomatik kaydetme
- 📥 Video indirme
- 🗑️ Kayıt silme

## Teknolojiler

- React + TypeScript
- Vite
- TailwindCSS
- PostgreSQL
- Node.js

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/ozzy2438/recording-magic.git
cd recording-magic
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. PostgreSQL veritabanını oluşturun:
```sql
CREATE DATABASE screen_recorder;
```

4. Veritabanı tablolarını oluşturun:
```sql
-- Users tablosu
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recordings tablosu
CREATE TABLE recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    recording_type VARCHAR(50) NOT NULL,
    layout VARCHAR(50),
    has_audio BOOLEAN DEFAULT false,
    has_camera BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

5. Uygulamayı başlatın:
```bash
npm run dev
```

## Kullanım

1. Uygulamayı başlatın
2. Kayıt türünü seçin (ekran, kamera+ekran)
3. Ses ayarlarını yapın
4. Kaydı başlatın
5. Kaydı durdurun
6. Kaydedilen videoyu indirin veya paylaşın

## Lisans

MIT

## İletişim

Osman Orka - osmanorka@gmail.com 