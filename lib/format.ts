import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

// تاریخ شمسی
export const jDate = (d: Date | string): string => {
  return dayjs(d).calendar("jalali").locale("fa").format("YYYY/MM/DD");
};

// تاریخ و ساعت شمسی
export const jDateTime = (d: Date | string): string => {
  return dayjs(d).calendar("jalali").locale("fa").format("YYYY/MM/DD - HH:mm");
};

// قیمت به تومان
export const toman = (n: number): string => {
  return `${n.toLocaleString("fa-IR")} تومان`;
};

// عدد فارسی
export const faNum = (n: number): string => {
  return n.toLocaleString("fa-IR");
};