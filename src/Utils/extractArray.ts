export const extractArray = (resData: any): any[] => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (resData.data && typeof resData.data === 'object') {
    if (Array.isArray(resData.data)) return resData.data;
    for (const key of Object.keys(resData.data)) {
      if (Array.isArray(resData.data[key])) return resData.data[key];
    }
  }
  return [];
};
