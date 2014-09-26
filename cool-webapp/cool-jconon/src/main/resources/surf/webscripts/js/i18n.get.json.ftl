{
	<#list i18n?keys as prop>
	"${jsonUtils.encodeJSONString(prop)}" : "${jsonUtils.encodeJSONString(i18n[prop])}",
	</#list>
	"locale" : "${locale_suffix}"
}