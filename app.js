(() => {
  const storageKey = "campus-stores.shift.v3";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);

  // Cryptographic-style signature binding Unit ID + Hardware Serial
  function signUnit(id, serial) {
    const raw = `${id}|${serial}|CAMPUS-STORES-LASER`;
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 6);
  }

  const qrPayload = (a) =>
    `UNIT:${a.id}|SN:${a.serial}|SIG:${signUnit(a.id, a.serial)}`;

  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];

  const assets = [
    {
      id: "PR-04",
      type: "HDMI projector",
      category: "AV & Projection",
      model: "BenQ MH550",
      serial: "BQ-550-8812",
      grade: "Mint",
      engraving: "Laser-etched on rear chassis beside HDMI-1",
      accessories: ["Power cord", "HDMI cable", "Remote control", "Carry bag"],
      bin: "A2",
    },
    {
      id: "PR-06",
      type: "HDMI projector",
      category: "AV & Projection",
      model: "Epson EB-X49",
      serial: "EP-X49-4401",
      grade: "Fair",
      engraving: "Laser-etched on bottom plate near tripod mount",
      accessories: ["Power cord", "Remote control"],
      bin: "Workshop",
      repair: true,
    },
    {
      id: "SP-02",
      type: "Portable speaker",
      category: "AV & Projection",
      model: "JBL Eon One",
      serial: "JBL-E1-3094",
      grade: "Mint",
      engraving: "Laser-etched on top handle bezel",
      accessories: ["AC power cable", "Column spacer", "Protective cover"],
      bin: "B1",
    },
    {
      id: "SP-05",
      type: "Portable speaker",
      category: "AV & Projection",
      model: "Bose S1",
      serial: "BS-S1-7720",
      grade: "Good",
      engraving: "Laser-etched beside channel 1 XLR jack",
      accessories: ["AC power cord", "Battery pack"],
      bin: "B2",
    },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      category: "Adapters & Cables",
      model: "Belkin AVC002",
      serial: "BLK-002-9914",
      grade: "Mint",
      engraving: "Laser-etched on aluminum HDMI shell underside",
      accessories: ["Belkin USB-C hub body", "Velcro cable tie"],
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      category: "Adapters & Cables",
      model: "Anker A8312",
      serial: "ANK-831-1108",
      grade: "Good",
      engraving: "Laser-etched on USB-C plug collar",
      accessories: ["Anker adapter body", "Mesh pouch"],
      bin: "C4",
    },
    {
      id: "MI-09",
      type: "Wireless microphone",
      category: "AV & Projection",
      model: "Shure BLX",
      serial: "SH-BLX-6520",
      grade: "Mint",
      engraving: "Laser-etched on receiver back panel & mic base",
      accessories: ["BLX4 Receiver", "Handheld transmitter", "12V PSU", "Mic clip"],
      bin: "B3",
    },
    {
      id: "CA-03",
      type: "Digital camera",
      category: "AV & Projection",
      model: "Sony A6400",
      serial: "SNY-640-5190",
      grade: "Mint",
      engraving: "Laser-etched on bottom battery door frame",
      accessories: ["Camera body + 16-50mm lens", "64GB SD card", "NP-FW50 battery", "Neck strap"],
      bin: "D2",
    },
  ];

  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];

  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Verify its Laser-QR and serial number to confirm it’s the original unit before closing the loan.",
    },
  ];

  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];

  const original = () => ({
    version: 3,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    search: "",
    showTags: false,
    auditAssetId: "",
    verifyingLoan: null,
    scannedQr: "",
    chkEngraving: false,
    chkAccessories: {},
    returnHealth: "Good — Tested OK",
    lastGatePass: null,
    waitlist: {},
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        pin: "4821",
        back: false,
      },
    ],
    clubs: {
      "Film Society": { onTime: 14, late: 0, flags: 0, holdCleared: false },
      "Debate Union": { onTime: 9, late: 0, flags: 0, holdCleared: false },
      "Photo Circle": { onTime: 6, late: 1, flags: 0, holdCleared: false },
    },
    audit: {
      "PR-04": ["Laser-QR registered (SN: BQ-550-8812) · Grade: Mint · Bin A2"],
      "PR-06": ["Laser-QR registered (SN: EP-X49-4401) · Sent to Workshop"],
      "SP-02": ["Laser-QR registered (SN: JBL-E1-3094) · Grade: Mint · Bin B1"],
      "SP-05": ["Laser-QR registered (SN: BS-S1-7720) · Grade: Good · Bin B2"],
      "AD-12": ["Laser-QR registered (SN: BLK-002-9914) · Grade: Mint · Bin C4"],
      "AD-15": ["Laser-QR registered (SN: ANK-831-1108) · Grade: Good · Bin C4"],
      "MI-09": ["Laser-QR registered (SN: SH-BLX-6520) · Bin B3", "Issued to Tara Shah (Debate Union) on L-401 · PIN 4821"],
      "CA-03": ["Laser-QR registered (SN: SNY-640-5190) · Grade: Mint · Bin D2"],
    },
    notes: [],
    editing: false,
    onlyOpen: true,
    notice: "Sample shift · Laser-QR anti-swap verification active.",
  });

  let s = original();
  let camStream = null;
  let camTimer = null;

  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const makePin = (num) => String(1000 + ((num * 739) % 9000));

  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");

  const btn = (label, act, val = "", style = "", disabled = false) =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '"' +
    (disabled ? " disabled" : "") +
    ">" +
    esc(label) +
    "</button>";

  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";

  const row = (label, subHtml, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong>" +
    subHtml +
    "</div><div>" +
    right +
    "</div></div>";

  const badge = (t, tone = "") =>
    '<span class="tag' +
    (tone === "good" ? " good" : tone === "warn" ? " warn-tag" : "") +
    '">' +
    esc(t) +
    "</span>";

  function stopCamera() {
    if (camTimer) {
      clearInterval(camTimer);
      camTimer = null;
    }
    if (camStream) {
      camStream.getTracks().forEach((t) => t.stop());
      camStream = null;
    }
  }

  function isLoanOverdue(loan) {
    if (loan.back) return false;
    return s.phase === 2 && loan.due === "Fri 8 pm";
  }

  function getClubStanding(clubName) {
    const c = s.clubs[clubName] || { onTime: 5, late: 0, flags: 0, holdCleared: false };
    const overdueCount = s.loans.filter((l) => {
      const r = getReq(l.req);
      return r && r.club === clubName && isLoanOverdue(l);
    }).length;
    const total = Math.max(1, c.onTime + c.late + c.flags);
    const score = Math.max(
      0,
      Math.min(100, Math.round(((c.onTime - c.late * 2 - c.flags * 5) / total) * 100)),
    );
    const onHold = !c.holdCleared && (score < 75 || c.flags > 0 || overdueCount > 0);
    let reason = "";
    if (onHold) {
      if (c.flags > 0) reason = "Swap/damage flag logged";
      else if (overdueCount > 0) reason = `${overdueCount} overdue item(s)`;
      else reason = `Trust score ${score}% (<75%)`;
    }
    return { score, onHold, reason, overdueCount };
  }

  function renderTrustStrip() {
    return (
      '<div class="trust-strip">' +
      Object.keys(s.clubs)
        .map((club) => {
          const st = getClubStanding(club);
          return (
            '<div class="trust-card' +
            (st.onHold ? " hold" : "") +
            '"><div><strong>' +
            esc(club) +
            "</strong></div><div>" +
            (st.onHold
              ? "⛔ Auto-Hold (" + esc(st.reason) + ") " + btn("Override", "clear-hold", club)
              : "✅ " + st.score + "% Trust · Express Checkout") +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderOmniSearch(placeholder) {
    const qText = s.search.trim().toLowerCase();
    let suggestionsHtml = "";
    if (qText.length >= 1) {
      const unitMatches = assets
        .filter((a) => `${a.id} ${a.model} ${a.serial} ${a.type}`.toLowerCase().includes(qText))
        .slice(0, 3);
      if (unitMatches.length) {
        suggestionsHtml =
          '<div class="suggest-box"><small>Quick matches:</small>' +
          unitMatches
            .map((a) =>
              btn(`${a.id} · ${a.model} (${a.serial})`, "pick-suggest", a.id, "suggest-chip"),
            )
            .join("") +
          "</div>";
      }
    }

    return (
      '<div class="omni-wrap">' +
      '<div class="omni-bar">' +
      '<input type="search" data-omni value="' +
      esc(s.search) +
      '" placeholder="' +
      esc(placeholder) +
      '" aria-label="Omni-search" />' +
      (s.search ? btn("Clear", "clear-search") : "") +
      '<span class="kbd-hint" title="Press / to focus search">/</span>' +
      "</div>" +
      suggestionsHtml +
      "</div>"
    );
  }

  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · Club trust scores & 1-click kit checkout",
    );
    html += renderTrustStrip();

    if (s.lastGatePass) {
      html +=
        '<div class="verify-panel">' +
        '<div class="sectionhead"><div><h3>🎟️ Verified Handover Gate-Pass · ' +
        esc(s.lastGatePass.club) +
        " (" +
        esc(s.lastGatePass.req) +
        ")</h3><small>Collected by <b>" +
        esc(s.lastGatePass.who) +
        "</b> · Open-Box Handover PIN: <code>" +
        esc(s.lastGatePass.pin) +
        "</code></small></div>" +
        btn("Dismiss", "clear-pass") +
        "</div><small>Serialized Laser-QR units cleared for exit: " +
        esc(s.lastGatePass.units.join(", ")) +
        "</small></div>";
    }

    if (s.selected) {
      const r = getReq(s.selected);
      const standing = getClubStanding(r.club);
      const openForReq = s.loans.filter((l) => l.req === r.id && !l.back);
      const canBundle = !standing.onHold && openForReq.length < r.items.length;

      html +=
        '<div class="buttons">' +
        btn("Back to list", "close") +
        (canBundle
          ? btn("⚡ 1-Click Issue Full Kit (" + r.items.length + " units)", "issue-bundle", r.id, "primary")
          : standing.onHold
            ? badge("⛔ Club on Auto-Hold", "warn")
            : badge("✅ All kit items issued", "good")) +
        "</div>" +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment (Serialized Laser-QR units & What's in the box)</b></p><ul>" +
        r.items
          .map((itemType) => {
            const issuedLoan = openForReq.find((l) => getAsset(l.asset)?.type === itemType);
            const candidate = assets.find((a) => a.type === itemType && !a.repair && !out(a.id));
            const statusNote = issuedLoan
              ? " — Issued: " + issuedLoan.asset + " (Slip L-" + issuedLoan.num + ")"
              : candidate
                ? " — Ready: " + candidate.id + " (SN: " + candidate.serial + " · " + candidate.grade + ")"
                : " — None on shelf";
            return "<li>" + esc(itemType) + "<small>" + esc(statusNote) + "</small></li>";
          })
          .join("") +
        "</ul><p>" +
        r.note +
        "</p></div>";
    } else {
      html += requests
        .map((r) =>
          row(
            r.event,
            "<small>" + esc(r.id + " · " + r.club + " · " + r.items.length + " items · Due " + r.due) + "</small>",
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    }
    return html;
  }

  function inventory() {
    let html = head(
      "Inventory",
      "Serialized units · Laser-QR tags, What's in the box & waitlists",
      btn(s.showTags ? "Hide Laser-Tags" : "🏷️ Printable Laser-Tags", "toggle-tags"),
    );

    html += renderOmniSearch("Search unit ID (AD-12), model (Belkin), serial # (BLK-002), or bin...");

    const pills = [
      "All items",
      "On shelf",
      "On loan",
      "In repair",
      "Adapters & Cables",
      "AV & Projection",
    ];
    html +=
      '<div class="pill-row">' +
      pills
        .map(
          (p) =>
            '<button type="button" class="pill-btn" data-action="pill" data-val="' +
            esc(p) +
            '" aria-pressed="' +
            (s.filter === p) +
            '">' +
            esc(p) +
            "</button>",
        )
        .join("") +
      "</div>";

    if (s.showTags) {
      html +=
        '<div class="verify-panel">' +
        '<div class="sectionhead"><div><h3>Laser-Etched Hardware QR Tags</h3><small>Engrave directly onto unit chassis to prevent lookalike swaps</small></div>' +
        btn("🖨️ Print Sheet", "print-tags", "", "primary") +
        "</div>" +
        '<div class="tag-sheet">' +
        assets
          .map((a) => {
            const payload = qrPayload(a);
            const src =
              "https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=" +
              encodeURIComponent(payload);
            return (
              '<div class="laser-tag">' +
              "<strong>" + esc(a.id) + " · " + esc(a.model) + "</strong>" +
              '<img src="' + src + '" alt="QR ' + esc(a.id) + '" />' +
              "<span>SN: " + esc(a.serial) + "</span>" +
              "<code>" + esc(payload) + "</code>" +
              "</div>"
            );
          })
          .join("") +
        "</div></div>";
    }

    const qText = s.search.trim().toLowerCase();
    for (const a of assets) {
      const status = a.repair ? "In repair" : out(a.id) ? "On loan" : "On shelf";
      if (s.filter !== "All items" && s.filter !== status && s.filter !== a.category) continue;
      if (
        qText &&
        !`${a.id} ${a.type} ${a.model} ${a.serial} ${a.bin} ${a.category}`
          .toLowerCase()
          .includes(qText)
      ) {
        continue;
      }

      const waiters = s.waitlist[a.id] || [];
      const boxHtml =
        "<div>" +
        a.accessories.map((acc) => '<span class="box-pill">✓ ' + esc(acc) + "</span>").join("") +
        (waiters.length
          ? '<span class="box-pill">🔔 Waitlist: ' + esc(waiters.join(", ")) + "</span>"
          : "") +
        "</div>";

      const subHtml =
        "<small>SN: " +
        esc(a.serial) +
        " · Grade: " +
        esc(a.grade) +
        " · Shelf " +
        esc(a.bin) +
        " · " +
        esc(a.engraving) +
        "</small>" +
        boxHtml;

      const rightControls =
        badge(status, status === "On shelf" ? "good" : status === "In repair" ? "warn" : "") +
        " " +
        (status !== "On shelf" ? btn("🔔 Notify me", "waitlist", a.id) + " " : "") +
        btn(s.auditAssetId === a.id ? "Hide log" : "Audit log", "audit", a.id);

      html += row(a.id + " · " + a.type + " (" + a.model + ")", subHtml, rightControls);

      if (s.auditAssetId === a.id) {
        const logs = s.audit[a.id] || [];
        html +=
          '<div class="record"><small>Cryptographic QR Payload: <code>' +
          esc(qrPayload(a)) +
          '</code></small><div class="audit-list">' +
          logs.map((entry) => "<div>• " + esc(entry) + "</div>").join("") +
          "</div></div>";
      }
    }
    return html;
  }

  function register() {
    let html = head(
      "Loan register",
      "Serialized slips · Open-box PINs & Laser-QR anti-swap verification",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );

    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => {
            const st = getClubStanding(r.club);
            return [r.id, r.id + " · " + r.club + (st.onHold ? " [⛔ ON HOLD]" : "")];
          }),
        ) +
        select(
          "Unit leaving the desk (Laser-QR tagged)",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type + " (SN: " + a.serial + ")"]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Verify QR & Save Issue Slip</button></form>'
      );
    }

    // Inline Anti-Swap Laser-QR Return Verification Panel
    if (s.verifyingLoan !== null) {
      const loan = s.loans.find((l) => l.num === s.verifyingLoan);
      const unit = loan ? getAsset(loan.asset) : null;
      if (loan && unit) {
        const expected = qrPayload(unit);
        const trimmed = s.scannedQr.trim();
        const isMatch = trimmed === expected;
        const isMismatch = trimmed.length > 0 && !isMatch;
        const allAccChecked = unit.accessories.every((_, idx) => Boolean(s.chkAccessories[idx]));
        const canAccept = isMatch && s.chkEngraving && allAccChecked;

        html +=
          '<div class="verify-panel">' +
          '<div class="sectionhead"><div><h3>🛡️ Anti-Swap Laser-QR Return Check · Slip L-' +
          loan.num +
          "</h3><small>Expected Unit: <b>" +
          esc(unit.id) +
          "</b> (" +
          esc(unit.model) +
          ") · Serial: <b>" +
          esc(unit.serial) +
          "</b> · Handover PIN: <code>" +
          esc(loan.pin || "4821") +
          "</code></small></div>" +
          btn("Cancel", "cancel-return") +
          "</div>" +
          "<p><small><b>Laser Engraving Location:</b> " +
          esc(unit.engraving) +
          "</small></p>" +
          '<div class="buttons">' +
          btn("📷 Open Webcam Scanner", "start-cam") +
          btn("✅ Scan Authentic Laser-QR", "sim-valid", "", "primary") +
          btn("🚨 Simulate Swapped / Old Adapter", "sim-swap") +
          "</div>" +
          '<video class="webcam-box" data-webcam hidden autoplay muted playsinline></video>' +
          '<label><span>Scanned Laser-QR Payload</span><input type="text" data-qr-input value="' +
          esc(s.scannedQr) +
          '" placeholder="UNIT:...|SN:...|SIG:..." /></label>' +
          (isMatch
            ? '<div class="alert-msg ok">✅ Authentic Laser-QR matched! Unit <b>' +
              esc(unit.id) +
              "</b> & Serial <b>" +
              esc(unit.serial) +
              "</b> verified.</div>"
            : isMismatch
              ? '<div class="alert-msg warn">🚨 SWAP ALERT! Scanned QR does not match issued unit <b>' +
                esc(unit.id) +
                "</b> (Expected SN: <b>" +
                esc(unit.serial) +
                "</b>). Reject return or log swap incident!</div>"
              : "") +
          '<div class="check-list">' +
          '<label><input type="checkbox" data-chk-eng ' +
          (s.chkEngraving ? "checked" : "") +
          " /> Physical laser engraving & hardware serial number verified on body</label>" +
          unit.accessories
            .map(
              (acc, idx) =>
                '<label><input type="checkbox" data-chk-acc="' +
                idx +
                '" ' +
                (s.chkAccessories[idx] ? "checked" : "") +
                " /> What's in the box verified: " +
                esc(acc) +
                "</label>",
            )
            .join("") +
          "</div>" +
          '<label><span>Post-Return Hardware Health Check</span><select data-health>' +
          opts(
            ["Good — Tested OK", "Minor wear — Still usable", "Needs workshop inspection"].map(
              (h) => [h, h],
            ),
          ) +
          "</select></label>" +
          '<div class="buttons">' +
          btn("✓ Confirm Return & Close Slip", "confirm-return", String(loan.num), "primary", !canAccept) +
          btn("🚨 Flag Swap / Missing Item", "flag-swap", String(loan.num)) +
          "</div></div>";
      }
    }

    html += renderOmniSearch("Search slip (L-402), unit ID (AD-12), borrower (Leela), or request...");
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";

    const qText = s.search.trim().toLowerCase();
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .filter((l) => {
        if (!qText) return true;
        const unit = getAsset(l.asset);
        const req = getReq(l.req);
        return `l-${l.num} ${l.asset} ${l.who} ${l.req} ${unit?.model || ""} ${unit?.serial || ""} ${req?.club || ""}`
          .toLowerCase()
          .includes(qText);
      })
      .slice()
      .reverse();

    if (!shown.length) html += "<p>No matching loan slips.</p>";
    for (const l of shown) {
      const unit = getAsset(l.asset);
      const overdue = isLoanOverdue(l);
      const subHtml =
        "<small>" +
        esc(
          l.req +
            " · " +
            l.who +
            " · Due " +
            l.due +
            " · PIN " +
            (l.pin || "4821") +
            (unit ? " · SN: " + unit.serial : ""),
        ) +
        (overdue ? ' · <b style="color:var(--mark)">OVERDUE</b>' : "") +
        "</small>";

      const actions = l.back
        ? badge("Returned · QR Verified", "good")
        : btn("Verify & Return", "return", String(l.num), "primary") +
          (overdue ? " " + btn("📋 Copy Reminder", "remind", String(l.num)) : "");

      html += row(
        "L-" + l.num + " · " + l.asset + (unit ? " (" + unit.type + ")" : ""),
        subHtml,
        actions,
      );
    }
    return html;
  }

  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter (AD-12). She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, "Counter handover", n.text]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }

  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };

  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-health]")) q("[data-health]").value = s.returnHealth;
    q("[data-status]").textContent = s.notice;
  }

  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }

  async function launchWebcam() {
    stopCamera();
    const video = q("[data-webcam]");
    if (!video || !navigator.mediaDevices?.getUserMedia) {
      s.notice = "Webcam unavailable here — use 'Scan Authentic Laser-QR' or paste payload.";
      q("[data-status]").textContent = s.notice;
      return;
    }
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      video.srcObject = camStream;
      video.hidden = false;
      if ("BarcodeDetector" in window) {
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        camTimer = setInterval(async () => {
          try {
            const codes = await detector.detect(video);
            if (codes.length) {
              s.scannedQr = codes[0].rawValue;
              stopCamera();
              commit("Laser-QR captured from webcam.");
            }
          } catch {}
        }, 400);
      }
    } catch {
      s.notice = "Camera access blocked — use the simulated scan buttons below.";
      q("[data-status]").textContent = s.notice;
    }
  }

  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        stopCamera();
        s = original();
        break;
      case "advance":
        stopCamera();
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated to " + shifts[s.phase].time + ".";
        break;
      case "tab":
        stopCamera();
        s.tab = v;
        s.editing = false;
        s.verifyingLoan = null;
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.selected = v;
        break;
      case "pill":
        s.filter = v;
        break;
      case "clear-search":
        s.search = "";
        break;
      case "pick-suggest":
        s.search = v;
        break;
      case "toggle-tags":
        s.showTags = !s.showTags;
        break;
      case "print-tags":
        window.print();
        return;
      case "audit":
        s.auditAssetId = s.auditAssetId === v ? "" : v;
        break;
      case "waitlist": {
        const list = s.waitlist[v] || [];
        if (!list.includes("Next Shift Desk")) {
          s.waitlist[v] = [...list, "Next Shift Desk"];
          s.notice = "🔔 Waitlist alert set for " + v + " when returned.";
        } else {
          s.notice = "Already on waitlist for " + v + ".";
        }
        break;
      }
      case "clear-hold":
        if (s.clubs[v]) {
          s.clubs[v].holdCleared = true;
          s.clubs[v].flags = 0;
          s.notice = "Auto-hold cleared for " + v + ".";
        }
        break;
      case "clear-pass":
        s.lastGatePass = null;
        break;
      case "issue-bundle": {
        const r = getReq(v);
        if (!r) return;
        const standing = getClubStanding(r.club);
        if (standing.onHold) {
          s.notice = "Cannot issue: " + r.club + " is on Auto-Hold (" + standing.reason + ").";
          break;
        }
        const collector = r.id === "RQ-214" ? "Kabir Sen" : r.owner;
        const issuedUnits = [];
        let lastPin = "5190";
        for (const itemType of r.items) {
          const alreadyOut = s.loans.some(
            (l) => l.req === r.id && !l.back && getAsset(l.asset)?.type === itemType,
          );
          if (alreadyOut) continue;
          const unit = assets.find((a) => a.type === itemType && !a.repair && !out(a.id));
          if (!unit) continue;
          const num = Math.max(...s.loans.map((l) => l.num)) + 1;
          lastPin = makePin(num);
          s.loans.push({ num, req: r.id, asset: unit.id, who: collector, due: r.due, pin: lastPin, back: false });
          s.audit[unit.id] = [
            ...(s.audit[unit.id] || []),
            `Issued to ${collector} (${r.club}) on L-${num} · Laser-QR verified · PIN ${lastPin}`,
          ];
          issuedUnits.push(`${unit.id} (SN: ${unit.serial})`);
        }
        s.lastGatePass = { club: r.club, req: r.id, who: collector, pin: lastPin, units: issuedUnits };
        s.notice = `1-Click Kit Checkout: ${issuedUnits.length} serialized unit(s) issued to ${collector} (PIN ${lastPin}).`;
        break;
      }
      case "new":
        s.editing = true;
        s.verifyingLoan = null;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "return": {
        const l = s.loans.find((x) => x.num === Number(v));
        if (!l || l.back) return;
        s.verifyingLoan = l.num;
        s.scannedQr = "";
        s.chkEngraving = false;
        s.chkAccessories = {};
        s.returnHealth = "Good — Tested OK";
        s.notice = "Scan Laser-QR on " + l.asset + " to verify authenticity before closing L-" + l.num + ".";
        break;
      }
      case "cancel-return":
        stopCamera();
        s.verifyingLoan = null;
        break;
      case "start-cam":
        launchWebcam();
        return;
      case "sim-valid": {
        const l = s.loans.find((x) => x.num === s.verifyingLoan);
        const unit = l ? getAsset(l.asset) : null;
        if (unit) s.scannedQr = qrPayload(unit);
        break;
      }
      case "sim-swap":
        s.scannedQr = "UNIT:AD-15|SN:ANK-831-1108|SIG:INVALID";
        break;
      case "confirm-return": {
        const l = s.loans.find((x) => x.num === Number(v));
        if (!l || l.back) return;
        const unit = getAsset(l.asset);
        const req = getReq(l.req);
        if (!unit || s.scannedQr.trim() !== qrPayload(unit)) return;

        l.back = true;
        stopCamera();
        s.verifyingLoan = null;

        if (req && s.clubs[req.club]) {
          if (isLoanOverdue(l)) s.clubs[req.club].late += 1;
          else s.clubs[req.club].onTime += 1;
          s.clubs[req.club].holdCleared = false;
        }
        const waitNotice = (s.waitlist[unit.id] || []).length
          ? " · 🔔 Waitlist notified: " + s.waitlist[unit.id].join(", ")
          : "";
        delete s.waitlist[unit.id];

        s.audit[unit.id] = [
          ...(s.audit[unit.id] || []),
          `Returned by ${l.who} (L-${l.num}) · Authentic Laser-QR & 3-point checklist passed · Health: ${s.returnHealth}`,
        ];
        s.notice =
          unit.id +
          " (SN: " +
          unit.serial +
          ") Laser-QR verified & returned. Slip L-" +
          l.num +
          " closed." +
          waitNotice;
        break;
      }
      case "flag-swap": {
        const l = s.loans.find((x) => x.num === Number(v));
        if (!l) return;
        const req = getReq(l.req);
        if (req && s.clubs[req.club]) {
          s.clubs[req.club].flags += 1;
          s.clubs[req.club].holdCleared = false;
        }
        s.audit[l.asset] = [
          ...(s.audit[l.asset] || []),
          `🚨 SWAP / DAMAGE ALERT raised on L-${l.num} (${l.who}) — return rejected`,
        ];
        stopCamera();
        s.verifyingLoan = null;
        s.notice =
          "🚨 Swap/damage flag logged for " +
          l.asset +
          ". " +
          (req?.club || "Club") +
          " placed on Auto-Hold.";
        break;
      }
      case "remind": {
        const l = s.loans.find((x) => x.num === Number(v));
        if (!l) return;
        const unit = getAsset(l.asset);
        const req = getReq(l.req);
        const text = `Hi ${l.who} (${req?.club || ""}), reminder to return ${l.asset} (${unit?.model || ""}, SN: ${unit?.serial || ""}) for ${l.req}. Original laser-tagged unit required.`;
        navigator.clipboard?.writeText(text).catch(() => {});
        s.notice = "📋 Overdue reminder copied for " + l.who + " (" + l.asset + ").";
        break;
      }
    }
    commit();
  });

  root.addEventListener("input", (e) => {
    if (e.target.matches("[data-omni]")) {
      const pos = e.target.selectionStart;
      s.search = e.target.value;
      paint();
      const input = q("[data-omni]");
      if (input) {
        input.focus();
        input.setSelectionRange(pos, pos);
      }
    } else if (e.target.matches("[data-qr-input]")) {
      const pos = e.target.selectionStart;
      s.scannedQr = e.target.value;
      paint();
      const input = q("[data-qr-input]");
      if (input) {
        input.focus();
        input.setSelectionRange(pos, pos);
      }
    }
  });

  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-chk-eng]")) {
      s.chkEngraving = e.target.checked;
      paint();
    } else if (e.target.matches("[data-chk-acc]")) {
      s.chkAccessories[e.target.dataset.chkAcc] = e.target.checked;
      paint();
    } else if (e.target.matches("[data-health]")) {
      s.returnHealth = e.target.value;
    }
  });

  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    const standing = getClubStanding(r.club);
    if (standing.onHold) {
      q("[data-status]").textContent =
        "Borrow blocked: " + r.club + " is on Auto-Hold (" + standing.reason + ").";
      return;
    }
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    const pin = makePin(num);
    s.loans.push({ num, req, asset, who, due, pin, back: false });
    s.audit[unit.id] = [
      ...(s.audit[unit.id] || []),
      `Issued to ${who} (${r.club}) on L-${num} · Laser-QR verified · PIN ${pin}`,
    ];
    s.editing = false;
    commit("Issued " + asset + " (SN: " + unit.serial + ") to " + who + " on slip L-" + num + " (PIN " + pin + ").");
  });

  // Keyboard shortcut '/' to jump straight to Omni-Search
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
      const omni = q("[data-omni]");
      if (omni) {
        e.preventDefault();
        omni.focus();
      }
    }
  });

  function restore(d) {
    if (
      !d ||
      d.version !== 3 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !Array.isArray(d.loans)
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }

  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep fresh shift if storage is unavailable.
  }
})();