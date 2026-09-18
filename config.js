const CONFIG = {
  // Telegram Bot
  telegramBotToken: '8813734294:AAHiumNTKCD4YWZS2jq5lBjHFtFbjwtzmYk',
  telegramChatId: '7808815199',
  
  // Fungsi kirim pesan ke Telegram
  kirimKeTelegram: async function(pesan) {
    const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.telegramChatId,
          text: pesan,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      });
      return await res.json();
    } catch (err) {
      console.log('Telegram Error:', err);
      return null;
    }
  }
};
