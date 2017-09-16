var width = document.getElementById('organigram').offsetWidth;
var height = document.getElementById('organigram').offsetHeight;
var draw = SVG('organigram').size(Math.max(width, 100), Math.max(height, 100));
var fields = {};
var levels = [];
var json; 
var start;


function show() {
    start.x = width / 2;
    start.y = start.height / 2;
    start.show(0);
    for (var i = 0; i < levels.length; i++) {
        var currentLevel = levels[i];
        for (var j = 0; j < currentLevel.length; j++) {
            currentLevel[j].show(i, 2 * j);
        }
    }
}

function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}


loadJSON('assets/fields.json',
    function (json) {

        //get fields from json
        for (var index = 0; index < json.fields.length; index++) {
            var text = json.fields[index].text;
            fields[text] = new field(text);
            fields[text].description = json.fields[index].description;
        }

        //map childs
        for (var index = 0; index < json.fields.length; index++) {
            var text = json.fields[index].text;
            for (var jndex = 0; jndex < json.fields[index].children.length; jndex++) {
                var nameNewChild = json.fields[index].children[jndex];
                var newChild = fields[nameNewChild];
                fields[text].addChild(newChild);
            }
            if (json.fields[index].start == true) {
                start = fields[text];
            }
        }

        //initialize levels
        for (var i = 0; i < start.getLayerCount(); i++) {
            levels[i] = [];
        }

        start.catalogLevels(0);

        show();
    },
    function (xhr) { console.error(xhr); }
);

