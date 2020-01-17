import AbstractCalculatorTest from "./abstractcalculator";
import JsNumberCalculator from "src/calculators/js-number";
import Calculator from "src/calculator";

export default class JsNumberCalculatorTest extends AbstractCalculatorTest {
    protected getCalculator(): Calculator {
        return new JsNumberCalculator();
    }
}
