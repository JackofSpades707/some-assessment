const express = require('express')
const app = express()
const httpPort = 3000
const pgPort = 5432
const { Client } = require('pg')

const client = new Client({
  user: 'jack',
  host: '127.0.0.1',
  database: 'assessment',
  port: pgPort,
})

client.connect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/question_one', async (req, res) => {
  let retval = await client
    .query("SELECT * FROM question_one_shifts")
    .then(res => res.rows)
    .catch(e => console.error(e.stack))
  console.log(retval)
  res.send(retval)
  res.end()
})

app.post('/question_two', async (req, res) => {
  let shift1 = await getShift(req.body.shift1.id)
  let shift2 = await getShift(req.body.shift2.id)
  let retval = calcShiftOverlap(shift1, shift2)
  console.log(retval)
  res.send(retval)
  res.end()
})

app.listen(httpPort, () => {
  console.log(`Webserver listening on port: ${httpPort}`)
})


async function getShift(shiftId) {
  let retval = await client
    .query(`SELECT * FROM question_one_shifts WHERE shift_id = ${shiftId}`)
    .then(res => res.rows[0])
    .catch(e => console.error(e.stack))
  return retval
}

// simple helper funcs. intentionally used snake_case
str_to_ms = (date, time) => Date.parse(`${date}:${time}`)
ms_to_mins = (ms) => ms / 1000 / 60
mins_to_ms = (mins) => mins * 1000 * 60
has_any_overlap = (s1, s2) => (s1.end_time_ms >= s2.start_time_ms) && (s2.end_time_ms >= s1.start_time_ms)



function parseShiftTimes(shift) {
  let st = str_to_ms(shift.shift_date, shift.start_time)
  let et = str_to_ms(shift.shift_date, shift.end_time)
  if (et < st) {
    et += (1000 * 60 * 60 * 24) // increment by 24 hours
  }
  return [st, et]
}

function calcShiftOverlap(s1, s2) {
  // @param s1 - shift1
  let overlapThreshold = 0
  let overlapMs = 0
  let overlapMins = 0
  let overlapExceeded = false

  // parse to milliseconds
  [s1.start_time_ms, s1.end_time_ms] = parseShiftTimes(s1)
  [s2.start_time_ms, s2.end_time_ms] = parseShiftTimes(s2)

  // determine overlapThreshold
  if (s1.facilty_id === s2.facilty_id) {
    overlapThreshold = mins_to_ms(30)
  } else {
    overlapThreshold = 0
  }

  // determine overlapping
  if (s1.end_time_ms >= s2.start_time_ms) {
    overlapMs += s1.end_time_ms - s2.start_time_ms
  }
  else if (s2.end_time_ms >= s1.start_time_ms) {
    overlapMs += s2.end_time_ms - s2.start_time_ms
  }
  overlapMins = ms_to_mins(overlapMs)
  overlapExceeded = overlapMs > overlapThreshold

  // set overlapThreshold back to minutes
  overlapThreshold = ms_to_mins(overlapThreshold)

  let retval = {
    overlapMins: overlapMins,
    overlapThreshold: overlapThreshold,
    overlapExceeded: overlapExceeded,
    shiftIDs: [s1.shift_id, s2.shift_id]
  }
  return retval
}


(async () => {
  let shift1 = await getShift(1)
  let shift2 = await getShift(2)
  let retval = calcShiftOverlap(shift1, shift2)
  console.log(retval)
})()

