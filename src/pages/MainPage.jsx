import React, { useEffect, useState } from "react";

const MainPage = () => {
  const [errors, setErrors] = useState({
    amountError: "",
    rateError: "",
    termError: "",
    isAmountTouched: false,
    isRateTouched: false,
    isTermTouched: false,
  });
  const [buttonActivity, setButtonActivity] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (
      errors.amountError !== "none" ||
      errors.rateError !== "none" ||
      errors.termError !== "none"
    ) {
      if (buttonActivity) {
        setButtonActivity(false);
      }
    } else {
      if (!buttonActivity) {
        setButtonActivity(true);
      }
    }
  }, [JSON.stringify(errors)]);

  const validateInputs = (val, type) => {
    //Formatting numbers if necessary
    const tempStr = val;
    val = val.replaceAll(",", "");

    if (
      val &&
      !isNaN(val) &&
      tempStr[tempStr.length - 1] !== "," &&
      tempStr[tempStr.length - 1] !== "."
    ) {
      document.getElementById(type).value = Number(val).toLocaleString("en-US");
    }

    //Input Checks

    if (!val) {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "! This field can not remain empty",
      }));
    } else if (isNaN(val)) {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "! This field must be a number",
      }));
    } else if (val < 0) {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "! This field can not be a negative number",
      }));
    } else if (type === "rate" && val > 25) {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "! Annual Interest Rate can not exceed 25%",
      }));
    } else if (type === "amount" && val < 9999) {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "! Loan Amount lower limit is 10,000 $ ",
      }));
    } else if (type === "term" && val % 1 !== 0) {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "! This field must be a integer",
      }));
    } else if (type === "term" && val > 30) {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "! Loan Term upper limit is 30 years",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [type + "Error"]: "none",
      }));
    }
  };

  const blur = (e, type) => {
    const capitalizedStr = type[0].toUpperCase() + type.slice(1);
    const mergedString = "is" + capitalizedStr + "Touched";
    if (!errors[mergedString]) {
      setErrors({ ...errors, ["is" + capitalizedStr + "Touched"]: true });
    }

    const val = e.target.value.replaceAll(",", "");
    if (!isNaN(val) && val) {
      document.getElementById(type).value = Number(val).toLocaleString("en-US");
    }
  };

  const calculate = (e) => {
    e.preventDefault();
    const P = e.target[0].value.replaceAll(",", "");
    const i = e.target[1].value.replaceAll(",", "") / (12 * 100);
    const n = e.target[2].value.replaceAll(",", "") * 12;
    const result = (P * (i * (1 + i) ** n)) / ((1 + i) ** n - 1);
    setResult(Number(result.toFixed(2)).toLocaleString("en-US"));
  };

  return (
    <form onSubmit={calculate}>
      <div className="flex flex-col gap-5 xl:w-[40%] max-lg:w-[60%] max-md:w-[80%] max-sm:w-[90%] items-center mx-auto mt-5">
        <h1 className="font-semibold text-[2rem] text-center">
          Mortgage Payment Calculator
        </h1>
        <div className="flex flex-col gap-1 items-center w-full">
          <label htmlFor="loan">Loan Amount ($)</label>
          <input
            id="amount"
            type="text"
            className=" py-1 px-1 rounded-md outline-none border-2 border-gray-300 focus-within:border-blue-400 w-[50%]"
            onChange={(e) => validateInputs(e.target.value, "amount")}
            onBlur={(e) => blur(e, "amount")}
          />
          {errors.amountError &&
            errors.amountError !== "none" &&
            errors.isAmountTouched && (
              <p className="text-red-500">{errors.amountError}</p>
            )}
        </div>
        <div className="flex flex-col gap-1 items-center w-full">
          <label htmlFor="rate">Annual interest rate (%)</label>
          <input
            id="rate"
            type="text"
            className=" py-1 px-1 rounded-md outline-none border-2 border-gray-300 focus-within:border-blue-400 w-[50%]"
            onChange={(e) => validateInputs(e.target.value, "rate")}
            onBlur={(e) => blur(e, "rate")}
          />
          {errors.rateError &&
            errors.rateError !== "none" &&
            errors.isRateTouched && (
              <p className="text-red-500">{errors.rateError}</p>
            )}
        </div>
        <div className="flex flex-col gap-1 items-center w-full">
          <label htmlFor="term">Loan term (in years)</label>
          <input
            id="term"
            type="text"
            className=" py-1 px-1 rounded-md outline-none border-2 border-gray-300 focus-within:border-blue-400 w-[50%]"
            onChange={(e) => validateInputs(e.target.value, "term")}
            onBlur={(e) => blur(e, "term")}
          />
          {errors.termError &&
            errors.termError !== "none" &&
            errors.isTermTouched && (
              <p className="text-red-500">{errors.termError}</p>
            )}
        </div>
        <button
          className={`bg-blue-500 text-white px-2 py-2 rounded-xl hover:bg-blue-600 text-lg  ${
            !buttonActivity ? "pointer-events-none opacity-60" : ""
          }`}
          type="submit"
        >
          Calculate
        </button>
        {result && (
          <p className="text-2xl max-lg:text-xl max-sm:text-base font-semibold">
            Your monthly mortgage payment is&nbsp;
            <span className="text-green-500">${result}</span>
          </p>
        )}

        <p className="w-full max-sm:text-sm sm:text-center">
          - Numbers are in American Standart Form
        </p>
        <p className="w-full max-sm:text-sm sm:text-center">
          - The Loan Amount lower limit was taken as 10,000 $
        </p>
        <p className="w-full max-sm:text-sm sm:text-center">
          - The Annual Interest Rate upper limit was taken as 25%
        </p>
        <p className="w-full max-sm:text-sm sm:text-center">
          - The Loan Term upper limit was taken as 30 years
        </p>
        <p className="text-lg font-semibold text-amber-600 w-full max-sm:text-sm text-center">
          # Developed with Vanilla React and TailwindCSS #
        </p>
      </div>
    </form>
  );
};

export default MainPage;
