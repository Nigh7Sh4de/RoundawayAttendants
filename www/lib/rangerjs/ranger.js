
var ranger = function(arr, type) {
    this.ranges = arr || [];
    if (type) this.ranges = this.ranges.map(function(range) {
        return {
            start: new type(range.start),
            end: new type(range.end)
        }
    })
}

ranger.Range = function(Type) {
    return {
        start: Type,
        end: Type
    }
}

var endBeforeStart = function(start, end) {
    if (start - end > 0)
        return true;
    return false;
}

ranger.prototype = {
    nextRange: function(now) {
        for (var i=0; i < this.ranges.length; i++)
            if (now < this.ranges[i].end)
                return this.ranges[i];
    },
    removeRecuringRange: function(start, end, interval, count, finish) {
        var _start = Number(start),
            _end = Number(end),
            _finish = Number(finish),
            _interval = Number(interval),
            type = start.constructor;
        if (endBeforeStart(start, end))
            return new Error('Start must be before end for range.');
        if (interval < end - start)
            return new Error('Interval must be greater than duration of each range.');
        if ((count == null || count < 0) && finish == null)
            return new Error('Recuring range must specify total count or limit.');
        count = count < 1 || !count ? parseInt((_finish - _start) / _interval) : count;
        if (count <= 0)
            return new Error('Recuring interval must be greater than 0.');
        for (var i=0; i < count; i++)
            this.removeRange(new type(_start + i*_interval), 
                          new type(_end + i*_interval));
    },
    
    addRecuringRange: function(start, end, interval, count, finish) {
        var _start = Number(start),
            _end = Number(end),
            _finish = Number(finish),
            _interval = Number(interval),
            type = start.constructor;
        if (endBeforeStart(start, end))
            return new Error('Start must be before end for range.');
        if (interval < end - start)
            return new Error('Interval must be greater than duration of each range.');
        if ((count == null || count < 0) && finish == null)
            return new Error('Recuring range must specify total count or limit.');
        count = count < 1 || !count ? parseInt((_finish - _start) / _interval) : count;
        if (count <= 0)
            return new Error('Recuring interval must be greater than 0.');
        for (var i=0; i < count; i++)
            this.addRange(new type(_start + i*_interval), 
                          new type(_end + i*_interval));
    },
    
    addRange: function(start, end) {
        if (endBeforeStart(start, end))
            return new Error('Start must be before end for range');
        var index = null,
            count = 0;
        for (var i=0; i < this.ranges.length; i++) {
            var range = this.ranges[i];
            if (range.start > end) {
                break;
            }
            else if (range.end >= start) {
                if (range.start <= start &&
                    range.end >= end) {
                    return;
                }
                else if (range.start >= start &&
                         range.end < end) {
                    if (index === null) index = i;
                    count++;
                }
                else if (range.start < start &&
                         range.end <= end) {
                    if (index === null) index = i;
                    count++;
                    start = range.start;
                }
                else if (range.start >= start &&
                         range.end >= end) {
                    if (index === null) index = i;
                    count++;
                    end = range.end;
                    break;;
                }
            }
        }
        index = index === null ? this.ranges.length : index;
        this.ranges.splice(index, count, {start: start, end: end});
    },
    
    check: function(val) {
        for (var i = 0; i < this.ranges.length; i++) {
            var range = this.ranges[i];
            var min = range.start;
            var max = range.end;
            if (min <= val && val < max)
                return true;
            if (min > val)
                return false;
        }
        return false;
    },
    
    checkRange: function(start, end) {
        if (endBeforeStart(start, end))
            return new Error('Start must be before end for range');
        for (var i=0; i < this.ranges.length; i++) {
            var range = this.ranges[i];
            if (range.start <= start &&
                range.end >= end)
                return true;
        }
        return false;
    },
    
    removeRange: function(start, end) {
        if (endBeforeStart(start, end))
            return new Error('Start must be before end for range');
        for (var i=0; i < this.ranges.length; i++) {
            var range = this.ranges[i];
            if (range.end >= start) {
                if (range.start >= end)
                    return;
                else if (range.start < start &&
                         range.end > end) {
                    this.ranges.splice(i+1, 0, {
                        start: end,
                        end: range.end
                    })
                    range.end = start;
                    return;
                }
                else if (range.start >= start &&
                         range.end <= end) {
                    this.ranges.splice(i--, 1);
                }
                else if (range.start < start &&
                         range.end <= end) {
                    range.end = start;
                }
                else if (range.start >= start &&
                         range.end > end) {
                    range.start = end;
                }
            }
        }
    }
}

// module.exports = ranger;

window.ranger = ranger;