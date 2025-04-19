import { create } from "express-handlebars";
import path from "path";

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "../views/layouts"),
  partialsDir: path.join(__dirname, "../views/partials"),
  helpers: {
    json: (context: any) => JSON.stringify(context),
    ifEqual: (a: any, b: any, options: any) => {
      if (a == b) {
        return options.fn(this); // Render block if true
      }
      return options.inverse(this); // Render block if false
    },
    prerequisiteDisplay: (prerequisite: any) => {
      return prerequisite ? prerequisite.module_code : "Không";
    },
  
    isActiveText: (isActive: boolean) => {
      if (isActive) 
        return "Đang hoạt động"
      else 
        return "Không còn được mở"  
    },
    isActiveClass: (isActive: boolean) => {
      if (isActive) 
        return "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600"

      else 
        return "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700"

    },
  
    statusClass: (statusName: string) => {
      switch (statusName) {
        case "Đang học":
          return "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600";
        case "Đã tốt nghiệp":
          return "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100";
        case "Đã thôi học":
          return "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700";
        case "Tạm dừng học":
          return "px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700";
        default:
          return "px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700";
      }
    }
  }
  
});

export default hbs;