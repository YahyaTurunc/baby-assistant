# 👶 Baby Assistant

Baby Assistant, anneler ve babalar için geliştirilmiş, bebek gelişimini ve günlüklerini kolayca takip edebileceğiniz, yapay zeka destekli modern bir mobil uygulamadır.

## 🚀 Özellikler

- **Giriş ve Kayıt:**
  - Google ile giriş veya üye olmadan devam etme
- **Bebek Bilgileri:**
  - Bebek adı, doğum tarihi, cinsiyet ve fotoğraf ekleme
- **Günlük:**
  - Her gün için notlar ekleyin, düzenleyin, silin ve geçmişi görüntüleyin
- **AI Chat:**
  - OpenAI ile entegre, yapay zekaya soru sorabilir, yanıtları kaydedebilir ve geçmişi inceleyebilirsiniz
- **Profil:**
  - Bebek bilgilerini dilediğiniz zaman güncelleyebilirsiniz
- **Modern ve Responsive Tasarım:**
  - Dark mode desteği, pastel renkler, kullanıcı dostu arayüz
- **Firebase Entegrasyonu:**
  - Tüm chat geçmişi ve günlükler Firestore'da saklanır

## 🛠️ Kurulum

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kullanici-adi/baby-assistant.git
cd baby-assistant
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Firebase Yapılandırması
- [Firebase Console](https://console.firebase.google.com/) üzerinden bir proje oluşturun
- Firestore Database'i etkinleştirin
- `app/firebaseConfig.ts` dosyasındaki alanları kendi projenizin bilgileriyle doldurun:
  ```ts
  const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  };
  ```
- Firestore kurallarını geliştirme/test için aşağıdaki gibi ayarlayabilirsiniz:
  ```
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```

### 4. OpenAI API Anahtarı
- [OpenAI](https://platform.openai.com/api-keys) üzerinden bir API anahtarı oluşturun
- Proje kök dizinine `.env` dosyası oluşturun ve aşağıdaki satırı ekleyin:
  ```env
  EXPO_PUBLIC_OPENAI_API_KEY=sk-xxxxxx
  ```
- (Expo ile çalışıyorsanız `EXPO_PUBLIC_` prefixi gereklidir)

### 5. Uygulamayı Başlatın
```bash
npx expo start
```
veya
```bash
npm run start
```

## 📱 Ekranlar
- **Giriş:** Modern karşılama ve giriş seçenekleri
- **Bebek Bilgileri:** İlk kurulumda ve profil ekranında düzenlenebilir
- **Günlük:** Not ekleme, silme, detay görüntüleme
- **AI Chat:** Sohbet geçmişi, yeni chat başlatma, silme, detay
- **Profil:** Bebek bilgilerini güncelleme

## 💡 Notlar
- Uygulama Expo ile geliştirilmiştir, hem iOS hem Android desteği vardır.
- Tüm veriler Firebase Firestore'da saklanır.
- OpenAI API anahtarınızı kimseyle paylaşmayın.
- Firestore kurallarınızı canlıya çıkmadan önce güvenli hale getirin!

## 🧑‍💻 Katkı
Katkıda bulunmak isterseniz PR gönderebilir veya issue açabilirsiniz.

## 📄 Lisans
MIT
