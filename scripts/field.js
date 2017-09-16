function field(newtext) {
    this.text = newtext;
    this.description;
    this.width;
    this.height = 20;
    this.childs = [];
    this.childCount = 0;
    this.x = 0;
    this.y = 0;
}

field.prototype.show = function (level, fieldIndex) {

    if (fieldIndex === undefined) {
        return 0;
    }

    var text = draw.text(this.text).center(this.x, this.y);
    text.attr({
        'size': '16',
        'fill': '#c6c6c6'
    });

    this.width = text.length() + 4;

    var rect = draw.rect(this.width, this.height).center(this.x, this.y);
    rect.attr({
        'fill': '#2d2d2d',
        'stroke': '#000',
        'stroke-width': '1'
    });
    rect.radius(2);
    rect.back();

    text.on('mouseover', function () {
        text.animate(100, '<').fill('#00ff00');
        rect.animate(100, '<').fill('#ff0000');
    });
    text.on('mouseout', function () {
        text.animate(100, '<').fill('#cccccc');
        rect.animate(100, '<').fill('#2d2d2d');
    });
    for (var i = 0; i < this.childs.length; i++) {
        this.childs[i].y = this.y + 100;
        this.childs[i].x = width / (levels[level].length * 2 + 1) * (i + fieldIndex + 1);

       var path = draw.path('M' + this.x + ' ' + (this.y + this.height / 2) + ' C' + this.x + ' ' + (((this.childs[i].y - this.y) * 0.75) + this.y + this.height / 2) + ' ' + this.childs[i].x + ' ' + (((this.childs[i].y - this.y) * 0.25) + this.y + this.height / 2) + ' ' + this.childs[i].x + ' ' + (this.childs[i].y - this.childs[i].height / 2));
        //                 |point| para x |            para y              |||bzir c| para x1  |                             para y1                                     |        para x2         |                               para y2                                   |       punkt x2         |                   punkt y2                        |
        path.attr({
            'fill': 'none',
            'stroke-width': '2'
        })
    }

};

field.prototype.addChild = function (child) {
    this.childCount++;
    this.childs.push(child);
};

field.prototype.getLayerCount = function () {
    if (this.addChild == 0) {
        return 1;
    } else {
        var temp = 0;
        var a = this.childs;
        a.forEach(function (field) {
            if (temp < field.getLayerCount()) {
                temp = field.getLayerCount();
            }
        });
        return temp + 1;
    }
}

field.prototype.catalogLevels = function (level) {
    levels[level].push(this);
    for (var i = 0; i < this.childCount; i++) {
        this.childs[i].catalogLevels(level + 1);
    }
}