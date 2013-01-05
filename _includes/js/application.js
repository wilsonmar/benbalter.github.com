(function(){var t,e={}.hasOwnProperty,n=function(t,n){function o(){this.constructor=t}for(var i in n)e.call(n,i)&&(t[i]=n[i]);return o.prototype=n.prototype,t.prototype=new o,t.__super__=n.prototype,t},o=function(t,e){return function(){return t.apply(e,arguments)}};window.Application={Models:{},Collections:{},Views:{},router:{},url:"{{ site.url }}",name:"{{ site.name }}",disqus:{name:"{{ site.disqus.shortname }}",api_key:"{{ site.disqus.api_key }}",count:"{{ site.disqus.count }}"},twitter:{count:"{{ site.twitter.count }}",username:"{{ site.twitter.username }}"}},Application.Models.Post=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.url=function(){return Application.url+"/"+this.id+".json"},e.prototype.defaults={author:"Benjamin J. Balter",title:"",url:"",content:"",tags:[],category:"",date:""},e}(Backbone.Model),Application.Models.Page=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.url=function(){return Application.url+"/"+this.id+".json"},e}(Backbone.Model),Application.Models.Thread=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.url=function(){var t;return t="https://disqus.com/api/3.0/threads/details.json?",t+="thread="+this.id,t+="&api_key="+Application.disqus.api_key,t+="&callback=?"},e.prototype.parse=function(t){return t.response},e}(Backbone.Model),Application.Models.Comment=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.initialize=function(){var t=this;return this.set("thread",new Application.Models.Thread({id:this.get("thread")})),this.get("thread").fetch({success:function(){return t.collection.trigger("change")}})},e}(Backbone.Model),Application.Models.Tweet=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e}(Backbone.Model),Application.Collections.Comments=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.model=Application.Models.Comment,e.prototype.url=function(){var t;return t="https://disqus.com/api/3.0/posts/list.json?",t+="forum="+Application.disqus.name,t+="&limit="+Application.disqus.count,t+="&api_key="+Application.disqus.api_key,t+="&callback=?"},e.prototype.parse=function(t){return t.response},e}(Backbone.Collection),Application.Collections.Tweets=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.model=Application.Models.Tweet,e.prototype.url=function(){var t;return t="https://api.twitter.com/1/statuses/user_timeline.json?include_rts=true",t+="&screen_name="+Application.twitter.username,t+="&count="+Application.twitter.count,t+="&callback=?"},e}(Backbone.Collection),Application.Collections.Posts=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.model=Application.Models.Post,e.prototype.url=function(){return Application.url+"/"+"posts.json"},e.prototype.comparator=function(t,e){var n;return t=t.get("date"),e=e.get("date"),t===e?n=1:t>e?n=-1:e>t&&(n=1),n},e}(Backbone.Collection),Application.Collections.Pages=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.model=Application.Models.Page,e.prototype.url=function(){return Application.url+"/"+"pages.json"},e}(Backbone.Collection),Application.Views.Post=function(t){function e(){return this.render=o(this.render,this),e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.el="#main",e.prototype.tagName="article",e.prototype["class"]="post",e.prototype.template=JST.post,e.prototype.render=function(){return this.$el.append(this.template(this.model.toJSON())),this.model.get("comments")?this.loadDisqus():void 0},e.prototype.loadDisqus=function(){var t;return window.disqus_shortname=Application.disqus.name,window.disqus_identifier=this.model.get("id"),window.disqus_url=Application.url+"/"+this.model.get("id"),window.disqus_title=this.model.get("title")+" » "+Application.name,"undefined"!=typeof DISQUS&&null!==DISQUS?DISQUS.reset({reload:!0,config:function(){return this.page.identifier=disqus_identifier,this.page.url=disqus_url,this.page.title=disqus_title}}):(t=document.createElement("script"),t.type="text/javascript",t.async=!0,t.src="http://"+disqus_shortname+".disqus.com/embed.js",(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(t))},e}(Backbone.View),Application.Views.PostExcerpt=function(t){function e(){return this.render=o(this.render,this),e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.el=".posts",e.prototype.tagName="article",e.prototype["class"]="post",e.prototype.template=JST.post_excerpt,e.prototype.initialize=function(){return this.model.on("change",this.render)},e.prototype.render=function(){var t;return t=this.getExcerpted(),this.$el.append(this.template(t.toJSON()))},e.prototype.getExcerpted=function(){var t;return t=this.model.clone(),t.set("content",this.model.get("content").split("<!-- more -->")[0]),t},e}(Backbone.View),Application.Views.Page=function(t){function e(){return this.render=o(this.render,this),e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.el="#main",e.prototype.tagName="article",e.prototype["class"]="page",e.prototype.template=JST.page,e.prototype.render=function(){return this.$el.html(this.template(this.model.toJSON())),"undefined"!=typeof DISQUS&&null!==DISQUS?DISQUS.reset():void 0},e}(Backbone.View),Application.Views.Single=function(t){function e(){return this.render=o(this.render,this),e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.el="#content",e.prototype.template=JST.single_layout,e.prototype.initialize=function(){return this.model.on("change",this.render)},e.prototype.render=function(){var t;return this.$el.html(this.template(this.model.toJSON())),"post"===this.model.get("layout")?t=new Application.Views.Post({model:this.model}):"page"===this.model.get("layout")&&(t=new Application.Views.Page({model:this.model})),document.title=this.model.get("title")+" » "+Application.name,t.render()},e}(Backbone.View),Application.Views.Index=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.el="#content",e.prototype.template=$("#index_layout").html(),e.prototype.render=function(){var t,e,n;return this.$el.html(this.template),this.collection.sort(),this.collection.slice(0,10).forEach(function(t){var e;return t.fetch(),e=new Application.Views.PostExcerpt({model:t})}),t=new Application.Collections.Comments,n=new Application.Views.CommentView({collection:t}),t.fetch(),e=new Application.Collections.Tweets,n=new Application.Views.TweetView({collection:e}),e.fetch()},e}(Backbone.View),Application.Views.CommentView=function(t){function e(){return this.render=o(this.render,this),this.initialize=o(this.initialize,this),e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.el="#recentcomments",e.prototype.template=JST.recent_comments,e.prototype.initialize=function(){return this.collection.on("change",this.render)},e.prototype.render=function(){return this.$el.html(this.template({comments:this.collection.toJSON()}))},e}(Backbone.View),Application.Views.TweetView=function(t){function e(){return this.render=o(this.render,this),this.initialize=o(this.initialize,this),e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.el="#tweets",e.prototype.template=JST.recent_tweets,e.prototype.initialize=function(){return this.collection.on("all",this.render)},e.prototype.render=function(){return this.$el.html(this.template({tweets:this.collection.toJSON()}))},e}(Backbone.View),t=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return n(e,t),e.prototype.routes={":year/:month/:day/:slug/":"post",":slug/":"page","":"index"},e.prototype.post=function(t,e,n,o){var i,r;return i=new Application.Models.Post({id:t+"/"+e+"/"+n+"/"+o}),Application.posts.add(i),r=new Application.Views.Single({model:i}),i.fetch({error:this.redirect}),this.setNav("")},e.prototype.page=function(t){var e,n;return e=new Application.Models.Page({id:t}),Application.pages.add(e),n=new Application.Views.Single({model:e}),e.fetch({error:this.redirect}),this.setNav(t.replace("/",""))},e.prototype.index=function(){var t;return t=new Application.Views.Index({collection:Application.posts}),Application.posts.fetch({error:this.redirect,success:function(){return t.render()}}),this.setNav("home")},e.prototype.redirect=function(){return document.location=Application.url+"/"+Backbone.history.fragment},e.prototype.setNav=function(t){return $(".nav .active").removeClass("active"),$(".nav #"+t).addClass("active")},e}(Backbone.Router),Application.posts=new Application.Collections.Posts,Application.pages=new Application.Collections.Pages,Application.router=new t,Backbone.history.start({pushState:!0,silent:!0}),jQuery(document).ready(function(){return $('a[href^="{{ site.url }}/"]').live("click",function(t){return t.preventDefault(),Application.router.navigate($(this).attr("href").replace("{{ site.url }}/",""),!0),!1}),window.resume_resize=function(){return $(".page-resume .bar").height($(".content").height()-25)},$(window).resize(resume_resize),resume_resize()})}).call(this);