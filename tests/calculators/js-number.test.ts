import { TestFixture } from "alsatian";

import AbstractCalculatorTest from "./abstractcalculator";
import JsNumberCalculator from "src/calculators/js-number";
import Calculator from "src/calculator";

@TestFixture("JS Number Calculator")
export default class JsNumberCalculatorTest extends AbstractCalculatorTest {
    protected getCalculator(): Calculator {
        return new JsNumberCalculator();
    }
}
