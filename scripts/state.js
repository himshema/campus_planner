import { saveData } from "./storage.js";
let records = [];
export function getPlans() {
  return records.map((record) => ({ ...record }));
}

export function retrievePlans(plans) {
  records = plans.map((record) => ({ ...record }));
}

export function searchData(id) {
  const record = records.find((item) => item.id === id);
  return record ? { ...record } : undefined;
}
export function addPlan(plan) {
  if (records.some((record) => record.id === plan.id)) {
    throw new Error(`Nah, that ${plan.id} id already exists`);
  }
  const updateRecords = [...records, { ...plan }];
  saveData(updateRecords);
  records = updateRecords;
}
export function deletePlan(id) {
  const updateRecords = records.filter((record) => record.id !== id);
  if (updateRecords.length === records.length) {
    throw new Error(`Ooops, record with ${id} was not found!!!!!!!!`);
  }
  saveData(updateRecords);
  records = updateRecords;
}

export function updatePlan(id, updates) {
  const planIndex = records.findIndex((record) => record.id === id);
  if (planIndex === -1) {
    throw new Error(`Oooops, record with that ${id} was not foundd`);
  }
  const updateRecord = {
    ...records[planIndex],
    ...updates,
    id: records[planIndex].id,
    updatedAt: new Date().toISOString(),
  };
  const updateRecords = records.map((record, i) =>
    i === planIndex ? updateRecord : record,
  );
  saveData(updateRecords);
  records = updateRecords;
}

// m6: updates
export function importPlans(incomingPlans){
  const existingIds = new Set(records.map((record)=> record.id));
  const newPlans = incomingPlans.filter((plan)=> !existingIds.has(plan.id),);
  const skipped = incomingPlans.length - newPlans.length;
  const mergedRecords = [
    ...records.map((record) => ({...record})),
    ...newPlans.map((record)=>({...record})),
  ];
  saveData(mergedRecords);
  records = mergedRecords;
  return {
    added: newPlans.length,
    skipped,
  };
}