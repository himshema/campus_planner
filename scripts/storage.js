import { validateDatas } from "./validators.js";
const STORAGE_KEY = "bruno.storage.key";

export function getData() {
  let recordData;
  try {
    recordData = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    throw new error(
      "Sorry! can not acccess your data at the moment. Try again later",
      console.Error(Error),
    );
  }

  if (recordData === null) {
    return [];
  }
  let records;
  try {
    records = JSON.parse(recordData);
  } catch (error) {
    throw new error("Oooops", console.error(Error));
  }
  const errors = validateDatas(records);
  if (errors.length > 0) {
    throw new Error(`saved data failed validation: ${errors}`);
  }
  return records;
}
export function saveData(records) {
  const errors = validateDatas(records);
  if (errors.length > 0) {
    throw new Error(
      `Ooops, Could not save invalid data: \n${errors.join("\n")}`,
    );
  }
  
  try {
    const data = JSON.stringify(records);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    throw new error(console.error(error));
  }
}
