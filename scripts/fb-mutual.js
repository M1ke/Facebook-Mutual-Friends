var fbMostMutual={
	url:''
	,user:0
	,fbLogin:{scope:''}
	,mostMutual:''
	,get:function(e){
		e.preventDefault();
		$(this).parent().html('In progress&hellip;');
		FB.api('me/friends',function(response){
			var length=response.data.length-1;
			var $count=$('p.count');
			var count=1;
			var largest=0;
			$.each(response.data,function(key,friend){
				FB.api('me/mutualfriends/'+friend.id,function(response2){
					$count.html('Checked '+count+' friends so far&hellip;');
					if (response2.data.length>largest)
					{
						largest=response2.data.length;
						fbMostMutual.mostMutual=friend;
					}
					if (key==length)
					{
						$('p.friends').html('You have '+largest+' friends in common with <a href="http://www.facebook.com/'+mostMutual.id+'" target="_blank">'+fbMostMutual.mostMutual.name+'</a>');
						$count.slideUp();
						$('div.post').fadeIn().find('a.send').text('Send to '+fbMostMutual.mostMutual.name);
					}
					count++;
				});
			});
		});
	}
	,postToFeed:function(send){
		var postBox={
			method:'feed'
			,link:'http://m1ke.me/mutualfriends/'
			,name:'Facebook Mutual Friend Counter'
			,caption:'I discovered I had most friends in common with '+(send?'you':fbMostMutual.mostMutual.name)+'!'
			,description:"A quick app that counts your mutual friend numbers on Facebook, and lets you know the result.\r\nBuilt by M1ke"
		};
		if (send) postBox.to=fbMostMutual.mostMutual.id; 
		FB.ui(postBox,function(response){
			if (response['post_id']>0) $('div.post p:first').text('Thanks for posting!').siblings().fadeOut();
		});
	}
	,getLoginStatus:function(){
		FB.getLoginStatus(function(response){
			if (response.status==='connected')
			{
				fbMostMutual.userLoggedIn();
			}
		});
	}
	,userLoggedIn:function(){
		$('a.fb-login').parent().html('Logged in with Facebook');
		$('p.friends').fadeIn();
	}
};

$(document).ready(function(){
	$('a.fb-login').click(function(){
		var $link=$(this);
		FB.login(function(response){
			fbMostMutual.userLoggedIn();
		},fbMostMutual.fbLogin);
	});
	$('a.fb-post').click(function(){
		fbMostMutual.postToFeed($(this).data('send'));
	});
	$('p.friends a').click(fbMostMutual.get);
	fbFunctionQ.push(fbMostMutual.getLoginStatus);
});