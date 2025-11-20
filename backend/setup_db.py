"""
Database setup for AIVORA
Creates MySQL tables and initializes database
"""

import MySQLdb
import MySQLdb.cursors
import os
from datetime import datetime

# MySQL connection parameters
HOST = 'localhost'
USER = 'root'
PASSWORD = 'root'
DATABASE = 'aivora_db'

def create_database():
    """Create database if it doesn't exist"""
    try:
        conn = MySQLdb.connect(
            host=HOST,
            user=USER,
            passwd=PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DATABASE}")
        cursor.execute(f"USE {DATABASE}")
        conn.commit()
        print("✅ Database created/verified")
        return conn
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return None

def create_tables(conn):
    """Create all necessary tables"""
    cursor = conn.cursor()
    
    tables = [
        # Users table
        """CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )""",
        
        # Notes table
        """CREATE TABLE IF NOT EXISTS notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255),
            content LONGTEXT,
            summary LONGTEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )""",
        
        # Quizzes table
        """CREATE TABLE IF NOT EXISTS quizzes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            note_id INT,
            questions LONGTEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
        )""",
        
        # Chat history table
        """CREATE TABLE IF NOT EXISTS chat_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            question TEXT,
            answer LONGTEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )""",
        
        # Progress table
        """CREATE TABLE IF NOT EXISTS progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            notes_created INT DEFAULT 0,
            quizzes_taken INT DEFAULT 0,
            questions_asked INT DEFAULT 0,
            study_streak INT DEFAULT 0,
            avg_score FLOAT DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )"""
    ]
    
    for table in tables:
        try:
            cursor.execute(table)
            conn.commit()
            print("✅ Table created")
        except Exception as e:
            print(f"⚠️  Table already exists or error: {e}")
    
    cursor.close()
    print("✅ All tables created/verified")

def main():
    print("🔧 Setting up AIVORA Database...")
    
    # Create database
    conn = create_database()
    if not conn:
        print("❌ Failed to create database")
        return
    
    # Create tables
    create_tables(conn)
    
    conn.close()
    print("✅ Database setup complete!")

if __name__ == '__main__':
    main()
