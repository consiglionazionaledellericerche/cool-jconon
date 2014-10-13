{
	<#if error?? >
		"status": ${status},
		"error": "${jsonUtils.encodeJSONString(error)}"
	<#else>
		"status": ${status}
	</#if>
}