import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const updateSpots = function (dayName, days, appointments) {
    const dayObj = days.find(item => item.name == dayName);
    let spots = 0;

    for (const id of dayObj.appointments) {
      if (!appointments[id].interview) {
        spots++;
      }
    }
    const newDay = { ...dayObj, spots };

    const newDays = days.map(item => (item.name === dayName) ? newDay : item);
    return newDays
  };

  function bookInterview(id, interview) {

    let interviewerID;
    if (interview && interview.interviewer && interview.interviewer.name) {
      interviewerID = interview.interviewer.id;

    }
    const appointment = {
      ...state.appointments[id],
      interview: {
        student: interview.student,
        interviewer: interviewerID ? interviewerID : interview.interviewer
      }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`/appointments/${id}`, appointment)
      .then(response => {

        let days = updateSpots(state.day, state.days, appointments);

        setState({ ...state, days, appointments });
      })
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id]
    };

    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .delete(`/appointments/${id}`, appointment)
      .then(response => {
        let days = updateSpots(state.day, state.days, appointments);
        setState({ ...state, days, appointments })
      })
  }

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([axios.get('/days'), axios.get('appointments'), axios.get('/interviewers')])
      .then((all) => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
      })
  }, [])
  return { state, setDay, bookInterview, cancelInterview }
}