const checkbox = document.getElementById("darkmode-toggle");
checkbox.addEventListener('change', () => {
  // Change theme here   
  document.body.classList.toggle("dark")
});

function generateTimeInfo() {
  const countDate = new Date("May 31, 2023 16:00:00").getTime();
  const now = new Date().getTime();

  // Calculate remaining time
  const remianingTime = countDate - now;

  // Check if remaining time is negative
  if (remianingTime < 0) {
    return {
      remianingTime: 0,
      days: { firstDigit: 0, lastDigit: 0 },
      hours: { firstDigit: 0, lastDigit: 0 },
      minutes: { firstDigit: 0, lastDigit: 0 },
      seconds: { firstDigit: 0, lastDigit: 0 }
    };
  }

  // Calculate time in days, hours, minutes, and seconds
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const textDay = Math.floor(remianingTime / day);
  const textHour = Math.floor((remianingTime % day) / hour);
  const textMinute = Math.floor((remianingTime % hour) / minute);
  const textSecond = Math.floor((remianingTime % minute) / second);

  return {
    remianingTime,
    days: {
      firstDigit: parseInt(textDay / 10),
      lastDigit: parseInt(textDay % 10),
    },
    hours: {
      firstDigit: parseInt(textHour / 10),
      lastDigit: parseInt(textHour % 10),
    },
    minutes: {
      firstDigit: parseInt(textMinute / 10),
      lastDigit: parseInt(textMinute % 10),
    },
    seconds: {
      firstDigit: parseInt(textSecond / 10),
      lastDigit: parseInt(textSecond % 10),
    },
  };
}

$(document).ready(function () {
  $(".flip-clock").each(function (_, flipClock) {
    // Generate handles for each flip element and its child elements
    const daysFirst = createHandles($(flipClock).find(".days-first"));
    const daysLast = createHandles($(flipClock).find(".days-last"));
    const hoursFirst = createHandles($(flipClock).find(".hours-first"));
    const hoursLast = createHandles($(flipClock).find(".hours-last"));
    const minutesFirst = createHandles($(flipClock).find(".minutes-first"));
    const minutesLast = createHandles($(flipClock).find(".minutes-last"));
    const secondsFirst = createHandles($(flipClock).find(".seconds-first"));
    const secondsLast = createHandles($(flipClock).find(".seconds-last"));
    const initialTime = generateTimeInfo();
    setInitialValues(minutesFirst, initialTime.minutes.firstDigit);
    setInitialValues(minutesLast, initialTime.minutes.lastDigit);
    setInitialValues(secondsFirst, initialTime.seconds.firstDigit);
    setInitialValues(secondsLast, initialTime.seconds.lastDigit);
    setInitialValues(hoursFirst, initialTime.hours.firstDigit);
    setInitialValues(hoursLast, initialTime.hours.lastDigit);
    setInitialValues(daysFirst, initialTime.days.firstDigit);
    setInitialValues(daysLast, initialTime.days.lastDigit);

    const time = generateTimeInfo();
    updateTextLabels(time);

    setInterval(() => {
      const time = generateTimeInfo();
      if (time.remianingTime > 0) {
        flipDigit(secondsLast, time.seconds.lastDigit);
        flipDigit(secondsFirst, time.seconds.firstDigit);
        flipDigit(minutesLast, time.minutes.lastDigit);
        flipDigit(minutesFirst, time.minutes.firstDigit);
        flipDigit(hoursLast, time.hours.lastDigit);
        flipDigit(hoursFirst, time.hours.firstDigit);
      } else {
        setInitialValues(minutesFirst, "0");
        setInitialValues(minutesLast, "0");
        setInitialValues(secondsFirst, "0");
        setInitialValues(secondsLast, "0");
        setInitialValues(hoursFirst, "0");
        setInitialValues(hoursLast, "0");
        setInitialValues(daysFirst, "0");
        setInitialValues(daysLast, "0");
      }
    }, 1000);
  });

  function setInitialValues(flipElement, initialValue) {
    const {
      flipperTop,
      flipperBottom,
      flipperDisplayBottom,
      flipperDisplayTop,
      flipHiddenInput,
    } = flipElement;
    flipperTop.text(initialValue);
    flipperBottom.text(initialValue);
    flipperDisplayBottom.text(initialValue);
    flipperDisplayTop.text(initialValue);
    flipHiddenInput.val(initialValue);
  }

  function createHandles(flipElement) {
    const flipperTop = flipElement.find(".flipper-top");
    const flipperBottom = flipElement.find(".flipper-bottom");
    const flipperDisplayTop = flipElement.find(".flip-display-top");
    const flipperDisplayBottom = flipElement.find(".flip-display-bottom");
    const flipHiddenInput = flipElement.find("[type='hidden']");
    return {
      flipElement,
      flipperTop,
      flipperBottom,
      flipperDisplayBottom,
      flipperDisplayTop,
      flipHiddenInput,
    };
  }

  function flipDigit(flipHandles, digitValue) {
    const {
      flipElement,
      flipperTop,
      flipperBottom,
      flipperDisplayBottom,
      flipperDisplayTop,
      flipHiddenInput,
    } = flipHandles;

    const setPreviousValue = (value) => {
      flipperTop.text(value);
      flipperDisplayBottom.text(value);
    };
    const setAfterValue = (value) => {
      flipperDisplayTop.text(value);
      flipperBottom.text(value);
    };

    if (parseInt(flipHiddenInput.val()) !== digitValue) {
      setPreviousValue(flipHiddenInput.val());
      flipHiddenInput.val(digitValue).trigger("valueChanged");
    }

    flipHiddenInput.one("valueChanged", () => {
      setAfterValue(flipHiddenInput.val());
      flipElement.addClass("play");
    });

    flipperBottom.one("animationend", () => {
      setAfterValue(flipHiddenInput.val());
      setPreviousValue(flipHiddenInput.val());
      flipElement.removeClass("play");
    });

    updateTextLabels(generateTimeInfo());
  }

  function updateTextLabels(time) {
    if (time.minutes.firstDigit == 0 && time.minutes.lastDigit == 1) {
      document.querySelector(".minuteText").innerText = "Minute";
    } else {
      document.querySelector(".minuteText").innerText = "Minutes";
    }

    if (time.hours.firstDigit == 0 && time.hours.lastDigit == 1) {
      document.querySelector(".hourText").innerText = "Hour";
    } else {
      document.querySelector(".hourText").innerText = "Hours";
    }

    if (time.days.firstDigit == 0 && time.days.lastDigit == 1) {
      document.querySelector(".dayText").innerText = "Day";
    } else {
      document.querySelector(".dayText").innerText = "Days";
    }
  }
});
