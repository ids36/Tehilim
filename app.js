// ==========================================
// אפליקציית תהילים + תפילות
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
//
// ההפניות כאן מבוססות על מבנה
// Siddur Edot HaMizrach של Sefaria.
// ==========================================

const prayers = [

    {
        id: "morning-blessings",
        name: "ברכות השחר",
        ref:
            "Siddur Edot HaMizrach, Preparatory Prayers, Morning Blessings"
    },

    {
        id: "shacharit",
        name: "שחרית",
        ref:
            "Siddur Edot HaMizrach, Weekday Shacharit, Morning Prayer"
    },

    {
        id: "mincha",
        name: "מנחה",
        ref:
            "Siddur Edot HaMizrach, Weekday Mincha, Amida"
    },

    {
        id: "arvit",
        name: "ערבית",
        ref:
            "Siddur Edot HaMizrach, Weekday Arvit, Amidah"
    },

    {
        id: "blessings-enjoyments",
        name: "ברכות הנהנין",
        ref:
            "Siddur Edot HaMizrach, Post Meal Blessing, Blessings on Enjoyments"
    },

    {
        id: "birkat-hamazon",
        name: "ברכת המזון",
        ref:
            "Siddur Edot HaMizrach, Post Meal Blessing"
    },

    {
        id: "al-hamichya",
        name: "מעין שלוש",
        ref:
            "Siddur Edot HaMizrach, Post Meal Blessing, Al Hamihya"
    },

    {
        id: "borei-nefashot",
        name: "בורא נפשות",
        ref:
            "Siddur Edot HaMizrach, Post Meal Blessing, Blessings on Enjoyments"
    },

    {
        id: "bedtime-shema",
        name: "קריאת שמע שעל המיטה",
        ref:
            "Siddur Edot HaMizrach, Bedtime Shema"
    },

    {
        id: "havdalah",
        name: "הבדלה",
        ref:
            "Siddur Edot HaMizrach, Havdalah, Havdala"
    },

    {
        id: "selichot",
        name: "סליחות",
        ref:
            "Siddur Edot HaMizrach, Fast Days and Mourning, Slichot"
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
// בניית URL ל-Sefaria
// ==========================================

function buildSefariaUrl(ref) {

    const encodedRef =
        encodeURIComponent(ref);

    return (
        "https://www.sefaria.org/api/v3/texts/" +
        encodedRef +
        "?version=hebrew&return_format=text_only"
    );

}


// ==========================================
// שליפת טקסט מ-Sefaria
// ==========================================

async function fetchSefariaText(ref) {

    const response =
        await fetch(
            buildSefariaUrl(ref)
        );

    if (!response.ok) {

        throw new Error(
            "Sefaria error"
        );

    }

    const data =
        await response.json();

    if (
        !data.versions ||
        data.versions.length === 0
    ) {

        throw new Error(
            "No versions"
        );

    }

    const text =
        data.versions[0].text;

    if (
        text === null ||
        text === undefined ||
        text === ""
    ) {

        throw new Error(
            "Empty text"
        );

    }

    return text;

}


// ==========================================
// פתיחת תפילה
// ==========================================

window.openPrayer = async function (prayer) {

    currentPrayer =
        prayer;

    hideAllScreens();

    document
        .getElementById(
            "prayer-reading-screen"
        )
        .classList.remove("hidden");

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

        const text =
            await fetchSefariaText(
                prayer.ref
            );

        loading.classList.add(
            "hidden"
        );

        displayPrayerText(
            text
        );

    } catch (errorObject) {

        console.error(
            "Prayer error:",
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

    container.innerHTML =
        "";

    let paragraphs = [];


    function cleanText(value) {

        return value
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


    function collectParts(value) {

        if (Array.isArray(value)) {

            value.forEach(
                function (part) {

                    collectParts(part);

                }
            );

        } else if (
            typeof value === "string"
        ) {

            const cleaned =
                cleanText(value);

            if (cleaned) {

                paragraphs.push(
                    cleaned
                );

            }

        }

    }


    collectParts(text);


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

window.showHome = function () {

    hideAllScreens();

    document
        .getElementById("home-screen")
        .classList.remove("hidden");

};


// ==========================================
// פתיחת מסך הפרקים
// ==========================================

window.showChapters = function () {

    hideAllScreens();

    document
        .getElementById("chapters-screen")
        .classList.remove("hidden");

};


// ==========================================
// הסתרת כל המסכים
// ==========================================

function hideAllScreens() {

    const screenIds = [

        "home-screen",
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

    if (readingSource === "day") {

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
        .getElementById("reading-screen")
        .classList.remove("hidden");

}


// ==========================================
// פתיחת פרק
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


        // ==========================================
        // הפרק הראשון של היום
        // ==========================================

        if (
            readingSource === "day" &&
            chapterNumber === currentDayStart
        ) {

            previousButton.classList.add(
                "hidden"
            );

        }


        // ==========================================
        // הפרק האחרון של היום
        // ==========================================

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
                    "Sefaria error"
                );

            }


            const data =
                await response.json();


            if (
                !data.versions ||
                data.versions.length === 0
            ) {

                throw new Error(
                    "No text"
                );

            }


            const verses =
                data.versions[0].text;


            if (
                !verses ||
                verses.length === 0
            ) {

                throw new Error(
                    "Empty text"
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
// הצגת הפסוקים + הסרת {פ}
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

                    collectVerses(item);

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


            verseElement.innerHTML =
                '<span class="verse-number">' +
                (index + 1) +
                '</span>' +
                '<span>' +
                verse +
                '</span>';


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

    }
);
