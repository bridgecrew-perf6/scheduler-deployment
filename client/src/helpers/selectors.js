export function getAppointmentsForDay(state, day) {
  let appointmentForDay = [];
  let appointmentArray = [];
  for (let object of state.days) {
    if (object.name === day) {
      appointmentArray = object.appointments;
    }
  }

  for (let item of appointmentArray) {
    appointmentForDay.push(state.appointments[item]);
  }

  return appointmentForDay;
}

export function getInterview(state, interview) {
  let interviewData = {}

  const interviewers = Object.values(state.interviewers)

  for (let each of interviewers) {
 
    if (interview && each.id === interview.interviewer) {
      interviewData.student = interview.student;
      interviewData.interviewer = {
        id: each.id,
        name: each.name,
        avatar: each.avatar
      }
      return interviewData;
    }
  }
  return null;
}

export function getInterviewersForDay(state, day) {
  let interviewersForDay = [];
  let interviewersArray = [];
  for (let object of state.days) {
    if (object.name === day) {
      interviewersArray = object.interviewers;
    }
  }

  for (let item of interviewersArray) {
    interviewersForDay.push(state.interviewers[item]);
  }

  return interviewersForDay;
}

