<meta property="og:type" content= "website" />
<#if contextURL??>
    <meta property="og:url" content="${contextURL}"/>
<   meta property="og:image" itemprop="image primaryImageOfPage" content="${contextURL}/res/img/apple-touch-icon-114x114.png" />
</#if>
<meta property="og:site_name" content="${message("main.title")}" />
<script src="${url.context}/res/js/thirdparty/require.js" data-main="ws/call/call-detail.js"></script>
<link href="${url.context}/res/css/select2.css" rel="stylesheet">