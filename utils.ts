export function validatePassword(password: string): boolean {
  const passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function maskCardNumber(cardNumber: string): string {
  return `**** **** **** ${cardNumber.slice(-4)}`;
}

export function range(start: number, end: number, step = 1) {
  let current = start;

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      if (current < end) {
        const value = current;
        current += step;
        return { value, done: false };
      }
      return { value: undefined, done: true };
    },
  };
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  let keyValues: any[] = [];
  arr.forEach((item) => {
    if (!keyValues.includes(item[key])) {
      keyValues.push(item[key]);
    }
  });
  let result: Record<string, T[]> = {};
  keyValues.forEach((keyValue) => {
    result[keyValue] = arr.filter((item) => item[key] === keyValue);
  });
  return result;
}

export function add(a: number, b: number): number {
  return a + b;
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function reverseString(str: string): string {
  return str.split("").reverse().join("");
}

export function getCharactersCount(string: string): Record<string, number> {
  const count: Record<string, number> = {};
  for (const char of string) {
    count[char] = (count[char] || 0) + 1;
  }
  return count;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
