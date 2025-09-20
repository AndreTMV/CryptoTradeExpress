from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.db import close_old_connections
from django.contrib.auth import get_user_model

User = get_user_model()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Autentica al usuario en scope['user'] leyendo un JWT de:
      - query string ?token=...
      - Header: Authorization: Bearer <token>
    """

    async def __call__(self, scope, receive, send):
        close_old_connections()
        scope['user'] = AnonymousUser()

        # 1) token por query string
        token = None
        if scope.get("query_string"):
            qs = parse_qs(scope["query_string"].decode())
            if "token" in qs and qs["token"]:
                token = qs["token"][0]

        # 2) token por header Authorization
        if not token:
            for (name, value) in scope.get("headers", []):
                if name == b"authorization":
                    v = value.decode()
                    if v.lower().startswith("bearer "):
                        token = v.split(" ", 1)[1].strip()
                    break

        if token:
            try:
                at = AccessToken(token)
                user_id = at.get("user_id")
                user = await database_sync_to_async(User.objects.get)(id=user_id)
                scope["user"] = user
            except Exception:
                scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
