{
	"esito" : ${esito?string},
	<#if email??>
	"email": "${email}",
	</#if>
	"nominativo": "${nominativo}",
	"bando": "${bando}",
	"cmis:objectId" : "${applicationTargetId}"
}