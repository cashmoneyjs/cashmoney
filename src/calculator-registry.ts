import { Calculator } from "./calculator";
import { JsNumberCalculator } from "./calculators/js-number";

export class CalculatorRegistry {
    private static calc: Calculator | null = null;

    public static registerCalculator(calc: Calculator): void {
        CalculatorRegistry.calc = calc;
    }

    public static getCalculator(): Calculator {
        if (CalculatorRegistry.calc === null) {
            CalculatorRegistry.calc = new JsNumberCalculator();
        }

        return CalculatorRegistry.calc;
    }
}
