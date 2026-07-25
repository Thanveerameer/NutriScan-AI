/* =========================================================
   NutriScan AI Version 2
   Module 6 Part 6
   Structured Dashboard Engine
========================================================= */


document.addEventListener("DOMContentLoaded", function () {


    console.log(
        "NutriScan AI Premium Structured Dashboard Loaded"
    );


    /* =====================================================
       HELPERS
    ===================================================== */


    function escapeHTML(value) {

        const div = document.createElement("div");

        div.textContent = value || "";

        return div.innerHTML;

    }


    function getRawContent(section) {

        const element =
            document.querySelector(
                `.raw-ai-content[data-section="${section}"]`
            );

        if (!element) {
            return "";
        }

        return element.textContent
            .replace(/\r/g, "")
            .trim();

    }


    function cleanLine(line) {

        return line
            .replace(/^[-•*✓✔☑]\s*/, "")
            .replace(/^\d+[\).\s-]+/, "")
            .trim();

    }


    function splitLines(text) {

        return text
            .split("\n")
            .map(line => cleanLine(line))
            .filter(line => line.length > 0);

    }


    function splitSentences(text) {

        return text
            .split(/[.!?]\s+/)
            .map(item => item.trim())
            .filter(item => item.length > 0);

    }


    function titleCase(text) {

        return text
            .replace(/[_-]/g, " ")
            .replace(
                /\w\S*/g,
                word =>
                    word.charAt(0).toUpperCase()
                    + word.slice(1).toLowerCase()
            );

    }


    /* =====================================================
       PATIENT PROFILE
    ===================================================== */


    function renderPatientProfile() {

        const container =
            document.getElementById(
                "patientProfileGrid"
            );

        if (!container) {
            return;
        }


        const text =
            getRawContent("patient");


        if (!text) {

            container.innerHTML = `
                <div class="empty-state">
                    Patient details were not available in the report analysis.
                </div>
            `;

            return;
        }


        const lines =
            splitLines(text);


        const fields = [];


        lines.forEach(line => {

            const match =
                line.match(
                    /^([^:]{2,40}):\s*(.+)$/
                );


            if (match) {

                const label =
                    match[1].trim();

                const value =
                    match[2].trim();


                fields.push({
                    label: label,
                    value: value
                });

            }

        });


        /*
            Only show fields that actually exist
            in the AI response.

            No patient details are invented.
        */


        if (fields.length > 0) {

            fields.slice(0, 10).forEach(
                field => {

                    let icon = "📋";

                    const label =
                        field.label.toLowerCase();


                    if (
                        label.includes("name")
                    ) {
                        icon = "🧑";
                    }
                    else if (
                        label.includes("age")
                    ) {
                        icon = "🎂";
                    }
                    else if (
                        label.includes("gender")
                        ||
                        label.includes("sex")
                    ) {
                        icon = "⚧";
                    }
                    else if (
                        label.includes("blood")
                    ) {
                        icon = "🩸";
                    }
                    else if (
                        label.includes("date")
                    ) {
                        icon = "📅";
                    }


                    container.insertAdjacentHTML(
                        "beforeend",
                        `
                        <div class="profile-item">

                            <div>

                                <div class="profile-icon">
                                    ${icon}
                                </div>

                                <div class="profile-label">
                                    ${escapeHTML(field.label)}
                                </div>

                            </div>

                            <div class="profile-value">
                                ${escapeHTML(field.value)}
                            </div>

                        </div>
                        `
                    );

                }
            );

        }
        else {

            /*
                If the AI returned a paragraph instead
                of key/value fields, preserve the
                information rather than inventing fields.
            */

            container.innerHTML = `
                <div class="fallback-content">
                    ${escapeHTML(text)}
                </div>
            `;

        }

    }


    /* =====================================================
       LAB EXPLANATION
    ===================================================== */


    function detectStatus(text) {

        const lower =
            text.toLowerCase();


        if (
            lower.includes("high")
            ||
            lower.includes("elevated")
            ||
            lower.includes("above normal")
        ) {

            return {
                label: "HIGH",
                className: "status-abnormal"
            };

        }


        if (
            lower.includes("low")
            ||
            lower.includes("below normal")
            ||
            lower.includes("decreased")
        ) {

            return {
                label: "LOW",
                className: "status-abnormal"
            };

        }


        if (
            lower.includes("borderline")
            ||
            lower.includes("attention")
            ||
            lower.includes("slightly abnormal")
        ) {

            return {
                label: "ATTENTION",
                className: "status-attention"
            };

        }


        if (
            lower.includes("normal")
            ||
            lower.includes("within range")
        ) {

            return {
                label: "NORMAL",
                className: "status-normal"
            };

        }


        return {
            label: "AI INSIGHT",
            className: "status-neutral"
        };

    }


    function extractValue(text) {

        const patterns = [

            /value\s*:\s*([^,\n]+)/i,

            /result\s*:\s*([^,\n]+)/i,

            /level\s*:\s*([^,\n]+)/i,

            /measured\s*:\s*([^,\n]+)/i

        ];


        for (
            const pattern of patterns
        ) {

            const match =
                text.match(pattern);


            if (match) {

                return match[1].trim();

            }

        }


        return "";

    }


    function extractRange(text) {

        const patterns = [

            /normal\s*range\s*:\s*([^.\n]+)/i,

            /reference\s*range\s*:\s*([^.\n]+)/i,

            /reference\s*:\s*([^.\n]+)/i,

            /range\s*:\s*([^.\n]+)/i

        ];


        for (
            const pattern of patterns
        ) {

            const match =
                text.match(pattern);


            if (match) {

                return match[1].trim();

            }

        }


        return "";

    }


    function renderLabCard(name, text) {

        const status =
            detectStatus(text);


        const value =
            extractValue(text);


        const range =
            extractRange(text);


        let details =
            text;


        /*
            Remove duplicate key/value
            lines from explanation area.
        */

        details =
            details
                .replace(
                    /value\s*:\s*[^,\n]+/ig,
                    ""
                )
                .replace(
                    /result\s*:\s*[^,\n]+/ig,
                    ""
                )
                .replace(
                    /normal\s*range\s*:\s*[^.\n]+/ig,
                    ""
                )
                .replace(
                    /reference\s*range\s*:\s*[^.\n]+/ig,
                    ""
                )
                .trim();


        let html = `

            <article class="lab-card">


                <div class="lab-card-top">

                    <div>

                        <div class="lab-name">
                            ${escapeHTML(name)}
                        </div>

                        ${
                            value
                            ?
                            `
                            <div class="lab-value">
                                Value:
                                <strong>
                                    ${escapeHTML(value)}
                                </strong>
                            </div>
                            `
                            :
                            ""
                        }

                    </div>


                    <span
                        class="status-badge ${status.className}"
                    >
                        ${status.label}
                    </span>


                </div>


        `;


        if (range) {

            html += `

                <div class="lab-detail">

                    <div class="lab-detail-label">
                        Normal / Reference Range
                    </div>

                    <div class="lab-detail-text">
                        ${escapeHTML(range)}
                    </div>

                </div>

            `;

        }


        if (details) {

            html += `

                <div class="lab-detail">

                    <div class="lab-detail-label">
                        AI Explanation
                    </div>

                    <div class="lab-detail-text">
                        ${escapeHTML(details)}
                    </div>

                </div>

            `;

        }


        html += `
            </article>
        `;


        return html;

    }


    function renderLabExplanation() {

        const container =
            document.getElementById(
                "labInsightGrid"
            );


        if (!container) {
            return;
        }


        const text =
            getRawContent("lab");


        if (!text) {

            container.innerHTML = `
                <div class="empty-state">
                    No laboratory explanation was returned by the AI analysis.
                </div>
            `;

            return;
        }


        const lines =
            splitLines(text);


        /*
            Try to detect marker headings.

            Example:
            Hemoglobin:
            Value: 11.2 g/dL
            Normal Range: 13 - 17 g/dL
            Status: LOW
            Explanation: ...
        */


        const cards = [];

        let currentName = null;

        let currentLines = [];


        lines.forEach(line => {

            const headingMatch =
                line.match(
                    /^([A-Za-z][A-Za-z0-9 ()/%-]{2,50}):\s*$/
                );


            if (headingMatch) {

                if (
                    currentName
                    &&
                    currentLines.length
                ) {

                    cards.push({
                        name: currentName,
                        content:
                            currentLines.join("\n")
                    });

                }


                currentName =
                    headingMatch[1].trim();

                currentLines = [];

            }
            else if (currentName) {

                currentLines.push(line);

            }

        });


        if (
            currentName
            &&
            currentLines.length
        ) {

            cards.push({
                name: currentName,
                content:
                    currentLines.join("\n")
            });

        }


        /*
            If headings cannot be detected,
            create insight cards from paragraphs.
        */

        if (cards.length === 0) {

            const chunks =
                text
                    .split(/\n\s*\n/)
                    .map(item => item.trim())
                    .filter(Boolean);


            chunks.forEach(
                (chunk, index) => {

                    const firstLine =
                        splitLines(chunk)[0]
                        || `Lab Insight ${index + 1}`;


                    cards.push({
                        name:
                            firstLine
                                .replace(/:$/, "")
                                .slice(0, 60),

                        content:
                            chunk
                    });

                }
            );

        }


        cards
            .slice(0, 20)
            .forEach(card => {

                container.insertAdjacentHTML(
                    "beforeend",
                    renderLabCard(
                        card.name,
                        card.content
                    )
                );

            });

    }


    /* =====================================================
       NUTRITION
    ===================================================== */


    function renderNutrition() {

        const container =
            document.getElementById(
                "nutritionGrid"
            );


        if (!container) {
            return;
        }


        const text =
            getRawContent("nutrition");


        if (!text) {

            container.innerHTML = `
                <div class="empty-state">
                    No nutrition suggestions were available.
                </div>
            `;

            return;
        }


        const lines =
            splitLines(text);


        /*
            Group lines into simple recommendation
            cards without inventing foods.
        */

        const groups = [];

        let currentTitle = null;

        let currentItems = [];


        lines.forEach(line => {

            const titleMatch =
                line.match(
                    /^([A-Za-z][A-Za-z0-9 ()/&-]{2,45}):\s*$/
                );


            if (titleMatch) {

                if (currentTitle) {

                    groups.push({
                        title: currentTitle,
                        items: currentItems
                    });

                }


                currentTitle =
                    titleMatch[1].trim();

                currentItems = [];

            }
            else {

                if (!currentTitle) {

                    currentTitle =
                        "Nutrition Guidance";

                }

                currentItems.push(line);

            }

        });


        if (currentTitle) {

            groups.push({
                title: currentTitle,
                items: currentItems
            });

        }


        if (groups.length === 0) {

            groups.push({
                title: "Nutrition Guidance",
                items: lines
            });

        }


        groups
            .slice(0, 12)
            .forEach(
                (group, index) => {

                    const iconSet =
                        [
                            "🥗",
                            "🥬",
                            "🫘",
                            "🌾",
                            "🍎",
                            "🥦",
                            "🥕",
                            "💧"
                        ];


                    const icon =
                        iconSet[
                            index %
                            iconSet.length
                        ];


                    const safeItems =
                        group.items
                            .filter(Boolean)
                            .slice(0, 8);


                    let listHTML = "";


                    if (
                        safeItems.length > 0
                    ) {

                        listHTML = `

                            <ul class="nutrition-list">

                                ${
                                    safeItems
                                        .map(
                                            item =>
                                                `
                                                <li>
                                                    ${escapeHTML(item)}
                                                </li>
                                                `
                                        )
                                        .join("")
                                }

                            </ul>

                        `;

                    }


                    container.insertAdjacentHTML(
                        "beforeend",
                        `

                        <article class="nutrition-card">

                            <div class="nutrition-icon">
                                ${icon}
                            </div>

                            <div class="nutrition-title">
                                ${escapeHTML(group.title)}
                            </div>

                            ${listHTML}

                        </article>

                        `
                    );

                }
            );

    }


    /* =====================================================
       LIFESTYLE
    ===================================================== */


    function renderLifestyle() {

        const container =
            document.getElementById(
                "lifestyleGrid"
            );


        if (!container) {
            return;
        }


        const text =
            getRawContent("lifestyle");


        if (!text) {

            container.innerHTML = `
                <div class="empty-state">
                    No lifestyle guidance was available.
                </div>
            `;

            return;
        }


        const lines =
            splitLines(text);


        const categories = [

            {
                keywords: [
                    "morning",
                    "exercise",
                    "walking"
                ],
                title: "Movement",
                icon: "🌅"
            },

            {
                keywords: [
                    "food",
                    "meal",
                    "diet",
                    "eat"
                ],
                title: "Food Habits",
                icon: "🍽️"
            },

            {
                keywords: [
                    "water",
                    "hydration",
                    "drink"
                ],
                title: "Hydration",
                icon: "💧"
            },

            {
                keywords: [
                    "sleep",
                    "rest"
                ],
                title: "Sleep",
                icon: "😴"
            }

        ];


        const used = new Set();


        categories.forEach(
            category => {

                const matches =
                    lines.filter(
                        line =>
                            category.keywords.some(
                                keyword =>
                                    line
                                        .toLowerCase()
                                        .includes(keyword)
                            )
                    );


                if (
                    matches.length > 0
                ) {

                    used.add(
                        category.title
                    );


                    container.insertAdjacentHTML(
                        "beforeend",
                        `

                        <article class="lifestyle-card">

                            <div class="lifestyle-icon">
                                ${category.icon}
                            </div>

                            <div class="lifestyle-title">
                                ${category.title}
                            </div>

                            <div class="lifestyle-text">
                                ${escapeHTML(
                                    matches
                                        .slice(0, 3)
                                        .join(" ")
                                )}
                            </div>

                            <div class="lifestyle-check">
                                ✓
                            </div>

                        </article>

                        `
                    );

                }

            }
        );


        /*
            Remaining guidance is preserved
            instead of being discarded.
        */

        const remaining =
            lines.filter(
                line =>
                    !Array.from(used).some(
                        title => {
                            const category =
                                categories.find(
                                    item =>
                                        item.title === title
                                );

                            return category &&
                                category.keywords.some(
                                    keyword =>
                                        line
                                            .toLowerCase()
                                            .includes(keyword)
                                );
                        }
                    )
            );


        if (
            remaining.length > 0
            &&
            container.children.length < 6
        ) {

            container.insertAdjacentHTML(
                "beforeend",
                `

                <article class="lifestyle-card">

                    <div class="lifestyle-icon">
                        🌿
                    </div>

                    <div class="lifestyle-title">
                        General Wellness
                    </div>

                    <div class="lifestyle-text">
                        ${escapeHTML(
                            remaining
                                .slice(0, 4)
                                .join(" ")
                        )}
                    </div>

                    <div class="lifestyle-check">
                        ✓
                    </div>

                </article>

                `
            );

        }

    }


    /* =====================================================
       DOCTOR DISCUSSION POINTS
    ===================================================== */


    function renderDoctorPoints() {

        const container =
            document.getElementById(
                "doctorChecklist"
            );


        if (!container) {
            return;
        }


        const text =
            getRawContent("doctor");


        if (!text) {

            container.innerHTML = `
                <div class="empty-state">
                    No doctor discussion points were available.
                </div>
            `;

            return;
        }


        const lines =
            splitLines(text);


        const points = [];


        lines.forEach(line => {

            const cleaned =
                line
                    .replace(
                        /^doctor discussion points\s*:/i,
                        ""
                    )
                    .trim();


            if (cleaned) {

                points.push(cleaned);

            }

        });


        if (points.length === 0) {

            points.push(text);

        }


        points
            .slice(0, 12)
            .forEach(point => {

                container.insertAdjacentHTML(
                    "beforeend",
                    `

                    <div class="doctor-item">

                        <div class="doctor-check">
                            ✓
                        </div>

                        <div>
                            ${escapeHTML(point)}
                        </div>

                    </div>

                    `
                );

            });

    }


    /* =====================================================
       CARD ENTRANCE ANIMATION
    ===================================================== */


    function animateCards() {

        const cards =
            document.querySelectorAll(
                `
                .dashboard-card,
                .pdf-card,
                .disclaimer-card
                `
            );


        cards.forEach(
            (card, index) => {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(25px)";


                setTimeout(
                    () => {

                        card.style.transition =
                            "opacity 0.65s ease, transform 0.65s ease";

                        card.style.opacity = "1";

                        card.style.transform =
                            "translateY(0)";

                    },
                    index * 110
                );

            }
        );

    }


    /* =====================================================
       PDF DOWNLOAD MODAL
    ===================================================== */


    function setupDownloadButtons() {

        const forms =
            document.querySelectorAll(
                ".download-form"
            );


        const modal =
            document.getElementById(
                "downloadModal"
            );


        const status =
            document.getElementById(
                "downloadStatus"
            );


        if (!forms.length || !modal) {
            return;
        }


        forms.forEach(
            form => {

                form.addEventListener(
                    "submit",
                    function () {

                        modal.classList.add(
                            "show"
                        );


                        modal.setAttribute(
                            "aria-hidden",
                            "false"
                        );


                        if (status) {

                            status.textContent =
                                "Generating your AI Summary PDF...";

                        }


                        /*
                            IMPORTANT:

                            We DO NOT use
                            window.location.href here.

                            The browser will submit
                            the form using POST.

                            This matches:
                            dashboard.py
                            methods=["POST"]
                        */


                        setTimeout(
                            () => {

                                if (status) {

                                    status.textContent =
                                        "✓ Report ready — preparing download...";

                                }

                            },
                            1400
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */


    renderPatientProfile();

    renderLabExplanation();

    renderNutrition();

    renderLifestyle();

    renderDoctorPoints();

    animateCards();

    setupDownloadButtons();


});