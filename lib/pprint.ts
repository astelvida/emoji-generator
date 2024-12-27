import { inspect } from "util";
// console.log(`${start}${label}${end}`);
export const pp = (o: unknown, label: string = "OUTPUT", options = {}) => {
  console.log(`<<${label?.trim() || ""}>>`);
  console.log(inspect(o, { showHidden: false, depth: 20, colors: true, ...options }));
  console.log("<<>>");
};

export const pprint = (o: unknown, label: string = "") => {
  console.log("---" + label ? label + "---" : "");
  console.dir(o, { depth: 10, colors: true });
  console.log("---");
};
