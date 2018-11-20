//object是否为空对象
function obj_len(obj){
	var len=0;
	for(o in obj){
		len++
	}
	return len;
}

//object是否为空对象
function obj_is_null(obj){
	for(o in obj){
		return false;
	}
	return true;
}

//去除字符串内所有的空格
function delete_space(text){
	return text.replace(/ /g, "");
}

//添加link和style样式
function insertRule(sheet,selectorText, cssText,position){
	//如果是非IE
	if(sheet.insertRule){
		sheet.insertRule(selectorText+"{"+cssText+"}",position);
	//如果是IE
	}else if(sheet.addRule){
		sheet.addRule(selectorText,cssText,position);
	}
}

//删除link和style样式
function deleteRule(sheet,index){
	//如果是非IE
	if(sheet.deleteRule){
		sheet.deleteRule(index);
	//如果是IE
	}else if(sheet.removeRule){
		sheet.removeRule(index);
	}
}

//动态加载样式
function loadStyles(url) {
	var link = document.createElement('link');
	link.rel='stylesheet';
	link.type='text/css';
	link.href=url;
	document.getElementsByTagName('head')[0].appendChild(link);
	return link;
}

//选择指定的link
function select_sheet(href){
	if(href === undefined){
		href = 'dynamicStyle.css';
	}
	var sheets=document.styleSheets;
	var returnSheet;
	//遍历style和link文件
	$.each(sheets, function(index,sheet) {
		if(sheet.href != null){
			var slash_index = sheet.href.lastIndexOf('/');
			var css_index = sheet.href.lastIndexOf('.css');
			//只有目标link能进入
			if(href == sheet.href.substring(slash_index+1) || href == sheet.href.substring(slash_index+1,css_index)){
				returnSheet = sheet;
				var rules=sheet.cssRules || sheet.rules;
				return false;
			}
		};
	});
	return returnSheet;
}

//查看css样式(不包括（，）复合元素)
function select_css(sheet,selectorText,attr,value){
	var obj = new Object();
	var rules=sheet.cssRules|| sheet.rules;
	var flag = false;
	//遍历样式表
	$.each(rules, function(rule_index,rule){
		//去除复合的规则
		if(rule.selectorText.indexOf(',')<0){
			//筛选指定的selectorText
			if(rule.selectorText == selectorText){
				//查找css样式
				if(value === undefined){
					var test = rule.cssText;
					var trim_test = $.trim(test.substring(test.indexOf('{')+1,test.indexOf('}')));
					var split = trim_test.split(';');
//					去除数组中为空的数
					if(split[split.length-1] == ''){
						split.pop();
						
					}
					//遍历属性组
					$.each(split,function(split_index,split_value){
						var arr =  split_value.split(':'),
							split_attr = $.trim(arr[0]),
							split_value = $.trim(arr[1]);
//								console.log(split_attr)
//								console.log(split_value)
//							指定属性 返回属性值
							if(attr == split_attr){
								obj = split_value;
								console.log(obj)
								return obj;
//							不指定属性 返回对象（含所有属性）
							}else if(attr === undefined){
								obj[split_attr] = split_value;
							}
					});
				//更改css样式
				}else{
					//如果结尾有冒号则去除冒号
					indexValue = value.indexOf(';');
					if(indexValue > -1){
						value = value.substring(0,indexValue);
					}
					rule.style[attr] = value;
					flag = true;
					return false;
				}
			}
		}
	});
	
	//查找css样式
	if(value === undefined){
		return obj;
	//更改css样式
	}else{
		//如果没有对应的样式表则创建
		if(flag == false){
			insertRule(sheet,selectorText,attr+':'+value);
		}
	}
}

// 判断图片加载的函数
function isLoaded(target,callback){
	if(typeof isLoad == 'undefined'){
		isLoad =true,
		t_img=null;
	}
    // 注意我的图片类名都是cover，因为我只需要处理cover。其它图片可以不管。
    // 查找所有封面图，迭代处理
    $(target).each(function(){
        // 找到为0就将isLoad设为false，并退出each
        if(this.complete === false){
            isLoad = false;
            //退出循环
            return false;
        }
    });
    // 为true，没有发现为0的。加载完毕
    if(isLoad){
        clearTimeout(t_img); // 清除定时器
        // 回调函数
        callback();
    // 为false，因为找到了没有加载完成的图，将调用定时器递归
    }else{
    	isLoad = true;
        var t_img = setTimeout(function(){
            isLoaded(target,callback); // 递归扫描
//          arguments.callee(target,callback) //报错：too much recursion
        },500); // 我这里设置的是500毫秒就扫描一次，可以自己调整
    }
}

//垂直居中
function vertical_center(object,target,width,widthValue){
	if(typeof width != undefined){
		if($(window).width()<width){
			$(object).css('margin-top',widthValue);
			return 0;
		}
	}
	if($(target) == null){
		$(object).css('margin-top',($(object).parent().height()-$(object).height())/2);
		
	}else{
		$(object).css('margin-top',($(target).height()-$(object).height())/2);
	}
}