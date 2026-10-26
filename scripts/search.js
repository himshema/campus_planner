import { getData } from "./storage.js";
import { retrievePlans, getPlans, updatePlan, deletePlan } from "./state.js";
const planner = document.querySelector("#myPlanner");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#myPlanner_sort");
const statusFilter = document.querySelector("#completion_filter");
const sms = document.querySelector("#myPlanner-sms");

function searchRegex(searchTerm, caseSensitive = false){
  try{
    return new RegExp(searchTerm, caseSensitive ? "" : "i");
  } catch{
    return null;
  }
}

let loadError = false;
try {
  retrievePlans(getData());
} catch (error) {
  loadError = true;
  console.error("Couldnt load the scheduless", error);
  sms.textContent =
    "Could not retrieve your data, please reload the webb again!";
}
function formDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
}
function highlightMatches(element, text, regex){
  if (!regex){
    element.textContent = text;
    return;
  }
  const flags = regex.flags.includes("g") ? regex.flags :`${regex.flags}g`;
  const globalRegex = new RegExp(regex.source, flags);
  let lastIndex = 0;
  let match;
  while ((match = globalRegex.exec(text)) !== null){
    element.append(
      document.createTextNode(text.slice(lastIndex, match.index)),
    );
    const mark = document.createElement("mark");
    mark.textContent = match[0];
    element.append(mark);
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0){
      globalRegex.lastIndex++;
    }
  }
  element.append(document.createTextNode(text.slice(lastIndex)));

}
function renderPlans() {
  if (loadError) return;
  const searchTerm = searchInput.value.trim();
  const searchPattern = searchRegex(searchTerm);
  if (searchTerm && !searchPattern){
    sms.textContent = "Oops, Invalid Regular eexpression";
    planner.replaceChildren();
    return;
  }

  const sortBy = sortSelect.value;
  const status = statusFilter.value;
  let plans = getPlans().filter((plan) => {
    const searchableText = [
      plan.title,
      plan.description,
      plan.tag,
      plan.dueDate,
    ]
      .join(" ");
    const matchesSearch = !searchPattern || searchPattern.test(searchableText);
    const matchesStatus =
      status === "all" ||
      (status === "completed" && plan.completed) ||
      (status === "pending" && !plan.completed);
    return matchesSearch && matchesStatus;
  });

  plans.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "date") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === "duration") {
      return a.duration - b.duration;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
  planner.replaceChildren();
  if (plans.length === 0) {
    sms.textContent = searchTerm
      ? "Ooops, No match was found for your search"
      : "You have no schedules Yet, add your first schedule.";
    planner.classList.toggle("dn", plans.length === 0);
    return;
  }
  planner.classList.remove("dn")
  //sms.textContent = `${plans.length} schedule ${plans.length === 1 ? "" : "s"} found.`;
  console.log(plans)
  for (const plan of plans) {
    const card = document.createElement("article");
    card.className = "activity";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = plan.completed;
    checkbox.id = `completed-${plan.id}`;
    checkbox.setAttribute("aria-label", `Mark ${plan.title} as completed`);
    checkbox.addEventListener("change", () => {
      try {
        updatePlan(plan.id, { completed: checkbox.checked });
        renderPlans();
      } catch (error) {
        console.error("Couldn't add schedule: ", error);
        sms.textContent = "Ooops, Please try again!!!";
      }
    });
    const description = document.createElement("div");
    description.className = "activity-description";
    const title = document.createElement("h3");
    highlightMatches(title, plan.title, searchPattern);
    if (plan.completed) {
      title.classList.add("completed");
    }
    const tag = document.createElement("p");
    tag.style.color = "#707070";
    highlightMatches(tag, `tag: ${plan.tag}`, searchPattern);
    description.append(title, tag);
    if (plan.description) {
      const details = document.createElement("p");
      highlightMatches(details, plan.description, searchPattern);
      description.append(details);
    }
    const duration = document.createElement("p");
    duration.textContent = `Duration ${formDuration(plan.duration)}`;
    const dueDate = document.createElement("p");
    dueDate.textContent = plan.dueDate ? `Due: ${plan.dueDate}` : "No due Date";
    const actions = document.createElement("div");
    actions.className = "action";
    const editButton = document.createElement("button")
    editButton.type = "button";
    editButton.textContent = "Edit"
    editButton.setAttribute("aria-label", `Edit ${plan.title}`);
    editButton.addEventListener("click", ()=>{
        window.location.href = `addRecord.html?id=${encodeURIComponent(plan.id)}`;
    });


    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${plan.title}`);
    deleteButton.addEventListener("click", () => {
      if (
        !confirm(
          `Are you sure you want to delete "${plan.title}"? This can't be done`,
        )
      ) {
        return;
      }
      try {
        deletePlan(plan.id);
        renderPlans();
      } catch (error) {
        console.error("Couldn't delete the schedulee", error);
        sms.textContent = "The action could not be done please try again!!!";
      }
    });
    actions.append(editButton, deleteButton);
    card.append(checkbox, description, duration, dueDate, actions);
    planner.append(card);
  }
}
searchInput.addEventListener("input", renderPlans);
sortSelect.addEventListener("change", renderPlans);
statusFilter.addEventListener("change", renderPlans);
renderPlans();
