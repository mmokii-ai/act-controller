import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";

// ─── Реальный чек-лист из контракта 2025-ЭЗК-016-СФО ───────────────────────
const CHECKLIST_TEMPLATE = [
  {
    section: "Итоговый отчёт (общее оформление)",
    items: [
      { id: "r1", text: "Титульный лист: наименование Заказчика и Исполнителя, дата, номер и предмет контракта, номер закупки", tag: "doc" },
      { id: "r2", text: "Лист оглавления со всеми разделами, номерами томов и страниц", tag: "doc" },
      { id: "r3", text: "Отчёт прошит/сброшюрован, листы пронумерованы сквозным методом", tag: "doc" },
      { id: "r4", text: "Шрифт Times New Roman 12, полуторный интервал, поля 12,7 мм", tag: "doc" },
      { id: "r5", text: "Электронная версия на USB/внешнем диске: .doc и .pdf", tag: "doc" },
      { id: "r6", text: "Дата передачи отчётной документации — не позднее 05.12.2025", tag: "date" },
    ]
  },
  {
    section: "Проживание (по каждому из 10 мероприятий)",
    items: [
      { id: "h1", text: "Документы, подтверждающие размещение участников (договор/ваучер с гостиницей)", tag: "doc" },
      { id: "h2", text: "Регистр (сводная ведомость) размещения: ФИО участника, дата заезда, дата выезда, тип номера", tag: "doc" },
      { id: "h3", text: "Гостиница не ниже 3 звёзд — документ подтверждения категории", tag: "doc" },
      { id: "h4", text: "Фото номеров: кровать, тумбочка, шкаф, зеркало, стол, стул, туалет, душ, Wi-Fi", tag: "photo" },
      { id: "h5", text: "Фото зоны завтрака «шведский стол»", tag: "photo" },
      { id: "h6", text: "Переписка о согласовании места размещения с Заказчиком (не позднее чем за 2 р.д. до мероприятия)", tag: "doc" },
      { id: "h7", text: "Итого ночей по всем мероприятиям не превышает 200, по одному — не более 50 человек × 2 ночи", tag: "sum" },
    ]
  },
  {
    section: "Площадка и оборудование (по каждому из 10 мероприятий)",
    items: [
      { id: "v1", text: "Договор/акт аренды помещения на 1 день, не менее 9 часов", tag: "doc" },
      { id: "v2", text: "Фото учебного зала: площадь ≥60 кв.м, вместимость ≥60 чел, вентиляция/кондиционер", tag: "photo" },
      { id: "v3", text: "Фото зоны кофе-брейка: площадь ≥60 кв.м, отдельное помещение", tag: "photo" },
      { id: "v4", text: "Фото гардероба (≥60 мест) и туалетов (≥4 кабинки, раздельные)", tag: "photo" },
      { id: "v5", text: "Фото проектора с экраном (≥1 шт.)", tag: "photo" },
      { id: "v6", text: "Фото микрофонов со звукоусиливающим оборудованием (≥2 шт.)", tag: "photo" },
      { id: "v7", text: "Фото ноутбука (экран ≥15\", CPU ≥2.4 GHz, RAM ≥8 GB, SSD ≥256 GB) с мышью и зарядкой", tag: "photo" },
      { id: "v8", text: "Фото флипчартов (≥5 шт., 70×100 см, на роликах) с блоками листов и маркерами", tag: "photo" },
      { id: "v9", text: "Фото МФУ (лазерный, цветной, Wi-Fi/USB, ≥25 стр/мин) + 4 картриджа (ч/ж/пур/гол) + 5 упаковок бумаги А4", tag: "photo" },
      { id: "v10", text: "Фото ручек (≥30 шт.), фломастеров (≥5 наборов ≥12 цветов), карандашей (≥5 наборов ≥12 цветов)", tag: "photo" },
      { id: "v11", text: "Фото зоны регистрации (стол + 2 стула)", tag: "photo" },
      { id: "v12", text: "Ролл-ап (≥80×200 см) — фото установленного + документ на изготовление", tag: "photo" },
      { id: "v13", text: "Пресс-волл (≥3×2 м, баннер ≥440 г/м², печать ≥720 dpi) — фото установленного + документ", tag: "photo" },
      { id: "v14", text: "Документ о работе техспециалиста весь день (настройка и поддержка оборудования)", tag: "doc" },
      { id: "v15", text: "Переписка о согласовании площадки с Заказчиком (не позднее чем за 3 р.д. до мероприятия)", tag: "doc" },
    ]
  },
  {
    section: "Кофе-брейки (по каждому из 10 мероприятий, 50 чел.)",
    items: [
      { id: "c1", text: "Фото накрытого кофе-стола: кофе растворимый (≥1 пак/чел), чай чёрный и зелёный (≥1 пак/чел)", tag: "photo" },
      { id: "c2", text: "Фото: вода без газа ≥500 мл (≥3 бут/чел), сливки 10% в блистере (≥20 г/чел), сахар порционный (≥3 шт/чел)", tag: "photo" },
      { id: "c3", text: "Фото: печенье ≥2 видов (≥30 г/чел), шоколадные конфеты ≥2 видов (≥60 г/чел)", tag: "photo" },
      { id: "c4", text: "Фото: сладкая выпечка ≥2 видов (≥2 шт/вид/чел), несладкая выпечка ≥2 видов (≥2 шт/вид/чел)", tag: "photo" },
      { id: "c5", text: "Фото официанта в дресс-коде (белый верх, чёрный низ)", tag: "photo" },
      { id: "c6", text: "Документ, подтверждающий оказание услуг по кофе-брейку (акт/накладная)", tag: "doc" },
    ]
  },
  {
    section: "Фото и видеосъёмка (по каждому из 10 мероприятий)",
    items: [
      { id: "m1", text: "Переписка о согласовании кандидатур фотографа И видеооператора (≥2 кандидатуры каждого, за 3 р.д. до)", tag: "doc" },
      { id: "m2", text: "Портфолио фотографа и видеооператора с подтверждением опыта на федеральных/региональных мероприятиях", tag: "doc" },
      { id: "m3", text: "Физический носитель (USB/HDD): ≥300 необработанных фото в отдельной папке, JPG/JPEG, ≥1366×768 px", tag: "doc" },
      { id: "m4", text: "Физический носитель: ≥15 обработанных фото в отдельной папке (без добавления/удаления объектов, обрезка ≤10%)", tag: "doc" },
      { id: "m5", text: "Физический носитель: видеоматериал ≥200 минут", tag: "doc" },
      { id: "m6", text: "Смонтированный видеоролик ≥3 мин, Full HD, 16:9, MP4/AVI/MOV, ≥25 fps — согласован с Заказчиком", tag: "doc" },
      { id: "m7", text: "Носитель с фото передан Заказчику в течение 2 р.д. после мероприятия", tag: "date" },
      { id: "m8", text: "Носитель с видео передан после согласования ролика (следующий рабочий день)", tag: "date" },
      { id: "m9", text: "Фото фотографа и видеооператора за работой на мероприятии", tag: "photo" },
    ]
  },
  {
    section: "Раздаточная продукция (на все 10 мероприятий)",
    items: [
      { id: "p1", text: "Сигнальные образцы бейджа, блокнота и ручки — согласованы с Заказчиком (в течение 5 р.д. с даты макетов)", tag: "doc" },
      { id: "p2", text: "Бейджи персонифицированные (ФИО + статус): 550 шт. (55 × 10 мероприятий)", tag: "doc" },
      { id: "p3", text: "Блокноты А5, пружина сверху, ≥30 листов в клетку, печать на обложке: 500 шт.", tag: "doc" },
      { id: "p4", text: "Ручки шариковые с логотипом, синяя паста: 500 шт.", tag: "doc" },
      { id: "p5", text: "Фото раздатки (бейдж крупно с ФИО, блокнот, ручка) по каждому мероприятию", tag: "photo" },
      { id: "p6", text: "≥1 экземпляр каждого вида раздатки вложен в итоговый отчёт", tag: "doc" },
      { id: "p7", text: "Документы доставки раздатки в место проведения (не позднее чем за 1 день до каждого мероприятия)", tag: "date" },
    ]
  },
  {
    section: "Обеды (по каждому из 10 мероприятий, 50 чел.)",
    items: [
      { id: "f1", text: "Переписка о согласовании меню и места питания (за 3 р.д., 2 варианта по каждой позиции)", tag: "doc" },
      { id: "f2", text: "Место питания: в зале или кафе/столовая ≤1000 м от площадки — адрес и документ", tag: "doc" },
      { id: "f3", text: "Фото обеда: суп ≥250 г, мясо/рыба ≥150 г, гарнир ≥150 г, салат ≥150 г, хлеб ≥50 г, напиток ≥200 мл", tag: "photo" },
      { id: "f4", text: "Документ, подтверждающий оказание услуг по питанию (акт/чек/накладная)", tag: "doc" },
    ]
  },
];

const TAG_CONFIG = {
  doc:   { label: "документ", bg: "#E6F1FB", color: "#0C447C" },
  date:  { label: "дата/срок", bg: "#FAEEDA", color: "#633806" },
  sum:   { label: "сумма", bg: "#EEEDFE", color: "#3C3489" },
  photo: { label: "фото", bg: "#EAF3DE", color: "#27500A" },
};

function buildChecklist() {
  return CHECKLIST_TEMPLATE.flatMap(section =>
    section.items.map(item => ({ ...item, sectionTitle: section.section, checked: false }))
  );
}

export default function App() {
  const [view, setView] = useState("checklist"); // checklist | act
  const [items, setItems] = useState(buildChecklist);
  const [filter, setFilter] = useState("all"); // all | doc | photo | date | sum | unchecked
  const [actText, setActText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");

  const done = items.filter(i => i.checked).length;
  const total = items.length;
  const pct = Math.round((done / total) * 100);
  const allDone = done === total;

  function toggle(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  }

  function toggleSection(sectionTitle) {
    const sectionItems = items.filter(i => i.sectionTitle === sectionTitle);
    const allChecked = sectionItems.every(i => i.checked);
    setItems(prev => prev.map(i =>
      i.sectionTitle === sectionTitle ? { ...i, checked: !allChecked } : i
    ));
  }

  const filteredItems = items.filter(item => {
    if (filter === "unchecked" && item.checked) return false;
    if (filter !== "all" && filter !== "unchecked" && item.tag !== filter) return false;
    if (search && !item.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group filtered items by section
  const sections = CHECKLIST_TEMPLATE.map(s => ({
    title: s.section,
    items: filteredItems.filter(i => i.sectionTitle === s.section),
  })).filter(s => s.items.length > 0);

  async function generateAct() {
    setGenerating(true);
    setView("act");
    const unchecked = items.filter(i => !i.checked).map(i => `- ${i.text}`).join("\n");
    const checked = items.filter(i => i.checked).map(i => `- ${i.text}`).join("\n");

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Ты юрист, специалист по госзакупкам (44-ФЗ). Составляй акт выполненных работ строго официальным языком. 
Оставляй [ПОЛЕ] для данных которые нужно заполнить вручную. Акт должен быть структурированным и готовым к подписанию.`,
          messages: [{
            role: "user",
            content: `Контракт №2025-ЭЗК-016-СФО
Заказчик: ФГБНУ «Институт изучения детства, семьи и воспитания»
Исполнитель: ООО «СМАРТМАЙС»
Предмет: Оказание комплекса услуг в рамках проекта «Разговоры о важном» в СФО
Сумма: 4 768 000 руб. (НДС не облагается)
Срок: по 05.12.2025

Закрытые пункты чек-листа (выполнено):
${checked || "нет"}

Незакрытые пункты (требуют внимания):
${unchecked || "нет"}

Составь акт выполненных работ/оказанных услуг по данному контракту. Укажи все 8 видов услуг из сметы с суммами [ПОЛЕ]. Добавь список приложений на основе закрытых пунктов.`
          }]
        })
      });
      const data = await resp.json();
      setActText(data.content[0].text);
    } catch {
      setActText(`АКТ ВЫПОЛНЕННЫХ РАБОТ (ОКАЗАННЫХ УСЛУГ)

к Контракту №2025-ЭЗК-016-СФО от [ДАТА]

г. Москва                                                    «[__]» [месяц] 2025 г.

ФГБНУ «Институт изучения детства, семьи и воспитания» (Заказчик)
и ООО «СМАРТМАЙС» (Исполнитель)

составили настоящий акт о том, что в период с [ДАТА] по 30.11.2025
Исполнитель оказал следующие услуги:

┌────────────────────────────────────────────────────┬──────────┬──────────────┐
│ Наименование услуги                                │  Кол-во  │ Сумма, руб.  │
├─────────────────────────────────────────��──────────┼──────────┼──────────────┤
│ 1. Предоставление места проведения (10 мероприятий)│ 10 усл.  │ 2 224 696,89 │
│ 2. Организация кофе-брейков                        │ 10 усл.  │   576 463,84 │
│ 3. Фото- и видеосъёмка                             │ 10 усл.  │   631 365,18 │
│ 4. Раздаточная продукция (бейджи)                  │ 550 шт.  │   104 372,18 │
│ 5. Раздаточная продукция (блокноты)                │ 500 шт.  │    99 062,27 │
│ 6. Раздаточная продукция (ручки)                   │ 500 шт.  │    42 966,25 │
│ 7. Организация обедов                              │ 500 чел. │   461 289,23 │
│ 8. Организация проживания                          │ 200 чел/д│   627 784,16 │
├────────────────────────────────────────────────────┼──────────┼──────────────┤
│ ИТОГО:                                             │          │ 4 768 000,00 │
└────────────────────────────────────────────────────┴──────────┴──────────────┘

НДС не облагается (ст. 346.11 гл. 26.2 НК РФ).

Услуги оказаны в полном объёме и в установленные сроки.
Заказчик претензий по объёму, качеству и срокам не имеет.

Приложения к акту:
${items.filter(i => i.checked).map((i, n) => `${n + 1}. ${i.text}`).join("\n")}

Заказчик:                                    Исполнитель:
И.о. директора ФГБНУ «ИИДСВ»               Генеральный директор ООО «СМАРТМАЙС»
_________________ / Цветков А.М. /          _________________ / Сергеечев А.В. /
М.П.                                         М.П.`);
    }
    setGenerating(false);
  }

  function copyAct() {
    navigator.clipboard.writeText(actText).catch(() => {});
  }

  const tagBtns = [
    { key: "all", label: `Все (${total})` },
    { key: "unchecked", label: `Не закрыто (${items.filter(i => !i.checked).length})` },
    { key: "doc", label: "Документы" },
    { key: "photo", label: "Фото" },
    { key: "date", label: "Сроки" },
    { key: "sum", label: "Суммы" },
  ];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.25rem 1rem", fontFamily: "sans-serif", fontSize: 14 }}>

      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#999", marginBottom: 4 }}>
          КОНТРАКТ №2025-ЭЗК-016-СФО · «РАЗГОВОРЫ О ВАЖНОМ» · СФО
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#111" }}>Щит подрядчика</h1>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#666" }}>ООО «СМАРТМАЙС» → ФГБНУ «ИИДСВ» · 4 768 000 ₽ · срок 05.12.2025</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <TabBtn active={view === "checklist"} onClick={() => setView("checklist")}>Чек-лист</TabBtn>
            <TabBtn active={view === "act"} onClick={() => { if (!actText) generateAct(); else setView("act"); }}>
              {generating ? "Генерация..." : "Акт"}
            </TabBtn>
          </div>
        </div>
      </div>

      {view === "checklist" && (
        <>
          {/* Progress */}
          <div style={{
            background: allDone ? "#EAF3DE" : "#fff",
            border: `1px solid ${allDone ? "#97C459" : "#e8e8e8"}`,
            borderRadius: 10, padding: "1rem", marginBottom: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: allDone ? "#3B6D11" : pct > 60 ? "#633806" : "#A32D2D"
                }}>
                  {allDone ? "✓ Готов к сдаче" : pct > 60 ? `Почти готов — ${pct}%` : `Не готов — ${pct}%`}
                </span>
                <span style={{ fontSize: 12, color: "#999", marginLeft: 10 }}>{done} из {total} пунктов</span>
              </div>
              <button onClick={generateAct} style={{
                background: "#042C53", color: "#fff", border: "none",
                borderRadius: 6, padding: "7px 14px", fontSize: 12,
                cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap"
              }}>
                Сгенерировать акт →
              </button>
            </div>
            <div style={{ height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3, transition: "width 0.4s",
                width: pct + "%",
                background: allDone ? "#639922" : pct > 60 ? "#BA7517" : "#E24B4A"
              }} />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {tagBtns.map(btn => (
              <button key={btn.key} onClick={() => setFilter(btn.key)} style={{
                padding: "5px 12px", fontSize: 12, borderRadius: 20, cursor: "pointer",
                border: `1px solid ${filter === btn.key ? "#042C53" : "#ddd"}`,
                background: filter === btn.key ? "#042C53" : "#fff",
                color: filter === btn.key ? "#fff" : "#555",
                fontWeight: filter === btn.key ? 500 : 400,
              }}>{btn.label}</button>
            ))}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..."
              style={{
                fontSize: 12, padding: "5px 10px", border: "1px solid #ddd",
                borderRadius: 20, outline: "none", minWidth: 140,
              }}
            />
          </div>

          {/* Sections */}
          {sections.map(section => {
            const sectionAll = items.filter(i => i.sectionTitle === section.title);
            const sectionDone = sectionAll.filter(i => i.checked).length;
            const allSectionDone = sectionDone === sectionAll.length;
            return (
              <div key={section.title} style={{
                background: "#fff", border: "1px solid #e8e8e8",
                borderRadius: 10, marginBottom: 10, overflow: "hidden"
              }}>
                {/* Section header */}
                <div
                  onClick={() => toggleSection(section.title)}
                  style={{
                    padding: "10px 14px", cursor: "pointer",
                    background: allSectionDone ? "#EAF3DE" : "#fafafa",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: allSectionDone ? "#3B6D11" : "#222" }}>
                    {allSectionDone ? "✓ " : ""}{section.title}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>
                    {sectionDone}/{sectionAll.length} · нажми чтобы отметить всё
                  </span>
                </div>

                {/* Items */}
                {section.items.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "9px 14px", cursor: "pointer",
                      borderBottom: idx < section.items.length - 1 ? "1px solid #f5f5f5" : "none",
                      background: item.checked ? "#fafff8" : "#fff",
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: `1.5px solid ${item.checked ? "#97C459" : "#ccc"}`,
                      background: item.checked ? "#97C459" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {item.checked && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: 13, color: item.checked ? "#999" : "#1a1a1a",
                        textDecoration: item.checked ? "line-through" : "none",
                        lineHeight: 1.4,
                      }}>{item.text}</span>
                      <span style={{
                        display: "inline-block", fontSize: 10, padding: "1px 7px",
                        borderRadius: 20, marginLeft: 8, verticalAlign: "middle",
                        background: TAG_CONFIG[item.tag].bg,
                        color: TAG_CONFIG[item.tag].color,
                      }}>
                        {TAG_CONFIG[item.tag].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}

      {view === "act" && (
        <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "1.25rem" }}>
          {generating ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2rem", color: "#888" }}>
              <span style={{ fontSize: 14 }}>Формирую акт на основе чек-листа...</span>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>Готовый акт выполненных работ</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={copyAct} style={{
                    background: "#042C53", color: "#fff", border: "none",
                    borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer"
                  }}>Скопировать</button>
                  <button onClick={() => setView("checklist")} style={{
                    background: "#fff", color: "#555", border: "1px solid #ddd",
                    borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer"
                  }}>← Чек-лист</button>
                  <button onClick={generateAct} style={{
                    background: "#fff", color: "#185FA5", border: "1px solid #85B7EB",
                    borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer"
                  }}>Пересоздать</button>
                </div>
              </div>
              <pre style={{
                fontSize: 12, fontFamily: "monospace", lineHeight: 1.7,
                background: "#fafafa", border: "1px solid #eee", borderRadius: 6,
                padding: "1rem", whiteSpace: "pre-wrap", color: "#1a1a1a",
                maxHeight: 480, overflowY: "auto", margin: 0,
              }}>{actText}</pre>
              {items.filter(i => !i.checked).length > 0 && (
                <div style={{
                  marginTop: 12, padding: "10px 12px", background: "#FAEEDA",
                  borderRadius: 6, fontSize: 12, color: "#633806"
                }}>
                  ⚠ {items.filter(i => !i.checked).length} пунктов чек-листа не закрыты — заказчик может отказать в приёмке.
                  Вернись в чек-лист и закрой все пункты перед финальной сдачей.
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: "1rem", fontSize: 11, color: "#ccc", textAlign: "center" }}>
        Прототип · без сохранения · API подключается при деплое на сервер
      </div>
      <Analytics />
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px", fontSize: 13, borderRadius: 6, cursor: "pointer",
      border: `1px solid ${active ? "#042C53" : "#ddd"}`,
      background: active ? "#042C53" : "#fff",
      color: active ? "#fff" : "#555",
      fontWeight: active ? 500 : 400,
    }}>{children}</button>
  );
}
