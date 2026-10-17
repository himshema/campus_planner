import { getData } from "./storage.js";
import { retrievePlans } from "./state.js";
import { addPlan } from "./state.js";
import { validateData } from "./validators.js";
import {updatePlan} from "./state.js";
import { searchData } from "./state.js";
const form = document.querySelector("#schedule");
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");
let existingPlan;
const heading = document.querySelector("#heading");
const sms = document.querySelector("#sms")
const submitButton = form.querySelector('button[type="submit"]');
try {
  retrievePlans(getData());
  if (editId){
    existingPlan = searchData(editId);
    form.elements.namedItem("title").value = existingPlan.title;
  form.elements.namedItem("dueDate").value = existingPlan.dueDate;
  form.elements.namedItem("tag").value = existingPlan.tag;
  form.elements.namedItem("description").value= existingPlan.description;
  const durationInput = form.elements.namedItem("duration");
  const durationUnit = form.elements.namedItem("durationTime");
  if (existingPlan.duration %60 === 0){
    durationInput.value = existingPlan.duration /60;
    durationUnit.value = "hours";
  } else {
    durationInput.value = existingPlan.duration;
    durationUnit.value = "minutes";
  }
  document.querySelector("#heading").textContent = "Edit your Schedule"
  submitButton.textContent = "Save Changes";
  }
  
} catch (error) {
  console.error("Could not load the dataaa", error);
  showMessage("Couldn't retrieve data, Please reload again!", true);
  form.querySelector('button[type="submit"]').disabled = true;
}
let storageReady = true;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (submitButton.disabled) return;

  sms.textContent = "";
  sms.style.color = "";
  const formdata = new FormData(form);
  const title = formdata.get("title").trim();
  const dueDate = formdata.get("dueDate");
  const duration = Number(formdata.get("duration"));
  const durationTime = formdata.get("durationTime");
  const tag = formdata.get("tag").trim();
  const description = formdata.get("description").trim();

  if (!Number.isFinite(duration) || duration <= 0) {
    showMessage("Nah, Duration must be greater than zero.", true);
    return;
  }
  const durationMinutes = durationTime === "hours" ? duration * 60 : duration;
  if (
    !Number.isSafeInteger(Math.round(durationMinutes)) ||
    Math.abs(durationMinutes - Math.round(durationMinutes)) > 1e-9
  ) {
    showMessage("Duration not converted Properly", true);
    return;
  }
  const rn = new Date().toISOString();
  const plan = existingPlan ? {
    ...existingPlan,
    id: `plan_${crypto.randomUUID()}`,
    title,
    description,
    dueDate,
    duration: Math.round(durationMinutes),
    tag,
    updatedAt: rn,
  } : {
    id: `plam_${crypto.randomUUID()}`,
    title,
    description,
    dueDate,
    duration: Math.round(durationMinutes),
    tag,
    completed: false,
    createdAt: rn,
    updatedAt: rn,
  };
  const errors = validateData(plan);
  if (errors.length > 0) {
    showMessage(errors.join(" "), true);
    return;
  }
  try {
    if (existingPlan){
      updatePlan(editId, plan);
      showMessage("W, Schedule updated successfully!!!!", false);
      window.location.href = "../assets/myPlanner.html";
    } else {
    addPlan(plan);
    form.reset();
    showMessage("W, Your schedule Was added!", false);
    window.location.href = "../assets/myPlanner.html";
    }
  } catch (error) {
    console.error("L, Could not record your schedule!!", error);
    showMessage("Couldnot record your schedule.", true);
  }

});
function showMessage(text, isError) {
  sms.textContent = text;
  sms.style.color = isError ? "#7b0404" : "#047b75";
}
