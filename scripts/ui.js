const elements = {
  upcomingCount: document.querySelector("#upcoming-count"),
  completedCount: document.querySelector("#completed-count"),
  totalCount: document.querySelector("#total-count"),
  undatedCount: document.querySelector("#undated-count"),
  mostUsedTag: document.querySelector("#most-used-tag"),
  upcomingList: document.querySelector("#dashboard-upcoming"),
  weeklyHistory: document.querySelector("#weekly-history"),
};
function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
}
function getMostUsedTag(plans) {
  const counts = new Map();
  for (const plan of plans) {
    const tag = plan.tag.trim();
    if (tag) {
      const normalizedTag = tag.toLowerCase();
      const existing = counts.get(normalizedTag);
      counts.set(normalizedTag, {
        label: existing?.label ?? tag,
        count: (existing?.count ?? 0) + 1,
      });
    }
  }
  let mostUsed = null;
  for (const item of counts.values()) {
    if (!mostUsed || item.count > mostUsed.count) {
      mostUsed = item;
    }
  }
  return mostUsed ? mostUsed.label : "none";
}
function renderUpcoming(plans, todayKey) {
  elements.upcomingList.replaceChildren();
  const upcoming = plans
    .filter(
      (plan) => !plan.completed && plan.dueDate && plan.dueDate >= todayKey,
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);
  if (upcoming.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No upcoming schedules yet.";
    elements.upcomingList.append(message);
    return;
  }
  for (const plan of upcoming) {
    const article = document.createElement("article");
    article.className = "activity";
    const details = document.createElement("div");
    details.className = "activity-description";
    const title = document.createElement("h3");
    title.textContent = plan.title;
    const tag = document.createElement("p");
    tag.textContent = `tag: ${plan.tag}`;
    const dueDate = document.createElement("p");
    dueDate.textContent = `Due: ${plan.dueDate}`;
    const duration = document.createElement("p");
    duration.textContent = `Duration: ${formatDuration(plan.duration)}`;
    details.append(title, tag);
    article.append(details, dueDate, duration);
    elements.upcomingList.append(article);
  }
}

function renderWeeklyHistory(plans, today) {
  elements.weeklyHistory.replaceChildren();
  const days = [];
  for (let offset = 6; offset >= 0; offset--) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const key = dateKey(day);
    const count = plans.filter((plan) => {
      if (!plan.createdAt) return false;
      const created = new Date(plan.createdAt);
      return !Number.isNaN(created.getTime()) && dateKey(created) === key;
    }).length;
    days.push({
      label: day.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      count,
    });
  }
      const history = document.createElement("div");
      history.className = "history-chart";
      history.setAttribute("role", "list");
      history.setAttribute("aria-label", "Numer of schedules per day!");
      const maxCount = Math.max(...days.map((day) => day.count), 1);
      for (const day of days) {
        const row = document.createElement("div");
        row.className = "history-row";
        row.setAttribute("role", "listitem");
        const label = document.createElement("span");
        label.className = "history-day";
        label.textContent = day.label;
        const track = document.createElement("div");
        track.className = "history-track";
        track.setAttribute("aria-hidden", "true");
        const bar = document.createElement("div");
        bar.className = "history-bar";
        bar.style.width = `${(day.count / maxCount) * 100}%`;
        track.append(bar);
        const count = document.createElement("span");
        count.className = "history-count";
        count.textContent = String(day.count);
        row.append(label, track, count);
        history.append(row);
      }
      elements.weeklyHistory.append(history);
    
  }


export function renderDashboard(plans) {
  const today = new Date();
  const todayKey = dateKey(today);
  const completed = plans.filter((plan) => plan.completed).length;
  const upcomingCount = plans.filter(
    (plan) =>
      !plan.completed &&
      plan.dueDate &&
      plan.dueDate >= todayKey,
  ).length;
  const undatedCount = plans.filter((plan) => !plan.dueDate).length;
  elements.upcomingCount.textContent = upcomingCount;
  elements.completedCount.textContent = completed;
  elements.totalCount.textContent = plans.length;
  elements.undatedCount.textContent = undatedCount;
  //elements.totalDuration.textContent = formatDuration(totalMinutes);
  elements.mostUsedTag.textContent = getMostUsedTag(plans);
  renderUpcoming(plans, todayKey);
  renderWeeklyHistory(plans, today);
}
