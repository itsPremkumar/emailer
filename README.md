# 📧 Bulk Email Sender

This project allows you to send **bulk personalized emails** to recipients listed in an Excel file.  
It supports:

- ✅ Department-based filtering  
- ✅ Multi-line messages (with emojis)  
- ✅ **Bold text** (`**bold**`)  
- ✅ **Clickable links** (`[text](https://url.com)`)  
- ✅ Line breaks preserved  
- ✅ Styled HTML emails with plain text fallback  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone 
cd bulk-email-sender
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
# Gmail or Outlook SMTP user (your email)
SMTP_USER=your-email@gmail.com  

# Your email password or app password (for Gmail use App Password)
SMTP_PASS=your-app-password  

# Display name in the email "From"
FROM_NAME=sproutern  

# Sender email address
FROM_EMAIL=your-email@gmail.com
```

⚠️ For Gmail:

* Enable **2FA** on your Google account.
* Generate an **App Password** under *Google Account → Security → App Passwords*.
* Use that in `SMTP_PASS`.

---

### 4. Prepare Recipients File

Create an Excel file `recipients.xlsx` in the project root.
It must have these columns:

| Name         | Department       | Email                                         |
| ------------ | ---------------- | --------------------------------------------- |
| Prem Kumar   | Computer Science | [prem@example.com](mailto:prem@example.com)   |
| John Doe     | Computer Science | [john@example.com](mailto:john@example.com)   |
| Priya Sharma | IT               | [priya@example.com](mailto:priya@example.com) |

**Note:** `recipients.xlsx` is included in the `.gitignore` file, so it will not be committed to the repository.

---

## Usage

There are two ways to run the emailer:

### 1. Interactive Mode

Run the command without any flags to be prompted for the subject and message:

```bash
npm start
```

### 2. CLI Flags Mode

You can also pass the subject and message directly as flags:

```bash
npx tsx src/index.ts --file recipients.xlsx --dept "Computer Science" --subject "Promotion Update" --message "Hello team!"
```

Or build and run with Node.js:

```bash
npm run build
node dist/index.js --file recipients.xlsx --dept "Computer Science" --subject "Promotion Update" --message "Hello team!"
```

---

## 📝 Message Formatting Guide

* **Bold text:** `**This is bold**` → **This is bold**
* **Links:** `[Open Google](https://google.com)` → [Open Google](https://google.com)
* **Line breaks:** Use `Enter` in your message → converted to `<br/>`

---

## ✅ Example Email Output

**Subject:** Message for Testing Promotion

**Body:**

```
Hello Prem Kumar, 👋

🌟 Greetings from SPROUTERN!!! 🇮🇳  

FAST SELLING!!! HURRY!!!  

Check details here: Click Here
```

---

## ⚠️ Notes

* Gmail limits bulk emails per day (usually ~500). For large campaigns, use a professional SMTP service like **SendGrid / Amazon SES**.
* Make sure your `recipients.xlsx` emails are valid to avoid bounce issues.