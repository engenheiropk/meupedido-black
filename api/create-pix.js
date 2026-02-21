export default async function handler(req, res) {
  // CORS - Permite acesso do Shopify
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerName, customerCpf, customerEmail, customerPhone, amount, externalRef } = req.body;

  // Validação
  if (!customerName || !customerCpf || !amount) {
    return res.status(400).json({ error: 'Dados incompletos: nome, CPF e valor são obrigatórios' });
  }

  // A API Key vem das variáveis de ambiente da Vercel (SEGURA!)
  const apiKey = process.env.BLACKCAT_API_KEY;

  if (!apiKey) {
    console.error('BLACKCAT_API_KEY não configurada');
    return res.status(500).json({ error: 'API Key não configurada no servidor' });
  }

  try {
    const response = await fetch('https://api.blackcatpagamentos.online/api/sales/create-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'BRL',
        paymentMethod: 'pix',
        items: [
          {
            title: 'Ofertinha',
            unitPrice: amount,
            quantity: 1,
            tangible: false
          }
        ],
        customer: {
          name: customerName,
          email: customerEmail || 'ofertatop@chora.com',
          phone: customerPhone || '5545988978675',
          document: {
            number: customerCpf,
            type: 'cpf'
          }
        },
        pix: {
          expiresInDays: 1
        },
        externalRef: externalRef || 'NEO-' + Date.now()
      })
    });

    const data = await response.json();
    
    // Log para debug (aparece no dashboard da Vercel)
    console.log('PIX criado:', data.data?.transactionId || 'erro');
    
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    return res.status(500).json({ error: 'Erro interno ao processar pagamento' });
  }
}
