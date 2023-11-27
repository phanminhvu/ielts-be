export const verifyEmail = (email: string) =>
  email &&
  email.trim() &&
  email.trim().length > 0 &&
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim());

export const randomCodeByLength = (length: number) => {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (length > max) {
    return randomCodeByLength(max) + randomCodeByLength(length - max);
  }

  max = Math.pow(10, length + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + number).substring(add);
};

export const permute = function (arr: any[]) {
  var result = [];
  var backtrack = (i: number, arr: any[]) => {
    if (i === arr.length) {
      result.push(arr.slice());
      return;
    }
    for (let j = i; j < arr.length; j++) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      backtrack(i + 1, arr);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  backtrack(0, arr);
  return result;
};
