import nodemailer from 'nodemailer';

export async function invoice (req, res) {
    let mailOptions = {
        from: 'your_email@gmail.com',      // Sender's email
        to: 'recipient_email@gmail.com',   // Receiver's email
        subject: 'Bukti Transaksi Pulsa/Paket Data',
        html: `
          <html>
            <head>
              <style>
                .container {
                  font-family: Arial, sans-serif;
                  font-size: 14px;
                  color: #333;
                }
                .header {
                  background-color: #00bfae;
                  padding: 10px;
                  color: white;
                  font-size: 16px;
                  text-align: center;
                }
                .details {
                  margin: 20px;
                }
                .total {
                  margin-top: 15px;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Hai Aza,</h2>
                </div>
                <div class="details">
                  <p>Maaf atas ketidaknyamanan yang kamu alami. Berikut bukti transaksi pulsa/paket data yang telah kamu lakukan:</p>
                  <p><strong>Tanggal:</strong> THURSDAY 17 APRIL 2026</p>
                  <p><strong>Nominal Pulsa:</strong> Rp50.000</p>
                  <p><strong>Metode Pembayaran:</strong> GoPay - Rp49.800</p>
                  <div class="total">
                    <p><strong>Total Pembayaran: Rp49.800</strong></p>
                  </div>
                </div>
                <footer style="text-align: center; padding: 10px; background-color: #f1f1f1;">
                  <p>Terima kasih telah menggunakan layanan kami!</p>
                </footer>
              </div>
            </body>
          </html>
        `
      };
}