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
            }
        },
        methods: {
            GetCurrentTime: function () {
                var url = "http://localhost:56253/api/currenttime";
                this.RequestData(url, this.SetCurrentTimeRequest);
            },
            SetCurrentTimeRequest: function (resp) {
                this.currentTimeRequest = JSON.parse(resp);
            },
            GetAllData: function () {
                var url = "http://localhost:56253/api/clockworkdata";
                this.RequestData(url, this.SetAllDataEntries);
            },
            SetAllDataEntries: function (resp) {
                this.allDataEntries = JSON.parse(resp);
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
            RequestData: function (url, cb) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        cb(this.responseText);
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send();
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