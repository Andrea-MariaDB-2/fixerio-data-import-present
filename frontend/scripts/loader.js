function load() {
    let base = currencies[document.getElementById("select-currency-base").selectedIndex];
    let target = currencies[document.getElementById("select-currency-target").selectedIndex];

    let fromMonth = document.getElementById("select-from-month").selectedIndex;
    let fromDay = document.getElementById("select-from-day").selectedIndex + 1;
    let toMonth = document.getElementById("select-to-month").selectedIndex;
    let toDay = document.getElementById("select-to-day").selectedIndex + 1;

    let graph = document.getElementById("graph");

    let errorElConnection = document.getElementById("error-connection");
    let errorElData = document.getElementById("error-data");
    let errorElCurrency = document.getElementById("error-currency");
    let errorElDate = document.getElementById("error-date");
    errorElConnection.classList.add("hidden");
    errorElData.classList.add("hidden");
    errorElCurrency.classList.add("hidden");
    errorElDate.classList.add("hidden");

    if (!checkQueryData()) return;

    let qs = createQueryString();

    let url = "http://localhost:8081/" + qs;

    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open("GET", url, true);

    req.onload  = function() {
        let res = req.response;

        if (res === null || res === []) {
            showError(errorElData);
        }

        draw(res);
    };

    req.onerror = function() {
        showError(errorElConnection);
    };

    req.send(null);

    function showError(errorEl) {
        graph.classList.add("hidden");
        errorEl.classList.remove("hidden");
    }

    function checkQueryData() {
        let res = true;

        if (base === target) {
            showError(errorElCurrency);
            res = false;
        }

        if ((fromMonth > toMonth) || (fromMonth === toMonth && fromDay >= toDay)) {
            showError(errorElDate);
            res = false;
        }

        return res;
    }

    function createQueryString() {

        let from = new Date(Date.UTC(2017, fromMonth, fromDay));
        let to = new Date(Date.UTC(2017, toMonth, toDay));
        let fromIso = from.toISOString().split("T")[0];
        let toIso = to.toISOString().split("T")[0];

        return `?base=${base}&target=${target}&date_from=${fromIso}&date_to=${toIso}`;
    }
}
