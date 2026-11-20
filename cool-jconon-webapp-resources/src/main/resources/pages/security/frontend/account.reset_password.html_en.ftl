<html>
<body>
<p>Dear <b>${account.fullName}</b>,
we have received a request to change the password of your User Name: <b>${account.userName}</b></p>

<p>If you made this request, open the following link and choose your new password:</p>

<p><a href="${url}/reset-password?userid=${account.userName?url('UTF-8')}&pin=${account.pin}">${url}/reset-password?userid=${account.userName?url('UTF-8')}&pin=${account.pin}</a></p>

<p>The link remains valid until the password is changed.</p>

<p>If you did not request a password change, another user probably sent this request by mistake:
ignore this email and no change will be made to your account.</p>
<hr/>
<p>This message was generated automatically. Please do not reply.</p>
</body>
</html>
