/*
 * @Author: ClausClaus
 * @Date:   2018-07-14 13:18:40
 * @Last Modified by:   ClausClaus
 * @Last Modified time: 2018-07-14 13:55:41
 */

/**
 * 用户登录并获取Token
 * @return {[type]} [description]
 */
function getToken() {
	var loginUrl = "/login";
	var xhr = new XMLHttpRequest();
	var userElement = document.getElementById("username");
	var passwordElement = document.getElementById("password");
	var tokenElement = document.getElementById("token");
	var user = userElement.value;
	var password = passwordElement.value;

	xhr.open("POST", loginUrl, true);
	xhr.setRequestHeader("Content-Type", "application/json", "charset=UTF-8");
	xhr.addEventListener("load", function(e) {
		var responseObject = JSON.parse(this.response);
		if (responseObject.token) {
			// tokenElement.innerHTML = responseObject.token;
			localStorage.setItem("token", responseObject.token);
		} else {
			tokenElement.innerHTML = "No token received";
		}
	});
	var sendObject = JSON.stringify({ name: user, password: password });
	console.log("going to send", sendObject);
	xhr.send(sendObject);
}

function getSecret() {
	var url = "/secret";
	var xhr = new XMLHttpRequest();
	var tokenElement = document.getElementById("token");
	var resultElement = document.getElementById("result");
	xhr.open("GET", url, true);
	xhr.setRequestHeader(
		"Authorization",
		"Bearer " + localStorage.getItem("token")
	);
	xhr.addEventListener("load", function(e) {
		var responseObject = JSON.parse(this.response);
		resultElement.innerHTML = this.responseText;
	});
	xhr.send(null);
}
