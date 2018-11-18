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
                this.MakeRequest(url).then(function (resp) {
                    _this.currentTimeRequest = JSON.parse(resp);
                });
            },
            GetAllData: function () {
                var url = "http://localhost:56253/api/clockworkdata";
                var _this = this;
                this.MakeRequest(url).then(function (resp) {
                    _this.allDataEntries = JSON.parse(resp);
                });
            },
            ToggleDisplayData: function () {
                this.isDisplayLocalized = !this.isDisplayLocalized;

                if (this.isDisplayLocalized) {
                    var url = "http://localhost:56253/api/timezone" + "?selectedTimeZone=" + this.targetZone;

                    this.MakeRequest(url);
                    
                    this.allDataEntriesLocalized = [];
                    this.allDataEntriesLocalized = _.map(this.UpdateToLocalizedTime(this.allDataEntries), _.clone);
                }
            },
            UpdateToLocalizedTime: function (dataArray) {
                var clone = _.map(dataArray, _.clone);

                for (i = 0; i < clone.length; i++) {
                    var entry = clone[i];
                    entry.time = moment(entry.time).tz(this.targetZone).format('MMMM Do YYYY, h:mm:ss a');
                };
                return clone;
            },
            MakeRequest: function (url) {
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
        }
    });

    app.GetAllData();

};