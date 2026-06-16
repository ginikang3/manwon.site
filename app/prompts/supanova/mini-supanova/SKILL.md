---

name: supanova-full-output
description: Enforces complete landing page output. Never omit sections, replace content with placeholders, or return incomplete HTML.
--------------------------------------------------------------------------------------------------------------------------------------

# Supanova Full Output

Generate a complete, production-ready landing page.

## Required Structure

A landing page must include:

1. Navigation
2. Hero
3. Social Proof
4. Features
5. Testimonials or Case Studies
6. CTA
7. Footer

## Required HTML

Output must contain:

* `<!DOCTYPE html>`
* `<html>`
* `<head>`
* `<body>`
* Closing `</html>`

All tags must be properly closed.

## Forbidden

Never:

* Output only part of a landing page
* Skip middle sections
* Generate skeletons or wireframes
* Describe what should be built instead of building it
* Use placeholders as replacements for real content

Forbidden patterns:

```html
<!-- ... -->
<!-- rest of sections -->
<!-- similar to above -->
<!-- add more sections as needed -->
<!-- TODO -->
```

```js
// ...
```

```txt
...
```

Forbidden phrases:

* Let me know if you want me to continue
* I can add more sections if needed
* For brevity
* The rest follows the same pattern
* Similarly for the remaining sections
* I'll leave that for you to customize

## Quality Requirements

* Use real content, never placeholder text
* Use responsive layouts
* Include hover states for interactive elements
* Use valid image sources
* Use Iconify icons when icons are present
* Ensure the page is usable on mobile and desktop

## Final Validation

Before responding, verify:

* Complete HTML document exists
* All required sections exist
* No forbidden patterns exist
* No requested content was omitted
* Output is fully renderable HTML

## Critical Output Rule

When generating HTML:

- Output ONLY the HTML code
- Do not explain the code
- Do not add introductions
- Do not add markdown before the code
- Do not wrap the code in explanations
- Start directly with <!DOCTYPE html>
- End directly with </html>

Violation of this rule means the output is incomplete.
---

name: supanova-premium-aesthetic
description: Generates premium Korean landing pages with strong visual hierarchy, refined spacing, modern motion, and consistent mobile-first design.
-----------------------------------------------------------------------------------------------------------------------------------------------------

# Supanova Premium Aesthetic

## Core Objective

Create landing pages that feel premium, intentional, and professionally designed.

The design must:

* Avoid generic AI-template appearance
* Use strong visual hierarchy
* Use generous whitespace
* Feel modern on both mobile and desktop
* Maintain visual consistency throughout the page

---

## Design Rules

### Fonts

Use:

* Pretendard for Korean content

Do not use:

* Arial
* Helvetica
* Roboto
* Open Sans
* Malgun Gothic
* Noto Sans KR

---

### Icons

Use only:

```html
<iconify-icon icon="solar:..."></iconify-icon>
```

---

## Layout System

Use one of the following structures:

### Bento Layout

* Mixed card sizes
* Visual variation
* Strong hierarchy

### Editorial Split Layout

* Content and visual areas clearly separated
* Large typography
* Strong focal point

### Mobile Rules

Below tablet size:

* Single column layout
* No horizontal scrolling
* Full width sections
* Comfortable spacing

Use:

```html
min-h-[100dvh]
```

instead of:

```html
h-screen
```

---

## Card System

Premium cards should use a layered structure.

Outer wrapper:

```html
bg-white/5
border border-white/10
rounded-[2rem]
p-1.5
```

Inner content:

```html
rounded-[calc(2rem-0.375rem)]
```

Cards should feel elevated and intentional rather than flat.

---

## Buttons

CTA buttons must:

* Use rounded pill shapes
* Have generous padding
* Include hover feedback
* Include active feedback

Recommended:

```html
rounded-full
px-8
py-4
```

Hover:

```css
transform: scale(1.02);
```

Active:

```css
transform: scale(0.98);
```

---

## Spacing

Use generous whitespace.

Section spacing:

```html
py-24 md:py-32 lg:py-40
```

Use small eyebrow labels above major headings.

Example:

```html
rounded-full
px-3
py-1
text-xs
tracking-widest
```

---

## Korean Typography

Use:

```css
break-keep-all;
```

Headlines:

```html
leading-snug
```

Body:

```html
leading-relaxed
```

---

## Motion

Use:

```css
transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
```

for interactive elements.

Do not use:

```css
linear
ease-in-out
```

---

## Scroll Animations

Use IntersectionObserver.

Recommended animation:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
    filter: blur(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

Elements should animate into view instead of appearing instantly.

---

## Decorative Motion

Subtle background motion is allowed.

Example:

```css
@keyframes float {
  0%,100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }
}
```

Only animate:

* transform
* opacity

---

## Navigation

Navigation should feel detached from the page.

Recommended:

```html
backdrop-blur-xl
bg-white/10
border border-white/10
rounded-full
```

Avoid traditional edge-to-edge sticky bars.

---

## Images

Hero image:

```html
loading="eager"
```

Other images:

```html
loading="lazy"
decoding="async"
```

Use:

```html
object-cover
```

for image presentation.

---

## Quality Requirements

Always ensure:

* Strong visual hierarchy
* Consistent spacing
* Mobile-first responsiveness
* Smooth interactions
* Premium card styling
* Premium CTA styling
* Natural Korean typography
* No horizontal scrolling
* No placeholder content
* No unfinished sections
* No generic template appearance

---

name: supanova-design-engine
description: Generates premium business landing pages using standalone HTML and Tailwind CSS. Focuses on typography, spacing, responsiveness, conversion, and visual quality while avoiding generic AI-generated layouts.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Supanova Design Engine

## Core Rules

Generate a complete standalone HTML landing page.

Requirements:

* Single HTML file
* Tailwind CDN
* Pretendard font
* Iconify Solar icons
* Mobile-first
* Responsive on mobile, tablet, desktop
* Natural Korean copy
* Production-ready output

---

## Typography

### Font

Primary:

* Pretendard

Forbidden:

* Inter
* Noto Sans KR
* Roboto
* Arial
* Open Sans

### Korean Text

Use:

* break-keep-all
* leading-tight
* leading-snug
* leading-relaxed

Avoid:

* leading-none

Headline guideline:

```css
text-4xl md:text-5xl lg:text-6xl
font-bold
tracking-tight
```

Body guideline:

```css
text-base md:text-lg
leading-relaxed
```

---

## Layout

Always:

```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

Mobile First.

Layout rules:

* Mobile: 1 column
* Tablet: up to 2 columns
* Desktop: up to 3 columns

Forbidden:

```css
h-screen
```

Use:

```css
min-h-[100dvh]
```

Avoid repetitive layouts.

Adjacent sections should not use identical structures.

---

## Colors

Use:

* One accent color per page
* Neutral premium base colors

Recommended:

* Zinc
* Slate
* Stone
* Emerald
* Amber
* Deep Rose

Forbidden:

* Neon glow
* Purple AI gradients
* Oversaturated accents
* Pure black (#000000)

---

## Cards

Use cards only when hierarchy is needed.

Premium card style:

```css
bg-white/5
border border-white/10
backdrop-blur
shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
```

Avoid generic gray borders.

---

## Buttons

CTA buttons must include:

* Hover state
* Active state
* Focus state

Minimum touch size:

```css
min-height: 48px;
```

Recommended:

```css
px-8 py-4
rounded-full
```

Transition:

```css
transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
```

---

## Icons

Use only:

```html
<iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
```

Library:

```html
https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js
```

Do not use:

* Emoji
* Font Awesome
* Lucide
* Material Icons

---

## Images

Requirements:

Hero image:

```html
loading="eager"
```

Other images:

```html
loading="lazy"
decoding="async"
```

Use:

```css
object-cover
```

Never use broken URLs.

---

## Motion

Animate only:

* transform
* opacity

Never animate:

* top
* left
* width
* height

Use:

* IntersectionObserver

Do not use:

```js
window.addEventListener('scroll')
```

Example animation:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Content Standards

Write natural Korean.

Use:

* 합니다
* 하세요

Avoid AI cliché phrases:

* 혁신적인
* 획기적인
* 차세대
* 게임 체인저
* 원활한

Prefer concrete language.

Good:

* 3분 만에 예약 가능
* 상담 신청 후 바로 연락
* 모바일에서도 쉽게 이용 가능

Bad:

* 혁신적인 고객 경험
* 차세대 솔루션

---

## Performance

Maximum external resources:

* Tailwind
* Pretendard
* Iconify

Keep external dependencies minimal.

Use:

```html
loading="lazy"
decoding="async"
```

for non-hero images.

---

## Quality Checklist

Before output:

* Complete HTML document
* Properly closed tags
* Responsive layout
* Pretendard loaded
* Iconify Solar used
* Mobile-first design
* CTA tap targets >= 48px
* No emoji
* No banned fonts
* No placeholder content
* No repetitive layouts
* Natural Korean copy
* Premium visual quality
