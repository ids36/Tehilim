// ==========================================
// אפליקציית תהילים
// ==========================================

let currentChapter = null;
let readingSource = "chapters";

let currentDayNumber = null;
let currentDayStart = null;
let currentDayEnd = null;


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

    return result.slice(0, -1) + "״" + result.slice(-1);
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

    const container = document.getElementById("chapters");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 1; i <= 150; i++) {

        const button = document.createElement("button");

        button.className = "chapter-button";

        button.textContent = numberToHebrew(i);

        button.onclick = function () {

            readingSource = "chapters";

            openChapter(i);

        };

        container.appendChild(button);
    }
}


// ==========================================
// יצירת פרקי היום
// ==========================================

function createDayChapterButtons(dayNumber) {

    const container =
        document.getElementById("day-chapters");

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

            readingSource = "day";

            currentDayNumber = dayNumber;

            currentDayStart =
                dayData.chapters[0];

            currentDayEnd =
                dayData.chapters[1];

            openChapter(i);

        };

        container.appendChild(button);
    }
}


// ==========================================
// יצירת כפתורי ימים נוספים
// ==========================================

function createOtherDaysButtons(currentDay) {

    const container =
        document.getElementById("other-days");

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

        container.appendChild(button);
    }
}


// ==========================================
// הצגת יום מסוים
// ==========================================

function showSpecificDay(dayNumber) {

    const dayData =
        weeklyChapters[dayNumber];

    document
        .getElementById("home-screen")
        .classList.add("hidden");

    document
        .getElementById("chapters-screen")
        .classList.add("hidden");

    document
        .getElementById("reading-screen")
        .classList.add("hidden");

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

    createDayChapterButtons(dayNumber);

    createOtherDaysButtons(dayNumber);
}


// ==========================================
// פתיחת "לפי יום"
// ==========================================

window.showDays = function () {

    const today =
        new Date().getDay();

    showSpecificDay(today);
};


// ==========================================
// חזרה למסך הבית
// ==========================================

window.showHome = function () {

    document
        .getElementById("home-screen")
        .classList.remove("hidden");

    document
        .getElementById("chapters-screen")
        .classList.add("hidden");

    document
        .getElementById("days-screen")
        .classList.add("hidden");

    document
        .getElementById("reading-screen")
        .classList.add("hidden");

    document
        .getElementById("finish-screen")
        .classList.add("hidden");
};


// ==========================================
// פתיחת מסך הפרקים
// ==========================================

window.showChapters = function () {

    document
        .getElementById("home-screen")
        .classList.add("hidden");

    document
        .getElementById("days-screen")
        .classList.add("hidden");

    document
        .getElementById("reading-screen")
        .classList.add("hidden");

    document
        .getElementById("finish-screen")
        .classList.add("hidden");

    document
        .getElementById("chapters-screen")
        .classList.remove("hidden");
};


// ==========================================
// חזרה למסך שממנו הגענו
// ==========================================

function backFromReading() {

    if (readingSource === "day") {

        showDays();

    } else {

        showChapters();

    }
}


// ==========================================
// פתיחת מסך הקריאה
// ==========================================

function showReadingScreen() {

    document
        .getElementById("home-screen")
        .classList.add("hidden");

    document
        .getElementById("chapters-screen")
        .classList.add("hidden");

    document
        .getElementById("days-screen")
        .classList.add("hidden");

    document
        .getElementById("finish-screen")
        .classList.add("hidden");

    document
        .getElementById("reading-screen")
        .classList.remove("hidden");
}


// ==========================================
// פתיחת פרק
// ==========================================

window.openChapter = async function (chapterNumber) {

    currentChapter = chapterNumber;

    showReadingScreen();

    const title =
        document.getElementById("reading-title");

    const dayTitle =
        document.getElementById("reading-day-title");

    const textContainer =
        document.getElementById("reading-text");

    const loading =
        document.getElementById("reading-loading");

    const error =
        document.getElementById("reading-error");

    const finishButton =
        document.getElementById("finish-button");

    const nextButton =
        document.getElementById("next-button");


    title.textContent =
        "תהילים " +
        numberToHebrew(chapterNumber);


    if (readingSource === "day") {

        const dayName =
            dayNames[currentDayNumber];

        dayTitle.textContent =
            "תהילים ל" +
            dayName;

    } else {

        dayTitle.textContent = "";

    }


    textContainer.innerHTML = "";

    error.classList.add("hidden");

    loading.classList.remove("hidden");

    finishButton.classList.add("hidden");

    nextButton.classList.remove("hidden");


    // אם זה הפרק האחרון של היום
    if (
        readingSource === "day" &&
        chapterNumber === currentDayEnd
    ) {

        finishButton.classList.remove("hidden");

        nextButton.classList.add("hidden");

    }


    try {

        const url =
            "https://www.sefaria.org/api/v3/texts/Psalms%20" +
            chapterNumber +
            "?version=hebrew&return_format=text_only";


        const response =
            await fetch(url);


        if (!response.ok) {
            throw new Error("Sefaria error");
        }


        const data =
            await response.json();


        if (
            !data.versions ||
            data.versions.length === 0
        ) {
            throw new Error("No text");
        }


        const verses =
            data.versions[0].text;


        if (
            !verses ||
            verses.length === 0
        ) {
            throw new Error("Empty text");
        }


        loading.classList.add("hidden");

        displayVerses(verses);


    } catch (err) {

        console.error(err);

        loading.classList.add("hidden");

        textContainer.innerHTML = "";

        error.classList.remove("hidden");

    }

};


// ==========================================
// הצגת הפסוקים
// ==========================================

function displayVerses(verses) {

    const container =
        document.getElementById("reading-text");

    container.innerHTML = "";


    verses.forEach(function (verse, index) {

        const verseElement =
            document.createElement("div");

        verseElement.className =
            "verse";

        verseElement.innerHTML =
            '<span class="verse-number">' +
            (index + 1) +
            '</span>' +
            '<span>' +
            verse +
            '</span>';

        container.appendChild(verseElement);

    });
}


// ==========================================
// ניסיון נוסף
// ==========================================

window.retryCurrentChapter = function () {

    if (currentChapter !== null) {

        openChapter(currentChapter);

    }
};


// ==========================================
// פרק קודם
// ==========================================

window.previousChapter = function () {

    if (currentChapter > 1) {

        openChapter(currentChapter - 1);

    }

};


// ==========================================
// פרק הבא
// ==========================================

window.nextChapter = function () {

    if (currentChapter < 150) {

        openChapter(currentChapter + 1);

    }

};


// ==========================================
// סיום פרקי היום
// ==========================================

window.finishDay = function () {

    document
        .getElementById("reading-screen")
        .classList.add("hidden");

    document
        .getElementById("finish-screen")
        .classList.remove("hidden");

};


// ==========================================
// המשך לפרק שאחרי פרקי היום
// ==========================================

window.continueAfterDay = function () {

    const nextChapterNumber =
        currentDayEnd + 1;


    readingSource = "chapters";


    if (nextChapterNumber <= 150) {

        openChapter(nextChapterNumber);

    }

};


// ==========================================
// הפעלה
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createChapterButtons();

    }
);
