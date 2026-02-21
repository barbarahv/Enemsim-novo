# Configuração de SMS (Twilio)

Para que o envio de SMS funcione de verdade, você precisa criar uma conta no Twilio (pode ser a gratuita de teste).

1.  Acesse: [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio) e crie sua conta.
2.  No painel (Console), você verá:
    *   **Account SID**
    *   **Auth Token**
    *   **My Twilio Phone Number** (Você precisa "comprar" um número gratuito de teste lá).
3.  Abra o arquivo `.env` na pasta `backend` e preencha:

```env
TWILIO_ACCOUNT_SID=cole_aqui_o_sid
TWILIO_AUTH_TOKEN=cole_aqui_o_token
TWILIO_PHONE_NUMBER=cole_aqui_o_numero_completo_com_+
```

**Importante:** Na conta de teste gratuita do Twilio, você só pode enviar SMS para **números verificados** (o seu próprio número que você usou no cadastro). Para enviar para qualquer pessoa, é preciso fazer o upgrade da conta (pago).
