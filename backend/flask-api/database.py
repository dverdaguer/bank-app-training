from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:dverdaguer@localhost:3306/bank_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)