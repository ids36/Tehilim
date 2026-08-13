// ==========================================
// אפליקציית תהילים + תפילות
// נוסח עדות המזרח
// ==========================================


let currentChapter = null;

let readingSource = "chapters";

let currentDayNumber = null;
let currentDayStart = null;
let currentDayEnd = null;

let currentPrayer = null;


// ==========================================
// הגדרות
// ==========================================

const SETTINGS_FONT_KEY =
    "tehillimFontSize";

const SETTINGS_THEME_KEY =
    "tehillimTheme";


function getSavedFontSize() {

    try {

        const saved =
            localStorage.getItem(
                SETTINGS_FONT_KEY
            );

        if (
            saved === "small" ||
            saved === "large"
        ) {

            return saved;

        }

        return "medium";

    } catch (error) {

        return "medium";

    }

}


function getSavedTheme() {

    try {

        const saved =
            localStorage.getItem(
                SETTINGS_THEME_KEY
            );

        if (saved === "dark") {

            return "dark";

        }

        return "light";

    } catch (error) {

        return "light";

    }

}


function applyFontSize() {

    const size =
        getSavedFontSize();

    document.body.style.fontSize =
        size === "small"
            ? "90%"
            : size === "large"
                ? "110%"
                : "100%";


    const readingText =
        document.getElementById(
            "reading-text"
        );

    if (readingText) {

        if (size === "small") {

            readingText.style.fontSize =
                "18px";

        } else if (size === "large") {

            readingText.style.fontSize =
                "23px";

        } else {

            readingText.style.fontSize =
                "20px";

        }

    }


    const prayerText =
        document.getElementById(
            "prayer-text"
        );

    if (prayerText) {

        if (size === "small") {

            prayerText.style.fontSize =
                "18px";

        } else if (size === "large") {

            prayerText.style.fontSize =
                "23px";

        } else {

            prayerText.style.fontSize =
                "20px";

        }

    }

}


function applyTheme() {

    const theme =
        getSavedTheme();

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }

}


window.setFontSize =
    function (size) {

        if (
            size !== "small" &&
            size !== "medium" &&
            size !== "large"
        ) {

            return;

        }


        try {

            localStorage.setItem(
                SETTINGS_FONT_KEY,
                size
            );

        } catch (error) {

            console.error(error);

        }


        applyFontSize();

        updateSettingsButtons();

    };


window.setTheme =
    function (theme) {

        if (
            theme !== "light" &&
            theme !== "dark"
        ) {

            return;

        }


        try {

            localStorage.setItem(
                SETTINGS_THEME_KEY,
                theme
            );

        } catch (error) {

            console.error(error);

        }


        applyTheme();

        updateSettingsButtons();

    };


function updateSettingsButtons() {

    const fontSize =
        getSavedFontSize();

    const theme =
        getSavedTheme();


    const fontButtons = {

        small:
            document.getElementById(
                "font-small"
            ),

        medium:
            document.getElementById(
                "font-medium"
            ),

        large:
            document.getElementById(
                "font-large"
            )

    };


    Object.keys(fontButtons).forEach(
        function (key) {

            const button =
                fontButtons[key];

            if (!button) {
                return;
            }

            button.classList.toggle(
                "active",
                key === fontSize
            );

        }
    );


    const themeButtons = {

        light:
            document.getElementById(
                "theme-light"
            ),

        dark:
            document.getElementById(
                "theme-dark"
            )

    };


    Object.keys(themeButtons).forEach(
        function (key) {

            const button =
                themeButtons[key];

            if (!button) {
                return;
            }

            button.classList.toggle(
                "active",
                key === theme
            );

        }
    );

}


// ==========================================
// מועדפים
// ==========================================

function getFavorites() {

    try {

        const saved =
            localStorage.getItem("tehillimFavorites");

        if (!saved) {
            return [];
        }

        const favorites =
            JSON.parse(saved);

        if (!Array.isArray(favorites)) {
            return [];
        }

        return favorites
            .map(Number)
            .filter(function (number) {

                return (
                    Number.isInteger(number) &&
                    number >= 1 &&
                    number <= 150
                );

            });

    } catch (error) {

        console.error(error);

        return [];

    }

}


// ==========================================
// שמירת מועדפים
// ==========================================

function saveFavorites(favorites) {

    try {

        localStorage.setItem(
            "tehillimFavorites",
            JSON.stringify(favorites)
        );

    } catch (error) {

        console.error(error);

    }

}


// ==========================================
// בדיקה אם פרק במועדפים
// ==========================================

function isFavorite(chapterNumber) {

    const favorites =
        getFavorites();

    return favorites.includes(chapterNumber);

}


// ==========================================
// הוספת פרק למועדפים
// ==========================================

function addFavorite(chapterNumber) {

    let favorites =
        getFavorites();

    if (!favorites.includes(chapterNumber)) {

        favorites.push(chapterNumber);

    }

    favorites.sort(function (a, b) {

        return a - b;

    });

    saveFavorites(favorites);

}


// ==========================================
// הסרת פרק מהמועדפים
// ==========================================

function removeFavorite(chapterNumber) {

    let favorites =
        getFavorites();

    favorites =
        favorites.filter(function (number) {

            return number !== chapterNumber;

        });

    saveFavorites(favorites);

}


// ==========================================
// לחיצה על הלב
// ==========================================

window.toggleFavorite = function () {

    if (currentChapter === null) {
        return;
    }

    if (isFavorite(currentChapter)) {

        removeFavorite(currentChapter);

    } else {

        addFavorite(currentChapter);

    }

    updateFavoriteButton();

};


// ==========================================
// עדכון הלב
// ==========================================

function updateFavoriteButton() {

    const button =
        document.getElementById(
            "favorite-button"
        );

    if (!button) {
        return;
    }

    if (
        currentChapter !== null &&
        isFavorite(currentChapter)
    ) {

        button.textContent = "♥";

        button.classList.add(
            "favorite-active"
        );

        button.setAttribute(
            "aria-label",
            "הסרה מהמועדפים"
        );

    } else {

        button.textContent = "♡";

        button.classList.remove(
            "favorite-active"
        );

        button.setAttribute(
            "aria-label",
            "הוספה למועדפים"
        );

    }

}


// ==========================================
// המרה ממספר לאותיות עבריות
// ==========================================

function numberToHebrew(number) {

    const values = [

        [400, "ת"],
        [300, "ש"],
        [200, "ר"],
        [100, "ק"],
        [90, "צ"],
        [80, "פ"],
        [70, "ע"],
        [60, "ס"],
        [50, "נ"],
        [40, "מ"],
        [30, "ל"],
        [20, "כ"],
        [10, "י"],
        [9, "ט"],
        [8, "ח"],
        [7, "ז"],
        [6, "ו"],
        [5, "ה"],
        [4, "ד"],
        [3, "ג"],
        [2, "ב"],
        [1, "א"]

    ];

    let result = "";

    for (const [value, letter] of values) {

        while (number >= value) {

            result += letter;

            number -= value;

        }

    }

    if (result === "יה") {
        result = "טו";
    }

    if (result === "יו") {
        result = "טז";
    }

    if (result.length === 1) {

        return result + "׳";

    }

    return (
        result.slice(0, -1) +
        "״" +
        result.slice(-1)
    );

}


// ==========================================
// שמות הימים
// ==========================================

const dayNames = [

    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "שבת"

];


// ==========================================
// חלוקת תהילים לפי ימי השבוע
// ==========================================

const weeklyChapters = {

    0: {
        name: "יום ראשון",
        chapters: [1, 29]
    },

    1: {
        name: "יום שני",
        chapters: [30, 50]
    },

    2: {
        name: "יום שלישי",
        chapters: [51, 72]
    },

    3: {
        name: "יום רביעי",
        chapters: [73, 89]
    },

    4: {
        name: "יום חמישי",
        chapters: [90, 106]
    },

    5: {
        name: "יום שישי",
        chapters: [107, 119]
    },

    6: {
        name: "שבת",
        chapters: [120, 150]
    }

};


// ==========================================
// יצירת 150 פרקים
// ==========================================

function createChapterButtons() {

    const container =
        document.getElementById("chapters");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 1; i <= 150; i++) {

        const button =
            document.createElement("button");

        button.className =
            "chapter-button";

        button.textContent =
            numberToHebrew(i);

        button.onclick = function () {

            readingSource =
                "chapters";

            openChapter(i);

        };

        container.appendChild(
            button
        );

    }

}


// ==========================================
// יצירת פרקי היום
// ==========================================

function createDayChapterButtons(dayNumber) {

    const container =
        document.getElementById(
            "day-chapters"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const dayData =
        weeklyChapters[dayNumber];

    if (!dayData) {
        return;
    }

    for (
        let i = dayData.chapters[0];
        i <= dayData.chapters[1];
        i++
    ) {

        const button =
            document.createElement("button");

        button.className =
            "chapter-button";

        button.textContent =
            numberToHebrew(i);

        button.onclick = function () {

            readingSource =
                "day";

            currentDayNumber =
                dayNumber;

            currentDayStart =
                dayData.chapters[0];

            currentDayEnd =
                dayData.chapters[1];

            openChapter(i);

        };

        container.appendChild(
            button
        );

    }

}


// ==========================================
// יצירת ימים נוספים
// ==========================================

function createOtherDaysButtons(currentDay) {

    const container =
        document.getElementById(
            "other-days"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let day = 0; day <= 6; day++) {

        if (day === currentDay) {
            continue;
        }

        const button =
            document.createElement("button");

        button.className =
            "day-button";

        button.textContent =
            dayNames[day];

        button.onclick = function () {

            showSpecificDay(day);

        };

        container.appendChild(
            button
        );

    }

}


// ==========================================
// הצגת יום מסוים
// ==========================================

function showSpecificDay(dayNumber) {

    const dayData =
        weeklyChapters[dayNumber];

    if (!dayData) {
        return;
    }

    hideAllScreens();

    document
        .getElementById("days-screen")
        .classList.remove("hidden");

    document
        .getElementById("today-title")
        .textContent =
        dayData.name;

    document
        .getElementById("today-description")
        .textContent =
        "פרקי " + dayData.name;

    createDayChapterButtons(
        dayNumber
    );

    createOtherDaysButtons(
        dayNumber
    );

}


// ==========================================
// פתיחת לפי יום
// ==========================================

window.showDays = function () {

    const today =
        new Date().getDay();

    showSpecificDay(today);

};


// ==========================================
// הצגת מועדפים
// ==========================================

window.showFavorites = function () {

    hideAllScreens();

    document
        .getElementById("favorites-screen")
        .classList.remove("hidden");

    createFavoriteButtons();

};


// ==========================================
// יצירת כפתורי מועדפים
// ==========================================

function createFavoriteButtons() {

    const container =
        document.getElementById(
            "favorites"
        );

    const emptyMessage =
        document.getElementById(
            "favorites-empty"
        );

    if (!container || !emptyMessage) {
        return;
    }

    container.innerHTML = "";

    let favorites =
        getFavorites();

    favorites.sort(function (a, b) {

        return a - b;

    });

    saveFavorites(
        favorites
    );

    if (favorites.length === 0) {

        emptyMessage.classList.remove(
            "hidden"
        );

        return;

    }

    emptyMessage.classList.add(
        "hidden"
    );

    favorites.forEach(
        function (chapterNumber) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "chapter-button";

            button.textContent =
                numberToHebrew(
                    chapterNumber
                );

            button.onclick =
                function () {

                    readingSource =
                        "favorites";

                    openChapter(
                        chapterNumber
                    );

                };

            container.appendChild(
                button
            );

        }
    );

}


// ==========================================
// חיפוש בתהילים
// ==========================================

let currentSearchQuery = "";


window.showSearch =
    function () {

        hideAllScreens();

        document
            .getElementById("search-screen")
            .classList.remove("hidden");


        const input =
            document.getElementById(
                "search-input"
            );

        const status =
            document.getElementById(
                "search-status"
            );

        const results =
            document.getElementById(
                "search-results"
            );


        if (status) {
            status.textContent = "";
        }

        if (results) {
            results.innerHTML = "";
        }


        if (input) {

            input.value =
                currentSearchQuery;

            setTimeout(
                function () {

                    input.focus();

                },
                50
            );

        }

    };


async function searchPsalms(query) {

    const url =
        "https://www.sefaria.org/api/search-wrapper";


    const body = {

        type: "text",

        query: query,

        field: "naive_lemmatizer",

        slop: 10,

        size: 50,

        filters: [
            "Tanakh/Psalms"
        ],

        filter_fields: [
            "path"
        ],

        sort_method: "score",

        sort_fields: [
            "pagesheetrank"
        ],

        source_proj: [
            "ref",
            "exact",
            "lang",
            "path"
        ]

    };


    let response =
        await fetch(
            url,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(body)
            }
        );


    if (!response.ok) {

        throw new Error(
            "Search API error"
        );

    }


    let data =
        await response.json();


    let hits =
        data &&
        data.hits &&
        Array.isArray(data.hits.hits)
            ? data.hits.hits
            : [];


    /*
       אם המבנה המדויק של נתיב הספר
       משתנה ב-Sefaria, ננסה חיפוש
       נוסף לפי Psalms.
    */

    if (hits.length === 0) {

        const fallbackBody = {

            type: "text",

            query: query,

            field: "naive_lemmatizer",

            slop: 10,

            size: 50,

            filters: [
                "Psalms"
            ],

            filter_fields: [
                "path"
            ],

            sort_method: "score",

            sort_fields: [
                "pagesheetrank"
            ],

            source_proj: [
                "ref",
                "exact",
                "lang",
                "path"
            ]

        };


        response =
            await fetch(
                url,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            fallbackBody
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Search fallback error"
            );

        }


        data =
            await response.json();


        hits =
            data &&
            data.hits &&
            Array.isArray(data.hits.hits)
                ? data.hits.hits
                : [];

    }


    return hits;

}


function extractSearchHitSource(hit) {

    if (!hit) {
        return {};
    }


    if (
        hit._source &&
        typeof hit._source === "object"
    ) {

        return hit._source;

    }


    if (
        hit.source &&
        typeof hit.source === "object"
    ) {

        return hit.source;

    }


    return hit;

}


function getSearchReference(source) {

    if (!source) {
        return "";
    }


    return (
        source.ref ||
        source.reference ||
        ""
    );

}


function getSearchText(source, hit) {

    if (source) {

        if (
            typeof source.exact === "string"
        ) {

            return source.exact;

        }

        if (
            typeof source.text === "string"
        ) {

            return source.text;

        }

    }


    if (
        hit &&
        typeof hit.highlight === "object"
    ) {

        const highlight =
            hit.highlight;


        const possibleFields = [

            "exact",

            "naive_lemmatizer"

        ];


        for (
            let i = 0;
            i < possibleFields.length;
            i++
        ) {

            const field =
                possibleFields[i];


            if (
                Array.isArray(
                    highlight[field]
                ) &&
                highlight[field].length > 0
            ) {

                return highlight[field][0];

            }

        }

    }


    return "";

}


function extractPsalmNumber(ref) {

    if (!ref) {
        return null;
    }


    const match =
        ref.match(
            /Psalms\s+(\d+)/i
        );


    if (!match) {
        return null;
    }


    const number =
        Number(match[1]);


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 150
    ) {

        return null;

    }


    return number;

}


function extractVerseNumber(ref) {

    if (!ref) {
        return null;
    }


    const match =
        ref.match(
            /Psalms\s+\d+:(\d+)/i
        );


    if (!match) {
        return null;
    }


    const number =
        Number(match[1]);


    if (!Number.isInteger(number)) {
        return null;
    }


    return number;

}


function cleanSearchText(text) {

    if (
        typeof text !== "string"
    ) {

        return "";

    }


    return text
        .replace(
            /<[^>]*>/g,
            ""
        )
        .replace(
            /\{פ\}/g,
            ""
        )
        .replace(
            /\{ס\}/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


function displaySearchResults(hits) {

    const container =
        document.getElementById(
            "search-results"
        );

    const status =
        document.getElementById(
            "search-status"
        );


    if (!container || !status) {
        return;
    }


    container.innerHTML = "";


    const results = [];


    hits.forEach(
        function (hit) {

            const source =
                extractSearchHitSource(
                    hit
                );


            const ref =
                getSearchReference(
                    source
                );


            const chapterNumber =
                extractPsalmNumber(
                    ref
                );


            if (!chapterNumber) {
                return;
            }


            const verseNumber =
                extractVerseNumber(
                    ref
                );


            const text =
                cleanSearchText(
                    getSearchText(
                        source,
                        hit
                    )
                );


            if (!text) {
                return;
            }


            results.push({

                ref: ref,

                chapter:
                    chapterNumber,

                verse:
                    verseNumber,

                text:
                    text

            });

        }
    );


    const uniqueResults = [];


    results.forEach(
        function (result) {

            const key =
                result.ref +
                "|" +
                result.text;


            const exists =
                uniqueResults.some(
                    function (item) {

                        return (
                            item.ref +
                            "|" +
                            item.text
                        ) === key;

                    }
                );


            if (!exists) {

                uniqueResults.push(
                    result
                );

            }

        }
    );


    if (
        uniqueResults.length === 0
    ) {

        status.textContent =
            "לא נמצאו תוצאות מתאימות.";

        return;

    }


    status.textContent =
        "נמצאו " +
        uniqueResults.length +
        " תוצאות";


    uniqueResults.forEach(
        function (result) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "search-result";


            const reference =
                document.createElement(
                    "div"
                );


            reference.className =
                "search-result-reference";


            let referenceText =
                "תהילים " +
                numberToHebrew(
                    result.chapter
                );


            if (
                result.verse !== null
            ) {

                referenceText +=
                    ":" +
                    result.verse;

            }


            reference.textContent =
                referenceText;


            const text =
                document.createElement(
                    "div"
                );


            text.className =
                "search-result-text";


            text.textContent =
                result.text;


            button.appendChild(
                reference
            );


            button.appendChild(
                text
            );


            button.onclick =
                function () {

                    readingSource =
                        "search";

                    openChapter(
                        result.chapter
                    );

                };


            container.appendChild(
                button
            );

        }
    );

}


async function performSearch() {

    const input =
        document.getElementById(
            "search-input"
        );

    const status =
        document.getElementById(
            "search-status"
        );

    const results =
        document.getElementById(
            "search-results"
        );


    if (!input || !status || !results) {
        return;
    }


    const query =
        input.value
            .trim();


    if (!query) {

        status.textContent =
            "כתוב מילה או פסוק לחיפוש.";

        results.innerHTML = "";

        return;

    }


    currentSearchQuery =
        query;


    results.innerHTML = "";


    status.textContent =
        "מחפש בתהילים...";


    try {

        const hits =
            await searchPsalms(
                query
            );


        displaySearchResults(
            hits
        );


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        status.textContent =
            "קרתה תקלה בחיפוש. נסה/י שוב.";

        results.innerHTML = "";

    }

}


// ==========================================
// הגדרות
// ==========================================

window.showSettings =
    function () {

        hideAllScreens();

        document
            .getElementById("settings-screen")
            .classList.remove("hidden");

        updateSettingsButtons();

    };


window.showAbout =
    function () {

        hideAllScreens();

        document
            .getElementById("about-screen")
            .classList.remove("hidden");

    };


// ==========================================
// תפילות
// ==========================================

const prayers = [

    {
        id: "morning-blessings",
        name: "ברכות השחר",

        refs: [

            "Siddur Edot HaMizrach, Preparatory Prayers, Modeh Ani",

            "Siddur Edot HaMizrach, Preparatory Prayers, Morning Blessings",

            "Siddur Edot HaMizrach, Preparatory Prayers, Torah Blessings"

        ]

    },


    {
        id: "shacharit",
        name: "שחרית",

        refs: [

            "Siddur Edot HaMizrach, Weekday Shacharit, Petichat Eliyahu",

            "Siddur Edot HaMizrach, Weekday Shacharit, Order of Talit",

            "Siddur Edot HaMizrach, Weekday Shacharit, Order of Tefillin",

            "Siddur Edot HaMizrach, Weekday Shacharit, Hanna's Prayer",

            "Siddur Edot HaMizrach, Weekday Shacharit, Morning Prayer",

            "Siddur Edot HaMizrach, Weekday Shacharit, Incense Offering",

            "Siddur Edot HaMizrach, Weekday Shacharit, Hodu",

            "Siddur Edot HaMizrach, Weekday Shacharit, Pesukei D'Zimra",

            "Siddur Edot HaMizrach, Weekday Shacharit, The Shema",

            "Siddur Edot HaMizrach, Weekday Shacharit, Amida",

            "Siddur Edot HaMizrach, Weekday Shacharit, Vidui",

            "Siddur Edot HaMizrach, Weekday Shacharit, Torah Reading",

            "Siddur Edot HaMizrach, Weekday Shacharit, Ashrei",

            "Siddur Edot HaMizrach, Weekday Shacharit, Uva LeSion",

            "Siddur Edot HaMizrach, Weekday Shacharit, Beit Yaakov",

            "Siddur Edot HaMizrach, Weekday Shacharit, Song of the Day",

            "Siddur Edot HaMizrach, Weekday Shacharit, Kaveh",

            "Siddur Edot HaMizrach, Weekday Shacharit, Alenu"

        ]

    },


    {
        id: "mincha",
        name: "מנחה",

        refs: [

            "Siddur Edot HaMizrach, Weekday Mincha, Offerings",

            "Siddur Edot HaMizrach, Weekday Mincha, Amida",

            "Siddur Edot HaMizrach, Weekday Mincha, Vidui",

            "Siddur Edot HaMizrach, Weekday Mincha, Alenu"

        ]

    },


    {
        id: "arvit",
        name: "ערבית",

        refs: [

            "Siddur Edot HaMizrach, Weekday Arvit, Barchu",

            "Siddur Edot HaMizrach, Weekday Arvit, The Shema",

            "Siddur Edot HaMizrach, Weekday Arvit, Amidah",

            "Siddur Edot HaMizrach, Weekday Arvit, Alenu"

        ]

    },


    {
        id: "blessings-enjoyments",
        name: "ברכות הנהנין",

        refs: [

            "Siddur Edot HaMizrach, Blessings on Enjoyments"

        ]

    },


    {
        id: "birkat-hamazon",
        name: "ברכת המזון",

        refs: [

            "Siddur Edot HaMizrach, Post Meal Blessing"

        ]

    },


    {
        id: "al-hamichya",
        name: "מעין שלוש",

        refs: [

            "Siddur Edot HaMizrach, Al Hamihya"

        ]

    },


    {
        id: "borei-nefashot",
        name: "בורא נפשות",

        refs: [

            "Siddur Edot HaMizrach, Blessings on Enjoyments 13"

        ]

    },


    {
        id: "bedtime-shema",
        name: "קריאת שמע שעל המיטה",

        refs: [

            "Siddur Edot HaMizrach, Bedtime Shema"

        ]

    },


    {
        id: "havdalah",
        name: "הבדלה",

        refs: [

            "Siddur Edot HaMizrach, Havdalah, Havdala"

        ]

    },


    {
        id: "selichot",
        name: "סליחות",

        refs: [

            "Selichot Edot HaMizrach"

        ],

        filter: "selichot"

    }

];


// ==========================================
// יצירת כפתורי תפילות
// ==========================================

function createPrayerButtons() {

    const container =
        document.getElementById(
            "prayers-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    prayers.forEach(
        function (prayer) {

            const button =
                document.createElement("button");

            button.className =
                "prayer-button";

            button.textContent =
                prayer.name;

            button.onclick =
                function () {

                    openPrayer(
                        prayer
                    );

                };

            container.appendChild(
                button
            );

        }
    );

}


// ==========================================
// פתיחת מסך תפילות
// ==========================================

window.showPrayers = function () {

    hideAllScreens();

    document
        .getElementById("prayers-screen")
        .classList.remove("hidden");

    createPrayerButtons();

};


// ==========================================
// יצירת URL ל-Sefaria
// ==========================================

function buildSefariaUrl(ref) {

    return (
        "https://www.sefaria.org/api/v3/texts/" +
        encodeURIComponent(ref) +
        "?version=hebrew&return_format=text_only"
    );

}


// ==========================================
// טעינת חלק תפילה
// ==========================================

async function fetchPrayerPart(ref) {

    const url =
        buildSefariaUrl(ref);

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Sefaria error: " + ref
        );

    }

    const data =
        await response.json();

    if (
        !data.versions ||
        data.versions.length === 0
    ) {

        throw new Error(
            "No Hebrew version: " + ref
        );

    }

    const version =
        data.versions[0];

    if (
        !version ||
        version.text === undefined ||
        version.text === null
    ) {

        throw new Error(
            "Empty text: " + ref
        );

    }

    return version.text;

}


// ==========================================
// המרת טקסט לכל החלקים
// ==========================================

function collectTextParts(
    value,
    result
) {

    if (!result) {
        result = [];
    }

    if (Array.isArray(value)) {

        value.forEach(
            function (item) {

                collectTextParts(
                    item,
                    result
                );

            }
        );

    } else if (
        typeof value === "string"
    ) {

        const cleaned =
            value
                .replace(
                    /\{פ\}/g,
                    ""
                )
                .trim();

        if (cleaned) {

            result.push(
                cleaned
            );

        }

    }

    return result;

}


// ==========================================
// ניקוי טקסט תפילה
// ==========================================

function cleanPrayerText(text) {

    if (typeof text !== "string") {
        return "";
    }

    return text
        .replace(
            /\{פ\}/g,
            ""
        )
        .replace(
            /\{ס\}/g,
            ""
        )
        .trim();

}


// ==========================================
// סינון בורא נפשות
// ==========================================

function filterBoreiNefashot(parts) {

    const result = [];

    let found = false;

    parts.forEach(
        function (part) {

            const normalized =
                part
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();

            if (
                normalized.includes(
                    "בורא נפשות"
                ) ||
                normalized.includes(
                    "בורא נפשות רבות"
                )
            ) {

                found = true;

                result.push(
                    normalized
                );

                return;

            }


            if (found) {

                if (
                    normalized.includes(
                        "ברוך חי העולמים"
                    ) ||
                    normalized.includes(
                        "חי העולמים"
                    )
                ) {

                    result.push(
                        normalized
                    );

                    found = false;

                }

            }

        }
    );


    if (
        result.length === 0
    ) {

        const combined =
            parts.join(" ");

        const start =
            combined.indexOf(
                "בורא נפשות"
            );

        if (start !== -1) {

            let end =
                combined.indexOf(
                    "ברוך חי העולמים",
                    start
                );

            if (end !== -1) {

                end +=
                    "ברוך חי העולמים".length;

                return [
                    combined.slice(
                        start,
                        end
                    ).trim()
                ];

            }

        }

    }


    return result;

}


// ==========================================
// סינון סליחות
// ==========================================

function filterSelichot(parts) {

    return parts.filter(
        function (part) {

            return (
                part &&
                part.trim().length > 0
            );

        }
    );

}


// ==========================================
// פתיחת תפילה
// ==========================================

window.openPrayer =
    async function (prayer) {

        currentPrayer =
            prayer;

        hideAllScreens();

        document
            .getElementById(
                "prayer-reading-screen"
            )
            .classList.remove(
                "hidden"
            );


        const title =
            document.getElementById(
                "prayer-reading-title"
            );


        const loading =
            document.getElementById(
                "prayer-reading-loading"
            );


        const error =
            document.getElementById(
                "prayer-reading-error"
            );


        const textContainer =
            document.getElementById(
                "prayer-text"
            );


        title.textContent =
            prayer.name;


        textContainer.innerHTML =
            "";


        error.classList.add(
            "hidden"
        );


        loading.classList.remove(
            "hidden"
        );


        try {

            const allParts = [];


            for (
                let i = 0;
                i < prayer.refs.length;
                i++
            ) {

                const ref =
                    prayer.refs[i];


                const text =
                    await fetchPrayerPart(
                        ref
                    );


                const parts =
                    collectTextParts(
                        text
                    );


                parts.forEach(
                    function (part) {

                        const cleaned =
                            cleanPrayerText(
                                part
                            );

                        if (cleaned) {

                            allParts.push(
                                cleaned
                            );

                        }

                    }
                );

            }


            let finalParts =
                allParts;


            if (
                prayer.filter ===
                "borei-nefashot"
            ) {

                finalParts =
                    filterBoreiNefashot(
                        allParts
                    );

            }


            if (
                prayer.filter ===
                "selichot"
            ) {

                finalParts =
                    filterSelichot(
                        allParts
                    );

            }


            if (
                !finalParts ||
                finalParts.length === 0
            ) {

                throw new Error(
                    "Prayer text is empty"
                );

            }


            loading.classList.add(
                "hidden"
            );


            displayPrayerText(
                finalParts
            );


        } catch (errorObject) {

            console.error(
                "Prayer loading error:",
                errorObject
            );


            loading.classList.add(
                "hidden"
            );


            textContainer.innerHTML =
                "";


            error.classList.remove(
                "hidden"
            );

        }

    };


// ==========================================
// הצגת טקסט תפילה
// ==========================================

function displayPrayerText(text) {

    const container =
        document.getElementById(
            "prayer-text"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "";


    let paragraphs = [];


    if (Array.isArray(text)) {

        text.forEach(
            function (item) {

                const cleaned =
                    cleanPrayerText(
                        item
                    );

                if (cleaned) {

                    paragraphs.push(
                        cleaned
                    );

                }

            }
        );

    } else {

        paragraphs =
            collectTextParts(
                text
            );

    }


    paragraphs.forEach(
        function (paragraph) {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "prayer-paragraph";


            element.textContent =
                paragraph;


            container.appendChild(
                element
            );

        }
    );


    applyFontSize();

}


// ==========================================
// חזרה ממסך תפילה
// ==========================================

window.backFromPrayerReading =
    function () {

        showPrayers();

    };


// ==========================================
// ניסיון נוסף לתפילה
// ==========================================

window.retryCurrentPrayer =
    function () {

        if (currentPrayer) {

            openPrayer(
                currentPrayer
            );

        }

    };


// ==========================================
// חזרה למסך הבית
// ==========================================

window.showHome =
    function () {

        hideAllScreens();

        document
            .getElementById("home-screen")
            .classList.remove(
                "hidden"
            );

    };


// ==========================================
// פתיחת מסך הפרקים
// ==========================================

window.showChapters =
    function () {

        hideAllScreens();

        document
            .getElementById("chapters-screen")
            .classList.remove(
                "hidden"
            );

    };


// ==========================================
// הסתרת כל המסכים
// ==========================================

function hideAllScreens() {

    const screenIds = [

        "home-screen",

        "search-screen",

        "settings-screen",

        "about-screen",

        "chapters-screen",

        "favorites-screen",

        "days-screen",

        "prayers-screen",

        "prayer-reading-screen",

        "reading-screen",

        "finish-screen"

    ];


    screenIds.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );

            if (element) {

                element.classList.add(
                    "hidden"
                );

            }

        }
    );

}


// ==========================================
// חזרה מהקריאה
// ==========================================

function backFromReading() {

    if (
        readingSource === "day"
    ) {

        showDays();

    } else if (
        readingSource === "favorites"
    ) {

        showFavorites();

    } else if (
        readingSource === "search"
    ) {

        showSearch();

    } else {

        showChapters();

    }

}


// ==========================================
// פתיחת מסך הקריאה
// ==========================================

function showReadingScreen() {

    hideAllScreens();

    document
        .getElementById(
            "reading-screen"
        )
        .classList.remove(
            "hidden"
        );

}


// ==========================================
// פתיחת פרק תהילים
// ==========================================

window.openChapter =
    async function (chapterNumber) {

        currentChapter =
            chapterNumber;


        showReadingScreen();


        const title =
            document.getElementById(
                "reading-title"
            );


        const dayTitle =
            document.getElementById(
                "reading-day-title"
            );


        const textContainer =
            document.getElementById(
                "reading-text"
            );


        const loading =
            document.getElementById(
                "reading-loading"
            );


        const error =
            document.getElementById(
                "reading-error"
            );


        const finishButton =
            document.getElementById(
                "finish-button"
            );


        const previousButton =
            document.getElementById(
                "previous-button"
            );


        const nextButton =
            document.getElementById(
                "next-button"
            );


        title.textContent =
            "תהילים " +
            numberToHebrew(
                chapterNumber
            );


        if (
            readingSource === "day"
        ) {

            const dayName =
                dayNames[
                    currentDayNumber
                ];

            dayTitle.textContent =
                "תהילים ל" +
                dayName;

        } else {

            dayTitle.textContent =
                "";

        }


        textContainer.innerHTML =
            "";


        error.classList.add(
            "hidden"
        );


        loading.classList.remove(
            "hidden"
        );


        finishButton.classList.add(
            "hidden"
        );


        previousButton.classList.remove(
            "hidden"
        );


        nextButton.classList.remove(
            "hidden"
        );


        updateFavoriteButton();

        applyFontSize();


        if (
            readingSource === "day" &&
            chapterNumber === currentDayStart
        ) {

            previousButton.classList.add(
                "hidden"
            );

        }


        if (
            readingSource === "day" &&
            chapterNumber === currentDayEnd
        ) {

            finishButton.classList.remove(
                "hidden"
            );

            nextButton.classList.add(
                "hidden"
            );

        }


        try {

            const url =
                "https://www.sefaria.org/api/v3/texts/Psalms%20" +
                chapterNumber +
                "?version=hebrew&return_format=text_only";


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Sefaria Psalms error"
                );

            }


            const data =
                await response.json();


            if (
                !data.versions ||
                data.versions.length === 0
            ) {

                throw new Error(
                    "No Psalms version"
                );

            }


            const verses =
                data.versions[0].text;


            if (
                !verses ||
                verses.length === 0
            ) {

                throw new Error(
                    "Empty Psalms text"
                );

            }


            loading.classList.add(
                "hidden"
            );


            displayVerses(
                verses
            );


        } catch (errorObject) {

            console.error(
                errorObject
            );


            loading.classList.add(
                "hidden"
            );


            textContainer.innerHTML =
                "";


            error.classList.remove(
                "hidden"
            );

        }

    };


// ==========================================
// הצגת הפסוקים
// ==========================================

function displayVerses(verses) {

    const container =
        document.getElementById(
            "reading-text"
        );

    container.innerHTML =
        "";


    let verseList = [];


    function collectVerses(value) {

        if (Array.isArray(value)) {

            value.forEach(
                function (item) {

                    collectVerses(
                        item
                    );

                }
            );

        } else if (
            typeof value === "string"
        ) {

            verseList.push(
                value
            );

        }

    }


    collectVerses(
        verses
    );


    verseList.forEach(
        function (verse, index) {

            const verseElement =
                document.createElement(
                    "div"
                );

            verseElement.className =
                "verse";


            verse =
                verse
                    .replace(
                        /\{פ\}/g,
                        ""
                    )
                    .replace(
                        /פ(?=\s*$)/g,
                        ""
                    )
                    .trim();


            const numberElement =
                document.createElement(
                    "span"
                );

            numberElement.className =
                "verse-number";


            numberElement.textContent =
                index + 1;


            const textElement =
                document.createElement(
                    "span"
                );


            textElement.textContent =
                verse;


            verseElement.appendChild(
                numberElement
            );


            verseElement.appendChild(
                textElement
            );


            container.appendChild(
                verseElement
            );

        }
    );


    applyFontSize();

}


// ==========================================
// ניסיון נוסף לפרק
// ==========================================

window.retryCurrentChapter =
    function () {

        if (
            currentChapter !== null
        ) {

            openChapter(
                currentChapter
            );

        }

    };


// ==========================================
// פרק קודם
// ==========================================

window.previousChapter =
    function () {

        if (
            currentChapter > 1
        ) {

            openChapter(
                currentChapter - 1
            );

        }

    };


// ==========================================
// פרק הבא
// ==========================================

window.nextChapter =
    function () {

        if (
            currentChapter < 150
        ) {

            openChapter(
                currentChapter + 1
            );

        }

    };


// ==========================================
// סיום פרקי היום
// ==========================================

window.finishDay =
    function () {

        document
            .getElementById(
                "reading-screen"
            )
            .classList.add(
                "hidden"
            );


        document
            .getElementById(
                "finish-screen"
            )
            .classList.remove(
                "hidden"
            );

    };


// ==========================================
// המשך לפרק שאחרי היום
// ==========================================

window.continueAfterDay =
    function () {

        const nextChapterNumber =
            currentDayEnd + 1;


        readingSource =
            "chapters";


        if (
            nextChapterNumber <= 150
        ) {

            openChapter(
                nextChapterNumber
            );

        }

    };


// ==========================================
// הפעלה
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createChapterButtons();

        createPrayerButtons();

        applyTheme();

        applyFontSize();

        updateSettingsButtons();


        const searchForm =
            document.getElementById(
                "search-form"
            );


        if (searchForm) {

            searchForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    performSearch();

                }
            );

        }

    }
);
