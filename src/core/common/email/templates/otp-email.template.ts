export const otpEmailTemplate = (
  code: string,
) => `<div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 400px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">

          <h2 style="text-align: center;">NPS.gov</h2>

          <p>Hello!</p>
          <p>Your verification code:</p>

          <div style="
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 20px 0;
          ">
            ${code}
          </div>

          <p>This code is valid for 5 minutes.</p>

          <hr />

          <p style="font-size: 12px; color: gray;">
            If you didn't request this code, just ignore this email.
          </p>
        </div>
      </div>`;
