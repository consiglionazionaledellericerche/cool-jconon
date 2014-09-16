<div class="span11">
  <div class="callout-box center">
    <div class="applicationpage">
      <div id="helpdesk2" >
        <div class="modal-inner-fix" id="risposta"></div>
        <div class="modal-inner-fix" id="allegaFile">
            <#if sendOk=='true'>
				<#if reopenSendOk??>
					<div id="avvisi" class="alert alert-success">
						<strong>
				    		${message('message.reopen.helpdesk.send.success')}
				   		 </strong>
					</div>
				<#else>
				    <div id="avvisi" class="alert alert-success">
				        <strong>
					        ${message('message.helpdesk.send.success')}
				        </strong>
				    </div>
				</#if>
			<#elseif sendOk=='false'>
		        	<div id="avvisi" class="alert alert-error">
		      	      <strong>
		      	    	  	${message('message.helpdesk.send.failed')}
						<br> <br>
		              		${message(jsonUtils.encodeJSONString(message_error))} 
		              </strong>
		          	</div>
	        </#if>
        </div>
      </div>
    </div>
  </div>
</div>
