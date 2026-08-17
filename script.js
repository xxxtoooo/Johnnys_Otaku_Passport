const fields = [
  "name",
  "oshi",
  "tan",
  "tanNote",
  "age",
  "area",
  "mood",
  "x",
  "instagram",
  "youtube",
  "tiktok",
  "otherSNS",
  "venue",
  "nextLive",
  "nextDate",
  "nextSession",
  "nextPublic",
  "message",
  "public"
];

const history = [];

function $(id) {
  return document.getElementById(id);
}


// =========================
// 入力内容をカードへ反映
// =========================

function updatePassport() {

  $("p-name").textContent =
    $("name").value || "---";

  $("p-oshi").textContent =
    $("oshi").value || "---";

  let tanText = $("tan").value;

  if ($("tanNote").value) {
    tanText += " / " + $("tanNote").value;
  }

  $("p-tan").textContent =
    tanText || "---";

  const age = $("age").value;
  const area = $("area").value;

  $("p-age-area").textContent =
    [age, area].filter(Boolean).join(" / ") || "---";

  $("p-mood").textContent =
    $("mood").value || "---";

  $("p-venue").textContent =
    $("venue").value || "---";


  // SNS

  const sns = [];

  if ($("x").value)
    sns.push("𝕏 " + $("x").value);

  if ($("instagram").value)
    sns.push("Instagram " + $("instagram").value);

  if ($("youtube").value)
    sns.push("YouTube " + $("youtube").value);

  if ($("tiktok").value)
    sns.push("TikTok " + $("tiktok").value);

  if ($("otherSNS").value)
    sns.push($("otherSNS").value);

  $("p-sns").textContent =
    sns.join("\n") || "---";


  // 参戦歴

  if (history.length === 0) {

    $("p-history").textContent = "---";

  } else {

    $("p-history").innerHTML =
      history.map(item => `
        <div>
          ${escapeHTML(item.date)}
          ｜${escapeHTML(item.name)}
          ${item.session ? "｜" + escapeHTML(item.session) : ""}
        </div>
      `).join("");
  }


  // 次回参戦

  const next = [
    $("nextDate").value,
    $("nextLive").value,
    $("nextSession").value
  ].filter(Boolean);

  $("p-next").textContent =
    next.join(" ｜ ") || "---";

  $("p-message").textContent =
    $("message").value || "---";


  saveLocal();
}


// =========================
// 参戦歴追加
// =========================

$("addHistory").addEventListener("click", () => {

  const item = document.createElement("div");

  item.className = "history-item";

  item.innerHTML = `
    <input type="date" class="history-date">
    <input type="text" class="history-name" placeholder="公演名">
    
    <select class="history-session">
      <option value="">公演時間</option>
      <option value="昼公演">昼公演</option>
      <option value="夜公演">夜公演</option>
    </select>

    <button type="button">削除</button>
  `;

  item.querySelector("button").addEventListener("click", () => {
    item.remove();
    updateHistory();
  });

  item.querySelectorAll("input, select")
    .forEach(el => {
      el.addEventListener("input", updateHistory);
      el.addEventListener("change", updateHistory);
    });

  $("historyList").appendChild(item);

  updateHistory();
});


function updateHistory() {

  history.length = 0;

  document.querySelectorAll(".history-item")
    .forEach(item => {

      history.push({
        date: item.querySelector(".history-date").value,
        name: item.querySelector(".history-name").value,
        session: item.querySelector(".history-session").value
      });

    });

  updatePassport();
}


// =========================
// 自動保存
// =========================

function saveLocal() {

  const data = {};

  fields.forEach(id => {

    const element = $(id);

    if (element.type === "checkbox") {
      data[id] = element.checked;
    } else {
      data[id] = element.value;
    }

  });

  data.history = history;

  localStorage.setItem(
    "oshiPassport",
    JSON.stringify(data)
  );
}


// =========================
// 自動復元
// =========================

function loadLocal() {

  const saved =
    localStorage.getItem("oshiPassport");

  if (!saved) return;

  const data = JSON.parse(saved);

  fields.forEach(id => {

    if (!(id in data)) return;

    const element = $(id);

    if (element.type === "checkbox") {
      element.checked = data[id];
    } else {
      element.value = data[id];
    }

  });

  if (Array.isArray(data.history)) {

    data.history.forEach(item => {

      $("addHistory").click();

      const items =
        document.querySelectorAll(".history-item");

      const last =
        items[items.length - 1];

      last.querySelector(".history-date").value =
        item.date || "";

      last.querySelector(".history-name").value =
        item.name || "";

      last.querySelector(".history-session").value =
        item.session || "";

    });

  }

  updateHistory();
}


// =========================
// HTMLエスケープ
// =========================

function escapeHTML(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =========================
// 全入力を監視
// =========================

fields.forEach(id => {

  const element = $(id);

  element.addEventListener("input", updatePassport);
  element.addEventListener("change", updatePassport);

});


// =========================
// 画像保存
// =========================

$("saveImage").addEventListener("click", async () => {

  const canvas =
    await html2canvas($("passport"), {
      scale: 2,
      backgroundColor: "#ffffff"
    });

  const link =
    document.createElement("a");

  link.download =
    "oshi-passport.png";

  link.href =
    canvas.toDataURL("image/png");

  link.click();
});


// =========================
// リセット
// =========================

$("reset").addEventListener("click", () => {

  if (!confirm("入力内容を全部消しますか？")) {
    return;
  }

  localStorage.removeItem("oshiPassport");

  location.reload();
});


loadLocal();
updatePassport();
