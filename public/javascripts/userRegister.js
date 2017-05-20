		window.onload=function(){
			 var username=$('#username')
				var password=$('#password')
				var phone=$('#phone')
				var address=$('#address')
			$('#register').click(function(){
				var username=$('#username').val();
				var password=$('#password').val();
				var phone=$('#phone').val();
				var address=$('#address').val();
				if(username=="" || username==null){
						$('.usernameWarn').text("*用户名不能为空！")
						return;
				}else if(password=="" || password==null){
						$('.passwordWarn').text("*密码不能为空！");
						return;
				}else if(phone=="" || phone==null){
						$('.phoneWarn').text("*手机号不能为空！");
						return;
				}else if(address=="" || address==null){
						$('.addressWarn').text("*地址不能为空！");
						return;
				}else{
						$.post("/users/checkRegister",{"username":username,"password":password,"phone":phone,"address":address},function(result){
								if(result.result==1){
										window.location="/users"
								}else{
										$('.phoneWarn').text("*手机号已注册！");
								}
						})
				}
		})
			username.blur(function(){
				if(username.val()=='' || username == null){
					$('.usernameWarn').text("*用户名不能为空！")
				}else{
					$('.usernameWarn').text("")
				}
			})
			password.blur(function(){
				if(password.val()=='' || password == null){
					$('.passwordWarn').text("*用户名不能为空！")
				}else{
					$('.passwordWarn').text("")
				}
			})
			phone.blur(function(){
				if(phone.val()=='' || phone == null){
					$('.phoneWarn').text("*用户名不能为空！")
				}else{
					$('.phoneWarn').text("")
				}
			})
			address.blur(function(){
				if(address.val()=='' || address == null){
					$('.addressWarn').text("*用户名不能为空！")
				}else{
					$('.addressWarn').text("")
				}
			})
		}