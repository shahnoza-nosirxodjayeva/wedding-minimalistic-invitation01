import http from 'node:http';
import { spawn } from 'node:child_process';

const invitationFieldList = `<pre><code>import { useInvitation } from '@envitepkg/template-sdk/react';
const invitation = useInvitation();</code></pre>
<ul class="field-list">
<li><code>invitation.couple.groom.name</code> — groom name</li><li><code>invitation.couple.groom.fullName</code> — groom full name</li>
<li><code>invitation.couple.bride.name</code> — bride name</li><li><code>invitation.couple.bride.fullName</code> — bride full name</li>
<li><code>invitation.event.title</code> — event title</li><li><code>invitation.event.type</code> — event type</li>
<li><code>invitation.event.date</code> — ISO date</li><li><code>invitation.event.time</code> — time</li><li><code>invitation.event.timezone</code> — timezone</li>
<li><code>invitation.venue.name</code> — venue</li><li><code>invitation.venue.address</code> — address</li>
<li><code>invitation.venue.latitude</code> / <code>longitude</code> — Google Maps coordinates</li>
<li><code>invitation.story</code> — story</li><li><code>invitation.dressCode</code> — dress code</li>
<li><code>invitation.schedule</code> — schedule list</li><li><code>invitation.gallery</code> — image list</li>
<li><code>invitation.guests</code> — guest list</li><li><code>invitation.guest</code> — current personalized guest</li>
<li><code>invitation.wishes</code> — wishes</li><li><code>invitation.music</code> — music</li><li><code>invitation.rsvp</code> — RSVP runtime data</li>
</ul>
<pre><code>&lt;h1&gt;
  {invitation.couple.groom.name}
  {' &amp; '}
  {invitation.couple.bride.name}
&lt;/h1&gt;</code></pre>
<p><strong>Vanilla:</strong></p><pre><code>import { getInvitation } from '@envitepkg/template-sdk';
const invitation = getInvitation();
document.querySelector('[data-groom]').textContent = invitation.couple.groom.name;</code></pre>`;

const shared = {
  en: {
    label: 'Beginner guide', intro: 'Build invitation templates locally with React or Vanilla, Vite, mock data, and UZ/RU/EN translations.',
    items: [
      ['start','Getting started','Run <code>envite create-template my-invitation</code>, choose your stack, Style and Theme, then use <code>envite dev</code>. Edit application code in <code>src/</code> and preview content in <code>mock/</code>.<pre><code>envite validate\nenvite build\nenvite package</code></pre>'],
      ['choices','Style and Theme','Style controls the visual direction: <strong>Classic, Luxe, Romantic, Minimal, Modern</strong>. Theme controls the scenario: <strong>Wedding, Marry Me, Date, Birthday, Party</strong>. Both are stored in <code>template.config.ts</code> and applied as root CSS classes.'],
      ['structure','Project structure','<code>src/</code> is product code, <code>mock/</code> is local content, and <code>template.config.ts</code> is metadata. <code>.envite/</code> contains local preview tooling and docs only; it is excluded from production builds and source packages.'],
      ['i18n','i18n by default','Every new project includes Uzbek, Russian, and English resources. Keep interface text in locale files, read it with <code>t(key)</code>, and switch with <code>setLanguage</code>. Use <code>--no-i18n</code> only for an intentional single-language template.'],
      ['data','Data and Google Maps','Edit invitation, guests, wishes, media, schedule, and ad preview data in <code>mock/</code>. Venue coordinates generate a Google Maps embed and an “Open in Google Maps” link. Mock data is not an account, token, or backend.'],
      ['fields','Invitation field reference',`Connect the SDK once, then render dynamic fields instead of hard-coding names, dates, or addresses. Arrays such as schedule, gallery, guests, and wishes should be rendered with <code>map()</code>.${invitationFieldList}`],
      ['frameworks','React and Vanilla','React templates use <code>useInvitation</code>, <code>useTranslation</code>, and <code>&lt;AdField /&gt;</code>. Vanilla templates use <code>getInvitation</code>, <code>configureI18n</code>, and <code>resolveAdField</code>. Keep guest content in runtime data instead of hard-coding it in components.'],
      ['ads','Monetization · Ad Fields','Ad fields reserve controlled positions for Envite advertisements. Templates do not control campaigns, targeting, billing, tracking, or eligibility. A hidden field renders no element and leaves no layout gap.'],
      ['quality','Validate, build, package','<code>envite validate</code> checks config, imports, locales, dependencies, assets, and mock JSON. <code>envite build</code> validates before Vite builds. <code>envite package</code> produces a portable <code>.envite</code> without local docs, mock data, or secrets.'],
      ['ai','AI Skill','The Envite AI Skill teaches coding agents the SDK, generated structure, validation rules, and safe editing boundaries. Give the agent one concrete task, ask it to read the skill first, and finish with <code>npm run validate</code>. Never paste passwords, tokens, private guest data, or production credentials into a prompt.<pre><code>Read the Envite skill, add an RSVP section,\nkeep UZ/RU/EN translations, then validate.</code></pre>'],
      ['help','Troubleshooting','Run <code>envite doctor</code> for environment diagnostics. For a CSS <code>@import</code> error, keep font and Tailwind imports at the very top. For packaging, run validate, build, then package.'],
    ],
  },
  ru: {
    label: 'Руководство для начинающих', intro: 'Создавайте шаблоны локально: React или Vanilla, Vite, mock-данные и переводы UZ/RU/EN.',
    items: [
      ['start','Быстрый старт','Запустите <code>envite create-template my-invitation</code>, выберите стек, Style и Theme, затем выполните <code>envite dev</code>. Код находится в <code>src/</code>, данные предпросмотра — в <code>mock/</code>.<pre><code>envite validate\nenvite build\nenvite package</code></pre>'],
      ['choices','Style и Theme','Style задаёт оформление: <strong>Classic, Luxe, Romantic, Minimal, Modern</strong>. Theme задаёт сценарий: <strong>Wedding, Marry Me, Date, Birthday, Party</strong>. Значения сохраняются в <code>template.config.ts</code> и добавляются CSS-классами на корневой элемент.'],
      ['structure','Структура проекта','<code>src/</code> — код, <code>mock/</code> — локальные данные, <code>template.config.ts</code> — метаданные. В <code>.envite/</code> лежат только локальная документация и preview-инструменты; в production build и пакет они не попадают.'],
      ['i18n','i18n по умолчанию','Новый проект сразу содержит узбекский, русский и английский. Текст храните в locale-файлах, получайте через <code>t(key)</code>, язык меняйте через <code>setLanguage</code>. <code>--no-i18n</code> нужен только для одноязычного шаблона.'],
      ['data','Данные и Google Maps','Приглашение, гости, пожелания, медиа, расписание и тестовая реклама находятся в <code>mock/</code>. Координаты площадки создают встроенную Google-карту и ссылку открытия в Google Maps. Mock-данные не являются аккаунтом, токеном или backend.'],
      ['fields','Поля приглашения',`Один раз подключите SDK и выводите динамические поля вместо жёстко записанных имён, дат и адресов. Массивы schedule, gallery, guests и wishes выводятся через <code>map()</code>.${invitationFieldList}`],
      ['frameworks','React и Vanilla','В React используйте <code>useInvitation</code>, <code>useTranslation</code> и <code>&lt;AdField /&gt;</code>. В Vanilla — <code>getInvitation</code>, <code>configureI18n</code> и <code>resolveAdField</code>. Контент гостей храните в данных, а не жёстко в компонентах.'],
      ['ads','Рекламные поля','Ad Field резервирует управляемое Envite место. Шаблон не управляет кампаниями, таргетингом, оплатой или аналитикой. Скрытое поле не оставляет пустого отступа.'],
      ['quality','Проверка, сборка, пакет','<code>envite validate</code> проверяет конфиг, импорты, локали, зависимости, assets и mock JSON. <code>envite build</code> сначала валидирует проект. <code>envite package</code> создаёт <code>.envite</code> без локальных docs, mock и секретов.'],
      ['ai','AI Skill','Envite AI Skill объясняет агенту SDK, структуру и правила безопасных изменений. Дайте одну конкретную задачу, попросите сначала прочитать skill и завершить работу командой <code>npm run validate</code>. Не передавайте AI пароли, токены, приватные данные гостей и production credentials.<pre><code>Прочитай Envite skill, добавь RSVP,\nсохрани UZ/RU/EN и запусти validation.</code></pre>'],
      ['help','Решение проблем','<code>envite doctor</code> проверяет окружение. При ошибке CSS <code>@import</code> оставьте импорты шрифтов и Tailwind в самом начале. Порядок упаковки: validate, build, package.'],
    ],
  },
  uz: {
    label: 'Boshlovchilar uchun qo‘llanma', intro: 'React yoki Vanilla, Vite, mock ma’lumotlar va UZ/RU/EN tarjimalari bilan lokal shablon yarating.',
    items: [
      ['start','Tez boshlash','<code>envite create-template my-invitation</code> ni ishga tushiring, stack, Style va Theme tanlang, keyin <code>envite dev</code> bajaring. Kod <code>src/</code>, preview ma’lumotlari <code>mock/</code> ichida.<pre><code>envite validate\nenvite build\nenvite package</code></pre>'],
      ['choices','Style va Theme','Style ko‘rinishni belgilaydi: <strong>Classic, Luxe, Romantic, Minimal, Modern</strong>. Theme senariyni belgilaydi: <strong>Wedding, Marry Me, Date, Birthday, Party</strong>. Qiymatlar <code>template.config.ts</code> va ildiz CSS klasslariga yoziladi.'],
      ['structure','Loyiha tuzilishi','<code>src/</code> — kod, <code>mock/</code> — lokal ma’lumotlar, <code>template.config.ts</code> — metadata. <code>.envite/</code> faqat lokal docs va preview vositalarini saqlaydi; production build va paketga kirmaydi.'],
      ['i18n','i18n standart holatda','Har bir yangi loyiha o‘zbek, rus va ingliz tarjimalari bilan yaratiladi. Matnlarni locale fayllarda saqlang, <code>t(key)</code> bilan oling va <code>setLanguage</code> bilan tilni almashtiring. <code>--no-i18n</code> faqat bir tilli shablon uchun.'],
      ['data','Ma’lumotlar va Google Maps','Taklifnoma, mehmonlar, tilaklar, media, jadval va test reklama <code>mock/</code> ichida. Manzil koordinatalari Google Maps xaritasi va havolasini yaratadi. Mock ma’lumot account, token yoki backend emas.'],
      ['fields','Taklifnoma maydonlari',`SDKni bir marta ulang va ism, sana yoki manzilni kodga qattiq yozish o‘rniga dinamik maydonlarni ishlating. schedule, gallery, guests va wishes ro‘yxatlari <code>map()</code> bilan chiqariladi.${invitationFieldList}`],
      ['frameworks','React va Vanilla','React uchun <code>useInvitation</code>, <code>useTranslation</code> va <code>&lt;AdField /&gt;</code> ishlating. Vanilla uchun <code>getInvitation</code>, <code>configureI18n</code> va <code>resolveAdField</code>. Mehmon ma’lumotini komponentga qattiq yozmang.'],
      ['ads','Reklama maydonlari','Ad Field Envite boshqaradigan reklama joyini ajratadi. Shablon kampaniya, targeting, billing yoki trackingni boshqarmaydi. Yashirilgan maydon bo‘sh joy qoldirmaydi.'],
      ['quality','Tekshirish, build va paket','<code>envite validate</code> config, import, locale, dependency, asset va mock JSON ni tekshiradi. <code>envite build</code> Vite builddan oldin validatsiya qiladi. <code>envite package</code> lokal docs, mock va secretlarsiz <code>.envite</code> yaratadi.'],
      ['ai','AI Skill','Envite AI Skill agentga SDK, tuzilma va xavfsiz tahrirlash qoidalarini tushuntiradi. Aniq vazifa bering, avval skillni o‘qishini va oxirida <code>npm run validate</code> bajarishini so‘rang. Promptga parol, token, maxfiy mehmon ma’lumoti yoki production credential yozmang.<pre><code>Envite skillni o‘qi, RSVP qo‘sh,\nUZ/RU/EN ni saqla va validationni bajar.</code></pre>'],
      ['help','Muammolarni hal qilish','Muhit diagnostikasi uchun <code>envite doctor</code> ishlating. CSS <code>@import</code> xatosida font va Tailwind importlarini fayl boshiga qo‘ying. Tartib: validate, build, package.'],
    ],
  },
};

export function renderDocumentation(language = 'en') {
  const locale = shared[language] ? language : 'en'; const page = shared[locale];
  const navigation = page.items.map(([id,title])=>`<a href="#${id}">${title}</a>`).join('');
  const content = page.items.map(([id,title,body], index)=>`<section id="${id}"><p class="eyebrow">ENVITE SDK · ${String(index + 1).padStart(2, '0')}</p><h2>${title}</h2><p>${body}</p></section>`).join('');
  const languages = ['uz','ru','en'].map(item=>`<a href="?lang=${item}" ${item===locale?'aria-current="page"':''}>${item.toUpperCase()}</a>`).join('');
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Envite Template SDK Docs</title><style>:root{font:16px/1.7 Manrope,system-ui;color:#171717;background:#f7f4ee}*{box-sizing:border-box}body{margin:0}header{padding:4rem max(1rem,8vw);background:#171717;color:#fcfbf8}h1,h2{font-family:Georgia,serif;font-weight:400}h1{font-size:clamp(3rem,9vw,7rem);line-height:.9;margin:.4rem 0}.languages{display:flex;gap:.5rem;margin-bottom:2rem}.languages a{color:inherit;border:1px solid #716b63;padding:.35rem .65rem;text-decoration:none}.languages a[aria-current]{background:#b86b52;border-color:#b86b52}nav{position:sticky;top:0;max-height:100vh;overflow:auto;padding:2rem;border-right:1px solid #d8d0c6}nav a{display:block;color:#716b63;padding:.35rem 0;text-decoration:none}main{display:grid;grid-template-columns:19rem 1fr}.content{max-width:62rem;padding:2rem clamp(1rem,6vw,6rem)}section{padding:3rem 0;border-bottom:1px solid #d8d0c6}h2{font-size:clamp(2rem,5vw,4rem);margin:.3rem 0}code,pre{background:#e8ddd2}code{padding:.15rem .35rem}pre{padding:1rem;overflow:auto}.field-list{display:grid;gap:.55rem;padding-left:1.25rem}.eyebrow{color:#b86b52;letter-spacing:.2em;font-size:.7rem}@media(max-width:760px){main{display:block}nav{position:static;max-height:none;border:0;border-bottom:1px solid #d8d0c6;columns:2}}</style></head><body><header><div class="languages">${languages}</div><p>${page.label} · v0.3.5</p><h1>Envite Template SDK</h1><p>${page.intro}</p></header><main><nav>${navigation}</nav><div class="content">${content}</div></main></body></html>`;
}

function openBrowser(url) {
  const command = process.platform === 'win32' ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true }).unref();
}

export async function startDocsServer({ host='127.0.0.1', port=4174, open=true }={}) {
  const server=http.createServer((request,response)=>{const language=new URL(request.url||'/', 'http://envite.local').searchParams.get('lang')||'en';response.setHeader('content-type','text/html; charset=utf-8');response.end(renderDocumentation(language))});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve)});
  const address=server.address(); const url=`http://${host}:${typeof address==='object'&&address?address.port:port}/`;
  if(open)openBrowser(url); return {server,url};
}
