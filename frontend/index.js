
// patikrinam response
const handleResponseJSON = response => {
    if (response.ok) {
        return response.json()
    }
    throw new Error('Something went wrong');
};

// uzsiklausiam questions is db
async function Questions() {
    const JSONPLACEHOLDER_URI = 'http://127.0.0.1:3000/questions';
    const response = await fetch(JSONPLACEHOLDER_URI);
    const questions = await response.json();
    console.log(questions)
    displayQuestions(questions);
}

// sukeliam questions data i html
function displayQuestions(questions) {

    const body = document.querySelector("div#box");
    body.innerHTML = "";

    questions.forEach(question => {
        const qBox = document.createElement("div");
        qBox.setAttribute("class", "questions");
        const questionName = document.createElement('div')
        const questionDesc = document.createElement('div')
        questionName.innerText = question.question;
        questionDesc.innerText = question.question_description;
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', async () => {
            await deleteQuestion(question._id);
            Questions();
        });
        const answerButton = document.createElement('button');
        answerButton.innerText = 'Answer';
        answerButton.addEventListener('click', async () => {
            await answerQuestion(question._id);
            QuestionToAnswer(question)
        })

        // edit questions
        const editQuestionButton = document.createElement('button');
        editQuestionButton.innerText = 'Edit';
        editQuestionButton.addEventListener('click', async () => {

            const editQuestionForm = document.createElement("form");
            editQuestionForm.setAttribute("class", "questionToEdit");
            const questionEditDiv = document.createElement("div");
            const questionEditInput = document.createElement("input");
            questionEditInput.type = 'text';
            questionEditInput.name = 'questionFieldEdit';
            questionEditInput.placeholder = question.question;

            const questionFormaId = document.createElement('div')
            questionFormaId.innerText = question._id;
            questionFormaId.setAttribute("hidden", "true");
            questionFormaId.setAttribute('id', 'questionFormaId')

            const editQuestionButton = document.createElement('button');
            editQuestionButton.type = 'submit';
            editQuestionButton.innerText = 'Submit new Question';
            editQuestionButton.setAttribute("id", 'btnSubmitEditQuestion')

            questionEditDiv.append(questionEditInput, questionFormaId);
            editQuestionForm.append(questionEditDiv, editQuestionButton)
            qBox.append(editQuestionForm)
        });

        const pseudonym = document.createElement('div')
        pseudonym.innerText = question.pseudonym;
        pseudonym.setAttribute("maxwidth", "100");
        const created_date = document.createElement('div')
        created_date.innerText = question.created_date;
        const edited_date = document.createElement('div')
        edited_date.innerText = question.edited_date;

        qBox.append(questionName, questionDesc, pseudonym, created_date, answerButton, editQuestionButton, deleteButton);
        body.append(qBox);
    })
}

// edit question event listener

document.addEventListener('click', async function (e) {
    if (e.target && e.target.id == 'btnSubmitEditQuestion') {
        const question_id = document.getElementById('questionFormaId').innerText;
        e.preventDefault();
        const question = document.querySelector('input[name="questionFieldEdit"]').value;
        const Edited_date = Date();
        const question_idBD = document.getElementById('questionFormaId').innerText;
        console.log(question, Edited_date);
        const questionPatch = { question, Edited_date, question_idBD };
        console.log(questionPatch);
        const options = {
            method: 'PATCH',
            body: JSON.stringify(questionPatch),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        };
        await fetch(`http://localhost:3000/questions/${question_id}`, options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Creating new question failed");
            })

        Questions()
    }
});

// atskiru questions trynimas pagal id
function deleteQuestion(id) {
    return fetch(`http://localhost:3000/questions/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete question');
        }
        console.log('question deleted');
    }).catch(error => alert(error));
}

Questions()

// atskiro question to answer paemimas pagal id

function answerQuestion(id) {
    return fetch(`http://localhost:3000/questions/${id}`).then(response => {
        if (!response.ok) {
            throw new Error('Failed to upload question');
        }
        else {
            const question = response.json();

        }
    })
}

// ikeliame question to answer ir atsakymo forma i html

function QuestionToAnswer(question) {

    const body = document.querySelector("div#box");
    body.innerHTML = "";
    const questionToAnswerBD = document.createElement("div");
    questionToAnswerBD.innerText = "The question"

    const answerBody = document.createElement("div");
    answerBody.setAttribute("id", "questionToAnswer");

    const qBox = document.createElement("div");
    qBox.setAttribute("class", "questionToAnswer");
    const questionName = document.createElement('div')
    const questionDesc = document.createElement('div')
    questionName.innerText = question.question;
    questionDesc.innerText = question.question_description;
    const pseudonym = document.createElement('div')
    pseudonym.innerText = question.pseudonym;
    pseudonym.setAttribute("maxwidth", "100");
    const created_date = document.createElement('div')
    created_date.innerText = question.created_date;

    // answer forma

    const answerFormDiv = document.createElement("form");
    answerFormDiv.setAttribute("class", "questionToAnswer");
    const answerDiv = document.createElement("div");
    const answerInput = document.createElement("input");
    answerInput.type = 'text';
    answerInput.name = 'answerField';
    answerInput.placeholder = 'your answer';
    answerDiv.append(answerInput)

    const pseudoDiv = document.createElement("div");
    const pseudoInput = document.createElement("input");
    pseudoInput.type = 'text';
    pseudoInput.name = 'pseudonymField';
    pseudoInput.placeholder = "your pseudonym";
    pseudoDiv.append(pseudoInput)

    const SubmitAnswerButton = document.createElement('button');
    SubmitAnswerButton.type = 'submit';
    SubmitAnswerButton.innerText = 'Submit Answer';
    SubmitAnswerButton.setAttribute("id", 'btnSubmit')

    const questionForId = document.createElement('div')
    questionForId.innerText = question._id;
    questionForId.setAttribute("hidden", "true");
    questionForId.setAttribute('id', 'questionForId')

    answerFormDiv.append(answerDiv, pseudoDiv, SubmitAnswerButton, questionForId);
    qBox.append(questionName, questionDesc, pseudonym, created_date);
    body.append(qBox, answerBody, answerFormDiv);

    // return question;  const questionP =

    const qID = question._id;
    console.log(qID)
    getAnswerForQuestion(qID)
}

document.addEventListener('click', async function (e, question) {
    console.log(question);
    if (e.target && e.target.id == 'btnSubmit') {

        e.preventDefault();
        const answer = document.querySelector('input[name="answerField"]').value;
        const pseudonym = document.querySelector('input[name="pseudonymField"]').value.trim();
        const created_date = Date();
        const question_id = document.getElementById('questionForId').innerText;
        console.log(answer, pseudonym, created_date, question_id);
        const answerPost = { answer, pseudonym, created_date, question_id };
        console.log(answerPost);
        const options = {
            method: 'POST',
            body: JSON.stringify(answerPost),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        };
        await fetch('http://127.0.0.1:3000/answers', options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Creating new answer failed");
            })
        const qID = question_id;
        console.log(qID);
        // QuestionToAnswer(question)
        getAnswerForQuestion(qID)
        console.log(qID)
    }
});

async function getAnswerForQuestion(qID) {
    const response = await fetch(`http://127.0.0.1:3000/questions/${qID}/answers`);
    if (!response.ok) {
        throw new Error('Failed to upload question');
    }
    else {
        const answers = await response.json();
        console.log(answers)
        answersToQuestion(answers);
    }
}

function answersToQuestion(answers) {
    const answerBody = document.getElementById('questionToAnswer') 
    answerBody.innerHTML = "";

    answers.forEach(answer => {
        const aBox = document.createElement("div");
        aBox.setAttribute("class", "answer");
        const answerito = document.createElement('div')
        answerito.innerText = answer.answer;

        const pseudonym = document.createElement('div')
        pseudonym.innerText = answer.pseudonym;
        pseudonym.setAttribute("maxwidth", "100");
        const created_date = document.createElement('div')
        created_date.innerText = "created: " + answer.created_date;

        const Edited_date = document.createElement('div')
        Edited_date.innerText = "edited: " + answer.Edited_date;

        const qID = answer.question_id
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', async () => {
            await deleteAnswer(answer._id);
            getAnswerForQuestion(qID)
        });

        /////// Edit answer
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', async () => {

            const editForm = document.createElement("form");
            editForm.setAttribute("class", "answerToEdit");
            const answerEditDiv = document.createElement("div");
            const answerEditInput = document.createElement("input");
            answerEditInput.type = 'text';
            answerEditInput.name = 'answerFieldEdit';
            answerEditInput.placeholder = answer.answer;

            const answerForId = document.createElement('div')
            answerForId.innerText = answer._id;
            answerForId.setAttribute("hidden", "true");
            answerForId.setAttribute('id', 'answerForId')

            const editAnswerButton = document.createElement('button');
            editAnswerButton.type = 'submit';
            editAnswerButton.innerText = 'Submit new Answer';
            editAnswerButton.setAttribute("id", 'btnSubmitEdit')

            answerEditDiv.append(answerEditInput, answerForId);
            editForm.append(answerEditDiv, editAnswerButton)
            aBox.append(editForm)

        });


        aBox.append(answerito, pseudonym, Edited_date, created_date, deleteButton, editButton);
        answerBody.append(aBox)
    })
}

// atskiru answers trynimas pagal id
function deleteAnswer(id) {
    return fetch(`http://localhost:3000/answers/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete answer');
        }
        console.log('answer deleted');
    }).catch(error => alert(error));
}

///////// answer edit

document.addEventListener('click', async function (e) {
    if (e.target && e.target.id == 'btnSubmitEdit') {
        const answer_id = document.getElementById('answerForId').innerText;
        const question_id = document.getElementById('questionForId').innerText;
        e.preventDefault();
        const answer = document.querySelector('input[name="answerFieldEdit"]').value;
        const Edited_date = Date();
        const answer_idBD = document.getElementById('answerForId').innerText;
        console.log(answer, Edited_date);
        const answerPatch = { answer, Edited_date, answer_idBD };
        console.log(answerPatch);
        const options = {
            method: 'PATCH',
            body: JSON.stringify(answerPatch),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        };
        await fetch(`http://localhost:3000/answers/${answer_id}`, options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Creating new answer failed");
            })
        const qID = question_id;
        console.log(qID);
        getAnswerForQuestion(qID)
        console.log(qID)

    }

});





