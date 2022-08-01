
let containerEl = document.getElementById('container');
let startBtn = document.querySelector('#start');
let timeEl = document.querySelector('#time');
let questionBoxEL = document.querySelector('#question-box');
let viewHighScoresBtnEl = document.getElementById('scoreView');
let finalScoreEL = document.getElementById('final-score');
let answerCorrectWrong = document.getElementById('correct-wrong-bar');
let playAgainEl = document.getElementById('play-again');
let clearEl = document.getElementById('clear');
let scoreHeaderEl = document.getElementById('soreheader');



let time = 60;
let currentQuestionIndex = 0; 
let timeIterval;
let score = 0;
let highScore = 50;

// questions, variants and answers list, later used in currentQuestion funstion
let questions = [
    {
        question: "Commonly used data types DO NOT include:",
        variants: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        question: "The condition in an if / else statement is enclosed with ____________",
        variants: ["quotes", "curly brackets", "parenthesis", "square brackets"],
        answer: "parenthesis"
    },
    {
        question: "Arrays in JavaScript can be used to store ___________.",
        variants: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        question: "String values must be enclosed within __________ when being assigned to variables.",
        variants: ["commas", "curly brackets", "quotes", "parenthesis"],
        answer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        variants: ["JavaScript", "terminal/bash", "for loops", "console.log"],
        answer: "console.log"
    }
];

// function to run and populate in HTML questions with the use of loop

function renderCurrentQuestion(){
    containerEl.innerHTML = ''; // removes welcome msg
    questionBoxEL.innerHTML = '';
    let currentQuestion = questions[currentQuestionIndex];

    let header = document.createElement('h2');
    header.textContent = currentQuestion.question;
    questionBoxEL.appendChild(header);

    let ulEl = document.createElement('ul');

    for (let i = 0; i < currentQuestion.variants.length; i++) {
        let liEl = document.createElement('li');
        liEl.textContent = currentQuestion.variants[i];
        ulEl.appendChild(liEl); 
    }
    questionBoxEL.appendChild(ulEl);
    
}


// start button even begins the quizz function and the timer
startBtn.addEventListener('click', function() {
    timeEl.textContent = time;
    renderCurrentQuestion();
    
    
    timeIterval = setInterval(function() {
        time--;
        timeEl.textContent = time;
    
        if (time <= 0) {
            gameOver();
            questionBoxEL.innerHTML ="Game Over!";
        }
            
    }, 1000);
});

// box with the questions as 'list items' feeding from the questions, variants, answers above 
questionBoxEL.addEventListener('click', function(event){
    if (event.target.matches('li')){
        let currentQuestion = questions[currentQuestionIndex];

        let userGuess = event.target.textContent;
        console.log(userGuess);

        if (userGuess === currentQuestion.answer){
            
            answerCorrectWrong.textContent = "Correct!";
            
            console.log('Correct!'); // 10 points added for correct
            score += 10;

            
        if (time <= 0) {
            gameOver();
        }
        } else {
            answerCorrectWrong.textContent = "Wrong!";
        
            console.log('Wrong!'); // 10 sec subtracted from wrong
            time-=10;
            timeEl.textContent = time;
            
        }
        answerCorrectWrong.classList.remove('hide'); // hiddend correct/wrong bar, removes hide for 1 sec after click on the answer
        setTimeout(function(){
            answerCorrectWrong.setAttribute('class','hide')

        },1000);
        currentQuestionIndex++;

        if (questions.length>currentQuestionIndex){
        renderCurrentQuestion();
        }else{
            gameOver()
        }
    }
});
// complition of the quizz with the All done! msg and final score calculated
function gameOver(){
    clearInterval(timeIterval); //time stopper
    questionBoxEL.textContent="";
    let gameOver = questionBoxEL.appendChild(document.createElement('h3'));
    gameOver.textContent="All done!"
    let scoreEl = questionBoxEL.appendChild(document.createElement('p'));
    scoreEl.textContent = "Your final score is: " + score + "\n";

    let enterInitials = questionBoxEL.appendChild(document.createElement('form'));
    enterInitials.textContent = "Enter your initials:"

    let input = questionBoxEL.appendChild(document.createElement('input'));
    let submitButton = questionBoxEL.appendChild(document.createElement('button'));
    submitButton.textContent = 'Submit!';  

    // submit bar, store user's score and initials in local storage
    submitButton.addEventListener('click', function(){
        let initials = input.value.trim();
        console.log(initials);
        if (initials !== ""){
            let highScore = JSON.parse(localStorage.getItem('highScore')) || [];
            let newScore = {score: score, initials:initials}
            highScore.push(newScore)
            localStorage.setItem('highScore', JSON.stringify(highScore)); 
            renderHighScores();   
        }
    });
}

function renderHighScores() {
questionBoxEL.innerHTML=""
finalScoreEL.classList.remove('hide')

let highScore = JSON.parse(localStorage.getItem('highScore')) || [];
let scoreList = document.querySelector('#scoreList');
highScore.sort(function(a,b){
    return b.score - a.score
})
for (let i=0; i<highScore.length; i++){
    let liEl = document.createElement('li')
    liEl.textContent = highScore[i].initials + ' - ' + highScore[i].score
    scoreList.appendChild(liEl)
}
}

// View high scores
viewHighScoresBtnEl.addEventListener("click", function() { 
renderHighScores();
containerEl.innerHTML = '';
viewHighScoresBtnEl.innerHTML = '';
});

// Play again
playAgainEl.addEventListener('click', () => {
window.location.reload();
});

// Clear score from the local storage
clearEl.addEventListener('click', function(){
    window.localStorage.clear();
    scoreList.innerHTML = '';
});