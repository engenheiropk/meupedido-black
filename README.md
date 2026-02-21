# 💳 PIX API - Black Cat Pagamentos

API serverless para gerar pagamentos PIX via Black Cat Pagamentos. Integração pronta para Shopify.

## 🚀 Deploy Rápido

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seuusuario/pix-api-blackcat)

## 📋 Pré-requisitos

- Conta na [Black Cat Pagamentos](https://blackcatpagamentos.online) com API Key
- Conta na [Vercel](https://vercel.com) (grátis)
- Conta no [GitHub](https://github.com) (grátis)

## ⚡ Instalação

### 1. Faça o deploy

Clique no botão **"Deploy with Vercel"** acima ou:

1. Faça fork deste repositório
2. Importe na Vercel
3. Configure a variável de ambiente `BLACKCAT_API_KEY`
4. Deploy!

### 2. Configure a API Key

No dashboard da Vercel:
- Vá em **Settings** → **Environment Variables**
- Adicione: `BLACKCAT_API_KEY` = sua_chave_aqui
- Re-deploy se necessário

### 3. Use no Shopify

No dashboard do tema:
```
URL da API: https://seu-projeto.vercel.app/api/create-pix
```

## 📡 Endpoint

### POST `/api/create-pix`

Gera um PIX de pagamento.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "customerName": "João Silva",
  "customerCpf": "12345678900",
  "customerEmail": "joao@email.com",
  "customerPhone": "5511999999999",
  "amount": 5000,
  "externalRef": "PEDIDO-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TRX123456",
    "status": "PENDING",
    "amount": 5000,
    "qrCode": "000201010212...",
    "qrCodeBase64": "iVBORw0KGgo...",
    "copyPaste": "000201010212..."
  }
}
```

### GET `/api/check-pix?id={transactionId}`

Verifica o status atual de um PIX já criado (útil para liberação de tela após pagamento).

**Query Params:**
- `id` (obrigatório): O `transactionId` retornado na criação.

**Exemplo de Request:**
```
GET /api/check-pix?id=TRX123456
```

**Response (Sucesso):**
```json
{
  "success": true,
  "data": {
    "status": "PAID" // Pode ser PENDING, APPROVED, PAID, etc.
  }
}
```

## 🔒 Segurança

- ✅ API Key armazenada em variável de ambiente (nunca exposta)
- ✅ HTTPS forçado pela Vercel
- ✅ CORS configurado
- ✅ Validação de dados de entrada

## 🐛 Troubleshooting

### Erro "API Key não configurada"
Verifique se a variável `BLACKCAT_API_KEY` está configurada no dashboard da Vercel.

### Erro CORS
A API já tem CORS configurado. Se persistir, verifique se o domínio Shopify está correto.

### Erro 500
Verifique os logs na Vercel: **Deployments** → **Functions** → **Logs**

## 📄 Licença

MIT - Use à vontade!
