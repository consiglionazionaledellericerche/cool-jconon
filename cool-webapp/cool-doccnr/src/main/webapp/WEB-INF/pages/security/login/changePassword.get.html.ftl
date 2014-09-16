<#import "/pages/lib/bulkInfo.lib.ftl" as bulkInfoLib/>
<#import "/pages/lib/util.lib.ftl" as utilLib/>
<script type="text/javascript">
$(document).ready(function(){
	<@bulkInfoLib.writeValidator "change_password_form"/>
	<@bulkInfoLib.writeSubmit "change_password_form" "successChangePassword"/>
});
function successChangePassword(data){
	$(location).attr('href','${url.context}/login?userid=${args.userName}');
}
</script>
<div class="content">
	<div class="page-header">
	    <h1>${message('label.page-header.h1')}</h1>
	</div>
	<#if error??>
  		<@utilLib.writeError message(error)/>
  	<#else>
	    <div id="success" class="success-notification"></div>
	    <div id="content-form" class="page-content">
	    	<div>
	      		<div class="intro">${message('label.column6-intro')}</div>
			</div>
	    	<div id="change-password" class="column2-right">
		      	<div class="callout-box applicationpage">
					<form id="change_password_form" name="change_password_form" action="${url.context}/security/change-password" method="post">
						<@bulkInfoLib.writeFieldFromName args.userName "userNameHidden"/>
						<div class="new-line">
							<@bulkInfoLib.writeFieldFromName "" "password"/>
						</div>	
						<div class="new-line">	
							<@bulkInfoLib.writeFieldFromName "" "confirmPassword"/>
						</div>
						<div class="new-line">	
							<@bulkInfoLib.writeFieldFromName "" "changePassword"/>
						</div>	
			  		</form>
			    </div>
	  		</div>
		</div>
	</#if>
</div>