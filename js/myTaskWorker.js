var postToParent = function(data){
	self.postMessage(JSON.stringify(data));
};


var callFunction = function(funcScope , params){
	for(var i =funcScope.length - 1  , funcObj = self; i>=0 ; i-- ){
		if(funcObj) funcObj = funcObj[funcScope[i]];  
	}
	if(typeof funcObj === "function") return funcObj.apply(this , params);
};
    
self.onmessage = function(event) {
	var instruction = event.data;
	instruction = JSON.parse(instruction);
	if(instruction["cmd"]==="start"){
		importScripts.apply(self,instruction["data"]);
		postToParent({"cmd" : "func_call" , "scope" : ["logMessage"],"params" : ["Worker establishment done"]});
	}else if(instruction["cmd"]==="func_call"){ // Parent page trying to call worker function
		try{
			var retValue = callFunction(instruction["scope"] , instruction["params"]),
				scope = instruction["scope"].reverse(),
				params = instruction["params"];
			postToParent({"cmd" : "func_call" , "scope" : ["logMessage"],"params" : ["Value for "+scope.join(".")+" for params "+params.join(",")+" = "+retValue]});
		}catch(err){
		}
		
	}
};