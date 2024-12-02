export const flatArrayObject = (arr: object[]) => {
  const result = [];
  arr.forEach((item) => result.push(flatObject(item)));

  return result;
};

export const flatObject = (obj: object) => {
  const result = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flatObject(obj[key]));
    } else {
      result[key] = obj[key];
    }
  }

  return result;
};
