/* =========================================================   PANDORASHIELD   COMPLETE JAVASCRIPT   No Login / Signup / Google Authentication========================================================= */

/* =========================================================   GLOBAL STATE========================================================= */
let onboardingStep = 1;let scannerType = "message";let currentUser = {  name: "User"};
let scanHistory = [];

/* =========================================================   INITIALIZE APP========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  /*    Splash screen stays visible briefly,    then opens onboarding.  */
  setTimeout(() => {    showScreen("onboardingScreen");  }, 2200);
});

/* =========================================================   SCREEN MANAGEMENT========================================================= */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {    screen.classList.remove("active");  });
  const target = document.getElementById(screenId);
  if (target) {    target.classList.add("active");  }
}

/* =========================================================   ONBOARDING========================================================= */
const onboardingData = [
  {    title: "Detect threats.",    text:      "PandoraShield analyzes suspicious messages, links and content directly on your device."  },
  {    title: "Stay protected.",    text:      "Detect phishing, scams and suspicious digital activity with local-first security intelligence."  },
  {    title: "Keep your privacy.",    text:      "Your sensitive scan content is designed to stay on your device with offline-ready protection."  }
];

function nextOnboarding() {
  if (onboardingStep < onboardingData.length) {
    onboardingStep++;
    updateOnboarding();
    return;  }
  showSetup();
}

function updateOnboarding() {
  const data = onboardingData[onboardingStep - 1];
  const title = document.getElementById("onboardTitle");  const text = document.getElementById("onboardText");  const step = document.querySelector(".current-step");  const button = document.getElementById("onboardButton");
  if (title) {    title.textContent = data.title;  }
  if (text) {    text.textContent = data.text;  }
  if (step) {    step.textContent =      String(onboardingStep).padStart(2, "0");  }
  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle(      "active",      index === onboardingStep - 1    );
  });
  if (button) {
    if (onboardingStep === onboardingData.length) {      button.textContent = "CONTINUE";    } else {      button.textContent = "GET STARTED";    }
  }
}

/* =========================================================   SECURITY SETUP========================================================= */
function showSetup() {
  showScreen("setupScreen");
}

function activateProtection() {
  localStorage.setItem(    "pandoraProtectionActive",    "true"  );
  showToast("Protection activated");
  setTimeout(() => {
    showScreen("appScreen");
    initializeUserInterface();
  }, 500);
}

/* =========================================================   APP INITIALIZATION========================================================= */
function initializeUserInterface() {
  updateUserInterface();
  showPage("homePage");
}

function updateUserInterface() {
  const name =    currentUser.name || "User";
  const welcomeName =    document.getElementById("welcomeName");
  const profileInitial =    document.getElementById("profileInitial");
  const profileAvatar =    document.getElementById("profileAvatar");
  const profileName =    document.getElementById("profileName");
  const profileEmail =    document.getElementById("profileEmail");

  if (welcomeName) {    welcomeName.textContent = name;  }

  if (profileInitial) {    profileInitial.textContent =      getInitial(name);  }

  if (profileAvatar) {    profileAvatar.textContent =      getInitial(name);  }

  if (profileName) {    profileName.textContent = name;  }

  /*    Authentication was removed.
    Therefore we don't show a real email address.  */
  if (profileEmail) {    profileEmail.textContent =      "Local device profile";  }
}

function getInitial(name) {
  if (!name) {    return "U";  }
  return name    .trim()    .charAt(0)    .toUpperCase();
}

/* =========================================================   PAGE NAVIGATION========================================================= */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {    page.classList.remove("active-page");  });

  const page =    document.getElementById(pageId);
  if (page) {    page.classList.add("active-page");  }

  updateBottomNavigation(pageId);
}

function updateBottomNavigation(pageId) {
  document.querySelectorAll(".nav-item").forEach(item => {    item.classList.remove("active");  });

  const mapping = {
    homePage: 0,    scannerPage: 1,    historyPage: 2,    protectionPage: 3
  };

  if (    Object.prototype.hasOwnProperty.call(      mapping,      pageId    )  ) {
    const index = mapping[pageId];
    const navItems =      document.querySelectorAll(".nav-item");
    if (navItems[index]) {      navItems[index].classList.add("active");    }
  }
}

/* =========================================================   PROFILE========================================================= */
function openProfile() {
  showPage("profilePage");
}

function logout() {
  /*    There is no authentication anymore.
    Instead of logging out, return to    the onboarding/setup flow.  */
  const confirmed =    confirm(      "Reset PandoraShield setup on this device?"    );
  if (!confirmed) {    return;  }

  localStorage.removeItem(    "pandoraProtectionActive"  );
  localStorage.removeItem(    "pandoraScanHistory"  );

  scanHistory = [];

  showToast(    "Device protection setup reset"  );

  setTimeout(() => {
    onboardingStep = 1;
    updateOnboarding();
    showScreen("onboardingScreen");
  }, 700);
}

/* =========================================================   SCANNER========================================================= */
function openScanner(type = "message") {
  showPage("scannerPage");
  setScannerType(type);
}

function setScannerType(type) {
  scannerType = type;

  const panels = {
    message: "messageScanner",    link: "linkScanner",    screenshot: "screenshotScanner",    qr: "qrScanner"
  };

  Object.values(panels).forEach(id => {
    const panel =      document.getElementById(id);
    if (panel) {      panel.classList.add("hidden");    }
  });

  const selectedPanel =    document.getElementById(      panels[type]    );
  if (selectedPanel) {    selectedPanel.classList.remove("hidden");  }

  document.querySelectorAll(    ".scanner-tab"  ).forEach(tab => {
    tab.classList.remove("active");
  });

  const tabIndex = {
    message: 0,    link: 1,    screenshot: 2,    qr: 3
  };

  const tabs =    document.querySelectorAll(      ".scanner-tab"    );

  if (tabs[tabIndex[type]]) {
    tabs[tabIndex[type]]      .classList.add("active");
  }
}

/* =========================================================   SCREENSHOT PREVIEW========================================================= */
function previewScreenshot(event) {
  const file =    event.target.files &&    event.target.files[0];
  if (!file) {    return;  }

  const preview =    document.getElementById(      "screenshotPreview"    );

  if (!preview) {    return;  }

  const reader =    new FileReader();

  reader.onload = function(e) {
    preview.src = e.target.result;
    preview.style.display = "block";
  };

  reader.readAsDataURL(file);
  showToast("Screenshot selected");
}

/* =========================================================   QR SIMULATION========================================================= */
function simulateQR() {
  showToast(    "QR scanner simulation ready"  );

  setTimeout(() => {
    const resultContent =      document.getElementById(        "resultContent"      );

    if (resultContent) {
      resultContent.innerHTML = `
        <div class="result-card result-warning">
          <span class="eyebrow">            QR ANALYSIS          </span>
          <h2>            QR destination detected          </h2>
          <p>            This is a simulated QR scan for the web prototype.            Camera-based scanning will be connected in the Android implementation.          </p>
        </div>
      `;
    }

    addHistory(      "QR code",      "Simulation",      "Review"    );

    showPage("resultPage");
  }, 700);
}

/* =========================================================   ANALYZE CONTENT========================================================= */
function analyzeContent() {
  const content =    getScannerContent();

  if (!content) {
    showToast(      getEmptyMessage()    );
    return;  }

  showAnalysisModal();

  /*    Prototype local analysis.
    Replace this function later with:    - your Android on-device model    - local ML inference    - backend API if required    - threat detection Brain  */
  setTimeout(() => {
    hideAnalysisModal();
    generateLocalResult(content);
  }, 1800);
}

/* =========================================================   GET SCANNER CONTENT========================================================= */
function getScannerContent() {
  if (scannerType === "message") {
    const input =      document.getElementById(        "messageInput"      );
    return input      ? input.value.trim()      : "";
  }

  if (scannerType === "link") {
    const input =      document.getElementById(        "urlInput"      );
    return input      ? input.value.trim()      : "";
  }

  if (scannerType === "screenshot") {
    const input =      document.getElementById(        "screenshotInput"      );
    return input &&      input.files &&      input.files.length > 0      ? input.files[0].name      : "";
  }

  if (scannerType === "qr") {
    return "QR scan";
  }

  return "";
}

/* =========================================================   EMPTY INPUT MESSAGE========================================================= */
function getEmptyMessage() {
  const messages = {
    message:      "Please paste a message to analyze.",
    link:      "Please enter a URL to analyze.",
    screenshot:      "Please choose a screenshot.",
    qr:      "Start a QR scan first."
  };

  return (    messages[scannerType] ||    "Please provide something to analyze."  );
}

/* =========================================================   LOCAL THREAT ANALYSIS========================================================= */
function generateLocalResult(content) {
  let risk = "safe";
  let title = "No obvious threat detected";
  let description =    "The prototype local analysis did not identify strong suspicious indicators.";
  let status = "LOW RISK";

  const text =    String(content).toLowerCase();

  /*    Basic prototype rules.
    This is NOT the final AI model.    It gives the frontend a working demo    until the real PandoraShield Brain is connected.  */
  const dangerousPatterns = [
    "otp",    "verify your account",    "account suspended",    "account blocked",    "urgent",    "click here",    "claim now",    "you won",    "winner",    "free money",    "send money",    "bank details",    "password",    "credential",    "crypto",    "payment required",    "limited time",    "act now"
  ];

  const suspiciousPatterns = [
    "bit.ly",    "tinyurl",    "login",    "signin",    "secure-login",    "http://",    "unknown",    "prize",    "offer"
  ];

  let dangerousMatches = 0;
  let suspiciousMatches = 0;

  dangerousPatterns.forEach(pattern => {
    if (text.includes(pattern)) {      dangerousMatches++;    }
  });

  suspiciousPatterns.forEach(pattern => {
    if (text.includes(pattern)) {      suspiciousMatches++;    }
  });

  if (dangerousMatches >= 2) {
    risk = "danger";
    title = "Potential threat detected";
    description =      "The content contains multiple indicators commonly associated with phishing, scams or social engineering.";
    status = "HIGH RISK";
  }
  else if (    dangerousMatches === 1 ||    suspiciousMatches >= 2  ) {
    risk = "warning";
    title = "Suspicious content detected";
    description =      "Some indicators appear unusual or potentially risky. Verify the sender and destination before taking action.";
    status = "MEDIUM RISK";
  }

  renderResult(    risk,    title,    description,    status,    content  );

  addHistory(    getScannerLabel(),    status,    risk  );

  showPage("resultPage");
}

/* =========================================================   SCANNER LABEL========================================================= */
function getScannerLabel() {
  const labels = {
    message: "Message",    link: "Link",    screenshot: "Screenshot",    qr: "QR code"
  };

  return (    labels[scannerType] ||    "Scan"  );
}

/* =========================================================   RESULT UI========================================================= */
function renderResult(  risk,  title,  description,  status,  content) {
  const resultContent =    document.getElementById(      "resultContent"    );

  if (!resultContent) {    return;  }

  let icon = "✓";

  if (risk === "warning") {    icon = "!";  }

  if (risk === "danger") {    icon = "!";  }

  resultContent.innerHTML = `
    <div class="result-card result-${risk}">
      <div style="        display:flex;        align-items:center;        gap:14px;        margin-bottom:18px;      ">
        <div style="          width:48px;          height:48px;          border-radius:14px;          background:${            risk === "safe"              ? "var(--green-soft)"              : risk === "warning"              ? "var(--orange-soft)"              : "var(--red-soft)"          };          color:${            risk === "safe"              ? "var(--green)"              : risk === "warning"              ? "var(--orange)"              : "var(--red)"          };          display:flex;          align-items:center;          justify-content:center;          font-size:20px;          font-weight:700;        ">          ${icon}        </div>
        <div>
          <span class="eyebrow">            ${status}          </span>
          <h2>            ${title}          </h2>
        </div>
      </div>

      <p>        ${description}      </p>

      <div style="        margin-top:20px;        padding:14px;        background:var(--surface-soft);        border-radius:10px;      ">
        <span class="eyebrow">          ANALYSIS TYPE        </span>
        <strong style="          display:block;          margin-top:5px;          font-size:12px;        ">          ${getScannerLabel()}        </strong>
      </div>

      <div style="        margin-top:12px;        padding:14px;        background:var(--surface-soft);        border-radius:10px;      ">
        <span class="eyebrow">          PRIVACY        </span>
        <strong style="          display:block;          margin-top:5px;          font-size:12px;        ">          Local prototype analysis        </strong>
      </div>
    </div>

    <button      class="primary-btn full"      onclick="openScanner('${scannerType}')"    >      SCAN ANOTHER    </button>
  `;
}

/* =========================================================   ANALYSIS MODAL========================================================= */
function showAnalysisModal() {
  const modal =    document.getElementById(      "analysisModal"    );

  if (modal) {
    modal.classList.add("active");
  }
}

function hideAnalysisModal() {
  const modal =    document.getElementById(      "analysisModal"    );

  if (modal) {
    modal.classList.remove("active");
  }
}

/* =========================================================   HISTORY========================================================= */
function addHistory(  type,  status,  risk) {
  const item = {
    id: Date.now(),
    type: type,
    status: status,
    risk: risk,
    time: new Date().toLocaleString()
  };

  scanHistory.unshift(item);

  /*    Keep only latest 50 records.  */
  scanHistory =    scanHistory.slice(0, 50);

  saveHistory();
}

/* =========================================================   LOAD HISTORY========================================================= */
function loadHistory() {
  const historyList =    document.getElementById(      "historyList"    );

  if (!historyList) {    return;  }

  if (!scanHistory.length) {
    historyList.innerHTML = `
      <div class="empty-history">
        <strong>          No scans yet        </strong>
        <span>          Your local scan history will appear here.        </span>
      </div>
    `;
    return;  }

  historyList.innerHTML =    scanHistory.map(item => {
      const statusClass =        item.risk === "danger"          ? "danger"          : item.risk === "warning"          ? "warning"          : "safe";

      return `
        <div class="history-item">
          <div>
            <strong>              ${escapeHTML(item.type)}            </strong>
            <small>              ${escapeHTML(item.time)}            </small>
          </div>

          <span            class="history-status"            style="              ${                item.risk === "danger"                  ? "background:var(--red-soft);color:var(--red);"                  : item.risk === "warning"                  ? "background:var(--orange-soft);color:var(--orange);"                  : ""              }            "          >            ${escapeHTML(item.status)}          </span>
        </div>
      `;
    }).join("");
}

/* =========================================================   CLEAR HISTORY========================================================= */
function clearHistory() {
  if (!scanHistory.length) {
    showToast(      "History is already empty"    );
    return;
  }

  const confirmed =    confirm(      "Clear all local scan history?"    );

  if (!confirmed) {    return;  }

  scanHistory = [];
  saveHistory();
  loadHistory();
  showToast(    "Scan history cleared"  );
}

/* =========================================================   LOCAL STORAGE========================================================= */
function saveHistory() {
  try {
    localStorage.setItem(      "pandoraScanHistory",      JSON.stringify(scanHistory)    );
  }
  catch (error) {
    console.error(      "Unable to save history:",      error    );
  }
}

function loadSavedData() {
  try {
    const savedHistory =      localStorage.getItem(        "pandoraScanHistory"      );

    if (savedHistory) {
      scanHistory =        JSON.parse(savedHistory);
    }
  }
  catch (error) {
    scanHistory = [];
    console.error(      "Unable to load history:",      error    );
  }
}

/* =========================================================   TOAST========================================================= */
let toastTimer;

function showToast(message) {
  const toast =    document.getElementById(      "toast"    );

  if (!toast) {    return;  }

  clea
