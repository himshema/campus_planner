import { getData } from "./storage.js";
import { retrievePlans, getPlans } from "./state.js";
import { renderDashboard } from "./ui.js";

function campusPlanner() {
  try {
    const localData = getData();
    retrievePlans(localData);
    const plans = getPlans();
    renderDashboard(plans);
    console.log("Baowww, Data retrieved successfully.");
    console.log(`Data: ${plans.length}`);
    document.body.dataset.appStatus = "ready";
  } catch (error) {
    console.error("Ooopz, Failed to load data", error);
    document.body.dataset.appStatus = "storage-error";
  }
}
campusPlanner();