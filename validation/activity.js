const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.subject = !isEmpty(data.subject) ? data.subject : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.goal = !isEmpty(data.goal) ? data.goal : "";
  data.date = !isEmpty(data.date) ? data.date : "";
  data.duration = !isEmpty(data.duration) ? data.duration : "";

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "Subject field is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type field is required";
  }

  if (Validator.isEmpty(data.date)) {
    errors.date = "Date field is required";
  }

  if (Validator.isEmpty(data.duration)) {
    errors.duration = "Time field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
