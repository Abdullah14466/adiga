var app = require('express')();
var http = require('http').Server(app);
// var io = require('socket.io')(http);
var io = require('socket.io').listen(http, {'pingTimeout':1000, 'pingInterval':2000});
var net = require('net');

app.get('/', function(req, res){
 
});

var WEBSITE_URL = "http://192.168.1.35/turklerim/";

function get_cur_date_time() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd < 10) {
		dd ='0'+dd;
	} 

	if(mm < 10) {
		mm ='0'+mm;
	} 
	
	// mm = get_turkish_month_name(mm);

	
	var cur_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	
	today = dd+'/'+mm+'/'+yyyy;
	
	return today+"^_^"+cur_time;
}

function make_user_offline(cur_friend_is_offline) {
	
	var temp_date = get_cur_date_time();

	temp_date = temp_date.split("^_^");
	
	var _cur_date = temp_date[0].split("/");
	var cur_date  = _cur_date[2]+"-"+_cur_date[1]+"-"+_cur_date[0];
	var cur_hour  = temp_date[1];

	if(cur_date != "" && cur_hour != "") {
		
		$.post(WEBSITE_URL+"ajax/ajax.logout_last_seen.php",
		{
			cur_date: cur_date,
			cur_hour: cur_hour,
			cur_friend_is: cur_friend_is_offline
		}, function(data){
			
			
		});
		
	}
		
}

/*
function onRequest(request, response) { 
   request.socket.setTimeout(500); 
   request.socket.addListener("timeout", function() { 
      console.log("socket timeout"); 
   }); 
   
}
*/

io.sockets.on('connection', function (socket) {
	
  // console.log(socket.id);	
  
  socket.on('online', function (user_id, friends_list) {
	
	// console.log("I'm the user: "+user_id);
	
	socket.join(user_id);
	
	socket.user_id = user_id;
	 socket.broadcast.emit('my_friend_is_online', {id: user_id});
		

  });
  

  
 
   /*
   socket.on('stream', function (_image, user_id) {
	
	
	 socket.in(user_id).emit('stream', _image);
		

  });
  */
  
   socket.on('online_refresh', function (user_id, friends_list) {
	
	
	 
	 socket.user_id = user_id;
	 socket.broadcast.emit('online_refresh', {id: user_id});
		

  });
  
  
  socket.on('disconnect', function() {
	  
	 // console.log('offline: '+socket.user_id);
	 socket.leave(socket.user_id);
	 
	 socket.broadcast.emit('typing', {from_user_id: socket.user_id, to_user_id: "0", type: "0" });
	 // socket.broadcast.emit('set_msg_as_seen', '', 500, '', '', 0);
	 // socket.broadcast.emit('group_offline', {user_id: socket.user_id});	 
	 socket.broadcast.emit('my_friend_is_offline', {id: socket.user_id, sp: 1});
	 
	 // make_user_offline(socket.user_id);
		
  });
  
  socket.on('new_comment', function(comment_html, post_id, item_type) {
	  socket.broadcast.emit('new_comment', {comment_html: comment_html, post_id: post_id, item_type: item_type});	
	
  });
  
  socket.on('inc_video_views', function(table, id) {
	  socket.broadcast.emit('inc_video_views', {table: table, id: id});	
  });
  
  socket.on('change_chat_settings', function(user_id, cur_new_last_seen_val, new_status) {
	 
	  socket.broadcast.emit('change_chat_settings', {user_id: user_id, cur_new_last_seen_val: cur_new_last_seen_val, new_status: new_status});	
  });
  
  
  
  socket.on('group_msg_seen', function(user_id, page_id, username, cur_date, cur_hour) {
	  
	  socket.broadcast.emit('group_msg_seen', {user_id: user_id, page_id: page_id, cur_date: cur_date, cur_hour: cur_hour, username: username});	
	  
  });
  
   socket.on('send_new_msg_group', function(user_id, group_id, notif_cur_name, notif_cur_profile_pic, notif_cur_profile_url, msg, cur_date, msg_id ) {
	   socket.broadcast.emit('send_new_msg_group', {notif_cur_profile_pic: notif_cur_profile_pic, notif_cur_profile_url: notif_cur_profile_url, notif_cur_name: notif_cur_name, user_id: user_id, group_id: group_id, msg: msg, cur_date: cur_date, msg_id: msg_id});	 
  });
  
   socket.on('group_offline', function(user_id) {
	   
	   // console.log("offline: "+user_id);
	   
	   socket.broadcast.emit('group_offline', {user_id: user_id});	 
  });
  
  socket.on('group_online', function(user_id, group_id, notif_cur_name, notif_cur_profile_pic, notif_cur_profile_url ) {
	  
	  console.log("user: "+user_id);
	  
	   socket.broadcast.emit('group_online', {notif_cur_profile_pic: notif_cur_profile_pic, notif_cur_profile_url: notif_cur_profile_url, notif_cur_name: notif_cur_name, user_id: user_id, group_id: group_id});	 
  });
  
  socket.on('group_online_refresh', function(user_id, group_id, notif_cur_name, notif_cur_profile_pic, notif_cur_profile_url ) {
	   socket.broadcast.emit('group_online_refresh', {notif_cur_profile_pic: notif_cur_profile_pic, notif_cur_profile_url: notif_cur_profile_url, notif_cur_name: notif_cur_name, user_id: user_id, group_id: group_id});	 
  });
  
   socket.on('new_reply', function(comment_html, post_id, item_type) {

	
   
	   socket.broadcast.emit('new_reply', {comment_html: comment_html, post_id: post_id, item_type: item_type});	
	  
  });
  
  
  socket.on('someone_writing_comment', function(notif_cur_profile_pic, notif_cur_profile_url, notif_cur_name, item_type, post_id) {

	  socket.broadcast.emit('someone_writing_comment', {notif_cur_profile_pic: notif_cur_profile_pic, notif_cur_profile_url: notif_cur_profile_url, notif_cur_name: notif_cur_name, item_type: item_type, post_id: post_id});	
	  
  });
  
  socket.on('someone_writing_reply', function(notif_cur_profile_pic, notif_cur_profile_url, notif_cur_name, item_type, post_id) {

	  socket.broadcast.emit('someone_writing_reply', {notif_cur_profile_pic: notif_cur_profile_pic, notif_cur_profile_url: notif_cur_profile_url, notif_cur_name: notif_cur_name, item_type: item_type, post_id: post_id});	
	  
  });
  
  
  socket.on('forceDisconnect', function(user_id, friends_list) {
     // console.log(friends_list); 
	 socket.disconnect();
	 socket.leave(user_id);

	socket.broadcast.emit('typing', {from_user_id: user_id, to_user_id: "0", type: "0" });	 
	// socket.broadcast.emit('set_msg_as_seen', '', user_id, '', '', 0);
	socket.broadcast.emit('group_offline', {user_id: user_id});	 
	socket.broadcast.emit('my_friend_is_offline', {id: user_id, sp: 0});	
	
	// make_user_offline(user_id);
	
	 // io.sockets.in(friends_list[i]).emit('my_friend_is_offline', {id: user_id});	
	 
  });
  
  /*
  socket.on('i_still_online', function (user_id, friends_list) {

	for(var i = 0; i < friends_list.length; i++) {
		io.sockets.in(friends_list[i]).emit('i_still_online', {id: user_id});	
	}
	
  });
  */
  
  socket.on('send_friend_request', function (friend_id, user_id, cur_date, cur_hour, request_user_name, request_user_image, request_user_url, request_id) {

	io.sockets.in(friend_id).emit('send_friend_request', {id: user_id, cur_date: cur_date, cur_hour: cur_hour, request_user_name: request_user_name, request_user_image: request_user_image, request_user_url: request_user_url, request_id: request_id});	
	
  });
  
  socket.on('accept_friend_request', function (friend_id, notification_item_html) {

	io.sockets.in(friend_id).emit('accept_friend_request', {notification_item_html: notification_item_html});	
	
  });
  
   socket.on('visit_profile', function (friend_id, user_id, friend_name, profile_image, profile_url, notifications_date, row_id) {

	// console.log(friend_id);
   
	io.sockets.in(friend_id).emit('visit_profile', {user_id: user_id, friend_name: friend_name, profile_image: profile_image, profile_url: profile_url, notifications_date: notifications_date, row_id: row_id});	
	
  });
  
  socket.on('notif', function (notif_user_id, main_user_id, notif_id, notif_post_id, notif_cur_date, notif_cur_hour, cur_noti_post_type, notif_cur_profile_pic, notif_cur_profile_url, notif_cur_name, table_name, sub_row_id) {
	io.sockets.in(notif_user_id).emit('notif', {main_user_id: main_user_id, notif_id: notif_id, notif_post_id: notif_post_id, notif_cur_date: notif_cur_date, notif_cur_hour: notif_cur_hour, cur_noti_post_type: cur_noti_post_type, notif_cur_profile_pic: notif_cur_profile_pic, notif_cur_profile_url: notif_cur_profile_url, notif_cur_name: notif_cur_name, table_name: table_name, sub_row_id: sub_row_id});	
  });
  
   socket.on('send_new_msg', function (from_user_id, to_user_id, _msg, cur_date, cur_hour, msg_id) {
	io.sockets.in(to_user_id).emit('received_new_msg', {from_user_id: from_user_id, to_user_id: to_user_id, msg: _msg, cur_date: cur_date, cur_hour: cur_hour, msg_id: msg_id});
  });
  
  
  socket.on('typing', function (from_user_id, to_user_id, type) {
	io.sockets.in(to_user_id).emit('typing', {from_user_id: from_user_id, to_user_id: to_user_id, type: type});
  });
  
  socket.on('set_msg_as_seen', function (friend_id, user_id, cur_date, cur_hour, type) {
	  
	  // console.log(cur_hour);
	  
	  // io.sockets.in(friend_id).emit('set_msg_as_seen', {type: 1, friend_id: user_id, cur_date: cur_date, cur_hour: cur_hour });
	  socket.broadcast.emit('set_msg_as_seen', {type: type, friend_id: user_id, cur_date: cur_date, cur_hour: cur_hour, to_user_id: friend_id });
  
  });
  
  
});



http.listen(3000, function(){
  console.log('Welcome Turklerim');
});


// http.listen(process.env.PORT);

