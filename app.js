var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var Campground=require("./models/campground");
var User=require("./models/user");
var seedDB=require("./seed")
var Comment=require("./models/comment")
var methodOverRide=require("method-override");


mongoose.connect("mongodb://localhost/YelpCamp");
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(express.static("images"));
app.use(methodOverRide("_method"));
app.use(bodyparser.urlencoded({extended:true}));
//seedDB();

app.use(require("express-session")({
	secret:"Rusty is the best dog",
	resave:false,
	saveUninitialized:false
}));

passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Campground.create({
// 	name:"Simon Creek",
// 	description:"This is the campground that i am trying to add",
// 	image:"data:image/jpeg;base64,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"
// },function(err,campground){
// 	if(err)
// 	{
// 		console.log(err);
// 	}
// 	else
// 	{
// 		console.log("New Campground Created");
// 		console.log(campground);
// 	}
// });

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});


app.get("/",function(req,res){
   res.render("landing"); 
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}),function(req,res){

});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
    var newuser=new User({username:req.body.username});
   User.register(newuser,req.body.password,function(err,user){
       if(err)
       {
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/campgrounds");
       });
   });
});

app.get("/campgrounds",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("index",{campgrounds:allCampgrounds,currentUser:req.user});
		}
	})
});

app.get("/campgrounds/new",isLoggedIn,function(req,res){
	res.render("new");
})

app.post("/campgrounds",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var newCampground={name:name,image:image,description:description};
	Campground.create(newCampground,function(err,campground){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/campgrounds");
		}
	})

});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
		if(err)
		{
			res.redirect("/campgrounds");
		}
		else
		{
			res.render("show",{campground:campground});
		}
	})
});

app.get("/campgrounds/:id/comments/newComment",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,(function(err,campground){
		if(err)
		{
			res.redirect("/campgrounds");
		}
		else
		{
			res.render("newComment",{campground:campground});
		}
	}));
})

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,(function(err,campground){
		if(err)
		{
			res.redirect("/campgrounds");
		}
		else
		{
			var author=req.user.username;
			var text=req.body.text;
			var obj={
				author:author,
				text:text
			};
			Comment.create(obj,function(err,comment){
                   if(err)
                   {
                       console.log(err);
                   }
                   else
                   {
                       campground.comments.push(comment);
                       campground.save();
                       console.log("Created new comment");
                       res.redirect("/campgrounds/"+req.params.id);
                   }
               });
		}
	}));
})

app.get("/campgrounds/:id/edit",function(req,res){
//	 if(req.isAuthenticated()){

		Campground.findById(req.params.id,function(err,foundCampground){		
			// if(err){
			// 	res.redirect("/campgrounds");
			// }else{
			// 	 console.log(foundCampground.author.username);
			// 	 console.log(req.user._id);
				res.render("Edit",{campground : foundCampground});
			 //}
		});
		// }
		// else{
		// 	console.log("You need to be logged in");
		// 	res.send("you need to be logged in");
		// }
	
	
})

app.put("/campgrounds/:id",function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground , function(err,updatedCampground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

app.delete("/campgrounds/:id",function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})

})

app.listen(2806,function(){
	console.log("Yelcamp!!");
})