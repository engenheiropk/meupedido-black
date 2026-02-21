export default async function handler(req, res) {
    // CORS - Permite acesso do frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Apenas GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    // Validação
    if (!id) {
        return res.status(400).json({ error: 'ID da transação ausente (transactionId)' });
    }

    // A API Key vem das variáveis de ambiente da Vercel (SEGURA!)
    const apiKey = process.env.BLACKCAT_API_KEY;

    if (!apiKey) {
        console.error('BLACKCAT_API_KEY não configurada');
        return res.status(500).json({ error: 'API Key não configurada no servidor' });
    }

    try {
        const response = await fetch(`https://api.blackcatpagamentos.online/api/sales/check/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            }
        });

        const data = await response.json();

        // Log para debug (aparece no dashboard da Vercel)
        console.log('Verificação PIX:', id, 'Status:', data.data?.status || 'N/A');

        return res.status(response.status).json(data);

    } catch (error) {
        console.error('Erro ao verificar PIX:', error);
        return res.status(500).json({ error: 'Erro interno ao consultar pagamento' });
    }
}
