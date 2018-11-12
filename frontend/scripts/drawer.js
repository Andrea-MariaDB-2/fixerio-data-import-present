function draw(data) {
    let canvas = document.getElementById("graph");

    let inputBaseAmount = document.getElementById("input-currency-base");
    let baseAmount = Number(inputBaseAmount.value);
    if (isNaN(baseAmount) || baseAmount <= 0) {
        baseAmount = 1;
        inputBaseAmount.value = baseAmount;
    }

    // canvas width="950" height="220"
    let paddingOut = 100; // used on every side except top
    let paddingIn = paddingOut + 10; // 110
    let graphWidth = canvas.width - paddingIn * 2; // 730
    let graphHeight = canvas.height - paddingIn - 10; // 100

    let rates = [];
    let xLabels = {};
    processData();
    let max = Math.max(...rates);
    let min = Math.min(...rates);
    let xStep = graphWidth / (data.length - 1);

    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "12px monospace";

        drawAxises(ctx);
        drawGraph(ctx);
        drawXLabels(ctx);
        drawYLabels(ctx);
        drawMaxMin(ctx);
    }

    canvas.classList.remove("hidden");

    function processData() {
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            let rate = d["target"] / d["base"] * baseAmount;
            processDataDates(d["date"], i);
            rates.push(rate);
        }
    }

    function processDataDates(date, i) {
        let splited = date.split("-");
        let day = splited[2];
        if (day === "01") {
            xLabels[i] = months[Number(splited[1]) - 1];
        }
    }

    function getX(i) {
        return paddingIn + (xStep * i);
    }

    function getY(rate) {
        let rangeRelative = graphHeight / (max - min);
        return canvas.height - (((rate - min) * rangeRelative) + paddingIn);
    }

    function drawAxises(ctx) {
        ctx.beginPath();
        ctx.moveTo(paddingOut, 0);
        ctx.lineTo(paddingOut, canvas.height - paddingOut);
        ctx.lineTo(canvas.width - paddingOut, canvas.height - paddingOut);
        ctx.stroke();
    }

    function drawGraph(ctx) {
        let x = paddingIn;
        let y = getY(rates[0]);

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let i = 1; i < data.length; i++) {
            x += xStep;
            y = getY(rates[i]);
            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }

    function drawXLabels(ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "hanging";

        Object.keys(xLabels).forEach(function (key) {
            let x = getX(key);
            let y = canvas.height - paddingOut;

            ctx.fillText(xLabels[key], x, y + 5);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - 5);
            ctx.stroke();

        });
    }

    function drawYLabels(ctx) {
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        let range = max - min;
        let ylMin;
        let position = 0;

        if (range === 0 ) return;
        else if (range < 1000) {
            let r = range;
            while (r < 1000) {
                r *= 10;
                position++;
            }
            position--;
            ylMin = min + Math.pow(0.1, position);
        }
        else {
            let r = range;
            while (r > 1000) {
                r /= 10;
                position++;
            }
            ylMin = min + Math.pow(10, position);
        }

        let unit = Math.pow(10, position);

        let ylStepCount = 5;
        let ylStep = (max - ylMin) / (ylStepCount-1);

        for (let i = 0; i < ylStepCount; i++) {
            let label = (ylMin + (ylStep * i));

            if (range < 1000) label = Math.trunc(label * unit) / unit;
            else label = Math.trunc(label / unit) * unit;

            let y = getY(label);
            ctx.fillText(label, paddingOut - 5, y);

            ctx.beginPath();
            ctx.moveTo(paddingOut, y);
            ctx.lineTo(paddingOut + 5, y);
            ctx.stroke();
        }
    }

    function drawMaxMin(ctx) {
        let iMax = rates.indexOf(max);
        let iMin = rates.indexOf(min);

        drawDot(ctx, getX(iMax), getY(max), "green");
        drawDot(ctx, getX(iMin), getY(min), "red");

        let y = canvas.height - paddingOut + 50;
        let labelMax = `Max ${data[iMax]["date"]}: ${rates[iMax]}`;
        drawMaxMinLabel(ctx, paddingOut, y, labelMax, "green");

        let labelMin = `Min ${data[iMin]["date"]}: ${rates[iMin]}`;
        drawMaxMinLabel(ctx, paddingOut, y + 20, labelMin, "red")

    }

    function drawMaxMinLabel(ctx, x, y, label, color) {
        drawDot(ctx, paddingOut, y, color);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(label, x + 10, y);
    }

    function drawDot(ctx, x, y, color) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2, true);
        ctx.fillStyle = color;
        ctx.fill();
    }
}
