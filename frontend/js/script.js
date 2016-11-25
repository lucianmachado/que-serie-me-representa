window.onload = function() {
    let questions;
    let questionArea = document.getElementsByClassName('questions')[0]
    let answerArea = document.getElementsByClassName('answers')[0]
    let checker = document.getElementsByClassName('checker')[0]
    let responseImage = document.getElementsByClassName('responseImage')[0]
    let current = 0
    let testResponse = [];

    function GET(url, done) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
            done(null, xhr.response);
        };
        xhr.onerror = function() {
            done(xhr.response);
        };
        xhr.send();
    }

    function POST(url, data, done) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.onload = function() {
            done(null, xhr.response);
        };
        xhr.onerror = function() {
            done(xhr.response);
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(data);
    }

    function loadQuestion(questions, curr) {
        var question = questions[curr].question
        questionArea.innerHTML = '';
        questionArea.innerHTML = question;
    }

    function loadAnswers(questions, curr) {
        let answers = questions[curr].alternatives.map(item => item.description)
        answerArea.innerHTML = '';
        for (var i = 0; i < answers.length; i += 1) {
            var createDiv = document.createElement('div'),
                text = document.createTextNode(answers[i]);
            createDiv.appendChild(text);
            createDiv.addEventListener("click", checkAnswer(questions, i, answers));
            answerArea.appendChild(createDiv);
        }
    }

    function checkAnswer(questions, i, arr) {
        return function() {
            var givenAnswer = i
            addChecker(true);
            testResponse.push({
                valor: questions[current].alternatives[i].serie,
                peso: questions[current].peso
            })
            if (current < questions.length - 1) {
                current += 1;
                loadQuestion(questions, current);
                loadAnswers(questions, current);
            } else {
                POST("http://localhost:8000/api/questions/test", JSON.stringify(testResponse), function(err, response) {
                    if (err) {
                        throw err;
                    }
                    response = JSON.parse(response)

                    questionArea.innerHTML = 'Você é ' + response.nome;
                    answerArea.innerHTML = response.description;
                    checker.innerHTML = ''
                    responseImage.innerHTML = '<img src="'+ response.image + '">';
                })

            }
        };
    }

    function addChecker(bool) {
        var createDiv = document.createElement('div'),
            txt = document.createTextNode('');
        createDiv.appendChild(txt);
        if(bool){
            checker.children[current].className = 'correct';
        }else{
            createDiv.className += 'false';
        }
        checker.appendChild(createDiv);
    }
    
    GET('http://localhost:8000/api/questions', function(err, questions) {
        if (err) {
            throw err;
        }
        questions = JSON.parse(questions);
        questions.forEach(function() {addChecker(false)})
        loadQuestion(questions, current);
        loadAnswers(questions, current);
    });
};