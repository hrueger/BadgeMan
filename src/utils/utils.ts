import * as path from "path";
import * as sqrl from "squirrelly";

export function toInt(v: string | number): number {
   if (typeof v == "string") {
      return parseInt(v, undefined);
   } else {
      return v;
   }
}

export function render(template, params = {} as any) {
   params.$cache = false;
   return sqrl.renderFile(path.join(__dirname, "../views/", `${template}.html`), params);
}
