export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.BLACKCAT_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API Key não configurada no servidor' });

  const { action, transactionId, customerName, customerCpf, customerEmail, customerPhone, amount, externalRef } = req.body;

  // --- CHECK PIX ---
  if (action === 'check') {
    if (!transactionId) return res.status(400).json({ error: 'ID da transação ausente' });
    try {
      const response = await fetch(`https://api.blackcatpagamentos.online/api/sales/check/${transactionId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey }
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  // --- CREATE PIX ---
  if (!customerName || !customerCpf || !amount) {
    return res.status(400).json({ error: 'Dados incompletos' });
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
        items: [{ title: 'mtx2027', unitPrice: amount, quantity: 1, tangible: false }],
        customer: {
          name: customerName,
          email: customerEmail || 'ofertatop@chora.com',
          phone: customerPhone || '5545988978675',
          document: { number: customerCpf, type: 'cpf' }
        },
        pix: { expiresInDays: 1 },
        externalRef: externalRef || 'NEO-' + Date.now()
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Erro de processamento' });
  }
}
