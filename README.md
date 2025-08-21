# Emailer CLI

This is a command-line tool to send bulk emails using a local Excel file for the recipient list.

## Prerequisites

- Node.js (v14 or later)
- npm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd emailer
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1.  Create a `.env` file in the root of the project with your SMTP credentials. You can copy the example file:
    ```bash
    cp .env.example .env
    ```

2.  Edit the `.env` file with your credentials:
    ```
    # SMTP (Gmail, Outlook, etc.)
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-email-password-or-app-key

    # Email sender details
    FROM_NAME="Your Name"
    FROM_EMAIL=your-email@gmail.com
    ```

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
npm start -- --file ./recipients.xlsx \
--dept "Computer Science" \
--subject "Welcome to CS Week" \
--message "Hi, don't miss our upcoming events!"
```

### `recipients.xlsx`

This file contains the list of recipients. It should have the following columns:

- `name`: The name of the recipient.
- `email`: The email address of the recipient.
- `department`: The department of the recipient.

**Note:** `recipients.xlsx` is included in the `.gitignore` file, so it will not be committed to the repository.
