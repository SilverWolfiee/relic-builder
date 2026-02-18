const BASE_URL = "https://cdn.neonteam.dev/neonteam";
let cachedVersion = null;
//get current game version
const getVersion = async () => {
  if (cachedVersion) return cachedVersion;
  const res = await fetch(`${BASE_URL}/Metadata.json`);
  const meta = await res.json();
  cachedVersion = meta.CurrentVersion;
  return cachedVersion;
};

export const getData = async (data, callback) => {
  try {
    const version = await getVersion();
    const response = await fetch(`${BASE_URL}/${version}/${data}.json`);
    const result = await response.json();
    callback(result);
  } catch (err) {
    console.error("Express Error (Data):", err);
  }
};

export const getItem = async (category, item, callback) => {
  if (!item) return;
  try {
    const version = await getVersion();
    const response = await fetch(`${BASE_URL}/${version}/${category}.json`);
    const data = await response.json();
    
    if (data[item]) {
      callback(data[item]);
    } else {
      console.warn(`Could not find ID ${item} in ${category}`);
    }
  } catch (err) {
    console.error("Express Error (Item):", err);
  }
};