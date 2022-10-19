import { Lox } from "./Lox";
import { ConsoleReporter } from "./Reporter";

const lox = new Lox(new ConsoleReporter());
lox.main(process.argv.slice(2));
