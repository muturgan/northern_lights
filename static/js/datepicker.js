(() => {

let escListener;

const picker = {
  // (A) ATTACH DATEPICKER TO TARGET
  // target : datepicker will populate this field
  // container : datepicker will be generated in this container
  // startmon : start on Monday (default false)
  // disableday : array of days to disable, e.g. [2,7] to disable Tue and Sun
  attach : function (opt) {
    // (A1) CREATE NEW DATEPICKER
    const dp = document.createElement("div");
    dp.dataset.target = opt.target;
    dp.dataset.startmon = opt.startmon ? "1" : "0";
    dp.classList.add("picker");
    if (opt.disableday) {
      dp.dataset.disableday = JSON.stringify(opt.disableday);
    }

    // (A2) DEFAULT TO CURRENT MONTH + YEAR - NOTE: UTC+0!
    const today = new Date(),
        thisMonth = today.getUTCMonth(), // Note: Jan is 0
        thisYear = today.getUTCFullYear(),
        months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

    // (A3) MONTH SELECT
    let select = document.createElement("select");
    let option = null;
    select.classList.add("picker-m");
    for (let mth in months) {
      option = document.createElement("option");
      option.value = parseInt(mth) + 1;
      option.text = months[mth];
      select.appendChild(option);
    }
    select.selectedIndex = thisMonth;
    select.addEventListener("change", function(){ picker.draw(this); });
    dp.appendChild(select);

    // (A4) YEAR SELECT
    const yRange = 70; // Year range to show, I.E. from thisYear-yRange to thisYear+yRange
    select = document.createElement("select");
    select.classList.add("picker-y");
    for (let y = thisYear-yRange; y <= thisYear; y++) {
      option = document.createElement("option");
      option.value = y;
      option.text = y;
      select.appendChild(option);
    }
    select.selectedIndex = yRange;
    select.addEventListener("change", function(){ picker.draw(this); });
    dp.appendChild(select);

    // (A5) DAY SELECT
    const days = document.createElement("div");
    days.classList.add("picker-d");
    dp.appendChild(days);

    // (A6) ATTACH DATE PICKER TO TARGET CONTAINER + DRAW THE DATES
    picker.draw(select);

    // (A6-I) INLINE DATE PICKER
    if (opt.container) { document.getElementById(opt.container).appendChild(dp); }

    // (A6-P) POPUP DATE PICKER
    else {
      // (A6-P-1) MARK THIS AS A "POPUP"
      let uniqueID = 0;
      while (document.getElementById("picker-" + uniqueID) != null) {
        uniqueID = Math.floor(Math.random() * (100 - 2)) + 1;
      }
      dp.dataset.popup = "1";
      dp.dataset.dpid = uniqueID;

      // (A6-P-2) CREATE WRAPPER
      const wrapper = document.createElement("div");
      wrapper.id = "picker-" + uniqueID;
      wrapper.classList.add("picker-wrap");
      wrapper.appendChild(dp);

      escListener = (ev) => {
        if (ev.keyCode === 27 || ev.key === 'Escape' || ev.code === 'Escape') {
          wrapper.classList.remove("show");
        }
      };

      // (A6-P-3) ATTACH ONCLICK TO SHOW/HIDE DATEPICKER
      const target = document.getElementById(opt.target);
      target.dataset.dp = uniqueID;
      target.readOnly = true; // Prevent onscreen keyboar on mobile devices
      target.onfocus = function () {
        wrapper.classList.add("show");
        addEventListener('keydown', escListener);
      };
      wrapper.addEventListener("click", function (evt) {
        if (evt.target.classList.contains("picker-wrap")) {
          this.classList.remove("show");
          removeEventListener('keydown', escListener);
        }
      });

      // (A6-P-4) ATTACH POPUP DATEPICKER TO DOCUMENT
      document.body.appendChild(wrapper);
    }
  },


  // (B) DRAW THE DAYS IN MONTH
  // el : HTML reference to either year or month selector
  draw : function (el) {
    // (B1) GET DATE PICKER COMPONENTS
    const parent = el.parentElement,
        year = parent.getElementsByClassName("picker-y")[0].value,
        month = parent.getElementsByClassName("picker-m")[0].value,
        days = parent.getElementsByClassName("picker-d")[0];

    // (B2) DATE RANGE CALCULATION - NOTE: UTC+0!
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    let startDay = new Date(Date.UTC(year, month-1, 1)).getUTCDay(); // Note: Sun = 0
    let endDay = new Date(Date.UTC(year, month-1, daysInMonth)).getUTCDay();
    startDay = startDay==0 ? 7 : startDay;
    endDay = endDay==0 ? 7 : endDay;

    // (B3) GENERATE DATE SQUARES (IN ARRAY FIRST)
    const squares = [];
    const disableday = parent.dataset.disableday
      ? JSON.parse(parent.dataset.disableday)
      : [];

    const DISABLED_DAY = null;

    // (B4) EMPTY SQUARES BEFORE FIRST DAY OF MONTH
    if (parent.dataset.startmon=="1" && startDay!=1) {
      for (let i=1; i<startDay; i++) { squares.push(DISABLED_DAY); }
    }
    if (parent.dataset.startmon=="0" && startDay!=7) {
      for (let i=0; i<startDay; i++) { squares.push(DISABLED_DAY); }
    }

    // (B5) DAYS OF MONTH
    // (B5-2) SOME DAYS DISABLED
    const today = new Date(),
      thisMonth = today.getUTCMonth(), // Note: Jan is 0
      thisYear = today.getUTCFullYear(),
      todayDay = today.getUTCDate();

    let thisday = startDay;
    for (let i=1; i<=daysInMonth; i++) {
      // CHECK IF DAY IS DISABLED
      const disabled = disableday.includes(thisday) || (Number(year) === thisYear && Number(month) === thisMonth+1 && i > todayDay);
      // DAY OF MONTH, DISABLED
      squares.push([i, disabled]); 
      // NEXT DAY
      thisday++;
      if (thisday==8) { thisday = 1; }
    }

    // (B6) EMPTY SQUARES AFTER LAST DAY OF MONTH
    if (parent.dataset.startmon=="1" && endDay!=7) {
      for (let i=endDay; i<7; i++) { squares.push(DISABLED_DAY); }
    }
    if (parent.dataset.startmon=="0" && endDay!=6) {
      for (let i=endDay; i<(endDay==7?13:6); i++) { squares.push(DISABLED_DAY); }
    }

    // (B7) DRAW HTML
    const daynames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    if (parent.dataset.startmon=="1") { daynames.push("Вс"); }
    else { daynames.unshift("Вс"); }

    // (B7-1) HTML DATE HEADER
    const table = document.createElement("table");
    let row = table.insertRow();
    let cell = null;
    row.classList.add("picker-d-h");
    for (let d of daynames) {
      cell = row.insertCell();
      cell.innerHTML = d;
    }

    // (B7-2) HTML DATE CELLS
    const total = squares.length;
    row = table.insertRow();
    const todayDate = thisMonth+1 === Number(month) && thisYear === Number(year)
      ? todayDay
      : null;
    for (let i=0; i<total; i++) {
      if (i!=total && i%7==0) { row = table.insertRow(); }
      cell = row.insertCell();
      if (squares[i] == DISABLED_DAY) { 
        cell.classList.add("picker-d-b"); 
      } else { 
        cell.innerHTML = squares[i][0]; 
        // NOT ALLOWED TO CHOOSE THIS DAY
        if (squares[i][1]) {
          cell.classList.add("picker-d-dd");
        }
        // ALLOWED TO CHOOSE THIS DAY
        else {
          if (i == todayDate) { cell.classList.add("picker-d-td"); }
          cell.classList.add("picker-d-d");
          cell.addEventListener("click", function(){ picker.pick(this); });
        }
      }
    }

    // (B7-3) ATTACH NEW CALENDAR TO DATEPICKER
    days.innerHTML = "";
    days.appendChild(table);
  },

  // (C) CHOOSE A DATE
  // el : HTML reference to selected date cell
  pick : function (el) {
    // (C1) GET ALL COMPONENTS
    let parent = el.parentElement;
    while (!parent.classList.contains("picker")) {
      parent = parent.parentElement;
    }

    // (C2) GET FULL SELECTED YEAR MONTH DAY
    const year = parent.getElementsByClassName("picker-y")[0].value,
        month = parent.getElementsByClassName("picker-m")[0].value,
        day = el.innerHTML;

    // YYYY-MM-DD FORMAT - CHANGE FORMAT HERE IF YOU WANT !
    if (parseInt(month)<10) { month = "0" + month; }
    if (parseInt(day)<10) { day = "0" + day; }
    const fullDate = year + "-" + month + "-" + day;

    // (C3) UPDATE SELECTED DATE
    document.getElementById(parent.dataset.target).value = fullDate;

    // (C4) POPUP ONLY - CLOSE THE POPUP
    if (parent.dataset.popup == "1") {
      document.getElementById("picker-" + parent.dataset.dpid).classList.remove("show");
      removeEventListener('keydown', escListener);
    }
  }
};

window.addEventListener("load", function(){
  picker.attach({
    target: "promo-input-birthdate",
    startmon: true, // WEEK START ON MON
  });
});

})();