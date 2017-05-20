		window.onload=function(){
				var password=$('#password')
				var phone=$('#phone')
			$('#login').click(function(){
				var password=$('#password').val();
				var phone=$('#phone').val();
				if(phone=="" || phone==null){
						$('.phoneWarn').text("*手机号不能为空！");
						return;
				}else if(password=="" || password==null){
						$('.passwordWarn').text("*密码不能为空！");
						return;
				}else{
						$.post("/users/checkLogin",{"password":password,"phone":phone},function(result){
								if(result.result==1){
										window.location="/users"
								}else{
										$('.phoneWarn').text("*手机号或密码错误！");
								}
						})
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
		}