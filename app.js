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
// ניקוי טקסט תהילים
// ==========================================

function cleanPsalmsText(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }

    let result =
        String(text);

    result =
        result
            .replace(
                /&thinsp;/gi,
                " "
            )
            .replace(
                /&nbsp;/gi,
                " "
            )
            .replace(
                /&ensp;/gi,
                " "
            )
            .replace(
                /&emsp;/gi,
                " "
            )
            .replace(
                /&amp;/gi,
                "&"
            )
            .replace(
                /&#160;/gi,
                " "
            )
            .replace(
                /&#8239;/gi,
                " "
            );

    result =
        result.replace(
            /<[^>]*>/g,
            " "
        );

    result =
        result
            .replace(
                /\{פ\}/g,
                ""
            )
            .replace(
                /\{ס\}/g,
                ""
            );

    result =
        result.replace(
            /\s*[׀|]+\s*/g,
            " "
        );

    result =
        result.replace(
            /[A-Za-z]+/g,
            " "
        );

    result =
        result
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    return result;

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
// חיפוש
// ==========================================

let psalmsSearchCache = null;

let psalmsSearchLoading = false;

let psalmsSearchPromise = null;


// ==========================================
// פתיחת מסך חיפוש
// ==========================================

window.showSearch = function () {

    hideAllScreens();

    document
        .getElementById("search-screen")
        .classList.remove("hidden");

    const input =
        document.getElementById(
            "search-input"
        );

    if (input) {

        setTimeout(
            function () {

                input.focus();

            },
            100
        );

    }

};


// ==========================================
// Enter בחיפוש
// ==========================================

window.handleSearchKeydown =
    function (event) {

        if (
            event.key === "Enter"
        ) {

            performSearch();

        }

    };


// ==========================================
// טעינת כל פרקי תהילים לחיפוש
// ==========================================

async function loadPsalmsForSearch() {

    if (psalmsSearchCache) {

        return psalmsSearchCache;

    }

    if (psalmsSearchPromise) {

        return psalmsSearchPromise;

    }

    psalmsSearchLoading = true;

    const status =
        document.getElementById(
            "search-status"
        );

    if (status) {

        status.textContent =
            "טוען את ספר תהילים לחיפוש...";

        status.classList.remove(
            "hidden"
        );

    }

    psalmsSearchPromise =
        (async function () {

            const results = [];

            const batchSize = 10;

            for (
                let start = 1;
                start <= 150;
                start += batchSize
            ) {

                const promises = [];

                for (
                    let chapter = start;
                    chapter < start + batchSize &&
                    chapter <= 150;
                    chapter++
                ) {

                    promises.push(
                        fetchPsalmsChapterForSearch(
                            chapter
                        )
                    );

                }

                const batch =
                    await Promise.all(
                        promises
                    );

                batch.forEach(
                    function (chapterData) {

                        if (chapterData) {

                            results.push(
                                chapterData
                            );

                        }

                    }
                );

                if (status) {

                    const loaded =
                        Math.min(
                            start + batchSize - 1,
                            150
                        );

                    status.textContent =
                        "טוען את ספר תהילים לחיפוש... " +
                        loaded +
                        " מתוך 150";

                }

            }

            psalmsSearchCache =
                results.sort(
                    function (a, b) {

                        return (
                            a.chapter -
                            b.chapter
                        );

                    }
                );

            psalmsSearchLoading = false;

            psalmsSearchPromise = null;

            return psalmsSearchCache;

        })();

    try {

        return await psalmsSearchPromise;

    } catch (error) {

        psalmsSearchLoading = false;

        psalmsSearchPromise = null;

        throw error;

    }

}


// ==========================================
// טעינת פרק לחיפוש
// ==========================================

async function fetchPsalmsChapterForSearch(
    chapterNumber
) {

    try {

        const url =
            "https://www.sefaria.org/api/v3/texts/Psalms%20" +
            chapterNumber +
            "?version=hebrew&return_format=text_only";

        const response =
            await fetch(url);

        if (!response.ok) {

            return null;

        }

        const data =
            await response.json();

        if (
            !data.versions ||
            data.versions.length === 0
        ) {

            return null;

        }

        const verses =
            data.versions[0].text;

        const verseList = [];

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

                const cleaned =
                    cleanPsalmsText(
                        value
                    );

                if (cleaned) {

                    verseList.push(
                        cleaned
                    );

                }

            }

        }

        collectVerses(
            verses
        );

        if (
            verseList.length === 0
        ) {

            return null;

        }

        return {

            chapter:
                chapterNumber,

            verses:
                verseList

        };

    } catch (error) {

        console.error(
            "Search chapter error:",
            chapterNumber,
            error
        );

        return null;

    }

}


// ==========================================
// נרמול חיפוש
// ==========================================

function normalizeSearchText(text) {

    return String(text || "")
        .normalize("NFKC")
        .replace(
            /[\u0591-\u05C7]/g,
            ""
        )
        .replace(
            /["'״׳.,!?;:()[\]{}]/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .toLowerCase();

}


// ==========================================
// ביצוע חיפוש
// ==========================================

window.performSearch =
    async function () {

        const input =
            document.getElementById(
                "search-input"
            );

        const resultsContainer =
            document.getElementById(
                "search-results"
            );

        const status =
            document.getElementById(
                "search-status"
            );

        if (
            !input ||
            !resultsContainer ||
            !status
        ) {

            return;

        }

        const query =
            input.value.trim();

        resultsContainer.innerHTML =
            "";

        if (!query) {

            status.textContent =
                "הקלד מילה או פסוק לחיפוש.";

            status.classList.remove(
                "hidden"
            );

            return;

        }

        status.textContent =
            "מחפש...";

        status.classList.remove(
            "hidden"
        );

        try {

            const chapters =
                await loadPsalmsForSearch();

            const normalizedQuery =
                normalizeSearchText(
                    query
                );

            const results = [];

            chapters.forEach(
                function (chapterData) {

                    chapterData.verses.forEach(
                        function (
                            verse,
                            verseIndex
                        ) {

                            const normalizedVerse =
                                normalizeSearchText(
                                    verse
                                );

                            if (
                                normalizedVerse.includes(
                                    normalizedQuery
                                )
                            ) {

                                results.push({

                                    chapter:
                                        chapterData.chapter,

                                    verse:
                                        verseIndex + 1,

                                    text:
                                        verse

                                });

                            }

                        }
                    );

                }
            );

            displaySearchResults(
                results,
                query
            );

        } catch (error) {

            console.error(
                "Search error:",
                error
            );

            status.textContent =
                "אירעה תקלה בטעינת החיפוש. נסה שוב.";

        }

    };


// ==========================================
// הצגת תוצאות חיפוש
// ==========================================

function displaySearchResults(
    results,
    query
) {

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

    container.innerHTML =
        "";

    if (
        results.length === 0
    ) {

        status.textContent =
            "לא נמצאו תוצאות עבור \"" +
            query +
            "\".";

        status.classList.remove(
            "hidden"
        );

        return;

    }

    const visibleResults =
        results.slice(0, 100);

    status.textContent =
        "נמצאו " +
        results.length +
        " תוצאות.";

    status.classList.remove(
        "hidden"
    );

    visibleResults.forEach(
        function (result) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "search-result";

            button.onclick =
                function () {

                    readingSource =
                        "chapters";

                    openChapter(
                        result.chapter
                    );

                };

            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "search-result-title";

            title.textContent =
                "תהילים " +
                numberToHebrew(
                    result.chapter
                ) +
                " — פסוק " +
                result.verse;

            const text =
                document.createElement(
                    "div"
                );

            text.className =
                "search-result-text";

            text.textContent =
                result.text;

            button.appendChild(
                title
            );

            button.appendChild(
                text
            );

            container.appendChild(
                button
            );

        }
    );

    if (
        results.length > 100
    ) {

        const more =
            document.createElement(
                "div"
            );

        more.className =
            "search-status";

        more.textContent =
            "מוצגות 100 התוצאות הראשונות.";

        container.appendChild(
            more
        );

    }

}


// ==========================================
// הגדרות
// ==========================================

window.showSettings =
    function () {

        hideAllScreens();

        document
            .getElementById(
                "settings-screen"
            )
            .classList.remove(
                "hidden"
            );

        updateSettingsUI();

    };


// ==========================================
// שינוי גודל טקסט
// ==========================================

window.setTextSize =
    function (size) {

        let fontSize = 20;

        if (size === "small") {

            fontSize = 18;

        } else if (
            size === "large"
        ) {

            fontSize = 23;

        }

        document.documentElement.style
            .setProperty(
                "--reading-font-size",
                fontSize + "px"
            );

        const readingText =
            document.getElementById(
                "reading-text"
            );

        const prayerText =
            document.getElementById(
                "prayer-text"
            );

        const parashaText =
            document.getElementById(
                "parasha-text"
            );

        if (readingText) {

            readingText.style.fontSize =
                fontSize + "px";

        }

        if (prayerText) {

            prayerText.style.fontSize =
                fontSize + "px";

        }

        if (parashaText) {

            parashaText.style.fontSize =
                fontSize + "px";

        }

        try {

            localStorage.setItem(
                "tehillimFontSize",
                size
            );

        } catch (error) {

            console.error(error);

        }

        updateSettingsUI();

    };


// ==========================================
// שינוי מצב תצוגה
// ==========================================

window.setTheme =
    function (theme) {

        if (
            theme === "dark"
        ) {

            document.body.classList.add(
                "dark-mode"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

        }

        try {

            localStorage.setItem(
                "tehillimTheme",
                theme
            );

        } catch (error) {

            console.error(error);

        }

        updateSettingsUI();

    };


// ==========================================
// עדכון ממשק הגדרות
// ==========================================

function updateSettingsUI() {

    let savedSize = "medium";

    let savedTheme = "light";

    try {

        savedSize =
            localStorage.getItem(
                "tehillimFontSize"
            ) || "medium";

        savedTheme =
            localStorage.getItem(
                "tehillimTheme"
            ) || "light";

    } catch (error) {

        console.error(error);

    }

    const sizeButtons = {

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

    Object.keys(sizeButtons).forEach(
        function (key) {

            const button =
                sizeButtons[key];

            if (!button) {
                return;
            }

            if (key === savedSize) {

                button.classList.add(
                    "active"
                );

            } else {

                button.classList.remove(
                    "active"
                );

            }

        }
    );

    const lightButton =
        document.getElementById(
            "theme-light"
        );

    const darkButton =
        document.getElementById(
            "theme-dark"
        );

    if (lightButton) {

        lightButton.classList.toggle(
            "active",
            savedTheme === "light"
        );

    }

    if (darkButton) {

        darkButton.classList.toggle(
            "active",
            savedTheme === "dark"
        );

    }

}


// ==========================================
// טעינת הגדרות שמורות
// ==========================================

function loadSavedSettings() {

    let savedSize = "medium";

    let savedTheme = "light";

    try {

        savedSize =
            localStorage.getItem(
                "tehillimFontSize"
            ) || "medium";

        savedTheme =
            localStorage.getItem(
                "tehillimTheme"
            ) || "light";

    } catch (error) {

        console.error(error);

    }

    setTextSize(
        savedSize
    );

    setTheme(
        savedTheme
    );

}


// ==========================================
// הסתרת כל המסכים
// ==========================================

function hideAllScreens() {

    const screenIds = [

        "home-screen",

        "search-screen",

        "settings-screen",

        "chapters-screen",

        "favorites-screen",

        "days-screen",

        "prayers-screen",

        "prayer-reading-screen",

        "reading-screen",

        "finish-screen",

        "parashot-screen",

        "parasha-reading-screen"

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
                cleanPsalmsText(
                    verse
                );

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
            .classList.add("hidden");

        document
            .getElementById(
                "finish-screen"
            )
            .classList.remove("hidden");

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
// פרשות השבוע
// ==========================================
//
// 54 פרשות התורה.
// כל ref הוא ref מלא של Sefaria.
// הטקסט עצמו נטען רק כאשר המשתמש פותח פרשה.
//
// המבנה הוא:
// שם הפרשה בעברית + ref מדויק ב-Sefaria.
//

const parashot = [

    {
        name: "בראשית",
        ref: "Genesis 1:1-6:8"
    },

    {
        name: "נח",
        ref: "Genesis 6:9-11:32"
    },

    {
        name: "לך לך",
        ref: "Genesis 12:1-17:27"
    },

    {
        name: "וירא",
        ref: "Genesis 18:1-22:24"
    },

    {
        name: "חיי שרה",
        ref: "Genesis 23:1-25:18"
    },

    {
        name: "תולדות",
        ref: "Genesis 25:19-28:9"
    },

    {
        name: "ויצא",
        ref: "Genesis 28:10-32:3"
    },

    {
        name: "וישלח",
        ref: "Genesis 32:4-36:43"
    },

    {
        name: "וישב",
        ref: "Genesis 37:1-40:23"
    },

    {
        name: "מקץ",
        ref: "Genesis 41:1-44:17"
    },

    {
        name: "ויגש",
        ref: "Genesis 44:18-47:27"
    },

    {
        name: "ויחי",
        ref: "Genesis 47:28-50:26"
    },

    {
        name: "שמות",
        ref: "Exodus 1:1-6:1"
    },

    {
        name: "וארא",
        ref: "Exodus 6:2-9:35"
    },

    {
        name: "בא",
        ref: "Exodus 10:1-13:16"
    },

    {
        name: "בשלח",
        ref: "Exodus 13:17-17:16"
    },

    {
        name: "יתרו",
        ref: "Exodus 18:1-20:23"
    },

    {
        name: "משפטים",
        ref: "Exodus 21:1-24:18"
    },

    {
        name: "תרומה",
        ref: "Exodus 25:1-27:19"
    },

    {
        name: "תצוה",
        ref: "Exodus 27:20-30:10"
    },

    {
        name: "כי תשא",
        ref: "Exodus 30:11-34:35"
    },

    {
        name: "ויקהל",
        ref: "Exodus 35:1-38:20"
    },

    {
        name: "פקודי",
        ref: "Exodus 38:21-40:38"
    },

    {
        name: "ויקרא",
        ref: "Leviticus 1:1-5:26"
    },

    {
        name: "צו",
        ref: "Leviticus 6:1-8:36"
    },

    {
        name: "שמיני",
        ref: "Leviticus 9:1-11:47"
    },

    {
        name: "תזריע",
        ref: "Leviticus 12:1-13:59"
    },

    {
        name: "מצורע",
        ref: "Leviticus 14:1-15:33"
    },

    {
        name: "אחרי מות",
        ref: "Leviticus 16:1-18:30"
    },

    {
        name: "קדושים",
        ref: "Leviticus 19:1-20:27"
    },

    {
        name: "אמור",
        ref: "Leviticus 21:1-24:23"
    },

    {
        name: "בהר",
        ref: "Leviticus 25:1-26:2"
    },

    {
        name: "בחוקותי",
        ref: "Leviticus 26:3-27:34"
    },

    {
        name: "במדבר",
        ref: "Numbers 1:1-4:20"
    },

    {
        name: "נשא",
        ref: "Numbers 4:21-7:89"
    },

    {
        name: "בהעלותך",
        ref: "Numbers 8:1-12:16"
    },

    {
        name: "שלח לך",
        ref: "Numbers 13:1-15:41"
    },

    {
        name: "קרח",
        ref: "Numbers 16:1-18:32"
    },

    {
        name: "חקת",
        ref: "Numbers 19:1-22:1"
    },

    {
        name: "בלק",
        ref: "Numbers 22:2-25:9"
    },

    {
        name: "פינחס",
        ref: "Numbers 25:10-30:1"
    },

    {
        name: "מטות",
        ref: "Numbers 30:2-32:42"
    },

    {
        name: "מסעי",
        ref: "Numbers 33:1-36:13"
    },

    {
        name: "דברים",
        ref: "Deuteronomy 1:1-3:22"
    },

    {
        name: "ואתחנן",
        ref: "Deuteronomy 3:23-7:11"
    },

    {
        name: "עקב",
        ref: "Deuteronomy 7:12-11:25"
    },

    {
        name: "ראה",
        ref: "Deuteronomy 11:26-16:17"
    },

    {
        name: "שופטים",
        ref: "Deuteronomy 16:18-21:9"
    },

    {
        name: "כי תצא",
        ref: "Deuteronomy 21:10-25:19"
    },

    {
        name: "כי תבוא",
        ref: "Deuteronomy 26:1-29:8"
    },

    {
        name: "נצבים",
        ref: "Deuteronomy 29:9-30:20"
    },

    {
        name: "וילך",
        ref: "Deuteronomy 31:1-31:30"
    },

    {
        name: "האזינו",
        ref: "Deuteronomy 32:1-32:52"
    },

    {
        name: "וזאת הברכה",
        ref: "Deuteronomy 33:1-34:12"
    }

];


// ==========================================
// הצגת מסך פרשות השבוע
// ==========================================

window.showParashot =
    function () {

        hideAllScreens();

        const screen =
            document.getElementById(
                "parashot-screen"
            );

        if (!screen) {
            return;
        }

        screen.classList.remove(
            "hidden"
        );

        createParashaButtons();

    };


// ==========================================
// יצירת כפתורי הפרשות
// ==========================================

function createParashaButtons() {

    const container =
        document.getElementById(
            "parashot-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "";

    parashot.forEach(
        function (parasha) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "parasha-button";

            button.textContent =
                parasha.name;

            button.onclick =
                function () {

                    openParasha(
                        parasha
                    );

                };

            container.appendChild(
                button
            );

        }
    );

}


// ==========================================
// ניקוי טקסט פרשה
// ==========================================

function cleanParashaText(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }

    let result =
        String(text);

    result =
        result
            .replace(
                /&thinsp;/gi,
                " "
            )
            .replace(
                /&nbsp;/gi,
                " "
            )
            .replace(
                /&ensp;/gi,
                " "
            )
            .replace(
                /&emsp;/gi,
                " "
            )
            .replace(
                /&amp;/gi,
                "&"
            )
            .replace(
                /&#160;/gi,
                " "
            )
            .replace(
                /&#8239;/gi,
                " "
            );

    result =
        result.replace(
            /<[^>]*>/g,
            " "
        );

    result =
        result
            .replace(
                /\{פ\}/g,
                ""
            )
            .replace(
                /\{ס\}/g,
                ""
            );

    result =
        result.replace(
            /\s+/g,
            " "
        );

    return result.trim();

}


// ==========================================
// איסוף פסוקים של פרשה
// ==========================================

function collectParashaVerses(
    value,
    result
) {

    if (!result) {
        result = [];
    }

    if (Array.isArray(value)) {

        value.forEach(
            function (item) {

                collectParashaVerses(
                    item,
                    result
                );

            }
        );

    } else if (
        typeof value === "string"
    ) {

        const cleaned =
            cleanParashaText(
                value
            );

        if (cleaned) {

            result.push(
                cleaned
            );

        }

    }

    return result;

}


// ==========================================
// פתיחת פרשה
// ==========================================

window.openParasha =
    async function (parasha) {

        hideAllScreens();

        const screen =
            document.getElementById(
                "parasha-reading-screen"
            );

        if (!screen) {
            return;
        }

        screen.classList.remove(
            "hidden"
        );

        const title =
            document.getElementById(
                "parasha-reading-title"
            );

        const loading =
            document.getElementById(
                "parasha-reading-loading"
            );

        const error =
            document.getElementById(
                "parasha-reading-error"
            );

        const textContainer =
            document.getElementById(
                "parasha-text"
            );

        if (title) {

            title.textContent =
                "פרשת " +
                parasha.name;

        }

        if (textContainer) {

            textContainer.innerHTML =
                "";

        }

        if (error) {

            error.classList.add(
                "hidden"
            );

        }

        if (loading) {

            loading.classList.remove(
                "hidden"
            );

        }

        try {

            const url =
                "https://www.sefaria.org/api/v3/texts/" +
                encodeURIComponent(
                    parasha.ref
                ) +
                "?version=hebrew&return_format=text_only";

            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    "Sefaria Parasha error: " +
                    parasha.ref
                );

            }

            const data =
                await response.json();

            if (
                !data.versions ||
                data.versions.length === 0
            ) {

                throw new Error(
                    "No Hebrew Parasha version: " +
                    parasha.ref
                );

            }

            const text =
                data.versions[0].text;

            const verses =
                collectParashaVerses(
                    text
                );

            if (
                verses.length === 0
            ) {

                throw new Error(
                    "Empty Parasha text: " +
                    parasha.ref
                );

            }

            if (loading) {

                loading.classList.add(
                    "hidden"
                );

            }

            displayParashaText(
                verses
            );

        } catch (errorObject) {

            console.error(
                "Parasha loading error:",
                errorObject
            );

            if (loading) {

                loading.classList.add(
                    "hidden"
                );

            }

            if (textContainer) {

                textContainer.innerHTML =
                    "";

            }

            if (error) {

                error.classList.remove(
                    "hidden"
                );

            }

        }

    };


// ==========================================
// הצגת טקסט פרשה
// ==========================================

function displayParashaText(
    verses
) {

    const container =
        document.getElementById(
            "parasha-text"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "";

    verses.forEach(
        function (verse, index) {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "parasha-verse";

            const number =
                document.createElement(
                    "span"
                );

            number.className =
                "parasha-verse-number";

            number.textContent =
                index + 1;

            const text =
                document.createElement(
                    "span"
                );

            text.className =
                "parasha-verse-text";

            text.textContent =
                verse;

            element.appendChild(
                number
            );

            element.appendChild(
                text
            );

            container.appendChild(
                element
            );

        }
    );

}


// ==========================================
// חזרה מרשימת הפרשה
// ==========================================

window.backFromParashaReading =
    function () {

        showParashot();

    };


// ==========================================
// ניסיון נוסף לפרשה
// ==========================================

let currentParasha = null;

window.retryCurrentParasha =
    function () {

        if (currentParasha) {

            openParasha(
                currentParasha
            );

        }

    };


// שמירת הפרשה הנוכחית לצורך Retry
const originalOpenParasha =
    window.openParasha;

window.openParasha =
    async function (parasha) {

        currentParasha =
            parasha;

        return originalOpenParasha(
            parasha
        );

    };


// ==========================================
// תנ"ך
// ==========================================
//
// כל 39 ספרי התנ"ך (לפי סדר האינדקס של Sefaria),
// מחולקים לתורה / נביאים / כתובים,
// כל ספר עם ה-id שלו ב-Sefaria ומספר הפרקים המדויק.
//
// ה-id הוא בדיוק השם שצריך לשלוח ל-Sefaria API
// (למשל "I Samuel", "Song of Songs" וכו').
//

const tanakhBooks = [

    // ===== תורה =====

    { id: "Genesis", name: "בראשית", category: "torah", chapters: 50 },
    { id: "Exodus", name: "שמות", category: "torah", chapters: 40 },
    { id: "Leviticus", name: "ויקרא", category: "torah", chapters: 27 },
    { id: "Numbers", name: "במדבר", category: "torah", chapters: 36 },
    { id: "Deuteronomy", name: "דברים", category: "torah", chapters: 34 },

    // ===== נביאים =====

    { id: "Joshua", name: "יהושע", category: "prophets", chapters: 24 },
    { id: "Judges", name: "שופטים", category: "prophets", chapters: 21 },
    { id: "I Samuel", name: "שמואל א", category: "prophets", chapters: 31 },
    { id: "II Samuel", name: "שמואל ב", category: "prophets", chapters: 24 },
    { id: "I Kings", name: "מלכים א", category: "prophets", chapters: 22 },
    { id: "II Kings", name: "מלכים ב", category: "prophets", chapters: 25 },
    { id: "Isaiah", name: "ישעיהו", category: "prophets", chapters: 66 },
    { id: "Jeremiah", name: "ירמיהו", category: "prophets", chapters: 52 },
    { id: "Ezekiel", name: "יחזקאל", category: "prophets", chapters: 48 },
    { id: "Hosea", name: "הושע", category: "prophets", chapters: 14 },
    { id: "Joel", name: "יואל", category: "prophets", chapters: 4 },
    { id: "Amos", name: "עמוס", category: "prophets", chapters: 9 },
    { id: "Obadiah", name: "עובדיה", category: "prophets", chapters: 1 },
    { id: "Jonah", name: "יונה", category: "prophets", chapters: 4 },
    { id: "Micah", name: "מיכה", category: "prophets", chapters: 7 },
    { id: "Nahum", name: "נחום", category: "prophets", chapters: 3 },
    { id: "Habakkuk", name: "חבקוק", category: "prophets", chapters: 3 },
    { id: "Zephaniah", name: "צפניה", category: "prophets", chapters: 3 },
    { id: "Haggai", name: "חגי", category: "prophets", chapters: 2 },
    { id: "Zechariah", name: "זכריה", category: "prophets", chapters: 14 },
    { id: "Malachi", name: "מלאכי", category: "prophets", chapters: 3 },

    // ===== כתובים =====

    { id: "Psalms", name: "תהילים", category: "writings", chapters: 150 },
    { id: "Proverbs", name: "משלי", category: "writings", chapters: 31 },
    { id: "Job", name: "איוב", category: "writings", chapters: 42 },
    { id: "Song of Songs", name: "שיר השירים", category: "writings", chapters: 8 },
    { id: "Ruth", name: "רות", category: "writings", chapters: 4 },
    { id: "Lamentations", name: "איכה", category: "writings", chapters: 5 },
    { id: "Ecclesiastes", name: "קהלת", category: "writings", chapters: 12 },
    { id: "Esther", name: "אסתר", category: "writings", chapters: 10 },
    { id: "Daniel", name: "דניאל", category: "writings", chapters: 12 },
    { id: "Ezra", name: "עזרא", category: "writings", chapters: 10 },
    { id: "Nehemiah", name: "נחמיה", category: "writings", chapters: 13 },
    { id: "I Chronicles", name: "דברי הימים א", category: "writings", chapters: 29 },
    { id: "II Chronicles", name: "דברי הימים ב", category: "writings", chapters: 36 }

];


// ==========================================
// שמות הקטגוריות של התנ"ך
// ==========================================

const tanakhCategoryNames = {

    torah: "תורה",

    prophets: "נביאים",

    writings: "כתובים"

};


// ==========================================
// מצב נוכחי - תנ"ך
// ==========================================

let currentTanakhCategory = null;

let currentTanakhBook = null;

let currentTanakhChapter = null;


// ==========================================
// הסתרת מסכי התנ"ך
// ==========================================
//
// פונקציה נפרדת, לא נוגעת ב-hideAllScreens המקורית.
// כל פונקציית ניווט חדשה שמציגה מסך תנ"ך קוראת גם
// ל-hideAllScreens() המקורית וגם לפונקציה הזאת,
// כדי שאף מסך ישן (מקורי או תנ"ך) לא יישאר גלוי בטעות.
//

function hideTanakhScreens() {

    const tanakhScreenIds = [

        "tanakh-categories-screen",

        "tanakh-books-screen",

        "tanakh-chapters-screen",

        "tanakh-reading-screen"

    ];

    tanakhScreenIds.forEach(
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
// פתיחת מסך קטגוריות התנ"ך
// ==========================================

window.showTanakhCategories =
    function () {

        hideAllScreens();

        hideTanakhScreens();

        const screen =
            document.getElementById(
                "tanakh-categories-screen"
            );

        if (screen) {

            screen.classList.remove(
                "hidden"
            );

        }

    };


// ==========================================
// חזרה ממסך קטגוריות התנ"ך לבית
// ==========================================
//
// פונקציה זו מסתירה קודם את מסכי התנ"ך, ורק אז
// קוראת ל-showHome() המקורית - כדי לא להזדקק
// לגעת ב-showHome או ב-hideAllScreens המקוריות.
//

window.backFromTanakhCategories =
    function () {

        hideTanakhScreens();

        showHome();

    };


// ==========================================
// פתיחת מסך רשימת ספרים לפי קטגוריה
// ==========================================

window.showTanakhBooks =
    function (categoryId) {

        currentTanakhCategory =
            categoryId;

        hideAllScreens();

        hideTanakhScreens();

        const screen =
            document.getElementById(
                "tanakh-books-screen"
            );

        if (screen) {

            screen.classList.remove(
                "hidden"
            );

        }

        const title =
            document.getElementById(
                "tanakh-books-title"
            );

        if (title) {

            title.textContent =
                tanakhCategoryNames[
                    categoryId
                ] || "ספרים";

        }

        createTanakhBookButtons(
            categoryId
        );

    };


// ==========================================
// יצירת כפתורי הספרים
// ==========================================

function createTanakhBookButtons(categoryId) {

    const container =
        document.getElementById(
            "tanakh-books-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "";

    const books =
        tanakhBooks.filter(
            function (book) {

                return (
                    book.category ===
                    categoryId
                );

            }
        );

    books.forEach(
        function (book) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "prayer-button";

            button.textContent =
                book.name;

            button.onclick =
                function () {

                    openTanakhBook(
                        book
                    );

                };

            container.appendChild(
                button
            );

        }
    );

}


// ==========================================
// חזרה מרשימת הפרקים לרשימת הספרים
// ==========================================

window.backFromTanakhChapters =
    function () {

        showTanakhBooks(
            currentTanakhCategory
        );

    };


// ==========================================
// פתיחת ספר - הצגת רשימת הפרקים שלו
// ==========================================

window.openTanakhBook =
    function (book) {

        currentTanakhBook =
            book;

        hideAllScreens();

        hideTanakhScreens();

        const screen =
            document.getElementById(
                "tanakh-chapters-screen"
            );

        if (screen) {

            screen.classList.remove(
                "hidden"
            );

        }

        const title =
            document.getElementById(
                "tanakh-chapters-title"
            );

        if (title) {

            title.textContent =
                book.name;

        }

        createTanakhChapterButtons(
            book
        );

    };


// ==========================================
// יצירת כפתורי הפרקים של הספר
// ==========================================

function createTanakhChapterButtons(book) {

    const container =
        document.getElementById(
            "tanakh-chapters"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "";

    for (
        let i = 1;
        i <= book.chapters;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "chapter-button";

        button.textContent =
            numberToHebrew(i);

        button.onclick =
            function () {

                openTanakhChapter(
                    i
                );

            };

        container.appendChild(
            button
        );

    }

}


// ==========================================
// חזרה מהקריאה לרשימת הפרקים של הספר
// ==========================================

window.backFromTanakhReading =
    function () {

        if (currentTanakhBook) {

            openTanakhBook(
                currentTanakhBook
            );

        } else {

            showTanakhCategories();

        }

    };


// ==========================================
// החלת גודל טקסט שמור על מסך קריאת התנ"ך
// ==========================================
//
// קוראת בלבד את ההגדרה השמורה (לא נוגעת בפונקציית
// setTextSize המקורית), כדי שגם טקסט התנ"ך יכבד
// את גודל הטקסט שהמשתמש בחר בהגדרות.
//

function applySavedFontSizeToTanakh() {

    const container =
        document.getElementById(
            "tanakh-reading-text"
        );

    if (!container) {
        return;
    }

    let savedSize = "medium";

    try {

        savedSize =
            localStorage.getItem(
                "tehillimFontSize"
            ) || "medium";

    } catch (error) {

        console.error(error);

    }

    let fontSize = 20;

    if (savedSize === "small") {

        fontSize = 18;

    } else if (savedSize === "large") {

        fontSize = 23;

    }

    container.style.fontSize =
        fontSize + "px";

}


// ==========================================
// פתיחת פרק תנ"ך
// ==========================================

window.openTanakhChapter =
    async function (chapterNumber) {

        if (!currentTanakhBook) {
            return;
        }

        currentTanakhChapter =
            chapterNumber;

        hideAllScreens();

        hideTanakhScreens();

        const screen =
            document.getElementById(
                "tanakh-reading-screen"
            );

        if (screen) {

            screen.classList.remove(
                "hidden"
            );

        }

        const title =
            document.getElementById(
                "tanakh-reading-title"
            );

        const textContainer =
            document.getElementById(
                "tanakh-reading-text"
            );

        const loading =
            document.getElementById(
                "tanakh-reading-loading"
            );

        const error =
            document.getElementById(
                "tanakh-reading-error"
            );

        const previousButton =
            document.getElementById(
                "tanakh-previous-button"
            );

        const nextButton =
            document.getElementById(
                "tanakh-next-button"
            );

        title.textContent =
            currentTanakhBook.name +
            " " +
            numberToHebrew(
                chapterNumber
            );

        textContainer.innerHTML =
            "";

        error.classList.add(
            "hidden"
        );

        loading.classList.remove(
            "hidden"
        );

        previousButton.classList.toggle(
            "hidden",
            chapterNumber <= 1
        );

        nextButton.classList.toggle(
            "hidden",
            chapterNumber >=
                currentTanakhBook.chapters
        );

        try {

            const ref =
                currentTanakhBook.id +
                " " +
                chapterNumber;

            const url =
                "https://www.sefaria.org/api/v3/texts/" +
                encodeURIComponent(
                    ref
                ) +
                "?version=hebrew&return_format=text_only";

            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    "Sefaria Tanakh error: " +
                    ref
                );

            }

            const data =
                await response.json();

            if (
                !data.versions ||
                data.versions.length === 0
            ) {

                throw new Error(
                    "No Hebrew Tanakh version: " +
                    ref
                );

            }

            const verses =
                data.versions[0].text;

            if (
                !verses ||
                verses.length === 0
            ) {

                throw new Error(
                    "Empty Tanakh text: " +
                    ref
                );

            }

            loading.classList.add(
                "hidden"
            );

            displayTanakhVerses(
                verses
            );

            applySavedFontSizeToTanakh();

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
// הצגת פסוקי התנ"ך
// ==========================================

function displayTanakhVerses(verses) {

    const container =
        document.getElementById(
            "tanakh-reading-text"
        );

    if (!container) {
        return;
    }

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
                cleanPsalmsText(
                    verse
                );

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

}


// ==========================================
// ניסיון נוסף לפרק תנ"ך
// ==========================================

window.retryCurrentTanakhChapter =
    function () {

        if (
            currentTanakhChapter !== null
        ) {

            openTanakhChapter(
                currentTanakhChapter
            );

        }

    };


// ==========================================
// פרק קודם בתנ"ך
// ==========================================

window.previousTanakhChapter =
    function () {

        if (
            currentTanakhChapter > 1
        ) {

            openTanakhChapter(
                currentTanakhChapter - 1
            );

        }

    };


// ==========================================
// פרק הבא בתנ"ך
// ==========================================

window.nextTanakhChapter =
    function () {

        if (
            currentTanakhBook &&
            currentTanakhChapter <
                currentTanakhBook.chapters
        ) {

            openTanakhChapter(
                currentTanakhChapter + 1
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

        createParashaButtons();

        loadSavedSettings();

    }
);
