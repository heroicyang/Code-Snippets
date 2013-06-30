if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
        function F() {};
        F.prototype = obj;
        return new F();
    }
}

Math.guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return r.toString(16);
  }).toUpperCase();
};

var Model = {
    inherited: function () {},
    created: function () {
        this.records = {};
    },

    prototype: {
        init: function () {}
    },

    create: function () {
        var obj = Object.create(this);
        obj.parent = this;
        obj.prototype = obj.fn = Object.create(this.prototype);

        obj.created();
        this.inherited(obj);
        return obj;
    },

    init: function () {
        var instance = Object.create(this.prototype);
        instance.parent = this;
        instance.init.apply(instance, arguments);
        return instance;
    },
    
    extend: function (options) {
        var extended = options.extended;
        jQuery.extend(this, options);
        extended && extended(this);
    },
    include: function (options) {
        var included = options.included;
        jQuery.extend(this.prototype, options);
        included && included(this);
    }
};

Model.extend({
    find: function (id) {
        var record = this.records[id];
        if (!record){
            throw('Unknown record'); 
        }
        return record.dup();
    }
});

Model.include({
    isNew: true,
    create: function () {
        if (!this.id) {
            this.id = Math.guid();
        }
        this.isNew = false;
        this.parent.records[this.id] = this.dup();
    },
    update: function () {
        this.parent.records[this.id] = this.dup();
    },
    save: function () {
        if (this.isNew) {
            this.create();
        }
    },
    dup: function () {
        return jQuery.extend(true, {}, this);
    }
});

var User = Model.create();
var user = User.init();
user.create();
console.log(User.find(user.id));
