# Merla Coffee — Faz-1 Tasarım Spesifikasyonu

**Tarih:** 2026-09-23  
**Domain:** merlacoffee.de  
**Tip:** Showcase / Tanıtım Sitesi (Faz-1)

---

## 1. Proje Özeti

Merla Coffee için modern, premium, animasyon odaklı bir tanıtım sitesi. Grandaire Coffee gibi referans siteleri geride bırakacak, dark-first luxury estetik, güçlü scroll animasyonları ve yüksek kalite görsel deneyim hedefleniyor.

**Vibe:** Modern + minimalist (A) + Premium/sophisticated (C)  
**Hedef Kitle:** Almanya'daki kahve tutkunları, tasarım bilinci yüksek tüketiciler  
**Dil Desteği:** Almanca (DE), İngilizce (EN), Türkçe (TR)

---

## 2. Tasarım Sistemi

### Dials
- `DESIGN_VARIANCE: 8` — asimetrik layoutlar, offset grid
- `MOTION_INTENSITY: 8` — GSAP scroll-pin, Motion physics, parallax
- `VISUAL_DENSITY: 3` — geniş whitespace, hava, lüks his

### Palette (Placeholder — Gerçek Renkler Sonra Gelecek)
| Token | Değer | Kullanım |
|---|---|---|
| `--color-bg` | `#09090b` (zinc-950) | Ana zemin |
| `--color-surface` | `#18181b` (zinc-900) | Kart / bölüm yüzeyleri |
| `--color-text` | `#fafafa` (zinc-50) | Ana metin |
| `--color-text-muted` | `#a1a1aa` (zinc-400) | İkincil metin |
| `--color-accent` | `#c2603a` | Burnt Sienna — CTA, vurgu |

### Tipografi
- **Display / Başlıklar:** Cabinet Grotesk — `next/font` ile self-hosted
- **Body:** Geist — `next/font` ile self-hosted
- **Başlık scale:** `text-6xl md:text-8xl tracking-tighter leading-none`
- **Body:** `text-base text-zinc-400 leading-relaxed max-w-[65ch]`

### İkon Ailesi
`@phosphor-icons/react` — tek ikon ailesi, `strokeWidth: 1.5`

---

## 3. Stack

| Katman | Seçim |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind v3 |
| Animasyon | `motion/react` + GSAP + ScrollTrigger |
| i18n | `next-intl` |
| İletişim | Resend |
| Deploy | Vercel |
| Domain | merlacoffee.de |

---

## 4. Proje Yapısı

```
/Developer/merlacoffee/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Tüm bölümler tek sayfada
│   │   ├── impressum/        # Yasal zorunlu (DE)
│   │   └── datenschutz/      # DSGVO
│   ├── api/
│   │   └── contact/route.ts  # Resend endpoint
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Nav.tsx               # Server — scroll'da blur
│   ├── Hero.tsx              # "use client" — GSAP scroll-pin
│   ├── About.tsx             # "use client" — whileInView reveal
│   ├── Menu.tsx              # "use client" — tilt cards + filter
│   ├── Location.tsx          # Server — Maps embed + saatler
│   ├── Reviews.tsx           # "use client" — kinetic marquee
│   ├── Contact.tsx           # "use client" — Resend form
│   └── Footer.tsx            # Server
├── messages/
│   ├── de.json
│   ├── en.json
│   └── tr.json
└── public/
    └── images/
```

---

## 5. Bölüm Detayları

### 5.1 Navigasyon
- `zinc-950/80` + `backdrop-blur` — scroll'da opaklık artar
- Sol: Logo (text-based, placeholder)
- Orta: Hero / Menü / Hakkımızda / Konum / İletişim
- Sağ: Dil seçici (DE / EN / TR) + "Rezervasyon" CTA (ileride aktif olacak, şimdilik disabled)
- Mobile: hamburger → full-screen overlay, stagger animasyonlu

### 5.2 Hero
**Paradigma:** Scroll-Pinned Hero  
- Full-bleed kahve fotoğrafı, koyu overlay
- Sol-hizalı başlık: Cabinet Grotesk, `text-6xl md:text-8xl`
- Tagline: max 4 kelime, muted renkte
- Tek CTA: "Menüyü Keşfet" — Burnt Sienna
- GSAP: Hero pinned kalır, About bölümü üzerine slide eder
- Parallax: fotoğraf scroll ile yavaş kayar

### 5.3 Hakkımızda
**Paradigma:** Asymmetric Split  
- Sol: Merla Coffee hikayesi, max 3 paragraf (i18n)
- Sağ: Kahve dükkanı atmosfer fotoğrafı
- Motion `whileInView`: sol soldan, sağ sağdan reveal
- Fotoğraf: hover'da hafif parallax tilt (Motion `useMotionValue`)

### 5.4 Menü
**Paradigma:** Photo Grid + Category Filter  
- Üstte kategori filtreleri (Kahveler / Çaylar / Yiyecekler / Tatlılar)
- Aktif filtre: smooth layout transition (Motion `layout` prop)
- Kart: fotoğraf (piksum placeholder, gerçek fotoğraflar sonra) + ürün adı + fiyat
- Hover: `scale(1.03)` + başlık/fiyat overlay reveal
- Scroll stagger reveal: `motion/react` `whileInView` + `staggerChildren`

### 5.5 Konum & Çalışma Saatleri
**Paradigma:** Split Layout  
- Sol: Google Maps embed (placeholder PIN — adres belli olunca güncellenecek)
- Sağ: Çalışma saatleri tablosu — bugünün günü JS ile highlight
- Alt: Adres + kopyalama butonu (Phosphor `Copy` ikonu)

### 5.6 Yorumlar
**Paradigma:** Kinetic Marquee (sayfa genelinde tek marquee)  
- Sonsuz yatay kayış, hover'da durur
- Her kart: yıldızlar (Phosphor `Star`) + alıntı (max 3 satır) + isim + tarih
- Placeholder yorumlar: i18n destekli

### 5.7 İletişim Formu
**Paradigma:** Minimal Centered Form  
- Alanlar: Ad Soyad, E-posta, Mesaj
- Resend ile backend gönderim (`/api/contact`)
- Submit: buton → spinner → success tick animasyonu (Motion)
- Form validation: client-side

### 5.8 Footer
- Minimal tek satır: Logo + Sosyal medya ikonları + Impressum / Datenschutz + Copyright
- `zinc-900` zemin

---

## 6. i18n Yapısı

`next-intl` ile `[locale]` routing:
- `/de` → Almanca (default)
- `/en` → İngilizce
- `/tr` → Türkçe

`messages/de.json`, `messages/en.json`, `messages/tr.json` — tüm metinler buradan.

---

## 7. Animasyon Özeti

| Bölüm | Teknik | Kütüphane |
|---|---|---|
| Hero scroll-pin | ScrollTrigger pin | GSAP |
| Hero parallax | scrub scroll | GSAP |
| About reveal | `whileInView` | Motion |
| About tilt | `useMotionValue` | Motion |
| Menu filter | `layout` prop | Motion |
| Menu cards | `whileInView` stagger | Motion |
| Reviews marquee | CSS / Motion | Motion |
| Contact submit | `animate` state | Motion |
| Nav blur | scroll listener | Motion `useScroll` |

Tüm animasyonlar `prefers-reduced-motion` ile disable edilir.

---

## 8. SEO & Teknik

- `sitemap.ts` — tüm locale'ler dahil
- `robots.ts`
- `metadata` — her locale için ayrı title/description
- `next/image` — tüm görseller optimize
- Hero görseli: `priority` flag

---

## 9. Açık Maddeler (Faz-1 Sonrası)

- Gerçek lokasyon bilgisi (şehir, adres, saat)
- Gerçek marka renk paleti
- Gerçek logo
- Gerçek menü fotoğrafları ve fiyatları
- Rezervasyon sistemi (Faz-2)
- Galeri bölümü (Faz-2)

---

## 10. Deploy

- Vercel — GitHub repo bağlantısı
- Domain: merlacoffee.de → Vercel DNS
- Environment variables: `RESEND_API_KEY`
