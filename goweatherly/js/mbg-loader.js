



var member_list_view = Backbone.View.extend({
    el : $('#members'),
    initialize : function() {

    },

    events: {
        "click #back" : "goForward",
        "click #next" : "goBack"
    },

    goForward:function(e){
        console.log("go back")
    },


    render: function() {
        var counter = 0

        /* This is close */
        var c = new counter_model({Id: 1, Begin: 0, Total: this.collection.length});
        this.$el.append(new counter_view({model : c} ).render().el);
		
		var s = new sort_model({Id: 1, Begin: 0, Total: this.collection.length});
        this.$el.append(new sort_view({model : s} ).render().el);

        _.each(this.collection.models, function(data) {
		counter = counter + 1
		
		if (counter < 9) {
			this.$el.append(new member_view({model : data}).render().el);

            }
				
		if (counter == 8) {
			c.set({'Begin' : '8'});
            console.log(data.attributes.Id);

            }
            
        }, this);

        var d = new pagination_model({Id: 1, Begin: 0, Total: this.collection.length});
        this.$el.append(new pagination_view({model : d} ).render().el);

        return this;
    }
});




var pagination_view = Backbone.View.extend({
    template : _.template($("#pagination-template").html()),
    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var counter_view = Backbone.View.extend({
    template : _.template($("#counter-template").html()),
    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var sort_view = Backbone.View.extend({
    template : _.template($("#sort-template").html()),
    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var member_view = Backbone.View.extend({
    template : _.template($("#member-template").html()),
    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});




var pagination_model = Backbone.Model.extend({
    idAttribute: 'Id'
});

var members = Backbone.Model.extend({
    idAttribute: 'Id'
});

var counter_model = Backbone.Model.extend({
    idAttribute: 'Id'
});

var sort_model = Backbone.Model.extend({
    idAttribute: 'Id'
});



var member_collection = Backbone.Collection.extend({
    model : members,
    url: 'services.json'
});



mc = new member_collection();

mc.fetch({success: function(){var view = new member_list_view({collection: mc}).render();}});




