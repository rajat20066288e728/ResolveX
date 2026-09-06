# Complaint Management App — Design System

A mobile app for managing service complaints (e.g. home/appliance repair requests), covering a **Home / Dashboard** screen and a **Complaint List** screen.

---

## 1. Screens Overview

### 1.1 Home / Dashboard
- Header with user greeting, avatar, search, and notification icons
- Primary CTA: "New Complaint"
- Stats summary grid (Last 90 Days)
- "Recent Complaints" list with status badges
- Bottom tab navigation

### 1.2 Complaint List
- Back navigation + search
- Page title with "+" add action
- Filter pills (status tabs) + filter/sort icon
- Scrollable list of complaint cards

---

## 2. Color Palette

| Token | Hex (approx.) | Usage |
|---|---|---|
| `primary-blue-dark` | `#1E3A8A` / `#1D3F91` | Header gradient (top), primary buttons, active states |
| `primary-blue` | `#2F6FE0` | Header gradient (bottom), links, active tab pill |
| `primary-blue-light` | `#DCE7FB` | Stat card backgrounds (Total/Open/Closed/Reopen) |
| `surface-white` | `#FFFFFF` | Cards, bottom sheet background, inactive stat cards |
| `background-gray` | `#F5F6F8` | Screen background behind cards |
| `text-primary` | `#0F1B3D` / `#12224A` | Headings, primary text, stat numbers |
| `text-secondary` | `#6B7280` | Meta text (labels, dates, "Last 90 Days") |
| `text-muted` | `#9CA3AF` | Placeholder body copy (lorem ipsum) |
| `status-open` | `#2F6FE0` (blue pill) | "Open" badge |
| `status-resolved` | `#16A34A` (green pill) | "Resolved" badge |
| `status-reopen` | `#F59E0B` (orange/amber pill) | "Reopen" badge |
| `divider` | `#E5E7EB` | Card borders, separators |
| `icon-default` | `#9CA3AF` | Bottom nav inactive icons |
| `icon-active` | `#2F6FE0` | Bottom nav active icon (Home) |

**Header gradient:** linear, top-left `primary-blue-dark` → bottom-right `primary-blue`, diagonal ~135°.

---

## 3. Typography

Font family: a clean geometric/humanist sans-serif (e.g. **Inter**, **SF Pro**, or **Poppins**).

| Style | Size | Weight | Usage |
|---|---|---|---|
| Display / Name | 18–20px | Semibold (600) | "Salah Uddin" |
| Screen Title | 20–22px | Bold (700) | "Complaint Lists" |
| Section Title | 16–18px | Semibold (600) | "Recent Complaints", "Complaint Lists" |
| Stat Number | 22–24px | Bold (700) | "114", "99", "13", "2", "33", "6" |
| Body / Card Title | 14–15px | Semibold (600) | "AC Repairing Services" |
| Body Text | 13px | Regular (400) | Placeholder description text |
| Caption / Meta | 11–12px | Regular (400) | ID, phone number, dates, "Total/Open/Closed" labels |
| Badge Label | 11–12px | Medium (500) | "Open", "Resolved", "Reopen" |
| Nav Label | 11px | Medium (500) | "Home", "Update", "Help", "More" |

---

## 4. Components

### 4.1 Top Header (Home)
- Gradient blue background, rounded bottom corners
- Left: circular avatar (40px) + name (white, semibold) + phone number (white, 70% opacity, small)
- Right: search icon + notification bell icon (white, outlined, 24px)

### 4.2 Primary Button ("New Complaint")
- Full-width, pill/rounded-rect (~12px radius)
- Dark navy fill, white bold text, "+" icon prefix
- Sits on top of gradient header (elevated/white-bordered card feel)

### 4.3 Stat Cards
- 3-column grid (row 1: Total, Open, Closed, Reopen as 4 equal cells) + 2-column row (Users, Area)
- Light blue-tinted cards for metric cells, rounded corners (~10px)
- Large bold number on top, small gray label below, centered
- White cards for "Users" / "Area" wider cells

### 4.4 Complaint Card
- White background, rounded corners (~12px), subtle border/shadow
- Top row: ID label (gray, small) + status badge (top-right, pill-shaped, colored fill, white text)
- Title row: service name (bold) + small edit/pencil icon
- Body: 2-line muted placeholder description
- Footer row: small circular avatar/logo + business name (blue link-style) + location (gray caption) — right-aligned created/updated dates (gray, small, right-justified two lines)

### 4.5 Status Badge
- Rounded pill, ~12px vertical padding-equivalent, small caps text
- Colors: Open = blue, Resolved = green, Reopen = orange
- White text, medium weight

### 4.6 Filter Pills (Complaint List screen)
- Horizontal row, rounded full pills
- Active: solid blue fill, white text, includes count e.g. "Open (99)"
- Inactive: white/outlined, gray text, gray border
- Trailing filter/sort icon button (outlined circle)

### 4.7 Bottom Navigation
- 4 items: Home, Update, Help, More
- Icons + label, active item (Home) in blue with filled icon, others gray outline
- White background, top hairline border

### 4.8 List Header ("Recent Complaints")
- Section title left, "View All" link (blue) right-aligned

---

## 5. Layout & Spacing

- **Grid:** single-column mobile layout, ~16px screen padding
- **Corner radius scale:** 8px (badges/small chips) · 12px (cards, buttons) · 20–24px (header bottom curve, avatar containers)
- **Card spacing:** 12–16px vertical gap between list cards
- **Stat grid gap:** ~8–10px between cells
- **Icon size:** 20–24px for nav/header icons, 32–40px avatars in cards, 40px header avatar

---

## 6. Iconography
- Outline-style icon set (search, bell, chevron-back, pencil/edit, filter/sliders, plus)
- Bottom nav uses simple line icons with a filled/active variant for the selected tab
- "+" icons used consistently for add actions (New Complaint button, add complaint icon top-right of list)

---

## 7. Tone & Style
- Clean, functional B2B/utility app aesthetic
- Trustworthy blue as brand color, high contrast white cards on light gray canvas
- Status-driven color coding (blue/green/orange) is the primary visual language for scannability
- Rounded, friendly geometry throughout (buttons, cards, badges, avatars)
