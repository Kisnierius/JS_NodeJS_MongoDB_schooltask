require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const { USER, PASS, PORT } = process.env;
const URI = `mongodb+srv://${USER}:${PASS}@vigi2.jvlh0.mongodb.net/?retryWrites=true&w=majority`;
const app = express();
app.use(cors(), express.json());
const client = new MongoClient(URI);

// GET questions

app.get('/questions', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('questions');
    const questions = await collection.find().sort('created_date', request.query.sort?.toLowerCase() === 'dsc' ? -1 : 1).toArray();
    await client.close();
    return response.status(200).json(questions);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

// POST questions

app.post('/questions', async (request, response) => {
  try {
    const {
      question, question_description, pseudonym, created_date,
    } = request.body;
    const errors = [];
    if (typeof question !== 'string' && question.length <= 5) {
      errors.push('question must be a string with at least 5 characters');
    }
    if (typeof question_description !== 'string' && question_description.length <= 5) {
      errors.push('question_description must be a string with at least 5 characters');
    }
    if (typeof pseudonym !== 'string' && pseudonym.length <= 3) {
      errors.push('question_description must be a string with at least 3 characters');
    }
    if (errors.length > 0) {
      return response.status(400).json({ errors });
    }
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('questions');
    // eslint-disable-next-line max-len
    const questionPost = await collection.insertOne({
      question, question_description, pseudonym, created_date,
    });
    await client.close();
    return response.status(200).json(questionPost);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

/// Delete question

app.delete('/questions/:id', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('questions');
    const deletequestion = await collection.deleteOne({ _id: ObjectId(request.params.id) });
    await client.close();
    response.status(200).json(deletequestion);
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.get('/questions/:id', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('questions');
    const question = await collection.find({ _id: ObjectId(request.params.id) }).sort().toArray();
    await client.close();
    return response.status(200).json(question);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

// POSTINAM Answerius

app.post('/answers', async (request, response) => {
  try {
    const {
      answer, pseudonym, created_date, question_id,
    } = request.body;
    const errors = [];
    if (typeof answer !== 'string' && answer.length <= 5) {
      errors.push('answer must be a string with at least 5 characters');
    }
    if (typeof pseudonym !== 'string' && pseudonym.length <= 3) {
      errors.push('question_description must be a string with at least 3 characters');
    }
    await client.connect();
    const database = client.db('questionsAnswers');
    const questionsCollection = database.collection('questions');
    const question = await questionsCollection.findOne({ _id: ObjectId(question_id) });
    await client.close();
    if (!question) {
      errors.push('question ID not found');
    }
    if (errors.length > 0) {
      return response.status(400).json({ errors });
    }
    await client.connect();
    const answerscollection = database.collection('answers');
    const answers = await answerscollection.insertOne({
      answer, pseudonym, created_date, question_id,
    });
    await client.close();
    return response.status(200).json(answers);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.get('/questions/:question_id/answers', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('answers');
    const answers = await collection.find({ question_id: request.params.question_id }).sort('created_date', request.query.sort?.toLowerCase() === 'dsc' ? -1 : 1).toArray();
    await client.close();
    return response.status(200).json(answers);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.delete('/answers/:id', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('answers');
    const deleteanswer = await collection.deleteOne({ _id: ObjectId(request.params.id) });
    await client.close();
    response.status(200).json(deleteanswer);
  } catch (error) {
    response.status(500).json({ error });
  }
});

/// / Patch answer:

app.patch('/answers/:id', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('answers');
    const myquery = { _id: ObjectId(request.body.answer_idBD) };
    const newvalues = { $set: { answer: request.body.answer, Edited_date: request.body.Edited_date } };
    const updateAnswer = await collection.updateOne(myquery, newvalues);
    await client.close();
    response.status(200).json(updateAnswer);
  } catch (error) {
    response.status(500).json({ error });
  }
});

/// / Patch question:

app.patch('/questions/:id', async (request, response) => {
  try {
    await client.connect();
    const database = client.db('questionsAnswers');
    const collection = database.collection('questions');
    const myquery = { _id: ObjectId(request.body.question_idBD) };
    const newvalues = { $set: { question: request.body.question, Edited_date: request.body.Edited_date } };
    const updateQuestion = await collection.updateOne(myquery, newvalues);
    await client.close();
    response.status(200).json(updateQuestion);
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(
    `My app is running and listening to port http://localhost:${PORT}/`,
  );
});
