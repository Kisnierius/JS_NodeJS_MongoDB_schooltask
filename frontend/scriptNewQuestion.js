// EXTERNAL API
const JSONPLACEHOLDER_URI = 'http://127.0.0.1:3000/questions';

//-- form
const formCreateQuestion = document.querySelector('form');

function createQuestionFETCH(event) {
    event.preventDefault();
    const question = document.querySelector('input[name="Question"]').value;
    const question_description = document.querySelector('input[name="QDescription"]').value;
    const pseudonym = document.querySelector('input[name="Pseudonym"]').value.trim();
    const created_date = Date();
    
    
    console.log(question, question_description, pseudonym);
    const questionPost = {question, question_description, pseudonym, created_date};
    console.log(questionPost);
    const options = {
      method: 'POST',
      body: JSON.stringify(questionPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };
    fetch(JSONPLACEHOLDER_URI, options)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error("Creating new question failed");
      })
      .then(data => document.getElementById('message').textContent = `question was created`)
      .catch(error => document.getElementById('message').textContent = error.message);
  }

// *** Events ***

formCreateQuestion.addEventListener('submit', createQuestionFETCH);