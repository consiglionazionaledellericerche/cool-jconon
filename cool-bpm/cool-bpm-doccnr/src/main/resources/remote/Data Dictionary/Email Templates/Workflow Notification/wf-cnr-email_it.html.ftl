<html>
   <head>
      <style type="text/css"><!--
      body
      {
         font-family: Arial, sans-serif;
         font-size: 14px;
         color: #4c4c4c;
      }
      
      a, a:visited
      {
         color: #0072cf;
      }
      --></style>
   </head>
   
   <body bgcolor="#dddddd">
      <table width="100%" cellpadding="20" cellspacing="0" border="0" bgcolor="#dddddd">
         <tr>
            <td width="100%" align="center">
               <table width="70%" cellpadding="0" cellspacing="0" bgcolor="white" style="background-color: white; border: 1px solid #aaaaaa;">
                  <tr>
                     <td width="100%">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                           <tr>
                              <td style="padding: 10px 30px 0px;">
                                 <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                       <td>
                                          <table cellpadding="0" cellspacing="0" border="0">
                                             <tr>
                                                <td>
                                                   <div style="font-size: 22px; padding-bottom: 4px;">
                                                      <#if args.tipologiaNotifica == 'scadenzaFlusso'>
                                                         Avviso di Scadenza ${args.workflowDefinitionName}
                                                      <#else>
                                                        <#if args.tipologiaNotifica == 'notificaEvento'>
                                                           Avviso di Notifica per Flusso ${args.workflowDefinitionName}
                                                        <#else>
                                                          <#if args.tipologiaNotifica == 'flussoCompletato'>
                                                             Avviso di Completamento Flusso ${args.workflowDefinitionName}
                                                          <#else>
                                                            <#if args.workflowPooled == true>
                                                               Un nuovo compito è stato assegnato al gruppo ${args.groupAssignee}
                                                            <#else>
                                                               Le è stato assegnato un compito
                                                            </#if>
                                                          </#if>
                                                        </#if>
                                                      </#if>
                                                   </div>
                                                   <div style="font-size: 13px;">
                                                      ${date?datetime?string.full}
                                                   </div>
                                                </td>
                                             </tr>
                                          </table>
                                          <div style="font-size: 14px; margin: 12px 0px 24px 0px; padding-top: 10px; border-top: 1px solid #aaaaaa;">
                                             <p>Salve,</p>
                                             <p>
                                                 <#if args.tipologiaNotifica == 'scadenzaFlusso'>
                                                   Il seguente compito per il flusso: "${args.workflowDefinitionName}" risulta scaduto
                                                 <#else>
                                                   <#if args.tipologiaNotifica == 'notificaEvento'>
                                                     Il seguente flusso: "${args.workflowDefinitionName}" risulta in stato: nomeStato "${args.nomeStato}"
                                                   <#else>
                                                     <#if args.tipologiaNotifica == 'flussoCompletato'>
                                                       Il seguente flusso: "${args.workflowDefinitionName}" risulta completato
                                                     <#else>
                                                       <#if args.workflowPooled == true>
                                                         Il seguente compito per il flusso: "${args.workflowDefinitionName}" è disponibile per essere seguito:
                                                       <#else>
                                                         Le è stato assegnato il seguente compito per il flusso: "${args.workflowDefinitionName}"
                                                       </#if>
                                                     </#if>
                                                   </#if>
                                                 </#if>
                                             </p>
                                             
                                             <p><b>"${args.workflowTitle}"</b></p>
                                             
                                             <p>
                                               <#if (args.comment)??>il compito assegnato presenta la seguente nota di commento:
                                                     <br>"<i>${args.comment}</i>"<br>
                                               </#if>
                                             </p>
                                             <p>
                                                <#if (args.workflowDueDate)??>Data di Scadenza:&nbsp;&nbsp;<b>${args.workflowDueDate?date?string.full}</b><br></#if>
                                                <#if (args.workflowPriority)??>
                                                   Priorità:&nbsp;&nbsp;
                                                   <b>
                                                   <#if args.workflowPriority == 1>
                                                      Media
                                                   <#elseif args.workflowPriority == 3>
                                                      Importante
                                                   <#else>
                                                      Critica
                                                   </#if>
                                                   </b>
                                                </#if>
                                             </p>
                                             
                                             <#if (args.workflowDocuments)??>
                                                <table cellpadding="0" callspacing="0" border="0" bgcolor="#eeeeee" style="padding:10px; border: 1px solid #aaaaaa;">
                                                   <#list args.workflowDocuments as doc>
                                                      <tr>
                                                         <td>
                                                            <table cellpadding="0" cellspacing="0" border="0">
                                                               <tr>
                                                                  <td>
                                                                     <table cellpadding="2" cellspacing="0" border="0">
                                                                        <tr>
                                                                           <td><b>${doc.name}</b></td>
                                                                        </tr>
                                                                        <tr>
                                                                           <td>Clicca su questo link per scaricare il documento:</td>
                                                                        </tr>
                                                                        <tr>
                                                                           <td>
                                                                              <a href="${shareUrl}/proxy/alfresco/api/node/content/workspace/SpacesStore/${doc.id}/${doc.name}?a=true">
                                                                              ${shareUrl}/proxy/alfresco/api/node/content/workspace/SpacesStore/${doc.id}/${doc.name}?a=true</a>
                                                                           </td>
                                                                        </tr>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                            </table>
                                                         </td>
                                                      </tr>
                                                      <#if doc_has_next>
                                                         <tr><td><div style="border-top: 1px solid #aaaaaa; margin:12px;"></div></td></tr>
                                                      </#if>
                                                   </#list>
                                                </table>
                                             </#if>
                                             <#if args.tipologiaNotifica != 'compitoAssegnato'>
                                                   <p><a href="${args.serverPath}">${args.serverPath}</a>
                                             <#else>
                                               <#if args.workflowLinks == true>
                                                   <#if args.workflowPooled == true>
                                                       <p>Clicca su questo link per visualizzare il compito:</p>
                                                       <p><a href="${shareUrl}/page/task-details?taskId=${args.workflowId}">${shareUrl}/page/task-details?taskId=${args.workflowId}</a>
                                                   <#else>
                                                       <p>Clicca su questo link per modificare il compito:</p>
                                                       <p><a href="${shareUrl}/page/task-edit?taskId=${args.workflowId}">${shareUrl}/page/task-edit?taskId=${args.workflowId}</a>
                                                   </#if>
                                               </#if>
                                               <#if args.workflowLink == true>
                                                   <p>Per visualizzare il compito cliccare sul seguente link :</p>
                                                   <p><a href="${args.serverPath}">${args.serverPath}</a>
                                               </#if>
                                             </#if>
                                             <p>Cordiali saluti,<br />
                                             Flussi Documentali CNR</p>
                                          </div>
                                       </td>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                           <tr>
                              <td>
                                 <div style="border-top: 1px solid #aaaaaa;">&nbsp;</div>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>