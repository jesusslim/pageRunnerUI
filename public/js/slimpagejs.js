<!-- page js start here -->
	function SlimPageMain() {
		this.PAGE = 1;//当前第几页 | page now
		this.PAGE_SIZE = 20;//每页数据条数 | pagesize
		this.PAGES = 1;//总页数 | how many pages 
		this.Params = new Object();//其他参数 | other params in get url
		this.Url = "";//链接地址
		this.getPage = function(){
			return this.PAGE;
		};
		this.setPage = function(page){
			this.PAGE = page;
		};
		this.getPageSize = function(){
			return this.PAGE_SIZE;
		};
		this.setPageSize = function(pagesize){
			this.PAGE_SIZE = pagesize;
		};
		this.getPages = function(){
			return this.PAGES;
		};
		this.setPages = function(pages){
			this.PAGES = pages;
		};
		this.getParams = function(){
			return this.Params;
		};
		this.setParams = function(paramobj){
			this.Params = paramobj;
		};
		this.getUrl = function(){
			return this.Url;
		};
		this.setUrl = function(url){
			this.Url = url;
		};
		/**
		 * [init 初始化]
		 * @param  {[type]} dom      [需要添加分页区域的元素] | where u wannt to append a page area
		 * @param  {[type]} pagenow  
		 * @param  {[type]} pagesize 
		 * @param  {[type]} pages | how many pages here
		 */
		this.init = function(dom,pagenow,pagesize,pages){
			$("#slimpage").remove();
			$(dom).append("<ul class='pagination' id='slimpage'></ul>");
			this.PAGE = pagenow;
			this.PAGE_SIZE = pagesize;
			this.PAGES = pages;

			var pathName=window.document.location.href;    
			//去除参数以外的URL
			this.Url = pathName.substring(0,pathName.substr(1).lastIndexOf('?')+1).length > 0 ? pathName.substring(0,pathName.substr(1).lastIndexOf('?')+1):pathName ;
			return this;
		};
		/** json对象转url get参数形式 | convert json obj to params string in get url */
		this.json2paramStr = function(jsonObj){
			var str = '';
			var i=0;
			for ( var prm in jsonObj) {
				if(i==0){
					str += "?";
				}else{
					str += "&";
				}
				str += prm + '=' + jsonObj[prm];
				i++;
			}
			return str;
		};
		/** 把当前的params转成url get参数形式 | convert the Params in SlimPage to str for get url */
		this.getParamStr = function(){
			return this.json2paramStr(this.Params);
		};
		/** 显示分页html | show the page html */
		this.showPage = function(){
			if($("#slimpage").length == 0){
				alert("请添加#slimpage元素");
				return false;
			}
			$("#slimpage").addClass("pagination");
			var page = this.PAGE;
			var pages = this.PAGES;
			var html="";
			var i=0;
			var p=0;
			if(page > 1){
				html += "<li><a class='jump' p='"+(page-1)+"'><<</a></li>";
			}
			html += "<li><a class='jump p1' p='"+1+"'>1</a></li>";
			for(i=1;i<5&&i<pages;i++){
				p=(i+1);
				html += "<li><a class='jump p"+p+"' p='"+p+"'>"+p+"</a></li>";
			}
			if(page-5 > 5){
				html+="<li><a>...</a></li>";
			}
			$("#slimpage").append(html);
			html="";
			for(i=page-5;i<=page+5;i++){
				p=i;
				if($(".p"+i).length==0 && p<=pages && p>0){
					html += "<li><a class='jump p"+p+"' p='"+p+"'>"+p+"</a></li>";
				}
			}
			if(page+5 < pages-5){
				html+="<li><a>...</a></li>";
			}
			$("#slimpage").append(html);
			html="";
			for(i=pages-4;i<=pages;i++){
				p=i;
				if($(".p"+i).length==0 && p>=1){
					html += "<li><a class='jump p"+p+"' p='"+p+"'>"+p+"</a></li>";
				}
			}
			if(page < pages){
				html += "<li><a class='jump' p='"+(page+1)+"'>>></a></li>";
			}
			$("#slimpage").append(html);
			$(".p"+page).parent().addClass("active");
			$("#slimpage .jump").click(function(){
				SlimPage.Params.page = $(this).attr("p");
				window.location.href = SlimPage.Url + SlimPage.getParamStr();
			});
		};
	}
	var SlimPage = new SlimPageMain();
<!-- end page js -->
