import databases
import sqlalchemy

from api.config import config

metadata = sqlalchemy.MetaData()

user_table = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("logtoid", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True),
    sqlalchemy.Column("name", sqlalchemy.String),
)

DATABASE_URL = config.DATABASE_URL
DB_FORCE_ROLL_BACK = config.DB_FORCE_ROLL_BACK

engine = sqlalchemy.create_engine(DATABASE_URL)

metadata.create_all(engine)

database = databases.Database(DATABASE_URL, force_rollback=DB_FORCE_ROLL_BACK, min_size=1, max_size=5)
