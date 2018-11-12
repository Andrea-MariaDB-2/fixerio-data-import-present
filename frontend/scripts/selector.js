let currencies = [
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF',
    'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTC', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY',
    'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP',
    'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS',
    'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD',
    'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT',
    'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB',
    'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK',
    'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD',
    'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XCD', 'XDR',
    'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZMW', 'ZWL'];
let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

function generateCurrencySelect(id, defaultVal){
    let select = document.getElementById("select-currency-" + id);
    generateOptions(select, currencies);
    select.options.selectedIndex = currencies.indexOf(defaultVal);
}

function generateDateSelect(id, defaultMonth, defaultDay) {
    let selectMonth = document.getElementById("select-" + id + "-month");
    let selectDay = document.getElementById("select-" + id + "-day");

    generateOptions(selectMonth, months);

    selectMonth.onchange = function() {
        let month = selectMonth.selectedIndex + 1;
        generateOptions(selectDay, getDaysInMonth(month, 2017), true);
        selectDay.options.selectedIndex = 0;
    };

    selectMonth.options.selectedIndex = defaultMonth-1;
    selectMonth.onchange();
    selectDay.options.selectedIndex = defaultDay-1;

    function getDaysInMonth(month, year) {
        let count =  new Date(Date.UTC(year, month, 0)).getDate();
        let days = [];
        for (let i = 1; i <= count; i++) days.push(i);
        return days;
    }
}

function generateOptions(select, opts, clear=false) {
    if (clear) {
        let optionsLength = select.options.length;
        for (let i = 0; i < optionsLength; i++) {
            select.remove(0);
        }
    }

    for (let i = 0; i < opts.length; i++) {
        let opt = opts[i];
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

function swapCurrencies() {
    let selectBase = document.getElementById("select-currency-base");
    let selectTarget = document.getElementById("select-currency-target");

    let base = selectBase.options.selectedIndex;
    selectBase.options.selectedIndex = selectTarget.options.selectedIndex;
    selectTarget.options.selectedIndex = base;

    if (!document.getElementById("graph").classList.contains("hidden")) load(); // if the graph was already created
}
