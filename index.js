require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db/index");
const path = require("path");

//App Config
const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cors());

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))
}

app.get("/interviewers", (request, response) => {
  pool.query(`SELECT * FROM interviewers`).then(({ rows: interviewers }) => {
    response.json(
      interviewers.reduce(
        (previous, current) => ({ ...previous, [current.id]: current }),
        {}
      )
    );
  });
});

app.get("/days", (request, response) => {
  pool.query(
    `
    SELECT
      days.id,
      days.name,
      array_agg(DISTINCT appointments.id) AS appointments,
      array_agg(DISTINCT available_interviewers.interviewer_id) AS interviewers,
      (SELECT sum(CASE WHEN interviews.id IS NULL THEN 1 ELSE 0 END) FROM appointments LEFT JOIN interviews ON interviews.appointment_id = appointments.id WHERE appointments.day_id = days.id)::int AS spots
    FROM days
    JOIN appointments ON appointments.day_id = days.id
    JOIN available_interviewers ON available_interviewers.day_id = days.id
    GROUP BY days.id
    ORDER BY days.id
  `
  ).then(({ rows: days }) => {
    response.json(days);
  });
});

app.get("/appointments", (request, response) => {
  pool.query(
    `
    SELECT
      appointments.id,
      appointments.time,
      CASE WHEN interviews.id IS NULL
      THEN NULL
      ELSE json_build_object('student', interviews.student, 'interviewer', interviews.interviewer_id)
      END AS interview
    FROM appointments
    LEFT JOIN interviews ON interviews.appointment_id = appointments.id
    GROUP BY appointments.id, interviews.id, interviews.student, interviews.interviewer_id
    ORDER BY appointments.id
  `
  ).then(({ rows: appointments }) => {
    response.json(
      appointments.reduce(
        (previous, current) => ({ ...previous, [current.id]: current }),
        {}
      )
    );
  });
});



app.put("/appointments/:id", (request, response) => {
  if (process.env.TEST_ERROR) {
    setTimeout(() => response.status(500).json({}), 1000);
    return;
  }

  const { student, interviewer } = request.body.interview;

  pool.query(
    `
    INSERT INTO interviews (student, interviewer_id, appointment_id) VALUES ($1::text, $2::integer, $3::integer)
    ON CONFLICT (appointment_id) DO
    UPDATE SET student = $1::text, interviewer_id = $2::integer
  `,
    [student, interviewer, Number(request.params.id)]
  )
    .then(() => {
      setTimeout(() => {
        response.status(204).send(
        JSON.stringify({
          type: "SET_INTERVIEW",
          id: Number(request.params.id),
          interview: request.body.interview
        })
       )
      }, 1000);
    })
    .catch(error => console.log(error));
});

app.delete("/appointments/:id", (request, response) => {

  pool.query(`DELETE FROM interviews WHERE appointment_id = $1::integer`, [
    request.params.id
  ]).then(() => {
    setTimeout(() => {
      response.status(204).send(
        JSON.stringify({
          type: "SET_INTERVIEW",
          id: Number(request.params.id),
          interview: null
        })
       );
    }, 1000);
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"))
});

app.listen(port, () => console.log(`listening on localhost:${port}`));