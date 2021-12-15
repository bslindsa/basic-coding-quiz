var content = document.querySelector(".content");
var highscoreView = document.querySelector(".highscore-view");
var timer = document.querySelector(".timer");
var quizBox = document.querySelector(".quiz-box");
var question = document.querySelector(".question");
var sub = document.querySelector("#subquestion");
var choiceList = document.querySelector("#choices");
// var highScoreList = document.querySelector("#high-scores");
var start = document.querySelector(".start");
var p = document.querySelector("p");
var result = document.querySelector("#result");
var scoreTableEl = document.querySelector(".table-div");
var highScoreTable = document.querySelector(".high-score-table");


// Define questions, choices, and answers in an array to reference.
var qBlock = [{
    problem: "The condition in an if/else statement is enclosed within ____.",
    choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
    answer: "parentheses"
}, {
    problem: "Arrays in Javascript can be used to store _____.",
    choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
    answer: "all of the above"
}, {
    problem: "String values must be enclosed within _____ when being assigned to variables.",
    choices: ["commas", "curly brackets", "quotes", "parentheses"],
    answer: "quotes"
}
]


// Set variables
var timerInterval;
var secondsLeft = 60;
var qNumber = 0;
var pointScore = 0;
var penalty = 10;
var highScores = JSON.parse(localStorage.getItem("scores")) || [];

console.log("Previous Score list", highScores);

// Render current question to the screen.
function renderQuestion(qNumber) {

    var qPrompt = qBlock[qNumber].problem;
    question.textContent = qPrompt;

    // Create button for every answer choice.
    for (i = 0; i < qBlock[qNumber].choices.length; i++) {
        var li = document.createElement("li");
        var choice = document.createElement("button");
        choice.textContent = qBlock[qNumber].choices[i];
        li.appendChild(choice);
        choiceList.appendChild(li);
        li.setAttribute("style", "position: relative");
        choice.setAttribute("style", "color: white; background-color: blue; margin: 5px");
        choice.addEventListener("click", checkAnswer);
    }
}


// Confirm clicked answer is correct or incorrect.
function checkAnswer(event) {
    var element = event.target;

    if (element.matches("button")) {
        if (element.textContent == qBlock[qNumber].answer) {
            pointScore += 10;
            result.textContent = "Correct!";
        }
        else {
            secondsLeft = secondsLeft - penalty;
            result.textContent = "Wrong!";
        }
    }

    // Clear question list and increment question index to prepare to render next question and choices.
    choiceList.innerHTML = "";
    qNumber++;

    // Move on to next question, or end quiz if all questions have been attempted.
    if (qNumber >= qBlock.length) {
        allDone();
    }
    else {
        renderQuestion(qNumber);
    }
}


// Click start button to begin quiz and start countdown timer.
start.addEventListener("click", countdown);

function countdown() {
    start.remove();
    secondsLeft = 30;
    timerInterval = setInterval(function () {
        secondsLeft--;
        timer.textContent = "Time: " + secondsLeft;

        if (secondsLeft === 0) {
            clearInterval(timerInterval);
            allDone();
        }
    }, 1000);

    renderQuestion(qNumber);
}

// Ends the quiz and allows user to enter initials and save score.
function allDone() {
    choiceList.innerHTML = "";
    sub.innerHTML = "";
    question.textContent = "All Done!";

    var timeScore = secondsLeft;

    if (pointScore == 0) {
        totScore = 0;
    }
    else {
        var totScore = pointScore + timeScore;
    }

    clearInterval(timerInterval);

    var finalScore = document.createElement("p");

    finalScore.textContent = "Your final score is " + totScore;
    question.appendChild(finalScore);
    finalScore.setAttribute("style", "font-size: 1.5vw");

    var enterInitials = document.createElement("label");
    enterInitials.textContent = "Enter Your Initials: ";
    choiceList.appendChild(enterInitials);

    var initialsInput = document.createElement("input");
    initialsInput.setAttribute("type", "text");
    choiceList.appendChild(initialsInput);

    var submitScore = document.createElement("button");
    submitScore.textContent = "Submit Score";
    submitScore.setAttribute("style", "color: white; background-color: blue; margin: 5px");
    choiceList.appendChild(submitScore);

    submitScore.addEventListener("click", function () {
        var initials = initialsInput.value.toUpperCase();
        var playerScoreCard = {
            initials: initials,
            score: totScore
        }
        highScores.push(playerScoreCard);
        localStorage.setItem("scores", JSON.stringify(highScores));

        renderHS();
    });

}

// Go directly to the High Score board
highscoreView.addEventListener("click", renderHS);


// Render the High Score board.
function renderHS() {
    quizBox.innerHTML = "";
    start.remove();

    //sorting scores in descending order.
    highScores.sort(function (a, b) { return b.score - a.score });

    // Create Table
    var headerHS = document.createElement("h1");
    headerHS.textContent = "HIGHSCORES";
    quizBox.appendChild(headerHS);
    var highScoreTable = document.createElement("table");
    var tableHeadEl = document.createElement("thead");
    var tRowEl = document.createElement("tr");
    var rankNumber = document.createElement("th");
    rankNumber.textContent = "Rank #";
    rankNumber.setAttribute("scope", "col")
    var rankInitials = document.createElement("th");
    rankInitials.textContent = "Initials";
    rankInitials.setAttribute("scope", "col")
    var rankScore = document.createElement("th");
    rankScore.textContent = "Score"
    rankScore.setAttribute("scope", "col")
    var tBodyEl = document.createElement("tbody");

    // Assemble the header of the table
    tRowEl.appendChild(rankNumber);
    tRowEl.appendChild(rankInitials);
    tRowEl.appendChild(rankScore);
    tableHeadEl.appendChild(tRowEl);
    highScoreTable.appendChild(tableHeadEl);

    // Generate each row of the table
    for (i = 0; i < highScores.length; i++) {

        var statsRow = document.createElement("tr");
        var rank = document.createElement("th");
        rank.textContent = i + 1;
        rank.setAttribute("scope", "row");
        var name = document.createElement("td");
        name.textContent = highScores[i].initials;
        var pointScore = document.createElement("td");
        pointScore.textContent = highScores[i].score;
        statsRow.appendChild(rank);
        statsRow.appendChild(name);
        statsRow.appendChild(pointScore);
        tBodyEl.appendChild(statsRow);

    }

    highScoreTable.appendChild(tBodyEl);
    highScoreTable.setAttribute("class", "high-score-table table table-dark table-striped");
    quizBox.appendChild(highScoreTable);


    // Resets the page to go to the start of the quiz
    var restart = document.createElement("button");
    restart.textContent = "Go Back";
    quizBox.appendChild(restart);
    restart.addEventListener("click", function () {
        window.location.reload();
    })
    restart.setAttribute("style", "color: white; background-color: blue; margin: 5px");

    // Clear the High Score board.
    var clearHS = document.createElement("button");
    clearHS.textContent = "Clear High Scores";
    clearHS.setAttribute("style", "color: white; background-color: blue; margin: 5px");
    quizBox.appendChild(clearHS);
    clearHS.addEventListener("click", function () {
        highScores = [];
        localStorage.setItem("scores", JSON.stringify(highScores));
        tBodyEl.innerHTML = "";
    })
}


// Organize page appearance.
p.setAttribute("style", "font-size: 1.5vw");
sub.setAttribute("style", "font-size: 2vw");
quizBox.setAttribute("style", "text-align: center; margin-left: auto; margin-right: auto; width: 50%");
start.setAttribute("style", "background-color: blue; color: white; position: relative; left: 47.5%");
highScoreTable.setAttribute("style", "table-layout: auto; width: 100%;");

