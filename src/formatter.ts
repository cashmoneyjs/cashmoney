import { Money } from "./money";

export default interface MoneyFormatter {
    format(money: Money): string;
}
