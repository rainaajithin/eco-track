import sqlite3

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Table 1: Track daily website usage
    cursor.execute('''CREATE TABLE IF NOT EXISTS usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        mb_used REAL,
        co2_grams REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Table 2: Store user settings (like the Budget)
    cursor.execute('''CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value REAL
    )''')
    
    # Set a default budget of 500MB
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('daily_budget', 500.0)")
    
    conn.commit()
    conn.close()
    print("Database and Tables Created Successfully!")

if __name__ == "__main__":
    init_db()