<html>
    <body>
        <i class="icon-spinner icon-spin icon-2x"></i>
        <form method="post" id="mainForm" action="${spidURL}">
            <input type="hidden" name="RelayState" value="${RelayState}">
            <input type="hidden" name="SAMLRequest" value="${SAMLRequest}">
        </form>
    </body>
</html>