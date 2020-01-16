import { Money } from "./money";

export interface MoneyFormatter {
    format(money: Money): string;
}
