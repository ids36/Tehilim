// ==========================================
// אפליקציית תהילים
// ==========================================


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

    // 15 ו-16 נכתבים ט"ו וט"ז
    if (result === "יה") {
        result = "טו";
    }

    if (result === "יו") {
        result = "טז";
    }

    // גרש לאות אחת, גרשיים ליותר מאות אחת
    if (result.length === 1) {
        return result + "׳";
    }

    return result.slice(0, -1) + "״" + result.slice(-1);
}


// ------------------------------------------
// יצירת 150 כפתורי הפרקים
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

        button.addEventListener("click", function () {

            openChapter(i);

        });

        container.appendChild(button);
    }
}


// ------------------------------------------
// פתיחת פרק והבאת הטקסט מ-Sefaria
// ------------------------------------------

async function openChapter(chapterNumber) {

    showReadingScreen();

    const title = document.getElementById("reading-title");
    const textContainer = document.getElementById("reading-text");
    const errorContainer = document.getElementById("reading-error");
    const loadingContainer = document.getElementById("reading-loading");

    title.textContent = "תהילים " + numberToHebrew(chapterNumber);

    textContainer.innerHTML = "";
    errorContainer.classList.add("hidden");
    loadingContainer.classList.remove("hidden");

    try {

        const url =
            "https://www.sefaria.org/api/v3/texts/Psalms%20" +
            chapterNumber +
            "?version=hebrew&return_format=text_only";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Sefaria request failed");
        }

        const data = await response.json();

        if (!data.versions || data.versions.length === 0) {
            throw new Error("No Hebrew version found");
        }

        const verses = data.versions[0].text;

        if (!verses || verses.length === 0) {
            throw new Error("No text found");
        }

        loadingContainer.classList.add("hidden");

        displayVerses(verses);

    } catch (error) {

        console.error(error);

        loadingContainer.classList.add("hidden");

        textContainer.innerHTML = "";

        errorContainer.classList.remove("hidden");

    }
}


// ------------------------------------------
// הצגת הפסוקים
// ------------------------------------------

function displayVerses(verses) {

    const container = document.getElementById("reading-text");

    container.innerHTML = "";

    verses.forEach(function (verse, index) {

        const verseElement = document.createElement("div");

        verseElement.className = "verse";

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

function retryCurrentChapter() {

    if (currentChapter !== null) {

        openChapter(currentChapter);

    }
}


// ------------------------------------------
// משתנה ששומר את הפרק הנוכחי
// ------------------------------------------

let currentChapter = null;


// ------------------------------------------
// עטיפה כדי לזכור איזה פרק פתוח
// ------------------------------------------

const originalOpenChapter = openChapter;

openChapter = async function(chapterNumber) {

    currentChapter = chapterNumber;

    await originalOpenChapter(chapterNumber);

};


// ------------------------------------------
// מעבר למסך הפרקים
// ------------------------------------------

function showChapters() {

    document.getElementById("home-screen").classList.add("hidden");

    document.getElementById("reading-screen").classList.add("hidden");

    document.getElementById("chapters-screen").classList.remove("hidden");

}


// ------------------------------------------
// חזרה למסך הבית
// ------------------------------------------

function showHome() {

    document.getElementById("chapters-screen").classList.add("hidden");

    document.getElementById("reading-screen").classList.add("hidden");

    document.getElementById("home-screen").classList.remove("hidden");

}


// ------------------------------------------
// מעבר למסך הקריאה
// ------------------------------------------

function showReadingScreen() {

    document.getElementById("home-screen").classList.add("hidden");

    document.getElementById("chapters-screen").classList.add("hidden");

    document.getElementById("reading-screen").classList.remove("hidden");

}


// ------------------------------------------
// פרק קודם
// ------------------------------------------

function previousChapter() {

    if (currentChapter > 1) {

        openChapter(currentChapter - 1);

    }

}


// ------------------------------------------
// פרק הבא
// ------------------------------------------

function nextChapter() {

    if (currentChapter < 150) {

        openChapter(currentChapter + 1);

    }

}


// ------------------------------------------
// הפעלת האפליקציה
// ------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    createChapterButtons();

});
