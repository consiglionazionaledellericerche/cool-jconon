<#function mappa key>
	<#switch key>
		<#case "C">
		<#assign ret = "Inviata">
    <#break>
		<#case "I">
		<#assign ret = "Iniziale">
    <#break>
		<#case "P">
		<#assign ret = "Provvisoria">
    <#break>
    	<#case "R">
    	<#assign ret = "Rinuncia">
    <#break>
    	<#case "E">
    	<#assign ret = "Esclusione">
    <#break>
	</#switch>
	<#return ret>
</#function>

<#-- Alcuni bandi hanno nome e cognome come properties multivalue -->
<#macro generatePropertyCMISValue cmisObject propertyId>
<#compress>
	<#if cmisObject.getProperty(propertyId)??>
	<#assign prop = cmisObject.getProperty(propertyId)>
		<#--Metto due campi (indirizzo e numero civico) nello stesso <td></td>-->
		<#if prop.queryName != "jconon_application:num_civico_residenza" && prop.queryName != "jconon_application:num_civico_comunicazioni">
			<td nowrap="nowrap">
		</#if>
		<#if prop.isMultiValued()>
			<#if cmisObject.getPropertyValue(propertyId)??>		
				<#list cmisObject.getPropertyValue(propertyId) as value>
					<#if prop.queryName == "jconon_application:nome" || prop.queryName == "jconon_application:cognome">
						${value?string?upper_case}
					<#elseif prop.type.value() == "string" || prop.type.value() == "id">
						${value?string}
					<#elseif prop.type.value() == "integer">
						${value?string('0')}
					</#if>
				</#list>
			</#if>
		<#else>
			<#if cmisObject.getPropertyValue(propertyId)??>
				<#if prop.queryName == "jconon_application:nome" || prop.queryName == "jconon_application:cognome">
					${cmisObject.getPropertyValue(propertyId)?string?upper_case}
				<#elseif prop.queryName == "jconon_application:stato_domanda" || prop.queryName == "jconon_application:esclusione_rinuncia" >
					${mappa(cmisObject.getPropertyValue(propertyId)?string)}
				<#elseif prop.queryName == "jconon_application:cap_residenza" || prop.queryName == "jconon_application:cap_comunicazioni">
					=TESTO(${cmisObject.getPropertyValue(propertyId)?string};"00000")  
				<#elseif prop.queryName == "jconon_application:telefono_comunicazioni" || prop.queryName == "jconon_application:codice_fiscale">
					=MAIUSC("${cmisObject.getPropertyValue(propertyId)}")
				<#elseif prop.type.value() == "string" || prop.type.value() == "id">
					${cmisObject.getPropertyValue(propertyId)?string}
				<#elseif prop.queryName == "jconon_application:data_nascita">
					${xmldate(prop.value.time)?substring(0,10)}
				<#elseif prop.queryName == "jconon_application:data_domanda">
					<#assign dataDomanda = xmldate(prop.value.time)>
					${dataDomanda?substring(11,16)} - ${dataDomanda?substring(0,10)}
				<#elseif prop.type.value() == "integer">
					${cmisObject.getPropertyValue(propertyId)?string('0')}
				<#elseif prop.type.value() == "boolean">
					<#if prop.value == false>
						NO
					<#elseif prop.value == true>
						SI
					</#if>
				</#if>
			</#if>
		</#if>
		<#--Metto due campi (indirizzo e numero civico) nello stesso <td></td>-->
		<#if prop.queryName != "jconon_application:indirizzo_residenza" && prop.queryName != "jconon_application:indirizzo_comunicazioni">
			</td>
		</#if>
	<#else> <td nowrap="nowrap"></td>
	</#if>
</#compress>
</#macro>



<#macro generateMatricola userName>
	<td nowrap="nowrap">
		<#if matricole[userName]??>${matricole[userName]}</#if>
	</td>
</#macro>

<#macro generatePropertyBando bando>
	<@generatePropertyCMISValue bando "jconon_call:codice"/>	
	<@generatePropertyCMISValue bando "jconon_call:sede"/>
	<@generatePropertyCMISValue bando "jconon_call:elenco_macroaree"/>
	<@generatePropertyCMISValue bando "jconon_call:elenco_settori_tecnologici"/>
</#macro>

<#macro generatePropertyDomande cmisObject>
	<@generateMatricola cmisObject.getPropertyValue("jconon_application:user")/>
		<@generatePropertyCMISValue cmisObject "jconon_application:cognome"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:nome"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:data_nascita"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:sesso"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:nazione_nascita"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:comune_nascita"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:provincia_nascita"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:nazione_residenza"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:provincia_residenza"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:comune_residenza"/>
		<#if cmisObject.getProperty("jconon_application:indirizzo_residenza")??>
			<@generatePropertyCMISValue cmisObject "jconon_application:indirizzo_residenza"/>
			<#if cmisObject.getProperty("jconon_application:num_civico_residenza")??> - <@generatePropertyCMISValue cmisObject "jconon_application:num_civico_residenza"/></#if>
		<#else> <td nowrap="nowrap"></td></#if>
		<@generatePropertyCMISValue cmisObject "jconon_application:cap_residenza"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:codice_fiscale"/>
</#macro>

<#macro generatePropertyDomandeDirettori cmisObject>
		<@generatePropertyCMISValue cmisObject "jconon_application:struttura_cnr"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:titolo_servizio_cnr"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:fl_direttore"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:struttura_altre_amministrazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:titolo_servizio_altre_amministrazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:sede_altra_attivita"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:ruolo_altra_attivita"/>
</#macro>

<#macro generatePropertyDomandeDipendenti cmisObject>
		<@generatePropertyCMISValue cmisObject "jconon_application:profilo"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:struttura_appartenenza"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:settore_scientifico_tecnologico"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:area_scientifica"/>
</#macro>

<#macro generatePropertyAltriCampi cmisObject>
		<@generatePropertyCMISValue cmisObject "jconon_application:email_comunicazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:email_pec_comunicazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:nazione_comunicazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:provincia_comunicazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:comune_comunicazioni"/>
		<#if cmisObject.getProperty("jconon_application:indirizzo_comunicazioni")??>
			<@generatePropertyCMISValue cmisObject "jconon_application:indirizzo_comunicazioni"/>
			<#if cmisObject.getProperty("jconon_application:num_civico_comunicazioni")??> - <@generatePropertyCMISValue cmisObject "jconon_application:num_civico_comunicazioni"/></#if>
		<#else> <td nowrap="nowrap"></td></#if>
		<@generatePropertyCMISValue cmisObject "jconon_application:cap_comunicazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:telefono_comunicazioni"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:data_domanda"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:stato_domanda"/>
		<@generatePropertyCMISValue cmisObject "jconon_application:esclusione_rinuncia"/>
</#macro>

<#if models?? && models?size != 0>	
	<table BORDER=1 CELLPADDING=5 CELLSPACING=0>
		<tr>
			<td>Codice bando</td>
			<td>Struttura di Riferimento</td>
			<td>MacroArea</td>
			<td>Settore Tecnologico</td>
			<td>Matricola</td>
			<td>Cognome</td>
			<td>Nome</td>
			<td>Data di nascita</td>
			<td>Sesso</td>
			<td>Nazione di nascita</td>
			<td>Luogo di nascita</td>
			<td>Prov. di nascita</td>
			<td>Nazione di Residenza</td>
			<td>Provincia di Residenza</td>
			<td>Comune di Residenza</td>
			<td>Indirizzo di Residenza</td>
			<td>CAP di Residenza</td>
			<td>Codice Fiscale</td>
			<td>Struttura CNR</td>
			<td>Ruolo</td>
			<td>Direttore in carica</td>
			<td>Struttura altra PA</td>
			<td>Ruolo altra PA</td>
			<td>Altra Struttura</td>
			<td>Altro Ruolo</td>
			<td>Profilo</td>
			<td>Struttura di appartenenza</td>
			<td>Settore tecnologico di competenza</td>
			<td>Area scientifica di competenza</td>
			<td>Email</td>
			<td>Email PEC</td>
			<td>Nazione Reperibilit&agrave</td>
			<td>Provincia di Reperibilit&agrave</td>
			<td>Comune di Reperibilit&agrave</td>
			<td>Indirizzo di Reperibilit&agrave</td>
			<td>CAP di Reperibilit&agrave</td>
			<td>Telefono</td>
			<td>Data Invio Domanda</td>
			<td>Stato Domanda</td>
			<td>Esclusione/Rinuncia</td>
		</tr>
		<tr></tr>
		<#list models as cmisObject>
			<#assign bandi = relationships["parent"]>
			<#assign idDomanda = cmisObject.getPropertyValue("cmis:objectId")>
			<tr>
				<@generatePropertyBando  bandi[idDomanda]?first/>
				<@generatePropertyDomande cmisObject/>
				<@generatePropertyDomandeDirettori cmisObject/>
				<@generatePropertyDomandeDipendenti cmisObject/>
				<@generatePropertyAltriCampi cmisObject/>
			</tr>
		</#list>
	</table>
</#if>