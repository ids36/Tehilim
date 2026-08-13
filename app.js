// ==========================================
// אפליקציית תהילים
// ==========================================


// ------------------------------------------
// משתנה: איזה פרק פתוח כרגע
// ------------------------------------------

let currentChapter = null;


// ------------------------------------------
// המרה ממספר לאותיות עבריות
// ------------------------------------------

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

    // ט"ו וט"ז
    if (result === "יה") {
        result = "טו";
    }

    if (result === "יו") {
        result = "טז";
    }

    // אות אחת = גרש
    if (result.length === 1) {
        return result + "׳";
    }

    // כמה אותיות = גרשיים
    return result.slice(0, -1) + "״" + result.slice(-1);
}


// ------------------------------------------
// יצירת 150 הכפתורים
// ------------------------------------------

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
            openChapter(i);
        };

        container.appendChild(button);
    }
}


// ------------------------------------------
// מעבר למסך הבית
// ------------------------------------------

window.showHome = function () {

    document
        .getElementById("home-screen")
        .classList.remove("hidden");

    document
        .getElementById("chapters-screen")
        .classList.add("hidden");

    document
        .getElementById("reading-screen")
        .classList.add("hidden");
};


// ------------------------------------------
// מעבר למסך הפרקים
// ------------------------------------------

window.showChapters = function () {

    document
        .getElementById("home-screen")
        .classList.add("hidden");

    document
        .getElementById("reading-screen")
        .classList.add("hidden");

    document
        .getElementById("chapters-screen")
        .classList.remove("hidden");
};


// ------------------------------------------
// מעבר למסך הקריאה
// ------------------------------------------

function showReadingScreen() {

    document
        .getElementById("home-screen")
        .classList.add("hidden");

    document
        .getElementById("chapters-screen")
        .classList.add("hidden");

    document
        .getElementById("reading-screen")
        .classList.remove("hidden");
}


// ------------------------------------------
// פתיחת פרק
// ------------------------------------------

window.openChapter = async function (chapterNumber) {

    currentChapter = chapterNumber;

    showReadingScreen();

    const title =
        document.getElementById("reading-title");

    const textContainer =
        document.getElementById("reading-text");

    const loading =
        document.getElementById("reading-loading");

    const error =
        document.getElementById("reading-error");


    title.textContent =
        "תהילים " + numberToHebrew(chapterNumber);


    textContainer.innerHTML = "";

    error.classList.add("hidden");

    loading.classList.remove("hidden");


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


// ------------------------------------------
// הצגת הפסוקים
// ------------------------------------------

function displayVerses(verses) {

    const container =
        document.getElementById("reading-text");


    container.innerHTML = "";


    verses.forEach(function (verse, index) {

        const verseElement =
            document.createElement("div");


        verseElement.className = "verse";

        verse = verse.replace(/\s*\{פ\}\s*$/g, "");

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


// ------------------------------------------
// ניסיון נוסף
// ------------------------------------------

window.retryCurrentChapter = function () {

    if (currentChapter !== null) {

        openChapter(currentChapter);

    }
};


// ------------------------------------------
// פרק קודם
// ------------------------------------------

window.previousChapter = function () {

    if (currentChapter > 1) {

        openChapter(currentChapter - 1);

    }
};


// ------------------------------------------
// פרק הבא
// ------------------------------------------

window.nextChapter = function () {

    if (currentChapter < 150) {

        openChapter(currentChapter + 1);

    }
};


// ------------------------------------------
// כשהעמוד נטען
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createChapterButtons();

    }
);
