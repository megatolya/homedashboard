function createDiv(className) {
    const div = document.createElement('div');
    return $(div).addClass(className);
}

const UPDATE_TIME_TIMEOUT = 50;
const UPDATE_TRAFFIC_TIMEOUT = 1000;

function getNounPluralForm(a) {
    if (a % 10 === 1 && a % 100 !== 11) {
        return 0;
    } else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) {
        return 1;
    } else {
        return 2;
    }
}

function updateTraffic(element) {
    setTimeout(updateTraffic, UPDATE_TRAFFIC_TIMEOUT, element);

    fetch('/traffic')
        .then(res => res.json())
        .then(data => {
            if ('traffic' in data) {
                const pluralForm = getNounPluralForm(data.traffic);
                const forms = ['балл', 'балла', 'баллов'];
                element.html(`${data.traffic} ${forms[pluralForm]}`);
            } else {
                console.error('bad response', data);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function updateTime(timeElement) {
    setTimeout(updateTime, UPDATE_TIME_TIMEOUT, timeElement);

    const time = new Date();
    const minutes = time.getMinutes();
    const str = `${time.getHours()}:${minutes >= 10 ? minutes : '0' + minutes}`;
    if (timeElement.html() !== str) {
        timeElement.html(str);
    }
}


$(function () {
    const container = $('.data-container');
    const time = createDiv('time');

    container.append(time);

    updateTime(time);
});

setTimeout(() => window.location.reload(), 1000 * 60 * 60);
