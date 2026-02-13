from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, select, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash

db = SQLAlchemy()
favorites_character = Table(
    "favorites_character",
    db.metadata,
    Column("id", db.Integer, primary_key=True),
    Column("user_id", ForeignKey("user.id"), nullable=False),
    Column("character_id", ForeignKey("character.id"), nullable=False)
)


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    characters_favorites: Mapped[list["Character"]] = relationship(
        "Character",
        secondary="favorites_character",
        back_populates="user_character_likes"
    )
    password_hash: Mapped[str] = mapped_column(nullable=False)

    def generate_hash(self, password):
        self.password_hash = generate_password_hash(password).decode("utf-8")

    def check_hash(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "favorites": [character.character_id for character in self.characters_favorites]
        }


class Character(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    character_id: Mapped[int] = mapped_column(nullable=False)
    user_character_likes: Mapped[list["User"]] = relationship(
        "User",
        secondary="favorites_character",
        back_populates="characters_favorites"
    )

    def serialize(self):
        return {
            "id": self.id,
            "character_id": self.character_id,
            "user_character_likes": [user.id for user in self.user_character_likes]
        }
