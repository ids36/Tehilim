// ==========================================
// אפליקציית תהילים
// יצירת 150 פרקי תהילים
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

    // טיפול מיוחד ב-15 וב-16
    if (result === "יה") {
        result = "טו";
    }

    if (result === "יו") {
        result = "טז";
    }

    // הוספת גרש / גרשיים
    if (result.length === 1) {
        return result + "׳";
    }

    return result.slice(0, -1) + "״" + result.slice(-1);
}


// ------------------------------------------
// יצירת כפתורי 150 הפרקים
// ------------------------------------------

function createChapterButtons() {

    const container = document.getElementById("chapters");

    if (!container) {
        return;
    }

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
// פתיחת פרק
// ------------------------------------------

function openChapter(chapterNumber) {

    alert(
        "בחרת את פרק " +
        numberToHebrew(chapterNumber) +
        "\n\nבשלב הבא נציג כאן את הטקסט של הפרק."
    );

}


// ------------------------------------------
// הפעלה
// ------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    createChapterButtons();

});
