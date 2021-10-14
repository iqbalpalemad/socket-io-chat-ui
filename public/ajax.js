const sendAjax = (url,method,data,token,callback) => {
	const ajaxParams = {url : `http://localhost:5000/${url}`,method: method}
	if(data){
		ajaxParams['data'] = JSON.stringify(data);
	}
	ajaxParams['headers'] = {
		"Content-Type": "application/json"
	}
	if(token != ""){
		ajaxParams['headers']["Authorization"] = `Bearer ${token}`
	}
	$.ajax(ajaxParams).done((data) => {
		callback({result:true,data:data})
	}).fail((data) => {
		callback({result:false})
	})
}