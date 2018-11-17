window.onload = function () {

    var app = new Vue({
        el: '#app',
        data: {
            targetZone: moment.tz.guess(),
            timezones: moment.tz.names(),
            currentTimeRequest: {},
            allDataEntries: [],
            allDataEntriesLocalized: [],
            isDisplayLocalized: false,
        },
        watch: {
            currentTimeRequest: function () {
                this.allDataEntries.push(this.currentTimeRequest);
                this.isDisplayLocalized = false;
            },
        },
        computed: {
            displayData: function () {
                return (this.isDisplayLocalized ? this.allDataEntriesLocalized : this.allDataEntries);
            },
            toggleMessage: function () {
                return (this.isDisplayLocalized ? "View Server Time" : "View Local Time");
            },
        },
        methods: {
            GetCurrentTime: function () {
                var url = "http://localhost:56253/api/currenttime";
                var _this = this;
                this.RequestData(url).then(function (resp) {
                    _this.currentTimeRequest = JSON.parse(resp);
                });
            },
            GetAllData: function () {
                var url = "http://localhost:56253/api/clockworkdata";
                var _this = this;
                this.RequestData(url).then(function (resp) {
                    _this.allDataEntries = JSON.parse(resp);
                });
            },
            ToggleDisplayData: function () {
                this.isDisplayLocalized = !this.isDisplayLocalized;
                if (this.isDisplayLocalized) {
                    this.RecordTimeZone("http://localhost:56253/api/timezone", this.targetZone);
                    this.UpdateToLocalizedTime();
                }
            },
            UpdateToLocalizedTime: function () {
                this.allDataEntriesLocalized = [];
                var clone = _.map(this.allDataEntries, _.clone);
                for (i = 0; i < clone.length; i++) {
                    var entry = clone[i];
                    entry.time = moment(entry.time).tz(this.targetZone).format('MMMM Do YYYY, h:mm:ss a');
                    this.allDataEntriesLocalized.push(entry);
                };
            },
            RequestData: function (url) {
                return Q.Promise(function (resolve, reject, notify) {
                    var xhttp = new XMLHttpRequest();

                    xhttp.open("GET", url, true);
                    xhttp.setRequestHeader("Content-type", "application/json");
                    xhttp.onload = onload;
                    xhttp.onerror = onerror;
                    xhttp.onprogress = onprogress;
                    xhttp.send();

                    function onload() {
                        if (xhttp.status === 200) {
                            resolve(xhttp.responseText);
                        } else {
                            reject(new Error("Status code was " + xhttp.status));
                        }
                    }

                    function onerror() {
                        reject(new Error("Can't XHR " + JSON.stringify(url)));
                    }

                    function onprogress(event) {
                        notify(event.loaded / event.total);
                    }
                });
            },
            RecordTimeZone: function (url, timezone) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log("timezone save successful");
                    }
                };
                xhttp.open("GET", url + "?selectedTimeZone=" + timezone, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send();
            },
        }
    });

    app.GetAllData();
    
};