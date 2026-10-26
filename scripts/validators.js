const title_pattern = /^(?!.* {2,})\S(?:.*\S)?$/;
const duration_pattern = /^[1-9]\d*$/;
const date_pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const tag_pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

function dateValidator(value) {
  if ( typeof value !== "string" || !date_pattern.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function DurationValidator(value) {
  return (
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Date.parse(value))
  );
}
export function validateData(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return ["Not valid objecttttt"];
  }
  if (typeof record.id !== "string" || record.id.trim() === "") {
    errors.push("We need an Id!!!");
  }
  if (typeof record.title !== "string" || !title_pattern.test(record.title)) {
    errors.push(
      alert("Wait! provide valid title, title can not contain trailing space!"),
      "Wait! Please provide valid title, Title can not contain trailing spaces, and collapse doubles!!!",
    );
  }
  if (
    typeof record.duration !== "number" ||
    !Number.isSafeInteger(record.duration) ||
    record.duration <= 0 ||
    !duration_pattern.test(String(record.duration))
  ) {
    errors.push("Duration must be a numerical and above 0");
  }
  if (typeof record.tag !== "string" || !tag_pattern.test(record.tag)) {
    errors.push("Tag must only contain letters,spaces. and hyphens");
  }
  return errors;
}

export function validateDatas(records) {
  if (!Array.isArray(records)) {
    return ["Damnn, Data is not well formatted!"];
  }
  const errors = [];
  const duplicateIds = new Set();
  records.forEach((record, index) => {
    const recordErrors = validateData(record);
    recordErrors.forEach((error) => {
      errors.push(`Record ${index + 1}: ${error}`);
    });
    if (record && typeof record.id === "string") {
      if (duplicateIds.has(record.id)) {
        errors.push(`Record ${index + 1}: Duplicate ID "${record.id}".`);
      }
      duplicateIds.add(record.id);
    }
  });
  return errors;
}
